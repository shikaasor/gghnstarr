// scripts/fetch-news.mjs
// Fetches recent AMR articles from arXiv and PubMed, merges, deduplicates,
// and writes content/news.json (sorted newest-first, capped at 200 entries).
// Usage: node scripts/fetch-news.mjs
// Env:   NCBI_API_KEY (optional — omit for 3 req/s rate limit)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEWS_JSON_PATH = path.join(__dirname, '../content/news.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(NEWS_JSON_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

const MONTH_MAP = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

/**
 * Normalise PubMed pubdate strings to YYYY-MM-DD.
 * Handles: "2026 May", "2026 Apr 15", "2026", "2026 Apr-Jun"
 */
function normalizePubDate(pubdate) {
  if (!pubdate) return '1970-01-01';
  const s = pubdate.trim();

  // "2026 Apr 15" or "2026 May 3"
  const fullMatch = s.match(/^(\d{4})\s+([A-Za-z]{3})\s+(\d{1,2})$/);
  if (fullMatch) {
    const y = fullMatch[1];
    const m = String(MONTH_MAP[fullMatch[2]] ?? 1).padStart(2, '0');
    const d = String(parseInt(fullMatch[3], 10)).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // "2026 Apr" or "2026 Apr-Jun" (take first month)
  const monthMatch = s.match(/^(\d{4})\s+([A-Za-z]{3})/);
  if (monthMatch) {
    const y = monthMatch[1];
    const m = String(MONTH_MAP[monthMatch[2]] ?? 1).padStart(2, '0');
    return `${y}-${m}-01`;
  }

  // "2026"
  const yearMatch = s.match(/^(\d{4})$/);
  if (yearMatch) return `${yearMatch[1]}-01-01`;

  return '1970-01-01';
}

// ---------------------------------------------------------------------------
// arXiv fetcher
// ---------------------------------------------------------------------------

async function fetchArxiv() {
  try {
    const query = encodeURIComponent(
      'ti:"antimicrobial resistance" OR ti:"antibiotic resistance" OR abs:"antimicrobial resistance" OR abs:"antibiotic resistance"'
    );
    const url =
      `https://export.arxiv.org/api/query?search_query=${query}` +
      `&sortBy=submittedDate&sortOrder=descending&max_results=100`;

    console.log('Fetching arXiv...');
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`arXiv responded with ${res.status} — skipping`);
      return [];
    }
    const xml = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);
    const rawEntries = parsed?.feed?.entry ?? [];
    const entries = Array.isArray(rawEntries) ? rawEntries : [rawEntries];

    const articles = entries.map((entry) => {
      const rawId = entry.id ?? '';
      const arxivId = rawId.split('/abs/')[1]?.replace(/v\d+$/, '') ?? rawId;

      // Authors: entry.author can be object or array
      const rawAuthors = entry.author;
      let firstAuthor = '';
      let authorCount = 0;
      if (Array.isArray(rawAuthors)) {
        firstAuthor = rawAuthors[0]?.name ?? '';
        authorCount = rawAuthors.length;
      } else if (rawAuthors?.name) {
        firstAuthor = rawAuthors.name;
        authorCount = 1;
      }
      const authors = authorCount > 1 ? `${firstAuthor} et al.` : firstAuthor;

      const publishedDate = (entry.published ?? '').slice(0, 10);
      const journal = entry['arxiv:primary_category']?.['@_term'] ?? '';
      const abstract = (entry.summary ?? '').replace(/\s+/g, ' ').trim();
      const title = (entry.title ?? '').replace(/\s+/g, ' ').trim();

      return {
        id: arxivId,
        source: 'arXiv',
        title,
        authors,
        publishedDate,
        journal,
        abstract,
        url: `https://arxiv.org/abs/${arxivId}`,
      };
    });

    console.log(`arXiv: fetched ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.warn('arXiv fetch failed:', err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// PubMed fetcher (ESearch + ESummary + EFetch)
// ---------------------------------------------------------------------------

async function fetchPubmed() {
  try {
    const apiKey = process.env.NCBI_API_KEY ?? '';
    const apiParam = apiKey ? `&api_key=${apiKey}` : '';

    // Step 1: ESearch — find recent article IDs
    console.log('Fetching PubMed ESearch...');
    const searchUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
      `?db=pubmed&term=antimicrobial+resistance[tiab]+OR+antibiotic+resistance[tiab]` +
      `&datetype=pdat&reldate=14&retmax=200&retmode=json${apiParam}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      console.warn(`PubMed ESearch responded with ${searchRes.status} — skipping`);
      return [];
    }
    const searchData = await searchRes.json();
    const uids = searchData.esearchresult.idlist ?? [];

    if (uids.length === 0) {
      console.log('PubMed: no results');
      return [];
    }

    // Batch into chunks of 100 to avoid URL length limits
    const BATCH = 100;
    const batches = [];
    for (let i = 0; i < uids.length; i += BATCH) {
      batches.push(uids.slice(i, i + BATCH));
    }

    const allSummaries = {};
    for (const batch of batches) {
      const idParam = batch.join(',');

      // Step 2: ESummary — article metadata as JSON
      console.log(`Fetching PubMed ESummary (${batch.length} articles)...`);
      const summaryUrl =
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi` +
        `?db=pubmed&id=${idParam}&retmode=json${apiParam}`;

      const summaryRes = await fetch(summaryUrl);
      if (!summaryRes.ok) {
        console.warn(`PubMed ESummary responded with ${summaryRes.status} — skipping batch`);
        continue;
      }
      const summaryData = await summaryRes.json();
      Object.assign(allSummaries, summaryData.result ?? {});
    }

    // Step 3: EFetch — abstracts as XML (process first batch for abstracts)
    console.log('Fetching PubMed EFetch (abstracts)...');
    const firstBatchIds = batches[0]?.join(',') ?? '';
    const fetchUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi` +
      `?db=pubmed&id=${firstBatchIds}&retmode=xml&rettype=abstract${apiParam}`;

    const fetchRes = await fetch(fetchUrl);
    const abstractMap = {};

    if (fetchRes.ok) {
      const fetchXml = await fetchRes.text();
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', isArray: () => false });
      const parsed = parser.parse(fetchXml);

      // Walk PubmedArticleSet → each PubmedArticle
      const articleSet = parsed?.PubmedArticleSet?.PubmedArticle;
      const articlesArr = articleSet
        ? (Array.isArray(articleSet) ? articleSet : [articleSet])
        : [];

      for (const pa of articlesArr) {
        const medline = pa?.MedlineCitation;
        const pmid = String(medline?.PMID?.['#text'] ?? medline?.PMID ?? '');
        const rawAbstract = medline?.Article?.Abstract?.AbstractText;
        let abstractText = '';
        if (typeof rawAbstract === 'string') {
          abstractText = rawAbstract;
        } else if (Array.isArray(rawAbstract)) {
          abstractText = rawAbstract.map((t) => (typeof t === 'string' ? t : (t?.['#text'] ?? ''))).join(' ');
        } else if (rawAbstract?.['#text']) {
          abstractText = rawAbstract['#text'];
        }
        if (pmid) abstractMap[pmid] = abstractText.replace(/\s+/g, ' ').trim();
      }
    } else {
      console.warn(`PubMed EFetch responded with ${fetchRes.status} — abstracts will be empty`);
    }

    // Build NewsArticle array
    const articles = uids.map((uid) => {
      const r = allSummaries[uid];
      if (!r) return null;

      const authorsArr = r.authors ?? [];
      const firstAuthor = authorsArr[0]?.name ?? '';
      const authors = authorsArr.length > 1 ? `${firstAuthor} et al.` : firstAuthor;
      const publishedDate = normalizePubDate(r.pubdate);
      const doi = r.articleids?.find((id) => id.idtype === 'doi')?.value ?? undefined;

      return {
        id: String(uid),
        source: 'PubMed',
        title: (r.title ?? '').replace(/\.$/, '').trim(),
        authors,
        publishedDate,
        journal: r.source ?? '',
        abstract: abstractMap[uid] ?? '',
        url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`,
        ...(doi ? { doi } : {}),
      };
    }).filter(Boolean);

    console.log(`PubMed: fetched ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.warn('PubMed fetch failed:', err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

function normalizeTitle(t) {
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeDoi(doi) {
  return doi ? doi.toLowerCase().trim() : null;
}

/**
 * Merge and deduplicate articles. PubMed wins on duplicate (it's first in input).
 */
function deduplicateMerged(articles) {
  const seen = new Map();
  for (const article of articles) {
    const key = normalizeDoi(article.doi) ?? normalizeTitle(article.title);
    if (key && !seen.has(key)) {
      seen.set(key, article);
    }
  }
  return Array.from(seen.values());
}

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

function writeNews(articles) {
  const sorted = articles
    .slice()
    .sort((a, b) => (b.publishedDate > a.publishedDate ? 1 : b.publishedDate < a.publishedDate ? -1 : 0))
    .slice(0, 200);

  // Ensure content/ directory exists
  const dir = path.dirname(NEWS_JSON_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`Wrote ${sorted.length} articles to news.json`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const existing = loadExisting();
const [pubmedArticles, arxivArticles] = await Promise.all([fetchPubmed(), fetchArxiv()]);
const merged = deduplicateMerged([...pubmedArticles, ...arxivArticles, ...existing]);
writeNews(merged);

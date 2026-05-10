import fs from 'fs';
import path from 'path';
import type { NewsArticle } from '@/lib/types';
import NewsGrid from '@/components/news/NewsGrid';
import { Container } from '@/components/layout/Container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AMR Research News',
  description: 'Daily-refreshed feed of recent antimicrobial resistance research from arXiv and PubMed.',
};

function getAllArticles(): NewsArticle[] {
  const filePath = path.join(process.cwd(), 'content', 'news.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as NewsArticle[];
}

export default function NewsPage() {
  const articles = getAllArticles();
  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">AMR Research News</h1>
        <p className="text-slate-500 text-sm">
          Latest antimicrobial resistance research from arXiv and PubMed, refreshed daily.
        </p>
      </div>
      <NewsGrid articles={articles} />
    </Container>
  );
}

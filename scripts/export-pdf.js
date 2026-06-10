const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, '..', 'pdf-exports');

const PAGES = [
  { name: '01-home', path: '/' },
  { name: '02-conference', path: '/conference' },
  { name: '03-awareness', path: '/awareness' },
  { name: '04-education', path: '/education' },
  { name: '05-methodology', path: '/methodology' },
  { name: '06-tools-directory', path: '/tools-directory' },
  { name: '07-briefs', path: '/briefs' },
  { name: '08-news', path: '/news' },
  { name: '09-contact', path: '/contact' },
  { name: '10-experts', path: '/experts' },
  { name: '11-take-action', path: '/take-action' },
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
}

async function exportPDF(browser, page, url, outputPath) {
  console.log(`  → ${url}`);
  // Use screen media so all CSS backgrounds, colors, and layout render correctly
  await page.emulateMediaType('screen');
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  // Scroll to trigger lazy-loaded images and animations
  await autoScroll(page);
  // Let everything settle after scroll
  await new Promise(r => setTimeout(r, 2000));
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const failed = [];
  for (const { name, path: urlPath } of PAGES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.pdf`);
    try {
      await exportPDF(browser, page, `${BASE_URL}${urlPath}`, outputPath);
      console.log(`  ✓ ${name}.pdf`);
    } catch (err) {
      console.error(`  ✗ ${name} — ${err.message}`);
      failed.push(name);
    }
  }

  await browser.close();

  console.log(`\nDone. PDFs saved to: ${OUTPUT_DIR}`);
  if (failed.length) console.log(`Failed: ${failed.join(', ')}`);
})();

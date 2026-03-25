/**
 * scripts/generate-sitemap.mjs
 * Generates massive sitemaps for Programmatic SEO (Products * Cities).
 * Creates a sitemap index and multiple sub-sitemaps.
 * 
 * Run: node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.join(__dirname, '..');
const DB_PATH  = path.join(ROOT, 'public', 'data', 'products.db');
const OUT_DIR  = path.join(ROOT, 'public'); // Sitemaps should be in public root

const TOP_CITIES = [
  "bucuresti", "cluj-napoca", "timisoara", "iasi", "constanta", "craiova", "brasov", 
  "galati", "ploiesti", "oradea", "braila", "arad", "pitesti", "sibiu", "bacau", 
  "targu-mures", "baia-mare", "buzau", "botosani", "satu-mare"
]; // Limit cities in sitemap to top 20 to avoid exceeding index limits quickly

const BASE_URL = 'https://modernshop.ro'; // Update with real domain

async function main() {
  console.log('🚀 Generare Sitemap Masiv...');
  const db = new Database(DB_PATH);
  
  const products = db.prepare('SELECT sku FROM products').all();
  console.log(`📦 Gasite ${products.length} produse.`);

  const allUrls = [];

  // 1. Add static & main pages
  allUrls.push('');
  allUrls.push('/products');
  allUrls.push('/categories');

  // 2. Add City Listing pages
  TOP_CITIES.forEach(city => {
    allUrls.push(`/${city}/products`);
  });

  // 3. Add Product-City pages (The "Millions" strategy)
  // To keep it sane for Google's first crawl, we combine all products with Top 20 cities
  // 10,000 * 20 = 200,000 URLs
  products.forEach(p => {
    TOP_CITIES.forEach(city => {
      allUrls.push(`/${city}/product/${p.sku}`);
    });
  });

  console.log(`🔗 Total URL-uri pentru Sitemap: ${allUrls.length.toLocaleString()}`);

  const CHUNK_SIZE = 45000;
  const sitemaps = [];

  for (let i = 0; i < allUrls.length; i += CHUNK_SIZE) {
    const chunk = allUrls.slice(i, i + CHUNK_SIZE);
    const index = Math.floor(i / CHUNK_SIZE);
    const filename = `sitemap-products-${index}.xml`;
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(url => `  <url><loc>${BASE_URL}${url}</loc><changefreq>weekly</changefreq><priority>${url.includes('product') ? '0.8' : '1.0'}</priority></url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(OUT_DIR, filename), xml);
    sitemaps.push(filename);
    console.log(`✅ Generat ${filename}`);
  }

  // 4. Generate Sitemap Index
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(filename => `  <sitemap><loc>${BASE_URL}/${filename}</loc></sitemap>`).join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), indexXml);
  console.log('🎉 Sitemap Index Gata: public/sitemap.xml');

  db.close();
}

main().catch(err => { console.error(err); process.exit(1); });

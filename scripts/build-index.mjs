/**
 * build-index.mjs — streaming writer to avoid OOM
 * Produces:
 *   public/data/products-list.json   (lean fields)
 *   public/data/products-detail.json (full fields)
 *   public/data/categories.json
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'public', 'feed.csv');
const OUT_DIR  = path.join(ROOT, 'public', 'data');

function parseLine(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current); current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  if (parts.length < 5) return null;

  const name     = parts[0]?.trim() || '';
  const image    = parts[1]?.trim() || '';
  const category = parts[2]?.trim() || '';
  const ean      = parts[3]?.trim() || '';
  const sku      = parts[4]?.trim() || '';
  const priceRaw = parts[5]?.trim() || '0';
  const stockRaw = parts[6]?.trim() || '0';
  const brand    = parts[7]?.trim() || '';
  const description         = parts[8]?.trim()  || '';
  const additionalImagesRaw = parts[9]?.trim()  || '';
  const attributesRaw       = parts[10]?.trim() || '';
  const pricePj  = parts[11]?.trim() || '';

  if (!name || !sku) return null;

  return {
    name, image, category, ean, sku,
    priceWithoutVat: parseFloat(priceRaw.replace(',', '.')) || 0,
    stock: parseInt(stockRaw) || 0,
    brand, description,
    additionalImages: additionalImagesRaw
      ? additionalImagesRaw.split('|').map(s => s.trim()).filter(Boolean)
      : [],
    attributesRaw,
    pricePj,
  };
}

async function main() {
  console.log('📂 Reading:', CSV_PATH);
  if (!fs.existsSync(CSV_PATH)) { console.error('❌  feed.csv not found'); process.exit(1); }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Open streaming writers — write JSON array manually to avoid holding all in RAM
  const listFd   = fs.openSync(path.join(OUT_DIR, 'products-list.json'),   'w');
  const detailFd = fs.openSync(path.join(OUT_DIR, 'products-detail.json'), 'w');

  fs.writeSync(listFd,   '[');
  fs.writeSync(detailFd, '[');

  const catMap  = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream(CSV_PATH), crlfDelay: Infinity });

  let isHeader = true;
  let total = 0, skipped = 0, first = true;

  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    const p = parseLine(line);
    if (!p) { skipped++; continue; }

    const sep = first ? '' : ',';
    first = false;

    // Lean record
    const lean = {
      sku: p.sku, name: p.name, image: p.image, category: p.category,
      brand: p.brand, priceWithoutVat: p.priceWithoutVat, stock: p.stock, pricePj: p.pricePj,
    };
    fs.writeSync(listFd, sep + JSON.stringify(lean));

    // Full record (drop nothing)
    fs.writeSync(detailFd, sep + JSON.stringify(p));

    catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    total++;
    if (total % 10000 === 0) process.stdout.write(`  ${total.toLocaleString()}...\r`);
  }

  fs.writeSync(listFd,   ']');
  fs.writeSync(detailFd, ']');
  fs.closeSync(listFd);
  fs.closeSync(detailFd);

  console.log(`\n✅  ${total.toLocaleString()} produse (${skipped} sarite)`);

  const lMB = (fs.statSync(path.join(OUT_DIR, 'products-list.json')).size   / 1024 / 1024).toFixed(1);
  const dMB = (fs.statSync(path.join(OUT_DIR, 'products-detail.json')).size / 1024 / 1024).toFixed(1);
  console.log(`📋  products-list.json    ${lMB} MB`);
  console.log(`📦  products-detail.json  ${dMB} MB`);

  const categories = Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  fs.writeFileSync(path.join(OUT_DIR, 'categories.json'), JSON.stringify(categories), 'utf-8');
  console.log(`📂  categories.json       ${categories.length} categorii`);

  console.log('\n🎉  Gata! Porneste: npm run dev');
}

main().catch(err => { console.error(err); process.exit(1); });

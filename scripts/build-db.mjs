/**
 * build-db.mjs
 * Reads feed.csv ONCE and imports everything into a SQLite database.
 * 
 * Run: node scripts/build-db.mjs
 * 
 * Produces: public/data/products.db
 * Queries will return in <5ms for any page/category/search.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'feedCSV.csv');
const OUT_DIR  = path.join(ROOT, 'public', 'data');
const DB_PATH  = path.join(OUT_DIR, 'products.db');

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
  const sku      = parts[4]?.trim() || '';
  if (!name || !sku) return null;

  return {
    name,
    image:           parts[1]?.trim() || '',
    category:        parts[2]?.trim() || '',
    ean:             parts[3]?.trim() || '',
    sku,
    price:           (parseFloat((parts[5]?.trim() || '0').replace(',', '.')) || 0) * 1.5,
    stock:           parseInt(parts[6]?.trim() || '0') || 0,
    brand:           parts[7]?.trim() || '',
    description:     parts[8]?.trim() || '',
    extra_images:    parts[9]?.trim() || '',
    attributes_raw:  parts[10]?.trim() || '',
    price_pj:        parts[11]?.trim() || '',
  };
}

async function main() {
  console.log('📂 Citesc:', CSV_PATH);
  if (!fs.existsSync(CSV_PATH)) { console.error('❌ feed.csv lipsa'); process.exit(1); }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Open DB (if it exists, we clear it, otherwise it's created)
  const db = new Database(DB_PATH);

  // Optimizations for bulk insert
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = OFF');
  db.pragma('cache_size = -64000'); // 64MB cache

  // Clear existing data instead of unlinking (avoids EBUSY)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id            INTEGER PRIMARY KEY,
      sku           TEXT    NOT NULL,
      name          TEXT    NOT NULL,
      image         TEXT,
      category      TEXT,
      ean           TEXT,
      price         REAL    DEFAULT 0,
      stock         INTEGER DEFAULT 0,
      brand         TEXT,
      description   TEXT,
      extra_images  TEXT,
      attributes_raw TEXT,
      price_pj      TEXT
    );
    DELETE FROM products;
    DROP INDEX IF EXISTS idx_category;
    DROP INDEX IF EXISTS idx_sku;
    DROP INDEX IF EXISTS idx_name;
    DROP TABLE IF EXISTS products_fts;
  `);

  db.exec(`
    CREATE INDEX idx_category ON products(category);
    CREATE INDEX idx_sku      ON products(sku);
    CREATE INDEX idx_name     ON products(name);
  `);

  const insert = db.prepare(`
    INSERT INTO products
      (sku, name, image, category, ean, price, stock, brand,
       description, extra_images, attributes_raw, price_pj)
    VALUES
      (@sku, @name, @image, @category, @ean, @price, @stock, @brand,
       @description, @extra_images, @attributes_raw, @price_pj)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH),
    terminal: false
  });

  let batch = [];
  let skipped = 0;
  let isHeader = true;
  let linesProcessed = 0;
  let currentBuffer = '';
  let inQuotes = false;
  const BATCH_SIZE = 500; // Define BATCH_SIZE here as it's used in the loop

  for await (const line of rl) {
    // Multi-line CSV: toggle inQuotes for every quote char. 
    // "" inside a quoted field will toggle twice, resulting in no change.
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') inQuotes = !inQuotes;
    }

    currentBuffer += (currentBuffer ? '\n' : '') + line;

    if (inQuotes) {
        // Record continues on next line
        continue;
    }

    // Now we have a full CSV record in currentBuffer
    const record = currentBuffer;
    currentBuffer = ''; // Reset for next record
    
    if (isHeader) { 
        isHeader = false; 
        continue; 
    }

    const p = parseLine(record);
    linesProcessed++;

    if (!p) { 
        skipped++; 
        continue; 
    }
    
    // Filter out products under 100 Lei
    if (p.price < 100) { 
        skipped++; 
        continue; 
    }

    batch.push(p);
    if (batch.length >= BATCH_SIZE) {
      insertMany(batch);
      batch = [];
      process.stdout.write(`\r🚀 Procesat: ${linesProcessed.toLocaleString()}...`);
    }
  }

  if (batch.length > 0) insertMany(batch);
  console.log(`\n\n✅  ${(linesProcessed - skipped).toLocaleString()} produse (${skipped.toLocaleString()} sarite)`);
  // FTS for search
  db.exec(`
    CREATE VIRTUAL TABLE products_fts USING fts5(
      sku, name, brand,
      content='products', content_rowid='id'
    );
    INSERT INTO products_fts(rowid, sku, name, brand)
      SELECT id, sku, name, brand FROM products;
  `);

  db.close();

  const sizeMB = (fs.statSync(DB_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅  ${linesProcessed.toLocaleString()} produse (${skipped} sarite)`);
  console.log(`🗄️   products.db  ${sizeMB} MB`);
  console.log('\n🎉  DB gata! Porneste: npm run dev');
}

main().catch(err => { console.error(err); process.exit(1); });

/**
 * migrate-to-postgres.mjs
 * Migration script for sale50.ro
 * Reads feedCSV.csv and imports everything into the Hetzner PostgreSQL database.
 * 
 * Run: node scripts/migrate-to-postgres.mjs
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import pg from 'pg';
const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.join(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'feedCSV.csv');

// Load env from .env file manually if needed, or assume process.env.DATABASE_URL
const DATABASE_URL = 'postgresql://postgres:Ridicate112!@178.104.20.127:5432/toateproiectele';

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
  if (!fs.existsSync(CSV_PATH)) { 
    console.error('❌ feedCSV.csv lipsă la rădăcină'); 
    process.exit(1); 
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('⚡ Conectat la Postgres. Pregătesc tabelele...');
    
    // Create table with sale50_ prefix
    await client.query(`
      CREATE TABLE IF NOT EXISTS sale50_products (
        id SERIAL PRIMARY KEY,
        sku TEXT UNIQUE,
        name TEXT,
        image TEXT,
        category TEXT,
        brand TEXT,
        price REAL,
        stock INTEGER,
        ean TEXT,
        description TEXT,
        extra_images TEXT,
        attributes_raw TEXT,
        price_pj TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      TRUNCATE sale50_products;
    `);

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
    const BATCH_SIZE = 200;

    console.log('🚀 Încep importul în bucăți de', BATCH_SIZE);

    for await (const line of rl) {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') inQuotes = !inQuotes;
      }
      currentBuffer += (currentBuffer ? '\n' : '') + line;
      if (inQuotes) continue;
      
      const record = currentBuffer;
      currentBuffer = '';
      if (isHeader) { isHeader = false; continue; }

      const p = parseLine(record);
      linesProcessed++;

      if (!p || p.price < 100) { 
        skipped++; 
        continue; 
      }

      batch.push(p);

      if (batch.length >= BATCH_SIZE) {
        await insertBatch(client, batch);
        batch = [];
        process.stdout.write(`\r📦 Produse încărcate: ${linesProcessed.toLocaleString()}...`);
      }
    }

    if (batch.length > 0) {
      await insertBatch(client, batch);
    }

    console.log(`\n\n✅ Finalizat! ${(linesProcessed - skipped).toLocaleString()} produse importate în Postgres.`);
    
    // Create indexes
    console.log('🔍 Creez indecși pentru performanță...');
    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sale50_cat ON sale50_products(category);
        CREATE INDEX IF NOT EXISTS idx_sale50_sku ON sale50_products(sku);
        CREATE INDEX IF NOT EXISTS idx_sale50_name ON sale50_products(name);
    `);

  } catch (err) {
    console.error('❌ Eroare la migrare:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

async function insertBatch(client, batch) {
    const query = `
        INSERT INTO sale50_products (sku, name, image, category, ean, price, stock, brand, description, extra_images, attributes_raw, price_pj)
        VALUES ${batch.map((_, i) => `(
            $${i * 12 + 1}, $${i * 12 + 2}, $${i * 12 + 3}, $${i * 12 + 4}, 
            $${i * 12 + 5}, $${i * 12 + 6}, $${i * 12 + 7}, $${i * 12 + 8}, 
            $${i * 12 + 9}, $${i * 12 + 10}, $${i * 12 + 11}, $${i * 12 + 12}
        )`).join(',')}
        ON CONFLICT (sku) DO NOTHING
    `;
    const params = batch.flatMap(p => [
        p.sku, p.name, p.image, p.category, p.ean, p.price, p.stock, p.brand, p.description, p.extra_images, p.attributes_raw, p.price_pj
    ]);
    await client.query(query, params);
}

main();

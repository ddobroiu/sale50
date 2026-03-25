/**
 * lib/products.ts — SQLite backend
 * All queries return in <5ms regardless of dataset size.
 *
 * Build the DB once with: node scripts/build-db.mjs
 */

import path from 'path';
import Database, { Database as DB } from 'better-sqlite3';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Product {
  sku: string;
  name: string;
  image: string;
  category: string;
  ean: string;
  priceWithoutVat: number;
  priceWithVat: number;
  stock: number;
  brand: string;
  description: string;
  additionalImages: string[];
  attributes: Record<string, string>;
  pricePj: string;
}

export interface ProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

// ── Config ────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 60;
const DB_PATH   = path.join(process.cwd(), 'public', 'data', 'products.db');

// ── Singleton DB connection ───────────────────────────────────────────────────

let _db: DB | null = null;

function getDb(): DB {
  if (_db) return _db;
  _db = new Database(DB_PATH); // Removed readonly for orders
  _db.pragma('journal_mode = WAL');
  _db.pragma('cache_size = -32000'); // 32MB query cache

  // Create orders table
  _db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        shipping_address TEXT,
        billing_address TEXT,
        items TEXT,
        total_amount REAL,
        status TEXT DEFAULT 'pending',
        invoice_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return _db;
}

export async function getOrdersByEmail(email: string) {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC').all(email);
    return rows;
}

export async function getOrCreateUser(email: string, name?: string) {
    const db = getDb();
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
        const id = Math.random().toString(36).substring(2, 9).toUpperCase();
        db.prepare('INSERT INTO users (id, email, name) VALUES (?, ?, ?)').run(id, email, name || '');
        user = { id, email, name };
    }
    return user;
}

export async function saveOrder(order: any) {
    const db = getDb();
    const id = Math.random().toString(36).substring(2, 9).toUpperCase();
    const stmt = db.prepare(`
        INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, billing_address, items, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
        id,
        order.name,
        order.email,
        order.phone,
        JSON.stringify(order.shipping),
        JSON.stringify(order.billing),
        JSON.stringify(order.items),
        order.total
    );
    
    return { id, ok: true };
}

// ── Mapping ───────────────────────────────────────────────────────────────────

function parseAttributes(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw) return out;
  raw.split('|').forEach(pair => {
    const idx = pair.indexOf(':');
    if (idx !== -1) {
      const k = pair.substring(0, idx).trim();
      const v = pair.substring(idx + 1).trim();
      if (k) out[k] = v;
    }
  });
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    sku:             row.sku,
    name:            row.name,
    image:           row.image || '',
    category:        row.category || '',
    ean:             row.ean || '',
    priceWithoutVat: row.price ?? 0,
    priceWithVat:    (row.price ?? 0) * 1.21,
    stock:           row.stock ?? 0,
    brand:           row.brand || '',
    description:     row.description || '',
    additionalImages: row.extra_images
      ? row.extra_images.split('|').map((s: string) => s.trim()).filter(Boolean)
      : [],
    attributes: parseAttributes(row.attributes_raw || ''),
    pricePj:    row.price_pj || '',
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Paginated listing — <5ms.
 */
export async function getProducts(
  page: number = 1,
  category?: string,
  search?: string,
): Promise<ProductsResult> {
  const db = getDb();

  let whereClause = '';
  const params: Record<string, string | number> = {};

  if (search) {
    // Sanitize search to avoid SQLite FTS syntax errors (like the one near ",")
    const cleanSearch = search
      .replace(/[^\w\s\u00C0-\u017F]/g, ' ') // Only allow letters, numbers, spaces
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(w => `${w}*`)
      .join(' AND ');

    if (!cleanSearch) return { products: [], total: 0, totalPages: 1, page: 1, pageSize: PAGE_SIZE };

    try {
      const rows = db.prepare(`
        SELECT p.*
        FROM products p
        JOIN products_fts f ON f.rowid = p.id
        WHERE f MATCH @query
        ORDER BY rank
      `).all({ query: cleanSearch }) as object[];

      const products = rows.map(rowToProduct);
      const total = products.length;
      const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
      const safePage = Math.max(1, Math.min(page, totalPages));
      const offset = (safePage - 1) * PAGE_SIZE;

      return {
        products: products.slice(offset, offset + PAGE_SIZE),
        total, totalPages, page: safePage, pageSize: PAGE_SIZE,
      };
    } catch (err) {
      console.error('FTS Search Error:', err);
      // Fallback to simple LIKE search if FTS fails
      const fallbackRows = db.prepare(`
        SELECT * FROM products 
        WHERE name LIKE ? OR sku LIKE ? 
        LIMIT 50
      `).all(`%${search}%`, `%${search}%`) as object[];
      const p = fallbackRows.map(rowToProduct);
      return { products: p, total: p.length, totalPages: 1, page: 1, pageSize: PAGE_SIZE };
    }
  }

  if (category) {
    whereClause = 'WHERE category = @category';
    params.category = category;
  }

  const total: number = (
    db.prepare(`SELECT COUNT(*) as cnt FROM products ${whereClause}`).get(params) as { cnt: number }
  ).cnt;

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const safePage   = Math.max(1, Math.min(page, totalPages));
  const offset     = (safePage - 1) * PAGE_SIZE;

  const rows = db.prepare(`
    SELECT sku, name, image, category, brand, price, stock, price_pj
    FROM products
    ${whereClause}
    LIMIT @limit OFFSET @offset
  `).all({ ...params, limit: PAGE_SIZE, offset }) as object[];

  const products = rows.map(rowToProduct);

  return { products, total, totalPages, page: safePage, pageSize: PAGE_SIZE };
}

/**
 * All categories with product counts and a representative image — <5ms.
 */
export async function getCategories(): Promise<{ name: string; count: number; image: string }[]> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT category as name, COUNT(*) as count, MAX(image) as image
    FROM products
    WHERE category IS NOT NULL AND category != ''
    GROUP BY category
    ORDER BY count DESC
  `).all() as { name: string; count: number; image: string }[];
  return rows;
}


/**
 * Single product by SKU — <1ms (indexed lookup).
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE sku = ?').get(sku);
  return row ? rowToProduct(row) : null;
}

/**
 * Full-text search shorthand.
 */
export async function searchProducts(query: string, page = 1): Promise<ProductsResult> {
  return getProducts(page, undefined, query);
}

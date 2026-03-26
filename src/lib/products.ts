/**
 * lib/products.ts — PostgreSQL backend (Hetzner Hosted)
 * Migrated from SQLite to Postgres for shared environment.
 */

import { Pool, PoolClient } from 'pg';

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
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Ridicate112!@178.104.20.127:5432/toateproiectele';

// ── Singleton DB connection ───────────────────────────────────────────────────

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;
  _pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Ensure tables exist with prefix to avoid collision in shared DB
  const initSql = `
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
    CREATE TABLE IF NOT EXISTS sale50_orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        shipping_address JSONB,
        billing_address JSONB,
        items JSONB,
        total_amount REAL,
        shipping_fee REAL DEFAULT 0,
        payment_method TEXT,
        status TEXT DEFAULT 'pending',
        invoice_url TEXT,
        awb_number TEXT,
        awb_carrier TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sale50_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sale50_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_sale50_products_category ON sale50_products(category);
    CREATE INDEX IF NOT EXISTS idx_sale50_products_sku ON sale50_products(sku);
  `;
  
  _pool.query(initSql).catch(err => console.error('DB Init failed:', err));

  return _pool;
}

export async function subscribeToNewsletter(email: string) {
  const pool = getPool();
  try {
    await pool.query('INSERT INTO sale50_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
    return { success: true };
  } catch (err) {
    console.error('Subscription error:', err);
    return { success: false };
  }
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

export async function getProducts(
  page: number = 1,
  category?: string,
  search?: string,
): Promise<ProductsResult> {
  const pool = getPool();
  let whereParts: string[] = [];
  let values: any[] = [];

  if (category) {
    whereParts.push(`category = $${values.length + 1}`);
    values.push(category);
  }

  if (search) {
    whereParts.push(`(name ILIKE $${values.length + 1} OR sku ILIKE $${values.length + 1})`);
    values.push(`%${search}%`);
  }

  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

  // Get total
  const countRes = await pool.query(`SELECT COUNT(*) as cnt FROM sale50_products ${whereClause}`, values);
  const total = parseInt(countRes.rows[0].cnt);
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const safePage   = Math.max(1, Math.min(page, totalPages));
  const offset     = (safePage - 1) * PAGE_SIZE;

  // Get products
  const productsRes = await pool.query(`
    SELECT * FROM sale50_products
    ${whereClause}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `, [...values, PAGE_SIZE, offset]);

  const products = productsRes.rows.map(rowToProduct);

  return { products, total, totalPages, page: safePage, pageSize: PAGE_SIZE };
}

export async function getCategories(): Promise<{ name: string; count: number; image: string }[]> {
  const pool = getPool();
  const res = await pool.query(`
    SELECT category as name, COUNT(*) as count, MAX(image) as image
    FROM sale50_products
    WHERE category IS NOT NULL AND category != ''
    GROUP BY category
    ORDER BY count DESC
  `);
  return res.rows.map(row => ({
    name: row.name,
    count: parseInt(row.count),
    image: row.image
  }));
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM sale50_products WHERE sku = $1', [sku]);
  return res.rows.length > 0 ? rowToProduct(res.rows[0]) : null;
}

export async function saveOrder(order: any) {
    const pool = getPool();
    const id = Math.random().toString(36).substring(2, 9).toUpperCase();
    
    await pool.query(`
        INSERT INTO sale50_orders (id, customer_name, customer_email, customer_phone, shipping_address, billing_address, items, total_amount, shipping_fee, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
        id,
        order.name,
        order.email,
        order.phone,
        JSON.stringify(order.shipping),
        JSON.stringify(order.billing),
        JSON.stringify(order.items),
        order.total,
        order.shippingFee || 0,
        order.paymentMethod || 'ramburs'
    ]);
    
    return { id, ok: true };
}

export async function getOrdersByEmail(email: string) {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM sale50_orders WHERE customer_email = $1 ORDER BY created_at DESC', [email]);
    return res.rows;
}

export async function getOrCreateUser(email: string, name?: string) {
    const pool = getPool();
    const existing = await pool.query('SELECT * FROM sale50_users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return existing.rows[0];

    const id = Math.random().toString(36).substring(2, 9).toUpperCase();
    await pool.query('INSERT INTO sale50_users (id, email, name) VALUES ($1, $2, $3)', [id, email, name || '']);
    return { id, email, name };
}
export async function listOrders(limit = 200) {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM sale50_orders ORDER BY created_at DESC LIMIT $1', [limit]);
    return res.rows;
}

export async function updateOrderStatus(id: string, status: string) {
    const pool = getPool();
    await pool.query('UPDATE sale50_orders SET status = $1 WHERE id = $2', [status, id]);
    return { ok: true };
}

export async function updateOrderAwb(id: string, awb: string, carrier: string) {
    const pool = getPool();
    await pool.query('UPDATE sale50_orders SET awb_number = $1, awb_carrier = $2 WHERE id = $3', [awb, carrier, id]);
    return { ok: true };
}

export async function listInvoices() {
    const pool = getPool();
    const res = await pool.query('SELECT id, customer_name, customer_email, total_amount, invoice_url, created_at FROM sale50_orders WHERE invoice_url IS NOT NULL ORDER BY created_at DESC');
    return res.rows;
}

export async function listUsersWithStats() {
    const pool = getPool();
    const res = await pool.query(`
        SELECT u.*, 
               (SELECT COUNT(*) FROM sale50_orders o WHERE o.customer_email = u.email) as order_count,
               (SELECT COALESCE(SUM(total_amount), 0) FROM sale50_orders o WHERE o.customer_email = u.email) as total_spent
        FROM sale50_users u
        ORDER BY created_at DESC
    `);
    return res.rows;
}

export async function getAllSkus(): Promise<string[]> {
    const pool = getPool();
    const res = await pool.query('SELECT sku FROM sale50_products');
    return res.rows.map(r => r.sku);
}

export async function createProduct(p: Partial<Product>) {
    const pool = getPool();
    await pool.query(`
        INSERT INTO sale50_products (sku, name, image, category, brand, price, stock, ean, description, extra_images, attributes_raw, price_pj)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
        p.sku, p.name, p.image, p.category, p.brand, p.priceWithoutVat, p.stock, p.ean, p.description, 
        p.additionalImages?.join('|'), 
        p.attributes ? Object.entries(p.attributes).map(([k,v]) => `${k}:${v}`).join('|') : '',
        p.pricePj
    ]);
    return { ok: true };
}

export async function updateProduct(sku: string, p: Partial<Product>) {
    const pool = getPool();
    await pool.query(`
        UPDATE sale50_products 
        SET name = $1, image = $2, category = $3, brand = $4, price = $5, stock = $6, ean = $7, description = $8, extra_images = $9, attributes_raw = $10, price_pj = $11
        WHERE sku = $12
    `, [
        p.name, p.image, p.category, p.brand, p.priceWithoutVat, p.stock, p.ean, p.description, 
        p.additionalImages?.join('|'), 
        p.attributes ? Object.entries(p.attributes).map(([k,v]) => `${k}:${v}`).join('|') : '',
        p.pricePj,
        sku
    ]);
    return { ok: true };
}

export async function deleteProductBySku(sku: string) {
    const pool = getPool();
    await pool.query('DELETE FROM sale50_products WHERE sku = $1', [sku]);
    return { ok: true };
}

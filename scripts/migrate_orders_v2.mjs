import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Ridicate112!@178.104.20.127:5432/toateproiectele';

async function migrate() {
    const pool = new Pool({ connectionString });
    console.log("Altering sale50_orders table...");
    try {
        await pool.query(`ALTER TABLE sale50_orders ADD COLUMN IF NOT EXISTS shipping_fee REAL DEFAULT 0`);
        await pool.query(`ALTER TABLE sale50_orders ADD COLUMN IF NOT EXISTS payment_method TEXT`);
        await pool.query(`ALTER TABLE sale50_orders ADD COLUMN IF NOT EXISTS awb_number TEXT`);
        await pool.query(`ALTER TABLE sale50_orders ADD COLUMN IF NOT EXISTS awb_carrier TEXT`);
        console.log("Migration complete!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

migrate();

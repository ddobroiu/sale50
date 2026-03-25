import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://postgres:Ridicate112!@178.104.20.127:5432/toateproiectele';

async function test() {
  console.log('Testing connection to Hetzner Postgres...');
  const pool = new Pool({ connectionString });
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connection Sucessful. Time:', res.rows[0].now);
    const count = await pool.query('SELECT COUNT(*) FROM sale50_products');
    console.log('✅ Products Count:', count.rows[0].cnt || count.rows[0].count);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
  } finally {
    await pool.end();
  }
}

test();

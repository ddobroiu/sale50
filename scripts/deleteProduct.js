const DB = require('better-sqlite3');
const db = new DB('public/data/products.db');
const products = db.prepare('SELECT sku, name FROM products WHERE name LIKE ?').all('%Fineblue%');
console.log('Found:', products.length, 'products');
products.forEach(p => {
    console.log(' -', p.sku, '|', p.name);
    if(p.name.includes('F-I600') && p.name.includes('Negru')) {
        const info = db.prepare('DELETE FROM products WHERE sku = ?').run(p.sku);
        console.log('   -> Deleted rows:', info.changes);
    }
});
db.close();

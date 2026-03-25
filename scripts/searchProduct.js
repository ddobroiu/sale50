const DB = require('better-sqlite3');
const db = new DB('public/data/products.db');
const product = db.prepare("SELECT sku, name, ean, price_pj FROM products WHERE name LIKE '%Nano Water%' OR sku = '01697'").get();
console.log(product);

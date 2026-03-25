const fs = require('fs');
const content = fs.readFileSync('feedCSV.csv', 'utf8');
const lines = content.split('\n');
const line = lines.find(l => l.includes('01697'));
console.log('LINE FOUND:', line);
const parts = line.split('","');
console.log('PARTS COUNT:', parts.length);
parts.forEach((p, i) => console.log(`${i}: ${p}`));

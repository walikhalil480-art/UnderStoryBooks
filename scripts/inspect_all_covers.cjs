const fs = require('fs');

const somaliData = fs.readFileSync('src/data/somaliBooksData.ts', 'utf8');
const baseData = fs.readFileSync('src/data/books.ts', 'utf8');

function getBookList(fileContent, tag) {
  const matches = [...fileContent.matchAll(/id:\s*'([a-z0-9\-]+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?coverUrl:\s*'([^']*)'/g)];
  return matches.map(m => ({ id: m[1], title: m[2], coverUrl: m[3], tag }));
}

const somaliBooks = getBookList(somaliData, 'SOMALI');
const baseBooks = getBookList(baseData, 'BASE');

console.log(`Somali books found: ${somaliBooks.length}`);
somaliBooks.forEach(b => {
  const exists = b.coverUrl.startsWith('/') ? fs.existsSync('public' + b.coverUrl) : 'URL';
  console.log(`[SOMALI] ${b.id} | ${b.title} | cover: ${b.coverUrl} | fileExists: ${exists}`);
});

console.log(`\nBase/Curated books found: ${baseBooks.length}`);
baseBooks.forEach(b => {
  console.log(`[BASE] ${b.id} | ${b.title} | cover: ${b.coverUrl}`);
});

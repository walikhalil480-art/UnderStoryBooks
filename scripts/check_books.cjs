const fs = require('fs');
const https = require('https');
const http = require('http');

const content = fs.readFileSync('src/data/books.ts', 'utf8');

function extractBooks(arrayName) {
  const marker = arrayName + ' = [';
  const start = content.indexOf(marker);
  if (start === -1) return [];
  const sub = content.substring(start);
  const end = sub.indexOf('];');
  const arrayContent = sub.substring(0, end);
  
  const books = [];
  const blocks = arrayContent.split(/id:\s*'/).slice(1);
  blocks.forEach(b => {
    const id = b.split("'")[0];
    const titleMatch = b.match(/title:\s*'([^']+)'/);
    const coverMatch = b.match(/coverUrl:\s*'([^']*)'/);
    const isbnMatch = b.match(/isbn:\s*'([^']*)'/);
    const catMatch = b.match(/categorySlug:\s*'([^']*)'/);
    books.push({
      id,
      title: titleMatch ? titleMatch[1] : id,
      coverUrl: coverMatch ? coverMatch[1] : '',
      isbn: isbnMatch ? isbnMatch[1] : '',
      categorySlug: catMatch ? catMatch[1] : '',
      source: arrayName
    });
  });
  return books;
}

const curated = extractBooks('STOREFRONT_CURATED_BOOKS');
const somali = extractBooks('SOMALI_BOOKS');
const base = extractBooks('BASE_BOOKS');

console.log(`Found: Curated (${curated.length}), Somali (${somali.length}), Base (${base.length})`);

const allBooks = [...curated, ...somali, ...base];
console.log('Total books in BOOKS:', allBooks.length);

console.log('\n--- Checking Somali Books Covers ---');
somali.forEach(b => {
  console.log(`[${b.id}] "${b.title}" -> ${b.coverUrl}`);
});

console.log('\n--- Checking Base Books Covers ---');
base.forEach(b => {
  console.log(`[${b.id}] "${b.title}" -> ${b.coverUrl.slice(0, 80)}`);
});

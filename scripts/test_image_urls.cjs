const fs = require('fs');
const https = require('https');
const http = require('http');

const baseData = fs.readFileSync('src/data/books.ts', 'utf8');

const matches = [...baseData.matchAll(/id:\s*'([a-z0-9\-]+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?coverUrl:\s*'([^']*)'/g)];
const books = matches.map(m => ({ id: m[1], title: m[2], coverUrl: m[3] }));

async function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url || url.startsWith('/')) {
      resolve({ status: 200, length: 999 });
      return;
    }
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 6000 }, (res) => {
      // Follow redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        checkUrl(res.headers.location).then(resolve);
        return;
      }
      const len = parseInt(res.headers['content-length'] || '0', 10);
      resolve({ status: res.statusCode, length: len, type: res.headers['content-type'] });
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 408 }); });
  });
}

(async () => {
  console.log('Testing all ' + books.length + ' book cover URLs...');
  for (const b of books) {
    const res = await checkUrl(b.coverUrl);
    // If length <= 1000 or status != 200, it's either an empty 1x1 tracking pixel or broken!
    if (res.status !== 200 || res.length <= 1500) {
      console.log(`[SUSPECT/BROKEN] [${b.id}] "${b.title}" -> status: ${res.status}, len: ${res.length}, type: ${res.type}, url: ${b.coverUrl}`);
    } else {
      console.log(`[OK] [${b.id}] len: ${res.length}`);
    }
  }
})();

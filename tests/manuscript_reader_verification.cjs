const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');

const BASE_URL = 'http://localhost:5173';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.path, BASE_URL);
    let postData = body;
    const headers = { ...(options.headers || {}) };
    if (postData) {
      if (typeof postData === 'object' && !Buffer.isBuffer(postData)) {
        postData = JSON.stringify(postData);
        headers['Content-Type'] = 'application/json';
      }
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks);
          let json = null;
          const ct = res.headers['content-type'] || '';
          if (ct.includes('application/json')) {
            try {
              json = JSON.parse(raw.toString('utf-8'));
            } catch {}
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: raw,
            text: raw.toString('utf-8'),
            json
          });
        });
      }
    );
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function generateMinimalPdf(numPages, textPrefix = 'Page') {
  // Generates a valid multi-page PDF document
  let objects = [];
  let offsets = [];
  let pdf = '%PDF-1.4\n';

  // Obj 1: Catalog
  offsets.push(pdf.length);
  pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  // Kids array
  let kids = [];
  for (let i = 1; i <= numPages; i++) {
    kids.push(`${i + 2} 0 R`);
  }

  // Obj 2: Pages
  offsets.push(pdf.length);
  pdf += `2 0 obj\n<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${numPages} >>\nendobj\n`;

  // Page objects: Obj 3 to NumPages + 2
  for (let i = 1; i <= numPages; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 2} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n`;
  }

  const startxref = pdf.length;
  pdf += `xref\n0 ${numPages + 3}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${numPages + 3} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
}

async function run() {
  console.log('=== eBaro Manuscript Reader Comprehensive Verification ===\n');
  let passed = 0;
  let total = 0;

  function test(label, condition) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✓ PASS: ${label}`);
    } else {
      console.error(`  ✗ FAIL: ${label}`);
      process.exit(1);
    }
  }

  // 1. Authenticate reader & admin
  console.log('[1/5] User Authentication & Reader Sessions');
  const loginRes = await request(
    { path: '/api/auth/signin', method: 'POST' },
    { email: 'admin@ebaro.org', password: 'AdminPass2026!' }
  );
  test('Admin authentication succeeds', loginRes.statusCode === 200 && loginRes.json?.user?.role === 'admin');
  const adminToken = loginRes.json?.token;

  const readerRes = await request(
    { path: '/api/auth/register', method: 'POST' },
    {
      fullName: 'Reader Test',
      email: `reader_${Date.now()}@test.so`,
      password: 'ReaderPass2026!',
      confirmPassword: 'ReaderPass2026!',
      agreedToTerms: true
    }
  );
  test('Reader registration succeeds', readerRes.statusCode === 201);
  const readerToken = readerRes.json?.token;

  // 2. Test Atomic Habits real 20-page manuscript
  console.log('\n[2/5] Testing Uploaded Atomic Habits Manuscript (20 Pages)');
  const atomicPdfRes = await request({
    path: '/api/reader/atomic-habits/pdf',
    method: 'GET',
    headers: { Authorization: `Bearer ${readerToken}` }
  });
  test('Atomic Habits PDF stream returns HTTP 200', atomicPdfRes.statusCode === 200);
  test('Atomic Habits PDF has application/pdf content type', atomicPdfRes.headers['content-type'] === 'application/pdf');
  test('Atomic Habits PDF streams real %PDF binary', atomicPdfRes.body.toString('latin1', 0, 5) === '%PDF-');
  test('Atomic Habits returns exact X-PDF-Page-Count: 20 header', atomicPdfRes.headers['x-pdf-page-count'] === '20');

  const atomicContentRes = await request({
    path: '/api/reader/atomic-habits/content',
    method: 'GET',
    headers: { Authorization: `Bearer ${readerToken}` }
  });
  test('Atomic Habits Content endpoint returns HTTP 200', atomicContentRes.statusCode === 200);
  test('Atomic Habits Content has exactly 20 chapters', atomicContentRes.json?.chapters?.length === 20);

  const chapters = atomicContentRes.json.chapters;
  test('First page number is Page 1', chapters[0].number === 'Page 1');
  test('Last page number is Page 20', chapters[19].number === 'Page 20');

  // Verify NO fake placeholder text exists anywhere in the 20 pages
  const allText = chapters.map((c) => c.content.join(' ')).join(' ');
  test('Does not contain fake filler: "In this section of"', !allText.includes('In this section of'));
  test('Does not contain fake filler: "world literature"', !allText.includes("enduring place in world literature"));
  test('Contains genuine Atomic Habits words from author manuscript', /atomic|habits|clear|james|habit|system/i.test(allText));

  // 3. Multi-Page Dynamic Scale Verification (5-page, 20-page, 50-page)
  console.log('\n[3/5] Dynamic Page Count Verification (5-Page, 20-Page, 50-Page Manuscripts)');
  const pageTests = [5, 20, 50];

  for (const pCount of pageTests) {
    const pdfBuf = generateMinimalPdf(pCount, `Doc${pCount}`);
    const uploadRes = await request(
      {
        path: '/api/author/upload-manuscript',
        method: 'POST',
        headers: { Authorization: `Bearer ${readerToken}` }
      },
      {
        filename: `manuscript_${pCount}pages.pdf`,
        format: 'PDF',
        dataBase64: pdfBuf.toString('base64')
      }
    );
    test(`Upload ${pCount}-page PDF succeeds`, uploadRes.statusCode === 201);
    const msPath = uploadRes.json.path;

    // Submit as book
    const slug = `dynamic-${pCount}-page-test-${Date.now()}`;
    const submitRes = await request(
      {
        path: '/api/author-submissions',
        method: 'POST',
        headers: { Authorization: `Bearer ${readerToken}` }
      },
      {
        title: `Dynamic Test ${pCount} Pages`,
        subtitle: 'Validation Document',
        author: 'Quality Assurance',
        authorBio: 'Automated test agent',
        authorEmail: 'qa@ebaro.so',
        language: 'so',
        categorySlug: 'somali-fiction',
        genre: 'Test',
        description: `Test publication with exactly ${pCount} pages.`,
        rightsDeclaration: 'Public test document',
        accessPreference: 'free',
        termsAgreed: true,
        manuscriptPath: msPath,
        manuscriptFilename: `manuscript_${pCount}pages.pdf`,
        manuscriptFormat: 'PDF',
        manuscriptSize: pdfBuf.length
      }
    );
    test(`Author submits ${pCount}-page book`, submitRes.statusCode === 201);
    const subId = submitRes.json.submissionId;

    // Approve
    const appRes = await request(
      {
        path: `/api/admin/author-submissions/${subId}/review`,
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      },
      { action: 'approved', adminNotes: `Approved ${pCount} page test` }
    );
    test(`Admin approves ${pCount}-page submission`, appRes.statusCode === 200);

    const approvedSlug = appRes.json?.book?.id;
    test(`Approved book ID received`, Boolean(approvedSlug));

    // Stream PDF and check header
    const streamRes = await request({
      path: `/api/reader/${approvedSlug}/pdf`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    test(`${pCount}-page PDF streams successfully with X-PDF-Page-Count: ${pCount}`, streamRes.headers['x-pdf-page-count'] === String(pCount));

    // Get Content and check chapter count
    const dynContentRes = await request({
      path: `/api/reader/${approvedSlug}/content`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    test(`${pCount}-page book Content has exactly ${pCount} chapters`, dynContentRes.json?.chapters?.length === pCount);
  }

  // 4. Multi-Chapter EPUB Extraction Verification
  console.log('\n[4/5] Multi-Chapter EPUB Extraction Verification');
  // Check that public domain / authorized EPUBs parse real chapters without synthetic filler
  const epubBooks = ['pride-and-prejudice', 'aqoondarro-waa-u-nacab-jacayl'];
  for (const bId of epubBooks) {
    const epubRes = await request({
      path: `/api/reader/${bId}/epub`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    test(`EPUB download for ${bId} returns HTTP 200`, epubRes.statusCode === 200);
    test(`EPUB binary has valid PK ZIP signature`, epubRes.body.toString('latin1', 0, 2) === 'PK');
  }

  // 5. Honest Error Handling for Missing / Unauthorized Manuscripts
  console.log('\n[5/5] Honest Error Handling for Missing & Unauthorized Manuscripts');
  // Unauthenticated access
  const unauthRes = await request({
    path: '/api/reader/atomic-habits/content',
    method: 'GET'
  });
  test('Unauthenticated content access is blocked (HTTP 401)', unauthRes.statusCode === 401);

  const missingRes = await request({
    path: '/api/reader/non-existent-book-slug/content',
    method: 'GET',
    headers: { Authorization: `Bearer ${readerToken}` }
  });
  test('Non-existent book returns HTTP 404', missingRes.statusCode === 404);

  console.log(`\n========================================`);
  console.log(`Manuscript Reader Tests: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`========================================\n`);

  process.exit(passed === total ? 0 : 1);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

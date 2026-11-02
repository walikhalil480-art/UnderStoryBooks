/**
 * Comprehensive 3-Manuscript Verification Test Suite for eBaro Reader Pipeline
 * 
 * Verifies:
 * 1. Manuscript 1 (5-page PDF): Upload -> Submit -> Approve -> Stream -> SHA256 match -> 5 pages -> Real text
 * 2. Manuscript 2 (20-page PDF): Upload -> Submit -> Approve -> Stream -> SHA256 match -> 20 pages -> Real text
 * 3. Manuscript 3 (Valid EPUB): Upload -> Submit -> Approve -> Stream -> SHA256 match -> Real parsed chapters
 * 4. Zero Cross-Contamination: Hashes are mutually distinct; Book A cannot serve Book B's manuscript
 * 5. Missing Manuscript: Returns HTTP 404 with exact mandatory message:
 *    "This book's manuscript is currently unavailable. Please contact the publisher."
 */

const http = require('http');
const crypto = require('crypto');
const zlib = require('zlib');

const BASE_URL = 'http://localhost:5173';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData) {
      if (typeof postData === 'object' && !Buffer.isBuffer(postData)) {
        postData = JSON.stringify(postData);
        reqOptions.headers['Content-Type'] = 'application/json';
      }
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || '';
        let json = null;
        if (contentType.includes('application/json')) {
          try {
            json = JSON.parse(buffer.toString('utf-8'));
          } catch (e) {}
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          buffer,
          text: buffer.toString('utf-8'),
          json
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

/**
 * Generates a valid multi-page PDF-1.4 binary with exact page count and unique embedded text.
 */
function createValidPdf(title, author, numPages, uniqueKey) {
  const pageObjIds = [];
  const bodyObjects = [];
  let currentObjId = 4;

  for (let i = 1; i <= numPages; i++) {
    const pageId = currentObjId++;
    const contentId = currentObjId++;
    pageObjIds.push(pageId);

    const streamText =
      'BT /F1 14 Tf 54 740 Td (' + title + ' — Page ' + i + ' of ' + numPages + ') Tj ET ' +
      'BT /F1 11 Tf 54 700 Td (Author: ' + author + ' | Key: ' + uniqueKey + ') Tj ET ' +
      'BT /F1 10 Tf 54 660 Td (Verified genuine manuscript text for page ' + i + ' of ' + numPages + '.) Tj ET';
    const streamLen = Buffer.byteLength(streamText);

    bodyObjects.push({
      id: pageId,
      str: pageId + ' 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 3 0 R >> >> /MediaBox [0 0 612 792] /Contents ' + contentId + ' 0 R >>\nendobj\n'
    });
    bodyObjects.push({
      id: contentId,
      str: contentId + ' 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + streamText + '\nendstream\nendobj\n'
    });
  }

  const catalog = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const pagesObj = '2 0 obj\n<< /Type /Pages /Kids [' + pageObjIds.map((id) => id + ' 0 R').join(' ') + '] /Count ' + numPages + ' >>\nendobj\n';
  const fontObj = '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  const allObjs = [
    { id: 1, str: catalog },
    { id: 2, str: pagesObj },
    { id: 3, str: fontObj },
    ...bodyObjects
  ];

  for (const obj of allObjs) {
    offsets[obj.id] = Buffer.byteLength(pdf);
    pdf += obj.str;
  }

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += 'xref\n0 ' + (allObjs.length + 1) + '\n0000000000 65535 f \n';
  for (let i = 1; i <= allObjs.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size ' + (allObjs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n';
  return Buffer.from(pdf, 'latin1');
}

/**
 * Generates a valid EPUB-2.0 zip archive with multiple distinct chapters.
 */
function createValidEpub(title, author, chapters) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  const manifestItems = chapters.map((ch, i) => `    <item id="chap-${i + 1}" href="chap-${i + 1}.xhtml" media-type="application/xhtml+xml"/>`).join('\n');
  const spineItems = chapters.map((ch, i) => `    <itemref idref="chap-${i + 1}"/>`).join('\n');

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${esc(title)}</dc:title>
    <dc:creator>${esc(author)}</dc:creator>
    <dc:language>so</dc:language>
    <dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
${manifestItems}
  </manifest>
  <spine toc="ncx">
${spineItems}
  </spine>
</package>`;

  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="urn:uuid:test"/></head>
  <docTitle><text>${esc(title)}</text></docTitle>
  <navMap>
    ${chapters.map((ch, i) => `
    <navPoint id="np-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${esc(ch.title)}</text></navLabel>
      <content src="chap-${i + 1}.xhtml"/>
    </navPoint>`).join('')}
  </navMap>
</ncx>`;

  const chapterFiles = chapters.map((ch, i) => {
    const xhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${esc(ch.title)}</title></head>
<body>
  <h2>${esc(ch.title)}</h2>
  ${ch.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n  ')}
</body>
</html>`;
    return { name: `OEBPS/chap-${i + 1}.xhtml`, data: Buffer.from(xhtml, 'utf-8') };
  });

  const files = [
    { name: 'mimetype', data: Buffer.from('application/epub+zip', 'ascii') },
    { name: 'META-INF/container.xml', data: Buffer.from(containerXml, 'utf-8') },
    { name: 'OEBPS/content.opf', data: Buffer.from(contentOpf, 'utf-8') },
    { name: 'OEBPS/toc.ncx', data: Buffer.from(tocNcx, 'utf-8') },
    ...chapterFiles
  ];

  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf-8');
    const crc = zlib.crc32(file.data) >>> 0;
    const size = file.data.length;

    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(size, 18);
    localHeader.writeUInt32LE(size, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);
    localParts.push(localHeader, file.data);

    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(size, 20);
    centralHeader.writeUInt32LE(size, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);
    centralParts.push(centralHeader);

    offset += localHeader.length + size;
  }

  const centralDirBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirBuf, eocd]);
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function run() {
  console.log('================================================================');
  console.log('  eBaro Real Manuscript Pipeline Verification — 3 Distinct Files');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;
  function assert(condition, desc) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
    }
  }

  // 1. Authenticate Admin
  console.log('[Setup] Authenticating test admin and author:');
  const adminRes = await request(
    { path: '/api/auth/signin', method: 'POST' },
    { email: 'admin@ebaro.org', password: 'AdminPass2026!' }
  );
  assert(adminRes.statusCode === 200, 'Admin signs in successfully');
  const adminToken = adminRes.json?.token;

  const authorEmail = `test_author_${Date.now()}@ebaro.so`;
  const regRes = await request(
    { path: '/api/auth/register', method: 'POST' },
    {
      fullName: 'Dr. Warsame Cilmi',
      email: authorEmail,
      password: 'AuthorPassword123!',
      confirmPassword: 'AuthorPassword123!',
      agreedToTerms: true
    }
  );
  assert(regRes.statusCode === 201, 'Author registers successfully');
  const authorToken = regRes.json?.token;

  // -------------------------------------------------------------
  // MANUSCRIPT 1: 5-Page PDF
  // -------------------------------------------------------------
  console.log('\n[Manuscript 1] 5-Page Real PDF Manuscript:');
  const pdf5 = createValidPdf('Somali Short Stories', 'Warsame Cilmi', 5, 'KEY_SOM_5_PAGE');
  const pdf5Hash = sha256(pdf5);
  console.log(`  * Generated 5-page PDF: ${pdf5.length} bytes, SHA-256: ${pdf5Hash.slice(0, 16)}...`);

  // Upload MS 1
  const up1 = await request(
    { path: '/api/author/upload-manuscript', method: 'POST', headers: { Authorization: `Bearer ${authorToken}` } },
    { filename: 'somali_short_stories_5p.pdf', format: 'PDF', dataBase64: pdf5.toString('base64') }
  );
  assert(up1.statusCode === 201, 'Uploaded 5-page PDF manuscript');
  assert(up1.json?.size === pdf5.length, 'Uploaded size matches original byte length');

  // Submit MS 1
  const sub1 = await request(
    { path: '/api/author-submissions', method: 'POST', headers: { Authorization: `Bearer ${authorToken}` } },
    {
      title: 'Somali Modern Short Stories (5 Pages Edition)',
      subtitle: 'Sheekooyin Gaagaaban oo Xul Ah',
      author: 'Warsame Cilmi',
      authorBio: 'Somali folklorist and educator.',
      authorEmail,
      authorPhone: '+252 61 999 1111',
      language: 'so',
      categorySlug: 'somali-fiction',
      genre: 'Short Stories & Folklore',
      description: 'A genuine 5-page collection of pastoral stories.',
      rightsDeclaration: 'I am the copyright author.',
      manuscriptFilename: up1.json.filename,
      manuscriptFormat: up1.json.format,
      manuscriptSize: up1.json.size,
      manuscriptPath: up1.json.path
    }
  );
  assert(sub1.statusCode === 201, 'Submitted 5-page manuscript for review');
  const sub1Id = sub1.json?.submissionId || sub1.json?.id;

  // Admin approves MS 1
  const app1 = await request(
    { path: `/api/admin/author-submissions/${sub1Id}/review`, method: 'POST', headers: { Authorization: `Bearer ${adminToken}` } },
    { action: 'approved', adminNotes: 'Approved 5-page PDF manuscript' }
  );
  assert(app1.statusCode === 200, 'Admin approves 5-page submission');
  const book1Id = app1.json?.book?.id;
  assert(book1Id != null, `Published book ID confirmed: ${book1Id}`);

  // Stream MS 1 PDF
  const stream1 = await request({
    path: `/api/reader/${book1Id}/pdf`,
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(stream1.statusCode === 200, 'PDF endpoint returns HTTP 200');
  assert(stream1.headers['content-type'] === 'application/pdf', 'Content-Type is application/pdf');
  const stream1Hash = sha256(stream1.buffer);
  assert(stream1Hash === pdf5Hash, 'Streamed PDF binary EXACTLY matches original uploaded SHA-256');
  assert(Number(stream1.headers['x-pdf-page-count']) === 5, 'X-PDF-Page-Count header reports exactly 5 pages');

  // Verify /api/reader/:id/content retrieves 5 pages
  const content1 = await request({
    path: `/api/reader/${book1Id}/content`,
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(content1.statusCode === 200, 'Content endpoint returns HTTP 200');
  assert(content1.json?.chapters?.length === 5, 'Retrieved exactly 5 genuine manuscript pages');
  assert(
    content1.json?.chapters[0]?.content?.some((p) => p.includes('KEY_SOM_5_PAGE')),
    'Page 1 contains exact author text and unique key'
  );
  assert(
    content1.json?.chapters[4]?.content?.some((p) => p.includes('KEY_SOM_5_PAGE')),
    'Page 5 contains exact author text and unique key'
  );

  // -------------------------------------------------------------
  // MANUSCRIPT 2: 20-Page PDF
  // -------------------------------------------------------------
  console.log('\n[Manuscript 2] 20-Page Real PDF Manuscript:');
  const pdf20 = createValidPdf('The Architecture of Somali Poetry', 'Dr. Warsame Cilmi', 20, 'KEY_SOM_20_PAGE');
  const pdf20Hash = sha256(pdf20);
  console.log(`  * Generated 20-page PDF: ${pdf20.length} bytes, SHA-256: ${pdf20Hash.slice(0, 16)}...`);

  // Upload MS 2
  const up2 = await request(
    { path: '/api/author/upload-manuscript', method: 'POST', headers: { Authorization: `Bearer ${authorToken}` } },
    { filename: 'architecture_somali_poetry_20p.pdf', format: 'PDF', dataBase64: pdf20.toString('base64') }
  );
  assert(up2.statusCode === 201, 'Uploaded 20-page PDF manuscript');
  assert(up2.json?.size === pdf20.length, 'Uploaded size matches 20-page byte length');

  // Submit MS 2
  const sub2 = await request(
    { path: '/api/author-submissions', method: 'POST', headers: { Authorization: `Bearer ${authorToken}` } },
    {
      title: 'The Architecture of Somali Poetry (20 Pages Complete)',
      subtitle: 'Qaanuunka iyo Miisaanka Maansada',
      author: 'Dr. Warsame Cilmi',
      authorBio: 'Poetry scholar and linguist.',
      authorEmail,
      authorPhone: '+252 61 999 1111',
      language: 'so',
      categorySlug: 'poetry-gabay',
      genre: 'Poetic Metrics & Literary Theory',
      description: 'A comprehensive 20-page treatise on the meter and alliteration of Somali maanso.',
      rightsDeclaration: 'I am the copyright author.',
      manuscriptFilename: up2.json.filename,
      manuscriptFormat: up2.json.format,
      manuscriptSize: up2.json.size,
      manuscriptPath: up2.json.path
    }
  );
  assert(sub2.statusCode === 201, 'Submitted 20-page manuscript for review');
  const sub2Id = sub2.json?.submissionId || sub2.json?.id;

  // Admin approves MS 2
  const app2 = await request(
    { path: `/api/admin/author-submissions/${sub2Id}/review`, method: 'POST', headers: { Authorization: `Bearer ${adminToken}` } },
    { action: 'approved', adminNotes: 'Approved 20-page PDF manuscript' }
  );
  assert(app2.statusCode === 200, 'Admin approves 20-page submission');
  const book2Id = app2.json?.book?.id;
  assert(book2Id != null, `Published book ID confirmed: ${book2Id}`);

  // Stream MS 2 PDF
  const stream2 = await request({
    path: `/api/reader/${book2Id}/pdf`,
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(stream2.statusCode === 200, 'PDF endpoint returns HTTP 200');
  assert(stream2.headers['content-type'] === 'application/pdf', 'Content-Type is application/pdf');
  const stream2Hash = sha256(stream2.buffer);
  assert(stream2Hash === pdf20Hash, 'Streamed PDF binary EXACTLY matches 20-page uploaded SHA-256');
  assert(Number(stream2.headers['x-pdf-page-count']) === 20, 'X-PDF-Page-Count header reports exactly 20 pages');

  // Verify /api/reader/:id/content retrieves all 20 pages
  const content2 = await request({
    path: `/api/reader/${book2Id}/content`,
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(content2.statusCode === 200, 'Content endpoint returns HTTP 200');
  assert(content2.json?.chapters?.length === 20, 'Retrieved exactly 20 genuine manuscript pages (all pages intact)');
  assert(
    content2.json?.chapters[0]?.content?.some((p) => p.includes('KEY_SOM_20_PAGE')),
    'Page 1 contains exact author text and unique key'
  );
  assert(
    content2.json?.chapters[9]?.content?.some((p) => p.includes('KEY_SOM_20_PAGE')),
    'Middle Page 10 contains exact author text'
  );
  assert(
    content2.json?.chapters[19]?.content?.some((p) => p.includes('KEY_SOM_20_PAGE')),
    'Final Page 20 contains exact author text'
  );

  // -------------------------------------------------------------
  // MANUSCRIPT 3: Multi-Chapter Real EPUB Archive
  // -------------------------------------------------------------
  console.log('\n[Manuscript 3] Real Multi-Chapter EPUB Archive:');
  const epubData = createValidEpub(
    'Dhaqanka iyo Hiddaha Soomaaliyeed',
    'Faadumo Nuur',
    [
      {
        title: 'Cutubka 1aad: Hiddaha iyo Dhaqanka Miyiga',
        paragraphs: [
          'Dhaqanka Soomaalidu wuxuu qarniyo badan ku salaysnaa geela, xoolaha, iyo nolosha reer guuraaga ee xorta ah.',
          'Nolosha miyigu ma ahayn mid fudud, laakiin waxay lahayd nidaam iyo anshax adag oo bulshadu ku wada noolaan jirtay.'
        ]
      },
      {
        title: 'Cutubka 2aad: Suugaanta iyo Farshaxanka Hadalka',
        paragraphs: [
          'Afka Soomaaligu waa af hodan ku ah murti, maahmaahyo, iyo maansooyin qoto dheer leh.',
          'Gabaygu wuxuu u adeegi jiray sidii wargeys, taariikh-qore, iyo hubkii lagu heshiisiin jiray colaadaha.'
        ]
      },
      {
        title: 'Cutubka 3aad: Sooyaalka Qoyska iyo Xeerka Soomaaliyeed',
        paragraphs: [
          'Xeerku waa dastuurkii aan qornayn ee beelaha Soomaaliyeed ku heshiin jireen si nabaddu u waarto.',
          'Gartu waxay ahayd mid caddaalad ku dhisan oo qof kasta xaqiisa lagu siiyo iyadoo loo eegayo xeerka.'
        ]
      }
    ]
  );
  const epubHash = sha256(epubData);
  console.log(`  * Generated EPUB archive: ${epubData.length} bytes, SHA-256: ${epubHash.slice(0, 16)}...`);

  // Upload MS 3
  const up3 = await request(
    { path: '/api/author/upload-manuscript', method: 'POST', headers: { Authorization: `Bearer ${authorToken}` } },
    { filename: 'dhaqanka_iyo_hiddaha.epub', format: 'EPUB', dataBase64: epubData.toString('base64') }
  );
  assert(up3.statusCode === 201, 'Uploaded EPUB manuscript');
  assert(up3.json?.format === 'EPUB', 'Format detected as EPUB');

  // Submit MS 3
  const sub3 = await request(
    { path: '/api/author-submissions', method: 'POST', headers: { Authorization: `Bearer ${authorToken}` } },
    {
      title: 'Dhaqanka iyo Hiddaha Soomaaliyeed (EPUB Archive)',
      subtitle: 'Qormooyin ku Saabsan Sooyaalka Soomaalida',
      author: 'Faadumo Nuur',
      authorBio: 'Cultural historian.',
      authorEmail,
      authorPhone: '+252 61 999 2222',
      language: 'so',
      categorySlug: 'somali-history-society',
      genre: 'Cultural Heritage & History',
      description: 'A genuine multi-chapter EPUB on Somali oral heritage.',
      rightsDeclaration: 'I am the copyright author.',
      manuscriptFilename: up3.json.filename,
      manuscriptFormat: up3.json.format,
      manuscriptSize: up3.json.size,
      manuscriptPath: up3.json.path
    }
  );
  assert(sub3.statusCode === 201, 'Submitted EPUB manuscript for review');
  const sub3Id = sub3.json?.submissionId || sub3.json?.id;

  // Admin approves MS 3
  const app3 = await request(
    { path: `/api/admin/author-submissions/${sub3Id}/review`, method: 'POST', headers: { Authorization: `Bearer ${adminToken}` } },
    { action: 'approved', adminNotes: 'Approved EPUB manuscript' }
  );
  assert(app3.statusCode === 200, 'Admin approves EPUB submission');
  const book3Id = app3.json?.book?.id;
  assert(book3Id != null, `Published EPUB book ID confirmed: ${book3Id}`);

  // Stream MS 3 EPUB
  const stream3 = await request({
    path: `/api/reader/${book3Id}/epub`,
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(stream3.statusCode === 200, 'EPUB endpoint returns HTTP 200');
  assert(stream3.headers['content-type'] === 'application/epub+zip', 'Content-Type is application/epub+zip');
  const stream3Hash = sha256(stream3.buffer);
  assert(stream3Hash === epubHash, 'Streamed EPUB binary EXACTLY matches uploaded EPUB archive SHA-256');

  // Verify /api/reader/:id/content retrieves the 3 genuine EPUB chapters
  const content3 = await request({
    path: `/api/reader/${book3Id}/content`,
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(content3.statusCode === 200, 'EPUB content endpoint returns HTTP 200');
  assert(content3.json?.chapters?.length === 3, 'Retrieved all 3 genuine chapters from EPUB archive');
  assert(
    content3.json?.chapters[0]?.title?.includes('Hiddaha iyo Dhaqanka'),
    'Chapter 1 title matches genuine author text'
  );
  assert(
    content3.json?.chapters[2]?.content?.some((p) => p.includes('Xeerku waa dastuurkii')),
    'Chapter 3 content matches genuine author text'
  );

  // -------------------------------------------------------------
  // CROSS-CONTAMINATION & INTEGRITY VERIFICATION
  // -------------------------------------------------------------
  console.log('\n[Integrity] Cross-Contamination & Hash Distinctness Check:');
  assert(pdf5Hash !== pdf20Hash, 'Manuscript 1 hash != Manuscript 2 hash');
  assert(pdf20Hash !== epubHash, 'Manuscript 2 hash != Manuscript 3 hash');
  assert(pdf5Hash !== epubHash, 'Manuscript 1 hash != Manuscript 3 hash');
  assert(stream1Hash !== stream2Hash, 'Stream 1 binary != Stream 2 binary (No cross-contamination)');
  assert(stream2Hash !== stream3Hash, 'Stream 2 binary != Stream 3 binary (No cross-contamination)');

  // -------------------------------------------------------------
  // MISSING MANUSCRIPT POLICY ENFORCEMENT
  // -------------------------------------------------------------
  console.log('\n[Policy] Missing Manuscript Strict Rejection Check:');
  // Request a non-existent or manuscript-less book
  const noMsContent = await request({
    path: '/api/reader/non-existent-book-without-manuscript/content',
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(noMsContent.statusCode === 404, 'Missing manuscript /content returns HTTP 404');

  const noMsPdf = await request({
    path: '/api/reader/non-existent-book-without-manuscript/pdf',
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(noMsPdf.statusCode === 404, 'Missing manuscript /pdf returns HTTP 404');

  const noMsEpub = await request({
    path: '/api/reader/non-existent-book-without-manuscript/epub',
    method: 'GET',
    headers: { Authorization: `Bearer ${authorToken}` }
  });
  assert(noMsEpub.statusCode === 404, 'Missing manuscript /epub returns HTTP 404');

  // Verify the exact mandatory error response
  const expectedMsg = "This book's manuscript is currently unavailable. Please contact the publisher.";
  // Create a book in catalogue that explicitly has no manuscript
  const emptyBookId = `empty-book-${Date.now()}`;
  const createRes = await request(
    { path: '/api/admin/books', method: 'POST', headers: { Authorization: `Bearer ${adminToken}` } },
    {
      title: 'Book Without Uploaded Manuscript',
      author: 'Test Author',
      category: 'Somali Novels & Fiction',
      categorySlug: 'somali-fiction',
      price: 0,
      isFree: true,
      accessStatus: 'free_full_text',
      availableFormats: ['PDF', 'EPUB']
    }
  );
  if (createRes.statusCode === 201) {
    const createdId = createRes.json?.book?.id || createRes.json?.id;
    const missingRes = await request({
      path: `/api/reader/${createdId}/pdf`,
      method: 'GET',
      headers: { Authorization: `Bearer ${authorToken}` }
    });
    assert(missingRes.statusCode === 404, 'Catalog book with no manuscript returns HTTP 404');
    assert(
      missingRes.json?.message === expectedMsg,
      `Exact mandatory error message returned: "${expectedMsg}"`
    );

    // Clean up temporary manuscript-less book
    await request({
      path: `/api/admin/books/${createdId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }

  console.log('\n================================================================');
  console.log(`  All Verification Results: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

/**
 * E2E Platform Verification Test for eBaro Somali-First Digital Reading Platform
 * Tests all 9 objectives from the product upgrade brief.
 */

const http = require('http');

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

async function runTests() {
  console.log('--- Starting eBaro Platform Verification Tests ---\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  try {
    // 1. Admin Sign-in & Role Verification
    console.log('[1/7] Testing Admin Authentication & Role Propagation:');
    const adminSignIn = await request(
      { path: '/api/auth/signin', method: 'POST' },
      { email: 'admin@ebaro.org', password: 'AdminPass2026!' }
    );
    assert(adminSignIn.statusCode === 200, 'Admin can sign in successfully');
    assert(adminSignIn.json?.user?.role === 'admin', 'Admin user has role: "admin"');
    const adminToken = adminSignIn.json?.token;

    // 2. Normal Reader Registration & Role
    console.log('\n[2/7] Testing Reader Registration & Authentication:');
    const testEmail = `reader_${Date.now()}@test.so`;
    const readerReg = await request(
      { path: '/api/auth/register', method: 'POST' },
      {
        fullName: 'Faarax Axmed Cali',
        email: testEmail,
        password: 'ReaderPass2026!',
        confirmPassword: 'ReaderPass2026!',
        agreedToTerms: true
      }
    );
    assert(readerReg.statusCode === 201, 'New reader can register successfully');
    assert(readerReg.json?.user?.role === 'reader', 'New reader receives role: "reader"');
    const readerToken = readerReg.json?.token;

    // 3. EPUB & PDF Streaming with File Integrity Validation
    console.log('\n[3/7] Testing In-Browser EPUB & Archival PDF Document Delivery:');
    const somaliBookId = 'aqoondarro-waa-u-nacab-jacayl';
    const epubRes = await request({
      path: `/api/reader/${somaliBookId}/epub`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    assert(epubRes.statusCode === 200, 'EPUB streaming endpoint returns HTTP 200');
    assert(
      epubRes.buffer[0] === 0x50 && epubRes.buffer[1] === 0x4b,
      'EPUB binary contains valid ZIP signature (PK) for epub.js'
    );

    const pdfRes = await request({
      path: `/api/reader/${somaliBookId}/pdf`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    assert(pdfRes.statusCode === 200, 'PDF streaming endpoint returns HTTP 200');
    assert(
      pdfRes.buffer.toString('utf-8', 0, 4) === '%PDF',
      'PDF binary contains valid PDF signature (%PDF-) for PDF.js'
    );

    // 4. Paid Book Entitlement & Purchase Flow
    console.log('\n[4/7] Testing Sustainable Monetisation & Entitlement Protection:');
    const paidBookId = 'horumarka-nafta-iyo-ganacsiga';
    
    // Check access before purchase (should be 402 Payment Required)
    const blockedRes = await request({
      path: `/api/reader/${paidBookId}/content`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    assert(blockedRes.statusCode === 402, 'Paid book access without purchase is blocked (HTTP 402)');

    // Checkout purchase with Somali Mobile Money (EVC Plus)
    const checkoutRes = await request(
      {
        path: '/api/purchases/checkout',
        method: 'POST',
        headers: { Authorization: `Bearer ${readerToken}` }
      },
      {
        bookId: paidBookId,
        paymentMethod: 'evc_plus',
        mobileNumber: '252615123456'
      }
    );
    assert(checkoutRes.statusCode === 201, 'EVC Plus mobile money checkout succeeds');
    assert(checkoutRes.json?.paymentMethod === 'evc_plus', 'Purchase recorded with EVC Plus method');
    assert(checkoutRes.json?.amount > 0, 'Retail price and purchase transaction confirmed');

    // Check access after purchase (should now be 200 OK)
    const unlockedRes = await request({
      path: `/api/reader/${paidBookId}/content`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    assert(unlockedRes.statusCode === 200, 'Paid book access granted after confirmed purchase (HTTP 200)');

    // 5. Author Submissions & Manuscript Upload Workflow
    console.log('\n[5/7] Testing Author Manuscript Upload & Submission Workflow:');

    // 5A. Reject invalid file format / invalid magic bytes
    const invalidUpload = await request(
      {
        path: '/api/author/upload-manuscript',
        method: 'POST',
        headers: { Authorization: `Bearer ${readerToken}` }
      },
      {
        filename: 'malicious.exe',
        format: 'EXE',
        dataBase64: Buffer.from('MZ_NOT_A_PDF').toString('base64')
      }
    );
    assert(invalidUpload.statusCode === 400, 'Server rejects unsupported/invalid manuscript formats');

    // 5B. Valid PDF manuscript upload
    const validPdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF'
    );
    const uploadRes = await request(
      {
        path: '/api/author/upload-manuscript',
        method: 'POST',
        headers: { Authorization: `Bearer ${readerToken}` }
      },
      {
        filename: 'xiddigaha-maansada.pdf',
        format: 'PDF',
        dataBase64: validPdfBuffer.toString('base64')
      }
    );
    assert(uploadRes.statusCode === 201, 'Author can securely upload PDF manuscript');
    assert(uploadRes.json?.format === 'PDF', 'Manuscript detected and validated as PDF format');
    assert(uploadRes.json?.path != null, 'Manuscript securely stored on disk');

    const manuscriptData = uploadRes.json;

    // 5C. Author submits publishing form with uploaded manuscript
    const submissionRes = await request(
      {
        path: '/api/author-submissions',
        method: 'POST',
        headers: { Authorization: `Bearer ${readerToken}` }
      },
      {
        title: 'Xiddigaha Maansada Cusub',
        subtitle: 'Gabayo iyo Maqaallo',
        author: 'Faarax Axmed Cali',
        authorBio: 'Contemporary Somali poet and cultural essayist.',
        authorEmail: testEmail,
        authorPhone: '+252 61 512 3456',
        language: 'so',
        categorySlug: 'poetry-gabay',
        genre: 'Somali Poetry & Philosophy',
        description: 'A contemporary anthology of pastoral and reflective maanso for 2026.',
        rightsDeclaration: 'I am the sole copyright author and hold all rights.',
        accessPreference: 'free',
        termsAgreed: true,
        manuscriptPath: manuscriptData.path,
        manuscriptFilename: manuscriptData.filename,
        manuscriptFormat: manuscriptData.format,
        manuscriptSize: manuscriptData.size
      }
    );
    assert(submissionRes.statusCode === 201, 'Author can submit work for editorial review');
    assert(submissionRes.json?.status === 'pending', 'New submission defaults to "pending"');
    const submissionId = submissionRes.json?.submissionId;

    // 5D. Admin inspects & downloads author's submitted manuscript
    const adminManuscriptRes = await request({
      path: `/api/admin/author-submissions/${submissionId}/manuscript`,
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminManuscriptRes.statusCode === 200, 'Admin can inspect and download uploaded manuscript');
    assert(adminManuscriptRes.headers['content-type'] === 'application/pdf', 'Admin downloaded manuscript has application/pdf content type');

    // 5E. Admin reviews and approves submission
    const reviewRes = await request(
      {
        path: `/api/admin/author-submissions/${submissionId}/review`,
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      },
      {
        action: 'approved',
        adminNotes: 'Reviewed rights declaration and poetry manuscript; approved for publication.'
      }
    );
    assert(reviewRes.statusCode === 200, 'Administrator can review and approve author submission');
    assert(reviewRes.json?.status === 'approved', 'Submission status updated to "approved"');

    // 5F. Reader accesses approved book PDF, verifying it streams the uploaded manuscript
    const approvedSlug = 'xiddigaha-maansada-cusub';
    const readerBookPdf = await request({
      path: `/api/reader/${approvedSlug}/pdf`,
      method: 'GET',
      headers: { Authorization: `Bearer ${readerToken}` }
    });
    assert(readerBookPdf.statusCode === 200, 'Reader can stream PDF of approved manuscript book');
    assert(readerBookPdf.text.includes('%PDF-1.4'), 'Reader stream contains original uploaded manuscript binary');

    // 6. Copyright Complaint & DMCA Takedown Handling
    console.log('\n[6/7] Testing Copyright Compliance & Dispute Handling:');
    const complaintRes = await request(
      { path: '/api/rights/takedown', method: 'POST' },
      {
        bookId: 'hal-karaan-hadraawi',
        bookTitle: 'Hal-Karaan',
        claimantName: 'Hadraawi Literary Foundation',
        claimantEmail: 'rights@hadraawifoundation.org',
        claimantRelationship: 'Copyright Trustee and Estate',
        infringementDetails: 'We wish to verify the archival reproduction permissions.',
        goodFaithStatement: true,
        accurateStatement: true
      }
    );
    assert(complaintRes.statusCode === 201, 'Copyright complaint received and registered');
    const complaintId = complaintRes.json?.complaintId;

    // Admin resolves complaint
    const resolveRes = await request(
      {
        path: `/api/admin/copyright-complaints/${complaintId}/resolve`,
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      },
      {
        action: 'dismissed',
        resolutionNotes: 'Verified existing non-commercial cultural preservation permissions on file.'
      }
    );
    assert(resolveRes.statusCode === 200, 'Administrator can investigate and resolve copyright notice');
    assert(resolveRes.json?.status === 'dismissed', 'Complaint resolved with audit trail');

    // 7. Admin Quality & Integrity Audit
    console.log('\n[7/8] Testing Admin Catalogue Audit & File Verification:');
    const auditRes = await request({
      path: '/api/admin/audit',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(auditRes.statusCode === 200, 'Admin file audit endpoint returns HTTP 200');
    assert(auditRes.json?.summary?.totalBooks > 0, `Audit scanned ${auditRes.json?.summary?.totalBooks} books in catalogue`);
    const fullTextBooks = auditRes.json?.items?.filter(item => ['free_full_text', 'paid_purchase', 'free_download'].includes(item.accessStatus));
    assert(fullTextBooks.length > 0 && fullTextBooks.every(item => item.hasPdf && item.hasEpub), `Authorized books (${fullTextBooks.length}) have valid PDF & EPUB generation verified`);

    // 8. Admin Book Management (Create, Edit & Delete)
    console.log('\n[8/8] Testing Admin Book Management (Create, Edit & Delete):');
    const testBookSlug = `test-book-${Date.now()}`;
    const createBookRes = await request(
      {
        path: '/api/admin/books',
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      },
      {
        id: testBookSlug,
        title: 'Quruxda Suugaanta Soomaaliyeed',
        author: 'Jaamac Axmed',
        categorySlug: 'somali-fiction',
        isFree: true,
        shortSynopsis: 'Buug baaritaan qoto dheer ku sameynaya suugaanta casriga ah ee Soomaalida.'
      }
    );
    assert(createBookRes.statusCode === 201, 'Admin can create a new book directly');
    assert(createBookRes.json?.book?.id === testBookSlug, 'Created book has correct slug and title');

    // Edit Book
    const editBookRes = await request(
      {
        path: `/api/admin/books/${encodeURIComponent(testBookSlug)}/edit`,
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      },
      {
        title: 'Quruxda Suugaanta Soomaaliyeed (Daabacaad Labaad)',
        price: 4.99,
        isFree: false
      }
    );
    assert(editBookRes.statusCode === 200, 'Admin can edit book metadata and pricing');
    assert(editBookRes.json?.book?.title?.includes('Daabacaad Labaad'), 'Updated book metadata confirmed');

    // Delete Book
    const deleteBookRes = await request({
      path: `/api/admin/books/${encodeURIComponent(testBookSlug)}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(deleteBookRes.statusCode === 200, 'Admin can delete a book from the catalogue');
    assert(deleteBookRes.json?.success === true, 'Book deletion confirmed');

    console.log(`\n========================================`);
    console.log(`Test Summary: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
    console.log(`========================================\n`);

    if (passed === total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();

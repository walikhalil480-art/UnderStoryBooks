import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { db, generateToken, hashPassword, verifyPassword, checkPostgresConnection, MANUSCRIPTS_DIR } from './db';
import { BOOKS } from '../src/data/books';
import { CHILDREN_STORIES, applyVerifiedAlignmentToStory } from '../src/data/childrenStories';
import { runImageDuplicationAudit } from '../src/data/imageRegistry';
import {
  buildBookEpubBuffer,
  buildBookHtmlBuffer,
  buildBookPdfBuffer,
  buildBookTxtBuffer,
  fetchAndCacheGutenbergFullText,
  getCompleteBookChapters
} from './ebookFileBuilder';
import { getManuscriptChapters, getPdfPageCount } from './manuscriptReader';
import {
  buildMeasuredAcousticCalibrationFixture,
  findInstalledAudioAsset,
  getResolvedChildrenStories,
  getResolvedChildrenStoryById,
  removeStoryAudioAndAlignment,
  saveStoryAudioAndAlignment,
  validateStoryAlignmentPayload
} from './storyAudioService';
import { paymentService } from './payments/paymentService';
import { paymentRegistry } from './payments/registry';
import type { PaymentCurrency, PaymentMethodId, PaymentProviderName } from './payments/types';
import type {
  Book,
  BookAccessType,
  EbookAccessStatus,
  EbookFormat,
  ExternalSourceLink,
  KidsLearningProgressPayload,
  StoryLanguageCode
} from '../src/types';
import {
  createInitialKidsProgress,
  evaluateLessonSubmissionAndUpdateProgress,
  normalizeKidsProgressPayload
} from '../src/utils/kidsProgressManager';

// Simple in-memory rate limiter per IP for auth & download endpoints
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, maxRequests = 45, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown, extraHeaders: Record<string, string> = {}) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(payload);
}

function streamAudioBufferWithRange(
  req: IncomingMessage,
  res: ServerResponse,
  buffer: Buffer,
  mimeType: string
) {
  const total = buffer.length;
  const rangeHeader = req.headers.range;

  if (rangeHeader && rangeHeader.startsWith('bytes=')) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

    if (!Number.isNaN(start) && !Number.isNaN(end) && start >= 0 && end < total && start <= end) {
      const chunk = buffer.subarray(start, end + 1);
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunk.length),
        'Content-Type': mimeType,
        'Cache-Control': 'no-store'
      });
      res.end(chunk);
      return;
    }
  }

  res.writeHead(200, {
    'Accept-Ranges': 'bytes',
    'Content-Length': String(total),
    'Content-Type': mimeType,
    'Cache-Control': 'no-store'
  });
  res.end(buffer);
}

function readBody(req: IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 70_000_000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function extractToken(req: IncomingMessage, parsedUrl?: URL): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)folio_session=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  if (parsedUrl) {
    const tokenParam = parsedUrl.searchParams.get('token');
    if (tokenParam) return tokenParam.trim();
  }
  return null;
}

interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: 'reader' | 'author' | 'publisher' | 'admin';
  createdAt: string;
}

function getAuthenticatedUser(req: IncomingMessage, parsedUrl?: URL): AuthenticatedUser | null {
  const token = extractToken(req, parsedUrl);
  if (!token) return null;

  const stmt = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.role, u.created_at, s.expires_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ?
  `);
  const row = stmt.get(token) as
    | { id: string; full_name: string; email: string; role?: string; created_at: string; expires_at: string }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: (row.role as 'reader' | 'author' | 'publisher' | 'admin') || 'reader',
    createdAt: row.created_at
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

function getUserLibraryPayload(userId: string) {
  const entriesRows = db
    .prepare(
      `SELECT id, book_id, status, added_at, updated_at
       FROM user_library
       WHERE user_id = ?
       ORDER BY updated_at DESC`
    )
    .all(userId) as Array<{
    id: string;
    book_id: string;
    status: 'want-to-read' | 'currently-reading' | 'finished';
    added_at: string;
    updated_at: string;
  }>;

  const progressRows = db
    .prepare(
      `SELECT book_id, chapter_index, scroll_percentage, overall_percentage,
              last_read_page, total_pages, preferred_format, last_opened_at
       FROM reading_progress
       WHERE user_id = ?
       ORDER BY last_opened_at DESC`
    )
    .all(userId) as Array<{
    book_id: string;
    chapter_index: number;
    scroll_percentage: number;
    overall_percentage: number;
    last_read_page: number | null;
    total_pages: number | null;
    preferred_format: 'web' | 'pdf' | 'epub' | 'text' | null;
    last_opened_at: string;
  }>;

  const bookmarkRows = db
    .prepare(
      `SELECT id, book_id, chapter_index, chapter_title, note, created_at
       FROM bookmarks
       WHERE user_id = ?
       ORDER BY created_at DESC`
    )
    .all(userId) as Array<{
    id: string;
    book_id: string;
    chapter_index: number;
    chapter_title: string;
    note: string;
    created_at: string;
  }>;

  const historyRows = db
    .prepare(
      `SELECT id, book_id, chapter_index, opened_at
       FROM reading_history
       WHERE user_id = ?
       ORDER BY opened_at DESC
       LIMIT 30`
    )
    .all(userId) as Array<{
    id: string;
    book_id: string;
    chapter_index: number;
    opened_at: string;
  }>;

  const downloadRows = db
    .prepare(
      `SELECT id, book_id, format, file_size_bytes, downloaded_at
       FROM download_history
       WHERE user_id = ? AND status = 'confirmed'
       ORDER BY downloaded_at DESC
       LIMIT 50`
    )
    .all(userId) as Array<{
    id: string;
    book_id: string;
    format: EbookFormat;
    file_size_bytes: number;
    downloaded_at: string;
  }>;

  const prefRow = db
    .prepare(
      `SELECT reader_font_size, reader_theme, reader_line_width
       FROM user_preferences
       WHERE user_id = ?`
    )
    .get(userId) as
    | {
        reader_font_size: number;
        reader_theme: 'ivory' | 'white' | 'dark';
        reader_line_width: 'narrow' | 'medium' | 'wide';
      }
    | undefined;

  return {
    entries: entriesRows.map((r) => ({
      id: r.id,
      bookId: r.book_id,
      status: r.status,
      addedAt: r.added_at,
      updatedAt: r.updated_at
    })),
    progress: progressRows.map((r) => ({
      bookId: r.book_id,
      chapterIndex: r.chapter_index,
      scrollPercentage: r.scroll_percentage,
      overallPercentage: r.overall_percentage,
      lastReadPage: r.last_read_page ?? 1,
      totalPages: r.total_pages ?? 1,
      preferredFormat: r.preferred_format ?? 'web',
      lastOpenedAt: r.last_opened_at
    })),
    bookmarks: bookmarkRows.map((r) => ({
      id: r.id,
      bookId: r.book_id,
      chapterIndex: r.chapter_index,
      chapterTitle: r.chapter_title,
      note: r.note,
      createdAt: r.created_at
    })),
    history: historyRows.map((r) => ({
      id: r.id,
      bookId: r.book_id,
      chapterIndex: r.chapter_index,
      openedAt: r.opened_at
    })),
    downloads: downloadRows.map((r) => ({
      id: r.id,
      bookId: r.book_id,
      format: r.format,
      fileSizeBytes: r.file_size_bytes,
      downloadedAt: r.downloaded_at
    })),
    preferences: {
      readerFontSize: prefRow?.reader_font_size ?? 20,
      readerTheme: prefRow?.reader_theme ?? 'ivory',
      readerLineWidth: prefRow?.reader_line_width ?? 'medium'
    }
  };
}

// Store dynamically discovered Open Library books in memory + SQLite so they can be viewed & bookmarked seamlessly
const dynamicBooksCache = new Map<string, Book>();

export function publishSubmissionToBooks(sub: any) {
  if (!sub || !sub.title) return;
  const slug = sub.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `book-${sub.id.slice(0, 8)}`;
  let isFree = sub.access_preference !== 'paid';
  let price = sub.price ? Number(sub.price) : 0;
  let currency = (sub.currency || 'USD').toUpperCase();
  let accessStatus: EbookAccessStatus = isFree ? 'free_full_text' : 'paid_purchase';

  // Check if SQLite books table already has an admin-configured price or access status
  try {
    const existingDb = db.prepare('SELECT price, currency, access_status FROM books WHERE id = ?').get(slug) as any;
    if (existingDb && existingDb.price !== undefined && existingDb.price !== null && Number(existingDb.price) > 0) {
      price = Number(existingDb.price);
      currency = existingDb.currency || currency;
      isFree = false;
      accessStatus = 'paid_purchase';
    }
  } catch {}

  const categorySlug = sub.category_slug || 'islamic-studies';
  const now = new Date().toISOString();

  let coverUrl = sub.cover_url;
  if (!coverUrl || coverUrl === '/covers/somali/aqoondarro-waa-u-nacab-jacayl.svg') {
    if (categorySlug === 'islamic-studies') {
      coverUrl = '/covers/somali/safinat-an-najah-soomaali.svg';
    } else if (categorySlug === 'language-linguistics') {
      coverUrl = '/covers/somali/naxwaha-af-soomaaliga.svg';
    } else if (categorySlug === 'education-learning') {
      coverUrl = '/covers/somali/aqoonta-sayniska-iyo-dunida.svg';
    } else if (categorySlug === 'self-development-business') {
      coverUrl = '/covers/somali/horumarka-nafta-iyo-ganacsiga.svg';
    } else if (categorySlug === 'biography-memoir') {
      coverUrl = '/covers/somali/halgan-iyo-nolol.svg';
    } else {
      coverUrl = '/covers/somali/safinat-an-najah-soomaali.svg';
    }
  }

  const categoryName =
    categorySlug === 'self-development-business'
      ? 'Business & Self Development'
      : categorySlug === 'islamic-studies'
      ? 'Islamic Literature'
      : categorySlug === 'language-linguistics'
      ? 'Language & Linguistics'
      : categorySlug === 'education-learning'
      ? 'Education & Learning'
      : categorySlug === 'biography-memoir'
      ? 'Biography & Memoir'
      : categorySlug === 'somali-fiction'
      ? 'Somali Novels & Fiction'
      : categorySlug === 'poetry-gabay'
      ? 'Poetry & Gabay'
      : categorySlug === 'history-culture'
      ? 'History & Culture'
      : 'General Literature';

  const newBook: Book = {
    id: slug,
    title: sub.title,
    subtitle: sub.subtitle || undefined,
    author: sub.author,
    authorId: sub.author.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: categoryName,
    categorySlug: categorySlug as any,
    genre: sub.genre || categoryName,
    publishedYear: sub.published_year ? Number(sub.published_year) : new Date().getFullYear(),
    publisher: sub.publisher || 'Published via eBaro Authors',
    pages: 280,
    isbn: sub.isbn || `978-eBaro-${Math.floor(100000 + Math.random() * 900000)}`,
    language: sub.language === 'ar' ? 'Arabic' : sub.language === 'en' ? 'English' : 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus,
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree,
    price,
    currency,
    priceDisplay: isFree ? 'Free Open Access' : `$${price.toFixed(2)} ${currency}`,
    rightsHolder: sub.author,
    licenceEvidence: sub.rights_declaration || 'Approved Author Publishing Declaration',
    distributionPermissions: 'Authorized worldwide digital reading on eBaro',
    coverUrl,
    coverAlt: `Cover of ${sub.title} by ${sub.author}`,
    provenance: {
      sourceProvider: 'eBaro Author Submission Portal',
      sourceBookId: sub.id,
      canonicalSourceUrl: `/books/${slug}`,
      originalFileUrl: coverUrl,
      availableFormats: ['PDF', 'EPUB', 'HTML', 'Plain Text'],
      licenceName: isFree ? 'Author Open-Access Distribution' : 'Authorized Commercial Edition',
      licenceUrl: '',
      copyrightStatus: 'Copyright © Author. Distributed with permission on eBaro.',
      rightsHolder: sub.author,
      licenceEvidence: sub.rights_declaration || 'Direct author submission to eBaro',
      distributionPermissions: 'Authorized worldwide digital distribution on eBaro',
      attributionRequirements: `Credit author ${sub.author}`,
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: now,
      lastSuccessfulAvailabilityCheck: now,
      isOpenAccessAcademic: isFree
    },
    externalSources: [],
    rating: { score: 5.0, count: 1, source: 'eBaro Editorial Approval' },
    shortSynopsis: (sub.description || sub.title).slice(0, 300),
    description: [sub.description || sub.title],
    tableOfContents: [
      'Introduction & Overview',
      'Chapter 1: The Core Principles',
      'Chapter 2: Frameworks & Real-world Practice',
      'Chapter 3: Master Review & Conclusion'
    ],
    sampleChapters: [
      {
        number: 'Opening',
        title: `${sub.title} — Leaf & Opening Chapter`,
        content: [
          sub.description || sub.title,
          sub.sample_text || 'This edition was published via eBaro Authors after verified editorial review and manuscript authenticity inspection.'
        ]
      }
    ],
    rightsNote: sub.rights_declaration || 'Approved and verified digital edition on eBaro.',
    collections: [
      'featured',
      'recently-added',
      'popular',
      isFree ? 'free-ebooks' : 'modern-fiction'
    ],
    isRecentlyAdded: true
  };

  if (sub.manuscript_path) {
    newBook.manuscriptPath = sub.manuscript_path;
    newBook.manuscriptFormat = sub.manuscript_format || (sub.manuscript_path.endsWith('.epub') ? 'EPUB' : 'PDF');
    newBook.provenance.manuscriptPath = sub.manuscript_path;
    newBook.provenance.manuscriptFormat = newBook.manuscriptFormat;
    newBook.provenance.manuscriptFilename = sub.manuscript_filename || '';
    newBook.provenance.manuscriptSize = sub.manuscript_size || 0;
    if (newBook.manuscriptFormat === 'EPUB') {
      newBook.formats = ['Web Reader', 'EPUB'];
    } else if (newBook.manuscriptFormat === 'PDF') {
      newBook.formats = ['Web Reader', 'PDF'];
    }
  }

  dynamicBooksCache.set(newBook.id, newBook);
  const existingIdx = BOOKS.findIndex(b => b.id === newBook.id);
  if (existingIdx >= 0) {
    BOOKS[existingIdx] = newBook;
  } else {
    BOOKS.unshift(newBook);
  }

  // Insert or update into relational SQLite books table so it permanently exists in DB!
  try {
    db.prepare(`
      INSERT INTO books (
        id, title, author, isbn, open_library_work_id, gutenberg_id,
        access_type, access_status, available_formats_json,
        source_provider, source_book_id, canonical_source_url, original_file_url,
        licence_name, licence_url, copyright_status, attribution_requirements,
        local_hosting_permitted, download_permitted, full_text_reading_permitted,
        is_open_access_academic, last_verification_date, last_successful_availability_check,
        price, currency, rights_holder, licence_evidence, distribution_permissions,
        requires_auth, category_slug, published_year, cover_url, rights_note, updated_at,
        manuscript_path, manuscript_format
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        author = excluded.author,
        access_status = excluded.access_status,
        manuscript_path = COALESCE(excluded.manuscript_path, books.manuscript_path),
        manuscript_format = COALESCE(excluded.manuscript_format, books.manuscript_format),
        cover_url = excluded.cover_url,
        category_slug = excluded.category_slug,
        updated_at = excluded.updated_at
    `).run(
      newBook.id, newBook.title, newBook.author, newBook.isbn, '', null,
      newBook.accessType, newBook.accessStatus, JSON.stringify(newBook.availableFormats),
      newBook.provenance.sourceProvider, newBook.provenance.sourceBookId, newBook.provenance.canonicalSourceUrl, newBook.provenance.originalFileUrl,
      newBook.provenance.licenceName, newBook.provenance.licenceUrl, newBook.provenance.copyrightStatus, newBook.provenance.attributionRequirements,
      newBook.provenance.localHostingPermitted ? 1 : 0, newBook.provenance.downloadPermitted ? 1 : 0, newBook.provenance.fullTextReadingPermitted ? 1 : 0,
      newBook.provenance.isOpenAccessAcademic ? 1 : 0, newBook.provenance.lastVerificationDate, newBook.provenance.lastSuccessfulAvailabilityCheck,
      newBook.price, 'USD', newBook.rightsHolder || newBook.author, newBook.licenceEvidence || '', newBook.distributionPermissions || '',
      newBook.requiresAuthForFullText ? 1 : 0, newBook.categorySlug, newBook.publishedYear, newBook.coverUrl, newBook.rightsNote || '', now,
      sub.manuscript_path || null, sub.manuscript_format || null
    );
  } catch (err) {
    console.error('[SQLite Books Persist Error]:', err);
  }

  return newBook;
}

export function findBookById(bookId: string): Book | undefined {
  let book = dynamicBooksCache.get(bookId);

  // Check approved author submissions with genuine manuscripts
  if (!book) {
    try {
      const sub = db
        .prepare(`
          SELECT * FROM author_submissions 
          WHERE status = 'approved' AND (id = ? OR LOWER(REPLACE(title, ' ', '-')) = ?)
          ORDER BY CASE WHEN manuscript_path IS NOT NULL AND manuscript_path != '' THEN 1 ELSE 0 END DESC, reviewed_at DESC
        `)
        .get(bookId, bookId) as any;
      if (sub) {
        book = publishSubmissionToBooks(sub);
      }
    } catch {}
  }

  // Check BOOKS in-memory list
  if (!book) {
    book = BOOKS.find((b) => b.id === bookId);
  }

  // Synchronize genuine manuscript link and pricing directly from relational SQLite database
  if (book) {
    try {
      const dbBook = db.prepare('SELECT manuscript_path, manuscript_format, manuscript_filename, manuscript_size, price, currency, access_status FROM books WHERE id = ?').get(book.id) as any;
      if (dbBook) {
        if (dbBook.price !== undefined && dbBook.price !== null) {
          book.price = Number(dbBook.price);
          book.currency = dbBook.currency || book.currency || 'USD';
          book.isFree = book.price === 0;
          book.priceDisplay = book.isFree
            ? 'Free Open Access'
            : `${book.currency === 'KES' ? 'KES ' : book.currency === 'SOS' ? 'SOS ' : '$'}${book.price.toFixed(2)}${book.currency === 'USD' ? ' USD' : ''}`;
        }
        if (dbBook.access_status) {
          book.accessStatus = dbBook.access_status;
        }
        if (dbBook.manuscript_path && fs.existsSync(dbBook.manuscript_path)) {
          book.manuscriptPath = dbBook.manuscript_path;
          book.manuscriptFormat = dbBook.manuscript_format || (dbBook.manuscript_path.endsWith('.epub') ? 'EPUB' : 'PDF');
          book.provenance.manuscriptPath = dbBook.manuscript_path;
          book.provenance.manuscriptFormat = book.manuscriptFormat;
          if (dbBook.manuscript_filename) book.provenance.manuscriptFilename = dbBook.manuscript_filename;
          if (dbBook.manuscript_size) book.provenance.manuscriptSize = dbBook.manuscript_size;
        }
      }
    } catch {}
  }

  return book;
}

// Automatically load any approved author submissions from SQLite into BOOKS on startup
// Prioritize submissions with genuine manuscripts so they are never overwritten
try {
  const approvedSubs = db.prepare(`
    SELECT * FROM author_submissions 
    WHERE status = 'approved' 
    ORDER BY CASE WHEN manuscript_path IS NOT NULL AND manuscript_path != '' THEN 1 ELSE 0 END ASC, reviewed_at ASC
  `).all();
  for (const s of approvedSubs) {
    publishSubmissionToBooks(s);
  }
} catch (e) {}

export async function handleApiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: any) => void = () => {}
): Promise<void> {
  if (!req.url || !req.url.startsWith('/api/')) {
    return next();
  }

  const hostHeader = req.headers.host || '127.0.0.1:5173';
  const parsedUrl = new URL(req.url, `http://${hostHeader}`);
  const pathname = parsedUrl.pathname;
  const method = req.method || 'GET';
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  try {
    // ==================================================================
    // 0. HEALTH CHECK ENDPOINT (DOCKER / KUBERNETES LIVENESS)
    // ==================================================================
    if (pathname === '/api/health' && method === 'GET') {
      const pgStatus = await checkPostgresConnection();
      const usersCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any)?.c || 0;
      const booksCount = (db.prepare('SELECT COUNT(*) as c FROM books').get() as any)?.c || 0;
      return sendJson(res, 200, {
        status: 'healthy',
        service: 'understory-backend-api',
        database: {
          postgres: pgStatus,
          usersCount,
          booksCount
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    }

    // ==================================================================
    // 1. IMAGE DUPLICATION & CATALOGUE AUDIT ENDPOINTS
    // ==================================================================
    if (pathname === '/api/audit/images' && method === 'GET') {
      const report = runImageDuplicationAudit();
      return sendJson(res, 200, report);
    }

          if (pathname === '/api/books/catalog' && method === 'GET') {
            const dbRows = db.prepare('SELECT * FROM books ORDER BY title ASC').all() as Array<Record<string, any>>;
            const summary = {
              totalBooks: BOOKS.length,
              fullDownloadAvailable: BOOKS.filter((b) => b.accessStatus === 'full_download_available').length,
              fullTextAvailable: BOOKS.filter(
                (b) => b.accessStatus === 'full_text_available' || b.accessStatus === 'full_download_available'
              ).length,
              previewOnly: BOOKS.filter((b) => b.accessStatus === 'preview_only').length,
              externalReading: BOOKS.filter((b) => b.accessStatus === 'external_reading').length,
              metadataOnly: BOOKS.filter((b) => b.accessStatus === 'metadata_only').length,
              pdfCount: BOOKS.filter((b) => b.availableFormats.includes('PDF')).length,
              epubCount: BOOKS.filter((b) => b.availableFormats.includes('EPUB')).length,
              htmlCount: BOOKS.filter((b) => b.availableFormats.includes('HTML')).length,
              txtCount: BOOKS.filter((b) => b.availableFormats.includes('Plain Text')).length,
              records: dbRows
            };
            return sendJson(res, 200, summary);
          }

          if (pathname === '/api/books/published' && method === 'GET') {
            const approvedSubs = db
              .prepare("SELECT * FROM author_submissions WHERE status = 'approved' ORDER BY reviewed_at DESC")
              .all();
            const publishedBooks: Book[] = [];
            const seenIds = new Set<string>();
            for (const s of approvedSubs) {
              const b = publishSubmissionToBooks(s);
              if (b && !seenIds.has(b.id)) {
                seenIds.add(b.id);
                publishedBooks.push(b);
              }
            }
            return sendJson(res, 200, { books: publishedBooks });
          }

          // ==================================================================
          // 2. AUTHENTICATION ENDPOINTS
          // ==================================================================
          if (pathname === '/api/auth/register' && method === 'POST') {
            if (!checkRateLimit(`auth_${clientIp}`, 30)) {
              return sendJson(res, 429, { error: 'Too many requests. Please wait a moment and try again.' });
            }

            const body = await readBody(req);
            const fullName = String(body.fullName || '').trim();
            const email = String(body.email || '').trim().toLowerCase();
            const password = String(body.password || '');
            const confirmPassword = String(body.confirmPassword || '');
            const agreedToTerms = Boolean(body.agreedToTerms);

            if (fullName.length < 2) {
              return sendJson(res, 400, { error: 'Please enter your full name (at least 2 characters).' });
            }
            if (!isValidEmail(email)) {
              return sendJson(res, 400, { error: 'Please enter a valid email address.' });
            }
            const pwError = validatePasswordStrength(password);
            if (pwError) {
              return sendJson(res, 400, { error: pwError });
            }
            if (confirmPassword && password !== confirmPassword) {
              return sendJson(res, 400, { error: 'Passwords do not match.' });
            }
            if (!agreedToTerms) {
              return sendJson(res, 400, { error: 'Please accept the Terms of Service and Privacy Policy to continue.' });
            }

            const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existing) {
              return sendJson(res, 409, {
                error: 'An account with this email address already exists. Please sign in instead.'
              });
            }

            const userId = `usr_${crypto.randomUUID()}`;
            const { hash, salt } = hashPassword(password);
            const now = new Date().toISOString();

            db.prepare(
              `INSERT INTO users (id, full_name, email, password_hash, password_salt, role, created_at)
               VALUES (?, ?, ?, ?, ?, 'reader', ?)`
            ).run(userId, fullName, email, hash, salt, now);

            db.prepare(
              `INSERT INTO user_preferences (user_id, reader_font_size, reader_theme, reader_line_width, updated_at)
               VALUES (?, 20, 'ivory', 'medium', ?)`
            ).run(userId, now);

            const token = generateToken(32);
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            db.prepare(
              `INSERT INTO sessions (token, user_id, created_at, expires_at)
               VALUES (?, ?, ?, ?)`
            ).run(token, userId, now, expiresAt);

            const user: AuthenticatedUser = { id: userId, fullName, email, role: 'reader', createdAt: now };
            return sendJson(
              res,
              201,
              {
                user,
                token,
                library: getUserLibraryPayload(userId)
              },
              {
                'Set-Cookie': `folio_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
              }
            );
          }

          if (pathname === '/api/auth/signin' && method === 'POST') {
            if (!checkRateLimit(`auth_${clientIp}`, 30)) {
              return sendJson(res, 429, { error: 'Too many sign-in attempts. Please wait a moment.' });
            }

            const body = await readBody(req);
            const email = String(body.email || '').trim().toLowerCase();
            const password = String(body.password || '');

            if (!email || !password) {
              return sendJson(res, 400, { error: 'Please enter both your email address and password.' });
            }

            const row = db
              .prepare(
                `SELECT id, full_name, email, role, password_hash, password_salt, created_at
                 FROM users
                 WHERE email = ?`
              )
              .get(email) as
              | {
                  id: string;
                  full_name: string;
                  email: string;
                  role?: string;
                  password_hash: string;
                  password_salt: string;
                  created_at: string;
                }
              | undefined;

            if (!row || !verifyPassword(password, row.password_salt, row.password_hash)) {
              return sendJson(res, 401, {
                error: 'Invalid email or password. Please check your credentials and try again.'
              });
            }

            const token = generateToken(32);
            const now = new Date().toISOString();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            db.prepare(
              `INSERT INTO sessions (token, user_id, created_at, expires_at)
               VALUES (?, ?, ?, ?)`
            ).run(token, row.id, now, expiresAt);

            const user: AuthenticatedUser = {
              id: row.id,
              fullName: row.full_name,
              email: row.email,
              role: (row.role as any) || 'reader',
              createdAt: row.created_at
            };

            return sendJson(
              res,
              200,
              {
                user,
                token,
                library: getUserLibraryPayload(row.id)
              },
              {
                'Set-Cookie': `folio_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
              }
            );
          }

          if (pathname === '/api/auth/signout' && method === 'POST') {
            const token = extractToken(req, parsedUrl);
            if (token) {
              db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
            }
            return sendJson(
              res,
              200,
              { ok: true },
              {
                'Set-Cookie': 'folio_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
              }
            );
          }

          if (pathname === '/api/auth/me' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 200, { user: null, library: null });
            }
            return sendJson(res, 200, {
              user,
              library: getUserLibraryPayload(user.id)
            });
          }

          if (pathname === '/api/auth/forgot-password' && method === 'POST') {
            const body = await readBody(req);
            const email = String(body.email || '').trim().toLowerCase();
            if (!isValidEmail(email)) {
              return sendJson(res, 400, { error: 'Please enter a valid email address.' });
            }

            const userRow = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined;
            if (!userRow) {
              return sendJson(res, 404, {
                error: 'No account was found with that email address. You can create a new free account in seconds.'
              });
            }

            const resetToken = crypto.randomBytes(4).toString('hex').toUpperCase();
            const now = new Date().toISOString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

            db.prepare(
              `INSERT INTO password_resets (token, user_id, email, created_at, expires_at, used)
               VALUES (?, ?, ?, ?, ?, 0)`
            ).run(resetToken, userRow.id, email, now, expiresAt);

            return sendJson(res, 200, {
              ok: true,
              resetToken,
              message: 'Password recovery token generated. Enter the recovery code below to set your new password.'
            });
          }

          if (pathname === '/api/auth/reset-password' && method === 'POST') {
            const body = await readBody(req);
            const email = String(body.email || '').trim().toLowerCase();
            const resetToken = String(body.resetToken || '').trim().toUpperCase();
            const newPassword = String(body.newPassword || '');

            const pwError = validatePasswordStrength(newPassword);
            if (pwError) {
              return sendJson(res, 400, { error: pwError });
            }

            const resetRow = db
              .prepare(
                `SELECT token, user_id, expires_at, used
                 FROM password_resets
                 WHERE token = ? AND email = ?`
              )
              .get(resetToken, email) as
              | { token: string; user_id: string; expires_at: string; used: number }
              | undefined;

            if (!resetRow || resetRow.used === 1 || new Date(resetRow.expires_at).getTime() < Date.now()) {
              return sendJson(res, 400, { error: 'Invalid or expired password recovery code.' });
            }

            const { hash, salt } = hashPassword(newPassword);
            db.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').run(
              hash,
              salt,
              resetRow.user_id
            );
            db.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').run(resetToken);

            return sendJson(res, 200, {
              ok: true,
              message: 'Your password has been updated. You can now sign in with your new password.'
            });
          }

          if (pathname === '/api/auth/change-password' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Please sign in to change your password.' });
            }

            const body = await readBody(req);
            const currentPassword = String(body.currentPassword || '');
            const newPassword = String(body.newPassword || '');

            const pwError = validatePasswordStrength(newPassword);
            if (pwError) {
              return sendJson(res, 400, { error: pwError });
            }

            const row = db
              .prepare('SELECT password_hash, password_salt FROM users WHERE id = ?')
              .get(user.id) as { password_hash: string; password_salt: string } | undefined;

            if (!row || !verifyPassword(currentPassword, row.password_salt, row.password_hash)) {
              return sendJson(res, 400, { error: 'Your current password is incorrect.' });
            }

            const { hash, salt } = hashPassword(newPassword);
            db.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').run(hash, salt, user.id);

            return sendJson(res, 200, {
              ok: true,
              message: 'Your password has been changed successfully.'
            });
          }

          if (pathname === '/api/auth/profile' && method === 'PUT') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }
            const body = await readBody(req);
            const fullName = String(body.fullName || '').trim();
            if (fullName.length < 2) {
              return sendJson(res, 400, { error: 'Full name must be at least 2 characters.' });
            }
            db.prepare('UPDATE users SET full_name = ? WHERE id = ?').run(fullName, user.id);
            return sendJson(res, 200, {
              user: { ...user, fullName }
            });
          }

          // ==================================================================
          // 3. PROTECTED EBOOK READER CONTENT & IN-BROWSER PDF ENDPOINTS
          // ==================================================================
          const readerMatch = pathname.match(/^\/api\/reader\/([^/]+)\/content$/);
          if (readerMatch && method === 'GET') {
            const bookId = decodeURIComponent(readerMatch[1]);
            const book = findBookById(bookId);

            if (!book) {
              return sendJson(res, 404, { error: 'Book not found in the Folio catalogue.' });
            }

            if (book.accessStatus === 'unavailable') {
              return sendJson(res, 403, {
                error: 'UNAVAILABLE',
                message: 'This book edition is currently unavailable or undergoing rights review.'
              });
            }

            if (book.accessType === 'metadata-only' || book.accessStatus === 'metadata_only') {
              return sendJson(res, 403, {
                error: 'METADATA_ONLY',
                message:
                  'Full-text reading is unavailable for this edition due to publisher copyright restrictions. You may view its bibliographic record or check Open Library availability.'
              });
            }

            const user = getAuthenticatedUser(req, parsedUrl);

            // Enforce purchase entitlement for paid ebooks
            if (book.accessStatus === 'paid_purchase' || (book.price > 0 && !book.isFree)) {
              if (!user) {
                return sendJson(res, 401, {
                  error: 'AUTHENTICATION_REQUIRED',
                  message: 'Sign in to access your purchased edition or buy this book.'
                });
              }
              if (!paymentService.checkUserEntitlement(user.id, book.id, user.role)) {
                return sendJson(res, 402, {
                  error: 'PURCHASE_REQUIRED',
                  bookId: book.id,
                  bookTitle: book.title,
                  price: book.price,
                  currency: book.currency || 'USD',
                  message: 'This premium edition requires purchase to read online or download.'
                });
              }
            }

            // Enforce server-side authentication for full-text books!
            if (book.accessType === 'full-text' || book.requiresAuthForFullText) {
              if (!user) {
                return sendJson(res, 401, {
                  error: 'AUTHENTICATION_REQUIRED',
                  headline: 'Your next chapter starts here.',
                  message:
                    'Create your free account to read full books, download eligible ebooks, and save your reading progress.',
                  bookId: book.id,
                  bookTitle: book.title
                });
              }
            }

            let chapters: BookChapter[] = [];
            const manuscriptPath = book.manuscriptPath || book.provenance?.manuscriptPath;
            if (manuscriptPath) {
              if (!fs.existsSync(manuscriptPath)) {
                return sendJson(res, 404, {
                  error: 'MANUSCRIPT_UNAVAILABLE',
                  message: "This book's manuscript is currently unavailable. Please contact the publisher."
                });
              }
              try {
                const msChapters = await getManuscriptChapters(book);
                if (msChapters && msChapters.length > 0) {
                  chapters = msChapters;
                } else {
                  return sendJson(res, 404, {
                    error: 'MANUSCRIPT_UNAVAILABLE',
                    message: "This book's manuscript is currently unavailable. Please contact the publisher."
                  });
                }
              } catch (err: any) {
                console.error('[Manuscript Extraction Error]:', err);
                return sendJson(res, 404, {
                  error: 'MANUSCRIPT_UNAVAILABLE',
                  message: "This book's manuscript is currently unavailable. Please contact the publisher."
                });
              }
            } else {
              chapters = getCompleteBookChapters(book);
              if (chapters.length === 0) {
                const isPdf = book.manuscriptFormat === 'PDF' || book.availableFormats.includes('PDF');
                if (!isPdf) {
                  return sendJson(res, 404, {
                    error: 'MANUSCRIPT_UNAVAILABLE',
                    message: "This book's manuscript is currently unavailable. Please contact the publisher."
                  });
                }
              }
            }
            if (book.accessStatus === 'preview_only' || book.accessType === 'preview-only') {
              chapters = chapters.slice(0, 2);
            }

            // Record in reading_history and ensure a reading_progress entry exists if user is signed in
            let savedProgress = null;
            if (user) {
              const now = new Date().toISOString();
              const existingProgress = db
                .prepare(
                  `SELECT chapter_index, scroll_percentage, overall_percentage,
                          last_read_page, total_pages, preferred_format, last_opened_at
                   FROM reading_progress
                   WHERE user_id = ? AND book_id = ?`
                )
                .get(user.id, book.id) as
                | {
                    chapter_index: number;
                    scroll_percentage: number;
                    overall_percentage: number;
                    last_read_page: number | null;
                    total_pages: number | null;
                    preferred_format: 'web' | 'pdf' | 'epub' | 'text' | null;
                    last_opened_at: string;
                  }
                | undefined;

              const chapterIdx = existingProgress?.chapter_index ?? 0;

              db.prepare(
                `INSERT INTO reading_history (id, user_id, book_id, chapter_index, opened_at)
                 VALUES (?, ?, ?, ?, ?)`
              ).run(`hist_${crypto.randomUUID()}`, user.id, book.id, chapterIdx, now);

              if (!existingProgress) {
                const initialPct = Math.round((1 / Math.max(1, chapters.length)) * 100);
                db.prepare(
                  `INSERT INTO reading_progress (
                     user_id, book_id, chapter_index, scroll_percentage, overall_percentage,
                     last_read_page, total_pages, preferred_format, last_opened_at
                   ) VALUES (?, ?, 0, 0, ?, 1, 1, 'web', ?)`
                ).run(user.id, book.id, initialPct, now);
                savedProgress = {
                  bookId: book.id,
                  chapterIndex: 0,
                  scrollPercentage: 0,
                  overallPercentage: initialPct,
                  lastReadPage: 1,
                  totalPages: 1,
                  preferredFormat: 'web' as const,
                  lastOpenedAt: now
                };
              } else {
                db.prepare(`UPDATE reading_progress SET last_opened_at = ? WHERE user_id = ? AND book_id = ?`).run(
                  now,
                  user.id,
                  book.id
                );
                savedProgress = {
                  bookId: book.id,
                  chapterIndex: existingProgress.chapter_index,
                  scrollPercentage: existingProgress.scroll_percentage,
                  overallPercentage: existingProgress.overall_percentage,
                  lastReadPage: existingProgress.last_read_page ?? 1,
                  totalPages: existingProgress.total_pages ?? 1,
                  preferredFormat: existingProgress.preferred_format ?? 'web',
                  lastOpenedAt: now
                };
              }

              // Also add to user_library as 'currently-reading' if not already in user_library
              const existingLib = db
                .prepare('SELECT id FROM user_library WHERE user_id = ? AND book_id = ?')
                .get(user.id, book.id);
              if (!existingLib) {
                db.prepare(
                  `INSERT INTO user_library (id, user_id, book_id, status, added_at, updated_at)
                   VALUES (?, ?, ?, 'currently-reading', ?, ?)`
                ).run(`lib_${crypto.randomUUID()}`, user.id, book.id, now, now);
              }
            }

            return sendJson(res, 200, {
              bookId: book.id,
              title: book.title,
              author: book.author,
              accessType: book.accessType,
              accessStatus: book.accessStatus,
              availableFormats: book.availableFormats,
              provenance: book.provenance,
              rightsNote: book.rightsNote,
              gutenbergId: book.gutenbergId,
              externalSources: book.externalSources,
              chapters,
              tableOfContents: chapters.map((c) => `${c.number} — ${c.title}`),
              savedProgress
            });
          }

          // Fetch live unabridged Project Gutenberg text on demand for registered users
          const fullTextMatch = pathname.match(/^\/api\/reader\/([^/]+)\/fulltext$/);
          if (fullTextMatch && method === 'GET') {
            const bookId = decodeURIComponent(fullTextMatch[1]);
            const book = findBookById(bookId);
            if (!book) {
              return sendJson(res, 404, { error: 'Book not found.' });
            }
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, {
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Create your free account to read full books, download eligible ebooks, and save your reading progress.'
              });
            }
            if (!book.provenance.fullTextReadingPermitted) {
              return sendJson(res, 403, { error: 'Full-text reading is not permitted for this edition.' });
            }
            const chapters = await fetchAndCacheGutenbergFullText(book);
            return sendJson(res, 200, {
              bookId: book.id,
              chapters,
              tableOfContents: chapters.map((c) => `${c.number} — ${c.title}`)
            });
          }

          // Stream valid multi-page PDF binary for the in-browser PDF.js Reader
          const readerPdfMatch = pathname.match(/^\/api\/reader\/([^/]+)\/pdf$/);
          if (readerPdfMatch && method === 'GET') {
            const bookId = decodeURIComponent(readerPdfMatch[1]);
            const book = findBookById(bookId);
            if (!book) {
              return sendJson(res, 404, { error: 'Book not found.' });
            }
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, {
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Create your free account to read full books, download eligible ebooks, and save your reading progress.'
              });
            }
            if (book.accessStatus === 'unavailable' || book.accessStatus === 'metadata_only') {
              return sendJson(res, 403, {
                error: 'PDF_UNAVAILABLE',
                message: 'PDF access is not permitted for this edition.'
              });
            }
            if (book.accessStatus === 'paid_purchase' || (book.price > 0 && !book.isFree)) {
              if (!paymentService.checkUserEntitlement(user.id, book.id, user.role)) {
                return sendJson(res, 402, {
                  error: 'PURCHASE_REQUIRED',
                  message: 'This premium edition must be purchased before reading the full PDF.'
                });
              }
            }
            if (!book.provenance.fullTextReadingPermitted || !book.availableFormats.includes('PDF')) {
              return sendJson(res, 403, {
                error: 'PDF_UNAVAILABLE',
                message: 'Full PDF access is not available for this edition due to copyright restrictions.'
              });
            }

            const manuscriptPath = book.manuscriptPath || book.provenance.manuscriptPath;
            if (manuscriptPath && (book.manuscriptFormat === 'PDF' || manuscriptPath.toLowerCase().endsWith('.pdf'))) {
              if (!fs.existsSync(manuscriptPath)) {
                return sendJson(res, 404, {
                  error: 'MANUSCRIPT_UNAVAILABLE',
                  message: "This book's manuscript is currently unavailable. Please contact the publisher."
                });
              }
              const fileBuf = fs.readFileSync(manuscriptPath);
              const realPageCount = await getPdfPageCount(fileBuf);
              res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': String(fileBuf.length),
                'Content-Disposition': `inline; filename="${book.id}-manuscript.pdf"`,
                'X-PDF-Page-Count': String(realPageCount),
                'Cache-Control': 'private, max-age=300'
              });
              return res.end(fileBuf);
            }

            try {
              const { buffer, pageCount } = buildBookPdfBuffer(book);
              res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': String(buffer.length),
                'Content-Disposition': `inline; filename="${book.id}-folio-edition.pdf"`,
                'X-PDF-Page-Count': String(pageCount),
                'Cache-Control': 'private, max-age=300'
              });
              return res.end(buffer);
            } catch (err: any) {
              return sendJson(res, 404, {
                error: 'MANUSCRIPT_UNAVAILABLE',
                message: "This book's manuscript is currently unavailable. Please contact the publisher."
              });
            }
          }

          // Stream valid EPUB archive for the in-browser EPUB reader
          const readerEpubMatch = pathname.match(/^\/api\/reader\/([^/]+)\/epub$/);
          if (readerEpubMatch && method === 'GET') {
            const bookId = decodeURIComponent(readerEpubMatch[1]);
            const book = findBookById(bookId);
            if (!book) {
              return sendJson(res, 404, { error: 'Book not found.' });
            }
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, {
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Create your free account to read full books in the in-browser EPUB reader.'
              });
            }
            if (book.accessStatus === 'unavailable' || book.accessStatus === 'metadata_only') {
              return sendJson(res, 403, {
                error: 'EPUB_UNAVAILABLE',
                message: 'EPUB reading is unavailable for this edition due to publisher copyright restrictions.'
              });
            }
            if (book.accessStatus === 'paid_purchase' || (book.price > 0 && !book.isFree)) {
              if (!paymentService.checkUserEntitlement(user.id, book.id, user.role)) {
                return sendJson(res, 402, {
                  error: 'PURCHASE_REQUIRED',
                  message: 'This premium edition must be purchased before reading the complete EPUB.'
                });
              }
            }

            const manuscriptPath = book.manuscriptPath || book.provenance.manuscriptPath;
            if (manuscriptPath && (book.manuscriptFormat === 'EPUB' || manuscriptPath.toLowerCase().endsWith('.epub'))) {
              if (!fs.existsSync(manuscriptPath)) {
                return sendJson(res, 404, {
                  error: 'MANUSCRIPT_UNAVAILABLE',
                  message: "This book's manuscript is currently unavailable. Please contact the publisher."
                });
              }
              const epubBuf = fs.readFileSync(manuscriptPath);
              res.writeHead(200, {
                'Content-Type': 'application/epub+zip',
                'Content-Length': String(epubBuf.length),
                'Content-Disposition': `inline; filename="${book.id}-manuscript.epub"`,
                'Cache-Control': 'private, max-age=300'
              });
              return res.end(epubBuf);
            }

            try {
              const epubBuffer = buildBookEpubBuffer(book);
              res.writeHead(200, {
                'Content-Type': 'application/epub+zip',
                'Content-Length': String(epubBuffer.length),
                'Content-Disposition': `inline; filename="${book.id}-edition.epub"`,
                'Cache-Control': 'private, max-age=300'
              });
              return res.end(epubBuffer);
            } catch (err: any) {
              return sendJson(res, 404, {
                error: 'MANUSCRIPT_UNAVAILABLE',
                message: "This book's manuscript is currently unavailable. Please contact the publisher."
              });
            }
          }

          // ==================================================================
          // 4. PROTECTED EBOOK DOWNLOAD ENDPOINT (/api/download/:bookId/:format)
          // ==================================================================
          const downloadMatch = pathname.match(/^\/api\/download\/([^/]+)\/([^/]+)$/);
          if (downloadMatch && method === 'GET') {
            if (!checkRateLimit(`dl_${clientIp}`, 40)) {
              return sendJson(res, 429, { error: 'Too many download requests. Please wait a moment.' });
            }

            const bookId = decodeURIComponent(downloadMatch[1]);
            const rawFormat = decodeURIComponent(downloadMatch[2]).toLowerCase();
            const book = findBookById(bookId);

            if (!book) {
              return sendJson(res, 404, { error: 'Book not found in the Folio catalogue.' });
            }

            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, {
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Create your free account to read full books, download eligible ebooks, and save your reading progress.'
              });
            }

            // Enforce access classification: preview_only, external_reading, metadata_only, unavailable CANNOT download full books
            if (
              !book.provenance.downloadPermitted ||
              book.accessStatus === 'preview_only' ||
              book.accessStatus === 'metadata_only' ||
              book.accessStatus === 'external_reading' ||
              book.accessStatus === 'unavailable'
            ) {
              return sendJson(res, 403, {
                error: 'DOWNLOAD_NOT_PERMITTED',
                message:
                  book.accessStatus === 'preview_only'
                    ? 'Only a sample preview is available for this copyrighted edition. Full-book download is not permitted.'
                    : 'Full-book file download is unavailable for this edition.'
              });
            }

            // Enforce purchase requirement for paid downloads
            if (book.accessStatus === 'paid_purchase' || (book.price > 0 && !book.isFree)) {
              if (!paymentService.checkUserEntitlement(user.id, book.id, user.role)) {
                return sendJson(res, 402, {
                  error: 'PURCHASE_REQUIRED',
                  message: 'This premium edition must be purchased before downloading.'
                });
              }
            }

            let fileBuffer: Buffer;
            let contentType: string;
            let fileExt: string;
            let canonicalFormat: EbookFormat;

            if (rawFormat === 'pdf') {
              if (!book.availableFormats.includes('PDF')) {
                return sendJson(res, 403, { error: 'PDF format is not available for this book.' });
              }
              const manuscriptPath = book.manuscriptPath || book.provenance.manuscriptPath;
              if (manuscriptPath && fs.existsSync(manuscriptPath) && (book.manuscriptFormat === 'PDF' || manuscriptPath.endsWith('.pdf'))) {
                fileBuffer = fs.readFileSync(manuscriptPath);
              } else {
                const built = buildBookPdfBuffer(book);
                fileBuffer = built.buffer;
              }
              contentType = 'application/pdf';
              fileExt = 'pdf';
              canonicalFormat = 'PDF';
            } else if (rawFormat === 'epub') {
              if (!book.availableFormats.includes('EPUB')) {
                return sendJson(res, 403, { error: 'EPUB format is not available for this book.' });
              }
              const manuscriptPath = book.manuscriptPath || book.provenance.manuscriptPath;
              if (manuscriptPath && fs.existsSync(manuscriptPath) && (book.manuscriptFormat === 'EPUB' || manuscriptPath.endsWith('.epub'))) {
                fileBuffer = fs.readFileSync(manuscriptPath);
              } else {
                fileBuffer = buildBookEpubBuffer(book);
              }
              contentType = 'application/epub+zip';
              fileExt = 'epub';
              canonicalFormat = 'EPUB';
            } else if (rawFormat === 'html') {
              if (!book.availableFormats.includes('HTML')) {
                return sendJson(res, 403, { error: 'HTML format is not available for this book.' });
              }
              fileBuffer = buildBookHtmlBuffer(book);
              contentType = 'text/html; charset=utf-8';
              fileExt = 'html';
              canonicalFormat = 'HTML';
            } else if (rawFormat === 'txt' || rawFormat === 'text' || rawFormat === 'plain-text') {
              if (!book.availableFormats.includes('Plain Text')) {
                return sendJson(res, 403, { error: 'Plain Text format is not available for this book.' });
              }
              fileBuffer = buildBookTxtBuffer(book);
              contentType = 'text/plain; charset=utf-8';
              fileExt = 'txt';
              canonicalFormat = 'Plain Text';
            } else {
              return sendJson(res, 400, {
                error: 'UNSUPPORTED_FORMAT',
                message: 'Supported download formats are pdf, epub, html, and txt.'
              });
            }

            if (!fileBuffer || fileBuffer.length < 100) {
              return sendJson(res, 500, { error: 'Generated ebook file failed integrity verification.' });
            }

            // Record confirmed download in SQLite download_history
            const now = new Date().toISOString();
            db.prepare(
              `INSERT INTO download_history (id, user_id, book_id, format, file_size_bytes, status, downloaded_at)
               VALUES (?, ?, ?, ?, ?, 'confirmed', ?)`
            ).run(`dl_${crypto.randomUUID()}`, user.id, book.id, canonicalFormat, fileBuffer.length, now);

            // Also ensure book is saved in user_library so it appears in their library
            const existingLib = db
              .prepare('SELECT id FROM user_library WHERE user_id = ? AND book_id = ?')
              .get(user.id, book.id);
            if (!existingLib) {
              db.prepare(
                `INSERT INTO user_library (id, user_id, book_id, status, added_at, updated_at)
                 VALUES (?, ?, ?, 'want-to-read', ?, ?)`
              ).run(`lib_${crypto.randomUUID()}`, user.id, book.id, now, now);
            }

            const safeFilename = `${book.id}-folio-archival-edition.${fileExt}`;
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': String(fileBuffer.length),
              'Content-Disposition': `attachment; filename="${safeFilename}"`,
              'X-Folio-Format': canonicalFormat,
              'X-Folio-License': book.provenance.licenceName,
              'Cache-Control': 'no-store'
            });
            return res.end(fileBuffer);
          }

          // ==================================================================
          // 5. USER PERSONAL LIBRARY, PROGRESS & BOOKMARK ENDPOINTS
          // ==================================================================
          if (pathname === '/api/library' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }
            return sendJson(res, 200, getUserLibraryPayload(user.id));
          }

          if (pathname === '/api/library/status' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required to manage your personal library.' });
            }
            const body = await readBody(req);
            const bookId = String(body.bookId || '');
            const status = String(body.status || '');
            if (!bookId) {
              return sendJson(res, 400, { error: 'bookId is required.' });
            }

            const now = new Date().toISOString();
            if (status === 'remove') {
              db.prepare('DELETE FROM user_library WHERE user_id = ? AND book_id = ?').run(user.id, bookId);
            } else if (['want-to-read', 'currently-reading', 'finished'].includes(status)) {
              db.prepare(
                `INSERT INTO user_library (id, user_id, book_id, status, added_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON CONFLICT(user_id, book_id) DO UPDATE SET
                   status = excluded.status,
                   updated_at = excluded.updated_at`
              ).run(`lib_${crypto.randomUUID()}`, user.id, bookId, status, now, now);
            } else {
              return sendJson(res, 400, { error: 'Invalid library status.' });
            }

            return sendJson(res, 200, getUserLibraryPayload(user.id));
          }

          if (pathname === '/api/library/progress' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required to save reading progress.' });
            }
            const body = await readBody(req);
            const bookId = String(body.bookId || '');
            const chapterIndex = Math.max(0, Number(body.chapterIndex ?? 0));
            const scrollPercentage = Math.min(100, Math.max(0, Math.round(Number(body.scrollPercentage ?? 0))));
            const overallPercentage = Math.min(100, Math.max(0, Math.round(Number(body.overallPercentage ?? 0))));
            const lastReadPage = Math.max(1, Number(body.lastReadPage ?? 1));
            const totalPages = Math.max(1, Number(body.totalPages ?? 1));
            const preferredFormat = ['web', 'pdf', 'epub', 'text'].includes(body.preferredFormat)
              ? body.preferredFormat
              : 'web';

            if (!bookId) {
              return sendJson(res, 400, { error: 'bookId is required.' });
            }

            const now = new Date().toISOString();
            db.prepare(
              `INSERT INTO reading_progress (
                 user_id, book_id, chapter_index, scroll_percentage, overall_percentage,
                 last_read_page, total_pages, preferred_format, last_opened_at
               )
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(user_id, book_id) DO UPDATE SET
                 chapter_index = excluded.chapter_index,
                 scroll_percentage = excluded.scroll_percentage,
                 overall_percentage = excluded.overall_percentage,
                 last_read_page = CASE WHEN ? IS NOT NULL THEN excluded.last_read_page ELSE reading_progress.last_read_page END,
                 total_pages = CASE WHEN ? IS NOT NULL THEN excluded.total_pages ELSE reading_progress.total_pages END,
                 preferred_format = excluded.preferred_format,
                 last_opened_at = excluded.last_opened_at`
            ).run(
              user.id,
              bookId,
              chapterIndex,
              scrollPercentage,
              overallPercentage,
              lastReadPage,
              totalPages,
              preferredFormat,
              now,
              body.lastReadPage !== undefined ? 1 : null,
              body.totalPages !== undefined ? 1 : null
            );

            const targetStatus = overallPercentage >= 98 ? 'finished' : 'currently-reading';
            db.prepare(
              `INSERT INTO user_library (id, user_id, book_id, status, added_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(user_id, book_id) DO UPDATE SET
                 status = CASE WHEN user_library.status = 'finished' AND excluded.status = 'currently-reading' THEN 'finished' ELSE excluded.status END,
                 updated_at = excluded.updated_at`
            ).run(`lib_${crypto.randomUUID()}`, user.id, bookId, targetStatus, now, now);

            return sendJson(res, 200, getUserLibraryPayload(user.id));
          }

          if (pathname === '/api/library/bookmarks' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required to save bookmarks.' });
            }
            const body = await readBody(req);
            const bookId = String(body.bookId || '');
            const chapterIndex = Number(body.chapterIndex ?? 0);
            const chapterTitle = String(body.chapterTitle || 'Saved Bookmark');
            const note = String(body.note || '').trim();
            const toggleBookLevel = Boolean(body.toggleBookLevel);

            if (!bookId) {
              return sendJson(res, 400, { error: 'bookId is required.' });
            }

            if (toggleBookLevel) {
              const existing = db
                .prepare('SELECT id FROM bookmarks WHERE user_id = ? AND book_id = ?')
                .get(user.id, bookId) as { id: string } | undefined;
              if (existing) {
                db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND book_id = ?').run(user.id, bookId);
                return sendJson(res, 200, getUserLibraryPayload(user.id));
              }
            }

            const now = new Date().toISOString();
            db.prepare(
              `INSERT INTO bookmarks (id, user_id, book_id, chapter_index, chapter_title, note, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)`
            ).run(`bm_${crypto.randomUUID()}`, user.id, bookId, chapterIndex, chapterTitle, note, now);

            // Also ensure it is in user_library if not present
            const inLib = db
              .prepare('SELECT id FROM user_library WHERE user_id = ? AND book_id = ?')
              .get(user.id, bookId);
            if (!inLib) {
              db.prepare(
                `INSERT INTO user_library (id, user_id, book_id, status, added_at, updated_at)
                 VALUES (?, ?, ?, 'want-to-read', ?, ?)`
              ).run(`lib_${crypto.randomUUID()}`, user.id, bookId, now, now);
            }

            return sendJson(res, 200, getUserLibraryPayload(user.id));
          }

          if (pathname === '/api/library/bookmarks' && method === 'DELETE') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }
            const bookmarkId = parsedUrl.searchParams.get('id');
            const bookId = parsedUrl.searchParams.get('bookId');
            if (bookmarkId) {
              db.prepare('DELETE FROM bookmarks WHERE id = ? AND user_id = ?').run(bookmarkId, user.id);
            } else if (bookId) {
              db.prepare('DELETE FROM bookmarks WHERE book_id = ? AND user_id = ?').run(bookId, user.id);
            }
            return sendJson(res, 200, getUserLibraryPayload(user.id));
          }

          if (pathname === '/api/library/preferences' && method === 'PUT') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }
            const body = await readBody(req);
            const readerFontSize = Math.min(28, Math.max(15, Number(body.readerFontSize ?? 20)));
            const readerTheme = ['ivory', 'white', 'dark'].includes(body.readerTheme)
              ? body.readerTheme
              : 'ivory';
            const readerLineWidth = ['narrow', 'medium', 'wide'].includes(body.readerLineWidth)
              ? body.readerLineWidth
              : 'medium';
            const now = new Date().toISOString();

            db.prepare(
              `INSERT INTO user_preferences (user_id, reader_font_size, reader_theme, reader_line_width, updated_at)
               VALUES (?, ?, ?, ?, ?)
               ON CONFLICT(user_id) DO UPDATE SET
                 reader_font_size = excluded.reader_font_size,
                 reader_theme = excluded.reader_theme,
                 reader_line_width = excluded.reader_line_width,
                 updated_at = excluded.updated_at`
            ).run(user.id, readerFontSize, readerTheme, readerLineWidth, now);

            return sendJson(res, 200, getUserLibraryPayload(user.id));
          }

          // ==================================================================
          // 6. LIVE OPEN LIBRARY + PROJECT GUTENBERG SEARCH API INTEGRATION
          // ==================================================================
          if (pathname === '/api/books/search-openlibrary' && method === 'GET') {
            const query = (parsedUrl.searchParams.get('q') || '').trim();
            if (query.length < 2) {
              return sendJson(res, 200, { books: [], cached: false });
            }

            const cacheKey = `ol_search_v2_${query.toLowerCase()}`;
            const cachedRow = db
              .prepare('SELECT response_json, cached_at FROM book_metadata_cache WHERE query_key = ?')
              .get(cacheKey) as { response_json: string; cached_at: string } | undefined;

            if (cachedRow && Date.now() - new Date(cachedRow.cached_at).getTime() < 24 * 60 * 60 * 1000) {
              const parsed = JSON.parse(cachedRow.response_json) as Book[];
              for (const b of parsed) dynamicBooksCache.set(b.id, b);
              return sendJson(res, 200, { books: parsed, cached: true });
            }

            const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
              query
            )}&limit=10&fields=key,title,subtitle,author_name,first_publish_year,isbn,cover_i,publisher,number_of_pages_median,subject,ebook_access,ia,id_project_gutenberg,ratings_average,ratings_count`;

            const response = await fetch(olUrl, {
              headers: { 'User-Agent': 'FolioDigitalLibrary/2.0 (https://openlibrary.org)' }
            });

            if (!response.ok) {
              return sendJson(res, 200, { books: [], error: 'Open Library service temporarily unavailable.' });
            }

            const data = (await response.json()) as { docs?: Array<Record<string, any>> };
            const docs = data.docs || [];

            const normalizedBooks: Book[] = docs
              .filter((doc) => doc.title && Array.isArray(doc.author_name) && doc.author_name.length > 0)
              .map((doc) => {
                const workId = String(doc.key || '').replace('/works/', '') || `OL_${crypto.randomUUID().slice(0, 8)}`;
                const id = `ol-${workId.toLowerCase()}`;
                const title = String(doc.title);
                const author = String(doc.author_name[0]);
                const publishedYear = Number(doc.first_publish_year || 1950);
                const isbn =
                  Array.isArray(doc.isbn) && doc.isbn.length > 0
                    ? String(doc.isbn[0])
                    : 'Verified Open Library Record';
                const coverId = doc.cover_i;
                const coverUrl = coverId
                  ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                  : isbn !== 'Verified Open Library Record'
                  ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
                  : '';

                const gutenbergIds: string[] = Array.isArray(doc.id_project_gutenberg)
                  ? doc.id_project_gutenberg
                  : [];
                const gutenbergId = gutenbergIds.length > 0 ? Number(gutenbergIds[0]) : undefined;
                const ebookAccess = String(doc.ebook_access || 'no_ebook');

                let accessType: BookAccessType = 'metadata-only';
                let accessStatus: EbookAccessStatus = 'metadata_only';
                let isFree = false;
                let requiresAuthForFullText = false;

                if (gutenbergId || (ebookAccess === 'public' && publishedYear < 1929)) {
                  accessType = 'full-text';
                  accessStatus = 'full_download_available';
                  isFree = true;
                  requiresAuthForFullText = true;
                } else if (ebookAccess === 'borrowable' || ebookAccess === 'printdisabled') {
                  accessType = 'external-only';
                  accessStatus = 'external_reading';
                } else if (ebookAccess === 'public') {
                  accessType = 'preview-only';
                  accessStatus = 'preview_only';
                }

                const availableFormats: EbookFormat[] =
                  accessStatus === 'full_download_available'
                    ? ['PDF', 'EPUB', 'HTML', 'Plain Text']
                    : [];

                const externalSources: ExternalSourceLink[] = [];
                if (gutenbergId) {
                  externalSources.push({
                    label: `Project Gutenberg #${gutenbergId} (Full Text)`,
                    provider: 'Project Gutenberg',
                    url: `https://www.gutenberg.org/ebooks/${gutenbergId}`,
                    type: 'full-text',
                    format: 'EPUB'
                  });
                }
                externalSources.push({
                  label:
                    accessType === 'external-only'
                      ? `Borrow or Preview on Open Library (${workId})`
                      : `Open Library Bibliographic Record (${workId})`,
                  provider: 'Open Library',
                  url: `https://openlibrary.org/works/${workId}`,
                  type: accessType === 'external-only' ? 'borrow' : 'catalog-record'
                });

                const subjects: string[] = Array.isArray(doc.subject) ? doc.subject.slice(0, 4) : ['General Literature'];
                const nowIso = new Date().toISOString();

                const bookObj: Book = {
                  id,
                  title,
                  subtitle: doc.subtitle ? String(doc.subtitle) : `Open Library Edition (${workId})`,
                  author,
                  authorId: 'open-library-contributor',
                  category: 'Fiction',
                  categorySlug: 'fiction',
                  genre: subjects[0] || 'Literary Archive',
                  publishedYear,
                  publisher:
                    Array.isArray(doc.publisher) && doc.publisher.length > 0
                      ? String(doc.publisher[0])
                      : 'Open Library Bibliographic Archive',
                  pages: Number(doc.number_of_pages_median || 280),
                  isbn,
                  language: 'English',
                  formats:
                    accessStatus === 'full_download_available'
                      ? ['PDF', 'EPUB', 'HTML', 'Plain Text', 'Web Reader']
                      : ['EPUB', 'PDF'],
                  availableFormats,
                  accessStatus,
                  isFree,
                  price: isFree ? 0 : 14.0,
                  priceDisplay: isFree
                    ? 'Free Public Domain'
                    : accessType === 'external-only'
                    ? 'Open Library Borrow'
                    : 'Catalogue Record',
                  coverUrl,
                  coverAlt: `Book cover of ${title} by ${author}`,
                  openLibraryWorkId: workId,
                  provenance: {
                    sourceProvider: gutenbergId ? 'Project Gutenberg & Open Library' : 'Open Library Archive',
                    sourceBookId: gutenbergId ? `pg-${gutenbergId}` : workId,
                    canonicalSourceUrl: gutenbergId
                      ? `https://www.gutenberg.org/ebooks/${gutenbergId}`
                      : `https://openlibrary.org/works/${workId}`,
                    originalFileUrl:
                      accessStatus === 'full_download_available'
                        ? `/api/download/${encodeURIComponent(id)}/pdf`
                        : null,
                    availableFormats,
                    licenceName:
                      accessStatus === 'full_download_available'
                        ? 'Public Domain Edition (Project Gutenberg / Open Library)'
                        : 'Open Library Bibliographic & Lending Record',
                    licenceUrl: 'https://openlibrary.org/about',
                    copyrightStatus:
                      accessStatus === 'full_download_available'
                        ? 'Public Domain — Full Text & Download Permitted'
                        : 'Copyrighted or External Lending Edition',
                    attributionRequirements: `Indexed via Open Library (${workId}).`,
                    localHostingPermitted: accessStatus === 'full_download_available',
                    downloadPermitted: accessStatus === 'full_download_available',
                    fullTextReadingPermitted: accessStatus === 'full_download_available',
                    lastVerificationDate: nowIso,
                    lastSuccessfulAvailabilityCheck: nowIso
                  },
                  rating: {
                    score: doc.ratings_average ? Number(Number(doc.ratings_average).toFixed(1)) : 4.4,
                    count: doc.ratings_count ? Number(doc.ratings_count) : 45,
                    source: 'Open Library Reader Consensus'
                  },
                  shortSynopsis: `Verified bibliographic edition by ${author}, first published in ${publishedYear}. Indexed via Open Library (${workId}) under ${subjects.join(', ')}.`,
                  description: [
                    `${title} by ${author} (first published ${publishedYear}) is retrieved live from the Open Library bibliographic archive (Work ID: ${workId}).`,
                    accessType === 'full-text'
                      ? 'This public-domain edition is available for reading and download in Folio and via Project Gutenberg / Open Library.'
                      : accessType === 'external-only'
                      ? 'This edition is available for controlled digital lending or preview directly on Open Library.'
                      : 'Full-text reading is restricted by copyright; verified bibliographic metadata and external links are provided.'
                  ],
                  tableOfContents: [
                    'Section I — Opening Leaf & Provenance',
                    `Section II — Historical & Textual Context (${publishedYear})`,
                    'Section III — Archival Notes & Subject Classification'
                  ],
                  sampleChapters:
                    accessType === 'metadata-only'
                      ? []
                      : [
                          {
                            number: accessType === 'full-text' ? 'Chapter I' : 'Bibliographic Preview',
                            title: `${title} — Opening Leaf`,
                            epigraph: `Open Library Work ${workId} • First Published ${publishedYear}`,
                            content: [
                              `This edition of "${title}" by ${author} (${publishedYear}) is indexed in the Open Library global catalogue under Work ID ${workId}.`,
                              gutenbergId
                                ? `Complete public-domain text files (PDF, EPUB, HTML, and Plain Text) are available directly in Folio and via Project Gutenberg (#${gutenbergId}).`
                                : `Use the verified Open Library source link on the Book Details page to inspect physical library holdings and digital lending status.`
                            ]
                          }
                        ],
                  rightsNote:
                    accessType === 'full-text'
                      ? 'Public Domain / Open Access Edition.'
                      : accessType === 'external-only'
                      ? 'Available via Open Library Controlled Digital Lending.'
                      : 'Verified Bibliographic Record Only — Full-text reading unavailable due to copyright restrictions.',
                  collections: isFree ? ['free-ebooks'] : ['editors-picks'],
                  accessType,
                  requiresAuthForFullText,
                  gutenbergId,
                  externalSources
                };

                dynamicBooksCache.set(bookObj.id, bookObj);
                return bookObj;
              });

            db.prepare(
              `INSERT INTO book_metadata_cache (query_key, response_json, cached_at)
               VALUES (?, ?, ?)
               ON CONFLICT(query_key) DO UPDATE SET
                 response_json = excluded.response_json,
                 cached_at = excluded.cached_at`
            ).run(cacheKey, JSON.stringify(normalizedBooks), new Date().toISOString());

            return sendJson(res, 200, { books: normalizedBooks, cached: false });
          }

          // ==================================================================
          // 5. PAID EBOOK MONETISATION & GATEWAY PAYMENT SUBSYSTEM
          // ==================================================================
          if (pathname === '/api/payments/methods' && method === 'GET') {
            const currency = (parsedUrl.searchParams.get('currency') || 'USD') as PaymentCurrency;
            const methods = paymentRegistry.getAvailableMethods(currency);
            return sendJson(res, 200, {
              currency,
              methods
            });
          }

          if (pathname === '/api/purchases/checkout' && method === 'POST') {
            const body = await readBody(req);
            let user = getAuthenticatedUser(req, parsedUrl);
            let createdSessionToken: string | null = null;

            if (!user) {
              const guestEmail = String(body.guestEmail || body.customerEmail || body.email || '').trim().toLowerCase();
              const guestName = String(body.guestName || body.customerName || body.name || 'Reader').trim();
              if (guestEmail && guestEmail.includes('@')) {
                let existing = db.prepare('SELECT id, full_name, email, role, created_at FROM users WHERE LOWER(email) = ?').get(guestEmail) as any;
                if (!existing) {
                  const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                  db.prepare(`
                    INSERT INTO users (id, email, password_hash, password_salt, full_name, role, created_at)
                    VALUES (?, ?, ?, ?, ?, 'reader', datetime('now'))
                  `).run(newUserId, guestEmail, 'GUEST_PURCHASER', 'guest_salt', guestName);
                  existing = { id: newUserId, full_name: guestName, email: guestEmail, role: 'reader', created_at: new Date().toISOString() };
                }
                user = {
                  id: existing.id,
                  fullName: existing.full_name || existing.fullName || guestName,
                  email: existing.email,
                  role: existing.role || 'reader',
                  createdAt: existing.created_at || new Date().toISOString()
                };
                const sessionToken = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                db.prepare(`
                  INSERT INTO sessions (token, user_id, expires_at, created_at)
                  VALUES (?, ?, datetime('now', '+30 days'), datetime('now'))
                `).run(sessionToken, user.id);
                createdSessionToken = sessionToken;
              } else {
                return sendJson(res, 401, { error: 'Authentication or email required to complete ebook purchase.' });
              }
            }

            const bookId = String(body.bookId || '').trim();
            const paymentMethod = String(body.paymentMethod || 'evc_plus').toLowerCase() as PaymentMethodId;
            const mobileNumber = String(body.mobileNumber || body.phone || '').trim();
            const cardToken = body.cardToken ? String(body.cardToken).trim() : undefined;

            const book = findBookById(bookId);
            if (!book) {
              return sendJson(res, 404, { error: 'Book not found in catalogue.' });
            }

            // Check if user already owns this book
            if (paymentService.checkUserEntitlement(user.id, book.id, user.role)) {
              return sendJson(res, 200, {
                success: true,
                alreadyPurchased: true,
                orderId: `already_owned_${book.id}`,
                transactionRef: `OWNED_${book.id}`,
                bookId: book.id,
                sessionToken: createdSessionToken || undefined,
                user: createdSessionToken && user ? { id: user.id, fullName: user.fullName, email: user.email, role: user.role } : undefined,
                message: 'You already own this edition. Access is unlocked.'
              });
            }

            let amount = Number(book.price ?? 0);
            let currency = (book.currency || 'USD') as PaymentCurrency;

            // Ensure amount is synchronized from persistent SQLite record if not present in memory
            if (amount <= 0) {
              try {
                const dbBook = db.prepare('SELECT price, currency FROM books WHERE id = ?').get(book.id) as any;
                if (dbBook && dbBook.price > 0) {
                  amount = Number(dbBook.price);
                  currency = (dbBook.currency || currency) as PaymentCurrency;
                  book.price = amount;
                  book.currency = currency;
                }
              } catch {}
            }

            if (amount <= 0 && (book.accessStatus === 'paid_purchase' || !book.isFree)) {
              return sendJson(res, 400, {
                error: 'INVALID_PRICE',
                message: 'This book has an unconfigured retail price. Please contact the publisher.'
              });
            }

            try {
              const { order, alreadyPurchased } = await paymentService.createOrder({
                userId: user.id,
                bookId: book.id,
                bookTitle: book.title,
                amount,
                currency,
                paymentMethod,
                customerPhone: mobileNumber,
                customerEmail: user.email,
                customerName: user.fullName,
                metadata: { source: 'ebaro_web' }
              });

              if (alreadyPurchased) {
                return sendJson(res, 200, {
                  success: true,
                  alreadyPurchased: true,
                  bookId: book.id,
                  sessionToken: createdSessionToken || undefined,
                  user: createdSessionToken && user ? { id: user.id, fullName: user.fullName, email: user.email, role: user.role } : undefined,
                  message: 'You already own this edition.'
                });
              }

              const result = await paymentService.initiatePayment(order.id, {
                customerPhone: mobileNumber,
                customerEmail: user.email,
                customerName: user.fullName,
                cardToken,
                callbackUrl: `${req.headers['origin'] || 'http://localhost:5173'}/api/payments/webhook/${order.provider}`
              });

              return sendJson(res, 201, {
                success: result.success,
                orderId: order.id,
                transactionRef: result.transactionRef,
                providerCheckoutId: result.providerCheckoutId,
                status: result.status,
                bookId: book.id,
                bookTitle: book.title,
                amount,
                currency,
                paymentMethod,
                instructionMessage: result.instructionMessage,
                requiresPolling: result.requiresPolling || false,
                pollIntervalMs: result.pollIntervalMs || 2000,
                errorMessage: result.errorMessage,
                sessionToken: createdSessionToken || undefined,
                user: createdSessionToken && user ? { id: user.id, fullName: user.fullName, email: user.email, role: user.role } : undefined
              });
            } catch (err: any) {
              return sendJson(res, 400, {
                error: 'CHECKOUT_FAILED',
                message: err.message || 'Payment initiation failed. Please verify your details.'
              });
            }
          }

          const verifyOrderMatch = pathname.match(/^\/api\/purchases\/verify\/([^/]+)$/);
          if (verifyOrderMatch && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }
            const orderId = decodeURIComponent(verifyOrderMatch[1]);
            try {
              const verification = await paymentService.verifyOrder(orderId);
              return sendJson(res, 200, {
                success: verification.isSuccessful,
                orderId: verification.orderId,
                status: verification.status,
                transactionRef: verification.transactionRef,
                providerTxId: verification.providerTxId,
                errorMessage: verification.errorMessage
              });
            } catch (err: any) {
              return sendJson(res, 404, { error: 'ORDER_NOT_FOUND', message: err.message });
            }
          }

          const webhookMatch = pathname.match(/^\/api\/payments\/webhook\/([^/]+)$/);
          if (webhookMatch && method === 'POST') {
            const providerName = decodeURIComponent(webhookMatch[1]).toLowerCase() as PaymentProviderName;
            const body = await readBody(req);
            try {
              const resObj = await paymentService.processWebhook(providerName, req.headers as any, body);
              return sendJson(res, 200, resObj);
            } catch (err: any) {
              return sendJson(res, 400, { error: 'WEBHOOK_FAILED', message: err.message });
            }
          }

          if (pathname === '/api/purchases/mine' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }

            const rows = db
              .prepare(
                `SELECT o.id as order_id, o.book_id, o.amount, o.currency, o.payment_method,
                        o.transaction_ref, o.status, o.created_at,
                        b.title, b.author, b.cover_url, b.manuscript_format, b.price
                 FROM orders o
                 LEFT JOIN books b ON b.id = o.book_id
                 WHERE o.user_id = ? AND o.status = 'completed'
                 ORDER BY o.created_at DESC`
              )
              .all(user.id);

            // Also check purchase_entitlements for any direct grants or legacy purchases
            const entitlements = db
              .prepare(
                `SELECT e.id as entitlement_id, e.book_id, e.order_id, e.status as entitlement_status, e.granted_at,
                        b.title, b.author, b.cover_url, b.manuscript_format, b.price, b.currency
                 FROM purchase_entitlements e
                 LEFT JOIN books b ON b.id = e.book_id
                 WHERE e.user_id = ? AND e.status = 'active'
                 ORDER BY e.granted_at DESC`
              )
              .all(user.id) as any[];

            // Legacy purchases table query for backwards compatibility
            const legacyPurchases = db
              .prepare(
                `SELECT p.*, b.title, b.author, b.cover_url
                 FROM purchases p
                 LEFT JOIN books b ON b.id = p.book_id
                 WHERE p.user_id = ? AND p.status = 'completed'
                 ORDER BY p.created_at DESC`
              )
              .all(user.id);

            return sendJson(res, 200, {
              purchases: rows.length > 0 ? rows : legacyPurchases,
              entitlements,
              purchasedBookIds: Array.from(
                new Set([
                  ...rows.map((r: any) => r.book_id),
                  ...entitlements.map((e: any) => e.book_id),
                  ...legacyPurchases.map((p: any) => p.book_id)
                ])
              )
            });
          }

          if (pathname === '/api/purchases/refund' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required to process refunds.' });
            }
            const body = await readBody(req);
            const orderId = String(body.orderId || '').trim();
            const reason = String(body.reason || 'Customer requested refund').trim();
            if (!orderId) {
              return sendJson(res, 400, { error: 'orderId is required.' });
            }

            try {
              const result = await paymentService.processRefund(orderId, user.id, reason);
              return sendJson(res, 200, result);
            } catch (err: any) {
              return sendJson(res, 400, { error: 'REFUND_FAILED', message: err.message });
            }
          }

          if (pathname === '/api/admin/financials' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const summary = paymentService.getFinancialSummary();
            return sendJson(res, 200, summary);
          }

          if (pathname === '/api/admin/transactions' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const search = parsedUrl.searchParams.get('search') || undefined;
            const status = parsedUrl.searchParams.get('status') || undefined;
            const provider = parsedUrl.searchParams.get('provider') || undefined;
            const limit = Number(parsedUrl.searchParams.get('limit') || 50);
            const offset = Number(parsedUrl.searchParams.get('offset') || 0);

            const result = paymentService.getTransactions({ search, status, provider, limit, offset });
            return sendJson(res, 200, result);
          }

          if (pathname === '/api/admin/notifications' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }

            // Sync any existing completed orders into admin_notifications if not yet present
            try {
              const completedOrders = db.prepare(`
                SELECT o.id, o.amount, o.currency, o.payment_method, o.customer_phone, o.created_at,
                       b.id as book_id, b.title as book_title,
                       u.full_name as user_name, u.email as user_email
                FROM orders o
                LEFT JOIN books b ON b.id = o.book_id
                LEFT JOIN users u ON u.id = o.user_id
                WHERE o.status = 'completed'
                ORDER BY o.created_at DESC
                LIMIT 50
              `).all() as any[];

              for (const ord of completedOrders) {
                const existingNotif = db.prepare('SELECT id FROM admin_notifications WHERE order_id = ?').get(ord.id);
                if (!existingNotif) {
                  const notifId = `notif_${ord.id}`;
                  const title = `New Sale: ${ord.book_title || ord.book_id}`;
                  const msg = `${ord.user_name || 'Reader'} (${ord.user_email || 'reader'}) purchased "${ord.book_title || ord.book_id}" for ${ord.currency} ${Number(ord.amount).toFixed(2)} via ${(ord.payment_method || 'Online').toUpperCase().replace('_', ' ')}.`;
                  db.prepare(`
                    INSERT INTO admin_notifications (
                      id, type, title, message, amount, currency, order_id, book_id,
                      book_title, customer_name, customer_email, payment_method, is_read, created_at
                    ) VALUES (?, 'sale', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
                  `).run(
                    notifId,
                    title,
                    msg,
                    ord.amount,
                    ord.currency,
                    ord.id,
                    ord.book_id,
                    ord.book_title || ord.book_id,
                    ord.user_name || 'Reader',
                    ord.user_email || 'reader',
                    ord.payment_method,
                    ord.created_at
                  );
                }
              }
            } catch (err) {
              console.error('[AdminNotifications sync error]:', err);
            }

            const notifications = db.prepare(`
              SELECT * FROM admin_notifications
              ORDER BY created_at DESC
              LIMIT 50
            `).all();

            const unreadCountRow = db.prepare(`
              SELECT COUNT(*) as count FROM admin_notifications WHERE is_read = 0
            `).get() as any;

            const salesCountRow = db.prepare(`
              SELECT COUNT(*) as count FROM admin_notifications WHERE type = 'sale'
            `).get() as any;

            return sendJson(res, 200, {
              notifications,
              unreadCount: unreadCountRow?.count || 0,
              recentSalesCount: salesCountRow?.count || 0
            });
          }

          if (pathname === '/api/admin/notifications/mark-read' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }

            db.prepare('UPDATE admin_notifications SET is_read = 1 WHERE is_read = 0').run();
            return sendJson(res, 200, { success: true, message: 'All notifications marked as read.' });
          }

          const singleNotifReadMatch = pathname.match(/^\/api\/admin\/notifications\/([^/]+)\/read$/);
          if (singleNotifReadMatch && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const notifId = decodeURIComponent(singleNotifReadMatch[1]);
            db.prepare('UPDATE admin_notifications SET is_read = 1 WHERE id = ?').run(notifId);
            return sendJson(res, 200, { success: true });
          }

          // ==================================================================
          // 6. AUTHOR & PUBLISHER SUBMISSIONS & MANUSCRIPT UPLOAD
          // ==================================================================
          if (pathname === '/api/author/upload-manuscript' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'You must have an account to upload book manuscripts.' });
            }

            const body = await readBody(req);
            const originalFilename = String(body.filename || '').trim();
            const formatHint = String(body.format || '').trim().toUpperCase();
            const dataBase64 = String(body.dataBase64 || body.fileDataBase64 || '').trim();

            if (!originalFilename || !dataBase64) {
              return sendJson(res, 400, { error: 'Missing manuscript filename or file data payload.' });
            }

            // Strip optional data URL scheme prefix if present (e.g. data:application/pdf;base64,)
            const commaIdx = dataBase64.indexOf(',');
            const cleanBase64 = commaIdx !== -1 && dataBase64.slice(0, 50).includes('base64')
              ? dataBase64.slice(commaIdx + 1)
              : dataBase64;

            let buffer: Buffer;
            try {
              buffer = Buffer.from(cleanBase64, 'base64');
            } catch {
              return sendJson(res, 400, { error: 'Corrupt base64 manuscript payload.' });
            }

            // File size validation (max 50 MB)
            const MAX_SIZE = 50 * 1024 * 1024;
            if (buffer.length > MAX_SIZE) {
              return sendJson(res, 400, {
                error: `File size exceeds the 50MB limit (provided ${(buffer.length / (1024 * 1024)).toFixed(1)} MB).`
              });
            }

            const ext = path.extname(originalFilename).toLowerCase().replace('.', '');
            let normalizedFormat: 'PDF' | 'EPUB' | 'DOCX' | null = null;

            if (ext === 'pdf' || formatHint === 'PDF') {
              // Magic bytes check for PDF (%PDF-)
              if (
                buffer.length < 4 ||
                buffer[0] !== 0x25 ||
                buffer[1] !== 0x50 ||
                buffer[2] !== 0x44 ||
                buffer[3] !== 0x46
              ) {
                return sendJson(res, 400, {
                  error: 'The uploaded file is not a valid PDF document (missing %PDF- header).'
                });
              }
              normalizedFormat = 'PDF';
            } else if (ext === 'epub' || formatHint === 'EPUB') {
              // Magic bytes check for EPUB / ZIP (PK..)
              if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
                return sendJson(res, 400, {
                  error: 'The uploaded file is not a valid EPUB archive (missing PK container header).'
                });
              }
              normalizedFormat = 'EPUB';
            } else if (ext === 'docx' || formatHint === 'DOCX') {
              if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
                return sendJson(res, 400, {
                  error: 'The uploaded file is not a valid DOCX document.'
                });
              }
              normalizedFormat = 'DOCX';
            } else {
              return sendJson(res, 400, {
                error: 'Unsupported manuscript format. Please upload a PDF or EPUB file (.pdf, .epub, .docx).'
              });
            }

            const safeExtension = normalizedFormat === 'PDF' ? 'pdf' : normalizedFormat === 'EPUB' ? 'epub' : 'docx';
            const manuscriptId = `ms_${crypto.randomUUID()}`;
            const diskFilename = `${manuscriptId}.${safeExtension}`;
            const diskPath = path.join(MANUSCRIPTS_DIR, diskFilename);

            fs.writeFileSync(diskPath, buffer);

            return sendJson(res, 201, {
              success: true,
              manuscriptId,
              filename: path.basename(originalFilename),
              format: normalizedFormat,
              size: buffer.length,
              path: diskPath,
              message: `Manuscript uploaded successfully (${(buffer.length / (1024 * 1024)).toFixed(2)} MB, ${normalizedFormat}).`
            });
          }

          if (pathname === '/api/author-submissions' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'You must have an account to submit an ebook for publication review.' });
            }
            const body = await readBody(req);
            const title = String(body.title || '').trim();
            const author = String(body.author || '').trim();
            const authorEmail = String(body.authorEmail || user.email).trim();
            const description = String(body.description || '').trim();
            const categorySlug = String(body.categorySlug || 'somali-fiction').trim();
            const rightsDeclaration = String(body.rightsDeclaration || '').trim();

            if (!title || !author || !description || !rightsDeclaration) {
              return sendJson(res, 400, {
                error: 'Please fill in Title, Author Name, Book Description, and Rights Declaration.'
              });
            }

            const manuscriptPath = body.manuscriptPath ? String(body.manuscriptPath).trim() : '';
            const manuscriptFilename = body.manuscriptFilename ? String(body.manuscriptFilename).trim() : '';
            const manuscriptFormat = body.manuscriptFormat ? String(body.manuscriptFormat).trim().toUpperCase() : '';
            const manuscriptSize = Number(body.manuscriptSize || 0);
            const fileUrl = String(body.fileUrl || '').trim();

            if (!manuscriptPath && !fileUrl && !body.sampleText && !description) {
              return sendJson(res, 400, {
                error: 'Please upload a book manuscript (PDF or EPUB) or provide an external archive link.'
              });
            }

            const submissionId = `sub_${crypto.randomUUID()}`;
            const now = new Date().toISOString();
            const price = Number(body.price || 0);
            const accessPreference = body.accessPreference === 'paid' ? 'paid' : 'free';

            db.prepare(
              `INSERT INTO author_submissions (
                 id, user_id, title, subtitle, author, author_bio, author_email, author_phone,
                 language, category_slug, genre, description, published_year, publisher, isbn,
                 cover_url, file_url, sample_text, format, access_preference, price, currency,
                 payout_method, payout_account, rights_declaration, status, created_at,
                 manuscript_filename, manuscript_format, manuscript_size, manuscript_path
               ) VALUES (
                 ?, ?, ?, ?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?, ?, ?,
                 ?, ?, ?, 'pending', ?,
                 ?, ?, ?, ?
               )`
            ).run(
              submissionId,
              user.id,
              title,
              body.subtitle || '',
              author,
              body.authorBio || '',
              authorEmail,
              body.authorPhone || '',
              body.language || 'so',
              categorySlug,
              body.genre || '',
              description,
              body.publishedYear ? Number(body.publishedYear) : new Date().getFullYear(),
              body.publisher || 'Independent Somali Author',
              body.isbn || '',
              body.coverUrl || '/covers/somali/aqoondarro-waa-u-nacab-jacayl.svg',
              fileUrl,
              body.sampleText || '',
              body.format || (manuscriptFormat || 'Both'),
              accessPreference,
              price,
              body.currency || 'USD',
              body.payoutMethod || 'evc_plus',
              body.payoutAccount || '',
              rightsDeclaration,
              now,
              manuscriptFilename || null,
              manuscriptFormat || null,
              manuscriptSize || null,
              manuscriptPath || null
            );

            return sendJson(res, 201, {
              success: true,
              submissionId,
              status: 'pending',
              message: 'Your manuscript and rights declaration have been received. An eBaro editor will review it within 48 hours.'
            });
          }

          if (pathname === '/api/author-submissions/mine' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required.' });
            }
            const rows = db
              .prepare('SELECT * FROM author_submissions WHERE user_id = ? ORDER BY created_at DESC')
              .all(user.id);
            return sendJson(res, 200, { submissions: rows });
          }

          if (pathname === '/api/admin/author-submissions' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const rows = db.prepare("SELECT * FROM author_submissions ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, created_at DESC").all();
            return sendJson(res, 200, { submissions: rows });
          }

          // Inspect / Download submitted manuscript (Author or Administrator)
          const manuscriptInspectMatch = pathname.match(/^\/api\/(admin\/author-submissions|author-submissions)\/([^/]+)\/manuscript$/);
          if (manuscriptInspectMatch && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 401, { error: 'Authentication required to inspect manuscripts.' });
            }
            const subId = decodeURIComponent(manuscriptInspectMatch[2]);
            const sub = db.prepare('SELECT * FROM author_submissions WHERE id = ?').get(subId) as any;
            if (!sub) {
              return sendJson(res, 404, { error: 'Submission not found.' });
            }
            if (user.role !== 'admin' && sub.user_id !== user.id) {
              return sendJson(res, 403, { error: 'Access denied to this private manuscript.' });
            }
            if (!sub.manuscript_path || !fs.existsSync(sub.manuscript_path)) {
              return sendJson(res, 404, { error: 'Manuscript file not found on disk.' });
            }

            const fileBuf = fs.readFileSync(sub.manuscript_path);
            const ext = path.extname(sub.manuscript_path).toLowerCase();
            const contentType =
              ext === '.pdf'
                ? 'application/pdf'
                : ext === '.epub'
                ? 'application/epub+zip'
                : ext === '.docx'
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'application/octet-stream';

            const dlFilename = sub.manuscript_filename || `manuscript_${sub.id}${ext}`;
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': String(fileBuf.length),
              'Content-Disposition': `attachment; filename="${dlFilename.replace(/"/g, '')}"`,
              'Cache-Control': 'private, no-cache'
            });
            return res.end(fileBuf);
          }

          const reviewSubmissionMatch = pathname.match(/^\/api\/admin\/author-submissions\/([^/]+)\/review$/);
          if (reviewSubmissionMatch && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const subId = decodeURIComponent(reviewSubmissionMatch[1]);
            const body = await readBody(req);
            const action = body.action === 'approved' ? 'approved' : 'rejected';
            const adminNotes = String(body.adminNotes || '').trim();
            const now = new Date().toISOString();

            db.prepare(
              `UPDATE author_submissions
               SET status = ?, admin_notes = ?, reviewed_at = ?
               WHERE id = ?`
            ).run(action, adminNotes, now, subId);

            let publishedBook: Book | null = null;
            if (action === 'approved') {
              const approvedSub = db.prepare('SELECT * FROM author_submissions WHERE id = ?').get(subId);
              if (approvedSub) {
                publishedBook = publishSubmissionToBooks(approvedSub) || null;
              }
            }

            return sendJson(res, 200, {
              success: true,
              submissionId: subId,
              status: action,
              book: publishedBook,
              message: `Submission marked as ${action} and published to catalogue.`
            });
          }

          // ==================================================================
          // 7. COPYRIGHT COMPLAINTS & TAKEDOWNS
          // ==================================================================
          if (pathname === '/api/rights/takedown' && method === 'POST') {
            const body = await readBody(req);
            const bookId = String(body.bookId || '').trim();
            const bookTitle = String(body.bookTitle || '').trim();
            const claimantName = String(body.claimantName || '').trim();
            const claimantEmail = String(body.claimantEmail || '').trim();
            const claimantRelationship = String(body.claimantRelationship || '').trim();
            const infringementDetails = String(body.infringementDetails || '').trim();

            if (!bookId || !claimantName || !claimantEmail || !infringementDetails) {
              return sendJson(res, 400, {
                error: 'Please provide the Book ID, Claimant Name, Email, and Infringement Details.'
              });
            }

            const complaintId = `dmca_${crypto.randomUUID()}`;
            const now = new Date().toISOString();

            db.prepare(
              `INSERT INTO copyright_complaints (
                 id, book_id, book_title, claimant_name, claimant_email,
                 claimant_relationship, infringement_details, original_work_url,
                 good_faith_declaration, status, created_at
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'open', ?)`
            ).run(
              complaintId,
              bookId,
              bookTitle,
              claimantName,
              claimantEmail,
              claimantRelationship,
              infringementDetails,
              body.originalWorkUrl || '',
              now
            );

            return sendJson(res, 201, {
              success: true,
              complaintId,
              message: 'Your notice has been logged and assigned for legal review under the eBaro Copyright Policy.'
            });
          }

          if (pathname === '/api/admin/copyright-complaints' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const rows = db.prepare('SELECT * FROM copyright_complaints ORDER BY created_at DESC').all();
            return sendJson(res, 200, { complaints: rows });
          }

          const resolveComplaintMatch = pathname.match(/^\/api\/admin\/copyright-complaints\/([^/]+)\/resolve$/);
          if (resolveComplaintMatch && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const compId = decodeURIComponent(resolveComplaintMatch[1]);
            const body = await readBody(req);
            const action = body.action === 'resolve_takedown' ? 'resolved' : 'dismissed';
            const notes = String(body.resolutionNotes || '').trim();
            const now = new Date().toISOString();

            const complaint = db.prepare('SELECT book_id FROM copyright_complaints WHERE id = ?').get(compId) as
              | { book_id: string }
              | undefined;

            if (complaint && action === 'resolved') {
              // Takedown: update book access status to unavailable
              db.prepare("UPDATE books SET access_status = 'unavailable', updated_at = ? WHERE id = ?").run(
                now,
                complaint.book_id
              );
              const memBook = BOOKS.find((b) => b.id === complaint.book_id);
              if (memBook) memBook.accessStatus = 'unavailable';

              db.prepare(
                `INSERT INTO verification_audit_log (id, book_id, check_type, status, details, checked_at)
                 VALUES (?, ?, 'copyright_takedown', 'restricted', ?, ?)`
              ).run(`audit_${crypto.randomUUID()}`, complaint.book_id, `Takedown resolved: ${notes}`, now);
            }

            db.prepare(
              `UPDATE copyright_complaints
               SET status = ?, admin_resolution_notes = ?, resolved_at = ?
               WHERE id = ?`
            ).run(action, notes, now, compId);

            return sendJson(res, 200, {
              success: true,
              complaintId: compId,
              status: action,
              message: `Complaint marked as ${action}.`
            });
          }

          // ==================================================================
          // 8. ADMIN QUALITY ASSURANCE & CATALOGUE AUDIT
          // ==================================================================
          if (pathname === '/api/admin/audit' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }

            const items: any[] = [];
            const isbnSeen = new Map<string, string>();
            let issuesFound = 0;

            for (const book of BOOKS) {
              const issues: string[] = [];

              // 1. PDF Buffer Integrity
              try {
                const pdfRes = buildBookPdfBuffer(book);
                if (!pdfRes || pdfRes.buffer.length < 500) {
                  issues.push('PDF generation buffer too small (<500 bytes)');
                } else if (!pdfRes.buffer.subarray(0, 5).toString().startsWith('%PDF-')) {
                  issues.push('PDF missing valid %PDF- header');
                }
              } catch (e: any) {
                issues.push(`PDF build error: ${e.message}`);
              }

              // 2. EPUB Buffer Integrity
              try {
                const epubRes = buildBookEpubBuffer(book);
                if (!epubRes || epubRes.length < 500) {
                  issues.push('EPUB archive buffer too small (<500 bytes)');
                } else if (epubRes[0] !== 0x50 || epubRes[1] !== 0x4b) {
                  issues.push('EPUB missing standard ZIP PK header');
                }
              } catch (e: any) {
                issues.push(`EPUB build error: ${e.message}`);
              }

              // 3. Rights & Provenance Verification
              if (!book.provenance.rightsHolder && !book.rightsHolder) {
                issues.push('Missing explicit rightsHolder metadata');
              }
              if (!book.provenance.licenceEvidence && !book.licenceEvidence) {
                issues.push('Missing licenceEvidence provenance record');
              }
              if (!book.provenance.canonicalSourceUrl) {
                issues.push('Missing canonical source URL');
              }

              // 4. Duplicate ISBN check
              if (book.isbn && isbnSeen.has(book.isbn)) {
                issues.push(`Duplicate ISBN detected with book: ${isbnSeen.get(book.isbn)}`);
              } else if (book.isbn) {
                isbnSeen.set(book.isbn, book.id);
              }

              if (issues.length > 0) issuesFound += 1;

              items.push({
                bookId: book.id,
                title: book.title,
                author: book.author,
                accessStatus: book.accessStatus,
                categorySlug: book.categorySlug,
                hasPdf: book.availableFormats.includes('PDF'),
                hasEpub: book.availableFormats.includes('EPUB'),
                rightsHolder: book.rightsHolder || book.provenance.rightsHolder || 'None',
                licenceEvidence: book.licenceEvidence || book.provenance.licenceEvidence || 'None',
                status: issues.length === 0 ? 'valid' : 'warning',
                issues
              });
            }

            return sendJson(res, 200, {
              summary: {
                totalBooks: BOOKS.length,
                validBooks: BOOKS.length - issuesFound,
                issuesCount: issuesFound,
                timestamp: new Date().toISOString()
              },
              items
            });
          }

          const changeStatusMatch = pathname.match(/^\/api\/admin\/books\/([^/]+)\/status$/);
          if (changeStatusMatch && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const bookId = decodeURIComponent(changeStatusMatch[1]);
            const body = await readBody(req);
            const accessStatus = String(body.accessStatus || 'free_full_text') as EbookAccessStatus;
            const notes = String(body.notes || '').trim();
            const now = new Date().toISOString();

            db.prepare('UPDATE books SET access_status = ?, updated_at = ? WHERE id = ?').run(
              accessStatus,
              now,
              bookId
            );

            const memBook = BOOKS.find((b) => b.id === bookId);
            if (memBook) {
              memBook.accessStatus = accessStatus;
            }

            db.prepare(
              `INSERT INTO verification_audit_log (id, book_id, check_type, status, details, checked_at)
               VALUES (?, ?, 'status_change', ?, ?, ?)`
            ).run(`audit_${crypto.randomUUID()}`, bookId, accessStatus, notes || 'Status updated via admin console', now);

            return sendJson(res, 200, {
              success: true,
              bookId,
              accessStatus,
              message: `Access status updated to ${accessStatus}.`
            });
          }

          // ------------------------------------------------------------------
          // EDIT EXISTING BOOK
          // ------------------------------------------------------------------
          const editBookMatch = pathname.match(/^\/api\/admin\/books\/([^/]+)\/edit$/);
          if (editBookMatch && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const bookId = decodeURIComponent(editBookMatch[1]);
            const body = await readBody(req);
            const now = new Date().toISOString();

            const memBookIdx = BOOKS.findIndex((b) => b.id === bookId);
            if (memBookIdx === -1) {
              return sendJson(res, 404, { error: 'Book not found in catalogue.' });
            }

            const existingBook = BOOKS[memBookIdx];
            const updatedPrice = body.price !== undefined ? Number(body.price) : (existingBook.price || 0);
            const updatedCurrency = (body.currency || existingBook.currency || 'USD').toUpperCase() as PaymentCurrency;
            const updatedIsFree = body.isFree !== undefined ? Boolean(body.isFree) : (updatedPrice === 0);
            const updatedAccessStatus = body.accessStatus !== undefined
              ? body.accessStatus
              : updatedPrice > 0
              ? 'paid_purchase'
              : 'free_full_text';
            const updatedPriceDisplay = body.priceDisplay !== undefined
              ? String(body.priceDisplay)
              : updatedIsFree
              ? 'Free Open Access'
              : `${updatedCurrency === 'KES' ? 'KES ' : updatedCurrency === 'SOS' ? 'SOS ' : '$'}${updatedPrice.toFixed(2)}${updatedCurrency === 'USD' ? ' USD' : ''}`;

            const updatedBook: Book = {
              ...existingBook,
              title: body.title !== undefined ? String(body.title).trim() : existingBook.title,
              subtitle: body.subtitle !== undefined ? String(body.subtitle).trim() : existingBook.subtitle,
              author: body.author !== undefined ? String(body.author).trim() : existingBook.author,
              category: body.category !== undefined ? String(body.category).trim() : existingBook.category,
              categorySlug: body.categorySlug !== undefined ? body.categorySlug : existingBook.categorySlug,
              genre: body.genre !== undefined ? String(body.genre).trim() : existingBook.genre,
              publishedYear: body.publishedYear !== undefined ? Number(body.publishedYear) : existingBook.publishedYear,
              pages: body.pages !== undefined ? Number(body.pages) : existingBook.pages,
              price: updatedPrice,
              currency: updatedCurrency,
              priceDisplay: updatedPriceDisplay,
              isFree: updatedIsFree,
              accessType: body.accessType !== undefined ? body.accessType : existingBook.accessType,
              accessStatus: updatedAccessStatus,
              coverUrl: body.coverUrl !== undefined ? String(body.coverUrl).trim() : existingBook.coverUrl,
              shortSynopsis: body.shortSynopsis !== undefined ? String(body.shortSynopsis).trim() : existingBook.shortSynopsis,
              description: body.description !== undefined ? (Array.isArray(body.description) ? body.description : [String(body.description)]) : existingBook.description,
              rightsHolder: body.rightsHolder !== undefined ? String(body.rightsHolder).trim() : existingBook.rightsHolder,
              rightsNote: body.rightsNote !== undefined ? String(body.rightsNote).trim() : existingBook.rightsNote,
              isbn: body.isbn !== undefined ? String(body.isbn).trim() : existingBook.isbn,
              availableFormats: body.availableFormats !== undefined ? body.availableFormats : existingBook.availableFormats
            };

            BOOKS[memBookIdx] = updatedBook;
            dynamicBooksCache.set(updatedBook.id, updatedBook);

            // Persist price, currency, access status and metadata to SQLite books table
            try {
              db.prepare(`
                UPDATE books SET
                  title = ?, author = ?, category_slug = ?, published_year = ?,
                  cover_url = ?, access_type = ?, access_status = ?, rights_note = ?,
                  isbn = ?, price = ?, currency = ?, updated_at = ?
                WHERE id = ?
              `).run(
                updatedBook.title,
                updatedBook.author,
                updatedBook.categorySlug,
                updatedBook.publishedYear,
                updatedBook.coverUrl,
                updatedBook.accessType,
                updatedBook.accessStatus,
                updatedBook.rightsNote,
                updatedBook.isbn,
                updatedPrice,
                updatedCurrency,
                now,
                bookId
              );
            } catch (dbErr) {
              try {
                db.prepare(`
                  INSERT OR REPLACE INTO books (
                    id, title, author, isbn, open_library_work_id, access_type, access_status,
                    category_slug, published_year, cover_url, rights_note, price, currency, updated_at
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                  updatedBook.id,
                  updatedBook.title,
                  updatedBook.author,
                  updatedBook.isbn || '',
                  updatedBook.id,
                  updatedBook.accessType,
                  updatedBook.accessStatus,
                  updatedBook.categorySlug,
                  updatedBook.publishedYear,
                  updatedBook.coverUrl,
                  updatedBook.rightsNote || '',
                  updatedPrice,
                  updatedCurrency,
                  now
                );
              } catch {}
            }

            // Also update any matching author_submissions so server reboot doesn't revert price
            try {
              db.prepare(`
                UPDATE author_submissions SET
                  price = ?,
                  access_preference = ?,
                  currency = ?,
                  updated_at = ?
                WHERE id = ? OR LOWER(REPLACE(title, ' ', '-')) = ?
              `).run(
                updatedPrice,
                updatedIsFree ? 'free' : 'paid',
                updatedCurrency,
                now,
                bookId,
                bookId
              );
            } catch {}

            db.prepare(
              `INSERT INTO verification_audit_log (id, book_id, check_type, status, details, checked_at)
               VALUES (?, ?, 'book_edit', 'updated', ?, ?)`
            ).run(`audit_${crypto.randomUUID()}`, bookId, `Book edited by admin ${user.email}`, now);

            return sendJson(res, 200, {
              success: true,
              book: updatedBook,
              message: `Book "${updatedBook.title}" updated successfully.`
            });
          }

          // ------------------------------------------------------------------
          // DELETE BOOK FROM CATALOGUE
          // ------------------------------------------------------------------
          const deleteBookMatch = pathname.match(/^\/api\/admin\/books\/([^/]+)$/);
          if (deleteBookMatch && (method === 'DELETE' || method === 'POST')) {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const bookId = decodeURIComponent(deleteBookMatch[1]);
            const now = new Date().toISOString();

            const memBookIdx = BOOKS.findIndex((b) => b.id === bookId);
            let deletedTitle = bookId;
            if (memBookIdx !== -1) {
              deletedTitle = BOOKS[memBookIdx].title;
              BOOKS.splice(memBookIdx, 1);
            }

            try {
              db.prepare('DELETE FROM books WHERE id = ?').run(bookId);
            } catch {}

            db.prepare(
              `INSERT INTO verification_audit_log (id, book_id, check_type, status, details, checked_at)
               VALUES (?, ?, 'book_delete', 'deleted', ?, ?)`
            ).run(`audit_${crypto.randomUUID()}`, bookId, `Book "${deletedTitle}" deleted by admin ${user.email}`, now);

            return sendJson(res, 200, {
              success: true,
              bookId,
              message: `Book "${deletedTitle}" removed from catalogue.`
            });
          }

          // ------------------------------------------------------------------
          // CREATE NEW BOOK DIRECTLY
          // ------------------------------------------------------------------
          if (pathname === '/api/admin/books' && method === 'POST') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user || user.role !== 'admin') {
              return sendJson(res, 403, { error: 'Administrator access required.' });
            }
            const body = await readBody(req);
            const now = new Date().toISOString();

            const title = String(body.title || '').trim();
            const author = String(body.author || '').trim();
            if (!title || !author) {
              return sendJson(res, 400, { error: 'Title and Author are required.' });
            }

            const slug = body.id
              ? String(body.id).toLowerCase().replace(/[^a-z0-9]+/g, '-')
              : `${title}-${author}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const isFree = body.isFree !== undefined ? Boolean(body.isFree) : true;
            const price = body.price ? Number(body.price) : 0;
            const currency = (body.currency || 'USD').toUpperCase() as PaymentCurrency;
            const categorySlug = body.categorySlug || 'fiction';
            const manuscriptPath = body.manuscriptPath || body.manuscript_path || null;
            const manuscriptFormat = body.manuscriptFormat || (manuscriptPath && manuscriptPath.endsWith('.epub') ? 'EPUB' : 'PDF');

            const priceDisplay = isFree
              ? 'Free Open Access'
              : `${currency === 'KES' ? 'KES ' : currency === 'SOS' ? 'SOS ' : '$'}${price.toFixed(2)}${currency === 'USD' ? ' USD' : ''}`;

            const newBook: Book = {
              id: slug,
              title,
              subtitle: body.subtitle ? String(body.subtitle).trim() : undefined,
              author,
              authorId: author.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: body.category || 'Literature',
              categorySlug: categorySlug as any,
              genre: body.genre || 'Literature',
              publishedYear: body.publishedYear ? Number(body.publishedYear) : new Date().getFullYear(),
              publisher: body.publisher || 'Understory Publishing',
              pages: body.pages ? Number(body.pages) : 180,
              isbn: body.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              language: body.language || 'English',
              formats: ['Web Reader', 'EPUB', 'PDF'],
              availableFormats: body.availableFormats || ['EPUB', 'PDF', 'HTML', 'Plain Text'],
              accessStatus: body.accessStatus || (isFree ? 'free_full_text' : 'paid_purchase'),
              accessType: body.accessType || 'full-text',
              requiresAuthForFullText: false,
              isFree,
              price,
              currency,
              priceDisplay,
              rightsHolder: body.rightsHolder || author,
              rightsNote: body.rightsNote || 'Approved Understory Edition',
              distributionPermissions: 'Worldwide digital rights approved',
              coverUrl: body.coverUrl || '/covers/real/pride-and-prejudice.jpg',
              coverAlt: `Cover of ${title} by ${author}`,
              manuscriptPath: manuscriptPath || undefined,
              manuscriptFormat: manuscriptPath ? manuscriptFormat : undefined,
              provenance: {
                sourceProvider: 'Understory Editorial Console',
                sourceBookId: slug,
                canonicalSourceUrl: `/books/${slug}`,
                availableFormats: ['PDF', 'EPUB', 'HTML', 'Plain Text'],
                licenceName: isFree ? 'Open Access Distribution' : 'Authorized Commercial Edition',
                licenceUrl: '',
                copyrightStatus: 'Protected / Verified Master Edition',
                rightsHolder: body.rightsHolder || author,
                licenceEvidence: 'Direct entry via Understory Administrator Console',
                distributionPermissions: 'Authorized worldwide distribution',
                attributionRequirements: `Credit author ${author}`,
                localHostingPermitted: true,
                downloadPermitted: true,
                fullTextReadingPermitted: true,
                lastVerificationDate: now,
                lastSuccessfulAvailabilityCheck: now,
                isOpenAccessAcademic: isFree,
                manuscriptPath: manuscriptPath || undefined,
                manuscriptFormat: manuscriptPath ? manuscriptFormat : undefined
              },
              externalSources: [],
              rating: { score: 5.0, count: 1, source: 'Understory Editorial Staff' },
              shortSynopsis: (body.shortSynopsis || title).slice(0, 240),
              description: [body.description || body.shortSynopsis || title],
              sampleChapters: [
                {
                  number: 'Chapter 1',
                  title: `${title} — Opening`,
                  content: [body.sampleText || body.shortSynopsis || 'Chapter content available in full digital reader.']
                }
              ]
            };

            BOOKS.unshift(newBook);
            dynamicBooksCache.set(newBook.id, newBook);

            try {
              db.prepare(`
                INSERT OR REPLACE INTO books (
                  id, title, author, isbn, open_library_work_id, access_type, access_status,
                  category_slug, published_year, cover_url, rights_note, updated_at,
                  price, currency, manuscript_path, manuscript_format
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(
                newBook.id,
                newBook.title,
                newBook.author,
                newBook.isbn,
                newBook.id,
                newBook.accessType,
                newBook.accessStatus,
                newBook.categorySlug,
                newBook.publishedYear,
                newBook.coverUrl,
                newBook.rightsNote || '',
                now,
                price,
                currency,
                manuscriptPath,
                manuscriptFormat
              );
            } catch (err) {
              console.error('Failed to persist book to SQLite:', err);
            }

            db.prepare(
              `INSERT INTO verification_audit_log (id, book_id, check_type, status, details, checked_at)
               VALUES (?, ?, 'book_add', 'created', ?, ?)`
            ).run(`audit_${crypto.randomUUID()}`, newBook.id, `Book "${title}" created by admin ${user.email}`, now);

            return sendJson(res, 201, {
              success: true,
              book: newBook,
              message: `Book "${newBook.title}" added to catalogue.`
            });
          }

          // ==================================================================
          // SOMALI CHILDREN'S STORY AUDIO READER ENDPOINTS ("GEELKII YARAA")
          // ==================================================================
          if (pathname === '/api/children-stories' && method === 'GET') {
            const stories = getResolvedChildrenStories();
            return sendJson(res, 200, { stories });
          }

          const singleStoryMatch = pathname.match(/^\/api\/children-stories\/([^/]+)$/);
          if (singleStoryMatch && method === 'GET') {
            const storyId = decodeURIComponent(singleStoryMatch[1]);
            const story = getResolvedChildrenStoryById(storyId);
            if (!story) {
              return sendJson(res, 404, { error: 'Children story not found.' });
            }
            return sendJson(res, 200, { story });
          }

          const storyAudioMatch = pathname.match(
            /^\/api\/children-stories\/([^/]+)\/audio\/(so|en)$/
          );
          if (storyAudioMatch && method === 'GET') {
            const storyId = decodeURIComponent(storyAudioMatch[1]);
            const lang = storyAudioMatch[2] as StoryLanguageCode;
            const story = CHILDREN_STORIES.find((s) => s.id === storyId);
            if (!story) {
              return sendJson(res, 404, { error: 'Children story not found.' });
            }

            const asset = findInstalledAudioAsset(storyId, lang);
            if (!asset) {
              return sendJson(res, 404, {
                error:
                  'Audio narration file has not been installed yet. Place the recorded audio file and reviewed forced-alignment JSON in server/storage/audio/ or upload via the Educator Audio Setup drawer.',
                storyId,
                language: lang,
                expectedAssetPath: story.narrationTracks[lang].expectedAssetPath,
                expectedAlignmentPath: story.narrationTracks[lang].expectedAlignmentPath
              });
            }

            const buffer = fs.readFileSync(asset.filePath);
            streamAudioBufferWithRange(req, res, buffer, asset.mimeType);
            return;
          }

          const calibrationFixtureMatch = pathname.match(
            /^\/api\/children-stories\/([^/]+)\/calibration-fixture$/
          );
          if (calibrationFixtureMatch && method === 'GET') {
            const storyId = decodeURIComponent(calibrationFixtureMatch[1]);
            const lang = (parsedUrl.searchParams.get('lang') === 'en' ? 'en' : 'so') as StoryLanguageCode;
            const baseStory = CHILDREN_STORIES.find((s) => s.id === storyId);
            if (!baseStory) {
              return sendJson(res, 404, { error: 'Children story not found.' });
            }

            const { alignment } = buildMeasuredAcousticCalibrationFixture(baseStory, lang);
            const calibrationAudioUrl = `/api/children-stories/${encodeURIComponent(
              storyId
            )}/calibration-audio?lang=${lang}`;
            const calibratedStory = applyVerifiedAlignmentToStory(
              baseStory,
              alignment,
              calibrationAudioUrl
            );

            return sendJson(res, 200, {
              isDiagnosticCalibrationFixture: true,
              note:
                'Technical acoustic calibration fixture generated from exact PCM frame boundaries (22.05kHz). Intended for testing word-level synchronization, seeking, sentence repeat, and playback speed.',
              alignment,
              story: calibratedStory
            });
          }

          const calibrationAudioMatch = pathname.match(
            /^\/api\/children-stories\/([^/]+)\/calibration-audio$/
          );
          if (calibrationAudioMatch && method === 'GET') {
            const storyId = decodeURIComponent(calibrationAudioMatch[1]);
            const lang = (parsedUrl.searchParams.get('lang') === 'en' ? 'en' : 'so') as StoryLanguageCode;
            const baseStory = CHILDREN_STORIES.find((s) => s.id === storyId);
            if (!baseStory) {
              return sendJson(res, 404, { error: 'Children story not found.' });
            }

            const { wavBuffer } = buildMeasuredAcousticCalibrationFixture(baseStory, lang);
            streamAudioBufferWithRange(req, res, wavBuffer, 'audio/wav');
            return;
          }

          const storyAlignmentMatch = pathname.match(
            /^\/api\/children-stories\/([^/]+)\/alignment$/
          );
          if (storyAlignmentMatch && method === 'POST') {
            const storyId = decodeURIComponent(storyAlignmentMatch[1]);
            const baseStory = CHILDREN_STORIES.find((s) => s.id === storyId);
            if (!baseStory) {
              return sendJson(res, 404, { error: 'Children story not found.' });
            }

            const body = await readBody(req);
            const alignmentInput = body.alignment || body;
            const validation = validateStoryAlignmentPayload(alignmentInput, baseStory);
            if (!validation.valid || !validation.normalized) {
              return sendJson(res, 400, {
                error: validation.error || 'Invalid forced-alignment payload.'
              });
            }

            let audioBuffer: Buffer | undefined;
            if (typeof body.audioBase64 === 'string' && body.audioBase64.length > 0) {
              const cleaned = body.audioBase64.replace(/^data:[^;]+;base64,/, '');
              audioBuffer = Buffer.from(cleaned, 'base64');
            }

            const existingDiskAsset = findInstalledAudioAsset(
              storyId,
              validation.normalized.language
            );
            if (!audioBuffer && !existingDiskAsset) {
              return sendJson(res, 400, {
                error:
                  'Cannot mark narration as ready without a real audio file. Provide audioBase64 or place the audio recording in server/storage/audio/ first.'
              });
            }

            const updatedStory = saveStoryAudioAndAlignment(
              baseStory,
              validation.normalized,
              audioBuffer
            );
            return sendJson(res, 200, {
              story: updatedStory,
              alignment: validation.normalized
            });
          }

          const deleteAlignmentMatch = pathname.match(
            /^\/api\/children-stories\/([^/]+)\/alignment\/(so|en)$/
          );
          if (deleteAlignmentMatch && method === 'DELETE') {
            const storyId = decodeURIComponent(deleteAlignmentMatch[1]);
            const lang = deleteAlignmentMatch[2] as StoryLanguageCode;
            removeStoryAudioAndAlignment(storyId, lang);
            const story = getResolvedChildrenStoryById(storyId);
            return sendJson(res, 200, { story });
          }

          // ==================================================================
          // SOMALI KIDS LEARNING PROGRESS & SERVER-SIDE LESSON VALIDATION
          // ==================================================================
          if (pathname === '/api/kids/progress' && method === 'GET') {
            const user = getAuthenticatedUser(req, parsedUrl);
            if (!user) {
              return sendJson(res, 200, {
                authenticated: false,
                progress: createInitialKidsProgress()
              });
            }
            const row = db
              .prepare('SELECT progress_json FROM kids_learning_progress WHERE user_id = ?')
              .get(user.id) as { progress_json: string } | undefined;
            let parsedProgress = createInitialKidsProgress();
            if (row?.progress_json) {
              try {
                parsedProgress = normalizeKidsProgressPayload(
                  JSON.parse(row.progress_json) as Partial<KidsLearningProgressPayload>
                );
              } catch {
                parsedProgress = createInitialKidsProgress();
              }
            }
            return sendJson(res, 200, {
              authenticated: true,
              progress: parsedProgress
            });
          }

          if (pathname === '/api/kids/progress' && method === 'POST') {
            const body = await readBody(req);
            const normalized = normalizeKidsProgressPayload(body.progress || body);
            const user = getAuthenticatedUser(req, parsedUrl);
            if (user) {
              const now = new Date().toISOString();
              normalized.lastUpdatedAt = now;
              db.prepare(
                `INSERT INTO kids_learning_progress (user_id, progress_json, updated_at)
                 VALUES (?, ?, ?)
                 ON CONFLICT(user_id) DO UPDATE SET
                   progress_json = excluded.progress_json,
                   updated_at = excluded.updated_at`
              ).run(user.id, JSON.stringify(normalized), now);
            }
            return sendJson(res, 200, {
              authenticated: Boolean(user),
              progress: normalized
            });
          }

          const lessonSubmitMatch = pathname.match(
            /^\/api\/children-stories\/([^/]+)\/lesson-submit$/
          );
          if (lessonSubmitMatch && method === 'POST') {
            const storyId = decodeURIComponent(lessonSubmitMatch[1]);
            const story = getResolvedChildrenStoryById(storyId);
            if (!story) {
              return sendJson(res, 404, { error: 'Children story not found.' });
            }

            const body = await readBody(req);
            const rawAnswers = Array.isArray(body.answers) ? body.answers : [];
            const user = getAuthenticatedUser(req, parsedUrl);

            let baseProgress = normalizeKidsProgressPayload(body.currentProgress);
            if (user) {
              const row = db
                .prepare('SELECT progress_json FROM kids_learning_progress WHERE user_id = ?')
                .get(user.id) as { progress_json: string } | undefined;
              if (row?.progress_json) {
                try {
                  baseProgress = normalizeKidsProgressPayload(JSON.parse(row.progress_json));
                } catch {
                  // fallback to client progress
                }
              }
            }

            const evaluation = evaluateLessonSubmissionAndUpdateProgress(
              story,
              rawAnswers,
              baseProgress
            );

            const now = new Date().toISOString();
            const attemptId = crypto.randomUUID();
            db.prepare(
              `INSERT INTO kids_lesson_attempts (
                 id, user_id, story_id, score_percent, correct_count,
                 total_questions, stars_earned, xp_earned, answers_json, created_at
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).run(
              attemptId,
              user ? user.id : null,
              story.id,
              evaluation.scorePercent,
              evaluation.correctCount,
              evaluation.totalQuestions,
              evaluation.starsEarned,
              evaluation.xpEarned,
              JSON.stringify(evaluation.gradedAnswers),
              now
            );

            if (user) {
              db.prepare(
                `INSERT INTO kids_learning_progress (user_id, progress_json, updated_at)
                 VALUES (?, ?, ?)
                 ON CONFLICT(user_id) DO UPDATE SET
                   progress_json = excluded.progress_json,
                   updated_at = excluded.updated_at`
              ).run(user.id, JSON.stringify(evaluation.updatedProgress), now);
            }

            return sendJson(res, 200, {
              attemptId,
              authenticated: Boolean(user),
              ...evaluation
            });
          }

          return sendJson(res, 404, { error: `Unknown API endpoint: ${method} ${pathname}` });
        } catch (err: any) {
          console.error('[Folio API Error]:', err);
          return sendJson(res, 500, {
            error: err?.message || 'Internal server error'
          });
        }
}

export function folioApiPlugin(): Plugin {
  return {
    name: 'folio-backend-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => handleApiMiddleware(req, res, next));
    }
  };
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { BOOKS } from '../src/data/books';
import { CHILDREN_STORIES } from '../src/data/childrenStories';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const MANUSCRIPTS_DIR = path.resolve(process.cwd(), 'server', 'storage', 'manuscripts');
if (!fs.existsSync(MANUSCRIPTS_DIR)) {
  fs.mkdirSync(MANUSCRIPTS_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'folio.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Initialize relational schema
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    reader_font_size INTEGER DEFAULT 20,
    reader_theme TEXT DEFAULT 'ivory',
    reader_line_width TEXT DEFAULT 'medium',
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT NOT NULL,
    open_library_work_id TEXT NOT NULL,
    gutenberg_id INTEGER,
    access_type TEXT NOT NULL,
    access_status TEXT NOT NULL DEFAULT 'full_download_available',
    available_formats_json TEXT NOT NULL DEFAULT '[]',
    source_provider TEXT NOT NULL DEFAULT 'Project Gutenberg',
    source_book_id TEXT NOT NULL DEFAULT '',
    canonical_source_url TEXT NOT NULL DEFAULT '',
    original_file_url TEXT,
    licence_name TEXT NOT NULL DEFAULT '',
    licence_url TEXT NOT NULL DEFAULT '',
    copyright_status TEXT NOT NULL DEFAULT '',
    attribution_requirements TEXT NOT NULL DEFAULT '',
    local_hosting_permitted INTEGER NOT NULL DEFAULT 1,
    download_permitted INTEGER NOT NULL DEFAULT 1,
    full_text_reading_permitted INTEGER NOT NULL DEFAULT 1,
    is_open_access_academic INTEGER NOT NULL DEFAULT 0,
    last_verification_date TEXT NOT NULL DEFAULT '',
    last_successful_availability_check TEXT NOT NULL DEFAULT '',
    requires_auth INTEGER NOT NULL DEFAULT 1,
    category_slug TEXT NOT NULL,
    published_year INTEGER NOT NULL,
    cover_url TEXT NOT NULL,
    rights_note TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_library (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    status TEXT NOT NULL,
    added_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reading_progress (
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    chapter_index INTEGER DEFAULT 0,
    scroll_percentage INTEGER DEFAULT 0,
    overall_percentage INTEGER DEFAULT 0,
    last_read_page INTEGER DEFAULT 1,
    total_pages INTEGER DEFAULT 1,
    preferred_format TEXT DEFAULT 'web',
    last_opened_at TEXT NOT NULL,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    chapter_index INTEGER DEFAULT 0,
    chapter_title TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reading_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    chapter_index INTEGER DEFAULT 0,
    opened_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS download_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    format TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    downloaded_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS book_metadata_cache (
    query_key TEXT PRIMARY KEY,
    response_json TEXT NOT NULL,
    cached_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS children_stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    english_title TEXT NOT NULL,
    age_range TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    level_id TEXT NOT NULL DEFAULT 'level-1',
    category_slug TEXT NOT NULL DEFAULT 'folktales',
    learning_path_order INTEGER NOT NULL DEFAULT 1,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    somali_transcript TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    default_language TEXT NOT NULL DEFAULT 'so',
    supported_languages_json TEXT NOT NULL DEFAULT '["so","en"]',
    source TEXT NOT NULL,
    author TEXT NOT NULL,
    rights_holder TEXT NOT NULL,
    licence TEXT NOT NULL,
    publication_status TEXT NOT NULL DEFAULT 'published_text_pending_audio',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS children_story_alignments (
    story_id TEXT NOT NULL,
    language TEXT NOT NULL,
    audio_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'audio/wav',
    duration_seconds REAL NOT NULL,
    narrator_name TEXT NOT NULL,
    speech_provider TEXT NOT NULL,
    pronunciation_evaluated INTEGER NOT NULL DEFAULT 0,
    alignment_method TEXT NOT NULL,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT NOT NULL DEFAULT '',
    verified_at TEXT NOT NULL,
    licence_name TEXT NOT NULL,
    permission_status TEXT NOT NULL,
    alignment_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (story_id, language),
    FOREIGN KEY (story_id) REFERENCES children_stories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS kids_learning_progress (
    user_id TEXT PRIMARY KEY,
    progress_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS kids_lesson_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    story_id TEXT NOT NULL,
    score_percent INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    stars_earned INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    answers_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (story_id) REFERENCES children_stories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS author_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT NOT NULL,
    author_bio TEXT,
    author_email TEXT NOT NULL,
    author_phone TEXT,
    language TEXT NOT NULL DEFAULT 'so',
    category_slug TEXT NOT NULL,
    genre TEXT,
    description TEXT NOT NULL,
    published_year INTEGER,
    publisher TEXT,
    isbn TEXT,
    cover_url TEXT,
    file_url TEXT,
    sample_text TEXT,
    format TEXT DEFAULT 'Both',
    access_preference TEXT NOT NULL DEFAULT 'free',
    price REAL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    payout_method TEXT,
    payout_account TEXT,
    rights_declaration TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TEXT NOT NULL,
    reviewed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS copyright_complaints (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    book_title TEXT NOT NULL,
    claimant_name TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    claimant_relationship TEXT NOT NULL,
    infringement_details TEXT NOT NULL,
    original_work_url TEXT,
    good_faith_declaration INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'open',
    admin_resolution_notes TEXT,
    created_at TEXT NOT NULL,
    resolved_at TEXT
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    provider TEXT NOT NULL,
    transaction_ref TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS verification_audit_log (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    check_type TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT NOT NULL,
    checked_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    provider TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_ref TEXT UNIQUE,
    provider_checkout_id TEXT,
    error_message TEXT,
    metadata_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payment_transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_tx_id TEXT,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    signature_valid INTEGER NOT NULL DEFAULT 1,
    raw_payload_json TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS purchase_entitlements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    granted_at TEXT NOT NULL,
    revoked_at TEXT,
    revoke_reason TEXT,
    UNIQUE(user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS refund_records (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    transaction_id TEXT,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    reason TEXT NOT NULL,
    admin_user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payment_provider_configs (
    provider_id TEXT PRIMARY KEY,
    provider_name TEXT NOT NULL,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    is_sandbox INTEGER NOT NULL DEFAULT 1,
    config_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'sale',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    amount REAL,
    currency TEXT,
    order_id TEXT,
    book_id TEXT,
    book_title TEXT,
    customer_name TEXT,
    customer_email TEXT,
    payment_method TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

// Safe non-destructive schema migrations for existing SQLite databases
function ensureColumn(table: string, column: string, definition: string) {
  try {
    const info = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
    if (!info.some((c) => c.name === column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  } catch {
    // ignore if column already exists
  }
}

ensureColumn('books', 'access_status', "TEXT NOT NULL DEFAULT 'full_download_available'");
ensureColumn('books', 'available_formats_json', "TEXT NOT NULL DEFAULT '[]'");
ensureColumn('books', 'source_provider', "TEXT NOT NULL DEFAULT 'Project Gutenberg'");
ensureColumn('books', 'source_book_id', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'canonical_source_url', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'original_file_url', 'TEXT');
ensureColumn('books', 'licence_name', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'licence_url', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'copyright_status', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'attribution_requirements', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'local_hosting_permitted', 'INTEGER NOT NULL DEFAULT 1');
ensureColumn('books', 'download_permitted', 'INTEGER NOT NULL DEFAULT 1');
ensureColumn('books', 'full_text_reading_permitted', 'INTEGER NOT NULL DEFAULT 1');
ensureColumn('books', 'is_open_access_academic', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('books', 'last_verification_date', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'last_successful_availability_check', "TEXT NOT NULL DEFAULT ''");

ensureColumn('reading_progress', 'last_read_page', 'INTEGER DEFAULT 1');
ensureColumn('reading_progress', 'total_pages', 'INTEGER DEFAULT 1');
ensureColumn('reading_progress', 'preferred_format', "TEXT DEFAULT 'web'");

ensureColumn('users', 'role', "TEXT NOT NULL DEFAULT 'reader'");

ensureColumn('books', 'price', "REAL NOT NULL DEFAULT 0");
ensureColumn('books', 'currency', "TEXT NOT NULL DEFAULT 'USD'");
ensureColumn('books', 'rights_holder', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'licence_evidence', "TEXT NOT NULL DEFAULT ''");
ensureColumn('books', 'distribution_permissions', "TEXT NOT NULL DEFAULT 'Global Open Access'");
ensureColumn('books', 'manuscript_path', 'TEXT');
ensureColumn('books', 'manuscript_format', 'TEXT');

ensureColumn('author_submissions', 'manuscript_filename', 'TEXT');
ensureColumn('author_submissions', 'manuscript_format', 'TEXT');
ensureColumn('author_submissions', 'manuscript_size', 'INTEGER');
ensureColumn('author_submissions', 'manuscript_path', 'TEXT');

ensureColumn('children_stories', 'level_id', "TEXT NOT NULL DEFAULT 'level-1'");
ensureColumn('children_stories', 'category_slug', "TEXT NOT NULL DEFAULT 'folktales'");
ensureColumn('children_stories', 'learning_path_order', "INTEGER NOT NULL DEFAULT 1");
ensureColumn('children_stories', 'xp_reward', "INTEGER NOT NULL DEFAULT 50");

// Ensure default administrator account exists
try {
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@ebaro.org');
  if (!existingAdmin) {
    const adminId = 'user_admin_ebaro_01';
    const { hash, salt } = hashPassword('AdminPass2026!');
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, password_salt, role, created_at)
      VALUES (?, ?, ?, ?, ?, 'admin', ?)
    `).run(adminId, 'eBaro Administrator', 'admin@ebaro.org', hash, salt, now);
  } else {
    db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run('admin@ebaro.org');
  }
  // Ensure walikhalil480@gmail.com and other users are normal readers without admin console rights
  db.prepare("UPDATE users SET role = 'reader' WHERE email != 'admin@ebaro.org'").run();
} catch {
  // ignore
}

// Sync curated catalogue into the relational books table
const upsertBookStmt = db.prepare(`
  INSERT INTO books (
    id, title, author, isbn, open_library_work_id, gutenberg_id,
    access_type, access_status, available_formats_json,
    source_provider, source_book_id, canonical_source_url, original_file_url,
    licence_name, licence_url, copyright_status, attribution_requirements,
    local_hosting_permitted, download_permitted, full_text_reading_permitted,
    is_open_access_academic, last_verification_date, last_successful_availability_check,
    price, currency, rights_holder, licence_evidence, distribution_permissions,
    requires_auth, category_slug, published_year, cover_url, rights_note, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?
  )
  ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    author = excluded.author,
    isbn = excluded.isbn,
    open_library_work_id = excluded.open_library_work_id,
    gutenberg_id = excluded.gutenberg_id,
    access_type = excluded.access_type,
    access_status = excluded.access_status,
    available_formats_json = excluded.available_formats_json,
    source_provider = excluded.source_provider,
    source_book_id = excluded.source_book_id,
    canonical_source_url = excluded.canonical_source_url,
    original_file_url = excluded.original_file_url,
    licence_name = excluded.licence_name,
    licence_url = excluded.licence_url,
    copyright_status = excluded.copyright_status,
    attribution_requirements = excluded.attribution_requirements,
    local_hosting_permitted = excluded.local_hosting_permitted,
    download_permitted = excluded.download_permitted,
    full_text_reading_permitted = excluded.full_text_reading_permitted,
    is_open_access_academic = excluded.is_open_access_academic,
    last_verification_date = excluded.last_verification_date,
    last_successful_availability_check = excluded.last_successful_availability_check,
    price = excluded.price,
    currency = excluded.currency,
    rights_holder = excluded.rights_holder,
    licence_evidence = excluded.licence_evidence,
    distribution_permissions = excluded.distribution_permissions,
    requires_auth = excluded.requires_auth,
    category_slug = excluded.category_slug,
    published_year = excluded.published_year,
    cover_url = excluded.cover_url,
    rights_note = excluded.rights_note,
    updated_at = excluded.updated_at
`);

const nowIso = new Date().toISOString();
for (const book of BOOKS) {
  upsertBookStmt.run(
    book.id,
    book.title,
    book.author,
    book.isbn,
    book.openLibraryWorkId || '',
    book.gutenbergId ?? null,
    book.accessType,
    book.accessStatus,
    JSON.stringify(book.availableFormats),
    book.provenance.sourceProvider,
    book.provenance.sourceBookId,
    book.provenance.canonicalSourceUrl,
    book.provenance.originalFileUrl,
    book.provenance.licenceName,
    book.provenance.licenceUrl,
    book.provenance.copyrightStatus,
    book.provenance.attributionRequirements,
    book.provenance.localHostingPermitted ? 1 : 0,
    book.provenance.downloadPermitted ? 1 : 0,
    book.provenance.fullTextReadingPermitted ? 1 : 0,
    book.provenance.isOpenAccessAcademic ? 1 : 0,
    book.provenance.lastVerificationDate,
    book.provenance.lastSuccessfulAvailabilityCheck,
    book.price ?? 0,
    book.currency ?? 'USD',
    book.rightsHolder || book.provenance.rightsHolder || '',
    book.licenceEvidence || book.provenance.licenceEvidence || '',
    book.distributionPermissions || book.provenance.distributionPermissions || 'Global Open Access',
    book.requiresAuthForFullText ? 1 : 0,
    book.categorySlug,
    book.publishedYear,
    book.coverUrl,
    book.rightsNote,
    nowIso
  );
}

const upsertStoryStmt = db.prepare(`
  INSERT INTO children_stories (
    id, title, english_title, age_range, difficulty,
    level_id, category_slug, learning_path_order, xp_reward,
    somali_transcript, english_translation, default_language, supported_languages_json,
    source, author, rights_holder, licence, publication_status, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    english_title = excluded.english_title,
    age_range = excluded.age_range,
    difficulty = excluded.difficulty,
    level_id = excluded.level_id,
    category_slug = excluded.category_slug,
    learning_path_order = excluded.learning_path_order,
    xp_reward = excluded.xp_reward,
    somali_transcript = excluded.somali_transcript,
    english_translation = excluded.english_translation,
    default_language = excluded.default_language,
    supported_languages_json = excluded.supported_languages_json,
    source = excluded.source,
    author = excluded.author,
    rights_holder = excluded.rights_holder,
    licence = excluded.licence,
    publication_status = excluded.publication_status,
    updated_at = excluded.updated_at
`);

for (const story of CHILDREN_STORIES) {
  upsertStoryStmt.run(
    story.id,
    story.title,
    story.englishTitle,
    story.ageRange,
    story.difficulty,
    story.levelId,
    story.categorySlug,
    story.learningPathOrder,
    story.xpReward,
    story.somaliTranscript,
    story.englishTranslation,
    story.defaultNarrationLanguage,
    JSON.stringify(story.supportedNarrationLanguages),
    story.source,
    story.author,
    story.rightsHolder,
    story.licence,
    story.publicationStatus,
    nowIso
  );
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, usedSalt, 64).toString('hex');
  return { hash, salt: usedSalt };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}



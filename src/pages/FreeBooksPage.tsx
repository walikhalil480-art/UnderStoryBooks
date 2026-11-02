import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  Filter,
  Search,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Layers,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { BOOKS, CATEGORIES } from '../data/books';
import {
  Book,
  CategorySlug,
  EbookAccessStatus,
  EbookFormat
} from '../types';
import { BookCover } from '../components/BookCover';

export type FreeBooksShelfId =
  | 'all-free'
  | 'free-pdf'
  | 'free-epub'
  | 'full-text'
  | 'public-domain-classics'
  | 'open-access-academic'
  | 'free-fiction'
  | 'free-history-biography'
  | 'free-science-education'
  | 'free-tech-programming'
  | 'recently-added-free';

interface FreeBooksPageProps {
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string, chapterIndex?: number, mode?: 'web' | 'pdf' | 'text') => void;
  onDownloadBook: (bookId: string, format: 'pdf' | 'epub' | 'html' | 'txt') => void;
  bookmarkedIds: string[];
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
}

const SHELF_DEFINITIONS: Array<{
  id: FreeBooksShelfId;
  label: string;
  kicker: string;
  description: string;
  match: (b: Book) => boolean;
}> = [
  {
    id: 'all-free',
    label: 'All Free Full-Text Books',
    kicker: 'COMPLETE FREE EBOOK ARCHIVE',
    description: 'Every verified public-domain and open-access volume available to read in full and download at zero cost.',
    match: (b) =>
      b.accessStatus === 'full_download_available' || b.accessStatus === 'full_text_available'
  },
  {
    id: 'free-pdf',
    label: 'Free PDF Books',
    kicker: 'ARCHIVAL PDF-1.4 EDITIONS',
    description: 'Complete multi-page PDF editions ready to read in our in-browser PDF viewer or download to your device.',
    match: (b) => b.availableFormats.includes('PDF') && b.provenance.downloadPermitted
  },
  {
    id: 'free-epub',
    label: 'Free EPUB Books',
    kicker: 'REFLOWABLE E-READER EDITIONS',
    description: 'Standard-compliant EPUB archives formatted for e-readers, tablets, and offline desktop reading.',
    match: (b) => b.availableFormats.includes('EPUB') && b.provenance.downloadPermitted
  },
  {
    id: 'full-text',
    label: 'Full-Text Books',
    kicker: 'UNABRIDGED ONLINE READING',
    description: 'Books verified for complete start-to-finish reading inside the Understory Web, EPUB, and PDF Readers.',
    match: (b) => b.provenance.fullTextReadingPermitted
  },
  {
    id: 'public-domain-classics',
    label: 'Public-Domain Classics',
    kicker: 'PROJECT GUTENBERG & STANDARD EBOOKS',
    description: 'Timeless literary, philosophical, and historical masterworks free of copyright restrictions worldwide.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted &&
      (Boolean(b.gutenbergId) || Boolean(b.standardEbooksPath) || b.publishedYear < 1930)
  },
  {
    id: 'open-access-academic',
    label: 'Open-Access Academic Books',
    kicker: 'UNIVERSITY PRESSES & OPEN TEXTBOOKS',
    description: 'Scholarly treatises, university textbooks, and foundational research works released under open licences or in the academic public domain.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted && Boolean(b.provenance.isOpenAccessAcademic)
  },
  {
    id: 'free-fiction',
    label: 'Free Fiction',
    kicker: 'NOVELS, ROMANCE & MYSTERY',
    description: 'Unabridged novels, detective mysteries, and social comedies from Jane Austen and George Eliot to Virginia Woolf and Arthur Conan Doyle.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted &&
      ['fiction', 'romance', 'mystery-thriller'].includes(b.categorySlug)
  },
  {
    id: 'free-history-biography',
    label: 'Free History & Biography',
    kicker: 'CHRONICLES, MEMOIRS & ANTIQUITY',
    description: 'Primary historical inquiries and first-person memoirs from Herodotus and Marcus Aurelius to Benjamin Franklin and Frederick Douglass.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted &&
      ['history', 'biography-memoir'].includes(b.categorySlug)
  },
  {
    id: 'free-science-education',
    label: 'Free Science & Education',
    kicker: 'NATURAL HISTORY, PHYSICS & PEDAGOGY',
    description: 'Foundational works in evolutionary biology, relativity, cognitive psychology, rhetoric, and philosophy of education.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted &&
      ['science', 'education', 'personal-development'].includes(b.categorySlug)
  },
  {
    id: 'free-tech-programming',
    label: 'Free Technology & Programming Books',
    kicker: 'OPEN-ACCESS COMPUTER SCIENCE',
    description: 'Complete open-access computer science textbooks on software abstraction, Python programming, and search engine information retrieval.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted && b.categorySlug === 'technology-programming'
  },
  {
    id: 'recently-added-free',
    label: 'Recently Added Free Books',
    kicker: 'LATEST ARCHIVAL ACQUISITIONS',
    description: 'Newly verified open-access and public-domain volumes added to the Understory Digital Library.',
    match: (b) =>
      b.provenance.fullTextReadingPermitted &&
      (b.collections.includes('recently-added') ||
        b.collections.includes('open-access-academic') ||
        b.collections.includes('free-ebooks'))
  }
];

export const FreeBooksPage: React.FC<FreeBooksPageProps> = ({
  onSelectBook,
  onReadBook,
  onDownloadBook,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [activeShelf, setActiveShelf] = useState<FreeBooksShelfId>('all-free');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<EbookFormat | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedAccessStatus, setSelectedAccessStatus] = useState<EbookAccessStatus | 'all'>('all');
  const [pubPeriod, setPubPeriod] = useState<'all' | 'pre-1850' | '1850-1919' | '1920-1950' | 'modern'>('all');
  const [fullTextOnly, setFullTextOnly] = useState<boolean>(false);
  const [downloadOnly, setDownloadOnly] = useState<boolean>(false);

  const activeShelfDef =
    SHELF_DEFINITIONS.find((s) => s.id === activeShelf) || SHELF_DEFINITIONS[0];

  // Unique authors list with real book counts
  const authorOptions = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of BOOKS) {
      map.set(b.author, (map.get(b.author) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  // Format counts across catalogue
  const formatCounts = useMemo(() => {
    return {
      PDF: BOOKS.filter((b) => b.availableFormats.includes('PDF')).length,
      EPUB: BOOKS.filter((b) => b.availableFormats.includes('EPUB')).length,
      HTML: BOOKS.filter((b) => b.availableFormats.includes('HTML')).length,
      'Plain Text': BOOKS.filter((b) => b.availableFormats.includes('Plain Text')).length
    };
  }, []);

  // Access status counts across catalogue
  const accessStatusCounts = useMemo(() => {
    return {
      full_download_available: BOOKS.filter((b) => b.accessStatus === 'full_download_available').length,
      full_text_available: BOOKS.filter(
        (b) => b.accessStatus === 'full_text_available' || b.accessStatus === 'full_download_available'
      ).length,
      preview_only: BOOKS.filter((b) => b.accessStatus === 'preview_only').length,
      external_reading: BOOKS.filter((b) => b.accessStatus === 'external_reading').length,
      metadata_only: BOOKS.filter((b) => b.accessStatus === 'metadata_only').length
    };
  }, []);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      // If user selected a specific access status filter (like preview_only or metadata_only), allow inspecting all books
      if (selectedAccessStatus === 'all') {
        if (!activeShelfDef.match(book)) return false;
      } else {
        if (selectedAccessStatus === 'full_text_available') {
          if (
            book.accessStatus !== 'full_text_available' &&
            book.accessStatus !== 'full_download_available'
          ) {
            return false;
          }
        } else if (book.accessStatus !== selectedAccessStatus) {
          return false;
        }
      }

      if (selectedFormat !== 'all' && !book.availableFormats.includes(selectedFormat)) {
        return false;
      }

      if (selectedCategory !== 'all' && book.categorySlug !== selectedCategory) {
        return false;
      }

      if (selectedAuthor !== 'all' && book.author !== selectedAuthor) {
        return false;
      }

      if (pubPeriod !== 'all') {
        if (pubPeriod === 'pre-1850' && book.publishedYear >= 1850) return false;
        if (pubPeriod === '1850-1919' && (book.publishedYear < 1850 || book.publishedYear > 1919))
          return false;
        if (pubPeriod === '1920-1950' && (book.publishedYear < 1920 || book.publishedYear > 1950))
          return false;
        if (pubPeriod === 'modern' && book.publishedYear <= 1950) return false;
      }

      if (fullTextOnly && !book.provenance.fullTextReadingPermitted) {
        return false;
      }

      if (downloadOnly && !book.provenance.downloadPermitted) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.category.toLowerCase().includes(q) ||
          book.genre.toLowerCase().includes(q) ||
          book.provenance.sourceProvider.toLowerCase().includes(q) ||
          book.isbn.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    activeShelfDef,
    selectedAccessStatus,
    selectedFormat,
    selectedCategory,
    selectedAuthor,
    pubPeriod,
    fullTextOnly,
    downloadOnly,
    searchQuery
  ]);

  const handleResetFilters = () => {
    setActiveShelf('all-free');
    setSearchQuery('');
    setSelectedFormat('all');
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setSelectedAccessStatus('all');
    setPubPeriod('all');
    setFullTextOnly(false);
    setDownloadOnly(false);
  };

  return (
    <div className="free-books-page">
      {/* Editorial Hero Header */}
      <section className="explore-hero-banner">
        <div className="container">
          <div className="explore-hero-grid">
            <div>
              <span className="section-eyebrow">
                <ShieldCheck size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                VERIFIED PUBLIC DOMAIN &amp; OPEN-ACCESS REPOSITORY
              </span>
              <h1 className="explore-page-title">Free Full-Text Ebooks &amp; PDF Archive</h1>
              <p className="explore-page-description">
                Every volume in our Free Ebook Archive is verified against Project Gutenberg, Standard Ebooks, MIT Press Open Access, and university repositories. Read complete, unabridged books online in our Web or PDF Reader, or download verified PDF, EPUB, HTML, and Plain Text editions.
              </p>
            </div>

            <div className="free-books-hero-stats">
              <div className="free-stat-box">
                <span className="free-stat-num">{accessStatusCounts.full_download_available}</span>
                <span className="free-stat-label">Full Ebooks Ready to Read &amp; Download</span>
              </div>
              <div className="free-stat-box">
                <span className="free-stat-num">{formatCounts.PDF}</span>
                <span className="free-stat-label">Verified Multi-Page PDF Editions</span>
              </div>
              <div className="free-stat-box">
                <span className="free-stat-num">{formatCounts.EPUB}</span>
                <span className="free-stat-label">Standard EPUB Archives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Curated Free Book Shelves Navigation Bar */}
      <section className="free-shelves-nav-section" aria-label="Free Book Collections">
        <div className="container">
          <div className="free-shelves-scroll-row" role="tablist">
            {SHELF_DEFINITIONS.map((shelf) => {
              const count = BOOKS.filter(shelf.match).length;
              const isActive = activeShelf === shelf.id && selectedAccessStatus === 'all';
              return (
                <button
                  key={shelf.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`free-shelf-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveShelf(shelf.id);
                    setSelectedAccessStatus('all');
                  }}
                >
                  <span>{shelf.label}</span>
                  <span className="free-shelf-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Discovery Grid with Sidebar Filters */}
      <section className="container free-books-main-layout">
        {/* Left Filter Sidebar */}
        <aside className="free-books-sidebar" aria-label="Filter Free Books">
          <div className="sidebar-filter-header">
            <div className="sidebar-filter-title">
              <Filter size={15} />
              <span>Archive Filters</span>
            </div>
            <button type="button" className="btn-reset-text" onClick={handleResetFilters}>
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="sidebar-filter-group">
            <label htmlFor="free-books-search" className="sidebar-group-label">
              Search Free Archive
            </label>
            <div className="sidebar-search-box">
              <Search size={14} className="sidebar-search-icon" />
              <input
                id="free-books-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, author, ISBN, source..."
              />
            </div>
          </div>

          {/* Format Filter with Accurate Counts */}
          <div className="sidebar-filter-group">
            <span className="sidebar-group-label">Format Availability</span>
            <div className="sidebar-radio-list">
              <button
                type="button"
                className={`sidebar-filter-option ${selectedFormat === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFormat('all')}
              >
                <span>All Formats</span>
                <span className="opt-count">{BOOKS.length}</span>
              </button>
              {(['PDF', 'EPUB', 'HTML', 'Plain Text'] as EbookFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  className={`sidebar-filter-option ${selectedFormat === fmt ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(fmt)}
                >
                  <span>{fmt}</span>
                  <span className="opt-count">{formatCounts[fmt]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Availability Checkboxes */}
          <div className="sidebar-filter-group">
            <span className="sidebar-group-label">Verified Access Guarantees</span>
            <label className="sidebar-checkbox-row">
              <input
                type="checkbox"
                checked={fullTextOnly}
                onChange={(e) => setFullTextOnly(e.target.checked)}
              />
              <span>Full-Text Online Reading ({accessStatusCounts.full_text_available})</span>
            </label>
            <label className="sidebar-checkbox-row">
              <input
                type="checkbox"
                checked={downloadOnly}
                onChange={(e) => setDownloadOnly(e.target.checked)}
              />
              <span>Direct PDF/EPUB Download ({accessStatusCounts.full_download_available})</span>
            </label>
          </div>

          {/* Access Classification Status Filter */}
          <div className="sidebar-filter-group">
            <span className="sidebar-group-label">Access Classification</span>
            <div className="sidebar-radio-list">
              <button
                type="button"
                className={`sidebar-filter-option ${selectedAccessStatus === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedAccessStatus('all')}
              >
                <span>Active Shelf Default</span>
                <span className="opt-count">{BOOKS.filter(activeShelfDef.match).length}</span>
              </button>
              <button
                type="button"
                className={`sidebar-filter-option ${
                  selectedAccessStatus === 'full_download_available' ? 'active' : ''
                }`}
                onClick={() => setSelectedAccessStatus('full_download_available')}
              >
                <span>Full Download Available</span>
                <span className="opt-count">{accessStatusCounts.full_download_available}</span>
              </button>
              <button
                type="button"
                className={`sidebar-filter-option ${
                  selectedAccessStatus === 'full_text_available' ? 'active' : ''
                }`}
                onClick={() => setSelectedAccessStatus('full_text_available')}
              >
                <span>Full Text Available</span>
                <span className="opt-count">{accessStatusCounts.full_text_available}</span>
              </button>
              <button
                type="button"
                className={`sidebar-filter-option ${
                  selectedAccessStatus === 'preview_only' ? 'active' : ''
                }`}
                onClick={() => setSelectedAccessStatus('preview_only')}
              >
                <span>Preview Only</span>
                <span className="opt-count">{accessStatusCounts.preview_only}</span>
              </button>
              <button
                type="button"
                className={`sidebar-filter-option ${
                  selectedAccessStatus === 'external_reading' ? 'active' : ''
                }`}
                onClick={() => setSelectedAccessStatus('external_reading')}
              >
                <span>External Borrowing</span>
                <span className="opt-count">{accessStatusCounts.external_reading}</span>
              </button>
              <button
                type="button"
                className={`sidebar-filter-option ${
                  selectedAccessStatus === 'metadata_only' ? 'active' : ''
                }`}
                onClick={() => setSelectedAccessStatus('metadata_only')}
              >
                <span>Metadata Only</span>
                <span className="opt-count">{accessStatusCounts.metadata_only}</span>
              </button>
            </div>
          </div>

          {/* Category / Genre Filter */}
          <div className="sidebar-filter-group">
            <label htmlFor="free-cat-select" className="sidebar-group-label">
              Genre / Subject Category
            </label>
            <select
              id="free-cat-select"
              className="sidebar-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategorySlug | 'all')}
            >
              <option value="all">All Categories ({BOOKS.length})</option>
              {CATEGORIES.map((cat) => {
                const cnt = BOOKS.filter((b) => b.categorySlug === cat.slug).length;
                return (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cnt})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Author Filter */}
          <div className="sidebar-filter-group">
            <label htmlFor="free-author-select" className="sidebar-group-label">
              Author
            </label>
            <select
              id="free-author-select"
              className="sidebar-select"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="all">All Authors ({authorOptions.length})</option>
              {authorOptions.map(([authorName, cnt]) => (
                <option key={authorName} value={authorName}>
                  {authorName} ({cnt})
                </option>
              ))}
            </select>
          </div>

          {/* Publication Era Filter */}
          <div className="sidebar-filter-group">
            <label htmlFor="free-era-select" className="sidebar-group-label">
              Publication Date
            </label>
            <select
              id="free-era-select"
              className="sidebar-select"
              value={pubPeriod}
              onChange={(e) => setPubPeriod(e.target.value as any)}
            >
              <option value="all">All Eras</option>
              <option value="pre-1850">Antiquity to 1849</option>
              <option value="1850-1919">1850 – 1919 (Golden Age)</option>
              <option value="1920-1950">1920 – 1950 (Early Modern)</option>
              <option value="modern">1951 – Present (Open Access &amp; Contemporary)</option>
            </select>
          </div>

          {/* Language Filter */}
          <div className="sidebar-filter-group">
            <span className="sidebar-group-label">Language</span>
            <div className="sidebar-static-pill">English ({BOOKS.length})</div>
          </div>
        </aside>

        {/* Right Catalogue Content */}
        <div className="free-books-results-col">
          {/* Active Shelf Header Banner */}
          <div className="free-shelf-banner">
            <div>
              <span className="section-eyebrow">{activeShelfDef.kicker}</span>
              <h2 className="free-shelf-title">{activeShelfDef.label}</h2>
              <p className="free-shelf-desc">{activeShelfDef.description}</p>
            </div>
            <div className="free-shelf-result-badge">
              <strong>{filteredBooks.length}</strong>{' '}
              {filteredBooks.length === 1 ? 'Verified Volume' : 'Verified Volumes'}
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="my-lib-empty-box">
              <Layers size={28} />
              <h3>No volumes match the current filter combination</h3>
              <p>Try clearing one of the active filters to view more public-domain and open-access books.</p>
              <button type="button" className="btn-primary-solid" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="free-books-cards-list">
              {filteredBooks.map((book) => {
                const isBookmarked = bookmarkedIds.includes(book.id);
                const hasPdf = book.availableFormats.includes('PDF') && book.provenance.downloadPermitted;
                const hasEpub = book.availableFormats.includes('EPUB') && book.provenance.downloadPermitted;
                const isFullText = book.provenance.fullTextReadingPermitted;

                return (
                  <article key={book.id} className="free-book-detailed-card">
                    <div
                      className="free-book-cover-col"
                      onClick={() => onSelectBook(book.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <BookCover book={book} size="md" />
                    </div>

                    <div className="free-book-info-col">
                      {/* Access & Format Badges Row */}
                      <div className="free-book-badges-row">
                        {isFullText ? (
                          <span className="free-action-badge badge-read-online">
                            <CheckCircle2 size={12} /> Read Online (Full Text)
                          </span>
                        ) : book.accessStatus === 'preview_only' ? (
                          <span className="free-action-badge badge-preview-only">
                            Preview Only
                          </span>
                        ) : book.accessStatus === 'external_reading' ? (
                          <span className="free-action-badge badge-external">
                            External Borrow
                          </span>
                        ) : (
                          <span className="free-action-badge badge-metadata">
                            Metadata Only
                          </span>
                        )}

                        {hasPdf && (
                          <span className="free-action-badge badge-download-pdf">
                            <FileText size={12} /> Download PDF
                          </span>
                        )}
                        {hasEpub && (
                          <span className="free-action-badge badge-download-epub">
                            <BookOpen size={12} /> Download EPUB
                          </span>
                        )}
                        {book.provenance.isOpenAccessAcademic && (
                          <span className="free-action-badge badge-academic">
                            <ShieldCheck size={12} /> Open-Access Academic
                          </span>
                        )}
                      </div>

                      <h3 className="free-book-title">
                        <button
                          type="button"
                          className="free-book-title-btn"
                          onClick={() => onSelectBook(book.id)}
                        >
                          {book.title}
                        </button>
                      </h3>

                      <p className="free-book-author-line">
                        By <strong>{book.author}</strong> • {book.category} •{' '}
                        {book.publishedYear < 0
                          ? `${Math.abs(book.publishedYear)} BC`
                          : book.publishedYear}{' '}
                        • {book.pages} pages
                      </p>

                      <p className="free-book-synopsis">{book.shortSynopsis}</p>

                      <div className="free-book-provenance-strip">
                        <span>
                          <strong>Source:</strong> {book.provenance.sourceProvider}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Licence:</strong> {book.provenance.licenceName}
                        </span>
                        {book.availableFormats.length > 0 && (
                          <>
                            <span>•</span>
                            <span>
                              <strong>Formats:</strong> {book.availableFormats.join(', ')}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Honest Action Buttons */}
                      <div className="free-book-actions-row">
                        {isFullText && (
                          <>
                            <button
                              type="button"
                              className="btn-primary-solid btn-sm"
                              onClick={() => onReadBook(book.id, 0)}
                            >
                              <BookOpen size={14} />
                              <span>Read Full Book</span>
                            </button>

                            {hasPdf && (
                              <button
                                type="button"
                                className="btn-secondary-outline btn-sm"
                                onClick={() => onReadBook(book.id, 0, 'pdf')}
                              >
                                <FileText size={14} />
                                <span>Open PDF Reader</span>
                              </button>
                            )}

                            {hasPdf && (
                              <button
                                type="button"
                                className="btn-secondary-outline btn-sm"
                                onClick={() => onDownloadBook(book.id, 'pdf')}
                              >
                                <Download size={14} />
                                <span>Download PDF</span>
                              </button>
                            )}

                            {hasEpub && (
                              <button
                                type="button"
                                className="btn-secondary-outline btn-sm"
                                onClick={() => onDownloadBook(book.id, 'epub')}
                              >
                                <Download size={14} />
                                <span>Download EPUB</span>
                              </button>
                            )}
                          </>
                        )}

                        {book.accessStatus === 'preview_only' && (
                          <button
                            type="button"
                            className="btn-secondary-outline btn-sm"
                            onClick={() => onReadBook(book.id, 0)}
                          >
                            <BookOpen size={14} />
                            <span>Read Preview</span>
                          </button>
                        )}

                        {book.accessStatus === 'external_reading' && book.externalSources[0] && (
                          <a
                            href={book.externalSources[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary-outline btn-sm"
                          >
                            <ExternalLink size={14} />
                            <span>Borrow on Open Library</span>
                          </a>
                        )}

                        <button
                          type="button"
                          className="btn-secondary-outline btn-sm"
                          onClick={() => onSelectBook(book.id)}
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          className={`btn-icon-bookmark-sm ${isBookmarked ? 'active' : ''}`}
                          onClick={(e) => onToggleBookmark(book.id, e)}
                          aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark Book'}
                          title={isBookmarked ? 'Saved in Bookmarks' : 'Save Bookmark'}
                        >
                          <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

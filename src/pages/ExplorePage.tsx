import React, { useMemo, useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, X, Globe, Loader2, Check } from 'lucide-react';
import { BOOKS, CATEGORIES } from '../data/books';
import { Book, BookAccessType, CategorySlug } from '../types';
import { BookCard } from '../components/BookCard';
import { folioApi } from '../services/api';

export type SortOption = 'featured' | 'title' | 'newest' | 'popularity' | 'price-asc' | 'price-desc';
export type PriceFilter = 'all' | 'free' | 'paid';

interface ExplorePageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategorySlug | 'all';
  onCategoryChange: (cat: CategorySlug | 'all') => void;
  selectedCollection?: Book['collections'][number] | 'all';
  onCollectionChange: (col: Book['collections'][number] | 'all') => void;
  priceFilter: PriceFilter;
  onPriceFilterChange: (pf: PriceFilter) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  selectedAuthorId?: string | 'all';
  onClearAuthorFilter: () => void;
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string) => void;
  onRegisterDynamicBooks: (books: Book[]) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
  purchasedBookIds?: string[];
}

const PAGE_SIZE = 9; // 3x3 grid matching 3 columns perfectly

export const ExplorePage: React.FC<ExplorePageProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCollection = 'all',
  onCollectionChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortByChange,
  selectedAuthorId = 'all',
  onClearAuthorFilter,
  onSelectBook,
  onReadBook,
  onRegisterDynamicBooks,
  bookmarkedIds,
  onToggleBookmark,
  purchasedBookIds = []
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<BookAccessType | 'all'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'somali' | 'english'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Live Open Library search state
  const [openLibraryResults, setOpenLibraryResults] = useState<Book[]>([]);
  const [searchingOpenLibrary, setSearchingOpenLibrary] = useState<boolean>(false);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    searchQuery,
    selectedCategory,
    selectedGenre,
    languageFilter,
    priceFilter,
    accessFilter,
    sortBy,
    selectedCollection,
    selectedAuthorId
  ]);

  // Reset genre filter when category changes
  useEffect(() => {
    setSelectedGenre('all');
  }, [selectedCategory]);

  // Trigger live Open Library search when user types a query of 3+ chars
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setOpenLibraryResults([]);
      setSearchingOpenLibrary(false);
      return;
    }

    let cancelled = false;
    setSearchingOpenLibrary(true);
    const timer = setTimeout(() => {
      folioApi
        .searchOpenLibrary(q)
        .then((res) => {
          if (cancelled) return;
          setOpenLibraryResults(res.books || []);
          if (res.books && res.books.length > 0) {
            onRegisterDynamicBooks(res.books);
          }
          setSearchingOpenLibrary(false);
        })
        .catch(() => {
          if (!cancelled) setSearchingOpenLibrary(false);
        });
    }, 420);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Available genres based on current category selection
  const availableGenres = useMemo(() => {
    const pool =
      selectedCategory === 'all'
        ? BOOKS
        : BOOKS.filter((b) => b.categorySlug === selectedCategory);
    const set = new Set<string>(pool.map((b) => b.genre));
    return Array.from(set).sort();
  }, [selectedCategory]);

  // Dynamic counts for sidebar badges
  const freeCount = useMemo(() => BOOKS.filter((b) => b.isFree).length, []);
  const contemporaryCount = useMemo(() => BOOKS.filter((b) => !b.isFree).length, []);
  const somaliCount = useMemo(
    () =>
      BOOKS.filter(
        (b) =>
          b.categorySlug === 'somali-literature' ||
          b.language === 'somali' ||
          (b.language as any) === 'so'
      ).length,
    []
  );
  const englishCount = useMemo(
    () =>
      BOOKS.filter(
        (b) =>
          b.categorySlug !== 'somali-literature' &&
          b.language !== 'somali' &&
          (b.language as any) !== 'so'
      ).length,
    []
  );

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = BOOKS.filter((book) => {
      if (selectedCategory !== 'all') {
        const matchesCategory =
          book.categorySlug === selectedCategory ||
          (selectedCategory === 'somali-fiction' && (book.categorySlug as string) === 'somali-literature') ||
          (selectedCategory === 'history-culture' && (book.categorySlug as string) === 'history') ||
          (selectedCategory === 'education-learning' && (book.categorySlug as string) === 'education') ||
          (selectedCategory === 'language-linguistics' && (book.categorySlug as string) === 'technology-programming') ||
          (selectedCategory === 'self-development-business' && ['business-finance', 'personal-development'].includes(book.categorySlug as string)) ||
          (selectedCategory === 'english-arabic-relevant' && ['fiction', 'philosophy', 'romance', 'mystery-thriller', 'science'].includes(book.categorySlug as string));

        if (!matchesCategory) return false;
      }
      if (selectedGenre !== 'all' && book.genre !== selectedGenre) {
        return false;
      }
      if (selectedCollection !== 'all' && !book.collections.includes(selectedCollection)) {
        return false;
      }
      if (selectedAuthorId !== 'all' && book.authorId !== selectedAuthorId) {
        return false;
      }
      if (priceFilter === 'free' && !book.isFree) {
        return false;
      }
      if (priceFilter === 'paid' && book.isFree) {
        return false;
      }
      if (accessFilter !== 'all' && book.accessType !== accessFilter) {
        return false;
      }
      if (languageFilter === 'somali' && book.language !== 'somali' && (book.categorySlug as string) !== 'somali-literature' && (book.language as any) !== 'so') {
        return false;
      }
      if (languageFilter === 'english' && (book.language === 'somali' || (book.categorySlug as string) === 'somali-literature' || (book.language as any) === 'so')) {
        return false;
      }
      if (q) {
        const inTitle = book.title.toLowerCase().includes(q);
        const inSubtitle = book.subtitle?.toLowerCase().includes(q) || false;
        const inAuthor = book.author.toLowerCase().includes(q);
        const inCategory = book.category.toLowerCase().includes(q);
        const inGenre = book.genre.toLowerCase().includes(q);
        const inIsbn = book.isbn.toLowerCase().includes(q);
        const inRights = book.rightsHolder?.toLowerCase().includes(q) || false;
        const inLicense = book.licenceEvidence?.toLowerCase().includes(q) || false;
        if (!inTitle && !inSubtitle && !inAuthor && !inCategory && !inGenre && !inIsbn && !inRights && !inLicense) {
          return false;
        }
      }
      return true;
    });

    return [...matches].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
          return b.publishedYear - a.publishedYear;
        case 'popularity':
          return (b.rating?.count || 0) - (a.rating?.count || 0);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'featured':
        default: {
          const priorityIds = [
            'the-cartography-of-solitude',
            'shadows-in-the-olive-grove',
            'the-clockwork-architect',
            'echoes-of-antiquity',
            'wintering-in-kyoto',
            'the-alchemist-of-prague'
          ];
          const idxA = priorityIds.indexOf(a.id);
          const idxB = priorityIds.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        }
      }
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedGenre,
    languageFilter,
    selectedCollection,
    selectedAuthorId,
    priceFilter,
    accessFilter,
    sortBy
  ]);

  const displayedBooks = filteredBooks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBooks.length;

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  const handleResetAll = () => {
    onSearchChange('');
    onCategoryChange('all');
    setSelectedGenre('all');
    setAccessFilter('all');
    setLanguageFilter('all');
    onCollectionChange('all');
    onPriceFilterChange('all');
    onSortByChange('featured');
    onClearAuthorFilter();
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'all' ||
    selectedGenre !== 'all' ||
    accessFilter !== 'all' ||
    languageFilter !== 'all' ||
    selectedCollection !== 'all' ||
    selectedAuthorId !== 'all' ||
    priceFilter !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="explore-page-luxury-canvas">
      {/* ======================================================================
          1. TOP BREADCRUMB & ACTIVE FILTER PILLS BAR (MATCHING SCREENSHOT)
         ====================================================================== */}
      <div className="explore-subbar-container">
        <div className="explore-subbar-inner">
          {/* Left: Breadcrumbs + Showing Count */}
          <div className="explore-subbar-left">
            <nav className="explore-breadcrumbs" aria-label="Breadcrumb">
              <span className="breadcrumb-root">Library Catalogue</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Curated Editions</span>
            </nav>
            <span className="explore-count-pill">
              Showing {displayedBooks.length} of {filteredBooks.length}
            </span>
          </div>

          {/* Right: Active Chips & Reset all */}
          <div className="explore-subbar-right">
            <span className="subbar-active-label">Active:</span>
            <div className="subbar-active-chips">
              {/* Active Edition Pill */}
              <span className="subbar-pill">
                Edition: {priceFilter === 'all' ? 'All Curated' : priceFilter === 'free' ? 'Free Editions' : 'Contemporary'}
                <button
                  type="button"
                  onClick={() => onPriceFilterChange('all')}
                  aria-label="Remove edition filter"
                  title="Remove edition filter"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              </span>

              {/* Active Availability Pill */}
              <span className="subbar-pill">
                Availability: {accessFilter === 'all' ? 'Open' : accessFilter === 'full-text' ? 'Full Ebook' : accessFilter}
                <button
                  type="button"
                  onClick={() => setAccessFilter('all')}
                  aria-label="Remove availability filter"
                  title="Remove availability filter"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              </span>

              {/* Extra active chips if user filtered further */}
              {selectedCategory !== 'all' && (
                <span className="subbar-pill">
                  Subject: {activeCategoryObj?.name || selectedCategory}
                  <button
                    type="button"
                    onClick={() => onCategoryChange('all')}
                    aria-label="Remove category filter"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              )}

              {languageFilter !== 'all' && (
                <span className="subbar-pill">
                  Language: {languageFilter === 'somali' ? 'Af-Soomaali' : 'English'}
                  <button
                    type="button"
                    onClick={() => setLanguageFilter('all')}
                    aria-label="Remove language filter"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              )}

              {searchQuery.trim() && (
                <span className="subbar-pill">
                  Query: &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Remove search query"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              className="subbar-reset-btn"
              onClick={handleResetAll}
            >
              Reset all
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================
          2. MAIN EXPLORE LAYOUT: LEFT SIDEBAR + RIGHT 3-COLUMN BOOK GRID
         ====================================================================== */}
      <div className="explore-main-container">
        {/* Mobile Filter Toggle Button */}
        <div className="explore-mobile-filter-bar hide-desktop" style={{ width: '100%', marginBottom: '0.75rem' }}>
          <button
            type="button"
            className="btn-explore-mobile-filter"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'var(--understory-surface, #FFFFFF)',
              border: '1px solid var(--understory-border, #E3E6DF)',
              borderRadius: 'var(--radius-xs, 4px)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--understory-ink, #202820)',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(32, 40, 32, 0.04)'
            }}
          >
            <Filter size={16} color="#173D2D" />
            <span>{mobileFiltersOpen ? 'Hide Filters & Categories' : 'Show Filters & Categories'}</span>
          </button>
        </div>

        {/* Left Filter Sidebar matching screenshot */}
        <aside className={`explore-filter-sidebar ${mobileFiltersOpen ? 'open' : ''}`} aria-label="Filter Catalogue">
          {/* Sidebar Header: Title + Clear */}
          <div className="filter-sidebar-header">
            <div className="sidebar-title-wrap">
              <Filter size={15} className="sidebar-filter-icon" />
              <h2 className="sidebar-title">Filter Catalogue</h2>
            </div>
            <button
              type="button"
              className="sidebar-clear-link"
              onClick={handleResetAll}
            >
              Clear
            </button>
          </div>

          {/* 1. Search Title, Author or ISBN */}
          <div className="sidebar-field-group">
            <label htmlFor="explore-search-input" className="sidebar-field-label">
              SEARCH TITLE, AUTHOR OR ISBN
            </label>
            <div className="sidebar-search-box">
              <Search size={14} className="sidebar-search-icon" />
              <input
                id="explore-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Austen, 9780"
                className="sidebar-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="sidebar-search-clear"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* 2. Reading Availability Dropdown */}
          <div className="sidebar-field-group">
            <label htmlFor="explore-access-select" className="sidebar-field-label">
              READING AVAILABILITY
            </label>
            <div className="sidebar-select-wrapper">
              <select
                id="explore-access-select"
                className="sidebar-select"
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as BookAccessType | 'all')}
              >
                <option value="all">All Availability ({BOOKS.length})</option>
                <option value="full-text">
                  Full Ebook Available ({BOOKS.filter((b) => b.accessType === 'full-text').length})
                </option>
                <option value="preview-only">
                  Sample Preview Available ({BOOKS.filter((b) => b.accessType === 'preview-only').length})
                </option>
                <option value="external-only">
                  Available via External Source ({BOOKS.filter((b) => b.accessType === 'external-only').length})
                </option>
                <option value="metadata-only">
                  Metadata Only ({BOOKS.filter((b) => b.accessType === 'metadata-only').length})
                </option>
              </select>
            </div>
          </div>

          {/* 3. Edition Tier Segmented Pills */}
          <div className="sidebar-field-group">
            <span className="sidebar-field-label">EDITION TIER</span>
            <div className="sidebar-tier-grid" role="group" aria-label="Edition Tier Filter">
              <button
                type="button"
                className={`sidebar-tier-btn ${priceFilter === 'all' ? 'active' : ''}`}
                onClick={() => onPriceFilterChange('all')}
              >
                All ({BOOKS.length})
              </button>
              <button
                type="button"
                className={`sidebar-tier-btn ${priceFilter === 'free' ? 'active' : ''}`}
                onClick={() => onPriceFilterChange('free')}
              >
                Free ({freeCount})
              </button>
              <button
                type="button"
                className={`sidebar-tier-btn ${priceFilter === 'paid' ? 'active' : ''}`}
                onClick={() => onPriceFilterChange('paid')}
              >
                Contemporary ({contemporaryCount})
              </button>
            </div>
          </div>

          {/* 4. Language / Luqadda Segmented Pills */}
          <div className="sidebar-field-group">
            <span className="sidebar-field-label">LANGUAGE / LUQADDA</span>
            <div className="sidebar-lang-grid" role="group" aria-label="Language Filter">
              <button
                type="button"
                className={`sidebar-lang-btn ${languageFilter === 'all' ? 'active' : ''}`}
                onClick={() => setLanguageFilter('all')}
              >
                <span className="lang-main">All ({BOOKS.length})</span>
              </button>
              <button
                type="button"
                className={`sidebar-lang-btn ${languageFilter === 'somali' ? 'active' : ''}`}
                onClick={() => setLanguageFilter('somali')}
              >
                <span className="lang-part">Af-</span>
                <span className="lang-part">Soomaali</span>
                <span className="lang-count">({somaliCount})</span>
              </button>
              <button
                type="button"
                className={`sidebar-lang-btn ${languageFilter === 'english' ? 'active' : ''}`}
                onClick={() => setLanguageFilter('english')}
              >
                <span className="lang-part">English</span>
                <span className="lang-count">({englishCount})</span>
              </button>
            </div>
          </div>

          {/* 5. Subject Category with Dynamic Counts */}
          <div className="sidebar-field-group">
            <div className="sidebar-category-header">
              <span className="sidebar-field-label">SUBJECT CATEGORY</span>
              <span className="sidebar-subjects-count">{CATEGORIES.length + 1} Subjects</span>
            </div>
            <ul className="sidebar-category-list">
              <li>
                <button
                  type="button"
                  className={`sidebar-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => onCategoryChange('all')}
                >
                  <span className="cat-name">All Categories</span>
                  <span className="cat-count-badge">{BOOKS.length}</span>
                </button>
              </li>
              {CATEGORIES.map((cat) => {
                const count = BOOKS.filter(
                  (b) =>
                    b.categorySlug === cat.slug ||
                    (cat.slug === 'somali-fiction' && (b.categorySlug as string) === 'somali-literature') ||
                    (cat.slug === 'history-culture' && (b.categorySlug as string) === 'history') ||
                    (cat.slug === 'education-learning' && (b.categorySlug as string) === 'education') ||
                    (cat.slug === 'language-linguistics' && (b.categorySlug as string) === 'technology-programming') ||
                    (cat.slug === 'self-development-business' && ['business-finance', 'personal-development'].includes(b.categorySlug as string)) ||
                    (cat.slug === 'english-arabic-relevant' && ['fiction', 'philosophy', 'romance', 'mystery-thriller', 'science'].includes(b.categorySlug as string))
                ).length;

                return (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      className={`sidebar-category-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                      onClick={() => onCategoryChange(cat.slug)}
                    >
                      <span className="cat-name">{cat.name}</span>
                      <span className="cat-count-badge">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 6. Specific Genre Dropdown */}
          <div className="sidebar-field-group">
            <label htmlFor="explore-genre-select" className="sidebar-field-label">
              SPECIFIC GENRE
            </label>
            <div className="sidebar-select-wrapper">
              <select
                id="explore-genre-select"
                className="sidebar-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">All Genres ({availableGenres.length})</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. Bottom Apply Active Filters Button */}
          <button
            type="button"
            className="sidebar-apply-btn"
            onClick={() => {
              const grid = document.querySelector('.explore-content-header');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Check size={16} strokeWidth={2.5} />
            <span>Apply Active Filters</span>
          </button>
        </aside>

        {/* Right Main Content: Header + 3-Column Card Grid */}
        <main className="explore-main-content">
          {/* Header Row: Title + Live Collection Pill + Sort by */}
          <div className="explore-content-header">
            <div className="explore-heading-group">
              <h1 className="explore-main-title">Curated Library Editions</h1>
              <span className="live-collection-pill">Live Collection</span>
            </div>

            <div className="explore-sort-wrapper">
              <label htmlFor="explore-sort-select" className="explore-sort-label">
                Sort by:
              </label>
              <select
                id="explore-sort-select"
                className="explore-sort-dropdown"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as SortOption)}
              >
                <option value="featured">Editorial Curated</option>
                <option value="popularity">Popularity (Most Rated)</option>
                <option value="newest">Publication Year (Newest)</option>
                <option value="title">Title (A – Z)</option>
                <option value="price-asc">Price (Free to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* 3-Column Book Card Grid */}
          {displayedBooks.length > 0 ? (
            <>
              <div className="explore-books-grid-3">
                {displayedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelectBook={onSelectBook}
                    onReadBook={onReadBook}
                    isBookmarked={bookmarkedIds.includes(book.id)}
                    onToggleBookmark={onToggleBookmark}
                    isPurchased={purchasedBookIds.includes(book.id)}
                  />
                ))}
              </div>

              {/* Pagination / Load More */}
              {hasMore && (
                <div className="explore-pagination-bar">
                  <p className="pagination-progress-text">
                    Viewing {displayedBooks.length} of {filteredBooks.length} matching curated books
                  </p>
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="btn-primary-solid"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    >
                      Load More Editions ({Math.min(PAGE_SIZE, filteredBooks.length - displayedBooks.length)} more)
                    </button>
                    <button
                      type="button"
                      className="btn-secondary-outline"
                      onClick={() => setVisibleCount(filteredBooks.length)}
                    >
                      Show All ({filteredBooks.length})
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="explore-empty-state" role="status">
              <h2 className="empty-state-title">No Local Curated Matches</h2>
              <p className="empty-state-desc">
                No books in our curated catalogue matched your exact filter combination.{' '}
                {searchQuery.trim().length >= 3
                  ? 'See live results from the global Open Library archive below.'
                  : 'Try broadening your search or resetting the active filters.'}
              </p>
              <button type="button" className="btn-primary-solid" onClick={handleResetAll}>
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Global Archive Open Library Results (when user queries) */}
          {searchQuery.trim().length >= 3 && (
            <section className="open-library-live-section" aria-label="Live Open Library Results">
              <div className="open-library-live-header">
                <div>
                  <span className="section-eyebrow">
                    <Globe size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-2px' }} />
                    LIVE BIBLIOGRAPHIC INDEX • OPEN LIBRARY &amp; PROJECT GUTENBERG
                  </span>
                  <h2 className="open-library-live-title">
                    Global Archive Results for “{searchQuery.trim()}”
                  </h2>
                </div>
                {searchingOpenLibrary && (
                  <span className="ol-loading-pill">
                    <Loader2 size={14} className="spin-icon" /> Querying Open Library...
                  </span>
                )}
              </div>

              {openLibraryResults.length > 0 ? (
                <div className="explore-books-grid-3">
                  {openLibraryResults.slice(0, 6).map((olBook) => (
                    <BookCard
                      key={olBook.id}
                      book={olBook}
                      onSelectBook={onSelectBook}
                      onReadBook={onReadBook}
                      isBookmarked={bookmarkedIds.includes(olBook.id)}
                      onToggleBookmark={onToggleBookmark}
                      isPurchased={purchasedBookIds.includes(olBook.id)}
                    />
                  ))}
                </div>
              ) : (
                !searchingOpenLibrary && (
                  <p className="ol-empty-note">
                    No external Open Library matches returned for “{searchQuery.trim()}”.
                  </p>
                )
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

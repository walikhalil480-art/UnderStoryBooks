import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Bookmark,
  Star,
  Volume2,
  Play,
  Pause,
  Check,
  CheckCircle2,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Search,
  Award,
  Layers,
  ArrowUpRight,
  Clock,
  Sparkles,
  Feather,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Compass
} from 'lucide-react';
import { BOOKS, CATEGORIES, AUTHORS, STOREFRONT_CURATED_BOOKS } from '../data/books';
import { Book, CategorySlug, CollectionTag } from '../types';
import { PageRoute } from '../components/Navbar';

interface HomePageProps {
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string) => void;
  onSelectCategory: (categorySlug: CategorySlug) => void;
  onNavigate: (page: PageRoute) => void;
  onSearchSubmit: (query: string) => void;
  onExplorePreset: (preset: {
    collection?: CollectionTag;
    priceFilter?: 'all' | 'free' | 'paid';
    sortBy?: 'featured' | 'title' | 'newest' | 'popularity' | 'price-asc';
  }) => void;
  onSelectAuthor: (authorId: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectBook,
  onReadBook,
  onSelectCategory,
  onNavigate,
  onSearchSubmit,
  onExplorePreset,
  onSelectAuthor,
  bookmarkedIds,
  onToggleBookmark
}) => {
  // Hero interactive audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeGenrePill, setActiveGenrePill] = useState('Curator’s Ensemble');

  // Genre pill chips matching the screenshot
  const GENRE_PILLS = [
    { label: 'Curator’s Ensemble', slug: 'all' },
    { label: 'Literary Fiction', slug: 'fiction' },
    { label: 'Historical Memoir', slug: 'biography-memoir' },
    { label: 'Philosophy & Ethics', slug: 'philosophy' },
    { label: 'Speculative Sci-Fi', slug: 'science' },
    { label: 'Poetry & Verse', slug: 'poetry-gabay' },
    { label: 'Rare Essays', slug: 'somali-fiction' },
    { label: 'Architecture', slug: 'history-culture' }
  ];

  // Dynamically select the Book of the Month / Hero book from real BOOKS database
  const heroBook = useMemo(() => {
    return (
      BOOKS.find((b) => b.id === 'the-great-gatsby') ||
      BOOKS.find((b) => b.collections.includes('featured')) ||
      BOOKS[0]
    );
  }, []);

  // Handpicked Selections from the real BOOKS database with interactive pagination
  const [curationPage, setCurationPage] = useState(0);

  const allCurationPool = useMemo(() => {
    const preferredIds = [
      'as-a-man-thinketh',
      'the-richest-man-in-babylon',
      'how-should-one-read-a-book',
      'to-kill-a-mockingbird',
      '1984-george-orwell',
      'the-old-man-and-the-sea',
      'the-road-mccarthy',
      'pride-and-prejudice',
      'hound-of-the-baskervilles',
      'meditations',
      'the-prophet-kahlil-gibran',
      'mrs-dalloway',
      'the-intelligent-investor',
      'brave-new-world',
      'war-and-peace-tolstoy'
    ];
    const selected = preferredIds
      .map((id) => BOOKS.find((b) => b.id === id))
      .filter((b): b is Book => Boolean(b && b.id !== heroBook.id));
    const remainder = BOOKS.filter((b) => b.id !== heroBook.id && !selected.some((s) => s.id === b.id));
    return [...selected, ...remainder];
  }, [heroBook.id]);

  const maxCurationPages = Math.max(1, Math.ceil(allCurationPool.length / 4));

  const staffCurationBooks = useMemo(() => {
    const start = (curationPage % maxCurationPages) * 4;
    return allCurationPool.slice(start, start + 4);
  }, [allCurationPool, curationPage, maxCurationPages]);

  // Recently Added Editions to showcase directly on the front page
  const recentlyAddedBooks = useMemo(() => {
    const list = BOOKS.filter((b) => b.isRecentlyAdded || b.collections?.includes('recently-added'));
    return list.slice(0, 4);
  }, []);

  // Curator Recommendations from genuine BOOKS database
  const algorithmicBooks = useMemo(() => {
    const preferredIds = ['pride-and-prejudice', 'hound-of-the-baskervilles', 'meditations', 'the-intelligent-investor', 'mrs-dalloway'];
    const selected = preferredIds
      .map((id) => BOOKS.find((b) => b.id === id))
      .filter((b): b is Book => Boolean(b && b.id !== heroBook.id));
    if (selected.length >= 5) return selected.slice(0, 5);
    const remainder = BOOKS.filter((b) => b.id !== heroBook.id && !selected.some((s) => s.id === b.id));
    return [...selected, ...remainder].slice(0, 5);
  }, [heroBook.id]);

  // Curated Somali Masterpieces in the same luxury storefront styling
  const somaliFeaturedBooks = useMemo(() => {
    const somali = BOOKS.filter((b) => b.language === 'so' || b.collections.includes('somali-books'));
    return somali.length >= 4 ? somali.slice(0, 4) : BOOKS.slice(0, 4);
  }, []);

  return (
    <div className="luxury-storefront-canvas">
      {/* ======================================================================
      {/* ======================================================================
          1. HERO SECTION: EDITORIAL HEADLINE & REAL BOOK SHOWCASE VITRINE
         ====================================================================== */}
      <section className="ebaro-hero-container" aria-label="Understory Editorial Hero">
        <div className="ebaro-hero-card">
          {/* Left Column: Literary Headline, Restrained Editorial Lead, and Clear Actions */}
          <div className="hero-content-col">
            <span className="hero-kicker-tag">
              UNDERSTORY • EDITIONS &amp; DIGITAL ARCHIVE
            </span>

            <h1 className="hero-editorial-headline">
              A digital sanctuary for timeless literature and cultural memory.
            </h1>

            <p className="hero-editorial-lead">
              Immerse yourself in authorized, unabridged digital editions from history’s greatest
              novelists, essayists, and Somali cultural masters. Crafted for calm reading with
              typographic precision and instant in-browser EPUB and archival PDF streaming.
            </p>

            {/* Action Buttons Row */}
            <div className="hero-actions-row">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => onNavigate('explore')}
              >
                <span>Explore the Catalogue</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => onReadBook(heroBook.id)}
              >
                <BookOpen size={16} style={{ color: '#173D2D' }} />
                <span>Read &quot;{heroBook.title}&quot;</span>
              </button>

              <button
                type="button"
                className={`btn-hero-bookmark ${
                  bookmarkedIds.includes(heroBook.id) ? 'bookmarked' : ''
                }`}
                onClick={(e) => onToggleBookmark(heroBook.id, e)}
                aria-label="Save to Reading List"
                title="Save to Reading List"
              >
                <Bookmark
                  size={18}
                  fill={bookmarkedIds.includes(heroBook.id) ? '#173D2D' : 'transparent'}
                />
              </button>
            </div>

            {/* Key Provenance Indicators */}
            <div className="hero-provenance-row">
              <span className="hero-provenance-item">
                <CheckCircle2 size={14} style={{ color: '#173D2D' }} />
                <span>Verified Unabridged Texts</span>
              </span>
              <span className="provenance-sep">•</span>
              <span className="hero-provenance-item">
                <BookOpen size={14} style={{ color: '#173D2D' }} />
                <span>In-Browser EPUB &amp; Archival PDF</span>
              </span>
              <span className="provenance-sep">•</span>
              <span className="hero-provenance-item">
                <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                <span>4.9 / 5.0 Reader Rating</span>
              </span>
            </div>
          </div>

          {/* Right Column: Carefully Art-Directed Featured Book Showcase */}
          <div className="hero-visual-showcase">
            <div className="hero-book-vitrine">
              <div
                className="hero-book-cover-stage editorial-book-spine"
                onClick={() => onSelectBook(heroBook.id)}
                title={`View ${heroBook.title}`}
              >
                <img
                  src={heroBook.coverUrl}
                  alt={heroBook.title}
                  className="hero-book-cover-img"
                />
              </div>

              <div className="hero-book-info-col">
                <span className="hero-book-eyebrow">
                  FEATURED EDITION • {heroBook.publishedYear > 0 ? heroBook.publishedYear : 1925}
                </span>

                <h2
                  className="hero-book-title"
                  onClick={() => onSelectBook(heroBook.id)}
                >
                  {heroBook.title}
                </h2>

                <p className="hero-book-author">
                  by <strong>{heroBook.author}</strong>
                </p>

                <p className="hero-book-quote">
                  &ldquo;{heroBook.shortSynopsis || 'So we beat on, boats against the current, borne back ceaselessly into the past.'}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#747D74', marginBottom: '0.35rem' }}>
                  <span>{heroBook.pages} pages</span>
                  <span>•</span>
                  <span>{heroBook.category}</span>
                </div>

                <button
                  type="button"
                  className="hero-book-read-cta"
                  onClick={() => onReadBook(heroBook.id)}
                >
                  <BookOpen size={14} />
                  <span>Open Reader Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          2. BROWSE CATALOG BY GENRE BAR
         ====================================================================== */}
      <section className="ebaro-genre-bar-container" aria-label="Browse Catalog by Genre">
        <div className="genre-bar-header">
          <span className="genre-bar-label">Browse Catalog by Genre</span>
          <button
            type="button"
            className="genre-bar-lexicon-link"
            onClick={() => onNavigate('categories')}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <span>View Full Lexicon (42)</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="genre-chips-scroll-row" role="tablist">
          {GENRE_PILLS.map((pill) => {
            const isSelected = activeGenrePill === pill.label;
            return (
              <button
                key={pill.label}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`genre-chip-pill ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setActiveGenrePill(pill.label);
                  if (pill.slug !== 'all') {
                    onSelectCategory(pill.slug as CategorySlug);
                  }
                }}
              >
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================================================================
          3. TRENDING & STAFF CURATIONS SECTION
         ====================================================================== */}
      <section className="ebaro-curations-section" aria-label="Trending & Staff Curations">
        <div className="curations-section-header">
          <div>
            <span className="section-eyebrow">HANDPICKED SELECTIONS</span>
            <h2 className="section-heading-bold">Trending &amp; Staff Curations</h2>
          </div>

          <div className="curations-nav-arrows">
            <button
              type="button"
              className="btn-arrow-circle"
              aria-label="Previous Curations"
              title={`Page ${(curationPage % maxCurationPages) + 1} of ${maxCurationPages}`}
              onClick={() => setCurationPage((prev) => (prev > 0 ? prev - 1 : maxCurationPages - 1))}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="btn-arrow-circle"
              aria-label="Next Curations"
              title={`Page ${(curationPage % maxCurationPages) + 1} of ${maxCurationPages}`}
              onClick={() => setCurationPage((prev) => (prev + 1) % maxCurationPages)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 4-Card Luxury Grid */}
        <div className="curations-cards-grid">
          {staffCurationBooks.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="curation-book-card"
                onClick={() => onSelectBook(item.id)}
              >
                <div className="card-cover-container">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="card-cover-img"
                    loading="lazy"
                  />
                  <span className="card-floating-genre-pill">{item.category}</span>
                  {(item.isRecentlyAdded || item.collections?.includes('recently-added') || item.collections?.includes('new-arrivals')) && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0.65rem',
                        left: '0.65rem',
                        backgroundColor: '#173D2D',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(23, 61, 45, 0.3)',
                        zIndex: 2
                      }}
                    >
                      Recently Added
                    </span>
                  )}
                  <button
                    type="button"
                    className={`card-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(item.id, e);
                    }}
                    aria-label="Save book"
                  >
                    <Bookmark
                      size={15}
                      fill={isBookmarked ? '#173D2D' : 'transparent'}
                      stroke={isBookmarked ? '#173D2D' : 'currentColor'}
                    />
                  </button>
                </div>

                <h3 className="card-title-text">{item.title}</h3>
                <p className="card-author-year">
                  {item.author} • {item.publishedYear > 0 ? item.publishedYear : 'Classic'}
                </p>

                <div className="card-meta-score">
                  <Star size={13} fill="#F59E0B" stroke="#F59E0B" className="card-meta-score-star" />
                  <span>{(item.rating?.score ?? 4.8).toFixed(1)}</span>
                  <span className="card-meta-pages">• {item.pages} pp</span>
                </div>

                <div className="card-footer-row">
                  <div className="card-price-wrap">
                    <span className="card-price-main">
                      {item.isFree ? 'Open Access' : item.priceDisplay || `$${item.price.toFixed(2)}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-card-sample"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReadBook(item.id);
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Read</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================================
          NEWLY ADDED EDITIONS & SPECIAL RESTORATIONS
         ====================================================================== */}
      <section className="ebaro-curations-section" aria-label="Recently Added Editions">
        <div className="curations-section-header">
          <div>
            <span className="section-eyebrow" style={{ color: '#173D2D' }}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
              RECENTLY ADDED • NEW TO THE ARCHIVE
            </span>
            <h2 className="section-heading-bold">Recently Added to Library</h2>
          </div>

          <button
            type="button"
            className="btn-card-sample"
            onClick={() => onExplorePreset({ collection: 'recently-added' })}
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.86rem',
              backgroundColor: '#DCE6DC',
              color: '#173D2D',
              borderColor: '#CBD5CB'
            }}
          >
            <span>Explore All New Editions</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="curations-cards-grid">
          {recentlyAddedBooks.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="curation-book-card"
                onClick={() => onSelectBook(item.id)}
              >
                <div className="card-cover-container">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="card-cover-img"
                    loading="lazy"
                  />
                  <span
                    className="card-floating-genre-pill"
                    style={{ backgroundColor: '#DCE6DC', color: '#173D2D', borderColor: '#CBD5CB' }}
                  >
                    Recently Added
                  </span>
                  <button
                    type="button"
                    className={`card-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(item.id, e);
                    }}
                    aria-label="Save book"
                  >
                    <Bookmark
                      size={15}
                      fill={isBookmarked ? '#173D2D' : 'transparent'}
                      stroke={isBookmarked ? '#173D2D' : 'currentColor'}
                    />
                  </button>
                </div>

                <h3 className="card-title-text">{item.title}</h3>
                <p className="card-author-year">
                  {item.author} • {item.publishedYear > 0 ? item.publishedYear : 'Classic'}
                </p>

                <div className="card-meta-score">
                  <Star size={13} fill="#F59E0B" stroke="#F59E0B" className="card-meta-score-star" />
                  <span>{(item.rating?.score ?? 4.9).toFixed(1)}</span>
                  <span className="card-meta-pages">• {item.pages} pp</span>
                </div>

                <div className="card-footer-row">
                  <div className="card-price-wrap">
                    <span className="card-price-main">
                      {item.isFree ? 'Free' : item.priceDisplay || `$${item.price.toFixed(2)}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-card-sample"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReadBook(item.id);
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Read</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================================
          EDITORIAL SHOWCASE 1: IN-BROWSER READING SANCTUARY (SIDE-BY-SIDE)
         ====================================================================== */}
      <section className="ebaro-editorial-feature-section" aria-label="Reading Sanctuary Feature">
        <div className="editorial-feature-split">
          {/* Image Column: Left */}
          <div className="editorial-feature-image-col">
            <img
              src="/images/features/reading-sanctuary.jpg"
              alt="Serene digital reading sanctuary with open book and warm light"
              className="editorial-feature-img"
              loading="lazy"
            />
            <div className="editorial-feature-floating-badge">
              <div className="editorial-feature-badge-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="editorial-feature-badge-title">Distraction-Free Digital Reading</div>
                <div className="editorial-feature-badge-sub">Over 12,000 active reading sessions across 40+ countries</div>
              </div>
            </div>
          </div>

          {/* Content Column: Right */}
          <div className="editorial-feature-content-col">
            <span className="editorial-feature-eyebrow indigo">
              <BookOpen size={13} />
              <span>THE DIGITAL ARCHIVE • TIMELESS READS</span>
            </span>

            <h2 className="editorial-feature-title">
              A Refined Reading Atmosphere Designed for True Book Lovers
            </h2>

            <p className="editorial-feature-lead">
              Experience literature the way authors intended. Understory pairs timeless classics and authorized editions with an elegant in-browser reading engine featuring custom paper atmospheres, serif and dyslexic typography, and instant cloud sync.
            </p>

            <div className="editorial-feature-points-list">
              <div className="editorial-feature-point-item">
                <div className="point-icon-box indigo">
                  <Layers size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">4 Bespoke Paper Atmospheres</div>
                  <div className="point-desc">
                    Switch between Crisp White, Warm Sepia, Slate, and Obsidian OLED Dark for comfortable reading at any hour.
                  </div>
                </div>
              </div>

              <div className="editorial-feature-point-item">
                <div className="point-icon-box emerald">
                  <CheckCircle2 size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Zero Installation Required</div>
                  <div className="point-desc">
                    Instant access to complete EPUB, archival PDF, and plain-text formats directly in your web browser with offline support.
                  </div>
                </div>
              </div>

              <div className="editorial-feature-point-item">
                <div className="point-icon-box amber">
                  <Clock size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Continuous Reading Progress</div>
                  <div className="point-desc">
                    Your reading position, chapters, and bookmarks automatically synchronize with your personal digital library.
                  </div>
                </div>
              </div>
            </div>

            <div className="editorial-feature-actions">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => onNavigate('explore')}
                style={{
                  backgroundColor: '#173D2D',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.94rem',
                  fontWeight: 700
                }}
              >
                <span>Browse All Library Titles</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => onReadBook(heroBook.id)}
                style={{
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.94rem',
                  fontWeight: 700
                }}
              >
                <BookOpen size={16} style={{ color: '#173D2D' }} />
                <span>Open Reader Preview</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          4. CURATOR'S RECOMMENDATIONS
         ====================================================================== */}
      <section className="ebaro-algorithmic-section" aria-label="Curator's Recommendations">
        <div className="algorithmic-header">
          <div>
            <span className="section-eyebrow">
              <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
              CURATOR’S RECOMMENDATIONS
            </span>
            <h2 className="algorithmic-headline">
              Recommended Reading for You
            </h2>
          </div>
          <p className="algorithmic-subtext">
            Handpicked classic and contemporary editions exploring human resilience, thought, and timeless narratives.
          </p>
        </div>

        {/* 5-Book Showcase Row */}
        <div className="algorithmic-cards-row">
          {algorithmicBooks.map((item) => (
            <div
              key={item.id}
              className="algorithmic-book-card"
              onClick={() => onSelectBook(item.id)}
              title={`${item.title} by ${item.author}`}
            >
              <img
                src={item.coverUrl}
                alt={item.title}
                className="algorithmic-cover-img"
                loading="lazy"
              />
              <span className="algorithmic-bookmark-overlay">
                <Bookmark size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================================
          EDITORIAL SHOWCASE 2: LIFELONG READING & WEALTH (SIDE-BY-SIDE REVERSE)
         ====================================================================== */}
      <section className="ebaro-editorial-feature-section" aria-label="Reading Habit & Personal Growth Feature">
        <div className="editorial-feature-split reverse">
          {/* Image Column: Right (due to reverse layout) */}
          <div className="editorial-feature-image-col">
            <img
              src="/images/features/reading-habit.jpg"
              alt="Inspiring book collection and sunlight reading space"
              className="editorial-feature-img"
              loading="lazy"
            />
            <div className="editorial-feature-floating-badge">
              <div className="editorial-feature-badge-icon" style={{ color: '#173D2D', backgroundColor: 'rgba(23, 61, 45, 0.12)' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="editorial-feature-badge-title">The 15-Minute Daily Reading Track</div>
                <div className="editorial-feature-badge-sub">Essential classics for mental clarity, discipline, and wealth</div>
              </div>
            </div>
          </div>

          {/* Content Column: Left */}
          <div className="editorial-feature-content-col">
            <span className="editorial-feature-eyebrow emerald">
              <Compass size={13} />
              <span>START YOUR JOURNEY • DISCIPLINE &amp; WEALTH</span>
            </span>

            <h2 className="editorial-feature-title">
              Timeless Wisdom to Build Discipline, Focus, and Financial Freedom
            </h2>

            <p className="editorial-feature-lead">
              Every significant life journey begins with the right book. We have curated a foundational reading track designed for anyone looking to build a consistent habit, cultivate self-discipline, and master personal financial literacy.
            </p>

            <div className="editorial-feature-points-list">
              <div className="editorial-feature-point-item">
                <div className="point-icon-box emerald">
                  <Star size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Motivation &amp; Self-Mastery</div>
                  <div className="point-desc">
                    James Allen’s <em>As a Man Thinketh</em> reveals how disciplined thought shapes character, purpose, and lasting success.
                  </div>
                </div>
              </div>

              <div className="editorial-feature-point-item">
                <div className="point-icon-box amber">
                  <TrendingUp size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Enduring Financial Principles</div>
                  <div className="point-desc">
                    George S. Clason’s <em>The Richest Man in Babylon</em> shares the timeless secrets of wealth accumulation, savings, and gold.
                  </div>
                </div>
              </div>

              <div className="editorial-feature-point-item">
                <div className="point-icon-box indigo">
                  <BookOpen size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">An Accessible Guide for Beginners</div>
                  <div className="point-desc">
                    Virginia Woolf’s <em>How Should One Read a Book?</em> invites new readers into literature with warmth, freedom, and intellectual joy.
                  </div>
                </div>
              </div>
            </div>

            <div className="editorial-feature-actions">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => onSelectBook('the-richest-man-in-babylon')}
                style={{
                  backgroundColor: '#173D2D',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(23, 61, 45, 0.22)'
                }}
              >
                <span>Read &quot;The Richest Man in Babylon&quot;</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => onSelectBook('how-should-one-read-a-book')}
                style={{
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.94rem',
                  fontWeight: 700
                }}
              >
                <BookOpen size={16} style={{ color: '#173D2D' }} />
                <span>Beginner’s Guide</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          5. SOMALI LITERATURE & CULTURAL HERITAGE SPOTLIGHT
         ====================================================================== */}
      <section
        className="ebaro-curations-section"
        style={{ paddingBottom: '5rem' }}
        aria-label="Somali Literary Heritage"
      >
        <div className="curations-section-header">
          <div>
            <span className="section-eyebrow" style={{ color: '#173D2D' }}>
              QAYBTA SOOMAALIGA • SOMALI HERITAGE LIBRARY
            </span>
            <h2 className="section-heading-bold">Buugaagta Af-Soomaaliga &amp; Suugaanta</h2>
          </div>

          <button
            type="button"
            className="btn-card-sample"
            onClick={() => onNavigate('somali-books')}
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.86rem',
              backgroundColor: '#DCE6DC',
              color: '#173D2D',
              borderColor: '#CBD5CB'
            }}
          >
            <span>Eeg Dhammaan Buugaagta Soomaaliga</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="curations-cards-grid">
          {somaliFeaturedBooks.map((book) => {
            const isBookmarked = bookmarkedIds.includes(book.id);
            return (
              <div
                key={book.id}
                className="curation-book-card"
                onClick={() => onSelectBook(book.id)}
              >
                <div className="card-cover-container">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="card-cover-img"
                    loading="lazy"
                  />
                  <span
                    className="card-floating-genre-pill"
                    style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}
                  >
                    {book.categorySlug === 'islamic-studies' ? 'Islamic' : 'Somali Classic'}
                  </span>
                  <button
                    type="button"
                    className={`card-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(book.id, e);
                    }}
                    aria-label="Save book"
                  >
                    <Bookmark
                      size={15}
                      fill={isBookmarked ? '#173D2D' : 'transparent'}
                      stroke={isBookmarked ? '#173D2D' : 'currentColor'}
                    />
                  </button>
                </div>

                <h3 className="card-title-text">{book.title}</h3>
                <p className="card-author-year">
                  {book.author} • {book.publishedYear}
                </p>

                <div className="card-meta-score">
                  <Star size={13} fill="#F59E0B" stroke="#F59E0B" className="card-meta-score-star" />
                  <span>5.0</span>
                  <span className="card-meta-pages">• {book.pages} pp</span>
                </div>

                <div className="card-footer-row">
                  <div className="card-price-wrap">
                    <span className="card-price-main" style={{ color: '#173D2D' }}>
                      {book.priceDisplay || 'Free Open Access'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-card-sample"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReadBook(book.id);
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Akhriso</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================================
          EDITORIAL SHOWCASE 3: PRESERVING CULTURAL HERITAGE & AUTHOR EMPOWERMENT
         ====================================================================== */}
      <section className="ebaro-editorial-feature-section" aria-label="Somali Heritage & Author Empowerment Feature">
        <div className="editorial-feature-split">
          {/* Image Column: Left */}
          <div className="editorial-feature-image-col">
            <img
              src="/images/features/author-craft.jpg"
              alt="Author wooden desk with manuscript papers, fountain pen, and classic books"
              className="editorial-feature-img"
              loading="lazy"
            />
            <div className="editorial-feature-floating-badge">
              <div className="editorial-feature-badge-icon" style={{ color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)' }}>
                <Feather size={20} />
              </div>
              <div>
                <div className="editorial-feature-badge-title">Editorial Review &amp; Global Publishing</div>
                <div className="editorial-feature-badge-sub">Direct mobile money royalties for independent East African authors</div>
              </div>
            </div>
          </div>

          {/* Content Column: Right */}
          <div className="editorial-feature-content-col">
            <span className="editorial-feature-eyebrow amber">
              <Feather size={13} />
              <span>VOICES OF EAST AFRICA • AUTHOR EMPOWERMENT</span>
            </span>

            <h2 className="editorial-feature-title">
              Preserving Cultural Heritage and Empowering Independent Authors
            </h2>

            <p className="editorial-feature-lead">
              Literature thrives when voices from every culture are preserved and celebrated. Understory unites the rich oral poetry traditions (<em>Gabay</em>), historical archives, and contemporary literature of Somalia with global readers worldwide.
            </p>

            <div className="editorial-feature-points-list">
              <div className="editorial-feature-point-item">
                <div className="point-icon-box amber">
                  <ShieldCheck size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Authentic Archival Preservation</div>
                  <div className="point-desc">
                    Rare manuscripts and oral masterworks digitized with verified provenance and academic precision.
                  </div>
                </div>
              </div>

              <div className="editorial-feature-point-item">
                <div className="point-icon-box indigo">
                  <Smartphone size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Seamless Mobile Money Royalties</div>
                  <div className="point-desc">
                    Empowering local authors and publishers with instant micro-payments via EVC Plus, Premier Wallet, and cards.
                  </div>
                </div>
              </div>

              <div className="editorial-feature-point-item">
                <div className="point-icon-box emerald">
                  <Sparkles size={18} />
                </div>
                <div className="point-text-wrap">
                  <div className="point-title">Global Access for the Diaspora</div>
                  <div className="point-desc">
                    Connecting young readers and the Somali diaspora worldwide with authentic mother-tongue literature.
                  </div>
                </div>
              </div>
            </div>

            <div className="editorial-feature-actions">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => onNavigate('author-submissions')}
                style={{
                  backgroundColor: '#0F172A',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.94rem',
                  fontWeight: 700
                }}
              >
                <span>Submit Work to Editorial Desk</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => onNavigate('somali-books')}
                style={{
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.94rem',
                  fontWeight: 700
                }}
              >
                <BookOpen size={16} style={{ color: '#0F172A' }} />
                <span>Explore Somali Archive</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          6. LITERARY INVITATION & QUOTE BANNER
         ====================================================================== */}
      <section className="ebaro-literary-quote-banner" aria-label="Literary Inspiration Banner">
        <div className="literary-quote-card">
          <span className="literary-quote-mark" aria-hidden="true">&ldquo;</span>
          <blockquote className="literary-quote-text">
            A great book should leave you with many experiences, and slightly exhausted at the end. You live several lives while reading.
          </blockquote>
          <cite className="literary-quote-author">— William Styron, Author &amp; Essayist</cite>

          <div className="literary-quote-cta-row">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => onNavigate('explore')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                padding: '0.9rem 2.2rem',
                fontSize: '0.96rem',
                fontWeight: 700,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
              }}
            >
              <span>Explore All Books</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onNavigate('free-books')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                padding: '0.9rem 1.85rem',
                fontSize: '0.96rem',
                fontWeight: 700
              }}
            >
              <BookOpen size={18} style={{ color: '#FFFFFF' }} />
              <span>Browse 100% Free Open Editions</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

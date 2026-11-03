import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  CheckCircle2,
  Calendar,
  Clock,
  Star,
  Users,
  Feather,
  BookMarked,
  ArrowRight,
  Filter,
  X,
  Award,
  ShieldCheck
} from 'lucide-react';
import { BOOKS, AUTHORS } from '../data/books';
import { Book, Author } from '../types';

interface SomaliBooksPageProps {
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string, chapterIndex?: number, mode?: 'web' | 'pdf' | 'text') => void;
  bookmarkedIds: string[];
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
  onSelectAuthor?: (authorId: string) => void;
}

type SomaliFilterCategory = 'all' | 'novels' | 'poetry' | 'history' | 'islamic';

// The 7 premier curated masterpieces of Somali literature (100% verified real books)
const PREMIER_SOMALI_BOOK_IDS = [
  'aqoondarro-waa-u-nacab-jacayl',
  'maanafaay',
  'hal-karaan',
  'taariikhda-ummadda-soomaaliyeed',
  'sheekooyin-soomaali-ah',
  'safinat-an-najah-soomaali',
  '1000-sunnah-per-day-islamic'
];

export const SomaliBooksPage: React.FC<SomaliBooksPageProps> = ({
  onSelectBook,
  onReadBook,
  bookmarkedIds,
  onToggleBookmark,
  onSelectAuthor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SomaliFilterCategory>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'year' | 'title'>('featured');

  // Filter to exactly the 7 premier curated Somali masterworks
  const somaliBooks = useMemo(() => {
    return PREMIER_SOMALI_BOOK_IDS.map((id) => BOOKS.find((b) => b.id === id)).filter(
      (b): b is Book => Boolean(b)
    );
  }, []);

  // Filter to the 7 authentic Somali authors of these works
  const premierAuthorIds = [
    'faarax-mj-cawl',
    'maxamed-ibraahim-hadraawi',
    'maxamed-daahir-afrax',
    'aw-jaamac-cumar-ciise',
    'muuse-xaaji-ismaaciil-galaal',
    'shiikh-saalim-al-xadrami',
    'khaalid-al-xuseynaan'
  ];

  const somaliAuthors = useMemo(() => {
    return premierAuthorIds
      .map((id) => AUTHORS.find((a) => a.id === id))
      .filter((a): a is Author => Boolean(a));
  }, []);

  // Spotlight book: Aqoondarro Waa u Nacab Jacayl (the 1st serialized Somali novel)
  const spotlightBook = useMemo(() => {
    return somaliBooks.find((b) => b.id === 'aqoondarro-waa-u-nacab-jacayl') || somaliBooks[0];
  }, [somaliBooks]);

  // Apply category, search, and sorting filters
  const filteredBooks = useMemo(() => {
    return somaliBooks
      .filter((book) => {
        // Category Filter
        if (activeCategory === 'novels') {
          const isNovel =
            book.id === 'aqoondarro-waa-u-nacab-jacayl' ||
            book.id === 'maanafaay' ||
            book.id === 'sheekooyin-soomaali-ah' ||
            book.categorySlug === 'somali-fiction';
          if (!isNovel) return false;
        }

        if (activeCategory === 'poetry') {
          const isPoetry =
            book.id === 'hal-karaan' ||
            book.categorySlug === 'poetry-gabay';
          if (!isPoetry) return false;
        }

        if (activeCategory === 'history') {
          const isHistory =
            book.id === 'taariikhda-ummadda-soomaaliyeed' ||
            book.categorySlug === 'history-culture';
          if (!isHistory) return false;
        }

        if (activeCategory === 'islamic') {
          const isIslamic =
            book.id === 'safinat-an-najah-soomaali' ||
            book.id === '1000-sunnah-per-day-islamic' ||
            book.categorySlug === 'islamic-studies';
          if (!isIslamic) return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = book.title.toLowerCase().includes(q);
          const matchesAuthor = book.author.toLowerCase().includes(q);
          const matchesSynopsis = book.shortSynopsis?.toLowerCase().includes(q);
          const matchesGenre = book.genre?.toLowerCase().includes(q);
          const matchesCategory = book.category?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesAuthor && !matchesSynopsis && !matchesGenre && !matchesCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
        }
        if (sortBy === 'year') {
          return b.publishedYear - a.publishedYear;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0; // 'featured' order
      });
  }, [somaliBooks, activeCategory, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: somaliBooks.length,
      novels: somaliBooks.filter(
        (b) =>
          b.id === 'aqoondarro-waa-u-nacab-jacayl' ||
          b.id === 'maanafaay' ||
          b.id === 'sheekooyin-soomaali-ah'
      ).length,
      poetry: somaliBooks.filter((b) => b.id === 'hal-karaan').length,
      history: somaliBooks.filter((b) => b.id === 'taariikhda-ummadda-soomaaliyeed').length,
      islamic: somaliBooks.filter(
        (b) => b.id === 'safinat-an-najah-soomaali' || b.id === '1000-sunnah-per-day-islamic'
      ).length
    };
  }, [somaliBooks]);

  return (
    <div
      className="luxury-storefront-canvas somali-books-page"
      style={{
        backgroundColor: '#F8F6EF',
        minHeight: '100vh',
        color: '#202820',
        paddingBottom: '5rem'
      }}
    >
      {/* ======================================================================
          1. HERO HEADER: SIGNATURE BRAND PALETTE (#173D2D / #173D2D INDIGO)
         ====================================================================== */}
      <section
        className="somali-header-banner"
        style={{
          background: '#F8F6EF',
          borderBottom: '1px solid #E3E6DF',
          padding: '3.5rem 1.5rem 2.5rem'
        }}
        aria-label="Somali Digital Heritage Archive Header"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Eyebrow Pill in Brand Signature Indigo */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#DCE6DC',
              color: '#173D2D',
              border: '1px solid #CBD5CB',
              padding: '0.35rem 0.85rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            <BookMarked size={14} style={{ color: '#173D2D' }} />
            <span>QAYBTA SOOMAALIGA • CURATED SOMALI HERITAGE</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#202820',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)'
            }}
          >
            Maktabadda Buugaagta Af-Soomaaliga
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#475569',
              maxWidth: '820px',
              lineHeight: 1.6,
              marginBottom: '1.75rem'
            }}
          >
            Xul qaran oo ka kooban 7-da buug ee ugu caansan uguna qiimaha badan suugaanta, taariikhda,
            maansada, iyo hiddaha Soomaaliyeed. Buugaagtani waa kuwo dhab ah oo daabacan, oo loogu talagalay
            in si sahlan loogu akhriyo aalad kasta.
          </p>

          {/* Quick Metrics Bar in Signature Indigo */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1px solid #E3E6DF',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#1E293B',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <CheckCircle2 size={16} style={{ color: '#173D2D' }} />
              <span>7 Buug oo Haldoor ah (Curated Classics)</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1px solid #E3E6DF',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#1E293B',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <Users size={16} style={{ color: '#173D2D' }} />
              <span>{somaliAuthors.length} Qoraa oo Haldoor ah</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1px solid #E3E6DF',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#1E293B',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <BookOpen size={16} style={{ color: '#173D2D' }} />
              <span>100% Xor ah &amp; Web Reader</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1px solid #E3E6DF',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#1E293B',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <ShieldCheck size={16} style={{ color: '#173D2D' }} />
              <span>Diiwaanka Qaranka &amp; Dhaqanka</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
        {/* ======================================================================
            2. FEATURED SPOTLIGHT CARD: BOOK OF SOMALI HERITAGE
           ====================================================================== */}
        {spotlightBook && !searchQuery && activeCategory === 'all' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E3E6DF',
              borderRadius: '10px',
              padding: '2.25rem',
              boxShadow: '0 4px 16px rgba(32, 40, 32, 0.04)',
              marginBottom: '3rem'
            }}
            className="somali-spotlight-card"
          >
            {/* Left Cover Presentation */}
            <div
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 10px 24px -4px rgba(23, 61, 45, 0.22)',
                aspectRatio: '2/3',
                backgroundColor: '#F8F6EF'
              }}
              onClick={() => onSelectBook(spotlightBook.id)}
            >
              <img
                src={spotlightBook.coverUrl}
                alt={spotlightBook.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#173D2D',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                XULKA QARANKA
              </span>
            </div>

            {/* Right Information & CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: '#DCE6DC',
                    color: '#173D2D',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5CB',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Award size={13} style={{ color: '#173D2D' }} />
                  <span>BUUGGA HALDOORKA AH EE AF-SOOMAALIGA</span>
                </span>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  • {spotlightBook.publishedYear}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#202820',
                  letterSpacing: '-0.025em',
                  marginBottom: '0.35rem',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectBook(spotlightBook.id)}
              >
                {spotlightBook.title}
              </h2>

              <p style={{ fontSize: '1rem', color: '#475569', fontWeight: 600, marginBottom: '0.75rem' }}>
                Qoraaga:{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (spotlightBook.authorId && onSelectAuthor) {
                      onSelectAuthor(spotlightBook.authorId);
                    } else {
                      setSearchQuery(spotlightBook.author);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#173D2D',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {spotlightBook.author}
                </button>
              </p>

              {/* Rating & Pages Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B' }}>
                  <Star size={16} fill="#F59E0B" />
                  <span style={{ fontWeight: 700, color: '#202820', fontSize: '0.9rem' }}>
                    {(spotlightBook.rating?.score ?? 4.9).toFixed(1)}
                  </span>
                </div>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {spotlightBook.pages} bog oo daabacan
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: '0.85rem', color: '#173D2D', fontWeight: 600 }}>
                  {spotlightBook.genre}
                </span>
              </div>

              {/* Synopsis */}
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: '#334155',
                  marginBottom: '1.5rem',
                  maxWidth: '720px'
                }}
              >
                {spotlightBook.shortSynopsis}
              </p>

              {/* Action Buttons with Brand Signature Color */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => onReadBook(spotlightBook.id, 0)}
                  style={{
                    backgroundColor: '#173D2D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(23, 61, 45, 0.28)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#112F23')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173D2D')}
                >
                  <BookOpen size={16} />
                  <span>Bilow Akhriska Hadda</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectBook(spotlightBook.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#202820',
                    border: '1px solid #E3E6DF',
                    borderRadius: '4px',
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8F6EF';
                    e.currentTarget.style.borderColor = '#CBD5CB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E3E6DF';
                  }}
                >
                  <span>Faahfaahin Buugga</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={(e) => onToggleBookmark(spotlightBook.id, e)}
                  title={bookmarkedIds.includes(spotlightBook.id) ? 'Ka saar buug-calaamadda' : 'Ku dar buug-calaamadda'}
                  style={{
                    background: bookmarkedIds.includes(spotlightBook.id) ? '#DCE6DC' : '#FFFFFF',
                    border: '1px solid #E3E6DF',
                    borderRadius: '4px',
                    padding: '0.72rem',
                    cursor: 'pointer',
                    color: bookmarkedIds.includes(spotlightBook.id) ? '#173D2D' : '#747D74',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bookmark
                    size={18}
                    fill={bookmarkedIds.includes(spotlightBook.id) ? '#173D2D' : 'none'}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            3. SEARCH & CATEGORY FILTER TOOLBAR
           ====================================================================== */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E3E6DF',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
          }}
        >
          {/* Top Controls: Search Bar & Sort Dropdown */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '260px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }}
              />
              <input
                type="text"
                placeholder="Raadi buug ama qoraa (e.g. Cawl, Hadraawi, Maanafaay, Galaal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.6rem',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#F8F6EF',
                  color: '#202820',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#173D2D';
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(23, 61, 45, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.backgroundColor = '#F8FAFC';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Tir raadinta"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <label htmlFor="somali-sort" style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Kala Saacid:
              </label>
              <select
                id="somali-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#202820',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="featured">Xulka Tifaftiraha (Featured)</option>
                <option value="rating">Qiimeynta Ugu Sarreysa (Highest Rated)</option>
                <option value="year">Sannadka La Daabacay (Year)</option>
                <option value="title">Magaca Buugga (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Genre Category Pills in Signature Indigo */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#64748B',
                marginRight: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              <Filter size={13} /> Qeybaha:
            </span>

            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === 'all' ? 700 : 500,
                border: activeCategory === 'all' ? '1px solid #173D2D' : '1px solid #E3E6DF',
                backgroundColor: activeCategory === 'all' ? '#173D2D' : '#FFFFFF',
                color: activeCategory === 'all' ? '#FFFFFF' : '#202820',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Dhammaan ({categoryCounts.all})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('novels')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === 'novels' ? 700 : 500,
                border: activeCategory === 'novels' ? '1px solid #173D2D' : '1px solid #E3E6DF',
                backgroundColor: activeCategory === 'novels' ? '#173D2D' : '#FFFFFF',
                color: activeCategory === 'novels' ? '#FFFFFF' : '#202820',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sheekooyin &amp; Riwaayado ({categoryCounts.novels})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('poetry')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === 'poetry' ? 700 : 500,
                border: activeCategory === 'poetry' ? '1px solid #173D2D' : '1px solid #E3E6DF',
                backgroundColor: activeCategory === 'poetry' ? '#173D2D' : '#FFFFFF',
                color: activeCategory === 'poetry' ? '#FFFFFF' : '#202820',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Maanso &amp; Gabayo ({categoryCounts.poetry})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('history')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === 'history' ? 700 : 500,
                border: activeCategory === 'history' ? '1px solid #173D2D' : '1px solid #E3E6DF',
                backgroundColor: activeCategory === 'history' ? '#173D2D' : '#FFFFFF',
                color: activeCategory === 'history' ? '#FFFFFF' : '#202820',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Taariikh &amp; Dhaqan ({categoryCounts.history})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('islamic')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === 'islamic' ? 700 : 500,
                border: activeCategory === 'islamic' ? '1px solid #173D2D' : '1px solid #E3E6DF',
                backgroundColor: activeCategory === 'islamic' ? '#173D2D' : '#FFFFFF',
                color: activeCategory === 'islamic' ? '#FFFFFF' : '#202820',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Cilmiga Diinta ({categoryCounts.islamic})
            </button>
          </div>
        </div>

        {/* Search Results Summary */}
        {(searchQuery || activeCategory !== 'all') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '0 0.25rem'
            }}
          >
            <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0 }}>
              Waxaa la helay <strong style={{ color: '#202820' }}>{filteredBooks.length}</strong> buug
              {searchQuery && (
                <span>
                  {' '}
                  oo u dhigma &quot;<em style={{ color: '#173D2D' }}>{searchQuery}</em>&quot;
                </span>
              )}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#173D2D',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Tir dhammaan miirayaasha
            </button>
          </div>
        )}

        {/* ======================================================================
            4. BOOKS GRID: PRECISELY 7 CURATED MASTERWORKS
           ====================================================================== */}
        {filteredBooks.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px dashed #CBD5E1',
              maxWidth: '600px',
              margin: '2rem auto'
            }}
          >
            <BookMarked size={42} style={{ color: '#94A3B8', margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#202820', marginBottom: '0.5rem' }}>
              Wax buug ah lama helin
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Ma jiraan buugaag u dhigma raadintaada &quot;{searchQuery}&quot;. Fadlan dib u celi miirayaasha.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              style={{
                backgroundColor: '#173D2D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Dib u celi miirayaasha (Reset Filters)
            </button>
          </div>
        ) : (
          <div
            className="somali-catalog-grid"
            style={{
              display: 'grid',
              gap: '1.75rem'
            }}
          >
            {filteredBooks.map((book) => {
              const isBookmarked = bookmarkedIds.includes(book.id);

              return (
                <div
                  key={book.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E3E6DF',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 1px 3px rgba(32, 40, 32, 0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                  className="somali-book-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(23, 61, 45, 0.1)';
                    e.currentTarget.style.borderColor = '#CBD5CB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(32, 40, 32, 0.04)';
                    e.currentTarget.style.borderColor = '#E3E6DF';
                  }}
                >
                  {/* Cover Header Container */}
                  <div
                    className="somali-card-header"
                    style={{
                      position: 'relative',
                      backgroundColor: '#F8F6EF',
                      padding: '1.25rem 1.25rem 0.75rem',
                      display: 'flex',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectBook(book.id)}
                  >
                    {/* Floating Genre Pill in Signature Color */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#DCE6DC',
                        color: '#173D2D',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5CB',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        zIndex: 2
                      }}
                    >
                      {book.categorySlug === 'islamic-studies'
                        ? 'Diin'
                        : book.categorySlug === 'poetry-gabay'
                        ? 'Maanso'
                        : book.categorySlug === 'history-culture'
                        ? 'Taariikh'
                        : 'Af-Soomaali'}
                    </span>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(book.id, e);
                      }}
                      title={isBookmarked ? 'Ka saar buug-calaamadda' : 'Ku dar buug-calaamadda'}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E3E6DF',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isBookmarked ? '#173D2D' : '#94A3B8',
                        cursor: 'pointer',
                        zIndex: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                      }}
                    >
                      <Bookmark size={15} fill={isBookmarked ? '#173D2D' : 'none'} />
                    </button>

                    {/* Book Cover Image */}
                    <div
                      className="somali-cover-box"
                      style={{
                        width: '135px',
                        height: '190px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 16px -2px rgba(23, 61, 45, 0.18)',
                        backgroundColor: '#FFFFFF',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div
                    className="somali-card-body"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}
                  >
                    {/* Meta Info */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: '#64748B',
                        marginBottom: '0.4rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} /> {book.publishedYear}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {book.pages} bog
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#D97706', fontWeight: 700 }}>
                        <Star size={13} fill="#D97706" /> {(book.rating?.score ?? 4.9).toFixed(1)}
                      </span>
                    </div>

                    {/* Book Title */}
                    <h3
                      className="somali-card-title"
                      style={{
                        fontFamily: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: '#202820',
                        lineHeight: 1.35,
                        marginBottom: '0.25rem',
                        cursor: 'pointer',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      onClick={() => onSelectBook(book.id)}
                      title={book.title}
                    >
                      {book.title}
                    </h3>

                    {/* Author Name */}
                    <p
                      className="somali-card-author"
                      style={{
                        fontSize: '0.86rem',
                        color: '#747D74',
                        fontWeight: 500,
                        marginBottom: '0.65rem'
                      }}
                    >
                      {book.author}
                    </p>

                    {/* Short Synopsis */}
                    <p
                      className="somali-card-synopsis"
                      style={{
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: '#747D74',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '1.25rem',
                        flex: 1
                      }}
                    >
                      {book.shortSynopsis}
                    </p>

                    {/* Action Buttons Row */}
                    <div
                      className="somali-card-actions"
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #E3E6DF',
                        marginTop: 'auto'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onReadBook(book.id, 0)}
                        style={{
                          flex: 1,
                          backgroundColor: '#173D2D',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 2px 6px rgba(23, 61, 45, 0.25)',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#112F23')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173D2D')}
                      >
                        <BookOpen size={14} />
                        <span>Akhri Hadda</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectBook(book.id)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#202820',
                          border: '1px solid #E3E6DF',
                          borderRadius: '4px',
                          padding: '0.55rem 0.85rem',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8F6EF';
                          e.currentTarget.style.borderColor = '#CBD5CB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#E3E6DF';
                        }}
                      >
                        <span>Faahfaahin</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================================
            5. CULTURAL WISDOM & QUOTE SECTION (BRAND LAVENDER & INDIGO)
           ====================================================================== */}
        <section
          style={{
            marginTop: '4rem',
            backgroundColor: '#F8F6EF',
            border: '1px solid #CBD5CB',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(23, 61, 45, 0.04)'
          }}
          aria-label="Somali Literary Wisdom"
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#173D2D',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}
          >
            <Feather size={15} />
            <span>MURTI IYO GARAAD • SOMALI LITERARY WISDOM</span>
          </div>

          <blockquote
            style={{
              fontSize: '1.25rem',
              fontStyle: 'italic',
              color: '#1E293B',
              lineHeight: 1.6,
              maxWidth: '820px',
              margin: '0 auto 1rem',
              fontFamily: 'var(--font-serif, "Cinzel", "Playfair Display", Georgia, serif)'
            }}
          >
            &quot;Afku wuxuu la nool yahay bulshada ku hadasha; haddii bulshadu daryeesho qoraalkeeda iyo
            suugaanteeda, afkuna wuxuu dhisaa garaadkeeda, sharafteeda iyo mustaqbalkeeda dhabta ah.&quot;
          </blockquote>

          <cite style={{ fontSize: '0.92rem', color: '#173D2D', fontWeight: 700, fontStyle: 'normal' }}>
            — Maxamed Ibraahim Warsame &quot;Hadraawi&quot; (Hal-Karaan)
          </cite>
        </section>

        {/* ======================================================================
            6. FEATURED SOMALI AUTHORS (THE CUSTODIANS OF THESE 7 WORKS)
           ====================================================================== */}
        <section style={{ marginTop: '4rem' }} aria-label="Somali Authors and Literary Custodians">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '1.75rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#173D2D',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                HORBODAYAASHII QALINKA
              </span>
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#202820',
                  letterSpacing: '-0.025em',
                  marginTop: '0.25rem'
                }}
              >
                Qorayaasha &amp; Hal-abuurka Buugaagtan
              </h2>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {somaliAuthors.map((author) => (
              <div
                key={author.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E3E6DF',
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px -2px rgba(23, 61, 45, 0.12)';
                  e.currentTarget.style.borderColor = '#CBD5CB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <img
                  src={author.portraitUrl}
                  alt={author.portraitAlt}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem',
                    border: '3px solid #DCE6DC',
                    boxShadow: '0 4px 10px rgba(23, 61, 45, 0.18)'
                  }}
                />

                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#202820',
                    marginBottom: '0.2rem'
                  }}
                >
                  {author.name}
                </h3>

                <span
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748B',
                    fontWeight: 500,
                    marginBottom: '0.65rem'
                  }}
                >
                  {author.lifespan}
                </span>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#475569',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {author.shortBio}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectAuthor) {
                      onSelectAuthor(author.id);
                    } else {
                      setSearchQuery(author.name.split(' ')[0]);
                    }
                  }}
                  style={{
                    width: '100%',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    padding: '0.55rem 0.85rem',
                    backgroundColor: '#F8F6EF',
                    color: '#202820',
                    border: '1px solid #E3E6DF',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DCE6DC';
                    e.currentTarget.style.color = '#173D2D';
                    e.currentTarget.style.borderColor = '#CBD5CB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <span>Eeg Buugaagtiisa</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

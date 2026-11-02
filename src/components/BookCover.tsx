import React, { useState } from 'react';
import { Book } from '../types';

interface BookCoverProps {
  book: Pick<Book, 'id' | 'title' | 'subtitle' | 'author' | 'coverUrl' | 'coverAlt' | 'category' | 'publishedYear' | 'isbn'>;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  priority?: boolean;
  className?: string;
}

interface JacketConfig {
  kicker: string;
  kickerColor?: string;
  subtitle?: string;
  author?: string;
  imprint: string;
  bg: string;
}

const CURATED_JACKETS: Record<string, JacketConfig> = {};

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  priority = false,
  className = ''
}) => {
  const [stage, setStage] = useState<'primary' | 'isbn' | 'fallback'>('primary');

  const curatedJacket = CURATED_JACKETS[book.id];

  const isbnUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : '';

  const currentSrc =
    stage === 'primary'
      ? book.coverUrl
      : stage === 'isbn' && isbnUrl && isbnUrl !== book.coverUrl
      ? isbnUrl
      : '';

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth <= 10 || img.naturalHeight <= 10) {
      if (stage === 'primary' && isbnUrl && isbnUrl !== book.coverUrl) {
        setStage('isbn');
      } else {
        setStage('fallback');
      }
    }
  };

  const handleError = () => {
    if (stage === 'primary' && isbnUrl && isbnUrl !== book.coverUrl) {
      setStage('isbn');
    } else {
      setStage('fallback');
    }
  };

  const getCategoryThemeClass = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('thriller') || c.includes('mystery')) return 'theme-noir';
    if (c.includes('science') || c.includes('tech')) return 'theme-emerald';
    if (c.includes('philosophy') || c.includes('ethics')) return 'theme-charcoal';
    if (c.includes('travel') || c.includes('essay')) return 'theme-navy';
    if (c.includes('history') || c.includes('culture') || c.includes('biography')) return 'theme-bronze';
    return 'theme-slate';
  };

  // 1. If it's one of the signature Curated Editions from screenshot, render authentic typographic jacket
  if (curatedJacket) {
    return (
      <div
        className={`book-cover-frame book-cover-${size} ${className}`}
        style={{
          background: curatedJacket.bg,
          color: '#FFFFFF'
        }}
        role="img"
        aria-label={`${book.title} by ${curatedJacket.author || book.author}`}
      >
        <div className="book-spine-crease" aria-hidden="true" />
        <div className="book-curated-jacket-inner">
          <div
            className="curated-jacket-kicker"
            style={{ color: curatedJacket.kickerColor || '#E2E8F0' }}
          >
            {curatedJacket.kicker}
          </div>

          <div className="curated-jacket-center">
            <h4 className="curated-jacket-title">{book.title}</h4>
            {curatedJacket.subtitle && (
              <p className="curated-jacket-subtitle">{curatedJacket.subtitle}</p>
            )}
            <p className="curated-jacket-author">{curatedJacket.author || book.author}</p>
          </div>

          <div className="curated-jacket-footer">
            <span>{curatedJacket.imprint}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Regular books with genuine covers (e.g., Somali books or verified images)
  return (
    <div className={`book-cover-frame book-cover-${size} ${className}`}>
      <div className="book-spine-crease" aria-hidden="true" />
      {stage !== 'fallback' && currentSrc ? (
        <img
          src={currentSrc}
          alt={book.coverAlt || `Cover of ${book.title} by ${book.author}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className="book-cover-image"
        />
      ) : (
        <div
          className={`book-cover-fallback ${getCategoryThemeClass(book.category)}`}
          role="img"
          aria-label={book.coverAlt || `Archival edition cover for ${book.title} by ${book.author}`}
        >
          <div className="book-cover-fallback-inner">
            <span className="book-cover-fallback-series">{book.category}</span>
            <div className="book-cover-fallback-rule" />
            <h4 className="book-cover-fallback-title">{book.title}</h4>
            {book.subtitle && size !== 'sm' && (
              <p className="book-cover-fallback-subtitle">{book.subtitle}</p>
            )}
            <div className="book-cover-fallback-footer">
              <span className="book-cover-fallback-author">{book.author}</span>
              <span className="book-cover-fallback-imprint">Understory Editions</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

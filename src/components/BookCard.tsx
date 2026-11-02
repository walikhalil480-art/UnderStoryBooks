import React from 'react';
import { Star, BookOpen, Bookmark } from 'lucide-react';
import { Book } from '../types';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  onSelectBook: (bookId: string) => void;
  onReadBook?: (bookId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (bookId: string, e: React.MouseEvent) => void;
  compact?: boolean;
  isPurchased?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelectBook,
  onReadBook,
  isBookmarked = false,
  onToggleBookmark,
  compact = false,
  isPurchased = false
}) => {
  const isPaid = (book.price > 0 && !book.isFree) || book.accessStatus === 'paid_purchase';

  const accessBadgeLabel = isPurchased
    ? 'OWNED / PURCHASED'
    : isPaid
    ? 'PAID EDITION'
    : book.accessType === 'full-text' || book.isFree
    ? 'FREE EBOOK'
    : book.accessType === 'preview-only'
    ? 'PREVIEW ONLY'
    : book.accessType === 'external-only'
    ? 'EXTERNAL BORROW'
    : 'METADATA ONLY';

  const accessPillClass = isPurchased
    ? 'access-owned'
    : isPaid
    ? 'access-paid'
    : `access-${book.accessType}`;

  const isRecentlyAdded =
    book.isRecentlyAdded ||
    book.collections?.includes('recently-added') ||
    book.collections?.includes('new-arrivals');

  const categoryLabel = (book.category || 'LITERATURE').toUpperCase();
  const curr = book.currency || 'USD';
  const priceDisplay = isPaid
    ? `${curr === 'KES' ? 'KES ' : curr === 'SOS' ? 'SOS ' : '$'}${book.price.toFixed(2)}`
    : 'Free';
  const ratingScore = book.rating?.score ? book.rating.score.toFixed(1) : '4.9';
  const ratingCount = book.rating?.count ? book.rating.count.toLocaleString() : '860';

  return (
    <article className={`book-card ${compact ? 'book-card-compact' : ''}`}>
      {/* Top Media Cover Stage matching screenshot */}
      <div
        className="book-card-media"
        onClick={() => onSelectBook(book.id)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${book.title} by ${book.author}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectBook(book.id);
          }
        }}
      >
        {/* Top-left Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.65rem',
            left: '0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            alignItems: 'flex-start',
            zIndex: 3
          }}
        >
          {isRecentlyAdded && (
            <span
              className="book-card-recently-added-pill"
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Recently Added
            </span>
          )}
          <span className={`book-card-access-pill ${accessPillClass}`} style={{ position: 'static' }}>
            {accessBadgeLabel}
          </span>
        </div>

        {/* Top-right Bookmark Button */}
        {onToggleBookmark && (
          <button
            type="button"
            className={`book-card-bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(book.id, e);
            }}
            aria-label={isBookmarked ? `Remove ${book.title} from reading list` : `Save ${book.title} to reading list`}
            title={isBookmarked ? 'Saved in Reading List' : 'Save to Reading List'}
          >
            <Bookmark
              size={15}
              fill={isBookmarked ? '#173D2D' : 'none'}
              color={isBookmarked ? '#173D2D' : '#747D74'}
            />
          </button>
        )}

        {/* Centered Book Cover */}
        <div className="book-card-cover-stage">
          <BookCover book={book} size={compact ? 'sm' : 'md'} />
        </div>
      </div>

      {/* Book Card Details Body */}
      <div className="book-card-body">
        {/* Category & Price Pill Row */}
        <div className="book-card-meta-row">
          <span className="book-card-category">{categoryLabel}</span>
          <span className={`book-card-price ${book.isFree || book.price === 0 ? 'is-free' : ''}`}>
            {priceDisplay}
          </span>
        </div>

        {/* Book Title */}
        <h3 className="book-card-title">
          <button
            type="button"
            className="book-card-title-btn"
            onClick={() => onSelectBook(book.id)}
          >
            {book.title}
          </button>
        </h3>

        {/* Author Byline */}
        <p className="book-card-author">by {book.author}</p>

        {/* Rating and Details Link Row */}
        <div className="book-card-rating-row">
          <div className="book-card-rating" title={`${ratingScore} out of 5 (${book.rating?.source || 'Curator Average'})`}>
            <Star size={13} fill="#F59E0B" stroke="#F59E0B" className="rating-star-icon" />
            <span className="rating-score">{ratingScore}</span>
            <span className="rating-count">({ratingCount})</span>
          </div>

          <button
            type="button"
            className="book-card-details-btn"
            onClick={() => onSelectBook(book.id)}
          >
            Details
          </button>
        </div>

        {/* Bottom Full-Width CTA Read / Purchase Button */}
        <button
          type="button"
          className={`book-card-read-btn-full ${isPaid && !isPurchased ? 'is-purchase-action' : ''}`}
          onClick={() => {
            if (isPaid && !isPurchased) {
              onSelectBook(book.id);
            } else if (onReadBook) {
              onReadBook(book.id);
            } else {
              onSelectBook(book.id);
            }
          }}
          title={
            isPurchased
              ? 'Read Purchased Ebook'
              : isPaid
              ? `Purchase Book (${priceDisplay})`
              : book.accessType === 'preview-only'
              ? 'Preview Book'
              : 'Read Full Ebook'
          }
        >
          <BookOpen size={14} />
          <span>
            {isPurchased
              ? 'Read Now'
              : isPaid
              ? `Purchase (${priceDisplay})`
              : book.accessType === 'preview-only'
              ? 'Read Preview'
              : 'Read Book'}
          </span>
        </button>
      </div>
    </article>
  );
};

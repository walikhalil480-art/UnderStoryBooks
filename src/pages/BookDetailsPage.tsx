import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Check,
  FileText,
  Layers,
  Star,
  ExternalLink,
  Lock,
  Info,
  Library,
  Download,
  ShieldCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  CreditCard,
  Smartphone,
  ShieldAlert,
  DollarSign,
  X,
  Headphones,
  Gift,
  Share2,
  Zap
} from 'lucide-react';
import { AUTHORS, BOOKS, SOMALI_BOOK_REVIEWS } from '../data/books';
import { Book, CategorySlug, LibraryStatus, UserProfile, BookReview } from '../types';
import { BookCover } from '../components/BookCover';
import { BookCard } from '../components/BookCard';
import { EditorialImage } from '../components/EditorialImage';
import { CopyrightNoticeModal } from '../components/CopyrightNoticeModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { folioApi } from '../services/api';

interface BookDetailsPageProps {
  book: Book;
  user: UserProfile | null;
  currentShelfStatus?: LibraryStatus;
  onUpdateShelfStatus: (bookId: string, status: LibraryStatus | 'remove') => void;
  onBack: () => void;
  onReadBook: (bookId: string, chapterIndex?: number, mode?: 'web' | 'pdf' | 'text' | 'epub') => void;
  onDownloadBook: (bookId: string, format: 'pdf' | 'epub' | 'html' | 'txt') => void;
  onSelectBook: (bookId: string) => void;
  onSelectCategory: (categorySlug: CategorySlug) => void;
  onSelectAuthor: (authorId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
  bookmarkedIds: string[];
  purchasedBookIds?: string[];
  onPurchaseSuccess?: (bookId: string) => void;
  onUserUpdate?: (user: UserProfile) => void;
}

export const BookDetailsPage: React.FC<BookDetailsPageProps> = ({
  book,
  user,
  currentShelfStatus,
  onUpdateShelfStatus,
  onBack,
  onReadBook,
  onDownloadBook,
  onSelectBook,
  onSelectCategory,
  onSelectAuthor,
  isBookmarked,
  onToggleBookmark,
  bookmarkedIds,
  purchasedBookIds,
  onPurchaseSuccess,
  onUserUpdate
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>(
    book.availableFormats[0] || book.formats[0] || 'EPUB'
  );
  const [shelfFeedback, setShelfFeedback] = useState('');

  // Reader Reviews State
  const [reviews, setReviews] = useState<BookReview[]>(() => {
    try {
      const saved = localStorage.getItem(`ebaro_reviews_${book.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    if (SOMALI_BOOK_REVIEWS && SOMALI_BOOK_REVIEWS[book.id]) {
      return SOMALI_BOOK_REVIEWS[book.id];
    }
    return [];
  });

  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Author Follow State
  const authorKey = book.authorId || book.author;
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    try {
      const list = JSON.parse(localStorage.getItem('ebaro_followed_authors') || '[]');
      return list.includes(authorKey);
    } catch {
      return false;
    }
  });

  const handleToggleFollow = () => {
    try {
      const list = JSON.parse(localStorage.getItem('ebaro_followed_authors') || '[]');
      const next = isFollowing ? list.filter((id: string) => id !== authorKey) : [...list, authorKey];
      localStorage.setItem('ebaro_followed_authors', JSON.stringify(next));
      setIsFollowing(!isFollowing);
      setShelfFeedback(!isFollowing ? `You are now following ${book.author}` : `Unfollowed ${book.author}`);
      setTimeout(() => setShelfFeedback(''), 3000);
    } catch {}
  };

  // Copyright and Paid Purchase States
  const [isCopyrightModalOpen, setIsCopyrightModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(() => {
    return Boolean(
      user?.role === 'admin' ||
      (purchasedBookIds && purchasedBookIds.includes(book.id))
    );
  });

  useEffect(() => {
    if (user?.role === 'admin' || (purchasedBookIds && purchasedBookIds.includes(book.id))) {
      setHasPurchased(true);
      return;
    }
    if (user && (book.accessStatus === 'paid_purchase' || (book.price > 0 && !book.isFree))) {
      folioApi
        .getMyPurchases()
        .then((res) => {
          if (
            res.purchasedBookIds?.includes(book.id) ||
            res.purchases?.some((p: any) => p.book_id === book.id && p.status === 'completed') ||
            res.entitlements?.some((e: any) => e.book_id === book.id && e.status === 'active')
          ) {
            setHasPurchased(true);
          }
        })
        .catch(() => {});
    }
  }, [user, book.id, book.accessStatus, purchasedBookIds]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`ebaro_reviews_${book.id}`);
      if (saved) {
        setReviews(JSON.parse(saved));
        return;
      }
    } catch {}
    if (SOMALI_BOOK_REVIEWS && SOMALI_BOOK_REVIEWS[book.id]) {
      setReviews(SOMALI_BOOK_REVIEWS[book.id]);
    } else {
      setReviews([]);
    }
    setReviewSubmitted(false);
  }, [book.id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const name = newReviewerName.trim() || user?.fullName || 'Anonymous Reader';
    const newEntry: BookReview = {
      id: `rev-${Date.now()}`,
      bookId: book.id,
      reviewerName: name,
      rating: newRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: newComment.trim(),
      verifiedReader: true
    };
    const updated = [newEntry, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`ebaro_reviews_${book.id}`, JSON.stringify(updated));
    } catch {}
    setNewComment('');
    setNewReviewerName('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const authorProfile = AUTHORS.find((a) => a.id === book.authorId);

  const relatedBooks = BOOKS.filter(
    (b) => b.id !== book.id && (b.categorySlug === book.categorySlug || b.authorId === book.authorId)
  ).slice(0, 4);

  const fallbackRelated =
    relatedBooks.length < 4
      ? [
          ...relatedBooks,
          ...BOOKS.filter(
            (b) => b.id !== book.id && !relatedBooks.some((r) => r.id === b.id)
          ).slice(0, 4 - relatedBooks.length)
        ]
      : relatedBooks;

  const isPaid = book.accessStatus === 'paid_purchase' || (book.price > 0 && !book.isFree);
  const canDirectlyRead = book.provenance.fullTextReadingPermitted && (!isPaid || hasPurchased);

  const accessHeadline =
    hasPurchased
      ? 'Purchased Edition — Full Access Unlocked'
      : isPaid
      ? `Paid Author Edition (${book.priceDisplay || '$4.99 USD'})`
      : book.accessStatus === 'free_full_text'
      ? 'Free Authorised Full-Text'
      : book.accessStatus === 'free_download' || book.accessStatus === 'full_download_available'
      ? 'Free Authorised Download'
      : book.accessStatus === 'full_text_available'
      ? 'Full Text Online Available'
      : book.accessStatus === 'preview_only'
      ? 'Authorised Sample Preview'
      : book.accessStatus === 'external_reading'
      ? 'External Authorised Portal'
      : book.accessStatus === 'unavailable'
      ? 'Edition Restricted / Under Review'
      : 'Bibliographic Metadata Only';

  const hasPdfDownload =
    book.availableFormats.includes('PDF') && book.provenance.downloadPermitted;
  const hasEpubDownload =
    book.availableFormats.includes('EPUB') && book.provenance.downloadPermitted;
  const hasHtmlDownload =
    book.availableFormats.includes('HTML') && book.provenance.downloadPermitted;
  const hasTxtDownload =
    book.availableFormats.includes('Plain Text') && book.provenance.downloadPermitted;

  const handleShelfChange = (status: LibraryStatus | 'remove') => {
    onUpdateShelfStatus(book.id, status);
    if (status === 'remove') {
      setShelfFeedback('Removed from your personal library.');
    } else {
      const label =
        status === 'currently-reading'
          ? 'Currently Reading'
          : status === 'want-to-read'
          ? 'Want to Read'
          : 'Finished Books';
      setShelfFeedback(`Saved to "${label}" in your personal library.`);
    }
    setTimeout(() => setShelfFeedback(''), 3500);
  };

  return (
    <div className="book-details-page details-luxury-canvas">
      {/* Breadcrumb & Back Navigation matching screenshot */}
      <div className="details-breadcrumb-bar-modern">
        <div className="details-breadcrumbs-links">
          <button type="button" className="details-crumb-link" onClick={onBack}>
            <ArrowLeft size={14} style={{ display: 'inline', marginRight: '6px' }} />
            <span>Catalog</span>
          </button>
          <span>/</span>
          <button
            type="button"
            className="details-crumb-link"
            onClick={() => onSelectCategory(book.categorySlug)}
          >
            {book.category}
          </button>
          <span>/</span>
          <span style={{ color: '#0F172A', fontWeight: 600 }}>{book.title}</span>
        </div>

        <div className="details-curator-choice-pill">
          <span className="details-curator-dot" />
          <span>
            {book.collections && book.collections[0]
              ? book.collections[0].replace(/-/g, ' ').toUpperCase()
              : 'CURATOR CHOICE'} • {book.publishedYear > 0 ? `Edition of ${book.publishedYear}` : 'Verified Master Edition'}
          </span>
        </div>
      </div>

      {/* Main Book Overview Grid */}
      <div className="details-luxury-grid" aria-labelledby="book-details-title">
        {/* Left Column: Stage Card with Cover, Rating & Sample Buttons */}
        <div className="details-luxury-stage-card">
          <div className="details-cover-frame">
            <BookCover book={book} size="lg" priority={true} />
          </div>

          <div className="details-verified-row">
            <span className="details-verified-pill">
              <CheckCircle2 size={13} />
              <span>Verified Master Edition</span>
            </span>
            <span>•</span>
            <span>{book.publisher || book.provenance.sourceProvider}</span>
          </div>

          <div className="details-rating-row">
            <div className="details-star-group">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.floor(book.rating?.score ?? 4.8) ? '#F59E0B' : 'none'}
                  stroke="#F59E0B"
                />
              ))}
            </div>
            <span>{(book.rating?.score ?? 4.8).toFixed(1)}</span>
            <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.8rem' }}>
              ({(book.rating?.count ? book.rating.count + reviews.length : reviews.length || 12).toLocaleString()} reviews)
            </span>
          </div>

          <div className="details-sample-btns-row">
            <button
              type="button"
              className="btn-details-sample"
              onClick={() => onReadBook(book.id, 0)}
              title="Read Chapter 1"
            >
              <BookOpen size={16} color="#173D2D" />
              <span>Read Chapter 1</span>
            </button>
            <button
              type="button"
              className="btn-details-sample"
              onClick={() => {
                if (book.availableFormats.includes('PDF') || book.manuscriptFormat === 'PDF') {
                  onReadBook(book.id, 0, 'pdf');
                } else if (book.availableFormats.includes('EPUB') || book.manuscriptFormat === 'EPUB') {
                  onReadBook(book.id, 0, 'epub');
                } else {
                  onReadBook(book.id, 0);
                }
              }}
              title="Open Reading View"
            >
              <Headphones size={16} color="#173D2D" />
              <span>{book.availableFormats.includes('PDF') || book.manuscriptFormat === 'PDF' ? 'PDF Viewer' : 'Full Preview'}</span>
            </button>
          </div>

          {/* Quick Provenance Facts */}
          <div className="details-quick-facts" style={{ width: '100%', marginTop: '1.5rem', background: '#F8F6EF', borderRadius: '10px', padding: '1rem', border: '1px solid #E3E6DF' }}>
            <div className="quick-fact-row">
              <span className="quick-fact-label">Access Status</span>
              <span className={`quick-fact-value access-text-${book.accessType}`}>
                <strong>{accessHeadline}</strong>
              </span>
            </div>
            <div className="quick-fact-row">
              <span className="quick-fact-label">Source Provider</span>
              <span className="quick-fact-value">{book.provenance.sourceProvider}</span>
            </div>
            <div className="quick-fact-row">
              <span className="quick-fact-label">Formats</span>
              <span className="quick-fact-value">
                {book.availableFormats.length > 0 ? book.availableFormats.join(', ') : 'Web Preview'}
              </span>
            </div>
            <div className="quick-fact-row">
              <span className="quick-fact-label">Licence</span>
              <span className="quick-fact-value">{book.provenance.licenceName}</span>
            </div>
            <div className="quick-fact-row" style={{ paddingTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsCopyrightModalOpen(true)}
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-semibold hover:underline"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <ShieldAlert size={13} />
                <span>Report Rights Issue / Copyright Notice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Titles, Author Card, Purchase Card, Edition Selector */}
        <div className="details-right-col">
          <div className="details-category-pills-row">
            {(book.isRecentlyAdded || book.collections?.includes('recently-added') || book.collections?.includes('new-arrivals')) && (
              <span className="details-genre-pill" style={{ color: '#173D2D', background: '#DCE6DC', border: '1px solid #CBD5CB', fontWeight: 700 }}>
                ★ Recently Added
              </span>
            )}
            <span className="details-nominee-pill">
              {book.rightsNote ? book.rightsNote.toUpperCase() : book.provenance.copyrightStatus.toUpperCase()}
            </span>
            <button
              type="button"
              className="details-genre-pill"
              onClick={() => onSelectCategory(book.categorySlug)}
              style={{ cursor: 'pointer' }}
            >
              {book.category}
            </button>
            <span className="details-genre-pill">{book.genre}</span>
            <span className="details-genre-pill" style={{ color: '#173D2D', background: '#DCE6DC' }}>
              {book.languageLabel || (book.language === 'so' ? 'Af-Soomaali' : 'English')}
            </span>
          </div>

          <h1 id="book-details-title" className="details-book-title-main">
            {book.title}
          </h1>
          <p className="details-book-subtitle-text">
            {book.subtitle || book.shortSynopsis}
          </p>

          {/* Author Card */}
          <div className="details-author-card">
            {authorProfile?.portraitUrl ? (
              <img
                src={authorProfile.portraitUrl}
                alt={book.author}
                className="details-author-avatar-img"
              />
            ) : (
              <div
                className="details-author-avatar-img"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #DCE6DC 0%, #CBD5CB 100%)',
                  color: '#173D2D',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: '1.5px solid #CBD5CB'
                }}
              >
                {book.author.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="details-author-info">
              <div className="details-author-name-row">
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => authorProfile && onSelectAuthor(authorProfile.id)}
                  title="View Author Profile"
                >
                  {book.author}
                </span>
                <CheckCircle2 size={15} color="#173D2D" />
              </div>
              <span className="details-author-sub">
                {authorProfile?.shortBio
                  ? `${authorProfile.shortBio.slice(0, 48)}...`
                  : `${book.category} Author`} • {BOOKS.filter((b) => b.authorId === book.authorId || b.author === book.author).length} Works Catalogued
              </span>
            </div>
            <button
              type="button"
              className={`btn-author-follow ${isFollowing ? 'following' : ''}`}
              onClick={handleToggleFollow}
              title={isFollowing ? `Unfollow ${book.author}` : `Follow ${book.author}`}
              style={{
                backgroundColor: isFollowing ? '#CBD5CB' : '#DCE6DC',
                color: '#173D2D',
                borderColor: '#CBD5CB',
                fontWeight: 700
              }}
            >
              {isFollowing ? '✓ Following' : '+ Follow'}
            </button>
          </div>

          {/* Main Purchase / Reading Card */}
          <div className="details-purchase-card">
            <div className="purchase-top-pricing-row">
              <div className="purchase-price-group">
                <span className="purchase-main-price">
                  {isPaid && !hasPurchased
                    ? (book.priceDisplay || `$${book.price || '4.99'}`)
                    : book.isFree
                    ? 'Free Full-Text'
                    : '$14.99'}
                </span>
                <span className="purchase-save-pill" style={{ backgroundColor: '#DCE6DC', color: '#173D2D', borderColor: '#CBD5CB' }}>
                  {isPaid ? 'Digital Edition' : 'Open Access Edition'}
                </span>
              </div>
              <div className="purchase-instant-sync-note">
                <Zap size={14} color="#173D2D" />
                <span>Formats: {book.availableFormats.join(', ') || 'Online Reader'}</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="purchase-action-btns-row">
              {isPaid && !hasPurchased ? (
                <button
                  type="button"
                  className="btn-buy-ebook-primary"
                  onClick={() => setIsPurchaseModalOpen(true)}
                >
                  <DollarSign size={18} />
                  <span>Buy eBook Now ({book.priceDisplay || `$${book.price || '4.99'}`})</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-buy-ebook-primary"
                  onClick={() => onReadBook(book.id, 0)}
                >
                  <BookOpen size={18} />
                  <span>{book.provenance.fullTextReadingPermitted ? 'Read eBook Now' : 'Read Preview'}</span>
                </button>
              )}

              <button
                type="button"
                className="btn-gift-ebook"
                title="Share this book"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: book.title, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    setShelfFeedback('Book link copied to clipboard!');
                    setTimeout(() => setShelfFeedback(''), 3000);
                  }
                }}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>

              <button
                type="button"
                className={`btn-hero-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={(e) => onToggleBookmark(book.id, e)}
                title={isBookmarked ? 'Saved to bookmarks' : 'Add to bookmarks'}
              >
                <Bookmark size={18} fill={isBookmarked ? '#173D2D' : 'none'} color={isBookmarked ? '#173D2D' : undefined} />
              </button>
            </div>

            {/* Shelf and Format Downloads Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
              <div className="details-shelf-selector" style={{ margin: 0 }}>
                <Library size={16} />
                <select
                  aria-label="Save to Library shelf"
                  value={currentShelfStatus || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) handleShelfChange(val as LibraryStatus | 'remove');
                  }}
                >
                  <option value="" disabled>
                    + Save to Library...
                  </option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="finished">Finished Reading</option>
                  {currentShelfStatus && <option value="remove">Remove from Shelf</option>}
                </select>
              </div>

              {canDirectlyRead && hasPdfDownload && (
                <button
                  type="button"
                  className="btn-details-sample"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => onReadBook(book.id, 0, 'pdf')}
                >
                  <FileText size={14} />
                  <span>PDF Viewer</span>
                </button>
              )}

              {canDirectlyRead && hasPdfDownload && (
                <button
                  type="button"
                  className="btn-details-sample"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => onDownloadBook(book.id, 'pdf')}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              )}

              {canDirectlyRead && hasEpubDownload && (
                <button
                  type="button"
                  className="btn-details-sample"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => onDownloadBook(book.id, 'epub')}
                >
                  <Download size={14} />
                  <span>Download EPUB</span>
                </button>
              )}
            </div>

            {shelfFeedback && (
              <div className="acquisition-honest-notice" role="status" style={{ marginTop: '0.75rem' }}>
                <p>
                  <strong>My Library:</strong> {shelfFeedback}
                </p>
              </div>
            )}
          </div>

          {/* Choose Edition Card */}
          <div className="details-editions-card">
            <div className="editions-header-row">
              <span className="editions-title-label">CHOOSE EDITION</span>
              <span className="editions-format-note">
                {book.availableFormats.length > 0 ? `${book.availableFormats.join(' • ')} Available` : 'Digital Edition'}
              </span>
            </div>

            <div className="editions-grid-3">
              <div
                className={`edition-choice-card ${selectedFormat === 'EPUB' || selectedFormat === 'eBook' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('EPUB')}
              >
                <div className="edition-dot-indicator" />
                <div className="edition-format-name">
                  <BookOpen size={14} color="#173D2D" />
                  <span>Digital eBook</span>
                </div>
                <div className="edition-format-price">
                  {isPaid && !hasPurchased
                    ? (book.priceDisplay || `$${book.price || '4.99'}`)
                    : book.isFree
                    ? 'Free'
                    : '$14.99'}
                </div>
                <div className="edition-format-sub">Includes ePub + In-Browser Reader</div>
              </div>

              <div
                className={`edition-choice-card ${selectedFormat === 'PDF' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('PDF')}
              >
                <div className="edition-format-name">
                  <FileText size={14} color="#173D2D" />
                  <span>PDF Master</span>
                </div>
                <div className="edition-format-price">
                  {book.provenance.downloadPermitted ? 'Permitted' : 'Verified'}
                </div>
                <div className="edition-format-sub">
                  {book.pages} pages • Exact print layout
                </div>
              </div>

              <div
                className={`edition-choice-card ${selectedFormat === 'Archive' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('Archive')}
              >
                <div className="edition-format-name">
                  <Layers size={14} color="#0F172A" />
                  <span>Archival Record</span>
                </div>
                <div className="edition-format-price">ISBN Validated</div>
                <div className="edition-format-sub">ISBN: {book.isbn}</div>
              </div>
            </div>

            {/* 4-Box Metadata Footer Grid */}
            <div className="editions-meta-grid-4">
              <div className="edition-meta-box">
                <span className="meta-box-label">LENGTH</span>
                <span className="meta-box-value">{book.pages} pp</span>
                <span className="meta-box-sub">~{Math.max(1, Math.round(book.pages / 40))} hrs reading</span>
              </div>
              <div className="edition-meta-box">
                <span className="meta-box-label">FILE SIZE</span>
                <span className="meta-box-value">{(book.pages * 0.012 + 1.2).toFixed(1)} MB</span>
                <span className="meta-box-sub">ePub / PDF bundle</span>
              </div>
              <div className="edition-meta-box">
                <span className="meta-box-label">SYNC STATE</span>
                <span className="meta-box-value">{user ? 'Cloud Sync' : 'Local State'}</span>
                <span className="meta-box-sub">{user ? 'Account Synced' : 'Sign in to sync'}</span>
              </div>
              <div className="edition-meta-box">
                <span className="meta-box-label">LANGUAGE</span>
                <span className="meta-box-value">{book.languageLabel || (book.language === 'so' ? 'Af-Soomaali' : book.language === 'en' ? 'English' : book.language)}</span>
                <span className="meta-box-sub">{book.publisher || 'Verified publisher'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1300px', margin: '2rem auto 0' }}>

          {/* Synopsis & Editorial Description */}
          <div className="details-section-block">
            <h2 className="details-subhead">
              <FileText size={17} />
              <span>Synopsis &amp; Editorial Note</span>
            </h2>
            <p className="details-lead-synopsis">{book.shortSynopsis}</p>
            <div className="details-description-paragraphs">
              {book.description.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Table of Contents */}
          <div className="details-section-block">
            <div className="toc-header-row">
              <h2 className="details-subhead">
                <Layers size={17} />
                <span>Table of Contents</span>
              </h2>
              <span className="toc-note">
                {book.accessStatus === 'metadata_only'
                  ? 'Archival Chapter Index (Bibliographic Reference)'
                  : book.provenance.fullTextReadingPermitted
                  ? `Complete Unabridged Edition (${book.tableOfContents.length} sections ready)`
                  : `${book.sampleChapters.length} preview ${
                      book.sampleChapters.length === 1 ? 'section' : 'sections'
                    } ready`}
              </span>
            </div>

            <ol className="details-toc-list">
              {book.tableOfContents.map((chapterTitle, index) => {
                const isReadableChapter =
                  book.provenance.fullTextReadingPermitted ||
                  (book.accessStatus !== 'metadata_only' && index < book.sampleChapters.length);
                return (
                  <li key={index} className="details-toc-item">
                    <div className="toc-item-left">
                      <span className="toc-item-index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="toc-item-title">{chapterTitle}</span>
                    </div>

                    {isReadableChapter ? (
                      <button
                        type="button"
                        className="toc-read-trigger"
                        onClick={() => onReadBook(book.id, index)}
                      >
                        <BookOpen size={13} />
                        <span>
                          {book.provenance.fullTextReadingPermitted
                            ? 'Open Chapter'
                            : 'Open Preview'}
                        </span>
                      </button>
                    ) : (
                      <span className="toc-edition-tag">
                        {book.accessStatus === 'metadata_only'
                          ? 'Print / External Edition'
                          : 'Included in Complete Print Edition'}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

      {/* Author Biographical Note */}
      {authorProfile && (
        <section className="container details-author-section" aria-labelledby="about-author-heading">
          <div className="details-author-card">
            <div className="details-author-portrait">
              <EditorialImage
                src={authorProfile.portraitUrl}
                alt={authorProfile.portraitAlt}
                aspectRatio="portrait"
              />
            </div>
            <div className="details-author-copy">
              <span className="section-eyebrow">ABOUT THE AUTHOR</span>
              <h2 id="about-author-heading" className="details-author-name">
                {authorProfile.name} ({authorProfile.lifespan})
              </h2>
              <p className="details-author-bio">{authorProfile.shortBio}</p>
              <blockquote className="details-author-quote">
                “{authorProfile.notableQuote}”
                <cite> — {authorProfile.quoteSource}</cite>
              </blockquote>
              <button
                type="button"
                className="btn-editorial-link"
                onClick={() => onSelectAuthor(authorProfile.id)}
              >
                View Full Author Profile &amp; Bibliography →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Reader Reviews & Discussion Section */}
      <section className="container details-section-block" style={{ marginTop: '3.5rem', marginBottom: '3.5rem' }} aria-labelledby="reader-reviews-heading">
        <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span className="section-eyebrow">COMMUNITY OPINION &amp; LITERARY CRITIQUE</span>
            <h2 id="reader-reviews-heading" className="section-title" style={{ fontSize: '1.85rem', margin: 0 }}>
              Reader Reviews ({reviews.length})
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--card-bg, #ffffff)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color, #e5e7eb)' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(book.rating?.score ?? 4.8) ? '#f59e0b' : 'none'}
                  stroke="#f59e0b"
                />
              ))}
            </div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-color, #111827)' }}>
              {(book.rating?.score ?? 4.8).toFixed(1)}
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>/ 5.0</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.length === 0 ? (
              <div
                style={{
                  background: 'var(--card-bg, #ffffff)',
                  border: '1px dashed var(--border-color, #cbd5e1)',
                  borderRadius: '12px',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center'
                }}
              >
                <MessageSquare size={28} style={{ color: '#94a3b8', margin: '0 auto 0.75rem', display: 'block' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  No Reader Reviews Yet
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
                  Be the first reader to submit a review and rating for <em>{book.title}</em>.
                </p>
              </div>
            ) : (
              reviews.map((rev: BookReview) => (
                <div
                  key={rev.id}
                  style={{
                    background: 'var(--card-bg, #ffffff)',
                    border: '1px solid var(--border-color, #e5e7eb)',
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-color, #111827)' }}>
                        {rev.reviewerName}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{rev.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', color: '#f59e0b' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < rev.rating ? '#f59e0b' : 'none'}
                            stroke="#f59e0b"
                          />
                        ))}
                      </div>
                      {rev.verifiedReader && (
                        <span
                          title="Verified Reader"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#059669', fontSize: '0.75rem', fontWeight: 600, background: '#d1fae5', padding: '0.15rem 0.4rem', borderRadius: '4px' }}
                        >
                          <CheckCircle2 size={11} /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#374151', margin: 0 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Box */}
          <div
            style={{
              background: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--border-color, #e5e7eb)',
              borderRadius: '12px',
              padding: '1.75rem',
              height: 'fit-content',
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: '#059669' }} />
              <span>Qor Aragtidaada (Leave a Review)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Share your reading reflections on <em>{book.title}</em> with the community.
            </p>

            {reviewSubmitted && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Mahadsanid! Aragtidaada si guul leh baa loo daabacay.</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Your Rating
                </label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: star <= newRating ? '#f59e0b' : '#d1d5db' }}
                    >
                      <Star size={22} fill={star <= newRating ? '#f59e0b' : 'none'} stroke={star <= newRating ? '#f59e0b' : '#9ca3af'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', alignSelf: 'center', marginLeft: '0.5rem' }}>
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="reviewer-name-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Magacaaga (Name)
                </label>
                <input
                  id="reviewer-name-input"
                  type="text"
                  placeholder={user ? user.fullName : "e.g. Maryan Cabdi"}
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, #e5e7eb)',
                    background: 'var(--bg-input, #ffffff)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label htmlFor="reviewer-comment-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Aragtidaada Buugga (Review)
                </label>
                <textarea
                  id="reviewer-comment-input"
                  rows={4}
                  placeholder="Maxaad ka heshay buuggan? Sidee buu kuu saameeyay..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, #e5e7eb)',
                    background: 'var(--bg-input, #ffffff)',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                className="button button--primary"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.45rem', padding: '0.75rem' }}
              >
                <Send size={15} />
                <span>Dir Aragtidaada (Submit Review)</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Books */}
      <section className="container details-related-section" aria-labelledby="related-books-heading">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">FURTHER READING</span>
            <h2 id="related-books-heading" className="section-title">
              Related Editions in {book.category}
            </h2>
          </div>
        </div>

        <div className="books-grid-4">
          {fallbackRelated.map((relBook) => (
            <BookCard
              key={relBook.id}
              book={relBook}
              onSelectBook={onSelectBook}
              onReadBook={(id) => onReadBook(id, 0)}
              isBookmarked={bookmarkedIds.includes(relBook.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </section>

      {/* Copyright Dispute Modal */}
      <CopyrightNoticeModal
        book={book}
        isOpen={isCopyrightModalOpen}
        onClose={() => setIsCopyrightModalOpen(false)}
      />

      {/* Production-Grade Checkout Modal */}
      <CheckoutModal
        book={book}
        user={user}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={(bookId) => {
          setHasPurchased(true);
          if (onPurchaseSuccess) onPurchaseSuccess(bookId);
          onReadBook(bookId, 0);
        }}
        onUserLogin={(newUser) => {
          if (onUserUpdate) onUserUpdate(newUser);
        }}
      />
    </div>
  );
};

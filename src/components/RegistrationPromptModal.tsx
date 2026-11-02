import React from 'react';
import { BookOpen, Download, Lock, X } from 'lucide-react';
import { Book, IntendedBookAction } from '../types';
import { BookCover } from './BookCover';

interface RegistrationPromptModalProps {
  book: Book | null;
  intendedAction?: IntendedBookAction | null;
  onCreateAccount: () => void;
  onSignIn: () => void;
  onContinueBrowsing: () => void;
}

export const RegistrationPromptModal: React.FC<RegistrationPromptModalProps> = ({
  book,
  intendedAction,
  onCreateAccount,
  onSignIn,
  onContinueBrowsing
}) => {
  if (!book) return null;

  const isDownloadAction = intendedAction?.type.startsWith('download-');
  const actionSummaryLabel =
    intendedAction?.type === 'download-pdf'
      ? 'Download Full PDF Edition'
      : intendedAction?.type === 'download-epub'
      ? 'Download Full EPUB Edition'
      : intendedAction?.type === 'download-html'
      ? 'Download HTML Edition'
      : intendedAction?.type === 'download-txt'
      ? 'Download Plain Text Edition'
      : intendedAction?.type === 'read-pdf'
      ? 'Open In-Browser PDF Reader'
      : 'Read Complete Unabridged Book';

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-gate-headline"
      onClick={onContinueBrowsing}
    >
      <div className="modal-card reading-gate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-eyebrow">
              <Lock size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
              Understory READER &amp; ARCHIVE • MEMBER ACCESS
            </span>
            <h2 id="reading-gate-headline" className="modal-title">
              Your next chapter starts here.
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onContinueBrowsing}
            aria-label="Close prompt"
          >
            <X size={20} />
          </button>
        </div>

        <p className="modal-subtitle">
          Create your free account to read full books, download eligible ebooks, and save your reading progress.
        </p>

        {/* Selected Book Preview Banner */}
        <div className="reading-gate-book-banner">
          <div className="reading-gate-cover">
            <BookCover book={book} size="sm" />
          </div>
          <div className="reading-gate-book-meta">
            <span className="reading-gate-status-pill">
              {isDownloadAction ? <Download size={12} /> : <BookOpen size={12} />}{' '}
              {actionSummaryLabel}
            </span>
            <h3 className="reading-gate-book-title">{book.title}</h3>
            <p className="reading-gate-book-author">
              {book.author} • {book.publishedYear} •{' '}
              {book.availableFormats.length > 0
                ? `Available in ${book.availableFormats.join(', ')}`
                : `${book.pages} pages`}
            </p>
            <p className="reading-gate-return-note">
              <BookOpen size={12} /> After signing in, you will be returned directly to{' '}
              <strong>{book.title}</strong> and your requested action ({actionSummaryLabel.toLowerCase()}) will continue automatically.
            </p>
          </div>
        </div>

        <div className="reading-gate-benefits">
          <div className="reading-gate-benefit-item">
            <strong>Complete Online Reading &amp; PDF Viewer</strong>
            <span>Read complete public-domain &amp; open-access books in our Web Reader or PDF Reader.</span>
          </div>
          <div className="reading-gate-benefit-item">
            <strong>Verified PDF, EPUB &amp; Text Downloads</strong>
            <span>Download complete archival PDF, EPUB, HTML, and Plain Text files to your device.</span>
          </div>
          <div className="reading-gate-benefit-item">
            <strong>Automatic Page &amp; Chapter Sync</strong>
            <span>Resume on the exact PDF page or chapter across sessions and track your download history.</span>
          </div>
        </div>

        <div className="reading-gate-actions">
          <button
            type="button"
            className="btn-primary-solid btn-lg btn-full"
            onClick={onCreateAccount}
          >
            Create Account
          </button>
          <button
            type="button"
            className="btn-secondary-outline btn-lg btn-full"
            onClick={onSignIn}
          >
            Sign In
          </button>
          <button
            type="button"
            className="reading-gate-continue-btn"
            onClick={onContinueBrowsing}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

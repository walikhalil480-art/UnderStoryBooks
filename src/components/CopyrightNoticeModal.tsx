import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { folioApi } from '../services/api';
import { Book } from '../types';

interface CopyrightNoticeModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const CopyrightNoticeModal: React.FC<CopyrightNoticeModalProps> = ({
  book,
  isOpen,
  onClose
}) => {
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantRelationship, setClaimantRelationship] = useState('Author / Original Copyright Owner');
  const [infringementDetails, setInfringementDetails] = useState('');
  const [originalWorkUrl, setOriginalWorkUrl] = useState('');
  const [goodFaith, setGoodFaith] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName || !claimantEmail || !infringementDetails) {
      setError('Please fill in your name, email, and description of the claimed infringement.');
      return;
    }
    if (!goodFaith) {
      setError('Please check the confirmation box declaring good faith ownership or authorization.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await folioApi.submitCopyrightComplaint({
        bookId: book.id,
        bookTitle: book.title,
        claimantName,
        claimantEmail,
        claimantRelationship,
        infringementDetails,
        originalWorkUrl,
        goodFaithDeclaration: true
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit copyright report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-neutral-900 text-neutral-100 rounded-xl shadow-2xl border border-neutral-700 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold tracking-tight">Copyright &amp; Rights Dispute Notice</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-700">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Notice Successfully Logged</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Your takedown or rights inquiry for <span className="font-semibold text-white">"{book.title}"</span> has been registered in our administrative moderation queue. An editor will review your complaint within 24 to 48 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="p-3 bg-neutral-800/80 rounded-lg border border-neutral-700 text-xs text-neutral-300 space-y-1">
              <p>
                <span className="font-semibold text-neutral-100">Disputed Book:</span> {book.title}
              </p>
              <p>
                <span className="font-semibold text-neutral-100">Recorded Author:</span> {book.author}
              </p>
              <p>
                <span className="font-semibold text-neutral-100">Current Rights Holder:</span>{' '}
                {book.rightsHolder || book.provenance.rightsHolder || 'Recorded in archive'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-200 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                required
                placeholder="e.g. Maryan Faarax"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Your Contact Email *
              </label>
              <input
                type="email"
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
                required
                placeholder="rights-holder@example.com"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Your Legal Relationship to the Work *
              </label>
              <select
                value={claimantRelationship}
                onChange={(e) => setClaimantRelationship(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Author / Original Copyright Owner">Author / Original Copyright Owner</option>
                <option value="Heir or Estate Representative">Heir or Estate Representative</option>
                <option value="Authorized Publisher or Literary Agent">Authorized Publisher or Literary Agent</option>
                <option value="Legal Counsel">Legal Counsel</option>
                <option value="Reader Reporting Inaccurate Provenance">Reader Reporting Inaccurate Provenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Details of Infringement or Inaccuracy *
              </label>
              <textarea
                value={infringementDetails}
                onChange={(e) => setInfringementDetails(e.target.value)}
                required
                rows={3}
                placeholder="State why this book or file should be restricted, unverified, or updated with correct copyright information..."
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Link to Official Publication / Evidence (Optional)
              </label>
              <input
                type="url"
                value={originalWorkUrl}
                onChange={(e) => setOriginalWorkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="goodFaithCheck"
                checked={goodFaith}
                onChange={(e) => setGoodFaith(e.target.checked)}
                className="mt-1 accent-amber-500"
              />
              <label htmlFor="goodFaithCheck" className="text-xs text-neutral-400 leading-tight">
                I state in good faith that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Notice'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

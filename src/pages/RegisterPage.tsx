import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Bookmark,
  TrendingUp,
  UserPlus,
  Library,
  Check
} from 'lucide-react';
import { Book, UserLibraryPayload, UserProfile } from '../types';
import { folioApi } from '../services/api';
import { EditorialImage } from '../components/EditorialImage';
import { BookCover } from '../components/BookCover';
import { IMAGE_REGISTRY } from '../data/imageRegistry';

interface RegisterPageProps {
  pendingBook: Book | null;
  onAuthSuccess: (user: UserProfile, library: UserLibraryPayload) => void;
  onNavigateSignIn: () => void;
  onNavigateTerms: () => void;
  onCancel: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  pendingBook,
  onAuthSuccess,
  onNavigateSignIn,
  onNavigateTerms,
  onCancel
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Real-time password strength checks
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasLetter ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (password.length >= 12 ? 1 : 0);

  const strengthLabel =
    password.length === 0
      ? 'Minimum 8 characters with letters & numbers'
      : strengthScore <= 2
      ? 'Fair — add letters and numbers'
      : strengthScore === 3
      ? 'Good — meets security standards'
      : 'Strong — high entropy password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!hasMinLength || !hasLetter || !hasNumber) {
      setError('Password must be at least 8 characters and include at least one letter and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy to create your account.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await folioApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        agreedToTerms
      });
      onAuthSuccess(res.user, res.library);
    } catch (err: any) {
      setError(err?.message || 'Unable to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const editorialPhoto = IMAGE_REGISTRY['reader-scene-03-sunlit-window'];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-breadcrumb-row">
          <button type="button" className="auth-back-btn" onClick={onCancel}>
            <ArrowLeft size={16} />
            <span>{pendingBook ? `Return to ${pendingBook.title}` : 'Return to Library'}</span>
          </button>
        </div>

        <div className="auth-card-wrapper">
          {/* Left Column: Modern Registration Form */}
          <div className="auth-form-column">
            <div className="auth-brand-badge">
              <BookOpen size={12} />
              <span>New Reader Registration</span>
            </div>

            <h1 className="auth-heading">Create your library card</h1>
            <p className="auth-subheading">
              Join Understory to unlock unabridged editions, synchronized reading progress, and your personal shelves.
            </p>

            {pendingBook && (
              <div className="auth-book-callout">
                <div className="auth-book-callout-cover">
                  <BookCover book={pendingBook} size="sm" />
                </div>
                <div className="auth-book-callout-text">
                  <span className="auth-book-callout-badge">
                    <BookOpen size={12} /> Selected for Reading
                  </span>
                  <span className="auth-book-callout-title">{pendingBook.title}</span>
                  <span className="auth-book-callout-author">
                    by {pendingBook.author} • You will be taken straight to this book after creating your card.
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="auth-alert error" role="alert">
                <AlertCircle size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form-stack" onSubmit={handleSubmit} noValidate>
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="reg-fullname">
                  Full Name
                </label>
                <div className="auth-input-container">
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Cabdiqaadir Xasan"
                    autoComplete="name"
                    className="auth-text-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label" htmlFor="reg-email">
                  Email Address
                </label>
                <div className="auth-input-container">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="auth-text-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label" htmlFor="reg-password">
                  Password
                </label>
                <div className="auth-input-container">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="auth-text-input"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Sleek Password Strength Meter */}
                <div className="auth-strength-container">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={`auth-strength-bar ${
                          password.length > 0 && strengthScore >= level
                            ? `active-${strengthScore}`
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                  <div className="auth-strength-meta">
                    <span>{strengthLabel}</span>
                  </div>
                  <div className="auth-strength-checklist">
                    <span className={`auth-check-item ${hasMinLength ? 'passed' : ''}`}>
                      <Check size={12} /> 8+ characters
                    </span>
                    <span className={`auth-check-item ${hasLetter ? 'passed' : ''}`}>
                      <Check size={12} /> Letters
                    </span>
                    <span className={`auth-check-item ${hasNumber ? 'passed' : ''}`}>
                      <Check size={12} /> Numbers
                    </span>
                  </div>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label" htmlFor="reg-confirm-password">
                  Confirm Password
                </label>
                <div className="auth-input-container">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="auth-text-input"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p className={`auth-match-text ${passwordsMatch ? 'valid' : 'invalid'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </p>
                )}
              </div>

              <label className="auth-terms-row">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>
                  I agree to the Understory{' '}
                  <button type="button" className="auth-inline-btn" onClick={onNavigateTerms}>
                    Terms of Service &amp; Privacy Policy
                  </button>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="auth-cta-btn"
                disabled={submitting}
              >
                <UserPlus size={18} />
                <span>{submitting ? 'Creating card...' : 'Create library card'}</span>
              </button>
            </form>

            <div className="auth-switch-footer">
              <span>Already have an Understory library card?</span>
              <button type="button" className="auth-switch-link" onClick={onNavigateSignIn}>
                Sign in
              </button>
            </div>
          </div>

          {/* Right Column: Luxury Editorial Showcase */}
          <aside className="auth-showcase-panel">
            <div className="auth-showcase-image-wrap">
              <EditorialImage
                src={editorialPhoto.url}
                alt={editorialPhoto.alt}
                aspectRatio="landscape"
                subjectType={editorialPhoto.subjectType}
              />
            </div>

            <div className="auth-showcase-quote">
              <p className="auth-quote-text">
                "Nin aan dhul marin dhaayo ma leh, nin aan wax aqrina ogaal ma leh."
              </p>
              <p className="auth-quote-author">Maahmaah Soomaaliyeed (Somali Proverb)</p>
            </div>

            <ul className="auth-showcase-perks">
              <li className="auth-perk-item">
                <div className="auth-perk-icon-wrap">
                  <Library size={16} />
                </div>
                <span><strong>Unabridged Access:</strong> Full digital editions of Somali literature and world classics.</span>
              </li>
              <li className="auth-perk-item">
                <div className="auth-perk-icon-wrap">
                  <Bookmark size={16} />
                </div>
                <span><strong>Personal Library Shelves:</strong> Organize books into Reading, Want to Read, and Completed.</span>
              </li>
              <li className="auth-perk-item">
                <div className="auth-perk-icon-wrap">
                  <TrendingUp size={16} />
                </div>
                <span><strong>Real-Time Analytics:</strong> Track active weekly reading hours and daily page turns.</span>
              </li>
            </ul>

            <div className="auth-showcase-trust">
              <ShieldCheck size={16} style={{ color: '#DCE6DC', flexShrink: 0 }} />
              <span>Passwords protected with salted scrypt hashing • Zero tracking</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

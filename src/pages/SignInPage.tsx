import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Mail,
  Lock,
  Bookmark,
  TrendingUp,
  LogIn,
  Library
} from 'lucide-react';
import { Book, UserLibraryPayload, UserProfile } from '../types';
import { folioApi } from '../services/api';
import { EditorialImage } from '../components/EditorialImage';
import { BookCover } from '../components/BookCover';
import { IMAGE_REGISTRY } from '../data/imageRegistry';

interface SignInPageProps {
  pendingBook: Book | null;
  onAuthSuccess: (user: UserProfile, library: UserLibraryPayload) => void;
  onNavigateRegister: () => void;
  onCancel: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  pendingBook,
  onAuthSuccess,
  onNavigateRegister,
  onCancel
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forgot password recovery state
  const [recoveryMode, setRecoveryMode] = useState<'none' | 'request' | 'reset'>('none');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [generatedTokenHint, setGeneratedTokenHint] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRecoverySuccess('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await folioApi.signIn({
        email: email.trim(),
        password
      });
      onAuthSuccess(res.user, res.library);
    } catch (err: any) {
      setError(err?.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter the email address associated with your account.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await folioApi.forgotPassword(email.trim());
      setGeneratedTokenHint(res.resetToken);
      setRecoveryToken(res.resetToken);
      setRecoveryMode('reset');
    } catch (err: any) {
      setError(err?.message || 'Unable to generate password recovery code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      const res = await folioApi.resetPassword({
        email: email.trim(),
        resetToken: recoveryToken.trim(),
        newPassword
      });
      setRecoverySuccess(res.message);
      setPassword(newPassword);
      setRecoveryMode('none');
    } catch (err: any) {
      setError(err?.message || 'Unable to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  const editorialPhoto = IMAGE_REGISTRY['reader-scene-04-armchair-bookshelves'];

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
          {/* Left Column: Modern Professional Form */}
          <div className="auth-form-column">
            <div className="auth-brand-badge">
              <BookOpen size={12} />
              <span>Understory Member Portal</span>
            </div>

            <h1 className="auth-heading">
              {recoveryMode === 'none' ? 'Sign in to your library' : 'Recover your account'}
            </h1>
            <p className="auth-subheading">
              {recoveryMode === 'none'
                ? 'Welcome back. Enter your credentials to access your personal reading collection.'
                : 'Enter your registered email address to receive a secure password recovery code.'}
            </p>

            {pendingBook && (
              <div className="auth-book-callout">
                <div className="auth-book-callout-cover">
                  <BookCover book={pendingBook} size="sm" />
                </div>
                <div className="auth-book-callout-text">
                  <span className="auth-book-callout-badge">
                    <BookOpen size={12} /> Waiting in Reader
                  </span>
                  <span className="auth-book-callout-title">{pendingBook.title}</span>
                  <span className="auth-book-callout-author">
                    by {pendingBook.author} • Sign in to continue reading immediately.
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

            {recoverySuccess && (
              <div className="auth-alert success" role="status">
                <CheckCircle2 size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {recoveryMode === 'none' && (
              <form className="auth-form-stack" onSubmit={handleSignIn} noValidate>
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="signin-email">
                    Email Address
                  </label>
                  <div className="auth-input-container">
                    <Mail size={18} className="auth-input-icon" />
                    <input
                      id="signin-email"
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
                  <div className="auth-input-label-row">
                    <label className="auth-label" htmlFor="signin-password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => {
                        setError('');
                        setRecoveryMode('request');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="auth-input-container">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
                </div>

                <button
                  type="submit"
                  className="auth-cta-btn"
                  disabled={submitting}
                >
                  <LogIn size={18} />
                  <span>{submitting ? 'Signing in...' : 'Sign in to library'}</span>
                </button>
              </form>
            )}

            {recoveryMode === 'request' && (
              <form className="auth-form-stack" onSubmit={handleRequestReset} noValidate>
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="recovery-email">
                    Registered Email Address
                  </label>
                  <div className="auth-input-container">
                    <Mail size={18} className="auth-input-icon" />
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="auth-text-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-cta-btn"
                  disabled={submitting}
                >
                  <KeyRound size={18} />
                  <span>{submitting ? 'Generating code...' : 'Send recovery code'}</span>
                </button>
                <button
                  type="button"
                  className="auth-inline-btn"
                  style={{ textAlign: 'center', marginTop: '0.5rem' }}
                  onClick={() => {
                    setError('');
                    setRecoveryMode('none');
                  }}
                >
                  Return to sign in
                </button>
              </form>
            )}

            {recoveryMode === 'reset' && (
              <form className="auth-form-stack" onSubmit={handleResetPassword} noValidate>
                {generatedTokenHint && (
                  <div className="auth-alert success">
                    <KeyRound size={18} className="flex-shrink-0" />
                    <span>
                      Recovery code for <strong>{email}</strong>:{' '}
                      <code style={{ background: '#FFFFFF', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                        {generatedTokenHint}
                      </code>
                    </span>
                  </div>
                )}
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reset-code">
                    8-Digit Recovery Code
                  </label>
                  <div className="auth-input-container">
                    <KeyRound size={18} className="auth-input-icon" />
                    <input
                      id="reset-code"
                      type="text"
                      required
                      value={recoveryToken}
                      onChange={(e) => setRecoveryToken(e.target.value)}
                      placeholder="e.g. A1B2C3D4"
                      className="auth-text-input"
                      style={{ letterSpacing: '0.08em', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reset-new-password">
                    New Secure Password (8+ characters)
                  </label>
                  <div className="auth-input-container">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      id="reset-new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="auth-text-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-cta-btn"
                  disabled={submitting}
                >
                  <CheckCircle2 size={18} />
                  <span>{submitting ? 'Updating...' : 'Save new password'}</span>
                </button>
                <button
                  type="button"
                  className="auth-inline-btn"
                  style={{ textAlign: 'center', marginTop: '0.5rem' }}
                  onClick={() => setRecoveryMode('none')}
                >
                  Cancel and return
                </button>
              </form>
            )}

            <div className="auth-switch-footer">
              <span>Don't have an Understory library account?</span>
              <button type="button" className="auth-switch-link" onClick={onNavigateRegister}>
                Create an account
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
                "A reader lives a thousand lives before he dies. The man who never reads lives only one."
              </p>
              <p className="auth-quote-author">George R.R. Martin</p>
            </div>

            <ul className="auth-showcase-perks">
              <li className="auth-perk-item">
                <div className="auth-perk-icon-wrap">
                  <Bookmark size={16} />
                </div>
                <span><strong>Synchronized Desk:</strong> Remembers your chapter, bookmarks, and font preferences.</span>
              </li>
              <li className="auth-perk-item">
                <div className="auth-perk-icon-wrap">
                  <TrendingUp size={16} />
                </div>
                <span><strong>Reading Velocity:</strong> Real-time tracking of weekly hours and pages read.</span>
              </li>
              <li className="auth-perk-item">
                <div className="auth-perk-icon-wrap">
                  <Library size={16} />
                </div>
                <span><strong>Unabridged Editions:</strong> Authorized Somali literature and world classics in Web Reader, EPUB, and PDF.</span>
              </li>
            </ul>

            <div className="auth-showcase-trust">
              <ShieldCheck size={16} style={{ color: '#DCE6DC', flexShrink: 0 }} />
              <span>256-bit encrypted sessions • Private collection • Zero tracking</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

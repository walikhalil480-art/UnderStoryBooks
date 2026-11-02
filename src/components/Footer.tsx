import React, { useState } from 'react';
import { PageRoute } from './Navbar';
import { UnderstoryLogo } from './UnderstoryLogo';
import {
  Globe,
  CheckCircle2,
  ArrowRight,
  Send
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute, section?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3500);
    }
  };

  return (
    <footer className="ebaro-footer-root" role="contentinfo" aria-label="Understory Footer">
      <div className="ebaro-footer-inner-wrap">
        <div className="footer-simple-grid">
          {/* Brand & Newsletter Column */}
          <div className="footer-simple-brand">
            <button
              type="button"
              className="footer-simple-logo-btn"
              onClick={() => onNavigate('home')}
              aria-label="Understory Home"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <UnderstoryLogo variant="full" height={32} />
            </button>

            <p className="footer-simple-tagline">
              A curated digital library dedicated to world classics, timeless monographs, and cultural literature.
            </p>

            <div className="footer-simple-newsletter">
              <span className="footer-simple-newsletter-label">Newsletter</span>
              {isSubscribed ? (
                <div className="footer-simple-subscribed">
                  <CheckCircle2 size={16} />
                  <span>Subscribed! Thank you for joining.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-simple-newsletter-row">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="footer-simple-newsletter-input"
                    aria-label="Email address for newsletter"
                  />
                  <button type="submit" className="footer-simple-newsletter-btn">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Library */}
          <div className="footer-simple-col">
            <h4 className="footer-simple-heading">Library</h4>
            <ul className="footer-simple-links">
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('somali-books')}
                >
                  Somali Literature
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('explore')}
                >
                  World Classics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('free-books')}
                >
                  Free Editions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('collections')}
                >
                  Curated Collections
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Discover */}
          <div className="footer-simple-col">
            <h4 className="footer-simple-heading">Discover</h4>
            <ul className="footer-simple-links">
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('categories')}
                >
                  Subject Categories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('authors')}
                >
                  Authors &amp; Poets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('author-submissions')}
                >
                  Author &amp; Publisher Submissions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('my-library')}
                >
                  Personal Shelf
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div className="footer-simple-col">
            <h4 className="footer-simple-heading">Platform</h4>
            <ul className="footer-simple-links">
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('author-submissions')}
                >
                  Author Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('about')}
                >
                  About Understory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('about', 'licensing')}
                >
                  Licensing &amp; Rights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('about', 'privacy')}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-simple-link-btn"
                  onClick={() => onNavigate('about', 'terms')}
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-simple-bottom">
          <span>&copy; {new Date().getFullYear()} Understory. All rights reserved.</span>
          <div className="footer-simple-lang">
            <Globe size={14} />
            <span>Af-Soomaali • English • العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

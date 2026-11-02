import React, { useEffect } from 'react';
import { BookOpen, ShieldCheck, Compass, HelpCircle, Mail } from 'lucide-react';
import { BOOKS, CATEGORIES } from '../data/books';
import { EditorialImage } from '../components/EditorialImage';
import { PageRoute } from '../components/Navbar';
import { IMAGE_REGISTRY } from '../data/imageRegistry';

interface AboutPageProps {
  focusSection?: string;
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ focusSection, onNavigate }) => {
  useEffect(() => {
    if (focusSection) {
      const el = document.getElementById(focusSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [focusSection]);

  const heroAsset = IMAGE_REGISTRY['about-page-hero'];
  const pavilionAsset = IMAGE_REGISTRY['about-page-pavilion'];

  return (
    <div className="about-page">
      <section className="page-editorial-hero">
        <div className="container page-editorial-hero-grid">
          <div className="page-editorial-copy">
            <span className="section-eyebrow">ABOUT UNDERSTORY DIGITAL PLATFORM</span>
            <h1 className="explore-page-title">
              A World of Stories. A Sanctuary for Literature.
            </h1>
            <p className="explore-page-description">
              Understory combines the quiet beauty of a curated digital library with verified classical editions, cultural literature, and synchronized reading experiences for readers of all ages.
            </p>
          </div>
          <div className="page-editorial-banner-photo">
            <EditorialImage
              src={heroAsset.url}
              alt={heroAsset.alt}
              subjectType={heroAsset.subjectType}
              aspectRatio="landscape"
              priority={true}
            />
          </div>
        </div>
      </section>

      <div className="container about-content-stack">
        {/* Editorial Mission */}
        <section id="editorial-standards" className="about-two-col">
          <div className="about-text-col">
            <span className="section-eyebrow">OUR DESIGN &amp; PUBLISHING PHILOSOPHY</span>
            <h2 className="about-section-heading">
              Why the Atmosphere of a Great Library Belongs on Modern Screens
            </h2>
            <p>
              Digital reading platforms too often treat books as interchangeable commodities inside sterile grids—stripping away the tactile warmth of cloth bindings, oak bookshelves, and curated reading rooms.
            </p>
            <p>
              Every edition in the Understory catalogue ({BOOKS.length} curated volumes across {CATEGORIES.length} disciplines) is presented with verified bibliographic provenance, archival cover art, and a dedicated Web Reader that lets you adjust type size, paper tone, and reading progress without distraction.
            </p>

            <div className="about-pillars-grid">
              <div className="about-pillar">
                <BookOpen size={20} className="pillar-icon" />
                <h3>Verified Texts</h3>
                <p>
                  Public domain works are reproduced unabridged from authoritative historical editions; contemporary copyrighted works feature clearly labeled sample excerpts or honest metadata-only records.
                </p>
              </div>
              <div className="about-pillar">
                <Compass size={20} className="pillar-icon" />
                <h3>Open Bibliographic Links</h3>
                <p>
                  Every book details page links directly to its corresponding Open Library Work record, Project Gutenberg edition, and ISBN-13 identifier.
                </p>
              </div>
              <div className="about-pillar">
                <ShieldCheck size={20} className="pillar-icon" />
                <h3>Protected Member Library</h3>
                <p>
                  Your reading progress, personal shelves, and bookmarks are securely persisted in your Understory account database with salted password encryption.
                </p>
              </div>
            </div>
          </div>

          <div className="about-photo-col">
            <EditorialImage
              src={pavilionAsset.url}
              alt={pavilionAsset.alt}
              subjectType={pavilionAsset.subjectType}
              aspectRatio="portrait"
            />
            <p className="about-photo-caption">
              Understory Reading Pavilion — Bridging traditional library architecture and 2026 digital typography.
            </p>
          </div>
        </section>

        {/* Help Centre & FAQs */}
        <section id="help-centre" className="about-faq-section">
          <div id="faqs" className="section-header-row">
            <div>
              <span className="section-eyebrow">SUPPORT &amp; READER GUIDE</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
          </div>

          <div id="reader-guide" className="faq-grid">
            <div className="faq-item">
              <h3>
                <HelpCircle size={16} /> How do I read a book in the Understory Web Reader?
              </h3>
              <p>
                Click any book cover to open its Details page, or click <strong>Start Reading</strong> / <strong>Read</strong> on any card. Inside the Web Reader, use the top bar to switch between Warm Ivory, Crisp Paper, and Dark themes, adjust font size (`A-` to `A++`), or open the Table of Contents drawer.
              </p>
            </div>

            <div className="faq-item">
              <h3>
                <HelpCircle size={16} /> Which books are free in full vs. sample previews?
              </h3>
              <p>
                All works published in the public domain—such as Jane Austen’s <em>Pride and Prejudice</em>, Marcus Aurelius’s <em>Meditations</em>, Virginia Woolf’s <em>Mrs Dalloway</em>, and Charles Darwin’s <em>On the Origin of Species</em>—are marked <strong>Free Edition</strong>. Modern works under copyright display a clearly labeled opening chapter preview.
              </p>
            </div>

            <div className="faq-item">
              <h3>
                <HelpCircle size={16} /> How does the Reading List &amp; Bookmark feature work?
              </h3>
              <p>
                Clicking the bookmark icon on any book card, details page, or inside the Web Reader saves that book to your personal Reading List in your browser’s <code>localStorage</code>. You can access your saved books anytime from the bookmark icon in the navigation bar.
              </p>
            </div>

            <div className="faq-item">
              <h3>
                <HelpCircle size={16} /> Where do the book covers and library photographs come from?
              </h3>
              <p>
                Book cover artwork is retrieved from the Open Library Covers repository by verified cover ID and ISBN. Historical author portraits come from the National Portrait Gallery and Library of Congress public domain archives via Wikimedia Commons, and library photography is sourced from Unsplash.
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Legal */}
        <section className="about-bottom-grid">
          <div id="contact" className="about-card-box">
            <span className="section-eyebrow">EDITORIAL OFFICE</span>
            <h2>
              <Mail size={18} /> Contact &amp; Submissions
            </h2>
            <p>
              For inquiries regarding public-domain text corrections, typographic errata, or institutional reading room partnerships:
            </p>
            <ul className="about-contact-list">
              <li>
                <strong>Editorial Desk:</strong> hello@understory.org
              </li>
              <li>
                <strong>Archival Errata:</strong> errata@understory.org
              </li>
              <li>
                <strong>Catalogue Scope:</strong>{' '}
                <button
                  type="button"
                  className="btn-editorial-link"
                  onClick={() => onNavigate('explore')}
                >
                  Browse All {BOOKS.length} Editions
                </button>
              </li>
            </ul>
          </div>

          <div id="privacy" className="about-card-box">
            <span id="terms" className="section-eyebrow">LEGAL &amp; LICENSING</span>
            <h2 id="licensing">Privacy Policy, Terms &amp; Copyright</h2>
            <p>
              <strong>Privacy Policy:</strong> This application operates entirely client-side. Reading preferences, theme selections, and bookmarks are persisted only in your local browser storage.
            </p>
            <p>
              <strong>Copyright &amp; Licensing:</strong> Public-domain texts are free of known copyright restrictions. Contemporary titles are presented with brief educational/preview excerpts and full bibliographic attribution to their respective publishers. Photography is sourced from Unsplash under the Unsplash License.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('src/index.css');

const ebaroCss = `

/* ============================================================================
   eBaro — 2026 DESIGN SYSTEM COMPONENTS & LAYOUT
   Strict adherence to 2026 premium editorial guidelines:
   - Solid, rich palette (Ivory, Forest Green, Emerald, Sand, Charcoal, Gold, Terracotta)
   - Zero gradients, zero neon, zero glassmorphism
   - Confident serif & readable sans typography
   - Crisp borders & subtle physical elevation
   ============================================================================ */

/* Container & Foundations */
.ebaro-container {
  width: 100%;
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

@media (max-width: 768px) {
  .ebaro-container {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
}

/* Button System */
.ebaro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.45rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid transparent;
  line-height: 1.2;
}

.ebaro-btn--primary {
  background-color: var(--ebaro-forest);
  color: #FFFFFF !important;
  border-color: var(--ebaro-forest);
}

.ebaro-btn--primary:hover {
  background-color: var(--ebaro-forest-dark);
  border-color: var(--ebaro-forest-dark);
}

.ebaro-btn--secondary {
  background-color: var(--ebaro-sand);
  color: var(--ebaro-charcoal) !important;
  border-color: var(--border-dark);
}

.ebaro-btn--secondary:hover {
  background-color: #E5DFD4;
  border-color: var(--ebaro-charcoal);
}

.ebaro-btn--dark {
  background-color: var(--ebaro-charcoal);
  color: #FFFFFF !important;
  border-color: var(--ebaro-charcoal);
}

.ebaro-btn--dark:hover {
  background-color: #111211;
}

.ebaro-btn--outline {
  background-color: transparent;
  color: var(--ebaro-forest) !important;
  border-color: var(--ebaro-forest);
}

.ebaro-btn--outline:hover {
  background-color: var(--ebaro-emerald-light);
}

.ebaro-btn--text {
  background: none;
  border: none;
  color: var(--ebaro-forest) !important;
  padding: 0.4rem 0.5rem;
  font-weight: 600;
}

.ebaro-btn--text:hover {
  text-decoration: underline;
}

.ebaro-btn--sm {
  padding: 0.45rem 0.9rem;
  font-size: 0.84rem;
}

/* ============================================================================
   eBaro Header / Navbar
   ============================================================================ */
.ebaro-navbar {
  background-color: var(--ebaro-ivory);
  border-bottom: 1px solid var(--border-grey);
  position: sticky;
  top: 0;
  z-index: 200;
  box-shadow: 0 1px 3px rgba(28, 56, 41, 0.04);
}

.ebaro-nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.ebaro-brand-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: var(--ebaro-charcoal);
  flex-shrink: 0;
}

.ebaro-brand-text {
  display: flex;
  flex-direction: column;
}

.ebaro-brand-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  line-height: 1;
  letter-spacing: -0.01em;
}

.ebaro-brand-tagline {
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ebaro-gold);
  font-weight: 600;
  margin-top: 2px;
}

.ebaro-nav-links {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.ebaro-nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ebaro-charcoal);
  text-decoration: none;
  padding: 0.5rem 0.15rem;
  position: relative;
  transition: color 0.15s ease;
}

.ebaro-nav-link:hover,
.ebaro-nav-link--active {
  color: var(--ebaro-forest);
  font-weight: 600;
}

.ebaro-nav-link--active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--ebaro-forest);
}

.ebaro-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.ebaro-nav-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-grey);
  background-color: #FFFFFF;
  color: var(--ebaro-charcoal);
  transition: all 0.15s ease;
}

.ebaro-nav-search-btn:hover {
  border-color: var(--ebaro-forest);
  color: var(--ebaro-forest);
}

.ebaro-user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--border-grey);
  border-radius: var(--radius-sm);
  background-color: #FFFFFF;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--ebaro-charcoal);
}

.ebaro-user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: var(--ebaro-forest);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.ebaro-user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #FFFFFF;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  min-width: 220px;
  padding: 0.5rem 0;
  z-index: 1000;
}

.ebaro-user-dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-grey);
}

.ebaro-user-dropdown-header strong {
  display: block;
  font-size: 0.92rem;
  color: var(--ebaro-charcoal);
}

.ebaro-user-dropdown-header span {
  font-size: 0.8rem;
  color: var(--ebaro-muted);
}

.ebaro-user-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.88rem;
  color: var(--ebaro-charcoal);
  text-align: left;
  transition: background-color 0.15s ease;
}

.ebaro-user-dropdown-item:hover {
  background-color: var(--ebaro-sand-light);
  color: var(--ebaro-forest);
}

.ebaro-mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-grey);
  border-radius: var(--radius-sm);
  background: #FFFFFF;
  color: var(--ebaro-charcoal);
}

.ebaro-mobile-drawer {
  background-color: var(--ebaro-ivory);
  border-bottom: 1px solid var(--border-grey);
  padding: 1.5rem 1.25rem;
}

.ebaro-mobile-drawer__links {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.ebaro-mobile-drawer__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-grey);
}

/* ============================================================================
   eBaro Hero Section
   ============================================================================ */
.ebaro-hero {
  padding: 4rem 0 5rem;
  background-color: var(--ebaro-ivory);
  border-bottom: 1px solid var(--border-grey);
}

.ebaro-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 4rem;
  align-items: center;
}

.ebaro-kicker-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--ebaro-sand);
  color: var(--ebaro-forest);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-grey);
  margin-bottom: 1.25rem;
}

.ebaro-hero-headline {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.12;
  color: var(--ebaro-forest);
  margin-bottom: 1.25rem;
  letter-spacing: -0.015em;
}

.ebaro-hero-headline span {
  color: var(--ebaro-gold);
  font-style: italic;
  display: block;
}

.ebaro-hero-lead {
  font-size: 1.18rem;
  line-height: 1.65;
  color: var(--ebaro-charcoal);
  margin-bottom: 2rem;
  max-width: 580px;
}

.ebaro-hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.ebaro-hero-search {
  margin-bottom: 2.25rem;
}

.ebaro-search-input-wrap {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 1.5px solid var(--border-dark);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.5rem 0.35rem 1rem;
  box-shadow: var(--shadow-subtle);
  max-width: 520px;
  transition: border-color 0.15s ease;
}

.ebaro-search-input-wrap:focus-within {
  border-color: var(--ebaro-forest);
}

.ebaro-search-icon {
  color: var(--ebaro-muted);
  margin-right: 0.65rem;
  flex-shrink: 0;
}

.ebaro-search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  background: transparent;
  color: var(--ebaro-charcoal);
}

.ebaro-search-input::placeholder {
  color: var(--ebaro-muted);
}

.ebaro-hero-trust {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-grey);
}

.ebaro-trust-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ebaro-muted);
}

.ebaro-trust-item svg {
  color: var(--ebaro-emerald);
  flex-shrink: 0;
}

/* Hero Picture-Book Artwork Focal Point */
.ebaro-hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.ebaro-hero-frame {
  position: relative;
  width: 100%;
  max-width: 480px;
  background-color: var(--ebaro-sand);
  padding: 12px;
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-card);
  border-radius: var(--radius-sm);
}

.ebaro-hero-frame__inner {
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  aspect-ratio: 4 / 3.2;
  background-color: var(--ebaro-forest-dark);
}

.ebaro-hero-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ebaro-hero-overlay-card {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(28, 56, 41, 0.94);
  color: #FFFFFF;
  padding: 1.1rem 1.35rem;
}

.ebaro-hero-overlay-card strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: #FFFFFF;
  margin-bottom: 0.15rem;
}

.ebaro-hero-overlay-card span {
  font-size: 0.82rem;
  color: var(--ebaro-sand);
  opacity: 0.9;
}

.ebaro-hero-floating-stat {
  position: absolute;
  bottom: -22px;
  right: -15px;
  background: #FFFFFF;
  border: 1px solid var(--border-dark);
  padding: 0.9rem 1.35rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ebaro-stat-value {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  line-height: 1;
}

.ebaro-stat-label {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ebaro-muted);
  font-weight: 600;
  margin-top: 0.25rem;
}

/* ============================================================================
   Sections, Headers & Spacing
   ============================================================================ */
.ebaro-section {
  padding: 5rem 0;
}

.ebaro-section--sand {
  background-color: var(--ebaro-sand);
  border-top: 1px solid var(--border-grey);
  border-bottom: 1px solid var(--border-grey);
}

.ebaro-section--dark {
  background-color: var(--ebaro-forest);
  color: #FFFFFF;
}

.ebaro-section-header {
  margin-bottom: 3rem;
}

.ebaro-section-header--center {
  text-align: center;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.ebaro-section-header--split {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.ebaro-section-kicker {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ebaro-emerald);
  margin-bottom: 0.5rem;
}

.ebaro-section-title {
  font-family: var(--font-display);
  font-size: 2.45rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  line-height: 1.2;
  margin-bottom: 0.65rem;
}

.ebaro-section--dark .ebaro-section-title {
  color: #FFFFFF;
}

.ebaro-section-subtitle {
  font-size: 1.05rem;
  color: var(--ebaro-muted);
  line-height: 1.6;
  max-width: 650px;
}

.ebaro-section--dark .ebaro-section-subtitle {
  color: var(--ebaro-sand);
  opacity: 0.9;
}

/* ============================================================================
   Continue Learning Banner
   ============================================================================ */
.ebaro-continue-section {
  padding: 1.25rem 0;
  background-color: var(--ebaro-sand-light);
  border-bottom: 1px solid var(--border-grey);
}

.ebaro-continue-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.ebaro-continue-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ebaro-forest);
}

.ebaro-continue-stats {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.ebaro-stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: var(--ebaro-charcoal);
  background: #FFFFFF;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-grey);
}

.ebaro-stat-pill strong {
  color: var(--ebaro-forest);
}

/* ============================================================================
   Spotlight Card (Featured Story)
   ============================================================================ */
.ebaro-spotlight-card {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  background: #FFFFFF;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.ebaro-spotlight-media {
  position: relative;
  min-height: 380px;
  background-color: var(--ebaro-forest);
}

.ebaro-spotlight-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ebaro-spotlight-badge {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: var(--ebaro-forest);
  color: #FFFFFF;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
}

.ebaro-spotlight-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ebaro-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: var(--ebaro-muted);
  font-weight: 500;
  margin-bottom: 0.85rem;
}

.ebaro-spotlight-title {
  font-family: var(--font-display);
  font-size: 2.35rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.ebaro-spotlight-eng {
  font-size: 1.1rem;
  color: var(--ebaro-muted);
  font-style: italic;
  margin-bottom: 1.25rem;
}

.ebaro-spotlight-summary {
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--ebaro-charcoal);
  margin-bottom: 1.5rem;
}

.ebaro-vocab-preview {
  margin-bottom: 2rem;
  padding: 1.15rem;
  background-color: var(--ebaro-sand-light);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-grey);
}

.ebaro-vocab-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ebaro-forest);
  margin-bottom: 0.75rem;
}

.ebaro-vocab-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ebaro-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  background: #FFFFFF;
  border: 1px solid var(--border-grey);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.ebaro-chip strong {
  color: var(--ebaro-forest);
  font-weight: 600;
}

.ebaro-chip span {
  color: var(--ebaro-muted);
  font-size: 0.78rem;
}

.ebaro-spotlight-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ============================================================================
   Level Tabs & Stories Grid
   ============================================================================ */
.ebaro-level-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.75rem;
  border-bottom: 2px solid var(--border-grey);
}

.ebaro-level-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 1.75rem;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  transition: all 0.15s ease;
  text-align: left;
}

.ebaro-level-tab.is-active {
  border-bottom-color: var(--ebaro-forest);
  background-color: var(--ebaro-sand-light);
}

.ebaro-tab-label {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ebaro-forest);
}

.ebaro-tab-sub {
  font-size: 0.82rem;
  color: var(--ebaro-muted);
  margin-top: 0.2rem;
}

.ebaro-stories-showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2.75rem;
}

.ebaro-story-card {
  background: #FFFFFF;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.ebaro-story-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--ebaro-forest);
}

.ebaro-story-card__cover {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: var(--ebaro-sand);
}

.ebaro-story-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ebaro-story-card:hover .ebaro-story-card__cover img {
  transform: scale(1.03);
}

.ebaro-story-card__badge-top {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(28, 56, 41, 0.9);
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
}

.ebaro-story-card__body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.ebaro-story-card__badges {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ebaro-muted);
  margin-bottom: 0.65rem;
}

.ebaro-story-card__title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  line-height: 1.25;
  margin-bottom: 0.25rem;
}

.ebaro-story-card__eng {
  font-size: 0.88rem;
  color: var(--ebaro-muted);
  font-style: italic;
  margin-bottom: 0.85rem;
}

.ebaro-story-card__desc {
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--ebaro-charcoal);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ebaro-story-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-grey);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ebaro-forest);
}

/* ============================================================================
   Popular Stories Showcase
   ============================================================================ */
.ebaro-popular-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.ebaro-popular-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #FFFFFF;
  border: 1px solid var(--border-grey);
  padding: 1.25rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.ebaro-popular-item:hover {
  border-color: var(--ebaro-forest);
  box-shadow: var(--shadow-subtle);
}

.ebaro-popular-rank {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--ebaro-gold);
  line-height: 1;
  min-width: 2.2rem;
}

.ebaro-popular-cover {
  width: 68px;
  height: 68px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--ebaro-sand);
  border: 1px solid var(--border-grey);
}

.ebaro-popular-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ebaro-popular-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ebaro-popular-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ebaro-popular-meta {
  font-size: 0.8rem;
  color: var(--ebaro-muted);
}

/* ============================================================================
   Audio Reader Showcase (Listen & Read)
   ============================================================================ */
.ebaro-audio-showcase-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.ebaro-feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2.25rem;
}

.ebaro-feature-point {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.ebaro-feature-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  background-color: var(--ebaro-emerald-light);
  color: var(--ebaro-emerald);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ebaro-feature-point strong {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  margin-bottom: 0.25rem;
}

.ebaro-feature-point p {
  font-size: 0.9rem;
  color: var(--ebaro-charcoal);
  line-height: 1.55;
  opacity: 0.9;
}

.ebaro-audio-mockup-card {
  background: #FFFFFF;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  padding: 2.25rem;
  box-shadow: var(--shadow-card);
}

.ebaro-mockup-player-bar {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.1rem 1.35rem;
  background: var(--ebaro-sand-light);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-grey);
  margin-bottom: 2rem;
}

.ebaro-mockup-play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--ebaro-forest);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ebaro-mockup-track {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.ebaro-mockup-bar {
  height: 6px;
  background-color: var(--border-grey);
  border-radius: 3px;
  position: relative;
  margin-bottom: 0.45rem;
  overflow: hidden;
}

.ebaro-mockup-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--ebaro-forest);
  border-radius: 3px;
}

.ebaro-mockup-time {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--ebaro-muted);
  font-weight: 600;
}

.ebaro-mockup-karaoke {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--ebaro-ivory);
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--ebaro-forest);
}

.ebaro-mockup-sentence {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
}

.ebaro-karaoke-word {
  font-family: var(--font-reading);
  font-size: 1.55rem;
  color: var(--ebaro-charcoal);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.ebaro-karaoke-word--active {
  background-color: var(--ebaro-gold-light);
  color: var(--ebaro-forest);
  border-bottom: 2.5px solid var(--ebaro-gold);
  font-weight: 600;
}

.ebaro-karaoke-translation {
  font-size: 0.95rem;
  color: var(--ebaro-muted);
  font-style: italic;
}

.ebaro-phonetic-guide {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-grey);
}

.ebaro-phonetic-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ebaro-forest);
}

.ebaro-phonetic-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ebaro-phonetic-chip {
  font-size: 0.82rem;
  background: #FFFFFF;
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--border-grey);
  border-radius: var(--radius-sm);
  color: var(--ebaro-charcoal);
}

.ebaro-phonetic-chip strong {
  color: var(--ebaro-terracotta);
  font-weight: 700;
  margin-right: 0.25rem;
}

/* ============================================================================
   Interactive Exercises (8 Question Types)
   ============================================================================ */
.ebaro-exercise-types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.ebaro-exercise-card {
  background: #FFFFFF;
  border: 1px solid var(--border-grey);
  border-radius: var(--radius-sm);
  padding: 1.75rem 1.5rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.ebaro-exercise-card:hover {
  transform: translateY(-3px);
  border-color: var(--ebaro-forest);
  box-shadow: var(--shadow-card);
}

.ebaro-exercise-card__icon {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  background-color: var(--ebaro-sand);
  color: var(--ebaro-forest);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.ebaro-exercise-card__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  margin-bottom: 0.2rem;
}

.ebaro-exercise-card__sub {
  font-size: 0.78rem;
  color: var(--ebaro-gold);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.65rem;
}

.ebaro-exercise-card__desc {
  font-size: 0.88rem;
  color: var(--ebaro-muted);
  line-height: 1.5;
}

/* ============================================================================
   For Parents & Educators
   ============================================================================ */
.ebaro-parents-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.ebaro-parents-card {
  background: #FFFFFF;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
}

.ebaro-parents-card__icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-sm);
  background-color: var(--ebaro-emerald-light);
  color: var(--ebaro-emerald);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.ebaro-parents-card__title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ebaro-forest);
  margin-bottom: 0.75rem;
}

.ebaro-parents-card__desc {
  font-size: 0.95rem;
  color: var(--ebaro-charcoal);
  line-height: 1.6;
  margin-bottom: 1.75rem;
}

.ebaro-parents-bullet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-grey);
}

.ebaro-parents-bullet-list li {
  font-size: 0.88rem;
  color: var(--ebaro-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ebaro-parents-bullet-list li::before {
  content: '✓';
  color: var(--ebaro-emerald);
  font-weight: 700;
}

/* ============================================================================
   Strong Final Call to Action Banner
   ============================================================================ */
.ebaro-cta-banner {
  background-color: var(--ebaro-forest);
  color: #FFFFFF;
  border-radius: var(--radius-sm);
  padding: 5rem 3rem;
  text-align: center;
  border: 1px solid var(--ebaro-forest-dark);
  position: relative;
  overflow: hidden;
}

.ebaro-cta-content {
  max-width: 760px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.ebaro-cta-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ebaro-gold);
  margin-bottom: 0.85rem;
  display: block;
}

.ebaro-cta-title {
  font-family: var(--font-display);
  font-size: 2.85rem;
  font-weight: 700;
  line-height: 1.15;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
}

.ebaro-cta-lead {
  font-size: 1.15rem;
  line-height: 1.65;
  color: var(--ebaro-sand);
  opacity: 0.95;
  margin-bottom: 2.5rem;
}

.ebaro-cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}

.ebaro-cta-guarantee {
  font-size: 0.85rem;
  color: var(--ebaro-sand);
  opacity: 0.75;
  font-style: italic;
}

/* ============================================================================
   eBaro Footer
   ============================================================================ */
.ebaro-footer {
  background-color: #15271D;
  color: #E8EDE8;
  padding: 5rem 0 2.5rem;
  border-top: 1px solid #233C2D;
}

.ebaro-footer__container {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.ebaro-footer__brand-col {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.ebaro-footer__desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: #BAC7BC;
  max-width: 340px;
}

.ebaro-footer__safety-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #1C3829;
  border: 1px solid #2B573F;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: #D5E2D7;
  margin-top: 0.5rem;
}

.ebaro-footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.ebaro-footer__col-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.35rem;
  letter-spacing: 0.02em;
}

.ebaro-footer__col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.ebaro-footer__link {
  color: #BAC7BC;
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.15s ease;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  padding: 0;
}

.ebaro-footer__link:hover {
  color: #FFFFFF;
}

.ebaro-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2.25rem;
  border-top: 1px solid #233C2D;
  font-size: 0.84rem;
  color: #8F9E91;
  flex-wrap: wrap;
  gap: 1rem;
}

.ebaro-footer__bottom-links {
  display: flex;
  gap: 1.5rem;
}

.ebaro-footer__bottom-links a {
  color: #8F9E91;
  text-decoration: none;
}

.ebaro-footer__bottom-links a:hover {
  color: #BAC7BC;
}

/* ============================================================================
   Responsive Media Queries
   ============================================================================ */
@media (max-width: 1024px) {
  .ebaro-hero-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .ebaro-spotlight-card {
    grid-template-columns: 1fr;
  }
  .ebaro-spotlight-media {
    min-height: 280px;
  }
  .ebaro-stories-showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .ebaro-popular-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .ebaro-audio-showcase-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .ebaro-exercise-types-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .ebaro-parents-grid {
    grid-template-columns: 1fr;
  }
  .ebaro-footer__container {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 900px) {
  .ebaro-nav-links {
    display: none;
  }
  .ebaro-mobile-menu-btn {
    display: flex;
  }
}

@media (max-width: 768px) {
  .ebaro-hero-headline {
    font-size: 2.5rem;
  }
  .ebaro-section-title {
    font-size: 1.85rem;
  }
  .ebaro-spotlight-content {
    padding: 1.75rem;
  }
  .ebaro-stories-showcase-grid {
    grid-template-columns: 1fr;
  }
  .ebaro-popular-grid {
    grid-template-columns: 1fr;
  }
  .ebaro-exercise-types-grid {
    grid-template-columns: 1fr;
  }
  .ebaro-cta-banner {
    padding: 3.5rem 1.5rem;
  }
  .ebaro-cta-title {
    font-size: 2rem;
  }
  .ebaro-footer__container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
`;

fs.appendFileSync(cssPath, ebaroCss, 'utf-8');
console.log('Successfully appended eBaro CSS styles to src/index.css');

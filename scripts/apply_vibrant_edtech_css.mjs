import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('src/index.css');
const content = fs.readFileSync(cssPath, 'utf-8');

const marker = '/* ============================================================================\n   eBaro — 2026 DESIGN SYSTEM COMPONENTS & LAYOUT';
const markerIndex = content.indexOf(marker);

if (markerIndex === -1) {
  console.error('Marker not found in index.css');
  process.exit(1);
}

const baseCss = content.slice(0, markerIndex);

const vibrantEdTechCss = `/* ============================================================================
   eBaro — MODERN PLAYFUL & VIBRANT EDTECH DESIGN SYSTEM (2026)
   Inspired by Duolingo, Khan Academy Kids, and Headspace:
   - Clean, bright white & soft cloud backgrounds (#FFFFFF & #F8FAFC)
   - Energetic emerald green (#059669), sunny amber (#F59E0B), sky cyan (#0EA5E9)
   - Friendly rounded containers (14px-22px radius, pill badges)
   - Tactile 3D press buttons with micro-interactions
   - Clean, razor-sharp modern typography (Plus Jakarta Sans)
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

/* ============================================================================
   Tactile EdTech Button System (Playful 3D Press Effect)
   ============================================================================ */
.ebaro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: var(--font-sans);
  font-size: 0.98rem;
  font-weight: 700;
  padding: 0.85rem 1.6rem;
  border-radius: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.15s ease;
  border: none;
  line-height: 1.2;
  user-select: none;
}

.ebaro-btn--primary {
  background-color: #059669;
  color: #FFFFFF !important;
  box-shadow: 0 4px 0 #047857, 0 8px 16px rgba(5, 150, 105, 0.2);
}

.ebaro-btn--primary:hover {
  background-color: #10B981;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #047857, 0 12px 20px rgba(5, 150, 105, 0.25);
}

.ebaro-btn--primary:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #047857;
}

.ebaro-btn--secondary {
  background-color: #FFFFFF;
  color: #0F172A !important;
  border: 2px solid #E2E8F0;
  box-shadow: 0 4px 0 #CBD5E1;
}

.ebaro-btn--secondary:hover {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #CBD5E1;
}

.ebaro-btn--secondary:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #CBD5E1;
}

.ebaro-btn--dark {
  background-color: #0F172A;
  color: #FFFFFF !important;
  box-shadow: 0 4px 0 #020617;
}

.ebaro-btn--dark:hover {
  background-color: #1E293B;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #020617;
}

.ebaro-btn--dark:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #020617;
}

.ebaro-btn--outline {
  background-color: #ECFDF5;
  color: #059669 !important;
  border: 2px solid #A7F3D0;
  box-shadow: 0 3px 0 #6EE7B7;
}

.ebaro-btn--outline:hover {
  background-color: #D1FAE5;
  transform: translateY(-1px);
}

.ebaro-btn--outline:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #6EE7B7;
}

.ebaro-btn--text {
  background: none;
  border: none;
  color: #059669 !important;
  padding: 0.5rem 0.8rem;
  font-weight: 700;
  border-radius: 10px;
}

.ebaro-btn--text:hover {
  background-color: #ECFDF5;
}

.ebaro-btn--sm {
  padding: 0.55rem 1.1rem;
  font-size: 0.88rem;
  border-radius: 11px;
}

/* ============================================================================
   eBaro Header / Navbar (Clean, Glass-Tinged Modern EdTech)
   ============================================================================ */
.ebaro-navbar {
  background-color: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid #F1F5F9;
  position: sticky;
  top: 0;
  z-index: 200;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
}

.ebaro-nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
}

.ebaro-brand-link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  text-decoration: none;
  color: #0F172A;
  flex-shrink: 0;
}

.ebaro-brand-text {
  display: flex;
  flex-direction: column;
}

.ebaro-brand-title {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1;
  letter-spacing: -0.02em;
}

.ebaro-brand-title span {
  color: #059669;
}

.ebaro-brand-tagline {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #059669;
  font-weight: 700;
  background-color: #ECFDF5;
  padding: 1px 7px;
  border-radius: 9999px;
  margin-top: 3px;
  width: fit-content;
}

.ebaro-nav-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ebaro-nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  padding: 0.55rem 0.95rem;
  border-radius: 12px;
  transition: all 0.15s ease;
}

.ebaro-nav-link:hover {
  color: #059669;
  background-color: #F0FDF4;
}

.ebaro-nav-link--active {
  color: #059669;
  background-color: #ECFDF5;
  font-weight: 700;
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 2px solid #E2E8F0;
  background-color: #FFFFFF;
  color: #475569;
  transition: all 0.15s ease;
}

.ebaro-nav-search-btn:hover {
  border-color: #10B981;
  color: #059669;
  background-color: #F0FDF4;
}

.ebaro-user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.9rem;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  background-color: #FFFFFF;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0F172A;
  transition: border-color 0.15s ease;
}

.ebaro-user-menu-btn:hover {
  border-color: #CBD5E1;
}

.ebaro-user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #059669;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
}

.ebaro-user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  min-width: 230px;
  padding: 0.6rem 0;
  z-index: 1000;
}

.ebaro-user-dropdown-header {
  padding: 0.85rem 1.15rem;
  border-bottom: 1px solid #F1F5F9;
}

.ebaro-user-dropdown-header strong {
  display: block;
  font-size: 0.94rem;
  color: #0F172A;
}

.ebaro-user-dropdown-header span {
  font-size: 0.8rem;
  color: #64748B;
}

.ebaro-user-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 1.15rem;
  font-size: 0.9rem;
  color: #334155;
  text-align: left;
  transition: background-color 0.15s ease;
}

.ebaro-user-dropdown-item:hover {
  background-color: #ECFDF5;
  color: #059669;
}

.ebaro-mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  background: #FFFFFF;
  color: #0F172A;
}

.ebaro-mobile-drawer {
  background-color: #FFFFFF;
  border-bottom: 2px solid #E2E8F0;
  padding: 1.5rem 1.25rem;
}

.ebaro-mobile-drawer__links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.ebaro-mobile-drawer__actions {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-top: 1rem;
  border-top: 2px solid #F1F5F9;
}

/* ============================================================================
   eBaro Hero Section (Bright, Cheerful, Welcoming)
   ============================================================================ */
.ebaro-hero {
  padding: 4.5rem 0 5.5rem;
  background-color: #FFFFFF;
  border-bottom: 2px solid #F1F5F9;
  position: relative;
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
  gap: 0.55rem;
  background-color: #ECFDF5;
  color: #047857;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  border: 2px solid #A7F3D0;
  margin-bottom: 1.5rem;
}

.ebaro-hero-headline {
  font-family: var(--font-display);
  font-size: 3.75rem;
  font-weight: 800;
  line-height: 1.12;
  color: #0F172A;
  margin-bottom: 1.35rem;
  letter-spacing: -0.025em;
}

.ebaro-hero-headline span {
  color: #059669;
  display: block;
}

.ebaro-hero-lead {
  font-size: 1.2rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
  max-width: 580px;
  font-weight: 450;
}

.ebaro-hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.25rem;
}

.ebaro-hero-search {
  margin-bottom: 2.25rem;
}

.ebaro-search-input-wrap {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 9999px;
  padding: 0.4rem 0.6rem 0.4rem 1.35rem;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
  max-width: 520px;
  transition: all 0.2s ease;
}

.ebaro-search-input-wrap:focus-within {
  border-color: #10B981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
}

.ebaro-search-icon {
  color: #94A3B8;
  margin-right: 0.65rem;
  flex-shrink: 0;
}

.ebaro-search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.96rem;
  background: transparent;
  color: #0F172A;
  font-weight: 500;
}

.ebaro-search-input::placeholder {
  color: #94A3B8;
}

.ebaro-search-submit {
  border-radius: 9999px !important;
  padding: 0.6rem 1.4rem !important;
}

.ebaro-hero-trust {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 2px solid #F1F5F9;
}

.ebaro-trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #64748B;
}

.ebaro-trust-item svg {
  color: #059669;
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
  max-width: 490px;
  background-color: #FFFFFF;
  padding: 14px;
  border: 2px solid #E2E8F0;
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12);
  border-radius: 24px;
}

.ebaro-hero-frame__inner {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  aspect-ratio: 4 / 3.2;
  background-color: #047857;
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
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.92) 80%);
  color: #FFFFFF;
  padding: 2rem 1.5rem 1.25rem;
}

.ebaro-hero-overlay-card strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.2rem;
}

.ebaro-hero-overlay-card span {
  font-size: 0.85rem;
  color: #E2E8F0;
}

.ebaro-hero-floating-stat {
  position: absolute;
  bottom: -22px;
  right: -15px;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  padding: 1rem 1.5rem;
  border-radius: 18px;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ebaro-stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: #059669;
  line-height: 1;
}

.ebaro-stat-label {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748B;
  font-weight: 700;
  margin-top: 0.35rem;
}

/* ============================================================================
   Sections, Headers & Spacing
   ============================================================================ */
.ebaro-section {
  padding: 5.5rem 0;
}

.ebaro-section--sand {
  background-color: #F8FAFC;
  border-top: 2px solid #F1F5F9;
  border-bottom: 2px solid #F1F5F9;
}

.ebaro-section--dark {
  background-color: #0F172A;
  color: #FFFFFF;
}

.ebaro-section-header {
  margin-bottom: 3.25rem;
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
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #059669;
  background-color: #ECFDF5;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.ebaro-section-title {
  font-family: var(--font-display);
  font-size: 2.65rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.ebaro-section--dark .ebaro-section-title {
  color: #FFFFFF;
}

.ebaro-section-subtitle {
  font-size: 1.1rem;
  color: #64748B;
  line-height: 1.6;
  max-width: 650px;
}

.ebaro-section--dark .ebaro-section-subtitle {
  color: #94A3B8;
}

/* ============================================================================
   Continue Learning Banner (Vibrant Child Progress)
   ============================================================================ */
.ebaro-continue-section {
  padding: 1.25rem 0;
  background-color: #F8FAFC;
  border-bottom: 2px solid #E2E8F0;
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
  gap: 0.65rem;
  font-size: 0.92rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #059669;
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
  gap: 0.55rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: #0F172A;
  background: #FFFFFF;
  padding: 0.5rem 1.15rem;
  border-radius: 9999px;
  border: 2px solid #E2E8F0;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
}

.ebaro-stat-pill strong {
  color: #059669;
  font-weight: 700;
}

/* ============================================================================
   Spotlight Card (Featured Story - Vibrant Showcase)
   ============================================================================ */
.ebaro-spotlight-card {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
}

.ebaro-spotlight-media {
  position: relative;
  min-height: 400px;
  background-color: #ECFDF5;
  margin: 16px;
  border-radius: 20px;
  overflow: hidden;
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
  background: #059669;
  color: #FFFFFF;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  box-shadow: 0 4px 10px rgba(5, 150, 105, 0.3);
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
  font-size: 0.85rem;
  color: #64748B;
  font-weight: 600;
  margin-bottom: 0.85rem;
}

.ebaro-spotlight-title {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
  margin-bottom: 0.25rem;
  letter-spacing: -0.015em;
}

.ebaro-spotlight-eng {
  font-size: 1.15rem;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.ebaro-spotlight-summary {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #334155;
  margin-bottom: 1.75rem;
}

.ebaro-vocab-preview {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background-color: #F8FAFC;
  border-radius: 18px;
  border: 2px solid #E2E8F0;
}

.ebaro-vocab-title {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #059669;
  margin-bottom: 0.75rem;
}

.ebaro-vocab-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.ebaro-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-size: 0.88rem;
}

.ebaro-chip strong {
  color: #059669;
  font-weight: 700;
}

.ebaro-chip span {
  color: #64748B;
  font-size: 0.8rem;
}

.ebaro-spotlight-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

/* ============================================================================
   Level Tabs & Stories Grid (Segmented Pill Switcher)
   ============================================================================ */
.ebaro-level-tabs {
  display: flex;
  gap: 0.85rem;
  margin-bottom: 3rem;
  background-color: #F1F5F9;
  padding: 8px;
  border-radius: 9999px;
  border: 1px solid #E2E8F0;
  width: fit-content;
}

.ebaro-level-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.6rem;
  border-radius: 9999px;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: all 0.2s ease;
  text-align: center;
}

.ebaro-level-tab.is-active {
  background-color: #059669;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.ebaro-level-tab.is-active .ebaro-tab-label {
  color: #FFFFFF;
}

.ebaro-level-tab.is-active .ebaro-tab-sub {
  color: #D1FAE5;
}

.ebaro-tab-label {
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 800;
  color: #334155;
  transition: color 0.15s ease;
}

.ebaro-tab-sub {
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748B;
  margin-top: 1px;
  transition: color 0.15s ease;
}

.ebaro-stories-showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.ebaro-story-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.ebaro-story-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 32px rgba(5, 150, 105, 0.14);
  border-color: #10B981;
}

.ebaro-story-card__cover {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #F8FAFC;
}

.ebaro-story-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ebaro-story-card:hover .ebaro-story-card__cover img {
  transform: scale(1.04);
}

.ebaro-story-card__badge-top {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  background: rgba(15, 23, 42, 0.88);
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  backdrop-filter: blur(4px);
}

.ebaro-story-card__body {
  padding: 1.85rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.ebaro-story-card__badges {
  display: flex;
  gap: 0.5rem;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #059669;
  margin-bottom: 0.75rem;
}

.ebaro-story-card__title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.25;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.ebaro-story-card__eng {
  font-size: 0.9rem;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 0.85rem;
}

.ebaro-story-card__desc {
  font-size: 0.94rem;
  line-height: 1.6;
  color: #475569;
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
  border-top: 2px solid #F1F5F9;
  font-size: 0.88rem;
  font-weight: 700;
  color: #059669;
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
  border: 2px solid #E2E8F0;
  padding: 1.35rem;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
}

.ebaro-popular-item:hover {
  border-color: #10B981;
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.07);
}

.ebaro-popular-rank {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: #F59E0B;
  line-height: 1;
  min-width: 2.2rem;
}

.ebaro-popular-cover {
  width: 70px;
  height: 70px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
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
  font-size: 1.15rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ebaro-popular-meta {
  font-size: 0.82rem;
  color: #64748B;
  font-weight: 500;
}

/* ============================================================================
   Audio Reader Showcase (Listen & Read - Vibrant EdTech Demo)
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
  gap: 1.1rem;
  align-items: flex-start;
}

.ebaro-feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background-color: #ECFDF5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #A7F3D0;
}

.ebaro-feature-point strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.ebaro-feature-point p {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
}

.ebaro-audio-mockup-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);
}

.ebaro-mockup-player-bar {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.2rem 1.4rem;
  background: #F8FAFC;
  border-radius: 18px;
  border: 2px solid #E2E8F0;
  margin-bottom: 2rem;
}

.ebaro-mockup-play-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #059669;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 0 #047857;
}

.ebaro-mockup-track {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.ebaro-mockup-bar {
  height: 8px;
  background-color: #E2E8F0;
  border-radius: 9999px;
  position: relative;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.ebaro-mockup-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #059669;
  border-radius: 9999px;
}

.ebaro-mockup-time {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #64748B;
  font-weight: 700;
}

.ebaro-mockup-karaoke {
  margin-bottom: 2rem;
  padding: 1.65rem;
  background: #F8FAFC;
  border-radius: 18px;
  border-left: 5px solid #059669;
}

.ebaro-mockup-sentence {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.ebaro-karaoke-word {
  font-family: var(--font-reading);
  font-size: 1.6rem;
  color: #0F172A;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.ebaro-karaoke-word--active {
  background-color: #FEF3C7;
  color: #92400E;
  border-bottom: 3px solid #F59E0B;
  font-weight: 700;
}

.ebaro-karaoke-translation {
  font-size: 0.98rem;
  color: #64748B;
  font-style: italic;
  font-weight: 500;
}

.ebaro-phonetic-guide {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 2px solid #F1F5F9;
}

.ebaro-phonetic-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #059669;
}

.ebaro-phonetic-chips {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.ebaro-phonetic-chip {
  font-size: 0.85rem;
  background: #FFFFFF;
  padding: 0.4rem 0.8rem;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  color: #0F172A;
  font-weight: 600;
}

.ebaro-phonetic-chip strong {
  color: #F97316;
  font-weight: 800;
  margin-right: 0.3rem;
}

/* ============================================================================
   Interactive Exercises (8 Question Types)
   ============================================================================ */
.ebaro-exercise-types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
}

.ebaro-exercise-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 20px;
  padding: 2rem 1.6rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.ebaro-exercise-card:hover {
  transform: translateY(-4px);
  border-color: #10B981;
  box-shadow: 0 16px 30px rgba(5, 150, 105, 0.12);
}

.ebaro-exercise-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background-color: #ECFDF5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.4rem;
  border: 1px solid #A7F3D0;
}

.ebaro-exercise-card__title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.ebaro-exercise-card__sub {
  font-size: 0.78rem;
  color: #F59E0B;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.ebaro-exercise-card__desc {
  font-size: 0.9rem;
  color: #64748B;
  line-height: 1.55;
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
  border: 2px solid #E2E8F0;
  border-radius: 24px;
  padding: 2.75rem 2.25rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.ebaro-parents-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background-color: #ECFDF5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.6rem;
  border: 1px solid #A7F3D0;
}

.ebaro-parents-card__title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.85rem;
}

.ebaro-parents-card__desc {
  font-size: 0.96rem;
  color: #475569;
  line-height: 1.65;
  margin-bottom: 1.85rem;
}

.ebaro-parents-bullet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: auto;
  padding-top: 1.6rem;
  border-top: 2px solid #F1F5F9;
}

.ebaro-parents-bullet-list li {
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.ebaro-parents-bullet-list li::before {
  content: '✓';
  color: #059669;
  font-weight: 800;
  background: #ECFDF5;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* ============================================================================
   Strong Final Call to Action Banner
   ============================================================================ */
.ebaro-cta-banner {
  background-color: #0F172A;
  color: #FFFFFF;
  border-radius: 28px;
  padding: 5.5rem 3rem;
  text-align: center;
  border: 2px solid #1E293B;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
}

.ebaro-cta-content {
  max-width: 760px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.ebaro-cta-kicker {
  font-size: 0.88rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #F59E0B;
  margin-bottom: 0.95rem;
  display: block;
}

.ebaro-cta-title {
  font-family: var(--font-display);
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  color: #FFFFFF;
  margin-bottom: 1.35rem;
  letter-spacing: -0.02em;
}

.ebaro-cta-lead {
  font-size: 1.2rem;
  line-height: 1.65;
  color: #CBD5E1;
  margin-bottom: 2.75rem;
}

.ebaro-cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.ebaro-cta-guarantee {
  font-size: 0.88rem;
  color: #94A3B8;
}

/* ============================================================================
   eBaro Footer (Modern Slate & Crisp Typography)
   ============================================================================ */
.ebaro-footer {
  background-color: #0F172A;
  color: #E2E8F0;
  padding: 5rem 0 2.5rem;
  border-top: 2px solid #1E293B;
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
  gap: 1.2rem;
}

.ebaro-footer__desc {
  font-size: 0.92rem;
  line-height: 1.65;
  color: #94A3B8;
  max-width: 340px;
}

.ebaro-footer__safety-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: #1E293B;
  border: 1px solid #334155;
  padding: 0.5rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #E2E8F0;
  margin-top: 0.5rem;
  width: fit-content;
}

.ebaro-footer__col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ebaro-footer__col-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 0.35rem;
  letter-spacing: -0.01em;
}

.ebaro-footer__col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ebaro-footer__link {
  color: #94A3B8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.15s ease;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  padding: 0;
}

.ebaro-footer__link:hover {
  color: #10B981;
}

.ebaro-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2.25rem;
  border-top: 1px solid #1E293B;
  font-size: 0.85rem;
  color: #64748B;
  flex-wrap: wrap;
  gap: 1rem;
}

.ebaro-footer__bottom-links {
  display: flex;
  gap: 1.5rem;
}

.ebaro-footer__bottom-links a {
  color: #64748B;
  text-decoration: none;
  transition: color 0.15s ease;
}

.ebaro-footer__bottom-links a:hover {
  color: #94A3B8;
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
    font-size: 2.75rem;
  }
  .ebaro-section-title {
    font-size: 2rem;
  }
  .ebaro-spotlight-content {
    padding: 2rem 1.5rem;
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
    padding: 4rem 1.5rem;
  }
  .ebaro-cta-title {
    font-size: 2.25rem;
  }
  .ebaro-footer__container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
`;

fs.writeFileSync(cssPath, baseCss + vibrantEdTechCss, 'utf-8');
console.log('Successfully updated src/index.css with Modern Playful & Vibrant EdTech Design System!');

import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('src/index.css');
const content = fs.readFileSync(cssPath, 'utf-8');

const marker = '/* ============================================================================\n   eBaro — MODERN PLAYFUL & VIBRANT EDTECH DESIGN SYSTEM (2026)';
const markerIndex = content.indexOf(marker);

if (markerIndex === -1) {
  console.error('Marker not found in index.css');
  process.exit(1);
}

const baseCss = content.slice(0, markerIndex);

const fullVibrantCss = `/* ============================================================================
   eBaro — MODERN PLAYFUL & VIBRANT EDTECH DESIGN SYSTEM (2026)
   Inspired by Duolingo, Khan Academy Kids, and Headspace:
   - Clean, bright white & soft cloud backgrounds (#FFFFFF & #F8FAFC)
   - Energetic emerald green (#059669), sunny amber (#F59E0B), sky cyan (#0EA5E9)
   - Friendly rounded containers (14px-26px radius, pill badges)
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
.button,
.ebaro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: var(--font-sans);
  font-size: 0.98rem;
  font-weight: 700;
  padding: 0.85rem 1.65rem;
  border-radius: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.15s ease;
  border: none;
  line-height: 1.2;
  user-select: none;
}

.button--primary,
.ebaro-btn--primary {
  background-color: #059669;
  color: #FFFFFF !important;
  box-shadow: 0 4px 0 #047857, 0 8px 16px rgba(5, 150, 105, 0.2);
}

.button--primary:hover,
.ebaro-btn--primary:hover {
  background-color: #10B981;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #047857, 0 12px 20px rgba(5, 150, 105, 0.25);
}

.button--primary:active,
.ebaro-btn--primary:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #047857;
}

.button--secondary,
.ebaro-btn--secondary {
  background-color: #FFFFFF;
  color: #0F172A !important;
  border: 2px solid #E2E8F0;
  box-shadow: 0 4px 0 #CBD5E1;
}

.button--secondary:hover,
.ebaro-btn--secondary:hover {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #CBD5E1;
}

.button--secondary:active,
.ebaro-btn--secondary:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #CBD5E1;
}

.button--sm,
.ebaro-btn--sm {
  padding: 0.55rem 1.15rem;
  font-size: 0.88rem;
  border-radius: 11px;
}

.ebaro-btn-hero {
  padding: 0.95rem 1.95rem !important;
  font-size: 1.05rem !important;
}

.ebaro-btn-hero-secondary {
  padding: 0.95rem 1.95rem !important;
  font-size: 1.05rem !important;
}

/* ============================================================================
   eBaro Header / Navbar
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

/* ============================================================================
   eBaro Hero Section (Clean White, Sunny Accents, Friendly Picture Book)
   ============================================================================ */
.ebaro-hero {
  padding: 4.5rem 0 5.5rem;
  background-color: #FFFFFF;
  border-bottom: 2px solid #F1F5F9;
}

.ebaro-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 4rem;
  align-items: center;
}

.ebaro-hero-badge {
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

.ebaro-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.ebaro-hero-headline {
  font-family: var(--font-display);
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 1.12;
  color: #0F172A;
  margin-bottom: 1.35rem;
  letter-spacing: -0.025em;
}

.ebaro-hero-headline-accent {
  color: #059669;
  display: inline-block;
}

.ebaro-hero-lead {
  font-size: 1.22rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
  max-width: 580px;
  font-weight: 450;
}

.ebaro-hero-actions {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.ebaro-hero-search {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 9999px;
  padding: 0.4rem 0.55rem 0.4rem 1.35rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  max-width: 520px;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
}

.ebaro-hero-search:focus-within {
  border-color: #10B981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
}

.ebaro-search-icon {
  color: #94A3B8;
  margin-right: 0.65rem;
  flex-shrink: 0;
}

.ebaro-hero-search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.96rem;
  background: transparent;
  color: #0F172A;
  font-weight: 500;
}

.ebaro-hero-search-btn {
  background-color: #059669;
  color: #FFFFFF;
  border: none;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 3px 0 #047857;
  transition: all 0.15s ease;
}

.ebaro-hero-search-btn:hover {
  background-color: #10B981;
}

.ebaro-hero-search-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #047857;
}

.ebaro-hero-trust-row {
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

/* Picture-Book Visual Frame */
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
  padding: 12px;
  border: 2px solid #E2E8F0;
  border-radius: 26px;
  box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.ebaro-hero-artwork {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 18px;
  display: block;
}

.ebaro-hero-artwork-caption {
  padding: 1.25rem 0.5rem 0.5rem;
}

.ebaro-artwork-caption-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.ebaro-artwork-tag {
  background: #ECFDF5;
  color: #047857;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.ebaro-artwork-lang {
  font-size: 0.8rem;
  color: #64748B;
  font-weight: 600;
}

.ebaro-hero-artwork-caption strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.35rem;
}

.ebaro-hero-artwork-caption p {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
}

/* ============================================================================
   Sections & Shared Header Styles
   ============================================================================ */
.ebaro-section {
  padding: 5.5rem 0;
}

.ebaro-section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.section-eyebrow {
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

.section-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748B;
  line-height: 1.6;
  max-width: 650px;
}

/* ============================================================================
   Continue Learning Banner
   ============================================================================ */
.ebaro-continue-section {
  padding: 1.5rem 0;
  background-color: #F8FAFC;
  border-bottom: 2px solid #E2E8F0;
}

.ebaro-continue-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.ebaro-continue-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #059669;
  margin-bottom: 0.4rem;
}

.ebaro-gold-icon {
  color: #F59E0B;
}

.ebaro-gold-text {
  color: #F59E0B !important;
}

.ebaro-continue-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 1rem;
}

.ebaro-continue-stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.ebaro-progress-stat {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  padding: 0.6rem 1.15rem;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
}

.ebaro-progress-stat span {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748B;
  letter-spacing: 0.04em;
}

.ebaro-progress-stat strong {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
}

/* ============================================================================
   Featured Story Spotlight
   ============================================================================ */
.ebaro-spotlight-card {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  margin-top: 2rem;
}

.ebaro-spotlight-media {
  position: relative;
  min-height: 380px;
  background-color: #F8FAFC;
  margin: 16px;
  border-radius: 20px;
  overflow: hidden;
}

.ebaro-spotlight-img {
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
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.ebaro-spotlight-body {
  padding: 2.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ebaro-spotlight-meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748B;
  margin-bottom: 0.85rem;
}

.ebaro-spotlight-title {
  font-family: var(--font-display);
  font-size: 2.45rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
  margin-bottom: 0.35rem;
  letter-spacing: -0.015em;
}

.ebaro-spotlight-eng-title {
  font-size: 1.15rem;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.ebaro-spotlight-desc {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #334155;
  margin-bottom: 1.75rem;
}

.ebaro-vocab-chips {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1.15rem;
  background-color: #F8FAFC;
  border-radius: 16px;
  border: 2px solid #E2E8F0;
}

.ebaro-vocab-chips-label {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #059669;
  width: 100%;
}

.ebaro-vocab-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 0.88rem;
}

.ebaro-vocab-chip strong {
  color: #059669;
  font-weight: 700;
}

.ebaro-vocab-chip small {
  color: #64748B;
  font-size: 0.8rem;
}

.ebaro-spotlight-actions {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  flex-wrap: wrap;
}

/* ============================================================================
   Reading Levels Tabs & Cards
   ============================================================================ */
.ebaro-levels-section {
  background-color: #F8FAFC;
  border-top: 2px solid #F1F5F9;
  border-bottom: 2px solid #F1F5F9;
}

.ebaro-level-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.ebaro-level-tab-card {
  background: #FFFFFF;
  border: 2.5px solid #E2E8F0;
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.ebaro-level-tab-card:hover {
  transform: translateY(-3px);
  border-color: #A7F3D0;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.ebaro-level-tab-card.is-active {
  border-color: #059669;
  background: #F0FDF4;
  box-shadow: 0 14px 28px rgba(5, 150, 105, 0.15);
}

.ebaro-level-tab-age {
  display: inline-block;
  background: #ECFDF5;
  color: #047857;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.ebaro-level-tab-card.is-active .ebaro-level-tab-age {
  background: #059669;
  color: #FFFFFF;
}

.ebaro-level-tab-name {
  display: block;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.15rem;
}

.ebaro-level-tab-sub {
  display: block;
  font-size: 0.88rem;
  color: #64748B;
  font-weight: 600;
  margin-bottom: 0.65rem;
}

.ebaro-level-tab-summary {
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.5;
}

.ebaro-stories-showcase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.ebaro-story-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.ebaro-story-card:hover {
  transform: translateY(-6px);
  border-color: #10B981;
  box-shadow: 0 20px 35px rgba(5, 150, 105, 0.15);
}

.ebaro-story-card-cover {
  position: relative;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  background: #F8FAFC;
}

.ebaro-story-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ebaro-story-card:hover .ebaro-story-card-img {
  transform: scale(1.05);
}

.ebaro-story-card-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(15, 23, 42, 0.88);
  color: #FFFFFF;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  backdrop-filter: blur(4px);
}

.ebaro-story-card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.ebaro-story-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748B;
  margin-bottom: 0.65rem;
}

.ebaro-story-card-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.25;
  margin-bottom: 0.2rem;
}

.ebaro-story-card-subtitle {
  font-size: 0.88rem;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.ebaro-story-card-excerpt {
  font-size: 0.9rem;
  line-height: 1.55;
  color: #475569;
  margin-bottom: 1.25rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ebaro-story-card-btn {
  width: 100%;
  font-size: 0.88rem !important;
  padding: 0.6rem 1rem !important;
}

/* ============================================================================
   Popular Stories Showcase
   ============================================================================ */
.ebaro-popular-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 2rem;
}

.ebaro-popular-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  padding: 1.15rem;
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

.ebaro-popular-thumb {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #E2E8F0;
}

.ebaro-popular-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ebaro-popular-tag {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #059669;
  margin-bottom: 0.2rem;
}

.ebaro-popular-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ebaro-popular-eng {
  font-size: 0.8rem;
  color: #64748B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ebaro-popular-meta {
  font-size: 0.76rem;
  font-weight: 700;
  color: #64748B;
  margin-top: 0.35rem;
  display: flex;
  gap: 0.4rem;
}

/* ============================================================================
   Audio Reader Showcase (Listen & Read)
   ============================================================================ */
.ebaro-audio-showcase-section {
  background-color: #FFFFFF;
}

.ebaro-audio-showcase-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.ebaro-feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.ebaro-feature-list li {
  display: flex;
  gap: 1rem;
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
  border: 1.5px solid #A7F3D0;
}

.ebaro-feature-list strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.ebaro-feature-list p {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
}

.ebaro-mt-4 {
  margin-top: 2rem !important;
}

.ebaro-audio-mockup-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 26px;
  padding: 2.5rem;
  box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.08);
}

.ebaro-audio-mockup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.ebaro-audio-live-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #ECFDF5;
  color: #047857;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid #A7F3D0;
}

.ebaro-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10B981;
}

.ebaro-audio-speed-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748B;
  background: #F1F5F9;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
}

.ebaro-mockup-sentence-box {
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
  border-left: 5px solid #059669;
  border-radius: 18px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: baseline;
}

.ebaro-mockup-sentence-num {
  font-weight: 800;
  color: #059669;
  font-size: 1.1rem;
}

.ebaro-mockup-text {
  font-family: var(--font-reading);
  font-size: 1.5rem;
  color: #0F172A;
  line-height: 1.6;
}

.ebaro-highlighted-word {
  background-color: #FEF3C7;
  color: #92400E;
  border-bottom: 3px solid #F59E0B;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 8px;
}

.ebaro-mockup-word-popover {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.ebaro-popover-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.4rem;
}

.ebaro-popover-header strong {
  font-size: 1.1rem;
  color: #059669;
}

.ebaro-popover-header span {
  font-size: 0.82rem;
  color: #64748B;
}

.ebaro-mockup-player-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
  border-radius: 18px;
  padding: 1rem 1.4rem;
}

.ebaro-mockup-play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #059669;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 0 #047857;
  flex-shrink: 0;
}

.ebaro-mockup-track {
  height: 8px;
  background-color: #E2E8F0;
  border-radius: 9999px;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.ebaro-mockup-fill {
  height: 100%;
  background-color: #059669;
  border-radius: 9999px;
}

.ebaro-mockup-time {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748B;
}

/* ============================================================================
   Interactive Exercises (8 Question Types)
   ============================================================================ */
.ebaro-exercise-types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.ebaro-exercise-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 20px;
  padding: 1.85rem 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.ebaro-exercise-card:hover {
  transform: translateY(-4px);
  border-color: #10B981;
  box-shadow: 0 16px 30px rgba(5, 150, 105, 0.12);
}

.ebaro-exercise-badge {
  display: inline-block;
  background: #ECFDF5;
  color: #047857;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.ebaro-exercise-card h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.ebaro-exercise-card p {
  font-size: 0.9rem;
  color: #64748B;
  line-height: 1.55;
}

/* ============================================================================
   For Parents & Educators
   ============================================================================ */
.ebaro-parents-section {
  background-color: #F8FAFC;
  border-top: 2px solid #F1F5F9;
  border-bottom: 2px solid #F1F5F9;
}

.ebaro-parents-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 4rem;
  align-items: center;
}

.ebaro-parents-highlights {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
}

.ebaro-highlight-item {
  display: flex;
  gap: 1.1rem;
  align-items: flex-start;
}

.ebaro-green-icon {
  color: #059669;
  flex-shrink: 0;
  margin-top: 2px;
}

.ebaro-highlight-item strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.ebaro-highlight-item p {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
}

.ebaro-parents-card {
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 26px;
  padding: 2.75rem 2.25rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
}

.ebaro-parents-card h3 {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.4rem;
}

.ebaro-parents-card p {
  font-size: 0.92rem;
  color: #64748B;
  margin-bottom: 1.5rem;
}

.ebaro-parents-tips {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ebaro-parents-tips li {
  font-size: 0.92rem;
  color: #334155;
  line-height: 1.55;
}

.ebaro-parents-tips strong {
  color: #0F172A;
}

/* ============================================================================
   Strong Final Call to Action Banner
   ============================================================================ */
.ebaro-cta-banner-section {
  padding: 5.5rem 0;
  background-color: #FFFFFF;
}

.ebaro-cta-banner {
  background-color: #0F172A;
  border-radius: 28px;
  padding: 5.5rem 3rem;
  text-align: center;
  border: 2px solid #1E293B;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
}

.ebaro-cta-headline {
  font-family: var(--font-display);
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.ebaro-cta-sub {
  font-size: 1.2rem;
  line-height: 1.65;
  color: #CBD5E1;
  max-width: 680px;
  margin: 0 auto 2.5rem;
}

.ebaro-cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.ebaro-btn-cta-lg {
  padding: 1rem 2.2rem !important;
  font-size: 1.08rem !important;
  border-radius: 16px !important;
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

.ebaro-footer .footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.ebaro-brand-logo {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  margin-bottom: 1.25rem;
}

.ebaro-brand-name {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1;
}

.ebaro-accent-e {
  color: #10B981;
}

.ebaro-brand-sub {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #F59E0B;
  font-weight: 700;
  display: block;
  margin-top: 3px;
}

.footer-brand-description {
  font-size: 0.92rem;
  line-height: 1.65;
  color: #94A3B8;
  max-width: 340px;
  margin-bottom: 1.25rem;
}

.footer-safe-tag {
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
}

.footer-col-heading {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
  letter-spacing: -0.01em;
}

.footer-link-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link-list button,
.footer-link-list a {
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

.footer-link-list button:hover,
.footer-link-list a:hover {
  color: #10B981;
}

.footer-bottom-bar {
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

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a {
  color: #64748B;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-bottom-links a:hover {
  color: #94A3B8;
}

/* ============================================================================
   Responsive Breakpoints
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
  .ebaro-level-tabs {
    grid-template-columns: 1fr;
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
  .ebaro-footer .footer-grid {
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
  .section-title {
    font-size: 2rem;
  }
  .ebaro-spotlight-body {
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
  .ebaro-cta-headline {
    font-size: 2.25rem;
  }
  .ebaro-footer .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
`;

fs.writeFileSync(cssPath, baseCss + fullVibrantCss, 'utf-8');
console.log('Successfully updated src/index.css with Full Vibrant EdTech CSS matching HomePage classes!');

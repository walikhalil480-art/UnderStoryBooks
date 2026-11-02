import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  HelpCircle,
  PenTool,
  Send,
  ShieldCheck,
  UploadCloud,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  Check,
  Smartphone,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  Award,
  Globe2
} from 'lucide-react';
import { CATEGORIES } from '../data/books';
import { folioApi } from '../services/api';
import { UserProfile } from '../types';
import '../styles/publishAndAdmin.css';

interface AuthorSubmissionPageProps {
  user: UserProfile | null;
  onRequireAuth: () => void;
  onNavigateHome: () => void;
}

const PRESET_COVERS = [
  {
    name: 'Islamic & Scholarly Emerald',
    url: '/covers/somali/safinat-an-najah-soomaali.svg',
    category: 'islamic-studies'
  },
  {
    name: 'Somali Romance Crimson',
    url: '/covers/somali/aqoondarro-waa-u-nacab-jacayl.svg',
    category: 'somali-fiction'
  },
  {
    name: 'Grammar & Linguistics Blue',
    url: '/covers/somali/naxwaha-af-soomaaliga.svg',
    category: 'language-linguistics'
  },
  {
    name: 'Business Leadership Gold',
    url: '/covers/somali/horumarka-nafta-iyo-ganacsiga.svg',
    category: 'self-development-business'
  },
  {
    name: 'Social Heritage & Drama',
    url: '/covers/somali/maanafaay.svg',
    category: 'somali-fiction'
  },
  {
    name: 'National History & Archive',
    url: '/covers/somali/taariikhda-ummadda-soomaaliyeed.svg',
    category: 'history-biography'
  }
];

export const AuthorSubmissionPage: React.FC<AuthorSubmissionPageProps> = ({
  user,
  onRequireAuth,
  onNavigateHome
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [authorName, setAuthorName] = useState(user?.fullName || '');
  const [authorBio, setAuthorBio] = useState('');
  const [authorEmail, setAuthorEmail] = useState(user?.email || '');
  const [authorPhone, setAuthorPhone] = useState('');
  const [language, setLanguage] = useState<'so' | 'en' | 'ar'>('so');
  const [categorySlug, setCategorySlug] = useState('islamic-studies');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [publishedYear, setPublishedYear] = useState(new Date().getFullYear().toString());
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [accessPreference, setAccessPreference] = useState<'free' | 'paid'>('free');
  const [currency, setCurrency] = useState<'USD' | 'KES' | 'SOS'>('USD');
  const [price, setPrice] = useState('4.99');
  const [payoutMethod, setPayoutMethod] = useState<'evc_plus' | 'zaad' | 'sahal' | 'bank'>('evc_plus');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [rightsDeclaration, setRightsDeclaration] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Cover Image Upload State
  const [coverUrl, setCoverUrl] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manuscript Upload State
  const [manuscriptPath, setManuscriptPath] = useState('');
  const [manuscriptFilename, setManuscriptFilename] = useState('');
  const [manuscriptFormat, setManuscriptFormat] = useState<'PDF' | 'EPUB' | 'DOCX' | ''>('');
  const [manuscriptSize, setManuscriptSize] = useState<number>(0);
  const [uploadingManuscript, setUploadingManuscript] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [manuscriptError, setManuscriptError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [externalFileUrl, setExternalFileUrl] = useState('');
  const manuscriptInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  const handleManuscriptFile = async (file: File) => {
    setManuscriptError(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'epub', 'docx'].includes(ext)) {
      setManuscriptError('Unsupported format. Only PDF (.pdf) and EPUB (.epub) files (or .docx) are accepted.');
      return;
    }

    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setManuscriptError(`File size exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setUploadingManuscript(true);
    setUploadProgress(0);

    try {
      const res = await folioApi.uploadAuthorManuscript(file, (pct) => {
        setUploadProgress(pct);
      });
      setManuscriptPath(res.path);
      setManuscriptFilename(res.filename);
      setManuscriptFormat(res.format);
      setManuscriptSize(res.size);
      setErrorMessage(null);
    } catch (err: any) {
      setManuscriptError(err.message || 'Failed to upload manuscript file. Please try again.');
    } finally {
      setUploadingManuscript(false);
    }
  };

  const handleRemoveManuscript = () => {
    setManuscriptPath('');
    setManuscriptFilename('');
    setManuscriptFormat('');
    setManuscriptSize(0);
    setUploadProgress(0);
    setManuscriptError(null);
    if (manuscriptInputRef.current) {
      manuscriptInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleManuscriptFile(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Cover image file size must be less than 5MB.');
      return;
    }

    setCoverFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCoverPreview(dataUrl);
      setCoverUrl(dataUrl);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setCoverUrl('');
    setCoverFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingMine(true);
      folioApi
        .getMyAuthorSubmissions()
        .then((res) => setMySubmissions(res.submissions || []))
        .catch(() => {})
        .finally(() => setLoadingMine(false));
    }
  }, [user]);

  // Derived Category label
  const selectedCatObj = CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryDisplayName = selectedCatObj ? selectedCatObj.name : 'Literature';

  // Live earnings calculation
  const parsedPrice = Math.max(0, parseFloat(price) || 0);
  const authorEarningSplit = (parsedPrice * 0.85).toFixed(2);
  const platformFeeSplit = (parsedPrice * 0.15).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Author Terms & Royalties Agreement to submit.');
      return;
    }

    if (!manuscriptPath && !externalFileUrl.trim()) {
      setErrorMessage('Please upload your book manuscript (PDF or EPUB) or provide an external archive link before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await folioApi.submitAuthorManuscript({
        title,
        subtitle,
        author: authorName,
        authorBio,
        authorEmail,
        authorPhone,
        language,
        categorySlug,
        genre,
        description,
        publishedYear: publishedYear ? parseInt(publishedYear, 10) : undefined,
        publisher,
        isbn,
        coverUrl: coverUrl || coverPreview || undefined,
        accessPreference,
        price: accessPreference === 'paid' ? parseFloat(price) : 0,
        currency: accessPreference === 'paid' ? currency : 'USD',
        payoutMethod,
        payoutAccount,
        rightsDeclaration,
        manuscriptPath: manuscriptPath || undefined,
        manuscriptFilename: manuscriptFilename || undefined,
        manuscriptFormat: manuscriptFormat || undefined,
        manuscriptSize: manuscriptSize || undefined,
        fileUrl: externalFileUrl.trim() || undefined
      });

      setSuccessMessage(res.message || 'Submission successfully received for editorial review!');
      // Reset form fields
      setTitle('');
      setSubtitle('');
      setDescription('');
      setRightsDeclaration('');
      setAgreeTerms(false);
      setCoverUrl('');
      setCoverPreview(null);
      setCoverFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      handleRemoveManuscript();
      setExternalFileUrl('');

      // Refresh list
      folioApi.getMyAuthorSubmissions().then((data) => setMySubmissions(data.submissions || []));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit manuscript. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="author-portal-page">
      <div className="author-portal-container">
        {/* Header & Hero Section */}
        <header className="author-portal-header">
          <div className="author-portal-eyebrow">
            <BookOpen size={14} />
            <span>Understory Author &amp; Publisher Suite</span>
          </div>
          <h1 className="author-portal-title">
            Publish Your Work to Readers Worldwide
          </h1>
          <p className="author-portal-desc">
            Empowering Somali authors and international publishers with seamless digital distribution, 85% commercial royalty splits, instant mobile money payouts, and verified archival preservation.
          </p>
        </header>

        {/* 4 Pillars Benefits Grid */}
        <section className="author-benefits-grid" aria-label="Author Benefits & Royalties">
          <div className="author-benefit-card">
            <div className="benefit-icon-badge indigo">
              <span>85%</span>
            </div>
            <h3 className="benefit-card-title">Highest Royalty Split</h3>
            <p className="benefit-card-text">
              Authors keep 85% of every commercial reader purchase. Paid monthly without delays or hidden fees.
            </p>
          </div>

          <div className="author-benefit-card">
            <div className="benefit-icon-badge emerald">
              <Smartphone size={20} />
            </div>
            <h3 className="benefit-card-title">Mobile Money Payouts</h3>
            <p className="benefit-card-text">
              Direct settlement via Hormuud EVC Plus, Telesom ZAAD, Golis Sahal, or international SWIFT wire.
            </p>
          </div>

          <div className="author-benefit-card">
            <div className="benefit-icon-badge sky">
              <Globe2 size={20} />
            </div>
            <h3 className="benefit-card-title">Zero Listing Fees</h3>
            <p className="benefit-card-text">
              Educational, historical, and free open-access cultural titles remain 100% free for readers and authors forever.
            </p>
          </div>

          <div className="author-benefit-card">
            <div className="benefit-icon-badge amber">
              <ShieldCheck size={20} />
            </div>
            <h3 className="benefit-card-title">Archival &amp; DRM Rights</h3>
            <p className="benefit-card-text">
              Manual editorial copyright inspection, protected in-browser reading, and fast DMCA dispute resolution.
            </p>
          </div>
        </section>

        {/* Dual-Column Studio Workspace */}
        <div className="author-workspace-layout">
          {/* Main Submission Form */}
          <div className="author-form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Manuscript &amp; Publication Details</h2>
              <p className="form-card-subtitle">
                Fill in the bibliographic details below. Each submission undergoes editorial inspection to verify formatting, typography, and legal copyright attribution.
              </p>
            </div>

            {!user && (
              <div className="form-alert info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <div>
                    <strong>Sign In to Submit Manuscripts</strong>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                      Log in or create a free author account to track review status and manage royalties.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="btn-submit-publish"
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}
                >
                  Sign In / Register
                </button>
              </div>
            )}

            {successMessage && (
              <div className="form-alert success">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CheckCircle2 size={20} className="flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="form-alert error">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="author-submission-form">
              {/* Step 1: Bibliographic Information */}
              <div className="form-section-block">
                <h3 className="form-section-title">
                  <FileText size={16} />
                  <span>1. Bibliographic Identity</span>
                </h3>

                <div className="form-row-2">
                  <div className="form-field-group">
                    <label className="form-field-label">
                      Book Title (Cinwaanka Buugga) <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Geeddi-Socodka Nolosha"
                      className="form-field-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">
                      Subtitle (Cinwaanka Hoose)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Qiso Run ah oo Ku Saabsan..."
                      className="form-field-input"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field-group">
                    <label className="form-field-label">
                      Author / Creator Name (Qoraaga) <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      placeholder="e.g. Cabdiqaadir Xasan"
                      className="form-field-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">
                      Primary Category (Qaybta) <span className="required-star">*</span>
                    </label>
                    <select
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      className="form-field-select"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name} ({cat.nameSomali || cat.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-field-group">
                    <label className="form-field-label">Language / Luqadda</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="form-field-select"
                    >
                      <option value="so">Somali (Af-Soomaali)</option>
                      <option value="ar">Arabic (العربية)</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Publication Year</label>
                    <input
                      type="number"
                      value={publishedYear}
                      onChange={(e) => setPublishedYear(e.target.value)}
                      className="form-field-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">ISBN (Optional)</label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="978-..."
                      className="form-field-input"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field-group">
                    <label className="form-field-label">Publisher / Press Imprint</label>
                    <input
                      type="text"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      placeholder="e.g. Hargeisa Cultural Centre / Understory Press"
                      className="form-field-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">Genre / Sub-discipline</label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="e.g. Historical Fiction, Memoir, Classical Poetry"
                      className="form-field-input"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Book Synopsis */}
              <div className="form-section-block">
                <h3 className="form-section-title">
                  <BookOpen size={16} />
                  <span>2. Book Synopsis &amp; Themes</span>
                </h3>

                <div className="form-field-group">
                  <label className="form-field-label">
                    Synopsis &amp; Description (Faallada Guud ee Buugga) <span className="required-star">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Provide a comprehensive synopsis of the book, its major themes, target readership, historical context, and table of contents..."
                    className="form-field-textarea"
                  />
                </div>
              </div>

              {/* Step 3: Book Cover Artwork */}
              <div className="form-section-block">
                <h3 className="form-section-title">
                  <ImageIcon size={16} />
                  <span>3. Book Cover Artwork Studio</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                  Upload a custom high-resolution cover image, or select one of our verified cultural editorial templates below.
                </p>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCoverFileChange}
                  style={{ display: 'none' }}
                />

                {coverPreview || coverUrl ? (
                  <div className="cover-preview-card">
                    <img
                      src={coverPreview || coverUrl}
                      alt="Book Cover Preview"
                      className="cover-preview-thumb"
                    />
                    <div className="cover-preview-details">
                      <span className="cover-preview-name">
                        {coverFileName || 'Selected Book Cover'}
                      </span>
                      <span className="cover-preview-meta">
                        Cover artwork ready. This will be verified during editorial review.
                      </span>
                      <div className="cover-preview-actions">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-cover-action primary"
                        >
                          Change Cover File
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveCover}
                          className="btn-cover-action danger"
                        >
                          <Trash2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="cover-upload-area"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                    }}
                  >
                    <div className="cover-upload-icon-wrap">
                      <UploadCloud size={26} />
                    </div>
                    <h4 className="cover-upload-title">
                      Click to Upload Cover Artwork
                    </h4>
                    <p className="cover-upload-subtitle">
                      PNG, JPG, or WebP (max 5MB). Recommended ratio: 2:3 or 3:4 portrait.
                    </p>
                  </div>
                )}

                {/* Curated Presets */}
                <div>
                  <div className="cover-presets-title">
                    Or select an authentic cultural editorial template:
                  </div>
                  <div className="cover-presets-grid">
                    {PRESET_COVERS.map((preset) => {
                      const isSelected = coverUrl === preset.url;
                      return (
                        <div
                          key={preset.url}
                          onClick={() => {
                            setCoverUrl(preset.url);
                            setCoverPreview(preset.url);
                            setCoverFileName(preset.name);
                          }}
                          className={`cover-preset-chip ${isSelected ? 'selected' : ''}`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="cover-preset-chip-img"
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span className="cover-preset-chip-name">
                              {preset.name}
                            </span>
                          </div>
                          {isSelected && <Check size={14} style={{ marginLeft: 'auto', color: '#173D2D', flexShrink: 0 }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct URL input option */}
                <div>
                  <label className="form-field-label" style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Or enter a direct public image URL:
                  </label>
                  <input
                    type="url"
                    value={coverUrl.startsWith('data:') ? '' : coverUrl}
                    onChange={(e) => {
                      setCoverUrl(e.target.value);
                      setCoverPreview(e.target.value || null);
                      setCoverFileName('Direct Web URL');
                    }}
                    placeholder="https://example.com/covers/my-book.jpg"
                    className="form-field-input"
                    style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}
                  />
                </div>
              </div>

              {/* Step 4: Book Manuscript Upload */}
              <div className="form-section-block">
                <h3 className="form-section-title">
                  <UploadCloud size={16} />
                  <span>4. Book Manuscript Upload (PDF / EPUB)</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                  Upload your actual book file directly from your device. Supported formats: <strong>PDF</strong> (fixed-layout), <strong>EPUB</strong> (reflowable reader format), and <strong>DOCX</strong> (up to 50MB).
                </p>

                {/* Hidden Manuscript File Input */}
                <input
                  type="file"
                  ref={manuscriptInputRef}
                  accept=".pdf,.epub,.docx,application/pdf,application/epub+zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleManuscriptFile(file);
                  }}
                  style={{ display: 'none' }}
                />

                {manuscriptError && (
                  <div className="form-alert error" style={{ margin: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <span>{manuscriptError}</span>
                    </div>
                  </div>
                )}

                {uploadingManuscript ? (
                  <div className="manuscript-progress-panel">
                    <div className="manuscript-progress-info">
                      <span>Uploading manuscript file...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="manuscript-progress-track">
                      <div
                        className="manuscript-progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Verifying file container integrity, magic byte headers, and format signatures...
                    </div>
                  </div>
                ) : manuscriptPath ? (
                  <div className="manuscript-file-card">
                    <div className="manuscript-file-left">
                      <div className="manuscript-file-icon-wrap">
                        <FileCheck size={22} />
                      </div>
                      <div className="manuscript-file-meta">
                        <span className="manuscript-file-name" title={manuscriptFilename}>
                          {manuscriptFilename || 'Uploaded Manuscript'}
                        </span>
                        <div className="manuscript-file-sub">
                          <span className="manuscript-format-badge primary">
                            {manuscriptFormat}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(manuscriptSize)}</span>
                          <span>•</span>
                          <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                            <CheckCircle2 size={13} /> Attached to submission
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="manuscript-file-actions">
                      <button
                        type="button"
                        onClick={() => manuscriptInputRef.current?.click()}
                        className="btn-manuscript-action replace"
                        title="Replace with a different manuscript file"
                      >
                        Replace File
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveManuscript}
                        className="btn-manuscript-action remove"
                        title="Remove manuscript file"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`manuscript-upload-dropzone ${isDragOver ? 'drag-active' : ''}`}
                    onClick={() => manuscriptInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') manuscriptInputRef.current?.click();
                    }}
                  >
                    <div className="manuscript-upload-icon-wrap">
                      <UploadCloud size={28} />
                    </div>
                    <h4 className="manuscript-upload-title">
                      Drag &amp; Drop Your Book Manuscript Here
                    </h4>
                    <p className="manuscript-upload-subtitle">
                      or click to browse your computer or mobile device. Maximum file size is 50MB.
                    </p>

                    <div className="manuscript-formats-tags">
                      <span className="manuscript-format-badge primary">
                        PDF (Primary Format)
                      </span>
                      <span className="manuscript-format-badge primary">
                        EPUB (Reflowable Format)
                      </span>
                      <span className="manuscript-format-badge">
                        DOCX (Word Document)
                      </span>
                    </div>
                  </div>
                )}

                {/* External Archive Link Fallback */}
                <div style={{ marginTop: '0.85rem' }}>
                  <label className="form-field-label" style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Or provide an institutional repository / digital archive URL (Optional):
                  </label>
                  <input
                    type="url"
                    value={externalFileUrl}
                    onChange={(e) => setExternalFileUrl(e.target.value)}
                    placeholder="https://archive.org/details/my-book-id or institutional digital library link"
                    className="form-field-input"
                    style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}
                  />
                </div>
              </div>

              {/* Step 5: Monetisation and Royalties */}
              <div className="form-section-block">
                <h3 className="form-section-title">
                  <DollarSign size={16} />
                  <span>5. Monetisation Preference &amp; Royalties</span>
                </h3>

                <div className="monetisation-options-grid">
                  <div
                    onClick={() => setAccessPreference('free')}
                    className={`pricing-tier-card ${accessPreference === 'free' ? 'selected' : ''}`}
                  >
                    <div className="tier-card-top">
                      <span className="tier-card-title">Free Open-Access Edition</span>
                      <span className="tier-pill free">$0.00</span>
                    </div>
                    <p className="tier-card-desc">
                      Maximum cultural and diaspora reach. Free full-text reading and educational offline reading for all readers.
                    </p>
                  </div>

                  <div
                    onClick={() => setAccessPreference('paid')}
                    className={`pricing-tier-card ${accessPreference === 'paid' ? 'selected' : ''}`}
                  >
                    <div className="tier-card-top">
                      <span className="tier-card-title">Commercial Author Edition</span>
                      <span className="tier-pill paid">85% Author Split</span>
                    </div>
                    <p className="tier-card-desc">
                      Readers purchase access via Somali Mobile Money or card. Royalties settled monthly to your mobile or bank account.
                    </p>
                  </div>
                </div>

                {accessPreference === 'paid' && (
                  <div className="paid-settings-panel">
                    <div className="form-row-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr', gap: '0.75rem' }}>
                      <div className="form-field-group">
                        <label className="form-field-label">Currency *</label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as any)}
                          className="form-field-select"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="KES">KES (KSh)</option>
                          <option value="SOS">SOS (So.Sh.)</option>
                        </select>
                      </div>

                      <div className="form-field-group">
                        <label className="form-field-label">Retail Price *</label>
                        <input
                          type="number"
                          step={currency === 'SOS' ? '1000' : '0.01'}
                          min={currency === 'SOS' ? '1000' : '0.50'}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="form-field-input"
                          style={{ fontFamily: 'monospace', fontWeight: 700 }}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-field-label">Payout Method *</label>
                        <select
                          value={payoutMethod}
                          onChange={(e) => setPayoutMethod(e.target.value as any)}
                          className="form-field-select"
                        >
                          <option value="evc_plus">Hormuud EVC Plus (Somalia)</option>
                          <option value="zaad">Telesom ZAAD (Somaliland)</option>
                          <option value="sahal">Golis Sahal (Puntland)</option>
                          <option value="bank">International Bank / SWIFT</option>
                        </select>
                      </div>

                      <div className="form-field-group">
                        <label className="form-field-label">
                          Phone / Account Number *
                        </label>
                        <input
                          type="text"
                          value={payoutAccount}
                          onChange={(e) => setPayoutAccount(e.target.value)}
                          placeholder="e.g. 252615..."
                          className="form-field-input"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>

                    {/* Live Royalty Calculation Breakdown */}
                    <div className="royalty-breakdown-card">
                      <div className="royalty-row">
                        <span style={{ color: '#475569' }}>Reader Retail Price:</span>
                        <span style={{ fontWeight: 600 }}>{currency} {parsedPrice.toFixed(2)}</span>
                      </div>
                      <div className="royalty-row">
                        <span style={{ color: '#64748B' }}>Understory Infrastructure &amp; Processing (15%):</span>
                        <span style={{ color: '#64748B' }}>-{currency} {platformFeeSplit}</span>
                      </div>
                      <div className="royalty-row highlight">
                        <span>Your Net Earnings Per Copy (85%):</span>
                        <span>{currency} {authorEarningSplit}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 6: Rights Declaration */}
              <div className="form-section-block">
                <h3 className="form-section-title">
                  <ShieldCheck size={16} />
                  <span>6. Legal Rights &amp; Intellectual Property Declaration</span>
                </h3>

                <div className="form-field-group">
                  <label className="form-field-label">
                    Rights Ownership Statement <span className="required-star">*</span>
                  </label>
                  <textarea
                    value={rightsDeclaration}
                    onChange={(e) => setRightsDeclaration(e.target.value)}
                    required
                    rows={3}
                    placeholder="State your legal rights: e.g. 'I am the sole author and copyright owner of this literary work, or an authorized publisher acting with written legal consent...'"
                    className="form-field-textarea"
                  />
                </div>

                <div className="terms-agreement-row">
                  <input
                    type="checkbox"
                    id="authorTermsAgree"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="terms-checkbox"
                  />
                  <label htmlFor="authorTermsAgree" className="terms-label">
                    I certify that all provided information is accurate, that I hold the digital distribution rights to publish this book on Understory, and I accept the{' '}
                    <strong>Understory Author Terms of Service</strong>,{' '}
                    <strong>Royalties Agreement</strong>, and{' '}
                    <strong>Copyright Compliance Policy</strong>.
                  </label>
                </div>
              </div>

              <div className="form-actions-footer">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="btn-secondary-link"
                >
                  Back to Library
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploadingManuscript || !user}
                  className="btn-submit-publish"
                >
                  <Send size={16} />
                  <span>
                    {uploadingManuscript
                      ? 'Uploading Manuscript...'
                      : submitting
                      ? 'Submitting Manuscript...'
                      : 'Submit Manuscript for Review'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Sticky Sidebar with Live Card Preview & Author Desk */}
          <aside className="author-sidebar-col">
            {/* Live Book Mockup Card */}
            <div className="live-preview-box">
              <div className="live-preview-header">
                <span className="live-preview-badge">Live Reader Preview</span>
                <span className="live-preview-indicator" title="Updates in real time" />
              </div>

              <div className="live-book-mockup">
                <div className="mockup-cover-wrap">
                  {coverPreview || coverUrl ? (
                    <img
                      src={coverPreview || coverUrl}
                      alt={title || 'Book cover preview'}
                      className="mockup-cover-img"
                    />
                  ) : (
                    <div className="mockup-cover-fallback">
                      <BookOpen size={36} strokeWidth={1.5} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>No Cover Selected</span>
                    </div>
                  )}
                </div>

                <div className="mockup-meta-info">
                  <span className="mockup-category-tag">
                    {categoryDisplayName}
                  </span>
                  <h4 className="mockup-title">
                    {title.trim() || 'Your Book Title'}
                  </h4>
                  <p className="mockup-author">
                    By {authorName.trim() || 'Author Name'}
                  </p>
                  <div
                    className={`mockup-price-badge ${
                      accessPreference === 'free' ? 'free' : 'paid'
                    }`}
                  >
                    {accessPreference === 'free' ? 'Free Edition' : `$${parsedPrice.toFixed(2)} USD`}
                  </div>

                  {manuscriptFilename && (
                    <div style={{ fontSize: '0.74rem', color: '#173D2D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} color="#173D2D" />
                      <span>{manuscriptFormat} • {formatFileSize(manuscriptSize)} attached</span>
                    </div>
                  )}

                  <div className="mockup-formats-row">
                    <span className="mockup-format-pill">Web Reader</span>
                    {manuscriptFormat === 'EPUB' ? (
                      <span className="mockup-format-pill" style={{ backgroundColor: '#173D2D', color: '#FFFFFF' }}>EPUB</span>
                    ) : manuscriptFormat === 'PDF' ? (
                      <span className="mockup-format-pill" style={{ backgroundColor: '#173D2D', color: '#FFFFFF' }}>PDF</span>
                    ) : (
                      <>
                        <span className="mockup-format-pill">EPUB</span>
                        <span className="mockup-format-pill">PDF</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center', margin: 0 }}>
                This is how readers will see your book in the catalogue and search results.
              </p>
            </div>

            {/* Publishing Process Steps */}
            <div className="live-preview-box" style={{ gap: '0.85rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#202820', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#173D2D" />
                <span>Editorial Review Timeline</span>
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: '#747D74' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#DCE6DC', color: '#173D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>1</div>
                  <span><strong>Submission:</strong> Form sent to editorial console.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#DCE6DC', color: '#173D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>2</div>
                  <span><strong>Editorial Audit:</strong> 24–48h verification of rights &amp; typography.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#DCE6DC', color: '#173D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>3</div>
                  <span><strong>Global Listing:</strong> Live to readers across Somali regions &amp; diaspora.</span>
                </li>
              </ul>
            </div>

            {/* User Previous Submissions List */}
            {user && mySubmissions.length > 0 && (
              <section className="author-submissions-box" aria-label="Your Submissions">
                <h3 className="submissions-box-title">
                  <FileCheck size={18} color="#173D2D" />
                  <span>Your Submissions ({mySubmissions.length})</span>
                </h3>

                <div className="submissions-list">
                  {mySubmissions.map((sub) => (
                    <div key={sub.id} className="submission-item">
                      <div style={{ overflow: 'hidden' }}>
                        <h4 className="sub-item-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.title}
                        </h4>
                        <p className="sub-item-meta">
                          {sub.access_preference === 'paid' ? `$${sub.price} USD` : 'Free Open Access'}
                        </p>
                        {sub.admin_notes && (
                          <p className="sub-item-note">Note: {sub.admin_notes}</p>
                        )}
                      </div>
                      <span className={`status-badge ${sub.status}`}>
                        {sub.status === 'approved' ? (
                          <CheckCircle2 size={13} />
                        ) : sub.status === 'rejected' ? (
                          <XCircle size={13} />
                        ) : (
                          <Clock size={13} />
                        )}
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Help & Inquiries */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E3E6DF', borderRadius: '16px', padding: '1.25rem', fontSize: '0.8rem', color: '#747D74', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 700, color: '#202820', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <HelpCircle size={15} color="#173D2D" />
                <span>Need Publishing Assistance?</span>
              </div>
              <p style={{ margin: 0, lineHeight: '1.45' }}>
                For publisher volume licensing, ISBN assignment, or bulk digitization, reach our editorial desk at <a href="mailto:publishing@understory.org" style={{ color: '#173D2D', fontWeight: 600 }}>publishing@understory.org</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

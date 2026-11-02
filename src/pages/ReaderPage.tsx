import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  List,
  Sun,
  Moon,
  Type,
  Check,
  X,
  ExternalLink,
  CheckCircle2,
  FileText,
  BookOpen,
  Download,
  RotateCcw,
  Sliders,
  Copy,
  Share2,
  MessageSquare,
  Maximize2,
  Minimize2,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  BookMarked,
  Lock,
  DollarSign
} from 'lucide-react';
import { Book, ChapterSample, ReaderPreferences, UserLibraryPayload, UserProfile } from '../types';
import { folioApi } from '../services/api';
import { PdfReaderView } from '../components/PdfReaderView';
import { EpubReaderView } from '../components/EpubReaderView';
import { CheckoutModal } from '../components/CheckoutModal';
import { recordReadingProgressTime } from '../utils/readingTracker';

export type ReaderMode = 'web' | 'pdf' | 'epub' | 'text';

interface ReaderPageProps {
  book: Book;
  user: UserProfile | null;
  initialChapterIndex?: number;
  initialMode?: ReaderMode;
  onExitReader: () => void;
  onViewBookDetails: (bookId: string) => void;
  onRequireAuth: (book: Book) => void;
  onLibraryChange: (library: UserLibraryPayload) => void;
  preferences: ReaderPreferences;
  onUpdatePreferences: (prefs: ReaderPreferences) => void;
  isBookmarked: boolean;
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
  onPurchaseSuccess?: (bookId: string) => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({
  book,
  user,
  initialChapterIndex = 0,
  initialMode = 'web',
  onExitReader,
  onViewBookDetails,
  onRequireAuth,
  onLibraryChange,
  preferences,
  onUpdatePreferences,
  isBookmarked,
  onToggleBookmark,
  onPurchaseSuccess
}) => {
  const isPdfManuscript =
    book.manuscriptFormat === 'PDF' ||
    Boolean(book.manuscriptPath?.toLowerCase().endsWith('.pdf')) ||
    (book.provenance?.manuscriptFormat === 'PDF');
  const isEpubManuscript =
    book.manuscriptFormat === 'EPUB' ||
    Boolean(book.manuscriptPath?.toLowerCase().endsWith('.epub')) ||
    (book.provenance?.manuscriptFormat === 'EPUB');

  const canUsePdf =
    (book.availableFormats.includes('PDF') || isPdfManuscript) &&
    (book.provenance.fullTextReadingPermitted !== false);

  const determineDefaultMode = (): ReaderMode => {
    if (initialMode === 'pdf' && canUsePdf) return 'pdf';
    if (initialMode === 'epub' && (book.availableFormats.includes('EPUB') || isEpubManuscript)) return 'epub';
    if (initialMode === 'text') return 'text';
    if (isPdfManuscript && canUsePdf) return 'pdf';
    if (isEpubManuscript) return 'epub';
    return initialMode || 'web';
  };

  const [readerMode, setReaderMode] = useState<ReaderMode>(determineDefaultMode);
  const [chapters, setChapters] = useState<ChapterSample[]>([]);
  const [contentError, setContentError] = useState<string | null>(null);
  const [isPurchaseRequired, setIsPurchaseRequired] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [reloadCounter, setReloadCounter] = useState<number>(0);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [loadingGutenberg, setLoadingGutenberg] = useState<boolean>(false);
  const [gutenbergExpanded, setGutenbergExpanded] = useState<boolean>(false);
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [savedPdfPage, setSavedPdfPage] = useState<number>(1);
  const [totalPdfPages, setTotalPdfPages] = useState<number>(1);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [tocSearchQuery, setTocSearchQuery] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [progressSavedToast, setProgressSavedToast] = useState<string>('');
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);

  // Typography & Layout Controls
  const [typeface, setTypeface] = useState<'serif' | 'sans' | 'dyslexic'>('serif');
  const [lineLeading, setLineLeading] = useState<'1.4' | '1.8' | '2.2'>('1.8');
  const [readerMargin, setReaderMargin] = useState<'narrow' | 'normal' | 'wide'>('normal');
  const [atmosphere, setAtmosphere] = useState<'crisp' | 'sepia' | 'slate' | 'obsidian'>('crisp');

  // Interactive Highlighting System
  interface BookHighlight {
    id: string;
    text: string;
    color: 'yellow' | 'mint' | 'sky' | 'rose' | 'purple';
    chapterIndex: number;
    paragraphIndex: number;
    createdAt: number;
  }

  const [highlights, setHighlights] = useState<BookHighlight[]>(() => {
    try {
      const stored = localStorage.getItem(`understory_highlights_${book.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeSelection, setActiveSelection] = useState<{
    text: string;
    x: number;
    y: number;
    paragraphIndex: number;
  } | null>(null);

  // Persist highlights whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(`understory_highlights_${book.id}`, JSON.stringify(highlights));
    } catch {
      // ignore storage errors
    }
  }, [highlights, book.id]);

  // Sync mode if initialMode prop or book manuscript changes
  useEffect(() => {
    setReaderMode(determineDefaultMode());
  }, [initialMode, canUsePdf, isPdfManuscript, isEpubManuscript, book.id]);

  // Sync atmosphere with preferences theme
  useEffect(() => {
    if (preferences.theme === 'ivory') {
      setAtmosphere('sepia');
    } else if (preferences.theme === 'night') {
      setAtmosphere((prev) => (prev === 'slate' ? 'slate' : 'obsidian'));
    } else {
      setAtmosphere('crisp');
    }
  }, [preferences.theme]);

  // Fullscreen event listener sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation & Shortcuts (Esc to close drawers, arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') {
        if (tocOpen) setTocOpen(false);
        if (isSettingsOpen) setIsSettingsOpen(false);
      } else if (readerMode === 'web') {
        if (e.key === 'ArrowRight' && chapterIndex < chapters.length - 1) {
          setChapterIndex((c) => c + 1);
        } else if (e.key === 'ArrowLeft' && chapterIndex > 0) {
          setChapterIndex((c) => c - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tocOpen, isSettingsOpen, readerMode, chapterIndex, chapters.length]);

  // Verify access and load content from protected backend endpoint
  useEffect(() => {
    let active = true;
    setLoadingContent(true);
    setGutenbergExpanded(false);

    folioApi
      .getReaderContent(book.id)
      .then((payload) => {
        if (!active) return;
        const loadedChapters =
          payload.chapters && payload.chapters.length > 0
            ? payload.chapters
            : [];
        setChapters(loadedChapters);
        if (loadedChapters.length === 0 && !isPdfManuscript) {
          setContentError("This book's manuscript is currently unavailable. Please contact the publisher.");
        }
        const maxIdx = Math.max(0, loadedChapters.length - 1);
        const targetIdx =
          initialChapterIndex > 0
            ? Math.min(initialChapterIndex, maxIdx)
            : payload.savedProgress
            ? Math.min(payload.savedProgress.chapterIndex, maxIdx)
            : 0;
        setChapterIndex(targetIdx);

        if (payload.savedProgress?.lastReadPage) {
          setSavedPdfPage(payload.savedProgress.lastReadPage);
        } else {
          setSavedPdfPage(1);
        }
        if (payload.savedProgress?.totalPages) {
          setTotalPdfPages(payload.savedProgress.totalPages);
        }

        setContentError(null);
        setLoadingContent(false);

        if (user) {
          folioApi
            .getLibrary()
            .then((lib) => {
              if (active) onLibraryChange(lib);
            })
            .catch(() => {});
        }
      })
      .catch((err: any) => {
        if (!active) return;
        if (err?.status === 401 || err?.code === 'AUTHENTICATION_REQUIRED') {
          onRequireAuth(book);
          return;
        }
        if (
          err?.status === 402 ||
          err?.code === 'PURCHASE_REQUIRED' ||
          err?.message?.toLowerCase().includes('purchased') ||
          err?.message?.toLowerCase().includes('purchase')
        ) {
          setIsPurchaseRequired(true);
          setContentError(err?.message || 'This premium edition must be purchased before reading.');
          setLoadingContent(false);
          return;
        }
        setContentError(err?.message || "This book's manuscript is currently unavailable. Please contact the publisher.");
        setLoadingContent(false);
      });

    return () => {
      active = false;
    };
  }, [book.id, user, reloadCounter]);

  useEffect(() => {
    if (readerMode !== 'pdf') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chapterIndex, readerMode]);

  // Real-time active reading tracker: accumulates actual time spent in book
  useEffect(() => {
    let lastActiveTime = Date.now();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && !loadingContent) {
        const now = Date.now();
        const deltaSeconds = Math.min(10, Math.round((now - lastActiveTime) / 1000));
        lastActiveTime = now;
        if (deltaSeconds >= 4) {
          recordReadingProgressTime(book.id, book.title, deltaSeconds, 0, readerMode);
        }
      } else {
        lastActiveTime = Date.now();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [book.id, book.title, readerMode, loadingContent]);

  useEffect(() => {
    if (readerMode === 'pdf') return;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(100);
      } else {
        const pct = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
        setScrollProgress(pct);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapterIndex, preferences.fontSize, loadingContent, readerMode]);

  const totalChapters = Math.max(1, chapters.length);
  const overallProgress =
    readerMode === 'pdf'
      ? Math.round((savedPdfPage / Math.max(1, totalPdfPages)) * 100)
      : Math.round(((chapterIndex + Math.max(25, scrollProgress) / 100) / totalChapters) * 100);

  // Sync chapter progress to backend when in web or text mode
  useEffect(() => {
    if (!user || loadingContent || readerMode === 'pdf') return;
    const timer = setTimeout(() => {
      folioApi
        .saveReadingProgress({
          bookId: book.id,
          chapterIndex,
          scrollPercentage: scrollProgress,
          overallPercentage: overallProgress,
          lastReadPage: savedPdfPage,
          totalPages: totalPdfPages,
          preferredFormat: readerMode
        })
        .then((lib) => onLibraryChange(lib))
        .catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [book.id, chapterIndex, user, loadingContent, readerMode]);

  // Handle PDF page change persistence
  const handlePdfPageChange = useCallback(
    (page: number, total: number) => {
      const pageDelta = Math.abs(page - savedPdfPage);
      setSavedPdfPage(page);
      setTotalPdfPages(total);
      if (pageDelta > 0) {
        recordReadingProgressTime(book.id, book.title, 0, Math.min(5, pageDelta), 'pdf');
      }
      if (!user) return;
      const pdfPct = Math.min(100, Math.max(1, Math.round((page / Math.max(1, total)) * 100)));
      folioApi
        .saveReadingProgress({
          bookId: book.id,
          chapterIndex,
          scrollPercentage: pdfPct,
          overallPercentage: pdfPct,
          lastReadPage: page,
          totalPages: total,
          preferredFormat: 'pdf'
        })
        .then((lib) => onLibraryChange(lib))
        .catch(() => {});
    },
    [book.id, chapterIndex, user, onLibraryChange]
  );

  const handleManualSaveProgress = async () => {
    if (!user) {
      onRequireAuth(book);
      return;
    }
    try {
      const updated = await folioApi.saveReadingProgress({
        bookId: book.id,
        chapterIndex,
        scrollPercentage: scrollProgress,
        overallPercentage: overallProgress,
        lastReadPage: savedPdfPage,
        totalPages: totalPdfPages,
        preferredFormat: readerMode
      });
      onLibraryChange(updated);
      setProgressSavedToast(`Progress saved (${overallProgress}%)`);
      setTimeout(() => setProgressSavedToast(''), 2500);
    } catch {
      // ignore
    }
  };

  const handleLoadLiveGutenberg = async () => {
    if (!user) {
      onRequireAuth(book);
      return;
    }
    try {
      setLoadingGutenberg(true);
      const res = await folioApi.fetchLiveGutenbergFullText(book.id);
      if (res.chapters && res.chapters.length > 0) {
        setChapters(res.chapters);
        setGutenbergExpanded(true);
        setProgressSavedToast(`Loaded ${res.chapters.length} complete sections`);
        setTimeout(() => setProgressSavedToast(''), 3000);
      }
    } catch {
      // ignore
    } finally {
      setLoadingGutenberg(false);
    }
  };

  const handleDirectDownload = async (format: 'pdf' | 'epub' | 'html' | 'txt') => {
    if (!user) {
      onRequireAuth(book);
      return;
    }
    try {
      setDownloadingFormat(format);
      const { library } = await folioApi.downloadEbookFile(book.id, format, book.title);
      onLibraryChange(library);
      setProgressSavedToast(`Downloaded ${format.toUpperCase()} edition`);
      setTimeout(() => setProgressSavedToast(''), 3000);
    } catch (err: any) {
      alert(err?.message || 'Unable to download file.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentChapter = chapters[chapterIndex] ||
    chapters[0] || {
      number: 'Chapter I',
      title: book.title,
      content: [book.shortSynopsis]
    };

  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  // Filtered chapters for TOC search
  const filteredChapters = useMemo(() => {
    if (!tocSearchQuery.trim()) return chapters;
    const q = tocSearchQuery.toLowerCase();
    return chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.number.toLowerCase().includes(q) ||
        (c.epigraph && c.epigraph.toLowerCase().includes(q))
    );
  }, [chapters, tocSearchQuery]);

  // Estimated reading time for current chapter
  const estimatedReadingMinutes = useMemo(() => {
    const totalWords = currentChapter.content.join(' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(totalWords / 200));
  }, [currentChapter]);

  // Handle text selection in prose
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      return;
    }

    const selectedText = sel.toString().trim();
    if (selectedText.length < 2) return;

    // Check if selection is within the reader prose container
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Find the paragraph index
    let pNode = range.commonAncestorContainer;
    if (pNode.nodeType === Node.TEXT_NODE) {
      pNode = pNode.parentNode!;
    }
    const pElem = (pNode as HTMLElement).closest('[data-paragraph-index]');
    const pIdx = pElem ? parseInt(pElem.getAttribute('data-paragraph-index') || '0', 10) : 0;

    setActiveSelection({
      text: selectedText,
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY,
      paragraphIndex: pIdx
    });
  };

  // Add a highlight
  const applyHighlight = (color: 'yellow' | 'mint' | 'sky' | 'rose' | 'purple') => {
    if (!activeSelection) return;

    const newHl: BookHighlight = {
      id: `hl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text: activeSelection.text,
      color,
      chapterIndex,
      paragraphIndex: activeSelection.paragraphIndex,
      createdAt: Date.now()
    };

    setHighlights((prev) => [...prev, newHl]);
    setActiveSelection(null);

    // Clear browser selection
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();

    setProgressSavedToast(`Text highlighted in ${color}!`);
    setTimeout(() => setProgressSavedToast(''), 2500);
  };

  // Remove a highlight
  const removeHighlight = (hlId: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== hlId));
    setProgressSavedToast('Highlight removed');
    setTimeout(() => setProgressSavedToast(''), 2500);
  };

  const handleCopyExcerpt = (customText?: string) => {
    const textToCopy = customText || (activeSelection ? activeSelection.text : (currentChapter.content[0] || ''));
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`“${textToCopy}”\n— ${book.title} by ${book.author}`);
      setCopiedFeedback(true);
      setActiveSelection(null);
      setProgressSavedToast('Excerpt copied to clipboard!');
      setTimeout(() => {
        setCopiedFeedback(false);
        setProgressSavedToast('');
      }, 2500);
    }
  };


  return (
    <div
      className={`reader-shell atmosphere-${atmosphere} theme-${preferences.theme} font-${preferences.fontSize} ${
        isDistractionFree ? 'distraction-free' : ''
      }`}
    >
      {/* 1. Fluid Reading Progress Bar (Top Edge Indicator) */}
      <div className="reader-progress-track" aria-hidden="true">
        <div
          className="reader-progress-fill"
          style={{ width: `${Math.min(100, Math.max(3, overallProgress))}%` }}
        />
      </div>

      {/* 2. Glassmorphic Sticky Header / Controls */}
      <header className="reader-topbar">
        <div className="reader-topbar-inner">
          {/* Left: Navigation & Table of Contents */}
          <div className="reader-topbar-left">
            <button
              type="button"
              className="reader-icon-btn"
              onClick={onExitReader}
              aria-label="Return to Book Details"
              title="Return to Book Overview"
            >
              <ArrowLeft size={15} />
              <span className="hide-sm">Details</span>
            </button>

            {readerMode !== 'pdf' && (
              <button
                type="button"
                className={`reader-icon-btn ${tocOpen ? 'active' : ''}`}
                onClick={() => setTocOpen(!tocOpen)}
                aria-expanded={tocOpen}
                title="Open Table of Contents"
              >
                <List size={15} />
                <span>Contents</span>
                <span className="badge-pill">{chapters.length}</span>
              </button>
            )}

            {/* Reading Format Switcher Tabs */}
            {book.provenance.fullTextReadingPermitted && (
              <div className="reader-mode-switcher" role="group" aria-label="Reading Format">
                {!isPdfManuscript && (
                  <button
                    type="button"
                    className={`reader-mode-tab ${readerMode === 'web' ? 'active' : ''}`}
                    onClick={() => setReaderMode('web')}
                    title="Editorial Web Reader"
                  >
                    <BookOpen size={13} />
                    <span>Web</span>
                  </button>
                )}
                {(book.availableFormats.includes('EPUB') || isEpubManuscript) && !isPdfManuscript && (
                  <button
                    type="button"
                    className={`reader-mode-tab ${readerMode === 'epub' ? 'active' : ''}`}
                    onClick={() => setReaderMode('epub')}
                    title="In-Browser EPUB Reader"
                  >
                    <span>EPUB</span>
                  </button>
                )}
                {canUsePdf && (
                  <button
                    type="button"
                    className={`reader-mode-tab ${readerMode === 'pdf' ? 'active' : ''}`}
                    onClick={() => setReaderMode('pdf')}
                    title="Archival PDF Canvas"
                  >
                    <FileText size={13} />
                    <span>PDF</span>
                  </button>
                )}
                {!isPdfManuscript && (
                  <button
                    type="button"
                    className={`reader-mode-tab ${readerMode === 'text' ? 'active' : ''}`}
                    onClick={() => setReaderMode('text')}
                    title="Clean Monospace Plain Text"
                  >
                    <span>Text</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Center: Title & Chapter Status */}
          <div className="reader-topbar-center">
            <span className="reader-book-title">{book.title}</span>
            <span className="reader-chapter-indicator">
              {readerMode === 'pdf'
                ? `Page ${savedPdfPage} of ${totalPdfPages} • ${overallProgress}%`
                : chapters.length > 0
                ? `${currentChapter.number}: ${currentChapter.title} • ${overallProgress}% Complete (${estimatedReadingMinutes}m)`
                : 'Manuscript Unavailable'}
            </span>
          </div>

          {/* Right: Actions, Customization & Bookmarks */}
          <div className="reader-topbar-right">
            {/* Direct Download Pills when Permitted */}
            {book.provenance.downloadPermitted && (
              <div className="reader-download-group hide-sm">
                <button
                  type="button"
                  className="reader-download-btn"
                  disabled={downloadingFormat !== null}
                  onClick={() => handleDirectDownload('pdf')}
                  title="Download Complete PDF File"
                >
                  <Download size={12} />
                  <span>{downloadingFormat === 'pdf' ? '...' : 'PDF'}</span>
                </button>
                <button
                  type="button"
                  className="reader-download-btn"
                  disabled={downloadingFormat !== null}
                  onClick={() => handleDirectDownload('epub')}
                  title="Download Complete EPUB File"
                >
                  <Download size={12} />
                  <span>{downloadingFormat === 'epub' ? '...' : 'EPUB'}</span>
                </button>
              </div>
            )}

            {/* Display & Typography Inspector Trigger */}
            <button
              type="button"
              className={`reader-action-pill-btn ${isSettingsOpen ? 'active' : ''}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Display & Typography Settings"
              aria-expanded={isSettingsOpen}
            >
              <Sliders size={14} />
              <span className="hide-sm">Appearance</span>
            </button>

            {/* Distraction-Free Toggle */}
            <button
              type="button"
              className={`reader-icon-btn ${isDistractionFree ? 'active' : ''} hide-sm`}
              onClick={() => setIsDistractionFree(!isDistractionFree)}
              title={isDistractionFree ? 'Exit Focus Mode' : 'Enter Focus Mode (Distraction-Free)'}
            >
              {isDistractionFree ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              className="reader-icon-btn hide-sm"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              className={`reader-bookmark-btn ${isBookmarked ? 'active' : ''}`}
              onClick={(e) => onToggleBookmark(book.id, e)}
              aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark This Book'}
              title={isBookmarked ? 'Bookmarked in your library' : 'Bookmark this title'}
            >
              {isBookmarked ? <Check size={14} /> : <Bookmark size={14} />}
              <span className="hide-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Display & Typography Settings Inspector (Floating Popover) */}
      {isSettingsOpen && (
        <div className="reader-settings-overlay-popover" role="dialog" aria-label="Reading Display Settings">
          <div className="settings-popover-header">
            <div className="settings-popover-title">
              <Sliders size={15} />
              <span>Display &amp; Typography</span>
            </div>
            <button
              type="button"
              className="settings-popover-close"
              onClick={() => {
                setTypeface('serif');
                setLineLeading('1.8');
                setReaderMargin('normal');
                setAtmosphere('crisp');
                onUpdatePreferences({ ...preferences, fontSize: 'medium', theme: 'white' });
              }}
              title="Reset reading settings to default"
            >
              Reset
            </button>
          </div>

          {/* Section 1: Atmosphere Themes */}
          <div className="settings-section-group">
            <span className="settings-section-label">Atmosphere</span>
            <div className="atmosphere-swatches-grid">
              <button
                type="button"
                className={`atmosphere-swatch-btn crisp ${atmosphere === 'crisp' ? 'active' : ''}`}
                onClick={() => {
                  setAtmosphere('crisp');
                  onUpdatePreferences({ ...preferences, theme: 'white' });
                }}
              >
                <span>Crisp</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>White</span>
              </button>
              <button
                type="button"
                className={`atmosphere-swatch-btn sepia ${atmosphere === 'sepia' ? 'active' : ''}`}
                onClick={() => {
                  setAtmosphere('sepia');
                  onUpdatePreferences({ ...preferences, theme: 'ivory' });
                }}
              >
                <span>Sepia</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>Warm</span>
              </button>
              <button
                type="button"
                className={`atmosphere-swatch-btn slate ${atmosphere === 'slate' ? 'active' : ''}`}
                onClick={() => {
                  setAtmosphere('slate');
                  onUpdatePreferences({ ...preferences, theme: 'night' });
                }}
              >
                <span>Slate</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>Night</span>
              </button>
              <button
                type="button"
                className={`atmosphere-swatch-btn obsidian ${atmosphere === 'obsidian' ? 'active' : ''}`}
                onClick={() => {
                  setAtmosphere('obsidian');
                  onUpdatePreferences({ ...preferences, theme: 'night' });
                }}
              >
                <span>Obsidian</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>OLED</span>
              </button>
            </div>
          </div>

          {/* Section 2: Typeface */}
          <div className="settings-section-group">
            <span className="settings-section-label">Typeface</span>
            <div className="typeface-pills-row">
              <button
                type="button"
                className={`btn-typeface-choice ${typeface === 'serif' ? 'active' : ''}`}
                onClick={() => setTypeface('serif')}
              >
                <span className="typeface-choice-name" style={{ fontFamily: 'Georgia, serif' }}>Serif</span>
                <span className="typeface-choice-sub">Garamond</span>
              </button>
              <button
                type="button"
                className={`btn-typeface-choice ${typeface === 'sans' ? 'active' : ''}`}
                onClick={() => setTypeface('sans')}
              >
                <span className="typeface-choice-name" style={{ fontFamily: 'system-ui, sans-serif' }}>Sans</span>
                <span className="typeface-choice-sub">Modern Inter</span>
              </button>
              <button
                type="button"
                className={`btn-typeface-choice ${typeface === 'dyslexic' ? 'active' : ''}`}
                onClick={() => setTypeface('dyslexic')}
              >
                <span className="typeface-choice-name">Dyslexic</span>
                <span className="typeface-choice-sub">Legibility</span>
              </button>
            </div>
          </div>

          {/* Section 3: Font Size */}
          <div className="settings-section-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span className="settings-section-label" style={{ margin: 0 }}>Font Size</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--reader-accent)' }}>
                {preferences.fontSize === 'small'
                  ? '16px'
                  : preferences.fontSize === 'medium'
                  ? '18px'
                  : preferences.fontSize === 'large'
                  ? '21px'
                  : '24px'}
              </span>
            </div>
            <div className="reader-size-slider-wrap">
              <span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.7 }}>Aa</span>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                className="reader-size-range-input"
                value={
                  preferences.fontSize === 'small'
                    ? 0
                    : preferences.fontSize === 'medium'
                    ? 1
                    : preferences.fontSize === 'large'
                    ? 2
                    : 3
                }
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const sizes: ('small' | 'medium' | 'large' | 'xlarge')[] = ['small', 'medium', 'large', 'xlarge'];
                  onUpdatePreferences({ ...preferences, fontSize: sizes[v] });
                }}
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Aa</span>
            </div>
          </div>

          {/* Section 4: Line Spacing */}
          <div className="settings-section-group">
            <span className="settings-section-label">Line Spacing</span>
            <div className="typeface-pills-row">
              <button
                type="button"
                className={`btn-typeface-choice ${lineLeading === '1.4' ? 'active' : ''}`}
                onClick={() => setLineLeading('1.4')}
              >
                <span className="typeface-choice-name">1.4</span>
                <span className="typeface-choice-sub">Compact</span>
              </button>
              <button
                type="button"
                className={`btn-typeface-choice ${lineLeading === '1.8' ? 'active' : ''}`}
                onClick={() => setLineLeading('1.8')}
              >
                <span className="typeface-choice-name">1.8</span>
                <span className="typeface-choice-sub">Balanced</span>
              </button>
              <button
                type="button"
                className={`btn-typeface-choice ${lineLeading === '2.2' ? 'active' : ''}`}
                onClick={() => setLineLeading('2.2')}
              >
                <span className="typeface-choice-name">2.2</span>
                <span className="typeface-choice-sub">Airy</span>
              </button>
            </div>
          </div>

          {/* Section 5: Reading Width / Margins */}
          <div className="settings-section-group">
            <span className="settings-section-label">Reading Width</span>
            <div className="typeface-pills-row">
              <button
                type="button"
                className={`btn-typeface-choice ${readerMargin === 'narrow' ? 'active' : ''}`}
                onClick={() => setReaderMargin('narrow')}
              >
                <span className="typeface-choice-name">Narrow</span>
                <span className="typeface-choice-sub">Focused</span>
              </button>
              <button
                type="button"
                className={`btn-typeface-choice ${readerMargin === 'normal' ? 'active' : ''}`}
                onClick={() => setReaderMargin('normal')}
              >
                <span className="typeface-choice-name">Normal</span>
                <span className="typeface-choice-sub">Standard</span>
              </button>
              <button
                type="button"
                className={`btn-typeface-choice ${readerMargin === 'wide' ? 'active' : ''}`}
                onClick={() => setReaderMargin('wide')}
              >
                <span className="typeface-choice-name">Wide</span>
                <span className="typeface-choice-sub">Spacious</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Table of Contents Slide-Over Drawer with Search */}
      {tocOpen && readerMode !== 'pdf' && (
        <>
          <div
            className="reader-toc-backdrop"
            onClick={() => setTocOpen(false)}
            aria-hidden="true"
          />
          <aside className="reader-toc-drawer-modal" aria-label="Table of Contents">
            <div className="reader-toc-modal-header">
              <div>
                <h2 className="reader-toc-modal-title">{book.title}</h2>
                <p className="reader-toc-modal-subtitle">
                  By {book.author} • {chapters.length} Sections
                </p>
              </div>
              <button
                type="button"
                className="reader-toc-modal-close"
                onClick={() => setTocOpen(false)}
                aria-label="Close Table of Contents"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Filter */}
            <div className="reader-toc-search-wrap">
              <input
                type="search"
                className="reader-toc-search-input"
                placeholder="Search chapters &amp; sections…"
                value={tocSearchQuery}
                onChange={(e) => setTocSearchQuery(e.target.value)}
              />
            </div>

            {/* Chapter List */}
            <div className="reader-toc-scroll-list">
              {filteredChapters.map((chap, idx) => {
                const actualIndex = chapters.findIndex((c) => c.title === chap.title && c.number === chap.number);
                const isCurrent = actualIndex === chapterIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`reader-toc-item-btn ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      setChapterIndex(actualIndex >= 0 ? actualIndex : idx);
                      setTocOpen(false);
                    }}
                  >
                    <span className="reader-toc-item-num">{idx + 1}</span>
                    <div className="reader-toc-item-info">
                      <div className="reader-toc-item-title">{chap.title}</div>
                      {chap.epigraph && (
                        <div className="reader-toc-item-epigraph">{chap.epigraph}</div>
                      )}
                    </div>
                    {isCurrent && <span className="reader-toc-item-badge">Reading</span>}
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer Provenance */}
            <div className="reader-toc-drawer-footer">
              <div>
                <strong>Licence:</strong> {book.provenance.licenceName}
              </div>
              <div>
                <strong>Provider:</strong> {book.provenance.sourceProvider}
              </div>
              <div>
                <strong>Formats:</strong> {book.availableFormats.join(', ') || 'Web Edition'}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* 5. Main Reader Views */}

      {/* MODE 1: EPUB READER VIEW */}
      {readerMode === 'epub' ? (
        <div className="container epub-reader-container" style={{ minHeight: '85vh', padding: '1rem 0' }}>
          <EpubReaderView
            book={book}
            chapters={chapters}
            initialChapterIndex={chapterIndex}
            onProgressUpdate={(cIdx) => {
              setChapterIndex(cIdx);
            }}
            onClose={onExitReader}
          />
        </div>
      ) : readerMode === 'pdf' && canUsePdf ? (
        /* MODE 2: PDF READER VIEW */
        <div className="container pdf-reader-container">
          <PdfReaderView
            book={book}
            user={user}
            initialPage={savedPdfPage}
            theme={preferences.theme}
            onPageChange={handlePdfPageChange}
            onDownloadPdf={() => handleDirectDownload('pdf')}
            onRequireAuth={() => onRequireAuth(book)}
            onPurchaseSuccess={() => {
              if (onPurchaseSuccess) onPurchaseSuccess(book.id);
              setReloadCounter((c) => c + 1);
            }}
            onExitReader={onExitReader}
          />
        </div>
      ) : readerMode === 'text' ? (
        /* MODE 3: PLAIN TEXT CONTINUOUS STREAM */
        <article className="reader-manuscript-container plain-text-mode margin-normal">
          <header className="reader-chapter-header">
            <span className="reader-edition-badge">
              ARCHIVAL PLAIN TEXT STREAM • {book.provenance.sourceProvider.toUpperCase()}
            </span>
            <h1 className="reader-chapter-heading">{book.title}</h1>
            <p className="reader-chapter-epigraph">
              By {book.author} ({book.publishedYear}) • {book.provenance.licenceName}
            </p>
            {book.provenance.downloadPermitted && (
              <div className="plain-text-download-strip">
                <button
                  type="button"
                  className="btn-save-progress-inline"
                  onClick={() => handleDirectDownload('txt')}
                >
                  <Download size={13} />
                  <span>Download .TXT File</span>
                </button>
                <button
                  type="button"
                  className="btn-save-progress-inline"
                  onClick={() => handleDirectDownload('html')}
                >
                  <Download size={13} />
                  <span>Download .HTML File</span>
                </button>
              </div>
            )}
            <div className="reader-ornament-rule" aria-hidden="true" />
          </header>

          <div className="reader-prose-body plain-text-stream">
            {chapters.map((ch, cIdx) => (
              <section key={cIdx} className="plain-text-chapter-block">
                <h2 className="plain-text-chapter-title">
                  [{ch.number}] {ch.title}
                </h2>
                {ch.epigraph && <p className="plain-text-epigraph">“{ch.epigraph}”</p>}
                {ch.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      ) : loadingContent ? (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#173D2D', borderRadius: '50%', margin: '0 auto 1.25rem', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: 500 }}>Loading verified manuscript chapters…</p>
        </div>
      ) : isPurchaseRequired ? (
        <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '3rem 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Lock size={30} />
            </div>
            <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B45309', background: '#FEF3C7', padding: '0.25rem 0.75rem', borderRadius: '999px', marginBottom: '0.85rem' }}>
              Paid Author Edition
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.6rem', color: '#0F172A' }}>Purchase Required to Read Complete Book</h2>
            <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.75rem', fontSize: '0.98rem' }}>
              <em>{book.title}</em> by <strong>{book.author}</strong> requires a verified purchase before reading the complete manuscript.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setIsCheckoutOpen(true);
                }}
                style={{ background: '#173D2D', color: '#fff', border: 'none', padding: '0.8rem 1.6rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.98rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <DollarSign size={17} />
                <span>Buy eBook Now ({book.priceDisplay || `$${book.price ? book.price.toFixed(2) : '4.99'}`})</span>
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onExitReader}
                style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.8rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem' }}
              >
                Back to Book Details
              </button>
            </div>
            {isCheckoutOpen && (
              <CheckoutModal
                book={book}
                user={user}
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={() => {
                  setIsCheckoutOpen(false);
                  setIsPurchaseRequired(false);
                  setContentError(null);
                  if (onPurchaseSuccess) onPurchaseSuccess(book.id);
                  setReloadCounter((c) => c + 1);
                }}
                onRequireAuth={() => {
                  setIsCheckoutOpen(false);
                  onRequireAuth(book);
                }}
              />
            )}
          </div>
        </div>
      ) : contentError ? (
        <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '2.5rem 2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <FileText size={26} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.6rem', color: '#0F172A' }}>Manuscript Notice</h2>
            <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.75rem', fontSize: '0.95rem' }}>{contentError}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {canUsePdf && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => { setContentError(null); setReaderMode('pdf'); }}
                  style={{ background: '#173D2D', color: '#fff', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Open Original PDF Viewer
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline"
                onClick={onExitReader}
                style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.65rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Back to Book Details
              </button>
            </div>
          </div>
        </div>
      ) : chapters.length === 0 ? (
        <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '2.5rem 2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <BookOpen size={26} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.6rem', color: '#0F172A' }}>Manuscript Unavailable</h2>
            <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              This book's manuscript is currently unavailable. Please contact the publisher.
            </p>
            {canUsePdf ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setReaderMode('pdf')}
                style={{ background: '#173D2D', color: '#fff', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Open Original PDF Viewer
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline"
                onClick={onExitReader}
                style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.65rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Back to Book Details
              </button>
            )}
          </div>
        </div>
      ) : (
        /* MODE 4: EDITORIAL WEB MANUSCRIPT READER */
        <article className={`reader-manuscript-container margin-${readerMargin}`}>
          <header className="reader-chapter-header">
            <span className="reader-edition-badge">{book.rightsNote}</span>
            <p className="reader-chapter-number">{currentChapter.number}</p>
            <h1 className="reader-chapter-heading">{currentChapter.title}</h1>
            {currentChapter.epigraph && (
              <p className="reader-chapter-epigraph">“{currentChapter.epigraph}”</p>
            )}
            <div className="reader-ornament-rule" aria-hidden="true" />
          </header>

          <div
            className="reader-prose-body"
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            style={{
              fontFamily:
                typeface === 'sans'
                  ? 'system-ui, -apple-system, sans-serif'
                  : typeface === 'dyslexic'
                  ? 'OpenDyslexic, sans-serif'
                  : 'Georgia, "Times New Roman", serif',
              lineHeight: lineLeading,
              position: 'relative'
            }}
          >
            {/* Dynamic Selection Popup that floats directly over selected text */}
            {activeSelection && (
              <div
                className="reader-selection-floating-popup"
                style={{
                  left: `${activeSelection.x}px`,
                  top: `${activeSelection.y}px`
                }}
                role="toolbar"
                aria-label="Text Selection Tools"
              >
                <div className="highlight-dots-row">
                  <button
                    type="button"
                    className="highlight-color-dot"
                    style={{ backgroundColor: '#FDE047' }}
                    onClick={() => applyHighlight('yellow')}
                    title="Highlight Yellow"
                  />
                  <button
                    type="button"
                    className="highlight-color-dot"
                    style={{ backgroundColor: '#86EFAC' }}
                    onClick={() => applyHighlight('mint')}
                    title="Highlight Mint"
                  />
                  <button
                    type="button"
                    className="highlight-color-dot"
                    style={{ backgroundColor: '#93C5FD' }}
                    onClick={() => applyHighlight('sky')}
                    title="Highlight Sky"
                  />
                  <button
                    type="button"
                    className="highlight-color-dot"
                    style={{ backgroundColor: '#F472B6' }}
                    onClick={() => applyHighlight('rose')}
                    title="Highlight Rose"
                  />
                  <button
                    type="button"
                    className="highlight-color-dot"
                    style={{ backgroundColor: '#C084FC' }}
                    onClick={() => applyHighlight('purple')}
                    title="Highlight Purple"
                  />
                </div>
                <button
                  type="button"
                  className="highlight-action-btn"
                  onClick={() => handleCopyExcerpt(activeSelection.text)}
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  className="highlight-action-btn"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: book.title,
                        text: `“${activeSelection.text}” — from ${book.title}`,
                        url: window.location.href
                      }).catch(() => {});
                    } else {
                      handleCopyExcerpt(activeSelection.text);
                    }
                    setActiveSelection(null);
                  }}
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
              </div>
            )}

            {/* Ambient Highlight Toolbar (Permanent header banner for chapter tools) */}
            <div className="reader-floating-highlight-bar" role="toolbar" aria-label="Reading Tools">
              <div className="highlight-dots-row">
                <button
                  type="button"
                  className="highlight-color-dot"
                  style={{ backgroundColor: '#FDE047' }}
                  onClick={() => {
                    setProgressSavedToast('Select any text in the chapter to highlight');
                    setTimeout(() => setProgressSavedToast(''), 2500);
                  }}
                  title="Select text to highlight yellow"
                />
                <button
                  type="button"
                  className="highlight-color-dot"
                  style={{ backgroundColor: '#86EFAC' }}
                  onClick={() => {
                    setProgressSavedToast('Select any text in the chapter to highlight');
                    setTimeout(() => setProgressSavedToast(''), 2500);
                  }}
                  title="Select text to highlight mint"
                />
                <button
                  type="button"
                  className="highlight-color-dot"
                  style={{ backgroundColor: '#93C5FD' }}
                  onClick={() => {
                    setProgressSavedToast('Select any text in the chapter to highlight');
                    setTimeout(() => setProgressSavedToast(''), 2500);
                  }}
                  title="Select text to highlight sky"
                />
                <button
                  type="button"
                  className="highlight-color-dot"
                  style={{ backgroundColor: '#F472B6' }}
                  onClick={() => {
                    setProgressSavedToast('Select any text in the chapter to highlight');
                    setTimeout(() => setProgressSavedToast(''), 2500);
                  }}
                  title="Select text to highlight rose"
                />
                <button
                  type="button"
                  className="highlight-color-dot"
                  style={{ backgroundColor: '#C084FC' }}
                  onClick={() => {
                    setProgressSavedToast('Select any text in the chapter to highlight');
                    setTimeout(() => setProgressSavedToast(''), 2500);
                  }}
                  title="Select text to highlight purple"
                />
              </div>
              <button type="button" className="highlight-action-btn" onClick={() => handleCopyExcerpt()}>
                {copiedFeedback ? <Check size={13} color="#86EFAC" /> : <Copy size={13} />}
                <span>{copiedFeedback ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                className="highlight-action-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: book.title,
                      text: `Reading ${book.title} on Understory`,
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    handleCopyExcerpt();
                  }
                }}
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>
            </div>

            {/* Paragraphs with Refined Drop Cap & In-Text Highlight Rendering */}
            {currentChapter.content.map((paragraph, pIdx) => {
              // Find highlights matching this chapter and paragraph
              const matchingHighlights = highlights.filter(
                (h) => h.chapterIndex === chapterIndex && h.paragraphIndex === pIdx
              );

              // Render text with embedded highlight spans
              const renderParagraphContent = (text: string) => {
                if (matchingHighlights.length === 0) return text;

                // Sort highlights by length descending to match longer phrases first
                const sortedHls = [...matchingHighlights].sort((a, b) => b.text.length - a.text.length);

                // Build segments
                let segments: Array<{ text: string; highlight?: BookHighlight }> = [{ text }];

                for (const hl of sortedHls) {
                  const newSegments: Array<{ text: string; highlight?: BookHighlight }> = [];
                  for (const seg of segments) {
                    if (seg.highlight) {
                      newSegments.push(seg);
                      continue;
                    }

                    const idx = seg.text.indexOf(hl.text);
                    if (idx !== -1) {
                      const before = seg.text.substring(0, idx);
                      const match = seg.text.substring(idx, idx + hl.text.length);
                      const after = seg.text.substring(idx + hl.text.length);
                      if (before) newSegments.push({ text: before });
                      newSegments.push({ text: match, highlight: hl });
                      if (after) newSegments.push({ text: after });
                    } else {
                      newSegments.push(seg);
                    }
                  }
                  segments = newSegments;
                }

                return (
                  <>
                    {segments.map((s, sIdx) =>
                      s.highlight ? (
                        <mark
                          key={sIdx}
                          className={`reader-highlight-text reader-highlight-${s.highlight.color}`}
                          title={`Highlighted on ${new Date(s.highlight.createdAt).toLocaleDateString()} • Click to remove`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Remove this highlight?')) {
                              removeHighlight(s.highlight!.id);
                            }
                          }}
                        >
                          {s.text}
                        </mark>
                      ) : (
                        s.text
                      )
                    )}
                  </>
                );
              };

              if (pIdx === 0) {
                const firstChar = paragraph.charAt(0);
                const rest = paragraph.slice(1);
                return (
                  <p key={pIdx} data-paragraph-index={pIdx} className="reader-dropcap-paragraph">
                    <span className="reader-drop-cap">{firstChar}</span>
                    {renderParagraphContent(rest)}
                  </p>
                );
              }

              return (
                <p key={pIdx} data-paragraph-index={pIdx}>
                  {renderParagraphContent(paragraph)}
                </p>
              );
            })}
          </div>

          {/* End of Chapter Navigation & Controls */}
          <footer className="reader-chapter-footer">
            <div className="reader-progress-summary">
              <span>
                Section {chapterIndex + 1} of {chapters.length} in Web Reader •{' '}
                <strong>{overallProgress}% Read</strong>
              </span>

              <div className="reader-progress-actions-inline">
                {chapterIndex > 0 && (
                  <button
                    type="button"
                    className="btn-save-progress-inline"
                    onClick={() => setChapterIndex(0)}
                    title="Return to the very first chapter"
                  >
                    <RotateCcw size={13} />
                    <span>Restart from Chapter 1</span>
                  </button>
                )}

                {book.gutenbergId && !gutenbergExpanded && (
                  <button
                    type="button"
                    className="btn-save-progress-inline"
                    disabled={loadingGutenberg}
                    onClick={handleLoadLiveGutenberg}
                  >
                    <BookOpen size={13} />
                    <span>
                      {loadingGutenberg
                        ? 'Fetching Archive…'
                        : 'Load Extended Gutenberg Text'}
                    </span>
                  </button>
                )}

                {user && (
                  <button
                    type="button"
                    className="btn-save-progress-inline"
                    onClick={handleManualSaveProgress}
                    title="Sync current progress with your cloud library"
                  >
                    <CheckCircle2 size={13} />
                    <span>{progressSavedToast || 'Sync Progress'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Next / Previous Tactile Cards */}
            <div className="reader-chapter-nav">
              <button
                type="button"
                className="reader-nav-btn"
                disabled={chapterIndex <= 0}
                onClick={() => setChapterIndex((c) => Math.max(0, c - 1))}
              >
                <ChevronLeft size={18} />
                <div className="reader-nav-btn-info">
                  <span className="reader-nav-btn-label">Previous Section</span>
                  <span className="reader-nav-btn-title">
                    {prevChapter ? prevChapter.title : 'Beginning of Book'}
                  </span>
                </div>
              </button>

              {nextChapter ? (
                <button
                  type="button"
                  className="reader-nav-btn primary"
                  onClick={() => setChapterIndex((c) => Math.min(chapters.length - 1, c + 1))}
                >
                  <div className="reader-nav-btn-info" style={{ textAlign: 'right' }}>
                    <span className="reader-nav-btn-label">Next Section</span>
                    <span className="reader-nav-btn-title">{nextChapter.title}</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  className="reader-nav-btn primary"
                  onClick={() => onViewBookDetails(book.id)}
                >
                  <div className="reader-nav-btn-info" style={{ textAlign: 'right' }}>
                    <span className="reader-nav-btn-label">Finished Reading</span>
                    <span className="reader-nav-btn-title">Return to Book Overview</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            {/* External Sources & Repositories */}
            {book.externalSources && book.externalSources.length > 0 && (
              <div className="reader-external-sources-box">
                <p className="reader-external-note">
                  {book.accessType === 'full-text'
                    ? 'Download complete archival files (PDF, EPUB, Plain Text) above or explore verified partner repositories:'
                    : 'End of sample preview. Explore the full bibliographic record and lending options via our verified external sources:'}
                </p>
                <div className="external-sources-links">
                  {book.externalSources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-source-chip"
                    >
                      <span>{src.label}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </footer>
        </article>
      )}
    </div>
  );
};

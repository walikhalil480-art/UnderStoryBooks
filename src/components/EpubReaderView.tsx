import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  List,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Type,
  Bookmark,
  Check,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { Book, ChapterSample } from '../types';
import { folioApi } from '../services/api';

interface EpubReaderViewProps {
  book: Book;
  chapters: ChapterSample[];
  initialChapterIndex?: number;
  onProgressUpdate?: (chapterIndex: number, scrollPct: number, overallPct: number) => void;
  onClose?: () => void;
}

type ThemeMode = 'ivory' | 'white' | 'sepia' | 'dark';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type LineWidth = 'narrow' | 'medium' | 'wide';
type FontStyle = 'serif' | 'sans';

const THEME_STYLES: Record<ThemeMode, { bg: string; text: string; headerBg: string; border: string; accent: string }> = {
  ivory: {
    bg: '#FDFBF7',
    text: '#2D2926',
    headerBg: '#F7F2E7',
    border: '#E8DFC8',
    accent: '#B45309'
  },
  white: {
    bg: '#FFFFFF',
    text: '#1F2937',
    headerBg: '#F9FAFB',
    border: '#E5E7EB',
    accent: '#047857'
  },
  sepia: {
    bg: '#F4ECD8',
    text: '#433422',
    headerBg: '#EBDDC0',
    border: '#D8C7A5',
    accent: '#854D0E'
  },
  dark: {
    bg: '#18181B',
    text: '#E4E4E7',
    headerBg: '#27272A',
    border: '#3F3F46',
    accent: '#38BDF8'
  }
};

const FONT_SIZES: Record<FontSize, { label: string; px: string }> = {
  sm: { label: 'Small', px: '16px' },
  md: { label: 'Standard', px: '18px' },
  lg: { label: 'Large', px: '21px' },
  xl: { label: 'Reading+', px: '24px' }
};

const LINE_WIDTHS: Record<LineWidth, string> = {
  narrow: '640px',
  medium: '768px',
  wide: '920px'
};

export const EpubReaderView: React.FC<EpubReaderViewProps> = ({
  book,
  chapters,
  initialChapterIndex = 0,
  onProgressUpdate,
  onClose
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(initialChapterIndex);
  const [theme, setTheme] = useState<ThemeMode>('ivory');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [lineWidth, setLineWidth] = useState<LineWidth>('medium');
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentChapter = chapters[currentChapterIndex] || chapters[0];
  const totalChapters = Math.max(1, chapters.length);
  const progressPercent = Math.round(((currentChapterIndex + 1) / totalChapters) * 100);

  // Sync initialChapterIndex
  useEffect(() => {
    if (initialChapterIndex >= 0 && initialChapterIndex < chapters.length) {
      setCurrentChapterIndex(initialChapterIndex);
    }
  }, [initialChapterIndex, chapters.length]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    if (onProgressUpdate) {
      onProgressUpdate(currentChapterIndex, 0, progressPercent);
    }
  }, [currentChapterIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' && currentChapterIndex < totalChapters - 1) {
        setCurrentChapterIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentChapterIndex > 0) {
        setCurrentChapterIndex((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, totalChapters]);

  const handleNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleBookmark = async () => {
    try {
      await folioApi.toggleOrAddBookmark({
        bookId: book.id,
        chapterIndex: currentChapterIndex,
        chapterTitle: currentChapter?.title || `Chapter ${currentChapterIndex + 1}`
      });
      setBookmarked(true);
      setBookmarkFeedback('Chapter bookmarked!');
      setTimeout(() => setBookmarkFeedback(null), 2500);
    } catch (err: any) {
      setBookmarkFeedback(err.message || 'Please sign in to bookmark');
      setTimeout(() => setBookmarkFeedback(null), 3000);
    }
  };

  const themeStyle = THEME_STYLES[theme];

  if (chapters.length === 0) {
    return (
      <div className="pdf-reader-state-box error" role="alert" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '600px', margin: '3rem auto', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', color: '#0F172A' }}>Manuscript Unavailable</h3>
        <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>This book's manuscript is currently unavailable. Please contact the publisher.</p>
        {onClose && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '0.55rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
          >
            Back to Book Details
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full select-text transition-colors duration-200"
      style={{ backgroundColor: themeStyle.bg, color: themeStyle.text }}
    >
      {/* Top Controls Bar */}
      <header
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0 z-20"
        style={{ backgroundColor: themeStyle.headerBg, borderColor: themeStyle.border }}
      >
        <div className="flex items-center space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:opacity-80 transition-opacity flex items-center gap-1 text-sm font-medium"
              title="Return to Book Details"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold tracking-wider uppercase border hover:opacity-80 transition-opacity"
            style={{ borderColor: themeStyle.border }}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Contents ({totalChapters})</span>
          </button>

          <div className="hidden lg:block">
            <h1 className="text-sm font-serif font-bold truncate max-w-xs">{book.title}</h1>
            <p className="text-xs opacity-70 truncate max-w-xs">{book.author}</p>
          </div>
        </div>

        {/* Center Progress Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="opacity-75">
            {currentChapterIndex + 1} / {totalChapters}
          </span>
          <div className="w-20 sm:w-28 h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-semibold text-amber-700">{progressPercent}%</span>
        </div>

        {/* Right Reader Customization Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Theme Selector */}
          <div className="flex items-center border rounded p-0.5" style={{ borderColor: themeStyle.border }}>
            <button
              onClick={() => setTheme('ivory')}
              className={`w-6 h-6 rounded-sm text-xs font-serif ${theme === 'ivory' ? 'ring-2 ring-amber-500' : ''}`}
              style={{ backgroundColor: '#FDFBF7', color: '#2D2926' }}
              title="Ivory Paper"
            >
              I
            </button>
            <button
              onClick={() => setTheme('white')}
              className={`w-6 h-6 rounded-sm text-xs ${theme === 'white' ? 'ring-2 ring-emerald-600' : ''}`}
              style={{ backgroundColor: '#FFFFFF', color: '#111827' }}
              title="White Clean"
            >
              W
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`w-6 h-6 rounded-sm text-xs ${theme === 'sepia' ? 'ring-2 ring-amber-700' : ''}`}
              style={{ backgroundColor: '#F4ECD8', color: '#433422' }}
              title="Sepia Vintage"
            >
              S
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-6 h-6 rounded-sm text-xs ${theme === 'dark' ? 'ring-2 ring-sky-400' : ''}`}
              style={{ backgroundColor: '#18181B', color: '#FFFFFF' }}
              title="Dark Mode"
            >
              D
            </button>
          </div>

          {/* Font Size Cycle */}
          <button
            onClick={() => {
              const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
              const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
              setFontSize(next);
            }}
            className="p-1.5 rounded border text-xs font-semibold hover:opacity-80 flex items-center gap-0.5"
            style={{ borderColor: themeStyle.border }}
            title={`Font Size: ${FONT_SIZES[fontSize].label}`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">{fontSize.toUpperCase()}</span>
          </button>

          {/* Serif / Sans Toggle */}
          <button
            onClick={() => setFontStyle(fontStyle === 'serif' ? 'sans' : 'serif')}
            className="hidden sm:inline-flex px-2 py-1 rounded border text-xs font-medium hover:opacity-80"
            style={{ borderColor: themeStyle.border }}
            title="Toggle Serif / Sans Font"
          >
            {fontStyle === 'serif' ? 'Serif' : 'Sans'}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded border hover:opacity-80 text-amber-700 relative"
            style={{ borderColor: themeStyle.border }}
            title="Bookmark this chapter"
          >
            {bookmarked ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:inline-flex p-1.5 rounded border hover:opacity-80"
            style={{ borderColor: themeStyle.border }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Direct EPUB Download link */}
          <a
            href={`/api/reader/${encodeURIComponent(book.id)}/epub`}
            download={`${book.id}-edition.epub`}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-700 text-white hover:bg-amber-800 transition-colors"
            title="Download full EPUB file for e-readers"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EPUB File</span>
          </a>
        </div>
      </header>

      {/* Main Reading Canvas & Sidebar Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {isSidebarOpen && (
          <aside
            className="w-72 sm:w-80 border-r flex flex-col flex-shrink-0 z-30 transition-all duration-200"
            style={{ backgroundColor: themeStyle.headerBg, borderColor: themeStyle.border }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: themeStyle.border }}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider">Chapters & Sections</h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-xs font-bold px-2 py-1 rounded hover:bg-black/10"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 divide-y divide-black/5">
              {chapters.map((chap, idx) => {
                const isActive = idx === currentChapterIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors flex items-start gap-2.5 ${
                      isActive ? 'bg-amber-600/15 font-semibold text-amber-900' : 'hover:bg-black/5 opacity-85'
                    }`}
                  >
                    <span className="font-mono text-xs opacity-60 mt-0.5">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="line-clamp-2">{chap.title}</p>
                      {chap.epigraph && (
                        <p className="text-[11px] opacity-60 italic mt-0.5 truncate">{chap.epigraph}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t text-[11px] opacity-70" style={{ borderColor: themeStyle.border }}>
              <p className="font-semibold">{book.publisher}</p>
              <p>Licence: {book.provenance.licenceName}</p>
            </div>
          </aside>
        )}

        {/* Reading Article Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex justify-center">
          <article
            className="w-full transition-all duration-150"
            style={{
              maxWidth: LINE_WIDTHS[lineWidth],
              fontSize: FONT_SIZES[fontSize].px,
              fontFamily: fontStyle === 'serif' ? 'Newsreader, Georgia, serif' : 'DM Sans, system-ui, sans-serif',
              lineHeight: 1.85
            }}
          >
            {/* Chapter Header */}
            <header className="mb-10 text-center border-b pb-8" style={{ borderColor: themeStyle.border }}>
              <span className="text-xs font-mono tracking-widest uppercase opacity-60 block mb-2">
                Chapter {currentChapterIndex + 1} of {totalChapters}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-4">
                {currentChapter?.title || `Chapter ${currentChapterIndex + 1}`}
              </h1>
              {currentChapter?.epigraph && (
                <blockquote
                  className="italic opacity-75 max-w-md mx-auto text-sm sm:text-base border-l-2 pl-4 text-left my-4"
                  style={{ borderColor: themeStyle.accent }}
                >
                  {currentChapter.epigraph}
                </blockquote>
              )}
            </header>

            {/* Chapter Paragraphs */}
            <div className="space-y-6">
              {currentChapter?.content && currentChapter.content.length > 0 ? (
                currentChapter.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-justify leading-relaxed tracking-normal indent-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="py-12 text-center opacity-70 italic">
                  <p>No preview paragraphs available for this section.</p>
                </div>
              )}
            </div>

            {/* Chapter Bottom Navigation Footer */}
            <footer
              className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ borderColor: themeStyle.border }}
            >
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className="w-full sm:w-auto px-5 py-2.5 rounded border text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                style={{ borderColor: themeStyle.border }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Chapter
              </button>

              <div className="text-xs font-mono opacity-60 text-center">
                {book.title} • {book.author}
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex >= totalChapters - 1}
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-amber-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-800 transition-colors"
              >
                Next Chapter
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          </article>
        </div>
      </div>

      {/* Floating feedback toast */}
      {bookmarkFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2 border border-neutral-700 animate-fadeIn">
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>{bookmarkFeedback}</span>
        </div>
      )}
    </div>
  );
};

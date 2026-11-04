import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MoveHorizontal,
  FileCheck2,
  Lock,
  DollarSign,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { Book, UserProfile } from '../types';
import { folioApi } from '../services/api';
import { CheckoutModal } from './CheckoutModal';

// Configure PDF.js Worker via an explicit application/javascript Blob URL to prevent MIME or cache issues
let cachedWorkerBlobUrl: string | null = null;

async function ensurePdfWorkerReady(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (cachedWorkerBlobUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = cachedWorkerBlobUrl;
    return;
  }
  try {
    const res = await fetch(`/pdf.worker.min.js?v=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const code = await res.text();
      if (code && code.length > 1000) {
        const workerBlob = new Blob([code], { type: 'application/javascript' });
        cachedWorkerBlobUrl = URL.createObjectURL(workerBlob);
        pdfjsLib.GlobalWorkerOptions.workerSrc = cachedWorkerBlobUrl;
        return;
      }
    }
  } catch {}
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js?v=4';
}

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js?v=4';
}

interface PdfReaderViewProps {
  book: Book;
  user?: UserProfile | null;
  initialPage?: number;
  theme: 'ivory' | 'white' | 'night';
  onPageChange: (currentPage: number, totalPages: number) => void;
  onDownloadPdf: () => void;
  onRequireAuth: () => void;
  onPurchaseSuccess?: () => void;
  onExitReader?: () => void;
}

export const PdfReaderView: React.FC<PdfReaderViewProps> = ({
  book,
  user,
  initialPage = 1,
  theme,
  onPageChange,
  onDownloadPdf,
  onRequireAuth,
  onPurchaseSuccess,
  onExitReader
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPurchaseRequired, setIsPurchaseRequired] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pdfByteSize, setPdfByteSize] = useState<number>(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(Math.max(1, initialPage));
  const [pageInput, setPageInput] = useState<string>(String(Math.max(1, initialPage)));
  const [zoomScale, setZoomScale] = useState<number>(1.15);
  const [fitMode, setFitMode] = useState<'custom' | 'width' | 'page'>('width');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [useNativeEmbed, setUseNativeEmbed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load the genuine manuscript PDF document via PDF.js
  useEffect(() => {
    let active = true;
    let createdBlobUrl: string | null = null;
    let loadingTask: any = null;

    setLoading(true);
    setErrorMessage(null);

    folioApi
      .getPdfDocumentBuffer(book.id)
      .then(async ({ data }) => {
        if (!active) return;

        try {
          await ensurePdfWorkerReady();
          const blob = new Blob([data], { type: 'application/pdf' });
          createdBlobUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(createdBlobUrl);
          setPdfByteSize(data.length);

          loadingTask = pdfjsLib.getDocument({
            data: data,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@6.4.299/cmaps/',
            cMapPacked: true
          });

          const doc = await loadingTask.promise;
          if (!active) return;

          const numPages = Math.max(1, doc.numPages);
          setPdfDoc(doc);
          setTotalPages(numPages);

          const validStart = Math.min(Math.max(1, initialPage), numPages);
          setCurrentPage(validStart);
          setPageInput(String(validStart));
          setLoading(false);
          onPageChange(validStart, numPages);
        } catch (parseErr: any) {
          if (!active) return;
          console.error('[PDF.js Document Parse Error]:', parseErr);
          setErrorMessage(
            parseErr?.message || 'Failed to parse the uploaded PDF document structure.'
          );
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!active) return;
        if (err?.status === 401 || err?.code === 'AUTHENTICATION_REQUIRED') {
          onRequireAuth();
          return;
        }
        if (
          err?.status === 402 ||
          err?.code === 'PURCHASE_REQUIRED' ||
          err?.message?.toLowerCase().includes('purchased') ||
          err?.message?.toLowerCase().includes('purchase')
        ) {
          setIsPurchaseRequired(true);
          setErrorMessage(err?.message || 'This premium edition must be purchased before reading the full PDF.');
          setLoading(false);
          return;
        }
        setErrorMessage(
          err?.message || 'Unable to load or verify the PDF manuscript for this edition.'
        );
        setLoading(false);
      });

    return () => {
      active = false;
      if (loadingTask && loadingTask.destroy) {
        loadingTask.destroy().catch(() => {});
      }
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [book.id, reloadKey]);

  // Sync when initialPage updates from saved reading progress
  useEffect(() => {
    if (totalPages > 0 && initialPage >= 1 && initialPage <= totalPages) {
      setCurrentPage(initialPage);
      setPageInput(String(initialPage));
    }
  }, [initialPage, totalPages]);

  const goToPage = useCallback(
    (target: number) => {
      if (!pdfDoc || totalPages === 0) return;
      const clamped = Math.min(Math.max(1, target), totalPages);
      setCurrentPage(clamped);
      setPageInput(String(clamped));
      onPageChange(clamped, totalPages);
    },
    [pdfDoc, totalPages, onPageChange]
  );

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPage(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToPage(currentPage + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, goToPage]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Render the current genuine PDF page onto the HTML5 Canvas
  useEffect(() => {
    if (loading || errorMessage || !pdfDoc || useNativeEmbed) return;

    let cancelRender = false;
    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (cancelRender) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        let scale = zoomScale;
        const unscaledViewport = page.getViewport({ scale: 1 });

        if (containerRef.current) {
          const availableWidth = Math.max(320, containerRef.current.clientWidth - 48);
          if (fitMode === 'width') {
            scale = availableWidth / unscaledViewport.width;
          } else if (fitMode === 'page') {
            const availableHeight = Math.max(480, window.innerHeight - 220);
            scale = Math.min(
              availableWidth / unscaledViewport.width,
              availableHeight / unscaledViewport.height
            );
          }
        }

        const viewport = page.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

        canvas.width = Math.round(viewport.width * dpr);
        canvas.height = Math.round(viewport.height * dpr);
        canvas.style.width = `${Math.round(viewport.width)}px`;
        canvas.style.height = `${Math.round(viewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        const pageBg = theme === 'night' ? '#1E201D' : theme === 'white' ? '#FFFFFF' : '#FCFBF7';
        ctx.fillStyle = pageBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('[PDF.js Page Render Error]:', err);
        }
      }
    };

    renderPage();

    return () => {
      cancelRender = true;
      if (renderTask && renderTask.cancel) {
        renderTask.cancel();
      }
    };
  }, [loading, errorMessage, pdfDoc, currentPage, zoomScale, fitMode, theme, useNativeEmbed]);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!Number.isNaN(parsed)) {
      goToPage(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  if (loading) {
    return (
      <div className="pdf-reader-state-box" role="status" aria-live="polite">
        <Loader2 size={28} className="spin-icon" />
        <h3>Loading &amp; Verifying Original PDF Manuscript…</h3>
        <p>
          Streaming <em>{book.title}</em> and initializing document renderer.
        </p>
      </div>
    );
  }

  if (isPurchaseRequired) {
    const formattedPrice =
      book.priceDisplay ||
      (book.currency === 'KES'
        ? `KES ${book.price}`
        : book.currency === 'SOS'
        ? `SOS ${book.price}`
        : `$${Number(book.price || 0).toFixed(2)} USD`);

    return (
      <div
        className="pdf-reader-state-box"
        role="alert"
        style={{
          maxWidth: '560px',
          margin: '3.5rem auto',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#FEF3C7',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <Lock size={30} />
        </div>

        <span
          style={{
            display: 'inline-block',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#B45309',
            background: '#FEF3C7',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            marginBottom: '0.85rem'
          }}
        >
          Paid Author Edition
        </span>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
          Purchase Required to Read Complete Book
        </h2>

        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          <em>{book.title}</em> by <strong>{book.author}</strong> requires a verified purchase before opening the complete manuscript.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setIsCheckoutOpen(true);
            }}
            style={{
              background: '#173D2D',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              fontSize: '0.98rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(23, 61, 45, 0.25)'
            }}
          >
            <DollarSign size={17} />
            <span>Buy eBook Now ({formattedPrice})</span>
          </button>

          {onExitReader && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onExitReader}
              style={{
                background: '#F8FAFC',
                color: '#334155',
                border: '1px solid #CBD5E1',
                padding: '0.8rem 1.3rem',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Book Details
            </button>
          )}
        </div>

        {/* In-Reader Checkout Modal */}
        {isCheckoutOpen && (
          <CheckoutModal
            book={book}
            user={user || null}
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={() => {
              setIsCheckoutOpen(false);
              setIsPurchaseRequired(false);
              setErrorMessage(null);
              setReloadKey((k) => k + 1);
              if (onPurchaseSuccess) onPurchaseSuccess();
            }}
            onRequireAuth={() => {
              setIsCheckoutOpen(false);
              onRequireAuth();
            }}
          />
        )}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="pdf-reader-state-box error" role="alert">
        <AlertCircle size={28} />
        <h3>PDF Manuscript Unavailable</h3>
        <p>{errorMessage}</p>
        {onExitReader && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onExitReader}
            style={{
              marginTop: '1.25rem',
              background: '#FFFFFF',
              color: '#334155',
              border: '1px solid #CBD5E1',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Back to Book Details
          </button>
        )}
      </div>
    );
  }

  const pctComplete = Math.round((currentPage / Math.max(1, totalPages)) * 100);

  return (
    <div ref={containerRef} className={`pdf-reader-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {/* PDF Reader Control Toolbar */}
      <div className="pdf-reader-toolbar" role="toolbar" aria-label="PDF Reader Controls">
        <div className="pdf-toolbar-group">
          <button
            type="button"
            className="pdf-ctrl-btn"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            aria-label="Previous PDF Page"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          <form onSubmit={handlePageInputSubmit} className="pdf-page-indicator-form">
            <label htmlFor="pdf-page-jump-input" className="sr-only">
              Current PDF Page
            </label>
            <span>Page</span>
            <input
              id="pdf-page-jump-input"
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => {
                const parsed = parseInt(pageInput, 10);
                if (!Number.isNaN(parsed)) goToPage(parsed);
                else setPageInput(String(currentPage));
              }}
              className="pdf-page-input"
              aria-label="Page number"
            />
            <span>of {totalPages}</span>
          </form>

          <button
            type="button"
            className="pdf-ctrl-btn"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            aria-label="Next PDF Page"
            title="Next Page (Right Arrow)"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>

          {currentPage > 1 && (
            <button
              type="button"
              className="pdf-ctrl-btn subtle"
              onClick={() => goToPage(1)}
              title="Restart from Page 1"
            >
              <RotateCcw size={14} />
              <span className="hide-sm">Page 1</span>
            </button>
          )}
        </div>

        {/* Zoom & Fit Controls */}
        <div className="pdf-toolbar-group">
          <button
            type="button"
            className="pdf-ctrl-btn"
            onClick={() => {
              setFitMode('custom');
              setZoomScale((s) => Math.max(0.65, Number((s - 0.15).toFixed(2))));
            }}
            aria-label="Zoom Out"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="pdf-zoom-readout">{Math.round(zoomScale * 100)}%</span>
          <button
            type="button"
            className="pdf-ctrl-btn"
            onClick={() => {
              setFitMode('custom');
              setZoomScale((s) => Math.min(2.0, Number((s + 0.15).toFixed(2))));
            }}
            aria-label="Zoom In"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            className={`pdf-ctrl-btn ${fitMode === 'width' ? 'active' : ''}`}
            onClick={() => {
              setFitMode('width');
              setZoomScale(1.15);
            }}
            title="Fit to Width"
          >
            <MoveHorizontal size={14} />
            <span className="hide-sm">Fit Width</span>
          </button>

          <button
            type="button"
            className={`pdf-ctrl-btn ${fitMode === 'page' ? 'active' : ''}`}
            onClick={() => {
              setFitMode('page');
              setZoomScale(0.95);
            }}
            title="Fit to Page"
          >
            <FileText size={14} />
            <span className="hide-sm">Fit Page</span>
          </button>
        </div>

        {/* Right Utilities: Verified Badge, Native PDF Toggle, Fullscreen, Download */}
        <div className="pdf-toolbar-group">
          <span
            className="pdf-verified-pill"
            title={`Original Author Manuscript PDF (${(pdfByteSize / 1024).toFixed(1)} KB, ${totalPages} pages)`}
          >
            <FileCheck2 size={13} />
            <span>
              PDF Verified ({totalPages}p • {(pdfByteSize / 1024).toFixed(0)} KB)
            </span>
          </span>

          <button
            type="button"
            className={`pdf-ctrl-btn ${useNativeEmbed ? 'active' : ''}`}
            onClick={() => setUseNativeEmbed((v) => !v)}
            title="Switch between Canvas High-DPI Renderer and Native Browser PDF Viewer"
          >
            <span>{useNativeEmbed ? 'Canvas View' : 'Native PDF'}</span>
          </button>

          <button
            type="button"
            className="pdf-ctrl-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            title={isFullscreen ? 'Exit Fullscreen' : 'Full-Screen Reading Mode'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <button
            type="button"
            className="pdf-ctrl-btn primary"
            onClick={onDownloadPdf}
            title="Download Complete PDF File"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main PDF Page Stage */}
      <div className="pdf-canvas-stage">
        {useNativeEmbed && pdfBlobUrl ? (
          <object
            data={`${pdfBlobUrl}#page=${currentPage}`}
            type="application/pdf"
            className="pdf-native-embed-object"
            aria-label={`PDF document for ${book.title}`}
          >
            <p>Your browser does not support inline PDF embedding. Use Canvas View or Download PDF above.</p>
          </object>
        ) : (
          <div className="pdf-canvas-paper-shadow">
            <canvas
              ref={canvasRef}
              className="pdf-page-canvas"
              aria-label={`${book.title} — PDF Page ${currentPage} of ${totalPages}`}
            />
          </div>
        )}
      </div>

      {/* Bottom PDF Pagination & Progress Footer */}
      <div className="pdf-reader-bottombar">
        <div className="pdf-bottom-meta">
          <span>
            Reading <strong>{book.title}</strong> (PDF Edition) • Page <strong>{currentPage}</strong> of{' '}
            <strong>{totalPages}</strong> ({pctComplete}% Complete)
          </span>
        </div>
        <div className="pdf-bottom-actions">
          <button
            type="button"
            className="reader-nav-btn"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft size={16} />
            <span>Previous Page</span>
          </button>
          <button
            type="button"
            className="reader-nav-btn primary"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <span>Next Page</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

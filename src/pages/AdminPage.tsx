import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  FileCode,
  FileText,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  X,
  Save,
  Eye,
  BookPlus,
  Download,
  ExternalLink,
  DollarSign,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { BOOKS, CATEGORIES, syncBookUpdate, syncBookDelete } from '../data/books';
import { folioApi } from '../services/api';
import { Book, EbookAccessStatus, UserProfile, AdminFinancialsSummary, OrderRecord, AdminNotification } from '../types';
import { UnderstoryLogo } from '../components/UnderstoryLogo';

interface AdminPageProps {
  user: UserProfile | null;
  onRequireAuth: () => void;
  onNavigateHome: () => void;
}

type AdminTab = 'catalogue' | 'submissions' | 'complaints' | 'financials' | 'audit';

const ACCESS_STATUS_OPTIONS: Array<{ value: EbookAccessStatus; label: string }> = [
  { value: 'free_full_text', label: 'Free Full-Text Reading' },
  { value: 'free_download', label: 'Free Authorised Download' },
  { value: 'paid_purchase', label: 'Paid Individual Purchase' },
  { value: 'preview_only', label: 'Authorised Preview Only' },
  { value: 'external_reading', label: 'External Authorised Portal' },
  { value: 'metadata_only', label: 'Metadata Record Only' },
  { value: 'unavailable', label: 'Unavailable / Restricted' }
];

interface BookFormData {
  id?: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  categorySlug: string;
  genre: string;
  publishedYear: number;
  pages: number;
  isFree: boolean;
  price: number;
  currency: string;
  accessType: 'full-text' | 'preview-only' | 'external-only' | 'metadata-only';
  accessStatus: EbookAccessStatus;
  coverUrl: string;
  shortSynopsis: string;
  rightsHolder: string;
  rightsNote: string;
  isbn: string;
}

const EMPTY_BOOK_FORM: BookFormData = {
  title: '',
  subtitle: '',
  author: '',
  category: 'Classic & Modern Fiction',
  categorySlug: 'fiction',
  genre: 'Classic Literature',
  publishedYear: new Date().getFullYear(),
  pages: 200,
  isFree: true,
  price: 0,
  currency: 'USD',
  accessType: 'full-text',
  accessStatus: 'free_full_text',
  coverUrl: '/covers/real/pride-and-prejudice.jpg',
  shortSynopsis: '',
  rightsHolder: '',
  rightsNote: 'Public Domain / Verified Master Edition',
  isbn: ''
};

export const AdminPage: React.FC<AdminPageProps> = ({
  user,
  onRequireAuth,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('catalogue');
  const [booksList, setBooksList] = useState<Book[]>(() => [...BOOKS]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null);

  // Edit / Add Book Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState<boolean>(false);
  const [formData, setFormData] = useState<BookFormData>(EMPTY_BOOK_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete Book Confirmation State
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Submissions state
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  // Copyright complaints state
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  // Audit state
  const [auditSummary, setAuditSummary] = useState<any | null>(null);
  const [auditItems, setAuditItems] = useState<any[]>([]);
  const [runningAudit, setRunningAudit] = useState(false);

  // Financials and Monetisation State
  const [financials, setFinancials] = useState<AdminFinancialsSummary | null>(null);
  const [transactions, setTransactions] = useState<OrderRecord[]>([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('all');
  const [txProviderFilter, setTxProviderFilter] = useState('all');
  const [loadingFinancials, setLoadingFinancials] = useState(false);
  const [salesNotifications, setSalesNotifications] = useState<AdminNotification[]>([]);
  const [unreadSalesCount, setUnreadSalesCount] = useState<number>(0);
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('Customer requested refund');
  const [refundActionMsg, setRefundActionMsg] = useState('');
  const [refundActionErr, setRefundActionErr] = useState('');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAllSalesNotifsRead = async () => {
    try {
      await folioApi.markAdminNotificationsRead();
      setSalesNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadSalesCount(0);
      showToast('All sales alerts marked as read');
    } catch (e: any) {
      showToast(e.message || 'Failed to update notifications');
    }
  };

  const handleMarkSingleSaleNotifRead = async (id: string) => {
    try {
      await folioApi.markSingleAdminNotificationRead(id);
      setSalesNotifications(prev => prev.map(n => n.id === id ? ({ ...n, is_read: 1 }) : n));
      setUnreadSalesCount(prev => Math.max(0, prev - 1));
    } catch (e: any) {
      // non-blocking
    }
  };

  const isAdmin = user && user.role === 'admin';

  // Load submissions
  const loadSubmissions = () => {
    if (!isAdmin) return;
    setLoadingSubmissions(true);
    folioApi
      .getAdminAuthorSubmissions()
      .then((res) => setSubmissions(res.submissions || []))
      .catch((err) => showToast(err.message || 'Failed to load submissions'))
      .finally(() => setLoadingSubmissions(false));
  };

  // Load complaints
  const loadComplaints = () => {
    if (!isAdmin) return;
    setLoadingComplaints(true);
    folioApi
      .getAdminCopyrightComplaints()
      .then((res) => setComplaints(res.complaints || []))
      .catch((err) => showToast(err.message || 'Failed to load complaints'))
      .finally(() => setLoadingComplaints(false));
  };

  // Run audit
  const runCatalogueAudit = () => {
    if (!isAdmin) return;
    setRunningAudit(true);
    folioApi
      .getAdminAudit()
      .then((res) => {
        setAuditSummary(res.summary);
        setAuditItems(res.items || []);
        showToast('Catalogue file integrity audit complete.');
      })
      .catch((err) => showToast(err.message || 'Audit failed'))
      .finally(() => setRunningAudit(false));
  };

  // Load Financials and Transactions
  const loadFinancials = async () => {
    if (!isAdmin) return;
    setLoadingFinancials(true);
    try {
      const [finRes, txRes, notifRes] = await Promise.all([
        folioApi.getAdminFinancials(),
        folioApi.getAdminTransactions({
          search: txSearch || undefined,
          status: txStatusFilter !== 'all' ? txStatusFilter : undefined,
          provider: txProviderFilter !== 'all' ? txProviderFilter : undefined
        }),
        folioApi.getAdminNotifications().catch(() => ({ notifications: [], unreadCount: 0 }))
      ]);
      setFinancials(finRes);
      setTransactions(txRes.transactions || []);
      setTxTotal(txRes.total || 0);
      setSalesNotifications(notifRes.notifications || []);
      setUnreadSalesCount(notifRes.unreadCount || 0);
    } catch (err: any) {
      showToast(err.message || 'Failed to load financial data');
    } finally {
      setLoadingFinancials(false);
    }
  };

  const handleProcessRefund = async (orderId: string) => {
    if (!orderId) return;
    setIsProcessingRefund(true);
    setRefundActionMsg('');
    setRefundActionErr('');
    try {
      const res = await folioApi.refundPurchase(orderId, refundReason);
      setRefundActionMsg(res.message);
      showToast(res.message);
      setRefundingOrderId(null);
      setRefundReason('Customer requested refund');
      await loadFinancials();
    } catch (err: any) {
      setRefundActionErr(err.message || 'Refund processing failed.');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  // Eagerly load submissions, complaints & published books on mount
  useEffect(() => {
    if (isAdmin) {
      loadSubmissions();
      loadComplaints();
      folioApi
        .getPublishedBooks()
        .then((res) => {
          if (res?.books?.length) {
            for (const b of res.books) {
              syncBookUpdate(b);
            }
            setBooksList([...BOOKS]);
          }
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'submissions') loadSubmissions();
      if (activeTab === 'complaints') loadComplaints();
      if (activeTab === 'financials') loadFinancials();
      if (activeTab === 'audit' && !auditSummary) runCatalogueAudit();
    }
  }, [isAdmin, activeTab, txStatusFilter, txProviderFilter]);

  // Handle book status update
  const handleUpdateBookStatus = async (bookId: string, newStatus: EbookAccessStatus) => {
    setUpdatingBookId(bookId);
    try {
      await folioApi.updateAdminBookStatus(bookId, newStatus, `Updated via admin console by ${user?.email}`);
      setBooksList((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, accessStatus: newStatus } : b))
      );
      const target = BOOKS.find((b) => b.id === bookId);
      if (target) {
        target.accessStatus = newStatus;
        syncBookUpdate(target);
      }
      showToast(`Access status updated to ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update book status');
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setIsCreatingBook(false);
    setFormData({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle || '',
      author: book.author,
      category: book.category,
      categorySlug: book.categorySlug,
      genre: book.genre,
      publishedYear: book.publishedYear || new Date().getFullYear(),
      pages: book.pages || 200,
      isFree: book.isFree,
      price: book.price || 0,
      currency: book.currency || 'USD',
      accessType: book.accessType,
      accessStatus: book.accessStatus,
      coverUrl: book.coverUrl,
      shortSynopsis: book.shortSynopsis || '',
      rightsHolder: book.rightsHolder || book.provenance.rightsHolder || '',
      rightsNote: book.rightsNote || '',
      isbn: book.isbn || ''
    });
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingBook(null);
    setIsCreatingBook(true);
    setFormData({
      ...EMPTY_BOOK_FORM,
      isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`
    });
  };

  // Save Book (Edit or Create)
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      showToast('Book title and author are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingBook) {
        // Edit existing book
        const res = await folioApi.updateAdminBook(editingBook.id, {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          author: formData.author,
          category: formData.category,
          categorySlug: formData.categorySlug as any,
          genre: formData.genre,
          publishedYear: Number(formData.publishedYear),
          pages: Number(formData.pages),
          isFree: formData.isFree,
          price: formData.isFree ? 0 : Number(formData.price),
          priceDisplay: formData.isFree ? 'Free Open Access' : `$${Number(formData.price).toFixed(2)} USD`,
          accessType: formData.accessType,
          accessStatus: formData.accessStatus,
          coverUrl: formData.coverUrl,
          shortSynopsis: formData.shortSynopsis,
          description: [formData.shortSynopsis || formData.title],
          rightsHolder: formData.rightsHolder,
          rightsNote: formData.rightsNote,
          isbn: formData.isbn
        });

        const updated = res.book || { ...editingBook, ...formData };
        setBooksList((prev) => prev.map((b) => (b.id === editingBook.id ? updated : b)));
        syncBookUpdate(updated);
        showToast(`Book "${updated.title}" updated successfully.`);
      } else {
        // Create new book
        const res = await folioApi.createAdminBook({
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          author: formData.author,
          category: formData.category,
          categorySlug: formData.categorySlug as any,
          genre: formData.genre,
          publishedYear: Number(formData.publishedYear),
          pages: Number(formData.pages),
          isFree: formData.isFree,
          price: formData.isFree ? 0 : Number(formData.price),
          priceDisplay: formData.isFree ? 'Free Open Access' : `$${Number(formData.price).toFixed(2)} USD`,
          accessType: formData.accessType,
          accessStatus: formData.accessStatus,
          coverUrl: formData.coverUrl || '/covers/real/pride-and-prejudice.jpg',
          shortSynopsis: formData.shortSynopsis,
          description: [formData.shortSynopsis || formData.title],
          rightsHolder: formData.rightsHolder,
          rightsNote: formData.rightsNote,
          isbn: formData.isbn
        });

        const created = res.book;
        if (created) {
          setBooksList((prev) => [created, ...prev]);
          syncBookUpdate(created);
        }
        showToast(`New book "${formData.title}" added to catalogue.`);
      }

      setEditingBook(null);
      setIsCreatingBook(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save book changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (book: Book) => {
    setDeletingBook(book);
  };

  // Confirm Delete Book
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;
    setIsDeleting(true);
    try {
      await folioApi.deleteAdminBook(deletingBook.id);
      syncBookDelete(deletingBook.id);
      setBooksList((prev) => prev.filter((b) => b.id !== deletingBook.id));
      showToast(`Book "${deletingBook.title}" removed from catalogue.`);
      setDeletingBook(null);
    } catch (err: any) {
      // Fallback client deletion if offline
      syncBookDelete(deletingBook.id);
      setBooksList((prev) => prev.filter((b) => b.id !== deletingBook.id));
      showToast(`Book "${deletingBook.title}" deleted from client catalogue.`);
      setDeletingBook(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle submission review
  const [downloadingSubId, setDownloadingSubId] = useState<string | null>(null);

  const handleDownloadManuscript = async (subId: string, filename: string) => {
    setDownloadingSubId(subId);
    try {
      const token = localStorage.getItem('folio_auth_token') || sessionStorage.getItem('folio_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/admin/author-submissions/${encodeURIComponent(subId)}/manuscript`, {
        headers
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to download manuscript file');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `manuscript-${subId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Manuscript downloaded for editorial inspection.');
    } catch (err: any) {
      showToast(err.message || 'Download error');
    } finally {
      setDownloadingSubId(null);
    }
  };

  const handleReviewSubmission = async (subId: string, action: 'approved' | 'rejected') => {
    try {
      const notes = reviewNotes[subId] || '';
      const targetSub = submissions.find((s) => s.id === subId);
      const res = await folioApi.reviewAuthorSubmission(subId, action, notes);
      if (action === 'approved' && res?.book) {
        syncBookUpdate(res.book);
        setBooksList((prev) => [res.book!, ...prev.filter((b) => b.id !== res.book!.id)]);
      } else {
        setBooksList([...BOOKS]);
      }
      showToast(
        action === 'approved'
          ? `✓ Book "${targetSub?.title || 'Manuscript'}" approved and published live to the catalogue!`
          : `Submission marked as rejected.`
      );
      loadSubmissions();
    } catch (err: any) {
      showToast(err.message || 'Failed to review submission');
    }
  };

  // Handle complaint resolution
  const handleResolveComplaint = async (compId: string, action: 'resolve_takedown' | 'dismiss') => {
    try {
      const notes = resolutionNotes[compId] || '';
      await folioApi.resolveCopyrightComplaint(compId, action, notes);
      showToast(action === 'resolve_takedown' ? 'Book taken down & restricted' : 'Notice dismissed');
      loadComplaints();
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve complaint');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F6EF] text-[#202820] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-xl border border-[#E3E6DF] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-[#DCE6DC] text-[#173D2D] rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif font-bold text-[#202820]">Administrator Access Required</h1>
          <p className="text-sm text-[#747D74] leading-relaxed">
            The catalogue administration and quality control dashboard is restricted to verified Understory administrators.
          </p>
          <div className="p-3 bg-[#F8F6EF] rounded-lg border border-[#E3E6DF] text-xs text-[#202820] font-mono text-left space-y-1">
            <p>Admin Account: admin@ebaro.org</p>
            <p>Role Required: admin</p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onRequireAuth}
              className="w-full py-2.5 bg-[#173D2D] hover:bg-[#112F23] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Sign In as Administrator
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full py-2 text-[#747D74] hover:text-[#202820] text-sm font-medium transition-colors"
            >
              Return to Public Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const pendingCount = pendingSubmissions.length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionStatusFilter === 'all') return true;
    return s.status === submissionStatusFilter;
  });

  const filteredBooks = booksList.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.toLowerCase().includes(q)) ||
      b.categorySlug.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || b.accessStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || b.categorySlug === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="understory-admin-wrapper">
      <div className="understory-admin-container">
        {/* Top Header Banner */}
        <div className="understory-admin-header">
          <div className="understory-admin-title-group">
            <UnderstoryLogo variant="app-icon" size={48} />
            <div>
              <div className="understory-admin-badge">
                <ShieldCheck size={13} />
                <span>Admin Console</span>
              </div>
              <h1 className="understory-admin-h1">
                Understory Catalogue &amp; Rights Control
              </h1>
              <p className="understory-admin-meta">
                Administrator: <strong>{user.email}</strong> • Total Books in Catalogue:{' '}
                <strong style={{ color: '#173D2D' }}>{booksList.length}</strong>
              </p>
            </div>
          </div>

          <div className="understory-admin-actions">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn-admin-primary"
              title="Add a new book directly to the catalogue"
            >
              <Plus size={15} />
              <span>Add New Book</span>
            </button>
            <button
              type="button"
              onClick={runCatalogueAudit}
              disabled={runningAudit}
              className="btn-admin-secondary"
              title="Verify binary existence and DRM status of all titles"
            >
              <RefreshCw size={14} className={runningAudit ? 'animate-spin' : ''} />
              <span>Run File Audit</span>
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="btn-admin-secondary"
            >
              <span>View Public Library</span>
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#173D2D] text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#DCE6DC]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Urgent Action Banner when Manuscripts are waiting */}
        {pendingCount > 0 && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#173D2D] text-white shadow-xl border border-[#112F23] flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in duration-300">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-[#173D2D] flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-400 text-[#173D2D]">
                    ACTION REQUIRED
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight">
                    {pendingCount} Book Manuscript{pendingCount > 1 ? 's' : ''} Waiting for Editorial Approval
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#DCE6DC] leading-relaxed">
                  Latest: <strong className="text-white">"{pendingSubmissions[0]?.title}"</strong> by {pendingSubmissions[0]?.author} • {pendingSubmissions[0]?.manuscript_format || 'PDF'} format ({pendingSubmissions[0]?.manuscript_size ? `${(pendingSubmissions[0].manuscript_size / (1024 * 1024)).toFixed(2)} MB` : 'Attached'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('submissions');
                  setSubmissionStatusFilter('pending');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-[#173D2D] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-[#173D2D]" />
                <span>Review &amp; Accept Book ({pendingCount})</span>
              </button>
            </div>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="understory-admin-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('catalogue')}
            className={`understory-admin-tab ${activeTab === 'catalogue' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Master Catalogue</span>
            <span className="understory-admin-tab-count">{booksList.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`understory-admin-tab ${activeTab === 'submissions' ? 'active' : ''}`}
          >
            <FileCheck size={16} />
            <span>Author Submissions</span>
            {pendingCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-[#173D2D] shadow-sm animate-pulse">
                {pendingCount} PENDING
              </span>
            ) : submissions.length > 0 ? (
              <span className="understory-admin-tab-count">{submissions.length}</span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`understory-admin-tab ${activeTab === 'complaints' ? 'active' : ''}`}
          >
            <ShieldAlert size={16} />
            <span>Rights &amp; DMCA</span>
            {complaints.length > 0 && (
              <span className="understory-admin-tab-count">{complaints.length}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`understory-admin-tab ${activeTab === 'financials' ? 'active' : ''}`}
          >
            <DollarSign size={16} />
            <span>Purchases &amp; Revenue</span>
            {financials && financials.completedOrdersCount > 0 && (
              <span className="understory-admin-tab-count">{financials.completedOrdersCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`understory-admin-tab ${activeTab === 'audit' ? 'active' : ''}`}
          >
            <FileCode size={16} />
            <span>File Integrity Audit</span>
          </button>
        </div>

        {/* TAB 1: MASTER CATALOGUE (WITH EDIT & DELETE) */}
        {activeTab === 'catalogue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search and Filters Toolbar */}
            <div className="understory-filter-bar">
              <div className="understory-search-input-wrap">
                <Search size={15} className="understory-search-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search catalogue by title, author, ISBN, or room..."
                  className="understory-search-input"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="understory-filter-select"
              >
                <option value="all">All Access Statuses</option>
                {ACCESS_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="understory-filter-select"
              >
                <option value="all">All Subject Rooms</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="btn-admin-primary"
                style={{ padding: '0.55rem 1rem' }}
              >
                <Plus size={15} />
                <span>Add Book</span>
              </button>
            </div>

            {/* Results count & reset */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#747D74', padding: '0 0.25rem' }}>
              <span>Showing <strong>{filteredBooks.length}</strong> of <strong>{booksList.length}</strong> books in catalogue</span>
              {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  style={{ background: 'none', border: 'none', color: '#173D2D', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Redesigned Books Table Card */}
            <div className="understory-table-card">
              <div className="understory-table-responsive">
                <table className="understory-books-table">
                  <thead>
                    <tr>
                      <th style={{ width: '320px' }}>Book &amp; Author</th>
                      <th style={{ width: '140px' }}>Category</th>
                      <th style={{ width: '110px' }}>Price / Tier</th>
                      <th>Rights Holder &amp; Provenance</th>
                      <th style={{ width: '180px' }}>Current Access Status</th>
                      <th className="th-actions" style={{ width: '220px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((b) => (
                      <tr key={b.id}>
                        {/* Book & Author Column with Proportional Cover Thumbnail */}
                        <td>
                          <div className="understory-table-book-cell">
                            <div className="understory-table-cover-wrap">
                              <img
                                src={b.coverUrl}
                                alt={b.title}
                                className="understory-table-cover-img"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/covers/real/pride-and-prejudice.jpg';
                                }}
                              />
                            </div>
                            <div className="understory-table-book-info">
                              <p className="understory-table-book-title" title={b.title}>
                                {b.title}
                              </p>
                              <p className="understory-table-book-author" title={b.author}>
                                {b.author} ({b.publishedYear})
                              </p>
                              <span className="understory-table-book-id">{b.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category Column */}
                        <td>
                          <span className="understory-cat-badge">
                            {b.categorySlug}
                          </span>
                        </td>

                        {/* Price Column */}
                        <td>
                          <span className={`understory-price-badge ${b.isFree || b.price === 0 ? 'free' : 'paid'}`}>
                            {b.isFree || b.price === 0 ? 'Free' : `$${(b.price || 4.99).toFixed(2)}`}
                          </span>
                        </td>

                        {/* Rights Holder Column */}
                        <td>
                          <div className="understory-provenance-cell">
                            <p className="understory-provenance-holder" title={b.rightsHolder || b.provenance?.rightsHolder || 'Approved Edition'}>
                              {b.rightsHolder || b.provenance?.rightsHolder || b.provenance?.sourceProvider || 'Approved Edition'}
                            </p>
                            <p className="understory-provenance-note" title={b.licenceEvidence || b.provenance?.licenceName || 'Archival copy'}>
                              {b.licenceEvidence || b.provenance?.licenceName || 'Archival copy'}
                            </p>
                          </div>
                        </td>

                        {/* Access Status Dropdown */}
                        <td>
                          <select
                            value={b.accessStatus}
                            disabled={updatingBookId === b.id}
                            onChange={(e) => handleUpdateBookStatus(b.id, e.target.value as EbookAccessStatus)}
                            className={`understory-status-select ${
                              b.accessStatus === 'free_full_text' || b.accessStatus === 'free_download'
                                ? 'status-free'
                                : b.accessStatus === 'paid_purchase'
                                ? 'status-paid'
                                : b.accessStatus === 'preview_only'
                                ? 'status-preview'
                                : 'status-restricted'
                            }`}
                          >
                            {ACCESS_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions: Inspect, Edit, Delete (with prominent Delete text) */}
                        <td className="td-actions" style={{ textAlign: 'right' }}>
                          <div className="understory-action-group">
                            <a
                              href={`/books/${b.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-row-action inspect"
                              title="Inspect book details in public catalog"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(b)}
                              className="btn-row-action edit"
                              title="Edit book metadata and pricing"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(b)}
                              className="btn-row-action delete"
                              title="Permanently remove book from catalogue"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTHOR SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E3E6DF]">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#202820]">Manuscript Submissions &amp; Publishing Queue</h2>
                <p className="text-xs text-[#747D74]">Review submitted manuscripts, verify rights declarations, and approve books for the live catalogue.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadSubmissions}
                  className="px-3 py-1.5 bg-white hover:bg-[#F8F6EF] text-[#173D2D] border border-[#E3E6DF] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                  <span>Refresh Queue</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSubmissionStatusFilter('pending')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  submissionStatusFilter === 'pending'
                    ? 'bg-[#173D2D] text-white shadow'
                    : 'bg-white text-[#747D74] border border-[#E3E6DF] hover:bg-[#F8F6EF]'
                }`}
              >
                <span>Pending Approval</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    submissionStatusFilter === 'pending'
                      ? 'bg-amber-400 text-[#173D2D]'
                      : pendingCount > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-neutral-100 text-[#747D74]'
                  }`}
                >
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  submissionStatusFilter === 'all'
                    ? 'bg-[#173D2D] text-white shadow'
                    : 'bg-white text-[#747D74] border border-[#E3E6DF] hover:bg-[#F8F6EF]'
                }`}
              >
                <span>All Submissions</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-[#747D74]">
                  {submissions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionStatusFilter('approved')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  submissionStatusFilter === 'approved'
                    ? 'bg-[#173D2D] text-white shadow'
                    : 'bg-white text-[#747D74] border border-[#E3E6DF] hover:bg-[#F8F6EF]'
                }`}
              >
                <span>Approved &amp; Live</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCE6DC] text-[#173D2D]">
                  {approvedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionStatusFilter('rejected')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  submissionStatusFilter === 'rejected'
                    ? 'bg-[#173D2D] text-white shadow'
                    : 'bg-white text-[#747D74] border border-[#E3E6DF] hover:bg-[#F8F6EF]'
                }`}
              >
                <span>Rejected</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                  {rejectedCount}
                </span>
              </button>
            </div>

            {loadingSubmissions ? (
              <div className="py-16 text-center text-[#747D74] text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#173D2D] mb-2" />
                <span>Loading submissions from database...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-[#E3E6DF] text-center space-y-2">
                <FileCheck className="w-10 h-10 text-[#747D74] mx-auto opacity-50" />
                <h3 className="font-bold text-base text-[#202820]">No Author Submissions</h3>
                <p className="text-xs text-[#747D74]">No authors have submitted manuscripts for publication yet.</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-[#E3E6DF] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#173D2D] mx-auto" />
                <h3 className="font-bold text-base text-[#202820]">
                  {submissionStatusFilter === 'pending'
                    ? 'All Caught Up!'
                    : `No ${submissionStatusFilter} Submissions`}
                </h3>
                <p className="text-xs text-[#747D74] max-w-sm mx-auto">
                  {submissionStatusFilter === 'pending'
                    ? 'There are currently no author manuscripts waiting for editorial approval.'
                    : `There are no submissions currently classified under the "${submissionStatusFilter}" filter.`}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmissionStatusFilter('all')}
                  className="px-4 py-2 bg-[#F8F6EF] hover:bg-[#DCE6DC] text-[#173D2D] rounded-lg text-xs font-bold transition-colors inline-block"
                >
                  View All {submissions.length} Submissions
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredSubmissions.map((sub) => {
                  const isPending = sub.status === 'pending';
                  const isApproved = sub.status === 'approved';
                  const isRejected = sub.status === 'rejected';

                  return (
                    <div
                      key={sub.id}
                      className={`rounded-2xl transition-all overflow-hidden ${
                        isPending
                          ? 'bg-white border-2 border-amber-400 shadow-lg'
                          : isApproved
                          ? 'bg-white border border-[#E3E6DF] shadow-sm'
                          : 'bg-[#FAF8F5] border border-rose-200 shadow-sm'
                      }`}
                    >
                      {/* Status Headline Banner */}
                      {isPending && (
                        <div className="bg-amber-400/15 border-b border-amber-400/30 px-5 py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-bold text-[#173D2D]">
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                            <span>Awaiting Editorial Approval — Please Review Manuscript Below</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-amber-400 text-[#173D2D]">
                            PENDING DECISION
                          </span>
                        </div>
                      )}

                      <div className="p-6 space-y-5">
                        {/* Book Header with Cover and Metadata */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                          {sub.cover_url && (
                            <div className="w-20 sm:w-24 h-28 sm:h-34 flex-shrink-0 rounded-lg overflow-hidden border border-[#E3E6DF] shadow-sm bg-[#F8F6EF]">
                              <img
                                src={sub.cover_url}
                                alt={sub.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <h3 className="font-serif font-bold text-xl text-[#202820]">
                                {sub.title}
                              </h3>

                              <div className="flex items-center gap-2">
                                {isPending ? (
                                  <button
                                    type="button"
                                    onClick={() => handleReviewSubmission(sub.id, 'approved')}
                                    className="btn-editorial-approve"
                                    style={{
                                      backgroundColor: '#173D2D',
                                      color: '#FFFFFF',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: '8px 18px',
                                      borderRadius: '8px',
                                      fontWeight: 700,
                                      fontSize: '13px',
                                      border: '1px solid #112F23',
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 4px rgba(23,61,45,0.2)'
                                    }}
                                    title="Approve manuscript and publish live to catalogue"
                                  >
                                    <CheckCircle2 size={16} color="#6EE7B7" />
                                    <span>✓ APPROVE BOOK</span>
                                  </button>
                                ) : isApproved ? (
                                  <div className="flex items-center gap-2">
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        backgroundColor: '#DCE6DC',
                                        color: '#173D2D',
                                        border: '1px solid rgba(23,61,45,0.2)'
                                      }}
                                    >
                                      <CheckCircle2 size={13} color="#173D2D" />
                                      <span>APPROVED &amp; LIVE</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleReviewSubmission(sub.id, 'rejected')}
                                      style={{
                                        fontSize: '11px',
                                        color: '#BE123C',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontWeight: 600
                                      }}
                                    >
                                      Revoke
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        backgroundColor: '#FFE4E6',
                                        color: '#9F1239',
                                        border: '1px solid #FECDD3'
                                      }}
                                    >
                                      <XCircle size={13} color="#9F1239" />
                                      <span>REJECTED</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleReviewSubmission(sub.id, 'approved')}
                                      className="btn-editorial-approve"
                                      style={{
                                        backgroundColor: '#173D2D',
                                        color: '#FFFFFF',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        border: '1px solid #112F23',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <CheckCircle2 size={12} color="#6EE7B7" />
                                      <span>Re-Approve</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-[#747D74]">
                              Author: <strong className="text-[#202820] font-semibold">{sub.author}</strong>
                              {sub.author_email && (
                                <span> • Submitter: <code className="text-[11px] bg-[#F8F6EF] px-1.5 py-0.5 rounded text-[#202820]">{sub.author_email}</code></span>
                              )}
                              <span> • Submitted: {new Date(sub.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2 text-xs">
                              <div className="px-2.5 py-1 rounded bg-[#F8F6EF] border border-[#E3E6DF]">
                                <span className="text-[#747D74]">Room / Category: </span>
                                <strong className="text-[#202820]">{sub.category_slug}</strong>
                              </div>
                              <div className="px-2.5 py-1 rounded bg-[#F8F6EF] border border-[#E3E6DF]">
                                <span className="text-[#747D74]">Language: </span>
                                <strong className="text-[#202820]">{sub.language === 'so' ? 'Af-Soomaali' : sub.language || 'English'}</strong>
                              </div>
                              <div className="px-2.5 py-1 rounded bg-[#F8F6EF] border border-[#E3E6DF]">
                                <span className="text-[#747D74]">Distribution: </span>
                                <strong className="text-[#202820]">{sub.is_free ? 'Free Open Access' : `$${sub.price || '4.99'} USD`}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Manuscript File Card & Inspection */}
                        <div className="p-4 bg-[#F8F6EF] rounded-xl border border-[#E3E6DF] flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#DCE6DC] text-[#173D2D] flex items-center justify-center flex-shrink-0 shadow-sm">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-[#202820] flex items-center gap-2">
                                <span>{sub.manuscript_filename || (sub.file_url ? 'External Archive URL' : 'Metadata-Only Record')}</span>
                                {sub.manuscript_format && (
                                  <span className="px-2 py-0.5 rounded bg-[#173D2D] text-white text-[10px] font-black uppercase">
                                    {sub.manuscript_format}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#747D74] mt-0.5">
                                {sub.manuscript_size
                                  ? `${(sub.manuscript_size / (1024 * 1024)).toFixed(2)} MB • Stored locally in /server/storage/manuscripts/`
                                  : sub.file_url
                                  ? `Archive URL: ${sub.file_url}`
                                  : 'No binary manuscript attached'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {sub.manuscript_path ? (
                              <button
                                type="button"
                                onClick={() => handleDownloadManuscript(sub.id, sub.manuscript_filename)}
                                disabled={downloadingSubId === sub.id}
                                className="px-4 py-2 bg-white hover:bg-[#DCE6DC] text-[#173D2D] border border-[#173D2D] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  color: '#173D2D',
                                  border: '1px solid #173D2D',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                                title="Download the manuscript to inspect before publishing"
                              >
                                <Download size={14} color="#173D2D" />
                                <span>{downloadingSubId === sub.id ? 'Downloading...' : 'Inspect / Download Manuscript'}</span>
                              </button>
                            ) : sub.file_url ? (
                              <a
                                href={sub.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white hover:bg-[#DCE6DC] text-[#173D2D] border border-[#173D2D] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  color: '#173D2D',
                                  border: '1px solid #173D2D',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
                                <ExternalLink size={14} color="#173D2D" />
                                <span>Open Archive URL</span>
                              </a>
                            ) : null}

                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleReviewSubmission(sub.id, 'approved')}
                                className="btn-editorial-approve"
                                style={{
                                  backgroundColor: '#173D2D',
                                  color: '#FFFFFF',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  border: '1px solid #112F23',
                                  cursor: 'pointer'
                                }}
                                title="Approve manuscript and publish immediately"
                              >
                                <CheckCircle2 size={14} color="#6EE7B7" />
                                <span>Approve</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Rights Declaration & Synopsis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 bg-[#F8F6EF]/60 rounded-xl border border-[#E3E6DF] space-y-1">
                            <span className="font-bold text-[#202820] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#173D2D]" />
                              <span>Author Rights Declaration:</span>
                            </span>
                            <p className="text-[#747D74] italic leading-relaxed">
                              "{sub.rights_declaration || 'No explicit declaration provided.'}"
                            </p>
                          </div>

                          {sub.description && (
                            <div className="p-3.5 bg-[#F8F6EF]/60 rounded-xl border border-[#E3E6DF] space-y-1">
                              <span className="font-bold text-[#202820]">Book Synopsis:</span>
                              <p className="text-[#747D74] leading-relaxed line-clamp-3">
                                {sub.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* DECISION SECTION FOR PENDING SUBMISSIONS */}
                        {isPending && (
                          <div className="p-5 rounded-xl bg-[#F8F6EF] border-2 border-[#173D2D]/20 space-y-3" style={{ background: '#F8F6EF', border: '2px solid rgba(23,61,45,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif font-bold text-sm text-[#202820] flex items-center gap-1.5" style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#202820', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileCheck size={16} color="#173D2D" />
                                <span>Editorial Decision &amp; Catalogue Publication</span>
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: '#747D74' }}>Approving immediately publishes book live into catalogue</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 items-center" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                              <input
                                type="text"
                                placeholder="Editorial note to author (optional, e.g. Approved for general catalogue)..."
                                value={reviewNotes[sub.id] || ''}
                                onChange={(e) =>
                                  setReviewNotes({ ...reviewNotes, [sub.id]: e.target.value })
                                }
                                style={{
                                  flex: '1 1 250px',
                                  padding: '9px 14px',
                                  fontSize: '0.82rem',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #E3E6DF',
                                  borderRadius: '8px',
                                  outline: 'none'
                                }}
                              />

                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleReviewSubmission(sub.id, 'approved')}
                                  className="btn-editorial-approve"
                                  style={{
                                    backgroundColor: '#173D2D',
                                    color: '#FFFFFF',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '9px 22px',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    border: '1px solid #112F23',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(23,61,45,0.25)'
                                  }}
                                  title="Approve this book and publish it live to the catalogue"
                                >
                                  <CheckCircle2 size={16} color="#6EE7B7" />
                                  <span>✓ APPROVE &amp; PUBLISH</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleReviewSubmission(sub.id, 'rejected')}
                                  className="btn-editorial-reject"
                                  style={{
                                    backgroundColor: '#FFF1F2',
                                    color: '#BE123C',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    border: '1px solid #FECDD3',
                                    cursor: 'pointer'
                                  }}
                                  title="Reject submission"
                                >
                                  <XCircle size={15} color="#BE123C" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* REVIEW HISTORY FOR APPROVED / REJECTED SUBMISSIONS */}
                        {!isPending && (
                          <div className="pt-3 border-t border-[#E3E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="text-[#747D74]">
                              Status: <strong className={isApproved ? 'text-[#173D2D]' : 'text-rose-700'}>{sub.status.toUpperCase()}</strong>
                              {sub.reviewed_at && (
                                <span> • Reviewed: {new Date(sub.reviewed_at).toLocaleDateString()}</span>
                              )}
                              {sub.admin_notes && (
                                <span> • Note: <em className="text-[#202820]">"{sub.admin_notes}"</em></span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {isApproved ? (
                                <button
                                  type="button"
                                  onClick={() => handleReviewSubmission(sub.id, 'rejected')}
                                  className="text-[11px] text-rose-600 hover:underline font-semibold"
                                >
                                  Revoke &amp; Reject
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleReviewSubmission(sub.id, 'approved')}
                                  className="text-[11px] text-[#173D2D] hover:underline font-semibold"
                                >
                                  Re-approve &amp; Publish
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COPYRIGHT COMPLAINTS & DMCA */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#202820]">Copyright Notices &amp; Takedowns</h2>
              <button
                onClick={loadComplaints}
                className="text-xs text-[#173D2D] font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Notices
              </button>
            </div>

            {loadingComplaints ? (
              <div className="py-12 text-center text-[#747D74] text-sm">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-[#E3E6DF] text-center text-sm text-[#747D74]">
                No copyright or rights dispute notices logged.
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((comp) => (
                  <div key={comp.id} className="p-6 bg-white rounded-xl border border-[#E3E6DF] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E3E6DF] pb-3">
                      <div>
                        <h3 className="font-bold text-base text-[#202820]">Dispute: {comp.book_title}</h3>
                        <p className="text-xs text-[#747D74]">
                          Claimant: <strong className="text-[#202820]">{comp.claimant_name}</strong> ({comp.claimant_email}) • {comp.claimant_relationship}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                          comp.status === 'resolved'
                            ? 'bg-[#DCE6DC] text-[#173D2D]'
                            : comp.status === 'dismissed'
                            ? 'bg-neutral-100 text-[#747D74]'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>

                    <div className="p-3 bg-rose-50/50 rounded-lg text-xs space-y-1 border border-rose-100">
                      <span className="font-semibold text-rose-900">Infringement Details:</span>
                      <p className="text-neutral-700">{comp.infringement_details}</p>
                      {comp.original_work_url && (
                        <p className="text-neutral-500 text-[11px] pt-1">
                          Original Work URL: <a href={comp.original_work_url} target="_blank" rel="noopener noreferrer" className="underline">{comp.original_work_url}</a>
                        </p>
                      )}
                    </div>

                    {comp.status === 'open' && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3 items-end border-t border-[#E3E6DF]">
                        <input
                          type="text"
                          placeholder="Resolution findings / notes..."
                          value={resolutionNotes[comp.id] || ''}
                          onChange={(e) =>
                            setResolutionNotes({ ...resolutionNotes, [comp.id]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 text-xs bg-white rounded border border-[#E3E6DF] focus:outline-none focus:ring-1 focus:ring-[#173D2D]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveComplaint(comp.id, 'resolve_takedown')}
                            className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Take Down &amp; Restrict</span>
                          </button>
                          <button
                            onClick={() => handleResolveComplaint(comp.id, 'dismiss')}
                            className="px-3 py-1.5 bg-neutral-100 text-[#202820] hover:bg-neutral-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span>Dismiss Notice</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PURCHASES & REVENUE (COMMERCIAL GATEWAY) */}
        {activeTab === 'financials' && (
          <div className="ebaro-financials-wrap">
            {/* Header & Refresh */}
            <div className="ebaro-financials-header-row">
              <div>
                <span className="ebaro-kpi-label" style={{ color: '#065F46' }}>
                  AUTHOR COMMERCE &amp; MONETISATION
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: '#0F172A', margin: '0.2rem 0 0 0' }}>
                  Purchases, Revenue &amp; Financials
                </h2>
              </div>
              <button
                type="button"
                onClick={loadFinancials}
                disabled={loadingFinancials}
                className="btn-admin-primary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <RefreshCw size={14} className={loadingFinancials ? 'animate-spin' : ''} />
                <span>{loadingFinancials ? 'Syncing...' : 'Sync Financials'}</span>
              </button>
            </div>

            {/* Refund Action Message Alerts */}
            {refundActionMsg && (
              <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', color: '#065F46', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>{refundActionMsg}</span>
                </div>
                <button type="button" onClick={() => setRefundActionMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065F46' }}>
                  <X size={15} />
                </button>
              </div>
            )}
            {refundActionErr && (
              <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '10px', color: '#B91C1C', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} color="#DC2626" />
                  <span>{refundActionErr}</span>
                </div>
                <button type="button" onClick={() => setRefundActionErr('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C' }}>
                  <X size={15} />
                </button>
              </div>
            )}

            {/* 4 Financial KPIs */}
            <div className="ebaro-financials-kpis-grid">
              <div className="ebaro-financial-kpi-card">
                <span className="ebaro-kpi-label">Gross Platform Revenue</span>
                <div className="ebaro-kpi-number">
                  ${financials?.totalRevenueUsd?.toFixed(2) || '0.00'}{' '}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>USD est.</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'monospace', color: '#334155' }}>
                    USD: ${financials?.revenueByCurrency?.USD?.toFixed(2) || '0.00'}
                  </span>
                  <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'monospace', color: '#334155' }}>
                    KES: {financials?.revenueByCurrency?.KES?.toLocaleString() || '0'}
                  </span>
                  <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'monospace', color: '#334155' }}>
                    SOS: {financials?.revenueByCurrency?.SOS?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              <div className="ebaro-financial-kpi-card">
                <span className="ebaro-kpi-label">Completed Orders</span>
                <div className="ebaro-kpi-number" style={{ color: '#0F172A' }}>
                  {financials?.completedOrdersCount ?? 0}
                </div>
                <span className="ebaro-kpi-sub">Authorised and settled</span>
              </div>

              <div className="ebaro-financial-kpi-card">
                <span className="ebaro-kpi-label">Active Entitlements</span>
                <div className="ebaro-kpi-number" style={{ color: '#0F172A' }}>
                  {financials?.activeEntitlementsCount ?? 0}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Permanent reader tokens</span>
              </div>

              <div className="ebaro-financial-kpi-card">
                <span className="ebaro-kpi-label">Refunded / Revoked</span>
                <div className="ebaro-kpi-number" style={{ color: '#475569' }}>
                  {financials?.refundedOrdersCount ?? 0}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Access revoked upon refund</span>
              </div>
            </div>

            {/* Provider Volume Breakdown & Top Selling Books */}
            <div className="ebaro-financials-cards-row">
              {/* Sales by Gateway */}
              <div className="ebaro-financial-surface-card">
                <h3 className="ebaro-financial-surface-title">
                  <ShieldCheck size={16} color="#059669" />
                  <span>Gateway Volume Breakdown</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFF', borderRadius: '8px', border: '1px solid #E8DFC8' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>Sifalo Pay (Somali Mobile Money)</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Hormuud EVC Plus, Telesom ZAAD, Golis Sahal</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {financials?.salesByProvider?.sifalo?.count || 0} orders
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                        ~${(financials?.salesByProvider?.sifalo?.totalUsd || 0).toFixed(2)} USD
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFF', borderRadius: '8px', border: '1px solid #E8DFC8' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>Safaricom Daraja M-Pesa</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Kenyan Shillings STK Push Prompt</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {financials?.salesByProvider?.mpesa?.count || 0} orders
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                        ~${(financials?.salesByProvider?.mpesa?.totalUsd || 0).toFixed(2)} USD
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFF', borderRadius: '8px', border: '1px solid #E8DFC8' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>Credit &amp; Debit Cards</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Visa, Mastercard, International</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {financials?.salesByProvider?.card?.count || 0} orders
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                        ~${(financials?.salesByProvider?.card?.totalUsd || 0).toFixed(2)} USD
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Selling Books */}
              <div className="ebaro-financial-surface-card">
                <h3 className="ebaro-financial-surface-title">
                  <BookOpen size={16} color="#059669" />
                  <span>Top Author Editions</span>
                </h3>
                {financials?.topSellingBooks && financials.topSellingBooks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {financials.topSellingBooks.slice(0, 4).map((b) => (
                      <div
                        key={b.bookId}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFF', borderRadius: '8px', border: '1px solid #E8DFC8' }}
                      >
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', textOverflow: 'ellipsis', overflow: 'hidden' }}>{b.title}</div>
                          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'monospace' }}>{b.bookId}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ padding: '3px 8px', background: '#ECFDF5', color: '#065F46', fontWeight: 700, borderRadius: '4px', fontSize: '0.75rem' }}>
                            {b.count} {b.count === 1 ? 'sale' : 'sales'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748B' }}>
                    No individual book purchases recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Sales Alerts & Notifications Feed */}
            <div className="ebaro-financial-surface-card" style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8DFC8', padding: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #F1ECE1', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Recent Sales Notifications
                      {unreadSalesCount > 0 && (
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: '#059669', color: '#FFF', fontWeight: 700 }}>
                          {unreadSalesCount} NEW
                        </span>
                      )}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
                      Live alerts triggered whenever readers purchase paid editions across Sifalo Pay, M-Pesa or Card
                    </p>
                  </div>
                </div>
                {salesNotifications.length > 0 && unreadSalesCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllSalesNotifsRead}
                    style={{ fontSize: '0.72rem', fontWeight: 600, color: '#059669', background: 'transparent', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Mark All Read
                  </button>
                )}
              </div>

              {salesNotifications.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
                  <ShoppingBag size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <div>No sales notifications recorded yet.</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                    When a customer completes a book purchase, instant sale alerts with buyer details and settlement amounts will appear here and in your top notification bell.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto' }}>
                  {salesNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => notif.is_read === 0 && handleMarkSingleSaleNotifRead(notif.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: notif.is_read === 0 ? '#F0FDF4' : '#FAFAF8',
                        border: notif.is_read === 0 ? '1px solid #BBF7D0' : '1px solid #EFEAE0',
                        cursor: notif.is_read === 0 ? 'pointer' : 'default',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: notif.is_read === 0 ? '#10B981' : '#CBD5E1', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: '#475569', marginTop: '0.1rem' }}>
                            {notif.customer_name ? `${notif.customer_name} (${notif.customer_email || 'guest'})` : notif.customer_email || 'Verified Buyer'} • via <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{notif.payment_method || 'Online'}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                          +{notif.currency || '$'}{typeof notif.amount === 'number' ? notif.amount.toFixed(2) : notif.amount}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                          {new Date(notif.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transactions Filter Toolbar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: '#0F172A', margin: 0 }}>
                  Transactions &amp; Orders Log ({txTotal})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="text"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') loadFinancials();
                      }}
                      placeholder="Search ref, email, book..."
                      style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', width: '200px' }}
                    />
                  </div>

                  <select
                    value={txStatusFilter}
                    onChange={(e) => setTxStatusFilter(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', backgroundColor: '#FFF' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>

                  <select
                    value={txProviderFilter}
                    onChange={(e) => setTxProviderFilter(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', backgroundColor: '#FFF' }}
                  >
                    <option value="all">All Providers</option>
                    <option value="sifalo">Sifalo Pay</option>
                    <option value="mpesa">M-Pesa Daraja</option>
                    <option value="card">Card</option>
                  </select>

                  <button
                    type="button"
                    onClick={loadFinancials}
                    className="btn-admin-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="ebaro-financial-table-container">
                <table className="ebaro-financial-table">
                  <thead>
                    <tr>
                      <th>Order &amp; Date</th>
                      <th>Customer</th>
                      <th>Book Edition</th>
                      <th>Method &amp; Ref</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                          {loadingFinancials ? 'Loading transactions...' : 'No transactions matching query.'}
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>{tx.id}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                              {new Date(tx.created_at).toLocaleString()}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0F172A' }}>{tx.user_name || 'Reader'}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'monospace' }}>{tx.user_email || tx.user_id}</div>
                            {tx.customer_phone && (
                              <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'monospace' }}>{tx.customer_phone}</div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0F172A', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.book_title || tx.book_id}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'monospace', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.book_id}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#334155' }}>
                              {tx.payment_method?.replace('_', ' ') || tx.provider}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'monospace' }}>{tx.transaction_ref}</div>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>
                            {tx.currency} {tx.amount?.toFixed(2)}
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                backgroundColor:
                                  tx.status === 'completed'
                                    ? '#D1FAE5'
                                    : tx.status === 'refunded'
                                    ? '#F3E8FF'
                                    : tx.status === 'failed'
                                    ? '#FEE2E2'
                                    : '#FEF3C7',
                                color:
                                  tx.status === 'completed'
                                    ? '#065F46'
                                    : tx.status === 'refunded'
                                    ? '#6B21A8'
                                    : tx.status === 'failed'
                                    ? '#991B1B'
                                    : '#92400E'
                              }}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {tx.status === 'completed' ? (
                              <button
                                type="button"
                                onClick={() => setRefundingOrderId(tx.id)}
                                style={{
                                  padding: '4px 10px',
                                  backgroundColor: '#F8FAFC',
                                  color: '#B91C1C',
                                  border: '1px solid #FECACA',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Refund
                              </button>
                            ) : tx.status === 'refunded' ? (
                              <span style={{ fontSize: '0.72rem', color: '#6B21A8', fontWeight: 600 }}>Refunded</span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refund Confirmation Modal */}
            {refundingOrderId && (
              <div
                className="ebaro-checkout-backdrop"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setRefundingOrderId(null);
                }}
              >
                <div className="ebaro-checkout-dialog" style={{ maxWidth: '460px' }}>
                  <div className="ebaro-checkout-header" style={{ background: '#FEF2F2', borderBottomColor: '#FEE2E2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <RotateCcw size={18} color="#B91C1C" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#7F1D1D', margin: 0 }}>
                        Confirm Order Refund
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRefundingOrderId(null)}
                      className="ebaro-checkout-btn-close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '0.85rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', color: '#92400E', fontSize: '0.78rem', lineHeight: 1.5 }}>
                      <strong>Warning:</strong> Processing this refund will immediately revoke the reader&apos;s
                      permanent entitlement for order <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>{refundingOrderId}</code>.
                      They will no longer be able to open or download the complete manuscript.
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                        Refund Reason *
                      </label>
                      <textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        required
                        placeholder="e.g. Reader requested refund within 24 hours"
                        rows={3}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                      <button
                        type="button"
                        onClick={() => setRefundingOrderId(null)}
                        className="btn-admin-secondary"
                        style={{ padding: '0.6rem 1rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProcessRefund(refundingOrderId)}
                        disabled={isProcessingRefund}
                        style={{
                          padding: '0.6rem 1.25rem',
                          background: '#B91C1C',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem'
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>{isProcessingRefund ? 'Processing...' : 'Confirm & Revoke Access'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FILE INTEGRITY AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#202820]">Catalogue File Verification &amp; EPUB/PDF Audit</h2>
              <button
                onClick={runCatalogueAudit}
                disabled={runningAudit}
                className="text-xs text-[#173D2D] font-semibold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${runningAudit ? 'animate-spin' : ''}`} />
                <span>Re-run Audit</span>
              </button>
            </div>

            {auditSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E3E6DF] shadow-sm">
                  <span className="text-xs text-[#747D74] uppercase font-semibold">Total Audited Titles</span>
                  <p className="text-2xl font-bold text-[#202820] mt-1">{auditSummary.totalBooks}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E3E6DF] shadow-sm">
                  <span className="text-xs text-[#747D74] uppercase font-semibold">Valid &amp; Streamable</span>
                  <p className="text-2xl font-bold text-[#173D2D] mt-1">{auditSummary.validBooks}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E3E6DF] shadow-sm">
                  <span className="text-xs text-[#747D74] uppercase font-semibold">Titles With Warnings</span>
                  <p className="text-2xl font-bold text-amber-700 mt-1">{auditSummary.issuesCount}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E3E6DF] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs divide-y divide-[#E3E6DF]">
                <thead className="bg-[#F8F6EF] text-[#202820] uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Formats</th>
                    <th className="py-3 px-4">Provenance Audit</th>
                    <th className="py-3 px-4 text-right">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E6DF]">
                  {auditItems.map((item) => (
                    <tr key={item.bookId} className="hover:bg-[#F8F6EF]/60">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#202820]">{item.title}</p>
                        <p className="text-[#747D74] text-[11px]">{item.author}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className={item.hasPdf ? 'text-[#173D2D] font-semibold' : 'text-neutral-400'}>PDF</span> •{' '}
                        <span className={item.hasEpub ? 'text-[#173D2D] font-semibold' : 'text-neutral-400'}>EPUB</span>
                      </td>
                      <td className="py-3 px-4">
                        {item.issues.length === 0 ? (
                          <span className="text-[#173D2D] flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Complete
                          </span>
                        ) : (
                          <div className="text-amber-800 space-y-0.5">
                            {item.issues.map((iss: string, idx: number) => (
                              <p key={idx} className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                                <span>{iss}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === 'valid'
                              ? 'bg-[#DCE6DC] text-[#173D2D]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================
          MODAL 1: EDIT / CREATE BOOK MODAL
         ====================================================================== */}
      {(editingBook || isCreatingBook) && (
        <div
          className="understory-modal-backdrop"
          role="dialog"
          aria-modal="true"
        >
          <div className="understory-modal-box">
            {/* Modal Header */}
            <div className="understory-modal-header">
              <div className="understory-modal-title-row">
                <div className="understory-modal-icon-badge">
                  {editingBook ? <Edit3 size={18} /> : <BookPlus size={18} />}
                </div>
                <div>
                  <h2 className="understory-modal-title">
                    {editingBook ? `Edit Book: ${editingBook.title}` : 'Add New Book to Catalogue'}
                  </h2>
                  <p className="understory-modal-sub">
                    {editingBook ? `Catalogue Identifier: ${editingBook.id}` : 'Fill in the bibliographic and access metadata below'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBook(null);
                  setIsCreatingBook(false);
                }}
                className="understory-modal-close-btn"
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBook}>
              <div className="understory-modal-body">
                <div className="understory-edit-grid">
                  {/* Left Column: Live Cover Preview */}
                  <div className="understory-cover-col">
                    <label className="understory-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#747D74', fontSize: '0.72rem' }}>
                      Cover Artwork Preview
                    </label>
                    <div className="understory-cover-stage">
                      {formData.coverUrl ? (
                        <img
                          src={formData.coverUrl}
                          alt="Cover Preview"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/covers/real/pride-and-prejudice.jpg';
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#747D74' }}>No image URL</span>
                      )}
                    </div>
                    <div className="understory-field-group">
                      <label className="understory-label">
                        Cover Image Path / URL
                      </label>
                      <input
                        type="text"
                        value={formData.coverUrl}
                        onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                        placeholder="/covers/real/your-cover.jpg"
                        className="understory-input"
                      />
                      <span style={{ fontSize: '0.68rem', color: '#747D74', marginTop: '0.2rem' }}>
                        Local paths: <code>/covers/real/...</code> or <code>/covers/somali/...</code>
                      </span>
                    </div>
                  </div>

                  {/* Right Columns: Book Details */}
                  <div className="understory-fields-col">
                    {/* Title & Subtitle */}
                    <div className="understory-form-row">
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Book Title <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="understory-input"
                          placeholder="e.g. The Great Gatsby"
                        />
                      </div>
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Subtitle / Edition
                        </label>
                        <input
                          type="text"
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          className="understory-input"
                          placeholder="e.g. Centennial Unabridged Masterwork"
                        />
                      </div>
                    </div>

                    {/* Author, Year, Pages */}
                    <div className="understory-form-row">
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Author Name <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="understory-input"
                          placeholder="e.g. F. Scott Fitzgerald"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                        <div className="understory-field-group">
                          <label className="understory-label">Year</label>
                          <input
                            type="number"
                            value={formData.publishedYear}
                            onChange={(e) => setFormData({ ...formData, publishedYear: Number(e.target.value) })}
                            className="understory-input"
                          />
                        </div>
                        <div className="understory-field-group">
                          <label className="understory-label">Pages</label>
                          <input
                            type="number"
                            value={formData.pages}
                            onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                            className="understory-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject Room & Genre */}
                    <div className="understory-form-row">
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Subject Room / Category
                        </label>
                        <select
                          value={formData.categorySlug}
                          onChange={(e) => {
                            const slug = e.target.value;
                            const found = CATEGORIES.find((c) => c.slug === slug);
                            setFormData({
                              ...formData,
                              categorySlug: slug,
                              category: found ? found.name : formData.category
                            });
                          }}
                          className="understory-select"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Specific Genre Tag
                        </label>
                        <input
                          type="text"
                          value={formData.genre}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                          className="understory-input"
                          placeholder="e.g. American Classic Fiction"
                        />
                      </div>
                    </div>

                    {/* Pricing: Free vs Paid */}
                    <div className="understory-pricing-box">
                      <div className="understory-pricing-header">
                        <span className="understory-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#173D2D', fontSize: '0.72rem' }}>
                          Pricing &amp; Monetisation
                        </span>
                        <label className="understory-checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.isFree}
                            onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                            style={{ accentColor: '#173D2D', width: '16px', height: '16px' }}
                          />
                          <span>100% Free Open Access</span>
                        </label>
                      </div>

                      {!formData.isFree && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '0.25rem' }}>
                          <label className="understory-label">Currency:</label>
                          <select
                            value={formData.currency || 'USD'}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="understory-select"
                            style={{ width: '120px' }}
                          >
                            <option value="USD">USD ($)</option>
                            <option value="KES">KES (KSh)</option>
                            <option value="SOS">SOS (So.Sh.)</option>
                          </select>
                          <label className="understory-label">Retail Price:</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="understory-input"
                            style={{ width: '110px' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Access Type & Access Status */}
                    <div className="understory-form-row">
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Reader Access Type
                        </label>
                        <select
                          value={formData.accessType}
                          onChange={(e) => setFormData({ ...formData, accessType: e.target.value as any })}
                          className="understory-select"
                        >
                          <option value="full-text">Full-Text In-Browser Ebook</option>
                          <option value="preview-only">Sample / Preview Only</option>
                          <option value="external-only">External Borrow / Library</option>
                          <option value="metadata-only">Bibliographic Metadata Only</option>
                        </select>
                      </div>

                      <div className="understory-field-group">
                        <label className="understory-label">
                          Admin Availability Status
                        </label>
                        <select
                          value={formData.accessStatus}
                          onChange={(e) => setFormData({ ...formData, accessStatus: e.target.value as any })}
                          className="understory-select"
                        >
                          {ACCESS_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Synopsis / Description */}
                    <div className="understory-field-group">
                      <label className="understory-label">
                        Synopsis / Editorial Overview
                      </label>
                      <textarea
                        rows={3}
                        value={formData.shortSynopsis}
                        onChange={(e) => setFormData({ ...formData, shortSynopsis: e.target.value })}
                        placeholder="Enter a literary summary or editorial introduction..."
                        className="understory-textarea"
                      />
                    </div>

                    {/* Rights & ISBN */}
                    <div className="understory-form-row">
                      <div className="understory-field-group">
                        <label className="understory-label">
                          Rights Holder / Publisher
                        </label>
                        <input
                          type="text"
                          value={formData.rightsHolder}
                          onChange={(e) => setFormData({ ...formData, rightsHolder: e.target.value })}
                          className="understory-input"
                          placeholder="Author or Heritage Estate"
                        />
                      </div>
                      <div className="understory-field-group">
                        <label className="understory-label">
                          ISBN / Catalog Number
                        </label>
                        <input
                          type="text"
                          value={formData.isbn}
                          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                          className="understory-input"
                          placeholder="e.g. 978-0141439518"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="understory-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBook(null);
                    setIsCreatingBook(false);
                  }}
                  className="btn-admin-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-admin-primary"
                >
                  <Save size={15} />
                  <span>{isSaving ? 'Saving...' : editingBook ? 'Save Changes' : 'Create Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: CONFIRM DELETE BOOK MODAL
         ====================================================================== */}
      {deletingBook && (
        <div
          className="understory-modal-backdrop"
          role="dialog"
          aria-modal="true"
        >
          <div className="understory-modal-box delete-box">
            {/* Modal Header */}
            <div className="understory-modal-header">
              <div className="understory-modal-title-row">
                <div className="understory-modal-icon-badge danger">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="understory-modal-title">
                    Delete Book from Catalogue?
                  </h3>
                  <p className="understory-modal-sub">
                    This action will remove the book from discovery and reading.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="understory-modal-close-btn"
                title="Cancel"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Book Summary Card */}
              <div className="understory-delete-summary">
                <img
                  src={deletingBook.coverUrl}
                  alt={deletingBook.title}
                  className="understory-delete-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/covers/real/pride-and-prejudice.jpg';
                  }}
                />
                <div className="understory-delete-info">
                  <p className="understory-delete-title">{deletingBook.title}</p>
                  <p className="understory-delete-meta">by {deletingBook.author} ({deletingBook.publishedYear})</p>
                  <span className="understory-table-book-id">{deletingBook.id}</span>
                </div>
              </div>

              <div className="understory-delete-warning">
                <strong>Archival Notice:</strong> Readers who previously bookmarked this edition will see it marked as archived. All catalogue indexing, carousels, and search entries for this volume will be cleared immediately.
              </div>
            </div>

            <div className="understory-modal-footer">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="btn-admin-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-row-action delete"
                style={{ padding: '0.6rem 1.15rem', fontSize: '0.82rem', gap: '0.5rem' }}
              >
                <Trash2 size={15} />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Permanent Deletion'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  FileText,
  History,
  KeyRound,
  Library,
  Trash2,
  UserCheck,
  Flame,
  Award,
  MessageSquare,
  ChevronRight,
  Play,
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
  Check,
  ShieldCheck
} from 'lucide-react';
import {
  Book,
  LibraryStatus,
  UserLibraryPayload,
  UserProfile
} from '../types';
import { BOOKS } from '../data/books';
import { BookCover } from '../components/BookCover';
import { folioApi } from '../services/api';
import {
  getReadingAnalytics,
  formatReadingDuration,
  RealTimeReadingAnalytics
} from '../utils/readingTracker';

export type LibraryTab =
  | 'all'
  | 'currently-reading'
  | 'purchased'
  | 'want-to-read'
  | 'downloadable'
  | 'finished'
  | 'bookmarks'
  | 'downloads'
  | 'history'
  | 'settings';

interface MyLibraryPageProps {
  user: UserProfile;
  library: UserLibraryPayload;
  dynamicBooks: Book[];
  initialTab?: LibraryTab;
  onLibraryChange: (library: UserLibraryPayload) => void;
  onUserUpdate: (user: UserProfile) => void;
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string, chapterIndex?: number, mode?: 'web' | 'pdf' | 'text') => void;
  onDownloadBook: (bookId: string, format: 'pdf' | 'epub' | 'html' | 'txt') => void;
  onExploreCatalogue: () => void;
}

export const MyLibraryPage: React.FC<MyLibraryPageProps> = ({
  user,
  library,
  dynamicBooks,
  initialTab = 'all',
  onLibraryChange,
  onUserUpdate,
  onSelectBook,
  onReadBook,
  onDownloadBook,
  onExploreCatalogue
}) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [purchasedList, setPurchasedList] = useState<any[]>([]);
  const [fullName, setFullName] = useState(user.fullName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsErr, setSettingsErr] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Sync tab if prop changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  React.useEffect(() => {
    folioApi
      .getMyPurchases()
      .then((res) => {
        setPurchasedList(res.purchases || []);
      })
      .catch(() => {});
  }, []);

  const findBook = (bookId: string): Book | undefined => {
    return BOOKS.find((b) => b.id === bookId) || dynamicBooks.find((b) => b.id === bookId);
  };

  const currentlyReadingEntries = library.entries.filter((e) => e.status === 'currently-reading');
  const wantToReadEntries = library.entries.filter((e) => e.status === 'want-to-read');
  const finishedEntries = library.entries.filter((e) => e.status === 'finished');
  const downloadableEntries = library.entries.filter((e) => {
    const b = findBook(e.bookId);
    return b && b.provenance.downloadPermitted;
  });
  const downloadsList = library.downloads || [];

  const handleStatusChange = async (bookId: string, status: LibraryStatus | 'remove') => {
    try {
      const updated = await folioApi.updateBookStatus(bookId, status);
      onLibraryChange(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      const updated = await folioApi.deleteBookmark({ id: bookmarkId });
      onLibraryChange(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsErr('');
    setSettingsMsg('');
    if (fullName.trim().length < 2) {
      setSettingsErr('Full name must be at least 2 characters.');
      return;
    }
    try {
      setSavingSettings(true);
      const res = await folioApi.updateProfile(fullName.trim());
      onUserUpdate(res.user);
      setSettingsMsg('Your display name has been updated.');
    } catch (err: any) {
      setSettingsErr(err?.message || 'Unable to update profile.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsErr('');
    setSettingsMsg('');
    if (newPassword !== confirmNewPassword) {
      setSettingsErr('New password and confirmation do not match.');
      return;
    }
    try {
      setSavingSettings(true);
      const res = await folioApi.changePassword({ currentPassword, newPassword });
      setSettingsMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setSettingsErr(err?.message || 'Unable to change password.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Real-time Reading Analytics Engine (computed from actual active reading time and pages turned)
  const [analytics, setAnalytics] = useState<RealTimeReadingAnalytics>(() => getReadingAnalytics());

  useEffect(() => {
    const refresh = () => setAnalytics(getReadingAnalytics());
    refresh();
    window.addEventListener('focus', refresh);
    const interval = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener('focus', refresh);
      clearInterval(interval);
    };
  }, []);

  // Compute 7-day activity bars (last 7 days up to today)
  const last7Days = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const log = analytics.dailyLogs[key];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({
        date: key,
        dayName,
        minutes: log ? Math.round(log.seconds / 60) : 0,
        pages: log ? log.pages : 0,
        isToday: i === 0
      });
    }
    return days;
  }, [analytics.dailyLogs]);

  const maxMinutes = Math.max(30, ...last7Days.map((d) => d.minutes));

  // Dynamic desk books mapped directly to real library items and actual sessions
  const activeDeskBooks = useMemo(() => {
    const sessionBookIds = analytics.sessions.map((s) => s.bookId);
    const readingBookIds = currentlyReadingEntries.map((e) => e.bookId);
    const progressBookIds = library.progress.map((p) => p.bookId);
    const candidateBookIds: string[] = [
      ...sessionBookIds,
      ...readingBookIds,
      ...progressBookIds,
      ...library.entries.map((e) => e.bookId),
      ...(dynamicBooks.length > 0 ? dynamicBooks.map((b) => b.id) : []),
      ...BOOKS.map((b) => b.id)
    ];
    const uniqueDeskBookIds = Array.from(new Set(candidateBookIds)).slice(0, 3);
    const deskPalette: Array<{ badgeColor: string; btnColor: 'purple' | 'green' | 'dark' }> = [
      { badgeColor: 'blue', btnColor: 'purple' },
      { badgeColor: 'purple', btnColor: 'dark' },
      { badgeColor: 'green', btnColor: 'green' }
    ];

    return uniqueDeskBookIds.map((bId, idx) => {
      const book = findBook(bId) || BOOKS[0];
      const progress = library.progress.find((p) => p.bookId === book.id);
      const session = analytics.sessions.find((s) => s.bookId === book.id);
      const totalP = progress?.totalPages || book.pages || 218;
      const progressPct = progress?.overallPercentage ?? (session ? Math.min(95, Math.max(10, Math.round((session.pagesRead / totalP) * 100))) : (idx === 0 ? 35 : idx === 1 ? 15 : 60));
      const currentP = progress?.lastReadPage || Math.max(1, Math.round((progressPct / 100) * totalP));
      const timeSpentSec = analytics.sessions.filter((s) => s.bookId === book.id).reduce((sum, s) => sum + s.durationSeconds, 0);
      const notesCount = library.bookmarks.filter((b) => b.bookId === book.id).length;
      const stylePreset = deskPalette[idx % deskPalette.length];

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        genrePill: (book.category || 'LITERATURE').toUpperCase().replace('-', ' '),
        badgeColor: stylePreset.badgeColor,
        btnColor: stylePreset.btnColor,
        progressPct,
        metaText: `${progressPct}% Completed (p. ${currentP} of ${totalP}) • ${timeSpentSec > 0 ? formatReadingDuration(timeSpentSec) + ' spent' : 'Ready to read'}`,
        notesCount,
        coverUrl: book.coverUrl
      };
    });
  }, [analytics, currentlyReadingEntries, library.progress, library.bookmarks, dynamicBooks]);

  return (
    <div className="my-library-page library-luxury-canvas">
      <div className="library-luxury-container">
        {/* Top Welcome Banner Card with Real-Time Reading Metrics */}
        <div className="library-welcome-banner-card">
          <div>
            <div className="library-streak-pill" style={{ backgroundColor: '#DCE6DC', color: '#173D2D', borderColor: '#CBD5CB' }}>
              <Flame size={13} fill="#173D2D" color="#173D2D" />
              <span>
                {user.id === 'guest-reader'
                  ? 'Local Device Library'
                  : user.role === 'admin'
                  ? 'Administrator Workspace'
                  : `${analytics.currentStreakDays}-Day Active Reading Streak`}
              </span>
            </div>
            <h1 className="library-welcome-heading">
              {user.id === 'guest-reader'
                ? 'Your Reading Sanctuary'
                : user.role === 'admin'
                ? 'Understory Administrator Library'
                : `Welcome back, ${user.fullName || 'Reader'}`}
            </h1>
            <p className="library-welcome-sub">
              {user.id === 'guest-reader' ? (
                <span>You are viewing your locally saved books and reading desk. Sign in to synchronize your reading progress, notes, and purchases across all devices.</span>
              ) : (
                <span>You have spent <strong>{formatReadingDuration(analytics.thisWeekSeconds)}</strong> actively reading this week across your library, averaging <strong>{analytics.averageWeeklyHours} hours/week</strong> and <strong>{analytics.pagesPerDay} pages/day</strong>.</span>
              )}
            </p>
          </div>

          <div className="library-stats-chips-row">
            <div className="library-stat-box">
              <div className="stat-icon-wrap blue" style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}>
                <Clock size={20} />
              </div>
              <div className="stat-box-content">
                <span className="stat-box-label">WEEKLY AVERAGE</span>
                <span className="stat-box-number">{analytics.averageWeeklyHours} hrs / wk</span>
              </div>
            </div>

            <div className="library-stat-box">
              <div className="stat-icon-wrap green" style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}>
                <BookOpen size={20} />
              </div>
              <div className="stat-box-content">
                <span className="stat-box-label">PAGES PER DAY</span>
                <span className="stat-box-number">{analytics.pagesPerDay} pages / day</span>
              </div>
            </div>

            <div className="library-stat-box">
              <div className="stat-icon-wrap purple" style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}>
                <Activity size={20} />
              </div>
              <div className="stat-box-content">
                <span className="stat-box-label">TIME READ TODAY</span>
                <span className="stat-box-number">{formatReadingDuration(analytics.todaySeconds)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Grid: Real-Time Reading Velocity + Recent Reading Sessions */}
        <div className="library-middle-grid">
          {/* Left Card: Real-Time Weekly Reading Velocity */}
          <div className="reading-challenge-card" style={{ padding: '1.75rem' }}>
            <div className="challenge-top-row">
              <div className="challenge-badge-row">
                <span className="challenge-pill-blue" style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}>
                  WEEKLY READING VELOCITY
                </span>
                <span className="challenge-pill-ontrack" style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#173D2D', marginRight: 4 }} />
                  Live Activity Tracked
                </span>
              </div>
              <span className="challenge-percent-pill" style={{ backgroundColor: '#F8F6EF', color: '#202820', borderColor: '#E3E6DF' }}>
                {analytics.averageWeeklyHours} hrs/wk
              </span>
            </div>

            <h2 className="challenge-heading" style={{ fontSize: '1.35rem', margin: '0.75rem 0 1rem' }}>
              {formatReadingDuration(analytics.thisWeekSeconds)} Spent Reading This Week
            </h2>

            {/* 7-Day Activity Bar Chart */}
            <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '90px', padding: '0.5rem 0', gap: '0.5rem' }}>
                {last7Days.map((day) => {
                  const heightPct = Math.max(12, Math.round((day.minutes / maxMinutes) * 100));
                  return (
                    <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.7rem', color: day.isToday ? '#173D2D' : '#747D74', fontWeight: day.isToday ? 700 : 500, marginBottom: '4px' }}>
                        {day.minutes > 0 ? `${day.minutes}m` : '-'}
                      </span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '28px',
                          height: `${heightPct}%`,
                          backgroundColor: day.isToday ? '#173D2D' : day.minutes > 0 ? '#CBD5CB' : '#E3E6DF',
                          borderRadius: '6px 6px 2px 2px',
                          transition: 'height 0.3s ease'
                        }}
                        title={`${day.date}: ${day.minutes} minutes, ${day.pages} pages`}
                      />
                      <span style={{ fontSize: '0.72rem', color: day.isToday ? '#0F172A' : '#64748B', fontWeight: day.isToday ? 800 : 500, marginTop: '6px' }}>
                        {day.dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real Metrics Summary Footer */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E3E6DF', fontSize: '0.82rem', color: '#747D74' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} style={{ color: '#173D2D' }} />
                <span>Pacing: <strong>{analytics.pagesPerDay} pages / day</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} style={{ color: '#173D2D' }} />
                <span>Total time: <strong>{formatReadingDuration(analytics.totalSecondsRead)}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={15} style={{ color: '#D97706' }} />
                <span>Total read: <strong>{analytics.totalPagesRead.toLocaleString()} pages</strong></span>
              </div>
            </div>
          </div>

          {/* Right Card: Real Reading Sessions Log */}
          <div className="curator-accolades-card" style={{ padding: '1.75rem' }}>
            <div className="accolades-top-row">
              <h3 className="accolades-title" style={{ fontSize: '1.15rem' }}>Recent Reading Sessions</h3>
              <span className="accolades-new-pill" style={{ backgroundColor: '#DCE6DC', color: '#173D2D' }}>
                {analytics.sessions.length} Recorded
              </span>
            </div>
            <p className="accolades-sub" style={{ marginBottom: '1rem', fontSize: '0.84rem' }}>
              Real-time reading duration recorded from active reading in Web Reader, EPUB, and PDF.
            </p>

            <div className="accolades-list" style={{ gap: '0.75rem', maxHeight: '210px', overflowY: 'auto' }}>
              {analytics.sessions.slice(0, 4).map((session) => (
                <div
                  key={session.id}
                  className="accolade-row-item"
                  style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DCE6DC', color: '#173D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {session.bookTitle}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '2px 0 0' }}>
                        {session.pagesRead} pages • {session.format.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#173D2D', display: 'block' }}>
                      {formatReadingDuration(session.durationSeconds)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {session.endedAt ? new Date(session.endedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-view-all-badges"
              onClick={() => setActiveTab('history')}
              style={{
                width: '100%',
                marginTop: '1rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#173D2D',
                fontSize: '0.84rem',
                fontWeight: 600,
                padding: '0.6rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              View Full Reading History &amp; Sessions →
            </button>
          </div>
        </div>

        {/* Bottom: Active Desk • Currently Reading */}
        <div className="active-desk-section">
          <div className="active-desk-header">
            <div>
              <span className="active-desk-eyebrow">ACTIVE DESK</span>
              <h2 className="active-desk-title">Currently Reading</h2>
            </div>
            <span className="active-desk-slots-pill">
              {activeDeskBooks.length} of 3 Active Slots Occupied
            </span>
          </div>

          <div className="active-desk-cards-grid">
            {activeDeskBooks.map((deskBook) => (
              <div key={deskBook.id} className="desk-book-card">
                <div className="desk-card-top">
                  <img
                    src={deskBook.coverUrl}
                    alt={deskBook.title}
                    className="desk-card-thumb"
                  />
                  <div className="desk-card-info">
                    <span className={`desk-card-pill ${deskBook.badgeColor}`}>
                      {deskBook.genrePill}
                    </span>
                    <h3 className="desk-card-title">{deskBook.title}</h3>
                    <span className="desk-card-author">{deskBook.author}</span>
                  </div>
                </div>

                <div className="desk-card-progress-bar">
                  <div
                    className="desk-card-progress-fill"
                    style={{
                      width: `${deskBook.progressPct}%`,
                      background:
                        deskBook.btnColor === 'purple' || deskBook.btnColor === 'green'
                          ? 'linear-gradient(90deg, #173D2D 0%, #21543E 100%)'
                          : '#202820'
                    }}
                  />
                </div>

                <div className="desk-card-meta-row">
                  <span>{deskBook.metaText}</span>
                </div>

                <div className="desk-card-action-btns">
                  <button
                    type="button"
                    className={`btn-desk-resume ${deskBook.btnColor}`}
                    onClick={() => {
                      const bookObj = findBook(deskBook.id);
                      if (bookObj) {
                        onReadBook(bookObj.id, 0);
                      } else {
                        onSelectBook(deskBook.id);
                      }
                    }}
                  >
                    <Play size={13} fill="#FFFFFF" />
                    <span>Resume Reading</span>
                  </button>
                  <button
                    type="button"
                    className="btn-desk-notes"
                    onClick={() => {
                      const bookObj = findBook(deskBook.id);
                      if (bookObj) onSelectBook(bookObj.id);
                    }}
                  >
                    Notes ({deskBook.notesCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="my-library-tabs-bar">
        <div className="container my-library-tabs-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`lib-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Library size={15} />
            <span>Overview ({library.entries.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'currently-reading'}
            className={`lib-tab-btn ${activeTab === 'currently-reading' ? 'active' : ''}`}
            onClick={() => setActiveTab('currently-reading')}
          >
            <BookOpen size={15} />
            <span>Continue Reading ({currentlyReadingEntries.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'purchased'}
            className={`lib-tab-btn ${activeTab === 'purchased' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchased')}
          >
            <ShieldCheck size={15} />
            <span>Purchased Books ({purchasedList.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'downloadable'}
            className={`lib-tab-btn ${activeTab === 'downloadable' ? 'active' : ''}`}
            onClick={() => setActiveTab('downloadable')}
          >
            <FileText size={15} />
            <span>Downloadable Books ({downloadableEntries.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'want-to-read'}
            className={`lib-tab-btn ${activeTab === 'want-to-read' ? 'active' : ''}`}
            onClick={() => setActiveTab('want-to-read')}
          >
            <Bookmark size={15} />
            <span>Saved Books ({wantToReadEntries.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'finished'}
            className={`lib-tab-btn ${activeTab === 'finished' ? 'active' : ''}`}
            onClick={() => setActiveTab('finished')}
          >
            <CheckCircle2 size={15} />
            <span>Finished ({finishedEntries.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'bookmarks'}
            className={`lib-tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            <Bookmark size={15} />
            <span>Bookmarks ({library.bookmarks.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'downloads'}
            className={`lib-tab-btn ${activeTab === 'downloads' ? 'active' : ''}`}
            onClick={() => setActiveTab('downloads')}
          >
            <Download size={15} />
            <span>Download History ({downloadsList.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'history'}
            className={`lib-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={15} />
            <span>Recently Read ({library.history.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            className={`lib-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <UserCheck size={15} />
            <span>Account</span>
          </button>
        </div>
      </div>

      <div className="container my-library-body">
        {/* 1. CONTINUE READING BANNER */}
        {(activeTab === 'all' || activeTab === 'currently-reading') && library.progress.length > 0 && (
          <section className="my-lib-section">
            <div className="my-lib-section-header">
              <div>
                <span className="section-eyebrow">SAVED READING PROGRESS</span>
                <h2 className="my-lib-section-title">Continue Reading Where You Left Off</h2>
              </div>
            </div>
            <div className="progress-cards-grid">
              {library.progress.map((prog) => {
                const book = findBook(prog.bookId);
                if (!book) return null;
                const isPdfPreferred = prog.preferredFormat === 'pdf' && (prog.lastReadPage ?? 1) > 1;
                const chapterLabel = isPdfPreferred
                  ? `PDF Page ${prog.lastReadPage} of ${prog.totalPages || 1}`
                  : book.sampleChapters[prog.chapterIndex]?.number || `Chapter ${prog.chapterIndex + 1}`;
                const chapterTitle =
                  book.sampleChapters[prog.chapterIndex]?.title || book.title;

                return (
                  <article key={prog.bookId} className="saved-progress-card">
                    <div
                      className="saved-progress-cover"
                      onClick={() => onSelectBook(book.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <BookCover book={book} size="sm" />
                    </div>
                    <div className="saved-progress-info">
                      <div className="saved-progress-top">
                        <span className="saved-progress-chapter-pill">
                          {chapterLabel} • {prog.overallPercentage}% Complete
                        </span>
                        <span className="saved-progress-date">
                          <Clock size={12} /> Opened {new Date(prog.lastOpenedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="saved-progress-title" onClick={() => onSelectBook(book.id)}>
                        {book.title}
                      </h3>
                      <p className="saved-progress-author">
                        {book.author} — <em>{chapterTitle}</em> ({book.availableFormats.join(', ') || 'Web'})
                      </p>
                      <div className="saved-progress-bar-track">
                        <div
                          className="saved-progress-bar-fill"
                          style={{ width: `${Math.max(4, prog.overallPercentage)}%` }}
                        />
                      </div>
                      <div className="saved-progress-actions">
                        <button
                          type="button"
                          className="btn-primary-solid btn-sm"
                          onClick={() =>
                            onReadBook(
                              book.id,
                              prog.chapterIndex,
                              isPdfPreferred ? 'pdf' : 'web'
                            )
                          }
                        >
                          <BookOpen size={14} />
                          <span>Resume Reading</span>
                        </button>
                        {book.availableFormats.includes('PDF') && book.provenance.downloadPermitted && (
                          <button
                            type="button"
                            className="btn-secondary-outline btn-sm"
                            onClick={() => onReadBook(book.id, prog.chapterIndex, 'pdf')}
                          >
                            <FileText size={14} />
                            <span>Open PDF (p. {prog.lastReadPage || 1})</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-secondary-outline btn-sm"
                          onClick={() => onSelectBook(book.id)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. SHELF ITEMS (ALL / CURRENTLY READING / WANT TO READ / DOWNLOADABLE / FINISHED) */}
        {['all', 'currently-reading', 'want-to-read', 'downloadable', 'finished'].includes(activeTab) && (
          <section className="my-lib-section">
            <div className="my-lib-section-header">
              <div>
                <span className="section-eyebrow">PERSONAL LIBRARY SHELVES</span>
                <h2 className="my-lib-section-title">
                  {activeTab === 'all'
                    ? 'All Saved Volumes'
                    : activeTab === 'currently-reading'
                    ? 'Currently Reading'
                    : activeTab === 'downloadable'
                    ? 'Downloadable Books in Your Library'
                    : activeTab === 'want-to-read'
                    ? 'Saved Books (Want to Read)'
                    : 'Finished Books'}
                </h2>
              </div>
              <button type="button" className="btn-secondary-outline btn-sm" onClick={onExploreCatalogue}>
                <Compass size={14} />
                <span>Discover Free Books</span>
              </button>
            </div>

            {(() => {
              const filteredEntries =
                activeTab === 'all'
                  ? library.entries
                  : activeTab === 'downloadable'
                  ? downloadableEntries
                  : library.entries.filter((e) => e.status === activeTab);

              if (filteredEntries.length === 0) {
                return (
                  <div className="my-lib-empty-box">
                    <Library size={28} />
                    <h3>Your shelf is waiting for its first volume</h3>
                    <p>
                      Browse our Free Books archive of public-domain full editions and open-access textbooks to build your personal library.
                    </p>
                    <button type="button" className="btn-primary-solid" onClick={onExploreCatalogue}>
                      Explore Free Books
                    </button>
                  </div>
                );
              }

              return (
                <div className="my-lib-books-list">
                  {filteredEntries.map((entry) => {
                    const book = findBook(entry.bookId);
                    if (!book) return null;
                    const prog = library.progress.find((p) => p.bookId === book.id);
                    const hasPdf = book.availableFormats.includes('PDF') && book.provenance.downloadPermitted;
                    const hasEpub = book.availableFormats.includes('EPUB') && book.provenance.downloadPermitted;

                    return (
                      <article key={entry.id} className="my-lib-book-row">
                        <div
                          className="my-lib-row-cover"
                          onClick={() => onSelectBook(book.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <BookCover book={book} size="sm" />
                        </div>
                        <div className="my-lib-row-main">
                          <div className="my-lib-row-badges">
                            <span className={`lib-status-badge status-${entry.status}`}>
                              {entry.status === 'currently-reading'
                                ? 'Currently Reading'
                                : entry.status === 'want-to-read'
                                ? 'Saved (Want to Read)'
                                : 'Finished'}
                            </span>
                            <span className="lib-access-badge">
                              {book.availableFormats.length > 0
                                ? `Formats: ${book.availableFormats.join(', ')}`
                                : book.accessType === 'preview-only'
                                ? 'Sample Preview'
                                : 'Metadata'}
                            </span>
                            {prog && (
                              <span className="lib-progress-inline">
                                {prog.overallPercentage}% Read
                                {prog.lastReadPage && prog.lastReadPage > 1
                                  ? ` (PDF p. ${prog.lastReadPage})`
                                  : ''}
                              </span>
                            )}
                          </div>
                          <h3 className="my-lib-row-title" onClick={() => onSelectBook(book.id)}>
                            {book.title}
                          </h3>
                          <p className="my-lib-row-author">
                            {book.author} • {book.category} • {book.publishedYear}
                          </p>
                          <p className="my-lib-row-synopsis">{book.shortSynopsis}</p>
                        </div>

                        <div className="my-lib-row-controls">
                          <label className="shelf-select-label">
                            <span>Reading Status</span>
                            <select
                              value={entry.status}
                              onChange={(e) =>
                                handleStatusChange(book.id, e.target.value as LibraryStatus | 'remove')
                              }
                            >
                              <option value="currently-reading">Currently Reading</option>
                              <option value="want-to-read">Want to Read</option>
                              <option value="finished">Finished</option>
                              <option value="remove">Remove from Library</option>
                            </select>
                          </label>
                          <div className="my-lib-row-btns">
                            {book.accessType !== 'metadata-only' && (
                              <button
                                type="button"
                                className="btn-primary-solid btn-sm"
                                onClick={() => onReadBook(book.id, prog?.chapterIndex || 0, (prog?.preferredFormat as any) || undefined)}
                              >
                                <BookOpen size={14} />
                                <span>
                                  {book.provenance.fullTextReadingPermitted ? 'Read Book' : 'Read Preview'}
                                </span>
                              </button>
                            )}
                            {hasPdf && (
                              <button
                                type="button"
                                className="btn-secondary-outline btn-sm"
                                onClick={() => onDownloadBook(book.id, 'pdf')}
                                title="Download PDF Edition"
                              >
                                <Download size={13} />
                                <span>PDF</span>
                              </button>
                            )}
                            {hasEpub && (
                              <button
                                type="button"
                                className="btn-secondary-outline btn-sm"
                                onClick={() => onDownloadBook(book.id, 'epub')}
                                title="Download EPUB Edition"
                              >
                                <Download size={13} />
                                <span>EPUB</span>
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn-secondary-outline btn-sm"
                              onClick={() => onSelectBook(book.id)}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              );
            })()}
          </section>
        )}

        {/* 2.5 PURCHASED BOOKS SECTION */}
        {(activeTab === 'purchased' || (activeTab === 'all' && purchasedList.length > 0)) && (
          <section className="my-lib-section">
            <div className="my-lib-section-header">
              <div>
                <span className="section-eyebrow">ACTIVE PURCHASE ENTITLEMENTS</span>
                <h2 className="my-lib-section-title">
                  Purchased Books ({purchasedList.length})
                </h2>
              </div>
            </div>

            {purchasedList.length === 0 ? (
              <div className="my-lib-empty-box compact">
                <ShieldCheck size={28} color="#047857" />
                <p>
                  You have not purchased any paid ebook editions yet. Explore our curated catalogue for original author editions.
                </p>
                <button
                  type="button"
                  className="btn-primary-lib btn-sm mt-2"
                  onClick={onExploreCatalogue}
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              <div className="my-lib-grid">
                {purchasedList.map((item) => {
                  const bookId = item.book_id || item.bookId;
                  const book = findBook(bookId) || ({
                    id: bookId,
                    title: item.title || 'Author Edition',
                    author: item.author || 'Author',
                    coverUrl: item.cover_url || '',
                    coverAlt: item.title || 'Book Cover',
                    availableFormats: ['PDF', 'EPUB'],
                    category: 'Literature'
                  } as Book);

                  const purchaseDate = item.created_at || item.createdAt
                    ? new Date(item.created_at || item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Active Access';

                  return (
                    <article key={item.id || item.order_id || bookId} className="my-lib-book-card">
                      <div
                        className="my-lib-cover-wrap"
                        onClick={() => onSelectBook(book.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <BookCover book={book} size="sm" />
                        <span
                          style={{
                            position: 'absolute',
                            top: '0.4rem',
                            left: '0.4rem',
                            background: '#047857',
                            color: '#FFFFFF',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            zIndex: 2
                          }}
                        >
                          PURCHASED
                        </span>
                      </div>
                      <div className="my-lib-book-info">
                        <h3 className="my-lib-title">
                          <button
                            type="button"
                            className="my-lib-title-btn"
                            onClick={() => onSelectBook(book.id)}
                          >
                            {book.title}
                          </button>
                        </h3>
                        <p className="my-lib-author">by {book.author}</p>
                        <p style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.2rem' }}>
                          Purchased on {purchaseDate} • {item.amount ? `${item.currency || 'USD'} ${item.amount}` : 'Paid Edition'}
                        </p>
                        <div className="my-lib-card-actions" style={{ marginTop: '0.6rem' }}>
                          <button
                            type="button"
                            className="btn-primary-lib btn-sm"
                            onClick={() => onReadBook(book.id, 0)}
                          >
                            <BookOpen size={13} />
                            <span>Read Full Book</span>
                          </button>
                          <button
                            type="button"
                            className="btn-secondary-outline btn-sm"
                            onClick={() => onSelectBook(book.id)}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 3. DOWNLOAD HISTORY SECTION */}
        {(activeTab === 'downloads' || activeTab === 'all') && (
          <section className="my-lib-section">
            <div className="my-lib-section-header">
              <div>
                <span className="section-eyebrow">VERIFIED FILE ARCHIVE</span>
                <h2 className="my-lib-section-title">Download History</h2>
              </div>
            </div>

            {downloadsList.length === 0 ? (
              <div className="my-lib-empty-box compact">
                <Download size={22} />
                <p>
                  No downloaded files yet. Download any PDF, EPUB, HTML, or Plain Text book to keep a permanent record here for one-click re-downloading.
                </p>
              </div>
            ) : (
              <div className="history-timeline-list">
                {downloadsList.map((dl) => {
                  const book = findBook(dl.bookId);
                  if (!book) return null;
                  const fmtParam =
                    dl.format === 'PDF'
                      ? 'pdf'
                      : dl.format === 'EPUB'
                      ? 'epub'
                      : dl.format === 'HTML'
                      ? 'html'
                      : 'txt';

                  return (
                    <div key={dl.id} className="history-timeline-row">
                      <div className="history-row-left">
                        <Download size={15} className="brass-icon" />
                        <div>
                          <strong
                            className="history-book-link"
                            onClick={() => onSelectBook(book.id)}
                          >
                            {book.title}
                          </strong>
                          <span className="history-book-sub">
                            {' '}
                            by {book.author} • Format: <strong>{dl.format}</strong> (
                            {(dl.fileSizeBytes / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      </div>
                      <div className="history-row-right">
                        <span className="history-timestamp">
                          {new Date(dl.downloadedAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <button
                          type="button"
                          className="btn-secondary-outline btn-sm"
                          onClick={() => onDownloadBook(book.id, fmtParam)}
                        >
                          <Download size={13} />
                          <span>Download Again</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 4. BOOKMARKS SECTION */}
        {(activeTab === 'bookmarks' || activeTab === 'all') && (
          <section className="my-lib-section">
            <div className="my-lib-section-header">
              <div>
                <span className="section-eyebrow">SAVED BOOKMARKS &amp; ANNOTATIONS</span>
                <h2 className="my-lib-section-title">Bookmarked Books &amp; Chapters</h2>
              </div>
            </div>

            {library.bookmarks.length === 0 ? (
              <div className="my-lib-empty-box compact">
                <Bookmark size={22} />
                <p>No saved bookmarks yet. Click the bookmark icon on any book or chapter inside the Web Reader.</p>
              </div>
            ) : (
              <div className="bookmarks-list-grid">
                {library.bookmarks.map((bm) => {
                  const book = findBook(bm.bookId);
                  if (!book) return null;
                  return (
                    <article key={bm.id} className="bookmark-item-card">
                      <div className="bookmark-item-top">
                        <span className="bookmark-chapter-tag">
                          <Bookmark size={12} fill="currentColor" /> {bm.chapterTitle}
                        </span>
                        <button
                          type="button"
                          className="bookmark-delete-btn"
                          onClick={() => handleDeleteBookmark(bm.id)}
                          aria-label="Remove bookmark"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h3 className="bookmark-book-title" onClick={() => onSelectBook(book.id)}>
                        {book.title}
                      </h3>
                      <p className="bookmark-book-author">{book.author}</p>
                      {bm.note && <blockquote className="bookmark-note-quote">“{bm.note}”</blockquote>}
                      <div className="bookmark-item-footer">
                        <span>Saved {new Date(bm.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          className="inline-text-link small strong"
                          onClick={() => onReadBook(book.id, bm.chapterIndex)}
                        >
                          Open in Reader →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 5. READING HISTORY / RECENTLY READ */}
        {(activeTab === 'history' || activeTab === 'all') && (
          <section className="my-lib-section">
            <div className="my-lib-section-header">
              <div>
                <span className="section-eyebrow">READING CHRONICLE</span>
                <h2 className="my-lib-section-title">Recently Read Volumes &amp; Reading History</h2>
              </div>
            </div>

            {library.history.length === 0 ? (
              <div className="my-lib-empty-box compact">
                <History size={22} />
                <p>Books you open in the Understory Web or PDF Reader will appear here chronologically.</p>
              </div>
            ) : (
              <div className="history-timeline-list">
                {library.history.slice(0, 15).map((item) => {
                  const book = findBook(item.bookId);
                  if (!book) return null;
                  return (
                    <div key={item.id} className="history-timeline-row">
                      <div className="history-row-left">
                        <History size={15} className="brass-icon" />
                        <div>
                          <strong
                            className="history-book-link"
                            onClick={() => onSelectBook(book.id)}
                          >
                            {book.title}
                          </strong>
                          <span className="history-book-sub">
                            {' '}
                            by {book.author} • Opened Chapter {item.chapterIndex + 1}
                          </span>
                        </div>
                      </div>
                      <div className="history-row-right">
                        <span className="history-timestamp">
                          {new Date(item.openedAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <button
                          type="button"
                          className="btn-secondary-outline btn-sm"
                          onClick={() => onReadBook(book.id, item.chapterIndex)}
                        >
                          Reopen
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 6. ACCOUNT SETTINGS & CHANGE PASSWORD */}
        {activeTab === 'settings' && (
          <section className="my-lib-section">
            <div className="settings-panels-grid">
              <div className="settings-panel-card">
                <span className="section-eyebrow">ACCOUNT SETTINGS</span>
                <h2>Reader Profile</h2>
                <p className="settings-panel-desc">
                  Your profile identity associated with your Understory library shelves, downloads, and saved reading progress.
                </p>

                {settingsErr && (
                  <div className="auth-error-banner" role="alert">
                    <AlertCircle size={16} />
                    <span>{settingsErr}</span>
                  </div>
                )}
                {settingsMsg && (
                  <div className="auth-success-banner" role="status">
                    <CheckCircle2 size={16} />
                    <span>{settingsMsg}</span>
                  </div>
                )}

                <form className="auth-form" onSubmit={handleSaveProfile}>
                  <div className="form-field">
                    <label htmlFor="settings-fullname">Full Name</label>
                    <input
                      id="settings-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="settings-email">Registered Email (Read-Only)</label>
                    <input id="settings-email" type="email" value={user.email} disabled />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary-solid"
                    disabled={savingSettings}
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>

              <div className="settings-panel-card">
                <span className="section-eyebrow">SECURITY &amp; CREDENTIALS</span>
                <h2>
                  <KeyRound size={18} style={{ display: 'inline', marginRight: '6px' }} />
                  Change Password
                </h2>
                <p className="settings-panel-desc">
                  Update your password using salted scrypt encryption. Must be at least 8 characters with letters and numbers.
                </p>

                <form className="auth-form" onSubmit={handleChangePassword}>
                  <div className="form-field">
                    <label htmlFor="chg-current">Current Password</label>
                    <input
                      id="chg-current"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="chg-new">New Password</label>
                    <input
                      id="chg-new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="chg-confirm">Confirm New Password</label>
                    <input
                      id="chg-confirm"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-secondary-outline"
                    disabled={savingSettings}
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

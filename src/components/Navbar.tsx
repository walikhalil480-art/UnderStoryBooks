import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  Bell,
  Search,
  BookOpen,
  User,
  ChevronDown,
  Library,
  History,
  Settings,
  KeyRound,
  LogOut,
  Compass,
  GraduationCap,
  ShieldCheck,
  Layers,
  Users,
  BookMarked,
  Volume2,
  DollarSign
} from 'lucide-react';
import { UserProfile, AdminNotification } from '../types';
import { LibraryTab } from '../pages/MyLibraryPage';
import { UnderstoryLogo, EBaroLogoMark, FolioLogoMark } from './UnderstoryLogo';
import { folioApi } from '../services/api';

function formatTimeAgo(dateStr: string): string {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recent';
  }
}

export type PageRoute =
  | 'home'
  | 'somali-books'
  | 'free-books'
  | 'explore'
  | 'categories'
  | 'authors'
  | 'collections'
  | 'about'
  | 'book-details'
  | 'reader'
  | 'register'
  | 'signin'
  | 'my-library'
  | 'author-submissions'
  | 'admin';

export interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  searchQuery?: string;
  onSearchSubmit?: (query: string) => void;
  onSelectBook?: (bookId: string) => void;
  onStartReading?: () => void;
  bookmarkCount: number;
  ownedCount?: number;
  user: UserProfile | null;
  onOpenMyLibraryTab: (tab: LibraryTab) => void;
  onSignOut: () => void;
}

export { UnderstoryLogo, EBaroLogoMark, FolioLogoMark };

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  searchQuery,
  onSearchSubmit,
  bookmarkCount,
  ownedCount = 0,
  user,
  onOpenMyLibraryTab,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(true);
  const [adminPendingCount, setAdminPendingCount] = useState<number>(0);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [unreadSalesCount, setUnreadSalesCount] = useState<number>(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const fetchAdminNotifications = () => {
    if (user?.role === 'admin') {
      folioApi
        .getAdminNotifications()
        .then((res) => {
          setAdminNotifications(res.notifications || []);
          setUnreadSalesCount(res.unreadCount || 0);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      folioApi
        .getAdminAuthorSubmissions()
        .then((res) => {
          const pending = (res.submissions || []).filter((s: any) => s.status === 'pending');
          setAdminPendingCount(pending.length);
        })
        .catch(() => {});

      fetchAdminNotifications();
      const interval = setInterval(fetchAdminNotifications, 8000);
      return () => clearInterval(interval);
    }
  }, [user, currentPage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleProfileAction = (tab: LibraryTab) => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    onOpenMyLibraryTab(tab);
  };

  const [navSearch, setNavSearch] = useState(searchQuery || '');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      onSearchSubmit?.(navSearch.trim());
      handleNavClick('explore');
    }
  };

  return (
    <header className="ebaro-navbar-root" role="banner">
      {/* 1. Main Navbar Row */}
      <div className="ebaro-navbar-container">
        {/* Understory Brand Wordmark */}
        <button
          type="button"
          className="ebaro-brand-link understory-brand-link"
          onClick={() => handleNavClick('home')}
          aria-label="Understory Home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <UnderstoryLogo variant="full" height={34} />
        </button>

        {/* Primary Desktop Navigation: Pill-style active button with user-preserved names */}
        <nav className="ebaro-nav-menu" aria-label="Main Navigation">
          <button
            type="button"
            className={`ebaro-nav-item-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
            data-testid="nav-home"
          >
            <span>Library</span>
          </button>

          <button
            type="button"
            className={`ebaro-nav-item-btn ${currentPage === 'somali-books' ? 'active' : ''}`}
            onClick={() => handleNavClick('somali-books')}
            title="Buugaagta Af-Soomaaliga (Somali Ebooks & Heritage)"
            data-testid="nav-somali-books"
          >
            <span>Somali Books</span>
          </button>

          <button
            type="button"
            className={`ebaro-nav-item-btn ${currentPage === 'explore' ? 'active' : ''}`}
            onClick={() => handleNavClick('explore')}
            data-testid="nav-explore"
          >
            <span>Explore</span>
          </button>

          <button
            type="button"
            className={`ebaro-nav-item-btn ${currentPage === 'categories' ? 'active' : ''}`}
            onClick={() => handleNavClick('categories')}
            data-testid="nav-categories"
          >
            <span>Categories</span>
          </button>

          <button
            type="button"
            className={`ebaro-nav-item-btn ${currentPage === 'authors' ? 'active' : ''}`}
            onClick={() => handleNavClick('authors')}
            data-testid="nav-authors"
          >
            <span>Authors</span>
          </button>

          <button
            type="button"
            className={`ebaro-nav-item-btn ${currentPage === 'author-submissions' ? 'active' : ''}`}
            onClick={() => handleNavClick('author-submissions')}
            title="Author & Publisher Submission Portal"
            data-testid="nav-author-submissions"
          >
            <span>Publish</span>
          </button>

          {user?.role === 'admin' && (
            <button
              type="button"
              className={`ebaro-nav-item-btn ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin')}
              title={adminPendingCount > 0 ? `Admin Console (${adminPendingCount} Pending Review)` : 'Admin Quality & Rights Console'}
              data-testid="nav-admin"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Admin</span>
              {adminPendingCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#173D2D',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    lineHeight: 1
                  }}
                  title={`${adminPendingCount} book manuscript waiting for approval`}
                >
                  {adminPendingCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Search Bar with ⌘K Badge */}
        <form onSubmit={handleSearchSubmit} className="ebaro-nav-search-wrap">
          <Search size={15} className="ebaro-nav-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search titles, authors, translators..."
            className="ebaro-nav-search-input"
            aria-label="Search titles, authors, translators"
          />
          <kbd className="ebaro-nav-search-kbd">⌘K</kbd>
        </form>

        {/* Right Utilities: Wishlist, Shopping Bag, Notifications, Avatar */}
        <div className="ebaro-nav-utilities">
          {/* Wishlist / Bookmarks Icon */}
          <button
            type="button"
            className="ebaro-nav-icon-btn"
            onClick={() => handleProfileAction('bookmarks')}
            aria-label={`Wishlist & Saved Books (${bookmarkCount} items)`}
            title="Wishlist & Real-Time Reading Analytics"
          >
            <Heart size={18} />
            {bookmarkCount > 0 && (
              <span className="ebaro-badge-cart" style={{ backgroundColor: '#EF4444' }}>
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Shopping Bag / Purchases Icon */}
          <button
            type="button"
            className="ebaro-nav-icon-btn"
            onClick={() =>
              user ? handleProfileAction('all') : handleNavClick('signin')
            }
            aria-label={`Cart & Owned Books (${ownedCount} items)`}
            title={user ? `My Library & Owned Books (${ownedCount})` : 'Sign in to access your library'}
          >
            <ShoppingBag size={18} />
            {ownedCount > 0 && (
              <span className="ebaro-badge-cart">
                {ownedCount}
              </span>
            )}
          </button>

          {/* Notifications Bell with Interactive Updates Popover */}
          <div ref={notificationsRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="ebaro-nav-icon-btn"
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setProfileMenuOpen(false);
                if (user?.role === 'admin') fetchAdminNotifications();
              }}
              aria-label={user?.role === 'admin' ? `Admin Sales & Alerts (${unreadSalesCount} unread)` : 'Notifications & New Curations'}
              title={user?.role === 'admin' ? `Admin Sales & Notifications (${unreadSalesCount} unread)` : 'Notifications & New Curations'}
            >
              <Bell size={18} />
              {user?.role === 'admin' ? (
                unreadSalesCount > 0 ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      padding: '1px 5px',
                      minWidth: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #FFFFFF'
                    }}
                  >
                    {unreadSalesCount > 9 ? '9+' : unreadSalesCount}
                  </span>
                ) : null
              ) : (
                unreadNotifs ? <span className="ebaro-badge-dot" /> : null
              )}
            </button>

            {notificationsOpen && (
              user?.role === 'admin' ? (
                /* Admin Real-Time Sales Notifications Dropdown */
                <div
                  className="ebaro-notif-dropdown"
                  role="region"
                  aria-label="Admin Sales & System Notifications"
                >
                  <div className="ebaro-notif-header">
                    <div className="ebaro-notif-header-title">
                      <ShieldCheck size={16} color="#059669" />
                      <span>Sales &amp; Admin Alerts</span>
                      {unreadSalesCount > 0 && (
                        <span className="ebaro-notif-badge-count">{unreadSalesCount}</span>
                      )}
                    </div>
                    {unreadSalesCount > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          await folioApi.markAdminNotificationsRead().catch(() => {});
                          setUnreadSalesCount(0);
                          setAdminNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
                        }}
                        style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: '#059669', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="ebaro-notif-list">
                    {adminNotifications.length === 0 ? (
                      <div className="ebaro-notif-empty">
                        <ShoppingBag size={26} style={{ opacity: 0.4 }} />
                        <span>No book sales or activity recorded yet.</span>
                      </div>
                    ) : (
                      adminNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`ebaro-notif-item ${notif.is_read === 0 ? 'unread' : ''}`}
                          onClick={async () => {
                            if (notif.is_read === 0) {
                              folioApi.markSingleAdminNotificationRead(notif.id).catch(() => {});
                              setAdminNotifications((prev) =>
                                prev.map((n) => (n.id === notif.id ? { ...n, is_read: 1 } : n))
                              );
                              setUnreadSalesCount((c) => Math.max(0, c - 1));
                            }
                            setNotificationsOpen(false);
                            handleNavClick('admin');
                          }}
                        >
                          <div className="ebaro-notif-icon-wrap">
                            <ShoppingBag size={17} />
                          </div>
                          <div className="ebaro-notif-content">
                            <div className="ebaro-notif-title-row">
                              <h4 className="ebaro-notif-title">{notif.title}</h4>
                              {notif.amount != null && (
                                <span className="ebaro-notif-price">
                                  {notif.currency || 'USD'} {Number(notif.amount).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <p className="ebaro-notif-message">{notif.message}</p>
                            <div className="ebaro-notif-meta">
                              {notif.payment_method && (
                                <span className="ebaro-notif-method-tag">
                                  {notif.payment_method.replace('_', ' ')}
                                </span>
                              )}
                              <span>{formatTimeAgo(notif.created_at)}</span>
                              {notif.is_read === 0 && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ padding: '0.65rem 1rem', background: '#F8F6EF', borderTop: '1px solid #E3E6DF', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        handleNavClick('admin');
                      }}
                      style={{ background: 'none', border: 'none', color: '#173D2D', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      View All Sales &amp; Financials →
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Reader Notifications Dropdown */
                <div
                  className="profile-dropdown-menu"
                  role="region"
                  aria-label="Recent platform notifications"
                  style={{ right: 0, top: '44px', width: '310px', padding: '0.4rem 0', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0F172A' }}>Notifications</strong>
                    {unreadNotifs && (
                      <button
                        type="button"
                        onClick={() => setUnreadNotifs(false)}
                        style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: '#173D2D', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '270px', overflowY: 'auto' }}>
                    <div
                      style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F8FAFC', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onClick={() => {
                        setNotificationsOpen(false);
                        handleNavClick('somali-books');
                      }}
                    >
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
                        Somali Cultural Archive Restored
                      </p>
                      <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        6 unabridged masterpieces with in-browser EPUB &amp; PDF viewer ready to read.
                      </p>
                    </div>
                    <div
                      style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F8FAFC', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onClick={() => {
                        setNotificationsOpen(false);
                        handleNavClick('collections');
                      }}
                    >
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
                        Folio Curated Editions Updated
                      </p>
                      <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        Verified literary editions and classical monographs curated for readers.
                      </p>
                    </div>
                    <div
                      style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onClick={() => {
                        setNotificationsOpen(false);
                        handleProfileAction('all');
                      }}
                    >
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
                        Cloud Reading Synced
                      </p>
                      <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        Your bookmarks, reading streak, and activity are synced in real time.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* User / Admin Profile Avatar with Dropdown */}
          {user ? (
            <div className="navbar-profile-dropdown-wrap" ref={profileMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="ebaro-user-avatar-btn"
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                title={user.role === 'admin' ? 'Understory Administrator' : user.fullName}
                style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                {user.role === 'admin' ? (
                  <UnderstoryLogo variant="app-icon" size={34} />
                ) : user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="ebaro-user-avatar-img"
                  />
                ) : (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #DCE6DC 0%, #CBD5CB 100%)',
                      color: '#173D2D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      border: '1.5px solid #CBD5CB',
                      boxShadow: '0 2px 6px rgba(23, 61, 45, 0.15)'
                    }}
                  >
                    {user.fullName ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </div>
                )}
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown-menu" role="menu" style={{ right: 0, top: '46px' }}>
                  <div className="profile-dropdown-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
                    {user.role === 'admin' ? (
                      <UnderstoryLogo variant="app-icon" size={36} />
                    ) : (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#DCE6DC',
                          color: '#173D2D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          border: '1px solid #CBD5CB'
                        }}
                      >
                        {user.fullName ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.role === 'admin' ? 'Understory Administrator' : user.fullName}
                        </strong>
                        {user.role === 'admin' && (
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#DCE6DC', color: '#173D2D', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #CBD5CB' }}>
                            ADMIN
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    className="profile-menu-item"
                    onClick={() => handleProfileAction('all')}
                  >
                    <Library size={15} />
                    <span>My Library</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="profile-menu-item"
                    onClick={() => handleProfileAction('bookmarks')}
                  >
                    <Heart size={15} />
                    <span>Saved Wishlist ({bookmarkCount})</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="profile-menu-item"
                    onClick={() => handleProfileAction('history')}
                  >
                    <History size={15} />
                    <span>Reading History</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="profile-menu-item"
                    onClick={() => handleProfileAction('settings')}
                  >
                    <Settings size={15} />
                    <span>Account Settings</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('author-submissions')}
                  >
                    <BookMarked size={15} />
                    <span>Author &amp; Publisher Portal</span>
                  </button>
                  {user.role === 'admin' && (
                    <button
                      type="button"
                      role="menuitem"
                      className="profile-menu-item"
                      onClick={() => handleNavClick('admin')}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <ShieldCheck size={15} />
                        <span>Admin Console &amp; Rights</span>
                      </div>
                      {adminPendingCount > 0 && (
                        <span
                          style={{
                            backgroundColor: '#173D2D',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px'
                          }}
                        >
                          {adminPendingCount} Pending
                        </span>
                      )}
                    </button>
                  )}
                  <div className="profile-menu-divider" />
                  <button
                    type="button"
                    role="menuitem"
                    className="profile-menu-item signout"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSignOut();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="ebaro-nav-item-btn active"
              onClick={() => handleNavClick('signin')}
              data-testid="navbar-signin-btn"
              style={{ padding: '0.45rem 1.15rem' }}
            >
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            style={{ marginLeft: '0.5rem' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>


      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" data-testid="mobile-nav-drawer">
          <div className="container mobile-nav-inner">
            {/* Mobile In-Drawer Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1rem', width: '100%' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B'
                  }}
                />
                <input
                  type="search"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search titles, authors, Somali literature…"
                  style={{
                    width: '100%',
                    padding: '0.72rem 1rem 0.72rem 2.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.92rem',
                    outline: 'none',
                    color: '#0F172A'
                  }}
                />
              </div>
            </form>

            <nav className="mobile-nav-links">
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Library (Home)
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'somali-books' ? 'active' : ''}`}
                onClick={() => handleNavClick('somali-books')}
              >
                Somali Books (Buugaagta Af-Soomaaliga)
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'explore' ? 'active' : ''}`}
                onClick={() => handleNavClick('explore')}
              >
                Explore All Books &amp; Filters
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'categories' ? 'active' : ''}`}
                onClick={() => handleNavClick('categories')}
              >
                Categories &amp; Genres
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'authors' ? 'active' : ''}`}
                onClick={() => handleNavClick('authors')}
              >
                Featured Authors &amp; Biographies
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'free-books' ? 'active' : ''}`}
                onClick={() => handleNavClick('free-books')}
              >
                Free Ebooks (Full-Text &amp; Downloads)
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'collections' ? 'active' : ''}`}
                onClick={() => handleNavClick('collections')}
              >
                Curated Collections
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                About Understory Library
              </button>
              <button
                type="button"
                className={`mobile-nav-link ${currentPage === 'author-submissions' ? 'active' : ''}`}
                onClick={() => handleNavClick('author-submissions')}
              >
                Author &amp; Publisher Submissions
              </button>
              {user?.role === 'admin' && (
                <button
                  type="button"
                  className={`mobile-nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavClick('admin')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span>Admin Quality &amp; Rights Console</span>
                  {adminPendingCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#173D2D',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {adminPendingCount} Pending
                    </span>
                  )}
                </button>
              )}
            </nav>

            <div className="mobile-nav-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => handleNavClick('free-books')}
              >
                <BookOpen size={16} />
                <span>Start Reading</span>
              </button>

              {!user ? (
                <div className="mobile-auth-row">
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => handleNavClick('signin')}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => handleNavClick('register')}
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => handleProfileAction('all')}
                >
                  <User size={15} />
                  <span>My Library ({user.fullName.split(' ')[0]})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

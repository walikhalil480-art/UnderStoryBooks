import React, { useState, useEffect } from 'react';
import { BOOKS, syncBookUpdate } from './data/books';
import { runImageDuplicationAudit } from './data/imageRegistry';
import {
  Book,
  CategorySlug,
  CollectionTag,
  IntendedBookAction,
  LibraryStatus,
  ReaderPreferences,
  UserLibraryPayload,
  UserProfile
} from './types';
import { Navbar, PageRoute } from './components/Navbar';
import { Footer } from './components/Footer';
import { RegistrationPromptModal } from './components/RegistrationPromptModal';
import { HomePage } from './pages/HomePage';
import { FreeBooksPage } from './pages/FreeBooksPage';
import { SomaliBooksPage } from './pages/SomaliBooksPage';
import { ExplorePage, PriceFilter, SortOption } from './pages/ExplorePage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { ReaderPage, ReaderMode } from './pages/ReaderPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage } from './pages/AboutPage';
import { RegisterPage } from './pages/RegisterPage';
import { SignInPage } from './pages/SignInPage';
import { MyLibraryPage, LibraryTab } from './pages/MyLibraryPage';
import { AuthorSubmissionPage } from './pages/AuthorSubmissionPage';
import { AdminPage } from './pages/AdminPage';
import { CheckoutModal } from './components/CheckoutModal';
import { folioApi } from './services/api';

const DEFAULT_PREFS: ReaderPreferences = {
  fontSize: 'medium',
  theme: 'ivory',
  lineWidth: 'standard'
};

const EMPTY_LIBRARY: UserLibraryPayload = {
  entries: [],
  progress: [],
  bookmarks: [],
  history: [],
  downloads: [],
  preferences: {
    readerFontSize: 20,
    readerTheme: 'ivory',
    readerLineWidth: 'medium'
  }
};

const getInitialPage = (): PageRoute => {
  try {
    const hash = window.location.hash.replace('#', '') as PageRoute;
    const validPages: PageRoute[] = [
      'home',
      'explore',
      'somali-books',
      'categories',
      'authors',
      'collections',
      'about',
      'register',
      'signin',
      'my-library',
      'author-submissions',
      'admin',
      'book-details',
      'reader',
      'free-books'
    ];
    if (hash && validPages.includes(hash)) return hash;

    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page') as PageRoute;
    if (pageParam && validPages.includes(pageParam)) return pageParam;
  } catch {}
  return 'explore';
};

export function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPage);
  const [selectedBookId, setSelectedBookId] = useState<string>('pride-and-prejudice');
  const [readerChapterIndex, setReaderChapterIndex] = useState<number>(0);
  const [readerMode, setReaderMode] = useState<ReaderMode>('web');
  const [aboutFocusSection, setAboutFocusSection] = useState<string | undefined>(undefined);
  const [downloadBannerMsg, setDownloadBannerMsg] = useState<string>('');

  // Authenticated User & Personal Library State (backed by SQLite API)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLibrary, setUserLibrary] = useState<UserLibraryPayload>(EMPTY_LIBRARY);
  const [myLibraryTab, setMyLibraryTab] = useState<LibraryTab>('all');
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>([]);
  const [checkoutBook, setCheckoutBook] = useState<Book | null>(null);

  // Reading & Download Gate Modal + Pending Intended Action Continuation State
  const [gateModalBook, setGateModalBook] = useState<Book | null>(null);
  const [pendingReadBook, setPendingReadBook] = useState<Book | null>(null);
  const [pendingAction, setPendingAction] = useState<IntendedBookAction | null>(null);
  const [pendingChapterIndex, setPendingChapterIndex] = useState<number>(0);

  // Dynamically discovered Open Library books
  const [dynamicBooks, setDynamicBooks] = useState<Book[]>([]);

  // Explore page filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedCollection, setSelectedCollection] = useState<CollectionTag | 'all'>('all');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // LocalStorage fallback bookmarks when signed out
  const [guestBookmarkedIds, setGuestBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('folio_bookmarks');
      return saved ? JSON.parse(saved) : ['pride-and-prejudice', 'meditations'];
    } catch {
      return ['pride-and-prejudice', 'meditations'];
    }
  });

  // Reader Preferences
  const [readerPrefs, setReaderPrefs] = useState<ReaderPreferences>(() => {
    try {
      const saved = localStorage.getItem('folio_reader_prefs');
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  // Run automated image duplication audit & restore backend session on mount
  useEffect(() => {
    const audit = runImageDuplicationAudit();
    if (!audit.passed) {
      console.warn('[Folio Image Duplication Audit Warning]:', audit.duplicateUrls);
    }

    folioApi
      .getSession()
      .then((res) => {
        if (res.user && res.library) {
          setUser(res.user);
          setUserLibrary(res.library);
        }
      })
      .catch(() => {});

    folioApi
      .getPublishedBooks()
      .then((res) => {
        if (res && Array.isArray(res.books) && res.books.length > 0) {
          for (const b of res.books) {
            syncBookUpdate(b);
          }
          handleRegisterDynamicBooks(res.books);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      folioApi
        .getMyPurchases()
        .then((res) => {
          setPurchasedBookIds(res.purchasedBookIds || res.purchases?.map((p: any) => p.book_id || p.bookId) || []);
        })
        .catch(() => {});
    } else {
      setPurchasedBookIds([]);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('folio_bookmarks', JSON.stringify(guestBookmarkedIds));
    } catch {
      // ignore
    }
  }, [guestBookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('folio_reader_prefs', JSON.stringify(readerPrefs));
    } catch {
      // ignore
    }
  }, [readerPrefs]);

  // Scroll to top when changing main page & sync URL hash / storage
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    try {
      window.location.hash = currentPage;
      localStorage.setItem('folio_current_page', currentPage);
    } catch {}
  }, [currentPage, selectedBookId]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validPages: PageRoute[] = [
        'home',
        'explore',
        'somali-books',
        'categories',
        'authors',
        'collections',
        'about',
        'register',
        'signin',
        'my-library',
        'author-submissions',
        'admin',
        'book-details',
        'reader',
        'free-books'
      ];
      if (hash && validPages.includes(hash) && hash !== currentPage) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  const findBookById = (bookId: string): Book => {
    return (
      BOOKS.find((b) => b.id === bookId) ||
      dynamicBooks.find((b) => b.id === bookId) ||
      BOOKS[0]
    );
  };

  const handleRegisterDynamicBooks = (newBooks: Book[]) => {
    setDynamicBooks((prev) => {
      const map = new Map<string, Book>();
      for (const b of prev) map.set(b.id, b);
      for (const b of newBooks) map.set(b.id, b);
      return Array.from(map.values());
    });
  };

  const bookmarkedIds: string[] = user
    ? Array.from(new Set(userLibrary.bookmarks.map((bm) => bm.bookId)))
    : guestBookmarkedIds;

  const handleToggleBookmark = async (bookId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const book = findBookById(bookId);
    if (user) {
      try {
        const updated = await folioApi.toggleOrAddBookmark({
          bookId,
          chapterIndex: 0,
          chapterTitle: book.sampleChapters[0]?.title || 'Saved Edition',
          toggleBookLevel: true
        });
        setUserLibrary(updated);
      } catch (err) {
        console.error(err);
      }
    } else {
      setGuestBookmarkedIds((prev) =>
        prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
      );
    }
  };

  const handleUpdateShelfStatus = async (bookId: string, status: LibraryStatus | 'remove') => {
    if (!user) {
      const targetBook = findBookById(bookId);
      setPendingReadBook(targetBook);
      setPendingAction({ type: 'save-library' });
      setGateModalBook(targetBook);
      return;
    }
    try {
      const updated = await folioApi.updateBookStatus(bookId, status);
      setUserLibrary(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentPage('book-details');
  };

  // Protected Reading Gate Logic
  const handleReadBook = (
    bookId: string,
    chapterIdx = 0,
    mode?: ReaderMode
  ) => {
    const targetBook = findBookById(bookId);
    setSelectedBookId(bookId);

    // Auto-resolve optimal mode if not explicitly specified
    let resolvedMode = mode;
    if (!resolvedMode) {
      const isPdf =
        targetBook.manuscriptFormat === 'PDF' ||
        Boolean(targetBook.manuscriptPath?.toLowerCase().endsWith('.pdf')) ||
        (targetBook.availableFormats.includes('PDF') && targetBook.provenance.fullTextReadingPermitted !== false);
      const isEpub =
        targetBook.manuscriptFormat === 'EPUB' ||
        Boolean(targetBook.manuscriptPath?.toLowerCase().endsWith('.epub')) ||
        targetBook.availableFormats.includes('EPUB');

      if (isPdf) resolvedMode = 'pdf';
      else if (isEpub) resolvedMode = 'epub';
      else resolvedMode = 'web';
    }

    // Metadata-only books do not have full text; show honest details page
    if (targetBook.accessType === 'metadata-only' || targetBook.accessStatus === 'metadata_only') {
      setCurrentPage('book-details');
      return;
    }

    // Check if book requires purchase before reading
    const isPaid = targetBook.accessStatus === 'paid_purchase' || (targetBook.price > 0 && !targetBook.isFree);
    const isPurchased = purchasedBookIds.includes(targetBook.id) || user?.role === 'admin';

    if (isPaid && !isPurchased) {
      if (!user) {
        setPendingReadBook(targetBook);
        setPendingChapterIndex(chapterIdx);
        setPendingAction({
          type: resolvedMode === 'pdf' ? 'read-pdf' : resolvedMode === 'text' ? 'read-text' : 'read-full',
          chapterIndex: chapterIdx
        });
        setGateModalBook(targetBook);
        return;
      }
      setCheckoutBook(targetBook);
      return;
    }

    // Full-text ebooks require user registration / authentication!
    if ((targetBook.accessType === 'full-text' || targetBook.requiresAuthForFullText) && !user) {
      setPendingReadBook(targetBook);
      setPendingChapterIndex(chapterIdx);
      setPendingAction({
        type: resolvedMode === 'pdf' ? 'read-pdf' : resolvedMode === 'text' ? 'read-text' : 'read-full',
        chapterIndex: chapterIdx
      });
      setGateModalBook(targetBook);
      return;
    }

    setReaderChapterIndex(chapterIdx);
    setReaderMode(resolvedMode);
    setCurrentPage('reader');
  };

  // Protected Download Gate & Verified Binary Download Logic
  const handleDownloadBook = async (
    bookId: string,
    format: 'pdf' | 'epub' | 'html' | 'txt'
  ) => {
    const targetBook = findBookById(bookId);
    setSelectedBookId(bookId);

    if (!targetBook.provenance.downloadPermitted) {
      setCurrentPage('book-details');
      return;
    }

    const isPaid = targetBook.accessStatus === 'paid_purchase' || (targetBook.price > 0 && !targetBook.isFree);
    const isPurchased = purchasedBookIds.includes(targetBook.id) || user?.role === 'admin';

    if (isPaid && !isPurchased) {
      if (!user) {
        setPendingReadBook(targetBook);
        setGateModalBook(targetBook);
        return;
      }
      setCheckoutBook(targetBook);
      return;
    }

    if (!user) {
      const actionType =
        format === 'pdf'
          ? 'download-pdf'
          : format === 'epub'
          ? 'download-epub'
          : format === 'html'
          ? 'download-html'
          : 'download-txt';
      setPendingReadBook(targetBook);
      setPendingAction({ type: actionType, format });
      setGateModalBook(targetBook);
      return;
    }

    try {
      setDownloadBannerMsg(`Preparing verified ${format.toUpperCase()} download for "${targetBook.title}"…`);
      const { fileSizeBytes, library } = await folioApi.downloadEbookFile(
        targetBook.id,
        format,
        targetBook.title
      );
      setUserLibrary(library);
      setDownloadBannerMsg(
        `Downloaded "${targetBook.title}" (${format.toUpperCase()}, ${(fileSizeBytes / 1024).toFixed(1)} KB). Recorded in your Download History.`
      );
      setTimeout(() => setDownloadBannerMsg(''), 5000);
    } catch (err: any) {
      setDownloadBannerMsg('');
      alert(err?.message || 'Unable to download file.');
    }
  };

  const handleAuthSuccess = async (authedUser: UserProfile, lib: UserLibraryPayload) => {
    setUser(authedUser);
    setUserLibrary(lib);
    setGateModalBook(null);

    // Automatically return the user to the book they originally selected and continue their intended action!
    if (pendingReadBook) {
      const targetBook = pendingReadBook;
      const action = pendingAction;
      const targetChap = pendingChapterIndex;

      setPendingReadBook(null);
      setPendingAction(null);
      setSelectedBookId(targetBook.id);

      if (action && action.type.startsWith('download-') && action.format) {
        setCurrentPage('book-details');
        try {
          const { fileSizeBytes, library: updatedLib } = await folioApi.downloadEbookFile(
            targetBook.id,
            action.format,
            targetBook.title
          );
          setUserLibrary(updatedLib);
          setDownloadBannerMsg(
            `Welcome, ${authedUser.fullName}! Your requested ${action.format.toUpperCase()} download of "${targetBook.title}" (${(
              fileSizeBytes / 1024
            ).toFixed(1)} KB) has started automatically.`
          );
          setTimeout(() => setDownloadBannerMsg(''), 6000);
        } catch {
          // ignore
        }
      } else if (action?.type === 'save-library') {
        setCurrentPage('book-details');
      } else {
        const targetMode: ReaderMode =
          action?.type === 'read-pdf'
            ? 'pdf'
            : action?.type === 'read-text'
            ? 'text'
            : 'web';
        setReaderChapterIndex(targetChap);
        setReaderMode(targetMode);
        setCurrentPage('reader');
      }
    } else {
      setMyLibraryTab('all');
      setCurrentPage('my-library');
    }
  };

  const handleSignOut = async () => {
    await folioApi.signOut();
    setUser(null);
    setUserLibrary(EMPTY_LIBRARY);
    if (currentPage === 'my-library' || currentPage === 'reader') {
      setCurrentPage('home');
    }
  };

  const handleSelectCategory = (categorySlug: CategorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedCollection('all');
    setSelectedAuthorId('all');
    setCurrentPage('explore');
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 'explore') {
      setCurrentPage('explore');
    }
  };

  const handleExplorePreset = (preset: {
    collection?: CollectionTag;
    priceFilter?: PriceFilter;
    sortBy?: SortOption;
  }) => {
    setSelectedCategory('all');
    setSelectedAuthorId('all');
    setSearchQuery('');
    setSelectedCollection(preset.collection || 'all');
    setPriceFilter(preset.priceFilter || 'all');
    setSortBy(preset.sortBy || 'featured');
    setCurrentPage('explore');
  };

  const handleFilterByAuthor = (authorId: string) => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setPriceFilter('all');
    setSearchQuery('');
    setSelectedAuthorId(authorId);
    setCurrentPage('explore');
  };

  const handleNavigate = (page: PageRoute, section?: string) => {
    if (page === 'explore' && section === 'free') {
      setCurrentPage('free-books');
      return;
    }
    if (page === 'about') {
      setAboutFocusSection(section);
    }
    setCurrentPage(page);
  };

  const handleOpenMyLibraryTab = (tab: LibraryTab) => {
    setMyLibraryTab(tab);
    setCurrentPage('my-library');
  };

  const handleContinueReadingFromNav = () => {
    if (user && userLibrary.progress.length > 0) {
      const mostRecent = userLibrary.progress[0];
      const mode: ReaderMode =
        mostRecent.preferredFormat === 'pdf' ? 'pdf' : 'web';
      handleReadBook(mostRecent.bookId, mostRecent.chapterIndex, mode);
    } else {
      handleReadBook(selectedBookId, 0, 'web');
    }
  };

  const currentBook = findBookById(selectedBookId);
  const currentBookShelfEntry = userLibrary.entries.find((e) => e.bookId === currentBook.id);

  return (
    <div className="app-wrapper">
      {currentPage !== 'reader' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(p) => handleNavigate(p)}
          searchQuery={searchQuery}
          onSearchSubmit={handleSearchSubmit}
          onSelectBook={handleSelectBook}
          onStartReading={handleContinueReadingFromNav}
          bookmarkCount={bookmarkedIds.length}
          ownedCount={user ? userLibrary.entries.length : 0}
          user={user}
          onOpenMyLibraryTab={handleOpenMyLibraryTab}
          onSignOut={handleSignOut}
        />
      )}

      {downloadBannerMsg && (
        <div className="global-download-toast" role="status" aria-live="polite">
          <div className="container global-download-toast-inner">
            <span>{downloadBannerMsg}</span>
            <button
              type="button"
              onClick={() => setDownloadBannerMsg('')}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="site-main">
        {currentPage === 'home' && (
          <HomePage
            onSelectBook={handleSelectBook}
            onReadBook={(id) => handleReadBook(id, 0, 'web')}
            onSelectCategory={handleSelectCategory}
            onNavigate={(p) => handleNavigate(p)}
            onSearchSubmit={handleSearchSubmit}
            onExplorePreset={handleExplorePreset}
            onSelectAuthor={() => {
              setCurrentPage('authors');
            }}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentPage === 'free-books' && (
          <FreeBooksPage
            onSelectBook={handleSelectBook}
            onReadBook={handleReadBook}
            onDownloadBook={handleDownloadBook}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentPage === 'somali-books' && (
          <SomaliBooksPage
            onSelectBook={handleSelectBook}
            onReadBook={handleReadBook}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectAuthor={(authorId) => {
              handleFilterByAuthor(authorId);
            }}
          />
        )}



        {currentPage === 'explore' && (
          <ExplorePage
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedCollection={selectedCollection}
            onCollectionChange={setSelectedCollection}
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            selectedAuthorId={selectedAuthorId}
            onClearAuthorFilter={() => setSelectedAuthorId('all')}
            onSelectBook={handleSelectBook}
            onReadBook={(id) => handleReadBook(id, 0, 'web')}
            onRegisterDynamicBooks={handleRegisterDynamicBooks}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            purchasedBookIds={purchasedBookIds}
          />
        )}

        {currentPage === 'categories' && (
          <CategoriesPage
            onSelectCategory={handleSelectCategory}
            onSelectBook={handleSelectBook}
          />
        )}

        {currentPage === 'authors' && (
          <AuthorsPage
            onSelectBook={handleSelectBook}
            onReadBook={(id) => handleReadBook(id, 0, 'web')}
            onFilterByAuthor={handleFilterByAuthor}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            onSelectBook={handleSelectBook}
            onReadBook={(id) => handleReadBook(id, 0, 'web')}
            onExploreCollection={(col) =>
              handleExplorePreset({
                collection: col
              })
            }
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            purchasedBookIds={purchasedBookIds}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            focusSection={aboutFocusSection}
            onNavigate={(p) => handleNavigate(p)}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            pendingBook={pendingReadBook}
            onAuthSuccess={handleAuthSuccess}
            onNavigateSignIn={() => setCurrentPage('signin')}
            onNavigateTerms={() => handleNavigate('about', 'terms')}
            onCancel={() => {
              if (pendingReadBook) {
                setSelectedBookId(pendingReadBook.id);
                setCurrentPage('book-details');
              } else {
                setCurrentPage('home');
              }
            }}
          />
        )}

        {currentPage === 'signin' && (
          <SignInPage
            pendingBook={pendingReadBook}
            onAuthSuccess={handleAuthSuccess}
            onNavigateRegister={() => setCurrentPage('register')}
            onCancel={() => {
              if (pendingReadBook) {
                setSelectedBookId(pendingReadBook.id);
                setCurrentPage('book-details');
              } else {
                setCurrentPage('home');
              }
            }}
          />
        )}

        {currentPage === 'my-library' && (
          <MyLibraryPage
            user={
              user || {
                id: 'guest-reader',
                email: 'reader@understory.org',
                fullName: 'Guest Reader',
                role: 'reader',
                createdAt: new Date().toISOString()
              }
            }
            library={
              user
                ? userLibrary
                : {
                    ...EMPTY_LIBRARY,
                    bookmarks: guestBookmarkedIds.map((id) => ({
                      id: `bm-${id}`,
                      bookId: id,
                      chapterIndex: 0,
                      chapterTitle: 'Saved Book',
                      note: '',
                      createdAt: new Date().toISOString()
                    }))
                  }
            }
            dynamicBooks={dynamicBooks}
            initialTab={myLibraryTab}
            onLibraryChange={setUserLibrary}
            onUserUpdate={setUser}
            onSelectBook={handleSelectBook}
            onReadBook={handleReadBook}
            onDownloadBook={handleDownloadBook}
            onExploreCatalogue={() => setCurrentPage('explore')}
          />
        )}

        {currentPage === 'author-submissions' && (
          <AuthorSubmissionPage
            user={user}
            onRequireAuth={() => setCurrentPage('signin')}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            user={user}
            onRequireAuth={() => setCurrentPage('signin')}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'book-details' && (
          <BookDetailsPage
            book={currentBook}
            user={user}
            currentShelfStatus={currentBookShelfEntry?.status}
            onUpdateShelfStatus={handleUpdateShelfStatus}
            onBack={() => setCurrentPage('explore')}
            onReadBook={handleReadBook}
            onDownloadBook={handleDownloadBook}
            onSelectBook={handleSelectBook}
            onSelectCategory={handleSelectCategory}
            onSelectAuthor={() => setCurrentPage('authors')}
            isBookmarked={bookmarkedIds.includes(currentBook.id)}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedIds={bookmarkedIds}
            purchasedBookIds={purchasedBookIds}
            onPurchaseSuccess={(bookId) => {
              setPurchasedBookIds((prev) => Array.from(new Set([...prev, bookId])));
            }}
          />
        )}

        {currentPage === 'reader' && (
          <ReaderPage
            book={currentBook}
            user={user}
            initialChapterIndex={readerChapterIndex}
            initialMode={readerMode}
            onExitReader={() => setCurrentPage('book-details')}
            onViewBookDetails={(id) => {
              setSelectedBookId(id);
              setCurrentPage('book-details');
            }}
            onRequireAuth={(protectedBook) => {
              setPendingReadBook(protectedBook);
              setPendingAction({ type: 'read-full', chapterIndex: readerChapterIndex });
              setGateModalBook(protectedBook);
              setCurrentPage('book-details');
            }}
            onLibraryChange={setUserLibrary}
            preferences={readerPrefs}
            onUpdatePreferences={setReaderPrefs}
            isBookmarked={bookmarkedIds.includes(currentBook.id)}
            onToggleBookmark={handleToggleBookmark}
            onPurchaseSuccess={(bookId) => {
              setPurchasedBookIds((prev) => Array.from(new Set([...prev, bookId])));
            }}
          />
        )}
      </main>

      {currentPage !== 'reader' && <Footer onNavigate={handleNavigate} />}

      {/* Global Top-Level Checkout Modal for Instant Purchasing */}
      {checkoutBook && (
        <CheckoutModal
          book={checkoutBook}
          user={user}
          isOpen={true}
          onClose={() => setCheckoutBook(null)}
          onSuccess={() => {
            const purchasedId = checkoutBook.id;
            setPurchasedBookIds((prev) => Array.from(new Set([...prev, purchasedId])));
            setCheckoutBook(null);
            handleReadBook(purchasedId, 0);
          }}
          onRequireAuth={() => {
            const b = checkoutBook;
            setCheckoutBook(null);
            if (b) {
              setPendingReadBook(b);
              setGateModalBook(b);
            }
          }}
        />
      )}

      {/* Protected Full-Text Reading & Download Gate Prompt Modal */}
      {gateModalBook && (
        <RegistrationPromptModal
          book={gateModalBook}
          intendedAction={pendingAction}
          onCreateAccount={() => {
            setPendingReadBook(gateModalBook);
            setGateModalBook(null);
            setCurrentPage('register');
          }}
          onSignIn={() => {
            setPendingReadBook(gateModalBook);
            setGateModalBook(null);
            setCurrentPage('signin');
          }}
          onContinueBrowsing={() => {
            setGateModalBook(null);
          }}
        />
      )}
    </div>
  );
}

export default App;

import type {
  Book,
  BookAccessType,
  BookProvenanceMetadata,
  ChapterSample,
  ChildrenStory,
  EbookAccessStatus,
  EbookFormat,
  ExternalSourceLink,
  KidsLearnedWordRecord,
  KidsLearningProgressPayload,
  KidsQuestionAnswerRecord,
  LibraryStatus,
  ReadingProgressRecord,
  StoryAlignmentFilePayload,
  StoryLanguageCode,
  UserLibraryPayload,
  UserProfile,
  PaymentCurrency,
  PaymentMethodOption,
  BookPurchaseRecord,
  OrderRecord,
  PurchaseEntitlementRecord,
  AdminFinancialsSummary,
  AdminNotification
} from '../types';

const TOKEN_STORAGE_KEY = 'folio_auth_token_v1';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
    credentials: 'same-origin'
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || `Request failed with status ${res.status}`) as Error & {
      status?: number;
      code?: string;
      payload?: any;
    };
    err.status = res.status;
    err.code = data.error;
    err.payload = data;
    throw err;
  }

  return data as T;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  library: UserLibraryPayload;
}

export interface ProtectedReaderPayload {
  bookId: string;
  title: string;
  author: string;
  accessType: BookAccessType;
  accessStatus: EbookAccessStatus;
  availableFormats: EbookFormat[];
  provenance: BookProvenanceMetadata;
  rightsNote: string;
  gutenbergId?: number;
  externalSources: ExternalSourceLink[];
  chapters: ChapterSample[];
  tableOfContents: string[];
  savedProgress: ReadingProgressRecord | null;
}

export const folioApi = {
  async getSession(): Promise<{ user: UserProfile | null; library: UserLibraryPayload | null }> {
    return apiRequest('/api/auth/me', { method: 'GET' });
  },

  async register(input: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreedToTerms: boolean;
  }): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input)
    });
    setStoredToken(data.token);
    return data;
  },

  async signIn(input: { email: string; password: string }): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(input)
    });
    setStoredToken(data.token);
    return data;
  },

  async signOut(): Promise<void> {
    await apiRequest('/api/auth/signout', { method: 'POST' }).catch(() => {});
    setStoredToken(null);
  },

  async forgotPassword(email: string): Promise<{ ok: boolean; resetToken: string; message: string }> {
    return apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(input: {
    email: string;
    resetToken: string;
    newPassword: string;
  }): Promise<{ ok: boolean; message: string }> {
    return apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async changePassword(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ ok: boolean; message: string }> {
    return apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async updateProfile(fullName: string): Promise<{ user: UserProfile }> {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName })
    });
  },

  async getReaderContent(bookId: string): Promise<ProtectedReaderPayload> {
    return apiRequest<ProtectedReaderPayload>(`/api/reader/${encodeURIComponent(bookId)}/content`, {
      method: 'GET'
    });
  },

  async fetchLiveGutenbergFullText(bookId: string): Promise<{
    bookId: string;
    chapters: ChapterSample[];
    tableOfContents: string[];
  }> {
    return apiRequest(`/api/reader/${encodeURIComponent(bookId)}/fulltext`, {
      method: 'GET'
    });
  },

  async getPdfDocumentBuffer(bookId: string): Promise<{ data: Uint8Array; headerPageCount: number }> {
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/reader/${encodeURIComponent(bookId)}/pdf`, {
      method: 'GET',
      headers,
      credentials: 'same-origin'
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const err = new Error(
        errBody.message || errBody.error || `Unable to load PDF document (status ${res.status})`
      ) as Error & { status?: number; code?: string };
      err.status = res.status;
      err.code = errBody.error;
      throw err;
    }

    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Verify valid PDF signature (%PDF-)
    if (
      bytes.length < 100 ||
      bytes[0] !== 0x25 || // %
      bytes[1] !== 0x50 || // P
      bytes[2] !== 0x44 || // D
      bytes[3] !== 0x46    // F
    ) {
      throw new Error('The returned file is not a valid PDF document.');
    }

    const headerPageCount = Number(res.headers.get('X-PDF-Page-Count') || 1);
    return { data: bytes, headerPageCount };
  },

  async downloadEbookFile(
    bookId: string,
    format: 'pdf' | 'epub' | 'html' | 'txt',
    bookTitle: string
  ): Promise<{ fileSizeBytes: number; library: UserLibraryPayload }> {
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/download/${encodeURIComponent(bookId)}/${encodeURIComponent(format)}`, {
      method: 'GET',
      headers,
      credentials: 'same-origin'
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const err = new Error(
        errBody.message || errBody.error || `Download failed with status ${res.status}`
      ) as Error & { status?: number; code?: string };
      err.status = res.status;
      err.code = errBody.error;
      throw err;
    }

    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (bytes.length < 100) {
      throw new Error('Downloaded file is empty or incomplete.');
    }

    if (format === 'pdf') {
      if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
        throw new Error('Downloaded PDF file did not pass PDF header verification.');
      }
    }

    const contentType = res.headers.get('Content-Type') || 'application/octet-stream';
    const blob = new Blob([bytes], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    const safeSlug = bookTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const ext = format === 'txt' ? 'txt' : format;
    const downloadFilename = `${safeSlug || bookId}-folio-edition.${ext}`;

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);

    const updatedLibrary = await folioApi.getLibrary();
    return { fileSizeBytes: bytes.length, library: updatedLibrary };
  },

  async getLibrary(): Promise<UserLibraryPayload> {
    return apiRequest<UserLibraryPayload>('/api/library', { method: 'GET' });
  },

  async updateBookStatus(bookId: string, status: LibraryStatus | 'remove'): Promise<UserLibraryPayload> {
    return apiRequest<UserLibraryPayload>('/api/library/status', {
      method: 'POST',
      body: JSON.stringify({ bookId, status })
    });
  },

  async saveReadingProgress(input: {
    bookId: string;
    chapterIndex: number;
    scrollPercentage: number;
    overallPercentage: number;
    lastReadPage?: number;
    totalPages?: number;
    preferredFormat?: 'web' | 'pdf' | 'epub' | 'text';
  }): Promise<UserLibraryPayload> {
    return apiRequest<UserLibraryPayload>('/api/library/progress', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async toggleOrAddBookmark(input: {
    bookId: string;
    chapterIndex?: number;
    chapterTitle?: string;
    note?: string;
    toggleBookLevel?: boolean;
  }): Promise<UserLibraryPayload> {
    return apiRequest<UserLibraryPayload>('/api/library/bookmarks', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async deleteBookmark(params: { id?: string; bookId?: string }): Promise<UserLibraryPayload> {
    const qs = new URLSearchParams();
    if (params.id) qs.set('id', params.id);
    if (params.bookId) qs.set('bookId', params.bookId);
    return apiRequest<UserLibraryPayload>(`/api/library/bookmarks?${qs.toString()}`, {
      method: 'DELETE'
    });
  },

  async updatePreferences(input: {
    readerFontSize: number;
    readerTheme: 'ivory' | 'white' | 'dark';
    readerLineWidth: 'narrow' | 'medium' | 'wide';
  }): Promise<UserLibraryPayload> {
    return apiRequest<UserLibraryPayload>('/api/library/preferences', {
      method: 'PUT',
      body: JSON.stringify(input)
    });
  },

  async searchOpenLibrary(query: string): Promise<{ books: Book[]; cached: boolean }> {
    return apiRequest<{ books: Book[]; cached: boolean }>(
      `/api/books/search-openlibrary?q=${encodeURIComponent(query)}`,
      { method: 'GET' }
    );
  },

  async getChildrenStories(): Promise<{ stories: ChildrenStory[] }> {
    return apiRequest<{ stories: ChildrenStory[] }>('/api/children-stories', {
      method: 'GET'
    });
  },

  async getChildrenStory(storyId: string): Promise<{ story: ChildrenStory }> {
    return apiRequest<{ story: ChildrenStory }>(
      `/api/children-stories/${encodeURIComponent(storyId)}`,
      { method: 'GET' }
    );
  },

  async getCalibrationFixture(
    storyId: string,
    lang: StoryLanguageCode = 'so'
  ): Promise<{
    isDiagnosticCalibrationFixture: boolean;
    note: string;
    alignment: StoryAlignmentFilePayload;
    story: ChildrenStory;
  }> {
    return apiRequest(
      `/api/children-stories/${encodeURIComponent(storyId)}/calibration-fixture?lang=${lang}`,
      { method: 'GET' }
    );
  },

  async uploadStoryAlignment(
    storyId: string,
    payload: {
      alignment: StoryAlignmentFilePayload;
      audioBase64?: string;
    }
  ): Promise<{ story: ChildrenStory; alignment: StoryAlignmentFilePayload }> {
    return apiRequest(
      `/api/children-stories/${encodeURIComponent(storyId)}/alignment`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  },

  async removeStoryAlignment(
    storyId: string,
    lang: StoryLanguageCode
  ): Promise<{ story: ChildrenStory }> {
    return apiRequest(
      `/api/children-stories/${encodeURIComponent(storyId)}/alignment/${lang}`,
      { method: 'DELETE' }
    );
  },

  async getKidsProgress(): Promise<{
    authenticated: boolean;
    progress: KidsLearningProgressPayload;
  }> {
    return apiRequest('/api/kids/progress', { method: 'GET' });
  },

  async saveKidsProgress(
    progress: KidsLearningProgressPayload
  ): Promise<{
    authenticated: boolean;
    progress: KidsLearningProgressPayload;
  }> {
    return apiRequest('/api/kids/progress', {
      method: 'POST',
      body: JSON.stringify({ progress })
    });
  },

  async submitStoryLesson(
    storyId: string,
    answers: Array<{
      questionId: string;
      userResponse: string | string[] | Record<string, string> | boolean;
    }>,
    currentProgress?: KidsLearningProgressPayload
  ): Promise<{
    attemptId: string;
    authenticated: boolean;
    storyId: string;
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    starsEarned: number;
    xpEarned: number;
    newlyLearnedWords: KidsLearnedWordRecord[];
    gradedAnswers: KidsQuestionAnswerRecord[];
    updatedProgress: KidsLearningProgressPayload;
  }> {
    return apiRequest(
      `/api/children-stories/${encodeURIComponent(storyId)}/lesson-submit`,
      {
        method: 'POST',
        body: JSON.stringify({ answers, currentProgress })
      }
    );
  },

  // --------------------------------------------------------------------------
  // Monetization & Multi-Provider Payment Gateway
  // --------------------------------------------------------------------------
  async getPaymentMethods(currency: PaymentCurrency = 'USD'): Promise<{ currency: PaymentCurrency; methods: PaymentMethodOption[] }> {
    return apiRequest(`/api/payments/methods?currency=${encodeURIComponent(currency)}`, { method: 'GET' });
  },

  async checkoutBook(
    bookId: string,
    paymentMethod: string,
    mobileNumber?: string,
    cardToken?: string,
    guestInfo?: { guestEmail?: string; guestName?: string }
  ): Promise<{
    success: boolean;
    orderId?: string;
    transactionRef?: string;
    providerCheckoutId?: string;
    status?: string;
    bookId: string;
    bookTitle?: string;
    amount?: number;
    currency?: string;
    paymentMethod?: string;
    instructionMessage?: string;
    requiresPolling?: boolean;
    pollIntervalMs?: number;
    message?: string;
    alreadyPurchased?: boolean;
    errorMessage?: string;
    sessionToken?: string;
    user?: UserProfile;
  }> {
    const res = await apiRequest<any>('/api/purchases/checkout', {
      method: 'POST',
      body: JSON.stringify({
        bookId,
        paymentMethod,
        mobileNumber,
        cardToken,
        guestEmail: guestInfo?.guestEmail,
        guestName: guestInfo?.guestName
      })
    });
    if (res?.sessionToken) {
      setStoredToken(res.sessionToken);
    }
    return res;
  },

  async verifyOrder(orderId: string): Promise<{
    success: boolean;
    orderId: string;
    status: string;
    transactionRef: string;
    providerTxId?: string;
    errorMessage?: string;
  }> {
    return apiRequest(`/api/purchases/verify/${encodeURIComponent(orderId)}`, { method: 'GET' });
  },

  async getMyPurchases(): Promise<{
    purchases: BookPurchaseRecord[];
    entitlements?: PurchaseEntitlementRecord[];
    purchasedBookIds: string[];
  }> {
    return apiRequest('/api/purchases/mine', { method: 'GET' });
  },

  async refundPurchase(orderId: string, reason?: string): Promise<{
    success: boolean;
    refundId?: string;
    orderId: string;
    amount: number;
    currency: string;
    message: string;
  }> {
    return apiRequest('/api/purchases/refund', {
      method: 'POST',
      body: JSON.stringify({ orderId, reason })
    });
  },

  async getAdminFinancials(): Promise<AdminFinancialsSummary> {
    return apiRequest('/api/admin/financials', { method: 'GET' });
  },

  async getAdminTransactions(params?: {
    search?: string;
    status?: string;
    provider?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: OrderRecord[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    if (params?.provider) qs.set('provider', params.provider);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return apiRequest(`/api/admin/transactions?${qs.toString()}`, { method: 'GET' });
  },

  async getAdminNotifications(): Promise<{
    notifications: AdminNotification[];
    unreadCount: number;
    recentSalesCount: number;
  }> {
    return apiRequest('/api/admin/notifications', { method: 'GET' });
  },

  async markAdminNotificationsRead(): Promise<{ success: boolean; message: string }> {
    return apiRequest('/api/admin/notifications/mark-read', { method: 'POST' });
  },

  async markSingleAdminNotificationRead(id: string): Promise<{ success: boolean }> {
    return apiRequest(`/api/admin/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  },

  // --------------------------------------------------------------------------
  // Author & Publisher Submissions & Manuscript Upload
  // --------------------------------------------------------------------------
  async uploadAuthorManuscript(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{
    success: boolean;
    manuscriptId: string;
    filename: string;
    format: 'PDF' | 'EPUB' | 'DOCX';
    size: number;
    path: string;
    message: string;
  }> {
    const token = getStoredToken();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/author/upload-manuscript');
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            onProgress(pct);
          }
        };
      }

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.error || data.message || `Upload failed with status ${xhr.status}`));
          }
        } catch {
          reject(new Error('Invalid response from server during manuscript upload.'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during manuscript file upload.'));
      xhr.send(
        JSON.stringify({
          filename: file.name,
          format: file.name.toLowerCase().endsWith('.epub') ? 'EPUB' : file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'PDF',
          size: file.size,
          dataBase64: base64
        })
      );
    });
  },

  async submitAuthorManuscript(payload: any): Promise<{
    success: boolean;
    submissionId: string;
    status: string;
    message: string;
  }> {
    return apiRequest('/api/author-submissions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getMyAuthorSubmissions(): Promise<{ submissions: any[] }> {
    return apiRequest('/api/author-submissions/mine', { method: 'GET' });
  },

  async getPublishedBooks(): Promise<{ books: Book[] }> {
    return apiRequest<{ books: Book[] }>('/api/books/published', { method: 'GET' });
  },

  async getAdminAuthorSubmissions(): Promise<{ submissions: any[] }> {
    return apiRequest('/api/admin/author-submissions', { method: 'GET' });
  },

  async reviewAuthorSubmission(
    submissionId: string,
    action: 'approved' | 'rejected',
    adminNotes?: string
  ): Promise<{ success: boolean; submissionId: string; status: string; book?: Book; message: string }> {
    return apiRequest(
      `/api/admin/author-submissions/${encodeURIComponent(submissionId)}/review`,
      {
        method: 'POST',
        body: JSON.stringify({ action, adminNotes })
      }
    );
  },

  // --------------------------------------------------------------------------
  // Copyright Complaints & Takedowns
  // --------------------------------------------------------------------------
  async submitCopyrightComplaint(payload: any): Promise<{
    success: boolean;
    complaintId: string;
    message: string;
  }> {
    return apiRequest('/api/rights/takedown', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAdminCopyrightComplaints(): Promise<{ complaints: any[] }> {
    return apiRequest('/api/admin/copyright-complaints', { method: 'GET' });
  },

  async resolveCopyrightComplaint(
    complaintId: string,
    action: 'resolve_takedown' | 'dismiss',
    resolutionNotes?: string
  ): Promise<{ success: boolean; complaintId: string; status: string; message: string }> {
    return apiRequest(
      `/api/admin/copyright-complaints/${encodeURIComponent(complaintId)}/resolve`,
      {
        method: 'POST',
        body: JSON.stringify({ action, resolutionNotes })
      }
    );
  },

  // --------------------------------------------------------------------------
  // Admin Catalogue Audit & Access Status Management
  // --------------------------------------------------------------------------
  async getAdminAudit(): Promise<{
    summary: {
      totalBooks: number;
      validBooks: number;
      issuesCount: number;
      timestamp: string;
    };
    items: any[];
  }> {
    return apiRequest('/api/admin/audit', { method: 'GET' });
  },

  async updateAdminBookStatus(
    bookId: string,
    accessStatus: EbookAccessStatus,
    notes?: string
  ): Promise<{ success: boolean; bookId: string; accessStatus: EbookAccessStatus; message: string }> {
    return apiRequest(`/api/admin/books/${encodeURIComponent(bookId)}/status`, {
      method: 'POST',
      body: JSON.stringify({ accessStatus, notes })
    });
  },

  async updateAdminBook(
    bookId: string,
    bookData: Partial<Book>
  ): Promise<{ success: boolean; book: Book; message: string }> {
    return apiRequest(`/api/admin/books/${encodeURIComponent(bookId)}/edit`, {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },

  async deleteAdminBook(
    bookId: string
  ): Promise<{ success: boolean; bookId: string; message: string }> {
    return apiRequest(`/api/admin/books/${encodeURIComponent(bookId)}`, {
      method: 'DELETE'
    });
  },

  async createAdminBook(
    bookData: Partial<Book>
  ): Promise<{ success: boolean; book: Book; message: string }> {
    return apiRequest('/api/admin/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  }
};


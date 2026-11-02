export type CategorySlug =
  // 10 Somali-First Strategic Categories
  | 'somali-fiction'
  | 'poetry-gabay'
  | 'history-culture'
  | 'biography-memoir'
  | 'islamic-studies'
  | 'children-books'
  | 'education-learning'
  | 'language-linguistics'
  | 'self-development-business'
  | 'english-arabic-relevant'
  // Preserved Slugs for Compatibility
  | 'somali-literature'
  | 'fiction'
  | 'business-finance'
  | 'technology-programming'
  | 'personal-development'
  | 'science'
  | 'history'
  | 'romance'
  | 'mystery-thriller'
  | 'education';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  nameSomali?: string;
  nameArabic?: string;
  shortDescription: string;
  editorialNote: string;
  imageUrl: string;
  imageAlt: string;
  photographerCredit: string;
  shelfLocation: string;
}

export interface BookChapter {
  number: string;
  title: string;
  epigraph?: string;
  content: string[];
}

export type ChapterSample = BookChapter;

export type CollectionTag =
  | 'editors-picks'
  | 'most-popular'
  | 'recently-added'
  | 'timeless-classics'
  | 'modern-fiction'
  | 'business-personal'
  | 'tech-programming'
  | 'biography-history'
  | 'free-ebooks'
  | 'open-access-academic'
  | 'featured'
  | 'popular'
  | 'new-arrivals'
  | 'recommended'
  | 'author-spotlight'
  | 'somali-books';

export interface BookReview {
  id: string;
  bookId: string;
  reviewerName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedReader?: boolean;
}

/**
 * Explicit 8-state Ebook Access and Rights System:
 * - 'free_full_text': Complete book is authorised for free in-browser reading.
 * - 'free_download': Complete PDF, EPUB, or Plain Text file is authorised for free download.
 * - 'paid_purchase': Individual digital purchase required; author royalties tracked.
 * - 'subscription': Accessible through an optional digital library membership pass.
 * - 'preview_only': Authorised preview or sample chapters only.
 * - 'external_reading': Authorised external archive reading or institutional portal.
 * - 'metadata_only': Bibliographic record and cover preserved; full file restricted.
 * - 'unavailable': Record incomplete or currently under copyright/file review.
 */
export type EbookAccessStatus =
  | 'free_full_text'
  | 'free_download'
  | 'paid_purchase'
  | 'subscription'
  | 'preview_only'
  | 'external_reading'
  | 'metadata_only'
  | 'unavailable'
  // Backwards compatibility aliases
  | 'full_text_available'
  | 'full_download_available';

export type BookAccessType = 'full-text' | 'preview-only' | 'external-only' | 'metadata-only';

export type EbookFormat = 'PDF' | 'EPUB' | 'HTML' | 'Plain Text';

export interface ExternalSourceLink {
  provider: string;
  label: string;
  url: string;
  type?: 'full-text' | 'borrow' | 'catalog-record' | 'preview' | 'download';
  format?: 'EPUB' | 'HTML' | 'PDF' | 'Plain Text' | 'Borrow / Preview';
}

export interface BookProvenanceMetadata {
  sourceProvider: string;
  sourceBookId: string;
  canonicalSourceUrl: string;
  originalFileUrl: string | null;
  availableFormats: EbookFormat[];
  licenceName: string;
  licenceUrl: string;
  copyrightStatus: string;
  rightsHolder?: string;
  licenceEvidence?: string;
  distributionPermissions?: string;
  attributionRequirements: string;
  localHostingPermitted: boolean;
  downloadPermitted: boolean;
  fullTextReadingPermitted: boolean;
  lastVerificationDate: string;
  lastSuccessfulAvailabilityCheck: string;
  isOpenAccessAcademic?: boolean;
  manuscriptPath?: string;
  manuscriptFormat?: string;
  manuscriptFilename?: string;
  manuscriptSize?: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorId: string;
  category: string;
  categorySlug: CategorySlug;
  genre: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  isbn: string;
  language: string; // 'so' | 'en' | 'ar'
  languageLabel?: string;
  formats: ('EPUB' | 'PDF' | 'Web Reader' | 'HTML' | 'Plain Text' | 'Kindle')[];
  availableFormats: EbookFormat[];
  accessStatus: EbookAccessStatus;
  accessType: BookAccessType;
  requiresAuthForFullText: boolean;
  isFree: boolean;
  price: number; // 0 if free
  currency?: string; // 'USD' | 'SLSH' | 'SOS'
  priceDisplay: string;
  rightsHolder?: string;
  licenceEvidence?: string;
  distributionPermissions?: string;
  coverUrl: string;
  coverAlt: string;
  openLibraryWorkId?: string;
  gutenbergId?: number;
  standardEbooksPath?: string;
  provenance: BookProvenanceMetadata;
  externalSources: ExternalSourceLink[];
  rating?: {
    score: number;
    count: number;
    source: string;
  };
  shortSynopsis: string;
  description: string[];
  tableOfContents: string[];
  sampleChapters: BookChapter[];
  rightsNote: string;
  collections: CollectionTag[];
  isRecentlyAdded?: boolean;
  manuscriptPath?: string;
  manuscriptFormat?: string;
}

export interface Author {
  id: string;
  name: string;
  lifespan: string;
  nationality: string;
  primaryGenres: string[];
  portraitUrl: string;
  portraitAlt: string;
  portraitCredit: string;
  shortBio: string;
  fullBiography: string[];
  notableQuote: string;
  quoteSource: string;
}

export interface ReadingInspirationItem {
  id: string;
  title: string;
  environmentLabel: string;
  caption: string;
  imageUrl: string;
  imageAlt: string;
  photographer: string;
  aspect: 'wide' | 'tall' | 'standard';
  recommendedCategorySlug: CategorySlug;
  recommendedCategoryName: string;
}

export interface LibraryWing {
  id: string;
  wingCode: string;
  title: string;
  subtitle: string;
  description: string;
  architectureNote: string;
  mainImageUrl: string;
  mainImageAlt: string;
  detailImageUrl: string;
  detailImageAlt: string;
  featuredBookIds: string[];
  categorySlug: CategorySlug;
}

export interface CuratedCollection {
  id: string;
  slug: CollectionTag;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  heroImageUrl: string;
  heroImageAlt: string;
  accentNote: string;
  bookIds: string[];
}

export interface ReaderPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  theme: 'ivory' | 'white' | 'night';
  lineWidth: 'narrow' | 'standard' | 'wide';
}

// ============================================================================
// AUTHENTICATION, INTENDED ACTION CONTINUATION & PERSONAL LIBRARY ENTITIES
// ============================================================================

export interface IntendedBookAction {
  type:
    | 'read-full'
    | 'read-pdf'
    | 'read-epub'
    | 'read-text'
    | 'download-pdf'
    | 'download-epub'
    | 'download-html'
    | 'download-txt'
    | 'save-library';
  chapterIndex?: number;
  format?: 'pdf' | 'epub' | 'html' | 'txt';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role?: 'reader' | 'author' | 'publisher' | 'admin';
  avatarUrl?: string;
  createdAt: string;
}

export type LibraryStatus = 'currently-reading' | 'want-to-read' | 'finished';

export interface UserLibraryEntry {
  id: string;
  bookId: string;
  status: LibraryStatus;
  addedAt: string;
  updatedAt: string;
}

export interface ReadingProgressRecord {
  bookId: string;
  chapterIndex: number;
  scrollPercentage: number;
  overallPercentage: number;
  lastReadPage?: number;
  totalPages?: number;
  preferredFormat?: 'web' | 'pdf' | 'epub' | 'text';
  lastOpenedAt: string;
}

export interface BookmarkRecord {
  id: string;
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  note: string;
  createdAt: string;
}

export interface ReadingHistoryRecord {
  id: string;
  bookId: string;
  chapterIndex: number;
  openedAt: string;
}

export interface DownloadHistoryRecord {
  id: string;
  bookId: string;
  format: EbookFormat;
  fileSizeBytes: number;
  downloadedAt: string;
}

export interface UserLibraryPayload {
  entries: UserLibraryEntry[];
  progress: ReadingProgressRecord[];
  bookmarks: BookmarkRecord[];
  history: ReadingHistoryRecord[];
  downloads: DownloadHistoryRecord[];
  preferences: {
    readerFontSize: number;
    readerTheme: 'ivory' | 'white' | 'dark';
    readerLineWidth: 'narrow' | 'medium' | 'wide';
  };
}

// ============================================================================
// AUTHOR/PUBLISHER SUBMISSION, COPYRIGHT COMPLAINTS & MONETISATION ENTITIES
// ============================================================================

export interface AuthorSubmissionPayload {
  title: string;
  subtitle?: string;
  author: string;
  authorBio?: string;
  authorEmail: string;
  authorPhone?: string;
  language: 'so' | 'en' | 'ar';
  categorySlug: CategorySlug;
  genre: string;
  description: string;
  publishedYear: number;
  publisher?: string;
  isbn?: string;
  coverUrl?: string;
  fileUrl?: string;
  sampleText?: string;
  format: 'PDF' | 'EPUB' | 'Both';
  accessPreference: 'free' | 'paid';
  price?: number;
  currency?: string;
  payoutMethod?: string;
  payoutAccount?: string;
  rightsDeclaration: string;
  agreedToTerms: boolean;
}

export interface AuthorSubmissionRecord extends AuthorSubmissionPayload {
  id: string;
  userId?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface CopyrightComplaintPayload {
  bookId: string;
  bookTitle: string;
  claimantName: string;
  claimantEmail: string;
  claimantRelationship: string;
  infringementDetails: string;
  originalWorkUrl?: string;
  goodFaithDeclaration: boolean;
}

export interface CopyrightComplaintRecord extends CopyrightComplaintPayload {
  id: string;
  status: 'open' | 'investigating' | 'resolved_taken_down' | 'dismissed';
  adminResolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type PaymentCurrency = 'USD' | 'KES' | 'SOS';

export type PaymentMethodId = 'mpesa_stk' | 'evc_plus' | 'zaad' | 'sahal' | 'card';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  provider: 'mpesa' | 'sifalo' | 'card';
  currencies: PaymentCurrency[];
  icon: string;
  country: string;
  description: string;
  isPopular?: boolean;
}

export interface BookPurchaseRecord {
  id: string;
  userId?: string;
  user_id?: string;
  bookId?: string;
  book_id?: string;
  bookTitle?: string;
  title?: string;
  author?: string;
  cover_url?: string;
  amount: number;
  currency: string;
  provider: string;
  transactionRef?: string;
  transaction_ref?: string;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  createdAt?: string;
  created_at?: string;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  book_id: string;
  amount: number;
  currency: PaymentCurrency;
  provider: string;
  payment_method: PaymentMethodId;
  customer_phone?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transaction_ref: string;
  provider_checkout_id?: string;
  error_message?: string;
  metadata_json?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
  book_title?: string;
  book_author?: string;
}

export interface PurchaseEntitlementRecord {
  id: string;
  user_id: string;
  book_id: string;
  order_id: string;
  status: 'active' | 'revoked';
  granted_at: string;
  revoked_at?: string;
  revoke_reason?: string;
  title?: string;
  author?: string;
  cover_url?: string;
  price?: number;
  currency?: string;
}

export interface AdminFinancialsSummary {
  totalRevenueUsd: number;
  revenueByCurrency: Record<string, number>;
  completedOrdersCount: number;
  refundedOrdersCount: number;
  activeEntitlementsCount: number;
  totalRefundsCount: number;
  salesByProvider: Record<string, { count: number; totalUsd: number }>;
  topSellingBooks: Array<{ bookId: string; title: string; count: number; totalUsd: number }>;
}

export interface CatalogueAuditItem {
  bookId: string;
  bookTitle: string;
  accessStatus: EbookAccessStatus;
  pdfVerified: boolean;
  epubVerified: boolean;
  canonicalUrlReachable: boolean;
  rightsDocumented: boolean;
  notes: string[];
}

export interface CatalogueAuditSummary {
  totalBooks: number;
  somaliBooksCount: number;
  freeFullTextCount: number;
  freeDownloadCount: number;
  paidPurchaseCount: number;
  metadataOnlyCount: number;
  pendingSubmissionsCount: number;
  openCopyrightComplaintsCount: number;
  verifiedFilesCount: number;
  auditedAt: string;
}

// ============================================================================
// SOMALI KIDS — ILLUSTRATED STORIES, AUDIO & DUOLINGO-STYLE LEARNING ENTITIES
// ============================================================================

export type StoryLanguageCode = 'so' | 'en';

export type StoryPlaybackSpeed = 0.75 | 1 | 1.25;

export type ChildrenStoryLevelId = 'level-1' | 'level-2' | 'level-3';

export type ChildrenStoryCategorySlug =
  | 'xayawaanka'
  | 'qoyska'
  | 'dugsiga'
  | 'saaxiibtinimada'
  | 'dhaqanka'
  | 'dabeecadda'
  | 'habeenkii'
  | 'tacabur';

export type StoryDifficultyLevel =
  | 'Level 1 — Bilowga (Ages 3–5)'
  | 'Level 2 — Akhriste Yar (Ages 6–8)'
  | 'Level 3 — Akhriste Horumarsan (Ages 9–12)'
  | 'Heerka 1aad — Bilow (Level 1 • Early Reader)'
  | 'Heerka 2aad — Dhexe (Level 2 • Developing Reader)'
  | 'Heerka 3aad — Sare (Level 3 • Fluent Reader)';

export type StoryPublicationStatus =
  | 'published_text_pending_audio'
  | 'published_with_verified_audio'
  | 'draft';

export type StoryNarrationStatus =
  | 'verified_ready'
  | 'unavailable_pending_recording'
  | 'alignment_pending_review'
  | 'error';

export interface StoryWordToken {
  id: string;
  sentenceId: string;
  sentenceIndex: number;
  wordIndex: number;
  tokenIndexInSentence: number;
  text: string;
  normalizedWord: string;
  englishGloss?: string;
  pronunciationGuide?: string;
  /**
   * Word start/end timestamps in seconds.
   * Must be populated ONLY from forced alignment + human verification against an actual audio recording.
   * Remains null when no verified recording is installed.
   */
  startTime: number | null;
  endTime: number | null;
}

export interface StorySentence {
  id: string;
  index: number;
  somaliText: string;
  englishTranslation: string;
  sceneCaption?: string;
  /**
   * Sentence start/end timestamps in seconds derived from the verified word-level alignment.
   * Remains null when no verified recording is installed.
   */
  startTime: number | null;
  endTime: number | null;
  words: StoryWordToken[];
}

export interface StorySceneIllustration {
  id: string;
  sceneNumber: number;
  afterSentenceIndex: number;
  illustrationUrl: string;
  altText: string;
  somaliCaption: string;
  englishCaption: string;
}

export interface StoryVocabularyItem {
  id: string;
  somaliWord: string;
  englishMeaning: string;
  pronunciationGuide: string;
  partOfSpeech: 'Magac (Noun)' | 'Fal (Verb)' | 'Sifo (Adjective)' | 'Weedho (Phrase)';
  exampleSomali: string;
  exampleEnglish: string;
  pictureUrl: string;
  pictureKey: string;
}

export type StoryQuestionType =
  | 'multiple_choice'
  | 'fill_in_blank'
  | 'word_matching'
  | 'story_ordering'
  | 'vocabulary_picture'
  | 'true_false'
  | 'listen_and_choose'
  | 'complete_sentence';

export interface StoryMatchingPair {
  id: string;
  somali: string;
  english: string;
}

export interface StoryOrderEventItem {
  id: string;
  somaliEvent: string;
  englishHint: string;
  correctPosition: number; // 0-indexed (0, 1, 2, ...)
}

export interface StoryLessonQuestion {
  id: string;
  type: StoryQuestionType;
  promptSomali: string;
  promptEnglish: string;
  /**
   * For fill_in_blank and complete_sentence: sentence with '_____' placeholder
   */
  sentenceTemplate?: string;
  /**
   * Options for multiple_choice, vocabulary_picture, listen_and_choose, fill_in_blank word bank, or complete_sentence
   */
  options?: string[];
  /**
   * Correct option or primary answer string
   */
  correctAnswer?: string;
  /**
   * Accepted normalized spelling variations for typed fill_in_blank / complete_sentence
   */
  acceptedAnswers?: string[];
  allowTyping?: boolean;
  /**
   * For true_false questions
   */
  correctBoolean?: boolean;
  /**
   * For word_matching questions
   */
  matchingPairs?: StoryMatchingPair[];
  /**
   * For story_ordering questions
   */
  orderEvents?: StoryOrderEventItem[];
  /**
   * For vocabulary_picture questions
   */
  pictureUrl?: string;
  pictureAlt?: string;
  /**
   * For listen_and_choose questions (enabled only when real/verified audio is available)
   */
  requiresAudio?: boolean;
  audioSpokenTextSomali?: string;
  audioSentenceIndex?: number;
  explanationSomali: string;
  explanationEnglish: string;
  targetVocabularyWord?: string;
}

export interface StoryNarrationTrack {
  language: StoryLanguageCode;
  languageLabel: string;
  status: StoryNarrationStatus;
  audioUrl: string | null;
  expectedAssetPath: string;
  expectedAlignmentPath: string;
  mimeType: string;
  durationSeconds: number | null;
  narratorName: string | null;
  speechProvider: string | null;
  pronunciationEvaluated: boolean;
  alignmentMethod: string;
  humanVerified: boolean;
  lastVerifiedDate: string | null;
  licenceName: string;
  licenceUrl: string;
  permissionStatus: string;
  unavailableReason: string;
  setupInstructions: string[];
}

export interface StoryAlignmentWordEntry {
  wordId?: string;
  sentenceIndex: number;
  tokenIndexInSentence: number;
  text: string;
  startTime: number;
  endTime: number;
}

export interface StoryAlignmentFilePayload {
  storyId: string;
  language: StoryLanguageCode;
  audioFilename: string;
  mimeType: string;
  durationSeconds: number;
  narratorName: string;
  speechProvider: string;
  pronunciationEvaluated: boolean;
  alignmentMethod: string;
  humanVerified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  licenceName: string;
  licenceUrl?: string;
  permissionStatus: string;
  words: StoryAlignmentWordEntry[];
}

export interface ChildrenStory {
  id: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  description: string;
  somaliSummary: string;
  levelId: ChildrenStoryLevelId;
  levelLabelSomali: string;
  levelLabelEnglish: string;
  categorySlug: ChildrenStoryCategorySlug;
  categoryNameSomali: string;
  categoryNameEnglish: string;
  estimatedReadingMinutes: number;
  learningPathOrder: number;
  xpReward: number;
  moralSomali: string;
  moralEnglish: string;
  coverIllustrationUrl: string;
  coverIllustrationAlt: string;
  illustrationCredit: string;
  sceneIllustrations: StorySceneIllustration[];
  vocabulary: StoryVocabularyItem[];
  lessonQuestions: StoryLessonQuestion[];
  ageRange: string;
  difficulty: StoryDifficultyLevel;
  somaliTranscript: string;
  englishTranslation: string;
  defaultNarrationLanguage: StoryLanguageCode;
  supportedNarrationLanguages: StoryLanguageCode[];
  narrationTracks: Record<StoryLanguageCode, StoryNarrationTrack>;
  sentences: StorySentence[];
  source: string;
  author: string;
  rightsHolder: string;
  licence: string;
  publicationStatus: StoryPublicationStatus;
  privacySafetyNotice: {
    noThirdPartyTracking: boolean;
    noPublicProfilesOrChat: boolean;
    noChildPiiCollected: boolean;
    parentManagedControls: boolean;
    complianceNote: string;
  };
}

// ============================================================================
// KIDS LEARNING PROGRESS, LESSON ATTEMPTS, REWARDS & VOCABULARY BANK
// ============================================================================

export interface KidsQuestionAnswerRecord {
  questionId: string;
  questionType: StoryQuestionType;
  userResponse: string | string[] | Record<string, string> | boolean;
  isCorrect: boolean;
  targetVocabularyWord?: string;
}

export interface KidsStoryCompletionRecord {
  storyId: string;
  completedAt: string;
  bestScorePercent: number;
  lastScorePercent: number;
  starsEarned: number; // 1, 2, or 3
  xpEarned: number;
  attemptsCount: number;
  correctCount: number;
  totalQuestions: number;
}

export interface KidsLearnedWordRecord {
  somaliWord: string;
  englishMeaning: string;
  pronunciationGuide: string;
  storyId: string;
  pictureUrl: string;
  masteryCount: number;
  missedCount: number;
  lastPractisedAt: string;
}

export interface KidsMissedQuestionRecord {
  storyId: string;
  questionId: string;
  missedAt: string;
}

export interface KidsBadgeRecord {
  id: string;
  titleSomali: string;
  titleEnglish: string;
  description: string;
  unlockedAt: string;
}

export interface KidsLearningProgressPayload {
  totalXp: number;
  todayXp: number;
  dailyGoalXp: number;
  unlockAllStoriesParentOverride: boolean;
  completedStories: Record<string, KidsStoryCompletionRecord>;
  inProgressStoryIds: string[];
  learnedWords: Record<string, KidsLearnedWordRecord>;
  missedQuestions: KidsMissedQuestionRecord[];
  badges: KidsBadgeRecord[];
  lastUpdatedAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'sale' | 'submission' | 'copyright';
  title: string;
  message: string;
  amount?: number;
  currency?: string;
  order_id?: string;
  book_id?: string;
  book_title?: string;
  customer_name?: string;
  customer_email?: string;
  payment_method?: string;
  is_read: number;
  created_at: string;
}




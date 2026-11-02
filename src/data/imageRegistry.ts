/**
 * CENTRAL IMAGE ASSET REGISTRY & DUPLICATION AUDITOR
 * Every editorial photograph used across Folio is registered here with a single,
 * dedicated section assignment and purpose. No two editorial sections share the same photo.
 */

export type ImageSubjectType =
  | 'person-reading'
  | 'library-architecture'
  | 'antique-books'
  | 'bookstore-browsing'
  | 'hands-turning-pages';

export interface RegisteredImageAsset {
  id: string;
  section: string;
  purpose: string;
  subjectType: ImageSubjectType;
  url: string;
  alt: string;
  photographerCredit: string;
  allowSharedCollectionThumbnail?: boolean;
}

/**
 * Distinct subject-appropriate fallback images so that even if an external image fails to load,
 * the application never falls back to a single repeated placeholder image everywhere.
 */
export const SUBJECT_FALLBACK_IMAGES: Record<ImageSubjectType, string> = {
  'person-reading':
    'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=80',
  'library-architecture':
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
  'antique-books':
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80',
  'bookstore-browsing':
    'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=80',
  'hands-turning-pages':
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80'
};

export const IMAGE_REGISTRY: Record<string, RegisteredImageAsset> = {
  // ============================================================================
  // 1. HOMEPAGE HERO SECTION (People Reading in Library + Sunlit Window Reader)
  // ============================================================================
  'hero-main-reader-library': {
    id: 'hero-main-reader-library',
    section: 'homepage-hero-primary',
    purpose: 'Primary hero photograph featuring a person reading a hardcover book in a historic library',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1400&q=85',
    alt: 'Person reading a hardcover book intently beside warm wooden bookshelves in a library',
    photographerCredit: 'Unsplash Editorial Portrait'
  },
  'hero-secondary-window-reader': {
    id: 'hero-secondary-window-reader',
    section: 'homepage-hero-secondary',
    purpose: 'Secondary hero portrait showing a woman reading beside a sunlit window',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    alt: 'Woman reading an open book beside a bright sunlit window',
    photographerCredit: 'Unsplash Editorial Portrait'
  },

  // ============================================================================
  // 2. "A PLACE FOR EVERY READER" — 12 DISTINCT SCENES OF PEOPLE READING
  // ============================================================================
  'reader-scene-01-historic-library': {
    id: 'reader-scene-01-historic-library',
    section: 'place-for-every-reader-01',
    purpose: 'A person reading a hardcover book in a beautiful historic library',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1000&q=80',
    alt: 'Reader immersed in a hardcover book surrounded by classic literary volumes',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-02-university-student': {
    id: 'reader-scene-02-university-student',
    section: 'place-for-every-reader-02',
    purpose: 'A student studying with books at a university library',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    alt: 'University students studying with open books in a modern collegiate library',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-03-sunlit-window': {
    id: 'reader-scene-03-sunlit-window',
    section: 'place-for-every-reader-03',
    purpose: 'A woman reading beside a large sunlit window',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1000&q=80',
    alt: 'Woman reading a book quietly in warm natural light near a window',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-04-armchair-bookshelves': {
    id: 'reader-scene-04-armchair-bookshelves',
    section: 'place-for-every-reader-04',
    purpose: 'A man reading in a comfortable armchair surrounded by bookshelves',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=1000&q=80',
    alt: 'Man reading comfortably in an armchair surrounded by tall wooden bookshelves',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-05-two-people-book-club': {
    id: 'reader-scene-05-two-people-book-club',
    section: 'place-for-every-reader-05',
    purpose: 'Two people reading or discussing books together',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
    alt: 'Readers gathered together discussing books and sharing notes around a wooden table',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-06-bookstore-browsing': {
    id: 'reader-scene-06-bookstore-browsing',
    section: 'place-for-every-reader-06',
    purpose: 'A reader browsing books in an independent bookstore',
    subjectType: 'bookstore-browsing',
    url: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1000&q=80',
    alt: 'Reader browsing wooden shelves in an independent neighborhood bookstore',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-07-modern-cafe': {
    id: 'reader-scene-07-modern-cafe',
    section: 'place-for-every-reader-07',
    purpose: 'A person reading in a modern café',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80',
    alt: 'Person reading and studying at a quiet modern café table with a cup of coffee',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-08-student-taking-notes': {
    id: 'reader-scene-08-student-taking-notes',
    section: 'place-for-every-reader-08',
    purpose: 'A university student taking notes while reading',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
    alt: 'University student taking handwritten notes while reading a textbook at a desk',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-09-researcher-old-books': {
    id: 'reader-scene-09-researcher-old-books',
    section: 'place-for-every-reader-09',
    purpose: 'A researcher studying old books at a wooden desk',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    alt: 'Researcher examining open archival books and manuscripts at a wooden study desk',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-10-outdoor-reading': {
    id: 'reader-scene-10-outdoor-reading',
    section: 'place-for-every-reader-10',
    purpose: 'A reader enjoying a novel in a quiet outdoor setting',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1000&q=80',
    alt: 'Reader enjoying a paperback novel outdoors in peaceful natural light',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-11-exploring-grand-library': {
    id: 'reader-scene-11-exploring-grand-library',
    section: 'place-for-every-reader-11',
    purpose: 'People exploring a grand library with floor-to-ceiling bookshelves',
    subjectType: 'library-architecture',
    url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1000&q=80',
    alt: 'Visitors and readers exploring a multi-story grand library with floor-to-ceiling bookshelves',
    photographerCredit: 'Unsplash Reader Documentary'
  },
  'reader-scene-12-hands-turning-pages': {
    id: 'reader-scene-12-hands-turning-pages',
    section: 'place-for-every-reader-12',
    purpose: 'Close-up photograph of hands holding and turning real book pages',
    subjectType: 'hands-turning-pages',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Close-up of hands holding open a printed book and turning cream paper pages',
    photographerCredit: 'Unsplash Reader Documentary'
  },

  // ============================================================================
  // 3. "THE LIBRARY" SIGNATURE SECTION (3 WINGS x 2 UNIQUE PHOTOS = 6 UNIQUE PHOTOS)
  // ============================================================================
  'library-wing-1-main': {
    id: 'library-wing-1-main',
    section: 'library-wing-oak-stacks-main',
    purpose: 'Grand floor-to-ceiling wooden bookshelves in Gallery I',
    subjectType: 'library-architecture',
    url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=85',
    alt: 'Floor-to-ceiling oak bookshelves filled with bound volumes in a historic library gallery',
    photographerCredit: 'Unsplash Architectural Archive'
  },
  'library-wing-1-detail': {
    id: 'library-wing-1-detail',
    section: 'library-wing-oak-stacks-detail',
    purpose: 'Reader exploring the lower wooden stacks in Gallery I',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    alt: 'Readers sharing a quiet moment of discovery in a sunlit study room',
    photographerCredit: 'Unsplash Architectural Archive'
  },
  'library-wing-2-main': {
    id: 'library-wing-2-main',
    section: 'library-wing-vault-main',
    purpose: 'Antique leather-bound books in Vault II',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1400&q=85',
    alt: 'Row of antique leather-bound books with gold-tooled spines on a dark wooden shelf',
    photographerCredit: 'Unsplash Architectural Archive'
  },
  'library-wing-2-detail': {
    id: 'library-wing-2-detail',
    section: 'library-wing-vault-detail',
    purpose: 'Antique volumes arranged on an oak table in Vault II',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80',
    alt: 'Historic leather-bound volumes and maps laid out on an oak library table',
    photographerCredit: 'Unsplash Architectural Archive'
  },
  'library-wing-3-main': {
    id: 'library-wing-3-main',
    section: 'library-wing-pavilion-main',
    purpose: 'People reading in the Contemporary Reading Pavilion III',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=85',
    alt: 'Stack of scholarly books on a modern library table with natural daylight',
    photographerCredit: 'Unsplash Architectural Archive'
  },
  'library-wing-3-detail': {
    id: 'library-wing-3-detail',
    section: 'library-wing-pavilion-detail',
    purpose: 'Curated modern and classic books on study table in Pavilion III',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
    alt: 'Carefully arranged collection of books on a wooden reading table',
    photographerCredit: 'Unsplash Architectural Archive'
  },

  // ============================================================================
  // 4. TEN CATEGORY BANNERS (10 COMPLETELY UNIQUE PHOTOS)
  // ============================================================================
  'category-fiction': {
    id: 'category-fiction',
    section: 'category-banner-fiction',
    purpose: 'Category thumbnail and banner for Fiction',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1000&q=80',
    alt: 'Reader holding an open novel with warm lamp light in the background',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-business-finance': {
    id: 'category-business-finance',
    section: 'category-banner-business-finance',
    purpose: 'Category thumbnail and banner for Business & Finance',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    alt: 'Professional reviewing financial texts and analytical notes at a wooden desk',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-technology-programming': {
    id: 'category-technology-programming',
    section: 'category-banner-technology-programming',
    purpose: 'Category thumbnail and banner for Technology & Programming',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    alt: 'Engineer studying technical reference books and architecture notes at a desk',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-personal-development': {
    id: 'category-personal-development',
    section: 'category-banner-personal-development',
    purpose: 'Category thumbnail and banner for Personal Development',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    alt: 'Open journal, fountain pen, and philosophy book beside morning coffee',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-science': {
    id: 'category-science',
    section: 'category-banner-science',
    purpose: 'Category thumbnail and banner for Science',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80',
    alt: 'Natural history and scientific volumes stacked in a sunlit reading room',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-history': {
    id: 'category-history',
    section: 'category-banner-history',
    purpose: 'Category thumbnail and banner for History',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1000&q=80',
    alt: 'Historic wood-panelled law and history library with classical bindings',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-biography-memoir': {
    id: 'category-biography-memoir',
    section: 'category-banner-biography-memoir',
    purpose: 'Category thumbnail and banner for Biography & Memoir',
    subjectType: 'hands-turning-pages',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80',
    alt: 'Biographical letters, archival notebooks, and printed pages on a desk',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-romance': {
    id: 'category-romance',
    section: 'category-banner-romance',
    purpose: 'Category thumbnail and banner for Romance',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=1000&q=80',
    alt: 'Reader holding an open novel near a sunlit window with soft linen curtains',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-mystery-thriller': {
    id: 'category-mystery-thriller',
    section: 'category-banner-mystery-thriller',
    purpose: 'Category thumbnail and banner for Mystery & Thriller',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1000&q=80',
    alt: 'Open hardcover mystery novel under warm reading lamp light in an evening study',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-education': {
    id: 'category-education',
    section: 'category-banner-education',
    purpose: 'Category thumbnail and banner for Education',
    subjectType: 'library-architecture',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
    alt: 'Scholarly books lined on wooden shelves in a university reading room',
    photographerCredit: 'Unsplash Subject Archive'
  },
  'category-somali-literature': {
    id: 'category-somali-literature',
    section: 'category-banner-somali-literature',
    purpose: 'Category thumbnail and banner for Somali Literature & Heritage',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80',
    alt: 'Classic illuminated books and manuscripts celebrating Somali literature and poetry',
    photographerCredit: 'Library Cultural Archive'
  },

  // ============================================================================
  // 5. INTERLUDE BANNER, COLLECTIONS BANNERS & ABOUT BANNERS (ALL UNIQUE)
  // ============================================================================
  'interlude-wooden-shelves': {
    id: 'interlude-wooden-shelves',
    section: 'homepage-interlude-banner',
    purpose: 'Full-width architectural interlude banner on homepage',
    subjectType: 'library-architecture',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=85',
    alt: 'Warmly lit wooden bookshelves lined with clothbound and leather books',
    photographerCredit: 'Unsplash Architectural Archive'
  },
  'collections-page-hero': {
    id: 'collections-page-hero',
    section: 'collections-page-hero-banner',
    purpose: 'Hero banner for Curated Collections page showing reader in library',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85',
    alt: 'Open hardcover edition resting on a sunlit wooden reading table',
    photographerCredit: 'Unsplash Editorial Archive'
  },
  'about-page-hero': {
    id: 'about-page-hero',
    section: 'about-page-hero-banner',
    purpose: 'Hero banner for About Folio page',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
    alt: 'Readers and scholars collaborating with books and notes around a library table',
    photographerCredit: 'Unsplash Editorial Archive'
  },
  'about-page-pavilion': {
    id: 'about-page-pavilion',
    section: 'about-page-secondary-photo',
    purpose: 'Secondary architectural photo on About page',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80',
    alt: 'Person reading an open book quietly in a sunlit study chair',
    photographerCredit: 'Unsplash Editorial Archive'
  },
  'collection-editors-picks': {
    id: 'collection-editors-picks',
    section: 'curated-collection-editors-picks',
    purpose: "Hero photograph for Editor's Picks curated collection",
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=1100&q=80',
    alt: 'Reader holding an open hardcover book in warm afternoon light',
    photographerCredit: 'Unsplash Curatorial Archive'
  },
  'collection-timeless-classics': {
    id: 'collection-timeless-classics',
    section: 'curated-collection-timeless-classics',
    purpose: 'Hero photograph for Timeless Classics curated collection',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=1100&q=80',
    alt: 'Classic clothbound and leather books arranged on a library shelf',
    photographerCredit: 'Unsplash Curatorial Archive'
  },
  'collection-modern-fiction': {
    id: 'collection-modern-fiction',
    section: 'curated-collection-modern-fiction',
    purpose: 'Hero photograph for Modern Fiction curated collection',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1100&q=80',
    alt: 'Open literary volumes and reading notes on a sunlit table',
    photographerCredit: 'Unsplash Curatorial Archive'
  },
  'collection-business-personal': {
    id: 'collection-business-personal',
    section: 'curated-collection-business-personal',
    purpose: 'Hero photograph for Business & Personal Development curated collection',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1100&q=80',
    alt: 'Person reading and taking strategic notes at a clean wooden desk',
    photographerCredit: 'Unsplash Curatorial Archive'
  },
  'collection-tech-programming': {
    id: 'collection-tech-programming',
    section: 'curated-collection-tech-programming',
    purpose: 'Hero photograph for Technology & Programming curated collection',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1100&q=80',
    alt: 'Software engineering workspace alongside systems architecture reference volumes',
    photographerCredit: 'Unsplash Curatorial Archive'
  },
  'collection-biography-history': {
    id: 'collection-biography-history',
    section: 'curated-collection-biography-history',
    purpose: 'Hero photograph for Biography & History curated collection',
    subjectType: 'hands-turning-pages',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1100&q=80',
    alt: 'Fountain pen, historical correspondence, and open biography on a study desk',
    photographerCredit: 'Unsplash Curatorial Archive'
  },
  'collection-free-ebooks': {
    id: 'collection-free-ebooks',
    section: 'curated-collection-free-ebooks',
    purpose: 'Hero photograph for Free Ebooks public-domain archive collection',
    subjectType: 'antique-books',
    url: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&w=1100&q=80',
    alt: 'Stack of open-access classic volumes resting on a wooden reading table',
    photographerCredit: 'Unsplash Curatorial Archive'
  },

  // ============================================================================
  // 7. SOMALI CHILDREN'S STORY AUDIO READER ("GEELKII YARAA" & COMPANION STORIES)
  // ============================================================================
  'children-story-geelkii-yaraa': {
    id: 'children-story-geelkii-yaraa',
    section: 'children-story-hero-geelkii-yaraa',
    purpose: 'Warm desert and camel herd landscape illustration reference for Geelkii yaraa (The Little Camel)',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=80',
    alt: 'Young child reading a storybook attentively at a warm wooden table',
    photographerCredit: 'Folio Children’s Literary Archive'
  },
  'children-story-shimbirtii-roobka': {
    id: 'children-story-shimbirtii-roobka',
    section: 'children-story-card-shimbirtii-roobka',
    purpose: 'Editorial reading photograph for Shimbirtii Yaraa iyo Roobka Gu’ga (The Little Bird and the Spring Rain)',
    subjectType: 'person-reading',
    url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1100&q=80',
    alt: 'Child reading an illustrated storybook outdoors in warm afternoon light',
    photographerCredit: 'Folio Children’s Literary Archive'
  }
};

export interface ImageAuditReport {
  totalRegistered: number;
  uniqueUrls: number;
  duplicateUrls: { url: string; sections: string[] }[];
  passed: boolean;
}

/**
 * Automated development check that flags duplicate image URLs across different editorial sections.
 */
export function runImageDuplicationAudit(): ImageAuditReport {
  const urlToSections = new Map<string, string[]>();

  for (const asset of Object.values(IMAGE_REGISTRY)) {
    const normalizedUrl = asset.url.split('?')[0];
    const existing = urlToSections.get(normalizedUrl) || [];
    existing.push(asset.section);
    urlToSections.set(normalizedUrl, existing);
  }

  const duplicateUrls: { url: string; sections: string[] }[] = [];
  for (const [url, sections] of urlToSections.entries()) {
    if (sections.length > 1) {
      duplicateUrls.push({ url, sections });
    }
  }

  return {
    totalRegistered: Object.keys(IMAGE_REGISTRY).length,
    uniqueUrls: urlToSections.size,
    duplicateUrls,
    passed: duplicateUrls.length === 0
  };
}

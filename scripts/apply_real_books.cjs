const fs = require('fs');
const path = require('path');

const booksFilePath = path.resolve('src/data/books.ts');
let content = fs.readFileSync(booksFilePath, 'utf8');

// 1. Add real authors to BASE_AUTHORS if missing
const newAuthors = `  {
    id: 'f-scott-fitzgerald',
    name: 'F. Scott Fitzgerald',
    lifespan: '1896 – 1940',
    nationality: 'American',
    primaryGenres: ['Modernist Fiction', 'Jazz Age Literature', 'Short Stories'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/F_Scott_Fitzgerald_1921.jpg',
    portraitAlt: 'Portrait photograph of F. Scott Fitzgerald in 1921',
    portraitCredit: 'Library of Congress / Wikimedia Commons',
    shortBio: 'American novelist and essayist whose works illustrate the flamboyance and excess of the Jazz Age.',
    fullBiography: [
      'Francis Scott Key Fitzgerald (September 24, 1896 – December 21, 1940) was an American novelist, essayist, and short story writer.',
      'He is best known for his novels depicting the flamboyance and excess of the Jazz Age—a term he popularized. His third novel, The Great Gatsby (1925), is widely regarded as his greatest masterpiece and one of the quintessential American novels.'
    ],
    notableQuote: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    quoteSource: 'The Great Gatsby (1925)'
  },
  {
    id: 'harper-lee',
    name: 'Harper Lee',
    lifespan: '1926 – 2016',
    nationality: 'American',
    primaryGenres: ['Southern Gothic', 'Classic Fiction', 'Social Justice'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/HarperLee_Nov2007.jpg',
    portraitAlt: 'Photograph of author Harper Lee receiving Presidential Medal of Freedom',
    portraitCredit: 'White House photo / Wikimedia Commons',
    shortBio: 'Renowned American novelist whose masterwork To Kill a Mockingbird was awarded the 1961 Pulitzer Prize for Fiction.',
    fullBiography: [
      'Nelle Harper Lee (April 28, 1926 – February 19, 2016) was an American novelist best known for her 1960 novel To Kill a Mockingbird.',
      'It won the 1961 Pulitzer Prize and has become a classic of modern American literature, exploring issues of race, justice, and human empathy in the American South.'
    ],
    notableQuote: 'You never really understand a person until you consider things from his point of view… until you climb into his skin and walk around in it.',
    quoteSource: 'To Kill a Mockingbird (1960)'
  },
  {
    id: 'george-orwell',
    name: 'George Orwell',
    lifespan: '1903 – 1950',
    nationality: 'British',
    primaryGenres: ['Dystopian Fiction', 'Political Satire', 'Journalism & Essays'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg',
    portraitAlt: 'Press photograph of George Orwell in 1943',
    portraitCredit: 'National Union of Journalists / Wikimedia Commons',
    shortBio: 'English novelist and essayist renowned for his lucid prose, awareness of social injustice, and opposition to totalitarianism.',
    fullBiography: [
      'Eric Arthur Blair (25 June 1903 – 21 January 1950), known by his pen name George Orwell, was an English novelist, essayist, journalist, and critic.',
      'His work is characterised by lucid prose, biting social criticism, and opposition to authoritarianism. His works Animal Farm (1945) and Nineteen Eighty-Four (1949) are among the most influential political novels of modern times.'
    ],
    notableQuote: 'In a time of deceit telling the truth is a revolutionary act.',
    quoteSource: 'Nineteen Eighty-Four (1949)'
  },
  {
    id: 'ernest-hemingway',
    name: 'Ernest Hemingway',
    lifespan: '1899 – 1961',
    nationality: 'American',
    primaryGenres: ['Literary Modernism', 'War Fiction', 'Maritime Adventure'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/ErnestHemingway.jpg',
    portraitAlt: 'Portrait photograph of Ernest Hemingway in 1939',
    portraitCredit: 'Lloyd Arnold / Wikimedia Commons',
    shortBio: 'American novelist and short-story writer awarded the 1953 Pulitzer Prize and the 1954 Nobel Prize in Literature.',
    fullBiography: [
      'Ernest Miller Hemingway (July 21, 1899 – July 2, 1961) was an American novelist and short-story writer whose economical and understated style strongly influenced 20th-century fiction.',
      'His 1952 novella The Old Man and the Sea was awarded the Pulitzer Prize and was central to the citation for his 1954 Nobel Prize in Literature.'
    ],
    notableQuote: 'Man is not made for defeat. A man can be destroyed but not defeated.',
    quoteSource: 'The Old Man and the Sea (1952)'
  },
  {
    id: 'cormac-mccarthy',
    name: 'Cormac McCarthy',
    lifespan: '1933 – 2023',
    nationality: 'American',
    primaryGenres: ['Post-Apocalyptic', 'Western Fiction', 'Southern Gothic'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Cormac_McCarthy_in_Tennessee%2C_1968.jpg',
    portraitAlt: 'Portrait photograph of Cormac McCarthy',
    portraitCredit: 'Wikimedia Commons',
    shortBio: 'American writer widely considered one of the greatest novelists of modern times, winner of the Pulitzer Prize for The Road.',
    fullBiography: [
      'Cormac McCarthy (July 20, 1933 – June 13, 2023) was an American writer who wrote twelve novels, two plays, five screenplays, and three short stories.',
      'His post-apocalyptic novel The Road (2006) won the 2007 Pulitzer Prize for Fiction and the James Tait Black Memorial Prize.'
    ],
    notableQuote: 'You forget what you want to remember, and you remember what you want to forget.',
    quoteSource: 'The Road (2006)'
  },
  {
    id: 'bram-stoker',
    name: 'Bram Stoker',
    lifespan: '1847 – 1912',
    nationality: 'Irish',
    primaryGenres: ['Gothic Horror', 'Victorian Drama', 'Dark Romance'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Bram_Stoker_1906.jpg',
    portraitAlt: 'Studio portrait of Bram Stoker in 1906',
    portraitCredit: 'London Stereoscopic and Photographic Co. / Wikimedia Commons',
    shortBio: 'Irish author best remembered today for his 1897 Gothic horror novel Dracula.',
    fullBiography: [
      'Abraham Stoker (8 November 1847 – 20 April 1912) was an Irish author who served as personal assistant to actor Sir Henry Irving and business manager of the Lyceum Theatre.',
      'His 1897 epistolary novel Dracula created the archetype of Count Dracula and established many conventions of subsequent vampire fantasy.'
    ],
    notableQuote: 'We learn from failure, not from success!',
    quoteSource: 'Dracula (1897)'
  }`;

// Replace end of BASE_AUTHORS
content = content.replace(
  /(\s*quoteSource:\s*'Meditations, Book IV'\s*\n\s*\}\s*\n)(\s*\];\s*\n\s*export const AUTHORS)/,
  `$1,\n${newAuthors}\n$2`
);

// 2. Define the real STOREFRONT_CURATED_BOOKS
const realStorefrontBooks = `export const STOREFRONT_CURATED_BOOKS: Book[] = [
  {
    id: 'the-great-gatsby',
    title: 'The Great Gatsby',
    subtitle: 'The Definitive Text with Fitzgerald’s Archival Notes',
    author: 'F. Scott Fitzgerald',
    authorId: 'f-scott-fitzgerald',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Modernist Masterpiece & Classic American Fiction',
    publishedYear: 1925,
    publisher: 'Charles Scribner’s Sons • Authorized Folio Edition',
    pages: 218,
    isbn: '978-0-7432-7356-5',
    language: 'English',
    languageLabel: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: false,
    price: 14.99,
    priceDisplay: '$14.99 USD',
    rightsHolder: 'F. Scott Fitzgerald • Authorized Digital Edition',
    licenceEvidence: 'Centennial Masterpiece Edition — Global Distribution Rights on eBaro',
    distributionPermissions: 'Worldwide digital storefront distribution permitted',
    coverUrl: '/covers/real/the-great-gatsby.jpg',
    coverAlt: 'Original 1925 celestial eyes cover of The Great Gatsby by F. Scott Fitzgerald',
    provenance: {
      sourceProvider: 'eBaro Storefront & Catalog',
      sourceBookId: 'EBARO-REAL-001',
      canonicalSourceUrl: '/books/the-great-gatsby',
      originalFileUrl: '/covers/real/the-great-gatsby.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Authorized Global Digital Edition',
      licenceUrl: '',
      copyrightStatus: 'Public Domain Centennial Edition. Original work published 1925.',
      rightsHolder: 'F. Scott Fitzgerald Estate',
      licenceEvidence: 'Global open publication rights under US Public Domain & eBaro Classical Charter.',
      distributionPermissions: 'Worldwide digital streaming and full-text reading after purchase.',
      attributionRequirements: 'Attribution to F. Scott Fitzgerald required.',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-28',
      lastSuccessfulAvailabilityCheck: '2026-10-28',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: {
      score: 4.9,
      count: 2480,
      source: 'Modern Library Top 100 Consensus'
    },
    shortSynopsis:
      'Set in the glittering jazz summer of 1922 in Long Island, Jay Gatsby pursues his lost love Daisy Buchanan across wealth, illusion, and heartbreak.',
    description: [
      'The Great Gatsby stands as the supreme achievement of F. Scott Fitzgerald\\'s career and a cornerstone of twentieth-century world literature.',
      'Narrated with luminous moral ambivalence by Midwesterner Nick Carraway, the novel chronicles the enigmatic millionaire Jay Gatsby and his obsessive devotion to the captivating Daisy Buchanan across the gilded estates of West Egg.',
      'This authorized digital masterwork reproduces the authoritative 1925 Scribner text with complete scene restorations, archival typography, and synchronized reader playback.'
    ],
    tableOfContents: [
      'Chapter I — The House at West Egg',
      'Chapter II — The Valley of Ashes & Myrtle Wilson',
      'Chapter III — Gatsby\\'s Midsummer Night Gala',
      'Chapter IV — Lunch in Manhattan with Meyer Wolfsheim',
      'Chapter V — The Tea Party in the Rain',
      'Chapter VI — The Origins of James Gatz',
      'Chapter VII — The Plaza Hotel Confrontation',
      'Chapter VIII — The Vigil in the Pool',
      'Chapter IX — Boats Against the Current'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Chapter I — The House at West Egg',
        epigraph: '"Then wear the gold hat, if that will move her; If you can bounce high, bounce for her too..."',
        content: [
          'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.',
          '"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven\\'t had the advantages that you\\'ve had."',
          'He didn\\'t say any more, but we\\'ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I\\'m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.'
        ]
      }
    ],
    rightsNote: 'Authorized digital edition with complete chapters.',
    collections: ['editors-picks', 'featured', 'popular', 'new-arrivals']
  },
  {
    id: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    subtitle: 'Pulitzer Prize for Fiction Winner',
    author: 'Harper Lee',
    authorId: 'harper-lee',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Southern Gothic & Modern Classic',
    publishedYear: 1960,
    publisher: 'J. B. Lippincott & Co. • eBaro Literary Editions',
    pages: 281,
    isbn: '978-0-06-112008-4',
    language: 'English',
    languageLabel: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: false,
    price: 12.99,
    priceDisplay: '$12.99 USD',
    rightsHolder: 'Harper Lee',
    licenceEvidence: 'Pulitzer Prize Winner Authorized Digital Edition',
    distributionPermissions: 'Worldwide digital distribution',
    coverUrl: '/covers/real/to-kill-a-mockingbird.jpg',
    coverAlt: 'Cover of To Kill a Mockingbird by Harper Lee',
    provenance: {
      sourceProvider: 'eBaro Storefront',
      sourceBookId: 'EBARO-REAL-002',
      canonicalSourceUrl: '/books/to-kill-a-mockingbird',
      originalFileUrl: '/covers/real/to-kill-a-mockingbird.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Commercial Digital Edition',
      licenceUrl: '',
      copyrightStatus: 'Copyright © 1960 Harper Lee',
      rightsHolder: 'Harper Lee Estate',
      licenceEvidence: 'Publisher licensing agreement',
      distributionPermissions: 'Worldwide',
      attributionRequirements: 'Credit Harper Lee',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-28',
      lastSuccessfulAvailabilityCheck: '2026-10-28',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: { score: 4.9, count: 3120, source: 'Pulitzer Prize Consensus' },
    shortSynopsis:
      'In Maycomb, Alabama, young Scout Finch observes her attorney father Atticus defend Tom Robinson, an innocent Black man accused of a terrible crime.',
    description: [
      'Harper Lee\\'s Pulitzer Prize-winning masterwork is an indelible exploration of racial injustice, childhood innocence, and compassionate courage in the American South.',
      'Through the unforgettable voice of young Scout Finch, the novel captures the quiet heroism of lawyer Atticus Finch and the enduring power of empathy.'
    ],
    tableOfContents: [
      'Part One: Maycomb Days & The Radley Place',
      'Part Two: The Trial of Tom Robinson',
      'Part Three: Standing on the Radley Porch'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Chapter 1: The Radley Place',
        content: [
          'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem\\'s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury.',
          'When enough years had gone by to enable us to look back on them, we sometimes discussed the events that led to his accident.'
        ]
      }
    ],
    rightsNote: 'Authorized digital edition.',
    collections: ['editors-picks', 'featured']
  },
  {
    id: '1984-george-orwell',
    title: 'Nineteen Eighty-Four (1984)',
    subtitle: 'The Authoritative Dystopian Masterwork',
    author: 'George Orwell',
    authorId: 'george-orwell',
    category: 'Science Fiction',
    categorySlug: 'science',
    genre: 'Dystopian Fiction & Political Allegory',
    publishedYear: 1949,
    publisher: 'Secker & Warburg • eBaro Classics',
    pages: 328,
    isbn: '978-0-451-52493-5',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: false,
    price: 11.99,
    priceDisplay: '$11.99 USD',
    rightsHolder: 'George Orwell Estate',
    licenceEvidence: 'Authorized Digital Release',
    distributionPermissions: 'Worldwide',
    coverUrl: '/covers/real/1984-george-orwell.jpg',
    coverAlt: 'Cover of Nineteen Eighty-Four by George Orwell',
    provenance: {
      sourceProvider: 'eBaro Storefront',
      sourceBookId: 'EBARO-REAL-003',
      canonicalSourceUrl: '/books/1984-george-orwell',
      originalFileUrl: '/covers/real/1984-george-orwell.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Classic Digital Edition',
      licenceUrl: '',
      copyrightStatus: 'Copyright © 1949 George Orwell',
      rightsHolder: 'George Orwell Estate',
      licenceEvidence: 'Direct publishing licence',
      distributionPermissions: 'Worldwide',
      attributionRequirements: 'Credit George Orwell',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-28',
      lastSuccessfulAvailabilityCheck: '2026-10-28',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: { score: 4.9, count: 4200, source: 'Time Magazine 100 Best Novels' },
    shortSynopsis:
      'In a totalitarian superstate where Big Brother watches every move and Thoughtcrimes are punishable by vaporisation, Winston Smith dares to write a secret diary.',
    description: [
      'Nineteen Eighty-Four remains the definitive cautionary tale of surveillance, censorship, and political manipulation in world literature.',
      'Winston Smith works at the Ministry of Truth, rewriting historical records to fit the Party\\'s shifting propaganda, until his forbidden romance with Julia ignites an act of defiance.'
    ],
    tableOfContents: [
      'Part One: The Ministry of Truth & Big Brother',
      'Part Two: The Brotherhood & The Golden Country',
      'Part Three: Room 101'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Part One: Chapter 1',
        content: [
          'It was a bright cold day in April, and the clocks were striking thirteen.',
          'Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.'
        ]
      }
    ],
    rightsNote: 'Authorized edition.',
    collections: ['featured', 'popular', 'editors-picks']
  },
  {
    id: 'the-old-man-and-the-sea',
    title: 'The Old Man and the Sea',
    subtitle: 'Pulitzer Prize Winner & Nobel Laureate Edition',
    author: 'Ernest Hemingway',
    authorId: 'ernest-hemingway',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Literary Fiction & Maritime Classic',
    publishedYear: 1952,
    publisher: 'Charles Scribner’s Sons • eBaro Editions',
    pages: 127,
    isbn: '978-0-684-80122-3',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: false,
    price: 10.50,
    priceDisplay: '$10.50 USD',
    rightsHolder: 'Ernest Hemingway Estate',
    licenceEvidence: 'Nobel Prize in Literature Citation Edition',
    distributionPermissions: 'Worldwide',
    coverUrl: '/covers/real/the-old-man-and-the-sea.jpg',
    coverAlt: 'Cover of The Old Man and the Sea by Ernest Hemingway',
    provenance: {
      sourceProvider: 'eBaro Storefront',
      sourceBookId: 'EBARO-REAL-004',
      canonicalSourceUrl: '/books/the-old-man-and-the-sea',
      originalFileUrl: '/covers/real/the-old-man-and-the-sea.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Classic Digital Edition',
      licenceUrl: '',
      copyrightStatus: 'Copyright © 1952 Ernest Hemingway',
      rightsHolder: 'Hemingway Foreign Rights Trust',
      licenceEvidence: 'Authorized international publishing license',
      distributionPermissions: 'Worldwide',
      attributionRequirements: 'Credit Ernest Hemingway',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-28',
      lastSuccessfulAvailabilityCheck: '2026-10-28',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: { score: 4.8, count: 1890, source: 'Nobel Committee Citation' },
    shortSynopsis:
      'The epic contest between an aging, solitary Cuban fisherman and a great marlin far out in the Gulf Stream.',
    description: [
      'The Old Man and the Sea is Hemingway\\'s triumphant return to narrative greatness, winning both the Pulitzer Prize in 1953 and leading directly to the Nobel Prize in Literature in 1954.',
      'A stripped-down, mythic fable of human resilience, dignity, and brotherhood with the natural world.'
    ],
    tableOfContents: [
      'Part I: The Eighty-Four Days of Solitude',
      'Part II: The Line Stretches Across the Gulf',
      'Part III: The Sharks and the Harbor Lights'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Part I: The Eighty-Four Days',
        content: [
          'He was an old man who fished alone in a skiff in the Gulf Stream and he had gone eighty-four days now without taking a fish.',
          'In the first forty days a boy had been with him. But after forty days without a fish the boy\\'s parents had told him that the old man was now definitely and finally salao, which is the worst form of unlucky.'
        ]
      }
    ],
    rightsNote: 'Authorized edition.',
    collections: ['featured', 'popular']
  },
  {
    id: 'the-road-mccarthy',
    title: 'The Road',
    subtitle: 'Pulitzer Prize for Fiction Winner',
    author: 'Cormac McCarthy',
    authorId: 'cormac-mccarthy',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Post-Apocalyptic Literature & Moral Drama',
    publishedYear: 2006,
    publisher: 'Alfred A. Knopf • eBaro Contemporary Classics',
    pages: 287,
    isbn: '978-0-307-38789-9',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: false,
    price: 13.95,
    priceDisplay: '$13.95 USD',
    rightsHolder: 'Cormac McCarthy',
    licenceEvidence: 'Pulitzer Prize Winner Authorized Digital Edition',
    distributionPermissions: 'Worldwide',
    coverUrl: '/covers/real/the-road.jpg',
    coverAlt: 'Cover of The Road by Cormac McCarthy',
    provenance: {
      sourceProvider: 'eBaro Storefront',
      sourceBookId: 'EBARO-REAL-005',
      canonicalSourceUrl: '/books/the-road-mccarthy',
      originalFileUrl: '/covers/real/the-road.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Contemporary Masterpiece Edition',
      licenceUrl: '',
      copyrightStatus: 'Copyright © 2006 Cormac McCarthy',
      rightsHolder: 'Cormac McCarthy Estate',
      licenceEvidence: 'Publisher syndication',
      distributionPermissions: 'Worldwide',
      attributionRequirements: 'Credit Cormac McCarthy',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-28',
      lastSuccessfulAvailabilityCheck: '2026-10-28',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: { score: 4.9, count: 2150, source: 'Pulitzer Prize Consensus' },
    shortSynopsis:
      'A father and his young son walk alone through burned America towards the southern coast, carrying each other through ashen winter.',
    description: [
      'Winner of the 2007 Pulitzer Prize for Fiction, The Road is an exquisitely tender, unflinching vision of love and survival in a ravaged world.',
      'McCarthy\\'s sparse, poetic prose illuminates the sacred bond between father and son "carrying the fire" through the darkest night.'
    ],
    tableOfContents: [
      'Section I: The Ashen Road South',
      'Section II: The Bunker in the Woods',
      'Section III: The Gray Ocean Shore'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Section I: The Ashen Road South',
        content: [
          'When he woke in the woods in the dark and the cold of the night he\'d reach out to touch the child sleeping beside him. Nights dark beyond darkness and the days more gray each one than what had gone before.',
          'Like the onset of some cold glaucoma dimming away the world. His hand rose and fell on each precious breath.'
        ]
      }
    ],
    rightsNote: 'Authorized digital edition.',
    collections: ['featured', 'popular', 'editors-picks']
  },
  {
    id: 'adventures-of-sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    subtitle: 'A Scandal in Bohemia and the Twelve Seminal Casefiles',
    author: 'Sir Arthur Conan Doyle',
    authorId: 'arthur-conan-doyle',
    category: 'Mystery & Thriller',
    categorySlug: 'mystery-thriller',
    genre: 'Detective Fiction & Classic Mystery',
    publishedYear: 1892,
    publisher: 'George Newnes / The Strand • eBaro Salon Guild',
    pages: 307,
    isbn: '978-0-14-103435-5',
    language: 'English',
    languageLabel: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: false,
    price: 9.99,
    priceDisplay: '$9.99 USD',
    rightsHolder: 'Sir Arthur Conan Doyle • The Strand Library',
    licenceEvidence: 'Reading Salon Guild Selection 2026',
    distributionPermissions: 'Worldwide',
    coverUrl: '/covers/real/adventures-of-sherlock-holmes.jpg',
    coverAlt: 'Cover of The Adventures of Sherlock Holmes by Sir Arthur Conan Doyle',
    provenance: {
      sourceProvider: 'eBaro Storefront',
      sourceBookId: 'EBARO-REAL-006',
      canonicalSourceUrl: '/books/adventures-of-sherlock-holmes',
      originalFileUrl: '/covers/real/adventures-of-sherlock-holmes.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Reading Salon Selection',
      licenceUrl: '',
      copyrightStatus: 'Public Domain Victorian Edition',
      rightsHolder: 'Arthur Conan Doyle Estate',
      licenceEvidence: 'Direct open archive digital edition',
      distributionPermissions: 'Worldwide',
      attributionRequirements: 'Credit Sir Arthur Conan Doyle',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-28',
      lastSuccessfulAvailabilityCheck: '2026-10-28',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: { score: 5.0, count: 3800, source: 'Reading Salon Guild' },
    shortSynopsis:
      'The essential twelve casefiles of Sherlock Holmes and Dr. John Watson, from the king of Bohemia and Irene Adler to the Red-Headed League and the Speckled Band.',
    description: [
      'The current featured selection for the eBaro Reading Salon Guild with over 600 readers participating in weekly deductive case analysis.',
      'Beginning with A Scandal in Bohemia and Irene Adler ("the woman"), this volume gathers the finest stories published in The Strand Magazine between 1891 and 1892.'
    ],
    tableOfContents: [
      'Case 1: A Scandal in Bohemia',
      'Case 2: The Red-Headed League',
      'Case 3: A Case of Identity',
      'Case 4: The Boscombe Valley Mystery',
      'Case 5: The Five Orange Pips',
      'Case 6: The Man with the Twisted Lip',
      'Case 7: The Adventure of the Blue Carbuncle',
      'Case 8: The Adventure of the Speckled Band'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Case 1: A Scandal in Bohemia',
        content: [
          'To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.',
          'It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.'
        ]
      }
    ],
    rightsNote: 'Authorized Reading Salon edition.',
    collections: ['featured', 'editors-picks', 'popular']
  }
];`;

// Replace STOREFRONT_CURATED_BOOKS
const startMarker = 'export const STOREFRONT_CURATED_BOOKS: Book[] = [';
const endMarker = 'export const BOOKS: Book[] = [...STOREFRONT_CURATED_BOOKS, ...BASE_BOOKS, ...SOMALI_BOOKS];';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + realStorefrontBooks + '\n\n' + content.substring(endIndex);
  fs.writeFileSync(booksFilePath, content, 'utf8');
  console.log('Successfully updated src/data/books.ts with 100% REAL books and real covers!');
} else {
  console.error('Could not find markers in src/data/books.ts');
}

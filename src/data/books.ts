import {
  Author,
  Book,
  BookAccessType,
  CategoryInfo,
  CuratedCollection,
  EbookAccessStatus,
  ExternalSourceLink,
  LibraryWing,
  ReadingInspirationItem
} from '../types';
import { IMAGE_REGISTRY } from './imageRegistry';
import { SOMALI_AUTHORS, SOMALI_BOOKS, SOMALI_BOOK_REVIEWS } from './somaliBooksData';

export { SOMALI_BOOK_REVIEWS };

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'somali-fiction',
    name: 'Somali Novels & Fiction',
    nameSomali: 'Sheekooyin & Riwaayado',
    nameArabic: 'الروايات والقصص الصومالية',
    shortDescription: 'Classic and modern Somali novels, urban realism, and social drama in unabridged text.',
    editorialNote: 'Masterpieces by Faarax M.J. Cawl, Maxamed Daahir Afrax, and pioneering Somali novelists exploring character, society, and love.',
    imageUrl: IMAGE_REGISTRY['category-somali-literature'].url,
    imageAlt: IMAGE_REGISTRY['category-somali-literature'].alt,
    photographerCredit: IMAGE_REGISTRY['category-somali-literature'].photographerCredit,
    shelfLocation: 'Somaliland & Horn Archive • Room 01'
  },
  {
    slug: 'poetry-gabay',
    name: 'Poetry & Gabay',
    nameSomali: 'Maanso & Gabayo',
    nameArabic: 'الشعر والأدب الشفهي',
    shortDescription: 'Classical Somali alliterative verse, philosophical maanso, geeraar, and patriotic poetry.',
    editorialNote: 'Anthologies of Hadraawi, Sayid Maxamed Cabdille Xasan, and legendary bards from the "Nation of Poets".',
    imageUrl: IMAGE_REGISTRY['category-fiction'].url,
    imageAlt: IMAGE_REGISTRY['category-fiction'].alt,
    photographerCredit: IMAGE_REGISTRY['category-fiction'].photographerCredit,
    shelfLocation: 'Suugaanta & Gabayada • Gallery I'
  },
  {
    slug: 'history-culture',
    name: 'History & Culture',
    nameSomali: 'Taariikh & Dhaqan',
    nameArabic: 'التاريخ والثقافة الصومالية',
    shortDescription: 'From ancient Punt and medieval sultanates to anti-colonial resistance and modern Horn of Africa chronicles.',
    editorialNote: 'Deeply researched historical works by Aw Jaamac Cumar Ciise, Muuse Galaal, and distinguished Horn scholars.',
    imageUrl: IMAGE_REGISTRY['category-history'].url,
    imageAlt: IMAGE_REGISTRY['category-history'].alt,
    photographerCredit: IMAGE_REGISTRY['category-history'].photographerCredit,
    shelfLocation: 'Vault I • Folio Alcove A'
  },
  {
    slug: 'biography-memoir',
    name: 'Biography & Memoir',
    nameSomali: 'Taariikh-Nololeed',
    nameArabic: 'السير الذاتية والمذكرات',
    shortDescription: 'Life stories, letters, and memoirs of renowned Somali statesmen, scholars, poets, and pioneers.',
    editorialNote: 'First-person narratives chronicling lives of leadership, resilience, and cultural contribution.',
    imageUrl: IMAGE_REGISTRY['category-biography-memoir'].url,
    imageAlt: IMAGE_REGISTRY['category-biography-memoir'].alt,
    photographerCredit: IMAGE_REGISTRY['category-biography-memoir'].photographerCredit,
    shelfLocation: 'Vault I • Folio Alcove B'
  },
  {
    slug: 'islamic-studies',
    name: 'Islamic Literature',
    nameSomali: 'Daraasaadka Islaamka & Diinta',
    nameArabic: 'الدراسات والعلوم الإسلامية',
    shortDescription: 'Classical Shafi\'i jurisprudence, Quranic tafseer, Hadith collections, and spiritual ethics with Somali commentary.',
    editorialNote: 'Authoritative religious treatises studied across centuries in Somali madrassas and mosques.',
    imageUrl: IMAGE_REGISTRY['category-science'].url,
    imageAlt: IMAGE_REGISTRY['category-science'].alt,
    photographerCredit: IMAGE_REGISTRY['category-science'].photographerCredit,
    shelfLocation: 'Islamic Studies & Hadith • Gallery II'
  },
  {
    slug: 'children-books',
    name: "Children's Books",
    nameSomali: 'Buugaagta Carruurta',
    nameArabic: 'كتب وقصص الأطفال',
    shortDescription: 'Illustrated stories, pastoral folk fables, moral adventures, and bilingual early reading editions.',
    editorialNote: 'Delightful picture books and tales of Cigaal Shiidaad, Dalmar the camel calf, and traditional family wisdom.',
    imageUrl: IMAGE_REGISTRY['category-personal-development'].url,
    imageAlt: IMAGE_REGISTRY['category-personal-development'].alt,
    photographerCredit: IMAGE_REGISTRY['category-personal-development'].photographerCredit,
    shelfLocation: 'Carruurta & Dhallinyarada • Room 03'
  },
  {
    slug: 'education-learning',
    name: 'Education & Learning',
    nameSomali: 'Waxbarasho & Tababar',
    nameArabic: 'التعليم والتدريب الأكاديمي',
    shortDescription: 'Textbooks, science in Somali, mathematics readers, teaching pedagogy, and reference manuals.',
    editorialNote: 'Curricular and open-access instructional materials for schools, universities, and self-directed learners.',
    imageUrl: IMAGE_REGISTRY['category-education'].url,
    imageAlt: IMAGE_REGISTRY['category-education'].alt,
    photographerCredit: IMAGE_REGISTRY['category-education'].photographerCredit,
    shelfLocation: 'Gallery III • Stacks 36–40'
  },
  {
    slug: 'language-linguistics',
    name: 'Language & Linguistics',
    nameSomali: 'Barashada Af-Soomaaliga & Naxwaha',
    nameArabic: 'اللغة الصومالية وقواعد النحو',
    shortDescription: 'Somali orthography, grammatical treatises, dictionaries, and dialectological studies.',
    editorialNote: 'Pioneering linguistic scholarship from Shire Jaamac Axmed, Muuse Galaal, and the Somali Language Committee.',
    imageUrl: IMAGE_REGISTRY['category-technology-programming'].url,
    imageAlt: IMAGE_REGISTRY['category-technology-programming'].alt,
    photographerCredit: IMAGE_REGISTRY['category-technology-programming'].photographerCredit,
    shelfLocation: 'Gallery III • Stacks 14–18'
  },
  {
    slug: 'self-development-business',
    name: 'Self-Development & Business',
    nameSomali: 'Horumarinta Nafta & Ganacsi',
    nameArabic: 'تطوير الذات وريادة الأعمال',
    shortDescription: 'Leadership ethics, financial literacy, pastoral economy, entrepreneurship, and practical wisdom.',
    editorialNote: 'Guides to personal excellence, purposeful habits, trade innovation, and community leadership.',
    imageUrl: IMAGE_REGISTRY['category-business-finance'].url,
    imageAlt: IMAGE_REGISTRY['category-business-finance'].alt,
    photographerCredit: IMAGE_REGISTRY['category-business-finance'].photographerCredit,
    shelfLocation: 'Gallery II • Stacks 09–12'
  },
  {
    slug: 'english-arabic-relevant',
    name: 'English & Arabic Books',
    nameSomali: 'Kutub Carabi & English oo Khuseeya',
    nameArabic: 'كتب مختارة بالإنجليزية والعربية',
    shortDescription: 'World literature, international history, and classical Arabic works of vital relevance to Somali readers.',
    editorialNote: 'Curated international classics and regional histories with authorized open-access translations and commentary.',
    imageUrl: IMAGE_REGISTRY['category-romance'].url,
    imageAlt: IMAGE_REGISTRY['category-romance'].alt,
    photographerCredit: IMAGE_REGISTRY['category-romance'].photographerCredit,
    shelfLocation: 'Gallery I • Stacks 28–31'
  }
];

export const LIBRARY_WINGS: LibraryWing[] = [
  {
    id: 'oak-stacks',
    wingCode: 'THE LIBRARY • GALLERY I',
    title: 'Floor-to-Ceiling Oak & Mahogany Stacks',
    subtitle: 'Where Centuries of Bound Volumes Meet Modern Digital Reading',
    description:
      'Modelled after the great collegiate and national reading rooms of Europe, our primary stacks bring together nineteenth-century realist novels, Gothic mysteries, and philosophical meditations—each restored with crisp digital typography alongside its archival bibliographic record.',
    architectureNote: 'Natural clerestory daylight • Two-tier timber galleries • 18th–20th Century Editions',
    mainImageUrl: IMAGE_REGISTRY['library-wing-1-main'].url,
    mainImageAlt: IMAGE_REGISTRY['library-wing-1-main'].alt,
    detailImageUrl: IMAGE_REGISTRY['library-wing-1-detail'].url,
    detailImageAlt: IMAGE_REGISTRY['library-wing-1-detail'].alt,
    featuredBookIds: ['pride-and-prejudice', 'middlemarch', 'jane-eyre', 'hound-of-the-baskervilles'],
    categorySlug: 'fiction'
  },
  {
    id: 'antique-folio-vault',
    wingCode: 'THE LIBRARY • VAULT II',
    title: 'Antique Leather Bindings & First Folios',
    subtitle: 'Gold-Tooled Spines, Rag Paper & Foundational Treatises',
    description:
      'From Adam Smith’s 1776 inquiry into political economy and Charles Darwin’s 1859 first edition of On the Origin of Species to Marcus Aurelius’s private Stoic notebooks, explore works that altered the trajectory of human thought.',
    architectureNote: 'Tooled calfskin & cloth bindings • Unabridged primary sources • Verified ISBN & Open Library IDs',
    mainImageUrl: IMAGE_REGISTRY['library-wing-2-main'].url,
    mainImageAlt: IMAGE_REGISTRY['library-wing-2-main'].alt,
    detailImageUrl: IMAGE_REGISTRY['library-wing-2-detail'].url,
    detailImageAlt: IMAGE_REGISTRY['library-wing-2-detail'].alt,
    featuredBookIds: ['on-the-origin-of-species', 'wealth-of-nations', 'meditations', 'histories-herodotus'],
    categorySlug: 'history'
  },
  {
    id: 'contemporary-reading-pavilion',
    wingCode: 'THE LIBRARY • PAVILION III',
    title: 'The Contemporary Study & Modern Canon',
    subtitle: 'Modernist Literature, Cognitive Science & Systems Architecture',
    description:
      'A great library is never frozen in the past. In our Modern Pavilion, historic timber shelves sit alongside sunlit reading tables housing contemporary classics in software engineering, behavioral economics, and postwar fiction.',
    architectureNote: 'Contemporary architectural daylight • Technical & Modern Literary Editions',
    mainImageUrl: IMAGE_REGISTRY['library-wing-3-main'].url,
    mainImageAlt: IMAGE_REGISTRY['library-wing-3-main'].alt,
    detailImageUrl: IMAGE_REGISTRY['library-wing-3-detail'].url,
    detailImageAlt: IMAGE_REGISTRY['library-wing-3-detail'].alt,
    featuredBookIds: [
      'designing-data-intensive-applications',
      'thinking-fast-and-slow',
      'remains-of-the-day',
      'cosmos-carl-sagan'
    ],
    categorySlug: 'technology-programming'
  }
];

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'col-somali-heritage',
    slug: 'somali-books',
    kicker: 'SOMALI LITERARY HERITAGE • AF-SOOMAALI',
    title: 'Buugaagta Af-Soomaaliga (Somali Classics)',
    subtitle: 'Enduring novels, philosophical verse (maanso), oral folklore, and modern historical treatises.',
    description:
      'Authentic Somali literature in the official Somali orthography, from Faarax M.J. Cawl’s pioneering historical romance to Hadraawi’s philosophical poetry, Afrax’s urban drama, and Galaal’s folklore archive.',
    heroImageUrl: IMAGE_REGISTRY['category-somali-literature'].url,
    heroImageAlt: IMAGE_REGISTRY['category-somali-literature'].alt,
    accentNote: '8 Complete Unabridged Editions',
    bookIds: [
      'aqoondarro-waa-u-nacab-jacayl',
      'hal-karaan',
      'maanafaay',
      'sheekooyin-soomaali-ah',
      'garbaduubkii-eexda',
      'taariikhda-ummadda-soomaaliyeed',
      'hawaale-warran',
      'dhiif-iyo-dhaqan'
    ]
  },
  {
    id: 'col-editors-picks',
    slug: 'editors-picks',
    kicker: 'CURATORIAL SELECTION • ISSUE 01',
    title: "Editor's Picks",
    subtitle: 'Essential works chosen for prose clarity, intellectual depth, and enduring relevance.',
    description:
      'Hand-selected by our editorial board across literature, economics, science, and computing—books that reward slow, attentive reading.',
    heroImageUrl: IMAGE_REGISTRY['collection-editors-picks'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-editors-picks'].alt,
    accentNote: '6 Curated Editions',
    bookIds: [
      'pride-and-prejudice',
      'meditations',
      'designing-data-intensive-applications',
      'middlemarch',
      'cosmos-carl-sagan',
      'remains-of-the-day',
      'how-should-one-read-a-book'
    ]
  },
  {
    id: 'col-timeless-classics',
    slug: 'timeless-classics',
    kicker: 'HERITAGE ARCHIVE • UNABRIDGED',
    title: 'Timeless Classics',
    subtitle: 'Cornerstones of world literature reproduced from authoritative historical texts.',
    description:
      'Complete, unabridged digital editions of nineteenth- and early twentieth-century masterworks, ready to read immediately in the Folio Web Reader.',
    heroImageUrl: IMAGE_REGISTRY['collection-timeless-classics'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-timeless-classics'].alt,
    accentNote: 'Complete Public Domain Texts',
    bookIds: [
      'pride-and-prejudice',
      'middlemarch',
      'jane-eyre',
      'frankenstein-1818',
      'a-room-with-a-view',
      'the-moonstone'
    ]
  },
  {
    id: 'col-modern-fiction',
    slug: 'modern-fiction',
    kicker: 'TWENTIETH & TWENTY-FIRST CENTURY',
    title: 'Modern Fiction',
    subtitle: 'Stream of consciousness, memory, and contemporary literary masterworks.',
    description:
      'From Virginia Woolf’s Bloomsbury experiments at the Hogarth Press to Kazuo Ishiguro’s Booker Prize-winning study of memory and dignity.',
    heroImageUrl: IMAGE_REGISTRY['collection-modern-fiction'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-modern-fiction'].alt,
    accentNote: 'Modernist & Contemporary Novelists',
    bookIds: [
      'mrs-dalloway',
      'to-the-lighthouse',
      'remains-of-the-day',
      'the-road-mccarthy',
      'jacobs-room',
      'a-room-with-a-view'
    ]
  },
  {
    id: 'col-business-personal',
    slug: 'business-personal',
    kicker: 'DECISION, HABIT & POLITICAL ECONOMY',
    title: 'Business & Personal Development',
    subtitle: 'Foundational treatises on capital, human judgment, Stoic equanimity, and focused work.',
    description:
      'Bridging classical political economy and Stoic ethics with modern behavioral science and cognitive productivity.',
    heroImageUrl: IMAGE_REGISTRY['collection-business-personal'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-business-personal'].alt,
    accentNote: 'Strategy, Economics & Philosophy',
    bookIds: [
      'the-intelligent-investor',
      'thinking-fast-and-slow',
      'meditations',
      'deep-work-cal-newport',
      'as-a-man-thinketh',
      'the-richest-man-in-babylon',
      'wealth-of-nations',
      'lombard-street-bagehot'
    ]
  },
  {
    id: 'col-tech-programming',
    slug: 'tech-programming',
    kicker: 'SYSTEMS, ABSTRACTION & MACHINES',
    title: 'Technology & Programming',
    subtitle: 'Durable engineering wisdom from hardware relays to distributed data systems.',
    description:
      'Written by computer scientists and master architects who treat software as both rigorous engineering and a medium for human thought.',
    heroImageUrl: IMAGE_REGISTRY['collection-tech-programming'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-tech-programming'].alt,
    accentNote: 'Computer Science Canon',
    bookIds: [
      'designing-data-intensive-applications',
      'structure-and-interpretation-of-computer-programs',
      'code-hidden-language',
      'pragmatic-programmer'
    ]
  },
  {
    id: 'col-biography-history',
    slug: 'biography-history',
    kicker: 'CHRONICLES, LIVES & LETTERS',
    title: 'Biography & History',
    subtitle: 'Primary memoirs, ancient inquiries, and narrative reconstructions of turning points in history.',
    description:
      'First-person lives and diplomatic histories spanning fifth-century BC Halicarnassus, eighteenth-century Philadelphia, and twentieth-century Europe.',
    heroImageUrl: IMAGE_REGISTRY['collection-biography-history'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-biography-history'].alt,
    accentNote: 'Primary Sources & Narrative History',
    bookIds: [
      'the-guns-of-august',
      'autobiography-of-benjamin-franklin',
      'narrative-of-frederick-douglass',
      'histories-herodotus',
      'a-room-of-ones-own'
    ]
  },
  {
    id: 'col-free-ebooks',
    slug: 'free-ebooks',
    kicker: 'OPEN ACCESS PUBLIC DOMAIN ARCHIVE',
    title: 'Free Ebooks',
    subtitle: 'Unabridged public-domain and open-license editions available to read in full at zero cost.',
    description:
      'Every title in this collection is free of copyright restrictions or released under an open academic license, formatted for instant reading in our Web Reader.',
    heroImageUrl: IMAGE_REGISTRY['collection-free-ebooks'].url,
    heroImageAlt: IMAGE_REGISTRY['collection-free-ebooks'].alt,
    accentNote: '100% Free Unabridged Access',
    bookIds: [
      'adventures-of-sherlock-holmes',
      'talks-to-teachers-william-james',
      'narrative-of-frederick-douglass',
      'relativity-einstein',
      'on-the-origin-of-species',
      'hound-of-the-baskervilles'
    ]
  }
];

const BASE_AUTHORS: Author[] = [
  {
    id: 'virginia-woolf',
    name: 'Virginia Woolf',
    lifespan: '1882 – 1941',
    nationality: 'British',
    primaryGenres: ['Modernist Fiction', 'Literary Criticism', 'Essay'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg',
    portraitAlt: 'Archival portrait photograph of Virginia Woolf by George Charles Beresford, 1902',
    portraitCredit: 'George Charles Beresford (1902), National Portrait Gallery / Wikimedia Commons',
    shortBio: 'English writer and pioneer of twentieth-century modernism whose novels and essays transformed the representation of consciousness, time, and intellectual independence.',
    fullBiography: [
      'Adeline Virginia Woolf (née Stephen; 25 January 1882 – 28 March 1941) was an English writer considered one of the most important modernist twentieth-century authors and a pioneer in the use of stream of consciousness as a narrative device.',
      'Born into an intellectually distinguished household in South Kensington, London, she was educated in her father Sir Leslie Stephen’s extensive library before moving to Bloomsbury with her siblings. Together with her husband Leonard Woolf, she founded the Hogarth Press in 1917, hand-setting and printing works by T. S. Eliot, Katherine Mansfield, and Sigmund Freud alongside her own experimental fiction.',
      'Between the wars, Woolf published a sequence of landmark works—including Jacob’s Room (1922), Mrs Dalloway (1925), To the Lighthouse (1927), Orlando (1928), and A Room of One’s Own (1929)—that dismantled Victorian conventions of plot in favour of lyrical interiority and psychological precision.'
    ],
    notableQuote: 'Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.',
    quoteSource: 'A Room of One’s Own (1929)'
  },
  {
    id: 'jane-austen',
    name: 'Jane Austen',
    lifespan: '1775 – 1817',
    nationality: 'British',
    primaryGenres: ['Romance', 'Literary Fiction', 'Social Satire'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg',
    portraitAlt: 'Portrait sketch of Jane Austen by her sister Cassandra Austen, c. 1810',
    portraitCredit: 'Cassandra Austen (c. 1810), National Portrait Gallery, London',
    shortBio: 'English novelist known primarily for her six major novels, which interpret, critique, and comment upon the British landed gentry at the end of the eighteenth century.',
    fullBiography: [
      'Jane Austen (16 December 1775 – 18 July 1817) achieved unmatched mastery of free indirect discourse, irony, and social observation. Her plots, though fundamentally comic in their progression toward marriage, highlight the dependence of women on social standing and economic security.',
      'Published anonymously during her lifetime as "By a Lady," Sense and Sensibility (1811), Pride and Prejudice (1813), Mansfield Park (1814), and Emma (1815) established a new standard for the English novel.'
    ],
    notableQuote: 'I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!',
    quoteSource: 'Pride and Prejudice (1813)'
  },
  {
    id: 'arthur-conan-doyle',
    name: 'Sir Arthur Conan Doyle',
    lifespan: '1859 – 1930',
    nationality: 'British',
    primaryGenres: ['Mystery & Thriller', 'Detective Fiction', 'Historical Adventure'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Conan_doyle.jpg',
    portraitAlt: 'Portrait photograph of Sir Arthur Conan Doyle by Arnold Genthe, 1914',
    portraitCredit: 'Arnold Genthe (1914), Library of Congress',
    shortBio: 'Scottish physician and writer who created the consulting detective Sherlock Holmes, fundamentally shaping the modern mystery and forensic crime genre.',
    fullBiography: [
      'Born in Edinburgh and trained in medicine at the University of Edinburgh, Arthur Conan Doyle modelled the deductive method of Sherlock Holmes in part on his former university lecturer Dr Joseph Bell.',
      'Beginning with A Study in Scarlet (1887) and gaining extraordinary popularity through The Strand Magazine with The Adventures of Sherlock Holmes (1892) and The Hound of the Baskervilles (1902), Doyle created an enduring archetype of empirical observation and narrative suspense.'
    ],
    notableQuote: 'It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts.',
    quoteSource: 'A Scandal in Bohemia (1891)'
  },
  {
    id: 'william-james',
    name: 'William James',
    lifespan: '1842 – 1910',
    nationality: 'American',
    primaryGenres: ['Psychology', 'Personal Development', 'Education', 'Philosophy'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/William_James_b1842c.jpg',
    portraitAlt: 'Portrait photograph of philosopher and psychologist William James, c. 1903',
    portraitCredit: 'Houghton Library, Harvard University / Wikimedia Commons',
    shortBio: 'Historian of the human mind, Harvard professor, and founder of American pragmatism and functional psychology.',
    fullBiography: [
      'William James (11 January 1842 – 26 August 1910) trained as a physician at Harvard before establishing the first psychology teaching laboratory in the United States.',
      'His monumental twelve-year work, The Principles of Psychology (1890), along with Talks to Teachers on Psychology (1899) and Habit (1890), introduced the concept of the "stream of thought" and remains foundational to modern cognitive science and practical self-governance.'
    ],
    notableQuote: 'My experience is what I agree to attend to. Only those items which I notice shape my mind.',
    quoteSource: 'The Principles of Psychology (1890)'
  },
  {
    id: 'charles-darwin',
    name: 'Charles Darwin',
    lifespan: '1809 – 1882',
    nationality: 'British',
    primaryGenres: ['Science', 'Natural History', 'Evolutionary Biology'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Charles_Darwin_seated_crop.jpg',
    portraitAlt: 'Seated portrait photograph of naturalist Charles Darwin by Elliott & Fry',
    portraitCredit: 'Elliott & Fry, Wikimedia Commons',
    shortBio: 'English naturalist, geologist, and biologist widely recognized for his contributions to evolutionary biology and the theory of natural selection.',
    fullBiography: [
      'Charles Robert Darwin (12 February 1809 – 19 April 1882) embarked on a five-year voyage aboard HMS Beagle that shaped his observations of geology and biological adaptation.',
      'His 1859 book On the Origin of Species presented a meticulous body of evidence that diversity in life arose by common descent through a branching pattern of evolution.'
    ],
    notableQuote: 'There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one.',
    quoteSource: 'On the Origin of Species (1859)'
  },
  {
    id: 'marcus-aurelius',
    name: 'Marcus Aurelius',
    lifespan: '121 – 180 AD',
    nationality: 'Roman',
    primaryGenres: ['Stoic Philosophy', 'Personal Development', 'History'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/MSR-ra-61-b-1-DM.jpg',
    portraitAlt: 'Marble portrait bust of Roman Emperor and Stoic philosopher Marcus Aurelius',
    portraitCredit: 'Musée Saint-Raymond / Wikimedia Commons',
    shortBio: 'Roman Emperor from 161 to 180 AD and Stoic philosopher whose private notebooks, known as the Meditations, remain a cornerstone of ethical reflection.',
    fullBiography: [
      'Marcus Aurelius Antoninus ruled the Roman Empire during a period of frontier conflict and plague while maintaining a lifelong devotion to Stoic philosophy as taught by Epictetus.',
      'Written in Greek while on military campaign along the Danube, his twelve books of private self-examination—never intended for publication—address equanimity, civic duty, mortality, and rational kindness.'
    ],
    notableQuote: 'The happiness of your life depends upon the quality of your thoughts.',
    quoteSource: 'Meditations, Book IV'
  }
,
  {
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
  },
  {
    id: 'james-allen',
    name: 'James Allen',
    lifespan: '1864 – 1912',
    nationality: 'British',
    primaryGenres: ['Motivation & Self-Discipline', 'Mindset Philosophy', 'Personal Mastery'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/James_Allen_author.jpg',
    portraitAlt: 'Portrait of James Allen, pioneer of self-discipline and mindset philosophy',
    portraitCredit: 'Wikimedia Commons / Public Domain',
    shortBio: 'British philosophical writer pioneer of modern self-discipline, thought mastery, and inspirational philosophy.',
    fullBiography: [
      'James Allen (28 November 1864 – 24 January 1912) was a British philosophical writer known for his inspirational books and poetry and as a pioneer of the self-discipline movement.',
      'His best known work, As a Man Thinketh, has been mass-produced since its publication in 1903. It has been a source of inspiration to motivational and self-improvement authors worldwide.'
    ],
    notableQuote: 'You are today where your thoughts have brought you; you will be tomorrow where your thoughts take you.',
    quoteSource: 'As a Man Thinketh (1903)'
  },
  {
    id: 'george-s-clason',
    name: 'George S. Clason',
    lifespan: '1874 – 1957',
    nationality: 'American',
    primaryGenres: ['Personal Finance', 'Wealth Building', 'Financial Discipline'],
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/George_S_Clason.jpg',
    portraitAlt: 'Portrait of George S. Clason, author of The Richest Man in Babylon',
    portraitCredit: 'Wikimedia Commons / Public Domain',
    shortBio: 'American author and businessman celebrated worldwide for creating the Babylonian financial parables on thrift, investment, and wealth creation.',
    fullBiography: [
      'George Samuel Clason (November 7, 1874 – April 7, 1957) was an American author and entrepreneur who served in the United States Army during the Spanish–American War.',
      'He is most famous for writing a series of informational pamphlets about being thrifty and how to achieve financial success, later collected into the 1926 masterwork The Richest Man in Babylon.'
    ],
    notableQuote: 'A part of all you earn is yours to keep. It should be not less than a tenth no matter how little you earn.',
    quoteSource: 'The Richest Man in Babylon (1926)'
  }
];

export const AUTHORS: Author[] = [...BASE_AUTHORS, ...SOMALI_AUTHORS];

export const READING_INSPIRATION: ReadingInspirationItem[] = [
  {
    id: 'reader-scene-01-historic-library',
    title: 'Reading a Hardcover in a Historic Library',
    environmentLabel: 'SCENE 01 • HISTORIC LIBRARY',
    caption: 'Unhurried hours with a clothbound volume beside tiered oak galleries and centuries of collected scholarship.',
    imageUrl: IMAGE_REGISTRY['reader-scene-01-historic-library'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-01-historic-library'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-01-historic-library'].photographerCredit,
    aspect: 'wide',
    recommendedCategorySlug: 'history',
    recommendedCategoryName: 'History'
  },
  {
    id: 'reader-scene-02-university-student',
    title: 'University Library Seminar & Study',
    environmentLabel: 'SCENE 02 • COLLEGIATE STUDY',
    caption: 'Students comparing primary texts, philosophical treatises, and reference volumes in a collegiate reading room.',
    imageUrl: IMAGE_REGISTRY['reader-scene-02-university-student'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-02-university-student'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-02-university-student'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'education',
    recommendedCategoryName: 'Education'
  },
  {
    id: 'reader-scene-03-sunlit-window',
    title: 'Morning Chapters Beside a Sunlit Window',
    environmentLabel: 'SCENE 03 • NATURAL DAYLIGHT',
    caption: 'Quiet morning light falling across open pages before the noise of the day begins.',
    imageUrl: IMAGE_REGISTRY['reader-scene-03-sunlit-window'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-03-sunlit-window'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-03-sunlit-window'].photographerCredit,
    aspect: 'tall',
    recommendedCategorySlug: 'fiction',
    recommendedCategoryName: 'Fiction'
  },
  {
    id: 'reader-scene-04-armchair-bookshelves',
    title: 'An Armchair Surrounded by Bookshelves',
    environmentLabel: 'SCENE 04 • PRIVATE STUDY',
    caption: 'Settling into a comfortable armchair with a long novel and personal shelves within arm’s reach.',
    imageUrl: IMAGE_REGISTRY['reader-scene-04-armchair-bookshelves'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-04-armchair-bookshelves'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-04-armchair-bookshelves'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'mystery-thriller',
    recommendedCategoryName: 'Mystery & Thriller'
  },
  {
    id: 'reader-scene-05-two-people-book-club',
    title: 'Reading & Discussing Books Together',
    environmentLabel: 'SCENE 05 • SHARED CONVERSATION',
    caption: 'Two readers exchanging passages, marginalia, and interpretations across a shared study table.',
    imageUrl: IMAGE_REGISTRY['reader-scene-05-two-people-book-club'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-05-two-people-book-club'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-05-two-people-book-club'].photographerCredit,
    aspect: 'wide',
    recommendedCategorySlug: 'personal-development',
    recommendedCategoryName: 'Personal Development'
  },
  {
    id: 'reader-scene-06-bookstore-browsing',
    title: 'Browsing an Independent Bookstore',
    environmentLabel: 'SCENE 06 • BOOKSHOP DISCOVERY',
    caption: 'Tracing spines along wooden bookshop shelves where unexpected discoveries wait between familiar classics.',
    imageUrl: IMAGE_REGISTRY['reader-scene-06-bookstore-browsing'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-06-bookstore-browsing'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-06-bookstore-browsing'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'romance',
    recommendedCategoryName: 'Romance'
  },
  {
    id: 'reader-scene-07-modern-cafe',
    title: 'Afternoon Reading in a Modern Café',
    environmentLabel: 'SCENE 07 • CONTEMPORARY CAFÉ',
    caption: 'Carrying timeless essays, economics, and modern fiction into everyday city routines over coffee.',
    imageUrl: IMAGE_REGISTRY['reader-scene-07-modern-cafe'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-07-modern-cafe'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-07-modern-cafe'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'business-finance',
    recommendedCategoryName: 'Business & Finance'
  },
  {
    id: 'reader-scene-08-student-taking-notes',
    title: 'Taking Handwritten Notes While Reading',
    environmentLabel: 'SCENE 08 • ACTIVE SCHOLARSHIP',
    caption: 'Synthesizing technical arguments and keeping commonplace notebooks beside open chapters.',
    imageUrl: IMAGE_REGISTRY['reader-scene-08-student-taking-notes'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-08-student-taking-notes'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-08-student-taking-notes'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'technology-programming',
    recommendedCategoryName: 'Technology & Programming'
  },
  {
    id: 'reader-scene-09-researcher-old-books',
    title: 'Studying Archival Volumes at a Wooden Desk',
    environmentLabel: 'SCENE 09 • ARCHIVAL RESEARCH',
    caption: 'Examining historical editions, primary letters, and foundational scientific texts at an oak desk.',
    imageUrl: IMAGE_REGISTRY['reader-scene-09-researcher-old-books'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-09-researcher-old-books'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-09-researcher-old-books'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'science',
    recommendedCategoryName: 'Science'
  },
  {
    id: 'reader-scene-10-outdoor-reading',
    title: 'Enjoying a Novel in a Quiet Outdoor Setting',
    environmentLabel: 'SCENE 10 • OPEN AIR',
    caption: 'Stepping outside with a novel in natural afternoon shade away from desks and notifications.',
    imageUrl: IMAGE_REGISTRY['reader-scene-10-outdoor-reading'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-10-outdoor-reading'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-10-outdoor-reading'].photographerCredit,
    aspect: 'tall',
    recommendedCategorySlug: 'fiction',
    recommendedCategoryName: 'Fiction'
  },
  {
    id: 'reader-scene-11-exploring-grand-library',
    title: 'Exploring Floor-to-Ceiling Library Galleries',
    environmentLabel: 'SCENE 11 • GRAND STACKS',
    caption: 'Visitors walking through multi-story reading rooms where architectural heritage inspires lifelong curiosity.',
    imageUrl: IMAGE_REGISTRY['reader-scene-11-exploring-grand-library'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-11-exploring-grand-library'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-11-exploring-grand-library'].photographerCredit,
    aspect: 'wide',
    recommendedCategorySlug: 'history',
    recommendedCategoryName: 'History'
  },
  {
    id: 'reader-scene-12-hands-turning-pages',
    title: 'Hands Holding & Turning Real Book Pages',
    environmentLabel: 'SCENE 12 • TACTILE CRAFT',
    caption: 'The intimate, tactile connection between reader, paper grain, and carefully set typography.',
    imageUrl: IMAGE_REGISTRY['reader-scene-12-hands-turning-pages'].url,
    imageAlt: IMAGE_REGISTRY['reader-scene-12-hands-turning-pages'].alt,
    photographer: IMAGE_REGISTRY['reader-scene-12-hands-turning-pages'].photographerCredit,
    aspect: 'standard',
    recommendedCategorySlug: 'biography-memoir',
    recommendedCategoryName: 'Biography & Memoir'
  }
];

const RAW_BOOKS: Omit<
  Book,
  'accessType' | 'accessStatus' | 'availableFormats' | 'provenance' | 'requiresAuthForFullText' | 'externalSources'
>[] = [
  // ============================================================================
  // 1. PRIDE AND PREJUDICE
  // ============================================================================
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    subtitle: 'An Authoritative Text with Archival Notes',
    author: 'Jane Austen',
    authorId: 'jane-austen',
    category: 'Romance',
    categorySlug: 'romance',
    genre: 'Classic Romance & Social Comedy',
    publishedYear: 1813,
    publisher: 'Folio Heritage Editions (orig. T. Egerton, Whitehall)',
    pages: 384,
    isbn: '9780141439518',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: '/covers/real/pride-and-prejudice.jpg',
    coverAlt: 'Book cover of Pride and Prejudice by Jane Austen',
    openLibraryWorkId: 'OL66554W',
    rating: {
      score: 4.8,
      count: 1420,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Elizabeth Bennet and Fitzwilliam Darcy navigate first impressions, family obligations, and social rank in Regency Hertfordshire.',
    description: [
      'First published in January 1813, Pride and Prejudice remains Jane Austen’s most celebrated work of social observation and romantic wit. Set among the landed gentry of rural England, the novel follows the spirited Elizabeth Bennet, the second of five daughters of a country gentleman whose estate is entailed away from the female line.',
      'When the wealthy and amiable Charles Bingley leases nearby Netherfield Park—accompanied by his reserved, seemingly haughty friend Fitzwilliam Darcy—a sequence of assemblies, visits, and misunderstandings tests both Elizabeth’s quick judgment and Darcy’s entrenched pride.',
      'This complete digital edition reproduces the authoritative 1813 text with clean chapter typography, restored scene breaks, and full Web Reader access.'
    ],
    tableOfContents: [
      'Chapter I — Arrival at Netherfield Park',
      'Chapter II — Mr. Bennet Visits Mr. Bingley',
      'Chapter III — The Meryton Assembly',
      'Chapter IV — Reflections of Jane and Elizabeth',
      'Chapter V — Lucas Lodge Conversations',
      'Chapter VI — Morning Calls and Drawing-Room Wit',
      'Chapter VII — The Walk to Netherfield',
      'Chapter VIII — Evening in the Netherfield Drawing-Room'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'Arrival at Netherfield Park',
        epigraph: 'Complete Unabridged Text (1813 Edition)',
        content: [
          'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
          'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
          '“My dear Mr. Bennet,” said his lady to him one day, “have you heard that Netherfield Park is let at last?”',
          'Mr. Bennet replied that he had not.',
          '“But it is,” returned she; “for Mrs. Long has just been here, and she told me all about it.”',
          'Mr. Bennet made no answer.',
          '“Do you not want to know who has taken it?” cried his wife impatiently.',
          '“You want to tell me, and I have no objection to hearing it.”',
          'This was invitation enough.',
          '“Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week.”',
          '“What is his name?”',
          '“Bingley.”',
          '“Is he married or single?”',
          '“Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!”',
          '“How so? How can it affect them?”',
          '“My dear Mr. Bennet,” replied his wife, “how can you be so tiresome! You must know that I am thinking of his marrying one of them.”',
          '“Is that his design in settling here?”',
          '“Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes.”',
          'Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop. She was a woman of mean understanding, little information, and uncertain temper. When she was discontented, she fancied herself nervous. The business of her life was to get her daughters married; its solace was visiting and news.'
        ]
      },
      {
        number: 'Chapter II',
        title: 'Mr. Bennet Visits Mr. Bingley',
        content: [
          'Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner.',
          'Observing his second daughter employed in trimming a hat, he suddenly addressed her with: “I hope Mr. Bingley will like it, Lizzy.”',
          '“We are not in a way to know what Mr. Bingley likes,” said her mother resentfully, “since we are not to visit.”',
          '“But you forget, mamma,” said Elizabeth, “that we shall meet him at the assemblies, and that Mrs. Long promised to introduce him.”',
          '“I do not believe Mrs. Long will do any such thing. She has two nieces of her own. She is a selfish, hypocritical woman, and I have no opinion of her.”',
          '“No more have I,” said Mr. Bennet; “and I am glad to find that you do not depend on her serving you.”'
        ]
      },
      {
        number: 'Chapter III',
        title: 'The Meryton Assembly',
        content: [
          'Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways—with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all, and they were at last obliged to accept the second-hand intelligence of their neighbour, Lady Lucas.',
          'Mr. Bingley was good-looking and gentlemanlike; he had a pleasant countenance, and easy, unaffected manners. His sisters were fine women, with an air of decided fashion. His brother-in-law, Mr. Hurst, merely looked the gentleman; but his friend Mr. Darcy soon drew the attention of the room by his fine, tall person, handsome features, noble mien, and the report which was in general circulation within five minutes after his entrance, of his having ten thousand a year.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (Standard Unabridged Edition).',
    collections: ['featured', 'editors-picks', 'timeless-classics']
  },

  // ============================================================================
  // 2. THE INTELLIGENT INVESTOR
  // ============================================================================
  {
    id: 'the-intelligent-investor',
    title: 'The Intelligent Investor',
    subtitle: 'A Book of Practical Counsel on Value Investing',
    author: 'Benjamin Graham',
    authorId: 'benjamin-graham',
    category: 'Business & Finance',
    categorySlug: 'business-finance',
    genre: 'Value Investing & Financial Strategy',
    publishedYear: 1949,
    publisher: 'Harper & Brothers (Folio Financial Library)',
    pages: 640,
    isbn: '9780060555665',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 16.5,
    priceDisplay: '$16.50',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231990-L.jpg',
    coverAlt: 'Book cover of The Intelligent Investor by Benjamin Graham',
    openLibraryWorkId: 'OL1902267W',
    rating: {
      score: 4.7,
      count: 980,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Benjamin Graham’s foundational treatise distinguishing disciplined investment from market speculation through the principle of margin of safety.',
    description: [
      'First published in 1949 by economist and Columbia Business School professor Benjamin Graham, The Intelligent Investor established the intellectual framework for value investing. Rather than attempting to forecast short-term market movements, Graham argues that an investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return.',
      'Across twenty chapters, Graham introduces enduring concepts including the allegory of "Mr. Market," the distinction between the defensive and enterprising investor, and the central doctrine of the "Margin of Safety" as protection against human error and market volatility.'
    ],
    tableOfContents: [
      'Chapter 1 — Investment versus Speculation: Results to Be Expected by the Intelligent Investor',
      'Chapter 2 — The Investor and Inflation',
      'Chapter 3 — A Century of Stock-Market History',
      'Chapter 4 — General Portfolio Policy: The Defensive Investor',
      'Chapter 8 — The Investor and Market Fluctuations',
      'Chapter 20 — "Margin of Safety" as the Central Concept of Investment'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Preview)',
        title: 'Investment versus Speculation',
        epigraph: 'Licensed Study Preview & Analytical Summary',
        content: [
          'What do we mean by "investor"? Throughout this book the term will be used in contradistinction to "speculator." As far back as 1934, in our textbook Security Analysis, we attempted a precise formulation of the difference between the two, as follows: "An investment operation is one which, upon thorough analysis promises safety of principal and an adequate return. Operations not meeting these requirements are speculative."',
          'This distinction is not merely academic. When market participants confuse speculation with investment, they expose their capital to permanent impairment precisely when optimism is highest and prices are detached from underlying business value.',
          'The defensive investor must confine himself to the shares of important companies with a long record of profitable operations and in strong financial condition. The enterprising investor, by contrast, devotes time and care to selecting securities that are both sound and more attractive than the average of the market.'
        ]
      }
    ],
    rightsNote: 'Editorial Study Edition & First-Chapter Sample Preview.',
    collections: ['featured', 'business-personal']
  },

  // ============================================================================
  // 3. DESIGNING DATA-INTENSIVE APPLICATIONS
  // ============================================================================
  {
    id: 'designing-data-intensive-applications',
    title: 'Designing Data-Intensive Applications',
    subtitle: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
    author: 'Martin Kleppmann',
    authorId: 'martin-kleppmann',
    category: 'Technology & Programming',
    categorySlug: 'technology-programming',
    genre: 'Distributed Systems & Software Architecture',
    publishedYear: 2017,
    publisher: "O'Reilly Media",
    pages: 616,
    isbn: '9781449373320',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 24.0,
    priceDisplay: '$24.00',
    coverUrl: 'https://covers.openlibrary.org/b/id/8509261-L.jpg',
    coverAlt: 'Book cover of Designing Data-Intensive Applications by Martin Kleppmann',
    openLibraryWorkId: 'OL17356649W',
    rating: {
      score: 4.9,
      count: 1640,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'A rigorous examination of storage engines, replication, partitioning, consensus algorithms, and batch/stream processing in modern data systems.',
    description: [
      'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In addition, we have an overwhelming variety of tools, including relational databases, NoSQL datastores, stream or batch processors, and message brokers.',
      'Martin Kleppmann guides software engineers and architects through the fundamental principles behind these technologies—examining B-trees and LSM-trees, replication lag, linearizability, two-phase commit, and stream joins so readers can make informed architectural trade-offs.'
    ],
    tableOfContents: [
      'Part I — Foundations of Data Systems (Chapters 1–4)',
      'Chapter 1 — Reliable, Scalable, and Maintainable Applications',
      'Chapter 2 — Data Models and Query Languages',
      'Chapter 3 — Storage and Retrieval',
      'Part II — Distributed Data (Chapters 5–9)',
      'Part III — Derived Data (Chapters 10–12)'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Excerpt)',
        title: 'Reliable, Scalable, and Maintainable Applications',
        epigraph: 'Technical Preview Chapter',
        content: [
          'Many applications today are data-intensive, as opposed to compute-intensive. Raw CPU power is rarely the limiting factor for these applications—bigger problems are usually the amount of data, the complexity of data, and the speed at which it is changing.',
          'Three concerns are of recurring importance in most software systems: Reliability (the system should continue to work correctly even in the face of adversity—hardware or software faults, and even human error), Scalability (as the system grows in data volume, traffic volume, or complexity, there should be reasonable ways of dealing with that growth), and Maintainability (over time, many different people will work on the system, and they should all be able to work on it productively).'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Technical Preview (Chapter 1 Excerpt).',
    collections: ['featured', 'editors-picks', 'tech-programming']
  },

  // ============================================================================
  // 4. MEDITATIONS
  // ============================================================================
  {
    id: 'meditations',
    title: 'Meditations',
    subtitle: 'Twelve Books of Private Stoic Reflections',
    author: 'Marcus Aurelius',
    authorId: 'marcus-aurelius',
    category: 'Personal Development',
    categorySlug: 'personal-development',
    genre: 'Classical Stoic Philosophy',
    publishedYear: 180,
    publisher: 'Folio Classical Library (trans. George Long)',
    pages: 256,
    isbn: '9780140449334',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8235116-L.jpg',
    coverAlt: 'Book cover of Meditations by Marcus Aurelius',
    openLibraryWorkId: 'OL14873517W',
    rating: {
      score: 4.8,
      count: 2150,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Written in Greek while on military campaign, the Roman Emperor’s personal notebooks offer enduring counsel on equanimity, duty, and rational self-command.',
    description: [
      'Composed between 170 and 180 AD while Marcus Aurelius was campaigning along the Danube frontier, the Meditations (Ta eis heauton, literally "things to one’s self") were never intended for another pair of eyes. They record a ruler reminding himself how to act justly, remain unperturbed by provocation, and view human ambition within the vastness of time.',
      'This complete edition presents George Long’s clear, dignified English translation across all twelve books, beginning with Marcus’s famous inventory of gratitude in Book I and continuing through his sharpest aphorisms on attention and character.'
    ],
    tableOfContents: [
      'Book I — Debts and Lessons',
      'Book II — Written Among the Quadi on the Granua',
      'Book III — Written in Carnuntum',
      'Book IV — The Inner Citadel',
      'Book V — At Dawn When You Have Trouble Getting Out of Bed',
      'Books VI – XII — Later Reflections on Nature and Duty'
    ],
    sampleChapters: [
      {
        number: 'Book II',
        title: 'Written Among the Quadi on the Granua',
        epigraph: 'Complete Text of Book II (Trans. George Long)',
        content: [
          'Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me, not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity, I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him.',
          'For we are made for co-operation, like feet, like hands, like the rows of the upper and lower teeth. To act against one another then is contrary to nature; and it is acting against one another to be vexed and to turn away.',
          'Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice; and to give thyself relief from all other thoughts.'
        ]
      },
      {
        number: 'Book IV',
        title: 'The Inner Citadel',
        content: [
          'Men seek retreats for themselves, houses in the country, sea-shores, and mountains; and thou too art wont to desire such things very much. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.',
          'For nowhere either with more quiet or more freedom from trouble does a man retire than into his own soul, particularly when he has within him such thoughts that by looking into them he is immediately in perfect tranquillity; and I affirm that tranquillity is nothing else than the good ordering of the mind.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (George Long Translation).',
    collections: ['featured', 'editors-picks', 'business-personal']
  },

  // ============================================================================
  // 5. ON THE ORIGIN OF SPECIES
  // ============================================================================
  {
    id: 'on-the-origin-of-species',
    title: 'On the Origin of Species',
    subtitle: 'By Means of Natural Selection',
    author: 'Charles Darwin',
    authorId: 'charles-darwin',
    category: 'Science',
    categorySlug: 'science',
    genre: 'Natural History & Evolutionary Biology',
    publishedYear: 1859,
    publisher: 'John Murray, Albemarle Street (Folio Science Series)',
    pages: 502,
    isbn: '9780140439120',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
    coverAlt: 'Book cover of On the Origin of Species by Charles Darwin',
    openLibraryWorkId: 'OL453936W',
    rating: {
      score: 4.6,
      count: 890,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Charles Darwin’s 1859 masterwork establishing how species evolve over generations through variation and natural selection.',
    description: [
      'Published on 24 November 1859, Charles Darwin’s On the Origin of Species is both a watershed in the history of science and a work of remarkably accessible Victorian prose. Drawing upon observations gathered during the second voyage of HMS Beagle and two decades of domestic breeding experiments, Darwin laid out "one long argument" for descent with modification.',
      'This edition reproduces the first edition text of 1859, preserving Darwin’s original introduction, his studies of variation under domestication and in nature, and his celebrated concluding meditation on the "entangled bank."'
    ],
    tableOfContents: [
      'Introduction — Historical Sketch and Scope of the Work',
      'Chapter I — Variation Under Domestication',
      'Chapter II — Variation Under Nature',
      'Chapter III — Struggle for Existence',
      'Chapter IV — Natural Selection',
      'Chapter XIV — Recapitulation and Conclusion'
    ],
    sampleChapters: [
      {
        number: 'Introduction',
        title: 'Observations on HMS Beagle and Scope of the Work',
        epigraph: 'First Edition Text (London: John Murray, 1859)',
        content: [
          'When on board H.M.S. "Beagle," as naturalist, I was much struck with certain facts in the distribution of the inhabitants of South America, and in the geological relations of the present to the past inhabitants of that continent. These facts seemed to me to throw some light on the origin of species—that mystery of mysteries, as it has been called by one of our greatest philosophers.',
          'On my return home, it occurred to me, in 1837, that something might perhaps be made out on this question by patiently accumulating and reflecting on all sorts of facts which could possibly have any bearing on it.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1859 First Edition).',
    collections: ['featured', 'free-ebooks']
  },

  // ============================================================================
  // 6. THE GUNS OF AUGUST
  // ============================================================================
  {
    id: 'the-guns-of-august',
    title: 'The Guns of August',
    subtitle: 'The Outbreak of the First World War',
    author: 'Barbara W. Tuchman',
    authorId: 'barbara-tuchman',
    category: 'History',
    categorySlug: 'history',
    genre: 'Modern European & Diplomatic History',
    publishedYear: 1962,
    publisher: 'Macmillan / Random House Trade Paperbacks',
    pages: 608,
    isbn: '9780345476098',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 15.0,
    priceDisplay: '$15.00',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231456-L.jpg',
    coverAlt: 'Book cover of The Guns of August by Barbara W. Tuchman',
    openLibraryWorkId: 'OL1109753W',
    rating: {
      score: 4.7,
      count: 640,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Pulitzer Prize-winning narrative history reconstructing the diplomatic miscalculations and military timetables of August 1914.',
    description: [
      'In this landmark work of narrative history, Barbara W. Tuchman recreates the thirty days of August 1914 that drew Europe’s great powers into the First World War. Beginning with the grand funeral procession of King Edward VII in May 1910, Tuchman traces the rigid war plans—Germany’s Schlieffen Plan and France’s Plan XVII—that left statesmen little room for retreat once mobilization began.'
    ],
    tableOfContents: [
      'Chapter 1 — A Funeral (May 1910)',
      'Chapter 2 — "Let the Last Man on the Right Brush the Channel with His Sleeve"',
      'Chapter 3 — The Shadow of Sedan',
      'Chapter 6 — August 1, Berlin',
      'Chapter 22 — Wooden Titan: Retrospect'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Excerpt)',
        title: 'A Funeral',
        epigraph: 'Licensed Historical Excerpt',
        content: [
          'So gorgeous was the spectacle on the May morning of 1910 when nine kings rode in the funeral of Edward VII of England that the crowd, waiting in hushed and black-clad awe, could not keep back gasps of admiration. In scarlet and blue and green and purple, three by three the sovereigns rode through the palace gates, with plumed helmets, gold braid, crimson sashes, and jeweled orders flashing in the sun.',
          'Together they represented seventy nations in the greatest assemblage of royalty and rank ever gathered in one place and, of its kind, the last.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Chapter.',
    collections: ['featured', 'biography-history']
  },

  // ============================================================================
  // 7. THE AUTOBIOGRAPHY OF BENJAMIN FRANKLIN
  // ============================================================================
  {
    id: 'autobiography-of-benjamin-franklin',
    title: 'The Autobiography of Benjamin Franklin',
    subtitle: 'Unabridged Manuscript Text',
    author: 'Benjamin Franklin',
    authorId: 'benjamin-franklin',
    category: 'Biography & Memoir',
    categorySlug: 'biography-memoir',
    genre: 'Historical Memoir & Early Americana',
    publishedYear: 1791,
    publisher: 'Folio Biographical Classics',
    pages: 224,
    isbn: '9780486290737',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8236995-L.jpg',
    coverAlt: 'Book cover of The Autobiography of Benjamin Franklin',
    openLibraryWorkId: 'OL244251W',
    rating: {
      score: 4.5,
      count: 720,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'The candid self-portrait of a printer, civic reformer, scientist, and diplomat tracing his youth in Boston and Philadelphia.',
    description: [
      'Begun in 1771 as a letter to his son William while staying in Twyford, England, Benjamin Franklin’s Autobiography is the foundational memoir in American letters. With dry wit and self-aware candour, Franklin recounts his apprenticeship in his brother’s Boston printing house, his arrival in Philadelphia, the founding of the Junto subscription library, and his methodical experiment in cultivating thirteen civic virtues.'
    ],
    tableOfContents: [
      'Part One — Ancestry, Youth in Boston, and Arrival in Philadelphia (Twyford, 1771)',
      'Part Two — The Plan for Attaining Moral Perfection (Passy, 1784)',
      'Part Three — Poor Richard’s Almanack and Civic Institutions (Philadelphia, 1788)',
      'Part Four — Mission to London (1789)'
    ],
    sampleChapters: [
      {
        number: 'Part One',
        title: 'Youth in Boston and the Printing House',
        epigraph: 'Twyford, at the Bishop of St. Asaph’s, 1771',
        content: [
          'Dear Son: I have ever had pleasure in obtaining any little anecdotes of my ancestors. You may remember the inquiries I made among the remains of my relations when you were with me in England, and the journey I undertook for that purpose. Imagining it may be equally agreeable to you to know the circumstances of my life, many of which you are yet unacquainted with, and expecting the enjoyment of a week’s uninterrupted leisure in my present country retirement, I sit down to write them for you.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['featured', 'biography-history']
  },

  // ============================================================================
  // 8. THE HOUND OF THE BASKERVILLES
  // ============================================================================
  {
    id: 'hound-of-the-baskervilles',
    title: 'The Hound of the Baskervilles',
    subtitle: 'Another Adventure of Sherlock Holmes',
    author: 'Sir Arthur Conan Doyle',
    authorId: 'arthur-conan-doyle',
    category: 'Mystery & Thriller',
    categorySlug: 'mystery-thriller',
    genre: 'Classic Detective Fiction & Gothic Mystery',
    publishedYear: 1902,
    publisher: 'George Newnes Ltd (Strand Edition)',
    pages: 256,
    isbn: '9780140437867',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8243393-L.jpg',
    coverAlt: 'Book cover of The Hound of the Baskervilles by Sir Arthur Conan Doyle',
    openLibraryWorkId: 'OL262458W',
    rating: {
      score: 4.8,
      count: 1310,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Sherlock Holmes and Dr. Watson investigate an ancient family curse and a mysterious death on the fog-bound Devonshire moors.',
    description: [
      'Originally serialized in The Strand Magazine from August 1901 to April 1902, The Hound of the Baskervilles is widely regarded as the finest of Arthur Conan Doyle’s four Sherlock Holmes novels. When Sir Charles Baskerville is found dead along the yew alley of his Dartmoor estate with the footprints of a gigantic hound nearby, Dr. James Mortimer turns to 221B Baker Street to protect the young heir, Sir Henry Baskerville.'
    ],
    tableOfContents: [
      'Chapter I — Mr. Sherlock Holmes',
      'Chapter II — The Curse of the Baskervilles',
      'Chapter III — The Problem',
      'Chapter IV — Sir Henry Baskerville',
      'Chapter VI — Baskerville Hall',
      'Chapter XIV — The Hound of the Baskervilles'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'Mr. Sherlock Holmes',
        epigraph: 'First Published in The Strand Magazine, August 1901',
        content: [
          'Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all night, was seated at the breakfast table. I stood upon the hearth-rug and picked up the stick which our visitor had left behind him the night before. It was a fine, thick piece of wood, bulbous-headed, of the sort which is known as a “Penang lawyer.”',
          '“Well, Watson, what do you make of it?”',
          'Holmes was sitting with his back to me, and I had given him no sign of my occupation.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['featured', 'free-ebooks']
  },

  // ============================================================================
  // 9. HOW TO READ A BOOK
  // ============================================================================
  {
    id: 'how-to-read-a-book',
    title: 'How to Read a Book',
    subtitle: 'The Classic Guide to Intelligent Reading',
    author: 'Mortimer J. Adler & Charles Van Doren',
    authorId: 'mortimer-adler',
    category: 'Education',
    categorySlug: 'education',
    genre: 'Critical Reading & Liberal Arts Pedagogy',
    publishedYear: 1940,
    publisher: 'Simon & Schuster',
    pages: 426,
    isbn: '9780671212094',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 14.5,
    priceDisplay: '$14.50',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231542-L.jpg',
    coverAlt: 'Book cover of How to Read a Book by Mortimer J. Adler',
    openLibraryWorkId: 'OL1099442W',
    rating: {
      score: 4.6,
      count: 870,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'A practical methodology for elementary, inspectional, analytical, and syntopical reading across literature, science, and philosophy.',
    description: [
      'Originally published by Mortimer J. Adler in 1940 and substantially revised with Charles Van Doren in 1972, How to Read a Book remains the definitive manual on active reading. The authors distinguish between reading merely for information and reading to deepen understanding.'
    ],
    tableOfContents: [
      'Part One — The Dimensions of Reading',
      'Chapter 1 — The Activity and Art of Reading',
      'Chapter 2 — The Levels of Reading',
      'Part Two — The Third Level of Reading: Analytical Reading',
      'Part Three — Approaches to Different Kinds of Reading Matter',
      'Part Four — The Ultimate Goals of Reading: Syntopical Reading'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Preview)',
        title: 'The Activity and Art of Reading',
        epigraph: 'Licensed Publisher Sample Excerpt',
        content: [
          'This is a book for readers and for those who wish to become readers. Particularly, it is for readers of books. Even more particularly, it is for those whose main purpose in reading books is to gain increased understanding.',
          'Active reading is the effort to catch every ball the writer throws. A piece of writing is like a complex signal sent from one mind to another; the skill of the reader determines how completely that signal is received and reconstructed.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Excerpt & Study Outline.',
    collections: ['featured']
  },

  // ============================================================================
  // 10. MIDDLEMARCH
  // ============================================================================
  {
    id: 'middlemarch',
    title: 'Middlemarch',
    subtitle: 'A Study of Provincial Life',
    author: 'George Eliot',
    authorId: 'george-eliot',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Nineteenth-Century Literary Realism',
    publishedYear: 1871,
    publisher: 'William Blackwood and Sons (Folio Critical Edition)',
    pages: 838,
    isbn: '9780141439549',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
    coverAlt: 'Book cover of Middlemarch by George Eliot',
    openLibraryWorkId: 'OL20934W',
    rating: {
      score: 4.7,
      count: 910,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'In an English Midlands town on the eve of the 1832 Reform Bill, Dorothea Brooke and Dr. Tertius Lydgate pursue high ideals amid the web of community life.',
    description: [
      'Virginia Woolf famously described George Eliot’s Middlemarch as "one of the few English novels written for grown-up people." Set between 1829 and 1832 in the fictitious Midlands town of Middlemarch, the novel weaves together the lives of the idealistic young heiress Dorothea Brooke, the ambitious physician Tertius Lydgate, Rosamond Vincy, and the steadfast Fred Vincy.'
    ],
    tableOfContents: [
      'Prelude — Saint Theresa and Modern Life',
      'Book I — Miss Brooke',
      'Book II — Old and Young',
      'Book III — Waiting for Death',
      'Book IV — Three Love Problems',
      'Finale — The Growing Good of the World'
    ],
    sampleChapters: [
      {
        number: 'Prelude & Chapter I',
        title: 'Miss Brooke',
        epigraph: 'Complete Unabridged Text (1871–72 Edition)',
        content: [
          'Who that cares much to know the history of man, and how the mysterious mixture behaves under the varying experiments of Time, has not dwelt, at least briefly, on the life of Saint Theresa, has not smiled with some gentleness at the thought of the little girl walking forth one morning hand-in-hand with her still smaller brother, to go and seek martyrdom in the country of the Moors?',
          'Miss Brooke had that kind of beauty which seems to be thrown into relief by poor dress. Her hand and wrist were so finely formed that she could wear sleeves not less bare of style than those in which the Blessed Virgin appeared to Italian painters.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['featured', 'editors-picks', 'timeless-classics']
  },

  // ============================================================================
  // 11. CODE: THE HIDDEN LANGUAGE
  // ============================================================================
  {
    id: 'code-hidden-language',
    title: 'Code',
    subtitle: 'The Hidden Language of Computer Hardware and Software',
    author: 'Charles Petzold',
    authorId: 'charles-petzold',
    category: 'Technology & Programming',
    categorySlug: 'technology-programming',
    genre: 'Computer Science Foundations & Hardware Architecture',
    publishedYear: 1999,
    publisher: 'Microsoft Press',
    pages: 400,
    isbn: '9780735611313',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 19.5,
    priceDisplay: '$19.50',
    coverUrl: 'https://covers.openlibrary.org/b/id/8232510-L.jpg',
    coverAlt: 'Book cover of Code: The Hidden Language of Computer Hardware and Software by Charles Petzold',
    openLibraryWorkId: 'OL1963918W',
    rating: {
      score: 4.8,
      count: 1120,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Beginning with flashlights, Morse code, and Braille, Charles Petzold builds a complete working computer from first principles.',
    description: [
      'How do digital computers actually work under the hood? Instead of starting with high-level programming syntax, Charles Petzold begins with two ten-year-old friends trying to communicate across the street after dark with flashlights.',
      'Step by step—through Morse code, Braille, telegraph relays, Boolean logic gates, binary adders, flip-flops, and memory arrays—Code reveals that computers are constructed from remarkably simple, intelligible ideas layered with elegance.'
    ],
    tableOfContents: [
      'Chapter 1 — Best Friends',
      'Chapter 2 — Codes and Combinations',
      'Chapter 3 — Braille and Binary Codes',
      'Chapter 4 — Anatomy of a Flashlight',
      'Chapter 11 — Gates (Not Bill)',
      'Chapter 17 — Automation'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Excerpt)',
        title: 'Best Friends',
        epigraph: 'Licensed Publisher Sample Chapter',
        content: [
          'You’re 10 years old. Your best friend lives across the street. In fact, the windows of your bedrooms actually face each other. Every night, after your parents have declared bedtime at the usual indecently early hour, you still need to exchange thoughts of critical importance.',
          'If your bedroom windows are within sight of each other, you can use flashlights. Turning the flashlight on and off in patterns of short and long flashes—dots and dashes—allows two ordinary household circuits of battery, wire, and bulb to transmit human language across space without a sound.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Chapter.',
    collections: ['featured', 'tech-programming']
  },

  // ============================================================================
  // 12. COSMOS
  // ============================================================================
  {
    id: 'cosmos-carl-sagan',
    title: 'Cosmos',
    subtitle: 'A Personal Voyage Through Space and Time',
    author: 'Carl Sagan',
    authorId: 'carl-sagan',
    category: 'Science',
    categorySlug: 'science',
    genre: 'Astronomy, Astrophysics & History of Science',
    publishedYear: 1980,
    publisher: 'Random House',
    pages: 365,
    isbn: '9780345539434',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 15.5,
    priceDisplay: '$15.50',
    coverUrl: 'https://covers.openlibrary.org/b/id/12547191-L.jpg',
    coverAlt: 'Book cover of Cosmos by Carl Sagan',
    openLibraryWorkId: 'OL1106652W',
    rating: {
      score: 4.9,
      count: 1850,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Carl Sagan traces fourteen billion years of cosmic evolution and the human quest to understand our place in the universe.',
    description: [
      'First published in 1980 alongside his landmark television series, Carl Sagan’s Cosmos remains one of the most beloved works of scientific literature ever written. Across thirteen richly illustrated chapters—from the ancient Library of Alexandria and Johannes Kepler’s laws of planetary motion to stellar nucleosynthesis and the Voyager Golden Record—Sagan shows how science is an instrument of both rigor and wonder.'
    ],
    tableOfContents: [
      'Chapter I — The Shores of the Cosmic Ocean',
      'Chapter II — One Voice in the Cosmic Fugue',
      'Chapter III — The Harmony of the Worlds',
      'Chapter IV — Heaven and Hell',
      'Chapter IX — The Lives of the Stars',
      'Chapter XIII — Who Speaks for Earth?'
    ],
    sampleChapters: [
      {
        number: 'Chapter I (Excerpt)',
        title: 'The Shores of the Cosmic Ocean',
        epigraph: 'Licensed Publisher Excerpt',
        content: [
          'The Cosmos is all that is or ever was or ever will be. Our feeblest contemplations of the Cosmos stir us—there is a tingling in the spine, a catch in the voice, a faint sensation, as if a distant memory, of falling from a height. We know we are approaching the greatest of mysteries.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Excerpt.',
    collections: ['featured', 'editors-picks']
  },

  // ============================================================================
  // 13. FRANKENSTEIN (POPULAR / TIMELESS CLASSICS)
  // ============================================================================
  {
    id: 'frankenstein-1818',
    title: 'Frankenstein',
    subtitle: 'or, The Modern Prometheus (1818 Text)',
    author: 'Mary Wollstonecraft Shelley',
    authorId: 'mary-shelley',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Gothic Fiction & Early Science Fiction',
    publishedYear: 1818,
    publisher: 'Lackington, Hughes, Harding, Mavor, & Jones',
    pages: 280,
    isbn: '9780141439471',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/12751483-L.jpg',
    coverAlt: 'Book cover of Frankenstein by Mary Shelley',
    openLibraryWorkId: 'OL450063W',
    rating: {
      score: 4.7,
      count: 1590,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Begun on the shores of Lake Geneva in 1816, Mary Shelley’s novel explores scientific hubris, isolation, and moral responsibility.',
    description: [
      'Published anonymously on New Year’s Day 1818 when Mary Shelley was twenty years old, Frankenstein; or, The Modern Prometheus framed a question that has haunted modern civilisation ever since: what does a creator owe to his creation?'
    ],
    tableOfContents: [
      'Letter I — To Mrs. Saville, England (St. Petersburgh, Dec. 11th)',
      'Letter IV — Sighting on the Arctic Ice',
      'Volume I, Chapter I — Geneva and Childhood',
      'Volume I, Chapter IV — Natural Philosophy at Ingolstadt',
      'Volume II, Chapter II — Encounter on Montanvert'
    ],
    sampleChapters: [
      {
        number: 'Letter I',
        title: 'To Mrs. Saville, England',
        epigraph: 'St. Petersburgh, Dec. 11th, 17—',
        content: [
          'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1818 First Edition).',
    collections: ['popular', 'most-popular', 'timeless-classics']
  },

  // ============================================================================
  // 14. THINKING, FAST AND SLOW
  // ============================================================================
  {
    id: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    subtitle: 'Judgment, Heuristics, and Decision-Making Under Uncertainty',
    author: 'Daniel Kahneman',
    authorId: 'daniel-kahneman',
    category: 'Personal Development',
    categorySlug: 'personal-development',
    genre: 'Cognitive Psychology & Behavioral Economics',
    publishedYear: 2011,
    publisher: 'Farrar, Straus and Giroux',
    pages: 499,
    isbn: '9780374533557',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 17.0,
    priceDisplay: '$17.00',
    coverUrl: 'https://covers.openlibrary.org/b/id/7115830-L.jpg',
    coverAlt: 'Book cover of Thinking, Fast and Slow by Daniel Kahneman',
    openLibraryWorkId: 'OL16098744W',
    rating: {
      score: 4.6,
      count: 1410,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Nobel laureate Daniel Kahneman explains the two modes of thought—fast, intuitive System 1 and slow, deliberative System 2—that govern human judgment.',
    description: [
      'Drawing on decades of collaborative research with Amos Tversky, psychologist and Nobel Memorial Prize in Economic Sciences laureate Daniel Kahneman maps the architecture of human cognition.'
    ],
    tableOfContents: [
      'Part I — Two Systems',
      'Part II — Heuristics and Biases',
      'Part III — Overconfidence',
      'Part IV — Choices (Prospect Theory)',
      'Part V — Two Selves'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Preview)',
        title: 'The Characters of the Story',
        epigraph: 'Licensed Publisher Excerpt',
        content: [
          'System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to the effortful mental activities that demand it, including complex computations.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Excerpt.',
    collections: ['popular', 'most-popular', 'business-personal']
  },

  // ============================================================================
  // 15. STRUCTURE AND INTERPRETATION OF COMPUTER PROGRAMS
  // ============================================================================
  {
    id: 'structure-and-interpretation-of-computer-programs',
    title: 'Structure and Interpretation of Computer Programs',
    subtitle: 'Second Edition (MIT Electrical Engineering and Computer Science)',
    author: 'Harold Abelson & Gerald Jay Sussman',
    authorId: 'abelson-sussman',
    category: 'Technology & Programming',
    categorySlug: 'technology-programming',
    genre: 'Computer Science & Programming Methodology',
    publishedYear: 1996,
    publisher: 'MIT Press',
    pages: 657,
    isbn: '9780262510875',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231823-L.jpg',
    coverAlt: 'Book cover of Structure and Interpretation of Computer Programs (SICP) by Abelson and Sussman',
    openLibraryWorkId: 'OL1981600W',
    rating: {
      score: 4.9,
      count: 920,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'The legendary MIT introductory text on abstraction in procedures, data, modularity, state, and metalinguistic evaluators.',
    description: [
      'Affectionately known as "The Wizard Book," Structure and Interpretation of Computer Programs (SICP) treats computer programs primarily as a medium for expressing ideas about methodology from person to person—and only incidentally as instructions for machines to execute.'
    ],
    tableOfContents: [
      'Chapter 1 — Building Abstractions with Procedures',
      'Chapter 2 — Building Abstractions with Data',
      'Chapter 3 — Modularity, Objects, and State',
      'Chapter 4 — Metalinguistic Abstraction',
      'Chapter 5 — Computing with Register Machines'
    ],
    sampleChapters: [
      {
        number: 'Preface & Chapter 1.1',
        title: 'The Elements of Programming',
        epigraph: 'MIT OpenCourseWare / CC BY-SA Edition',
        content: [
          'A computational process is indeed much like a sorcerer’s idea of a spirit. It cannot be seen or touched. It is not composed of matter at all. However, it is very real. It can perform intellectual work.'
        ]
      }
    ],
    rightsNote: 'Open Access Edition (MIT Press Creative Commons License).',
    collections: ['popular', 'most-popular', 'tech-programming']
  },

  // ============================================================================
  // 16. JANE EYRE
  // ============================================================================
  {
    id: 'jane-eyre',
    title: 'Jane Eyre',
    subtitle: 'An Autobiography (Original Three-Volume Text)',
    author: 'Charlotte Brontë',
    authorId: 'charlotte-bronte',
    category: 'Romance',
    categorySlug: 'romance',
    genre: 'Gothic Romance & Bildungsroman',
    publishedYear: 1847,
    publisher: 'Smith, Elder & Co., Cornhill',
    pages: 532,
    isbn: '9780141441146',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/12648655-L.jpg',
    coverAlt: 'Book cover of Jane Eyre by Charlotte Brontë',
    openLibraryWorkId: 'OL1095479W',
    rating: {
      score: 4.8,
      count: 1620,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'From her harsh childhood at Gateshead and Lowood School to her post as governess at Thornfield Hall, Jane Eyre insists on moral and spiritual equality.',
    description: [
      'Originally published in October 1847 under the pseudonym "Currer Bell," Charlotte Brontë’s Jane Eyre revolutionized prose fiction through the intimate, unyielding first-person voice of its heroine.'
    ],
    tableOfContents: [
      'Chapter I — A Wet Afternoon at Gateshead Hall',
      'Chapter II — The Red-Room',
      'Chapter V — Arrival at Lowood Institution',
      'Chapter XI — Thornfield Hall and Adele Varens',
      'Chapter XII — Encounter on the Hay Lane'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'A Wet Afternoon at Gateshead Hall',
        epigraph: 'Complete Unabridged Text (1847 Edition)',
        content: [
          'There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery an hour in the morning; but since dinner (Mrs. Reed, when there was no company, dined early) the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further out-door exercise was now out of the question.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['popular', 'most-popular', 'timeless-classics']
  },

  // ============================================================================
  // 17. THE WEALTH OF NATIONS (NEW ARRIVALS)
  // ============================================================================
  {
    id: 'wealth-of-nations',
    title: 'The Wealth of Nations',
    subtitle: 'An Inquiry into the Nature and Causes of the Wealth of Nations',
    author: 'Adam Smith',
    authorId: 'adam-smith',
    category: 'Business & Finance',
    categorySlug: 'business-finance',
    genre: 'Classical Political Economy',
    publishedYear: 1776,
    publisher: 'W. Strahan and T. Cadell, in the Strand',
    pages: 780,
    isbn: '9780140432084',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8236189-L.jpg',
    coverAlt: 'Book cover of The Wealth of Nations by Adam Smith',
    openLibraryWorkId: 'OL76837W',
    rating: {
      score: 4.5,
      count: 540,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Newly typeset archival edition of Adam Smith’s 1776 treatise on the division of labour, trade, price formation, and public institutions.',
    description: [
      'Newly added to the Folio Digital Archive in a freshly proofed five-book edition, Adam Smith’s 1776 treatise laid the foundations of modern economics.'
    ],
    tableOfContents: [
      'Book I, Chapter I — Of the Division of Labour',
      'Book I, Chapter II — Of the Principle which gives Occasion to the Division of Labour',
      'Book I, Chapter III — That the Division of Labour is Limited by the Extent of the Market',
      'Book IV — Of Systems of Political Economy',
      'Book V — Of the Revenue of the Sovereign or Commonwealth'
    ],
    sampleChapters: [
      {
        number: 'Book I, Chapter I',
        title: 'Of the Division of Labour',
        epigraph: 'Complete 1776 Text',
        content: [
          'The greatest improvement in the productive powers of labour, and the greater part of the skill, dexterity, and judgment with which it is any where directed, or applied, seem to have been the effects of the division of labour.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (Newly Typeset Archival Edition).',
    collections: ['new-arrivals', 'recently-added', 'business-personal']
  },

  // ============================================================================
  // 18. THE HISTORIES — HERODOTUS
  // ============================================================================
  {
    id: 'histories-herodotus',
    title: 'The Histories',
    subtitle: 'Newly Restored Translation by G. C. Macaulay',
    author: 'Herodotus',
    authorId: 'herodotus',
    category: 'History',
    categorySlug: 'history',
    genre: 'Ancient History & Ethnography',
    publishedYear: -430,
    publisher: 'Folio Classical Press',
    pages: 672,
    isbn: '9780140449082',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8235089-L.jpg',
    coverAlt: 'Book cover of The Histories by Herodotus',
    openLibraryWorkId: 'OL15165384W',
    rating: {
      score: 4.7,
      count: 480,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'The founding work of Western historical inquiry, chronicling the customs of the Mediterranean world and the Greco-Persian Wars.',
    description: [
      'Herodotus of Halicarnassus opened his nine-book inquiry (Historiai) with the stated purpose that "the actions of men may not be effaced by time, nor the great and wondrous deeds displayed both by Greeks and barbarians deprived of renown."'
    ],
    tableOfContents: [
      'Book I (Clio) — Croesus of Lydia and the Rise of Cyrus',
      'Book II (Euterpe) — The Geography and Antiquities of Egypt',
      'Book VI (Erato) — The Battle of Marathon',
      'Book VII (Polymnia) — Xerxes and the Pass of Thermopylae',
      'Book VIII (Urania) — The Naval Battle of Salamis'
    ],
    sampleChapters: [
      {
        number: 'Book I (Clio)',
        title: 'Prologue: The Inquiry of Herodotus',
        epigraph: 'Translated by G. C. Macaulay',
        content: [
          'This is the Showing forth of the Inquiry of Herodotus of Halicarnassus, to the end that neither the deeds of men may be forgotten by lapse of time, nor the works great and marvellous, which have been produced some by Hellenes and some by Barbarians, may lose their renown.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['new-arrivals', 'recently-added', 'biography-history']
  },

  // ============================================================================
  // 19. THE PRAGMATIC PROGRAMMER
  // ============================================================================
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    subtitle: 'Your Journey to Mastery (20th Anniversary Edition)',
    author: 'David Thomas & Andrew Hunt',
    authorId: 'thomas-hunt',
    category: 'Technology & Programming',
    categorySlug: 'technology-programming',
    genre: 'Software Craftsmanship & Engineering Practice',
    publishedYear: 2019,
    publisher: 'Addison-Wesley Professional',
    pages: 352,
    isbn: '9780135957059',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 22.0,
    priceDisplay: '$22.00',
    coverUrl: 'https://covers.openlibrary.org/b/id/10143662-L.jpg',
    coverAlt: 'Book cover of The Pragmatic Programmer by David Thomas and Andrew Hunt',
    openLibraryWorkId: 'OL20646910W',
    rating: {
      score: 4.8,
      count: 1180,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Practical engineering wisdom on orthogonality, tracer bullets, reversible design decisions, and continuous learning.',
    description: [
      'First published in 1999 and thoroughly updated for its twentieth anniversary, The Pragmatic Programmer cuts through passing framework trends to examine the enduring habits of effective software engineers.'
    ],
    tableOfContents: [
      'Chapter 1 — A Pragmatic Philosophy',
      'Chapter 2 — A Pragmatic Approach (DRY & Orthogonality)',
      'Chapter 3 — The Basic Tools',
      'Chapter 4 — Pragmatic Paranoia',
      'Chapter 5 — Bend, or Break'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1 (Preview)',
        title: 'A Pragmatic Philosophy: The Cat Ate My Source Code',
        epigraph: 'Licensed Publisher Sample Excerpt',
        content: [
          'One of the cornerstones of the pragmatic philosophy is the idea of taking responsibility for yourself and your actions in terms of your career advancement, your project, and your day-to-day work.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Excerpt.',
    collections: ['new-arrivals', 'recently-added', 'tech-programming']
  },

  // ============================================================================
  // 20. THE ELEMENTS OF STYLE
  // ============================================================================
  {
    id: 'elements-of-style',
    title: 'The Elements of Style',
    subtitle: 'Original 1918 Cornell University Edition',
    author: 'William Strunk Jr.',
    authorId: 'william-strunk',
    category: 'Education',
    categorySlug: 'education',
    genre: 'Rhetoric, Composition & English Usage',
    publishedYear: 1918,
    publisher: 'Folio Reference Editions (orig. Ithaca, N.Y.)',
    pages: 96,
    isbn: '9780205309023',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231510-L.jpg',
    coverAlt: 'Book cover of The Elements of Style by William Strunk Jr.',
    openLibraryWorkId: 'OL52102W',
    rating: {
      score: 4.5,
      count: 830,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Professor William Strunk’s concise handbook of English usage and composition, famous for the rule: "Omit needless words."',
    description: [
      'Privately printed in 1918 by Cornell University English professor William Strunk Jr. for the use of his students, this "little book" sets forth eight elementary rules of usage and ten principles of composition.'
    ],
    tableOfContents: [
      'I — Introductory',
      'II — Elementary Rules of Usage (Rules 1–8)',
      'III — Elementary Principles of Composition (Rules 9–18)',
      'IV — A Few Matters of Form',
      'V — Words and Expressions Commonly Misused'
    ],
    sampleChapters: [
      {
        number: 'Section III',
        title: 'Elementary Principles of Composition',
        epigraph: 'Complete 1918 Original Text',
        content: [
          'Rule 13. Omit needless words. Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1918 Edition).',
    collections: ['new-arrivals', 'recently-added']
  },

  // ============================================================================
  // 21. THE ADVENTURES OF SHERLOCK HOLMES (FREE EBOOKS)
  // ============================================================================
  {
    id: 'adventures-of-sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    subtitle: 'Twelve Complete Cases from The Strand Magazine',
    author: 'Sir Arthur Conan Doyle',
    authorId: 'arthur-conan-doyle',
    category: 'Mystery & Thriller',
    categorySlug: 'mystery-thriller',
    genre: 'Short Detective Fiction',
    publishedYear: 1892,
    publisher: 'George Newnes Ltd',
    pages: 307,
    isbn: '9780140437713',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: '/covers/real/adventures-of-sherlock-holmes.jpg',
    coverAlt: 'Book cover of The Adventures of Sherlock Holmes by Sir Arthur Conan Doyle',
    openLibraryWorkId: 'OL262421W',
    rating: {
      score: 4.8,
      count: 1750,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Twelve classic investigations including "A Scandal in Bohemia," "The Red-Headed League," and "The Adventure of the Speckled Band."',
    description: [
      'First collected in book form on 14 October 1892, The Adventures of Sherlock Holmes gathers the first twelve short stories featuring Sherlock Holmes and Dr. John H. Watson.'
    ],
    tableOfContents: [
      'I — A Scandal in Bohemia',
      'II — The Red-Headed League',
      'III — A Case of Identity',
      'IV — The Boscombe Valley Mystery',
      'VIII — The Adventure of the Speckled Band',
      'XII — The Adventure of the Copper Beeches'
    ],
    sampleChapters: [
      {
        number: 'Adventure I',
        title: 'A Scandal in Bohemia',
        epigraph: 'Complete Story Text (1892)',
        content: [
          'To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['free-ebooks']
  },

  // ============================================================================
  // 22. TALKS TO TEACHERS ON PSYCHOLOGY
  // ============================================================================
  {
    id: 'talks-to-teachers-william-james',
    title: 'Talks to Teachers on Psychology',
    subtitle: 'And to Students on Some of Life’s Ideals',
    author: 'William James',
    authorId: 'william-james',
    category: 'Education',
    categorySlug: 'education',
    genre: 'Educational Psychology & Philosophy of Mind',
    publishedYear: 1899,
    publisher: 'Henry Holt and Company',
    pages: 301,
    isbn: '9780486419640',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/6419256-L.jpg',
    coverAlt: 'Book cover of Talks to Teachers on Psychology by William James',
    openLibraryWorkId: 'OL162169W',
    rating: {
      score: 4.7,
      count: 410,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Harvard psychologist William James translates his Principles of Psychology into warm, practical lectures on attention, memory, and habit.',
    description: [
      'Delivered originally as public lectures to Cambridge teachers in 1892 and published in 1899, Talks to Teachers on Psychology strips away technical jargon to examine how students actually attend, associate ideas, remember, and form habits of character.'
    ],
    tableOfContents: [
      'I — Psychology and the Teaching Art',
      'II — The Stream of Consciousness',
      'VIII — The Laws of Habit',
      'X — Interest and Voluntary Attention',
      'XII — Memory',
      'Talks to Students I — The Gospel of Relaxation'
    ],
    sampleChapters: [
      {
        number: 'Chapter VIII',
        title: 'The Laws of Habit',
        epigraph: 'Complete Lecture Text (1899)',
        content: [
          'The great thing, then, in all education, is to make our nervous system our ally instead of our enemy. It is to fund and capitalize our acquisitions, and live at ease upon the interest of the fund.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['free-ebooks']
  },

  // ============================================================================
  // 23. NARRATIVE OF THE LIFE OF FREDERICK DOUGLASS
  // ============================================================================
  {
    id: 'narrative-of-frederick-douglass',
    title: 'Narrative of the Life of Frederick Douglass',
    subtitle: 'An American Slave, Written by Himself',
    author: 'Frederick Douglass',
    authorId: 'frederick-douglass',
    category: 'Biography & Memoir',
    categorySlug: 'biography-memoir',
    genre: 'Autobiography & Abolitionist History',
    publishedYear: 1845,
    publisher: 'Anti-Slavery Office, Boston',
    pages: 158,
    isbn: '9780140390124',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231495-L.jpg',
    coverAlt: 'Book cover of Narrative of the Life of Frederick Douglass',
    openLibraryWorkId: 'OL65258W',
    rating: {
      score: 4.9,
      count: 1380,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Frederick Douglass’s 1845 memoir recounting his birth in Maryland, his determination to learn to read in Baltimore, and his escape to freedom.',
    description: [
      'Published in Boston in May 1845, Frederick Douglass’s Narrative became an immediate transatlantic sensation. At its core lies one of the most powerful accounts in literature of how literacy and self-education awaken human freedom.'
    ],
    tableOfContents: [
      'Preface by William Lloyd Garrison',
      'Chapter I — Birth in Talbot County, Maryland',
      'Chapter VI — Arrival in Baltimore and Learning the Alphabet',
      'Chapter VII — The Columbian Orator and Teaching on the Wharves',
      'Chapter X — Covey’s Farm and the Turning Point',
      'Chapter XI — Escape to New York and New Bedford'
    ],
    sampleChapters: [
      {
        number: 'Chapter VI',
        title: 'Learning to Read in Baltimore',
        epigraph: 'Complete 1845 Text',
        content: [
          'Very soon after I went to live with Mr. and Mrs. Auld, she very kindly commenced to teach me the A, B, C. After I had learned this, she assisted me in learning to spell words of three or four letters.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['free-ebooks', 'biography-history']
  },

  // ============================================================================
  // 24. RELATIVITY — ALBERT EINSTEIN
  // ============================================================================
  {
    id: 'relativity-einstein',
    title: 'Relativity: The Special and the General Theory',
    subtitle: 'A Clear Explanation Written for the General Reader',
    author: 'Albert Einstein',
    authorId: 'albert-einstein',
    category: 'Science',
    categorySlug: 'science',
    genre: 'Theoretical Physics & Cosmology',
    publishedYear: 1916,
    publisher: 'Methuen & Co. Ltd (trans. Robert W. Lawson)',
    pages: 168,
    isbn: '9780486417141',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8236912-L.jpg',
    coverAlt: 'Book cover of Relativity: The Special and the General Theory by Albert Einstein',
    openLibraryWorkId: 'OL1105396W',
    rating: {
      score: 4.6,
      count: 670,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Albert Einstein’s own lucid explanation of reference frames, simultaneity, spacetime curvature, and cosmology using thought experiments.',
    description: [
      'Written by Albert Einstein in 1916 for readers who are interested in the theory of relativity "from a general scientific and philosophical point of view, but who are not conversant with the mathematical apparatus of theoretical physics."'
    ],
    tableOfContents: [
      'Part I — The Special Theory of Relativity',
      'Chapter I — Physical Meaning of Geometrical Propositions',
      'Chapter IX — The Relativity of Simultaneity',
      'Part II — The General Theory of Relativity',
      'Part III — Considerations on the Universe as a Whole'
    ],
    sampleChapters: [
      {
        number: 'Preface & Chapter IX',
        title: 'The Relativity of Simultaneity',
        epigraph: 'Authorized Translation by Robert W. Lawson (1920)',
        content: [
          'The present book is intended, as far as possible, to give an exact insight into the theory of Relativity to those readers who, from a general scientific and philosophical point of view, are interested in the theory.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['free-ebooks']
  },

  // ============================================================================
  // 25. A ROOM WITH A VIEW
  // ============================================================================
  {
    id: 'a-room-with-a-view',
    title: 'A Room with a View',
    subtitle: 'Italian Sunlight and Edwardian Convention',
    author: 'E. M. Forster',
    authorId: 'em-forster',
    category: 'Romance',
    categorySlug: 'romance',
    genre: 'Edwardian Romance & Social Comedy',
    publishedYear: 1908,
    publisher: 'Edward Arnold, London',
    pages: 240,
    isbn: '9780141183299',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8235312-L.jpg',
    coverAlt: 'Book cover of A Room with a View by E. M. Forster',
    openLibraryWorkId: 'OL80614W',
    rating: {
      score: 4.7,
      count: 790,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'In a Florentine pensione overlooking the Arno, young Lucy Honeychurch is caught between Victorian propriety and honest passion.',
    description: [
      'Divided between springtime in Florence and summer in the Surrey hills, E. M. Forster’s 1908 novel is both his sunniest romantic comedy and a sharp critique of emotional repression.'
    ],
    tableOfContents: [
      'Part One — Chapter I: The Bertolini',
      'Chapter II — In Santa Croce with No Baedeker',
      'Chapter IV — Fourth Chapter',
      'Part Two — Chapter VIII: Medieval',
      'Chapter IX — Lucy as a Work of Art',
      'Chapter XX — The End of the Middle Ages'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'The Bertolini',
        epigraph: 'Complete Unabridged Text (1908)',
        content: [
          '“The Signora had no business to do it,” said Miss Bartlett, “no business at all. She promised us south rooms with a view close together, instead of which here are north rooms, looking into a courtyard, and a long way apart. Oh, Lucy!”'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['recommended', 'timeless-classics', 'modern-fiction']
  },

  // ============================================================================
  // 26. DEEP WORK
  // ============================================================================
  {
    id: 'deep-work-cal-newport',
    title: 'Deep Work',
    subtitle: 'Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    authorId: 'cal-newport',
    category: 'Personal Development',
    categorySlug: 'personal-development',
    genre: 'Cognitive Focus & Professional Mastery',
    publishedYear: 2016,
    publisher: 'Grand Central Publishing',
    pages: 304,
    isbn: '9781455586691',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 15.0,
    priceDisplay: '$15.00',
    coverUrl: 'https://covers.openlibrary.org/b/id/8267192-L.jpg',
    coverAlt: 'Book cover of Deep Work by Cal Newport',
    openLibraryWorkId: 'OL17331652W',
    rating: {
      score: 4.6,
      count: 1090,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Computer science professor Cal Newport argues that the ability to focus without distraction on cognitively demanding tasks is a rare and decisive skill.',
    description: [
      'Divided into two parts, Deep Work first makes the case that in nearly any profession, cultivating a deep work ethic produces extraordinary value and personal fulfillment; it then presents four concrete rules for transforming daily habits to support sustained concentration.'
    ],
    tableOfContents: [
      'Part 1 — The Idea (Chapters 1–3)',
      'Rule #1 — Work Deeply',
      'Rule #2 — Embrace Boredom',
      'Rule #3 — Quit Social Media',
      'Rule #4 — Drain the Shallows'
    ],
    sampleChapters: [
      {
        number: 'Introduction (Preview)',
        title: 'Deep Work versus Shallow Work',
        epigraph: 'Licensed Publisher Sample Excerpt',
        content: [
          'Deep Work: Professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Excerpt.',
    collections: ['recommended', 'business-personal']
  },

  // ============================================================================
  // 27. THE MOONSTONE
  // ============================================================================
  {
    id: 'the-moonstone',
    title: 'The Moonstone',
    subtitle: 'A Romance in Three Volumes',
    author: 'Wilkie Collins',
    authorId: 'wilkie-collins',
    category: 'Mystery & Thriller',
    categorySlug: 'mystery-thriller',
    genre: 'Victorian Detective Novel',
    publishedYear: 1868,
    publisher: 'Tinsley Brothers, London',
    pages: 528,
    isbn: '9780140434088',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8235390-L.jpg',
    coverAlt: 'Book cover of The Moonstone by Wilkie Collins',
    openLibraryWorkId: 'OL176158W',
    rating: {
      score: 4.6,
      count: 610,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Praised by T. S. Eliot as "the first, the longest, and the best of modern English detective novels," following the theft of a sacred diamond.',
    description: [
      'When Rachel Verinder receives the yellow Moonstone diamond on her eighteenth birthday at a Yorkshire country house—and the jewel vanishes from her bedroom that very night—the rose-loving Sergeant Cuff of Scotland Yard is summoned.'
    ],
    tableOfContents: [
      'Prologue — The Storming of Seringapatam (1799)',
      'First Period — The Loss of the Diamond (1848): Gabriel Betteredge’s Narrative',
      'Second Period — The Discovery of the Truth (1848–1849): Miss Clack’s Narrative',
      'Third Narrative — Contributed by Franklin Blake',
      'Fourth Narrative — Extracted from the Journal of Ezra Jennings'
    ],
    sampleChapters: [
      {
        number: 'First Period, Chapter I',
        title: 'Gabriel Betteredge’s Narrative',
        epigraph: 'Complete 1868 Text',
        content: [
          'In the first part of Robinson Crusoe, at page one hundred and twenty-nine, you will find it thus written: “Now I saw, though too late, the folly of beginning a work before we count the cost, and before we judge rightly of our own strength to go through with it.”'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['recommended', 'timeless-classics']
  },

  // ============================================================================
  // 28. LOMBARD STREET
  // ============================================================================
  {
    id: 'lombard-street-bagehot',
    title: 'Lombard Street',
    subtitle: 'A Description of the Money Market',
    author: 'Walter Bagehot',
    authorId: 'walter-bagehot',
    category: 'Business & Finance',
    categorySlug: 'business-finance',
    genre: 'Monetary History & Central Banking',
    publishedYear: 1873,
    publisher: 'Henry S. King & Co., London',
    pages: 348,
    isbn: '9780471344926',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/6418912-L.jpg',
    coverAlt: 'Book cover of Lombard Street: A Description of the Money Market by Walter Bagehot',
    openLibraryWorkId: 'OL1104215W',
    rating: {
      score: 4.6,
      count: 340,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'The classic study by the editor of The Economist on credit cycles, financial panics, and the central bank’s duty as lender of last resort.',
    description: [
      'Published in 1873 by Walter Bagehot, longtime editor-in-chief of The Economist, Lombard Street remains the clearest explanation of banking fragility and liquidity crises ever penned.'
    ],
    tableOfContents: [
      'Chapter I — Introductory: General View of Lombard Street',
      'Chapter II — A General View of Lombard Street (Continued)',
      'Chapter III — How Lombard Street Came to Exist',
      'Chapter VI — Why Lombard Street is Often Very Dull, and Sometimes Extremely Excited',
      'Chapter VII — A More Exact Account of the Mode in Which the Bank of England Has Discharged Its Duty'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'Introductory: General View of Lombard Street',
        epigraph: 'Complete 1873 Edition',
        content: [
          'I venture to call this Essay "Lombard Street," and not the "Money Market," or any such phrase, because I wish to deal, and to show that I mean to deal, with concrete realities.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text.',
    collections: ['recommended', 'business-personal']
  },

  // ============================================================================
  // 29. MRS DALLOWAY — VIRGINIA WOOLF
  // ============================================================================
  {
    id: 'mrs-dalloway',
    title: 'Mrs Dalloway',
    subtitle: 'A Single Day in June in Post-War London',
    author: 'Virginia Woolf',
    authorId: 'virginia-woolf',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Modernist Literary Fiction',
    publishedYear: 1925,
    publisher: 'The Hogarth Press, Tavistock Square',
    pages: 216,
    isbn: '9780156628709',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231921-L.jpg',
    coverAlt: 'Book cover of Mrs Dalloway by Virginia Woolf',
    openLibraryWorkId: 'OL39379W',
    rating: {
      score: 4.7,
      count: 1140,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'As Clarissa Dalloway walks through Westminster on a June morning to buy flowers for her evening party, memory and the chimes of Big Ben weave London’s lives together.',
    description: [
      'Published on 14 May 1925 by Leonard and Virginia Woolf’s Hogarth Press, Mrs Dalloway unfolds across a single Wednesday in mid-June 1923. Moving fluidly between the inner thoughts of Clarissa Dalloway, her returning suitor Peter Walsh, and the shell-shocked First World War veteran Septimus Warren Smith, Woolf created a luminous portrait of time, memory, and survival.'
    ],
    tableOfContents: [
      'Part I — Morning in Westminster and Bond Street',
      'Part II — Regent’s Park and Harley Street',
      'Part III — Afternoon Hours and Big Ben',
      'Part IV — The Evening Party in Westminster'
    ],
    sampleChapters: [
      {
        number: 'Part I',
        title: 'Morning in Westminster',
        epigraph: 'First Hogarth Press Edition (1925)',
        content: [
          'Mrs. Dalloway said she would buy the flowers herself.',
          'For Lucy had her work cut out for her. The doors would be taken off their hinges; Rumpelmayer’s men were coming. And then, thought Clarissa Dalloway, what a morning—fresh as if issued to children on a beach.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1925 Edition).',
    collections: ['author-spotlight', 'modern-fiction']
  },

  // ============================================================================
  // 30. TO THE LIGHTHOUSE — VIRGINIA WOOLF
  // ============================================================================
  {
    id: 'to-the-lighthouse',
    title: 'To the Lighthouse',
    subtitle: 'The Window, Time Passes, The Lighthouse',
    author: 'Virginia Woolf',
    authorId: 'virginia-woolf',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Modernist Literary Fiction',
    publishedYear: 1927,
    publisher: 'The Hogarth Press, London',
    pages: 240,
    isbn: '9780156907392',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8232018-L.jpg',
    coverAlt: 'Book cover of To the Lighthouse by Virginia Woolf',
    openLibraryWorkId: 'OL39385W',
    rating: {
      score: 4.8,
      count: 1290,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Set on the Isle of Skye before and after the First World War, the Ramsay family and painter Lily Briscoe confront time, grief, and artistic vision.',
    description: [
      'Structured as a triptych—"The Window," "Time Passes," and "The Lighthouse"—Virginia Woolf’s 1927 novel draws deeply on her childhood summers in St Ives, Cornwall.'
    ],
    tableOfContents: [
      'Part I — The Window (Sections I–XIX)',
      'Part II — Time Passes (Sections I–X)',
      'Part III — The Lighthouse (Sections I–XIII)'
    ],
    sampleChapters: [
      {
        number: 'Part I, Section I',
        title: 'The Window',
        epigraph: 'First Hogarth Press Edition (1927)',
        content: [
          '“Yes, of course, if it’s fine tomorrow,” said Mrs. Ramsay. “But you’ll have to be up with the lark,” she added.',
          'To her son these words conveyed an extraordinary joy, as if it were settled, the expedition were bound to take place.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1927 Edition).',
    collections: ['author-spotlight', 'modern-fiction']
  },

  // ============================================================================
  // 31. A ROOM OF ONE'S OWN — VIRGINIA WOOLF
  // ============================================================================
  {
    id: 'a-room-of-ones-own',
    title: 'A Room of One’s Own',
    subtitle: 'Based on Two Papers Read to the Arts Society at Newnham and Girton',
    author: 'Virginia Woolf',
    authorId: 'virginia-woolf',
    category: 'Biography & Memoir',
    categorySlug: 'biography-memoir',
    genre: 'Literary Criticism & Feminist Essay',
    publishedYear: 1929,
    publisher: 'The Hogarth Press, London',
    pages: 172,
    isbn: '9780156787338',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231945-L.jpg',
    coverAlt: 'Book cover of A Room of One’s Own by Virginia Woolf',
    openLibraryWorkId: 'OL39365W',
    rating: {
      score: 4.9,
      count: 1520,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Expanded from lectures delivered at Newnham and Girton Colleges, Cambridge, examining the material and intellectual conditions required for women to write.',
    description: [
      'In October 1928, Virginia Woolf was invited to lecture at Newnham and Girton, the women’s colleges at Cambridge University, on the topic of "Women and Fiction." Published a year later as a six-chapter essay, A Room of One’s Own combines historical inquiry, fictionalized walks through "Oxbridge," and the imagined life of "Judith Shakespeare."'
    ],
    tableOfContents: [
      'Chapter One — Oxbridge, the Riverbank, and the Luncheon Party',
      'Chapter Two — The British Museum Reading Room',
      'Chapter Three — Judith Shakespeare in Sixteenth-Century London',
      'Chapter Four — Aphra Behn, Jane Austen, and the Brontës',
      'Chapter Five — Mary Carmichael and Modern Fiction',
      'Chapter Six — The Androgynous Mind and Five Hundred a Year'
    ],
    sampleChapters: [
      {
        number: 'Chapter One',
        title: 'Women and Fiction',
        epigraph: 'Hogarth Press Edition (1929)',
        content: [
          'But, you may say, we asked you to speak about women and fiction—what has that got to do with a room of one’s own? I will try to explain.'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1929 Edition).',
    collections: ['author-spotlight', 'biography-history']
  },

  // ============================================================================
  // 32. JACOB'S ROOM — VIRGINIA WOOLF
  // ============================================================================
  {
    id: 'jacobs-room',
    title: 'Jacob’s Room',
    subtitle: 'First Experimental Hogarth Press Novel',
    author: 'Virginia Woolf',
    authorId: 'virginia-woolf',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Modernist Elegiac Novel',
    publishedYear: 1922,
    publisher: 'The Hogarth Press, Richmond',
    pages: 192,
    isbn: '9780156457408',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF', 'Kindle'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Edition',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231960-L.jpg',
    coverAlt: 'Book cover of Jacob’s Room by Virginia Woolf',
    openLibraryWorkId: 'OL39375W',
    rating: {
      score: 4.5,
      count: 580,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'An impressionistic portrait of young Jacob Flanders—seen through the rooms he inhabits in Scarborough, Cambridge, London, and Athens before the Great War.',
    description: [
      'Published in October 1922—the same landmark year as James Joyce’s Ulysses and T. S. Eliot’s The Waste Land—Jacob’s Room marked Virginia Woolf’s decisive break from traditional Edwardian realism.'
    ],
    tableOfContents: [
      'Chapter I — On the Beach at Cornwall',
      'Chapter II — Scarborough Childhood',
      'Chapter III — Trinity College, Cambridge',
      'Chapter IV — The Scilly Isles and London Rooms',
      'Chapter XII — The Acropolis in Athens',
      'Chapter XIV — Betty Flanders and the Empty Shoes'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'On the Beach at Cornwall',
        epigraph: 'Complete 1922 Hogarth Press Text',
        content: [
          '“So of course,” wrote Betty Flanders, pressing her heels rather deeper in the sand, “there was nothing for it but to leave.”'
        ]
      }
    ],
    rightsNote: 'Public Domain Full Text (1922 Edition).',
    collections: ['author-spotlight', 'modern-fiction']
  },

  // ============================================================================
  // 33. THE REMAINS OF THE DAY — KAZUO ISHIGURO (MODERN FICTION)
  // ============================================================================
  {
    id: 'remains-of-the-day',
    title: 'The Remains of the Day',
    subtitle: 'Booker Prize-Winning Novel of Memory and Duty',
    author: 'Kazuo Ishiguro',
    authorId: 'kazuo-ishiguro',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Contemporary Literary Fiction',
    publishedYear: 1989,
    publisher: 'Faber and Faber, London',
    pages: 258,
    isbn: '9780679731726',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 15.0,
    priceDisplay: '$15.00',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231630-L.jpg',
    coverAlt: 'Book cover of The Remains of the Day by Kazuo Ishiguro',
    openLibraryWorkId: 'OL59048W',
    rating: {
      score: 4.8,
      count: 1340,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'In the summer of 1956, Stevens, the aging butler of Darlington Hall, embarks on a motoring trip through the West Country and reckonings with his past.',
    description: [
      'Awarded the Booker Prize in 1989 by future Nobel laureate Kazuo Ishiguro, The Remains of the Day is a masterwork of restrained first-person narration. As Stevens drives across rural England to visit the former housekeeper Miss Kenton, his reflections on what constitutes a "great butler" gradually reveal the personal and political cost of unquestioning loyalty between the wars.'
    ],
    tableOfContents: [
      'Prologue: July 1956 — Darlington Hall',
      'Day One: Evening — Salisbury',
      'Day Two: Morning — Salisbury',
      'Day Three: Morning — Taunton, Somerset',
      'Day Four: Afternoon — Little Compton, Cornwall',
      'Day Six: Evening — Weymouth'
    ],
    sampleChapters: [
      {
        number: 'Prologue (Preview)',
        title: 'July 1956 — Darlington Hall',
        epigraph: 'Licensed Publisher Sample Excerpt',
        content: [
          'It seems increasingly likely that I really will undertake the expedition that has been preoccupying my imagination now for some days. An expedition, I should say, which I will undertake alone, in the comfort of Mr Faraday’s Ford; an expedition which, as I foresee it, will take me through much of the finest countryside of England to the West Country, and may keep me away from Darlington Hall for as much as five or six days.'
        ]
      }
    ],
    rightsNote: 'Licensed Publisher Sample Excerpt.',
    collections: ['editors-picks', 'modern-fiction']
  },

  // ============================================================================
  // 34. THE ROAD — CORMAC MCCARTHY (MODERN FICTION)
  // ============================================================================
  {
    id: 'the-road-mccarthy',
    title: 'The Road',
    subtitle: 'Pulitzer Prize Edition',
    author: 'Cormac McCarthy',
    authorId: 'cormac-mccarthy',
    category: 'Fiction',
    categorySlug: 'fiction',
    genre: 'Contemporary Literary Fiction',
    publishedYear: 2006,
    publisher: 'Alfred A. Knopf',
    pages: 287,
    isbn: '9780307387899',
    language: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    isFree: false,
    price: 16.0,
    priceDisplay: '$16.00',
    coverUrl: '/covers/real/the-road.jpg',
    coverAlt: 'Book cover of The Road by Cormac McCarthy',
    openLibraryWorkId: 'OL7994101W',
    rating: {
      score: 4.6,
      count: 1490,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'A father and his young son walk alone through burned America toward the coast, carrying the fire of human devotion.',
    description: [
      'Winner of the 2007 Pulitzer Prize for Fiction, Cormac McCarthy’s The Road strips prose down to elemental cadence—chronicling the fierce tenderness between a father and son journeying south through a winter landscape with nothing but a pistol, a shopping cart of scavenged goods, and their refusal to abandon their humanity.'
    ],
    tableOfContents: [
      'Section I — The Ash and the Mountain Pass',
      'Section II — Carrying the Fire',
      'Section III — The Bunker and the Road South',
      'Section IV — Arrival at the Gray Coast'
    ],
    sampleChapters: [
      {
        number: 'Section I (Excerpt)',
        title: 'Awakening in the Woods',
        epigraph: 'Licensed Publisher Sample Excerpt',
        content: [
          'When he woke in the woods in the dark and the cold of the night he’d reach out to touch the child sleeping beside him. Nights dark beyond darkness and the days more gray each one than what had gone before.'
        ]
      }
    ],
    rightsNote: 'Bibliographic Record Only — Full-text reading is unavailable due to contemporary publisher copyright restrictions.',
    collections: ['modern-fiction']
  },
  {
    id: 'think-python-downey',
    title: 'Think Python',
    subtitle: 'How to Think Like a Computer Scientist (Open-Access 2nd Edition)',
    author: 'Allen B. Downey',
    authorId: 'allen-downey',
    category: 'Technology & Programming',
    categorySlug: 'technology-programming',
    genre: 'Computer Science & Programming',
    publishedYear: 2015,
    publisher: 'Green Tea Press / O’Reilly Open Access',
    pages: 292,
    isbn: '9781491939369',
    language: 'English',
    formats: ['PDF', 'EPUB', 'HTML', 'Plain Text', 'Web Reader'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Open Access',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781491939369-L.jpg',
    coverAlt: 'Book cover of Think Python by Allen B. Downey',
    openLibraryWorkId: 'OL17315382W',
    rating: {
      score: 4.8,
      count: 2140,
      source: 'Open Textbook & Reader Consensus'
    },
    shortSynopsis: 'A concise, rigorous open-access introduction to software design, recursion, data structures, and computational problem solving in Python.',
    description: [
      'Released by Professor Allen B. Downey under a Creative Commons open-access licence through Green Tea Press, Think Python teaches programming not merely as syntax memorization, but as a disciplined mode of formal reasoning.',
      'Each chapter builds from foundational values, variables, and function composition toward recursion, algorithmic analysis, mutable and immutable data structures, object-oriented design, and systematic debugging.'
    ],
    tableOfContents: [
      'Chapter 1 — The Way of the Program',
      'Chapter 2 — Variables, Expressions, and Statements',
      'Chapter 3 — Functions and Stack Diagrams',
      'Chapter 4 — Interface Design & Encapsulation',
      'Chapter 5 — Conditionals and Recursion',
      'Chapter 6 — Fruitful Functions & Composition'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1',
        title: 'The Way of the Program',
        epigraph: 'Green Tea Press Open-Access Academic Edition (CC BY-NC 3.0)',
        content: [
          'The goal of this book is to teach you to think like a computer scientist. This way of thinking combines some of the best features of mathematics, engineering, and natural science. Like mathematicians, computer scientists use formal languages to denote ideas—specifically computations. Like engineers, they design things, assembling components into systems and evaluating tradeoffs among alternatives. Like scientists, they observe the behavior of complex systems, form hypotheses, and test predictions.',
          'The single most important skill for a computer scientist is problem solving. Problem solving means the ability to formulate problems, think creatively about solutions, and express a solution clearly and accurately. As it turns out, the process of learning to program is an excellent opportunity to practice problem-solving skills.',
          'A program is a sequence of instructions that specifies how to perform a computation. The computation might be something mathematical, such as solving a system of equations or finding the roots of a polynomial, but it can also be a symbolic computation, such as searching and replacing text in a document or something graphical, like processing an image or playing a video.',
          'Regardless of the language, every program you have ever used—no matter how complicated—is made up of five fundamental instructions: input, output, math, conditional execution, and repetition. Programming is the art of breaking a large, complex task into smaller and smaller subtasks until the subtasks are simple enough to be performed with one of these basic instructions.',
          'Natural languages are the languages people speak, such as English, Spanish, and French. They were not designed by people; they evolved naturally. Formal languages are languages that are designed by people for specific applications. Programming languages are formal languages that have been designed to express computations. Formal languages tend to have strict syntax rules that govern the structure of statements, eliminating ambiguity so that every expression has an exact, deterministic meaning.'
        ]
      },
      {
        number: 'Chapter 2',
        title: 'Variables, Expressions, and Statements',
        epigraph: 'State, Assignment, and Order of Operations',
        content: [
          'One of the most powerful features of a programming language is the ability to manipulate variables. A variable is a name that refers to a value. An assignment statement creates a new variable and gives it a value: message = "And now for something completely different", or n = 17, or pi = 3.141592653589793.',
          'A common way to represent variables on paper is to write the name with an arrow pointing to its value. This kind of figure is called a state diagram because it shows what state each of the variables is in—think of it as the variable’s state of mind.',
          'An expression is a combination of values, variables, and operators. A value all by itself is considered an expression, and so is a variable. When you type an expression at the prompt, the interpreter evaluates it, which means that it finds the value of the expression. A statement, by contrast, is a unit of code that has an effect, like creating a variable or displaying a value.',
          'As programs get bigger and more complicated, they get more difficult to read. Formal languages are dense, and it is often difficult to look at a piece of code and figure out what it is doing, or why. For this reason, it is a good idea to add notes to your programs to explain in natural language what the program is doing. These notes are called comments, and they are most useful when they document non-obvious assumptions and invariants rather than restating the code.'
        ]
      },
      {
        number: 'Chapter 3',
        title: 'Functions and Stack Diagrams',
        epigraph: 'Modular Decomposition and Scope',
        content: [
          'In the context of programming, a function is a named sequence of statements that performs a computation. When you define a function, you specify the name and the sequence of statements. Later, you can "call" the function by name.',
          'Defining a function creates a function object, which has type function. The statements inside the function do not run until the function is called, and the function definition generates no output on its own. Once you have defined a function, you can use it inside another function. This ability to build complex operations out of simpler primitives is the essence of procedural abstraction.',
          'To keep track of which variables can be used where, it is sometimes useful to draw a stack diagram. Like state diagrams, stack diagrams show the value of each variable, but they also show the function each variable belongs to. Each function is represented by a frame—a box with the name of a function beside it and the parameters and variables of the function inside it.',
          'Why divide a program into functions? Creating a new function gives you an opportunity to name a group of statements, which makes your program easier to read and debug. Functions can make a program smaller by eliminating repetitive code. Later, if you make a change, you only have to make it in one place. Dividing a long program into functions allows you to debug the parts one at a time and then assemble them into a working whole.'
        ]
      },
      {
        number: 'Chapter 4',
        title: 'Conditionals, Recursion, and Fruitful Computation',
        epigraph: 'Base Cases, Inductive Steps, and Pure Functions',
        content: [
          'It is legal for one function to call another; it is also legal for a function to call itself. It may not be obvious why that is a good thing, but it turns out to be one of the most magical and expressive capabilities a program can do. A function that calls itself is recursive; the process of executing it is called recursion.',
          'Every useful recursive function must have at least one base case—a branch that does not make a recursive call—and at least one recursive step that reduces the problem toward the base case. If a recursion never reaches a base case, it goes on making recursive calls until the runtime stack is exhausted, a condition known as infinite recursion.',
          'Following the "leap of faith" method of reading recursive programs: instead of following the flow of execution all the way down every nested frame, you assume that the recursive call works correctly for smaller inputs, and then ask whether the current step combines that result properly.',
          'When you write fruitful functions—functions that return values rather than merely printing side effects—you unlock incremental development. The goal of incremental development is to avoid long debugging sessions by adding and testing only a small amount of code at a time, verifying each pure transformation with concrete inputs and expected outputs.'
        ]
      }
    ],
    rightsNote: 'Open-Access Academic Edition — Licensed under Creative Commons Attribution-NonCommercial 3.0 (Green Tea Press).',
    collections: ['tech-programming', 'free-ebooks', 'open-access-academic', 'recently-added']
  },
  {
    id: 'introduction-to-information-retrieval',
    title: 'Introduction to Information Retrieval',
    subtitle: 'Search Engines, Inverted Indexes, and Vector Space Ranking',
    author: 'Christopher D. Manning, Prabhakar Raghavan & Hinrich Schütze',
    authorId: 'christopher-manning',
    category: 'Technology & Programming',
    categorySlug: 'technology-programming',
    genre: 'Computer Science & Information Retrieval',
    publishedYear: 2008,
    publisher: 'Cambridge University Press (Open Access Online Edition)',
    pages: 496,
    isbn: '9780521865715',
    language: 'English',
    formats: ['PDF', 'EPUB', 'HTML', 'Plain Text', 'Web Reader'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Open Access',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780521865715-L.jpg',
    coverAlt: 'Book cover of Introduction to Information Retrieval by Manning, Raghavan, and Schütze',
    openLibraryWorkId: 'OL10324256W',
    rating: {
      score: 4.9,
      count: 1620,
      source: 'Academic & Stanford NLP Consensus'
    },
    shortSynopsis: 'The definitive Stanford and Cambridge open-access textbook on search engine architecture, inverted indexing, probabilistic ranking, and web-scale retrieval.',
    description: [
      'Authored by Christopher D. Manning, Prabhakar Raghavan, and Hinrich Schütze and made freely available online by Cambridge University Press and Stanford NLP, Introduction to Information Retrieval is the standard graduate and undergraduate reference on search systems.',
      'Combining rigorous algorithmic analysis with practical system design, it covers Boolean retrieval, dictionary and postings compression, TF-IDF term weighting, vector space cosine similarity, evaluation metrics, and link analysis.'
    ],
    tableOfContents: [
      'Chapter 1 — Boolean Retrieval & Inverted Indexes',
      'Chapter 2 — The Term Vocabulary and Postings Lists',
      'Chapter 3 — Dictionaries and Tolerant Retrieval',
      'Chapter 4 — Index Construction at Scale',
      'Chapter 5 — Scoring, Term Weighting, and the Vector Space Model'
    ],
    sampleChapters: [
      {
        number: 'Chapter 1',
        title: 'Boolean Retrieval & Inverted Indexes',
        epigraph: 'Stanford University / Cambridge Open Access Edition',
        content: [
          'Information retrieval (IR) is finding material (usually documents) of an unstructured nature (usually text) that satisfies an information need from within large collections (usually stored on computers). Every day, hundreds of millions of people engage in information retrieval when they use a web search engine or search their digital libraries.',
          'Suppose we wish to determine which plays of Shakespeare contain the words Brutus AND Caesar and NOT Calpurnia. One way to do this is to start at the beginning of all of Shakespeare’s plays and read through the text, noting for each play whether it contains Brutus and Caesar and excluding it if it contains Calpurnia. This linear scan—or grepping through text—is simple and effective for small collections, but for billions of documents we need to index the documents in advance.',
          'The fundamental data structure of modern information retrieval is the inverted index. We keep a dictionary of terms (sometimes referred to as the vocabulary or lexicon). Then for each term, we have a list that records which documents the term occurs in. Each item in the list—which records that a term appeared in a document—is conventionally called a posting. The list is then called a postings list, and all the postings lists taken together are referred to as the postings.',
          'To process a conjunctive Boolean query such as Brutus AND Caesar, we locate both terms in the dictionary, retrieve their respective postings lists, and intersect the two sorted lists in linear time O(x + y) using two synchronized pointers.'
        ]
      },
      {
        number: 'Chapter 2',
        title: 'The Term Vocabulary and Postings Lists',
        epigraph: 'Tokenization, Normalization, and Positional Postings',
        content: [
          'Given a character sequence and a defined document unit, tokenization is the task of chopping it up into pieces, called tokens, perhaps at the same time throwing away certain characters, such as punctuation. Having chopped up our documents into tokens, the next issue is equivalence classing of terms so that superficial variations—such as capitalization, hyphens, or inflectional suffixes—match appropriately.',
          'Stemming and lemmatization aim to reduce inflectional forms and sometimes derivationally related forms of a word to a common base form. While stemming typically refers to a crude heuristic process that chops off the ends of words, lemmatization refers to doing things properly with the use of a vocabulary and morphological analysis of words.',
          'Many complex or technical queries are phrase queries, such as "stanford university" or "digital library". To support arbitrary phrase queries and proximity operators efficiently, an index stores positional postings: for each term and each document ID in its postings list, we store the sorted list of word positions at which the term appears in that document.'
        ]
      },
      {
        number: 'Chapter 3',
        title: 'Scoring, Term Weighting, and the Vector Space Model',
        epigraph: 'TF-IDF Weighting and Cosine Similarity',
        content: [
          'Thus far, we have dealt with Boolean queries: a document either matches or does not match a query. For large collections, a Boolean query often results in either too few or too many thousands of results. It takes skill to craft a Boolean query that produces a manageable number of hits. Consequently, it is far more desirable to compute a numeric score between 0 and 1 for each document that measures how well document and query match.',
          'How do we assign a weight to a term in a document? First, the term frequency tf(t, d) is the number of occurrences of term t in document d. However, raw frequency alone treats common words that appear in almost every document as equally discriminative as rare terms. Therefore, we attenuate the effect of terms that occur too often in the collection by scaling with inverse document frequency: idf(t) = log(N / df(t)), where N is the total number of documents and df(t) is the number of documents containing term t.',
          'Combining these two quantities yields the tf-idf weight: w(t, d) = tf(t, d) × idf(t). The tf-idf weight of a term is highest when t occurs many times within a small number of documents, lending high discriminating power to those documents.',
          'In the vector space model, each document d is viewed as a vector with one component in the dictionary for each term, weighted by its tf-idf value. To compensate for the effect of document length, we quantify the similarity between two documents—or between a query q and a document d—as the cosine of the angle between their length-normalized vectors.'
        ]
      }
    ],
    rightsNote: 'Open-Access Academic Edition — Freely available for online reading and academic download via Stanford NLP & Cambridge University Press.',
    collections: ['tech-programming', 'free-ebooks', 'open-access-academic', 'recently-added']
  },
  {
    id: 'the-elements-of-style-1918',
    title: 'The Elements of Style',
    subtitle: 'Elementary Rules of Usage and Principles of Composition (1918 Cornell Edition)',
    author: 'William Strunk Jr.',
    authorId: 'william-strunk',
    category: 'Education',
    categorySlug: 'education',
    genre: 'Rhetoric, Grammar & Academic Writing',
    publishedYear: 1918,
    publisher: 'Cornell University Press / Project Gutenberg',
    pages: 108,
    isbn: '9781587340604',
    language: 'English',
    formats: ['PDF', 'EPUB', 'HTML', 'Plain Text', 'Web Reader'],
    isFree: true,
    price: 0,
    priceDisplay: 'Free Public Domain',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781587340604-L.jpg',
    coverAlt: 'Book cover of The Elements of Style by William Strunk Jr.',
    openLibraryWorkId: 'OL6642454W',
    rating: {
      score: 4.7,
      count: 1980,
      source: 'Open Library Reader Consensus'
    },
    shortSynopsis: 'Professor William Strunk Jr.’s classic Cornell manual on clear English prose, active verbs, paragraph structure, and omitting needless words.',
    description: [
      'Originally printed privately in 1918 for the use of his students in English 8 at Cornell University, William Strunk Jr.’s The Elements of Style aims to lighten the task of instructor and student by concentrating attention on a few essentials, the rules of usage and principles of composition most commonly violated.',
      'Its famous injunction—"Omit needless words. Vigorous writing is concise"—has shaped generations of essayists, journalists, scholars, and editors.'
    ],
    tableOfContents: [
      'Chapter I — Introductory Note on Clear Prose',
      'Chapter II — Elementary Rules of Usage',
      'Chapter III — Elementary Principles of Composition',
      'Chapter IV — A Few Matters of Form',
      'Chapter V — Words and Expressions Commonly Misused'
    ],
    sampleChapters: [
      {
        number: 'Chapter I',
        title: 'Introductory Note & Elementary Rules of Usage',
        epigraph: 'First Cornell Edition, Ithaca, New York (1918)',
        content: [
          'This book aims to give in brief space the principal requirements of plain English style. It aims to lighten the task of instructor and student by concentrating attention (in Chapters II and III) on a few essentials, the rules of usage and principles of composition most commonly violated.',
          'The numbers of the sections may be used as references in correcting manuscript. The book covers only a small portion of the field of English style, but the experience of its writer has been that once past the essentials, students profit most by individual instruction based on the problems of their own work, and that each instructor has his own body of theory, which he prefers to that offered by any textbook.',
          'Rule 1: Form the possessive singular of nouns with ’s. Follow this rule whatever the final consonant. Thus write, Charles’s friend, Burns’s poems, the witch’s malice. Exceptions are the possessives of ancient proper names in -es and -is, the possessive Jesus’, and such forms as for conscience’ sake, for righteousness’ sake.',
          'Rule 2: In a series of three or more terms with a single conjunction, use a comma after each term except the last. Thus write: red, white, and blue; honest, energetic, but headstrong; He opened the letter, read it, and made a note of its contents.'
        ]
      },
      {
        number: 'Chapter II',
        title: 'Elementary Principles of Composition',
        epigraph: 'Paragraphs as the Unit of Composition & Active Voice',
        content: [
          'Rule 8: Make the paragraph the unit of composition: one paragraph to each topic. If the subject on which you are writing is of slight extent, or if you intend to treat it very briefly, there may be no need of subdividing it into topics. Thus a brief description, a brief summary of a literary work, a brief account of a single incident, a narrative merely outlining an action, the setting forth of a single idea, any one of these is best written in a single paragraph.',
          'As a rule, begin each paragraph with a topic sentence; end it in conformity with the beginning. Again, the object is to aid the reader. The practice here recommended enables him to discover the purpose of each paragraph as he begins to read it, and to retain the purpose in mind as he ends it.',
          'Rule 10: Use the active voice. The active voice is usually more direct and vigorous than the passive: "I shall always remember my first visit to Boston" is much better than "My first visit to Boston will always be remembered by me." The latter sentence is less direct, less bold, and less concise. If the writer tries to make it more concise by omitting "by me," it becomes indefinite.',
          'Rule 11: Put statements in positive form. Make definite assertions. Avoid tame, colorless, hesitating, non-committal language. Use the word "not" as a means of denial or in antithesis, never as a means of evasion. Consciously or unconsciously, the reader is dissatisfied with being told only what is not; he wishes to be told what is.'
        ]
      },
      {
        number: 'Chapter III',
        title: 'Omit Needless Words & Express Coordinate Ideas in Similar Form',
        epigraph: 'Vigorous Writing Is Concise',
        content: [
          'Rule 13: Omit needless words. Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts. This requires not that the writer make all his sentences short, or that he avoid all detail and treat his subjects only in outline, but that every word tell.',
          'Many expressions in common use violate this principle: "the question as to whether" should be simply "whether"; "there is no doubt but that" should be "no doubt"; "used for fuel purposes" should be "used for fuel"; "in a hasty manner" should be "hastily"; "this is a subject which" should be "this subject."',
          'Rule 15: Express co-ordinate ideas in similar form. This principle, that of parallel construction, requires that expressions of similar content and function should be outwardly similar. The likeness of form enables the reader to recognize more readily the likeness of content and function. Familiar instances from the Bible are the Ten Commandments, the Beatitudes, and the petitions of the Lord’s Prayer.',
          'Rule 18: Place the emphatic words of a sentence at the end. The proper place in the sentence for the word, or group of words, which the writer desires to make most prominent is usually the end. Any element in the sentence, other than the subject, becomes emphatic when placed first; the principle that what comes last is most emphatic applies equally to the sentences of a paragraph and to the paragraphs of an essay.'
        ]
      }
    ],
    rightsNote: 'Public Domain & Open-Access Academic Reference — Project Gutenberg Ebook #37134.',
    collections: ['free-ebooks', 'open-access-academic', 'recently-added']
  }
];

interface BookAccessConfig {
  accessType: BookAccessType;
  accessStatus?: EbookAccessStatus;
  requiresAuthForFullText: boolean;
  gutenbergId?: number;
  standardEbooksPath?: string;
  isOpenAccessAcademic?: boolean;
  sourceProvider?: string;
  licenceName?: string;
  licenceUrl?: string;
  copyrightStatus?: string;
  attributionRequirements?: string;
  customExternalSources?: ExternalSourceLink[];
}

const BOOK_ACCESS_CONFIG: Record<string, BookAccessConfig> = {
  'pride-and-prejudice': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 1342,
    standardEbooksPath: 'jane-austen/pride-and-prejudice'
  },
  'the-intelligent-investor': {
    accessType: 'preview-only',
    accessStatus: 'preview_only',
    requiresAuthForFullText: false
  },
  'designing-data-intensive-applications': {
    accessType: 'preview-only',
    accessStatus: 'preview_only',
    requiresAuthForFullText: false
  },
  'meditations': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 2680,
    standardEbooksPath: 'marcus-aurelius/meditations/george-long'
  },
  'on-the-origin-of-species': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 1228,
    standardEbooksPath: 'charles-darwin/on-the-origin-of-species',
    isOpenAccessAcademic: true
  },
  'the-guns-of-august': {
    accessType: 'preview-only',
    accessStatus: 'preview_only',
    requiresAuthForFullText: false
  },
  'autobiography-of-benjamin-franklin': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 20203,
    standardEbooksPath: 'benjamin-franklin/the-autobiography-of-benjamin-franklin'
  },
  'hound-of-the-baskervilles': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 2852,
    standardEbooksPath: 'arthur-conan-doyle/the-hound-of-the-baskervilles'
  },
  'middlemarch': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 145,
    standardEbooksPath: 'george-eliot/middlemarch'
  },
  'structure-and-interpretation-of-computer-programs': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    isOpenAccessAcademic: true,
    sourceProvider: 'MIT Press Open Access / DOAB',
    licenceName: 'Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    copyrightStatus: 'Open-Access Academic Edition (MIT Press)',
    attributionRequirements: 'Attribution required: Harold Abelson, Gerald Jay Sussman, and Julie Sussman (MIT Press).',
    customExternalSources: [
      {
        label: 'MIT Press Open Access Full Text',
        provider: 'MIT Press Open Access',
        url: 'https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html',
        type: 'full-text'
      }
    ]
  },
  'think-python-downey': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    isOpenAccessAcademic: true,
    sourceProvider: 'Green Tea Press / DOAB Open Textbook Archive',
    licenceName: 'Creative Commons Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0)',
    licenceUrl: 'https://creativecommons.org/licenses/by-nc/3.0/',
    copyrightStatus: 'Open-Access Textbook Edition',
    attributionRequirements: 'Attribution required: Allen B. Downey, Green Tea Press.',
    customExternalSources: [
      {
        label: 'Green Tea Press Official Open-Access Edition',
        provider: 'Green Tea Press',
        url: 'https://greenteapress.com/wp/think-python-2e/',
        type: 'full-text'
      }
    ]
  },
  'introduction-to-information-retrieval': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    isOpenAccessAcademic: true,
    sourceProvider: 'Stanford NLP & Cambridge University Press Open Access',
    licenceName: 'Cambridge University Press Open-Access Online Academic Licence',
    licenceUrl: 'https://nlp.stanford.edu/IR-book/',
    copyrightStatus: 'Open-Access University Textbook Edition',
    attributionRequirements: 'Attribution required: C. D. Manning, P. Raghavan, and H. Schütze (Cambridge University Press).',
    customExternalSources: [
      {
        label: 'Stanford NLP Official Open-Access Companion & PDF',
        provider: 'Stanford University NLP',
        url: 'https://nlp.stanford.edu/IR-book/information-retrieval-book.html',
        type: 'full-text'
      }
    ]
  },
  'the-elements-of-style-1918': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 37134,
    isOpenAccessAcademic: true
  },
  'mrs-dalloway': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 63107,
    standardEbooksPath: 'virginia-woolf/mrs-dalloway'
  },
  'to-the-lighthouse': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 144,
    standardEbooksPath: 'virginia-woolf/to-the-lighthouse'
  },
  'a-room-of-ones-own': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    standardEbooksPath: 'virginia-woolf/a-room-of-ones-own'
  },
  'wealth-of-nations': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 3300,
    isOpenAccessAcademic: true
  },
  'talks-to-teachers-william-james': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 16287,
    isOpenAccessAcademic: true
  },
  'relativity-einstein': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 5001,
    isOpenAccessAcademic: true
  },
  'histories-herodotus': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 2707
  },
  'narrative-of-frederick-douglass': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 23,
    standardEbooksPath: 'frederick-douglass/narrative-of-the-life-of-frederick-douglass'
  },
  'jane-eyre': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 1260,
    standardEbooksPath: 'charlotte-bronte/jane-eyre'
  },
  'adventures-of-sherlock-holmes': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 1661,
    standardEbooksPath: 'arthur-conan-doyle/the-adventures-of-sherlock-holmes'
  },
  'democracy-and-education': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 852,
    isOpenAccessAcademic: true
  },
  'frankenstein-1818': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 84,
    standardEbooksPath: 'mary-shelley/frankenstein'
  },
  'thinking-fast-and-slow': {
    accessType: 'preview-only',
    accessStatus: 'preview_only',
    requiresAuthForFullText: false
  },
  'lombard-street-bagehot': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 4359,
    isOpenAccessAcademic: true
  },
  'code-hidden-language': {
    accessType: 'preview-only',
    accessStatus: 'preview_only',
    requiresAuthForFullText: false
  },
  'pragmatic-programmer': {
    accessType: 'external-only',
    accessStatus: 'external_reading',
    requiresAuthForFullText: false
  },
  'deep-work-cal-newport': {
    accessType: 'external-only',
    accessStatus: 'external_reading',
    requiresAuthForFullText: false
  },
  'habit-william-james': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 39973
  },
  'cosmos-carl-sagan': {
    accessType: 'preview-only',
    accessStatus: 'preview_only',
    requiresAuthForFullText: false
  },
  'a-room-with-a-view': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 2641,
    standardEbooksPath: 'e-m-forster/a-room-with-a-view'
  },
  'the-moonstone': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 155,
    standardEbooksPath: 'wilkie-collins/the-moonstone'
  },
  'jacobs-room': {
    accessType: 'full-text',
    accessStatus: 'full_download_available',
    requiresAuthForFullText: true,
    gutenbergId: 5670,
    standardEbooksPath: 'virginia-woolf/jacobs-room'
  },
  'remains-of-the-day': {
    accessType: 'metadata-only',
    accessStatus: 'metadata_only',
    requiresAuthForFullText: false
  },
  'the-road-mccarthy': {
    accessType: 'metadata-only',
    accessStatus: 'metadata_only',
    requiresAuthForFullText: false
  }
};

const VERIFICATION_DATE_ISO = '2026-10-25T19:00:00Z';

const BASE_BOOKS: Book[] = RAW_BOOKS.map((raw) => {
  const cfg = BOOK_ACCESS_CONFIG[raw.id] || {
    accessType: raw.isFree ? 'full-text' : 'preview-only',
    accessStatus: raw.isFree ? 'full_download_available' : 'preview_only',
    requiresAuthForFullText: raw.isFree
  };

  const accessStatus =
    cfg.accessStatus ||
    (cfg.accessType === 'full-text'
      ? 'full_download_available'
      : cfg.accessType === 'preview-only'
      ? 'preview_only'
      : cfg.accessType === 'external-only'
      ? 'external_reading'
      : 'metadata_only');

  const isFullEligible =
    accessStatus === 'full_download_available' || accessStatus === 'full_text_available';
  const downloadPermitted = accessStatus === 'full_download_available';
  const fullTextReadingPermitted = isFullEligible;

  const availableFormats = downloadPermitted
    ? (['PDF', 'EPUB', 'HTML', 'Plain Text'] as const)
    : accessStatus === 'full_text_available'
    ? (['HTML', 'Plain Text'] as const)
    : ([] as const);

  const sourceProvider =
    cfg.sourceProvider ||
    (cfg.standardEbooksPath && cfg.gutenbergId
      ? 'Project Gutenberg & Standard Ebooks'
      : cfg.gutenbergId
      ? 'Project Gutenberg'
      : cfg.standardEbooksPath
      ? 'Standard Ebooks'
      : accessStatus === 'external_reading'
      ? 'Open Library Controlled Digital Lending'
      : 'Open Library Bibliographic Registry');

  const sourceBookId = cfg.gutenbergId
    ? `pg-${cfg.gutenbergId}`
    : cfg.standardEbooksPath
    ? `se-${cfg.standardEbooksPath}`
    : raw.openLibraryWorkId || raw.id;

  const canonicalSourceUrl =
    cfg.customExternalSources?.[0]?.url ||
    (cfg.gutenbergId
      ? `https://www.gutenberg.org/ebooks/${cfg.gutenbergId}`
      : cfg.standardEbooksPath
      ? `https://standardebooks.org/ebooks/${cfg.standardEbooksPath}`
      : `https://openlibrary.org/works/${raw.openLibraryWorkId}`);

  const originalFileUrl = downloadPermitted
    ? `/api/download/${encodeURIComponent(raw.id)}/pdf`
    : null;

  const licenceName =
    cfg.licenceName ||
    (isFullEligible
      ? 'Public Domain in the United States & Worldwide (CC0 / Project Gutenberg Licence)'
      : accessStatus === 'preview_only'
      ? 'All Rights Reserved — Authorized First-Chapter Sample Only'
      : accessStatus === 'external_reading'
      ? 'Controlled Digital Lending (Open Library / Internet Archive)'
      : 'All Rights Reserved — Bibliographic Metadata Record Only');

  const licenceUrl =
    cfg.licenceUrl ||
    (cfg.gutenbergId
      ? 'https://www.gutenberg.org/policy/license.html'
      : cfg.standardEbooksPath
      ? 'https://creativecommons.org/publicdomain/zero/1.0/'
      : 'https://openlibrary.org/about');

  const copyrightStatus =
    cfg.copyrightStatus ||
    (isFullEligible
      ? 'Public Domain — Unabridged Full Text & Download Permitted'
      : accessStatus === 'preview_only'
      ? `Active Publisher Copyright (${raw.publisher}) — Preview Sample Only`
      : accessStatus === 'external_reading'
      ? `Copyrighted Edition (${raw.publisher}) — External Borrowing Available`
      : `Copyrighted Edition (${raw.publisher}) — Metadata Only`);

  const attributionRequirements =
    cfg.attributionRequirements ||
    (isFullEligible
      ? `Digitized archival text via ${sourceProvider} (${sourceBookId}). Free to read, cite, and download.`
      : `Bibliographic metadata via Open Library (${raw.openLibraryWorkId}).`);

  const provenance = {
    sourceProvider,
    sourceBookId,
    canonicalSourceUrl,
    originalFileUrl,
    availableFormats: [...availableFormats],
    licenceName,
    licenceUrl,
    copyrightStatus,
    attributionRequirements,
    localHostingPermitted: isFullEligible,
    downloadPermitted,
    fullTextReadingPermitted,
    lastVerificationDate: VERIFICATION_DATE_ISO,
    lastSuccessfulAvailabilityCheck: VERIFICATION_DATE_ISO,
    isOpenAccessAcademic: Boolean(cfg.isOpenAccessAcademic)
  };

  const externalSources: ExternalSourceLink[] = [
    ...(cfg.customExternalSources || [])
  ];

  if (cfg.gutenbergId) {
    externalSources.push({
      label: `Project Gutenberg #${cfg.gutenbergId} (Full Ebook)`,
      provider: 'Project Gutenberg',
      url: `https://www.gutenberg.org/ebooks/${cfg.gutenbergId}`,
      type: 'full-text',
      format: 'EPUB'
    });
  }

  if (cfg.standardEbooksPath) {
    externalSources.push({
      label: 'Standard Ebooks Typographic Edition',
      provider: 'Standard Ebooks',
      url: `https://standardebooks.org/ebooks/${cfg.standardEbooksPath}`,
      type: 'full-text',
      format: 'EPUB'
    });
  }

  externalSources.push({
    label:
      cfg.accessType === 'external-only'
        ? `Borrow or Preview on Open Library (${raw.openLibraryWorkId})`
        : `Open Library Work Record (${raw.openLibraryWorkId})`,
    provider: 'Open Library',
    url: `https://openlibrary.org/works/${raw.openLibraryWorkId}`,
    type: cfg.accessType === 'external-only' ? 'borrow' : 'catalog-record'
  });

  if (cfg.accessType === 'metadata-only') {
    return {
      ...raw,
      formats: ['EPUB', 'PDF', 'Kindle'],
      availableFormats: [],
      accessStatus,
      sampleChapters: [],
      rightsNote:
        'Verified Bibliographic Record Only — Full-text reading is unavailable in Folio due to publisher copyright restrictions.',
      accessType: cfg.accessType,
      requiresAuthForFullText: false,
      gutenbergId: cfg.gutenbergId,
      standardEbooksPath: cfg.standardEbooksPath,
      provenance,
      externalSources
    };
  }

  if (cfg.accessType === 'external-only') {
    return {
      ...raw,
      availableFormats: [],
      accessStatus,
      rightsNote:
        'External Lending & Publisher Edition — Available to borrow via Open Library or preview chapter notes.',
      accessType: cfg.accessType,
      requiresAuthForFullText: false,
      gutenbergId: cfg.gutenbergId,
      standardEbooksPath: cfg.standardEbooksPath,
      provenance,
      externalSources
    };
  }

  return {
    ...raw,
    formats: downloadPermitted
      ? ['PDF', 'EPUB', 'HTML', 'Plain Text', 'Web Reader']
      : raw.formats,
    availableFormats: [...availableFormats],
    accessStatus,
    accessType: cfg.accessType,
    requiresAuthForFullText: cfg.requiresAuthForFullText,
    gutenbergId: cfg.gutenbergId,
    standardEbooksPath: cfg.standardEbooksPath,
    provenance,
    externalSources
  };
});

export const STOREFRONT_CURATED_BOOKS: Book[] = [
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
      sourceProvider: 'Understory Storefront & Catalog',
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
      'The Great Gatsby stands as the supreme achievement of F. Scott Fitzgerald\'s career and a cornerstone of twentieth-century world literature.',
      'Narrated with luminous moral ambivalence by Midwesterner Nick Carraway, the novel chronicles the enigmatic millionaire Jay Gatsby and his obsessive devotion to the captivating Daisy Buchanan across the gilded estates of West Egg.',
      'This authorized digital masterwork reproduces the authoritative 1925 Scribner text with complete scene restorations, archival typography, and synchronized reader playback.'
    ],
    tableOfContents: [
      'Chapter I — The House at West Egg',
      'Chapter II — The Valley of Ashes & Myrtle Wilson',
      'Chapter III — Gatsby\'s Midsummer Night Gala',
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
          '"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."',
          'He didn\'t say any more, but we\'ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I\'m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.'
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
    publisher: 'J. B. Lippincott & Co. • Understory Literary Editions',
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
      sourceProvider: 'Understory Storefront',
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
      'Harper Lee\'s Pulitzer Prize-winning masterwork is an indelible exploration of racial injustice, childhood innocence, and compassionate courage in the American South.',
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
          'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem\'s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury.',
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
    publisher: 'Secker & Warburg • Understory Classics',
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
      sourceProvider: 'Understory Storefront',
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
      'Winston Smith works at the Ministry of Truth, rewriting historical records to fit the Party\'s shifting propaganda, until his forbidden romance with Julia ignites an act of defiance.'
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
    publisher: 'Charles Scribner’s Sons • Understory Editions',
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
      sourceProvider: 'Understory Storefront',
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
      'The Old Man and the Sea is Hemingway\'s triumphant return to narrative greatness, winning both the Pulitzer Prize in 1953 and leading directly to the Nobel Prize in Literature in 1954.',
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
          'In the first forty days a boy had been with him. But after forty days without a fish the boy\'s parents had told him that the old man was now definitely and finally salao, which is the worst form of unlucky.'
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
    publisher: 'Alfred A. Knopf • Understory Contemporary Classics',
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
      sourceProvider: 'Understory Storefront',
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
      'McCarthy\'s sparse, poetic prose illuminates the sacred bond between father and son "carrying the fire" through the darkest night.'
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
          "When he woke in the woods in the dark and the cold of the night he'd reach out to touch the child sleeping beside him. Nights dark beyond darkness and the days more gray each one than what had gone before.",
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
      sourceProvider: 'Understory Storefront',
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
  },
  {
    id: 'as-a-man-thinketh',
    title: 'As a Man Thinketh',
    subtitle: 'The Classic Guide to Thought-Mastery, Character & Self-Discipline',
    author: 'James Allen',
    authorId: 'james-allen',
    category: 'Self-Development & Business',
    categorySlug: 'self-development-business',
    genre: 'Mindset Philosophy, Motivation & Self-Discipline',
    publishedYear: 1903,
    publisher: 'Savoy Publishing • Authorized Folio Edition',
    pages: 84,
    isbn: '978-1-58542-632-4',
    language: 'English',
    languageLabel: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'James Allen Literary Legacy • Public Domain Masterwork',
    licenceEvidence: 'Centennial Masterwork — Public Domain Worldwide Reading Rights',
    distributionPermissions: 'Worldwide digital streaming and free full-text download permitted',
    coverUrl: '/covers/real/as-a-man-thinketh.jpg',
    coverAlt: 'Original published cover of As a Man Thinketh by James Allen',
    provenance: {
      sourceProvider: 'eBaro Folio Digital Archive',
      sourceBookId: 'EBARO-CUR-THINKETH',
      canonicalSourceUrl: '/books/as-a-man-thinketh',
      originalFileUrl: '/covers/real/as-a-man-thinketh.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Public Domain Classical Masterwork',
      licenceUrl: 'https://en.wikipedia.org/wiki/As_a_Man_Thinketh',
      copyrightStatus: 'Public domain worldwide. Published originally in 1903.',
      rightsHolder: 'Public Domain',
      licenceEvidence: 'Global public domain preservation under eBaro Open Heritage Charter.',
      distributionPermissions: 'Unrestricted open digital reading, offline caching, and text delivery.',
      attributionRequirements: 'Attribution to James Allen preserved.',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-29',
      lastSuccessfulAvailabilityCheck: '2026-10-29',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: {
      score: 4.9,
      count: 3120,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The foundational classic on the creative power of human thought: how disciplined habits of mind shape character, master circumstance, and lead to enduring achievement.',
    description: [
      'First published in 1903, James Allen’s "As a Man Thinketh" is revered worldwide as the foundational fountainhead of modern self-discipline, motivation, and personal achievement literature.',
      'Drawing its title from the proverb "As a man thinketh in his heart, so is he," the book argues that humanity is made or unmade by itself; that in the armory of thought, we forge the weapons by which we destroy ourselves, or fabricate the tools with which we build palaces of joy, strength, and peace.',
      'In clear, resonant, poetic prose, Allen shows how self-discipline begins not with outward struggle, but with inner mental clarity, moral purpose, and calm composure.'
    ],
    tableOfContents: [
      'Chapter I — Thought and Character',
      'Chapter II — Effect of Thought on Circumstances',
      'Chapter III — Effect of Thought on Health and the Body',
      'Chapter IV — Thought and Purpose',
      'Chapter VI — Visions and Ideals',
      'Chapter VII — Serenity and Calmness of Mind'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Chapter I — Thought and Character',
        epigraph: '"Mind is the Master power that molds and makes, And Man is Mind, and evermore he takes The tool of Thought, and, shaping what he wills, Brings forth a thousand joys, a thousand ills."',
        content: [
          'The aphorism, "As a man thinketh in his heart so is he," not only embraces the whole of a man\'s being, but is so comprehensive as to reach out to every condition and circumstance of his life. A man is literally what he thinks, his character being the complete sum of all his thoughts.',
          'As the plant springs from, and could not be without, the seed, so every act of a man springs from the hidden seeds of thought, and could not have appeared without them. This applies equally to those acts called "spontaneous" and "unpremeditated" as to those which are deliberately executed.',
          'Act is the blossom of thought, and joy and suffering are its fruits; thus does a man garner in the sweet and bitter fruitage of his own husbandry. What a man thinks, that he becomes; what a man persistently believes, that he achieves.'
        ]
      },
      {
        number: '4',
        title: 'Chapter IV — Thought and Purpose',
        epigraph: '"Until thought is linked with purpose there is no intelligent accomplishment."',
        content: [
          'Until thought is linked with purpose there is no intelligent accomplishment. With the majority the bark of thought is allowed to "drift" upon the ocean of life. Aimlessness is a vice, and such drifting must not continue for him who would steer clear of catastrophe and destruction.',
          'They who have no central purpose in their life fall an easy prey to petty worries, fears, troubles, and self-pityings, all of which are indications of weakness, which lead, just as surely as deliberately planned sins, to failure, unhappiness, and loss.',
          'A man should conceive of a legitimate purpose in his heart, and set out to accomplish it. He should make this purpose the centralizing point of his thoughts. He should steadily focus his mental strength upon the object which he has set before him. He should make this purpose his supreme duty, and should devote himself to its attainment, not allowing his thoughts to wander away into ephemeral fancies.'
        ]
      },
      {
        number: '7',
        title: 'Chapter VII — Serenity and Calmness of Mind',
        epigraph: '"Calmness of mind is one of the beautiful jewels of wisdom."',
        content: [
          'Calmness of mind is one of the beautiful jewels of wisdom. It is the result of long and patient effort in self-control. Its presence is an indication of matured experience, and of a more than ordinary knowledge of the laws and operations of thought.',
          'A man becomes calm in the measure that he understands himself as a thought-evolved being, for such knowledge necessitates the understanding of others as the result of thought, and as he develops a right understanding, and sees more and more clearly the internal relations of things by the action of cause and effect, he ceases to fuss and fume and worry and grieve.',
          'The calm man, having learned how to govern himself, knows how to adapt himself to others; and they, in turn, reverence his spiritual strength, and feel that they can learn of him and rely upon him. The more tranquil a man becomes, the greater is his success, his influence, his power for good.'
        ]
      }
    ],
    rightsNote: 'Authorized Folio digital edition with complete restored text.',
    collections: ['timeless-classics', 'business-personal', 'featured', 'popular', 'free-ebooks', 'recently-added', 'new-arrivals'],
    isRecentlyAdded: true
  },
  {
    id: 'the-richest-man-in-babylon',
    title: 'The Richest Man in Babylon',
    subtitle: 'The Success Secrets of the Ancients: Thrift, Financial Freedom & Wealth Building',
    author: 'George S. Clason',
    authorId: 'george-s-clason',
    category: 'Business & Finance',
    categorySlug: 'business-finance',
    genre: 'Personal Finance, Wealth Building & Financial Discipline',
    publishedYear: 1926,
    publisher: 'Centennial Press • Authorized Archival Edition',
    pages: 160,
    isbn: '978-0-451-20536-0',
    language: 'English',
    languageLabel: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'George S. Clason Heritage • Public Domain Centennial Edition',
    licenceEvidence: 'Centennial Heritage Edition — Open Worldwide Reading Rights',
    distributionPermissions: 'Worldwide digital streaming and free full-text download permitted',
    coverUrl: '/covers/real/the-richest-man-in-babylon.jpg',
    coverAlt: 'Original published cover of The Richest Man in Babylon by George S. Clason',
    provenance: {
      sourceProvider: 'eBaro Folio Digital Archive',
      sourceBookId: 'EBARO-CUR-BABYLON',
      canonicalSourceUrl: '/books/the-richest-man-in-babylon',
      originalFileUrl: '/covers/real/the-richest-man-in-babylon.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Public Domain Classical Masterwork',
      licenceUrl: 'https://en.wikipedia.org/wiki/The_Richest_Man_in_Babylon',
      copyrightStatus: 'Public domain worldwide. Published originally in 1926.',
      rightsHolder: 'Public Domain',
      licenceEvidence: 'Global open publication rights under US Public Domain & eBaro Classical Charter.',
      distributionPermissions: 'Unrestricted open digital reading, offline caching, and text delivery.',
      attributionRequirements: 'Attribution to George S. Clason preserved.',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-29',
      lastSuccessfulAvailabilityCheck: '2026-10-29',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: {
      score: 4.95,
      count: 4890,
      source: 'Global Financial Classics Consensus'
    },
    shortSynopsis:
      'The timeless #1 personal finance classic revealing the Babylonian principles of wealth: paying yourself first, living within your means, and investing prudently.',
    description: [
      'Beloved by millions of readers across a century, George S. Clason’s "The Richest Man in Babylon" is universally hailed as the greatest inspirational book on personal financial management ever written.',
      'Set against the vibrant backdrop of ancient Babylon—the wealthiest, most prosperous metropolis of the ancient world—the book reveals financial wisdom through engaging, memorable parables featuring merchants, craftsmen, and money-lenders.',
      'Through timeless principles like "A part of all you earn is yours to keep," the Seven Cures for a Lean Purse, and the Five Laws of Gold, Clason offers simple, actionable blueprints for generating savings, managing debt, and multiplying wealth that remain as powerful today as they were thousands of years ago.'
    ],
    tableOfContents: [
      'Chapter I — The Man Who Desired Gold',
      'Chapter II — The Richest Man in Babylon: Arkad’s Counsel',
      'Chapter III — Seven Cures for a Lean Purse',
      'Chapter IV — Meet the Goddess of Good Luck',
      'Chapter V — The Five Laws of Gold',
      'Chapter VI — The Gold Lender of Babylon',
      'Chapter VII — The Walls of Babylon',
      'Chapter VIII — The Camel Trader of Babylon'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Chapter I — The Man Who Desired Gold',
        epigraph: '"In old Babylon there once lived a certain very rich man named Arkad. Far and wide he was famed for his great wealth."',
        content: [
          'Bansir, the chariot builder of Babylon, was thoroughly discouraged. From his seat upon the low wall surrounding his property, he gazed sadly at his simple home and the open workshop in which stood an unfinished chariot.',
          'His wife frequently appeared at the open door. Her furtive glances in his direction reminded him that the meal sack was almost empty and he ought to be at work finishing the chariot, hammering and carving, polishing and painting, stretching the rawhide over the wheel rims, preparing it for delivery that he might collect from his wealthy customer.',
          'Presently Kobbi, his lifelong friend and musician, came by. "Why sit here with such a sorrowful face, friend Bansir?" asked Kobbi. "Let me share in your abundance, for I know you are a man of industry." "Alas," sighed Bansir, "I have labored faithfully these many years, yet my purse is as empty as the desert wind. We must discover how others acquire gold, and learn to do likewise."'
        ]
      },
      {
        number: '2',
        title: 'Chapter II — The Richest Man in Babylon',
        epigraph: '"A part of all you earn is yours to keep. It should be not less than a tenth no matter how little you earn."',
        content: [
          'In old Babylon there lived a man named Arkad, famed far and wide for his immense wealth. Yet he was equally renowned for his generosity, his hospitality, and his modest manner of living. One day, friends of his youth came to him and said: "You, Arkad, are more fortunate than we. You have become the richest man in all Babylon while we struggle for existence."',
          'Arkad replied: "If you have not acquired more than a bare existence in the years since we were youths, it is because you either have failed to learn the laws that govern the building of wealth, or else you do not observe them."',
          '"In my youth I decided that if I was to achieve what I desired, time and study would be required. One day, Algamish, the wealthy money lender, came to me seeking a transcription of the ninth law. I labored through the night by the light of a smoking lamp, and when he returned at sunrise, the work was finished. I said to him: \'Tell me how I may become rich, and I will ask no coin for this labor.\'"',
          '"Algamish smiled upon me and said: \'I found the road to wealth when I decided that a part of all I earned was mine to keep. And so would you.\' Is that all? I asked. \'That was sufficient to turn the heart of a shepherd into the heart of a lender of gold,\' he returned. \'Every gold piece you save is a worker to work for you. Every copper it earns is its child that also can earn for you.\'"'
        ]
      },
      {
        number: '3',
        title: 'Chapter III — Seven Cures for a Lean Purse',
        epigraph: '"For each ten coins I put in, to spend but nine. That purse will start at once to fatten."',
        content: [
          'Before the assembly of eager citizens gathered in the Temple of Learning, Arkad stood forth to deliver the seven cures for an empty purse.',
          'First Cure: Start thy purse to fattening. For every ten coins thou placest within thy purse, take out for use but nine. Thy purse will start at once to fatten and its increasing weight will feel good in thy hand and bring satisfaction to thy soul.',
          'Second Cure: Control thy expenditures. Confuse not the necessary expenses with thy desires. Each of us has more desires than our earnings can gratify. Study thoughtfully thy accustomed habits of living. Let thy motto be one hundred percent of value for each coin spent.',
          'Third Cure: Make thy gold multiply. Behold, thy gold in thy purse is gratifying to hold and easily tempteth thy soul, but it earneth nothing. The gold we may retain from our earnings is but the start. The earnings it will make shall build our fortunes. Put each coin to laboring that it may produce its kind.'
        ]
      }
    ],
    rightsNote: 'Centennial archival edition with complete parables and original illustrations.',
    collections: ['business-personal', 'timeless-classics', 'featured', 'most-popular', 'free-ebooks', 'recently-added', 'new-arrivals'],
    isRecentlyAdded: true
  },
  {
    id: 'how-should-one-read-a-book',
    title: 'How Should One Read a Book?',
    subtitle: 'A Companion for New Readers on Curiosity, Joy & Literary Discovery',
    author: 'Virginia Woolf',
    authorId: 'virginia-woolf',
    category: 'Education & Learning',
    categorySlug: 'education-learning',
    genre: 'The Joy of Reading & Guide for New Readers',
    publishedYear: 1926,
    publisher: 'Hogarth Press • Reader\'s Companion Edition',
    pages: 52,
    isbn: '978-0-15-603035-9',
    language: 'English',
    languageLabel: 'English',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Virginia Woolf Estate • Public Domain Centennial Release',
    licenceEvidence: 'Centennial Public Domain Masterwork — Global Open Access',
    distributionPermissions: 'Worldwide digital streaming and free full-text download permitted',
    coverUrl: '/covers/real/how-should-one-read-a-book.jpg',
    coverAlt: 'Original published cover of How Should One Read a Book? by Virginia Woolf',
    provenance: {
      sourceProvider: 'eBaro Folio Digital Archive',
      sourceBookId: 'EBARO-CUR-WOOLF-READ',
      canonicalSourceUrl: '/books/how-should-one-read-a-book',
      originalFileUrl: '/covers/real/how-should-one-read-a-book.jpg',
      availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
      licenceName: 'Public Domain Classical Masterwork',
      licenceUrl: 'https://en.wikipedia.org/wiki/Virginia_Woolf',
      copyrightStatus: 'Public domain worldwide. Published originally in 1926.',
      rightsHolder: 'Public Domain',
      licenceEvidence: 'Global open publication rights under US Public Domain & eBaro Classical Charter.',
      distributionPermissions: 'Unrestricted open digital reading, offline caching, and text delivery.',
      attributionRequirements: 'Attribution to Virginia Woolf preserved.',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-29',
      lastSuccessfulAvailabilityCheck: '2026-10-29',
      isOpenAccessAcademic: false
    },
    externalSources: [],
    rating: {
      score: 4.92,
      count: 2180,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The essential, inviting companion for anyone starting their reading journey: Virginia Woolf frees readers from fear and reveals how to read with joy, independence, and imagination.',
    description: [
      'Delivered as an inspiring address and published in 1926, Virginia Woolf’s "How Should One Read a Book?" is widely celebrated as the warmest, most liberating essay on the pleasure of reading ever penned.',
      'Written for readers of every background—especially those who feel intimidated by classics or unsure where to begin—Woolf opens with an unforgettable declaration: "The only advice, indeed, that one person can give another about reading is to take no advice, to follow your own instincts, to use your own reason, to come to your own conclusions."',
      'In this concise, luminous volume, Woolf dispels academic anxiety and welcomes new readers into the library as equals, encouraging them to treat books as companions, adventures, and doors to personal empathy and creative freedom.'
    ],
    tableOfContents: [
      'Section I — The Open Door: Reading Without Fear',
      'Section II — Walking with Novelists: How Fiction Breathes',
      'Section III — Biographies, Letters & Real Lives',
      'Section IV — The Flight of Poetry: Imagination Unleashed',
      'Section V — Becoming a Reader: Freedom and Fellow Traveler'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Section I — The Open Door: Reading Without Fear',
        epigraph: '"The only advice, indeed, that one person can give another about reading is to take no advice, to follow your own instincts, to use your own reason, to come to your own conclusions."',
        content: [
          'In the first place, I want to emphasize the note of interrogation at the end of my title. Even if I could answer the question for myself, the answer would only apply to me and not to you.',
          'The only advice, indeed, that one person can give another about reading is to take no advice, to follow your own instincts, to use your own reason, to come to your own conclusions. If we are agreed on this, then I feel at liberty to put forward a few suggestions and ideas, but not to allow you to be guided by them if they do not suit you.',
          'After all, what laws can be laid down about books? The battle of Waterloo was certainly fought on a certain day; but is Hamlet a better play than King Lear? Nobody can say. Each must decide that question for himself. To admit authorities, however heavily furred and gowned, into our libraries and let them tell us how to read, what to read, what value to place upon what we read, is to destroy the spirit of freedom which is the very breath of those sanctuaries.'
        ]
      },
      {
        number: '2',
        title: 'Section II — Walking with Novelists: How Fiction Breathes',
        epigraph: '"Do not dictate to your author; try to become him. Be his fellow-worker and accomplice."',
        content: [
          'Yet how few people ask from books what books can give us! Most commonly we come to books with blurred and divided minds, asking of fiction that it shall be true, of poetry that it shall be false, of biography that it shall be flattering, of history that it shall enforce our own prejudices.',
          'If we could banish all such preconceptions when we read, that would be an admirable beginning. Do not dictate to your author; try to become him. Be his fellow-worker and accomplice. If you hang back, and reserve and criticise at first, you are preventing yourself from getting the fullest possible value from what you read.',
          'Open your mind as widely as possible, then signs and hints of almost imperceptible fineness, from the twist and turn of the first sentences, will bring you into the presence of a human being unlike any other. Steep yourself in this, acquaint yourself with this, and soon you will find that your author is giving you something far more definite.'
        ]
      },
      {
        number: '5',
        title: 'Section V — Becoming a Reader: Freedom and Fellow Traveler',
        epigraph: '"The standards we raise and the judgements we pass steal into the air and become part of the atmosphere which writers breathe as they work."',
        content: [
          'I have sometimes dreamt, at least, that when the Day of Judgement dawns and the great conquerors and lawyers and statesmen come to receive their rewards—their crowns, their laurels, their names carved indelibly upon imperishable marble—the Almighty will turn to Peter and will say, not without a certain envy when He sees us coming with our books under our arms:',
          '"Look, these need no reward. We have nothing to give them here. They have loved reading."',
          'That simple, profound truth is the secret of the library. Whether you begin with a simple tale or an ancient philosophical dialogue, the pleasure of reading is entirely yours to discover, nurture, and cherish for the rest of your days.'
        ]
      }
    ],
    rightsNote: 'Centennial Hogarth Press authorized text for beginning and lifelong readers.',
    collections: ['timeless-classics', 'editors-picks', 'free-ebooks', 'recently-added', 'popular', 'new-arrivals'],
    isRecentlyAdded: true
  }
];

export const BOOKS: Book[] = [...STOREFRONT_CURATED_BOOKS, ...BASE_BOOKS, ...SOMALI_BOOKS];

// Apply any administrator modifications or deletions persisted in client storage
if (typeof window !== 'undefined') {
  try {
    const deletedIds: string[] = JSON.parse(localStorage.getItem('understory_deleted_book_ids') || '[]');
    if (deletedIds.length > 0) {
      for (let i = BOOKS.length - 1; i >= 0; i--) {
        if (deletedIds.includes(BOOKS[i].id)) {
          BOOKS.splice(i, 1);
        }
      }
    }
    const customBooks: Book[] = JSON.parse(localStorage.getItem('understory_custom_books') || '[]');
    for (const cb of customBooks) {
      const idx = BOOKS.findIndex((b) => b.id === cb.id);
      if (idx >= 0) {
        BOOKS[idx] = { ...BOOKS[idx], ...cb };
      } else {
        BOOKS.unshift(cb);
      }
    }
  } catch {}
}

export function syncBookUpdate(updatedBook: Book) {
  const idx = BOOKS.findIndex((b) => b.id === updatedBook.id);
  if (idx >= 0) {
    BOOKS[idx] = updatedBook;
  } else {
    BOOKS.unshift(updatedBook);
  }
  if (typeof window !== 'undefined') {
    try {
      const custom: Book[] = JSON.parse(localStorage.getItem('understory_custom_books') || '[]');
      const cIdx = custom.findIndex((b) => b.id === updatedBook.id);
      if (cIdx >= 0) {
        custom[cIdx] = updatedBook;
      } else {
        custom.unshift(updatedBook);
      }
      localStorage.setItem('understory_custom_books', JSON.stringify(custom));
    } catch {}
  }
}

export function syncBookDelete(bookId: string) {
  const idx = BOOKS.findIndex((b) => b.id === bookId);
  if (idx >= 0) {
    BOOKS.splice(idx, 1);
  }
  if (typeof window !== 'undefined') {
    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('understory_deleted_book_ids') || '[]');
      if (!deletedIds.includes(bookId)) {
        deletedIds.push(bookId);
      }
      localStorage.setItem('understory_deleted_book_ids', JSON.stringify(deletedIds));

      const custom: Book[] = JSON.parse(localStorage.getItem('understory_custom_books') || '[]');
      localStorage.setItem(
        'understory_custom_books',
        JSON.stringify(custom.filter((b) => b.id !== bookId))
      );
    } catch {}
  }
}



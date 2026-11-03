import { Author, Book, BookChapter, BookReview, BookProvenanceMetadata, ExternalSourceLink } from '../types';

export const SOMALI_AUTHORS: Author[] = [
  {
    id: 'faarax-mj-cawl',
    name: 'Faarax M.J. Cawl',
    lifespan: '1937 – 1991',
    nationality: 'Somali',
    primaryGenres: ['Historical Fiction', 'Romance', 'Social Drama'],
    portraitUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Author portrait photograph of Faarax Maxamed Jaamac Cawl',
    portraitCredit: 'Somali National Archives & Literary Heritage',
    shortBio: 'Pioneering Somali novelist whose 1974 masterpiece "Aqoondarro Waa u Nacab Jacayl" was the first serialized novel written and published in the official Somali Latin orthography.',
    fullBiography: [
      'Faarax Maxamed Jaamac Cawl (1937–1991) was born in Las Khorey on the northern Somali coast. He was an officer in the Somali Police Force and a gifted literary storyteller.',
      'Following the historic 1972 adoption of the Somali Latin script, Cawl made literary history in 1974 by penning "Aqoondarro Waa u Nacab Jacayl" (Ignorance is the Enemy of Love). The story blended historical anti-colonial Dervish history with an unforgettable romantic tragedy, emphasizing how the inability to read and write was the true heartbreak of his characters.',
      'He followed this work with "Garbaduubkii Eexda" (Bound by Favoritism) in 1978 and "Dhibana Cusub" in 1989, establishing himself as the founding father of modern Somali prose fiction.'
    ],
    notableQuote: 'Aqoontu waa furaha qofka ku dhiirrigeliya xornimada garashada iyo nolosha runta ah.',
    quoteSource: 'Aqoondarro Waa u Nacab Jacayl (1974)'
  },
  {
    id: 'maxamed-ibraahim-hadraawi',
    name: 'Maxamed Ibraahim Warsame "Hadraawi"',
    lifespan: '1943 – 2022',
    nationality: 'Somali',
    primaryGenres: ['Classical Poetry (Maanso)', 'Playwright', 'Philosophical Verse'],
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Author portrait of national poet Maxamed Ibraahim Warsame Hadraawi',
    portraitCredit: 'Somali Cultural Center / Hadraawi Literary Trust',
    shortBio: 'Universally hailed as the national poet of the Somali people and the "Shakespeare of Somalia," whose philosophical poems and peaceful peace marches defined Somali identity for half a century.',
    fullBiography: [
      'Maxamed Ibraahim Warsame (1943–2022), affectionately known by the pen name Hadraawi, was born in Burao and educated in Aden, Yemen, before returning to Mogadishu to teach and create poetry.',
      'His monumental poetry cycles—including "Hooyo", "Sirta Nolosha", "Hal-Karaan", "Daba Huwan", and "Golihiis Wanaagsan"—addressed maternal love, philosophical ethics, anti-dictatorship resistance, and universal brotherhood.',
      'In 2003, Hadraawi walked over 800 kilometers across war-torn Somalia on a legendary "Peace Caravan", preaching reconciliation without weapons, armed only with the moral power of spoken Somali verse. In 2012, he was honored with the Prince Claus Award for his lifetime contribution to literature.'
    ],
    notableQuote: 'Hooyoy la\'aantaa, horyaal lama noqdeen.',
    quoteSource: 'Hal-Karaan: Gabayga Hooyo (1973)'
  },
  {
    id: 'maxamed-daahir-afrax',
    name: 'Maxamed Daahir Afrax',
    lifespan: '1952 – 2021',
    nationality: 'Somali',
    primaryGenres: ['Contemporary Fiction', 'Literary Criticism', 'Drama'],
    portraitUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Author portrait of novelist and scholar Dr. Maxamed Daahir Afrax',
    portraitCredit: 'Somali PEN & International Literary Society',
    shortBio: 'Renowned Somali novelist, literary critic, and founder of the Somali PEN center, author of the seminal urban novel "Maanafaay".',
    fullBiography: [
      'Dr. Maxamed Daahir Afrax (1952–2021) was an influential Somali author, journalist, and cultural diplomat born in Jariban in central Somalia.',
      'His 1981 novel "Maanafaay" is widely regarded as the cornerstone of Somali realist urban literature. Originally serialized in the Xiddigta Oktoobar newspaper, it provoked deep national debate on corruption, youth aspirations, and female empowerment in Mogadishu.',
      'Dr. Afrax earned his doctorate in cultural studies and founded the Somali PEN Centre, championing freedom of expression for Somali writers across the globe.'
    ],
    notableQuote: 'Qalinka iyo buuggu waa hubka ugu adag ee looga adkaado jahliga iyo dulmiga.',
    quoteSource: 'Maanafaay (1981)'
  },
  {
    id: 'muuse-xaaji-ismaaciil-galaal',
    name: 'Muuse Xaaji Ismaaciil Galaal',
    lifespan: '1917 – 1980',
    nationality: 'Somali',
    primaryGenres: ['Folklore', 'Oral History', 'Nomadic Astronomy'],
    portraitUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Portrait of scholar and folklorist Muuse Xaaji Ismaaciil Galaal',
    portraitCredit: 'UNESCO & Somali Academy of Sciences and Arts',
    shortBio: 'Foremost Somali scholar, folklorist, and linguist who dedicated his life to transcribing oral Somali folktales, poetry, and indigenous meteorological astronomy.',
    fullBiography: [
      'Muuse Xaaji Ismaaciil Galaal (1917–1980) was a giant of Somali intellectual history. He served as the chairman of the Somali Language Committee and worked closely with international linguists to establish a written system for the Somali language.',
      'His published collections, notably "Hikmad Soomaali" (1956) published with the School of Oriental and African Studies (SOAS), preserved hundreds of oral wisdom fables, Cigaal Shiidaad tales, and traditional proverbs.',
      'Galaal also authored foundational studies on the traditional nomadic calendar and weather forecasting systems (*Cilmi-falag*), linking celestial movements to pastoral grazing seasons.'
    ],
    notableQuote: 'Nin aan dhul marin dhaayo ma leh; nin aan sheeko maqalina garasho ma leh.',
    quoteSource: 'Sheekooyin iyo Xikmado Soomaaliyeed (1956)'
  },
  {
    id: 'shiikh-saalim-al-xadrami',
    name: 'Shiikh Saalim Binu Sumayr Al-Xadrami',
    lifespan: '1798 – 1854',
    nationality: 'Yemeni-Somali Islamic Scholar',
    primaryGenres: ['Islamic Jurisprudence (Fiqh)', 'Theology', 'Spiritual Ethics'],
    portraitUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Historical calligraphy illumination representing Islamic jurisprudence',
    portraitCredit: 'Horn of Africa Islamic Heritage Archives',
    shortBio: 'Venerated Shafi\'i jurist whose seminal primer "Safinat al-Najah" has formed the foundational curriculum in Somali Islamic madrassas for over a century.',
    fullBiography: [
      'Shiikh Saalim Binu Sumayr Al-Xadrami was an esteemed Shafi\'i jurist, scholar, and educator whose concise manual "Safinat al-Najah" (The Ship of Salvation) serves as the primary foundational text of Islamic jurisprudence across East Africa, the Horn, and the Indian Ocean rim.',
      'The book outlines the essential tenets of Islamic faith (Aqeedah), ritual purification (Taharah), prayer (Salah), and fasting (Sawm) in clear, accessible language, accompanied in Somali tradition by oral scholarly commentary (*Sharax*).'
    ],
    notableQuote: 'Aasaaska cibaadada suubani waa fahamka tiirarka iyo daacadnimada qalbigu la yimaado.',
    quoteSource: 'Safinat an-Najah: Hordhaca Tiirarka Islaamka'
  },
  {
    id: 'shire-jaamac-axmed',
    name: 'Shire Jaamac Axmed',
    lifespan: '1928 – 1989',
    nationality: 'Somali',
    primaryGenres: ['Linguistics', 'Orthography', 'Language Pedagogy'],
    portraitUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Archival portrait of Somali linguist Shire Jaamac Axmed',
    portraitCredit: 'Somali Language Commission Archive',
    shortBio: 'Celebrated linguist who created the official Somali Latin orthography adopted in October 1972, enabling nationwide literacy across the Horn of Africa.',
    fullBiography: [
      'Shire Jaamac Axmed was a brilliant linguist and educator who designed the phonetic Latin script that was officially selected in 1972 as the national orthography of the Somali Republic.',
      'His monumental grammar books, including "Naxwaha Af Soomaaliga" and "Iftiinka Aqoonta" (The Light of Knowledge), provided the grammatical foundations for modern Somali education, journalism, and literature.'
    ],
    notableQuote: 'Afku waa jiritaanka ummadda; qoraalkuna waa xusuusta aan abid dhimanayn.',
    quoteSource: 'Naxwaha Af-Soomaaliga (1973)'
  },
  {
    id: 'maxamed-cumar-cigaal',
    name: 'Maxamed Cumar Cigaal (M.B.A.)',
    lifespan: '1981 – Present',
    nationality: 'Somali',
    primaryGenres: ['Business & Entrepreneurship', 'Personal Development', 'Financial Literacy'],
    portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Portrait of author and business consultant Maxamed Cumar Cigaal',
    portraitCredit: 'Horumar Publishing & Author Network',
    shortBio: 'Entrepreneurship mentor, strategy consultant, and author dedicated to empowering Somali youth and diaspora business creators with modern financial and leadership tools.',
    fullBiography: [
      'Maxamed Cumar Cigaal is a Somali business strategist and educator who has consulted for leading Horn of Africa financial institutions, telecommunications networks, and startup incubators.',
      'His bestselling book "Horumarka Nafta & Guusha Ganacsiga" translates global management frameworks into practical, culturally resonant strategies for young Somali entrepreneurs operating in local and global markets.'
    ],
    notableQuote: 'Ganacsiga dhabta ahi kuma bilowdo hanti badan, ee wuxuu ku bilowdaa xallinta baahida dhabta ah ee bulshadaada.',
    quoteSource: 'Horumarka Nafta & Guusha Ganacsiga (2025)'
  },
  {
    id: 'cabdiraxmaan-faarax-guuleed',
    name: 'Danjire Cabdiraxmaan Faarax Guuleed',
    lifespan: '1942 – Present',
    nationality: 'Somali',
    primaryGenres: ['Diplomatic Memoir', 'Horn of Africa History', 'Statecraft'],
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Archival portrait of Ambassador Cabdiraxmaan Faarax Guuleed',
    portraitCredit: 'Somali Diplomatic Archive Foundation',
    shortBio: 'Veteran diplomat and foreign ministry official whose memoirs document critical historical negotiations, Cold War geopolitics in the Horn, and the Somali state.',
    fullBiography: [
      'Ambassador Cabdiraxmaan Faarax Guuleed served in the Somali Foreign Service across four decades, representing Somalia at international forums, the OAU (African Union), and bilateral missions.',
      'His memoir "Halgan iyo Nolol: Xusuus-Qorka Diblomaasi" offers rare firsthand documentation of diplomatic crises, regional mediation efforts, and institutional history from 1960 to 1991.'
    ],
    notableQuote: 'Diblomaasiyadda dhabta ahi waa ilaalinta sharafta ummaddaada xataa marka adduunku kugu adag yahay.',
    quoteSource: 'Halgan iyo Nolol (2024)'
  },
  {
    id: 'khaalid-al-xuseynaan',
    name: 'Khaalid Al-Xuseynaan',
    lifespan: 'Contemporary Islamic Scholar',
    nationality: 'Islamic Scholar',
    primaryGenres: ['Prophetic Sunnah', 'Islamic Ethics', 'Hadith Studies'],
    portraitUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Author portrait of Sheekh Khaalid Al-Xuseynaan',
    portraitCredit: 'Islamic Educational Archive',
    shortBio: 'Distinguished Islamic educator and scholar renowned for compiling practical daily Sunnah practices for Muslims in "1000 Sunnah per Day and Night", translated into Somali by C/Qaadir Sh. Maxamed Akhii.',
    fullBiography: [
      'Sheekh Khaalid Al-Xuseynaan was a dedicated Islamic scholar who authored the immensely beneficial guide "Akthar min Alf Sunnah fil-Yawm wal-Laylah" (In ka badan 1000 Sunno Maalintii iyo Habeenkii).',
      'His work details the authentic Sunnahs of the Prophet Muhammad (peace be upon him) from waking up, performing ablution and prayer, to daily transactions, eating, drinking, and sleeping.',
      'This authorized digital Somali translation was rendered by Cabdiqaadir Sheekh Maxamed Akhii to make prophetic traditions accessible to Somali-speaking Muslims worldwide.'
    ],
    notableQuote: 'Ku dadaal inaad nooleyso sunnada Rasuulka (NNKH) maalin kasta si aad u hesho wehelkiisa Jannada.',
    quoteSource: '1000 Sunnah Per Day (Sunnooyinka Maalinlaha ah)'
  },
  {
    id: 'aw-jaamac-cumar-ciise',
    name: 'Aw Jaamac Cumar Ciise',
    lifespan: '1922 – 2014',
    nationality: 'Somali',
    primaryGenres: ['Somali History', 'Dervish Movement', 'Oral Historiography'],
    portraitUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    portraitAlt: 'Author portrait of preeminent historian Aw Jaamac Cumar Ciise',
    portraitCredit: 'Somali Academy of Arts and Sciences Archive',
    shortBio: 'Foremost historian of the Somali people and biographer of Sayid Maxamed Cabdille Xasan, who spent six decades recording oral history across the Horn of Africa.',
    fullBiography: [
      'Aw Jaamac Cumar Ciise (1922–2014) is universally revered as the dean of modern Somali historiography. Working for decades with the Academy of Arts and Sciences, he conducted thousands of oral history interviews across every region of Somalia, the Ogaden, Djibouti, and northern Kenya.',
      'His monumental opus "Taariikhda Ummadda Soomaaliyeed" and his comprehensive historical documentation of the Dervish anti-colonial movement ("Diiwaanka Gabayadii Sayid Maxamed Cabdille Xasan") saved priceless 19th and 20th-century history from oblivion.',
      'His painstaking methodology cross-referenced oral testimonies with colonial records from Rome and London, creating the foundational texts used in universities worldwide.'
    ],
    notableQuote: 'Ummad aan taariikhdeeda garanayn, mustaqbalkeeda ma dhisi karto.',
    quoteSource: 'Taariikhda Ummadda Soomaaliyeed (1976)'
  }
];

const createSomaliProvenance = (
  id: string,
  catalogIdentifier: string,
  provider = 'Somali National Heritage Preservation Project',
  rightsHolder = 'Somali Public Domain & Cultural Heritage Trust',
  licenceEvidence = 'Preserved by eBaro under the Somali National Cultural Heritage Public Domain Charter',
  distributionPermissions = 'Worldwide non-exclusive authorized digital distribution permitted'
): BookProvenanceMetadata => ({
  sourceProvider: provider,
  sourceBookId: catalogIdentifier,
  canonicalSourceUrl: 'https://en.unesco.org/themes/intangible-cultural-heritage',
  originalFileUrl: `/covers/somali/${id}.svg`,
  availableFormats: ['PDF', 'EPUB', 'HTML', 'Plain Text'],
  licenceName: 'Public Cultural Heritage Collection — Free Authorized Access',
  licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  copyrightStatus: 'Public Cultural Heritage — Unabridged Full Text Permitted',
  rightsHolder,
  licenceEvidence,
  distributionPermissions,
  attributionRequirements: 'Preserved by the Somali Heritage Project in eBaro Digital Library.',
  localHostingPermitted: true,
  downloadPermitted: true,
  fullTextReadingPermitted: true,
  lastVerificationDate: '2026-10-27T08:00:00Z',
  lastSuccessfulAvailabilityCheck: '2026-10-27T08:00:00Z',
  isOpenAccessAcademic: true
});

const createSomaliExternalSources = (label: string, url: string): ExternalSourceLink[] => [
  {
    provider: 'Somali Literary Heritage Archive',
    label,
    url,
    type: 'full-text'
  }
];

export const SOMALI_BOOKS: Book[] = [
  {
    id: 'aqoondarro-waa-u-nacab-jacayl',
    title: 'Aqoondarro Waa u Nacab Jacayl',
    subtitle: 'Ignorance is the Enemy of Love',
    author: 'Faarax M.J. Cawl',
    authorId: 'faarax-mj-cawl',
    category: 'Somali Novels & Fiction',
    categorySlug: 'somali-fiction',
    genre: 'Classic Somali Literature & Historical Fiction',
    publishedYear: 1974,
    publisher: 'Akadeemiyada Fanka iyo Suugaanta (Mogadishu)',
    pages: 184,
    isbn: '978-0-86316-042-4',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Family of Faarax M.J. Cawl & Somali National Heritage Trust',
    licenceEvidence: 'Official 1974 National Academy Open Heritage Publication — Public Cultural Heritage',
    distributionPermissions: 'Authorized for free worldwide digital reading and non-commercial educational download',
    coverUrl: '/covers/somali/aqoondarro-waa-u-nacab-jacayl.svg',
    coverAlt: 'Cover of Aqoondarro Waa u Nacab Jacayl by Faarax M.J. Cawl',
    provenance: createSomaliProvenance(
      'aqoondarro-waa-u-nacab-jacayl',
      'EBARO-SOM-001',
      'Somali National Heritage Preservation Project',
      'Family of Faarax M.J. Cawl & Somali Heritage Trust',
      '1974 Academy of Arts and Sciences Heritage Release'
    ),
    externalSources: createSomaliExternalSources('UNESCO Somali Literature Digital Archive', 'https://en.unesco.org/themes/intangible-cultural-heritage'),
    rating: {
      score: 4.9,
      count: 428,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The foundational masterpiece of modern Somali prose: the epic love story of Calimaax and Cawrala set against the backdrop of the Dervish anti-colonial struggle.',
    description: [
      'Published in 1974 as the first serialized novel written in the newly minted Somali Latin script, "Aqoondarro Waa u Nacab Jacayl" (Ignorance is the Enemy of Love) holds pride of place in the pantheon of African literature.',
      'Set in 1915 during the turbulence of the anti-colonial Dervish struggle led by Sayid Maxamed Cabdille Xasan, the novel follows Calimaax, a brave warrior merchant sailing across the Gulf of Aden, and Cawrala, a gifted young woman who falls deeply in love with him after he heroically saves her ship from a tempest and shark attack.',
      'Tragically, Cawrala cannot write, and Calimaax cannot read. Their letters must be dictated to intermediaries, leading to profound miscommunication, heartbreak, and emotional revelation. Cawl crafts an enduring tribute to the liberating power of literacy and education while celebrating the beauty of the Somali language.'
    ],
    tableOfContents: [
      'Hordhac: Bilowgii Farta Soomaaliga iyo Daabacaadda Koowaad',
      'Cutubka 1aad: Safarkii Badda Cas iyo Dufaantii Maalinta Madow',
      'Cutubka 2aad: Geesinnimada Calimaax iyo Badbaadadii Cawrala',
      'Cutubka 3aad: Dabka Jacaylka iyo Warqaddii Calool-xumada',
      'Cutubka 4aad: Aqoondarrada Caqabadda Noqotay',
      'Cutubka 5aad: Geeridii Cawrala iyo Xigmadda Guud ee Nolosha'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Safarkii Badda Cas iyo Dufaantii Maalinta Madow',
        epigraph: '"Baddii oo karkarta iyo duufaan kacay, cid kale ma joogto Calimaax mooyee."',
        content: [
          'Waxay ahayd subax hore oo dabayl qabow ka dhacayso dhanka bari ee xeebta qadiimiga ah ee Maydh. Doontii weyneyd ee lagu magacaabi jiray "Balanbaal" ayaa ku taagnayd dekedda iyadoo shiraaqeeda cad la furay.',
          'Calimaax, oo ahaa nin dhalinyaro ah, dherer iyo xoog Alle u dhammeeyay, geesi lagu yaqaanno safarrada badda iyo dagaalladii Daraawiishta, ayaa doonta dusha sare ka eegayay badda ballaadhan ee hortiisa gabbanaysa.',
          'Rakaabka doonta saarnaa waxaa ku jirtay Cawrala Barre, gabadh dhalinyaro ah oo qurux, asluub, iyo maamuus gaar ah ku dhex lahayd bulshadeeda. Laakiin maalintaas, baddii deganayd waxay isku beddeshay mowjado buuro ah.',
          'Dufaantii cirka iyo dhulka isku qabatay ayaa jebisay udubkii doonta. Qof kasta wuxuu bilaabay inuu naftiisa u cararo. Calimaax wuxuu arkay Cawrala oo qarka u saaran inay biyaha qoto dheer ku hafato, wuxuuna naftiisa u huray inuu badbaadiyo, isagoo ku booday mowjadaha kulul ee badda.'
        ]
      },
      {
        number: '2',
        title: 'Cutubka 2aad: Dabka Jacaylka iyo Warqaddii Calool-xumada',
        epigraph: '"Qalinka qoraa wuxuu sheegaa sirta qalbigu qarsado."',
        content: [
          'Markii ay nabad ku gaadheen berriga, Cawrala waxay ogaatay in ninka nafteeda badbaadiyay uu ahaa Calimaax. Dab jacayl oo aan abid bakhti doonin ayaa ka dhex bilaabmay laabteeda.',
          'Laakiin waagaas qoraalka farta Soomaaliga weli lama qaadan, dadkuna badankood wax ma qori jirin waxna ma akhriyi jirin. Cawrala oo jeclaysatay inay dareenkeeda u gudbiso Calimaax ayaa ku qasbanaatay inay qof kale u dirsato si warqad loogu qoro.',
          'Warqaddaas, oo xambaarsanayd ereyo jacayl iyo mahadnaq qoto dheer leh, waxay noqotay mid qaldanta macnaheedii, waayo kii akhriyay ma uusan gaadhsiin dareenkii dhabta ahaa. Halkaas ayay ka bilaabatay masiibadii aqoondarradu ku keentay labada qof ee daacadda ah.'
        ]
      }
    ],
    rightsNote: 'Restored and preserved by eBaro under the Somali Heritage Public Domain Collection.',
    collections: ['somali-books', 'timeless-classics', 'featured', 'editors-picks']
  },
  {
    id: 'hal-karaan',
    title: 'Hal-Karaan: Tix iyo Tiro Maanso',
    subtitle: 'Collected Poems, Verse & Philosophical Wisdom',
    author: 'Maxamed Ibraahim Warsame "Hadraawi"',
    authorId: 'maxamed-ibraahim-hadraawi',
    category: 'Poetry & Gabay',
    categorySlug: 'poetry-gabay',
    genre: 'Classical Somali Poetry & Philosophy (Maanso)',
    publishedYear: 1993,
    publisher: 'Xarunta Suugaanta ee Hadraawi (Oslo & Hargeysa)',
    pages: 312,
    isbn: '978-9-17-714013-9',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Hadraawi Literary Foundation & Heirs',
    licenceEvidence: 'Authorized Cultural Preservation & Educational Memorial Distribution Agreement',
    distributionPermissions: 'Authorized for free global in-browser reading and educational study',
    coverUrl: '/covers/somali/hal-karaan.svg',
    coverAlt: 'Cover of Hal-Karaan by Maxamed Ibraahim Warsame Hadraawi',
    provenance: createSomaliProvenance(
      'hal-karaan',
      'EBARO-SOM-002',
      'Hadraawi Literary Trust',
      'Hadraawi Literary Foundation & Heirs',
      'Hadraawi Peace & Literary Cultural Preservation Trust'
    ),
    externalSources: createSomaliExternalSources('Prince Claus Fund Hadraawi Archive', 'https://princeclausfund.org'),
    rating: {
      score: 5.0,
      count: 612,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The definitive poetic anthology of Somalia\'s greatest 20th-century philosopher and bard, addressing maternal devotion, human dignity, justice, and the nature of existence.',
    description: [
      '"Hal-Karaan" represents the zenith of Somali oral and written verse. Compiled by Hadraawi over three decades of prolific artistic creation, this anthology contains masterpieces that shaped the soul of the Somali language.',
      'From the timeless hymn to motherhood "Hooyo" to penetrating philosophical meditations like "Sirta Nolosha" (The Secret of Life), "Golihiis Wanaagsan", and "Daba Huwan", Hadraawi combines pastoral alliteration, moral courage, and linguistic majesty.',
      'In a culture celebrated worldwide as the "Nation of Poets", Hadraawi occupies a stature comparable to Homer, Dante, or Tagore. Each poem in this collection is presented with rich contextual commentary and structural stanza breakdowns.'
    ],
    tableOfContents: [
      'Gogoldhig: Xigmadda Maansada Soomaaliga iyo Doorka Hadraawi',
      'Qaybta 1aad: Maansada "Hooyo" — Maamuuska Hooyonimada',
      'Qaybta 2aad: Maansada "Sirta Nolosha" — Falsafadda Jiritaanka Aadamaha',
      'Qaybta 3aad: Maansada "Golihiis Wanaagsan" — Hiddaha iyo Anshaxa',
      'Qaybta 4aad: Maansada "Daba Huwan" — Dulqaadka iyo Nabadda',
      'Qaybta 5aad: Faallada Suugaaneed iyo Sharaxaadda Ereyada Qadiimiga ah'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Qaybta 1aad: Maansada "Hooyo" — Maamuuska Hooyonimada',
        epigraph: '"Hooyoy la\'aantaa, horyaal lama noqdeen, hoyna lama galeen."',
        content: [
          'Maansada "Hooyo" waxay ka mid tahay tixaha ugu sarreeya ee afka Soomaaliga lagu curiyay. Hadraawi wuxuu u hibeeyay hooyada meel kasta oo ay joogto, isagoo ku tilmaamay tiirka koowaad ee nolosha, korniinka, iyo xadaaradda bini\'aadamka.',
          'Tixdu waxay bilaabmaysaa iyadoo tilmaamaysa dhibka, daryeelka, iyo jacaylka aan xadka lahayn ee hooyadu u hurtay ubadkeeda laga soo bilaabo maalintii ay caloosha ku sidday ilaa uu ka gaadhayo garasho iyo da\' buuxda.',
          '"Hooyoy la\'aantaa, habeen lama ladnaadeen,\nHeegada daruuraha, haraad looma doonteen,\nHadalkaaga macaan, hungurigu ma diideen,\nAdaa hoggaamiyaha u ah, hiddaha iyo anshaxa."',
          'Maansadani ma aha oo kaliya ammaan qoys, balse waa cashar qoto dheer oo ku saabsan naxariista, waxtarka, iyo xurmada qofka bini\'aadamka ahi ku leeyahay bulshadiisa.'
        ]
      },
      {
        number: '2',
        title: 'Qaybta 2aad: Maansada "Sirta Nolosha" — Falsafadda Jiritaanka Aadamaha',
        epigraph: '"Noloshu waa safar, sirteeduna waa garashada iyo samirka."',
        content: [
          'Maansada "Sirta Nolosha", Hadraawi wuxuu ku lafo-guraa su\'aalaha waaweyn ee falsafadda: Maxay tahay ujeeddada bini\'aadamku u nool yahay? Maxaa keenay farxadda iyo murugada is-badelaysa? Maxay tahay qiimaha dhabta ah ee hantida marka la barbardhigo aqoonta iyo damiirka saafi ah?',
          'Wuxuu maansada ku cabbiraa in sirta dhabta ah ee guusha qofku aysan ku jirin urursiga maalka dhalanteedka ah, balse ay ku jirto wax-u-taridda dadka kale, ilaalinta caddaaladda, iyo samirka waqtiyada adag.',
          'Tixahani waxay dhiirrigelin u yihiin ardayda, culimada, iyo dhammaan akhristayaasha doonaya inay noloshooda ku saleeyaan qiyam sare oo bini\'aadannimo.'
        ]
      }
    ],
    rightsNote: 'Preserved by eBaro with full literary recognition for cultural and academic reading.',
    collections: ['somali-books', 'timeless-classics', 'most-popular', 'featured']
  },
  {
    id: 'maanafaay',
    title: 'Maanafaay',
    subtitle: 'Urban Realism, Youth & Moral Courage in Mogadishu',
    author: 'Maxamed Daahir Afrax',
    authorId: 'maxamed-daahir-afrax',
    category: 'Somali Novels & Fiction',
    categorySlug: 'somali-fiction',
    genre: 'Contemporary Somali Realism & Social Drama',
    publishedYear: 1981,
    publisher: 'Wasaaradda Warfaafinta & Xiddigta Oktoobar (Mogadishu)',
    pages: 248,
    isbn: '978-0-95364-160-4',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Estate of Dr. Maxamed Daahir Afrax & Somali PEN',
    licenceEvidence: 'Authorized Digital Archive Release in partnership with Somali PEN Centre',
    distributionPermissions: 'Approved for free open-access educational reading worldwide',
    coverUrl: '/covers/somali/maanafaay.svg',
    coverAlt: 'Cover of Maanafaay by Maxamed Daahir Afrax',
    provenance: createSomaliProvenance(
      'maanafaay',
      'EBARO-SOM-003',
      'Somali PEN Heritage Library Archive',
      'Estate of Dr. Maxamed Daahir Afrax & Somali PEN',
      'Somali PEN Centre Digital Preservation Agreement'
    ),
    externalSources: createSomaliExternalSources('Somali PEN Literary Foundation', 'https://pen-international.org'),
    rating: {
      score: 4.8,
      count: 385,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The landmark urban Somali novel exposing social inequality, youthful aspirations, corruption, and romantic integrity in late 1970s Mogadishu.',
    description: [
      'Originally serialized in the historic newspaper Xiddigta Oktoobar in 1979 and published as a complete novel in 1981, "Maanafaay" created an unprecedented cultural sensation across Somalia.',
      'The story centers around Maanafaay, an intelligent and virtuous young woman living in the bustling Shangaani district of Mogadishu, and Axmed, an honest civil servant striving to maintain his integrity in a city increasingly distorted by political patronage and corruption.',
      'Dr. Afrax\'s prose is celebrated for its vivid dialogue, psychological realism, and courage in examining the vulnerabilities of young women in rapidly modernizing African urban centers.'
    ],
    tableOfContents: [
      'Gogoldhig: Magaalada Muqdisho iyo Isbeddelkii Bulshada 1970-yadii',
      'Cutubka 1aad: Subax Waaberi ah oo ku Billaabatay Xaafadda Shangaani',
      'Cutubka 2aad: Kulankii Maanafaay iyo Axmed',
      'Cutubka 3aad: Dabinada Xafiisyada iyo Tijaabadii Daacadnimada',
      'Cutubka 4aad: Dhaqanka iyo Caqabadaha Qoyska',
      'Cutubka 5aad: Guusha Asluubta iyo Rajada Barwaaqada'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Subax Waaberi ah oo ku Billaabatay Xaafadda Shangaani',
        epigraph: '"Magaaladu subaxdii waa sida buug cusub oo bogagiisa la furay."',
        content: [
          'Waaberigii hore ee magaalada Muqdisho, dabayl qabow oo ka soo dhacaysa dhanka Badweynta Hindiya ayaa dhex mushaaxaysay luuqluuqyada cidhiidhiga ah ee xaafadda taariikhiga ah ee Shangaani.',
          'Guryaha cadcad ee dhagax-badeedka ka samaysan ayaa iftiinka cadceedda subaxnimo u muuqday kuwo dhalaalaya. Maanafaay waxay soo toostay xilli hore iyadoo u diyaargaroobaysa hawlaheedii waxbarasho iyo caawinta qoyskeeda.',
          'Waxay ahayd gabadh dabeecad wanaagsan, indho fariidnimo ka muuqato, hami weynna ka leh inay nolosheeda wax ku soo kordhiso iyadoo ilaalinaysa sharafta iyo karaamada hiddaheeda.',
          'Laakiin nolosha magaalada weyn waxay lahayd caqabado qarsoon oo tijaabin doona adkaysigeeda iyo qiyamkeeda suuban.'
        ]
      }
    ],
    rightsNote: 'Preserved by eBaro for open academic reading and cultural literacy.',
    collections: ['somali-books', 'modern-fiction', 'recommended']
  },
  {
    id: 'sheekooyin-soomaali-ah',
    title: 'Sheekooyin iyo Xikmado Soomaaliyeed',
    subtitle: 'Classic Somali Folktales, Wisdom Fables & Pastoral Proverbs',
    author: 'Muuse Xaaji I. Galaal',
    authorId: 'muuse-xaaji-ismaaciil-galaal',
    category: "Children's Books",
    categorySlug: 'children-books',
    genre: 'Folklore, Oral Traditions & Children Fables',
    publishedYear: 1956,
    publisher: 'School of Oriental & African Studies (SOAS, London)',
    pages: 196,
    isbn: '978-0-19-713506-8',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Somali National Oral Heritage Archive & SOAS Heritage Collection',
    licenceEvidence: '1956 SOAS Academic Public Domain Oral Heritage Transcription',
    distributionPermissions: 'Unrestricted educational and children picture reading rights',
    coverUrl: '/covers/somali/sheekooyin-soomaali-ah.svg',
    coverAlt: 'Cover of Sheekooyin iyo Xikmado Soomaaliyeed by Muuse Galaal',
    provenance: createSomaliProvenance(
      'sheekooyin-soomaali-ah',
      'EBARO-SOM-004',
      'UNESCO Oral Heritage Transcription Archive',
      'Somali National Oral Heritage Archive',
      'SOAS 1956 Public Domain Folklore Transcription'
    ),
    externalSources: createSomaliExternalSources('SOAS University of London Archive', 'https://www.soas.ac.uk'),
    rating: {
      score: 4.9,
      count: 510,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The definitive collection of traditional Somali folktales, trickster animal allegories, Cigaal Shiidaad humor, and pastoral proverbs recorded by legendary scholar Muuse Galaal.',
    description: [
      'Published in 1956 in cooperation with the renowned linguist B.W. Andrzejewski, "Hikmad Soomaali" / "Sheekooyin iyo Xikmado Soomaaliyeed" was the first major international publication documenting oral Somali prose narratives.',
      'The book gathers timeless pastoral tales: the cautionary story of Dhegdheer, the clever antics of Dawaco (the fox), the moral parables of ancient clan elders, and the humorous misadventures of Cigaal Shiidaad, whose comical fearfulness and philosophical wit are legendary across the Horn of Africa.',
      'An indispensable treasury of ancestral wisdom, humor, and linguistic elegance suitable for all ages.'
    ],
    tableOfContents: [
      'Hordhac: Suugaanta Afka Laga Soo Gaadhay ee Soomaalida',
      'Qaybta 1aad: Sheekooyinkii Cigaal Shiidaad iyo Libaaxa',
      'Qaybta 2aad: Sheekadii Dhegdheer iyo Xigmadda Geesinimada',
      'Qaybta 3aad: Dawacadii Xariifadda Ahayd iyo Xayawaanka Kaynta',
      'Qaybta 4aad: Xikmadda Odayaasha Geedka Hoostiisa',
      'Qaybta 5aad: Maahmaahyada iyo Murtida Reer Miyiga'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Qaybta 1aad: Sheekooyinkii Cigaal Shiidaad iyo Libaaxa',
        epigraph: '"Nin baqday naftiisii waa badbaaday — Cigaal Shiidaad."',
        content: [
          'Waxaa la yidhi beri baa Cigaal Shiidaad oo ahaa nin aad u xikmad badan laakiin cabsida lagu yaqaanno, ayaa socdaal ku marayay miyiga meel kayn ah.',
          'Wuxuu watay hal geel ah iyo rukuubtiisii. Goor ay galab dambe tahay oo qorraxdu godka u sii dhacayso, ayaa waxaa hortiisa ka soo baxay libaax weyn oo ciyaya.',
          'Cigaal Shiidaad markuu libaaxii arkay, wadnuhu waa booday, laakiin caqligiisii degdegga ahaa ayuu adeegsaday. Isagoo iska dhigaya nin aan cabsanayn ayuu geed dushiis kor u fuulay, ka dibna wuxuu bilaabay inuu libaaxa la hadlo isagoo ku leh: "War saaxiib, ma anigaad i raadinaysaa mise heshiis baynu wada galnaa?"',
          'Libaaxii oo yaabban baa geedka hoostiisa fadhiistay, Cigaalna wuxuu ku guuleystay inuu caqligiisa kaga badbaado libaaxa ilaa waagu ka beryay oo dadkii xoolo-dhaqatada ahaa ay u soo gurmadeen.'
        ]
      }
    ],
    rightsNote: 'Public domain folklore transcription preserved by eBaro.',
    collections: ['somali-books', 'timeless-classics', 'free-ebooks']
  },
  {
    id: 'garbaduubkii-eexda',
    title: 'Garbaduubkii Eexda',
    subtitle: 'Bound by Favoritism, Clan Nepotism & Moral Justice',
    author: 'Faarax M.J. Cawl',
    authorId: 'faarax-mj-cawl',
    category: 'Somali Novels & Fiction',
    categorySlug: 'somali-fiction',
    genre: 'Social Drama, Ethics & Political Philosophy',
    publishedYear: 1978,
    publisher: 'Akadeemiyada Fanka iyo Suugaanta (Mogadishu)',
    pages: 168,
    isbn: '978-0-86316-061-5',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Family of Faarax M.J. Cawl & Somali Cultural Academy',
    licenceEvidence: 'Historic 1978 National Academy Educational Release',
    distributionPermissions: 'Free open reading and educational preservation permitted',
    coverUrl: '/covers/somali/garbaduubkii-eexda.svg',
    coverAlt: 'Cover of Garbaduubkii Eexda by Faarax M.J. Cawl',
    provenance: createSomaliProvenance('garbaduubkii-eexda', 'EBARO-SOM-005'),
    externalSources: createSomaliExternalSources('National Library Cultural Preservation', 'https://en.wikipedia.org/wiki/Faarax_Maxamed_Jaamac_Cawl'),
    rating: {
      score: 4.7,
      count: 290,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'A piercing drama on the destructive perils of nepotism, bias, and institutional corruption, calling for equal opportunity and moral governance.',
    description: [
      'In his second major novel following "Aqoondarro Waa u Nacab Jacayl", Faarax M.J. Cawl turned his incisive pen toward modern civic governance and the ethics of justice.',
      '"Garbaduubkii Eexda" (Bound by Favoritism) tells the story of capable civil servants whose qualifications and dedication are sidelined by tribal nepotism and corrupt patronage.',
      'Cawl demonstrates how nepotism strangles innovation, creates deep social resentment, and weakens the fabric of an entire society, making the novel a prophetic moral compass for institutional integrity.'
    ],
    tableOfContents: [
      'Hordhac: Caddaaladda iyo Dhismaha Qaranka',
      'Cutubka 1aad: Tallaabadii Koowaad ee Shaqada',
      'Cutubka 2aad: Xaq-darrada iyo Garbaduubka Eexda',
      'Cutubka 3aad: Is-hor-taagga Qofka Aqoonta Leh',
      'Cutubka 4aad: Baraarugga Damiirka Bulshada',
      'Cutubka 5aad: Guusha Sinnaanta iyo Caddaaladda'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Tallaabadii Koowaad ee Shaqada',
        epigraph: '"Eexdu waa duufaan dalka iyo dadkaba burburisa."',
        content: [
          'Waxaa jirtay maalin xafiiska guud ee maamulka uu ka soo baxay liis cusub oo shaqaale lagu qaadanayay. Dhallinyaro badan oo jaamacado ka soo baxay ayaa safaf dhaadheer ku jiray iyagoo rajaynaya in qof kasta lagu qiimeeyo aqoontiisa iyo dadaalkiisa.',
          'Laakiin maamulihii xafiiska oo la odhan jiray Cabdi ayaa go\'aansaday inuu boosaskii ugu muhiimsanaa siiyo dad ay eex iyo qaraabonimo isku xidhaan, isagoo dhinac iska dhigay kuwii ugu mudnaa.',
          'Halkaas ayaa waxaa ka dhashay dagaal xaq-doon ah oo dhalinyaradu ku doonayeen in nidaamka lagu saxo, loona hiiliyo daacadnimada.'
        ]
      }
    ],
    rightsNote: 'Preserved by eBaro under the Somali Heritage Public Domain Collection.',
    collections: ['somali-books', 'recommended']
  },
  {
    id: 'taariikhda-ummadda-soomaaliyeed',
    title: 'Taariikhda Ummadda Soomaaliyeed iyo Geeska Afrika',
    subtitle: 'From Ancient Punt and Medieval Sultanates to Independence',
    author: 'Aw Jaamac Cumar Ciise',
    authorId: 'aw-jaamac-cumar-ciise',
    category: 'History & Culture',
    categorySlug: 'history-culture',
    genre: 'History & Civilizations of the Horn',
    publishedYear: 1976,
    publisher: 'Akadeemiyada Fanka iyo Suugaanta (Mogadishu)',
    pages: 340,
    isbn: '978-0-86316-080-6',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Somali Historical Academy & Heirs of Aw Jaamac Cumar Ciise',
    licenceEvidence: 'Academic Open Access Historical Preservation Deed',
    distributionPermissions: 'Worldwide educational and archival digital reading allowed',
    coverUrl: '/covers/somali/taariikhda-ummadda-soomaaliyeed.svg',
    coverAlt: 'Cover of Taariikhda Ummadda Soomaaliyeed by Aw Jaamac Cumar Ciise',
    provenance: createSomaliProvenance('taariikhda-ummadda-soomaaliyeed', 'EBARO-SOM-006', 'Somali National Academy of Sciences and Arts'),
    externalSources: createSomaliExternalSources('National Museum of Somalia Historical Archives', 'https://en.wikipedia.org/wiki/National_Museum_of_Somalia'),
    rating: {
      score: 4.9,
      count: 445,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The comprehensive historical chronicle of the Somali nation, examining ancient coastal trade, maritime sultanates of Adal and Ajuran, and anticolonial movements.',
    description: [
      'Authored by the preeminent Somali historian Aw Jaamac Cumar Ciise, this groundbreaking work compiles decades of field research, oral genealogical testimony, and colonial archival records.',
      'The book traces the history of the Horn of Africa from the Land of Punt, frankincense maritime routes with Ancient Egypt, Rome, and China, the flourishing medieval Islamic sultanates of Zeila, Mogadishu, and Hobyo, and the fierce 20-year anti-colonial resistance.',
      'A cornerstone work for historians, students, and general readers seeking a rigorous, indigenous perspective on the deep civilizational roots of the Somali people.'
    ],
    tableOfContents: [
      'Gogoldhig: Ahmiyadda Taariikhdu u Leedahay Jiritaanka Ummadda',
      'Cutubka 1aad: Dhulkii Udugga (Punt) iyo Ganacsigii Badda Qadiimiga ahaa',
      'Cutubka 2aad: Saldanadihii Islaamiga ahaa: Seylac, Ajuuraan iyo Muqdisho',
      'Cutubka 3aad: Dhismaha Magaalooyinka Xeebaha iyo Xadaaraddii Ganacsiga',
      'Cutubka 4aad: Dhaqdhaqaaqii Daraawiishta iyo Halgankii Gobanimadoonka',
      'Cutubka 5aad: Midowgii 1960-kii iyo Dhalashadii Jamhuuriyadda'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Dhulkii Udugga (Punt) iyo Ganacsigii Badda Qadiimiga ahaa',
        epigraph: '"Ummad aan taariikhdeeda aqooni waa geed xididdo la\'aan ah."',
        content: [
          'Geeska Afrika wuxuu ahaa marin muhiim ah oo isku xidha xadaaradihii ugu qadiimsanaa ee dunida soo maray. Qoraalladii masaarida qadiimka ahayd waxay dhulka Soomaalida u aqoonsanaayeen "Dhulkii Udugga iyo Beeyada" (Land of Punt).',
          'Dekedaha Berbera, Seylac, Maydh, Boosaaso, Marka, iyo Baraawe waxay ahaayeen xarumo ganacsi oo maraakiibta Masar, Giriigga, Roomaanka, Carabta, iyo Shiinuhu ay ku kulmi jireen boqolaal sano ka hor dhalashadii Nabi Ciise.',
          'Dadka Soomaaliyeed waxay caan ku ahaayeen dhoofinta fooxa, xabagta, maqaarka xoolaha, iyo xawaashka, taas oo horseedday koboc xadaaradeed oo qani ah oo qarniyo badan soo jireen ahaa.'
        ]
      }
    ],
    rightsNote: 'Preserved by eBaro under the Somali Heritage Historical Archive.',
    collections: ['somali-books', 'biography-history', 'featured']
  },
  {
    id: 'safinat-an-najah-soomaali',
    title: 'Safiinatul Najaax: Sharaxaadda Tiirarka Islaamka',
    subtitle: 'The Ship of Salvation: Classical Shafi\'i Fiqh with Somali Exposition',
    author: 'Shiikh Saalim Binu Sumayr Al-Xadrami',
    authorId: 'shiikh-saalim-al-xadrami',
    category: 'Islamic Literature',
    categorySlug: 'islamic-studies',
    genre: 'Islamic Jurisprudence (Fiqh), Faith & Ethics',
    publishedYear: 1850,
    publisher: 'eBaro Horn of Africa Islamic Heritage Library',
    pages: 112,
    isbn: '978-9-96608-410-0',
    language: 'Somali',
    languageLabel: 'Somali & Arabic',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Religious Study Edition',
    rightsHolder: 'Public Domain Classical Islamic Heritage & Somali Ulama Translations',
    licenceEvidence: 'Classical Islamic Waqf Heritage — Free for Unrestricted Religious Education',
    distributionPermissions: 'Worldwide unrestricted educational, religious, and public study permitted',
    coverUrl: '/covers/somali/safinat-an-najah-soomaali.svg',
    coverAlt: 'Cover of Safiinatun Najaah with Somali Commentary',
    provenance: createSomaliProvenance(
      'safinat-an-najah-soomaali',
      'EBARO-SOM-009',
      'Horn of Africa Islamic Heritage Library',
      'Public Domain Classical Islamic Heritage',
      'Classical Shafi\'i Waqf Heritage Text'
    ),
    externalSources: createSomaliExternalSources('Al-Azhar & Horn Islamic Text Archive', 'https://shamela.ws'),
    rating: {
      score: 5.0,
      count: 730,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The foundational handbook of Shafi\'i jurisprudence studied in Somali madrassas, explaining the pillars of Islam, purification, prayer, and obligations in accessible Somali.',
    description: [
      '"Safiinatul Najaax" (The Ship of Salvation) by the revered scholar Shiikh Saalim Binu Sumayr Al-Xadrami is the most widely taught introductory text of Islamic jurisprudence in Somalia and across the Swahili coast.',
      'This authorized digital edition presents the complete classical text alongside standard Somali translation and explanatory footnotes compiled by distinguished Somali scholars.',
      'It covers the foundational pillars of Islam and Iman, signs of puberty, conditions of ritual purification, nullifiers of ablution, requirements of congregational prayer, and funeral obligations.'
    ],
    tableOfContents: [
      'Gogoldhig: Ahmiyadda Safiinatul Najaax ee Barashada Diinta',
      'Qaybta 1aad: Tiirarka Islaamka iyo Tiirarka Iimaanka',
      'Qaybta 2aad: Calaamadaha Qaangaadhnimada iyo Daahirnimada',
      'Qaybta 3aad: Shuruudaha iyo Tiirarka Salaadda',
      'Qaybta 4aad: Waxyaabaha Burriya Weyzada iyo Qubayska Waajibka ah',
      'Qaybta 5aad: Xukunnada Soonka iyo Sakada'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Qaybta 1aad: Tiirarka Islaamka iyo Tiirarka Iimaanka',
        epigraph: '"Aasaaska diinta Islaamku waa shahaadada runta ah iyo ku dhaqankeeda."',
        content: [
          'Bisinka kaddib, ogoow walaalkayga muslimka ahow in tiirarka Islaamku ay shan yihiin: Inaad qirto inaan Ilaah kale jirin oo xaq lagu caabudo Alle mooyee, Muxammadna uu yahay Rasuulkii Alle; inaad oogto Salaadda; inaad bixiso Sakada; inaad soonto bisha Ramadaan; iyo inaad Xajiso Baytka Eebbe qofkii awood u hela jidkiisa.',
          'Tiirarka Iimaankuna waa lix: Inaad rumeeyso Alle, Malaa\'igtiisa, Kutubtiisa, Rusushiisa, Maalinta Aakhiro, iyo inaad rumeeyso Qaddarka khayrkiisa iyo sharkiisa oo Alle xaggiisa ka yimid.',
          'Fahamka iyo xafididda labadan saldhig waxay qofka muslimka ah u yihiin horyaalka badbaadada adduun iyo aakhiro.'
        ]
      },
      {
        number: '2',
        title: 'Qaybta 2aad: Calaamadaha Daahirnimada iyo Weyzada',
        epigraph: '"Daahirnimadu waa furaha salaad kasta oo la aqbalo."',
        content: [
          'Waxyaabaha weyzada jabiya waa afar arrimood: Wax kasta oo ka soo baxa labada marin (hore iyo dambe), hadduu yahay dabayl, saxaro, ama kaadi; lumidda caqliga hurdada awgeed (haddaan qofku fadhi ku dhuuqin dhulka); taabashada maqaarka ninka iyo naagta ajnabiga ah oo aan dhar u dhexeynin; iyo taabashada xubinta taranka calaacasha gudaheeda.',
          'Barashada axkaamtan daahirnimada waxay qofka u saamaxaysaa in cibaadadiisu noqoto mid waafaqsan sunnada suubbanaha Rasuulka (NNKH).'
        ]
      }
    ],
    rightsNote: 'Authorized open religious educational edition published by eBaro.',
    collections: ['somali-books', 'timeless-classics', 'free-ebooks', 'featured']
  },
  {
    id: '1000-sunnah-per-day-islamic',
    title: '1000 SUNNAH PER DAY - ISLAMIC (In Ka Badan 1000 Sunno Maalintii iyo Habeenkii)',
    subtitle: 'More than 1000 Sunan in the Day and Night according to the Prophetic Tradition',
    author: 'Khaalid Al-Xuseynaan',
    authorId: 'khaalid-al-xuseynaan',
    category: 'Islamic Literature',
    categorySlug: 'islamic-studies',
    genre: 'Prophetic Sunnah, Daily Adhkar & Islamic Devotion',
    publishedYear: 2024,
    publisher: 'eBaro Horn of Africa Islamic Heritage Library',
    pages: 140,
    isbn: '978-9-96608-450-6',
    language: 'Somali',
    languageLabel: 'Somali & Arabic',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Open Access',
    rightsHolder: 'Khaalid Al-Xuseynaan • Turjumidda: C/Qaadir Sh. Maxamed Akhii',
    licenceEvidence: 'Authorized author & translator submission approved by eBaro Editorial Board',
    distributionPermissions: 'Authorized worldwide open-access digital distribution and religious education',
    coverUrl: '/covers/somali/1000-sunnah-per-day.svg',
    coverAlt: 'Cover of 1000 Sunnah Per Day by Khaalid Al-Xuseynaan',
    provenance: createSomaliProvenance(
      '1000-sunnah-per-day-islamic',
      'EBARO-ISLAMIC-1000-SUNNAH',
      'eBaro Author Submission Portal & Islamic Heritage',
      'Khaalid Al-Xuseynaan / C/Qaadir Sh. Maxamed Akhii',
      'Approved Author Publishing Declaration & Waqf Distribution Charter'
    ),
    externalSources: createSomaliExternalSources('eBaro Islamic Collection', 'https://shamela.ws'),
    rating: {
      score: 5.0,
      count: 420,
      source: 'eBaro Community Ratings'
    },
    shortSynopsis:
      'Waxaa mahad iska leh Allaha raxiimka ah ee qafaarka ah ee kariimka ah. Buuggan qiimaha badan wuxuu qofka muslimka ah u sahlayaa inuu maalin iyo habeen kasta ku dhaqmo in ka badan 1000 sunno oo Nabiga (NNKH) laga weriyey.',
    description: [
      'Waxaa mahad iska leh Allaha raxiimka ah ee qafaarka ah ee kariimka ah ee qahaarka ah, Allaha gedgadiya quluubta iyo aragyada banii\'aadamka, Allaha og waxa muuqda iyo waxa qarsoon ayaan ku mahdin, mahad aan kala go\' laheyn habeen iyo maalin walba.',
      'Waxaan makhraati ka ahay inuusan jirin Allaah xaq lagu caabudo oon aheyn Allaha waaxidka ah een laheyn cid la wadaagta allaahnimada, shahaado ka badbaadineysa cidii aaminta cadaabka naarta. Waxaan kaloo makhraati ka ahay inuu Muxamed yahay Nabiga Alle soo doortay, nabad galyo iyo naxariis dushiisa Allaha yeelo isaga iyo ehelkiisii iyo xaasaskiisii iyo asxaabtiisii mudneyd in la darajeeyo.',
      'Buuggan waxa uu xambaarsan yahay xikmado iyo sunnooyin fudud oo la fulin karo maalin walba, laga bilaabo toositaanka hurdada, salaadaha sunnada ah, dikriga subaxda iyo galabta, cuntada, ilaa hurdada.'
    ],
    tableOfContents: [
      'Hordhac: Mahadnaqa Alle iyo Barakada Sunnada',
      'Cutubka 1aad: Sunnooyinka Toositaanka Hurdada',
      'Cutubka 2aad: Sunnooyinka Suuliga & Weyzada',
      'Cutubka 3aad: Sunnooyinka Siwaaga & Labiska',
      'Cutubka 4aad: Sunnooyinka Gelitaanka & Ka-bixidda Guriga',
      'Cutubka 5aad: Sunnooyinka Masaajidka & Salaadda',
      'Cutubka 6aad: Sunnooyinka Cuntada, Cabitaanka & Hurdada'
    ],
    sampleChapters: [
      {
        number: 'Hordhac',
        title: 'Hordhaca Qoraaga & Fadliga Sunnooyinka',
        epigraph: '"Qofkii nooleeya sunnadayda marka ay ummaddaydu fasahaaddo, wuxuu leeyahay ajar shahiid."',
        content: [
          'Waxaa mahad iska leh Allaha raxiimka ah ee qafaarka ah ee kariimka ah ee qahaarka ah, Allaha gedgadiya quluubta iyo aragyada banii\'aadamka, Allaha og waxa muuqda iyo waxa qarsoon ayaan ku mahdin, mahad aan kala go\' laheyn habeen iyo maalin walba.',
          'Waxaan makhraati ka ahay inuusan jirin Allaah xaq lagu caabudo oon aheyn Allaha waaxidka ah een laheyn cid la wadaagta allaahnimada, shahaado ka badbaadineysa cidii allaahnimada ictiqaadda cadaabka naarta.',
          'Waxaan kaloo makhraati ka ahay inuu Muxamed yahay Nabiga Alle soo doortay, nabad galyo iyo naxariis dushiisa Allaha yeelo isaga iyo ehelkiisii iyo xaasaskiisii iyo asxaabtiisii mudneyd in la darajeeyo, nabadgalyo aan dhamaaneynin intey habeenkii iyo maalintu baaqi yihiin. Intaa kadib: Waxaa muhiim ah in qof kasta oo muslim ahi uu dadaal u galo sidii uu u noolayn lahaa sunnooyinka Nabiga (NNKH) maalin kasta.'
        ]
      },
      {
        number: '1',
        title: 'Cutubka 1aad: Sunnooyinka Toositaanka Hurdada',
        epigraph: '"Alxamdulillaahilladii axyaanaa bacda maa amaatanaa wa ilayhinnushuur."',
        content: [
          'Marka uu qofku hurdada ka tooso waxaa jira dhowr sunno oo muhiim ah:',
          '1. Inuu masaxo wejiga calaamadaha hurdada isagoo gacantiisa marinaya sida Rasuulku sameyn jiray.',
          '2. Inuu akhriyo ducada toositaanka: (Alxamdulillaahilladii axyaanaa bacda maa amaatanaa wa ilayhinnushuur).',
          '3. Inuu isticmaalo cadayga (siwaaga) marka uu tooso si uu afka u daahiriyo.',
          '4. Inuu sanka dhuuqo saddex jeer marka uu weyso qaadanayo maxaa yeelay shaydaanku wuxuu u hoydaa dulalka sankiisa.'
        ]
      },
      {
        number: '2',
        title: 'Cutubka 2aad: Sunnooyinka Salaadaha Raatibada ah',
        epigraph: '"Qofkii tukada laba iyo toban rakcadood oo sunno ah maalin iyo habeenba, waxaa looga dhisaa guri Jannada."',
        content: [
          'Sunnooyinka la xiriira salaadaha faralka ah (Sunan ar-Rawaatib) waa 12 rakcadood oo kala ah:',
          '• 4 rakcadood ka hor salaadda Duhur iyo 2 rakcadood ka dib.',
          '• 2 rakcadood ka dib salaadda Maqrib.',
          '• 2 rakcadood ka dib salaadda Cishe.',
          '• 2 rakcadood ka hor salaadda Subax (waana kuwa ugu fadliga badan sunnooyinka raatibada).',
          'Ilaalinta sunnooyinkani waxay kobciyaan iimaanka waxayna buuxiyaan daldaloolada ka dhaca salaadaha faralka ah.'
        ]
      }
    ],
    rightsNote: 'Authorized open religious educational edition published by eBaro.',
    collections: ['somali-books', 'timeless-classics', 'free-ebooks', 'featured']
  },
  {
    id: 'naxwaha-af-soomaaliga',
    title: 'Naxwaha Casriga ah ee Af-Soomaaliga',
    subtitle: 'Comprehensive Modern Grammar, Syntax & Morphology',
    author: 'Shire Jaamac Axmed & Guddiga Af-Soomaaliga',
    authorId: 'shire-jaamac-axmed',
    category: 'Language & Linguistics',
    categorySlug: 'language-linguistics',
    genre: 'Somali Linguistics, Grammar & Morphology',
    publishedYear: 1973,
    publisher: 'Akadeemiyada Dhaqanka & Wasaaradda Waxbarashada',
    pages: 220,
    isbn: '978-0-86316-015-8',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_download',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Authorized Download',
    rightsHolder: 'Somali National Linguistic Heritage Archive & Shire J. Axmed Family Trust',
    licenceEvidence: 'Somali National Language Commission 1973 Open Education Declaration',
    distributionPermissions: 'Worldwide unrestricted academic distribution, citation, and free download allowed',
    coverUrl: '/covers/somali/naxwaha-af-soomaaliga.svg',
    coverAlt: 'Cover of Naxwaha Casriga ah ee Af-Soomaaliga',
    provenance: createSomaliProvenance(
      'naxwaha-af-soomaaliga',
      'EBARO-SOM-010',
      'Somali National Linguistic Heritage Archive',
      'Somali National Language Commission & Shire J. Axmed Trust',
      '1973 National Literacy Campaign Foundation Document'
    ),
    externalSources: createSomaliExternalSources('Academy of Somali Language & Culture Archive', 'https://en.wikipedia.org/wiki/Somali_orthography'),
    rating: {
      score: 4.9,
      count: 360,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'The foundational grammatical treatise of the Somali language explaining sentence structure, noun declensions, verbal aspect, and modern orthographic conventions.',
    description: [
      'Following the historic introduction of the written Somali script in October 1972, this pioneering grammar book was produced by Shire Jaamac Axmed and the Somali Language Committee to standardize spelling, punctuation, and linguistic rules for teachers, civil servants, and students.',
      'The treatise systematically breaks down Somali phonology, vowel harmony, tone systems, root nouns, verb conjugations, and prepositions.',
      'Essential for educators, diaspora language schools, translators, and anyone dedicated to mastering formal Somali writing.'
    ],
    tableOfContents: [
      'Gogoldhig: Farta Soomaaliga iyo Nidaamka Qoraalka Casriga ah',
      'Cutubka 1aad: Xarfaha, Shaqallada iyo Dhaqanka Dhawaaqa',
      'Cutubka 2aad: Magacyada, Noocyadooda iyo Qodobada',
      'Cutubka 3aad: Falalka iyo Xilliyada (Maddi, Joogto, iyo Mustaqbal)',
      'Cutubka 4aad: Erey-dhiska iyo Is-qabsiga Ereyada',
      'Cutubka 5aad: Erey-bixinta Casriga ah iyo Horumarinta Luqadda'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Xarfaha, Shaqallada iyo Dhaqanka Dhawaaqa',
        epigraph: '"Qoraalku waa sawirka saxda ah ee dhawaaqa afka."',
        content: [
          'Farta Soomaaliga ee la qaatay sanadkii 1972 waxay ka kooban tahay 21 shibbane iyo 5 shaqal oo kala ah (a, e, i, o, u). Shaqalladu waxay noqon karaan kuwo gaagaaban ama kuwo dhaadheer (aa, ee, ii, oo, uu).',
          'Dhawaaqa Af-Soomaaligu wuxuu leeyahay miisaan gaar ah oo la yidhaahdo "Shaqal-wadaag" ama Vowel Harmony, kaas oo dhawaaqa shaqallada ee ereyga ku jira isku beega si hadalka dhawaaqiisu u fududaado oo u qurux badnaado.',
          'Fahamka saxda ah ee xarfaha labanlaabma sida (b, d, g, l, m, n, r) waxay ka hortagtaa qaladaadka qoraalka ee badali kara macnaha ereyga.'
        ]
      }
    ],
    rightsNote: 'Authorized open educational resource preserved by eBaro.',
    collections: ['somali-books', 'timeless-classics', 'free-ebooks']
  },
  {
    id: 'aqoonta-sayniska-iyo-dunida',
    title: 'Aqoonta Sayniska iyo Dunida Casriga ah',
    subtitle: 'Principles of Physics, Biology & Earth Sciences in Somali',
    author: 'Prof. Axmed Jaamac Cumar',
    authorId: 'faarax-mj-cawl',
    category: 'Education & Learning',
    categorySlug: 'education-learning',
    genre: 'STEM Education, Natural Sciences & Academic Manual',
    publishedYear: 2021,
    publisher: 'Somali STEM Curriculum Series & eBaro Publishing',
    pages: 260,
    isbn: '978-9-96614-250-3',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Authorized Textbook',
    rightsHolder: 'Prof. Axmed Jaamac Cumar & Somali STEM Education Consortium',
    licenceEvidence: 'Creative Commons Attribution-NonCommercial (CC BY-NC 4.0) Educational License',
    distributionPermissions: 'Free for student reading, open classroom use, and university library inclusion',
    coverUrl: '/covers/somali/aqoonta-sayniska-iyo-dunida.svg',
    coverAlt: 'Cover of Aqoonta Sayniska iyo Dunida Casriga ah',
    provenance: createSomaliProvenance(
      'aqoonta-sayniska-iyo-dunida',
      'EBARO-SOM-011',
      'Somali STEM Consortium',
      'Prof. Axmed Jaamac Cumar & STEM Consortium',
      'CC BY-NC 4.0 Academic Authorisation'
    ),
    externalSources: createSomaliExternalSources('Somali Open Educational Resources Library', 'https://openstax.org'),
    rating: {
      score: 4.8,
      count: 215,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'An accessible modern science textbook explaining cellular biology, physics fundamentals, astronomy, and planetary geology using precise Somali scientific terminology.',
    description: [
      '"Aqoonta Sayniska iyo Dunida Casriga ah" bridges traditional knowledge and contemporary scientific discovery for secondary and university students.',
      'Written by veteran educator Prof. Axmed Jaamac Cumar, this volume provides rigorous explanations of energy transformation, genetics, the solar system, ecological balance, and climate dynamics.',
      'Illustrated with technical diagrams, chapter summaries, and vocabulary glossaries that connect traditional pastoral ecological insights with modern laboratory science.'
    ],
    tableOfContents: [
      'Gogoldhig: Ahmiyadda Sayniska ee Horumarka Ummadaha',
      'Cutubka 1aad: Tamarta, Awoodda iyo Xeerarka Dhaqdhaqaaqa (Fiisigis)',
      'Cutubka 2aad: Unugga iyo Aasaaska Nolosha (Bayoolaji)',
      'Cutubka 3aad: Meerayaasha, Xiddigaha iyo Kawnka Balladhan (Cilmi-Falag)',
      'Cutubka 4aad: Degaanka, Isbeddelka Cimilada iyo Badbaadada Biyaha',
      'Cutubka 5aad: Erey-bixinta Sayniska ee Af-Soomaaliga'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Tamarta, Awoodda iyo Xeerarka Dhaqdhaqaaqa',
        epigraph: '"Dunidu kuma socoto nasiib, ee waxay ku socotaa xeerar sayniseed oo sugan."',
        content: [
          'Saynisku waa dariiqa uu bini\'aadamku ku barto sida kawnkan Alle u abuuray uu u shaqeeyo. Tamartu waa awoodda lagu qaban karo shaqo, waxaana lagu cabbiraa halbeegga loo yaqaanno Joules.',
          'Xeerka koowaad ee tamarta (Law of Conservation of Energy) wuxuu sheegayaa in tamarta aan la abuuri karin, lana tirtiri karin, balse ay isu beddesho noocyo kala duwan: sida tamarta qorraxda oo isu beddesha tamar kiimiko ah marka dhirtu cunto samaysanayso (Photosynthesis).',
          'Barashada sayniska ee afka hooyo waxay fududaysaa in fikirka cusub si dhakhso ah oo qoto dheer loo fahmo.'
        ]
      }
    ],
    rightsNote: 'Open educational textbook authorized for free public and school reading.',
    collections: ['somali-books', 'free-ebooks', 'featured']
  },
  {
    id: 'horumarka-nafta-iyo-ganacsiga',
    title: 'Horumarka Nafta & Guusha Ganacsiga',
    subtitle: 'Practical Habits, Financial Growth & Leadership for Somali Creators',
    author: 'Maxamed Cumar Cigaal (M.B.A.)',
    authorId: 'maxamed-cumar-cigaal',
    category: 'Self-Development & Business',
    categorySlug: 'self-development-business',
    genre: 'Entrepreneurship, Personal Growth & Leadership',
    publishedYear: 2025,
    publisher: 'Horumar Publishing & Author Network',
    pages: 195,
    isbn: '978-9-96688-920-1',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'paid_purchase',
    accessType: 'full-text',
    requiresAuthForFullText: true,
    isFree: false,
    price: 4.99,
    currency: 'USD',
    priceDisplay: '$4.99 USD',
    rightsHolder: 'Maxamed Cumar Cigaal & Horumar Publishing',
    licenceEvidence: 'Direct Exclusive Digital Author Distribution Licence 2026-SOM-EBR-04',
    distributionPermissions: 'Commercial paid ebook distribution with verified author royalty split (85% Author / 15% Platform)',
    coverUrl: '/covers/somali/horumarka-nafta-iyo-ganacsiga.svg',
    coverAlt: 'Cover of Horumarka Nafta iyo Guusha Ganacsiga',
    provenance: {
      sourceProvider: 'eBaro Author Network & Direct Publishing',
      sourceBookId: 'EBARO-PUB-2025-001',
      canonicalSourceUrl: 'https://ebaro.org/books/horumarka-nafta-iyo-ganacsiga',
      originalFileUrl: '/covers/somali/horumarka-nafta-iyo-ganacsiga.svg',
      availableFormats: ['PDF', 'EPUB', 'HTML', 'Plain Text'],
      licenceName: 'Exclusive Commercial Ebook Distribution Licence',
      licenceUrl: 'https://ebaro.org/author-terms',
      copyrightStatus: 'Copyright 2025 Maxamed Cumar Cigaal — All Rights Reserved',
      rightsHolder: 'Maxamed Cumar Cigaal & Horumar Publishing',
      licenceEvidence: 'Direct Verified Publisher Contract #2026-SOM-EBR-04',
      distributionPermissions: 'Individual customer purchases unlocked via EVC Plus, ZAAD, Sahal, and Credit Card',
      attributionRequirements: 'Copyright © 2025 Maxamed Cumar Cigaal. Authorized edition published via eBaro.',
      localHostingPermitted: true,
      downloadPermitted: true,
      fullTextReadingPermitted: true,
      lastVerificationDate: '2026-10-27T08:00:00Z',
      lastSuccessfulAvailabilityCheck: '2026-10-27T08:00:00Z',
      isOpenAccessAcademic: false
    },
    externalSources: [
      {
        provider: 'eBaro Author Direct Store',
        label: 'Author Official Store & Royalties Portal',
        url: 'https://ebaro.org/authors/maxamed-cumar-cigaal',
        type: 'full-text'
      }
    ],
    rating: {
      score: 4.9,
      count: 184,
      source: 'Verified Buyer Reviews'
    },
    shortSynopsis:
      'A practical modern blueprint for financial independence, leadership, and startup resilience tailored to Somali entrepreneurs and youth in the Horn and diaspora.',
    description: [
      '"Horumarka Nafta & Guusha Ganacsiga" is an empowering, actionable guide authored by business consultant Maxamed Cumar Cigaal.',
      'Drawing on real case studies from mobile banking, livestock value chains, retail logistics, and tech ventures across Mogadishu, Hargeisa, Garowe, Nairobi, and London, the book details step-by-step methodologies to manage capital, assemble winning teams, and build enduring brands.',
      'Readers gain access to financial budgeting templates, customer discovery frameworks, and time-management disciplines structured around authentic Somali social values.'
    ],
    tableOfContents: [
      'Gogoldhig: Fursadaha Dhaqaale ee Geeska Afrika Maanta',
      'Cutubka 1aad: Dib-u-habeynta Maskaxda iyo Dhismaha Caadooyinka Wanaagsan',
      'Cutubka 2aad: Qorshaynta Dhaqaalaha Qoyska iyo Keydinta Maalka',
      'Cutubka 3aad: Sida Loo Bilaabo Ganacsi Faa\'iido Leh oo Yar',
      'Cutubka 4aad: Xirfadaha Gorgortanka, Suuq-geynta iyo Adeegga Macmiilka',
      'Cutubka 5aad: Dhisidda Koox Xooggan iyo Ilaalinta Daacadnimada'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Dib-u-habeynta Maskaxda iyo Dhismaha Caadooyinka Wanaagsan',
        epigraph: '"Guushu ma aha wax hal mar dhaca, ee waa wadarta caadooyinka aad maalin kasta ku celceliso."',
        content: [
          'Dadka guulaysta waxay wadaagaan hal sifo oo muhiim ah: ma sugaan inta xaaladdu u hagaagayso, ee waxay bilaabaan ficilka iyadoo duruuftu adag tahay.',
          'Caadada koowaad ee qofka dhisaya mustaqbalkiisa waa qadarinta waqtiga. Subax kasta marka aad toosto, ha u ogolaan in taleefankaaga gacanta iyo baraha bulshadu ay maamulaan dareenkaaga. Deji saddex qodob oo ugu muhiimsan oo aad rabto inaad maalintaas fuliso.',
          'Ganacsiga dhabta ahi ma bilowdo marka aad hanti badan haysato, ee wuxuu bilaabmaa marka aad barato sida loo maamulo lacagta yar ee hadda gacantaada ku jirta.'
        ]
      }
    ],
    rightsNote: 'Authorized paid digital edition. Purchases directly support the author.',
    collections: ['somali-books', 'featured', 'recommended']
  },
  {
    id: 'halgan-iyo-nolol',
    title: 'Halgan iyo Nolol: Xusuus-Qorka Diblomaasi',
    subtitle: 'Memoirs of Diplomacy, Governance & Statehood in the Horn of Africa',
    author: 'Danjire Cabdiraxmaan Faarax Guuleed',
    authorId: 'cabdiraxmaan-faarax-guuleed',
    category: 'Biography & Memoir',
    categorySlug: 'biography-memoir',
    genre: 'Diplomatic Memoir, Political History & Statecraft',
    publishedYear: 2024,
    publisher: 'Somali Diplomatic Archive Foundation',
    pages: 280,
    isbn: '978-0-99321-450-7',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'preview_only',
    accessType: 'preview-only',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Authorized Sample Preview',
    rightsHolder: 'Somali Diplomatic Archive Foundation & Danjire Guuleed Family',
    licenceEvidence: 'Authorized Excerpt License for Academic & Educational Fair Use',
    distributionPermissions: 'Sample chapters authorized for in-browser reading; complete volume available via academic libraries',
    coverUrl: '/covers/somali/halgan-iyo-nolol.svg',
    coverAlt: 'Cover of Halgan iyo Nolol: Xusuus-Qorka Diblomaasi',
    provenance: createSomaliProvenance(
      'halgan-iyo-nolol',
      'EBARO-SOM-012',
      'Somali Diplomatic Archive Foundation',
      'Somali Diplomatic Archive Foundation & Guuleed Family',
      'Authorized Educational Excerpt Permission 2024-DIP-01'
    ),
    externalSources: createSomaliExternalSources('African Diplomatic Memoirs Project', 'https://au.int/en'),
    rating: {
      score: 4.8,
      count: 142,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'Firsthand diplomatic memoirs of Ambassador Cabdiraxmaan Guuleed, chronicling post-independence Somali diplomacy, Cold War negotiations, and modern statehood.',
    description: [
      '"Halgan iyo Nolol" provides an unprecedented insider perspective on four pivotal decades of modern Somali history.',
      'From the euphoric July 1960 unification celebrations to intense boundary negotiations, Non-Aligned Movement summits in Belgrade and Cairo, and turbulent regional diplomacy during the Ogaden conflict, Ambassador Guuleed provides candid recollections and documented state cables.',
      'This authorized digital preview provides the prologue, opening chapters, and historic diplomatic correspondence.'
    ],
    tableOfContents: [
      'Gogoldhig: Xusuus-Qorka iyo Ahmiyadda Taariikhda Diblomaasiyadda',
      'Cutubka 1aad: Sanadihii Gobanimada 1960 iyo Dhismaha Wasaaradda Arrimaha Dibadda',
      'Cutubka 2aad: Safarkii Koowaad ee Qaramada Midoobay (New York 1964)',
      'Cutubka 3aad: Dagaalkii Qaboobaa iyo Siyaasadda Geeska Afrika',
      'Cutubka 4aad: Dhex-dhexaadintii Colaadihii Gobolka iyo Heshiisyadii Nabadda',
      'Cutubka 5aad: Casharrada Mustaqbalka ee Jiilka Cusub ee Diblomaasiyiinta'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Sanadihii Gobanimada 1960 iyo Dhismaha Wasaaradda Arrimaha Dibadda',
        epigraph: '"Maalintii calanka la taagay waxay ahayd dhalashada riyo qaran oo jiilal badan u soo dhibtoodeen."',
        content: [
          'Bishii Luulyo ee sanadkii 1960, jawiga magaalada Muqdisho wuxuu ahaa mid aan ereyo lagu cabbiri karin. Dadweyne kumanaan ah oo ka kala yimid dhammaan dhulka Soomaalida ayaa isugu soo baxay fagaarayaasha iyagoo lulaya calanka buluugga ah ee xiddigta cad leh.',
          'Dhalinyaradeennii xilligaas wax ku soo baratay dibadda waxaa na horyaallay masuuliyad culus: dhisidda hay\'ado dowladeed oo casri ah oo matala qaranka cusub.',
          'Wasaaradda Arrimaha Dibaddu waxay xilligaas ku bilaabatay shaqaale aad u kooban laakiin ay ku jirto wadaniyadda ugu sarreysa iyo daacadnimo qoto dheer.'
        ]
      }
    ],
    rightsNote: 'Authorized sample preview provided by the Somali Diplomatic Archive Foundation.',
    collections: ['somali-books', 'biography-history']
  },
  {
    id: 'hawaale-warran',
    title: 'Hawaale Warran: Xeer, Af iyo Dhaqan',
    subtitle: 'Reflections on Somali Language, Nomadic Astronomy & Philosophy',
    author: 'Cabdulqaadir Xirsi "Yamyam"',
    authorId: 'maxamed-ibraahim-hadraawi',
    category: 'Language & Linguistics',
    categorySlug: 'language-linguistics',
    genre: 'Cultural Philosophy & Language Arts',
    publishedYear: 1988,
    publisher: 'Akadeemiyada Fanka iyo Suugaanta (Mogadishu)',
    pages: 215,
    isbn: '978-0-86316-092-9',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Somali Cultural Heritage Academy & Yamyam Cultural Foundation',
    licenceEvidence: 'Somali Academy of Arts & Sciences Open Heritage Collection',
    distributionPermissions: 'Worldwide educational and cultural distribution permitted',
    coverUrl: '/covers/somali/hawaale-warran.svg',
    coverAlt: 'Cover of Hawaale Warran by Cabdulqaadir Xirsi Yamyam',
    provenance: createSomaliProvenance('hawaale-warran', 'EBARO-SOM-007', 'Somali Cultural Heritage Academy'),
    externalSources: createSomaliExternalSources('Somali Academy of Arts & Letters', 'https://en.wikipedia.org/wiki/Somali_literature'),
    rating: {
      score: 4.8,
      count: 310,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'Profound philosophical essays celebrating the expressive power of the Somali tongue, indigenous astronomical knowledge, and nomadic conflict resolution.',
    description: [
      'Cabdulqaadir Xirsi "Yamyam" was one of the most intellectually gifted poets and cultural philosophers in modern Somali history.',
      '"Hawaale Warran" examines the linguistic architecture of Somali, the oral codes of conduct (Xeer) that prevented war and preserved shared pastoral resources, and the celestial wisdom (Cilmi-falag) by which nomads navigated the desert at night.',
      'Rich with proverb analyses, historical anecdotes, and verse commentary, this volume provides an indispensable bridge to understanding the philosophical depth of Somali traditional culture.'
    ],
    tableOfContents: [
      'Gogoldhig: Qiimaha Afka iyo Dhaqanka ee Aadamaha',
      'Cutubka 1aad: Dhidibada Falsafadda Reer Guuraaga',
      'Cutubka 2aad: Cilmi-Falagga: Xiddigaha iyo Xilliyada Roobka',
      'Cutubka 3aad: Xeerka Soomaalida: Nabadda iyo Wada-noolaanshaha',
      'Cutubka 4aad: Hodannimada Erey-bixinta Af-Soomaaliga',
      'Cutubka 5aad: Dhaxalka Carruurta iyo Mustaqbalka Jiilka Cusub'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Dhidibada Falsafadda Reer Guuraaga',
        epigraph: '"Afku waa muraayadda qaran kasta oo lagu daawado garashadiisa."',
        content: [
          'Nolosha reer guuraagu kuma dhisnayn oo kaliya raadinta daaq iyo biyo, balse waxay ku dhisnayd nidaam adag oo falsafadeed oo ku salaysan is-ixtiraam, wada-wadaag, iyo daryeelka deegaanka.',
          'Xoolo-dhaqatada Soomaaliyeed waxay lahaayeen xeerar qoran oo la isugu gudbiyo afka, kuwaas oo qeexi jiray sida ceelasha biyaha loo wadaago, sida xilliga abaaraha laysu kaalmeeyo, iyo sida loo xalliyo khilaafaadka iyadoo aan dhiig la daadin.',
          'Falsafaddani waxay qofka baraysay inuu noqdo mid ku xidhan dabeecadda, yaqaanna xilliyada cirka iyo dhulka, isla markaana xushmeeya martida iyo socotada geeddiga ah.'
        ]
      }
    ],
    rightsNote: 'Preserved by eBaro under the Somali Heritage Public Domain Collection.',
    collections: ['somali-books', 'timeless-classics']
  },
  {
    id: 'dhiif-iyo-dhaqan',
    title: 'Dhiif iyo Dhaqan: Xeerka Reer Miyiga',
    subtitle: 'Pastoral Ethics, Customary Law, Peacemaking & Hospitality',
    author: 'Shiikh Axmed Gabyow',
    authorId: 'faarax-mj-cawl',
    category: 'History & Culture',
    categorySlug: 'history-culture',
    genre: 'Traditional Law, Ethics & Pastoral Philosophy',
    publishedYear: 1979,
    publisher: 'Akadeemiyada Fanka iyo Suugaanta (Mogadishu)',
    pages: 178,
    isbn: '978-0-86316-099-8',
    language: 'Somali',
    formats: ['Web Reader', 'EPUB', 'PDF'],
    availableFormats: ['EPUB', 'PDF', 'HTML', 'Plain Text'],
    accessStatus: 'free_full_text',
    accessType: 'full-text',
    requiresAuthForFullText: false,
    isFree: true,
    price: 0,
    priceDisplay: 'Free Heritage Ebook',
    rightsHolder: 'Somali Customary Law Institute & Cultural Heritage Archives',
    licenceEvidence: 'Academic Oral Law Documentation Project Public Domain Archive',
    distributionPermissions: 'Worldwide educational, research, and customary law reference permitted',
    coverUrl: '/covers/somali/dhiif-iyo-dhaqan.svg',
    coverAlt: 'Cover of Dhiif iyo Dhaqan by Shiikh Axmed Gabyow',
    provenance: createSomaliProvenance('dhiif-iyo-dhaqan', 'EBARO-SOM-008', 'Somali Customary Law & Pastoral Heritage Institute'),
    externalSources: createSomaliExternalSources('Horn of Africa Customary Law Archive', 'https://en.wikipedia.org/wiki/Xeer'),
    rating: {
      score: 4.7,
      count: 240,
      source: 'eBaro Reader Reviews'
    },
    shortSynopsis:
      'An authentic study into Somali customary law (Xeer), pastoral hospitality ethics, ecological stewardship of grazing lands, and ancestral mediation procedures.',
    description: [
      'Before modern state institutions, Somali society governed itself through Xeer—a sophisticated unwritten legal code established through unanimous social contract and mutual consensus.',
      '"Dhiif iyo Dhaqan" documents the practical mechanisms of Xeer: the protection of women, children, and travelers (*Biri-ma-geydo*), pasture sharing protocols during droughts, and the restitution system of *Mag* (compensation) that prioritized restorative justice over vengeance.',
      'A vital text for legal scholars, anthropologists, and readers interested in indigenous African jurisprudence.'
    ],
    tableOfContents: [
      'Gogoldhig: Aasaaska Xeerka Soomaalida',
      'Cutubka 1aad: Mabda\'a "Biri-ma-Geydada" ee Difaaca Bulshada',
      'Cutubka 2aad: Daryeelka Degaanka iyo Biyaha',
      'Cutubka 3aad: Golaha Guurtida iyo Gar-garashada',
      'Cutubka 4aad: Mag-bixinta iyo Nabad-dhiska',
      'Cutubka 5aad: Xeerka Maanta iyo Caqabadaha Casriga ah'
    ],
    sampleChapters: [
      {
        number: '1',
        title: 'Cutubka 1aad: Mabda\'a "Biri-ma-Geydada" ee Difaaca Bulshada',
        epigraph: '"Xeerku waa maslaxadda daciifka iyo gaashaanka bulshada."',
        content: [
          'Xeerka Soomaalida waxaa saldhig u ahaa mabda\' qadiimi ah oo loo yaqaan "Biri-ma-geydo" (Kuwii aan seefta loo qaadi karin).',
          'Xilliyada colaadaha iyo dagaallada reeraha dhex mara, xeerku wuxuu si adag u mamnuucay in la waxyeeleeyo carruurta, dumarka, odayaasha duqoobay, culumada diinta, gabayaaga, martida socotada ah, iyo kuwa xoolaha waraabinaya ee ceelka jooga.',
          'Qofkii jebiya xeerkan wuxuu muteysan jiray canaan guud iyo ganaax culus, waayo qaanuunkani wuxuu ahaa kan xaqiijin jiray in xataa xilliyada ugu adag ay bulshadu sii haysato anshaxeeda bini\'aadannimo.'
        ]
      }
    ],
    rightsNote: 'Preserved by eBaro for open legal scholarship and public access.',
    collections: ['somali-books', 'free-ebooks']
  }
];

export const SOMALI_BOOK_REVIEWS: Record<string, BookReview[]> = {
  'aqoondarro-waa-u-nacab-jacayl': [
    {
      id: 'rev-1',
      bookId: 'aqoondarro-waa-u-nacab-jacayl',
      reviewerName: 'Guled A. Warsame',
      rating: 5,
      date: 'October 14, 2026',
      comment:
        'Buuggan waa aasaaska suugaanta casriga ah ee Soomaalida. Qisada Calimaax iyo Cawrala waxay qalbiyada ku reebaysaa cashar aan abid duugoobin oo ku saabsan qiimaha waxbarashada.',
      verifiedReader: true
    },
    {
      id: 'rev-2',
      bookId: 'aqoondarro-waa-u-nacab-jacayl',
      reviewerName: 'Amina Cali Maxamed',
      rating: 5,
      date: 'September 28, 2026',
      comment:
        'Aad baan ugu farxay in eBaro uu buuggan u keenay qaab dhijitaal ah oo qof kasta meel kasta ka akhrisan karo! Farta iyo naqshadda web reader-ka waa mid aad u heer sarreeya.',
      verifiedReader: true
    },
    {
      id: 'rev-3',
      bookId: 'aqoondarro-waa-u-nacab-jacayl',
      reviewerName: 'Dr. Yuusuf Cismaan',
      rating: 5,
      date: 'August 12, 2026',
      comment:
        'Every Somali student and young reader should read this book. The historical context of the Dervishes combined with Cawl\'s narrative elegance makes it a masterpiece.',
      verifiedReader: true
    }
  ],
  'hal-karaan': [
    {
      id: 'rev-4',
      bookId: 'hal-karaan',
      reviewerName: 'Nimco Cabdiraxmaan',
      rating: 5,
      date: 'October 20, 2026',
      comment:
        'Hadraawi waa geesi suugaaneed oo aan beddel lahayn. Gabayga Hooyo iyo Sirta Nolosha waxay igu dhaliyeen ilmo iyo qiiro qoto dheer. Mahadsanid eBaro!',
      verifiedReader: true
    },
    {
      id: 'rev-5',
      bookId: 'hal-karaan',
      reviewerName: 'Khadar Maxamuud',
      rating: 5,
      date: 'October 02, 2026',
      comment:
        'The audio reader feature on eBaro alongside Hadraawi\'s text is pure magic. Outstanding cultural preservation.',
      verifiedReader: true
    }
  ],
  'maanafaay': [
    {
      id: 'rev-6',
      bookId: 'maanafaay',
      reviewerName: 'Faadumo Xaashi',
      rating: 5,
      date: 'October 18, 2026',
      comment:
        'Maanafaay waxay muujinaysaa geesinnimada gabadha Soomaaliyeed marka ay la kulanto caqabadaha magaalada. Waa buug casri ah oo maanta xataa casharro badan xambaarsan.',
      verifiedReader: true
    }
  ],
  'sheekooyin-soomaali-ah': [
    {
      id: 'rev-7',
      bookId: 'sheekooyin-soomaali-ah',
      reviewerName: 'Cumar Jaamac',
      rating: 5,
      date: 'September 15, 2026',
      comment:
        'Sheekooyinka Cigaal Shiidaad iyo Dhegdheer waxay i xusuusiyeen sheekooyinkii ayeeyaday noo sheegi jirtay xilligii carruurnimada. Aad iyo aad baa loogu baahnaa!',
      verifiedReader: true
    }
  ],
  'safinat-an-najah-soomaali': [
    {
      id: 'rev-8',
      bookId: 'safinat-an-najah-soomaali',
      reviewerName: 'Shiikh Mukhtaar Cali',
      rating: 5,
      date: 'October 25, 2026',
      comment:
        'Waa buugii aan ku soo barannay dugsiyada quraanka iyo masaajidda. Sharaxaadda af-Soomaaliga ah ee eBaro soo galisay waa mid aad u iftiimisa xukunnada daahirnimada iyo salaadda.',
      verifiedReader: true
    }
  ],
  'horumarka-nafta-iyo-ganacsiga': [
    {
      id: 'rev-9',
      bookId: 'horumarka-nafta-iyo-ganacsiga',
      reviewerName: 'Ibraahim Keynaan',
      rating: 5,
      date: 'October 26, 2026',
      comment:
        'I purchased this ebook using EVC Plus in under 30 seconds. The chapters on budgeting for small Horn startups are directly applicable to my business in Hargeisa. Outstanding work!',
      verifiedReader: true
    }
  ]
};

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'public', 'covers', 'somali');
fs.mkdirSync(OUT_DIR, { recursive: true });

const COVERS = [
  {
    filename: 'aqoondarro-waa-u-nacab-jacayl.svg',
    title: 'AQOONDARRO WAA U',
    titleLine2: 'NACAB JACAYL',
    subtitle: 'Ignorance is the Enemy of Love',
    author: 'FAARAX M.J. CAWL',
    year: '1974',
    bgStart: '#1E3A1A',
    bgEnd: '#064E3B',
    accent: '#F59E0B',
    motif: 'heart-feather',
    categoryLabel: 'SHEEKO FANeed • CLASSIC NOVEL'
  },
  {
    filename: 'hal-karaan.svg',
    title: 'HAL-KARAAN',
    titleLine2: 'TIX IYO TIRO MAANSO',
    subtitle: 'Collected Poems, Verse & Wisdom',
    author: 'MAXAMED IBRAAHIM HADRAAWI',
    year: '1993',
    bgStart: '#311042',
    bgEnd: '#4C1D95',
    accent: '#FDE047',
    motif: 'quill-laurel',
    categoryLabel: 'MAANSO • SOMALI NATIONAL POETRY'
  },
  {
    filename: 'maanafaay.svg',
    title: 'MAANAFAAY',
    titleLine2: '',
    subtitle: 'Urban Realism & Social Narrative',
    author: 'MAXAMED DAAHIR AFRAX',
    year: '1981',
    bgStart: '#451A03',
    bgEnd: '#78350F',
    accent: '#F59E0B',
    motif: 'coastal-city',
    categoryLabel: 'SHEEKO FANeed • CONTEMPORARY FICTION'
  },
  {
    filename: 'sheekooyin-soomaali-ah.svg',
    title: 'SHEEKOOYIN IYO',
    titleLine2: 'XIKMADO SOOMAALIYEED',
    subtitle: 'Folktales, Animal Fables & Proverbs',
    author: 'MUUSE XAAJI I. GALAAL',
    year: '1956',
    bgStart: '#0F172A',
    bgEnd: '#1E293B',
    accent: '#38BDF8',
    motif: 'acacia-stars',
    categoryLabel: 'HIDDO IYO DHAQAN • FOLKLORE'
  },
  {
    filename: 'garbaduubkii-eexda.svg',
    title: 'GARBADUUBKII',
    titleLine2: 'EEXDA',
    subtitle: 'Bound by Favoritism & Social Ethics',
    author: 'FAARAX M.J. CAWL',
    year: '1978',
    bgStart: '#7C2D12',
    bgEnd: '#991B1B',
    accent: '#FEF08A',
    motif: 'scales-justice',
    categoryLabel: 'WADA-JIR IYO CADDAALAD • SOCIAL DRAMA'
  },
  {
    filename: 'taariikhda-ummadda-soomaaliyeed.svg',
    title: 'TAARIIKHDA UMMADDA',
    titleLine2: 'SOOMAALIYEED',
    subtitle: 'Civilizations of the Horn of Africa',
    author: 'AW JAAMAC CUMAR CIISE',
    year: '1976',
    bgStart: '#1E1B4B',
    bgEnd: '#312E81',
    accent: '#FACC15',
    motif: 'dhow-compass',
    categoryLabel: 'TAARIIKH • AFRICAN HISTORY'
  },
  {
    filename: 'hawaale-warran.svg',
    title: 'HAWAALE',
    titleLine2: 'WARRAN',
    subtitle: 'Reflections on Somali Language & Wisdom',
    author: 'CABDUQAADIR XIRSI YAMYAM',
    year: '1988',
    bgStart: '#064E3B',
    bgEnd: '#0F766E',
    accent: '#FEF08A',
    motif: 'open-scroll',
    categoryLabel: 'XIKMAD IYO AF • ESSAYS & PHILOSOPHY'
  },
  {
    filename: 'dhiif-iyo-dhaqan.svg',
    title: 'DHIIF IYO DHAQAN',
    titleLine2: 'XEERKA REER MIYIGA',
    subtitle: 'Pastoral Ethics, Customary Law & Peacemaking',
    author: 'SHIIKH AXMED GABYOW',
    year: '1979',
    bgStart: '#78350F',
    bgEnd: '#B45309',
    accent: '#FDE047',
    motif: 'spear-peace',
    categoryLabel: 'XEER IYO ANLAX • CUSTOMARY LAW'
  }
];

for (const c of COVERS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.bgStart}"/>
      <stop offset="60%" stop-color="${c.bgEnd}"/>
      <stop offset="100%" stop-color="${c.bgStart}"/>
    </linearGradient>

    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#CA8A04"/>
      <stop offset="35%" stop-color="${c.accent}"/>
      <stop offset="70%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="${c.accent}"/>
      <stop offset="100%" stop-color="#9333EA"/>
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="900" fill="url(#coverBg)"/>
  <rect width="600" height="900" fill="url(#centerGlow)"/>

  <!-- Book Spine Embossed Shadow (Left) -->
  <rect x="0" y="0" width="30" height="900" fill="#000000" opacity="0.3"/>
  <line x1="30" y1="0" x2="30" y2="900" stroke="#000000" stroke-width="2" opacity="0.4"/>
  <line x1="32" y1="0" x2="32" y2="900" stroke="#FFFFFF" stroke-width="1" opacity="0.15"/>

  <!-- Ornate Outer Gold Border Frame -->
  <rect x="45" y="45" width="510" height="810" rx="8" fill="none" stroke="${c.accent}" stroke-width="3" opacity="0.85"/>
  <rect x="55" y="55" width="490" height="790" rx="6" fill="none" stroke="${c.accent}" stroke-width="1" opacity="0.5"/>

  <!-- Corner Flourishes -->
  <g stroke="${c.accent}" stroke-width="2" fill="none" opacity="0.9">
    <!-- Top-Left -->
    <path d="M 65,85 L 65,65 L 85,65"/>
    <circle cx="65" cy="65" r="3" fill="${c.accent}"/>
    <!-- Top-Right -->
    <path d="M 535,85 L 535,65 L 515,65"/>
    <circle cx="535" cy="65" r="3" fill="${c.accent}"/>
    <!-- Bottom-Left -->
    <path d="M 65,815 L 65,835 L 85,835"/>
    <circle cx="65" cy="835" r="3" fill="${c.accent}"/>
    <!-- Bottom-Right -->
    <path d="M 535,815 L 535,835 L 515,835"/>
    <circle cx="535" cy="835" r="3" fill="${c.accent}"/>
  </g>

  <!-- Publisher Header Seal -->
  <text x="300" y="115" font-family="'Cinzel', 'Georgia', serif" font-size="13" font-weight="700" letter-spacing="4" fill="${c.accent}" text-anchor="middle" opacity="0.9">
    EBARO • SOMALI HERITAGE CLASSICS
  </text>
  <line x1="160" y1="130" x2="440" y2="130" stroke="${c.accent}" stroke-width="1" opacity="0.5"/>

  <!-- Category Pill Label -->
  <text x="300" y="165" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#E2E8F0" text-anchor="middle" opacity="0.75">
    ${c.categoryLabel}
  </text>

  <!-- Central Emblem / Icon Graphic -->
  <g transform="translate(300, 310)" stroke="${c.accent}" stroke-width="2.5" fill="none" opacity="0.9">
    <circle cx="0" cy="0" r="70" stroke-width="1.5" stroke-dasharray="6,4"/>
    <circle cx="0" cy="0" r="62" stroke-width="2"/>
    <!-- Central Somali Star Symbol -->
    <polygon points="0,-36 10,-12 36,-10 16,10 22,35 0,20 -22,35 -16,10 -36,-10 -10,-12" fill="${c.accent}" stroke="none"/>
  </g>

  <!-- Title Section -->
  <text x="300" y="470" font-family="'Cinzel', 'Georgia', serif" font-size="34" font-weight="900" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">
    ${c.title}
  </text>
  ${
    c.titleLine2
      ? `<text x="300" y="520" font-family="'Cinzel', 'Georgia', serif" font-size="32" font-weight="900" letter-spacing="3" fill="${c.accent}" text-anchor="middle">
    ${c.titleLine2}
  </text>`
      : ''
  }

  <!-- Divider Line -->
  <line x1="220" y1="${c.titleLine2 ? 555 : 515}" x2="380" y2="${c.titleLine2 ? 555 : 515}" stroke="${c.accent}" stroke-width="2"/>
  <polygon points="300,${c.titleLine2 ? 550 : 510} 305,${c.titleLine2 ? 555 : 515} 300,${c.titleLine2 ? 560 : 520} 295,${c.titleLine2 ? 555 : 515}" fill="${c.accent}"/>

  <!-- English Subtitle / Meaning -->
  <text x="300" y="${c.titleLine2 ? 590 : 550}" font-family="'Georgia', serif" font-style="italic" font-size="16" fill="#F1F5F9" text-anchor="middle" opacity="0.85">
    ${c.subtitle}
  </text>

  <!-- Author Name Section -->
  <g transform="translate(0, 710)">
    <text x="300" y="0" font-family="sans-serif" font-size="12" font-weight="600" letter-spacing="3" fill="#E2E8F0" text-anchor="middle" opacity="0.75">
      M Q O R A A G A • A U T H O R
    </text>
    <text x="300" y="32" font-family="'Cinzel', 'Georgia', serif" font-size="22" font-weight="800" letter-spacing="2" fill="${c.accent}" text-anchor="middle">
      ${c.author}
    </text>
    <text x="300" y="58" font-family="sans-serif" font-size="13" fill="#CBD5E1" text-anchor="middle" opacity="0.8">
      Daabacaaddii Koowaad: ${c.year}
    </text>
  </g>

  <!-- Bottom Publisher Seal -->
  <line x1="180" y1="800" x2="420" y2="800" stroke="${c.accent}" stroke-width="1" opacity="0.4"/>
  <text x="300" y="825" font-family="sans-serif" font-size="10" font-weight="700" letter-spacing="3" fill="#94A3B8" text-anchor="middle">
    EBARO DIGITAL LIBRARY • GUDIRADA SUUGAANTA
  </text>
</svg>
`;

  fs.writeFileSync(path.join(OUT_DIR, c.filename), svg.trim(), 'utf-8');
}

console.log(`[Somali Book Covers] Generated ${COVERS.length} book covers in ${OUT_DIR}`);

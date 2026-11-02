/**
 * Generates 144 bespoke picture-book SVG illustrations in public/illustrations/somali-kids/:
 * - 24 Vocabulary Picture Quiz Illustrations (vocab-*.svg)
 * - 30 Story Cover Illustrations (<storyId>-cover.svg)
 * - 90 Story Scene Illustrations (<storyId>-scene-1.svg, -scene-2.svg, -scene-3.svg)
 *
 * Each story has a unique visual recipe (sky palette, terrain, architecture/nature backdrop,
 * primary character motif, and scene progression) so no two stories share the same illustration.
 */

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'public', 'illustrations', 'somali-kids');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ----------------------------------------------------------------------------
// 1. reusable high-detail SVG character & environment motifs
// ----------------------------------------------------------------------------
function renderMotif(motif, x, y, scale = 1, accent = '#C69461') {
  const tr = `transform="translate(${x}, ${y}) scale(${scale})"`;
  switch (motif) {
    case 'camel':
      return `<g ${tr}>
        <line x1="25" y1="75" x2="20" y2="135" stroke="#8C6239" stroke-width="8" stroke-linecap="round"/>
        <line x1="45" y1="75" x2="48" y2="135" stroke="#75502D" stroke-width="7" stroke-linecap="round"/>
        <line x1="85" y1="75" x2="80" y2="135" stroke="#8C6239" stroke-width="8" stroke-linecap="round"/>
        <line x1="100" y1="75" x2="106" y2="135" stroke="#75502D" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="64" cy="66" rx="46" ry="25" fill="${accent}"/>
        <ellipse cx="60" cy="40" rx="24" ry="19" fill="${accent}"/>
        <path d="M98 62 Q122 55 126 16" stroke="${accent}" stroke-width="16" fill="none" stroke-linecap="round"/>
        <ellipse cx="135" cy="14" rx="17" ry="11" fill="${accent}"/>
        <circle cx="123" cy="4" r="4.5" fill="#75502D"/>
        <circle cx="139" cy="12" r="3" fill="#252622"/>
        <circle cx="140" cy="11" r="1" fill="#FFFFFF"/>
      </g>`;
    case 'bird':
      return `<g ${tr}>
        <ellipse cx="48" cy="52" rx="28" ry="20" fill="${accent}"/>
        <path d="M32 48 Q48 30 64 52" fill="#344C3D"/>
        <circle cx="72" cy="40" r="15" fill="${accent}"/>
        <polygon points="86,37 102,41 86,45" fill="#D9A05B"/>
        <circle cx="75" cy="37" r="3" fill="#252622"/>
        <circle cx="76" cy="36" r="1" fill="#FFFFFF"/>
        <line x1="42" y1="70" x2="36" y2="90" stroke="#5C4738" stroke-width="4" stroke-linecap="round"/>
        <line x1="56" y1="70" x2="62" y2="90" stroke="#5C4738" stroke-width="4" stroke-linecap="round"/>
      </g>`;
    case 'cat':
      return `<g ${tr}>
        <ellipse cx="60" cy="76" rx="34" ry="22" fill="${accent}"/>
        <circle cx="88" cy="52" r="18" fill="${accent}"/>
        <polygon points="75,38 80,22 88,36" fill="${accent}"/>
        <polygon points="90,36 98,22 103,38" fill="${accent}"/>
        <circle cx="84" cy="50" r="2.8" fill="#252622"/>
        <circle cx="95" cy="50" r="2.8" fill="#252622"/>
        <polygon points="88,55 92,55 90,58" fill="#B66E50"/>
        <path d="M26 72 Q8 55 18 35" stroke="${accent}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <line x1="40" y1="94" x2="40" y2="115" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
        <line x1="76" y1="94" x2="76" y2="115" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
      </g>`;
    case 'goat':
      return `<g ${tr}>
        <line x1="35" y1="78" x2="32" y2="122" stroke="#5C4738" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="78" x2="52" y2="122" stroke="#5C4738" stroke-width="6" stroke-linecap="round"/>
        <line x1="82" y1="78" x2="80" y2="122" stroke="#5C4738" stroke-width="6" stroke-linecap="round"/>
        <line x1="94" y1="78" x2="98" y2="122" stroke="#5C4738" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="65" cy="70" rx="38" ry="22" fill="#F7F5F0" stroke="#8C6239" stroke-width="2"/>
        <path d="M48 56 Q65 72 80 54" fill="${accent}"/>
        <circle cx="102" cy="44" r="15" fill="#F7F5F0" stroke="#8C6239" stroke-width="2"/>
        <path d="M96 30 Q86 16 78 24" stroke="#5C4738" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="106" cy="42" r="2.8" fill="#252622"/>
      </g>`;
    case 'lion':
      return `<g ${tr}>
        <ellipse cx="62" cy="76" rx="40" ry="25" fill="#D9A05B"/>
        <circle cx="102" cy="56" r="28" fill="#8C5828"/>
        <circle cx="104" cy="56" r="19" fill="#D9A05B"/>
        <circle cx="99" cy="52" r="3" fill="#252622"/>
        <circle cx="111" cy="52" r="3" fill="#252622"/>
        <polygon points="103,58 109,58 106,62" fill="#5C4738"/>
        <line x1="34" y1="96" x2="32" y2="128" stroke="#C68B45" stroke-width="9" stroke-linecap="round"/>
        <line x1="86" y1="96" x2="88" y2="128" stroke="#C68B45" stroke-width="9" stroke-linecap="round"/>
      </g>`;
    case 'tortoise':
      return `<g ${tr}>
        <path d="M22 84 A46 38 0 0 1 114 84 Z" fill="#344C3D" stroke="#252622" stroke-width="2"/>
        <path d="M36 84 A32 24 0 0 1 100 84 Z" fill="#A58A58"/>
        <circle cx="122" cy="74" r="12" fill="#5B8274"/>
        <circle cx="126" cy="71" r="2.5" fill="#252622"/>
        <ellipse cx="38" cy="90" rx="9" ry="6" fill="#5B8274"/>
        <ellipse cx="96" cy="90" rx="9" ry="6" fill="#5B8274"/>
      </g>`;
    case 'fish':
      return `<g ${tr}>
        <ellipse cx="68" cy="60" rx="42" ry="22" fill="${accent}"/>
        <polygon points="18,60 0,40 4,80" fill="#344C3D"/>
        <polygon points="62,38 78,24 82,40" fill="#D9A05B"/>
        <circle cx="94" cy="54" r="3.5" fill="#252622"/>
        <circle cx="95" cy="53" r="1.2" fill="#FFFFFF"/>
      </g>`;
    case 'elephant':
      return `<g ${tr}>
        <ellipse cx="66" cy="70" rx="46" ry="32" fill="#7D8480"/>
        <circle cx="108" cy="54" r="22" fill="#7D8480"/>
        <ellipse cx="94" cy="54" rx="14" ry="20" fill="#636966"/>
        <path d="M124 58 Q140 78 128 96" stroke="#7D8480" stroke-width="11" fill="none" stroke-linecap="round"/>
        <path d="M118 66 Q132 70 136 62" stroke="#F7F5F0" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="114" cy="48" r="3" fill="#252622"/>
        <rect x="34" y="94" width="12" height="32" rx="4" fill="#636966"/>
        <rect x="84" y="94" width="12" height="32" rx="4" fill="#636966"/>
      </g>`;
    case 'sun':
      return `<g ${tr}>
        <circle cx="64" cy="64" r="32" fill="#D9A05B"/>
        <circle cx="64" cy="64" r="24" fill="#E8B86D"/>
        <g stroke="#D9A05B" stroke-width="5" stroke-linecap="round">
          <line x1="64" y1="14" x2="64" y2="24"/>
          <line x1="64" y1="104" x2="64" y2="114"/>
          <line x1="14" y1="64" x2="24" y2="64"/>
          <line x1="104" y1="64" x2="114" y2="64"/>
          <line x1="28" y1="28" x2="36" y2="36"/>
          <line x1="92" y1="92" x2="100" y2="100"/>
          <line x1="100" y1="28" x2="92" y2="36"/>
          <line x1="36" y1="92" x2="28" y2="100"/>
        </g>
      </g>`;
    case 'moon_stars':
      return `<g ${tr}>
        <circle cx="64" cy="64" r="34" fill="#D9A05B"/>
        <circle cx="78" cy="54" r="28" fill="#252622"/>
        <circle cx="24" cy="32" r="4" fill="#F7F5F0"/>
        <circle cx="108" cy="36" r="5" fill="#E8B86D"/>
        <circle cx="102" cy="92" r="3.5" fill="#F7F5F0"/>
      </g>`;
    case 'rain_cloud':
      return `<g ${tr}>
        <ellipse cx="64" cy="52" rx="38" ry="20" fill="#8FA6A0"/>
        <circle cx="46" cy="42" r="18" fill="#A3B8B2"/>
        <circle cx="74" cy="38" r="22" fill="#A3B8B2"/>
        <g stroke="#344C3D" stroke-width="4" stroke-linecap="round">
          <line x1="42" y1="78" x2="36" y2="98"/>
          <line x1="64" y1="80" x2="58" y2="100"/>
          <line x1="86" y1="78" x2="80" y2="98"/>
        </g>
      </g>`;
    case 'acacia_tree':
      return `<g ${tr}>
        <path d="M64 125 L64 68 L32 38 M64 74 L96 40 M64 68 L64 34" stroke="#5C4738" stroke-width="8" stroke-linecap="round" fill="none"/>
        <ellipse cx="64" cy="34" rx="58" ry="15" fill="#344C3D"/>
        <ellipse cx="38" cy="42" rx="36" ry="11" fill="#43614E"/>
        <ellipse cx="90" cy="42" rx="36" ry="11" fill="#43614E"/>
      </g>`;
    case 'water_well':
      return `<g ${tr}>
        <ellipse cx="64" cy="88" rx="52" ry="18" fill="#8C6239"/>
        <ellipse cx="64" cy="86" rx="42" ry="13" fill="#344C3D"/>
        <ellipse cx="64" cy="86" rx="32" ry="9" fill="#5B8274"/>
        <rect x="24" y="36" width="8" height="48" fill="#5C4738"/>
        <rect x="96" y="36" width="8" height="48" fill="#5C4738"/>
        <rect x="20" y="32" width="88" height="8" fill="#8C6239"/>
      </g>`;
    case 'milk_dhiil':
      return `<g ${tr}>
        <path d="M46 36 L82 36 L90 92 Q64 106 38 92 Z" fill="#C69461" stroke="#5C4738" stroke-width="3"/>
        <path d="M48 22 L80 22 L82 36 L46 36 Z" fill="#8C6239"/>
        <line x1="44" y1="56" x2="84" y2="56" stroke="#5C4738" stroke-width="3"/>
        <line x1="42" y1="74" x2="86" y2="74" stroke="#5C4738" stroke-width="3"/>
      </g>`;
    case 'somali_aqal':
      return `<g ${tr}>
        <path d="M14 106 A54 52 0 0 1 122 106 Z" fill="#C69461" stroke="#5C4738" stroke-width="3"/>
        <path d="M24 106 A44 42 0 0 1 112 106" fill="none" stroke="#8C6239" stroke-width="3" stroke-dasharray="8 4"/>
        <path d="M54 106 L54 74 A14 14 0 0 1 82 74 L82 106 Z" fill="#344C3D"/>
      </g>`;
    case 'family_courtyard':
      return `<g ${tr}>
        <circle cx="44" cy="44" r="14" fill="#8C6239"/>
        <path d="M26 98 L34 58 L54 58 L62 98 Z" fill="#B66E50"/>
        <circle cx="84" cy="54" r="11" fill="#8C6239"/>
        <path d="M70 98 L75 66 L93 66 L98 98 Z" fill="#344C3D"/>
        <rect x="18" y="98" width="94" height="10" rx="3" fill="#D9A05B"/>
      </g>`;
    case 'school_book':
      return `<g ${tr}>
        <rect x="20" y="30" width="44" height="64" fill="#FFFFFF" stroke="#344C3D" stroke-width="3"/>
        <rect x="64" y="30" width="44" height="64" fill="#F7F5F0" stroke="#344C3D" stroke-width="3"/>
        <line x1="28" y1="46" x2="54" y2="46" stroke="#A58A58" stroke-width="3"/>
        <line x1="28" y1="58" x2="54" y2="58" stroke="#73736C" stroke-width="2"/>
        <line x1="72" y1="46" x2="98" y2="46" stroke="#A58A58" stroke-width="3"/>
        <line x1="72" y1="58" x2="98" y2="58" stroke="#73736C" stroke-width="2"/>
      </g>`;
    case 'pencil_slate':
      return `<g ${tr}>
        <rect x="22" y="26" width="76" height="62" rx="4" fill="#252622" stroke="#A58A58" stroke-width="5"/>
        <text x="36" y="64" fill="#F7F5F0" font-family="Georgia, serif" font-size="22" font-weight="bold">B T J</text>
        <line x1="84" y1="96" x2="112" y2="68" stroke="#D9A05B" stroke-width="7" stroke-linecap="round"/>
      </g>`;
    case 'sailboat_doon':
      return `<g ${tr}>
        <path d="M18 82 L110 82 L94 104 L34 104 Z" fill="#8C6239"/>
        <line x1="64" y1="22" x2="64" y2="82" stroke="#5C4738" stroke-width="4"/>
        <polygon points="64,24 106,74 64,74" fill="#FFFFFF" stroke="#E7E1D7" stroke-width="2"/>
        <polygon points="60,30 28,74 60,74" fill="#F4EFE6"/>
      </g>`;
    case 'woven_mat':
      return `<g ${tr}>
        <rect x="16" y="44" width="96" height="44" rx="3" fill="#D9A05B" stroke="#8C6239" stroke-width="3"/>
        <rect x="16" y="56" width="96" height="8" fill="#B66E50"/>
        <rect x="16" y="72" width="96" height="8" fill="#344C3D"/>
      </g>`;
    case 'lantern':
      return `<g ${tr}>
        <rect x="46" y="38" width="36" height="52" rx="6" fill="#E8B86D" stroke="#5C4738" stroke-width="4"/>
        <circle cx="64" cy="64" r="10" fill="#FFF8E7"/>
        <path d="M40 38 L88 38 L76 24 L52 24 Z" fill="#5C4738"/>
        <rect x="42" y="90" width="44" height="8" fill="#5C4738"/>
      </g>`;
    case 'mountain_hill':
      return `<g ${tr}>
        <polygon points="10,104 54,32 98,104" fill="#344C3D"/>
        <polygon points="52,104 88,46 122,104" fill="#5B8274"/>
      </g>`;
    case 'market_basket':
      return `<g ${tr}>
        <path d="M26 56 L102 56 L90 100 L38 100 Z" fill="#C69461" stroke="#8C6239" stroke-width="3"/>
        <path d="M42 56 A22 20 0 0 1 86 56" fill="none" stroke="#8C6239" stroke-width="4"/>
        <circle cx="50" cy="50" r="9" fill="#B66E50"/>
        <circle cx="68" cy="48" r="10" fill="#D9A05B"/>
        <circle cx="82" cy="51" r="8" fill="#344C3D"/>
      </g>`;
    case 'flower_garden':
    default:
      return `<g ${tr}>
        <line x1="42" y1="62" x2="42" y2="104" stroke="#344C3D" stroke-width="5"/>
        <line x1="84" y1="54" x2="84" y2="104" stroke="#344C3D" stroke-width="5"/>
        <circle cx="42" cy="54" r="14" fill="#B66E50"/>
        <circle cx="42" cy="54" r="6" fill="#E8B86D"/>
        <circle cx="84" cy="46" r="16" fill="#D9A05B"/>
        <circle cx="84" cy="46" r="7" fill="#FFFFFF"/>
      </g>`;
  }
}

// ----------------------------------------------------------------------------
// 2. Generate 24 Vocabulary Picture Quiz SVG Assets
// ----------------------------------------------------------------------------
const VOCAB_MOTIFS = [
  'camel',
  'bird',
  'cat',
  'goat',
  'lion',
  'tortoise',
  'fish',
  'elephant',
  'sun',
  'moon_stars',
  'rain_cloud',
  'acacia_tree',
  'water_well',
  'milk_dhiil',
  'somali_aqal',
  'family_courtyard',
  'school_book',
  'pencil_slate',
  'sailboat_doon',
  'woven_mat',
  'lantern',
  'mountain_hill',
  'market_basket',
  'flower_garden'
];

for (const key of VOCAB_MOTIFS) {
  const isNight = key === 'moon_stars';
  const bg = isNight ? '#252622' : '#F4EFE6';
  const ground = isNight ? '#344C3D' : '#E2CBB0';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
    <rect width="320" height="220" fill="${bg}"/>
    <rect y="165" width="320" height="55" fill="${ground}"/>
    <circle cx="265" cy="45" r="22" fill="${isNight ? '#D9A05B' : '#E8B86D'}" opacity="0.65"/>
    ${renderMotif(key, 88, 36, 1.15)}
  </svg>`;
  fs.writeFileSync(path.join(OUT_DIR, `vocab-${key}.svg`), svg, 'utf-8');
}

// ----------------------------------------------------------------------------
// 3. Generate 30 Story Cover + 90 Scene Illustrations (120 Story SVG Files)
// ----------------------------------------------------------------------------
const STORY_VISUAL_RECIPES = [
  { id: 'geelkii-yaraa', sky: '#F4EFE6', hills: '#C9D1C5', ground: '#E2CBB0', main: 'camel', second: 'acacia_tree', third: 'water_well', accent: '#C69461' },
  { id: 'shimbirtii-iyo-roobka', sky: '#EBF1ED', hills: '#B8C9BF', ground: '#D5DEC9', main: 'bird', second: 'rain_cloud', third: 'flower_garden', accent: '#B66E50' },
  { id: 'bisaddii-baroor', sky: '#F7F2E7', hills: '#D8CEBE', ground: '#E7DEC8', main: 'cat', second: 'milk_dhiil', third: 'woven_mat', accent: '#D9A05B' },
  { id: 'riyo-yar-oo-geesi-ah', sky: '#F2EDE2', hills: '#C4D0C0', ground: '#DEC5A7', main: 'goat', second: 'mountain_hill', third: 'acacia_tree', accent: '#B68452' },
  { id: 'qorraxda-subaxdii', sky: '#FFF6E3', hills: '#D4DFC8', ground: '#E9D3B4', main: 'sun', second: 'somali_aqal', third: 'family_courtyard', accent: '#E8B86D' },
  { id: 'buuggii-cagaarnaa', sky: '#F0F4F1', hills: '#C8D6CE', ground: '#E3DDD1', main: 'school_book', second: 'pencil_slate', third: 'family_courtyard', accent: '#344C3D' },
  { id: 'xiddigaha-habeenkii', sky: '#252622', hills: '#344C3D', ground: '#3D352E', main: 'moon_stars', second: 'somali_aqal', third: 'lantern', accent: '#D9A05B' },
  { id: 'kalluunkii-dahabiga', sky: '#E6F0EE', hills: '#88B3AC', ground: '#5B8274', main: 'fish', second: 'sailboat_doon', third: 'sun', accent: '#D9A05B' },
  { id: 'ubaxii-beerteenna', sky: '#F3F6EE', hills: '#BCD1B8', ground: '#D8E2C9', main: 'flower_garden', second: 'rain_cloud', third: 'bird', accent: '#B66E50' },
  { id: 'salaanta-wanaagsan', sky: '#F6F1E6', hills: '#D1C7B8', ground: '#E5DAC8', main: 'family_courtyard', second: 'somali_aqal', third: 'woven_mat', accent: '#A58A58' },

  // Level 2 (10 stories)
  { id: 'qoyska-caasha', sky: '#F5EFE4', hills: '#CEBFA8', ground: '#E3D3BC', main: 'family_courtyard', second: 'milk_dhiil', third: 'woven_mat', accent: '#B66E50' },
  { id: 'maalintii-koowaad-dugsiga', sky: '#EEF3F0', hills: '#C2D1C8', ground: '#DFD9CE', main: 'pencil_slate', second: 'school_book', third: 'family_courtyard', accent: '#344C3D' },
  { id: ' laba-saaxiib-iyo-geedka', sky: '#F2F5EC', hills: '#BDD0B6', ground: '#DCE4CE', main: 'acacia_tree', second: 'family_courtyard', third: 'water_well', accent: '#43614E' },
  { id: 'suuqa-khudaarta', sky: '#F9F1E4', hills: '#D9C5AB', ground: '#EAD9C2', main: 'market_basket', second: 'family_courtyard', third: 'sun', accent: '#C69461' },
  { id: 'diinkii-xigmadda-lahaa', sky: '#F1EFE8', hills: '#C1C9BC', ground: '#DCD6C6', main: 'tortoise', second: 'water_well', third: 'acacia_tree', accent: '#344C3D' },
  { id: 'doonta-xeebta-berbera', sky: '#E5F0EE', hills: '#96BCB5', ground: '#6B9991', main: 'sailboat_doon', second: 'fish', third: 'sun', accent: '#8C6239' },
  { id: 'roobkii-la-sugayay', sky: '#E8EFEA', hills: '#B4C7BC', ground: '#CEDBC9', main: 'rain_cloud', second: 'goat', third: 'flower_garden', accent: '#5B8274' },
  { id: 'sheekadii-ayeeyo-xaliimo', sky: '#2C2D28', hills: '#3E473D', ground: '#4A4036', main: 'lantern', second: 'woven_mat', third: 'moon_stars', accent: '#E8B86D' },
  { id: 'safarkii-buurta-daallo', sky: '#EAF2EE', hills: '#9BB5A6', ground: '#C5D6C8', main: 'mountain_hill', second: 'bird', third: 'acacia_tree', accent: '#344C3D' },
  { id: 'faraska-booddo', sky: '#F6EFE3', hills: '#CFBFA9', ground: '#E4D2BA', main: 'camel', second: 'mountain_hill', third: 'sun', accent: '#9E7044' },

  // Level 3 (10 stories)
  { id: 'ceelkii-la-wadaagay', sky: '#F3ECE0', hills: '#C8BA9F', ground: '#DFCFAF', main: 'water_well', second: 'camel', third: 'family_courtyard', accent: '#344C3D' },
  { id: 'runta-iyo-amaanada', sky: '#EFECE4', hills: '#C7C0B0', ground: '#DED7C7', main: 'market_basket', second: 'school_book', third: 'family_courtyard', accent: '#A58A58' },
  { id: 'ilaaliyaha-dhirta-miyiga', sky: '#EBF2EC', hills: '#A8C2AE', ground: '#CBE0CC', main: 'acacia_tree', second: 'rain_cloud', third: 'flower_garden', accent: '#344C3D' },
  { id: 'xiddig-iyaha-badmaaxa', sky: '#212624', hills: '#31443D', ground: '#2C3B35', main: 'sailboat_doon', second: 'moon_stars', third: 'lantern', accent: '#D9A05B' },
  { id: 'libaaxii-iyo-jiirkii-yaraa', sky: '#F5EDE0', hills: '#CCB99E', ground: '#E3CFB2', main: 'lion', second: 'acacia_tree', third: 'sun', accent: '#D9A05B' },
  { id: 'tartankii-akhriska-dugsiga', sky: '#EDF2EF', hills: '#B8C9C0', ground: '#D9E0DC', main: 'school_book', second: 'pencil_slate', third: 'family_courtyard', accent: '#344C3D' },
  { id: 'dhismaha-aqalka-soomaaliga', sky: '#F6EFE3', hills: '#D0BFA6', ground: '#E5D5BC', main: 'somali_aqal', second: 'woven_mat', third: 'milk_dhiil', accent: '#C69461' },
  { id: 'maroodigii-iyo-webiga-shabeelle', sky: '#E9F1EE', hills: '#A4C0B7', ground: '#C4D9CF', main: 'elephant', second: 'water_well', third: 'acacia_tree', accent: '#5B8274' },
  { id: 'nabadda-tuulada-barwaaqo', sky: '#F2F4EB', hills: '#BCC9AE', ground: '#D7E0C9', main: 'family_courtyard', second: 'acacia_tree', third: 'flower_garden', accent: '#344C3D' },
  { id: 'rijada-habeenka-curashada', sky: '#252622', hills: '#37473E', ground: '#3B342D', main: 'moon_stars', second: 'lantern', third: 'family_courtyard', accent: '#E8B86D' }
];

for (let idx = 0; idx < STORY_VISUAL_RECIPES.length; idx++) {
  const r = STORY_VISUAL_RECIPES[idx];
  const cleanId = r.id.trim();
  const isNight = r.sky.startsWith('#2');

  // Generate Cover + 3 Scenes (s = 0 cover, 1 scene-1, 2 scene-2, 3 scene-3)
  for (let s = 0; s <= 3; s++) {
    const filename = s === 0 ? `${cleanId}-cover.svg` : `${cleanId}-scene-${s}.svg`;
    const mainX = s === 0 ? 410 : s === 1 ? 260 : s === 2 ? 450 : 540;
    const secondX = s === 0 ? 110 : s === 1 ? 520 : s === 2 ? 150 : 120;
    const thirdX = s === 0 ? 640 : s === 1 ? 80 : s === 2 ? 660 : 340;
    const sunX = 120 + ((idx * 37 + s * 140) % 620);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 420" width="860" height="420">
      <rect width="860" height="420" fill="${r.sky}"/>
      ${
        isNight
          ? `<g fill="#F7F5F0" opacity="0.85">
              <circle cx="120" cy="60" r="3"/>
              <circle cx="290" cy="45" r="2.5"/>
              <circle cx="460" cy="70" r="3.5"/>
              <circle cx="650" cy="52" r="2.5"/>
              <circle cx="770" cy="80" r="3"/>
            </g>`
          : `<circle cx="${sunX}" cy="84" r="38" fill="#D9A05B" opacity="0.85"/>`
      }
      <path d="M0 285 Q210 ${215 + (s * 12)} 430 275 T860 255 L860 420 L0 420 Z" fill="${r.hills}"/>
      <path d="M0 320 Q280 ${282 - (s * 8)} 560 315 T860 300 L860 420 L0 420 Z" fill="${r.ground}"/>
      ${renderMotif(r.second, secondX, 145, 1.18, r.accent)}
      ${renderMotif(r.third, thirdX, 175, 1.08, r.accent)}
      ${renderMotif(r.main, mainX, 178, 1.32, r.accent)}
    </svg>`;

    fs.writeFileSync(path.join(OUT_DIR, filename), svg, 'utf-8');
  }
}

console.log(
  `[Folio Somali Kids Illustrator] Generated ${VOCAB_MOTIFS.length} vocab illustrations and ${
    STORY_VISUAL_RECIPES.length * 4
  } story cover & scene SVG files in ${OUT_DIR}`
);

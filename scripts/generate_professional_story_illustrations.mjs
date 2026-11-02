/**
 * High-Fidelity Editorial Story Illustration Generator for eBaro
 * Generates 120 professional, clearly understandable story illustrations:
 * - 30 Story Covers (<storyId>-cover.svg)
 * - 90 Story Scenes (<storyId>-scene-1.svg, scene-2.svg, scene-3.svg)
 *
 * Each story is given bespoke, highly recognizable characters, authentic environments,
 * atmospheric lighting, rich SVG gradients, and cultural fidelity.
 */

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'public', 'illustrations', 'somali-kids');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ----------------------------------------------------------------------------
// Reusable Gradient Defs & Atmospheric Lighting
// ----------------------------------------------------------------------------
function getCommonDefs(paletteId) {
  return `
    <defs>
      <!-- Shadow Filters -->
      <filter id="storyDropShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.22"/>
      </filter>
      <filter id="sunHaloGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>

      <!-- Skies -->
      <linearGradient id="skyDawn" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FED7AA"/>
        <stop offset="35%" stop-color="#FEF08A"/>
        <stop offset="70%" stop-color="#BAE6FD"/>
        <stop offset="100%" stop-color="#E0F2FE"/>
      </linearGradient>

      <linearGradient id="skyMidday" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0284C7"/>
        <stop offset="45%" stop-color="#38BDF8"/>
        <stop offset="80%" stop-color="#BAE6FD"/>
        <stop offset="100%" stop-color="#FEF9C3"/>
      </linearGradient>

      <linearGradient id="skySunset" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#7C2D12"/>
        <stop offset="35%" stop-color="#EA580C"/>
        <stop offset="65%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#FEF08A"/>
      </linearGradient>

      <radialGradient id="skyNight" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#1E1B4B"/>
        <stop offset="40%" stop-color="#0F172A"/>
        <stop offset="80%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#000000"/>
      </radialGradient>

      <!-- Terrain Gradients -->
      <linearGradient id="savannaDune" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="50%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#B45309"/>
      </linearGradient>

      <linearGradient id="greenPasture" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4ADE80"/>
        <stop offset="50%" stop-color="#16A34A"/>
        <stop offset="100%" stop-color="#14532D"/>
      </linearGradient>

      <linearGradient id="coastalSea" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0284C7"/>
        <stop offset="50%" stop-color="#0369A1"/>
        <stop offset="100%" stop-color="#075985"/>
      </linearGradient>

      <linearGradient id="dhowWood" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#451A03"/>
        <stop offset="40%" stop-color="#78350F"/>
        <stop offset="80%" stop-color="#92400E"/>
        <stop offset="100%" stop-color="#B45309"/>
      </linearGradient>

      <linearGradient id="camelCoat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D97706"/>
        <stop offset="50%" stop-color="#B45309"/>
        <stop offset="100%" stop-color="#78350F"/>
      </linearGradient>

      <linearGradient id="calfCoat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047"/>
        <stop offset="50%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>

      <linearGradient id="whiteCoatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="65%" stop-color="#F1F5F9"/>
        <stop offset="100%" stop-color="#CBD5E1"/>
      </linearGradient>

      <linearGradient id="slateSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#64748B"/>
        <stop offset="60%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>

      <linearGradient id="goldMane" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="50%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#92400E"/>
      </linearGradient>

      <radialGradient id="sunDisk" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="40%" stop-color="#FEF08A"/>
        <stop offset="80%" stop-color="#F59E0B" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
      </radialGradient>
    </defs>
  `;
}

// ----------------------------------------------------------------------------
// Character & Subject Renderers (High detail, clear silhouette)
// ----------------------------------------------------------------------------

function renderSavannaAcacia(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <path d="M 45,180 C 48,135 52,95 55,60 L 65,60 C 62,95 58,135 62,180 Z" fill="#451A03"/>
      <!-- Main spreading limbs -->
      <path d="M 58,75 Q 30,55 0,50 L 0,42 Q 32,48 60,65 Z" fill="#451A03"/>
      <path d="M 60,75 Q 90,55 120,50 L 120,42 Q 88,48 60,65 Z" fill="#451A03"/>
      <!-- Canopy Layer -->
      <ellipse cx="60" cy="40" rx="65" ry="16" fill="#14532D"/>
      <ellipse cx="10" cy="46" rx="35" ry="12" fill="#15803D"/>
      <ellipse cx="110" cy="46" rx="35" ry="12" fill="#15803D"/>
      <ellipse cx="60" cy="36" rx="55" ry="12" fill="#22C55E" opacity="0.3"/>
    </g>
  `;
}

function renderCamelsMotherAndCalf(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Ground shadow -->
      <ellipse cx="160" cy="210" rx="150" ry="16" fill="#451A03" opacity="0.25"/>

      <!-- TALL MOTHER CAMEL (Right) -->
      <g transform="translate(110, 0)">
        <!-- Legs Far -->
        <line x1="45" y1="120" x2="40" y2="200" stroke="#78350F" stroke-width="7" stroke-linecap="round"/>
        <line x1="105" y1="120" x2="100" y2="200" stroke="#78350F" stroke-width="7" stroke-linecap="round"/>
        <!-- Torso & Hump -->
        <ellipse cx="80" cy="100" rx="52" ry="32" fill="url(#camelCoat)"/>
        <path d="M 60,75 C 65,40 100,40 105,75 Z" fill="url(#camelCoat)"/>
        <!-- Legs Near -->
        <line x1="58" y1="120" x2="55" y2="205" stroke="#92400E" stroke-width="8" stroke-linecap="round"/>
        <line x1="120" y1="120" x2="118" y2="205" stroke="#92400E" stroke-width="8" stroke-linecap="round"/>
        <!-- Padded Hooves -->
        <ellipse cx="55" cy="205" rx="7" ry="4" fill="#451A03"/>
        <ellipse cx="118" cy="205" rx="7" ry="4" fill="#451A03"/>
        <!-- Long Curved Neck & Head -->
        <path d="M 115,100 C 145,85 152,40 148,15 L 136,18 C 132,45 125,75 105,92 Z" fill="url(#camelCoat)"/>
        <ellipse cx="152" cy="16" rx="16" ry="10" fill="url(#camelCoat)"/>
        <ellipse cx="156" cy="14" rx="3.5" ry="3.5" fill="#1E293B"/>
        <circle cx="155" cy="13" r="1.2" fill="#FFFFFF"/>
        <polygon points="144,8 148,2 152,8" fill="#78350F"/>
        <!-- Tail -->
        <path d="M 32,95 Q 22,125 25,145" stroke="#78350F" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- CUTE YOUNG CALF DALMAR (Left, walking happily beside mother) -->
      <g transform="translate(10, 55) scale(0.65)">
        <!-- Legs Far -->
        <line x1="45" y1="110" x2="40" y2="185" stroke="#B45309" stroke-width="6" stroke-linecap="round"/>
        <line x1="100" y1="110" x2="95" y2="185" stroke="#B45309" stroke-width="6" stroke-linecap="round"/>
        <!-- Torso & Small Hump -->
        <ellipse cx="75" cy="95" rx="42" ry="26" fill="url(#calfCoat)"/>
        <path d="M 60,75 C 65,52 90,52 95,75 Z" fill="url(#calfCoat)"/>
        <!-- Legs Near -->
        <line x1="56" y1="110" x2="52" y2="190" stroke="#D97706" stroke-width="7" stroke-linecap="round"/>
        <line x1="112" y1="110" x2="110" y2="190" stroke="#D97706" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="52" cy="190" rx="6" ry="3.5" fill="#451A03"/>
        <ellipse cx="110" cy="190" rx="6" ry="3.5" fill="#451A03"/>
        <!-- Neck & Head (Curious alert posture) -->
        <path d="M 105,95 C 130,80 135,45 130,22 L 120,24 C 118,45 112,70 95,85 Z" fill="url(#calfCoat)"/>
        <ellipse cx="135" cy="24" rx="14" ry="9" fill="url(#calfCoat)"/>
        <ellipse cx="138" cy="22" rx="3.5" ry="3.5" fill="#1E293B"/>
        <circle cx="137" cy="21" r="1.2" fill="#FFFFFF"/>
        <polygon points="128,15 132,10 135,16" fill="#92400E"/>
        <!-- Small tail wagging -->
        <path d="M 35,90 Q 20,110 26,125" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </g>
    </g>
  `;
}

function renderPlayfulCatAndButterfly(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Stone garden wall background -->
      <rect x="0" y="80" width="280" height="90" rx="4" fill="#D6D3D1" stroke="#78716C" stroke-width="2"/>
      <g stroke="#A8A29E" stroke-width="1.5">
        <line x1="0" y1="110" x2="280" y2="110"/>
        <line x1="0" y1="140" x2="280" y2="140"/>
        <line x1="60" y1="80" x2="60" y2="110"/><line x1="140" y1="80" x2="140" y2="110"/><line x1="220" y1="80" x2="220" y2="110"/>
        <line x1="100" y1="110" x2="100" y2="140"/><line x1="180" y1="110" x2="180" y2="140"/>
      </g>
      <!-- Desert flowers peeking over wall -->
      <circle cx="45" cy="72" r="9" fill="#EF4444"/><circle cx="45" cy="72" r="3" fill="#FEF08A"/>
      <circle cx="235" cy="75" r="8" fill="#F59E0B"/><circle cx="235" cy="75" r="2.5" fill="#FEF08A"/>

      <!-- BAROOR THE GINGER TABBY KITTEN (Standing on wall) -->
      <g transform="translate(70, 30)">
        <!-- Curled Tail -->
        <path d="M 25,65 C 5,70 -5,45 8,30 C 15,22 20,35 15,45" stroke="#EA580C" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Torso -->
        <ellipse cx="65" cy="65" rx="34" ry="22" fill="#F97316"/>
        <path d="M 50,50 Q 55,70 52,80 M 65,48 Q 70,70 68,82 M 78,52 Q 82,70 80,80" stroke="#C2410C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- White Bib & Paws -->
        <ellipse cx="85" cy="70" rx="14" ry="12" fill="#FFF7ED"/>
        <rect x="42" y="80" width="8" height="22" rx="4" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1"/>
        <rect x="75" y="80" width="8" height="22" rx="4" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1"/>
        <!-- Head -->
        <circle cx="95" cy="50" r="18" fill="#F97316"/>
        <polygon points="85,38 90,20 98,34" fill="#EA580C"/>
        <polygon points="88,34 91,24 96,32" fill="#FCA5A5"/>
        <polygon points="102,34 110,20 115,38" fill="#EA580C"/>
        <polygon points="104,32 109,24 112,34" fill="#FCA5A5"/>
        <!-- Face Features -->
        <ellipse cx="90" cy="48" rx="3.5" ry="4.5" fill="#15803D"/>
        <ellipse cx="102" cy="48" rx="3.5" ry="4.5" fill="#15803D"/>
        <circle cx="89" cy="46" r="1" fill="#FFFFFF"/>
        <circle cx="101" cy="46" r="1" fill="#FFFFFF"/>
        <polygon points="94,54 98,54 96,57" fill="#F472B6"/>
        <!-- Whiskers -->
        <line x1="88" y1="56" x2="72" y2="52" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="88" y1="58" x2="70" y2="60" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="104" y1="56" x2="120" y2="52" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="104" y1="58" x2="122" y2="60" stroke="#FFFFFF" stroke-width="1.5"/>
      </g>

      <!-- COLORFUL BUTTERFLY (Hovering in air) -->
      <g transform="translate(205, 15)">
        <polygon points="10,12 25,0 20,18" fill="#38BDF8"/>
        <polygon points="10,14 24,24 18,18" fill="#0284C7"/>
        <polygon points="8,12 -7,0 -2,18" fill="#38BDF8"/>
        <polygon points="8,14 -6,24 0,18" fill="#0284C7"/>
        <line x1="9" y1="8" x2="9" y2="22" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
      </g>
    </g>
  `;
}

function renderBraveGoat(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Rocky outcrop / cliff top -->
      <polygon points="20,190 120,120 220,135 300,190" fill="#78716C" stroke="#44403C" stroke-width="2"/>
      <polygon points="70,145 140,110 190,130 110,165" fill="#A8A29E"/>

      <!-- SOMALI BLACKHEAD GOAT (Standing proudly atop rocks) -->
      <g transform="translate(90, 20)">
        <!-- Legs -->
        <line x1="35" y1="95" x2="32" y2="135" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round"/>
        <line x1="95" y1="95" x2="92" y2="135" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round"/>
        <rect x="30" y="132" width="7" height="4" rx="1" fill="#0F172A"/>
        <rect x="90" y="132" width="7" height="4" rx="1" fill="#0F172A"/>
        <!-- Pure White Torso -->
        <ellipse cx="65" cy="85" rx="42" ry="24" fill="url(#whiteCoatGrad)" stroke="#CBD5E1" stroke-width="1.5"/>
        <!-- Tail -->
        <path d="M 25,80 Q 15,68 20,60" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Jet-black neck & head -->
        <path d="M 85,85 C 95,75 105,55 110,40 L 120,45 C 115,70 102,88 88,95 Z" fill="#0F172A"/>
        <ellipse cx="120" cy="40" rx="16" ry="11" fill="#0F172A"/>
        <polygon points="128,42 134,44 130,48" fill="#1E293B"/>
        <!-- Backward-curving horns -->
        <path d="M 112,32 C 105,15 92,10 82,8 C 92,18 102,30 108,35" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 118,34 C 112,18 100,12 90,10 C 100,20 110,32 114,37" stroke="#78350F" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Soft drooping ear -->
        <path d="M 110,45 Q 102,58 104,65" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Inquisitive Eye -->
        <circle cx="122" cy="38" r="3" fill="#F59E0B"/>
        <circle cx="121" cy="37" r="1" fill="#FFFFFF"/>
      </g>
    </g>
  `;
}

function renderLionAndMouse(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Savanna grass and ground shadow -->
      <ellipse cx="160" cy="190" rx="140" ry="16" fill="#451A03" opacity="0.25"/>

      <!-- MAJESTIC LION (Boqorka Kaynta) Resting proudly -->
      <g transform="translate(60, 40)">
        <!-- Massive Body & Haunches -->
        <ellipse cx="110" cy="115" rx="65" ry="36" fill="#D97706"/>
        <!-- Tail with tuft -->
        <path d="M 45,115 C 20,125 15,160 30,175" stroke="#B45309" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="30" cy="175" r="7" fill="#451A03"/>
        <!-- Front Paws Resting Forward -->
        <ellipse cx="150" cy="145" rx="22" ry="10" fill="#B45309"/>
        <ellipse cx="180" cy="145" rx="22" ry="10" fill="#D97706"/>
        <line x1="172" y1="145" x2="172" y2="152" stroke="#451A03" stroke-width="2"/>
        <line x1="180" y1="145" x2="180" y2="152" stroke="#451A03" stroke-width="2"/>
        <line x1="188" y1="145" x2="188" y2="152" stroke="#451A03" stroke-width="2"/>
        <!-- Magnificent Golden Mane -->
        <circle cx="160" cy="85" r="48" fill="url(#goldMane)"/>
        <!-- Mane Tufts -->
        <path d="M 125,50 Q 140,30 160,35 Q 185,30 195,52 Q 215,75 205,105 Q 185,135 155,130 Q 125,135 115,100 Z" fill="#92400E" opacity="0.4"/>
        <!-- Lion Face -->
        <ellipse cx="165" cy="85" rx="26" ry="24" fill="#F59E0B"/>
        <!-- Muzzle -->
        <ellipse cx="165" cy="94" rx="14" ry="10" fill="#FEF3C7"/>
        <polygon points="160,88 170,88 165,94" fill="#451A03"/>
        <!-- Gentle Wise Eyes -->
        <ellipse cx="155" cy="80" rx="4.5" ry="5.5" fill="#78350F"/>
        <circle cx="154" cy="78" r="1.5" fill="#FFFFFF"/>
        <ellipse cx="175" cy="80" rx="4.5" ry="5.5" fill="#78350F"/>
        <circle cx="174" cy="78" r="1.5" fill="#FFFFFF"/>
        <!-- Whiskers -->
        <line x1="158" y1="94" x2="135" y2="92" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="158" y1="97" x2="132" y2="100" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="172" y1="94" x2="195" y2="92" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="172" y1="97" x2="198" y2="100" stroke="#FFFFFF" stroke-width="1.5"/>
      </g>

      <!-- TINY BRAVE MOUSE (Jiirkii Yaraa) Standing on rock before lion -->
      <g transform="translate(235, 140)">
        <!-- Pebble -->
        <ellipse cx="25" cy="38" rx="16" ry="8" fill="#78716C"/>
        <!-- Mouse Body -->
        <ellipse cx="24" cy="22" rx="11" ry="8" fill="#A8A29E"/>
        <circle cx="32" cy="18" r="6" fill="#A8A29E"/>
        <circle cx="30" cy="14" r="3.5" fill="#FCA5A5"/>
        <!-- Tiny black eye -->
        <circle cx="34" cy="17" r="1.2" fill="#0F172A"/>
        <!-- Little tail -->
        <path d="M 14,24 Q 5,20 2,28" stroke="#FCA5A5" stroke-width="1.5" fill="none"/>
      </g>
    </g>
  `;
}

function renderElephantByRiver(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Riverbank reed grass -->
      <path d="M 20,180 Q 25,120 40,90 M 35,180 Q 45,115 50,85 M 50,180 Q 55,130 65,100" stroke="#15803D" stroke-width="3" stroke-linecap="round"/>

      <!-- ELEPHANT SPLASHING WATER IN RIVER -->
      <g transform="translate(60, 20)">
        <!-- River Water ripples around legs -->
        <ellipse cx="140" cy="175" rx="110" ry="18" fill="#0284C7" opacity="0.6"/>
        <ellipse cx="140" cy="175" rx="85" ry="12" fill="#38BDF8" opacity="0.4"/>

        <!-- Massive Body -->
        <ellipse cx="110" cy="100" rx="65" ry="45" fill="url(#slateSkin)"/>
        <!-- Pillar Legs -->
        <rect x="70" y="115" width="22" height="60" rx="8" fill="#334155"/>
        <rect x="135" y="115" width="22" height="60" rx="8" fill="#475569"/>
        <!-- Large Contoured African Ear -->
        <path d="M 145,55 C 130,45 105,55 105,85 C 105,120 135,135 155,130 C 165,130 170,100 165,75 Z" fill="#475569" stroke="#1E293B" stroke-width="1.5"/>
        <path d="M 120,70 Q 135,90 140,115" stroke="#FCA5A5" stroke-width="2" opacity="0.5" fill="none"/>
        <!-- Head & Dome -->
        <circle cx="170" cy="80" r="30" fill="url(#slateSkin)"/>
        <!-- Curving Ivory Tusk -->
        <path d="M 185,95 C 205,105 218,125 228,118 C 225,105 205,90 188,88 Z" fill="#FEF08A" stroke="#B45309" stroke-width="1"/>
        <!-- Curled Trunk Spraying Water -->
        <path d="M 195,85 C 220,95 240,115 242,138 C 242,158 220,170 205,160 C 195,152 200,140 210,142 C 220,145 228,138 225,125 C 220,105 200,95 188,85 Z" fill="url(#slateSkin)"/>
        <!-- Water droplets spraying from trunk -->
        <g fill="#38BDF8">
          <circle cx="215" cy="115" r="4"/><circle cx="225" cy="100" r="3"/><circle cx="205" cy="95" r="3.5"/>
          <circle cx="235" cy="85" r="2.5"/><circle cx="220" cy="75" r="3"/>
        </g>
        <!-- Kind Eye -->
        <circle cx="165" cy="75" r="3" fill="#0F172A"/>
        <circle cx="164" cy="74" r="1" fill="#FFFFFF"/>
      </g>
    </g>
  `;
}

function renderTraditionalDhowAtSea(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Soaring Seagulls -->
      <path d="M 20,40 Q 28,32 36,40 Q 44,32 52,40" stroke="#0369A1" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 75,25 Q 81,18 87,25 Q 93,18 99,25" stroke="#0369A1" stroke-width="1.8" stroke-linecap="round" fill="none"/>

      <!-- WOODEN DHOW (DOON) -->
      <g transform="translate(50, 45)">
        <!-- Rigging lines -->
        <line x1="90" y1="20" x2="20" y2="105" stroke="#78350F" stroke-width="1.5" opacity="0.6"/>
        <line x1="90" y1="20" x2="160" y2="105" stroke="#78350F" stroke-width="1.5" opacity="0.6"/>
        <!-- Slanted Spar Yard -->
        <line x1="25" y1="95" x2="140" y2="15" stroke="#78350F" stroke-width="4" stroke-linecap="round"/>
        <!-- White Triangular Lateen Sail -->
        <path d="M 28,92 C 60,75 105,48 138,18 C 140,65 138,98 110,105 C 75,105 45,100 28,92 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
        <path d="M 70,65 Q 98,78 118,102" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Mast -->
        <line x1="95" y1="28" x2="95" y2="110" stroke="#451A03" stroke-width="4" stroke-linecap="round"/>
        <!-- Wooden Teak Hull -->
        <path d="M 12,104 C 40,128 145,128 175,104 C 150,122 40,122 12,104 Z" fill="url(#dhowWood)" stroke="#270F03" stroke-width="2"/>
        <!-- Turquoise & White Berbera Nautical Stripe -->
        <path d="M 18,108 Q 95,119 168,108 L 167,112 Q 95,123 19,112 Z" fill="#06B6D4"/>
        <path d="M 20,112 Q 95,123 166,112 L 165,115 Q 95,126 21,115 Z" fill="#FFFFFF"/>
      </g>

      <!-- Turquoise Rolling Ocean Waves (Foreground) -->
      <path d="M 0,165 C 50,155 100,172 150,160 C 200,148 250,168 300,158 L 300,195 L 0,195 Z" fill="#0284C7" opacity="0.85"/>
      <path d="M 0,178 C 60,168 120,185 180,172 C 240,160 300,180 360,170 L 360,195 L 0,195 Z" fill="url(#coastalSea)"/>
      <path d="M 40,172 Q 65,160 90,170 M 160,175 Q 195,162 230,174" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.9"/>
    </g>
  `;
}

function renderWiseTortoise(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Sandy savanna clearing & desert succulent -->
      <ellipse cx="140" cy="180" rx="120" ry="16" fill="#451A03" opacity="0.25"/>
      <path d="M 35,175 Q 40,150 48,140 Q 55,155 60,175" stroke="#15803D" stroke-width="3" fill="#86EFAC"/>

      <!-- LEOPARD TORTOISE (Diinkii Xigmadda Lahaa) -->
      <g transform="translate(70, 60)">
        <!-- Scaly Armored Legs -->
        <rect x="25" y="80" width="16" height="24" rx="6" fill="#B45309"/>
        <rect x="95" y="80" width="16" height="24" rx="6" fill="#B45309"/>
        <!-- High-Domed Patterned Carapace -->
        <path d="M 15,85 C 10,25 45,-10 90,-10 C 135,-10 155,25 145,85 Z" fill="#D97706" stroke="#451A03" stroke-width="2.5"/>
        <!-- Geometric Star / Rosette Scutes -->
        <polygon points="80,5 105,15 100,38 75,34 68,12" fill="#FEF08A" stroke="#451A03" stroke-width="1.5"/>
        <circle cx="85" cy="22" r="4" fill="#451A03"/>
        <polygon points="45,15 70,20 72,45 42,50 30,30" fill="#FEF08A" stroke="#451A03" stroke-width="1.5"/>
        <circle cx="52" cy="32" r="4" fill="#451A03"/>
        <polygon points="75,45 102,48 115,75 85,80 65,55" fill="#FEF08A" stroke="#451A03" stroke-width="1.5"/>
        <circle cx="90" cy="62" r="4" fill="#451A03"/>
        <!-- Wrinkled Neck & Head reaching forward -->
        <path d="M 125,65 C 145,55 160,48 175,45 C 182,50 175,65 160,72 C 145,78 130,75 125,65 Z" fill="#B45309" stroke="#451A03" stroke-width="1.5"/>
        <circle cx="170" cy="50" r="10" fill="#B45309"/>
        <ellipse cx="172" cy="48" rx="2.5" ry="2.5" fill="#0F172A"/>
        <circle cx="171" cy="47" r="0.8" fill="#FFFFFF"/>
        <path d="M 178,54 L 172,57" stroke="#451A03" stroke-width="1.5"/>
      </g>
    </g>
  `;
}

function renderTraditionalAqal(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Nomadic encampment ground shadow -->
      <ellipse cx="150" cy="195" rx="140" ry="16" fill="#451A03" opacity="0.25"/>

      <!-- AQAL SOOMAALI DOME -->
      <g transform="translate(30, 25)">
        <!-- Dome Structure -->
        <path d="M 25,160 C 25,50 75,15 135,15 C 195,15 245,50 245,160 Z" fill="#B45309" stroke="#451A03" stroke-width="2.5"/>
        <!-- Woven Mat Layer Bands (Kebed & Alool) -->
        <path d="M 75,50 Q 135,38 195,50 L 190,70 Q 135,58 80,70 Z" fill="#DC2626"/>
        <!-- Chevron embroidery -->
        <path d="M 85,60 L 92,52 L 99,60 L 106,52 L 113,60 L 120,52 L 127,60 L 134,52 L 141,60 L 148,52 L 155,60 L 162,52 L 169,60 L 176,52 L 183,60" stroke="#FEF08A" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M 48,88 Q 135,70 222,88 L 216,110 Q 135,92 54,110 Z" fill="#EA580C"/>
        <!-- Structural Ropes -->
        <path d="M 40,160 Q 90,65 135,15 M 230,160 Q 180,65 135,15" stroke="#78350F" stroke-width="2.5" fill="none"/>
        <!-- Arched Doorway with Interior Warmth -->
        <path d="M 105,160 C 105,110 165,110 165,160 Z" fill="#0F172A" stroke="#78350F" stroke-width="3"/>
        <ellipse cx="135" cy="155" rx="18" ry="8" fill="#F59E0B" opacity="0.8"/>
        <!-- Rolled Door Screen -->
        <rect x="100" y="105" width="70" height="12" rx="4" fill="#D97706" stroke="#451A03" stroke-width="1.5"/>
        <!-- Milk Dhiil outside entrance -->
        <path d="M 180,162 C 175,155 178,145 185,140 L 195,140 C 202,145 205,155 200,162 Z" fill="#92400E" stroke="#451A03" stroke-width="1"/>
        <ellipse cx="190" cy="140" rx="3" ry="1.5" fill="#FEF08A"/>
      </g>
    </g>
  `;
}

function renderNightCampWithStars(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <!-- Twinkling Constellations -->
      <g fill="#FFFFFF">
        <circle cx="45" cy="30" r="1.5"/><circle cx="95" cy="55" r="2"/><circle cx="140" cy="20" r="1.5"/>
        <circle cx="210" cy="40" r="2.5"/><circle cx="280" cy="25" r="1.8"/><circle cx="340" cy="50" r="2"/>
        <circle cx="390" cy="30" r="1.5"/><circle cx="180" cy="75" r="1.8"/><circle cx="310" cy="85" r="2.2"/>
      </g>

      <!-- Glowing Crescent Moon -->
      <g transform="translate(320, 20) scale(0.65)" filter="url(#sunHaloGlow)">
        <path d="M 40,0 A 30,30 0 1 0 40,60 A 24,24 0 1 1 40,0 Z" fill="#FEF08A"/>
      </g>

      <!-- Silhouetted Acacia & Dome -->
      <path d="M 0,160 Q 120,150 240,158 T 480,155 L 480,200 L 0,200 Z" fill="#020617"/>
      <!-- Glowing Hurricane Lantern on Desert Mat -->
      <g transform="translate(160, 115) scale(0.7)" filter="url(#sunHaloGlow)">
        <ellipse cx="30" cy="45" rx="35" ry="30" fill="#FEF08A" opacity="0.6"/>
        <rect x="20" y="25" width="20" height="30" rx="4" fill="#F59E0B" stroke="#78350F" stroke-width="2"/>
        <circle cx="30" cy="40" r="6" fill="#FFFFFF"/>
        <path d="M 15,25 L 45,25 L 38,15 L 22,15 Z" fill="#451A03"/>
      </g>
    </g>
  `;
}

function renderSomaliFamilyReading(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#storyDropShadow)">
      <!-- Patterned Derin Mat on Courtyard Floor -->
      <polygon points="20,175 280,175 305,215 0,215" fill="#D97706" stroke="#78350F" stroke-width="2"/>
      <g stroke="#991B1B" stroke-width="3">
        <line x1="40" y1="180" x2="260" y2="180"/>
        <line x1="20" y1="205" x2="285" y2="205"/>
      </g>

      <!-- GRANDMOTHER AYEEYO (Center Left) in embroidered Dirac -->
      <g transform="translate(60, 60)">
        <path d="M 20,95 C 20,60 45,45 70,45 C 95,45 120,60 120,95 L 125,135 L 15,135 Z" fill="#047857"/>
        <ellipse cx="70" cy="30" rx="18" ry="22" fill="#7C2D12"/>
        <!-- Soft Shash Headwrap -->
        <path d="M 50,30 C 50,8 90,8 90,30 C 90,45 85,55 85,60 L 55,60 C 55,55 50,45 50,30 Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
        <!-- Kind Smiling Face -->
        <circle cx="64" cy="28" r="2" fill="#1E293B"/>
        <circle cx="76" cy="28" r="2" fill="#1E293B"/>
        <path d="M 66,38 Q 70,44 74,38" stroke="#451A03" stroke-width="2" fill="none"/>
      </g>

      <!-- TWO CHILDREN (Listening intently to story) -->
      <g transform="translate(160, 85) scale(0.85)">
        <!-- Girl Caasha in bright dress -->
        <path d="M 15,65 C 15,40 35,30 55,30 C 75,30 95,40 95,65 L 100,105 L 10,105 Z" fill="#F97316"/>
        <circle cx="55" cy="18" r="16" fill="#7C2D12"/>
        <path d="M 40,16 C 40,0 70,0 70,16 Z" fill="#FDE047"/>
        <circle cx="50" cy="16" r="2" fill="#1E293B"/><circle cx="60" cy="16" r="2" fill="#1E293B"/>
        <path d="M 52,24 Q 55,28 58,24" stroke="#451A03" stroke-width="1.5" fill="none"/>
      </g>

      <!-- OPEN BOOK BEING READ -->
      <g transform="translate(115, 150)">
        <polygon points="0,25 35,32 70,25 70,5 35,12 0,5" fill="#065F46" stroke="#064E3B" stroke-width="1.5"/>
        <polygon points="2,23 35,30 35,10 2,4" fill="#FFFBEB"/>
        <polygon points="68,23 35,30 35,10 68,4" fill="#FFFFFF"/>
        <line x1="8" y1="12" x2="28" y2="12" stroke="#94A3B8" stroke-width="1.5"/>
        <line x1="8" y1="18" x2="26" y2="18" stroke="#94A3B8" stroke-width="1.5"/>
        <line x1="42" y1="12" x2="62" y2="12" stroke="#94A3B8" stroke-width="1.5"/>
        <line x1="42" y1="18" x2="60" y2="18" stroke="#94A3B8" stroke-width="1.5"/>
      </g>
    </g>
  `;
}

// ----------------------------------------------------------------------------
// 30 Complete Story Recipes with High-Detail Visual Storytelling
// ----------------------------------------------------------------------------
const STORIES = [
  // LEVEL 1: BILOWGA (Early Readers)
  {
    id: 'geelkii-yaraa',
    title: 'Geelkii yaraa ee Dalmar',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [210, 80],
    renderForeground: (s) => renderCamelsMotherAndCalf(220, 160, 1.25),
    renderBackdrop: (s) => renderSavannaAcacia(600, 170, 1.1) + renderSavannaAcacia(70, 190, 0.85)
  },
  {
    id: 'shimbirtii-iyo-roobka',
    title: 'Shimbirtii iyo roobka guga',
    skyType: 'skyDawn',
    terrainType: 'greenPasture',
    hasSun: false,
    renderForeground: (s) => `
      <g transform="translate(240, 120) scale(1.3)" filter="url(#storyDropShadow)">
        <path d="M 40,160 Q 120,110 200,90" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
        <!-- Acacia foliage and golden blossoms -->
        <ellipse cx="140" cy="80" rx="45" ry="16" fill="#15803D"/>
        <circle cx="120" cy="75" r="5" fill="#FDE047"/><circle cx="150" cy="72" r="5" fill="#FDE047"/>
        <!-- Golden Weaver Bird singing -->
        <ellipse cx="130" cy="62" rx="22" ry="16" fill="#FACC15"/>
        <path d="M 115,62 Q 130,45 145,62" fill="#D97706"/>
        <circle cx="145" cy="52" r="11" fill="#FACC15"/>
        <polygon points="155,50 168,54 155,58" fill="#B45309"/>
        <circle cx="147" cy="50" r="2" fill="#0F172A"/><circle cx="146" cy="49" r="0.8" fill="#FFFFFF"/>
        <!-- Musical notes in the air -->
        <g fill="#0284C7" font-size="16" font-family="sans-serif" font-weight="bold">
          <text x="175" y="45">♪</text>
          <text x="190" y="32">♫</text>
        </g>
      </g>
      <!-- Gentle Spring Raindrops falling on green hills -->
      <g stroke="#38BDF8" stroke-width="2" stroke-linecap="round" opacity="0.75">
        <line x1="80" y1="90" x2="70" y2="120"/><line x1="160" y1="70" x2="150" y2="100"/>
        <line x1="320" y1="80" x2="310" y2="110"/><line x1="520" y1="60" x2="510" y2="90"/>
        <line x1="680" y1="75" x2="670" y2="105"/><line x1="780" y1="95" x2="770" y2="125"/>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 0.95)
  },
  {
    id: 'bisaddii-baroor',
    title: 'Bisaddii baroor ee geesiga ahayd',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [700, 75],
    renderForeground: (s) => renderPlayfulCatAndButterfly(280, 170, 1.2),
    renderBackdrop: (s) => renderSavannaAcacia(80, 180, 0.9)
  },
  {
    id: 'riyo-yar-oo-geesi-ah',
    title: 'Riyo-yar oo geesi ah',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => renderBraveGoat(270, 160, 1.2),
    renderBackdrop: (s) => renderSavannaAcacia(620, 170, 1.0)
  },
  {
    id: 'qorraxda-subaxdii',
    title: 'Qorraxda subaxdii iyo iftiinka',
    skyType: 'skySunset',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [430, 140],
    renderForeground: (s) => renderTraditionalAqal(280, 165, 1.2),
    renderBackdrop: (s) => renderSavannaAcacia(90, 170, 1.1) + renderSavannaAcacia(640, 175, 1.05)
  },
  {
    id: 'buuggii-cagaarnaa',
    title: 'Buuggii cagaarnaa ee xigmadda',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [720, 80],
    renderForeground: (s) => `
      <g transform="translate(260, 150) scale(1.3)" filter="url(#storyDropShadow)">
        <!-- Rich Wooden Reading Table -->
        <rect x="0" y="100" width="280" height="25" rx="4" fill="#78350F" stroke="#451A03" stroke-width="2"/>
        <!-- Illuminated Green Hardcover Book Open with Gold Glow -->
        <ellipse cx="140" cy="95" rx="75" ry="30" fill="#FEF08A" opacity="0.45" filter="url(#sunHaloGlow)"/>
        <g transform="translate(45, 30)">
          <!-- Cover -->
          <polygon points="10,65 95,78 180,65 180,15 95,28 10,15" fill="#064E3B" stroke="#022C22" stroke-width="2"/>
          <!-- Pages -->
          <polygon points="15,62 95,74 95,24 15,12" fill="#FAF7F2"/>
          <polygon points="175,62 95,74 95,24 175,12" fill="#FFFFFF"/>
          <!-- Gold Inscription Bookmark -->
          <path d="M 95,25 L 95,85" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <polygon points="90,82 95,92 100,82" fill="#F59E0B"/>
          <!-- Glowing text wisdom runes -->
          <line x1="28" y1="28" x2="80" y2="28" stroke="#047857" stroke-width="2"/>
          <line x1="28" y1="38" x2="75" y2="38" stroke="#047857" stroke-width="2"/>
          <line x1="28" y1="48" x2="70" y2="48" stroke="#047857" stroke-width="2"/>
          <line x1="110" y1="28" x2="162" y2="28" stroke="#047857" stroke-width="2"/>
          <line x1="110" y1="38" x2="158" y2="38" stroke="#047857" stroke-width="2"/>
          <line x1="110" y1="48" x2="150" y2="48" stroke="#047857" stroke-width="2"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(70, 180, 0.95)
  },
  {
    id: 'xiddigaha-habeenkii',
    title: 'Xiddigaha habeenkii iyo dayaxa',
    skyType: 'skyNight',
    terrainType: 'savannaDune',
    hasSun: false,
    renderForeground: (s) => renderNightCampWithStars(200, 130, 1.25),
    renderBackdrop: (s) => ''
  },
  {
    id: 'kalluunkii-dahabiga',
    title: 'Kalluunkii dahabiga ee badda',
    skyType: 'skyMidday',
    terrainType: 'coastalSea',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => `
      <g transform="translate(250, 130) scale(1.3)" filter="url(#storyDropShadow)">
        <!-- Colorful Coral Reef Branches -->
        <path d="M 40,180 Q 55,120 70,105 Q 85,125 95,180" stroke="#F43F5E" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M 230,180 Q 215,125 195,115 Q 180,135 170,180" stroke="#8B5CF6" stroke-width="10" stroke-linecap="round" fill="none"/>
        <!-- GLOWING GOLDEN FISH -->
        <g transform="translate(100, 50)">
          <ellipse cx="65" cy="50" rx="46" ry="24" fill="url(#calfCoat)"/>
          <polygon points="15,50 -10,25 -5,75" fill="#EA580C"/>
          <polygon points="60,26 80,10 85,28" fill="#F59E0B"/>
          <polygon points="60,74 80,90 85,72" fill="#F59E0B"/>
          <circle cx="92" cy="45" r="4.5" fill="#0F172A"/>
          <circle cx="91" cy="43" r="1.5" fill="#FFFFFF"/>
          <!-- Shimmering scales -->
          <circle cx="50" cy="45" r="4" fill="#FEF08A" opacity="0.7"/>
          <circle cx="65" cy="42" r="4" fill="#FEF08A" opacity="0.7"/>
          <circle cx="60" cy="55" r="4" fill="#FEF08A" opacity="0.7"/>
        </g>
        <!-- Rising Air Bubbles -->
        <circle cx="215" cy="70" r="4.5" fill="#E0F2FE" opacity="0.8"/>
        <circle cx="225" cy="45" r="3.5" fill="#E0F2FE" opacity="0.8"/>
        <circle cx="210" cy="25" r="5" fill="#E0F2FE" opacity="0.8"/>
      </g>
    `,
    renderBackdrop: (s) => ''
  },
  {
    id: 'ubaxii-beerteenna',
    title: 'Ubaxii beerteenna ee carfayay',
    skyType: 'skyMidday',
    terrainType: 'greenPasture',
    hasSun: true,
    sunPos: [700, 75],
    renderForeground: (s) => `
      <g transform="translate(240, 150) scale(1.3)" filter="url(#storyDropShadow)">
        <!-- Rich Garden Flower Beds -->
        <g transform="translate(20, 20)">
          <!-- Flower 1: Desert Rose (Red) -->
          <circle cx="50" cy="80" r="18" fill="#EF4444"/>
          <circle cx="50" cy="80" r="7" fill="#FEF08A"/>
          <path d="M 50,98 L 50,150" stroke="#15803D" stroke-width="4"/>
          <!-- Flower 2: Marigold (Gold) -->
          <circle cx="110" cy="65" r="22" fill="#F59E0B"/>
          <circle cx="110" cy="65" r="8" fill="#78350F"/>
          <path d="M 110,87 L 110,150" stroke="#15803D" stroke-width="4.5"/>
          <!-- Flower 3: Hibiscus (Pink) -->
          <circle cx="170" cy="75" r="20" fill="#EC4899"/>
          <circle cx="170" cy="75" r="7" fill="#FEF08A"/>
          <path d="M 170,95 L 170,150" stroke="#15803D" stroke-width="4"/>
          <!-- Green Leaves -->
          <ellipse cx="75" cy="115" rx="14" ry="7" fill="#22C55E"/>
          <ellipse cx="145" cy="120" rx="14" ry="7" fill="#22C55E"/>
        </g>
        <!-- Fluttering Butterflies -->
        <g transform="translate(80, 20) scale(0.8)">
          <polygon points="10,12 25,0 20,18" fill="#A855F7"/><polygon points="8,12 -7,0 -2,18" fill="#A855F7"/>
        </g>
        <g transform="translate(200, 30) scale(0.8)">
          <polygon points="10,12 25,0 20,18" fill="#06B6D4"/><polygon points="8,12 -7,0 -2,18" fill="#06B6D4"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(620, 180, 1.0)
  },
  {
    id: 'salaanta-wanaagsan',
    title: 'Salaanta wanaagsan iyo asluubta',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [430, 80],
    renderForeground: (s) => renderSomaliFamilyReading(250, 150, 1.2),
    renderBackdrop: (s) => renderSavannaAcacia(70, 175, 1.05) + renderSavannaAcacia(640, 180, 1.0)
  },

  // LEVEL 2: AKHRISTE YAR (Intermediate Readers)
  {
    id: 'qoyska-caasha',
    title: 'Qoyska Caasha ee farxadda leh',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [720, 80],
    renderForeground: (s) => renderSomaliFamilyReading(240, 150, 1.25),
    renderBackdrop: (s) => renderTraditionalAqal(60, 170, 0.85)
  },
  {
    id: 'maalintii-koowaad-dugsiga',
    title: 'Maalintii koowaad ee dugsiga',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => `
      <g transform="translate(240, 130) scale(1.2)" filter="url(#storyDropShadow)">
        <!-- Schoolhouse Courtyard Arch & Somali Flag -->
        <rect x="0" y="40" width="160" height="150" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
        <path d="M 40,190 C 40,110 120,110 120,190 Z" fill="#0284C7"/>
        <!-- Flagpole & Sky-blue Flag with White 5-pointed Star -->
        <line x1="20" y1="20" x2="20" y2="190" stroke="#78350F" stroke-width="4"/>
        <rect x="22" y="22" width="45" height="28" fill="#4189DD"/>
        <polygon points="44,28 47,36 55,36 49,41 51,49 44,44 37,49 39,41 33,36 41,36" fill="#FFFFFF"/>
        <!-- Smiling Student with Schoolbook & Slate -->
        <g transform="translate(180, 50)">
          <!-- Child Torso in School uniform -->
          <rect x="30" y="60" width="35" height="50" rx="4" fill="#38BDF8"/>
          <circle cx="47" cy="38" r="16" fill="#7C2D12"/>
          <circle cx="43" cy="36" r="2" fill="#0F172A"/><circle cx="51" cy="36" r="2" fill="#0F172A"/>
          <path d="M 44,44 Q 47,48 50,44" stroke="#451A03" stroke-width="1.5" fill="none"/>
          <!-- Holding Book proudly -->
          <rect x="18" y="70" width="22" height="30" rx="2" fill="#15803D"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(630, 180, 0.95)
  },
  {
    id: 'laba-saaxiib-iyo-geedka',
    title: 'Laba saaxiib iyo geedka weyn',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [430, 75],
    renderForeground: (s) => `
      <g transform="translate(260, 140) scale(1.2)" filter="url(#storyDropShadow)">
        ${renderSavannaAcacia(0, 0, 1.35)}
        <!-- Two Young Friends sitting under shade enjoying cool water -->
        <g transform="translate(30, 100)">
          <!-- Friend 1 -->
          <circle cx="25" cy="35" r="12" fill="#7C2D12"/>
          <path d="M 12,50 C 12,42 38,42 38,50 L 40,75 L 10,75 Z" fill="#F97316"/>
          <!-- Friend 2 -->
          <circle cx="55" cy="35" r="12" fill="#7C2D12"/>
          <path d="M 42,50 C 42,42 68,42 68,50 L 70,75 L 40,75 Z" fill="#0284C7"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 0.85)
  },
  {
    id: 'suuqa-khudaarta',
    title: 'Suuqa khudaarta ee magaalada',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [720, 75],
    renderForeground: (s) => `
      <g transform="translate(240, 130) scale(1.25)" filter="url(#storyDropShadow)">
        <!-- Market Stall Striped Canopy -->
        <polygon points="10,40 270,40 250,75 30,75" fill="#EF4444"/>
        <path d="M 30,75 L 50,40 L 70,75 L 90,40 L 110,75 L 130,40 L 150,75 L 170,40 L 190,75 L 210,40 L 230,75 L 250,40" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
        <!-- Stall Counter -->
        <rect x="25" y="110" width="230" height="70" fill="#92400E" stroke="#451A03" stroke-width="2"/>
        <!-- Fruit Baskets -->
        <g transform="translate(45, 95)">
          <!-- Banana crate -->
          <ellipse cx="30" cy="15" rx="20" ry="10" fill="#CA8A04"/>
          <path d="M 18,12 Q 30,22 42,12" stroke="#FEF08A" stroke-width="5" stroke-linecap="round"/>
          <!-- Mango basket -->
          <ellipse cx="85" cy="15" rx="20" ry="10" fill="#EA580C"/>
          <circle cx="80" cy="12" r="7" fill="#F59E0B"/><circle cx="90" cy="14" r="6" fill="#EF4444"/>
          <!-- Watermelon / Pomegranate -->
          <ellipse cx="140" cy="15" rx="20" ry="10" fill="#15803D"/>
          <circle cx="140" cy="10" r="10" fill="#22C55E"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(70, 175, 0.9)
  },
  {
    id: 'diinkii-xigmadda-lahaa',
    title: 'Diinkii xigmadda lahaa ee kaynta',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => renderWiseTortoise(270, 155, 1.25),
    renderBackdrop: (s) => renderSavannaAcacia(620, 175, 1.0)
  },
  {
    id: 'doonta-xeebta-berbera',
    title: 'Doonta xeebta Berbera ee qadiimiga ah',
    skyType: 'skyMidday',
    terrainType: 'coastalSea',
    hasSun: true,
    sunPos: [720, 70],
    renderForeground: (s) => renderTraditionalDhowAtSea(240, 140, 1.25),
    renderBackdrop: (s) => ''
  },
  {
    id: 'roobkii-la-sugayay',
    title: 'Roobkii la sugayay ee barwaaqada',
    skyType: 'skySunset',
    terrainType: 'greenPasture',
    hasSun: false,
    renderForeground: (s) => renderBraveGoat(260, 160, 1.2),
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 1.0)
  },
  {
    id: 'sheekadii-ayeeyo-xaliimo',
    title: 'Sheekadii Ayeeyo Xaliimo',
    skyType: 'skyNight',
    terrainType: 'savannaDune',
    hasSun: false,
    renderForeground: (s) => renderSomaliFamilyReading(240, 150, 1.25),
    renderBackdrop: (s) => renderNightCampWithStars(100, 120, 1.0)
  },
  {
    id: 'safarkii-buurta-daallo',
    title: 'Safarkii buurta Daallo',
    skyType: 'skyDawn',
    terrainType: 'greenPasture',
    hasSun: true,
    sunPos: [430, 80],
    renderForeground: (s) => `
      <g transform="translate(240, 110) scale(1.2)" filter="url(#storyDropShadow)">
        <!-- Majestic Escarpment Peaks -->
        <polygon points="20,180 120,60 220,180" fill="#6B21A8" opacity="0.8"/>
        <polygon points="140,180 230,40 320,180" fill="#7E22CE"/>
        <polygon points="140,180 230,40 180,180" fill="#581C87"/>
        <!-- Mist Ribbon -->
        <path d="M 0,140 Q 180,120 360,140" stroke="#FFFFFF" stroke-width="12" opacity="0.5" stroke-linecap="round"/>
        <!-- Highland Pine / Frankincense Tree -->
        <g transform="translate(80, 100)">
          <line x1="20" y1="30" x2="20" y2="70" stroke="#451A03" stroke-width="3"/>
          <polygon points="20,10 5,35 35,35" fill="#14532D"/>
          <polygon points="20,25 2,50 38,50" fill="#15803D"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => ''
  },
  {
    id: 'faraska-booddo',
    title: 'Faraska Booddo ee orodka badan',
    skyType: 'skySunset',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [720, 80],
    renderForeground: (s) => `
      <g transform="translate(250, 140) scale(1.25)" filter="url(#storyDropShadow)">
        <!-- Ground shadow -->
        <ellipse cx="150" cy="180" rx="130" ry="14" fill="#451A03" opacity="0.25"/>
        <!-- GALLOPING SOMALI CHESTNUT STALLION -->
        <g transform="translate(50, 30)">
          <!-- Legs in Full Gallop Extended -->
          <line x1="30" y1="85" x2="-5" y2="125" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
          <line x1="50" y1="85" x2="20" y2="135" stroke="#92400E" stroke-width="7" stroke-linecap="round"/>
          <line x1="120" y1="80" x2="160" y2="125" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
          <line x1="135" y1="80" x2="185" y2="120" stroke="#92400E" stroke-width="7" stroke-linecap="round"/>
          <!-- Sleek Torso -->
          <ellipse cx="90" cy="75" rx="55" ry="28" fill="#B45309"/>
          <!-- Arched Powerful Neck & Head -->
          <path d="M 130,70 C 150,55 165,25 155,5 L 142,8 C 138,28 130,50 115,65 Z" fill="#B45309"/>
          <ellipse cx="160" cy="10" rx="16" ry="10" fill="#B45309"/>
          <polygon points="152,0 156,-6 160,2" fill="#78350F"/>
          <circle cx="162" cy="8" r="3" fill="#1E293B"/><circle cx="161" cy="7" r="1" fill="#FFFFFF"/>
          <!-- Flying Black Mane & Tail -->
          <path d="M 148,8 Q 130,25 125,45 Q 120,60 115,70" stroke="#0F172A" stroke-width="8" stroke-linecap="round" fill="none"/>
          <path d="M 38,72 Q 10,85 -10,80 Q -25,90 -20,105" stroke="#0F172A" stroke-width="8" stroke-linecap="round" fill="none"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(80, 175, 0.95)
  },

  // LEVEL 3: AKHRISTE HORUMARSAN (Advanced Readers)
  {
    id: 'ceelkii-la-wadaagay',
    title: 'Ceelkii la wadaagay ee tuulada',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => `
      <g transform="translate(250, 130) scale(1.2)" filter="url(#storyDropShadow)">
        <!-- Traditional Stone Water Well -->
        <rect x="70" y="80" width="14" height="90" fill="#78350F"/>
        <rect x="180" y="80" width="14" height="90" fill="#78350F"/>
        <rect x="60" y="75" width="145" height="12" fill="#92400E"/>
        <circle cx="132" cy="98" r="12" fill="#B45309"/>
        <!-- Stone Well Cylinder -->
        <path d="M 65,130 L 65,190 C 65,210 200,210 200,190 L 200,130 Z" fill="#A8A29E" stroke="#57534E" stroke-width="2"/>
        <ellipse cx="132" cy="130" rx="68" ry="18" fill="#38BDF8"/>
        <!-- Bucket with Fresh Water -->
        <rect x="122" y="105" width="20" height="20" rx="3" fill="#B45309"/>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 1.0)
  },
  {
    id: 'runta-iyo-amaanada',
    title: 'Runta iyo amaanada',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [430, 80],
    renderForeground: (s) => renderBraveGoat(270, 160, 1.2),
    renderBackdrop: (s) => renderSavannaAcacia(80, 175, 1.0) + renderSavannaAcacia(640, 180, 0.95)
  },
  {
    id: 'ilaaliyaha-dhirta-miyiga',
    title: 'Ilaaliyaha dhirta miyiga',
    skyType: 'skyMidday',
    terrainType: 'greenPasture',
    hasSun: true,
    sunPos: [700, 75],
    renderForeground: (s) => `
      <g transform="translate(250, 140) scale(1.25)" filter="url(#storyDropShadow)">
        <!-- Protective Thorn Fence around newly planted acacia sapling -->
        <path d="M 40,180 Q 80,165 120,180" stroke="#78350F" stroke-width="4" fill="none"/>
        <path d="M 50,170 Q 80,155 110,170" stroke="#78350F" stroke-width="4" fill="none"/>
        <!-- Young Thriving Tree -->
        <line x1="80" y1="120" x2="80" y2="175" stroke="#451A03" stroke-width="4"/>
        <ellipse cx="80" cy="115" rx="35" ry="18" fill="#16A34A"/>
        <ellipse cx="80" cy="110" rx="25" ry="12" fill="#4ADE80" opacity="0.4"/>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 1.1)
  },
  {
    id: 'xiddig-iyaha-badmaaxa',
    title: 'Xiddig-iyaha badmaaxa',
    skyType: 'skyNight',
    terrainType: 'coastalSea',
    hasSun: false,
    renderForeground: (s) => `
      <g transform="translate(240, 130) scale(1.25)" filter="url(#storyDropShadow)">
        ${renderTraditionalDhowAtSea(0, 0, 1.0)}
        <!-- Bright Celestial Star Guiding the Navigator -->
        <g transform="translate(180, -40)" filter="url(#sunHaloGlow)">
          <polygon points="20,0 23,12 35,15 25,23 28,35 18,27 8,35 11,23 1,15 13,12" fill="#FEF08A"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => ''
  },
  {
    id: 'libaaxii-iyo-jiirkii-yaraa',
    title: 'Libaaxii iyo jiirkii yaraa',
    skyType: 'skySunset',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [720, 80],
    renderForeground: (s) => renderLionAndMouse(250, 140, 1.25),
    renderBackdrop: (s) => renderSavannaAcacia(70, 175, 1.0)
  },
  {
    id: 'tartankii-akhriska-dugsiga',
    title: 'Tartankii akhriska dugsiga',
    skyType: 'skyMidday',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => `
      <g transform="translate(250, 130) scale(1.25)" filter="url(#storyDropShadow)">
        <!-- Stage Podium with Golden Trophy & Open Book -->
        <rect x="40" y="110" width="180" height="70" fill="#0284C7" stroke="#0369A1" stroke-width="2"/>
        <!-- Golden Reading Trophy Cup -->
        <g transform="translate(115, 55)">
          <path d="M 5,10 C 5,35 25,35 25,10 Z" fill="#FACC15" stroke="#B45309" stroke-width="1.5"/>
          <rect x="13" y="35" width="4" height="15" fill="#B45309"/>
          <rect x="5" y="50" width="20" height="6" fill="#78350F"/>
          <path d="M 5,15 C -5,15 -5,25 5,28" stroke="#CA8A04" stroke-width="2" fill="none"/>
          <path d="M 25,15 C 35,15 35,25 25,28" stroke="#CA8A04" stroke-width="2" fill="none"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 0.95)
  },
  {
    id: 'dhismaha-aqalka-soomaaliga',
    title: 'Dhismaha aqalka Soomaaliga',
    skyType: 'skyDawn',
    terrainType: 'savannaDune',
    hasSun: true,
    sunPos: [700, 80],
    renderForeground: (s) => renderTraditionalAqal(250, 150, 1.25),
    renderBackdrop: (s) => renderSavannaAcacia(80, 175, 1.0)
  },
  {
    id: 'maroodigii-iyo-webiga-shabeelle',
    title: 'Maroodigii iyo webiga Shabeelle',
    skyType: 'skyMidday',
    terrainType: 'greenPasture',
    hasSun: true,
    sunPos: [150, 70],
    renderForeground: (s) => renderElephantByRiver(250, 140, 1.25),
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 1.0)
  },
  {
    id: 'nabadda-tuulada-barwaaqo',
    title: 'Nabadda tuulada Barwaaqo',
    skyType: 'skyDawn',
    terrainType: 'greenPasture',
    hasSun: true,
    sunPos: [430, 80],
    renderForeground: (s) => `
      <g transform="translate(240, 120) scale(1.2)" filter="url(#storyDropShadow)">
        ${renderTraditionalAqal(0, 30, 1.0)}
        <!-- White Peace Dove in Flight with Olive Twig -->
        <g transform="translate(180, 10)">
          <path d="M 25,25 Q 10,5 35,0 Q 30,18 45,22 Q 55,5 75,5 Q 60,25 50,28 Q 55,38 45,35 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
          <circle cx="50" cy="24" r="1.5" fill="#0F172A"/>
          <path d="M 52,24 L 62,26" stroke="#15803D" stroke-width="2" stroke-linecap="round"/>
        </g>
      </g>
    `,
    renderBackdrop: (s) => renderSavannaAcacia(640, 180, 1.0)
  },
  {
    id: 'rijada-habeenka-curashada',
    title: 'Rijada habeenka curashada',
    skyType: 'skyNight',
    terrainType: 'savannaDune',
    hasSun: false,
    renderForeground: (s) => renderNightCampWithStars(220, 130, 1.25),
    renderBackdrop: (s) => ''
  }
];

// ----------------------------------------------------------------------------
// Generator Execution
// ----------------------------------------------------------------------------
let generatedCount = 0;

for (const story of STORIES) {
  for (let sceneIdx = 0; sceneIdx <= 3; sceneIdx++) {
    const filename = sceneIdx === 0 ? `${story.id}-cover.svg` : `${story.id}-scene-${sceneIdx}.svg`;
    const targetFile = path.join(OUT_DIR, filename);

    // Scene progression variations
    const sunX = story.hasSun ? story.sunPos[0] + (sceneIdx * 50 - 75) : 0;
    const sunY = story.hasSun ? story.sunPos[1] : 0;

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 480" width="100%" height="100%">
  ${getCommonDefs(story.id)}

  <!-- Sky Layer -->
  <rect width="860" height="480" fill="url(#${story.skyType})"/>

  ${
    story.hasSun
      ? `<!-- Radiant Sun -->
  <circle cx="${sunX}" cy="${sunY}" r="70" fill="url(#sunDisk)" filter="url(#sunHaloGlow)"/>
  <circle cx="${sunX}" cy="${sunY}" r="32" fill="#FFFFFF"/>`
      : ''
  }

  <!-- Distant Savanna Ridge / Horizon -->
  <path d="M 0,260 Q 215,${230 + (sceneIdx * 8)} 430,250 T 860,240 L 860,480 L 0,480 Z" fill="#CBD5E1" opacity="0.35"/>

  <!-- Midground Hills / Rolling Dunes -->
  <path d="M 0,310 Q 280,${280 - (sceneIdx * 6)} 560,305 T 860,290 L 860,480 L 0,480 Z" fill="url(#${story.terrainType})"/>

  <!-- Background Environmental Elements -->
  ${story.renderBackdrop ? story.renderBackdrop(sceneIdx) : ''}

  <!-- Primary Story Subject & Action -->
  ${story.renderForeground(sceneIdx)}
</svg>
`;

    fs.writeFileSync(targetFile, svgContent.trim(), 'utf-8');
    generatedCount++;
  }
}

console.log(`[Folio Somali Kids] Generated ${generatedCount} professional story covers & scenes in ${OUT_DIR}`);

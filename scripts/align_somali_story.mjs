#!/usr/bin/env node
/**
 * CLI Forced-Alignment Validator & Installer for Folio Somali Children's Stories
 *
 * Usage:
 *   1. Validate and install a real recording + reviewed alignment JSON (or WhisperX/Aeneas output):
 *      node scripts/align_somali_story.mjs --story geelkii-yaraa --lang so --audio ./my-recording.wav --alignment ./my-alignment.json
 *
 *   2. Export a blank alignment template for a story (to populate via MFA / WhisperX / Praat):
 *      node scripts/align_somali_story.mjs --story geelkii-yaraa --lang so --export-template ./geelkii-yaraa-template.json
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function getArg(flag, fallback = null) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : fallback;
}

const storyId = getArg('--story', 'geelkii-yaraa');
const lang = getArg('--lang', 'so');
const audioPath = getArg('--audio');
const alignmentPath = getArg('--alignment');
const exportTemplatePath = getArg('--export-template');

const GEELKII_SENTENCES = [
  'Subax wanaagsan oo qorraxdu diirran tahay, geel yar oo la yiraahdo Dalmar ayaa ku toosay miyiga.',
  'Dalmar wuxuu lahaa dhogor jilicsan oo bunni dahabi ah iyo indho waaweyn oo aad ula yaaban adduunka.',
  'Hooyadiis, oo ahayd hal weyn oo xasilloon, ayaa ku tiri: "Maanta waxaan u soconnaa ceelka biyaha macaan."',
  'Dalmar aad ayuu u farxay, lugihiisa dhaadheer ayuuna ku boodbooday ciidda cas.',
  'Jidka dhexdiisa, wuxuu ku arkay shimbir yar oo ku heesaysa geedka quraca korkiisa.',
  '"Nabad, shimbir yahay!" ayuu yiri geelkii yaraa. "Ma taqaannaa halka uu ku yaallo ceelka biyaha?"',
  'Shimbirtii waxay u tilmaamtay dhinaca buurta cagaaran, halkaas oo neecaw qabow ka imaanaysay.',
  'Markii uu Dalmar daalay, hooyadiis ayaa uga sheekaysay sida geelu ugu adkaysto safarka dheer.',
  'Ugu dambayntii, waxay gaareen ceelkii, Dalmarna wuxuu cabbay biyo qabow oo nadiif ah.',
  'Fiidkii markii xiddiguhu soo baxeen, geelkii yaraa wuxuu ku seexday hooyadiis agteeda isagoo dhoolla-caddaynaya.'
];

if (exportTemplatePath) {
  const words = [];
  GEELKII_SENTENCES.forEach((sentence, sIdx) => {
    sentence
      .trim()
      .split(/\s+/)
      .forEach((token, tIdx) => {
        words.push({
          wordId: `s${sIdx + 1}-w${tIdx}`,
          sentenceIndex: sIdx,
          tokenIndexInSentence: tIdx,
          text: token,
          startTime: null,
          endTime: null
        });
      });
  });

  const template = {
    _comment:
      'Populate startTime and endTime (in seconds) from forced alignment (MFA / WhisperX / Aeneas) against the real Somali audio recording, then set humanVerified: true after native speaker verification.',
    storyId,
    language: lang,
    audioFilename: `${storyId}-${lang}.wav`,
    mimeType: 'audio/wav',
    durationSeconds: 0,
    narratorName: '',
    speechProvider: 'Fluent Somali Studio Narrator',
    pronunciationEvaluated: false,
    alignmentMethod: 'Forced Alignment (MFA / WhisperX) + Human Verification',
    humanVerified: false,
    verifiedBy: '',
    verifiedAt: new Date().toISOString().slice(0, 10),
    licenceName: 'CC BY-NC-SA 4.0',
    permissionStatus: 'Pending verification',
    words
  };

  fs.writeFileSync(path.resolve(exportTemplatePath), JSON.stringify(template, null, 2), 'utf-8');
  console.log(`[Folio Alignment CLI] Exported unpopulated alignment template to ${exportTemplatePath}`);
  process.exit(0);
}

if (!audioPath || !alignmentPath) {
  console.log(`
Folio Somali Story Forced-Alignment Validator & Installer
---------------------------------------------------------
Usage:
  node scripts/align_somali_story.mjs --story geelkii-yaraa --lang so --audio <path/to/audio.wav> --alignment <path/to/alignment.json>
  node scripts/align_somali_story.mjs --story geelkii-yaraa --lang so --export-template ./template.json
`);
  process.exit(0);
}

const resolvedAudio = path.resolve(audioPath);
const resolvedAlign = path.resolve(alignmentPath);

if (!fs.existsSync(resolvedAudio)) {
  console.error(`[ERROR] Audio file not found: ${resolvedAudio}`);
  process.exit(1);
}
if (!fs.existsSync(resolvedAlign)) {
  console.error(`[ERROR] Alignment JSON file not found: ${resolvedAlign}`);
  process.exit(1);
}

const rawAlignment = JSON.parse(fs.readFileSync(resolvedAlign, 'utf-8'));
if (!Array.isArray(rawAlignment.words) || rawAlignment.words.length === 0) {
  console.error('[ERROR] Alignment JSON must contain a non-empty "words" array with measured startTime/endTime.');
  process.exit(1);
}

let prevStart = 0;
for (let i = 0; i < rawAlignment.words.length; i++) {
  const w = rawAlignment.words[i];
  if (
    typeof w.startTime !== 'number' ||
    typeof w.endTime !== 'number' ||
    !Number.isFinite(w.startTime) ||
    !Number.isFinite(w.endTime) ||
    w.startTime < 0 ||
    w.endTime <= w.startTime
  ) {
    console.error(`[ERROR] Invalid word timestamp at index ${i} (${JSON.stringify(w)}).`);
    process.exit(1);
  }
  if (w.startTime + 0.005 < prevStart) {
    console.error(`[ERROR] Non-monotonic timestamp at index ${i}: ${w.startTime} < ${prevStart}`);
    process.exit(1);
  }
  prevStart = w.startTime;
}

const targetDir = path.resolve(process.cwd(), 'server', 'storage', 'audio');
fs.mkdirSync(targetDir, { recursive: true });

const ext = path.extname(resolvedAudio).toLowerCase() || '.wav';
const targetAudioPath = path.join(targetDir, `${storyId}-${lang}${ext}`);
const targetAlignPath = path.join(targetDir, `${storyId}-${lang}.alignment.json`);

fs.copyFileSync(resolvedAudio, targetAudioPath);
fs.writeFileSync(targetAlignPath, JSON.stringify(rawAlignment, null, 2), 'utf-8');

console.log(`[SUCCESS] Installed audio asset -> ${targetAudioPath}`);
console.log(`[SUCCESS] Installed verified alignment (${rawAlignment.words.length} words) -> ${targetAlignPath}`);

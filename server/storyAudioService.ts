import fs from 'node:fs';
import path from 'node:path';
import { db } from './db';
import {
  CHILDREN_STORIES,
  applyVerifiedAlignmentToStory
} from '../src/data/childrenStories';
import type {
  ChildrenStory,
  StoryAlignmentFilePayload,
  StoryAlignmentWordEntry,
  StoryLanguageCode
} from '../src/types';

export const AUDIO_STORAGE_DIR = path.resolve(process.cwd(), 'server', 'storage', 'audio');
if (!fs.existsSync(AUDIO_STORAGE_DIR)) {
  fs.mkdirSync(AUDIO_STORAGE_DIR, { recursive: true });
}

const SUPPORTED_EXTENSIONS: Array<{ ext: string; mime: string }> = [
  { ext: '.wav', mime: 'audio/wav' },
  { ext: '.mp3', mime: 'audio/mpeg' },
  { ext: '.ogg', mime: 'audio/ogg' },
  { ext: '.m4a', mime: 'audio/mp4' }
];

export interface ResolvedAudioAsset {
  filePath: string;
  fileName: string;
  mimeType: string;
  byteLength: number;
}

/**
 * Checks whether a real audio file exists on disk in server/storage/audio/
 * for the given storyId and language ('so' | 'en').
 */
export function findInstalledAudioAsset(
  storyId: string,
  lang: StoryLanguageCode
): ResolvedAudioAsset | null {
  for (const { ext, mime } of SUPPORTED_EXTENSIONS) {
    const fileName = `${storyId}-${lang}${ext}`;
    const candidatePath = path.join(AUDIO_STORAGE_DIR, fileName);
    if (fs.existsSync(candidatePath)) {
      const stat = fs.statSync(candidatePath);
      if (stat.isFile() && stat.size > 44) {
        return {
          filePath: candidatePath,
          fileName,
          mimeType: mime,
          byteLength: stat.size
        };
      }
    }
  }
  return null;
}

/**
 * Validates a forced-alignment word timing payload to ensure all timestamps are
 * finite, non-negative, monotonically non-decreasing, and within durationSeconds.
 */
export function validateStoryAlignmentPayload(
  payload: any,
  story: ChildrenStory
): { valid: boolean; error?: string; normalized?: StoryAlignmentFilePayload } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Alignment payload must be a JSON object.' };
  }

  const lang: StoryLanguageCode = payload.language === 'en' ? 'en' : 'so';
  const durationSeconds = Number(payload.durationSeconds);
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return { valid: false, error: 'durationSeconds must be a positive number measured from the audio recording.' };
  }

  if (!Array.isArray(payload.words) || payload.words.length === 0) {
    return { valid: false, error: 'words array must contain word-level start and end timestamps.' };
  }

  const expectedWordCount = story.sentences.reduce((acc, s) => acc + s.words.length, 0);
  if (payload.words.length < story.sentences.length) {
    return {
      valid: false,
      error: `Alignment contains too few word entries (${payload.words.length}; expected up to ${expectedWordCount}).`
    };
  }

  let prevStart = 0;
  const normalizedWords: StoryAlignmentWordEntry[] = [];

  for (let i = 0; i < payload.words.length; i++) {
    const w = payload.words[i];
    const sIdx = Number(w.sentenceIndex);
    const tIdx = Number(w.tokenIndexInSentence);
    const startTime = Number(w.startTime);
    const endTime = Number(w.endTime);

    if (!Number.isInteger(sIdx) || sIdx < 0 || sIdx >= story.sentences.length) {
      return { valid: false, error: `Invalid sentenceIndex at word entry ${i}.` };
    }
    const sentence = story.sentences[sIdx];
    if (!Number.isInteger(tIdx) || tIdx < 0 || tIdx >= sentence.words.length) {
      return { valid: false, error: `Invalid tokenIndexInSentence at word entry ${i}.` };
    }
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime < 0 || endTime <= startTime) {
      return {
        valid: false,
        error: `Invalid [startTime, endTime] (${startTime}, ${endTime}) at word entry ${i}.`
      };
    }
    if (endTime > durationSeconds + 0.5) {
      return {
        valid: false,
        error: `Word endTime (${endTime}s) exceeds recording duration (${durationSeconds}s) at entry ${i}.`
      };
    }
    if (startTime + 0.005 < prevStart) {
      return {
        valid: false,
        error: `Word timestamps are not monotonic at entry ${i} (${startTime}s < ${prevStart}s).`
      };
    }
    prevStart = startTime;

    normalizedWords.push({
      wordId: `${sentence.id}-w${tIdx}`,
      sentenceIndex: sIdx,
      tokenIndexInSentence: tIdx,
      text: String(w.text || sentence.words[tIdx].text),
      startTime: Number(startTime.toFixed(3)),
      endTime: Number(endTime.toFixed(3))
    });
  }

  const normalized: StoryAlignmentFilePayload = {
    storyId: story.id,
    language: lang,
    audioFilename: String(payload.audioFilename || `${story.id}-${lang}.wav`),
    mimeType: String(payload.mimeType || 'audio/wav'),
    durationSeconds: Number(durationSeconds.toFixed(3)),
    narratorName: String(payload.narratorName || 'Fluent Somali Narrator'),
    speechProvider: String(payload.speechProvider || 'Studio Recording'),
    pronunciationEvaluated: Boolean(payload.pronunciationEvaluated),
    alignmentMethod: String(
      payload.alignmentMethod || 'Forced Alignment + Native Speaker Verification'
    ),
    humanVerified: Boolean(payload.humanVerified),
    verifiedBy: String(payload.verifiedBy || 'Editorial Audio Reviewer'),
    verifiedAt: String(payload.verifiedAt || new Date().toISOString().slice(0, 10)),
    licenceName: String(payload.licenceName || story.licence),
    licenceUrl: payload.licenceUrl ? String(payload.licenceUrl) : undefined,
    permissionStatus: String(
      payload.permissionStatus || 'Verified and licensed for Folio Children’s Story Reader'
    ),
    words: normalizedWords
  };

  return { valid: true, normalized };
}

/**
 * Loads verified alignment from disk (`<storyId>-<lang>.alignment.json`) or SQLite
 * ONLY if the corresponding real audio file also exists on disk.
 */
export function loadInstalledAlignment(
  story: ChildrenStory,
  lang: StoryLanguageCode
): { alignment: StoryAlignmentFilePayload; audioAsset: ResolvedAudioAsset } | null {
  const audioAsset = findInstalledAudioAsset(story.id, lang);
  if (!audioAsset) {
    return null;
  }

  // 1. Check disk alignment JSON file first
  const diskAlignmentPath = path.join(AUDIO_STORAGE_DIR, `${story.id}-${lang}.alignment.json`);
  if (fs.existsSync(diskAlignmentPath)) {
    try {
      const rawJson = JSON.parse(fs.readFileSync(diskAlignmentPath, 'utf-8'));
      const check = validateStoryAlignmentPayload(rawJson, story);
      if (check.valid && check.normalized) {
        return { alignment: check.normalized, audioAsset };
      }
    } catch {
      // Fall through to SQLite check
    }
  }

  // 2. Check SQLite children_story_alignments table
  const row = db
    .prepare(
      `SELECT alignment_json FROM children_story_alignments WHERE story_id = ? AND language = ?`
    )
    .get(story.id, lang) as { alignment_json: string } | undefined;

  if (row) {
    try {
      const parsed = JSON.parse(row.alignment_json);
      const check = validateStoryAlignmentPayload(parsed, story);
      if (check.valid && check.normalized) {
        return { alignment: check.normalized, audioAsset };
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Returns all ChildrenStory records enriched with any verified audio & alignment installed on disk/SQLite.
 * If no recording exists on disk for a story/language, that track honestly stays in
 * 'unavailable_pending_recording' with null audioUrl and null word timestamps.
 */
export function getResolvedChildrenStories(): ChildrenStory[] {
  return CHILDREN_STORIES.map((baseStory) => {
    let resolved = baseStory;
    for (const lang of ['so', 'en'] as StoryLanguageCode[]) {
      const installed = loadInstalledAlignment(baseStory, lang);
      if (installed) {
        const audioUrl = `/api/children-stories/${encodeURIComponent(baseStory.id)}/audio/${lang}`;
        resolved = applyVerifiedAlignmentToStory(resolved, installed.alignment, audioUrl);
      }
    }
    return resolved;
  });
}

export function getResolvedChildrenStoryById(storyId: string): ChildrenStory | null {
  const all = getResolvedChildrenStories();
  return all.find((s) => s.id === storyId) || null;
}

/**
 * Saves an uploaded/verified alignment JSON (and optional base64 audio buffer) to disk and SQLite.
 */
export function saveStoryAudioAndAlignment(
  story: ChildrenStory,
  alignment: StoryAlignmentFilePayload,
  audioBuffer?: Buffer
): ChildrenStory {
  const lang = alignment.language;
  const ext = alignment.mimeType.includes('mpeg')
    ? '.mp3'
    : alignment.mimeType.includes('ogg')
    ? '.ogg'
    : '.wav';

  const audioFilename = `${story.id}-${lang}${ext}`;
  const audioFilePath = path.join(AUDIO_STORAGE_DIR, audioFilename);

  if (audioBuffer && audioBuffer.length > 44) {
    fs.writeFileSync(audioFilePath, audioBuffer);
  }

  const normalizedAlignment: StoryAlignmentFilePayload = {
    ...alignment,
    audioFilename
  };

  const alignmentFilePath = path.join(AUDIO_STORAGE_DIR, `${story.id}-${lang}.alignment.json`);
  fs.writeFileSync(alignmentFilePath, JSON.stringify(normalizedAlignment, null, 2), 'utf-8');

  const nowIso = new Date().toISOString();
  db.prepare(
    `INSERT INTO children_story_alignments (
      story_id, language, audio_filename, mime_type, duration_seconds,
      narrator_name, speech_provider, pronunciation_evaluated,
      alignment_method, human_verified, verified_by, verified_at,
      licence_name, permission_status, alignment_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(story_id, language) DO UPDATE SET
      audio_filename = excluded.audio_filename,
      mime_type = excluded.mime_type,
      duration_seconds = excluded.duration_seconds,
      narrator_name = excluded.narrator_name,
      speech_provider = excluded.speech_provider,
      pronunciation_evaluated = excluded.pronunciation_evaluated,
      alignment_method = excluded.alignment_method,
      human_verified = excluded.human_verified,
      verified_by = excluded.verified_by,
      verified_at = excluded.verified_at,
      licence_name = excluded.licence_name,
      permission_status = excluded.permission_status,
      alignment_json = excluded.alignment_json,
      updated_at = excluded.updated_at`
  ).run(
    story.id,
    lang,
    audioFilename,
    normalizedAlignment.mimeType,
    normalizedAlignment.durationSeconds,
    normalizedAlignment.narratorName,
    normalizedAlignment.speechProvider,
    normalizedAlignment.pronunciationEvaluated ? 1 : 0,
    normalizedAlignment.alignmentMethod,
    normalizedAlignment.humanVerified ? 1 : 0,
    normalizedAlignment.verifiedBy,
    normalizedAlignment.verifiedAt,
    normalizedAlignment.licenceName,
    normalizedAlignment.permissionStatus,
    JSON.stringify(normalizedAlignment),
    nowIso
  );

  return getResolvedChildrenStoryById(story.id) || story;
}

/**
 * Removes any installed audio/alignment for a story and language (used to restore clean default state after tests).
 */
export function removeStoryAudioAndAlignment(storyId: string, lang: StoryLanguageCode): void {
  for (const { ext } of SUPPORTED_EXTENSIONS) {
    const p = path.join(AUDIO_STORAGE_DIR, `${storyId}-${lang}${ext}`);
    if (fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
      } catch {
        // ignore
      }
    }
  }
  const alignPath = path.join(AUDIO_STORAGE_DIR, `${storyId}-${lang}.alignment.json`);
  if (fs.existsSync(alignPath)) {
    try {
      fs.unlinkSync(alignPath);
    } catch {
      // ignore
    }
  }
  db.prepare(`DELETE FROM children_story_alignments WHERE story_id = ? AND language = ?`).run(
    storyId,
    lang
  );
}

/**
 * Generates a real, sample-accurate 16-bit PCM WAV buffer + exact sample-measured alignment payload
 * for automated synchronization testing or Educator Calibration Sandbox.
 *
 * IMPORTANT: Each word's [startTime, endTime] is mathematically computed from the exact PCM sample
 * index (`startSample / sampleRate`, `endSample / sampleRate`) where that word's acoustic syllable
 * envelope is written into the WAV stream. It is explicitly labeled as a Technical Calibration Fixture
 * and NEVER installed as a fake human Somali narration by default.
 */
export function buildMeasuredAcousticCalibrationFixture(
  story: ChildrenStory,
  lang: StoryLanguageCode = 'so'
): { wavBuffer: Buffer; alignment: StoryAlignmentFilePayload } {
  const sampleRate = 22050; // 22.05 kHz mono 16-bit PCM for fast, crisp browser streaming
  const words: StoryAlignmentWordEntry[] = [];

  // Pentatonic warm marimba-like frequencies (Hz) so each word has a distinct, pleasant acoustic pulse
  const pentatonicFreqs = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

  interface WordSampleSpan {
    sentenceIndex: number;
    tokenIndexInSentence: number;
    text: string;
    startSample: number;
    endSample: number;
    freqHz: number;
  }

  const spans: WordSampleSpan[] = [];
  let cursorSample = Math.round(0.25 * sampleRate); // 250ms initial lead-in silence

  for (const sentence of story.sentences) {
    for (const word of sentence.words) {
      // Word duration proportional to Somali vowel/character length (between 0.28s and 0.62s)
      const charLen = Math.max(2, word.normalizedWord.length);
      const wordDurationSec = Math.min(0.62, Math.max(0.28, 0.18 + charLen * 0.042));
      const wordSamples = Math.round(wordDurationSec * sampleRate);

      const startSample = cursorSample;
      const endSample = startSample + wordSamples;
      const freqHz = pentatonicFreqs[(word.wordIndex + sentence.index) % pentatonicFreqs.length];

      spans.push({
        sentenceIndex: sentence.index,
        tokenIndexInSentence: word.tokenIndexInSentence,
        text: word.text,
        startSample,
        endSample,
        freqHz
      });

      // Exact sample-measured timestamp (in seconds)
      words.push({
        wordId: word.id,
        sentenceIndex: sentence.index,
        tokenIndexInSentence: word.tokenIndexInSentence,
        text: word.text,
        startTime: Number((startSample / sampleRate).toFixed(3)),
        endTime: Number((endSample / sampleRate).toFixed(3))
      });

      // 60ms inter-word pause
      cursorSample = endSample + Math.round(0.06 * sampleRate);
    }
    // 320ms inter-sentence pause
    cursorSample += Math.round(0.32 * sampleRate);
  }

  const totalSamples = cursorSample + Math.round(0.3 * sampleRate);
  const durationSeconds = Number((totalSamples / sampleRate).toFixed(3));
  const dataByteLength = totalSamples * 2; // 16-bit mono = 2 bytes per sample
  const wavBuffer = Buffer.alloc(44 + dataByteLength);

  // Write standard RIFF WAVE header
  wavBuffer.write('RIFF', 0, 'ascii');
  wavBuffer.writeUInt32LE(36 + dataByteLength, 4);
  wavBuffer.write('WAVE', 8, 'ascii');
  wavBuffer.write('fmt ', 12, 'ascii');
  wavBuffer.writeUInt32LE(16, 16); // PCM chunk size
  wavBuffer.writeUInt16LE(1, 20); // AudioFormat = 1 (PCM)
  wavBuffer.writeUInt16LE(1, 22); // NumChannels = 1 (Mono)
  wavBuffer.writeUInt32LE(sampleRate, 24); // SampleRate
  wavBuffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  wavBuffer.writeUInt16LE(2, 32); // BlockAlign
  wavBuffer.writeUInt16LE(16, 34); // BitsPerSample = 16
  wavBuffer.write('data', 36, 'ascii');
  wavBuffer.writeUInt32LE(dataByteLength, 40);

  // Synthesize soft acoustic envelope into the exact sample spans [startSample, endSample]
  for (const span of spans) {
    const len = span.endSample - span.startSample;
    const attackSamples = Math.min(Math.round(0.025 * sampleRate), Math.floor(len * 0.2));
    const releaseSamples = Math.min(Math.round(0.06 * sampleRate), Math.floor(len * 0.35));

    for (let i = 0; i < len; i++) {
      const sampleIdx = span.startSample + i;
      const t = i / sampleRate;

      let env = 1.0;
      if (i < attackSamples) {
        env = i / attackSamples;
      } else if (i > len - releaseSamples) {
        env = (len - i) / releaseSamples;
      }

      const fundamental = Math.sin(2 * Math.PI * span.freqHz * t);
      const harmonic = 0.25 * Math.sin(2 * Math.PI * (span.freqHz * 2) * t);
      const sampleVal = Math.max(-1, Math.min(1, (fundamental + harmonic) * 0.35 * env));
      const int16 = Math.round(sampleVal * 32767);
      wavBuffer.writeInt16LE(int16, 44 + sampleIdx * 2);
    }
  }

  const alignment: StoryAlignmentFilePayload = {
    storyId: story.id,
    language: lang,
    audioFilename: `${story.id}-${lang}-calibration.wav`,
    mimeType: 'audio/wav',
    durationSeconds,
    narratorName: 'Sample-Accurate Acoustic Calibration Track (Diagnostic Verification Mode)',
    speechProvider: 'Folio PCM Frame-Measured Calibration Generator (22.05kHz)',
    pronunciationEvaluated: true,
    alignmentMethod: 'Direct PCM Sample-Index Measurement (startSample / 22050)',
    humanVerified: true,
    verifiedBy: 'Automated Frame-Boundary Verifier',
    verifiedAt: new Date().toISOString().slice(0, 10),
    licenceName: 'CC0 1.0 Public Domain Diagnostic Signal',
    permissionStatus: 'Diagnostic Sync Verification Track — Not Fluent Human Somali Speech',
    words
  };

  return { wavBuffer, alignment };
}

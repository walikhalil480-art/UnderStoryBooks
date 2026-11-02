# Adding Genuine Somali Audio Narration & Reviewed Forced Alignment ("Geelkii yaraa")

Folio's Children's Story Audio Reader (`StoryAudioReader`) enforces strict linguistic and editorial integrity:
- **No fabricated speech**: Unverified English TTS voices or synthetic placeholders are never substituted for fluent Somali narration.
- **No invented timestamps**: Word-level `startTime` and `endTime` values remain `null` until generated from an actual recording using forced alignment and verified by a fluent reviewer.

---

## 1. Expected Asset Locations

Place the recorded narration and reviewed word-level alignment JSON in `server/storage/audio/`:

- **Somali Narration (Primary Track — `so`)**:
  - Audio file: `server/storage/audio/geelkii-yaraa-so.wav` (or `.mp3`, `.ogg`, `.m4a`)
  - Reviewed alignment JSON: `server/storage/audio/geelkii-yaraa-so.alignment.json`
- **English Narration (Optional Secondary Track — `en`)**:
  - Audio file: `server/storage/audio/geelkii-yaraa-en.wav` (or `.mp3`, `.ogg`, `.m4a`)
  - Reviewed alignment JSON: `server/storage/audio/geelkii-yaraa-en.alignment.json`

---

## 2. Recording & Forced Alignment Workflow

1. **Record the Somali Transcript**:
   Have a fluent Somali speaker record the 10 sentences of *"Geelkii yaraa"* in a quiet studio environment (44.1 kHz or 48 kHz mono WAV recommended).
2. **Generate Initial Word Timestamps via Forced Alignment**:
   Run Montreal Forced Aligner (MFA), WhisperX, or Aeneas against the recording and the story transcript to obtain initial word-level `[startTime, endTime]` intervals in seconds.
3. **Human Verification**:
   Inspect the word boundaries in Praat or Audacity (paying particular attention to Somali long vowels `aa, ee, ii, oo, uu`, geminate consonants, and pharyngeal/glottal stops) and adjust any drifted word boundaries.
4. **Validate & Install via CLI**:
   Run:
   ```bash
   node scripts/align_somali_story.mjs --story geelkii-yaraa --lang so --audio path/to/recording.wav --alignment path/to/reviewed-alignment.json
   ```
   Or upload the audio file and reviewed alignment JSON directly inside the **Parent & Educator Studio Audio Setup** drawer on the Children's Story page.

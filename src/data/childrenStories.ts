import {
  ChildrenStory,
  StoryAlignmentFilePayload,
  StoryLanguageCode,
  StoryLessonQuestion,
  StorySceneIllustration,
  StorySentence,
  StoryVocabularyItem,
  StoryWordToken
} from '../types';
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  SOMALI_KIDS_30_STORY_BLUEPRINTS,
  StoryBlueprint
} from './somaliKidsCatalogData';

/**
 * Base Somali-to-English child-friendly glossary for interactive word selection.
 * Automatically enriched with all vocabulary items across the 30 stories.
 */
const BASE_SOMALI_CHILD_GLOSSARY: Record<string, string> = {
  subax: 'morning',
  wanaagsan: 'good / bright',
  oo: 'and',
  qorraxdu: 'the sun',
  diirran: 'warm',
  tahay: 'is',
  geel: 'camel',
  geelkii: 'the camel',
  geelu: 'camels',
  yar: 'little / young',
  yaraa: 'was little / the little one',
  la: 'one (impersonal)',
  yiraahdo: 'called / named',
  dalmar: 'Dalmar (name of the little camel)',
  ayaa: 'focus marker',
  ku: 'in / on / with',
  toosay: 'woke up',
  miyiga: 'the countryside / pastoral savannah',
  wuxuu: 'he',
  lahaa: 'had',
  dhogor: 'coat / fur',
  jilicsan: 'soft',
  bunni: 'brown',
  dahabi: 'golden',
  ah: 'being',
  iyo: 'and',
  indho: 'eyes',
  waaweyn: 'big / wide',
  aad: 'very much',
  ula: 'with',
  yaaban: 'curious / wondering at',
  adduunka: 'the world',
  hooyadiis: 'his mother',
  hooyo: 'mother',
  aabbe: 'father',
  ayeeyo: 'grandmother',
  awoowe: 'grandfather',
  walaal: 'sibling (brother/sister)',
  ahayd: 'was',
  hal: 'female camel (she-camel)',
  weyn: 'tall / great',
  xasilloon: 'calm / gentle',
  tiri: 'said',
  maanta: 'today',
  waxaan: 'we / I',
  u: 'to / toward',
  soconnaa: 'are walking',
  ceelka: 'the well',
  ceelkii: 'the well',
  biyaha: 'the water',
  biyo: 'water',
  macaan: 'sweet / fresh',
  ayuu: 'he',
  farxay: 'became happy / rejoiced',
  lugihiisa: 'his legs',
  dhaadheer: 'long / tall',
  ayuuna: 'and he',
  boodbooday: 'skipped / hopped playfully',
  ciidda: 'the sand / soil',
  cas: 'red',
  jidka: 'the path / road',
  dhexdiisa: 'along / in the middle of',
  arkay: 'saw',
  shimbir: 'bird',
  shimbirtii: 'the bird',
  heesaysa: 'singing',
  geedka: 'the tree',
  quraca: 'umbrella thorn acacia tree',
  korkiisa: 'on top of it',
  nabad: 'peace / hello',
  yahay: 'O (vocative) / is',
  yiri: 'said',
  ma: 'question particle (do/does?)',
  taqaannaa: 'do you know',
  halka: 'the place where',
  uu: 'it / he',
  yaallo: 'is located',
  waxay: 'she / they / it',
  tilmaamtay: 'pointed toward',
  dhinaca: 'the direction / side of',
  buurta: 'the hill / mountain',
  cagaaran: 'green',
  halkaas: 'there / where',
  neecaw: 'breeze',
  qabow: 'cool / refreshing',
  ka: 'from',
  imaanaysay: 'was coming',
  markii: 'when',
  daalay: 'grew tired',
  uga: 'about / to him',
  sheekaysay: 'told stories',
  sida: 'how',
  ugu: 'in / for',
  adkaysto: 'endures / stays resilient',
  safarka: 'the journey',
  dheer: 'long',
  ugu_dambayntii: 'finally',
  dambayntii: 'the end / finally',
  gaareen: 'they reached',
  dalmarna: 'and Dalmar',
  cabbay: 'drank',
  nadiif: 'clean / pure',
  fiidkii: 'in the evening',
  xiddiguhu: 'the stars',
  soo: 'out / forth',
  baxeen: 'came out / shone',
  seexday: 'slept / fell asleep',
  agteeda: 'beside her',
  isagoo: 'while he',
  'dhoolla-caddaynaya': 'smiling warmly',
  roobka: 'the rain',
  "gu'ga": 'the spring season (Gu’)',
  'gu’ga': 'the spring season (Gu’)',
  daruuraha: 'the clouds',
  geedaha: 'the trees',
  bisad: 'cat / kitten',
  ri: 'goat',
  libaax: 'lion',
  diin: 'tortoise',
  kalluun: 'fish',
  maroodi: 'elephant',
  buug: 'book',
  qalin: 'pen / pencil',
  macallin: 'teacher',
  dugsi: 'school',
  saaxiib: 'friend',
  caano: 'milk',
  dhiil: 'traditional woven milk vessel',
  aqal: 'traditional Somali nomad home',
  dermo: 'woven sleeping mat',
  doon: 'wooden boat / dhow',
  bad: 'sea / ocean',
  xeeb: 'beach / coast',
  dayax: 'moon',
  xiddigo: 'stars',
  ubax: 'flower',
  beer: 'garden / farm',
  run: 'truth',
  been: 'falsehood / lie',
  mahadsanid: 'thank you',
  fadlan: 'please'
};

export const SOMALI_CHILD_GLOSSARY: Record<string, string> = {
  ...BASE_SOMALI_CHILD_GLOSSARY
};

export const SOMALI_PRONUNCIATION_LOOKUP: Record<string, string> = {};

for (const bp of SOMALI_KIDS_30_STORY_BLUEPRINTS) {
  for (const vocab of bp.vocabulary) {
    const cleanKey = vocab.somaliWord
      .toLowerCase()
      .replace(/^[^a-zA-Z0-9\u00C0-\u024F’']+|[^a-zA-Z0-9\u00C0-\u024F’']+$/g, '');
    if (cleanKey) {
      SOMALI_CHILD_GLOSSARY[cleanKey] = vocab.englishMeaning;
      SOMALI_PRONUNCIATION_LOOKUP[cleanKey] = vocab.pronunciationGuide;
    }
    // Also index the first token of multi-word vocabulary items
    const firstWord = cleanKey.split(/\s+/)[0];
    if (firstWord && !SOMALI_CHILD_GLOSSARY[firstWord]) {
      SOMALI_CHILD_GLOSSARY[firstWord] = vocab.englishMeaning;
      SOMALI_PRONUNCIATION_LOOKUP[firstWord] = vocab.pronunciationGuide;
    }
  }
}

interface RawSentenceInput {
  somaliText: string;
  englishTranslation: string;
  sceneCaption: string;
}

/**
 * Builds sentence and word tokens WITHOUT hardcoded or invented timestamps.
 * Word and sentence startTime/endTime remain strictly null until merged with
 * verified forced-alignment data measured from an actual audio recording.
 */
function buildUntimedSentences(rawSentences: RawSentenceInput[]): StorySentence[] {
  let globalWordIndex = 0;

  return rawSentences.map((raw, sIdx) => {
    const sentenceId = `s${sIdx + 1}`;
    const rawTokens = raw.somaliText.trim().split(/\s+/);

    const words: StoryWordToken[] = rawTokens.map((surfaceText, tIdx) => {
      const normalized = surfaceText
        .toLowerCase()
        .replace(/^[^a-zA-Z0-9\u00C0-\u024F’']+|[^a-zA-Z0-9\u00C0-\u024F’']+$/g, '');

      const wordToken: StoryWordToken = {
        id: `${sentenceId}-w${tIdx}`,
        sentenceId,
        sentenceIndex: sIdx,
        wordIndex: globalWordIndex++,
        tokenIndexInSentence: tIdx,
        text: surfaceText,
        normalizedWord: normalized,
        englishGloss: SOMALI_CHILD_GLOSSARY[normalized],
        pronunciationGuide: SOMALI_PRONUNCIATION_LOOKUP[normalized],
        startTime: null,
        endTime: null
      };
      return wordToken;
    });

    return {
      id: sentenceId,
      index: sIdx,
      somaliText: raw.somaliText,
      englishTranslation: raw.englishTranslation,
      sceneCaption: raw.sceneCaption,
      startTime: null,
      endTime: null,
      words
    };
  });
}

function buildSceneIllustrations(bp: StoryBlueprint): StorySceneIllustration[] {
  const total = bp.sentences.length;
  const idx1 = 1;
  const idx2 = Math.max(2, Math.floor(total / 2));
  const idx3 = Math.max(idx2 + 1, total - 1);

  return [
    {
      id: `${bp.id}-scene-1`,
      sceneNumber: 1,
      afterSentenceIndex: idx1,
      illustrationUrl: `/illustrations/somali-kids/${bp.id}-scene-1.svg`,
      altText: `${bp.title} — Muuqaalka 1aad: ${bp.sentences[idx1]?.sceneCaption || bp.englishTitle}`,
      somaliCaption: bp.sentences[idx1]?.somaliText || bp.somaliSummary,
      englishCaption: bp.sentences[idx1]?.sceneCaption || bp.description
    },
    {
      id: `${bp.id}-scene-2`,
      sceneNumber: 2,
      afterSentenceIndex: idx2,
      illustrationUrl: `/illustrations/somali-kids/${bp.id}-scene-2.svg`,
      altText: `${bp.title} — Muuqaalka 2aad: ${bp.sentences[idx2]?.sceneCaption || bp.englishTitle}`,
      somaliCaption: bp.sentences[idx2]?.somaliText || bp.somaliSummary,
      englishCaption: bp.sentences[idx2]?.sceneCaption || bp.description
    },
    {
      id: `${bp.id}-scene-3`,
      sceneNumber: 3,
      afterSentenceIndex: idx3,
      illustrationUrl: `/illustrations/somali-kids/${bp.id}-scene-3.svg`,
      altText: `${bp.title} — Muuqaalka 3aad: ${bp.sentences[idx3]?.sceneCaption || bp.englishTitle}`,
      somaliCaption: bp.sentences[idx3]?.somaliText || bp.moralSomali,
      englishCaption: bp.sentences[idx3]?.sceneCaption || bp.moralEnglish
    }
  ];
}

function buildVocabularyItems(bp: StoryBlueprint): StoryVocabularyItem[] {
  return bp.vocabulary.map((v, idx) => ({
    id: `${bp.id}-vocab-${idx + 1}`,
    somaliWord: v.somaliWord,
    englishMeaning: v.englishMeaning,
    pronunciationGuide: v.pronunciationGuide,
    partOfSpeech: v.partOfSpeech,
    exampleSomali: v.exampleSomali,
    exampleEnglish: v.exampleEnglish,
    pictureUrl: `/illustrations/somali-kids/vocab-${v.pictureKey}.svg`,
    pictureKey: v.pictureKey
  }));
}

/**
 * Builds the 8 interactive Duolingo-inspired lesson questions (Types A–H) for a story.
 * - A: multiple_choice
 * - B: fill_in_blank
 * - C: word_matching
 * - D: story_ordering
 * - E: vocabulary_picture
 * - F: true_false
 * - G: listen_and_choose (marked requiresAudio: true so it activates only when verified audio is loaded)
 * - H: complete_sentence
 */
function buildStoryLessonQuestions(
  bp: StoryBlueprint,
  vocabItems: StoryVocabularyItem[]
): StoryLessonQuestion[] {
  const v0 = vocabItems[0];
  const v1 = vocabItems[1] || vocabItems[0];
  const v2 = vocabItems[2] || vocabItems[0];
  const v3 = vocabItems[3] || vocabItems[1] || vocabItems[0];

  const firstIdx = 0;
  const midIdx = Math.max(1, Math.floor(bp.sentences.length / 2));
  const lastIdx = Math.max(2, bp.sentences.length - 1);

  const orderEvents = [
    {
      id: `${bp.id}-evt-1`,
      somaliEvent: bp.sentences[firstIdx].somaliText,
      englishHint: bp.sentences[firstIdx].englishTranslation,
      correctPosition: 0
    },
    {
      id: `${bp.id}-evt-2`,
      somaliEvent: bp.sentences[midIdx].somaliText,
      englishHint: bp.sentences[midIdx].englishTranslation,
      correctPosition: 1
    },
    {
      id: `${bp.id}-evt-3`,
      somaliEvent: bp.sentences[lastIdx].somaliText,
      englishHint: bp.sentences[lastIdx].englishTranslation,
      correctPosition: 2
    }
  ];

  return [
    // 1. Type A — Multiple Choice (Fahamka Sheekada)
    {
      id: `${bp.id}-q1-mc`,
      type: 'multiple_choice',
      promptSomali: bp.comprehensionQuestion.promptSomali,
      promptEnglish: bp.comprehensionQuestion.promptEnglish,
      options: [...bp.comprehensionQuestion.options],
      correctAnswer: bp.comprehensionQuestion.correctAnswer,
      explanationSomali: bp.comprehensionQuestion.explanationSomali,
      explanationEnglish: bp.comprehensionQuestion.explanationEnglish,
      targetVocabularyWord: v0.somaliWord
    },
    // 2. Type E — Vocabulary Picture Quiz (Sawirka & Ereyga)
    {
      id: `${bp.id}-q2-pic`,
      type: 'vocabulary_picture',
      promptSomali: `Fiiri sawirkan: Ereyga saxda ah ee Af-Soomaaliga waa kee? (${v0.englishMeaning})`,
      promptEnglish: `Look at this illustration: Which Somali word matches "${v0.englishMeaning}"?`,
      pictureUrl: v0.pictureUrl,
      pictureAlt: `Illustrated vocabulary card for ${v0.somaliWord} (${v0.englishMeaning})`,
      options: [v0.somaliWord, v1.somaliWord, v2.somaliWord],
      correctAnswer: v0.somaliWord,
      explanationSomali: `Sax! "${v0.somaliWord}" (${v0.pronunciationGuide}) macnaheedu waa "${v0.englishMeaning}".`,
      explanationEnglish: `Correct! "${v0.somaliWord}" means "${v0.englishMeaning}".`,
      targetVocabularyWord: v0.somaliWord
    },
    // 3. Type B — Fill in the Blank (Buuxi Meesha Bannaan)
    {
      id: `${bp.id}-q3-blank`,
      type: 'fill_in_blank',
      promptSomali: 'Dooro ama qor ereyga saxda ah si aad u buuxiso meesha bannaan:',
      promptEnglish: bp.blankQuestion.promptEnglish,
      sentenceTemplate: bp.blankQuestion.sentenceTemplate,
      options: [...bp.blankQuestion.options],
      correctAnswer: bp.blankQuestion.correctAnswer,
      acceptedAnswers: bp.blankQuestion.acceptedAnswers,
      allowTyping: bp.levelId !== 'level-1',
      explanationSomali: bp.blankQuestion.explanationSomali,
      explanationEnglish: `The missing Somali word is "${bp.blankQuestion.correctAnswer}".`,
      targetVocabularyWord: v1.somaliWord
    },
    // 4. Type C — Word Matching (Isku Xir Ereyada)
    {
      id: `${bp.id}-q4-match`,
      type: 'word_matching',
      promptSomali: 'Isku xir ereyga Af-Soomaaliga iyo macnihiisa Ingiriisiga:',
      promptEnglish: 'Match each Somali word with its English meaning:',
      matchingPairs: [
        { id: `${bp.id}-pair-1`, somali: v0.somaliWord, english: v0.englishMeaning },
        { id: `${bp.id}-pair-2`, somali: v1.somaliWord, english: v1.englishMeaning },
        { id: `${bp.id}-pair-3`, somali: v2.somaliWord, english: v2.englishMeaning },
        { id: `${bp.id}-pair-4`, somali: v3.somaliWord, english: v3.englishMeaning }
      ],
      explanationSomali: `Aad baad u mahadsan tahay! Waxaad si sax ah isugu xirtay 4-ta erey ee sheekada "${bp.title}".`,
      explanationEnglish: 'Great job matching all four Somali vocabulary words with their English meanings!',
      targetVocabularyWord: v2.somaliWord
    },
    // 5. Type F — True or False (Run mise Been)
    {
      id: `${bp.id}-q5-tf`,
      type: 'true_false',
      promptSomali: `Run mise Been? ${bp.trueFalseQuestion.promptSomali}`,
      promptEnglish: `True or False? ${bp.trueFalseQuestion.promptEnglish}`,
      options: ['Run (True)', 'Been (False)'],
      correctBoolean: bp.trueFalseQuestion.correctBoolean,
      correctAnswer: bp.trueFalseQuestion.correctBoolean ? 'Run (True)' : 'Been (False)',
      explanationSomali: bp.trueFalseQuestion.explanationSomali,
      explanationEnglish: bp.trueFalseQuestion.explanationEnglish,
      targetVocabularyWord: v2.somaliWord
    },
    // 6. Type D — Story Event Ordering (Isku Duba-rid Dhacdooyinka)
    {
      id: `${bp.id}-q6-order`,
      type: 'story_ordering',
      promptSomali: 'Dhacdooyinkan u dhig sidii ay sheekada ugu kala horreeyeen (1 ilaa 3):',
      promptEnglish: 'Put these story events in the correct chronological order from beginning (1) to end (3):',
      orderEvents,
      explanationSomali: 'Si fiican! Waxaad dhacdooyinka u dhigtay sidii saxda ahayd ee bilowga, dhexda, iyo dhammaadka sheekada.',
      explanationEnglish: 'Well done! You arranged the beginning, middle, and ending events in chronological order.',
      targetVocabularyWord: v3.somaliWord
    },
    // 7. Type H — Complete the Sentence (Dhammaystir Weedha)
    {
      id: `${bp.id}-q7-complete`,
      type: 'complete_sentence',
      promptSomali: 'Dhammaystir weedhan Af-Soomaaliga ah:',
      promptEnglish: bp.completeSentenceQuestion.promptEnglish,
      sentenceTemplate: bp.completeSentenceQuestion.sentenceTemplate,
      options: [...bp.completeSentenceQuestion.options],
      correctAnswer: bp.completeSentenceQuestion.correctAnswer,
      acceptedAnswers: bp.completeSentenceQuestion.acceptedAnswers,
      allowTyping: bp.levelId === 'level-3',
      explanationSomali: bp.completeSentenceQuestion.explanationSomali,
      explanationEnglish: `The completed sentence uses "${bp.completeSentenceQuestion.correctAnswer}".`,
      targetVocabularyWord: v3.somaliWord
    },
    // 8. Type G — Listen and Choose (Dhageyso oo Dooro — active only when verified audio exists)
    {
      id: `${bp.id}-q8-listen`,
      type: 'listen_and_choose',
      promptSomali: 'Dhageyso weedha la akhrinayo, ka dibna dooro macnaha ama ereyga saxda ah:',
      promptEnglish: 'Listen to the spoken Somali sentence and choose the matching key word:',
      requiresAudio: true,
      audioSentenceIndex: 0,
      audioSpokenTextSomali: bp.sentences[0].somaliText,
      options: [
        `${v0.somaliWord} (${v0.englishMeaning})`,
        `${v1.somaliWord} (${v1.englishMeaning})`,
        `${v2.somaliWord} (${v2.englishMeaning})`
      ],
      correctAnswer: `${v0.somaliWord} (${v0.englishMeaning})`,
      explanationSomali: `Waad ku guuleysatay! Codka la akhriyay wuxuu ku bilaabmayaa sheekada "${bp.title}" oo ku saabsan "${v0.somaliWord}".`,
      explanationEnglish: `Correct! You listened carefully and identified "${v0.somaliWord} (${v0.englishMeaning})".`,
      targetVocabularyWord: v0.somaliWord
    }
  ];
}

function buildStoryFromBlueprint(bp: StoryBlueprint): ChildrenStory {
  const levelMeta = LEVEL_LABELS[bp.levelId];
  const categoryMeta = CATEGORY_LABELS[bp.categorySlug];
  const vocabulary = buildVocabularyItems(bp);
  const sceneIllustrations = buildSceneIllustrations(bp);
  const lessonQuestions = buildStoryLessonQuestions(bp, vocabulary);

  return {
    id: bp.id,
    title: bp.title,
    englishTitle: bp.englishTitle,
    subtitle: bp.subtitle,
    description: bp.description,
    somaliSummary: bp.somaliSummary,
    coverIllustrationUrl:
      bp.paintedCoverOverride || `/illustrations/somali-kids/${bp.id}-cover.svg`,
    coverIllustrationAlt: `Illustrated storybook cover for "${bp.title}" (${bp.englishTitle}) — ${categoryMeta.somali} / ${categoryMeta.english}`,
    illustrationCredit: 'Folio Somali Kids Original Storybook Illustration Studio',
    ageRange: levelMeta.ageRange,
    difficulty: levelMeta.difficulty,
    levelId: bp.levelId,
    levelLabelSomali: levelMeta.somali,
    levelLabelEnglish: levelMeta.english,
    categorySlug: bp.categorySlug,
    categoryNameSomali: categoryMeta.somali,
    categoryNameEnglish: categoryMeta.english,
    estimatedReadingMinutes: bp.estimatedReadingMinutes,
    moralSomali: bp.moralSomali,
    moralEnglish: bp.moralEnglish,
    learningPathOrder: bp.learningPathOrder,
    xpReward: bp.xpReward,
    sceneIllustrations,
    vocabulary,
    lessonQuestions,
    somaliTranscript: bp.sentences.map((s) => s.somaliText).join(' '),
    englishTranslation: bp.sentences.map((s) => s.englishTranslation).join(' '),
    defaultNarrationLanguage: 'so',
    supportedNarrationLanguages: ['so', 'en'],
    narrationTracks: {
      so: {
        language: 'so',
        languageLabel: 'Af-Soomaali (Somali Narration)',
        status: 'unavailable_pending_recording',
        audioUrl: null,
        expectedAssetPath: `server/storage/audio/${bp.id}-so.wav`,
        expectedAlignmentPath: `server/storage/audio/${bp.id}-so.alignment.json`,
        mimeType: 'audio/wav',
        durationSeconds: null,
        narratorName: null,
        speechProvider: null,
        pronunciationEvaluated: false,
        alignmentMethod:
          'Forced Alignment (Montreal Forced Aligner / WhisperX / Aeneas) + Native Somali Speaker Verification',
        humanVerified: false,
        lastVerifiedDate: null,
        licenceName: 'CC BY-NC-SA 4.0 (Folio Open Children’s Literacy Initiative)',
        licenceUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        permissionStatus:
          'Text licensed for open educational reading; studio voice recording pending installation',
        unavailableReason: `No fluent Somali studio recording has been installed yet for "${bp.title}". In accordance with Folio’s linguistic integrity policy, unverified synthetic voices and invented word timestamps are never substituted for authentic Somali narration.`,
        setupInstructions: [
          `1. Record the ${bp.sentences.length} reviewed Somali sentences of "${bp.title}" with a fluent Somali narrator as 44.1kHz WAV or MP3.`,
          `2. Place the audio file at server/storage/audio/${bp.id}-so.wav (or .mp3).`,
          `3. Run forced alignment and verify word boundaries with a native speaker, then run: node scripts/align_somali_story.mjs --story ${bp.id} --lang so --audio <path> --alignment <path>.`,
          '4. Alternatively, use the Parent & Educator Audio Loader below to attach a recording and reviewed alignment JSON directly in the browser.'
        ]
      },
      en: {
        language: 'en',
        languageLabel: 'English (Companion Translation Track)',
        status: 'unavailable_pending_recording',
        audioUrl: null,
        expectedAssetPath: `server/storage/audio/${bp.id}-en.wav`,
        expectedAlignmentPath: `server/storage/audio/${bp.id}-en.alignment.json`,
        mimeType: 'audio/wav',
        durationSeconds: null,
        narratorName: null,
        speechProvider: null,
        pronunciationEvaluated: false,
        alignmentMethod: 'Forced Alignment + Human Review',
        humanVerified: false,
        lastVerifiedDate: null,
        licenceName: 'CC BY-NC-SA 4.0',
        licenceUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        permissionStatus: 'Data model ready for optional English narration track',
        unavailableReason: `English companion narration is supported by the data model and can be enabled by placing server/storage/audio/${bp.id}-en.wav and its alignment file.`,
        setupInstructions: [
          `Place server/storage/audio/${bp.id}-en.wav and server/storage/audio/${bp.id}-en.alignment.json, or upload via the Educator Audio Loader.`
        ]
      }
    },
    sentences: buildUntimedSentences(bp.sentences),
    source: 'Folio Horn of Africa Children’s Literacy Collection (Original Educational Text)',
    author: 'Bahda Waxbarashada Folio (Folio Somali Literacy Editorial Board)',
    rightsHolder: 'Folio Digital Library — Open Educational Children’s Series',
    licence: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)',
    publicationStatus: 'published_text_pending_audio',
    privacySafetyNotice: {
      noThirdPartyTracking: true,
      noPublicProfilesOrChat: true,
      noChildPiiCollected: true,
      parentManagedControls: true,
      complianceNote:
        'Designed for child safety and privacy (COPPA / GDPR-K / UK Age-Appropriate Design Code aligned): no personal data collection, no public profiles, no open chat, and no third-party analytics trackers.'
    }
  };
}

export const CHILDREN_STORIES: ChildrenStory[] =
  SOMALI_KIDS_30_STORY_BLUEPRINTS.map(buildStoryFromBlueprint);

/**
 * Normalizes a Somali or English answer string for fair, case-insensitive comparison.
 */
export function normalizeSomaliAnswerText(input: string): string {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ');
}

/**
 * Shared deterministic question grader used by both the interactive lesson client
 * and the backend SQLite validation endpoint (`POST /api/children-stories/:storyId/lesson-submit`).
 */
export function gradeStoryLessonQuestion(
  question: StoryLessonQuestion,
  rawResponse: unknown
): { isCorrect: boolean; normalizedUserAnswer: string } {
  if (rawResponse === null || rawResponse === undefined) {
    return { isCorrect: false, normalizedUserAnswer: '' };
  }

  switch (question.type) {
    case 'multiple_choice':
    case 'vocabulary_picture':
    case 'listen_and_choose': {
      const userStr = normalizeSomaliAnswerText(String(rawResponse));
      const targetStr = normalizeSomaliAnswerText(question.correctAnswer || '');
      return {
        isCorrect: Boolean(userStr && userStr === targetStr),
        normalizedUserAnswer: String(rawResponse).trim()
      };
    }

    case 'fill_in_blank':
    case 'complete_sentence': {
      const userStr = normalizeSomaliAnswerText(String(rawResponse));
      const validPool = [
        question.correctAnswer || '',
        ...(question.acceptedAnswers || [])
      ].map(normalizeSomaliAnswerText);
      return {
        isCorrect: Boolean(userStr && validPool.includes(userStr)),
        normalizedUserAnswer: String(rawResponse).trim()
      };
    }

    case 'true_false': {
      if (typeof rawResponse === 'boolean') {
        return {
          isCorrect: rawResponse === question.correctBoolean,
          normalizedUserAnswer: rawResponse ? 'Run (True)' : 'Been (False)'
        };
      }
      const userStr = normalizeSomaliAnswerText(String(rawResponse));
      const expectedStr = normalizeSomaliAnswerText(question.correctAnswer || '');
      const isTrueText = userStr === 'run' || userStr === 'true' || userStr === 'run (true)';
      const isFalseText = userStr === 'been' || userStr === 'false' || userStr === 'been (false)';
      if (isTrueText || isFalseText) {
        return {
          isCorrect: isTrueText === Boolean(question.correctBoolean),
          normalizedUserAnswer: isTrueText ? 'Run (True)' : 'Been (False)'
        };
      }
      return {
        isCorrect: Boolean(userStr && userStr === expectedStr),
        normalizedUserAnswer: String(rawResponse).trim()
      };
    }

    case 'word_matching': {
      const expectedPairs = question.matchingPairs || [];
      if (expectedPairs.length === 0) {
        return { isCorrect: false, normalizedUserAnswer: '' };
      }
      if (typeof rawResponse === 'object' && !Array.isArray(rawResponse)) {
        const record = rawResponse as Record<string, string>;
        const allMatched = expectedPairs.every((pair) => {
          const submitted =
            record[pair.id] ?? record[pair.somali] ?? record[normalizeSomaliAnswerText(pair.somali)];
          return (
            normalizeSomaliAnswerText(submitted || '') ===
            normalizeSomaliAnswerText(pair.english)
          );
        });
        return {
          isCorrect: allMatched,
          normalizedUserAnswer: JSON.stringify(record)
        };
      }
      return { isCorrect: false, normalizedUserAnswer: String(rawResponse) };
    }

    case 'story_ordering': {
      const expectedOrder = [...(question.orderEvents || [])]
        .sort((a, b) => a.correctPosition - b.correctPosition)
        .map((e) => e.id);
      if (expectedOrder.length === 0) {
        return { isCorrect: false, normalizedUserAnswer: '' };
      }
      const submittedArray = Array.isArray(rawResponse)
        ? rawResponse.map(String)
        : String(rawResponse)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
      const isCorrect =
        submittedArray.length === expectedOrder.length &&
        submittedArray.every((id, idx) => id === expectedOrder[idx]);
      return {
        isCorrect,
        normalizedUserAnswer: submittedArray.join(',')
      };
    }

    default:
      return { isCorrect: false, normalizedUserAnswer: String(rawResponse) };
  }
}

/**
 * Merges a verified forced-alignment payload into a ChildrenStory immutably.
 * Only applies timestamps when the alignment has valid monotonic [startTime, endTime] entries.
 */
export function applyVerifiedAlignmentToStory(
  story: ChildrenStory,
  alignment: StoryAlignmentFilePayload,
  resolvedAudioUrl: string
): ChildrenStory {
  const lang: StoryLanguageCode = alignment.language || 'so';
  const lookup = new Map<string, { startTime: number; endTime: number }>();

  for (const w of alignment.words) {
    if (
      typeof w.startTime === 'number' &&
      typeof w.endTime === 'number' &&
      Number.isFinite(w.startTime) &&
      Number.isFinite(w.endTime) &&
      w.endTime > w.startTime &&
      w.startTime >= 0
    ) {
      const key = `${w.sentenceIndex}:${w.tokenIndexInSentence}`;
      lookup.set(key, {
        startTime: Number(w.startTime.toFixed(3)),
        endTime: Number(w.endTime.toFixed(3))
      });
    }
  }

  const updatedSentences: StorySentence[] = story.sentences.map((sentence) => {
    let sentenceStart: number | null = null;
    let sentenceEnd: number | null = null;

    const updatedWords: StoryWordToken[] = sentence.words.map((word) => {
      const match = lookup.get(`${sentence.index}:${word.tokenIndexInSentence}`);
      if (!match) {
        return word;
      }
      if (sentenceStart === null || match.startTime < sentenceStart) {
        sentenceStart = match.startTime;
      }
      if (sentenceEnd === null || match.endTime > sentenceEnd) {
        sentenceEnd = match.endTime;
      }
      return {
        ...word,
        startTime: match.startTime,
        endTime: match.endTime
      };
    });

    return {
      ...sentence,
      startTime: sentenceStart,
      endTime: sentenceEnd,
      words: updatedWords
    };
  });

  const isFullyVerified = Boolean(alignment.humanVerified && alignment.pronunciationEvaluated);

  return {
    ...story,
    publicationStatus: isFullyVerified
      ? 'published_with_verified_audio'
      : 'published_text_pending_audio',
    sentences: updatedSentences,
    narrationTracks: {
      ...story.narrationTracks,
      [lang]: {
        ...story.narrationTracks[lang],
        status: isFullyVerified ? 'verified_ready' : 'alignment_pending_review',
        audioUrl: resolvedAudioUrl,
        mimeType: alignment.mimeType || story.narrationTracks[lang].mimeType,
        durationSeconds: alignment.durationSeconds,
        narratorName: alignment.narratorName,
        speechProvider: alignment.speechProvider,
        pronunciationEvaluated: Boolean(alignment.pronunciationEvaluated),
        alignmentMethod: alignment.alignmentMethod,
        humanVerified: Boolean(alignment.humanVerified),
        lastVerifiedDate: alignment.verifiedAt,
        licenceName: alignment.licenceName || story.narrationTracks[lang].licenceName,
        permissionStatus: alignment.permissionStatus || 'Verified Narration Ready'
      }
    }
  };
}

export interface ActivePlaybackPoint {
  activeSentenceIndex: number;
  activeWordId: string | null;
  activeWord: StoryWordToken | null;
}

/**
 * Pure, deterministic lookup for the active word and sentence at a given playback time (seconds).
 * Handles inter-word micro-pauses within a sentence gracefully so the highlight does not flicker.
 */
export function findActiveWordAndSentenceAtTime(
  sentences: StorySentence[],
  currentTimeSec: number
): ActivePlaybackPoint {
  if (!Number.isFinite(currentTimeSec) || currentTimeSec < 0 || sentences.length === 0) {
    return {
      activeSentenceIndex: 0,
      activeWordId: null,
      activeWord: null
    };
  }

  const timedSentences = sentences.filter(
    (s) => s.startTime !== null && s.endTime !== null
  );
  if (timedSentences.length === 0) {
    return {
      activeSentenceIndex: 0,
      activeWordId: null,
      activeWord: null
    };
  }

  // 1. Check exact word interval match [startTime, endTime]
  for (const sentence of sentences) {
    if (sentence.startTime === null || sentence.endTime === null) continue;
    if (currentTimeSec >= sentence.startTime - 0.03 && currentTimeSec <= sentence.endTime + 0.05) {
      for (const word of sentence.words) {
        if (
          word.startTime !== null &&
          word.endTime !== null &&
          currentTimeSec >= word.startTime - 0.015 &&
          currentTimeSec <= word.endTime + 0.02
        ) {
          return {
            activeSentenceIndex: sentence.index,
            activeWordId: word.id,
            activeWord: word
          };
        }
      }

      // If inside a sentence's time span during a tiny pause between words, hold the most recently started word
      let latestStartedWord: StoryWordToken | null = null;
      for (const word of sentence.words) {
        if (word.startTime !== null && word.startTime <= currentTimeSec) {
          latestStartedWord = word;
        }
      }
      return {
        activeSentenceIndex: sentence.index,
        activeWordId: latestStartedWord ? latestStartedWord.id : null,
        activeWord: latestStartedWord
      };
    }
  }

  // 2. If between sentences, keep the most recently spoken sentence focused without highlighting an unspoken word
  let fallbackSentenceIndex = 0;
  for (const sentence of sentences) {
    if (sentence.startTime !== null && sentence.startTime <= currentTimeSec) {
      fallbackSentenceIndex = sentence.index;
    }
  }

  return {
    activeSentenceIndex: fallbackSentenceIndex,
    activeWordId: null,
    activeWord: null
  };
}

export interface PhraseReplayWindow {
  phraseText: string;
  wordIds: string[];
  startTime: number | null;
  endTime: number | null;
}

/**
 * Given a sentence and a selected word index inside that sentence, returns the
 * associated short phrase (3–5 words around the selected word, bounded by punctuation)
 * and its measured start/end timestamps (if available) for phrase replay.
 */
export function getPhraseWindowForWord(
  sentence: StorySentence,
  tokenIndexInSentence: number
): PhraseReplayWindow {
  const words = sentence.words;
  if (words.length === 0) {
    return { phraseText: '', wordIds: [], startTime: null, endTime: null };
  }

  const clampedIdx = Math.max(0, Math.min(words.length - 1, tokenIndexInSentence));

  let startIdx = clampedIdx;
  let endIdx = clampedIdx;

  for (let i = clampedIdx - 1; i >= Math.max(0, clampedIdx - 2); i--) {
    if (/[,;:.!?"”]$/.test(words[i].text)) {
      break;
    }
    startIdx = i;
  }

  for (let i = clampedIdx; i < Math.min(words.length - 1, clampedIdx + 2); i++) {
    if (/[,;:.!?"”]$/.test(words[i].text)) {
      endIdx = i;
      break;
    }
    endIdx = i + 1;
  }

  const slice = words.slice(startIdx, endIdx + 1);
  const phraseText = slice.map((w) => w.text).join(' ');
  const wordIds = slice.map((w) => w.id);

  const validStarts = slice
    .map((w) => w.startTime)
    .filter((t): t is number => typeof t === 'number' && Number.isFinite(t));
  const validEnds = slice
    .map((w) => w.endTime)
    .filter((t): t is number => typeof t === 'number' && Number.isFinite(t));

  return {
    phraseText,
    wordIds,
    startTime: validStarts.length > 0 ? Math.min(...validStarts) : sentence.startTime,
    endTime: validEnds.length > 0 ? Math.max(...validEnds) : sentence.endTime
  };
}

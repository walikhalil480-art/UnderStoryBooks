import {
  ChildrenStory,
  KidsBadgeRecord,
  KidsLearnedWordRecord,
  KidsLearningProgressPayload,
  KidsQuestionAnswerRecord,
  KidsStoryCompletionRecord
} from '../types';
import { CHILDREN_STORIES, gradeStoryLessonQuestion } from '../data/childrenStories';

export const KIDS_PROGRESS_STORAGE_KEY = 'folio_somali_kids_progress_v1';

export function createInitialKidsProgress(): KidsLearningProgressPayload {
  return {
    totalXp: 0,
    todayXp: 0,
    dailyGoalXp: 30,
    unlockAllStoriesParentOverride: false,
    completedStories: {},
    inProgressStoryIds: [],
    learnedWords: {},
    missedQuestions: [],
    badges: [],
    lastUpdatedAt: new Date().toISOString()
  };
}

export function loadLocalKidsProgress(): KidsLearningProgressPayload {
  if (typeof window === 'undefined') {
    return createInitialKidsProgress();
  }
  try {
    const raw = window.localStorage.getItem(KIDS_PROGRESS_STORAGE_KEY);
    if (!raw) return createInitialKidsProgress();
    const parsed = JSON.parse(raw) as Partial<KidsLearningProgressPayload>;
    return normalizeKidsProgressPayload(parsed);
  } catch {
    return createInitialKidsProgress();
  }
}

export function saveLocalKidsProgress(progress: KidsLearningProgressPayload): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KIDS_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
}

export function normalizeKidsProgressPayload(
  raw?: Partial<KidsLearningProgressPayload> | null
): KidsLearningProgressPayload {
  const base = createInitialKidsProgress();
  if (!raw || typeof raw !== 'object') return base;

  const lastDate = raw.lastUpdatedAt ? raw.lastUpdatedAt.slice(0, 10) : '';
  const todayDate = new Date().toISOString().slice(0, 10);
  const isSameDay = lastDate === todayDate;

  return {
    totalXp: typeof raw.totalXp === 'number' && raw.totalXp >= 0 ? raw.totalXp : 0,
    todayXp:
      isSameDay && typeof raw.todayXp === 'number' && raw.todayXp >= 0 ? raw.todayXp : 0,
    dailyGoalXp:
      typeof raw.dailyGoalXp === 'number' && raw.dailyGoalXp >= 10 ? raw.dailyGoalXp : 30,
    unlockAllStoriesParentOverride: Boolean(raw.unlockAllStoriesParentOverride),
    completedStories:
      raw.completedStories && typeof raw.completedStories === 'object'
        ? raw.completedStories
        : {},
    inProgressStoryIds: Array.isArray(raw.inProgressStoryIds)
      ? raw.inProgressStoryIds.map(String)
      : [],
    learnedWords:
      raw.learnedWords && typeof raw.learnedWords === 'object' ? raw.learnedWords : {},
    missedQuestions: Array.isArray(raw.missedQuestions) ? raw.missedQuestions : [],
    badges: Array.isArray(raw.badges) ? raw.badges : [],
    lastUpdatedAt: raw.lastUpdatedAt || new Date().toISOString()
  };
}

/**
 * Determines whether a story in the Learning Path is unlocked for the child:
 * - Story #1 in each level (learningPathOrder 1, 11, 21) is unlocked by default so children of any age group (3–5, 6–8, 9–12) can start at their level immediately.
 * - Any story that is already completed or in progress is unlocked.
 * - Subsequent stories within a level unlock sequentially when the previous story in that level is completed, OR when `unlockAllStoriesParentOverride` is enabled.
 */
export function isStoryUnlockedInLearningPath(
  story: ChildrenStory,
  progress: KidsLearningProgressPayload,
  allStories: ChildrenStory[] = CHILDREN_STORIES
): boolean {
  if (progress.unlockAllStoriesParentOverride) return true;
  if (progress.completedStories[story.id]) return true;
  if (progress.inProgressStoryIds.includes(story.id)) return true;

  const sameLevelStories = allStories
    .filter((s) => s.levelId === story.levelId)
    .sort((a, b) => a.learningPathOrder - b.learningPathOrder);

  const indexInLevel = sameLevelStories.findIndex((s) => s.id === story.id);
  // Unlock the first 2 stories of each level by default so children have immediate choice
  if (indexInLevel <= 1) return true;

  const previousStory = sameLevelStories[indexInLevel - 1];
  if (previousStory && Boolean(progress.completedStories[previousStory.id])) {
    return true;
  }

  return false;
}

export function markStoryInProgress(
  progress: KidsLearningProgressPayload,
  storyId: string
): KidsLearningProgressPayload {
  const current = normalizeKidsProgressPayload(progress);
  if (current.completedStories[storyId]) {
    return current;
  }
  const filtered = current.inProgressStoryIds.filter((id) => id !== storyId);
  return {
    ...current,
    inProgressStoryIds: [storyId, ...filtered].slice(0, 12),
    lastUpdatedAt: new Date().toISOString()
  };
}

/**
 * Evaluates badges earned based on current progress.
 */
export function computeMilestoneBadges(
  progress: KidsLearningProgressPayload,
  allStories: ChildrenStory[] = CHILDREN_STORIES
): KidsBadgeRecord[] {
  const existingMap = new Map<string, KidsBadgeRecord>();
  for (const b of progress.badges) {
    existingMap.set(b.id, b);
  }

  const nowIso = new Date().toISOString();
  const completedIds = Object.keys(progress.completedStories);
  const completedCount = completedIds.length;
  const learnedWordCount = Object.keys(progress.learnedWords).length;
  const hasPerfectScore = Object.values(progress.completedStories).some(
    (c) => c.bestScorePercent === 100
  );

  const checkAndAdd = (
    id: string,
    condition: boolean,
    titleSomali: string,
    titleEnglish: string,
    description: string
  ) => {
    if (condition && !existingMap.has(id)) {
      existingMap.set(id, {
        id,
        titleSomali,
        titleEnglish,
        description,
        unlockedAt: nowIso
      });
    }
  };

  checkAndAdd(
    'sheekadii-ugu-horreysay',
    completedCount >= 1,
    'Sheekadii Ugu Horreysay',
    'First Story Completed',
    'Completed your very first Somali story and interactive lesson!'
  );

  checkAndAdd(
    'shanta-sheeko',
    completedCount >= 5,
    '5 Sheeko oo La Akhriyay',
    '5 Stories Read',
    'Completed 5 Somali stories across the library.'
  );

  checkAndAdd(
    'tobanka-sheeko',
    completedCount >= 10,
    '10 Sheeko oo La Dhammeeyay',
    '10 Stories Mastered',
    'Completed 10 Somali children’s stories and lessons.'
  );

  checkAndAdd(
    'dhibco-boqol',
    hasPerfectScore,
    '100% Xiddig Buuxda',
    '100% Perfect Quiz Score',
    'Answered every question in a Somali story lesson with 100% accuracy!'
  );

  checkAndAdd(
    'qaamuus-dhisme',
    learnedWordCount >= 12,
    'Qaamuus Dhisme (12+ Erey)',
    'Vocabulary Builder (12+ Words)',
    'Collected and practised 12 or more Somali vocabulary words.'
  );

  const level1Stories = allStories.filter((s) => s.levelId === 'level-1');
  const level2Stories = allStories.filter((s) => s.levelId === 'level-2');
  const level3Stories = allStories.filter((s) => s.levelId === 'level-3');

  checkAndAdd(
    'heerka-1-master',
    level1Stories.length > 0 && level1Stories.every((s) => Boolean(progress.completedStories[s.id])),
    'Xiddigga Heerka 1aad (Bilowga)',
    'Level 1 — Bilowga Champion',
    'Completed all 10 stories in Level 1 — Bilowga!'
  );

  checkAndAdd(
    'heerka-2-master',
    level2Stories.length > 0 && level2Stories.every((s) => Boolean(progress.completedStories[s.id])),
    'Xiddigga Heerka 2aad (Akhriste Yar)',
    'Level 2 — Young Reader Champion',
    'Completed all 10 stories in Level 2 — Akhriste Yar!'
  );

  checkAndAdd(
    'heerka-3-master',
    level3Stories.length > 0 && level3Stories.every((s) => Boolean(progress.completedStories[s.id])),
    'Xiddigga Heerka 3aad (Horumarsan)',
    'Level 3 — Advanced Reader Champion',
    'Completed all 10 stories in Level 3 — Akhriste Horumarsan!'
  );

  return Array.from(existingMap.values());
}

export interface LessonEvaluationSummary {
  storyId: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  starsEarned: number;
  xpEarned: number;
  newlyLearnedWords: KidsLearnedWordRecord[];
  gradedAnswers: KidsQuestionAnswerRecord[];
  updatedProgress: KidsLearningProgressPayload;
}

/**
 * Evaluates a completed lesson submission against the story's questions and updates
 * the `KidsLearningProgressPayload` immutably. Used by both client and server.
 */
export function evaluateLessonSubmissionAndUpdateProgress(
  story: ChildrenStory,
  submittedAnswers: Array<{
    questionId: string;
    userResponse: string | string[] | Record<string, string> | boolean;
  }>,
  currentProgress: KidsLearningProgressPayload
): LessonEvaluationSummary {
  const baseProgress = normalizeKidsProgressPayload(currentProgress);
  const nowIso = new Date().toISOString();

  const questionMap = new Map(story.lessonQuestions.map((q) => [q.id, q]));
  const gradedAnswers: KidsQuestionAnswerRecord[] = [];

  for (const sub of submittedAnswers) {
    const q = questionMap.get(sub.questionId);
    if (!q) continue;
    const { isCorrect } = gradeStoryLessonQuestion(q, sub.userResponse);
    gradedAnswers.push({
      questionId: q.id,
      questionType: q.type,
      userResponse: sub.userResponse,
      isCorrect,
      targetVocabularyWord: q.targetVocabularyWord
    });
  }

  const totalQuestions = Math.max(1, gradedAnswers.length);
  const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const starsEarned = scorePercent >= 90 ? 3 : scorePercent >= 65 ? 2 : 1;

  // Base XP from story reward scaled by accuracy + bonus for 100%
  const baseStoryXp = story.xpReward || 40;
  const xpEarned = Math.max(
    10,
    Math.round(baseStoryXp * (0.4 + 0.6 * (scorePercent / 100))) + (scorePercent === 100 ? 10 : 0)
  );

  // Update completedStories record
  const prevRecord: KidsStoryCompletionRecord | undefined = baseProgress.completedStories[story.id];
  const updatedStoryRecord: KidsStoryCompletionRecord = {
    storyId: story.id,
    completedAt: nowIso,
    bestScorePercent: prevRecord
      ? Math.max(prevRecord.bestScorePercent, scorePercent)
      : scorePercent,
    lastScorePercent: scorePercent,
    starsEarned: prevRecord ? Math.max(prevRecord.starsEarned, starsEarned) : starsEarned,
    xpEarned: (prevRecord ? prevRecord.xpEarned : 0) + xpEarned,
    attemptsCount: (prevRecord ? prevRecord.attemptsCount : 0) + 1,
    correctCount,
    totalQuestions
  };

  // Update learnedWords from story vocabulary
  const updatedLearnedWords: Record<string, KidsLearnedWordRecord> = {
    ...baseProgress.learnedWords
  };
  const newlyLearnedWords: KidsLearnedWordRecord[] = [];

  const missedVocabSet = new Set(
    gradedAnswers
      .filter((a) => !a.isCorrect && a.targetVocabularyWord)
      .map((a) => a.targetVocabularyWord!.toLowerCase())
  );

  for (const vocab of story.vocabulary) {
    const key = vocab.somaliWord.toLowerCase();
    const existing = updatedLearnedWords[key];
    const wasMissed = missedVocabSet.has(key);

    const record: KidsLearnedWordRecord = {
      somaliWord: vocab.somaliWord,
      englishMeaning: vocab.englishMeaning,
      pronunciationGuide: vocab.pronunciationGuide,
      storyId: story.id,
      pictureUrl: vocab.pictureUrl,
      masteryCount: (existing ? existing.masteryCount : 0) + (wasMissed ? 0 : 1),
      missedCount: (existing ? existing.missedCount : 0) + (wasMissed ? 1 : 0),
      lastPractisedAt: nowIso
    };
    if (!existing) {
      newlyLearnedWords.push(record);
    }
    updatedLearnedWords[key] = record;
  }

  // Update missedQuestions queue for Review Session
  const currentMissed = baseProgress.missedQuestions.filter(
    (m) =>
      !(
        m.storyId === story.id &&
        gradedAnswers.some((a) => a.questionId === m.questionId && a.isCorrect)
      )
  );

  for (const ans of gradedAnswers) {
    if (!ans.isCorrect) {
      const alreadyExists = currentMissed.some(
        (m) => m.storyId === story.id && m.questionId === ans.questionId
      );
      if (!alreadyExists) {
        currentMissed.unshift({
          storyId: story.id,
          questionId: ans.questionId,
          missedAt: nowIso
        });
      }
    }
  }

  const draftProgress: KidsLearningProgressPayload = {
    ...baseProgress,
    totalXp: baseProgress.totalXp + xpEarned,
    todayXp: baseProgress.todayXp + xpEarned,
    completedStories: {
      ...baseProgress.completedStories,
      [story.id]: updatedStoryRecord
    },
    inProgressStoryIds: baseProgress.inProgressStoryIds.filter((id) => id !== story.id),
    learnedWords: updatedLearnedWords,
    missedQuestions: currentMissed.slice(0, 30),
    lastUpdatedAt: nowIso
  };

  draftProgress.badges = computeMilestoneBadges(draftProgress);

  return {
    storyId: story.id,
    scorePercent,
    correctCount,
    totalQuestions,
    starsEarned,
    xpEarned,
    newlyLearnedWords,
    gradedAnswers,
    updatedProgress: draftProgress
  };
}

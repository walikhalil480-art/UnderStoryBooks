import React, { useEffect, useMemo, useState } from 'react';
import {
  ChildrenStory,
  KidsLearnedWordRecord,
  KidsLearningProgressPayload,
  StoryLessonQuestion
} from '../types';
import { gradeStoryLessonQuestion } from '../data/childrenStories';
import { folioApi } from '../services/api';
import {
  evaluateLessonSubmissionAndUpdateProgress,
  saveLocalKidsProgress
} from '../utils/kidsProgressManager';

interface StoryLessonPlayerProps {
  story: ChildrenStory;
  hasVerifiedAudio: boolean;
  onPlaySentenceAudio?: (sentenceIndex: number) => void;
  currentProgress: KidsLearningProgressPayload;
  onProgressUpdated: (updated: KidsLearningProgressPayload) => void;
  onReadAgain: () => void;
  onListenAgain: () => void;
  nextRecommendedStory?: ChildrenStory | null;
  onSelectNextStory?: (storyId: string) => void;
  customQuestionsOverride?: StoryLessonQuestion[];
  customLessonTitle?: string;
}

const QUESTION_TYPE_LABELS: Record<
  StoryLessonQuestion['type'],
  { somali: string; english: string }
> = {
  multiple_choice: {
    somali: 'Dooro Jawaabta Saxda ah',
    english: 'Multiple Choice'
  },
  vocabulary_picture: {
    somali: 'Sawirka & Ereyga',
    english: 'Vocabulary Picture Quiz'
  },
  fill_in_blank: {
    somali: 'Buuxi Meesha Bannaan',
    english: 'Fill in the Blank'
  },
  word_matching: {
    somali: 'Isku Xir Ereyada',
    english: 'Match Somali & English'
  },
  true_false: {
    somali: 'Run mise Been',
    english: 'True or False'
  },
  story_ordering: {
    somali: 'Isku Duba-rid Dhacdooyinka',
    english: 'Order Story Events'
  },
  complete_sentence: {
    somali: 'Dhammaystir Weedha',
    english: 'Complete the Sentence'
  },
  listen_and_choose: {
    somali: 'Dhageyso oo Dooro',
    english: 'Listen and Choose'
  }
};

export const StoryLessonPlayer: React.FC<StoryLessonPlayerProps> = ({
  story,
  hasVerifiedAudio,
  onPlaySentenceAudio,
  currentProgress,
  onProgressUpdated,
  onReadAgain,
  onListenAgain,
  nextRecommendedStory,
  onSelectNextStory,
  customQuestionsOverride,
  customLessonTitle
}) => {
  const baseQuestions = useMemo(() => {
    const source = customQuestionsOverride || story.lessonQuestions;
    // Enable listen_and_choose ONLY when verified/calibrated audio is available
    return source.filter((q) => !q.requiresAudio || hasVerifiedAudio);
  }, [customQuestionsOverride, story.lessonQuestions, hasVerifiedAudio]);

  const [activeQueue, setActiveQueue] = useState<StoryLessonQuestion[]>(baseQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRetryRound, setIsRetryRound] = useState<boolean>(false);

  // Per-question user response state (never pre-populated as correct)
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [selectedSomaliForMatch, setSelectedSomaliForMatch] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [orderedEventIds, setOrderedEventIds] = useState<string[]>([]);

  // Feedback state for the current question
  const [hasCheckedCurrent, setHasCheckedCurrent] = useState<boolean>(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean>(false);

  // Accumulated answers across the lesson run
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Array<{
      questionId: string;
      userResponse: string | string[] | Record<string, string> | boolean;
      isCorrect: boolean;
    }>
  >([]);

  // Final completion state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSubmittingToServer, setIsSubmittingToServer] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<{
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    starsEarned: number;
    xpEarned: number;
    newlyLearnedWords: KidsLearnedWordRecord[];
  } | null>(null);

  // Reset lesson when story or question set changes
  useEffect(() => {
    setActiveQueue(baseQuestions);
    setCurrentIndex(0);
    setIsRetryRound(false);
    setSubmittedAnswers([]);
    setIsCompleted(false);
    setFinalResult(null);
    resetQuestionInputs(baseQuestions[0]);
  }, [story.id, baseQuestions]);

  const currentQuestion: StoryLessonQuestion | undefined = activeQueue[currentIndex];

  // Deterministically shuffle English meanings for word_matching and events for story_ordering
  const shuffledEnglishMeanings = useMemo(() => {
    if (!currentQuestion || currentQuestion.type !== 'word_matching') return [];
    const pairs = currentQuestion.matchingPairs || [];
    // Rotate order deterministically so it's not 1-to-1 aligned with the left column
    return pairs.map((_, idx) => pairs[(idx + 1) % pairs.length].english);
  }, [currentQuestion]);

  function resetQuestionInputs(q?: StoryLessonQuestion) {
    setSelectedOption('');
    setTypedInput('');
    setSelectedSomaliForMatch(null);
    setMatchedPairs({});
    setHasCheckedCurrent(false);
    setIsCurrentCorrect(false);

    if (q?.type === 'story_ordering' && q.orderEvents) {
      // Present events in a rotated order so the child actively orders them
      const rotated = [...q.orderEvents];
      if (rotated.length >= 3) {
        setOrderedEventIds([rotated[1].id, rotated[2].id, rotated[0].id]);
      } else {
        setOrderedEventIds(rotated.map((e) => e.id));
      }
    } else {
      setOrderedEventIds([]);
    }
  }

  if (!currentQuestion && !isCompleted) {
    return null;
  }

  const getCurrentRawResponse = ():
    | string
    | string[]
    | Record<string, string>
    | boolean
    | null => {
    if (!currentQuestion) return null;
    switch (currentQuestion.type) {
      case 'multiple_choice':
      case 'vocabulary_picture':
      case 'true_false':
      case 'listen_and_choose':
        return selectedOption.trim() ? selectedOption : null;

      case 'fill_in_blank':
      case 'complete_sentence': {
        const answer = (typedInput.trim() || selectedOption.trim());
        return answer ? answer : null;
      }

      case 'word_matching': {
        const totalPairs = currentQuestion.matchingPairs?.length || 0;
        if (Object.keys(matchedPairs).length < totalPairs) return null;
        return matchedPairs;
      }

      case 'story_ordering': {
        if (orderedEventIds.length === 0) return null;
        return orderedEventIds;
      }

      default:
        return null;
    }
  };

  const canCheckAnswer = !hasCheckedCurrent && getCurrentRawResponse() !== null;

  const handleCheckAnswer = () => {
    if (!currentQuestion || hasCheckedCurrent) return;
    const rawResponse = getCurrentRawResponse();
    if (rawResponse === null) return;

    const { isCorrect } = gradeStoryLessonQuestion(currentQuestion, rawResponse);
    setHasCheckedCurrent(true);
    setIsCurrentCorrect(isCorrect);

    setSubmittedAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [
        ...filtered,
        {
          questionId: currentQuestion.id,
          userResponse: rawResponse,
          isCorrect
        }
      ];
    });
  };

  const handleContinue = async () => {
    if (currentIndex + 1 < activeQueue.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      resetQuestionInputs(activeQueue[nextIdx]);
      return;
    }

    // Completed all questions in activeQueue!
    setIsSubmittingToServer(true);
    try {
      // Evaluate locally first for instant accuracy and offline fallback
      const localEval = evaluateLessonSubmissionAndUpdateProgress(
        story,
        submittedAnswers.map((a) => ({
          questionId: a.questionId,
          userResponse: a.userResponse
        })),
        currentProgress
      );

      saveLocalKidsProgress(localEval.updatedProgress);
      onProgressUpdated(localEval.updatedProgress);

      setFinalResult({
        scorePercent: localEval.scorePercent,
        correctCount: localEval.correctCount,
        totalQuestions: localEval.totalQuestions,
        starsEarned: localEval.starsEarned,
        xpEarned: localEval.xpEarned,
        newlyLearnedWords: localEval.newlyLearnedWords
      });
      setIsCompleted(true);

      // Also submit to backend API for server-side validation and SQLite persistence
      const serverRes = await folioApi
        .submitStoryLesson(
          story.id,
          submittedAnswers.map((a) => ({
            questionId: a.questionId,
            userResponse: a.userResponse
          })),
          currentProgress
        )
        .catch(() => null);

      if (serverRes && serverRes.updatedProgress) {
        saveLocalKidsProgress(serverRes.updatedProgress);
        onProgressUpdated(serverRes.updatedProgress);
        setFinalResult({
          scorePercent: serverRes.scorePercent,
          correctCount: serverRes.correctCount,
          totalQuestions: serverRes.totalQuestions,
          starsEarned: serverRes.starsEarned,
          xpEarned: serverRes.xpEarned,
          newlyLearnedWords: serverRes.newlyLearnedWords
        });
      }
    } finally {
      setIsSubmittingToServer(false);
    }
  };

  const handleRetryMissedQuestions = () => {
    const missedIds = new Set(
      submittedAnswers.filter((a) => !a.isCorrect).map((a) => a.questionId)
    );
    const missedQuestions = baseQuestions.filter((q) => missedIds.has(q.id));
    if (missedQuestions.length === 0) return;

    setActiveQueue(missedQuestions);
    setCurrentIndex(0);
    setIsRetryRound(true);
    setIsCompleted(false);
    setFinalResult(null);
    resetQuestionInputs(missedQuestions[0]);
  };

  const handleRestartFullLesson = () => {
    setActiveQueue(baseQuestions);
    setCurrentIndex(0);
    setIsRetryRound(false);
    setSubmittedAnswers([]);
    setIsCompleted(false);
    setFinalResult(null);
    resetQuestionInputs(baseQuestions[0]);
  };

  const moveEventOrder = (index: number, direction: -1 | 1) => {
    if (hasCheckedCurrent) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedEventIds.length) return;
    const copy = [...orderedEventIds];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setOrderedEventIds(copy);
  };

  const handleMatchEnglishClick = (englishText: string) => {
    if (hasCheckedCurrent || !selectedSomaliForMatch) return;
    setMatchedPairs((prev) => ({
      ...prev,
      [selectedSomaliForMatch]: englishText
    }));
    setSelectedSomaliForMatch(null);
  };

  // ==========================================================================
  // RENDER: FINAL LESSON RESULTS SCREEN
  // ==========================================================================
  if (isCompleted && finalResult) {
    const missedCount = submittedAnswers.filter((a) => !a.isCorrect).length;

    return (
      <section
        className="kids-lesson-card kids-lesson-results"
        aria-label="Natiijada Casharka (Lesson Results)"
        data-testid="lesson-results-screen"
      >
        <div className="kids-lesson-results__header">
          <div className="kids-lesson-results__stars" aria-label={`${finalResult.starsEarned} out of 3 stars`}>
            {[1, 2, 3].map((starNum) => (
              <span
                key={starNum}
                className={`kids-star-badge ${
                  starNum <= finalResult.starsEarned ? 'is-earned' : 'is-empty'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="eyebrow">
            CASHARKII WAA DHAMMAADAY • LESSON COMPLETE
          </span>
          <h3 className="kids-lesson-results__title">
            Hambalyo! Waad dhammaysay casharka &ldquo;{customLessonTitle || story.title}&rdquo;
          </h3>
          <p className="kids-lesson-results__subtitle">
            {finalResult.scorePercent === 100
              ? 'Su’aalaha oo dhan si sax ah ayaad uga jawaabtay! (Perfect score — every question answered correctly!)'
              : 'Shaqo wanaagsan! Sii wad akhriska iyo barashada ereyada Af-Soomaaliga.'}
          </p>
        </div>

        <div className="kids-lesson-results__metrics" data-testid="lesson-results-metrics">
          <div className="kids-metric-box">
            <span className="kids-metric-box__label">Dhibcaha (Accuracy)</span>
            <strong className="kids-metric-box__value" data-testid="lesson-score-percent">
              {finalResult.scorePercent}%
            </strong>
            <span className="kids-metric-box__sub">
              {finalResult.correctCount} / {finalResult.totalQuestions} sax ah
            </span>
          </div>

          <div className="kids-metric-box">
            <span className="kids-metric-box__label">XP La Kasbaday (XP Earned)</span>
            <strong className="kids-metric-box__value kids-metric-box__value--gold" data-testid="lesson-xp-earned">
              +{finalResult.xpEarned} XP
            </strong>
            <span className="kids-metric-box__sub">
              Wadarta guud: {currentProgress.totalXp} XP
            </span>
          </div>

          <div className="kids-metric-box">
            <span className="kids-metric-box__label">Xiddigaha (Stars)</span>
            <strong className="kids-metric-box__value">
              {finalResult.starsEarned} / 3 ★
            </strong>
            <span className="kids-metric-box__sub">
              {finalResult.starsEarned === 3
                ? 'Heerka ugu sarreeya!'
                : 'Dib u isku day si aad 3 xiddig u hesho'}
            </span>
          </div>
        </div>

        {/* Vocabulary Words Practised in This Story */}
        <div className="kids-lesson-results__vocab">
          <h4>
            Ereyada La Bartay • Practised Somali Vocabulary ({story.vocabulary.length} erey)
          </h4>
          <div className="kids-results-vocab-grid">
            {story.vocabulary.map((v) => (
              <div key={v.id} className="kids-results-vocab-item">
                <img
                  src={v.pictureUrl}
                  alt={v.somaliWord}
                  className="kids-results-vocab-item__img"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/vocab-school_book.svg')) {
                      target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                    }
                  }}
                />
                <div>
                  <strong>{v.somaliWord}</strong>
                  <span className="kids-results-vocab-item__pron">
                    /{v.pronunciationGuide}/
                  </span>
                  <p>{v.englishMeaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="kids-lesson-results__actions">
          {missedCount > 0 && (
            <button
              type="button"
              className="button button--primary"
              onClick={handleRetryMissedQuestions}
              data-testid="retry-missed-questions-btn"
            >
              Dib ugu Noqo {missedCount} Su&apos;aalood oo Khaldamay (Retry Missed)
            </button>
          )}

          {nextRecommendedStory && onSelectNextStory && (
            <button
              type="button"
              className="button button--primary"
              onClick={() => onSelectNextStory(nextRecommendedStory.id)}
              data-testid="next-story-recommendation-btn"
            >
              Sheekada Xigta: {nextRecommendedStory.title} →
            </button>
          )}

          <button
            type="button"
            className="button button--secondary"
            onClick={onReadAgain}
            data-testid="lesson-read-again-btn"
          >
            Akhri Mar Kale (Read Again)
          </button>

          <button
            type="button"
            className="button button--secondary"
            onClick={onListenAgain}
            data-testid="lesson-listen-again-btn"
          >
            Dhageyso Mar Kale (Listen Again)
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={handleRestartFullLesson}
          >
            Ku Celi Su&apos;aalaha oo Dhan (Restart Quiz)
          </button>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // RENDER: ACTIVE INTERACTIVE QUESTION
  // ==========================================================================
  const progressPercent = Math.round(((currentIndex + 1) / activeQueue.length) * 100);
  const typeMeta = QUESTION_TYPE_LABELS[currentQuestion.type];

  return (
    <section
      className="kids-lesson-card"
      aria-label="Casharka Sheekada (Interactive Story Lesson)"
      data-testid="story-lesson-player"
    >
      {/* Top Progress Header */}
      <div className="kids-lesson-card__top">
        <div className="kids-lesson-card__meta">
          <span className="kids-lesson-badge">
            {isRetryRound
              ? 'Dib-u-Eegis (Retry Missed Questions)'
              : `${typeMeta.somali} • ${typeMeta.english}`}
          </span>
          <span className="kids-lesson-counter" data-testid="lesson-question-counter">
            Su&apos;aasha {currentIndex + 1} / {activeQueue.length} (Question {currentIndex + 1} of{' '}
            {activeQueue.length})
          </span>
        </div>

        <div
          className="kids-lesson-progress-track"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="kids-lesson-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="kids-lesson-prompt">
        <h3 className="kids-lesson-prompt__somali" data-testid="lesson-prompt-somali">
          {currentQuestion.promptSomali}
        </h3>
        <p className="kids-lesson-prompt__english">{currentQuestion.promptEnglish}</p>
      </div>

      {/* Question Body by Type */}
      <div className="kids-lesson-body" data-question-type={currentQuestion.type}>
        {/* TYPE E: Vocabulary Picture Illustration */}
        {currentQuestion.type === 'vocabulary_picture' && currentQuestion.pictureUrl && (
          <div className="kids-lesson-picture-frame">
            <img
              src={currentQuestion.pictureUrl}
              alt={currentQuestion.pictureAlt || currentQuestion.promptEnglish}
              className="kids-lesson-picture-frame__img"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/vocab-school_book.svg')) {
                  target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                }
              }}
            />
          </div>
        )}

        {/* TYPE G: Listen and Choose Audio Trigger */}
        {currentQuestion.type === 'listen_and_choose' && (
          <div className="kids-lesson-audio-box">
            <button
              type="button"
              className="button button--primary"
              onClick={() =>
                onPlaySentenceAudio &&
                onPlaySentenceAudio(currentQuestion.audioSentenceIndex ?? 0)
              }
            >
              🔊 Dhageyso Weedha Af-Soomaaliga (Play Spoken Somali Audio)
            </button>
            {currentQuestion.audioSpokenTextSomali && (
              <p className="kids-lesson-audio-box__hint">
                Weedha: &ldquo;{currentQuestion.audioSpokenTextSomali}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* TYPE B & TYPE H: Sentence Template with Blank */}
        {(currentQuestion.type === 'fill_in_blank' ||
          currentQuestion.type === 'complete_sentence') &&
          currentQuestion.sentenceTemplate && (
            <div className="kids-lesson-blank-template" data-testid="lesson-blank-template">
              <p className="kids-lesson-blank-template__text">
                {currentQuestion.sentenceTemplate.split('_____').map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{part}</span>
                    {idx < arr.length - 1 && (
                      <span className="kids-lesson-blank-slot">
                        {typedInput.trim() || selectedOption || '_____'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
              {currentQuestion.allowTyping && (
                <div className="kids-lesson-typing-row">
                  <label htmlFor={`typing-${currentQuestion.id}`}>
                    Qor ereyga Af-Soomaaliga ah (ama ka dooro hoos):
                  </label>
                  <input
                    id={`typing-${currentQuestion.id}`}
                    type="text"
                    className="kids-lesson-typing-input"
                    placeholder="Ku qor jawaabta halkan..."
                    value={typedInput}
                    disabled={hasCheckedCurrent}
                    onChange={(e) => {
                      setTypedInput(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedOption('');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}

        {/* OPTIONS LIST: Used by multiple_choice, vocabulary_picture, fill_in_blank, true_false, complete_sentence, listen_and_choose */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="kids-lesson-options-grid" role="radiogroup">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt && !typedInput.trim();
              const isCorrectOption =
                hasCheckedCurrent &&
                gradeStoryLessonQuestion(currentQuestion, opt).isCorrect;
              const isWrongSelected =
                hasCheckedCurrent && isSelected && !isCorrectOption;

              return (
                <button
                  key={`${currentQuestion.id}-opt-${idx}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={hasCheckedCurrent}
                  data-testid={`lesson-option-${idx}`}
                  className={`kids-lesson-option-btn ${
                    isSelected ? 'is-selected' : ''
                  } ${isCorrectOption ? 'is-correct' : ''} ${
                    isWrongSelected ? 'is-incorrect' : ''
                  }`}
                  onClick={() => {
                    if (hasCheckedCurrent) return;
                    setTypedInput('');
                    setSelectedOption(opt);
                  }}
                >
                  <span className="kids-lesson-option-btn__num">{idx + 1}</span>
                  <span className="kids-lesson-option-btn__label">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* TYPE C: Word Matching (Somali <-> English) */}
        {currentQuestion.type === 'word_matching' && currentQuestion.matchingPairs && (
          <div className="kids-matching-board" data-testid="lesson-matching-board">
            <p className="kids-matching-board__instructions">
              1. Guji ereyga Af-Soomaaliga (bidix) → 2. Guji macnihiisa Ingiriisiga (midig).
            </p>
            <div className="kids-matching-columns">
              <div className="kids-matching-col">
                <span className="kids-matching-col__header">Af-Soomaali</span>
                {currentQuestion.matchingPairs.map((pair) => {
                  const isActive = selectedSomaliForMatch === pair.somali;
                  const pairedEnglish = matchedPairs[pair.somali];
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      disabled={hasCheckedCurrent}
                      className={`kids-match-card ${isActive ? 'is-active' : ''} ${
                        pairedEnglish ? 'is-paired' : ''
                      }`}
                      onClick={() => setSelectedSomaliForMatch(pair.somali)}
                    >
                      <strong>{pair.somali}</strong>
                      {pairedEnglish && (
                        <span className="kids-match-card__tag">↔ {pairedEnglish}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="kids-matching-col">
                <span className="kids-matching-col__header">English Meaning</span>
                {shuffledEnglishMeanings.map((eng) => {
                  const matchedSomali = Object.entries(matchedPairs).find(
                    ([, val]) => val === eng
                  )?.[0];
                  return (
                    <button
                      key={eng}
                      type="button"
                      disabled={hasCheckedCurrent}
                      className={`kids-match-card ${matchedSomali ? 'is-paired' : ''}`}
                      onClick={() => handleMatchEnglishClick(eng)}
                    >
                      <span>{eng}</span>
                      {matchedSomali && (
                        <span className="kids-match-card__tag">↔ {matchedSomali}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {!hasCheckedCurrent && Object.keys(matchedPairs).length > 0 && (
              <button
                type="button"
                className="button button--ghost button--sm"
                onClick={() => {
                  setMatchedPairs({});
                  setSelectedSomaliForMatch(null);
                }}
              >
                Dib u Bilow Isku-xirka (Reset Matches)
              </button>
            )}
          </div>
        )}

        {/* TYPE D: Story Event Ordering */}
        {currentQuestion.type === 'story_ordering' && currentQuestion.orderEvents && (
          <div className="kids-ordering-list" data-testid="lesson-ordering-list">
            {orderedEventIds.map((eventId, positionIdx) => {
              const eventObj = currentQuestion.orderEvents!.find((e) => e.id === eventId);
              if (!eventObj) return null;
              return (
                <div key={eventObj.id} className="kids-ordering-item">
                  <div className="kids-ordering-item__badge">
                    Tallaabada {positionIdx + 1}aad
                  </div>
                  <div className="kids-ordering-item__content">
                    <p className="kids-ordering-item__somali">{eventObj.somaliEvent}</p>
                    <p className="kids-ordering-item__english">{eventObj.englishHint}</p>
                  </div>
                  <div className="kids-ordering-item__controls">
                    <button
                      type="button"
                      className="button button--secondary button--sm"
                      disabled={hasCheckedCurrent || positionIdx === 0}
                      aria-label={`Kor u qaad dhacdada ${positionIdx + 1}`}
                      onClick={() => moveEventOrder(positionIdx, -1)}
                    >
                      ↑ Kor (Up)
                    </button>
                    <button
                      type="button"
                      className="button button--secondary button--sm"
                      disabled={
                        hasCheckedCurrent || positionIdx === orderedEventIds.length - 1
                      }
                      aria-label={`Hoos u dhig dhacdada ${positionIdx + 1}`}
                      onClick={() => moveEventOrder(positionIdx, 1)}
                    >
                      ↓ Hoos (Down)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Immediate Feedback Banner after Check Answer */}
      {hasCheckedCurrent && (
        <div
          className={`kids-lesson-feedback ${
            isCurrentCorrect
              ? 'kids-lesson-feedback--correct'
              : 'kids-lesson-feedback--incorrect'
          }`}
          role="status"
          data-testid="lesson-feedback-banner"
        >
          <div className="kids-lesson-feedback__header">
            <strong>
              {isCurrentCorrect
                ? '✓ Sax! Aad baad u fiican tahay! (Correct!)'
                : '✗ Isku day wanaagsan! Fiiri jawaabta saxda ah: (Not quite — let’s learn!)'}
            </strong>
          </div>
          <p className="kids-lesson-feedback__somali">
            {currentQuestion.explanationSomali}
          </p>
          <p className="kids-lesson-feedback__english">
            {currentQuestion.explanationEnglish}
          </p>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="kids-lesson-footer">
        {!hasCheckedCurrent ? (
          <button
            type="button"
            className="button button--primary"
            disabled={!canCheckAnswer}
            onClick={handleCheckAnswer}
            data-testid="lesson-check-answer-btn"
          >
            Hubi Jawaabta (Check Answer)
          </button>
        ) : (
          <button
            type="button"
            className="button button--primary"
            disabled={isSubmittingToServer}
            onClick={handleContinue}
            data-testid="lesson-continue-btn"
          >
            {isSubmittingToServer
              ? 'Waa la keydinayaa...'
              : currentIndex + 1 < activeQueue.length
              ? 'Sii Wad → (Continue)'
              : 'Dhammaystir Casharka ★ (Finish Lesson)'}
          </button>
        )}
      </div>
    </section>
  );
};

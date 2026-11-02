import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  Languages,
  Sparkles,
  Upload,
  FileAudio,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import {
  ChildrenStory,
  KidsLearningProgressPayload,
  StoryAlignmentFilePayload,
  StoryLanguageCode,
  StoryPlaybackSpeed,
  StorySentence,
  StoryWordToken
} from '../types';
import {
  applyVerifiedAlignmentToStory,
  findActiveWordAndSentenceAtTime,
  getPhraseWindowForWord,
  PhraseReplayWindow
} from '../data/childrenStories';
import { StoryLessonPlayer } from './StoryLessonPlayer';
import { createInitialKidsProgress } from '../utils/kidsProgressManager';

export interface StoryAudioReaderProps {
  story: ChildrenStory;
  onStoryUpdated?: (updatedStory: ChildrenStory) => void;
  onLoadCalibrationFixture?: (storyId: string, lang: StoryLanguageCode) => Promise<void>;
  onResetCalibrationFixture?: (storyId: string, lang: StoryLanguageCode) => Promise<void>;
  isCalibrationMode?: boolean;
  currentProgress?: KidsLearningProgressPayload;
  onProgressUpdated?: (updated: KidsLearningProgressPayload) => void;
  nextRecommendedStory?: ChildrenStory | null;
  onSelectNextStory?: (storyId: string) => void;
}

type StoryTextSize = 'standard' | 'large' | 'xlarge';

interface ChildReaderPreferences {
  showEnglishTranslation: boolean;
  textSize: StoryTextSize;
  autoScrollActiveWord: boolean;
}

const CHILD_PREFS_STORAGE_KEY = 'folio_child_reader_prefs_v2';

const DEFAULT_CHILD_PREFS: ChildReaderPreferences = {
  showEnglishTranslation: false,
  textSize: 'large',
  autoScrollActiveWord: true
};

function formatAudioTime(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const totalSec = Math.floor(seconds);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Custom Editorial SVG Illustration for "Geelkii yaraa" (The Little Camel)
 * Uses solid, warm editorial heritage colors (zero gradients) matching the Folio palette.
 */
const LittleCamelEditorialIllustration: React.FC<{
  storyId: string;
  activeSentenceIndex: number;
  sceneCaption?: string;
}> = ({ storyId, activeSentenceIndex, sceneCaption }) => {
  const isEveningScene = storyId === 'geelkii-yaraa' && activeSentenceIndex >= 9;
  const isWellScene = storyId === 'geelkii-yaraa' && activeSentenceIndex === 8;

  return (
    <div className="story-illustration-canvas-wrap">
      <svg
        viewBox="0 0 860 400"
        className="story-editorial-svg"
        role="img"
        aria-label={
          storyId === 'geelkii-yaraa'
            ? 'Editorial storybook illustration of Dalmar the little camel walking with his mother beneath an umbrella thorn acacia tree in the Somali countryside'
            : 'Editorial storybook illustration of a songbird perched on an acacia branch during the spring rain in the Somali savannah'
        }
      >
        {/* Sky Background (Warm Sunlit Ivory or Quiet Starry Evening) */}
        <rect
          x="0"
          y="0"
          width="860"
          height="400"
          fill={isEveningScene ? '#252622' : '#F4EFE6'}
        />

        {/* Sun or Stars */}
        {isEveningScene ? (
          <g fill="#E7E1D7">
            <circle cx="140" cy="70" r="3" />
            <circle cx="240" cy="48" r="2.5" />
            <circle cx="390" cy="82" r="3" />
            <circle cx="520" cy="55" r="2" />
            <circle cx="670" cy="75" r="3.5" />
            <circle cx="760" cy="45" r="2.5" />
            {/* Crescent Moon */}
            <circle cx="700" cy="95" r="28" fill="#A58A58" />
            <circle cx="712" cy="88" r="24" fill="#252622" />
          </g>
        ) : (
          <circle cx="710" cy="88" r="42" fill="#D9A05B" />
        )}

        {/* Distant Green Hills (Buurta Cagaaran) */}
        <path
          d="M0 285 Q180 220 370 275 T760 250 L860 265 L860 400 L0 400 Z"
          fill={isEveningScene ? '#2E3B33' : '#C9D1C5'}
        />

        {/* Warm Red-Sand Savannah Dunes (Ciidda Cas ee Miyiga) */}
        <path
          d="M0 305 Q260 268 530 300 T860 288 L860 400 L0 400 Z"
          fill={isEveningScene ? '#3D352E' : '#E2CBB0'}
        />
        <rect
          x="0"
          y="335"
          width="860"
          height="65"
          fill={isEveningScene ? '#332C26' : '#D4B595'}
        />

        {/* Oasis Water Well (Ceelka Biyaha Macaan) */}
        <ellipse
          cx="715"
          cy="342"
          rx={isWellScene ? '95' : '68'}
          ry={isWellScene ? '22' : '16'}
          fill="#344C3D"
        />
        <ellipse
          cx="715"
          cy="342"
          rx={isWellScene ? '76' : '52'}
          ry={isWellScene ? '14' : '10'}
          fill="#5B8274"
        />

        {/* Umbrella Thorn Acacia Tree (Geedka Quraca) */}
        <g transform="translate(95, 115)">
          {/* Trunk & Branches */}
          <path
            d="M85 215 L85 125 L42 70 M85 135 L132 72 M85 115 L88 65"
            stroke="#5C4738"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Flat Acacia Canopy Layers */}
          <ellipse cx="88" cy="62" rx="98" ry="22" fill="#344C3D" />
          <ellipse cx="52" cy="72" rx="58" ry="15" fill="#43614E" />
          <ellipse cx="128" cy="70" rx="62" ry="15" fill="#43614E" />

          {/* Little Singing Bird on Top of the Acacia (Shimbir Yar) */}
          <g transform="translate(118, 36)">
            <ellipse cx="12" cy="12" rx="11" ry="8" fill="#B66E50" />
            <circle cx="21" cy="8" r="6" fill="#B66E50" />
            <polygon points="27,7 34,9 27,11" fill="#D9A05B" />
            <circle cx="22" cy="7" r="1.5" fill="#FFFFFF" />
          </g>
        </g>

        {storyId === 'geelkii-yaraa' ? (
          <>
            {/* Mother She-Camel (Hooyadiis — Hal Weyn oo Xasilloon) */}
            <g transform="translate(310, 148)">
              {/* Legs */}
              <line x1="42" y1="115" x2="38" y2="195" stroke="#8C6239" strokeWidth="10" strokeLinecap="round" />
              <line x1="65" y1="115" x2="68" y2="195" stroke="#75502D" strokeWidth="9" strokeLinecap="round" />
              <line x1="122" y1="115" x2="118" y2="195" stroke="#8C6239" strokeWidth="10" strokeLinecap="round" />
              <line x1="142" y1="115" x2="148" y2="195" stroke="#75502D" strokeWidth="9" strokeLinecap="round" />
              {/* Body & Single Dromedary Hump */}
              <ellipse cx="92" cy="102" rx="64" ry="34" fill="#9E7044" />
              <ellipse cx="86" cy="64" rx="34" ry="26" fill="#9E7044" />
              {/* Tail */}
              <path d="M28 96 Q14 115 18 142" stroke="#75502D" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Long Curved Neck */}
              <path
                d="M142 98 Q172 92 176 34"
                stroke="#9E7044"
                strokeWidth="22"
                fill="none"
                strokeLinecap="round"
              />
              {/* Head & Ears */}
              <ellipse cx="186" cy="28" rx="22" ry="13" fill="#9E7044" />
              <circle cx="172" cy="14" r="5" fill="#75502D" />
              <circle cx="190" cy="25" r="3" fill="#252622" />
            </g>

            {/* Little Camel "Dalmar" (Geelkii Yaraa) */}
            <g transform="translate(515, 204)">
              {/* Long Playful Legs */}
              <line x1="28" y1="74" x2="22" y2="138" stroke="#B68452" strokeWidth="8" strokeLinecap="round" />
              <line x1="44" y1="74" x2="48" y2="138" stroke="#9E7044" strokeWidth="7" strokeLinecap="round" />
              <line x1="82" y1="74" x2="78" y2="138" stroke="#B68452" strokeWidth="8" strokeLinecap="round" />
              <line x1="96" y1="74" x2="104" y2="138" stroke="#9E7044" strokeWidth="7" strokeLinecap="round" />
              {/* Soft Golden-Brown Coat & Little Hump */}
              <ellipse cx="62" cy="64" rx="42" ry="23" fill="#C69461" />
              <ellipse cx="58" cy="40" rx="22" ry="17" fill="#C69461" />
              {/* Tail */}
              <path d="M21 62 Q10 75 13 94" stroke="#8C6239" strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Neck */}
              <path
                d="M95 62 Q116 55 120 18"
                stroke="#C69461"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
              />
              {/* Head & Curious Big Eyes */}
              <ellipse cx="128" cy="14" rx="16" ry="10" fill="#C69461" />
              <circle cx="118" cy="4" r="4" fill="#9E7044" />
              <circle cx="132" cy="12" r="3" fill="#252622" />
              <circle cx="133" cy="11" r="1" fill="#FFFFFF" />
            </g>
          </>
        ) : (
          /* Companion Bird & Spring Rain Illustration */
          <g transform="translate(420, 150)">
            <line x1="20" y1="20" x2="12" y2="52" stroke="#5B8274" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="10" x2="72" y2="42" stroke="#5B8274" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="25" x2="132" y2="57" stroke="#5B8274" strokeWidth="3" strokeLinecap="round" />
            <line x1="200" y1="14" x2="192" y2="46" stroke="#5B8274" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {sceneCaption && (
        <div className="story-scene-caption-bar">
          <span className="story-scene-badge">
            Muuqaalka {activeSentenceIndex + 1} / Scene {activeSentenceIndex + 1}
          </span>
          <span className="story-scene-caption-text">{sceneCaption}</span>
        </div>
      )}
    </div>
  );
};

export const StoryAudioReader: React.FC<StoryAudioReaderProps> = ({
  story,
  onStoryUpdated,
  onLoadCalibrationFixture,
  onResetCalibrationFixture,
  isCalibrationMode = false,
  currentProgress,
  onProgressUpdated,
  nextRecommendedStory,
  onSelectNextStory
}) => {
  const sentencesSectionRef = useRef<HTMLDivElement | null>(null);
  const lessonSectionRef = useRef<HTMLDivElement | null>(null);
  // Active narration language ('so' primary, 'en' secondary supported by data model)
  const [selectedLang, setSelectedLang] = useState<StoryLanguageCode>(
    story.defaultNarrationLanguage || 'so'
  );

  // Parent-managed reading settings
  const [prefs, setPrefs] = useState<ChildReaderPreferences>(() => {
    try {
      const raw = localStorage.getItem(CHILD_PREFS_STORAGE_KEY);
      return raw ? { ...DEFAULT_CHILD_PREFS, ...JSON.parse(raw) } : DEFAULT_CHILD_PREFS;
    } catch {
      return DEFAULT_CHILD_PREFS;
    }
  });

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<StoryPlaybackSpeed>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [repeatCurrentSentence, setRepeatCurrentSentence] = useState<boolean>(false);

  // Synchronized active sentence and word highlight state
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  // Interactive child word selection & phrase replay state
  const [selectedWord, setSelectedWord] = useState<StoryWordToken | null>(null);
  const [selectedPhraseWindow, setSelectedPhraseWindow] = useState<PhraseReplayWindow | null>(null);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');

  // Parent & Educator Audio Management Drawer State
  const [showParentDrawer, setShowParentDrawer] = useState<boolean>(false);
  const [parentGateUnlocked, setParentGateUnlocked] = useState<boolean>(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
  const [simulatedBrokenAudioUrl, setSimulatedBrokenAudioUrl] = useState<string | null>(null);

  // Refs for zero-re-render high-frequency time tracking & DOM scroll management
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastActiveWordIdRef = useRef<string | null>(null);
  const lastActiveSentenceIdxRef = useRef<number>(0);
  const phraseEndStopTimeRef = useRef<number | null>(null);
  const wordElementsMapRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const readerContainerRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = story.narrationTracks[selectedLang] || story.narrationTracks.so;
  const effectiveAudioUrl = simulatedBrokenAudioUrl || currentTrack.audioUrl;

  const hasVerifiedWordTimestamps = useMemo(() => {
    return story.sentences.some((s) =>
      s.words.some((w) => typeof w.startTime === 'number' && typeof w.endTime === 'number')
    );
  }, [story.sentences]);

  const isAudioReadyForPlayback = Boolean(
    effectiveAudioUrl && hasVerifiedWordTimestamps && !audioError
  );

  // Persist parent-managed preferences locally (no child PII or third-party tracking)
  useEffect(() => {
    try {
      localStorage.setItem(CHILD_PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage errors
    }
  }, [prefs]);

  // Reset playback state when switching story or language
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(currentTrack.durationSeconds || 0);
    setAudioError(null);
    setSimulatedBrokenAudioUrl(null);
    setActiveSentenceIndex(0);
    setActiveWordId(null);
    setSelectedWord(null);
    setSelectedPhraseWindow(null);
    lastActiveWordIdRef.current = null;
    lastActiveSentenceIdxRef.current = 0;
    phraseEndStopTimeRef.current = null;
  }, [story.id, selectedLang, currentTrack.audioUrl, currentTrack.durationSeconds]);

  // Scroll the active word into view ONLY when it falls outside the comfortable viewport zone
  const scrollWordIntoViewIfNeeded = useCallback(
    (wordId: string) => {
      if (!prefs.autoScrollActiveWord) return;
      const el = wordElementsMapRef.current.get(wordId);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const topMargin = 140;
      const bottomMargin = viewportHeight - 160;

      if (rect.top < topMargin || rect.bottom > bottomMargin) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    },
    [prefs.autoScrollActiveWord]
  );

  /**
   * Core synchronization updater: maps audioElement.currentTime -> activeWordId & activeSentenceIndex.
   * Updates React state ONLY when the active word or sentence actually changes.
   */
  const syncHighlightWithPlaybackTime = useCallback(
    (timeSec: number) => {
      const audioEl = audioRef.current;

      // 1. Check if we are replaying a specific phrase window and reached its endTime
      if (
        phraseEndStopTimeRef.current !== null &&
        timeSec >= phraseEndStopTimeRef.current
      ) {
        phraseEndStopTimeRef.current = null;
        if (audioEl && !audioEl.paused) {
          audioEl.pause();
        }
        return;
      }

      // 2. Check if Repeat Current Sentence loop is active and playback reached the end of the current sentence
      if (repeatCurrentSentence && audioEl && !audioEl.paused) {
        const currentSent = story.sentences[lastActiveSentenceIdxRef.current];
        if (
          currentSent &&
          currentSent.startTime !== null &&
          currentSent.endTime !== null &&
          timeSec >= currentSent.endTime - 0.02
        ) {
          audioEl.currentTime = currentSent.startTime;
          timeSec = currentSent.startTime;
        }
      }

      // 3. Determine active word & sentence from measured word timestamps
      const { activeSentenceIndex: nextSentenceIdx, activeWordId: nextWordId } =
        findActiveWordAndSentenceAtTime(story.sentences, timeSec);

      if (nextSentenceIdx !== lastActiveSentenceIdxRef.current) {
        lastActiveSentenceIdxRef.current = nextSentenceIdx;
        setActiveSentenceIndex(nextSentenceIdx);
      }

      if (nextWordId !== lastActiveWordIdRef.current) {
        lastActiveWordIdRef.current = nextWordId;
        setActiveWordId(nextWordId);
        if (nextWordId) {
          scrollWordIntoViewIfNeeded(nextWordId);
        }
      }
    },
    [repeatCurrentSentence, scrollWordIntoViewIfNeeded, story.sentences]
  );

  // High-precision requestAnimationFrame loop while audio is actively playing
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = () => {
      const audioEl = audioRef.current;
      if (audioEl && !audioEl.paused) {
        const nowTime = audioEl.currentTime;
        setCurrentTime(nowTime);
        syncHighlightWithPlaybackTime(nowTime);
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, syncHighlightWithPlaybackTime]);

  // Keep HTMLAudioElement playbackRate and muted properties synchronized
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Playback control handlers
  const handleTogglePlayPause = async () => {
    const audioEl = audioRef.current;
    if (!effectiveAudioUrl || !audioEl) {
      setStatusAnnouncement(
        'Somali audio narration is not yet installed. Use the Parent and Educator Audio Setup drawer to add the studio recording.'
      );
      return;
    }

    phraseEndStopTimeRef.current = null;

    if (audioEl.paused) {
      try {
        setAudioError(null);
        audioEl.playbackRate = playbackSpeed;
        await audioEl.play();
      } catch (err: any) {
        setIsPlaying(false);
        setAudioError(
          err?.message ||
            'Unable to play the story audio file. Please verify the recording exists and is in a supported audio format.'
        );
      }
    } else {
      audioEl.pause();
    }
  };

  const handleRestart = () => {
    phraseEndStopTimeRef.current = null;
    setSelectedWord(null);
    setSelectedPhraseWindow(null);

    const audioEl = audioRef.current;
    if (audioEl && effectiveAudioUrl) {
      audioEl.currentTime = 0;
      setCurrentTime(0);
      syncHighlightWithPlaybackTime(0);
    } else {
      lastActiveSentenceIdxRef.current = 0;
      lastActiveWordIdRef.current = null;
      setActiveSentenceIndex(0);
      setActiveWordId(null);
      setCurrentTime(0);
    }
    setStatusAnnouncement('Story restarted from sentence 1.');
  };

  const handleSeekSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (!Number.isFinite(targetTime)) return;
    phraseEndStopTimeRef.current = null;
    setCurrentTime(targetTime);

    if (audioRef.current && effectiveAudioUrl) {
      audioRef.current.currentTime = targetTime;
    }
    syncHighlightWithPlaybackTime(targetTime);
  };

  const handleJumpToSentence = async (targetSentenceIndex: number, autoPlaySentence = false) => {
    const clampedIdx = Math.max(
      0,
      Math.min(story.sentences.length - 1, targetSentenceIndex)
    );
    const targetSentence = story.sentences[clampedIdx];
    phraseEndStopTimeRef.current = null;

    lastActiveSentenceIdxRef.current = clampedIdx;
    setActiveSentenceIndex(clampedIdx);

    if (targetSentence.startTime !== null && audioRef.current && effectiveAudioUrl) {
      const startSec = targetSentence.startTime;
      audioRef.current.currentTime = startSec;
      setCurrentTime(startSec);
      syncHighlightWithPlaybackTime(startSec);

      if (autoPlaySentence && audioRef.current.paused) {
        try {
          audioRef.current.playbackRate = playbackSpeed;
          await audioRef.current.play();
        } catch {
          // ignore autoplay block if any
        }
      }
    } else {
      const firstWord = targetSentence.words[0] || null;
      lastActiveWordIdRef.current = firstWord ? firstWord.id : null;
      setActiveWordId(firstWord ? firstWord.id : null);
      if (firstWord) {
        scrollWordIntoViewIfNeeded(firstWord.id);
      }
    }

    setStatusAnnouncement(
      `Sentence ${clampedIdx + 1} of ${story.sentences.length}: ${targetSentence.somaliText}`
    );
  };

  const handleReplayCurrentSentence = async () => {
    const currentSentence = story.sentences[activeSentenceIndex] || story.sentences[0];
    if (!currentSentence) return;

    if (currentSentence.startTime !== null && audioRef.current && effectiveAudioUrl) {
      phraseEndStopTimeRef.current = currentSentence.endTime;
      audioRef.current.currentTime = currentSentence.startTime;
      setCurrentTime(currentSentence.startTime);
      syncHighlightWithPlaybackTime(currentSentence.startTime);
      try {
        audioRef.current.playbackRate = playbackSpeed;
        await audioRef.current.play();
        setStatusAnnouncement(`Replaying sentence ${activeSentenceIndex + 1}.`);
      } catch (err: any) {
        setAudioError(err?.message || 'Unable to replay sentence audio.');
      }
    } else {
      handleJumpToSentence(activeSentenceIndex, false);
    }
  };

  const handleChangeSpeed = (newSpeed: StoryPlaybackSpeed) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
      syncHighlightWithPlaybackTime(audioRef.current.currentTime);
    }
    setStatusAnnouncement(`Playback speed set to ${newSpeed}x.`);
  };

  /**
   * When a child clicks/selects a word, highlight its phrase, show the bilingual
   * word helper card, and replay the associated phrase if verified audio is available.
   */
  const handleSelectWord = async (sentence: StorySentence, word: StoryWordToken) => {
    const phraseWin = getPhraseWindowForWord(sentence, word.tokenIndexInSentence);
    setSelectedWord(word);
    setSelectedPhraseWindow(phraseWin);
    lastActiveSentenceIdxRef.current = sentence.index;
    setActiveSentenceIndex(sentence.index);
    lastActiveWordIdRef.current = word.id;
    setActiveWordId(word.id);

    if (
      phraseWin.startTime !== null &&
      phraseWin.endTime !== null &&
      audioRef.current &&
      effectiveAudioUrl &&
      !audioError
    ) {
      phraseEndStopTimeRef.current = phraseWin.endTime;
      const seekStart = word.startTime !== null ? word.startTime : phraseWin.startTime;
      audioRef.current.currentTime = seekStart;
      setCurrentTime(seekStart);
      syncHighlightWithPlaybackTime(seekStart);

      try {
        audioRef.current.playbackRate = playbackSpeed;
        await audioRef.current.play();
      } catch {
        // If playback fails, still show the selected word and phrase
      }
    }

    setStatusAnnouncement(
      `Selected Somali word "${word.text}"${
        word.englishGloss ? ` meaning "${word.englishGloss}"` : ''
      } in phrase "${phraseWin.phraseText}".`
    );
  };

  const handleReplaySelectedPhrase = async () => {
    if (!selectedPhraseWindow) return;
    if (
      selectedPhraseWindow.startTime !== null &&
      selectedPhraseWindow.endTime !== null &&
      audioRef.current &&
      effectiveAudioUrl &&
      !audioError
    ) {
      phraseEndStopTimeRef.current = selectedPhraseWindow.endTime;
      audioRef.current.currentTime = selectedPhraseWindow.startTime;
      setCurrentTime(selectedPhraseWindow.startTime);
      syncHighlightWithPlaybackTime(selectedPhraseWindow.startTime);
      try {
        audioRef.current.playbackRate = playbackSpeed;
        await audioRef.current.play();
      } catch (err: any) {
        setAudioError(err?.message || 'Could not replay selected phrase.');
      }
    }
  };

  // Keyboard shortcuts on the reader region (Space = Play/Pause, Left/Right = Prev/Next Sentence, R = Repeat Sentence)
  const handleReaderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleJumpToSentence(activeSentenceIndex - 1, isPlaying);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleJumpToSentence(activeSentenceIndex + 1, isPlaying);
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      handleReplayCurrentSentence();
    }
  };

  // Educator local file loader (allows attaching a real Somali WAV/MP3 + reviewed alignment JSON directly)
  const handleLocalStudioUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatusMsg(null);
    setUploadErrorMsg(null);

    const form = e.currentTarget;
    const audioInput = form.elements.namedItem('studioAudioFile') as HTMLInputElement | null;
    const alignInput = form.elements.namedItem('studioAlignmentFile') as HTMLInputElement | null;

    const audioFile = audioInput?.files?.[0];
    const alignFile = alignInput?.files?.[0];

    if (!audioFile || !alignFile) {
      setUploadErrorMsg(
        'Please select both a recorded audio file (.wav or .mp3) and a reviewed forced-alignment JSON file (.json).'
      );
      return;
    }

    try {
      const alignText = await alignFile.text();
      const parsedAlignment = JSON.parse(alignText) as StoryAlignmentFilePayload;

      if (!Array.isArray(parsedAlignment.words) || parsedAlignment.words.length === 0) {
        setUploadErrorMsg('The alignment JSON must contain a non-empty "words" array with measured startTime/endTime.');
        return;
      }

      const blobUrl = URL.createObjectURL(audioFile);
      const updatedStory = applyVerifiedAlignmentToStory(
        story,
        {
          ...parsedAlignment,
          language: selectedLang,
          mimeType: audioFile.type || 'audio/wav',
          humanVerified: true,
          pronunciationEvaluated: true
        },
        blobUrl
      );

      if (onStoryUpdated) {
        onStoryUpdated(updatedStory);
      }
      setUploadStatusMsg(
        `Loaded "${audioFile.name}" and ${parsedAlignment.words.length} verified word timestamps.`
      );
    } catch (err: any) {
      setUploadErrorMsg(err?.message || 'Failed to parse alignment JSON file.');
    }
  };

  const activeSentence: StorySentence =
    story.sentences[activeSentenceIndex] || story.sentences[0];
  const effectiveDuration =
    duration > 0 ? duration : currentTrack.durationSeconds || 0;
  const progressPercent =
    effectiveDuration > 0
      ? Math.min(100, Math.round((currentTime / effectiveDuration) * 100))
      : story.sentences.length > 0
      ? Math.round(((activeSentenceIndex + 1) / story.sentences.length) * 100)
      : 0;

  return (
    <section
      ref={readerContainerRef}
      className={`story-audio-reader-card text-scale-${prefs.textSize}`}
      aria-label={`Somali Children's Story Audio Reader: ${story.title} (${story.englishTitle})`}
      onKeyDown={handleReaderKeyDown}
    >
      {/* Screen-Reader Live Polite Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusAnnouncement}
      </div>

      {/* Hidden HTML5 Audio Element (Never Autoplays on Load) */}
      <audio
        ref={audioRef}
        src={effectiveAudioUrl || undefined}
        preload="metadata"
        onLoadStart={() => {
          if (effectiveAudioUrl) {
            setIsLoadingAudio(true);
            setAudioError(null);
          }
        }}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          setIsLoadingAudio(false);
          setAudioError(null);
          if (Number.isFinite(el.duration) && el.duration > 0) {
            setDuration(el.duration);
          }
          el.playbackRate = playbackSpeed;
        }}
        onCanPlay={() => {
          setIsLoadingAudio(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setAudioError(null);
        }}
        onPause={() => {
          setIsPlaying(false);
          if (audioRef.current) {
            syncHighlightWithPlaybackTime(audioRef.current.currentTime);
          }
        }}
        onSeeked={(e) => {
          const now = e.currentTarget.currentTime;
          setCurrentTime(now);
          syncHighlightWithPlaybackTime(now);
        }}
        onTimeUpdate={(e) => {
          const now = e.currentTarget.currentTime;
          setCurrentTime(now);
          syncHighlightWithPlaybackTime(now);
        }}
        onRateChange={(e) => {
          syncHighlightWithPlaybackTime(e.currentTarget.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          phraseEndStopTimeRef.current = null;
          setActiveWordId(null);
          lastActiveWordIdRef.current = null;
          setStatusAnnouncement('Finished playing story narration.');
        }}
        onError={() => {
          setIsLoadingAudio(false);
          setIsPlaying(false);
          if (effectiveAudioUrl) {
            setAudioError(
              'The audio recording could not be loaded or played. Verify the audio file path or network connection, or continue reading the interactive bilingual text below.'
            );
          }
        }}
      />

      {/* 1. STORY HEADER: TITLE, BILINGUAL SUBTITLE, AGE RANGE & READING LEVEL */}
      <header className="story-reader-header">
        <div className="story-reader-title-block">
          <div className="story-badges-row">
            <span className="story-badge-level">{story.difficulty}</span>
            <span className="story-badge-age">{story.ageRange}</span>
            {story.categoryNameSomali && (
              <span className="story-badge-age">
                {story.categoryNameSomali} • {story.categoryNameEnglish}
              </span>
            )}
            {story.estimatedReadingMinutes && (
              <span className="story-badge-age">
                ⏱ {story.estimatedReadingMinutes} daqiiqo (min)
              </span>
            )}
            {story.xpReward && (
              <span className="story-badge-level">+{story.xpReward} XP</span>
            )}
            <span className="story-badge-lang">
              <Languages size={14} />
              {selectedLang === 'so' ? 'Af-Soomaali (Somali)' : 'English Narration'}
            </span>
            {isCalibrationMode && (
              <span className="story-badge-calibration">
                <Sparkles size={14} />
                Diagnostic Acoustic Sync Verification Mode
              </span>
            )}
          </div>

          <h2 className="story-main-title">
            <span lang="so">{story.title}</span>{' '}
            <span className="story-english-title">({story.englishTitle})</span>
          </h2>
          <p className="story-subtitle-text">{story.subtitle}</p>

          {/* Prominent Somali Child Action Bar (Section 8 Requirement) */}
          <div className="story-primary-cta-bar" role="group" aria-label="Hawlaha Sheekada (Story Actions)">
            <button
              type="button"
              className="button button--primary"
              data-testid="start-reading-cta-btn"
              onClick={() => {
                handleJumpToSentence(0, false);
                sentencesSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              <BookOpen size={16} />
              Bilow Akhriska (Start Reading)
            </button>

            <button
              type="button"
              className="button button--secondary"
              data-testid="listen-story-cta-btn"
              onClick={() => {
                if (effectiveAudioUrl && !isLoadingAudio) {
                  handleTogglePlayPause();
                } else {
                  setShowParentDrawer(true);
                }
              }}
            >
              <Volume2 size={16} />
              {effectiveAudioUrl
                ? isPlaying
                  ? 'Hakad Dhageysiga (Pause Audio)'
                  : 'Dhageyso Sheekada (Listen to Story)'
                : 'Dhageyso Sheekada (Audio Setup)'}
            </button>

            <button
              type="button"
              className="button button--secondary"
              data-testid="start-questions-cta-btn"
              onClick={() => {
                lessonSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              <Sparkles size={16} />
              Bilow Su&apos;aalaha (Start Questions • +{story.xpReward || 40} XP)
            </button>
          </div>
        </div>

        {/* Quick Reader Display Controls (Child & Parent Friendly) */}
        <div className="story-header-controls" role="group" aria-label="Reading Display Options">
          <button
            type="button"
            className={`story-toggle-pill ${prefs.showEnglishTranslation ? 'active' : ''}`}
            onClick={() =>
              setPrefs((prev) => ({
                ...prev,
                showEnglishTranslation: !prev.showEnglishTranslation
              }))
            }
            aria-pressed={prefs.showEnglishTranslation}
            data-testid="toggle-english-translation-btn"
          >
            <Languages size={15} />
            {prefs.showEnglishTranslation
              ? 'Qari Ingiriisiga (Hide English)'
              : 'Muuji Ingiriisiga (Show English)'}
          </button>

          <div className="story-font-size-group" role="group" aria-label="Somali Text Size">
            {(['standard', 'large', 'xlarge'] as StoryTextSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`story-size-btn ${prefs.textSize === sz ? 'active' : ''}`}
                onClick={() => setPrefs((prev) => ({ ...prev, textSize: sz }))}
                aria-pressed={prefs.textSize === sz}
                title={`Text size: ${sz}`}
              >
                {sz === 'standard' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`story-toggle-pill ${showParentDrawer ? 'active' : ''}`}
            onClick={() => setShowParentDrawer((prev) => !prev)}
            aria-expanded={showParentDrawer}
          >
            <Settings size={15} />
            Parent &amp; Audio Setup
          </button>
        </div>
      </header>

      {/* 2. LARGE STORY ILLUSTRATION PANEL */}
      <div className="story-illustration-stage">
        {story.id === 'geelkii-yaraa' || story.id === 'shimbirtii-iyo-roobka' ? (
          <LittleCamelEditorialIllustration
            storyId={story.id}
            activeSentenceIndex={activeSentenceIndex}
            sceneCaption={activeSentence?.sceneCaption}
          />
        ) : (
          <div className="story-illustration-canvas-wrap">
            <img
              src={
                story.sceneIllustrations?.[
                  Math.min(
                    story.sceneIllustrations.length - 1,
                    Math.floor(
                      (activeSentenceIndex / Math.max(1, story.sentences.length)) *
                        story.sceneIllustrations.length
                    )
                  )
                ]?.illustrationUrl || story.coverIllustrationUrl
              }
              alt={story.coverIllustrationAlt}
              className="story-editorial-svg"
            />
            {activeSentence?.sceneCaption && (
              <div className="story-scene-caption-bar">
                <span className="story-scene-badge">
                  Muuqaalka {activeSentenceIndex + 1} / Scene {activeSentenceIndex + 1}
                </span>
                <span className="story-scene-caption-text">
                  {activeSentence.sceneCaption}
                </span>
              </div>
            )}
          </div>
        )}

        <aside className="story-illustration-sidebar">
          <div className="story-photo-card">
            <img
              src={story.coverIllustrationUrl}
              alt={story.coverIllustrationAlt}
              className="story-cover-photo"
            />
            <div className="story-photo-caption">
              <strong>{story.title}</strong> — {story.somaliSummary}
            </div>
          </div>
        </aside>
      </div>

      {/* 3. AUDIO STATUS BANNER (UNAVAILABLE, ERROR, LOADING, OR VERIFIED READY) */}
      {audioError && (
        <div className="story-status-banner error" role="alert">
          <AlertCircle size={20} className="banner-icon" />
          <div className="banner-body">
            <strong>Audio Playback Failed</strong>
            <p>{audioError}</p>
          </div>
          <div className="banner-actions">
            <button
              type="button"
              className="btn-outline-solid btn-sm"
              onClick={() => {
                setSimulatedBrokenAudioUrl(null);
                setAudioError(null);
                if (audioRef.current && currentTrack.audioUrl) {
                  audioRef.current.load();
                }
              }}
            >
              <RefreshCw size={14} />
              Retry Audio
            </button>
          </div>
        </div>
      )}

      {!audioError && isLoadingAudio && (
        <div className="story-status-banner loading" role="status" aria-live="polite">
          <RefreshCw size={18} className="spin-icon" />
          <div className="banner-body">
            <strong>Loading Audio Narration &amp; Word Timestamps…</strong>
            <p>Preparing synchronized word-by-word highlighting for {story.title}.</p>
          </div>
        </div>
      )}

      {!audioError && !effectiveAudioUrl && (
        <div
          className="story-status-banner unavailable"
          role="status"
          data-testid="audio-unavailable-banner"
        >
          <Info size={20} className="banner-icon" />
          <div className="banner-body">
            <strong>
              Somali Audio Narration Unavailable — Pending Fluent Speaker Recording
            </strong>
            <p>{currentTrack.unavailableReason}</p>
            <p className="banner-subnote">
              Expected asset path: <code>{currentTrack.expectedAssetPath}</code> &amp;{' '}
              <code>{currentTrack.expectedAlignmentPath}</code>. Interactive sentence stepping and
              click-a-word bilingual definitions remain fully available below.
            </p>
          </div>
          <div className="banner-actions">
            <button
              type="button"
              className="btn-outline-solid btn-sm"
              onClick={() => setShowParentDrawer(true)}
            >
              <Upload size={14} />
              How to Add Audio / Test Sync
            </button>
          </div>
        </div>
      )}

      {!audioError && effectiveAudioUrl && hasVerifiedWordTimestamps && (
        <div
          className={`story-status-banner ${isCalibrationMode ? 'calibration' : 'verified'}`}
          role="status"
          data-testid="audio-ready-banner"
        >
          <CheckCircle2 size={20} className="banner-icon" />
          <div className="banner-body">
            <strong>
              {isCalibrationMode
                ? 'Diagnostic Acoustic Sync Track Active (Sample-Measured PCM Boundaries)'
                : `Synchronized ${currentTrack.languageLabel} Ready`}
            </strong>
            <p>
              {isCalibrationMode
                ? 'Testing HTML5 <audio> playback, word-level highlighting, sentence repeat, and 0.75×/1×/1.25× speed synchronization against exact sample-measured WAV timestamps. (Not a human Somali voice recording.)'
                : `Narrated by ${currentTrack.narratorName || 'Fluent Speaker'} • ${
                    currentTrack.alignmentMethod
                  } • Duration ${formatAudioTime(effectiveDuration)}`}
            </p>
          </div>
          {isCalibrationMode && onResetCalibrationFixture && (
            <div className="banner-actions">
              <button
                type="button"
                className="btn-outline-solid btn-sm"
                onClick={() => onResetCalibrationFixture(story.id, selectedLang)}
              >
                Exit Calibration Mode
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. AUDIO PLAYER CONTROL BAR */}
      <div
        className="story-audio-player-bar"
        role="region"
        aria-label="Story Audio Player Controls"
      >
        <div className="player-primary-controls">
          {/* Play / Pause */}
          <button
            type="button"
            className="player-btn-play"
            onClick={handleTogglePlayPause}
            disabled={!effectiveAudioUrl || isLoadingAudio}
            aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
            data-testid="player-play-pause-btn"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span>{isPlaying ? 'Hakad (Pause)' : 'Dhageyso (Play)'}</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            className="player-btn-icon"
            onClick={handleRestart}
            aria-label="Restart story from the beginning"
            title="Restart story (Bilowga)"
            data-testid="player-restart-btn"
          >
            <RotateCcw size={18} />
            <span className="btn-label-inline">Restart</span>
          </button>

          {/* Previous Sentence */}
          <button
            type="button"
            className="player-btn-icon"
            onClick={() => handleJumpToSentence(activeSentenceIndex - 1, isPlaying)}
            disabled={activeSentenceIndex <= 0}
            aria-label="Previous sentence"
            title="Previous sentence (Weedha hore)"
            data-testid="player-prev-sentence-btn"
          >
            <SkipBack size={18} />
            <span className="btn-label-inline">Prev Sentence</span>
          </button>

          {/* Next Sentence */}
          <button
            type="button"
            className="player-btn-icon"
            onClick={() => handleJumpToSentence(activeSentenceIndex + 1, isPlaying)}
            disabled={activeSentenceIndex >= story.sentences.length - 1}
            aria-label="Next sentence"
            title="Next sentence (Weedha xigta)"
            data-testid="player-next-sentence-btn"
          >
            <SkipForward size={18} />
            <span className="btn-label-inline">Next Sentence</span>
          </button>

          {/* Replay Current Sentence (One-shot) */}
          <button
            type="button"
            className="player-btn-icon"
            onClick={handleReplayCurrentSentence}
            aria-label="Replay current sentence now"
            title="Replay current sentence (Ku celi weedhan)"
            data-testid="player-replay-sentence-btn"
          >
            <RefreshCw size={17} />
            <span className="btn-label-inline">Replay Sentence</span>
          </button>

          {/* Loop Current Sentence Toggle */}
          <button
            type="button"
            className={`player-btn-icon ${repeatCurrentSentence ? 'active-loop' : ''}`}
            onClick={() => {
              setRepeatCurrentSentence((prev) => {
                const next = !prev;
                setStatusAnnouncement(
                  next
                    ? 'Repeat current sentence loop enabled.'
                    : 'Repeat current sentence loop disabled.'
                );
                return next;
              });
            }}
            aria-pressed={repeatCurrentSentence}
            aria-label="Toggle repeat current sentence loop"
            title="Loop current sentence continuously"
            data-testid="player-loop-sentence-btn"
          >
            <Repeat size={17} />
            <span className="btn-label-inline">
              {repeatCurrentSentence ? 'Looping Sentence' : 'Loop Sentence'}
            </span>
          </button>
        </div>

        {/* Progress & Seek Bar */}
        <div className="player-progress-row">
          <span className="player-time-label" data-testid="player-current-time">
            {formatAudioTime(currentTime)}
          </span>

          <div className="player-seek-wrap">
            <input
              type="range"
              min={0}
              max={effectiveDuration > 0 ? effectiveDuration : 100}
              step={0.05}
              value={effectiveDuration > 0 ? Math.min(currentTime, effectiveDuration) : 0}
              onChange={handleSeekSliderChange}
              disabled={!isAudioReadyForPlayback}
              className="player-seek-slider"
              aria-label="Audio playback progress seek slider"
              aria-valuemin={0}
              aria-valuemax={effectiveDuration > 0 ? effectiveDuration : 100}
              aria-valuenow={Number(currentTime.toFixed(1))}
              data-testid="player-seek-slider"
            />
          </div>

          <span className="player-time-label" data-testid="player-duration">
            {formatAudioTime(effectiveDuration)}
          </span>

          <span className="player-sentence-counter" data-testid="player-sentence-indicator">
            Weedha {activeSentenceIndex + 1} / {story.sentences.length} ({progressPercent}%)
          </span>
        </div>

        {/* Speed Selector (0.75x, 1x, 1.25x) & Mute */}
        <div className="player-secondary-controls">
          <div
            className="player-speed-group"
            role="group"
            aria-label="Narration Playback Speed"
          >
            <span className="speed-group-label">Xawaaraha (Speed):</span>
            {([0.75, 1, 1.25] as StoryPlaybackSpeed[]).map((spd) => (
              <button
                key={spd}
                type="button"
                className={`player-speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                onClick={() => handleChangeSpeed(spd)}
                aria-pressed={playbackSpeed === spd}
                aria-label={`Playback speed ${spd}x`}
                data-testid={`player-speed-${spd}`}
              >
                {spd}×
              </button>
            ))}
          </div>

          <button
            type="button"
            className="player-btn-mute"
            onClick={() => setIsMuted((prev) => !prev)}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-pressed={isMuted}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* 5. INTERACTIVE SELECTED WORD & PHRASE REPLAY BAR */}
      {selectedWord && selectedPhraseWindow && (
        <div
          className="story-word-explorer-bar"
          role="region"
          aria-label="Selected Somali Word and Phrase Helper"
          data-testid="selected-word-explorer"
        >
          <div className="word-explorer-main">
            <span className="word-explorer-kicker">Erayga la doortay • Selected Word:</span>
            <strong className="word-explorer-somali" lang="so">
              “{selectedWord.text}”
            </strong>
            {selectedWord.pronunciationGuide && (
              <span className="word-explorer-gloss">
                Ku dhawaaqidda (Pronunciation):{' '}
                <strong>/{selectedWord.pronunciationGuide}/</strong>
              </span>
            )}
            {selectedWord.englishGloss && (
              <span className="word-explorer-gloss">
                Meaning: <strong>{selectedWord.englishGloss}</strong>
              </span>
            )}
            <span className="word-explorer-phrase">
              Phrase: <em lang="so">“{selectedPhraseWindow.phraseText}”</em>
              {selectedPhraseWindow.startTime !== null &&
                selectedPhraseWindow.endTime !== null && (
                  <span className="word-explorer-timing">
                    {' '}
                    ({selectedPhraseWindow.startTime.toFixed(2)}s –{' '}
                    {selectedPhraseWindow.endTime.toFixed(2)}s)
                  </span>
                )}
            </span>
          </div>

          <div className="word-explorer-actions">
            {isAudioReadyForPlayback &&
              selectedPhraseWindow.startTime !== null &&
              selectedPhraseWindow.endTime !== null && (
                <button
                  type="button"
                  className="btn-primary-solid btn-sm"
                  onClick={handleReplaySelectedPhrase}
                  data-testid="replay-selected-phrase-btn"
                >
                  <Play size={14} />
                  Replay Phrase
                </button>
              )}
            <button
              type="button"
              className="btn-outline-solid btn-sm"
              onClick={() => {
                setSelectedWord(null);
                setSelectedPhraseWindow(null);
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* 6. SYNCHRONIZED SOMALI STORY TEXT, INLINE SCENE ILLUSTRATIONS & OPTIONAL ENGLISH TRANSLATION */}
      <div
        ref={sentencesSectionRef}
        className="story-sentences-stream"
        role="region"
        aria-label="Somali Story Text with Word Highlighting"
      >
        <div className="story-reader-helper-tip">
          <BookOpen size={15} />
          <span>
            <strong>Tilmaan (Tip for Young Readers):</strong> Guji erey kasta oo Af-Soomaali ah si
            aad u aragto macnihiisa Ingiriisiga iyo sida loogu dhawaaqo, ama guji lambarka weedha si
            aad ugu celiso. (Tap any Somali word for its meaning &amp; pronunciation, or tap a
            sentence number to replay it.)
          </span>
        </div>

        {story.sentences.map((sentence) => {
          const isSentenceActive = sentence.index === activeSentenceIndex;
          const inlineScenesAfterSentence = (story.sceneIllustrations || []).filter(
            (sc) => sc.afterSentenceIndex === sentence.index
          );

          return (
            <React.Fragment key={sentence.id}>
              <article
                className={`story-sentence-block ${
                  isSentenceActive ? 'active-sentence' : ''
                }`}
                data-testid={`story-sentence-${sentence.index}`}
                aria-current={isSentenceActive ? 'step' : undefined}
              >
                <div className="sentence-gutter">
                  <button
                    type="button"
                    className={`sentence-num-btn ${isSentenceActive ? 'active' : ''}`}
                    onClick={() => handleJumpToSentence(sentence.index, isPlaying)}
                    aria-label={`Jump to sentence ${sentence.index + 1}`}
                    title={
                      sentence.startTime !== null
                        ? `Sentence ${sentence.index + 1} (${sentence.startTime.toFixed(1)}s)`
                        : `Sentence ${sentence.index + 1}`
                    }
                  >
                    {sentence.index + 1}
                  </button>
                </div>

                <div className="sentence-content-col">
                  {/* Large Readable Somali Sentence with Individual Interactive Word Tokens */}
                  <p className="sentence-somali-line" lang="so">
                    {sentence.words.map((word) => {
                      const isWordActive = activeWordId === word.id;
                      const isWordSelected = selectedWord?.id === word.id;
                      const isInSelectedPhrase = Boolean(
                        selectedPhraseWindow?.wordIds.includes(word.id)
                      );

                      return (
                        <React.Fragment key={word.id}>
                          <button
                            type="button"
                            ref={(el) => {
                              if (el) {
                                wordElementsMapRef.current.set(word.id, el);
                              } else {
                                wordElementsMapRef.current.delete(word.id);
                              }
                            }}
                            className={[
                              'story-word-token',
                              isWordActive ? 'active-word' : '',
                              isWordSelected ? 'selected-word' : '',
                              isInSelectedPhrase ? 'in-selected-phrase' : ''
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onClick={() => handleSelectWord(sentence, word)}
                            aria-label={`${word.text}${
                              word.englishGloss ? ` (${word.englishGloss})` : ''
                            }`}
                            aria-current={isWordActive ? 'true' : undefined}
                            data-testid={`story-word-${word.id}`}
                            data-word-start={word.startTime ?? undefined}
                            data-word-end={word.endTime ?? undefined}
                          >
                            {word.text}
                          </button>{' '}
                        </React.Fragment>
                      );
                    })}
                  </p>

                  {/* Optional Reviewed English Translation Beneath Somali Sentence */}
                  {prefs.showEnglishTranslation && (
                    <p
                      className="sentence-english-translation"
                      lang="en"
                      data-testid={`story-translation-${sentence.index}`}
                    >
                      {sentence.englishTranslation}
                    </p>
                  )}
                </div>
              </article>

              {/* Inline Story Scene Illustration placed after key narrative moments */}
              {inlineScenesAfterSentence.map((scene) => (
                <figure
                  key={scene.id}
                  className="story-inline-scene-figure"
                  data-testid={`story-inline-scene-${scene.sceneNumber}`}
                >
                  <img
                    src={scene.illustrationUrl}
                    alt={scene.altText}
                    className="story-inline-scene-figure__img"
                    loading="lazy"
                  />
                  <figcaption className="story-inline-scene-figure__caption">
                    <span className="story-inline-scene-figure__badge">
                      Muuqaalka {scene.sceneNumber}aad • Scene {scene.sceneNumber}
                    </span>
                    <strong lang="so">{scene.somaliCaption}</strong>
                    {prefs.showEnglishTranslation && (
                      <span lang="en">{scene.englishCaption}</span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </React.Fragment>
          );
        })}

        {/* Story Moral / Lesson Box */}
        {story.moralSomali && (
          <div className="story-moral-callout" data-testid="story-moral-callout">
            <span className="eyebrow">DULUCDA &amp; CASHARKA SHEEKADA • STORY MORAL</span>
            <p className="story-moral-callout__somali" lang="so">
              &ldquo;{story.moralSomali}&rdquo;
            </p>
            <p className="story-moral-callout__english" lang="en">
              {story.moralEnglish}
            </p>
          </div>
        )}

        {/* Story Vocabulary Cards */}
        {story.vocabulary && story.vocabulary.length > 0 && (
          <div className="story-vocab-showcase" data-testid="story-vocab-showcase">
            <div className="story-vocab-showcase__header">
              <div>
                <span className="eyebrow">QAAMUUSKA SHEEKADA • KEY VOCABULARY</span>
                <h3>Ereyada Muhiimka ah ee Sheekadan ({story.vocabulary.length} Erey)</h3>
              </div>
              <button
                type="button"
                className="button button--primary button--sm"
                onClick={() =>
                  lessonSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  })
                }
              >
                Bilow Su&apos;aalaha Casharka →
              </button>
            </div>
            <div className="story-vocab-cards-grid">
              {story.vocabulary.map((v) => (
                <article key={v.id} className="story-vocab-card">
                  <img
                    src={v.pictureUrl}
                    alt={v.somaliWord}
                    className="story-vocab-card__img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/vocab-school_book.svg')) {
                        target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                      }
                    }}
                  />
                  <div className="story-vocab-card__body">
                    <div className="story-vocab-card__top">
                      <strong className="story-vocab-card__word" lang="so">
                        {v.somaliWord}
                      </strong>
                      <span className="story-vocab-card__pos">{v.partOfSpeech}</span>
                    </div>
                    <div className="story-vocab-card__pron">
                      Ku dhawaaqidda: <code>/{v.pronunciationGuide}/</code>
                    </div>
                    <div className="story-vocab-card__meaning">
                      Macnaha: <strong>{v.englishMeaning}</strong>
                    </div>
                    <p className="story-vocab-card__example" lang="so">
                      &ldquo;{v.exampleSomali}&rdquo;
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6B. DUOLINGO-INSPIRED INTERACTIVE STORY LESSON */}
      {story.lessonQuestions && story.lessonQuestions.length > 0 && (
        <div
          id="story-interactive-lesson"
          ref={lessonSectionRef}
          className="story-lesson-section-wrap"
        >
          <StoryLessonPlayer
            story={story}
            hasVerifiedAudio={isAudioReadyForPlayback}
            onPlaySentenceAudio={(sIdx) => handleJumpToSentence(sIdx, true)}
            currentProgress={currentProgress || createInitialKidsProgress()}
            onProgressUpdated={(updated) => {
              if (onProgressUpdated) {
                onProgressUpdated(updated);
              }
            }}
            onReadAgain={() => {
              handleJumpToSentence(0, false);
              sentencesSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            onListenAgain={() => {
              handleJumpToSentence(0, true);
              readerContainerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            nextRecommendedStory={nextRecommendedStory}
            onSelectNextStory={onSelectNextStory}
          />
        </div>
      )}

      {/* 7. PARENT & EDUCATOR AUDIO SETUP & SYNCHRONIZATION VERIFICATION DRAWER */}
      {showParentDrawer && (
        <aside
          className="story-parent-drawer"
          aria-label="Parent and Educator Audio Setup and Settings"
          data-testid="parent-educator-drawer"
        >
          <div className="parent-drawer-header">
            <div>
              <span className="section-kicker">Parent &amp; Educator Controls</span>
              <h3>Audio Narration Setup, Language Model &amp; Child Safety Settings</h3>
            </div>
            <button
              type="button"
              className="btn-outline-solid btn-sm"
              onClick={() => setShowParentDrawer(false)}
            >
              Close Panel
            </button>
          </div>

          {!parentGateUnlocked ? (
            <div className="parent-gate-box">
              <ShieldCheck size={22} className="brass-icon" />
              <div className="parent-gate-copy">
                <strong>Parent / Educator Confirmation</strong>
                <p>
                  To keep the reading space distraction-free and safe for young children, audio file
                  management and diagnostic calibration tools are tucked behind this parent confirmation.
                </p>
              </div>
              <button
                type="button"
                className="btn-primary-solid btn-sm"
                onClick={() => setParentGateUnlocked(true)}
                data-testid="unlock-parent-controls-btn"
              >
                Unlock Parent &amp; Educator Controls
              </button>
            </div>
          ) : (
            <div className="parent-drawer-grid">
              {/* Column 1: Language Track & Auto-Scroll */}
              <div className="parent-drawer-card">
                <h4>
                  <Languages size={16} /> Narration Track &amp; Reading Options
                </h4>
                <p className="drawer-card-desc">
                  Somali narration is supported first. The data model also supports a separate
                  English narration track when installed.
                </p>

                <div className="drawer-field-row">
                  <label htmlFor="narration-lang-select">Active Narration Track:</label>
                  <select
                    id="narration-lang-select"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as StoryLanguageCode)}
                    className="drawer-select"
                  >
                    <option value="so">
                      Af-Soomaali (Primary — {story.narrationTracks.so.status})
                    </option>
                    <option value="en">
                      English (Secondary — {story.narrationTracks.en.status})
                    </option>
                  </select>
                </div>

                <div className="drawer-field-row">
                  <label className="drawer-checkbox-label">
                    <input
                      type="checkbox"
                      checked={prefs.autoScrollActiveWord}
                      onChange={(e) =>
                        setPrefs((prev) => ({
                          ...prev,
                          autoScrollActiveWord: e.target.checked
                        }))
                      }
                    />
                    <span>Scroll active word into view automatically when needed</span>
                  </label>
                </div>

                <div className="drawer-setup-steps">
                  <strong>How to Add the Genuine Somali Recording:</strong>
                  <ol>
                    {currentTrack.setupInstructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Column 2: Attach Local Studio Recording + Reviewed Forced Alignment */}
              <div className="parent-drawer-card">
                <h4>
                  <FileAudio size={16} /> Attach Studio Recording &amp; Reviewed Alignment JSON
                </h4>
                <p className="drawer-card-desc">
                  Have a fluent Somali speaker recording (<code>.wav</code> / <code>.mp3</code>) and
                  reviewed forced-alignment word timestamps (<code>.json</code>)? Load them directly
                  here or place them in <code>server/storage/audio/</code>.
                </p>

                <form onSubmit={handleLocalStudioUpload} className="drawer-upload-form">
                  <label className="drawer-file-label">
                    <span>1. Audio Recording (.wav / .mp3):</span>
                    <input
                      type="file"
                      name="studioAudioFile"
                      accept="audio/*"
                      className="drawer-file-input"
                    />
                  </label>
                  <label className="drawer-file-label">
                    <span>2. Reviewed Forced-Alignment JSON (.json):</span>
                    <input
                      type="file"
                      name="studioAlignmentFile"
                      accept=".json,application/json"
                      className="drawer-file-input"
                    />
                  </label>
                  <button type="submit" className="btn-primary-solid btn-sm">
                    <Upload size={14} />
                    Load Verified Studio Recording
                  </button>
                </form>

                {uploadStatusMsg && (
                  <p className="drawer-feedback success" role="status">
                    {uploadStatusMsg}
                  </p>
                )}
                {uploadErrorMsg && (
                  <p className="drawer-feedback error" role="alert">
                    {uploadErrorMsg}
                  </p>
                )}

                {/* Technical Synchronization Verification Harness */}
                <div className="drawer-calibration-box">
                  <strong>
                    <HelpCircle size={15} /> Technical Synchronization &amp; Error State Verification
                  </strong>
                  <p>
                    For automated testing or engineering verification of word-level highlighting,
                    seeking, <code>0.75×/1×/1.25×</code> speed changes, and sentence repeat before
                    the human studio recording is installed, you can load the sample-measured 22.05kHz
                    PCM calibration track or test failed-audio error handling:
                  </p>
                  <div className="drawer-calibration-actions">
                    {onLoadCalibrationFixture && (
                      <button
                        type="button"
                        className="btn-outline-solid btn-sm"
                        onClick={() => onLoadCalibrationFixture(story.id, selectedLang)}
                        data-testid="load-calibration-fixture-btn"
                      >
                        <Sparkles size={14} />
                        Load Sample-Measured Sync Test Track
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-outline-solid btn-sm"
                      onClick={() => {
                        setSimulatedBrokenAudioUrl('/api/children-stories/non-existent-broken.wav');
                        setAudioError(
                          'The audio recording could not be loaded or played (HTTP 404). Verify the audio file path or network connection, or continue reading the interactive bilingual text below.'
                        );
                      }}
                      data-testid="simulate-failed-audio-btn"
                    >
                      Simulate Failed Audio Error State
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </section>
  );
};

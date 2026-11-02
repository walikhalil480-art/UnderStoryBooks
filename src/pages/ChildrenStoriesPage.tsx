import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCode2,
  Flame,
  Languages,
  Lock,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Unlock,
  Volume2
} from 'lucide-react';
import { CHILDREN_STORIES } from '../data/childrenStories';
import {
  CATEGORY_LABELS,
  LEVEL_LABELS
} from '../data/somaliKidsCatalogData';
import {
  ChildrenStory,
  ChildrenStoryCategorySlug,
  ChildrenStoryLevelId,
  KidsLearningProgressPayload,
  StoryLanguageCode,
  StoryLessonQuestion
} from '../types';
import { StoryAudioReader } from '../components/StoryAudioReader';
import { StoryLessonPlayer } from '../components/StoryLessonPlayer';
import { folioApi } from '../services/api';
import {
  isStoryUnlockedInLearningPath,
  loadLocalKidsProgress,
  markStoryInProgress,
  saveLocalKidsProgress
} from '../utils/kidsProgressManager';

interface ChildrenStoriesPageProps {
  initialStoryId?: string;
  onBackToLibrary?: () => void;
}

type KidsHubTab = 'library' | 'learning-path' | 'vocabulary-review' | 'progress-parent';

export const ChildrenStoriesPage: React.FC<ChildrenStoriesPageProps> = ({
  initialStoryId = 'geelkii-yaraa',
  onBackToLibrary
}) => {
  const [stories, setStories] = useState<ChildrenStory[]>(CHILDREN_STORIES);
  const [selectedStoryId, setSelectedStoryId] = useState<string>(initialStoryId);
  const [calibrationActiveMap, setCalibrationActiveMap] = useState<Record<string, boolean>>({});

  // Hub Navigation & Filtering State
  const [activeHubTab, setActiveHubTab] = useState<KidsHubTab>('library');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<ChildrenStoryLevelId | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    ChildrenStoryCategorySlug | 'all'
  >('all');
  const [selectedAudioFilter, setSelectedAudioFilter] = useState<'all' | 'verified' | 'pending'>(
    'all'
  );
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState<boolean>(false);

  // Kids Learning Progress State (Local + SQLite synced)
  const [kidsProgress, setKidsProgress] = useState<KidsLearningProgressPayload>(() =>
    loadLocalKidsProgress()
  );

  const activeReaderRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    folioApi
      .getChildrenStories()
      .then((res) => {
        if (Array.isArray(res.stories) && res.stories.length > 0) {
          setStories(res.stories);
        }
      })
      .catch(() => {
        // Keep static 30 stories if offline
      });

    folioApi
      .getKidsProgress()
      .then((res) => {
        if (res.authenticated && res.progress) {
          setKidsProgress(res.progress);
          saveLocalKidsProgress(res.progress);
        }
      })
      .catch(() => {
        // Use localStorage progress when guest or offline
      });
  }, []);

  const handleUpdateProgress = (updated: KidsLearningProgressPayload) => {
    setKidsProgress(updated);
    saveLocalKidsProgress(updated);
    folioApi.saveKidsProgress(updated).catch(() => {
      // Ignore network errors for guest users
    });
  };

  const currentStory =
    stories.find((s) => s.id === selectedStoryId) || stories[0] || CHILDREN_STORIES[0];

  const nextRecommendedStory = useMemo(() => {
    const ordered = [...stories].sort((a, b) => a.learningPathOrder - b.learningPathOrder);
    const currentIdx = ordered.findIndex((s) => s.id === currentStory.id);
    if (currentIdx >= 0 && currentIdx + 1 < ordered.length) {
      return ordered[currentIdx + 1];
    }
    return ordered.find((s) => !kidsProgress.completedStories[s.id] && s.id !== currentStory.id) || null;
  }, [stories, currentStory.id, kidsProgress.completedStories]);

  const handleSelectStory = (storyId: string, scrollToReader = true) => {
    setSelectedStoryId(storyId);
    const updated = markStoryInProgress(kidsProgress, storyId);
    handleUpdateProgress(updated);
    if (scrollToReader) {
      setTimeout(() => {
        activeReaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  const handleStoryUpdated = (updated: ChildrenStory) => {
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleLoadCalibrationFixture = async (
    storyId: string,
    lang: StoryLanguageCode
  ) => {
    try {
      const res = await folioApi.getCalibrationFixture(storyId, lang);
      if (res.story) {
        handleStoryUpdated(res.story);
        setCalibrationActiveMap((prev) => ({ ...prev, [storyId]: true }));
      }
    } catch {
      // ignore
    }
  };

  const handleResetCalibrationFixture = async (storyId: string) => {
    try {
      const res = await folioApi.getChildrenStory(storyId);
      if (res.story) {
        handleStoryUpdated(res.story);
      } else {
        const base = CHILDREN_STORIES.find((s) => s.id === storyId);
        if (base) handleStoryUpdated(base);
      }
      setCalibrationActiveMap((prev) => ({ ...prev, [storyId]: false }));
    } catch {
      const base = CHILDREN_STORIES.find((s) => s.id === storyId);
      if (base) handleStoryUpdated(base);
      setCalibrationActiveMap((prev) => ({ ...prev, [storyId]: false }));
    }
  };

  // Filtered stories for Library tab
  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stories.filter((story) => {
      if (selectedLevelFilter !== 'all' && story.levelId !== selectedLevelFilter) {
        return false;
      }
      if (selectedCategoryFilter !== 'all' && story.categorySlug !== selectedCategoryFilter) {
        return false;
      }
      if (selectedAudioFilter === 'verified') {
        const isReady =
          story.narrationTracks.so.status === 'verified_ready' ||
          Boolean(calibrationActiveMap[story.id]);
        if (!isReady) return false;
      } else if (selectedAudioFilter === 'pending') {
        const isReady =
          story.narrationTracks.so.status === 'verified_ready' ||
          Boolean(calibrationActiveMap[story.id]);
        if (isReady) return false;
      }
      if (!q) return true;
      return (
        story.title.toLowerCase().includes(q) ||
        story.englishTitle.toLowerCase().includes(q) ||
        story.somaliSummary.toLowerCase().includes(q) ||
        story.description.toLowerCase().includes(q) ||
        story.categoryNameSomali.toLowerCase().includes(q) ||
        story.categoryNameEnglish.toLowerCase().includes(q)
      );
    });
  }, [
    stories,
    searchQuery,
    selectedLevelFilter,
    selectedCategoryFilter,
    selectedAudioFilter,
    calibrationActiveMap
  ]);

  // Continue Learning stories
  const continueLearningStories = useMemo(() => {
    const inProgress = kidsProgress.inProgressStoryIds
      .map((id) => stories.find((s) => s.id === id))
      .filter((s): s is ChildrenStory => Boolean(s));
    if (inProgress.length > 0) return inProgress.slice(0, 4);

    // Default starter picks across Level 1, 2, 3
    return [stories[0], stories[10], stories[20]].filter(Boolean);
  }, [kidsProgress.inProgressStoryIds, stories]);

  // Build Review Session questions (from missedQuestions or top vocabulary questions)
  const reviewSessionQuestions = useMemo((): StoryLessonQuestion[] => {
    const collected: StoryLessonQuestion[] = [];
    for (const missed of kidsProgress.missedQuestions) {
      const st = stories.find((s) => s.id === missed.storyId);
      const q = st?.lessonQuestions.find((item) => item.id === missed.questionId);
      if (q && !q.requiresAudio) {
        collected.push(q);
      }
    }
    if (collected.length >= 4) {
      return collected.slice(0, 8);
    }
    // Supplement with diverse questions across stories so Review Session is always ready to play
    for (const st of stories.slice(0, 6)) {
      for (const q of st.lessonQuestions) {
        if (!q.requiresAudio && !collected.some((c) => c.id === q.id)) {
          collected.push(q);
          if (collected.length >= 6) break;
        }
      }
      if (collected.length >= 6) break;
    }
    return collected;
  }, [kidsProgress.missedQuestions, stories]);

  const completedCount = Object.keys(kidsProgress.completedStories).length;
  const totalStarsEarned = Object.values(kidsProgress.completedStories).reduce(
    (sum, item) => sum + item.starsEarned,
    0
  );
  const learnedWordList = Object.values(kidsProgress.learnedWords);
  const dailyGoalPercent = Math.min(
    100,
    Math.round((kidsProgress.todayXp / Math.max(10, kidsProgress.dailyGoalXp)) * 100)
  );
  const averageQuizAccuracy = useMemo(() => {
    const records = Object.values(kidsProgress.completedStories);
    if (records.length === 0) return 0;
    const sum = records.reduce((acc, r) => acc + r.bestScorePercent, 0);
    return Math.round(sum / records.length);
  }, [kidsProgress.completedStories]);

  return (
    <div className="children-stories-page">
      {/* 1. SOMALI KIDS HUB HERO & DAILY LEARNING STATS */}
      <section className="children-stories-hero">
        <div className="container">
          <div className="children-hero-top-row">
            <span className="section-kicker">
              eBaro Carruurta • Somali Kids Illustrated Stories, Audio &amp; Interactive Learning
            </span>
            {onBackToLibrary && (
              <button
                type="button"
                className="btn-outline-solid btn-sm"
                onClick={onBackToLibrary}
              >
                <ArrowLeft size={14} />
                Back to Main Library
              </button>
            )}
          </div>

          <div className="children-hero-grid">
            <div className="children-hero-copy">
              <h1>eBaro — Somali Children’s Story Library &amp; Learning Hub</h1>
              <p className="children-hero-lead">
                Explore <strong>{stories.length} original illustrated Somali stories</strong> across
                3 reading levels (<strong lang="so">Bilowga</strong>,{' '}
                <strong lang="so">Akhriste Yar</strong>, and{' '}
                <strong lang="so">Akhriste Horumarsan</strong>) and 8 cultural &amp; nature
                categories. Read along with large Somali text, tap words for pronunciation &amp;
                meanings, and complete Duolingo-style interactive lessons to earn XP and stars.
              </p>

              {/* Live Child Progress Strip */}
              <div className="kids-hub-stats-strip" data-testid="kids-hub-stats-strip">
                <div className="kids-hub-stat-pill">
                  <Flame size={16} className="brass-icon" />
                  <div>
                    <span>Hadafka Maanta (Daily Goal)</span>
                    <strong>
                      {kidsProgress.todayXp} / {kidsProgress.dailyGoalXp} XP ({dailyGoalPercent}%)
                    </strong>
                  </div>
                </div>

                <div className="kids-hub-stat-pill">
                  <Award size={16} className="brass-icon" />
                  <div>
                    <span>Wadarta XP (Total XP)</span>
                    <strong data-testid="hub-total-xp">{kidsProgress.totalXp} XP</strong>
                  </div>
                </div>

                <div className="kids-hub-stat-pill">
                  <BookOpen size={16} className="brass-icon" />
                  <div>
                    <span>Sheekooyinka La Akhriyay</span>
                    <strong data-testid="hub-completed-count">
                      {completedCount} / {stories.length}
                    </strong>
                  </div>
                </div>

                <div className="kids-hub-stat-pill">
                  <Star size={16} className="brass-icon" />
                  <div>
                    <span>Xiddigaha &amp; Ereyada</span>
                    <strong>
                      {totalStarsEarned} ★ • {learnedWordList.length} erey
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Story Spotlight Card */}
            <div
              className="children-story-selector-card kids-featured-spotlight"
              role="region"
              aria-label="Sheekada Maanta La Soo Xulay (Featured Story)"
            >
              <div className="kids-featured-spotlight__top">
                <img
                  src={currentStory.coverIllustrationUrl}
                  alt={currentStory.coverIllustrationAlt}
                  className="kids-featured-spotlight__img"
                />
                <div className="kids-featured-spotlight__info">
                  <span className="selector-card-label">
                    SHEEKADA HADDA FURAN • ACTIVE STORY ({currentStory.learningPathOrder} of{' '}
                    {stories.length})
                  </span>
                  <h2 className="kids-featured-spotlight__title" lang="so">
                    {currentStory.title}
                  </h2>
                  <p className="kids-featured-spotlight__eng">{currentStory.englishTitle}</p>
                  <div className="kids-featured-spotlight__badges">
                    <span>{currentStory.levelLabelSomali}</span>
                    <span>•</span>
                    <span>{currentStory.categoryNameSomali}</span>
                    <span>•</span>
                    <span>⏱ {currentStory.estimatedReadingMinutes} daqiiqo</span>
                  </div>
                </div>
              </div>

              <p className="kids-featured-spotlight__summary" lang="so">
                {currentStory.somaliSummary}
              </p>

              <div className="kids-featured-spotlight__actions">
                <button
                  type="button"
                  className="button button--primary button--sm"
                  onClick={() => handleSelectStory(currentStory.id, true)}
                >
                  Bilow Akhriska (Read Story)
                </button>
                <button
                  type="button"
                  className="button button--secondary button--sm"
                  onClick={() => {
                    const el = document.getElementById('story-interactive-lesson');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  Bilow Su&apos;aalaha (+{currentStory.xpReward} XP)
                </button>
              </div>
            </div>
          </div>

          {/* 2. SOMALI KIDS HUB NAVIGATION TABS */}
          <nav
            className="kids-hub-tabs"
            aria-label="Qaybaha Barashada Carruurta (Somali Kids Hub Sections)"
          >
            <button
              type="button"
              className={`kids-hub-tab-btn ${activeHubTab === 'library' ? 'is-active' : ''}`}
              onClick={() => setActiveHubTab('library')}
              data-testid="hub-tab-library"
            >
              <BookOpen size={16} />
              <span>Maktabadda ({stories.length} Sheeko)</span>
            </button>

            <button
              type="button"
              className={`kids-hub-tab-btn ${
                activeHubTab === 'learning-path' ? 'is-active' : ''
              }`}
              onClick={() => setActiveHubTab('learning-path')}
              data-testid="hub-tab-learning-path"
            >
              <Compass size={16} />
              <span>Jidka Waxbarashada (Learning Path)</span>
            </button>

            <button
              type="button"
              className={`kids-hub-tab-btn ${
                activeHubTab === 'vocabulary-review' ? 'is-active' : ''
              }`}
              onClick={() => setActiveHubTab('vocabulary-review')}
              data-testid="hub-tab-vocabulary"
            >
              <RefreshCw size={16} />
              <span>
                Qaamuuskayga &amp; Dib-u-Eegis ({learnedWordList.length} Erey)
              </span>
            </button>

            <button
              type="button"
              className={`kids-hub-tab-btn ${
                activeHubTab === 'progress-parent' ? 'is-active' : ''
              }`}
              onClick={() => setActiveHubTab('progress-parent')}
              data-testid="hub-tab-progress"
            >
              <Settings size={16} />
              <span>Horumarkayga &amp; Waalidka (Progress &amp; Goals)</span>
            </button>
          </nav>
        </div>
      </section>

      {/* 3. TAB CONTENT AREA */}
      <section className="kids-hub-panel-section">
        <div className="container">
          {/* ================================================================
              TAB 1: STORY LIBRARY (30 ORIGINAL STORIES BY LEVEL & CATEGORY)
             ================================================================ */}
          {activeHubTab === 'library' && (
            <div className="kids-library-explorer" data-testid="kids-library-explorer">
              {/* Continue Learning Strip */}
              <div className="kids-continue-shelf">
                <div className="kids-continue-shelf__header">
                  <div>
                    <span className="eyebrow">SII WAD WAXBARASHADA • CONTINUE LEARNING</span>
                    <h3>Sheekooyinka Laguugula Talinayo (Recommended Next Stories)</h3>
                  </div>
                </div>
                <div className="kids-continue-grid">
                  {continueLearningStories.map((st) => {
                    const comp = kidsProgress.completedStories[st.id];
                    const isCurrent = st.id === currentStory.id;
                    return (
                      <button
                        key={`cont-${st.id}`}
                        type="button"
                        className={`kids-continue-card ${isCurrent ? 'is-active' : ''}`}
                        onClick={() => handleSelectStory(st.id, true)}
                      >
                        <img
                          src={st.coverIllustrationUrl}
                          alt={st.title}
                          className="kids-continue-card__img"
                          loading="lazy"
                        />
                        <div className="kids-continue-card__body">
                          <span className="kids-continue-card__level">
                            {st.levelLabelSomali} • {st.categoryNameSomali}
                          </span>
                          <strong lang="so">{st.title}</strong>
                          <span>{st.englishTitle}</span>
                          <div className="kids-continue-card__meta">
                            <span>⏱ {st.estimatedReadingMinutes}m</span>
                            <span>•</span>
                            <span>+{st.xpReward} XP</span>
                            {comp && (
                              <>
                                <span>•</span>
                                <span className="kids-gold-text">
                                  {'★'.repeat(comp.starsEarned)} ({comp.bestScorePercent}%)
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search & Level / Category / Audio Filters */}
              <div className="kids-filter-toolbar" role="search" aria-label="Filter Somali Children's Stories">
                <div className="kids-search-box">
                  <Search size={17} />
                  <input
                    type="search"
                    placeholder="Raadi ciwaanka sheekada Af-Soomaali ama Ingiriisi (Search 30 stories)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="kids-story-search-input"
                  />
                </div>

                {/* Level Filter Buttons */}
                <div className="kids-filter-group" role="group" aria-label="Filter by Reading Level">
                  <button
                    type="button"
                    className={`kids-filter-pill ${
                      selectedLevelFilter === 'all' ? 'is-active' : ''
                    }`}
                    onClick={() => setSelectedLevelFilter('all')}
                    data-testid="filter-level-all"
                  >
                    Dhammaan Heerarka ({stories.length})
                  </button>
                  {(Object.keys(LEVEL_LABELS) as ChildrenStoryLevelId[]).map((lvlId) => {
                    const meta = LEVEL_LABELS[lvlId];
                    const count = stories.filter((s) => s.levelId === lvlId).length;
                    return (
                      <button
                        key={lvlId}
                        type="button"
                        className={`kids-filter-pill ${
                          selectedLevelFilter === lvlId ? 'is-active' : ''
                        }`}
                        onClick={() => setSelectedLevelFilter(lvlId)}
                        data-testid={`filter-level-${lvlId}`}
                      >
                        {meta.somali} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Category Filter Buttons (All 8 Required Categories) */}
                <div className="kids-filter-group" role="group" aria-label="Filter by Story Category">
                  <button
                    type="button"
                    className={`kids-filter-pill ${
                      selectedCategoryFilter === 'all' ? 'is-active' : ''
                    }`}
                    onClick={() => setSelectedCategoryFilter('all')}
                    data-testid="filter-category-all"
                  >
                    Dhammaan Qaybaha (All 8 Categories)
                  </button>
                  {(Object.keys(CATEGORY_LABELS) as ChildrenStoryCategorySlug[]).map((catSlug) => {
                    const cat = CATEGORY_LABELS[catSlug];
                    const count = stories.filter((s) => s.categorySlug === catSlug).length;
                    return (
                      <button
                        key={catSlug}
                        type="button"
                        className={`kids-filter-pill ${
                          selectedCategoryFilter === catSlug ? 'is-active' : ''
                        }`}
                        onClick={() => setSelectedCategoryFilter(catSlug)}
                        data-testid={`filter-category-${catSlug}`}
                      >
                        {cat.somali} — {cat.english} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Audio Status Filter */}
                <div className="kids-filter-row-bottom">
                  <div className="kids-audio-filter-pills">
                    <span>Xaaladda Codka (Audio Status):</span>
                    <button
                      type="button"
                      className={`kids-filter-pill ${
                        selectedAudioFilter === 'all' ? 'is-active' : ''
                      }`}
                      onClick={() => setSelectedAudioFilter('all')}
                    >
                      Dhammaan ({stories.length})
                    </button>
                    <button
                      type="button"
                      className={`kids-filter-pill ${
                        selectedAudioFilter === 'verified' ? 'is-active' : ''
                      }`}
                      onClick={() => setSelectedAudioFilter('verified')}
                    >
                      Cod Diyaar ah (Verified Audio Active)
                    </button>
                    <button
                      type="button"
                      className={`kids-filter-pill ${
                        selectedAudioFilter === 'pending' ? 'is-active' : ''
                      }`}
                      onClick={() => setSelectedAudioFilter('pending')}
                    >
                      Qoraal &amp; Cashar (Interactive Text &amp; Quiz)
                    </button>
                  </div>

                  <span className="kids-filter-result-count" data-testid="filtered-stories-count">
                    Waxaa muuqda {filteredStories.length} / {stories.length} sheeko
                  </span>
                </div>
              </div>

              {/* 30-Story Catalog Grid */}
              {filteredStories.length === 0 ? (
                <div className="kids-empty-filter-state">
                  <p>
                    Ma jirto sheeko waafaqsan raadintaada. Guji &ldquo;Dib u Deji&rdquo; si aad u
                    aragto dhammaan 30-ka sheeko.
                  </p>
                  <button
                    type="button"
                    className="button button--secondary button--sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLevelFilter('all');
                      setSelectedCategoryFilter('all');
                      setSelectedAudioFilter('all');
                    }}
                  >
                    Muuji Dhammaan 30-ka Sheeko (Reset Filters)
                  </button>
                </div>
              ) : (
                <div className="kids-stories-catalog-grid" data-testid="kids-stories-catalog-grid">
                  {filteredStories.map((item) => {
                    const isSelected = item.id === currentStory.id;
                    const completion = kidsProgress.completedStories[item.id];
                    const hasAudio =
                      item.narrationTracks.so.status === 'verified_ready' ||
                      Boolean(calibrationActiveMap[item.id]);

                    return (
                      <article
                        key={item.id}
                        className={`kids-story-card ${isSelected ? 'is-selected' : ''} ${
                          completion ? 'is-completed' : ''
                        }`}
                        data-testid={`story-catalog-card-${item.id}`}
                      >
                        <div className="kids-story-card__media">
                          <img
                            src={item.coverIllustrationUrl}
                            alt={item.coverIllustrationAlt}
                            className="kids-story-card__img"
                            loading="lazy"
                          />
                          <span className="kids-story-card__level-badge">
                            {item.levelLabelSomali}
                          </span>
                          {completion && (
                            <span
                              className="kids-story-card__stars-badge"
                              title={`Completed (${completion.bestScorePercent}%)`}
                            >
                              {'★'.repeat(completion.starsEarned)} {completion.bestScorePercent}%
                            </span>
                          )}
                        </div>

                        <div className="kids-story-card__body">
                          <div className="kids-story-card__tags">
                            <span>
                              {item.categoryNameSomali} ({item.categoryNameEnglish})
                            </span>
                            <span>•</span>
                            <span>⏱ {item.estimatedReadingMinutes} daqiiqo</span>
                          </div>

                          <h3 className="kids-story-card__title" lang="so">
                            {item.title}
                          </h3>
                          <p className="kids-story-card__english-title">{item.englishTitle}</p>
                          <p className="kids-story-card__summary" lang="so">
                            {item.somaliSummary}
                          </p>

                          <div className="kids-story-card__meta-row">
                            <span className="kids-story-card__audio-tag">
                              <Volume2 size={13} />
                              {hasAudio
                                ? 'Cod Diyaar ah (Audio Ready)'
                                : 'Qoraal + 8 Su’aalood'}
                            </span>
                            <span className="kids-story-card__xp-tag">+{item.xpReward} XP</span>
                          </div>

                          <div className="kids-story-card__actions">
                            <button
                              type="button"
                              className={`button ${
                                isSelected ? 'button--primary' : 'button--secondary'
                              } button--sm`}
                              onClick={() => handleSelectStory(item.id, true)}
                              aria-pressed={isSelected}
                              data-testid={`select-story-${item.id}`}
                            >
                              {isSelected
                                ? 'Sheekada Hadda Furan (Reading Now)'
                                : completion
                                ? 'Akhri Mar Kale (Read Again)'
                                : 'Bilow Akhriska & Casharka →'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 2: DUOLINGO-STYLE SEQUENTIAL LEARNING PATH
             ================================================================ */}
          {activeHubTab === 'learning-path' && (
            <div className="kids-learning-path-panel" data-testid="kids-learning-path-panel">
              <div className="kids-learning-path-header">
                <div>
                  <span className="eyebrow">JIDKA WAXBARASHADA • STEP-BY-STEP LEARNING PATH</span>
                  <h2>Tallaabo-Tallaabo u Baro Af-Soomaaliga (30 Cashar oo Isku Xiga)</h2>
                  <p>
                    Dhammaystir sheeko kasta iyo su&apos;aalaheeda si aad u furto sheekada xigta,
                    ama isticmaal furaha waalidka si aad u furto dhammaan sheekooyinka.
                  </p>
                </div>

                <button
                  type="button"
                  className="button button--secondary button--sm"
                  onClick={() =>
                    handleUpdateProgress({
                      ...kidsProgress,
                      unlockAllStoriesParentOverride: !kidsProgress.unlockAllStoriesParentOverride
                    })
                  }
                  data-testid="toggle-parent-unlock-all-btn"
                >
                  {kidsProgress.unlockAllStoriesParentOverride ? (
                    <>
                      <Unlock size={15} /> Waalidka: Dhammaan Waa Furan Yihiin (All Unlocked)
                    </>
                  ) : (
                    <>
                      <Lock size={15} /> Fura Dhammaan Sheekooyinka (Parent Unlock All)
                    </>
                  )}
                </button>
              </div>

              {(['level-1', 'level-2', 'level-3'] as ChildrenStoryLevelId[]).map((lvlId) => {
                const lvlMeta = LEVEL_LABELS[lvlId];
                const levelStories = stories
                  .filter((s) => s.levelId === lvlId)
                  .sort((a, b) => a.learningPathOrder - b.learningPathOrder);

                return (
                  <div key={lvlId} className="kids-path-level-block">
                    <div className="kids-path-level-banner">
                      <div>
                        <span className="eyebrow">{lvlMeta.ageRange}</span>
                        <h3>
                          {lvlMeta.somali} — {lvlMeta.english}
                        </h3>
                        <p>{lvlMeta.summary}</p>
                      </div>
                      <span className="kids-path-level-count">
                        {
                          levelStories.filter((s) => Boolean(kidsProgress.completedStories[s.id]))
                            .length
                        }{' '}
                        / {levelStories.length} La Dhammeeyay
                      </span>
                    </div>

                    <div className="kids-path-nodes-list">
                      {levelStories.map((st) => {
                        const completion = kidsProgress.completedStories[st.id];
                        const unlocked = isStoryUnlockedInLearningPath(
                          st,
                          kidsProgress,
                          stories
                        );

                        return (
                          <div
                            key={st.id}
                            className={`kids-path-node ${
                              completion
                                ? 'is-completed'
                                : unlocked
                                ? 'is-unlocked'
                                : 'is-locked'
                            }`}
                            data-testid={`learning-path-node-${st.id}`}
                          >
                            <div className="kids-path-node__order">
                              {completion ? '✓' : unlocked ? st.learningPathOrder : '🔒'}
                            </div>
                            <img
                              src={st.coverIllustrationUrl}
                              alt={st.title}
                              className="kids-path-node__img"
                              loading="lazy"
                            />
                            <div className="kids-path-node__info">
                              <span className="kids-path-node__cat">
                                Tallaabada {st.learningPathOrder} • {st.categoryNameSomali}
                              </span>
                              <strong lang="so">{st.title}</strong>
                              <span>{st.englishTitle}</span>
                              {completion && (
                                <span className="kids-gold-text">
                                  {'★'.repeat(completion.starsEarned)} Dhibcaha:{' '}
                                  {completion.bestScorePercent}%
                                </span>
                              )}
                            </div>
                            <div className="kids-path-node__action">
                              {unlocked ? (
                                <button
                                  type="button"
                                  className="button button--primary button--sm"
                                  onClick={() => {
                                    setActiveHubTab('library');
                                    handleSelectStory(st.id, true);
                                  }}
                                >
                                  {completion ? 'Ku Celi (Replay)' : 'Bilow (Start)'}
                                </button>
                              ) : (
                                <span className="kids-path-node__locked-label">
                                  Xiran (Complete Previous)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================================================================
              TAB 3: VOCABULARY BANK & MISSED-QUESTION REVIEW SESSION
             ================================================================ */}
          {activeHubTab === 'vocabulary-review' && (
            <div className="kids-vocab-review-panel" data-testid="kids-vocab-review-panel">
              <div className="kids-vocab-review-header">
                <div>
                  <span className="eyebrow">
                    QAAMUUSKAYGA &amp; DIB-U-EEGIS • VOCABULARY &amp; REVIEW SESSION
                  </span>
                  <h2>
                    Ereyada La Bartay ({learnedWordList.length} La Xafiday •{' '}
                    {stories.length * 4} Erey Guud Ahaan)
                  </h2>
                  <p>
                    Dib u eeg ereyada Af-Soomaaliga ee aad ka baratay sheekooyinka, ama bilow
                    cashar dib-u-eegis ah oo laguugu celinayo su&apos;aalihii u baahnaa ku-celiska.
                  </p>
                </div>

                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => setIsReviewSessionOpen((prev) => !prev)}
                  data-testid="toggle-review-session-btn"
                >
                  <Sparkles size={16} />
                  {isReviewSessionOpen
                    ? 'Xir Casharka Dib-u-Eegista (Close Review Quiz)'
                    : `Bilow Casharka Dib-u-Eegista (${reviewSessionQuestions.length} Su'aalood)`}
                </button>
              </div>

              {isReviewSessionOpen && (
                <div className="kids-review-session-container">
                  <StoryLessonPlayer
                    story={currentStory}
                    hasVerifiedAudio={false}
                    currentProgress={kidsProgress}
                    onProgressUpdated={handleUpdateProgress}
                    onReadAgain={() => setIsReviewSessionOpen(false)}
                    onListenAgain={() => setIsReviewSessionOpen(false)}
                    customQuestionsOverride={reviewSessionQuestions}
                    customLessonTitle="Casharka Dib-u-Eegista Ereyada (Somali Vocabulary Review Session)"
                  />
                </div>
              )}

              {/* Learned Words Section */}
              {learnedWordList.length > 0 && (
                <div className="kids-learned-words-section">
                  <h3>Ereyada Aad Ku Baratay Casharrada ({learnedWordList.length})</h3>
                  <div className="story-vocab-cards-grid">
                    {learnedWordList.map((w) => (
                      <article key={w.somaliWord} className="story-vocab-card">
                        <img
                          src={w.pictureUrl}
                          alt={w.somaliWord}
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
                              {w.somaliWord}
                            </strong>
                            <span className="story-vocab-card__pos">
                              La saxay {w.masteryCount}×
                            </span>
                          </div>
                          <div className="story-vocab-card__pron">
                            Ku dhawaaqidda: <code>/{w.pronunciationGuide}/</code>
                          </div>
                          <div className="story-vocab-card__meaning">
                            Macnaha: <strong>{w.englishMeaning}</strong>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Illustrated Somali Kids Picture Dictionary (Sampled from all 30 stories) */}
              <div className="kids-complete-dictionary-section">
                <h3>Qaamuuska Sawirrada ee 30-ka Sheeko (Illustrated Somali Story Dictionary)</h3>
                <div className="story-vocab-cards-grid">
                  {stories.slice(0, 12).flatMap((st) =>
                    st.vocabulary.slice(0, 2).map((v) => (
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
                            <span className="story-vocab-card__pos">{st.title}</span>
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
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 4: PROGRESS DASHBOARD, BADGES & PARENT GOAL SETTINGS
             ================================================================ */}
          {activeHubTab === 'progress-parent' && (
            <div className="kids-progress-parent-panel" data-testid="kids-progress-parent-panel">
              <div className="kids-progress-summary-cards">
                <div className="kids-metric-box">
                  <span className="kids-metric-box__label">Sheekooyinka La Dhammeeyay</span>
                  <strong className="kids-metric-box__value">
                    {completedCount} / {stories.length}
                  </strong>
                  <span className="kids-metric-box__sub">30 sheeko oo Af-Soomaali ah</span>
                </div>

                <div className="kids-metric-box">
                  <span className="kids-metric-box__label">Celceliska Saxnaanta (Accuracy)</span>
                  <strong className="kids-metric-box__value">{averageQuizAccuracy}%</strong>
                  <span className="kids-metric-box__sub">{totalStarsEarned} xiddigood (★)</span>
                </div>

                <div className="kids-metric-box">
                  <span className="kids-metric-box__label">Wadarta Dhibcaha (Total XP)</span>
                  <strong className="kids-metric-box__value kids-metric-box__value--gold">
                    {kidsProgress.totalXp} XP
                  </strong>
                  <span className="kids-metric-box__sub">
                    Maanta: {kidsProgress.todayXp} / {kidsProgress.dailyGoalXp} XP
                  </span>
                </div>

                <div className="kids-metric-box">
                  <span className="kids-metric-box__label">Ereyada Cusub (Learned Words)</span>
                  <strong className="kids-metric-box__value">{learnedWordList.length}</strong>
                  <span className="kids-metric-box__sub">Qaamuuska carruurta</span>
                </div>
              </div>

              {/* Parent Daily Goal & Learning Path Settings */}
              <div className="kids-parent-settings-card">
                <h3>
                  <Settings size={18} /> Hadafka Maalinlaha &amp; Xakamaynta Waalidka (Parent Goal
                  &amp; Path Controls)
                </h3>
                <p>
                  Dooro hadafka XP-ga maalinlaha ah ee ilmahaaga. Xogta oo dhan waxaa lagu
                  keydiyaa si ammaan ah (SQLite &amp; Local Storage) iyada oo aan wax xog gaar ah
                  laga ururin ilmaha.
                </p>

                <div className="kids-daily-goal-options">
                  <span>Hadafka Maalinlaha (Daily XP Goal):</span>
                  {[10, 20, 30, 50].map((goalVal) => (
                    <button
                      key={goalVal}
                      type="button"
                      className={`kids-filter-pill ${
                        kidsProgress.dailyGoalXp === goalVal ? 'is-active' : ''
                      }`}
                      onClick={() =>
                        handleUpdateProgress({
                          ...kidsProgress,
                          dailyGoalXp: goalVal
                        })
                      }
                      data-testid={`daily-goal-option-${goalVal}`}
                    >
                      {goalVal} XP / maalin
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestone Badges Grid */}
              <div className="kids-badges-showcase">
                <h3>Billadaha La Kasbaday • Earned Milestone Badges ({kidsProgress.badges.length})</h3>
                {kidsProgress.badges.length === 0 ? (
                  <p className="kids-badges-empty">
                    Dhammaystir sheekadaada ugu horreysa iyo su&apos;aalaheeda si aad u furto
                    billaddaada 1aad!
                  </p>
                ) : (
                  <div className="kids-badges-grid">
                    {kidsProgress.badges.map((badge) => (
                      <div key={badge.id} className="kids-badge-card">
                        <Award size={24} className="brass-icon" />
                        <div>
                          <strong lang="so">{badge.titleSomali}</strong>
                          <span>{badge.titleEnglish}</span>
                          <p>{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE STORY READER + INLINE SCENES + VOCABULARY + DUOLINGO LESSON */}
      <section ref={activeReaderRef} className="children-reader-main-section">
        <div className="container">
          <StoryAudioReader
            story={currentStory}
            onStoryUpdated={handleStoryUpdated}
            onLoadCalibrationFixture={handleLoadCalibrationFixture}
            onResetCalibrationFixture={handleResetCalibrationFixture}
            isCalibrationMode={Boolean(calibrationActiveMap[currentStory.id])}
            currentProgress={kidsProgress}
            onProgressUpdated={handleUpdateProgress}
            nextRecommendedStory={nextRecommendedStory}
            onSelectNextStory={(nextId) => handleSelectStory(nextId, true)}
          />
        </div>
      </section>

      {/* 5. STORY PROVENANCE, LINGUISTIC ALIGNMENT METADATA & CHILD PRIVACY CARD */}
      <section className="children-story-metadata-section">
        <div className="container">
          <div className="story-metadata-grid">
            {/* Provenance & Publication Metadata */}
            <div className="story-meta-card">
              <div className="meta-card-header">
                <FileCode2 size={18} className="brass-icon" />
                <h3>Story Provenance &amp; Publication Record</h3>
              </div>
              <dl className="story-meta-list">
                <div>
                  <dt>Story ID &amp; Title</dt>
                  <dd>
                    <code>{currentStory.id}</code> — <strong lang="so">{currentStory.title}</strong> (
                    {currentStory.englishTitle})
                  </dd>
                </div>
                <div>
                  <dt>Level &amp; Category</dt>
                  <dd>
                    {currentStory.levelLabelSomali} ({currentStory.levelLabelEnglish}) •{' '}
                    {currentStory.categoryNameSomali} ({currentStory.categoryNameEnglish})
                  </dd>
                </div>
                <div>
                  <dt>Author &amp; Editorial Board</dt>
                  <dd>{currentStory.author}</dd>
                </div>
                <div>
                  <dt>Source &amp; Rights Holder</dt>
                  <dd>
                    {currentStory.source} • {currentStory.rightsHolder}
                  </dd>
                </div>
                <div>
                  <dt>Licence &amp; Publication Status</dt>
                  <dd>
                    {currentStory.licence} •{' '}
                    <span className="status-tag">{currentStory.publicationStatus}</span>
                  </dd>
                </div>
                <div>
                  <dt>Structure &amp; Lesson</dt>
                  <dd>
                    {currentStory.sentences.length} segmented Somali sentences •{' '}
                    {currentStory.sentences.reduce((sum, s) => sum + s.words.length, 0)} word tokens
                    • {currentStory.sceneIllustrations.length} scene illustrations •{' '}
                    {currentStory.lessonQuestions.length} interactive questions
                  </dd>
                </div>
              </dl>
            </div>

            {/* Narration Tracks & Forced Alignment Architecture */}
            <div className="story-meta-card">
              <div className="meta-card-header">
                <Volume2 size={18} className="brass-icon" />
                <h3>Narration Tracks &amp; Forced Alignment Status</h3>
              </div>
              <div className="narration-tracks-summary">
                {(['so', 'en'] as StoryLanguageCode[]).map((langCode) => {
                  const track = currentStory.narrationTracks[langCode];
                  const isReady = track.status === 'verified_ready';
                  return (
                    <div key={langCode} className="track-summary-item">
                      <div className="track-summary-top">
                        <strong>
                          <Languages size={15} /> {track.languageLabel}
                        </strong>
                        <span className={`track-status-pill ${isReady ? 'ready' : 'pending'}`}>
                          {isReady ? (
                            <>
                              <CheckCircle2 size={13} /> Verified Ready
                            </>
                          ) : (
                            <>
                              <Clock size={13} /> Pending Studio Recording
                            </>
                          )}
                        </span>
                      </div>
                      <p className="track-summary-detail">
                        <strong>Alignment Pipeline:</strong> {track.alignmentMethod}
                      </p>
                      <p className="track-summary-detail">
                        <strong>Asset Path:</strong> <code>{track.expectedAssetPath}</code>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Child Safety & Privacy Protection */}
            <div className="story-meta-card">
              <div className="meta-card-header">
                <ShieldCheck size={18} className="brass-icon" />
                <h3>Child Safety &amp; Privacy Architecture</h3>
              </div>
              <p className="safety-lead-note">
                {currentStory.privacySafetyNotice.complianceNote}
              </p>
              <ul className="safety-checklist">
                <li>
                  <CheckCircle2 size={15} className="brass-icon" />
                  <span>No public profiles, social feeds, or open messaging in the reader</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="brass-icon" />
                  <span>No collection of children’s personal information</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="brass-icon" />
                  <span>Zero third-party advertising or behavioral tracking scripts</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="brass-icon" />
                  <span>Parent-managed settings gate for audio setup and configuration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

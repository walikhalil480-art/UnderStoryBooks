import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Flame,
  Search,
  MessageSquare
} from 'lucide-react';
import {
  SOMALI_CONSONANTS,
  SOMALI_SHORT_VOWELS,
  SOMALI_LONG_VOWELS,
  SOMALI_PHRASES,
  SomaliLetter,
  PhraseItem
} from '../data/somaliAlphabetData';
import { CHILDREN_STORIES } from '../data/childrenStories';
import { somaliAudio } from '../utils/somaliAudioHelper';
import { loadLocalKidsProgress, saveLocalKidsProgress } from '../utils/kidsProgressManager';
import { KidsLearningProgressPayload } from '../types';

interface LearnSomaliPageProps {
  onNavigateToStories: () => void;
  onNavigateToParents: () => void;
}

type LearnTab = 'alphabet' | 'flashcards' | 'word-builder' | 'phrases';

export const LearnSomaliPage: React.FC<LearnSomaliPageProps> = ({
  onNavigateToStories,
  onNavigateToParents
}) => {
  const [activeTab, setActiveTab] = useState<LearnTab>('alphabet');
  const [alphabetCategory, setAlphabetCategory] = useState<'consonants' | 'short_vowels' | 'long_vowels'>('consonants');
  const [selectedLetter, setSelectedLetter] = useState<SomaliLetter>(SOMALI_CONSONANTS[0]);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardFilter, setFlashcardFilter] = useState<string>('all');
  const [masteredWords, setMasteredWords] = useState<string[]>([]);

  // Word Builder state
  const [builderIndex, setBuilderIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [builderStatus, setBuilderStatus] = useState<'playing' | 'success' | 'retry'>('playing');

  // Phrases state
  const [phraseCategory, setPhraseCategory] = useState<string>('all');
  const [phraseSearch, setPhraseSearch] = useState('');

  // Progress state
  const [progress, setProgress] = useState<KidsLearningProgressPayload>(() => loadLocalKidsProgress());

  // Aggregate rich vocabulary from all 30 stories
  const allVocabCards = useMemo(() => {
    return CHILDREN_STORIES.flatMap((story) =>
      story.vocabulary.map((vocab) => ({
        ...vocab,
        categorySlug: story.categorySlug,
        categoryNameSomali: story.categoryNameSomali,
        storyTitle: story.title
      }))
    );
  }, []);

  const filteredVocabCards = useMemo(() => {
    if (flashcardFilter === 'all') return allVocabCards;
    return allVocabCards.filter((card) => card.categorySlug === flashcardFilter);
  }, [allVocabCards, flashcardFilter]);

  const currentFlashcard = filteredVocabCards[flashcardIndex % Math.max(1, filteredVocabCards.length)];

  // Word builder target list
  const wordBuilderTargets = useMemo(() => {
    return [
      { word: 'BUUG', english: 'Book', hint: 'Wax la akhriyo oo aqoon leh', img: '/illustrations/somali-kids/vocab-buug.svg' },
      { word: 'GEEL', english: 'Camel', hint: 'Xayawaanka qaaliga ah ee reer miyiga', img: '/illustrations/somali-kids/vocab-geel.svg' },
      { word: 'QALIN', english: 'Pen', hint: 'Qalabka wax lagu qoro', img: '/illustrations/somali-kids/vocab-qalin.svg' },
      { word: 'ROOB', english: 'Rain', hint: 'Biyaha cirka ka yimaada xilliga guga', img: '/illustrations/somali-kids/vocab-roob.svg' },
      { word: 'DHIIL', english: 'Milk Vessel', hint: 'Weelka dhaqanka ee caanaha lagu shubo', img: '/illustrations/somali-kids/vocab-dhiil.svg' },
      { word: 'HOOYO', english: 'Mother', hint: 'Macallinka kowaad ee guriga', img: '/illustrations/somali-kids/vocab-hooyo.svg' },
      { word: 'SHIMBIR', english: 'Bird', hint: 'Xayawaan duula oo heesa', img: '/illustrations/somali-kids/vocab-shimbir.svg' },
      { word: 'FARAS', english: 'Horse', hint: 'Xayawaan orod badan oo qurux leh', img: '/illustrations/somali-kids/vocab-faras.svg' },
      { word: 'AABE', english: 'Father', hint: 'Hoggaamiyaha iyo wehelka qoyska', img: '/illustrations/somali-kids/vocab-aabe.svg' }
    ];
  }, []);

  const currentBuilderTarget = wordBuilderTargets[builderIndex % wordBuilderTargets.length];

  // Scrambled letters for Word Builder
  const scrambledLetterOptions = useMemo(() => {
    const letters = currentBuilderTarget.word.split('');
    // Add two random distractor letters
    const extras = ['N', 'S', 'T', 'M', 'K', 'L', 'D'].filter((l) => !letters.includes(l)).slice(0, 2);
    const combined = [...letters, ...extras];
    // Deterministic shuffle
    return combined.sort(() => 0.5 - Math.random());
  }, [currentBuilderTarget]);

  // Audio trigger
  const handlePlayLetter = (letter: SomaliLetter) => {
    setSelectedLetter(letter);
    somaliAudio.playLetter(letter.letter, letter.exampleWord);
  };

  const handlePlayWord = (word: string) => {
    somaliAudio.playWord(word);
  };

  const handlePlayPhrase = (phrase: PhraseItem) => {
    somaliAudio.playPhrase(phrase.id, phrase.somali);
  };

  // Flashcards actions
  const handleNextFlashcard = (knewIt: boolean) => {
    if (knewIt && currentFlashcard) {
      if (!masteredWords.includes(currentFlashcard.somaliWord)) {
        setMasteredWords((prev) => [...prev, currentFlashcard.somaliWord]);
        somaliAudio.playSuccessChime();
        // Award XP
        const newProgress = { ...progress, totalXp: progress.totalXp + 10 };
        setProgress(newProgress);
        saveLocalKidsProgress(newProgress);
      }
    }
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredVocabCards.length);
  };

  // Word builder actions
  const handlePickBuilderLetter = (char: string) => {
    if (builderStatus === 'success') return;
    const next = [...selectedLetters, char];
    setSelectedLetters(next);
    somaliAudio.playLetter(char);

    const target = currentBuilderTarget.word;
    const assembled = next.join('');

    if (assembled === target) {
      setBuilderStatus('success');
      somaliAudio.playSuccessChime();
      const newProgress = { ...progress, totalXp: progress.totalXp + 15 };
      setProgress(newProgress);
      saveLocalKidsProgress(newProgress);
    } else if (assembled.length >= target.length) {
      setBuilderStatus('retry');
      somaliAudio.playTone(300, 'sawtooth', 0.2);
    }
  };

  const handleResetBuilder = () => {
    setSelectedLetters([]);
    setBuilderStatus('playing');
  };

  const handleNextBuilderWord = () => {
    setSelectedLetters([]);
    setBuilderStatus('playing');
    setBuilderIndex((prev) => (prev + 1) % wordBuilderTargets.length);
  };

  // Phrases filtering
  const filteredPhrases = useMemo(() => {
    return SOMALI_PHRASES.filter((p) => {
      const matchCat = phraseCategory === 'all' || p.category === phraseCategory;
      const matchSearch =
        !phraseSearch ||
        p.somali.toLowerCase().includes(phraseSearch.toLowerCase()) ||
        p.english.toLowerCase().includes(phraseSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [phraseCategory, phraseSearch]);

  return (
    <div className="learn-somali-page">
      {/* Hero Header */}
      <section className="learn-somali-hero">
        <div className="container">
          <div className="learn-somali-hero__inner">
            <div className="learn-somali-hero__content">
              <span className="eyebrow-pill">
                <Sparkles size={14} /> BARO AF-SOOMAALIGA • LEARN SOMALI
              </span>
              <h1 className="learn-somali-title">
                The Interactive Somali Language Learning Hub
              </h1>
              <p className="learn-somali-desc">
                Discover the Somali alphabet, master essential vocabulary through interactive audio flashcards,
                and practice everyday conversational phrases in an engaging, child-friendly environment.
              </p>

              {/* Quick Learning Stats */}
              <div className="learn-hero-stats">
                <div className="learn-stat-item">
                  <Flame size={18} className="text-amber-500" />
                  <div>
                    <strong>{Math.max(1, Object.keys(progress.completedStories).length > 0 ? 3 : 1)} Maalmood</strong>
                    <span>Daily Streak</span>
                  </div>
                </div>
                <div className="learn-stat-item">
                  <Award size={18} className="text-emerald-600" />
                  <div>
                    <strong>{progress.totalXp} XP</strong>
                    <span>Learning Points</span>
                  </div>
                </div>
                <div className="learn-stat-item">
                  <BookOpen size={18} className="text-blue-600" />
                  <div>
                    <strong>{masteredWords.length + Object.keys(progress.learnedWords).length} Erey</strong>
                    <span>Mastered Words</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="learn-somali-hero__illustration">
              <div className="learn-hero-card">
                <img
                  src={selectedLetter.pictureUrl}
                  alt={selectedLetter.exampleWord}
                  className="learn-hero-preview-img"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith('/vocab-school_book.svg')) {
                      target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                    }
                  }}
                />
                <div className="learn-hero-preview-meta">
                  <span className="preview-letter">{selectedLetter.letter}</span>
                  <div className="preview-texts">
                    <strong lang="so">{selectedLetter.exampleWord}</strong>
                    <span>{selectedLetter.exampleEnglish}</span>
                  </div>
                  <button
                    type="button"
                    className="audio-circle-btn"
                    onClick={() => handlePlayLetter(selectedLetter)}
                    aria-label={`Listen to ${selectedLetter.letter}`}
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <section className="learn-tabs-bar">
        <div className="container">
          <div className="learn-tabs-list" role="tablist">
            <button
              type="button"
              className={`learn-tab-btn ${activeTab === 'alphabet' ? 'active' : ''}`}
              onClick={() => setActiveTab('alphabet')}
              role="tab"
            >
              <span className="tab-badge">1</span>
              <span>Alifbeetada (Alphabet &amp; Phonics)</span>
            </button>
            <button
              type="button"
              className={`learn-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
              role="tab"
            >
              <span className="tab-badge">2</span>
              <span>Kaadhadhka Ereyada (Flashcards)</span>
            </button>
            <button
              type="button"
              className={`learn-tab-btn ${activeTab === 'word-builder' ? 'active' : ''}`}
              onClick={() => setActiveTab('word-builder')}
              role="tab"
            >
              <span className="tab-badge">3</span>
              <span>Dhismaha Ereyada (Word Builder)</span>
            </button>
            <button
              type="button"
              className={`learn-tab-btn ${activeTab === 'phrases' ? 'active' : ''}`}
              onClick={() => setActiveTab('phrases')}
              role="tab"
            >
              <span className="tab-badge">4</span>
              <span>Weedhaha Maalinlaha ah (Phrases)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Learning Content Area */}
      <div className="container learn-content-area">
        {/* ============================================================== */}
        {/* TAB 1: ALPHABET & PHONICS                                      */}
        {/* ============================================================== */}
        {activeTab === 'alphabet' && (
          <div className="alphabet-panel">
            <div className="alphabet-subnav">
              <button
                type="button"
                className={`subnav-pill ${alphabetCategory === 'consonants' ? 'active' : ''}`}
                onClick={() => setAlphabetCategory('consonants')}
              >
                Shibbanayaasha (21 Consonants)
              </button>
              <button
                type="button"
                className={`subnav-pill ${alphabetCategory === 'short_vowels' ? 'active' : ''}`}
                onClick={() => setAlphabetCategory('short_vowels')}
              >
                Shaqallada Gaagaaban (5 Short Vowels)
              </button>
              <button
                type="button"
                className={`subnav-pill ${alphabetCategory === 'long_vowels' ? 'active' : ''}`}
                onClick={() => setAlphabetCategory('long_vowels')}
              >
                Shaqallada Dhaadheer (5 Long Vowels)
              </button>
            </div>

            <div className="alphabet-grid-wrapper">
              {/* Letters Grid */}
              <div className="alphabet-letters-grid">
                {(alphabetCategory === 'consonants'
                  ? SOMALI_CONSONANTS
                  : alphabetCategory === 'short_vowels'
                  ? SOMALI_SHORT_VOWELS
                  : SOMALI_LONG_VOWELS
                ).map((item) => (
                  <button
                    key={item.letter}
                    type="button"
                    className={`letter-tile ${selectedLetter.letter === item.letter ? 'selected' : ''}`}
                    onClick={() => handlePlayLetter(item)}
                  >
                    <span className="letter-char">{item.letter}</span>
                    <span className="letter-word">{item.exampleWord}</span>
                    <span className="letter-ipa">{item.ipa}</span>
                  </button>
                ))}
              </div>

              {/* Active Letter Spotlight Card */}
              <div className="letter-spotlight-card">
                <div className="spotlight-header">
                  <div>
                    <span className="spotlight-eyebrow">XARAFKA &amp; MACNAHA</span>
                    <h2 className="spotlight-title">
                      {selectedLetter.letter} &mdash; {selectedLetter.nameSomali}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => handlePlayLetter(selectedLetter)}
                  >
                    <Volume2 size={18} />
                    <span>Dhageyso (Listen)</span>
                  </button>
                </div>

                <div className="spotlight-body">
                  <div className="spotlight-img-wrap">
                    <img
                      src={selectedLetter.pictureUrl}
                      alt={selectedLetter.exampleWord}
                      className="spotlight-img"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.endsWith('/vocab-school_book.svg')) {
                          target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                        }
                      }}
                    />
                  </div>

                  <div className="spotlight-details">
                    <div className="detail-row">
                      <span className="label">Ereyga Tusaalaha (Example Word):</span>
                      <strong className="value-somali" lang="so">
                        {selectedLetter.exampleWord}
                      </strong>
                      <span className="value-english">({selectedLetter.exampleEnglish})</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Dhawaaqa (Phonetic Sound):</span>
                      <code className="value-phonetic">{selectedLetter.ipa}</code>
                      <span className="hint-text">{selectedLetter.phoneticHint}</span>
                    </div>

                    <div className="detail-sentence-box">
                      <span className="label">Weedh Tusaale ah (Example Sentence):</span>
                      <p className="sentence-somali" lang="so">
                        &ldquo;{selectedLetter.exampleSentence}&rdquo;
                      </p>
                      <p className="sentence-english">
                        &ldquo;{selectedLetter.exampleSentenceEnglish}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: VOCABULARY FLASHCARDS                                   */}
        {/* ============================================================== */}
        {activeTab === 'flashcards' && (
          <div className="flashcards-panel">
            <div className="flashcards-controls">
              <div className="category-filter-select">
                <label htmlFor="vocab-cat-select">Xul Nooca Ereyada (Category):</label>
                <select
                  id="vocab-cat-select"
                  value={flashcardFilter}
                  onChange={(e) => {
                    setFlashcardFilter(e.target.value);
                    setFlashcardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="flashcard-select"
                >
                  <option value="all">Dhammaan Ereyada (All 120+ Story Words)</option>
                  <option value="xayawaanka">Xayawaanka (Animals)</option>
                  <option value="qoyska">Qoyska (Family)</option>
                  <option value="dugsiga">Dugsiga (School)</option>
                  <option value="saaxiibtinimada">Saaxiibtinimada (Friendship)</option>
                  <option value="dhaqanka">Dhaqanka Soomaaliyeed (Culture)</option>
                  <option value="dabeecadda">Dabeecadda (Nature)</option>
                </select>
              </div>

              <div className="flashcard-counter">
                Kaadhka <strong>{flashcardIndex + 1}</strong> ee {filteredVocabCards.length}
              </div>
            </div>

            {currentFlashcard && (
              <div className="flashcard-interactive-wrapper">
                <div
                  className={`flashcard-3d ${isFlipped ? 'is-flipped' : ''}`}
                  onClick={() => setIsFlipped((prev) => !prev)}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to flip flashcard"
                >
                  {/* Front Side */}
                  <div className="flashcard-face flashcard-front">
                    <span className="flashcard-badge">{currentFlashcard.categoryNameSomali}</span>
                    <img
                      src={currentFlashcard.pictureUrl}
                      alt={currentFlashcard.somaliWord}
                      className="flashcard-img"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.endsWith('/vocab-school_book.svg')) {
                          target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                        }
                      }}
                    />
                    <strong className="flashcard-somali-word" lang="so">
                      {currentFlashcard.somaliWord}
                    </strong>
                    <div className="flashcard-pron">
                      /{currentFlashcard.pronunciationGuide}/
                    </div>
                    <span className="flashcard-hint-click">Riix si aad u aragto macnaha (Click to flip)</span>
                  </div>

                  {/* Back Side */}
                  <div className="flashcard-face flashcard-back">
                    <span className="flashcard-badge">Macnaha &amp; Tusaalaha</span>
                    <h3 className="flashcard-english-meaning">{currentFlashcard.englishMeaning}</h3>
                    <div className="flashcard-pos">{currentFlashcard.partOfSpeech}</div>
                    <div className="flashcard-quote">
                      <p lang="so">&ldquo;{currentFlashcard.exampleSomali}&rdquo;</p>
                      <span>&ldquo;{currentFlashcard.exampleEnglish}&rdquo;</span>
                    </div>
                    <span className="flashcard-story-source">
                      Laga soo xigtay sheekada: <em>{currentFlashcard.storyTitle}</em>
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flashcard-actions-bar">
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => handlePlayWord(currentFlashcard.somaliWord)}
                  >
                    <Volume2 size={18} />
                    <span>Ku Dhawaaq (Audio)</span>
                  </button>

                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => handleNextFlashcard(false)}
                  >
                    <RotateCcw size={16} />
                    <span>Ku Celi Mar Kale (Study Again)</span>
                  </button>

                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => handleNextFlashcard(true)}
                  >
                    <CheckCircle2 size={18} />
                    <span>Waan Garanayaa! (+10 XP)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INTERACTIVE WORD BUILDER                                */}
        {/* ============================================================== */}
        {activeTab === 'word-builder' && (
          <div className="word-builder-panel">
            <div className="word-builder-header">
              <div>
                <span className="eyebrow">DHISMAHA EREYADA • SPELLING CHALLENGE</span>
                <h2>Kala Dooro Xarfaha si aad u Qorto Ereyga</h2>
                <p>
                  Eeg sawirka hoose, kadibna guji xarfaha saxda ah si aad u dhammaystirto ereyga Af-Soomaaliga.
                </p>
              </div>
              <div className="builder-xp-badge">
                <Sparkles size={16} />
                <span>+15 XP Erey kasta</span>
              </div>
            </div>

            <div className="word-builder-card">
              <div className="builder-img-preview">
                <img
                  src={currentBuilderTarget.img}
                  alt={currentBuilderTarget.english}
                  className="builder-target-img"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith('/vocab-school_book.svg')) {
                      target.src = '/illustrations/somali-kids/vocab-school_book.svg';
                    }
                  }}
                />
                <span className="builder-meaning-hint">{currentBuilderTarget.english}</span>
                <span className="builder-context-hint">&ldquo;{currentBuilderTarget.hint}&rdquo;</span>
              </div>

              {/* Target slots */}
              <div className="builder-slots-row">
                {currentBuilderTarget.word.split('').map((_, idx) => {
                  const filledLetter = selectedLetters[idx] || '';
                  return (
                    <div
                      key={idx}
                      className={`builder-slot ${filledLetter ? 'is-filled' : ''} ${
                        builderStatus === 'success'
                          ? 'is-success'
                          : builderStatus === 'retry'
                          ? 'is-retry'
                          : ''
                      }`}
                    >
                      {filledLetter}
                    </div>
                  );
                })}
              </div>

              {/* Scrambled Options */}
              <div className="builder-options-row">
                {scrambledLetterOptions.map((letter, i) => (
                  <button
                    key={i}
                    type="button"
                    className="builder-letter-btn"
                    onClick={() => handlePickBuilderLetter(letter)}
                    disabled={builderStatus === 'success'}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Status Message */}
              {builderStatus === 'success' && (
                <div className="builder-feedback is-success">
                  <CheckCircle2 size={24} />
                  <div>
                    <strong>Waa Sax! Hambalyo! (+15 XP)</strong>
                    <span>Waxaad si fiican u dhistay ereyga &ldquo;{currentBuilderTarget.word}&rdquo;.</span>
                  </div>
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={handleNextBuilderWord}
                  >
                    <span>Ereyga Xiga (Next Word)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {builderStatus === 'retry' && (
                <div className="builder-feedback is-retry">
                  <div>
                    <strong>Isku day mar kale!</strong>
                    <span>Isku xirka xarfuhu weli ma saxna. Guji batoonka si aad u nadiifiso.</span>
                  </div>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={handleResetBuilder}
                  >
                    <RotateCcw size={16} />
                    <span>Nadiifi (Clear)</span>
                  </button>
                </div>
              )}

              {builderStatus === 'playing' && selectedLetters.length > 0 && (
                <div className="builder-actions">
                  <button
                    type="button"
                    className="btn-text"
                    onClick={handleResetBuilder}
                  >
                    <RotateCcw size={14} />
                    <span>Dib u bilow ereygan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: EVERYDAY CONVERSATIONAL PHRASES                          */}
        {/* ============================================================== */}
        {activeTab === 'phrases' && (
          <div className="phrases-panel">
            <div className="phrases-toolbar">
              <div className="phrases-filter-pills">
                <button
                  type="button"
                  className={`pill-btn ${phraseCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setPhraseCategory('all')}
                >
                  Dhammaan (All)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${phraseCategory === 'salaan' ? 'active' : ''}`}
                  onClick={() => setPhraseCategory('salaan')}
                >
                  Salaanta (Greetings)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${phraseCategory === 'asluub' ? 'active' : ''}`}
                  onClick={() => setPhraseCategory('asluub')}
                >
                  Asluubta (Courtesy)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${phraseCategory === 'tiro' ? 'active' : ''}`}
                  onClick={() => setPhraseCategory('tiro')}
                >
                  Tirooyinka (Numbers 1-10)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${phraseCategory === 'midab' ? 'active' : ''}`}
                  onClick={() => setPhraseCategory('midab')}
                >
                  Midabbada (Colors)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${phraseCategory === 'maalmo' ? 'active' : ''}`}
                  onClick={() => setPhraseCategory('maalmo')}
                >
                  Maalmaha (Days of Week)
                </button>
              </div>

              <div className="phrases-search-box">
                <Search size={16} />
                <input
                  type="search"
                  value={phraseSearch}
                  onChange={(e) => setPhraseSearch(e.target.value)}
                  placeholder="Raadi weedho ama macno..."
                  className="phrases-search-input"
                />
              </div>
            </div>

            <div className="phrases-cards-grid">
              {filteredPhrases.map((phrase) => (
                <div key={phrase.id} className="phrase-card">
                  <div className="phrase-card__main">
                    <strong className="phrase-somali" lang="so">
                      {phrase.somali}
                    </strong>
                    <div className="phrase-phonetic">/{phrase.phonetic}/</div>
                    <span className="phrase-english">{phrase.english}</span>
                  </div>

                  <button
                    type="button"
                    className="audio-circle-btn"
                    onClick={() => handlePlayPhrase(phrase)}
                    aria-label={`Listen to ${phrase.somali}`}
                    title="Dhageyso dhawaaqa"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Banner linking to Stories & Parents */}
      <section className="learn-cta-banner">
        <div className="container">
          <div className="learn-cta-card">
            <div className="learn-cta-text">
              <h3>Diyaar ma u tahay inaad sheekooyinka akhriso?</h3>
              <p>
                Dhaaf xarfaha oo u gudub 30-ka sheeko ee carruurta loogu talagalay oo ay weheliyaan sawirro iyo maqal cod ah.
              </p>
            </div>
            <div className="learn-cta-buttons">
              <button
                type="button"
                className="button button--primary"
                onClick={onNavigateToStories}
              >
                <BookOpen size={16} />
                <span>Sahmi Sheekooyinka (30 Stories)</span>
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={onNavigateToParents}
              >
                <span>Xarunta Waalidiinta (For Parents)</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

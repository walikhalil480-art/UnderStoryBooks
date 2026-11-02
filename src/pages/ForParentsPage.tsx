import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  Heart,
  Settings,
  Printer,
  CheckCircle2,
  HelpCircle,
  Clock,
  Volume2,
  RotateCcw,
  Star,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { createInitialKidsProgress, loadLocalKidsProgress, saveLocalKidsProgress } from '../utils/kidsProgressManager';
import { KidsLearningProgressPayload } from '../types';
import { CHILDREN_STORIES } from '../data/childrenStories';

interface ForParentsPageProps {
  onNavigateToStories: () => void;
  onNavigateToLearnSomali: () => void;
}

export const ForParentsPage: React.FC<ForParentsPageProps> = ({
  onNavigateToStories,
  onNavigateToLearnSomali
}) => {
  const [kidsProgress, setKidsProgress] = useState<KidsLearningProgressPayload>(() =>
    loadLocalKidsProgress()
  );

  // Level Finder Quiz State
  const [childAge, setChildAge] = useState<string>('6-8');
  const [somaliFluency, setSomaliFluency] = useState<string>('intermediate');
  const [readingConfidence, setReadingConfidence] = useState<string>('with-help');
  const [recommendedLevel, setRecommendedLevel] = useState<number | null>(null);

  // Certificate Generator State
  const [childName, setChildName] = useState<string>('Ayaan Maxamed');
  const [certificateTitle, setCertificateTitle] = useState<string>('Shahaadada Akhriska ee eBaro 2026');
  const [certificateMilestone, setCertificateMilestone] = useState<string>(
    'Dhammaystiray 10 Sheeko oo Af-Soomaali ah (Completed 10 Somali Stories)'
  );

  // Parental Preferences
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(20);
  const [narrationSpeed, setNarrationSpeed] = useState<string>('1.0x');
  const [translationMode, setTranslationMode] = useState<string>('bilingual');
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState<boolean>(false);

  const completedStoriesCount = Object.keys(kidsProgress.completedStories).length;
  const totalStars = Object.values(kidsProgress.completedStories).reduce(
    (sum, val) => sum + val.starsEarned,
    0
  );
  const totalLearnedWordsCount = Object.keys(kidsProgress.learnedWords).length;
  const streakDays = Math.max(1, completedStoriesCount > 0 ? 3 : 1);

  const handleCalculateRecommendedLevel = () => {
    if (childAge === '3-5' || somaliFluency === 'beginner') {
      setRecommendedLevel(1);
    } else if (childAge === '9-12' && somaliFluency === 'advanced') {
      setRecommendedLevel(3);
    } else {
      setRecommendedLevel(2);
    }
  };

  const handleSaveSettings = () => {
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 4000);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Ma hubtaa inaad dib u bilowdo dhibcaha iyo horumarka akhriska? (Are you sure you want to reset reading progress?)'
      )
    ) {
      const resetPayload = createInitialKidsProgress();
      setKidsProgress(resetPayload);
      saveLocalKidsProgress(resetPayload);
    }
  };

  return (
    <div className="for-parents-page">
      {/* Hero Header */}
      <section className="for-parents-hero">
        <div className="container">
          <div className="for-parents-hero__inner">
            <span className="eyebrow-pill">
              <ShieldCheck size={14} /> XARUNTA WAALIDIINTA &amp; BARAYAASHA • PARENTS &amp; EDUCATORS
            </span>
            <h1 className="for-parents-hero__title">
              Nurturing Bilingual Literacy &amp; Somali Cultural Pride
            </h1>
            <p className="for-parents-hero__desc">
              Welcome to the eBaro Parent Trust Center. Here you can monitor your child&apos;s reading progress,
              tailor reading levels to their development, print official reading certificates, and learn about
              our research-backed bilingual pedagogy.
            </p>

            <div className="for-parents-metrics-bar">
              <div className="parent-metric-box">
                <BookOpen size={20} className="text-emerald-700" />
                <div>
                  <strong>{completedStoriesCount} / 30</strong>
                  <span>Sheekooyin La Dhammeeyay</span>
                </div>
              </div>
              <div className="parent-metric-box">
                <Star size={20} className="text-amber-500" />
                <div>
                  <strong>{totalStars} Xiddigood</strong>
                  <span>Stars &amp; Mastery</span>
                </div>
              </div>
              <div className="parent-metric-box">
                <Flame size={20} className="text-rose-500" />
                <div>
                  <strong>{streakDays} Maalmood</strong>
                  <span>Continuous Streak</span>
                </div>
              </div>
              <div className="parent-metric-box">
                <Sparkles size={20} className="text-indigo-600" />
                <div>
                  <strong>{kidsProgress.totalXp} XP</strong>
                  <span>Total Knowledge XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container for-parents-content">
        {/* ============================================================== */}
        {/* SECTION 1: THE EBARO EDUCATIONAL PHILOSOPHY                     */}
        {/* ============================================================== */}
        <section className="parents-section" id="pedagogy">
          <div className="section-head-clean">
            <span className="section-eyebrow">HAB-DHISMEEDKA WAXBARASHADA • PEDAGOGY</span>
            <h2>How eBaro Teaches Children Somali Through Stories</h2>
            <p>
              Designed in collaboration with Somali language educators, linguists, and children&apos;s book authors.
            </p>
          </div>

          <div className="pedagogy-pillars-grid">
            <div className="pedagogy-pillar-card">
              <div className="pillar-icon-box bg-emerald-50 text-emerald-800">
                <Heart size={24} />
              </div>
              <h3>1. Dhaqanka &amp; Qiimaha (Heritage &amp; Identity)</h3>
              <p>
                Stories feature rich cultural symbols: camels (Dalmar), traditional milk vessels (dhiil),
                Indian Ocean dhows, rain celebrations (roobka guga), and oral wisdom passed down through generations.
              </p>
            </div>

            <div className="pedagogy-pillar-card">
              <div className="pillar-icon-box bg-blue-50 text-blue-800">
                <BookOpen size={24} />
              </div>
              <h3>2. Scaffolding &amp; Bilingual Support</h3>
              <p>
                Children outside Somalia or in the diaspora benefit from sentence-by-sentence English translations,
                phonetic pronunciation guides, and context clues that build confidence without replacing Somali immersion.
              </p>
            </div>

            <div className="pedagogy-pillar-card">
              <div className="pillar-icon-box bg-amber-50 text-amber-800">
                <Sparkles size={24} />
              </div>
              <h3>3. Gamified Mastery &amp; Quizzes</h3>
              <p>
                Every story includes interactive vocabulary flashcards, sentence-completion drills, and sequencing games
                that reinforce reading comprehension, memory retention, and critical thinking.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: READING LEVEL GUIDE & LEVEL FINDER                   */}
        {/* ============================================================== */}
        <section className="parents-section" id="level-guide">
          <div className="section-head-clean">
            <span className="section-eyebrow">HEERARKA AKHRISKA • READING LEVEL GUIDE</span>
            <h2>Select the Right Reading Level for Your Child</h2>
            <p>
              Our 30 stories are split across three calibrated reading stages. Use our interactive questionnaire below
              to find where your child should begin.
            </p>
          </div>

          <div className="reading-levels-display-grid">
            <div className="level-card level-card--1">
              <div className="level-card__badge">Heerka 1 • Bilowga</div>
              <h3>Ages 3 &ndash; 6</h3>
              <p className="level-card__focus">Focus: Letter sounds, single words, basic sentences.</p>
              <ul className="level-card__features">
                <li>✓ Large, expressive picture-book illustrations</li>
                <li>✓ 3 to 4 short sentences per story</li>
                <li>✓ 4 core vocabulary words with pictures</li>
                <li>✓ 10 stories including <em>Geelkii yaraa</em> &amp; <em>Bisaddii Luula</em></li>
              </ul>
            </div>

            <div className="level-card level-card--2">
              <div className="level-card__badge">Heerka 2 • Akhriste Yar</div>
              <h3>Ages 6 &ndash; 9</h3>
              <p className="level-card__focus">Focus: Story comprehension, moral lessons, questions.</p>
              <ul className="level-card__features">
                <li>✓ Expanding narrative dialogue</li>
                <li>✓ 5 to 7 sentences per story</li>
                <li>✓ Rich cultural themes (School, helping elders, animals)</li>
                <li>✓ 10 stories including <em>Safarkii Doonta</em> &amp; <em>Roobka Guga</em></li>
              </ul>
            </div>

            <div className="level-card level-card--3">
              <div className="level-card__badge">Heerka 3 • Akhriste Horumarsan</div>
              <h3>Ages 9 &ndash; 12</h3>
              <p className="level-card__focus">Focus: Advanced vocabulary, proverbs, descriptive passages.</p>
              <ul className="level-card__features">
                <li>✓ Multi-paragraph storytelling</li>
                <li>✓ Traditional proverbs and figurative language</li>
                <li>✓ Challenging critical-thinking comprehension quizzes</li>
                <li>✓ 10 stories including <em>Libaxa iyo Daanyeerka</em> &amp; <em>Xeebta Cad</em></li>
              </ul>
            </div>
          </div>

          {/* Interactive Level Assessment Tool */}
          <div className="level-finder-box">
            <div className="level-finder-box__head">
              <HelpCircle size={20} className="text-emerald-700" />
              <h3>Interactive Level Assessment (Find Your Child&apos;s Level)</h3>
            </div>

            <div className="level-finder-form">
              <div className="form-group">
                <label>Da&apos;da Ilmaha (Child&apos;s Age):</label>
                <select value={childAge} onChange={(e) => setChildAge(e.target.value)}>
                  <option value="3-5">3 &ndash; 5 years old (Early Reader)</option>
                  <option value="6-8">6 &ndash; 8 years old (Primary School)</option>
                  <option value="9-12">9 &ndash; 12 years old (Advanced Reader)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fahamka Af-Soomaaliga (Somali Comprehension):</label>
                <select value={somaliFluency} onChange={(e) => setSomaliFluency(e.target.value)}>
                  <option value="beginner">Beginner (Understands a few words)</option>
                  <option value="intermediate">Intermediate (Understands simple conversations)</option>
                  <option value="advanced">Fluent (Understands full stories comfortably)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kalsoonida Akhriska (Reading Confidence):</label>
                <select value={readingConfidence} onChange={(e) => setReadingConfidence(e.target.value)}>
                  <option value="needs-audio">Prefers listening to narration while looking at pictures</option>
                  <option value="with-help">Reads aloud with parental assistance</option>
                  <option value="independent">Reads independently</option>
                </select>
              </div>

              <button
                type="button"
                className="button button--primary"
                onClick={handleCalculateRecommendedLevel}
              >
                <span>Xisaabi Heerka Ugu Habboon (Calculate Level)</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {recommendedLevel && (
              <div className="recommended-level-result">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <div>
                  <strong>
                    Waxaan ku talinaynaa: Heerka {recommendedLevel} (Level {recommendedLevel})
                  </strong>
                  <p>
                    {recommendedLevel === 1 &&
                      'Ku bilow Heerka 1 (Bilowga) si ilmahaagu u barto dhawaaqa xarfaha iyo ereyada aasaasiga ah ee sawirrada leh.'}
                    {recommendedLevel === 2 &&
                      'Ku bilow Heerka 2 (Akhriste Yar) si ilmahaagu u xoojiyo fahamka sheekooyinka iyo xiriirka weedhaha.'}
                    {recommendedLevel === 3 &&
                      'Ilmahaagu wuxuu diyaar u yahay Heerka 3 (Akhriste Horumarsan) oo leh ereyo hodan ah iyo su’aalo qotodheer.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={onNavigateToStories}
                >
                  <span>Fur Sheekooyinka Heerka {recommendedLevel}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: PRINTABLE CERTIFICATE GENERATOR                      */}
        {/* ============================================================== */}
        <section className="parents-section" id="certificate">
          <div className="section-head-clean">
            <span className="section-eyebrow">SHAHAADADA GUUSHA • CERTIFICATE OF ACHIEVEMENT</span>
            <h2>Celebrate Reading Milestones with Official Certificates</h2>
            <p>
              Type your child&apos;s name and print a beautifully rendered eBaro Certificate of Reading Excellence.
            </p>
          </div>

          <div className="certificate-customizer-grid">
            <div className="certificate-form-card">
              <h3>Habee Shahaadada (Customize Certificate)</h3>

              <div className="form-field">
                <label htmlFor="cert-name-input">Magaca Ilmaha (Child&apos;s Full Name):</label>
                <input
                  id="cert-name-input"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Ayaan Maxamed"
                  className="cert-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="cert-milestone-select">Heerka Guusha (Milestone Earned):</label>
                <select
                  id="cert-milestone-select"
                  value={certificateMilestone}
                  onChange={(e) => setCertificateMilestone(e.target.value)}
                  className="cert-select"
                >
                  <option value="Dhammaystiray 10 Sheeko oo Af-Soomaali ah (Completed 10 Somali Stories)">
                    Dhammaystiray 10 Sheeko (Completed 10 Stories)
                  </option>
                  <option value="Xafiday 50 Erey oo Af-Soomaali ah (Mastered 50 Somali Words)">
                    Xafiday 50 Erey oo Cusub (Mastered 50 Words)
                  </option>
                  <option value="Geesiga Akhriska ee eBaro 2026 (eBaro Reading Champion 2026)">
                    Geesiga Akhriska (Reading Champion 2026)
                  </option>
                  <option value="Xiddigta Alifbeetada & Dugsiga (Alphabet & Phonics Master)">
                    Xiddigta Alifbeetada (Alphabet Master)
                  </option>
                </select>
              </div>

              <div className="form-actions-cert">
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handlePrintCertificate}
                >
                  <Printer size={18} />
                  <span>Daabac Shahaadada (Print / Save PDF)</span>
                </button>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="certificate-preview-frame" id="printable-certificate">
              <div className="certificate-border-outer">
                <div className="certificate-border-inner">
                  <div className="cert-top-emblem">
                    <Award size={36} className="text-amber-600" />
                    <span className="cert-brand">eBaro &bull; Digital Somali Library</span>
                  </div>

                  <h3 className="cert-main-title">SHAHAADO SHARAF • CERTIFICATE OF ACHIEVEMENT</h3>
                  <p className="cert-subtitle">Shahaadadani waxay caddaynaysaa in ardayga da&apos;da yar:</p>

                  <h2 className="cert-recipient-name">{childName || 'Ardayga Qaaliga ah'}</h2>

                  <p className="cert-milestone-text">
                    uu si guul leh oo dadaal ku dheehan yahay u dhammaystiray:
                  </p>
                  <div className="cert-milestone-highlight">{certificateMilestone}</div>

                  <div className="cert-signatures-row">
                    <div className="cert-sig-block">
                      <div className="cert-sig-line">Taariikhda: {new Date().toLocaleDateString()}</div>
                      <span>Date Issued</span>
                    </div>
                    <div className="cert-seal-badge">
                      <div className="cert-seal-circle">
                        <span>eBaro</span>
                        <span>★ 2026 ★</span>
                        <span>Verified</span>
                      </div>
                    </div>
                    <div className="cert-sig-block">
                      <div className="cert-sig-line">Guddiga Waxbarashada</div>
                      <span>eBaro Literacy Committee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: PARENTAL SETTINGS & READING GOALS                    */}
        {/* ============================================================== */}
        <section className="parents-section" id="settings">
          <div className="section-head-clean">
            <span className="section-eyebrow">HABAYNTA WAALIDKA • PARENTAL CONTROLS</span>
            <h2>Reading Time Goals &amp; Immersion Settings</h2>
            <p>Tailor narration speeds and translation display to your household preferences.</p>
          </div>

          <div className="parent-settings-card">
            <div className="setting-row">
              <div className="setting-info">
                <strong>Hadafka Akhriska Maalinlaha ah (Daily Reading Goal)</strong>
                <span>Recommended daily screen-time commitment for healthy habit building.</span>
              </div>
              <div className="setting-control">
                {[10, 15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    className={`setting-pill-btn ${dailyGoalMinutes === mins ? 'active' : ''}`}
                    onClick={() => setDailyGoalMinutes(mins)}
                  >
                    {mins} Daqiiqo (min)
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <strong>Xawaaraha Maqalka Sheekada (Audio Narration Pace)</strong>
                <span>Slightly slower narration allows beginning readers to follow word-by-word.</span>
              </div>
              <div className="setting-control">
                {['0.8x (Slow)', '1.0x (Normal)', '1.2x (Fast)'].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    className={`setting-pill-btn ${narrationSpeed === speed ? 'active' : ''}`}
                    onClick={() => setNarrationSpeed(speed)}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <strong>Muujinta Af-Ingiriisiga (Translation Support)</strong>
                <span>Choose whether English helper translations appear by default or only when requested.</span>
              </div>
              <div className="setting-control">
                {[
                  { id: 'bilingual', label: 'Bilingual (Show Somali & English)' },
                  { id: 'somali-only', label: 'Immersion (Somali Only by Default)' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={`setting-pill-btn ${translationMode === mode.id ? 'active' : ''}`}
                    onClick={() => setTranslationMode(mode.id)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-footer">
              <button
                type="button"
                className="button button--primary"
                onClick={handleSaveSettings}
              >
                <span>Keydi Habaynta (Save Preferences)</span>
              </button>

              <button
                type="button"
                className="button button--secondary text-rose-700"
                onClick={handleResetProgress}
              >
                <RotateCcw size={16} />
                <span>Dib u Bilow Horumarka (Reset Reading Stats)</span>
              </button>

              {savedSettingsSuccess && (
                <span className="save-success-msg">
                  <CheckCircle2 size={16} /> Habaynta si guul leh ayaa loo keydiyay!
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 5: POST-READING DISCUSSION PROMPTS FOR PARENTS         */}
        {/* ============================================================== */}
        <section className="parents-section" id="prompts">
          <div className="section-head-clean">
            <span className="section-eyebrow">WADA-SHEEKAYSI • DISCUSSION PROMPTS</span>
            <h2>Meaningful Questions to Ask Your Child After Each Story</h2>
            <p>Deepen your child&apos;s moral understanding and spoken Somali with these quick dinner-table questions.</p>
          </div>

          <div className="discussion-prompts-grid">
            <div className="prompt-card">
              <span className="prompt-number">1</span>
              <h4>&ldquo;Waa maxay casharka sheekadu ina bartay?&rdquo;</h4>
              <p>What lesson did the characters learn, and how can we practice it at home or school?</p>
            </div>

            <div className="prompt-card">
              <span className="prompt-number">2</span>
              <h4>&ldquo;Keebaa ahaa qofka ama xayawaanka aad ugu jeceshahay?&rdquo;</h4>
              <p>Who was your favorite character and why? How did they show kindness or bravery?</p>
            </div>

            <div className="prompt-card">
              <span className="prompt-number">3</span>
              <h4>&ldquo;Sheeg 2 erey oo cusub oo aad maanta baratay.&rdquo;</h4>
              <p>Name 2 new Somali words you discovered today, and use them together in a fun sentence!</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Navigation CTA */}
      <section className="parents-bottom-cta">
        <div className="container">
          <div className="parents-cta-card">
            <div className="parents-cta-text">
              <h3>Start Your Family&apos;s Daily Somali Reading Habit Today</h3>
              <p>
                Browse through 30 fully illustrated stories, interactive vocabulary exercises, and spoken audio narration.
              </p>
            </div>
            <div className="parents-cta-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={onNavigateToStories}
              >
                <BookOpen size={16} />
                <span>Explore the 30 Stories</span>
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={onNavigateToLearnSomali}
              >
                <Sparkles size={16} />
                <span>Interactive Alphabet Hub</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

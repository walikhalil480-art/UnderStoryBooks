import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const BASE_DIR = process.cwd();
const PUBLIC_ILLUST_DIR = path.join(BASE_DIR, 'public', 'illustrations', 'somali-kids');
const DB_PATH = path.join(BASE_DIR, 'server', 'data', 'folio.sqlite');

console.log('================================================================');
console.log('VERIFYING SOMALI KIDS MAJOR UPGRADE: 30 STORIES, 147 ART ASSETS,');
console.log('DUOLINGO-STYLE LESSONS & SERVER-SIDE SQLITE PROGRESS PERSISTENCE');
console.log('================================================================\n');

// 1. Verify Illustrations Directory
if (!fs.existsSync(PUBLIC_ILLUST_DIR)) {
  console.error('❌ FAIL: public/illustrations/somali-kids directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(PUBLIC_ILLUST_DIR);
console.log(`[1] Found ${files.length} illustration files in public/illustrations/somali-kids/`);

const coverSvgCount = files.filter((f) => f.endsWith('-cover.svg') || f.endsWith('-cover.jpg')).length;
const sceneSvgCount = files.filter((f) => f.includes('-scene-')).length;
const vocabSvgCount = files.filter((f) => f.startsWith('vocab-')).length;
console.log(`    - Covers: ${coverSvgCount} (target: 30)`);
console.log(`    - Scenes: ${sceneSvgCount} (target: 90)`);
console.log(`    - Vocabulary SVGs: ${vocabSvgCount} (target: 24)`);

if (coverSvgCount < 30 || sceneSvgCount < 90 || vocabSvgCount < 24) {
  console.error('❌ FAIL: Missing required illustration files!');
  process.exit(1);
}
console.log('    ✓ All 144+ illustration files verified on disk.\n');

// 2. Verify SQLite Database
if (!fs.existsSync(DB_PATH)) {
  console.error('❌ FAIL: SQLite database file not found at:', DB_PATH);
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
const storyRows = db.prepare('SELECT id, title, english_title, level_id, category_slug, learning_path_order, xp_reward FROM children_stories ORDER BY learning_path_order ASC').all();
console.log(`[2] SQLite 'children_stories' Table: ${storyRows.length} stories synced.`);

if (storyRows.length < 30) {
  console.error(`❌ FAIL: Expected at least 30 stories in SQLite, found ${storyRows.length}`);
  process.exit(1);
}

const levelCounts = { 'level-1': 0, 'level-2': 0, 'level-3': 0 };
for (const row of storyRows) {
  if (levelCounts[row.level_id] !== undefined) {
    levelCounts[row.level_id]++;
  }
}
console.log(`    - Level 1 (Bilowga): ${levelCounts['level-1']} stories`);
console.log(`    - Level 2 (Akhriste Yar): ${levelCounts['level-2']} stories`);
console.log(`    - Level 3 (Akhriste Horumarsan): ${levelCounts['level-3']} stories`);

// Check tables exist
const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('kids_learning_progress', 'kids_lesson_attempts')").all();
console.log(`    - Found tables: ${tableCheck.map((t) => t.name).join(', ')}`);
if (tableCheck.length < 2) {
  console.error('❌ FAIL: Missing kids_learning_progress or kids_lesson_attempts SQLite tables!');
  process.exit(1);
}
console.log('    ✓ SQLite schema & records verified successfully.\n');

// 3. Test HTTP API Endpoints against running Vite server
const BASE_URL = 'http://127.0.0.1:5173';

async function testApi() {
  console.log(`[3] Testing API Endpoints at ${BASE_URL}...`);
  try {
    // GET /api/children-stories
    const listRes = await fetch(`${BASE_URL}/api/children-stories`);
    if (!listRes.ok) throw new Error(`GET /api/children-stories failed with status ${listRes.status}`);
    const listData = await listRes.json();
    console.log(`    ✓ GET /api/children-stories returned ${listData.stories?.length} stories.`);

    if (listData.stories?.length < 30) {
      throw new Error(`Expected at least 30 stories, received ${listData.stories?.length}`);
    }

    // Verify Cover Uniqueness (Zero duplicate covers)
    const coverUrls = listData.stories.map((s) => s.coverIllustrationUrl);
    const uniqueCovers = new Set(coverUrls);
    console.log(`    ✓ Cover URL Uniqueness: ${uniqueCovers.size} unique covers across ${coverUrls.length} stories.`);
    if (uniqueCovers.size !== coverUrls.length) {
      throw new Error(`Duplicate cover URLs detected! Unique: ${uniqueCovers.size}, Total: ${coverUrls.length}`);
    }

    // Verify Scene Illustrations & Vocabulary on every story
    for (const story of listData.stories) {
      if (!Array.isArray(story.sceneIllustrations) || story.sceneIllustrations.length !== 3) {
        throw new Error(`Story "${story.id}" missing 3 scene illustrations!`);
      }
      if (!Array.isArray(story.vocabulary) || story.vocabulary.length < 4) {
        throw new Error(`Story "${story.id}" missing 4 vocabulary items!`);
      }
      if (!Array.isArray(story.lessonQuestions) || story.lessonQuestions.length < 7) {
        throw new Error(`Story "${story.id}" missing required interactive questions!`);
      }
    }
    console.log('    ✓ All 30 stories verified: each has 3 scene illustrations, 4 vocabulary items, and complete interactive lesson questions.');

    // GET /api/children-stories/geelkii-yaraa
    const singleRes = await fetch(`${BASE_URL}/api/children-stories/geelkii-yaraa`);
    if (!singleRes.ok) throw new Error(`GET /api/children-stories/geelkii-yaraa failed: ${singleRes.status}`);
    const singleData = await singleRes.json();
    console.log(`    ✓ GET /api/children-stories/geelkii-yaraa returned story: "${singleData.story?.title}" (${singleData.story?.englishTitle}).`);

    // GET /api/kids/progress
    const progressRes = await fetch(`${BASE_URL}/api/kids/progress`);
    if (!progressRes.ok) throw new Error(`GET /api/kids/progress failed: ${progressRes.status}`);
    const progressData = await progressRes.json();
    console.log(`    ✓ GET /api/kids/progress returned payload (dailyGoalXp: ${progressData.progress?.dailyGoalXp}).`);

    // POST /api/children-stories/geelkii-yaraa/lesson-submit
    const firstStory = singleData.story;
    const testAnswers = firstStory.lessonQuestions.map((q) => {
      let resp = q.correctAnswer;
      if (q.type === 'word_matching' && q.matchingPairs) {
        resp = {};
        for (const pair of q.matchingPairs) {
          resp[pair.somali] = pair.english;
        }
      } else if (q.type === 'story_ordering' && q.orderEvents) {
        resp = [...q.orderEvents].sort((a, b) => a.correctPosition - b.correctPosition).map((e) => e.id);
      } else if (q.type === 'true_false') {
        resp = q.correctBoolean ? 'Run (True)' : 'Been (False)';
      }
      return {
        questionId: q.id,
        userResponse: resp
      };
    });

    const submitRes = await fetch(`${BASE_URL}/api/children-stories/geelkii-yaraa/lesson-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: testAnswers })
    });

    if (!submitRes.ok) throw new Error(`POST /api/children-stories/geelkii-yaraa/lesson-submit failed: ${submitRes.status}`);
    const submitData = await submitRes.json();
    console.log(`    ✓ POST /api/children-stories/geelkii-yaraa/lesson-submit verified successfully:`);
    console.log(`      - Score: ${submitData.scorePercent}% (${submitData.correctCount}/${submitData.totalQuestions} correct)`);
    console.log(`      - Stars Earned: ${submitData.starsEarned} ★`);
    console.log(`      - XP Earned: +${submitData.xpEarned} XP`);
    console.log(`      - Newly Learned Words: ${submitData.newlyLearnedWords?.length} words`);
    console.log(`      - Graded Answers: ${submitData.gradedAnswers?.length} questions graded`);

    if (submitData.scorePercent !== 100 || submitData.starsEarned !== 3) {
      throw new Error(`Expected 100% score and 3 stars on perfect answer submission, got ${submitData.scorePercent}%, ${submitData.starsEarned} stars`);
    }

    console.log('\n================================================================');
    console.log('✅ ALL TESTS PASSED: SOMALI KIDS UPGRADE COMPLETE & VERIFIED!');
    console.log('================================================================');
  } catch (err) {
    console.error('❌ API Test Error:', err.message);
    process.exit(1);
  }
}

testApi();

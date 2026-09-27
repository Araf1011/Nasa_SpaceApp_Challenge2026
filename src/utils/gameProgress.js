/**
 * Mission Game Progress — localStorage-backed XP, unlocks & completion state.
 * No account needed; one JSON blob keyed by relic id.
 */

const STORAGE_KEY = 'cosmic_game_progress';

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function emptyMission() {
  return { unlockedIndex: 0, completedChapters: [], xp: 0, completed: false, attempts: {} };
}

export function getMissionProgress(relicId) {
  const all = loadAll();
  return all[relicId] ? { ...emptyMission(), ...all[relicId] } : emptyMission();
}

/**
 * Records the result of a challenge attempt.
 * Correct + first try: +xp base +50 bonus. Correct after retries: +xp base only.
 * Wrong: no XP, no penalty, chapter stays open for retry.
 * Returns { correct, xpGained, chapterUnlockedNext, totalMissionXp }
 */
export function recordChallengeAttempt(relicId, chapterIndex, chapter, correct) {
  const all = loadAll();
  const mission = all[relicId] ? { ...emptyMission(), ...all[relicId] } : emptyMission();
  const attemptsSoFar = mission.attempts[chapter.id] || 0;

  if (!correct) {
    mission.attempts[chapter.id] = attemptsSoFar + 1;
    all[relicId] = mission;
    saveAll(all);
    return { correct: false, xpGained: 0, chapterUnlockedNext: false, totalMissionXp: mission.xp };
  }

  let xpGained = 0;
  if (!mission.completedChapters.includes(chapter.id)) {
    xpGained = (chapter.challenge?.xp || 100) + (attemptsSoFar === 0 ? 50 : 0) + 25; // base + first-try bonus + chapter completion
    mission.xp += xpGained;
    mission.completedChapters.push(chapter.id);
  }
  mission.attempts[chapter.id] = attemptsSoFar + 1;

  let chapterUnlockedNext = false;
  if (chapterIndex + 1 > mission.unlockedIndex) {
    mission.unlockedIndex = chapterIndex + 1;
    chapterUnlockedNext = true;
  }

  all[relicId] = mission;
  saveAll(all);
  return { correct: true, xpGained, chapterUnlockedNext, totalMissionXp: mission.xp };
}

/** Marks a narration-only (no-challenge) chapter as read and unlocks the next one. */
export function unlockNextChapter(relicId, chapterIndex, chapter) {
  const all = loadAll();
  const mission = all[relicId] ? { ...emptyMission(), ...all[relicId] } : emptyMission();
  if (!mission.completedChapters.includes(chapter.id)) {
    mission.completedChapters.push(chapter.id);
  }
  if (chapterIndex + 1 > mission.unlockedIndex) {
    mission.unlockedIndex = chapterIndex + 1;
  }
  all[relicId] = mission;
  saveAll(all);
  return mission;
}

export function completeMission(relicId, bonusXp = 200) {
  const all = loadAll();
  const mission = all[relicId] ? { ...emptyMission(), ...all[relicId] } : emptyMission();
  if (!mission.completed) {
    mission.completed = true;
    mission.xp += bonusXp;
  }
  all[relicId] = mission;
  saveAll(all);
  return mission;
}

export function resetMission(relicId) {
  const all = loadAll();
  delete all[relicId];
  saveAll(all);
}

export function getTotalXp() {
  const all = loadAll();
  return Object.values(all).reduce((sum, m) => sum + (m.xp || 0), 0);
}

export function getCompletedMissionIds() {
  const all = loadAll();
  return Object.entries(all).filter(([, m]) => m.completed).map(([id]) => id);
}

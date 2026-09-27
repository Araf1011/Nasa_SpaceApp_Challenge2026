/**
 * Mission Chapter & Challenge Builder
 * Data-driven transform: turns a relic's existing verified storyLine into
 * a gated sequence of first-person chapters, each paired with one
 * reusable MCQ challenge generated directly from real mission data.
 * No facts are invented — numeric decoys are synthetic wrong numbers,
 * text decoys are always real facts pulled from OTHER real missions.
 */

// Deterministic seeded RNG so a given mission's challenge layout is stable across reloads.
function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  let state = h >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function seededShuffle(arr, seedStr) {
  const rand = seededRandom(seedStr);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickTextDecoys(allRelics, selfId, valueGetter, correctValue, count, seedStr) {
  const pool = allRelics
    .filter(r => r.id !== selfId)
    .map(valueGetter)
    .filter(v => v && v !== correctValue);
  const unique = [...new Set(pool)];
  const shuffled = seededShuffle(unique, seedStr);
  return shuffled.slice(0, count);
}

function buildMCQ({ id, question, correctText, decoys, explanation, xp = 100, seedStr }) {
  const options = seededShuffle([correctText, ...decoys], seedStr).map(text => ({
    text,
    correct: text === correctText
  }));
  return { id, type: 'mcq', question, options, explanation, xp };
}

function buildNumericMCQ({ id, question, correctValue, decoyValues, unit = '', explanation, xp = 100, seedStr }) {
  const format = (v) => `${v.toLocaleString()}${unit ? ' ' + unit : ''}`;
  const options = seededShuffle(
    [correctValue, ...decoyValues].map(v => ({ text: format(v), correct: v === correctValue })),
    seedStr
  );
  return { id, type: 'mcq', question, options, explanation, xp };
}

/**
 * Builds the chaptered game sequence for a relic.
 * @param {object} relic - one entry from RELICS_DATA
 * @param {object[]} allRelics - full RELICS_DATA, used as a safe source of real-fact decoys
 */
export function buildMissionChapters(relic, allRelics) {
  const s = relic.storyLine;
  const chapters = [];
  const introLine = `I am ${relic.shortName}. In ${relic.launchYear}, NASA sent me toward ${relic.domainLabel}.`;

  // Chapter 1 — Launch
  chapters.push({
    id: 'launch',
    icon: '🚀',
    title: 'Launch',
    narration: `${introLine} ${s.launch.desc}`,
    fact: `Launched ${relic.launchDate}`,
    image: relic.heroImage,
    challenge: buildNumericMCQ({
      id: `${relic.id}-launch`,
      question: 'In what year did NASA launch me?',
      correctValue: relic.launchYear,
      decoyValues: [relic.launchYear - 3, relic.launchYear + 2, relic.launchYear + 5],
      explanation: `I launched on ${relic.launchDate}. ${s.launch.desc}`,
      seedStr: `${relic.id}-launch`
    })
  });

  // Chapter 2 — Arrival
  chapters.push({
    id: 'arrival',
    icon: '🎯',
    title: 'Arrival',
    narration: `I traveled for a long time before I finally arrived. ${s.arrival.desc}`,
    fact: `${relic.arrivalDate} — ${relic.arrivalEvent}`,
    image: (relic.galleryImages && relic.galleryImages[0]?.url) || relic.heroImage,
    challenge: buildMCQ({
      id: `${relic.id}-arrival`,
      question: 'Where did I finally arrive?',
      correctText: relic.location,
      decoys: pickTextDecoys(allRelics, relic.id, r => r.location, relic.location, 3, `${relic.id}-arrival`),
      explanation: `${relic.arrivalEvent}. ${s.arrival.desc}`,
      seedStr: `${relic.id}-arrival`
    })
  });

  // Chapter 3 — Mission Goal (hardware)
  chapters.push({
    id: 'goal',
    icon: s.hardware.icon || '🛰️',
    title: 'Mission Goal',
    narration: s.hardware.desc,
    fact: s.hardware.title,
    image: s.hardware.instrumentsHeroImage || relic.heroImage,
    challenge: buildMCQ({
      id: `${relic.id}-goal`,
      question: 'Which world was I built to explore?',
      correctText: relic.domainLabel,
      decoys: pickTextDecoys(allRelics, relic.id, r => r.domainLabel, relic.domainLabel, 3, `${relic.id}-goal`),
      explanation: s.hardware.desc,
      seedStr: `${relic.id}-goal`
    })
  });

  // Chapter 4 — Discovery
  const hasDuration = relic.plannedValue != null && relic.actualValue != null;
  chapters.push({
    id: 'discovery',
    icon: '🔬',
    title: 'Discovery',
    narration: s.science.desc,
    fact: s.science.title,
    image: relic.heroImage,
    challenge: hasDuration
      ? buildNumericMCQ({
          id: `${relic.id}-discovery`,
          question: `I was planned to last only ${relic.plannedValue.toLocaleString()} ${relic.unitLabel}. About how many did I actually operate?`,
          correctValue: relic.actualValue,
          decoyValues: [relic.plannedValue, Math.round(relic.actualValue / 3), Math.round(relic.actualValue * 1.6)],
          unit: relic.unitLabel,
          explanation: `I operated for ${relic.actualDuration} — planned mission was only ${relic.plannedDuration}. "I stayed ${Math.round(relic.actualValue / relic.plannedValue)}× longer than anyone expected."`,
          seedStr: `${relic.id}-discovery`
        })
      : buildMCQ({
          id: `${relic.id}-discovery`,
          question: 'What did I help scientists discover?',
          correctText: s.science.title,
          decoys: pickTextDecoys(allRelics, relic.id, r => r.storyLine.science.title, s.science.title, 3, `${relic.id}-discovery`),
          explanation: s.science.desc,
          seedStr: `${relic.id}-discovery`
        })
  });

  // Chapter 5 — Final Moment / Status
  const ending = s.finalMoment || s.currentStatus;
  chapters.push({
    id: 'ending',
    icon: s.finalMoment ? '🌑' : '📡',
    title: s.finalMoment ? 'My Final Moment' : 'Where I Am Now',
    narration: ending.desc,
    fact: ending.title,
    image: relic.heroImage,
    challenge: buildMCQ({
      id: `${relic.id}-ending`,
      question: s.finalMoment ? 'What ultimately happened to me?' : 'What is my status today?',
      correctText: ending.title,
      decoys: pickTextDecoys(
        allRelics,
        relic.id,
        r => (r.storyLine.finalMoment || r.storyLine.currentStatus)?.title,
        ending.title,
        3,
        `${relic.id}-ending`
      ),
      explanation: ending.desc,
      seedStr: `${relic.id}-ending`
    })
  });

  // Chapter 6 — Legacy (reflection only, no challenge — mission completes here)
  if (s.legacy) {
    chapters.push({
      id: 'legacy',
      icon: '♾️',
      title: 'Legacy',
      narration: s.legacy.desc,
      fact: s.legacy.title,
      image: relic.heroImage,
      challenge: null,
      legacyConnections: s.legacy.connectsTo || []
    });
  } else {
    chapters.push({
      id: 'legacy',
      icon: '♾️',
      title: 'Legacy',
      narration: relic.funFact || 'My mission may have ended, but the knowledge I helped create continues on in every mission that followed.',
      fact: 'Mission Legacy',
      image: relic.heroImage,
      challenge: null,
      legacyConnections: []
    });
  }

  return chapters;
}

/**
 * Mission Game — chapter-gated, first-person storytelling game layer.
 * Reuses the existing story data (via missionChapters.js) and drawer visual
 * language from MissionStoryline, adding: XP, unlock gating, story-driven
 * MCQ challenges, and a mission-complete screen.
 */

import confetti from 'canvas-confetti';
import { RELICS_DATA } from '../data/relicsData.js';
import { buildMissionChapters } from '../utils/missionChapters.js';
import {
  getMissionProgress,
  recordChallengeAttempt,
  unlockNextChapter,
  completeMission
} from '../utils/gameProgress.js';
import { soundFX } from './AudioEffects.js';

export class MissionGame {
  constructor(containerElement, onAwardBadgeCallback) {
    this.container = containerElement;
    this.onAwardBadge = onAwardBadgeCallback;
    this.relic = null;
    this.chapters = [];
    this.activeIndex = 0;
    this.progress = null;
    this.selectedOptionIndex = null;
    this.showFeedback = false;
    this.showCompletionScreen = false;
    this.lastXpGain = 0;
  }

  open(relic) {
    this.relic = relic;
    this.chapters = buildMissionChapters(relic, RELICS_DATA);
    this.progress = getMissionProgress(relic.id);
    this.activeIndex = Math.min(this.progress.unlockedIndex, this.chapters.length - 1);
    this.selectedOptionIndex = null;
    this.showFeedback = false;
    this.showCompletionScreen = this.progress.completed && this.activeIndex >= this.chapters.length - 1;
    soundFX.playClick();
    this.render();
    this.container.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    soundFX.playClick();
    this.container.classList.remove('active');
    document.body.style.overflow = '';
  }

  goToChapter(index) {
    if (index > this.progress.unlockedIndex) return; // locked
    this.activeIndex = index;
    this.selectedOptionIndex = null;
    this.showFeedback = false;
    this.showCompletionScreen = false;
    soundFX.playClick();
    this.render();
  }

  selectOption(optIndex) {
    if (this.showFeedback) return;
    this.selectedOptionIndex = optIndex;
    this.render();
  }

  submitAnswer() {
    const chapter = this.chapters[this.activeIndex];
    if (this.selectedOptionIndex == null || !chapter.challenge) return;
    const correct = chapter.challenge.options[this.selectedOptionIndex].correct;
    const result = recordChallengeAttempt(this.relic.id, this.activeIndex, chapter, correct);
    this.progress = getMissionProgress(this.relic.id);
    this.showFeedback = true;
    this.lastXpGain = result.xpGained;

    if (correct) {
      soundFX.playFanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.65 } });
    } else {
      soundFX.playClick();
    }
    this.render();
  }

  advance() {
    const chapter = this.chapters[this.activeIndex];
    const isLast = this.activeIndex === this.chapters.length - 1;

    if (!chapter.challenge) {
      unlockNextChapter(this.relic.id, this.activeIndex, chapter);
      this.progress = getMissionProgress(this.relic.id);
    }

    if (isLast) {
      this.finishMission();
      return;
    }

    this.activeIndex += 1;
    this.selectedOptionIndex = null;
    this.showFeedback = false;
    soundFX.playClick();
    this.render();
  }

  finishMission() {
    const wasAlreadyComplete = this.progress.completed;
    completeMission(this.relic.id, 200);
    this.progress = getMissionProgress(this.relic.id);
    this.showCompletionScreen = true;
    if (!wasAlreadyComplete) {
      soundFX.playFanfare();
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
      if (this.onAwardBadge && this.relic.badgeAwarded) {
        this.onAwardBadge(this.relic.badgeAwarded);
      }
    }
    this.render();
  }

  replayMission() {
    this.activeIndex = 0;
    this.selectedOptionIndex = null;
    this.showFeedback = false;
    this.showCompletionScreen = false;
    soundFX.playClick();
    this.render();
  }

  /* ── Render ───────────────────────────────────────────────────── */
  render() {
    const relic = this.relic;
    if (!relic) return;
    const totalChapters = this.chapters.length;
    const chapterProgressPct = Math.round((this.progress.completedChapters.length / totalChapters) * 100);
    const heroColor = relic.heroColor || '#0b3d91';

    const stepperHTML = this.chapters.map((ch, i) => {
      const isUnlocked = i <= this.progress.unlockedIndex;
      const isDone = this.progress.completedChapters.includes(ch.id);
      const isActive = i === this.activeIndex && !this.showCompletionScreen;
      const stateClass = isDone ? 'done' : isUnlocked ? 'unlocked' : 'locked';
      return `
        <button class="game-step-node ${stateClass} ${isActive ? 'active' : ''}" data-chapter-index="${i}" ${!isUnlocked ? 'disabled' : ''} title="${ch.title}">
          <span class="game-step-icon">${isDone ? '✓' : isUnlocked ? ch.icon : '🔒'}</span>
        </button>
        ${i < totalChapters - 1 ? '<span class="game-step-connector"></span>' : ''}
      `;
    }).join('');

    if (this.showCompletionScreen) {
      this.container.innerHTML = this._renderCompletionScreen(relic, heroColor);
      this._bindCompletionEvents();
      return;
    }

    const chapter = this.chapters[this.activeIndex];
    const isChapterDone = this.progress.completedChapters.includes(chapter.id);

    this.container.innerHTML = `
      <div class="storyline-backdrop" id="game-backdrop"></div>
      <div class="storyline-drawer game-drawer" style="--hero-color:${heroColor}">
        <button class="storyline-close-btn" id="game-close-btn" aria-label="Close Mission Game">✕</button>

        <div class="game-hud">
          <div class="game-hud-top">
            <div class="game-hud-title">
              <span class="game-mode-tag">🎮 MISSION MODE</span>
              <h2 class="game-relic-name">${relic.shortName}</h2>
            </div>
            <div class="game-xp-block">
              <span class="game-xp-value">${this.progress.xp.toLocaleString()} XP</span>
              <span class="game-xp-label">Mission Score</span>
            </div>
          </div>
          <div class="game-progress-bar-track">
            <div class="game-progress-bar-fill" style="width:${chapterProgressPct}%"></div>
          </div>
          <div class="game-stepper-row" id="game-stepper-row">${stepperHTML}</div>
        </div>

        <div class="game-chapter-body">
          <div class="game-chapter-header">
            <span class="game-chapter-icon">${chapter.icon}</span>
            <div>
              <span class="game-chapter-eyebrow">Chapter ${this.activeIndex + 1} of ${totalChapters}</span>
              <h3 class="game-chapter-title">${chapter.title}</h3>
            </div>
          </div>

          ${chapter.image ? `<div class="game-chapter-image-wrap"><img src="${chapter.image}" alt="${chapter.title}" loading="lazy" onerror="this.parentElement.style.display='none'" /></div>` : ''}

          <p class="game-chapter-narration">${chapter.narration}</p>
          <div class="game-chapter-fact-chip">📌 ${chapter.fact}</div>

          ${chapter.challenge ? this._renderChallenge(chapter, isChapterDone) : this._renderLegacyBlock(chapter)}
        </div>
      </div>
    `;

    this._bindEvents(chapter, isChapterDone);
  }

  _renderChallenge(chapter, isChapterDone) {
    const ch = chapter.challenge;
    const answered = this.showFeedback;
    const correctIdx = ch.options.findIndex(o => o.correct);
    const gotItRight = answered && this.selectedOptionIndex === correctIdx;

    return `
      <div class="game-challenge-panel">
        <div class="game-challenge-header">
          <span>🎯 MISSION CHALLENGE</span>
          ${isChapterDone && !answered ? '<span class="game-challenge-solved-tag">✓ Already Solved</span>' : ''}
        </div>
        <p class="game-challenge-question">${ch.question}</p>
        <div class="game-challenge-options">
          ${ch.options.map((opt, i) => {
            let cls = '';
            if (answered) {
              if (i === correctIdx) cls = 'correct';
              else if (i === this.selectedOptionIndex) cls = 'wrong';
            } else if (i === this.selectedOptionIndex) {
              cls = 'selected';
            }
            return `<button class="game-option-btn ${cls}" data-option-index="${i}" ${answered ? 'disabled' : ''}>
              <span class="option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="option-text">${opt.text}</span>
            </button>`;
          }).join('')}
        </div>

        ${answered ? `
          <div class="game-feedback-box ${gotItRight ? 'correct' : 'wrong'}">
            <div class="game-feedback-status">${gotItRight ? (this.lastXpGain > 0 ? `★ Correct! +${this.lastXpGain} XP` : '★ Correct! (Already completed)') : '✗ Not quite — here\'s what actually happened:'}</div>
            <p class="game-feedback-explanation">${ch.explanation}</p>
          </div>
          <button class="storyline-btn game-continue-btn" id="game-continue-btn">
            ${gotItRight ? (this.activeIndex === this.chapters.length - 1 ? 'Complete Mission →' : 'Unlock Next Chapter →') : 'Try Again'}
          </button>
        ` : `
          <button class="storyline-btn game-submit-btn" id="game-submit-btn" ${this.selectedOptionIndex == null ? 'disabled' : ''}>
            Submit Answer
          </button>
          ${isChapterDone ? `<button class="game-skip-link" id="game-skip-link">Skip — I already solved this →</button>` : ''}
        `}
      </div>
    `;
  }

  _renderLegacyBlock(chapter) {
    const isLast = this.activeIndex === this.chapters.length - 1;
    return `
      ${chapter.legacyConnections && chapter.legacyConnections.length ? `
        <div class="legacy-connections-row">
          ${chapter.legacyConnections.map(id => {
            const linked = RELICS_DATA.find(r => r.id === id);
            return linked ? `<span class="legacy-connect-chip static">→ ${linked.shortName}</span>` : '';
          }).join('')}
        </div>` : ''}
      <button class="storyline-btn game-continue-btn" id="game-advance-btn">
        ${isLast ? 'Complete Mission →' : 'Continue →'}
      </button>
    `;
  }

  _renderCompletionScreen(relic, heroColor) {
    const chaptersWithChallenge = this.chapters.filter(c => c.challenge).length;
    return `
      <div class="storyline-backdrop" id="game-backdrop"></div>
      <div class="storyline-drawer game-drawer game-complete-drawer" style="--hero-color:${heroColor}">
        <button class="storyline-close-btn" id="game-close-btn" aria-label="Close">✕</button>
        <div class="game-complete-screen">
          <div class="game-complete-badge-burst">🏅</div>
          <span class="game-complete-tag">MISSION COMPLETE</span>
          <h2 class="game-complete-title">${relic.shortName}</h2>
          <p class="game-complete-quote">"My mission may have ended, but the knowledge I helped create continues."</p>

          <div class="game-complete-stats-row">
            <div class="game-complete-stat">
              <span class="stat-value">${this.progress.xp.toLocaleString()}</span>
              <span class="stat-label">Total XP</span>
            </div>
            <div class="game-complete-stat">
              <span class="stat-value">${chaptersWithChallenge}</span>
              <span class="stat-label">Discoveries</span>
            </div>
            <div class="game-complete-stat">
              <span class="stat-value">${this.chapters.length}</span>
              <span class="stat-label">Chapters</span>
            </div>
          </div>

          ${relic.badgeAwarded ? `<div class="game-complete-badge-unlock">🏅 Badge Unlocked</div>` : ''}

          <div class="game-complete-actions">
            <button class="storyline-btn" id="game-replay-btn">↺ Replay Mission</button>
            <button class="storyline-btn fly-btn" id="game-close-explore-btn">🚀 Explore Another Mission</button>
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents(chapter, isChapterDone) {
    this.container.querySelector('#game-close-btn')?.addEventListener('click', () => this.close());
    this.container.querySelector('#game-backdrop')?.addEventListener('click', () => this.close());

    this.container.querySelectorAll('.game-step-node').forEach(btn => {
      btn.addEventListener('click', () => this.goToChapter(parseInt(btn.dataset.chapterIndex, 10)));
    });

    if (chapter.challenge) {
      this.container.querySelectorAll('.game-option-btn').forEach(btn => {
        btn.addEventListener('click', () => this.selectOption(parseInt(btn.dataset.optionIndex, 10)));
      });
      this.container.querySelector('#game-submit-btn')?.addEventListener('click', () => this.submitAnswer());
      this.container.querySelector('#game-continue-btn')?.addEventListener('click', () => {
        const correctIdx = chapter.challenge.options.findIndex(o => o.correct);
        if (this.selectedOptionIndex === correctIdx) {
          this.advance();
        } else {
          this.selectedOptionIndex = null;
          this.showFeedback = false;
          this.render();
        }
      });
      this.container.querySelector('#game-skip-link')?.addEventListener('click', () => this.advance());
    } else {
      this.container.querySelector('#game-advance-btn')?.addEventListener('click', () => this.advance());
    }
  }

  _bindCompletionEvents() {
    this.container.querySelector('#game-close-btn')?.addEventListener('click', () => this.close());
    this.container.querySelector('#game-backdrop')?.addEventListener('click', () => this.close());
    this.container.querySelector('#game-replay-btn')?.addEventListener('click', () => this.replayMission());
    this.container.querySelector('#game-close-explore-btn')?.addEventListener('click', () => this.close());
  }
}

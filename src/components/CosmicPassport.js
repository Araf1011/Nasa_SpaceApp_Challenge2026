/**
 * Cosmic Passport & Youth Gamification Component
 * Manages earned badges, the interactive Cosmic Sleuth quiz, and certificate generation.
 */

import confetti from 'canvas-confetti';
import { BADGES_CATALOG, QUIZ_QUESTIONS } from '../data/quizData.js';
import { generateExplorerCertificate } from '../utils/certificateCanvas.js';
import { soundFX } from './AudioEffects.js';

export class CosmicPassport {
  constructor(containerElement, onOpenRelicCallback) {
    this.container = containerElement;
    this.onOpenRelic = onOpenRelicCallback;
    this.cadetName = localStorage.getItem('cosmic_cadet_name') || 'Junior Explorer';
    this.unlockedBadgeIds = new Set(JSON.parse(localStorage.getItem('cosmic_unlocked_badges') || '["lunar-archaeologist"]'));

    // Quiz state
    this.quizActive = false;
    this.quizQuestionIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;

    this.render();
    this.initEventListeners();
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadgeIds.has(badgeId)) {
      this.unlockedBadgeIds.add(badgeId);
      localStorage.setItem('cosmic_unlocked_badges', JSON.stringify([...this.unlockedBadgeIds]));
      soundFX.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      this.render();
      this.initEventListeners();
    }
  }

  setCadetName(name) {
    this.cadetName = name.trim() || 'Junior Explorer';
    localStorage.setItem('cosmic_cadet_name', this.cadetName);
  }

  startQuiz() {
    this.quizActive = true;
    this.quizQuestionIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;
    soundFX.playClick();
    this.render();
    this.initEventListeners();
  }

  answerQuestion(optionIndex) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const currentQ = QUIZ_QUESTIONS[this.quizQuestionIndex];
    const isCorrect = currentQ.options[optionIndex].correct;

    if (isCorrect) {
      this.quizScore += 1;
      soundFX.playFanfare();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      if (currentQ.badgeHint) {
        this.unlockBadge(currentQ.badgeHint);
      }
    } else {
      soundFX.playClick();
    }

    const optionsContainer = this.container.querySelector('#quiz-options-list');
    if (optionsContainer) {
      const optionButtons = optionsContainer.querySelectorAll('.quiz-option-btn');
      optionButtons.forEach((btn, idx) => {
        if (currentQ.options[idx].correct) {
          btn.classList.add('correct');
        } else if (idx === optionIndex) {
          btn.classList.add('wrong');
        }
      });
    }

    const feedbackElem = this.container.querySelector('#quiz-feedback-box');
    if (feedbackElem) {
      feedbackElem.innerHTML = `
        <div class="feedback-status ${isCorrect ? 'status-correct' : 'status-wrong'}">
          ${isCorrect ? '★ Correct Discovery!' : '✗ Not Quite!'}
        </div>
        <div class="feedback-text">${currentQ.explanation}</div>
      `;
      feedbackElem.classList.remove('hidden');
    }

    const nextBtn = this.container.querySelector('#quiz-next-btn');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      if (this.quizQuestionIndex >= QUIZ_QUESTIONS.length - 1) {
        nextBtn.textContent = 'View Final Results & Certificate';
      }
    }
  }

  nextQuestion() {
    soundFX.playClick();
    if (this.quizQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      this.quizQuestionIndex += 1;
      this.quizAnswered = false;
      this.render();
      this.initEventListeners();
    } else {
      // Quiz complete!
      this.quizActive = false;
      // If scored high, unlock special badge
      if (this.quizScore >= 4) {
        this.unlockBadge('interstellar-pathfinder');
      }
      soundFX.playFanfare();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      this.render();
      this.initEventListeners();
      this.openCertificateModal();
    }
  }

  openCertificateModal() {
    const modal = document.querySelector('#certificate-modal');
    if (!modal) return;
    const canvas = modal.querySelector('#certificate-canvas');
    if (canvas) {
      generateExplorerCertificate(canvas, this.cadetName, this.unlockedBadgeIds.size, BADGES_CATALOG.length);
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Download button handler
    const dlBtn = modal.querySelector('#certificate-download-btn');
    if (dlBtn) {
      dlBtn.onclick = () => {
        soundFX.playClick();
        const link = document.createElement('a');
        link.download = `NASA-Space-Apps-2026-${this.cadetName.replace(/\s+/g, '_')}-Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }

    const closeBtn = modal.querySelector('#certificate-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };
    }
  }

  render() {
    if (this.quizActive) {
      const q = QUIZ_QUESTIONS[this.quizQuestionIndex];
      this.container.innerHTML = `
        <div class="passport-quiz-card">
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${((this.quizQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%;"></div>
          </div>
          <div class="quiz-header">
            <span class="quiz-q-num">Question ${this.quizQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}</span>
            <span class="quiz-current-score">Current Score: ${this.quizScore} / ${QUIZ_QUESTIONS.length}</span>
          </div>
          <h3 class="quiz-question-title">${q.question}</h3>
          
          <div class="quiz-options-list" id="quiz-options-list">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-btn" data-index="${idx}">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="option-text">${opt.text}</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-feedback-box hidden" id="quiz-feedback-box"></div>

          <div class="quiz-nav-row">
            <button class="quiz-cancel-btn" id="quiz-quit-btn">Exit Quiz</button>
            <button class="quiz-next-btn hidden" id="quiz-next-btn">Next Question →</button>
          </div>
        </div>
      `;
      return;
    }

    // Default Passport Overview
    const earnedCount = this.unlockedBadgeIds.size;
    const totalBadges = BADGES_CATALOG.length;

    this.container.innerHTML = `
      <div class="passport-card">
        <div class="passport-top">
          <div class="passport-id-badge">
            <span class="passport-icon">🛰️</span>
            <div>
              <h3 class="passport-heading">COSMIC EXPLORER PASSPORT</h3>
              <div class="passport-cadet-input-wrap">
                <label for="cadet-name-input" class="cadet-label">Cadet Call-Sign:</label>
                <input 
                  type="text" 
                  id="cadet-name-input" 
                  class="cadet-name-input" 
                  value="${this.cadetName}" 
                  maxlength="24"
                  title="Click to edit your name"
                />
              </div>
            </div>
          </div>
          <div class="passport-score-counter">
            <span class="score-number">${earnedCount} / ${totalBadges}</span>
            <span class="score-label">BADGES UNLOCKED</span>
          </div>
        </div>

        <!-- Badge Showcase Grid -->
        <div class="badge-grid">
          ${BADGES_CATALOG.map(b => {
            const isUnlocked = this.unlockedBadgeIds.has(b.id);
            return `
              <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}" title="${b.desc}">
                <div class="badge-icon-wrap">
                  <span class="badge-icon">${b.icon}</span>
                  ${isUnlocked ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
                </div>
                <div class="badge-name">${b.name}</div>
                <div class="badge-criteria">${isUnlocked ? 'Unlocked!' : b.criteria}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Passport Actions -->
        <div class="passport-actions">
          <button class="passport-btn quiz-btn" id="passport-start-quiz-btn">
            <span>🚀</span> Test Knowledge: Cosmic Sleuth Quiz
          </button>
          <button class="passport-btn cert-btn" id="passport-view-cert-btn">
            <span>📜</span> View & Download NASA Certificate
          </button>
        </div>
      </div>
    `;
  }

  initEventListeners() {
    if (this.quizActive) {
      const optionButtons = this.container.querySelectorAll('.quiz-option-btn');
      optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.currentTarget.dataset.index);
          this.answerQuestion(index);
        });
      });

      const nextBtn = this.container.querySelector('#quiz-next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextQuestion());
      }

      const quitBtn = this.container.querySelector('#quiz-quit-btn');
      if (quitBtn) {
        quitBtn.addEventListener('click', () => {
          soundFX.playClick();
          this.quizActive = false;
          this.render();
          this.initEventListeners();
        });
      }
      return;
    }

    const nameInput = this.container.querySelector('#cadet-name-input');
    if (nameInput) {
      nameInput.addEventListener('change', (e) => this.setCadetName(e.target.value));
      nameInput.addEventListener('blur', (e) => this.setCadetName(e.target.value));
    }

    const startQuizBtn = this.container.querySelector('#passport-start-quiz-btn');
    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => this.startQuiz());
    }

    const viewCertBtn = this.container.querySelector('#passport-view-cert-btn');
    if (viewCertBtn) {
      viewCertBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.openCertificateModal();
      });
    }
  }
}

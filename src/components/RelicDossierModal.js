/**
 * Relic Dossier Modal Component
 * In-depth interactive hardware inspector, story reader, telemetry HUD, and audio player.
 */

import { formatNumberWithCommas, calculateCurrentTelemetry } from '../utils/orbitalMath.js';
import { soundFX } from './AudioEffects.js';

export class RelicDossierModal {
  constructor(containerElement, onFlyToCallback, onAwardBadgeCallback) {
    this.container = containerElement;
    this.onFlyTo = onFlyToCallback;
    this.onAwardBadge = onAwardBadgeCallback;
    this.currentRelic = null;
    this.currentAudience = 'cadet';
    this.telemetryInterval = null;
    this.sessionStartTime = Date.now();
  }

  open(relic, audienceLevel = 'cadet') {
    this.currentRelic = relic;
    this.currentAudience = audienceLevel;
    this.sessionStartTime = Date.now();
    soundFX.playClick();

    if (this.onAwardBadge && relic.badgeAwarded) {
      this.onAwardBadge(relic.badgeAwarded);
    }

    this.render();
    this.container.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Start live telemetry incrementer
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    this.telemetryInterval = setInterval(() => {
      this.updateTelemetryHUD();
    }, 500);
  }

  close() {
    soundFX.playClick();
    soundFX.stopCurrentAudio();
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
    this.container.classList.remove('active');
    document.body.style.overflow = '';
  }

  setAudienceLevel(level) {
    this.currentAudience = level;
    soundFX.playClick();
    const storyContainer = this.container.querySelector('#dossier-story-text');
    if (storyContainer && this.currentRelic) {
      storyContainer.innerHTML = this.currentRelic.story[level] || this.currentRelic.story.explorer;
    }
    // Update active tab styling
    this.container.querySelectorAll('.audience-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.level === level);
    });
  }

  updateTelemetryHUD() {
    if (!this.currentRelic) return;
    const elapsedSecs = (Date.now() - this.sessionStartTime) / 1000;
    const telemetry = calculateCurrentTelemetry(this.currentRelic, elapsedSecs);

    const distKmElem = this.container.querySelector('#dossier-dist-km');
    const distAuElem = this.container.querySelector('#dossier-dist-au');
    const lightTimeElem = this.container.querySelector('#dossier-light-time');

    if (distKmElem) distKmElem.textContent = `${formatNumberWithCommas(Math.round(telemetry.distanceKm))} km`;
    if (distAuElem) distAuElem.textContent = `${telemetry.distanceAU.toFixed(3)} AU`;
    if (lightTimeElem) lightTimeElem.textContent = telemetry.lightTimeString;
  }

  render() {
    const relic = this.currentRelic;
    if (!relic) return;

    const initialTelemetry = calculateCurrentTelemetry(relic, 0);

    this.container.innerHTML = `
      <div class="dossier-backdrop" id="dossier-backdrop"></div>
      <div class="dossier-dialog" role="dialog" aria-labelledby="dossier-title">
        <!-- Close Button -->
        <button class="dossier-close-btn" id="dossier-close-btn" aria-label="Close Dossier">✕</button>

        <!-- Header -->
        <div class="dossier-header">
          <div class="dossier-tags">
            <span class="dossier-badge domain-badge">${relic.domainLabel}</span>
            <span class="dossier-badge ${relic.statusClass}">${relic.statusLabel}</span>
            <span class="dossier-badge year-badge">Launched ${relic.launchYear}</span>
          </div>
          <h2 id="dossier-title" class="dossier-title">${relic.name}</h2>
          <div class="dossier-location-line">
            <span class="tech-icon">📍</span>
            <span>${relic.location}</span>
            <span class="coords-tag">[${relic.coordinates}]</span>
          </div>
        </div>

        <!-- Telemetry HUD Strip -->
        <div class="dossier-telemetry-hud">
          <div class="hud-item">
            <span class="hud-label">LIVE DISTANCE FROM EARTH</span>
            <span class="hud-value" id="dossier-dist-km">${formatNumberWithCommas(Math.round(initialTelemetry.distanceKm))} km</span>
            <span class="hud-sub" id="dossier-dist-au">${initialTelemetry.distanceAU.toFixed(3)} AU</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">ONE-WAY LIGHT TIME</span>
            <span class="hud-value pulse-text" id="dossier-light-time">${initialTelemetry.lightTimeString}</span>
            <span class="hud-sub">DSN Signal Delay</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">OUTBOUND / ORBIT SPEED</span>
            <span class="hud-value">${relic.speedKmS.toFixed(1)} km/s</span>
            <span class="hud-sub">${formatNumberWithCommas(Math.round(relic.speedKmS * 3600))} km/h</span>
          </div>
        </div>

        <!-- Audience Level Tabs -->
        <div class="dossier-audience-bar">
          <span class="audience-label">Audience View:</span>
          <button class="audience-tab-btn ${this.currentAudience === 'cadet' ? 'active' : ''}" data-level="cadet">
            🚀 Cadet (Ages 7-11)
          </button>
          <button class="audience-tab-btn ${this.currentAudience === 'explorer' ? 'active' : ''}" data-level="explorer">
            🧭 Explorer (Ages 12-16)
          </button>
          <button class="audience-tab-btn ${this.currentAudience === 'astrophysicist' ? 'active' : ''}" data-level="astrophysicist">
            🔬 Astrophysicist (Advanced)
          </button>
        </div>

        <!-- Story Section -->
        <div class="dossier-body">
          <section class="dossier-section">
            <h3 class="section-heading"><span class="heading-icon">📖</span> The Story of this Pioneer</h3>
            <div class="story-box" id="dossier-story-text">
              ${relic.story[this.currentAudience] || relic.story.explorer}
            </div>
          </section>

          <!-- Science Made Possible Grid -->
          <section class="dossier-section">
            <h3 class="section-heading"><span class="heading-icon">💡</span> Science & Breakthroughs Made Possible</h3>
            <div class="breakthrough-grid">
              ${relic.scienceMadePossible.map(item => `
                <div class="breakthrough-card">
                  <div class="breakthrough-title">
                    <span class="check-bullet">✓</span> ${item.title}
                  </div>
                  <div class="breakthrough-desc">${item.desc}</div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Hardware Anatomy Breakdown -->
          <section class="dossier-section">
            <h3 class="section-heading"><span class="heading-icon">⚙️</span> Hardware Anatomy & Subsystems</h3>
            <div class="subsystems-container">
              ${relic.hardwareAnatomy.map((sub, idx) => `
                <div class="subsystem-card">
                  <div class="subsystem-header">
                    <span class="subsystem-num">#0${idx + 1}</span>
                    <h4 class="subsystem-name">${sub.name}</h4>
                  </div>
                  <p class="subsystem-desc">${sub.desc}</p>
                  <div class="subsystem-fact">
                    <span class="fact-sparkle">★</span> <strong>Kid Wonder Fact:</strong> ${sub.fact}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Fun Fact Box -->
          <div class="fun-fact-banner">
            <span class="fun-fact-emoji">🎉</span>
            <div class="fun-fact-content">
              <strong>Cosmic Trivia:</strong> ${relic.funFact}
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="dossier-footer">
          <button class="dossier-action-btn audio-btn" id="dossier-play-audio-btn">
            <span class="btn-icon">🔊</span>
            <span>Listen: ${relic.audioTitle || 'Simulated Signal'}</span>
          </button>
          <button class="dossier-action-btn fly-btn" id="dossier-fly-camera-btn">
            <span class="btn-icon">🎯</span>
            <span>Fly Camera to Relic</span>
          </button>
        </div>
      </div>
    `;

    // Attach Event Listeners
    this.container.querySelector('#dossier-close-btn').addEventListener('click', () => this.close());
    this.container.querySelector('#dossier-backdrop').addEventListener('click', () => this.close());

    this.container.querySelectorAll('.audience-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const level = e.currentTarget.dataset.level;
        this.setAudienceLevel(level);
      });
    });

    const audioBtn = this.container.querySelector('#dossier-play-audio-btn');
    audioBtn.addEventListener('click', () => {
      soundFX.playRelicAudio(relic.audioSimulation);
      audioBtn.classList.add('playing');
      audioBtn.innerHTML = `<span class="btn-icon">🔊</span> <span>Transmitting Audio...</span>`;
      setTimeout(() => {
        audioBtn.classList.remove('playing');
        audioBtn.innerHTML = `<span class="btn-icon">🔊</span> <span>Listen: ${relic.audioTitle || 'Simulated Signal'}</span>`;
      }, 3500);
    });

    const flyBtn = this.container.querySelector('#dossier-fly-camera-btn');
    flyBtn.addEventListener('click', () => {
      if (this.onFlyTo) {
        this.onFlyTo(relic.id);
      }
      this.close();
    });

    // Keyboard ESC to close
    const onKeyEsc = (e) => {
      if (e.key === 'Escape') {
        this.close();
        window.removeEventListener('keydown', onKeyEsc);
      }
    };
    window.addEventListener('keydown', onKeyEsc);
  }
}

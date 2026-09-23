/**
 * Interactive Timeline Slider Component (1969 - 2026)
 * Enables youth to scrub through time and watch NASA hardware populate the Solar System.
 */

import { TIMELINE_MILESTONES } from '../data/timelineEvents.js';
import { soundFX } from './AudioEffects.js';

export class TimelineSlider {
  constructor(containerElement, onYearChangeCallback) {
    this.container = containerElement;
    this.onYearChange = onYearChangeCallback;
    this.currentYear = 2026;
    this.isPlaying = false;
    this.playInterval = null;

    this.render();
    this.initEventListeners();
  }

  setYear(year, triggerCallback = true) {
    this.currentYear = Math.max(1969, Math.min(2026, parseInt(year)));
    const sliderInput = this.container.querySelector('#timeline-range');
    const yearDisplay = this.container.querySelector('#timeline-year-display');
    const milestoneCard = this.container.querySelector('#timeline-milestone-info');

    if (sliderInput) sliderInput.value = this.currentYear;
    if (yearDisplay) yearDisplay.textContent = this.currentYear;

    // Find closest milestone on or immediately before this year
    const milestone = this.getMilestoneForYear(this.currentYear);
    if (milestoneCard && milestone) {
      milestoneCard.innerHTML = `
        <div class="milestone-badge">${milestone.year} Milestone: ${milestone.highlightDomain}</div>
        <div class="milestone-title">${milestone.title}</div>
        <div class="milestone-desc">${milestone.summary}</div>
      `;
    }

    if (triggerCallback && this.onYearChange) {
      this.onYearChange(this.currentYear);
    }
  }

  getMilestoneForYear(year) {
    const sorted = [...TIMELINE_MILESTONES].sort((a, b) => b.year - a.year);
    return sorted.find(m => m.year <= year) || TIMELINE_MILESTONES[0];
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const playBtn = this.container.querySelector('#timeline-play-btn');

    if (this.isPlaying) {
      soundFX.playClick();
      if (playBtn) playBtn.innerHTML = '⏸ <span>Pause</span>';
      if (this.currentYear >= 2026) {
        this.setYear(1969);
      }

      this.playInterval = setInterval(() => {
        let nextYear = this.currentYear + 1;
        if (nextYear > 2026) {
          this.togglePlay();
          return;
        }
        this.setYear(nextYear);
        // Play subtle telemetry sound on milestone hit
        if (TIMELINE_MILESTONES.some(m => m.year === nextYear)) {
          soundFX.playClick();
        }
      }, 750);
    } else {
      if (playBtn) playBtn.innerHTML = '▶ <span>Play Odyssey</span>';
      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
    }
  }

  render() {
    const initialMilestone = this.getMilestoneForYear(2026);

    this.container.innerHTML = `
      <div class="timeline-panel">
        <div class="timeline-header">
          <div class="timeline-controls-left">
            <button class="timeline-btn play-btn" id="timeline-play-btn">
              ▶ <span>Play Odyssey</span>
            </button>
            <div class="timeline-year-tag">
              <span class="year-label">MISSION YEAR:</span>
              <span class="year-number" id="timeline-year-display">2026</span>
            </div>
          </div>

          <!-- Quick Jump Decade Anchors -->
          <div class="timeline-quick-jump">
            <button class="jump-pill" data-jump="1969">1969 Apollo</button>
            <button class="jump-pill" data-jump="1977">1977 Voyager</button>
            <button class="jump-pill" data-jump="2004">2004 Mars Rovers</button>
            <button class="jump-pill" data-jump="2021">2021 Perseverance/Webb</button>
            <button class="jump-pill active" data-jump="2026">2026 Present</button>
          </div>
        </div>

        <!-- Slider Bar -->
        <div class="slider-track-wrap">
          <span class="slider-year-min">1969</span>
          <input 
            type="range" 
            id="timeline-range" 
            min="1969" 
            max="2026" 
            value="2026" 
            step="1"
            class="timeline-range-input"
            aria-label="Filter hardware by launch year"
          />
          <span class="slider-year-max">2026</span>
        </div>

        <!-- Milestone Card -->
        <div class="timeline-milestone-info" id="timeline-milestone-info">
          <div class="milestone-badge">${initialMilestone.year} Milestone: ${initialMilestone.highlightDomain}</div>
          <div class="milestone-title">${initialMilestone.title}</div>
          <div class="milestone-desc">${initialMilestone.summary}</div>
        </div>
      </div>
    `;
  }

  initEventListeners() {
    const sliderInput = this.container.querySelector('#timeline-range');
    sliderInput.addEventListener('input', (e) => {
      if (this.isPlaying) this.togglePlay();
      this.setYear(e.target.value);
    });

    const playBtn = this.container.querySelector('#timeline-play-btn');
    playBtn.addEventListener('click', () => this.togglePlay());

    this.container.querySelectorAll('.jump-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        if (this.isPlaying) this.togglePlay();
        const year = parseInt(e.currentTarget.dataset.jump);
        this.setYear(year);

        this.container.querySelectorAll('.jump-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }
}

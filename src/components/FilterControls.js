/**
 * Filter Controls & Relic Drawer Component
 * Manages category pills, search filtering, and list cards.
 */

import { CATEGORIES } from '../data/relicsData.js';
import { soundFX } from './AudioEffects.js';

export class FilterControls {
  constructor(containerElement, relics, onFilterChangeCallback, onSelectRelicCallback, onFlyToCallback) {
    this.container = containerElement;
    this.allRelics = relics;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.maxYear = 2026;
    this.onFilterChange = onFilterChangeCallback;
    this.onSelectRelic = onSelectRelicCallback;
    this.onFlyTo = onFlyToCallback;

    this.render();
    this.initEventListeners();
  }

  setYear(year) {
    this.maxYear = year;
    this.updateRelicsList();
  }

  getFilteredRelics() {
    return this.allRelics.filter(r => {
      // 1. Year filter
      if (r.launchYear > this.maxYear) return false;

      // 2. Category filter
      if (this.currentCategory !== 'all' && r.category !== this.currentCategory) return false;

      // 3. Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchLoc = r.location.toLowerCase().includes(q);
        const matchStory = r.story.cadet.toLowerCase().includes(q) || r.story.explorer.toLowerCase().includes(q);
        const matchBreakthrough = r.scienceMadePossible.some(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
        if (!matchName && !matchLoc && !matchStory && !matchBreakthrough) return false;
      }

      return true;
    });
  }

  updateRelicsList() {
    const listContainer = this.container.querySelector('#relics-cards-container');
    const countDisplay = this.container.querySelector('#relics-count-badge');
    const filtered = this.getFilteredRelics();

    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} Relics Active`;
    }

    if (!listContainer) return;

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-filter-state">
          <span class="empty-icon">🛰️</span>
          <p>No NASA hardware found matching your filters in ${this.maxYear}. Try changing the category or year scrubber.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(r => `
      <div class="relic-list-card" data-relic-id="${r.id}">
        <div class="card-top-row">
          <span class="card-domain-badge">${r.domainLabel}</span>
          <span class="card-year-tag">${r.launchYear}</span>
        </div>
        <h4 class="card-title">${r.name}</h4>
        <div class="card-status-line">
          <span class="status-indicator-dot ${r.statusClass}"></span>
          <span class="status-text">${r.statusLabel}</span>
        </div>
        <div class="card-location">${r.location}</div>

        <div class="card-action-row">
          <button class="card-btn inspect-btn" data-action="inspect" data-relic-id="${r.id}">
            <span>🔍</span> Inspect Dossier
          </button>
          <button class="card-btn fly-btn" data-action="fly" data-relic-id="${r.id}" title="Focus 3D camera on this craft">
            <span>🎯</span> Fly To
          </button>
        </div>
      </div>
    `).join('');

    // Attach card clicks
    listContainer.querySelectorAll('.card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = e.currentTarget.dataset.action;
        const relicId = e.currentTarget.dataset.relicId;
        const relic = this.allRelics.find(r => r.id === relicId);

        if (action === 'inspect' && relic && this.onSelectRelic) {
          this.onSelectRelic(relic);
        } else if (action === 'fly' && relic && this.onFlyTo) {
          this.onFlyTo(relic.id);
        }
      });
    });

    listContainer.querySelectorAll('.relic-list-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const relicId = e.currentTarget.dataset.relicId;
        const relic = this.allRelics.find(r => r.id === relicId);
        if (relic && this.onSelectRelic) {
          this.onSelectRelic(relic);
        }
      });
    });

    if (this.onFilterChange) {
      this.onFilterChange(filtered);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="filter-panel">
        <div class="filter-header">
          <div class="filter-title-wrap">
            <h3 class="filter-panel-title">SOLAR SYSTEM HARDWARE INDEX</h3>
            <span class="relics-count-badge" id="relics-count-badge">${this.allRelics.length} Relics Active</span>
          </div>
          <button class="drawer-toggle-btn" id="drawer-toggle-btn" aria-label="Toggle Catalog Drawer">
            <span class="toggle-icon">☰</span>
          </button>
        </div>

        <!-- Search Input -->
        <div class="filter-search-box">
          <span class="search-icon">🔎</span>
          <input 
            type="text" 
            id="relic-search-input" 
            class="relic-search-input" 
            placeholder="Search rovers, mirrors, probes, discoveries..." 
            aria-label="Search hardware relics"
          />
        </div>

        <!-- Category Filter Pills -->
        <div class="filter-categories-pills">
          ${CATEGORIES.map(cat => `
            <button class="cat-pill ${cat.id === this.currentCategory ? 'active' : ''}" data-cat-id="${cat.id}">
              <span class="cat-icon">${cat.icon}</span>
              <span class="cat-label">${cat.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- Scrollable Relics Cards Container -->
        <div class="relics-cards-container" id="relics-cards-container"></div>
      </div>
    `;

    this.updateRelicsList();
  }

  initEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#relic-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.updateRelicsList();
      });
    }

    // Category pills
    this.container.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        soundFX.playClick();
        const catId = e.currentTarget.dataset.catId;
        this.currentCategory = catId;
        this.container.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.updateRelicsList();
      });
    });

    // Mobile Drawer Toggle
    const toggleBtn = this.container.querySelector('#drawer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.container.classList.toggle('collapsed');
      });
    }
  }
}

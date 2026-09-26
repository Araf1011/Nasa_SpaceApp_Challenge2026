/**
 * PlanetDetailPanel Component
 * Rich interactive slide-in dossier for celestial bodies (Moon & Mars).
 * Displays physical stats, surface features, mission histories, and fun facts.
 */

import { soundFX } from './AudioEffects.js';

export class PlanetDetailPanel {
  constructor(containerElement, onFocusPlanet, onSelectRelic) {
    this.container = containerElement;
    this.onFocusPlanet = onFocusPlanet;
    this.onSelectRelic = onSelectRelic;
    this.currentPlanet = null;
    this.activeTab = 'overview'; // 'overview', 'features', 'missions', 'facts'
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="planet-drawer-backdrop" id="planet-drawer-backdrop"></div>
      <aside class="planet-drawer" id="planet-drawer" aria-label="Celestial Body Dossier">
        <div class="planet-drawer-header" id="planet-drawer-header">
          <!-- Populated dynamically -->
        </div>
        <nav class="planet-nav-tabs" id="planet-nav-tabs">
          <button class="planet-tab-btn active" data-tab="overview">📊 Overview</button>
          <button class="planet-tab-btn" data-tab="features">🗻 Surface Features</button>
          <button class="planet-tab-btn" data-tab="missions">🛸 Missions</button>
          <button class="planet-tab-btn" data-tab="facts">💡 Did You Know?</button>
        </nav>
        <div class="planet-drawer-content" id="planet-drawer-content">
          <!-- Tab content injected here -->
        </div>
      </aside>
    `;

    this.backdrop = this.container.querySelector('#planet-drawer-backdrop');
    this.drawer = this.container.querySelector('#planet-drawer');
    this.headerEl = this.container.querySelector('#planet-drawer-header');
    this.contentEl = this.container.querySelector('#planet-drawer-content');
    this.tabsWrap = this.container.querySelector('#planet-nav-tabs');

    this.backdrop.addEventListener('click', () => this.close());
    
    // Tab switching
    this.tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.planet-tab-btn');
      if (!btn) return;
      soundFX.playClick();
      this.tabsWrap.querySelectorAll('.planet-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.activeTab = btn.dataset.tab;
      this.renderTabContent();
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.container.classList.contains('active');
  }

  open(planetData) {
    if (!planetData) return;
    this.currentPlanet = planetData;
    this.activeTab = 'overview';

    // Reset tabs
    this.tabsWrap.querySelectorAll('.planet-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === 'overview');
    });

    // Apply color theme class
    this.drawer.className = `planet-drawer theme-${planetData.theme || 'mars'}`;

    this.renderHeader();
    this.renderTabContent();

    this.container.classList.add('active');
    document.body.classList.add('planet-modal-open');
    soundFX.playClick();
  }

  close() {
    this.container.classList.remove('active');
    document.body.classList.remove('planet-modal-open');
    soundFX.playClick();
  }

  renderHeader() {
    const p = this.currentPlanet;
    this.headerEl.innerHTML = `
      <div class="planet-header-banner" style="background-image: linear-gradient(180deg, rgba(10,14,24,0.4) 0%, rgba(10,14,24,0.92) 100%), url('${p.heroImageUrl}')">
        <button class="planet-close-btn" id="planet-close-btn" aria-label="Close Dossier">✕</button>
        <div class="planet-badge-tag">${p.icon} CELESTIAL TARGET DOSSIER</div>
        <h2 class="planet-title">${p.name}</h2>
        <div class="planet-subtitle">${p.subtitle}</div>
        <p class="planet-tagline">"${p.tagline}"</p>
        
        <div class="planet-header-actions">
          <button class="planet-action-btn primary" id="btn-focus-3d">
            <span>🎯</span> Lock Camera in 3D
          </button>
          ${p.id === 'mars' ? `
            <button class="planet-action-btn secondary" id="btn-explore-relics" data-relic="curiosity-msl">
              <span>🤖</span> Explore Curiosity Rover
            </button>
          ` : `
            <button class="planet-action-btn secondary" id="btn-explore-relics" data-relic="apollo-11-lrrr">
              <span>🚀</span> Apollo 11 Landing Site
            </button>
          `}
        </div>
      </div>
    `;

    this.headerEl.querySelector('#planet-close-btn').addEventListener('click', () => this.close());
    
    this.headerEl.querySelector('#btn-focus-3d').addEventListener('click', () => {
      soundFX.playClick();
      if (this.onFocusPlanet) {
        this.onFocusPlanet(this.currentPlanet.id);
      }
    });

    const exploreBtn = this.headerEl.querySelector('#btn-explore-relics');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        soundFX.playClick();
        const relicId = exploreBtn.dataset.relic;
        this.close();
        if (this.onSelectRelic) {
          this.onSelectRelic(relicId);
        }
      });
    }
  }

  renderTabContent() {
    if (!this.currentPlanet) return;
    const p = this.currentPlanet;

    switch (this.activeTab) {
      case 'overview':
        this.renderOverviewTab(p);
        break;
      case 'features':
        this.renderFeaturesTab(p);
        break;
      case 'missions':
        this.renderMissionsTab(p);
        break;
      case 'facts':
        this.renderFactsTab(p);
        break;
      default:
        this.renderOverviewTab(p);
    }
  }

  renderOverviewTab(p) {
    this.contentEl.innerHTML = `
      <div class="tab-pane-fade">
        <h3 class="section-title"><span>⚡</span> Key Planetary Telemetry</h3>
        <div class="planet-stats-grid">
          ${p.stats.map(s => `
            <div class="planet-stat-card">
              <div class="stat-header">
                <span class="stat-icon">${s.icon}</span>
                <span class="stat-label">${s.label}</span>
              </div>
              <div class="stat-value">${s.value}</div>
              <div class="stat-note">${s.note}</div>
            </div>
          `).join('')}
        </div>

        <div class="planet-callout-card">
          <div class="callout-icon">${p.icon}</div>
          <div class="callout-body">
            <h4>${p.name} Exploration Horizon</h4>
            <p>
              ${p.id === 'mars' 
                ? 'Mars remains humanity\'s primary candidate for interplanetary habitation. With ancient river valleys, towering dormant volcanoes, and subsurface ice reserves, modern rovers like Perseverance and Curiosity are scouting ancient microbial biosignatures to prepare for crewed Artemis and Starship landings in the 2030s.'
                : 'The Moon serves as humanity\'s cosmic springboard. Through NASA\'s Artemis initiative, international space agencies are targeting permanently shadowed polar craters like Shackleton for water ice extraction, building a permanent sustained human presence on the Lunar South Pole.'}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  renderFeaturesTab(p) {
    this.contentEl.innerHTML = `
      <div class="tab-pane-fade">
        <h3 class="section-title"><span>🗺️</span> Iconic Topographical Wonders</h3>
        <p class="section-intro">Explore extraordinary geologic structures, impact basins, and landing coordinates mapped by NASA orbiters.</p>
        <div class="features-list">
          ${p.surfaceFeatures.map(feat => `
            <article class="feature-card">
              <div class="feature-media">
                <img src="${feat.imageUrl}" alt="${feat.name}" loading="lazy" />
                <span class="feature-type-tag">${feat.type}</span>
              </div>
              <div class="feature-info">
                <div class="feature-header-row">
                  <h4 class="feature-name">${feat.icon} ${feat.name}</h4>
                  <span class="feature-coords">📍 ${feat.coordinates}</span>
                </div>
                <p class="feature-desc">${feat.description}</p>
                <div class="feature-fact">
                  <span class="fact-bulb">💡</span>
                  <span>${feat.fact}</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderMissionsTab(p) {
    this.contentEl.innerHTML = `
      <div class="tab-pane-fade">
        <h3 class="section-title"><span>🚀</span> Historical & Future Mission Roster</h3>
        <p class="section-intro">From the first flybys to upcoming crewed expeditions — key milestones in human exploration.</p>
        <div class="missions-timeline-list">
          ${p.missions.map(m => `
            <div class="mission-timeline-card status-${m.status}">
              <div class="mission-year-badge">${m.year}</div>
              <div class="mission-content">
                <div class="mission-top">
                  <span class="mission-name">${m.name}</span>
                  <span class="mission-agency">${m.agency}</span>
                  <span class="mission-badge ${m.status}">${m.status.toUpperCase()}</span>
                </div>
                <div class="mission-type">Type: <strong>${m.type}</strong></div>
                <p class="mission-desc">${m.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderFactsTab(p) {
    this.contentEl.innerHTML = `
      <div class="tab-pane-fade">
        <h3 class="section-title"><span>✨</span> Cosmic Curiosities & Mysteries</h3>
        <div class="facts-grid">
          ${p.funFacts.map(fact => `
            <div class="fun-fact-card">
              <div class="fact-top">
                <span class="fact-emoji">${fact.icon}</span>
                <h4 class="fact-title">${fact.title}</h4>
              </div>
              <p class="fact-text">${fact.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

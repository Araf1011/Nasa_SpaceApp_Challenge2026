/**
 * Application Bootstrap & State Orchestrator
 * COSMIC RELICS 2.0: Clean UI & Vertical Mission Storyline
 * 2026 NASA Space Apps Challenge
 */

import './style.css';
import { RELICS_DATA } from './data/relicsData.js';
import { SolarSystemScene } from './components/SolarSystem3D.js';
import { MissionStoryline } from './components/MissionStoryline.js';
import { MissionGame } from './components/MissionGame.js';
import { CosmicPassport } from './components/CosmicPassport.js';
import { soundFX } from './components/AudioEffects.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvasContainer = document.querySelector('#canvas-3d-container');
  const storylineModalContainer = document.querySelector('#mission-storyline-container');
  const gameModalContainer = document.querySelector('#mission-game-container');
  const quickSelect = document.querySelector('#quick-target-select');
  const quickPillsRow = document.querySelector('#quick-pills-row');
  
  // Timeline Dock Elements
  const timelineToggleBtn = document.querySelector('#timeline-toggle-btn');
  const dockSliderWrap = document.querySelector('#dock-slider-wrap');
  const dockTimelineRange = document.querySelector('#dock-timeline-range');
  const timelineYearLabel = document.querySelector('#timeline-year-label');

  // Rotation Speed Dock Elements
  const speedToggleBtn = document.querySelector('#speed-toggle-btn');
  const speedSliderWrap = document.querySelector('#speed-slider-wrap');
  const speedRange = document.querySelector('#speed-range');
  const speedValueLabel = document.querySelector('#speed-value-label');

  // World Selector Elements
  const worldSelectorRow = document.querySelector('#world-selector-row');
  const worldInfoTitle = document.querySelector('#world-info-title');
  const worldInfoStats = document.querySelector('#world-info-stats');

  // Top Nav Buttons
  const passportBtn = document.querySelector('#nav-passport-btn');
  const muteBtn = document.querySelector('#nav-mute-toggle-btn');
  const muteIcon = document.querySelector('#mute-icon');
  const resetCameraBtn = document.querySelector('#nav-reset-camera-btn');

  // Passport & Cert Modals
  const passportModal = document.querySelector('#passport-modal-container');
  const passportContentSlot = document.querySelector('#passport-content-slot');
  const passportCloseBtn = document.querySelector('#passport-close-btn');
  const passportBackdrop = document.querySelector('#passport-backdrop');

  // 1. Initialize Cosmic Passport
  const passport = new CosmicPassport(passportContentSlot, (relicId) => {
    const relic = RELICS_DATA.find(r => r.id === relicId);
    if (relic) storylineDrawer.open(relic);
  });

  // 2. Initialize Mission Storyline Component (Vertical Flow & 3D Model Inspector)
  const storylineDrawer = new MissionStoryline(
    storylineModalContainer,
    (relicId) => {
      solarScene.flyToRelic(relicId);
    },
    (badgeId) => {
      passport.unlockBadge(badgeId);
    },
    (relic) => {
      missionGame.open(relic);
    }
  );

  // 2b. Initialize Chapter-Gated Mission Game (XP, unlocks, story-driven challenges)
  const missionGame = new MissionGame(gameModalContainer, (badgeId) => {
    passport.unlockBadge(badgeId);
  });

  // 3. Initialize Photorealistic 3D Solar System
  const solarScene = new SolarSystemScene(canvasContainer, (selectedRelic) => {
    storylineDrawer.open(selectedRelic);
  });
  solarScene.setRelics(RELICS_DATA);

  // 4. Populate Quick Search Dropdown
  RELICS_DATA.forEach(relic => {
    const opt = document.createElement('option');
    opt.value = relic.id;
    opt.textContent = `${relic.name} (${relic.domainLabel})`;
    quickSelect.appendChild(opt);
  });

  quickSelect.addEventListener('change', (e) => {
    const relicId = e.target.value;
    const relic = RELICS_DATA.find(r => r.id === relicId);
    if (relic) {
      soundFX.playClick();
      solarScene.flyToRelic(relic.id);
      storylineDrawer.open(relic);
    }
  });

  // 5. World Selector: Approach a Planet & Auto-Update Equipment Row
  const CATEGORY_ICONS = { mars: '🔴', moon: '🌕', 'deep-space': '🚀', lagrange: '🔭', 'sun-asteroids': '☀️' };
  const WORLD_LABELS = { all: 'All Worlds', moon: 'The Moon', mars: 'Mars' };

  let currentWorld = 'all';
  let currentMaxYear = 2026;

  function renderShowcasePills(relics) {
    quickPillsRow.innerHTML = '';
    if (!relics.length) {
      quickPillsRow.innerHTML = `<span class="empty-world-state">No equipment recorded here yet.</span>`;
      return;
    }
    relics.forEach((relic, i) => {
      const icon = CATEGORY_ICONS[relic.category] || '🛰️';
      const pill = document.createElement('button');
      pill.className = 'relic-pill-btn';
      pill.style.animationDelay = `${i * 45}ms`;
      pill.innerHTML = `<span>${icon}</span> <span>${relic.shortName}</span> <span class="pill-domain-tag">${relic.domainLabel}</span>`;
      pill.addEventListener('click', () => {
        soundFX.playClick();
        solarScene.flyToRelic(relic.id);
        storylineDrawer.open(relic);
      });
      quickPillsRow.appendChild(pill);
    });
  }

  function updateWorldInfo(world, relics) {
    worldInfoTitle.textContent = WORLD_LABELS[world] || 'All Worlds';
    const sites = new Set(relics.map(r => r.location)).size;
    worldInfoStats.textContent = world === 'all'
      ? `${relics.length} Explorers Across the Solar System`
      : `${relics.length} Explorer${relics.length === 1 ? '' : 's'} · ${sites} Mission Site${sites === 1 ? '' : 's'}`;
  }

  function updateSceneRelics() {
    const filtered = RELICS_DATA.filter(r =>
      r.launchYear <= currentMaxYear && (currentWorld === 'all' || r.category === currentWorld)
    );
    solarScene.setRelics(filtered);
  }

  function selectWorld(world) {
    currentWorld = world;
    worldSelectorRow.querySelectorAll('.world-select-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.planet === world);
    });

    const worldRelics = RELICS_DATA.filter(r => world === 'all' || r.category === world);
    renderShowcasePills(worldRelics);
    updateWorldInfo(world, worldRelics);
    updateSceneRelics();

    if (world === 'all') {
      solarScene.resetOverview();
    } else {
      solarScene.flyToPlanet(world);
    }
  }

  worldSelectorRow.querySelectorAll('.world-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      selectWorld(btn.dataset.planet);
    });
  });

  // Initial showcase: a curated cross-section of famous hardware
  const showcaseRelicIds = [
    'opportunity-mer-b',
    'curiosity-msl',
    'perseverance-ingenuity',
    'voyager-1',
    'apollo-11-lrrr',
    'insight-lander'
  ];
  renderShowcasePills(showcaseRelicIds.map(id => RELICS_DATA.find(r => r.id === id)).filter(Boolean));
  updateWorldInfo('all', RELICS_DATA);

  // 6. Timeline Scrubber in Dock
  timelineToggleBtn.addEventListener('click', () => {
    soundFX.playClick();
    dockSliderWrap.classList.toggle('hidden');
  });

  dockTimelineRange.addEventListener('input', (e) => {
    const year = parseInt(e.target.value);
    currentMaxYear = year;
    timelineYearLabel.textContent = `Year: ${year} (${year === 2026 ? 'All Missions' : 'Historic Filter'})`;
    updateSceneRelics();
  });

  // 6b. Planet Rotation Speed Control
  speedToggleBtn.addEventListener('click', () => {
    soundFX.playClick();
    speedSliderWrap.classList.toggle('hidden');
  });

  speedRange.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    solarScene.timeScale = speed;
    speedValueLabel.textContent = speed === 0 ? 'Rotation Speed: Paused' : `Rotation Speed: ${speed.toFixed(1)}×`;
  });

  // 7. Navigation Actions
  const labelsBtn = document.querySelector('#nav-labels-toggle-btn');
  const labelsBtnText = document.querySelector('#labels-btn-text');
  if (labelsBtn) {
    labelsBtn.addEventListener('click', () => {
      soundFX.playClick();
      solarScene.showLabels = !solarScene.showLabels;
      if (!solarScene.showLabels) {
        solarScene.labelsContainer.style.display = 'none';
        labelsBtnText.textContent = 'Labels OFF';
      } else {
        solarScene.labelsContainer.style.display = 'block';
        labelsBtnText.textContent = 'Labels ON';
      }
    });
  }

  passportBtn.addEventListener('click', () => {
    soundFX.playClick();
    passport.render();
    passport.initEventListeners();
    passportModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closePassport = () => {
    soundFX.playClick();
    passportModal.classList.remove('active');
    document.body.style.overflow = '';
  };
  passportCloseBtn.addEventListener('click', closePassport);
  passportBackdrop.addEventListener('click', closePassport);

  muteBtn.addEventListener('click', () => {
    const isMuted = soundFX.toggleMute();
    muteIcon.textContent = isMuted ? '🔇' : '🔊';
  });

  resetCameraBtn.addEventListener('click', () => {
    soundFX.playClick();
    solarScene.resetOverview();
  });

  // Welcome audio gesture listener
  const unlockAudio = () => {
    soundFX.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  console.log('★ COSMIC RELICS 2.0 Loaded: Realistic Solar System & Mission Storyline ready.');
});

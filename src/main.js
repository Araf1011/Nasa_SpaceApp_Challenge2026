/**
 * Application Bootstrap & State Orchestrator
 * COSMIC RELICS 2.0: Clean UI & Vertical Mission Storyline
 * 2026 NASA Space Apps Challenge
 */

import './style.css';
import { RELICS_DATA } from './data/relicsData.js';
import { SolarSystemScene } from './components/SolarSystem3D.js';
import { MissionStoryline } from './components/MissionStoryline.js';
import { CosmicPassport } from './components/CosmicPassport.js';
import { soundFX } from './components/AudioEffects.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvasContainer = document.querySelector('#canvas-3d-container');
  const storylineModalContainer = document.querySelector('#mission-storyline-container');
  const quickSelect = document.querySelector('#quick-target-select');
  const quickPillsRow = document.querySelector('#quick-pills-row');
  
  // Timeline Dock Elements
  const timelineToggleBtn = document.querySelector('#timeline-toggle-btn');
  const dockSliderWrap = document.querySelector('#dock-slider-wrap');
  const dockTimelineRange = document.querySelector('#dock-timeline-range');
  const timelineYearLabel = document.querySelector('#timeline-year-label');

  // Top Nav Buttons
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
    }
  );

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

  // 5. Populate Quick Showcase Pills in Bottom Dock
  const showcaseRelicIds = [
    'curiosity-msl',
    'perseverance-ingenuity',
    'voyager-1',
    'jwst-telescope',
    'apollo-11-lrrr',
    'parker-solar-probe'
  ];

  showcaseRelicIds.forEach(id => {
    const relic = RELICS_DATA.find(r => r.id === id);
    if (!relic) return;

    let icon = '🚀';
    if (relic.category === 'mars') icon = '🔴';
    if (relic.category === 'moon') icon = '🌕';
    if (relic.category === 'lagrange') icon = '🔭';
    if (relic.category === 'sun-asteroids') icon = '☀️';

    const pill = document.createElement('button');
    pill.className = 'relic-pill-btn';
    pill.innerHTML = `<span>${icon}</span> <span>${relic.shortName}</span>`;
    pill.addEventListener('click', () => {
      soundFX.playClick();
      solarScene.flyToRelic(relic.id);
      storylineDrawer.open(relic);
    });
    quickPillsRow.appendChild(pill);
  });

  // 6. Timeline Scrubber in Dock
  timelineToggleBtn.addEventListener('click', () => {
    soundFX.playClick();
    dockSliderWrap.classList.toggle('hidden');
  });

  dockTimelineRange.addEventListener('input', (e) => {
    const year = parseInt(e.target.value);
    timelineYearLabel.textContent = `Year: ${year} (${year === 2026 ? 'All Missions' : 'Historic Filter'})`;
    
    // Filter relics in 3D scene
    const filtered = RELICS_DATA.filter(r => r.launchYear <= year);
    solarScene.setRelics(filtered);
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

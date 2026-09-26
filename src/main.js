/**
 * Application Bootstrap & State Orchestrator
 * COSMIC RELICS 2.0: Clean UI & Vertical Mission Storyline
 * 2026 NASA Space Apps Challenge
 */

import './style.css';
import { RELICS_DATA } from './data/relicsData.js';
import { PLANET_DATA } from './data/planetData.js';
import { SolarSystemScene } from './components/SolarSystem3D.js';
import { MissionStoryline } from './components/MissionStoryline.js';
import { PlanetDetailPanel } from './components/PlanetDetailPanel.js';
import { PlanetSurfaceExplorer } from './components/PlanetSurfaceExplorer.js';
import { CosmicPassport } from './components/CosmicPassport.js';
import { soundFX } from './components/AudioEffects.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvasContainer = document.querySelector('#canvas-3d-container');
  const storylineModalContainer = document.querySelector('#mission-storyline-container');
  const planetModalContainer = document.querySelector('#planet-detail-container');
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
  let surfaceExplorer = null;
  const solarScene = new SolarSystemScene(
    canvasContainer, 
    (selectedRelic) => {
      storylineDrawer.open(selectedRelic);
    },
    (planetId) => {
      if (storylineDrawer.isOpen && storylineDrawer.isOpen()) storylineDrawer.close();
      if (planetId === 'earth') return;
      if (PLANET_DATA[planetId] && surfaceExplorer) {
        surfaceExplorer.enter(planetId, PLANET_DATA[planetId]);
      }
    }
  );
  solarScene.setRelics(RELICS_DATA);

  // 4. Initialize Planetary Surface Explorer (Realistic 3D Ground & Expeditions)
  surfaceExplorer = new PlanetSurfaceExplorer(
    solarScene.scene,
    solarScene.camera,
    solarScene,
    () => {
      solarScene.exitSurfaceMode();
    }
  );
  solarScene.surfaceExplorer = surfaceExplorer;

  // 5. Populate Quick Search Dropdown with Planets & Relics
  const planetOptGroup = document.createElement('optgroup');
  planetOptGroup.label = '🪐 Planetary Missions (Click to Launch Rocket)';
  
  const moonOpt = document.createElement('option');
  moonOpt.value = 'planet:moon';
  moonOpt.textContent = '🚀 Launch to The Moon (Apollo & Artemis)';
  planetOptGroup.appendChild(moonOpt);

  const marsOpt = document.createElement('option');
  marsOpt.value = 'planet:mars';
  marsOpt.textContent = '🚀 Launch to Mars (Viking, Curiosity & Perseverance)';
  planetOptGroup.appendChild(marsOpt);

  quickSelect.appendChild(planetOptGroup);

  const relicOptGroup = document.createElement('optgroup');
  relicOptGroup.label = '🛰️ Deep Spacecraft & Relics';
  RELICS_DATA.forEach(relic => {
    const opt = document.createElement('option');
    opt.value = `relic:${relic.id}`;
    opt.textContent = `${relic.name} (${relic.domainLabel})`;
    relicOptGroup.appendChild(opt);
  });
  quickSelect.appendChild(relicOptGroup);

  quickSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val.startsWith('planet:')) {
      const pid = val.replace('planet:', '');
      soundFX.playClick();
      solarScene.launchMission(pid);
    } else if (val.startsWith('relic:')) {
      const relicId = val.replace('relic:', '');
      const relic = RELICS_DATA.find(r => r.id === relicId);
      if (relic) {
        soundFX.playClick();
        solarScene.flyToRelic(relic.id);
        storylineDrawer.open(relic);
      }
    }
  });

  // 6. Populate Quick Showcase Pills in Bottom Dock (Include Rocket Launch to Moon & Mars)
  const celestialPills = [
    { id: 'moon', label: 'Launch to Moon 🚀', icon: '🌕' },
    { id: 'mars', label: 'Launch to Mars 🚀', icon: '🔴' },
  ];

  celestialPills.forEach(item => {
    const pill = document.createElement('button');
    pill.className = `relic-pill-btn planet-pill ${item.id}-pill`;
    pill.innerHTML = `<span>${item.icon}</span> <span>${item.label}</span>`;
    pill.addEventListener('click', () => {
      soundFX.playClick();
      solarScene.launchMission(item.id);
    });
    quickPillsRow.appendChild(pill);
  });

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

  // 7. Timeline Scrubber in Dock
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

  // Cosmic Passport Modal Trigger & Close Listeners
  const navPassportBtn = document.querySelector('#nav-passport-btn');
  if (navPassportBtn) {
    navPassportBtn.addEventListener('click', () => {
      soundFX.playClick();
      passportModal.classList.add('active');
      passport.render();
    });
  }
  if (passportCloseBtn) {
    passportCloseBtn.addEventListener('click', () => {
      soundFX.playClick();
      passportModal.classList.remove('active');
    });
  }
  if (passportBackdrop) {
    passportBackdrop.addEventListener('click', () => {
      passportModal.classList.remove('active');
    });
  }

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

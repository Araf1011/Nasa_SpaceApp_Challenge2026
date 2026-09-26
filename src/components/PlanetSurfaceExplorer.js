/**
 * PlanetSurfaceExplorer Component (Photorealistic 3D Surface Landscape & Expeditions)
 * - Identical ModernCoreSpacecraft model: 100% visual consistency between flight and landing!
 * - Ultra-high detail procedural terrain with bump mapping, crater rims, and dunes
 * - The Moon: Photorealistic regolith, crater fields, bootprints, waving flag, and glowing Earth in the starry sky
 * - Mars: Oxidized red sand dunes, volcanic basalt rocks, tire tracks, atmospheric salmon sky dome, and dust devils
 * - Astronaut Surface Disembarkation Sequence:
 *     - Crew hatch opens, ladder extends
 *     - Detailed 3D astronaut descends ladder, steps onto alien regolith leaving bootprints, salutes mission flag
 *     - Stands beside craft during exploration (NO popup modal at start; user chooses what to inspect!)
 * - Homeward Return Flight Sequence:
 *     - Astronaut re-boards rocket, hatch seals, ladder retracts
 *     - Surface engines ignite with dust blast, vehicle lifts off vertically
 *     - Seamlessly transitions into interplanetary return flight back to Earth!
 * - Historic craft models (Apollo Lunar Module with gold thermal foil, Rovers, Ingenuity) and mission chronicles
 */

import * as THREE from 'three';
import { soundFX } from './AudioEffects.js';
import { AstronautCharacter } from './AstronautModel.js';
import { ModernCoreSpacecraft } from './ModernRocketModel.js';
import { 
  createLunarGroundTexture, 
  createLunarBumpTexture, 
  createMartianGroundTexture, 
  createMartianBumpTexture 
} from '../utils/textureGenerator.js';
import { 
  createApolloLanderModel, 
  createCuriosityRoverModel, 
  createIngenuityHelicopterModel,
  createChandrayaanModel,
  highlightPart
} from './Craft3DModels.js';

export class PlanetSurfaceExplorer {
  constructor(scene, camera, solarScene, onExitToGalaxy) {
    this.scene = scene;
    this.camera = camera;
    this.solarScene = solarScene;
    this.onExitToGalaxy = onExitToGalaxy;

    this.isActive = false;
    this.currentPlanetId = null;
    this.planetData = null;
    this.selectedExpedition = null;
    this.activeFilter = 'all';

    // Root Group for all surface landscape objects
    this.surfaceGroup = new THREE.Group();
    this.surfaceGroup.visible = false;
    this.scene.add(this.surfaceGroup);

    this.terrainMesh = null;
    this.skyDome = null;
    this.earthInSky = null;
    this.spacecraftCore = null;
    this.landedRocket = null;
    this.ascentPlume = null;
    this.ascentDustBlast = null;
    this.strobeLight = null;

    // 3D Astronaut Character on Surface
    this.astronaut = null;
    this.isDisembarking = false;
    this.disembarkTimer = 0;
    this.isReboarding = false;
    this.reboardTimer = 0;
    this.isAscending = false;

    // Astronaut Walking to Historic Spacecraft Traversal State
    this.isWalkingToCraft = false;
    this.walkTargetPos = new THREE.Vector3();
    this.walkStartPos = new THREE.Vector3();
    this.walkElapsed = 0;
    this.walkDuration = 3.0;
    this.walkTargetExp = null;
    this.walkTargetStation = null;
    this.currentCraftModel = null;
    this.activeStoryChapter = 0;
    this.isAutoPlayingStory = false;
    this.autoPlayInterval = null;
    this.typewriterTimeout = null;
    this.isSpeakingVoice = false;

    this.dustParticles = null;
    this.historicCraftGroup = null;
    this.flagMesh = null;
    this.surfaceLight = null;

    this.beacons = [];
    this.labelsMap = new Map();

    // Orbit controls on ground level
    this.surfaceSpherical = {
      radius: 17.5,
      theta: 0.8,
      phi: 1.25
    };
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.surfaceLookAt = new THREE.Vector3(0, 2.2, 0);

    this.initDOM();
    this.initEventListeners();
  }

  initDOM() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'planet-surface-explorer-hud';
    this.overlay.className = 'planet-surface-explorer-hud';
    this.overlay.innerHTML = `
      <!-- Top Surface Header & Controls -->
      <header class="surface-top-bar">
        <div class="surface-brand-info">
          <button class="surface-launch-btn primary-glow" id="surface-return-earth-btn">
            <span>🚀</span> Board Rocket & Return to Earth
          </button>
          <div class="surface-title-group">
            <h2 class="surface-main-title" id="surface-main-title">SURFACE LANDSCAPE</h2>
            <span class="surface-badge" id="surface-badge">GROUND CHRONICLES ACTIVE</span>
          </div>
        </div>

        <div class="surface-filter-pills" id="surface-filter-pills">
          <button class="surface-filter-btn active" data-filter="all">All Sites</button>
          <button class="surface-filter-btn" data-filter="crewed">👨‍🚀 Crewed</button>
          <button class="surface-filter-btn" data-filter="robotic">🤖 Robotic</button>
          <button class="surface-filter-btn" data-filter="future">🚀 Future</button>
        </div>
      </header>

      <!-- Astronaut Disembarkation Notification Banner -->
      <div class="surface-astronaut-banner" id="surface-astronaut-banner">
        <span class="astronaut-badge-icon">👨‍🚀</span>
        <div class="astronaut-badge-content">
          <div class="astronaut-badge-title">TOUCHDOWN CONFIRMED // CREW DISEMBARKATION</div>
          <div class="astronaut-badge-desc" id="surface-astronaut-status">Astronaut descending landing ladder to surface...</div>
        </div>
      </div>

      <!-- 3D Landing Site Floating Pins Layer -->
      <div class="surface-pins-layer" id="surface-pins-layer"></div>

      <!-- Bottom Mission Timeline Carousel -->
      <div class="surface-bottom-carousel-wrap">
        <div class="surface-carousel-track" id="surface-carousel-track">
          <!-- Populated dynamically -->
        </div>
      </div>

      <!-- Detailed Expedition Story Card Modal -->
      <div class="expedition-story-modal" id="expedition-story-modal">
        <div class="story-modal-backdrop" id="story-modal-backdrop"></div>
        <div class="story-modal-dialog" id="story-modal-dialog">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Ascent Transition Overlay -->
      <div class="ascent-curtain" id="ascent-curtain">
        <div class="ascent-msg">
          <span class="ascent-icon">🚀</span>
          <h3 id="ascent-headline">ASCENT ENGINES FIRING</h3>
          <p id="ascent-subtitle">Lifting off from surface... Initiating Trans-Earth Injection!</p>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.overlay.style.display = 'none';

    this.returnBtn = this.overlay.querySelector('#surface-return-earth-btn');
    this.returnBtn.addEventListener('click', () => {
      this.launchAscentToEarth();
    });

    this.filterWrap = this.overlay.querySelector('#surface-filter-pills');
    this.filterWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.surface-filter-btn');
      if (!btn) return;
      soundFX.playClick();
      this.filterWrap.querySelectorAll('.surface-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.activeFilter = btn.dataset.filter;
      this.renderCarousel();
      this.updateBeaconVisibility();
    });

    this.pinsLayer = this.overlay.querySelector('#surface-pins-layer');
    this.carouselTrack = this.overlay.querySelector('#surface-carousel-track');
    this.storyModal = this.overlay.querySelector('#expedition-story-modal');
    this.storyDialog = this.overlay.querySelector('#story-modal-dialog');
    this.storyBackdrop = this.overlay.querySelector('#story-modal-backdrop');
    this.ascentCurtain = this.overlay.querySelector('#ascent-curtain');
    this.astronautBanner = this.overlay.querySelector('#surface-astronaut-banner');
    this.astronautStatusDesc = this.overlay.querySelector('#surface-astronaut-status');

    this.storyBackdrop.addEventListener('click', () => this.closeStoryModal());
  }

  initEventListeners() {
    window.addEventListener('mousedown', (e) => {
      if (!this.isActive) return;
      if (e.target.closest('.surface-top-bar, .surface-bottom-carousel-wrap, .expedition-story-modal, .surface-site-pin')) return;
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isActive || !this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;

      this.surfaceSpherical.theta -= dx * 0.005;
      this.surfaceSpherical.phi -= dy * 0.004;
      this.surfaceSpherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.04, this.surfaceSpherical.phi));

      this.updateCameraOrbit();
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('wheel', (e) => {
      if (!this.isActive) return;
      if (e.target.closest('.surface-bottom-carousel-wrap, .story-modal-dialog')) return;
      e.preventDefault();
      this.surfaceSpherical.radius += e.deltaY * 0.02;
      this.surfaceSpherical.radius = Math.max(8.0, Math.min(45.0, this.surfaceSpherical.radius));
      this.updateCameraOrbit();
    }, { passive: false });
  }

  updateCameraOrbit() {
    const x = this.surfaceLookAt.x + this.surfaceSpherical.radius * Math.sin(this.surfaceSpherical.phi) * Math.sin(this.surfaceSpherical.theta);
    const y = this.surfaceLookAt.y + this.surfaceSpherical.radius * Math.cos(this.surfaceSpherical.phi);
    const z = this.surfaceLookAt.z + this.surfaceSpherical.radius * Math.sin(this.surfaceSpherical.phi) * Math.cos(this.surfaceSpherical.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.surfaceLookAt);
  }

  enter(planetId, planetData) {
    this.isActive = true;
    this.currentPlanetId = planetId;
    this.planetData = planetData;
    this.activeFilter = 'all';

    // Hide solar system celestial bodies
    if (this.solarScene.sun) this.solarScene.sun.visible = false;
    if (this.solarScene.orbitLines) this.solarScene.orbitLines.forEach(l => l.visible = false);
    if (this.solarScene.asteroidBelt) this.solarScene.asteroidBelt.visible = false;
    if (this.solarScene.labelsContainer) this.solarScene.labelsContainer.style.display = 'none';
    Object.values(this.solarScene.celestialBodies).forEach(b => {
      if (b.mesh) b.mesh.visible = false;
    });

    // Build the realistic landscape for Moon or Mars
    this.buildSurfaceEnvironment(planetId);

    // Update Header Text
    const titleEl = this.overlay.querySelector('#surface-main-title');
    const badgeEl = this.overlay.querySelector('#surface-badge');
    if (planetId === 'moon') {
      titleEl.innerHTML = `🌕 THE MOON: LUNAR REGOLITH LANDSCAPE`;
      badgeEl.textContent = `TRANQUILITY BASE & EXPEDITIONS — EARTH HANGS ABOVE`;
      this.overlay.className = 'planet-surface-explorer-hud theme-moon';
    } else {
      titleEl.innerHTML = `🔴 MARS: MARTIAN SURFACE ENVIRONMENT`;
      badgeEl.textContent = `JEZERO & GALE CRATER EXPEDITIONS — SALMON DUST SKY`;
      this.overlay.className = 'planet-surface-explorer-hud theme-mars';
    }

    // Set initial camera view looking at landed rocket
    this.surfaceSpherical = { radius: 18.0, theta: 0.65, phi: 1.25 };
    this.surfaceLookAt.set(0, 2.2, 0);
    this.updateCameraOrbit();

    // Render the bottom carousel without auto-popping any modal dialog!
    this.selectedExpedition = null;
    this.renderCarousel();
    this.overlay.style.display = 'block';
    this.surfaceGroup.visible = true;

    // Start Astronaut Disembarkation Sequence — reset all state cleanly
    this.isDisembarking = true;
    this.disembarkTimer = 0;
    this.isReboarding = false;
    this.isAscending = false;
    this.isWalkingToCraft = false;

    // Clear any stale liftoff interval from a previous visit
    if (this._liftoffInterval) {
      clearInterval(this._liftoffInterval);
      this._liftoffInterval = null;
    }

    if (this.astronautBanner) {
      this.astronautBanner.style.opacity = '1';
      this.astronautBanner.style.display = 'flex';
      this.astronautStatusDesc.textContent = `Astronaut descending ladder onto ${planetId === 'moon' ? 'lunar regolith' : 'Martian soil'}...`;
    }

    // Position astronaut outside the open hatch at top of ladder
    if (this.astronaut) {
      this.astronaut.group.position.set(0, 3.2, 0.55);
      this.astronaut.group.rotation.set(0, 0, 0);
      this.astronaut.group.visible = true;
      this.astronaut.poseIdle();
    }

    // Open hatch and display ladder
    if (this.spacecraftCore) {
      this.spacecraftCore.setHatchOpen(true);
      this.spacecraftCore.setLadderVisible(true);
    }
  }

  // ──────────────────────────────────────────────────
  // MATHEMATICAL TERRAIN HEIGHT FIELD
  // Calculates exact elevation at any world (x, z) coordinate
  // ──────────────────────────────────────────────────
  getTerrainHeight(worldX, worldZ) {
    const vx = worldX;
    const vy = -worldZ;
    const distFromCenter = Math.hypot(vx, vy);

    let h = 0;
    if (distFromCenter > 8.5) {
      h += Math.sin(vx * 0.07) * Math.cos(vy * 0.07) * 2.2;
      h += Math.sin(vx * 0.18 + 0.9) * Math.cos(vy * 0.16) * 1.1;
      h += Math.sin(vx * 0.4) * Math.cos(vy * 0.4) * 0.35;

      const crater1Dist = Math.hypot(vx - 32, vy - 24);
      if (crater1Dist < 18) {
        const normD = crater1Dist / 18;
        if (normD < 0.8) h -= Math.cos(normD * Math.PI * 0.5) * 3.6;
        else h += Math.sin((normD - 0.8) / 0.2 * Math.PI) * 1.2;
      }

      const crater2Dist = Math.hypot(vx + 36, vy + 28);
      if (crater2Dist < 22) {
        const normD2 = crater2Dist / 22;
        if (normD2 < 0.8) h -= Math.cos(normD2 * Math.PI * 0.5) * 4.2;
        else h += Math.sin((normD2 - 0.8) / 0.2 * Math.PI) * 1.5;
      }
    }
    return h;
  }

  buildSurfaceEnvironment(planetId) {
    while (this.surfaceGroup.children.length > 0) {
      this.surfaceGroup.remove(this.surfaceGroup.children[0]);
    }
    this.beacons = [];
    this.labelsMap.clear();
    this.pinsLayer.innerHTML = '';

    const isMoon = planetId === 'moon';

    // 1. Directional Sun Lighting
    this.surfaceLight = new THREE.DirectionalLight(0xfff8ee, isMoon ? 3.5 : 2.5);
    this.surfaceLight.position.set(45, 60, 35);
    this.surfaceGroup.add(this.surfaceLight);

    const surfaceAmbient = new THREE.AmbientLight(isMoon ? 0x223355 : 0x7c2d12, isMoon ? 1.0 : 1.4);
    this.surfaceGroup.add(surfaceAmbient);

    // 2. High-Resolution Procedural Terrain Geometry with Craters & Dunes
    const terrainGeom = new THREE.PlaneGeometry(180, 180, 120, 120);
    const pos = terrainGeom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const h = this.getTerrainHeight(vx, -vy);
      pos.setZ(i, h);
    }
    terrainGeom.computeVertexNormals();

    const groundMap = isMoon ? createLunarGroundTexture() : createMartianGroundTexture();
    const bumpMap = isMoon ? createLunarBumpTexture() : createMartianBumpTexture();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: groundMap,
      bumpMap: bumpMap,
      bumpScale: isMoon ? 0.85 : 0.75,
      roughness: isMoon ? 0.92 : 0.86,
      metalness: 0.05
    });

    this.terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    this.terrainMesh.rotation.x = -Math.PI / 2;
    this.surfaceGroup.add(this.terrainMesh);

    // 3. Scattered Volcanic Boulders & Stones (anchored to terrain)
    const rockMat = new THREE.MeshStandardMaterial({
      color: isMoon ? 0x475569 : 0x78350f,
      bumpMap: bumpMap,
      bumpScale: 0.5,
      roughness: 0.95
    });
    for (let r = 0; r < 55; r++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 11 + Math.random() * 60;
      const rx = Math.cos(angle) * dist;
      const rz = Math.sin(angle) * dist;
      const scale = 0.35 + Math.random() * 1.2;
      const groundY = this.getTerrainHeight(rx, rz);

      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 1), rockMat);
      rock.position.set(rx, groundY + scale * 0.55, rz);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      this.surfaceGroup.add(rock);
    }

    // 4. The Landed Modern Spacecraft & 3D Astronaut
    this.buildLandedRocketOnSurface();
    this.buildSurfaceAstronaut();

    // 5. Sky Environment & Features
    if (isMoon) {
      this.scene.fog = null;
      this.buildEarthInMoonSky();
      this.buildPlantedFlag();
      this.buildAstronautFootprints();
    } else {
      this.scene.fog = new THREE.FogExp2(0xa14214, 0.0075);

      const skyGeom = new THREE.SphereGeometry(110, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const skyMat = new THREE.MeshBasicMaterial({
        color: 0xd97706,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.42
      });
      this.skyDome = new THREE.Mesh(skyGeom, skyMat);
      this.skyDome.position.y = -6;
      this.surfaceGroup.add(this.skyDome);

      const sunGeom = new THREE.SphereGeometry(2.4, 16, 16);
      const marsSun = new THREE.Mesh(sunGeom, new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
      marsSun.position.set(50, 42, -65);
      this.surfaceGroup.add(marsSun);

      this.buildRoverTireTracks();
      this.buildMartianDust();
    }

    // 6. Surface Expedition Stations
    this.buildGroundExpeditionStations();
  }

  buildEarthInMoonSky() {
    const earthGroup = new THREE.Group();
    const earthGeom = new THREE.SphereGeometry(7.5, 36, 36);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f4c81';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#22c55e';
    const continents = [
      { x: 300, y: 180, rx: 110, ry: 75 },
      { x: 360, y: 340, rx: 65, ry: 100 },
      { x: 600, y: 180, rx: 180, ry: 90 },
      { x: 580, y: 310, rx: 90, ry: 110 },
      { x: 840, y: 350, rx: 70, ry: 50 }
    ];
    continents.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    for (let c = 0; c < 35; c++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, 40 + Math.random() * 432, 50 + Math.random() * 100, 10 + Math.random() * 25, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const earthMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(canvas),
      roughness: 0.5,
      metalness: 0.1,
      emissive: 0x003366,
      emissiveIntensity: 0.4
    });

    const earthSphere = new THREE.Mesh(earthGeom, earthMat);
    earthGroup.add(earthSphere);

    const haloGeom = new THREE.SphereGeometry(7.85, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    earthGroup.add(new THREE.Mesh(haloGeom, haloMat));

    earthGroup.position.set(-38, 48, -75);
    this.surfaceGroup.add(earthGroup);
    this.earthInSky = earthSphere;
  }

  // ──────────────────────────────────────────────────
  // BUILD IDENTICAL MODERN SPACECRAFT ON SURFACE
  // ──────────────────────────────────────────────────
  buildLandedRocketOnSurface() {
    this.spacecraftCore = new ModernCoreSpacecraft({ isLanded: true });
    this.landedRocket = this.spacecraftCore.group;
    this.strobeLight = this.spacecraftCore.strobeLight;

    // Fully extend landing legs and set footpads resting firmly on the ground
    this.spacecraftCore.setLegsDeployProgress(1.0);
    this.spacecraftCore.setHatchOpen(true);
    this.spacecraftCore.setLadderVisible(true);

    // Surface Ascent Flame Plume (for return liftoff)
    this.ascentPlume = this.createAscentPlume();
    this.ascentPlume.position.set(0, -0.2, 0);
    this.ascentPlume.visible = false;
    this.landedRocket.add(this.ascentPlume);

    // Surface Radial Dust Cloud
    const dustGeom = new THREE.BufferGeometry();
    const dPos = new Float32Array(250 * 3);
    for (let j = 0; j < 250; j++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 6.5;
      dPos[j * 3] = Math.cos(a) * r;
      dPos[j * 3 + 1] = Math.random() * 1.5;
      dPos[j * 3 + 2] = Math.sin(a) * r;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    this.ascentDustBlast = new THREE.Points(dustGeom, new THREE.PointsMaterial({
      color: 0xd97706,
      size: 0.6,
      transparent: true,
      opacity: 0.0
    }));
    this.landedRocket.add(this.ascentDustBlast);

    // Rocket footpads touch surface at y = 0
    this.landedRocket.position.set(0, 1.25, 0);
    this.surfaceGroup.add(this.landedRocket);

    this.createLandedShipLabel(this.landedRocket);
  }

  createAscentPlume() {
    const plumeGroup = new THREE.Group();

    const outerGeom = new THREE.ConeGeometry(0.75, 4.2, 16);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xff6200,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    const outer = new THREE.Mesh(outerGeom, outerMat);
    outer.rotation.x = Math.PI;
    plumeGroup.add(outer);

    const innerGeom = new THREE.ConeGeometry(0.38, 2.5, 12);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const inner = new THREE.Mesh(innerGeom, innerMat);
    inner.rotation.x = Math.PI;
    inner.position.y = 0.3;
    plumeGroup.add(inner);

    return plumeGroup;
  }

  createLandedShipLabel(rocketMesh) {
    const pin = document.createElement('div');
    pin.className = 'surface-site-pin cat-ship';
    pin.innerHTML = `
      <span class="site-dot ship-pulse"></span>
      <span class="site-text">🚀 YOUR SPACECRAFT (STANDBY FOR ASCENT)</span>
    `;

    pin.addEventListener('click', () => {
      this.launchAscentToEarth();
    });

    this.pinsLayer.appendChild(pin);
    this.labelsMap.set(rocketMesh, { el: pin, yOffset: 6.8 });
  }

  // ──────────────────────────────────────────────────
  // BUILD DETAILED 3D ASTRONAUT ON SURFACE
  // ──────────────────────────────────────────────────
  buildSurfaceAstronaut() {
    this.astronaut = new AstronautCharacter();
    this.astronaut.group.scale.set(0.72, 0.72, 0.72);
    this.astronaut.group.position.set(0, 3.2, 0.55);
    this.surfaceGroup.add(this.astronaut.group);
  }

  buildPlantedFlag() {
    const flagGroup = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 }));
    pole.position.y = 1.4;
    flagGroup.add(pole);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), new THREE.MeshStandardMaterial({ color: 0xffd700 }));
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0.75, 2.78, 0);
    flagGroup.add(rod);

    const flagGeom = new THREE.PlaneGeometry(1.45, 0.95, 20, 10);
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#b91c1c'; ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = '#ffffff';
    for (let s = 1; s < 13; s += 2) ctx.fillRect(0, (s / 13) * 160, 256, 160 / 13);
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(0, 0, 110, 86);
    ctx.fillStyle = '#ffffff'; ctx.font = '14px sans-serif'; ctx.fillText('★ ★ ★', 18, 32); ctx.fillText('★ ★ ★', 28, 54);

    const flagMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(canvas),
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    this.flagMesh = new THREE.Mesh(flagGeom, flagMat);
    this.flagMesh.position.set(0.75, 2.3, 0);
    flagGroup.add(this.flagMesh);

    flagGroup.position.set(4.8, 0, 3.2);
    this.surfaceGroup.add(flagGroup);
  }

  buildAstronautFootprints() {
    const fpMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 1.0 });
    const fpGeom = new THREE.BoxGeometry(0.18, 0.02, 0.38);

    for (let step = 0; step < 16; step++) {
      const fp = new THREE.Mesh(fpGeom, fpMat);
      const isRight = step % 2 === 0;
      const progress = step / 16;
      const x = 0.6 + progress * 2.8 + (isRight ? 0.14 : -0.14);
      const z = 0.8 + progress * 2.2;
      const groundY = this.getTerrainHeight(x, z);
      fp.position.set(x, groundY + 0.015, z);
      fp.rotation.y = 0.65;
      this.surfaceGroup.add(fp);
    }
  }

  buildRoverTireTracks() {
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.95 });
    const trackGeom = new THREE.BoxGeometry(0.24, 0.02, 0.5);

    for (let t = 0; t < 22; t++) {
      const p = t / 22;
      const x = 2.0 + p * 12.0;
      const z = 1.0 + p * 8.0;
      const groundYL = this.getTerrainHeight(x - 0.6, z);
      const groundYR = this.getTerrainHeight(x + 0.6, z);

      const trackL = new THREE.Mesh(trackGeom, trackMat);
      trackL.position.set(x - 0.6, groundYL + 0.015, z);
      trackL.rotation.y = 0.58;
      this.surfaceGroup.add(trackL);

      const trackR = new THREE.Mesh(trackGeom, trackMat);
      trackR.position.set(x + 0.6, groundYR + 0.015, z);
      trackR.rotation.y = 0.58;
      this.surfaceGroup.add(trackR);
    }
  }

  buildMartianDust() {
    const dCount = 350;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(dCount * 3);

    for (let i = 0; i < dCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = 0.5 + Math.random() * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });
    this.dustParticles = new THREE.Points(geom, mat);
    this.surfaceGroup.add(this.dustParticles);
  }

  buildGroundExpeditionStations() {
    const expeditions = this.planetData.expeditions || [];
    this.historicCraftGroup = new THREE.Group();
    this.surfaceGroup.add(this.historicCraftGroup);

    expeditions.forEach((exp, idx) => {
      const stationGroup = new THREE.Group();
      stationGroup.userData = { expedition: exp };

      const angle = (idx / expeditions.length) * Math.PI * 2;
      const radius = 20 + (idx % 3) * 7;
      const sx = Math.cos(angle) * radius;
      const sz = Math.sin(angle) * radius;
      const groundY = this.getTerrainHeight(sx, sz);

      stationGroup.position.set(sx, groundY + 0.05, sz);

      const ringGeom = new THREE.RingGeometry(1.4, 1.85, 24);
      const ringColor = exp.category === 'crewed' ? 0xffd166 : (exp.category === 'future' ? 0x00f0ff : 0xff3366);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      stationGroup.add(ringMesh);
      stationGroup.userData.ring = ringMesh;

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 4.0, 8),
        new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.8 })
      );
      beam.position.y = 2.0;
      stationGroup.add(beam);

      this.surfaceGroup.add(stationGroup);
      this.beacons.push(stationGroup);

      this.createGroundPin(stationGroup, exp);
    });
  }

  createGroundPin(stationGroup, exp) {
    const pin = document.createElement('div');
    pin.className = `surface-site-pin cat-${exp.category}`;
    pin.innerHTML = `
      <span class="site-dot"></span>
      <span class="site-text">${exp.shortName || exp.name}</span>
    `;

    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      soundFX.playClick();
      this.selectExpedition(exp, true);
    });

    this.pinsLayer.appendChild(pin);
    this.labelsMap.set(stationGroup, { el: pin, yOffset: 4.2 });
  }

  selectExpedition(exp, smoothCam = true) {
    this.selectedExpedition = exp;
    this.renderCarousel();

    const station = this.beacons.find(b => b.userData.expedition.id === exp.id);
    if (!station) return;

    // Spawn historic craft at station
    this.spawnHistoricCraftAtStation(exp, station.position);

    // If disembarkation is still ongoing, transition astronaut to ground immediately
    if (this.isDisembarking) {
      this.isDisembarking = false;
      if (this.astronaut) {
        this.astronaut.group.position.set(2.4, 0.0, 2.62);
        this.astronaut.poseIdle();
      }
    }

    if (!this.astronaut) {
      if (smoothCam) {
        this.surfaceLookAt.copy(station.position).add(new THREE.Vector3(0, 1.8, 0));
        this.surfaceSpherical.radius = 12.0;
        this.updateCameraOrbit();
      }
      this.openStoryModal(exp);
      return;
    }

    // Calculate rendezvous stop position: 2.5m away from craft center, facing it
    const astroPos = this.astronaut.group.position;
    const craftPos = station.position;
    const dir = new THREE.Vector3().subVectors(astroPos, craftPos);
    dir.y = 0;
    if (dir.lengthSq() < 0.01) {
      dir.set(0, 0, 1);
    }
    dir.normalize();
    const targetPos = new THREE.Vector3().copy(craftPos).addScaledVector(dir, 2.5);
    // Snap target Y to terrain surface so astronaut doesn't clip underground
    targetPos.y = this.getTerrainHeight(targetPos.x, targetPos.z) + 0.05;

    const dist = astroPos.distanceTo(targetPos);

    // Turn astronaut toward destination
    const dx = targetPos.x - astroPos.x;
    const dz = targetPos.z - astroPos.z;
    this.astronaut.group.rotation.y = Math.atan2(dx, dz);

    if (dist < 1.2) {
      // Already at station! Turn to face craft directly and awaken
      const toCraft = new THREE.Vector3().subVectors(craftPos, astroPos);
      this.astronaut.group.rotation.y = Math.atan2(toCraft.x, toCraft.z);
      this.astronaut.poseSalute();
      this.awakenSpacecraftAndOpenStory(exp, station);
      return;
    }

    // Start astronaut walking traversal towards the spacecraft!
    this.isWalkingToCraft = true;
    this.walkTargetPos.copy(targetPos);
    this.walkStartPos.copy(astroPos);
    this.walkTargetExp = exp;
    this.walkTargetStation = station;
    this.walkElapsed = 0;
    this.walkDuration = Math.min(3.8, Math.max(1.8, dist / 4.2));

    // Show live HUD EVA banner with ETA & distance
    if (this.astronautBanner) {
      this.astronautBanner.style.display = 'flex';
      this.astronautBanner.style.opacity = '1';
      const titleEl = this.astronautBanner.querySelector('.astronaut-badge-title');
      if (titleEl) {
        titleEl.textContent = `EVA TRAVERSAL // RENDEZVOUS WITH ${exp.shortName.toUpperCase()}`;
      }
      if (this.astronautStatusDesc) {
        this.astronautStatusDesc.innerHTML = `
          Astronaut moving across terrain towards <strong>${exp.shortName}</strong> (${dist.toFixed(1)}m)...
          <button id="skip-walk-btn" class="skip-walk-btn">Skip Walk ⏭️</button>
        `;
        const skipBtn = this.astronautBanner.querySelector('#skip-walk-btn');
        if (skipBtn) {
          skipBtn.onclick = (e) => {
            e.stopPropagation();
            this.finishAstronautWalk();
          };
        }
      }
    }

    this.surfaceSpherical.radius = 13.5;
  }

  finishAstronautWalk() {
    if (!this.isWalkingToCraft && !this.walkTargetExp) return;
    this.isWalkingToCraft = false;
    const exp = this.walkTargetExp;
    const station = this.walkTargetStation;

    if (this.astronaut && this.walkTargetPos) {
      const finalX = this.walkTargetPos.x;
      const finalZ = this.walkTargetPos.z;
      const finalY = this.getTerrainHeight(finalX, finalZ) + 0.05;
      this.astronaut.group.position.set(finalX, finalY, finalZ);
      if (station) {
        const toCraft = new THREE.Vector3().subVectors(station.position, this.astronaut.group.position);
        this.astronaut.group.rotation.y = Math.atan2(toCraft.x, toCraft.z);
      }
      this.astronaut.poseSalute();
    }

    this.awakenSpacecraftAndOpenStory(exp, station);
  }

  awakenSpacecraftAndOpenStory(exp, station) {
    // Play telemetry audio chime
    soundFX.playSatelliteAwaken();

    // Pulse beacon ring with bright cyan light
    if (station && station.userData.ring) {
      const ring = station.userData.ring;
      ring.material.color.setHex(0x00f0ff);
      ring.scale.set(2.2, 2.2, 2.2);
    }

    // Update banner
    if (this.astronautBanner) {
      const titleEl = this.astronautBanner.querySelector('.astronaut-badge-title');
      if (titleEl) {
        titleEl.textContent = `TRANSMISSION ESTABLISHED // ${exp.shortName.toUpperCase()}`;
      }
      if (this.astronautStatusDesc) {
        this.astronautStatusDesc.innerHTML = `🛰️ <strong>${exp.shortName}</strong> telemetry handshake confirmed! Uplinking mission chronicle...`;
      }
    }

    // Cinematic camera focus on the craft and astronaut
    if (station) {
      this.surfaceLookAt.copy(station.position).add(new THREE.Vector3(0, 1.6, 0));
      this.surfaceSpherical.radius = 8.5;
      this.updateCameraOrbit();
    }

    // Open animated Spacecraft Chronicle after 650ms
    setTimeout(() => {
      this.openStoryModal(exp);
    }, 650);
  }

  spawnHistoricCraftAtStation(exp, pos) {
    while (this.historicCraftGroup.children.length > 0) {
      this.historicCraftGroup.remove(this.historicCraftGroup.children[0]);
    }

    let craftModel = null;
    if (exp.id === 'chandrayaan-3' || exp.id === 'chandrayaan') {
      craftModel = createChandrayaanModel();
      craftModel.scale.set(0.9, 0.9, 0.9);
    } else if (exp.id.startsWith('apollo')) {
      craftModel = createApolloLanderModel();
      craftModel.scale.set(1.0, 1.0, 1.0);
    } else if (exp.id === 'curiosity' || exp.id === 'opportunity' || exp.id === 'pathfinder' || exp.id === 'viking-1') {
      craftModel = createCuriosityRoverModel();
      craftModel.scale.set(0.75, 0.75, 0.75);
    } else if (exp.id === 'perseverance') {
      craftModel = createCuriosityRoverModel();
      craftModel.scale.set(0.75, 0.75, 0.75);
      const heli = createIngenuityHelicopterModel();
      heli.scale.set(0.45, 0.45, 0.45);
      heli.position.set(2.8, 0, 0);
      craftModel.add(heli);
    } else if (exp.id === 'change-4') {
      craftModel = createChandrayaanModel();
      craftModel.scale.set(0.85, 0.85, 0.85);
    } else {
      craftModel = createApolloLanderModel();
      craftModel.scale.set(0.9, 0.9, 0.9);
    }

    this.currentCraftModel = craftModel;

    if (craftModel) {
      // Place craft at terrain height so base geometry sits on ground
      const groundY = this.getTerrainHeight(pos.x, pos.z);
      craftModel.position.set(pos.x, groundY + 0.05, pos.z);
      this.historicCraftGroup.add(craftModel);
    }
  }

  renderCarousel() {
    this.carouselTrack.innerHTML = '';
    const expeditions = (this.planetData.expeditions || []).filter(e => {
      if (this.activeFilter === 'all') return true;
      return e.category === this.activeFilter;
    });

    expeditions.forEach(exp => {
      const card = document.createElement('div');
      card.className = `carousel-mission-card ${this.selectedExpedition?.id === exp.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="card-thumb" style="background-image: url('${exp.heroImage}');">
          <span class="card-year">${exp.year}</span>
        </div>
        <div class="card-body">
          <div class="card-badge">${exp.badge}</div>
          <h4 class="card-title">${exp.shortName}</h4>
          <span class="card-site">📍 ${exp.landingSite}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        soundFX.playClick();
        this.selectExpedition(exp, true);
      });

      this.carouselTrack.appendChild(card);
    });
  }

  getSpacecraftStoryChronicle(exp) {
    if (exp.id === 'chandrayaan-3') {
      return {
        craftName: 'Chandrayaan-3: Vikram Lander & Pragyan Rover',
        voiceName: 'Vikram & Pragyan AI Telemetry Log',
        heroImage: exp.heroImage,
        badge: '🧊 FIRST SOFT LANDING AT LUNAR SOUTH POLE',
        agency: '🇮🇳 ISRO (Indian Space Research Organisation)',
        location: 'Shiv Shakti Point (69.373° S, 32.319° E), Moon',
        year: 2023,
        stayDuration: '14 Earth Days (1 Lunar Sol)',
        chapters: [
          {
            index: 1,
            tabIcon: '🏗️',
            tabTitle: 'Built & Engineered',
            voice: 'Greetings, explorer. I am Vikram, accompanied by my 26-kilogram sister rover Pragyan. We were engineered at the U R Rao Satellite Centre in Bengaluru by ISRO. Learning from our predecessor Chandrayaan-2, our engineers redesigned my landing legs to absorb vertical touchdown impacts up to 3 m/s, covered all four vertical faces with solar arrays, and fitted four 800-Newton throttleable liquid bipropellant rocket engines.',
            specs: [
              { label: 'Assembly & Testing', val: 'ISRO U R Rao Satellite Centre, Bengaluru', desc: 'Rigorous lunar simulated drop tests and sensor calibration in artificial regolith craters.' },
              { label: 'Total Launch Mass', val: '1,749 kg (Vikram) + 26 kg (Pragyan)', desc: 'Carried 800 kg of liquid bipropellant (MON-3 and MMH) for precision terminal descent guidance.' },
              { label: 'Landing Gear Rating', val: 'Reinforced up to 3.0 m/s vertical velocity', desc: 'Four articulated aluminum legs with crushable honeycomb shock absorbers and circular footpads.' },
              { label: 'Solar Power Grid', val: '738 Watts multi-junction solar cells', desc: 'Solar panels affixed to all 4 vertical faces to guarantee power regardless of polar sun angle.' }
            ],
            interactiveParts: [
              { name: 'Lander Chassis', key: 'lander-chassis', icon: '🛸' },
              { name: 'Solar Arrays', key: 'solar-panels', icon: '☀️' },
              { name: 'Pragyan Rover', key: 'pragyan-rover', icon: '🤖' },
              { name: '800N Thrusters', key: 'propulsion-thrusters', icon: '🔥' },
              { name: 'Landing Struts', key: 'landing-gear', icon: '🦿' },
              { name: 'Science Payloads', key: 'scientific-payloads', icon: '🔬' }
            ]
          },
          {
            index: 2,
            tabIcon: '🚀',
            tabTitle: 'Launch & Trajectory',
            voice: 'On July 14, 2023, at 14:35 IST, the mighty LVM3-M4 "Bahubali" rocket roared into the skies above Sriharikota. Instead of flying directly, our flight controllers utilized five ingenious Earth-bound slingshot burns to progressively elevate my elliptical orbit. On August 1, Trans-Lunar Injection flung me toward the Moon, and on August 5, my braking burn achieved safe Lunar Orbit Insertion.',
            specs: [
              { label: 'Launch Vehicle', val: 'LVM3-M4 Heavy Lift Rocket ("Bahubali")', desc: 'Indias heaviest 3-stage rocket equipped with twin S200 solid boosters, L110 core, and C25 cryogenic stage.' },
              { label: 'Launch Date & Pad', val: 'July 14, 2023 (14:35 IST) // SDSC SHAR', desc: 'Second Launch Pad at Satish Dhawan Space Centre, Sriharikota barrier island.' },
              { label: 'Slingshot Burns', val: '5 Earth-bound orbital raising maneuvers', desc: 'Energy-efficient trajectory utilizing Earths gravity well to fling the spacecraft toward lunar transfer.' },
              { label: 'Lunar Orbit Insertion', val: 'August 5, 2023 (164 km × 18,074 km orbit)', desc: 'Autonomous retro-firing of onboard liquid propulsion system captured the craft into lunar gravity.' }
            ],
            trajectoryGraphic: true
          },
          {
            index: 3,
            tabIcon: '🛬',
            tabTitle: 'South Pole Touchdown',
            voice: 'On August 23, 2023, the world watched with bated breath during the "15 Minutes of Terror". Beginning from 30 km altitude, my four engines fired through four autonomous descent phases: Rough Braking, Attitude Hold, Fine Braking, and Terminal Vertical Descent. At 18:04 IST, my feet touched down safely at 69.37°S. Prime Minister Narendra Modi declared this landing site "Shiv Shakti Point"!',
            specs: [
              { label: 'Touchdown Time & Date', val: 'August 23, 2023 // 18:04 IST', desc: 'First nation in human history to achieve a soft touchdown in the unexplored Lunar South Pole region.' },
              { label: 'Touchdown Coordinates', val: '69.373° S, 32.319° E', desc: 'Between Manzinus C and Simpelius N craters, designated as Shiv Shakti Point.' },
              { label: 'Terminal Descent Speed', val: '< 1.0 m/s vertical velocity', desc: 'Autonomous laser Doppler velocimeter and hazard detection cameras steered clear of steep boulders.' }
            ],
            descentPhases: [
              { step: '1. Rough Braking', metric: '30 km → 7.4 km alt', desc: 'Horizontal velocity slashed from 1,680 m/s to 358 m/s over 750 seconds.' },
              { step: '2. Attitude Hold', metric: '7.4 km → 6.8 km alt', desc: 'Lander pitches up, optical cameras match crater landmarks with onboard memory maps.' },
              { step: '3. Fine Braking', metric: '6.8 km → 800 m alt', desc: 'Vertical rotation completed; velocity dropped to 60 m/s under throttled engines.' },
              { step: '4. Terminal Touchdown', metric: '800 m → 0 m alt', desc: 'Laser altimeters verify zero boulders beneath footpads; soft touchdown confirmed!' }
            ]
          },
          {
            index: 4,
            tabIcon: '🔬',
            tabTitle: 'Science & Pragyan Rover',
            voice: 'Hours after landing, my side ramp descended and Pragyan rolled her six wheels onto lunar regolith. Firing her LIBS laser pulses, Pragyan made the breakthrough direct detection of elemental Sulfur (S) on the Moon. My ChaSTE thermal probe plunged 10 cm into the soil, discovering an astonishing 60°C temperature drop—from +50°C at the surface down to -10°C just 8 cm below!',
            specs: [
              { label: 'Pragyan Mobility', val: '6-wheel rocker-bogie chassis (1 cm/s speed)', desc: 'Traversed over 100 meters across polar craters while transmitting images back to Vikram.' },
              { label: 'ChaSTE Thermal Probe', val: '10 platinum RTD sensors across 100mm depth', desc: 'Measured the first in-situ thermal conductivity and temperature gradient of polar soil.' },
              { label: 'RAMBHA-LP Sensor', val: 'Langmuir plasma density measurement', desc: 'Discovered sparse lunar near-surface plasma sheath (5 to 30 million electrons/m³).' }
            ],
            elementalChips: [
              { symbol: 'S (16)', name: 'Sulfur', cls: 'sulfur', desc: 'Historic direct discovery by Pragyan LIBS laser!' },
              { symbol: 'Al (13)', name: 'Aluminum', cls: 'aluminum', desc: 'Confirmed by APXS and LIBS' },
              { symbol: 'Ca (20)', name: 'Calcium', cls: 'aluminum', desc: 'Abundant in highland anorthosite' },
              { symbol: 'Fe (26)', name: 'Iron', cls: 'iron', desc: 'Volcanic and impact melt traces' },
              { symbol: 'Ti (22)', name: 'Titanium', cls: 'titanium', desc: 'Polar ilmenite regolith content' }
            ]
          },
          {
            index: 5,
            tabIcon: '❄️',
            tabTitle: 'Eternal Legacy',
            voice: 'We successfully completed 100% of our primary mission tasks during the 14-day lunar daylight. On September 3, I even fired my engines for a historic 40-cm hop test. As the Sun sank below the horizon and the bitter -200°C polar night set in, Pragyan and I entered peaceful sleep. India\'s Lion Capital and ISRO insignia remain permanently pressed into the lunar dust at Shiv Shakti Point.',
            specs: [
              { label: 'Mission Duration', val: '1 Lunar Day (14 Earth Days) Completed', desc: 'Operated continuously until solar angle became insufficient for photovoltaic power.' },
              { label: 'Historic Hop Experiment', val: '40 cm vertical & horizontal displacement', desc: 'Demonstrated future lunar sample-return and human ascent stage reignition capability.' },
              { label: 'Current Status', val: 'Permanent Resting Place at Shiv Shakti Point', desc: 'Hardware intact on the surface, serving as a historic milestone for global space exploration.' }
            ],
            artifacts: exp.artifactsLeft || [
              'Vikram Lander Hardware & Rocket Bells',
              'Pragyan 6-Wheel Rover & Scientific Payloads',
              'Ashoka Pillar Lion Capital & ISRO emblem stamped in lunar regolith',
              'NASA Laser Retroreflector Array (LRA) atop Vikram deck'
            ]
          }
        ]
      };
    }

    // Generic chronicle generator for other expeditions
    const isMars = exp.landingSite && (exp.landingSite.includes('Crater') || exp.landingSite.includes('Planitia'));
    return {
      craftName: exp.name || exp.shortName,
      voiceName: `${exp.shortName} Mission Telemetry Log`,
      heroImage: exp.heroImage,
      badge: exp.badge,
      agency: exp.agency,
      location: exp.landingSite,
      year: exp.year,
      stayDuration: exp.stayDuration || 'Surface Expedition',
      chapters: [
        {
          index: 1,
          tabIcon: '🏗️',
          tabTitle: 'Built & Engineered',
          voice: `Greetings. I am ${exp.shortName}. I was engineered by ${exp.agency} with state-of-the-art spaceflight hardware designed to survive the hostile environment of ${isMars ? 'Mars' : 'the Moon'}. Equipped with ${exp.spacecraft}, my systems were built to push the boundary of cosmic exploration.`,
          specs: [
            { label: 'Operating Agency', val: exp.agency, desc: 'Designed, assembled, and flight-qualified by pioneering aerospace engineers.' },
            { label: 'Spacecraft Architecture', val: exp.spacecraft, desc: 'Advanced propulsion, navigation, and environmental protection systems.' },
            { label: 'Landing Location', val: exp.landingSite, desc: 'Carefully chosen site selected for maximum scientific discovery value.' }
          ],
          interactiveParts: [
            { name: 'Primary Chassis', key: 'chassis', icon: '🛸' },
            { name: 'Power & Solar Bus', key: 'bus', icon: '☀️' },
            { name: 'Science Mast', key: 'mast', icon: '🔭' },
            { name: 'Propulsion Bells', key: 'bell', icon: '🔥' }
          ]
        },
        {
          index: 2,
          tabIcon: '🚀',
          tabTitle: 'Launch & Journey',
          voice: exp.story?.theJourney || `Launched into space in ${exp.year}, carrying instruments across the vacuum of space to reach our destination.`,
          specs: [
            { label: 'Launch Year', val: `${exp.year}`, desc: 'Blasted from Earth on a towering multi-stage rocket.' },
            { label: 'Flight Trajectory', val: 'Trans-Orbital Injection', desc: 'Precision maneuvers navigating gravitational fields to reach target orbit.' }
          ],
          trajectoryGraphic: true
        },
        {
          index: 3,
          tabIcon: '🛬',
          tabTitle: 'The Touchdown',
          voice: exp.story?.theLanding || `Executed precision autonomous entry, descent, and landing onto the alien soil of ${exp.landingSite}.`,
          specs: [
            { label: 'Touchdown Site', val: exp.landingSite, desc: 'Historical coordinates where humanity or our robotic scouts first touched down.' },
            { label: 'Surface Stay', val: exp.stayDuration || 'Active Science Mission', desc: 'Duration spent conducting intensive EVAs and gathering soil specimens.' }
          ],
          descentPhases: [
            { step: '1. Atmospheric Entry / Braking', metric: 'Orbital Insertion', desc: 'Decelerating from hypervelocity to entry corridor.' },
            { step: '2. Radar Terminal Guidance', metric: 'Final Approach', desc: 'Terrain recognition and hazard avoidance.' },
            { step: '3. Touchdown Confirmed', metric: '0 m Altitude', desc: 'Contact light confirmed; alien regolith touched!' }
          ]
        },
        {
          index: 4,
          tabIcon: '🔬',
          tabTitle: 'Science & Discoveries',
          voice: exp.story?.whatTheyDid || 'Conducted extensive in-situ geological, atmospheric, and biological surveys to unlock the secrets of our solar system.',
          specs: [
            { label: 'Sample Analysis', val: exp.sampleMass || 'In-situ Spectrometry', desc: 'Direct compositional and geochemical data gathered on-site.' },
            { label: 'Scientific Impact', val: 'Revolutionized Planetary Science', desc: 'Provided unprecedented insights into cosmic evolution and habitability.' }
          ]
        },
        {
          index: 5,
          tabIcon: '❄️',
          tabTitle: 'Legacy & Artifacts',
          voice: exp.story?.whoWentAndLeft || 'Our mission etched another proud chapter into the history of space exploration, leaving permanent milestones for future explorers.',
          specs: [
            { label: 'Mission Outcome', val: exp.outcome || 'Mission Objectives Fulfilled', desc: 'A triumphant milestone in humanitys journey to the stars.' }
          ],
          artifacts: exp.artifactsLeft || ['Historic Spacecraft Hardware Resting on the Surface']
        }
      ]
    };
  }

  openStoryModal(exp) {
    const chronicle = this.getSpacecraftStoryChronicle(exp);
    this.currentChronicle = chronicle;
    this.activeStoryChapter = 0;

    this.storyDialog.innerHTML = `
      <div class="chronicle-hero" style="background-image: linear-gradient(180deg, rgba(6,11,25,0.4) 0%, rgba(6,11,25,0.95) 100%), url('${chronicle.heroImage}')">
        <button class="story-close-btn" id="story-close-btn" aria-label="Close Chronicles">✕</button>
        <div class="chronicle-top-bar">
          <div class="transmission-live-tag">
            <span class="audio-pulse-bars"><span></span><span></span><span></span><span></span><span></span></span>
            ARCHIVAL TRANSMISSION // LIVE
          </div>
          <span class="story-category-tag">${chronicle.badge}</span>
        </div>
        <h3 class="chronicle-title">${chronicle.craftName}</h3>
        <div class="chronicle-meta-strip">
          <span>🏛️ ${chronicle.agency}</span>
          <span>📅 ${chronicle.year}</span>
          <span>📍 ${chronicle.location}</span>
          ${chronicle.stayDuration ? `<span>⏱️ Stay: ${chronicle.stayDuration}</span>` : ''}
        </div>
      </div>

      <!-- Holographic Voice Box -->
      <div class="chronicle-voice-box" id="chronicle-voice-box">
        <div class="voice-box-header">
          <span>📡 ${chronicle.voiceName}</span>
          <button class="voice-speech-toggle" id="voice-speech-toggle">🔊 Listen Transmission</button>
        </div>
        <p class="voice-text-stream" id="voice-text-stream"></p>
      </div>

      <!-- 5-Chapter Interactive Stepper Ribbon -->
      <div class="chronicle-chapter-nav" id="chronicle-chapter-nav">
        ${chronicle.chapters.map((chap, idx) => `
          <button class="chapter-nav-btn ${idx === 0 ? 'active' : ''}" data-chap="${idx}">
            <span class="chap-idx">${idx + 1}</span>
            <span>${chap.tabIcon} ${chap.tabTitle}</span>
          </button>
        `).join('')}
      </div>

      <!-- Chapter Dynamic Content Area -->
      <div class="chronicle-content-area" id="chronicle-content-area">
        <!-- Rendered dynamically -->
      </div>

      <!-- Footer Navigation Controls -->
      <div class="chronicle-nav-footer">
        <span class="chronicle-step-counter" id="chronicle-step-counter">PHASE 1 OF ${chronicle.chapters.length}</span>
        <div class="chronicle-footer-btns">
          <button class="chronicle-btn secondary" id="chronicle-prev-btn">◀ Previous Phase</button>
          <button class="chronicle-btn secondary" id="chronicle-autoplay-btn">▶ Auto-Play</button>
          <button class="chronicle-btn primary" id="chronicle-next-btn">Next Phase ▶</button>
        </div>
      </div>
    `;

    // Event listeners
    this.storyDialog.querySelector('#story-close-btn').addEventListener('click', () => this.closeStoryModal());

    const navBtns = this.storyDialog.querySelectorAll('.chapter-nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playClick();
        const cIdx = parseInt(btn.dataset.chap, 10);
        this.renderStoryChapter(chronicle, cIdx);
      });
    });

    const prevBtn = this.storyDialog.querySelector('#chronicle-prev-btn');
    const nextBtn = this.storyDialog.querySelector('#chronicle-next-btn');
    const autoBtn = this.storyDialog.querySelector('#chronicle-autoplay-btn');
    const speechBtn = this.storyDialog.querySelector('#voice-speech-toggle');

    prevBtn.addEventListener('click', () => {
      soundFX.playClick();
      if (this.activeStoryChapter > 0) {
        this.renderStoryChapter(chronicle, this.activeStoryChapter - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      soundFX.playClick();
      if (this.activeStoryChapter < chronicle.chapters.length - 1) {
        this.renderStoryChapter(chronicle, this.activeStoryChapter + 1);
      } else {
        this.closeStoryModal();
      }
    });

    autoBtn.addEventListener('click', () => {
      soundFX.playClick();
      this.toggleAutoPlay(chronicle);
    });

    speechBtn.addEventListener('click', () => {
      soundFX.playClick();
      this.toggleVoiceSpeech(chronicle);
    });

    // Render initial chapter
    this.renderStoryChapter(chronicle, 0);
    this.storyModal.classList.add('active');
  }

  renderStoryChapter(chronicle, chapterIdx) {
    this.activeStoryChapter = chapterIdx;
    const chapter = chronicle.chapters[chapterIdx];
    if (!chapter) return;

    // Update chapter tabs active state
    const tabs = this.storyDialog.querySelectorAll('.chapter-nav-btn');
    tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === chapterIdx);
    });

    // Update counter
    const counterEl = this.storyDialog.querySelector('#chronicle-step-counter');
    if (counterEl) {
      counterEl.textContent = `PHASE ${chapterIdx + 1} OF ${chronicle.chapters.length}: ${chapter.tabTitle.toUpperCase()}`;
    }

    const nextBtn = this.storyDialog.querySelector('#chronicle-next-btn');
    if (nextBtn) {
      nextBtn.textContent = chapterIdx === chronicle.chapters.length - 1 ? 'Finish Transmission ✕' : 'Next Phase ▶';
    }

    // Typewriter voice stream
    this.typewriterVoice(chapter.voice);

    // Build Chapter Body Content
    const contentArea = this.storyDialog.querySelector('#chronicle-content-area');
    if (!contentArea) return;

    let bodyHTML = '';

    // Interactive 3D Model Part Inspection Bar
    if (chapter.interactiveParts && chapter.interactiveParts.length > 0) {
      bodyHTML += `
        <div class="chronicle-parts-bar">
          <span class="parts-bar-label">🔍 3D COMPONENT INSPECTOR:</span>
          ${chapter.interactiveParts.map(p => `
            <button class="part-inspect-btn" data-key="${p.key}">
              <span>${p.icon}</span> ${p.name}
            </button>
          `).join('')}
          <button class="part-inspect-btn" data-key="reset" style="color: #94a3b8;">Reset View</button>
        </div>
      `;
    }

    // Specifications Grid Cards
    if (chapter.specs && chapter.specs.length > 0) {
      bodyHTML += `
        <div class="chronicle-card-grid">
          ${chapter.specs.map(s => `
            <div class="chronicle-spec-card">
              <span class="spec-card-label">${s.label}</span>
              <div class="spec-card-val">${s.val}</div>
              <p class="spec-card-desc">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Descent Braking Stages Timeline
    if (chapter.descentPhases && chapter.descentPhases.length > 0) {
      bodyHTML += `
        <div class="story-section">
          <h4 class="section-headline"><span>📉</span> 4 Autonomous Descent & Landing Phases</h4>
          <div class="descent-timeline-grid">
            ${chapter.descentPhases.map(ph => `
              <div class="descent-phase-card">
                <div class="phase-step-title">${ph.step}</div>
                <div class="phase-step-metrics">${ph.metric}</div>
                <p class="spec-card-desc" style="margin-top: 4px;">${ph.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Elemental Discovery Chips
    if (chapter.elementalChips && chapter.elementalChips.length > 0) {
      bodyHTML += `
        <div class="story-section">
          <h4 class="section-headline"><span>🔬</span> Elemental In-Situ Regolith Discoveries</h4>
          <div class="element-chips-row">
            ${chapter.elementalChips.map(el => `
              <div class="element-chip ${el.cls}" title="${el.desc}">
                <span>${el.symbol}</span>
                <span>${el.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Artifacts Checklist
    if (chapter.artifacts && chapter.artifacts.length > 0) {
      bodyHTML += `
        <div class="story-section">
          <h4 class="section-headline"><span>🏺</span> Historical Relics Left on the Surface</h4>
          <ul class="artifacts-checklist">
            ${chapter.artifacts.map(art => `<li><span>✓</span> ${art}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    contentArea.innerHTML = bodyHTML;

    // Attach 3D model part inspection listeners
    const partBtns = contentArea.querySelectorAll('.part-inspect-btn');
    partBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playClick();
        const key = btn.dataset.key;
        partBtns.forEach(b => b.classList.remove('active'));
        if (key === 'reset') {
          highlightPart(this.currentCraftModel, null);
        } else {
          btn.classList.add('active');
          highlightPart(this.currentCraftModel, key);
        }
      });
    });

    // Auto voice if toggle active
    if (this.isSpeakingVoice) {
      this.speakText(chapter.voice);
    }
  }

  typewriterVoice(fullText) {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }
    const streamEl = this.storyDialog.querySelector('#voice-text-stream');
    if (!streamEl) return;

    streamEl.innerHTML = '<span class="voice-cursor"></span>';
    let currentIdx = 0;
    const speed = 18; // ms per char

    const typeNext = () => {
      if (currentIdx < fullText.length) {
        streamEl.textContent = fullText.slice(0, currentIdx + 1);
        const cursor = document.createElement('span');
        cursor.className = 'voice-cursor';
        streamEl.appendChild(cursor);

        if (currentIdx % 7 === 0) {
          soundFX.playHoloTypewriter();
        }

        currentIdx++;
        this.typewriterTimeout = setTimeout(typeNext, speed);
      } else {
        streamEl.textContent = fullText;
      }
    };

    typeNext();
  }

  toggleVoiceSpeech(chronicle) {
    this.isSpeakingVoice = !this.isSpeakingVoice;
    const speechBtn = this.storyDialog.querySelector('#voice-speech-toggle');
    if (speechBtn) {
      speechBtn.classList.toggle('speaking', this.isSpeakingVoice);
      speechBtn.innerHTML = this.isSpeakingVoice ? '⏹️ Stop Voice' : '🔊 Listen Transmission';
    }

    if (this.isSpeakingVoice) {
      const chapter = chronicle.chapters[this.activeStoryChapter];
      if (chapter) {
        this.speakText(chapter.voice);
      }
    } else {
      this.stopSpeech();
    }
  }

  speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[^\w\s.,!?-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      if (this.isAutoPlayingStory && this.activeStoryChapter < this.currentChronicle.chapters.length - 1) {
        setTimeout(() => {
          this.renderStoryChapter(this.currentChronicle, this.activeStoryChapter + 1);
        }, 1200);
      }
    };

    window.speechSynthesis.speak(utterance);
    this.currentUtterance = utterance;
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  toggleAutoPlay(chronicle) {
    this.isAutoPlayingStory = !this.isAutoPlayingStory;
    const autoBtn = this.storyDialog.querySelector('#chronicle-autoplay-btn');
    if (autoBtn) {
      autoBtn.innerHTML = this.isAutoPlayingStory ? '⏸️ Pause Auto-Play' : '▶ Auto-Play';
      autoBtn.style.color = this.isAutoPlayingStory ? '#22c55e' : '';
    }

    if (this.isAutoPlayingStory) {
      if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = setInterval(() => {
        if (this.activeStoryChapter < chronicle.chapters.length - 1) {
          this.renderStoryChapter(chronicle, this.activeStoryChapter + 1);
        } else {
          this.toggleAutoPlay(chronicle);
        }
      }, 9500);
    } else {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }
  }

  closeStoryModal() {
    this.stopSpeech();
    if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.isAutoPlayingStory = false;
    this.isSpeakingVoice = false;

    // Reset part highlighting on current 3D craft
    if (this.currentCraftModel) {
      highlightPart(this.currentCraftModel, null);
    }

    this.storyModal.classList.remove('active');
    soundFX.playClick();
  }

  updateBeaconVisibility() {
    this.beacons.forEach(bg => {
      const exp = bg.userData.expedition;
      const isVis = (this.activeFilter === 'all' || exp.category === this.activeFilter);
      bg.visible = isVis;
      const p = this.labelsMap.get(bg);
      if (p) p.el.style.display = isVis ? 'inline-flex' : 'none';
    });
  }

  // ──────────────────────────────────────────────────
  // 🚀 THE RETURN TO EARTH ASCENT SEQUENCE
  // ──────────────────────────────────────────────────
  launchAscentToEarth() {
    if (this.isReboarding || this.isAscending) return;
    this.isReboarding = true;
    this.reboardTimer = 0;

    this.ascentCurtain.classList.add('active');
    this.overlay.querySelector('#ascent-headline').textContent = 'CREW RE-BOARDING SHIP';
    this.overlay.querySelector('#ascent-subtitle').textContent = 'Astronaut boarding spacecraft cabin... Hatch sealing & ladder retracting';

    const reboardInterval = setInterval(() => {
      this.reboardTimer += 0.05;
      const rt = this.reboardTimer;

      if (rt < 1.4 && this.astronaut) {
        // Walk back to ladder base
        const backP = Math.max(0, 1.0 - rt / 1.4);
        this.astronaut.group.position.set(backP * 2.4, 0.0, 0.55 + backP * 2.1);
        this.astronaut.group.rotation.y = -Math.PI * 0.75;
        this.astronaut.animateLowGravityWalk(rt, 4.5);
      } else if (rt < 2.6 && this.astronaut) {
        // Climb ladder up to hatch
        const climbUpP = (rt - 1.4) / 1.2;
        this.astronaut.group.position.set(0, climbUpP * 3.2, 0.55);
        this.astronaut.group.rotation.y = 0;
        this.astronaut.animateClimb(rt, 4.5);
      } else if (rt >= 2.6 && rt < 3.0) {
        // Enters hatch, seal hatch & retract ladder
        if (this.astronaut) this.astronaut.group.visible = false;
        if (this.spacecraftCore) {
          this.spacecraftCore.setHatchOpen(false);
          this.spacecraftCore.setLadderVisible(false);
        }
      } else if (rt >= 3.0) {
        clearInterval(reboardInterval);
        this.startSurfaceLiftoff();
      }
    }, 50);
  }

  startSurfaceLiftoff() {
    this.isAscending = true;
    soundFX.playRocketLaunch();

    this.overlay.querySelector('#ascent-headline').textContent = 'SURFACE ASCENT ENGINES IGNITED';
    this.overlay.querySelector('#ascent-subtitle').textContent = `Lifting off from ${this.currentPlanetId === 'moon' ? 'the Moon' : 'Mars'}... Accelerating to Trans-Earth Injection!`;

    if (this.ascentPlume) this.ascentPlume.visible = true;
    if (this.ascentDustBlast) this.ascentDustBlast.material.opacity = 0.9;

    // Capture the planet position NOW before exit() shows it and it moves
    const fromId = this.currentPlanetId;

    let ascentY = 1.25;
    // Clear any previous interval
    if (this._liftoffInterval) clearInterval(this._liftoffInterval);
    this._liftoffInterval = setInterval(() => {
      ascentY += 0.35;
      if (this.landedRocket) {
        this.landedRocket.position.y = ascentY;
      }
      // Slowly spin rocket upward for drama
      if (this.landedRocket && ascentY > 8) {
        this.landedRocket.rotation.y += 0.01;
      }
      if (this.ascentDustBlast && ascentY < 5) {
        this.ascentDustBlast.scale.multiplyScalar(1.025);
      }

      if (ascentY > 32) {
        clearInterval(this._liftoffInterval);
        this._liftoffInterval = null;
        this.completeSurfaceAscent(fromId);
      }
    }, 30);
  }

  completeSurfaceAscent(fromId) {
    // Snapshot positions of solar system bodies BEFORE exit() hides/shows them
    // to avoid position glitch on second visit
    const solarScene = this.solarScene;

    // Force solar bodies back visible so getWorldPosition works correctly
    Object.values(solarScene.celestialBodies).forEach(b => {
      if (b.mesh) b.mesh.visible = true;
    });

    // Capture departure planet world position NOW
    let fromPos = null;
    if (fromId === 'moon' && solarScene.celestialBodies['earth']?.moonMesh) {
      fromPos = new THREE.Vector3();
      solarScene.celestialBodies['earth'].moonMesh.getWorldPosition(fromPos);
    } else if (solarScene.celestialBodies[fromId]?.mesh) {
      fromPos = new THREE.Vector3();
      solarScene.celestialBodies[fromId].mesh.getWorldPosition(fromPos);
    }

    this.exit();
    this.ascentCurtain.classList.remove('active');

    // Trigger homeward return flight — pass captured positions to avoid glitch
    solarScene.launchMission('earth', fromId, fromPos);
  }

  // ──────────────────────────────────────────────────
  // UPDATE LOOP FOR SURFACE ENVIRONMENT & ASTRONAUT
  // ──────────────────────────────────────────────────
  update(camera, delta) {
    if (!this.isActive) return;

    // Strobe beacon flash on landed ship
    if (this.strobeLight) {
      const flash = Math.sin(Date.now() * 0.012) > 0.85;
      this.strobeLight.visible = flash;
    }

    // ────────────────────────────────────────────────
    // ASTRONAUT POST-LANDING DISEMBARKATION ANIMATION
    // ────────────────────────────────────────────────
    if (this.isDisembarking && this.astronaut) {
      this.disembarkTimer += delta;
      const tDis = this.disembarkTimer;

      // Phase 1 (0s - 3.2s): Climbing down ladder from hatch (3.2) to surface (0.0)
      if (tDis < 3.2) {
        const climbP = tDis / 3.2;
        this.astronaut.group.position.set(0, 3.2 * (1.0 - climbP), 0.55);
        this.astronaut.group.rotation.set(0, 0, 0);
        this.astronaut.animateClimb(tDis, 4.0);

        if (this.astronautStatusDesc) {
          this.astronautStatusDesc.textContent = `Astronaut climbing down ladder to ${this.currentPlanetId === 'moon' ? 'lunar regolith' : 'Martian sand'}...`;
        }
      }
      // Phase 2 (3.2s - 5.5s): Stepping off ladder onto the soil
      else if (tDis < 5.5) {
        const walkP = (tDis - 3.2) / 2.3;
        const walkX = walkP * 2.4;
        const walkZ = 0.52 + walkP * 2.1;
        this.astronaut.group.position.set(walkX, 0.0, walkZ);
        // Face direction of travel
        this.astronaut.group.rotation.y = Math.atan2(2.4, 2.1);
        this.astronaut.animateLowGravityWalk(tDis, 3.8);

        if (this.astronautStatusDesc) {
          this.astronautStatusDesc.textContent = `One small step: Astronaut walking across ${this.currentPlanetId === 'moon' ? 'lunar ground' : 'Martian dunes'}!`;
        }
      }
      // Phase 3 (5.5s - 9.5s): Pausing and giving a crisp astronaut salute
      else if (tDis < 9.5) {
        this.astronaut.group.position.set(2.4, 0.0, 2.62);
        this.astronaut.group.rotation.y = -0.35; // Face camera
        this.astronaut.poseSalute();

        if (this.astronautStatusDesc) {
          this.astronautStatusDesc.textContent = `👨‍🚀 "ONE GIANT LEAP FOR MANKIND": ASTRONAUT SALUTES EXPEDITION SUCCESS!`;
        }
      }
      // Phase 4 (> 9.5s): Transition to idle pose near flag
      else {
        this.isDisembarking = false;
        this.astronaut.poseIdle();
        if (this.astronautBanner) {
          setTimeout(() => {
            if (this.astronautBanner) this.astronautBanner.style.opacity = '0';
          }, 3500);
        }
      }
    }

    // ────────────────────────────────────────────────
    // ASTRONAUT SURFACE TRAVERSAL TO HISTORIC CRAFT
    // ────────────────────────────────────────────────
    if (this.isWalkingToCraft && this.astronaut) {
      this.walkElapsed += delta;
      const progress = Math.min(1.0, this.walkElapsed / this.walkDuration);
      const smoothP = progress * progress * (3 - 2 * progress);
      // Lerp XZ then snap Y to terrain to prevent underground clipping
      const lerpedX = this.walkStartPos.x + (this.walkTargetPos.x - this.walkStartPos.x) * smoothP;
      const lerpedZ = this.walkStartPos.z + (this.walkTargetPos.z - this.walkStartPos.z) * smoothP;
      const terrainY = this.getTerrainHeight(lerpedX, lerpedZ) + 0.05;
      this.astronaut.group.position.set(lerpedX, terrainY, lerpedZ);

      // Dynamically face the walk direction
      const dx = this.walkTargetPos.x - this.walkStartPos.x;
      const dz = this.walkTargetPos.z - this.walkStartPos.z;
      this.astronaut.group.rotation.y = Math.atan2(dx, dz);

      // Use low-gravity EVA walk for surface traversal
      this.astronaut.animateLowGravityWalk(this.walkElapsed, 4.5);

      // Camera smoothly tracks astronaut towards target
      this.surfaceLookAt.lerp(new THREE.Vector3(lerpedX, 1.8, lerpedZ), delta * 2.8);
      this.updateCameraOrbit();

      if (progress >= 1.0) {
        this.finishAstronautWalk();
      }
    }

    // Pulse radar rings
    this.beacons.forEach(bg => {
      const ring = bg.userData.ring;
      if (ring) {
        const s = 1.0 + Math.sin(Date.now() * 0.006 + bg.id) * 0.18;
        ring.scale.set(s, s, s);
      }
    });

    // Drifting dust particles on Mars
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i) + delta * 2.0;
        if (x > 45) x = -45;
        pos.setX(i, x);
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Flag cloth ripple wave
    if (this.flagMesh) {
      const pos = this.flagMesh.geometry.attributes.position;
      const time = Date.now() * 0.005;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const wave = Math.sin(vx * 3.5 + time) * 0.08 * (vx / 1.45);
        pos.setZ(i, wave);
      }
      this.flagMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Slow rotation of Earth in Moon sky
    if (this.earthInSky) {
      this.earthInSky.rotation.y += 0.0012;
    }

    // Project 3D ground station positions to 2D screen pins
    const tempVec = new THREE.Vector3();
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.labelsMap.forEach((data, obj) => {
      if (!obj.visible) return;
      obj.getWorldPosition(tempVec);
      tempVec.y += (data.yOffset || 2.5);
      tempVec.project(camera);

      if (tempVec.z > 1.0) {
        data.el.style.display = 'none';
      } else {
        data.el.style.display = 'inline-flex';
        const sx = (tempVec.x * 0.5 + 0.5) * width;
        const sy = (-tempVec.y * 0.5 + 0.5) * height;
        data.el.style.transform = `translate(-50%, -100%) translate(${sx}px, ${sy}px)`;
      }
    });
  }

  exit() {
    this.isActive = false;
    this.overlay.style.display = 'none';
    this.surfaceGroup.visible = false;
    this.closeStoryModal();

    this.scene.fog = null;

    if (this.solarScene.sun) this.solarScene.sun.visible = true;
    if (this.solarScene.orbitLines) this.solarScene.orbitLines.forEach(l => l.visible = true);
    if (this.solarScene.asteroidBelt) this.solarScene.asteroidBelt.visible = true;
    if (this.solarScene.labelsContainer) this.solarScene.labelsContainer.style.display = 'block';
    Object.values(this.solarScene.celestialBodies).forEach(b => {
      if (b.mesh) b.mesh.visible = true;
    });

    if (this.onExitToGalaxy) {
      this.onExitToGalaxy();
    }
  }
}

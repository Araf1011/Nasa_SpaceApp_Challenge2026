/**
 * 3D Solar System & Deep Space Milky Way Galaxy Visualizer
 * Powered by Three.js
 */

import * as THREE from 'three';
import { 
  createEarthTexture, 
  createEarthCloudsTexture, 
  createMarsTexture, 
  createMoonTexture, 
  createJupiterTexture, 
  createSaturnTexture, 
  createSaturnRingsTexture, 
  createSunTexture 
} from '../utils/textureGenerator.js';
import { createRelicModel } from './Craft3DModels.js';

export class SolarSystemScene {
  constructor(containerElement, onSelectRelicCallback) {
    this.container = containerElement;
    this.onSelectRelic = onSelectRelicCallback;
    this.relics = [];
    this.relicObjects = [];
    this.celestialBodies = {};
    this.orbitLines = [];
    this.labelsMap = new Map();
    this.showLabels = true;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isOrbiting = true;
    this.timeScale = 1.0;
    this.elapsedTime = 0;

    // Camera tweening state
    this.targetCameraPos = null;
    this.targetLookAt = null;
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.startCameraPos = new THREE.Vector3();
    this.startLookAt = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3(0, 0, 0);

    // Initial cinematic camera framing
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.spherical = {
      radius: 175,
      theta: 0.85,
      phi: 1.15
    };

    this.initScene();
    this.initMilkyWayGalaxy();
    this.initSun();
    this.initPlanets();
    this.initAsteroidBelt();
    this.initLabelsOverlay();
    this.initEventListeners();
    this.animate = this.animate.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    // Clear deep space background without murky fog
    this.scene.fog = null;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 6000);
    this.updateCameraFromSpherical();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;

    this.container.appendChild(this.renderer.domElement);

    // Natural Space Lighting
    // Ambient cosmic fill so dark sides of planets remain naturally visible
    this.ambientLight = new THREE.AmbientLight(0x5577aa, 2.0);
    this.scene.add(this.ambientLight);

    // Soft celestial rim light
    this.rimLight = new THREE.DirectionalLight(0xa0c4ff, 1.2);
    this.rimLight.position.set(100, 200, 150);
    this.scene.add(this.rimLight);

    // Brilliant Solar Point Light from center
    this.sunLight = new THREE.PointLight(0xfff8ee, 6.0, 1500, 0.35);
    this.scene.add(this.sunLight);
  }

  updateCameraFromSpherical() {
    this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
    this.spherical.radius = Math.max(15, Math.min(800, this.spherical.radius));

    const x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    const y = this.spherical.radius * Math.cos(this.spherical.phi);
    const z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);

    this.camera.position.set(
      this.currentLookAt.x + x,
      this.currentLookAt.y + y,
      this.currentLookAt.z + z
    );
    this.camera.lookAt(this.currentLookAt);
  }

  /**
   * Breathtaking Natural Milky Way Galaxy & Deep Cosmic Starfield
   */
  initMilkyWayGalaxy() {
    // 1. Deep Space Starfield (Background Stars)
    const starCount = 5000;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const starColors = [
      new THREE.Color(0xffffff), // Pure white
      new THREE.Color(0xbfdbfe), // Blue O/B stars
      new THREE.Color(0xfef08a), // Yellow G stars
      new THREE.Color(0xfed7aa), // Orange K stars
      new THREE.Color(0xfca5a5)  // Red M stars
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 1800 + Math.random() * 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const c = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    this.stars = new THREE.Points(geom, starMat);
    this.scene.add(this.stars);

    // 2. The Majestic Milky Way Galactic Dust Band (Dense inclined cosmic plane)
    const mwStarCount = 8500;
    const mwGeom = new THREE.BufferGeometry();
    const mwPos = new Float32Array(mwStarCount * 3);
    const mwColors = new Float32Array(mwStarCount * 3);

    const mwPalette = [
      new THREE.Color(0xffe8d6), // Warm stellar dust
      new THREE.Color(0xd8b4fe), // Deep purple interstellar hydrogen
      new THREE.Color(0x818cf8), // Cosmic violet
      new THREE.Color(0x38bdf8), // Luminous cyan gas
      new THREE.Color(0xffedd5)  // Core yellow star cluster
    ];

    for (let i = 0; i < mwStarCount; i++) {
      const r = 1600 + Math.random() * 1200;
      // Distribute along an inclined galactic plane (tilted ~55 degrees)
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * (Math.random() - 0.5) * 500; // Dense in center, tapering outwards

      // Elliptical distribution along tilted axis
      const gx = Math.cos(angle) * r;
      const gz = Math.sin(angle) * r;
      const gy = (gx * 0.45 + gz * 0.35) + spread;

      mwPos[i * 3] = gx;
      mwPos[i * 3 + 1] = gy;
      mwPos[i * 3 + 2] = gz;

      const c = mwPalette[Math.floor(Math.random() * mwPalette.length)];
      mwColors[i * 3] = c.r;
      mwColors[i * 3 + 1] = c.g;
      mwColors[i * 3 + 2] = c.b;
    }

    mwGeom.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
    mwGeom.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));

    const mwMat = new THREE.PointsMaterial({
      size: 3.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.milkyWay = new THREE.Points(mwGeom, mwMat);
    this.scene.add(this.milkyWay);
  }

  initSun() {
    // Sun Sphere with Realistic Corona Flare Texture
    const sunTexture = createSunTexture();
    const sunGeom = new THREE.SphereGeometry(10.5, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture
    });
    this.sun = new THREE.Mesh(sunGeom, sunMat);
    this.scene.add(this.sun);

    // Glowing Inner Corona Layer
    const coronaGeom = new THREE.SphereGeometry(12.2, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.38,
      side: THREE.BackSide
    });
    this.sun.add(new THREE.Mesh(coronaGeom, coronaMat));

    // Outer Solar Atmosphere Flare
    const outerHaloGeom = new THREE.SphereGeometry(15.5, 32, 32);
    const outerHaloMat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    this.sun.add(new THREE.Mesh(outerHaloGeom, outerHaloMat));
  }

  initPlanets() {
    // High-resolution procedural textures
    const earthMap = createEarthTexture();
    const earthCloudsMap = createEarthCloudsTexture();
    const marsMap = createMarsTexture();
    const moonMap = createMoonTexture();
    const jupiterMap = createJupiterTexture();
    const saturnMap = createSaturnTexture();
    const saturnRingsMap = createSaturnRingsTexture();

    // Natural, clearly visible sizes and orbits
    this.planetConfigs = [
      { name: 'mercury', label: 'Mercury', icon: '⚪', color: 0xb0bec5, size: 2.2, orbitRadius: 26, speed: 0.04 },
      { name: 'venus', label: 'Venus', icon: '🟡', color: 0xf6d8ae, size: 3.6, orbitRadius: 40, speed: 0.026 },
      { name: 'earth', label: 'Earth', icon: '🌍', map: earthMap, size: 4.6, orbitRadius: 58, speed: 0.018, isEarth: true },
      { name: 'mars', label: 'Mars', icon: '🔴', map: marsMap, size: 3.4, orbitRadius: 78, speed: 0.013, isMars: true },
      { name: 'jupiter', label: 'Jupiter', icon: '🪐', map: jupiterMap, size: 8.8, orbitRadius: 135, speed: 0.007 },
      { name: 'saturn', label: 'Saturn', icon: '🪐', map: saturnMap, size: 7.2, orbitRadius: 176, speed: 0.005, hasRings: true, ringsMap: saturnRingsMap },
      { name: 'uranus', label: 'Uranus', icon: '🔵', color: 0x70d6ff, size: 4.8, orbitRadius: 220, speed: 0.003 },
      { name: 'neptune', label: 'Neptune', icon: '🌊', color: 0x3a86ff, size: 4.5, orbitRadius: 260, speed: 0.002 }
    ];

    this.planetConfigs.forEach(cfg => {
      // Sleek Orbit Track Ring (Subtle cyan line)
      const orbitCurve = new THREE.EllipseCurve(0, 0, cfg.orbitRadius, cfg.orbitRadius, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(160);
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.2
      });
      const orbitLine = new THREE.Line(orbitGeom, orbitMat);
      orbitLine.rotation.x = Math.PI / 2;
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      // Pivot
      const pivot = new THREE.Group();
      this.scene.add(pivot);

      // Planet Mesh with Realistic Texture or Material
      const geom = new THREE.SphereGeometry(cfg.size, 36, 36);
      let mat;
      if (cfg.map) {
        mat = new THREE.MeshStandardMaterial({
          map: cfg.map,
          roughness: 0.55,
          metalness: 0.15
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.6,
          metalness: 0.15
        });
      }

      const planetMesh = new THREE.Mesh(geom, mat);
      planetMesh.position.x = cfg.orbitRadius;
      pivot.add(planetMesh);

      // Earth Cloud Layer & Atmospheric Glow
      let cloudsMesh = null;
      if (cfg.isEarth) {
        const cloudGeom = new THREE.SphereGeometry(cfg.size * 1.025, 36, 36);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: earthCloudsMap,
          transparent: true,
          opacity: 0.85
        });
        cloudsMesh = new THREE.Mesh(cloudGeom, cloudMat);
        planetMesh.add(cloudsMesh);

        // Luminous Atmospheric Blue Halo
        const atmoGeom = new THREE.SphereGeometry(cfg.size * 1.15, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x00e5ff,
          transparent: true,
          opacity: 0.22,
          side: THREE.BackSide
        });
        planetMesh.add(new THREE.Mesh(atmoGeom, atmoMat));
      }

      // Saturn Rings
      if (cfg.hasRings && cfg.ringsMap) {
        const ringGeom = new THREE.RingGeometry(cfg.size * 1.35, cfg.size * 2.6, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          map: cfg.ringsMap,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2.3;
        planetMesh.add(ring);
      }

      // Earth's Moon
      let moonMesh = null;
      let moonPivot = null;
      if (cfg.isEarth) {
        moonPivot = new THREE.Group();
        planetMesh.add(moonPivot);

        const moonGeom = new THREE.SphereGeometry(1.6, 28, 28);
        const moonMat = new THREE.MeshStandardMaterial({
          map: moonMap,
          roughness: 0.8
        });
        moonMesh = new THREE.Mesh(moonGeom, moonMat);
        moonMesh.position.x = 9.0;
        moonPivot.add(moonMesh);

        // Moon Orbit circle
        const moonOrbit = new THREE.EllipseCurve(0, 0, 9.0, 9.0, 0, 2 * Math.PI, false, 0);
        const mPts = moonOrbit.getPoints(60);
        const mGeom = new THREE.BufferGeometry().setFromPoints(mPts);
        const mLine = new THREE.Line(mGeom, new THREE.LineBasicMaterial({ color: 0x475569, opacity: 0.35, transparent: true }));
        mLine.rotation.x = Math.PI / 2;
        planetMesh.add(mLine);
      }

      this.celestialBodies[cfg.name] = {
        config: cfg,
        pivot: pivot,
        mesh: planetMesh,
        cloudsMesh: cloudsMesh,
        moonMesh: moonMesh,
        moonPivot: moonPivot,
        currentAngle: Math.random() * Math.PI * 2
      };
    });
  }

  initAsteroidBelt() {
    const asteroidCount = 950;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(asteroidCount * 3);

    for (let i = 0; i < asteroidCount; i++) {
      const radius = 104 + (Math.random() - 0.5) * 16;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 5.0;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = yOffset;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.5,
      transparent: true,
      opacity: 0.75
    });

    this.asteroidBelt = new THREE.Points(geom, mat);
    this.scene.add(this.asteroidBelt);
  }

  initLabelsOverlay() {
    this.labelsContainer = document.createElement('div');
    this.labelsContainer.id = 'floating-labels-overlay';
    this.labelsContainer.className = 'floating-labels-overlay';
    this.container.appendChild(this.labelsContainer);
  }

  setRelics(relicsData) {
    this.relics = relicsData;
    this.relicObjects.forEach(obj => {
      if (obj.parent) obj.parent.remove(obj);
    });
    this.relicObjects = [];
    this.labelsMap.clear();
    this.labelsContainer.innerHTML = '';

    // Create 3D Hardware Beacons with real 3D models!
    this.relics.forEach(relic => {
      const markerGroup = new THREE.Group();
      markerGroup.userData = { relic: relic };

      // Mini 3D Spacecraft Model
      const miniModel = createRelicModel(relic.modelType);
      miniModel.scale.set(0.65, 0.65, 0.65);
      markerGroup.add(miniModel);
      markerGroup.userData.model = miniModel;

      // Pulsing radar ring
      const ringGeom = new THREE.RingGeometry(2.2, 2.7, 24);
      let ringColor = 0x00f0ff;
      if (relic.category === 'moon') ringColor = 0xffd166;
      if (relic.category === 'mars') ringColor = 0xff3366;
      if (relic.category === 'sun-asteroids') ringColor = 0xffb703;

      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      markerGroup.add(ringMesh);
      markerGroup.userData.ring = ringMesh;

      // Vertical beacon ray
      const rayGeom = new THREE.CylinderGeometry(0.05, 0.05, 6, 6);
      const ray = new THREE.Mesh(rayGeom, new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.5
      }));
      ray.position.y = 3;
      markerGroup.add(ray);

      this.positionRelicMarker(markerGroup, relic);
      this.relicObjects.push(markerGroup);

      // Create Floating 3D/2D Screen Label Pin
      this.createPinForObject(markerGroup, relic.shortName || relic.name, relic.category, relic);
    });

    // Also add pins for Earth, Mars, Jupiter, and Saturn
    if (this.celestialBodies['earth']) {
      this.createPinForObject(this.celestialBodies['earth'].mesh, 'Earth', 'planet-pin');
    }
    if (this.celestialBodies['mars']) {
      this.createPinForObject(this.celestialBodies['mars'].mesh, 'Mars', 'planet-pin');
    }
    if (this.celestialBodies['jupiter']) {
      this.createPinForObject(this.celestialBodies['jupiter'].mesh, 'Jupiter', 'planet-pin');
    }
    if (this.celestialBodies['saturn']) {
      this.createPinForObject(this.celestialBodies['saturn'].mesh, 'Saturn', 'planet-pin');
    }
  }

  createPinForObject(mesh, title, categoryClass, relicData = null) {
    const pin = document.createElement('div');
    pin.className = `celestial-pin ${categoryClass}`;
    pin.innerHTML = `
      <span class="pin-dot"></span>
      <span class="pin-text">${title}</span>
    `;

    pin.addEventListener('click', () => {
      if (relicData && this.onSelectRelic) {
        this.flyToRelic(relicData.id);
        this.onSelectRelic(relicData);
      } else {
        // Fly to planet
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        this.startCameraPos.copy(this.camera.position);
        this.startLookAt.copy(this.currentLookAt);
        this.targetLookAt = worldPos.clone();
        this.targetCameraPos = worldPos.clone().add(new THREE.Vector3(18, 12, 20));
        this.isTransitioning = true;
        this.transitionProgress = 0;
      }
    });

    this.labelsContainer.appendChild(pin);
    this.labelsMap.set(mesh, { el: pin, yOffset: relicData ? 3.5 : 5.5 });
  }

  positionRelicMarker(markerGroup, relic) {
    if (relic.category === 'moon') {
      const earth = this.celestialBodies['earth'];
      if (earth && earth.moonMesh) {
        let offset = new THREE.Vector3(0, 2.0, 0);
        if (relic.id === 'apollo-11-lrrr') offset = new THREE.Vector3(0.6, 1.2, 0.4);
        markerGroup.position.copy(offset);
        earth.moonMesh.add(markerGroup);
        return;
      }
    }

    if (relic.category === 'mars') {
      const mars = this.celestialBodies['mars'];
      if (mars) {
        let offset = new THREE.Vector3(0, 3.8, 0);
        if (relic.id === 'curiosity-msl') offset = new THREE.Vector3(-2.2, 2.0, 1.2);
        if (relic.id === 'perseverance-ingenuity') offset = new THREE.Vector3(2.4, 2.1, 0.8);
        markerGroup.position.copy(offset);
        mars.mesh.add(markerGroup);
        return;
      }
    }

    if (relic.id === 'jwst-telescope') {
      const earth = this.celestialBodies['earth'];
      if (earth) {
        markerGroup.position.set(12.5, 0.5, 0);
        earth.mesh.add(markerGroup);
        return;
      }
    }

    if (relic.id === 'parker-solar-probe') {
      markerGroup.position.set(16, 2, 10);
      this.scene.add(markerGroup);
      return;
    }

    if (relic.id === 'voyager-1') {
      markerGroup.position.set(220, 140, 210);
      this.scene.add(markerGroup);
      return;
    }

    markerGroup.position.set(70, 5, 70);
    this.scene.add(markerGroup);
  }

  flyToRelic(relicId) {
    const targetObj = this.relicObjects.find(obj => obj.userData.relic.id === relicId);
    if (!targetObj) return;

    const worldPos = new THREE.Vector3();
    targetObj.getWorldPosition(worldPos);

    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    // Category-aware camera framing
    const relic = targetObj.userData.relic;
    let offset;

    if (relic.category === 'deep-space') {
      // Deep space probes (Voyager, Pioneer, etc.) — much further away
      offset = new THREE.Vector3(45, 28, 52);
    } else if (relic.category === 'mars') {
      // Mars surface hardware — close-up on Mars
      offset = new THREE.Vector3(8, 5, 10);
    } else if (relic.category === 'moon') {
      // Lunar surface hardware — close-up on Moon
      offset = new THREE.Vector3(6, 4, 8);
    } else if (relic.category === 'lagrange') {
      // Telescope at Lagrange point (JWST)
      offset = new THREE.Vector3(20, 12, 22);
    } else if (relic.category === 'sun-asteroids') {
      // Near-sun probes
      offset = new THREE.Vector3(14, 8, 16);
    } else {
      offset = new THREE.Vector3(18, 11, 20);
    }

    this.targetLookAt = worldPos.clone();
    this.targetCameraPos = worldPos.clone().add(offset);

    this.isTransitioning = true;
    this.transitionProgress = 0;
    // Speed up transition for deep space (longer distance)
    this._transitionSpeed = relic.category === 'deep-space' ? 0.018 : 0.025;
  }

  resetOverview() {
    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.spherical.radius = 175;
    this.spherical.theta = 0.85;
    this.spherical.phi = 1.15;

    const x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    const y = this.spherical.radius * Math.cos(this.spherical.phi);
    const z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);

    this.targetCameraPos = new THREE.Vector3(x, y, z);
    this.isTransitioning = true;
    this.transitionProgress = 0;
  }

  initEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging && !this.isTransitioning) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.spherical.theta -= deltaX * 0.005;
        this.spherical.phi -= deltaY * 0.005;
        this.updateCameraFromSpherical();
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!this.isTransitioning) {
        this.spherical.radius += e.deltaY * 0.18;
        this.updateCameraFromSpherical();
      }
    }, { passive: false });

    // Touch support
    let touchStartDist = 0;
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    });

    this.container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging && !this.isTransitioning) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        this.spherical.theta -= deltaX * 0.006;
        this.spherical.phi -= deltaY * 0.006;
        this.updateCameraFromSpherical();
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && !this.isTransitioning) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        this.spherical.radius += (touchStartDist - dist) * 0.3;
        this.updateCameraFromSpherical();
        touchStartDist = dist;
      }
    });

    this.container.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // 3D Object Raycast Clicks
    this.container.addEventListener('click', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const interactiveMeshes = [];

      this.relicObjects.forEach(group => {
        group.traverse(child => {
          if (child.isMesh) {
            child.userData.parentRelicGroup = group;
            interactiveMeshes.push(child);
          }
        });
      });

      const intersects = this.raycaster.intersectObjects(interactiveMeshes, false);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const relicGroup = hit.object.userData.parentRelicGroup;
        if (relicGroup && relicGroup.userData.relic) {
          const relic = relicGroup.userData.relic;
          if (this.onSelectRelic) {
            this.flyToRelic(relic.id);
            this.onSelectRelic(relic);
          }
        }
      }
    });
  }

  onWindowResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.elapsedTime += 0.016;

    // 1. Planetary Orbits & Axial Rotations
    if (this.isOrbiting) {
      Object.values(this.celestialBodies).forEach(body => {
        body.currentAngle += body.config.speed * 0.2 * this.timeScale;
        body.mesh.position.x = Math.cos(body.currentAngle) * body.config.orbitRadius;
        body.mesh.position.z = Math.sin(body.currentAngle) * body.config.orbitRadius;
        body.mesh.rotation.y += 0.015;

        if (body.cloudsMesh) {
          body.cloudsMesh.rotation.y += 0.005;
        }

        if (body.moonPivot) {
          body.moonPivot.rotation.y += 0.04 * this.timeScale;
        }
      });

      if (this.asteroidBelt) {
        this.asteroidBelt.rotation.y += 0.0003 * this.timeScale;
      }
    }

    // 2. Spacecraft Radar Pulse and Rotation
    this.relicObjects.forEach(group => {
      const ring = group.userData.ring;
      if (ring) {
        const scale = 1 + 0.25 * Math.sin(this.elapsedTime * 4 + group.id);
        ring.scale.set(scale, scale, scale);
      }
      const model = group.userData.model;
      if (model) {
        model.rotation.y += 0.003;  // Slower, more realistic rotation
      }
    });

    // 3. Update Floating Name Pin Projections (3D to 2D Screen Space)
    if (this.labelsContainer && this.showLabels) {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      const tempVec = new THREE.Vector3();

      this.labelsMap.forEach((data, mesh) => {
        mesh.getWorldPosition(tempVec);
        tempVec.y += data.yOffset; // Float slightly above the body
        tempVec.project(this.camera);

        // Hide if behind camera or outside clip space
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

    // 4. Smooth Camera Tweening
    if (this.isTransitioning && this.targetCameraPos && this.targetLookAt) {
      const speed = this._transitionSpeed || 0.025;
      this.transitionProgress += speed;
      const t = Math.min(1.0, this.transitionProgress);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.lerpVectors(this.startCameraPos, this.targetCameraPos, ease);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetLookAt, ease);
      this.camera.lookAt(this.currentLookAt);

      if (t >= 1.0) {
        this.isTransitioning = false;
        this._transitionSpeed = 0.025;
        const offset = this.camera.position.clone().sub(this.currentLookAt);
        this.spherical.radius = offset.length();
        this.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / this.spherical.radius)));
        this.spherical.theta = Math.atan2(offset.x, offset.z);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

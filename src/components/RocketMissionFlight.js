/**
 * RocketMissionFlight Component (Realistic 3D Modern Spacecraft Edition)
 * - Uses shared ModernCoreSpacecraft to guarantee 100% visual consistency with surface explorer
 * - Pre-Launch Launchpad Facility & Detailed Astronaut Boarding Animation on Earth
 * - Outward Flight: Triple-core liftoff with Korolev Cross twin booster separation at staging
 * - Return Flight: SUSTAINER CORE CRAFT ONLY (NO boosters, NO separation on return journey)
 * - Earth Atmospheric Re-entry: Fiery plasma sheath & terminal retro-landing at spaceport
 */

import * as THREE from 'three';
import { soundFX } from './AudioEffects.js';
import { AstronautCharacter } from './AstronautModel.js';
import { ModernCoreSpacecraft } from './ModernRocketModel.js';

export class RocketMissionFlight {
  constructor(scene, camera, controls, onComplete) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.onComplete = onComplete;

    this.isActive = false;
    this.isPreLaunch = false;
    this.isReturnFlight = false;
    this.preLaunchDuration = 5.2; // seconds for boarding sequence
    this.preLaunchTimer = 0;
    this.flightDuration = 9.0; // seconds for interplanetary cruise & landing
    this.elapsedTime = 0;
    this.progress = 0;

    this.targetPlanetId = null;
    this.fromPlanetId = 'earth';

    // 3D Objects
    this.rocketGroup = null;
    this.spacecraftCore = null;
    this.coreStage = null;
    this.leftBooster = null;
    this.rightBooster = null;
    this.boostersSeparated = false;
    this.strobeLight = null;

    // Launchpad & Boarding
    this.launchpadGroup = null;
    this.crewArm = null;
    this.boardingAstronaut = null;
    this.ignitionPlayed = false;

    // Plumes & FX
    this.corePlume = null;
    this.leftPlume = null;
    this.rightPlume = null;
    this.plasmaShield = null;
    this.exhaustParticles = null;
    this.groundDustBlast = null;

    // Trajectory
    this.trajectoryCurve = null;
    this.trajectoryLine = null;
    this.startPos = new THREE.Vector3();
    this.endPos = new THREE.Vector3();

    this.initHUD();
    this.buildRealisticRocket();
    this.buildLaunchpadFacility();
    this.buildParticleFX();
  }

  initHUD() {
    this.hudElement = document.createElement('div');
    this.hudElement.id = 'rocket-flight-hud';
    this.hudElement.className = 'rocket-flight-hud';
    this.hudElement.innerHTML = `
      <div class="flight-hud-panel">
        <div class="hud-top-bar">
          <div class="hud-mission-badge" id="hud-mission-badge">
            <span class="hud-pulse-dot"></span>
            <span id="hud-mission-title">HEAVY ROCKET EXPEDITION</span>
          </div>
          <button class="hud-skip-btn" id="hud-skip-flight-btn">
            <span>⏩</span> Fast Forward
          </button>
        </div>

        <div class="hud-telemetry-row">
          <div class="telemetry-block">
            <span class="telemetry-lbl">MISSION CLOCK</span>
            <span class="telemetry-val" id="hud-clock">T- 00:05:00</span>
          </div>
          <div class="telemetry-block">
            <span class="telemetry-lbl">VELOCITY</span>
            <span class="telemetry-val" id="hud-velocity">0.0 km/s (Pad Rest)</span>
          </div>
          <div class="telemetry-block">
            <span class="telemetry-lbl">TRAJECTORY DISTANCE</span>
            <span class="telemetry-val" id="hud-distance">384,400 km</span>
          </div>
          <div class="telemetry-block">
            <span class="telemetry-lbl">FLIGHT EVENT</span>
            <span class="telemetry-val phase-text" id="hud-phase">CREW BOARDING & ACCESS ARM SECURED</span>
          </div>
        </div>

        <div class="hud-progress-bar-wrap">
          <div class="hud-progress-fill" id="hud-progress-fill"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.hudElement);
    this.hudElement.style.display = 'none';

    this.skipBtn = this.hudElement.querySelector('#hud-skip-flight-btn');
    this.skipBtn.addEventListener('click', () => {
      if (this.isPreLaunch) {
        this.preLaunchTimer = this.preLaunchDuration;
      } else {
        this.completeFlight();
      }
    });
  }

  buildRealisticRocket() {
    this.rocketGroup = new THREE.Group();

    // 1. Shared Modern Core Spacecraft
    this.spacecraftCore = new ModernCoreSpacecraft({ isLanded: false });
    this.coreStage = this.spacecraftCore.group;
    this.strobeLight = this.spacecraftCore.strobeLight;

    // Core Engine Flame Plume (Orange + Cyan supersonic Mach diamonds)
    this.corePlume = this.createFlamePlume(0.42, 3.4);
    this.corePlume.position.y = -1.85;
    this.coreStage.add(this.corePlume);

    // Re-entry Plasma Shield Dome
    const plasmaGeom = new THREE.SphereGeometry(1.05, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const plasmaMat = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.plasmaShield = new THREE.Mesh(plasmaGeom, plasmaMat);
    this.plasmaShield.rotation.x = Math.PI;
    this.plasmaShield.position.y = 0.5;
    this.coreStage.add(this.plasmaShield);

    this.rocketGroup.add(this.coreStage);

    // 2. Twin Heavy Side Boosters (For Earth Launch Only)
    this.leftBooster = this.createSideBooster(-0.95);
    this.rightBooster = this.createSideBooster(0.95);
    this.rocketGroup.add(this.leftBooster);
    this.rocketGroup.add(this.rightBooster);

    this.leftPlume = this.leftBooster.userData.plume;
    this.rightPlume = this.rightBooster.userData.plume;

    this.rocketGroup.scale.set(0.92, 0.92, 0.92);
    this.rocketGroup.visible = false;
    this.scene.add(this.rocketGroup);
  }

  createSideBooster(xOffset) {
    const booster = new THREE.Group();
    booster.position.set(xOffset, 0.8, 0);

    const matHull = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.25, metalness: 0.85 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 });
    const matEngine = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.28, metalness: 0.95 });

    // Booster fuselage
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 3.0, 24), matHull);
    body.position.y = 0.6;
    booster.add(body);

    // Aerodynamic slanted nose cone
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.0, 24), matHull);
    cone.position.set(xOffset > 0 ? 0.04 : -0.04, 2.6, 0);
    cone.rotation.z = xOffset > 0 ? 0.06 : -0.06;
    booster.add(cone);

    // Grid Fin at top of booster
    const gridFin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.32), matDark);
    gridFin.position.set(xOffset > 0 ? 0.34 : -0.34, 2.2, 0);
    booster.add(gridFin);

    // Heavy Attachment Struts to Core
    const strut1 = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(xOffset) * 0.48, 0.12, 0.12), matDark);
    strut1.position.set(xOffset > 0 ? -0.28 : 0.28, 1.6, 0);
    booster.add(strut1);

    const strut2 = strut1.clone();
    strut2.position.y = -0.4;
    booster.add(strut2);

    // Base Fin
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.45), matDark);
    fin.position.set(xOffset > 0 ? 0.32 : -0.32, -0.6, 0);
    booster.add(fin);

    // Dual Engine Bells
    for (let b = 0; b < 2; b++) {
      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 16, 1, true), matEngine);
      bell.position.set(b === 0 ? -0.09 : 0.09, -1.05, 0);
      booster.add(bell);
    }

    // Booster Flame Plume
    const plume = this.createFlamePlume(0.35, 2.8);
    plume.position.y = -2.5;
    booster.add(plume);
    booster.userData.plume = plume;

    return booster;
  }

  createFlamePlume(radius, length) {
    const plumeGroup = new THREE.Group();

    const outerGeom = new THREE.ConeGeometry(radius, length, 16);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const outerMesh = new THREE.Mesh(outerGeom, outerMat);
    outerMesh.rotation.x = Math.PI;
    plumeGroup.add(outerMesh);
    plumeGroup.userData.outerMesh = outerMesh;

    const innerGeom = new THREE.ConeGeometry(radius * 0.48, length * 0.65, 12);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    innerMesh.rotation.x = Math.PI;
    innerMesh.position.y = 0.2;
    plumeGroup.add(innerMesh);
    plumeGroup.userData.innerMesh = innerMesh;

    for (let d = 1; d <= 4; d++) {
      const diamondGeom = new THREE.OctahedronGeometry(radius * 0.24, 0);
      const diamondMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const diamond = new THREE.Mesh(diamondGeom, diamondMat);
      diamond.position.y = -d * (length * 0.18);
      diamond.scale.set(1.0, 2.0, 1.0);
      plumeGroup.add(diamond);
    }

    return plumeGroup;
  }

  buildLaunchpadFacility() {
    this.launchpadGroup = new THREE.Group();
    const matTruss = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6, metalness: 0.7 });
    const matArm = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.3 });
    const matRail = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const matConcrete = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });

    const mountBase = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 0.8, 16), matConcrete);
    mountBase.position.y = -0.4;
    this.launchpadGroup.add(mountBase);

    const flameTrench = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 1.8), matConcrete);
    flameTrench.position.set(0, -0.6, 0);
    this.launchpadGroup.add(flameTrench);

    const towerGeom = new THREE.BoxGeometry(0.8, 8.5, 0.8);
    const tower = new THREE.Mesh(towerGeom, matTruss);
    tower.position.set(-2.4, 3.8, 0);
    this.launchpadGroup.add(tower);

    const towerLight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    towerLight.position.set(-2.4, 8.1, 0);
    this.launchpadGroup.add(towerLight);

    // Crew Access Arm (Catwalk)
    this.crewArm = new THREE.Group();
    this.crewArm.position.set(-2.4, 2.85, 0);
    this.launchpadGroup.add(this.crewArm);

    const walkFloor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.75), matArm);
    walkFloor.position.set(1.05, 0, 0);
    this.crewArm.add(walkFloor);

    const railL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 0.04), matRail);
    railL.position.set(1.05, 0.22, 0.35);
    this.crewArm.add(railL);

    const railR = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 0.04), matRail);
    railR.position.set(1.05, 0.22, -0.35);
    this.crewArm.add(railR);

    const cleanRoomHood = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.75), matArm);
    cleanRoomHood.position.set(2.15, 0.3, 0);
    this.crewArm.add(cleanRoomHood);

    // Pre-Launch Detailed Boarding Astronaut
    this.boardingAstronaut = new AstronautCharacter();
    this.boardingAstronaut.group.scale.set(0.42, 0.42, 0.42);
    this.launchpadGroup.add(this.boardingAstronaut.group);

    this.launchpadGroup.visible = false;
    this.scene.add(this.launchpadGroup);
  }

  buildParticleFX() {
    const pCount = 320;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    const cols = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 1] = -Math.random() * 4.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.9;

      cols[i * 3] = 1.0;
      cols[i * 3 + 1] = 0.3 + Math.random() * 0.6;
      cols[i * 3 + 2] = 0.1;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.55,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.exhaustParticles = new THREE.Points(geom, pMat);
    this.rocketGroup.add(this.exhaustParticles);

    const dustCount = 220;
    const dGeom = new THREE.BufferGeometry();
    const dPos = new Float32Array(dustCount * 3);
    for (let j = 0; j < dustCount; j++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 4.5;
      dPos[j * 3] = Math.cos(ang) * r;
      dPos[j * 3 + 1] = Math.random() * 0.8;
      dPos[j * 3 + 2] = Math.sin(ang) * r;
    }
    dGeom.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    this.groundDustBlast = new THREE.Points(dGeom, new THREE.PointsMaterial({
      color: 0xd97706,
      size: 0.5,
      transparent: true,
      opacity: 0.0
    }));
    this.rocketGroup.add(this.groundDustBlast);
  }

  // ──────────────────────────────────────────────────
  // START FLIGHT (OUTBOUND OR RETURN)
  // ──────────────────────────────────────────────────
  startFlight(targetPlanetId, fromPlanetId = 'earth', fromPosOverride = null) {
    this.targetPlanetId = targetPlanetId;
    this.fromPlanetId = fromPlanetId;
    this.isReturnFlight = (targetPlanetId === 'earth');
    this.isActive = true;
    this.progress = 0;
    this.elapsedTime = 0;

    // Reset Core Spacecraft state
    this.spacecraftCore.setLegsDeployProgress(0.0);
    this.spacecraftCore.setLadderVisible(false);

    // ── BOOSTER LOGIC ──
    // On return flight: NO BOOSTERS, NO SEPARATION! (Left behind at Earth)
    if (this.isReturnFlight) {
      this.leftBooster.visible = false;
      this.rightBooster.visible = false;
      if (this.leftPlume) this.leftPlume.visible = false;
      if (this.rightPlume) this.rightPlume.visible = false;
      this.boostersSeparated = true; // No separation needed
      this.spacecraftCore.setHatchOpen(false);
    } else {
      // Outward launch from Earth: Twin boosters active!
      this.leftBooster.visible = true;
      this.rightBooster.visible = true;
      this.leftBooster.position.set(-0.95, 0.8, 0);
      this.rightBooster.position.set(0.95, 0.8, 0);
      this.leftBooster.rotation.set(0, 0, 0);
      this.rightBooster.rotation.set(0, 0, 0);
      if (this.leftPlume) this.leftPlume.visible = true;
      if (this.rightPlume) this.rightPlume.visible = true;
      this.boostersSeparated = false;
    }

    // 1. Determine Start Position
    if (fromPosOverride) {
      // Use the pre-captured position (avoids glitch on second takeoff)
      this.startPos.copy(fromPosOverride);
    } else if (fromPlanetId === 'earth') {
      const earthObj = this.controls.celestialBodies['earth'];
      if (earthObj && earthObj.mesh) earthObj.mesh.getWorldPosition(this.startPos);
      else this.startPos.set(58, 0, 0);
    } else if (fromPlanetId === 'moon') {
      const earthObj = this.controls.celestialBodies['earth'];
      if (earthObj && earthObj.moonMesh) earthObj.moonMesh.getWorldPosition(this.startPos);
      else this.startPos.set(67, 0, 0);
    } else if (fromPlanetId === 'mars') {
      const marsObj = this.controls.celestialBodies['mars'];
      if (marsObj && marsObj.mesh) marsObj.mesh.getWorldPosition(this.startPos);
      else this.startPos.set(78, 0, 0);
    }

    // 2. Determine Target Position
    if (targetPlanetId === 'earth') {
      const earthObj = this.controls.celestialBodies['earth'];
      if (earthObj && earthObj.mesh) earthObj.mesh.getWorldPosition(this.endPos);
      else this.endPos.set(58, 0, 0);
    } else if (targetPlanetId === 'moon') {
      const earthObj = this.controls.celestialBodies['earth'];
      if (earthObj && earthObj.moonMesh) earthObj.moonMesh.getWorldPosition(this.endPos);
      else this.endPos.copy(this.startPos).add(new THREE.Vector3(9, 0, 0));
    } else if (targetPlanetId === 'mars') {
      const marsObj = this.controls.celestialBodies['mars'];
      if (marsObj && marsObj.mesh) marsObj.mesh.getWorldPosition(this.endPos);
      else this.endPos.set(78, 0, 0);
    }

    // 3. Trajectory Spline Curve
    const midPoint = new THREE.Vector3().addVectors(this.startPos, this.endPos).multiplyScalar(0.5);
    const normal = new THREE.Vector3().subVectors(this.endPos, this.startPos).normalize();
    const upArc = (targetPlanetId === 'mars' || fromPlanetId === 'mars') ? 22.0 : 6.0;
    midPoint.y += upArc;
    midPoint.x += normal.z * ((targetPlanetId === 'mars' || fromPlanetId === 'mars') ? 26 : 5);
    midPoint.z -= normal.x * ((targetPlanetId === 'mars' || fromPlanetId === 'mars') ? 26 : 5);

    this.trajectoryCurve = new THREE.QuadraticBezierCurve3(
      this.startPos.clone().add(new THREE.Vector3(0, 1.8, 0)),
      midPoint,
      this.endPos.clone().add(new THREE.Vector3(0, 1.2, 0))
    );

    if (this.trajectoryLine) this.scene.remove(this.trajectoryLine);
    const pts = this.trajectoryCurve.getPoints(90);
    const lineGeom = new THREE.BufferGeometry().setFromPoints(pts);
    const lineMat = new THREE.LineBasicMaterial({
      color: this.isReturnFlight ? 0x10b981 : (targetPlanetId === 'mars' ? 0xff4500 : 0x00f0ff),
      transparent: true,
      opacity: 0.65
    });
    this.trajectoryLine = new THREE.Line(lineGeom, lineMat);
    this.scene.add(this.trajectoryLine);

    this.rocketGroup.position.copy(this.startPos);
    this.rocketGroup.visible = true;
    this.rocketGroup.quaternion.identity();

    // Configure Pre-Launch Phase for Outbound Earth Launch
    if (!this.isReturnFlight) {
      this.isPreLaunch = true;
      this.preLaunchTimer = 0;
      this.launchpadGroup.position.copy(this.startPos);
      this.launchpadGroup.visible = true;

      this.crewArm.rotation.y = 0;
      this.spacecraftCore.setHatchOpen(true);

      this.boardingAstronaut.group.position.set(-2.0, 2.85, 0);
      this.boardingAstronaut.group.rotation.set(0, Math.PI / 2, 0);
      this.boardingAstronaut.group.visible = true;
      this.boardingAstronaut.resetPose();

      if (this.corePlume) this.corePlume.visible = false;
      if (this.leftPlume) this.leftPlume.visible = false;
      if (this.rightPlume) this.rightPlume.visible = false;
    } else {
      // Direct return flight from Moon/Mars
      this.isPreLaunch = false;
      this.launchpadGroup.visible = false;
      if (this.corePlume) this.corePlume.visible = true;
      soundFX.playRocketLaunch();
    }

    this.hudElement.style.display = 'block';
    const missionTitle = this.isReturnFlight 
      ? `RETURN MISSION: ${fromPlanetId.toUpperCase()} ➔ EARTH (HOMEWARD BOUND)`
      : `EXPEDITION LAUNCH: EARTH ➔ ${targetPlanetId.toUpperCase()}`;
    this.hudElement.querySelector('#hud-mission-title').textContent = missionTitle;
  }

  // ──────────────────────────────────────────────────
  // ANIMATION & TELEMETRY LOOP
  // ──────────────────────────────────────────────────
  update(delta) {
    if (!this.isActive) return;

    // Strobe beacon flash
    if (this.strobeLight) {
      const flash = Math.sin(Date.now() * 0.012) > 0.85;
      this.strobeLight.visible = flash;
    }

    // ────────────────────────────────────────────────
    // PHASE A: PRE-LAUNCH BOARDING AT EARTH LAUNCHPAD
    // ────────────────────────────────────────────────
    if (this.isPreLaunch) {
      this.preLaunchTimer += delta;
      const tPre = this.preLaunchTimer;

      if (tPre < 2.5) {
        const walkP = tPre / 2.5;
        const curX = -2.0 + walkP * 1.7;
        this.boardingAstronaut.group.position.set(curX, 2.85, 0);
        this.boardingAstronaut.group.rotation.set(0, Math.PI / 2, 0);
        this.boardingAstronaut.animateWalk(tPre, 5.0);

        this.updatePreLaunchHUD(tPre, 'CREW INGRESS: ASTRONAUT BOARDING LAUNCH VEHICLE');
      } else if (tPre < 3.4) {
        this.boardingAstronaut.group.position.set(-0.3, 2.85, 0.1);
        this.boardingAstronaut.group.rotation.set(0, Math.PI * 0.25, 0);
        this.boardingAstronaut.poseWave(tPre);

        this.updatePreLaunchHUD(tPre, 'CREW STATUS: FINAL SYSTEMS CHECK & GO FOR LAUNCH');
      } else if (tPre < 4.2) {
        this.boardingAstronaut.group.visible = false;

        const closeP = (tPre - 3.4) / 0.8;
        if (closeP >= 0.85) {
          this.spacecraftCore.setHatchOpen(false);
        }
        this.crewArm.rotation.y = closeP * 1.1;

        this.updatePreLaunchHUD(tPre, 'CABIN SEALED // ACCESS ARM RETRACTED // T-MINUS COUNTDOWN');
      } else if (tPre < this.preLaunchDuration) {
        this.crewArm.rotation.y = 1.1;
        this.updatePreLaunchHUD(tPre, 'STAGE 1 IGNITION SEQUENCE START... 3... 2... 1...');

        if (!this.ignitionPlayed) {
          soundFX.playRocketLaunch();
          this.ignitionPlayed = true;
        }
      } else {
        this.isPreLaunch = false;
        this.launchpadGroup.visible = false;
        if (this.corePlume) this.corePlume.visible = true;
        if (this.leftPlume) this.leftPlume.visible = true;
        if (this.rightPlume) this.rightPlume.visible = true;
        this.ignitionPlayed = false;
      }

      const catwalkFocus = this.startPos.clone().add(new THREE.Vector3(-1.0, 3.2, 0));
      const preCamPos = this.startPos.clone().add(new THREE.Vector3(1.8, 4.0, 3.8));
      this.camera.position.lerp(preCamPos, 0.08);
      this.camera.lookAt(catwalkFocus);
      return;
    }

    // ────────────────────────────────────────────────
    // PHASE B: ACTIVE INTERPLANETARY MISSION FLIGHT
    // ────────────────────────────────────────────────
    this.elapsedTime += delta;
    this.progress = Math.min(1.0, this.elapsedTime / this.flightDuration);
    const t = this.progress;

    const smoothT = t * t * (3 - 2 * t);
    const currentPoint = this.trajectoryCurve.getPoint(smoothT);
    this.rocketGroup.position.copy(currentPoint);

    const shakeIntensity = t < 0.22 ? (0.22 - t) * 0.45 : 0;
    const shake = new THREE.Vector3(
      (Math.random() - 0.5) * shakeIntensity,
      (Math.random() - 0.5) * shakeIntensity,
      (Math.random() - 0.5) * shakeIntensity
    );

    // 1. TWIN BOOSTER SEPARATION (ONLY FOR OUTWARD LAUNCH FROM EARTH!)
    if (!this.isReturnFlight) {
      if (t > 0.26 && !this.boostersSeparated) {
        this.boostersSeparated = true;
      }

      if (this.boostersSeparated && this.leftBooster.visible) {
        this.leftBooster.position.x -= 0.18;
        this.leftBooster.position.y -= 0.22;
        this.leftBooster.rotation.z += 0.08;
        this.leftBooster.rotation.y += 0.04;

        this.rightBooster.position.x += 0.18;
        this.rightBooster.position.y -= 0.22;
        this.rightBooster.rotation.z -= 0.08;
        this.rightBooster.rotation.y -= 0.04;

        if (this.leftPlume) this.leftPlume.visible = false;
        if (this.rightPlume) this.rightPlume.visible = false;

        if (this.leftBooster.position.y < -14.0) {
          this.leftBooster.visible = false;
          this.rightBooster.visible = false;
        }
      }
    }

    // 2. CORE SUSTAINER ENGINE FLAME ANIMATION
    if (this.corePlume) {
      const flicker = 1.0 + Math.sin(this.elapsedTime * 38) * 0.25;
      let throttle = 1.0;
      if (t < 0.26) throttle = this.isReturnFlight ? 1.15 : 1.25;
      else if (t >= 0.26 && t < 0.75) throttle = 0.75;
      else if (t >= 0.75 && t < 0.95) throttle = 1.35; // Retro-burn
      else throttle = Math.max(0.08, (1.0 - t) * 12);

      this.corePlume.scale.set(throttle, throttle * flicker, throttle);
    }

    // 3. ATMOSPHERIC ENTRY GLOW (FOR MARS AND EARTH ON RETURN)
    const hasAtmosphere = (this.targetPlanetId === 'mars' || this.targetPlanetId === 'earth');
    if (hasAtmosphere && this.plasmaShield) {
      if (t > 0.72 && t < 0.88) {
        this.plasmaShield.material.opacity = Math.sin((t - 0.72) / 0.16 * Math.PI) * 0.85;
      } else {
        this.plasmaShield.material.opacity = 0;
      }
    }

    // 4. DEPLOY HYDRAULIC LANDING LEGS
    if (t > 0.84) {
      const deployP = Math.min(1.0, (t - 0.84) / 0.09);
      this.spacecraftCore.setLegsDeployProgress(deployP);
    }

    // 5. RADIAL GROUND DUST BLAST ON TOUCHDOWN
    if (t > 0.92 && this.groundDustBlast) {
      const dustP = (t - 0.92) / 0.08;
      this.groundDustBlast.material.opacity = Math.sin(dustP * Math.PI) * 0.9;
      this.groundDustBlast.scale.set(1 + dustP * 3.8, 1 + dustP * 2, 1 + dustP * 3.8);
    }

    // 6. ATTITUDE & FLIGHT ORIENTATION
    if (t < 0.84) {
      const nextPoint = this.trajectoryCurve.getPoint(Math.min(1.0, smoothT + 0.01));
      this.rocketGroup.lookAt(nextPoint);
      this.rocketGroup.rotateX(Math.PI / 2);

      const flapWiggle = Math.sin(this.elapsedTime * 6) * 0.12;
      this.spacecraftCore.canardFlaps.forEach(f => f.rotation.z = flapWiggle);
      this.spacecraftCore.aftFlaps.forEach(f => f.rotation.z = -flapWiggle * 0.5);
    } else {
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
      this.rocketGroup.quaternion.slerp(targetQuat, 0.14);
    }

    // 7. CINEMATIC CHASE CAMERA
    let camOffset = new THREE.Vector3(0, 3.4, 9.8);
    if (t < 0.28) {
      camOffset.set(4.5, 2.5, 7.8);
    } else if (t > 0.85) {
      camOffset.set(5.8, 1.8, 6.8);
    }

    const desiredCamPos = currentPoint.clone().add(camOffset).add(shake);
    this.camera.position.lerp(desiredCamPos, 0.08);
    this.camera.lookAt(currentPoint);

    this.updateHUD(t);

    if (this.progress >= 1.0) {
      this.completeFlight();
    }
  }

  updatePreLaunchHUD(tPre, eventText) {
    const clockEl = this.hudElement.querySelector('#hud-clock');
    const velEl = this.hudElement.querySelector('#hud-velocity');
    const distEl = this.hudElement.querySelector('#hud-distance');
    const phaseEl = this.hudElement.querySelector('#hud-phase');
    const barEl = this.hudElement.querySelector('#hud-progress-fill');

    const countdown = Math.max(0, this.preLaunchDuration - tPre).toFixed(1);
    clockEl.textContent = `T- 00:00:0${countdown}`;
    velEl.textContent = '0.0 km/s (Pad Locked)';
    distEl.textContent = this.targetPlanetId === 'mars' ? '225,000,000 km' : '384,400 km';
    phaseEl.textContent = eventText;
    barEl.style.width = `${Math.min(100, Math.floor((tPre / this.preLaunchDuration) * 100))}%`;
  }

  updateHUD(t) {
    const clockEl = this.hudElement.querySelector('#hud-clock');
    const velEl = this.hudElement.querySelector('#hud-velocity');
    const distEl = this.hudElement.querySelector('#hud-distance');
    const phaseEl = this.hudElement.querySelector('#hud-phase');
    const barEl = this.hudElement.querySelector('#hud-progress-fill');

    const totalSeconds = Math.floor(this.elapsedTime * 22);
    const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    clockEl.textContent = `T+ 00:${mm}:${ss}`;

    if (this.isReturnFlight) {
      if (t < 0.26) {
        velEl.textContent = '4.2 km/s (Trans-Earth Injection)';
        phaseEl.textContent = 'STAGE 1: PLANETARY SURFACE ASCENT & ESCAPE BURN';
      } else if (t < 0.72) {
        velEl.textContent = '39,400 km/h (Earth-Bound Velocity)';
        phaseEl.textContent = 'STAGE 2: INTERPLANETARY HOMEWARD COAST';
      } else if (t < 0.88) {
        velEl.textContent = '28,000 km/h (Atmospheric Plasma)';
        phaseEl.textContent = 'STAGE 3: EARTH RE-ENTRY THERMAL SHIELD BRAKING';
      } else if (t < 0.98) {
        velEl.textContent = '4.2 m/s (Landing Legs Deployed)';
        phaseEl.textContent = 'STAGE 4: RETRO-PROPULSION DESCENT OVER SPACEPORT';
      } else {
        velEl.textContent = '0.0 m/s (Touchdown Confirmed)';
        phaseEl.textContent = 'STAGE 5: TOUCHDOWN AT EARTH SPACEPORT! WELCOME HOME 🌍';
      }
    } else {
      if (t < 0.26) {
        velEl.textContent = `${(t / 0.26 * 8.5).toFixed(1)} km/s (Ascent Thrust)`;
        phaseEl.textContent = 'STAGE 1: TRIPLE CORE BOOSTER LIFTOFF';
      } else if (t < 0.38) {
        velEl.textContent = '11.2 km/s (Escape Velocity)';
        phaseEl.textContent = 'STAGE 2: TWIN SIDE BOOSTERS SEPARATION (KOROLEV CROSS)';
      } else if (t < 0.72) {
        velEl.textContent = '39,200 km/h (Interplanetary Cruise)';
        phaseEl.textContent = 'STAGE 3: VACUUM CORE INJECTION CRUISE';
      } else if (t < 0.88) {
        velEl.textContent = this.targetPlanetId === 'mars' ? '18,500 km/h (Plasma Shield)' : '4,800 km/h (Lunar Orbit Burn)';
        phaseEl.textContent = this.targetPlanetId === 'mars' ? 'STAGE 4: MARS ATMOSPHERIC ENTRY' : 'STAGE 4: LUNAR RETRO-BRAKING';
      } else if (t < 0.98) {
        velEl.textContent = '3.8 m/s (Landing Legs Extended)';
        phaseEl.textContent = 'STAGE 5: RETRO-THRUST VERTICAL DESCENT';
      } else {
        velEl.textContent = '0.0 m/s (Surface Contact)';
        phaseEl.textContent = 'TOUCHDOWN CONFIRMED! ENTERING SURFACE ENVIRONMENT';
      }
    }

    const totalDist = (this.targetPlanetId === 'mars' || this.fromPlanetId === 'mars') ? 225000000 : 384400;
    const remaining = Math.max(0, Math.floor(totalDist * (1.0 - t)));
    distEl.textContent = `${remaining.toLocaleString()} km`;

    barEl.style.width = `${Math.min(100, Math.floor(t * 100))}%`;
  }

  completeFlight() {
    this.isActive = false;
    this.isPreLaunch = false;
    this.progress = 1.0;

    soundFX.playTouchdown();

    this.hudElement.style.display = 'none';
    if (this.trajectoryLine) {
      this.scene.remove(this.trajectoryLine);
      this.trajectoryLine = null;
    }
    if (this.launchpadGroup) {
      this.launchpadGroup.visible = false;
    }
    if (this.rocketGroup) {
      this.rocketGroup.visible = false;
    }

    if (this.onComplete) {
      this.onComplete(this.targetPlanetId);
    }
  }
}

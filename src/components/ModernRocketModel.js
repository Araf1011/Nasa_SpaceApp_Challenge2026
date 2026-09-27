/**
 * Modern Heavy Spacecraft 3D Model Builder (Shared Component)
 * Ensures 100% VISUAL CONSISTENCY between interplanetary flight and surface landing!
 * Features:
 * - Brushed stainless-steel fuselage with weld lines, rivets, and NASA red worm stripe
 * - Black hexagonal ceramic thermal protection heatshield tiles on belly
 * - Steerable forward canard flaps and aft body flaps
 * - 4-quad cold-gas RCS thruster blocks with cold-gas jet nozzles
 * - Red port, green starboard, and flashing white zenith beacon strobes
 * - Cockpit observation visor
 * - Articulated crew ingress/egress hatch door with green seal LED
 * - Retractable titanium crew ladder for surface egress
 * - 5-engine Inconel bell cluster with glowing cyan combustion chambers
 * - 4 Heavy deployable hydraulic landing legs with telescoping chrome pistons and gold foil footpads
 */

import * as THREE from 'three';
import { createRocketHullTexture, createHeatshieldTexture } from '../utils/textureGenerator.js';

export class ModernCoreSpacecraft {
  constructor(options = {}) {
    this.group = new THREE.Group();
    this.landingLegs = [];
    this.canardFlaps = [];
    this.aftFlaps = [];
    this.engineBells = [];
    this.hatchDoor = null;
    this.hatchStatusLight = null;
    this.crewLadder = null;
    this.strobeLight = null;

    this.buildModel(options);
  }

  buildModel(options) {
    const isLandedInitial = options.isLanded || false;

    // High quality PBR materials
    const hullTexture = createRocketHullTexture();
    const heatshieldTexture = createHeatshieldTexture();

    const matStainless = new THREE.MeshStandardMaterial({
      map: hullTexture,
      roughness: 0.22,
      metalness: 0.88,
      envMapIntensity: 1.2
    });

    const matHeatShield = new THREE.MeshStandardMaterial({
      map: heatshieldTexture,
      roughness: 0.88,
      metalness: 0.12,
      color: 0x111827
    });

    const matDarkTitanium = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.85
    });

    const matChrome = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.98
    });

    const matEngineInconel = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.28,
      metalness: 0.95
    });

    const matGoldFoil = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.92
    });

    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });

    // 1. Core Fuselage Cylinder — taller and wider for a more imposing look
    const coreCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 4.8, 36), matStainless);
    coreCylinder.position.y = 2.4;
    this.group.add(coreCylinder);

    // Heatshield tile half-cylinder on windward belly (180 deg curvature)
    const heatShieldGeom = new THREE.CylinderGeometry(0.495, 0.535, 4.78, 36, 1, false, -Math.PI / 2, Math.PI);
    const heatShieldMesh = new THREE.Mesh(heatShieldGeom, matHeatShield);
    heatShieldMesh.position.y = 2.4;
    this.group.add(heatShieldMesh);

    // Aerospace panel weld rings (structural stringers) — more rings for taller body
    for (let r = 0; r < 7; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.016, 8, 36), matDarkTitanium);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.5 + r * 0.72;
      this.group.add(ring);
    }

    // NASA red worm stripe — vertical accent stripe
    const stripeGeom = new THREE.CylinderGeometry(0.485, 0.525, 0.22, 36, 1, false, -0.18, 0.36);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4, metalness: 0.3 });
    for (let s = 0; s < 3; s++) {
      const stripe = new THREE.Mesh(stripeGeom, stripeMat);
      stripe.position.y = 1.2 + s * 1.4;
      this.group.add(stripe);
    }

    // 2. Aerodynamic Nose Cone — sharper and more elongated
    const noseGeom = new THREE.ConeGeometry(0.48, 1.85, 36);
    const nose = new THREE.Mesh(noseGeom, matStainless);
    nose.position.y = 5.7;
    this.group.add(nose);

    // Nose Heatshield Cone Half
    const noseHeatGeom = new THREE.ConeGeometry(0.495, 1.84, 36, 1, false, -Math.PI / 2, Math.PI);
    const noseHeat = new THREE.Mesh(noseHeatGeom, matHeatShield);
    noseHeat.position.y = 5.7;
    this.group.add(noseHeat);

    // Forward Steerable Canard Flaps (Left & Right) — larger and more prominent
    this.canardFlaps = [];
    const canardGeom = new THREE.BoxGeometry(0.55, 0.06, 0.36);

    const leftCanard = new THREE.Mesh(canardGeom, matDarkTitanium);
    leftCanard.position.set(-0.68, 5.3, 0);
    this.group.add(leftCanard);
    this.canardFlaps.push(leftCanard);

    const rightCanard = new THREE.Mesh(canardGeom, matDarkTitanium);
    rightCanard.position.set(0.68, 5.3, 0);
    this.group.add(rightCanard);
    this.canardFlaps.push(rightCanard);

    // Aft Steerable Body Flaps (Left & Right) — larger for more visual impact
    this.aftFlaps = [];
    const aftFlapGeom = new THREE.BoxGeometry(0.64, 0.06, 0.72);

    const leftAftFlap = new THREE.Mesh(aftFlapGeom, matDarkTitanium);
    leftAftFlap.position.set(-0.75, 0.75, 0);
    this.group.add(leftAftFlap);
    this.aftFlaps.push(leftAftFlap);

    const rightAftFlap = new THREE.Mesh(aftFlapGeom, matDarkTitanium);
    rightAftFlap.position.set(0.75, 0.75, 0);
    this.group.add(rightAftFlap);
    this.aftFlaps.push(rightAftFlap);

    // RCS Thruster Blocks (4 quadrants on forward section)
    for (let q = 0; q < 4; q++) {
      const qAngle = (q / 4) * Math.PI * 2;
      const rcsBlock = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), matDarkTitanium);
      rcsBlock.position.set(Math.cos(qAngle) * 0.50, 4.9, Math.sin(qAngle) * 0.50);
      this.group.add(rcsBlock);

      for (let n = 0; n < 4; n++) {
        const jetNozzle = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.035, 6), matChrome);
        jetNozzle.position.set(
          Math.cos(qAngle) * 0.52,
          4.9 + (n === 0 ? 0.035 : (n === 1 ? -0.035 : 0)),
          Math.sin(qAngle) * 0.52
        );
        this.group.add(jetNozzle);
      }
    }

    // Cockpit Window — larger and more prominent
    const cockpitVisor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.28), matGlass);
    cockpitVisor.position.set(0, 5.05, 0.44);
    this.group.add(cockpitVisor);

    // Secondary side windows
    const portWindow = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), matGlass);
    portWindow.position.set(-0.49, 4.6, 0);
    portWindow.rotation.y = Math.PI / 2;
    this.group.add(portWindow);

    const starboardWindow = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), matGlass);
    starboardWindow.position.set(0.49, 4.6, 0);
    starboardWindow.rotation.y = -Math.PI / 2;
    this.group.add(starboardWindow);

    // Crew Ingress/Egress Hatch Door — repositioned for taller body
    const hatchGroup = new THREE.Group();
    hatchGroup.position.set(0, 3.2, 0.50);

    const hatchFrame = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.030, 8, 24), matDarkTitanium);
    hatchGroup.add(hatchFrame);

    this.hatchDoor = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.055, 16), matStainless);
    this.hatchDoor.rotation.x = Math.PI / 2;
    this.hatchDoor.position.set(0, 0, 0.02);
    hatchGroup.add(this.hatchDoor);

    this.hatchStatusLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    this.hatchStatusLight.position.set(0.22, 0.16, 0.02);
    hatchGroup.add(this.hatchStatusLight);

    this.group.add(hatchGroup);

    // Deployable Crew Access Ladder (repositioned for new hatch height)
    this.crewLadder = new THREE.Group();
    this.crewLadder.position.set(0, 0, 0.54);

    const ladderRailGeom = new THREE.CylinderGeometry(0.018, 0.018, 3.8, 8);
    const ladderRailL = new THREE.Mesh(ladderRailGeom, matChrome);
    ladderRailL.position.set(-0.18, 1.7, 0.08);
    this.crewLadder.add(ladderRailL);

    const ladderRailR = new THREE.Mesh(ladderRailGeom, matChrome);
    ladderRailR.position.set(0.18, 1.7, 0.08);
    this.crewLadder.add(ladderRailR);

    const rungGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8);
    for (let rg = 0; rg < 13; rg++) {
      const rung = new THREE.Mesh(rungGeom, matChrome);
      rung.rotation.z = Math.PI / 2;
      rung.position.set(0, 0.15 + rg * 0.3, 0.08);
      this.crewLadder.add(rung);
    }
    this.crewLadder.visible = isLandedInitial;
    this.group.add(this.crewLadder);

    // Navigation & Strobe Lights — repositioned for new height
    const navRed = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    navRed.position.set(-0.88, 5.3, 0);
    this.group.add(navRed);

    const navGreen = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    navGreen.position.set(0.88, 5.3, 0);
    this.group.add(navGreen);

    const strobeBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    strobeBeacon.position.set(0, 6.7, 0);
    this.group.add(strobeBeacon);
    this.strobeLight = strobeBeacon;

    const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.016, 0.85, 8), matChrome);
    spike.position.y = 7.0;
    this.group.add(spike);

    // 3. Multi-Engine Cluster Bells at bottom — wider cluster with more bells
    this.engineBells = [];
    const bellGeom = new THREE.ConeGeometry(0.19, 0.55, 20, 1, true);

    const centerBell = new THREE.Mesh(bellGeom, matEngineInconel);
    centerBell.position.set(0, -0.18, 0);
    this.group.add(centerBell);
    this.engineBells.push(centerBell);

    // Glowing combustion chamber inside center bell
    const centerGlow = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 12),
      new THREE.MeshBasicMaterial({ color: 0x00d4ff, side: THREE.DoubleSide })
    );
    centerGlow.rotation.x = Math.PI / 2;
    centerGlow.position.y = 0.12;
    centerBell.add(centerGlow);

    for (let eb = 0; eb < 5; eb++) {
      const ebAngle = (eb / 5) * Math.PI * 2;
      const outerBell = new THREE.Mesh(bellGeom, matEngineInconel);
      outerBell.position.set(Math.cos(ebAngle) * 0.28, -0.14, Math.sin(ebAngle) * 0.28);
      this.group.add(outerBell);
      this.engineBells.push(outerBell);

      const glowRing = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.10, 14),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
      );
      glowRing.rotation.x = Math.PI / 2;
      glowRing.position.y = 0.1;
      outerBell.add(glowRing);
    }

    // 4. 4 Heavy Deployable Hydraulic Landing Legs — longer and more sturdy
    this.landingLegs = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const legGroup = new THREE.Group();
      legGroup.position.set(Math.cos(angle) * 0.48, 0.5, Math.sin(angle) * 0.48);
      legGroup.rotation.y = angle;

      const pivotBracket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.14), matDarkTitanium);
      legGroup.add(pivotBracket);

      // Main structural leg strut
      const upperStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.75, 10), matDarkTitanium);
      upperStrut.position.set(0, -0.72, 0.28);
      upperStrut.rotation.x = -0.3;
      legGroup.add(upperStrut);

      // Chrome hydraulic piston
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 1.15, 10), matChrome);
      piston.position.set(0, -1.1, 0.44);
      piston.rotation.x = -0.3;
      legGroup.add(piston);

      // Diagonal brace strut
      const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.0, 8), matDarkTitanium);
      brace.position.set(0, -0.5, 0.16);
      brace.rotation.x = -0.6;
      legGroup.add(brace);

      // Large gold footpad
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.07, 20), matGoldFoil);
      pad.position.set(0, -1.52, 0.62);
      legGroup.add(pad);

      // Footpad secondary ring
      const padRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.022, 8, 20), matDarkTitanium);
      padRing.rotation.x = Math.PI / 2;
      padRing.position.set(0, -1.52, 0.62);
      legGroup.add(padRing);

      this.group.add(legGroup);
      this.landingLegs.push(legGroup);
    }

    if (isLandedInitial) {
      this.setLegsDeployProgress(1.0);
    } else {
      this.setLegsDeployProgress(0.0);
    }
  }

  setLegsDeployProgress(progress) {
    const p = Math.max(0, Math.min(1.0, progress));
    this.landingLegs.forEach((leg, idx) => {
      const ang = (idx / 4) * Math.PI * 2 + Math.PI / 4;
      leg.rotation.z = Math.cos(ang) * 0.72 * p;
      leg.rotation.x = Math.sin(ang) * -0.72 * p;
    });
  }

  setHatchOpen(isOpen) {
    if (!this.hatchDoor) return;
    if (isOpen) {
      this.hatchDoor.position.x = 0.28;
      this.hatchDoor.rotation.y = Math.PI * 0.45;
      if (this.hatchStatusLight) this.hatchStatusLight.material.color.setHex(0xf59e0b);
    } else {
      this.hatchDoor.position.x = 0;
      this.hatchDoor.rotation.y = 0;
      if (this.hatchStatusLight) this.hatchStatusLight.material.color.setHex(0x22c55e);
    }
  }

  setLadderVisible(isVisible) {
    if (this.crewLadder) this.crewLadder.visible = isVisible;
  }
}

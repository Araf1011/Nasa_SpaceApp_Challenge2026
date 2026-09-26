/**
 * Procedural 3D Astronaut Model & Animation Controller (Ultra-Detailed Artemis / Apollo EVA Edition)
 * Builds a realistic NASA Extravehicular Mobility Unit (EMU) spacesuit:
 * - Reflective gold sun visor with helmet neck ring and dual illuminated EVA work-lights
 * - Detailed chest Remote Control Unit (RCU) with digital display, analog pressure dials, and switches
 * - Dual flexible spiral umbilical life support hoses connecting chest to PLSS backpack
 * - PLSS backpack with gold Kapton thermal foil insulation, dual oxygen tanks, RCS thruster blocks, and antenna
 * - NASA meatball insignia, American flag, and mission shoulder patches
 * - Articulated shoulder bellows, elbow disconnect rings, blue silicone fingertip EVA gloves, and ribbed lunar tread boots
 * - Full animations: animateWalk(), animateClimb(), poseSalute(), poseWave(), poseIdle(), resetPose()
 */

import * as THREE from 'three';

export class AstronautCharacter {
  constructor() {
    this.group = new THREE.Group();

    // High fidelity PBR spacesuit materials
    const matSuit = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.65,
      metalness: 0.12
    });

    const matSuitRibbed = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.08
    });

    const matJoint = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.4
    });

    const matAnodizedBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.85
    });

    const matVisor = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.04,
      metalness: 0.98,
      envMapIntensity: 2.0
    });

    const matKaptonGold = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.28,
      metalness: 0.88
    });

    const matBackpack = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.2
    });

    const matBoots = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.85,
      metalness: 0.2
    });

    const matGloveBlue = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.4,
      metalness: 0.3
    });

    // ──────────────────────────────────────────────────
    // 1. TORSO & CHEST REMOTE CONTROL UNIT (RCU)
    // ──────────────────────────────────────────────────
    this.torso = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.76, 0.4), matSuit);
    this.torso.position.y = 1.28;
    this.group.add(this.torso);

    // Torso waist convolute ring
    const waistRing = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.12, 16), matJoint);
    waistRing.position.set(0, -0.34, 0);
    this.torso.add(waistRing);

    // Chest Remote Control Unit (RCU) Housing
    const rcuBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.12), matJoint);
    rcuBox.position.set(0, 0.06, 0.23);
    this.torso.add(rcuBox);

    // RCU Digital LED Display (Cyan glowing screen)
    const ledScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    ledScreen.position.set(-0.06, 0.08, 0.065);
    rcuBox.add(ledScreen);

    // Analog Pressure Gauges (Circular dials)
    const gauge1 = new THREE.Mesh(
      new THREE.CircleGeometry(0.035, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    gauge1.position.set(0.08, 0.08, 0.065);
    rcuBox.add(gauge1);

    const gauge2 = gauge1.clone();
    gauge2.position.set(0.08, -0.02, 0.065);
    rcuBox.add(gauge2);

    // RCU Safety Switch Levers
    for (let sw = 0; sw < 3; sw++) {
      const swMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.04, 6), matAnodizedBlue);
      swMesh.rotation.x = Math.PI / 2;
      swMesh.position.set(-0.1 + sw * 0.06, -0.08, 0.07);
      rcuBox.add(swMesh);
    }

    // Umbilical Hose Brass Fittings on RCU base
    const fittingL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8), matAnodizedBlue);
    fittingL.position.set(-0.12, -0.16, 0.02);
    rcuBox.add(fittingL);

    const fittingR = fittingL.clone();
    fittingR.position.x = 0.12;
    rcuBox.add(fittingR);

    // Flexible Spiral Oxygen Hoses (Curves under armpit into PLSS backpack)
    const hoseCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, -0.1, 0.24),
      new THREE.Vector3(-0.35, -0.05, 0.12),
      new THREE.Vector3(-0.35, 0.0, -0.18),
      new THREE.Vector3(-0.2, 0.05, -0.28)
    ]);
    const hoseGeomL = new THREE.TubeGeometry(hoseCurveL, 16, 0.018, 8, false);
    const hoseMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    const hoseMeshL = new THREE.Mesh(hoseGeomL, hoseMat);
    this.torso.add(hoseMeshL);

    const hoseCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, -0.1, 0.24),
      new THREE.Vector3(0.35, -0.05, 0.12),
      new THREE.Vector3(0.35, 0.0, -0.18),
      new THREE.Vector3(0.2, 0.05, -0.28)
    ]);
    const hoseGeomR = new THREE.TubeGeometry(hoseCurveR, 16, 0.018, 8, false);
    const hoseMeshR = new THREE.Mesh(hoseGeomR, hoseMat);
    this.torso.add(hoseMeshR);

    // NASA Meatball Emblem Patch (Left chest)
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.065, 16), new THREE.MeshBasicMaterial({ color: 0x0052cc }));
    patch.position.set(0.16, 0.22, 0.21);
    this.torso.add(patch);

    // White star / red chevron in patch
    const patchChevron = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.015, 0.01), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    patchChevron.rotation.z = 0.4;
    patchChevron.position.set(0.16, 0.22, 0.215);
    this.torso.add(patchChevron);

    // ──────────────────────────────────────────────────
    // 2. HELMET & REFLECTIVE GOLD EXTRAVEHICULAR VISOR
    // ──────────────────────────────────────────────────
    this.helmetGroup = new THREE.Group();
    this.helmetGroup.position.y = 0.58;
    this.torso.add(this.helmetGroup);

    // Neck Disconnect Ring
    const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 8, 24), matJoint);
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.y = -0.15;
    this.helmetGroup.add(neckRing);

    // White Helmet Shell
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.29, 24, 24), matSuit);
    this.helmetGroup.add(helmet);

    // Mirror Gold Reflective Sun Visor Bubble
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 24, 0, Math.PI, 0, Math.PI),
      matVisor
    );
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 0.02, 0.09);
    visor.scale.set(1.12, 0.98, 1.18);
    this.helmetGroup.add(visor);

    // Helmet Temple Adjustment Dials (Left & Right)
    const dialL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), matAnodizedBlue);
    dialL.rotation.z = Math.PI / 2;
    dialL.position.set(-0.28, 0.04, 0.04);
    this.helmetGroup.add(dialL);

    const dialR = dialL.clone();
    dialR.position.x = 0.28;
    this.helmetGroup.add(dialR);

    // Dual High-Power EVA Floodlights on Helmet
    const lightHousingL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.1), matJoint);
    lightHousingL.position.set(-0.26, 0.15, 0.12);
    this.helmetGroup.add(lightHousingL);

    const lightLensL = new THREE.Mesh(new THREE.CircleGeometry(0.024, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    lightLensL.position.set(-0.26, 0.15, 0.175);
    this.helmetGroup.add(lightLensL);

    const lightHousingR = lightHousingL.clone();
    lightHousingR.position.x = 0.26;
    this.helmetGroup.add(lightHousingR);

    const lightLensR = lightLensL.clone();
    lightLensR.position.x = 0.26;
    this.helmetGroup.add(lightLensR);

    // ──────────────────────────────────────────────────
    // 3. PRIMARY LIFE SUPPORT SYSTEM (PLSS BACKPACK)
    // ──────────────────────────────────────────────────
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.76, 0.26), matBackpack);
    backpack.position.set(0, 0.06, -0.3);
    this.torso.add(backpack);

    // Gold Kapton Thermal Blanket on Center of Backpack
    const kaptonFoil = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.54, 0.02), matKaptonGold);
    kaptonFoil.position.set(0, 0, -0.135);
    backpack.add(kaptonFoil);

    // Twin High-Pressure Oxygen / Cryo Cylinders
    const tank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.54, 16), matJoint);
    tank1.position.set(-0.15, 0.04, -0.14);
    backpack.add(tank1);

    const tank2 = tank1.clone();
    tank2.position.x = 0.15;
    backpack.add(tank2);

    // High-Gain VHF Telemetry Antenna
    const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.08, 8), matJoint);
    antennaBase.position.set(0.2, 0.42, -0.06);
    backpack.add(antennaBase);

    const antennaWhip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 6), matJoint);
    antennaWhip.position.set(0.2, 0.68, -0.06);
    backpack.add(antennaWhip);

    // Cold-Gas Attitude Thruster Nozzles on PLSS Corners
    const thrusterL = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 8), matAnodizedBlue);
    thrusterL.position.set(-0.25, 0.36, -0.05);
    thrusterL.rotation.z = Math.PI / 4;
    backpack.add(thrusterL);

    const thrusterR = thrusterL.clone();
    thrusterR.position.x = 0.25;
    thrusterR.rotation.z = -Math.PI / 4;
    backpack.add(thrusterR);

    // ──────────────────────────────────────────────────
    // 4. ARTICULATED LEFT ARM
    // ──────────────────────────────────────────────────
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.41, 0.3, 0);
    this.torso.add(this.leftArm);

    // Shoulder joint bellows
    const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), matJoint);
    this.leftArm.add(lShoulder);

    // Upper Arm Sleeve
    const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.32, 14), matSuit);
    lUpperArm.position.y = -0.16;
    this.leftArm.add(lUpperArm);

    // Artemis / Mission Patch on Left Upper Arm
    const missionPatch = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
    missionPatch.rotation.y = -Math.PI / 2;
    missionPatch.position.set(-0.105, -0.14, 0);
    this.leftArm.add(missionPatch);

    // Elbow Disconnect Ring
    const lElbow = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.02, 8, 16), matJoint);
    lElbow.rotation.x = Math.PI / 2;
    lElbow.position.y = -0.32;
    this.leftArm.add(lElbow);

    // Forearm Sleeve
    const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.28, 14), matSuit);
    lForearm.position.y = -0.46;
    this.leftArm.add(lForearm);

    // Blue Anodized Wrist Disconnect Ring
    const lWristRing = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.04, 16), matAnodizedBlue);
    lWristRing.position.y = -0.6;
    this.leftArm.add(lWristRing);

    // Detailed EVA Glove with Blue Fingertip Tactiles
    const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.1), matBoots);
    lHand.position.y = -0.68;
    this.leftArm.add(lHand);

    const lFingers = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.09), matGloveBlue);
    lFingers.position.y = -0.78;
    this.leftArm.add(lFingers);

    // ──────────────────────────────────────────────────
    // 5. ARTICULATED RIGHT ARM
    // ──────────────────────────────────────────────────
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.41, 0.3, 0);
    this.torso.add(this.rightArm);

    // Shoulder joint bellows
    const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), matJoint);
    this.rightArm.add(rShoulder);

    // Upper Arm Sleeve
    const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.32, 14), matSuit);
    rUpperArm.position.y = -0.16;
    this.rightArm.add(rUpperArm);

    // American Flag Patch on Right Upper Arm
    const flagPatch = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.05), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    flagPatch.rotation.y = Math.PI / 2;
    flagPatch.position.set(0.105, -0.14, 0);
    this.rightArm.add(flagPatch);

    // Elbow Disconnect Ring
    const rElbow = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.02, 8, 16), matJoint);
    rElbow.rotation.x = Math.PI / 2;
    rElbow.position.y = -0.32;
    this.rightArm.add(rElbow);

    // Forearm Sleeve
    const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.28, 14), matSuit);
    rForearm.position.y = -0.46;
    this.rightArm.add(rForearm);

    // Blue Anodized Wrist Disconnect Ring
    const rWristRing = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.04, 16), matAnodizedBlue);
    rWristRing.position.y = -0.6;
    this.rightArm.add(rWristRing);

    // Detailed EVA Glove with Blue Fingertip Tactiles
    const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.1), matBoots);
    rHand.position.y = -0.68;
    this.rightArm.add(rHand);

    const rFingers = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.09), matGloveBlue);
    rFingers.position.y = -0.78;
    this.rightArm.add(rFingers);

    // ──────────────────────────────────────────────────
    // 6. ARTICULATED LEFT LEG
    // ──────────────────────────────────────────────────
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.18, -0.4, 0);
    this.torso.add(this.leftLeg);

    const lHip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), matJoint);
    this.leftLeg.add(lHip);

    // Thigh Sleeve
    const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.38, 14), matSuit);
    lThigh.position.y = -0.2;
    this.leftLeg.add(lThigh);

    // Knee Flexure Convolute Pad
    const lKneePad = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), matJoint);
    lKneePad.position.set(0, -0.4, 0.04);
    this.leftLeg.add(lKneePad);

    // Shin Sleeve
    const lShin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.36, 14), matSuit);
    lShin.position.y = -0.62;
    this.leftLeg.add(lShin);

    // Blue Anodized Ankle Bracket
    const lAnkle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 16), matAnodizedBlue);
    lAnkle.rotation.x = Math.PI / 2;
    lAnkle.position.y = -0.8;
    this.leftLeg.add(lAnkle);

    // Lunar EVA Overboot with Tread Sole
    const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.38), matBoots);
    lBoot.position.set(0, -0.88, 0.07);
    this.leftLeg.add(lBoot);

    // Deep Ribbed Tread Sole on Boot Bottom
    const lSole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.4), matJoint);
    lSole.position.set(0, -0.97, 0.07);
    this.leftLeg.add(lSole);

    // ──────────────────────────────────────────────────
    // 7. ARTICULATED RIGHT LEG
    // ──────────────────────────────────────────────────
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.18, -0.4, 0);
    this.torso.add(this.rightLeg);

    const rHip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), matJoint);
    this.rightLeg.add(rHip);

    // Thigh Sleeve
    const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.38, 14), matSuit);
    rThigh.position.y = -0.2;
    this.rightLeg.add(rThigh);

    // Knee Flexure Convolute Pad
    const rKneePad = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), matJoint);
    rKneePad.position.set(0, -0.4, 0.04);
    this.rightLeg.add(rKneePad);

    // Shin Sleeve
    const rShin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.36, 14), matSuit);
    rShin.position.y = -0.62;
    this.rightLeg.add(rShin);

    // Blue Anodized Ankle Bracket
    const rAnkle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 16), matAnodizedBlue);
    rAnkle.rotation.x = Math.PI / 2;
    rAnkle.position.y = -0.8;
    this.rightLeg.add(rAnkle);

    // Lunar EVA Overboot with Tread Sole
    const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.38), matBoots);
    rBoot.position.set(0, -0.88, 0.07);
    this.rightLeg.add(rBoot);

    // Deep Ribbed Tread Sole on Boot Bottom
    const rSole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.4), matJoint);
    rSole.position.set(0, -0.97, 0.07);
    this.rightLeg.add(rSole);

    this.group.scale.set(0.85, 0.85, 0.85);
  }

  // ──────────────────────────────────────────────────
  // ARTICULATED LIMB ANIMATION METHODS
  // ──────────────────────────────────────────────────

  /**
   * Standard walking gait — legs and arms counter-swing with natural body bob
   */
  animateWalk(time, speed = 6.0) {
    const cycle = Math.sin(time * speed);
    const cycleAbs = Math.abs(cycle);

    // Leg alternating forward/back swing
    this.leftLeg.rotation.x = cycle * 0.48;
    this.rightLeg.rotation.x = -cycle * 0.48;

    // Slight lateral leg sway (knee out)
    this.leftLeg.rotation.z = Math.sin(time * speed * 0.5) * 0.04;
    this.rightLeg.rotation.z = -Math.sin(time * speed * 0.5) * 0.04;

    // Arms counter-swing to legs
    this.leftArm.rotation.x = -cycle * 0.38;
    this.rightArm.rotation.x = cycle * 0.38;

    // Slight arm flare outward
    this.leftArm.rotation.z = 0.1 + Math.sin(time * speed) * 0.06;
    this.rightArm.rotation.z = -0.1 - Math.sin(time * speed) * 0.06;

    // Torso bob: rises on each footfall, dips between steps
    this.torso.position.y = 1.28 + cycleAbs * 0.07;

    // Subtle torso twist (shoulder rotation against hips)
    this.torso.rotation.y = cycle * 0.06;
  }

  /**
   * Low-gravity walking — exaggerated bounce and float for Moon/Mars EVA
   */
  animateLowGravityWalk(time, speed = 4.0) {
    const cycle = Math.sin(time * speed);
    const floatBounce = Math.abs(Math.sin(time * speed * 0.5));

    // Wider leg swing for loping gait
    this.leftLeg.rotation.x = cycle * 0.55;
    this.rightLeg.rotation.x = -cycle * 0.55;

    // Arms glide forward/back with wider motion
    this.leftArm.rotation.x = -cycle * 0.42;
    this.rightArm.rotation.x = cycle * 0.42;

    // Extra height on each step — lunar bounce
    this.torso.position.y = 1.28 + floatBounce * 0.18;

    // Slight torso lean forward
    this.torso.rotation.x = -0.08;
    this.torso.rotation.y = cycle * 0.05;
  }

  animateClimb(time, speed = 4.0) {
    const angle = Math.sin(time * speed);
    // Legs alternate climbing steps
    this.leftLeg.rotation.x = angle * 0.52;
    this.rightLeg.rotation.x = -angle * 0.52;

    // Arms reach upward alternately
    this.leftArm.rotation.x = Math.PI * 0.48 + angle * 0.35;
    this.rightArm.rotation.x = Math.PI * 0.48 - angle * 0.35;

    // Slight arm flare to grip rungs
    this.leftArm.rotation.z = 0.18;
    this.rightArm.rotation.z = -0.18;

    // Body rises slightly on each step
    this.torso.position.y = 1.28 + Math.abs(Math.sin(time * speed)) * 0.04;
    this.torso.rotation.y = angle * 0.04;
  }

  poseSalute() {
    this.rightArm.rotation.set(-Math.PI * 0.12, 0.05, -Math.PI * 0.38);
    this.leftArm.rotation.set(0.08, 0, 0.12);
    this.leftLeg.rotation.set(0, 0, 0);
    this.rightLeg.rotation.set(0, 0, 0);
    this.torso.position.y = 1.28;
    this.torso.rotation.y = 0;
    this.torso.rotation.x = 0;
  }

  poseWave(time) {
    const wave = Math.sin(time * 8.0) * 0.28;
    this.rightArm.rotation.set(-Math.PI * 0.2, 0, -Math.PI * 0.65 + wave);
    this.leftArm.rotation.set(0.08, 0, 0.08);
    this.leftLeg.rotation.set(0, 0, 0);
    this.rightLeg.rotation.set(0, 0, 0);
    this.torso.position.y = 1.28;
    this.torso.rotation.y = 0;
    this.torso.rotation.x = 0;
  }

  poseIdle() {
    this.leftLeg.rotation.set(0, 0, 0.03);
    this.rightLeg.rotation.set(0, 0, -0.03);
    this.leftArm.rotation.set(0.05, 0, 0.14);
    this.rightArm.rotation.set(0.05, 0, -0.14);
    this.torso.position.y = 1.28;
    this.torso.rotation.y = 0;
    this.torso.rotation.x = 0;
  }

  resetPose() {
    this.poseIdle();
  }
}

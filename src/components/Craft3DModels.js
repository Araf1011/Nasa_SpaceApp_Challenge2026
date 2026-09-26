/**
 * Procedural 3D Spacecraft & Instrument Models
 * High-detail Three.js models for rovers, probes, telescopes, and landers.
 * Each mesh is tagged with userData.partKey for interactive highlighting.
 */

import * as THREE from 'three';

// Helper: tag a mesh with partKey
function tag(mesh, partKey) {
  mesh.userData.partKey = partKey;
  return mesh;
}

// 1. Curiosity / Perseverance Mars Rover Model
export function createCuriosityRoverModel() {
  const group = new THREE.Group();

  // Materials (cloned so highlighting can mutate them independently)
  const mkBody = () => new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.6 });
  const mkDark = () => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.8 });
  const mkWheel = () => new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.2 });
  const mkGold = () => new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.8 });
  const mkLens = () => new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.9 });

  // Main Chassis Box
  const chassis = tag(new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 3.4), mkBody()), 'chassis');
  chassis.position.y = 1.4;
  group.add(chassis);

  // Gold foil equipment module
  const goldModule = tag(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 1.4), mkGold()), 'chassis');
  goldModule.position.set(0, 2.0, 0.4);
  group.add(goldModule);

  // Camera Mast (Remote Sensing Mast)
  const mast = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.8, 8), mkDark()), 'mast');
  mast.position.set(0.6, 2.6, 1.1);
  group.add(mast);

  // Mast Head (Mastcam & ChemCam)
  const head = tag(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), mkBody()), 'mast');
  head.position.set(0.6, 3.5, 1.1);
  group.add(head);

  // Dual camera lenses
  const lens1 = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), mkLens()), 'mast');
  lens1.rotation.x = Math.PI / 2;
  lens1.position.set(0.48, 3.5, 1.35);
  group.add(lens1);
  const lens2 = lens1.clone();
  lens2.position.set(0.72, 3.5, 1.35);
  group.add(lens2);

  // ChemCam Circular Eye
  const chemCamEye = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12), mkLens()), 'mast');
  chemCamEye.rotation.x = Math.PI / 2;
  chemCamEye.position.set(0.6, 3.65, 1.32);
  group.add(chemCamEye);

  // Rear MMRTG Nuclear Battery Cylinder
  const rtg = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.2, 12), mkDark()), 'rtg');
  rtg.rotation.z = Math.PI / 2;
  rtg.position.set(0, 1.5, -2.1);
  group.add(rtg);

  // Cooling fins on RTG
  for (let a = 0; a < 8; a++) {
    const fin = tag(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 1.1), mkDark()), 'rtg');
    fin.rotation.z = (a / 8) * Math.PI;
    fin.position.set(0, 1.5, -2.1);
    group.add(fin);
  }

  // High-Gain Hexagonal Dish Antenna
  const dish = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.1, 6), mkBody()), 'dish');
  dish.position.set(-0.6, 2.2, -0.8);
  dish.rotation.x = 0.4;
  group.add(dish);

  // Robotic Arm (Front Left)
  const arm1 = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), mkDark()), 'arm');
  arm1.position.set(-1.1, 1.2, 1.6);
  arm1.rotation.x = -0.5;
  group.add(arm1);

  const turret = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8), mkBody()), 'arm');
  turret.position.set(-1.1, 0.7, 2.2);
  turret.rotation.z = Math.PI / 2;
  group.add(turret);

  // 6 Wheels (Rocker-Bogie Suspension)
  const wheelPositions = [
    [-1.6, 0.5, 1.4], [1.6, 0.5, 1.4],
    [-1.7, 0.5, -0.1], [1.7, 0.5, -0.1],
    [-1.6, 0.5, -1.6], [1.6, 0.5, -1.6]
  ];

  wheelPositions.forEach(pos => {
    const wheel = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.35, 16), mkWheel()), 'wheels');
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(...pos);
    group.add(wheel);

    const strut = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), mkDark()), 'wheels');
    strut.position.set(pos[0] * 0.8, 1.0, pos[2]);
    strut.rotation.z = pos[0] > 0 ? -0.4 : 0.4;
    group.add(strut);
  });

  return group;
}

// 2. Voyager Interstellar Probe Model
export function createVoyagerModel() {
  const group = new THREE.Group();

  const mkDish = () => new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 });
  const mkBus  = () => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.7 });
  const mkGold = () => new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.9 });
  const mkBoom = () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });

  // Central 10-sided Electronics Bus
  const bus = tag(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 10), mkBus()), 'bus');
  group.add(bus);

  // Giant 3.7m Parabolic High-Gain Dish Antenna
  const dish = tag(new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 3), mkDish()), 'dish');
  dish.rotation.x = Math.PI;
  dish.position.set(0, 0.8, 0);
  group.add(dish);

  const feed = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), mkBus()), 'dish');
  feed.position.set(0, 2.2, 0);
  group.add(feed);

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const leg = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6), mkBoom()), 'dish');
    leg.position.set(Math.cos(angle) * 0.7, 1.5, Math.sin(angle) * 0.7);
    leg.rotation.z = Math.cos(angle) * 0.3;
    leg.rotation.x = Math.sin(angle) * 0.3;
    group.add(leg);
  }

  // The Golden Phonograph Record
  const record = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.04, 24), mkGold()), 'record');
  record.rotation.z = Math.PI / 2;
  record.position.set(1.25, 0, 0);
  group.add(record);

  // RTG Power Boom
  const rtgBoom = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 6), mkBoom()), 'rtg_boom');
  rtgBoom.rotation.z = Math.PI / 2.8;
  rtgBoom.position.set(-1.8, -0.4, 0);
  group.add(rtgBoom);

  for (let c = 0; c < 3; c++) {
    const can = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12), mkBus()), 'rtg_boom');
    can.position.set(-2.8 - (c * 0.4), -0.8 - (c * 0.2), 0);
    group.add(can);
  }

  // 13-Meter Magnetometer Boom
  const magBoom = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.8, 6), mkBoom()), 'mag_boom');
  magBoom.rotation.x = Math.PI / 2.3;
  magBoom.position.set(0, -0.2, -2.6);
  group.add(magBoom);

  return group;
}

// 3. James Webb Space Telescope (JWST) Model
export function createJWSTModel() {
  const group = new THREE.Group();

  const mkMirror  = () => new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.95 });
  const mkKapton  = () => new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.4, side: THREE.DoubleSide });
  const mkSilver  = () => new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.2, metalness: 0.8, side: THREE.DoubleSide });
  const mkBus     = () => new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const mkTripod  = () => new THREE.MeshStandardMaterial({ color: 0x1e293b });

  // 5-Layer Kapton Diamond Sunshield
  for (let l = 0; l < 4; l++) {
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 3.8 - l * 0.08);
    shieldShape.lineTo(2.2 - l * 0.06, 0);
    shieldShape.lineTo(0, -3.8 + l * 0.08);
    shieldShape.lineTo(-2.2 + l * 0.06, 0);
    shieldShape.closePath();
    const shieldMesh = tag(new THREE.Mesh(new THREE.ShapeGeometry(shieldShape), l === 0 ? mkKapton() : mkSilver()), 'sunshield');
    shieldMesh.rotation.x = Math.PI / 2;
    shieldMesh.position.y = -0.4 - (l * 0.1);
    group.add(shieldMesh);
  }

  // Spacecraft Bus
  const bus = tag(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.6), mkBus()), 'bus');
  bus.position.y = -1.0;
  group.add(bus);

  const solarWing = tag(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 2.0), mkBus()), 'bus');
  solarWing.position.set(0, -1.2, -1.8);
  group.add(solarWing);

  // 18 Gold Hexagonal Mirror Segments
  const hexGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.05, 6);
  const hexCoords = [
    [0.65, 0], [-0.65, 0],
    [0.32, 0.56], [-0.32, 0.56],
    [0.32, -0.56], [-0.32, -0.56],
    [1.3, 0], [-1.3, 0],
    [0.97, 0.56], [-0.97, 0.56],
    [0.97, -0.56], [-0.97, -0.56],
    [0.65, 1.12], [-0.65, 1.12],
    [0.65, -1.12], [-0.65, -1.12],
    [0, 1.12], [0, -1.12]
  ];

  hexCoords.forEach(pos => {
    const hexMesh = tag(new THREE.Mesh(hexGeom, mkMirror()), 'mirror');
    hexMesh.rotation.x = Math.PI / 2;
    hexMesh.position.set(pos[0], pos[1] + 1.2, 0.4);
    group.add(hexMesh);
  });

  // Secondary Mirror & Tripod
  const secMirror = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 12), mkMirror()), 'mirror');
  secMirror.rotation.x = Math.PI / 2;
  secMirror.position.set(0, 1.2, 2.2);
  group.add(secMirror);

  for (let t = 0; t < 3; t++) {
    const angle = (t / 3) * Math.PI * 2;
    const boom = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6), mkTripod()), 'mirror');
    boom.position.set(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8 + 1.2, 1.3);
    boom.rotation.z = Math.cos(angle) * 0.4;
    boom.rotation.x = Math.PI / 4;
    group.add(boom);
  }

  return group;
}

// 4. Apollo 11 Lunar Module & Retroreflector Model
export function createApolloLanderModel() {
  const group = new THREE.Group();

  const mkGold   = () => new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.25, metalness: 0.9 });
  const mkDark   = () => new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.6, metalness: 0.8 });
  const mkQuartz = () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0.1 });

  // Octagonal Descent Stage Base
  const base = tag(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 1.2, 8), mkGold()), 'base');
  base.position.y = 1.0;
  group.add(base);

  // Engine Bell
  const bell = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.8, 0.9, 16), mkDark()), 'bell');
  bell.position.y = 0.2;
  group.add(bell);

  // 4 Landing Struts with Footpads
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const lx = Math.cos(angle) * 2.1;
    const lz = Math.sin(angle) * 2.1;

    const leg = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8), mkDark()), 'base');
    leg.position.set(lx * 0.6, 0.5, lz * 0.6);
    leg.rotation.z = Math.cos(angle) * -0.6;
    leg.rotation.x = Math.sin(angle) * 0.6;
    group.add(leg);

    const pad = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 12), mkGold()), 'base');
    pad.position.set(lx, 0.04, lz);
    group.add(pad);
  }

  // Laser Ranging Retroreflector Pallet (LRRR)
  const lrrrPallet = tag(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.8), mkGold()), 'lrrr');
  lrrrPallet.position.set(1.1, 1.6, 0.8);
  lrrrPallet.rotation.y = 0.3;
  group.add(lrrrPallet);

  for (let qx = -3; qx <= 3; qx += 2) {
    for (let qz = -3; qz <= 3; qz += 2) {
      const cube = tag(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), mkQuartz()), 'lrrr');
      cube.position.set(1.1 + (qx * 0.08), 1.7, 0.8 + (qz * 0.08));
      group.add(cube);
    }
  }

  return group;
}

// 5. Ingenuity Mars Helicopter Model
export function createIngenuityHelicopterModel() {
  const group = new THREE.Group();

  const mkCarbon = () => new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const mkSolar  = () => new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const mkGold   = () => new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.8 });

  const fuse = tag(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), mkGold()), 'chassis');
  fuse.position.y = 0.9;
  group.add(fuse);

  const mast = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), mkCarbon()), 'mast');
  mast.position.y = 1.6;
  group.add(mast);

  const blade1 = tag(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.18), mkCarbon()), 'mast');
  blade1.position.y = 1.8;
  group.add(blade1);

  const blade2 = tag(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.18), mkCarbon()), 'mast');
  blade2.position.y = 2.1;
  blade2.rotation.y = Math.PI / 2;
  group.add(blade2);

  const panel = tag(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.8), mkSolar()), 'chassis');
  panel.position.y = 2.25;
  group.add(panel);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 6), mkCarbon()), 'wheels');
    leg.position.set(Math.cos(angle) * 0.45, 0.45, Math.sin(angle) * 0.45);
    leg.rotation.z = Math.cos(angle) * -0.5;
    leg.rotation.x = Math.sin(angle) * 0.5;
    group.add(leg);
  }

  return group;
}

// 6. Parker Solar Probe Model
export function createParkerProbeModel() {
  const group = new THREE.Group();

  const mkShield = () => new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
  const mkBus    = () => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
  const mkSolar  = () => new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });

  const shield = tag(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.25, 6), mkShield()), 'shield');
  shield.rotation.x = Math.PI / 2;
  shield.position.z = 1.0;
  group.add(shield);

  const bus = tag(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.8), mkBus()), 'bus');
  bus.position.z = -0.2;
  group.add(bus);

  const wing1 = tag(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.8), mkSolar()), 'bus');
  wing1.position.set(1.3, 0, -0.4);
  wing1.rotation.y = 0.3;
  group.add(wing1);

  const wing2 = wing1.clone();
  wing2.position.set(-1.3, 0, -0.4);
  wing2.rotation.y = -0.3;
  wing2.userData.partKey = 'bus';
  group.add(wing2);

  const boom = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6), mkBus()), 'boom');
  boom.position.set(0, 0, -1.8);
  boom.rotation.x = Math.PI / 2;
  group.add(boom);

  return group;
}

// 7. Chandrayaan-3: Vikram Lander & Pragyan Rover Model (ISRO Lunar South Pole Mission)
export function createChandrayaanModel() {
  const group = new THREE.Group();

  // Materials
  const mkGold      = () => new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.28, metalness: 0.85 });
  const mkAmberGold = () => new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.32, metalness: 0.9 });
  const mkSolar     = () => new THREE.MeshStandardMaterial({ color: 0x0c2340, roughness: 0.18, metalness: 0.85 });
  const mkBus       = () => new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45, metalness: 0.3 });
  const mkLeg       = () => new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.75 });
  const mkPad       = () => new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3, metalness: 0.8 });
  const mkNozzle    = () => new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.95 });
  const mkAntenna   = () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2 });
  const mkPragyan   = () => new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
  const mkWheel     = () => new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.3 });
  const mkLaserGlow = () => new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, emissive: 0x10b981, emissiveIntensity: 0.8 });
  const mkFlagTri   = () => new THREE.MeshStandardMaterial({ color: 0xff9933, roughness: 0.6 }); // Saffron

  // ── VIKRAM LANDER ──
  // Main Truncated Pyramid / Box Chassis
  const landerBody = tag(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.1, 1.5, 8), mkGold()), 'lander-chassis');
  landerBody.position.y = 1.6;
  group.add(landerBody);

  // Top Equipment Deck
  const topDeck = tag(new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.52, 0.12, 8), mkBus()), 'lander-chassis');
  topDeck.position.y = 2.4;
  group.add(topDeck);

  // Side Solar Panels (Vikram has solar panels covering all 4 vertical faces)
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const panel = tag(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.25, 0.05), mkSolar()), 'solar-panels');
    panel.position.set(Math.cos(angle) * 1.62, 1.6, Math.sin(angle) * 1.62);
    panel.rotation.y = -angle + Math.PI / 2;
    group.add(panel);

    // Silver busbar grid lines on solar panel
    const gridBar = tag(new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.03, 0.06), mkBus()), 'solar-panels');
    gridBar.position.set(Math.cos(angle) * 1.64, 1.6, Math.sin(angle) * 1.64);
    gridBar.rotation.y = -angle + Math.PI / 2;
    group.add(gridBar);
  }

  // 4 Main 800N Throttleable Rocket Engines
  const engineCluster = [
    [-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]
  ];
  engineCluster.forEach(([ex, ez]) => {
    const nozzle = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 0.55, 12), mkNozzle()), 'propulsion-thrusters');
    nozzle.position.set(ex, 0.72, ez);
    group.add(nozzle);

    // Inner engine bell glow
    const throat = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.2, 8), new THREE.MeshBasicMaterial({ color: 0xff4500 })), 'propulsion-thrusters');
    throat.position.set(ex, 0.62, ez);
    group.add(throat);
  });

  // RCS Attitude Control Thruster Blocks (8 pods around top corners)
  for (let r = 0; r < 4; r++) {
    const rAngle = (r * Math.PI) / 2 + Math.PI / 4;
    const rx = Math.cos(rAngle) * 1.45;
    const rz = Math.sin(rAngle) * 1.45;
    const pod = tag(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), mkBus()), 'propulsion-thrusters');
    pod.position.set(rx, 2.3, rz);
    group.add(pod);

    const quadNozzle = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.1, 6), mkNozzle()), 'propulsion-thrusters');
    quadNozzle.rotation.x = Math.PI / 2;
    quadNozzle.position.set(rx * 1.08, 2.3, rz * 1.08);
    group.add(quadNozzle);
  }

  // 4 Articulated Landing Struts & Footpads
  for (let k = 0; k < 4; k++) {
    const legAngle = (k * Math.PI) / 2 + Math.PI / 4;
    const footX = Math.cos(legAngle) * 2.6;
    const footZ = Math.sin(legAngle) * 2.6;

    // Primary diagonal strut
    const mainStrut = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 2.2, 8), mkLeg()), 'landing-gear');
    mainStrut.position.set(footX * 0.58, 0.95, footZ * 0.58);
    mainStrut.rotation.z = Math.cos(legAngle) * -0.58;
    mainStrut.rotation.x = Math.sin(legAngle) * 0.58;
    group.add(mainStrut);

    // Hydraulic shock absorber sleeve
    const shockSleeve = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.9, 8), mkGold()), 'landing-gear');
    shockSleeve.position.set(footX * 0.52, 1.1, footZ * 0.52);
    shockSleeve.rotation.z = Math.cos(legAngle) * -0.58;
    shockSleeve.rotation.x = Math.sin(legAngle) * 0.58;
    group.add(shockSleeve);

    // Circular honeycomb aluminum landing footpad
    const pad = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.09, 14), mkPad()), 'landing-gear');
    pad.position.set(footX, 0.05, footZ);
    group.add(pad);
  }

  // High-Gain Communication Dish Antenna (Top Deck)
  const dishSupport = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), mkBus()), 'antenna');
  dishSupport.position.set(0.4, 2.6, 0.3);
  group.add(dishSupport);

  const dish = tag(new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4), mkAntenna()), 'antenna');
  dish.rotation.x = Math.PI * 0.65;
  dish.position.set(0.4, 2.8, 0.3);
  group.add(dish);

  // Omnidirectional Antenna Mast
  const mast = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), mkBus()), 'antenna');
  mast.position.set(-0.6, 2.8, -0.5);
  group.add(mast);

  // NASA Laser Retroreflector Array (LRA) Dome on Top Deck
  const lraDome = tag(new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), mkGold()), 'scientific-payloads');
  lraDome.position.set(0, 2.52, 0);
  group.add(lraDome);

  // Hazard Detection & Avoidance Cameras (LHDAC)
  const camPod = tag(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.15), mkBus()), 'scientific-payloads');
  camPod.position.set(0, 2.45, 1.5);
  group.add(camPod);

  // ChaSTE Lunar Soil Thermal Probe (drilled down into regolith)
  const chasteProbe = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), mkLeg()), 'scientific-payloads');
  chasteProbe.position.set(1.8, 0.35, -1.2);
  group.add(chasteProbe);

  // ── DEPLOYMENT RAMP ──
  // Ramp leading down to lunar soil on the positive Z face
  const ramp = tag(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 2.6), mkBus()), 'pragyan-rover');
  ramp.position.set(0, 0.52, 2.4);
  ramp.rotation.x = 0.42; // Sloping down to ground
  group.add(ramp);

  // Ramp Guide Rails
  [-0.44, 0.44].forEach(rx => {
    const rail = tag(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 2.6), mkLeg()), 'pragyan-rover');
    rail.position.set(rx, 0.56, 2.4);
    rail.rotation.x = 0.42;
    group.add(rail);
  });

  // ── PRAGYAN ROVER (Deployed on Lunar Soil!) ──
  const roverGroup = new THREE.Group();
  roverGroup.position.set(0, 0.28, 4.2); // Positioned proudly just past the ramp

  // Rover Chassis Box
  const roverBody = tag(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 1.05), mkPragyan()), 'pragyan-rover');
  roverBody.position.y = 0.2;
  roverGroup.add(roverBody);

  // Deployable Solar Panel Wing (tilted to catch polar sun)
  const roverSolar = tag(new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.02, 0.95), mkSolar()), 'pragyan-rover');
  roverSolar.position.set(0, 0.38, 0);
  roverSolar.rotation.x = 0.18;
  roverGroup.add(roverSolar);

  // NAVCAM Stereo Mast
  const roverMast = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6), mkLeg()), 'pragyan-rover');
  roverMast.position.set(0.24, 0.55, 0.38);
  roverGroup.add(roverMast);

  const roverCamHead = tag(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.08), mkBus()), 'pragyan-rover');
  roverCamHead.position.set(0.24, 0.78, 0.38);
  roverGroup.add(roverCamHead);

  // LIBS (Laser Induced Breakdown Spectroscope) Sensor Lens
  const libsLaser = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8), mkLaserGlow()), 'pragyan-rover');
  libsLaser.rotation.x = Math.PI / 2;
  libsLaser.position.set(-0.2, 0.2, 0.54);
  roverGroup.add(libsLaser);

  // 6 Lunar Cleated Rover Wheels (Rocker-Bogie Mobility)
  const wheelPositions = [
    [-0.46, 0.0, -0.42], [0.46, 0.0, -0.42],
    [-0.48, 0.0, 0.0],   [0.48, 0.0, 0.0],
    [-0.46, 0.0, 0.42],  [0.46, 0.0, 0.42]
  ];
  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheel = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 12), mkWheel()), 'pragyan-rover');
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, wy, wz);
    roverGroup.add(wheel);

    // Rim hubcap
    const hub = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 8), mkPad()), 'pragyan-rover');
    hub.rotation.z = Math.PI / 2;
    hub.position.set(wx, wy, wz);
    roverGroup.add(hub);
  });

  // Small Target Rock being analyzed by LIBS laser
  const rock = tag(new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 1), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 })), 'scientific-payloads');
  rock.position.set(-0.2, 0.08, 1.1);
  roverGroup.add(rock);

  // Pulsing laser beam from LIBS to Rock
  const laserBeam = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.55, 6), mkLaserGlow()), 'scientific-payloads');
  laserBeam.position.set(-0.2, 0.14, 0.82);
  laserBeam.rotation.x = Math.PI / 2;
  roverGroup.add(laserBeam);

  group.add(roverGroup);

  return group;
}

/**
 * Factory helper: creates the appropriate 3D model for a relic or surface expedition
 */
export function createRelicModel(modelType) {
  switch (modelType) {
    case 'chandrayaan-3':
    case 'chandrayaan':
      return createChandrayaanModel();
    case 'curiosity-rover':
    case 'perseverance-rover':
    case 'rover':
      return createCuriosityRoverModel();
    case 'voyager-probe':
      return createVoyagerModel();
    case 'jwst-telescope':
      return createJWSTModel();
    case 'apollo-lander':
      return createApolloLanderModel();
    case 'ingenuity-helicopter':
      return createIngenuityHelicopterModel();
    case 'parker-probe':
      return createParkerProbeModel();
    default:
      return createVoyagerModel();
  }
}

/**
 * Highlight 3D model parts matching partKey; dims everything else.
 * Call with partKey = null to reset to normal appearance.
 */
export function highlightPart(group, partKey) {
  if (!group) return;
  group.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    // Save originals once
    if (child.userData.origEmissive === undefined) {
      child.userData.origEmissive = child.material.emissive
        ? child.material.emissive.clone()
        : new THREE.Color(0x000000);
    }

    if (!partKey) {
      // Reset
      if (child.material.emissive) child.material.emissive.copy(child.userData.origEmissive);
      child.material.opacity = 1.0;
      child.material.transparent = false;
    } else if (child.userData.partKey === partKey) {
      // Neon cyan glow on matching part
      if (child.material.emissive) child.material.emissive.setHex(0x00d4ff);
      child.material.emissiveIntensity = 0.8;
      child.material.opacity = 1.0;
      child.material.transparent = false;
    } else {
      // Dim unrelated parts
      if (child.material.emissive) child.material.emissive.setHex(0x000000);
      child.material.opacity = 0.28;
      child.material.transparent = true;
    }
  });
}

/**
 * Procedural Realistic Planet Texture Generator
 * Uses HTML5 2D Canvas to generate high-detail celestial textures offline.
 */

import * as THREE from 'three';

// 1. Realistic Earth Texture
export function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep Ocean Base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#0b3c68');
  oceanGrad.addColorStop(1, '#0a2342');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Shallow continental shelf turquoise
  ctx.fillStyle = 'rgba(0, 150, 214, 0.25)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    const r = 25 + Math.random() * 65;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Continent Landmasses (Green/Brown)
  const drawLandBlob = (cx, cy, rx, ry, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
      const dist = (1 + (Math.sin(angle * 5) + Math.cos(angle * 3)) * 0.22);
      const px = cx + Math.cos(angle) * rx * dist;
      const py = cy + Math.sin(angle) * ry * dist;
      if (angle === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  // North America & South America
  drawLandBlob(280, 150, 110, 70, '#2d5a27');
  drawLandBlob(340, 320, 60, 110, '#386641');
  drawLandBlob(290, 180, 45, 35, '#8c7853'); // Desert / Rockies

  // Eurasia & Africa
  drawLandBlob(580, 140, 170, 75, '#2e6f40');
  drawLandBlob(540, 270, 85, 100, '#a37038'); // Sahara desert
  drawLandBlob(550, 360, 65, 80, '#2a6f4e'); // Central/South Africa
  drawLandBlob(680, 190, 75, 45, '#c29d5b'); // Gobi / Middle East

  // Australia
  drawLandBlob(820, 340, 65, 45, '#bc6c25');

  // Polar Ice Caps (Arctic and Antarctica)
  ctx.fillStyle = '#f8fafc';
  // North Pole
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 18, canvas.width / 2, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  // South Pole (Antarctica)
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height - 20, canvas.width / 2, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Earth Clouds Texture (Semi-transparent)
export function createEarthCloudsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';

  // Cloud bands and swirl clusters
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * canvas.width;
    const y = 30 + Math.random() * (canvas.height - 60);
    const rx = 40 + Math.random() * 80;
    const ry = 8 + Math.random() * 18;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 3. Realistic Mars Texture
export function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Rusty red base
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#9e2a2b');
  grad.addColorStop(0.3, '#c1440e');
  grad.addColorStop(0.7, '#d35400');
  grad.addColorStop(1, '#9e2a2b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark Basaltic Volcanic Plains (Syrtis Major & Acidalia)
  ctx.fillStyle = 'rgba(60, 25, 20, 0.45)';
  const drawDarkPlain = (x, y, rx, ry) => {
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += 0.25) {
      const rMod = 1 + Math.sin(a * 4) * 0.28;
      const px = x + Math.cos(a) * rx * rMod;
      const py = y + Math.sin(a) * ry * rMod;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  drawDarkPlain(450, 260, 110, 70); // Syrtis Major
  drawDarkPlain(220, 160, 130, 60); // Acidalia
  drawDarkPlain(750, 280, 90, 50);  // Sinus Sabaeus

  // Valles Marineris canyon scar
  ctx.strokeStyle = '#4a150e';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(260, 270);
  ctx.quadraticCurveTo(340, 280, 420, 265);
  ctx.stroke();

  // White Polar Ice Caps
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 14, canvas.width * 0.22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height - 14, canvas.width * 0.18, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 4. Realistic Moon Texture
export function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Lunar Regolith Base
  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark Basaltic Lunar Maria (Seas)
  ctx.fillStyle = '#5c5c5c';
  const maria = [
    { x: 180, y: 90, r: 48 }, // Mare Tranquillitatis
    { x: 120, y: 110, r: 55 }, // Oceanus Procellarum
    { x: 230, y: 120, r: 40 }, // Mare Fecunditatis
    { x: 160, y: 60, r: 35 }   // Mare Serenitatis
  ];
  maria.forEach(m => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Impact Craters with bright rims
  ctx.fillStyle = '#e0e0e0';
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 2 + Math.random() * 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r + 0.8, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 5. Realistic Jupiter Texture (Bands + Great Red Spot)
export function createJupiterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Alternating Gas Bands
  const bands = [
    '#f4e7d3', '#c99667', '#d8a977', '#ecd3b0', '#ab6d42',
    '#dfc09f', '#be7b4a', '#edd2b3', '#be7b4a', '#a65d34',
    '#ecd3b0', '#c99667', '#dfc09f', '#c99667', '#ecd3b0'
  ];

  const bandH = canvas.height / bands.length;
  bands.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandH, canvas.width, bandH + 2);
  });

  // Wave ripple disturbances between bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  for (let y = 0; y < canvas.height; y += 30) {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 15) {
      const dy = Math.sin(x * 0.05 + y) * 5;
      if (x === 0) ctx.moveTo(x, y + dy);
      else ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  // The Great Red Spot (Southern Hemisphere)
  const spotX = 640;
  const spotY = 320;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 52, 28, -0.05, 0, Math.PI * 2);
  ctx.fillStyle = '#b7410e';
  ctx.fill();

  // Red Spot inner whorl
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 34, 18, -0.05, 0, Math.PI * 2);
  ctx.fillStyle = '#d35400';
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 6. Realistic Saturn Texture & Semi-transparent Rings
export function createSaturnTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Golden beige pastel bands
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#d8be9b');
  grad.addColorStop(0.3, '#f2e3c6');
  grad.addColorStop(0.5, '#e5cca7');
  grad.addColorStop(0.7, '#f4e7d0');
  grad.addColorStop(1, '#cbb18a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export function createSaturnRingsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Concentric ring stripes with Cassini Division
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0.0, 'rgba(0,0,0,0)'); // Transparent inner hole
  grad.addColorStop(0.15, 'rgba(180, 160, 130, 0.4)'); // C ring
  grad.addColorStop(0.35, 'rgba(230, 210, 180, 0.85)'); // B ring (dense)
  grad.addColorStop(0.68, 'rgba(240, 220, 190, 0.9)'); // B ring outer
  grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.05)'); // Cassini Division gap!
  grad.addColorStop(0.74, 'rgba(0, 0, 0, 0.05)');
  grad.addColorStop(0.76, 'rgba(210, 190, 160, 0.75)'); // A ring
  grad.addColorStop(0.96, 'rgba(190, 170, 140, 0.5)'); // A ring outer
  grad.addColorStop(1.0, 'rgba(0,0,0,0)'); // Transparent outer boundary

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 7. Dynamic Sun Flare Texture
export function createSunTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Brilliant Yellow-Orange Plasma Base
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#ff7b00');
  grad.addColorStop(0.5, '#ffae00');
  grad.addColorStop(1, '#ff7b00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Solar flare granulations
  ctx.fillStyle = 'rgba(255, 235, 120, 0.25)';
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 4 + Math.random() * 12;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Darker Sunspots
  ctx.fillStyle = '#b7410e';
  for (let i = 0; i < 8; i++) {
    const x = 80 + Math.random() * (canvas.width - 160);
    const y = 60 + Math.random() * (canvas.height - 120);
    ctx.beginPath();
    ctx.arc(x, y, 4 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

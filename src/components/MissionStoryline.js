/**
 * Mission Storyline — Cinematic Overhaul
 * Features: hero image parallax, stagger-animated cards, image gallery,
 * typewriter facts, live telemetry, animated instrument tree, and 3D inspector.
 */

import * as THREE from 'three';
import { createRelicModel, highlightPart } from './Craft3DModels.js';
import { soundFX } from './AudioEffects.js';
import { formatNumberWithCommas, calculateCurrentTelemetry } from '../utils/orbitalMath.js';

export class MissionStoryline {
  constructor(containerElement, onFlyToCallback, onAwardBadgeCallback) {
    this.container = containerElement;
    this.onFlyTo = onFlyToCallback;
    this.onAwardBadge = onAwardBadgeCallback;
    this.currentRelic = null;
    this.miniScene = null;
    this.miniCamera = null;
    this.miniRenderer = null;
    this.miniModelGroup = null;
    this.miniAnimId = null;
    this.isDraggingModel = false;
    this.prevMousePos = { x: 0, y: 0 };
    this._telemetryInterval = null;
    this._typewriterTimeout = null;
  }

  open(relic) {
    this.currentRelic = relic;
    soundFX.playClick();

    if (this.onAwardBadge && relic.badgeAwarded) {
      this.onAwardBadge(relic.badgeAwarded);
    }

    this.render();
    this.container.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Stagger card animations in after draw
    requestAnimationFrame(() => {
      const cards = this.container.querySelectorAll('.flow-card, .storyline-hero-banner, .gallery-strip');
      cards.forEach((el, i) => {
        el.style.animationDelay = `${i * 80}ms`;
        el.classList.add('card-animate-in');
      });
    });

    this.init3DInspector(relic.modelType);
    this._startLiveTelemetry(relic);
    this._runTypewriter(relic);
  }

  close() {
    soundFX.playClick();
    soundFX.stopCurrentAudio();
    this.destroy3DInspector();
    this._stopLiveTelemetry();
    clearTimeout(this._typewriterTimeout);
    this.container.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── Live Telemetry Ticker ───────────────────────────────────────── */
  _startLiveTelemetry(relic) {
    this._stopLiveTelemetry();
    const update = () => {
      const el = this.container.querySelector('#live-distance-val');
      if (!el) return;
      const t = calculateCurrentTelemetry(relic, 0);
      el.textContent = `${formatNumberWithCommas(Math.round(t.distanceKm))} km (${t.distanceAU.toFixed(3)} AU)`;
    };
    update();
    this._telemetryInterval = setInterval(update, 2000);
  }

  _stopLiveTelemetry() {
    if (this._telemetryInterval) {
      clearInterval(this._telemetryInterval);
      this._telemetryInterval = null;
    }
  }

  /* ── Typewriter Effect on Fun Fact ──────────────────────────────── */
  _runTypewriter(relic) {
    const el = this.container.querySelector('#typewriter-fact');
    if (!el || !relic.funFact) return;
    el.textContent = '';
    const chars = relic.funFact.split('');
    let i = 0;
    const tick = () => {
      if (i < chars.length) {
        el.textContent += chars[i++];
        this._typewriterTimeout = setTimeout(tick, 22);
      } else {
        el.classList.add('typewriter-done');
      }
    };
    tick();
  }

  /* ── 3D Inspector ─────────────────────────────────────────────── */
  init3DInspector(modelType) {
    const canvasWrap = this.container.querySelector('#storyline-3d-canvas-wrap');
    if (!canvasWrap) return;

    const width = canvasWrap.clientWidth || 380;
    const height = 220;

    this.miniScene = new THREE.Scene();
    this.miniCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.miniCamera.position.set(0, 2.5, 6.5);
    this.miniCamera.lookAt(0, 0.5, 0);

    this.miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.miniRenderer.setSize(width, height);
    this.miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.miniRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.miniRenderer.toneMappingExposure = 1.2;
    canvasWrap.appendChild(this.miniRenderer.domElement);

    // Studio lighting
    this.miniScene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0x00f0ff, 3.0);
    key.position.set(5, 8, 5);
    this.miniScene.add(key);
    const fill = new THREE.DirectionalLight(0xffb703, 1.5);
    fill.position.set(-5, -3, -3);
    this.miniScene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(0, -5, -8);
    this.miniScene.add(rim);

    // Subtle grid floor
    const gridHelper = new THREE.GridHelper(12, 12, 0x003355, 0x003355);
    gridHelper.position.y = -2.2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    this.miniScene.add(gridHelper);

    this.miniModelGroup = createRelicModel(modelType);
    this.miniScene.add(this.miniModelGroup);

    // Drag to rotate
    canvasWrap.addEventListener('mousedown', (e) => {
      this.isDraggingModel = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
      canvasWrap.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.isDraggingModel || !this.miniModelGroup) return;
      const dx = e.clientX - this.prevMousePos.x;
      const dy = e.clientY - this.prevMousePos.y;
      this.miniModelGroup.rotation.y += dx * 0.01;
      this.miniModelGroup.rotation.x += dy * 0.01;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => {
      this.isDraggingModel = false;
      if (canvasWrap) canvasWrap.style.cursor = 'grab';
    });

    const animateMini = () => {
      this.miniAnimId = requestAnimationFrame(animateMini);
      if (!this.isDraggingModel && this.miniModelGroup) {
        this.miniModelGroup.rotation.y += 0.005;
      }
      this.miniRenderer.render(this.miniScene, this.miniCamera);
    };
    animateMini();
  }

  destroy3DInspector() {
    if (this.miniAnimId) {
      cancelAnimationFrame(this.miniAnimId);
      this.miniAnimId = null;
    }
    if (this.miniRenderer?.domElement) {
      this.miniRenderer.domElement.remove();
      this.miniRenderer.dispose();
      this.miniRenderer = null;
    }
    this.miniScene = null;
    this.miniModelGroup = null;
  }

  /* ── Render ───────────────────────────────────────────────────── */
  render() {
    const relic = this.currentRelic;
    if (!relic) return;
    const s = relic.storyLine;
    const t = calculateCurrentTelemetry(relic, 0);
    const heroColor = relic.heroColor || '#0b3d91';

    const galleryHTML = (relic.galleryImages && relic.galleryImages.length)
      ? `<div class="gallery-strip">
          ${relic.galleryImages.map((img, i) => `
            <div class="gallery-item" data-src="${img.url}" data-caption="${img.caption}" style="animation-delay:${i * 120}ms">
              <img src="${img.url}" alt="${img.caption}" loading="lazy" onerror="this.parentElement.style.display='none'" />
              <div class="gallery-caption">${img.caption}</div>
              <div class="gallery-zoom-icon">🔍</div>
            </div>
          `).join('')}
        </div>`
      : '';

    this.container.innerHTML = `
      <div class="storyline-backdrop" id="storyline-backdrop"></div>
      <div class="storyline-drawer">
        <button class="storyline-close-btn" id="storyline-close-btn" aria-label="Close">✕</button>

        <!-- ── CINEMATIC HERO BANNER ── -->
        <div class="storyline-hero-banner" style="--hero-color:${heroColor}">
          ${relic.heroImage
            ? `<img class="hero-bg-img" src="${relic.heroImage}" alt="${relic.name}" loading="eager" onerror="this.style.display='none'" />`
            : ''
          }
          <div class="hero-gradient-overlay" style="--hero-color:${heroColor}"></div>
          <div class="hero-text-block">
            <div class="storyline-domain-badge">${relic.domainLabel}</div>
            <h2 class="storyline-title">${relic.name}</h2>
            <div class="hero-meta-row">
              <span class="hero-meta-chip">📍 ${relic.location}</span>
              <span class="hero-meta-chip status-chip ${relic.statusClass}">${relic.statusLabel}</span>
            </div>
          </div>
          <!-- Floating particle sparks -->
          <div class="hero-particles">
            ${Array.from({length: 18}, (_, i) => `<span class="hero-spark" style="left:${Math.random()*100}%;animation-delay:${(Math.random()*3).toFixed(1)}s;animation-duration:${(2+Math.random()*3).toFixed(1)}s"></span>`).join('')}
          </div>
        </div>

        <!-- ── 3D INTERACTIVE INSPECTOR ── -->
        <div class="storyline-model-section">
          <div class="model-header-row">
            <span class="model-title">⬡ 3D HARDWARE INSPECTOR</span>
            <span class="model-hint">Drag to rotate · Real-time render</span>
          </div>
          <div id="storyline-3d-canvas-wrap" class="storyline-3d-canvas-wrap"></div>
        </div>

        <!-- ── VERTICAL CINEMATIC FLOW ── -->
        <div class="storyline-flow-container" id="storyline-flow">

          <!-- LAUNCH -->
          <div class="flow-step">
            <div class="flow-year-node" style="--node-color:${heroColor}">${s.launch.year}</div>
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card launch-card">
              <div class="card-icon-title">
                <span class="step-icon">🚀</span>
                <span class="step-title">Launched: ${relic.launchDate}</span>
              </div>
              <p class="step-desc">${s.launch.desc}</p>
            </div>
          </div>

          <div class="flow-connector-line"><span class="flow-pulse-dot"></span></div>

          <!-- ARRIVAL -->
          <div class="flow-step">
            <div class="flow-year-node" style="--node-color:${heroColor}">${s.arrival.year}</div>
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card arrival-card">
              <div class="card-icon-title">
                <span class="step-icon">🎯</span>
                <span class="step-title">${s.arrival.title}</span>
              </div>
              <div class="step-subtitle">${relic.arrivalDate} — ${relic.arrivalEvent}</div>
              <p class="step-desc">${s.arrival.desc}</p>
            </div>
          </div>

          <div class="flow-connector-line"><span class="flow-pulse-dot"></span></div>

          <!-- HARDWARE -->
          <div class="flow-step">
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card highlight-card">
              <div class="card-icon-title">
                <span class="step-icon">${s.hardware.icon}</span>
                <span class="step-title">${s.hardware.title}</span>
              </div>
              <p class="step-desc">${s.hardware.desc}</p>
              ${galleryHTML}
            </div>
          </div>

          <div class="flow-connector-line"><span class="flow-pulse-dot"></span></div>

          <!-- INSTRUMENTS — INTERACTIVE SPEC & 3D HARDWARE EXPLORER -->
          <div class="flow-step">
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card instrument-section-card">
              <div class="card-icon-title">
                <span class="step-icon">🔬</span>
                <span class="step-title">Scientific Instruments & Subsystems</span>
              </div>

              ${(s.hardware?.instrumentsHeroImage || s.instrumentsHeroImage) ? `
              <div class="inst-hero-img-wrap">
                <img class="inst-hero-img" src="${s.hardware?.instrumentsHeroImage || s.instrumentsHeroImage}" alt="${relic.shortName} hardware" loading="lazy" onerror="this.parentElement.style.display='none'" />
                <div class="inst-hero-vignette"></div>
                <div class="inst-hero-label">${s.hardware?.title || 'Flight Hardware & Instruments'}</div>
              </div>` : ''}

              <!-- Tab Bar -->
              <div class="inst-tab-bar" id="inst-tab-bar-${relic.id}">
                ${s.instruments.map((grp, gIdx) => `
                  <button class="inst-tab-btn${gIdx === 0 ? ' active' : ''}" data-group="${gIdx}" id="inst-tab-${relic.id}-${gIdx}">
                    <span class="inst-tab-icon">${grp.icon}</span>
                    <span class="inst-tab-label">${grp.group}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Card Grids (one per group) -->
              ${s.instruments.map((grp, gIdx) => `
              <div class="inst-card-grid${gIdx === 0 ? ' active' : ''}" id="inst-grid-${relic.id}-${gIdx}">
                ${grp.items.map((item, iIdx) => `
                  <div class="inst-card" data-group="${gIdx}" data-item="${iIdx}"
                       data-partkey="${item.partKey || ''}"
                       style="animation-delay:${iIdx * 80}ms">
                    <div class="inst-card-img-wrap">
                      ${item.image
                        ? `<img class="inst-card-img" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.classList.add('no-img');" />
                           <div class="inst-card-img-shimmer"></div>`
                        : `<div class="inst-card-no-img">${grp.icon}</div>`
                      }
                      ${item.partKey ? `<span class="inst-card-part-pill">3D: ${item.partKey}</span>` : ''}
                    </div>
                    <div class="inst-card-body">
                      <div class="inst-card-name">${item.name}</div>
                      <div class="inst-card-desc">${item.desc}</div>
                      ${item.specs ? `
                      <div class="inst-card-specs-row">
                        ${Object.entries(item.specs).slice(0, 2).map(([k, v]) =>
                          `<span class="inst-spec-chip"><span class="chip-k">${k.replace(/_/g,' ')}:</span> <span class="chip-v">${v}</span></span>`
                        ).join('')}
                      </div>` : ''}
                    </div>
                    <div class="inst-card-cta">
                      <span>${item.partKey ? '🎯 Inspect 3D & Specs' : '🔍 Full Specs'}</span>
                      <span class="cta-arrow">→</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              `).join('')}

              <!-- Slide-In Detail Panel -->
              <div class="inst-detail-panel" id="inst-detail-panel-${relic.id}">
                <div class="inst-detail-header-bar">
                  <span class="inst-detail-badge">🔬 Instrument Specifications & 3D Focus</span>
                  <button class="inst-detail-close" id="inst-detail-close-${relic.id}">✕ Close Detail</button>
                </div>
                <div class="inst-detail-inner" id="inst-detail-inner-${relic.id}"></div>
              </div>

            </div>
          </div>

          <div class="flow-connector-line"><span class="flow-pulse-dot"></span></div>

          <!-- SCIENCE -->
          <div class="flow-step">
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card science-card">
              <div class="card-icon-title">
                <span class="step-icon">🧪</span>
                <span class="step-title">Science Made Possible</span>
              </div>
              <div class="science-breakthrough-title">${s.science.title}</div>
              <p class="step-desc">${s.science.desc}</p>
            </div>
          </div>

          <div class="flow-connector-line"><span class="flow-pulse-dot"></span></div>

          <!-- STATUS + LIVE TELEMETRY -->
          <div class="flow-step">
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card status-card">
              <div class="card-icon-title">
                <span class="step-icon">📡</span>
                <span class="step-title">Current Mission Status (2026)</span>
                <span class="status-live-tag ${relic.statusClass}">${relic.statusLabel}</span>
              </div>
              <p class="step-desc">${s.currentStatus.desc}</p>
              <div class="live-telemetry-block">
                <div class="telem-header">
                  <span class="telem-dot"></span>
                  <span>LIVE TELEMETRY FEED</span>
                </div>
                <div class="telem-grid">
                  <div class="telem-item">
                    <span class="telem-label">DISTANCE FROM EARTH</span>
                    <span class="telem-value" id="live-distance-val">${formatNumberWithCommas(Math.round(t.distanceKm))} km</span>
                  </div>
                  <div class="telem-item">
                    <span class="telem-label">LIGHT TRAVEL TIME</span>
                    <span class="telem-value">${t.lightTimeString}</span>
                  </div>
                  <div class="telem-item">
                    <span class="telem-label">MISSION AGE</span>
                    <span class="telem-value">${2026 - relic.launchYear} years aloft</span>
                  </div>
                  <div class="telem-item">
                    <span class="telem-label">SPEED</span>
                    <span class="telem-value">${relic.speedKmS.toLocaleString()} km/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flow-connector-line"><span class="flow-pulse-dot"></span></div>

          <!-- FUN FACT TERMINAL -->
          ${relic.funFact ? `
          <div class="flow-step">
            <div class="flow-arrow-down">↓</div>
            <div class="flow-card fun-fact-card">
              <div class="card-icon-title">
                <span class="step-icon">💡</span>
                <span class="step-title">Mind-Blowing Fact</span>
              </div>
              <div class="fun-fact-terminal">
                <span class="terminal-prompt">&gt;&gt; </span><span id="typewriter-fact" class="typewriter-text"></span><span class="typewriter-cursor">|</span>
              </div>
            </div>
          </div>` : ''}

        </div><!-- end flow -->

        <!-- Action Bar -->
        <div class="storyline-action-bar">
          <button class="storyline-btn audio-btn" id="storyline-play-sound-btn">
            <span>🔊</span> Mission Audio
          </button>
          <button class="storyline-btn fly-btn" id="storyline-fly-camera-btn">
            <span>🎯</span> Track in 3D Solar System
          </button>
        </div>
      </div>

      <!-- LIGHTBOX -->
      <div class="img-lightbox" id="img-lightbox" style="display:none">
        <div class="lightbox-backdrop" id="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" id="lightbox-close">✕</button>
          <img id="lightbox-img" src="" alt="" />
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
      </div>
    `;

    /* ── Event Listeners ──────────────────────────────────────────── */
    this.container.querySelector('#storyline-close-btn').addEventListener('click', () => this.close());
    this.container.querySelector('#storyline-backdrop').addEventListener('click', () => this.close());

    /* ── Instrument Tabs ─────────────────────────────────────────── */
    const tabBar = this.container.querySelector(`#inst-tab-bar-${relic.id}`);
    if (tabBar) {
      tabBar.querySelectorAll('.inst-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const gIdx = btn.dataset.group;
          // Deactivate all tabs and grids
          tabBar.querySelectorAll('.inst-tab-btn').forEach(b => b.classList.remove('active'));
          this.container.querySelectorAll('.inst-card-grid').forEach(g => g.classList.remove('active'));
          // Activate selected
          btn.classList.add('active');
          const grid = this.container.querySelector(`#inst-grid-${relic.id}-${gIdx}`);
          if (grid) grid.classList.add('active');
          // Close detail panel when switching tabs
          const panel = this.container.querySelector(`#inst-detail-panel-${relic.id}`);
          if (panel) { panel.classList.remove('open'); highlightPart(this.miniModelGroup, null); }
          this.container.querySelectorAll('.inst-card').forEach(c => c.classList.remove('card-selected'));
        });
      });
    }

    /* ── Instrument Card Click → Detail Panel & 3D Focus ─────────── */
    this.container.querySelectorAll('.inst-card').forEach(card => {
      card.addEventListener('click', () => {
        const gIdx = parseInt(card.dataset.group);
        const iIdx = parseInt(card.dataset.item);
        const partKey = card.dataset.partkey;
        const item = s.instruments[gIdx].items[iIdx];
        const panel = this.container.querySelector(`#inst-detail-panel-${relic.id}`);
        const inner = this.container.querySelector(`#inst-detail-inner-${relic.id}`);
        if (!panel || !inner) return;

        // Card selection styling
        this.container.querySelectorAll('.inst-card').forEach(c => c.classList.remove('card-selected'));
        card.classList.add('card-selected');

        const specsHTML = item.specs
          ? Object.entries(item.specs).map(([k, v]) =>
              `<div class="inst-spec-row"><span class="inst-spec-key">${k.replace(/_/g, ' ')}</span><span class="inst-spec-val">${v}</span></div>`
            ).join('')
          : '';

        inner.innerHTML = `
          ${item.image ? `<div class="inst-detail-img-wrap"><img src="${item.image}" alt="${item.name}" onerror="this.parentElement.style.display='none'" /></div>` : ''}
          <div class="inst-detail-content">
            <div class="inst-detail-name">${item.name}</div>
            <p class="inst-detail-desc">${item.desc}</p>
            ${specsHTML ? `
            <div class="inst-specs-grid">
              <div class="inst-specs-title">⚙️ Engineering Specifications</div>
              ${specsHTML}
            </div>` : ''}
            ${partKey ? `<div class="inst-detail-part-tag">🎯 Active 3D Component: <code>${partKey}</code> (Glowing on 3D model above)</div>` : ''}
          </div>
        `;

        // Open the panel
        panel.classList.add('open');

        // Highlight and orient the 3D model part
        highlightPart(this.miniModelGroup, partKey || null);
        if (this.miniModelGroup && partKey) {
          if (partKey === 'mast') {
            this.miniModelGroup.rotation.y = 0.3;
            this.miniModelGroup.rotation.x = 0.15;
          } else if (partKey === 'arm') {
            this.miniModelGroup.rotation.y = -0.7;
            this.miniModelGroup.rotation.x = 0.2;
          } else if (partKey === 'chassis' || partKey === 'base') {
            this.miniModelGroup.rotation.y = 0.8;
            this.miniModelGroup.rotation.x = 0.35;
          } else if (partKey === 'antenna' || partKey === 'dish') {
            this.miniModelGroup.rotation.y = 0.0;
            this.miniModelGroup.rotation.x = -0.2;
          } else if (partKey === 'mirror') {
            this.miniModelGroup.rotation.y = 0.0;
            this.miniModelGroup.rotation.x = 0.0;
          } else if (partKey === 'shield') {
            this.miniModelGroup.rotation.y = 3.14;
            this.miniModelGroup.rotation.x = 0.1;
          }
        }

        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    /* ── Close Detail Panel ─────────────────────────────────────── */
    const detailClose = this.container.querySelector(`#inst-detail-close-${relic.id}`);
    if (detailClose) {
      detailClose.addEventListener('click', () => {
        const panel = this.container.querySelector(`#inst-detail-panel-${relic.id}`);
        if (panel) panel.classList.remove('open');
        this.container.querySelectorAll('.inst-card').forEach(c => c.classList.remove('card-selected'));
        highlightPart(this.miniModelGroup, null);
      });
    }

    // Sound
    const soundBtn = this.container.querySelector('#storyline-play-sound-btn');
    soundBtn.addEventListener('click', () => {
      soundFX.playRelicAudio(relic.audioSimulation);
      soundBtn.innerHTML = '<span>📡</span> Transmitting…';
      setTimeout(() => { soundBtn.innerHTML = '<span>🔊</span> Mission Audio'; }, 3000);
    });

    // Fly to
    this.container.querySelector('#storyline-fly-camera-btn').addEventListener('click', () => {
      if (this.onFlyTo) this.onFlyTo(relic.id);
      this.close();
    });

    // Gallery lightbox
    const lb = this.container.querySelector('#img-lightbox');
    this.container.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src;
        const cap = item.dataset.caption;
        this.container.querySelector('#lightbox-img').src = src;
        this.container.querySelector('#lightbox-caption').textContent = cap;
        lb.style.display = 'flex';
        requestAnimationFrame(() => lb.classList.add('lb-open'));
      });
    });

    const closeLb = () => {
      lb.classList.remove('lb-open');
      setTimeout(() => { lb.style.display = 'none'; }, 300);
    };
    this.container.querySelector('#lightbox-close').addEventListener('click', closeLb);
    this.container.querySelector('#lightbox-backdrop').addEventListener('click', closeLb);

    // Parallax hero on scroll
    const flow = this.container.querySelector('#storyline-flow');
    const hero = this.container.querySelector('.storyline-hero-banner .hero-bg-img');
    if (flow && hero) {
      flow.addEventListener('scroll', () => {
        const offset = flow.scrollTop * 0.3;
        hero.style.transform = `translateY(${offset}px) scale(1.12)`;
      });
    }

    // ESC key
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        this.close();
        window.removeEventListener('keydown', onEsc);
      }
    };
    window.addEventListener('keydown', onEsc);
  }
}

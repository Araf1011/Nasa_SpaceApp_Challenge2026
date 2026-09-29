const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

let emptyLeftPanelStr = `<div class="storyline-left-panel" style="position: absolute; top: 0; left: 0; width: 55vw; height: 100vh; overflow-y: auto; z-index: 10; pointer-events: auto; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column;">
  
  <div class="sticky-group" style="position: sticky; top: 20px; display: flex; flex-direction: column; gap: 20px; z-index: 1;">
    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      ___HERO___
    </div>

    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      ___3D___
    </div>
  </div>

  <div class="scroll-spacer" style="height: 80vh; flex-shrink: 0;"></div>
  
  <div class="scrolling-video-group" style="position: relative; z-index: 2; margin-bottom: 20vh;">
    ___VIDEO___
  </div>
</div>`;

// Wait, the actual HTML has the real blocks instead of ___HERO___, ___3D___, ___VIDEO___.
// Since we have the exact HTML currently, we can extract them using regex or substring.

let leftPanelStart = code.indexOf(`<div class="storyline-left-panel"`);
let drawerStart = code.indexOf(`<div class="storyline-drawer">`);

if (leftPanelStart !== -1 && drawerStart !== -1) {
  let leftPanelCode = code.substring(leftPanelStart, drawerStart);
  
  let heroStart = leftPanelCode.indexOf(`<!-- ── CINEMATIC HERO BANNER ── -->`);
  let inspectStart = leftPanelCode.indexOf(`<!-- ── 3D INTERACTIVE INSPECTOR ── -->`);
  let videoRegex = /\\$\\{relic\\.videoEmbed \\? \\`[\\s\\S]*?\\` : ""\\}/;
  
  let heroBlock = "";
  let inspectBlock = "";
  let videoBlock = "";
  
  if (heroStart !== -1 && inspectStart !== -1) {
    heroBlock = leftPanelCode.substring(heroStart, leftPanelCode.indexOf(`</div>`, leftPanelCode.lastIndexOf(`hero-particles`)) + 30);
    // Actually finding the exact end of heroBlock is tricky by index. Let's use a smarter split.
    
    // The Hero block is inside the first glass-panel.
    let heroEnd = leftPanelCode.indexOf(`</div>\n\n        \n    </div>\n\n    <div class="glass-panel"`, heroStart);
    if(heroEnd !== -1) heroBlock = leftPanelCode.substring(heroStart, heroEnd);
    else {
      // fallback just matching up to the next glass-panel start
      let nextGlass = leftPanelCode.indexOf(`<div class="glass-panel"`, heroStart);
      heroBlock = leftPanelCode.substring(heroStart, nextGlass).trim();
      if(heroBlock.endsWith('</div>\n\n        \n    </div>')) {
         heroBlock = heroBlock.replace(/<\/div>\\s*<\/div>$/, '');
      }
    }
  }

  // We can just use the known original templates! They haven't changed except for styling.
  
  let newHero = `<!-- ── CINEMATIC HERO BANNER ── -->
        <div class="storyline-hero-banner" style="--hero-color:\${heroColor}">
          \${relic.heroImage
            ? \`<img class="hero-bg-img" src="\${relic.heroImage}" alt="\${relic.name}" loading="eager" onerror="this.style.display='none'" />\`
            : ''
          }
          <div class="hero-gradient-overlay" style="--hero-color:\${heroColor}"></div>
          <div class="hero-text-block">
            <div class="storyline-domain-badge">\${relic.domainLabel}</div>
            <h2 class="storyline-title">\${relic.name}</h2>
            <div class="hero-meta-row">
              <span class="hero-meta-chip">📍 \${relic.location}</span>
              <span class="hero-meta-chip status-chip \${relic.statusClass}">\${relic.statusLabel}</span>
            </div>
          </div>
          <!-- Floating particle sparks -->
          <div class="hero-particles">
            \${Array.from({length: 18}, (_, i) => \`<span class="hero-spark" style="left:\${Math.random()*100}%;animation-delay:\${(Math.random()*3).toFixed(1)}s;animation-duration:\${(2+Math.random()*3).toFixed(1)}s"></span>\`).join('')}
          </div>
        </div>`;

  let new3D = `<!-- ── 3D INTERACTIVE INSPECTOR ── -->
        <div class="storyline-model-section">
          <div class="model-header-row">
            <span class="model-title">⬡ 3D HARDWARE INSPECTOR</span>
            <span class="model-hint">Drag to rotate · Real-time render</span>
          </div>
          <div id="storyline-3d-canvas-wrap" class="storyline-3d-canvas-wrap" style="height: 65vh !important; min-height: 500px;"></div>
        </div>`;

  let newVideo = `\${relic.videoEmbed ? \`
    <div class="glass-panel" style="background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 16px; padding: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0,240,255,0.2);">
      <div class="card-icon-title" style="margin-bottom: 12px; font-weight: bold; font-size: 1.1rem; color: #fff;">
        <span class="step-icon">🎥</span>
        <span class="step-title">\${relic.videoTitle || "View Through the Spacecraft Lens"}</span>
      </div>
      <div class="video-wrapper">
        <iframe
          src="\${relic.videoEmbed}"
          title="\${relic.videoTitle || relic.name + ' Video'}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
          style="width: 100%; height: 400px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"
        ></iframe>
      </div>
    </div>\` : ""}`;

  let newLeftPanel = `<div class="storyline-left-panel" style="position: absolute; top: 0; left: 0; width: 55vw; height: 100vh; overflow-y: auto; overflow-x: hidden; z-index: 10; pointer-events: auto; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column;">
  
  <!-- HERO (Sticks at top, bottom layer) -->
  <div class="hero-curtain" style="position: sticky; top: 20px; z-index: 1;">
    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      \${newHero}
    </div>
  </div>

  <div class="scroll-spacer" style="height: 70vh; flex-shrink: 0;"></div>

  <!-- 3D HARDWARE (Scrolls over Hero, then sticks at top) -->
  <div class="3d-curtain" style="position: sticky; top: 20px; z-index: 2; margin-bottom: 20px;">
    <div class="glass-panel" style="background: rgba(12, 20, 38, 0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(0, 255, 170, 0.3); border-radius: 16px; padding: 20px; box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 255, 170, 0.1);">
      \${new3D}
    </div>
  </div>

  <div class="scroll-spacer" style="height: 70vh; flex-shrink: 0;"></div>
  
  <!-- VIDEO (Scrolls over 3D) -->
  <div class="scrolling-video-group" style="position: relative; z-index: 3; margin-bottom: 20vh; box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);">
    \${newVideo}
  </div>

</div>\n      `;

  code = code.substring(0, leftPanelStart) + newLeftPanel + code.substring(drawerStart);
  fs.writeFileSync("src/components/MissionStoryline.js", code);
  console.log("Success");
} else {
  console.log("Failed to find boundaries");
}

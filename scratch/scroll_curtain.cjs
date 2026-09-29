const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

let newBackdrop = `<div class="storyline-backdrop" id="storyline-backdrop" style="background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; pointer-events: none;"></div>
<div class="storyline-left-panel" style="position: absolute; top: 0; left: 0; width: 55vw; height: 100vh; overflow-y: auto; z-index: 10; pointer-events: auto; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column;">
  
  <div class="sticky-group" style="position: sticky; top: 20px; display: flex; flex-direction: column; gap: 20px; z-index: 1;">
    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      ___HERO___
    </div>

    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      ___3D___
    </div>
  </div>

  <div class="scroll-spacer" style="height: 80vh; flex-shrink: 0;"></div>
  
  <div class="scrolling-video-group" style="position: relative; z-index: 2; margin-bottom: 40vh;">
    ___VIDEO___
  </div>
</div>`;

code = code.replace(/<div class="storyline-backdrop" id="storyline-backdrop"><\/div>/, newBackdrop);

// Extract Hero
let heroStart = code.indexOf(`<!-- ── CINEMATIC HERO BANNER ── -->`);
let heroEnd = code.indexOf(`<!-- ── 3D INTERACTIVE INSPECTOR ── -->`);
if (heroStart !== -1 && heroEnd !== -1) {
  let heroBlock = code.substring(heroStart, heroEnd);
  code = code.slice(0, heroStart) + code.slice(heroEnd);
  code = code.replace("___HERO___", heroBlock);
}

// Extract 3D Inspector
let inspectStart = code.indexOf(`<!-- ── 3D INTERACTIVE INSPECTOR ── -->`);
let inspectEnd = code.indexOf(`<!-- ── VERTICAL CINEMATIC FLOW ── -->`);
if (inspectStart !== -1 && inspectEnd !== -1) {
  let inspectBlock = code.substring(inspectStart, inspectEnd);
  code = code.slice(0, inspectStart) + code.slice(inspectEnd);
  code = code.replace("___3D___", inspectBlock);
}

// Extract Video (regex)
let videoRegex = /\s*<!-- ── NEW: EMBEDDED VIDEO ── -->[\s\S]*?(?=<!-- ── NEW: CONSTRUCTION & CREATION ── -->)/;
let videoMatch = code.match(videoRegex);
if (videoMatch) {
  let vBlock = videoMatch[0];
  code = code.replace(vBlock, "");
  
  let newVBlock = `\${relic.videoEmbed ? \`
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
    
  code = code.replace("___VIDEO___", newVBlock);
} else {
  code = code.replace("___VIDEO___", "");
}

fs.writeFileSync("src/components/MissionStoryline.js", code);
console.log("Done");

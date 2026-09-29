const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

// 1. We replace the backdrop with transparent one, and open a left panel wrapper
let newBackdrop = `<div class="storyline-backdrop" id="storyline-backdrop" style="background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; display: flex; padding: 20px; box-sizing: border-box; justify-content: flex-start; pointer-events: none;">
  <div class="storyline-left-panel" style="flex: 1; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; max-width: 60vw; z-index: 10; pointer-events: auto;">
    
    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      ___HERO___
    </div>

    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      ___3D___
    </div>
    
    ___VIDEO___
    
  </div>
</div>`;

code = code.replace(/<div class="storyline-backdrop" id="storyline-backdrop"><\/div>/, newBackdrop);

// Extract Hero (avoiding regex for exact match)
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

// Extract Video
let videoStartStr = `<!-- ── NEW: EMBEDDED VIDEO ── -->`;
let videoEndStr = `<!-- ── NEW: CONSTRUCTION & CREATION ── -->`;
let videoStart = code.indexOf(videoStartStr);
let videoEnd = code.indexOf(videoEndStr);

if (videoStart !== -1 && videoEnd !== -1) {
  // Find the start of the ${relic.videoEmbed} block which is right above the comment or near it
  // Actually the block is:
  //           <!-- ── NEW: EMBEDDED VIDEO ── -->
  //           ${relic.videoEmbed ? ` ... ` : ''}
  
  // Let's just use a simple regex for this block
  let videoRegex = /\s*<!-- ── NEW: EMBEDDED VIDEO ── -->[\s\S]*?(?=<!-- ── NEW: CONSTRUCTION & CREATION ── -->)/;
  let videoMatch = code.match(videoRegex);
  if (videoMatch) {
    let vBlock = videoMatch[0];
    code = code.replace(vBlock, "");
    
    let newVBlock = `\${relic.videoEmbed ? \`
    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      <div class="card-icon-title">
        <span class="step-icon">🎥</span>
        <span class="step-title">\${relic.videoTitle || "View Through the Spacecraft Lens"}</span>
      </div>
      <div class="video-wrapper mt-2">
        <iframe
          src="\${relic.videoEmbed}"
          title="\${relic.videoTitle || relic.name + " Video"}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
          style="width: 100%; height: 350px; border-radius: 12px; border: none;"
        ></iframe>
      </div>
    </div>\` : ""}`;
      
    code = code.replace("___VIDEO___", newVBlock);
  } else {
    code = code.replace("___VIDEO___", "");
  }
} else {
  code = code.replace("___VIDEO___", "");
}

fs.writeFileSync("src/components/MissionStoryline.js", code);
console.log("Done");

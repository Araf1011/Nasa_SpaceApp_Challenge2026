const fs = require("fs");
let content = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

// We need to replace the start of container.innerHTML and move elements.
// Instead of complex string manipulation, let s do it via split / regex.

// 1. Remove blur from backdrop
content = content.replace(
  `<div class="storyline-backdrop" id="storyline-backdrop"></div>`,
  `<div class="storyline-backdrop" id="storyline-backdrop" style="background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; display: flex; padding: 20px; box-sizing: border-box;">
        <div class="storyline-left-panel" style="flex: 1; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; z-index: 10; pointer-events: auto; max-width: 65vw;">
          
          <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
            <!-- HERO BANNER MOVED HERE -->
            ___HERO___
          </div>
          
          <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
            <!-- 3D INSPECTOR MOVED HERE -->
            ___3D___
          </div>
          
          ___VIDEO___
        </div>
      </div>`
);

// 2. Extract Hero Banner
const heroRegex = /<!-- -- CINEMATIC HERO BANNER -- -->[\s\S]*?(?=<!-- -- 3D INTERACTIVE INSPECTOR -- -->)/;
const heroMatch = content.match(heroRegex);
if(heroMatch) {
  content = content.replace(heroMatch[0], "");
  content = content.replace("___HERO___", heroMatch[0]);
}

// 3. Extract 3D Inspector
const inspectorRegex = /<!-- -- 3D INTERACTIVE INSPECTOR -- -->[\s\S]*?(?=<!-- -- VERTICAL CINEMATIC FLOW -- -->)/;
const inspectorMatch = content.match(inspectorRegex);
if(inspectorMatch) {
  content = content.replace(inspectorMatch[0], "");
  content = content.replace("___3D___", inspectorMatch[0]);
}

// 4. Extract Video Embed
const videoRegex = /\s*<!-- -- NEW: EMBEDDED VIDEO -- -->[\s\S]*?(?=<!-- -- NEW: CONSTRUCTION & CREATION -- -->)/;
const videoMatch = content.match(videoRegex);
if(videoMatch) {
  content = content.replace(videoMatch[0], "");
  const videoStr = `\${relic.videoEmbed ? \`
          <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
            <div class="card-icon-title">
              <span class="step-icon">??</span>
              <span class="step-title">\${relic.videoTitle || "View Through the Spacecraft Lens"}</span>
            </div>
            <div class="video-wrapper mt-2">
              <iframe
                src="\${relic.videoEmbed}"
                title="\${relic.videoTitle || relic.name + " Video"}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
                style="width: 100%; height: 400px; border-radius: 12px; border: none;"
              ></iframe>
            </div>
          </div>\` : ""}`;
  content = content.replace("___VIDEO___", videoStr);
} else {
  content = content.replace("___VIDEO___", "");
}

fs.writeFileSync("src/components/MissionStoryline.js", content);
console.log("Updated MissionStoryline.js");


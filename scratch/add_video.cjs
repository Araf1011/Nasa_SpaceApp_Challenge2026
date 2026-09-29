const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

// The place we want to insert is right after:
// <div id="storyline-3d-canvas-wrap" class="storyline-3d-canvas-wrap"></div>
// </div>
// </div>

let insertAfterStr = `<div id="storyline-3d-canvas-wrap" class="storyline-3d-canvas-wrap"></div>
        </div>
    </div>`;

let insertIndex = code.indexOf(insertAfterStr);
if (insertIndex !== -1) {
  let videoStr = `
    <div class="glass-panel" style="background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
      \${relic.videoEmbed ? \`
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
            style="width: 100%; height: 350px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"
          ></iframe>
        </div>
      \` : \`<div style="text-align: center; color: #94a3b8; padding: 20px;">No video transmission available.</div>\`}
    </div>`;
    
  code = code.slice(0, insertIndex + insertAfterStr.length) + videoStr + code.slice(insertIndex + insertAfterStr.length);
  fs.writeFileSync("src/components/MissionStoryline.js", code);
  console.log("Video added back");
} else {
  console.log("Could not find insertion point for video");
}

const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

let lines = code.split("\n");
let idx = lines.findIndex(l => l.includes('id="storyline-3d-canvas-wrap"'));

if (idx !== -1) {
  // we want to insert after the two closing divs
  // line idx is <div id="storyline-3d-canvas-wrap" ...></div>
  // line idx + 1 is </div>
  // line idx + 2 is </div>
  
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
    
  lines.splice(idx + 4, 0, videoStr); // Insert after the closing divs
  
  fs.writeFileSync("src/components/MissionStoryline.js", lines.join("\n"));
  console.log("Added video");
} else {
  console.log("Could not find canvas line");
}

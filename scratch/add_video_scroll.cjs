const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

let emptyVideoGroup = `<div class="scrolling-video-group" style="position: relative; z-index: 2; margin-bottom: 40vh;">
    
  </div>`;

let filledVideoGroup = `<div class="scrolling-video-group" style="position: relative; z-index: 2; margin-bottom: 20vh;">
    \${relic.videoEmbed ? \`
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
    </div>\` : ""}
  </div>`;

code = code.replace(emptyVideoGroup, filledVideoGroup);
fs.writeFileSync("src/components/MissionStoryline.js", code);
console.log("Video added.");

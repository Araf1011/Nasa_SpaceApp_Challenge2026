const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");
let lines = code.split("\n");

let replacement = `    <div class="glass-panel interactive-media-panel" style="position: relative; overflow: hidden; background: rgba(10, 16, 32, 0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column;">
      <!-- ── 3D INTERACTIVE INSPECTOR ── -->
      <div class="storyline-model-section" style="flex: 1;">
        <div class="model-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <span class="model-title">⬡ 3D HARDWARE INSPECTOR</span>
            <span class="model-hint" style="margin-left: 10px;">Drag to rotate · Real-time render</span>
          </div>
          \${relic.videoEmbed ? \`
            <button class="toggle-video-btn" onclick="this.closest('.interactive-media-panel').classList.toggle('show-video')" style="background: rgba(0,240,255,0.15); border: 1px solid #00f0ff; color: #00f0ff; padding: 5px 12px; border-radius: 8px; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; transition: all 0.3s ease;">
              <span>🎥 Play Mission Video</span>
            </button>
          \` : ''}
        </div>
        <div id="storyline-3d-canvas-wrap" class="storyline-3d-canvas-wrap" style="width: 100%; height: 350px;"></div>
      </div>

      <!-- VIDEO CURTAIN -->
      \${relic.videoEmbed ? \`
      <div class="video-curtain" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 10, 24, 0.95); backdrop-filter: blur(16px); z-index: 20; transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; padding: 20px;">
        <div class="model-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <span class="step-icon">🎥</span>
            <span class="step-title" style="color: #fff; font-weight: bold; font-size: 1.1rem;">\${relic.videoTitle || "View Through the Spacecraft Lens"}</span>
          </div>
          <button class="toggle-video-btn" onclick="this.closest('.interactive-media-panel').classList.toggle('show-video')" style="background: rgba(244,63,94,0.15); border: 1px solid #f43f5e; color: #f43f5e; padding: 5px 12px; border-radius: 8px; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; transition: all 0.3s ease;">
            <span>✕ Close Video</span>
          </button>
        </div>
        <div class="video-wrapper" style="flex: 1; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <iframe
            src="\${relic.videoEmbed}"
            title="\${relic.videoTitle || relic.name + ' Video'}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
            style="width: 100%; height: 100%; border: none;"
          ></iframe>
        </div>
      </div>
      \` : ''}
    </div>
    <style>.interactive-media-panel.show-video .video-curtain { transform: translateY(0) !important; }</style>`;

// Replace from line 239 (index 238) to line 269 (index 268)
lines.splice(238, 31, replacement);

fs.writeFileSync("src/components/MissionStoryline.js", lines.join("\n"));
console.log("Lines replaced.");

const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

// 1. Fix the template literal escaping issue
let leftPanelStart = code.indexOf(`<div class="storyline-left-panel"`);
let drawerStart = code.indexOf(`<div class="storyline-drawer">`);

if (leftPanelStart !== -1 && drawerStart !== -1) {
  let panelCode = code.substring(leftPanelStart, drawerStart);
  
  // Replace string literal escaping back to actual js interpolation
  panelCode = panelCode.split("\\${").join("${");
  panelCode = panelCode.split("\\`").join("`");

  code = code.substring(0, leftPanelStart) + panelCode + code.substring(drawerStart);
}

// 2. Fix the hardcoded 3D height
code = code.replace("const height = 220;", "const height = canvasWrap.clientHeight || 500;");

fs.writeFileSync("src/components/MissionStoryline.js", code);
console.log("Fixed!");

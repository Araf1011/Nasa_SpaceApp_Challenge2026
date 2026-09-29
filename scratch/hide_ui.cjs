
const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

code = code.replace("this.container.classList.add(`active`);", "this.container.classList.add(`active`);\n    document.body.classList.add(`dashboard-active`);");
// Ah wait, it uses single quotes in the file: "this.container.classList.add('active');"


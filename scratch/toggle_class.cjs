const fs = require("fs");
let code = fs.readFileSync("src/components/MissionStoryline.js", "utf8");

code = code.replace("this.container.classList.add('active');", "this.container.classList.add('active');\\n    document.body.classList.add('dashboard-active');");
code = code.replace("this.container.classList.remove('active');", "this.container.classList.remove('active');\\n    document.body.classList.remove('dashboard-active');");

fs.writeFileSync("src/components/MissionStoryline.js", code);
console.log("Replaced!");

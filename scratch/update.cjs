const fs = require("fs");
let content = fs.readFileSync("src/data/relicsData.js", "utf8");

const updates = {
  "curiosity-msl": {
    videoEmbed: "https://www.youtube.com/embed/gwinFP8_jAo",
    videoTitle: "Curiosity Landing - Seven Minutes of Terror",
    construction: { builtBy: "JPL Pasadena", builtAt: "Pasadena, USA", assemblyFacility: "Jet Propulsion Laboratory", startYear: 2004, completedYear: 2011, purpose: "Investigate Mars habitability and climate", cost: "$2.5 billion" },
    causeOfAbandon: null,
    missionVitals: { mass: "899 kg", dimensions: "3 × 2.7 × 2.2 m", powerSource: "MMRTG (Plutonium-238)", powerOutput: "~110 Watts", designLife: "1 Martian year (687 Earth days)", actualLife: "Active since 2012" },
    milestones: [ { icon: "🏆", title: "First use of Sky Crane landing system", year: 2012 }, { icon: "🏆", title: "Discovered ancient freshwater lake bed", year: 2013 }, { icon: "🏆", title: "Measured seasonal methane spikes", year: 2018 } ]
  },
  "perseverance-ingenuity": {
    videoEmbed: "https://www.youtube.com/embed/4czjS9h4Fpg",
    videoTitle: "Perseverance Rover Landing",
    construction: { builtBy: "JPL", builtAt: "Pasadena, USA", assemblyFacility: "Jet Propulsion Laboratory", startYear: 2013, completedYear: 2020, purpose: "Seek signs of ancient life and collect samples", cost: "$2.7 billion" },
    causeOfAbandon: null,
    missionVitals: { mass: "1025 kg", dimensions: "3 × 2.7 × 2.2 m", powerSource: "MMRTG (Plutonium-238)", powerOutput: "~110 Watts", designLife: "1 Martian year (687 Earth days)", actualLife: "Active since 2021" },
    milestones: [ { icon: "🏆", title: "First powered flight on Mars (Ingenuity)", year: 2021 }, { icon: "🏆", title: "First oxygen generated on Mars (MOXIE)", year: 2021 }, { icon: "🏆", title: "First sample cached for return", year: 2021 } ]
  },
  "voyager-1": {
    videoEmbed: "https://www.youtube.com/embed/xQRFn5PORTU",
    videoTitle: "Voyager Golden Record",
    construction: { builtBy: "JPL", builtAt: "Pasadena, USA", assemblyFacility: "Jet Propulsion Laboratory", startYear: 1972, completedYear: 1977, purpose: "Explore the outer solar system and interstellar space", cost: "$865 million" },
    causeOfAbandon: null,
    missionVitals: { mass: "825 kg", dimensions: "3.7 m diameter", powerSource: "RTG (Plutonium-238)", powerOutput: "~470 Watts (at launch)", designLife: "5 years", actualLife: "Active since 1977" },
    milestones: [ { icon: "🏆", title: "Jupiter and Saturn flybys", year: 1979 }, { icon: "🏆", title: "Took the Pale Blue Dot photograph", year: 1990 }, { icon: "🏆", title: "Entered interstellar space", year: 2012 } ]
  },
  "jwst-telescope": {
    videoEmbed: "https://www.youtube.com/embed/4P8fKd0IVOs",
    videoTitle: "JWST First Images",
    construction: { builtBy: "Northrop Grumman / GSFC", builtAt: "Redondo Beach, USA", assemblyFacility: "Space Park", startYear: 2004, completedYear: 2021, purpose: "Observe the earliest galaxies and star formation", cost: "$10 billion" },
    causeOfAbandon: null,
    missionVitals: { mass: "6500 kg", dimensions: "20.2 × 14.2 m", powerSource: "Solar Panels", powerOutput: "~2000 Watts", designLife: "10 years", actualLife: "Active since 2022" },
    milestones: [ { icon: "🏆", title: "Successfully deployed sunshield", year: 2022 }, { icon: "🏆", title: "First deep field image released", year: 2022 }, { icon: "🏆", title: "Discovered earliest known galaxy", year: 2023 } ]
  },
  "apollo-11-lrrr": {
    videoEmbed: "https://www.youtube.com/embed/S9HdPi9Ikhk",
    videoTitle: "Apollo 11 Moon Landing",
    construction: { builtBy: "Various NASA contractors", builtAt: "USA", assemblyFacility: "Multiple", startYear: 1966, completedYear: 1969, purpose: "First human landing on the Moon and precise distance measurement", cost: "$25.4 billion" },
    causeOfAbandon: "Left on Moon as designed",
    missionVitals: { mass: "Passive reflector array", dimensions: "46 × 46 cm", powerSource: "Passive (No power required)", powerOutput: "0 Watts", designLife: "Indefinite", actualLife: "Passive since 1969" },
    milestones: [ { icon: "🏆", title: "First human landing on the Moon", year: 1969 }, { icon: "🏆", title: "Enabled millimeter-precision lunar ranging", year: 1969 }, { icon: "🏆", title: "Proved the Moon is drifting away", year: 1970 } ]
  },
  "chandrayaan-3": {
    videoEmbed: "https://www.youtube.com/embed/hNN8WFhMpIo",
    videoTitle: "Chandrayaan-3 Moon Landing",
    construction: { builtBy: "ISRO", builtAt: "Bengaluru, India", assemblyFacility: "URSC", startYear: 2020, completedYear: 2023, purpose: "Demonstrate safe landing on the lunar surface and conduct in-situ experiments", cost: "$75 million" },
    causeOfAbandon: "Lunar night set in, draining solar batteries",
    missionVitals: { mass: "1749 kg (lander)", dimensions: "2 × 2 × 1.2 m", powerSource: "Solar Panels", powerOutput: "~738 Watts", designLife: "1 Lunar day (14 Earth days)", actualLife: "Completed 2023" },
    milestones: [ { icon: "🏆", title: "First landing at Lunar South Pole", year: 2023 }, { icon: "🏆", title: "Confirmed presence of lunar sulfur", year: 2023 }, { icon: "🏆", title: "Measured lunar surface temperature gradient", year: 2023 } ]
  },
  "parker-solar-probe": {
    videoEmbed: "https://www.youtube.com/embed/nB2Hl0mL_xw",
    videoTitle: "Parker Solar Probe Mission",
    construction: { builtBy: "APL Johns Hopkins", builtAt: "Laurel, USA", assemblyFacility: "Applied Physics Laboratory", startYear: 2010, completedYear: 2018, purpose: "Study the outer corona of the Sun", cost: "$1.5 billion" },
    causeOfAbandon: null,
    missionVitals: { mass: "685 kg", dimensions: "3 × 1 × 1 m", powerSource: "Solar Panels", powerOutput: "~343 Watts (at perihelion)", designLife: "7 years", actualLife: "Active since 2018" },
    milestones: [ { icon: "🏆", title: "First spacecraft to \"touch\" the Sun", year: 2021 }, { icon: "🏆", title: "Fastest human-made object", year: 2023 }, { icon: "🏆", title: "Closest approach to the Sun", year: 2023 } ]
  },
  "opportunity-mer-b": {
    videoEmbed: "https://www.youtube.com/embed/2MHLhAT9bJE",
    videoTitle: "Farewell to Opportunity",
    construction: { builtBy: "JPL", builtAt: "Pasadena, USA", assemblyFacility: "Jet Propulsion Laboratory", startYear: 2000, completedYear: 2003, purpose: "Search for evidence of past water activity on Mars", cost: "$400 million" },
    causeOfAbandon: "Global dust storm blocked solar panels, draining batteries in June 2018",
    missionVitals: { mass: "185 kg", dimensions: "1.5 × 2.3 × 1.6 m", powerSource: "Solar Panels", powerOutput: "~140 Watts (peak)", designLife: "90 Sols", actualLife: "14 years (Retired 2018)" },
    milestones: [ { icon: "🏆", title: "Confirmed past presence of liquid water", year: 2004 }, { icon: "🏆", title: "Longest off-world driving distance (45.16 km)", year: 2015 }, { icon: "🏆", title: "Survived 5000 Sols on Mars", year: 2018 } ]
  },
  "spirit-mer-a": {
    videoEmbed: "https://www.youtube.com/embed/2MHLhAT9bJE",
    videoTitle: "Mars Exploration Rovers",
    construction: { builtBy: "JPL", builtAt: "Pasadena, USA", assemblyFacility: "Jet Propulsion Laboratory", startYear: 2000, completedYear: 2003, purpose: "Search for evidence of past water activity on Mars", cost: "$400 million" },
    causeOfAbandon: "Stuck in soft sand, lost contact during Martian winter in March 2010",
    missionVitals: { mass: "185 kg", dimensions: "1.5 × 2.3 × 1.6 m", powerSource: "Solar Panels", powerOutput: "~140 Watts (peak)", designLife: "90 Sols", actualLife: "6 years (Retired 2010)" },
    milestones: [ { icon: "🏆", title: "First of twin rovers to land", year: 2004 }, { icon: "🏆", title: "Discovered evidence of ancient hot springs", year: 2007 }, { icon: "🏆", title: "Captured first dust devil on video", year: 2005 } ]
  },
  "phoenix-lander": {
    videoEmbed: "https://www.youtube.com/embed/p1WX0CATyn0",
    videoTitle: "Phoenix Mars Lander",
    construction: { builtBy: "Lockheed Martin / U of Arizona", builtAt: "Denver, USA", assemblyFacility: "Lockheed Martin Space Systems", startYear: 2003, completedYear: 2007, purpose: "Search for environments suitable for microbial life on Mars", cost: "$420 million" },
    causeOfAbandon: "Harsh polar winter buried it in dry ice, draining power in Nov 2008",
    missionVitals: { mass: "350 kg", dimensions: "1.5 × 5.5 × 1.5 m (with panels deployed)", powerSource: "Solar Panels", powerOutput: "~250 Watts", designLife: "90 Sols", actualLife: "157 Sols (Retired 2008)" },
    milestones: [ { icon: "🏆", title: "First successful landing in Martian polar region", year: 2008 }, { icon: "🏆", title: "First direct verification of water ice on Mars", year: 2008 }, { icon: "🏆", title: "Observed falling snow in the Martian atmosphere", year: 2008 } ]
  },
  "insight-lander": {
    videoEmbed: "https://www.youtube.com/embed/rJfJPcJfJZw",
    videoTitle: "InSight Mars Lander",
    construction: { builtBy: "Lockheed Martin", builtAt: "Denver, USA", assemblyFacility: "Lockheed Martin Space Systems", startYear: 2012, completedYear: 2018, purpose: "Study the deep interior of Mars", cost: "$830 million" },
    causeOfAbandon: "Dust accumulation on solar panels drained power in Dec 2022",
    missionVitals: { mass: "358 kg", dimensions: "1.5 × 6 × 1 m (with panels deployed)", powerSource: "Solar Panels", powerOutput: "~600 Watts (clean)", designLife: "1 Martian year (687 Earth days)", actualLife: "4 years (Retired 2022)" },
    milestones: [ { icon: "🏆", title: "Detected first marsquake", year: 2019 }, { icon: "🏆", title: "Mapped the Martian core and mantle", year: 2021 }, { icon: "🏆", title: "Recorded over 1,300 seismic events", year: 2022 } ]
  }
};

let lines = content.split(/\r?\n/);
let outLines = [];
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  let idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
  if (idMatch) {
    currentId = idMatch[1];
  }
  
  let badgeMatch = line.match(/^(\s*)badgeAwarded:\s*['"][^'"]+['"]/);
  if (badgeMatch && currentId && updates[currentId]) {
    // Modify the line to add comma
    line = line + ",";
    outLines.push(line);
    
    let spaces = badgeMatch[1];
    let u = updates[currentId];
    
    // Create the append string
    let appendStr = `${spaces}videoEmbed: '${u.videoEmbed}',
${spaces}videoTitle: '${u.videoTitle}',
${spaces}construction: {
${spaces}  builtBy: '${u.construction.builtBy}',
${spaces}  builtAt: '${u.construction.builtAt}',
${spaces}  assemblyFacility: '${u.construction.assemblyFacility}',
${spaces}  startYear: ${u.construction.startYear},
${spaces}  completedYear: ${u.construction.completedYear},
${spaces}  purpose: '${u.construction.purpose}',
${spaces}  cost: '${u.construction.cost}'
${spaces}},
${spaces}causeOfAbandon: ${u.causeOfAbandon ? "'" + u.causeOfAbandon + "'" : "null"},
${spaces}missionVitals: {
${spaces}  mass: '${u.missionVitals.mass}',
${spaces}  dimensions: '${u.missionVitals.dimensions}',
${spaces}  powerSource: '${u.missionVitals.powerSource}',
${spaces}  powerOutput: '${u.missionVitals.powerOutput}',
${spaces}  designLife: '${u.missionVitals.designLife}',
${spaces}  actualLife: '${u.missionVitals.actualLife}'
${spaces}},
${spaces}milestones: [
${u.milestones.map(m => spaces + "  { icon: '" + m.icon + "', title: '" + m.title + "', year: " + m.year + " }").join(",\n")}
${spaces}]`;
    
    outLines.push(appendStr);
    currentId = null; // reset
  } else {
    outLines.push(line);
  }
}

fs.writeFileSync("src/data/relicsData.js", outLines.join("\n"));
console.log("Updated relicsData.js successfully.");

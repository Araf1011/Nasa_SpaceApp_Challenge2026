/**
 * Cosmic Sleuth Mission Quiz & Passport Badges
 * Specifically designed for school-age space enthusiasts to test what they've learned.
 */

export const BADGES_CATALOG = [
  {
    id: 'lunar-archaeologist',
    name: 'Lunar Archaeologist',
    icon: '🌕',
    domain: 'Moon',
    criteria: 'Investigate Apollo laser mirrors & lunar exploration sites',
    desc: 'Awarded for decoding the science of hardware left on the Moon since 1969.'
  },
  {
    id: 'martian-vanguard',
    name: 'Martian Vanguard',
    icon: '🔴',
    domain: 'Mars',
    criteria: 'Explore Martian rovers, helicopters, and seismometers',
    desc: 'Awarded for understanding the robotic explorers mapping the Red Planet.'
  },
  {
    id: 'interstellar-pathfinder',
    name: 'Interstellar Pathfinder',
    icon: '🚀',
    domain: 'Deep Space',
    criteria: 'Track Voyager, Pioneer, and New Horizons into deep space',
    desc: 'Awarded for reaching the outer boundary of our solar system and beyond.'
  },
  {
    id: 'sun-diver',
    name: 'Solar Storm Chaser',
    icon: '☀️',
    domain: 'Sun',
    criteria: 'Study Parker Solar Probe touching the solar corona',
    desc: 'Awarded for enduring the blistering temperatures of the Sun\'s corona.'
  },
  {
    id: 'planetary-guardian',
    name: 'Planetary Guardian',
    icon: '🛡️',
    domain: 'Asteroids',
    criteria: 'Understand DART kinetic impact planetary defense',
    desc: 'Awarded for mastering techniques to protect Earth from asteroid threats.'
  },
  {
    id: 'cosmic-astronomer',
    name: 'Deep Cosmos Observer',
    icon: '🔭',
    domain: 'Lagrange',
    criteria: 'Inspect James Webb Space Telescope at Sun-Earth L2',
    desc: 'Awarded for unlocking the secrets of the earliest galaxies in the universe.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: "Which piece of Apollo 11 hardware on the Moon is STILL functioning today without any batteries or electricity?",
    options: [
      { text: "The Eagle ascent rocket engine", correct: false },
      { text: "The Laser Ranging Retroreflector (LRRR)", correct: true },
      { text: "The Lunar Roving Vehicle TV camera", correct: false },
      { text: "The Apollo solar wind foil flag", correct: false }
    ],
    explanation: "The Laser Ranging Retroreflector uses 100 quartz corner-cubes to bounce laser beams fired from Earth right back to their source. Because it's purely optical glass, it needs zero power!",
    badgeHint: 'lunar-archaeologist'
  },
  {
    id: 'q2',
    question: "How did the tiny helicopter Ingenuity fly in Mars' atmosphere, which is less than 1% as thick as Earth's?",
    options: [
      { text: "It used miniature rocket jet engines", correct: false },
      { text: "It was pulled along by a fishing line from Perseverance", correct: false },
      { text: "It spun ultra-lightweight carbon fiber blades at 2,400 RPM", correct: true },
      { text: "It floated like a helium party balloon", correct: false }
    ],
    explanation: "To generate lift in the razor-thin Martian air, Ingenuity used counter-rotating carbon fiber blades spinning over 5 times faster than standard terrestrial helicopters!",
    badgeHint: 'martian-vanguard'
  },
  {
    id: 'q3',
    question: "What special cargo do Voyagers 1 and 2 carry in case they are ever discovered by an alien civilization?",
    options: [
      { text: "A digital USB thumb drive with Wikipedia", correct: false },
      { text: "A 12-inch gold-plated phonograph record with Earth sounds & music", correct: true },
      { text: "A frozen astronaut spacesuit", correct: false },
      { text: "A library of paper comic books", correct: false }
    ],
    explanation: "The Golden Record contains 115 images, spoken greetings in 55 human languages, animal sounds, wind, thunder, and music ranging from Bach to Chuck Berry!",
    badgeHint: 'interstellar-pathfinder'
  },
  {
    id: 'q4',
    question: "Why did NASA deliberately plunge the Cassini spacecraft into Saturn's atmosphere at the end of its mission in 2017?",
    options: [
      { text: "To take high-speed photographs of Saturn's core", correct: false },
      { text: "To prevent accidentally contaminating pristine ocean moons Titan and Enceladus", correct: true },
      { text: "Its computer malfunctioned and crashed", correct: false },
      { text: "To break the world speed record for spaceships", correct: false }
    ],
    explanation: "Cassini discovered that moons Enceladus and Titan harbor liquid oceans with conditions that might support life. To avoid crashing into them and leaving Earth microbes behind, NASA cleanly vaporized Cassini in Saturn!",
    badgeHint: 'planetary-guardian'
  },
  {
    id: 'q5',
    question: "In 2022, NASA's DART spacecraft intentionally smashed into asteroid moonlet Dimorphos. What did this historic mission prove?",
    options: [
      { text: "Asteroids are made of pure solid diamond", correct: false },
      { text: "Humanity can deflect an asteroid using a kinetic impact to protect Earth", correct: true },
      { text: "Asteroids can be brought into orbit around the Moon", correct: false },
      { text: "Lasers can vaporize giant asteroids in seconds", correct: false }
    ],
    explanation: "DART hit Dimorphos at 24,000 km/h, shortening its orbit around Didymos by 33 minutes! This demonstrated that kinetic impactors are a viable defense against potential Earth collisions.",
    badgeHint: 'planetary-guardian'
  },
  {
    id: 'q6',
    question: "What remarkable discovery did the rover Opportunity make that proved liquid water once flowed across ancient Mars?",
    options: [
      { text: "A frozen underground swimming pool", correct: false },
      { text: "Tiny hematite mineral spheres nicknamed 'blueberries'", correct: true },
      { text: "A dried-up wooden sailboat", correct: false },
      { text: "Active rain clouds over Endeavour crater", correct: false }
    ],
    explanation: "Opportunity photographed millimeter-sized hematite 'blueberries' embedded in bedrock, which could only have formed when acidic groundwater soaked through sedimentary rocks billions of years ago.",
    badgeHint: 'martian-vanguard'
  }
];

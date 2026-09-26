/**
 * Moon & Mars Detailed Information Dataset & Historical Surface Expeditions
 * Powers the 3D Rocket Mission Launch, Planetary Surface Explorer,
 * and comprehensive stories of who visited, what missions occurred, and who returned.
 */

export const PLANET_DATA = {

  moon: {
    id: 'moon',
    name: 'The Moon',
    subtitle: "Earth's Ancient Companion",
    icon: '🌕',
    theme: 'moon',
    heroColor: '#c8d6e5',
    accentColor: '#ffd166',
    tagline: 'Humanity\'s first stepping stone to the cosmos',
    heroImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1280px-FullMoon2010.jpg',

    stats: [
      { label: 'Diameter',       value: '3,474 km',         icon: '⭕', note: '27% of Earth' },
      { label: 'Gravity',        value: '1.62 m/s²',        icon: '🏋️', note: '16.6% of Earth' },
      { label: 'Distance',       value: '384,400 km',       icon: '📏', note: 'avg from Earth' },
      { label: 'Day Length',     value: '29.5 Earth days',  icon: '🕐', note: 'Synodic period' },
      { label: 'Surface Temp',   value: '−173°C to +127°C', icon: '🌡️', note: 'Day vs Night' },
      { label: 'Atmosphere',     value: 'Exosphere only',   icon: '💨', note: 'Virtually none' },
      { label: 'Age',            value: '4.5 Billion yrs',  icon: '⌛', note: 'Same as Earth' },
      { label: 'Water Ice',      value: 'Yes — South Pole', icon: '🧊', note: 'Confirmed 2009' }
    ],

    // Real Lunar Surface Landing Expeditions (Latitude & Longitude for 3D globe placement)
    expeditions: [
      {
        id: 'apollo-11',
        name: 'Apollo 11: The Eagle Has Landed',
        shortName: 'Apollo 11',
        year: 1969,
        category: 'crewed',
        agency: '🇺🇸 NASA',
        badge: '👨‍🚀 CREWED FIRST LANDING',
        landingSite: 'Sea of Tranquility (Mare Tranquillitatis)',
        coordinates: { lat: 0.674, lon: 23.473 },
        astronauts: ['Neil Armstrong (Commander)', 'Buzz Aldrin (Lunar Module Pilot)', 'Michael Collins (Command Module Pilot, in Orbit)'],
        spacecraft: 'Saturn V (SA-506), CSM-107 "Columbia", LM-5 "Eagle"',
        stayDuration: '21 hours, 36 minutes (Surface EVA: 2h 31m)',
        sampleMass: '21.55 kg of lunar rocks & soil',
        outcome: 'Returned safely to Earth (Pacific Splashdown: July 24, 1969)',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Apollo_11_landing_site.jpg/800px-Apollo_11_landing_site.jpg',
        story: {
          whoCame: 'Neil Armstrong and Buzz Aldrin became the first human beings to set foot upon another heavenly body, while Michael Collins circled alone in lunar orbit keeping the lifeline home alive.',
          theJourney: 'Launched atop the mighty 110-meter Saturn V rocket from Launch Complex 39A at Kennedy Space Center on July 16, 1969. After a 3-day coast across 384,000 km of deep space, Eagle undocked from Columbia and began its powered descent.',
          theLanding: 'With low fuel alarms blaring and the computer overloaded with 1202 alarms, Armstrong took manual control to steer away from a boulder-strewn crater, touching down with barely 25 seconds of descent fuel remaining. Armstrong announced: "Houston, Tranquility Base here. The Eagle has landed."',
          whatTheyDid: 'Armstrong descended the ladder and proclaimed: "That\'s one small step for [a] man, one giant leap for mankind." They planted the U.S. flag, set up seismic detectors, gathered soil and rock samples, and spoke live with the White House.',
          whoWentAndLeft: 'After 21.6 hours on the Moon, Eagle\'s ascent engine fired flawlessly, carrying Armstrong and Aldrin back to orbit to dock with Collins. While the astronauts returned home safely, Eagle\'s descent stage, their boots, the seismic package, and the Laser Ranging Retroreflector remain on the Moon to this day.'
        },
        artifactsLeft: [
          'Apollo 11 Lunar Module Descent Stage',
          'Laser Ranging Retroreflector (LRRR — scientists still bounce lasers off it today)',
          'Commemorative Plaque: "Here men from the planet Earth first set foot upon the Moon. We came in peace for all mankind."',
          'Silicon Goodwill Disc etched with messages from 73 world leaders',
          'Gold Olive Branch honoring Apollo 1 astronauts'
        ]
      },
      {
        id: 'apollo-12',
        name: 'Apollo 12: Pinpoint Precision Landing',
        shortName: 'Apollo 12',
        year: 1969,
        category: 'crewed',
        agency: '🇺🇸 NASA',
        badge: '👨‍🚀 CREWED EXPLORATION',
        landingSite: 'Ocean of Storms (Oceanus Procellarum)',
        coordinates: { lat: -3.012, lon: -23.421 },
        astronauts: ['Pete Conrad (Commander)', 'Alan Bean (Lunar Module Pilot)', 'Richard Gordon (CMP, in Orbit)'],
        spacecraft: 'Saturn V, CSM "Yankee Clipper", LM "Intrepid"',
        stayDuration: '31 hours, 31 minutes',
        sampleMass: '34.35 kg of rocks',
        outcome: 'Returned safely to Earth (November 24, 1969)',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Apollo_12_Surveyor_3.jpg/800px-Apollo_12_Surveyor_3.jpg',
        story: {
          whoCame: 'Pete Conrad and Alan Bean executed the first pinpoint lunar landing, touching down within walking distance (160 meters) of the robotic Surveyor 3 probe that had landed 2.5 years earlier.',
          theJourney: 'Struck by lightning twice during launch from Florida, the crew and ground controller John Aaron saved the mission with the famous command "Try SCE to AUX".',
          theLanding: 'Conrad landed "Intrepid" right on target next to Surveyor Crater. His first words upon stepping onto the lunar dust: "Whoopee! Man, that may have been a small one for Neil, but that\'s a long one for me!"',
          whatTheyDid: 'Conrad and Bean conducted two spacewalks, deployed the first full nuclear-powered ALSEP science station, and walked over to Surveyor 3 to retrieve its camera and tubing to test long-term space exposure.',
          whoWentAndLeft: 'The crew returned to Earth with the Surveyor camera parts. Intrepid\'s descent stage rests forever in the Ocean of Storms.'
        },
        artifactsLeft: ['Intrepid Descent Stage', 'Nuclear ALSEP scientific station', 'Solar wind spectrometer']
      },
      {
        id: 'apollo-15',
        name: 'Apollo 15: The First Lunar Rover Pioneers',
        shortName: 'Apollo 15',
        year: 1971,
        category: 'crewed',
        agency: '🇺🇸 NASA',
        badge: '🚗 FIRST WHEELS ON THE MOON',
        landingSite: 'Hadley-Apennine & Hadley Rille',
        coordinates: { lat: 26.132, lon: 3.633 },
        astronauts: ['David Scott (Commander)', 'James Irwin (Lunar Module Pilot)', 'Alfred Worden (CMP, in Orbit)'],
        spacecraft: 'Saturn V, CSM "Endeavour", LM "Falcon", Lunar Roving Vehicle #1',
        stayDuration: '66 hours, 55 minutes (18h 30m EVA)',
        sampleMass: '77.31 kg (including Genesis Rock)',
        outcome: 'Returned safely to Earth (August 7, 1971)',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apollo_15_flag%2C_rover%2C_LM%2C_Irwin.jpg/800px-Apollo_15_flag%2C_rover%2C_LM%2C_Irwin.jpg',
        story: {
          whoCame: 'David Scott and James Irwin stayed on the Moon for nearly 3 days, pioneering the use of the Lunar Roving Vehicle (LRV) — the first electric car driven on another planetary world.',
          theJourney: 'The first "J-mission" designed for extended scientific research, Falcon carried heavy geological tools and the folded rover in its descent bay.',
          theLanding: 'Touched down in a dramatic valley surrounded by 4,000-meter peaks of the Montes Apenninus and the sheer 300-meter deep gorge of Hadley Rille.',
          whatTheyDid: 'Drove 27.8 km across the rugged mountainsides. Scott and Irwin discovered the famous "Genesis Rock" (an anorthosite chunk 4.1 billion years old from the Moon\'s primordial crust). Scott also dropped a falcon feather and a hammer simultaneously, demonstrating Galileo\'s theory that in a vacuum all objects fall at the same rate.',
          whoWentAndLeft: 'The astronauts blasted off in Falcon to rejoin Worden. Lunar Rover #1 remains parked overlooking Hadley Rille, with its color TV camera recording the ascent.'
        },
        artifactsLeft: ['Lunar Roving Vehicle (LRV-1)', 'Falcon Descent Stage', '"Fallen Astronaut" aluminum sculpture & memorial plaque for fallen spacefarers']
      },
      {
        id: 'apollo-17',
        name: 'Apollo 17: The Last Humans of the 20th Century',
        shortName: 'Apollo 17',
        year: 1972,
        category: 'crewed',
        agency: '🇺🇸 NASA',
        badge: '👨‍🚀 FINAL APOLLO MOONWALK',
        landingSite: 'Taurus-Littrow Valley',
        coordinates: { lat: 20.190, lon: 30.771 },
        astronauts: ['Gene Cernan (Commander)', 'Harrison "Jack" Schmitt (Scientist-Geologist)', 'Ron Evans (CMP, in Orbit)'],
        spacecraft: 'Saturn V, CSM "America", LM "Challenger", Lunar Rover #3',
        stayDuration: '75 hours (22h 4m EVA)',
        sampleMass: '110.5 kg of lunar samples',
        outcome: 'Returned safely to Earth (December 19, 1972)',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GeneCernanApollo17.jpg/800px-GeneCernanApollo17.jpg',
        story: {
          whoCame: 'Gene Cernan and professional geologist Harrison Schmitt conducted the most extensive human lunar exploration in history. Cernan remains to this date the last human to walk on the lunar surface.',
          theJourney: 'Launched on December 7, 1972 — the only night launch of a Saturn V, illuminating the night sky like an artificial sunrise.',
          theLanding: 'Landed in the deep Taurus-Littrow valley between towering massifs.',
          whatTheyDid: 'Traveled 35.7 km in their Lunar Rover, discovering famous bright orange volcanic soil at Shorty Crater — evidence of ancient explosive lunar pyroclastic fire fountains. Schmitt remarked: "Hey, there is orange soil! It\'s all over!"',
          whoWentAndLeft: 'On December 14, 1972, Cernan stepped off the Moon, saying: "As I take man\'s last step from surface, back home for some time to come — but we believe not too long into the future — I\'d like to just say what I believe history will record: that America\'s challenge of today has forged man\'s destiny of tomorrow." They returned safely to Earth; their Rover, descent stage, and American flag stand sentinel today.'
        },
        artifactsLeft: ['Challenger Descent Stage', 'Lunar Roving Vehicle (LRV-3)', 'ALSEP nuclear instruments', 'Commemorative plaque']
      },
      {
        id: 'luna-24',
        name: 'Luna 24: Soviet Robotic Core Drill Sample Return',
        shortName: 'Luna 24',
        year: 1976,
        category: 'robotic',
        agency: '🇷🇺 Soviet Space Program',
        badge: '🤖 AUTOMATED SAMPLE RETURN',
        landingSite: 'Sea of Crises (Mare Crisium)',
        coordinates: { lat: 12.714, lon: 62.212 },
        astronauts: null,
        spacecraft: 'Proton-K rocket, Luna robotic lander & Earth return ascent rocket',
        stayDuration: 'Surface drilling: 1 day',
        sampleMass: '170.1 grams core drill sample',
        outcome: 'Return capsule landed in Western Siberia (August 22, 1976)',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Luna_24_lander.jpg/800px-Luna_24_lander.jpg',
        story: {
          whoCame: 'No humans were aboard — an entirely autonomous Soviet robotic probe launched to drill deep beneath the lunar surface.',
          theJourney: 'Launched August 9, 1976 on a Proton-K rocket, entered lunar orbit, and made a pinpoint landing in Mare Crisium.',
          theLanding: 'Touched down safely and deployed a rotary drill that penetrated 2 meters down into the lunar soil.',
          whatTheyDid: 'Extracted a continuous 2-meter core sample, vacuum-sealed it into a spherical capsule atop the ascent stage.',
          whoWentAndLeft: 'The robotic ascent rocket launched from the lunar surface on August 19, 1976, and parachuted safely into Siberia with samples that showed early traces of lunar water. The landing platform remains in Mare Crisium.'
        },
        artifactsLeft: ['Luna 24 Landing Base and drill assembly']
      },
      {
        id: 'change-4',
        name: 'Chang\'e 4 & Yutu-2: First Landing on the Lunar Far Side',
        shortName: 'Chang\'e 4',
        year: 2019,
        category: 'robotic',
        agency: '🇨🇳 CNSA (China)',
        badge: '🌑 FIRST LUNAR FAR SIDE SOFT LANDING',
        landingSite: 'Von Kármán Crater (South Pole–Aitken Basin)',
        coordinates: { lat: -45.457, lon: 177.588 },
        astronauts: null,
        spacecraft: 'Long March 3B, Chang\'e 4 lander, Yutu-2 rover, Queqiao relay satellite',
        stayDuration: 'Active since January 3, 2019 (Over 5 years!)',
        sampleMass: 'In-situ radar and spectral analysis',
        outcome: 'Active operating rover on the far side',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Chang%27e_4_lander_taken_by_Yutu-2.jpg/800px-Chang%27e_4_lander_taken_by_Yutu-2.jpg',
        story: {
          whoCame: 'China\'s robotic pioneer became the first spacecraft from planet Earth to soft-land on the mysterious Far Side of the Moon, communicating via the Queqiao relay satellite parked at the Earth-Moon L2 point.',
          theJourney: 'Launched December 7, 2018, guided through the radio-shadowed lunar backside.',
          theLanding: 'Autonomously avoided craters and touched down inside the ancient 180-km Von Kármán crater.',
          whatTheyDid: 'Deployed the Yutu-2 (Jade Rabbit 2) rover, which drove over 1,500 meters, using ground-penetrating radar to reveal layers of lunar mantle rock blown up by ancient cosmic collisions.',
          whoWentAndLeft: 'Still alive and working on the surface! Yutu-2 holds the record as the longest-operating lunar rover in history.'
        },
        artifactsLeft: ['Active Chang\'e 4 Lander', 'Active Yutu-2 Rover']
      },
      {
        id: 'chandrayaan-3',
        name: 'Chandrayaan-3: India\'s Historic South Pole Touchdown',
        shortName: 'Chandrayaan-3',
        year: 2023,
        category: 'robotic',
        agency: '🇮🇳 ISRO (India)',
        badge: '🧊 FIRST SOFT LANDING AT LUNAR SOUTH POLE',
        landingSite: 'Shiv Shakti Point (near Manzinus C Crater)',
        coordinates: { lat: -69.373, lon: 32.319 },
        astronauts: null,
        spacecraft: 'LVM3-M4 rocket, Vikram Lander, Pragyan Rover',
        stayDuration: '14 Earth days (1 Lunar Sol)',
        sampleMass: 'In-situ laser spectroscopy & seismic monitoring',
        outcome: 'Mission goals completed; hardware rests at Shiv Shakti Point',
        heroImage: '/chandrayaan3_surface.jpg',
        story: {
          whoCame: 'India became the fourth nation to soft-land on the Moon, and the first country in history to reach the rugged, unexplored South Pole region.',
          theJourney: 'Launched July 14, 2023 from Sriharikota. Executed gradual orbit-raising maneuvers before entering lunar orbit on August 5.',
          theLanding: 'On August 23, 2023, Vikram autonomously executed four thruster braking phases, touching down upright at 69.37°S to worldwide cheers.',
          whatTheyDid: 'Ramp deployed and the 26-kg Pragyan rover rolled onto the lunar soil. Discovered elemental Sulfur (S) on the surface, recorded lunar seismic vibrations, and took the surface temperature of polar regolith.',
          whoWentAndLeft: 'Vikram and Pragyan completed their planned mission. As the harsh -200°C lunar night set in, they fell into eternal sleep at Shiv Shakti Point.'
        },
        artifactsLeft: ['Vikram Lander', 'Pragyan Rover', 'Ashoka Pillar & ISRO insignia embossed in lunar regolith']
      },
      {
        id: 'artemis-3',
        name: 'Artemis III: Humanity\'s Permanent Return to the Moon',
        shortName: 'Artemis III',
        year: '2026+',
        category: 'future',
        agency: '🇺🇸 NASA / ESA / JAXA / CSA',
        badge: '👩‍🚀 FIRST WOMAN & NEXT MAN ON THE MOON',
        landingSite: 'Shackleton Crater Rim (Lunar South Pole)',
        coordinates: { lat: -89.900, lon: 0.000 },
        astronauts: ['First Woman on the Moon', 'Next Man on the Moon (4 astronauts total, 2 on surface)'],
        spacecraft: 'Space Launch System (SLS Block 1B), Orion Spacecraft, SpaceX Starship HLS (Human Landing System)',
        stayDuration: '6.5 days on the surface (4 EVAs)',
        sampleMass: 'Target: 100+ kg of polar ice & ancient mantle rocks',
        outcome: 'Upcoming historical crewed landing & Artemis Base Camp foundation',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Shackleton_crater_LROC_WAC.jpg/800px-Shackleton_crater_LROC_WAC.jpg',
        story: {
          whoCame: 'NASA\'s Artemis III will return human boots to the lunar surface for the first time in over 50 years, landing the first woman and the first person of color on the Moon.',
          theJourney: 'Four astronauts will launch aboard NASA\'s giant Space Launch System (SLS) rocket inside the Orion capsule. Near the Moon, Orion will dock with SpaceX\'s Starship Human Landing System.',
          theLanding: 'Two astronauts will transfer to Starship HLS and descend onto the towering rim of Shackleton Crater at the Lunar South Pole.',
          whatTheyDid: 'Equipped with modern xEMU spacesuits, astronauts will walk down into permanently shadowed crater regions to harvest ancient water ice, test lunar power grids, and establish Artemis Base Camp.',
          whoWentAndLeft: 'Starship HLS will launch from the Moon to return the crew to Orion for the voyage back to Earth, leaving behind habitat modules and lunar terrain vehicles for future human crews.'
        },
        artifactsLeft: ['Artemis Base Camp Habitat', 'Lunar Terrain Vehicle (LTV)', 'Polar scientific sensors']
      }
    ],

    surfaceFeatures: [
      {
        name: 'Sea of Tranquility',
        type: 'Mare',
        icon: '🌊',
        description: 'The landing site of Apollo 11 in 1969 — where Neil Armstrong and Buzz Aldrin made history. This ancient volcanic plain is 873 km wide.',
        coordinates: '0.67°N, 23.47°E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Apollo_11_landing_site.jpg/800px-Apollo_11_landing_site.jpg',
        fact: 'Apollo 11 left behind a plaque reading: "We came in peace for all mankind."'
      },
      {
        name: 'Shackleton Crater',
        type: 'Crater',
        icon: '❄️',
        description: 'A 21-km wide impact crater at the Lunar South Pole. Its permanently shadowed interior harbors billions of tonnes of water ice.',
        coordinates: '89.9°S, 0°E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Shackleton_crater_LROC_WAC.jpg/800px-Shackleton_crater_LROC_WAC.jpg',
        fact: 'NASA\'s Artemis base camp is planned near its rim.'
      },
      {
        name: 'Tycho Crater',
        type: 'Crater',
        icon: '💥',
        description: '85 km wide and 4.8 km deep, famous for its magnificent ray system stretching over 1,500 km across the lunar disk.',
        coordinates: '43.3°S, 11.2°W',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Tycho_crater_on_the_moon.jpg/800px-Tycho_crater_on_the_moon.jpg',
        fact: 'Formed only ~108 million years ago — young by lunar standards!'
      },
      {
        name: 'Mare Imbrium',
        type: 'Basin',
        icon: '🌑',
        description: 'The largest impact basin on the Moon\'s near side at ~1,100 km across. Apollo 15 collected the 4.1-billion-year-old Genesis Rock here.',
        coordinates: '32.8°N, 15.6°W',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mare_imbrium.jpg/800px-Mare_imbrium.jpg',
        fact: 'Formed 3.9 billion years ago when a protoplanet slammed into the Moon.'
      }
    ],

    funFacts: [
      { icon: '👣', title: 'Footprints Forever', text: 'The Apollo astronaut footprints on the Moon will last for millions of years — there is no wind or water to erase them.' },
      { icon: '🌊', title: 'Tidal Control', text: 'The Moon\'s gravity stabilizes Earth\'s climate tilt and drives the ocean tides that allowed early marine life to flourish.' },
      { icon: '🔭', title: 'Receding Satellite', text: 'The Moon is slowly drifting away from Earth at 3.8 cm per year — about the speed fingernails grow.' },
      { icon: '🌑', title: 'Tidal Locking', text: 'The Moon takes exactly the same time to rotate once on its axis as it does to orbit Earth, meaning we always see the same face.' }
    ]
  },

  // ---------------------------------------------------------------------------

  mars: {
    id: 'mars',
    name: 'Mars',
    subtitle: 'The Red Planet',
    icon: '🔴',
    theme: 'mars',
    heroColor: '#c1440e',
    accentColor: '#e17055',
    tagline: 'Humanity\'s next giant leap — our future second home',
    heroImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1280px-OSIRIS_Mars_true_color.jpg',

    stats: [
      { label: 'Diameter',       value: '6,779 km',         icon: '⭕', note: '53% of Earth' },
      { label: 'Gravity',        value: '3.72 m/s²',        icon: '🏋️', note: '38% of Earth' },
      { label: 'Distance',       value: '54.6M–401M km',    icon: '📏', note: 'varies w/ orbit' },
      { label: 'Day Length',     value: '24h 37m (1 Sol)',   icon: '🕐', note: 'Very similar to Earth!' },
      { label: 'Year Length',    value: '687 Earth days',   icon: '📅', note: '1.88 Earth years' },
      { label: 'Surface Temp',   value: '−143°C to +35°C',  icon: '🌡️', note: 'Extreme range' },
      { label: 'Atmosphere',     value: '95% CO₂',          icon: '💨', note: '0.6% Earth pressure' },
      { label: 'Moons',          value: 'Phobos & Deimos',  icon: '🌑', note: '2 small moons' }
    ],

    // Real Martian Surface Landing Expeditions (Latitude & Longitude for 3D globe placement)
    expeditions: [
      {
        id: 'viking-1',
        name: 'Viking 1: Humanity\'s First Eyes on Mars',
        shortName: 'Viking 1',
        year: 1976,
        category: 'robotic',
        agency: '🇺🇸 NASA',
        badge: '📸 FIRST SUCCESSFUL MARS LANDER',
        landingSite: 'Chryse Planitia (Plains of Gold)',
        coordinates: { lat: 22.480, lon: -49.970 },
        astronauts: null,
        spacecraft: 'Titan IIIE rocket, Viking 1 Orbiter & Lander',
        stayDuration: 'Active for 6 years, 116 days (July 1976 – Nov 1982)',
        sampleMass: 'Robotic scoop soil analysis',
        outcome: 'Operated until 1982; rests at Thomas Mutch Memorial Station',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Viking_1_lander.jpg/800px-Viking_1_lander.jpg',
        story: {
          whoCame: 'NASA\'s robotic ambassador Viking 1 became the first spacecraft to successfully land on the Red Planet and complete its long-duration mission.',
          theJourney: 'Launched August 20, 1975, cruising through interplanetary space for 10 months across 800 million kilometers.',
          theLanding: 'On July 20, 1976 (exactly 7 years after Apollo 11 touched down on the Moon), Viking 1 separated from its orbiter and used a heat shield, parachute, and terminal retro-rockets to touch down in Chryse Planitia.',
          whatTheyDid: 'Sent back the first clear photographs ever taken from the surface of Mars, showing a barren red landscape of basalt rocks under a salmon-pink sky. Tested soil for microbial life and monitored Martian winds.',
          whoWentAndLeft: 'Viking 1 operated until November 1982, when a faulty command accidentally severed communications. It rests permanently in Chryse Planitia.'
        },
        artifactsLeft: ['Viking 1 Lander body', 'Robotic soil trench arm', 'Terminal descent engines']
      },
      {
        id: 'pathfinder',
        name: 'Mars Pathfinder & Sojourner: First Wheels on Mars',
        shortName: 'Pathfinder & Sojourner',
        year: 1997,
        category: 'robotic',
        agency: '🇺🇸 NASA',
        badge: '🚙 FIRST WHEELED MARS ROVER',
        landingSite: 'Ares Vallis (Valley of Mars)',
        coordinates: { lat: 19.330, lon: -33.550 },
        astronauts: null,
        spacecraft: 'Delta II rocket, Pathfinder lander, Sojourner micro-rover',
        stayDuration: '83 Earth days (July 4 – September 27, 1997)',
        sampleMass: 'Alpha Proton X-Ray spectrometer rock analysis',
        outcome: 'Completed mission; resting at Carl Sagan Memorial Station',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sojourner_on_Mars_PIA01122.jpg/800px-Sojourner_on_Mars_PIA01122.jpg',
        story: {
          whoCame: 'Tiny 10.6-kg rover Sojourner (the size of a microwave oven) and the Pathfinder lander proved that mobile robotic exploration of other planets was possible.',
          theJourney: 'Launched December 4, 1996, on a direct trajectory without entering orbit first.',
          theLanding: 'On July 4, 1997, Pathfinder pioneered the revolutionary airbag landing system — bouncing across the Martian surface 15 times before coming to rest in Ares Vallis.',
          whatTheyDid: 'Petal solar panels opened, and little Sojourner rolled down the ramp. It analyzed rocks nicknamed "Barnacle Bill" and "Yogi", finding volcanic andesite rocks shaped by catastrophic ancient floodwaters.',
          whoWentAndLeft: 'Pathfinder sent 2.3 billion bits of data before its battery drained. Pathfinder and Sojourner rest side-by-side in Ares Vallis.'
        },
        artifactsLeft: ['Pathfinder Lander base', 'Sojourner Rover', 'Deflated landing airbags']
      },
      {
        id: 'opportunity',
        name: 'Opportunity (MER-B): The Martian Marathoner',
        shortName: 'Opportunity',
        year: 2004,
        category: 'robotic',
        agency: '🇺🇸 NASA',
        badge: '🏃 45 KM MARATHON & WATER DISCOVERY',
        landingSite: 'Eagle Crater, Meridiani Planum',
        coordinates: { lat: -1.948, lon: -5.529 },
        astronauts: null,
        spacecraft: 'Delta II Heavy, Opportunity Rover (185 kg)',
        stayDuration: '14 years, 138 days (Designed for 90 days!)',
        sampleMass: 'Analysis of hundreds of rock outcrops',
        outcome: 'Operated until 2018; rests in Perseverance Valley',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/NASA_Mars_Rover.jpg/800px-NASA_Mars_Rover.jpg',
        story: {
          whoCame: 'Solar-powered twin rover Opportunity explored Mars for nearly 15 years, driving a full marathon (45.16 km) — more than any wheeled vehicle on another world.',
          theJourney: 'Launched July 7, 2003, traveling 456 million km to the Red Planet.',
          theLanding: 'On January 25, 2004, Opportunity bounced in its airbags and scored an interplanetary hole-in-one, rolling to a stop inside the small 22-meter Eagle Crater.',
          whatTheyDid: 'Immediately found microscopic hematite spheres nicknamed "blueberries" and sulfate rock strata, proving that warm, acidic liquid water once soaked the Martian ground for millions of years.',
          whoWentAndLeft: 'In June 2018, a catastrophic planet-encircling dust storm blocked all sunlight from Opportunity\'s solar panels. Its final transmission: "My battery is low and it\'s getting dark." It rests forever in Perseverance Valley.'
        },
        artifactsLeft: ['Opportunity Rover', 'Heat Shield impact site', 'Eagle Crater lander base']
      },
      {
        id: 'curiosity',
        name: 'Curiosity (MSL): Nuclear Lab Climbing Mount Sharp',
        shortName: 'Curiosity Rover',
        year: 2012,
        category: 'robotic',
        agency: '🇺🇸 NASA',
        badge: '🤖 NUCLEAR ROVER & HABITABLE LAKE',
        landingSite: 'Gale Crater (Bradbury Landing)',
        coordinates: { lat: -4.589, lon: 137.441 },
        astronauts: null,
        spacecraft: 'Atlas V 541, MSL Sky Crane & Curiosity Rover (899 kg)',
        stayDuration: 'Active since August 6, 2012 (Over 12 years!)',
        sampleMass: '40+ drilled rock powder samples analyzed',
        outcome: 'Active & climbing Mount Sharp today',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg/800px-Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg',
        story: {
          whoCame: 'A car-sized, 1-ton mobile chemistry laboratory powered by a Plutonium-238 nuclear battery (MMRTG), equipped with lasers, drills, and cameras.',
          theJourney: 'Launched November 26, 2011 from Cape Canaveral atop an Atlas V rocket.',
          theLanding: 'Executed the legendary "Seven Minutes of Terror" on August 6, 2012. Atmospheric friction, supersonic parachute, and a rocket-powered Sky Crane lowered Curiosity onto its 6 wheels with zero dust cloud.',
          whatTheyDid: 'Confirmed that ancient Gale Crater was once an oasis of drinkable fresh water lakes with neutral pH, containing organic carbon molecules, sulfur, nitrogen, oxygen, and phosphorus — everything required for microscopic life.',
          whoWentAndLeft: 'Still actively roving and climbing Mount Sharp! Has driven over 32 km and drilled into dozens of Martian rocks.'
        },
        artifactsLeft: ['Sky Crane impact crash site', 'Descent heat shield', 'Active Curiosity Rover']
      },
      {
        id: 'insight',
        name: 'InSight: Listening to the Pulse of Mars',
        shortName: 'InSight Lander',
        year: 2018,
        category: 'robotic',
        agency: '🇺🇸 NASA / CNES / DLR',
        badge: '📡 SEISMOMETER & MARSQUAKES',
        landingSite: 'Elysium Planitia',
        coordinates: { lat: 4.502, lon: 135.623 },
        astronauts: null,
        spacecraft: 'Atlas V 401, InSight lander, twin MarCO CubeSats',
        stayDuration: '4 years (November 2018 – December 2022)',
        sampleMass: '1,319 marsquakes recorded',
        outcome: 'Completed mission; resting at Elysium Planitia',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/InSight_Lander_on_Mars_PIA23074.jpg/800px-InSight_Lander_on_Mars_PIA23074.jpg',
        story: {
          whoCame: 'The first geophysics probe dedicated to studying the deep interior, crust, mantle, and molten liquid core of Mars.',
          theJourney: 'Launched May 5, 2018 from Vandenberg Space Force Base, California.',
          theLanding: 'Touched down smoothly on November 26, 2018 in the flat volcanic plains of Elysium Planitia.',
          whatTheyDid: 'Placed the SEIS ultra-sensitive seismometer directly on the ground under a wind shield. Detected over 1,300 marsquakes (including a magnitude 4.7 monster) and meteoroid impacts, mapping the size of Mars\'s liquid iron core.',
          whoWentAndLeft: 'Martian dust gradually blanketed its solar panels. On December 15, 2022, InSight signed off with its final message: "My power is really low, so this may be the last image I can send... don\'t worry about me: my time here has been both productive and serene." It rests in Elysium Planitia.'
        },
        artifactsLeft: ['InSight Lander base', 'SEIS Seismometer on ground', 'Heat probe mole']
      },
      {
        id: 'perseverance',
        name: 'Perseverance & Ingenuity: Searching for Ancient Life & Alien Flight',
        shortName: 'Perseverance & Ingenuity',
        year: 2021,
        category: 'robotic',
        agency: '🇺🇸 NASA',
        badge: '🚁 FIRST ALIEN FLIGHT & SAMPLE CACHING',
        landingSite: 'Jezero Crater (Octavia E. Butler Landing)',
        coordinates: { lat: 18.380, lon: 77.580 },
        astronauts: null,
        spacecraft: 'Atlas V 541, Perseverance Rover (1,025 kg) & Ingenuity Helicopter (1.8 kg)',
        stayDuration: 'Active since February 18, 2021',
        sampleMass: '24+ hermetically sealed core sample tubes cached',
        outcome: 'Active in Jezero Crater delta',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Perseverance_Selfie_at_Rochette.jpg/800px-Perseverance_Selfie_at_Rochette.jpg',
        story: {
          whoCame: 'NASA\'s most advanced astrobiology rover Perseverance and the historic twin-rotor Ingenuity helicopter — the first powered, controlled aircraft on another planet.',
          theJourney: 'Launched July 30, 2020 during the peak pandemic summer.',
          theLanding: 'On February 18, 2021, Perseverance used terrain-relative navigation to touch down inside Jezero Crater right next to a 3.5-billion-year-old river delta.',
          whatTheyDid: 'Ingenuity proved powered flight in Mars\'s thin 1% atmosphere, executing 72 flights (flying 17 km total!). Perseverance converted Martian atmospheric CO₂ into breathable Oxygen with MOXIE, and drilled core rock samples, sealing them in titanium tubes for the future Mars Sample Return mission.',
          whoWentAndLeft: 'Ingenuity retired with rotor damage after flight 72 and rests at "Neruda airfield". Perseverance is actively climbing the rim of Jezero Crater!'
        },
        artifactsLeft: ['Cached titanium sample tubes on surface', 'Ingenuity Helicopter', 'Active Perseverance Rover']
      },
      {
        id: 'zhurong',
        name: 'Zhurong: China\'s First Mars Rover',
        shortName: 'Zhurong Rover',
        year: 2021,
        category: 'robotic',
        agency: '🇨🇳 CNSA (China)',
        badge: '🤖 CHINA\'S FIRST MARS TOUCHDOWN',
        landingSite: 'Utopia Planitia',
        coordinates: { lat: 25.066, lon: 109.925 },
        astronauts: null,
        spacecraft: 'Long March 5 rocket, Tianwen-1 orbiter, lander & Zhurong rover (240 kg)',
        stayDuration: '358 Earth days (May 2021 – May 2022)',
        sampleMass: 'Ground-penetrating radar across 1.9 km track',
        outcome: 'Completed mission; resting in Utopia Planitia',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Zhurong_rover_selfie.jpg/800px-Zhurong_rover_selfie.jpg',
        story: {
          whoCame: 'Named after the Chinese mythological god of fire, Zhurong made China the second nation in history to successfully operate a rover on Mars.',
          theJourney: 'Launched July 23, 2020, entered Mars orbit in February 2021.',
          theLanding: 'On May 15, 2021, the lander used aerodynamic braking, a parachute, and retrorockets to set down safely in Utopia Planitia.',
          whatTheyDid: 'Drove 1,921 meters across the plains, dropping a remote wireless camera to snap a stunning selfie. Subsurface radar detected evidence of catastrophic ancient oceanic floods.',
          whoWentAndLeft: 'Entered hibernation for the cold Martian winter in May 2022 and remains on the plains of Utopia.'
        },
        artifactsLeft: ['Zhurong Rover', 'Tianwen-1 Landing Platform']
      },
      {
        id: 'human-mars-base',
        name: 'Mars Base Alpha: Humanity\'s Multiplanetary Frontier',
        shortName: 'Human Mars Colony',
        year: '2030s+',
        category: 'future',
        agency: '🇺🇸 NASA / SpaceX / International Coalition',
        badge: '👨‍🚀 CREWED FIRST INTERPLANETARY PIONEERS',
        landingSite: 'Arcadia Planitia (Subsurface Glacier Plains)',
        coordinates: { lat: 39.300, lon: -171.000 },
        astronauts: ['First Human Mars Crew (Engineers, Biologists, Geologists, Pilots)'],
        spacecraft: 'SpaceX Starship Mars Transfer Fleet, NASA Nuclear Thermal Propulsion',
        stayDuration: '500+ Sols (waiting for planetary alignment return window)',
        sampleMass: 'In-situ resource utilization (ISRU) fuel production & greenhouse agriculture',
        outcome: 'The beginning of human civilization on Mars',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valles_Marineris_MOLA_zoom_64.jpg/800px-Valles_Marineris_MOLA_zoom_64.jpg',
        story: {
          whoCame: 'The first generation of human Martian pioneers: stepping out into the red dust in pressurized environmental suits.',
          theJourney: 'A 6-to-8 month interplanetary voyage across hundreds of millions of kilometers of deep space.',
          theLanding: 'Starship performs its aerodynamic belly-flop atmospheric descent and vertical rocket-powered landing on the plains of Arcadia Planitia.',
          whatTheyDid: 'Extract water from underground glaciers, convert atmospheric CO₂ into methane rocket propellant (Sabatier reaction), construct pressurized dome habitats, and search for fossilized Martian life.',
          whoWentAndLeft: 'Some astronauts will return to Earth on the return launch window 2 years later; others will remain to permanently expand humanity\'s first city on Mars.'
        },
        artifactsLeft: ['Mars Base Alpha Habitats', 'Solar array farms', 'Propellant plant', 'Starship landing pads']
      }
    ],

    surfaceFeatures: [
      {
        name: 'Olympus Mons',
        type: 'Volcano',
        icon: '🌋',
        description: 'The tallest volcano in the entire solar system — 21.9 km high (2.5× Mount Everest!) and 600 km wide.',
        coordinates: '18.65°N, 226.2°E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Olympus_Mons_alt.jpg/800px-Olympus_Mons_alt.jpg',
        fact: 'Olympus Mons is so large it would cover the entire state of Arizona with its base.'
      },
      {
        name: 'Valles Marineris',
        type: 'Canyon',
        icon: '🏔️',
        description: 'The solar system\'s greatest canyon system — stretching 4,000 km across, up to 7 km deep, and 200 km wide.',
        coordinates: '13.9°S, 59.2°W',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valles_Marineris_MOLA_zoom_64.jpg/800px-Valles_Marineris_MOLA_zoom_64.jpg',
        fact: 'Spans 20% of Mars\'s entire circumference.'
      },
      {
        name: 'Jezero Crater',
        type: 'Ancient Lake Delta',
        icon: '🌊',
        description: 'A 49-km wide impact crater that held a lake 3.5 billion years ago. Perseverance is caching samples here.',
        coordinates: '18.4°N, 77.7°E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Jezero_Crater_Ancient_Lake_%28NASA%29.jpg/800px-Jezero_Crater_Ancient_Lake_%28NASA%29.jpg',
        fact: 'Ancient river sediment layers here may preserve signs of ancient microbial life.'
      },
      {
        name: 'Gale Crater',
        type: 'Crater & Mountain',
        icon: '🤖',
        description: '154-km wide crater with Mount Sharp in the center. Curiosity rover has explored over 32 km of strata here.',
        coordinates: '5.4°S, 137.8°E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gale_Crater_vista_from_Curiosity.jpg/800px-Gale_Crater_vista_from_Curiosity.jpg',
        fact: 'Curiosity confirmed Gale Crater once had freshwater lakes with neutral pH.'
      }
    ],

    funFacts: [
      { icon: '🌅', title: 'Blue Sunsets', text: 'While Earth\'s sunsets are fiery red/orange, Martian sunsets are luminous BLUE due to fine dust scattering light.' },
      { icon: '🌪️', title: 'Giant Dust Devils', text: 'Mars has monster dust devils up to 8 km tall that regularly sweep across the plains.' },
      { icon: '🧲', title: 'Lost Magnetic Shield', text: 'Mars lost its global magnetic shield ~4 billion years ago when its core cooled, allowing solar wind to strip its atmosphere.' },
      { icon: '🌡️', title: 'The 24h 37m Sol', text: 'A Martian day (Sol) is only 37 minutes longer than Earth\'s — nearly identical to our circadian rhythm!' }
    ]
  }
};

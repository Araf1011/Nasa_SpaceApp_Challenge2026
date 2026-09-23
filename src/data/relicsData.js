/**
 * NASA Cosmic Relics Dataset
 * Complete catalogue of iconic hardware left across the solar system since the 1960s.
 * Formatted for interactive 3D visual models and vertical storyline flows.
 */

export const RELICS_DATA = [
  {
    id: 'curiosity-msl',
    name: 'Curiosity Mars Science Laboratory',
    shortName: 'Curiosity Rover',
    category: 'mars',
    domainLabel: 'Mars',
    launchYear: 2011,
    landingYear: 2012,
    launchDate: 'November 26, 2011',
    arrivalDate: 'August 6, 2012',
    arrivalEvent: 'Landed in Gale Crater, Mars via Sky Crane',
    status: 'active',
    statusLabel: 'Active & Climbing Mount Sharp',
    statusClass: 'status-active',
    location: 'Gale Crater & Mount Sharp, Mars',
    coordinates: '4.5895° S, 137.4417° E',
    distanceAU: 1.45,
    baseDistanceKm: 217000000,
    speedKmS: 24.1,
    oneWayLightSeconds: 720,
    modelType: 'curiosity-rover',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg/1280px-Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg',
    heroColor: '#c1440e',
    galleryImages: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg/1024px-Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg', caption: 'Curiosity robotic arm on Mars' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/PIA16239_High-Resolution_Self-Portrait_by_Curiosity_Rover_Arm_Camera.jpg/1024px-PIA16239_High-Resolution_Self-Portrait_by_Curiosity_Rover_Arm_Camera.jpg', caption: 'Self-portrait in Gale Crater' }
    ],
    storyLine: {
      launch: {
        year: '2011',
        title: 'Launched from Cape Canaveral',
        desc: 'Blasted into space atop an Atlas V 541 rocket carrying humanity\'s most ambitious robotic laboratory.'
      },
      arrival: {
        year: '2012',
        title: 'Landed in Gale Crater, Mars',
        desc: 'Executed the legendary "Seven Minutes of Terror", lowered to the Martian dust by a rocket-powered Sky Crane.'
      },
      hardware: {
        icon: '🤖',
        title: 'Curiosity Rover Chassis',
        desc: 'A 900-kg car-sized mobile robot powered by a Plutonium-238 nuclear battery (MMRTG), equipped with a 2-meter robotic arm and 6-wheel rocker-bogie mobility system.',
        instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Curiosity%27s_MAHLI_Arm_Camera.jpg/1280px-Curiosity%27s_MAHLI_Arm_Camera.jpg'
      },
      instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Curiosity%27s_MAHLI_Arm_Camera.jpg/1280px-Curiosity%27s_MAHLI_Arm_Camera.jpg',
      instruments: [
        {
          group: 'Cameras',
          icon: '📷',
          items: [
            {
              name: 'Mastcam',
              desc: 'High-resolution true-color stereo cameras mounted on the 2-meter Remote Sensing Mast, capturing panoramas and video of Mars terrain.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PIA16105-Curiosity-Mastcam-20120903.jpg/800px-PIA16105-Curiosity-Mastcam-20120903.jpg',
              specs: { resolution: '1600×1200 px', focal_length: '100mm / 34mm', fps: '10 fps video', mass: '2.3 kg' },
              partKey: 'mast'
            },
            {
              name: 'MAHLI',
              desc: 'Mars Hand Lens Imager on the robotic arm delivers close-up microscope-quality images of rocks and soil, resolving grains as small as 12.5 µm.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg/800px-Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg',
              specs: { resolution: '1600×1200 px', min_focus: '2.1 cm', depth_of_field: '0.5mm–∞', mass: '0.17 kg' },
              partKey: 'arm'
            },
            {
              name: 'MARDI',
              desc: 'Mars Descent Imager filmed the ground rushing up during the Sky Crane landing, creating a movie of the descent trajectory.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/PIA16239_High-Resolution_Self-Portrait_by_Curiosity_Rover_Arm_Camera.jpg/800px-PIA16239_High-Resolution_Self-Portrait_by_Curiosity_Rover_Arm_Camera.jpg',
              specs: { resolution: '1600×1200 px', fps: '4 fps', field_of_view: '90°', mass: '0.17 kg' },
              partKey: 'chassis'
            }
          ]
        },
        {
          group: 'Spectrometers & Lasers',
          icon: '🔬',
          items: [
            {
              name: 'ChemCam',
              desc: 'Vaporizes rocks up to 7 meters away with a 1-million-watt laser pulse and analyzes the resulting glowing plasma with a spectrometer — like a chemistry lab on a laser beam.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Chemcam_mast_unit.jpg/800px-Chemcam_mast_unit.jpg',
              specs: { laser: 'Nd:YAG 1064nm', power: '1 MW peak', range: '1–7 m', mass: '10 kg' },
              partKey: 'mast'
            },
            {
              name: 'APXS',
              desc: 'Alpha Particle X-Ray Spectrometer placed directly against rocks measures the abundances of 10+ major elements crucial for understanding Martian geology.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg/800px-Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg',
              specs: { elements: '10+ major elements', source: '³Cm-244 radioactive', integration: '15 min nominal', mass: '0.17 kg' },
              partKey: 'arm'
            },
            {
              name: 'SAM Suite',
              desc: 'Sample Analysis at Mars — a miniature organic chemistry laboratory with ovens, gas chromatograph, mass spectrometer, and tunable laser detecting life-essential compounds.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/MSL_SAM_instrument.jpg/800px-MSL_SAM_instrument.jpg',
              specs: { mass: '38 kg', volume: '15.1 L', temp_range: 'up to 1000°C', channels: 'GC-MS + TLS + QMS' },
              partKey: 'chassis'
            }
          ]
        },
        {
          group: 'Radiation & Subsurface',
          icon: '☢️',
          items: [
            {
              name: 'RAD',
              desc: 'Radiation Assessment Detector measured cosmic ray and solar energetic particle doses for future human Mars missions during both cruise and surface operations.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Curiosity%27s_MAHLI_Arm_Camera.jpg/960px-Curiosity%27s_MAHLI_Arm_Camera.jpg',
              specs: { energy_range: '0.1–100 MeV', particle_types: 'protons, He, Fe', dose_rate: 'µGy/day', mass: '0.19 kg' },
              partKey: 'chassis'
            },
            {
              name: 'DAN',
              desc: 'Dynamic Albedo of Neutrons fires pulses into the ground and times returning neutrons to reveal subsurface hydrogen and water ice within 1 meter of the surface.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PIA16105-Curiosity-Mastcam-20120903.jpg/960px-PIA16105-Curiosity-Mastcam-20120903.jpg',
              specs: { depth: '0.5–1 m', neutron_energy: '14.1 MeV', sensitivity: '0.1% H₂O', mass: '4.2 kg' },
              partKey: 'chassis'
            }
          ]
        },
        {
          group: 'Environmental Sensors',
          icon: '🌡️',
          items: [
            {
              name: 'REMS',
              desc: 'Rover Environmental Monitoring Station tracks Martian atmospheric pressure, temperature, relative humidity, wind speed/direction, and ultraviolet radiation in real time.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Chemcam_mast_unit.jpg/960px-Chemcam_mast_unit.jpg',
              specs: { temp_range: '-130°C to +70°C', pressure: '1–1150 Pa', wind: '0–70 m/s', mass: '1.6 kg' },
              partKey: 'mast'
            }
          ]
        }
      ],
      science: {
        title: 'Ancient Habitable Freshwater Lake',
        desc: 'Drilled mudstones at Yellowknife Bay to prove Gale Crater was once an ancient freshwater lake with non-acidic water, essential organic carbon, nitrogen, sulfur, and phosphorus capable of supporting microbial life.'
      },
      currentStatus: {
        title: 'Active Mission Sol 4,500+',
        desc: 'Still actively climbing Mount Sharp, traversing sulfate-bearing layers to uncover how ancient Mars dried up into a desert world.'
      }
    },
    funFact: "Curiosity sings 'Happy Birthday' to itself every August on Mars by vibrating its Sample Analysis instrument motors at musical frequencies!",
    audioSimulation: 'radio_carrier',
    audioTitle: 'Curiosity Mars Wheel Telemetry Bleeps',
    badgeAwarded: 'martian-vanguard'
  },
  {
    id: 'perseverance-ingenuity',
    name: 'Perseverance Rover & Ingenuity Helicopter',
    shortName: 'Perseverance & Ingenuity',
    category: 'mars',
    domainLabel: 'Mars',
    launchYear: 2020,
    landingYear: 2021,
    launchDate: 'July 30, 2020',
    arrivalDate: 'February 18, 2021',
    arrivalEvent: 'Touchdown in Jezero Crater River Delta',
    status: 'active',
    statusLabel: 'Active & Caching Samples / 72 Flights Made',
    statusClass: 'status-active',
    location: 'Jezero Crater Delta, Mars',
    coordinates: '18.38° N, 77.58° E',
    distanceAU: 1.45,
    baseDistanceKm: 217000000,
    speedKmS: 24.1,
    oneWayLightSeconds: 720,
    modelType: 'perseverance-rover',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg/1280px-PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg',
    heroColor: '#e63946',
    galleryImages: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ingenuity_helicopter_on_Mars_PIA24584.jpg/1280px-Ingenuity_helicopter_on_Mars_PIA24584.jpg', caption: 'Ingenuity helicopter first flight' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/PIA24836-MarsJezeroCrater-AncientDelta-Perseverance-20210818.jpg/1280px-PIA24836-MarsJezeroCrater-AncientDelta-Perseverance-20210818.jpg', caption: 'Ancient delta in Jezero Crater' }
    ],
    storyLine: {
      launch: {
        year: '2020',
        title: 'Launched during Planetary Window',
        desc: 'Launched from Florida during the peak 2020 Earth-Mars alignment with an onboard technology demonstrator helicopter.'
      },
      arrival: {
        year: '2021',
        title: 'Landed at Ancient River Delta',
        desc: 'Autonomous Terrain-Relative Navigation steered the rover away from boulder fields onto the smooth floor of Jezero Crater.'
      },
      hardware: {
        icon: '🤖',
        title: 'Perseverance & Ingenuity Dual System',
        instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ingenuity_helicopter_on_Mars_PIA24584.jpg/1280px-Ingenuity_helicopter_on_Mars_PIA24584.jpg',
        desc: 'A heavy astrobiology rover paired with the 1.8-kg Ingenuity coaxial rotorcraft, carrying a coring drill and titanium sample cache tubes.'
      },
      instruments: [
        {
          group: 'Aviation & Cameras',
          icon: '🚁',
          items: [
            {
              name: 'Ingenuity Rotorcraft',
              desc: 'First powered aircraft to fly on another planet — dual coaxial carbon-fiber blades spin at 2,400 RPM in the ultra-thin 1% Martian atmosphere across 72 flights.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ingenuity_helicopter_on_Mars_PIA24584.jpg/800px-Ingenuity_helicopter_on_Mars_PIA24584.jpg',
              specs: { mass: '1.8 kg', rotor_rpm: '2400 RPM', altitude: 'up to 24 m', flights: '72 flights' },
              partKey: 'chassis'
            },
            {
              name: 'Mastcam-Z',
              desc: 'Zoomable stereo color camera system providing 3D panoramic images and high-definition video, capable of capturing geological features from afar.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ingenuity_helicopter_on_Mars_PIA24584.jpg/960px-Ingenuity_helicopter_on_Mars_PIA24584.jpg',
              specs: { zoom: '3.6× optical zoom', resolution: '1648×1214 px', stereo: 'true stereo 3D', mass: '4.6 kg' },
              partKey: 'mast'
            },
            {
              name: 'SuperCam',
              desc: 'Laser-induced breakdown spectroscopy system with an onboard acoustic microphone — the first instrument to record and transmit sounds from another planet.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg/960px-PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg',
              specs: { laser: 'Nd:YAG 532nm / 1064nm', range: '1–7 m', microphone: 'yes — records Mars sound', mass: '8.8 kg' },
              partKey: 'mast'
            }
          ]
        },
        {
          group: 'Astrobiology & Spectrometers',
          icon: '🔬',
          items: [
            {
              name: 'SHERLOC',
              desc: 'Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals — deep ultraviolet laser fluorescence that can detect aromatic organic molecules invisible to other instruments.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg/960px-Mars_Curiosity_Rover_Arm_%28June_2019%29.jpg',
              specs: { laser: 'Deep UV 248.6nm', mapping: '7×7 mm area', sensitivity: 'ppb organics', mass: '2.3 kg' },
              partKey: 'arm'
            },
            {
              name: 'PIXL',
              desc: 'Planetary Instrument for X-ray Lithochemistry — micro-focus X-ray fluorescence mapper that creates chemical element maps of rock grain boundaries at 100 µm resolution.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg/960px-PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg',
              specs: { resolution: '100 µm per pixel', elements: '27 elements', beam_size: '120 µm', mass: '2.4 kg' },
              partKey: 'arm'
            }
          ]
        },
        {
          group: 'ISRU & Subsurface',
          icon: '⚙️',
          items: [
            {
              name: 'MOXIE',
              desc: 'Mars Oxygen ISRU Experiment — successfully converted Martian CO₂ into breathable O₂ at 10 g/hr, proving life-support oxygen production on Mars is feasible for future astronauts.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ingenuity_helicopter_on_Mars_PIA24584.jpg/960px-Ingenuity_helicopter_on_Mars_PIA24584.jpg',
              specs: { output: '10 g/hr O₂', temp: '800°C operating', purity: '>99.6% O₂', mass: '17.1 kg' },
              partKey: 'chassis'
            },
            {
              name: 'RIMFAX',
              desc: 'Radar Imager for Mars Subsurface Experiment — ground-penetrating radar that images geological layers up to 10 meters underground from the moving rover.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg/960px-PIA24542-MarsPerceveranceRover-Selfie-20210420.jpg',
              specs: { depth: 'up to 10 m', frequency: '150–1200 MHz', resolution: '~30 cm vertical', mass: '2.6 kg' },
              partKey: 'chassis'
            }
          ]
        },
        {
          group: 'Atmospheric Weather',
          icon: '💨',
          items: [
            {
              name: 'MEDA',
              desc: 'Mars Environmental Dynamics Analyzer records temperature, wind speed, relative humidity, pressure, and radiation — a comprehensive weather station updating NASA every hour.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ingenuity_helicopter_on_Mars_PIA24584.jpg/960px-Ingenuity_helicopter_on_Mars_PIA24584.jpg',
              specs: { wind_range: '0–70 m/s', pressure: '0.5–1150 Pa', humidity: '0–100% RH', mass: '5.5 kg' },
              partKey: 'mast'
            }
          ]
        }
      ],
      science: {
        title: 'First Flight on Another World & Sample Caching',
        desc: 'Ingenuity completed 72 historic flights across 3 years. Perseverance sealed dozens of rock core samples in sterile titanium tubes, ready to be collected and brought to Earth.'
      },
      currentStatus: {
        title: 'Ascending Crater Rim with Pristine Cores',
        desc: 'Currently navigating the ancient Jezero river channel, analyzing sedimentary rocks that preserved ancient water activity 3.8 billion years ago.'
      }
    },
    funFact: "Ingenuity carried a small swatch of fabric from the Wright Brothers' original 1903 Flyer taped beneath its solar array!",
    audioSimulation: 'martian_wind',
    audioTitle: 'Actual Perseverance Acoustic Microphone Audio (Mars Wind)',
    badgeAwarded: 'martian-vanguard'
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 Interstellar Mission',
    shortName: 'Voyager 1',
    category: 'deep-space',
    domainLabel: 'Interstellar Space',
    launchYear: 1977,
    landingYear: null,
    launchDate: 'September 5, 1977',
    arrivalDate: 'August 25, 2012',
    arrivalEvent: 'Crossed the Heliopause into Interstellar Space',
    status: 'active',
    statusLabel: 'Active & Traversing Interstellar Abyss',
    statusClass: 'status-active',
    location: 'Interstellar Space (Constellation Ophiuchus)',
    coordinates: 'Dec: +12° 27\', RA: 17h 16m',
    distanceAU: 163.8,
    baseDistanceKm: 24500000000,
    speedKmS: 17.0,
    oneWayLightSeconds: 81700,
    modelType: 'voyager-probe',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Voyager_spacecraft.jpg/1280px-Voyager_spacecraft.jpg',
    heroColor: '#4361ee',
    galleryImages: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pale_Blue_Dot.png/750px-Pale_Blue_Dot.png', caption: 'Pale Blue Dot — Earth from 6 billion km' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/GoldenRecord_WideShot.jpg/1024px-GoldenRecord_WideShot.jpg', caption: 'The Golden Record aboard Voyager' }
    ],
    storyLine: {
      launch: {
        year: '1977',
        title: 'Launched on the Grand Tour',
        desc: 'Launched on a Titan IIIE rocket to take advantage of a once-every-176-year geometric alignment of the outer planets.'
      },
      arrival: {
        year: '2012',
        title: 'Crossed the Solar Boundary (Heliopause)',
        desc: 'Became the very first human-made object to venture beyond our Sun\'s solar wind bubble and enter pristine interstellar space.'
      },
      hardware: {
        icon: '🛰️',
        title: 'Voyager Spacecraft Bus & Golden Record',
        instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Voyager_spacecraft.jpg/1280px-Voyager_spacecraft.jpg',
        desc: 'An 825-kg probe centered around a 3.7-meter high-gain parabolic reflector dish, powered by three Multi-Hundred-Watt RTG plutonium units and carrying the Golden Record.'
      },
      instruments: [
        {
          group: 'Cosmic & Plasma Sensors',
          icon: '⚡',
          items: [
            {
              name: 'PWS (Plasma Wave)',
              desc: 'Plasma Wave Subsystem measuring vibrations of interstellar gas and electron plasma oscillations at the heliosphere edge.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Voyager_spacecraft.jpg/800px-Voyager_spacecraft.jpg',
              specs: { frequency: '10 Hz – 56 kHz', sensors: '2× 10m dipole antennas', sensitivity: 'nV/m', mass: '1.4 kg' },
              partKey: 'bus'
            },
            {
              name: 'CRS (Cosmic Ray)',
              desc: 'Cosmic Ray Subsystem detecting high-energy galactic particles, providing direct proof of entering interstellar space.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Voyager_spacecraft.jpg/800px-Voyager_spacecraft.jpg',
              specs: { energy: '0.5 – 500 MeV', particles: 'e⁻, p⁺, Alpha, Z≥3', detectors: 'Telescope solid-state stack', mass: '7.5 kg' },
              partKey: 'bus'
            },
            {
              name: 'MAG (Magnetometer)',
              desc: 'Triaxial Fluxgate Magnetometer mounted on a 13-meter deployable fiberglass boom to measure weak interstellar magnetic fields.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Voyager_spacecraft.jpg/800px-Voyager_spacecraft.jpg',
              specs: { boom: '13m deployable', sensors: '4 Triaxial Fluxgates', range: '±8 to ±50,000 nT', mass: '5.6 kg' },
              partKey: 'mag_boom'
            }
          ]
        },
        {
          group: 'Cultural Artifact',
          icon: '📀',
          items: [
            {
              name: 'The Golden Record',
              desc: '12-inch gold-plated copper phonograph record encoded with 115 images, sounds of nature, music, and spoken greetings from Earth.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/GoldenRecord_WideShot.jpg/1024px-GoldenRecord_WideShot.jpg',
              specs: { diameter: '12-inch (30 cm)', material: 'Gold-plated copper', speed: '16⅔ RPM', cover: 'Ultra-pure Uranium-238 clock' },
              partKey: 'record'
            }
          ]
        },
        {
          group: 'Historic Imaging',
          icon: '📷',
          items: [
            {
              name: 'Imaging Science Subsystem',
              desc: 'Narrow and Wide angle vidicon cameras that captured Jupiter\'s Great Red Spot, Saturn\'s rings, and the iconic 1990 "Pale Blue Dot".',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pale_Blue_Dot.png/750px-Pale_Blue_Dot.png',
              specs: { resolution: '800×800 Vidicon', focal_length: '200mm / 1500mm', filters: '8 optical filters', mass: '38.2 kg' },
              partKey: 'dish'
            }
          ]
        }
      ],
      science: {
        title: 'Direct Measurement of Interstellar Medium',
        desc: 'Discovered active volcanoes on Jupiter\'s moon Io, intricate ring structures at Saturn, and measured the density of raw interstellar plasma outside our solar system.'
      },
      currentStatus: {
        title: 'Transmitting from 24.5 Billion Kilometers Away',
        desc: 'Communicates daily with NASA Deep Space Network antennas with a 22.7-hour one-way light delay at a faint 160 bits per second.'
      }
    },
    funFact: "Voyager 1's onboard computer has just 69 kilobytes of memory—thousands of times smaller than a single smartphone photo!",
    audioSimulation: 'plasma_waves',
    audioTitle: 'Actual Voyager Interstellar Plasma Wave Sound',
    badgeAwarded: 'interstellar-pathfinder'
  },
  {
    id: 'jwst-telescope',
    name: 'James Webb Space Telescope (JWST)',
    shortName: 'Webb Space Telescope',
    category: 'lagrange',
    domainLabel: 'Sun-Earth L2 Lagrange Point',
    launchYear: 2021,
    landingYear: 2022,
    launchDate: 'December 25, 2021',
    arrivalDate: 'January 24, 2022',
    arrivalEvent: 'Inserted into Halo Orbit at Sun-Earth L2',
    status: 'active',
    statusLabel: 'Active & Peering into Cosmic Dawn',
    statusClass: 'status-active',
    location: 'Sun-Earth L2 Point (1.5M km from Earth)',
    coordinates: 'Halo Orbit L2',
    distanceAU: 0.01,
    baseDistanceKm: 1500000,
    speedKmS: 0.2,
    oneWayLightSeconds: 5.0,
    modelType: 'jwst-telescope',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Webb%27s_First_Deep_Field.jpg/1280px-Webb%27s_First_Deep_Field.jpg',
    heroColor: '#7b2d8b',
    galleryImages: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Webb%27s_First_Deep_Field.jpg/1280px-Webb%27s_First_Deep_Field.jpg', caption: "Webb's first deep field — thousands of ancient galaxies" },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Carina_Nebula_by_the_James_Webb_Space_Telescope.png/1280px-Carina_Nebula_by_the_James_Webb_Space_Telescope.png', caption: 'Cosmic Cliffs in the Carina Nebula' }
    ],
    storyLine: {
      launch: {
        year: '2021',
        title: 'Christmas Day Launch on Ariane 5',
        desc: 'Folded like cosmic origami inside the rocket fairing from Europe\'s Spaceport in Kourou, French Guiana.'
      },
      arrival: {
        year: '2022',
        title: 'Arrival at Lagrange Point 2',
        desc: 'Completed over 300 single-point-of-failure deployment steps, unfolding its giant sunshield and golden primary mirrors in deep space.'
      },
      hardware: {
        icon: '🔭',
        title: 'Webb Observatory Structure',
        instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Carina_Nebula_by_the_James_Webb_Space_Telescope.png/1280px-Carina_Nebula_by_the_James_Webb_Space_Telescope.png',
        desc: 'A 6.5-meter gold-coated beryllium primary mirror array protected by a 5-layer tennis-court-sized Kapton sunshield maintaining a -233°C cryogenic temperature.'
      },
      instruments: [
        {
          group: 'Infrared Cameras',
          icon: '✨',
          items: [
            {
              name: 'NIRCam',
              desc: 'Near-Infrared Camera imaging the first stars and earliest galaxies with ultra-high sensitivity and wavefront sensing.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Carina_Nebula_by_the_James_Webb_Space_Telescope.png/960px-Carina_Nebula_by_the_James_Webb_Space_Telescope.png',
              specs: { wavelength: '0.6 – 5.0 µm', field_of_view: '2.2 × 4.4 arcmin', sensors: '10 H2RG arrays (40 Mpx)', mass: '197 kg' },
              partKey: 'mirror'
            },
            {
              name: 'MIRI',
              desc: 'Mid-Infrared Instrument cooled to 6.7 Kelvin for piercing through dense cosmic dust to witness star and planet birth.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Webb%27s_First_Deep_Field.jpg/960px-Webb%27s_First_Deep_Field.jpg',
              specs: { wavelength: '4.9 – 28.8 µm', temp: '6.7 Kelvin (-266°C)', modes: 'Camera + Spectrograph', mass: '95 kg' },
              partKey: 'mirror'
            }
          ]
        },
        {
          group: 'Spectroscopy',
          icon: '🌈',
          items: [
            {
              name: 'NIRSpec',
              desc: 'Near-Infrared Spectrograph equipped with 250,000 microshutters observing up to 100 distant galaxies simultaneously.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Webb%27s_First_Deep_Field.jpg/960px-Webb%27s_First_Deep_Field.jpg',
              specs: { multiplex: '100 simultaneous spectra', wavelength: '0.6 – 5.3 µm', microshutters: '250,000 cells', mass: '196 kg' },
              partKey: 'bus'
            },
            {
              name: 'NIRISS',
              desc: 'Near-Infrared Imager and Slitless Spectrograph analyzing exoplanet atmospheric compositions during planetary transits.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Carina_Nebula_by_the_James_Webb_Space_Telescope.png/960px-Carina_Nebula_by_the_James_Webb_Space_Telescope.png',
              specs: { modes: 'Wide-field slitless spectroscopy', wavelength: '0.6 – 5.0 µm', target: 'Exoplanet atmospheres', mass: '68 kg' },
              partKey: 'bus'
            }
          ]
        },
        {
          group: 'Cryogenics & Optics',
          icon: '❄️',
          items: [
            {
              name: 'Closed-Loop Cryocooler',
              desc: 'Helium pulse-tube refrigerator chilling MIRI below the temperature of Pluto without consuming expendable coolant.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Webb%27s_First_Deep_Field.jpg/960px-Webb%27s_First_Deep_Field.jpg',
              specs: { cooling_agent: 'Helium-4 closed loop', operating_temp: '6.7 Kelvin', type: 'Pulse-tube compressor', mass: '120 kg' },
              partKey: 'sunshield'
            },
            {
              name: '18 Hex Primary Segments',
              desc: 'Gold-vapor-coated beryllium mirrors aligned to 13-nanometer precision forming a 6.5-meter monolithic optical aperture.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Carina_Nebula_by_the_James_Webb_Space_Telescope.png/960px-Carina_Nebula_by_the_James_Webb_Space_Telescope.png',
              specs: { aperture: '6.5 m diameter', material: 'Beryllium + 100nm Gold', precision: '13.1 nm wavefront', mass: '20.1 kg/segment' },
              partKey: 'mirror'
            }
          ]
        }
      ],
      science: {
        title: 'Unlocking the Earliest Galaxies & Alien Skies',
        desc: 'Captured light from galaxies formed just 300 million years after the Big Bang, discovered carbon dioxide and water vapor in exoplanet atmospheres, and unveiled infant stars in the Carina Nebula.'
      },
      currentStatus: {
        title: 'Operational Prime Science Phase',
        desc: 'Operating with surplus maneuvering propellant expected to sustain science discoveries well beyond 2040.'
      }
    },
    funFact: "Webb's gold mirror layer is only 100 nanometers thick—all 18 mirror segments together use only about a golf ball's worth of gold!",
    audioSimulation: 'radio_chime',
    audioTitle: 'JWST L2 Deep Space Telemetry Downlink',
    badgeAwarded: 'cosmic-astronomer'
  },
  {
    id: 'apollo-11-lrrr',
    name: 'Apollo 11 LRRR & Descent Stage',
    shortName: 'Apollo 11 Relics',
    category: 'moon',
    domainLabel: 'The Moon',
    launchYear: 1969,
    landingYear: 1969,
    launchDate: 'July 16, 1969',
    arrivalDate: 'July 20, 1969',
    arrivalEvent: 'First Human Lunar Landing on Tranquility Base',
    status: 'active_passive',
    statusLabel: 'Still Active (Zero Electricity Needed)',
    statusClass: 'status-active',
    location: 'Mare Tranquillitatis (Sea of Tranquility), Moon',
    coordinates: '0.67408° N, 23.47297° E',
    distanceAU: 0.00257,
    baseDistanceKm: 384400,
    speedKmS: 1.02,
    oneWayLightSeconds: 1.28,
    modelType: 'apollo-lander',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/1024px-Aldrin_Apollo_11_original.jpg',
    heroColor: '#d4a017',
    galleryImages: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/NASA-Apollo11-Lander.jpg/1280px-NASA-Apollo11-Lander.jpg', caption: 'Eagle lunar module on the Moon' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/NASA-Apollo11-Armstrong-Footprint.jpg/1024px-NASA-Apollo11-Armstrong-Footprint.jpg', caption: "Armstrong's historic bootprint" }
    ],
    storyLine: {
      launch: {
        year: '1969',
        title: 'Liftoff on Saturn V Rocket',
        desc: 'Blasted off from Launch Complex 39A atop the 363-foot Saturn V rocket on humanity\'s first moon landing mission.'
      },
      arrival: {
        year: '1969',
        title: 'Touchdown: "The Eagle Has Landed"',
        desc: 'Neil Armstrong and Buzz Aldrin set down the Lunar Module on the Sea of Tranquility with 25 seconds of fuel remaining.'
      },
      hardware: {
        icon: '🌕',
        title: 'Lunar Module Descent Stage & LRRR',
        instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/1280px-Aldrin_Apollo_11_original.jpg',
        desc: 'An octagonal aluminum structure clad in gold and black Mylar thermal insulation blankets, serving as the launch pad for the ascent stage and home of the Laser Retroreflector.'
      },
      instruments: [
        {
          group: 'Laser Ranging Mirror',
          icon: '💎',
          items: [
            {
              name: 'Suprasil Corner-Cubes',
              desc: '100 fused silica quartz prisms reflecting laser light directly back to Earth observatories to measure Earth-Moon distance to millimeter accuracy.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/960px-Aldrin_Apollo_11_original.jpg',
              specs: { array: '100 fused silica corner cubes', dimension: '46 × 46 cm tray', precision: 'Sub-centimeter range', power_needed: '0 Watts (passive)' },
              partKey: 'lrrr'
            },
            {
              name: 'Passive Thermal Pallet',
              desc: 'Zero electrical power needed—passively survives -130°C lunar nights to +120°C lunar days through open mechanical gimbaling.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/960px-Aldrin_Apollo_11_original.jpg',
              specs: { temp_range: '-130°C to +120°C', design: 'Aluminum open frame', lifetime: 'Indefinite (>55 yrs active)', mass: '25 kg' },
              partKey: 'lrrr'
            }
          ]
        },
        {
          group: 'EASEP Surface Package',
          icon: '📡',
          items: [
            {
              name: 'Passive Seismic Experiment',
              desc: 'First lunar seismometer to detect moonquakes, meteoroid impacts, and lunar tidal flexing caused by Earth\'s gravity.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/960px-Aldrin_Apollo_11_original.jpg',
              specs: { sensors: '3 LP + 1 SP seismometers', power: 'Solar array + RHU', mass: '48 kg', transmitted: '21 days seismic data' },
              partKey: 'base'
            },
            {
              name: 'Solar Wind Foil Sheet',
              desc: 'Sheet of high-purity aluminum foil exposed to solar particles during moonwalk and retrieved before lunar ascent.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/960px-Aldrin_Apollo_11_original.jpg',
              specs: { material: 'Ultra-pure Aluminum (30×140 cm)', exposure: '77 min on Moon', collected: 'He, Ne, Ar noble gases', mass: '0.45 kg' },
              partKey: 'base'
            }
          ]
        },
        {
          group: 'Propulsion & Memorial',
          icon: '🚀',
          items: [
            {
              name: 'Descent Rocket Engine Bell',
              desc: 'Throttleable hypergolic rocket engine that brought the Eagle safely down to Tranquility Base.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/960px-Aldrin_Apollo_11_original.jpg',
              specs: { thrust: '4,500 to 45,000 N', propellant: 'Aerozine 50 / N₂O₄', nozzle: 'Columbium/Titanium alloy', mass: '178 kg' },
              partKey: 'bell'
            },
            {
              name: 'Stainless Steel Plaque',
              desc: 'Affixed to the descent stage ladder: "Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind."',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Aldrin_Apollo_11_original.jpg/960px-Aldrin_Apollo_11_original.jpg',
              specs: { material: 'Stainless Steel (23×18 cm)', mounting: 'Ladder strut', inscription: 'Historic peace declaration', signers: 'Armstrong, Aldrin, Collins, Nixon' },
              partKey: 'base'
            }
          ]
        }
      ],
      science: {
        title: 'Measuring the Moon Drift & Einstein\'s Gravity',
        desc: 'Laser pulses fired from Earth bounce off the Apollo mirror, proving the Moon is drifting away by 3.8 cm every year and confirming Einstein\'s Equivalence Principle to 1 part in 10^13.'
      },
      currentStatus: {
        title: 'Continually Pinged by Observatories',
        desc: 'Apache Point Observatory in New Mexico still regularly fires green laser beams at this mirror, returning data 57+ years later.'
      }
    },
    funFact: "If you shone a laser pointer at this mirror from Earth, the beam would spread out to over 6 kilometers wide by the time it reaches the Moon!",
    audioSimulation: 'laser_pulse',
    audioTitle: 'Apache Point Laser Pulse Echo',
    badgeAwarded: 'lunar-archaeologist'
  },
  {
    id: 'parker-solar-probe',
    name: 'Parker Solar Probe',
    shortName: 'Parker Solar Probe',
    category: 'sun-asteroids',
    domainLabel: 'The Sun (Corona)',
    launchYear: 2018,
    landingYear: null,
    launchDate: 'August 12, 2018',
    arrivalDate: 'April 28, 2021',
    arrivalEvent: 'First Direct Passage Through the Solar Corona',
    status: 'active',
    statusLabel: 'Active & "Touching the Sun"',
    statusClass: 'status-active',
    location: 'Solar Corona Perihelion Orbit',
    coordinates: 'Within 6.1 million km of Sun',
    distanceAU: 0.98,
    baseDistanceKm: 147000000,
    speedKmS: 192.0,
    oneWayLightSeconds: 490,
    modelType: 'parker-probe',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solar_corona.jpg/1280px-Solar_corona.jpg',
    heroColor: '#f77f00',
    galleryImages: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solar_corona.jpg/1280px-Solar_corona.jpg', caption: 'Solar corona during total eclipse' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solar_Flare_and_CME_%281%29.jpg/1280px-Solar_Flare_and_CME_%281%29.jpg', caption: 'Massive coronal mass ejection' }
    ],
    storyLine: {
      launch: {
        year: '2018',
        title: 'Launch on Delta IV Heavy',
        desc: 'Required one of the most powerful launch vehicles ever built to strip away Earth\'s orbital momentum and dive inward toward the Sun.'
      },
      arrival: {
        year: '2021',
        title: 'First Craft to "Touch the Sun"',
        desc: 'Crossed the Alfvén critical boundary, directly sampling the magnetic atmosphere of our star for the first time in human history.'
      },
      hardware: {
        icon: '☀️',
        title: 'Thermal Protection Shield & Solar Craft',
        instrumentsHeroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solar_corona.jpg/1280px-Solar_corona.jpg',
        desc: 'An 8-foot-wide, 4.5-inch-thick carbon-composite foam heat shield coated in white ceramic, with liquid cooling pipes protecting the avionics.'
      },
      instruments: [
        {
          group: 'Solar Wind Sensors',
          icon: '🔥',
          items: [
            {
              name: 'SWEAP Faraday Cup',
              desc: 'Tungsten sensor looking directly past the heat shield into the 1,400°C solar glare to count electrons, protons, and alpha particles in real time.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solar_corona.jpg/960px-Solar_corona.jpg',
              specs: { target: 'Thermal ions & electrons', material: 'Tungsten & Sapphire peek', heat_tolerance: '1,430°C (2,600°F)', sampling_rate: '>100 Hz' },
              partKey: 'shield'
            },
            {
              name: 'FIELDS Antennas',
              desc: 'Five niobium alloy electric antennas sensing plasma waves, electric fields, and magnetic reconnection in the solar corona.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solar_Flare_and_CME_%281%29.jpg/960px-Solar_Flare_and_CME_%281%29.jpg',
              specs: { sensors: '5 Niobium alloy antennas', frequency: 'DC to 20 MHz', detect: 'Switchbacks & shockwaves', mass: '12 kg' },
              partKey: 'boom'
            }
          ]
        },
        {
          group: 'High-Energy Detectors',
          icon: '⚡',
          items: [
            {
              name: 'ISʘIS Detectors',
              desc: 'Integrated Science Investigation of the Sun measuring energetic ions and electrons accelerated by coronal mass ejections and solar flares.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solar_Flare_and_CME_%281%29.jpg/960px-Solar_Flare_and_CME_%281%29.jpg',
              specs: { range: '10 keV to 100 MeV/nucleon', components: 'EPI-Lo + EPI-Hi detectors', resolution: 'Mass & charge breakdown', mass: '19.5 kg' },
              partKey: 'bus'
            },
            {
              name: 'WISPR Optical Imager',
              desc: 'Wide-field optical imager taking pristine photographs of coronal mass ejections, solar dust streams, and planetary flybys.',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solar_corona.jpg/960px-Solar_corona.jpg',
              specs: { optical: 'Dual radiation-hardened CMOS', field_of_view: '95° radial swath', image_format: '2048×2048 pixels', mass: '11.5 kg' },
              partKey: 'bus'
            }
          ]
        }
      ],
      science: {
        title: 'Solving the Coronal Heating Mystery',
        desc: 'Discovered "switchbacks"—violent zigzag kinks in the Sun\'s magnetic field that fling solar wind particles into interplanetary space at supersonic speeds.'
      },
      currentStatus: {
        title: 'Setting All-Time Speed Records',
        desc: 'Reaching orbital speeds of 690,000 km/h (430,000 mph)—fast enough to fly from Washington, D.C. to Tokyo in under a minute!'
      }
    },
    funFact: "Dr. Eugene Parker, who predicted the solar wind in 1958, watched the launch in person at age 91—the first time NASA named a spacecraft after a living person!",
    audioSimulation: 'plasma_waves',
    audioTitle: 'Parker Solar Wind Magnetic Reconnection Plasma Audio',
    badgeAwarded: 'sun-diver'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Relics', icon: '🌌' },
  { id: 'mars', label: 'Mars', icon: '🔴' },
  { id: 'deep-space', label: 'Deep Space', icon: '🚀' },
  { id: 'moon', label: 'The Moon', icon: '🌕' },
  { id: 'sun-asteroids', label: 'Sun & Asteroids', icon: '☀️' },
  { id: 'lagrange', label: 'Lagrange Points', icon: '🛰️' }
];

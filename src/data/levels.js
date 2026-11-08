/**
 * Level Configurations for Friendship Quest (Levels 1 to 5)
 * Carefully designed for easy, casual gameplay, forgiving jumps, and under 90s completion.
 */

export const LEVELS = [
  // -------------------------------------------------------------
  // LEVEL 1: CITY OF SPICES
  // Countryside, Green hills, Flowers, Bright blue sky
  // -------------------------------------------------------------
  {
    id: 1,
    name: "City of Spices",
    subtitle: "Sunshine & Green Hills",
    worldWidth: 2400,
    worldHeight: 600,
    theme: "countryside",
    colors: {
      sky: 0x64b5f6,
      clouds: 0xffffff,
      hillsFar: 0x81c784,
      hillsNear: 0x4caf50,
      groundTop: 0x66bb6a,
      groundBase: 0x8d6e63,
      platformTop: 0x81c784,
      platformBase: 0xa1887f
    },
    playerStart: { x: 100, y: 450 },
    goal: { x: 2260, y: 470, type: "flag", name: "Memory Arch" },
    checkpoints: [
      { id: "cp_1_1", x: 800, y: 470 },
      { id: "cp_1_2", x: 1550, y: 470 }
    ],
    // Low ground covering the whole level with generous platform steps
    groundSegments: [
      { x: 0, y: 520, width: 900, height: 80 },
      { x: 960, y: 520, width: 750, height: 80 },
      { x: 1780, y: 520, width: 700, height: 80 }
    ],
    platforms: [
      // Early easy steps
      { x: 280, y: 430, width: 140, height: 26 },
      { x: 480, y: 370, width: 150, height: 26 },
      { x: 700, y: 440, width: 120, height: 26 },
      
      // Mid section
      { x: 1050, y: 420, width: 140, height: 26 },
      { x: 1240, y: 350, width: 150, height: 26 },
      { x: 1440, y: 410, width: 130, height: 26 },
      
      // Moving gentle platform over the small gap
      { x: 1710, y: 420, width: 110, height: 24, type: "moving", rangeX: 70, speed: 50 },
      
      // Final approach
      { x: 1930, y: 420, width: 140, height: 26 },
      { x: 2110, y: 360, width: 130, height: 26 }
    ],
    // Low density, cute slow moving ladybugs / flowers to hop over
    obstacles: [
      { x: 420, y: 495, type: "caterpillar", width: 32, height: 20, patrol: 50, speed: 30 },
      { x: 1150, y: 495, type: "caterpillar", width: 32, height: 20, patrol: 60, speed: 35 },
      { x: 1380, y: 495, type: "snail", width: 30, height: 20, patrol: 40, speed: 25 },
      { x: 2020, y: 495, type: "caterpillar", width: 32, height: 20, patrol: 50, speed: 30 }
    ],
    // 5 memory tokens (centered directly over platforms for easy collection)
    collectibles: [
      { id: "m_1_1", memoryId: "m_1_1", x: 280, y: 375, type: "coin" },
      { id: "m_1_2", memoryId: "m_1_2", x: 480, y: 315, type: "heart" },
      { id: "m_1_3", memoryId: "m_1_3", x: 1050, y: 365, type: "coin" },
      { id: "m_1_4", memoryId: "m_1_4", x: 1240, y: 295, type: "heart" },
      { id: "m_1_5", memoryId: "m_1_5", x: 2110, y: 305, type: "star" }
    ],
    decorations: [
      { type: "tree", x: 180, y: 520 },
      { type: "flower", x: 320, y: 520 },
      { type: "flower", x: 620, y: 520 },
      { type: "tree", x: 920, y: 520 },
      { type: "tree", x: 1600, y: 520 },
      { type: "flower", x: 1840, y: 520 },
      { type: "tree", x: 2200, y: 520 }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 2: QUEEN OF THE ARABIAN SEA
  // Underground Crystal Cave, Glowing mushrooms & crystals, Moving platforms
  // -------------------------------------------------------------
  {
    id: 2,
    name: "Queen of the Arabian sea",
    subtitle: "Crystal Caverns of Comedy",
    worldWidth: 2500,
    worldHeight: 600,
    theme: "cave",
    colors: {
      sky: 0x1a1528,
      caveBack: 0x241d3b,
      groundTop: 0x9c27b0,
      groundBase: 0x311b92,
      platformTop: 0xba68c8,
      platformBase: 0x4a148c
    },
    playerStart: { x: 100, y: 450 },
    goal: { x: 2360, y: 470, type: "gem_portal", name: "Cave Exit" },
    checkpoints: [
      { id: "cp_2_1", x: 850, y: 470 },
      { id: "cp_2_2", x: 1650, y: 470 }
    ],
    groundSegments: [
      { x: 0, y: 520, width: 800, height: 80 },
      { x: 860, y: 520, width: 750, height: 80 },
      { x: 1680, y: 520, width: 850, height: 80 }
    ],
    platforms: [
      { x: 250, y: 420, width: 140, height: 26 },
      // Vertical gentle lift
      { x: 460, y: 380, width: 120, height: 24, type: "moving", rangeY: 60, speed: 45 },
      { x: 640, y: 340, width: 130, height: 26 },

      // Mid cave horizontal floating crystal
      { x: 950, y: 410, width: 130, height: 26 },
      { x: 1140, y: 360, width: 120, height: 24, type: "moving", rangeX: 80, speed: 50 },
      { x: 1340, y: 330, width: 130, height: 26 },
      { x: 1530, y: 410, width: 120, height: 26 },

      // Final cavern ascent
      { x: 1820, y: 430, width: 130, height: 26 },
      { x: 2010, y: 370, width: 130, height: 26 },
      { x: 2190, y: 410, width: 120, height: 26 }
    ],
    obstacles: [
      { x: 380, y: 495, type: "crystal_bug", width: 30, height: 20, patrol: 60, speed: 40 },
      { x: 1040, y: 495, type: "crystal_bug", width: 30, height: 20, patrol: 50, speed: 35 },
      { x: 1450, y: 495, type: "crystal_spikes", width: 32, height: 24, patrol: 0 },
      { x: 1920, y: 495, type: "crystal_bug", width: 30, height: 20, patrol: 60, speed: 40 }
    ],
    collectibles: [
      { id: "m_2_1", memoryId: "m_2_1", x: 250, y: 365, type: "coin" },
      { id: "m_2_2", memoryId: "m_2_2", x: 640, y: 285, type: "coin" },
      { id: "m_2_3", memoryId: "m_2_3", x: 1140, y: 305, type: "heart" },
      { id: "m_2_4", memoryId: "m_2_4", x: 1530, y: 355, type: "coin" },
      { id: "m_2_5", memoryId: "m_2_5", x: 2010, y: 315, type: "star" }
    ],
    decorations: [
      { type: "crystal", x: 160, y: 520, color: 0x00e5ff },
      { type: "shroom", x: 550, y: 520, color: 0xff4081 },
      { type: "crystal", x: 800, y: 520, color: 0x76ff03 },
      { type: "crystal", x: 1250, y: 520, color: 0x00e5ff },
      { type: "shroom", x: 1750, y: 520, color: 0xffd700 },
      { type: "crystal", x: 2260, y: 520, color: 0xe040fb }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 3: NAMMA BENGALURU
  // Sunset Mountains, Radiant Orange/Purple Sky, Floating Stone Platforms
  // -------------------------------------------------------------
  {
    id: 3,
    name: "Namma Bengaluru",
    subtitle: "Golden Hour Peaks",
    worldWidth: 2600,
    worldHeight: 600,
    theme: "mountains",
    colors: {
      sky: 0xff7043,
      skyBottom: 0x7e57c2,
      mountainFar: 0x512da8,
      mountainNear: 0x311b92,
      groundTop: 0xffb74d,
      groundBase: 0x5d4037,
      platformTop: 0xffcc80,
      platformBase: 0x4e342e
    },
    playerStart: { x: 100, y: 450 },
    goal: { x: 2450, y: 470, type: "summit_beacon", name: "Summit Beacon" },
    checkpoints: [
      { id: "cp_3_1", x: 880, y: 470 },
      { id: "cp_3_2", x: 1700, y: 470 }
    ],
    groundSegments: [
      { x: 0, y: 520, width: 750, height: 80 },
      { x: 820, y: 520, width: 850, height: 80 },
      { x: 1750, y: 520, width: 900, height: 80 }
    ],
    platforms: [
      // Section 1: Initial Ascent
      { x: 260, y: 440, width: 140, height: 26 },
      { x: 470, y: 380, width: 140, height: 26 },
      { x: 670, y: 320, width: 140, height: 26 },
      { x: 800, y: 390, width: 120, height: 26 },

      // Section 2: Floating Stepping Stones & Valley
      { x: 940, y: 440, width: 120, height: 26 },
      { x: 1120, y: 390, width: 130, height: 24, type: "moving", rangeX: 60, speed: 45 },
      { x: 1300, y: 340, width: 140, height: 26 },
      { x: 1440, y: 400, width: 120, height: 26 },
      { x: 1580, y: 430, width: 130, height: 26 },

      // Section 3: High Vantage Overlook to Summit
      { x: 1840, y: 440, width: 130, height: 26 },
      { x: 2040, y: 380, width: 140, height: 26 },
      { x: 2240, y: 440, width: 130, height: 26 }
    ],
    obstacles: [
      { x: 420, y: 495, type: "rolling_pebble", width: 28, height: 24, patrol: 60, speed: 35 },
      { x: 1020, y: 495, type: "rolling_pebble", width: 28, height: 24, patrol: 50, speed: 30 },
      { x: 1420, y: 495, type: "mountain_geyser", width: 30, height: 22, patrol: 0 },
      { x: 2150, y: 495, type: "rolling_pebble", width: 28, height: 24, patrol: 55, speed: 35 }
    ],
    // 5 memory tokens (centered directly on platforms at accessible heights)
    collectibles: [
      { id: "m_3_1", memoryId: "m_3_1", x: 470, y: 325, type: "heart" },
      { id: "m_3_2", memoryId: "m_3_2", x: 670, y: 265, type: "coin" },
      { id: "m_3_3", memoryId: "m_3_3", x: 1300, y: 285, type: "heart" },
      { id: "m_3_4", memoryId: "m_3_4", x: 1580, y: 375, type: "coin" },
      { id: "m_3_5", memoryId: "m_3_5", x: 2040, y: 325, type: "star" }
    ],
    decorations: [
      { type: "pine_tree", x: 180, y: 520 },
      { type: "mountain_rock", x: 400, y: 520 },
      { type: "pine_tree", x: 760, y: 520 },
      { type: "mountain_rock", x: 1200, y: 520 },
      { type: "pine_tree", x: 1650, y: 520 },
      { type: "pine_tree", x: 2350, y: 520 }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 4: QUEEN OF THE HILLS
  // Tropical Island Beach, Turquoise Ocean, Palm Trees, Sunshine
  // -------------------------------------------------------------
  {
    id: 4,
    name: "Queen of the hills",
    subtitle: "Tropical Sands & Sea Breeze",
    worldWidth: 2600,
    worldHeight: 600,
    theme: "beach",
    colors: {
      sky: 0x4dd0e1,
      ocean: 0x00acc1,
      sandTop: 0xffe082,
      sandBase: 0xffb300,
      platformTop: 0xffecb3,
      platformBase: 0x8d6e63
    },
    playerStart: { x: 100, y: 450 },
    goal: { x: 2450, y: 470, type: "beach_hut", name: "Island Pier" },
    checkpoints: [
      { id: "cp_4_1", x: 860, y: 470 },
      { id: "cp_4_2", x: 1680, y: 470 }
    ],
    groundSegments: [
      { x: 0, y: 520, width: 800, height: 80 },
      { x: 850, y: 520, width: 800, height: 80 },
      { x: 1700, y: 520, width: 920, height: 80 }
    ],
    platforms: [
      // Wooden boardwalks and floating surfboard platforms
      { x: 270, y: 420, width: 140, height: 26 },
      { x: 480, y: 350, width: 130, height: 26 },
      { x: 680, y: 400, width: 130, height: 26 },

      { x: 960, y: 420, width: 130, height: 26 },
      // Gentle horizontal drifting boardwalk
      { x: 1160, y: 360, width: 130, height: 24, type: "moving", rangeX: 80, speed: 45 },
      { x: 1370, y: 320, width: 140, height: 26 },
      { x: 1560, y: 390, width: 120, height: 26 },

      { x: 1880, y: 420, width: 130, height: 26 },
      { x: 2080, y: 350, width: 140, height: 26 },
      { x: 2280, y: 410, width: 120, height: 26 }
    ],
    obstacles: [
      { x: 400, y: 495, type: "beach_crab", width: 32, height: 20, patrol: 50, speed: 30 },
      { x: 1060, y: 495, type: "beach_crab", width: 32, height: 20, patrol: 60, speed: 35 },
      { x: 1470, y: 495, type: "spiky_urchin", width: 28, height: 22, patrol: 0 },
      { x: 1980, y: 495, type: "beach_crab", width: 32, height: 20, patrol: 55, speed: 30 }
    ],
    collectibles: [
      { id: "m_4_1", memoryId: "m_4_1", x: 270, y: 365, type: "coin" },
      { id: "m_4_2", memoryId: "m_4_2", x: 480, y: 295, type: "heart" },
      { id: "m_4_3", memoryId: "m_4_3", x: 1160, y: 305, type: "coin" },
      { id: "m_4_4", memoryId: "m_4_4", x: 1370, y: 265, type: "heart" },
      { id: "m_4_5", memoryId: "m_4_5", x: 2080, y: 295, type: "star" }
    ],
    decorations: [
      { type: "palm_tree", x: 180, y: 520 },
      { type: "seashell", x: 340, y: 520 },
      { type: "beach_umbrella", x: 740, y: 520 },
      { type: "palm_tree", x: 1280, y: 520 },
      { type: "seashell", x: 1620, y: 520 },
      { type: "palm_tree", x: 2360, y: 520 }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 5: THE 5AM CLUB
  // Magical Birthday Castle, Floating Balloons, Royal Banners, Birthday Treasure Chest
  // -------------------------------------------------------------
  {
    id: 5,
    name: "The 5AM Club",
    subtitle: "The Royal Birthday Gala",
    worldWidth: 2700,
    worldHeight: 600,
    theme: "castle",
    colors: {
      sky: 0x1a0f35,
      castleWall: 0x3d2963,
      groundTop: 0xf50057,
      groundBase: 0x261447,
      platformTop: 0xff4081,
      platformBase: 0x4a148c
    },
    playerStart: { x: 100, y: 450 },
    goal: { x: 2520, y: 450, type: "birthday_chest", name: "Birthday Treasure Chest" },
    checkpoints: [
      { id: "cp_5_1", x: 900, y: 470 },
      { id: "cp_5_2", x: 1750, y: 470 }
    ],
    groundSegments: [
      { x: 0, y: 520, width: 850, height: 80 },
      { x: 900, y: 520, width: 800, height: 80 },
      { x: 1760, y: 520, width: 950, height: 80 }
    ],
    platforms: [
      // Royal golden carpet steps and floating gift platforms
      { x: 260, y: 420, width: 140, height: 26 },
      { x: 470, y: 350, width: 130, height: 26 },
      { x: 680, y: 390, width: 130, height: 26 },

      { x: 970, y: 410, width: 130, height: 26 },
      // Rising floating party cake platform
      { x: 1180, y: 360, width: 130, height: 24, type: "moving", rangeY: 60, speed: 45 },
      { x: 1390, y: 320, width: 140, height: 26 },
      { x: 1600, y: 390, width: 130, height: 26 },

      { x: 1900, y: 410, width: 130, height: 26 },
      { x: 2110, y: 340, width: 140, height: 26 },
      { x: 2320, y: 400, width: 140, height: 26 }
    ],
    obstacles: [
      // Harmless funny popping party poppers / toy wind-up bots
      { x: 420, y: 495, type: "party_bot", width: 28, height: 24, patrol: 50, speed: 30 },
      { x: 1070, y: 495, type: "party_bot", width: 28, height: 24, patrol: 60, speed: 35 },
      { x: 1510, y: 495, type: "balloon_hazard", width: 28, height: 24, patrol: 0 },
      { x: 2020, y: 495, type: "party_bot", width: 28, height: 24, patrol: 55, speed: 30 }
    ],
    collectibles: [
      { id: "m_5_1", memoryId: "m_5_1", x: 260, y: 365, type: "heart" },
      { id: "m_5_2", memoryId: "m_5_2", x: 470, y: 295, type: "coin" },
      { id: "m_5_3", memoryId: "m_5_3", x: 1180, y: 305, type: "heart" },
      { id: "m_5_4", memoryId: "m_5_4", x: 1390, y: 265, type: "star" },
      { id: "m_5_5", memoryId: "m_5_5", x: 2110, y: 285, type: "star" }
    ],
    decorations: [
      { type: "castle_pillar", x: 180, y: 520 },
      { type: "balloons", x: 380, y: 520 },
      { type: "party_banner", x: 750, y: 300 },
      { type: "castle_pillar", x: 1320, y: 520 },
      { type: "balloons", x: 1680, y: 520 },
      { type: "party_banner", x: 2200, y: 300 }
    ]
  }
];


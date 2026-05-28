// ============================================================
// data.js — All game balance data (JSON-style config objects)
// ============================================================

export const CANVAS = { WIDTH: 1280, HEIGHT: 720 };
export const TILE_SIZE = 64;

// ---- Player base stats ----
export const PLAYER_DATA = {
  hp: 100,
  speed: 160,       // px/s
  damageMult: 1.0,
  magnetRange: 90,
  armor: 0,
  radius: 14,
};

// ---- XP thresholds per level ----
export function xpForLevel(level) {
  return Math.floor(10 * Math.pow(1.35, level - 1));
}

// ---- Weapon definitions ----
// Each weapon has a levels array; index = weapon level - 1
export const WEAPONS_DATA = {
  bolter: {
    id: 'bolter',
    name: 'Bolter',
    desc: 'Rapid mass-reactive rounds. Nearest target, auto-fire.',
    color: '#FFD700',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:10, cd:0.50, pierce:1, count:1, spd:420, spread:0,  bulletRadius:4  },
      { dmg:12, cd:0.47, pierce:1, count:1, spd:430, spread:0,  bulletRadius:4  },
      { dmg:14, cd:0.44, pierce:2, count:1, spd:440, spread:5,  bulletRadius:5  },
      { dmg:16, cd:0.41, pierce:2, count:2, spd:450, spread:10, bulletRadius:5  },
      { dmg:18, cd:0.38, pierce:2, count:2, spd:460, spread:10, bulletRadius:6  },
      { dmg:21, cd:0.35, pierce:3, count:3, spd:470, spread:12, bulletRadius:8  },
      { dmg:25, cd:0.32, pierce:3, count:3, spd:480, spread:15, bulletRadius:10 },
      { dmg:30, cd:0.28, pierce:4, count:4, spd:500, spread:18, bulletRadius:12 },
    ],
  },
  powerSword: {
    id: 'powerSword',
    name: 'Power Sword',
    desc: 'Crackling energy blade sweeps both sides of the Marine.',
    color: '#00BFFF',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:22,  cd:1.50, arc:130, range:80 },
      { dmg:26,  cd:1.40, arc:140, range:85 },
      { dmg:31,  cd:1.30, arc:150, range:92 },
      { dmg:37,  cd:1.20, arc:160, range:100 },
      { dmg:44,  cd:1.10, arc:175, range:108 },
      { dmg:52,  cd:1.00, arc:190, range:118 },
      { dmg:62,  cd:0.90, arc:200, range:130 },
      { dmg:75,  cd:0.80, arc:220, range:145 },
    ],
  },
  plasmaGun: {
    id: 'plasmaGun',
    name: 'Plasma Gun',
    desc: 'Superheated plasma orb that homes in on the nearest enemy.',
    color: '#FF6B35',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:40,  cd:2.00, spd:180, homing:3.0, radius:9 },
      { dmg:48,  cd:1.90, spd:190, homing:3.3, radius:10 },
      { dmg:57,  cd:1.80, spd:200, homing:3.6, radius:11 },
      { dmg:68,  cd:1.70, spd:212, homing:4.0, radius:12 },
      { dmg:80,  cd:1.60, spd:224, homing:4.5, radius:13 },
      { dmg:95,  cd:1.50, spd:236, homing:5.0, radius:14 },
      { dmg:112, cd:1.40, spd:248, homing:5.5, radius:16 },
      { dmg:135, cd:1.25, spd:265, homing:6.5, radius:19 },
    ],
  },
  fragGrenades: {
    id: 'fragGrenades',
    name: 'Frag Grenades',
    desc: 'Arcing explosive that leaves a burning damage field on impact.',
    color: '#7CFC00',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:28,  cd:3.00, radius:65,  fieldDur:2.0, fieldDps:8,  count:1 },
      { dmg:34,  cd:2.80, radius:70,  fieldDur:2.2, fieldDps:10, count:1 },
      { dmg:41,  cd:2.60, radius:78,  fieldDur:2.5, fieldDps:12, count:1 },
      { dmg:49,  cd:2.40, radius:88,  fieldDur:2.8, fieldDps:15, count:1 },
      { dmg:58,  cd:2.20, radius:98,  fieldDur:3.0, fieldDps:19, count:2 },
      { dmg:70,  cd:2.00, radius:110, fieldDur:3.5, fieldDps:24, count:2 },
      { dmg:84,  cd:1.80, radius:122, fieldDur:4.0, fieldDps:30, count:3 },
      { dmg:102, cd:1.55, radius:140, fieldDur:5.0, fieldDps:38, count:3 },
    ],
  },
  heavyFlamer: {
    id: 'heavyFlamer',
    name: 'Heavy Flamer',
    desc: 'Promethium cone that scorches all enemies ahead. Angle and range grow each level.',
    color: '#FF4500',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:8,  cd:0.55, range:130, angle:40 },
      { dmg:10, cd:0.53, range:148, angle:45 },
      { dmg:12, cd:0.51, range:166, angle:50 },
      { dmg:15, cd:0.49, range:185, angle:56 },
      { dmg:18, cd:0.47, range:205, angle:62 },
      { dmg:22, cd:0.45, range:225, angle:68 },
      { dmg:27, cd:0.43, range:248, angle:75 },
      { dmg:33, cd:0.40, range:275, angle:82 },
    ],
  },
  lascannon: {
    id: 'lascannon',
    name: 'Lascannon',
    desc: 'High-energy laser that pierces all enemies in a line. Beam widens each level.',
    color: '#FF2222',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:60,  cd:3.00, range:520, width:6  },
      { dmg:75,  cd:2.80, range:560, width:7  },
      { dmg:93,  cd:2.60, range:600, width:9  },
      { dmg:114, cd:2.40, range:650, width:11 },
      { dmg:140, cd:2.20, range:700, width:13 },
      { dmg:172, cd:2.00, range:760, width:16 },
      { dmg:210, cd:1.80, range:820, width:19 },
      { dmg:260, cd:1.55, range:920, width:23 },
    ],
  },
  stormBolter: {
    id: 'stormBolter',
    name: 'Storm Bolter',
    desc: 'Twin-linked bolter sprays rounds in all directions. No aiming required.',
    color: '#B0C4DE',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:8,  cd:0.72, count:4, spd:320, bulletRadius:4 },
      { dmg:10, cd:0.68, count:4, spd:330, bulletRadius:4 },
      { dmg:12, cd:0.65, count:5, spd:340, bulletRadius:5 },
      { dmg:14, cd:0.62, count:6, spd:350, bulletRadius:5 },
      { dmg:17, cd:0.59, count:6, spd:360, bulletRadius:5 },
      { dmg:20, cd:0.56, count:7, spd:375, bulletRadius:6 },
      { dmg:24, cd:0.53, count:8, spd:390, bulletRadius:7 },
      { dmg:30, cd:0.48, count:8, spd:410, bulletRadius:8 },
    ],
  },
  meltaGun: {
    id: 'meltaGun',
    name: 'Melta Gun',
    desc: 'Superheated blast vaporises everything in close range. Must be near enemies to trigger.',
    color: '#FF6633',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:90,  cd:2.50, range:120, fieldDur:1.0, fieldDps:20 },
      { dmg:112, cd:2.35, range:132, fieldDur:1.2, fieldDps:25 },
      { dmg:138, cd:2.20, range:145, fieldDur:1.4, fieldDps:30 },
      { dmg:170, cd:2.05, range:160, fieldDur:1.6, fieldDps:37 },
      { dmg:208, cd:1.90, range:176, fieldDur:1.8, fieldDps:45 },
      { dmg:255, cd:1.75, range:194, fieldDur:2.0, fieldDps:55 },
      { dmg:312, cd:1.60, range:212, fieldDur:2.2, fieldDps:66 },
      { dmg:384, cd:1.40, range:232, fieldDur:2.5, fieldDps:80 },
    ],
  },
  orbitalStrike: {
    id: 'orbitalStrike',
    name: 'Orbital Strike',
    desc: 'Calls bombardment on the densest enemy cluster. Long cooldown, massive blast radius.',
    color: '#9B59B6',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:80,  cd:10.0, radius:110, fieldDur:2.0, fieldDps:15 },
      { dmg:98,  cd: 9.5, radius:122, fieldDur:2.2, fieldDps:18 },
      { dmg:120, cd: 9.0, radius:136, fieldDur:2.5, fieldDps:22 },
      { dmg:146, cd: 8.5, radius:152, fieldDur:2.8, fieldDps:27 },
      { dmg:178, cd: 8.0, radius:168, fieldDur:3.0, fieldDps:33 },
      { dmg:216, cd: 7.5, radius:186, fieldDur:3.5, fieldDps:40 },
      { dmg:262, cd: 7.0, radius:206, fieldDur:4.0, fieldDps:48 },
      { dmg:320, cd: 6.5, radius:230, fieldDur:5.0, fieldDps:58 },
    ],
  },
  thunderHammer: {
    id: 'thunderHammer',
    name: 'Thunder Hammer',
    desc: 'Massive maul slams enemies in a frontal arc with brutal knockback force.',
    color: '#FFA500',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:50,  cd:2.20, range:110, arc:150, kb:500 },
      { dmg:62,  cd:2.10, range:118, arc:155, kb:560 },
      { dmg:76,  cd:2.00, range:127, arc:162, kb:620 },
      { dmg:93,  cd:1.90, range:137, arc:170, kb:690 },
      { dmg:114, cd:1.80, range:148, arc:178, kb:760 },
      { dmg:140, cd:1.70, range:160, arc:188, kb:840 },
      { dmg:172, cd:1.58, range:174, arc:200, kb:930 },
      { dmg:210, cd:1.45, range:190, arc:215, kb:1020 },
    ],
  },
  whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind',
    desc: 'Fires a salvo of homing missiles, each tracking a different nearby enemy.',
    color: '#32CD32',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:25, cd:2.80, count:2, spd:160, homing:3.5, radius:10 },
      { dmg:30, cd:2.65, count:2, spd:168, homing:3.8, radius:11 },
      { dmg:36, cd:2.50, count:3, spd:176, homing:4.1, radius:12 },
      { dmg:43, cd:2.35, count:3, spd:184, homing:4.4, radius:13 },
      { dmg:52, cd:2.20, count:4, spd:192, homing:4.8, radius:14 },
      { dmg:62, cd:2.05, count:4, spd:200, homing:5.2, radius:15 },
      { dmg:74, cd:1.90, count:5, spd:210, homing:5.7, radius:16 },
      { dmg:90, cd:1.72, count:6, spd:225, homing:6.5, radius:18 },
    ],
  },
  chainLightning: {
    id: 'chainLightning',
    name: 'Chain Lightning',
    desc: 'Psychic arc strikes the nearest enemy then jumps to nearby foes. Damage decays per hop.',
    color: '#00FFFF',
    type: 'weapon',
    maxLevel: 8,
    levels: [
      { dmg:35, cd:1.80, chains:2, chainRange:100, decay:0.75 },
      { dmg:42, cd:1.72, chains:2, chainRange:108, decay:0.78 },
      { dmg:51, cd:1.64, chains:3, chainRange:117, decay:0.80 },
      { dmg:61, cd:1.56, chains:3, chainRange:127, decay:0.82 },
      { dmg:73, cd:1.48, chains:4, chainRange:138, decay:0.84 },
      { dmg:88, cd:1.40, chains:4, chainRange:150, decay:0.86 },
      { dmg:106,cd:1.32, chains:5, chainRange:164, decay:0.88 },
      { dmg:128,cd:1.22, chains:6, chainRange:180, decay:0.90 },
    ],
  },
};

// ---- Passive item definitions ----
export const PASSIVES_DATA = {
  servoSkull: {
    id: 'servoSkull',
    name: 'Servo-Skull',
    desc: '+20% move speed. The faithful skull guides your path.',
    color: '#C0C0C0',
    type: 'passive',
    maxLevel: 5,
    applyLevel: (player, lvl) => { player.speedMult = 1 + lvl * 0.2; },
  },
  adamantiumWill: {
    id: 'adamantiumWill',
    name: 'Adamantium Will',
    desc: '+30 max HP per stack. The Emperor protects.',
    color: '#8B4513',
    type: 'passive',
    maxLevel: 5,
    applyLevel: (player, lvl) => {
      player.maxHp = PLAYER_DATA.hp + lvl * 30;
      player.hp = Math.min(player.hp + 30, player.maxHp);
    },
  },
  chapterBanner: {
    id: 'chapterBanner',
    name: 'Chapter Banner',
    desc: '+18% damage per stack. For the Chapter!',
    color: '#8B0000',
    type: 'passive',
    maxLevel: 5,
    applyLevel: (player, lvl) => { player.damageMult = 1 + lvl * 0.18; },
  },
  terminatorArmor: {
    id: 'terminatorArmor',
    name: 'Terminator Armor',
    desc: '+3 armor per stack. Blessed ceramite.',
    color: '#708090',
    type: 'passive',
    maxLevel: 5,
    applyLevel: (player, lvl) => { player.armor = lvl * 3; },
  },
  machineSpirit: {
    id: 'machineSpirit',
    name: 'Machine Spirit',
    desc: '+30% XP magnet range per stack.',
    color: '#FFA500',
    type: 'passive',
    maxLevel: 5,
    applyLevel: (player, lvl) => { player.magnetRange = PLAYER_DATA.magnetRange * (1 + lvl * 0.3); },
  },
};

// ---- Enemy definitions ----
export const ENEMY_DATA = {
  hormagaunt: {
    id: 'hormagaunt',
    name: 'Gretchin',         // 작고 빠른 오크 하수인
    hp: 18,
    speed: 125,
    damage: 8,
    xp: 2,
    radius: 8,
    color: '#4aaa22',
    scoreValue: 10,
    isBoss: false,
  },
  boyz: {
    id: 'boyz',
    name: 'Ork Boy',
    hp: 65,
    speed: 62,
    damage: 15,
    xp: 5,
    radius: 13,
    color: '#27AE60',
    scoreValue: 30,
    isBoss: false,
  },
  warrior: {
    id: 'warrior',
    name: 'Nob',              // 엘리트 오크 보병
    hp: 130,
    speed: 48,
    damage: 22,
    xp: 15,
    radius: 17,
    color: '#1e7a30',
    scoreValue: 80,
    isBoss: false,
  },
  gunt: {
    id: 'gunt',
    name: 'Gunt',
    hp: 90,
    speed: 88,
    damage: 18,
    xp: 8,
    radius: 15,
    color: '#4a2060',
    scoreValue: 50,
    isBoss: false,
  },
  carnifex: {
    id: 'carnifex',
    name: 'Deff Dread',       // 오크 기계 워커 보스
    hp: 2200,
    speed: 34,
    damage: 42,
    xp: 200,
    radius: 34,
    color: '#2a3a8a',
    scoreValue: 500,
    isBoss: true,
  },
  warboss: {
    id: 'warboss',
    name: 'Warboss',
    hp: 3200,
    speed: 40,
    damage: 55,
    xp: 300,
    radius: 38,
    color: '#1A5E20',
    scoreValue: 800,
    isBoss: true,
  },
};

// ---- Wave definitions ----
// time: seconds from start, spawnRate: seconds between spawns, maxEnemies: cap
export const WAVES = [
  { time:   0, rate: 1.60, max:  30, types: ['hormagaunt'] },
  { time:  30, rate: 1.30, max:  50, types: ['hormagaunt','hormagaunt','boyz'] },
  { time:  60, rate: 1.10, max:  70, types: ['hormagaunt','boyz','gunt'] },
  { time:  90, rate: 0.90, max:  90, types: ['hormagaunt','boyz','gunt','warrior'] },
  { time: 120, rate: 0.75, max: 100, types: ['hormagaunt','gunt','warrior'] },
  { time: 180, rate: 0.60, max: 110, types: ['boyz','gunt','warrior'] },
  { time: 240, rate: 0.45, max: 120, types: ['gunt','warrior'] },
  { time: 300, rate: 0.30, max: 130, types: ['hormagaunt','gunt','warrior'] },
  { time: 400, rate: 0.22, max: 140, types: ['gunt','warrior','boyz'] },
];

// Boss spawn times (seconds)
export const BOSS_SPAWNS = [
  { time: 300,  type: 'carnifex' },
  { time: 600,  type: 'warboss' },
  { time: 900,  type: 'carnifex' },
  { time: 1200, type: 'warboss' },
];

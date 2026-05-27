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
      { dmg:10, cd:0.50, pierce:1, count:1, spd:420, spread:0 },
      { dmg:12, cd:0.47, pierce:1, count:1, spd:430, spread:0 },
      { dmg:14, cd:0.44, pierce:2, count:1, spd:440, spread:5 },
      { dmg:16, cd:0.41, pierce:2, count:2, spd:450, spread:10 },
      { dmg:18, cd:0.38, pierce:2, count:2, spd:460, spread:10 },
      { dmg:21, cd:0.35, pierce:3, count:3, spd:470, spread:12 },
      { dmg:25, cd:0.32, pierce:3, count:3, spd:480, spread:15 },
      { dmg:30, cd:0.28, pierce:4, count:4, spd:500, spread:18 },
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
      { dmg:28,  cd:3.00, radius:65,  fieldDur:2.0, fieldDps:8  },
      { dmg:34,  cd:2.80, radius:70,  fieldDur:2.2, fieldDps:10 },
      { dmg:41,  cd:2.60, radius:78,  fieldDur:2.5, fieldDps:12 },
      { dmg:49,  cd:2.40, radius:88,  fieldDur:2.8, fieldDps:15 },
      { dmg:58,  cd:2.20, radius:98,  fieldDur:3.0, fieldDps:19 },
      { dmg:70,  cd:2.00, radius:110, fieldDur:3.5, fieldDps:24 },
      { dmg:84,  cd:1.80, radius:122, fieldDur:4.0, fieldDps:30 },
      { dmg:102, cd:1.55, radius:140, fieldDur:5.0, fieldDps:38 },
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
    name: 'Hormagaunt',
    hp: 18,
    speed: 125,
    damage: 8,
    xp: 2,
    radius: 8,
    color: '#9B59B6',
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
    name: 'Tyranid Warrior',
    hp: 130,
    speed: 48,
    damage: 22,
    xp: 15,
    radius: 17,
    color: '#8E44AD',
    scoreValue: 80,
    isBoss: false,
  },
  carnifex: {
    id: 'carnifex',
    name: 'Carnifex',
    hp: 2200,
    speed: 34,
    damage: 42,
    xp: 200,
    radius: 34,
    color: '#6C3483',
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
  { time:  60, rate: 1.10, max:  70, types: ['hormagaunt','boyz'] },
  { time:  90, rate: 0.90, max:  90, types: ['hormagaunt','boyz','warrior'] },
  { time: 120, rate: 0.75, max: 120, types: ['hormagaunt','boyz','warrior'] },
  { time: 180, rate: 0.60, max: 160, types: ['boyz','warrior'] },
  { time: 240, rate: 0.45, max: 220, types: ['boyz','warrior'] },
  { time: 300, rate: 0.30, max: 300, types: ['hormagaunt','warrior'] },
  { time: 400, rate: 0.22, max: 400, types: ['warrior','boyz'] },
];

// Boss spawn times (seconds)
export const BOSS_SPAWNS = [
  { time: 300,  type: 'carnifex' },
  { time: 600,  type: 'warboss' },
  { time: 900,  type: 'carnifex' },
  { time: 1200, type: 'warboss' },
];

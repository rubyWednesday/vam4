// ============================================================
// world.js — Map system: obstacles, destructibles, dropped items,
//            fixed map items, and circle-AABB collision resolution
// ============================================================

export const CHUNK_SIZE = 640;   // 10 × 64-px tiles
const SPAWN_CLEAR_R     = 420;   // no obstacles within this radius of origin
const ITEM_LIFETIME     = 16;    // seconds before dropped item despawns

// ─── Seeded deterministic PRNG (Mulberry32) ──────────────────
function seededRng(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}
function chunkSeed(cx, cy) {
  const x = cx >= 0 ? cx * 2 : -cx * 2 - 1;
  const y = cy >= 0 ? cy * 2 : -cy * 2 - 1;
  return ((x >= y ? x * x + x + y : x + y * y) * 2654435761) >>> 0;
}

// ─── Circle vs AABB collision resolution ─────────────────────
// obs must have: x, y (top-left), w, h
export function circleAABBResolve(entity, obs) {
  const r = entity.radius;
  const nearX = Math.max(obs.x, Math.min(entity.x, obs.x + obs.w));
  const nearY = Math.max(obs.y, Math.min(entity.y, obs.y + obs.h));
  const dx = entity.x - nearX;
  const dy = entity.y - nearY;
  const dist2 = dx * dx + dy * dy;
  if (dist2 >= r * r) return false;

  const d = Math.sqrt(dist2);
  if (d < 0.0001) {
    // Circle centre inside rect — push along shortest axis
    const cx = obs.x + obs.w / 2, cy = obs.y + obs.h / 2;
    const ox = entity.x - cx, oy = entity.y - cy;
    if (Math.abs(ox) / obs.w < Math.abs(oy) / obs.h) {
      entity.x = ox > 0 ? obs.x + obs.w + r : obs.x - r;
    } else {
      entity.y = oy > 0 ? obs.y + obs.h + r : obs.y - r;
    }
    return true;
  }
  const pen = r - d;
  entity.x += (dx / d) * (pen + 0.5);
  entity.y += (dy / d) * (pen + 0.5);
  return true;
}

// ─── Obstacle type definitions ────────────────────────────────
const OBS_DEFS = [
  { id: 'pillar',       w: 48,  h: 48,  weight: 4 },
  { id: 'fallenPillar', w: 128, h: 30,  weight: 3 },
  { id: 'barricade',    w: 96,  h: 26,  weight: 3 },
  { id: 'rhinoWreck',   w: 88,  h: 62,  weight: 1 },
  { id: 'rubble',       w: 54,  h: 36,  weight: 5 },
];
// Build weighted pool
const OBS_POOL = [];
OBS_DEFS.forEach(d => { for (let i = 0; i < d.weight; i++) OBS_POOL.push(d); });

function drawObstacle(ctx, id, x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  switch (id) {
    case 'pillar': {
      // Gothic pillar — square column with carved panels
      ctx.fillStyle = '#28241c';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#1a1710';
      ctx.fillRect(x+4, y+4, w-8, h-8);
      // Cap stones top/bottom
      ctx.fillStyle = '#403c2c';
      ctx.fillRect(x-3, y-3, w+6, 10);
      ctx.fillRect(x-3, y+h-7, w+6, 10);
      // Pillar flutes (vertical lines)
      ctx.strokeStyle = '#100e08'; ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(x+i*(w/3), y+8); ctx.lineTo(x+i*(w/3), y+h-8); ctx.stroke();
      }
      ctx.strokeStyle = '#504c3c'; ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
      break;
    }
    case 'fallenPillar': {
      ctx.fillStyle = '#302c20';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#181610'; ctx.lineWidth = 2;
      for (let i = 1; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(x + i*(w/5), y); ctx.lineTo(x + i*(w/5), y+h); ctx.stroke();
      }
      // Surface cracks
      ctx.strokeStyle = '#1c1a12'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x+10, y+6); ctx.lineTo(x+45, y+h-4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+70, y+4); ctx.lineTo(x+100, y+h-6); ctx.stroke();
      ctx.strokeStyle = '#504c3a'; ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
      break;
    }
    case 'barricade': {
      ctx.fillStyle = '#3a2c1c';
      ctx.fillRect(x, y, w, h);
      // Metal panels
      ctx.fillStyle = '#2a1e10';
      for (let i = 0; i < 4; i++) ctx.fillRect(x+2+i*23, y+2, 20, h-4);
      // Yellow hazard edges
      ctx.fillStyle = '#e8b800';
      ctx.fillRect(x, y, 7, h); ctx.fillRect(x+w-7, y, 7, h);
      ctx.fillStyle = '#1a1410';
      for (let j = 0; j < 4; j++) { ctx.fillRect(x, y+j*7, 7, 4); ctx.fillRect(x+w-7, y+j*7, 7, 4); }
      // Bolts
      ctx.fillStyle = '#7a6a50';
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.arc(x+i*(w/4), y+h/2, 2.5, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
    case 'rhinoWreck': {
      // Burnt Rhino APC carcass
      ctx.fillStyle = '#141418';
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill();
      // Hull detail
      ctx.fillStyle = '#0a0a0e';
      ctx.fillRect(x+8, y+8, w-16, h-16);
      // Treads
      ctx.fillStyle = '#080808';
      ctx.fillRect(x, y+8, 9, h-16); ctx.fillRect(x+w-9, y+8, 9, h-16);
      // Tread segments
      ctx.fillStyle = '#181818';
      for (let i = 0; i < 4; i++) { ctx.fillRect(x+1, y+10+i*9, 7, 6); ctx.fillRect(x+w-8, y+10+i*9, 7, 6); }
      // Chapter marking (scorched)
      ctx.fillStyle = '#2a0a0a';
      ctx.fillRect(cx-12, cy-14, 24, 28);
      // Fire glow
      const fg = ctx.createRadialGradient(cx, y+8, 0, cx, y+8, 36);
      fg.addColorStop(0, 'rgba(255,100,10,0.5)'); fg.addColorStop(1, 'rgba(200,40,0,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.ellipse(cx, y+8, 28, 18, 0, 0, Math.PI*2); ctx.fill();
      // Smoke
      ctx.fillStyle = 'rgba(30,30,30,0.35)';
      ctx.beginPath(); ctx.ellipse(cx-8,  y-10, 14, 9, -0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+10, y-18, 11, 7,  0.2, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#303030'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.stroke();
      break;
    }
    case 'rubble': {
      ctx.fillStyle = '#302820';
      // Irregular chunks
      ctx.beginPath();
      ctx.moveTo(x,    cy); ctx.lineTo(cx-12, y); ctx.lineTo(x+w, y+8);
      ctx.lineTo(x+w,  cy+10); ctx.lineTo(cx+6, y+h); ctx.lineTo(x+4, y+h-4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#201c14';
      ctx.beginPath();
      ctx.moveTo(cx-8, y+6); ctx.lineTo(cx+14, y+4); ctx.lineTo(cx+10, cy-4); ctx.lineTo(cx-6, cy-6);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#181410'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, cy); ctx.lineTo(cx-12, y); ctx.lineTo(x+w, y+8);
      ctx.lineTo(x+w, cy+10); ctx.lineTo(cx+6, y+h); ctx.lineTo(x+4, y+h-4);
      ctx.closePath(); ctx.stroke();
      break;
    }
  }
}

// ─── Destructible object ──────────────────────────────────────
class Destructible {
  constructor(x, y, type) {
    this.x      = x; this.y = y;
    this.type   = type;        // 'servoSkull' | 'ammoCrate'
    this.hp     = 1;
    this.radius = type === 'servoSkull' ? 13 : 17;
    this.alive  = true;
    this.angle  = Math.random() * Math.PI * 2;
  }
  update(dt) { if (this.type === 'servoSkull') this.angle += dt * 1.4; }
  takeDamage() { this.hp--; return this.hp <= 0; }

  draw(ctx, camera) {
    if (!this.alive) return;
    const { x: sx, y: sy } = camera.toScreen(
      this.x, this.y - (this.type === 'servoSkull' ? Math.sin(this.angle) * 5 : 0)
    );
    if (this.type === 'servoSkull') {
      // Floating servo-skull
      ctx.shadowColor = '#aabbff'; ctx.shadowBlur = 14;
      ctx.fillStyle = '#b8b8c8';
      ctx.beginPath(); ctx.arc(sx, sy, 13, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      // Skull detail
      ctx.fillStyle = '#d0d0e0';
      ctx.beginPath(); ctx.ellipse(sx, sy-3, 9, 8, 0, 0, Math.PI*2); ctx.fill();
      // Eye sockets — glowing blue
      ctx.shadowColor = '#00aaff'; ctx.shadowBlur = 8;
      ctx.fillStyle = '#00ccff';
      ctx.beginPath(); ctx.arc(sx-4, sy-4, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(sx+4, sy-4, 3, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      // Jaw area
      ctx.fillStyle = '#8888a0';
      ctx.fillRect(sx-5, sy+2, 10, 5);
      // Mechanical mandibles
      ctx.strokeStyle = '#6a6a8a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sx-5, sy+6); ctx.lineTo(sx-8, sy+11); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx+5, sy+6); ctx.lineTo(sx+8, sy+11); ctx.stroke();
      // Hover bracket below
      ctx.strokeStyle = 'rgba(100,150,255,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sx-8, sy+14); ctx.lineTo(sx-8, sy+18); ctx.lineTo(sx+8, sy+18); ctx.lineTo(sx+8, sy+14); ctx.stroke();
    } else {
      // Ammo crate
      ctx.fillStyle = '#2a3a18';
      ctx.fillRect(sx-17, sy-13, 34, 26);
      ctx.strokeStyle = '#4a5a38'; ctx.lineWidth = 1.5;
      ctx.strokeRect(sx-17, sy-13, 34, 26);
      // Metal clasp
      ctx.strokeStyle = '#7a8a58'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx-17, sy); ctx.lineTo(sx+17, sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy-13); ctx.lineTo(sx, sy+13); ctx.stroke();
      // Imperial symbol
      ctx.fillStyle = '#c9a227'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
      ctx.fillText('=I=', sx, sy+4);
      ctx.textAlign = 'left';
    }
  }
}

// ─── Dropped item ─────────────────────────────────────────────
const DROP_COLORS = {
  promethium:        '#FF6B00',
  medkit:            '#27ae60',
  holyWaterGrenade:  '#aaddff',
  absorptionDevice:  '#aa44ff',
};
const DROP_LABELS = {
  promethium:        'PROMETHIUM',
  medkit:            'MEDKIT',
  holyWaterGrenade:  'HOLY WATER',
  absorptionDevice:  'XP MAGNET',
};

class DroppedItem {
  constructor(x, y, type) {
    this.x = x; this.y = y; this.type = type;
    this.radius = 13;
    this.life   = ITEM_LIFETIME;
    this.angle  = 0;
    this.alive  = true;
  }
  update(dt) {
    this.life  -= dt;
    this.angle += dt * 2.2;
    if (this.life <= 0) this.alive = false;
  }
  draw(ctx, camera) {
    if (!this.alive) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const alpha = Math.min(this.life / 3, 1);
    const r = this.radius;
    const c = DROP_COLORS[this.type];
    ctx.globalAlpha = alpha;

    // Outer pulse ring
    const pulse = 1 + 0.15 * Math.sin(this.angle * 2);
    ctx.shadowColor = c; ctx.shadowBlur = 10;
    ctx.strokeStyle = c; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, r * pulse, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0;

    // Spin wrapper
    ctx.save(); ctx.translate(x, y); ctx.rotate(this.angle);

    switch (this.type) {
      case 'promethium': {
        // Hexagonal fuel token — gold/orange
        ctx.fillStyle = c;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i/6)*Math.PI*2 - Math.PI/6;
          i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
                  : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffcc44';
        ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
        ctx.fillText('⬡', 0, 4);
        break;
      }
      case 'medkit': {
        // Green cross box
        ctx.fillStyle = '#1a6a2a';
        ctx.fillRect(-r, -r, r*2, r*2);
        ctx.fillStyle = '#50e870';
        ctx.fillRect(-r*0.65, -r*0.22, r*1.3, r*0.44);
        ctx.fillRect(-r*0.22, -r*0.65, r*0.44, r*1.3);
        break;
      }
      case 'holyWaterGrenade': {
        // Glowing blue orb with cross
        const grd = ctx.createRadialGradient(0,0,0, 0,0,r);
        grd.addColorStop(0,'rgba(220,240,255,0.9)'); grd.addColorStop(1,'rgba(100,180,255,0.3)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0,-r*0.55); ctx.lineTo(0, r*0.55); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-r*0.35,-r*0.15); ctx.lineTo(r*0.35,-r*0.15); ctx.stroke();
        break;
      }
      case 'absorptionDevice': {
        // Purple horseshoe magnet / diamond
        ctx.fillStyle = '#7a22cc';
        ctx.beginPath();
        ctx.moveTo(0,-r); ctx.lineTo(r*0.7,0); ctx.lineTo(0,r); ctx.lineTo(-r*0.7,0);
        ctx.closePath(); ctx.fill();
        // Inward arrows
        ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 1.5;
        const pts = [[-r*0.3,0],[r*0.3,0],[0,-r*0.3],[0,r*0.3]];
        const dirs= [[1,0],[-1,0],[0,1],[0,-1]];
        pts.forEach(([px,py],[dx,dy]) => {
          ctx.beginPath(); ctx.moveTo(px+dx*r*0.28, py+dy*r*0.28); ctx.lineTo(px, py); ctx.stroke();
        });
        break;
      }
    }
    ctx.restore();

    // Label
    ctx.font = 'bold 10px "Segoe UI"'; ctx.textAlign = 'center';
    ctx.fillStyle = c;
    ctx.fillText(DROP_LABELS[this.type], x, y - r - 5);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
}

// ─── Fixed Map Item (beacon pickup) ──────────────────────────
const MAP_ITEM_DEFS = [
  { id: 'jetPack',      x:    0, y: -1800, color: '#FFD700', label: 'Jet Pack Fragment', stat: 'speed',       icon: '🚀' },
  { id: 'meltaCharge',  x: 1800, y:     0, color: '#FF4400', label: 'Melta Charge',      stat: 'damage',      icon: '🔥' },
  { id: 'termPlate',    x:    0, y:  1800, color: '#aaaacc', label: 'Terminator Plate',  stat: 'armor',       icon: '🛡' },
  { id: 'skullRelay',   x:-1800, y:     0, color: '#44aaff', label: 'Servo-Skull Relay', stat: 'magnetRange', icon: '💠' },
];

class MapItem {
  constructor(def) {
    Object.assign(this, def);
    this.radius = 22;
    this.picked = false;
    this.angle  = 0;
  }
  update(dt) { this.angle += dt * 1.5; }

  draw(ctx, camera) {
    if (this.picked) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const onScreen = camera.isVisible(this.x, this.y, 120);

    if (!onScreen) {
      this._drawArrow(ctx, camera); return;
    }

    const pulse = 0.7 + 0.3 * Math.sin(this.angle);

    // Beacon pillar of light
    const pillar = ctx.createLinearGradient(x, y-180, x, y);
    pillar.addColorStop(0, 'rgba(0,0,0,0)');
    pillar.addColorStop(1, this.color + '55');
    ctx.fillStyle = pillar;
    ctx.fillRect(x-5, y-180, 10, 180);

    // Pulsing ground glow
    const grd = ctx.createRadialGradient(x,y,0, x,y,60*pulse);
    grd.addColorStop(0, this.color+'44'); grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(x, y, 60*pulse, 0, Math.PI*2); ctx.fill();

    // Rotating outer ring
    ctx.save(); ctx.translate(x,y); ctx.rotate(this.angle);
    ctx.strokeStyle = this.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
    ctx.setLineDash([8,8]);
    ctx.beginPath(); ctx.arc(0, 0, 28*pulse, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1; ctx.restore();

    // Core orb
    ctx.shadowColor = this.color; ctx.shadowBlur = 20*pulse;
    ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(x, y, 18*pulse, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.font = 'bold 12px "Segoe UI"'; ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 3;
    ctx.strokeText(this.label, x, y - 36);
    ctx.fillText(this.label, x, y - 36);
    ctx.fillStyle = this.color;
    ctx.strokeText('[ PICK UP ]', x, y - 20);
    ctx.fillText('[ PICK UP ]', x, y - 20);
    ctx.textAlign = 'left';
  }

  _drawArrow(ctx, camera) {
    // Screen-edge compass arrow pointing toward item
    const W = camera.width, H = camera.height;
    const { x: sx, y: sy } = camera.toScreen(this.x, this.y);
    const dx = sx - W/2, dy = sy - H/2;
    const ang = Math.atan2(dy, dx);
    const margin = 40;
    const arrowX = W/2 + Math.cos(ang) * Math.min(Math.abs(dx), W/2 - margin);
    const arrowY = H/2 + Math.sin(ang) * Math.min(Math.abs(dy), H/2 - margin);
    const clampX = Math.max(margin, Math.min(W-margin, arrowX));
    const clampY = Math.max(margin, Math.min(H-margin, arrowY));

    ctx.save(); ctx.translate(clampX, clampY); ctx.rotate(ang);
    const pulse = 0.7 + 0.3 * Math.sin(Date.now()*0.003);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.moveTo(14,0); ctx.lineTo(-8,-7); ctx.lineTo(-8,7); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1; ctx.restore();
  }
}

// ─── Drop application ─────────────────────────────────────────
function applyDrop(type, player, game) {
  switch (type) {
    case 'promethium':
      player.score += 500;
      game.pools.floatText.acquire(player.x, player.y-35, '+500', '#FF8C00', 18);
      break;
    case 'medkit':
      player.heal(40);
      game.pools.floatText.acquire(player.x, player.y-35, '+40 HP', '#50e870', 18);
      break;
    case 'holyWaterGrenade': {
      // Kill all active enemies
      const snap = [...game.pools.enemies.active];
      snap.forEach(e => { if (e.active) game.onEnemyDeath(e); });
      game.pools.explosions.acquire(player.x, player.y, 900, '#aaddff');
      game.pools.floatText.acquire(player.x, player.y-40, 'CLEANSED!', '#aaddff', 22);
      break;
    }
    case 'absorptionDevice': {
      // Pull all gems into magnet range immediately
      for (const gem of game.pools.xpGems.active) {
        const gdx = gem.x - player.x, gdy = gem.y - player.y;
        const gd = Math.sqrt(gdx*gdx + gdy*gdy) || 1;
        gem.x = player.x + (gdx/gd) * (player.magnetRange * 0.8);
        gem.y = player.y + (gdy/gd) * (player.magnetRange * 0.8);
        gem.vx = gem.vy = 0;
      }
      game.pools.floatText.acquire(player.x, player.y-35, 'XP PULLED!', '#aa88ff', 18);
      break;
    }
  }
}

function applyMapItem(item, player, game) {
  switch (item.stat) {
    case 'speed':       player.speedMult   = (player.speedMult  || 1) * 1.3;  break;
    case 'damage':      player.damageMult  = (player.damageMult || 1) * 1.25; break;
    case 'armor':       player.armor      += 8;   break;
    case 'magnetRange': player.magnetRange *= 1.6; break;
  }
  game.pools.floatText.acquire(player.x, player.y-50, item.label.toUpperCase(), item.color, 18);
}

// ─── WorldSystem (main export) ────────────────────────────────
export class WorldSystem {
  constructor() {
    this._cache       = new Map();   // "cx,cy" → {obstacles, destructible}
    this._visible     = new Set();   // currently loaded chunk keys
    this.obstacles    = [];          // flat list rebuilt each frame
    this.destructibles = [];
    this.droppedItems  = [];
    this.mapItems      = MAP_ITEM_DEFS.map(d => new MapItem(d));
  }

  reset() {
    this._cache.clear();
    this._visible.clear();
    this.obstacles     = [];
    this.destructibles = [];
    this.droppedItems  = [];
    this.mapItems      = MAP_ITEM_DEFS.map(d => new MapItem(d));
  }

  // ── Chunk management ──────────────────────────────────────
  _genChunk(cx, cy) {
    const rng   = seededRng(chunkSeed(cx, cy));
    const ox    = cx * CHUNK_SIZE;
    const oy    = cy * CHUNK_SIZE;
    const obstacles = [];
    const count = 2 + Math.floor(rng() * 3);   // 2, 3, or 4 obstacles

    for (let i = 0; i < count; i++) {
      const def = OBS_POOL[Math.floor(rng() * OBS_POOL.length)];
      const bx  = ox + rng() * (CHUNK_SIZE - def.w - 20) + 10;
      const by  = oy + rng() * (CHUNK_SIZE - def.h - 20) + 10;
      // Reject obstacles too close to world origin
      const nearCx = bx + def.w/2, nearCy = by + def.h/2;
      if (nearCx*nearCx + nearCy*nearCy < SPAWN_CLEAR_R*SPAWN_CLEAR_R) continue;
      obstacles.push({ id: def.id, x: bx, y: by, w: def.w, h: def.h });
    }

    // 1 destructible per ~3 chunks (deterministic)
    let destructible = null;
    const chunkIdx = Math.abs(cx * 31337 + cy * 1337);
    if (chunkIdx % 3 === 0 && rng() < 0.85) {
      const type = rng() < 0.55 ? 'servoSkull' : 'ammoCrate';
      const dx   = ox + 80 + rng() * (CHUNK_SIZE - 160);
      const dy   = oy + 80 + rng() * (CHUNK_SIZE - 160);
      const ncx  = dx, ncy = dy;
      if (ncx*ncx + ncy*ncy >= SPAWN_CLEAR_R*SPAWN_CLEAR_R) {
        destructible = new Destructible(dx, dy, type);
      }
    }

    return { obstacles, destructible };
  }

  _loadVisible(camera) {
    const margin = 1;
    const x0 = Math.floor((camera.x - CHUNK_SIZE * margin) / CHUNK_SIZE);
    const y0 = Math.floor((camera.y - CHUNK_SIZE * margin) / CHUNK_SIZE);
    const x1 = Math.ceil( (camera.x + camera.width  + CHUNK_SIZE * margin) / CHUNK_SIZE);
    const y1 = Math.ceil( (camera.y + camera.height + CHUNK_SIZE * margin) / CHUNK_SIZE);

    const newVisible = new Set();
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const key = `${cx},${cy}`;
        newVisible.add(key);
        if (!this._cache.has(key)) {
          const data = this._genChunk(cx, cy);
          this._cache.set(key, data);
          if (data.destructible) this.destructibles.push(data.destructible);
        }
      }
    }
    this._visible = newVisible;

    // Rebuild flat obstacles from visible chunks
    this.obstacles = [];
    for (const key of this._visible) {
      const [cx, cy] = key.split(',').map(Number);
      const data = this._cache.get(`${cx},${cy}`);
      if (data) this.obstacles.push(...data.obstacles);
    }
  }

  // ── Collision resolution ──────────────────────────────────
  resolveCollisions(entity) {
    const er = entity.radius + 90;  // 90 = max half-size of any obstacle
    for (const obs of this.obstacles) {
      const ocx = obs.x + obs.w/2, ocy = obs.y + obs.h/2;
      if (Math.abs(ocx - entity.x) > er + obs.w/2) continue;
      if (Math.abs(ocy - entity.y) > er + obs.h/2) continue;
      circleAABBResolve(entity, obs);
    }
  }

  // ── Destructible hit helpers ──────────────────────────────
  hitDestructible(dest, game) {
    dest.alive = false;
    const drops = ['promethium','medkit','holyWaterGrenade','absorptionDevice'];
    const weights = [40, 35, 12, 13];
    let roll = Math.random() * 100, acc = 0, type = drops[0];
    for (let i = 0; i < drops.length; i++) {
      acc += weights[i];
      if (roll < acc) { type = drops[i]; break; }
    }
    this.droppedItems.push(new DroppedItem(dest.x, dest.y, type));
    game.pools.explosions.acquire(dest.x, dest.y, 30, '#ffffff');
  }

  checkDestructiblesInRadius(cx, cy, radius, game) {
    for (let i = this.destructibles.length - 1; i >= 0; i--) {
      const d = this.destructibles[i];
      if (!d.alive) continue;
      const dx = d.x - cx, dy = d.y - cy;
      if (dx*dx + dy*dy < (radius + d.radius)**2) {
        this.hitDestructible(d, game);
        this.destructibles.splice(i, 1);
      }
    }
  }

  // ── Main update ───────────────────────────────────────────
  update(dt, camera, player, game) {
    this._loadVisible(camera);

    // Update + collect destructibles
    for (let i = this.destructibles.length - 1; i >= 0; i--) {
      const d = this.destructibles[i];
      if (!d.alive) { this.destructibles.splice(i, 1); continue; }
      d.update(dt);
    }

    // Update + collect dropped items, check player pickup
    for (let i = this.droppedItems.length - 1; i >= 0; i--) {
      const item = this.droppedItems[i];
      item.update(dt);
      if (!item.alive) { this.droppedItems.splice(i, 1); continue; }
      const dx = player.x - item.x, dy = player.y - item.y;
      if (dx*dx + dy*dy < (player.radius + item.radius)**2) {
        applyDrop(item.type, player, game);
        this.droppedItems.splice(i, 1);
      }
    }

    // Map item pickup
    for (const mi of this.mapItems) {
      if (mi.picked) continue;
      mi.update(dt);
      const dx = player.x - mi.x, dy = player.y - mi.y;
      if (dx*dx + dy*dy < (player.radius + mi.radius)**2) {
        mi.picked = true;
        applyMapItem(mi, player, game);
      }
    }
  }

  // ── Render ────────────────────────────────────────────────
  drawBackground(ctx, camera) {
    for (const obs of this.obstacles) {
      if (!camera.isVisible(obs.x + obs.w/2, obs.y + obs.h/2,
                            Math.max(obs.w, obs.h))) continue;
      const { x, y } = camera.toScreen(obs.x, obs.y);
      drawObstacle(ctx, obs.id, x, y, obs.w, obs.h);
    }
  }

  drawForeground(ctx, camera) {
    for (const d  of this.destructibles) d.draw(ctx, camera);
    for (const di of this.droppedItems)  di.draw(ctx, camera);
    for (const mi of this.mapItems)      mi.draw(ctx, camera);
  }
}

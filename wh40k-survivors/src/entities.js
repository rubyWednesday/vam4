// ============================================================
// entities.js — Player, Enemy, XpGem, Projectile,
//               DamageField, Explosion, FloatingText
// ============================================================
import { PLAYER_DATA, ENEMY_DATA, xpForLevel } from './data.js';
import { dist, distSq, normalize, lerp, clamp, randRange } from './engine.js';

// ============================================================
// Player
// ============================================================
export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0; this.y = 0;
    // Base stats (mutated by passives)
    this.hp          = PLAYER_DATA.hp;
    this.maxHp       = PLAYER_DATA.hp;
    this.speed       = PLAYER_DATA.speed;
    this.speedMult   = 1;
    this.damageMult  = 1;
    this.magnetRange = PLAYER_DATA.magnetRange;
    this.armor       = PLAYER_DATA.armor;
    this.radius      = PLAYER_DATA.radius;
    // Progression
    this.level       = 1;
    this.xp          = 0;
    this.xpToNext    = xpForLevel(1);
    // Combat
    this.weapons     = [];            // BaseWeapon instances
    this.passives    = {};            // { id: currentLevel }
    this.killCount   = 0;
    this.score       = 0;
    // State
    this.invincible  = 0;             // seconds remaining
    this.hitFlash    = 0;
    this.facing      = { x: 1, y: 0 };
    this.isDead      = false;
  }

  update(dt, input) {
    const { dx, dy } = input.getMovement();
    if (dx !== 0 || dy !== 0) {
      this.facing.x = dx;
      this.facing.y = dy;
    }
    this.x += dx * this.speed * this.speedMult * dt;
    this.y += dy * this.speed * this.speedMult * dt;

    if (this.invincible > 0) this.invincible -= dt;
    if (this.hitFlash   > 0) this.hitFlash   -= dt;
  }

  /** Returns actual damage dealt (after armor), or 0 if invincible. */
  takeDamage(raw) {
    if (this.invincible > 0) return 0;
    const dmg = Math.max(1, raw - this.armor);
    this.hp = Math.max(0, this.hp - dmg);
    this.invincible = 0.6;
    this.hitFlash   = 0.18;
    if (this.hp <= 0) this.isDead = true;
    return dmg;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  /** Returns true if player leveled up. */
  addXp(amount) {
    this.xp += amount;
    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = xpForLevel(this.level);
      return true;
    }
    return false;
  }

  draw(ctx, camera) {
    const { x, y } = camera.toScreen(this.x, this.y);
    const r = this.radius;

    // Glow aura
    const grd = ctx.createRadialGradient(x, y, r, x, y, r+18);
    grd.addColorStop(0, 'rgba(76,175,80,0.35)');
    grd.addColorStop(1, 'rgba(76,175,80,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r+18, 0, Math.PI*2);
    ctx.fill();

    // Body — space marine power armour silhouette (rect + shoulders)
    const flash = this.hitFlash > 0;
    ctx.fillStyle = flash ? '#ffffff' : '#3a7d3a';
    ctx.fillRect(x - r, y - r, r*2, r*2);

    // Shoulder pads
    ctx.fillStyle = flash ? '#ffffff' : '#2E7D32';
    ctx.fillRect(x - r - 5, y - r + 2, 6, r*0.9);  // left
    ctx.fillRect(x + r - 1, y - r + 2, 6, r*0.9);  // right

    // Helmet stripe
    ctx.fillStyle = flash ? '#aaaaaa' : '#FFD700';
    ctx.fillRect(x - 3, y - r + 2, 6, r*0.55);

    // Chapter symbol (small cross)
    ctx.fillStyle = flash ? '#ccc' : '#fff';
    ctx.fillRect(x - 1, y - 4, 2, 8);
    ctx.fillRect(x - 4, y - 1, 8, 2);

    // Direction dot
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + this.facing.x * (r+4), y + this.facing.y * (r+4), 3, 0, Math.PI*2);
    ctx.fill();

    // HP bar
    const bw = 44, bh = 5, bx = x - bw/2, by = y - r - 14;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(bx-1, by-1, bw+2, bh+2);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(bx, by, bw * (this.hp/this.maxHp), bh);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(bx, by, Math.min(bw * (this.hp/this.maxHp), bw)*0.3, bh);
  }
}

// ============================================================
// Enemy
// ============================================================
export class Enemy {
  constructor() { this.active = false; }

  init(data, wx, wy) {
    this.data        = data;
    this.x           = wx;
    this.y           = wy;
    this.hp          = data.hp;
    this.maxHp       = data.hp;
    this.speed       = data.speed;
    this.damage      = data.damage;
    this.xp          = data.xp;
    this.radius      = data.radius;
    this.color       = data.color;
    this.isBoss      = data.isBoss;
    this.scoreValue  = data.scoreValue;
    this.active      = true;
    this.hitFlash    = 0;
    this.knockX      = 0;
    this.knockY      = 0;
    this.knockDecay  = 0;
    this.damageAccum = 0;   // for DPS damage fields
    return this;
  }

  update(dt, player) {
    if (!this.active) return;
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const d  = Math.sqrt(dx*dx + dy*dy) || 1;
    this.x += (dx/d) * this.speed * dt + this.knockX * dt;
    this.y += (dy/d) * this.speed * dt + this.knockY * dt;
    this.knockX *= Math.pow(0.05, dt);
    this.knockY *= Math.pow(0.05, dt);
    if (this.hitFlash > 0) this.hitFlash -= dt;
  }

  /** Returns true if enemy died. */
  takeDamage(amount, kbx = 0, kby = 0) {
    this.hp -= amount;
    this.hitFlash = 0.12;
    this.knockX = kbx;
    this.knockY = kby;
    return this.hp <= 0;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const r = this.radius;
    const flash = this.hitFlash > 0;

    if (this.isBoss) {
      // Boss: hexagon shape
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i/6)*Math.PI*2 - Math.PI/6;
        i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
                : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      ctx.closePath();
      ctx.fillStyle = flash ? '#ffffff' : this.color;
      ctx.fill();
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Boss HP bar (wider, above enemy)
      const bw = r*3, bh = 7;
      const bx = x - bw/2, by = y - r - 16;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(bx-1, by-1, bw+2, bh+2);
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(bx, by, bw * (this.hp/this.maxHp), bh);
    } else {
      // Normal: diamond / circle
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI/4);
      ctx.fillStyle = flash ? '#ffffff' : this.color;
      ctx.fillRect(-r*0.75, -r*0.75, r*1.5, r*1.5);
      ctx.restore();
    }
  }
}

// ============================================================
// XpGem
// ============================================================
export class XpGem {
  constructor() { this.active = false; }

  init(wx, wy, value) {
    this.x      = wx;
    this.y      = wy;
    this.value  = value;
    this.active = true;
    this.vx     = 0;
    this.vy     = 0;
    this.radius = 5 + Math.min(value * 0.5, 6);
    this.angle  = Math.random() * Math.PI * 2;
    return this;
  }

  update(dt, player) {
    if (!this.active) return false;
    this.angle += dt * 2;
    const d2 = distSq(this.x, this.y, player.x, player.y);
    const mag2 = player.magnetRange ** 2;

    if (d2 < mag2) {
      // Attract toward player
      const spd = lerp(60, 400, 1 - d2/mag2) + 200;
      const { dx, dy } = normalize(player.x-this.x, player.y-this.y);
      this.vx = lerp(this.vx, dx*spd, Math.min(dt*12, 1));
      this.vy = lerp(this.vy, dy*spd, Math.min(dt*12, 1));
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Collect
    if (dist(this.x, this.y, player.x, player.y) < player.radius + this.radius + 2) {
      return true;  // collected
    }
    return false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const r = this.radius;

    // Pulsing gem (diamond shape)
    const pulse = 1 + Math.sin(this.angle * 3) * 0.12;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle);
    ctx.scale(pulse, pulse);

    // Glow
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r+4);
    grd.addColorStop(0, 'rgba(100,220,255,0.6)');
    grd.addColorStop(1, 'rgba(100,220,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, r+4, 0, Math.PI*2);
    ctx.fill();

    // Diamond
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r*0.7, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r*0.7, 0);
    ctx.closePath();
    ctx.fillStyle = '#7FDBFF';
    ctx.fill();
    ctx.strokeStyle = '#00BFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

// ============================================================
// Projectile
// ============================================================
export class Projectile {
  constructor() { this.active = false; }

  init(wx, wy, vx, vy, dmg, pierce, radius, color, homing = false) {
    this.x       = wx;
    this.y       = wy;
    this.vx      = vx;
    this.vy      = vy;
    this.damage  = dmg;
    this.pierce  = pierce;   // hits remaining
    this.radius  = radius;
    this.color   = color;
    this.homing  = homing;   // homingStrength or false
    this.life    = 4.5;      // seconds before auto-expire
    this.active  = true;
    this.hitSet  = new Set();  // enemies already hit (for piercing)
    return this;
  }

  update(dt, enemies) {
    if (!this.active) return;
    this.life -= dt;
    if (this.life <= 0) { this.active = false; return; }

    // Homing: steer toward nearest enemy
    if (this.homing) {
      let nearest = null, bestD = Infinity;
      for (const e of enemies) {
        if (this.hitSet.has(e)) continue;
        const d = distSq(this.x, this.y, e.x, e.y);
        if (d < bestD) { bestD = d; nearest = e; }
      }
      if (nearest) {
        const spd = Math.sqrt(this.vx**2 + this.vy**2);
        const { dx, dy } = normalize(nearest.x-this.x, nearest.y-this.y);
        this.vx = lerp(this.vx, dx*spd, Math.min(dt*this.homing, 1));
        this.vy = lerp(this.vy, dy*spd, Math.min(dt*this.homing, 1));
      }
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);

    if (this.homing) {
      // Plasma orb — glowing circle
      const grd = ctx.createRadialGradient(x, y, 0, x, y, this.radius*2);
      grd.addColorStop(0, '#FFFFFF');
      grd.addColorStop(0.3, this.color);
      grd.addColorStop(1, 'rgba(255,107,53,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, this.radius*2, 0, Math.PI*2);
      ctx.fill();
    } else {
      // Bullet — elongated rectangle pointing in velocity direction
      const angle = Math.atan2(this.vy, this.vx);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = this.color;
      ctx.fillRect(-8, -this.radius*0.5, 14, this.radius);
      ctx.restore();
    }
  }
}

// ============================================================
// DamageField (grenade burn zone)
// ============================================================
export class DamageField {
  constructor() { this.active = false; }

  init(wx, wy, radius, dps, duration) {
    this.x        = wx;
    this.y        = wy;
    this.radius   = radius;
    this.dps      = dps;
    this.duration = duration;
    this.maxDur   = duration;
    this.active   = true;
    this.tickTimer = 0;
    return this;
  }

  update(dt) {
    if (!this.active) return;
    this.duration -= dt;
    if (this.duration <= 0) this.active = false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const alpha = clamp(this.duration / this.maxDur, 0.05, 0.55);
    const pulse = 1 + Math.sin(Date.now()*0.006) * 0.06;

    const grd = ctx.createRadialGradient(x, y, 0, x, y, this.radius*pulse);
    grd.addColorStop(0,   `rgba(255,200,0,${alpha * 0.8})`);
    grd.addColorStop(0.5, `rgba(255,80,0,${alpha * 0.5})`);
    grd.addColorStop(1,   `rgba(200,0,0,0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, this.radius*pulse, 0, Math.PI*2);
    ctx.fill();
  }
}

// ============================================================
// Explosion (visual only, one-shot)
// ============================================================
export class Explosion {
  constructor() { this.active = false; }

  init(wx, wy, radius, color = '#FF6B00') {
    this.x      = wx;
    this.y      = wy;
    this.radius = radius;
    this.maxR   = radius;
    this.color  = color;
    this.life   = 0.45;
    this.maxLife= 0.45;
    this.active = true;
    return this;
  }

  update(dt) {
    if (!this.active) return;
    this.life -= dt;
    if (this.life <= 0) this.active = false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const t = this.life / this.maxLife;
    const r = this.maxR * (1.4 - t * 0.4);
    const alpha = t * 0.8;

    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(255,255,200,${alpha})`);
    grd.addColorStop(0.3, `rgba(255,150,0,${alpha})`);
    grd.addColorStop(0.7, `rgba(200,50,0,${alpha * 0.6})`);
    grd.addColorStop(1, `rgba(100,0,0,0)`);

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
  }
}

// ============================================================
// FloatingText
// ============================================================
export class FloatingText {
  constructor() { this.active = false; }

  init(wx, wy, text, color = '#fff', size = 14) {
    this.x      = wx;
    this.y      = wy;
    this.text   = text;
    this.color  = color;
    this.size   = size;
    this.life   = 0.9;
    this.maxLife= 0.9;
    this.vy     = -60;
    this.active = true;
    return this;
  }

  update(dt) {
    if (!this.active) return;
    this.life -= dt;
    this.y    += this.vy * dt;
    this.vy   *= Math.pow(0.2, dt);
    if (this.life <= 0) this.active = false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${this.size}px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, x, y);
    ctx.fillText(this.text, x, y);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }
}

// ============================================================
// GrenadeProjectile — arcing visual for frag grenade
// ============================================================
export class GrenadeProjectile {
  constructor() { this.active = false; }

  /** Arc from (sx,sy) to (tx,ty) in duration seconds */
  init(sx, sy, tx, ty, duration, data) {
    this.sx       = sx; this.sy = sy;
    this.tx       = tx; this.ty = ty;
    this.x        = sx; this.y = sy;
    this.duration = duration;
    this.maxDur   = duration;
    this.t        = 0;
    this.data     = data;   // { radius, dps, fieldDur, dmg }
    this.active   = true;
    return this;
  }

  update(dt) {
    if (!this.active) return false;
    this.t += dt;
    const p = Math.min(this.t / this.maxDur, 1);
    this.x = lerp(this.sx, this.tx, p);
    this.y = lerp(this.sy, this.ty, p) - Math.sin(p * Math.PI) * 120;
    if (p >= 1) { this.active = false; return true; }  // landed
    return false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.t * 8);
    // Grenade shape
    ctx.fillStyle = '#3a5a2a';
    ctx.fillRect(-6, -7, 12, 13);
    ctx.fillStyle = '#7CFC00';
    ctx.fillRect(-2, -10, 4, 4);
    ctx.restore();
  }
}

// ============================================================
// SwordSlash — visual arc for Power Sword
// ============================================================
export class SwordSlash {
  constructor() { this.active = false; }

  init(px, py, facing, range, arcDeg, side) {
    this.x       = px;
    this.y       = py;
    this.baseAngle = Math.atan2(facing.y, facing.x) + (side === 'left' ? -1 : 1) * Math.PI/2;
    this.range   = range;
    this.arcRad  = (arcDeg / 2) * (Math.PI/180);
    this.life    = 0.18;
    this.maxLife = 0.18;
    this.active  = true;
    return this;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) this.active = false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const { x, y } = camera.toScreen(this.x, this.y);
    const t = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = t * 0.75;
    ctx.strokeStyle = '#00BFFF';
    ctx.lineWidth = 8 * t + 2;
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, this.range * (1.2 - t*0.2),
            this.baseAngle - this.arcRad,
            this.baseAngle + this.arcRad);
    ctx.stroke();
    ctx.restore();
  }
}

// ============================================================
// weapons.js — BaseWeapon, Bolter, PowerSword, PlasmaGun, FragGrenades
// ============================================================
import { WEAPONS_DATA } from './data.js';
import { normalize, randRange, randomChoice, distSq } from './engine.js';

// ============================================================
// BaseWeapon
// ============================================================
export class BaseWeapon {
  constructor(id, game) {
    this.id      = id;
    this.data    = WEAPONS_DATA[id];
    this.level   = 1;
    this.timer   = 0;
    this.game    = game;
    this._stats  = this.data.levels[0];
  }

  get stats() { return this.data.levels[this.level - 1]; }

  levelUp() {
    if (this.level < this.data.maxLevel) {
      this.level++;
      return true;
    }
    return false;
  }

  update(dt, player, enemies) {
    this.timer += dt;
    const cd = this.stats.cd;
    if (this.timer >= cd) {
      this.timer = 0;
      this.fire(player, enemies);
    }
  }

  /** Override in subclass */
  fire(player, enemies) {}

  /** Find nearest enemy to point (px,py) */
  _nearest(px, py, enemies) {
    let best = null, bestD = Infinity;
    for (const e of enemies) {
      const d = distSq(px, py, e.x, e.y);
      if (d < bestD) { bestD = d; best = e; }
    }
    return best;
  }
}

// ============================================================
// Bolter — rapid-fire projectiles toward nearest enemy
// ============================================================
export class Bolter extends BaseWeapon {
  constructor(game) { super('bolter', game); }

  fire(player, enemies) {
    if (!enemies.length) return;
    const target = this._nearest(player.x, player.y, enemies);
    if (!target) return;

    const { count, spd, spread, dmg, pierce, bulletRadius } = this.stats;
    const baseDmg = dmg * player.damageMult;

    // Centre angle toward target
    const baseAng = Math.atan2(target.y - player.y, target.x - player.x);

    for (let i = 0; i < count; i++) {
      const halfSpread = (spread * Math.PI/180) / 2;
      const offset = count > 1 ? -halfSpread + (i / (count-1)) * halfSpread * 2 : 0;
      const ang = baseAng + offset + (Math.random()-0.5) * (2*Math.PI/180);
      const vx = Math.cos(ang) * spd;
      const vy = Math.sin(ang) * spd;
      this.game.pools.projectiles.acquire(
        player.x, player.y, vx, vy, baseDmg, pierce, bulletRadius, this.data.color, false
      );
    }
  }
}

// ============================================================
// Power Sword — 360° close-range sweep around player
// Bug fix: original side-arc logic missed enemies charging head-on.
// Now damages all enemies within range, plays two visual slashes.
// ============================================================
export class PowerSword extends BaseWeapon {
  constructor(game) { super('powerSword', game); }

  fire(player, enemies) {
    const { dmg, range } = this.stats;
    const baseDmg = dmg * player.damageMult;

    // Two visual slashes — intensity scales with weapon level
    const intensity = (this.level - 1) / (this.data.maxLevel - 1);
    for (const side of ['left', 'right']) {
      this.game.pools.slashes.acquire(
        player.x, player.y, player.facing, range, this.stats.arc, side, intensity
      );
    }

    // Power sword hits destructibles in range
    this.game.world.checkDestructiblesInRadius(player.x, player.y, range, this.game);

    // Damage all enemies within range — simple circle, iterate snapshot
    const hitSet = new Set();
    for (const e of [...enemies]) {
      if (!e.active || hitSet.has(e)) continue;
      const dx = e.x - player.x, dy = e.y - player.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d > range + e.radius) continue;
      hitSet.add(e);
      const died = e.takeDamage(baseDmg);
      this.game.pools.floatText.acquire(
        e.x, e.y - e.radius, Math.floor(baseDmg).toString(), '#00BFFF', 13
      );
      if (died) this.game.onEnemyDeath(e);
    }
  }
}

// ============================================================
// Plasma Gun — homing energy bolt
// ============================================================
export class PlasmaGun extends BaseWeapon {
  constructor(game) { super('plasmaGun', game); }

  fire(player, enemies) {
    if (!enemies.length) return;
    const target = this._nearest(player.x, player.y, enemies);
    if (!target) return;

    const { dmg, spd, homing, radius } = this.stats;
    const baseDmg = dmg * player.damageMult;
    const { dx, dy } = normalize(target.x - player.x, target.y - player.y);
    this.game.pools.projectiles.acquire(
      player.x, player.y,
      dx * spd, dy * spd,
      baseDmg, 1, radius, this.data.color, homing
    );
  }
}

// ============================================================
// Frag Grenades — arc to random enemy, leave damage field
// ============================================================
export class FragGrenades extends BaseWeapon {
  constructor(game) { super('fragGrenades', game); }

  fire(player, enemies) {
    if (!enemies.length) return;
    const inRange = enemies.filter(e => distSq(player.x, player.y, e.x, e.y) < 600**2);
    const { dmg, radius, fieldDur, fieldDps, count } = this.stats;
    const baseDmg = dmg * player.damageMult;

    for (let i = 0; i < count; i++) {
      // Pick a different target per grenade when count > 1
      const pool = inRange.length ? inRange : enemies;
      const target = count > 1 ? randomChoice(pool) : (pool === inRange ? randomChoice(pool) : randomChoice(enemies));
      const dur = 0.5 + Math.sqrt(distSq(player.x, player.y, target.x, target.y)) / 400;
      // Slight delay for each extra grenade
      const launchX = player.x + (Math.random()-0.5) * 12 * i;
      const launchY = player.y + (Math.random()-0.5) * 12 * i;
      this.game.pools.grenades.acquire(
        launchX, launchY,
        target.x + (Math.random()-0.5) * 30 * i, target.y + (Math.random()-0.5) * 30 * i,
        dur + i * 0.12,
        { radius, dps: fieldDps * player.damageMult, fieldDur, dmg: baseDmg }
      );
    }
  }
}

// ============================================================
// Heavy Flamer — cone of fire toward nearest enemy
// ============================================================
export class HeavyFlamer extends BaseWeapon {
  constructor(game) { super('heavyFlamer', game); }

  fire(player, enemies) {
    if (!enemies.length) return;
    const target = this._nearest(player.x, player.y, enemies);
    if (!target) return;

    const { dmg, range, angle } = this.stats;
    const baseDmg  = dmg * player.damageMult;
    const halfRad  = (angle * Math.PI / 180) / 2;

    const ddx = target.x - player.x, ddy = target.y - player.y;
    const dd  = Math.sqrt(ddx*ddx + ddy*ddy) || 1;
    const fx  = ddx/dd, fy = ddy/dd;

    let textCount = 0;
    for (const e of [...enemies]) {
      if (!e.active) continue;
      const ex = e.x - player.x, ey = e.y - player.y;
      const d  = Math.sqrt(ex*ex + ey*ey) || 1;
      if (d > range + e.radius) continue;
      const dot = (ex/d)*fx + (ey/d)*fy;
      if (dot < Math.cos(halfRad)) continue;
      const died = e.takeDamage(baseDmg, fx*120, fy*120);
      if (textCount < 5) { this.game.pools.floatText.acquire(e.x, e.y - e.radius, Math.floor(baseDmg).toString(), '#FF6600', 12); textCount++; }
      if (died) this.game.onEnemyDeath(e);
    }

    this.game.world.checkDestructiblesInRadius(player.x, player.y, range, this.game);

    const intensity = (this.level - 1) / (this.data.maxLevel - 1);
    this.game.pools.flameJets.acquire(player.x, player.y, fx, fy, range, halfRad, intensity);
  }
}

// ============================================================
// Lascannon — instant piercing laser beam
// ============================================================
export class Lascannon extends BaseWeapon {
  constructor(game) { super('lascannon', game); }

  fire(player, enemies) {
    if (!enemies.length) return;
    const target = this._nearest(player.x, player.y, enemies);
    if (!target) return;

    const { dmg, range, width } = this.stats;
    const baseDmg = dmg * player.damageMult;

    const ddx = target.x - player.x, ddy = target.y - player.y;
    const dd  = Math.sqrt(ddx*ddx + ddy*ddy) || 1;
    const fx  = ddx/dd, fy = ddy/dd;
    const ex  = player.x + fx * range;
    const ey  = player.y + fy * range;

    let textCount = 0;
    for (const e of [...enemies]) {
      if (!e.active) continue;
      if (_distToSeg(e.x, e.y, player.x, player.y, ex, ey) < width + e.radius) {
        const died = e.takeDamage(baseDmg, fx*280, fy*280);
        if (textCount < 5) { this.game.pools.floatText.acquire(e.x, e.y - e.radius, Math.floor(baseDmg).toString(), '#FF3333', 14); textCount++; }
        if (died) this.game.onEnemyDeath(e);
      }
    }

    const intensity = (this.level - 1) / (this.data.maxLevel - 1);
    this.game.pools.laserBeams.acquire(player.x, player.y, ex, ey, width, intensity);
  }
}

// ============================================================
// Storm Bolter — 360° omnidirectional spray, no target needed
// ============================================================
export class StormBolter extends BaseWeapon {
  constructor(game) { super('stormBolter', game); this._phase = 0; }

  fire(player, enemies) {
    const { dmg, spd, count, bulletRadius } = this.stats;
    const baseDmg = dmg * player.damageMult;
    // Rotate pattern each fire for full 360° coverage over time
    this._phase += Math.PI / count;
    for (let i = 0; i < count; i++) {
      const ang = this._phase + (i / count) * Math.PI * 2;
      this.game.pools.projectiles.acquire(
        player.x, player.y,
        Math.cos(ang) * spd, Math.sin(ang) * spd,
        baseDmg, 1, bulletRadius, this.data.color, false
      );
    }
  }
}

// ============================================================
// Melta Gun — short-range nuke; holds fire until enemy is close
// ============================================================
export class MeltaGun extends BaseWeapon {
  constructor(game) { super('meltaGun', game); }

  // Override: hold timer at threshold when no enemy is in range
  update(dt, player, enemies) {
    this.timer += dt;
    if (this.timer >= this.stats.cd) {
      if (this._tryFire(player, enemies)) this.timer = 0;
      else this.timer = this.stats.cd; // stay hot, retry next frame
    }
  }

  _tryFire(player, enemies) {
    if (!enemies.length) return false;
    const target = this._nearest(player.x, player.y, enemies);
    if (!target) return false;

    const { dmg, range, fieldDur, fieldDps } = this.stats;
    if (distSq(player.x, player.y, target.x, target.y) > (range + target.radius) ** 2) return false;

    const baseDmg = dmg * player.damageMult;
    let textCount = 0;
    for (const e of [...enemies]) {
      if (!e.active) continue;
      if (distSq(player.x, player.y, e.x, e.y) > (range + e.radius) ** 2) continue;
      const { dx, dy } = normalize(e.x - player.x, e.y - player.y);
      const died = e.takeDamage(baseDmg, dx * 350, dy * 350);
      if (textCount < 6) {
        this.game.pools.floatText.acquire(e.x, e.y - e.radius, Math.floor(baseDmg).toString(), this.data.color, 14);
        textCount++;
      }
      if (died) this.game.onEnemyDeath(e);
    }
    this.game.pools.explosions.acquire(player.x, player.y, range, '#FF6633');
    this.game.pools.damageFields.acquire(player.x, player.y, range * 0.7, fieldDps * player.damageMult, fieldDur);
    return true;
  }

  fire() {} // not used (update overridden)
}

// ============================================================
// Orbital Strike — finds densest cluster, calls in bombardment
// ============================================================
export class OrbitalStrike extends BaseWeapon {
  constructor(game) { super('orbitalStrike', game); }

  fire(player, enemies) {
    if (!enemies.length) return;
    const { dmg, radius, fieldDur, fieldDps } = this.stats;

    // Find enemy with most neighbours within radius (O(n²), fires every 6-10s)
    let bestCenter = enemies[0], bestCount = 0;
    for (const e of enemies) {
      let n = 0;
      for (const other of enemies) {
        if (distSq(e.x, e.y, other.x, other.y) < radius * radius) n++;
      }
      if (n > bestCount) { bestCount = n; bestCenter = e; }
    }

    const tx = bestCenter.x, ty = bestCenter.y;
    const baseDmg = dmg * player.damageMult;
    let textCount = 0;
    for (const e of [...enemies]) {
      if (!e.active) continue;
      if (distSq(tx, ty, e.x, e.y) > (radius + e.radius) ** 2) continue;
      const { dx, dy } = normalize(e.x - tx, e.y - ty);
      const died = e.takeDamage(baseDmg, dx * 400, dy * 400);
      if (textCount < 8) {
        this.game.pools.floatText.acquire(e.x, e.y - e.radius, Math.floor(baseDmg).toString(), this.data.color, 13);
        textCount++;
      }
      if (died) this.game.onEnemyDeath(e);
    }
    this.game.pools.explosions.acquire(tx, ty, radius, '#9B59B6');
    this.game.pools.damageFields.acquire(tx, ty, radius * 0.55, fieldDps * player.damageMult, fieldDur);
    this.game.pools.floatText.acquire(tx, ty - radius - 16, 'ORBITAL!', '#9B59B6', 18);
  }
}

function _distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx-ax, dy = by-ay;
  const lenSq = dx*dx + dy*dy;
  if (lenSq === 0) return Math.sqrt((px-ax)**2 + (py-ay)**2);
  const t = Math.max(0, Math.min(1, ((px-ax)*dx + (py-ay)*dy) / lenSq));
  return Math.sqrt((px-(ax+t*dx))**2 + (py-(ay+t*dy))**2);
}

// ============================================================
// Weapon factory
// ============================================================
export function createWeapon(id, game) {
  switch (id) {
    case 'bolter':        return new Bolter(game);
    case 'powerSword':    return new PowerSword(game);
    case 'plasmaGun':     return new PlasmaGun(game);
    case 'fragGrenades':  return new FragGrenades(game);
    case 'heavyFlamer':   return new HeavyFlamer(game);
    case 'lascannon':     return new Lascannon(game);
    case 'stormBolter':   return new StormBolter(game);
    case 'meltaGun':      return new MeltaGun(game);
    case 'orbitalStrike': return new OrbitalStrike(game);
    default: throw new Error(`Unknown weapon: ${id}`);
  }
}

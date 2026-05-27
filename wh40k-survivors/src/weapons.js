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

    const { count, spd, spread, dmg, pierce } = this.stats;
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
        player.x, player.y, vx, vy, baseDmg, pierce, 4, this.data.color, false
      );
    }
  }
}

// ============================================================
// Power Sword — arc sweep left+right
// ============================================================
export class PowerSword extends BaseWeapon {
  constructor(game) { super('powerSword', game); }

  fire(player, enemies) {
    const { dmg, arc, range } = this.stats;
    const baseDmg = dmg * player.damageMult;

    for (const side of ['left', 'right']) {
      // Visual slash
      const slash = this.game.pools.slashes.acquire(
        player.x, player.y, player.facing, range, arc, side
      );

      // Hit all enemies in the arc — iterate a snapshot so splice is safe
      const baseAngle = Math.atan2(player.facing.y, player.facing.x) +
                        (side === 'left' ? -1 : 1) * Math.PI/2;
      const halfArc = (arc / 2) * (Math.PI / 180);

      for (const e of [...enemies]) {
        if (!e.active) continue;
        const ex = e.x - player.x, ey = e.y - player.y;
        const d  = Math.sqrt(ex*ex + ey*ey);
        if (d > range + e.radius) continue;
        const ang = Math.atan2(ey, ex);
        let diff = ang - baseAngle;
        while (diff >  Math.PI) diff -= Math.PI*2;
        while (diff < -Math.PI) diff += Math.PI*2;
        if (Math.abs(diff) <= halfArc) {
          const died = e.takeDamage(baseDmg);
          this.game.pools.floatText.acquire(e.x, e.y, Math.floor(baseDmg).toString(), '#00BFFF', 13);
          if (died) this.game.onEnemyDeath(e);
        }
      }
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
    // Pick a random enemy within 600px
    const inRange = enemies.filter(e => distSq(player.x, player.y, e.x, e.y) < 600**2);
    const target = inRange.length ? randomChoice(inRange) : randomChoice(enemies);

    const { dmg, radius, fieldDur, fieldDps } = this.stats;
    const baseDmg = dmg * player.damageMult;
    const dur = 0.5 + Math.sqrt(distSq(player.x, player.y, target.x, target.y)) / 400;

    this.game.pools.grenades.acquire(
      player.x, player.y,
      target.x, target.y,
      dur,
      { radius, dps: fieldDps * player.damageMult, fieldDur, dmg: baseDmg }
    );
  }
}

// ============================================================
// Weapon factory
// ============================================================
export function createWeapon(id, game) {
  switch (id) {
    case 'bolter':       return new Bolter(game);
    case 'powerSword':   return new PowerSword(game);
    case 'plasmaGun':    return new PlasmaGun(game);
    case 'fragGrenades': return new FragGrenades(game);
    default: throw new Error(`Unknown weapon: ${id}`);
  }
}

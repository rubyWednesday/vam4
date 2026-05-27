// ============================================================
// game.js — Main Game class + WaveManager
// ============================================================
import { CANVAS, TILE_SIZE, WAVES, BOSS_SPAWNS, WEAPONS_DATA, PASSIVES_DATA, ENEMY_DATA } from './data.js';
import {
  ObjectPool, Camera, Input,
  dist, normalize, clamp, randomChoice, formatTime,
} from './engine.js';
import {
  Player, Enemy, XpGem, Projectile, DamageField,
  Explosion, FloatingText, GrenadeProjectile, SwordSlash,
} from './entities.js';
import { Bolter, createWeapon } from './weapons.js';
import {
  drawHUD, drawLevelUpScreen, drawPauseScreen,
  drawGameOverScreen, drawMenuScreen, drawBossWarning,
  buildLevelUpOptions,
} from './ui.js';
import { WorldSystem } from './world.js';

// ---- Tile colours for infinite tiled ground ----
const TILE_COLORS = ['#141414', '#161616', '#181818', '#131313', '#151515'];
function tileColor(tx, ty) {
  const hash = ((tx * 2654435761) ^ (ty * 2246822519)) >>> 0;
  return TILE_COLORS[hash % TILE_COLORS.length];
}

// ============================================================
// WaveManager
// ============================================================
class WaveManager {
  constructor() {
    this.spawnTimer  = 0;
    this.bossQueue   = [...BOSS_SPAWNS];  // copy
    this._lastWave   = null;
  }

  currentWave(gameTime) {
    let wave = WAVES[0];
    for (const w of WAVES) {
      if (gameTime >= w.time) wave = w;
      else break;
    }
    return wave;
  }

  update(dt, gameTime, game) {
    const wave = this.currentWave(gameTime);

    // Spawn regular enemies
    if (game.enemies.count < wave.max) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= wave.rate) {
        this.spawnTimer = 0;
        const type = randomChoice(wave.types);
        const pos  = game.camera.randomSpawnPoint();
        game.spawnEnemy(type, pos.x, pos.y);
      }
    }

    // Boss spawns
    if (this.bossQueue.length && gameTime >= this.bossQueue[0].time) {
      const boss = this.bossQueue.shift();
      const pos  = game.camera.randomSpawnPoint(120);
      game.spawnEnemy(boss.type, pos.x, pos.y);
      game.bossWarningTimer = 3.5;
    }
  }
}

// ============================================================
// Game
// ============================================================
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    canvas.width  = CANVAS.WIDTH;
    canvas.height = CANVAS.HEIGHT;

    this.input  = new Input();
    this.camera = new Camera(CANVAS.WIDTH, CANVAS.HEIGHT);

    // ---- Object Pools ----
    this.pools = {
      enemies:     new ObjectPool(() => new Enemy(),        (obj, data, x, y) => obj.init(data, x, y), 80),
      projectiles: new ObjectPool(() => new Projectile(),   (obj, x, y, vx, vy, d, p, r, c, h) => obj.init(x,y,vx,vy,d,p,r,c,h), 200),
      xpGems:      new ObjectPool(() => new XpGem(),        (obj, x, y, v) => obj.init(x, y, v), 300),
      damageFields:new ObjectPool(() => new DamageField(),  (obj, x, y, r, dps, dur) => obj.init(x,y,r,dps,dur), 30),
      explosions:  new ObjectPool(() => new Explosion(),    (obj, x, y, r, c) => obj.init(x,y,r,c), 40),
      floatText:   new ObjectPool(() => new FloatingText(), (obj, x, y, t, c, s) => obj.init(x,y,t,c,s), 80),
      grenades:    new ObjectPool(() => new GrenadeProjectile(), (obj,sx,sy,tx,ty,d,data) => obj.init(sx,sy,tx,ty,d,data), 20),
      slashes:     new ObjectPool(() => new SwordSlash(),   (obj,px,py,f,rng,arc,side) => obj.init(px,py,f,rng,arc,side), 20),
    };

    // Alias for weapon code
    this.enemies = this.pools.enemies;

    this.player      = new Player();
    this.waveManager = new WaveManager();
    this.world       = new WorldSystem();

    // State
    this.state         = 'menu';    // menu | playing | paused | levelup | gameover
    this.gameTime      = 0;
    this.levelUpOptions = [];
    this.hoveredCard   = 0;
    this.bossWarningTimer = 0;

    this._setupEvents();
  }

  // ---- Event Listeners ----
  _setupEvents() {
    window.addEventListener('keydown', e => {
      if (this.state === 'menu' && e.code === 'Enter') {
        this._startGame(); return;
      }
      if (this.state === 'gameover' && e.code === 'Enter') {
        this._startGame(); return;
      }
      if (this.state === 'playing' && e.code === 'Escape') {
        this.state = 'paused'; return;
      }
      if (this.state === 'paused' && e.code === 'Escape') {
        this.state = 'playing'; return;
      }
      if (this.state === 'levelup') {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < this.levelUpOptions.length) {
          this._applyUpgrade(this.levelUpOptions[idx]); return;
        }
        if (e.code === 'ArrowLeft')  { this.hoveredCard = Math.max(0, this.hoveredCard-1); return; }
        if (e.code === 'ArrowRight') { this.hoveredCard = Math.min(this.levelUpOptions.length-1, this.hoveredCard+1); return; }
        if (e.code === 'Enter' || e.code === 'Space') {
          this._applyUpgrade(this.levelUpOptions[this.hoveredCard]); return;
        }
      }
    });

    this.canvas.addEventListener('mousemove', e => {
      if (this.state !== 'levelup') return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS.WIDTH  / rect.width;
      const scaleY = CANVAS.HEIGHT / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top)  * scaleY;

      const n = this.levelUpOptions.length;
      const CARD_W = 240, GAP = 20;
      const totalW = n * CARD_W + (n-1) * GAP;
      const startX = (CANVAS.WIDTH - totalW) / 2;
      const cardY  = CANVAS.HEIGHT/2 - 80;

      for (let i = 0; i < n; i++) {
        const cx = startX + i*(CARD_W+GAP);
        if (mx >= cx && mx <= cx+CARD_W && my >= cardY && my <= cardY+170) {
          this.hoveredCard = i; return;
        }
      }
    });

    this.canvas.addEventListener('click', e => {
      if (this.state !== 'levelup') return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS.WIDTH  / rect.width;
      const scaleY = CANVAS.HEIGHT / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top)  * scaleY;

      const n = this.levelUpOptions.length;
      const CARD_W = 240, GAP = 20;
      const totalW = n * CARD_W + (n-1) * GAP;
      const startX = (CANVAS.WIDTH - totalW) / 2;
      const cardY  = CANVAS.HEIGHT/2 - 80;

      for (let i = 0; i < n; i++) {
        const cx = startX + i*(CARD_W+GAP);
        if (mx >= cx && mx <= cx+CARD_W && my >= cardY && my <= cardY+170) {
          this._applyUpgrade(this.levelUpOptions[i]); return;
        }
      }
    });
  }

  _startGame() {
    // Reset everything
    Object.values(this.pools).forEach(p => p.releaseAll());
    this.player = new Player();
    this.waveManager = new WaveManager();
    this.world.reset();
    this.gameTime = 0;
    this.bossWarningTimer = 0;

    // Give starting weapon
    const bolter = createWeapon('bolter', this);
    this.player.weapons.push(bolter);

    this.state = 'playing';
  }

  // ---- Enemy Spawn ----
  spawnEnemy(typeId, wx, wy) {
    const data = ENEMY_DATA[typeId];
    if (!data) return null;
    return this.pools.enemies.acquire(data, wx, wy);
  }

  // ---- Enemy Death Handler ----
  onEnemyDeath(enemy) {
    if (!enemy.active) return;
    enemy.active = false;
    this.player.killCount++;
    this.player.score += enemy.scoreValue;

    // XP gem drop
    this.pools.xpGems.acquire(enemy.x, enemy.y, enemy.xp);

    // Explosion visual
    this.pools.explosions.acquire(enemy.x, enemy.y, enemy.radius * 2.5, '#FF6B00');

    this.pools.enemies.release(enemy);
  }

  // ---- Upgrade Apply ----
  _applyUpgrade(opt) {
    const player = this.player;
    if (opt.type === 'weaponNew') {
      const w = createWeapon(opt.id, this);
      player.weapons.push(w);
    } else if (opt.type === 'weaponUp') {
      const w = player.weapons.find(w => w.id === opt.id);
      if (w) w.levelUp();
    } else if (opt.type === 'passive') {
      const curLvl = (player.passives[opt.id] || 0) + 1;
      player.passives[opt.id] = curLvl;
      PASSIVES_DATA[opt.id].applyLevel(player, curLvl);
    } else if (opt.type === 'heal') {
      player.heal(30);
    }
    this.state = 'playing';
  }

  // ============================================================
  // UPDATE
  // ============================================================
  update(dt) {
    this.input.flush();

    if (this.state !== 'playing') return;

    this.gameTime += dt;
    if (this.bossWarningTimer > 0) this.bossWarningTimer -= dt;

    // Player
    this.player.update(dt, this.input);
    this.camera.follow(this.player);

    // World: chunk streaming + item pickups + obstacle collision
    this.world.update(dt, this.camera, this.player, this);
    this.world.resolveCollisions(this.player);

    // Weapons (each weapon's update fires them)
    const activeEnemies = this.pools.enemies.active;
    for (const w of this.player.weapons) {
      w.update(dt, this.player, activeEnemies);
    }

    // Wave manager
    this.waveManager.update(dt, this.gameTime, this);

    // ---- Update Enemies ----
    this.pools.enemies.updateAll((e, idx) => {
      if (!e.active) { this.pools.enemies.release(e); return; }
      e.update(dt, this.player);
      this.world.resolveCollisions(e);  // obstacle collision

      // Enemy → player collision
      const d = dist(e.x, e.y, this.player.x, this.player.y);
      if (d < e.radius + this.player.radius) {
        const dmg = this.player.takeDamage(e.damage);
        if (dmg > 0) {
          this.pools.floatText.acquire(
            this.player.x + (Math.random()-0.5)*20,
            this.player.y - 20,
            `-${dmg}`, '#e74c3c', 15
          );
        }
      }
    });

    // ---- Update Projectiles ----
    this.pools.projectiles.updateAll((p, _) => {
      if (!p.active) { this.pools.projectiles.release(p); return; }
      p.update(dt, activeEnemies);

      // Projectile → enemy collision
      for (let i = activeEnemies.length - 1; i >= 0; i--) {
        const e = activeEnemies[i];
        if (!e.active || p.hitSet.has(e)) continue;
        const d = dist(p.x, p.y, e.x, e.y);
        if (d < p.radius + e.radius) {
          p.hitSet.add(e);
          p.pierce--;
          const { dx, dy } = normalize(e.x - this.player.x, e.y - this.player.y);
          const died = e.takeDamage(p.damage, dx*200, dy*200);
          this.pools.floatText.acquire(e.x, e.y - e.radius, Math.floor(p.damage).toString(), '#FFD700', 12);
          if (died) this.onEnemyDeath(e);
          if (p.pierce <= 0) { p.active = false; break; }
        }
      }
      // Projectile → destructible collision
      if (p.active) {
        for (let di = this.world.destructibles.length - 1; di >= 0; di--) {
          const dest = this.world.destructibles[di];
          if (!dest.alive) continue;
          if (dist(p.x, p.y, dest.x, dest.y) < p.radius + dest.radius) {
            const died = dest.takeDamage();
            if (died) {
              this.world.hitDestructible(dest, this);
              this.world.destructibles.splice(di, 1);
            }
            p.pierce--;
            if (p.pierce <= 0) { p.active = false; break; }
          }
        }
      }
      if (!p.active) this.pools.projectiles.release(p);
    });

    // ---- Update Damage Fields ----
    this.pools.damageFields.updateAll((field, _) => {
      if (!field.active) { this.pools.damageFields.release(field); return; }
      field.update(dt);
      field.tickTimer += dt;
      // Tick every 0.1s
      if (field.tickTimer >= 0.1) {
        field.tickTimer = 0;
        for (const e of activeEnemies) {
          if (!e.active) continue;
          if (dist(field.x, field.y, e.x, e.y) < field.radius + e.radius) {
            const dmg = field.dps * 0.1;
            const died = e.takeDamage(dmg);
            if (died) this.onEnemyDeath(e);
          }
        }
      }
    });

    // ---- Update Grenade Projectiles ----
    this.pools.grenades.updateAll((g, _) => {
      if (!g.active) { this.pools.grenades.release(g); return; }
      const landed = g.update(dt);
      if (landed) {
        const d = g.data;
        // Explosion damage to enemies in radius
        for (const e of activeEnemies) {
          if (!e.active) continue;
          if (dist(g.tx, g.ty, e.x, e.y) < d.radius + e.radius) {
            const died = e.takeDamage(d.dmg);
            this.pools.floatText.acquire(e.x, e.y - e.radius, Math.floor(d.dmg).toString(), '#7CFC00', 12);
            if (died) this.onEnemyDeath(e);
          }
        }
        // Visual explosion
        this.pools.explosions.acquire(g.tx, g.ty, d.radius, '#FF8C00');
        // Grenade hits destructibles
        this.world.checkDestructiblesInRadius(g.tx, g.ty, d.radius, this);
        // Leave damage field
        this.pools.damageFields.acquire(g.tx, g.ty, d.radius, d.dps, d.fieldDur);
        this.pools.grenades.release(g);
      }
    });

    // ---- Update XP Gems ----
    this.pools.xpGems.updateAll((gem, _) => {
      if (!gem.active) { this.pools.xpGems.release(gem); return; }
      const collected = gem.update(dt, this.player);
      if (collected) {
        const leveled = this.player.addXp(gem.value);
        if (leveled) {
          this.pools.floatText.acquire(
            this.player.x, this.player.y - 40,
            `LEVEL UP!`, '#FFD700', 20
          );
          this.levelUpOptions = buildLevelUpOptions(this.player);
          this.hoveredCard    = 0;
          this.state = 'levelup';
        }
        this.pools.xpGems.release(gem);
      }
    });

    // ---- Update Explosions ----
    this.pools.explosions.updateAll((exp, _) => {
      if (!exp.active) { this.pools.explosions.release(exp); return; }
      exp.update(dt);
    });

    // ---- Update Slashes ----
    this.pools.slashes.updateAll((s, _) => {
      if (!s.active) { this.pools.slashes.release(s); return; }
      s.update(dt);
    });

    // ---- Update Floating Text ----
    this.pools.floatText.updateAll((ft, _) => {
      if (!ft.active) { this.pools.floatText.release(ft); return; }
      ft.update(dt);
    });

    // ---- Check player dead ----
    if (this.player.isDead) {
      this.state = 'gameover';
    }
  }

  // ============================================================
  // RENDER
  // ============================================================
  render() {
    const ctx = this.ctx;
    const W = CANVAS.WIDTH, H = CANVAS.HEIGHT;

    // --- Clear ---
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    if (this.state === 'menu') {
      drawMenuScreen(ctx);
      return;
    }
    if (this.state === 'gameover') {
      drawGameOverScreen(ctx, {
        time:  this.gameTime,
        kills: this.player.killCount,
        score: this.player.score,
        level: this.player.level,
      });
      return;
    }

    // --- Tiling floor ---
    this._drawFloor(ctx);

    // --- World obstacles (behind everything) ---
    this.world.drawBackground(ctx, this.camera);

    // --- Draw layers (back → front) ---
    // Damage fields
    for (const f of this.pools.damageFields.active) f.draw(ctx, this.camera);
    // XP gems
    for (const g of this.pools.xpGems.active)      g.draw(ctx, this.camera);
    // World: destructibles, dropped items, map item beacons
    this.world.drawForeground(ctx, this.camera);
    // Enemies
    for (const e of this.pools.enemies.active)      e.draw(ctx, this.camera);
    // Slashes
    for (const s of this.pools.slashes.active)      s.draw(ctx, this.camera);
    // Player
    this.player.draw(ctx, this.camera);
    // Grenade arcs
    for (const g of this.pools.grenades.active)     g.draw(ctx, this.camera);
    // Projectiles
    for (const p of this.pools.projectiles.active)  p.draw(ctx, this.camera);
    // Explosions
    for (const e of this.pools.explosions.active)   e.draw(ctx, this.camera);
    // Floating texts
    for (const t of this.pools.floatText.active)    t.draw(ctx, this.camera);

    // --- HUD ---
    drawHUD(ctx, this.player, this.gameTime, this.player.killCount, this.player.score);
    drawBossWarning(ctx, this.bossWarningTimer);

    // --- Overlays ---
    if (this.state === 'paused') {
      drawPauseScreen(ctx);
    } else if (this.state === 'levelup') {
      drawLevelUpScreen(ctx, this.levelUpOptions, this.hoveredCard);
    }
  }

  // ---- Infinite tiling floor ----
  _drawFloor(ctx) {
    const cam = this.camera;
    const ts  = TILE_SIZE;
    const startTX = Math.floor(cam.x / ts) - 1;
    const startTY = Math.floor(cam.y / ts) - 1;
    const endTX   = startTX + Math.ceil(CANVAS.WIDTH  / ts) + 2;
    const endTY   = startTY + Math.ceil(CANVAS.HEIGHT / ts) + 2;

    for (let ty = startTY; ty <= endTY; ty++) {
      for (let tx = startTX; tx <= endTX; tx++) {
        const sx = tx * ts - cam.x;
        const sy = ty * ts - cam.y;
        ctx.fillStyle = tileColor(tx, ty);
        ctx.fillRect(sx, sy, ts, ts);

        // Subtle grid line
        if ((tx + ty) % 2 === 0) {
          ctx.strokeStyle = 'rgba(255,255,255,0.025)';
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, sy, ts, ts);
        }
      }
    }

    // Occasional skull markings
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.textAlign = 'center';
    for (let ty = startTY; ty <= endTY; ty += 4) {
      for (let tx = startTX; tx <= endTX; tx += 4) {
        if (((tx*7 + ty*13) & 0xf) === 0) {
          ctx.fillText('☠', tx*ts - cam.x + ts/2, ty*ts - cam.y + ts/2 + 4);
        }
      }
    }
    ctx.textAlign = 'left';
  }

  // ============================================================
  // GAME LOOP
  // ============================================================
  start() {
    let lastTime = 0;
    const loop = (timestamp) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = timestamp;
      this.update(dt);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

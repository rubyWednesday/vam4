// ============================================================
// engine.js — ObjectPool, Camera, Input, math utilities
// ============================================================

// ---- Generic Object Pool ----
export class ObjectPool {
  constructor(factory, resetFn, initialSize = 64) {
    this._factory = factory;
    this._reset   = resetFn;
    this._free    = [];
    this.active   = [];        // public read-only list of live objects

    for (let i = 0; i < initialSize; i++) {
      this._free.push(factory());
    }
  }

  /** Grab an object from pool (or create new) and initialise it. */
  acquire(...args) {
    const obj = this._free.length ? this._free.pop() : this._factory();
    this._reset(obj, ...args);
    this.active.push(obj);
    return obj;
  }

  /** Return a single object to the free list. */
  release(obj) {
    const idx = this.active.indexOf(obj);
    if (idx !== -1) {
      this.active.splice(idx, 1);
      this._free.push(obj);
    }
  }

  /**
   * Iterate active objects; call release(obj) inside cb when dead.
   * Iterate backwards so splice doesn't break index.
   */
  updateAll(cb) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      cb(this.active[i], i);
    }
  }

  releaseAll() {
    while (this.active.length) this._free.push(this.active.pop());
  }

  get count() { return this.active.length; }
}

// ---- Camera ----
export class Camera {
  constructor(w, h) {
    this.x = 0;          // top-left world corner
    this.y = 0;
    this.width  = w;
    this.height = h;
  }

  follow(entity) {
    this.x = entity.x - this.width  / 2;
    this.y = entity.y - this.height / 2;
  }

  /** World → screen */
  toScreen(wx, wy) {
    return { x: wx - this.x, y: wy - this.y };
  }

  /** Is a world-space circle within the visible region (+ margin)? */
  isVisible(wx, wy, r = 0) {
    const m = r + 8;
    const sx = wx - this.x, sy = wy - this.y;
    return sx > -m && sx < this.width  + m &&
           sy > -m && sy < this.height + m;
  }

  /** Returns a random world point just outside the camera view. */
  randomSpawnPoint(margin = 80) {
    const side = Math.floor(Math.random() * 4);
    switch (side) {
      case 0: return { x: this.x + Math.random() * this.width,  y: this.y - margin };          // top
      case 1: return { x: this.x + Math.random() * this.width,  y: this.y + this.height + margin }; // bottom
      case 2: return { x: this.x - margin,                       y: this.y + Math.random() * this.height }; // left
      case 3: return { x: this.x + this.width + margin,          y: this.y + Math.random() * this.height }; // right
    }
  }
}

// ---- Keyboard Input ----
export class Input {
  constructor() {
    this._down       = new Set();
    this._justPressed = new Set();
    this._pending    = new Set();

    window.addEventListener('keydown', e => {
      if (!this._down.has(e.code)) this._pending.add(e.code);
      this._down.add(e.code);
      // prevent arrow-key page scrolling
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => {
      this._down.delete(e.code);
    });
  }

  /** Call once per frame before update logic. */
  flush() {
    this._justPressed = new Set(this._pending);
    this._pending.clear();
  }

  isDown(code)     { return this._down.has(code); }
  wasPressed(code) { return this._justPressed.has(code); }

  /** Returns normalised dx/dy based on WASD / Arrow keys. */
  getMovement() {
    let dx = 0, dy = 0;
    if (this.isDown('KeyA') || this.isDown('ArrowLeft'))  dx -= 1;
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) dx += 1;
    if (this.isDown('KeyW') || this.isDown('ArrowUp'))    dy -= 1;
    if (this.isDown('KeyS') || this.isDown('ArrowDown'))  dy += 1;
    if (dx !== 0 && dy !== 0) { dx /= Math.SQRT2; dy /= Math.SQRT2; }
    return { dx, dy };
  }
}

// ---- Math Utilities ----
export function dist(ax, ay, bx, by) {
  return Math.sqrt((bx-ax)**2 + (by-ay)**2);
}

export function distSq(ax, ay, bx, by) {
  return (bx-ax)**2 + (by-ay)**2;
}

export function normalize(dx, dy) {
  const len = Math.sqrt(dx*dx + dy*dy);
  if (len < 0.0001) return { dx: 0, dy: 0 };
  return { dx: dx/len, dy: dy/len };
}

export function lerp(a, b, t) { return a + (b-a)*t; }

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function randRange(min, max) { return min + Math.random()*(max-min); }

export function randInt(min, max) { return Math.floor(randRange(min, max+1)); }

export function randomChoice(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

/** Fisher-Yates in-place shuffle, returns array. */
export function shuffle(arr) {
  for (let i = arr.length-1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Draw a rounded rectangle path (without fill/stroke). */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r);
  ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h);
  ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r);
  ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}

/** Format seconds as mm:ss */
export function formatTime(s) {
  const m = Math.floor(s/60);
  const sec = Math.floor(s%60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

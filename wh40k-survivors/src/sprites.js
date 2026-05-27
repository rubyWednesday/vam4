// ============================================================
// sprites.js — Canvas 2D character drawing functions
// All functions draw centred at (0, 0) in local space.
// Caller: ctx.save() → ctx.translate(sx, sy) → ctx.rotate(angle) → draw → ctx.restore()
// ============================================================

// ---- tiny helpers ----
function el(ctx, cx, cy, rx, ry) {
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function els(ctx, cx, cy, rx, ry, lw) {
  ctx.lineWidth = lw;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
}
function fr(ctx, x, y, w, h) { ctx.fillRect(x, y, w, h); }
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  ctx.fill();
}
function shadow(ctx, r) {
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  el(ctx, 0, r * 0.82, r * 0.75, r * 0.22);
}

// ============================================================
// SPACE MARINE — Ultramarines-style power armour (r ≈ 14)
// Drawn facing "up" (negative-y); caller rotates toward movement dir.
// ============================================================
export function drawSpaceMarine(ctx, r, flash) {
  const f = flash;
  const C = {
    armor:  f ? '#ffffff' : '#1e3a6e',   // Ultramarines blue
    dark:   f ? '#cccccc' : '#0d1f3a',   // dark recesses
    gold:   f ? '#ffffff' : '#c9a227',   // gold trim
    visor:  f ? '#ffffff' : '#00ff88',   // green visor glow
    black:  f ? '#eeeeee' : '#080808',   // bolter / weapon
    white:  '#e8e8ff',
  };

  shadow(ctx, r);

  // ── Greaves / lower legs ──
  ctx.fillStyle = C.dark;
  rr(ctx, -r * 0.33, r * 0.15, r * 0.26, r * 0.62, 3);
  rr(ctx,  r * 0.07, r * 0.15, r * 0.26, r * 0.62, 3);

  // Knee pad gold stripe
  ctx.fillStyle = C.gold;
  fr(ctx, -r * 0.33, r * 0.28, r * 0.26, r * 0.07);
  fr(ctx,  r * 0.07, r * 0.28, r * 0.26, r * 0.07);

  // ── Backpack (behind torso) ──
  ctx.fillStyle = C.dark;
  rr(ctx, -r * 0.38, -r * 0.48, r * 0.76, r * 0.44, 4);
  // Exhaust vents
  ctx.fillStyle = C.black;
  fr(ctx, -r * 0.28, -r * 0.46, r * 0.14, r * 0.08);
  fr(ctx,  r * 0.14, -r * 0.46, r * 0.14, r * 0.08);

  // ── Torso / chest plate ──
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.44, -r * 0.35, r * 0.88, r * 0.56, 5);

  // Aquila (chest eagle) — small cross of gold
  ctx.fillStyle = C.gold;
  fr(ctx, -r * 0.06, -r * 0.22, r * 0.12, r * 0.28);
  fr(ctx, -r * 0.18, -r * 0.16, r * 0.36, r * 0.1);

  // ── Left arm ──
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.78, -r * 0.3, r * 0.36, r * 0.48, 4);

  // ── Right arm + Bolter ──
  ctx.fillStyle = C.armor;
  rr(ctx, r * 0.42, -r * 0.3, r * 0.36, r * 0.48, 4);
  // Bolter barrel/body
  ctx.fillStyle = C.black;
  rr(ctx, r * 0.46, -r * 0.48, r * 0.22, r * 0.1, 2);  // barrel
  rr(ctx, r * 0.44, -r * 0.4,  r * 0.26, r * 0.2, 3);  // body
  // Mag
  ctx.fillStyle = C.dark;
  rr(ctx, r * 0.52, -r * 0.22, r * 0.12, r * 0.14, 2);

  // ── Shoulder pads (pauldrons) — iconic wide circles ──
  ctx.fillStyle = C.armor;
  el(ctx, -r * 0.66, -r * 0.26, r * 0.34, r * 0.28);
  el(ctx,  r * 0.66, -r * 0.26, r * 0.34, r * 0.28);
  // Gold rims
  ctx.strokeStyle = C.gold;
  els(ctx, -r * 0.66, -r * 0.26, r * 0.34, r * 0.28, 1.5);
  els(ctx,  r * 0.66, -r * 0.26, r * 0.34, r * 0.28, 1.5);
  // Chapter marking (small Ultramarines 'U' approximated as a bar)
  ctx.fillStyle = C.gold;
  fr(ctx, -r * 0.74, -r * 0.18, r * 0.16, r * 0.06);
  fr(ctx,  r * 0.58, -r * 0.18, r * 0.16, r * 0.06);

  // ── Helmet ──
  ctx.fillStyle = C.armor;
  el(ctx, 0, -r * 0.56, r * 0.3, r * 0.36);
  // Gold helmet ring
  ctx.strokeStyle = C.gold;
  els(ctx, 0, -r * 0.56, r * 0.3, r * 0.36, 1.5);
  // Visor slit (glowing)
  if (!flash) { ctx.shadowColor = C.visor; ctx.shadowBlur = 7; }
  ctx.fillStyle = C.visor;
  rr(ctx, -r * 0.18, -r * 0.65, r * 0.36, r * 0.09, 2);
  ctx.shadowBlur = 0;
  // Nose vents (two small dark dots below visor)
  ctx.fillStyle = C.dark;
  el(ctx, -r * 0.07, -r * 0.51, r * 0.04, r * 0.04);
  el(ctx,  r * 0.07, -r * 0.51, r * 0.04, r * 0.04);
}

// ============================================================
// HORMAGAUNT — small, fast, insectoid Tyranid (r ≈ 8)
// ============================================================
export function drawHormagaunt(ctx, r, flash) {
  const C = {
    chitin: flash ? '#fff' : '#4a1a5a',
    hi:     flash ? '#fff' : '#8a4a9a',
    blade:  flash ? '#fff' : '#c4b870',
    eye:    flash ? '#fff' : '#ff1010',
    dark:   flash ? '#ccc' : '#1a0828',
  };

  shadow(ctx, r);

  // ── Spindly legs (thin strokes, 4 legs) ──
  ctx.strokeStyle = flash ? '#ccc' : '#3a1248';
  ctx.lineWidth = 1.2;
  const legAngles = [-0.45, -0.2, 0.2, 0.45];
  legAngles.forEach(a => {
    const sx = Math.cos(a - Math.PI / 2) * r * 0.3;
    const sy = Math.sin(a - Math.PI / 2) * r * 0.3;
    const ex = sx + Math.cos(a + Math.PI * 0.6) * r * 0.95;
    const ey = sy + Math.sin(a + Math.PI * 0.6) * r * 0.95;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  });

  // ── Abdomen (rear bulge) ──
  ctx.fillStyle = C.chitin;
  el(ctx, 0, r * 0.35, r * 0.42, r * 0.52);
  ctx.fillStyle = C.hi;
  el(ctx, 0, r * 0.2, r * 0.28, r * 0.22);

  // ── Thorax (midsection) ──
  ctx.fillStyle = C.chitin;
  el(ctx, 0, -r * 0.05, r * 0.3, r * 0.35);

  // ── Scythe arms (two curved blades) ──
  // Left blade
  ctx.fillStyle = C.blade;
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, -r * 0.15);
  ctx.bezierCurveTo(-r * 0.5, -r * 0.45, -r * 0.9, -r * 0.1, -r * 0.75, r * 0.3);
  ctx.bezierCurveTo(-r * 0.8, 0, -r * 0.42, -r * 0.38, -r * 0.08, -r * 0.25);
  ctx.closePath(); ctx.fill();
  // Right blade
  ctx.beginPath();
  ctx.moveTo( r * 0.1, -r * 0.15);
  ctx.bezierCurveTo( r * 0.5, -r * 0.45,  r * 0.9, -r * 0.1,  r * 0.75,  r * 0.3);
  ctx.bezierCurveTo( r * 0.8, 0,  r * 0.42, -r * 0.38,  r * 0.08, -r * 0.25);
  ctx.closePath(); ctx.fill();

  // ── Head ──
  ctx.fillStyle = C.chitin;
  el(ctx, 0, -r * 0.48, r * 0.2, r * 0.22);
  // Head crest / fin
  ctx.fillStyle = C.hi;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.7);
  ctx.lineTo(-r * 0.1, -r * 0.5);
  ctx.lineTo( r * 0.1, -r * 0.5);
  ctx.closePath(); ctx.fill();
  // Eyes (two glowing dots)
  if (!flash) { ctx.shadowColor = C.eye; ctx.shadowBlur = 5; }
  ctx.fillStyle = C.eye;
  el(ctx, -r * 0.08, -r * 0.5,  r * 0.055, r * 0.055);
  el(ctx,  r * 0.08, -r * 0.5,  r * 0.055, r * 0.055);
  ctx.shadowBlur = 0;
}

// ============================================================
// ORK BOY — stocky, green-skinned WAAAGH warrior (r ≈ 13)
// ============================================================
export function drawOrkBoy(ctx, r, flash) {
  const C = {
    skin:   flash ? '#fff' : '#4a8a28',
    dark:   flash ? '#ddd' : '#2a5018',
    armor:  flash ? '#ccc' : '#3a3a48',
    armHi:  flash ? '#ddd' : '#5a5a6a',
    metal:  flash ? '#ccc' : '#6a6a7a',
    rust:   flash ? '#ccc' : '#8a4a2a',
    tusk:   flash ? '#fff' : '#e0d0a0',
    yellow: flash ? '#fff' : '#ffcc00',
    eye:    flash ? '#fff' : '#ff3020',
    black:  '#101010',
  };

  shadow(ctx, r);

  // ── Boots ──
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.38, r * 0.55, r * 0.3, r * 0.38, 3);
  rr(ctx,  r * 0.08, r * 0.55, r * 0.3, r * 0.38, 3);

  // ── Legs (thick, muscular) ──
  ctx.fillStyle = C.dark;
  rr(ctx, -r * 0.36, r * 0.2, r * 0.3, r * 0.4, 4);
  rr(ctx,  r * 0.06, r * 0.2, r * 0.3, r * 0.4, 4);

  // ── Torso (barrel chest, slightly hunched forward) ──
  ctx.fillStyle = C.skin;
  rr(ctx, -r * 0.5, -r * 0.28, r, r * 0.55, 5);
  // Armor scraps on torso
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.45, -r * 0.22, r * 0.4, r * 0.18, 3);  // left plate
  // Rivet dots
  ctx.fillStyle = C.metal;
  el(ctx, -r * 0.38, -r * 0.2, r * 0.04, r * 0.04);
  el(ctx, -r * 0.12, -r * 0.2, r * 0.04, r * 0.04);

  // ── Left arm (empty fist) ──
  ctx.fillStyle = C.skin;
  rr(ctx, -r * 0.82, -r * 0.22, r * 0.34, r * 0.44, 4);
  // Fist knuckles
  ctx.fillStyle = C.dark;
  fr(ctx, -r * 0.82, r * 0.12, r * 0.34, r * 0.06);

  // ── Right arm (Choppa) ──
  ctx.fillStyle = C.skin;
  rr(ctx, r * 0.48, -r * 0.22, r * 0.34, r * 0.44, 4);
  // Choppa blade (large rusty cleaver)
  ctx.fillStyle = C.rust;
  ctx.beginPath();
  ctx.moveTo( r * 0.56, -r * 0.42);
  ctx.lineTo( r * 0.86, -r * 0.55);
  ctx.lineTo( r * 0.9,  -r * 0.18);
  ctx.lineTo( r * 0.62, -r * 0.12);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.metal;
  ctx.lineWidth = 1;
  ctx.strokeStyle = C.black;
  ctx.stroke();
  // Choppa handle
  ctx.fillStyle = C.dark;
  fr(ctx, r * 0.62, -r * 0.14, r * 0.08, r * 0.28);

  // ── Head (large, square-ish, big brow) ──
  ctx.fillStyle = C.skin;
  rr(ctx, -r * 0.42, -r * 0.72, r * 0.84, r * 0.5, 5);
  // Heavy brow ridge
  ctx.fillStyle = C.dark;
  fr(ctx, -r * 0.42, -r * 0.72, r * 0.84, r * 0.12);
  // Scrap metal helmet strip
  ctx.fillStyle = C.armor;
  fr(ctx, -r * 0.42, -r * 0.72, r * 0.84, r * 0.09);
  ctx.fillStyle = C.yellow;
  fr(ctx, -r * 0.42, -r * 0.72, r * 0.84, r * 0.04);

  // ── Tusks ──
  ctx.fillStyle = C.tusk;
  // Left tusk
  ctx.beginPath();
  ctx.moveTo(-r * 0.22, -r * 0.32);
  ctx.lineTo(-r * 0.32, -r * 0.14);
  ctx.lineTo(-r * 0.14, -r * 0.16);
  ctx.closePath(); ctx.fill();
  // Right tusk
  ctx.beginPath();
  ctx.moveTo( r * 0.22, -r * 0.32);
  ctx.lineTo( r * 0.32, -r * 0.14);
  ctx.lineTo( r * 0.14, -r * 0.16);
  ctx.closePath(); ctx.fill();

  // ── Eyes (red, beady) ──
  if (!flash) { ctx.shadowColor = C.eye; ctx.shadowBlur = 4; }
  ctx.fillStyle = C.eye;
  el(ctx, -r * 0.2, -r * 0.55, r * 0.07, r * 0.07);
  el(ctx,  r * 0.2, -r * 0.55, r * 0.07, r * 0.07);
  ctx.shadowBlur = 0;
  // Pupils
  ctx.fillStyle = C.black;
  el(ctx, -r * 0.2, -r * 0.55, r * 0.03, r * 0.03);
  el(ctx,  r * 0.2, -r * 0.55, r * 0.03, r * 0.03);
  // Nose (flat, two nostrils)
  ctx.fillStyle = C.dark;
  el(ctx, -r * 0.08, -r * 0.42, r * 0.06, r * 0.04);
  el(ctx,  r * 0.08, -r * 0.42, r * 0.06, r * 0.04);
}

// ============================================================
// TYRANID WARRIOR — tall, mantis-like alien warrior (r ≈ 17)
// ============================================================
export function drawTyranidWarrior(ctx, r, flash) {
  const C = {
    carap: flash ? '#fff' : '#2a1540',
    hi:    flash ? '#ddd' : '#7a4aaa',
    talon: flash ? '#fff' : '#d4c890',
    soft:  flash ? '#eee' : '#5a2030',
    eye:   flash ? '#fff' : '#00aaff',
    dark:  flash ? '#ccc' : '#12081e',
    bone:  flash ? '#fff' : '#c8b88a',
  };

  shadow(ctx, r);

  // ── Hind legs (thin, digitigrade) ──
  ctx.strokeStyle = flash ? '#ccc' : C.dark;
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = 'round';
  // Left hind leg
  ctx.beginPath();
  ctx.moveTo(-r * 0.22, r * 0.22);
  ctx.lineTo(-r * 0.38, r * 0.6);
  ctx.lineTo(-r * 0.22, r * 0.88);
  ctx.stroke();
  // Right hind leg
  ctx.beginPath();
  ctx.moveTo( r * 0.22, r * 0.22);
  ctx.lineTo( r * 0.38, r * 0.6);
  ctx.lineTo( r * 0.22, r * 0.88);
  ctx.stroke();
  // Taloned feet
  ctx.fillStyle = C.bone;
  el(ctx, -r * 0.22, r * 0.88, r * 0.09, r * 0.06);
  el(ctx,  r * 0.22, r * 0.88, r * 0.09, r * 0.06);

  // ── Abdomen ──
  ctx.fillStyle = C.carap;
  el(ctx, 0, r * 0.3, r * 0.28, r * 0.42);
  // Carapace highlight
  ctx.fillStyle = C.hi;
  el(ctx, 0, r * 0.18, r * 0.18, r * 0.18);

  // ── Torso / thorax ──
  ctx.fillStyle = C.carap;
  el(ctx, 0, -r * 0.1, r * 0.36, r * 0.44);
  // Carapace plates (segmented back)
  ctx.fillStyle = C.hi;
  el(ctx, 0, -r * 0.18, r * 0.24, r * 0.18);
  // Soft underbelly stripe
  ctx.fillStyle = C.soft;
  rr(ctx, -r * 0.1, -r * 0.05, r * 0.2, r * 0.35, 4);

  // ── Large Scything Talons ──
  // LEFT talon arm + blade
  ctx.fillStyle = C.carap;
  ctx.lineWidth = r * 0.12;
  ctx.strokeStyle = C.carap;
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, -r * 0.12);
  ctx.bezierCurveTo(-r * 0.7, -r * 0.3, -r * 1.0, 0.0, -r * 0.85, r * 0.45);
  ctx.stroke();
  // Blade itself
  ctx.fillStyle = C.talon;
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, -r * 0.18);
  ctx.bezierCurveTo(-r * 0.8, -r * 0.55, -r * 1.1, -r * 0.1, -r * 0.9, r * 0.5);
  ctx.bezierCurveTo(-r * 0.85, r * 0.2, -r * 0.62, -r * 0.42, -r * 0.24, -r * 0.3);
  ctx.closePath(); ctx.fill();
  // RIGHT talon arm + blade
  ctx.fillStyle = C.carap;
  ctx.beginPath();
  ctx.moveTo( r * 0.28, -r * 0.12);
  ctx.bezierCurveTo( r * 0.7, -r * 0.3,  r * 1.0, 0.0,  r * 0.85, r * 0.45);
  ctx.stroke();
  ctx.fillStyle = C.talon;
  ctx.beginPath();
  ctx.moveTo( r * 0.28, -r * 0.18);
  ctx.bezierCurveTo( r * 0.8, -r * 0.55,  r * 1.1, -r * 0.1,  r * 0.9, r * 0.5);
  ctx.bezierCurveTo( r * 0.85, r * 0.2,  r * 0.62, -r * 0.42,  r * 0.24, -r * 0.3);
  ctx.closePath(); ctx.fill();

  // ── Head ──
  ctx.fillStyle = C.carap;
  el(ctx, 0, -r * 0.54, r * 0.22, r * 0.26);
  // Head crest / elongated skull
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, -r * 0.78);
  ctx.lineTo( r * 0.1, -r * 0.78);
  ctx.lineTo( r * 0.18, -r * 0.52);
  ctx.lineTo(-r * 0.18, -r * 0.52);
  ctx.closePath(); ctx.fill();
  // Eyes — two glowing blue slits
  if (!flash) { ctx.shadowColor = C.eye; ctx.shadowBlur = 8; }
  ctx.fillStyle = C.eye;
  ctx.fillRect(-r * 0.14, -r * 0.62, r * 0.1, r * 0.055);
  ctx.fillRect( r * 0.04, -r * 0.62, r * 0.1, r * 0.055);
  ctx.shadowBlur = 0;
}

// ============================================================
// CARNIFEX — massive quadruped boss Tyranid (r ≈ 34)
// ============================================================
export function drawCarnifex(ctx, r, flash, hp, maxHp) {
  const C = {
    carap: flash ? '#fff' : '#1e0e30',
    hi:    flash ? '#ddd' : '#7030c0',
    bone:  flash ? '#fff' : '#c8b880',
    flesh: flash ? '#eee' : '#5a1828',
    eye:   flash ? '#fff' : '#ff2000',
    dark:  flash ? '#ccc' : '#0a0414',
    spike: flash ? '#fff' : '#d0c070',
  };

  // Boss pulsing aura
  if (!flash) {
    const pulse = 0.55 + 0.18 * Math.sin(Date.now() * 0.004);
    const grd = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.5);
    grd.addColorStop(0, `rgba(112,0,192,${pulse * 0.35})`);
    grd.addColorStop(1, 'rgba(112,0,192,0)');
    ctx.fillStyle = grd;
    el(ctx, 0, 0, r * 1.5, r * 1.5);
  }

  shadow(ctx, r);

  // ── Back legs (thick pillars) ──
  ctx.fillStyle = C.carap;
  rr(ctx, -r * 0.72, r * 0.35, r * 0.36, r * 0.58, 6);
  rr(ctx,  r * 0.36, r * 0.35, r * 0.36, r * 0.58, 6);
  // Foot claws
  ctx.fillStyle = C.bone;
  el(ctx, -r * 0.54, r * 0.88, r * 0.18, r * 0.1);
  el(ctx,  r * 0.54, r * 0.88, r * 0.18, r * 0.1);

  // ── Massive body ──
  ctx.fillStyle = C.carap;
  el(ctx, 0, r * 0.06, r * 0.68, r * 0.72);
  // Carapace highlight
  ctx.fillStyle = C.hi;
  el(ctx, 0, -r * 0.08, r * 0.44, r * 0.38);
  // Fleshy underbelly
  ctx.fillStyle = C.flesh;
  el(ctx, 0, r * 0.22, r * 0.3, r * 0.38);

  // ── Spine spikes (row down the back) ──
  ctx.fillStyle = C.spike;
  for (let i = 0; i < 5; i++) {
    const sy = -r * 0.4 + i * r * 0.22;
    const sw = r * 0.1 - i * r * 0.01;
    ctx.beginPath();
    ctx.moveTo(0, sy - r * 0.22);
    ctx.lineTo(-sw, sy);
    ctx.lineTo( sw, sy);
    ctx.closePath(); ctx.fill();
  }

  // ── Front legs / crushing claws ──
  // Left claw arm
  ctx.fillStyle = C.carap;
  ctx.lineWidth = r * 0.22;
  ctx.strokeStyle = C.carap;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, -r * 0.2);
  ctx.lineTo(-r * 0.9, -r * 0.55);
  ctx.stroke();
  // Left claw blades
  ctx.fillStyle = C.bone;
  ctx.beginPath();
  ctx.moveTo(-r * 0.78, -r * 0.72);
  ctx.lineTo(-r * 1.08, -r * 0.42);
  ctx.lineTo(-r * 0.98, -r * 0.3);
  ctx.lineTo(-r * 0.66, -r * 0.52);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-r * 0.88, -r * 0.62);
  ctx.lineTo(-r * 1.14, -r * 0.75);
  ctx.lineTo(-r * 1.08, -r * 0.56);
  ctx.closePath(); ctx.fill();
  // Right claw arm
  ctx.fillStyle = C.carap;
  ctx.beginPath();
  ctx.moveTo( r * 0.5, -r * 0.2);
  ctx.lineTo( r * 0.9, -r * 0.55);
  ctx.stroke();
  ctx.fillStyle = C.bone;
  ctx.beginPath();
  ctx.moveTo( r * 0.78, -r * 0.72);
  ctx.lineTo( r * 1.08, -r * 0.42);
  ctx.lineTo( r * 0.98, -r * 0.3);
  ctx.lineTo( r * 0.66, -r * 0.52);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo( r * 0.88, -r * 0.62);
  ctx.lineTo( r * 1.14, -r * 0.75);
  ctx.lineTo( r * 1.08, -r * 0.56);
  ctx.closePath(); ctx.fill();

  // ── Head ──
  ctx.fillStyle = C.carap;
  el(ctx, 0, -r * 0.6, r * 0.4, r * 0.38);
  // Jaw (lower)
  ctx.fillStyle = C.flesh;
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, -r * 0.46);
  ctx.bezierCurveTo(-r * 0.38, -r * 0.24, r * 0.38, -r * 0.24, r * 0.32, -r * 0.46);
  ctx.lineTo(-r * 0.32, -r * 0.46);
  ctx.fill();
  // Teeth
  ctx.fillStyle = C.bone;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.09,   -r * 0.46);
    ctx.lineTo((i + 0.5) * r * 0.09, -r * 0.34);
    ctx.lineTo((i + 1) * r * 0.09,   -r * 0.46);
    ctx.fill();
  }
  // Head crest
  ctx.fillStyle = C.hi;
  ctx.beginPath();
  ctx.moveTo(-r * 0.16, -r * 0.96);
  ctx.lineTo( r * 0.16, -r * 0.96);
  ctx.lineTo( r * 0.3,  -r * 0.7);
  ctx.lineTo(-r * 0.3,  -r * 0.7);
  ctx.closePath(); ctx.fill();
  // Eyes — burning red
  if (!flash) { ctx.shadowColor = C.eye; ctx.shadowBlur = 12; }
  ctx.fillStyle = C.eye;
  el(ctx, -r * 0.2, -r * 0.65, r * 0.09, r * 0.09);
  el(ctx,  r * 0.2, -r * 0.65, r * 0.09, r * 0.09);
  ctx.shadowBlur = 0;
}

// ============================================================
// WARBOSS — enormous Ork boss (r ≈ 38)
// ============================================================
export function drawWarboss(ctx, r, flash) {
  const C = {
    skin:  flash ? '#fff' : '#3a7020',
    dark:  flash ? '#ddd' : '#1a3808',
    armor: flash ? '#ccc' : '#2a2a38',
    armHi: flash ? '#ddd' : '#4a4a5a',
    metal: flash ? '#ccc' : '#6a6a8a',
    yellow:flash ? '#fff' : '#ffcc00',
    tusk:  flash ? '#fff' : '#e0d090',
    eye:   flash ? '#fff' : '#ff4000',
    black: '#101010',
    rust:  flash ? '#ccc' : '#8a3a1a',
  };

  // Boss aura
  if (!flash) {
    const pulse = 0.5 + 0.18 * Math.sin(Date.now() * 0.004);
    const grd = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.5);
    grd.addColorStop(0, `rgba(80,160,20,${pulse * 0.35})`);
    grd.addColorStop(1, 'rgba(80,160,20,0)');
    ctx.fillStyle = grd;
    el(ctx, 0, 0, r * 1.5, r * 1.5);
  }

  shadow(ctx, r);

  // ── Boots ──
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.52, r * 0.58, r * 0.38, r * 0.36, 5);
  rr(ctx,  r * 0.14, r * 0.58, r * 0.38, r * 0.36, 5);

  // ── Legs ──
  ctx.fillStyle = C.dark;
  rr(ctx, -r * 0.5,  r * 0.25, r * 0.36, r * 0.38, 5);
  rr(ctx,  r * 0.14, r * 0.25, r * 0.36, r * 0.38, 5);

  // ── Torso (massive, armour-plated) ──
  ctx.fillStyle = C.skin;
  el(ctx, 0, r * 0.04, r * 0.56, r * 0.55);
  // Front armour plate
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.46, -r * 0.18, r * 0.92, r * 0.45, 6);
  // Rivets
  ctx.fillStyle = C.yellow;
  const rivets = [[-0.34,-0.12],[0.34,-0.12],[-0.34,0.12],[0.34,0.12],[0,-0.04]];
  rivets.forEach(([rx, ry]) => el(ctx, rx*r, ry*r, r*0.045, r*0.045));

  // ── Left Arm (giant fist) ──
  ctx.fillStyle = C.skin;
  rr(ctx, -r * 0.92, -r * 0.28, r * 0.44, r * 0.6, 6);
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.9, r * 0.16, r * 0.4, r * 0.2, 4);  // knuckle plate
  ctx.fillStyle = C.metal;
  for (let i = 0; i < 4; i++) fr(ctx, -r*(0.88-i*0.09), r*0.17, r*0.06, r*0.06);

  // ── Right Arm (Power Klaw — huge mechanical claw) ──
  ctx.fillStyle = C.armor;
  rr(ctx, r * 0.48, -r * 0.38, r * 0.5, r * 0.62, 6);
  // Klaw fingers (3 blades)
  ctx.fillStyle = C.metal;
  for (let i = 0; i < 3; i++) {
    const ox = r * (0.52 + i * 0.14);
    ctx.beginPath();
    ctx.moveTo(ox, -r * 0.52);
    ctx.lineTo(ox + r * 0.1, -r * 0.85);
    ctx.lineTo(ox + r * 0.22, -r * 0.52);
    ctx.closePath(); ctx.fill();
  }
  // Klaw hydraulics
  ctx.fillStyle = C.yellow;
  fr(ctx, r * 0.54, -r * 0.36, r * 0.36, r * 0.08);
  ctx.fillStyle = C.rust;
  fr(ctx, r * 0.58, -r * 0.26, r * 0.28, r * 0.06);

  // ── Huge Ork Head ──
  ctx.fillStyle = C.skin;
  rr(ctx, -r * 0.46, -r * 0.8, r * 0.92, r * 0.65, 8);
  // War helmet / armour crown
  ctx.fillStyle = C.armor;
  rr(ctx, -r * 0.5, -r * 0.82, r, r * 0.3, 4);
  // Horns on helmet
  ctx.fillStyle = C.metal;
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, -r * 0.82);
  ctx.lineTo(-r * 0.55, -r * 1.08);
  ctx.lineTo(-r * 0.28, -r * 0.82);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo( r * 0.42, -r * 0.82);
  ctx.lineTo( r * 0.55, -r * 1.08);
  ctx.lineTo( r * 0.28, -r * 0.82);
  ctx.closePath(); ctx.fill();
  // Brow shadow
  ctx.fillStyle = C.dark;
  fr(ctx, -r * 0.46, -r * 0.58, r * 0.92, r * 0.12);
  // Tusks (large)
  ctx.fillStyle = C.tusk;
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, -r * 0.3);
  ctx.lineTo(-r * 0.44, -r * 0.0);
  ctx.lineTo(-r * 0.18, -r * 0.04);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo( r * 0.28, -r * 0.3);
  ctx.lineTo( r * 0.44, -r * 0.0);
  ctx.lineTo( r * 0.18, -r * 0.04);
  ctx.closePath(); ctx.fill();
  // Eyes (burning orange-red)
  if (!flash) { ctx.shadowColor = C.eye; ctx.shadowBlur = 12; }
  ctx.fillStyle = C.eye;
  el(ctx, -r * 0.22, -r * 0.5, r * 0.1, r * 0.1);
  el(ctx,  r * 0.22, -r * 0.5, r * 0.1, r * 0.1);
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.black;
  el(ctx, -r * 0.22, -r * 0.5, r * 0.04, r * 0.04);
  el(ctx,  r * 0.22, -r * 0.5, r * 0.04, r * 0.04);
  // Nose
  ctx.fillStyle = C.dark;
  el(ctx, -r * 0.1, -r * 0.36, r * 0.08, r * 0.06);
  el(ctx,  r * 0.1, -r * 0.36, r * 0.08, r * 0.06);
}

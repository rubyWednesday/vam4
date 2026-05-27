// ============================================================
// sprites.js — Bold, readable character sprites for WH40K Survivors
//
// Design principle: at small canvas sizes, SILHOUETTE > detail.
// Each character has 1-2 iconic features that make it instantly
// recognisable, drawn in WH40K lore-accurate colours.
//
// All functions draw centred at (0,0).
// Caller: ctx.save() → ctx.translate(sx,sy) → [optional flip] → draw → ctx.restore()
// ============================================================

/* ── colour helper ── */
function hex(flash, normal) { return flash ? '#ffffff' : normal; }

/* ── shape helpers ── */
function el(ctx, cx, cy, rx, ry) {
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function arc(ctx, cx, cy, r, a0, a1, cc) {
  ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1, cc); ctx.fill();
}
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}
function line(ctx, x1, y1, x2, y2, w) {
  ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function glow(ctx, color, blur, fn) {
  ctx.shadowColor = color; ctx.shadowBlur = blur; fn(); ctx.shadowBlur = 0;
}
function shadow(ctx, r) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  el(ctx, 0, r * 0.85, r * 0.8, r * 0.22);
}

// ============================================================
// SPACE MARINE  (r ≈ 14)
// Iconic features: massive round pauldrons + glowing visor slit
// Colours: Ultramarines blue #0033aa, gold #c9a227, visor #00ff88
// Drawn facing UP; caller rotates toward movement direction.
// ============================================================
export function drawSpaceMarine(ctx, r, flash) {
  const s = r * 1.5;   // draw at 1.5× collision radius for clarity

  shadow(ctx, r);

  // ── Legs (two rounded stubs) ──
  ctx.fillStyle = hex(flash, '#001f5e');
  rr(ctx, -s * 0.3,  s * 0.28, s * 0.24, s * 0.48, 4);
  rr(ctx,  s * 0.06, s * 0.28, s * 0.24, s * 0.48, 4);

  // ── Torso (broad chest plate) ──
  ctx.fillStyle = hex(flash, '#0033aa');
  rr(ctx, -s * 0.46, -s * 0.32, s * 0.92, s * 0.62, 6);

  // ── Arms ──
  ctx.fillStyle = hex(flash, '#0028880');
  rr(ctx, -s * 0.72, -s * 0.28, s * 0.28, s * 0.44, 5);   // left
  rr(ctx,  s * 0.44, -s * 0.28, s * 0.28, s * 0.44, 5);   // right

  // ── PAULDRONS — THE iconic Space Marine feature ──
  // Large circles on both sides, gold-rimmed
  ctx.fillStyle = hex(flash, '#0033aa');
  el(ctx, -s * 0.72, -s * 0.22, s * 0.34, s * 0.3);   // left shoulder
  el(ctx,  s * 0.72, -s * 0.22, s * 0.34, s * 0.3);   // right shoulder
  if (!flash) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-s*0.72, -s*0.22, s*0.34, s*0.3, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse( s*0.72, -s*0.22, s*0.34, s*0.3, 0, 0, Math.PI*2); ctx.stroke();
    // Ultramarines 'U' symbol on left pad
    ctx.fillStyle = '#c9a227';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-s*0.72, -s*0.2, s*0.12, 0, Math.PI, false);
    ctx.stroke();
  }

  // ── Chest eagle (Aquila) ──
  if (!flash) {
    ctx.fillStyle = '#c9a227';
    // Wings: two triangles
    ctx.beginPath(); ctx.moveTo(-s*0.22,-s*0.08); ctx.lineTo(-s*0.04,-s*0.18); ctx.lineTo(-s*0.04,-s*0.0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo( s*0.22,-s*0.08); ctx.lineTo( s*0.04,-s*0.18); ctx.lineTo( s*0.04,-s*0.0); ctx.closePath(); ctx.fill();
    // Eagle body
    el(ctx, 0, -s*0.09, s*0.07, s*0.1);
  }

  // ── Bolter (right hand) ──
  ctx.fillStyle = hex(flash, '#111111');
  rr(ctx, s*0.46, -s*0.45, s*0.16, s*0.09, 2);   // barrel
  rr(ctx, s*0.44, -s*0.37, s*0.22, s*0.18, 2);   // body
  if (!flash) {
    ctx.fillStyle = '#333';
    rr(ctx, s*0.52, -s*0.22, s*0.1, s*0.12, 2);  // magazine
  }

  // ── HELMET — round dome, most recognisable SM element ──
  ctx.fillStyle = hex(flash, '#0033aa');
  el(ctx, 0, -s*0.52, s*0.3, s*0.36);

  // Gold trim ring
  if (!flash) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(0, -s*0.52, s*0.3, s*0.36, 0, 0, Math.PI*2); ctx.stroke();
  }

  // ── VISOR SLIT — glowing green, the signature look ──
  glow(ctx, '#00ff88', flash ? 0 : 10, () => {
    ctx.fillStyle = hex(flash, '#00ff88');
    rr(ctx, -s*0.18, -s*0.59, s*0.36, s*0.08, 3);
  });

  // Two vent dots below visor
  if (!flash) {
    ctx.fillStyle = '#001040';
    el(ctx, -s*0.07, -s*0.47, s*0.04, s*0.04);
    el(ctx,  s*0.07, -s*0.47, s*0.04, s*0.04);
  }
}

// ============================================================
// HORMAGAUNT  (r ≈ 8)
// Iconic: V-shaped scythe-blade forearms + crouched alien posture
// Colours: deep purple chitin #3d1050, bone blades #d4c870, red eyes
// ============================================================
export function drawHormagaunt(ctx, r, flash) {
  const s = r * 1.8;

  shadow(ctx, r);

  // ── Hind legs (three thin lines) ──
  ctx.strokeStyle = hex(flash, '#2a0838');
  ctx.lineCap = 'round';
  line(ctx, -s*0.18, s*0.15,  -s*0.5,  s*0.75, s*0.1);
  line(ctx,  s*0.18, s*0.15,   s*0.5,  s*0.75, s*0.1);
  line(ctx,  0,      s*0.18,   0,       s*0.8,  s*0.08);

  // ── Abdomen bulge ──
  ctx.fillStyle = hex(flash, '#3d1050');
  el(ctx, 0, s*0.28, s*0.34, s*0.44);

  // ── Thorax ──
  ctx.fillStyle = hex(flash, '#5a2075');
  el(ctx, 0, -s*0.08, s*0.28, s*0.3);

  // ── SCYTHE FOREARMS — the defining Hormagaunt feature ──
  // Each arm: a thick curved bone blade that sweeps up and out
  ctx.fillStyle = hex(flash, '#d4c870');
  // Left scythe
  ctx.beginPath();
  ctx.moveTo(-s*0.12, -s*0.14);
  ctx.bezierCurveTo(-s*0.45, -s*0.5,  -s*0.85, -s*0.35, -s*0.72,  s*0.18);
  ctx.bezierCurveTo(-s*0.68,  s*0.0,  -s*0.36, -s*0.38, -s*0.08, -s*0.28);
  ctx.closePath(); ctx.fill();
  // Right scythe
  ctx.beginPath();
  ctx.moveTo( s*0.12, -s*0.14);
  ctx.bezierCurveTo( s*0.45, -s*0.5,   s*0.85, -s*0.35,  s*0.72,  s*0.18);
  ctx.bezierCurveTo( s*0.68,  s*0.0,   s*0.36, -s*0.38,  s*0.08, -s*0.28);
  ctx.closePath(); ctx.fill();

  // ── Head ──
  ctx.fillStyle = hex(flash, '#3d1050');
  el(ctx, 0, -s*0.42, s*0.18, s*0.22);
  // Skull crest (elongated Tyranid cranium)
  ctx.fillStyle = hex(flash, '#5a2075');
  ctx.beginPath();
  ctx.moveTo(-s*0.08, -s*0.62);
  ctx.lineTo( s*0.08, -s*0.62);
  ctx.lineTo( s*0.14, -s*0.4);
  ctx.lineTo(-s*0.14, -s*0.4);
  ctx.closePath(); ctx.fill();
  // Glowing red eyes
  glow(ctx, '#ff0000', flash ? 0 : 6, () => {
    ctx.fillStyle = hex(flash, '#ff1010');
    el(ctx, -s*0.07, -s*0.44, s*0.05, s*0.05);
    el(ctx,  s*0.07, -s*0.44, s*0.05, s*0.05);
  });
}

// ============================================================
// ORK BOY  (r ≈ 13)
// Iconic: MASSIVE round green head + tusks + choppa
// Colours: Ork green #4a8a28, dark green #2a5018, tusk ivory #e0d0a0
// ============================================================
export function drawOrkBoy(ctx, r, flash) {
  const s = r * 1.5;

  shadow(ctx, r);

  // ── Boots ──
  ctx.fillStyle = hex(flash, '#2a2a38');
  rr(ctx, -s*0.38, s*0.58, s*0.3,  s*0.34, 4);
  rr(ctx,  s*0.08, s*0.58, s*0.3,  s*0.34, 4);

  // ── Legs ──
  ctx.fillStyle = hex(flash, '#2a5018');
  rr(ctx, -s*0.36, s*0.24, s*0.28, s*0.38, 4);
  rr(ctx,  s*0.08, s*0.24, s*0.28, s*0.38, 4);

  // ── Body (barrel-chested) ──
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, -s*0.46, -s*0.22, s*0.92, s*0.5, 6);
  // Rusty armour scraps
  if (!flash) {
    ctx.fillStyle = '#3a3a48';
    rr(ctx, -s*0.44, -s*0.2, s*0.4, s*0.16, 3);
    ctx.fillStyle = '#666670';
    el(ctx, -s*0.36, -s*0.14, s*0.04, s*0.04);  // rivet
    el(ctx, -s*0.1,  -s*0.14, s*0.04, s*0.04);
  }

  // ── Left arm (meaty fist) ──
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, -s*0.78, -s*0.18, s*0.34, s*0.42, 5);

  // ── Right arm + CHOPPA ──
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, s*0.44, -s*0.18, s*0.34, s*0.42, 5);
  // Choppa blade — large, rusty, unmistakably Orky
  ctx.fillStyle = hex(flash, '#8a4a1a');
  ctx.beginPath();
  ctx.moveTo( s*0.56, -s*0.38);
  ctx.lineTo( s*0.92, -s*0.58);
  ctx.lineTo( s*0.96, -s*0.12);
  ctx.lineTo( s*0.6,  -s*0.08);
  ctx.closePath(); ctx.fill();
  if (!flash) {
    ctx.fillStyle = '#c0c0c0';   // blade edge
    ctx.beginPath();
    ctx.moveTo(s*0.88, -s*0.56); ctx.lineTo(s*0.94, -s*0.14);
    ctx.lineWidth = 2; ctx.strokeStyle = '#ddd'; ctx.stroke();
    // Handle
    ctx.fillStyle = '#4a3020';
    rr(ctx, s*0.62, -s*0.1, s*0.08, s*0.24, 2);
  }

  // ── HEAD — THE Ork feature: massive, square, takes up 45% ──
  ctx.fillStyle = hex(flash, '#4a8a28');
  rr(ctx, -s*0.44, -s*0.74, s*0.88, s*0.56, 7);
  // Heavy brow ridge
  ctx.fillStyle = hex(flash, '#2a5018');
  rr(ctx, -s*0.44, -s*0.74, s*0.88, s*0.12, 7);

  // ── TUSKS — two ivory fangs, essential Ork trait ──
  ctx.fillStyle = hex(flash, '#e0d0a0');
  // Left tusk
  ctx.beginPath();
  ctx.moveTo(-s*0.2, -s*0.32); ctx.lineTo(-s*0.32, -s*0.1); ctx.lineTo(-s*0.12, -s*0.12);
  ctx.closePath(); ctx.fill();
  // Right tusk
  ctx.beginPath();
  ctx.moveTo( s*0.2, -s*0.32); ctx.lineTo( s*0.32, -s*0.1); ctx.lineTo( s*0.12, -s*0.12);
  ctx.closePath(); ctx.fill();

  // ── Eyes ──
  glow(ctx, '#ff4000', flash ? 0 : 4, () => {
    ctx.fillStyle = hex(flash, '#ff3010');
    el(ctx, -s*0.2, -s*0.55, s*0.07, s*0.07);
    el(ctx,  s*0.2, -s*0.55, s*0.07, s*0.07);
  });
  ctx.fillStyle = '#000';
  el(ctx, -s*0.2, -s*0.55, s*0.03, s*0.03);
  el(ctx,  s*0.2, -s*0.55, s*0.03, s*0.03);

  // Nostrils (flat Ork nose)
  ctx.fillStyle = hex(flash, '#2a5018');
  el(ctx, -s*0.08, -s*0.42, s*0.06, s*0.04);
  el(ctx,  s*0.08, -s*0.42, s*0.06, s*0.04);
}

// ============================================================
// TYRANID WARRIOR  (r ≈ 17)
// Iconic: wide swept SCYTHING TALONS + tall elongated skull
// Colours: dark purple carapace #1a0a28, bone talons #c8b870, cyan eyes
// ============================================================
export function drawTyranidWarrior(ctx, r, flash) {
  const s = r * 1.45;

  shadow(ctx, r);

  // ── Digitigrade hind legs ──
  ctx.strokeStyle = hex(flash, '#1a0a28');
  ctx.lineWidth = s * 0.14; ctx.lineCap = 'round';
  // Left
  ctx.beginPath(); ctx.moveTo(-s*0.22, s*0.2); ctx.lineTo(-s*0.38, s*0.58); ctx.lineTo(-s*0.22, s*0.88); ctx.stroke();
  // Right
  ctx.beginPath(); ctx.moveTo( s*0.22, s*0.2); ctx.lineTo( s*0.38, s*0.58); ctx.lineTo( s*0.22, s*0.88); ctx.stroke();
  // Taloned feet
  ctx.fillStyle = hex(flash, '#c8b870');
  el(ctx, -s*0.22, s*0.88, s*0.1, s*0.06);
  el(ctx,  s*0.22, s*0.88, s*0.1, s*0.06);

  // ── Abdomen ──
  ctx.fillStyle = hex(flash, '#2d1245');
  el(ctx, 0, s*0.28, s*0.25, s*0.38);

  // ── Thorax / carapace ──
  ctx.fillStyle = hex(flash, '#1a0a28');
  el(ctx, 0, -s*0.06, s*0.34, s*0.42);
  // Carapace highlight plate
  ctx.fillStyle = hex(flash, '#4a2068');
  el(ctx, 0, -s*0.14, s*0.22, s*0.22);
  // Spine ridge bumps
  if (!flash) {
    ctx.fillStyle = '#6a3a88';
    for (let i = 0; i < 4; i++) {
      el(ctx, 0, -s*0.38 + i*s*0.14, s*0.07, s*0.07);
    }
  }

  // ── SCYTHING TALONS — swept-back bone blades, THE Warrior feature ──
  ctx.fillStyle = hex(flash, '#c8b870');
  // Left talon
  ctx.beginPath();
  ctx.moveTo(-s*0.24, -s*0.14);
  ctx.bezierCurveTo(-s*0.7, -s*0.55, -s*1.05, -s*0.18, -s*0.85,  s*0.42);
  ctx.bezierCurveTo(-s*0.78,  s*0.15, -s*0.55, -s*0.42, -s*0.18, -s*0.28);
  ctx.closePath(); ctx.fill();
  // Right talon
  ctx.beginPath();
  ctx.moveTo( s*0.24, -s*0.14);
  ctx.bezierCurveTo( s*0.7, -s*0.55,  s*1.05, -s*0.18,  s*0.85,  s*0.42);
  ctx.bezierCurveTo( s*0.78,  s*0.15,  s*0.55, -s*0.42,  s*0.18, -s*0.28);
  ctx.closePath(); ctx.fill();
  // Dark veining on talons
  if (!flash) {
    ctx.strokeStyle = '#8a7840'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-s*0.52,-s*0.38); ctx.lineTo(-s*0.7, s*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( s*0.52,-s*0.38); ctx.lineTo( s*0.7, s*0.1); ctx.stroke();
  }

  // ── Head (ELONGATED skull — Giger/alien aesthetic) ──
  // Skull crown (elongated rear cranium going up)
  ctx.fillStyle = hex(flash, '#1a0a28');
  ctx.beginPath();
  ctx.moveTo(-s*0.1, -s*0.92);
  ctx.lineTo( s*0.1, -s*0.92);
  ctx.lineTo( s*0.2, -s*0.52);
  ctx.lineTo(-s*0.2, -s*0.52);
  ctx.closePath(); ctx.fill();
  // Face
  el(ctx, 0, -s*0.48, s*0.2, s*0.24);
  // Jaw/mandibles
  ctx.fillStyle = hex(flash, '#3a1848');
  ctx.beginPath();
  ctx.moveTo(-s*0.2, -s*0.38); ctx.lineTo(-s*0.28, -s*0.2); ctx.lineTo( s*0.0, -s*0.32); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo( s*0.2, -s*0.38); ctx.lineTo( s*0.28, -s*0.2); ctx.lineTo( s*0.0, -s*0.32); ctx.closePath(); ctx.fill();
  // CYAN glowing eyes — unmistakeable Tyranid look
  glow(ctx, '#00aaff', flash ? 0 : 10, () => {
    ctx.fillStyle = hex(flash, '#00ccff');
    el(ctx, -s*0.1, -s*0.54, s*0.06, s*0.05);
    el(ctx,  s*0.1, -s*0.54, s*0.06, s*0.05);
  });
}

// ============================================================
// CARNIFEX  boss  (r ≈ 34)
// Iconic: quadrupedal TANK, crushing bone claws, armoured dome
// Colours: obsidian carapace #120820, violet highlights #8030c0
// ============================================================
export function drawCarnifex(ctx, r, flash) {
  const s = r * 1.3;

  // Purple boss aura
  if (!flash) {
    const p = 0.5 + 0.2 * Math.sin(Date.now() * 0.004);
    const g = ctx.createRadialGradient(0,0,s*0.3, 0,0,s*1.4);
    g.addColorStop(0, `rgba(128,0,200,${p*0.4})`); g.addColorStop(1,'rgba(128,0,200,0)');
    ctx.fillStyle = g; el(ctx, 0, 0, s*1.4, s*1.4);
  }
  shadow(ctx, r);

  // ── Back legs (thick pillars) ──
  ctx.fillStyle = hex(flash, '#1a0830');
  rr(ctx, -s*0.7, s*0.38, s*0.34, s*0.55, 7);
  rr(ctx,  s*0.36,s*0.38, s*0.34, s*0.55, 7);
  // Foot claws
  ctx.fillStyle = hex(flash, '#c0a860');
  el(ctx, -s*0.53, s*0.9, s*0.18, s*0.1);
  el(ctx,  s*0.53, s*0.9, s*0.18, s*0.1);

  // ── Massive body / carapace dome ──
  ctx.fillStyle = hex(flash, '#120820');
  el(ctx, 0, s*0.05, s*0.62, s*0.68);
  // Carapace ridge plates
  ctx.fillStyle = hex(flash, '#8030c0');
  el(ctx, 0, -s*0.1, s*0.44, s*0.42);
  el(ctx, 0, -s*0.22,s*0.28, s*0.25);
  // Spine spikes row
  ctx.fillStyle = hex(flash, '#c0a860');
  for (let i = 0; i < 5; i++) {
    const sy = -s*0.4 + i * s*0.22;
    const sw = s * (0.1 - i*0.008);
    ctx.beginPath();
    ctx.moveTo(0, sy - s*0.18); ctx.lineTo(-sw, sy); ctx.lineTo(sw, sy);
    ctx.closePath(); ctx.fill();
  }

  // ── BONE CRUSHING CLAWS — two pairs of swept blades ──
  ctx.fillStyle = hex(flash, '#c0a860');
  // Left claw
  ctx.beginPath();
  ctx.moveTo(-s*0.44, -s*0.22);
  ctx.bezierCurveTo(-s*0.9, -s*0.55, -s*1.15, -s*0.25, -s*0.95, s*0.35);
  ctx.bezierCurveTo(-s*0.9,  s*0.1, -s*0.72, -s*0.42, -s*0.38, -s*0.38);
  ctx.closePath(); ctx.fill();
  // Left claw inner blade
  ctx.fillStyle = hex(flash, '#120820');
  ctx.beginPath();
  ctx.moveTo(-s*0.5, -s*0.3);
  ctx.bezierCurveTo(-s*0.85,-s*0.52, -s*1.0, -s*0.22, -s*0.9, s*0.22);
  ctx.lineWidth = s*0.04; ctx.strokeStyle = hex(flash,'#120820'); ctx.stroke();
  // Right claw
  ctx.fillStyle = hex(flash, '#c0a860');
  ctx.beginPath();
  ctx.moveTo( s*0.44, -s*0.22);
  ctx.bezierCurveTo( s*0.9, -s*0.55,  s*1.15, -s*0.25,  s*0.95, s*0.35);
  ctx.bezierCurveTo( s*0.9,  s*0.1,  s*0.72, -s*0.42,  s*0.38, -s*0.38);
  ctx.closePath(); ctx.fill();

  // ── Tyranid head ──
  ctx.fillStyle = hex(flash, '#120820');
  el(ctx, 0, -s*0.6, s*0.38, s*0.34);
  // Upper jaw
  ctx.fillStyle = hex(flash, '#2a1045');
  ctx.beginPath();
  ctx.moveTo(-s*0.3, -s*0.52); ctx.lineTo( s*0.3, -s*0.52);
  ctx.lineTo( s*0.28, -s*0.36); ctx.lineTo(-s*0.28, -s*0.36);
  ctx.closePath(); ctx.fill();
  // Lower jaw (open, showing teeth)
  ctx.fillStyle = hex(flash, '#3a1828');
  ctx.beginPath();
  ctx.moveTo(-s*0.26, -s*0.4); ctx.lineTo( s*0.26, -s*0.4);
  ctx.bezierCurveTo(s*0.28, -s*0.2, -s*0.28, -s*0.2, -s*0.26, -s*0.4);
  ctx.fill();
  // Teeth
  ctx.fillStyle = hex(flash, '#d0c080');
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i*s*0.08, -s*0.39);
    ctx.lineTo((i+0.5)*s*0.08, -s*0.3);
    ctx.lineTo((i+1)*s*0.08,   -s*0.39);
    ctx.fill();
  }
  // Head skull crest
  ctx.fillStyle = hex(flash, '#120820');
  ctx.beginPath();
  ctx.moveTo(-s*0.14, -s*0.94); ctx.lineTo(s*0.14, -s*0.94);
  ctx.lineTo(s*0.26, -s*0.7); ctx.lineTo(-s*0.26, -s*0.7);
  ctx.closePath(); ctx.fill();
  // BURNING RED eyes
  glow(ctx, '#ff2000', flash ? 0 : 14, () => {
    ctx.fillStyle = hex(flash, '#ff2000');
    el(ctx, -s*0.18, -s*0.66, s*0.09, s*0.09);
    el(ctx,  s*0.18, -s*0.66, s*0.09, s*0.09);
  });
}

// ============================================================
// WARBOSS  boss  (r ≈ 38)
// Iconic: POWER KLAW mechanical arm + huge horned helmet + tusks
// Colours: dark Ork green #2a6010, heavy armour #202030
// ============================================================
export function drawWarboss(ctx, r, flash) {
  const s = r * 1.25;

  // Green boss aura
  if (!flash) {
    const p = 0.45 + 0.2 * Math.sin(Date.now() * 0.004);
    const g = ctx.createRadialGradient(0,0,s*0.3, 0,0,s*1.4);
    g.addColorStop(0,`rgba(60,140,10,${p*0.4})`); g.addColorStop(1,'rgba(60,140,10,0)');
    ctx.fillStyle = g; el(ctx, 0, 0, s*1.4, s*1.4);
  }
  shadow(ctx, r);

  // ── Boots / feet ──
  ctx.fillStyle = hex(flash, '#1a1a28');
  rr(ctx, -s*0.5, s*0.62, s*0.38, s*0.32, 5);
  rr(ctx,  s*0.12,s*0.62, s*0.38, s*0.32, 5);

  // ── Legs ──
  ctx.fillStyle = hex(flash, '#1e4a0a');
  rr(ctx, -s*0.48, s*0.26, s*0.36, s*0.4, 5);
  rr(ctx,  s*0.12, s*0.26, s*0.36, s*0.4, 5);

  // ── Torso (massive armoured chest) ──
  ctx.fillStyle = hex(flash, '#2a6010');
  el(ctx, 0, s*0.06, s*0.52, s*0.52);
  // Armour plate
  ctx.fillStyle = hex(flash, '#202030');
  rr(ctx, -s*0.46, -s*0.14, s*0.92, s*0.42, 6);
  // Yellow warning stripes
  if (!flash) {
    ctx.fillStyle = '#ffcc00';
    for (let i = 0; i < 3; i++) {
      rr(ctx, -s*0.44 + i*s*0.3, -s*0.12, s*0.12, s*0.38, 2);
    }
    ctx.fillStyle = '#181828';
    for (let i = 0; i < 3; i++) {
      rr(ctx, -s*0.44 + i*s*0.3 + s*0.06, -s*0.12, s*0.12, s*0.38, 2);
    }
  }

  // ── Left arm (giant fist with knuckle dusters) ──
  ctx.fillStyle = hex(flash, '#2a6010');
  rr(ctx, -s*0.88, -s*0.22, s*0.44, s*0.56, 7);
  ctx.fillStyle = hex(flash, '#303040');
  rr(ctx, -s*0.86, s*0.2, s*0.4, s*0.18, 3);   // knuckle plate
  if (!flash) {
    ctx.fillStyle = '#888898';
    for (let i = 0; i < 4; i++)
      el(ctx, -s*0.8 + i*s*0.09, s*0.24, s*0.04, s*0.04);
  }

  // ── POWER KLAW arm — THE Warboss signature ──
  // Heavy mechanical arm casing
  ctx.fillStyle = hex(flash, '#303040');
  rr(ctx, s*0.44, -s*0.32, s*0.52, s*0.58, 7);
  // Hydraulics
  if (!flash) {
    ctx.fillStyle = '#ffcc00';
    rr(ctx, s*0.48, -s*0.28, s*0.44, s*0.08, 3);
    ctx.fillStyle = '#ff4400';
    rr(ctx, s*0.52, -s*0.16, s*0.36, s*0.06, 2);
  }
  // Three massive blade fingers
  ctx.fillStyle = hex(flash, '#8080a0');
  for (let i = 0; i < 3; i++) {
    const ox = s*(0.5 + i*0.14);
    ctx.beginPath();
    ctx.moveTo(ox, -s*0.46);
    ctx.lineTo(ox + s*0.08, -s*0.88);
    ctx.lineTo(ox + s*0.2,  -s*0.46);
    ctx.closePath(); ctx.fill();
    // Claw tip glow
    if (!flash) {
      ctx.fillStyle = '#c0c0d0';
      el(ctx, ox + s*0.1, -s*0.84, s*0.04, s*0.04);
      ctx.fillStyle = '#8080a0';
    }
  }

  // ── HEAD (enormous, with horned war-helmet) ──
  // Helmet body
  ctx.fillStyle = hex(flash, '#202030');
  rr(ctx, -s*0.48, -s*0.82, s*0.96, s*0.68, 8);
  // Helmet horns — essential Warboss look
  ctx.fillStyle = hex(flash, '#404050');
  ctx.beginPath();
  ctx.moveTo(-s*0.44, -s*0.82); ctx.lineTo(-s*0.62, -s*1.14); ctx.lineTo(-s*0.26,-s*0.82);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo( s*0.44, -s*0.82); ctx.lineTo( s*0.62, -s*1.14); ctx.lineTo( s*0.26,-s*0.82);
  ctx.closePath(); ctx.fill();
  // Skull decoration on helmet
  if (!flash) {
    ctx.fillStyle = '#c0b880';
    el(ctx, 0, -s*0.68, s*0.12, s*0.12);
    ctx.fillStyle = '#181828';
    el(ctx, -s*0.05,-s*0.64, s*0.03, s*0.04);
    el(ctx,  s*0.05,-s*0.64, s*0.03, s*0.04);
    rr(ctx, -s*0.06,-s*0.58, s*0.12, s*0.04, 2);
  }
  // Green skin face visible below helmet
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, -s*0.4, -s*0.48, s*0.8, s*0.38, 5);
  // Heavy brow
  ctx.fillStyle = hex(flash, '#1e4a0a');
  rr(ctx, -s*0.4, -s*0.5, s*0.8, s*0.1, 4);

  // ── TUSKS — bigger and more savage than regular Orks ──
  ctx.fillStyle = hex(flash, '#e0d090');
  ctx.beginPath(); ctx.moveTo(-s*0.24,-s*0.3); ctx.lineTo(-s*0.42,-s*0.04); ctx.lineTo(-s*0.16,-s*0.08); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo( s*0.24,-s*0.3); ctx.lineTo( s*0.42,-s*0.04); ctx.lineTo( s*0.16,-s*0.08); ctx.closePath(); ctx.fill();

  // ── Eyes ──
  glow(ctx, '#ff4000', flash ? 0 : 12, () => {
    ctx.fillStyle = hex(flash, '#ff4000');
    el(ctx, -s*0.22, -s*0.42, s*0.1, s*0.1);
    el(ctx,  s*0.22, -s*0.42, s*0.1, s*0.1);
  });
  ctx.fillStyle = '#000';
  el(ctx, -s*0.22,-s*0.42, s*0.04, s*0.04);
  el(ctx,  s*0.22,-s*0.42, s*0.04, s*0.04);
}

// ============================================================
// sprites.js — Side-view character sprites (facing RIGHT by default)
//
// Perspective: 2D side-view, same as Vampire Survivors.
// Characters are seen from the side/front — NOT top-down.
// Caller flips with ctx.scale(-1,1) when character faces left.
//
// All functions draw centred at (0, 0).
// Caller: ctx.save() → ctx.translate(sx,sy) → [ctx.scale(-1,1)] → draw → ctx.restore()
// ============================================================

function el(ctx, cx, cy, rx, ry) {
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w/2, h/2);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}
function tri(ctx, x1,y1, x2,y2, x3,y3) {
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.closePath(); ctx.fill();
}
function glow(ctx, color, blur, fn) {
  ctx.shadowColor = color; ctx.shadowBlur = blur; fn(); ctx.shadowBlur = 0;
}
function shadow(ctx, r) {
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  el(ctx, 0, r * 0.88, r * 0.7, r * 0.18);
}
function hex(flash, normal) { return flash ? '#ffffff' : normal; }

// ============================================================
// SPACE MARINE  (r ≈ 14)
// Side-view: iconic helmet profile, bolter raised, left pauldron dominates
// Colours: Ultramarines deep blue, gold trim, green visor
// ============================================================
export function drawSpaceMarine(ctx, r, flash) {
  const s = r * 1.55;   // visual scale slightly larger than collision
  shadow(ctx, r);

  // ── Boots ──
  ctx.fillStyle = hex(flash, '#0a0e1c');
  rr(ctx,  s*0.02, s*0.72, s*0.26, s*0.18, 3);   // right boot
  rr(ctx, -s*0.28, s*0.72, s*0.22, s*0.18, 3);   // left boot (behind)

  // ── Legs ──
  ctx.fillStyle = hex(flash, '#001a50');
  rr(ctx,  s*0.04, s*0.32, s*0.24, s*0.44, 4);   // right leg (forward)
  rr(ctx, -s*0.26, s*0.32, s*0.2,  s*0.4,  4);   // left leg  (behind)

  // ── Leg knee pads ──
  if (!flash) {
    ctx.fillStyle = '#c9a227';
    rr(ctx, s*0.04, s*0.42, s*0.24, s*0.07, 2);
    rr(ctx,-s*0.26, s*0.42, s*0.20, s*0.06, 2);
  }

  // ── Torso / chest plate ──
  ctx.fillStyle = hex(flash, '#0033aa');
  rr(ctx, -s*0.38, -s*0.32, s*0.76, s*0.68, 7);

  // ── Aquila (chest eagle) — T-shaped gold icon ──
  if (!flash) {
    ctx.fillStyle = '#c9a227';
    // Wings
    tri(ctx, -s*0.22, -s*0.1,  -s*0.05, -s*0.22,  -s*0.05, s*0.0);
    tri(ctx,  s*0.22, -s*0.1,   s*0.05, -s*0.22,   s*0.05, s*0.0);
    el(ctx, 0, -s*0.11, s*0.07, s*0.1); // eagle body
  }

  // ── Left arm (behind body) — visible shoulder only ──
  ctx.fillStyle = hex(flash, '#001f5e');
  rr(ctx, -s*0.46, -s*0.28, s*0.18, s*0.4, 4);

  // ── Right arm — holds bolter, extends forward-right ──
  ctx.fillStyle = hex(flash, '#001f5e');
  rr(ctx, s*0.34, -s*0.3, s*0.28, s*0.44, 5);

  // ── BOLTER — boxy gun body, barrel extends right ──
  ctx.fillStyle = hex(flash, '#0d0d0d');
  rr(ctx, s*0.38, -s*0.48, s*0.2, s*0.1, 2);    // barrel
  rr(ctx, s*0.32, -s*0.38, s*0.3, s*0.22, 3);   // gun body
  ctx.fillStyle = hex(flash, '#1a1a1a');
  rr(ctx, s*0.44, -s*0.2, s*0.12, s*0.14, 2);   // magazine
  if (!flash) {
    ctx.fillStyle = '#c9a227';
    rr(ctx, s*0.34, -s*0.36, s*0.04, s*0.2, 1); // trigger guard stripe
  }

  // ── LEFT PAULDRON — dominant side feature, very large ──
  ctx.fillStyle = hex(flash, '#0033aa');
  el(ctx, -s*0.52, -s*0.3, s*0.28, s*0.26);
  el(ctx, -s*0.5,  -s*0.28, s*0.24, s*0.22);  // slight dome highlight shape
  if (!flash) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-s*0.52, -s*0.3, s*0.28, s*0.26, 0,0,Math.PI*2); ctx.stroke();
    // Ultramarines 'U' arc on pad
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(-s*0.52, -s*0.26, s*0.14, 0, Math.PI, false); ctx.stroke();
  }

  // ── Right pauldron (smaller, front-facing side) ──
  ctx.fillStyle = hex(flash, '#0033aa');
  el(ctx, s*0.38, -s*0.3, s*0.22, s*0.2);
  if (!flash) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(s*0.38, -s*0.3, s*0.22, s*0.2, 0,0,Math.PI*2); ctx.stroke();
  }

  // ── HELMET — the profile silhouette, drawn last (on top) ──
  // Back of helmet (round dome)
  ctx.fillStyle = hex(flash, '#0033aa');
  el(ctx, -s*0.08, -s*0.58, s*0.26, s*0.32);
  // Front face plate (slightly flatter, like SM face mask)
  ctx.fillStyle = hex(flash, '#0030a0');
  rr(ctx, -s*0.2, -s*0.74, s*0.32, s*0.38, 5);
  // Gold helmet rim line
  if (!flash) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(-s*0.08, -s*0.58, s*0.32, -Math.PI*0.9, Math.PI*0.1); ctx.stroke();
  }

  // ── VISOR — horizontal glowing green slit (THE most iconic SM feature) ──
  glow(ctx, '#00ff88', flash ? 0 : 12, () => {
    ctx.fillStyle = hex(flash, '#00ff88');
    rr(ctx, -s*0.18, -s*0.63, s*0.3, s*0.1, 3);
  });

  // Nose/chin section below visor
  if (!flash) {
    ctx.fillStyle = '#001640';
    rr(ctx, -s*0.16, -s*0.52, s*0.22, s*0.14, 3);
    // Vent dots on chin
    ctx.fillStyle = '#002060';
    el(ctx, -s*0.1, -s*0.48, s*0.03, s*0.03);
    el(ctx, -s*0.04,-s*0.48, s*0.03, s*0.03);
  }
}

// ============================================================
// HORMAGAUNT  (r ≈ 8)
// Side-view: crouching alien posture, blade arm raised, tail curves back
// Colours: deep purple chitin, bone blades, red eyes
// ============================================================
export function drawHormagaunt(ctx, r, flash) {
  const s = r * 1.9;
  shadow(ctx, r);

  // ── Hind legs & tail ──
  ctx.strokeStyle = hex(flash, '#2a0838');
  ctx.lineWidth   = s * 0.1; ctx.lineCap = 'round';
  // Back leg
  ctx.beginPath(); ctx.moveTo(-s*0.12, s*0.22); ctx.lineTo(-s*0.34, s*0.6); ctx.lineTo(-s*0.18, s*0.84); ctx.stroke();
  // Front leg
  ctx.beginPath(); ctx.moveTo( s*0.1,  s*0.22); ctx.lineTo( s*0.28, s*0.6); ctx.lineTo( s*0.14, s*0.84); ctx.stroke();
  // Talon tips
  ctx.fillStyle = hex(flash, '#c4b870');
  el(ctx, -s*0.18, s*0.84, s*0.07, s*0.04);
  el(ctx,  s*0.14, s*0.84, s*0.07, s*0.04);

  // ── Tail (sweeps back-and-up) ──
  ctx.strokeStyle = hex(flash, '#4a1a60');
  ctx.lineWidth = s*0.12;
  ctx.beginPath();
  ctx.moveTo(-s*0.14, s*0.12);
  ctx.bezierCurveTo(-s*0.5, s*0.0, -s*0.72, -s*0.28, -s*0.6, -s*0.54);
  ctx.stroke();
  // Tail spike
  ctx.fillStyle = hex(flash, '#c4b870');
  tri(ctx, -s*0.6,-s*0.54, -s*0.52,-s*0.66, -s*0.46,-s*0.5);

  // ── Abdomen (larger rear section) ──
  ctx.fillStyle = hex(flash, '#3d1050');
  el(ctx, -s*0.08, s*0.12, s*0.28, s*0.36);
  ctx.fillStyle = hex(flash, '#5a2072');
  el(ctx, -s*0.04, s*0.0, s*0.18, s*0.2);

  // ── Thorax (chest, raised forward) ──
  ctx.fillStyle = hex(flash, '#3d1050');
  el(ctx, s*0.1, -s*0.1, s*0.24, s*0.28);

  // ── Scythe arm — the forward-thrusting blade ──
  // Upper arm
  ctx.strokeStyle = hex(flash, '#3d1050');
  ctx.lineWidth = s*0.14;
  ctx.beginPath(); ctx.moveTo(s*0.18, -s*0.18); ctx.lineTo(s*0.6, -s*0.52); ctx.stroke();
  // Scythe blade (crescent shape)
  ctx.fillStyle = hex(flash, '#d4c870');
  ctx.beginPath();
  ctx.moveTo(s*0.5, -s*0.62);
  ctx.bezierCurveTo(s*0.82, -s*0.58, s*0.88, -s*0.22, s*0.68, -s*0.18);
  ctx.bezierCurveTo(s*0.76, -s*0.28, s*0.72, -s*0.5,  s*0.56, -s*0.52);
  ctx.closePath(); ctx.fill();
  // Scythe tip highlight
  if (!flash) {
    ctx.strokeStyle = '#a8943a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(s*0.52,-s*0.62); ctx.lineTo(s*0.84,-s*0.22); ctx.stroke();
  }

  // ── Second arm (folded, partially hidden) ──
  ctx.strokeStyle = hex(flash, '#3d1050');
  ctx.lineWidth = s*0.1;
  ctx.beginPath(); ctx.moveTo(s*0.14, -s*0.14); ctx.lineTo(s*0.38, -s*0.36); ctx.stroke();
  ctx.fillStyle = hex(flash, '#c4b870');
  el(ctx, s*0.38, -s*0.36, s*0.1, s*0.07);

  // ── Neck ──
  ctx.fillStyle = hex(flash, '#3d1050');
  rr(ctx, s*0.12, -s*0.3, s*0.12, s*0.22, 3);

  // ── Head (elongated alien skull) ──
  ctx.fillStyle = hex(flash, '#3d1050');
  // Cranium dome (oval, tilted forward)
  el(ctx, s*0.22, -s*0.5, s*0.14, s*0.2);
  // Extended skull crest going back
  ctx.beginPath();
  ctx.moveTo(s*0.12, -s*0.62);
  ctx.bezierCurveTo(-s*0.1, -s*0.62, -s*0.12, -s*0.42, s*0.1, -s*0.38);
  ctx.lineTo(s*0.12, -s*0.38);
  ctx.closePath(); ctx.fill();
  // Face snout (pointing right)
  ctx.fillStyle = hex(flash, '#2a0838');
  rr(ctx, s*0.26, -s*0.46, s*0.22, s*0.1, 2);
  // Small teeth
  if (!flash) {
    ctx.fillStyle = '#d0c070';
    for (let i = 0; i < 3; i++) {
      tri(ctx, s*(0.28+i*0.06),-s*0.44, s*(0.31+i*0.06),-s*0.38, s*(0.34+i*0.06),-s*0.44);
    }
  }
  // GLOWING RED EYE
  glow(ctx, '#ff0000', flash ? 0 : 8, () => {
    ctx.fillStyle = hex(flash, '#ff1010');
    el(ctx, s*0.18, -s*0.5, s*0.055, s*0.055);
  });
  ctx.fillStyle = '#000';
  el(ctx, s*0.18, -s*0.5, s*0.022, s*0.022);
}

// ============================================================
// ORK BOY  (r ≈ 13)
// Side-view: massive head dominates, choppa raised, hunched posture
// Colours: Ork green, dark leather/metal, ivory tusks
// ============================================================
export function drawOrkBoy(ctx, r, flash) {
  const s = r * 1.55;
  shadow(ctx, r);

  // ── Boots ──
  ctx.fillStyle = hex(flash, '#1a1a28');
  rr(ctx,  s*0.04, s*0.68, s*0.3,  s*0.24, 4);
  rr(ctx, -s*0.28, s*0.68, s*0.24, s*0.2,  4);

  // ── Legs (thick, short) ──
  ctx.fillStyle = hex(flash, '#2a5018');
  rr(ctx,  s*0.06, s*0.3, s*0.26, s*0.42, 4);
  rr(ctx, -s*0.28, s*0.3, s*0.22, s*0.36, 4);

  // ── Back arm (left arm, partially visible) ──
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, -s*0.48, -s*0.2, s*0.22, s*0.44, 5);
  // Fist
  ctx.fillStyle = hex(flash, '#2a5818');
  el(ctx, -s*0.37, s*0.22, s*0.14, s*0.12);

  // ── Body / barrel chest ──
  ctx.fillStyle = hex(flash, '#3a7020');
  el(ctx, 0, s*0.06, s*0.42, s*0.44);
  // Armour scraps on chest
  ctx.fillStyle = hex(flash, '#2a2a38');
  rr(ctx, -s*0.3, -s*0.18, s*0.38, s*0.22, 3);
  rr(ctx,  s*0.04,-s*0.06, s*0.22, s*0.18, 3);
  if (!flash) {
    // Rivets on armour scraps
    ctx.fillStyle = '#6a6a7a';
    el(ctx, -s*0.26,-s*0.1, s*0.04, s*0.04);
    el(ctx, -s*0.1, -s*0.1, s*0.04, s*0.04);
    el(ctx, s*0.2,  -s*0.02, s*0.04, s*0.04);
  }

  // ── Right arm + CHOPPA raised ──
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, s*0.34, -s*0.38, s*0.28, s*0.52, 5);  // upper arm
  rr(ctx, s*0.3,  -s*0.02, s*0.22, s*0.34, 4);  // lower arm / fist

  // CHOPPA BLADE — large rusty cleaver raised overhead
  ctx.fillStyle = hex(flash, '#7a3a10');  // rust
  ctx.beginPath();
  ctx.moveTo(s*0.36, -s*0.5);
  ctx.lineTo(s*0.72, -s*0.82);
  ctx.lineTo(s*0.82, -s*0.46);
  ctx.lineTo(s*0.5,  -s*0.38);
  ctx.closePath(); ctx.fill();
  // Blade edge (shiny)
  if (!flash) {
    ctx.fillStyle = '#b8b8c0';
    ctx.beginPath();
    ctx.moveTo(s*0.7, -s*0.8);
    ctx.lineTo(s*0.82,-s*0.48);
    ctx.lineTo(s*0.78,-s*0.46);
    ctx.lineTo(s*0.66,-s*0.78);
    ctx.closePath(); ctx.fill();
    // Handle wrap
    ctx.fillStyle = '#3a2010';
    rr(ctx, s*0.38, -s*0.5, s*0.08, s*0.26, 2);
    // Handle band
    ctx.fillStyle = '#8a6a40';
    rr(ctx, s*0.36, -s*0.38, s*0.1, s*0.04, 1);
  }

  // ── THE HUGE ORK HEAD — side view, heavy brow ──
  ctx.fillStyle = hex(flash, '#4a8a28');
  // Main skull (big oval, slightly forward-leaning)
  el(ctx, s*0.04, -s*0.58, s*0.38, s*0.38);
  // Heavy brow ridge (horizontal overhang)
  ctx.fillStyle = hex(flash, '#2a5018');
  rr(ctx, -s*0.28, -s*0.82, s*0.58, s*0.14, 4);
  // Ear (back of head lump)
  ctx.fillStyle = hex(flash, '#3a7020');
  el(ctx, -s*0.36, -s*0.58, s*0.1, s*0.12);
  // Jaw / lower face
  ctx.fillStyle = hex(flash, '#3e7822');
  rr(ctx, -s*0.18, -s*0.38, s*0.5, s*0.22, 4);
  // Nose (flat, wide)
  if (!flash) {
    ctx.fillStyle = '#1e5010';
    el(ctx, s*0.1, -s*0.48, s*0.09, s*0.06);
    el(ctx, s*0.22,-s*0.48, s*0.09, s*0.06);
  }
  // TUSK — lower, pointing forward-down
  ctx.fillStyle = hex(flash, '#e0d090');
  // Big right tusk
  tri(ctx, s*0.22,-s*0.32, s*0.46,-s*0.06, s*0.28,-s*0.1);
  // Smaller second tusk
  tri(ctx, s*0.04,-s*0.3,  s*0.22,-s*0.08, s*0.12,-s*0.12);

  // RED EYE
  glow(ctx, '#ff3000', flash ? 0 : 5, () => {
    ctx.fillStyle = hex(flash, '#ff3020');
    el(ctx, s*0.12, -s*0.6, s*0.08, s*0.08);
  });
  ctx.fillStyle = '#0a0a0a';
  el(ctx, s*0.12, -s*0.6, s*0.03, s*0.03);
}

// ============================================================
// TYRANID WARRIOR  (r ≈ 17)
// Side-view: tall, running posture, scythe arm raised forward
// Colours: dark purple carapace, bone talons, cyan eyes
// ============================================================
export function drawTyranidWarrior(ctx, r, flash) {
  const s = r * 1.42;
  shadow(ctx, r);

  // ── Back leg (digitigrade, hind) ──
  ctx.strokeStyle = hex(flash, '#12081e');
  ctx.lineWidth = s*0.13; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s*0.14, s*0.24); ctx.lineTo(-s*0.3, s*0.62); ctx.lineTo(-s*0.14, s*0.88); ctx.stroke();
  ctx.fillStyle = hex(flash, '#c8b870');
  el(ctx, -s*0.14, s*0.88, s*0.09, s*0.05);

  // ── Front leg ──
  ctx.beginPath(); ctx.moveTo(s*0.14, s*0.24); ctx.lineTo(s*0.3, s*0.62); ctx.lineTo(s*0.16, s*0.88); ctx.stroke();
  ctx.fillStyle = hex(flash, '#c8b870');
  el(ctx, s*0.16, s*0.88, s*0.09, s*0.05);

  // ── Abdomen / lower body ──
  ctx.fillStyle = hex(flash, '#2d1245');
  el(ctx, -s*0.04, s*0.24, s*0.24, s*0.34);
  // Segmented underside
  ctx.fillStyle = hex(flash, '#5a1a30');
  rr(ctx, -s*0.14, s*0.18, s*0.28, s*0.28, 4);

  // ── Torso (leaning forward, aggressive stance) ──
  ctx.fillStyle = hex(flash, '#1a0a28');
  el(ctx, s*0.04, -s*0.1, s*0.3, s*0.4);
  // Carapace highlight on back
  ctx.fillStyle = hex(flash, '#4a2068');
  el(ctx, -s*0.06, -s*0.18, s*0.2, s*0.26);
  // Spine ridges
  if (!flash) {
    ctx.fillStyle = '#6a3888';
    for (let i = 0; i < 4; i++) {
      el(ctx, -s*0.1, -s*0.38 + i*s*0.14, s*0.06, s*0.06);
    }
  }

  // ── Back scythe arm (folded, one visible from this side) ──
  ctx.strokeStyle = hex(flash, '#1a0a28');
  ctx.lineWidth = s*0.1;
  ctx.beginPath(); ctx.moveTo(-s*0.12, -s*0.16); ctx.lineTo(-s*0.42, -s*0.44); ctx.stroke();
  ctx.fillStyle = hex(flash, '#c8b870');
  ctx.beginPath();
  ctx.moveTo(-s*0.32, -s*0.54);
  ctx.bezierCurveTo(-s*0.68, -s*0.52, -s*0.72, -s*0.2, -s*0.52, -s*0.04);
  ctx.bezierCurveTo(-s*0.58, -s*0.22, -s*0.54, -s*0.44, -s*0.3, -s*0.44);
  ctx.closePath(); ctx.fill();

  // ── MAIN SCYTHE ARM — forward, raised, dominant ──
  ctx.strokeStyle = hex(flash, '#1a0a28');
  ctx.lineWidth = s*0.14;
  ctx.beginPath(); ctx.moveTo(s*0.18, -s*0.18); ctx.lineTo(s*0.54, -s*0.58); ctx.stroke();
  // Scythe blade (large, sweeping)
  ctx.fillStyle = hex(flash, '#d0c888');
  ctx.beginPath();
  ctx.moveTo(s*0.44, -s*0.7);
  ctx.bezierCurveTo(s*0.88, -s*0.68, s*0.96, -s*0.24, s*0.72, -s*0.08);
  ctx.bezierCurveTo(s*0.82, -s*0.3, s*0.76, -s*0.58, s*0.5, -s*0.6);
  ctx.closePath(); ctx.fill();
  // Vein/edge of blade
  if (!flash) {
    ctx.strokeStyle = '#907830'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(s*0.48,-s*0.7); ctx.bezierCurveTo(s*0.86,-s*0.66, s*0.92,-s*0.28, s*0.72,-s*0.1); ctx.stroke();
  }

  // ── Neck ──
  ctx.fillStyle = hex(flash, '#1a0a28');
  rr(ctx, s*0.08, -s*0.42, s*0.14, s*0.26, 3);

  // ── HEAD — elongated Xenomorph-style skull ──
  ctx.fillStyle = hex(flash, '#1a0a28');
  // Main head oval
  el(ctx, s*0.18, -s*0.56, s*0.2, s*0.26);
  // Elongated skull crest extending backwards
  ctx.beginPath();
  ctx.moveTo(s*0.04, -s*0.74);
  ctx.bezierCurveTo(-s*0.22, -s*0.72, -s*0.28, -s*0.48, s*0.0, -s*0.38);
  ctx.lineTo(s*0.04, -s*0.38); ctx.closePath(); ctx.fill();
  // Upper jaw
  ctx.fillStyle = hex(flash, '#2a1040');
  rr(ctx, s*0.14, -s*0.42, s*0.3, s*0.1, 3);
  // Lower jaw / mandibles
  ctx.fillStyle = hex(flash, '#3a1828');
  ctx.beginPath();
  ctx.moveTo(s*0.16, -s*0.38); ctx.lineTo(s*0.44, -s*0.22); ctx.lineTo(s*0.38, -s*0.18); ctx.lineTo(s*0.12, -s*0.34);
  ctx.closePath(); ctx.fill();
  // Teeth
  if (!flash) {
    ctx.fillStyle = '#d0c080';
    for (let i = 0; i < 3; i++) {
      tri(ctx, s*(0.2+i*0.07), -s*0.38, s*(0.24+i*0.07), -s*0.28, s*(0.28+i*0.07), -s*0.38);
    }
  }
  // CYAN GLOWING EYES
  glow(ctx, '#00ccff', flash ? 0 : 12, () => {
    ctx.fillStyle = hex(flash, '#00ddff');
    el(ctx, s*0.1, -s*0.58, s*0.06, s*0.05);
  });
  ctx.fillStyle = '#000';
  el(ctx, s*0.1, -s*0.58, s*0.02, s*0.02);
}

// ============================================================
// CARNIFEX  boss  (r ≈ 34)
// Side-view: massive quadruped, bone claws, open maw
// Colours: obsidian #120820, violet carapace, bone claws
// ============================================================
export function drawCarnifex(ctx, r, flash) {
  const s = r * 1.28;

  // Boss aura
  if (!flash) {
    const p = 0.45 + 0.2*Math.sin(Date.now()*0.004);
    const g = ctx.createRadialGradient(0,0,s*0.3, 0,0,s*1.5);
    g.addColorStop(0,`rgba(120,0,200,${p*0.4})`); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; el(ctx, 0, 0, s*1.5, s*1.5);
  }
  shadow(ctx, r);

  // ── Two hind legs (back pair, thick columns) ──
  ctx.fillStyle = hex(flash, '#1a0830');
  ctx.lineWidth = s*0.24; ctx.strokeStyle = hex(flash,'#1a0830'); ctx.lineCap='round';
  // Back hind leg
  ctx.beginPath(); ctx.moveTo(-s*0.52, s*0.32); ctx.lineTo(-s*0.64, s*0.7); ctx.lineTo(-s*0.42, s*0.92); ctx.stroke();
  // Front hind leg
  ctx.beginPath(); ctx.moveTo(-s*0.12, s*0.38); ctx.lineTo(-s*0.14, s*0.76); ctx.lineTo( s*0.04, s*0.94); ctx.stroke();
  ctx.fillStyle = hex(flash, '#c0a860');
  el(ctx, -s*0.42, s*0.92, s*0.16, s*0.09);
  el(ctx,  s*0.04, s*0.94, s*0.16, s*0.09);

  // ── MASSIVE BODY ──
  ctx.fillStyle = hex(flash, '#120820');
  el(ctx, -s*0.06, s*0.06, s*0.58, s*0.58);
  // Carapace dome on top
  ctx.fillStyle = hex(flash, '#8030c0');
  el(ctx, -s*0.1, -s*0.18, s*0.44, s*0.38);
  el(ctx, -s*0.08, -s*0.28, s*0.28, s*0.22);
  // Segmented belly (fleshy)
  ctx.fillStyle = hex(flash, '#5a1828');
  rr(ctx, -s*0.26, s*0.06, s*0.36, s*0.48, 6);
  // Spine spikes (row along back-top)
  ctx.fillStyle = hex(flash, '#c8b060');
  for (let i = 0; i < 5; i++) {
    const bx = -s*0.52 + i*s*0.16;
    const by = -s*0.46 - i*s*0.04;
    tri(ctx, bx, by, bx-s*0.07, by+s*0.16, bx+s*0.07, by+s*0.16);
  }

  // ── Front legs / CRUSHING CLAWS ──
  // Right front leg arm
  ctx.strokeStyle = hex(flash,'#1a0830'); ctx.lineWidth = s*0.2;
  ctx.beginPath(); ctx.moveTo(s*0.36, s*0.12); ctx.lineTo(s*0.7, -s*0.22); ctx.stroke();
  // Claw upper blade
  ctx.fillStyle = hex(flash, '#c8b060');
  ctx.beginPath();
  ctx.moveTo(s*0.62, -s*0.38);
  ctx.bezierCurveTo(s*0.98,-s*0.42, s*1.06,-s*0.08, s*0.86, s*0.08);
  ctx.bezierCurveTo(s*0.92,-s*0.1, s*0.88,-s*0.34, s*0.66,-s*0.3);
  ctx.closePath(); ctx.fill();
  // Claw lower blade
  ctx.fillStyle = hex(flash, '#b0a050');
  ctx.beginPath();
  ctx.moveTo(s*0.64, -s*0.3);
  ctx.bezierCurveTo(s*0.88,-s*0.2, s*0.94, s*0.08, s*0.76, s*0.18);
  ctx.bezierCurveTo(s*0.86, s*0.04, s*0.8, -s*0.18, s*0.66,-s*0.2);
  ctx.closePath(); ctx.fill();
  // Left front leg (partially visible)
  ctx.strokeStyle = hex(flash,'#120820'); ctx.lineWidth = s*0.16;
  ctx.beginPath(); ctx.moveTo(s*0.22, s*0.16); ctx.lineTo(s*0.5, -s*0.1); ctx.stroke();

  // ── TYRANID HEAD — side profile with open maw ──
  ctx.fillStyle = hex(flash, '#120820');
  el(ctx, s*0.26, -s*0.44, s*0.34, s*0.3);
  // Upper skull plate
  ctx.fillStyle = hex(flash, '#2a1045');
  el(ctx, s*0.18, -s*0.54, s*0.28, s*0.2);
  // OPEN JAW (lower jaw swings down)
  ctx.fillStyle = hex(flash, '#3a1828');
  ctx.beginPath();
  ctx.moveTo(s*0.0, -s*0.38); ctx.lineTo(s*0.52,-s*0.38);
  ctx.bezierCurveTo(s*0.6,-s*0.18, s*0.48,-s*0.06, s*0.2,-s*0.1);
  ctx.closePath(); ctx.fill();
  // Teeth rows
  ctx.fillStyle = hex(flash, '#d0c070');
  for (let i = 0; i < 5; i++) {
    tri(ctx, s*(0.06+i*0.09),-s*0.37, s*(0.1+i*0.09),-s*0.26, s*(0.14+i*0.09),-s*0.37);
    tri(ctx, s*(0.06+i*0.09),-s*0.12, s*(0.1+i*0.09),-s*0.22, s*(0.14+i*0.09),-s*0.12);
  }
  // Skull crest (back of head extending up-back)
  ctx.fillStyle = hex(flash, '#120820');
  ctx.beginPath();
  ctx.moveTo(s*0.0, -s*0.72);
  ctx.bezierCurveTo(-s*0.16,-s*0.7, -s*0.24,-s*0.48, s*0.0,-s*0.38);
  ctx.lineTo(s*0.06,-s*0.38); ctx.closePath(); ctx.fill();
  // BURNING RED EYES
  glow(ctx, '#ff2000', flash ? 0 : 16, () => {
    ctx.fillStyle = hex(flash, '#ff2000');
    el(ctx, s*0.12, -s*0.5, s*0.09, s*0.09);
  });
  ctx.fillStyle = '#300';
  el(ctx, s*0.12, -s*0.5, s*0.04, s*0.04);
}

// ============================================================
// WARBOSS  boss  (r ≈ 38)
// Side-view: enormous Ork, power klaw raised, horned helmet, tusks
// Colours: dark Ork green, heavy iron armour, glowing power klaw
// ============================================================
export function drawWarboss(ctx, r, flash) {
  const s = r * 1.22;

  // Green boss aura
  if (!flash) {
    const p = 0.45 + 0.2*Math.sin(Date.now()*0.004);
    const g = ctx.createRadialGradient(0,0,s*0.3, 0,0,s*1.45);
    g.addColorStop(0,`rgba(60,140,10,${p*0.4})`); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; el(ctx, 0, 0, s*1.45, s*1.45);
  }
  shadow(ctx, r);

  // ── Boots ──
  ctx.fillStyle = hex(flash, '#1a1a28');
  rr(ctx,  s*0.06, s*0.7, s*0.38, s*0.28, 5);
  rr(ctx, -s*0.36, s*0.7, s*0.3,  s*0.22, 5);

  // ── Legs ──
  ctx.fillStyle = hex(flash, '#1e4a0a');
  rr(ctx,  s*0.08, s*0.28, s*0.34, s*0.46, 5);
  rr(ctx, -s*0.36, s*0.28, s*0.28, s*0.38, 5);

  // ── Left arm (back, meaty fist) ──
  ctx.fillStyle = hex(flash, '#2a6010');
  rr(ctx, -s*0.52, -s*0.22, s*0.24, s*0.54, 6);
  // Fist / knuckle plates
  ctx.fillStyle = hex(flash, '#202030');
  rr(ctx, -s*0.52, s*0.22, s*0.24, s*0.16, 3);
  if (!flash) {
    ctx.fillStyle = '#8080a0';
    for (let i=0;i<3;i++) el(ctx, -s*0.48+i*s*0.08, s*0.26, s*0.04, s*0.04);
  }

  // ── TORSO — massive, armour-plated ──
  ctx.fillStyle = hex(flash, '#2a6010');
  el(ctx, 0, s*0.04, s*0.52, s*0.54);
  // Front armour plate (covers most of chest)
  ctx.fillStyle = hex(flash, '#202030');
  rr(ctx, -s*0.38, -s*0.24, s*0.76, s*0.48, 6);
  // Yellow hazard stripes on armour
  if (!flash) {
    ctx.fillStyle = '#d4a000';
    for (let i = 0; i < 3; i++) {
      ctx.save(); ctx.translate(-s*0.3 + i*s*0.26, -s*0.2);
      ctx.rotate(0.5);
      rr(ctx, 0, 0, s*0.14, s*0.32, 2);
      ctx.restore();
    }
    // Dark stripes over yellow (hazard pattern)
    ctx.fillStyle = '#181828';
    for (let i = 0; i < 3; i++) {
      ctx.save(); ctx.translate(-s*0.3 + i*s*0.26 + s*0.04, -s*0.2);
      ctx.rotate(0.5);
      rr(ctx, 0, 0, s*0.07, s*0.32, 2);
      ctx.restore();
    }
    // Rivets
    ctx.fillStyle = '#8888a0';
    el(ctx, -s*0.34, -s*0.2, s*0.04, s*0.04);
    el(ctx,  s*0.34, -s*0.2, s*0.04, s*0.04);
    el(ctx, -s*0.34,  s*0.2, s*0.04, s*0.04);
    el(ctx,  s*0.34,  s*0.2, s*0.04, s*0.04);
  }

  // ── POWER KLAW ARM — THE Warboss signature ──
  // Heavy mechanical arm casing
  ctx.fillStyle = hex(flash, '#282838');
  rr(ctx, s*0.44, -s*0.44, s*0.56, s*0.64, 8);
  // Hydraulics visible
  if (!flash) {
    ctx.fillStyle = '#d4a000'; rr(ctx, s*0.48, -s*0.4, s*0.48, s*0.1, 3);
    ctx.fillStyle = '#aa2200'; rr(ctx, s*0.52, -s*0.26, s*0.4, s*0.08, 2);
    ctx.fillStyle = '#505060'; rr(ctx, s*0.48, -s*0.12, s*0.48, s*0.08, 2);
  }
  // KLAW FINGERS — three large mechanical talons
  ctx.fillStyle = hex(flash, '#9090b0');
  for (let i = 0; i < 3; i++) {
    const ky = -s*0.54 + i*s*0.18;
    ctx.beginPath();
    ctx.moveTo(s*0.98, ky);
    ctx.lineTo(s*1.28, ky+s*0.06);
    ctx.lineTo(s*1.22, ky+s*0.14);
    ctx.lineTo(s*0.96, ky+s*0.1);
    ctx.closePath(); ctx.fill();
    // Claw tip glow (power field)
    if (!flash) {
      glow(ctx, '#4488ff', 6, () => {
        ctx.fillStyle = '#aaccff';
        el(ctx, s*1.26, ky+s*0.08, s*0.04, s*0.04);
      });
    }
  }

  // ── HEAD — enormous, horned war helmet ──
  // Helmet body
  ctx.fillStyle = hex(flash, '#1e1e2e');
  rr(ctx, -s*0.38, -s*0.88, s*0.8, s*0.68, 9);
  // HORNS on helmet — unmistakeable Warboss look
  ctx.fillStyle = hex(flash, '#383848');
  tri(ctx, -s*0.36,-s*0.88, -s*0.54,-s*1.24, -s*0.16,-s*0.88);
  tri(ctx,  s*0.26,-s*0.88,  s*0.44,-s*1.18,  s*0.06,-s*0.88);
  // Skull decoration on helmet
  if (!flash) {
    ctx.fillStyle = '#c8b060';
    el(ctx, s*0.04, -s*0.62, s*0.12, s*0.12);
    ctx.fillStyle = '#181828';
    el(ctx, -s*0.04, -s*0.58, s*0.04, s*0.05); el(ctx, s*0.1, -s*0.58, s*0.04, s*0.05);
    rr(ctx, -s*0.05, -s*0.52, s*0.14, s*0.04, 2);
  }
  // Green skin face below helmet visor line
  ctx.fillStyle = hex(flash, '#3a7020');
  rr(ctx, -s*0.28, -s*0.52, s*0.7, s*0.38, 5);
  // Heavy brow
  ctx.fillStyle = hex(flash, '#1e4a0a');
  rr(ctx, -s*0.28, -s*0.56, s*0.7, s*0.12, 4);

  // TUSKS — large, jutting forward
  ctx.fillStyle = hex(flash, '#e0d090');
  tri(ctx, s*0.2,-s*0.36,  s*0.46,-s*0.08, s*0.26,-s*0.12);  // right tusk
  tri(ctx, s*0.0,-s*0.34,  s*0.24,-s*0.1,  s*0.1, -s*0.14);  // second

  // EYES — burning orange-red
  glow(ctx, '#ff4000', flash ? 0 : 14, () => {
    ctx.fillStyle = hex(flash, '#ff4000');
    el(ctx, s*0.16, -s*0.44, s*0.1, s*0.1);
    el(ctx, -s*0.08,-s*0.44, s*0.09, s*0.09);
  });
  ctx.fillStyle = '#0a0000';
  el(ctx, s*0.16, -s*0.44, s*0.04, s*0.04);
  el(ctx, -s*0.08,-s*0.44, s*0.04, s*0.04);
}

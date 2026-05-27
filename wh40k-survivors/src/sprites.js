// ============================================================
// sprites.js  —  Character sprites inspired by Warhammer Survivors
//
// Style: chunky proportions · thick black outlines · flat colours
// All sprites face RIGHT. Caller does ctx.scale(-1,1) for left.
// Centred at (0,0). Call inside ctx.save() / ctx.restore().
// ============================================================

// ── Low-level helpers ──────────────────────────────────────────
function el(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, Math.PI * 2);
}
function rc(ctx, x, y, w, h, r = 3) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
function tri(ctx, x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3);
  ctx.closePath();
}

// Fill + outline (gives pixel-art border look)
function fo(ctx, fill, lw = 2, stroke = '#111') {
  ctx.fillStyle   = fill;   ctx.fill();
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
}
function f(ctx, fill) { ctx.fillStyle = fill; ctx.fill(); }
function o(ctx, lw = 1.5, stroke = '#111') {
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
}

function shadow(ctx, r) {
  el(ctx, 0, r * 0.88, r * 0.72, r * 0.2);
  f(ctx, 'rgba(0,0,0,0.3)');
}
function hex(flash, normal) { return flash ? '#ffffff' : normal; }

function glow(ctx, color, blur, drawFn) {
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
  drawFn();
  ctx.shadowBlur  = 0;
  ctx.shadowColor = 'transparent';
}

// ============================================================
// SPACE MARINE  (player, r ≈ 14)
// Ultramarines deep blue · huge pauldrons · green visor · bolter
// ============================================================
export function drawSpaceMarine(ctx, r, flash) {
  const s  = r * 1.7;
  const lw = Math.max(1.5, s * 0.055);
  const F  = (c) => hex(flash, c);

  shadow(ctx, r);

  // ── Legs ──────────────────────────────────────────────────
  rc(ctx,  s * 0.04, s * 0.32, s * 0.28, s * 0.50, 4);
  fo(ctx, F('#082070'), lw);
  rc(ctx, -s * 0.30, s * 0.36, s * 0.22, s * 0.44, 4);
  fo(ctx, F('#071a58'), lw);

  // knee pads
  if (!flash) {
    rc(ctx,  s * 0.04, s * 0.44, s * 0.28, s * 0.09, 2);
    fo(ctx, '#c9a227', 1);
    rc(ctx, -s * 0.30, s * 0.46, s * 0.22, s * 0.08, 2);
    fo(ctx, '#c9a227', 1);
  }

  // boots
  rc(ctx,  s * 0.02, s * 0.76, s * 0.32, s * 0.18, 4);
  fo(ctx, F('#050e30'), lw);
  rc(ctx, -s * 0.32, s * 0.76, s * 0.24, s * 0.15, 4);
  fo(ctx, F('#050e30'), lw);

  // ── Torso ─────────────────────────────────────────────────
  rc(ctx, -s * 0.36, -s * 0.32, s * 0.72, s * 0.68, 6);
  fo(ctx, F('#0a2fa8'), lw);

  // chest aquila (gold eagle, simplified)
  if (!flash) {
    ctx.fillStyle = '#c9a227';
    // left wing
    ctx.beginPath();
    ctx.moveTo(-s*0.05, -s*0.08);
    ctx.bezierCurveTo(-s*0.2, -s*0.2, -s*0.32, -s*0.1, -s*0.22, s*0.02);
    ctx.closePath(); f(ctx, '#c9a227');
    // right wing
    ctx.beginPath();
    ctx.moveTo( s*0.05, -s*0.08);
    ctx.bezierCurveTo( s*0.2, -s*0.2,  s*0.32, -s*0.1,  s*0.22, s*0.02);
    ctx.closePath(); f(ctx, '#c9a227');
    // body of eagle
    el(ctx, 0, -s*0.07, s*0.07, s*0.1); f(ctx, '#c9a227');
  }

  // ── Back arm (left, partially hidden behind torso) ────────
  rc(ctx, -s * 0.46, -s * 0.26, s * 0.16, s * 0.44, 4);
  fo(ctx, F('#071a58'), lw);

  // ── Front arm (right) ─────────────────────────────────────
  rc(ctx,  s * 0.36, -s * 0.30, s * 0.22, s * 0.44, 5);
  fo(ctx, F('#071a58'), lw);

  // ── BOLTER ────────────────────────────────────────────────
  // gun body
  rc(ctx,  s * 0.30, -s * 0.40, s * 0.26, s * 0.22, 3);
  fo(ctx, F('#151515'), lw * 0.8);
  // barrel extending right
  rc(ctx,  s * 0.52, -s * 0.34, s * 0.32, s * 0.10, 2);
  fo(ctx, F('#0d0d0d'), lw * 0.7);
  // magazine
  rc(ctx,  s * 0.34, -s * 0.18, s * 0.12, s * 0.14, 2);
  fo(ctx, F('#1a1a1a'), lw * 0.6);
  if (!flash) {
    // gold trim on gun
    rc(ctx, s * 0.30, -s * 0.40, s * 0.06, s * 0.22, 2);
    f(ctx, '#c9a227');
  }

  // ── LEFT PAULDRON — the #1 iconic Space Marine feature ────
  // large dome — extends far left
  el(ctx, -s * 0.50, -s * 0.26, s * 0.30, s * 0.28);
  fo(ctx, F('#0a2fa8'), lw * 1.2, hex(flash, '#c9a227'));

  // highlight stripe
  if (!flash) {
    ctx.globalAlpha = 0.4;
    el(ctx, -s * 0.52, -s * 0.32, s * 0.14, s * 0.1); f(ctx, '#ffffff');
    ctx.globalAlpha = 1.0;
    // Ultramarines inverted-U symbol
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = lw * 0.8;
    ctx.beginPath();
    ctx.arc(-s * 0.50, -s * 0.22, s * 0.15, Math.PI, 0, false);
    ctx.stroke();
  }

  // ── RIGHT PAULDRON (front-facing, smaller) ────────────────
  el(ctx,  s * 0.42, -s * 0.26, s * 0.22, s * 0.20);
  fo(ctx, F('#0a2fa8'), lw, hex(flash, '#c9a227'));

  // ── HELMET ────────────────────────────────────────────────
  // dome (round, sits high)
  el(ctx, -s * 0.06, -s * 0.60, s * 0.26, s * 0.30);
  fo(ctx, F('#0a2fa8'), lw);
  // face plate (slightly forward)
  rc(ctx, -s * 0.22, -s * 0.72, s * 0.34, s * 0.36, 5);
  fo(ctx, F('#0930b0'), lw);
  // gold helmet rim
  if (!flash) {
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = lw * 0.9;
    ctx.beginPath();
    ctx.arc(-s * 0.06, -s * 0.60, s * 0.30, -Math.PI * 0.85, Math.PI * 0.1);
    ctx.stroke();
  }

  // ── VISOR — glowing green slit, THE most iconic feature ───
  glow(ctx, '#00ff88', flash ? 0 : 14, () => {
    rc(ctx, -s * 0.20, -s * 0.64, s * 0.32, s * 0.11, 3);
    fo(ctx, F('#00ff88'), 1, '#004422');
  });

  // chin/nose piece below visor
  if (!flash) {
    rc(ctx, -s * 0.17, -s * 0.52, s * 0.24, s * 0.15, 3);
    fo(ctx, '#041640', 1);
    // vent dots
    ctx.fillStyle = '#0a2060';
    el(ctx, -s*0.10, -s*0.47, s*0.03, s*0.03); f(ctx, '#0a2060');
    el(ctx, -s*0.03, -s*0.47, s*0.03, s*0.03); f(ctx, '#0a2060');
  }
}

// ============================================================
// HORMAGAUNT  (r ≈ 8)
// Crouching alien · forward scythe blade · red eye · swept tail
// Colours: deep purple chitin · bone-ivory blades
// ============================================================
export function drawHormagaunt(ctx, r, flash) {
  const s  = r * 2.0;
  const lw = Math.max(1.2, s * 0.06);
  const F  = (c) => hex(flash, c);

  shadow(ctx, r);

  // ── Tail (sweeps back and up) ──────────────────────────────
  ctx.strokeStyle = F('#3d1050'); ctx.lineWidth = s * 0.13; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.10, s * 0.12);
  ctx.bezierCurveTo(-s * 0.50,  s * 0.00, -s * 0.68, -s * 0.32, -s * 0.54, -s * 0.60);
  ctx.stroke();
  // tail spike
  tri(ctx, -s*0.58, -s*0.56, -s*0.48, -s*0.70, -s*0.42, -s*0.54);
  fo(ctx, F('#c4b870'), 1);

  // ── Hind legs ─────────────────────────────────────────────
  ctx.strokeStyle = F('#2a0838'); ctx.lineWidth = s * 0.11;
  ctx.beginPath();
  ctx.moveTo(-s*0.10, s*0.22); ctx.lineTo(-s*0.30, s*0.60); ctx.lineTo(-s*0.16, s*0.82);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo( s*0.08, s*0.22); ctx.lineTo( s*0.26, s*0.58); ctx.lineTo( s*0.12, s*0.80);
  ctx.stroke();
  // toe claws
  el(ctx, -s*0.16, s*0.83, s*0.08, s*0.04); fo(ctx, F('#c4b870'), 1);
  el(ctx,  s*0.12, s*0.81, s*0.08, s*0.04); fo(ctx, F('#c4b870'), 1);

  // ── Body (large oval abdomen) ──────────────────────────────
  el(ctx, -s*0.04, s*0.10, s*0.30, s*0.36);
  fo(ctx, F('#3d1050'), lw);
  // highlight ridge
  el(ctx, -s*0.02, s*0.04, s*0.18, s*0.20);
  fo(ctx, F('#5a2072'), lw * 0.5);

  // ── Thorax (chest, raised) ─────────────────────────────────
  el(ctx, s*0.10, -s*0.12, s*0.22, s*0.26);
  fo(ctx, F('#3d1050'), lw);

  // ── Secondary small arm (folded) ──────────────────────────
  ctx.strokeStyle = F('#3d1050'); ctx.lineWidth = s * 0.09;
  ctx.beginPath();
  ctx.moveTo(s*0.14, -s*0.16); ctx.lineTo(s*0.34, -s*0.38); ctx.stroke();
  el(ctx, s*0.36, -s*0.40, s*0.08, s*0.06); fo(ctx, F('#c4b870'), 1);

  // ── Main SCYTHE ARM — forward and dominant ─────────────────
  ctx.strokeStyle = F('#3d1050'); ctx.lineWidth = s * 0.13;
  ctx.beginPath();
  ctx.moveTo(s*0.16, -s*0.20); ctx.lineTo(s*0.54, -s*0.56); ctx.stroke();
  // scythe blade (large crescent)
  ctx.beginPath();
  ctx.moveTo(s*0.44, -s*0.68);
  ctx.bezierCurveTo(s*0.86, -s*0.62, s*0.92, -s*0.18, s*0.66, -s*0.10);
  ctx.bezierCurveTo(s*0.76, -s*0.28, s*0.72, -s*0.52, s*0.50, -s*0.56);
  ctx.closePath();
  fo(ctx, F('#d4c870'), lw * 0.8);
  if (!flash) {
    // blade edge highlight
    ctx.strokeStyle = '#a09040'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s*0.46, -s*0.68); ctx.bezierCurveTo(s*0.88, -s*0.60, s*0.90, -s*0.20, s*0.66, -s*0.10);
    ctx.stroke();
  }

  // ── Neck ──────────────────────────────────────────────────
  rc(ctx, s*0.12, -s*0.32, s*0.12, s*0.22, 3);
  fo(ctx, F('#3d1050'), lw * 0.7);

  // ── Head (elongated alien skull) ──────────────────────────
  el(ctx, s*0.22, -s*0.52, s*0.16, s*0.22);
  fo(ctx, F('#3d1050'), lw);
  // skull crest (goes back)
  ctx.beginPath();
  ctx.moveTo(s*0.10, -s*0.66);
  ctx.bezierCurveTo(-s*0.08, -s*0.64, -s*0.10, -s*0.44, s*0.10, -s*0.38);
  ctx.lineTo(s*0.12, -s*0.38); ctx.closePath();
  fo(ctx, F('#2a0838'), lw * 0.7);
  // snout
  rc(ctx, s*0.24, -s*0.48, s*0.22, s*0.10, 2);
  fo(ctx, F('#2a0838'), lw * 0.6);
  // tiny teeth
  if (!flash) {
    ctx.fillStyle = '#d0c070';
    for (let i = 0; i < 3; i++) {
      tri(ctx,
        s*(0.26+i*0.06), -s*0.45,
        s*(0.30+i*0.06), -s*0.38,
        s*(0.34+i*0.06), -s*0.45);
      f(ctx, '#d0c070');
    }
  }
  // glowing red eye
  glow(ctx, '#ff0000', flash ? 0 : 10, () => {
    el(ctx, s*0.16, -s*0.52, s*0.06, s*0.06);
    fo(ctx, F('#ff1010'), 1, '#880000');
  });
  el(ctx, s*0.16, -s*0.52, s*0.025, s*0.025); f(ctx, '#000');
}

// ============================================================
// ORK BOY  (r ≈ 13)
// HUGE head · choppa raised · bright green · hunched
// ============================================================
export function drawOrkBoy(ctx, r, flash) {
  const s  = r * 1.65;
  const lw = Math.max(1.5, s * 0.058);
  const F  = (c) => hex(flash, c);

  shadow(ctx, r);

  // ── Boots ─────────────────────────────────────────────────
  rc(ctx,  s*0.06, s*0.68, s*0.32, s*0.24, 4);
  fo(ctx, F('#111120'), lw);
  rc(ctx, -s*0.30, s*0.68, s*0.26, s*0.20, 4);
  fo(ctx, F('#111120'), lw);

  // ── Legs (thick) ──────────────────────────────────────────
  rc(ctx,  s*0.06, s*0.30, s*0.28, s*0.42, 4);
  fo(ctx, F('#2a5018'), lw);
  rc(ctx, -s*0.30, s*0.30, s*0.24, s*0.36, 4);
  fo(ctx, F('#243e14'), lw);

  // ── Left arm (back, meaty fist) ───────────────────────────
  rc(ctx, -s*0.50, -s*0.22, s*0.24, s*0.50, 5);
  fo(ctx, F('#3a7020'), lw);
  el(ctx, -s*0.38, s*0.26, s*0.14, s*0.12);
  fo(ctx, F('#2e5c18'), lw * 0.7);

  // ── Barrel chest ──────────────────────────────────────────
  el(ctx, 0, s*0.06, s*0.44, s*0.46);
  fo(ctx, F('#3a7020'), lw);
  // scrap armour plate (dark)
  rc(ctx, -s*0.32, -s*0.20, s*0.44, s*0.28, 3);
  fo(ctx, F('#222232'), lw * 0.8);
  rc(ctx, s*0.06, -s*0.08, s*0.24, s*0.20, 3);
  fo(ctx, F('#1e1e2e'), lw * 0.7);
  if (!flash) {
    // rivets
    ctx.fillStyle = '#6a6a8a';
    el(ctx, -s*0.28, -s*0.10, s*0.04, s*0.04); f(ctx, '#6a6a8a');
    el(ctx, -s*0.12, -s*0.10, s*0.04, s*0.04); f(ctx, '#6a6a8a');
    el(ctx,  s*0.20, -s*0.02, s*0.04, s*0.04); f(ctx, '#6a6a8a');
  }

  // ── Right arm + CHOPPA raised ─────────────────────────────
  rc(ctx, s*0.34, -s*0.42, s*0.28, s*0.52, 5);
  fo(ctx, F('#3a7020'), lw);
  rc(ctx, s*0.30, -s*0.02, s*0.24, s*0.34, 4);
  fo(ctx, F('#2e5c18'), lw);

  // choppa blade — large rusty cleaver
  ctx.beginPath();
  ctx.moveTo(s*0.38, -s*0.54);
  ctx.lineTo(s*0.72, -s*0.90);
  ctx.lineTo(s*0.86, -s*0.52);
  ctx.lineTo(s*0.52, -s*0.40);
  ctx.closePath();
  fo(ctx, F('#7a3a10'), lw * 0.8);
  // blade shiny edge
  if (!flash) {
    ctx.beginPath();
    ctx.moveTo(s*0.70, -s*0.88); ctx.lineTo(s*0.86, -s*0.54);
    ctx.lineTo(s*0.82, -s*0.52); ctx.lineTo(s*0.66, -s*0.86);
    ctx.closePath(); f(ctx, '#c0c0c8');
    // handle
    rc(ctx, s*0.40, -s*0.54, s*0.08, s*0.28, 2);
    fo(ctx, '#3a2010', 1);
    rc(ctx, s*0.38, -s*0.40, s*0.10, s*0.05, 1);
    f(ctx, '#8a6040');
  }

  // ── THE HUGE ORK HEAD ─────────────────────────────────────
  // main skull (big, forward-leaning)
  el(ctx, s*0.04, -s*0.60, s*0.40, s*0.40);
  fo(ctx, F('#4a8a28'), lw * 1.1);
  // heavy brow ridge
  rc(ctx, -s*0.30, -s*0.86, s*0.62, s*0.16, 4);
  fo(ctx, F('#2a5018'), lw);
  // ear lump
  el(ctx, -s*0.38, -s*0.60, s*0.10, s*0.13);
  fo(ctx, F('#3a7020'), lw * 0.7);
  // lower jaw
  rc(ctx, -s*0.20, -s*0.42, s*0.54, s*0.26, 4);
  fo(ctx, F('#3e7822'), lw);
  // nostrils
  if (!flash) {
    el(ctx, s*0.10, -s*0.52, s*0.08, s*0.06); f(ctx, '#1e5010');
    el(ctx, s*0.24, -s*0.52, s*0.08, s*0.06); f(ctx, '#1e5010');
  }
  // TUSKS — big, jutting forward
  tri(ctx, s*0.22, -s*0.36, s*0.50, -s*0.04, s*0.28, -s*0.10);
  fo(ctx, F('#e0d090'), lw * 0.8);
  tri(ctx, s*0.04, -s*0.34, s*0.28, -s*0.08, s*0.14, -s*0.12);
  fo(ctx, F('#d4c880'), lw * 0.7);

  // RED EYE
  glow(ctx, '#ff3000', flash ? 0 : 8, () => {
    el(ctx, s*0.12, -s*0.62, s*0.10, s*0.10);
    fo(ctx, F('#ff3020'), 1, '#881800');
  });
  el(ctx, s*0.12, -s*0.62, s*0.04, s*0.04); f(ctx, '#050505');
}

// ============================================================
// TYRANID WARRIOR  (r ≈ 17)
// Tall · elongated Xenomorph head · huge scythe arm · running
// Colours: dark purple carapace · bone talons · cyan eyes
// ============================================================
export function drawTyranidWarrior(ctx, r, flash) {
  const s  = r * 1.50;
  const lw = Math.max(1.5, s * 0.055);
  const F  = (c) => hex(flash, c);

  shadow(ctx, r);

  // ── Back leg ──────────────────────────────────────────────
  ctx.strokeStyle = F('#12081e'); ctx.lineWidth = s * 0.14; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s*0.14, s*0.26); ctx.lineTo(-s*0.32, s*0.64); ctx.lineTo(-s*0.14, s*0.90);
  ctx.stroke();
  el(ctx, -s*0.14, s*0.91, s*0.10, s*0.06); fo(ctx, F('#c8b870'), 1);

  // ── Front leg ─────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(s*0.14, s*0.26); ctx.lineTo(s*0.32, s*0.64); ctx.lineTo(s*0.16, s*0.90);
  ctx.stroke();
  el(ctx, s*0.16, s*0.91, s*0.10, s*0.06); fo(ctx, F('#c8b870'), 1);

  // ── Body ──────────────────────────────────────────────────
  el(ctx, -s*0.02, s*0.26, s*0.26, s*0.36);
  fo(ctx, F('#2d1245'), lw);
  // fleshy underbelly
  rc(ctx, -s*0.16, s*0.18, s*0.32, s*0.32, 4);
  fo(ctx, F('#5a1a30'), lw * 0.7);

  // torso
  el(ctx, s*0.04, -s*0.10, s*0.28, s*0.42);
  fo(ctx, F('#1a0a28'), lw);
  // carapace plates on back
  el(ctx, -s*0.06, -s*0.20, s*0.20, s*0.28);
  fo(ctx, F('#4a2068'), lw * 0.7);
  // spine bumps
  if (!flash) {
    ctx.fillStyle = '#6a3888';
    for (let i = 0; i < 4; i++) {
      el(ctx, -s*0.10, -s*0.40 + i*s*0.14, s*0.07, s*0.07); f(ctx, '#6a3888');
    }
  }

  // ── Back scythe arm (folded) ───────────────────────────────
  ctx.strokeStyle = F('#1a0a28'); ctx.lineWidth = s * 0.10;
  ctx.beginPath();
  ctx.moveTo(-s*0.12, -s*0.18); ctx.lineTo(-s*0.40, -s*0.46); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-s*0.32, -s*0.56);
  ctx.bezierCurveTo(-s*0.68, -s*0.54, -s*0.70, -s*0.20, -s*0.50, -s*0.04);
  ctx.bezierCurveTo(-s*0.56, -s*0.24, -s*0.52, -s*0.46, -s*0.28, -s*0.46);
  ctx.closePath();
  fo(ctx, F('#c8b870'), lw * 0.7);

  // ── MAIN SCYTHE ARM ───────────────────────────────────────
  ctx.strokeStyle = F('#1a0a28'); ctx.lineWidth = s * 0.14;
  ctx.beginPath();
  ctx.moveTo(s*0.18, -s*0.20); ctx.lineTo(s*0.54, -s*0.62); ctx.stroke();
  // big blade
  ctx.beginPath();
  ctx.moveTo(s*0.44, -s*0.74);
  ctx.bezierCurveTo(s*0.90, -s*0.70, s*0.98, -s*0.24, s*0.72, -s*0.08);
  ctx.bezierCurveTo(s*0.82, -s*0.30, s*0.76, -s*0.60, s*0.50, -s*0.62);
  ctx.closePath();
  fo(ctx, F('#d0c888'), lw * 0.8);
  if (!flash) {
    ctx.strokeStyle = '#908030'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(s*0.48, -s*0.74);
    ctx.bezierCurveTo(s*0.92, -s*0.68, s*0.94, -s*0.26, s*0.72, -s*0.10);
    ctx.stroke();
  }

  // ── Neck ──────────────────────────────────────────────────
  rc(ctx, s*0.08, -s*0.44, s*0.14, s*0.28, 3);
  fo(ctx, F('#1a0a28'), lw * 0.8);

  // ── HEAD — elongated Xenomorph skull ──────────────────────
  el(ctx, s*0.18, -s*0.58, s*0.22, s*0.28);
  fo(ctx, F('#1a0a28'), lw);
  // skull crest extending back
  ctx.beginPath();
  ctx.moveTo(s*0.04, -s*0.78);
  ctx.bezierCurveTo(-s*0.22, -s*0.76, -s*0.26, -s*0.50, s*0.02, -s*0.40);
  ctx.lineTo(s*0.04, -s*0.40); ctx.closePath();
  fo(ctx, F('#12081e'), lw * 0.8);
  // upper jaw
  rc(ctx, s*0.12, -s*0.44, s*0.32, s*0.12, 3);
  fo(ctx, F('#2a1040'), lw * 0.7);
  // lower jaw / mandibles
  ctx.beginPath();
  ctx.moveTo(s*0.14, -s*0.40); ctx.lineTo(s*0.46, -s*0.22);
  ctx.lineTo(s*0.40, -s*0.18); ctx.lineTo(s*0.08, -s*0.36);
  ctx.closePath();
  fo(ctx, F('#3a1828'), lw * 0.7);
  // teeth
  if (!flash) {
    for (let i = 0; i < 3; i++) {
      tri(ctx,
        s*(0.18+i*0.08), -s*0.40,
        s*(0.22+i*0.08), -s*0.30,
        s*(0.26+i*0.08), -s*0.40);
      f(ctx, '#d0c080');
    }
  }
  // CYAN EYES
  glow(ctx, '#00ccff', flash ? 0 : 14, () => {
    el(ctx, s*0.10, -s*0.60, s*0.07, s*0.06);
    fo(ctx, F('#00ddff'), 1, '#004488');
  });
  el(ctx, s*0.10, -s*0.60, s*0.03, s*0.03); f(ctx, '#000');
}

// ============================================================
// CARNIFEX  boss  (r ≈ 34)
// Massive quadruped · bone crushing-claws · open maw · boss aura
// Colours: obsidian body · violet carapace · bone claws
// ============================================================
export function drawCarnifex(ctx, r, flash) {
  const s  = r * 1.32;
  const lw = Math.max(2, s * 0.05);
  const F  = (c) => hex(flash, c);

  // purple boss aura
  if (!flash) {
    const p = 0.40 + 0.20 * Math.sin(Date.now() * 0.004);
    const g = ctx.createRadialGradient(0, 0, s*0.3, 0, 0, s*1.5);
    g.addColorStop(0, `rgba(130,0,210,${p*0.45})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; el(ctx, 0, 0, s*1.5, s*1.5); f(ctx, g);
  }
  shadow(ctx, r);

  // ── Hind legs ─────────────────────────────────────────────
  ctx.strokeStyle = F('#1a0830'); ctx.lineWidth = s*0.22; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s*0.52, s*0.32); ctx.lineTo(-s*0.66, s*0.72); ctx.lineTo(-s*0.44, s*0.94);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-s*0.12, s*0.38); ctx.lineTo(-s*0.16, s*0.78); ctx.lineTo( s*0.04, s*0.96);
  ctx.stroke();
  el(ctx, -s*0.44, s*0.95, s*0.18, s*0.10); fo(ctx, F('#c0a860'), lw*0.6);
  el(ctx,  s*0.04, s*0.97, s*0.18, s*0.10); fo(ctx, F('#c0a860'), lw*0.6);

  // ── Massive body ──────────────────────────────────────────
  el(ctx, -s*0.06, s*0.08, s*0.62, s*0.60);
  fo(ctx, F('#120820'), lw);
  // carapace dome
  el(ctx, -s*0.10, -s*0.20, s*0.48, s*0.42);
  fo(ctx, F('#8030c0'), lw);
  el(ctx, -s*0.08, -s*0.30, s*0.30, s*0.24);
  fo(ctx, F('#a040d8'), lw * 0.7);
  // fleshy belly
  rc(ctx, -s*0.28, s*0.08, s*0.38, s*0.50, 6);
  fo(ctx, F('#5a1828'), lw * 0.8);
  // spine spikes
  ctx.fillStyle = F('#c8b060');
  for (let i = 0; i < 5; i++) {
    const bx = -s*0.54 + i*s*0.18;
    const by = -s*0.48 - i*s*0.04;
    tri(ctx, bx, by, bx-s*0.07, by+s*0.18, bx+s*0.07, by+s*0.18);
    f(ctx, F('#c8b060'));
  }

  // ── Front crushing-claw arm ───────────────────────────────
  ctx.strokeStyle = F('#1a0830'); ctx.lineWidth = s * 0.20;
  ctx.beginPath();
  ctx.moveTo(s*0.36, s*0.12); ctx.lineTo(s*0.72, -s*0.24); ctx.stroke();
  // upper claw blade
  ctx.beginPath();
  ctx.moveTo(s*0.62, -s*0.40);
  ctx.bezierCurveTo(s*1.02, -s*0.44, s*1.10, -s*0.08, s*0.88, s*0.10);
  ctx.bezierCurveTo(s*0.94, -s*0.10, s*0.90, -s*0.36, s*0.66, -s*0.32);
  ctx.closePath();
  fo(ctx, F('#c8b060'), lw);
  // lower claw blade
  ctx.beginPath();
  ctx.moveTo(s*0.64, -s*0.32);
  ctx.bezierCurveTo(s*0.90, -s*0.22, s*0.96, s*0.08, s*0.78, s*0.20);
  ctx.bezierCurveTo(s*0.88, s*0.06, s*0.82, -s*0.18, s*0.66, -s*0.20);
  ctx.closePath();
  fo(ctx, F('#b0a050'), lw * 0.8);
  // secondary front leg
  ctx.strokeStyle = F('#120820'); ctx.lineWidth = s*0.16;
  ctx.beginPath();
  ctx.moveTo(s*0.22, s*0.16); ctx.lineTo(s*0.52, -s*0.12); ctx.stroke();

  // ── Head — open maw ───────────────────────────────────────
  el(ctx, s*0.26, -s*0.46, s*0.36, s*0.32);
  fo(ctx, F('#120820'), lw);
  el(ctx, s*0.18, -s*0.56, s*0.28, s*0.22);
  fo(ctx, F('#2a1045'), lw * 0.8);
  // open jaw
  ctx.beginPath();
  ctx.moveTo(s*0.02, -s*0.40); ctx.lineTo(s*0.54, -s*0.38);
  ctx.bezierCurveTo(s*0.62, -s*0.18, s*0.50, -s*0.04, s*0.20, -s*0.08);
  ctx.closePath();
  fo(ctx, F('#3a1828'), lw * 0.8);
  // teeth rows (top + bottom)
  if (!flash) {
    ctx.fillStyle = '#d0c070';
    for (let i = 0; i < 5; i++) {
      tri(ctx, s*(0.06+i*0.09),-s*0.39, s*(0.10+i*0.09),-s*0.28, s*(0.14+i*0.09),-s*0.39);
      f(ctx, '#d0c070');
      tri(ctx, s*(0.06+i*0.09),-s*0.09, s*(0.10+i*0.09),-s*0.20, s*(0.14+i*0.09),-s*0.09);
      f(ctx, '#d0c070');
    }
  }
  // skull crest
  ctx.beginPath();
  ctx.moveTo(s*0.02, -s*0.76);
  ctx.bezierCurveTo(-s*0.16, -s*0.74, -s*0.24, -s*0.50, s*0.02, -s*0.40);
  ctx.lineTo(s*0.06, -s*0.40); ctx.closePath();
  fo(ctx, F('#120820'), lw * 0.8);
  // burning eyes
  glow(ctx, '#ff2000', flash ? 0 : 18, () => {
    el(ctx, s*0.12, -s*0.52, s*0.10, s*0.10);
    fo(ctx, F('#ff2000'), 1, '#880000');
  });
  el(ctx, s*0.12, -s*0.52, s*0.04, s*0.04); f(ctx, '#300');
}

// ============================================================
// WARBOSS  boss  (r ≈ 38)
// Enormous Ork · power klaw · horned mega-armour · glowing eyes
// Colours: dark green · iron mega-armour · yellow hazard · power klaw blue
// ============================================================
export function drawWarboss(ctx, r, flash) {
  const s  = r * 1.26;
  const lw = Math.max(2, s * 0.05);
  const F  = (c) => hex(flash, c);

  // green boss aura
  if (!flash) {
    const p = 0.40 + 0.20 * Math.sin(Date.now() * 0.004);
    const g = ctx.createRadialGradient(0, 0, s*0.3, 0, 0, s*1.48);
    g.addColorStop(0, `rgba(60,140,10,${p*0.45})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; el(ctx, 0, 0, s*1.48, s*1.48); f(ctx, g);
  }
  shadow(ctx, r);

  // ── Boots ─────────────────────────────────────────────────
  rc(ctx,  s*0.08, s*0.72, s*0.40, s*0.28, 5);
  fo(ctx, F('#111120'), lw);
  rc(ctx, -s*0.40, s*0.72, s*0.32, s*0.24, 5);
  fo(ctx, F('#111120'), lw);

  // ── Legs ──────────────────────────────────────────────────
  rc(ctx,  s*0.10, s*0.28, s*0.36, s*0.48, 5);
  fo(ctx, F('#1e4a0a'), lw);
  rc(ctx, -s*0.40, s*0.28, s*0.30, s*0.42, 5);
  fo(ctx, F('#1a3e08'), lw);

  // ── Left arm (meaty, back) ────────────────────────────────
  rc(ctx, -s*0.54, -s*0.24, s*0.26, s*0.58, 6);
  fo(ctx, F('#2a6010'), lw);
  // knuckle plate
  rc(ctx, -s*0.54, s*0.24, s*0.26, s*0.18, 3);
  fo(ctx, F('#1e1e2e'), lw * 0.8);
  if (!flash) {
    ctx.fillStyle = '#808098';
    for (let i = 0; i < 3; i++) {
      el(ctx, -s*0.50+i*s*0.09, s*0.30, s*0.04, s*0.04); f(ctx, '#808098');
    }
  }

  // ── Massive torso ─────────────────────────────────────────
  el(ctx, 0, s*0.04, s*0.54, s*0.58);
  fo(ctx, F('#2a6010'), lw);
  // mega-armour front plate
  rc(ctx, -s*0.42, -s*0.26, s*0.84, s*0.52, 7);
  fo(ctx, F('#1e1e2e'), lw);
  // yellow + black hazard stripes
  if (!flash) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(-s*0.42, -s*0.26, s*0.84, s*0.52);
    ctx.clip();
    ctx.fillStyle = '#d4a000';
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(-s*0.52 + i*s*0.24, -s*0.30);
      ctx.rotate(0.52);
      rc(ctx, 0, 0, s*0.14, s*0.60, 0); f(ctx, '#d4a000');
      ctx.restore();
    }
    ctx.fillStyle = '#181828';
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(-s*0.52 + i*s*0.24 + s*0.06, -s*0.30);
      ctx.rotate(0.52);
      rc(ctx, 0, 0, s*0.08, s*0.60, 0); f(ctx, '#181828');
      ctx.restore();
    }
    ctx.restore();
    // armour edge outline
    rc(ctx, -s*0.42, -s*0.26, s*0.84, s*0.52, 7);
    o(ctx, lw, '#444');
    // rivets
    ctx.fillStyle = '#8888a0';
    [[-s*0.38,-s*0.22],[s*0.38,-s*0.22],[-s*0.38,s*0.22],[s*0.38,s*0.22]].forEach(([x,y])=>{
      el(ctx, x, y, s*0.05, s*0.05); f(ctx, '#8888a0');
    });
  }

  // ── POWER KLAW ARM ────────────────────────────────────────
  // heavy mechanical arm housing
  rc(ctx, s*0.46, -s*0.48, s*0.58, s*0.66, 9);
  fo(ctx, F('#252535'), lw);
  // hydraulics
  if (!flash) {
    rc(ctx, s*0.50, -s*0.44, s*0.50, s*0.11, 3); f(ctx, '#d4a000');
    rc(ctx, s*0.54, -s*0.28, s*0.42, s*0.09, 2); f(ctx, '#aa2200');
    rc(ctx, s*0.50, -s*0.14, s*0.50, s*0.09, 2); f(ctx, '#505060');
  }
  // THREE KLAW FINGERS
  for (let i = 0; i < 3; i++) {
    const ky = -s*0.58 + i*s*0.20;
    ctx.beginPath();
    ctx.moveTo(s*1.00, ky);
    ctx.lineTo(s*1.34, ky + s*0.07);
    ctx.lineTo(s*1.28, ky + s*0.16);
    ctx.lineTo(s*0.98, ky + s*0.12);
    ctx.closePath();
    fo(ctx, F('#9090b0'), lw * 0.7);
    // power field glow on tip
    if (!flash) {
      glow(ctx, '#4488ff', 8, () => {
        el(ctx, s*1.32, ky + s*0.09, s*0.05, s*0.05);
        f(ctx, '#aaccff');
      });
    }
  }

  // ── HEAD — enormous with horned mega-helmet ────────────────
  rc(ctx, -s*0.40, -s*0.92, s*0.88, s*0.72, 10);
  fo(ctx, F('#1a1a2a'), lw);
  // HORNS (unmistakeable Warboss silhouette)
  tri(ctx, -s*0.38, -s*0.92, -s*0.58, -s*1.30, -s*0.14, -s*0.92);
  fo(ctx, F('#2e2e42'), lw);
  tri(ctx,  s*0.28, -s*0.92,  s*0.48, -s*1.24,  s*0.04, -s*0.92);
  fo(ctx, F('#2e2e42'), lw);
  // skull icon on helmet (gold)
  if (!flash) {
    el(ctx, s*0.04, -s*0.66, s*0.14, s*0.14); fo(ctx, '#c8b060', 1);
    el(ctx, -s*0.04, -s*0.62, s*0.05, s*0.06); f(ctx, '#181828');
    el(ctx,  s*0.10, -s*0.62, s*0.05, s*0.06); f(ctx, '#181828');
    rc(ctx, -s*0.05, -s*0.55, s*0.14, s*0.04, 2); f(ctx, '#181828');
  }
  // green skin face
  rc(ctx, -s*0.30, -s*0.56, s*0.74, s*0.42, 5);
  fo(ctx, F('#3a7020'), lw);
  // heavy brow
  rc(ctx, -s*0.30, -s*0.60, s*0.74, s*0.13, 4);
  fo(ctx, F('#1e4a0a'), lw);
  // TUSKS
  tri(ctx,  s*0.22, -s*0.38,  s*0.50, -s*0.08,  s*0.28, -s*0.12);
  fo(ctx, F('#e0d090'), lw * 0.8);
  tri(ctx,  s*0.02, -s*0.36,  s*0.28, -s*0.08,  s*0.12, -s*0.14);
  fo(ctx, F('#d4c880'), lw * 0.8);
  // BURNING ORANGE-RED EYES
  glow(ctx, '#ff4000', flash ? 0 : 16, () => {
    el(ctx, s*0.16, -s*0.46, s*0.11, s*0.11);
    fo(ctx, F('#ff4000'), 1, '#881800');
    el(ctx, -s*0.08, -s*0.46, s*0.10, s*0.10);
    fo(ctx, F('#ff3800'), 1, '#881800');
  });
  el(ctx, s*0.16, -s*0.46, s*0.04, s*0.04); f(ctx, '#0a0000');
  el(ctx, -s*0.08,-s*0.46, s*0.04, s*0.04); f(ctx, '#0a0000');
}

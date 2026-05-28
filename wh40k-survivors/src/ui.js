// ============================================================
// ui.js — HUD, Level-up screen, Menus
// ============================================================
import { WEAPONS_DATA, PASSIVES_DATA } from './data.js';
import { roundRect, formatTime, shuffle } from './engine.js';

// ============================================================
// HUD — drawn each frame during play
// ============================================================
export function drawHUD(ctx, player, gameTime, killCount, score) {
  const W = ctx.canvas.width, H = ctx.canvas.height;

  // ---- Top-left: HP bar ----
  const hpW = 220, hpH = 22;
  const hpX = 16, hpY = 16;
  // backdrop
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  roundRect(ctx, hpX-6, hpY-6, hpW+40, hpH+22, 8);
  ctx.fill();

  // bar bg
  ctx.fillStyle = '#333';
  roundRect(ctx, hpX, hpY, hpW, hpH, 4);
  ctx.fill();
  // bar fill
  const hpPct = player.hp / player.maxHp;
  const hpColor = hpPct > 0.5 ? '#27ae60' : hpPct > 0.25 ? '#f39c12' : '#e74c3c';
  ctx.fillStyle = hpColor;
  roundRect(ctx, hpX, hpY, hpW * hpPct, hpH, 4);
  ctx.fill();
  // bar shine
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  roundRect(ctx, hpX, hpY, hpW * hpPct, hpH/2, 4);
  ctx.fill();
  // label
  ctx.font = 'bold 13px "Segoe UI"';
  ctx.fillStyle = '#fff';
  ctx.fillText(`HP  ${Math.ceil(player.hp)} / ${player.maxHp}`, hpX+4, hpY+16);

  // ---- XP bar below HP ----
  const xpW = hpW, xpH = 10;
  const xpX = hpX, xpY = hpY + hpH + 8;
  ctx.fillStyle = '#222';
  roundRect(ctx, xpX, xpY, xpW, xpH, 4);
  ctx.fill();
  ctx.fillStyle = '#3498db';
  roundRect(ctx, xpX, xpY, xpW * (player.xp / player.xpToNext), xpH, 4);
  ctx.fill();
  ctx.font = '11px "Segoe UI"';
  ctx.fillStyle = '#aaa';
  ctx.fillText(`LVL ${player.level}   XP ${player.xp}/${player.xpToNext}`, xpX, xpY + xpH + 14);

  // ---- Top-centre: Timer ----
  ctx.font = 'bold 28px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillText(formatTime(gameTime), W/2+1, 34+1);
  ctx.fillStyle = '#FFD700';
  ctx.fillText(formatTime(gameTime), W/2, 34);
  ctx.textAlign = 'left';

  // ---- Top-right: kills & score ----
  ctx.font = 'bold 14px "Segoe UI"';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillText(`☠ ${killCount}  ✦ ${score}`, W-14+1, 30+1);
  ctx.fillStyle = '#ecf0f1';
  ctx.fillText(`☠ ${killCount}  ✦ ${score}`, W-14, 30);

  // ---- Pause button (touch target: top-right 90×90) ----
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  roundRect(ctx, W-58, 42, 42, 30, 6);
  ctx.fill();
  ctx.font = 'bold 16px "Segoe UI"';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('⏸', W-37, 63);
  ctx.textAlign = 'left';

  // ---- Bottom: weapon cooldown icons ----
  if (player.weapons.length > 0) {
    const iconSize = 42, gap = 8;
    const totalW = player.weapons.length * (iconSize + gap) - gap;
    const startX = (W - totalW) / 2;
    const iconY  = H - iconSize - 16;

    for (let i = 0; i < player.weapons.length; i++) {
      const w  = player.weapons[i];
      const ix = startX + i * (iconSize + gap);
      const cd = w.stats.cd;
      const t  = Math.min(w.timer / cd, 1);

      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      roundRect(ctx, ix, iconY, iconSize, iconSize, 6);
      ctx.fill();

      // CD overlay (dark)
      if (t < 1) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(ix, iconY + iconSize * t, iconSize, iconSize * (1 - t));
      }

      // Weapon colour square
      ctx.fillStyle = w.data.color;
      const pad = 8;
      ctx.fillRect(ix+pad, iconY+pad, iconSize-pad*2, iconSize-pad*2);

      // Level
      ctx.font = 'bold 10px "Segoe UI"';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(`${w.level}`, ix + iconSize - 3, iconY + iconSize - 3);

      // Border
      ctx.strokeStyle = t >= 1 ? '#fff' : '#555';
      ctx.lineWidth = 2;
      roundRect(ctx, ix, iconY, iconSize, iconSize, 6);
      ctx.stroke();
    }
    ctx.textAlign = 'left';
  }
}

// ============================================================
// Build upgrade option list for level-up screen
// ============================================================
export function buildLevelUpOptions(player) {
  const options = [];

  // Weapons: new (if slots < 6) or upgrade existing
  for (const [id, data] of Object.entries(WEAPONS_DATA)) {
    const existing = player.weapons.find(w => w.id === id);
    if (existing) {
      if (existing.level < data.maxLevel) {
        options.push({ type: 'weaponUp', id, data, currentLevel: existing.level });
      }
    } else if (player.weapons.length < 6) {
      options.push({ type: 'weaponNew', id, data });
    }
  }

  // Passives
  for (const [id, data] of Object.entries(PASSIVES_DATA)) {
    const curLvl = player.passives[id] || 0;
    if (curLvl < data.maxLevel) {
      options.push({ type: 'passive', id, data, currentLevel: curLvl });
    }
  }

  // Ensure at least 3 choices are always available (pad with recovery options)
  const FALLBACK_HEALS = [
    { type: 'heal', id: 'heal', data: { name: "Emperor's Grace", desc: "Restore 30 HP. The Emperor's mercy is upon you.",   color: '#e74c3c' }},
    { type: 'heal', id: 'heal', data: { name: 'Holy Relic',      desc: 'Restore 30 HP. A blessed artefact of the Chapter.', color: '#c0392b' }},
    { type: 'heal', id: 'heal', data: { name: 'Medicae Pack',    desc: 'Restore 30 HP. The Medicae attends to your wounds.', color: '#e91e63' }},
  ];
  let fi = 0;
  while (options.length < 3) options.push(FALLBACK_HEALS[fi++ % FALLBACK_HEALS.length]);

  shuffle(options);
  return options.slice(0, 4);
}

// ============================================================
// Card layout helper (shared with game.js for hit detection)
// ============================================================
export function getCardLayout(W, H, n) {
  const small  = W <= 700;
  const CARD_W = small ? 140 : 240;
  const CARD_H = small ? 155 : 170;
  const CARD_R = small ? 8   : 12;
  const GAP    = small ? 8   : 20;
  const totalW = n * CARD_W + (n-1) * GAP;
  const startX = (W - totalW) / 2;
  const cardY  = small ? H/2 - 65 : H/2 - 80;
  return { CARD_W, CARD_H, CARD_R, GAP, startX, cardY };
}

// ============================================================
// Level-up screen overlay
// ============================================================
export function drawLevelUpScreen(ctx, options, hoveredIdx) {
  const W = ctx.canvas.width, H = ctx.canvas.height;

  // Dim background
  ctx.fillStyle = 'rgba(0,0,10,0.78)';
  ctx.fillRect(0, 0, W, H);

  const small = W <= 700;
  const { CARD_W, CARD_H, CARD_R, GAP, startX, cardY } = getCardLayout(W, H, options.length);

  // Title banner
  ctx.font = small ? 'bold 22px "Segoe UI"' : 'bold 36px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.fillText('⚡ LEVEL UP ⚡', W/2, cardY - (small ? 50 : 80));
  ctx.shadowBlur = 0;

  ctx.font = small ? '12px "Segoe UI"' : '16px "Segoe UI"';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Choose an upgrade — Tap  /  Click  /  1-4', W/2, cardY - (small ? 20 : 45));
  ctx.textAlign = 'left';

  options.forEach((opt, i) => {
    const cx  = startX + i * (CARD_W + GAP);
    const cy  = cardY;
    const hov = i === hoveredIdx;

    // Card bg
    ctx.fillStyle = hov ? 'rgba(255,215,0,0.18)' : 'rgba(20,20,40,0.92)';
    roundRect(ctx, cx, cy, CARD_W, CARD_H, CARD_R);
    ctx.fill();

    // Card border
    ctx.strokeStyle = hov ? '#FFD700' : (opt.data.color || '#555');
    ctx.lineWidth = hov ? 3 : 1.5;
    roundRect(ctx, cx, cy, CARD_W, CARD_H, CARD_R);
    ctx.stroke();

    // Colour bar at top
    ctx.fillStyle = opt.data.color || '#888';
    roundRect(ctx, cx, cy, CARD_W, 8, CARD_R);
    ctx.fill();
    ctx.fillRect(cx, cy+CARD_R, CARD_W, 8-CARD_R);

    // Hotkey badge
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${small ? 13 : 16}px "Segoe UI"`;
    ctx.textAlign = 'center';
    ctx.fillText(`[${i+1}]`, cx + 16, cy + 28);

    // Name
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${small ? (hov ? 13 : 12) : (hov ? 17 : 16)}px "Segoe UI"`;
    ctx.fillText(opt.data.name, cx + CARD_W/2, cy + (small ? 44 : 50));

    // Subtitle
    ctx.fillStyle = '#aad';
    ctx.font = `${small ? 10 : 11}px "Segoe UI"`;
    let sub = '';
    if (opt.type === 'weaponNew')  sub = `NEW  Lv.1 / ${opt.data.maxLevel}`;
    if (opt.type === 'weaponUp')   sub = `UPGRADE  Lv.${opt.currentLevel} → ${opt.currentLevel+1}`;
    if (opt.type === 'passive')    sub = opt.currentLevel === 0 ? `NEW PASSIVE` : `PASSIVE  Lv.${opt.currentLevel} → ${opt.currentLevel+1}`;
    if (opt.type === 'heal')       sub = `RECOVERY`;
    ctx.fillText(sub, cx + CARD_W/2, cy + (small ? 60 : 70));

    // Description
    ctx.fillStyle = '#ccc';
    ctx.font = `${small ? 10 : 12}px "Segoe UI"`;
    const words = opt.data.desc.split(' ');
    let line = '', lineY = cy + (small ? 78 : 96);
    const lineH = small ? 14 : 17;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > CARD_W - 24) {
        ctx.fillText(line, cx + CARD_W/2, lineY);
        line = word; lineY += lineH;
      } else { line = test; }
    }
    if (line) ctx.fillText(line, cx + CARD_W/2, lineY);

    ctx.textAlign = 'left';
  });
}

// ============================================================
// Pause overlay
// ============================================================
export function drawPauseScreen(ctx) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);
  ctx.font = 'bold 52px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText('PAUSED', W/2, H/2 - 20);
  ctx.font = '20px "Segoe UI"';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Press ESC  or  Tap  to resume', W/2, H/2 + 30);
  ctx.textAlign = 'left';
}

// ============================================================
// Game-over screen
// ============================================================
export function drawGameOverScreen(ctx, stats) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.font = 'bold 64px "Segoe UI"';
  ctx.fillStyle = '#c0392b';
  ctx.shadowColor = '#c0392b';
  ctx.shadowBlur = 30;
  ctx.fillText('THE EMPEROR WEEPS', W/2, H/2 - 120);
  ctx.shadowBlur = 0;

  ctx.font = '22px "Segoe UI"';
  ctx.fillStyle = '#ecf0f1';
  ctx.fillText(`Time Survived: ${formatTime(stats.time)}`, W/2, H/2 - 50);
  ctx.fillText(`Enemies Slain: ${stats.kills}`, W/2, H/2 - 15);
  ctx.fillText(`Score: ${stats.score}`, W/2, H/2 + 22);
  ctx.fillText(`Level Reached: ${stats.level}`, W/2, H/2 + 58);

  ctx.font = '18px "Segoe UI"';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('Tap  or  Press ENTER  to try again', W/2, H/2 + 120);
  ctx.textAlign = 'left';
}

// ============================================================
// Title / Menu screen
// ============================================================
export function drawMenuScreen(ctx) {
  const W = ctx.canvas.width, H = ctx.canvas.height;

  // Dark background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0a0010');
  bg.addColorStop(1, '#200010');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Decorative lines
  ctx.strokeStyle = 'rgba(139,0,0,0.3)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.textAlign = 'center';

  // Aquila symbol
  ctx.font = '90px "Segoe UI"';
  ctx.fillStyle = '#8B0000';
  ctx.fillText('⚜', W/2, H/2 - 130);

  // Title
  ctx.font = 'bold 52px "Segoe UI"';
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 25;
  ctx.fillText('WH40K SURVIVORS', W/2, H/2 - 30);
  ctx.shadowBlur = 0;

  ctx.font = 'italic 20px "Segoe UI"';
  ctx.fillStyle = '#c0392b';
  ctx.fillText('"For the Emperor and the Chapter!"', W/2, H/2 + 15);

  ctx.font = '15px "Segoe UI"';
  ctx.fillStyle = '#888';
  ctx.fillText('WASD / Arrow Keys  or  Touch Joystick to move', W/2, H/2 + 60);
  ctx.fillText('Weapons fire automatically    Collect XP Gems to level up', W/2, H/2 + 82);

  // Start prompt
  const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.003);
  ctx.globalAlpha = pulse;
  ctx.font = 'bold 24px "Segoe UI"';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('Tap  or  Press ENTER  to begin', W/2, H/2 + 140);
  ctx.globalAlpha = 1;

  ctx.textAlign = 'left';
}

// ============================================================
// Boss warning flash
// ============================================================
export function drawBossWarning(ctx, timer) {
  if (timer <= 0) return;
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const alpha = Math.min(timer, 1) * (0.5 + 0.5 * Math.sin(Date.now() * 0.015));
  ctx.fillStyle = `rgba(200,0,0,${alpha * 0.18})`;
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px "Segoe UI"';
  ctx.fillStyle = `rgba(255,50,50,${alpha})`;
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 20;
  ctx.fillText('⚠ BOSS INCOMING ⚠', W/2, 80);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}

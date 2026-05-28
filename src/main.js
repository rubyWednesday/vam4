// ============================================================
// main.js — Entry point
// ============================================================
import { Game } from './game.js';
import { CANVAS } from './data.js';

const canvas = document.getElementById('game');

// Mobile: use 800×450 so everything appears larger without being too big
if (window.innerWidth < 900 || window.innerHeight < 500) {
  CANVAS.WIDTH  = 800;
  CANVAS.HEIGHT = 450;
}

// Responsive sizing: fit to window while preserving aspect ratio
function resize() {
  const aspect = CANVAS.WIDTH / CANVAS.HEIGHT;
  const maxW = window.innerWidth;
  const maxH = window.innerHeight;
  let w = maxW, h = maxW / aspect;
  if (h > maxH) { h = maxH; w = maxH * aspect; }
  canvas.style.width  = `${Math.floor(w)}px`;
  canvas.style.height = `${Math.floor(h)}px`;
}
resize();
window.addEventListener('resize', resize);

const game = new Game(canvas);
game.start();

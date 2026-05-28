// ============================================================
// main.js — Entry point
// ============================================================
import { Game } from './game.js';
import { CANVAS } from './data.js';

const canvas = document.getElementById('game');

// Mobile: use 640×360 so everything appears 2× larger on small screens
if (window.innerWidth < 900 || window.innerHeight < 500) {
  CANVAS.WIDTH  = 640;
  CANVAS.HEIGHT = 360;
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

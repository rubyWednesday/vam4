// ============================================================
// main.js — Entry point
// ============================================================
import { Game } from './game.js';

const canvas = document.getElementById('game');

// Responsive sizing: fit to window while preserving 16:9
function resize() {
  const ASPECT = 16 / 9;
  const maxW = window.innerWidth;
  const maxH = window.innerHeight;
  let w = maxW, h = maxW / ASPECT;
  if (h > maxH) { h = maxH; w = maxH * ASPECT; }
  canvas.style.width  = `${Math.floor(w)}px`;
  canvas.style.height = `${Math.floor(h)}px`;
}
resize();
window.addEventListener('resize', resize);

const game = new Game(canvas);
game.start();

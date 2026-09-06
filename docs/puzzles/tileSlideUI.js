// puzzles/tileSlideUI.js
//
// DOM + canvas wrapper around createTileSlidePuzzle. Each tile is drawn
// from its HOME cell, not its current position, so a big blue-and-white
// azulejo mosaic and a red compass star reassemble as the player solves
// it — visible, satisfying progress feedback, not just "does it match."
// Closeable any time with no penalty, per the no-dead-end rule.

import { createTileSlidePuzzle } from "./tileSlide.js";

let overlay = null;
let canvas, ctx;
let puzzle = null;
let onSolvedCb = null;
let onCloseCb = null;
let onSkipCb = null;
let cellSize = 0;
let gridPx = 0;

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function ensureDom(root) {
  if (overlay) return;
  overlay = el("div", "tileslide-overlay");
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="tileslide-card">
      <h2 class="tileslide-title"></h2>
      <p class="tileslide-flavor"></p>
      <canvas class="tileslide-canvas" width="360" height="360"></canvas>
      <div class="tileslide-status">Slide the tiles to rebuild the chart.</div>
      <div class="tileslide-buttons">
        <button class="menu-btn tileslide-close">Leave it for now</button>
        <button class="menu-btn tileslide-skip" hidden>Guess the way instead</button>
      </div>
    </div>
  `;
  root.appendChild(overlay);
  canvas = overlay.querySelector(".tileslide-canvas");
  ctx = canvas.getContext("2d");
  overlay.querySelector(".tileslide-close").addEventListener("click", () => finish(false));
  overlay.querySelector(".tileslide-skip").addEventListener("click", () => finish("skip"));
  canvas.addEventListener("click", onCanvasClick);
}

function drawAzulejoPattern(g, size, seed) {
  g.save();
  g.fillStyle = "#1c3a4a";
  g.fillRect(0, 0, size, size);
  g.strokeStyle = "#dce8ea";
  g.lineWidth = size * 0.06;
  const variants = seed % 3;
  g.beginPath();
  if (variants === 0) {
    g.arc(0, 0, size * 0.5, 0, Math.PI / 2);
    g.arc(size, size, size * 0.5, Math.PI, Math.PI * 1.5);
  } else if (variants === 1) {
    g.moveTo(size / 2, 0);
    g.lineTo(size, size / 2);
    g.lineTo(size / 2, size);
    g.lineTo(0, size / 2);
    g.closePath();
  } else {
    g.arc(size / 2, size / 2, size * 0.32, 0, Math.PI * 2);
  }
  g.stroke();
  g.restore();
}

function drawCompassStar(g, cx, cy, r) {
  g.save();
  g.translate(cx, cy);
  g.fillStyle = "rgba(178,60,45,0.85)";
  g.strokeStyle = "rgba(40,10,5,0.6)";
  g.lineWidth = 2;
  g.beginPath();
  const points = 8;
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points;
    const rad = i % 2 === 0 ? r : r * 0.38;
    const px = Math.cos(angle) * rad;
    const py = Math.sin(angle) * rad;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fill();
  g.stroke();
  g.restore();
}

function drawMural() {
  const size = puzzle.size;
  gridPx = canvas.width;
  cellSize = gridPx / size;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const tiles = puzzle.tiles;
  tiles.forEach((value, i) => {
    const r = Math.floor(i / size);
    const c = i % size;
    if (value === 0) return; // blank slot stays empty
    const home = puzzle.homeCellOf(value);
    ctx.save();
    ctx.translate(c * cellSize, r * cellSize);
    ctx.beginPath();
    ctx.rect(0, 0, cellSize, cellSize);
    ctx.clip();
    drawAzulejoPattern(ctx, cellSize, home.r * size + home.c);
    ctx.translate(-home.c * cellSize, -home.r * cellSize);
    drawCompassStar(ctx, (gridPx / 2), (gridPx / 2), gridPx * 0.38);
    ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
  });
}

function onCanvasClick(e) {
  if (!puzzle) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
  const c = Math.floor(x / cellSize);
  const r = Math.floor(y / cellSize);
  if (puzzle.tryMove(r, c)) {
    drawMural();
    if (puzzle.isSolved()) {
      overlay.querySelector(".tileslide-status").textContent = "The chart resolves — a compass, clear and whole.";
      setTimeout(() => finish(true), 500);
    }
  }
}

function finish(result) {
  if (overlay) overlay.hidden = true;
  if (result === "skip") onSkipCb?.();
  else if (result) onSolvedCb?.();
  else onCloseCb?.();
}

export function openTileSlidePuzzle(root, { title, flavor, size = 3, onSolved, onClose, onSkip, skipLabel }) {
  ensureDom(root);
  onSolvedCb = onSolved || null;
  onCloseCb = onClose || null;
  onSkipCb = onSkip || null;
  puzzle = createTileSlidePuzzle(size);
  overlay.querySelector(".tileslide-title").textContent = title || "Azulejo Chart";
  overlay.querySelector(".tileslide-flavor").textContent = flavor || "";
  overlay.querySelector(".tileslide-status").textContent = "Slide the tiles to rebuild the chart.";
  const skipBtn = overlay.querySelector(".tileslide-skip");
  skipBtn.hidden = !onSkip;
  if (onSkip) skipBtn.textContent = skipLabel || "Guess the way instead";
  overlay.hidden = false;
  drawMural();
}

export function isTileSlideOpen() {
  return !!overlay && !overlay.hidden;
}

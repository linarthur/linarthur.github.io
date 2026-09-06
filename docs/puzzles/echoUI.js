// puzzles/echoUI.js
//
// The Hypogeum's echo-timing puzzle (design doc: "clap, count the delay,
// map the chamber"). Clap, watch a ring expand out and bounce back, then
// pick the chamber whose distance matches the delay you heard AND saw —
// audio and visual carry the same information, so it works with the sound
// off. Wrong guesses just reset; there is no way to fail this puzzle.

let overlay = null;
let canvas, ctx;
let raf = null;
let clapTime = 0;
let echoTime = 0;
let running = false;
let cfg = null;
let onSolvedCb = null;
let onCloseCb = null;

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function ensureDom(root) {
  if (overlay) return;
  overlay = el("div", "echo-overlay");
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="echo-card">
      <h2 class="echo-title"></h2>
      <p class="echo-flavor"></p>
      <canvas class="echo-canvas" width="380" height="270"></canvas>
      <div class="echo-actions">
        <button class="echo-clap-btn">Clap</button>
      </div>
      <div class="echo-actions echo-chambers"></div>
      <div class="echo-status">Clap once, then count.</div>
      <button class="menu-btn echo-close">Leave it for now</button>
    </div>
  `;
  root.appendChild(overlay);
  canvas = overlay.querySelector(".echo-canvas");
  ctx = canvas.getContext("2d");
  overlay.querySelector(".echo-close").addEventListener("click", () => finish(false));
  overlay.querySelector(".echo-clap-btn").addEventListener("click", clap);
}

function tone(freq, duration, delayMs = 0) {
  const Tone = window.Tone;
  if (!Tone) return;
  setTimeout(() => {
    const osc = new Tone.Oscillator(freq, "sine").toDestination();
    osc.volume.value = -10;
    osc.start();
    osc.stop(`+${duration}`);
    setTimeout(() => osc.dispose(), (duration + 0.2) * 1000);
  }, delayMs);
}

function clap() {
  if (running) return;
  running = true;
  clapTime = performance.now();
  echoTime = clapTime + cfg.delayMs;
  tone(523, 0.15);
  tone(392, 0.25, cfg.delayMs);
  overlay.querySelector(".echo-status").textContent = "Listening...";
}

function draw(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // chamber doorways at increasing distance
  cfg.chambers.forEach((ch) => {
    ctx.save();
    ctx.strokeStyle = "rgba(217,160,102,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, ch.distance, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(232,220,196,0.7)";
    ctx.font = "12px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(ch.label, cx, cy - ch.distance - 8);
    ctx.restore();
  });

  ctx.fillStyle = "#d9a066";
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  if (running) {
    const t = now - clapTime;
    const maxR = Math.max(canvas.width, canvas.height);
    const speed = cfg.delayMs > 0 ? cfg.chambers.find((c) => c.id === cfg.correctId).distance / cfg.delayMs : 0;
    const r = Math.min(maxR, t * speed);
    ctx.strokeStyle = "rgba(93,168,176,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    if (now >= echoTime + 400 && running) {
      running = false;
      overlay.querySelector(".echo-status").textContent = "Which chamber echoed back?";
    }
  }

  raf = requestAnimationFrame(draw);
}

function pickChamber(id) {
  if (id === cfg.correctId) {
    overlay.querySelector(".echo-status").textContent = "That's the one — the sound comes straight back.";
    setTimeout(() => finish(true), 500);
  } else {
    overlay.querySelector(".echo-status").textContent = "Not quite — clap again and listen closer.";
  }
}

function finish(solved) {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  running = false;
  if (overlay) overlay.hidden = true;
  if (solved) onSolvedCb?.();
  else onCloseCb?.();
}

// chambers: [{id,label,distance}], correctId must match one chamber id,
// delayMs is how long the echo takes to "return" for the correct chamber.
export function openEchoPuzzle(root, { title, flavor, chambers, correctId, delayMs, onSolved, onClose }) {
  ensureDom(root);
  cfg = { chambers, correctId, delayMs };
  onSolvedCb = onSolved || null;
  onCloseCb = onClose || null;
  overlay.querySelector(".echo-title").textContent = title || "The Hypogeum";
  overlay.querySelector(".echo-flavor").textContent = flavor || "";
  overlay.querySelector(".echo-status").textContent = "Clap once, then count.";
  const chamberWrap = overlay.querySelector(".echo-chambers");
  chamberWrap.innerHTML = "";
  chambers.forEach((ch) => {
    const btn = el("button", "echo-chamber-btn");
    btn.textContent = ch.label;
    btn.addEventListener("click", () => pickChamber(ch.id));
    chamberWrap.appendChild(btn);
  });
  overlay.hidden = false;
  running = false;
  raf = requestAnimationFrame(draw);
}

export function isEchoOpen() {
  return !!overlay && !overlay.hidden;
}

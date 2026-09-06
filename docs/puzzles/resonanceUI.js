// puzzles/resonanceUI.js
//
// DOM + canvas + audio wiring around the pure createResonancePuzzle logic.
// Feedback is audio-first: the player hears a beat frequency between their
// tone and the target tone that slows as they tune in, per the design doc.
// The Chladni plate gives the same information visually, so the puzzle is
// solvable by ear OR by eye — required for it to work on a phone in a
// noisy room, or for a kid who just likes watching the sand.
//
// No fail state: closing the puzzle any time just leaves it unsolved.

import { createResonancePuzzle } from "./resonance.js";
import { drawChladniPlate, freqToMode } from "./chladni.js";

let overlay = null;
let canvas, ctx;
let raf = null;
let playerOsc = [];
let targetOsc = [];
let puzzle = null;
let onSolvedCb = null;
let onCloseCb = null;

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function ensureDom(root) {
  if (overlay) return;
  overlay = el("div", "resonance-overlay");
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="resonance-card">
      <h2 class="resonance-title"></h2>
      <p class="resonance-flavor"></p>
      <canvas class="resonance-canvas" width="480" height="260"></canvas>
      <div class="resonance-sliders"></div>
      <div class="resonance-status">Listening...</div>
      <button class="menu-btn resonance-close">Leave it for now</button>
    </div>
  `;
  root.appendChild(overlay);
  canvas = overlay.querySelector(".resonance-canvas");
  ctx = canvas.getContext("2d");
  overlay.querySelector(".resonance-close").addEventListener("click", () => finish(false));
}

function makeSlider(index, target, onChange) {
  const wrap = el("div", "resonance-slider-wrap");
  const input = document.createElement("input");
  input.type = "range";
  input.className = "resonance-slider";
  input.min = String(Math.round(target * 0.55));
  input.max = String(Math.round(target * 1.6));
  input.step = "1";
  input.value = String(Math.round(target * (0.55 + Math.random() * 0.9)));
  input.addEventListener("input", () => onChange(index, Number(input.value)));
  wrap.appendChild(input);
  return { wrap, input };
}

function stopOscillators() {
  [...playerOsc, ...targetOsc].forEach((o) => {
    if (!o) return;
    try {
      o.stop();
      o.dispose?.();
    } catch (e) {
      /* already stopped */
    }
  });
  playerOsc = [];
  targetOsc = [];
}

function finish(solved) {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  stopOscillators();
  if (overlay) overlay.hidden = true;
  if (solved) onSolvedCb?.();
  else onCloseCb?.();
}

export function openResonancePuzzle(root, { targets, title, flavor, onSolved, onClose }) {
  ensureDom(root);
  onSolvedCb = onSolved || null;
  onCloseCb = onClose || null;
  puzzle = createResonancePuzzle({ targets, toleranceCents: 18, sustainMs: 800 });

  overlay.querySelector(".resonance-title").textContent = title || "Resonance";
  overlay.querySelector(".resonance-flavor").textContent = flavor || "";

  const sliderWrap = overlay.querySelector(".resonance-sliders");
  sliderWrap.innerHTML = "";
  const sliders = targets.map((t, i) => {
    const s = makeSlider(i, t, (idx, freq) => {
      puzzle.setPlayerFreq(idx, freq);
      if (playerOsc[idx]) playerOsc[idx].frequency.value = freq;
    });
    sliderWrap.appendChild(s.wrap);
    puzzle.setPlayerFreq(i, Number(s.input.value));
    return s;
  });

  const Tone = window.Tone;
  if (Tone) {
    playerOsc = targets.map((t, i) => {
      const o = new Tone.Oscillator(Number(sliders[i].input.value), "sine").toDestination();
      o.volume.value = -14;
      o.start();
      return o;
    });
    targetOsc = targets.map((t) => {
      const o = new Tone.Oscillator(t, "sine").toDestination();
      o.volume.value = -18;
      o.start();
      return o;
    });
  }

  overlay.hidden = false;
  let last = performance.now();

  function frame(now) {
    const dt = now - last;
    last = now;
    const snap = puzzle.update(dt);
    const maxOff = Math.max(...snap.centsOff.map((c) => Math.abs(c)));
    const chaos = Math.min(1, maxOff / 90);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mode = freqToMode(targets[0]);
    drawChladniPlate(ctx, {
      x: 10,
      y: 10,
      w: canvas.width - 20,
      h: canvas.height - 20,
      m: mode.m,
      n: mode.n,
      chaos,
      time: now,
    });
    const statusEl = overlay.querySelector(".resonance-status");
    statusEl.textContent = snap.withinTolerance.every(Boolean) ? "Holding steady..." : "Listening...";
    if (snap.solved) {
      statusEl.textContent = "Resonance achieved.";
      finish(true);
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
}

export function isResonanceOpen() {
  return !!overlay && !overlay.hidden;
}

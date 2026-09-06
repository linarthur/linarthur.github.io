// puzzles/resonanceUI.js
//
// DOM + canvas + audio wiring for the resonance puzzle. Originally a
// continuous drag-to-tune slider; per playtesting feedback from actual kids
// it was too hard to land by ear or by eye, so each target note is instead
// a small multiple-choice row: tapping a note only plays it back (a
// preview, nothing more) and highlights it as the current pick for that
// voice; the player only finds out if it's right once they tap that
// group's own Confirm button. Nothing is graded on tap alone — kids kept
// tapping and getting instantly solved with no idea why, which is exactly
// what this two-step preview/confirm split is for. A correct Confirm just
// locks the note in (no "that's right!" narration — with multiple choice
// already doing the hard work of ear-training, spelling out the answer on
// top of it would make the puzzle trivial); a wrong Confirm nudges the
// player to keep listening, and costs nothing.
//
// No fail state: closing the puzzle any time just leaves it unsolved.

import { drawChladniPlate, freqToMode } from "./chladni.js";

const HINT_WRONG = "Not quite — give it another listen.";
const HINT_NONE_PICKED = "Tap a note first, then Confirm.";

// Ratios (relative to the target frequency) used to build the wrong
// answers, spread across recognizably different pitches rather than
// near-misses, since the point is "can you tell notes apart," not
// "can you drag a slider to the exact pixel."
const DISTRACTOR_RATIOS = [0.5, 0.667, 0.75, 1.333, 1.5, 2];

let overlay = null;
let canvas, ctx;
let raf = null;
let activeOsc = null;
let onSolvedCb = null;
let onCloseCb = null;
let targets = [];
let solvedSlots = [];
let previewMode = null;

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
      <div class="resonance-choices"></div>
      <div class="resonance-status">Listening...</div>
      <button class="menu-btn resonance-close">Leave it for now</button>
    </div>
  `;
  root.appendChild(overlay);
  canvas = overlay.querySelector(".resonance-canvas");
  ctx = canvas.getContext("2d");
  overlay.querySelector(".resonance-close").addEventListener("click", () => finish(false));
}

function playTone(freq) {
  const Tone = window.Tone;
  if (!Tone) return;
  if (activeOsc) {
    try {
      activeOsc.stop();
      activeOsc.dispose?.();
    } catch (e) {
      /* already stopped */
    }
  }
  const o = new Tone.Oscillator(freq, "sine").toDestination();
  o.volume.value = -12;
  o.start();
  o.stop(`+0.9`);
  activeOsc = o;
}

function shuffledChoicesFor(target) {
  const distractors = [...DISTRACTOR_RATIOS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((r) => Math.round(target * r * 100) / 100);
  const choices = [...distractors, target];
  return choices.sort(() => Math.random() - 0.5);
}

// One group = one voice to match: a row of note buttons (tap = preview +
// select, nothing is graded) plus its own Confirm button (tap = grade the
// currently-selected note).
function buildChoiceGroup(index, target, label, onConfirmed) {
  const group = el("div", "resonance-choice-group");
  if (label) {
    const title = el("div", "resonance-group-title");
    title.textContent = label;
    group.appendChild(title);
  }
  const row = el("div", "resonance-choice-row");
  const status = el("div", "resonance-group-status");
  const confirmBtn = el("button", "resonance-confirm-btn");
  confirmBtn.type = "button";
  confirmBtn.textContent = "Confirm";

  let selectedFreq = null;

  const choices = shuffledChoicesFor(target);
  const buttons = choices.map((freq) => {
    const btn = el("button", "resonance-choice-btn");
    btn.type = "button";
    btn.textContent = "♪";
    btn.addEventListener("click", () => {
      playTone(freq);
      previewMode = freqToMode(freq);
      selectedFreq = freq;
      buttons.forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      status.textContent = "";
    });
    row.appendChild(btn);
    return btn;
  });

  confirmBtn.addEventListener("click", () => {
    if (selectedFreq === null) {
      status.textContent = HINT_NONE_PICKED;
      return;
    }
    if (Math.abs(selectedFreq - target) < 0.01) {
      onConfirmed(true);
    } else {
      status.textContent = HINT_WRONG;
      const pickedBtn = buttons.find((b) => b.classList.contains("is-selected"));
      pickedBtn?.classList.add("is-wrong");
      setTimeout(() => pickedBtn?.classList.remove("is-wrong"), 300);
    }
  });

  group.appendChild(row);
  group.appendChild(confirmBtn);
  group.appendChild(status);

  return {
    el: group,
    lockSolved() {
      const pickedBtn = buttons.find((b) => b.classList.contains("is-selected"));
      pickedBtn?.classList.add("is-correct", "is-solved");
      buttons.forEach((b) => {
        b.disabled = true;
      });
      confirmBtn.disabled = true;
      status.textContent = "";
    },
  };
}

function finish(solved) {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  if (activeOsc) {
    try {
      activeOsc.stop();
      activeOsc.dispose?.();
    } catch (e) {
      /* already stopped */
    }
    activeOsc = null;
  }
  if (overlay) overlay.hidden = true;
  if (solved) onSolvedCb?.();
  else onCloseCb?.();
}

export function openResonancePuzzle(root, { targets: puzzleTargets, targetLabels, title, flavor, onSolved, onClose }) {
  ensureDom(root);
  onSolvedCb = onSolved || null;
  onCloseCb = onClose || null;
  targets = puzzleTargets;
  solvedSlots = targets.map(() => false);
  previewMode = freqToMode(targets[0]);

  overlay.querySelector(".resonance-title").textContent = title || "Resonance";
  overlay.querySelector(".resonance-flavor").textContent = flavor || "";

  const overallStatus = overlay.querySelector(".resonance-status");
  overallStatus.textContent = "Listening...";

  const choicesWrap = overlay.querySelector(".resonance-choices");
  choicesWrap.innerHTML = "";

  targets.forEach((target, i) => {
    const label = targetLabels?.[i] || (targets.length > 1 ? `Voice ${i + 1}` : null);
    const group = buildChoiceGroup(i, target, label, (correct) => {
      if (!correct || solvedSlots[i]) return;
      solvedSlots[i] = true;
      group.lockSolved();
      if (solvedSlots.every(Boolean)) {
        overallStatus.textContent = "Resonance achieved.";
        finish(true);
      }
    });
    choicesWrap.appendChild(group.el);
  });

  overlay.hidden = false;

  function frame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const solvedCount = solvedSlots.filter(Boolean).length;
    const chaos = Math.max(0.08, 1 - solvedCount / targets.length);
    drawChladniPlate(ctx, {
      x: 10,
      y: 10,
      w: canvas.width - 20,
      h: canvas.height - 20,
      m: previewMode.m,
      n: previewMode.n,
      chaos,
      time: now,
    });
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
}

export function isResonanceOpen() {
  return !!overlay && !overlay.hidden;
}

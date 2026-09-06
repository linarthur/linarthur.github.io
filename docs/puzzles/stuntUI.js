// puzzles/stuntUI.js
//
// Act 2 Nerve Path's stand-in for combat: a Simon-Says reflex sequence
// (rooftop pursuit footwork, tram brake levers, an arm-wrestle's push-back
// beats) instead of a fight. Watch the moves flash in order, then repeat
// them by clicking before the timer bar runs out. A wrong click or an
// empty timer never ends the game — it just resets the sequence and lets
// the player go again, per the design doc's "no combat minigame that can
// kill the hero" rule. Passing costs nothing; failing costs only a beat of
// in-fiction time (the flavor line on a fumble says as much).

let overlay = null;
let cardTitle, flavorEl, movesWrap, statusEl, timerBar, closeBtn;
let cfg = null;
let onSolvedCb = null;
let onCloseCb = null;
let sequence = [];
let position = 0;
let accepting = false;
let timerRaf = null;
let timerStart = 0;
let fumbles = 0;

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function ensureDom(root) {
  if (overlay) return;
  overlay = el("div", "stunt-overlay");
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="stunt-card">
      <h2 class="stunt-title"></h2>
      <p class="stunt-flavor"></p>
      <div class="stunt-timer"><div class="stunt-timer-fill"></div></div>
      <div class="stunt-moves"></div>
      <div class="stunt-status">Watch closely.<br>仔細看好。</div>
      <button class="menu-btn stunt-close">Catch your breath<br>先喘口氣</button>
    </div>
  `;
  root.appendChild(overlay);
  cardTitle = overlay.querySelector(".stunt-title");
  flavorEl = overlay.querySelector(".stunt-flavor");
  movesWrap = overlay.querySelector(".stunt-moves");
  statusEl = overlay.querySelector(".stunt-status");
  timerBar = overlay.querySelector(".stunt-timer-fill");
  closeBtn = overlay.querySelector(".stunt-close");
  closeBtn.addEventListener("click", () => finish(false));
}

function randomSequence(moveIds, length) {
  const seq = [];
  for (let i = 0; i < length; i++) {
    seq.push(moveIds[Math.floor(Math.random() * moveIds.length)]);
  }
  return seq;
}

function highlightMove(id, className) {
  const btn = movesWrap.querySelector(`[data-move="${id}"]`);
  if (btn) btn.classList.add(className);
  return btn;
}

function clearHighlights() {
  movesWrap.querySelectorAll(".stunt-move-btn").forEach((b) => {
    b.classList.remove("stunt-move-active", "stunt-move-good", "stunt-move-bad");
  });
}

function playbackSequence() {
  accepting = false;
  position = 0;
  clearHighlights();
  statusEl.textContent = cfg.watchLine || "Watch the moves...";
  sequence.forEach((id, i) => {
    setTimeout(() => {
      clearHighlights();
      const btn = highlightMove(id, "stunt-move-active");
      setTimeout(() => btn?.classList.remove("stunt-move-active"), 380);
    }, i * 550);
  });
  setTimeout(() => {
    clearHighlights();
    statusEl.textContent = cfg.goLine || "Now — repeat it!";
    accepting = true;
    startTimer(cfg.windowMs || sequence.length * 1400 + 1200);
  }, sequence.length * 550 + 200);
}

function startTimer(durationMs) {
  cancelTimer();
  timerStart = performance.now();
  timerBar.style.width = "100%";
  function tick(now) {
    const elapsed = now - timerStart;
    const pct = Math.max(0, 1 - elapsed / durationMs);
    timerBar.style.width = `${pct * 100}%`;
    if (pct <= 0) {
      cancelTimer();
      fail("Too slow — the moment's gone.");
      return;
    }
    timerRaf = requestAnimationFrame(tick);
  }
  timerRaf = requestAnimationFrame(tick);
}

function cancelTimer() {
  if (timerRaf) cancelAnimationFrame(timerRaf);
  timerRaf = null;
}

function fail(message) {
  accepting = false;
  fumbles++;
  statusEl.textContent = `${message} ${cfg.fumbleLine || "No harm done — catch a breath and try again."}`;
  setTimeout(() => {
    if (overlay && !overlay.hidden) playbackSequence();
  }, 1200);
}

function pressMove(id) {
  if (!accepting) return;
  if (id === sequence[position]) {
    highlightMove(id, "stunt-move-good");
    position++;
    if (position >= sequence.length) {
      accepting = false;
      cancelTimer();
      statusEl.textContent = cfg.successLine || "Clean.";
      setTimeout(() => finish(true), 500);
    }
  } else {
    highlightMove(id, "stunt-move-bad");
    cancelTimer();
    fail(cfg.wrongLine || "Wrong footing.");
  }
}

function finish(solved) {
  cancelTimer();
  if (overlay) overlay.hidden = true;
  if (solved) onSolvedCb?.();
  else onCloseCb?.();
}

// moves: [{id,label}], sequenceLength: how many beats to chain,
// windowMs: total time allowed to repeat the sequence once shown.
export function openStuntPuzzle(
  root,
  { title, flavor, moves, sequenceLength = 4, windowMs, watchLine, goLine, successLine, wrongLine, fumbleLine, onSolved, onClose }
) {
  ensureDom(root);
  cfg = { windowMs, watchLine, goLine, successLine, wrongLine, fumbleLine };
  onSolvedCb = onSolved || null;
  onCloseCb = onClose || null;
  fumbles = 0;
  cardTitle.textContent = title || "Quick Reflexes";
  flavorEl.textContent = flavor || "";
  movesWrap.innerHTML = "";
  moves.forEach((m) => {
    const btn = el("button", "stunt-move-btn");
    btn.dataset.move = m.id;
    btn.textContent = m.label;
    btn.addEventListener("click", () => pressMove(m.id));
    movesWrap.appendChild(btn);
  });
  sequence = randomSequence(
    moves.map((m) => m.id),
    sequenceLength
  );
  overlay.hidden = false;
  playbackSequence();
}

export function isStuntOpen() {
  return !!overlay && !overlay.hidden;
}

// engine/input.js
//
// Converts raw mouse/touch/keyboard events on the canvas into high-level
// gesture callbacks in LOGICAL (1920x1080) coordinate space:
//   onTap(x, y)          - left click, or a plain touch tap
//   onSmartTap(x, y)     - right click (desktop smart-default verb)
//   onLongPress(x, y, screenX, screenY) - touch hold >=350ms (radial verb coin)
//   onDoubleTap(x, y)    - skip walk animation
//   onHover(x, y)        - mouse move, for the sentence line / highlight
//   onKey(key)           - single-character keydown, lowercased
//
// This module knows nothing about rooms, hotspots, or verbs — it only
// does coordinate mapping and gesture timing.

const LONG_PRESS_MS = 350;
const DOUBLE_TAP_MS = 300;
const MOVE_CANCEL_PX = 12;

export function attachInput(canvas, handlers) {
  let longPressTimer = null;
  let pressStart = null; // {x,y,sx,sy,time}
  let lastTapTime = 0;
  let lastTapPos = null;
  let longPressFired = false;

  function toLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    return [nx * canvas.width, ny * canvas.height];
  }

  function clearLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  // --- Mouse ---
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  canvas.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      const [x, y] = toLogical(e.clientX, e.clientY);
      handlers.onSmartTap?.(x, y);
      return;
    }
    const [x, y] = toLogical(e.clientX, e.clientY);
    handlers.onTap?.(x, y);
  });

  canvas.addEventListener("mousemove", (e) => {
    const [x, y] = toLogical(e.clientX, e.clientY);
    handlers.onHover?.(x, y);
  });

  canvas.addEventListener("mouseleave", () => handlers.onHover?.(null, null));

  // --- Touch ---
  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      const [x, y] = toLogical(t.clientX, t.clientY);
      pressStart = { x, y, sx: t.clientX, sy: t.clientY, time: performance.now() };
      longPressFired = false;
      clearLongPress();
      longPressTimer = setTimeout(() => {
        longPressFired = true;
        if (navigator.vibrate) navigator.vibrate(12);
        handlers.onLongPress?.(x, y, t.clientX, t.clientY);
      }, LONG_PRESS_MS);
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (!pressStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - pressStart.sx;
      const dy = t.clientY - pressStart.sy;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearLongPress();
      const [x, y] = toLogical(t.clientX, t.clientY);
      handlers.onTouchMove?.(x, y, t.clientX, t.clientY);
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      clearLongPress();
      if (longPressFired) {
        handlers.onLongPressEnd?.();
        pressStart = null;
        return;
      }
      const t = e.changedTouches[0];
      const [x, y] = toLogical(t.clientX, t.clientY);
      const now = performance.now();
      const isDouble =
        lastTapPos &&
        now - lastTapTime < DOUBLE_TAP_MS &&
        Math.hypot(x - lastTapPos[0], y - lastTapPos[1]) < 60;
      if (isDouble) {
        handlers.onDoubleTap?.(x, y);
        lastTapPos = null;
        lastTapTime = 0;
      } else {
        handlers.onTap?.(x, y);
        lastTapPos = [x, y];
        lastTapTime = now;
      }
      pressStart = null;
    },
    { passive: false }
  );

  // --- Keyboard ---
  window.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    // Some input paths (and a few browsers) report an empty e.key for the
    // spacebar; e.code is reliable across all of them.
    const key = e.code === "Space" ? " " : e.key.toLowerCase();
    handlers.onKey?.(key, e);
  });
}

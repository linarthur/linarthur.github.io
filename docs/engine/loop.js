// engine/loop.js — fixed-callback requestAnimationFrame driver.

export function createLoop(update, render) {
  let last = 0;
  let running = false;
  let rafId = null;

  function frame(now) {
    if (!running) return;
    const dt = last ? Math.min(now - last, 100) : 16;
    last = now;
    update(dt);
    render();
    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}

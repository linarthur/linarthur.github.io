// engine/cutscene.js
//
// Tiny sequential script runner over data-driven step arrays — rooms and
// dialogue files describe cutscenes as plain objects, never functions, so
// they stay JSON-shaped and easy to add without touching engine code.
//
// Supported step types: walkTo, say, wait, camera, playSfx, setFlag.
// Skippable with Esc (desktop) or a tap anywhere (touch) — skipping still
// applies every step's state changes (flags, final positions), it just
// collapses the timing to zero so nothing is missed.

export async function runCutscene(steps, ctx) {
  let skipped = false;
  const skipListener = (e) => {
    if ((e.key || "").toLowerCase() === "escape") skipped = true;
  };
  window.addEventListener("keydown", skipListener);
  const overlay = ctx.showSkipOverlay?.(() => {
    skipped = true;
  });

  for (const step of steps) {
    await runStep(step, ctx, skipped);
  }

  window.removeEventListener("keydown", skipListener);
  if (overlay) ctx.hideSkipOverlay?.(overlay);
}

function runStep(step, ctx, skip) {
  switch (step.type) {
    case "walkTo":
      return ctx.walkActorTo(step.x, step.y, skip);
    case "say":
      return ctx.say(step.speaker, step.text, skip ? 0 : step.ms ?? 1800);
    case "wait":
      return skip ? Promise.resolve() : ctx.wait(step.ms ?? 500);
    case "camera":
      return ctx.shake(skip ? 0 : step.ms ?? 300);
    case "playSfx":
      return ctx.playSfx?.(step.id) ?? Promise.resolve();
    case "setFlag":
      ctx.setFlag(step.key, step.value ?? true);
      return Promise.resolve();
    default:
      console.warn("Unknown cutscene step type:", step.type);
      return Promise.resolve();
  }
}

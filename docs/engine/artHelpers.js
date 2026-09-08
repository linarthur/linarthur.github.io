// engine/artHelpers.js
//
// Shared painting techniques for room backgrounds, factored out after the
// Prologue rooms came back looking flatter than the 1930s-travel-poster
// bar the design doc sets. The lever that actually closes the gap in
// canvas-drawn art isn't more shapes, it's light: atmospheric gradients,
// a vignette so the eye settles in the middle, and a warm rim-light on
// every silhouette so foreground objects separate from the background.

// Shared character scale — applied to the hero (engine/renderer.js
// drawActor) and to every hand-painted NPC figure (the paint*() functions
// in data/rooms/*.js, right after each one's anchor ctx.translate). One
// constant so hero and NPC sizing always move together, and so it's the
// same on every device — screen size must only change presentation, never
// make one platform's characters a different relative size than another's.
export const CHARACTER_SCALE = 1.2;

// Darkens the frame edges so the composition reads as lit-from-within
// rather than flat and evenly exposed, like a painted matte background.
export function vignette(ctx, w, h, strength = 0.55) {
  const g = ctx.createRadialGradient(w / 2, h * 0.42, h * 0.15, w / 2, h * 0.5, h * 0.85);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// A soft directional light wash, e.g. sun through a window or a lantern
// glow, laid over everything already painted.
export function lightWash(ctx, points, color, alpha = 0.16) {
  const [x1, y1, x2, y2] = points;
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, `rgba(${color},${alpha})`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, Math.max(x1, x2) + 400, Math.max(y1, y2) + 400);
  ctx.restore();
}

// Traces a warm (or cool) rim-light along one edge of whatever path the
// caller just filled, so silhouettes stop looking like flat cutouts.
// Call right after filling a shape, before ctx.restore().
export function rimLight(ctx, drawPathFn, { color = "255,220,170", width = 3, alpha = 0.5, offsetX = -1, offsetY = -1 } = {}) {
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.strokeStyle = `rgba(${color},${alpha})`;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  drawPathFn();
  ctx.stroke();
  ctx.restore();
}

// Ground-plane texture: faint parallel perspective lines plus scattered
// dust/grain speckles, deterministic so it doesn't shimmer frame to frame.
export function texturedFloor(ctx, { x, y, w, h, vanishX, lineColor = "rgba(0,0,0,0.12)", speckleColor = "rgba(255,255,255,0.05)" }) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(vanishX + i * 40, y);
    ctx.lineTo(vanishX + i * (w / 10), y + h);
    ctx.stroke();
  }
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  ctx.fillStyle = speckleColor;
  for (let i = 0; i < 140; i++) {
    const gx = x + rand() * w;
    const gy = y + rand() * h;
    ctx.fillRect(gx, gy, 1.4, 1.4);
  }
  ctx.restore();
}

// A believable multi-stop sky/wall gradient instead of a flat two-tone
// fade — the single biggest cheap upgrade for a painted-matte feel.
export function paintedGradient(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([offset, color]) => g.addColorStop(offset, color));
  return g;
}

// Draws a carryable item's own inventory icon out in the world (plus a
// contact shadow), so a pickup reads as a specific object rather than an
// invisible click zone. `item` is a data/items.js entry — its `drawIcon`
// is the exact function already used to render it in the inventory slot
// (see engine/main.js's makeInvSlot), just placed on the ground instead.
export function paintWorldItem(ctx, item, x, y, size = 44) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.42, size * 0.36, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  item.drawIcon(ctx, size);
  ctx.restore();
}

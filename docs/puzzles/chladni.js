// puzzles/chladni.js
//
// The game's visual signature (design doc Section 5): sand settling into
// nodal lines on a vibrating plate, cheap 2D cymatics approximation.
// Grain base positions are regenerated from a fixed seed every frame, so
// they never "teleport" — only their jitter and visibility change frame
// to frame, driven by how far the puzzle currently is from solved.

function mulberry32(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Maps a target frequency to an interesting, stable Chladni mode pair —
// colour-blind safe since the signal is shape/motion, not hue.
export function freqToMode(freq) {
  const pairs = [
    [2, 3],
    [3, 4],
    [2, 5],
    [4, 5],
    [3, 6],
    [5, 6],
  ];
  const idx = Math.abs(Math.round(freq)) % pairs.length;
  const [m, n] = pairs[idx];
  return { m, n };
}

// chaos: 0 = perfectly resolved nodal pattern, 1 = fully scattered sand.
export function drawChladniPlate(ctx, { x, y, w, h, m, n, chaos = 0, time = 0, grainCount = 700 }) {
  ctx.save();
  const plate = ctx.createLinearGradient(x, y, x, y + h);
  plate.addColorStop(0, "rgba(20,30,34,0.75)");
  plate.addColorStop(1, "rgba(10,16,18,0.85)");
  ctx.fillStyle = plate;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(217,160,102,0.45)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  const rand = mulberry32(1234);
  ctx.fillStyle = "rgba(232,220,196,0.9)";
  for (let i = 0; i < grainCount; i++) {
    const gx = rand() * w;
    const gy = rand() * h;
    const nx = gx / w;
    const ny = gy / h;
    const z =
      Math.cos(n * Math.PI * nx) * Math.cos(m * Math.PI * ny) -
      Math.cos(m * Math.PI * nx) * Math.cos(n * Math.PI * ny);
    const amp = Math.abs(z);
    const live = Math.sin(time * 0.004 + i) * 0.5 + 0.5;
    const jitter = (rand() - 0.5) * (amp * 46 + chaos * 70) + live * chaos * 6;
    const settleAlpha = Math.max(0, 1 - amp * (1.15 - chaos * 0.35));
    if (settleAlpha <= 0.04) continue;
    ctx.globalAlpha = settleAlpha;
    ctx.beginPath();
    ctx.arc(x + gx + jitter * 0.3, y + gy + jitter * 0.3, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

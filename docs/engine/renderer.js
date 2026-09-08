// engine/renderer.js — single canvas, layered draw. 1920x1080 logical space.

import { loadChromaKeyedSprite } from "./spriteLoader.js";
import { CHARACTER_SCALE } from "./artHelpers.js";

export const LOGICAL_W = 1920;
export const LOGICAL_H = 1080;

const ACCENT = "#ff7a1a"; // signal orange — reserved for interactive hotspots at rest
const HINT_COLOR = "#ffd23f"; // gold — reserved for the hint system's call-out highlight

// The hero's real art: a single idle pose, facing right. Left-facing is the
// same sprite mirrored in code (ctx.scale(-1,1)) — see drawHeroSprite below
// — and walking is the same static pose translated across the screen with
// a small bob/sway, not a frame-swapped walk cycle. Every other character
// (Mo, Draghi, Ferro, ...) is still the procedural silhouette drawn by its
// own room file — this sprite is only ever used for the player actor.
const HERO_SPRITE = loadChromaKeyedSprite("assets/sprites/hero-idle-right.png");
const HERO_SPRITE_HEIGHT = 252; // local units — 20% bigger than the old silhouette's head-to-heel span (210), per feedback that the real sprite read too small next to the scenery

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = LOGICAL_W;
  canvas.height = LOGICAL_H;

  // Cheap, classy fallback while the real sprite loads (or if it fails to)
  // — same shape the hero used everywhere before real art existed, and
  // still what every other character in the game uses.
  function drawSilhouette(actor) {
    const { facing } = actor;
    ctx.fillStyle = "#1c1712";
    ctx.beginPath();
    ctx.ellipse(0, -70, 30, 55, 0, 0, Math.PI * 2); // torso
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -132, 22, 24, 0, 0, Math.PI * 2); // head
    ctx.fill();
    // fedora silhouette
    ctx.beginPath();
    ctx.ellipse(0, -150, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-16, -156);
    ctx.quadraticCurveTo(0, -180, 16, -156);
    ctx.closePath();
    ctx.fill();

    // facing indicator (legs)
    const dx = facing === "left" ? -10 : facing === "right" ? 10 : 0;
    ctx.strokeStyle = "#1c1712";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-10, -18);
    ctx.lineTo(-10 + dx, 30);
    ctx.moveTo(10, -18);
    ctx.lineTo(10 + dx, 30);
    ctx.stroke();
  }

  function drawHeroSprite(actor, now) {
    const { facing, moving } = actor;
    // Idle sway is slower and smaller; walking bob is quicker and a bit
    // more pronounced — both just a translate + slight rotation of the
    // one static pose, per the "no walk-cycle frames" rule.
    const bobFreq = moving ? 130 : 900;
    const bobAmp = moving ? 6 : 2.5;
    const bob = Math.sin(now / bobFreq) * bobAmp;
    const sway = Math.sin(now / (bobFreq * 1.3)) * (moving ? 0.035 : 0.012);

    const h = HERO_SPRITE_HEIGHT;
    const w = h * (HERO_SPRITE.width / HERO_SPRITE.height);

    ctx.save();
    ctx.translate(0, bob);
    ctx.rotate(sway);
    if (facing === "left") ctx.scale(-1, 1);
    ctx.drawImage(HERO_SPRITE.canvas, -w / 2, 10 - h, w, h);
    ctx.restore();
  }

  function drawActor(actor) {
    const { x, y } = actor;
    const scale = (0.55 + 0.45 * (y / LOGICAL_H)) * CHARACTER_SCALE; // scale zone: bigger near camera
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // soft contact shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 8, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    if (HERO_SPRITE.ready) {
      drawHeroSprite(actor, performance.now());
    } else {
      drawSilhouette(actor);
    }

    ctx.restore();
  }

  function drawHotspotHighlight(polygon) {
    ctx.save();
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    polygon.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // Third-stage hint call-out: same dashed-outline language as the hover
  // highlight above, so it reads as "this is clickable" rather than a new
  // visual idiom — just gold and pulsing so it's noticeable unprompted.
  function drawHintHighlight(polygon, phase) {
    const pulse = 0.5 + 0.5 * Math.sin(phase / 220);
    ctx.save();
    ctx.strokeStyle = HINT_COLOR;
    ctx.lineWidth = 5 + pulse * 3;
    ctx.globalAlpha = 0.6 + pulse * 0.4;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    polygon.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function drawWalkboxDebug(polygon) {
    ctx.save();
    ctx.strokeStyle = "rgba(93,255,176,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    polygon.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function render({
    room,
    actor,
    hoveredHotspot,
    hintHighlight,
    revealedHotspots,
    debug,
    cameraOffset = { x: 0, y: 0 },
    state,
  }) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.save();
    ctx.translate(cameraOffset.x, cameraOffset.y);
    room.drawBackground(ctx, state);
    if (debug) drawWalkboxDebug(room.walkbox);
    if (revealedHotspots) revealedHotspots.forEach((polygon) => drawHotspotHighlight(polygon));
    if (hintHighlight) drawHintHighlight(hintHighlight, performance.now());
    if (hoveredHotspot) drawHotspotHighlight(hoveredHotspot.polygon);
    drawActor(actor);
    ctx.restore();
  }

  return { ctx, render };
}

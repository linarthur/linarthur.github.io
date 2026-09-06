// engine/renderer.js — single canvas, layered draw. 1920x1080 logical space.

export const LOGICAL_W = 1920;
export const LOGICAL_H = 1080;

const ACCENT = "#ff7a1a"; // signal orange — reserved for interactive hotspots at rest

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = LOGICAL_W;
  canvas.height = LOGICAL_H;

  function drawActor(actor) {
    const { x, y, facing } = actor;
    const scale = 0.55 + 0.45 * (y / LOGICAL_H); // scale zone: bigger near camera
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // soft contact shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 8, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // silhouette body — cheap, classy, matches the art-direction note about
    // rendering the hero from behind/in silhouette wherever possible
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

    // facing indicator (legs) — tiny nod to walk direction until sprites land
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

  function render({ room, actor, hoveredHotspot, debug, cameraOffset = { x: 0, y: 0 }, state }) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.save();
    ctx.translate(cameraOffset.x, cameraOffset.y);
    room.drawBackground(ctx, state);
    if (debug) drawWalkboxDebug(room.walkbox);
    if (hoveredHotspot) drawHotspotHighlight(hoveredHotspot.polygon);
    drawActor(actor);
    ctx.restore();
  }

  return { ctx, render };
}

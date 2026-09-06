// engine/geometry.js — polygon math shared by walkboxes and hotspots.

export function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Clamp a target point into the polygon by walking back along the line
// from a known-inside origin until it lands inside. Good enough for a
// single convex-ish walkbox; multi-box A* pathfinding comes with Act 1's
// multi-exit rooms.
export function clampToPolygon(fromX, fromY, toX, toY, poly) {
  if (pointInPolygon(toX, toY, poly)) return [toX, toY];
  const steps = 24;
  let bestX = fromX, bestY = fromY;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = fromX + (toX - fromX) * t;
    const y = fromY + (toY - fromY) * t;
    if (pointInPolygon(x, y, poly)) {
      bestX = x;
      bestY = y;
    } else {
      break;
    }
  }
  return [bestX, bestY];
}

export function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function polygonCentroid(poly) {
  let x = 0, y = 0;
  for (const [px, py] of poly) { x += px; y += py; }
  return [x / poly.length, y / poly.length];
}

// engine/spriteLoader.js
//
// Loads a character sprite delivered on a plain white background (the
// normal output of an illustration/photo tool) and strips that background
// to transparent at load time, via a chroma-key pass on an offscreen
// canvas — so real art can be drawn straight into a scene without an
// opaque white card behind it. The source file on disk is never touched;
// this only affects the in-memory canvas used for drawing.
//
// Best-effort, same rule as the rest of the game's asset loading (see
// engine/musicPlayer.js): a slow/failed load just leaves `ready: false`
// and the caller falls back to its placeholder art. A soft-edged, painted
// illustration won't key out as cleanly as a studio green-screen shot —
// expect a faint light fringe around soft edges (hair wisps, hat-brim
// shadow) until the source art ships with real alpha.

export function loadChromaKeyedSprite(url, { threshold = 245, feather = 20 } = {}) {
  const state = { canvas: null, ready: false, width: 0, height: 0 };
  // Room data files can now call this at module scope (see
  // data/rooms/subbasement.js), and those same files are imported by
  // test/solvability.mjs under plain Node, with no DOM/Image — degrade to
  // "never loads" there instead of throwing, same as any other failed load.
  if (typeof Image === "undefined") return state;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cctx = c.getContext("2d");
    cctx.drawImage(img, 0, 0);
    const frame = cctx.getImageData(0, 0, c.width, c.height);
    const px = frame.data;
    for (let i = 0; i < px.length; i += 4) {
      const minC = Math.min(px[i], px[i + 1], px[i + 2]);
      if (minC >= threshold) {
        px[i + 3] = 0;
      } else if (minC >= threshold - feather) {
        const t = (minC - (threshold - feather)) / feather;
        px[i + 3] = Math.round(px[i + 3] * (1 - t));
      }
    }
    cctx.putImageData(frame, 0, 0);
    state.canvas = c;
    state.width = c.width;
    state.height = c.height;
    // Tight bounding box of the actual subject (anything left non-fully-
    // transparent after keying), separate from the raw canvas size — a
    // source file's own margins/padding around the subject otherwise throw
    // off any caller that sizes/positions using the full image (e.g. makes
    // a character look like it's floating above its own feet). Callers
    // should draw from this box, not (0, 0, width, height).
    let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (px[(y * c.width + x) * 4 + 3] > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    state.bbox =
      maxX >= minX ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : { x: 0, y: 0, w: c.width, h: c.height };
    state.ready = true;
  };
  img.onerror = () => {
    console.warn(`spriteLoader: couldn't load "${url}"`);
  };
  img.src = url;
  return state;
}

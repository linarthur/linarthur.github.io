// data/rooms/biminiPartners.js — Act 2, Partners Path: Bimini, Bahamas.
// Mo mans the air pump topside while the player dives (dialogue+cutscene),
// then the Star Bell — wedged in the wreck, silent in air — is a
// resonance puzzle (the high voice). Solving it completes the path.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [220, 740], [1700, 740], [1800, 990], [120, 990],
];

function paintWaterColumn(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, H, [
    [0, "#7fd4d8"],
    [0.4, "#3fa8b8"],
    [0.75, "#1c6c80"],
    [1, "#0c3c4c"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // sunbeams from the surface
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#eafcff";
  for (let i = 0; i < 5; i++) {
    const x = 200 + i * 380;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 90, 0);
    ctx.lineTo(x - 60, H);
    ctx.lineTo(x - 150, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function paintBiminiRoad(ctx) {
  ctx.save();
  ctx.translate(960, 880);
  for (let i = -6; i <= 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#8a9a8a" : "#7a8a7a";
    ctx.beginPath();
    ctx.roundRect(i * 90 - 40, -10, 80, 40, 4);
    ctx.fill();
  }
  rimLight(ctx, () => ctx.rect(-460, -10, 920, 40), { color: "220,250,255", alpha: 0.2, width: 2 });
  ctx.restore();
}

function paintWreck(ctx) {
  ctx.save();
  ctx.translate(1350, 700);
  ctx.fillStyle = "rgba(20,40,45,0.75)";
  ctx.beginPath();
  ctx.moveTo(-220, 160);
  ctx.quadraticCurveTo(-240, 40, -140, -40);
  ctx.lineTo(160, -60);
  ctx.quadraticCurveTo(240, -20, 220, 100);
  ctx.lineTo(-220, 160);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(200,230,235,0.25)";
  ctx.lineWidth = 3;
  for (let i = -180; i < 180; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, -30 + Math.abs(i) * 0.15);
    ctx.lineTo(i, 130);
    ctx.stroke();
  }
  ctx.restore();
}

function paintSurfaceLine(ctx) {
  ctx.save();
  ctx.translate(160, 0);
  ctx.strokeStyle = "rgba(230,240,245,0.5)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 900);
  ctx.lineTo(0, 60);
  ctx.stroke();
  // rope rungs, and a rising trail of bubbles
  ctx.strokeStyle = "rgba(230,240,245,0.35)";
  ctx.lineWidth = 3;
  for (let y = 120; y < 880; y += 70) {
    ctx.beginPath();
    ctx.moveTo(-22, y);
    ctx.lineTo(22, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(220,245,250,0.4)";
  for (let i = 0; i < 6; i++) {
    const y = 850 - i * 130;
    ctx.beginPath();
    ctx.arc(10 + (i % 2) * 14, y, 5 - i * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function paintMoTopside(ctx) {
  // Mo stays topside on the boat — shown as a small silhouette at the
  // surface, since this room is entirely underwater.
  ctx.save();
  ctx.translate(300, 140);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#0c2c34";
  ctx.beginPath();
  ctx.roundRect(-60, -10, 200, 22, 6);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -22, 14, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintDiverAndBell(ctx, found) {
  if (!found) {
    ctx.save();
    ctx.translate(1360, 780);
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 60);
    glow.addColorStop(0, "rgba(200,240,255,0.5)");
    glow.addColorStop(1, "rgba(200,240,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(210,240,245,0.7)";
    ctx.beginPath();
    ctx.moveTo(-16, 18);
    ctx.quadraticCurveTo(-20, -10, 0, -20);
    ctx.quadraticCurveTo(20, -10, 16, 18);
    ctx.closePath();
    ctx.fill();
    rimLight(ctx, () => {
      ctx.moveTo(-16, 18);
      ctx.quadraticCurveTo(-20, -10, 0, -20);
      ctx.quadraticCurveTo(20, -10, 16, 18);
    }, { color: "255,255,255", alpha: 0.5, width: 2 });
    ctx.restore();
  }
}

export const biminiPartners = {
  id: "biminiPartners",
  name: "Bimini, Bahamas — The Wreck",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintWaterColumn(ctx);
    paintSurfaceLine(ctx);
    paintMoTopside(ctx);
    lightWash(ctx, [960, 0, 960, 900], "220,250,255", 0.1);
    paintBiminiRoad(ctx);
    paintWreck(ctx);
    paintDiverAndBell(ctx, !!state?.flags?.star_bell_found);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "mo",
      name: "Mo (Topside)",
      kind: "actor",
      polygon: [[220, 60], [400, 60], [400, 200], [220, 200]],
      dialogue: "mo_bimini",
      responses: {
        look: "Mo, a shimmering silhouette at the surface, minding the air line like she's willing it to behave.",
        default: "She's fifteen feet up and mid-conversation with a pump. It'll have to wait.",
      },
    },
    {
      id: "road",
      name: "The Bimini Road",
      kind: "scenery",
      polygon: [[500, 830], [1420, 830], [1420, 930], [500, 930]],
      responses: {
        look: "A dead-straight line of megalithic blocks along the sea floor. Officially beach rock. Unofficially, beach rock doesn't usually keep this good a right angle.",
        default: "Interesting geology. Or not geology at all. Either way, it's not going anywhere.",
      },
    },
    // Checked before "wreck" below, since its polygon sits inside the
    // wreck's larger one and hotspots are matched in array order — the
    // more specific hotspot has to come first to win the hit-test.
    {
      id: "bell_site",
      name: "The Star Bell",
      kind: "scenery",
      polygon: [[1300, 720], [1420, 720], [1420, 840], [1300, 840]],
      hideWhenFlag: "star_bell_found",
      puzzleRequiresFlag: "mo_helped_bimini",
      responses: {
        look: "Wedged tight in the wreck's ribs, catching what little light makes it down here. Silent, for now.",
        use: "The current here would spin him around without a fixed air line to work against — Mo needs to be minding the pump first.",
        default: "It's not coming free by looking at it.",
      },
      puzzleOnVerb: { use: "star_bell_resonance" },
    },
    {
      id: "wreck",
      name: "The Wreck",
      kind: "scenery",
      polygon: [[1140, 620], [1580, 620], [1580, 860], [1140, 860]],
      responses: {
        look: "A hull broken open like a ribcage, timbers gone soft and green with a century underwater. Something crystalline glints deep in the third rib.",
        default: "The current past the wreck is stronger than it looks. Best to be careful navigating around it.",
      },
    },
    {
      id: "surface",
      name: "Back to the Surface",
      kind: "exit",
      polygon: [[60, 640], [260, 640], [260, 900], [60, 900]],
      requiresFlag: "act2_complete",
      lockedLine: "Not yet — there's still a Voice or two left to find.",
      to: { room: "calderaApproach", spawn: { x: 900, y: 900, facing: "down" } },
      fallCaption: "Mo hauls him up, and this time neither of them pretends it isn't the last stop before whatever comes next.",
      responses: {
        look: "The line back up to the surface — and, from there, the last leg of the journey.",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default biminiPartners;

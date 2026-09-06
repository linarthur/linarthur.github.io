// data/rooms/biminiCunningDive.js — Act 2, Cunning Path: the wreck, alone.
// Reached by talking the dockyard foreman past his own checkpoint
// (data/rooms/biminiCunning.js). No Mo topside this time — just the
// forged requisition, and the current.

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
  ctx.save();
  ctx.globalAlpha = 0.16;
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

function paintSurfaceLine(ctx) {
  ctx.save();
  ctx.translate(160, 0);
  const shaft = ctx.createLinearGradient(-90, 0, 90, 0);
  shaft.addColorStop(0, "rgba(230,250,255,0)");
  shaft.addColorStop(0.5, "rgba(230,250,255,0.35)");
  shaft.addColorStop(1, "rgba(230,250,255,0)");
  ctx.fillStyle = shaft;
  ctx.fillRect(-90, 0, 180, 940);

  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 920);
  ctx.lineTo(0, 40);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 6;
  for (let y = 100; y < 900; y += 60) {
    ctx.beginPath();
    ctx.moveTo(-30, y);
    ctx.lineTo(30, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(220,245,250,0.5)";
  for (let i = 0; i < 6; i++) {
    const y = 850 - i * 130;
    ctx.beginPath();
    ctx.arc(14 + (i % 2) * 16, y, 5 - i * 0.4, 0, Math.PI * 2);
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

function paintBell(ctx, found) {
  if (found) return;
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
  ctx.restore();
}

export const biminiCunningDive = {
  id: "biminiCunningDive",
  name: "Bimini, Bahamas — The Wreck, Alone",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintWaterColumn(ctx);
    paintSurfaceLine(ctx);
    lightWash(ctx, [960, 0, 960, 900], "220,250,255", 0.1);
    paintBiminiRoad(ctx);
    paintWreck(ctx);
    paintBell(ctx, !!state?.flags?.star_bell_found);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "road",
      name: "The Bimini Road",
      kind: "scenery",
      polygon: [[500, 830], [1420, 830], [1420, 930], [500, 930]],
      responses: {
        look: "The same dead-straight megaliths every guidebook argues about. No one arguing with him down here, at least.",
        default: "It's not going anywhere.",
      },
    },
    // Listed before "wreck" — its polygon sits inside the wreck's larger
    // one, and hotspots are matched in array order.
    {
      id: "bell_site",
      name: "The Star Bell",
      kind: "scenery",
      polygon: [[1300, 720], [1420, 720], [1420, 840], [1300, 840]],
      hideWhenFlag: "star_bell_found",
      responses: {
        look: "Wedged tight in the wreck's ribs. Silent, for now.",
        use: "No Mo minding a line this time — he'll have to work fast and trust the current.",
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
        look: "No topside crew minding an air line this time — just his own lungs, the current, and something crystalline glinting in the third rib.",
        default: "The current past the wreck is stronger than it looks.",
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
      fallCaption: "No one to haul him up this time — just his own arms, and a forged requisition he won't be needing again.",
      responses: {
        look: "The way back up — and, from there, the last leg of the journey.",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default biminiCunningDive;

// data/rooms/donanaPartners.js — Act 2, Partners Path: the Doñana marshes
// near Cádiz. Mo reads the channel, the player poles the punt (resolved as
// one dialogue+cutscene beat — see data/dialogue/mo.js) — then the Salt
// Conch, half-buried in the mud, is a resonance puzzle (the low voice).

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [200, 740], [1720, 740], [1820, 990], [100, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 640, [
    [0, "#8fb8c9"],
    [0.5, "#c9dcc0"],
    [1, "#e8d9a0"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 640);
}

function paintReeds(ctx) {
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const x = (i * 137) % W;
    const h = 80 + ((i * 53) % 120);
    const y = 560 - h;
    ctx.strokeStyle = `rgba(90,110,60,${0.35 + (i % 5) * 0.06})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 620);
    ctx.quadraticCurveTo(x + 10, y + 40, x + 4, y);
    ctx.stroke();
  }
  ctx.restore();
}

function paintFlamingos(ctx) {
  const positions = [[420, 560], [480, 580], [1500, 540], [1560, 570]];
  positions.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "#e8909a";
    ctx.fillStyle = "#f0a8b0";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-4, -40);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-4, -52, 14, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-16, -56);
    ctx.lineTo(-26, -50);
    ctx.strokeStyle = "#3a2a1c";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });
}

function paintWater(ctx) {
  const g = paintedGradient(ctx, 0, 640, 0, H, [
    [0, "#a8c8b8"],
    [0.5, "#6fa090"],
    [1, "#3a5c50"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.lineTo(W, 640);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 640, w: W, h: H - 640, vanishX: 960, speckleColor: "rgba(255,255,255,0.06)" });

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const y = 700 + i * 55;
    ctx.beginPath();
    ctx.moveTo(300 + i * 30, y);
    ctx.quadraticCurveTo(960, y - 15, 1600 - i * 30, y);
    ctx.stroke();
  }
}

function paintMoAndConch(ctx, found) {
  ctx.save();
  ctx.translate(1420, 860);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a5c48";
  ctx.beginPath();
  ctx.moveTo(-28, 70);
  ctx.lineTo(-20, -55);
  ctx.quadraticCurveTo(0, -75, 20, -55);
  ctx.lineTo(28, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#5c3d28";
  ctx.beginPath();
  ctx.arc(0, -70, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c1712";
  ctx.beginPath();
  ctx.arc(0, -78, 20, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (!found) {
    ctx.save();
    ctx.translate(1560, 940);
    ctx.fillStyle = "#d9c7a8";
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 16, 0.3, 0, Math.PI * 2);
    ctx.fill();
    rimLight(ctx, () => ctx.ellipse(0, 0, 26, 16, 0.3, 0, Math.PI * 2), { color: "255,240,210", alpha: 0.4, width: 2 });
    ctx.restore();
  }
}

export const donanaPartners = {
  id: "donanaPartners",
  name: "Doñana Marshes — Cádiz, Spain",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    paintReeds(ctx);
    paintFlamingos(ctx);
    lightWash(ctx, [960, 0, 960, 640], "255,240,200", 0.14);
    paintWater(ctx);
    paintMoAndConch(ctx, !!state?.flags?.salt_conch_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "mo",
      name: "Dr. Nomusa Adeyemi",
      kind: "actor",
      polygon: [[1360, 780], [1480, 780], [1480, 950], [1360, 950]],
      dialogue: "mo_donana",
      responses: {
        look: "Mo, already reading the marsh like a page of text he can't quite make out yet.",
        default: "She's got better things to do than be pushed around a marsh.",
      },
    },
    {
      id: "flamingos",
      name: "Flamingos",
      kind: "scenery",
      polygon: [[380, 480], [620, 480], [620, 620], [380, 620]],
      responses: {
        look: "A wading line of flamingos, pink from the brine shrimp they filter out of the mud. They never once stand where the ground won't hold.",
        default: "They scatter if he gets any closer. Best to just watch where they don't walk.",
      },
    },
    {
      id: "reeds",
      name: "Reed Bank",
      kind: "scenery",
      polygon: [[60, 400], [340, 400], [340, 640], [60, 640]],
      responses: {
        look: "Head-high reeds, and somewhere in them a punt he hasn't found the nerve to trust yet.",
        default: "Nothing to do with the reeds but admire how well they hide a boat.",
      },
    },
    {
      id: "conch_site",
      name: "Half-Buried Shell",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "salt_conch_found",
      puzzleRequiresFlag: "mo_helped_donana",
      responses: {
        look: "Something pale and spiral-ridged, humming faintly under the mud whenever the wind drops.",
        use: "The mud out here would swallow him to the knee without knowing the safe channel first — best ask Mo.",
        default: "It's not coming free without a plan.",
      },
      puzzleOnVerb: { use: "salt_conch_resonance" },
    },
    {
      id: "boat_launch",
      name: "Channel Out",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "salt_conch_found",
      lockedLine: "No sense leaving the marsh without the conch — it's the whole reason they're both ankle-deep in it.",
      to: { room: "saharaPartners", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption:
        "Punt, train, and one deeply unimpressed camel broker later, the marsh gives way to the wide flat nothing of the Sahara.",
      responses: {
        look: "The channel back out toward dry land and, eventually, a very long train journey south.",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default donanaPartners;

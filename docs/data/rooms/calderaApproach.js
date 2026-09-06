// data/rooms/calderaApproach.js — Act 3, The Caldera. Reached from any of
// the three Act 2 finales (Partners, Cunning, Nerve all lead here — see
// engine/main.js's `act2_complete` gating) once all three Voices are
// found. One shared room regardless of path, per the design doc's
// convergence promise from the Act 1 path-choice screen.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [260, 760], [1660, 760], [1760, 990], [160, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 560, [
    [0, "#2c2438"],
    [0.5, "#4a3850"],
    [1, "#8a5850"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 560);
}

function paintCraterRim(ctx) {
  ctx.save();
  ctx.fillStyle = "#241c20";
  ctx.beginPath();
  ctx.moveTo(0, 560);
  ctx.lineTo(500, 500);
  ctx.lineTo(900, 620);
  ctx.lineTo(1300, 480);
  ctx.lineTo(1920, 560);
  ctx.lineTo(1920, 700);
  ctx.lineTo(0, 700);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function paintSteamVents(ctx, time) {
  const vents = [[300, 640], [860, 660], [1500, 630]];
  vents.forEach(([x, y], i) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#d8d0d8";
    for (let j = 0; j < 4; j++) {
      const t = (time / 1400 + j * 0.25 + i) % 1;
      ctx.beginPath();
      ctx.ellipse(Math.sin(t * 6 + i) * 10, -t * 120, 14 + t * 22, 10 + t * 16, 0, 0, Math.PI * 2);
      ctx.globalAlpha = 0.22 * (1 - t);
      ctx.fill();
    }
    ctx.restore();
  });
}

function paintCraterGlow(ctx) {
  ctx.save();
  const glow = ctx.createRadialGradient(960, 900, 40, 960, 900, 460);
  glow.addColorStop(0, "rgba(140,220,235,0.5)");
  glow.addColorStop(1, "rgba(140,220,235,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(960, 900, 460, 140, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 700, 0, H, [
    [0, "#3a2c30"],
    [1, "#1c1418"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 700, W, H - 700);
  texturedFloor(ctx, { x: 0, y: 700, w: W, h: H - 700, vanishX: 960, speckleColor: "rgba(255,220,200,0.05)" });
}

function paintDescentStair(ctx) {
  ctx.save();
  ctx.translate(960, 960);
  ctx.fillStyle = "#100c0e";
  ctx.beginPath();
  ctx.moveTo(-100, 0);
  ctx.lineTo(100, 0);
  ctx.lineTo(60, -40);
  ctx.lineTo(-60, -40);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(230,200,190,0.3)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    const t = i / 4;
    ctx.beginPath();
    ctx.moveTo(-100 + (-60 - -100) * t, 0 + (-40 - 0) * t);
    ctx.lineTo(100 + (60 - 100) * t, 0 + (-40 - 0) * t);
    ctx.stroke();
  }
  ctx.restore();
}

function paintDraghi(ctx, met) {
  ctx.save();
  ctx.translate(1500, 880);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 46, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = met ? "#5c3a4a" : "#4a2c3a";
  ctx.beginPath();
  ctx.moveTo(-26, 70);
  ctx.lineTo(-20, -70);
  ctx.quadraticCurveTo(0, -95, 20, -70);
  ctx.lineTo(26, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a8a";
  ctx.beginPath();
  ctx.arc(0, -84, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const calderaApproach = {
  id: "calderaApproach",
  name: "The Caldera",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [960, 200, 960, 700], "255,200,170", 0.1);
    paintCraterRim(ctx);
    paintSteamVents(ctx, performance.now());
    paintFloor(ctx);
    paintCraterGlow(ctx);
    paintDescentStair(ctx);
    paintDraghi(ctx, !!state?.flags?.draghi_caldera_met);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "vents",
      name: "Steam Vents",
      kind: "scenery",
      polygon: [[200, 600], [700, 600], [700, 700], [200, 700]],
      responses: {
        look: "Still warm, after all these centuries. Whatever's down there hasn't finished cooling.",
        default: "Best to keep clear of the vents.",
      },
    },
    {
      id: "draghi",
      name: "Contessa Verena Draghi",
      kind: "actor",
      polygon: [[1440, 780], [1560, 780], [1560, 950], [1440, 950]],
      dialogue: "draghi_caldera",
      responses: {
        look: "She's come alone, which is either a very good sign or a very bad one.",
        default: "There's nothing left to do here but talk to her.",
      },
    },
    {
      id: "glow",
      name: "The Glow Below",
      kind: "scenery",
      polygon: [[700, 780], [1220, 780], [1220, 940], [700, 940]],
      responses: {
        look: "Something down in the flooded caldera is lit from within — the same pale blue-white as every Voice he's carried this far.",
        default: "There's a way down, if he's ready for it.",
      },
    },
    {
      id: "descent",
      name: "The Way Down",
      kind: "exit",
      polygon: [[860, 940], [1060, 940], [1060, 990], [860, 990]],
      requiresFlag: "draghi_caldera_met",
      lockedLine: "Best to hear her out first — she came a long way to just stand here.",
      to: { room: "calderaChamber", spawn: { x: 900, y: 900, facing: "down" } },
      fallCaption: "The path down is old stone, and it remembers being stairs.",
      responses: {
        look: "A cut-stone stairway, switchbacking down into the light.",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default calderaApproach;

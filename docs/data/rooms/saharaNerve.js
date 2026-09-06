// data/rooms/saharaNerve.js — Act 2, Nerve Path: the Richat Structure,
// solo. There's no camel broker to charm here — a mining company's narrow-
// gauge survey tram is the only way across the rings before the heat gets
// dangerous, and it doesn't have working brakes. Braking it in time is a
// reflex sequence, not a fight; overshooting only costs a hot, long walk
// back to try again.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [220, 740], [1700, 740], [1800, 990], [120, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 620, [
    [0, "#e8955a"],
    [0.5, "#e8b878"],
    [1, "#f0d0a0"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 620);
  const sunGlow = ctx.createRadialGradient(500, 200, 10, 500, 200, 220);
  sunGlow.addColorStop(0, "rgba(255,240,200,0.9)");
  sunGlow.addColorStop(1, "rgba(255,240,200,0)");
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(500, 200, 220, 0, Math.PI * 2);
  ctx.fill();
}

function paintRings(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(140,90,50,0.35)";
  ctx.lineWidth = 6;
  const cx = 960, cy = 620;
  [200, 340, 480, 620].forEach((r) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function paintDunes(ctx) {
  const g = paintedGradient(ctx, 0, 600, 0, H, [
    [0, "#d9a468"],
    [1, "#a06a3a"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.lineTo(W, 640);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  paintRings(ctx);
  texturedFloor(ctx, { x: 0, y: 700, w: W, h: H - 700, vanishX: 960, speckleColor: "rgba(255,240,210,0.08)" });
}

function paintTrack(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(90,70,50,0.6)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(280, 900);
  ctx.lineTo(1620, 900);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(280, 930);
  ctx.lineTo(1620, 930);
  ctx.stroke();
  for (let x = 280; x < 1620; x += 45) {
    ctx.beginPath();
    ctx.moveTo(x, 895);
    ctx.lineTo(x, 935);
    ctx.stroke();
  }
  ctx.restore();
}

function paintTram(ctx) {
  ctx.save();
  ctx.translate(500, 880);
  ctx.fillStyle = "#5c4838";
  ctx.fillRect(-90, -50, 180, 60);
  rimLight(ctx, () => ctx.rect(-90, -50, 180, 60), { color: "255,220,170", alpha: 0.25, width: 2 });
  ctx.fillStyle = "#2c2418";
  ctx.beginPath();
  ctx.arc(-55, 20, 16, 0, Math.PI * 2);
  ctx.arc(55, 20, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintFork(ctx, found) {
  if (found) return;
  ctx.save();
  ctx.translate(1560, 940);
  ctx.strokeStyle = "#a97142";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-8, 20);
  ctx.lineTo(-8, -20);
  ctx.moveTo(8, 20);
  ctx.lineTo(8, -20);
  ctx.stroke();
  ctx.restore();
}

export const saharaNerve = {
  id: "saharaNerve",
  name: "The Eye of the Sahara — Mauritania",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [500, 0, 900, 700], "255,220,170", 0.14);
    paintDunes(ctx);
    paintTrack(ctx);
    paintTram(ctx);
    paintFork(ctx, !!state?.flags?.storm_fork_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "tram",
      name: "Survey Tram",
      kind: "scenery",
      polygon: [[410, 830], [590, 830], [590, 940], [410, 940]],
      hideWhenFlag: "sahara_tram_ridden",
      responses: {
        look: "A narrow-gauge mining tram, the only fast way across the rings — and, judging by the state of the lever, the brakes are more of a suggestion.",
        use: "Only one way to find out if that lever still does anything.",
        default: "It's not going anywhere until someone gets on and finds out.",
      },
      puzzleOnVerb: { use: "sahara_tram" },
    },
    {
      id: "rings",
      name: "The Concentric Rings",
      kind: "scenery",
      polygon: [[700, 500], [1220, 500], [1220, 740], [700, 740]],
      responses: {
        look: "Ridge after ridge, radiating out from the centre. From ground level they all look identical — the tram track is the only straight line through them.",
        default: "Best appreciated from a very great height, which he does not currently have.",
      },
    },
    {
      id: "fork_site",
      name: "Buried Bronze",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "storm_fork_found",
      puzzleRequiresFlag: "sahara_tram_ridden",
      responses: {
        look: "Two bronze tines, just breaking the surface at the dead centre of the rings, humming faintly in the heat-shimmer.",
        use: "Worth the ride, if his teeth are all still where he left them.",
        default: "It's not coming loose without digging, and it's not worth digging in the wrong spot.",
      },
      puzzleOnVerb: { use: "storm_fork_resonance" },
    },
    {
      id: "onward",
      name: "The Track South",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "storm_fork_found",
      lockedLine: "Leaving without the fork would mean the whole detour through the Sahara was for nothing.",
      to: { room: "biminiNerve", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "A cargo plane and a very quiet boat later, the Sahara gives way to Bimini.",
      responses: {
        look: "The track back to the airstrip.",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default saharaNerve;

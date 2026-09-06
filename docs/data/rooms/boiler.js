// data/rooms/boiler.js — Prologue Room 3 of 5: The Boiler Room.
// A ruptured steam line blocks the way down. Shut the valve.
//
// Art retrofitted to the Act 1 technique bar (engine/artHelpers.js).

import { vignette, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [260, 700], [1660, 700], [1760, 970], [160, 970],
];

function paintWalls(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 760, [
    [0, "#1c1108"],
    [0.5, "#2a1c14"],
    [1, "#42301c"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 760);

  // rivet-plate walls
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 3;
  for (let row = 0; row < 5; row++) {
    const y = 60 + row * 140;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,220,180,0.15)";
  for (let row = 0; row < 5; row++) {
    for (let x = 40; x < W; x += 160) {
      ctx.beginPath();
      ctx.arc(x, 60 + row * 140, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // furnace glow (deliberately not signal-orange — that's reserved for hotspots)
  const glow = ctx.createRadialGradient(300, 650, 20, 300, 650, 260);
  glow.addColorStop(0, "rgba(201,100,42,0.55)");
  glow.addColorStop(1, "rgba(201,100,42,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(300, 650, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1a120b";
  ctx.beginPath();
  ctx.roundRect(180, 520, 260, 220, 8);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(180, 520, 260, 220, 8), { color: "230,140,80", alpha: 0.4, width: 3 });
  ctx.fillStyle = "#c9642a";
  ctx.beginPath();
  ctx.roundRect(220, 640, 180, 70, 6);
  ctx.fill();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 700, 0, H, [
    [0, "#332218"],
    [1, "#120c07"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 760);
  ctx.lineTo(W, 760);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 760, w: W, h: H - 760, vanishX: 960, speckleColor: "rgba(230,140,80,0.05)" });
}

function paintPipes(ctx, steamOn) {
  ctx.save();
  ctx.strokeStyle = "#6b7680";
  ctx.lineWidth = 22;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(700, 0);
  ctx.lineTo(700, 300);
  ctx.lineTo(1200, 300);
  ctx.lineTo(1200, 620);
  ctx.stroke();
  ctx.restore();

  // valve wheel
  ctx.save();
  ctx.translate(1200, 640);
  ctx.strokeStyle = steamOn ? "#8a3a2a" : "#4a7a4a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 46, Math.sin(a) * 46);
    ctx.stroke();
  }
  ctx.fillStyle = "#3a3f44";
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (steamOn) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(1200 - 10 + i * 6, 700 - i * 26, 30 - i * 3, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function paintHole(ctx, open) {
  if (!open) return;
  ctx.save();
  ctx.translate(700, 900);
  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.ellipse(0, 0, 150, 65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4a3a28";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();
}

export const boiler = {
  id: "boiler",
  name: "Barnett Hall — Boiler Room",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    const shut = !!state?.flags?.valve_shut;
    paintWalls(ctx);
    paintFloor(ctx);
    paintHole(ctx, shut);
    paintPipes(ctx, !shut);
    vignette(ctx, W, H, 0.55);
  },

  hotspots: [
    {
      id: "valve_wheel",
      name: "Steam Valve",
      kind: "scenery",
      polygon: [[1130, 570], [1280, 570], [1280, 720], [1130, 720]],
      responses: {
        look: "A rusted iron wheel, hissing pale steam around its seal. It hasn't been turned in years, by the look of the crust.",
        pull: "He throws his whole weight on it. It groans, shrieks, and turns — the hiss cuts off, and a grate in the floor beyond drops open.",
        push: "Pushing does nothing a valve wheel wasn't built for pushing.",
        default: "It's hot, it's stuck, and it's clearly the thing to turn, not touch.",
      },
      setFlagOn: { pull: "valve_shut" },
    },
    {
      id: "furnace",
      name: "Furnace",
      kind: "scenery",
      polygon: [[180, 520], [440, 520], [440, 740], [180, 740]],
      responses: {
        look: "Barnett College's furnace, older than most of the faculty, still cheerfully overheating the whole east wing.",
        open: "That grate is not opening for anyone without asbestos gloves.",
        default: "It's a furnace. It's doing exactly what furnaces do.",
      },
    },
    {
      id: "toolboard",
      name: "Tool Board",
      kind: "scenery",
      polygon: [[1500, 600], [1650, 600], [1650, 760], [1500, 760]],
      responses: {
        look: "A pegboard of wrenches, each one outlined in chalk so the janitorial staff know exactly which one's missing. All of them are missing.",
        take: "Every hook is empty. Somebody's been busy.",
        default: "Nothing left to grab here.",
      },
    },
    {
      id: "grate_down",
      name: "Floor Grate",
      kind: "exit",
      polygon: [[610, 850], [830, 850], [830, 960], [610, 960]],
      requiresFlag: "valve_shut",
      lockedLine: "The grate's welded shut by the heat — not while that valve's still blasting steam at it.",
      to: { room: "cellar", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "The grate swings down on cooled hinges, and he drops into the cool dark of the cellar.",
      responses: {
        look: "A cast-iron grate in the floor, now mercifully cool enough to touch.",
      },
    },
  ],

  items: [],

  actorStart: { x: 320, y: 900, facing: "right" },
};

export default boiler;

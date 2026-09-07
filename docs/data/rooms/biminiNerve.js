// data/rooms/biminiNerve.js — Act 2, Nerve Path: the Consortium's own
// dockyard on Bimini. No forged paperwork this time — Ferro, Draghi's
// salvage master, blocks the dive ladder in person and settles it the
// only way he knows how: an arm-wrestle. Losing just means he offers a
// rematch — the design doc bars any combat minigame that can kill the
// hero.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [220, 740], [1700, 740], [1800, 990], [120, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 640, [
    [0, "#e8b87a"],
    [0.5, "#e8ccA0"],
    [1, "#cfe0d8"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 640);
}

function paintCrates(ctx) {
  const positions = [[260, 780], [340, 800], [1560, 760], [1640, 800]];
  positions.forEach(([x, y], i) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = i % 2 === 0 ? "#6a5238" : "#5c4830";
    ctx.fillRect(-50, -60, 100, 60);
    rimLight(ctx, () => ctx.rect(-50, -60, 100, 60), { color: "255,220,170", alpha: 0.25, width: 2 });
    ctx.fillStyle = "rgba(178,60,45,0.5)";
    ctx.font = "bold 14px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("A.S.C.", 0, -25);
    ctx.restore();
  });
}

function paintDock(ctx) {
  const g = paintedGradient(ctx, 0, 640, 0, H, [
    [0, "#7a6a50"],
    [1, "#3c3020"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 700);
  ctx.lineTo(W, 700);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 700, w: W, h: H - 700, vanishX: 960 });

  const water = paintedGradient(ctx, 0, 640, 0, 700, [
    [0, "#3fa8b8"],
    [1, "#1c6c80"],
  ]);
  ctx.fillStyle = water;
  ctx.fillRect(0, 640, W, 60);
}

function paintFerro(ctx) {
  ctx.save();
  ctx.translate(1000, 860);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 82, 54, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c2430";
  ctx.beginPath();
  ctx.moveTo(-38, 74);
  ctx.lineTo(-30, -65);
  ctx.quadraticCurveTo(0, -90, 30, -65);
  ctx.lineTo(38, 74);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#a97860";
  ctx.beginPath();
  ctx.arc(0, -80, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintLadder(ctx, found) {
  ctx.save();
  ctx.translate(1400, 700);
  ctx.strokeStyle = "#8a8f94";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-20, -20);
  ctx.lineTo(-20, 60);
  ctx.moveTo(20, -20);
  ctx.lineTo(20, 60);
  for (let y = -10; y <= 50; y += 20) {
    ctx.moveTo(-20, y);
    ctx.lineTo(20, y);
  }
  ctx.stroke();
  ctx.restore();
  if (!found) {
    ctx.save();
    const glow = ctx.createRadialGradient(1400, 660, 4, 1400, 660, 40);
    glow.addColorStop(0, "rgba(200,240,255,0.4)");
    glow.addColorStop(1, "rgba(200,240,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(1400, 660, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export const biminiNerve = {
  id: "biminiNerve",
  name: "Bimini, Bahamas — The Consortium Dockyard",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [960, 0, 960, 700], "255,230,190", 0.12);
    paintDock(ctx);
    paintCrates(ctx);
    paintFerro(ctx);
    paintLadder(ctx, !!state?.flags?.star_bell_found);
    vignette(ctx, W, H, 0.45);
  },

  hotspots: [
    {
      id: "ferro",
      name: "Ferro",
      kind: "actor",
      polygon: [[940, 780], [1060, 780], [1060, 950], [940, 950]],
      dialogue: "ferro_bimini",
      puzzleRequiresFlag: "talked_to_ferro",
      responses: {
        look: "Draghi's salvage master, built like something the dockyard crane could barely lift. He's planted himself right between the professor and the ladder.\n德拉基的打撈隊長，體格壯得連碼頭吊車都吊不太動。他就這麼站在教授和梯子中間，動都不動。",
        use: "One elbow already on the crate lid. He's waiting.\n他一隻手肘已經撐在板條箱上了，就等著開始。",
        default: "Talking seems like the safer opening move.\n先開口聊聊，看來是比較安全的第一步。",
      },
      puzzleOnVerb: { use: "ferro_arm_wrestle" },
    },
    {
      id: "crates",
      name: "Consortium Crates",
      kind: "scenery",
      polygon: [[200, 720], [420, 720], [420, 860], [200, 860]],
      responses: {
        look: "Salvage gear, stencilled with the Consortium's crest. Nothing here is worth the argument it'd start to touch.\n打撈裝備，噴著財團的徽記。這些東西沒一樣值得為它惹上麻煩。",
        default: "Best leave the crates alone — Ferro's watching more than the ladder.\n最好別碰這些箱子——費羅盯著的可不只有梯子。",
      },
    },
    {
      id: "bell_site",
      name: "The Dive Ladder",
      kind: "exit",
      polygon: [[1350, 640], [1450, 640], [1450, 760], [1350, 760]],
      hideWhenFlag: "star_bell_found",
      requiresFlag: "ferro_beaten",
      lockedLine: "Not past Ferro. Not without winning that wager first.\n過不了費羅這關。除非先贏了那場比賽。",
      to: { room: "biminiNerveDive", spawn: { x: 900, y: 900, facing: "down" } },
      fallCaption: "Ferro steps aside, rubbing his forearm, muttering something about a rematch someday. Down the ladder, into the water alone.\n費羅讓開身子，揉著手臂，嘴裡嘟囔著改天要再比一場。他順著梯子下水，獨自一人。",
      responses: {
        look: "A steel ladder down to the water, and from there, the wreck.\n一道通往水裡的鋼梯，從那裡再過去，就是沉船。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default biminiNerve;

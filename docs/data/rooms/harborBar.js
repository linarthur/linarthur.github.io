// data/rooms/harborBar.js — Act 1, Malta: the harbour bar. First meeting
// with Draghi. Leaving through the door, once she's been spoken to, is the
// end-of-Act-1 path choice trigger (kind: "pathChoice", handled specially
// in engine/main.js since there's no single next room — the three future
// paths fork here).

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, CHARACTER_SCALE } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [240, 760], [1680, 760], [1780, 990], [140, 990],
];

function paintRoom(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 760, [
    [0, "#1c2a30"],
    [0.5, "#2c3c40"],
    [1, "#3c4c48"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 760);

  // window out to the harbour, warm dusk outside
  ctx.save();
  ctx.translate(1450, 120);
  const sky = paintedGradient(ctx, 0, 0, 0, 420, [
    [0, "#a8623f"],
    [1, "#3a2436"],
  ]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 380, 420);
  ctx.fillStyle = "rgba(20,14,18,0.7)";
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.lineTo(60, 300);
  ctx.lineTo(140, 360);
  ctx.lineTo(220, 260);
  ctx.lineTo(300, 340);
  ctx.lineTo(380, 300);
  ctx.lineTo(380, 420);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1c130c";
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, 380, 420);
  ctx.restore();

  rimLight(ctx, () => ctx.rect(0, 0, W, 760), { color: "200,220,220", alpha: 0.06, width: 8 });
}

function paintBar(ctx) {
  ctx.save();
  ctx.translate(300, 700);
  const wood = paintedGradient(ctx, 0, -60, 0, 120, [
    [0, "#6a4c34"],
    [1, "#3a2a1c"],
  ]);
  ctx.fillStyle = wood;
  ctx.fillRect(-260, -60, 520, 120);
  ctx.strokeStyle = "#241a10";
  ctx.lineWidth = 4;
  ctx.strokeRect(-260, -60, 520, 120);
  // bottles behind
  for (let i = -220; i < 220; i += 36) {
    ctx.fillStyle = ["#3a5a4a", "#5a3a2a", "#2a3a5a"][Math.floor(Math.random() * 3)];
    ctx.fillRect(i, -140, 18, 70);
  }
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 760, 0, H, [
    [0, "#3a2f26"],
    [1, "#1c1610"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 760);
  ctx.lineTo(W, 760);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 760, w: W, h: H - 760, vanishX: 960 });
}

function paintDocksDoor(ctx) {
  ctx.save();
  ctx.translate(1690, 760);
  ctx.fillStyle = "#1c130c";
  ctx.beginPath();
  ctx.roundRect(-80, 0, 160, 200, [16, 16, 0, 0]);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-80, 0, 160, 200, [16, 16, 0, 0]), { color: "255,220,170", alpha: 0.3, width: 3 });
  ctx.strokeStyle = "#3a2a1c";
  ctx.lineWidth = 5;
  ctx.strokeRect(-80, 0, 160, 200);
  // night-blue sliver of the quay outside, cracked open
  ctx.fillStyle = "rgba(60,90,110,0.6)";
  ctx.beginPath();
  ctx.moveTo(-10, 10);
  ctx.lineTo(10, 10);
  ctx.lineTo(6, 190);
  ctx.lineTo(-6, 190);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function paintDraghi(ctx) {
  ctx.save();
  ctx.translate(1000, 860);
  ctx.scale(CHARACTER_SCALE, CHARACTER_SCALE);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 46, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5c1f2c";
  ctx.beginPath();
  ctx.moveTo(-30, 70);
  ctx.lineTo(-22, -60);
  ctx.quadraticCurveTo(0, -80, 22, -60);
  ctx.lineTo(30, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a6f";
  ctx.beginPath();
  ctx.arc(0, -78, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c1712";
  ctx.beginPath();
  ctx.ellipse(0, -90, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // cigarette holder flourish
  ctx.strokeStyle = "#1c1712";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, -70);
  ctx.lineTo(46, -84);
  ctx.stroke();
  ctx.restore();
}

export const harborBar = {
  id: "harborBar",
  name: "Valletta — The Harbour Bar",
  walkbox: WALKBOX,

  drawBackground(ctx) {
    paintRoom(ctx);
    lightWash(ctx, [1450, 120, 900, 700], "232,140,90", 0.12);
    paintBar(ctx);
    paintFloor(ctx);
    paintDocksDoor(ctx);
    paintDraghi(ctx);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "draghi",
      name: "Contessa Draghi",
      nameZh: "德拉吉伯爵夫人",
      kind: "actor",
      polygon: [[940, 700], [1070, 700], [1070, 950], [940, 950]],
      dialogue: "draghi_intro",
      responses: {
        look: "Impeccably dressed for a harbour bar, and entirely unbothered by it. She's watching the door, not her drink.\n穿得無懈可擊,和港口酒吧的氣氛格格不入,她卻毫不在意。她盯著的是門口,不是自己的酒。",
        default: "She raises an eyebrow. That's answer enough.\n她挑了挑眉,這反應已經說明一切。",
      },
    },
    {
      id: "window",
      name: "Harbour Window",
      nameZh: "港口窗景",
      kind: "scenery",
      polygon: [[1450, 120], [1830, 120], [1830, 540], [1450, 540]],
      responses: {
        look: "The Grand Harbour at dusk — bastion walls, a forest of masts, and somewhere out past the breakwater, three anchorages marked on a chart that shouldn't exist.\n黃昏中的大港口——稜堡城牆、密密麻麻的船桅,而在防波堤外的某處,標著三個錨地,標在一張根本不該存在的海圖上。",
        default: "Just a view. A good one, though.\n只是個景色,不過確實不錯。",
      },
    },
    {
      id: "bar",
      name: "The Bar",
      nameZh: "吧台",
      kind: "scenery",
      polygon: [[40, 640], [560, 640], [560, 820], [40, 820]],
      responses: {
        look: "Local wine, English gin, and a bartender who has clearly seen stranger things than an archaeologist in a fedora.\n當地的葡萄酒、英式琴酒,還有一個酒保,顯然見過比戴著呢帽的考古學家更怪的場面。",
        take: "The bartender clears his throat, pointedly.\n酒保故意清了清喉嚨。",
        default: "Best not to help himself.\n還是別自己動手拿的好。",
      },
    },
    {
      id: "harbor_door",
      name: "Door to the Docks",
      nameZh: "通往碼頭的門",
      kind: "exit",
      polygon: [[1600, 760], [1780, 760], [1780, 960], [1600, 960]],
      requiresFlag: "met_draghi",
      lockedLine: "No sense heading for the docks without finding out what that woman by the bar actually wants.\n連酒吧那位女士到底想幹嘛都還沒搞清楚,現在去碼頭也沒用。",
      pathChoice: true,
      responses: {
        look: "The door out to the quay, and whatever comes next.\n通往碼頭的門,門後是接下來的一切。",
      },
    },
  ],

  items: [],

  actorStart: { x: 700, y: 920, facing: "right" },
};

export default harborBar;

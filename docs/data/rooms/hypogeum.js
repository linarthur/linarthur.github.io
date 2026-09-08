// data/rooms/hypogeum.js — Act 1, Malta: the Hypogeum's echo chamber.
// Real-world flavour: the Hal Saflieni Hypogeum's "Oracle Room" is a known
// acoustic phenomenon, resonating around 110Hz — exactly the kind of true
// detail the writing guidelines ask kids to go look up afterward.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [260, 740], [1660, 740], [1780, 990], [140, 990],
];

function paintChamber(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 760, [
    [0, "#3a2c1c"],
    [0.5, "#5c4428"],
    [1, "#8a6a3e"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 760);

  // carved archway
  ctx.save();
  ctx.translate(960, 760);
  ctx.fillStyle = "#241a10";
  ctx.beginPath();
  ctx.moveTo(-260, 0);
  ctx.lineTo(-260, -260);
  ctx.quadraticCurveTo(0, -420, 260, -260);
  ctx.lineTo(260, 0);
  ctx.closePath();
  ctx.fill();
  rimLight(ctx, () => {
    ctx.moveTo(-260, 0);
    ctx.lineTo(-260, -260);
    ctx.quadraticCurveTo(0, -420, 260, -260);
    ctx.lineTo(260, 0);
  }, { color: "230,190,130", alpha: 0.4, width: 4 });
  ctx.restore();

  // ochre spiral motifs (Hypogeum's real painted spirals)
  [[300, 300], [1620, 340], [500, 180], [1400, 200]].forEach(([sx, sy], i) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.strokeStyle = "rgba(178,60,45,0.55)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    let r = 4;
    let a = 0;
    ctx.moveTo(0, 0);
    for (let s = 0; s < 60; s++) {
      a += 0.35;
      r += 0.9;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.stroke();
    ctx.restore();
  });
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 740, 0, H, [
    [0, "#4a3624"],
    [1, "#221810"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 740);
  ctx.lineTo(W, 740);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 740, w: W, h: H - 740, vanishX: 960, speckleColor: "rgba(230,180,120,0.06)" });
}

function paintOracleNiche(ctx) {
  ctx.save();
  ctx.translate(960, 560);
  ctx.fillStyle = "#1a1108";
  ctx.beginPath();
  ctx.ellipse(0, 0, 90, 130, 0, 0, Math.PI * 2);
  ctx.fill();
  const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 110);
  glow.addColorStop(0, "rgba(230,190,130,0.18)");
  glow.addColorStop(1, "rgba(230,190,130,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(0, 0, 110, 150, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintHarbourPassage(ctx) {
  ctx.save();
  ctx.translate(1660, 760);
  ctx.fillStyle = "#0e0a06";
  ctx.beginPath();
  ctx.moveTo(-90, 200);
  ctx.lineTo(-70, -20);
  ctx.quadraticCurveTo(0, -80, 70, -20);
  ctx.lineTo(90, 200);
  ctx.closePath();
  ctx.fill();
  rimLight(ctx, () => {
    ctx.moveTo(-90, 200);
    ctx.lineTo(-70, -20);
    ctx.quadraticCurveTo(0, -80, 70, -20);
    ctx.lineTo(90, 200);
  }, { color: "230,190,130", alpha: 0.35, width: 3 });
  // a coin of daylight at the top of the climbing passage
  const glow = ctx.createRadialGradient(0, -40, 4, 0, -40, 50);
  glow.addColorStop(0, "rgba(255,240,210,0.5)");
  glow.addColorStop(1, "rgba(255,240,210,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -40, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const hypogeum = {
  id: "hypogeum",
  name: "Malta — The Hypogeum",
  walkbox: WALKBOX,

  drawBackground(ctx) {
    paintChamber(ctx);
    lightWash(ctx, [960, 0, 960, 700], "230,190,130", 0.14);
    paintOracleNiche(ctx);
    paintFloor(ctx);
    paintHarbourPassage(ctx);
    vignette(ctx, W, H, 0.6);
  },

  hotspots: [
    {
      id: "oracle_niche",
      name: "The Oracle Niche",
      nameZh: "神諭凹龕",
      kind: "scenery",
      polygon: [[840, 420], [1080, 420], [1080, 700], [840, 700]],
      responses: {
        look: "A hollow cut into the living rock, angled just so. Every word spoken into it comes back a half-tone lower, and twice as loud. Three answering alcoves ring the chamber — but only the middle one narrows to a throat before it opens, the kind of carving that catches a voice and throws it straight back before the others even feel the sound arrive.\n一個鑿進岩壁的凹龕,角度恰到好處。對著它說的每個字,回來時都低了半音,音量卻大了一倍。這間石室四周有三個回音龕——但只有中間那個在開口前先收窄成喉狀,這種鑿法能截住聲音,搶在其他兩龕感應到聲響之前就把它彈回來。",
        use: "Come to think of it, that's less something to look at than something to test.\n仔細想想,這東西與其說是拿來看的,不如說是拿來試的。",
        default: "Best not to shout into three-thousand-year-old stonework for fun.\n別為了好玩對著三千年的石雕大吼大叫。",
      },
      puzzleOnVerb: { use: "hypogeum_echo" },
    },
    {
      id: "spirals",
      name: "Ochre Spirals",
      nameZh: "赭紅螺旋圖案",
      kind: "scenery",
      polygon: [[220, 200], [420, 200], [420, 420], [220, 420]],
      responses: {
        look: "Red ochre spirals, painted freehand, thousands of years before anyone here had heard the word 'Fibonacci.' They still haven't faded.\n赭紅色的螺旋圖案,徒手畫成,早在「費波那契」這個詞被發明的幾千年前就已存在。至今顏色依然沒有褪去。",
        default: "Beautiful. Also several millennia too old to touch.\n美是很美,但也老得幾千年了,還是別碰的好。",
      },
    },
    {
      id: "harbor_door",
      name: "Passage to the Harbour",
      nameZh: "通往港口的通道",
      kind: "exit",
      polygon: [[1560, 760], [1760, 760], [1760, 960], [1560, 960]],
      requiresFlag: "hypogeum_echo_solved",
      lockedLine: "The way up is a maze of chambers — no sense wandering it blind before he's worked out how the acoustics run.\n往上的路是一座石室迷宮——在搞懂這裡的聲學原理之前,盲目亂闖沒有意義。",
      to: { room: "harborBar", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "Up through the warren of chambers and out into the salt air of Valletta's Grand Harbour.\n穿過層層石室向上,最終走進瓦萊塔大港口那股帶著鹹味的空氣中。",
      responses: {
        look: "A narrow stair, cut into the rock, climbing toward a coin of daylight.\n一道窄窄的石階,朝著一枚硬幣大小的天光向上延伸。",
      },
    },
  ],

  items: [],

  actorStart: { x: 960, y: 920, facing: "down" },
};

export default hypogeum;

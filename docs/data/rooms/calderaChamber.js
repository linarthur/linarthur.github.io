// data/rooms/calderaChamber.js — Act 3, The Caldera: the flooded chamber
// at the bottom, holding the real Drowned Bell of Atlantis (distinct from
// the three handheld Voices carried in from Act 2). The finale puzzle —
// all three Voices at once — lives here (data/puzzles.js: drowned_bell_finale).

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [260, 760], [1660, 760], [1760, 990], [160, 990],
];

function paintWater(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, H, [
    [0, "#0c3040"],
    [0.4, "#134a5c"],
    [0.75, "#0a3040"],
    [1, "#041820"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#bfeaf5";
  for (let i = 0; i < 6; i++) {
    const x = 140 + i * 320;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 70, 0);
    ctx.lineTo(x - 90, H);
    ctx.lineTo(x - 160, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function paintColumns(ctx) {
  const xs = [260, 560, 1360, 1660];
  xs.forEach((x) => {
    ctx.save();
    ctx.fillStyle = "rgba(60,90,100,0.55)";
    ctx.fillRect(x - 40, 320, 80, 560);
    rimLight(ctx, () => ctx.rect(x - 40, 320, 80, 560), { color: "180,230,240", alpha: 0.2, width: 2 });
    ctx.restore();
  });
}

function paintBell(ctx, awakened) {
  ctx.save();
  ctx.translate(960, 780);
  const glow = ctx.createRadialGradient(0, 0, 20, 0, 0, awakened ? 320 : 180);
  glow.addColorStop(0, awakened ? "rgba(255,250,220,0.85)" : "rgba(180,235,245,0.55)");
  glow.addColorStop(1, "rgba(180,235,245,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, awakened ? 320 : 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = awakened ? "rgba(255,248,225,0.85)" : "rgba(160,200,205,0.7)";
  ctx.beginPath();
  ctx.moveTo(-70, 90);
  ctx.quadraticCurveTo(-90, -30, -20, -110);
  ctx.quadraticCurveTo(0, -130, 20, -110);
  ctx.quadraticCurveTo(90, -30, 70, 90);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 92, 72, 16, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function paintAltar(ctx) {
  ctx.save();
  ctx.translate(960, 920);
  ctx.fillStyle = "rgba(50,70,75,0.7)";
  ctx.beginPath();
  ctx.moveTo(-140, 40);
  ctx.lineTo(140, 40);
  ctx.lineTo(110, 70);
  ctx.lineTo(-110, 70);
  ctx.closePath();
  ctx.fill();
  rimLight(ctx, () => {
    ctx.moveTo(-140, 40);
    ctx.lineTo(140, 40);
    ctx.lineTo(110, 70);
    ctx.lineTo(-110, 70);
  }, { color: "180,230,240", alpha: 0.3, width: 2 });
  ctx.restore();
}

export const calderaChamber = {
  id: "calderaChamber",
  name: "The Caldera — The Drowned Bell",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintWater(ctx);
    lightWash(ctx, [960, 0, 960, 900], "180,235,245", 0.1);
    paintColumns(ctx);
    paintAltar(ctx);
    paintBell(ctx, !!state?.flags?.drowned_bell_awakened);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "columns",
      name: "Sunken Colonnade",
      nameZh: "沉沒的柱廊",
      kind: "scenery",
      polygon: [[200, 500], [640, 500], [640, 860], [200, 860]],
      responses: {
        look: "Worked stone, not natural rock — a hall built by hands, and drowned by something bigger than any of them.\n經過雕琢的石頭,不是天然岩石——這是一座人工建造的大廳,卻被比任何人都巨大的東西給淹沒了。",
        default: "Nothing here but the weight of a very long time.\n這裡除了漫長歲月的重量,什麼也沒有。",
      },
    },
    {
      id: "altar",
      name: "The Drowned Bell of Atlantis",
      nameZh: "亞特蘭提斯沉鐘",
      kind: "scenery",
      polygon: [[820, 680], [1100, 680], [1100, 960], [820, 960]],
      hideWhenFlag: "drowned_bell_awakened",
      responses: {
        look: "Bronze gone the colour of the sea itself, and silent — but not dead. Three Voices found it. Maybe three Voices can wake it.\n青銅早已染上大海本身的顏色,寂靜無聲——但並非死寂。三個「聲音」找到了它,或許三個「聲音」也能喚醒它。",
        use: "Salt Conch, Storm Fork, Star Bell — he's carried all three of them this far for exactly this moment.\n鹽螺、風暴音叉、星辰鐘——他一路帶著這三樣東西,就是為了這一刻。",
        default: "This is what the whole trip was for.\n這趟旅程,為的就是這一刻。",
      },
      puzzleOnVerb: { use: "drowned_bell_finale" },
    },
    {
      id: "altar_awake",
      name: "The Drowned Bell of Atlantis",
      nameZh: "亞特蘭提斯沉鐘",
      kind: "scenery",
      polygon: [[820, 680], [1100, 680], [1100, 960], [820, 960]],
      responses: {
        look: "Ringing still, a note underneath hearing, and the whole chamber lit like the sea forgot it was supposed to be dark down here.\n鐘聲依舊迴盪,一個幾乎聽不見的音符,整個殿堂亮得彷彿大海忘了這裡本該一片漆黑。",
        default: "It's done what it was going to do. The rest is just standing here, watching.\n它該做的都做完了。剩下的,就只是站在這裡看著。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default calderaChamber;

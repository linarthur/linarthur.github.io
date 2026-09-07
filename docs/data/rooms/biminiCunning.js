// data/rooms/biminiCunning.js — Act 2, Cunning Path: the Adriatic Salvage
// Consortium's own dockyard on Bimini. The centerpiece con of this path
// (design doc: "a full con on the Consortium's dockyard") — forge a
// requisition form, talk the foreman into believing it, dive alone.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, paintWorldItem } from "../../engine/artHelpers.js";
import { getItem } from "../items.js";

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

// The requisition form and seal sold no visual before this — same fix as
// donanaCunning.js's desk and saharaCunning.js's stall: reuse each item's
// own inventory icon (data/items.js), tucked between the crates, hidden
// once picked up (or combined into forged_requisition).
function paintCrateItems(ctx, state) {
  const inv = state?.inventory || [];
  if (!inv.includes("requisition_form") && !inv.includes("forged_requisition")) {
    paintWorldItem(ctx, getItem("requisition_form"), 255, 765, 38);
  }
  if (!inv.includes("official_seal") && !inv.includes("forged_requisition")) {
    paintWorldItem(ctx, getItem("official_seal"), 375, 775, 30);
  }
}

function paintFerro(ctx) {
  // Glimpsed at a distance — recurring obstacle, not present here.
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.translate(1720, 700);
  ctx.fillStyle = "#1c2430";
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 90, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -100, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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

  // water beyond the dock edge
  const water = paintedGradient(ctx, 0, 640, 0, 700, [
    [0, "#3fa8b8"],
    [1, "#1c6c80"],
  ]);
  ctx.fillStyle = water;
  ctx.fillRect(0, 640, W, 60);
}

function paintForeman(ctx) {
  ctx.save();
  ctx.translate(1000, 860);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a4a4a";
  ctx.beginPath();
  ctx.moveTo(-28, 70);
  ctx.lineTo(-20, -55);
  ctx.quadraticCurveTo(0, -75, 20, -55);
  ctx.lineTo(28, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a5f";
  ctx.beginPath();
  ctx.arc(0, -70, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c2118";
  ctx.beginPath();
  ctx.ellipse(0, -86, 22, 10, 0, 0, Math.PI * 2);
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

export const biminiCunning = {
  id: "biminiCunning",
  name: "Bimini, Bahamas — The Consortium Dockyard",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [960, 0, 960, 700], "255,230,190", 0.12);
    paintFerro(ctx);
    paintDock(ctx);
    paintCrates(ctx);
    paintCrateItems(ctx, state);
    paintForeman(ctx);
    paintLadder(ctx, !!state?.flags?.star_bell_found);
    vignette(ctx, W, H, 0.45);
  },

  hotspots: [
    {
      id: "foreman",
      name: "Dockyard Foreman",
      kind: "actor",
      polygon: [[940, 780], [1060, 780], [1060, 950], [940, 950]],
      dialogue: "foreman_bimini",
      responses: {
        look: "A Consortium foreman, clipboard in hand, checking every crate against a manifest and every diver against a list he clearly takes seriously.\n聯盟的工頭，手拿板夾，逐一核對每個板條箱和貨單，也逐一核對每個潛水員和名單——顯然他很把這件事當回事。",
        give: {
          forged_requisition:
            "He barely glances at the form before waving toward the ladder. \"Should've said.\" He still hasn't asked a single question.\n他只瞄了表格一眼，就朝梯子揮揮手。「早說嘛。」他連一個問題都沒問。",
          default: "He's not accepting deliveries. Paperwork's the only thing he wants to see.\n他不收貨。他只想看文件。",
        },
        default: "He's not letting anyone near that ladder without paperwork.\n沒有文件，誰都別想靠近那座梯子。",
      },
    },
    {
      id: "crates",
      name: "Consortium Crates",
      kind: "scenery",
      polygon: [[200, 720], [420, 720], [420, 860], [200, 860]],
      responses: {
        look: "Salvage gear, stencilled with the same crest as everything else the Consortium touches. Somewhere in this stack is exactly the paperwork he needs — or the makings of it.\n打撈裝備，印著跟聯盟所有東西一樣的徽記。這堆箱子裡的某處，正藏著他需要的文件——或是能拼湊出來的材料。",
        default: "Best not to be caught rifling through Consortium property in the open.\n光天化日之下翻聯盟的財產，最好別被逮到。",
      },
    },
    {
      id: "ferro_glimpse",
      name: "A Figure on the Far Pier",
      kind: "scenery",
      polygon: [[1650, 560], [1800, 560], [1800, 780], [1650, 780]],
      responses: {
        look: "Big enough to be mistaken for part of the crane, if the crane occasionally turned to watch you. Ferro, Draghi's salvage master, doesn't so much as glance over. Best keep it that way.\n塊頭大到可以被誤認成吊車的一部分，如果吊車偶爾會轉頭盯著你看的話。德拉基的打撈總管費羅，連瞄都沒瞄過來一眼。最好繼續保持這樣。",
        default: "Whatever he's doing over there, it's not worth the walk to find out.\n他在那邊做什麼，不值得走過去一探究竟。",
      },
    },
    {
      id: "bell_site",
      name: "The Dive Ladder",
      kind: "exit",
      polygon: [[1350, 640], [1450, 640], [1450, 760], [1350, 760]],
      hideWhenFlag: "star_bell_found",
      requiresItem: "forged_requisition",
      lockedLine: "Not past the foreman without paperwork that says he's allowed down that ladder.\n沒有文件證明他有權下那座梯子，工頭是不會放行的。",
      to: { room: "biminiCunningDive", spawn: { x: 900, y: 900, facing: "down" } },
      fallCaption: "The foreman barely glances at the requisition before waving him through. Down the ladder, into the water alone.\n工頭只瞄了申請書一眼就揮手放行。順著梯子而下，獨自潛入水中。",
      responses: {
        look: "A steel ladder down to the water, and from there, the wreck.\n一座通往水面的鋼梯，再往下，就是那艘沉船。",
      },
    },
  ],

  items: [
    {
      id: "requisition_form",
      polygon: [[230, 740], [280, 740], [280, 790], [230, 790]],
      responses: {
        look: "A blank Consortium dive-authorisation form, tucked between two crates.\n一張空白的聯盟潛水許可表格，塞在兩個板條箱之間。",
      },
    },
    {
      id: "official_seal",
      polygon: [[350, 750], [400, 750], [400, 800], [350, 800]],
      responses: {
        look: "A wax-and-ribbon seal, still attached to a shipping manifest nobody's checked in weeks.\n一枚火漆緞帶封印，還黏在一張已經好幾週沒人核對過的貨運單上。",
      },
    },
  ],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default biminiCunning;

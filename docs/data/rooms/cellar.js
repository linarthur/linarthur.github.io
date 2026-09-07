// data/rooms/cellar.js — Prologue Room 4 of 5: The Root Cellar.
// A wall of barrels blocks the last stairwell down to the sub-basement.
//
// Art retrofitted to the Act 1 technique bar (engine/artHelpers.js).

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [280, 700], [1640, 700], [1740, 960], [180, 960],
];

function paintWalls(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 760, [
    [0, "#180f09"],
    [0.5, "#241a14"],
    [1, "#3a291c"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 760);

  // brick arches
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    const cx = 260 + i * 480;
    ctx.beginPath();
    ctx.moveTo(cx - 200, 760);
    ctx.quadraticCurveTo(cx, 380, cx + 200, 760);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let row = 0; row < 6; row++) {
    for (let x = (row % 2) * 60; x < W; x += 120) {
      ctx.fillRect(x, 40 + row * 60, 100, 4);
    }
  }

  // wine rack along the back wall
  ctx.save();
  ctx.translate(1500, 560);
  ctx.fillStyle = "#2c2118";
  ctx.fillRect(-140, -80, 280, 200);
  ctx.fillStyle = "#5c3d22";
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      ctx.beginPath();
      ctx.arc(-125 + col * 48, -60 + row * 46, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 700, 0, H, [
    [0, "#3a2a1c"],
    [1, "#140e08"],
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

function paintBarrels(ctx, moved) {
  ctx.save();
  const offset = moved ? 350 : 0;
  ctx.translate(700 + offset, 820);
  const positions = [[-70, 0], [0, -10], [70, 0], [-35, -80], [35, -80]];
  positions.forEach(([dx, dy]) => {
    ctx.save();
    ctx.translate(dx, dy);
    ctx.fillStyle = "#6a4c2e";
    ctx.beginPath();
    ctx.roundRect(-38, -50, 76, 100, 20);
    ctx.fill();
    rimLight(ctx, () => ctx.roundRect(-38, -50, 76, 100, 20), { color: "230,190,140", alpha: 0.3, width: 2 });
    ctx.strokeStyle = "#3a2a1a";
    ctx.lineWidth = 4;
    ctx.strokeRect(-38, -50, 76, 100);
    ctx.beginPath();
    ctx.moveTo(-38, -18);
    ctx.lineTo(38, -18);
    ctx.moveTo(-38, 18);
    ctx.lineTo(38, 18);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

function paintDoorway(ctx, open) {
  ctx.save();
  ctx.translate(700, 830);
  ctx.fillStyle = open ? "#050505" : "#1a120b";
  ctx.beginPath();
  ctx.moveTo(-90, 130);
  ctx.lineTo(-90, -40);
  ctx.quadraticCurveTo(0, -100, 90, -40);
  ctx.lineTo(90, 130);
  ctx.closePath();
  ctx.fill();
  if (!open) {
    ctx.strokeStyle = "#4a3a28";
    ctx.lineWidth = 6;
    for (let y = -20; y < 120; y += 30) {
      ctx.beginPath();
      ctx.moveTo(-85, y);
      ctx.lineTo(85, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export const cellar = {
  id: "cellar",
  name: "Barnett Hall — Root Cellar",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    const moved = !!state?.flags?.barrels_moved;
    paintWalls(ctx);
    paintFloor(ctx);
    paintDoorway(ctx, moved);
    paintBarrels(ctx, moved);
    lightWash(ctx, [960, 100, 960, 760], "230,190,140", 0.08);
    vignette(ctx, W, H, 0.55);
  },

  hotspots: [
    {
      id: "barrel_stack",
      name: "Barrel Stack",
      kind: "scenery",
      polygon: [[590, 650], [850, 650], [850, 900], [590, 900]],
      hideWhenFlag: "barrels_moved",
      responses: {
        look: "Five barrels of the Dean's private cider, stacked square across the old stairwell door. Someone wanted this way sealed.\n五桶院長私藏的蘋果酒，整整齊齊堆在舊樓梯門前。看來有人存心要把這條路封死。",
        push: "He sets his shoulder against the stack and shoves. It rumbles aside, unsealing a low archway beyond.\n他用肩膀頂住桶堆用力一推。木桶轟隆隆地滾開，露出後面一道低矮的拱門。",
        pull: "He'd need three more hands to pull these without them landing on his feet. Pushing is the safer bet.\n要用拉的又不砸到自己的腳，他還得多長三隻手才行。用推的比較保險。",
        default: "Barrels. Heavy ones. Pushing seems the only sensible plan.\n木桶，而且很重。看來用推的才是唯一合理的辦法。",
      },
      setFlagOn: { push: "barrels_moved" },
    },
    {
      id: "winerack",
      name: "Wine Rack",
      kind: "scenery",
      polygon: [[1360, 480], [1640, 480], [1640, 680], [1360, 680]],
      responses: {
        look: "Dust an inch thick on every bottle. The label on the nearest one reads 1911 — a very good year, apparently, for a war nobody saw coming yet either.\n每一瓶都積了一吋厚的灰塵。最近那瓶的標籤寫著1911年——聽說是個豐收的年份，同時也是誰都沒料到的一場戰爭前夕。",
        take: "Tempting, but this isn't the moment to be caught looting the faculty cellar.\n是很誘人啦，但現在被抓到在教職員酒窖裡順手牽羊，時機實在不對。",
        default: "Best to leave the vintage where it is.\n這些陳年好酒還是留在原地比較好。",
      },
    },
    {
      id: "old_crates",
      name: "Stack of Old Crates",
      kind: "scenery",
      polygon: [[200, 780], [360, 780], [360, 920], [200, 920]],
      responses: {
        look: "Empty shipping crates, stencilled with a dozen dead departments. 'ANTHROPOLOGY — DISSOLVED 1927' is the newest one.\n一堆空的貨運箱，上面印著十幾個已經廢除的系所名稱。「人類學系——1927年解散」是最新的一個。",
        open: "Empty, all of them. Barnett College has never once thrown anything away.\n全是空的，一個不剩。巴奈特學院從來沒丟過任何東西。",
        default: "Just old boxes. Nothing worth the detour.\n只是些舊箱子，不值得繞路過去看。",
      },
    },
    {
      id: "stair_door",
      name: "Stairwell Archway",
      kind: "exit",
      polygon: [[610, 780], [790, 780], [790, 960], [610, 960]],
      requiresFlag: "barrels_moved",
      lockedLine: "Blocked solid with barrels. Those will need moving first.\n完全被木桶堵死了，得先把它們搬開才行。",
      to: { room: "subbasement", spawn: { x: 960, y: 900, facing: "down" } },
      fallCaption: "The last stairwell drops him, wet-footed, into the flooded sub-basement.\n最後一段樓梯把他送了下去，兩腳濕透，跌進淹水的地下室。",
      responses: {
        look: "A low brick archway, cold air and the smell of standing water drifting up from below.\n一道低矮的磚拱門，冷空氣夾雜著積水的氣味從下方飄上來。",
      },
    },
  ],

  items: [],

  actorStart: { x: 330, y: 900, facing: "right" },
};

export default cellar;

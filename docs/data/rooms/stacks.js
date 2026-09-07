// data/rooms/stacks.js — Prologue Room 2 of 5: The Stacks.
// A toppled bookshelf blocks the only way further down. Push it aside.
//
// Art retrofitted to the Act 1 technique bar (engine/artHelpers.js).

import { vignette, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [220, 700], [1700, 700], [1780, 970], [140, 970],
];

function paintWalls(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 760, [
    [0, "#10161f"],
    [0.5, "#1a2430"],
    [1, "#2c3a48"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 760);

  // standing shelves, receding rows
  const shelfXs = [80, 1720];
  shelfXs.forEach((x) => {
    ctx.save();
    ctx.translate(x, 0);
    for (let row = 0; row < 3; row++) {
      const y = 120 + row * 170;
      ctx.fillStyle = "#2e2118";
      ctx.fillRect(-60, y, 120, 150);
      ctx.strokeStyle = "#1a120b";
      ctx.lineWidth = 4;
      ctx.strokeRect(-60, y, 120, 150);
      // book spines
      for (let i = -50; i < 50; i += 14) {
        ctx.fillStyle = ["#7a3b3b", "#3b5a4a", "#6a5a2e", "#3b4a6a"][Math.floor(Math.random() * 4)];
        ctx.fillRect(i, y + 10, 10, 130);
      }
    }
    ctx.restore();
  });

  const dustBeam = ctx.createLinearGradient(700, 0, 1200, 900);
  dustBeam.addColorStop(0, "rgba(217,190,140,0)");
  dustBeam.addColorStop(0.5, "rgba(217,190,140,0.08)");
  dustBeam.addColorStop(1, "rgba(217,190,140,0)");
  ctx.fillStyle = dustBeam;
  ctx.beginPath();
  ctx.moveTo(820, 0);
  ctx.lineTo(1020, 0);
  ctx.lineTo(1200, 900);
  ctx.lineTo(700, 900);
  ctx.closePath();
  ctx.fill();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 700, 0, H, [
    [0, "#3a2f22"],
    [1, "#181209"],
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

  // scattered books
  const spots = [[400, 880], [520, 920], [1400, 890], [1550, 940]];
  spots.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() - 0.5);
    ctx.fillStyle = "#6a5a2e";
    ctx.fillRect(-20, -14, 40, 28);
    ctx.restore();
  });
}

function paintToppledShelf(ctx, moved) {
  ctx.save();
  ctx.translate(960, 800);
  const angle = moved ? -0.9 : -0.15;
  ctx.rotate(angle);
  ctx.translate(moved ? -260 : 0, moved ? 40 : 0);
  ctx.fillStyle = "#3a2a1c";
  ctx.fillRect(-140, -260, 130, 260);
  rimLight(ctx, () => ctx.rect(-140, -260, 130, 260), { color: "230,200,150", alpha: 0.3, width: 2 });
  ctx.strokeStyle = "#241a10";
  ctx.lineWidth = 5;
  ctx.strokeRect(-140, -260, 130, 260);
  for (let i = -230; i < -30; i += 40) {
    ctx.strokeStyle = "#1a120b";
    ctx.beginPath();
    ctx.moveTo(-140, i);
    ctx.lineTo(-10, i);
    ctx.stroke();
  }
  ctx.restore();
}

function paintLamp(ctx) {
  ctx.save();
  ctx.translate(1600, 850);
  // toppled brass lamp, base up, cord trailing off toward the wall
  ctx.rotate(0.35);
  ctx.strokeStyle = "#4a3a28";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-90, 30);
  ctx.stroke();
  ctx.fillStyle = "#8a6a3e";
  ctx.fillRect(-14, -6, 28, 60);
  rimLight(ctx, () => ctx.rect(-14, -6, 28, 60), { color: "255,220,170", alpha: 0.35, width: 2 });
  ctx.beginPath();
  ctx.moveTo(-30, -6);
  ctx.lineTo(30, -6);
  ctx.lineTo(18, -46);
  ctx.lineTo(-18, -46);
  ctx.closePath();
  ctx.fillStyle = "#c9a468";
  ctx.fill();
  ctx.strokeStyle = "#3a2c1c";
  ctx.lineWidth = 2;
  ctx.stroke();
  // a faint spill of light from the still-warm bulb
  const glow = ctx.createRadialGradient(0, -20, 4, 0, -20, 70);
  glow.addColorStop(0, "rgba(255,230,180,0.3)");
  glow.addColorStop(1, "rgba(255,230,180,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -20, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintHole(ctx, moved) {
  if (!moved) return;
  ctx.save();
  ctx.translate(960, 900);
  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.ellipse(0, 0, 150, 65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4a3a28";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();
}

export const stacks = {
  id: "stacks",
  name: "Barnett Hall — The Stacks",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    const moved = !!state?.flags?.shelf_moved;
    paintWalls(ctx);
    paintFloor(ctx);
    paintHole(ctx, moved);
    paintToppledShelf(ctx, moved);
    paintLamp(ctx);
    vignette(ctx, W, H, 0.55);
  },

  hotspots: [
    {
      id: "toppled_shelf",
      name: "Toppled Shelf",
      kind: "scenery",
      polygon: [[830, 560], [1090, 560], [1090, 790], [830, 790]],
      hideWhenFlag: "shelf_moved",
      responses: {
        look: "A whole shelf of card-catalogue drawers, face-down over what used to be a stairwell landing. It's heavy, but it isn't pinned to anything.\n整座卡片目錄櫃，正面朝下倒在原本是樓梯平台的地方。很重，但沒有固定住。",
        push: "He gets a shoulder under it and heaves. It groans across the floorboards and drags clear, opening a ragged gap down.\n他用肩膀頂住用力一推。櫃子在地板上嘎吱作響，被推開了，露出一個往下的破口。",
        pull: "Pulling gets him nowhere but a faceful of dust. Pushing looks more promising.\n用拉的只換來一臉灰塵，什麼也拉不動。用推的看起來比較有希望。",
        default: "It's not going anywhere by staring at it.\n光是站著瞪它，它是不會自己動的。",
      },
      setFlagOn: { push: "shelf_moved" },
    },
    {
      id: "catalogue",
      name: "Card Catalogue",
      kind: "scenery",
      polygon: [[100, 750], [260, 750], [260, 900], [100, 900]],
      responses: {
        look: "Drawers and drawers of index cards, alphabetised by a system only the late Miss Pruitt ever understood.\n一格又一格的索引卡，按照某種只有已故的普魯特小姐才懂的系統排列。",
        open: "A drawer slides free: 'ATLANTIS — see also MYTH, NONSENSE, TENURE DENIED.' Someone had a sense of humor.\n抽屜滑了出來：「亞特蘭提斯——參見：神話、胡說八道、終身教職遭拒。」有人挺幽默的。",
        default: "It's just a catalogue. It's not going to help him get down any faster.\n這只是個目錄櫃，沒辦法幫他更快下去。",
      },
    },
    {
      id: "reading_lamp",
      name: "Fallen Reading Lamp",
      kind: "scenery",
      polygon: [[1550, 800], [1660, 800], [1660, 900], [1550, 900]],
      responses: {
        look: "Knocked clean off someone's desk, still faintly warm. Whoever was reading here left in a hurry.\n從桌上被打翻下來的，還帶著一點餘溫。在這裡看書的人顯然是匆忙離開的。",
        take: "The cord's still attached to the wall. It's not coming with him.\n電線還接在牆上，沒辦法帶走。",
        default: "It's not much use to him now.\n現在對他也沒什麼用。",
      },
    },
    {
      id: "hole_down",
      name: "Gap in the Floor",
      kind: "exit",
      polygon: [[860, 850], [1080, 850], [1080, 960], [860, 960]],
      requiresFlag: "shelf_moved",
      lockedLine: "The shelf's still blocking the way — that'll need pushing aside first.\n書架還擋著路——得先把它推開才行。",
      to: { room: "boiler", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "Through the gap, down a rattling chute, into the heat and hiss of the boiler room.\n穿過缺口，順著搖晃作響的滑道而下，跌進鍋爐房的悶熱與嘶嘶蒸氣聲中。",
      responses: {
        look: "A dark gap, warm air rising out of it. Something down there is running hot.\n一個黑漆漆的缺口，暖空氣從下面冒上來。下面有什麼東西正發燙著。",
      },
    },
  ],

  items: [],

  actorStart: { x: 350, y: 900, facing: "right" },
};

export default stacks;

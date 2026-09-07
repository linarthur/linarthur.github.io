// data/rooms/donanaCunning.js — Act 2, Cunning Path: the Doñana marshes,
// solo. No Mo — instead, a warden's checkpoint blocks the marsh, and the
// "two person" puzzle becomes a one-person forgery: find a blank permit,
// find the Consortium's own stamp, and let paperwork do the talking.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, paintWorldItem } from "../../engine/artHelpers.js";
import { getItem } from "../items.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [200, 740], [1720, 740], [1820, 990], [100, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 640, [
    [0, "#7a9cb0"],
    [0.5, "#b8ccb0"],
    [1, "#d8c890"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 640);
}

function paintShack(ctx) {
  ctx.save();
  ctx.translate(1420, 500);
  const wall = paintedGradient(ctx, -160, -160, 160, 160, [
    [0, "#8a6a45"],
    [1, "#5c4028"],
  ]);
  ctx.fillStyle = wall;
  ctx.fillRect(-160, -140, 320, 280);
  rimLight(ctx, () => ctx.rect(-160, -140, 320, 280), { color: "255,230,190", alpha: 0.3, width: 3 });
  ctx.fillStyle = "#3a281c";
  ctx.beginPath();
  ctx.moveTo(-180, -140);
  ctx.lineTo(0, -230);
  ctx.lineTo(180, -140);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#241a10";
  ctx.fillRect(-40, 40, 80, 100);
  ctx.restore();
}

function paintReeds(ctx) {
  ctx.save();
  for (let i = 0; i < 30; i++) {
    const x = (i * 151) % W;
    const h = 70 + ((i * 47) % 110);
    const y = 560 - h;
    ctx.strokeStyle = `rgba(90,110,60,${0.3 + (i % 5) * 0.06})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 620);
    ctx.quadraticCurveTo(x + 8, y + 30, x + 4, y);
    ctx.stroke();
  }
  ctx.restore();
}

function paintWater(ctx) {
  const g = paintedGradient(ctx, 0, 640, 0, H, [
    [0, "#a8c8b8"],
    [0.5, "#6fa090"],
    [1, "#3a5c50"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.lineTo(W, 640);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 640, w: W, h: H - 640, vanishX: 960, speckleColor: "rgba(255,255,255,0.06)" });
}

function paintWarden(ctx) {
  ctx.save();
  ctx.translate(1200, 860);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4a5c3a";
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
  ctx.ellipse(0, -86, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// The warden's desk (and the permit/stamp sitting on it) had no visual at
// all before this — just an invisible hotspot/item polygon over open
// ground, so the pickups looked broken. Draws right where the "desk",
// "blank_permit", and "consortium_stamp" polygons below already are.
function paintDesk(ctx) {
  ctx.save();
  ctx.translate(1575, 700);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 55, 90, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6a4c34";
  ctx.beginPath();
  ctx.roundRect(-85, -10, 170, 50, 4);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-85, -10, 170, 50, 4), { color: "255,220,170", alpha: 0.3, width: 2 });
  ctx.strokeStyle = "#4a3423";
  ctx.lineWidth = 3;
  ctx.strokeRect(-85, -10, 170, 50);
  ctx.fillStyle = "#4a3423";
  ctx.fillRect(-78, 38, 10, 40);
  ctx.fillRect(68, 38, 10, 40);
  ctx.restore();
}

// Reuses each item's own inventory-slot icon (data/items.js) to draw it
// sitting on the desk, hidden once picked up (or, for the pair, once
// combined into the forged_permit — see the combinesWith handling in
// engine/main.js's runAction, same rule worldItems() already uses there).
function paintDeskItems(ctx, state) {
  const inv = state?.inventory || [];
  if (!inv.includes("blank_permit") && !inv.includes("forged_permit")) {
    paintWorldItem(ctx, getItem("blank_permit"), 1550, 675, 40);
  }
  if (!inv.includes("consortium_stamp") && !inv.includes("forged_permit")) {
    paintWorldItem(ctx, getItem("consortium_stamp"), 1615, 685, 40);
  }
}

function paintConch(ctx, found) {
  if (found) return;
  ctx.save();
  ctx.translate(1560, 940);
  ctx.fillStyle = "#d9c7a8";
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 16, 0.3, 0, Math.PI * 2);
  ctx.fill();
  rimLight(ctx, () => ctx.ellipse(0, 0, 26, 16, 0.3, 0, Math.PI * 2), { color: "255,240,210", alpha: 0.4, width: 2 });
  ctx.restore();
}

function paintChannelOut(ctx) {
  ctx.save();
  ctx.translate(1745, 860);
  // a narrow open channel through the reeds, with a punt waiting
  ctx.fillStyle = "#2c4c44";
  ctx.beginPath();
  ctx.ellipse(0, 0, 80, 130, 0, 0, Math.PI * 2);
  ctx.fill();
  rimLight(ctx, () => ctx.ellipse(0, 0, 80, 130, 0, 0, Math.PI * 2), { color: "220,240,230", alpha: 0.3, width: 2 });
  ctx.fillStyle = "#5c4028";
  ctx.beginPath();
  ctx.ellipse(0, 30, 46, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3a281c";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

export const donanaCunning = {
  id: "donanaCunning",
  name: "Doñana Marshes — Cádiz, Spain",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    paintReeds(ctx);
    lightWash(ctx, [960, 0, 960, 640], "255,240,200", 0.12);
    paintShack(ctx);
    paintWater(ctx);
    paintChannelOut(ctx);
    paintDesk(ctx);
    paintDeskItems(ctx, state);
    paintWarden(ctx);
    paintConch(ctx, !!state?.flags?.salt_conch_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "warden",
      name: "Marsh Warden",
      kind: "actor",
      polygon: [[1140, 780], [1260, 780], [1260, 950], [1140, 950]],
      responses: {
        look: "A warden in a faded uniform, more interested in his paperwork than the marsh itself. He hasn't looked up once.\n一位制服褪色的巡警，對文書工作的興趣遠勝過沼澤本身。他一次都沒抬過頭。",
        talk: "\"No permit, no marsh,\" he says, without looking up. \"Rules are rules.\"\n「沒有許可證，就別想進沼澤，」他頭也不抬地說。「規矩就是規矩。」",
        give: {
          forged_permit:
            "He barely glances at it before stamping the air with an invisible rubber stamp of pure disinterest. \"Should've said so.\" He still hasn't looked up.\n他只是瞄了一眼，就用一枚看不見的橡皮章在空中蓋下純粹的興趣缺缺。「早說嘛。」他還是沒抬頭。",
          default: "He'd want to see it in writing, not in hand.\n他要看的是白紙黑字，不是空口白話。",
        },
        default: "He's not moving until the paperwork's in order.\n文件不齊，他是不會讓路的。",
      },
    },
    {
      id: "desk",
      name: "Warden's Desk",
      kind: "scenery",
      polygon: [[1500, 620], [1650, 620], [1650, 760], [1500, 760]],
      responses: {
        look: "A cluttered desk just inside the shack door — permits, forms, and a heavy brass stamp, all left carelessly in reach.\n小屋門邊一張雜亂的桌子——許可證、表格，還有一枚沉甸甸的黃銅印章，全都隨手擺在伸手可及之處。",
        default: "Nothing here he needs to do more than look and take.\n這裡不需要多做什麼，看一眼、拿了就走。",
      },
    },
    {
      id: "reeds",
      name: "Reed Bank",
      kind: "scenery",
      polygon: [[60, 400], [320, 400], [320, 640], [60, 640]],
      responses: {
        look: "Head-high reeds. A punt is tied off somewhere in there, for whoever the warden decides can use it.\n齊頭高的蘆葦叢。裡頭某處繫著一艘平底船，就看巡警願不願意讓誰用。",
        default: "Nothing to do here but wait on the warden's good graces — or the paperwork to fake them.\n這裡除了等巡警開恩，或是偽造一份文件讓他「開恩」，也沒別的事可做。",
      },
    },
    {
      id: "conch_site",
      name: "Half-Buried Shell",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "salt_conch_found",
      puzzleRequiresItem: "forged_permit",
      responses: {
        look: {
          forged_permit:
            "Still half-buried, still out of reach — but paper like this has a way of making a warden forget where his own shack ends.\n仍然半埋在泥裡，仍然搆不著——不過這種紙，總有辦法讓巡警忘記自家小屋的地界在哪。",
          default:
            "Something pale and spiral-ridged, humming faintly under the mud whenever the wind drops. The warden's shack blocks the only dry path to it.\n某個蒼白、螺旋紋路的東西，每當風停下來就在泥下微微嗡鳴。巡警的小屋擋住了唯一一條乾燥的路。",
        },
        use: "Not without the warden waving him through first — and he's not waving anyone through without paper.\n沒有巡警放行是不行的——而他不見到白紙黑字，是誰都不會放行的。",
        default: "It's not coming free without a plan.\n沒有計畫，這東西是不會鬆動的。",
      },
      puzzleOnVerb: { use: "salt_conch_resonance" },
    },
    {
      id: "boat_launch",
      name: "Channel Out",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "salt_conch_found",
      lockedLine: "No sense leaving the marsh without the conch.\n沒拿到海螺就離開沼澤，一點道理也沒有。",
      to: { room: "saharaCunning", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "The forged permit gets him out as easily as it got him in. Punt, train, and a very long journey later, the marsh gives way to the Sahara.\n那張偽造的許可證讓他出去時跟進來時一樣順利。搭了平底船、坐了火車，經過一段漫長的旅程後，沼澤終於換成了撒哈拉沙漠。",
      responses: {
        look: "The channel back out toward dry land.\n通往乾地的水道。",
      },
    },
  ],

  items: [
    {
      id: "blank_permit",
      polygon: [[1520, 650], [1580, 650], [1580, 700], [1520, 700]],
      responses: {
        look: "A blank marsh-access permit, official letterhead and all.\n一張空白的沼澤通行證，連官方信頭都齊全。",
      },
    },
    {
      id: "consortium_stamp",
      polygon: [[1590, 660], [1640, 660], [1640, 710], [1590, 710]],
      responses: {
        look: "A brass desk stamp bearing the Adriatic Salvage Consortium's crest. Someone here has been doing business with Draghi's people.\n一枚刻著亞得里亞海撈財聯盟徽記的黃銅印章。看來這裡有人一直在跟德拉基的人打交道。",
      },
      setFlagOn: { look: "learned_consortium_at_donana" },
    },
  ],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default donanaCunning;

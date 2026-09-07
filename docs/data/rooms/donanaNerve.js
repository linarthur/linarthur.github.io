// data/rooms/donanaNerve.js — Act 2, Nerve Path: the Doñana marshes, solo,
// with a Consortium patrol skiff already closing on the reed line. No
// permit, no partner — just a half-rotten boardwalk to cross before they
// cut him off from the conch. The design doc bars any combat minigame
// that can kill the hero; losing the footwork sequence only costs him a
// few seconds; the skiff never actually catches up.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [200, 740], [1720, 740], [1820, 990], [100, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 640, [
    [0, "#6f8ca0"],
    [0.5, "#a8bca0"],
    [1, "#c8b880"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 640);
}

function paintReeds(ctx) {
  ctx.save();
  for (let i = 0; i < 34; i++) {
    const x = (i * 143) % W;
    const h = 70 + ((i * 47) % 110);
    const y = 560 - h;
    ctx.strokeStyle = `rgba(80,100,55,${0.32 + (i % 5) * 0.06})`;
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
    [0, "#9cbca8"],
    [0.5, "#5f9080"],
    [1, "#334c42"],
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

function paintSkiff(ctx) {
  ctx.save();
  ctx.translate(300, 700);
  ctx.fillStyle = "rgba(30,35,30,0.85)";
  ctx.beginPath();
  ctx.moveTo(-70, 20);
  ctx.quadraticCurveTo(-80, 0, -50, -10);
  ctx.lineTo(50, -10);
  ctx.quadraticCurveTo(80, 0, 70, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#3a2a1c";
  ctx.fillRect(-10, -40, 20, 32);
  rimLight(ctx, () => ctx.rect(-70, -10, 140, 30), { color: "220,230,255", alpha: 0.15, width: 2 });
  ctx.restore();
}

function paintBoardwalk(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(120,100,70,0.6)";
  ctx.lineWidth = 6;
  for (let i = 0; i < 8; i++) {
    const x = 700 + i * 90;
    ctx.beginPath();
    ctx.moveTo(x, 860);
    ctx.lineTo(x + 40, 860);
    ctx.lineTo(x + 40, 895);
    ctx.lineTo(x, 895);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
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

export const donanaNerve = {
  id: "donanaNerve",
  name: "Doñana Marshes — Cádiz, Spain",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    paintReeds(ctx);
    lightWash(ctx, [960, 0, 960, 640], "255,240,200", 0.12);
    paintWater(ctx);
    paintSkiff(ctx);
    paintBoardwalk(ctx);
    paintChannelOut(ctx);
    paintConch(ctx, !!state?.flags?.salt_conch_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "skiff",
      name: "Consortium Patrol Skiff",
      kind: "scenery",
      polygon: [[220, 660], [420, 660], [420, 760], [220, 760]],
      responses: {
        look: "A low grey skiff, engine idling, working its way along the channel toward the reed line. They haven't spotted him yet — but they will.\n一艘灰色的低矮巡邏艇，引擎還在空轉，正沿著水道朝蘆葦叢摸過來。他們還沒發現他——但遲早會。",
        default: "Best not to wait around and find out how fast that thing can move.\n最好別留在這裡驗證那艘船到底能開多快。",
      },
    },
    {
      id: "reeds",
      name: "Reed Bank",
      kind: "scenery",
      polygon: [[60, 400], [320, 400], [320, 640], [60, 640]],
      responses: {
        look: "Head-high reeds — good cover, if the skiff's crew are as lazy about looking as they are about steering.\n齊頭高的蘆葦叢——只要那艘船上的人跟開船一樣懶得看，這裡就是不錯的掩護。",
        default: "Nothing to do here but keep moving.\n在這裡沒什麼好做的，繼續走吧。",
      },
    },
    {
      id: "boardwalk",
      name: "Rotten Boardwalk",
      kind: "scenery",
      polygon: [[680, 800], [1420, 800], [1420, 920], [680, 920]],
      hideWhenFlag: "donana_boardwalk_crossed",
      responses: {
        look: "A half-collapsed plank walkway is the only dry line across to the far bank. Half the boards look ready to give.\n一條半坍塌的木棧道，是唯一能乾著腳走到對岸的路。一半的木板看起來隨時會斷。",
        use: "No time to test each board — better to move fast and trust his feet.\n沒時間一塊一塊木板去試——不如放膽衝過去，相信自己的腳。",
        default: "Standing here just gives the skiff more time to close the distance.\n站在這裡只會讓那艘船有更多時間追上來。",
      },
      puzzleOnVerb: { use: "donana_pursuit" },
    },
    {
      id: "conch_site",
      name: "Half-Buried Shell",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "salt_conch_found",
      puzzleRequiresFlag: "donana_boardwalk_crossed",
      responses: {
        look: "Something pale and spiral-ridged, humming faintly under the mud whenever the wind drops.\n泥裡埋著一個蒼白帶螺紋的東西，風一停就隱約傳出嗡鳴。",
        use: "Worth the crossing, if his feet are still under him.\n只要雙腳還聽使喚，這趟跑過來就值得。",
        default: "It's not coming free without a plan.\n沒個計畫，這東西不會自己出來。",
      },
      puzzleOnVerb: { use: "salt_conch_resonance" },
    },
    {
      id: "boat_launch",
      name: "Channel Out",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "salt_conch_found",
      lockedLine: "No sense leaving the marsh without the conch — not with that skiff still out there.\n巡邏艇還在附近晃，沒拿到海螺就離開這片沼澤，一點道理都沒有。",
      to: { room: "saharaNerve", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption:
        "The skiff never catches more than his shadow. A long, breathless run and a longer train ride later, the marsh gives way to the Sahara.\n那艘船到頭來只追上了他的影子。一路狂奔、再搭上一段更長的火車後，沼澤地換成了撒哈拉沙漠。",
      responses: {
        look: "The channel back out toward dry land, well clear of the skiff's patrol line.\n通往乾地的水道，早已遠離那艘船的巡邏範圍。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default donanaNerve;

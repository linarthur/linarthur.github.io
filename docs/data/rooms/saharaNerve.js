// data/rooms/saharaNerve.js — Act 2, Nerve Path: the Richat Structure,
// solo. There's no camel broker to charm here — a mining company's narrow-
// gauge survey tram is the only way across the rings before the heat gets
// dangerous, and it doesn't have working brakes. Braking it in time is a
// reflex sequence, not a fight; overshooting only costs a hot, long walk
// back to try again.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [220, 740], [1700, 740], [1800, 990], [120, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 620, [
    [0, "#e8955a"],
    [0.5, "#e8b878"],
    [1, "#f0d0a0"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 620);
  const sunGlow = ctx.createRadialGradient(500, 200, 10, 500, 200, 220);
  sunGlow.addColorStop(0, "rgba(255,240,200,0.9)");
  sunGlow.addColorStop(1, "rgba(255,240,200,0)");
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(500, 200, 220, 0, Math.PI * 2);
  ctx.fill();
}

function paintRings(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(140,90,50,0.35)";
  ctx.lineWidth = 6;
  const cx = 960, cy = 620;
  [200, 340, 480, 620].forEach((r) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function paintDunes(ctx) {
  const g = paintedGradient(ctx, 0, 600, 0, H, [
    [0, "#d9a468"],
    [1, "#a06a3a"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.lineTo(W, 640);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  paintRings(ctx);
  texturedFloor(ctx, { x: 0, y: 700, w: W, h: H - 700, vanishX: 960, speckleColor: "rgba(255,240,210,0.08)" });
}

function paintTrack(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(90,70,50,0.6)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(280, 900);
  ctx.lineTo(1620, 900);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(280, 930);
  ctx.lineTo(1620, 930);
  ctx.stroke();
  for (let x = 280; x < 1620; x += 45) {
    ctx.beginPath();
    ctx.moveTo(x, 895);
    ctx.lineTo(x, 935);
    ctx.stroke();
  }
  ctx.restore();
}

function paintTram(ctx) {
  ctx.save();
  ctx.translate(500, 880);
  ctx.fillStyle = "#5c4838";
  ctx.fillRect(-90, -50, 180, 60);
  rimLight(ctx, () => ctx.rect(-90, -50, 180, 60), { color: "255,220,170", alpha: 0.25, width: 2 });
  ctx.fillStyle = "#2c2418";
  ctx.beginPath();
  ctx.arc(-55, 20, 16, 0, Math.PI * 2);
  ctx.arc(55, 20, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintFork(ctx, found) {
  if (found) return;
  ctx.save();
  ctx.translate(1560, 940);
  // a mound of freshly-disturbed sand, plus a warm glow so the bronze
  // reads as an object to interact with, not a stray pair of pixels
  ctx.fillStyle = "rgba(90,60,30,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 24, 60, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  const glow = ctx.createRadialGradient(0, 0, 6, 0, 0, 70);
  glow.addColorStop(0, "rgba(255,220,150,0.35)");
  glow.addColorStop(1, "rgba(255,220,150,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#c9924f";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-16, 30);
  ctx.lineTo(-16, -36);
  ctx.moveTo(16, 30);
  ctx.lineTo(16, -36);
  ctx.stroke();
  rimLight(ctx, () => {
    ctx.moveTo(-16, 30);
    ctx.lineTo(-16, -36);
    ctx.moveTo(16, 30);
    ctx.lineTo(16, -36);
  }, { color: "255,235,190", alpha: 0.6, width: 3 });
  ctx.restore();
}

function paintTrackSouth(ctx) {
  ctx.save();
  ctx.translate(1745, 900);
  // the track continuing on toward the airstrip, with a weathered signpost
  ctx.strokeStyle = "rgba(90,70,50,0.6)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-85, -40);
  ctx.lineTo(85, -40);
  ctx.moveTo(-85, -10);
  ctx.lineTo(85, -10);
  ctx.stroke();
  ctx.fillStyle = "#5c4838";
  ctx.fillRect(-6, -100, 12, 100);
  ctx.beginPath();
  ctx.moveTo(-6, -90);
  ctx.lineTo(-70, -78);
  ctx.lineTo(-70, -58);
  ctx.lineTo(-6, -70);
  ctx.closePath();
  ctx.fillStyle = "#c9a468";
  ctx.fill();
  rimLight(ctx, () => ctx.rect(-70, -78, 64, 20), { color: "255,220,170", alpha: 0.3, width: 2 });
  ctx.restore();
}

export const saharaNerve = {
  id: "saharaNerve",
  name: "The Eye of the Sahara — Mauritania",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [500, 0, 900, 700], "255,220,170", 0.14);
    paintDunes(ctx);
    paintTrack(ctx);
    paintTram(ctx);
    paintTrackSouth(ctx);
    paintFork(ctx, !!state?.flags?.storm_fork_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "tram",
      name: "Survey Tram",
      nameZh: "礦業台車",
      kind: "scenery",
      polygon: [[410, 830], [590, 830], [590, 940], [410, 940]],
      hideWhenFlag: "sahara_tram_ridden",
      responses: {
        look: "A narrow-gauge mining tram, the only fast way across the rings — and, judging by the state of the lever, the brakes are more of a suggestion.\n一輛窄軌礦業台車，是快速橫越那些同心環的唯一辦法——看那煞車拉桿的樣子，煞車大概只是參考用的。",
        use: "Only one way to find out if that lever still does anything.\n那根拉桿還有沒有用，只有一個辦法能知道。",
        default: "It's not going anywhere until someone gets on and finds out.\n沒人上去試試看，這台車哪裡都不會去。",
      },
      puzzleOnVerb: { use: "sahara_tram" },
    },
    {
      id: "rings",
      name: "The Concentric Rings",
      nameZh: "同心環狀山脊",
      kind: "scenery",
      polygon: [[700, 500], [1220, 500], [1220, 740], [700, 740]],
      responses: {
        look: "Ridge after ridge, radiating out from the centre. From ground level they all look identical — the tram track is the only straight line through them.\n一圈又一圈的山脊，從中心往外擴散。從地面看全都長得一樣——台車軌道是唯一穿過去的直線。",
        default: "Best appreciated from a very great height, which he does not currently have.\n這景色最適合從高空俯瞰，可惜他現在飛不起來。",
      },
    },
    {
      id: "fork_site",
      name: "Buried Bronze",
      nameZh: "掩埋的青銅叉齒",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "storm_fork_found",
      puzzleRequiresFlag: "sahara_tram_ridden",
      responses: {
        look: "Two bronze tines, just breaking the surface at the dead centre of the rings, humming faintly in the heat-shimmer.\n兩根青銅叉齒剛好露出地面，就在同心環的正中央，在熱浪中隱隱嗡鳴。",
        use: "Worth the ride, if his teeth are all still where he left them.\n只要牙齒還在原位，這趟驚險車程就值得。",
        default: "It's not coming loose without digging, and it's not worth digging in the wrong spot.\n不挖是拿不出來的，但挖錯地方也是白費工夫。",
      },
      puzzleOnVerb: { use: "storm_fork_resonance" },
    },
    {
      id: "onward",
      name: "The Track South",
      nameZh: "南向小徑",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "storm_fork_found",
      lockedLine: "Leaving without the fork would mean the whole detour through the Sahara was for nothing.\n沒拿到那根叉子就離開，這趟繞道撒哈拉就白跑一趟了。",
      to: { room: "biminiNerve", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "A cargo plane and a very quiet boat later, the Sahara gives way to Bimini.\n搭了一趟貨機、又坐了一艘異常安靜的船之後，撒哈拉沙漠換成了比米尼島。",
      responses: {
        look: "The track back to the airstrip.\n通往機場跑道的軌道。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default saharaNerve;

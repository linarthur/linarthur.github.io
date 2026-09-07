// data/rooms/saharaPartners.js — Act 2, Partners Path: the Richat
// Structure, Mauritania. Mo calls bearings off a sundial-compass while the
// player drives (dialogue+cutscene), then the Storm Fork — buried at the
// centre of the rings — is a resonance puzzle (the middle voice).

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
  // sun
  const sunGlow = ctx.createRadialGradient(1500, 200, 10, 1500, 200, 220);
  sunGlow.addColorStop(0, "rgba(255,240,200,0.9)");
  sunGlow.addColorStop(1, "rgba(255,240,200,0)");
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(1500, 200, 220, 0, Math.PI * 2);
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

function paintSandrail(ctx) {
  ctx.save();
  ctx.translate(500, 880);
  ctx.fillStyle = "#5c4c3a";
  ctx.beginPath();
  ctx.roundRect(-70, -30, 140, 50, 8);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-70, -30, 140, 50, 8), { color: "255,220,170", alpha: 0.3, width: 2 });
  ctx.fillStyle = "#2c2118";
  [-40, 40].forEach((dx) => {
    ctx.beginPath();
    ctx.arc(dx, 24, 20, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function paintMoAndFork(ctx, found) {
  ctx.save();
  ctx.translate(1420, 860);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a5c48";
  ctx.beginPath();
  ctx.moveTo(-28, 70);
  ctx.lineTo(-20, -55);
  ctx.quadraticCurveTo(0, -75, 20, -55);
  ctx.lineTo(28, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#5c3d28";
  ctx.beginPath();
  ctx.arc(0, -70, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8dcc4";
  ctx.beginPath();
  ctx.moveTo(-24, -84);
  ctx.lineTo(24, -84);
  ctx.lineTo(16, -96);
  ctx.lineTo(-16, -96);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!found) {
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
}

function paintTrackSouth(ctx) {
  ctx.save();
  ctx.translate(1745, 900);
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

export const saharaPartners = {
  id: "saharaPartners",
  name: "The Eye of the Sahara — Mauritania",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [1500, 0, 900, 700], "255,220,170", 0.16);
    paintDunes(ctx);
    paintSandrail(ctx);
    paintTrackSouth(ctx);
    paintMoAndFork(ctx, !!state?.flags?.storm_fork_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "mo",
      name: "Dr. Nomusa Adeyemi",
      kind: "actor",
      polygon: [[1360, 780], [1480, 780], [1480, 950], [1360, 950]],
      dialogue: "mo_sahara",
      responses: {
        look: "Mo, sundial-compass in hand, already arguing with it about true north.\n莫手裡拿著日晷羅盤，已經在跟它爭論真北方向了。",
        default: "She's mid-calculation. Better not to jog her elbow.\n她正在算東西，最好別去碰她的手肘。",
      },
    },
    {
      id: "sandrail",
      name: "Sandrail",
      kind: "scenery",
      polygon: [[420, 830], [590, 830], [590, 940], [420, 940]],
      responses: {
        look: "A stripped-down dune buggy, rented from a broker who overcharged them exactly as much as the guidebook warned he would.\n一台簡陋的沙地越野車，租車的老闆敲了他們一筆，剛好跟旅遊指南警告的一樣多。",
        use: "It's already parked where it needs to be. Driving further would just mean driving in circles — literally, given the rings.\n它已經停在該停的地方了。再開下去只會繞圈子——這裡都是圓環，字面意義上的繞圈。",
        default: "It's done its job getting them this far in.\n它已經完成任務，把他們載到這裡了。",
      },
    },
    {
      id: "rings",
      name: "The Concentric Rings",
      kind: "scenery",
      polygon: [[700, 500], [1220, 500], [1220, 740], [700, 740]],
      responses: {
        look: "Ridge after ridge after ridge, dead level, radiating out from the centre like a target the size of a city. From ground level they all look identical.\n一圈又一圈的地脊，平整得不可思議，從中心向外輻射，像個城市大小的靶心。從地面看，每一圈都長得一模一樣。",
        default: "Best appreciated from a very great height, which he does not currently have.\n這景象最適合從高空欣賞，可惜他現在沒那個高度。",
      },
    },
    {
      id: "fork_site",
      name: "Buried Bronze",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "storm_fork_found",
      puzzleRequiresFlag: "mo_helped_sahara",
      responses: {
        look: "Two bronze tines, just breaking the surface at the dead centre of the rings, humming faintly in the heat-shimmer.\n兩根青銅叉尖，剛好露出圓環正中心的地表，在熱浪中隱隱作響。",
        use: "Getting here in a straight line mattered — the rings all look alike, and he'd rather not have wandered in circles to find this. Ask Mo for a bearing first.\n要走直線才能到這裡——每個圓環都長得一樣，他可不想繞圈子亂找。先問莫要個方位吧。",
        default: "It's not coming loose without digging, and it's not worth digging in the wrong spot.\n不挖是拿不出來的，但挖錯地方也不值得。",
      },
      puzzleOnVerb: { use: "storm_fork_resonance" },
    },
    {
      id: "onward",
      name: "The Track South",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "storm_fork_found",
      lockedLine: "Leaving without the fork would mean the whole detour through the Sahara was for nothing.\n沒拿到叉子就走，那這趟撒哈拉繞路可就白跑了。",
      to: { room: "biminiPartners", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption:
        "A sandrail, a cargo plane, and a boat with a captain who asks no questions later, the Sahara gives way to the turquoise shallows of Bimini.\n沙地越野車、貨機，再加上一位什麼都不多問的船長，撒哈拉終於讓位給比米尼那片碧藍淺灘。",
      responses: {
        look: "The track back to the airstrip, and from there, the Atlantic.\n通往簡易機場的路，再過去就是大西洋了。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default saharaPartners;

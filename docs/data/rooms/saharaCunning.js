// data/rooms/saharaCunning.js — Act 2, Cunning Path: the Richat Structure,
// solo. A suspicious camel broker won't take a foreigner into the rings —
// so the play is disguise: local robes plus a headscarf, worn together,
// buy enough distance to pass unremarked.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, paintWorldItem } from "../../engine/artHelpers.js";
import { getItem } from "../items.js";

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

function paintStall(ctx) {
  ctx.save();
  ctx.translate(500, 780);
  ctx.fillStyle = "#c9a468";
  ctx.beginPath();
  ctx.moveTo(-140, 60);
  ctx.lineTo(-120, -80);
  ctx.lineTo(120, -80);
  ctx.lineTo(140, 60);
  ctx.closePath();
  ctx.fill();
  rimLight(ctx, () => {
    ctx.moveTo(-140, 60);
    ctx.lineTo(-120, -80);
    ctx.lineTo(120, -80);
    ctx.lineTo(140, 60);
  }, { color: "255,220,170", alpha: 0.3, width: 2 });
  ctx.strokeStyle = "rgba(140,90,50,0.5)";
  ctx.lineWidth = 4;
  for (let x = -100; x <= 100; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x * 0.85, -70);
    ctx.lineTo(x, 55);
    ctx.stroke();
  }
  ctx.restore();
}

// The robes and headscarf sold no visual before this — same fix as the
// warden's desk in donanaCunning.js: reuse each item's own inventory icon
// (data/items.js) on the stall counter, hidden once picked up (or once
// combined into desert_disguise — see combinesWith in engine/main.js).
function paintStallItems(ctx, state) {
  const inv = state?.inventory || [];
  if (!inv.includes("local_robes") && !inv.includes("desert_disguise")) {
    paintWorldItem(ctx, getItem("local_robes"), 445, 760, 40);
  }
  if (!inv.includes("headscarf") && !inv.includes("desert_disguise")) {
    paintWorldItem(ctx, getItem("headscarf"), 585, 765, 36);
  }
}

function paintBroker(ctx) {
  ctx.save();
  ctx.translate(500, 880);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8a6a3a";
  ctx.beginPath();
  ctx.moveTo(-26, 70);
  ctx.lineTo(-20, -55);
  ctx.quadraticCurveTo(0, -75, 20, -55);
  ctx.lineTo(26, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a5f";
  ctx.beginPath();
  ctx.arc(0, -70, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8e0c8";
  ctx.beginPath();
  ctx.ellipse(0, -86, 22, 12, 0, 0, Math.PI * 2);
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

export const saharaCunning = {
  id: "saharaCunning",
  name: "The Eye of the Sahara — Mauritania",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [500, 0, 900, 700], "255,220,170", 0.14);
    paintDunes(ctx);
    paintStall(ctx);
    paintStallItems(ctx, state);
    paintBroker(ctx);
    paintTrackSouth(ctx);
    paintFork(ctx, !!state?.flags?.storm_fork_found);
    vignette(ctx, W, H, 0.4);
  },

  hotspots: [
    {
      id: "broker",
      name: "Camel Broker",
      kind: "actor",
      polygon: [[440, 780], [560, 780], [560, 950], [440, 950]],
      responses: {
        look: "A broker who's rented camels to enough treasure hunters to smell one coming from a mile off. He's looking straight at him.\n一位租駱駝給無數尋寶人的商人，老遠就能聞出這行的人。他正直直地盯著他看。",
        talk: "\"No outsiders past the first ring,\" he says, arms folded. \"Bad enough business already, without foreigners drawing eyes.\"\n「外人不得進入第一環之後，」他抱著手臂說。「生意已經夠難做了，別再招來外國人惹眼。」",
        default: "He's not budging for a stranger in a tweed jacket.\n對一個穿粗花呢外套的陌生人，他是不會讓步的。",
      },
      hideWhenFlag: "desert_disguise_worn",
    },
    {
      id: "broker_fooled",
      name: "Camel Broker",
      kind: "actor",
      polygon: [[440, 780], [560, 780], [560, 950], [440, 950]],
      responses: {
        look: "The same broker, who nodded him through without a second glance the moment the robes and scarf went on.\n還是同一個商人，長袍和頭巾一穿上，他看都沒多看一眼就點頭放行了。",
        talk: "He barely looks up. Just another guide, as far as he's concerned.\n他幾乎沒抬頭。在他看來，不過是又一個嚮導罷了。",
        default: "He's already stopped paying attention.\n他早就沒在注意了。",
      },
    },
    {
      id: "stall",
      name: "Trading Stall",
      kind: "scenery",
      polygon: [[380, 700], [640, 700], [640, 830], [380, 830]],
      responses: {
        look: "Robes, scarves, waterskins, and a price for every one of them that assumes he doesn't know better. He does, but that's not the point today.\n長袍、頭巾、水袋，每樣東西都標著一個假設他不懂行情的價錢。他當然懂，但今天重點不在這。",
        default: "Everything worth taking here is already within reach.\n這裡值得拿的東西，伸手就能拿到。",
      },
    },
    {
      id: "rings",
      name: "The Concentric Rings",
      kind: "scenery",
      polygon: [[700, 500], [1220, 500], [1220, 740], [700, 740]],
      responses: {
        look: "Ridge after ridge, radiating out from the centre. From ground level they all look identical — no wonder the broker doesn't let just anyone wander in.\n一圈又一圈的環狀山脊，從中心向外擴散。從地面看全都長得一樣——難怪商人不肯讓人隨便亂闖。",
        default: "Best appreciated from a very great height, which he does not currently have.\n最好從高空俯瞰才看得出門道，可惜他目前沒這個高度。",
      },
    },
    {
      id: "fork_site",
      name: "Buried Bronze",
      kind: "scenery",
      polygon: [[1500, 880], [1650, 880], [1650, 990], [1500, 990]],
      hideWhenFlag: "storm_fork_found",
      puzzleRequiresFlag: "desert_disguise_worn",
      responses: {
        look: "Two bronze tines, just breaking the surface at the dead centre of the rings, humming faintly in the heat-shimmer.\n兩根青銅音叉，才剛露出地面，就在環狀中心的熱浪中微微嗡鳴。",
        use: "Getting this far without being stopped mattered rather a lot. Best make sure nobody's still watching.\n能一路走到這裡沒被攔下，可不容易。最好先確認沒人還在盯著看。",
        default: "It's not coming loose without digging, and it's not worth digging in the wrong spot.\n不挖是不會鬆動的，而挖錯地方也是白費工夫。",
      },
      puzzleOnVerb: { use: "storm_fork_resonance" },
    },
    {
      id: "onward",
      name: "The Track South",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "storm_fork_found",
      lockedLine: "Leaving without the fork would mean the whole detour through the Sahara was for nothing.\n沒拿到音叉就離開，這趟繞來撒哈拉沙漠可就白跑了。",
      to: { room: "biminiCunning", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "The disguise comes off at the airstrip. A cargo plane and a very quiet boat later, the Sahara gives way to Bimini.\n偽裝在飛機跑道旁卸下。搭了貨機、又坐了一艘十分安靜的船，撒哈拉沙漠終於換成了比米尼群島。",
      responses: {
        look: "The track back to the airstrip.\n通往飛機跑道的小徑。",
      },
    },
  ],

  items: [
    {
      id: "local_robes",
      polygon: [[420, 730], [470, 730], [470, 790], [420, 790]],
      responses: {
        look: "Loose pale robes, hung for sale at the edge of the stall.\n寬鬆的淺色長袍，掛在攤位邊緣待售。",
      },
    },
    {
      id: "headscarf",
      polygon: [[560, 740], [610, 740], [610, 790], [560, 790]],
      responses: {
        look: "A sun-bleached headscarf, folded on the stall counter.\n一條被太陽曬得褪色的頭巾，摺放在攤位櫃檯上。",
      },
    },
  ],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default saharaCunning;

// data/rooms/lisbonAlley.js — Act 1, Lisbon: the Alfama alley outside the
// tile workshop. First room built with the upgraded art technique
// (engine/artHelpers.js) — layered dusk gradient, rim-lit rooftops,
// textured cobblestones, warm lamp glow.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, CHARACTER_SCALE } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [200, 760], [1720, 760], [1820, 990], [100, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 700, [
    [0, "#2a1f3d"],
    [0.35, "#5c3a52"],
    [0.65, "#a8623f"],
    [1, "#e8955a"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 700);
}

function paintDistantRooftops(ctx) {
  ctx.save();
  ctx.fillStyle = "rgba(40,24,32,0.75)";
  const roofline = [
    [0, 520], [180, 460], [340, 500], [520, 420], [720, 470],
    [900, 400], [1100, 460], [1300, 410], [1500, 470], [1700, 430], [1920, 480], [1920, 700], [0, 700],
  ];
  ctx.beginPath();
  roofline.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function paintFacade(ctx) {
  // left building, tile workshop
  ctx.save();
  const wallGrad = paintedGradient(ctx, 0, 300, 0, 780, [
    [0, "#c9a86a"],
    [1, "#8a6a45"],
  ]);
  ctx.fillStyle = wallGrad;
  ctx.beginPath();
  ctx.rect(0, 300, 640, 480);
  ctx.fill();
  rimLight(ctx, () => ctx.rect(0, 300, 640, 480), { color: "255,225,180", alpha: 0.35, width: 4 });

  // azulejo tile band
  const tile = 34;
  for (let ty = 340; ty < 700; ty += tile) {
    for (let tx = 30; tx < 610; tx += tile) {
      ctx.fillStyle = "#1c3a4a";
      ctx.fillRect(tx, ty, tile - 3, tile - 3);
      ctx.strokeStyle = "rgba(220,232,234,0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(tx, ty, tile * 0.5, 0, Math.PI / 2);
      ctx.arc(tx + tile - 3, ty + tile - 3, tile * 0.5, Math.PI, Math.PI * 1.5);
      ctx.stroke();
    }
  }
  // shutters/window
  ctx.fillStyle = "#3a2a1c";
  ctx.fillRect(250, 380, 120, 160);
  ctx.strokeStyle = "#1c130c";
  ctx.lineWidth = 5;
  ctx.strokeRect(250, 380, 120, 160);
  // shop sign
  ctx.fillStyle = "#6a1f1f";
  ctx.fillRect(60, 330, 220, 50);
  ctx.fillStyle = "rgba(244,201,93,0.85)";
  ctx.font = "italic bold 26px Georgia";
  ctx.textAlign = "left";
  ctx.fillText("Azulejos", 78, 365);
  ctx.restore();

  // right building
  ctx.save();
  const wall2 = paintedGradient(ctx, 1280, 260, 1280, 780, [
    [0, "#9c5a4a"],
    [1, "#5c342a"],
  ]);
  ctx.fillStyle = wall2;
  ctx.fillRect(1280, 260, 640, 520);
  rimLight(ctx, () => ctx.rect(1280, 260, 640, 520), { color: "255,200,160", alpha: 0.3, width: 4 });
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "#241a14";
    ctx.fillRect(1340 + i * 170, 320, 90, 130);
    ctx.strokeStyle = "#120c08";
    ctx.lineWidth = 4;
    ctx.strokeRect(1340 + i * 170, 320, 90, 130);
  }
  ctx.restore();

  // laundry line between buildings
  ctx.save();
  ctx.strokeStyle = "rgba(20,14,10,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(640, 340);
  ctx.quadraticCurveTo(960, 420, 1280, 350);
  ctx.stroke();
  const clothColors = ["#e8dcc4", "#a8623f", "#5c8a7a", "#c9a86a"];
  for (let i = 0; i < 5; i++) {
    const t = (i + 1) / 6;
    const x = 640 + (1280 - 640) * t;
    const y = 340 + (350 - 340) * t + Math.sin(t * Math.PI) * 60;
    ctx.fillStyle = clothColors[i % clothColors.length];
    ctx.fillRect(x - 16, y, 32, 44);
  }
  ctx.restore();
}

function paintStreetlamp(ctx) {
  ctx.save();
  ctx.strokeStyle = "#1c1712";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(960, 980);
  ctx.lineTo(960, 560);
  ctx.stroke();
  ctx.fillStyle = "#2c2118";
  ctx.beginPath();
  ctx.arc(960, 550, 5, 0, Math.PI * 2);
  ctx.fill();
  const glow = ctx.createRadialGradient(960, 545, 5, 960, 545, 120);
  glow.addColorStop(0, "rgba(255,224,160,0.55)");
  glow.addColorStop(1, "rgba(255,224,160,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(960, 545, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4c95d";
  ctx.beginPath();
  ctx.arc(960, 545, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 760, 0, H, [
    [0, "#6a5a4a"],
    [1, "#2c241c"],
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

function paintFunicular(ctx) {
  ctx.save();
  ctx.translate(1720, 880);
  // rails climbing the incline
  ctx.strokeStyle = "rgba(60,50,40,0.7)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-90, 60);
  ctx.lineTo(-30, -140);
  ctx.moveTo(90, 60);
  ctx.lineTo(30, -140);
  ctx.stroke();
  // the little yellow car
  ctx.fillStyle = "#e8b83a";
  ctx.beginPath();
  ctx.roundRect(-55, -40, 110, 90, 8);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-55, -40, 110, 90, 8), { color: "255,230,170", alpha: 0.4, width: 2 });
  ctx.strokeStyle = "#5c4020";
  ctx.lineWidth = 3;
  ctx.strokeRect(-55, -40, 110, 90);
  ctx.fillStyle = "rgba(120,180,200,0.6)";
  ctx.fillRect(-40, -25, 32, 40);
  ctx.fillRect(8, -25, 32, 40);
  ctx.restore();
}

function paintFado(ctx) {
  ctx.save();
  ctx.translate(1450, 860);
  ctx.scale(CHARACTER_SCALE, CHARACTER_SCALE);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a2436";
  ctx.beginPath();
  ctx.moveTo(-34, 70);
  ctx.lineTo(-24, -50);
  ctx.quadraticCurveTo(0, -75, 24, -50);
  ctx.lineTo(34, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a5f";
  ctx.beginPath();
  ctx.arc(0, -68, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c1712";
  ctx.beginPath();
  ctx.arc(0, -78, 18, Math.PI, Math.PI * 2);
  ctx.fill();
  // guitar
  ctx.save();
  ctx.translate(30, 10);
  ctx.rotate(0.5);
  ctx.fillStyle = "#8a6a45";
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4a3423";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

export const lisbonAlley = {
  id: "lisbonAlley",
  name: "Lisbon — Alfama Alley",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    paintDistantRooftops(ctx);
    lightWash(ctx, [960, 0, 960, 700], "232,140,90", 0.18);
    paintFacade(ctx);
    paintStreetlamp(ctx);
    paintFloor(ctx);
    paintFunicular(ctx);
    paintFado(ctx);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "tile_shop",
      name: "Tile Workshop Window",
      nameZh: "瓷磚工作坊櫥窗",
      kind: "scenery",
      polygon: [[30, 340], [610, 340], [610, 700], [30, 700]],
      responses: {
        look: "A whole wall of unfinished azulejo panels, waiting to be fired. One half-assembled chart panel looks like it's meant to be a map, not a decoration.\n一整面牆的瓷磚壁畫都還沒燒製,靜靜等著進窯。其中一片拼到一半的圖板,看起來不像裝飾,倒像是張地圖。",
        use: "The panel's a puzzle, not a window. Best to actually try assembling it.\n這片圖板是拼圖,不是窗戶,還是動手拼拼看吧。",
        default: "Careful — the tiles look freshly glazed.\n小心點——這些磁磚看起來才剛上釉。",
      },
      puzzleOnVerb: { use: "lisbon_azulejo" },
    },
    {
      id: "fado",
      name: "Fado Singer",
      nameZh: "法朵歌手",
      kind: "actor",
      polygon: [[1400, 780], [1510, 780], [1510, 950], [1400, 950]],
      dialogue: "fado_intro",
      responses: {
        look: "She's been singing the same aching verse for an hour, and the whole alley has gone quiet to listen.\n她唱同一句心碎的歌詞已經唱了一個鐘頭,整條巷子都靜下來聽她唱。",
        default: "Better to let the song finish.\n還是先讓她把歌唱完吧。",
      },
    },
    {
      id: "lamp",
      name: "Street Lamp",
      nameZh: "瓦斯街燈",
      kind: "scenery",
      polygon: [[920, 540], [1000, 540], [1000, 980], [920, 980]],
      responses: {
        look: "Gas, not electric — this street hasn't caught up to the twentieth century yet, and seems proud of it.\n是瓦斯燈,不是電燈——這條街還沒跟上二十世紀,而且看起來還挺自豪的。",
        default: "It's bolted to the cobbles. It isn't going anywhere.\n燈柱牢牢鎖在鵝卵石路上,哪裡也去不了。",
      },
    },
    {
      id: "funicular",
      name: "Funicular Stop",
      nameZh: "纜車站",
      kind: "exit",
      polygon: [[1620, 700], [1820, 700], [1820, 960], [1620, 960]],
      requiresFlag: "lisbon_azulejo_solved",
      lockedLine: "No sense heading for the docks without knowing where he's headed. That chart in the workshop window isn't finished yet.\n連目的地都還不知道,去碼頭也沒用。工作坊櫥窗裡那張圖板還沒拼完呢。",
      to: { room: "hypogeum", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "The funicular rattles down through the Alfama, out past the Tagus, and — three connections and one very long ferry later — into the limestone hush of Malta.\n纜車一路轟隆隆駛下阿爾法瑪區,穿過特茹河——轉了三趟車、搭了一趟漫長的渡輪之後,終於抵達馬爾他那片寂靜的石灰岩地。",
      responses: {
        look: "The little yellow funicular car, waiting at the top of the incline.\n那輛黃色小纜車,正停在坡頂等著。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 920, facing: "down" },
};

export default lisbonAlley;

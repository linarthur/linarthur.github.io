// data/rooms/calderaApproach.js — Act 3, The Caldera. Reached from any of
// the three Act 2 finales (Partners, Cunning, Nerve all lead here — see
// engine/main.js's `act2_complete` gating) once all three Voices are
// found. One shared room regardless of path, per the design doc's
// convergence promise from the Act 1 path-choice screen.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, CHARACTER_SCALE } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [260, 760], [1660, 760], [1760, 990], [160, 990],
];

function paintSky(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 560, [
    [0, "#2c2438"],
    [0.5, "#4a3850"],
    [1, "#8a5850"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 560);
}

function paintCraterRim(ctx) {
  ctx.save();
  ctx.fillStyle = "#241c20";
  ctx.beginPath();
  ctx.moveTo(0, 560);
  ctx.lineTo(500, 500);
  ctx.lineTo(900, 620);
  ctx.lineTo(1300, 480);
  ctx.lineTo(1920, 560);
  ctx.lineTo(1920, 700);
  ctx.lineTo(0, 700);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function paintSteamVents(ctx, time) {
  const vents = [[300, 640], [860, 660], [1500, 630]];
  vents.forEach(([x, y], i) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#d8d0d8";
    for (let j = 0; j < 4; j++) {
      const t = (time / 1400 + j * 0.25 + i) % 1;
      ctx.beginPath();
      ctx.ellipse(Math.sin(t * 6 + i) * 10, -t * 120, 14 + t * 22, 10 + t * 16, 0, 0, Math.PI * 2);
      ctx.globalAlpha = 0.22 * (1 - t);
      ctx.fill();
    }
    ctx.restore();
  });
}

function paintCraterGlow(ctx) {
  ctx.save();
  const glow = ctx.createRadialGradient(960, 900, 40, 960, 900, 460);
  glow.addColorStop(0, "rgba(140,220,235,0.5)");
  glow.addColorStop(1, "rgba(140,220,235,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(960, 900, 460, 140, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 700, 0, H, [
    [0, "#3a2c30"],
    [1, "#1c1418"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 700, W, H - 700);
  texturedFloor(ctx, { x: 0, y: 700, w: W, h: H - 700, vanishX: 960, speckleColor: "rgba(255,220,200,0.05)" });
}

function paintDescentStair(ctx) {
  ctx.save();
  ctx.translate(960, 960);
  ctx.fillStyle = "#100c0e";
  ctx.beginPath();
  ctx.moveTo(-100, 0);
  ctx.lineTo(100, 0);
  ctx.lineTo(60, -40);
  ctx.lineTo(-60, -40);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(230,200,190,0.3)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    const t = i / 4;
    ctx.beginPath();
    ctx.moveTo(-100 + (-60 - -100) * t, 0 + (-40 - 0) * t);
    ctx.lineTo(100 + (60 - 100) * t, 0 + (-40 - 0) * t);
    ctx.stroke();
  }
  ctx.restore();
}

function paintDraghi(ctx, met) {
  ctx.save();
  ctx.translate(1500, 880);
  ctx.scale(CHARACTER_SCALE, CHARACTER_SCALE);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 46, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = met ? "#5c3a4a" : "#4a2c3a";
  ctx.beginPath();
  ctx.moveTo(-26, 70);
  ctx.lineTo(-20, -70);
  ctx.quadraticCurveTo(0, -95, 20, -70);
  ctx.lineTo(26, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a8a";
  ctx.beginPath();
  ctx.arc(0, -84, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const calderaApproach = {
  id: "calderaApproach",
  name: "The Caldera",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintSky(ctx);
    lightWash(ctx, [960, 200, 960, 700], "255,200,170", 0.1);
    paintCraterRim(ctx);
    paintSteamVents(ctx, performance.now());
    paintFloor(ctx);
    paintCraterGlow(ctx);
    paintDescentStair(ctx);
    paintDraghi(ctx, !!state?.flags?.draghi_caldera_met);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "vents",
      name: "Steam Vents",
      nameZh: "噴氣孔",
      kind: "scenery",
      polygon: [[200, 600], [700, 600], [700, 700], [200, 700]],
      responses: {
        look: "Still warm, after all these centuries. Whatever's down there hasn't finished cooling.\n都過了這麼多世紀,還是溫的。下面那東西,顯然還沒涼透。",
        default: "Best to keep clear of the vents.\n還是離噴氣孔遠一點比較好。",
      },
    },
    {
      id: "draghi",
      name: "Contessa Verena Draghi",
      nameZh: "薇蕾娜·德拉吉伯爵夫人",
      kind: "actor",
      polygon: [[1440, 780], [1560, 780], [1560, 950], [1440, 950]],
      dialogue: "draghi_caldera",
      responses: {
        look: "She's come alone, which is either a very good sign or a very bad one.\n她一個人來了,這要嘛是好兆頭,要嘛是壞兆頭。",
        default: "There's nothing left to do here but talk to her.\n現在也只能跟她談談了。",
      },
    },
    {
      id: "glow",
      name: "The Glow Below",
      nameZh: "深處的光芒",
      kind: "scenery",
      polygon: [[700, 780], [1220, 780], [1220, 940], [700, 940]],
      responses: {
        look: "Something down in the flooded caldera is lit from within — the same pale blue-white as every Voice he's carried this far.\n淹沒的火山口深處,有東西正從內部發光——跟他一路帶來的每個「聲音」一樣,是那種淡淡的藍白色。",
        default: "There's a way down, if he's ready for it.\n只要他準備好了,下去的路就在那裡。",
      },
    },
    {
      id: "descent",
      name: "The Way Down",
      nameZh: "下降之路",
      kind: "exit",
      polygon: [[860, 940], [1060, 940], [1060, 990], [860, 990]],
      requiresFlag: "draghi_caldera_met",
      lockedLine: "Best to hear her out first — she came a long way to just stand here.\n還是先聽她把話說完吧——她大老遠跑來,總不能就這樣站著。",
      to: { room: "calderaChamber", spawn: { x: 900, y: 900, facing: "down" } },
      fallCaption: "The path down is old stone, and it remembers being stairs.\n往下的路是古老的石頭砌成的,依稀還記得自己曾是階梯。",
      responses: {
        look: "A cut-stone stairway, switchbacking down into the light.\n一道鑿石階梯,蜿蜒向下沒入光中。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default calderaApproach;

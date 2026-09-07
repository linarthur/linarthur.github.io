// data/rooms/subbasement.js
//
// Prologue Room 5 of 5: the flooded sub-basement. The trail of the stolen
// crate ends here — but a waterlogged map tube, snagged against a pipe,
// is the Prologue's second clue: the 16th-century Portuguese chart. Taking
// it closes out the Prologue.
//
// Art retrofitted to the Act 1 technique bar (engine/artHelpers.js).

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [260, 720], [1660, 720], [1780, 980], [140, 980],
];

function paintWall(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 780, [
    [0, "#0e161e"],
    [0.5, "#182430"],
    [1, "#243848"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 780);

  // rough-cut stone blocks
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.lineWidth = 3;
  for (let row = 0; row < 6; row++) {
    const y = 60 + row * 120;
    const offset = row % 2 === 0 ? 0 : 90;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    for (let x = -90 + offset; x < W; x += 180) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 120);
      ctx.stroke();
    }
  }

  // shaft of light from the street grate, far above
  const beam = ctx.createLinearGradient(700, 0, 1000, 780);
  beam.addColorStop(0, "rgba(244,201,93,0)");
  beam.addColorStop(0.5, "rgba(244,201,93,0.12)");
  beam.addColorStop(1, "rgba(244,201,93,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(760, 0);
  ctx.lineTo(940, 0);
  ctx.lineTo(1080, 780);
  ctx.lineTo(700, 780);
  ctx.closePath();
  ctx.fill();
}

function paintGrateStairwell(ctx) {
  ctx.save();
  ctx.translate(820, 640);
  // stone stairwell recess, climbing up into the light
  ctx.fillStyle = "#0a0d10";
  ctx.beginPath();
  ctx.moveTo(-120, 80);
  ctx.lineTo(-90, -160);
  ctx.lineTo(90, -160);
  ctx.lineTo(120, 80);
  ctx.closePath();
  ctx.fill();
  rimLight(ctx, () => {
    ctx.moveTo(-120, 80);
    ctx.lineTo(-90, -160);
    ctx.lineTo(90, -160);
    ctx.lineTo(120, 80);
  }, { color: "244,201,93", alpha: 0.35, width: 3 });
  // worn stone steps receding upward
  ctx.strokeStyle = "rgba(244,201,93,0.25)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const y = 70 - t * 220;
    const half = 105 - t * 20;
    ctx.beginPath();
    ctx.moveTo(-half, y);
    ctx.lineTo(half, y);
    ctx.stroke();
  }
  // street grate at the top, daylight behind the bars
  ctx.fillStyle = "rgba(244,201,93,0.5)";
  ctx.fillRect(-70, -170, 140, 14);
  ctx.strokeStyle = "#1c1712";
  ctx.lineWidth = 4;
  for (let x = -60; x <= 60; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, -170);
    ctx.lineTo(x, -156);
    ctx.stroke();
  }
  ctx.restore();
}

function paintEtchedTablet(ctx) {
  ctx.save();
  ctx.translate(950, 430);
  ctx.fillStyle = "#2c2018";
  ctx.beginPath();
  ctx.roundRect(-100, -80, 200, 160, 6);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-100, -80, 200, 160, 6), { color: "230,190,130", alpha: 0.35, width: 2 });
  ctx.strokeStyle = "rgba(230,190,130,0.4)";
  ctx.lineWidth = 1.5;
  for (let i = -60; i <= 60; i += 24) {
    ctx.beginPath();
    ctx.moveTo(-80, i);
    ctx.lineTo(80, i);
    ctx.stroke();
  }
  ctx.restore();
}

function paintPipe(ctx) {
  ctx.save();
  ctx.strokeStyle = "#6b7680";
  ctx.lineWidth = 26;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(1580, 0);
  ctx.lineTo(1580, 440);
  ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 3;
  for (let y = 40; y < 440; y += 60) {
    ctx.beginPath();
    ctx.moveTo(1567, y);
    ctx.lineTo(1593, y);
    ctx.stroke();
  }
  ctx.restore();
}

function paintShelf(ctx) {
  ctx.save();
  ctx.translate(255, 620);
  ctx.fillStyle = "#241a10";
  ctx.fillRect(-105, -120, 210, 240);
  rimLight(ctx, () => ctx.rect(-105, -120, 210, 240), { color: "230,190,130", alpha: 0.25, width: 2 });
  const jars = [[-60, -60], [0, -40], [60, -70]];
  jars.forEach(([jx, jy]) => {
    ctx.fillStyle = "rgba(120,160,140,0.55)";
    ctx.beginPath();
    ctx.roundRect(jx - 20, jy, 40, 60, 6);
    ctx.fill();
    ctx.strokeStyle = "#3a2a1c";
    ctx.lineWidth = 2;
    ctx.strokeRect(jx - 20, jy, 40, 60);
  });
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 780, 0, H, [
    [0, "#134a5c"],
    [0.4, "#0e3644"],
    [1, "#081c24"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 850);
  ctx.lineTo(W, 850);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 850, w: W, h: H - 850, vanishX: 960, speckleColor: "rgba(200,235,245,0.06)" });

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#bfeaf5";
  for (let i = 0; i < 5; i++) {
    const x = 200 + i * 380;
    ctx.beginPath();
    ctx.moveTo(x, 850);
    ctx.lineTo(x + 60, 850);
    ctx.lineTo(x - 40, H);
    ctx.lineTo(x - 100, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function paintCrate(ctx) {
  ctx.save();
  ctx.translate(1000, 720);
  ctx.fillStyle = "#5c4530";
  ctx.beginPath();
  ctx.roundRect(-130, -100, 260, 160, 4);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-130, -100, 260, 160, 4), { color: "255,220,170", alpha: 0.3, width: 2 });
  ctx.strokeStyle = "#3a2a1c";
  ctx.lineWidth = 5;
  ctx.strokeRect(-130, -100, 260, 160);
  ctx.fillStyle = "rgba(244,201,93,0.55)";
  ctx.font = "bold 22px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("TAGVS", 0, -30);
  // lid, pried off, propped against the crate
  ctx.save();
  ctx.translate(150, 20);
  ctx.rotate(-0.4);
  ctx.fillStyle = "#4a3623";
  ctx.fillRect(-90, -8, 180, 16);
  ctx.restore();
  ctx.restore();
}

function paintCrowbar(ctx) {
  ctx.save();
  ctx.translate(1150, 815);
  ctx.rotate(-0.5);
  ctx.strokeStyle = "#8a8f94";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-55, 0);
  ctx.lineTo(55, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-55, 0);
  ctx.quadraticCurveTo(-70, -18, -50, -28);
  ctx.stroke();
  ctx.restore();
}

function paintHiggins(ctx) {
  ctx.save();
  ctx.translate(565, 800);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 78, 42, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4a5058";
  ctx.beginPath();
  ctx.moveTo(-26, 70);
  ctx.lineTo(-18, -55);
  ctx.quadraticCurveTo(0, -75, 18, -55);
  ctx.lineTo(26, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98a5f";
  ctx.beginPath();
  ctx.arc(0, -68, 18, 0, Math.PI * 2);
  ctx.fill();
  // mop handle
  ctx.strokeStyle = "#8a6a45";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(30, 60);
  ctx.lineTo(60, -100);
  ctx.stroke();
  ctx.fillStyle = "#e8dcc4";
  ctx.beginPath();
  ctx.ellipse(62, -104, 12, 16, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintLantern(ctx) {
  ctx.save();
  ctx.translate(250, 550);
  ctx.strokeStyle = "#3a2a1c";
  ctx.fillStyle = "#8a6a45";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-18, -20, 36, 36, 4);
  ctx.fill();
  ctx.stroke();
  const glow = ctx.createRadialGradient(0, -4, 2, 0, -4, 40);
  glow.addColorStop(0, "rgba(244,201,93,0.4)");
  glow.addColorStop(1, "rgba(244,201,93,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -4, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a2a1c";
  ctx.beginPath();
  ctx.arc(0, -24, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintChartTube(ctx) {
  ctx.save();
  ctx.translate(1420, 890);
  ctx.rotate(0.3);
  ctx.fillStyle = "#5c4423";
  ctx.beginPath();
  ctx.roundRect(-60, -16, 120, 32, 16);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-60, -16, 120, 32, 16), { color: "230,190,130", alpha: 0.35, width: 2 });
  ctx.strokeStyle = "#3a2a1c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-40, -16);
  ctx.lineTo(-40, 16);
  ctx.moveTo(40, -16);
  ctx.lineTo(40, 16);
  ctx.stroke();
  ctx.restore();
}

export const subbasement = {
  id: "subbasement",
  name: "Barnett College — Sub-Basement",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintWall(ctx);
    paintGrateStairwell(ctx);
    paintEtchedTablet(ctx);
    paintPipe(ctx);
    paintShelf(ctx);
    paintFloor(ctx);
    paintCrate(ctx);
    if (!state?.flags?.crowbar_taken) paintCrowbar(ctx);
    if (!state?.flags?.lantern_taken) paintLantern(ctx);
    paintHiggins(ctx);
    if (!state?.flags?.found_chart) paintChartTube(ctx);
    vignette(ctx, W, H, 0.55);
  },

  // Refusal lines are per-hotspot and specific, per the writing rule:
  // no generic "you can't do that."
  hotspots: [
    {
      id: "tablet",
      name: "Etched Tablet",
      kind: "scenery",
      polygon: [[850, 350], [1050, 350], [1050, 510], [850, 510]],
      responses: {
        look: "Lettering older than Linear A, cut clean into basalt. “Three voices wake the ninth wave.” Someone translated it in pencil in the margin — then scratched the translation out.\n刻在玄武岩上的文字，比線形文字A還要古老。「三聲喚醒第九浪。」有人在旁邊用鉛筆寫了翻譯——後來又把它劃掉了。",
        use: "Indy runs a thumb along the grooves. Whatever wore them smooth did it a very long time ago.\n印第用拇指摸過刻痕。不管是什麼東西把它磨得這麼平滑，都已經是很久以前的事了。",
        default: "It's stone, it's ancient, and it is not going anywhere no matter how hard he pulls on it.\n這是塊石頭，年代久遠，不管怎麼拉都不會動的。",
      },
      setFlagOn: { look: "saw_tablet" },
    },
    {
      id: "higgins",
      name: "Higgins",
      kind: "actor",
      polygon: [[500, 690], [630, 690], [630, 910], [500, 910]],
      dialogue: "higgins_intro",
      responses: {
        look: "Higgins, the porter, fighting a mop-shaped war he isn't winning.\n工友希金斯，正在打一場拿拖把也打不贏的仗。",
        talk: null, // handled by the dialogue system — see engine main.js
        default: "He's got enough on his plate without being pushed around.\n他自己的麻煩已經夠多了，不需要再被人為難。",
      },
    },
    {
      id: "shelf",
      name: "Specimen Shelf",
      kind: "scenery",
      polygon: [[150, 500], [360, 500], [360, 760], [150, 760]],
      responses: {
        look: "Three jars of something the department calls 'preserved samples' and the janitorial staff calls 'not my problem.'\n三罐東西，系上稱之為「保存樣本」，工友則稱之為「不關我的事」。",
        open: "The jars are sealed with wax. Whatever's inside has been marinating since roughly the Coolidge administration.\n罐子用蠟封住了。裡面的東西大概從柯立芝總統任內就開始醃到現在了。",
        use: {
          crowbar:
            "He gets the crowbar halfway to the wax seal before some deep, professional instinct stops him. Whatever's in there has waited this long. It can keep waiting.\n撬棍才伸到蠟封一半，某種身為專業人士的直覺就叫他停手了。裡面的東西已經等了這麼久，不差再多等一下。",
          default: "He's not touching the jars. Some professional curiosities are better left curious.\n他才不要碰那些罐子。有些學術上的好奇心，還是留著當好奇心就好。",
        },
        default: "He's not touching the jars. Some professional curiosities are better left curious.\n他才不要碰那些罐子。有些學術上的好奇心，還是留著當好奇心就好。",
      },
    },
    {
      id: "crate",
      name: "Broken Shipping Crate",
      kind: "scenery",
      polygon: [[850, 660], [1160, 660], [1160, 900], [850, 900]],
      responses: {
        look: "TAGVS, stencilled on the side — the Tagus estuary dredge. The lid's been pried off and whatever rang like a church bell an hour ago is long gone.\n箱側印著「TAGVS」——塔古斯河口打撈上來的東西。蓋子已經被撬開，一小時前響得像教堂鐘聲的那玩意兒早就不見蹤影。",
        open: "Already open. Somebody in a hurry didn't bother with the crowbar sitting right here.\n已經開了。當時匆忙開箱的人根本沒用到就放在這裡的撬棍。",
        push: "It's nailed to the floor skid. It rocks two inches and stops, smug as anything.\n它被釘在底座滑板上，晃了兩吋就停住，一副事不關己的樣子。",
        default: "There's nothing left inside but packing straw and a very strong smell of the sea.\n裡面除了包裝用的稻草，什麼也沒剩，只有一股濃濃的海味。",
      },
    },
    {
      id: "pipe",
      name: "Overhead Pipe",
      kind: "scenery",
      polygon: [[1500, 250], [1660, 250], [1660, 630], [1500, 630]],
      responses: {
        look: "Cast iron, sweating condensation, humming very faintly at a pitch that sets his teeth on edge. Pipes don't hold a note. This one's holding a note.\n鑄鐵管，表面凝結著水珠，微微嗡嗡作響，音頻聽得他牙齒發酸。水管不應該會發出持續的音，但這根就是在發出持續的音。",
        pull: "It doesn't budge, but it rings when struck — one low tone, sustained a beat too long for ordinary plumbing — and dust sifts down from the joists.\n拉不動，但敲下去會發出鐘鳴——一個低沉的音，持續的時間長得不像普通水管——樑上的灰塵也跟著簌簌落下。",
        push: "Solid as the day it was laid. Whatever's making it hum isn't coming out through muscle — this wants matching, not moving.\n跟剛裝上去那天一樣堅固。讓它嗡嗡作響的東西，光靠蠻力是弄不出來的——這需要的是共鳴，不是推動。",
        use: "Quiet now. Whatever needed proving, it's proven.\n現在安靜下來了。該證明的事，已經證明了。",
        default: "It's forty years of college plumbing. It has survived worse ideas than his.\n這是學院用了四十年的水管，比他更糟的點子它都撐過來了。",
      },
      puzzleOnVerb: { use: "pipe_resonance" },
    },
    {
      id: "water",
      name: "Floodwater",
      kind: "scenery",
      polygon: [[300, 850], [1650, 850], [1780, 1080], [140, 1080]],
      responses: {
        look: "Brackish, ankle-deep, and rising slowly from somewhere the college's insurance policy definitely doesn't cover.\n又鹹又濁的水，深及腳踝，還在慢慢上升，源頭肯定不在學院保單的理賠範圍內。",
        use: "He is not going for a swim in his good boots. Not yet, anyway.\n他才不要穿著這雙好靴子下去游泳，至少現在還不想。",
        default: "Wading through it further would mean explaining wet socks to the Dean, again.\n再往裡走，就得再一次跟院長解釋為什麼襪子又濕了。",
      },
    },
    {
      id: "grate_stair",
      name: "Street Grate Stairwell",
      kind: "exit",
      polygon: [[700, 560], [940, 560], [940, 720], [700, 720]],
      requiresFlag: "prologue_complete",
      lockedLine: "Nothing more to do down here until he's worked out what he's actually looking for.\n在搞清楚自己到底在找什麼之前，這裡沒什麼好做的了。",
      to: { room: "lisbonAlley", spawn: { x: 900, y: 920, facing: "down" } },
      fallCaption:
        "Three months, two continents, and one very patient travel agent later, Barnett College is a long way behind him — Lisbon smells of salt and diesel and old stone.\n三個月過去，橫跨兩個大陸，還有一位極有耐心的旅行社人員幫忙張羅，巴奈特學院早已被遠遠拋在身後——里斯本瀰漫著海鹽、柴油與古老石頭的氣味。",
      responses: {
        look: "The stairwell up to the street grate, and the ordinary Barnett College afternoon waiting above it.\n通往街頭柵欄的樓梯，上面等著他的是巴奈特學院再平常不過的一個下午。",
      },
    },
  ],

  items: [
    {
      id: "crowbar",
      polygon: [[1090, 770], [1210, 770], [1210, 860], [1090, 860]],
      responses: {
        look: "A yard of rusty iron, property of Maintenance. It's leaving with him.\n一根一碼長的生鏽鐵撬，登記在維修部名下。它要跟他一起走了。",
      },
      setFlagOn: { take: "crowbar_taken" },
    },
    {
      id: "lantern",
      polygon: [[200, 500], [300, 500], [300, 600], [200, 600]],
      responses: {
        look: "Half a tank of oil and a soot-stained chimney. It'll do where the grate-light doesn't reach.\n油箱裡還剩半罐油，玻璃罩也被燻黑了。柵欄透下來的光照不到的地方，就靠它了。",
      },
      setFlagOn: { take: "lantern_taken" },
    },
    {
      id: "chart",
      polygon: [[1360, 850], [1480, 850], [1480, 950], [1360, 950]],
      responses: {
        look: "A sealed leather map tube, snagged against the pipe joint. Whoever dropped this down here either lost it in the panic, or wanted it found.\n一個密封的皮製地圖筒，卡在水管接頭處。掉在這裡的人，不是慌亂中弄丟的，就是故意要讓人找到的。",
      },
      setFlagOn: { take: "found_chart" },
    },
  ],

  actorStart: { x: 960, y: 900, facing: "down" },
};

export default subbasement;

// data/rooms/biminiPartners.js — Act 2, Partners Path: Bimini, Bahamas.
// Mo mans the air pump topside while the player dives (dialogue+cutscene),
// then the Star Bell — wedged in the wreck, silent in air — is a
// resonance puzzle (the high voice). Solving it completes the path.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient, CHARACTER_SCALE } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [220, 740], [1700, 740], [1800, 990], [120, 990],
];

function paintWaterColumn(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, H, [
    [0, "#7fd4d8"],
    [0.4, "#3fa8b8"],
    [0.75, "#1c6c80"],
    [1, "#0c3c4c"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // sunbeams from the surface
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#eafcff";
  for (let i = 0; i < 5; i++) {
    const x = 200 + i * 380;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 90, 0);
    ctx.lineTo(x - 60, H);
    ctx.lineTo(x - 150, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function paintBiminiRoad(ctx) {
  ctx.save();
  ctx.translate(960, 880);
  for (let i = -6; i <= 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#8a9a8a" : "#7a8a7a";
    ctx.beginPath();
    ctx.roundRect(i * 90 - 40, -10, 80, 40, 4);
    ctx.fill();
  }
  rimLight(ctx, () => ctx.rect(-460, -10, 920, 40), { color: "220,250,255", alpha: 0.2, width: 2 });
  ctx.restore();
}

function paintWreck(ctx) {
  ctx.save();
  ctx.translate(1350, 700);
  ctx.fillStyle = "rgba(20,40,45,0.75)";
  ctx.beginPath();
  ctx.moveTo(-220, 160);
  ctx.quadraticCurveTo(-240, 40, -140, -40);
  ctx.lineTo(160, -60);
  ctx.quadraticCurveTo(240, -20, 220, 100);
  ctx.lineTo(-220, 160);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(200,230,235,0.25)";
  ctx.lineWidth = 3;
  for (let i = -180; i < 180; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, -30 + Math.abs(i) * 0.15);
    ctx.lineTo(i, 130);
    ctx.stroke();
  }
  ctx.restore();
}

function paintSurfaceLine(ctx) {
  ctx.save();
  ctx.translate(160, 0);
  // a bright shaft of daylight falling all the way from the surface,
  // unmissable next to the general underwater gloom
  const shaft = ctx.createLinearGradient(-90, 0, 90, 0);
  shaft.addColorStop(0, "rgba(230,250,255,0)");
  shaft.addColorStop(0.5, "rgba(230,250,255,0.35)");
  shaft.addColorStop(1, "rgba(230,250,255,0)");
  ctx.fillStyle = shaft;
  ctx.fillRect(-90, 0, 180, 940);

  // a stout climbing rope with rungs, running the same span
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 920);
  ctx.lineTo(0, 40);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 6;
  for (let y = 100; y < 900; y += 60) {
    ctx.beginPath();
    ctx.moveTo(-30, y);
    ctx.lineTo(30, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(220,245,250,0.5)";
  for (let i = 0; i < 6; i++) {
    const y = 850 - i * 130;
    ctx.beginPath();
    ctx.arc(14 + (i % 2) * 16, y, 5 - i * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function paintMoTopside(ctx) {
  // Mo stays topside on the boat, seen from underwater — genuinely
  // clickable/talkable (dialogue: "mo_bimini" below), so she needs to read
  // as a person, not just a distant smudge. Same torso/head/hat silhouette
  // language as every other NPC (see e.g. paintDraghi in harborBar.js), at
  // real character proportions, in her own solid color so she doesn't melt
  // into the boat hull underneath her.
  //
  // Anchored well clear of (460+, 190+) rather than the extreme top-left
  // corner (used to be translate(320,170), hotspot [[220,60]..[400,200]]):
  // the menu/hint/reveal-hotspots buttons are CSS-positioned at a fixed
  // small pixel offset from the canvas's real top-left corner, which on a
  // compact desktop window (canvas rendered small, e.g. ~500px wide for
  // 1920 logical px) covers a much bigger chunk of LOGICAL space than it
  // looks like at a glance — big enough to sit on top of most of her old
  // hotspot, leaving only a sliver clickable underneath the button row.
  ctx.save();
  ctx.translate(560, 280);
  ctx.scale(CHARACTER_SCALE, CHARACTER_SCALE);

  // the boat hull, dimmed by the water between it and the camera
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#0c2c34";
  ctx.beginPath();
  ctx.roundRect(-70, -6, 220, 24, 6);
  ctx.fill();
  ctx.restore();

  // Mo herself — fully opaque, high-contrast against the bright surface
  // water above, so she's easy to spot rather than just a dark blob.
  ctx.fillStyle = "#0a1f26";
  ctx.beginPath();
  ctx.moveTo(-20, -8);
  ctx.lineTo(-15, -62);
  ctx.quadraticCurveTo(0, -82, 15, -62);
  ctx.lineTo(20, -8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -78, 15, 0, Math.PI * 2);
  ctx.fill();
  // her wide-brim hat, matching the portrait shown in dialogue
  ctx.beginPath();
  ctx.ellipse(0, -87, 21, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintDiverAndBell(ctx, found) {
  if (!found) {
    ctx.save();
    ctx.translate(1360, 780);
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 60);
    glow.addColorStop(0, "rgba(200,240,255,0.5)");
    glow.addColorStop(1, "rgba(200,240,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(210,240,245,0.7)";
    ctx.beginPath();
    ctx.moveTo(-16, 18);
    ctx.quadraticCurveTo(-20, -10, 0, -20);
    ctx.quadraticCurveTo(20, -10, 16, 18);
    ctx.closePath();
    ctx.fill();
    rimLight(ctx, () => {
      ctx.moveTo(-16, 18);
      ctx.quadraticCurveTo(-20, -10, 0, -20);
      ctx.quadraticCurveTo(20, -10, 16, 18);
    }, { color: "255,255,255", alpha: 0.5, width: 2 });
    ctx.restore();
  }
}

export const biminiPartners = {
  id: "biminiPartners",
  name: "Bimini, Bahamas — The Wreck",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintWaterColumn(ctx);
    paintSurfaceLine(ctx);
    paintMoTopside(ctx);
    lightWash(ctx, [960, 0, 960, 900], "220,250,255", 0.1);
    paintBiminiRoad(ctx);
    paintWreck(ctx);
    paintDiverAndBell(ctx, !!state?.flags?.star_bell_found);
    vignette(ctx, W, H, 0.5);
  },

  hotspots: [
    {
      id: "mo",
      name: "Mo (Topside)",
      nameZh: "莫（水面上）",
      kind: "actor",
      polygon: [[460, 190], [660, 190], [660, 350], [460, 350]],
      dialogue: "mo_bimini",
      responses: {
        look: "Mo, a shimmering silhouette at the surface, minding the air line like she's willing it to behave.\n莫，水面上一道晃動的剪影，緊盯著空氣管，好像光靠意志就能讓它乖乖聽話。",
        default: "She's fifteen feet up and mid-conversation with a pump. It'll have to wait.\n她在十五呎高的地方跟幫浦「談話」，這事得等等了。",
      },
    },
    {
      id: "road",
      name: "The Bimini Road",
      nameZh: "比米尼公路",
      kind: "scenery",
      polygon: [[500, 830], [1420, 830], [1420, 930], [500, 930]],
      responses: {
        look: "A dead-straight line of megalithic blocks along the sea floor. Officially beach rock. Unofficially, beach rock doesn't usually keep this good a right angle.\n海底一條筆直的巨石陣列。官方說法是海灘岩。非官方說法是，海灘岩通常不會這麼會抓直角。",
        default: "Interesting geology. Or not geology at all. Either way, it's not going anywhere.\n有趣的地質現象。或者根本不是地質現象。不管怎樣，它哪裡也不會去。",
      },
    },
    // Checked before "wreck" below, since its polygon sits inside the
    // wreck's larger one and hotspots are matched in array order — the
    // more specific hotspot has to come first to win the hit-test.
    {
      id: "bell_site",
      name: "The Star Bell",
      nameZh: "星辰鐘",
      kind: "scenery",
      polygon: [[1300, 720], [1420, 720], [1420, 840], [1300, 840]],
      hideWhenFlag: "star_bell_found",
      puzzleRequiresFlag: "mo_helped_bimini",
      responses: {
        look: "Wedged tight in the wreck's ribs, catching what little light makes it down here. Silent, for now.\n死死卡在沉船的肋骨之間，接收著這裡僅有的一點光線。暫時，還是沉默的。",
        use: "The current here would spin him around without a fixed air line to work against — Mo needs to be minding the pump first.\n沒有固定的空氣管可以借力，這裡的水流會把他轉得暈頭轉向——得先讓莫顧好幫浦才行。",
        default: "It's not coming free by looking at it.\n光看是弄不出來的。",
      },
      puzzleOnVerb: { use: "star_bell_resonance" },
    },
    {
      id: "wreck",
      name: "The Wreck",
      nameZh: "沉船",
      kind: "scenery",
      polygon: [[1140, 620], [1580, 620], [1580, 860], [1140, 860]],
      responses: {
        look: "A hull broken open like a ribcage, timbers gone soft and green with a century underwater. Something crystalline glints deep in the third rib.\n船殼裂開得像根肋骨架，木材泡了一世紀的水，早已發軟發綠。第三根肋骨深處有個晶亮的東西在閃。",
        default: "The current past the wreck is stronger than it looks. Best to be careful navigating around it.\n沉船附近的水流比看起來還要強勁，繞行時最好小心點。",
      },
    },
    {
      id: "surface",
      name: "Back to the Surface",
      nameZh: "返回水面",
      kind: "exit",
      polygon: [[60, 640], [260, 640], [260, 900], [60, 900]],
      requiresFlag: "act2_complete",
      lockedLine: "Not yet — there's still a Voice or two left to find.\n還不行——還有一兩個聲音沒找到呢。",
      to: { room: "calderaApproach", spawn: { x: 900, y: 900, facing: "down" } },
      fallCaption: "Mo hauls him up, and this time neither of them pretends it isn't the last stop before whatever comes next.\n莫把他拉了上去，這次兩人都沒再假裝——這確實是接下來那件大事之前的最後一站了。",
      responses: {
        look: "The line back up to the surface — and, from there, the last leg of the journey.\n通往水面的繩索——再過去，就是這趟旅程的最後一段路了。",
      },
    },
  ],

  items: [],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default biminiPartners;

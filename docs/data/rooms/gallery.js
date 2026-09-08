// data/rooms/gallery.js — Prologue Room 1 of 5: Barnett Hall Display Gallery.
//
// The player starts here. The diving-bell crate has just been cracked open
// and its contents spirited away through a hole blasted in the floor —
// the thieves' escape route. This room's one puzzle: take the rope before
// following them down.
//
// Art retrofitted to the Act 1 technique bar (engine/artHelpers.js) —
// multi-stop gradients, rim-lit edges, a vignette, textured floor.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

const W = 1920, H = 1080;

const WALKBOX = [
  [300, 700], [1620, 700], [1740, 960], [180, 960],
];

function paintWalls(ctx) {
  const g = paintedGradient(ctx, 0, 0, 0, 740, [
    [0, "#2c2318"],
    [0.45, "#3a2f22"],
    [0.8, "#4a3c2a"],
    [1, "#5a4a34"],
  ]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 740);

  // wainscoting
  ctx.fillStyle = "#2c2318";
  ctx.fillRect(0, 520, W, 220);
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 3;
  for (let x = 60; x < W; x += 140) {
    ctx.beginPath();
    ctx.moveTo(x, 520);
    ctx.lineTo(x, 740);
    ctx.stroke();
  }

  // tall arched window, daylight streaming in
  ctx.save();
  ctx.translate(1400, 0);
  const glass = paintedGradient(ctx, 0, 120, 0, 480, [
    [0, "#e8f4ee"],
    [1, "#a8c8c0"],
  ]);
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.moveTo(-110, 480);
  ctx.lineTo(-110, 120);
  ctx.quadraticCurveTo(0, -20, 110, 120);
  ctx.lineTo(110, 480);
  ctx.closePath();
  ctx.fill();
  const archPath = () => {
    ctx.moveTo(-110, 480);
    ctx.lineTo(-110, 120);
    ctx.quadraticCurveTo(0, -20, 110, 120);
    ctx.lineTo(110, 480);
  };
  ctx.strokeStyle = "#5c4433";
  ctx.lineWidth = 10;
  ctx.beginPath();
  archPath();
  ctx.stroke();
  rimLight(ctx, archPath, { color: "255,244,214", alpha: 0.5, width: 3 });
  ctx.strokeStyle = "rgba(92,68,51,0.6)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.lineTo(0, 480);
  ctx.moveTo(-110, 300);
  ctx.lineTo(110, 300);
  ctx.stroke();
  ctx.restore();

  lightWash(ctx, [1290, 60, 1720, 900], "255,244,214", 0.16);

  // portrait of the Dean
  ctx.save();
  ctx.translate(400, 250);
  ctx.fillStyle = "#2c2318";
  ctx.fillRect(-70, -90, 140, 180);
  ctx.fillStyle = "#5c4433";
  ctx.fillRect(-60, -80, 120, 160);
  ctx.fillStyle = "#c98a5f";
  ctx.beginPath();
  ctx.arc(0, -20, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c1712";
  ctx.beginPath();
  ctx.moveTo(-40, 70);
  ctx.quadraticCurveTo(0, 30, 40, 70);
  ctx.lineTo(40, 80);
  ctx.lineTo(-40, 80);
  ctx.closePath();
  ctx.fill();
  rimLight(ctx, () => ctx.rect(-70, -90, 140, 180), { color: "255,220,170", alpha: 0.3, width: 2 });
  ctx.restore();
}

function paintFloor(ctx) {
  const g = paintedGradient(ctx, 0, 700, 0, H, [
    [0, "#7a5a3a"],
    [1, "#4a3420"],
  ]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 740);
  ctx.lineTo(W, 740);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  texturedFloor(ctx, { x: 0, y: 740, w: W, h: H - 740, vanishX: 960 });
}

function paintPedestal(ctx) {
  ctx.save();
  ctx.translate(650, 800);
  ctx.fillStyle = "#8a8f94";
  ctx.beginPath();
  ctx.roundRect(-70, -20, 140, 90, 6);
  ctx.fill();
  rimLight(ctx, () => ctx.roundRect(-70, -20, 140, 90, 6), { color: "255,230,190", alpha: 0.35, width: 2 });
  ctx.strokeStyle = "#5f6469";
  ctx.lineWidth = 3;
  ctx.strokeRect(-70, -20, 140, 90);
  // open crate on top, empty
  ctx.fillStyle = "#6a4c34";
  ctx.beginPath();
  ctx.roundRect(-55, -70, 110, 55, 4);
  ctx.fill();
  ctx.strokeStyle = "#4a3423";
  ctx.lineWidth = 4;
  ctx.strokeRect(-55, -70, 110, 55);
  ctx.fillStyle = "rgba(244,201,93,0.5)";
  ctx.font = "bold 14px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("TAGVS", 0, -40);
  // lid tossed aside, propped against pedestal
  ctx.save();
  ctx.translate(75, -10);
  ctx.rotate(-0.5);
  ctx.fillStyle = "#5a3f2a";
  ctx.fillRect(-45, -6, 90, 12);
  ctx.restore();
  ctx.restore();
}

function paintHole(ctx) {
  ctx.save();
  ctx.translate(1150, 870);
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.ellipse(0, 0, 160, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  // jagged broken-floor edge
  ctx.strokeStyle = "#8a6a45";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(0, 0, 160, 70, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function paintRope(ctx, taken) {
  if (taken) return;
  ctx.save();
  ctx.translate(1020, 830);
  ctx.strokeStyle = "#c9a86a";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.quadraticCurveTo(20, 0, -10, 40);
  ctx.stroke();
  ctx.restore();
}

export const gallery = {
  id: "gallery",
  name: "Barnett Hall — Display Gallery",
  walkbox: WALKBOX,

  drawBackground(ctx, state) {
    paintWalls(ctx);
    paintFloor(ctx);
    paintHole(ctx);
    paintPedestal(ctx);
    paintRope(ctx, state?.flags?.rope_taken);
    vignette(ctx, W, H, 0.45);
  },

  hotspots: [
    {
      id: "crate",
      name: "Empty Crate",
      nameZh: "空板條箱",
      kind: "scenery",
      polygon: [[595, 720], [790, 720], [790, 830], [595, 830]],
      responses: {
        look: "The Tagus dredge crate, hasp snapped clean off. Whatever rang loud enough to crack a floor is long gone — but someone scratched a line into the lip before they ran: “Three voices wake the ninth wave.” Not a warning. A recipe.\n塔古斯河打撈上來的板條箱，鎖扣整個被扯斷了。不管是什麼東西響到能把地板震裂，早就不知去向——但有人跑之前在箱緣刻了一行字：「三聲喚醒第九浪。」這不是警告，是配方。",
        open: "It's already open. Whoever did the opening wasn't gentle, and wasn't planning to explain it to the Dean.\n已經被打開了。動手的人下手可不輕，顯然也沒打算跟院長解釋。",
        default: "It's done its damage for one day. Best not to touch it further.\n今天造的孽已經夠多了，還是別再碰它了。",
      },
      setFlagOn: { look: "read_crate_etching" },
    },
    {
      id: "window",
      name: "Broken Window",
      nameZh: "破裂的窗戶",
      kind: "scenery",
      polygon: [[1290, 60], [1510, 60], [1510, 480], [1290, 480]],
      responses: {
        look: "Every pane on this side of the hall is starred with cracks, radiating out from nothing at all. Sound did that. He's spent fifteen years teaching that glass doesn't work this way.\n大廳這一側的每一片玻璃都裂成了蜘蛛網，裂痕就這樣憑空炸開。是聲音幹的。他教了十五年書，一直告訴學生玻璃不是這樣裂的。",
        default: "Best not to lean on cracked glass three floors up. He's already had one bad night.\n三層樓高的地方，最好別靠在裂開的玻璃上。他今晚已經夠倒楣了。",
      },
    },
    {
      id: "portrait",
      name: "Portrait of the Dean",
      nameZh: "院長的畫像",
      kind: "scenery",
      polygon: [[330, 160], [470, 160], [470, 340], [330, 340]],
      responses: {
        look: "Dean Whitfield, painted mid-scowl, as always — the artist clearly worked from life. He is going to have opinions about the hole in his gallery floor, and all of them will involve Indy's budget.\n惠特菲爾德院長，畫中一如往常皺著眉——畫家顯然是照真人畫的。他對展廳地板上這個洞肯定會有意見，而且每一條都會扯到印第的經費。",
        default: "The Dean's portrait glowers back. Even in oil paint, the man disapproves.\n院長的畫像瞪了回來。就算只是油畫，這個人也是一臉不贊同。",
      },
    },
    {
      id: "hole",
      name: "Hole in the Floor",
      nameZh: "地板上的破洞",
      kind: "exit",
      polygon: [[990, 810], [1310, 810], [1310, 940], [990, 940]],
      requiresFlag: "rope_taken",
      lockedLine: "Not before he's got something to hold onto on the way down.\n下去之前，得先找點東西能抓著才行。",
      to: { room: "stacks", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "He swings through the gap and drops into the dark below.\n他盪過缺口，墜入下方的黑暗之中。",
      responses: {
        look: "Raw, splintered edges, and a straight drop into blackness. Whoever left this way in a hurry didn't stop to check the landing.\n粗糙的裂口，木屑四散，往下就是一片漆黑。走這條路逃走的人顯然沒空回頭確認下面是什麼。",
      },
    },
  ],

  items: [
    {
      id: "rope",
      polygon: [[985, 790], [1055, 790], [1055, 875], [985, 875]],
      responses: {
        look: "A stout length of hemp, still knotted around a floor joist. Someone meant to come back for it.\n一段粗麻繩，還牢牢綁在地板的橫樑上。看來有人本來打算回來拿的。",
      },
      setFlagOn: { take: "rope_taken" },
    },
  ],

  actorStart: { x: 700, y: 900, facing: "down" },
};

export default gallery;

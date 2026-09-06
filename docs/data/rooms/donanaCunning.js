// data/rooms/donanaCunning.js — Act 2, Cunning Path: the Doñana marshes,
// solo. No Mo — instead, a warden's checkpoint blocks the marsh, and the
// "two person" puzzle becomes a one-person forgery: find a blank permit,
// find the Consortium's own stamp, and let paperwork do the talking.

import { vignette, lightWash, rimLight, texturedFloor, paintedGradient } from "../../engine/artHelpers.js";

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
        look: "A warden in a faded uniform, more interested in his paperwork than the marsh itself. He hasn't looked up once.",
        talk: "\"No permit, no marsh,\" he says, without looking up. \"Rules are rules.\"",
        give: {
          forged_permit:
            "He barely glances at it before stamping the air with an invisible rubber stamp of pure disinterest. \"Should've said so.\" He still hasn't looked up.",
          default: "He'd want to see it in writing, not in hand.",
        },
        default: "He's not moving until the paperwork's in order.",
      },
    },
    {
      id: "desk",
      name: "Warden's Desk",
      kind: "scenery",
      polygon: [[1500, 620], [1650, 620], [1650, 760], [1500, 760]],
      responses: {
        look: "A cluttered desk just inside the shack door — permits, forms, and a heavy brass stamp, all left carelessly in reach.",
        default: "Nothing here he needs to do more than look and take.",
      },
    },
    {
      id: "reeds",
      name: "Reed Bank",
      kind: "scenery",
      polygon: [[60, 400], [320, 400], [320, 640], [60, 640]],
      responses: {
        look: "Head-high reeds. A punt is tied off somewhere in there, for whoever the warden decides can use it.",
        default: "Nothing to do here but wait on the warden's good graces — or the paperwork to fake them.",
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
            "Still half-buried, still out of reach — but paper like this has a way of making a warden forget where his own shack ends.",
          default:
            "Something pale and spiral-ridged, humming faintly under the mud whenever the wind drops. The warden's shack blocks the only dry path to it.",
        },
        use: "Not without the warden waving him through first — and he's not waving anyone through without paper.",
        default: "It's not coming free without a plan.",
      },
      puzzleOnVerb: { use: "salt_conch_resonance" },
    },
    {
      id: "boat_launch",
      name: "Channel Out",
      kind: "exit",
      polygon: [[1660, 760], [1830, 760], [1830, 960], [1660, 960]],
      requiresFlag: "salt_conch_found",
      lockedLine: "No sense leaving the marsh without the conch.",
      to: { room: "saharaCunning", spawn: { x: 300, y: 900, facing: "down" } },
      fallCaption: "The forged permit gets him out as easily as it got him in. Punt, train, and a very long journey later, the marsh gives way to the Sahara.",
      responses: {
        look: "The channel back out toward dry land.",
      },
    },
  ],

  items: [
    {
      id: "blank_permit",
      polygon: [[1520, 650], [1580, 650], [1580, 700], [1520, 700]],
      responses: {
        look: "A blank marsh-access permit, official letterhead and all.",
      },
    },
    {
      id: "consortium_stamp",
      polygon: [[1590, 660], [1640, 660], [1640, 710], [1590, 710]],
      responses: {
        look: "A brass desk stamp bearing the Adriatic Salvage Consortium's crest. Someone here has been doing business with Draghi's people.",
      },
      setFlagOn: { look: "learned_consortium_at_donana" },
    },
  ],

  actorStart: { x: 900, y: 900, facing: "down" },
};

export default donanaCunning;

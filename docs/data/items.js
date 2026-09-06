// data/items.js — every carryable item. Icons are drawn, not imaged, for now.

export const ITEMS = {
  crowbar: {
    id: "crowbar",
    name: "Rusty Crowbar",
    lookLine: "A yard of pitted iron. Barnett College Maintenance, property of. Nobody will miss it.",
    drawIcon(ctx, s) {
      ctx.strokeStyle = "#8a8f94";
      ctx.lineWidth = s * 0.12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.35);
      ctx.lineTo(s * 0.25, -s * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.35);
      ctx.lineTo(-s * 0.05, s * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.25, -s * 0.35);
      ctx.lineTo(s * 0.25, -s * 0.1);
      ctx.stroke();
    },
  },
  lantern: {
    id: "lantern",
    name: "Oil Lantern",
    lookLine: "Half a tank of oil left. Whoever left it down here wasn't planning on staying long.",
    drawIcon(ctx, s) {
      ctx.strokeStyle = "#3a2a1c";
      ctx.fillStyle = "#f4c95d";
      ctx.lineWidth = s * 0.08;
      ctx.beginPath();
      ctx.rect(-s * 0.22, -s * 0.18, s * 0.44, s * 0.4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.12, -s * 0.18);
      ctx.lineTo(0, -s * 0.4);
      ctx.lineTo(s * 0.12, -s * 0.18);
      ctx.stroke();
    },
  },
  rope: {
    id: "rope",
    name: "Stout Rope",
    lookLine: "Hemp, knotted, and strong enough to trust his weight to. Barely.",
    drawIcon(ctx, s) {
      ctx.strokeStyle = "#c9a86a";
      ctx.lineWidth = s * 0.16;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.3);
      ctx.quadraticCurveTo(s * 0.1, 0, -s * 0.1, s * 0.3);
      ctx.stroke();
      ctx.strokeStyle = "#8a6a3a";
      ctx.lineWidth = s * 0.04;
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.3);
      ctx.quadraticCurveTo(s * 0.1, 0, -s * 0.1, s * 0.3);
      ctx.stroke();
    },
  },
  chart: {
    id: "chart",
    name: "Portuguese Chart",
    lookLine:
      "A 16th-century chart of the Iberian coast, three anchorages ringed in a hand nobody alive could have written. The vellum's damp but the ink's held.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#8a6a45";
      ctx.beginPath();
      ctx.roundRect(-s * 0.32, -s * 0.09, s * 0.64, s * 0.18, s * 0.09);
      ctx.fill();
      ctx.strokeStyle = "#4a3423";
      ctx.lineWidth = s * 0.03;
      ctx.stroke();
      ctx.fillStyle = "#5c4433";
      ctx.beginPath();
      ctx.arc(-s * 0.32, 0, s * 0.09, 0, Math.PI * 2);
      ctx.fill();
    },
  },

  salt_conch: {
    id: "salt_conch",
    name: "The Salt Conch",
    lookLine: "A fossilised shell horn, heavier than it looks. The low note it holds isn't in his range to hum, but he can feel it in his teeth.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#d9c7a8";
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.28);
      ctx.quadraticCurveTo(-s * 0.34, -s * 0.2, 0, -s * 0.34);
      ctx.quadraticCurveTo(s * 0.34, -s * 0.2, s * 0.1, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.05, s * 0.36, -s * 0.3, s * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#a8926a";
      ctx.lineWidth = s * 0.03;
      ctx.stroke();
      ctx.strokeStyle = "#8a6a45";
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.quadraticCurveTo(s * 0.1, -s * 0.05, 0, s * 0.2);
      ctx.stroke();
    },
  },

  storm_fork: {
    id: "storm_fork",
    name: "The Storm Fork",
    lookLine: "A two-metre bronze tuning fork, once bolted to a lighthouse as a fog-warner. It hums the middle note of something he still can't name.",
    drawIcon(ctx, s) {
      ctx.strokeStyle = "#a97142";
      ctx.lineWidth = s * 0.1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, -s * 0.35);
      ctx.lineTo(-s * 0.15, s * 0.15);
      ctx.moveTo(s * 0.15, -s * 0.35);
      ctx.lineTo(s * 0.15, s * 0.15);
      ctx.moveTo(-s * 0.2, s * 0.15);
      ctx.quadraticCurveTo(0, s * 0.38, s * 0.2, s * 0.15);
      ctx.stroke();
    },
  },

  star_bell: {
    id: "star_bell",
    name: "The Star Bell",
    lookLine: "A crystal handbell that only rings underwater — dry, it makes no sound at all, which is its own kind of unsettling.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "rgba(180,220,230,0.55)";
      ctx.strokeStyle = "#8ac8d0";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.moveTo(-s * 0.24, s * 0.28);
      ctx.quadraticCurveTo(-s * 0.3, -s * 0.15, 0, -s * 0.3);
      ctx.quadraticCurveTo(s * 0.3, -s * 0.15, s * 0.24, s * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#5c4433";
      ctx.beginPath();
      ctx.arc(0, -s * 0.32, s * 0.05, 0, Math.PI * 2);
      ctx.fill();
    },
  },

  // Cunning Path — inventory-chain forgery items. Each pair combines
  // automatically the moment the second piece is picked up (see the
  // `combinesWith` handling in engine/main.js's runAction).
  blank_permit: {
    id: "blank_permit",
    name: "Blank Permit",
    lookLine: "An unfilled marsh-access permit, official letterhead and all. All it's missing is a stamp.",
    combinesWith: "consortium_stamp",
    combinesInto: "forged_permit",
    combineLine: "A little pressure, a lot of nerve, and the blank permit carries a stamp it was never issued. Forged, but it'll pass a glance.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#e8dcc4";
      ctx.strokeStyle = "#8a6a45";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.rect(-s * 0.28, -s * 0.34, s * 0.56, s * 0.68);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#a8926a";
      for (let i = -0.15; i <= 0.2; i += 0.12) {
        ctx.beginPath();
        ctx.moveTo(-s * 0.18, s * i);
        ctx.lineTo(s * 0.18, s * i);
        ctx.stroke();
      }
    },
  },
  consortium_stamp: {
    id: "consortium_stamp",
    name: "Consortium Stamp",
    lookLine: "A brass desk stamp, the Adriatic Salvage Consortium's crest worn smooth from use. Nobody's missed it yet.",
    combinesWith: "blank_permit",
    combinesInto: "forged_permit",
    combineLine: "A little pressure, a lot of nerve, and the blank permit carries a stamp it was never issued. Forged, but it'll pass a glance.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#8a6a45";
      ctx.fillRect(-s * 0.1, -s * 0.3, s * 0.2, s * 0.34);
      ctx.fillStyle = "#3a2418";
      ctx.beginPath();
      ctx.ellipse(0, s * 0.16, s * 0.24, s * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  forged_permit: {
    id: "forged_permit",
    name: "Forged Permit",
    lookLine: "It wouldn't survive a second look from anyone who actually works the marsh. Luckily, the warden mostly just wants the paperwork to exist.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#e8dcc4";
      ctx.strokeStyle = "#8a6a45";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.rect(-s * 0.28, -s * 0.34, s * 0.56, s * 0.68);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(178,60,45,0.7)";
      ctx.lineWidth = s * 0.025;
      ctx.beginPath();
      ctx.ellipse(s * 0.05, s * 0.16, s * 0.16, s * 0.1, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    },
  },

  local_robes: {
    id: "local_robes",
    name: "Local Robes",
    lookLine: "Loose, pale, and a great deal cooler than a tweed jacket. Bought, not stolen — he insisted on that much.",
    combinesWith: "headscarf",
    combinesInto: "desert_disguise",
    combineFlag: "desert_disguise_worn",
    combineLine: "Robes, scarf, and a squint he didn't have to fake — from ten feet away, he could be anybody's guide.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#e8d9b0";
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.32);
      ctx.lineTo(-s * 0.26, s * 0.32);
      ctx.lineTo(s * 0.26, s * 0.32);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#a98a5c";
      ctx.lineWidth = s * 0.02;
      ctx.stroke();
    },
  },
  headscarf: {
    id: "headscarf",
    name: "Sun-Bleached Headscarf",
    lookLine: "Faded from indigo to near-grey by years of sun. Whoever wore it last knew the desert a great deal better than he does.",
    combinesWith: "local_robes",
    combinesInto: "desert_disguise",
    combineFlag: "desert_disguise_worn",
    combineLine: "Robes, scarf, and a squint he didn't have to fake — from ten feet away, he could be anybody's guide.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#5c7a8a";
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.3, s * 0.18, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3a5060";
      ctx.lineWidth = s * 0.02;
      ctx.stroke();
    },
  },
  desert_disguise: {
    id: "desert_disguise",
    name: "Desert Disguise",
    lookLine: "Robes and scarf enough to pass, at a distance, for someone who belongs out here. It won't survive a real conversation.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#e8d9b0";
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.32);
      ctx.lineTo(-s * 0.26, s * 0.32);
      ctx.lineTo(s * 0.26, s * 0.32);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#5c7a8a";
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.22, s * 0.22, s * 0.13, 0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },

  requisition_form: {
    id: "requisition_form",
    name: "Consortium Requisition Form",
    lookLine: "A blank Adriatic Salvage Consortium dive-authorisation form. Everything a dockyard foreman would want to see, except a signature.",
    combinesWith: "official_seal",
    combinesInto: "forged_requisition",
    combineLine: "A practiced hand, a borrowed seal, and the requisition looks signed by someone who was never anywhere near it.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#dce8ea";
      ctx.strokeStyle = "#5c7a8a";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.rect(-s * 0.28, -s * 0.34, s * 0.56, s * 0.68);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#8aa5c9";
      for (let i = -0.15; i <= 0.2; i += 0.12) {
        ctx.beginPath();
        ctx.moveTo(-s * 0.18, s * i);
        ctx.lineTo(s * 0.18, s * i);
        ctx.stroke();
      }
    },
  },
  official_seal: {
    id: "official_seal",
    name: "Official Seal",
    lookLine: "A wax-and-ribbon seal, lifted from a document nobody will miss until it's far too late to matter.",
    combinesWith: "requisition_form",
    combinesInto: "forged_requisition",
    combineLine: "A practiced hand, a borrowed seal, and the requisition looks signed by someone who was never anywhere near it.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#a03020";
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.22, s * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#5c1810";
      ctx.lineWidth = s * 0.02;
      ctx.stroke();
    },
  },
  forged_requisition: {
    id: "forged_requisition",
    name: "Forged Requisition",
    lookLine: "It'll pass a bored foreman's glance. It will not survive Draghi actually reading it, so best not to linger on the dock.",
    drawIcon(ctx, s) {
      ctx.fillStyle = "#dce8ea";
      ctx.strokeStyle = "#5c7a8a";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.rect(-s * 0.28, -s * 0.34, s * 0.56, s * 0.68);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#a03020";
      ctx.beginPath();
      ctx.ellipse(s * 0.05, s * 0.16, s * 0.12, s * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
};

export function getItem(id) {
  return ITEMS[id];
}

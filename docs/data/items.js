// data/items.js — every carryable item. Icons are drawn, not imaged, for now.

export const ITEMS = {
  crowbar: {
    id: "crowbar",
    name: "Rusty Crowbar",
    nameZh: "生鏽鐵撬",
    lookLine: "A yard of pitted iron. Barnett College Maintenance, property of. Nobody will miss it.\n一支鏽跡斑斑的鐵撬,足有一碼長。屬於巴奈特學院維修部財產。不會有人想念它的。",
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
    nameZh: "油燈",
    lookLine: "Half a tank of oil left. Whoever left it down here wasn't planning on staying long.\n油箱裡還剩半桶油。留下它的人,顯然沒打算在這裡待太久。",
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
    nameZh: "粗麻繩",
    lookLine: "Hemp, knotted, and strong enough to trust his weight to. Barely.\n麻繩,打了結,勉強能撐住他的體重——是勉強。",
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
    nameZh: "葡萄牙海圖",
    lookLine:
      "A 16th-century chart of the Iberian coast, three anchorages ringed in a hand nobody alive could have written. The vellum's damp but the ink's held.\n一張十六世紀的伊比利亞海岸圖,三個錨地被圈了起來,筆跡絕不可能出自任何在世的人。羊皮紙已經潮濕,但墨跡依然清晰。",
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
    nameZh: "海鹽法螺",
    lookLine: "A fossilised shell horn, heavier than it looks. The low note it holds isn't in his range to hum, but he can feel it in his teeth.\n一支化石貝殼號角,比看起來沉得多。它藏著的低音他哼不出來,但能感覺到那震動一路傳到牙齒裡。",
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
    nameZh: "風暴音叉",
    lookLine: "A two-metre bronze tuning fork, once bolted to a lighthouse as a fog-warner. It hums the middle note of something he still can't name.\n一支兩公尺長的青銅音叉,曾經固定在燈塔上充當霧笛。它哼著中音,那是某件他仍說不出名字的東西的一部分。",
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
    nameZh: "星辰鈴",
    lookLine: "A crystal handbell that only rings underwater — dry, it makes no sound at all, which is its own kind of unsettling.\n一只水晶手鈴,只有在水裡才會發出聲音——在乾燥的地方完全沒有聲響,這本身就有點令人發毛。",
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
    nameZh: "空白通行證",
    lookLine: "An unfilled marsh-access permit, official letterhead and all. All it's missing is a stamp.\n一張還沒填寫的沼澤通行證,連正式信頭都齊全,只差一個印章。",
    combinesWith: "consortium_stamp",
    combinesInto: "forged_permit",
    combineLine: "A little pressure, a lot of nerve, and the blank permit carries a stamp it was never issued. Forged, but it'll pass a glance.\n一點力道,一點膽量,空白通行證就蓋上了一個從未核發過的印章。是偽造的,但隨便一瞥是看不出來的。",
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
    nameZh: "財團印章",
    lookLine: "A brass desk stamp, the Adriatic Salvage Consortium's crest worn smooth from use. Nobody's missed it yet.\n一枚黃銅桌上印章,亞得里亞海打撈財團的徽章已經被磨得光滑。目前還沒人發現它不見了。",
    combinesWith: "blank_permit",
    combinesInto: "forged_permit",
    combineLine: "A little pressure, a lot of nerve, and the blank permit carries a stamp it was never issued. Forged, but it'll pass a glance.\n一點力道,一點膽量,空白通行證就蓋上了一個從未核發過的印章。是偽造的,但隨便一瞥是看不出來的。",
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
    nameZh: "偽造通行證",
    lookLine: "It wouldn't survive a second look from anyone who actually works the marsh. Luckily, the warden mostly just wants the paperwork to exist.\n真正在沼澤裡工作的人,只要多看一眼就能識破。幸好那位管理員在意的只是有沒有這張紙,而不是紙上寫了什麼。",
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
    nameZh: "當地長袍",
    lookLine: "Loose, pale, and a great deal cooler than a tweed jacket. Bought, not stolen — he insisted on that much.\n寬鬆、色淺,穿起來比粗花呢外套涼快多了。是買來的,不是偷的——這點他堅持要說清楚。",
    combinesWith: "headscarf",
    combinesInto: "desert_disguise",
    combineFlag: "desert_disguise_worn",
    combineLine: "Robes, scarf, and a squint he didn't have to fake — from ten feet away, he could be anybody's guide.\n長袍、頭巾,再加上一副不用裝就有的瞇眼神情——十步之外,他看起來就像隨便哪個當地嚮導。",
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
    nameZh: "褪色頭巾",
    lookLine: "Faded from indigo to near-grey by years of sun. Whoever wore it last knew the desert a great deal better than he does.\n經年日曬,靛藍色已經褪成近乎灰色。上一個戴過它的人,顯然比他更懂這片沙漠。",
    combinesWith: "local_robes",
    combinesInto: "desert_disguise",
    combineFlag: "desert_disguise_worn",
    combineLine: "Robes, scarf, and a squint he didn't have to fake — from ten feet away, he could be anybody's guide.\n長袍、頭巾,再加上一副不用裝就有的瞇眼神情——十步之外,他看起來就像隨便哪個當地嚮導。",
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
    nameZh: "沙漠偽裝",
    lookLine: "Robes and scarf enough to pass, at a distance, for someone who belongs out here. It won't survive a real conversation.\n長袍加頭巾,遠遠看去足以蒙混過關,像是這裡的當地人。但只要真的開口交談,馬上就會露餡。",
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
    nameZh: "潛水許可申請表",
    lookLine: "A blank Adriatic Salvage Consortium dive-authorisation form. Everything a dockyard foreman would want to see, except a signature.\n一張空白的亞得里亞海打撈財團潛水許可申請表。船塢工頭想看的東西全都有,就是少了一個簽名。",
    combinesWith: "official_seal",
    combinesInto: "forged_requisition",
    combineLine: "A practiced hand, a borrowed seal, and the requisition looks signed by someone who was never anywhere near it.\n一手練熟的字跡,一枚借來的印章,申請表看起來就像出自某個根本沒沾過邊的人之手。",
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
    nameZh: "官方印章",
    lookLine: "A wax-and-ribbon seal, lifted from a document nobody will miss until it's far too late to matter.\n一枚蠟封加緞帶的印章,取自某份文件——等到有人發現不見了,早就為時已晚。",
    combinesWith: "requisition_form",
    combinesInto: "forged_requisition",
    combineLine: "A practiced hand, a borrowed seal, and the requisition looks signed by someone who was never anywhere near it.\n一手練熟的字跡,一枚借來的印章,申請表看起來就像出自某個根本沒沾過邊的人之手。",
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
    nameZh: "偽造申請表",
    lookLine: "It'll pass a bored foreman's glance. It will not survive Draghi actually reading it, so best not to linger on the dock.\n夠矇混過一個懶得多看的工頭,但要是德拉吉真的仔細讀了,肯定會穿幫——所以最好別在碼頭上多逗留。",
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

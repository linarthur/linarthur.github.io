// data/cutscenes.js — keyed step arrays for engine/cutscene.js.
// Each key is referenced by id from dialogue nodes or room/puzzle logic.
//
// `say` steps' `speaker` and `text` are both written "English\n中文" — same
// convention as every other bilingual string in the game — and rendered as
// two full lines by engine/main.js's cutsceneCtx.say(). A `speaker: null`
// step (an environmental/narration line with no name attribution) only
// needs `text` to be bilingual.

export const CUTSCENES = {
  leafpool_hint: [
    { type: "camera", ms: 260 },
    {
      type: "say",
      speaker: "Leafpool\n葉池",
      text: "The hum's coming from under the tablet, if my nose is worth anything down here.\n那嗡嗡聲是從石板下面傳來的，如果我的鼻子在這裡還算管用的話。",
      ms: 2200,
    },
    { type: "walkTo", x: 950, y: 620 },
    { type: "wait", ms: 300 },
    { type: "setFlag", key: "leafpool_pointed_at_tablet", value: true },
  ],

  prologue_end: [
    { type: "wait", ms: 300 },
    {
      type: "say",
      speaker: "Indy\n印第",
      text: "A chart. Someone wanted this crate quiet — and this map quieter still.\n一張海圖。有人想讓這箱子保持沉默——這張地圖，要更加沉默。",
      ms: 2400,
    },
    { type: "camera", ms: 200 },
    {
      type: "say",
      speaker: "Leafpool\n葉池",
      text: "Three anchorages, Professor. StarClan doesn't often bother marking a map for someone — reckon you'd best not waste the gift.\n三個錨地，教授。星族不常費心為誰標記地圖——我看你最好別辜負這份心意。",
      ms: 2400,
    },
    { type: "setFlag", key: "prologue_complete", value: true },
  ],

  // Act 1, the harbour bar — the first sight of Draghi, before she's said
  // a word. Fires once, from the `draghi_intro` tree's root node, the same
  // way `leafpool_hint` fires from a mid-conversation node below.
  draghi_reveal: [
    { type: "camera", ms: 250 },
    {
      type: "say",
      speaker: "Indy\n印第",
      text: "Well. Someone dressed for a funeral, and came to the wrong bar.\n哦。有人穿得像去參加葬禮，卻走錯了酒吧。",
      ms: 2200,
    },
  ],

  // Act 2, Partners Path — the "two person" puzzles resolve as one dialogue
  // + cutscene beat apiece: Mo does her half, the player does theirs.
  donana_punt: [
    {
      type: "say",
      speaker: "Mo\n莫",
      text: "Follow the dry channels — watch where the flamingos won't walk.\n沿著乾燥的水道走——看紅鶴不願踏足的地方。",
      ms: 2000,
    },
    { type: "walkTo", x: 1400, y: 900 },
    {
      type: "say",
      speaker: "Indy\n印第",
      text: "Easy for you to say — you're not the one poling.\n你說得輕鬆——撐船的又不是你。",
      ms: 1800,
    },
  ],
  sahara_rings: [
    {
      type: "say",
      speaker: "Mo\n莫",
      text: "Bearing's good — hold that line and we'll thread every ring dead centre.\n方位沒錯——保持這條線，我們就能穿過每一圈的正中心。",
      ms: 2200,
    },
    { type: "walkTo", x: 1400, y: 900 },
    { type: "camera", ms: 200 },
  ],
  bimini_dive: [
    {
      type: "say",
      speaker: "Mo\n莫",
      text: "Suit's sealed. Down the ladder, and mind the current past the third rib of the wreck.\n潛水裝密封好了。順著梯子下去，經過沉船第三根肋骨時，小心水流。",
      ms: 2400,
    },
    { type: "walkTo", x: 1400, y: 900 },
    { type: "camera", ms: 200 },
  ],

  // Act 3 — The Caldera. One shared convergence scene regardless of which
  // Act 2 path was taken (design doc: "no dead ends," and the path-choice
  // screen's own promise that all three roads cross again before this is
  // over) — the personalization lives in the credits screen's closing
  // lines instead of three separate cutscenes here.
  caldera_arrival: [
    {
      type: "say",
      speaker: "Indy\n印第",
      text: "Three voices, three continents, and it all comes down to a hole in the ground that used to be a volcano.\n三個聲音，三塊大陸，最後全都匯集到這個曾經是火山的地洞裡。",
      ms: 2600,
    },
    { type: "walkTo", x: 900, y: 900 },
    { type: "camera", ms: 250 },
    { type: "setFlag", key: "caldera_arrival_seen", value: true },
  ],

  bell_awakens: [
    { type: "camera", ms: 400 },
    {
      type: "say",
      speaker: "Indy\n印第",
      text: "Three voices wake the ninth wave. Not a warning. Instructions.\n三聲喚醒第九浪。這不是警告，是指示。",
      ms: 2600,
    },
    { type: "wait", ms: 400 },
    {
      type: "say",
      speaker: null,
      text: "Light floods a chamber that has no business being underwater — and for one held breath, Atlantis stops being a legend.\n光芒湧入一間不該存在於水底的密室——就在那屏住呼吸的一瞬間，亞特蘭提斯不再只是傳說。",
      ms: 3200,
    },
    { type: "wait", ms: 600 },
  ],
};

export default CUTSCENES;

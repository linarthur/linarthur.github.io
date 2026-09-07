// data/dialogue/mo.js — Dr. Nomusa "Mo" Adeyemi, Partners Path companion.
// Dry, fearless, better than the hero at everything except falling off
// things gracefully (design doc). Three short trees — one per Act 2
// location — plus the introduction. Talking to her is also the "two
// person" puzzle trigger for that room: she does her half, the player
// does theirs, in one dialogue beat rather than a separate mechanic.

export const moDonanaDialogue = {
  id: "mo_donana",
  npcName: "Dr. Nomusa Adeyemi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(She's already knee-deep in reeds, chart case slung over one shoulder.) Took you long enough. I take it Draghi was charming.\n（她已經站在及膝的蘆葦叢裡，肩上背著地圖筒。）你也真夠慢的。我猜德拉吉很有魅力吧。",
      options: [
        { id: "ask_mo", text: "Who exactly are you?\n你到底是誰？", once: true, goto: "mo_info" },
        { id: "ask_help", text: "Any idea how we get across this marsh?\n你知道我們要怎麼穿過這片沼澤嗎？", once: true, goto: "help_info" },
        { id: "ask_plan", text: "Trust me, I have a plan.\n相信我，我有計畫。", once: true, goto: "plan_reaction" },
        {
          id: "go",
          text: "Let's find this conch.\n我們去找那個海螺吧。",
          goto: null,
          setFlag: "mo_helped_donana",
          grit: 20,
          cutscene: "donana_punt",
        },
      ],
    },
    mo_info: {
      npcLine:
        "Nomusa Adeyemi. Cartographer, Cambridge-trained, Lagos-raised, and the only person on this trip who reads a map instead of arguing with it.\n諾姆莎·阿德耶米。製圖師，劍橋受訓，拉哥斯長大，也是這趟旅程裡唯一一個看得懂地圖、而不是跟地圖吵架的人。",
      setFlag: "learned_mo_bio",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    help_info: {
      npcLine:
        "There's a punt tied off past those reeds. You pole — try not to fall in, I'm not diving in after both of us — and I'll read the channel markers. The flamingos won't stand in open water, so wherever they're not standing is exactly where the mud wants to eat the boat.\n蘆葦叢後面繫著一艘平底船。你負責撐篙——盡量別掉下去，我可不會為了我們兩個都跳下水——我來看水道標記。紅鶴不會站在深水裡，所以牠們不站的地方，就正是爛泥想吞掉船的地方。",
      setFlag: "mo_helped_donana",
      grit: 20,
      cutscene: "donana_punt",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    plan_reaction: {
      npcLine:
        "You always have a plan. Statistically, about a third of them survive contact with reality.\n你總是有計畫。統計上來說，大概三分之一在碰到現實後還能倖存。",
      options: [{ id: "back3", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export const moSaharaDialogue = {
  id: "mo_sahara",
  npcName: "Dr. Nomusa Adeyemi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(Squinting at the horizon, one hand shading her eyes.) Concentric rings, dead flat, in the middle of the Sahara. Someone built this on purpose.\n（她瞇眼望著地平線，一手遮著陽光。）撒哈拉正中央，一圈圈同心圓，平坦得不自然。這是有人故意蓋出來的。",
      options: [
        { id: "ask_rings", text: "What do you make of the rings?\n你怎麼看這些環？", once: true, goto: "rings_info" },
        { id: "ask_help", text: "How do we find our way to the centre?\n我們要怎麼找到通往中心的路？", once: true, goto: "help_info" },
        { id: "ask_confidence", text: "Should be simple enough.\n應該很簡單吧。", once: true, goto: "confidence_reaction" },
        {
          id: "go",
          text: "Let's find the fork.\n我們去找那把音叉吧。",
          goto: null,
          setFlag: "mo_helped_sahara",
          grit: 20,
          cutscene: "sahara_rings",
        },
      ],
    },
    rings_info: {
      npcLine:
        "Geologists call it the Richat Structure and argue about whether it's an eroded dome or something stranger. I know which way I'd bet, and it isn't dome.\n地質學家稱它為「理查特結構」，一直在爭論它究竟是被侵蝕的穹頂，還是什麼更奇怪的東西。我知道我會賭哪一邊，反正不是穹頂。",
      setFlag: "learned_richat_lore",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    help_info: {
      npcLine:
        "You drive — try to resist doing donuts around a three-thousand-year-old ring system — and I'll call bearings off the sundial-compass. Shadow angle, not by eye. The rings look identical from ground level, which is either brilliant design or somebody's idea of a joke.\n你開車——盡量忍住別繞著三千年歷史的環狀結構甩尾——我來用日晷羅盤報方位。看影子角度，不是用眼睛猜。這些環從地面看起來一模一樣，這要嘛是精妙的設計，要嘛是誰開的一個大玩笑。",
      setFlag: "mo_helped_sahara",
      grit: 20,
      cutscene: "sahara_rings",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    confidence_reaction: {
      npcLine: "Said every person right before something buried woke up.\n每個人在喚醒地底下的東西之前，都會這麼說。",
      options: [{ id: "back3", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export const moBiminiDialogue = {
  id: "mo_bimini",
  npcName: "Dr. Nomusa Adeyemi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(Already checking a hardhat diving suit for leaks.) Last one, Professor. After this we find out what three notes actually do.\n（她已經在檢查潛水頭盔有沒有漏水。）最後一個了，教授。這之後我們就會知道那三個音到底有什麼用。",
      options: [
        { id: "ask_road", text: "What is the Bimini Road, really?\n「比米尼之路」到底是什麼？", once: true, goto: "road_info" },
        { id: "ask_help", text: "Ready to get me into that suit?\n準備好幫我穿上那套潛水裝了嗎？", once: true, goto: "help_info" },
        { id: "ask_ready", text: "Ready when you are.\n你準備好我就準備好。", once: true, goto: "ready_reaction" },
        {
          id: "go",
          text: "Let's get the bell.\n我們去把鐘拿回來吧。",
          goto: null,
          setFlag: "mo_helped_bimini",
          grit: 20,
          cutscene: "bimini_dive",
        },
      ],
    },
    road_info: {
      npcLine:
        "Officially, beach rock — a natural formation. Unofficially, the blocks are too square for my taste, and I've measured a great many rocks.\n官方說法是海灘岩，天然形成的。非官方說法是，這些石塊方正得太整齊了，不太對勁——我量過的石頭可不少。",
      setFlag: "learned_bimini_lore",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    help_info: {
      npcLine:
        "I'll mind the air pump topside. Three tugs on the line if you need up fast — and Professor, for once in your life, don't make me use it.\n我會在上面顧著空氣幫浦。如果你需要快點上來，就拉繩子三下——教授，這輩子就這麼一次，拜託別逼我真的用上它。",
      setFlag: "mo_helped_bimini",
      grit: 20,
      cutscene: "bimini_dive",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    ready_reaction: {
      npcLine: "You say that like drowning's a scheduling problem.\n你講得好像溺水只是排程上的小問題一樣。",
      options: [{ id: "back3", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export default { moDonanaDialogue, moSaharaDialogue, moBiminiDialogue };

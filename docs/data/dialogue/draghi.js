// data/dialogue/draghi.js — first meeting with the Contessa. Charming,
// funny, completely amoral, never physically threatening — she out-thinks
// and out-buys, per the design doc. Ending this conversation is the
// trigger for the end-of-Act-1 path choice (see engine/main.js).

export const draghiDialogue = {
  id: "draghi_intro",
  npcName: "Contessa Verena Draghi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(She doesn't look up from her drink.) Professor Jones. I was starting to think Barnett College had stopped producing anyone interesting.\n（她眼睛沒離開手裡的酒杯。）瓊斯教授。我還以為巴奈特學院已經不會再培養出有趣的人了呢。",
      setFlag: "met_draghi",
      cutscene: "draghi_reveal",
      mood: "surprised",
      options: [
        { id: "ask_who", text: "Who exactly are you?\n你到底是誰？", once: true, goto: "who_info" },
        {
          id: "ask_want",
          text: "What does the Adriatic Salvage Consortium want with a Roman diving bell?\n亞得里亞海撈財團到底想拿羅馬潛水鐘做什麼？",
          once: true,
          goto: "want_info",
        },
        { id: "warn", text: "Whatever you're planning, stop now.\n不管你在計劃什麼，現在就住手。", once: true, goto: "warn_info" },
        { id: "bye", text: "We'll speak again, I'm sure.\n我們一定還會再見面的。", goto: null },
      ],
    },
    who_info: {
      npcLine:
        "Verena Draghi. I salvage things — mostly cargo, occasionally reputations. I don't dig for treasure, Professor. I buy the coastline before the sea decides to redraw it.\n薇琳娜·德拉吉。我做打撈——大多是貨物，偶爾也打撈名聲。教授，我不挖寶藏，我是在海洋決定重新畫界線之前，先把海岸線買下來。",
      setFlag: "learned_draghi_motive",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    want_info: {
      npcLine:
        "That crate sings a very particular note. I'd like to know which coastlines answer it — and purchase them, quietly, before anyone else understands why the land's gone cheap.\n那個箱子唱著一個非常特別的音。我想知道有哪些海岸線會回應它——然後在別人搞懂那些土地為什麼變便宜之前，悄悄把它們買下來。",
      setFlag: "learned_draghi_plan",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    warn_info: {
      npcLine:
        "(She finally smiles.) Darling, I've been threatened by better-dressed men than you. Do have a drink before you go — you look like you're about to do something energetic.\n（她終於笑了。）親愛的，威脅過我的男人，穿得可比你講究多了。走之前先喝一杯吧——你看起來像是要去做什麼耗體力的事。",
      setFlag: "warned_draghi",
      options: [{ id: "back3", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

// The climax confrontation at the Caldera. Same rule as their first
// meeting: she never physically threatens anyone, and there's no combat
// or fail state here either — the conversation always ends with her
// stepping back, whichever branches the player explores first.
export const draghiCalderaDialogue = {
  id: "draghi_caldera",
  npcName: "Contessa Verena Draghi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(She's already here, alone, looking down into the glow rising off the water.) You made better time than I expected, Professor. So did I.\n（她已經獨自一人站在這裡，望著水面透出的微光。）你來得比我預期的快，教授。我也是。",
      setFlag: "draghi_caldera_met",
      options: [
        { id: "ask_alone", text: "Where's the rest of the Consortium?\n財團其他人呢？", once: true, goto: "alone_info" },
        { id: "ask_stop", text: "You're not stopping me.\n你阻止不了我的。", once: true, goto: "stop_info" },
        { id: "proceed", text: "(Step past her, to the water's edge.)\n（從她身邊走過，走向水邊。）", goto: null },
      ],
    },
    alone_info: {
      npcLine:
        "Waiting on a ship, for a coastline I told them I'd already found. I came ahead to see it myself before I decided whether that was ever going to be true.\n在船上等著，等一塊我告訴他們我已經找到的海岸線。我先過來親眼看看，再決定那句話是不是真的會成真。",
      setFlag: "learned_draghi_hesitation",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    stop_info: {
      npcLine:
        "(A short, real laugh.) I gave up stopping you somewhere around Lisbon. I'd just like to watch. I've bought and sold enough coastlines to know when I'm looking at something that was never for sale.\n（她真心地笑了一聲。）我大概在里斯本那時候就放棄阻止你了。我只是想看看而已。買賣過那麼多海岸線，我很清楚什麼東西是從來就不待售的。",
      setFlag: "draghi_backed_off",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export default draghiDialogue;

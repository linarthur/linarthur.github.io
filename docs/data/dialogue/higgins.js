// data/dialogue/higgins.js
//
// Higgins is the college porter, mopping a losing battle in the flooded
// sub-basement. His conversation demonstrates: a hub node with "keep
// talking" looping, two branches, a one-time option that greys out once
// used, and a cutscene fired the first time a branch is exhausted.

export const higginsDialogue = {
  id: "higgins_intro",
  npcName: "Higgins",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "Mind the water, Professor. Whole basement's gone to the fishes, and somehow I knew you'd be the one wading through it.\n小心水，教授。整個地下室都淹成魚塭了，也不知道為什麼，我就知道會是你來蹚這渾水。",
      options: [
        { id: "ask_crate", text: "What happened to the crate?\n木箱發生了什麼事？", once: true, goto: "crate_info" },
        { id: "ask_water", text: "Where's all this water coming from?\n這些水到底是從哪來的？", once: true, goto: "water_info" },
        { id: "bye", text: "I'll let you get back to it.\n那我不打擾你忙了。", goto: null },
      ],
    },
    crate_info: {
      npcLine:
        "Came in this morning, screaming like a kettle when the delivery man near dropped it. Gone an hour later — whoever took it knew exactly which crate, and exactly when this room would be empty. More planning than the Dean's ever put into a maintenance schedule.\n今天早上送到的時候，送貨員差點沒摔了它，箱子還尖叫得跟水壺一樣。一小時後就不見了——不管是誰拿走的，都很清楚該拿哪個箱子，也很清楚這房間什麼時候會沒人。比院長排維修時間表還用心。",
      setFlag: "learned_crate_theft",
      mood: "surprised",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    water_info: {
      npcLine:
        "Main's been weeping since the spring thaw. Dean won't sign off on a plumber till it's a proper lake he can charge admission to. Between you and me, it's been rising faster since that crate started singing, and I don't much care for coincidences this far underground.\n主水管從開春解凍後就一直在滲水。院長非得等它變成一座能收門票的湖，才肯簽字找水電工來修。跟你說句實話，自從那箱子開始「唱歌」之後，水漲得更快了，我不太喜歡在這麼深的地底下遇到這種巧合。",
      setFlag: "learned_water",
      cutscene: "higgins_hint",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export default higginsDialogue;

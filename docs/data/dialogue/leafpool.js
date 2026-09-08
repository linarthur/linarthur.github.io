// data/dialogue/leafpool.js
//
// Leafpool — yes, THAT Leafpool, ThunderClan's medicine cat from the
// Warriors books — as a deliberate, played-straight-but-silly crossover
// cameo in the flooded Barnett College sub-basement. Nothing else in this
// game is supernatural or acknowledges the Warriors universe; that's the
// joke. Her root line explains, in-fiction, why Indy of all people can
// hear a talking cat, so the gag doesn't need a wink at the player to land.
// Same tree shape the character replaced (Higgins) used: a hub node with
// "keep talking" looping, one-time branches that grey out once used, and
// a cutscene fired the first time the water branch is read.

export const leafpoolDialogue = {
  id: "leafpool_intro",
  npcName: "Leafpool",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(A cat — light brown tabby, white paws, eyes like amber glass — sits primly above the flood line, watching him with far more patience than an animal ought to have.) Mind the water, Professor. And yes, I'm talking. Most of you can't hear us. You're one of the rare ones — reckon that's why you keep finding things that hum.\n（一隻貓——淺棕色虎斑，白色的爪子，琥珀色的眼睛——端坐在淹水線之上，用一種動物不該有的耐性看著他。）小心水，教授。對，我會說話。你們大多數人聽不見我們說話，你算是少數聽得見的人——這大概也是為什麼你老是找到會嗡嗡叫的東西。",
      mood: "surprised",
      options: [
        { id: "ask_crate", text: "What happened to the crate?\n木箱發生了什麼事？", once: true, goto: "crate_info" },
        { id: "ask_water", text: "Where's all this water coming from?\n這些水到底是從哪來的？", once: true, goto: "water_info" },
        { id: "ask_who", text: "Who — or what — are you?\n你到底是誰——還是什麼東西？", once: true, goto: "who_info" },
        { id: "ask_secret", text: "You said you're one to talk about secrets?\n你剛剛的語氣，好像藏著什麼秘密？", once: true, goto: "secret_info" },
        { id: "bye", text: "I'll let you get back to it.\n那我不打擾你忙了。", goto: null },
      ],
    },
    crate_info: {
      npcLine:
        "I was curled up right there when they brought it in — screamed like a kit with its tail trodden on, that crate did. Gone within the hour. Whoever took it knew exactly which one to grab, and exactly when this room would empty out. That's not luck, Professor. That's scouting.\n他們把箱子搬進來的時候，我就窩在那邊——那箱子尖叫得跟被踩到尾巴的小貓一樣。不到一小時就不見了。拿走的人很清楚該拿哪一個，也很清楚這房間什麼時候會空下來。教授，這不是運氣，這是有計劃地探過路。",
      setFlag: "learned_crate_theft",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    water_info: {
      npcLine:
        "The pipes have wept since the thaw — ordinary trouble, until lately. It's been rising faster since that crate started singing, and I've walked enough dreams to know StarClan doesn't send coincidences. Something under this city is calling. The water's just the first thing that heard it.\n開春解凍後，水管就一直在滲水——原本只是普通的麻煩，直到最近才不對勁。自從那箱子開始「唱歌」，水漲得快多了。我走過夠多的夢境，知道星族從不安排巧合。這座城市底下有什麼東西正在呼喚，而水，只是第一個聽見的。",
      setFlag: "learned_water",
      cutscene: "leafpool_hint",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    who_info: {
      npcLine:
        "Leafpool. Medicine cat of ThunderClan, though I don't imagine that means much to you. I found the Moonpool as an apprentice — the water where we speak with StarClan, the cats who came before us — and it gave me my true name. I couldn't tell you why a flooded basement in a place like this feels the same. But it does.\n我叫葉池，雷族的巫醫——雖然這個身份對你來說大概沒什麼意義。我還是見習生的時候找到了月池——那是我們與星族（先祖的靈魂）對話的地方——它賜予了我真正的名字。我說不上來為什麼這種地方的地下室淹水，感覺起來會一樣。但它就是一樣。",
      options: [{ id: "back3", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    secret_info: {
      npcLine:
        "(She's quiet a moment before answering.) I broke my Clan's oldest law once, for love, and paid for it in ways I still don't talk about. Three kits who call another cat mother, and never knew mine was the milk they grew up on. StarClan forgave me, eventually. I'm still working on forgiving myself. ...Ask me something easier, Professor.\n（她沉默了一會兒才回答。）我曾經為了愛，違反了族裡最古老的規矩，也用一種我至今仍不願多談的方式付出了代價。三隻小貓喊著另一隻貓「媽媽」，卻不知道餵養牠們長大的奶水是我的。星族最終原諒了我。我還在努力原諒自己……問點簡單一點的問題吧，教授。",
      options: [{ id: "back4", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export default leafpoolDialogue;

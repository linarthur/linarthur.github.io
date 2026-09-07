// data/dialogue/fado.js — the fado singer outside the tile workshop.
// Flavour and one soft nudge toward the azulejo puzzle; nothing mandatory.

export const fadoDialogue = {
  id: "fado_intro",
  npcName: "The Fado Singer",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(She finishes a verse, and only then looks up.) You're the American who's been asking after old maps.\n（她唱完一段才抬起頭。）你就是那個到處打聽古地圖的美國人吧。",
      options: [
        { id: "ask_song", text: "What's the song about?\n這首歌在唱什麼？", once: true, goto: "song_info" },
        { id: "ask_chart", text: "Any idea what the chart in that window is?\n你知道那扇窗子裡的圖是什麼嗎？", once: true, goto: "chart_info" },
        { id: "bye", text: "Sorry to interrupt.\n抱歉打擾了。", goto: null },
      ],
    },
    song_info: {
      npcLine:
        "Saudade — a longing for something that hasn't left yet, but will. My grandmother sang it about the sea. Lately I think the sea's been singing it back.\n「Saudade」——是一種對還沒離開、但終將離開的事物的思念。我祖母以前唱這首歌來詠嘆大海。最近我覺得，大海也在把這首歌唱回來給我們聽。",
      setFlag: "heard_fado_song",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    chart_info: {
      npcLine:
        "The tile-man's been fighting with that panel for a week. Says it won't sit right until every piece is home. Maybe you'd have better luck — you look like a man who likes puzzles.\n做磁磚的師傅跟那塊拼版奮戰一個禮拜了。他說每一片都要歸位才會對。也許你運氣會比較好——你看起來就像喜歡解謎的人。",
      setFlag: "fado_chart_hint",
      options: [{ id: "back2", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
  },
};

export default fadoDialogue;

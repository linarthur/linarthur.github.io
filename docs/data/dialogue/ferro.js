// data/dialogue/ferro.js — Nerve Path only. Ferro, Draghi's salvage master
// (glimpsed at a distance in the Cunning Path's dockyard), blocks the dive
// ladder here in person. No forgery, no companion — just a wager. Losing
// the arm-wrestle stunt just means asking again; Ferro's proud enough to
// always give a rematch.

export const ferroBiminiDialogue = {
  id: "ferro_bimini",
  npcName: "Ferro",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(He doesn't move from in front of the ladder. Doesn't need to.) \"Consortium water. Consortium ladder. You want down it, you go through me first.\"\n（他站在梯子前動也不動，也用不著動。）「財團的水域，財團的梯子。想下去，先過我這關。」",
      options: [
        { id: "ask_who", text: "Who exactly are you?\n你到底是誰？", once: true, goto: "who_info" },
        { id: "wager", text: "Name your terms.\n說說你的條件。", once: true, goto: "terms" },
        { id: "bye", text: "I'll find another way down.\n我會找別的路下去。", goto: null },
      ],
    },
    who_info: {
      npcLine:
        "\"Ferro. I keep Draghi's salvage sites tidy.\" (A pause, and something almost like respect.) \"You're the one who's been making a mess of them.\"\n「費羅。我負責把德拉吉的打撈場整理乾淨。」（他頓了一下，語氣裡帶著幾分近似敬意的東西。）「你就是那個一直把它們搞得亂七八糟的人吧。」",
      setFlag: "learned_ferro_bio",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    terms: {
      npcLine:
        "(He plants an elbow on a crate lid and grins.) \"Simple terms. Beat me across this crate, I forget I saw you. Lose, and you're welcome to keep asking — I've got all day.\"\n（他把手肘架在木箱蓋上，咧嘴一笑。）「條件很簡單。在這箱子上贏過我，我就當沒看過你。輸了的話，你儘管繼續問——反正我有的是時間。」",
      setFlag: "talked_to_ferro",
      options: [{ id: "go", text: "(Take the wager.)\n（接受賭局。）", goto: null }],
    },
  },
};

export default ferroBiminiDialogue;

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
        "(He doesn't move from in front of the ladder. Doesn't need to.) \"Consortium water. Consortium ladder. You want down it, you go through me first.\"",
      options: [
        { id: "ask_who", text: "Who exactly are you?", once: true, goto: "who_info" },
        { id: "wager", text: "Name your terms.", once: true, goto: "terms" },
        { id: "bye", text: "I'll find another way down.", goto: null },
      ],
    },
    who_info: {
      npcLine:
        "\"Ferro. I keep Draghi's salvage sites tidy.\" (A pause, and something almost like respect.) \"You're the one who's been making a mess of them.\"",
      setFlag: "learned_ferro_bio",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    terms: {
      npcLine:
        "(He plants an elbow on a crate lid and grins.) \"Simple terms. Beat me across this crate, I forget I saw you. Lose, and you're welcome to keep asking — I've got all day.\"",
      setFlag: "talked_to_ferro",
      options: [{ id: "go", text: "(Take the wager.)", goto: null }],
    },
  },
};

export default ferroBiminiDialogue;

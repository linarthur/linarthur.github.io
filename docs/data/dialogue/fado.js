// data/dialogue/fado.js — the fado singer outside the tile workshop.
// Flavour and one soft nudge toward the azulejo puzzle; nothing mandatory.

export const fadoDialogue = {
  id: "fado_intro",
  npcName: "The Fado Singer",
  start: "root",
  nodes: {
    root: {
      npcLine: "(She finishes a verse, and only then looks up.) You're the American who's been asking after old maps.",
      options: [
        { id: "ask_song", text: "What's the song about?", once: true, goto: "song_info" },
        { id: "ask_chart", text: "Any idea what the chart in that window is?", once: true, goto: "chart_info" },
        { id: "bye", text: "Sorry to interrupt.", goto: null },
      ],
    },
    song_info: {
      npcLine:
        "Saudade — a longing for something that hasn't left yet, but will. My grandmother sang it about the sea. Lately I think the sea's been singing it back.",
      setFlag: "heard_fado_song",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    chart_info: {
      npcLine:
        "The tile-man's been fighting with that panel for a week. Says it won't sit right until every piece is home. Maybe you'd have better luck — you look like a man who likes puzzles.",
      setFlag: "fado_chart_hint",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
  },
};

export default fadoDialogue;

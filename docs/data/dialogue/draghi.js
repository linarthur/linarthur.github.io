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
        "(She doesn't look up from her drink.) Professor Jones. I was starting to think Barnett College had stopped producing anyone interesting.",
      setFlag: "met_draghi",
      options: [
        { id: "ask_who", text: "Who exactly are you?", once: true, goto: "who_info" },
        { id: "ask_want", text: "What does the Adriatic Salvage Consortium want with a Roman diving bell?", once: true, goto: "want_info" },
        { id: "warn", text: "Whatever you're planning, stop now.", once: true, goto: "warn_info" },
        { id: "bye", text: "We'll speak again, I'm sure.", goto: null },
      ],
    },
    who_info: {
      npcLine:
        "Verena Draghi. I salvage things — mostly cargo, occasionally reputations. I don't dig for treasure, Professor. I buy the coastline before the sea decides to redraw it.",
      setFlag: "learned_draghi_motive",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    want_info: {
      npcLine:
        "That crate sings a very particular note. I'd like to know which coastlines answer it — and purchase them, quietly, before anyone else understands why the land's gone cheap.",
      setFlag: "learned_draghi_plan",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
    warn_info: {
      npcLine:
        "(She finally smiles.) Darling, I've been threatened by better-dressed men than you. Do have a drink before you go — you look like you're about to do something energetic.",
      setFlag: "warned_draghi",
      options: [{ id: "back3", text: "(Ask something else.)", goto: "root" }],
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
        "(She's already here, alone, looking down into the glow rising off the water.) You made better time than I expected, Professor. So did I.",
      setFlag: "draghi_caldera_met",
      options: [
        { id: "ask_alone", text: "Where's the rest of the Consortium?", once: true, goto: "alone_info" },
        { id: "ask_stop", text: "You're not stopping me.", once: true, goto: "stop_info" },
        { id: "proceed", text: "(Step past her, to the water's edge.)", goto: null },
      ],
    },
    alone_info: {
      npcLine:
        "Waiting on a ship, for a coastline I told them I'd already found. I came ahead to see it myself before I decided whether that was ever going to be true.",
      setFlag: "learned_draghi_hesitation",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    stop_info: {
      npcLine:
        "(A short, real laugh.) I gave up stopping you somewhere around Lisbon. I'd just like to watch. I've bought and sold enough coastlines to know when I'm looking at something that was never for sale.",
      setFlag: "draghi_backed_off",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
  },
};

export default draghiDialogue;

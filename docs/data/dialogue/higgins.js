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
      npcLine: "Mind the water, Professor. Whole basement's gone to the fishes.",
      options: [
        { id: "ask_crate", text: "What happened to the crate?", once: true, goto: "crate_info" },
        { id: "ask_water", text: "Where's all this water coming from?", once: true, goto: "water_info" },
        { id: "bye", text: "I'll let you get back to it.", goto: null },
      ],
    },
    crate_info: {
      npcLine:
        "Came in this morning, screaming like a kettle when the delivery man dropped it. Gone an hour later — whoever took it knew exactly which crate to lift, and exactly when the room would be empty.",
      setFlag: "learned_crate_theft",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    water_info: {
      npcLine:
        "Main's been weeping since the spring thaw. Dean won't pay for a plumber till it's a proper lake. Between you and me, it's been rising faster since that crate started singing.",
      setFlag: "learned_water",
      cutscene: "higgins_hint",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
  },
};

export default higginsDialogue;

// data/dialogue/foreman.js — the Cunning Path's dialogue-only puzzle
// (design doc: "talk [someone] out of / past something without ever
// touching it"). The "Show him the paperwork" option only appears once
// the forged requisition is in hand — no separate action needed once it
// does; talking IS the puzzle.

export const foremanBiminiDialogue = {
  id: "foreman_bimini",
  npcName: "Dockyard Foreman",
  start: "root",
  nodes: {
    root: {
      npcLine: "\"Help you?\" (He doesn't look up from his clipboard.) \"Divers only past this point. Authorised divers.\"",
      options: [
        { id: "ask_authorised", text: "What would it take to get authorised?", once: true, goto: "authorised_info" },
        {
          id: "show_paper",
          text: "Show him the requisition.",
          goto: "convinced",
          requiresItem: "forged_requisition",
        },
        { id: "bye", text: "I'll come back later.", goto: null },
      ],
    },
    authorised_info: {
      npcLine: "\"Paperwork. Signed, sealed, dated. I don't ask questions past that — I've learned not to.\"",
      setFlag: "learned_foreman_needs_paper",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    convinced: {
      npcLine:
        "(He glances at the form for exactly as long as it takes to see a seal, not a signature, and waves a hand toward the ladder.) \"Should've said. Down you go.\"",
      setFlag: "foreman_convinced",
      options: [{ id: "go", text: "(Head for the ladder.)", goto: null }],
    },
  },
};

export default foremanBiminiDialogue;

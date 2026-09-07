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
      npcLine:
        "\"Help you?\" (He doesn't look up from his clipboard.) \"Divers only past this point. Authorised divers.\"\n「有什麼事？」（他頭也不抬，眼睛盯著寫字板。）「這裡開始只准潛水員通行。而且是有授權的潛水員。」",
      options: [
        { id: "ask_authorised", text: "What would it take to get authorised?\n要怎樣才能拿到授權？", once: true, goto: "authorised_info" },
        {
          id: "show_paper",
          text: "Show him the requisition.\n把申請單拿給他看。",
          goto: "convinced",
          requiresItem: "forged_requisition",
        },
        { id: "bye", text: "I'll come back later.\n我晚點再回來。", goto: null },
      ],
    },
    authorised_info: {
      npcLine:
        "\"Paperwork. Signed, sealed, dated. I don't ask questions past that — I've learned not to.\"\n「文件。簽名、蓋章、註明日期。有了這些我就不會再多問——我學乖了。」",
      setFlag: "learned_foreman_needs_paper",
      options: [{ id: "back1", text: "(Ask something else.)\n（問點別的。）", goto: "root" }],
    },
    convinced: {
      npcLine:
        "(He glances at the form for exactly as long as it takes to see a seal, not a signature, and waves a hand toward the ladder.) \"Should've said. Down you go.\"\n（他瞄了申請單一眼，時間剛好夠看到一個印章，而不是簽名，接著朝梯子揮了揮手。）「早說嘛。下去吧。」",
      setFlag: "foreman_convinced",
      options: [{ id: "go", text: "(Head for the ladder.)\n（走向梯子。）", goto: null }],
    },
  },
};

export default foremanBiminiDialogue;

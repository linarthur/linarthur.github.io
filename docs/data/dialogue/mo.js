// data/dialogue/mo.js — Dr. Nomusa "Mo" Adeyemi, Partners Path companion.
// Dry, fearless, better than the hero at everything except falling off
// things gracefully (design doc). Three short trees — one per Act 2
// location — plus the introduction. Talking to her is also the "two
// person" puzzle trigger for that room: she does her half, the player
// does theirs, in one dialogue beat rather than a separate mechanic.

export const moDonanaDialogue = {
  id: "mo_donana",
  npcName: "Dr. Nomusa Adeyemi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(She's already knee-deep in reeds, chart case slung over one shoulder.) Took you long enough. I take it Draghi was charming.",
      options: [
        { id: "ask_mo", text: "Who exactly are you?", once: true, goto: "mo_info" },
        { id: "ask_help", text: "Any idea how we get across this marsh?", once: true, goto: "help_info" },
        { id: "ask_plan", text: "Trust me, I have a plan.", once: true, goto: "plan_reaction" },
        {
          id: "go",
          text: "Let's find this conch.",
          goto: null,
          setFlag: "mo_helped_donana",
          grit: 20,
          cutscene: "donana_punt",
        },
      ],
    },
    mo_info: {
      npcLine:
        "Nomusa Adeyemi. Cartographer, Cambridge-trained, Lagos-raised, and the only person on this trip who reads a map instead of arguing with it.",
      setFlag: "learned_mo_bio",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    help_info: {
      npcLine:
        "There's a punt tied off past those reeds. You pole — try not to fall in, I'm not diving in after both of us — and I'll read the channel markers. The flamingos won't stand in open water, so wherever they're not standing is exactly where the mud wants to eat the boat.",
      setFlag: "mo_helped_donana",
      grit: 20,
      cutscene: "donana_punt",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
    plan_reaction: {
      npcLine: "You always have a plan. Statistically, about a third of them survive contact with reality.",
      options: [{ id: "back3", text: "(Ask something else.)", goto: "root" }],
    },
  },
};

export const moSaharaDialogue = {
  id: "mo_sahara",
  npcName: "Dr. Nomusa Adeyemi",
  start: "root",
  nodes: {
    root: {
      npcLine: "(Squinting at the horizon, one hand shading her eyes.) Concentric rings, dead flat, in the middle of the Sahara. Someone built this on purpose.",
      options: [
        { id: "ask_rings", text: "What do you make of the rings?", once: true, goto: "rings_info" },
        { id: "ask_help", text: "How do we find our way to the centre?", once: true, goto: "help_info" },
        { id: "ask_confidence", text: "Should be simple enough.", once: true, goto: "confidence_reaction" },
        {
          id: "go",
          text: "Let's find the fork.",
          goto: null,
          setFlag: "mo_helped_sahara",
          grit: 20,
          cutscene: "sahara_rings",
        },
      ],
    },
    rings_info: {
      npcLine:
        "Geologists call it the Richat Structure and argue about whether it's an eroded dome or something stranger. I know which way I'd bet, and it isn't dome.",
      setFlag: "learned_richat_lore",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    help_info: {
      npcLine:
        "You drive — try to resist doing donuts around a three-thousand-year-old ring system — and I'll call bearings off the sundial-compass. Shadow angle, not by eye. The rings look identical from ground level, which is either brilliant design or somebody's idea of a joke.",
      setFlag: "mo_helped_sahara",
      grit: 20,
      cutscene: "sahara_rings",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
    confidence_reaction: {
      npcLine: "Said every person right before something buried woke up.",
      options: [{ id: "back3", text: "(Ask something else.)", goto: "root" }],
    },
  },
};

export const moBiminiDialogue = {
  id: "mo_bimini",
  npcName: "Dr. Nomusa Adeyemi",
  start: "root",
  nodes: {
    root: {
      npcLine:
        "(Already checking a hardhat diving suit for leaks.) Last one, Professor. After this we find out what three notes actually do.",
      options: [
        { id: "ask_road", text: "What is the Bimini Road, really?", once: true, goto: "road_info" },
        { id: "ask_help", text: "Ready to get me into that suit?", once: true, goto: "help_info" },
        { id: "ask_ready", text: "Ready when you are.", once: true, goto: "ready_reaction" },
        {
          id: "go",
          text: "Let's get the bell.",
          goto: null,
          setFlag: "mo_helped_bimini",
          grit: 20,
          cutscene: "bimini_dive",
        },
      ],
    },
    road_info: {
      npcLine:
        "Officially, beach rock — a natural formation. Unofficially, the blocks are too square for my taste, and I've measured a great many rocks.",
      setFlag: "learned_bimini_lore",
      options: [{ id: "back1", text: "(Ask something else.)", goto: "root" }],
    },
    help_info: {
      npcLine:
        "I'll mind the air pump topside. Three tugs on the line if you need up fast — and Professor, for once in your life, don't make me use it.",
      setFlag: "mo_helped_bimini",
      grit: 20,
      cutscene: "bimini_dive",
      options: [{ id: "back2", text: "(Ask something else.)", goto: "root" }],
    },
    ready_reaction: {
      npcLine: "You say that like drowning's a scheduling problem.",
      options: [{ id: "back3", text: "(Ask something else.)", goto: "root" }],
    },
  },
};

export default { moDonanaDialogue, moSaharaDialogue, moBiminiDialogue };

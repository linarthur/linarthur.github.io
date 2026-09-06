// data/cutscenes.js — keyed step arrays for engine/cutscene.js.
// Each key is referenced by id from dialogue nodes or room/puzzle logic.

export const CUTSCENES = {
  higgins_hint: [
    { type: "camera", ms: 260 },
    { type: "say", speaker: "Higgins", text: "Reckon it's coming from under the tablet, if you want my two pence.", ms: 2200 },
    { type: "walkTo", x: 950, y: 620 },
    { type: "wait", ms: 300 },
    { type: "setFlag", key: "higgins_pointed_at_tablet", value: true },
  ],

  prologue_end: [
    { type: "wait", ms: 300 },
    { type: "say", speaker: "Indy", text: "A chart. Someone wanted this crate quiet — and this map quieter still.", ms: 2400 },
    { type: "camera", ms: 200 },
    { type: "say", speaker: "Higgins", text: "Three anchorages, Professor. Reckon you've got some travelling ahead of you.", ms: 2400 },
    { type: "setFlag", key: "prologue_complete", value: true },
  ],

  // Act 1, the harbour bar — the first sight of Draghi, before she's said
  // a word. Fires once, from the `draghi_intro` tree's root node, the same
  // way `higgins_hint` fires from a mid-conversation node below.
  draghi_reveal: [
    { type: "camera", ms: 250 },
    { type: "say", speaker: "Indy", text: "Well. Someone dressed for a funeral, and came to the wrong bar.", ms: 2200 },
  ],

  // Act 2, Partners Path — the "two person" puzzles resolve as one dialogue
  // + cutscene beat apiece: Mo does her half, the player does theirs.
  donana_punt: [
    { type: "say", speaker: "Mo", text: "Follow the dry channels — watch where the flamingos won't walk.", ms: 2000 },
    { type: "walkTo", x: 1400, y: 900 },
    { type: "say", speaker: "Indy", text: "Easy for you to say — you're not the one poling.", ms: 1800 },
  ],
  sahara_rings: [
    { type: "say", speaker: "Mo", text: "Bearing's good — hold that line and we'll thread every ring dead centre.", ms: 2200 },
    { type: "walkTo", x: 1400, y: 900 },
    { type: "camera", ms: 200 },
  ],
  bimini_dive: [
    { type: "say", speaker: "Mo", text: "Suit's sealed. Down the ladder, and mind the current past the third rib of the wreck.", ms: 2400 },
    { type: "walkTo", x: 1400, y: 900 },
    { type: "camera", ms: 200 },
  ],

  // Act 3 — The Caldera. One shared convergence scene regardless of which
  // Act 2 path was taken (design doc: "no dead ends," and the path-choice
  // screen's own promise that all three roads cross again before this is
  // over) — the personalization lives in the credits screen's closing
  // lines instead of three separate cutscenes here.
  caldera_arrival: [
    { type: "say", speaker: "Indy", text: "Three voices, three continents, and it all comes down to a hole in the ground that used to be a volcano.", ms: 2600 },
    { type: "walkTo", x: 900, y: 900 },
    { type: "camera", ms: 250 },
    { type: "setFlag", key: "caldera_arrival_seen", value: true },
  ],

  bell_awakens: [
    { type: "camera", ms: 400 },
    { type: "say", speaker: "Indy", text: "Three voices wake the ninth wave. Not a warning. Instructions.", ms: 2600 },
    { type: "wait", ms: 400 },
    { type: "say", speaker: null, text: "Light floods a chamber that has no business being underwater — and for one held breath, Atlantis stops being a legend.", ms: 3200 },
    { type: "wait", ms: 600 },
  ],
};

export default CUTSCENES;

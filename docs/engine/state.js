// engine/state.js
//
// One JSON-serialisable GameState object. Save = JSON.stringify(state).
// Nothing engine-side should hold gameplay data outside this object.

export function createGameState() {
  return {
    version: 1,
    path: null, // "partners" | "cunning" | "nerve" | null (not chosen yet)
    act: "prologue",
    roomId: "gallery",
    flags: {},
    inventory: [], // array of item ids
    grit: 0,
    playtimeMs: 0,
    actor: { x: 960, y: 760, facing: "down" },
    updatedAt: Date.now(),
  };
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function deserialize(json) {
  const state = JSON.parse(json);
  // Defensive defaults so older saves never crash a newer engine build.
  const fresh = createGameState();
  return { ...fresh, ...state, actor: { ...fresh.actor, ...(state.actor || {}) } };
}

export function hasItem(state, itemId) {
  return state.inventory.includes(itemId);
}

export function addItem(state, itemId) {
  if (!state.inventory.includes(itemId)) state.inventory.push(itemId);
}

export function removeItem(state, itemId) {
  state.inventory = state.inventory.filter((id) => id !== itemId);
}

export function setFlag(state, key, value = true) {
  state.flags[key] = value;
}

export function getFlag(state, key) {
  return state.flags[key];
}

// The three alternate story paths, chosen at the end of Act 1. Mirrored
// into a flag too (`path_<name>`) so path-gated journal/hint content can
// use the same flags-only `show`/`done` functions as everything else.
export function setPath(state, path) {
  state.path = path;
  state.flags[`path_${path}`] = true;
}

// Grit Rating — see design section on scoring. Awarded per puzzle, additive,
// never deducted (kids replay for a better total, not to avoid a penalty).
export function addGrit(state, amount) {
  state.grit += amount;
}

// The full economy is balanced so every path (Partners/Cunning/Nerve) earns
// the same maximum total — 595, at last count: Prologue's three puzzles
// (105) + three Act 2 "obstacle" beats worth 20 each, one per location,
// whichever form that takes for the chosen path — a Mo dialogue+cutscene,
// a forgery combine, or a stunt (60) + the three Voices (180) + the Act 3
// finale puzzle plus completion bonus (250). Titles are just a kid-facing
// label for "how are we doing," not a separate scoring track — no title
// is ever a prerequisite for anything.
const GRIT_TITLES = [
  { min: 0, title: "Rookie Archaeologist" },
  { min: 100, title: "Field Researcher" },
  { min: 250, title: "Seasoned Explorer" },
  { min: 400, title: "Master of the Drowned Bell" },
  { min: 550, title: "Legend of Atlantis" },
];

export function gritTitle(amount) {
  let title = GRIT_TITLES[0].title;
  for (const tier of GRIT_TITLES) {
    if (amount >= tier.min) title = tier.title;
  }
  return title;
}

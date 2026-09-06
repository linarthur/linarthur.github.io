// data/journal.js — auto-updating goals list + the re-readable Codex.
// Both are pure reads of the flag store (see engine/journal.js).
// Goals are gated with `show` so later rooms don't spoil themselves before
// the player has reached them.

export const GOALS = [
  {
    id: "escape_gallery",
    text: "Find a way down through the hole in the gallery floor.",
    show: () => true,
    done: (flags) => !!flags.rope_taken,
  },
  {
    id: "escape_stacks",
    text: "Clear a path through the toppled stacks.",
    show: (flags) => !!flags.rope_taken,
    done: (flags) => !!flags.shelf_moved,
  },
  {
    id: "escape_boiler",
    text: "Shut off the steam blocking the way down.",
    show: (flags) => !!flags.shelf_moved,
    done: (flags) => !!flags.valve_shut,
  },
  {
    id: "escape_cellar",
    text: "Clear the cellar doorway.",
    show: (flags) => !!flags.valve_shut,
    done: (flags) => !!flags.barrels_moved,
  },
  {
    id: "figure_out_basement",
    text: "Figure out what happened down here.",
    show: (flags) => !!flags.barrels_moved,
    done: (flags) => !!flags.learned_crate_theft,
  },
  {
    id: "talk_to_higgins",
    text: "Talk to Higgins — he was here when it happened.",
    show: (flags) => !!flags.barrels_moved,
    done: (flags) => !!flags.learned_crate_theft && !!flags.learned_water,
  },
  {
    id: "examine_tablet",
    text: "Take a closer look at the etched tablet.",
    show: (flags) => !!flags.learned_water,
    done: (flags) => !!flags.saw_tablet,
  },
  {
    id: "find_the_chart",
    text: "Search the flooded sub-basement for more clues.",
    show: (flags) => !!flags.barrels_moved,
    done: (flags) => !!flags.found_chart,
  },
  {
    id: "solve_azulejo",
    text: "Piece together the azulejo chart in the tile workshop window.",
    show: (flags) => !!flags.prologue_complete,
    done: (flags) => !!flags.lisbon_azulejo_solved,
  },
  {
    id: "reach_malta",
    text: "Catch the funicular once the chart's assembled.",
    show: (flags) => !!flags.lisbon_azulejo_solved,
    done: (flags) => !!flags.hypogeum_echo_solved || !!flags.met_draghi,
  },
  {
    id: "solve_hypogeum",
    text: "Work out which chamber in the Hypogeum is listening.",
    show: (flags) => !!flags.lisbon_azulejo_solved,
    done: (flags) => !!flags.hypogeum_echo_solved,
  },
  {
    id: "meet_draghi",
    text: "See who's waiting at the harbour bar.",
    show: (flags) => !!flags.hypogeum_echo_solved,
    done: (flags) => !!flags.met_draghi,
  },
  {
    id: "choose_a_path",
    text: "Decide how to proceed, once he's heard her out.",
    show: (flags) => !!flags.met_draghi,
    done: (flags) => !!flags.act1_complete,
  },
  {
    id: "find_salt_conch",
    text: "Ask Mo for a way across the Doñana marshes, then find the Salt Conch.",
    show: (flags) => !!flags.path_partners && !!flags.act1_complete,
    done: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "find_storm_fork",
    text: "Get a bearing from Mo, then find the Storm Fork at the centre of the rings.",
    show: (flags) => !!flags.path_partners && !!flags.salt_conch_found,
    done: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "find_star_bell",
    text: "Have Mo mind the air line, then find the Star Bell in the wreck.",
    show: (flags) => !!flags.path_partners && !!flags.storm_fork_found,
    done: (flags) => !!flags.star_bell_found,
  },

  // Cunning Path — same three Voices, no Mo: forge the way past each
  // checkpoint instead.
  {
    id: "forge_permit",
    text: "Find a blank permit and the Consortium's stamp, then find the Salt Conch.",
    show: (flags) => !!flags.path_cunning && !!flags.act1_complete,
    done: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "forge_disguise",
    text: "Put together a disguise the camel broker won't look twice at, then find the Storm Fork.",
    show: (flags) => !!flags.path_cunning && !!flags.salt_conch_found,
    done: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "forge_requisition",
    text: "Forge a Consortium requisition, talk your way past the foreman, then find the Star Bell.",
    show: (flags) => !!flags.path_cunning && !!flags.storm_fork_found,
    done: (flags) => !!flags.star_bell_found,
  },

  // Nerve Path — same three Voices, no partner and no forgery: outrun,
  // outlast, or out-wrestle each obstacle instead.
  {
    id: "cross_boardwalk",
    text: "Outrun the Consortium skiff across the rotten boardwalk, then find the Salt Conch.",
    show: (flags) => !!flags.path_nerve && !!flags.act1_complete,
    done: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "brake_tram",
    text: "Bring the runaway survey tram to a stop at the centre of the rings, then find the Storm Fork.",
    show: (flags) => !!flags.path_nerve && !!flags.salt_conch_found,
    done: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "beat_ferro",
    text: "Win the wager against Ferro at the dockyard, then find the Star Bell.",
    show: (flags) => !!flags.path_nerve && !!flags.storm_fork_found,
    done: (flags) => !!flags.star_bell_found,
  },

  // Act 3 — The Caldera. Shared across all three paths once the Voices
  // are found — see the "act2_complete" flag set by all three
  // checkAct2*Complete functions in engine/main.js.
  {
    id: "reach_caldera",
    text: "With all three Voices in hand, head for the surface — and the Caldera.",
    show: (flags) => !!flags.act2_complete,
    done: (flags) => !!flags.caldera_arrival_seen,
  },
  {
    id: "confront_draghi",
    text: "Hear out the Contessa, one last time.",
    show: (flags) => !!flags.caldera_arrival_seen,
    done: (flags) => !!flags.draghi_caldera_met,
  },
  {
    id: "wake_the_bell",
    text: "Use the Salt Conch, the Storm Fork, and the Star Bell together on the Drowned Bell of Atlantis.",
    show: (flags) => !!flags.draghi_caldera_met,
    done: (flags) => !!flags.drowned_bell_awakened,
  },
];

// The Bellwright Codex — the Lost-Dialogue equivalent. Holds the clue text
// the player will need again during the Act 3 resonance finale, so it must
// stay re-readable for the whole game, not just on first discovery.
export const CODEX = [
  {
    id: "crate_etching",
    title: "The Diving-Bell Crate, Barnett Hall Gallery",
    text: '"Three voices wake the ninth wave." — scratched into the lip in a hurry, by someone who wanted it read.',
    show: (flags) => !!flags.read_crate_etching,
  },
  {
    id: "three_voices",
    title: "Etched Tablet, Barnett College Sub-Basement",
    text: '"Three voices wake the ninth wave." — the same phrase, cut into basalt older than Linear A. This wasn\'t written once.',
    show: (flags) => !!flags.saw_tablet,
  },
  {
    id: "portuguese_chart",
    title: "The Portuguese Chart",
    text: "A 16th-century chart of the Iberian coast, three anchorages ringed in a hand nobody alive could have written.",
    show: (flags) => !!flags.found_chart,
  },
  {
    id: "draghi_motive",
    title: "Contessa Verena Draghi, Adriatic Salvage Consortium",
    text: "Wants to know which coastlines the bell answers — and to buy them, quietly, before anyone else understands why the land's gone cheap.",
    show: (flags) => !!flags.learned_draghi_motive || !!flags.learned_draghi_plan,
  },
  {
    id: "codex_salt_conch",
    title: "The Salt Conch — Doñana, Spain",
    text: "The low voice. A fossilised shell horn, pulled from the marsh mud with Mo's help.",
    show: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "codex_storm_fork",
    title: "The Storm Fork — The Richat Structure, Mauritania",
    text: "The middle voice. A two-metre bronze tuning fork, once a lighthouse fog-warner, dug from the centre of the rings.",
    show: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "codex_star_bell",
    title: "The Star Bell — Bimini, Bahamas",
    text: "The high voice. A crystal handbell that only rings underwater, freed from the wreck on the Bimini Road.",
    show: (flags) => !!flags.star_bell_found,
  },
  {
    id: "codex_drowned_bell",
    title: "The Drowned Bell of Atlantis — The Caldera",
    text: "The fourth voice, and the reason for the other three. Bronze gone the colour of the sea, silent for three thousand years until the chord found it.",
    show: (flags) => !!flags.drowned_bell_awakened,
  },
];

// data/puzzles.js — puzzle instances, keyed by id and referenced from room
// hotspots via `puzzleOnVerb`. `type` selects which puzzle engine handles
// it (see engine/main.js's puzzle-open dispatch): resonance, tileSlide, or
// echo. Each is otherwise just data — adding a puzzle never touches the
// engine.

export const PUZZLES = {
  pipe_resonance: {
    type: "resonance",
    title: "The Overhead Pipe",
    flavor: "Something in the pipework is humming a single, stubborn note. Match it.",
    targets: [220],
    flagOnSolve: "pipe_resonance_solved",
    grit: 25,
    solvedLine:
      "The pipe rings clean and true, once, like a struck bell — and falls silent, its work apparently done.",
  },

  lisbon_azulejo: {
    type: "tileSlide",
    title: "The Azulejo Chart",
    flavor: "Nine tiles, one chart. Slide them home.",
    size: 3,
    flagOnSolve: "lisbon_azulejo_solved",
    grit: 40,
    solvedLine:
      "The tiles click into place and the glaze catches the lamplight — a compass rose, and beneath it, a coastline that isn't Portugal at all.",
    // Allowed to skip — a kid who can't get the tiles to line up shouldn't
    // be stuck in Lisbon forever. Skipping still unlocks the funicular,
    // just for a fraction of the Grit and none of the satisfaction.
    skipGrit: 10,
    skippedLine:
      "He leaves the tiles half-sorted and just guesses at the route from what's already assembled — not exactly confidence-inspiring, but it'll do.",
  },

  hypogeum_echo: {
    type: "echo",
    title: "The Hypogeum",
    flavor: "Clap once. The chamber that answers first is the one that's listening.",
    chambers: [
      { id: "near", label: "Near Chamber", distance: 60 },
      { id: "mid", label: "Middle Chamber", distance: 110 },
      { id: "far", label: "Far Chamber", distance: 160 },
    ],
    correctId: "mid",
    delayMs: 900,
    flagOnSolve: "hypogeum_echo_solved",
    grit: 40,
    solvedLine:
      "The middle chamber answers a half-beat before the others — a resonance chamber, cut on purpose, three thousand years before anyone had a word for acoustics.",
  },

  // The Three Voices — stage 1 resonance puzzles (single pitch), escalating
  // to the stage-4 finale (three at once) in Act 3. Solving one adds the
  // resonator straight to inventory — these aren't flavour, they're the
  // MacGuffins the whole plot is chasing.
  salt_conch_resonance: {
    type: "resonance",
    title: "The Salt Conch",
    flavor: "Half-buried in the marsh mud, humming a note low enough to feel more than hear. Match it.",
    targets: [130.81], // C3 — the low voice
    flagOnSolve: "salt_conch_found",
    itemReward: "salt_conch",
    grit: 60,
    solvedLine: "The shell answers, one long low note, and the mud around it settles like it's exhaling.",
  },

  storm_fork_resonance: {
    type: "resonance",
    title: "The Storm Fork",
    flavor: "A bronze tuning fork, buried to its tines in sand at the centre of the rings. Match its note.",
    targets: [261.63], // C4 — the middle voice
    flagOnSolve: "storm_fork_found",
    itemReward: "storm_fork",
    grit: 60,
    solvedLine: "The fork rings out across the rings themselves — for a moment, the whole Richat Structure seems to hum back.",
  },

  star_bell_resonance: {
    type: "resonance",
    title: "The Star Bell",
    flavor: "A crystal bell, wedged in the wreck's ribs, silent in the air but restless underwater. Match its note.",
    targets: [523.25], // C5 — the high voice
    flagOnSolve: "star_bell_found",
    itemReward: "star_bell",
    grit: 60,
    solvedLine: "The bell rings clear through the water, high and bright, and the wreck's timbers seem to lean toward the sound.",
  },

  // Nerve Path — reflex-sequence "stunts" standing in for combat. Design
  // doc rule: no combat minigame can kill the hero. Missing a beat or
  // running out the timer just resets the sequence for another try; there
  // is no fail state, only a slower clear.
  donana_pursuit: {
    type: "stunt",
    title: "The Rotten Boardwalk",
    flavor: "A Consortium skiff is closing on the reed line. Watch which boards he plants his weight on, then follow the same line, fast.",
    moves: [
      { id: "left", label: "Left Plank" },
      { id: "center", label: "Center Plank" },
      { id: "right", label: "Right Plank" },
    ],
    sequenceLength: 5,
    windowMs: 6500,
    watchLine: "Watch his footing...",
    goLine: "Go — match it!",
    successLine: "Clear across, boards splintering behind him.",
    wrongLine: "Wrong board —",
    fumbleLine: "he's back on solid ground, no worse for it. Try again.",
    flagOnSolve: "donana_boardwalk_crossed",
    grit: 20,
    solvedLine: "He clears the last plank a half-step ahead of a very ominous crack, and doesn't look back to check the skiff's progress.",
  },

  sahara_tram: {
    type: "stunt",
    title: "The Survey Tram",
    flavor: "The tram's picking up speed downhill with no working brakes. Pull the levers in the order the old conductor's diagram shows, before the rings run out.",
    moves: [
      { id: "brake", label: "Brake Lever" },
      { id: "throttle", label: "Throttle" },
      { id: "sand", label: "Sand Hopper" },
    ],
    sequenceLength: 5,
    windowMs: 6500,
    watchLine: "Study the lever sequence...",
    goLine: "Now — pull them in order!",
    successLine: "The tram shudders and grinds to a stop, right at the centre ring.",
    wrongLine: "Wrong lever —",
    fumbleLine: "the tram just rattles on a little further. Plenty of track left to try again.",
    flagOnSolve: "sahara_tram_ridden",
    grit: 20,
    solvedLine: "The tram groans to a halt in a cloud of dust, exactly where the rings converge.",
  },

  ferro_arm_wrestle: {
    type: "stunt",
    title: "The Wager",
    flavor: "Ferro's grin doesn't move, but his arm does. Match his pushes to keep from going down.",
    moves: [
      { id: "push", label: "Push" },
      { id: "hold", label: "Hold" },
      { id: "twist", label: "Twist" },
    ],
    sequenceLength: 5,
    windowMs: 6500,
    watchLine: "Feel out his rhythm...",
    goLine: "Now — match him!",
    successLine: "His arm finally gives, and so does his grin.",
    wrongLine: "He turns it —",
    fumbleLine: "your knuckles hit the crate lid, but your arm's still attached. He'll go again.",
    flagOnSolve: "ferro_beaten",
    grit: 20,
    solvedLine: "Ferro's hand slams down and he barks out a laugh that sounds almost like respect. \"Go on, then. Before I change my mind.\"",
  },

  // Act 3, The Caldera — the stage-4 finale (design doc, see the comment
  // above the stage-1 Voice puzzles): all three Voices at once, rather
  // than one at a time. The resonance engine already supports 1-3
  // simultaneous targets, so this needed no new puzzle code — only the
  // data below.
  drowned_bell_finale: {
    type: "resonance",
    title: "The Drowned Bell of Atlantis",
    flavor: "The Salt Conch, the Storm Fork, and the Star Bell, all three at once. Match every note.",
    targets: [130.81, 261.63, 523.25], // the three Voices together
    targetLabels: ["Salt Conch — the low voice", "Storm Fork — the middle voice", "Star Bell — the high voice"],
    flagOnSolve: "drowned_bell_awakened",
    grit: 150,
    solvedLine:
      "Three notes lock into one chord, and the water in the chamber goes perfectly still — then the Bell itself answers, a fourth note underneath the other three, so low it's felt more than heard.",
  },
};

export default PUZZLES;

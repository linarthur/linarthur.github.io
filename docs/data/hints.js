// data/hints.js — three-stage nudge -> strong hint -> solution, per goal id.

export const HINTS = {
  escape_gallery: [
    "That drop looks a lot safer with something to hold onto.",
    "There's a rope still tied off at the edge of the hole.",
    "Select Take, then click the rope hanging by the hole.",
  ],
  escape_stacks: [
    "Something's blocking the only way further down.",
    "That toppled shelf looks like it could be shoved clear.",
    "Select Push, then click the toppled shelf.",
  ],
  escape_boiler: [
    "All that steam is coming from somewhere — and it's blocking the grate.",
    "There's a valve wheel on the pipe above the grate. It looks stuck, not broken.",
    "Select Pull, then click the valve wheel.",
  ],
  escape_cellar: [
    "The stairwell down is there — it's just buried.",
    "That stack of barrels looks like it would move if pushed hard enough.",
    "Select Push, then click the barrel stack.",
  ],
  figure_out_basement: [
    "Something down here caused all this — look around for anyone who saw it happen.",
    "There's a porter mopping up near the shelf. He was here when it happened.",
    "Select Talk, then click Higgins, and ask him about the crate.",
  ],
  talk_to_higgins: [
    "Someone down here might know what happened to the crate.",
    "There's a porter mopping up near the shelf — try the Talk verb on him.",
    "Select Talk, then click Higgins. Ask him about both the crate and the water.",
  ],
  examine_tablet: [
    "Higgins had a theory about where that hum was coming from.",
    "He pointed toward the etched tablet on the back wall.",
    "Select Look, then click the etched tablet again now that you know where to look.",
  ],
  find_the_chart: [
    "Something else washed up down here besides Higgins's mop water.",
    "There's something snagged against the pipe joint, half-submerged.",
    "Select Take, then click the map tube near the water by the pipe.",
  ],
  solve_azulejo: [
    "That tile-shop window has a puzzle in it, not just a decoration.",
    "The panel's a sliding chart — nine tiles, one blank space.",
    "Select Use, then click the tile workshop window, and slide the tiles into place.",
  ],
  reach_malta: [
    "The chart in the workshop window needs finishing before there's anywhere to go.",
    "Once the chart's solved, the funicular stop at the end of the alley opens up.",
    "Walk to the funicular stop at the far end of the alley.",
  ],
  solve_hypogeum: [
    "The oracle niche isn't just for looking at — it's for testing.",
    "Clap, and listen for which of the three chambers answers first.",
    "Select Use, then click the oracle niche, clap, and pick the middle chamber.",
  ],
  meet_draghi: [
    "Someone at that bar has been watching the door since he walked in.",
    "Try talking to the woman by the bar.",
    "Select Talk, then click the Contessa.",
  ],
  choose_a_path: [
    "There's nothing left to learn from her tonight — the door to the docks is the way forward.",
    "The door out to the docks will ask him to choose how he travels from here.",
    "Click the door to the docks and pick a path.",
  ],
  find_salt_conch: [
    "The marsh mud won't be safe to cross without a second pair of eyes.",
    "Talk to Mo about getting across before going near the shell.",
    "Select Talk, then click Mo, and ask about the marsh. Then Use the half-buried shell.",
  ],
  find_storm_fork: [
    "The rings all look identical from the ground — that's the whole trick of the place.",
    "Talk to Mo for a bearing before digging anywhere.",
    "Select Talk, then click Mo, and ask about getting to the centre. Then Use the buried bronze.",
  ],
  find_star_bell: [
    "Diving on a loose air line is how people don't come back up.",
    "Talk to Mo about getting into the suit before touching the bell.",
    "Select Talk, then click Mo, and ask her to mind the pump. Then Use the Star Bell.",
  ],
  forge_permit: [
    "The warden isn't moving without paperwork he believes in.",
    "There's a blank permit and a stamp both sitting right on his desk.",
    "Take the blank permit, then take the Consortium stamp — they'll combine on their own. Then Use the half-buried shell.",
  ],
  forge_disguise: [
    "A stranger in a tweed jacket isn't getting past that broker.",
    "The trading stall sells exactly what a disguise needs.",
    "Take the local robes, then take the headscarf — they'll combine into a disguise. Then Use the buried bronze.",
  ],
  forge_requisition: [
    "The foreman wants paperwork, not persuasion.",
    "There's a blank requisition form and an official seal somewhere near the crates.",
    "Take the requisition form, then take the official seal. Talk to the foreman and show him the requisition. Then dive and Use the Star Bell.",
  ],
  cross_boardwalk: [
    "That skiff isn't going to wait for anyone to pick their way across carefully.",
    "The boardwalk out front is the only dry line to the shell — worth a closer look.",
    "Select Use, then click the rotten boardwalk, and repeat the footwork it shows you before the timer runs out.",
  ],
  brake_tram: [
    "There's no crossing those rings on foot before the heat gets dangerous.",
    "That tram at the edge of the track looks like it still runs — brakes or no brakes.",
    "Select Use, then click the survey tram, and pull the levers in the order it shows you.",
  ],
  beat_ferro: [
    "Someone's standing right between the professor and that ladder.",
    "Ferro won't move for talk alone — but he's the type to take a wager seriously.",
    "Select Talk, then click Ferro, and ask him to name his terms. Then Use him to take the wager.",
  ],
  reach_caldera: [
    "There's nothing left to do down here — time to surface.",
    "Every path back up leads to the same last stop.",
    "Click the way back to the surface.",
  ],
  confront_draghi: [
    "Someone's waiting at the Caldera's rim, and she came a long way to just stand there.",
    "She won't stop him — but she deserves to be heard out first.",
    "Select Talk, then click the Contessa.",
  ],
  wake_the_bell: [
    "Three Voices, one silent Bell — the shape of the answer is right there.",
    "The altar at the centre of the flooded chamber is built for exactly what's in his pockets.",
    "Select Use, then click the Drowned Bell of Atlantis, and match all three notes at once.",
  ],
};

export default HINTS;

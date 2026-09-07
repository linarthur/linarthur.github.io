// data/puzzles.js — puzzle instances, keyed by id and referenced from room
// hotspots via `puzzleOnVerb`. `type` selects which puzzle engine handles
// it (see engine/main.js's puzzle-open dispatch): resonance, tileSlide, or
// echo. Each is otherwise just data — adding a puzzle never touches the
// engine.

export const PUZZLES = {
  pipe_resonance: {
    type: "resonance",
    title: "The Overhead Pipe\n頭頂的水管",
    flavor: "A pipe shouldn't hold a note like that. Everything down here is starting to hum the same tune. Match it, and see what stops.\n水管本不該發出這種音調。這下面的一切好像都開始哼起同一段旋律。跟上它的音調,看看會有什麼停下來。",
    targets: [220],
    flagOnSolve: "pipe_resonance_solved",
    grit: 25,
    solvedLine:
      "The pipe rings clean and true — and stops, like something finally satisfied. If a pipe can be tuned into silence, so, apparently, can whatever else is down here.\n水管發出清亮準確的音,接著停了下來,像是終於滿足了什麼。如果一根水管能被調到寂靜,看來這下面其他的東西也可以。",
  },

  lisbon_azulejo: {
    type: "tileSlide",
    title: "The Azulejo Chart\n瓷磚海圖",
    flavor: "Nine tiles, one chart. Slide them home.\n九片磁磚,一張海圖。把它們滑回原位。",
    size: 3,
    flagOnSolve: "lisbon_azulejo_solved",
    grit: 40,
    solvedLine:
      "The tiles click into place and the glaze catches the lamplight — a compass rose, and beneath it, a coastline that isn't Portugal at all.\n磁磚喀噠一聲歸位,釉面映著燈光——一朵羅盤玫瑰,底下是一段根本不是葡萄牙的海岸線。",
    // Allowed to skip — a kid who can't get the tiles to line up shouldn't
    // be stuck in Lisbon forever. Skipping still unlocks the funicular,
    // just for a fraction of the Grit and none of the satisfaction.
    skipGrit: 10,
    skippedLine:
      "He leaves the tiles half-sorted and just guesses at the route from what's already assembled — not exactly confidence-inspiring, but it'll do.\n他把磁磚拼到一半就放棄了,憑著已經拼好的部分猜出大概路線——說不上讓人安心,但也將就夠用。",
  },

  hypogeum_echo: {
    type: "echo",
    title: "The Hypogeum\n地下墓穴",
    flavor: "Clap once, and listen close. Two of these alcoves just echo. Only one was built to answer.\n拍一下手,仔細聽。這些石龕裡有兩個只是回音,只有一個是特意建來回應聲音的。",
    chambers: [
      { id: "near", label: "Near Chamber\n近側石室", distance: 60 },
      { id: "mid", label: "Middle Chamber\n中央石室", distance: 110 },
      { id: "far", label: "Far Chamber\n遠側石室", distance: 160 },
    ],
    correctId: "mid",
    delayMs: 900,
    flagOnSolve: "hypogeum_echo_solved",
    grit: 40,
    solvedLine:
      "The middle chamber answers first, exactly as its narrowed throat was carved to do — three thousand years of stonework, still keeping perfect time.\n中央石室率先回應,正如它那收窄的喉狀構造原本設計的功用——三千年的石雕工藝,至今依然分毫不差。",
  },

  // The Three Voices — stage 1 resonance puzzles (single pitch), escalating
  // to the stage-4 finale (three at once) in Act 3. Solving one adds the
  // resonator straight to inventory — these aren't flavour, they're the
  // MacGuffins the whole plot is chasing.
  salt_conch_resonance: {
    type: "resonance",
    title: "The Salt Conch\n海鹽法螺",
    flavor: "Half-buried in the marsh mud, humming a note low enough to feel more than hear. Match it.\n半埋在沼澤泥裡,哼著一個低到與其說聽見不如說感覺到的音。跟上它。",
    targets: [130.81], // C3 — the low voice
    flagOnSolve: "salt_conch_found",
    itemReward: "salt_conch",
    grit: 60,
    solvedLine: "The shell answers, one long low note, and the mud around it settles like it's exhaling.\n貝殼回應了,一長串低沉的音,周圍的泥地彷彿跟著吐了口氣,慢慢沉靜下來。",
  },

  storm_fork_resonance: {
    type: "resonance",
    title: "The Storm Fork\n風暴音叉",
    flavor: "A bronze tuning fork, buried to its tines in sand at the centre of the rings. Match its note.\n一支青銅音叉,叉尖埋在同心圓中心的沙裡。跟上它的音。",
    targets: [261.63], // C4 — the middle voice
    flagOnSolve: "storm_fork_found",
    itemReward: "storm_fork",
    grit: 60,
    solvedLine: "The fork rings out across the rings themselves — for a moment, the whole Richat Structure seems to hum back.\n音叉的聲音響徹整片同心圓地形——有那麼一瞬間,整個里契特結構彷彿都跟著共鳴起來。",
  },

  star_bell_resonance: {
    type: "resonance",
    title: "The Star Bell\n星辰鈴",
    flavor: "A crystal bell, wedged in the wreck's ribs, silent in the air but restless underwater. Match its note.\n一只水晶鈴,卡在沉船的肋骨結構裡,在空氣中沉默,水裡卻躁動不安。跟上它的音。",
    targets: [523.25], // C5 — the high voice
    flagOnSolve: "star_bell_found",
    itemReward: "star_bell",
    grit: 60,
    solvedLine: "The bell rings clear through the water, high and bright, and the wreck's timbers seem to lean toward the sound.\n鈴聲清亮地穿透水面,高亢明亮,沉船的木樑彷彿也朝著聲音的方向傾斜過去。",
  },

  // Nerve Path — reflex-sequence "stunts" standing in for combat. Design
  // doc rule: no combat minigame can kill the hero. Missing a beat or
  // running out the timer just resets the sequence for another try; there
  // is no fail state, only a slower clear.
  donana_pursuit: {
    type: "stunt",
    title: "The Rotten Boardwalk\n腐朽的木棧道",
    flavor: "A Consortium skiff is closing on the reed line. Watch which boards he plants his weight on, then follow the same line, fast.\n財團的小艇正逼近蘆葦線。看清楚他踩的是哪幾塊木板,然後快速照著同樣的路線走。",
    moves: [
      { id: "left", label: "Left Plank\n左側木板" },
      { id: "center", label: "Center Plank\n中間木板" },
      { id: "right", label: "Right Plank\n右側木板" },
    ],
    sequenceLength: 5,
    windowMs: 6500,
    watchLine: "Watch his footing...\n看清楚他的腳步……",
    goLine: "Go — match it!\n上——跟上他的腳步!",
    successLine: "Clear across, boards splintering behind him.\n順利通過,身後的木板碎裂四散。",
    wrongLine: "Wrong board —\n踩錯木板了——",
    fumbleLine: "he's back on solid ground, no worse for it. Try again.\n他退回到堅實的地面上,毫髮無傷。再試一次。",
    flagOnSolve: "donana_boardwalk_crossed",
    grit: 20,
    solvedLine: "He clears the last plank a half-step ahead of a very ominous crack, and doesn't look back to check the skiff's progress.\n他踩過最後一塊木板,身後緊接著傳來一聲不祥的斷裂聲,他頭也不回,沒空確認小艇追到哪了。",
  },

  sahara_tram: {
    type: "stunt",
    title: "The Survey Tram\n測量小火車",
    flavor: "The tram's picking up speed downhill with no working brakes. Pull the levers in the order the old conductor's diagram shows, before the rings run out.\n小火車正下坡加速,煞車失靈。趁圓環還沒跑完,照老車長圖表上的順序拉動控制桿。",
    moves: [
      { id: "brake", label: "Brake Lever\n煞車桿" },
      { id: "throttle", label: "Throttle\n節流閥" },
      { id: "sand", label: "Sand Hopper\n撒沙斗" },
    ],
    sequenceLength: 5,
    windowMs: 6500,
    watchLine: "Study the lever sequence...\n記住控制桿的順序……",
    goLine: "Now — pull them in order!\n上——按順序拉動!",
    successLine: "The tram shudders and grinds to a stop, right at the centre ring.\n小火車震了一下,吱嘎作響地停下來,正好停在中心圓環。",
    wrongLine: "Wrong lever —\n拉錯桿了——",
    fumbleLine: "the tram just rattles on a little further. Plenty of track left to try again.\n小火車只是又晃盪著往前滑了一段。前面軌道還長,再試一次。",
    flagOnSolve: "sahara_tram_ridden",
    grit: 20,
    solvedLine: "The tram groans to a halt in a cloud of dust, exactly where the rings converge.\n小火車在一團塵土中呻吟著停下,正好停在圓環交會的地方。",
  },

  ferro_arm_wrestle: {
    type: "stunt",
    title: "The Wager\n這場賭注",
    flavor: "Ferro's grin doesn't move, but his arm does. Match his pushes to keep from going down.\n費羅的笑容一動不動,手臂卻動個不停。跟上他的力道,別被壓倒。",
    moves: [
      { id: "push", label: "Push\n推" },
      { id: "hold", label: "Hold\n撐住" },
      { id: "twist", label: "Twist\n扭轉" },
    ],
    sequenceLength: 5,
    windowMs: 6500,
    watchLine: "Feel out his rhythm...\n感受他的節奏……",
    goLine: "Now — match him!\n上——跟上他!",
    successLine: "His arm finally gives, and so does his grin.\n他的手臂終於撐不住了,笑容也跟著垮了下來。",
    wrongLine: "He turns it —\n他反壓過來——",
    fumbleLine: "your knuckles hit the crate lid, but your arm's still attached. He'll go again.\n你的指節撞上木箱蓋,但手臂還好好的。他還會再來一局。",
    flagOnSolve: "ferro_beaten",
    grit: 20,
    solvedLine: "Ferro's hand slams down and he barks out a laugh that sounds almost like respect. \"Go on, then. Before I change my mind.\"\n費羅的手猛然被壓倒在桌上,他爆出一陣笑聲,聽起來幾乎像是敬意。「去吧,趁我還沒改變主意。」",
  },

  // Act 3, The Caldera — the stage-4 finale (design doc, see the comment
  // above the stage-1 Voice puzzles): all three Voices at once, rather
  // than one at a time. The resonance engine already supports 1-3
  // simultaneous targets, so this needed no new puzzle code — only the
  // data below.
  drowned_bell_finale: {
    type: "resonance",
    title: "The Drowned Bell of Atlantis\n沉沒的亞特蘭提斯之鐘",
    flavor: "The Salt Conch, the Storm Fork, and the Star Bell, all three at once. Match every note.\n海鹽法螺、風暴音叉、星辰鈴,三者同時響起。跟上每一個音。",
    targets: [130.81, 261.63, 523.25], // the three Voices together
    targetLabels: ["Salt Conch — the low voice\n海鹽法螺——低音之聲", "Storm Fork — the middle voice\n風暴音叉——中音之聲", "Star Bell — the high voice\n星辰鈴——高音之聲"],
    flagOnSolve: "drowned_bell_awakened",
    grit: 150,
    solvedLine:
      "Three notes lock into one chord, and the water in the chamber goes perfectly still — then the Bell itself answers, a fourth note underneath the other three, so low it's felt more than heard.\n三個音鎖成一個和弦,石室裡的水面瞬間變得完全靜止——接著鐘本身回應了,在另外三個音之下響起第四個音,低到與其說聽見不如說感覺到。",
  },
};

export default PUZZLES;

// data/journal.js — auto-updating goals list + the re-readable Codex.
// Both are pure reads of the flag store (see engine/journal.js).
// Goals are gated with `show` so later rooms don't spoil themselves before
// the player has reached them.

export const GOALS = [
  {
    id: "escape_gallery",
    text: "Find a way down through the hole in the gallery floor.\n想辦法穿過畫廊地板上的洞,往下走。",
    show: () => true,
    done: (flags) => !!flags.rope_taken,
  },
  {
    id: "escape_stacks",
    text: "Clear a path through the toppled stacks.\n清出一條穿過倒塌書架的路。",
    show: (flags) => !!flags.rope_taken,
    done: (flags) => !!flags.shelf_moved,
  },
  {
    id: "escape_boiler",
    text: "Shut off the steam blocking the way down.\n關掉擋住去路的蒸氣。",
    show: (flags) => !!flags.shelf_moved,
    done: (flags) => !!flags.valve_shut,
  },
  {
    id: "escape_cellar",
    text: "Clear the cellar doorway.\n清出地窖的門口。",
    show: (flags) => !!flags.valve_shut,
    done: (flags) => !!flags.barrels_moved,
  },
  {
    id: "figure_out_basement",
    text: "Figure out what happened down here.\n查明這裡究竟發生了什麼事。",
    show: (flags) => !!flags.barrels_moved,
    done: (flags) => !!flags.learned_crate_theft,
  },
  {
    id: "talk_to_higgins",
    text: "Talk to Higgins — he was here when it happened.\n找希金斯談談——事發時他就在現場。",
    show: (flags) => !!flags.barrels_moved,
    done: (flags) => !!flags.learned_crate_theft && !!flags.learned_water,
  },
  {
    id: "examine_tablet",
    text: "Take a closer look at the etched tablet.\n仔細看看那塊刻字石板。",
    show: (flags) => !!flags.learned_water,
    done: (flags) => !!flags.saw_tablet,
  },
  {
    id: "find_the_chart",
    text: "Search the flooded sub-basement for more clues.\n在淹水的地下室裡搜尋更多線索。",
    show: (flags) => !!flags.barrels_moved,
    done: (flags) => !!flags.found_chart,
  },
  {
    id: "solve_azulejo",
    text: "Piece together the azulejo chart in the tile workshop window.\n拼出瓷磚工作室櫥窗裡的瓷磚地圖。",
    show: (flags) => !!flags.prologue_complete,
    done: (flags) => !!flags.lisbon_azulejo_solved,
  },
  {
    id: "reach_malta",
    text: "Catch the funicular once the chart's assembled.\n拼好地圖後,搭上纜車。",
    show: (flags) => !!flags.lisbon_azulejo_solved,
    done: (flags) => !!flags.hypogeum_echo_solved || !!flags.met_draghi,
  },
  {
    id: "solve_hypogeum",
    text: "Work out which chamber in the Hypogeum is listening.\n查出地下神殿裡哪個石室在傾聽。",
    show: (flags) => !!flags.lisbon_azulejo_solved,
    done: (flags) => !!flags.hypogeum_echo_solved,
  },
  {
    id: "meet_draghi",
    text: "See who's waiting at the harbour bar.\n看看是誰在港口酒吧等著。",
    show: (flags) => !!flags.hypogeum_echo_solved,
    done: (flags) => !!flags.met_draghi,
  },
  {
    id: "choose_a_path",
    text: "Decide how to proceed, once he's heard her out.\n聽她說完後,決定接下來該怎麼走。",
    show: (flags) => !!flags.met_draghi,
    done: (flags) => !!flags.act1_complete,
  },
  {
    id: "find_salt_conch",
    text: "Ask Mo for a way across the Doñana marshes, then find the Salt Conch.\n向莫請教穿越多尼亞納沼澤的方法,然後找到鹽螺。",
    show: (flags) => !!flags.path_partners && !!flags.act1_complete,
    done: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "find_storm_fork",
    text: "Get a bearing from Mo, then find the Storm Fork at the centre of the rings.\n向莫問個方位,然後在環狀地形中心找到風暴音叉。",
    show: (flags) => !!flags.path_partners && !!flags.salt_conch_found,
    done: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "find_star_bell",
    text: "Have Mo mind the air line, then find the Star Bell in the wreck.\n請莫幫忙看著呼吸管,然後在沉船中找到星辰鐘。",
    show: (flags) => !!flags.path_partners && !!flags.storm_fork_found,
    done: (flags) => !!flags.star_bell_found,
  },

  // Cunning Path — same three Voices, no Mo: forge the way past each
  // checkpoint instead.
  {
    id: "forge_permit",
    text: "Find a blank permit and the Consortium's stamp, then find the Salt Conch.\n找到空白許可證和財團印章,然後找到鹽螺。",
    show: (flags) => !!flags.path_cunning && !!flags.act1_complete,
    done: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "forge_disguise",
    text: "Put together a disguise the camel broker won't look twice at, then find the Storm Fork.\n拼湊出一套能瞞過駱駝掮客的偽裝,然後找到風暴音叉。",
    show: (flags) => !!flags.path_cunning && !!flags.salt_conch_found,
    done: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "forge_requisition",
    text: "Forge a Consortium requisition, talk your way past the foreman, then find the Star Bell.\n偽造一份財團申請單,說服工頭放行,然後找到星辰鐘。",
    show: (flags) => !!flags.path_cunning && !!flags.storm_fork_found,
    done: (flags) => !!flags.star_bell_found,
  },

  // Nerve Path — same three Voices, no partner and no forgery: outrun,
  // outlast, or out-wrestle each obstacle instead.
  {
    id: "cross_boardwalk",
    text: "Outrun the Consortium skiff across the rotten boardwalk, then find the Salt Conch.\n在腐朽的木棧道上甩開財團的小艇,然後找到鹽螺。",
    show: (flags) => !!flags.path_nerve && !!flags.act1_complete,
    done: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "brake_tram",
    text: "Bring the runaway survey tram to a stop at the centre of the rings, then find the Storm Fork.\n讓失控的測量纜車在環狀地形中心停下,然後找到風暴音叉。",
    show: (flags) => !!flags.path_nerve && !!flags.salt_conch_found,
    done: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "beat_ferro",
    text: "Win the wager against Ferro at the dockyard, then find the Star Bell.\n在船塢贏過費羅的賭局,然後找到星辰鐘。",
    show: (flags) => !!flags.path_nerve && !!flags.storm_fork_found,
    done: (flags) => !!flags.star_bell_found,
  },

  // Act 3 — The Caldera. Shared across all three paths once the Voices
  // are found — see the "act2_complete" flag set by all three
  // checkAct2*Complete functions in engine/main.js.
  {
    id: "reach_caldera",
    text: "With all three Voices in hand, head for the surface — and the Caldera.\n手握三個「聲音」,前往地面——直奔火山口。",
    show: (flags) => !!flags.act2_complete,
    done: (flags) => !!flags.caldera_arrival_seen,
  },
  {
    id: "confront_draghi",
    text: "Hear out the Contessa, one last time.\n最後再聽伯爵夫人說一次。",
    show: (flags) => !!flags.caldera_arrival_seen,
    done: (flags) => !!flags.draghi_caldera_met,
  },
  {
    id: "wake_the_bell",
    text: "Use the Salt Conch, the Storm Fork, and the Star Bell together on the Drowned Bell of Atlantis.\n把鹽螺、風暴音叉和星辰鐘一起用在亞特蘭提斯沉鐘上。",
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
    title: "The Diving-Bell Crate, Barnett Hall Gallery\n潛水鐘木箱,巴奈特廳畫廊",
    text: '"Three voices wake the ninth wave." — scratched into the lip in a hurry, by someone who wanted it read.\n「三個聲音喚醒第九道浪。」——匆忙刻在箱緣上,刻的人顯然希望有人看到。',
    show: (flags) => !!flags.read_crate_etching,
  },
  {
    id: "three_voices",
    title: "Etched Tablet, Barnett College Sub-Basement\n刻字石板,巴奈特學院地下室",
    text: '"Three voices wake the ninth wave." — the same phrase, cut into basalt older than Linear A. This wasn\'t written once.\n「三個聲音喚醒第九道浪。」——同樣的字句,刻在比線形文字A還古老的玄武岩上。這句話,顯然不只寫過一次。',
    show: (flags) => !!flags.saw_tablet,
  },
  {
    id: "portuguese_chart",
    title: "The Portuguese Chart\n葡萄牙海圖",
    text: "A 16th-century chart of the Iberian coast, three anchorages ringed in a hand nobody alive could have written.\n一張十六世紀的伊比利海岸圖,三處錨地被圈了起來,字跡出自一隻不可能還活著的手。",
    show: (flags) => !!flags.found_chart,
  },
  {
    id: "draghi_motive",
    title: "Contessa Verena Draghi, Adriatic Salvage Consortium\n薇蕾娜·德拉吉伯爵夫人,亞得里亞海撈財團",
    text: "Wants to know which coastlines the bell answers — and to buy them, quietly, before anyone else understands why the land's gone cheap.\n想知道那口鐘會對哪些海岸線起反應——並趁著還沒人搞懂土地為何變得廉價之前,悄悄買下它們。",
    show: (flags) => !!flags.learned_draghi_motive || !!flags.learned_draghi_plan,
  },
  {
    id: "codex_salt_conch",
    title: "The Salt Conch — Doñana, Spain\n鹽螺——西班牙,多尼亞納",
    text: "The low voice. A fossilised shell horn, pulled from the marsh mud with Mo's help.\n低音之聲。一支石化的螺號,在莫的協助下從沼澤爛泥中拔出。",
    show: (flags) => !!flags.salt_conch_found,
  },
  {
    id: "codex_storm_fork",
    title: "The Storm Fork — The Richat Structure, Mauritania\n風暴音叉——茅利塔尼亞,理查特結構",
    text: "The middle voice. A two-metre bronze tuning fork, once a lighthouse fog-warner, dug from the centre of the rings.\n中音之聲。一支兩公尺長的青銅音叉,曾是燈塔的霧笛裝置,從環狀地形中心挖出。",
    show: (flags) => !!flags.storm_fork_found,
  },
  {
    id: "codex_star_bell",
    title: "The Star Bell — Bimini, Bahamas\n星辰鐘——巴哈馬,比米尼",
    text: "The high voice. A crystal handbell that only rings underwater, freed from the wreck on the Bimini Road.\n高音之聲。一只只在水下才會作響的水晶手鈴,從比米尼道的沉船中取出。",
    show: (flags) => !!flags.star_bell_found,
  },
  {
    id: "codex_drowned_bell",
    title: "The Drowned Bell of Atlantis — The Caldera\n亞特蘭提斯沉鐘——火山口",
    text: "The fourth voice, and the reason for the other three. Bronze gone the colour of the sea, silent for three thousand years until the chord found it.\n第四個聲音,也是其他三個聲音存在的理由。青銅染上大海的顏色,沉寂了三千年,直到那和弦找上了它。",
    show: (flags) => !!flags.drowned_bell_awakened,
  },
];

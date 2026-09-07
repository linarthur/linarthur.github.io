// data/hints.js — three-stage nudge -> strong hint -> solution, per goal id.

export const HINTS = {
  escape_gallery: [
    "That drop looks a lot safer with something to hold onto.\n手上有東西可抓,這個洞看起來安全多了。",
    "There's a rope still tied off at the edge of the hole.\n洞口邊還綁著一條繩子。",
    "Select Take, then click the rope hanging by the hole.\n選擇「拿取」,然後點擊洞口旁垂掛的繩子。",
  ],
  escape_stacks: [
    "Something's blocking the only way further down.\n有東西擋住了唯一能繼續往下走的路。",
    "That toppled shelf looks like it could be shoved clear.\n那個倒下的書架看起來可以推開。",
    "Select Push, then click the toppled shelf.\n選擇「推」,然後點擊倒下的書架。",
  ],
  escape_boiler: [
    "All that steam is coming from somewhere — and it's blocking the grate.\n這些蒸氣總得從某處冒出來——而且正好擋住了鐵柵欄。",
    "There's a valve wheel on the pipe above the grate. It looks stuck, not broken.\n鐵柵欄上方的管子上有個閥輪,看起來是卡住了,不是壞掉。",
    "Select Open/Close, then click the valve wheel.\n選擇「開/關」,然後點擊閥輪。",
  ],
  escape_cellar: [
    "The stairwell down is there — it's just buried.\n往下的樓梯間就在那裡——只是被埋住了。",
    "That stack of barrels looks like it would move if pushed hard enough.\n那疊木桶看起來只要用力推就能移開。",
    "Select Push, then click the barrel stack.\n選擇「推」,然後點擊那疊木桶。",
  ],
  figure_out_basement: [
    "Something down here caused all this — look around for anyone who saw it happen.\n這裡發生的一切必有原因——四處看看,找找有沒有人目擊經過。",
    "There's a porter mopping up near the shelf. He was here when it happened.\n書架附近有個工友正在拖地,事發時他就在場。",
    "Select Talk, then click Higgins, and ask him about the crate.\n選擇「交談」,然後點擊希金斯,問他關於木箱的事。",
  ],
  talk_to_higgins: [
    "Someone down here might know what happened to the crate.\n這裡應該有人知道那個木箱發生了什麼事。",
    "There's a porter mopping up near the shelf — try the Talk verb on him.\n書架附近有個工友正在拖地——試著對他使用「交談」指令。",
    "Select Talk, then click Higgins. Ask him about both the crate and the water.\n選擇「交談」,然後點擊希金斯。問他關於木箱和積水的事。",
  ],
  examine_tablet: [
    "Higgins had a theory about where that hum was coming from.\n希金斯對那陣嗡嗡聲的來源有個想法。",
    "He pointed toward the etched tablet on the back wall.\n他指向後牆上那塊刻字石板。",
    "Select Look, then click the etched tablet again now that you know where to look.\n選擇「查看」,現在你知道該看哪裡了,再點一次那塊刻字石板。",
  ],
  find_the_chart: [
    "Something else washed up down here besides Higgins's mop water.\n這裡沖上來的,不只是希金斯拖把裡的水。",
    "There's something snagged against the pipe joint, half-submerged.\n管接頭那裡卡著什麼東西,半沉在水裡。",
    "Select Take, then click the map tube near the water by the pipe.\n選擇「拿取」,然後點擊管子旁積水中的地圖筒。",
  ],
  solve_azulejo: [
    "That tile-shop window has a puzzle in it, not just a decoration.\n那家瓷磚店的櫥窗裡藏著一個謎題,不只是裝飾品。",
    "The panel's a sliding chart — nine tiles, one blank space.\n那面板是張滑動拼圖——九片瓷磚,一格空位。",
    "Select Use, then click the tile workshop window, and slide the tiles into place.\n選擇「使用」,然後點擊瓷磚工作室的櫥窗,把瓷磚滑動到正確位置。",
  ],
  reach_malta: [
    "The chart in the workshop window needs finishing before there's anywhere to go.\n工作室櫥窗裡的地圖得先拼完,才有地方可去。",
    "Once the chart's solved, the funicular stop at the end of the alley opens up.\n地圖一拼好,巷子盡頭的纜車站就會開放。",
    "Walk to the funicular stop at the far end of the alley.\n走到巷子盡頭的纜車站。",
  ],
  solve_hypogeum: [
    "The oracle niche isn't just for looking at — it's for testing.\n那個神諭壁龕不是用來看的——是用來測試的。",
    "Clap, and listen for which of the three chambers answers first.\n拍個手,聽聽三個石室裡哪一個最先回應。",
    "Select Use, then click the oracle niche, clap, and pick the middle chamber.\n選擇「使用」,然後點擊神諭壁龕,拍手,選擇中間的石室。",
  ],
  meet_draghi: [
    "Someone at that bar has been watching the door since he walked in.\n自從他走進來,酒吧裡就有人一直盯著門口。",
    "Try talking to the woman by the bar.\n試著跟吧台旁的女子說說話。",
    "Select Talk, then click the Contessa.\n選擇「交談」,然後點擊伯爵夫人。",
  ],
  choose_a_path: [
    "There's nothing left to learn from her tonight — the door to the docks is the way forward.\n今晚從她那裡問不出更多了——通往碼頭的門才是前進的方向。",
    "The door out to the docks will ask him to choose how he travels from here.\n通往碼頭的門會讓他選擇接下來的行進方式。",
    "Click the door to the docks and pick a path.\n點擊通往碼頭的門,選一條路。",
  ],
  find_salt_conch: [
    "The marsh mud won't be safe to cross without a second pair of eyes.\n沒有人幫忙盯著,沼澤的爛泥可不安全。",
    "Talk to Mo about getting across before going near the shell.\n在靠近貝殼之前,先跟莫談談怎麼安全穿越。",
    "Select Talk, then click Mo, and ask about the marsh. Then Use the half-buried shell.\n選擇「交談」,然後點擊莫,問她關於沼澤的事。接著對半埋的貝殼使用「使用」。",
  ],
  find_storm_fork: [
    "The rings all look identical from the ground — that's the whole trick of the place.\n從地面看,那些環狀構造全都一模一樣——這正是這地方的機關所在。",
    "Talk to Mo for a bearing before digging anywhere.\n在任何地方挖掘之前,先找莫問個方位。",
    "Select Talk, then click Mo, and ask about getting to the centre. Then Use the buried bronze.\n選擇「交談」,然後點擊莫,問她如何到達中心。接著對埋藏的青銅器使用「使用」。",
  ],
  find_star_bell: [
    "Diving on a loose air line is how people don't come back up.\n帶著鬆脫的呼吸管潛水,就是有人再也上不來的原因。",
    "Talk to Mo about getting into the suit before touching the bell.\n在碰那口鐘之前,先跟莫談談怎麼穿上潛水裝。",
    "Select Talk, then click Mo, and ask her to mind the pump. Then Use the Star Bell.\n選擇「交談」,然後點擊莫,請她幫忙看著幫浦。接著對星辰鐘使用「使用」。",
  ],
  forge_permit: [
    "The warden isn't moving without paperwork he believes in.\n沒有他信得過的文件,看守員是不會放行的。",
    "There's a blank permit and a stamp both sitting right on his desk.\n他桌上就擺著一張空白許可證和一枚印章。",
    "Take the blank permit, then take the Consortium stamp — they'll combine on their own. Then Use the half-buried shell.\n拿取空白許可證,再拿取財團印章——它們會自動合併。接著對半埋的貝殼使用「使用」。",
  ],
  forge_disguise: [
    "A stranger in a tweed jacket isn't getting past that broker.\n穿花呢外套的陌生人,是過不了那個掮客這一關的。",
    "The trading stall sells exactly what a disguise needs.\n那個交易攤位賣的東西,正好是做偽裝所需要的。",
    "Take the local robes, then take the headscarf — they'll combine into a disguise. Then Use the buried bronze.\n拿取當地長袍,再拿取頭巾——它們會合併成一套偽裝。接著對埋藏的青銅器使用「使用」。",
  ],
  forge_requisition: [
    "The foreman wants paperwork, not persuasion.\n工頭要的是文件,不是說服。",
    "There's a blank requisition form and an official seal somewhere near the crates.\n木箱附近某處有一張空白申請單和一枚官方印璽。",
    "Take the requisition form, then take the official seal. Talk to the foreman and show him the requisition. Then dive and Use the Star Bell.\n拿取申請單,再拿取官方印璽。跟工頭交談,把申請單拿給他看。接著潛水,對星辰鐘使用「使用」。",
  ],
  cross_boardwalk: [
    "That skiff isn't going to wait for anyone to pick their way across carefully.\n那艘小艇可不會等人小心翼翼地慢慢挑路走。",
    "The boardwalk out front is the only dry line to the shell — worth a closer look.\n前方的木棧道是唯一一條通往貝殼的乾燥路線——值得仔細看看。",
    "Select Use, then click the rotten boardwalk, and repeat the footwork it shows you before the timer runs out.\n選擇「使用」,然後點擊腐朽的木棧道,在時間耗盡前照著顯示的步法走。",
  ],
  brake_tram: [
    "There's no crossing those rings on foot before the heat gets dangerous.\n光靠雙腳,根本沒辦法在高溫變得危險前穿過那些環狀地形。",
    "That tram at the edge of the track looks like it still runs — brakes or no brakes.\n軌道邊那輛纜車看起來還能動——不管煞車靈不靈。",
    "Select Use, then click the survey tram, and pull the levers in the order it shows you.\n選擇「使用」,然後點擊測量纜車,按照顯示的順序拉動操縱桿。",
  ],
  beat_ferro: [
    "Someone's standing right between the professor and that ladder.\n有人正擋在教授和那座梯子之間。",
    "Ferro won't move for talk alone — but he's the type to take a wager seriously.\n光靠嘴上功夫可打動不了費羅——但他是那種會認真看待賭局的人。",
    "Select Talk, then click Ferro, and ask him to name his terms. Then Use him to take the wager.\n選擇「交談」,然後點擊費羅,要他開條件。接著對他使用「使用」以接受賭局。",
  ],
  reach_caldera: [
    "There's nothing left to do down here — time to surface.\n這裡已經沒什麼好做的了——該浮上去了。",
    "Every path back up leads to the same last stop.\n每一條回去的路,最後都通往同一個終點。",
    "Click the way back to the surface.\n點擊回到地面的路。",
  ],
  confront_draghi: [
    "Someone's waiting at the Caldera's rim, and she came a long way to just stand here.\n火山口邊緣有人在等——她大老遠跑來,總不能就這樣站著。",
    "She won't stop him — but she deserves to be heard out first.\n她攔不住他——但至少該先聽她把話說完。",
    "Select Talk, then click the Contessa.\n選擇「交談」,然後點擊伯爵夫人。",
  ],
  wake_the_bell: [
    "Three Voices, one silent Bell — the shape of the answer is right there.\n三個「聲音」,一口沉默的鐘——答案的輪廓早已擺在眼前。",
    "The altar at the centre of the flooded chamber is built for exactly what's in his pockets.\n淹沒殿堂中央的祭壇,正是為了他口袋裡的東西而建。",
    "Select Use, then click the Drowned Bell of Atlantis, and match all three notes at once.\n選擇「使用」,然後點擊亞特蘭提斯沉鐘,同時對上三個音符。",
  ],
};

// HINT_TARGETS — maps a goal id to the room + hotspot/item id its stage-3
// ("solution") hint text points at, so the game can draw the same dashed
// highlight used on hover directly onto that spot. Purely additive: if a
// goal has no entry, or the player isn't in the listed room, no highlight
// is drawn and the text-only hint behaves exactly as before.
//
// `targets` is tried in order; each entry is either a hotspot/item id, or
// `{ id, unless }` where `unless` is a flag to skip that candidate once
// set. The first candidate that's still an item not yet held (and not
// already combined into something the player holds) or a hotspot not
// currently hidden by its own `hideWhenFlag` wins.
export const HINT_TARGETS = {
  escape_gallery: { room: "gallery", targets: ["rope"] },
  escape_stacks: { room: "stacks", targets: ["toppled_shelf"] },
  escape_boiler: { room: "boiler", targets: ["valve_wheel"] },
  escape_cellar: { room: "cellar", targets: ["barrel_stack"] },
  figure_out_basement: { room: "subbasement", targets: ["higgins"] },
  talk_to_higgins: { room: "subbasement", targets: ["higgins"] },
  examine_tablet: { room: "subbasement", targets: ["tablet"] },
  find_the_chart: { room: "subbasement", targets: ["chart"] },
  solve_azulejo: { room: "lisbonAlley", targets: ["tile_shop"] },
  reach_malta: { room: "lisbonAlley", targets: ["funicular"] },
  solve_hypogeum: { room: "hypogeum", targets: ["oracle_niche"] },
  meet_draghi: { room: "harborBar", targets: ["draghi"] },
  choose_a_path: { room: "harborBar", targets: ["harbor_door"] },
  find_salt_conch: { room: "donanaPartners", targets: [{ id: "mo", unless: "mo_helped_donana" }, "conch_site"] },
  find_storm_fork: { room: "saharaPartners", targets: [{ id: "mo", unless: "mo_helped_sahara" }, "fork_site"] },
  find_star_bell: { room: "biminiPartners", targets: [{ id: "mo", unless: "mo_helped_bimini" }, "bell_site"] },
  forge_permit: { room: "donanaCunning", targets: ["blank_permit", "consortium_stamp", "conch_site"] },
  forge_disguise: { room: "saharaCunning", targets: ["local_robes", "headscarf", "fork_site"] },
  forge_requisition: { room: "biminiCunning", targets: ["requisition_form", "official_seal", "bell_site"] },
  cross_boardwalk: { room: "donanaNerve", targets: ["boardwalk"] },
  brake_tram: { room: "saharaNerve", targets: ["tram"] },
  beat_ferro: { room: "biminiNerve", targets: ["ferro"] },
  confront_draghi: { room: "calderaApproach", targets: ["draghi"] },
  wake_the_bell: { room: "calderaChamber", targets: ["altar"] },
  // reach_caldera has no single room (the exit hotspot differs by which
  // Act 2 path/room the player is standing in) — left text-only.
};

export default HINTS;

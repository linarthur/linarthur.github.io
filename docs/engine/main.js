// engine/main.js — orchestrator. Milestone 1 gave us the room/verb/inventory
// skeleton; Milestone 2 adds dialogue trees, cutscene scripting, localStorage
// save/load, the journal, and the hint framework on top of it.

import { identity } from "../config/identity.js";
import { VERBS, smartDefaultVerb } from "./verbs.js";
import { pointInPolygon, clampToPolygon, polygonCentroid, distance } from "./geometry.js";
import { createRenderer } from "./renderer.js";
import { createLoop } from "./loop.js";
import { attachInput } from "./input.js";
import { createGameState, addItem, removeItem, hasItem, getFlag, setFlag, addGrit, setPath, gritTitle } from "./state.js";
import { unlockAudio, playTransitionChime, playChapterEndChime } from "./audio.js";
import { createMusicPlayer } from "./musicPlayer.js";
import { getItem } from "../data/items.js";
import { ROOMS } from "../data/rooms/index.js";
import { PUZZLES } from "../data/puzzles.js";
import { openResonancePuzzle, isResonanceOpen } from "../puzzles/resonanceUI.js";
import { openTileSlidePuzzle, isTileSlideOpen } from "../puzzles/tileSlideUI.js";
import { openEchoPuzzle, isEchoOpen } from "../puzzles/echoUI.js";
import { openStuntPuzzle, isStuntOpen } from "../puzzles/stuntUI.js";
import {
  initFirebase,
  isAvailable as cloudAvailable,
  isOnline,
  getCurrentUser,
  signInWithGoogle,
  signOutUser,
  ensureUserDoc,
  cloudSaveSlot,
  cloudLoadSlot,
} from "./firebaseSync.js";
import { createDialogueRunner } from "./dialogue.js";
import { runCutscene } from "./cutscene.js";
import { saveToSlot, loadFromSlot, listSlots, validateState, AUTOSAVE_ID } from "./save.js";
import { computeGoals, computeCodex } from "./journal.js";
import { createHintTracker } from "./hints.js";
import {
  createDialogueUI,
  createJournalUI,
  createPauseMenuUI,
  createCreditsUI,
  createChapterCardUI,
  createPathChoiceUI,
  createSignInGateUI,
  createHintToast,
  createSkipOverlay,
  removeSkipOverlay,
  bellFlourishSVG,
} from "./ui.js";
import { higginsDialogue } from "../data/dialogue/higgins.js";
import { fadoDialogue } from "../data/dialogue/fado.js";
import { draghiDialogue, draghiCalderaDialogue } from "../data/dialogue/draghi.js";
import { moDonanaDialogue, moSaharaDialogue, moBiminiDialogue } from "../data/dialogue/mo.js";
import { foremanBiminiDialogue } from "../data/dialogue/foreman.js";
import { ferroBiminiDialogue } from "../data/dialogue/ferro.js";
import { CUTSCENES } from "../data/cutscenes.js";
import { GOALS, CODEX } from "../data/journal.js";
import { HINTS, HINT_TARGETS } from "../data/hints.js";

// Dev-only tooling (window.__debug, the 'c' credits preview) is gated on
// this rather than deleted — it stays available for local testing, but
// never ships live on the deployed URL unless someone deliberately adds
// `?debug=1` themselves. See the isDevHost usage further down.
const isDevHost = ["localhost", "127.0.0.1", ""].includes(location.hostname);
const debugRequested = new URLSearchParams(location.search).has("debug");
const devToolsEnabled = isDevHost || debugRequested;

const DIALOGUES = {
  [higginsDialogue.id]: higginsDialogue,
  [fadoDialogue.id]: fadoDialogue,
  [draghiDialogue.id]: draghiDialogue,
  [draghiCalderaDialogue.id]: draghiCalderaDialogue,
  [moDonanaDialogue.id]: moDonanaDialogue,
  [moSaharaDialogue.id]: moSaharaDialogue,
  [moBiminiDialogue.id]: moBiminiDialogue,
  [foremanBiminiDialogue.id]: foremanBiminiDialogue,
  [ferroBiminiDialogue.id]: ferroBiminiDialogue,
};

const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (isTouch) document.body.classList.add("touch");

document.getElementById("tap-gate-title").textContent = identity.gameTitle;
document.getElementById("tap-gate-prompt").textContent = identity.strings.titleScreenPrompt;
document.getElementById("tap-gate-dedication").innerHTML =
  `${bellFlourishSVG(48)}<div class="dedication">${identity.dedication}</div>`;

const gameState = createGameState();
let room = ROOMS[gameState.roomId];
gameState.actor = { ...gameState.actor, ...room.actorStart };

// ---------- Firebase (Milestone 6): Google Sign-In + cloud saves ----------
// Never blocks: initFirebase resolves false on a missing config, a
// blocked/offline CDN, or any init error, and the game just runs on
// localStorage in that case (engine/save.js), same as every prior build.

const offlineBadge = document.getElementById("offline-badge");
let firebaseReady = false;

function refreshOfflineBadge() {
  const trulyOffline = !firebaseReady || !isOnline() || !getCurrentUser();
  offlineBadge.hidden = !trulyOffline;
}

// Resolves the first time we actually know the player's sign-in state —
// either Firebase's own onAuthStateChanged has reported it, or Firebase
// never became available at all (nothing to wait for then). The
// tap-to-begin gate awaits this (with a timeout, so a slow connection
// can never block play) so a returning signed-in player doesn't get
// flashed the sign-in gate before their session is restored.
let settleAuthWait;
const authStateSettled = new Promise((resolve) => {
  settleAuthWait = resolve;
});
let authWaitSettled = false;
function settleAuthOnce() {
  if (authWaitSettled) return;
  authWaitSettled = true;
  settleAuthWait();
}

initFirebase((user) => {
  refreshOfflineBadge();
  if (user) ensureUserDoc(gameState.grit);
  settleAuthOnce();
}).then((ok) => {
  firebaseReady = ok;
  refreshOfflineBadge();
  signInGateUI.setCloudAvailable(ok);
  if (!ok) settleAuthOnce(); // cloud never came up — nothing left to wait for
  return ok;
});
window.addEventListener("online", refreshOfflineBadge);
window.addEventListener("offline", refreshOfflineBadge);
refreshOfflineBadge();

// Milestone 9: MP3-based music (engine/musicPlayer.js), replacing the
// Tone.js adaptive score. One named track per location/state — see
// docs/assets/music/TRACKS.md for the full list and swap instructions.
const music = createMusicPlayer();
const ROOM_THEMES = {
  gallery: "barnett",
  stacks: "barnett",
  boiler: "barnett",
  cellar: "barnett",
  subbasement: "mystery",
  lisbonAlley: "lisbon",
  hypogeum: "malta",
  harborBar: "malta",
  donanaPartners: "donana",
  saharaPartners: "sahara",
  biminiPartners: "bimini",
  donanaCunning: "donana",
  saharaCunning: "sahara",
  biminiCunning: "bimini",
  biminiCunningDive: "bimini",
  donanaNerve: "donana",
  saharaNerve: "sahara",
  biminiNerve: "bimini",
  biminiNerveDive: "bimini",
  calderaApproach: "malta",
  calderaChamber: "malta",
};

// Rooms that play a one-time arrival cutscene the first time they're
// reached, keyed to the cutscene id in data/cutscenes.js. Reuses the
// `cs_ran_<id>` flag playCutscene already sets after running, so this
// list can grow without any new state-tracking machinery.
const ROOM_ARRIVAL_CUTSCENES = {
  calderaApproach: "caldera_arrival",
};

const canvas = document.getElementById("stage");
const { render } = createRenderer(canvas);

const actor = {
  x: gameState.actor.x,
  y: gameState.actor.y,
  targetX: gameState.actor.x,
  targetY: gameState.actor.y,
  facing: gameState.actor.facing,
  moving: false,
  speed: 0.42, // logical px per ms
};

let selectedVerb = null; // null = smart default
let selectedItemId = null; // the inventory item currently "held" for give/use
let hoveredTarget = null;
let pendingAction = null; // { verb, target } — executed on arrival
let paused = false;
let cutsceneActive = false;

// ---------- flags shortcut bound to this game's state ----------

const flagApi = {
  getFlag: (k) => getFlag(gameState, k),
  setFlag: (k, v) => setFlag(gameState, k, v),
  hasItem: (id) => hasItem(gameState, id),
  addGrit: (amount) => addGrit(gameState, amount),
};

// ---------- world query helpers ----------

function worldItems() {
  // A combine-pair item (Cunning Path forgeries) never itself enters the
  // inventory when it's the second half picked up — only its combinesInto
  // result does — and the first half gets removeItem'd back out once
  // combined. Both would otherwise reappear as live, invisible pickup
  // zones in the room. An item is gone from the world if it's held itself
  // OR if what it combines into is held.
  return room.items.filter((it) => {
    if (hasItem(gameState, it.id)) return false;
    // combinesInto lives on the master item definition (data/items.js),
    // not this room-local item instance — same lookup runAction uses.
    const full = getItem(it.id);
    if (full?.combinesInto && hasItem(gameState, full.combinesInto)) return false;
    return true;
  });
}

function getTargetAt(x, y) {
  for (const it of worldItems()) {
    if (pointInPolygon(x, y, it.polygon)) return { type: "item", def: it };
  }
  for (const hs of room.hotspots) {
    if (hs.hideWhenFlag && getFlag(gameState, hs.hideWhenFlag)) continue;
    if (pointInPolygon(x, y, hs.polygon)) return { type: "hotspot", def: hs };
  }
  if (pointInPolygon(x, y, room.walkbox)) return { type: "floor", x, y };
  return null;
}

function effectiveVerbFor(target) {
  if (selectedVerb) return selectedVerb;
  if (target.type === "floor") return "walk";
  if (target.type === "item") return "take";
  return smartDefaultVerb({ kind: target.def?.kind || "scenery" });
}

function inputBlocked() {
  return (
    paused ||
    cutsceneActive ||
    dialogueUI.isVisible() ||
    journalUI.isVisible() ||
    pauseUI.isVisible() ||
    chapterCardUI.isVisible() ||
    pathChoiceUI.isVisible() ||
    isResonanceOpen() ||
    isTileSlideOpen() ||
    isEchoOpen() ||
    isStuntOpen()
  );
}

// ---------- sentence line ----------

const sentenceEl = document.getElementById("sentence-line");
function setSentence(text) {
  sentenceEl.textContent = text;
}

function previewFor(target, verb) {
  const verbDef = VERBS.find((v) => v.id === verb);
  const verbLabel = verbDef ? verbDef.previewLabel : "Walk to";
  if (target.type === "floor") return "Walk here.";
  const name = target.type === "item" ? getItem(target.def.id).name : target.def.name;
  return `${verbLabel} ${name}.`;
}

// ---------- movement ----------

function setWalkTarget(x, y) {
  const [cx, cy] = clampToPolygon(actor.x, actor.y, x, y, room.walkbox);
  actor.targetX = cx;
  actor.targetY = cy;
  actor.moving = true;
}

function requestAction(verb, target, instant = false) {
  if (target.type === "floor") {
    pendingAction = null;
    setWalkTarget(target.x, target.y);
    if (instant) {
      actor.x = actor.targetX;
      actor.y = actor.targetY;
      actor.moving = false;
    }
    return;
  }
  const [cx, cy] = polygonCentroid(target.def.polygon);
  const standY = Math.min(cy + 90, room.walkbox.reduce((m, p) => Math.max(m, p[1]), 0));
  setWalkTarget(cx, standY);
  pendingAction = { verb, target };
  if (instant) {
    actor.x = actor.targetX;
    actor.y = actor.targetY;
    actor.moving = false;
    runAction(pendingAction.verb, pendingAction.target);
    pendingAction = null;
  }
}

function applySetFlagOn(def, verb) {
  const flag = def.setFlagOn && def.setFlagOn[verb];
  if (flag) setFlag(gameState, flag, true);
}

// A response entry is normally a plain string. It may instead be an object
// keyed by inventory item id (plus its own "default") so a hotspot can
// react differently depending on which item the player is holding when
// they Give/Use — e.g. `give: { forged_permit: "...", default: "..." }`.
// Every existing plain-string response keeps working unchanged.
function resolveResponse(entry, itemId) {
  if (entry && typeof entry === "object") return entry[itemId] ?? entry.default;
  return entry;
}

function runAction(verb, target) {
  clearHintHighlight();
  if (target.type === "item") {
    const item = getItem(target.def.id);
    const v = verb || "take";
    if (v === "take") {
      // Forgery/inventory-chain items (Cunning Path): picking up the
      // second piece while already holding the first auto-combines them,
      // rather than requiring a separate drag-and-drop combine step.
      if (item.combinesWith && hasItem(gameState, item.combinesWith)) {
        removeItem(gameState, item.combinesWith);
        addItem(gameState, item.combinesInto);
        if (item.combineFlag) setFlag(gameState, item.combineFlag, true);
        // Cunning Path forgeries are this path's per-location "obstacle"
        // beat — worth the same 20 Grit as the equivalent Partners-path
        // dialogue beat or Nerve-path stunt, so all three paths total the
        // same maximum Grit regardless of which one's chosen.
        addGrit(gameState, 20);
        setSentence(item.combineLine || `The two combine into something more useful.`);
      } else {
        addItem(gameState, item.id);
        setSentence(`You take the ${item.name}.`);
      }
      renderInventory();
      applySetFlagOn(target.def, v);
      checkPrologueComplete();
      return;
    }
    const line = target.def.responses[v] || target.def.responses.look || item.lookLine;
    setSentence(line);
    applySetFlagOn(target.def, v);
    return;
  }
  if (target.type === "hotspot") {
    if (target.def.kind === "exit") {
      const blockedFlag = target.def.requiresFlag && !getFlag(gameState, target.def.requiresFlag);
      const blockedItem = target.def.requiresItem && !hasItem(gameState, target.def.requiresItem);
      if (blockedFlag || blockedItem) {
        setSentence(target.def.lockedLine || "That way's still blocked.");
        return;
      }
      if (target.def.pathChoice) {
        openPathChoice();
        return;
      }
      fallToRoom(target.def.to.room, target.def.to.spawn, target.def.fallCaption);
      return;
    }
    const v = verb || "look";
    if (v === "talk" && target.def.dialogue) {
      startDialogue(target.def.dialogue);
      return;
    }
    const puzzleId = target.def.puzzleOnVerb && target.def.puzzleOnVerb[v];
    if (puzzleId) {
      const def = PUZZLES[puzzleId];
      const flagOk = !target.def.puzzleRequiresFlag || getFlag(gameState, target.def.puzzleRequiresFlag);
      const itemOk = !target.def.puzzleRequiresItem || hasItem(gameState, target.def.puzzleRequiresItem);
      if (def && !getFlag(gameState, def.flagOnSolve) && flagOk && itemOk) {
        openPuzzle(puzzleId, def);
        return;
      }
    }
    const line = resolveResponse(target.def.responses[v], selectedItemId) ?? target.def.responses.default;
    setSentence(line);
    applySetFlagOn(target.def, v);
    return;
  }
}

// ---------- puzzle dispatch ----------
// `type` in data/puzzles.js selects which puzzle engine opens. Adding a
// new puzzle type means adding one case here — every puzzle instance
// itself stays pure data.

function markPuzzleSolved(id, def) {
  setFlag(gameState, def.flagOnSolve, true);
  addGrit(gameState, def.grit || 0);
  if (def.itemReward) {
    addItem(gameState, def.itemReward);
    renderInventory();
  }
  setSentence(def.solvedLine || "Solved.");
  checkAct2Complete();
  checkAct3Complete();
  doAutosave();
}

// A handful of puzzles (data/puzzles.js opts in via `skipGrit`) can be
// skipped outright rather than blocking progress forever — same flag gets
// set so the story moves on, just for a fraction of the Grit and none of
// the solved flavour text.
function markPuzzleSkipped(id, def) {
  setFlag(gameState, def.flagOnSolve, true);
  addGrit(gameState, def.skipGrit || 0);
  setSentence(def.skippedLine || "He leaves it unsolved and moves on anyway.");
  checkAct2Complete();
  checkAct3Complete();
  doAutosave();
}

function openPuzzle(id, def) {
  // Resonance and echo puzzles are solved by ear — the background score
  // fights with the tones/echoes the player is trying to listen for, so
  // duck it for the duration and bring it back once the puzzle closes.
  const needsQuiet = def.type === "resonance" || def.type === "echo";
  if (needsQuiet) music.duck();
  const restoreMusic = () => {
    if (needsQuiet) music.unduck();
  };
  const onClose = () => {
    restoreMusic();
    setSentence("Ready.\n準備就緒。");
  };
  const onSolved = () => {
    restoreMusic();
    markPuzzleSolved(id, def);
  };
  const onSkip = def.skipGrit != null || def.skippedLine
    ? () => {
        restoreMusic();
        markPuzzleSkipped(id, def);
      }
    : undefined;
  if (def.type === "resonance") {
    openResonancePuzzle(overlaysRoot, {
      targets: def.targets,
      targetLabels: def.targetLabels,
      title: def.title,
      flavor: def.flavor,
      onSolved,
      onClose,
    });
  } else if (def.type === "tileSlide") {
    openTileSlidePuzzle(overlaysRoot, {
      size: def.size,
      title: def.title,
      flavor: def.flavor,
      onSolved,
      onClose,
      onSkip,
    });
  } else if (def.type === "echo") {
    openEchoPuzzle(overlaysRoot, {
      chambers: def.chambers,
      correctId: def.correctId,
      delayMs: def.delayMs,
      title: def.title,
      flavor: def.flavor,
      onSolved,
      onClose,
    });
  } else if (def.type === "stunt") {
    openStuntPuzzle(overlaysRoot, {
      title: def.title,
      flavor: def.flavor,
      moves: def.moves,
      sequenceLength: def.sequenceLength,
      windowMs: def.windowMs,
      watchLine: def.watchLine,
      goLine: def.goLine,
      successLine: def.successLine,
      wrongLine: def.wrongLine,
      fumbleLine: def.fumbleLine,
      onSolved: () => markPuzzleSolved(id, def),
      onClose,
    });
  }
}

// ---------- path choice (end of Act 1) ----------

const PATH_START_ROOM = {
  partners: "donanaPartners",
  cunning: "donanaCunning",
  nerve: "donanaNerve",
};

function openPathChoice() {
  pathChoiceUI.show((path) => {
    setPath(gameState, path);
    setFlag(gameState, "act1_complete", true);

    const startRoomId = PATH_START_ROOM[path];
    const departureCaption = {
      partners: "Mo's waiting at the dock, already arguing with a boatman about the fare.",
      cunning: "No sense dragging anyone else into what comes next. Best to travel light, and lie well.",
      nerve: "No boat, no partner, no paperwork — just his own legs and however fast they can move.",
    };
    if (startRoomId) {
      // Built path — walk straight into Act 2 rather than a placeholder card.
      fallToRoom(startRoomId, { x: 900, y: 900, facing: "down" }, departureCaption[path] || "");
      return;
    }

    chapterCardUI.show(
      "End of Act 1",
      [
        `Path chosen: ${path[0].toUpperCase()}${path.slice(1)}.`,
        "Faster to move alone, and easier to run.",
        "This path's Act 2 arrives in a later milestone — the Partners and Cunning paths are playable now if you'd like to see Act 2 in action.",
      ],
      "Continue",
      () => setSentence("Ready.\n準備就緒。")
    );
  });
}

// ---------- room transitions (the Prologue's five-room "fall") ----------

const fadeEl = document.getElementById("transition-fade");

function fadeOut(ms) {
  fadeEl.style.transitionDuration = `${ms}ms`;
  fadeEl.classList.add("show");
  return wait(ms);
}

function fadeIn(ms) {
  fadeEl.style.transitionDuration = `${ms}ms`;
  fadeEl.classList.remove("show");
  return wait(ms);
}

async function fallToRoom(nextRoomId, spawn, caption) {
  cutsceneActive = true;
  playTransitionChime();
  await shake(200);
  await fadeOut(320);
  clearHintHighlight();
  room = ROOMS[nextRoomId];
  gameState.roomId = nextRoomId;
  const theme = ROOM_THEMES[nextRoomId];
  if (theme) music.playTrack(theme);
  actor.x = spawn.x;
  actor.y = spawn.y;
  actor.targetX = spawn.x;
  actor.targetY = spawn.y;
  actor.facing = spawn.facing || "down";
  actor.moving = false;
  pendingAction = null;
  hoveredTarget = null;
  if (caption) setSentence(caption);
  await fadeIn(320);
  cutsceneActive = false;
  const arrivalCutscene = ROOM_ARRIVAL_CUTSCENES[nextRoomId];
  if (arrivalCutscene && !getFlag(gameState, `cs_ran_${arrivalCutscene}`)) {
    await playCutscene(arrivalCutscene);
  }
  doAutosave();
}

// ---------- Prologue completion ----------

function checkPrologueComplete() {
  if (getFlag(gameState, "prologue_complete")) return;
  if (!getFlag(gameState, "found_chart")) return;
  playCutscene("prologue_end").then(() => {
    playChapterEndChime();
    chapterCardUI.show(
      "End of the Prologue",
      [
        "The trail out of Barnett College ends with a chart, three anchorages, and more questions than answers.",
        "Next: Lisbon, Portugal.",
        "The street grate stairwell is open when you're ready to go.",
      ],
      "Continue",
      () => setSentence("Ready.\n準備就緒。")
    );
  });
}

function checkAct2Complete() {
  if (gameState.path === "partners") checkAct2PartnersComplete();
  else if (gameState.path === "cunning") checkAct2CunningComplete();
  else if (gameState.path === "nerve") checkAct2NerveComplete();
}

function checkAct2PartnersComplete() {
  if (getFlag(gameState, "act2_partners_complete")) return;
  const gotAll =
    getFlag(gameState, "salt_conch_found") &&
    getFlag(gameState, "storm_fork_found") &&
    getFlag(gameState, "star_bell_found");
  if (!gotAll) return;
  setFlag(gameState, "act2_partners_complete", true);
  setFlag(gameState, "act2_complete", true);
  playChapterEndChime();
  chapterCardUI.show(
    "End of Act 2 — Partners Path",
    [
      "Three voices, three continents, and Mo hasn't once let him carry his own gear.",
      "The Salt Conch, the Storm Fork, and the Star Bell — the chord is complete. Somewhere, something is listening back.",
      "One way left to go: down, into whatever's waiting at the bottom of the water.",
    ],
    "Continue",
    () => setSentence("Ready.\n準備就緒。")
  );
}

function checkAct2CunningComplete() {
  if (getFlag(gameState, "act2_cunning_complete")) return;
  const gotAll =
    getFlag(gameState, "salt_conch_found") &&
    getFlag(gameState, "storm_fork_found") &&
    getFlag(gameState, "star_bell_found");
  if (!gotAll) return;
  setFlag(gameState, "act2_cunning_complete", true);
  setFlag(gameState, "act2_complete", true);
  playChapterEndChime();
  chapterCardUI.show(
    "End of Act 2 — Cunning Path",
    [
      "Three voices, three continents, and not one honest conversation in any of them.",
      "The Salt Conch, the Storm Fork, and the Star Bell — the chord is complete, and the Consortium doesn't even know it's gone.",
      "One way left to go: down, into whatever's waiting at the bottom of the water.",
    ],
    "Continue",
    () => setSentence("Ready.\n準備就緒。")
  );
}

function checkAct2NerveComplete() {
  if (getFlag(gameState, "act2_nerve_complete")) return;
  const gotAll =
    getFlag(gameState, "salt_conch_found") &&
    getFlag(gameState, "storm_fork_found") &&
    getFlag(gameState, "star_bell_found");
  if (!gotAll) return;
  setFlag(gameState, "act2_nerve_complete", true);
  setFlag(gameState, "act2_complete", true);
  playChapterEndChime();
  chapterCardUI.show(
    "End of Act 2 — Nerve Path",
    [
      "Three voices, three continents, and not one clean landing in any of them.",
      "The Salt Conch, the Storm Fork, and the Star Bell — the chord is complete, and Ferro's still picking gravel out of his knuckles.",
      "One way left to go: down, into whatever's waiting at the bottom of the water.",
    ],
    "Continue",
    () => setSentence("Ready.\n準備就緒。")
  );
}

// ---------- Act 3: The Caldera ----------

function checkAct3Complete() {
  if (getFlag(gameState, "game_complete")) return;
  if (!getFlag(gameState, "drowned_bell_awakened")) return;
  setFlag(gameState, "game_complete", true);
  addGrit(gameState, 100);
  playCutscene("bell_awakens").then(() => {
    playChapterEndChime();
    music.playTrack("title");
    const epilogueByPath = {
      partners:
        "Mo's already sketching the chamber from memory, insisting nobody at Cambridge will believe a word of this without her notes — and she started taking them before the light even settled.",
      cunning:
        "A forged permit, a forged disguise, a forged requisition — and not one forgery in the world explains what's happening at the bottom of this chamber. For once, that seems to be exactly the point.",
      nerve:
        "The boardwalk, the tram, Ferro's crate — every bruise between Doñana and the dockyard, and not one of them for nothing.",
    };
    const epilogue = epilogueByPath[gameState.path] || "The chord is complete, and Atlantis, for one held breath, was not a legend.";
    creditsUI.show(
      identity,
      [
        "Design &amp; Programming — Dad<br>設計與程式 — 爸爸",
        "Story, Art &amp; Music — Dad<br>故事、美術與音樂 — 爸爸",
        epilogue,
        `Final Grit Rating: ${gameState.grit} — ${gritTitle(gameState.grit)}<br>最終分數：${gameState.grit} — ${gritTitle(gameState.grit)}`,
      ],
      () => setSentence("The End.\n完。")
    );
  });
}

// ---------- verb panel (desktop) ----------

const verbPanel = document.getElementById("verb-panel");
VERBS.forEach((v) => {
  const btn = document.createElement("button");
  btn.className = "verb-btn";
  btn.textContent = v.label;
  btn.dataset.verb = v.id;
  btn.addEventListener("click", () => toggleVerb(v.id));
  verbPanel.appendChild(btn);
});

function toggleVerb(id) {
  selectedVerb = selectedVerb === id ? null : id;
  [...verbPanel.children].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.verb === selectedVerb);
  });
}

// ---------- inventory panel (desktop grid + mobile drawer) ----------

const invPanel = document.getElementById("inventory-panel");
const invDrawer = document.getElementById("inventory-drawer");
const invHandle = document.getElementById("inventory-drawer-handle");

invHandle.addEventListener("click", () => invDrawer.classList.toggle("open"));

function makeInvSlot(id) {
  const item = getItem(id);
  const slot = document.createElement("div");
  slot.className = "inv-slot";
  if (id === selectedItemId) slot.classList.add("selected");
  slot.title = item.name;
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const cctx = c.getContext("2d");
  cctx.translate(20, 20);
  item.drawIcon(cctx, 34);
  slot.appendChild(c);
  slot.addEventListener("click", () => {
    selectedItemId = selectedItemId === id ? null : id;
    renderInventory();
    setSentence(item.lookLine);
  });
  return slot;
}

function renderInventory() {
  if (selectedItemId && !hasItem(gameState, selectedItemId)) selectedItemId = null;
  invPanel.innerHTML = "";
  invDrawer.innerHTML = "";
  gameState.inventory.forEach((id) => {
    invPanel.appendChild(makeInvSlot(id));
    invDrawer.appendChild(makeInvSlot(id));
  });
}
renderInventory();

// ---------- overlays: dialogue, journal, pause/save, credits, hints ----------

const overlaysRoot = document.getElementById("overlays");
const dialogueUI = createDialogueUI(overlaysRoot);
const journalUI = createJournalUI(overlaysRoot);
const pauseUI = createPauseMenuUI(overlaysRoot);
const creditsUI = createCreditsUI(document.body);
const chapterCardUI = createChapterCardUI(document.body);
const pathChoiceUI = createPathChoiceUI(document.body);
const signInGateUI = createSignInGateUI(document.body);
const hintToast = createHintToast(overlaysRoot);

const dialogueRunner = createDialogueRunner(flagApi);
const hintTracker = createHintTracker(flagApi);

// Third-stage ("solution") hints additionally draw a temporary highlight
// over the actual hotspot/item they describe, reusing the same dashed
// outline the renderer already draws on hover (see engine/renderer.js).
let hintHighlightPolygon = null;
let hintHighlightExpiresAt = 0;

function clearHintHighlight() {
  hintHighlightPolygon = null;
  hintHighlightExpiresAt = 0;
}

function resolveHintTarget(goalId) {
  const spec = HINT_TARGETS[goalId];
  if (!spec || room.id !== spec.room) return null;
  for (const entry of spec.targets) {
    const id = typeof entry === "string" ? entry : entry.id;
    const unless = typeof entry === "string" ? null : entry.unless;
    if (unless && getFlag(gameState, unless)) continue;
    const item = room.items.find((it) => it.id === id);
    if (item) {
      if (hasItem(gameState, id)) continue;
      const full = getItem(id);
      if (full?.combinesInto && hasItem(gameState, full.combinesInto)) continue;
      return item.polygon;
    }
    const hs = room.hotspots.find((h) => h.id === id);
    if (hs) {
      if (hs.hideWhenFlag && getFlag(gameState, hs.hideWhenFlag)) continue;
      return hs.polygon;
    }
  }
  return null;
}

// Every exit hotspot in every room is gated by requiresFlag/requiresItem
// (and sometimes hideWhenFlag once used) — there's no room in this game
// with an always-open exit — so "an exit here just became reachable" only
// fires once its room's own task is genuinely finished. Used by showHint()
// below for the moment right after that: the player is still standing in
// the room whose objective they just cleared (e.g. the shelf's pushed, but
// they haven't walked into the boiler room yet), so the NEXT undone goal
// in story order belongs to a room they haven't set foot in yet.
function findReachableExit() {
  return room.hotspots.find((hs) => {
    if (hs.kind !== "exit") return false;
    if (hs.hideWhenFlag && getFlag(gameState, hs.hideWhenFlag)) return false;
    if (hs.requiresFlag && !getFlag(gameState, hs.requiresFlag)) return false;
    if (hs.requiresItem && !hasItem(gameState, hs.requiresItem)) return false;
    return true;
  });
}

function showHint() {
  const goals = computeGoals(GOALS, gameState.flags);
  const undoneGoals = goals.filter((g) => !g.done);
  if (!undoneGoals.length) {
    hintToast.show(
      "Nothing to nudge you toward right now — you're all caught up.\n目前沒有可以提示的事——你已經跟上進度了。"
    );
    clearHintHighlight();
    return;
  }
  // Goal order in data/journal.js follows the story's usual sequence, but a
  // player who backtracks to an earlier room can still have a later goal
  // sitting "undone" ahead of it in that list. Prefer whichever undone goal
  // is actually about the room Indy is standing in right now, so the hint
  // describes THIS scene, not a scene further down the checklist.
  const inRoom = undoneGoals.find((g) => HINT_TARGETS[g.id]?.room === room.id);
  if (!inRoom) {
    // Nothing undone is set in this room — most often because its own task
    // just finished and the next objective lives one room over. Point at
    // the now-open exit instead of describing a scene not yet reached.
    const exit = findReachableExit();
    if (exit) {
      hintToast.show(`Nothing left for him here — ${exit.name || "the way out"} is open now.`);
      hintHighlightPolygon = exit.polygon;
      hintHighlightExpiresAt = performance.now() + 6000;
      return;
    }
  }
  const undone = inRoom || undoneGoals[0];
  const stages = HINTS[undone.id];
  const stageBefore = getFlag(gameState, `hint_stage_${undone.id}`) || 0;
  const isSolutionStage = !!stages?.length && stageBefore % stages.length === stages.length - 1;
  hintToast.show(hintTracker.next(undone.id, HINTS));
  const polygon = isSolutionStage ? resolveHintTarget(undone.id) : null;
  if (polygon) {
    hintHighlightPolygon = polygon;
    hintHighlightExpiresAt = performance.now() + 6000;
  } else {
    clearHintHighlight();
  }
}

// On-screen Menu/Hint buttons — the only way into the pause menu (Save,
// Load, Journal) or the hint system on a touch device, since there's no
// keyboard there for Space/J/H.
const menuButton = document.getElementById("menu-button");
const hintButton = document.getElementById("hint-button");
menuButton.addEventListener("click", () => {
  if (dialogueUI.isVisible() || chapterCardUI.isVisible()) return;
  if (pauseUI.isVisible()) {
    pauseUI.hide();
    paused = false;
  } else {
    openPauseMenu();
  }
});
hintButton.addEventListener("click", () => {
  if (inputBlocked()) return;
  showHint();
});

function refreshDialogueUI() {
  if (!dialogueRunner.isActive()) {
    dialogueUI.hide();
    return;
  }
  dialogueUI.show(
    dialogueRunner.currentNpcName(),
    dialogueRunner.currentLine(),
    dialogueRunner.currentOptions(),
    onSelectDialogueOption,
    dialogueRunner.currentMood()
  );
}

function startDialogue(treeId) {
  const tree = DIALOGUES[treeId];
  if (!tree) return;
  const cutscene = dialogueRunner.start(tree);
  refreshDialogueUI();
  if (cutscene) {
    dialogueUI.hide();
    playCutscene(cutscene).then(() => {
      if (dialogueRunner.isActive()) refreshDialogueUI();
    });
  }
}

function onSelectDialogueOption(optId) {
  const result = dialogueRunner.selectOption(optId);
  if (result.ended) {
    dialogueUI.hide();
    if (result.cutscene) playCutscene(result.cutscene);
    return;
  }
  if (result.cutscene) {
    dialogueUI.hide();
    playCutscene(result.cutscene).then(() => {
      if (dialogueRunner.isActive()) refreshDialogueUI();
    });
    return;
  }
  refreshDialogueUI();
}

function openJournal() {
  journalUI.show(computeGoals(GOALS, gameState.flags), computeCodex(CODEX, gameState.flags));
}

function toggleJournal() {
  if (journalUI.isVisible()) journalUI.hide();
  else openJournal();
}

// ---------- cutscenes ----------

function wait(ms) {
  if (!ms) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function walkActorTo(x, y, skip) {
  return new Promise((resolve) => {
    setWalkTarget(x, y);
    if (skip) {
      actor.x = actor.targetX;
      actor.y = actor.targetY;
      actor.moving = false;
      resolve();
      return;
    }
    const check = () => {
      if (!actor.moving) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
}

let shakeUntil = 0;
function shake(ms) {
  shakeUntil = performance.now() + ms;
  return wait(ms);
}

function currentCameraOffset() {
  if (!ms_active()) return { x: 0, y: 0 };
  const mag = 10;
  return { x: (Math.random() - 0.5) * mag, y: (Math.random() - 0.5) * mag };
}
function ms_active() {
  return performance.now() < shakeUntil;
}

const cutsceneCtx = {
  walkActorTo,
  say(speaker, text, ms) {
    setSentence(speaker ? `${speaker}: ${text}` : text);
    return wait(ms);
  },
  wait,
  shake,
  setFlag: (k, v) => setFlag(gameState, k, v),
  playSfx: () => Promise.resolve(), // real audio arrives with the Tone.js milestone
  showSkipOverlay(onSkip) {
    return createSkipOverlay(overlaysRoot, onSkip);
  },
  hideSkipOverlay(overlay) {
    removeSkipOverlay(overlay);
  },
};

async function playCutscene(id) {
  const steps = CUTSCENES[id];
  if (!steps) return;
  cutsceneActive = true;
  await runCutscene(steps, cutsceneCtx);
  setFlag(gameState, `cs_ran_${id}`, true);
  cutsceneActive = false;
}

// ---------- save / load ----------

function syncActorToState() {
  gameState.actor = { x: actor.x, y: actor.y, facing: actor.facing };
  gameState.roomId = room.id;
}

// The pause menu has always shown an "Autosave" slot, but nothing ever
// actually wrote to it — every save required the player to open the menu
// and press Save by hand. This is the real autosave: fired at natural
// checkpoints (arriving in a new room, solving a puzzle) so progress is
// never lost to forgetting to save, regardless of whether the player is
// signed in — signing in only adds the cloud copy on top of the same
// local write.
function doAutosave() {
  syncActorToState();
  saveToSlot(AUTOSAVE_ID, gameState);
  cloudSaveSlot(AUTOSAVE_ID, gameState);
}

function applyLoadedState(data) {
  Object.assign(gameState, data);
  gameState.actor = { ...gameState.actor, ...(data.actor || {}) };
  clearHintHighlight();
  room = ROOMS[gameState.roomId] || room;
  const theme = ROOM_THEMES[room.id];
  if (theme) music.playTrack(theme);
  actor.x = gameState.actor.x;
  actor.y = gameState.actor.y;
  actor.targetX = actor.x;
  actor.targetY = actor.y;
  actor.moving = false;
  actor.facing = gameState.actor.facing;
  pendingAction = null;
  renderInventory();
  setSentence("Loaded.\n讀取完成。");
}

function openPauseMenu() {
  paused = true;
  const slots = listSlots();
  const user = getCurrentUser();
  pauseUI.show(
    slots,
    {
      onSave(id) {
        // Write locally first, then sync to the cloud (debounced) — per
        // the design doc, local is always the source of truth for "did
        // this save happen," cloud is best-effort on top of it.
        syncActorToState();
        saveToSlot(id, gameState);
        cloudSaveSlot(id, gameState);
        openPauseMenu(); // refresh the timestamps shown
      },
      async onLoad(id) {
        let data = null;
        if (getCurrentUser()) data = await cloudLoadSlot(id);
        if (!data) data = loadFromSlot(id);
        if (data && validateState(data)) applyLoadedState(data);
        pauseUI.hide();
        paused = false;
      },
      onResume() {
        pauseUI.hide();
        paused = false;
      },
      onJournal() {
        pauseUI.hide();
        paused = false;
        openJournal();
      },
      onNewGame() {
        const ok = window.confirm(
          "Start a brand new game? Progress in this session that hasn't been saved to a Case File will be lost.\n\n開始新遊戲？本次遊戲中尚未存入案件檔案的進度將會遺失。"
        );
        if (!ok) return;
        pauseUI.hide();
        paused = false;
        applyLoadedState(createGameState());
        playIntro();
      },
    },
    {
      available: firebaseReady,
      user,
      gritTotal: gameState.grit,
      gritTitle: gritTitle(gameState.grit),
      async onSignIn() {
        const signedInUser = await signInWithGoogle();
        refreshOfflineBadge();
        if (signedInUser) openPauseMenu();
      },
      async onSignOut() {
        await signOutUser();
        refreshOfflineBadge();
        openPauseMenu();
      },
    },
    {
      muted: music.isMuted(),
      volume: music.getVolume(),
      onToggleMute() {
        music.toggleMuted();
        openPauseMenu();
      },
      onVolumeChange(v) {
        music.setVolume(v);
      },
    }
  );
}

// ---------- radial verb coin (touch long-press) ----------

const radialMenu = document.getElementById("radial-menu");
let radialTarget = null;
let radialCenter = null;
let radialHot = null;

function openRadial(sx, sy, target) {
  radialTarget = target;
  // The coin's items reach 90px (radius) + 32px (their own half-width) out
  // from its center in every direction — clamp the center so that full
  // reach stays on-screen instead of getting cut off near an edge, which
  // otherwise makes some verbs impossible to reach with a finger near the
  // side of a phone screen.
  const reach = 125;
  const cx = Math.min(Math.max(sx, reach), window.innerWidth - reach);
  const cy = Math.min(Math.max(sy, reach), window.innerHeight - reach);
  radialCenter = { sx: cx, sy: cy };
  radialHot = null;
  radialMenu.innerHTML = "";
  radialMenu.style.left = `${cx}px`;
  radialMenu.style.top = `${cy}px`;
  const radius = 90;
  VERBS.forEach((v, i) => {
    const angle = (-90 + i * (360 / VERBS.length)) * (Math.PI / 180);
    const item = document.createElement("div");
    item.className = "radial-item";
    item.textContent = v.previewLabel;
    item.style.left = `${110 + radius * Math.cos(angle)}px`;
    item.style.top = `${110 + radius * Math.sin(angle)}px`;
    item.dataset.verb = v.id;
    radialMenu.appendChild(item);
  });
  radialMenu.classList.add("open");
}

function updateRadial(sx, sy) {
  if (!radialCenter) return;
  const dx = sx - radialCenter.sx;
  const dy = sy - radialCenter.sy;
  if (Math.hypot(dx, dy) < 20) {
    radialHot = null;
  } else {
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const norm = (angle + 90 + 360) % 360;
    const idx = Math.round(norm / (360 / VERBS.length)) % VERBS.length;
    radialHot = VERBS[idx].id;
  }
  [...radialMenu.children].forEach((el) => {
    el.classList.toggle("hot", el.dataset.verb === radialHot);
  });
}

function closeRadial(execute) {
  radialMenu.classList.remove("open");
  if (execute && radialHot && radialTarget) {
    requestAction(radialHot, radialTarget);
  }
  radialTarget = null;
  radialCenter = null;
  radialHot = null;
}

// ---------- input wiring ----------

attachInput(canvas, {
  onTap(x, y) {
    if (inputBlocked()) return;
    const target = getTargetAt(x, y);
    if (!target) {
      setSentence("Nothing to do there.\n這裡沒什麼好做的。");
      return;
    }
    requestAction(selectedVerb || effectiveVerbFor(target), target);
  },
  onSmartTap(x, y) {
    if (inputBlocked()) return;
    const target = getTargetAt(x, y);
    if (!target) return;
    requestAction(effectiveVerbFor(target), target);
  },
  onDoubleTap(x, y) {
    if (inputBlocked()) return;
    const target = getTargetAt(x, y);
    if (!target) return;
    requestAction(effectiveVerbFor(target), target, true);
  },
  onHover(x, y) {
    if (x === null) {
      hoveredTarget = null;
      return;
    }
    if (inputBlocked()) return;
    const target = getTargetAt(x, y);
    hoveredTarget = target && target.type !== "floor" ? target : null;
    if (target) setSentence(previewFor(target, selectedVerb || effectiveVerbFor(target)));
  },
  onLongPress(x, y, sx, sy) {
    if (inputBlocked()) return;
    const target = getTargetAt(x, y);
    if (!target || target.type === "floor") return;
    openRadial(sx, sy, target);
  },
  onTouchMove(x, y, sx, sy) {
    updateRadial(sx, sy);
  },
  onLongPressEnd() {
    closeRadial(true);
  },
  onKey(key) {
    if (key === "escape") {
      closeRadial(false);
      if (journalUI.isVisible()) journalUI.hide();
      else if (pauseUI.isVisible()) {
        pauseUI.hide();
        paused = false;
      }
      return;
    }
    if (key === " ") {
      if (dialogueUI.isVisible() || chapterCardUI.isVisible()) return;
      if (pauseUI.isVisible()) {
        pauseUI.hide();
        paused = false;
      } else {
        openPauseMenu();
      }
      return;
    }
    if (key === "j") {
      if (dialogueUI.isVisible() || pauseUI.isVisible() || chapterCardUI.isVisible()) return;
      toggleJournal();
      return;
    }
    if (inputBlocked()) return;
    if (key === "i") {
      setSentence(
        `Grit Rating: ${gameState.grit} — ${gritTitle(gameState.grit)}\n分數：${gameState.grit} — ${gritTitle(gameState.grit)}`
      );
      return;
    }
    if (key === "h") {
      showHint();
      return;
    }
    if (key === "c" && devToolsEnabled) {
      // Dev-only credits preview. The real trigger is the ending screen,
      // wired up in Milestone 10 — the dedication text is identical either way.
      const returnTrack = ROOM_THEMES[room.id] || "barnett";
      music.playTrack("title");
      creditsUI.show(
        identity,
        [
          "Design &amp; Programming — Dad",
          "Story, Art &amp; Music — Dad",
          "(placeholder crew list — the real credits crawl arrives with the ending)",
        ],
        () => music.playTrack(returnTrack)
      );
      return;
    }
    const verbDef = VERBS.find((v) => v.key === key);
    if (verbDef) toggleVerb(verbDef.id);
  },
});

// ---------- loop ----------

function update(dt) {
  if (paused) return;
  if (actor.moving) {
    const d = distance(actor.x, actor.y, actor.targetX, actor.targetY);
    const step = actor.speed * dt;
    if (d <= step) {
      actor.x = actor.targetX;
      actor.y = actor.targetY;
      actor.moving = false;
      if (pendingAction) {
        runAction(pendingAction.verb, pendingAction.target);
        pendingAction = null;
      }
    } else {
      const t = step / d;
      const dx = actor.targetX - actor.x;
      actor.x += dx * t;
      actor.y += (actor.targetY - actor.y) * t;
      actor.facing = dx > 0.5 ? "right" : dx < -0.5 ? "left" : actor.facing;
    }
  }
}

function draw() {
  render({
    room,
    actor,
    hoveredHotspot: hoveredTarget ? hoveredTarget.def : null,
    hintHighlight: hintHighlightPolygon && performance.now() < hintHighlightExpiresAt ? hintHighlightPolygon : null,
    debug: false,
    cameraOffset: currentCameraOffset(),
    state: gameState,
  });
}

const loop = createLoop(update, draw);

// ---------- tap-to-begin gate ----------

const tapGate = document.getElementById("tap-gate");

// Shown once, the very first time anyone plays (gated on a flag saved with
// everything else, so a returning player who loads a save never sees it
// again). Kids landing cold in the gallery with an empty crate and a hole
// in the floor had no idea who they were playing or why any of it
// mattered — this fills in the who/what/why in plain language, then walks
// through the actual controls before handing control over.
function showCard(title, lines, buttonText) {
  return new Promise((resolve) => {
    chapterCardUI.show(title, lines, buttonText, resolve);
  });
}

async function playIntro() {
  await showCard(
    "Who You Are<br>你是誰",
    [
      "You're Indiana Jones. Archaeologist, professor, occasional target of large rolling objects.<br>你是印第安納瓊斯。考古學家、教授，偶爾會被巨大的滾動物體盯上。",
      "Barnett College pays you to teach. The world keeps handing you better reasons not to.<br>巴奈特學院付錢請你教書。但這個世界老是找到更好的理由，讓你沒空教書。",
    ],
    "Next\n下一步"
  );
  await showCard(
    "What Happened Tonight<br>今晚發生的事",
    [
      "Someone broke into the college museum, cracked open a sealed crate, and vanished through a hole in the floor.<br>有人闖進學院博物館，撬開一只密封的木箱，然後從地板上的一個洞消失無蹤。",
      "Whatever was inside it rang loud enough to crack every window in the hall.<br>箱子裡的東西發出的聲響，大到把整間大廳的窗戶都震裂了。",
      "They left in a hurry. You're about to find out why.<br>他們走得很匆忙。你即將發現原因。",
    ],
    "Next\n下一步"
  );
  await showCard(
    "Your Mission<br>你的任務",
    [
      "The thieves have a head start. You have a hat, a whip, and no patience for waiting.<br>竊賊已經搶先一步。你有一頂帽子、一條鞭子，還有毫無耐性等待的個性。",
      "Somewhere out there is the truth about the Drowned Bell of Atlantis — and you intend to get there first.<br>在某個地方，藏著關於「亞特蘭提斯沉鐘」的真相——你打算搶先一步找到它。",
      "Ready? Good. Nobody else is.<br>準備好了嗎？很好。反正也沒有別人準備好。",
    ],
    "Next\n下一步"
  );
  await showCard(
    "How to Play<br>操作說明",
    [
      "Tap or click the floor to walk there.<br>點擊地板即可走到該處。",
      "Tap or click something you see — like a crate or a door — to look at it.<br>點擊畫面中的物品——例如木箱或門——即可查看。",
      "Pick an action first (Look, Take, Use, Talk...), then tap the thing you want to use it on.<br>先選擇一個動作（看、拿、使用、說話……），再點擊你想對它使用的物品。",
      "Stuck? Tap the ? button any time for a hint.<br>卡關了嗎？隨時點擊 ? 按鈕取得提示。",
      "Tap ☰ to open the menu — save your game, or check your Journal for goals.<br>點擊 ☰ 開啟選單——儲存遊戲，或查看日誌中的目標。",
    ],
    "Let's Go!\n開始遊戲！"
  );
  setFlag(gameState, "intro_seen", true);
  setSentence("Ready.\n準備就緒。");
}

function startGame() {
  unlockAudio();
  music.unlock();
  music.playTrack(ROOM_THEMES[room.id] || "barnett");
  loop.start();
  if (getFlag(gameState, "intro_seen")) {
    setSentence("Ready.\n準備就緒。");
  } else {
    playIntro();
  }
  // Safety-net autosave on top of the room-transition/puzzle-solve ones,
  // for a player who stays in one room a long time (a lot of dialogue, or
  // just poking around) between those checkpoints.
  setInterval(doAutosave, 60000);
}

let beginStarted = false;

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
}

function begin() {
  if (beginStarted) return;
  beginStarted = true;

  // Wait to actually know the sign-in state before deciding whether to
  // show the gate, so a returning signed-in player doesn't see it flash
  // up before their session is restored — capped so a slow connection
  // can never leave the tap gate stuck.
  withTimeout(authStateSettled, 2500).then(() => {
    tapGate.style.display = "none";

    if (getCurrentUser()) {
      startGame();
      return;
    }

    signInGateUI.show({
      cloudPending: !firebaseReady,
      onSignIn: async () => {
        signInGateUI.hide();
        startGame();
        await signInWithGoogle();
      },
      onContinueOffline: () => {
        signInGateUI.hide();
        startGame();
      },
    });
  });
}
tapGate.addEventListener("click", begin);
tapGate.addEventListener("touchend", (e) => {
  e.preventDefault();
  begin();
});

// DEV HOOK — QA introspection, gated out of the public build (see
// devToolsEnabled above). Never shown or hinted at in-game.
if (devToolsEnabled) {
  window.__debug = {
    getRoomId: () => room.id,
    getFlags: () => ({ ...gameState.flags }),
    getInventory: () => [...gameState.inventory],
    getActor: () => ({ x: actor.x, y: actor.y, moving: actor.moving }),
    setFlag: (k, v = true) => setFlag(gameState, k, v),
    setPathDebug: (p) => setPath(gameState, p),
    jumpToRoom: (id, x = 900, y = 900) => {
      clearHintHighlight();
      room = ROOMS[id] || room;
      gameState.roomId = room.id;
      actor.x = x;
      actor.y = y;
      actor.targetX = x;
      actor.targetY = y;
      actor.moving = false;
      const theme = ROOM_THEMES[room.id];
      if (theme) music.playTrack(theme);
    },
    triggerHint: () => showHint(),
    getHintHighlight: () =>
      hintHighlightPolygon && performance.now() < hintHighlightExpiresAt ? hintHighlightPolygon : null,
    getMusicTrack: () => music.currentTrackKey(),
  };
}

#!/usr/bin/env node
// test/solvability.mjs
//
// A static solvability check over the game's own data — no browser, no
// DOM, no build step, just importing the same room/puzzle/item/dialogue
// modules the game ships and walking them as a graph. It answers two
// questions for every one of the three Act 2 paths (Partners, Cunning,
// Nerve):
//
//   1. Is `game_complete` reachable at all? (no soft-lock: every
//      requiresFlag/requiresItem gate has some way to be satisfied)
//   2. Does every room the game defines get visited by at least one path?
//      (no orphaned room nobody's exit ever points to)
//
// It's deliberately optimistic (a "does there exist a solve" check, not a
// hint system) — dialogue `forbidsFlag` gates are ignored, since a real
// player can usually reorder actions to avoid tripping one. That's a
// reasonable trade: a false "solvable" here is a rare edge case; a false
// "broken" wastes CI time on every push. What it does catch, reliably: a
// typo'd flag/item/room/dialogue/puzzle id, or a gate nothing in the game
// ever satisfies.
//
// Run: node test/solvability.mjs

import { ROOMS } from "../docs/data/rooms/index.js";
import { PUZZLES } from "../docs/data/puzzles.js";
import { ITEMS } from "../docs/data/items.js";
import { leafpoolDialogue } from "../docs/data/dialogue/leafpool.js";
import { fadoDialogue } from "../docs/data/dialogue/fado.js";
import { draghiDialogue, draghiCalderaDialogue } from "../docs/data/dialogue/draghi.js";
import { moDonanaDialogue, moSaharaDialogue, moBiminiDialogue } from "../docs/data/dialogue/mo.js";
import { foremanBiminiDialogue } from "../docs/data/dialogue/foreman.js";
import { ferroBiminiDialogue } from "../docs/data/dialogue/ferro.js";

const DIALOGUES = {
  [leafpoolDialogue.id]: leafpoolDialogue,
  [fadoDialogue.id]: fadoDialogue,
  [draghiDialogue.id]: draghiDialogue,
  [draghiCalderaDialogue.id]: draghiCalderaDialogue,
  [moDonanaDialogue.id]: moDonanaDialogue,
  [moSaharaDialogue.id]: moSaharaDialogue,
  [moBiminiDialogue.id]: moBiminiDialogue,
  [foremanBiminiDialogue.id]: foremanBiminiDialogue,
  [ferroBiminiDialogue.id]: ferroBiminiDialogue,
};

const PATH_START_ROOM = {
  partners: "donanaPartners",
  cunning: "donanaCunning",
  nerve: "donanaNerve",
};

const START_ROOM = "gallery";

let failures = [];
function fail(msg) {
  failures.push(msg);
}

// ---------- static reference checks (typos, dangling ids) ----------

function checkStaticReferences() {
  for (const [roomId, room] of Object.entries(ROOMS)) {
    for (const hs of room.hotspots || []) {
      if (hs.dialogue && !DIALOGUES[hs.dialogue]) {
        fail(`${roomId}.${hs.id}: dialogue "${hs.dialogue}" is not a registered dialogue tree`);
      }
      if (hs.puzzleOnVerb) {
        for (const puzzleId of Object.values(hs.puzzleOnVerb)) {
          if (!PUZZLES[puzzleId]) fail(`${roomId}.${hs.id}: puzzleOnVerb references unknown puzzle "${puzzleId}"`);
        }
      }
      if (hs.requiresItem && !ITEMS[hs.requiresItem]) {
        fail(`${roomId}.${hs.id}: requiresItem "${hs.requiresItem}" is not a registered item`);
      }
      if (hs.puzzleRequiresItem && !ITEMS[hs.puzzleRequiresItem]) {
        fail(`${roomId}.${hs.id}: puzzleRequiresItem "${hs.puzzleRequiresItem}" is not a registered item`);
      }
      if (hs.kind === "exit" && hs.to && !hs.pathChoice && !ROOMS[hs.to.room]) {
        fail(`${roomId}.${hs.id}: exit targets unknown room "${hs.to.room}"`);
      }
    }
    for (const it of room.items || []) {
      if (!ITEMS[it.id]) fail(`${roomId} item "${it.id}" is not registered in data/items.js`);
      if (it.combinesWith && !ITEMS[it.combinesWith]) {
        fail(`${roomId} item "${it.id}": combinesWith unknown item "${it.combinesWith}"`);
      }
      if (it.combinesInto && !ITEMS[it.combinesInto]) {
        fail(`${roomId} item "${it.id}": combinesInto unknown item "${it.combinesInto}"`);
      }
    }
  }
  for (const [puzzleId, def] of Object.entries(PUZZLES)) {
    if (def.itemReward && !ITEMS[def.itemReward]) {
      fail(`puzzle "${puzzleId}": itemReward "${def.itemReward}" is not a registered item`);
    }
  }
}

// ---------- dialogue reachability ----------
// Which flags can a reachable dialogue tree set, given what's obtained so
// far? BFS over nodes, following options whose requiresFlag/requiresItem
// are already satisfied (forbidsFlag intentionally ignored — see header).

function dialogueReachableFlags(tree, flags, items) {
  const setFlags = new Set();
  const visited = new Set();
  const queue = [tree.start];
  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    const node = tree.nodes[id];
    if (!node) continue;
    if (node.setFlag) setFlags.add(node.setFlag);
    for (const opt of node.options || []) {
      if (opt.requiresFlag && !flags.has(opt.requiresFlag)) continue;
      if (opt.requiresItem && !items.has(opt.requiresItem)) continue;
      if (opt.goto) queue.push(opt.goto);
    }
  }
  return setFlags;
}

// ---------- per-path fixed-point simulation ----------

function simulatePath(path) {
  const rooms = new Set([START_ROOM]);
  const flags = new Set();
  const items = new Set();

  function hotspotActive(hs) {
    return !hs.hideWhenFlag || !flags.has(hs.hideWhenFlag);
  }

  let changed = true;
  while (changed) {
    changed = false;
    const add = (set, val) => {
      if (!set.has(val)) {
        set.add(val);
        changed = true;
      }
    };

    // Derived flags the engine computes from other flags (see
    // engine/main.js checkPrologueComplete / checkAct2Complete /
    // checkAct3Complete) rather than storing directly on any hotspot.
    if (flags.has("found_chart")) add(flags, "prologue_complete");
    if (flags.has("salt_conch_found") && flags.has("storm_fork_found") && flags.has("star_bell_found")) {
      add(flags, "act2_complete");
      add(flags, `act2_${path}_complete`);
    }
    if (flags.has("drowned_bell_awakened")) add(flags, "game_complete");

    for (const roomId of [...rooms]) {
      const room = ROOMS[roomId];
      if (!room) continue;

      for (const it of room.items || []) {
        if (items.has(it.id)) continue;
        // combinesWith/combinesInto/combineFlag live on the master item
        // definition (data/items.js), not the room-local item instance —
        // same as the real engine's `getItem(target.def.id)` lookup.
        const full = ITEMS[it.id] || {};
        if (full.combinesWith && items.has(full.combinesWith)) {
          add(items, full.combinesInto);
          if (full.combineFlag) add(flags, full.combineFlag);
        } else if (!full.combinesWith || !items.has(full.combinesInto || "")) {
          add(items, it.id);
        }
        if (it.setFlagOn?.take) add(flags, it.setFlagOn.take);
      }

      for (const hs of room.hotspots || []) {
        if (!hotspotActive(hs)) continue;

        // Any setFlagOn on any verb is assumed reachable once the
        // hotspot itself is (a player can always pick the verb).
        for (const flagName of Object.values(hs.setFlagOn || {})) add(flags, flagName);

        if (hs.dialogue && DIALOGUES[hs.dialogue]) {
          for (const f of dialogueReachableFlags(DIALOGUES[hs.dialogue], flags, items)) add(flags, f);
        }

        if (hs.puzzleOnVerb) {
          for (const puzzleId of Object.values(hs.puzzleOnVerb)) {
            const def = PUZZLES[puzzleId];
            if (!def) continue;
            const flagOk = !hs.puzzleRequiresFlag || flags.has(hs.puzzleRequiresFlag);
            const itemOk = !hs.puzzleRequiresItem || items.has(hs.puzzleRequiresItem);
            if (flagOk && itemOk) {
              add(flags, def.flagOnSolve);
              if (def.itemReward) add(items, def.itemReward);
            }
          }
        }

        if (hs.kind === "exit") {
          const flagOk = !hs.requiresFlag || flags.has(hs.requiresFlag);
          const itemOk = !hs.requiresItem || items.has(hs.requiresItem);
          if (!flagOk || !itemOk) continue;
          if (hs.pathChoice) {
            add(flags, "act1_complete");
            add(flags, `path_${path}`);
            add(rooms, PATH_START_ROOM[path]);
          } else if (hs.to) {
            add(rooms, hs.to.room);
          }
        }
      }
    }
  }

  return { rooms, flags, items };
}

// ---------- run ----------

checkStaticReferences();

const allVisitedRooms = new Set();
const results = {};
for (const path of Object.keys(PATH_START_ROOM)) {
  const { rooms, flags } = simulatePath(path);
  rooms.forEach((r) => allVisitedRooms.add(r));
  const complete = flags.has("game_complete");
  results[path] = { complete, roomCount: rooms.size };
  if (!complete) fail(`Path "${path}": game_complete is NOT reachable — something gates on a flag/item nothing ever grants.`);
}

for (const roomId of Object.keys(ROOMS)) {
  if (!allVisitedRooms.has(roomId)) {
    fail(`Room "${roomId}" is never reached by any of the three paths — dead data, or a missing exit somewhere.`);
  }
}

console.log("Solvability check — The Drowned Bell of Atlantis\n");
for (const [path, r] of Object.entries(results)) {
  console.log(`  ${path.padEnd(10)} game_complete: ${r.complete ? "yes" : "NO"}   rooms visited: ${r.roomCount}`);
}
console.log(`  rooms defined: ${Object.keys(ROOMS).length}, rooms reached by some path: ${allVisitedRooms.size}\n`);

if (failures.length) {
  console.error(`FAILED — ${failures.length} issue(s):\n`);
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}
console.log("PASSED — every path can reach the ending, every room is reachable.");

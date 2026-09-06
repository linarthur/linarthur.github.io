# Indiana Jones and the Drowned Bell of Atlantis

A browser-based, LucasArts-style point-and-click adventure. See the full
design document for story, art direction, and the milestone plan.

## Art system: procedural canvas painting (back to this, for now)

There was a brief detour into a real-pre-rendered-image pipeline
(`engine/artAssets.js`, an `ART_BIBLE.md`/`PROMPTS.md` prompt list for
generating ~65 background/character/prop images via free AI tools). That
turned out to be too slow to actually produce art with, so it's been
fully reverted — `artAssets.js` and the prompt docs are gone, and every
room is back to `engine/artHelpers.js`'s layered-gradient/rim-light/
vignette/textured-floor technique, the same one the Prologue through Act
3 were originally built with. The hero stays a rim-lit silhouette (fedora
+ build, drawn from behind/three-quarter wherever possible — cheap to
animate, reads well at this scale). This is the art direction for the
foreseeable future; revisit real art only if a faster asset pipeline
turns up.

## Status: Milestone 12 of 12 — the polish pass ✅ (final milestone)

**Done when:** the debug seams are gone, every exit reads clearly, and the
game is ready to actually put in front of the kids.

### `window.__debug` is gated, not deleted

It stayed useful for exactly the reason it was built — every milestone in
this whole project was verified by scripting it — so deleting it outright
would make future changes harder to test for no real benefit. Instead
(`engine/main.js`): it (and the dev-only `C` credits preview) only exist
on `localhost`/`127.0.0.1`, or anywhere else if someone deliberately adds
`?debug=1` to the address bar. On the deployed URL your kids actually
play on, neither exists, and nothing in the UI hints they could.

### Exit-visibility pass

Went through every room's exit hotspot and checked it against its own
painted background, the same way the sub-basement stairwell bug got
caught last milestone. Found and fixed four more genuine gaps — an exit
whose click zone existed with no painted feature anywhere near it, so a
player would have no way to know it was there short of hovering blind:

- **Lisbon alley** — the funicular stop had no funicular. Added the little
  yellow car on its rails.
- **The Hypogeum** — the passage up to the harbour was empty rock. Added a
  climbing passage with a coin of daylight at the top.
- **The harbour bar** — the door to the docks was just wall. Added an
  actual door with a sliver of night sky through the gap.
- **Bimini, underwater (all three paths' dive rooms)** — "back to the
  surface" had nothing marking a way up. Added a rope line with rungs and
  a trail of rising bubbles.

### On going live

The last two things in the original 12-milestone plan — a final art pass
and the live GitHub Pages URL — need a decision and an account only you
have. The art direction question was already settled a few sessions back
(procedural canvas painting, not generated images — see the top of this
file); this pass
was the concrete follow-through on that. The GitHub Pages URL needs your
GitHub account and a decision about whether the repo is public or
private, so I haven't touched git or pushed anything — **`SETUP.md`
Part 5** has the exact commands whenever you're ready, and I'm glad to
walk through it live with you (`git init`, the commit, the push, flipping
on Pages) rather than doing it unattended.

**Done when:** the score means something and CI can catch a broken puzzle
chain before a kid does.

### The Grit economy is now balanced across all three Act 2 paths

Before this milestone, Grit was only awarded by puzzles — which meant the
Nerve Path (three 20-point stunts) scored 60 points higher than Partners
or Cunning for covering the exact same three Voices, since neither Mo's
help nor a forgery combine paid out anything. Fixed by paying the same 20
Grit for whichever form that path's "clear the obstacle" beat takes:

- **Partners** — a dialogue node can now carry a `grit` field
  (`engine/dialogue.js`), paid out once (guarded the same way a `once`
  option is) the first time that node is reached. Mo's three "how do we
  get across" nodes each pay 20.
- **Cunning** — the item-combine branch in `engine/main.js`'s `runAction`
  now pays 20 Grit on every successful forgery combine (permit+stamp,
  robes+headscarf, requisition+seal).
- **Nerve** — unchanged; the three stunts already paid 20 each.

All three paths now total the same 595 maximum Grit: 105 from the
Prologue's three puzzles, 60 from the three Act 2 "obstacle" beats, 180
from the three Voices, and 250 from Act 3 (the finale puzzle plus
completion bonus). `engine/state.js` adds `gritTitle(amount)` — a small
kid-facing title ladder (Rookie Archaeologist → Legend of Atlantis) shown
next to the raw number wherever Grit is displayed (the `I`-key toast, the
pause menu's account row, the ending screen) — cosmetic only, never a
gate on anything.

Fixed two real bugs found while wiring this up, both in
`engine/main.js`'s `worldItems()`: it checked `combinesInto` on the
room-local item entry, but that field only exists on the master item
definition in `data/items.js` (the same one `getItem()` fetches for the
actual combine logic) — so the check silently never fired. In practice
this meant taking the second half of any Cunning Path forgery pair could,
depending on timing, leave a phantom duplicate of the second item sitting
in inventory alongside the forged result. Fixed by looking the item up
via `getItem()`, matching how the rest of the engine already reads it.

### A solvability CI test — `npm test`

`test/solvability.mjs` is a plain Node script (no build step, no browser)
that imports the game's own room/puzzle/item/dialogue data and walks it
as a graph for each of the three paths, answering: can `game_complete`
actually be reached, and does every room the game defines get visited by
at least one path? It's deliberately optimistic (does there *exist* a
solve, not "is this the intended order") — a false "still solvable" is a
much cheaper mistake than a false alarm on every push. It does catch a
typo'd flag/item/room/dialogue/puzzle id or a gate nothing in the game
ever satisfies; verified by deliberately breaking a puzzle reference and
confirming the test fails, then restoring it and confirming it passes.
Wired into `.github/workflows/ci.yml` to run on every push and PR.

```bash
npm test
```

## Status: Milestone 10 of 12 — Act 3, The Caldera, and an ending ✅

**Done when:** the game has an ending. Verified end to end on all three Act 2 paths: surface from Bimini → **The Caldera** (a shared convergence scene, whichever path got you there) → confront Contessa Draghi one last time → descend to the flooded chamber → use the Salt Conch, Storm Fork, and Star Bell together on the Drowned Bell of Atlantis (the stage-4 resonance finale, all three notes at once) → the `bell_awakens` cutscene → a real ending screen (title, credits, a path-flavoured epilogue line, and the final Grit Rating).

### Act 3 — The Caldera: one convergence, one finale, no combat

Per the path-choice screen's own promise ("he'll cross paths with the others again before this is over"), all three Act 2 paths lead to the same two new rooms:

- **`calderaApproach`** — reached via a new "Back to the Surface" exit added to each path's final Bimini room (`biminiPartners`, `biminiCunningDive`, `biminiNerveDive`), gated on a new generic `act2_complete` flag (set alongside each path's own completion flag, so the gate doesn't care which path got you there). A one-time arrival cutscene plays automatically the first time the room loads — a small, generic addition to `fallToRoom` (`ROOM_ARRIVAL_CUTSCENES`) that reuses the `cs_ran_<id>` flag `playCutscene` already sets, so it needed no new state-tracking. Draghi is here for one last dialogue-only confrontation (`data/dialogue/draghi.js`'s new `draghiCalderaDialogue`) — never a threat, same as her first meeting, and she always ends up stepping back to watch, whichever branch the player explores first.
- **`calderaChamber`** — the flooded chamber holding the real Drowned Bell of Atlantis (distinct from the three handheld Voices). The finale puzzle, `drowned_bell_finale` in `data/puzzles.js`, needed **zero new engine code** — `puzzles/resonance.js` and `resonanceUI.js` already supported 1–3 simultaneous targets (the code comments even called this out as the planned "stage-4" escalation), so the finale is just a puzzle instance with all three Voices' frequencies as targets.

Solving it triggers `checkAct3Complete()` (called unconditionally from `markPuzzleSolved`, same pattern as `checkAct2Complete`): sets `game_complete`, plays the `bell_awakens` cutscene, switches the music to the title theme, and opens the credits screen — the same `creditsUI` built in Milestone 2 for the dev-only preview is the real ending screen, per its own doc comment ("shown again on the credits screen after the game is completed"). The closing line varies by which Act 2 path was taken (`gameState.path`), for the "endings" (plural) this README has always promised, without forking the whole climax into three separate scenes.

### Milestone 9, kept for context: the music system is real MP3s now, not synthesized Tone.js

After several rounds of Tone.js synthesis tuning that never solved the
underlying complaint ("this sounds like crap MIDI"), the whole adaptive
score was replaced outright:

- **`engine/musicPlayer.js`** — a small Web Audio player: fetches and
  decodes one named MP3 track per location/state, crossfades ~1.5s between
  them on scene change, and loops each seamlessly (`AudioBufferSourceNode.loop`).
  No adaptive bed/motion/tension layering anymore — that concept doesn't
  map cleanly onto pre-recorded tracks, so it's gone along with
  `engine/music.js` and `music/composer.js` (both deleted).
- **`docs/assets/music/`** ships with 8 real, full-length, professionally
  produced placeholder tracks — one per location/state — so the game has
  genuine music immediately, not silence. All are Kevin MacLeod
  (incompetech.com) pieces, CC-BY 4.0, credited in **`CREDITS.md`**.
  **See [`docs/assets/music/TRACKS.md`](docs/assets/music/TRACKS.md) for
  the exact filename, mood, and length expected for every track — drop
  your own MP3 in under that same filename any time you want to replace a
  placeholder. No code changes needed.**
- A real **mute button and volume slider** now exist in the pause menu
  (there wasn't one before — the old Tone director only had internal,
  never-UI-exposed `setMuted`/`isMuted` methods). Both persist to
  `localStorage` across sessions.
- Tradeoff worth knowing: the 8 placeholder tracks total ~46MB, well over
  the original "tiny synthesized score" footprint. `musicPlayer.js` only
  fetches a track the first time its scene is reached (not all 8 upfront),
  which limits the real-world impact, but there's no `ffmpeg` in this
  environment to re-encode them smaller — worth doing once you're ready to
  pick final tracks.
- Tone.js itself is still used, just for sound effects (echo/resonance
  puzzle tones, UI chimes) — only the music layer changed.

### Act 2, Nerve Path — solo, no fighting, chases and stunts instead

The design doc's third option for Act 2: no companion, no forgery — just
outrunning, outlasting, or out-wrestling each obstacle. New engine
capability, **`puzzles/stuntUI.js`**: a Simon-Says reflex sequence (watch
a short sequence of moves flash, then repeat it before a timer runs out).
Failing a stunt never ends the game — it just resets the sequence with an
in-fiction line about the setback and lets the player try again
immediately, per the design doc's explicit rule against any combat
minigame that can kill the hero.

- **Doñana marshes** (`donanaNerve`) — a Consortium patrol skiff is closing in; cross the rotten boardwalk (footwork stunt) before it cuts him off from the Salt Conch.
- **The Eye of the Sahara** (`saharaNerve`) — a runaway survey tram with no working brakes; pull the levers in the right order (stunt) to stop it at the centre of the rings and reach the Storm Fork.
- **Bimini — the Consortium's own dockyard** (`biminiNerve`, then `biminiNerveDive`) — Ferro, Draghi's salvage master (previously just glimpsed in the Cunning Path), blocks the dive ladder in person and settles it with an arm-wrestle (stunt). Losing just means he offers a rematch.

### On "make it sound like Raiders March" (Milestone 8, kept for context)

I won't do this specifically — the Raiders March is John Williams' most
recognizable, most heavily-protected copyrighted melody, and your own
design doc (Section 9) already rules out imitating it. That constraint
doesn't change based on how the current score sounds. Milestone 8 pushed
the Tone.js synthesis further toward "big, brassy, heroic" as a partial
answer; Milestone 9 replaces the whole approach with real MP3s instead,
which is what actually resolves the underlying complaint.

### Act 2, Cunning Path — solo, no fighting, forgery-driven

Same three Voices as the Partners Path, same resonance-puzzle payoff, but
reached by inventory chains instead of a companion:

- **Doñana marshes** (`donanaCunning`) — a warden won't let anyone into the marsh without a permit. Take a blank permit and the Consortium's own desk stamp; picking up the second auto-forges the first (new engine mechanic, see below).
- **The Eye of the Sahara** (`saharaCunning`) — a camel broker turns away outsiders. Local robes + a headscarf combine into a disguise that fools him.
- **Bimini — the Consortium's own dockyard** (`biminiCunning`, then `biminiCunningDive`) — the path's centerpiece con, per the design doc. Forge a Consortium requisition (blank form + a lifted seal), then talk the dockyard foreman into waving you through — a genuine dialogue-only puzzle: the "show him the requisition" option only exists once the forgery is in hand, and talking *is* the puzzle, no separate action needed. Ferro is glimpsed on a far pier for lore texture (not yet an active obstacle).

New engine capability: **item combination on pickup**. Rather than building full drag-and-drop combining, picking up the second half of a pair (declared via `combinesWith`/`combinesInto` on both items in `data/items.js`) auto-forges them, with an optional `combineFlag` for puzzles that need to check "is this disguise being worn" rather than "is this item held." Also added `requiresItem` gating for exits and puzzle triggers, and `requiresItem` on dialogue options (for the foreman's dialogue-only puzzle) — all as small, generic extensions, not one-off hacks.

Two real bugs found and fixed this session, both the same root cause: a small hotspot's polygon nested inside a larger one, with the larger one listed *first* in the room's `hotspots` array — since hotspots are matched in array order, the larger one silently swallowed every click on the smaller one. Hit this in both `biminiCunning` (the dive-ladder exit) and `biminiCunningDive` (the Star Bell itself). Fixed by reordering; left a comment in both files since this class of bug can recur anywhere hotspots overlap.

Not yet built: the live GitHub Pages URL (needs your GitHub account — see `SETUP.md` Part 5).

## Controls (current build)

| Input | Action |
|---|---|
| Click/tap | Smart-default verb, or walk if you click the floor |
| Right-click | Smart-default verb (desktop) |
| Long-press (touch) | Radial verb wheel |
| Double-tap | Instant move, skips the walk animation |
| `L T K U O S Y G` | Select a verb |
| `J` | Toggle Journal |
| `H` | Request a hint |
| `I` | Show Grit Rating |
| `Space` | Pause menu (save/load, sign in/out) |
| `Esc` | Skip cutscene / close menus |
| `C` | **Dev-only** credits preview (shows the dedication) |

## Run it locally

No build step. Any static file server works because the game uses ES modules
(which `file://` blocks via CORS). From this folder:

```bash
npx serve docs -l 5173
```

Then open `http://localhost:5173`. Requires internet access once, to fetch
Tone.js (and, if configured, the Firebase SDK) from their CDNs — the game
degrades gracefully (silent audio, offline-only saves) without them.

For Firebase setup and GitHub Pages deployment, see **`SETUP.md`**.

## Re-skinning the hero

Edit `docs/config/identity.js` (name, title, portrait, dedication). A separate,
more overtly Indiana-Jones-flavoured variant lives in
`docs/config/identity.indiana.js` for local/private use — swap the single
import line in `docs/engine/main.js` to use it. Never share that file publicly.

## Project layout

```
docs/
  index.html
  engine/   loop.js input.js renderer.js artHelpers.js verbs.js state.js
            geometry.js audio.js musicPlayer.js firebaseSync.js dialogue.js
            cutscene.js save.js journal.js hints.js ui.js main.js
  puzzles/  resonance.js  chladni.js  resonanceUI.js
            tileSlide.js  tileSlideUI.js  echoUI.js  stuntUI.js
  assets/   music/  (title-theme.mp3, barnett-hall.mp3, mystery-basement.mp3,
            lisbon.mp3, malta.mp3, donana.mp3, sahara.mp3, bimini.mp3, TRACKS.md)
  data/     items.js  puzzles.js  cutscenes.js  journal.js  hints.js
            dialogue/higgins.js  dialogue/fado.js  dialogue/draghi.js
            dialogue/mo.js  dialogue/foreman.js  dialogue/ferro.js
            rooms/index.js  rooms/gallery.js  rooms/stacks.js  rooms/boiler.js
            rooms/cellar.js  rooms/subbasement.js  rooms/lisbonAlley.js
            rooms/hypogeum.js  rooms/harborBar.js  rooms/donanaPartners.js
            rooms/saharaPartners.js  rooms/biminiPartners.js
            rooms/donanaCunning.js  rooms/saharaCunning.js
            rooms/biminiCunning.js  rooms/biminiCunningDive.js
            rooms/donanaNerve.js  rooms/saharaNerve.js
            rooms/biminiNerve.js  rooms/biminiNerveDive.js
            rooms/calderaApproach.js  rooms/calderaChamber.js
  config/   identity.js  identity.indiana.js  firebase.js
  styles/   main.css
test/      solvability.mjs
.github/workflows/ci.yml
package.json
firestore.rules
CREDITS.md
SETUP.md
reference graphics/   Fate of Atlantis screenshots for art-quality comparison
reference sound/      audio + transcription (see note above)
```

## Dev notes

`window.__debug` (in `engine/main.js`) exposes `getRoomId()`, `getFlags()`,
`getInventory()`, `getActor()`, `setFlag()`, `setPathDebug()`, `jumpToRoom()`
for QA. Gated out of the public build (only live on `localhost`, or
elsewhere with `?debug=1` in the address bar) rather than deleted — see
"Milestone 12" above for why.

## Next milestone

None — Milestone 12 was the last of the original 12-milestone build plan.
The game is complete: a full Prologue, three Act 2 paths, an Act 3 finale
and ending, real music, a balanced Grit economy, a solvability CI test,
and a debug-free public build. What's left is entirely optional follow-up:
going live on GitHub Pages (`SETUP.md` Part 5, needs your account), and
whatever your kids' actual playtesting turns up.

# Music tracks

`engine/musicPlayer.js` crossfades (~1.5s) between one MP3 per named track
key below, looping each seamlessly while it plays. All 8 filenames are
required — the engine looks each one up by exact name, and a missing file
just fails silently (game stays fully playable, that scene plays with no
music).

**To swap the score:** drop your own MP3 into this folder under the exact
filename listed, replacing the placeholder. No code changes needed.

| Key | Filename | Plays during | Mood / target length | Placeholder source |
|---|---|---|---|---|
| `title` | `title-theme.mp3` | Title screen tap-gate; dev credits preview (`C` key) | Big, brassy, heroic main theme. 2–4 min, loops. | "Adventures in Adventureland" — Kevin MacLeod |
| `barnett` | `barnett-hall.mp3` | Prologue: gallery, stacks, boiler room, cellar | Curious, a little mischievous — everyday-adventure energy, not yet mysterious. 1–3 min, loops. | "Investigations" — Kevin MacLeod |
| `mystery` | `mystery-basement.mp3` | The flooded sub-basement | Mysterious, a little eerie — the trail turns strange. 2–5 min, loops. | "Ancient Mystery Waltz Allegro" — Kevin MacLeod |
| `lisbon` | `lisbon.mp3` | `lisbonAlley` | Mysterious, intense, European back-alley atmosphere. 2–4 min, loops. | "Sardana" — Kevin MacLeod |
| `malta` | `malta.mp3` | `hypogeum`, `harborBar` | Calm, somber, ancient/ritual mood. 1–3 min, loops. | "Ancient Rite" — Kevin MacLeod |
| `donana` | `donana.mp3` | `donanaPartners`, `donanaCunning` | Bright, calm, relaxed — marshland/countryside. 2–4 min, loops. | "Evening" — Kevin MacLeod |
| `sahara` | `sahara.mp3` | `saharaPartners`, `saharaCunning` | Dark, epic, driving desert-adventure action. 3–6 min, loops. | "Curse of the Scarab" — Kevin MacLeod |
| `bimini` | `bimini.mp3` | `biminiPartners`, `biminiCunning`, `biminiCunningDive` | Bright, grooving, tropical dockside energy. 2–4 min, loops. | "Tiki Bar Mixer" — Kevin MacLeod |

## Loop requirements

Each track plays with `AudioBufferSourceNode.loop = true` — sample-accurate,
no gap at the seam. That's true regardless of the audio content, but a
track that wasn't *composed* as a loop (like these full-song placeholders)
can still have an audible musical seam where it restarts. For the smoothest
result when replacing a placeholder, either:
- use a track authored/edited to loop cleanly (fades or matches its own
  start/end), or
- accept a same-song seam, which is unobtrusive for background music during
  exploration/puzzle-solving.

## Licensing

All 8 placeholders are Kevin MacLeod (incompetech.com) tracks, CC-BY 4.0 —
free to use with attribution, which is already in [`CREDITS.md`](../../../CREDITS.md).
Your own replacement MP3s aren't required to carry any particular license,
but if they do, add them to `CREDITS.md` too.

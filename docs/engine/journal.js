// engine/journal.js — pure logic over data/journal.js's goal & codex lists.
// The journal is just a read of the flag store, so it can never fall out
// of sync with the game and needs no save-game entry of its own.

export function computeGoals(goalDefs, flags) {
  return goalDefs
    .filter((g) => !g.show || g.show(flags))
    .map((g) => ({ id: g.id, text: g.text, done: !!g.done?.(flags) }));
}

export function computeCodex(codexDefs, flags) {
  return codexDefs
    .filter((c) => !c.show || c.show(flags))
    .map((c) => ({ id: c.id, title: c.title, text: c.text }));
}

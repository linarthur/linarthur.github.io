// engine/hints.js
//
// Three-stage hint framework: nudge -> strong hint -> solution. Free, no
// gating, per the design rule that kids should never be stuck. Stage
// progress persists in flags so it survives save/load and doesn't reset
// every time the player presses H.

export function createHintTracker({ getFlag, setFlag }) {
  return {
    // Returns the next hint stage's text for `puzzleId`, cycling back to
    // stage 0 after the solution has been given once.
    next(puzzleId, hintDefs) {
      const stages = hintDefs[puzzleId];
      if (!stages || !stages.length) return "No hint available here yet.";
      const flagKey = `hint_stage_${puzzleId}`;
      const current = getFlag(flagKey) || 0;
      const stage = current % stages.length;
      setFlag(flagKey, current + 1);
      return stages[stage];
    },
  };
}

// puzzles/resonance.js
//
// The game's signature puzzle type (Section 5 of the design doc). Pure
// logic — no DOM, no audio, no canvas — so it can be reused by every
// resonance puzzle in the game (~8 planned) regardless of how each one
// is dressed up. A puzzle has 1-3 target frequencies; the player drives
// that many controllable pitches; solved when every pitch sits within
// tolerance of its target, simultaneously, for a sustained moment (so a
// lucky drag-through doesn't count as a solve).

export function centsOff(playerFreq, targetFreq) {
  return 1200 * Math.log2(playerFreq / targetFreq);
}

export function beatFrequency(freqA, freqB) {
  return Math.abs(freqA - freqB);
}

export function createResonancePuzzle({ targets, toleranceCents = 15, sustainMs = 900 }) {
  const player = targets.map((t) => t * (0.55 + Math.random() * 0.9)); // start detuned
  const sustainTimers = targets.map(() => 0);
  let solved = false;

  function offsets() {
    return targets.map((t, i) => centsOff(player[i], t));
  }

  function within() {
    return offsets().map((c) => Math.abs(c) <= toleranceCents);
  }

  return {
    targets,

    setPlayerFreq(i, freq) {
      player[i] = freq;
    },

    getPlayerFreq(i) {
      return player[i];
    },

    // Escalation stage 3 (design doc): sustain a chord while a timer runs.
    // No fail state — running out just means the timer keeps going. There
    // is no way to lose this puzzle, only to not have solved it yet.
    update(dt) {
      if (solved) return this.snapshot();
      const withinNow = within();
      withinNow.forEach((ok, i) => {
        sustainTimers[i] = ok ? sustainTimers[i] + dt : 0;
      });
      if (withinNow.every(Boolean) && sustainTimers.every((t) => t >= sustainMs)) {
        solved = true;
      }
      return this.snapshot();
    },

    snapshot() {
      return {
        solved,
        centsOff: offsets(),
        withinTolerance: within(),
        sustainProgress: sustainTimers.map((t) => Math.min(1, t / sustainMs)),
      };
    },

    isSolved() {
      return solved;
    },
  };
}

// engine/audio.js — Milestone 3 stub.
//
// The real score (Tone.js, adaptive layers, the Bell motif) is Milestone 4's
// job. This stub exists only to: (a) satisfy the iOS "must unlock audio on
// the first user gesture" hard rule from day one, so nothing has to be
// retrofitted later, and (b) give room transitions and the Prologue's end
// a placeholder sting so the build isn't silent. Every tone here is meant
// to be thrown away, not tuned.

let ctx = null;

export function unlockAudio() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return; // no Web Audio support — game stays fully playable, just silent
  ctx = new AC();
  // iOS Safari only trusts an AudioContext that produced sound during the
  // gesture that created it.
  const buffer = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start(0);
}

function tone(freq, duration, gainPeak = 0.18) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

// A soft falling chime for room transitions — the closest thing this stub
// has to the game's eventual "three voices" motif.
export function playTransitionChime() {
  tone(392, 0.5); // G4
  setTimeout(() => tone(294, 0.7), 90); // D4
}

// A slightly bigger resolving chord for the end of the Prologue.
export function playChapterEndChime() {
  tone(392, 1.1, 0.14);
  tone(494, 1.1, 0.1);
  tone(587, 1.3, 0.08);
}

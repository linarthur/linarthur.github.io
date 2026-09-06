// engine/musicPlayer.js
//
// Replaces the Tone.js adaptive score (engine/music.js + music/composer.js,
// both retired) with a straightforward MP3 crossfade player. One named
// track per location/state — see assets/music/TRACKS.md for the full list
// and assets/music/ for the files themselves. Ships with real, working,
// royalty-free placeholder tracks (credited in CREDITS.md); drop in your
// own MP3s under the same filenames whenever you want to swap the sound —
// nothing else in the codebase needs to change.
//
// Web Audio API directly (no library): each track is fetched once, decoded
// to an AudioBuffer, and cached. Switching tracks starts a new
// AudioBufferSourceNode and linearly crosshfades its gain against the
// outgoing one, per the design doc's mixer requirements. `loop = true` on
// the buffer source loops sample-accurately with no gap — genuinely
// seamless playback, though a placeholder track composed as a normal song
// (not an authored loop) may still have an audible musical seam where it
// repeats. Swapping in a properly loop-edited replacement fixes that with
// no code changes.
//
// Never blocks the game: every failure (no Web Audio, a missing/404 file,
// a decode error) is caught and logged, and playback just stays silent.

const TRACKS = {
  title: "title-theme.mp3",
  barnett: "barnett-hall.mp3",
  mystery: "mystery-basement.mp3",
  lisbon: "lisbon.mp3",
  malta: "malta.mp3",
  donana: "donana.mp3",
  sahara: "sahara.mp3",
  bimini: "bimini.mp3",
};

const ASSET_BASE = "assets/music/";
const DEFAULT_CROSSFADE_MS = 1500;
const MUTE_KEY = "drownedbell_music_muted";
const VOLUME_KEY = "drownedbell_music_volume";

export function createMusicPlayer() {
  let ctx = null;
  let masterGain = null;
  let currentKey = null;
  let currentChannel = null; // { source, gain }
  let generation = 0; // guards against a slow fetch resolving after a newer request
  const bufferCache = new Map(); // key -> Promise<AudioBuffer|null>
  let muted = false;
  let volume = 0.7;

  try {
    muted = localStorage.getItem(MUTE_KEY) === "1";
    const storedVolume = localStorage.getItem(VOLUME_KEY);
    if (storedVolume !== null) volume = Math.max(0, Math.min(1, parseFloat(storedVolume)));
  } catch (e) {
    /* localStorage unavailable — defaults are fine */
  }

  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : volume;
    masterGain.connect(ctx.destination);
    return true;
  }

  function loadBuffer(key) {
    if (bufferCache.has(key)) return bufferCache.get(key);
    const filename = TRACKS[key];
    if (!filename) {
      console.warn(`musicPlayer: no track registered for key "${key}"`);
      return Promise.resolve(null);
    }
    const promise = fetch(ASSET_BASE + filename)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${filename}`);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .catch((e) => {
        console.warn(`musicPlayer: couldn't load "${key}" (${filename}):`, e.message || e);
        return null;
      });
    bufferCache.set(key, promise);
    return promise;
  }

  function startChannel(buffer) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(gain).connect(masterGain);
    source.start(0);
    return { source, gain };
  }

  async function playTrack(key, { crossfadeMs = DEFAULT_CROSSFADE_MS } = {}) {
    if (!ensureCtx()) return;
    if (key === currentKey) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const myGeneration = ++generation;
    const buffer = await loadBuffer(key);
    if (!buffer) return;
    // Another playTrack call landed while this one was fetching/decoding —
    // let that one win instead of stepping on it.
    if (myGeneration !== generation) return;
    if (key === currentKey) return;

    const now = ctx.currentTime;
    const fadeSec = crossfadeMs / 1000;
    const outgoing = currentChannel;
    const incoming = startChannel(buffer);
    incoming.gain.gain.setValueAtTime(0, now);
    incoming.gain.gain.linearRampToValueAtTime(1, now + fadeSec);

    if (outgoing) {
      outgoing.gain.gain.cancelScheduledValues(now);
      outgoing.gain.gain.setValueAtTime(outgoing.gain.gain.value, now);
      outgoing.gain.gain.linearRampToValueAtTime(0, now + fadeSec);
      const finishedSource = outgoing.source;
      setTimeout(() => {
        try {
          finishedSource.stop();
        } catch (e) {
          /* already stopped */
        }
      }, crossfadeMs + 60);
    }

    currentChannel = incoming;
    currentKey = key;
  }

  function setMuted(shouldMute) {
    muted = shouldMute;
    try {
      localStorage.setItem(MUTE_KEY, shouldMute ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(shouldMute ? 0 : volume, ctx.currentTime + 0.2);
    }
  }

  function isMuted() {
    return muted;
  }

  function toggleMuted() {
    setMuted(!muted);
    return muted;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch (e) {
      /* ignore */
    }
    if (masterGain && !muted) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
    }
  }

  function getVolume() {
    return volume;
  }

  // Fully silences the score for a listen-by-ear puzzle without touching
  // the user's actual volume/mute preference or persisting anything —
  // unduck() puts it right back where it was. A partial duck (this used
  // to just lower the volume to a small fraction) still buried the quiet
  // sine-wave puzzle tones under a full mixed music track, so this goes
  // all the way to silent instead.
  function duck(factor = 0) {
    if (!masterGain) return;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(muted ? 0 : volume * factor, ctx.currentTime + 0.3);
  }

  function unduck() {
    if (!masterGain) return;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(muted ? 0 : volume, ctx.currentTime + 0.3);
  }

  // Call this from the same user gesture that unlocks the rest of the
  // game's audio (the tap-to-begin gate) — iOS/Safari require it.
  function unlock() {
    ensureCtx();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  }

  return {
    playTrack,
    setMuted,
    isMuted,
    toggleMuted,
    setVolume,
    getVolume,
    duck,
    unduck,
    unlock,
    currentTrackKey: () => currentKey,
  };
}

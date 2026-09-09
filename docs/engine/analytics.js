// engine/analytics.js
//
// Best-effort play analytics for the admin dashboard (engine/adminUI.js).
// One Firestore document per PLAY SESSION — created once real gameplay
// starts, then patched on a timer and on key milestones (room change,
// path chosen, puzzle solved, game finished). Every operation here is
// fire-and-forget and swallows its own errors: this module must never
// slow down or break the game for a real player, the same hard rule
// engine/firebaseSync.js already follows.
//
// Identity: a signed-in player uses their real Google account; anyone who
// plays without signing in gets a silent, invisible Firebase Anonymous
// Auth identity instead (see firebaseSync.signInAnonymously) — the tap
// gate and "Continue Offline" flow are completely unaffected, since that
// anonymous sign-in only happens here, once gameplay begins, and never
// fires the auth-change callback main.js listens to.

import { getCurrentUser, signInAnonymously, writeSession, isCurrentUserAdmin } from "./firebaseSync.js";

const FLUSH_INTERVAL_MS = 20000;
const ANON_ID_KEY = "drownedbell_anon_id";

// Maps a room id to the furthest-progress "act" bucket the admin dashboard
// groups by. Kept here (not imported from main.js) so this module has no
// dependency on the engine's room registry — just a flat lookup table.
const ROOM_ACT = {
  gallery: "prologue", stacks: "prologue", boiler: "prologue", cellar: "prologue", subbasement: "prologue",
  lisbonAlley: "act1", hypogeum: "act1", harborBar: "act1",
  donanaPartners: "act2", saharaPartners: "act2", biminiPartners: "act2",
  donanaCunning: "act2", saharaCunning: "act2", biminiCunning: "act2", biminiCunningDive: "act2",
  donanaNerve: "act2", saharaNerve: "act2", biminiNerve: "act2", biminiNerveDive: "act2",
  calderaApproach: "act3", calderaChamber: "act3",
};
const ACT_RANK = { prologue: 0, act1: 1, act2: 2, act3: 3, complete: 4 };

let sessionId = null;
let startedAt = 0;
let lastFlushedPlaytimeMs = 0;
let playtimeMs = 0;
let lastTickAt = 0;
let ticking = false;
let flushTimer = null;
let furthestActRank = -1;
let pending = {}; // fields changed since the last flush

function localAnonId() {
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = "anon_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch (e) {
    return "anon_unstored";
  }
}

function deviceInfo() {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform || "",
    language: navigator.language || "",
    isTouch,
    screenW: window.screen?.width || 0,
    screenH: window.screen?.height || 0,
  };
}

// Public IP lookup — best-effort, short timeout, and entirely optional
// (see the "Skip IP" option this was built with in mind). ipify.org is a
// free, no-key, CORS-friendly JSON endpoint; a failure here just leaves
// `ip` unset, never blocks session creation.
async function lookupIp() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch("https://api.ipify.org?format=json", { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return data.ip || null;
  } catch (e) {
    return null;
  }
}

function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function tickPlaytime() {
  if (!ticking) return;
  const now = Date.now();
  playtimeMs += now - lastTickAt;
  lastTickAt = now;
}

function flush(extra = {}) {
  if (!sessionId) return;
  tickPlaytime();
  const patch = {
    ...pending,
    ...extra,
    lastSeenAt: Date.now(),
    totalPlaytimeMs: playtimeMs,
  };
  pending = {};
  lastFlushedPlaytimeMs = playtimeMs;
  writeSession(sessionId, patch);
}

// Call once, right when real gameplay begins (engine/main.js's
// startGame()). Never awaited by the caller — this can take a moment
// (anonymous sign-in + an IP lookup) and none of it should delay the
// player actually seeing the game.
export async function startSession(isDevSession = false) {
  try {
    // localhost / ?debug=1 runs are development traffic, not real
    // playtests; logging them just adds noise to the admin dashboard.
    // Caller passes the same devToolsEnabled check main.js already uses
    // to gate window.__debug.
    if (isDevSession) return;
    let user = getCurrentUser();
    if (!user) user = await signInAnonymously();
    if (!user) return; // Firebase unavailable, or anonymous sign-in failed — skip analytics entirely.
    if (await isCurrentUserAdmin()) return; // don't log the admin's own playtesting

    sessionId = `${user.uid}_${Date.now()}`;
    startedAt = Date.now();
    lastTickAt = startedAt;
    playtimeMs = 0;
    furthestActRank = -1;
    ticking = document.visibilityState !== "hidden";

    const ip = await lookupIp();

    await writeSession(sessionId, {
      uid: user.uid,
      isAnonymous: !!user.isAnonymous,
      email: user.email || null,
      displayName: user.displayName || null,
      anonId: localAnonId(),
      device: deviceInfo(),
      ip,
      startedAt,
      lastSeenAt: startedAt,
      totalPlaytimeMs: 0,
      path: null,
      furthestRoomId: null,
      furthestAct: null,
      grit: 0,
      gameCompleted: false,
      dateStr: todayStr(),
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        ticking = false;
        flush();
      } else {
        ticking = true;
        lastTickAt = Date.now();
      }
    });
    window.addEventListener("beforeunload", () => flush(), { capture: true });

    clearInterval(flushTimer);
    flushTimer = setInterval(() => flush(), FLUSH_INTERVAL_MS);
  } catch (e) {
    console.warn("Analytics session did not start (gameplay is unaffected):", e);
  }
}

// Room entered — updates the "how far did they get" bucket, but only
// ever moves it forward (a debug jump backward, or normal backtracking
// within the same act, never regresses what's reported).
export function reportRoom(roomId) {
  if (!sessionId) return;
  const act = ROOM_ACT[roomId];
  if (!act) return;
  const rank = ACT_RANK[act];
  pending.furthestRoomId = roomId;
  if (rank > furthestActRank) {
    furthestActRank = rank;
    pending.furthestAct = act;
  }
}

export function reportPath(path) {
  if (!sessionId) return;
  pending.path = path;
}

export function reportGrit(grit) {
  if (!sessionId) return;
  pending.grit = grit;
}

export function reportGameComplete() {
  if (!sessionId) return;
  furthestActRank = ACT_RANK.complete;
  pending.furthestAct = "complete";
  pending.gameCompleted = true;
  flush(); // worth an immediate write rather than waiting for the timer
}

// engine/firebaseSync.js
//
// Google Sign-In + Firestore cloud saves, per the design doc's data shape:
//   users/{uid}                       { displayName, createdAt, gritTotal, unlockedEndings[] }
//   users/{uid}/saves/{slotId}        { version, path, act, roomId, flags, inventory, grit, playtimeMs, updatedAt }
//
// Hard rule: the game must never be blocked by this module. Every export
// is wrapped so a missing config, a blocked CDN, an offline browser, or a
// Firestore error all resolve to "cloud unavailable" rather than throwing —
// engine/save.js's localStorage path is always the fallback, and the only
// thing main.js does differently is show the "offline — saving locally"
// badge and skip the sign-in button.
//
// Firebase v10 modular SDK, loaded directly from its CDN as ES modules
// (no separate <script> tag needed — a dynamic import keeps this file's
// own import graph valid even when the CDN is unreachable).

import { firebaseConfig } from "../config/firebase.js";

const SDK_BASE = "https://www.gstatic.com/firebasejs/10.12.2";
const CLOUD_WRITE_DEBOUNCE_MS = 20000;

let app = null;
let auth = null;
let db = null;
let sdk = null; // { initializeApp, getAuth, ... } once loaded
let currentUser = null;
let available = false;
let authChangeCb = null;
let pendingWriteTimers = {};
let lastWriteAt = {};

function configLooksReal() {
  return !!firebaseConfig?.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");
}

export async function initFirebase(onAuthChange) {
  authChangeCb = onAuthChange || null;
  if (!configLooksReal()) {
    console.info("Firebase: no real config in config/firebase.js — running on localStorage only.");
    return false;
  }
  try {
    const [appMod, authMod, storeMod] = await Promise.all([
      import(/* @vite-ignore */ `${SDK_BASE}/firebase-app.js`),
      import(/* @vite-ignore */ `${SDK_BASE}/firebase-auth.js`),
      import(/* @vite-ignore */ `${SDK_BASE}/firebase-firestore.js`),
    ]);
    sdk = { ...appMod, ...authMod, ...storeMod };
    app = sdk.initializeApp(firebaseConfig);
    auth = sdk.getAuth(app);
    db = sdk.getFirestore(app);
    sdk.onAuthStateChanged(auth, (user) => {
      currentUser = user;
      authChangeCb?.(user);
    });
    // Catches the user coming back from a signInWithRedirect() fallback
    // (see signInWithGoogle) — onAuthStateChanged above already picks up
    // the signed-in state either way, this just swallows the promise so
    // a redirect error doesn't surface as an unhandled rejection.
    sdk.getRedirectResult(auth).catch((e) => {
      console.warn("Redirect sign-in did not complete:", e);
    });
    available = true;
    return true;
  } catch (e) {
    console.warn("Firebase unavailable — falling back to localStorage only:", e);
    available = false;
    return false;
  }
}

export function isAvailable() {
  return available;
}

export function isOnline() {
  return typeof navigator === "undefined" || navigator.onLine !== false;
}

export function getCurrentUser() {
  return currentUser;
}

export async function signInWithGoogle() {
  if (!available) return null;
  const provider = new sdk.GoogleAuthProvider();
  try {
    const result = await sdk.signInWithPopup(auth, provider);
    await ensureUserDoc();
    return result.user;
  } catch (e) {
    // Popups get blocked by browser settings, some mobile browsers, and
    // most in-app webviews — fall back to a full-page redirect instead of
    // just failing. The page navigates away and back; getRedirectResult
    // in initFirebase picks the signed-in user back up on return.
    if (e?.code === "auth/popup-blocked" || e?.code === "auth/operation-not-supported-in-this-environment") {
      try {
        await sdk.signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        console.warn("Google sign-in redirect fallback also failed:", redirectErr);
      }
      return null;
    }
    console.warn("Google sign-in failed or was cancelled:", e);
    return null;
  }
}

export async function signOutUser() {
  if (!available) return;
  try {
    await sdk.signOut(auth);
  } catch (e) {
    console.warn("Sign-out failed:", e);
  }
}

export async function ensureUserDoc(gritTotal) {
  if (!available || !currentUser) return;
  try {
    const ref = sdk.doc(db, "users", currentUser.uid);
    await sdk.setDoc(
      ref,
      {
        displayName: currentUser.displayName || "Explorer",
        gritTotal: gritTotal ?? 0,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("Could not write user profile doc:", e);
  }
}

// Write locally first (engine/save.js), then call this — it debounces to
// at most one Firestore write per slot per 20 seconds, per the design doc.
export function cloudSaveSlot(slotId, data) {
  if (!available || !currentUser) return;
  const key = String(slotId);
  const now = Date.now();
  const elapsed = now - (lastWriteAt[key] || 0);
  clearTimeout(pendingWriteTimers[key]);

  const doWrite = async () => {
    lastWriteAt[key] = Date.now();
    try {
      const ref = sdk.doc(db, "users", currentUser.uid, "saves", key);
      await sdk.setDoc(ref, data);
    } catch (e) {
      console.warn("Cloud save failed (local save is unaffected):", e);
    }
  };

  if (elapsed >= CLOUD_WRITE_DEBOUNCE_MS) {
    doWrite();
  } else {
    pendingWriteTimers[key] = setTimeout(doWrite, CLOUD_WRITE_DEBOUNCE_MS - elapsed);
  }
}

export async function cloudLoadSlot(slotId) {
  if (!available || !currentUser) return null;
  try {
    const ref = sdk.doc(db, "users", currentUser.uid, "saves", String(slotId));
    const snap = await sdk.getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn("Cloud load failed:", e);
    return null;
  }
}

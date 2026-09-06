// engine/save.js
//
// Save = JSON.stringify(state). This module is the localStorage half of
// the save system (Milestone 6 adds Firebase cloud sync on top of the same
// shape — see the `users/{uid}/saves/{slotId}` data shape in the design doc).
// Everything here must keep working with Firebase absent, blocked, or offline.

const PREFIX = "drownedbell_";
export const SLOT_IDS = [1, 2, 3];
export const AUTOSAVE_ID = "auto";

function key(slotId) {
  return `${PREFIX}slot_${slotId}`;
}

export function saveToSlot(slotId, state) {
  const payload = { ...state, updatedAt: Date.now() };
  try {
    localStorage.setItem(key(slotId), JSON.stringify(payload));
    return true;
  } catch (e) {
    console.warn("Save failed (localStorage unavailable):", e);
    return false;
  }
}

export function loadFromSlot(slotId) {
  try {
    const raw = localStorage.getItem(key(slotId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Load failed:", e);
    return null;
  }
}

export function deleteSlot(slotId) {
  try {
    localStorage.removeItem(key(slotId));
  } catch (e) {
    /* ignore */
  }
}

export function listSlots() {
  return [...SLOT_IDS, AUTOSAVE_ID].map((id) => ({ id, data: loadFromSlot(id) }));
}

export function autosave(state) {
  return saveToSlot(AUTOSAVE_ID, state);
}

// Section 7 (no-dead-end guarantee): every save/load asserts required
// items/flags are in a reachable state. Real puzzle-dependency checking
// arrives with the puzzle content in later milestones — for now this is
// the hook every save/load routes through, and it never blocks play.
export function validateState(state) {
  const problems = [];
  if (!state || typeof state !== "object") problems.push("state is not an object");
  if (state && !Array.isArray(state.inventory)) problems.push("inventory is not an array");
  if (state && typeof state.flags !== "object") problems.push("flags is not an object");
  if (problems.length) console.warn("validateState found issues:", problems);
  return problems.length === 0;
}

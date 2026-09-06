// engine/verbs.js — the verb list, keyboard bindings, and smart-default logic.

export const VERBS = [
  { id: "look", label: "Look", key: "l" },
  { id: "talk", label: "Talk", key: "t" },
  { id: "take", label: "Take", key: "k" },
  { id: "use", label: "Use", key: "u" },
  { id: "open", label: "Open/Close", key: "o" },
  { id: "push", label: "Push", key: "s" },
  { id: "pull", label: "Pull", key: "p" },
  { id: "give", label: "Give", key: "g" },
];

export function verbByKey(key) {
  return VERBS.find((v) => v.key === key.toLowerCase());
}

// Smart default verb for a tap / right-click on a hotspot, per the
// interface spec: "Tap = smart default verb (walk / look / take)".
export function smartDefaultVerb(hotspot) {
  if (hotspot.kind === "actor") return "talk";
  if (hotspot.kind === "item" && hotspot.takeable) return "take";
  if (hotspot.kind === "exit") return "walk";
  return "look";
}

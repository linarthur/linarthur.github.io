// engine/verbs.js — the verb list, keyboard bindings, and smart-default logic.

// `label` is bilingual (English line, then 繁體中文) for the on-screen verb
// buttons. `previewLabel` stays English-only — it feeds the transient
// "Verb Name." hover/tap preview text in engine/main.js's previewFor(),
// which is built by concatenating this with a hotspot/item name that isn't
// bilingual (see data/rooms/*.js), so mixing languages there would land
// mid-sentence. The real bilingual text is the full response line shown
// once you actually act on something.
export const VERBS = [
  { id: "look", label: "Look\n看", previewLabel: "Look", key: "l" },
  { id: "talk", label: "Talk\n說話", previewLabel: "Talk", key: "t" },
  { id: "take", label: "Take\n拿取", previewLabel: "Take", key: "k" },
  { id: "use", label: "Use\n使用", previewLabel: "Use", key: "u" },
  { id: "open", label: "Open/Close\n開啟/關閉", previewLabel: "Open", key: "o" },
  { id: "push", label: "Push\n推", previewLabel: "Push", key: "s" },
  { id: "pull", label: "Pull\n拉", previewLabel: "Pull", key: "p" },
  { id: "give", label: "Give\n給予", previewLabel: "Give", key: "g" },
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

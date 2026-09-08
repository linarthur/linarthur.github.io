// engine/verbs.js — the verb list, keyboard bindings, and smart-default logic.

// `label` is bilingual (English line, then 繁體中文) for the on-screen verb
// buttons. `previewLabel`/`previewLabelZh` feed the transient "Verb Name."
// / "動詞名稱。" hover/tap preview text in engine/main.js's previewFor().
// `previewLabelZh` is a template with a `%s` placeholder for the target's
// `nameZh` rather than a plain prefix, because Chinese "talk to" wraps
// around its object ("跟莫說話", not "說話莫") while English doesn't —
// every other verb's template just happens to put %s at the end.
export const VERBS = [
  { id: "look", label: "Look\n看", previewLabel: "Look", previewLabelZh: "看%s", key: "l" },
  { id: "talk", label: "Talk\n說話", previewLabel: "Talk", previewLabelZh: "跟%s說話", key: "t" },
  { id: "take", label: "Take\n拿取", previewLabel: "Take", previewLabelZh: "拿取%s", key: "k" },
  { id: "use", label: "Use\n使用", previewLabel: "Use", previewLabelZh: "使用%s", key: "u" },
  { id: "open", label: "Open/Close\n開啟/關閉", previewLabel: "Open", previewLabelZh: "開啟%s", key: "o" },
  { id: "push", label: "Push\n推", previewLabel: "Push", previewLabelZh: "推%s", key: "s" },
  { id: "pull", label: "Pull\n拉", previewLabel: "Pull", previewLabelZh: "拉%s", key: "p" },
  { id: "give", label: "Give\n給予", previewLabel: "Give", previewLabelZh: "給予%s", key: "g" },
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

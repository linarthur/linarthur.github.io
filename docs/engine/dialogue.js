// engine/dialogue.js
//
// Node-based dialogue tree runner. Pure logic, no DOM — engine/ui.js renders
// whatever this returns. Conditions read/write the same flag store as the
// rest of the game (see engine/state.js), so a dialogue can gate on, and be
// gated by, anything a puzzle sets.
//
// Tree shape (see data/dialogue/higgins.js for a full example):
// {
//   id, npcName, start: "nodeId",
//   nodes: {
//     nodeId: {
//       npcLine: "...",
//       setFlag: "flagName",           // optional, set on arrival
//       grit: 20,                      // optional, awarded once on arrival
//       cutscene: "cutsceneId",        // optional, fired once on arrival
//       options: [
//         { id, text, goto: "nodeId" | null, once: true,
//           requiresFlag: "flag", forbidsFlag: "flag", requiresItem: "itemId" }
//       ]
//     }
//   }
// }
//
// `goto: null` ends the conversation. Any node whose options all loop back
// to a hub node gives the "keep talking" behaviour the spec asks for.
// `requiresItem` is how a dialogue-only puzzle gates on inventory — e.g.
// the Cunning Path's "talk the foreman past his own checkpoint" only
// offers that option once the forged paperwork is in hand.

export function createDialogueRunner({ getFlag, setFlag, hasItem, addGrit }) {
  let tree = null;
  let nodeId = null;

  function usedKey(optId) {
    return `dlg_used_${tree.id}_${optId}`;
  }

  function optionVisible(opt) {
    if (opt.requiresFlag && !getFlag(opt.requiresFlag)) return false;
    if (opt.forbidsFlag && getFlag(opt.forbidsFlag)) return false;
    if (opt.requiresItem && !(hasItem && hasItem(opt.requiresItem))) return false;
    return true;
  }

  // A hub node (e.g. "root") can be revisited many times in one
  // conversation — award grit only the first time a given node is ever
  // reached, same idea as the `once` guard on options.
  function awardNodeGrit(id, node) {
    if (!node.grit) return;
    const key = `dlg_grit_${tree.id}_${id}`;
    if (getFlag(key)) return;
    setFlag(key, true);
    addGrit?.(node.grit);
  }

  return {
    start(dialogueTree) {
      tree = dialogueTree;
      nodeId = tree.start;
      const node = tree.nodes[nodeId];
      if (node.setFlag) setFlag(node.setFlag, true);
      awardNodeGrit(nodeId, node);
      return node.cutscene && !getFlag(`cs_ran_${node.cutscene}`) ? node.cutscene : null;
    },

    isActive() {
      return !!tree;
    },

    currentNpcName() {
      return tree.npcName;
    },

    currentLine() {
      return tree.nodes[nodeId].npcLine;
    },

    currentOptions() {
      return tree.nodes[nodeId].options
        .filter(optionVisible)
        .map((opt) => ({
          id: opt.id,
          text: opt.text,
          used: !!(opt.once && getFlag(usedKey(opt.id))),
        }));
    },

    // Returns a cutscene id to play (or null), and whether the whole
    // conversation just ended.
    selectOption(optId) {
      const node = tree.nodes[nodeId];
      const opt = node.options.find((o) => o.id === optId);
      if (!opt) return { ended: true, cutscene: null };
      if (opt.once) setFlag(usedKey(opt.id), true);
      if (opt.goto === null) {
        // A closing option can carry its own setFlag/grit/cutscene, same
        // as a node — otherwise the one option whose wording sounds most
        // like "yes, let's do the thing" (e.g. "Let's find the fork.")
        // would be a dead end with no effect, while the actual unlock
        // hides behind a differently-worded question option instead.
        if (opt.setFlag) setFlag(opt.setFlag, true);
        awardNodeGrit(`opt_${optId}`, opt);
        const cutscene = opt.cutscene && !getFlag(`cs_ran_${opt.cutscene}`) ? opt.cutscene : null;
        tree = null;
        nodeId = null;
        return { ended: true, cutscene };
      }
      nodeId = opt.goto;
      const nextNode = tree.nodes[nodeId];
      if (nextNode.setFlag) setFlag(nextNode.setFlag, true);
      awardNodeGrit(nodeId, nextNode);
      let cutscene = null;
      if (nextNode.cutscene && !getFlag(`cs_ran_${nextNode.cutscene}`)) {
        cutscene = nextNode.cutscene;
      }
      return { ended: false, cutscene };
    },

    end() {
      tree = null;
      nodeId = null;
    },
  };
}

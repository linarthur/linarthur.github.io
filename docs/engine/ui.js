// engine/ui.js
//
// DOM overlay builders shared by dialogue, journal, pause menu, credits,
// hints, and the cutscene skip-catcher. Canvas stays reserved for the
// scene itself; anything textual/interactive on top is a DOM overlay, per
// the tech-stack rule (canvas + DOM overlay for UI).

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

// A small hand-drawn flourish (a bell with three concentric ripples — the
// game's own motif) used to dress up the dedication and credits screens.
// Inline SVG, no image assets, matches the ochre/bronze/cream palette.
export function bellFlourishSVG(size = 64) {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="#d9a066" stroke-width="1.5" opacity="0.55">
      <circle cx="50" cy="62" r="14"/>
      <circle cx="50" cy="62" r="24"/>
      <circle cx="50" cy="62" r="34"/>
    </g>
    <path d="M50 20c-9 0-14 7-14 15 0 10-4 14-8 19h44c-4-5-8-9-8-19 0-8-5-15-14-15z"
          fill="#a97142" stroke="#5c3d22" stroke-width="1.5"/>
    <rect x="44" y="54" width="12" height="5" rx="2" fill="#5c3d22"/>
    <circle cx="50" cy="66" r="4" fill="#5c3d22"/>
  </svg>`;
}

// ---------------- Dialogue panel ----------------

export function createDialogueUI(root) {
  const panel = el("div", "dlg-panel");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="dlg-name"></div>
    <div class="dlg-line"></div>
    <div class="dlg-options"></div>
  `;
  root.appendChild(panel);

  return {
    show(npcName, line, options, onSelect) {
      panel.hidden = false;
      panel.querySelector(".dlg-name").textContent = npcName;
      panel.querySelector(".dlg-line").textContent = line;
      const optWrap = panel.querySelector(".dlg-options");
      optWrap.innerHTML = "";
      options.forEach((opt) => {
        const btn = el("button", "dlg-option" + (opt.used ? " used" : ""), opt.text);
        if (!opt.used) btn.addEventListener("click", () => onSelect(opt.id));
        else btn.disabled = true;
        optWrap.appendChild(btn);
      });
    },
    hide() {
      panel.hidden = true;
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

// ---------------- Journal panel ----------------

export function createJournalUI(root) {
  const panel = el("div", "journal-panel");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="journal-header">
      <span>Field Journal</span>
      <button class="journal-close">Close (J)</button>
    </div>
    <div class="journal-body">
      <section>
        <h3>Goals</h3>
        <ul class="journal-goals"></ul>
      </section>
      <section>
        <h3>Bellwright Codex</h3>
        <ul class="journal-codex"></ul>
      </section>
    </div>
  `;
  root.appendChild(panel);
  panel.querySelector(".journal-close").addEventListener("click", () => (panel.hidden = true));

  return {
    show(goals, codex) {
      panel.hidden = false;
      const goalsEl = panel.querySelector(".journal-goals");
      goalsEl.innerHTML = "";
      goals.forEach((g) => {
        goalsEl.appendChild(el("li", g.done ? "done" : "", (g.done ? "✓ " : "○ ") + g.text));
      });
      const codexEl = panel.querySelector(".journal-codex");
      codexEl.innerHTML = "";
      if (!codex.length) {
        codexEl.appendChild(el("li", "empty", "Nothing recorded yet."));
      }
      codex.forEach((c) => {
        const item = el("li");
        item.innerHTML = `<strong>${c.title}</strong><br>${c.text}`;
        codexEl.appendChild(item);
      });
    },
    hide() {
      panel.hidden = true;
    },
    toggle(goals, codex) {
      if (panel.hidden) this.show(goals, codex);
      else this.hide();
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

// ---------------- Pause / save-load menu ----------------

export function createPauseMenuUI(root) {
  const panel = el("div", "pause-panel");
  panel.hidden = true;
  root.appendChild(panel);

  function renderSlotRow(label, slot, onSave, onLoad) {
    const row = el("div", "slot-row");
    row.appendChild(el("span", "slot-label", label));
    row.appendChild(el("span", "slot-meta", slot?.data ? new Date(slot.data.updatedAt).toLocaleString() : "empty"));
    const saveBtn = el("button", "slot-btn", "Save");
    saveBtn.addEventListener("click", onSave);
    const loadBtn = el("button", "slot-btn", "Load");
    loadBtn.disabled = !slot?.data;
    loadBtn.addEventListener("click", onLoad);
    row.appendChild(saveBtn);
    row.appendChild(loadBtn);
    return row;
  }

  return {
    show(slots, callbacks, account, sound) {
      panel.hidden = false;
      panel.innerHTML = "";
      panel.appendChild(el("h2", null, "Paused"));

      if (sound) {
        const row = el("div", "sound-row");
        const muteBtn = el("button", "slot-btn", sound.muted ? "Unmute Music" : "Mute Music");
        muteBtn.addEventListener("click", () => {
          sound.onToggleMute();
        });
        row.appendChild(muteBtn);
        const volume = document.createElement("input");
        volume.type = "range";
        volume.min = "0";
        volume.max = "1";
        volume.step = "0.05";
        volume.value = String(sound.volume);
        volume.className = "sound-volume";
        volume.addEventListener("input", (e) => sound.onVolumeChange(parseFloat(e.target.value)));
        row.appendChild(volume);
        panel.appendChild(row);
      }

      if (account) {
        const row = el("div", "account-row");
        if (account.user) {
          row.appendChild(
            el(
              "span",
              "account-status",
              `Signed in as ${account.user.displayName || "Explorer"} · Grit ${account.gritTotal ?? 0}${account.gritTitle ? ` (${account.gritTitle})` : ""}`
            )
          );
          const signOutBtn = el("button", "slot-btn", "Sign Out");
          signOutBtn.addEventListener("click", account.onSignOut);
          row.appendChild(signOutBtn);
        } else if (account.available) {
          row.appendChild(el("span", "account-status", "Playing offline — link an account to save to the cloud."));
          const signInBtn = el("button", "slot-btn", "Sign in with Google");
          signInBtn.addEventListener("click", account.onSignIn);
          row.appendChild(signInBtn);
        } else {
          row.appendChild(el("span", "account-status", "Offline — saving locally on this device."));
        }
        panel.appendChild(row);
      }

      slots
        .filter((s) => s.id !== "auto")
        .forEach((slot) => {
          panel.appendChild(
            renderSlotRow(`Case File ${slot.id}`, slot, () => callbacks.onSave(slot.id), () => callbacks.onLoad(slot.id))
          );
        });
      const autoSlot = slots.find((s) => s.id === "auto");
      const autoRow = el("div", "slot-row");
      autoRow.appendChild(el("span", "slot-label", "Autosave"));
      autoRow.appendChild(
        el("span", "slot-meta", autoSlot?.data ? new Date(autoSlot.data.updatedAt).toLocaleString() : "empty")
      );
      const loadAuto = el("button", "slot-btn", "Load");
      loadAuto.disabled = !autoSlot?.data;
      loadAuto.addEventListener("click", () => callbacks.onLoad("auto"));
      autoRow.appendChild(loadAuto);
      panel.appendChild(autoRow);

      const resume = el("button", "menu-btn", "Resume");
      resume.addEventListener("click", callbacks.onResume);
      panel.appendChild(resume);

      const journal = el("button", "menu-btn", "Journal");
      journal.addEventListener("click", callbacks.onJournal);
      panel.appendChild(journal);
    },
    hide() {
      panel.hidden = true;
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

// ---------------- Chapter card (end-of-act announcement) ----------------

export function createChapterCardUI(root) {
  const panel = el("div", "chapter-card-panel");
  panel.hidden = true;
  root.appendChild(panel);

  return {
    show(title, lines, buttonText, onClose) {
      panel.hidden = false;
      panel.innerHTML = `
        <div class="chapter-card">
          ${bellFlourishSVG(56)}
          <h2 class="chapter-title">${title}</h2>
          <div class="chapter-lines">${lines.map((l) => `<div>${l}</div>`).join("")}</div>
          <button class="menu-btn chapter-close">${buttonText || "Continue"}</button>
        </div>
      `;
      panel.querySelector(".chapter-close").addEventListener("click", () => {
        panel.hidden = true;
        onClose?.();
      });
    },
    hide() {
      panel.hidden = true;
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

// ---------------- Path choice (end of Act 1) ----------------

export function createPathChoiceUI(root) {
  const panel = el("div", "pathchoice-panel");
  panel.hidden = true;
  root.appendChild(panel);

  const PATHS = [
    {
      id: "partners",
      name: "Partners",
      desc: "Mo travels with you. Two-person puzzles, the best dialogue, the easiest road.",
    },
    {
      id: "cunning",
      name: "Cunning",
      desc: "Solo. Forgery, bluffing, disguise, a full con on the Consortium. Hardest, and no fighting at all.",
    },
    {
      id: "nerve",
      name: "Nerve",
      desc: "Solo. Chases, escapes, timed stunts instead of punches. Nothing here can be truly lost, only bruised.",
    },
  ];

  return {
    show(onChoose) {
      panel.hidden = false;
      panel.innerHTML = `
        <div class="pathchoice-inner">
          <h2 class="pathchoice-title">Which way, Professor?</h2>
          <p class="pathchoice-sub">Three roads out of Valletta. Whichever one he takes, he'll cross paths with the others again before this is over.</p>
          <div class="pathchoice-cards"></div>
        </div>
      `;
      const cardWrap = panel.querySelector(".pathchoice-cards");
      PATHS.forEach((p) => {
        const card = el("div", "pathchoice-card");
        card.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p>`;
        card.addEventListener("click", () => {
          panel.hidden = true;
          onChoose(p.id);
        });
        cardWrap.appendChild(card);
      });
    },
    hide() {
      panel.hidden = true;
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

// ---------------- Credits screen (also used for the title-screen dedication) ----------------

export function createCreditsUI(root) {
  const panel = el("div", "credits-panel");
  panel.hidden = true;
  root.appendChild(panel);

  return {
    show(identity, creditLines, onClose) {
      panel.hidden = false;
      panel.innerHTML = `
        <div class="credits-card">
          ${bellFlourishSVG(72)}
          <h2 class="credits-title">${identity.gameTitle}</h2>
          <div class="credits-lines">
            ${creditLines.map((l) => `<div>${l}</div>`).join("")}
          </div>
          <div class="dedication">${identity.dedication}</div>
          ${bellFlourishSVG(40)}
          <button class="menu-btn credits-close">Close</button>
        </div>
      `;
      panel.querySelector(".credits-close").addEventListener("click", () => {
        panel.hidden = true;
        onClose?.();
      });
    },
    hide() {
      panel.hidden = true;
    },
  };
}

// ---------------- Hint toast ----------------

export function createHintToast(root) {
  const toast = el("div", "hint-toast");
  toast.hidden = true;
  root.appendChild(toast);
  let timer = null;
  return {
    show(text) {
      toast.textContent = `Hint: ${text}`;
      toast.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(() => (toast.hidden = true), 6000);
    },
  };
}

// ---------------- Cutscene skip overlay ----------------

export function createSkipOverlay(root, onSkip) {
  const overlay = el("div", "skip-overlay", "tap or press Esc to skip");
  overlay.addEventListener("click", onSkip);
  overlay.addEventListener("touchend", (e) => {
    e.preventDefault();
    onSkip();
  });
  root.appendChild(overlay);
  return overlay;
}

export function removeSkipOverlay(overlay) {
  overlay.remove();
}

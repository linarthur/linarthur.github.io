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

// Hero close-up portraits shown opposite the NPC's line during dialogue —
// real art (see data/dialogue/*.js's optional per-node `mood` field,
// engine/dialogue.js's currentMood()). Every other speaker still has no
// portrait at all; this is hero-only for now.
const HERO_PORTRAITS = {
  talk: "assets/sprites/hero-portrait-talk.png",
  surprised: "assets/sprites/hero-portrait-surprised.png",
};

export function createDialogueUI(root) {
  const panel = el("div", "dlg-panel");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="dlg-portrait"><img class="dlg-hero-portrait" alt="Indy" /></div>
    <div class="dlg-body">
      <div class="dlg-name"></div>
      <div class="dlg-line"></div>
      <div class="dlg-options"></div>
    </div>
  `;
  root.appendChild(panel);

  return {
    show(npcName, line, options, onSelect, mood = "talk") {
      panel.hidden = false;
      panel.querySelector(".dlg-hero-portrait").src = HERO_PORTRAITS[mood] || HERO_PORTRAITS.talk;
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
      <span>Field Journal<br>探險日誌</span>
      <button class="journal-close">Close (J)<br>關閉 (J)</button>
    </div>
    <div class="journal-body">
      <section>
        <h3>Goals<br>目標</h3>
        <ul class="journal-goals"></ul>
      </section>
      <section>
        <h3>Bellwright Codex<br>貝爾萊特文獻</h3>
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
        codexEl.appendChild(el("li", "empty", "Nothing recorded yet.\n尚無記錄。"));
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
    const metaWrap = el("span", "slot-meta");
    if (slot?.data) {
      metaWrap.appendChild(el("span", "slot-meta-when", new Date(slot.data.updatedAt).toLocaleString()));
      if (slot.place) metaWrap.appendChild(el("span", "slot-meta-place", slot.place));
    } else {
      metaWrap.appendChild(el("span", "slot-meta-when", "empty\n空白"));
    }
    row.appendChild(metaWrap);
    const saveBtn = el("button", "slot-btn", "Save\n儲存");
    saveBtn.addEventListener("click", onSave);
    const loadBtn = el("button", "slot-btn", "Load\n讀取");
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
      panel.appendChild(el("h2", null, "Paused\n遊戲暫停"));

      if (sound) {
        const row = el("div", "sound-row");
        const muteBtn = el("button", "slot-btn", sound.muted ? "Unmute Music\n取消靜音" : "Mute Music\n靜音");
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
          const name = account.user.displayName || "Explorer";
          const nameZh = account.user.displayName || "探險家";
          const gritSuffix = account.gritTitle ? ` (${account.gritTitle})` : "";
          row.appendChild(
            el(
              "span",
              "account-status",
              `Signed in as ${name} · Grit ${account.gritTotal ?? 0}${gritSuffix}\n已登入：${nameZh} · 分數 ${account.gritTotal ?? 0}${gritSuffix}`
            )
          );
          const signOutBtn = el("button", "slot-btn", "Sign Out\n登出");
          signOutBtn.addEventListener("click", account.onSignOut);
          row.appendChild(signOutBtn);
        } else if (account.available) {
          row.appendChild(
            el("span", "account-status", "Playing offline — link an account to save to the cloud.\n離線遊玩中 — 連結帳號即可雲端存檔。")
          );
          const signInBtn = el("button", "slot-btn", "Sign in with Google\n使用 Google 登入");
          signInBtn.addEventListener("click", account.onSignIn);
          row.appendChild(signInBtn);
        } else {
          row.appendChild(el("span", "account-status", "Offline — saving locally on this device.\n離線模式 — 進度將儲存於本機。"));
        }
        panel.appendChild(row);
      }

      slots
        .filter((s) => s.id !== "auto")
        .forEach((slot) => {
          panel.appendChild(
            renderSlotRow(`Case File ${slot.id}\n案件檔案 ${slot.id}`, slot, () => callbacks.onSave(slot.id), () => callbacks.onLoad(slot.id))
          );
        });
      const autoSlot = slots.find((s) => s.id === "auto");
      const autoRow = el("div", "slot-row");
      autoRow.appendChild(el("span", "slot-label", "Autosave\n自動存檔"));
      const autoMeta = el("span", "slot-meta");
      if (autoSlot?.data) {
        autoMeta.appendChild(el("span", "slot-meta-when", new Date(autoSlot.data.updatedAt).toLocaleString()));
        if (autoSlot.place) autoMeta.appendChild(el("span", "slot-meta-place", autoSlot.place));
      } else {
        autoMeta.appendChild(el("span", "slot-meta-when", "empty\n空白"));
      }
      autoRow.appendChild(autoMeta);
      const loadAuto = el("button", "slot-btn", "Load\n讀取");
      loadAuto.disabled = !autoSlot?.data;
      loadAuto.addEventListener("click", () => callbacks.onLoad("auto"));
      autoRow.appendChild(loadAuto);
      panel.appendChild(autoRow);

      const resume = el("button", "menu-btn", "Resume\n繼續遊戲");
      resume.addEventListener("click", callbacks.onResume);
      panel.appendChild(resume);

      const journal = el("button", "menu-btn", "Journal\n日誌");
      journal.addEventListener("click", callbacks.onJournal);
      panel.appendChild(journal);

      const newGame = el("button", "menu-btn danger", "New Game\n開始新遊戲");
      newGame.addEventListener("click", callbacks.onNewGame);
      panel.appendChild(newGame);

      // Only ever rendered for the one admin account (main.js decides
      // `account.isAdmin`, gated on the signed-in email) — everyone else's
      // pause menu simply has no such button, on top of the Firestore
      // rules that would reject the read anyway.
      if (account?.isAdmin) {
        const admin = el("button", "menu-btn", "Admin — Play Analytics\n管理員 — 遊玩紀錄");
        admin.addEventListener("click", callbacks.onOpenAdmin);
        panel.appendChild(admin);
      }
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
          <button class="menu-btn chapter-close">${buttonText || "Continue\n繼續"}</button>
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

// ---------------- Sign-in gate (shown once, right after tap-to-begin) ----------------

export function createSignInGateUI(root) {
  const panel = el("div", "signin-gate-panel");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="signin-gate-inner">
      <h2 class="signin-gate-title">Save your progress<br>儲存你的進度</h2>
      <p class="signin-gate-text">
        Sign in with Google to save your progress to your account, so you
        can pick up right where you left off on any device. If you play
        without signing in, your progress only saves on this browser —
        clear its data, switch devices, or come back on a different
        computer, and you'll be starting over from the beginning.
        <br><br>
        使用 Google 登入即可將進度儲存到你的帳號，讓你在任何裝置上都能接續遊玩。若不登入，進度只會存在這個瀏覽器裡——清除瀏覽器資料、更換裝置或在別台電腦上開啟，都會從頭開始。
      </p>
      <div class="signin-gate-buttons">
        <button class="menu-btn signin-gate-google">Sign in with Google<br>使用 Google 登入</button>
        <button class="menu-btn signin-gate-offline">Continue Offline<br>離線繼續遊玩</button>
      </div>
      <p class="signin-gate-note"></p>
    </div>
  `;
  root.appendChild(panel);

  const googleBtn = panel.querySelector(".signin-gate-google");
  const offlineBtn = panel.querySelector(".signin-gate-offline");
  const note = panel.querySelector(".signin-gate-note");

  return {
    show({ onSignIn, onContinueOffline, cloudPending }) {
      panel.hidden = false;
      googleBtn.disabled = !!cloudPending;
      note.textContent = cloudPending ? "Checking for Google Sign-In...\n正在檢查 Google 登入狀態……" : "";
      googleBtn.onclick = () => onSignIn();
      offlineBtn.onclick = () => onContinueOffline();
    },
    // Called once engine/firebaseSync.js's init promise settles, in case
    // the player is still looking at the gate when it resolves.
    setCloudAvailable(available) {
      if (panel.hidden) return;
      googleBtn.disabled = !available;
      note.textContent = available
        ? ""
        : "Cloud save isn't available right now — you can still play offline.\n目前無法使用雲端存檔——你仍然可以離線遊玩。";
    },
    hide() {
      panel.hidden = true;
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

// ---------------- Start gate (Continue / New Game, shown right after the
// sign-in step when at least one save already exists on this device) ----------------

export function createStartGateUI(root) {
  const panel = el("div", "startgate-panel");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="startgate-inner">
      <h2 class="startgate-title">Welcome Back<br>歡迎回來</h2>
      <p class="startgate-sub">Pick up where you left off, or start a fresh case file.<br>從上次的進度繼續，或開始一個全新的案件檔案。</p>
      <div class="startgate-slots"></div>
      <button class="menu-btn startgate-newgame">New Game<br>開始新遊戲</button>
      <p class="startgate-newgame-note">Playing continues autosaving over your most recent progress — case files 1-3 are untouched.<br>遊戲會持續自動存檔、覆蓋你最近的進度——案件檔案 1-3 不受影響。</p>
    </div>
  `;
  root.appendChild(panel);

  const slotsWrap = panel.querySelector(".startgate-slots");
  const newGameBtn = panel.querySelector(".startgate-newgame");

  const SLOT_LABELS = { 1: "Case File 1\n案件檔案 1", 2: "Case File 2\n案件檔案 2", 3: "Case File 3\n案件檔案 3", auto: "Autosave\n自動存檔" };

  return {
    show(slots, { onContinue, onNewGame }) {
      panel.hidden = false;
      slotsWrap.innerHTML = "";
      slots
        .filter((s) => s.data)
        .sort((a, b) => (b.data.updatedAt || 0) - (a.data.updatedAt || 0))
        .forEach((slot) => {
          const row = el("div", "slot-row");
          row.appendChild(el("span", "slot-label", SLOT_LABELS[slot.id] || String(slot.id)));
          const meta = el("span", "slot-meta");
          meta.appendChild(el("span", "slot-meta-when", new Date(slot.data.updatedAt).toLocaleString()));
          if (slot.place) meta.appendChild(el("span", "slot-meta-place", slot.place));
          row.appendChild(meta);
          const btn = el("button", "slot-btn", "Continue\n繼續");
          btn.addEventListener("click", () => onContinue(slot.id));
          row.appendChild(btn);
          slotsWrap.appendChild(row);
        });
      newGameBtn.onclick = () => onNewGame();
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
      name: "Partners\n夥伴之路",
      desc: "Mo travels with you. Two-person puzzles, the best dialogue, the easiest road.\n莫與你同行。雙人合作解謎，對話最豐富，也是最平順的一條路。",
    },
    {
      id: "cunning",
      name: "Cunning\n狡詐之路",
      desc: "Solo. Forgery, bluffing, disguise, a full con on the Consortium. Hardest, and no fighting at all.\n獨自一人。偽造文件、虛張聲勢、喬裝改扮，對財團使出一場完整的騙局。最困難，但完全不需要動手打鬥。",
    },
    {
      id: "nerve",
      name: "Nerve\n膽識之路",
      desc: "Solo. Chases, escapes, timed stunts instead of punches. Nothing here can be truly lost, only bruised.\n獨自一人。追逐、逃脫、限時特技取代拳腳相向。這裡沒有真正輸掉的風險，最多只是撞得瘀青。",
    },
  ];

  return {
    show(onChoose) {
      panel.hidden = false;
      panel.innerHTML = `
        <div class="pathchoice-inner">
          <h2 class="pathchoice-title">Which way, Professor?<br>教授，該走哪條路？</h2>
          <p class="pathchoice-sub">Three roads out of Valletta. Whichever one he takes, he'll cross paths with the others again before this is over.<br>離開瓦萊塔有三條路。無論他選哪一條，故事結束前終究會與另外兩條路再次交會。</p>
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
          <button class="menu-btn credits-close">Close<br>關閉</button>
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
      toast.textContent = `Hint / 提示: ${text}`;
      toast.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(() => (toast.hidden = true), 6000);
    },
  };
}

// ---------------- Cutscene skip overlay ----------------

export function createSkipOverlay(root, onSkip) {
  const overlay = el("div", "skip-overlay", "tap or press Esc to skip\n點擊或按 Esc 跳過");
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

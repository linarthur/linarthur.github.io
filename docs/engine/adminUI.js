// engine/adminUI.js
//
// Read-only play-analytics dashboard for the single admin account
// (linarthur@gmail.com — see firestore.rules and engine/analytics.js).
// Pure UI: main.js fetches the session documents via
// firebaseSync.fetchAllSessions() and hands them to show(); this module
// never talks to Firebase directly, same division of labour as every
// other overlay in engine/ui.js.

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

// Filtered out here too, not just at write time (engine/analytics.js
// already skips creating new sessions for this account) — a client-side
// belt-and-suspenders so the dashboard never shows the admin's own
// playtesting, including any rows already written before that write-side
// guard existed, or written by a stale cached copy of the old code.
const ADMIN_EMAIL = "linarthur@gmail.com";
function excludeAdmin(sessions) {
  return (sessions || []).filter((s) => s.email !== ADMIN_EMAIL);
}

const ACT_LABEL = {
  prologue: "Prologue",
  act1: "Act 1",
  act2: "Act 2",
  act3: "Act 3",
  complete: "Finished",
};

function formatWhen(ms) {
  if (!ms) return "—";
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPlaytime(ms) {
  if (!ms) return "0m";
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (totalMin > 0) return `${totalMin}m`;
  return `${Math.round(ms / 1000)}s`;
}

// Deliberately not a full UA-parser — just enough to be readable at a
// glance in a small hobby-project dashboard, not a forensic breakdown.
function formatDevice(device) {
  if (!device) return "—";
  const ua = device.userAgent || "";
  let os = "Unknown OS";
  if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/Firefox\//.test(ua)) browser = "Firefox";

  const kind = device.isTouch ? "touch" : "desktop";
  const size = device.screenW && device.screenH ? `${device.screenW}×${device.screenH}` : "";
  return [os, browser, kind, size].filter(Boolean).join(" · ");
}

function formatProgress(s) {
  const act = ACT_LABEL[s.furthestAct] || "—";
  const room = s.furthestRoomId ? ` (${s.furthestRoomId})` : "";
  const path = s.path ? ` · ${s.path}` : "";
  return `${act}${room}${path}`;
}

function formatAccount(s) {
  if (s.email) return s.email;
  return `Anonymous (${(s.anonId || s.uid || "").slice(0, 14)})`;
}

function matchesFilters(s, filters) {
  if (filters.accountType === "signed-in" && (!s.email || s.isAnonymous)) return false;
  if (filters.accountType === "anonymous" && s.email && !s.isAnonymous) return false;
  if (filters.completedOnly && !s.gameCompleted) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = `${s.email || ""} ${s.anonId || ""} ${s.uid || ""}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  if (filters.dateRangeMs) {
    const cutoff = Date.now() - filters.dateRangeMs;
    if ((s.lastSeenAt || s.startedAt || 0) < cutoff) return false;
  }
  return true;
}

const DATE_RANGES = {
  all: null,
  "1d": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export function createAdminUI(root) {
  const panel = el("div", "admin-panel");
  panel.hidden = true;
  root.appendChild(panel);

  let allSessions = [];
  let onRefresh = null;
  const filters = { dateRangeMs: null, accountType: "all", completedOnly: false, search: "" };

  function uniquePlayerCount(rows) {
    const ids = new Set(rows.map((s) => s.email || s.anonId || s.uid));
    return ids.size;
  }

  function render() {
    const rows = allSessions.filter((s) => matchesFilters(s, filters));
    const tbody = panel.querySelector(".admin-table-body");
    tbody.innerHTML = "";
    rows.forEach((s) => {
      const tr = el("tr");
      tr.appendChild(el("td", null, formatWhen(s.lastSeenAt || s.startedAt)));
      tr.appendChild(el("td", "admin-col-account", formatAccount(s)));
      tr.appendChild(el("td", null, formatDevice(s.device)));
      tr.appendChild(el("td", null, s.ip || "—"));
      tr.appendChild(el("td", null, formatPlaytime(s.totalPlaytimeMs)));
      tr.appendChild(el("td", null, formatProgress(s)));
      tr.appendChild(el("td", s.gameCompleted ? "admin-yes" : "admin-no", s.gameCompleted ? "✓" : "—"));
      tbody.appendChild(tr);
    });
    panel.querySelector(".admin-summary").textContent =
      `${rows.length} session${rows.length === 1 ? "" : "s"} · ${uniquePlayerCount(rows)} unique player${uniquePlayerCount(rows) === 1 ? "" : "s"}`;
  }

  panel.innerHTML = `
    <div class="admin-header">
      <span>Admin — Play Analytics</span>
      <button class="admin-close">Close</button>
    </div>
    <div class="admin-filters">
      <select class="admin-filter-date">
        <option value="all">All time</option>
        <option value="1d">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
      <select class="admin-filter-account">
        <option value="all">All players</option>
        <option value="signed-in">Signed in only</option>
        <option value="anonymous">Anonymous only</option>
      </select>
      <label class="admin-filter-completed"><input type="checkbox" /> Completed only</label>
      <input class="admin-filter-search" type="text" placeholder="Search email / id…" />
      <button class="admin-refresh">Refresh</button>
    </div>
    <div class="admin-summary"></div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Last seen</th>
            <th>Account</th>
            <th>Device</th>
            <th>IP</th>
            <th>Playtime</th>
            <th>Progress</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody class="admin-table-body"></tbody>
      </table>
    </div>
  `;

  panel.querySelector(".admin-close").addEventListener("click", () => (panel.hidden = true));
  panel.querySelector(".admin-refresh").addEventListener("click", () => onRefresh?.());
  panel.querySelector(".admin-filter-date").addEventListener("change", (e) => {
    filters.dateRangeMs = DATE_RANGES[e.target.value];
    render();
  });
  panel.querySelector(".admin-filter-account").addEventListener("change", (e) => {
    filters.accountType = e.target.value;
    render();
  });
  panel.querySelector(".admin-filter-completed input").addEventListener("change", (e) => {
    filters.completedOnly = e.target.checked;
    render();
  });
  panel.querySelector(".admin-filter-search").addEventListener("input", (e) => {
    filters.search = e.target.value;
    render();
  });

  return {
    show(sessions, refreshCb) {
      allSessions = excludeAdmin(sessions);
      onRefresh = refreshCb || null;
      panel.hidden = false;
      render();
    },
    setSessions(sessions) {
      allSessions = excludeAdmin(sessions);
      render();
    },
    hide() {
      panel.hidden = true;
    },
    isVisible() {
      return !panel.hidden;
    },
  };
}

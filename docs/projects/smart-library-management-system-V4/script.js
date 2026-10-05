/* Smart Library case study.
   1. Navigation: aria-current on click (original behaviour) plus scroll tracking.
   2. Reader simulator: runs the project's real entry/exit rules in the browser. */

const docEl = document.documentElement;
const THEME_KEY = "slms-theme";
docEl.classList.add("js");
try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) docEl.dataset.theme = saved;
} catch { /* storage unavailable: follow the system theme */ }

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initChrome();
  initMotion();
  initSimulator();
});

/* ---------- Navigation ---------- */
function initNav() {
  const links = [...document.querySelectorAll(".primary-nav a")];
  if (!links.length) return;

  const setCurrent = (link) => {
    links.forEach((item) => item.removeAttribute("aria-current"));
    if (!link) return;
    link.setAttribute("aria-current", "page");
    // On small screens the nav scrolls sideways; keep the active link in view.
    const nav = link.parentElement;
    if (nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: link.offsetLeft - nav.offsetLeft - 16, behavior: "smooth" });
    }
  };

  links.forEach((link) => link.addEventListener("click", () => setCurrent(link)));

  if (!("IntersectionObserver" in window)) return;
  const byId = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      const current = sections.find((section) => visible.has(section));
      if (current) setCurrent(byId.get(current.id));
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- Reader simulator ---------- */
const CAPACITY = 50;
const BASELINE = 37; // the occupancy example used in the architecture section
const MAX_ROWS = 6;

// Demo identities only. Any UID not listed here is an unknown card.
const REGISTRY = {
  "04 A3 5F 1C": { id: "STU-0141", name: "Aarav Sharma", branch: "AR" },
  "04 7B 22 E9": { id: "STU-0232", name: "Meera Iyer", branch: "ECE" },
  "04 C1 90 3D": { id: "STU-0318", name: "Rohan Das", branch: "CSE" },
};

function initSimulator() {
  const root = document.querySelector(".sim");
  if (!root) return;

  const lcd = root.querySelector("#lcd");
  const line1 = root.querySelector("#lcd-1");
  const line2 = root.querySelector("#lcd-2");
  const meter = root.querySelector("#meter");
  const occText = root.querySelector("#occ-text");
  const occPct = root.querySelector("#occ-pct");
  const body = root.querySelector("#ledger-body");

  let inside, rows, openVisits;

  const reset = () => {
    inside = BASELINE;
    rows = [];
    openVisits = new Map(); // UID -> the row still waiting for its exit time
    show("idle", "READY", "Tap a card");
    render();
  };

  const show = (state, first, second) => {
    lcd.dataset.state = state;
    line1.textContent = first;
    line2.textContent = second;
    lcd.classList.remove("tick");
    void lcd.offsetWidth; // restart the flash
    lcd.classList.add("tick");
    if (state !== "idle") {
      root.dataset.flash = "";
      void root.offsetWidth;
      root.dataset.flash = state; // drives the reader LED colour
    }
  };

  const now = () => new Date().toLocaleTimeString("en-GB");

  // First valid scan = entry, second = exit, next visit = a new row.
  const scan = (uid) => {
    const student = REGISTRY[uid];
    if (!student) {
      show("denied", "ACCESS DENIED", "Unknown card, no record");
      return;
    }
    const visit = openVisits.get(uid);
    if (!visit) {
      const row = { student, entry: now(), exit: "-" };
      rows.unshift(row);
      openVisits.set(uid, row);
      inside += 1;
      show("entry", "ENTRY, 1 beep", student.name);
    } else {
      visit.exit = now();
      openVisits.delete(uid);
      inside -= 1;
      show("exit", "EXIT, 2 beeps", student.name);
    }
    render();
  };

  const render = () => {
    const pct = Math.round((inside / CAPACITY) * 100);
    meter.firstElementChild.style.width = Math.min(pct, 100) + "%";
    meter.dataset.level = pct >= 100 ? "full" : pct >= 80 ? "high" : "ok";
    meter.setAttribute("aria-valuenow", inside);
    occText.textContent = `${inside} inside, ${Math.max(CAPACITY - inside, 0)} free of ${CAPACITY}`;
    occPct.textContent = pct + "%";

    body.replaceChildren();
    if (!rows.length) {
      const tr = body.insertRow();
      tr.className = "ledger-empty";
      const td = tr.insertCell();
      td.colSpan = 4;
      td.textContent = "No visits recorded yet.";
      return;
    }
    rows.slice(0, MAX_ROWS).forEach((row) => {
      const tr = body.insertRow();
      [row.student.id, row.student.name, row.entry, row.exit].forEach((text) => {
        tr.insertCell().textContent = text;
      });
    });
  };

  root.querySelectorAll("[data-uid]").forEach((button) =>
    button.addEventListener("click", () => scan(button.dataset.uid))
  );
  root.querySelector("#sim-reset").addEventListener("click", reset);

  // Keyboard: 1-4 tap a card, R resets.
  const buttons = [...root.querySelectorAll("[data-uid]")];
  buttons.forEach((button, i) => {
    const key = document.createElement("kbd");
    key.textContent = i + 1;
    button.append(key);
    button.setAttribute("aria-keyshortcuts", String(i + 1));
  });
  root.querySelector(".sim-help").append(" Keys 1 to 4 tap a card, R resets.");
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input, textarea, dialog")) return;
    const button = buttons[Number(e.key) - 1];
    if (button) button.click();
    else if (e.key.toLowerCase() === "r") reset();
  });
  reset();
}

/* ---------- Chrome: progress bar, theme toggle, command palette ---------- */
function initChrome() {
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  let queued = false;
  const update = () => {
    const max = docEl.scrollHeight - innerHeight;
    bar.style.setProperty("--p", max > 0 ? Math.min(scrollY / max, 1) : 0);
    queued = false;
  };
  addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  const tools = document.createElement("div");
  tools.className = "rail-tools";
  tools.innerHTML = `
    <button class="tool" type="button" id="open-palette" aria-label="Jump to section" aria-keyshortcuts="Control+K Meta+K">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
      <span class="tool-label">Jump to</span><kbd>${mac ? "\u2318K" : "Ctrl K"}</kbd>
    </button>
    <button class="tool" type="button" id="theme-toggle">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11a5.5 5.5 0 0 0 0-11z" fill="currentColor"/></svg>
    </button>`;
  document.querySelector(".header-inner").append(tools);

  /* Theme */
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const theme = () => docEl.dataset.theme || (systemDark.matches ? "dark" : "light");
  const toggle = tools.querySelector("#theme-toggle");
  const label = () => toggle.setAttribute("aria-label", theme() === "dark" ? "Switch to light theme" : "Switch to dark theme");
  toggle.addEventListener("click", () => {
    const next = theme() === "dark" ? "light" : "dark";
    docEl.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* not persisted */ }
    label();
  });
  label();

  /* Command palette (Ctrl/Cmd + K) */
  const links = [...document.querySelectorAll(".primary-nav a")];
  const dialog = document.createElement("dialog");
  dialog.className = "palette";
  dialog.setAttribute("aria-label", "Jump to section");
  dialog.innerHTML = `<input type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" placeholder="Jump to a section" autocomplete="off"><ul id="palette-list" role="listbox"></ul>`;
  document.body.append(dialog);
  const input = dialog.querySelector("input");
  const list = dialog.querySelector("ul");
  let items = [];
  let active = 0;

  const mark = () => [...list.children].forEach((li, i) => {
    li.setAttribute("aria-selected", i === active);
    if (i === active) {
      li.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", li.id);
    }
  });
  const draw = () => {
    const q = input.value.trim().toLowerCase();
    items = links
      .map((link, i) => ({ link, n: String(i + 1).padStart(2, "0") }))
      .filter(({ link }) => link.textContent.toLowerCase().includes(q));
    active = 0;
    list.replaceChildren(...items.map(({ link, n }, i) => {
      const li = document.createElement("li");
      li.id = "palette-" + i;
      li.setAttribute("role", "option");
      li.innerHTML = `<span>${n}</span>`;
      li.append(link.textContent);
      return li;
    }));
    mark();
  };
  const go = (i) => {
    if (!items[i]) return;
    dialog.close();
    items[i].link.click();
  };
  const open = () => { input.value = ""; draw(); dialog.showModal(); input.focus(); };

  input.addEventListener("input", draw);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % (items.length || 1);
      mark();
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) go([...list.children].indexOf(li));
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  tools.querySelector("#open-palette").addEventListener("click", open);
  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
    }
  });
}

/* ---------- Motion: cursor highlight and reveal on ruled items ---------- */
function initMotion() {
  const items = [...document.querySelectorAll(
    ".layer-card, .workflow-step, .hardware-grid article, .stack-grid article, .challenge-grid article, " +
    ".status-card, .analytics-grid article, .roles-grid article, .reliability-grid article, " +
    ".future-grid article, .requirements-grid article, .lifecycle > div"
  )];
  items.forEach((el) => el.classList.add("spot"));

  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest && e.target.closest(".spot");
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      el.classList.add("in");
      setTimeout(() => el.classList.remove("rv", "in"), 1100); // hand control back to hover styles
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => {
    el.style.setProperty("--i", [...el.parentElement.children].indexOf(el) % 6);
    el.classList.add("rv");
    observer.observe(el);
  });
}

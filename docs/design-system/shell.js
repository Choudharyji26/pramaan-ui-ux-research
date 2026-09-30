/* Tape and Thread shell behaviour. Vanilla, no build step, load with <script defer src="../shell.js">.
   Does only: rail state and tooltip, arrow-key roving, tape pin position, theme helper, popover placement. Nothing animates on load. */
(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: state just does not persist */ } },
  };
  const narrow = window.matchMedia("(max-width: 1023.98px)");
  const wide = window.matchMedia("(min-width: 1280px)");
  const railToggle = $(".pm-rail-toggle");
  // Only the real rail's items: sample rail items in the style guide keep their own tab stops and names.
  const RAIL_ITEM = ".pm-rail .pm-rail-item";

  /* ---- Rail ----
     ONE rail state per user, the same on every screen (SPEC C.2). A stored choice ("expanded" | "collapsed" in
     localStorage pm.rail) always wins at any width; with nothing stored the default is expanded from 1280px up and
     collapsed below. There is no per-screen or archetype-based auto-collapse. Below 1024px the rail is always collapsed. */
  const storedRail = () => { const v = store.get("pm.rail"); return v === "collapsed" || v === "expanded" ? v : null; };
  const desiredRail = () => storedRail() || (wide.matches ? "expanded" : "collapsed");

  // Names and tooltips. The collapsed rail is icon-only, so every item gets an accessible name (aria-label) and a
  // visible tooltip (data-tip, shown by the .pm-tip element below) on hover and keyboard focus.
  // A locked item's reason (hook: data-locked-reason="Opens when your private copy is ready"; a title on the item is moved
  // there on first run, so it survives) is its accessible description and its tooltip in both rail states:
  // collapsed "Interview (locked): Opens when ...", expanded the reason alone (the label is already visible).
  function labelRail(collapsed) {
    $$(RAIL_ITEM).forEach((a) => {
      const text = ($(".pm-rail-label", a) || a).textContent.trim();
      const t = a.getAttribute("title");
      if (t && !a.hasAttribute("data-locked-reason")) a.setAttribute("data-locked-reason", t);
      a.removeAttribute("title");
      const locked = a.hasAttribute("data-locked");
      const why = locked ? (a.getAttribute("data-locked-reason") || "").trim() : "";
      if (why) a.setAttribute("aria-description", why); else a.removeAttribute("aria-description");
      if (collapsed) {
        const name = locked ? text + " (locked)" : text;
        a.setAttribute("aria-label", name);
        a.setAttribute("data-tip", why ? name + ": " + why : name);
      } else {
        a.removeAttribute("aria-label");
        if (why) a.setAttribute("data-tip", why); else a.removeAttribute("data-tip");
      }
    });
    // Project tile, budget and account row carry their own accessible name; only the tooltip moves from title to data-tip.
    $$(".pm-rail .pm-rail-project, .pm-rail .pm-rail-budget, .pm-rail .pm-rail-user").forEach((el) => {
      const t = el.getAttribute("title") || el.getAttribute("data-tip-src");
      if (t) { el.setAttribute("data-tip-src", t); el.removeAttribute("title"); }
      const src = el.getAttribute("data-tip-src");
      if (src && collapsed) el.setAttribute("data-tip", src); else el.removeAttribute("data-tip");
    });
  }

  function setRail(next, opts = {}) {
    const eff = narrow.matches ? "collapsed" : next;
    root.setAttribute("data-rail", eff);
    const collapsed = eff === "collapsed";
    if (railToggle) {
      const label = narrow.matches ? "Navigation stays collapsed on narrow windows" : (collapsed ? "Expand navigation" : "Collapse navigation");
      railToggle.setAttribute("aria-expanded", String(!collapsed));
      railToggle.setAttribute("aria-label", label);
      railToggle.removeAttribute("title");
      railToggle.setAttribute("data-tip", label);
      if (!narrow.matches) railToggle.setAttribute("data-tip-key", "[");
      else railToggle.removeAttribute("data-tip-key");
    }
    labelRail(collapsed);
    if (opts.persist && !narrow.matches) store.set("pm.rail", next);
    if (tipEl && !tipEl.hidden && tipFor) showTip(tipFor); // a visible tooltip follows the state change
    root.dispatchEvent(new CustomEvent("pm:rail", { detail: eff }));
  }

  const toggleRail = () => {
    if (narrow.matches) return;
    dismissHint(); // the founder found the control: the hint has done its job
    setRail(root.getAttribute("data-rail") === "collapsed" ? "expanded" : "collapsed", { persist: true });
  };

  /* ---- First-visit hint ----
     One-time callout beside the expand button: "Menu labels are hidden. Expand navigation" with a "Got it" dismiss.
     Shown only when nothing is stored in pm.rail (the founder has never chosen), the rail defaulted to collapsed on a
     window between 1024 and 1279px (below 1024 the toggle is inert), and pm.railhint is not set. It never takes focus
     and sits beside the button, clear of the top bar's thread. Dismissing (or using the toggle) stores pm.railhint=1. */
  let hintEl = null;
  const hintWanted = () => !!railToggle && storedRail() === null && store.get("pm.railhint") !== "1" && !narrow.matches && !wide.matches;
  function placeHint() {
    if (!hintEl || hintEl.hidden || !railToggle) return;
    const r = railToggle.getBoundingClientRect();
    const h = hintEl.offsetHeight;
    const top = Math.max(4, Math.min(r.top + r.height / 2 - h / 2, innerHeight - h - 4));
    hintEl.style.left = r.right + 12 + "px";
    hintEl.style.top = top + "px";
    hintEl.style.setProperty("--pm-hint-caret", r.top + r.height / 2 - top + "px");
  }
  function dismissHint() {
    if (hintEl) { hintEl.remove(); hintEl = null; }
    store.set("pm.railhint", "1");
  }
  function syncHint() {
    if (!hintWanted() || root.getAttribute("data-rail") !== "collapsed") { if (hintEl) { hintEl.remove(); hintEl = null; } return; }
    if (!hintEl) {
      hintEl = document.createElement("div");
      hintEl.className = "pm-rail-hint";
      hintEl.setAttribute("role", "note");
      hintEl.appendChild(document.createTextNode("Menu labels are hidden. Expand navigation"));
      const b = document.createElement("button");
      b.type = "button"; b.textContent = "Got it";
      b.addEventListener("click", dismissHint);
      hintEl.appendChild(b);
      document.body.appendChild(hintEl);
    }
    placeHint();
  }
  window.addEventListener("resize", () => { syncHint(); });
  root.addEventListener("pm:rail", () => syncHint());

  /* ---- Rail tooltip: one fixed element, so the rail's overflow never clips it ---- */
  let tipEl = null, tipFor = null;
  function showTip(el) {
    const text = el.getAttribute("data-tip");
    if (!text) { hideTip(); return; }
    if (!tipEl) {
      tipEl = document.createElement("div");
      tipEl.className = "pm-tip";
      tipEl.setAttribute("aria-hidden", "true"); // the control already has its accessible name
      tipEl.hidden = true;
      document.body.appendChild(tipEl);
    }
    tipFor = el;
    tipEl.textContent = text;
    const key = el.getAttribute("data-tip-key");
    if (key) { const k = document.createElement("kbd"); k.textContent = key; tipEl.appendChild(k); }
    tipEl.hidden = false;
    const r = el.getBoundingClientRect();
    const h = tipEl.offsetHeight;
    tipEl.style.left = r.right + 8 + "px";
    tipEl.style.top = Math.max(4, Math.min(r.top + r.height / 2 - h / 2, innerHeight - h - 4)) + "px";
  }
  function hideTip() { tipFor = null; if (tipEl) tipEl.hidden = true; }
  const tipTarget = (e) => (e.target.closest ? e.target.closest(".pm-rail [data-tip]") : null);
  document.addEventListener("mouseover", (e) => { const t = tipTarget(e); if (t) showTip(t); });
  document.addEventListener("mouseout", (e) => { const t = tipTarget(e); if (t && !t.contains(e.relatedTarget)) hideTip(); });
  document.addEventListener("focusin", (e) => { const t = tipTarget(e); if (t && e.target.matches(":focus-visible")) showTip(t); else hideTip(); });
  document.addEventListener("focusout", hideTip);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTip(); });

  // Ensure exactly one pen circle exists in the rail, inside the item that carries aria-current="page".
  function ensurePen() {
    $$(".pm-rail .pm-pen").forEach((p) => { if (!p.closest('.pm-rail-item[aria-current="page"]')) p.remove(); });
    const active = $('.pm-rail .pm-rail-item[aria-current="page"] .pm-rail-label');
    if (active && !$(".pm-pen", active)) {
      active.insertAdjacentHTML("beforeend", '<svg class="pm-pen" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true" focusable="false"><ellipse cx="50" cy="16" rx="49" ry="15" vector-effect="non-scaling-stroke"></ellipse></svg>');
    }
  }

  // Roving tabindex + arrow keys between rail destinations.
  const items = () => $$(RAIL_ITEM);
  function setTabStop(target) { items().forEach((a) => a.setAttribute("tabindex", a === target ? "0" : "-1")); }
  function initRoving() {
    const list = items();
    if (!list.length) return;
    setTabStop($('.pm-rail .pm-rail-item[aria-current="page"]') || list[0]);
    document.addEventListener("focusin", (e) => { if (e.target.matches && e.target.matches(RAIL_ITEM)) setTabStop(e.target); });
    document.addEventListener("keydown", (e) => {
      const cur = e.target.closest && e.target.closest(RAIL_ITEM);
      if (!cur || e.altKey || e.ctrlKey || e.metaKey) return;
      const all = items();
      const i = all.indexOf(cur);
      const to = { ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] }[e.key];
      if (to) { e.preventDefault(); to.focus(); }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "[" || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    toggleRail();
  });
  if (railToggle) railToggle.addEventListener("click", toggleRail);
  // A locked destination stays inert until it opens; its lock glyph (and the tooltip when collapsed) says why.
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest(".pm-rail .pm-rail-item[data-locked]")) e.preventDefault(); });
  // Crossing 1024 or 1280 re-resolves the state; a stored choice is unaffected (desiredRail returns it first).
  narrow.addEventListener("change", () => setRail(desiredRail()));
  wide.addEventListener("change", () => setRail(desiredRail()));

  /* ---- Theme ---- */
  const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = () => { const t = root.getAttribute("data-theme"); return t === "dark" || t === "light" ? t : (systemDark() ? "dark" : "light"); };
  function syncThemeSwitch() { $$("[data-theme-switch]").forEach((b) => b.setAttribute("aria-checked", String(currentTheme() === "dark"))); }
  // pmTheme() returns the current theme; pmTheme("dark" | "light" | "toggle", { persist: false }) sets it.
  window.pmTheme = (next, opts = {}) => {
    if (next === undefined) return currentTheme();
    const to = next === "toggle" ? (currentTheme() === "dark" ? "light" : "dark") : next;
    if (to !== "dark" && to !== "light") return currentTheme();
    root.setAttribute("data-theme", to);
    if (opts.persist !== false) store.set("pm.theme", to);
    syncThemeSwitch();
    root.dispatchEvent(new CustomEvent("pm:theme", { detail: to }));
    return to;
  };
  $$("[data-theme-switch]").forEach((b) => b.addEventListener("click", () => window.pmTheme("toggle")));

  /* ---- Tape pin: translateX to the current step's tick centre ---- */
  let settled = false; // true once fonts are ready: only then may the pin animate
  function positionTape(tape) {
    const cur = $('li[data-state="current"]', tape);
    const pin = $(".pm-tape-pin", tape);
    if (!pin) return;
    pin.hidden = !cur;
    if (!tape.offsetWidth) { tape.removeAttribute("data-ready"); return; } // hidden tape: place it without animation when it shows
    if (cur) tape.style.setProperty("--pm-tape-x", cur.getBoundingClientRect().left - tape.getBoundingClientRect().left + 1 + "px");
    if (settled && !tape.hasAttribute("data-ready")) requestAnimationFrame(() => tape.setAttribute("data-ready", ""));
  }
  const tapes = () => $$(".pm-tape");
  function positionTapes() {
    tapes().forEach(positionTape);
  }
  // Recompute on resize and whenever a step's data-state changes (the flow prototype flips it; the pin then slides).
  function initTapes() {
    positionTapes();
    if ("ResizeObserver" in window) { const ro = new ResizeObserver(() => positionTapes()); tapes().forEach((t) => { ro.observe(t); $$("li", t).forEach((li) => ro.observe(li)); }); }
    // Nothing slides on load: the pin starts animating only after the first position, taken once fonts have settled.
    const ready = () => { settled = true; positionTapes(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
    window.addEventListener("resize", positionTapes);
    const mo = new MutationObserver(positionTapes);
    tapes().forEach((t) => mo.observe($("ol", t) || t, { attributes: true, attributeFilter: ["data-state"], subtree: true }));
  }

  /* ---- Popover placement: History opens under its invoker ---- */
  document.addEventListener("beforetoggle", (e) => {
    if (e.newState !== "open" || !e.target.classList.contains("pm-history")) return;
    const inv = $('[popovertarget="' + e.target.id + '"]');
    if (!inv) return;
    const r = inv.getBoundingClientRect();
    e.target.style.inset = r.bottom + 6 + "px auto auto " + Math.max(8, Math.min(r.left - 16, innerWidth - 396)) + "px";
  });

  /* ---- Init: read state, position, no animation ---- */
  root.classList.add("pm-no-anim");
  ensurePen();
  setRail(desiredRail());
  syncHint();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeHint);
  syncThemeSwitch();
  initRoving();
  initTapes();
  // C.3 breadcrumb collapse at any rail state: a trail of four or more crumbs whose links would be cut reads "Projects / … / leaf".
  const fitCrumbs = () => $$(".pm-crumb").forEach((nav) => {
    nav.removeAttribute("data-collapsed");
    if ($$("li", nav).length < 4) return;
    // Only the links count: the leaf keeps its own 24ch cap and ellipsis, which is not a shortage of space.
    if ($$("a", nav).some((el) => el.scrollWidth > el.clientWidth + 1)) nav.setAttribute("data-collapsed", "");
  });
  fitCrumbs();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCrumbs);
  // The top bar's width changes with the window and with the rail (also during its transition).
  if ("ResizeObserver" in window) { const cro = new ResizeObserver(() => fitCrumbs()); $$(".pm-topbar").forEach((t) => cro.observe(t)); }
  else window.addEventListener("resize", fitCrumbs);
  // A destination that locks or unlocks at runtime (13's review-only switch, flow.js) gets its name, description and tooltip again.
  const railEl = $(".pm-rail");
  if (railEl && "MutationObserver" in window) new MutationObserver(() => labelRail(root.getAttribute("data-rail") === "collapsed"))
    .observe(railEl, { attributes: true, attributeFilter: ["data-locked", "data-locked-reason"], subtree: true });
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("pm-no-anim")));

  window.pmShell = { setRail, desiredRail, positionTapes, ensurePen, toggleRail };
})();

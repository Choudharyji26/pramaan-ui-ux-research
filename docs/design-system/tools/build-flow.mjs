// Builds docs/design-system/flow.html from the 34 screens (01..23 with their b to e states): content sections, per-screen shell
// snapshots (JSON), scoped styles. Run after the last screen edit: node docs/design-system/tools/build-flow.mjs
// Then walk it: node docs/design-system/tools/walk-flow.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ds = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(ds, "../..");
const pnpm = join(repo, "node_modules/.pnpm");
const { JSDOM } = createRequire(import.meta.url)(join(pnpm, readdirSync(pnpm).find((d) => /^jsdom@/.test(d)), "node_modules/jsdom"));
// Journey order (SPEC P.8): the founder journey with its states, then Lane A (18 .. 20), then Lane B (21 .. 23b). An explicit list, not a
// file sort, because 05b and 11b come before 05 and 11 in the journey. A screen file that is not listed (or a listed one that is missing) stops the build.
const ORDER = ["01", "02", "03", "04", "05b", "05", "06", "07", "08", "09", "10", "11b", "11", "12", "13", "13b", "14", "15", "16", "17", "18", "18b", "18c", "18d", "18e", "19", "20", "21", "21b", "21c", "22", "22b", "23", "23b"];
const idOf = (f) => f.match(/^\d\d[a-z]?/)[0];
const found = readdirSync(join(ds, "screens")).filter((f) => /^\d\d[a-z]?-.*\.html$/.test(f));
const missing = ORDER.filter((n) => !found.some((f) => idOf(f) === n)), unlisted = found.filter((f) => !ORDER.includes(idOf(f)));
if (missing.length || unlisted.length) throw new Error("journey order mismatch: missing " + missing.join(",") + " unlisted " + unlisted.join(","));
const files = found.sort((a, b) => ORDER.indexOf(idOf(a)) - ORDER.indexOf(idOf(b)));
const NAMES = { "01": "Projects", "02": "New project", "03": "Overview, decision needed", "04": "Overview, paused", "05": "Interview running", "05b": "Interview, just started", "06": "Interview finished", "07": "Interview locked", "08": "Documents", "09": "Document draft", "10": "Document locked", "11": "Roadmap, awaiting approval", "11b": "Roadmap, being drafted", "12": "Roadmap, approved", "13": "Sprint building", "13b": "Sprint, a check did not pass", "14": "Sprints accepted", "15": "Try it", "16": "Settings", "17": "Live logs", "18": "Hand off your code", "18b": "Hand off, from GitHub", "18c": "Hand off, file too big", "18d": "Hand off, not a .zip", "18e": "Hand off, GitHub permission", "19": "Copying your code", "20": "Your requirements", "21": "Work in a repository", "21b": "Repository, app not installed", "21c": "Repository, none found", "22": "Requests", "22b": "Requests, none yet", "23": "Request, ready to merge", "23b": "Request, check failed" };
const REFS = ["for", "aria-labelledby", "aria-describedby", "aria-controls", "popovertarget", "data-toggle-target", "data-append-reply", "form"];

const screens = files.map((f) => {
  const n = f.match(/^\d\d[a-z]?/)[0], doc = new JSDOM(readFileSync(join(ds, "screens", f), "utf8")).window.document, main = doc.querySelector("main");
  const top = main.querySelector(".pm-topbar"), strip = main.querySelector(".pm-strip"), hist = main.querySelector(".pm-history");
  const tape = top.querySelector(":scope > .pm-tape");
  const scripts = [...doc.body.querySelectorAll("script")].map((s) => s.textContent).filter((t) => !/IntersectionObserver|addEventListener\("load"|data-variant/.test(t));
  [top, strip, hist].forEach((e) => e && e.remove());
  const content = main.innerHTML.replace(/ id="pm-job"/g, " data-job");
  return { n, file: f, title: doc.title, mainClass: main.className, thread: main.getAttribute("data-thread-none"), words: main.getAttribute("data-words"),
    back: top.querySelector(".pm-back").outerHTML, crumb: top.querySelector(".pm-crumb ol").innerHTML, tape: tape ? tape.querySelector("ol").innerHTML : null, slot: top.querySelector(".pm-slot").innerHTML,
    strip: strip ? { text: strip.querySelector(".pm-strip-text").innerHTML, history: hist.querySelector("ol").innerHTML } : null,
    railNav: doc.querySelector(".pm-rail-nav").innerHTML, budget: doc.querySelector(".pm-rail-budget").outerHTML,
    styles: [...doc.querySelectorAll("style")].map((s) => s.textContent).join("\n"), scripts, content };
});

// Duplicate ids across screen content get a screen suffix, and every reference inside that screen follows.
const seen = {}; screens.forEach((s) => { const d = new JSDOM(`<body>${s.content}</body>`).window.document; s.ids = [...d.querySelectorAll("[id]")].map((e) => e.id); new Set(s.ids).forEach((i) => (seen[i] = (seen[i] || 0) + 1)); });
const renamed = [];
for (const s of screens) {
  const dom = new JSDOM(`<body>${s.content}</body>`), d = dom.window.document, body = d.body, keep = s.scripts.join("\n");
  const dup = new Set(s.ids.filter((i) => seen[i] > 1 && !keep.includes(i))), suffix = (i) => `${i}__${s.n}`;
  dup.forEach((i) => renamed.push(`${s.n}:${i}`));
  body.querySelectorAll("*").forEach((e) => {
    if (dup.has(e.id)) e.id = suffix(e.id);
    for (const a of REFS) if (e.hasAttribute(a)) e.setAttribute(a, e.getAttribute(a).split(/\s+/).map((v) => (dup.has(v) ? suffix(v) : v)).join(" "));
    for (const a of ["data-dictate", "data-for"]) if (e.hasAttribute(a)) { const v = e.getAttribute(a), hash = v[0] === "#", id = hash ? v.slice(1) : v; if (dup.has(id)) e.setAttribute(a, (hash ? "#" : "") + suffix(id)); }
    const h = e.getAttribute("href"); if (h && h[0] === "#" && dup.has(h.slice(1))) e.setAttribute("href", "#" + suffix(h.slice(1)));
  });
  // Only the visible screen may own an h1 (the probe counts every h1 in the document): others carry a placeholder that flow.js swaps.
  body.querySelectorAll("h1").forEach((h) => { if (s.n === "01") return; const p = d.createElement("div"); [...h.attributes].forEach((a) => p.setAttribute(a.name, a.value)); p.setAttribute("data-h1", ""); p.setAttribute("role", "heading"); p.setAttribute("aria-level", "1"); p.innerHTML = h.innerHTML; h.replaceWith(p); });
  s.content = body.innerHTML;
}
console.log("screens", screens.length, "renamed duplicate ids:", renamed.join(" "));

const initial = screens[0], esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const json = JSON.stringify(screens.map(({ ids, content, styles, ...d }) => d)).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028");
const skel = readFileSync(join(ds, "screens/_skeleton.html"), "utf8");
const sprite = skel.match(/<svg width="0" height="0" style="display:none"[\s\S]*?<\/svg>\s*\n\s*<div class="pm-app">/)[0].replace(/\s*<div class="pm-app">$/, "");
const rail = readFileSync(join(ds, "screens", initial.file), "utf8").match(/<aside class="pm-rail"[\s\S]*?<\/aside>/)[0];
const journey = screens.map((s) => `<li><a href="#${s.n}" data-goto="${s.n}" data-from="panel"><span class="pm-tnum pm-meta">${s.n}</span><span>${NAMES[s.n]}</span></a></li>`).join("\n          ");
const sections = screens.map((s) => `<section class="pm-flow-screen" data-screen="${s.n}" ${s.n === "01" ? "" : "hidden"}>\n${s.content}\n</section>`).join("\n");
const styles = screens.map((s) => `<style data-screen="${s.n}" media="${s.n === "01" ? "all" : "not all"}">\n${s.styles}\n</style>`).join("\n");

const html = `<!doctype html>
<html lang="en" data-rail="expanded">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pramaan · Projects</title>
<script>
  /* Before first paint: saved rail and theme (see shell.js). */
  (function () { var d = document.documentElement, r = null, t = null; try { r = localStorage.getItem("pm.rail"); t = localStorage.getItem("pm.theme"); } catch (e) {}
  if (innerWidth < 1024 || r === "collapsed" || (r !== "expanded" && innerWidth < 1280)) d.setAttribute("data-rail", "collapsed"); if (t === "dark" || t === "light") d.setAttribute("data-theme", t); })();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=JetBrains+Mono:wght@400..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="shell.css">
<link rel="stylesheet" href="components-a.css">
<link rel="stylesheet" href="components-b.css">
<link rel="stylesheet" href="components-c.css">
<link rel="stylesheet" href="showcase.css">
<style>
  /* Flow prototype only. Tokens only. Each screen's own page styles sit in style[data-screen] and are switched on for that screen. */
  .pm-flow-screen:not([hidden]) { display: contents; }
  #pm-main:focus { outline: none; }
  #pm-journey { inset: auto var(--pm-space-4) var(--pm-space-4) auto; z-index: var(--pm-z-popover); display: grid; gap: var(--pm-space-2); width: 280px; max-height: calc(100vh - var(--pm-topbar-h) - 2 * var(--pm-space-4)); padding: var(--pm-space-2); overflow: hidden; }
  /* Try it docks its buttons at the bottom right, so the Journey control moves to the bottom left there. */
  html[data-flow-screen="15"] #pm-journey { inset: auto auto var(--pm-space-4) calc(var(--pm-rail-w) + var(--pm-space-4)); }
  #pm-journey[data-open="false"] { width: auto; padding: var(--pm-space-1); }
  .pm-journey-toggle { justify-content: space-between; width: 100%; }
  .pm-journey-toggle { font-size: var(--pm-type-meta-size); line-height: var(--pm-type-meta-line); }
  #pm-journey[data-open="false"] .pm-journey-toggle { width: auto; gap: var(--pm-space-3); }
  .pm-journey-body { display: grid; gap: var(--pm-space-3); min-height: 0; overflow-y: auto; padding: var(--pm-space-1); }
  .pm-journey-note { margin: 0; padding: var(--pm-space-2) var(--pm-space-3); border-radius: var(--pm-radius-control); background: var(--pm-sys-chalk-tint); color: var(--pm-sys-chalk-text); font-size: var(--pm-type-meta-size); line-height: var(--pm-type-meta-line); letter-spacing: var(--pm-type-meta-tracking); }
  .pm-journey-note strong { display: block; font-weight: 600; }
  .pm-journey-list { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
  .pm-journey-list a { display: grid; grid-template-columns: 24px minmax(0, 1fr); align-items: center; gap: var(--pm-space-2); height: 30px; padding: 0 var(--pm-space-2); border-radius: var(--pm-radius-chip); color: var(--pm-sys-text-secondary); font-size: var(--pm-type-label-size); line-height: var(--pm-type-label-line); text-decoration: none; }
  .pm-journey-list a:hover { background: var(--pm-sys-surface-sunken); color: var(--pm-sys-text); }
  .pm-journey-list a[aria-current="step"] { background: var(--pm-sys-surface-sunken); color: var(--pm-sys-text); font-weight: 600; }
  .pm-journey-demo { display: grid; gap: var(--pm-space-1); padding-bottom: var(--pm-space-2); border-bottom: var(--pm-hairline); }
  .pm-journey-demo .pm-btn { justify-content: flex-start; }
</style>
${styles}
<script defer src="shell.js"></script>
<script defer src="components.js"></script>
<script defer src="flow.js"></script>
</head>
<body>
<a class="pm-skip" href="#pm-main">Skip to the main job</a>
${sprite}
<div class="pm-app">

  ${rail}

  <main class="pm-main${initial.mainClass.replace("pm-main", "")}" id="pm-main" tabindex="-1">
    <header class="pm-topbar">
      ${initial.back}
      <nav class="pm-crumb" aria-label="Breadcrumb"><ol>${initial.crumb}</ol></nav>
      <nav class="pm-tape" aria-label="Your journey" hidden><ol></ol><span class="pm-tape-pin" aria-hidden="true"></span></nav>
      <div class="pm-slot">${initial.slot}</div>
    </header>
    <div class="pm-strip" hidden><span class="pm-strip-text"></span><button class="pm-strip-history" type="button" popovertarget="pm-history">History</button></div>
    <div class="pm-history" id="pm-history" popover aria-label="Recently saved or accepted"><ol></ol></div>

${sections}
  </main>
</div>

<aside class="pm-popover pm-review-only" id="pm-journey" data-open="false" aria-label="Review only: journey panel for this prototype">
  <button class="pm-btn pm-btn--quiet pm-btn--sm pm-journey-toggle" type="button" id="pm-journey-toggle" aria-expanded="false" aria-controls="pm-journey-body"><span>Review only: Journey</span><span class="pm-tnum" id="pm-journey-count">1 of ${screens.length}</span></button>
  <div class="pm-journey-body" id="pm-journey-body" hidden>
    <p class="pm-journey-note" id="pm-journey-note" aria-live="polite"></p>
    <div class="pm-journey-demo">
      <button class="pm-btn pm-btn--quiet pm-btn--sm" type="button" id="pm-demo-finish">Demo: sprint finishes</button>
      <button class="pm-btn pm-btn--quiet pm-btn--sm" type="button" id="pm-demo-copy" hidden>Demo: copy finishes</button>
      <button class="pm-btn pm-btn--ghost pm-btn--sm" type="button" id="pm-demo-restart">Start over</button>
      <a class="pm-btn pm-btn--ghost pm-btn--sm" href="system.html">Open the style guide</a>
    </div>
    <nav aria-label="All ${screens.length} screens">
      <ol class="pm-journey-list">
          ${journey}
      </ol>
    </nav>
  </div>
</aside>
<div class="pm-toast-host" id="pm-toast-host"></div>

<script type="application/json" id="pm-flow-data">${json}</script>
</body>
</html>
`;
// Screen file links become in-page jumps at build time (also inside the JSON snapshots, where quotes are escaped), so the
// prototype never points at a file next to it that does not exist, even before flow.js runs.
const linked = html.replace(/href=(\\?")(\d\d[a-z]?)-[\w-]+\.html\1/g, "href=$1#$2$1 data-goto=$1$2$1");
writeFileSync(join(ds, "flow.html"), linked);
console.log("flow.html bytes", linked.length, "lines", linked.split("\n").length, "sections", (linked.match(/class="pm-flow-screen"/g) || []).length, "em dash:", /\u2014/.test(linked), "screen file links left:", (linked.match(/href=\\?"\d\d[a-z]?-[\w-]+\.html/g) || []).length);

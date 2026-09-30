// Screenshot + layout assertions for docs/design-system pages.
// Run: node docs/design-system/tools/shoot.mjs [file.html ...]   (default: every screens/*.html plus system.html and flow.html)
// Uses playwright-core with channel 'chrome' (installed Chrome). Writes PNGs to docs/design-system/shots/ and a JSON report.
import { readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dsRoot = resolve(here, "..");
const repoRoot = resolve(dsRoot, "../..");
const pnpmDir = join(repoRoot, "node_modules", ".pnpm");
const pwDir = readdirSync(pnpmDir).find((d) => /^playwright-core@/.test(d));
if (!pwDir) { console.error("playwright-core not found under node_modules/.pnpm"); process.exit(2); }
const require = createRequire(import.meta.url);
const { chromium } = require(join(pnpmDir, pwDir, "node_modules", "playwright-core"));

const args = process.argv.slice(2);
let pages = args.length ? args.map((a) => resolve(a)) : [];
if (!pages.length) {
  const screens = join(dsRoot, "screens");
  if (existsSync(screens)) pages.push(...readdirSync(screens).filter((f) => f.endsWith(".html")).map((f) => join(screens, f)));
  for (const f of ["system.html", "flow.html"]) if (existsSync(join(dsRoot, f))) pages.push(join(dsRoot, f));
}
const shots = join(dsRoot, "shots");
mkdirSync(shots, { recursive: true });
const viewports = [[1142, 732], [1440, 900]];

const probe = () => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const main = document.querySelector("main") || document.body;
  const isScroller = (el) => {
    const cs = getComputedStyle(el);
    return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
  };
  // main itself counts: on page screens main is the one scroller (SPEC C.5), so a scrolling card inside it is a second one.
  const scrollers = [main, ...main.querySelectorAll("*")].filter((el) => isScroller(el) && !el.classList.contains("pm-table-scroll"));
  const rail = document.querySelector(".pm-rail");
  const topbar = document.querySelector(".pm-topbar");
  const threads = [...document.querySelectorAll("[data-thread]")].filter((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[hidden]");
  });
  const threadTop = threads.length ? Math.min(...threads.map((t) => t.getBoundingClientRect().top)) : null;
  // Thread rule (controller ruling, 2026-09-30): the thread's box must sit fully inside the viewport, and it must not be
  // clipped or covered (hit test at its centre), so a docked footer thread (Try it checklist, composer) passes wherever it sits.
  const threadBoxes = threads.map((t) => {
    const r = t.getBoundingClientRect();
    const inside = r.top >= 0 && r.left >= 0 && r.bottom <= vh && r.right <= vw;
    const hit = inside ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
    return { label: t.textContent.trim().slice(0, 40), top: Math.round(r.top), bottom: Math.round(r.bottom), inside, visible: inside && !!hit && (hit === t || t.contains(hit)) };
  });
  // Only rendered elements count (a hidden variant's h1 or tape step is not on the screen). A visually hidden
  // (.pm-sr) h1 still renders a 1px box, so it counts.
  const shown = (el) => el.getClientRects().length > 0 && !el.closest("[hidden]");
  const visibleTapes = [...document.querySelectorAll(".pm-tape")].filter(shown);
  const inTapes = (sel) => visibleTapes.flatMap((t) => [...t.querySelectorAll(sel)]).filter(shown).length;
  const tapeSteps = inTapes("li");
  const tapeLinks = inTapes("li > a");
  const tapeLocked = inTapes("li > [aria-disabled='true']");
  const h1s = [...document.querySelectorAll("h1")].filter(shown).length;
  const crumbLinks = document.querySelectorAll(".pm-crumb a").length;
  const bodyScrolls = document.documentElement.scrollHeight > vh + 1 && /(auto|scroll|visible)/.test(getComputedStyle(document.documentElement).overflowY) && document.body.scrollHeight > vh + 1 && getComputedStyle(document.body).overflow !== "hidden";
  const emDash = /\u2014/.test(document.body.innerText);
  return {
    viewport: [vw, vh],
    horizontalOverflow: document.documentElement.scrollWidth > vw || main.scrollWidth > main.clientWidth + 1,
    railHasOwnScrollbar: rail ? rail.scrollHeight > rail.clientHeight + 1 : null,
    railHeight: rail ? rail.clientHeight : null,
    scrollerCount: scrollers.length,
    scrollers: scrollers.map((el) => (el.className || el.tagName).toString().slice(0, 60)),
    topbarPresent: !!topbar,
    topbarSticky: topbar ? ["sticky", "fixed"].includes(getComputedStyle(topbar).position) || (topbar.parentElement === main && getComputedStyle(main).overflow === "hidden") : null,
    topbarTop: topbar ? Math.round(topbar.getBoundingClientRect().top) : null,
    threadCount: threads.length,
    threadNone: main.getAttribute("data-thread-none"),
    threadTop,
    threadLabels: threads.map((t) => t.textContent.trim().slice(0, 40)),
    threadBoxes,
    h1Count: h1s,
    crumbLinks,
    tape: { steps: tapeSteps, links: tapeLinks, locked: tapeLocked },
    bodyScrolls,
    emDash,
    fontsLoaded: document.fonts ? document.fonts.check('16px "Schibsted Grotesk"') : null,
  };
};

const report = [];
const browser = await chromium.launch({ channel: "chrome" });
for (const page of pages) {
  for (const [w, h] of viewports) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
    await ctx.addInitScript(() => { try { localStorage.setItem("pm.railhint", "1"); } catch (e) {} }); // the first-visit rail hint must not appear in review shots
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(String(e)));
    p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await p.goto(pathToFileURL(page).href, { waitUntil: "load" });
    await p.evaluate(() => document.fonts && document.fonts.ready);
    await p.waitForTimeout(300);
    const r = await p.evaluate(probe);
    const name = basename(page, ".html");
    const png = join(shots, `${name}-${w}x${h}.png`);
    await p.screenshot({ path: png, fullPage: false });
    // scrolled state: scroll the main scroller and shoot again to prove the bar stays
    // main itself is a candidate first (page screens scroll main; workbench screens scroll one region inside it).
    // Scroll 400px further from where the page rests (a chat thread rests at its bottom, a page at its top).
    const scrolled = await p.evaluate(() => { const m = document.querySelector("main") || document.body; const s = [m, ...m.querySelectorAll("*")].find((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1); if (s) { s.scrollTop += 400; return { el: (s.className || s.tagName).toString().slice(0, 60), scrollTop: s.scrollTop }; } window.scrollTo(0, 400); return { el: "window", scrollTop: window.scrollY }; });
    await p.waitForTimeout(150);
    const r2 = await p.evaluate(probe);
    await p.screenshot({ path: join(shots, `${name}-${w}x${h}-scrolled.png`), fullPage: false });
    const fails = [];
    if (r.horizontalOverflow) fails.push("horizontal overflow");
    if (r.railHasOwnScrollbar) fails.push("rail has its own scrollbar");
    if (r.scrollerCount > 1) fails.push(`more than one scroller in main: ${r.scrollers.join(" | ")}`);
    if (r.topbarPresent && r.topbarSticky === false) fails.push("top bar is not sticky");
    if (r2.topbarPresent && r2.topbarTop !== null && r2.topbarTop > 0) fails.push(`top bar moved on scroll (top=${r2.topbarTop})`);
    if (r.threadCount !== 1 && !(r.threadCount === 0 && r.threadNone)) fails.push(`thread elements visible: ${r.threadCount} (${r.threadLabels.join(", ")}); a screen with no decision must declare main[data-thread-none="<status>"]`);
    if (r2.threadCount > 1) fails.push(`after scrolling, thread elements visible: ${r2.threadCount}`);
    const hidden = (boxes) => boxes.filter((b) => !b.visible).map((b) => `"${b.label}" top=${b.top} bottom=${b.bottom}${b.inside ? " (covered or clipped)" : " (outside the viewport)"}`);
    if (hidden(r.threadBoxes).length) fails.push(`thread not fully visible at scroll 0: ${hidden(r.threadBoxes).join(", ")}`);
    if (r.threadCount === 1 && r2.threadCount === 0 && !r2.threadNone) fails.push("thread disappears after scrolling main (no visible [data-thread] left)");
    if (hidden(r2.threadBoxes).length) fails.push(`thread not fully visible after scrolling: ${hidden(r2.threadBoxes).join(", ")}`);
    if (r.h1Count !== 1) fails.push(`h1 count ${r.h1Count}`);
    if (r.tape.steps && r.tape.links + r.tape.locked < r.tape.steps) fails.push(`tape: ${r.tape.links} links + ${r.tape.locked} locked of ${r.tape.steps} steps`);
    if (r.bodyScrolls) fails.push("document body scrolls (main must own the scroll)");
    if (r.emDash) fails.push("em dash found in visible text");
    if (r.fontsLoaded === false) fails.push("Schibsted Grotesk not loaded (offline?)");
    if (errors.length) fails.push("console/page errors: " + errors.slice(0, 3).join(" || "));
    report.push({ page: name, viewport: `${w}x${h}`, ok: fails.length === 0, fails, probe: r, scrolled, probeScrolled: r2 });
    console.log(`${fails.length ? "FAIL" : "ok  "} ${name} @ ${w}x${h}${fails.length ? "\n  - " + fails.join("\n  - ") : ""}`);
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(shots, "report.json"), JSON.stringify(report, null, 2));
const bad = report.filter((r) => !r.ok).length;
console.log(`\n${report.length} shots, ${bad} failing. Report: ${join(shots, "report.json")}`);
process.exit(bad ? 1 : 0);

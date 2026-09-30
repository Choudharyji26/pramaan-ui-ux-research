// Walks flow.html through the journey by clicking real controls; asserts the laws on every state and saves shots/flow-<nn>.png.
// After the founder journey it walks both lanes: Lane A (01 > 18 > 19 > 20 > 05) and Lane B (01 > 21 > 22 > 23), then the lane error and empty states.
// Run: node docs/design-system/tools/walk-flow.mjs   (after tools/build-flow.mjs). Ends with "0 failing" or exits 1.
import { readdirSync } from "node:fs"; import { createRequire } from "node:module"; import { dirname, join, resolve } from "node:path"; import { fileURLToPath, pathToFileURL } from "node:url";
const ds = resolve(dirname(fileURLToPath(import.meta.url)), ".."); const repo = resolve(ds, "../.."); const pnpm = join(repo, "node_modules/.pnpm");
const pw = readdirSync(pnpm).find((d) => /^playwright-core@/.test(d)); const require = createRequire(import.meta.url);
const { chromium } = require(join(pnpm, pw, "node_modules/playwright-core"));
const shots = join(ds, "shots");
const browser = await chromium.launch({ channel: "chrome" });
let failures = 0;
for (const [w, h] of [[1142, 732], [1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => { try { localStorage.setItem("pm.railhint", "1"); } catch (e) {} }); // first-visit rail hint stays out of the walk
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto(pathToFileURL(join(ds, "flow.html")).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const suffix = w === 1142 ? "" : "-1440";
  const state = () => p.evaluate(() => {
    const main = document.querySelector("main"), vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && !el.closest("[hidden]"); };
    const threads = [...document.querySelectorAll("[data-thread]")].filter(vis).map((t) => t.textContent.trim().slice(0, 28));
    const rail = document.querySelector(".pm-rail"), cur = document.querySelector(".pm-topbar .pm-tape li[data-state=current] .pm-tape-label");
    const sec = document.querySelector(".pm-flow-screen:not([hidden])");
    return { hash: location.hash, screen: sec && sec.dataset.screen, threads, none: main.getAttribute("data-thread-none"), h1: document.querySelectorAll("h1").length, h1v: [...document.querySelectorAll("h1")].filter(vis).length,
      hov: document.documentElement.scrollWidth > innerWidth || main.scrollWidth > main.clientWidth + 1, railScroll: rail.scrollHeight > rail.clientHeight + 1, railState: document.documentElement.getAttribute("data-rail"),
      pin: cur ? cur.textContent.replace(/Step \d, /, "").split(",")[0].trim() : null, strip: document.querySelector(".pm-strip").hidden ? null : document.querySelector(".pm-strip-text").textContent.slice(0, 60),
      toast: [...document.querySelectorAll(".pm-toast")].map((t) => t.textContent.trim()) };
  });
  async function check(label, expect) {
    await p.waitForTimeout(450);
    const s = await state(), bad = [];
    if (!(s.threads.length === 1 || (s.threads.length === 0 && s.none))) bad.push("threads " + JSON.stringify(s.threads) + " none=" + s.none);
    if (s.h1 !== 1 || s.h1v !== 1) bad.push(`h1 ${s.h1}/${s.h1v}`);
    if (s.hov) bad.push("horizontal overflow"); if (s.railScroll) bad.push("rail scrollbar");
    if (expect && s.screen !== expect) bad.push(`expected screen ${expect}`);
    console.log(`${bad.length ? "FAIL" : "ok  "} ${w} ${label.padEnd(34)} screen=${s.screen} threads=${JSON.stringify(s.threads)} none=${s.none} h1=${s.h1} pin=${s.pin} rail=${s.railState}${s.toast.length ? " toast=" + JSON.stringify(s.toast) : ""}${bad.length ? "  <- " + bad.join("; ") : ""}`);
    if (bad.length) failures++;
    await p.screenshot({ path: join(shots, `flow-${s.screen}${suffix}.png`) });
    return s;
  }
  const expect = (label, ok, detail) => { console.log(`${ok ? "ok  " : "FAIL"} ${w} ${label.padEnd(34)} ${detail === undefined ? "" : JSON.stringify(detail)}`); if (!ok) failures++; };
  const click = (sel, txt) => (txt ? p.locator(sel).filter({ hasText: txt }).first() : p.locator(sel).first()).click();
  const visClick = async (sel, txt) => { const l = p.locator(sel, txt ? { hasText: txt } : {}); const n = await l.count(); for (let i = 0; i < n; i++) { const e = l.nth(i); if (await e.isVisible()) { await e.click(); return; } } throw new Error("no visible " + sel + " " + txt); };
  const panel = async (n) => { await p.click("#pm-journey-toggle"); await p.locator(`.pm-journey-list a[data-goto="${n}"]`).click(); await p.click("#pm-journey-toggle"); };

  await check("01 projects (start)", "01");
  await click(".pm-slot a", "New project"); await check("02 new project", "02");
  await click(".pm-slot [data-thread]", "Start the interview"); await check("05b interview, just started", "05b");
  await visClick("[data-thread]", "Submit answers"); await check("05 interview running", "05");
  const before = (await state()).strip;
  await p.locator(".pm-composer-input:visible").first().fill("It is for two friends"); await p.keyboard.press("Control+Enter"); await p.waitForTimeout(200);
  const after = (await state()).strip; console.log(`     strip before: ${before} | after reply: ${after}`);
  await visClick("[data-thread]", "Submit answers"); await check("06 interview finished", "06");
  await visClick("[data-thread]", "Create my"); await check("09 document draft (toast)", "09");
  await visClick("[data-thread]", "Accept this draft"); await check("11 roadmap awaiting (toast)", "11");
  await visClick("[data-thread]", "Approve the plan and start building"); await check("12 roadmap approved", "12");
  await p.click("#pm-journey-toggle"); await p.waitForTimeout(150); await p.screenshot({ path: join(shots, `flow-journey-open${suffix}.png`) });
  await p.click("#pm-demo-finish"); await p.waitForTimeout(120);
  expect("milestone: tape stitches once", (await p.locator('.pm-topbar .pm-tape[data-milestone="sprint-ready"]').count()) === 1);
  await p.click("#pm-journey-toggle"); await check("13 build, sprint ready", "13");
  expect("milestone: the ready line shows", await p.locator('[data-milestone-line="sprint-ready"]').first().isVisible());
  await visClick("[data-thread]", "Try sprint 1"); await check("15 try it", "15");
  await visClick("[data-thread]", "Ask for changes"); await check("13 build (asked for changes)", "13");
  await p.locator(".pm-rail-item", { hasText: "Documents" }).click(); await check("08 documents via rail", "08");
  await p.locator(".pm-rail-item", { hasText: "Try it" }).click(); await check("08 locked Try it stays put", "08");
  await panel("15"); await check("15 try it (again)", "15");
  await visClick("button", "Accept anyway"); await p.waitForTimeout(120);
  expect("milestone: tape stitches on 14", (await p.locator('.pm-topbar .pm-tape[data-milestone="all-accepted"]').count()) === 1);
  await check("14 sprints accepted", "14");
  await p.locator(".pm-rail-item", { hasText: "Settings" }).click(); await check("16 settings via rail", "16");
  await p.locator(".pm-rail-item", { hasText: "Live logs" }).click(); await check("17 live logs via rail", "17");
  await p.locator(".pm-rail-item", { hasText: "All projects" }).click(); await check("01 via rail", "01");
  await p.locator('.pm-card--project[data-name="test"]').click(); await check("03 overview (card)", "03");
  await panel("11b"); await check("11b roadmap drafting (panel)", "11b");
  await panel("13b"); await check("13b sprint blocked (panel)", "13b");
  await visClick("a", "See what happened"); await check("17 via the blocked banner", "17");

  // Lane A: hand off your code
  await p.locator(".pm-rail-item", { hasText: "All projects" }).click(); await check("01 via rail (lane A)", "01");
  await visClick("a", "Hand off your code"); await check("18 hand off your code", "18");
  await visClick("[data-thread]", "Create private working copy"); await check("19 copying (toast)", "19");
  expect("19 rail: five locked destinations", (await p.locator(".pm-rail-item[data-locked]").count()) === 5, await p.locator(".pm-rail-item[data-locked]").count());
  await p.click("#pm-journey-toggle"); await p.click("#pm-demo-copy"); await p.click("#pm-journey-toggle"); await check("20 requirements (copy finished)", "20");
  await visClick("[data-thread]", "Start the interview"); await check("05 interview (from 20)", "05");
  // Lane B: work in my repository
  await p.locator(".pm-rail-item", { hasText: "All projects" }).click(); await check("01 via rail (lane B)", "01");
  await visClick("a", "Work in my repository"); await check("21 work in a repository", "21");
  await visClick("[data-thread]", "Connect repository"); const s22 = await check("22 requests", "22");
  const dest = await p.locator(".pm-rail-list .pm-rail-item").count(), tape22 = await p.locator(".pm-topbar .pm-tape").isVisible();
  expect("22 rail: three destinations", dest === 3, dest); expect("22 tape hidden", !tape22); expect("22 one visible thread", s22.threads.length === 1, s22.threads);
  await visClick("a.pm-rowlink", "Let admins archive"); await check("23 request (ready to merge)", "23");
  const steps = await p.locator(".pm-topbar .pm-tape li").count(); expect("23 tape: four steps", steps === 4, steps);
  // The lane states, by the Journey panel
  for (const n of ["18b", "18c", "18d", "18e", "21b", "21c", "22b", "23b"]) { await panel(n); await check(`${n} (panel)`, n); }
  console.log("errors:", errs);
  if (errs.length) failures++;
  await ctx.close();
}
await browser.close();
console.log(failures ? `\n${failures} failing` : "\n0 failing");
process.exit(failures ? 1 : 0);

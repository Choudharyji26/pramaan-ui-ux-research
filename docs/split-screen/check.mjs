// Verifier for the split-screen skeleton.
// Run: node docs/split-screen/check.mjs   (from pramaan-ui-ux-research, or from anywhere)
// Uses playwright-core with the installed Chrome (same launch as docs/design-system/tools/shoot.mjs).
// For all 34 ids at 1142x732 and 1440x900: layout laws, One Thread count, scrollers, console errors.
// Then a click-walk of the flow chain. Ends with "N/34 screens, M failing".
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const researchRoot = resolve(here, "../..");
const require = createRequire(import.meta.url);

function findPlaywright() {
  const roots = [researchRoot, resolve(researchRoot, "../pramaan-web"), resolve(researchRoot, "..")];
  for (const r of roots) {
    const pnpm = join(r, "node_modules", ".pnpm");
    if (existsSync(pnpm)) {
      const d = readdirSync(pnpm).find((x) => /^playwright-core@/.test(x));
      if (d) return require(join(pnpm, d, "node_modules", "playwright-core"));
    }
    const direct = join(r, "node_modules", "playwright-core");
    if (existsSync(direct)) return require(direct);
  }
  return require("playwright-core");
}
const { chromium } = findPlaywright();

const URL0 = pathToFileURL(join(here, "index.html")).href;
const IDS = ["01","02","03","04","05b","05","06","07","08","09","10","11b","11","12","13","13b","14","15","16","17","18","18b","18c","18d","18e","19","20","21","21b","21c","22","22b","23","23b"];
// Expected primary action (.primary-action) per id: its label, or null for 0 (status, blocked, working, disabled states).
const EXPECT = {
  "01":"Continue: test","02":"Start the interview","03":"Continue the interview","04":"Raise the budget",
  "05b":"Submit answers","05":"Submit answers","06":"Create my product brief","07":null,"08":null,
  "09":"Accept this draft","10":null,"11b":null,"11":"Approve the plan and start building","12":null,"13":null,"13b":null,
  "14":"Open your product","15":"Ask for changes (1)","16":null,"17":null,
  "18":"Create private working copy","18b":"Create private working copy","18c":null,"18d":null,"18e":"Give permission on GitHub","19":null,
  "20":"Start the interview","21":"Connect repository","21b":"Install the app on GitHub","21c":"Install the app on GitHub",
  "22":"Open pull request #42","22b":null,"23":"Open pull request #42","23b":null,
};
const VIEWPORTS = [[1142, 732], [1440, 900]];
const LOCKED_TRY = "Opens when sprint 1 is ready to try";

const browser = await chromium.launch({ channel: "chrome", headless: true });
let failing = 0;
const failures = [];
const note = (ok, label, detail = "") => { if (!ok) { failing++; failures.push(`${label} ${detail}`); console.log(`  FAIL ${label} ${detail}`); } return ok; };

const probe = () => {
  const vw = innerWidth, vh = innerHeight;
  const de = document.documentElement;
  const msgs = document.getElementById("msgs"), view = document.getElementById("view");
  const exempt = (el) => ["TEXTAREA", "IFRAME", "SELECT", "INPUT"].includes(el.tagName) || el.matches("[popover], dialog");
  const scrolls = (el) => { const cs = getComputedStyle(el); return (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) || (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1); };
  const vScrolls = (el) => { const cs = getComputedStyle(el); return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1; };
  const all = [...document.querySelectorAll("body *")];
  const stray = all.filter((el) => el !== msgs && el !== view && !exempt(el) && !view.contains(el) && scrolls(el) && el.getClientRects().length).map((e) => e.id || e.className || e.tagName);
  const nested = [...view.querySelectorAll("*")].filter((el) => !exempt(el) && vScrolls(el)).map((e) => e.id || e.className || e.tagName);
  const chat = document.querySelectorAll("section.chat"), right = document.querySelectorAll("section.right");
  const cr = chat[0]?.getBoundingClientRect(), rr = right[0]?.getBoundingClientRect();
  const prim = [...document.querySelectorAll(".primary-action")].filter((el) => el.getClientRects().length);
  const dock = document.getElementById("dock");
  const inRight = prim.filter((el) => el.closest("section.right")).length;
  const tapeSteps = [...document.querySelectorAll("#tape li")].filter((el) => el.getClientRects().length).length;
  return {
    screen: document.body.dataset.screen, variant: document.body.dataset.variant,
    scrollH: de.scrollHeight, scrollW: de.scrollWidth, vw, vh, bodyScrollH: document.body.scrollHeight,
    viewOverflowX: view.scrollWidth - view.clientWidth,
    chatN: chat.length, rightN: right.length, chatW: cr && Math.round(cr.width), rightLeft: rr && Math.round(rr.left), chatRight: cr && Math.round(cr.right), chatTop: cr && Math.round(cr.top), rightTop: rr && Math.round(rr.top),
    prim: prim.map((e) => e.textContent.trim()), inRight, dockKind: dock.dataset.kind, dockPrimary: dock.querySelectorAll(".primary-action").length,
    stray, nested, badge: document.getElementById("badge").textContent, viewText: view.innerText.trim().length, chatText: msgs.innerText.trim().length,
    tapeSteps, tabs: document.querySelectorAll("#tabs .tab").length, hasStatusPin: !!document.querySelector("#dock .pin") || dock.textContent.trim().length > 0,
  };
};

async function openPage(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  page.on("pageerror", (e) => errs.push(String(e)));
  return { page, errs, ctx };
}

console.log("Layout and law checks");
for (const [w, h] of VIEWPORTS) {
  for (const id of IDS) {
    const { page, errs, ctx } = await openPage(w, h);
    await page.goto(`${URL0}#s=${id}`);
    await page.waitForSelector("#view *");
    const p = await page.evaluate(probe);
    const L = `${id}@${w}`;
    const before = failing;
    note(p.screen === id, L, `data-screen=${p.screen}`);
    note(p.scrollH <= p.vh && p.bodyScrollH <= p.vh, L, `page scrolls vertically (${p.scrollH} > ${p.vh})`);
    note(p.scrollW <= p.vw, L, `horizontal overflow (${p.scrollW} > ${p.vw})`);
    note(p.viewOverflowX <= 1, L, `right view overflows horizontally by ${p.viewOverflowX}`);
    note(p.chatN === 1 && p.rightN === 1, L, `panes chat=${p.chatN} right=${p.rightN}`);
    note(Math.abs(p.chatW - 400) <= 3 && Math.abs(p.rightLeft - p.chatRight) <= 2 && p.chatTop === p.rightTop, L, `layout chat width ${p.chatW}, right left ${p.rightLeft}, chat right ${p.chatRight}`);
    note(p.prim.length <= 1, L, `more than one primary: ${JSON.stringify(p.prim)}`);
    const want = EXPECT[id];
    note(want === null ? p.prim.length === 0 : (p.prim.length === 1 && p.prim[0] === want), L, `primary ${JSON.stringify(p.prim)} expected ${JSON.stringify(want)}`);
    note(p.inRight === 0, L, "primary action inside the right panel");
    note(p.dockKind !== "status" || p.dockPrimary === 0, L, "status dock shows a primary button");
    note(p.stray.length === 0, L, `unexpected scroller(s): ${p.stray.join(",")}`);
    note(p.nested.length === 0, L, `nested scroller in right view: ${p.nested.join(",")}`);
    note(p.badge.includes(id), L, `badge "${p.badge}"`);
    note(p.viewText > 30 && p.chatText > 10, L, "empty right view or empty chat");
    note(errs.length === 0, L, `console errors: ${errs.join(" | ")}`);
    if (w === 1142) console.log(`${failing === before ? "ok  " : "FAIL"} ${id.padEnd(4)} primary=${JSON.stringify(p.prim[0] ?? null)} tape=${p.tapeSteps} tabs=${p.tabs}`);
    await ctx.close();
  }
}

// 13 ready variant (not a 35th id): reached by the drawer demo, also by #s=13&v=ready
for (const [w, h] of VIEWPORTS) {
  const { page, errs, ctx } = await openPage(w, h);
  await page.goto(`${URL0}#s=13&v=ready`);
  await page.waitForSelector("#view *");
  const p = await page.evaluate(probe);
  note(p.screen === "13" && p.variant === "ready", `13-ready@${w}`, `screen=${p.screen} variant=${p.variant}`);
  note(p.prim.length === 1 && p.prim[0] === "Try sprint 1", `13-ready@${w}`, `primary ${JSON.stringify(p.prim)}`);
  note(p.scrollH <= p.vh && p.nested.length === 0 && p.stray.length === 0 && errs.length === 0, `13-ready@${w}`, "layout or console");
  await ctx.close();
}

// Screens drawer lists all 34 ids and each link works
{
  const { page, errs, ctx } = await openPage(1142, 732);
  await page.goto(`${URL0}#s=01`);
  note(!(await page.locator("#drawer").isVisible()), "drawer", "open by default");
  await page.getByRole("button", { name: "Screens", exact: true }).click();
  note(await page.locator("#drawer").isVisible(), "drawer", "does not open");
  const links = await page.locator("#drawer a").evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  note(links.length === 34 && IDS.every((id) => links.includes(`#s=${id}`)), "drawer", `links ${links.length}`);
  const probeD = await page.evaluate(() => { const d = document.getElementById("drawer"); return d.scrollHeight <= d.clientHeight + 1; });
  note(probeD, "drawer", "drawer scrolls");
  await page.locator('#drawer a[href="#s=18c"]').click();
  note((await page.evaluate(() => document.body.dataset.screen)) === "18c", "drawer", "link did not land on 18c");
  note(!(await page.locator("#drawer").isVisible()), "drawer", "stays open after choosing");
  note(errs.length === 0, "drawer", errs.join("|"));
  await ctx.close();
}

console.log("\nClick-walk");
const screenOf = (page) => page.evaluate(() => document.body.dataset.screen);
const variantOf = (page) => page.evaluate(() => document.body.dataset.variant);
async function hop(page, label, action, expectId, expectVariant) {
  try { await action(); } catch (e) { note(false, `walk: ${label}`, `action failed: ${String(e.message).split("\n")[0]}`); return false; }
  await page.waitForTimeout(40);
  const got = await screenOf(page);
  const v = await variantOf(page);
  const ok = got === expectId && (expectVariant === undefined || v === expectVariant);
  note(ok, `walk: ${label}`, `landed on ${got}${v ? "/" + v : ""}, expected ${expectId}${expectVariant ? "/" + expectVariant : ""}`);
  if (ok) console.log(`ok   ${label} -> ${got}${v ? "/" + v : ""}`);
  return ok;
}
const btn = (page, name) => page.getByRole("button", { name, exact: true }).first();
const primary = (page) => page.locator(".primary-action").first();
const chatHas = async (page, text) => (await page.locator("#msgs").innerText()).includes(text);

{
  const { page, errs, ctx } = await openPage(1142, 732);
  const open = async (id) => { await page.goto("about:blank"); await page.goto(`${URL0}#s=${id}`); await page.waitForSelector("#view *"); };

  // Chain A: the founder journey
  await open("01");
  await hop(page, "01 Continue: test", () => primary(page).click(), "03");
  await hop(page, "03 Continue the interview", () => primary(page).click(), "05");
  await open("01");
  await hop(page, "01 chip Start a new product", () => btn(page, "Start a new product").click(), "02");
  await hop(page, "02 Start the interview", () => primary(page).click(), "05b");
  await hop(page, "05b Submit answers", () => btn(page, "Submit answers").click(), "05");
  await hop(page, "05 Submit answers", () => btn(page, "Submit answers").click(), "06");
  await hop(page, "06 Create my product brief", () => primary(page).click(), "09");
  note(await chatHas(page, "Draft 1 of your product brief is ready to read."), "walk: 09 chat", "missing toast line");
  await hop(page, "09 Accept this draft", () => primary(page).click(), "11");
  note(await chatHas(page, "Draft 1 accepted. The plan opens next."), "walk: 11 chat", "missing accepted line");
  await hop(page, "11 Approve the plan and start building", () => primary(page).click(), "12");
  note((await page.locator(".primary-action").count()) === 0, "walk: 12", "12 has a thread");
  await hop(page, "12 chip Open Build", () => btn(page, "Open Build").click(), "13");
  await hop(page, "13 drawer Demo: sprint finishes", async () => { await btn(page, "Screens").click(); await btn(page, "Demo: sprint finishes").click(); }, "13", "ready");
  await hop(page, "13-ready Try sprint 1", () => primary(page).click(), "15");
  await hop(page, "15 Accept anyway", () => btn(page, "Accept anyway").click(), "14");
  note(await chatHas(page, "Sprint 1 accepted."), "walk: 14 chat", "missing Sprint 1 accepted line");
  await btn(page, "Open your product").click();
  note((await screenOf(page)) === "14" && (await chatHas(page, "Opening your product is not part of this prototype.")), "walk: 14 Open your product", "no Waiting line");

  // Ask for changes goes back to Build with a status line
  await open("15");
  await hop(page, "15 Ask for changes (1)", () => primary(page).click(), "13");
  note(await chatHas(page, "Your notes went to Pramaan as the next fix. Sprint 1 is being fixed."), "walk: 13 chat", "missing fix line");

  // 15 verdicts: answer all, Accept sprint 1 is quiet until all answered, thread when all Yes
  await open("15");
  await page.locator('[data-check="3"] button', { hasText: "Yes" }).click();
  note((await page.locator(".primary-action").first().innerText()) === "Ask for changes (1)", "walk: 15 verdict", "primary should still be Ask for changes (1)");
  await page.locator('[data-check="2"] button', { hasText: "Yes" }).click();
  await page.locator('[data-check="4"] button', { hasText: "Yes" }).click();
  note((await primary(page).innerText()) === "Accept sprint 1" && (await page.locator(".primary-action").count()) === 1, "walk: 15 all Yes", "Accept sprint 1 thread missing");
  note(await chatHas(page, "Saved answer to check 5, Yes"), "walk: 15 chat", "verdict note missing");
  await hop(page, "15 Accept sprint 1", () => primary(page).click(), "14");

  // 04 Roadmap tab goes to 11b; tape and tabs stay in sync and post a context line
  await open("04");
  await hop(page, "04 tab Roadmap", () => page.getByRole("tab", { name: "Roadmap", exact: true }).click(), "11b");
  note(await chatHas(page, "Now showing: Roadmap"), "walk: 11b chat", "no context line");
  await hop(page, "04 Raise the budget", async () => { await open("04"); await primary(page).click(); }, "16");
  note(await page.evaluate(() => document.activeElement && document.activeElement.id === "s-budget"), "walk: 16 focus", "budget field not focused");
  await open("07");
  await hop(page, "07 tape Roadmap", () => page.locator('.step[data-step="2"]').click(), "12");
  note(await chatHas(page, "Now showing: Roadmap"), "walk: 12 chat", "no context line from tape");
  await hop(page, "12 tab Documents", () => page.getByRole("tab", { name: "Documents", exact: true }).click(), "08");
  await page.locator('.step[data-step="4"]').click();
  note((await screenOf(page)) === "08" && (await chatHas(page, LOCKED_TRY)), "walk: locked tape step", "locked step navigated or lacks reason");
  note((await page.locator('.step[data-step="4"]').getAttribute("title")) === LOCKED_TRY, "walk: locked tooltip", "wrong tooltip");

  // Settings and Logs open as right-panel views, chat stays
  await open("07");
  const before = await page.locator("#msgs").innerText();
  await hop(page, "07 top-bar Settings", () => page.locator("#btn-settings").click(), "16");
  note((await page.locator("#msgs").innerText()).includes(before.split("\n")[0]), "walk: settings chat", "chat did not stay");
  note(await chatHas(page, "Now showing: Settings"), "walk: settings ctx", "no context line");
  await hop(page, "16 top-bar Logs", () => page.locator("#btn-logs").click(), "17");
  await hop(page, "17 top-bar Logs again", () => page.locator("#btn-logs").click(), "07");

  // Lane A
  await open("01");
  await hop(page, "01 Hand off your code", () => btn(page, "Hand off your code").click(), "18");
  await hop(page, "18 choose a file (chat)", async () => { await page.locator(".split .view").getByRole("button", { name: "Choose a file", exact: true }).click(); await btn(page, "customer-portal-full.zip (312 MB)").click(); }, "18c");
  await hop(page, "18c Choose another file", async () => { await page.locator(".view").getByRole("button", { name: "Choose another file", exact: true }).click(); await btn(page, "customer-portal.rar").click(); }, "18d");
  await hop(page, "18d Choose another file", async () => { await page.locator(".view").getByRole("button", { name: "Choose another file", exact: true }).click(); await btn(page, "customer-portal.zip (38 MB)").click(); }, "18");
  await hop(page, "18 Import from GitHub", () => btn(page, "Import from GitHub").click(), "18b");
  await hop(page, "18b Use another account", () => btn(page, "Use another account").click(), "18e");
  await page.locator("#dock").getByRole("button", { name: "Give permission on GitHub" }).click();
  note((await screenOf(page)) === "18e" && (await chatHas(page, "That opens GitHub in the real product. It is not part of this prototype.")), "walk: 18e stub", "no GitHub stub line");
  await hop(page, "18e chip Upload a .zip", () => btn(page, "Upload a .zip").click(), "18");
  await hop(page, "18 Create private working copy", () => primary(page).click(), "19");
  await hop(page, "19 drawer Demo: copy finishes", async () => { await btn(page, "Screens").click(); await btn(page, "Demo: copy finishes").click(); }, "20");
  note((await btn(page, "Use this document").getAttribute("aria-disabled")) === "true", "walk: 20", "Use this document should start disabled");
  await page.locator("#f-doc").fill("What the portal must do.");
  note((await page.locator("#msgs").getByRole("button", { name: "Use this document" }).getAttribute("aria-disabled")) !== "true", "walk: 20 chip sync", "chip did not enable with the textarea");
  await hop(page, "20 Use this document", () => page.locator("#msgs").getByRole("button", { name: "Use this document" }).click(), "08", "imported");
  note((await primary(page).innerText()) === "Read the requirements", "walk: 08 imported", "docked Read the requirements missing");
  await open("20");
  await hop(page, "20 Start the interview", () => primary(page).click(), "05");
  note(await chatHas(page, "I read your code once. It stays unchanged."), "walk: 05 Lane A", "Lane A opener missing");

  // Lane B
  await open("01");
  await hop(page, "01 Work in my repository", () => btn(page, "Work in my repository").click(), "21");
  await hop(page, "21 Connect repository", () => primary(page).click(), "22");
  await hop(page, "22 row 1", () => page.locator(".view .card").first().click(), "23");
  await hop(page, "23 Back to Requests", () => btn(page, "Back to Requests").click(), "22");
  await hop(page, "22 row 2 (blocked)", () => page.locator(".view .card").nth(1).click(), "23b");
  await open("22");
  await page.locator("#msg").fill("Add dark mode");
  note((await page.locator("#send").getAttribute("class")).includes("quiet"), "walk: 22 send", "send must stay quiet");
  await page.locator("#send").click();
  note(await chatHas(page, "Request sent. Pramaan starts on a new branch.") && (await page.locator(".view").innerText()).includes("Add dark mode"), "walk: 22 send", "no Done line or new row");
  await open("22b");
  await page.locator("#msg").fill("Add dark mode");
  note((await page.locator("#send").getAttribute("class")).includes("primary-action") && (await page.locator(".primary-action").count()) === 1, "walk: 22b send", "send did not become the thread");
  await hop(page, "22b send", () => page.locator("#send").click(), "22");
  await open("21b");
  await page.locator("#dock").getByRole("button", { name: "Install the app on GitHub" }).click();
  note((await screenOf(page)) === "21b" && (await chatHas(page, "That opens GitHub in the real product. It is not part of this prototype.")), "walk: 21b stub", "no stub line");
  await open("23");
  await page.locator('.step[data-rstep="2"]').click();
  note((await page.locator('.step[data-rstep="2"]').getAttribute("title")) === "Review: 2 rounds", "walk: 23 tape", "Review tooltip");

  // 02 enables the thread only with name and idea; lane switcher chips switch lane
  await open("02");
  await page.locator("#f-name").fill("");
  note((await page.locator(".primary-action").count()) === 0, "walk: 02", "thread should be off with no name");
  await page.locator("#f-name").fill("Dues");
  note((await page.locator(".primary-action").count()) === 1, "walk: 02", "thread should be on with name and idea");
  await hop(page, "02 lane chip Work in my repository", () => page.locator(".view").getByRole("button", { name: "Work in my repository" }).click(), "21");
  // 01 search and sort
  await open("01");
  await page.locator("#pq").fill("zzzz");
  note((await page.locator("#plist").innerText()).includes("0 of 9 match 'zzzz'."), "walk: 01 search", "empty state missing");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  note((await page.locator("#plist .card").count()) === 9 && (await page.locator("#pcount").innerText()) === "9 projects", "walk: 01 clear", "list not restored");
  // 01 cards open their fixture targets
  const targets = { "test":"03", "ui test":"06", "insight-weaver-537":"22", "todo":"13", "WP VC app":"09", "provider-update-demo-npm-stack":"12", "omnibound-vlmk-craft":"12", "Todo list":"04", "test first":"14" };
  for (const [name, id] of Object.entries(targets)) {
    await open("01");
    await hop(page, `01 card ${name}`, () => page.locator("#plist .card", { has: page.locator("b", { hasText: new RegExp(`^${name.replace(/[-]/g, "\\-")}$`) }) }).click(), id);
  }

  // Nothing-is-lost strip, History popover, account popover, ask-for-changes prompts, settings, logs, sort
  await open("09");
  note((await page.locator("#strip-t").innerText()).startsWith("Last saved: your decision"), "walk: strip", "saved strip missing on 09");
  await page.locator("#btn-hist").click();
  const histRows = await page.locator("#hist li").count();
  note(await page.locator("#hist").isVisible() && histRows >= 1 && histRows <= 8, "walk: history", `popover rows ${histRows}`);
  await page.locator("#view").click({ position: { x: 5, y: 5 } });
  note(!(await page.locator("#hist").isVisible()), "walk: history", "popover did not close");
  await page.locator("#btn-acct").click();
  note(await page.locator("#sb-pop").isVisible() && (await page.locator("#sb-pop").innerText()).includes("Sign out") && (await page.locator("#sb-pop").innerText()).includes("Dark theme"), "walk: account", "account popover");
  await page.locator('#sb-pop [data-act="darkTheme"]').click();
  note(await page.evaluate(() => document.body.classList.contains("dark")), "walk: dark theme", "switch did nothing");
  await page.locator('#sb-pop [data-act="darkTheme"]').click();
  await btn(page, "Ask for changes (1)").click();
  note((await page.locator("#msgs").innerText()).includes("What should change?"), "walk: 09 ask", "no prompt");
  await page.locator("#msgs .m.card input").fill("Soften the constraint");
  await btn(page, "Send changes").click();
  note(await chatHas(page, "Soften the constraint"), "walk: 09 ask send", "reply missing");
  await open("11");
  await btn(page, "Ask for changes to the plan").click();
  note((await page.locator("#msgs").innerText()).includes("What should change in the plan?"), "walk: 11 ask", "no plan prompt");
  await btn(page, "Cancel").click();
  await open("07");
  await btn(page, "Request a revision").first().click();
  note((await page.locator("#msgs").innerText()).includes("Pramaan finishes the current sprint first, then drafts the change for you to accept."), "walk: 07 revision", "no revision prompt");
  note(await page.locator("#msg").isDisabled(), "walk: 07 composer", "composer should be disabled");
  await open("16");
  note((await btn(page, "Save name").getAttribute("aria-disabled")) === "true", "walk: 16", "Save name should start disabled");
  await page.locator("#s-name").fill("todo two");
  await btn(page, "Save name").click();
  note((await page.locator(".view").innerText()).includes("Saved 14:10"), "walk: 16 save", "no inline Saved");
  await btn(page, "Delete this project").first().click();
  note(await page.locator("#del").isVisible() && (await page.locator("#del").innerText()).includes("Keep the project"), "walk: 16 delete dialog", "dialog");
  await open("17");
  await btn(page, "Pause").click();
  note((await page.locator("#logcount").innerText()).startsWith("Paused ·") && (await btn(page, "Resume").count()) === 1, "walk: 17 pause", "paused state");
  await btn(page, "Resume").click();
  await page.locator("#lv").selectOption("Warn");
  note((await page.locator("#loglist .logrow:visible").count()) === 1, "walk: 17 filter", "level filter");
  await open("01");
  await page.locator("#psort").selectOption("name");
  note((await page.locator("#plist .card b").first().innerText()) === "insight-weaver-537", "walk: 01 sort", "sort by name");
  await open("13b");
  await hop(page, "13b See what happened", () => btn(page, "See what happened").first().click(), "17");
  note(await chatHas(page, "A check did not pass."), "walk: 17 chat stays", "chat replaced");
  note(errs.length === 0, "walk: console", errs.join(" | "));
  await ctx.close();
}

await browser.close();
const okScreens = IDS.length - new Set(failures.map((f) => (f.match(/^([0-9a-z]+)@/) || [])[1]).filter(Boolean)).size;
console.log("");
if (failures.length) console.log(`${failures.length} failed assertion(s)`);
console.log(`${okScreens}/34 screens, ${failing} failing`);
process.exit(failing ? 1 : 0);


// Assembles docs/design-system/system.html from tools/system-parts/p1, p2, p3, p3c (pass-2 components), p4 and p5 .part, the canonical sprite (screens/_skeleton.html),
// the contrast output (tools/contrast.mjs) and SPEC tables (E microcopy, F coverage). Run after editing a part, SPEC or the ladder:
//   node docs/design-system/tools/build-system.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ds = resolve(here, "..");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const part = (n) => readFileSync(join(here, "system-parts", n), "utf8");

// sprite
const skel = readFileSync(join(ds, "screens/_skeleton.html"), "utf8");
const sprite = skel.match(/<svg width="0" height="0" style="display:none"[\s\S]*?<\/svg>\s*\n\s*<div class="pm-app">/)[0].replace(/\s*<div class="pm-app">$/, "");

// contrast rows (exact tool output)
const out = execFileSync(process.execPath, [join(ds, "tools/contrast.mjs")], { encoding: "utf8", cwd: ds });
const pairRows = out.split("\n").filter((l) => /^\| [LD] /.test(l));
const chipOf = (t) => { const m = t.match(/(#[0-9a-f]{6})/); return m ? `<span class="ss-role"><i class="ss-chip" style="background:${m[1]}"></i>${t}</span>` : t; };
const tr = pairRows.map((l) => { const c = l.split("|").slice(1, -1).map((s) => s.trim()); const res = c[5] === "PASS" ? '<span class="ss-ok">PASS</span>' : '<span class="ss-info">info</span>';
  return `<tr><td>${esc(c[0])}</td><td>${chipOf(c[1])}</td><td>${chipOf(c[2])}</td><td class="ss-num">${c[3]}</td><td class="ss-num">${c[4]}</td><td>${res}</td></tr>`; });
const contrast = []; for (let i = 0; i < tr.length; i += 2) contrast.push("      " + tr.slice(i, i + 2).join(""));
const fails = (out.match(/Failures: (\d+)/) || [])[1];
console.log("contrast rows", pairRows.length, "failures", fails);

// SPEC tables
const spec = readFileSync(join(ds, "SPEC.md"), "utf8");
const section = (start, end) => spec.slice(spec.indexOf(start), spec.indexOf(end));
const rowsOf = (txt, header) => { const lines = txt.slice(txt.indexOf(header)).split("\n"); const rows = []; for (const l of lines.slice(2)) { if (!l.startsWith("|")) break; rows.push(l.split("|").slice(1, -1).map((s) => s.trim())); } return rows; };
const micro = rowsOf(section("## E. Copy rules", "## F. Coverage"), "| Place | Copy |").map((c) => `      <tr><td>${esc(c[0])}</td><td>${esc(c[1])}</td></tr>`);

// Every screen file (01 .. 23b), keyed by its id: the number plus an optional b to e suffix.
const FILES = {};
for (const f of readdirSync(join(ds, "screens")).sort()) { const m = f.match(/^(\d\d[b-e]?)-.*\.html$/); if (m) FILES[m[1]] = f.replace(/\.html$/, ""); }
const NAMES = { "01": "Projects", "02": "New project", "03": "Overview, decision needed", "04": "Overview, paused", "05": "Interview running", "05b": "Interview, just started", "06": "Interview finished", "07": "Interview locked", "08": "Documents", "09": "Document draft", "10": "Document locked", "11": "Roadmap, awaiting approval", "11b": "Roadmap, being drafted", "12": "Roadmap, approved", "13": "Sprint building", "13b": "Sprint, a check did not pass", "14": "Sprints accepted", "15": "Try it", "16": "Settings", "17": "Live logs", "18": "Hand off your code", "18b": "Hand off, from GitHub", "18c": "Hand off, file too big", "18d": "Hand off, not a .zip", "18e": "Hand off, GitHub permission", "19": "Copying your code", "20": "Your requirements", "21": "Connect a repository", "21b": "Repository, app not installed", "21c": "Repository, none found", "22": "Requests", "22b": "Requests, none yet", "23": "Request, ready to merge", "23b": "Request, check failed" };
const ids = Object.keys(NAMES).sort();
if (ids.join() !== Object.keys(FILES).sort().join()) throw new Error("screens and names differ: " + Object.keys(FILES).sort().join(" ") + " | " + ids.join(" "));
const SCREEN_RE = /\b(0[1-9]|1[0-9]|2[0-3])(b|c|d|e)?\b(-[a-z-]+)?/g;
const linkify = (t) => esc(t).replace(SCREEN_RE, (m, n, sfx, rest) => (FILES[n + (sfx || "")] ? `<a href="screens/${FILES[n + (sfx || "")]}.html">${n}${sfx || ""}${rest || ""}</a>` : m)).replace(/\bflow\b/, '<a href="flow.html">flow</a>');
let fcells = rowsOf(section("## F. Coverage matrix", "## G. Three"), "| Item | Reviewer point |").map((c) => {
  if (c.length === 3) { const [a, b] = c[0].split(": "); const r = [a, b || "", c[1], c[2]]; r.label = c[0]; return r; }
  return c;
});
const full = fcells.map((c) => `        <tr><td class="pm-mono ss-nowrap">${esc(c[0])}</td><td>${esc(c[1])}</td><td>${esc(c[2])}</td><td>${linkify(c[3])}</td></tr>`);
const per = {}; let allCount = 0; const allIds = [];
for (const c of fcells) {
  const where = c[3]; const nums = new Set([...where.matchAll(SCREEN_RE)].map((m) => m[1] + (m[2] || "")).filter((k) => FILES[k]));
  if (/\ball\b/.test(where)) { allCount++; allIds.push(c.label || c[0]); }
  for (const n of nums) (per[n] = per[n] || []).push(c.label || c[0]);
}
const summary = ids.map((n) => { const ids = per[n] || []; return `      <tr><td class="ss-nowrap"><a href="screens/${FILES[n]}.html">${n} ${NAMES[n]}</a></td><td class="ss-num">${ids.length}</td><td class="pm-mono" style="white-space:normal">${esc(ids.join(", "))}</td></tr>`; });
summary.push(`      <tr><td class="ss-nowrap">Every project screen</td><td class="ss-num">${allCount}</td><td class="pm-mono" style="white-space:normal">${esc(allIds.join(", "))}</td></tr>`);

let html = part("p1.part") + part("p2.part") + part("p3.part").replace("<!--P4-->", part("p4.part") + part("p3c.part")) + part("p5.part");
html = html.replace("<!--SPRITE-->", sprite).replace("<!--CONTRAST-->", contrast.join("\n")).replace("<!--MICROCOPY-->", micro.join("\n"))
  .replace("<!--COVERAGE_SUMMARY-->", summary.join("\n")).replace("<!--COVERAGE_FULL-->", full.join("\n")).replace("<!--COVERAGE_COUNT-->", String(fcells.length));
html = html.replace('class="pt-label pm-t-label"', 'class="pm-t-label"');
writeFileSync(join(ds, "system.html"), html);
console.log("screens listed:", ids.length, "coverage rows:", fcells.length, "screens with no row:", ids.filter((n) => !(per[n] || []).length).join(" ") || "none");
console.log("system.html lines:", html.split("\n").length, "em dash:", /\u2014/.test(html));

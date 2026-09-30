// Law 6 gate (No Dead Space) for docs/design-system pages. Pixel method, derived from the pass-2 whitespace audit.
// Run from anywhere: node docs/design-system/tools/whitespace.mjs [file.html ...] [--rail expanded|collapsed] [--quiet]
//   default: every screens/*.html (not _skeleton). Ends with "<n> failing" and exits 1 when any rule is broken.
// Method: Chrome (playwright-core, channel chrome) renders each page at 1142x732 and 1440x900 with animations frozen,
// pm.railhint=1, pm.theme=light, pm.rail unset (collapsed at 1142, expanded at 1440) unless --rail is given.
// The screenshot is decoded in a second page with canvas getImageData. A pixel is GROUND when it matches a background
// colour sampled from a rendered element (tolerance 3/255 per channel), otherwise INK. An 8x8 cell is EMPTY when all
// 64 pixels are the same ground colour. Rectangles are found on the cell grid of the content box (main minus the sticky
// top bar and the strip, inset by --pm-content-pad on the top, left and right).
// Rules (SPEC A.3 Law 6, thresholds in px; every number is a multiple of the 8px cell):
//   L6.1 first viewport: no empty rectangle >= FIRST.w x FIRST.h, except an allowlisted region (ALLOW) or a page-end
//        tail (touches the bottom of a page that does not scroll) at most TAIL_MAX tall.
//   L6.2 first viewport: the empty rectangle anchored at the content box's top-right corner is smaller than CORNER
//        (not both >= CORNER.w wide and >= CORNER.h tall), unless allowlisted.
//   L6.3 whole scroll (each scroller stepped and stitched, sticky and fixed elements masked): no empty rectangle
//        >= SCROLL.w x SCROLL.h, except allowlisted regions and a tail at most TAIL_MAX tall.
// ALLOW classifies breathing room: "sides" = left or right of the element (a deliberately centred column);
// "below" = under the element's bottom edge within its horizontal extent (a fitted side panel, the thread rest under
// the last chat message), optionally capped by max; "inside" = within the element (the preview iframe is the
// customer's app, not ours). Nothing else is exempt; a screen that needs a new exemption needs a SPEC ruling first.
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

// ---------- thresholds (Law 6) ----------
export const CELL = 8;
export const FIRST = { w: 240, h: 160 };
export const CORNER = { w: 240, h: 120 };
export const SCROLL = { w: 240, h: 240 };
export const TAIL_MAX = 240;
// Measurement tolerances of the "below" rows (calibration, RV9; not thresholds): a rectangle may start up to one cell (8px)
// above the last child's bottom (cell rounding); the chat rest may span the chat column (the scroller that holds the flow,
// whose side margins are part of the same rest) but never leaves it, so the composer below stays real content; a fitted
// panel's or the contents rail's column includes the 24px grid gutter plus one 8px cell of rounding on either side (gutter 32).
export const ALLOW = [
  { selector: ".pm-arch-task, .pm-arch-task2", where: "sides", why: "a deliberately centred column (or the centred Task-with-aside block): its side margins" },
  { selector: ".pm-chat-flow", where: "below", max: 320, column: ".pm-chat-thread", why: "thread rest between the last message and the composer" },
  { selector: ".pm-panel--fit, .pm-toc", where: "below", gutter: 32, lastColumn: true, why: "the column under a fitted side panel or the contents rail" },
  { selector: ".pm-stage-body iframe", where: "inside", why: "the preview is the customer's app, not ours" },
];

const args = process.argv.slice(2);
const quiet = args.includes("--quiet");
const railIdx = args.indexOf("--rail");
const railForce = railIdx > -1 ? args[railIdx + 1] : null;
const files = args.filter((a, i) => !a.startsWith("--") && !(railIdx > -1 && i === railIdx + 1)).map((a) => resolve(a));
let pages = files;
if (!pages.length) {
  const screens = join(dsRoot, "screens");
  pages = readdirSync(screens).filter((f) => f.endsWith(".html") && !f.startsWith("_")).sort().map((f) => join(screens, f));
}
const outDir = join(dsRoot, "shots", "whitespace");
mkdirSync(outDir, { recursive: true });
const viewports = [[1142, 732], [1440, 900]];
const FREEZE = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}";

// ---------- decoder page helpers (run inside a blank page) ----------
const DEC = () => {
  window.S = { acc: null, W: 0, H: 0, canvas: null, drawnTo: 0 };
  window.load = (b64) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = "data:image/png;base64," + b64; });
  window.pixels = async (b64) => { const im = await window.load(b64); const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d"); x.drawImage(im, 0, 0); return { w: im.width, h: im.height, d: x.getImageData(0, 0, im.width, im.height).data }; };
  window.sampleGrounds = async (b64, boxes) => {
    const p = await window.pixels(b64); const out = [];
    const px = (x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= p.w || y >= p.h) return null; const i = (y * p.w + x) * 4; return [p.d[i], p.d[i + 1], p.d[i + 2]]; };
    for (const b of boxes) {
      const pts = []; for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const q = px(b.x + 6 + (b.w - 13) * i / 6, b.y + 6 + (b.h - 13) * j / 6); if (q) pts.push(q); }
      const tally = new Map(); for (const c of pts) { const k = c.join(","); tally.set(k, (tally.get(k) || 0) + 1); }
      let best = null, n = 0; for (const [k, v] of tally) if (v > n) { n = v; best = k; }
      if (best && n >= 6) out.push(best.split(",").map(Number));
    }
    return out;
  };
  window.reset = (W, H) => { S.W = W; S.H = H; S.acc = new Uint8Array(W * H).fill(254); S.canvas = document.createElement("canvas"); S.canvas.width = W; S.canvas.height = H; S.drawnTo = 0; };
  window.addCapture = async (b64, src, dstY, masks, grounds, tol, draw) => {
    const p = await window.pixels(b64);
    const inMask = (x, y) => { for (const m of masks) if (x >= m.x && x < m.x + m.w && y >= m.y && y < m.y + m.h) return true; return false; };
    for (let y = 0; y < src.h; y++) {
      const cy = dstY + y; if (cy < 0 || cy >= S.H) continue;
      for (let x = 0; x < src.w && x < S.W; x++) {
        const sx = src.x + x, sy = src.y + y; if (sx >= p.w || sy >= p.h) continue;
        if (masks.length && inMask(sx, sy)) continue;
        const i = (sy * p.w + sx) * 4; const r = p.d[i], gg = p.d[i + 1], b = p.d[i + 2];
        let v = 0; for (let k = 0; k < grounds.length; k++) { const c = grounds[k]; if (Math.abs(c[0] - r) <= tol && Math.abs(c[1] - gg) <= tol && Math.abs(c[2] - b) <= tol) { v = k + 1; break; } }
        const j = cy * S.W + x; const a = S.acc[j];
        if (a === 254) S.acc[j] = v; else if (v === 0) S.acc[j] = 0; else if (a !== v && a !== 0) S.acc[j] = 0;
      }
    }
    if (draw) { const im = await window.load(b64); const startRow = Math.max(0, S.drawnTo - dstY); if (startRow < src.h) { S.canvas.getContext("2d").drawImage(im, src.x, src.y + startRow, src.w, src.h - startRow, 0, dstY + startRow, src.w, src.h - startRow); S.drawnTo = dstY + src.h; } }
  };
  window.cells = (y0, y1, x0, x1, cell) => {
    const cols = Math.floor((x1 - x0) / cell), rows = Math.floor((y1 - y0) / cell); const out = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const first = S.acc[(y0 + r * cell) * S.W + x0 + c * cell]; let ok = first !== 0 && first !== 254 && first !== 255;
      for (let yy = 0; ok && yy < cell; yy++) for (let xx = 0; xx < cell; xx++) { if (S.acc[(y0 + r * cell + yy) * S.W + x0 + c * cell + xx] !== first) { ok = false; break; } }
      out[r * cols + c] = ok ? 1 : 0;
    }
    return { cols, rows, arr: Array.from(out) };
  };
  window.annotate = async (rects, mode, b64) => {
    let canvas = S.canvas;
    if (mode === "img") { const im = await window.load(b64); canvas = document.createElement("canvas"); canvas.width = im.width; canvas.height = im.height; canvas.getContext("2d").drawImage(im, 0, 0); }
    const x = canvas.getContext("2d"); x.lineWidth = 3; x.font = "bold 13px Arial";
    for (const r of rects) {
      const ok = r.ok; x.fillStyle = ok ? "rgba(40,120,220,0.10)" : "rgba(230,40,40,0.16)"; x.fillRect(r.x, r.y, r.w, r.h);
      x.strokeStyle = ok ? "rgba(30,100,200,0.9)" : "rgba(220,20,20,0.95)"; x.strokeRect(r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3);
      const tw = x.measureText(r.label).width + 10; x.fillStyle = ok ? "rgba(30,100,200,0.9)" : "rgba(220,20,20,0.95)"; x.fillRect(r.x + 3, r.y + 3, tw, 20); x.fillStyle = "#fff"; x.fillText(r.label, r.x + 8, r.y + 18);
    }
    return canvas.toDataURL("image/png").split(",")[1];
  };
};

// ---------- screen page helpers ----------
const isScrollerSrc = `(el) => { const c = getComputedStyle(el); return /(auto|scroll)/.test(c.overflowY) && el.scrollHeight > el.clientHeight + 1 && !el.classList.contains("pm-table-scroll"); }`;
const PAGE_INFO = () => {
  const main = document.querySelector("main") || document.body;
  const isScroller = (el) => { const c = getComputedStyle(el); return /(auto|scroll)/.test(c.overflowY) && el.scrollHeight > el.clientHeight + 1 && !el.classList.contains("pm-table-scroll"); };
  const scrollers = [main, ...main.querySelectorAll("*")].filter(isScroller);
  const mr = main.getBoundingClientRect();
  const topbar = document.querySelector(".pm-topbar"); const tb0 = topbar ? topbar.getBoundingClientRect() : { bottom: mr.top };
  const strip = document.querySelector(".pm-strip"); const sr = strip && !strip.hidden ? strip.getBoundingClientRect() : null;
  const bottom = sr && sr.height > 0 && sr.top <= tb0.bottom + 2 ? Math.max(tb0.bottom, sr.bottom) : tb0.bottom;
  const pad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pm-content-pad")) || 24;
  return { vw: innerWidth, vh: innerHeight, mainRect: { x: mr.left, y: mr.top, w: main.clientWidth, h: main.clientHeight }, chromeBottom: Math.max(0, bottom), pad,
    scrollers: scrollers.map((el, i) => ({ i, cls: (el.className || el.tagName).toString().slice(0, 60), isMain: el === main, sh: el.scrollHeight, ch: el.clientHeight })), rail: document.documentElement.getAttribute("data-rail") };
};
const SCROLLER_BOX = (idx) => {
  const main = document.querySelector("main") || document.body;
  const isScroller = (el) => { const c = getComputedStyle(el); return /(auto|scroll)/.test(c.overflowY) && el.scrollHeight > el.clientHeight + 1 && !el.classList.contains("pm-table-scroll"); };
  const el = [main, ...main.querySelectorAll("*")].filter(isScroller)[idx]; const r = el.getBoundingClientRect();
  return { x: r.left + el.clientLeft, y: r.top + el.clientTop, w: el.clientWidth, h: el.clientHeight, sh: el.scrollHeight, st: el.scrollTop };
};
const SET_SCROLL = ([idx, top]) => {
  const main = document.querySelector("main") || document.body;
  const isScroller = (el) => { const c = getComputedStyle(el); return /(auto|scroll)/.test(c.overflowY) && el.scrollHeight > el.clientHeight + 1 && !el.classList.contains("pm-table-scroll"); };
  const el = [main, ...main.querySelectorAll("*")].filter(isScroller)[idx]; el.scrollTop = top; return el.scrollTop;
};
const GROUND_BOXES = () => {
  const main = document.querySelector("main") || document.body; const out = [];
  for (const el of [document.documentElement, document.body, main, ...main.querySelectorAll("*")]) {
    const c = getComputedStyle(el); if (c.display === "none" || c.visibility === "hidden") continue;
    if (c.backgroundColor === "rgba(0, 0, 0, 0)" || c.backgroundColor === "transparent") continue;
    const r = el.getBoundingClientRect(); if (el !== document.body && el !== document.documentElement && (r.width < 40 || r.height < 40)) continue;
    if (el.closest(".pm-rail")) continue;
    out.push({ x: r.left, y: r.top, w: r.width, h: r.height });
  }
  return out;
};
const STUCK = () => {
  const main = document.querySelector("main") || document.body; const out = [];
  for (const el of main.querySelectorAll("*")) {
    if (el.classList.contains("pm-topbar") || el.closest(".pm-topbar") || el.closest(".pm-rail")) continue;
    const c = getComputedStyle(el); if (c.position !== "sticky" && c.position !== "fixed") continue; if (c.display === "none") continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; out.push({ x: r.left - 2, y: r.top - 2, w: r.width + 4, h: r.height + 4 });
  }
  return out;
};
// Text fields are content even while empty, and so is a designed empty state (.pm-empty, D.16) (P.1 prescribes a larger main job, e.g. a 10-row textarea): their boxes are masked
// like sticky elements, so their empty interior is never counted as ground.
const FIELDS = () => {
  const main = document.querySelector("main") || document.body; const out = [];
  for (const el of main.querySelectorAll("textarea, select, input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), .pm-empty")) {
    if (el.closest("[hidden]") || getComputedStyle(el).display === "none") continue;
    const r = el.getBoundingClientRect(); if (r.width < 24 || r.height < 16) continue; out.push({ x: r.left, y: r.top, w: r.width, h: r.height });
  }
  return out;
};
const BLOCKS = () => {
  const main = document.querySelector("main") || document.body; const out = [];
  const name = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += "#" + el.id; const cl = [...el.classList].slice(0, 2); if (cl.length) s += "." + cl.join("."); return s; };
  for (const el of [main, ...main.querySelectorAll("*")]) {
    const r = el.getBoundingClientRect(); const c = getComputedStyle(el);
    if (r.width < 24 || r.height < 16 || c.display === "none" || c.visibility === "hidden") continue;
    if (el.closest("[hidden]")) continue;
    const tag = el.tagName.toLowerCase();
    const blocky = el.classList.length > 0 || /^(section|article|aside|header|footer|nav|form|table|ul|ol|h1|h2|h3|p|figure|main)$/.test(tag);
    if (!blocky || /^(svg|path|use|symbol|circle|rect|g|span|a|b|i|em|strong|li|td|tr|th|use)$/.test(tag) && el.classList.length === 0) continue;
    let depth = 0; for (let p = el; p && p !== main; p = p.parentElement) depth++;
    out.push({ sel: name(el), x: r.left, y: r.top, w: r.width, h: r.height, depth });
  }
  return out;
};
// Allowlisted element boxes in viewport coordinates (with the last child's bottom for "below").
const ALLOW_BOXES = (allow) => {
  const out = [];
  allow.forEach((a, i) => {
    document.querySelectorAll(a.selector).forEach((el) => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      if (r.width < 1 || r.height < 1 || cs.display === "none" || el.closest("[hidden]")) return;
      // "below" starts at the last rendered child's bottom (the chat rest begins under the last message, not under the flow's padding)
      // (lastBottom - 4 here and R.t >= lastBottom - 4 in allowedBy: a rectangle may start one 8px cell above the last child's bottom)
      let kids = [...el.children].filter((k) => k.getClientRects().length && !k.hidden); let lastBottom = r.bottom;
      if (kids.length) lastBottom = Math.min(r.bottom, Math.max(...kids.map((k) => k.getBoundingClientRect().bottom)) - 4);
      // "column": the rest may span the named ancestor's width (the chat column) and ends at its bottom edge (the composer is real content).
      const col = a.column && el.closest(a.column); const cr = col ? col.getBoundingClientRect() : null;
      // "sides" of a centred grid (.pm-arch-task2 fills the row; its tracks are centred): the block is the union of its children.
      let bx = { l: r.left, t: r.top, r: r.right, b: r.bottom };
      if (a.where === "sides" && kids.length) { const rs = kids.map((k) => k.getBoundingClientRect()); bx = { l: Math.min(...rs.map((q) => q.left)), t: r.top, r: Math.max(...rs.map((q) => q.right)), b: r.bottom }; }
      // "lastColumn": a fitted panel that is the last column of its grid owns the remainder to the grid's right edge (a left-aligned
      // grid such as .pm-arch-settings2 leaves one), so its "below" column reaches that edge.
      let extR = null;
      if (a.lastColumn && el.parentElement && /grid/.test(getComputedStyle(el.parentElement).display)) {
        const sibs = [...el.parentElement.children].filter((k) => k.getClientRects().length && !k.hidden);
        if (Math.max(...sibs.map((k) => k.getBoundingClientRect().right)) <= r.right + 2) extR = el.parentElement.getBoundingClientRect().right;
      }
      out.push({ rule: i, x: bx.l, y: bx.t, w: bx.r - bx.l, h: bx.b - bx.t, lastBottom, colL: cr ? cr.left : null, colR: cr ? cr.right : null, colB: cr ? cr.bottom : null, extR });
    });
  });
  return out;
};

// ---------- rectangle analysis (node side) ----------
function maximalRects(grid, cols, rows, minC, minR) {
  const heights = new Array(cols).fill(0); const found = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) heights[c] = grid[r * cols + c] ? heights[c] + 1 : 0;
    const st = [];
    for (let c = 0; c <= cols; c++) {
      const h = c === cols ? 0 : heights[c]; let start = c;
      while (st.length && st[st.length - 1][1] >= h) {
        const [sc, sh] = st.pop(); const w = c - sc;
        if (sh >= minR && w >= minC) {
          let extendable = false;
          if (r + 1 < rows) { extendable = true; for (let cc = sc; cc < c; cc++) if (!grid[(r + 1) * cols + cc]) { extendable = false; break; } }
          if (!extendable) found.push({ c0: sc, r0: r - sh + 1, c1: c, r1: r + 1 });
        }
        start = sc;
      }
      st.push([start, h]);
    }
  }
  const key = new Set(); return found.filter((f) => { const k = `${f.c0},${f.r0},${f.c1},${f.r1}`; if (key.has(k)) return false; key.add(k); return true; });
}
const area = (f) => (f.c1 - f.c0) * (f.r1 - f.r0);
function pickDistinct(rects) {
  const sorted = [...rects].sort((a, b) => area(b) - area(a)); const chosen = [];
  for (const f of sorted) {
    const overl = chosen.some((g) => { const w = Math.min(f.c1, g.c1) - Math.max(f.c0, g.c0); const h = Math.min(f.r1, g.r1) - Math.max(f.r0, g.r0); return w > 0 && h > 0 && (w * h) / Math.min(area(f), area(g)) > 0.5; });
    if (!overl) chosen.push(f);
  }
  return chosen;
}
function topRightRect(grid, cols, rows) {
  if (!grid[cols - 1]) return null;
  let best = null; const run = new Array(cols).fill(0);
  for (let c = 0; c < cols; c++) { let r = 0; while (r < rows && grid[r * cols + c]) r++; run[c] = r; }
  let minH = Infinity;
  for (let c = cols - 1; c >= 0; c--) { minH = Math.min(minH, run[c]); if (minH === 0) break; const f = { c0: c, r0: 0, c1: cols, r1: minH }; if (!best || area(f) > area(best)) best = f; }
  return best;
}
const toPx = (f, ox, oy) => ({ x: ox + f.c0 * CELL, y: oy + f.r0 * CELL, w: (f.c1 - f.c0) * CELL, h: (f.r1 - f.r0) * CELL });
function nameNeighbours(rect, blocks) {
  const R = { l: rect.x, t: rect.y, r: rect.x + rect.w, b: rect.y + rect.h };
  const containers = blocks.filter((b) => b.x <= R.l + 4 && b.y <= R.t + 4 && b.x + b.w >= R.r - 4 && b.y + b.h >= R.b - 4).sort((a, b) => a.w * a.h - b.w * b.h).slice(0, 2).map((b) => b.sel);
  const near = { above: [], below: [], left: [], right: [] }; const TOL = 28;
  for (const b of blocks) {
    const bl = b.x, bt = b.y, br = b.x + b.w, bb = b.y + b.h;
    const ox = Math.min(br, R.r) - Math.max(bl, R.l), oy = Math.min(bb, R.b) - Math.max(bt, R.t);
    if (b.x <= R.l + 4 && b.y <= R.t + 4 && br >= R.r - 4 && bb >= R.b - 4) continue;
    if (ox > 24 && Math.abs(bb - R.t) <= TOL && bb <= R.t + TOL) near.above.push({ ...b, d: Math.abs(bb - R.t), o: ox });
    if (ox > 24 && Math.abs(bt - R.b) <= TOL) near.below.push({ ...b, d: Math.abs(bt - R.b), o: ox });
    if (oy > 24 && Math.abs(br - R.l) <= TOL && br <= R.l + TOL) near.left.push({ ...b, d: Math.abs(br - R.l), o: oy });
    if (oy > 24 && Math.abs(bl - R.r) <= TOL) near.right.push({ ...b, d: Math.abs(bl - R.r), o: oy });
  }
  const pick = (a) => [...new Set(a.sort((p, q) => p.d - q.d || q.depth - p.depth || q.o - p.o).slice(0, 8).filter((b) => b.w * b.h > 3000 || b.o > 100).slice(0, 3).map((b) => b.sel))];
  return { containers, above: pick(near.above), below: pick(near.below), left: pick(near.left), right: pick(near.right) };
}
// Breathing-room classification. rect and boxes share one coordinate space.
function allowedBy(rect, boxes) {
  const R = { l: rect.x, t: rect.y, r: rect.x + rect.w, b: rect.y + rect.h };
  for (const bx of boxes) {
    const a = ALLOW[bx.rule]; const L = bx.x, T = bx.y, Rr = bx.x + bx.w, B = bx.y + bx.h;
    const vOverlap = Math.min(B, R.b) - Math.max(T, R.t) > 0;
    if (a.where === "sides" && vOverlap && (R.r <= L + 4 || R.l >= Rr - 4)) return a;
    const below = bx.lastBottom == null ? B : bx.lastBottom;
    if (a.where === "below" && R.t >= below - 4 && (!a.max || rect.h <= a.max)) {
      const g = a.gutter || 4;
      const cl = bx.colL == null ? L - g : Math.min(L, bx.colL) - 4, cr = Math.max(bx.colR == null ? Rr + g : Math.max(Rr, bx.colR) + 4, bx.extR == null ? -Infinity : bx.extR + 4);
      if (R.l >= cl && R.r <= cr && (bx.colB == null || R.b <= bx.colB + 4)) return a;
    }
    if (a.where === "inside" && R.l >= L - 4 && R.r <= Rr + 4 && R.t >= T - 4 && R.b <= B + 4) return a;
  }
  return null;
}

// ---------- main ----------
const browser = await chromium.launch({ channel: "chrome" });
const decCtx = await browser.newContext(); const dec = await decCtx.newPage(); await dec.goto("about:blank"); await dec.evaluate(DEC);
const report = []; let failing = 0;
const dedupeG = (arr) => { const out = []; for (const c of arr) if (!out.some((d) => Math.abs(d[0] - c[0]) <= 3 && Math.abs(d[1] - c[1]) <= 3 && Math.abs(d[2] - c[2]) <= 3)) out.push(c); return out; };

for (const file of pages) {
  const name = basename(file, ".html");
  for (const [vw, vh] of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    await ctx.addInitScript((rv) => { try { localStorage.setItem("pm.railhint", "1"); localStorage.setItem("pm.theme", "light"); if (rv) localStorage.setItem("pm.rail", rv); else localStorage.removeItem("pm.rail"); } catch (e) {} }, railForce);
    const p = await ctx.newPage();
    await p.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await p.addStyleTag({ content: FREEZE });
    await p.evaluate(() => document.fonts && document.fonts.ready);
    await p.waitForTimeout(400);
    const info = await p.evaluate(PAGE_INFO);
    const tag = `${name}-${vw}`;
    const fails = []; const notes = [];

    // ---- first viewport ----
    const shot0 = (await p.screenshot({ fullPage: false })).toString("base64");
    const G0 = dedupeG(await dec.evaluate(([b, bx]) => window.sampleGrounds(b, bx), [shot0, await p.evaluate(GROUND_BOXES)]));
    const padC = Math.round(info.pad / CELL) * CELL;
    // content box: main minus chrome, inset by the pad on top, left and right; the bottom edge is the viewport
    const box = { x: Math.round(info.mainRect.x) + padC, y: Math.round(info.chromeBottom) + padC, w: 0, h: 0 };
    box.w = Math.floor((Math.round(info.mainRect.x) + info.mainRect.w - padC - box.x) / CELL) * CELL;
    box.h = Math.floor((vh - box.y) / CELL) * CELL;
    await dec.evaluate(([W, H]) => window.reset(W, H), [vw, vh]);
    const fields0 = await p.evaluate(FIELDS);
    await dec.evaluate(([b, src, g, m]) => window.addCapture(b, src, 0, m, g, 3, false), [shot0, { x: 0, y: 0, w: vw, h: vh }, G0, fields0]);
    const c0 = await dec.evaluate(([a, b, c2, d, e]) => window.cells(a, b, c2, d, e), [box.y, box.y + box.h, box.x, box.x + box.w, CELL]);
    const blocks0 = await p.evaluate(BLOCKS); const allow0 = await p.evaluate(ALLOW_BOXES, ALLOW);
    const mainScrolls = info.scrollers.some((s) => s.isMain);
    const bigs = pickDistinct(maximalRects(c0.arr, c0.cols, c0.rows, FIRST.w / CELL, FIRST.h / CELL)).map((f) => toPx(f, box.x, box.y));
    const ann = [];
    for (const r of bigs) {
      const touchesBottom = r.y + r.h >= box.y + box.h - CELL;
      const a = allowedBy(r, allow0);
      let verdict;
      if (a) verdict = { ok: true, why: a.why };
      else if (touchesBottom && !mainScrolls && r.h <= TAIL_MAX) verdict = { ok: true, why: "page-end tail (page fits, <= " + TAIL_MAX + "px)" };
      else if (touchesBottom && mainScrolls) verdict = { ok: true, why: "cut by the viewport; judged in the scroll pass" };
      else verdict = { ok: false, why: "L6.1 empty rectangle >= " + FIRST.w + "x" + FIRST.h };
      const rec = { rule: "L6.1", ...r, wxh: `${r.w}x${r.h}`, ok: verdict.ok, why: verdict.why, nb: nameNeighbours(r, blocks0) };
      (verdict.ok ? notes : fails).push(rec); ann.push({ ...r, ok: verdict.ok, label: `${verdict.ok ? "ok" : "FAIL"} ${r.w}x${r.h}` });
    }
    const tr = topRightRect(c0.arr, c0.cols, c0.rows);
    if (tr) {
      const r = toPx(tr, box.x, box.y); const a = allowedBy(r, allow0);
      const bad = r.w >= CORNER.w && r.h >= CORNER.h && !a;
      const rec = { rule: "L6.2", ...r, wxh: `${r.w}x${r.h}`, ok: !bad, why: bad ? `L6.2 top-right corner empty >= ${CORNER.w}x${CORNER.h}` : (a ? a.why : "corner smaller than the threshold"), nb: nameNeighbours(r, blocks0) };
      (bad ? fails : notes).push(rec); if (bad || (r.w >= 100 && r.h >= 80)) ann.push({ ...r, ok: !bad, label: `${bad ? "FAIL" : "ok"} top-right ${r.w}x${r.h}` });
    }
    const rawPath = join(outDir, `${tag}-first.png`); writeFileSync(rawPath, Buffer.from(shot0, "base64"));
    if (ann.length) { const a = await dec.evaluate(([r, b]) => window.annotate(r, "img", b), [ann, shot0]); writeFileSync(join(outDir, `${tag}-first-annot.png`), Buffer.from(a, "base64")); }

    // ---- whole scroll of each scroller ----
    for (const s of info.scrollers) {
      const box0 = await p.evaluate(SCROLLER_BOX, s.i);
      const region = s.isMain ? { x: box.x, y: box.y, w: box.w, h: vh - box.y } : { x: Math.round(box0.x), y: Math.round(box0.y), w: Math.floor(box0.w / CELL) * CELL, h: Math.min(box0.h, vh - Math.round(box0.y)) };
      if (region.h < 100 || region.w < 100) continue;
      const contentH = box0.sh, contentTop = s.isMain ? box.y : 0;
      await p.evaluate(SET_SCROLL, [s.i, 0]); await p.waitForTimeout(120);
      const maxTop = contentH - box0.h; const step = Math.max(160, Math.round(region.h * 0.6)); const tops = []; for (let t = 0; t < maxTop; t += step) tops.push(t); tops.push(maxTop);
      const caps = []; let G = [...G0];
      for (const t of tops) {
        const at = await p.evaluate(SET_SCROLL, [s.i, t]); await p.waitForTimeout(120);
        const png = (await p.screenshot({ fullPage: false })).toString("base64");
        G = dedupeG([...G, ...(await dec.evaluate(([b, bx]) => window.sampleGrounds(b, bx), [png, await p.evaluate(GROUND_BOXES)]))]);
        caps.push({ png, at, masks: [...(await p.evaluate(STUCK)), ...(await p.evaluate(FIELDS))] });
      }
      await dec.evaluate(([W, Hh]) => window.reset(W, Hh), [region.w, Math.max(contentH, 1)]);
      for (const cp of caps) await dec.evaluate(([b, src, dy, m, g]) => window.addCapture(b, src, dy, m, g, 3, true), [cp.png, region, s.isMain ? region.y + cp.at : cp.at, cp.masks, G]);
      const cs = await dec.evaluate(([a, b, c2, d, e]) => window.cells(a, b, c2, d, e), [contentTop, contentH, 0, region.w, CELL]);
      await p.evaluate(SET_SCROLL, [s.i, 0]); await p.waitForTimeout(100);
      const bt = await p.evaluate(SCROLLER_BOX, s.i);
      const dy = s.isMain ? 0 : bt.y;
      const shift = (b) => ({ ...b, x: b.x - region.x, y: b.y - dy, lastBottom: b.lastBottom == null ? undefined : b.lastBottom - dy, extR: b.extR == null ? null : b.extR - region.x,
        colL: b.colL == null ? null : b.colL - region.x, colR: b.colR == null ? null : b.colR - region.x, colB: b.colB == null ? null : b.colB - dy + (s.isMain ? 0 : box0.sh - box0.h) }); // content coordinates at scroll 0; a column's bottom inside its own scroller is the content end
      const blocksC = (await p.evaluate(BLOCKS)).map(shift); const allowC = (await p.evaluate(ALLOW_BOXES, ALLOW)).map(shift);
      const rects = pickDistinct(maximalRects(cs.arr, cs.cols, cs.rows, SCROLL.w / CELL, SCROLL.h / CELL)).map((f) => toPx(f, 0, contentTop));
      const ann2 = [];
      for (const r of rects) {
        const tail = r.y + r.h >= contentH - CELL * 2; const a = allowedBy(r, allowC);
        let verdict;
        if (a) verdict = { ok: true, why: a.why };
        else if (tail && r.h <= TAIL_MAX) verdict = { ok: true, why: "content-end tail (<= " + TAIL_MAX + "px)" };
        else verdict = { ok: false, why: `L6.3 empty rectangle >= ${SCROLL.w}x${SCROLL.h} in the scroll of ${s.cls}${tail ? " (a tail taller than " + TAIL_MAX + ")" : ""}` };
        const rec = { rule: "L6.3", scroller: s.cls, ...r, wxh: `${r.w}x${r.h}`, tail, ok: verdict.ok, why: verdict.why, nb: nameNeighbours(r, blocksC) };
        (verdict.ok ? notes : fails).push(rec); ann2.push({ ...r, ok: verdict.ok, label: `${verdict.ok ? "ok" : "FAIL"} ${r.w}x${r.h}${tail ? " tail" : ""}` });
      }
      if (ann2.length && contentH > vh + 20) { const a = await dec.evaluate(([r]) => window.annotate(r, "canvas"), [ann2]); writeFileSync(join(outDir, `${tag}-scroll${info.scrollers.length > 1 ? "-s" + s.i : ""}-annot.png`), Buffer.from(a, "base64")); }
    }
    report.push({ page: name, viewport: `${vw}x${vh}`, rail: info.rail, ok: fails.length === 0, fails, notes });
    if (fails.length) failing++;
    const line = (f) => `${f.rule} ${f.wxh} @${f.x},${f.y}${f.scroller ? " in " + f.scroller : ""}: ${f.why}; inside ${f.nb.containers.join(" > ") || "main"}; above ${f.nb.above.join(", ") || "-"}; left ${f.nb.left.join(", ") || "-"}`;
    console.log(`${fails.length ? "FAIL" : "ok  "} ${name} @ ${vw}x${vh} [rail ${info.rail}]${fails.length ? "\n  - " + fails.map(line).join("\n  - ") : ""}${!quiet && notes.length ? "\n  · " + notes.map((n) => `${n.rule} ${n.wxh} ok: ${n.why}`).join("\n  · ") : ""}`);
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 1));
console.log(`\n${report.length} checks, ${failing} failing. Thresholds: first ${FIRST.w}x${FIRST.h}, corner ${CORNER.w}x${CORNER.h}, scroll ${SCROLL.w}x${SCROLL.h}, tail <= ${TAIL_MAX}. Report: ${join(outDir, "report.json")}`);
process.exit(failing ? 1 : 0);

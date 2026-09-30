// OKLCH -> sRGB hex + WCAG contrast table for the Pramaan design system tokens.
// Usage: node contrast.mjs  (prints token hex table and pair table)
function oklchToRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const gam = (x) => { x = Math.min(1, Math.max(0, x)); return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055; };
  return [gam(r), gam(g), gam(bb)].map((x) => Math.round(x * 255));
}
const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
function lum([r, g, b]) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
function contrast(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }

// Reference tokens: name -> [L%, C, h]
export const ref = {
  "ink-950": [15, 0.012, 260], "ink-900": [21, 0.014, 260], "ink-800": [29, 0.014, 260], "ink-700": [38, 0.012, 260],
  "ink-600": [46, 0.010, 260], "ink-500": [50, 0.010, 260], "ink-400": [64, 0.010, 260], "ink-300": [78, 0.008, 260],
  "ink-200": [87, 0.006, 260], "ink-100": [93, 0.005, 260], "ink-50": [97.3, 0.003, 260], "ink-0": [100, 0, 0],
  "thread-500": [88, 0.175, 96], "thread-600": [79, 0.160, 90], "thread-700": [50, 0.115, 80], "thread-800": [40, 0.095, 78],
  "chalk-700": [42, 0.085, 245], "chalk-600": [50, 0.090, 245], "chalk-400": [72, 0.070, 245], "chalk-300": [82, 0.050, 245], "chalk-100": [94, 0.020, 245], "chalk-50": [97, 0.010, 245],
  "moss-600": [47, 0.120, 150], "moss-400": [74, 0.130, 150], "moss-100": [94, 0.045, 150], "moss-900": [27, 0.050, 150],
  "clay-600": [52, 0.135, 45], "clay-400": [74, 0.120, 50], "clay-100": [94, 0.035, 45], "clay-900": [28, 0.050, 45],
  "red-600": [48, 0.170, 27], "red-400": [72, 0.150, 25], "red-100": [94, 0.035, 27], "red-900": [27, 0.060, 27],
};
const rgb = {}; for (const k in ref) rgb[k] = oklchToRgb(ref[k][0] / 100, ref[k][1], ref[k][2]);

// Semantic pairs to verify: [label, fg, bg, min]
const pairs = [
  // light theme text
  ["L text on ground", "ink-900", "ink-50", 4.5], ["L text on raised", "ink-900", "ink-0", 4.5],
  ["L muted on ground", "ink-600", "ink-50", 4.5], ["L muted on raised", "ink-600", "ink-0", 4.5],
  ["L meta on ground", "ink-500", "ink-50", 4.5], ["L meta on raised", "ink-500", "ink-0", 4.5], ["L meta on sunken", "ink-500", "ink-100", 4.5],
  ["L text on sunken", "ink-900", "ink-100", 4.5],
  ["L link/thread text on raised", "thread-700", "ink-0", 4.5], ["L thread text on ground", "thread-700", "ink-50", 4.5],
  ["L ink on thread button", "ink-900", "thread-500", 4.5], ["L ink on thread hover", "ink-900", "thread-600", 4.5],
  ["L thread button edge vs raised (UI)", "ink-900", "ink-0", 3], ["L thread fill vs raised (UI, not relied on)", "thread-500", "ink-0", 1],
  ["L control border vs raised (UI)", "ink-400", "ink-0", 3], ["L control border vs ground (UI)", "ink-400", "ink-50", 3],
  ["L chalk text on raised", "chalk-700", "ink-0", 4.5], ["L chalk text on chalk tint", "chalk-700", "chalk-100", 4.5], ["L chalk pin vs raised (UI)", "chalk-600", "ink-0", 3],
  ["L moss text on raised", "moss-600", "ink-0", 4.5], ["L moss text on moss tint", "moss-600", "moss-100", 4.5], ["L moss pin vs raised (UI)", "moss-600", "ink-0", 3],
  ["L clay text on raised", "clay-600", "ink-0", 4.5], ["L clay text on clay tint", "clay-600", "clay-100", 4.5], ["L clay pin vs raised (UI)", "clay-600", "ink-0", 3],
  ["L red text on raised", "red-600", "ink-0", 4.5], ["L red text on red tint", "red-600", "red-100", 4.5], ["L red pin vs raised (UI)", "red-600", "ink-0", 3],
  ["L ink text on tint moss", "ink-900", "moss-100", 4.5], ["L ink text on tint chalk", "ink-900", "chalk-100", 4.5], ["L ink text on tint clay", "ink-900", "clay-100", 4.5], ["L ink text on tint red", "ink-900", "red-100", 4.5],
  ["L white on ink button", "ink-0", "ink-900", 4.5], ["L ink-300 on ink-900 rail muted", "ink-300", "ink-900", 4.5],
  ["L rail text on rail", "ink-100", "ink-900", 4.5], ["L rail muted on rail", "ink-300", "ink-900", 4.5], ["L rail active bg ink-800 vs rail (info, boundary is the pen circle)", "ink-800", "ink-900", 1],
  ["L thread on rail (UI)", "thread-500", "ink-900", 3], ["L ink on thread on rail", "ink-900", "thread-500", 4.5],
  ["L focus ring ink vs ground (UI)", "ink-900", "ink-50", 3], ["L placeholder on raised", "ink-500", "ink-0", 4.5],
  ["L ink-700 secondary text on raised", "ink-700", "ink-0", 4.5], ["L hairline ink-200 vs raised (decorative)", "ink-200", "ink-0", 1],
  // dark theme
  ["D text on ground", "ink-100", "ink-950", 4.5], ["D text on raised", "ink-100", "ink-900", 4.5], ["D muted on raised", "ink-300", "ink-900", 4.5], ["D muted on ground", "ink-300", "ink-950", 4.5],
  ["D meta ink-400 on raised", "ink-400", "ink-900", 4.5], ["D text on sunken ink-800", "ink-100", "ink-800", 4.5], ["D meta on sunken ink-800", "ink-300", "ink-800", 4.5],
  ["D ink on thread button", "ink-950", "thread-500", 4.5], ["D thread fill vs raised (UI)", "thread-500", "ink-900", 3], ["D thread text thread-600 on raised", "thread-600", "ink-900", 4.5],
  ["D control border ink-400 vs raised (UI)", "ink-400", "ink-900", 3], ["D control border ink-400 vs ground (UI)", "ink-400", "ink-950", 3],
  ["D chalk-400 text on raised", "chalk-400", "ink-900", 4.5], ["D chalk-300 text on raised", "chalk-300", "ink-900", 4.5], ["D chalk-400 pin vs raised (UI)", "chalk-400", "ink-900", 3],
  ["D moss-400 text on raised", "moss-400", "ink-900", 4.5], ["D moss-400 on moss-900 tint", "moss-400", "moss-900", 4.5], ["D ink-100 on moss-900", "ink-100", "moss-900", 4.5],
  ["D clay-400 text on raised", "clay-400", "ink-900", 4.5], ["D clay-400 on clay-900 tint", "clay-400", "clay-900", 4.5], ["D ink-100 on clay-900", "ink-100", "clay-900", 4.5],
  ["D red-400 text on raised", "red-400", "ink-900", 4.5], ["D red-400 on red-900 tint", "red-400", "red-900", 4.5], ["D ink-100 on red-900", "ink-100", "red-900", 4.5],
  ["D focus ring ink-100 vs ground (UI)", "ink-100", "ink-950", 3], ["D ink-950 on ink-100 inverse button", "ink-950", "ink-100", 4.5],
  // status labels on their own tint (rulings 2026-09-30): every status-* token on its -tint, both themes
  ["L Needs-you label on tint", "ink-900", "ink-100", 4.5], ["L Working label on tint", "chalk-600", "chalk-100", 4.5],
  ["L Waiting label on ink-50 tint", "ink-500", "ink-50", 4.5], ["L Waiting label on raised", "ink-500", "ink-0", 4.5],
  ["L Done label on tint", "moss-600", "moss-100", 4.5], ["L Paused label on tint", "clay-600", "clay-100", 4.5],
  ["L Blocked label on tint", "red-600", "red-100", 4.5], ["L Locked label on tint", "ink-500", "ink-100", 4.5],
  ["D Needs-you label on tint", "ink-100", "ink-800", 4.5], ["D Working label on tint", "chalk-400", "ink-800", 4.5],
  ["D Waiting label on tint", "ink-400", "ink-900", 4.5], ["D Done label on tint", "moss-400", "moss-900", 4.5],
  ["D Paused label on tint", "clay-400", "clay-900", 4.5], ["D Blocked label on tint", "red-400", "red-900", 4.5],
  ["D Locked label on tint dark", "ink-400", "ink-900", 4.5],
  // pairs found in review (RV2 to RV6): status text on the page ground, disabled and muted text on sunken, button hovers
  ["L Working text on ground", "chalk-600", "ink-50", 4.5], ["L Done text on ground", "moss-600", "ink-50", 4.5],
  ["L Paused text on ground", "clay-600", "ink-50", 4.5], ["L Blocked text on ground", "red-600", "ink-50", 4.5],
  ["D Working text on ground", "chalk-400", "ink-950", 4.5], ["D Done text on ground", "moss-400", "ink-950", 4.5],
  ["D Paused text on ground", "clay-400", "ink-950", 4.5], ["D Blocked text on ground", "red-400", "ink-950", 4.5],
  ["L muted or disabled text on sunken", "ink-600", "ink-100", 4.5], ["L ghost button text on ground", "ink-700", "ink-50", 4.5],
  ["L ink button hover (text on ink-700)", "ink-0", "ink-700", 4.5], ["D ink button hover (text on ink-300)", "ink-950", "ink-300", 4.5],
  ["D ink on thread hover", "ink-950", "thread-600", 4.5],
  // finding 7 (2026-09-30): the dark rail is lifted one ink step (rail ink-900, active ink-800, seam ink-700) so it separates from the ink-950 ground
  ["D rail text on rail (ink-900)", "ink-100", "ink-900", 4.5], ["D rail muted on rail (ink-900)", "ink-300", "ink-900", 4.5],
  ["D rail text on rail active (ink-800)", "ink-100", "ink-800", 4.5], ["D rail muted on rail active (ink-800)", "ink-300", "ink-800", 4.5],
  ["D pen circle chalk-300 on rail (UI)", "chalk-300", "ink-900", 3], ["D pen circle chalk-300 on rail active (UI)", "chalk-300", "ink-800", 3],
  ["D thread pin on rail (UI)", "thread-500", "ink-900", 3], ["D focus ring chalk-300 on rail (UI)", "chalk-300", "ink-900", 3],
  ["D rail seam ink-700 vs rail (UI, decorative)", "ink-700", "ink-900", 1], ["D rail ink-900 vs page ground ink-950 (info, edge is the seam and the shadowless step)", "ink-900", "ink-950", 1],
  ["D rail edge ink-700 vs ground ink-950 (UI)", "ink-700", "ink-950", 1.5],
  ["L pen circle chalk-300 on rail active (UI)", "chalk-300", "ink-800", 3],
  // rail tooltip: inverse pair in both themes
  ["L tooltip text on ink-900", "ink-0", "ink-900", 4.5], ["D tooltip text on ink-100", "ink-950", "ink-100", 4.5],
];
let out = "| Token | OKLCH | Hex |\n|---|---|---|\n";
for (const k in ref) out += `| --pm-ref-${k} | oklch(${ref[k][0]}% ${ref[k][1]} ${ref[k][2]}) | ${hex(rgb[k])} |\n`;
out += "\n| Pair | Foreground | Background | Ratio | Min | Result |\n|---|---|---|---|---|---|\n";
let fails = 0;
for (const [label, fg, bg, min] of pairs) { const c = contrast(rgb[fg], rgb[bg]); const ok = c >= min; if (!ok && min > 1) fails++; out += `| ${label} | ${fg} ${hex(rgb[fg])} | ${bg} ${hex(rgb[bg])} | ${c.toFixed(2)}:1 | ${min} | ${min > 1 ? (ok ? "PASS" : "FAIL") : "info"} |\n`; }
out += `\nFailures: ${fails}\n`;
console.log(out);

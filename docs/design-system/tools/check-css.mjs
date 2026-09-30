// Stylesheet gate for docs/design-system. Run: node docs/design-system/tools/check-css.mjs
// 1. lightningcss compile of every .css under docs/design-system (cssModules: false)
// 2. forbid `:global {` block form and unbalanced comment markers
// 3. forbid hex/rgb literals and --pm-ref-* references outside tokens.css
// 4. the two dark blocks in tokens.css (data-theme and prefers-color-scheme) are identical and match tools/gen-theme.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dsRoot = resolve(here, "..");
const repoRoot = resolve(dsRoot, "../..");
const pnpmDir = join(repoRoot, "node_modules", ".pnpm");
const lcDir = readdirSync(pnpmDir).find((d) => /^lightningcss@/.test(d));
if (!lcDir) { console.error("lightningcss not found under node_modules/.pnpm"); process.exit(2); }
const require = createRequire(import.meta.url);
const lightningcss = require(join(pnpmDir, lcDir, "node_modules", "lightningcss"));

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name === "shots" || name === "tools") continue;
    if (statSync(p).isDirectory()) walk(p, out); else if (name.endsWith(".css")) out.push(p);
  }
  return out;
}

const files = walk(dsRoot);
let failures = 0;
for (const file of files) {
  const rel = relative(dsRoot, file);
  const code = readFileSync(file);
  const text = code.toString("utf8");
  const problems = [];
  try {
    lightningcss.transform({ filename: rel, code, minify: false, cssModules: false, errorRecovery: false });
  } catch (e) { problems.push("lightningcss: " + e.message); }
  if (/:global\s*\{/.test(text)) problems.push("uses `:global {` block form");
  const opens = (text.match(/\/\*/g) || []).length, closes = (text.match(/\*\//g) || []).length;
  if (opens !== closes) problems.push(`comment markers unbalanced (/* x${opens}, */ x${closes})`);
  const isTokens = /(^|[\\/])tokens\.css$/.test(file);
  if (!isTokens) {
    const hex = text.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (hex) problems.push("hex literal(s) outside tokens.css: " + [...new Set(hex)].slice(0, 6).join(" "));
    const raw = text.match(/\b(rgba?|hsla?|oklch|oklab)\(/g);
    if (raw) problems.push("raw colour function(s) outside tokens.css: " + [...new Set(raw)].join(" "));
    const refs = text.match(/--pm-ref-[a-z0-9-]+/g);
    if (refs) problems.push("--pm-ref-* referenced outside tokens.css: " + [...new Set(refs)].slice(0, 6).join(" "));
  }
  if (problems.length) { failures++; console.log(`FAIL ${rel}\n  - ` + problems.join("\n  - ")); }
  else console.log(`ok   ${rel}`);
}
const { checkTheme } = await import("./gen-theme.mjs");
const themeProblems = checkTheme(readFileSync(join(dsRoot, "tokens.css"), "utf8"));
if (themeProblems.length) { failures++; console.log("FAIL tokens.css dark blocks\n  - " + themeProblems.join("\n  - ")); }
else console.log("ok   tokens.css dark blocks (data-theme and prefers-color-scheme) are identical and match gen-theme.mjs");
console.log(`\n${files.length} stylesheet(s) checked, ${failures} failing.`);
process.exit(failures ? 1 : 0);

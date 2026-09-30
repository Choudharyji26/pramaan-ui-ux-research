# WP1: tokens.css and base.css (Tape and Thread design system)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Precision matters: follow the numbers in the SPEC literally.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md` sections B.1 to B.9 (tokens), A (the laws, for context), D.1 and D.5 (so component tokens have the right names).
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` section 3 (checks and report format).
3. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\tools\contrast.mjs` (the reference ladder; its hex output is the source of truth for the hex fallbacks).

## Write

### `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\tokens.css`

- Header comment: `/* Tape and Thread tokens. Layers: --pm-ref-* (raw), --pm-sys-* (roles), --pm-cmp-* (component). Only this file may contain colour literals. */` (make sure the comment contains exactly one `*/`).
- `:root { ... }` with every `--pm-ref-*` colour from SPEC B.1 as `oklch(...)` with the hex fallback declared first on the line above it (`--pm-ref-ink-900: #15181f; --pm-ref-ink-900: oklch(21% 0.014 260);` is the pattern: the second declaration wins where OKLCH is supported).
- All `--pm-sys-*` tokens from SPEC B.3 (light values) referencing `--pm-ref-*` only. Include `--pm-sys-scrim`.
- Type tokens: `--pm-font-text: "Schibsted Grotesk", "Segoe UI", system-ui, sans-serif;` `--pm-font-mono: "JetBrains Mono", ui-monospace, Consolas, monospace;` and for each of the 7 steps in B.4: `--pm-type-<step>-size`, `-line`, `-weight`, `-tracking` (e.g. `--pm-type-digits-size: 28px; --pm-type-digits-line: 32px; --pm-type-digits-weight: 600; --pm-type-digits-tracking: -0.01em`).
- Spacing `--pm-space-1` to `--pm-space-10`, radii, `--pm-hairline`, motion, easing, shadows, z-index, layout constants from B.5, B.6, B.8, B.9 with the exact names given there. `--pm-content-pad` and `--pm-panel-w` and `--pm-toc-w` get their 1440 values inside `@media (min-width: 1440px) { :root { ... } }`.
- Component tokens (lazy layer; only these): `--pm-cmp-button-thread-bg`, `--pm-cmp-button-thread-fg`, `--pm-cmp-button-thread-border`, `--pm-cmp-button-ink-bg`, `--pm-cmp-button-ink-fg`, `--pm-cmp-button-quiet-border`, `--pm-cmp-button-h`, `--pm-cmp-button-radius`, `--pm-cmp-tape-tick`, `--pm-cmp-tape-pin`, `--pm-cmp-tape-done`, `--pm-cmp-pin-size: 10px`, `--pm-cmp-card-pad: 16px`, `--pm-cmp-row-h: var(--pm-row-h)`. Each points at a `--pm-sys-*` token.
- Dark theme: `:root[data-theme="dark"] { ...all --pm-sys-* dark values from B.3... }` and the guarded media block: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ...same values... } }`. Never use the `:global` form, never nest rules.
- Density: `[data-density="compact"] { --pm-row-h: 36px; --pm-cell-pad-y: 8px; --pm-cell-pad-x: 12px; --pm-type-body-size: 14px; --pm-type-body-line: 20px; }` and the comfortable defaults `--pm-cell-pad-y: 12px; --pm-cell-pad-x: 16px` in `:root`.
- `color-scheme: light` on `:root` and `color-scheme: dark` in the dark blocks.

### `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\base.css`

- Imports nothing (each HTML links tokens.css then base.css). A short reset: `*, *::before, *::after { box-sizing: border-box }`, margins zeroed on body/headings/p/ul/ol/dl/figure, `img, svg { display: block; max-width: 100% }`, `button, input, select, textarea { font: inherit; color: inherit }`.
- `html, body { height: 100%; }` `body { margin: 0; background: var(--pm-sys-ground); color: var(--pm-sys-text); font-family: var(--pm-font-text); font-size: var(--pm-type-body-size); line-height: var(--pm-type-body-line); -webkit-font-smoothing: antialiased; overflow: hidden; }` (the body never scrolls; `main` does).
- Type utilities, one class per step: `.pm-t-digits, .pm-t-title, .pm-t-heading, .pm-t-reading, .pm-t-body, .pm-t-label, .pm-t-meta` setting size/line/weight/tracking from tokens; `.pm-t-digits, .pm-t-meta, .pm-num { font-variant-numeric: tabular-nums lining-nums }`; `.pm-mono { font-family: var(--pm-font-mono); font-size: var(--pm-type-meta-size); line-height: var(--pm-type-meta-line) }`; `h1 { .pm-t-title values } h2 { heading } h3 { body size, weight 600 }`; `.pm-measure { max-width: 68ch }`; table headers `.pm-th { text-transform: uppercase; letter-spacing: 0.06em; font-size: var(--pm-type-meta-size); font-weight: 500; color: var(--pm-sys-text-muted) }`.
- Links: `a { color: inherit; text-underline-offset: 3px; text-decoration-thickness: 1px }`, `.pm-link { color: var(--pm-sys-thread-text); text-decoration: underline }` with hover `--pm-sys-thread-text-hover`.
- Focus: `:focus-visible { outline: 2px solid var(--pm-sys-focus); outline-offset: 2px; box-shadow: 0 0 0 4px var(--pm-sys-focus-halo) }` and `.pm-rail :focus-visible { outline-color: var(--pm-sys-focus-on-rail); box-shadow: none }`.
- `::selection { background: var(--pm-sys-selection-bg); color: var(--pm-sys-selection-text) }`, `caret-color`, `accent-color: var(--pm-sys-text)`, scrollbars: `* { scrollbar-width: thin; scrollbar-color: var(--pm-sys-control-border) transparent }`.
- Hairline and stitch utilities: `.pm-hairline { border-top: var(--pm-hairline) }`, `.pm-stitch { height: 1px; background-image: repeating-linear-gradient(90deg, var(--pm-sys-hairline) 0 6px, transparent 6px 10px) }`, `.pm-stitch-v { width: 2px; background-image: repeating-linear-gradient(180deg, var(--pm-sys-hairline) 0 6px, transparent 6px 10px) }`.
- Utilities: `.pm-sr` (visually hidden), `.pm-row { display: flex; align-items: center; gap: var(--pm-space-2) }`, `.pm-stack > * + * { margin-top: var(--pm-space-3) }`, `.pm-muted { color: var(--pm-sys-text-muted) }`, `.pm-meta { color: var(--pm-sys-text-meta) }`, `.pm-skeleton` (sunken bar 12px, radius chip, 1.2s opacity pulse; no motion under reduced motion).
- `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; scroll-behavior: auto !important } }` plus the opacity exception described in SPEC B.6 (`.pm-fade { transition: opacity 120ms }` survives).
- A font `<link>` snippet as a CSS comment at the top so builders copy it exactly:
  `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=JetBrains+Mono:wght@400..700&display=swap" rel="stylesheet">`

### `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\tokens-demo.html`

A one-page proof that the tokens render: links the fonts, tokens.css, base.css; shows every `--pm-ref-*` swatch with its hex and OKLCH, the 7 type steps with real sentences from PLAN.md section 4, a theme toggle button (`document.documentElement.dataset.theme = 'dark' | 'light'`, persisted in `localStorage["pm.theme"]`) and a density toggle. Put the page inside `<main>` with a single `<h1>`. This page has no rail or top bar; for `tools/shoot.mjs` to pass give it one `<button data-thread>` labelled "Toggle theme" at the top (it is the demo's one decision).

## Checks (run from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/contrast.mjs        # must end with "Failures: 0"; every hex in tokens.css must match this output
node docs/design-system/tools/check-css.mjs       # must end with "0 failing"
node docs/design-system/tools/shoot.mjs docs/design-system/tokens-demo.html   # must end with "0 failing"; then Read the PNGs in docs/design-system/shots/
```

Also verify by script that tokens.css and contrast.mjs agree: write a 15-line node one-off (in the scratchpad directory, not in the deliverable) that regexes every `#hex` in tokens.css and confirms each appears in the contrast.mjs output. Paste its result in the report.

## Scope limit

Two CSS files and one demo page. Do not write components or shell styles. Do not add tokens beyond the SPEC (report a gap instead).

## Hand back

Use the report format in PLAN.md section 3 (STATUS, FILES WRITTEN, COMMANDS RUN with output tails, SCREENSHOTS LOOKED AT, GAPS, QUESTIONS).

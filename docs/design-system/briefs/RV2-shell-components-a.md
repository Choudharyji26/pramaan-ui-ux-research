# RV2: review and fix WP2 (shell) and WP3 (components-a)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. You FIX findings yourself in small edits (one concern per edit) and re-run the checks after each fix. You may edit `shell.css`, `shell.js`, `screens/_skeleton.html`, `shell-demo.html`, `components-a.css`, `components-a-demo.html`. Do not edit tokens.css or base.css (report instead). Screen builders (WP5-7) are working in parallel and read your files: keep class names and data attributes stable; if you must rename, do not; add instead. Never publish an Artifact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: A, B.4 to B.9, C (all), D.1 to D.9, D.16 to D.18, E, G.1, G.2, H.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3, 4, 5.
3. `briefs/WP2-shell.md`, `briefs/WP3-components-a.md`, and both builders' handbacks (pasted by the controller).
4. The files under review plus `tokens.css`, `base.css`.
5. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files; do not invoke the skill).

## Review lenses

1. **Laws 1 to 4 in the shell**: rail fits 732 with no scrollbar (probe `scrollHeight === clientHeight`), heights per SPEC C.2 (measure them with a scratchpad Playwright probe and paste: wordmark row, All projects, project block, one destination, budget, user, total), collapsed state 64px with tooltips and the pen circle around the icon, persistence in localStorage, `[` shortcut, roving tabindex; top bar sticky at 0 after scroll, grid per C.3, breadcrumb links, Back, tape min 360 and its five states with the pin on `aria-current="step"` (never derived from the page), the thread slot never empty; workbench archetype has exactly one scroller; `scroll-padding-top` set.
2. **Tape quality**: does it read as a measure (baseline stitch, major and minor ticks, sub-progress ticks) without becoming decoration; done/current/upcoming/locked visually distinct without colour alone (check glyph, weight, lock); large variant only via `.pm-tape--large`.
3. **Components A states**: for each of buttons (5 variants x 3 sizes), action bar (2), pin (7 statuses + tint), banner (6), card, digits, table (+ wide), forms (+ save pattern), search, chip, details, skeleton, empty, locked, error, popover, dialog, toast: default, hover, focus-visible, active, disabled-with-reason (`aria-disabled` + reason text), loading (`aria-busy`), error/empty/locked where the SPEC lists them. Missing state = finding, fix it.
4. **Contrast**: every fg/bg token pair used is one of SPEC B.2's verified pairs. Run a scratchpad script that lists `color`/`background` token pairs per rule (regex over the CSS) and flag anything not in the table (e.g. chalk text on sunken is forbidden per SPEC H.8).
5. **Craft floor**: no eyebrow/kicker classes, no hero-metric pattern in digits (numbers must sit with their sentence, engraved on sunken), no coloured side stripes, no gradient text, no glass, no hard offset shadows, no Unicode/emoji icons (sprite SVG only), no display face, icons in one stroke weight, shadows only on float/dialog.
6. **Copy in demos**: SPEC E wording, no em dash, no "Reject", no jargon.
7. **Consistency**: a single `.pm-btn` family, a single `.pm-pin`, no duplicate near-identical rules; the skeleton page is the exact shell markup with comments.
8. **Density and dark**: toggle both in the demos; nothing breaks; the working pin's dash stops under reduced motion (emulate `reducedMotion: 'reduce'` in a scratchpad probe).

## Commands

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/_skeleton.html docs/design-system/shell-demo.html docs/design-system/components-a-demo.html
```
Read every PNG (normal and `-scrolled`) at both viewports, then dark (temporarily set `data-theme="dark"` on the demo `<html>`, shoot, revert).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
MEASUREMENTS: rail part heights and total at 732; top bar height; tape width; content width at 1142 expanded/collapsed
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: anything needing a SPEC decision
```

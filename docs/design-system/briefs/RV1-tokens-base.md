# RV1: review and fix WP1 (tokens.css, base.css, tokens-demo.html)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. You FIX findings yourself in small edits (one concern per edit) and re-run the checks after each fix. You may edit only `docs/design-system/tokens.css`, `base.css`, `tokens-demo.html`. Never publish an Artifact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md` sections A, B (all), D.1, D.5, H.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3 and 5.
3. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\briefs\WP1-tokens-base.md` (what the builder was asked).
4. The builder's handback (pasted below this brief by the controller).
5. `docs/design-system/tokens.css`, `base.css`, `tokens-demo.html`, `tools/contrast.mjs`.

## Review lenses

1. **Token completeness and names**: every token named in SPEC B.1, B.3 (light AND dark blocks AND the prefers-color-scheme guard), B.4 (7 steps x 4 properties + 2 families), B.5, B.6, B.8, B.9 and the lazy component list in WP1 exists with the exact name and value. Write a scratchpad script that extracts every `--pm-` name from SPEC.md and from tokens.css and diffs them; paste the diff; fix tokens.css for any spec name missing; report any tokens.css extra.
2. **Hex/OKLCH agreement**: every hex in tokens.css equals the hex in `node docs/design-system/tools/contrast.mjs`; every OKLCH triple matches SPEC B.1. Fix mismatches.
3. **Layering**: no `--pm-sys-*` value is a literal; no `--pm-cmp-*` points at `--pm-ref-*`; dark blocks reassign only `--pm-sys-*`. `color-scheme` set in both.
4. **CSS safety**: `node docs/design-system/tools/check-css.mjs` passes; no `:global {`; exactly balanced `/* */`; no nesting; no `@import`.
5. **base.css**: body never scrolls; focus ring as B.6 with the rail variant; selection, caret, accent-color, scrollbars themed; reduced motion; the 7 type utilities; `.pm-num` tabular; the font `<link>` comment present and identical to the WP1 brief's line.
6. **Demo page**: renders by double-click (file://), fonts load (check `document.fonts.check` in the shoot report), light and dark both readable, density toggle works, one `h1`, one `[data-thread]`.
7. **Craft floor**: no eyebrow styles, no gradient text utility, no side-stripe utility, no glass, no hard offset shadow.

## Commands

```
node docs/design-system/tools/contrast.mjs
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/tokens-demo.html
```
Read the PNGs in `docs/design-system/shots/` (light; then toggle dark by adding `data-theme="dark"` to the demo's `<html>` temporarily, shoot again, then revert).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
FINDINGS: table (severity high/med/low, file:line, what, fixed yes/no, note)
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
TOKEN NAME DIFF: pasted
```
Keep your fixes minimal; if a finding needs a SPEC change (a token the SPEC forgot), leave it open and name it under QUESTIONS FOR THE PLANNER.

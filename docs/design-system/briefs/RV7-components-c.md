# RV7: review and fix the pass-2 shared components (WP9 CSS and WP10 JS)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You FIX findings yourself in small edits (one concern per edit) and re-run the checks after each fix. You may edit `components-c.css`, the pass-2 block at the end of `shell.css`, the sprite in `screens/_skeleton.html`, `components-c-demo.html`, and `components.js` sections 9 to 12 (plus the one additive change to section 7). You do not edit `tokens.css`, `base.css`, `components-a.css`, `components-b.css`, `shell.js`, any screen, `SPEC.md`, `PLAN2.md`, `briefs/` or `tools/` (report SPEC issues instead). Your approval freezes the class names and hooks: the five screen builders of wave 2 are waiting on you, so be quick and exact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16; A.3; B (tokens, type, spacing, motion); D.1, D.5, D.6, D.8, D.17, D.18; part P: P.4 and P.5 whole (every number is a check), P.1 (the tool you run on the demo page).
2. `PLAN2.md` sections 2, 3, 5.
3. The WP9 and WP10 hand-backs (pasted by the controller).
4. `tokens.css`, `base.css`, `shell.css`, `components-a.css`, `components-b.css`, `components-c.css`, `components.js`, `components-c-demo.html`, `screens/_skeleton.html`.
5. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).

## Review lenses

1. **Numbers against SPEC P.5**: for every component, measure with a scratchpad Playwright probe on the demo page: row heights (request 64, steps 44, plan aside 40, decisions brief 40, choice list 40, two-line table 64), tile min-height 120, action card 88, meter 4px, chips 28, the `.pm-arch-build` column count at 1030 and 846px content widths (2, 1), `.pm-arch-task2` total width at 1120 (944) and its centring, `.pm-panel--fit` height equals `scrollHeight` with the demo content. Fix any drift.
2. **Contrast**: every text/background pair used by the new CSS is a B.2 pair (grep every `color:` and `background:` in components-c.css and map them); the mini-steps' four fills and the choice card's checked border are UI pairs at 3:1 or better; the dark theme (toggle it in the demo page's user menu, shoot with `data-theme="dark"` temporarily set in a scratchpad copy) shows every component readable.
3. **Motion**: only the milestone stitch (<= 700ms, once, staggered) and the dictation ring move; nothing animates on load; `prefers-reduced-motion` (emulate it) shows the end state at once; the milestone line still appears; the tape pin does not move.
4. **JS behaviour** (run the WP10 script again and extend it): dictation states with a stubbed API and with the API removed; never sends; Escape stops; the file field validation (312 MB, `.rar`, valid), the copy-flow hooks and the thread swap (Ruling 15: the button is never canary while disabled); `[data-enable-when="text"]`; the setting sentence swap; the generalised spy on a scratchpad page with a `[data-spy]` list and three sections, and the reader spy on `screens/09-document-draft.html` unchanged (`shoot.mjs` on 09 still `0 failing`, `shots/09-spy-policy-*.png` regenerated if a probe exists); no console errors on any of the 20 pass-1 screens (run `shoot.mjs` with no args).
5. **Craft floor**: no eyebrow uppercase labels (the copy flow's box labels are sentence case Meta), no icon-heading-text card grids that read as marketing (the action cards are three actions, not features), no shadows at rest, no side stripes (the plan aside's current marker is the reader's inset bar, already carried), no emoji, SVG only, no brand marks.
6. **Names and hooks**: every class and attribute the SPEC names exists exactly as spelled (grep P.5 against the CSS and JS); the demo page shows every state the SPEC lists; the sprite symbols are the exact paths of P.5.12.
7. **check-css**: `@container` compiles; no hex; no `:global {`; no stray `*/`; the two dark blocks untouched.

## Commands (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/contrast.mjs
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs
node docs/design-system/tools/whitespace.mjs docs/design-system/components-c-demo.html
```
Read the demo page's PNGs at both sizes, normal and `-scrolled`, and a dark shot.

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
MEASUREMENTS: the probe numbers against SPEC P.5
FROZEN HOOKS: the final list of classes and data attributes (this is what wave 2 greps)
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: SPEC issues discovered (not fixed here)
```

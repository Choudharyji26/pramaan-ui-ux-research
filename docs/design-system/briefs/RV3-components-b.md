# RV3: review and fix WP4 (components-b.css, components.js, demos)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. You FIX findings yourself in small edits (one concern per edit) and re-run the checks after each fix. You may edit `components-b.css`, `components.js`, `components-b-demo*.html`. Do not edit tokens, base, shell or components-a (report instead; RV2 owns those). Screen builders read your files in parallel: keep class names and data attributes stable; add, never rename. Never publish an Artifact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: A, B.4 to B.9, C.5, C.6, D.10 to D.15, D.17 (log viewer), E, G (all three moves), H.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3, 4, 5.
3. `briefs/WP4-components-b.md` and the builder's handback (pasted by the controller).
4. The files under review plus `tokens.css`, `base.css`, `shell.css`, `components-a.css`.
5. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).
6. The prototype decision history for what must be respected: run `git -C "C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web" show origin/yogi100x/product-builder-ux-mockup:docs/design/zoom-design-feedback-20260926.md` (read only): decisions auto-saved and editable, explicit plan approval, feature board kept, compact UAT, technical documents behind a disclosure.

## Review lenses

1. **Law 2 in every workbench component**: exactly one scroller (thread, reading column, log list); side panels viewport-sized and only scrolling on overflow; composer docked and reachable without scrolling; checklist footer visible at 732; the stage iframe fills its row (measure heights with a scratchpad Playwright probe at 1142x732 and paste: thread height, composer top, reading column width, stage iframe height, checklist footer top).
2. **Law 1 mechanics**: the gate observer keeps exactly one visible `[data-thread]`; the question card's Submit is the thread while open and the composer send drops to quiet; the checklist footer swaps between "Accept sprint 1" and "Ask for changes (n)" correctly; verdict keyboard (arrows, 1/2/3) works.
3. **Reading document**: sticky action bar inside the scroller, sticky h2 section heads (no card sliced), contents rail scroll-spy, chalk marks aligned to their passage, comment popover escapes the scroller (`position: fixed`), wide table rule (KPI-1 on one line, first column sticky, no text shrink), Details closed by default, locked and empty states present.
4. **Sprint route**: continuous stitched line, nodes with status glyphs, outcomes as list items with hollow ticks (no arrows, no chips), "You can try" chalk block, "Then" line, terminal node, drafting skeleton, "You said" blocks only when `data-words="on"`, quotes only from fixture text.
5. **Feature board and activity**: compact density, tint chips with glyphs, no hatch, no percentage, sprint header digits "n of m features ready", activity feed empty state.
6. **Log viewer**: light surface, plain event names first, wire event mono beside, ids truncated with copy buttons, Details raw line, sticky hour separators, pause/resume banner.
7. **Contrast and craft floor**: only verified pairs (SPEC B.2); chalk text never on sunken; no side stripes, no glass, no gradient text, no emoji; motion only state-driven (streaming pin, pin slide, toast), reduced motion honoured.
8. **Copy**: SPEC E wording verbatim where given; no em dash; no jargon in the first viewport; wire words inside sentences or Details only.
9. **JS hygiene**: every behaviour feature-guarded; no errors on pages lacking the component (load `components-a-demo.html` and `_skeleton.html` with components.js and check the console via the shoot report).

## Commands

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/components-b-demo*.html docs/design-system/screens/_skeleton.html
```
Read every PNG at both viewports, normal and `-scrolled`; shoot dark once (temporary `data-theme="dark"`, then revert).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
MEASUREMENTS: the numbers from lens 1
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: anything needing a SPEC decision
```

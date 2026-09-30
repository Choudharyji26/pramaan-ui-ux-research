# RV11: final pass-2 coherence review of the whole design system (34 screens, system.html, flow.html, all CSS and JS)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit any file under `docs/design-system/` except `SPEC.md`, `PLAN.md`, `PLAN2.md`, `briefs/` and `tools/whitespace.mjs` (report SPEC and tool issues instead; you may edit the other tools only to fix a generator bug, and you must regenerate after). `system.html` and `flow.html` are never hand-edited: edit their sources (`tools/system-parts/*.part`, screens, `flow.js`) and regenerate.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md` in full, part P twice.
2. `PLAN.md` and `PLAN2.md` in full.
3. `.impeccable/surfaces/app.md` (the direction contract) and `PRODUCT.md` at `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\`.
4. Every hand-back from WP9 to WP16 and RV7 to RV10 (pasted by the controller).
5. Every file under `docs/design-system/` (CSS, JS, HTML, 34 screens, the parts).
6. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).

## Review lenses

1. **Whole-set gates, all five tools**: `contrast.mjs` (`Failures: 0`), `check-css.mjs` (`0 failing`), `shoot.mjs` with no args (all 34 screens, the demo pages, system and flow: `0 failing`), `whitespace.mjs` with no args (`68 checks, 0 failing`), `build-flow.mjs` then `walk-flow.mjs` (`0 failing`), `build-system.mjs` (`failures 0`, `em dash: false`). Then `whitespace.mjs --rail expanded` and `--rail collapsed` over everything and list every failure (fix the cheap ones inside the 40-line page styles; report the rest with numbers).
2. **The allowlist is intact**: read `tools/whitespace.mjs` and confirm `ALLOW` has exactly the four rows of SPEC P.1 and the four thresholds are 240x160, 240x120, 240x240, 240; if anyone changed them, restore and report. Then grep every screen for `pm-panel--fit`, `pm-arch-task`, `pm-chat-flow`: each use is legitimate per Ruling 10 and 12 (no fitted card used to hide a hole beside the main job; no `.pm-arch-task` on any screen).
3. **The identity test across lanes**: open shots of 01, 03, 09, 13, 18, 19, 22, 23 at 1142; with content mentally removed the five carriers are the same on all eight; shell markup outside the documented differences matches `_skeleton.html` (a scratchpad diff of the rail, top bar and strip markup per screen against the skeleton, ignoring the documented variants).
4. **One Thread, whole set**: a scratchpad script over all 34 screens counts visible `[data-thread]` at rest and after scrolling 600px, checks `data-thread-none` values are from the fixed set, and that no disabled button carries `pm-btn--thread` (Ruling 15).
5. **Status vocabulary**: grep all HTML for `pm-pin-label` texts: only the seven labels; every pin outside a table cell or a request row has a sentence; wire words only inside sentences or Details; the request rows on 22 map to D-P2-5.
6. **Copy audit**: per screen `innerText`: sentences over 14 words in the first viewport, jargon per lane (Ruling 14: "repository" counts on 18 to 20 = 2 on 18/18b/18c/18d/18e and 0 to 1 on 19/20; free on 21 to 23), em dashes, exclamation marks, "Reject", "Confirm", "Oops", uppercase eyebrows, tailoring words in visible text (tailor, stitch, thread, pin, chalk, tape: allowed only in system.html's prose).
7. **Trend items end to end**: dictation on six screens with a stubbed API (listening and back, never sends, unavailable reason when absent); the setting switch on 16 swaps its sentence and the consequence lines exist on 11 and 13; the bento on 03, 04, 19 in reading order; the milestone plays once on 13's ready switch and on the flow's 15 → 14 acceptance, never on load, end state under reduced motion.
8. **flow.html**: `walk-flow.mjs` green; then by hand in a scratchpad Playwright session walk 01 → 18 → 19 → 20 → 05 and 01 → 21 → 22 → 23 → 22 → 16 (Lane B settings is not drawn: 16 shows todo; note it) and screenshot each stop; the Journey panel lists 34 screens in the SPEC P.8 order; the review-only chrome is labelled.
9. **system.html**: documents every SPEC section A to H plus P (six laws, the tool, the pass-2 archetypes, every new component with live samples, the request status table, the three pass-2 risks, the coverage matrix with 92 rows linking to existing files, 34 thumbnails); theme and density toggles work; no broken `href`.
10. **Readiness for the gates**: no TODO comments, no placeholder text, no unused CSS files, no console errors, `README.md` current (tools, 34 screens, components-c.css, PLAN2). Leave the final `whitespace.mjs` line in your hand-back verbatim.

## Commands (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/contrast.mjs
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs
node docs/design-system/tools/whitespace.mjs
node docs/design-system/tools/whitespace.mjs --rail expanded
node docs/design-system/tools/whitespace.mjs --rail collapsed
node docs/design-system/tools/build-flow.mjs && node docs/design-system/tools/walk-flow.mjs
node docs/design-system/tools/build-system.mjs
```
Read the PNGs of every new screen at 1142 (normal and `-scrolled`) and a sample of eight at 1440; shoot dark for six screens (temporary `data-theme="dark"`, revert).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
GATES: the last line of each tool run, verbatim
IDENTITY TEST: the eight screens compared and the verdict
ALLOWLIST: unchanged yes/no
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
FLOW WALK: the script output and the by-hand stops with screenshot names
RAIL VARIANTS: failures listed with numbers
FILES EDITED: absolute paths
OPEN FOR PLANNER: SPEC issues, tool issues, allowed rectangles that still read as dead
```

# RV6: final coherence review of the whole design system (system.html, flow.html, all screens, all CSS)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit any file under `docs/design-system/` except `SPEC.md`, `PLAN.md`, `briefs/` and `tools/` (report SPEC issues instead). Never publish an Artifact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md` in full.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` in full.
3. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\.impeccable\surfaces\app.md` (the direction contract) and `PRODUCT.md`.
4. All handbacks from WP1 to WP8 and RV1 to RV5 (pasted by the controller).
5. Every file under `docs/design-system/` (CSS, JS, HTML, screens).
6. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).

## Review lenses

1. **The identity test** (SPEC A.2): open `shots/` PNGs of five different screens, imagine the content removed, and confirm the five carriers are what remains and that they are the same on all five. Any screen where the shell differs (rail, top bar, tape, slot, strip) is a finding: fix by aligning to `screens/_skeleton.html`.
2. **Whole-set automated pass**: `node docs/design-system/tools/check-css.mjs` and `node docs/design-system/tools/shoot.mjs` (no args: all screens + system + flow) must both end with `0 failing`. Then a scratchpad script over all HTML: exactly one `h1`, exactly one `[data-thread]` in the static markup (plus `hidden` copies allowed), no `\u2014`, no emoji range characters, every `<img>`/`<svg>` icon from the sprite, no inline `style="color:#..."`, every `<button>` has text or `aria-label`, every `<a>` has an href, every form control has a label.
3. **Cross-screen consistency**: the same component looks the same everywhere (buttons, pins, tables, banners); page-specific `<style>` blocks contain no overrides of shared components (grep for `.pm-` selectors inside screens' `<style>`; any that restyle a shared class is a finding to move into the shared file or delete).
4. **Status vocabulary**: grep all HTML for pin labels; only the seven labels exist; every pin outside a table cell has a sentence; wire words appear only inside sentences or `.pm-details`.
5. **Copy audit**: collect all visible text (probe `innerText` per page), list every sentence over 14 words in a first viewport, every jargon word outside Details, any "Reject", "Submit" (except "Submit answers"), "Confirm", "Oops", exclamation marks; fix.
6. **system.html**: documents every SPEC section (A to H) with live examples; the contrast table equals the tool output; the coverage matrix links resolve; theme and density toggles work; thumbnails present.
7. **flow.html**: walk the journey (01 -> 02 -> 05 -> 06 -> 08 -> 09 -> 11 -> 12 -> 13 -> 15 -> 14 -> 16 -> 17) with a scratchpad Playwright script asserting one visible thread, one `h1`, no horizontal overflow, rail without scrollbar, tape pin on the right step, at every stop; screenshot each stop; fix flow.js where it breaks.
8. **Direction guardrails** (SPEC H): the canary appears only as the thread; clay for Paused, never amber; no textures; no tailoring words in copy (grep for tailor, stitch, thread, pin, chalk, tape in visible text: allowed nowhere except system.html's explanatory prose); the large tape only on overviews; the strip only on project screens.
9. **Reduced motion and keyboard**: emulate reduced motion and confirm no animation runs; tab through 01, 05, 09, 11, 15 and confirm the focus order follows reading order and the ring is visible on the rail and on the thread.
10. **Readiness for the impeccable gates**: the controller will run `node C:\Users\adity\.claude\skills\impeccable\scripts\detect.mjs --json` over `docs/design-system` and then the finish reviewer and the documenter. Pre-empt: leave no TODO comments, no placeholder text, no unused CSS files, no console errors, and write a short `docs/design-system/README.md` (allowed: it is the deliverable's index, not a report) listing what each file is and how to open it (double-click) and how to run the three tools.

## Commands

```
node docs/design-system/tools/contrast.mjs
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs
```
Read the PNGs of every screen at 1142x732 (normal and `-scrolled`) and a sample at 1440x900; shoot dark for five screens (temporary `data-theme="dark"`, revert).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
IDENTITY TEST: the five screens compared and the verdict
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
FLOW WALK: the script output (stops, assertions, screenshot names)
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: SPEC issues discovered (not fixed here)
```

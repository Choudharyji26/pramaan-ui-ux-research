# WP13: whitespace fixes group 3, milestone and consequence lines (screens 11, 11b, 12, 13, 13b, 14, 15)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/screens/`. No git commands. Never publish an Artifact. Do not edit any shared CSS or JS; if a style is missing, use the closest existing class and list the gap. Page-specific `<style>` under 40 lines, tokens only, never restyling a shared component. You edit seven existing screens in place; keep their shell markup identical to `_skeleton.html` except where this brief says otherwise.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16 (7, 9, 10, 16); A.3; D.12, D.13, D.14, D.15, G.3; E rows headed "Pass 2:" for autonomy setting, milestone, plan aside, try it device switch; part P: P.1, P.2 (F7, F8, F9, F10, F12), P.4.2 (consequence lines), P.4.4 (milestone), P.5.1 (`.pm-arch-plan2`, `.pm-arch-build`, `.pm-panel--fit`, `--sticky`), P.5.13 (`.pm-plan-aside`, `.pm-route-card--skeleton`, `.pm-device-switch`, `.pm-device`, `.pm-milestone-line`).
2. `PLAN2.md` sections 3 and 4.
3. `components-c.css`, the pass-2 block of `shell.css`, `components.js` sections 9 to 12 (`pmMilestone`, `[data-milestone-trigger]`, `[data-milestone-line]`, `[data-spy]`), `components-c-demo.html`.
4. Audit shots: `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\whitespace\11-roadmap-awaiting-1440-scroll-annot.png`, `11b-roadmap-drafting-1440-first-annot.png`, `13-sprints-building-1440-first-annot.png`, `13-sprints-building-1142-first-annot.png`, `13b-sprints-blocked-1142-first-annot.png`, `14-sprints-accepted-1440-first-annot.png`, `15-try-it-1440-first-annot.png`.

## Write

1. `11-roadmap-awaiting.html` and `12-roadmap-approved.html` (P.2 F8, P.4.2): keep the sticky `.pm-gatewrap` full width; below it wrap the route in `.pm-arch-plan2` with the route (`ol.pm-route`) left and `.pm-plan-aside.pm-panel--fit.pm-panel--sticky` right (`top: calc(var(--pm-topbar-h) + var(--pm-gate-h, 0px) + 16px)` via the shared class or a 1-line page style): heading, four 40px rows (number, name, pin; hrefs to the node ids; `data-spy` on the list), the consequence sentence (11 / 12 per E), and the autonomy line "Pramaan checks with you before each sprint starts. Change this in Settings." On 11 also append that sentence to the gate's consequence line (E "Pass 2: autonomy setting"). Drop `.pm-arch-plan`.
2. `11b-roadmap-drafting.html` (P.2 F10): the same grid; the three skeleton nodes use `.pm-route-card--skeleton`; the aside "What Pramaan is reading" per E "Pass 2: plan aside" (three Done document rows, the Working sentence, the "What you do next" line).
3. `13-sprints-building.html` and `13b-sprints-blocked.html` (P.2 F9, P.4.2, P.4.4): replace the page's `.pm-build` grid with `.pm-arch-build` (delete the page rules for it; keep `.pm-build-main`, `.pm-build-side`, `.pm-build-act` class names on the three blocks); the side strip and the activity feed become `.pm-tile.pm-panel--fit` cards in the side column; the "Then:" line reads as in E; the review-only switch is inline with the digits row (chips 24px, `.pm-review-only`); the ready-state variant (13's second position) adds `data-milestone-trigger="sprint-ready"` to the "Ready to try" chip and a hidden `.pm-milestone-line` `[data-milestone-line]` (Done pin + "Sprint 1 is ready to try.") in the sprint header above the pin sentence; the variant script keeps its under-20-lines size (it may call `pmMilestone` when switching to ready and re-hide the line when switching back). 13b: same layout; no milestone.
4. `14-sprints-accepted.html` (P.2 F12): `.pm-arch-plan2` with the Done node card left and `.pm-plan-aside.pm-panel--fit.pm-panel--sticky` "What was built" right (three facts, the Waiting live-site line, quiet "Take a copy (.zip)"); remove the bottom Live-site info callout and the banner's second quiet button; the board section spans the full width under the grid. Static end state of the tape (five checks); no `data-milestone` in the markup.
5. `15-try-it.html` (P.2 F7): stage bar gains `.pm-device-switch` (three chips, "Computer" `aria-checked="true"`, radiogroup `aria-label="Preview width"`); `.pm-stage-body` wraps the iframe in `.pm-device` with `--pm-device-w` unset for Computer (fills), 390px for Phone, 820px for Tablet, and the Meta caption; a page script under 15 lines flips `--pm-device-w` and the caption on click. The checklist panel gets `pm-panel--fit` (the foot follows the items; the thread stays in the foot). Nothing else changes.

Every screen: one `h1`, thread rule (11 gate thread with the slot copy hidden; 11b, 12, 13, 13b `data-thread-none`; 14 banner thread; 15 checklist foot thread), no percentage on 13 (extra defect 2), no em dash.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/11-roadmap-awaiting.html docs/design-system/screens/11b-roadmap-drafting.html docs/design-system/screens/12-roadmap-approved.html docs/design-system/screens/13-sprints-building.html docs/design-system/screens/13b-sprints-blocked.html docs/design-system/screens/14-sprints-accepted.html docs/design-system/screens/15-try-it.html
node docs/design-system/tools/whitespace.mjs <the same seven files>
```
All end `0 failing` at both viewports; also run `whitespace.mjs --rail expanded` on 13 and 13b at 1142 and report the result (single column expected, must still pass). Read every PNG. Probe (scratchpad, paste): on 11 at 1440 after scrolling `main` 900px the aside's top (sticky under the gate) and the `aria-current` link in the aside (sprint 2); on 13 at 1142 (rail collapsed) the number of grid columns of `.pm-arch-build` (2) and at 1142 with `pm.rail=expanded` (1); on 13 after clicking "Ready to try" the presence of `data-milestone` on the tape within 100ms and its absence after 800ms, and that the line is visible; on 15 after choosing Phone the iframe width (390).

## Scope limit

Seven HTML files, no shared CSS or JS edits, page `<style>` under 40 lines each.

## Hand back

PLAN.md section 3 format plus the PLAN2 section 3 lines, the probe output, and the coverage rows you demonstrate (W-F7, W-F8, W-F9, W-F10, W-F12, T-2 on 11 and 13, T-4 on 13 and 14).

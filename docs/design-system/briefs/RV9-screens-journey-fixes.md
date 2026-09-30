# RV9: review and fix WP12 and WP13 (screens 05, 05b, 06, 07, 09, 10, 11, 11b, 12, 13, 13b, 14, 15)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit the thirteen WP12 and WP13 screens and, in small steps that keep every other screen green, `components-c.css`, the pass-2 block of `shell.css` and `components.js` sections 9 to 12 (re-run `shoot.mjs` with no args after any shared edit). You do not edit `SPEC.md`, `PLAN2.md`, `briefs/`, `tools/`, the pass-1 shared files or other builders' screens (report instead).

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16; A.3; D.10 to D.15; G.3; E (pass-2 rows for dictation, decisions brief block, interview finished gate, locked interview, reader head, autonomy setting, milestone, plan aside, try it device switch); part P: P.1, P.2 (F2, F5 to F12, F14), P.4.1, P.4.2, P.4.4, P.5.1, P.5.6, P.5.8, P.5.10, P.5.13.
2. `PLAN2.md` sections 3, 4, 5.
3. `briefs/WP12-screens-interview-reader.md`, `briefs/WP13-screens-plan-build-try.md`, both hand-backs and the RV7 hand-back (frozen hooks).
4. The thirteen screens, `components-c.css`, `shell.css`, `components.js`.
5. The audit report for the "before": `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\whitespace-report.md`.

## Review lenses

1. **Law 6 for real**: `whitespace.mjs` on all thirteen at both viewports, plus `--rail expanded` and `--rail collapsed`; read every `-first-annot.png` and `-scroll-annot.png`; blue rectangles that still read as dead go to the planner with numbers; red ones you fix. The fitted decisions card (05, 05b, 06, 07) must not be a white slab with a big empty bottom: its content ends within 40px of its bottom edge (probe).
2. **One Thread on the tricky screens**: 05b (the card's Submit is the thread, Send quiet, the slot sentence); 06 (the gate's thread in the thread, the slot copy hidden at rest and shown only when the gate scrolls out: scroll the thread up 600px and count); 11 (gate thread, slot copy hidden); 13 ready state (the thread "Try sprint 1" appears in the slot and `data-thread-none` is removed); 14 (banner thread only; the aside's "Take a copy (.zip)" is quiet); 15 (foot thread). Run `shoot.mjs` and a scratchpad count after scrolling on each.
3. **Honesty of the fills**: 05b's first decision is the product idea (matches 03's strip); the brief block's six sections are the reader's real h2 titles with E's glosses; 07's "This sprint" and activity match 13's fixture exactly; 11b's aside lists the three accepted documents only; 14's aside states three facts and the Waiting live-site sentence verbatim; nothing else is added.
4. **Dictation** (P.4.1): on 05, 05b, 06 the button sits before Send, `aria-label`, `data-dictate` targets the textarea, the status span is inside the hint and `aria-live="polite"`; with the API stubbed it reaches listening and back; nothing sends; the unavailable state shows its reason when the API is missing (run the WP10 script against these screens).
5. **Milestone** (P.4.4): on 13, clicking "Ready to try" sets `data-milestone` once and the line appears; nothing on load (probe `data-milestone` at load = null on 13 and 14); reduced motion: end state at once; 14's tape shows the end state statically.
6. **Layout numbers**: question card two columns at 1440 and one at 1142 with the rail expanded; the plan aside sticky under the gate (11: top = topbar + gate height + 16 after scrolling); `.pm-arch-build` two columns at 1142 collapsed and one at 1142 expanded (13, 13b); the device frame 390 for Phone and full for Computer (15); 09's chips on the title line; 10's "No passage comments." line.
7. **Reader regressions**: 09 and 10 still pass the pass-1 spy and stuck-heading checks (`shoot.mjs` green, and the `shots/09-spy-policy-*` probe if you rerun it from the RV5 hand-back).
8. **Copy audit**: sentences over 14 words in the first viewport, em dashes, exclamation marks, percentages on 13, "Reject", jargon outside Details.

## Commands (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/05-interview-running.html docs/design-system/screens/05b-interview-empty.html docs/design-system/screens/06-interview-finished.html docs/design-system/screens/07-interview-locked.html docs/design-system/screens/09-document-draft.html docs/design-system/screens/10-document-locked.html docs/design-system/screens/11-roadmap-awaiting.html docs/design-system/screens/11b-roadmap-drafting.html docs/design-system/screens/12-roadmap-approved.html docs/design-system/screens/13-sprints-building.html docs/design-system/screens/13b-sprints-blocked.html docs/design-system/screens/14-sprints-accepted.html docs/design-system/screens/15-try-it.html
node docs/design-system/tools/whitespace.mjs <the same thirteen files>
node docs/design-system/tools/whitespace.mjs --rail expanded <the same thirteen files>
```
The first three must end `0 failing`; the rail variant is reported.

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
WHITESPACE: per file and viewport, default and expanded
THREAD COUNTS: 05b, 06, 11, 13 (ready), 14, 15 at rest and after scrolling
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: allowed rectangles that still read as dead (with numbers), SPEC issues
```

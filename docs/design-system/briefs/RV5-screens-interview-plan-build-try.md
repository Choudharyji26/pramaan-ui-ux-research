# RV5: review and fix screens 05, 06, 07 (WP6) and 11, 12, 13, 14, 15 (WP7)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit the eight screen files named above. You may also make small, additive fixes in `components-b.css`, `components.js`, `shell.css` when a screen defect is really a shared defect (add a rule or state; never rename classes; note every shared edit so RV4 and WP8 see it). Never publish an Artifact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md` in full; keep D.11 to D.15, E, F, G open.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3, 4, 5.
3. `briefs/WP6-screens-interview-documents.md`, `briefs/WP7-screens-plan-build-try.md` and both handbacks (pasted by the controller).
4. The reviewer's original feedback: `C:\Users\adity\.claude\projects\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\tool-results\b2oj5znbm.txt` (lines 1 to 328) and screenshots `C:\Users\adity\AppData\Local\Temp\fb1\word\media\image6.jpg`, `image7.jpg`, `image11.jpg` to `image19.jpg` (Read them).
5. `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\verification-real-build.md`.
6. Product decisions that bind these screens: run `git -C "C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web" show origin/yogi100x/product-builder-ux-mockup:docs/design/zoom-design-feedback-20260926.md` (read only).
7. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).

## Review lenses (apply to each of the eight screens)

1. **Coverage**: S4.1 to S4.8, S7.1 to S7.3, S8 (observed), S9.1, S9.2, A2, A4, A6, A8, interview locked, sprints accepted, B2, B3, extra defect 2, G.1 to G.3, and the decision-history row. For each: evidence (element and y from a scratchpad probe at 1142x732) or the fix.
2. **Law 2 measured**: on 05/06 the thread fills the viewport and the composer is visible without scrolling; the decisions panel does not scroll on 06; on 09-like reading (not yours) skip; on 15 the iframe height >= 500px at 732 and the checklist footer is visible; on 11 the gate stays at the top after scrolling 400px; on 13 the board header is sticky; exactly one scroller per screen.
3. **Law 1 measured**: at most one visible `[data-thread]` before and after scrolling on every screen, and zero only where `main[data-thread-none]` is declared with a status sentence in the slot. Expected: 05 the question card's "Submit answers"; 06 the top-bar "Create my product brief"; 07 none (`data-thread-none="locked"`, "Request a revision" quiet); 11 the gate's "Approve the plan and start building"; 12 none (`data-thread-none="working"`); 13 none by default, "Try sprint 1" only in the ready-to-try variant; 14 "Open your product"; 15 the checklist footer "Ask for changes (1)". No navigation or housekeeping action may carry `data-thread`.
4. **Decision history**: decisions auto-saved and editable (06 shows an inline edit); question card submit is not an "accept each decision" flow; explicit approval gate with the consequence sentence (11); navigation to 12 never implies a build started without approval (the approved bar states the time); feature board kept (13); compact checklist (15); no stale-asset scenario anywhere.
5. **Route quality (11/12)**: no chips, no arrows, no wrapping artefacts at 1142; outcomes verbatim; "Then" and terminal node present; "You said" quotes only from the todo description; the switch works.
6. **Founder persona**: no jargon outside Details in the first viewport (07 must not say "UAT"); every disabled control has a reason; no em dash; sentences short.
7. **Direction fidelity and craft floor**: carriers functional, no decoration; SVG icons only; no side stripes; no hero; no eyebrow; no percentages on sprint progress; one `h1`.
8. **Consistency**: identical shell markup across the eight files (diff with a scratchpad script); page-specific `<style>` under 40 lines, token-only.
9. **Dark theme**: shoot each once with `data-theme="dark"` (temporary edit, revert) and fix unreadable areas.

## Commands

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/05-interview-running.html docs/design-system/screens/06-interview-finished.html docs/design-system/screens/07-interview-locked.html docs/design-system/screens/11-roadmap-awaiting.html docs/design-system/screens/12-roadmap-approved.html docs/design-system/screens/13-sprints-building.html docs/design-system/screens/14-sprints-accepted.html docs/design-system/screens/15-try-it.html
```
Read every PNG (both viewports, normal and `-scrolled`). Fix, re-run, re-read until `0 failing` and no visual finding remains.

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
COVERAGE: per screen, the F rows with evidence or fix
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
MEASUREMENTS: the numbers from lenses 2 and 3
SHARED EDITS: any change outside the eight screens, with the reason
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: anything needing a SPEC decision
```

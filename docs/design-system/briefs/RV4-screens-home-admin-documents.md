# RV4: review and fix screens 01, 02, 03, 04, 16, 17 (WP5) and 08, 09, 10 (WP6)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit the nine screen files named above. You may also make small, additive fixes in `components-a.css`, `components-b.css`, `shell.css`, `components.js` when a screen defect is really a shared defect (add a rule or state; never rename classes; note every shared edit so RV5 and WP8 see it). Never publish an Artifact.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md` in full; keep F (coverage matrix) and E (copy) open.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3, 4, 5.
3. `briefs/WP5-screens-home-admin.md`, `briefs/WP6-screens-interview-documents.md` and both handbacks (pasted by the controller).
4. The reviewer's original feedback so you judge the fix against the complaint: `C:\Users\adity\.claude\projects\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\tool-results\b2oj5znbm.txt` (first half, lines 1 to 328) and the screenshots `C:\Users\adity\AppData\Local\Temp\fb1\word\media\image1.jpg` to `image5.jpg`, `image8.jpg` to `image10.jpg`, `image20.jpg` to `image22.jpg` (Read them).
5. `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\verification-real-build.md` (measured numbers of today's build and the 8 extra defects).
6. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).

## Review lenses (apply to each of the nine screens)

1. **Coverage**: for every SPEC F row that names your screen, confirm it is visibly demonstrated at 1142x732 (S1.1 to S1.6, S2.1 to S2.3, S3.1 to S3.3, S5.1 to S5.5, S6.1, S6.2, A1, A2, A3, A5, A7, settings, live logs, B1, B3, B4, extra defects 1, 3, 4, 5, 6, 7, 8). Write the row, the evidence (element and its y position from a scratchpad probe), or the fix.
2. **Laws**: one visible thread in the first viewport; one scroller; sticky top bar; tape links and correct pin; one `h1`; the main job (`[data-job]`) top <= 140 (<= 204 on overviews); no engineering fact outside Details in the first viewport; every disabled control has a reason.
3. **Founder persona**: read every sentence as a freelance translator would: any word from {token, digest, repo, PRD, UAT, deploy, id, webhook, worker, job id} outside Details is a finding; sentences over 14 words get shortened; no em dash; no exclamation marks.
4. **Fixture fidelity**: content matches PLAN section 4 (names, counts, sentences); no invented metrics, customers or dates beyond the fixture; relative times consistent with "Updated" values.
5. **Direction fidelity**: the five carriers present and functional (rail, tape, one thread, pins, chalk where annotation exists); no decorative stitches; the pen circle exactly once per screen (rail) plus once per list (first Needs-you card on 01).
6. **Craft floor and consistency**: the shell markup identical across the nine files (diff the rail and top bar blocks with a scratchpad script; differences other than active item, breadcrumb, tape states, slot content are findings); page-specific `<style>` under 40 lines and token-only; no card grids of identical icon-heading-text; no hero; no eyebrow; SVG icons only.
7. **Contrast**: pairs used are SPEC B.2 pairs; spot-check computed colours with a probe on the thread button, meta text, pins on tints.
8. **Dark theme**: shoot each screen once with `data-theme="dark"` (temporary edit, revert) and look for unreadable areas.

## Commands

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/01-projects.html docs/design-system/screens/02-new-project.html docs/design-system/screens/03-overview-decision.html docs/design-system/screens/04-overview-paused.html docs/design-system/screens/16-settings.html docs/design-system/screens/17-live-logs.html docs/design-system/screens/08-documents.html docs/design-system/screens/09-document-draft.html docs/design-system/screens/10-document-locked.html
```
Read every PNG (both viewports, normal and `-scrolled`). Fix, re-run, re-read until `0 failing` and no visual finding remains.

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
COVERAGE: per screen, the F rows with evidence or fix
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
SHARED EDITS: any change outside the nine screens, with the reason
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: anything needing a SPEC decision
```

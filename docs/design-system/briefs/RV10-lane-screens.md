# RV10: review and fix the lane screens (WP14 Lane A 18 to 20, WP15 Lane B 21 to 23)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit the fourteen lane screens and, in small steps that keep every other screen green, `components-c.css`, the pass-2 block of `shell.css` and `components.js` sections 9 to 12 (re-run `shoot.mjs` with no args after any shared edit). You do not edit `SPEC.md`, `PLAN2.md`, `briefs/`, `tools/`, the pass-1 shared files or other builders' screens (report instead).

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16 (13, 14, 15 especially); A.3; C.2, C.3, C.6; D.1, D.3, D.5, D.6, D.7, D.16, D.17; E (every "Pass 2:" row for 18 to 23, lane switcher, tape request, dictation); part P: P.1, P.3 whole (P.3.6 vocabulary and the verbatim list are your checklist), P.4.1, P.4.3, P.5, P.6 (what is decided; the UI must not show designer notes).
2. `PLAN2.md` sections 3, 4, 5.
3. `briefs/WP14-lane-a-screens.md`, `briefs/WP15-lane-b-screens.md`, both hand-backs, the RV7 hand-back (frozen hooks).
4. The fourteen screens, `screens/_skeleton.html`, `components-c.css`, `shell.css`, `components.js`.
5. The live-build walk `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\research-lanes-live.md` (the verbatim sentences) and `research-lanes.md` sections 1, 2, 4 (what is stated versus inferred).
6. `C:\Users\adity\.claude\skills\impeccable\reference\craft-floor.md` and `operate.md` (as files).

## Review lenses

1. **Same fidelity as the shipped screens (identity test)**: open `shots/` PNGs of 18, 19, 22, 23 beside 02, 03, 08, 13; with content mentally removed the five carriers are the same (rail, sticky bar, one thread, pins, chalk); a lane screen that looks like a different product is a finding. Shell markup must match `_skeleton.html` byte for byte outside the documented differences (three-destination rail on 22/23, no tape on 21/22, the request tape on 23, locked destinations on 19).
2. **Verbatim sentences**: a scratchpad probe prints, per screen, each sentence of SPEC P.3.6's list as found or missing where the SPEC places it; fix every miss character for character.
3. **Vocabulary per lane** (Ruling 14): visible text of 18 to 20 contains "repository" only in the two permitted sentences (count them) and never "clone", "PRD", "branch", "pull request", "deploy"; 21 to 23 use "repository", "pull request", "branch" plainly and never a founder softening that hides a fact ("your code" where "your repository" is meant); pin sentences on 22/23 name no branch or number.
4. **One Thread and Ruling 15 on every state**: 18 enabled thread; 18c, 18d, 23b `data-thread-none="blocked"` with the quiet disabled button and its reason; 18e and 21b exactly one thread and it is the GitHub link; 19 `data-thread-none="working"`; 20 the slot thread; 21 thread; 22 the slot thread plus the ink send; 22b the send as the thread; 23 the banner gate with the slot copy hidden at rest. Count visible `[data-thread]` at rest and after scrolling 600px on 23.
5. **Law 6**: `whitespace.mjs` on all fourteen at both viewports and `--rail expanded`; read every `-first-annot.png`; blue rectangles that read as dead go to the planner with numbers; red ones you fix. The Task-with-aside block is centred with side margins under 240px at 1440.
6. **Behaviours**: on 18 choose a fake 312 MB zip and a `.rar` (state changes match 18c/18d), switch the radio (GitHub block, copy flow label), on 20 type text (enables "Use this document") and reach the listening state with a stubbed API; on 22 the send enables with text and Ctrl+Enter shows the inline Done; nothing sends by voice.
7. **Lane facts and honesty**: no invented numbers beyond the PLAN2 fixture (38 MB, 312 MB, 6 of 33, #42, #38, round 1 and 2); no promise the product does not make (no "read-only permission", no "export to GitHub"); the Details hold the private copy name and the limits; 19's steps are three; the request pins follow D-P2-5.
8. **Rail and tape**: 19 has five `[data-locked]` destinations with the tooltip text; 22 has three destinations and one pen circle; 23's tape has four steps with the pin on Merge (23b: Review, with the Blocked colour) and `aria-label="This request"`; the breadcrumb leaf on 23 truncates at 24ch.
9. **Copy audit**: sentences over 14 words in the first viewport, em dashes, exclamation marks, "Reject", "Submit" (except "Submit answers"), uppercase eyebrows (the copy flow's labels are sentence case).

## Commands (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/18-handoff-source.html docs/design-system/screens/18b-handoff-github.html docs/design-system/screens/18c-handoff-too-big.html docs/design-system/screens/18d-handoff-not-zip.html docs/design-system/screens/18e-handoff-github-permission.html docs/design-system/screens/19-handoff-copying.html docs/design-system/screens/20-handoff-requirements.html docs/design-system/screens/21-repo-connect.html docs/design-system/screens/21b-repo-connect-permission.html docs/design-system/screens/21c-repo-connect-empty.html docs/design-system/screens/22-repo-requests.html docs/design-system/screens/22b-repo-requests-empty.html docs/design-system/screens/23-repo-request.html docs/design-system/screens/23b-repo-request-blocked.html
node docs/design-system/tools/whitespace.mjs <the same fourteen files>
node docs/design-system/tools/whitespace.mjs --rail expanded <the same fourteen files>
```
The first three must end `0 failing`; the rail variant is reported. Shoot dark for 18, 22 and 23 (temporary `data-theme="dark"`, revert).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
IDENTITY TEST: the four lane screens compared with four shipped ones and the verdict
VERBATIM: the probe output (found/missing per sentence per screen)
VOCABULARY: counts per screen
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
WHITESPACE: per file and viewport, default and expanded
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: allowed rectangles that still read as dead, SPEC issues, product questions you could not settle from the SPEC
```

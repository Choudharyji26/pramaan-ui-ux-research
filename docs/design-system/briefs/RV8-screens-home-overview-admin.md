# RV8: review and fix WP11 (screens 01, 02, 03, 04, 08, 16, 17)

You are an Opus reviewer. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You FIX findings yourself in small edits and re-run the checks after each fix. You may edit the seven WP11 screens and, in small steps that keep every other screen green, `components-c.css`, the pass-2 block of `shell.css` and `components.js` sections 9 to 12 (re-run `shoot.mjs` with no args after any shared edit). You do not edit `SPEC.md`, `PLAN2.md`, `briefs/`, `tools/`, the pass-1 shared files or other builders' screens (report instead).

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16; A.3 (six laws); C.4, C.6; D.7, D.8, D.9, D.17; E (pass-2 rows for 01, 02, 03/04, 08, 16, 17, documents rows, autonomy setting, settings aside, settings your code, settings delete); part P: P.1, P.2 (F1, F3, F4, F13, F15, F16), P.3.2, P.4.2, P.4.3, P.5.1, P.5.2, P.5.9.
2. `PLAN2.md` sections 3, 4, 5.
3. `briefs/WP11-screens-home-overview-admin.md` and the WP11 hand-back (pasted by the controller); the RV7 hand-back (frozen hooks).
4. The seven screens, `components-c.css`, `shell.css`, `components.js`, `screens/_skeleton.html`.
5. The audit report for the "before": `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\whitespace-report.md` (F1, F3, F4, F13, F15, F16 rows).

## Review lenses

1. **Law 6 for real**: run `whitespace.mjs` on the seven files at both viewports and with `--rail expanded` / `--rail collapsed`; read every `-first-annot.png`; a blue (allowed) rectangle that still reads as dead is a finding for the planner (write it down with its numbers), a red one you fix. Then look with a designer's eye: is the absorbed space real content (facts the system has) or filler? Filler is a finding.
2. **The six laws** with `shoot.mjs`: One Thread (01 "Continue: test"; 02; 03 and 04 the banner's thread with the slot copy hidden by the D.14 observer; 08, 16, 17 `data-thread-none`), One Scroll (16's sticky aside must not create a scroller; 17 still one scroller), Always Know Where You Are (rail, breadcrumb, tape states unchanged), Main Job Owns The Space (02's form still begins by y 140; 03's lead tile by y 204), Plain Words (the seven pins; the setting's sentences; no "Reject"; no jargon in the first viewport; "Take a copy (.zip)" is the only file-format word).
3. **Bento** (P.4.3): DOM order lead, three digits, next, info; no `order`; tab order follows; the lead is the existing banner (tint, pin, sentences, `data-gate`); digits keep their sentences and Details; nothing invented; the large tape unchanged above; at 1142 the page scrolls at most about 30px.
4. **Settings** (P.2 F4, P.4.2): Save on the field's row with its reason; the setting switch is on, `aria-describedby` the sentence, the sentence swaps on toggle (probe), the disabled reason exists in the demo (not here); "Delete this project" opens a `<dialog>` that matches D.16 (quiet "Keep it" + danger); the aside is sticky and fitted (probe its top after scrolling 300px); the origin line is honest for todo.
5. **Entries** (Ruling 13): the three links resolve to existing files (02, 18, 21 must exist by now; if 18 or 21 is missing, the link still points at the agreed file name); the Meta label reads "For engineering teams"; the insight-weaver-537 card matches P.2 F16 and PLAN2 section 4.
6. **08**: rows 64px, purposes verbatim from E, advanced open, row link still covers the row (`:focus-within` ring), compact density untouched.
7. **17**: the count sentence still updates when Pause is pressed (components.js section 8 hooks intact); the list fills to the bottom; the title row holds one action.
8. **Copy audit**: collect visible text per page (probe `innerText`), list sentences over 14 words in the first viewport, em dashes, exclamation marks, "repository" (allowed on 16 only in the lane origin line when a lane project is shown; todo has none).

## Commands (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/01-projects.html docs/design-system/screens/02-new-project.html docs/design-system/screens/03-overview-decision.html docs/design-system/screens/04-overview-paused.html docs/design-system/screens/08-documents.html docs/design-system/screens/16-settings.html docs/design-system/screens/17-live-logs.html
node docs/design-system/tools/whitespace.mjs <the same seven files>
node docs/design-system/tools/whitespace.mjs --rail expanded <the same seven files>
node docs/design-system/tools/whitespace.mjs --rail collapsed <the same seven files>
```
The first three must end `0 failing`; the rail variants are reported (fix what you can within the 40-line page style; report the rest).

## Hand back

```
STATUS: approved | approved-after-fixes | blocked
FINDINGS: table (severity, file:line, what, fixed yes/no, note)
WHITESPACE: per file and viewport, default and both rail variants
FILES EDITED: absolute paths
COMMANDS RUN: with output tails
OPEN FOR PLANNER: allowed rectangles that still read as dead (with numbers), SPEC issues
```

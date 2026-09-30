# WP14: Lane A, Hand off your code (screens 18, 18b, 18c, 18d, 18e, 19, 20)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/screens/`. No git commands. Never publish an Artifact. Do not edit any shared CSS or JS; if a style is missing, use the closest existing class and list the gap. Page-specific `<style>` under 40 lines per file, tokens only, never restyling a shared component. You create seven new screens by copying `screens/_skeleton.html` (with its pass-2 sprite) and, for 19, the bento structure of `03-overview-decision.html` as WP11 leaves it (if WP11 is not finished, build the bento from SPEC P.4.3 directly).

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16 (7, 9, 10, 12, 13, 14, 15); A.3; C.2 (rail, locked destinations), C.3 (slot), C.4, C.6; D.1, D.3, D.5, D.6, D.16, D.17, D.18; E rows headed "Pass 2:" for 18, 18 copy flow aside, 18b, 18c, 18d, 18e, 19, 20, lane A join, lane switcher; part P: P.1, P.3.1 to P.3.3, P.3.5 (the rail, tape, strip and slot per screen), P.3.6 (vocabulary), P.4.1 (dictation on 20), P.4.3 (bento on 19), P.5.1 to P.5.7, P.5.12, P.6 (so you know what is decided and what is flagged; the UI never shows a designer note).
2. `PLAN2.md` sections 3 and 4 (the "Customer portal" fixture: file names, sizes, list entries, private copy name, steps, strips).
3. `components-c.css`, the pass-2 block of `shell.css`, `components.js` sections 9 to 12, `components-c-demo.html` (hooks: `input[name="source"]`, `[data-source]`, `.pm-file`, `[data-file-name]`, `[data-flow-source-*]`, `[data-thread-when="file"]`, `[data-enable-when="text"]`, `[data-dictate]`).
4. The live build's copy: `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\research-lanes-live.md` (Lane A section; every sentence you must keep verbatim is listed in SPEC P.3.6) and the prototype shots `scratchpad\screens-proto\046-connect-choose-existing-repository-1440x900.png`, `047-existing-context-empty-1440x900.png` (what exists; you design from the SPEC, not from these).

## Write (all under `docs/design-system/screens/`)

1. `18-handoff-source.html`: per SPEC P.3.3 "18". List-level rail (copy 02's rail), breadcrumb "Projects / Hand off your code", Back to Projects, no tape, no strip, `.pm-lanes` current "Hand off your code", `.pm-arch-task2`, the form with `#pm-job`, the aside `.pm-copyflow.pm-tile.pm-panel--fit`, the slot thread "Create private working copy" enabled, `data-thread-when="file"` on it. Both source blocks exist in the markup (`[data-source="upload"]` shown, `[data-source="github"]` hidden).
2. `18b-handoff-github.html`: the same file with the GitHub radio checked and the GitHub block shown; the account row, the `.pm-choice-list` (four rows, one `aria-disabled` with its reason), the helper; the copy flow's box 1 in its GitHub state.
3. `18c-handoff-too-big.html` and `18d-handoff-not-zip.html`: 18 in the two Blocked states (Ruling 15): `.pm-file--error`, the helper sentences, "Choose another file", `main[data-thread-none="blocked"]`, slot Blocked pin + sentence, the button quiet + `aria-disabled` + reason, box 1's chip "Too big" / "Not a .zip".
4. `18e-handoff-github-permission.html`: 18b before permission: the Needs-you account row and sentence, the list replaced by the Waiting reason line, the thread `<a class="pm-btn pm-btn--thread" data-thread href="#">Give permission on GitHub</a>` in the slot, "Create private working copy" quiet disabled with reason, box 1 "Not connected yet".
5. `19-handoff-copying.html`: the Customer portal overview while copying: project rail (project block "Customer portal · Working", Overview active, the five journey destinations `data-locked` with tooltip text "Opens when your private copy is ready" in their `title`/`aria-label` as `_skeleton` does for Try it), breadcrumb "Projects / Customer portal / Overview", strip and History per P.3.5, the large tape with Interview current and no ticks plus the note, `main[data-thread-none="working"]`, slot "Working · Copying your code.", the bento (lead Working tile with `.pm-steps`, three digit tiles, the wide next tile, the copy-flow info tile in progress with the sentence and Details). Budget 0% in the rail.
6. `20-handoff-requirements.html`: per P.3.3 "20": project rail with Interview active (the other destinations unlocked except Try it locked as usual), breadcrumb "Projects / Customer portal / Your requirements", strip per fixture, compact tape (Interview current no ticks, Documents/Roadmap/Build upcoming, Try it locked), `.pm-arch-task2`: the document form (file field, textarea 8 rows with a dictation button under its right edge, quiet "Use this document" `[data-enable-when="text"]` with reason), the aside copy flow in its done state; slot sentence + thread "Start the interview" (`<a href="05-interview-running.html">`); "Use this document" links to `08-documents.html` once enabled.

Every screen: one `h1`, the sprite with the pass-2 symbols, no "repository", "clone" or "PRD" in visible text except the two permitted verbatim sentences (P.3.6), no em dash, no emoji, sentences under 14 words where possible, engineering facts (private copy name, limits) under Details only.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/18-handoff-source.html docs/design-system/screens/18b-handoff-github.html docs/design-system/screens/18c-handoff-too-big.html docs/design-system/screens/18d-handoff-not-zip.html docs/design-system/screens/18e-handoff-github-permission.html docs/design-system/screens/19-handoff-copying.html docs/design-system/screens/20-handoff-requirements.html
node docs/design-system/tools/whitespace.mjs <the same seven files>
```
All end `0 failing` at both viewports; also `whitespace.mjs --rail expanded` on 18 and 20 at 1142 (report). Read every PNG. Probe (scratchpad, paste): on 18 the visible text contains "repository" exactly twice (the choice meta and the Details) and never "clone" or "PRD"; on 18 choosing a fake 312 MB zip `File` turns the page into 18c's state (`data-thread-none="blocked"`, helper sentence); switching the source radio to GitHub shows the GitHub block and writes "GitHub" into the copy flow; on 19 the rail has exactly five `[data-locked]` items and the lead tile's top y <= 204 at 1440; on 20 typing in the textarea enables "Use this document".

## Scope limit

Seven new HTML files, no shared CSS or JS edits.

## Hand back

PLAN.md section 3 format plus the PLAN2 section 3 lines per file, the probe output, and the coverage rows you demonstrate (L-2, L-3, L-4, L-8, T-1 on 20, T-3 on 19).

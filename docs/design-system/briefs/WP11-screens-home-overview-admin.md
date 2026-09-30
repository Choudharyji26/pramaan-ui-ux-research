# WP11: whitespace fixes group 1, bento and settings (screens 01, 02, 03, 04, 08, 16, 17)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/screens/`. No git commands. Never publish an Artifact. Do not edit any shared CSS or JS (`tokens.css`, `base.css`, `shell.css`, `components-a.css`, `components-b.css`, `components-c.css`, `shell.js`, `components.js`); if a style is missing, use the closest existing class and list the gap. A screen may hold at most 40 lines of page-specific CSS in its `<style>`, tokens only, never restyling a shared component. You edit seven existing screens in place; keep their shell markup (rail, top bar, tape, strip, sprite) identical to `_skeleton.html` except where this brief says otherwise, and add the sprite symbols from `_skeleton.html` (SPEC P.5.12) to every screen that uses them.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16 (7 rail, 9 Law 6, 10 fitted panel, 11 bento, 12 task2, 13 entries, 15 thread on forms); A.3 (six laws); C.4, C.6 (with the pass-2 archetype rows); D.7, D.8, D.9, D.16, D.17; E (every row headed "Pass 2:" that names 01, 02, 03/04, 08, 16, 17); part P: P.1, P.2 (F1, F3, F4, F13, F15, F16), P.3.2 (entries and lane switcher), P.4.2 (the setting on 16), P.4.3 (bento), P.5.1, P.5.2, P.5.9, P.5.13.
2. `PLAN2.md` sections 3 and 4 (fixture additions: 01's insight-weaver-537 card, documents purposes).
3. `components-c.css`, the pass-2 block at the end of `shell.css`, `components.js` sections 9 to 12, `components-c-demo.html` (the class names and hooks you use; grep them, do not guess).
4. The audit shots of your findings: `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\whitespace\08-documents-1440-first-annot.png`, `02-new-project-1440-first-annot.png`, `16-settings-1440-first-annot.png`, `04-overview-paused-1142-first-annot.png`, `03-overview-decision-1440-first-annot.png`, `17-live-logs-1440-first-annot.png` (what you are removing).

## Write

1. `01-projects.html` (P.2 F16, P.3.2): the entry row becomes three real links with the 16px gap and the Meta label "For engineering teams" before the third (hrefs 02, 18, 21; `title` per SPEC E "Pass 2: entry points"); drop the "In this proposal…" tooltips. The insight-weaver-537 card: pin Needs you, next sentence and meta per P.2 F16, href `22-repo-requests.html`, `data-rank="1"`, placed after "ui test". Everything else unchanged (count "9 projects").
2. `02-new-project.html` (P.2 F3): replace `.pm-arch-task` with `.pm-arch-task2`; insert `.pm-lanes` under the title (current "Describe your idea"); textarea `rows="10"`; the `.pm-ticks` list "What Pramaan does with this" after the fields; the consequence line last; the aside `.pm-tile.pm-panel--fit` "What happens next" with the four steps from 03's list. The thread stays "Start the interview" in the slot, enabled.
3. `03-overview-decision.html` and `04-overview-paused.html` (P.4.3, P.2 F13): replace `.pm-arch-overview` + `ov-left` + `ov-next` with `.pm-bento`; the banner gains `pm-tile pm-tile--lead` and keeps `data-gate`, its pin, sentences and the thread (04: "Raise the budget"); three `.pm-tile--digit` tiles each holding one `.pm-digit` from the current markup (the budget tile also holds the Details); the "What happens next" list as `.pm-tile--wide`; the info tile (03: "Your private workspace comes next." with its Details; 04: "Your private workspace is ready." + Details "Private repository: pramaan-build/todo-list-… " reusing the sentence style of 03). The large tape and its note stay above. Delete the `ov-*` styles; the page style holds only what the bento needs (aim for zero lines).
4. `08-documents.html` (P.2 F1): add `pm-table--two-line` to both tables; each first cell gets the purpose line (SPEC E "Pass 2: documents rows") as `<span class="pm-row-purpose">`; the advanced `details.pm-adv` gets the `open` attribute (every founder document is Done on todo). Keep column widths.
5. `16-settings.html` (P.2 F4, P.4.2): replace `.pm-arch-settings` with `.pm-arch-settings2`; left column sections in the order of P.2 F4 (name, budget with Save on the field's row, "Before each sprint" `.pm-setting` switch on with `data-on`/`data-off` sentences, dependency monitoring, your code with "Take a copy (.zip)" and the origin line "Started from an idea. No original code.", delete section with a closed `<dialog class="pm-dialog">` "Delete this project?" per D.16); right aside `.pm-tile.pm-panel--fit.pm-panel--sticky` "This project" with the pin line, the `.pm-meter` at 18%, "Settings last changed 35 minutes ago". Keep the existing save script; it must still find its inputs.
6. `17-live-logs.html` (P.2 F15): move the count sentence (`.pm-log-count`, keep its class and any `data-` hooks used by components.js section 8) into the title row as the title sentence and the quiet "Pause" (`data-log-pause`) into the title row's actions; the filter row keeps the three fields; the paused banner stays where components.js expects it. The log list height rule in the page style is adjusted so the list still fills to the bottom (one scroller).

Every screen: one `h1`, the thread rule per screen (01 thread "Continue: test"; 02 thread; 03 banner thread; 04 banner thread; 08, 16, 17 `data-thread-none="working"`), no lorem ipsum, no em dash, no emoji, engineering facts only in Details, sentences under 14 words where possible.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/01-projects.html docs/design-system/screens/02-new-project.html docs/design-system/screens/03-overview-decision.html docs/design-system/screens/04-overview-paused.html docs/design-system/screens/08-documents.html docs/design-system/screens/16-settings.html docs/design-system/screens/17-live-logs.html
node docs/design-system/tools/whitespace.mjs <the same seven files>
```
All end `0 failing` at both viewports. Read every PNG you produced (`shots/*-1142x732.png`, `-1440x900.png`, `-scrolled`, and `shots/whitespace/*-first-annot.png`); fix what looks wrong. Also run `whitespace.mjs --rail expanded` on 02, 03, 16 and `--rail collapsed` on 03, 16 and report (not gated) any failure with its numbers. Probe (scratchpad, paste): on 03 at 1440 the y of the lead tile's top (must be <= 204) and the DOM order of `.pm-tile` children; on 16 at 1142 the aside's `getBoundingClientRect().top` after scrolling `main` 300px (sticky: equals topbar + 16); on 08 the first row's height (64).

## Scope limit

Seven HTML files, no shared CSS or JS edits, page `<style>` under 40 lines each.

## Hand back

PLAN.md section 3 format plus the PLAN2 section 3 lines (`WHITESPACE:` and `THREAD:` per file), the probe output, and the coverage rows you demonstrate (W-F1, W-F3, W-F4, W-F13, W-F15, W-F16, L-1, T-2 on 16, T-3).

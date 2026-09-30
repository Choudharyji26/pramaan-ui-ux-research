# WP12: whitespace fixes group 2 and dictation (screens 05, 05b, 06, 07, 09, 10)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/screens/`. No git commands. Never publish an Artifact. Do not edit any shared CSS or JS; if a style is missing, use the closest existing class and list the gap. Page-specific `<style>` under 40 lines, tokens only, never restyling a shared component. You edit six existing screens in place; keep their shell markup identical to `_skeleton.html` except where this brief says otherwise; add the sprite symbols from `_skeleton.html` (SPEC P.5.12: `pm-i-mic`, `pm-i-stop` at least) to every screen with a composer.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16 (7, 9, 10, 15, 16); A.3; D.10, D.11, D.14, D.16; E rows headed "Pass 2:" for dictation, decisions brief block, interview finished gate, locked interview, reader head; part P: P.1, P.2 (F2, F5, F6, F11, F14), P.4.1 (dictation), P.5.1 (fitted panel inside the chat workbench), P.5.6, P.5.8, P.5.10, P.5.13.
2. `PLAN2.md` sections 3 and 4 (05b's question card reuses 05's; 07's activity reuses 13's entries).
3. `components-c.css`, the pass-2 block of `shell.css`, `components.js` sections 9 to 12, `components-c-demo.html` (grep the hooks: `[data-dictate]`, `[data-dictate-status]`, `.pm-composer-row--dictate`, `.pm-decisions-brief`, `.pm-actioncards`, `.pm-doc-head`, `.pm-toc-comments`, `.pm-panel--fit`).
4. Audit shots: `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\whitespace\05b-interview-empty-1440-first-annot.png`, `05-interview-running-1440-first-annot.png`, `06-interview-finished-1440-first-annot.png`, `07-interview-locked-1440-first-annot.png`, `09-document-draft-1440-first-annot.png`.

## Write

1. `05b-interview-empty.html` (P.2 F2): the decisions list shows the saved "Product idea · a tic tac toe game" row (copy 05's row markup) then the placeholder ring row "Your next answers appear here."; the count "1 of about 6 saved" and the head's progress fill at 1/6; the strip "Last saved: your decision "Product idea", Sunday · Nothing accepted yet" with the History entry; after the first Pramaan message insert 05's question card (both questions, unanswered, Submit is the thread; the composer's Send becomes quiet; the top-bar slot sentence stays "Needs you · Answer the first question."); the decisions aside gets `pm-panel--fit` and, after the list, the `.pm-decisions-brief` block (six rows, none ticked) and then the existing Details/foot order per P.5.6. Composer: add the dictation button (`.pm-composer-row--dictate`, `[data-dictate="#…"]`, status span in the hint).
2. `05-interview-running.html` (P.2 F6): the question card's body takes the two-column layout (the shared `.pm-qcard-body` rule does it; verify Q1 and Q2 sit side by side at 1440 and stack at 1142 with the rail expanded); decisions aside `pm-panel--fit` + brief block with "One-sentence outcome" ticked; dictation button; slot unchanged.
3. `06-interview-finished.html` (P.2 F11): the `.pm-chat-done` block becomes the gate: add `data-gate`, keep the Done pin and sentence, add the thread button "Create my product brief" (40px, `data-thread`) and the sentence from E; the top-bar slot's thread gets `hidden` plus the D.14 slot markup (`data-slot-sentence` sentence "Needs you · Create your product brief.") so the observer swaps them; decisions aside `pm-panel--fit` with the brief block collapsed to the one Done line; dictation button; composer Send quiet.
4. `07-interview-locked.html` (P.2 F5): inside `.pm-locked`, the "You can still" list becomes `.pm-actioncards` (three cards, copy per E "Pass 2: locked interview"); under the card a two-column row (page style: `grid-template-columns: 1fr 1fr; gap: 24px`) holding `.pm-thissprint` ("When this sprint is done you can:" + 13's three outcomes + the Then line from E "Pass 2: autonomy setting") and `.pm-activity` with 13's three entries; the decisions aside becomes `pm-panel--fit` (drop `pm-panel--inline`).
5. `09-document-draft.html` and `10-document-locked.html` (P.2 F14): wrap the document title, versions and byline in `.pm-doc-head` (chips right of the title, byline under, Details summary inline); in the contents rail replace the "Passage comments (1)" link with `.pm-toc-comments` (09: the one comment as in E; 10: "No passage comments."), keep the "Details" link. Nothing else in the reader changes (the spy, sticky heads, action bar).

Every screen: one `h1`, thread rule (05b: the card's Submit; 05: Submit; 06: the gate's thread with the slot copy hidden; 07 `data-thread-none="locked"`; 09: the action bar thread; 10 `data-thread-none="locked"`), no em dash, no emoji.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/05-interview-running.html docs/design-system/screens/05b-interview-empty.html docs/design-system/screens/06-interview-finished.html docs/design-system/screens/07-interview-locked.html docs/design-system/screens/09-document-draft.html docs/design-system/screens/10-document-locked.html
node docs/design-system/tools/whitespace.mjs <the same six files>
```
All end `0 failing` at both viewports. Read every PNG (normal, `-scrolled`, `-first-annot`). Probe (scratchpad, paste): on 05b at 1440 the decisions card's height versus its `scrollHeight` (equal: no inner scrollbar) and the thread rest under the question card (viewport bottom of the card to the composer top, must be <= 320); on 06 the count of visible `[data-thread]` at rest and after scrolling the thread to the top (1 and 1); on 05 at 1142 with `pm.rail=expanded` whether the question card's fieldsets stack (one column); on 09 the y of the version chips' top equals the document title's top within 4px.

## Scope limit

Six HTML files, no shared CSS or JS edits, page `<style>` under 40 lines each.

## Hand back

PLAN.md section 3 format plus the PLAN2 section 3 lines, the probe output, and the coverage rows you demonstrate (W-F2, W-F5, W-F6, W-F11, W-F14, T-1 on 05, 05b, 06).

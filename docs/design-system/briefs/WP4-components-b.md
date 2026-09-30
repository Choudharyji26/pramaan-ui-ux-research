# WP4: components-b.css and components.js (reading, chat, route, board, gate, stage, logs) for Tape and Thread

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Do not edit `tokens.css`, `base.css`, `shell.css`, `components-a.css` (report gaps instead). Use only `--pm-sys-*` and `--pm-cmp-*` tokens; no hex, no raw colour functions, no `--pm-ref-*`.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: A.3, B.4 to B.9, C.5 (single scroll), C.6 (archetypes), D.10 (Reading Document), D.11 (Chat Workbench), D.12 (Sprint Route), D.13 (Feature Board), D.14 (Approval Gate), D.15 (Checklist and Preview Stage), D.17 Log Viewer only, E (copy), G.1 to G.3 (the three moves).
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3 and 4 (content fixture: use the ui test brief, the test interview, the todo roadmap, the todo sprint board, the test first checklist, the log lines).
3. `docs/design-system/tokens.css`, `base.css` fully. `shell.css`, `screens/_skeleton.html`, `components-a.css` if present (WP2 and WP3 run in parallel). For buttons, pins, chips, details, popover use the class names from SPEC D.1, D.5, D.16, D.18 exactly (`.pm-btn .pm-btn--thread`, `.pm-pin[data-status]`, `.pm-pin--tint`, `.pm-chip`, `.pm-details`, `.pm-popover`) so your components pick up WP3's styles when both files load. Do not restyle them.

## Write

### `docs/design-system/components-b.css`

- `.pm-reader` per D.10: contents rail `.pm-toc` (sticky inside its non-scrolling column, current item 2px ink bar + weight 600), reading column `.pm-reader-body` (the one scroller: `height: calc(100vh - var(--pm-topbar-h) - var(--pm-strip-h)); overflow-y: auto; scroll-padding-top: 64px`), the action bar sits inside it as the first sticky child (`.pm-actionbar` from WP3), byline, `article` typography (h2 Heading + sticky `.pm-section-head`, h3 Body 600, p Reading `max-width: 68ch`, lists, `code` sunken mono, tables via `.pm-table-scroll`), version chips (`radiogroup` of `.pm-chip`), commented passage `.pm-marked` (chalk 2px underline, offset 4px) and margin marks `.pm-chalk-mark` (24px chalk-tint disc with number, positioned in the right margin column at the passage's top using `position: absolute` inside `position: relative` sections), the floating "Comment on this passage" button (`.pm-comment-cta`, `position: fixed`), the comment popover content block (`.pm-quote` chalk-tint block, 8px padding, no left border), Details disclosure at the byline end. Locked and empty variants.
- `.pm-chat` per D.11: `grid-template-rows: auto minmax(0,1fr) auto` inside the workbench archetype; `.pm-chat-head` 48px with the topic tape (`.pm-progress` 4px ink track 120px + fill); `.pm-chat-thread` (the only scroller, `overflow-y: auto; scroll-padding-bottom: 16px`), `.pm-msg` (speaker Meta 600 muted, body Reading, time Meta; Pramaan messages plain with hairline separators; founder messages `.pm-msg--you` on sunken bg radius 10 padding 12 16, left aligned), streaming pin, "New reply below" sticky pill `.pm-newreply`; `.pm-qcard` question card (raised, fields, docked footer with the thread Submit); `.pm-composer` (last row, min-height 96, stitch top, textarea auto-grow 1 to 6 lines with a 6-line `max-height` and `overflow-y: auto` allowed ONLY on the textarea itself when it exceeds 6 lines: NOTE the shoot probe counts scrollers, so keep the textarea under 6 lines in demos), attach ghost, send `.pm-btn--thread.pm-btn--lg`, hint Meta). `.pm-decisions` panel (uses `.pm-panel` from shell if present, otherwise define the same height rule): sticky header 48 with count + 4px tape line, `.pm-decision` rows 44px collapsed (title Label, value Body one-line ellipsis, ghost Edit on hover/focus), expanded row with inline textarea + quiet Save + ghost Cancel, sticky footer 40, Details at the bottom. Finished-state and locked-state modifiers.
- `.pm-route` per D.12: vertical stitched line at x = 20px (`.pm-stitch-v` from base.css positioned absolutely), stage nodes `.pm-route-node` (24px pin head on the line, `data-status`), cards `.pm-route-card` (raised, padding 16 20, max-width 760), outcome list `.pm-route-outcomes` with 6px hollow ticks (`::before` ring), `.pm-route-try` chalk-tint block, `.pm-route-then` Meta line, done node's "Open what was built" quiet link, terminal node `.pm-route-end`, drafting skeleton (3 skeleton nodes). Chalk quote `.pm-said` (Meta, chalk text, chalk-tint block, "You said: '…'" + ghost "Edit that decision") shown only when `[data-words="on"]` is on the page.
- `.pm-board` per D.13: compact table, sticky header, feature cell (Label 600 + Body muted, max 2 lines), stage cells with `.pm-pin--tint` chips 28px, no hatched pattern; `.pm-sprint-head` (Heading + pin + sentence + `.pm-progress` with "1 of 3 features ready" at Digits 22px: use `.pm-t-digits` with an inline `font-size` override token `--pm-digits-sm: 22px` defined in this file as a component token `--pm-cmp-board-digits-size`), `.pm-activity` feed (last 5 entries, Body + Meta time, empty state), `.pm-thissprint` strip (320 at >= 1280 else stacked).
- `.pm-actionbar--gate` content styles per D.14 if WP3's bar lacks them (Heading question + Body consequence + quiet + thread 40px), the inline "Ask for changes to the plan" textarea region `.pm-gate-changes` below the bar, approved and disabled-with-reason states.
- `.pm-stage` per D.15: `height: calc(100vh - var(--pm-topbar-h) - var(--pm-strip-h)); display: grid; grid-template-rows: 40px minmax(0,1fr)`, stage bar (Meta + quiet "Open in a new tab"), iframe fills (`width: 100%; height: 100%; border: 0; border-radius: var(--pm-radius-card); background: var(--pm-sys-surface-raised); outline: var(--pm-hairline)`), loading skeleton, error callout, waiting state. `.pm-checklist` panel: sticky header with count + 4px tape line, items `.pm-check` (task Body 500, expected Meta muted, verdict `radiogroup` of three 28px quiet toggles `.pm-verdict` with the chosen one ink-filled, "What happened?" one-line textarea revealed for Not quite / Confusing), sticky footer with the thread "Accept sprint 1" (disabled with reason until all answered) or "Ask for changes (n)" + quiet "Accept anyway".
- `.pm-log` per D.17: filter row (32px controls), count sentence, list `.pm-log-list` (the one scroller, `height: calc(100vh - var(--pm-topbar-h) - 108px)`), entries `.pm-log-entry` (2 rows: time mono tabular muted, level pin, plain event name Body, wire event mono beside; facts Meta mono with 8-char ids + 16px copy buttons; ghost Details expanding a sunken mono block), sticky hour separators, paused banner.

### `docs/design-system/components.js` (vanilla, `defer`)

Small behaviours only, each guarded by a feature check so pages without the component do nothing:
1. `.pm-details` needs no JS. Popovers use the native `popover` attribute; add a 10-line fallback that toggles `hidden` if `HTMLElement.prototype.togglePopover` is missing.
2. Decision rows: click/Enter expands, Escape cancels, Save writes the textarea value back into the row (in-memory only).
3. Verdict toggles: `radiogroup` keyboard (arrows, and 1/2/3 within a focused item), reveal the note field, update the panel count and the footer thread label ("Accept sprint 1" vs "Ask for changes (n)") and its disabled reason.
4. Approval gate: when `.pm-actionbar--gate` is in view, hide the top-bar slot's `[data-thread]` copy with `hidden`; when it scrolls out, show it (IntersectionObserver). Ensure exactly one visible `[data-thread]` at all times.
5. "Show my words" switch toggles `data-words="on"` on `<main>` and persists `localStorage["pm.words"]`.
6. Chat: Ctrl+Enter submits the composer form; textarea auto-grow; "New reply below" pill logic (only if a demo button appends a message).
7. Reader: scroll-spy for the contents rail (IntersectionObserver on `h2`), selection-triggered "Comment on this passage" button, copy buttons (`navigator.clipboard.writeText`) with a 2s "Copied" label swap.
8. Log viewer: Pause/Resume toggles auto-scroll and the paused banner count (demo increments only).

### `docs/design-system/components-b-demo.html`

One page, sticky-headed sections, each component in its states with real content from PLAN.md section 4: a reading document excerpt (One-sentence outcome, Success contract table with KPI-1, Guardrails, Constraints with comment #1), the chat workbench (running with the question card, then finished), the sprint route for todo (4 sprints; awaiting and building states; "Show my words" on), the feature board for todo sprint 1 plus activity feed, the approval gate (default, approved, disabled with reason), the stage + checklist (test first, 3 of 5 answered), the log viewer (10 entries). Because a demo page with several scrollers would fail the single-scroll probe, structure the demo as `main.pm-main` (page scroller) with each workbench component rendered inside a fixed-height `.pm-demo-frame` (`height: 640px; overflow: hidden`) so that inner scrollers exist but never overflow in the demo (keep the demo content short enough), OR split into two demo pages `components-b-demo-reading-chat.html` and `components-b-demo-plan-build-try.html`. Exactly one `[data-thread]` per page (use `.pm-btn--thread-demo` without the attribute for the other thread examples, matching WP3's convention). One `h1` per page.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/components-b-demo*.html
```
Both must end with `0 failing`. Read every PNG and fix what looks wrong (chalk marks aligned to their passage, route line continuous, board chips aligned, stage fills the height, checklist footer visible without scrolling at 732, log entries readable). Paste the numbers: reading column width at 1142 and 1440, chat thread height at 732, stage iframe height at 732.

## Scope limit

components-b.css target under 1100 lines; components.js under 300 lines; demo pages under 700 lines each. No new tokens (list gaps). Do not restyle WP3 components.

## Hand back

Report format in PLAN.md section 3, plus the list of class names, data attributes and JS hooks you defined.

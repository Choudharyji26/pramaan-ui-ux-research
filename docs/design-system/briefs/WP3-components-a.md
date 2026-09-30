# WP3: components-a.css (buttons, pins, banners, cards, digits, table, forms, feedback) for Tape and Thread

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Do not edit `tokens.css`, `base.css`, `shell.css` (report gaps instead). Use only `--pm-sys-*` and `--pm-cmp-*` tokens; no hex, no raw colour functions, no `--pm-ref-*`.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: A.3 (laws), B.4 to B.7 (type, spacing, elevation, motion, density), D.1 (Thread Action, buttons, Action Bar), D.5 (Status Pin, the fixed vocabulary and both mapping tables), D.6 (Banner), D.7 (Project Card), D.8 (Metric Digits), D.9 (Table incl. wide-table rule), D.16 (Empty, Locked, Error, Popover, Dialog, Toast), D.17 Form controls and Save pattern (not the Log Viewer), D.18 (Search, chips, disclosure, skeleton), E (copy) for the demo labels.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 3 and 4.
3. `docs/design-system/tokens.css`, `base.css` fully; `shell.css` and `screens/_skeleton.html` if they already exist (WP2 runs in parallel; if absent, build your demo page without the shell and add it later is NOT required: use a minimal `<main class="pm-main">` with one `h1` and one `[data-thread]`).

## Write

### `docs/design-system/components-a.css`

One rule block per component, in this order, each preceded by a comment naming the SPEC section. All states listed in the SPEC (default, hover, focus-visible, active, disabled-with-reason via `aria-disabled` + `.pm-btn-reason`, loading via `aria-busy`, error, empty, locked) must exist as CSS. Specifics:

- `.pm-btn` base + `--thread` (bg `--pm-cmp-button-thread-bg`, fg, 1px border `--pm-cmp-button-thread-border`, height `--pm-cmp-button-h`, radius, Label 600, `gap: 8px`, icon 16px), `--ink`, `--quiet`, `--ghost`, `--danger`, sizes `--lg` (40px) and `--sm` (32px), `--icon` (square). Loading: `.pm-btn[aria-busy="true"] .pm-spinner` 16px ring using `border` and `currentColor`, rotating 800ms linear (stops under reduced motion and shows a static ring).
- `.pm-actionbar` (52px, sticky top 0 inside a scroller, raised bg, hairline bottom, left pin + sentence, right actions) and `.pm-actionbar--gate` (64px, Heading question + Body consequence).
- `.pm-pin` with `data-status` for the seven states: head 10px round in the status colour, glyph as inline SVG (`<svg class="pm-pin-glyph">` from the sprite: check, x, lock, bar; hollow ring for waiting via `background: transparent; box-shadow: inset 0 0 0 2px currentColor`), label Label 500, sentence Body muted. Working live dash: `.pm-pin[data-status="working"][data-live="true"] .pm-pin-head::after` dashed ring animating `stroke-dashoffset` (SVG circle) 2s linear, paused under reduced motion. `.pm-pin--tint` chip variant 28px with the status tint bg and 4px radius, used in board cells and callouts.
- `.pm-banner` kinds `needs-you, working, paused, blocked, done, info` (tint bg per D.6, no side stripe, padding 16 20, radius card, pin + Heading sentence + Body + at most one quiet action, Details disclosure inside allowed).
- `.pm-card` and `.pm-card--project` (whole `<a>` is the card; grid per D.7; hover, focus-within ring, `.pm-card--decision` draws the chalk pen circle SVG around the pin label, only one per list); `.pm-card-grid` (2 columns, 3 at >= 1440, gap 16).
- `.pm-digits` / `.pm-digit` per D.8 (engraved: sunken bg with `box-shadow: inset -1px -1px 0 var(--pm-sys-hairline)`, Digits step tabular, `min-width: 4ch`, separator and unit at Body muted, sentence beside; row 72px; `.pm-digit--none` hairline dash instead of a number).
- `.pm-table` per D.9: sticky thead (`top: var(--pm-topbar-h)` inside `main.pm-main`, `top: 0` inside a scroller via `.pm-table--in-scroller`), row height `--pm-row-h`, row link overlay (`tr { position: relative } .pm-rowlink::after { content: ""; position: absolute; inset: 0 }`), hover sunken, focus-within ring on the row, skeleton rows, empty row. `.pm-table-scroll` wide-table wrapper (`overflow-x: auto`, `min-width: 640px` table, sticky first column, nowrap mono ID cells).
- Forms per D.17: `.pm-field`, `.pm-label`, `.pm-input`, `.pm-textarea`, `.pm-select` (custom chevron), `.pm-help`, error state, disabled state with reason, `.pm-switch` (36x20), native checkbox/radio inherit `accent-color`. `.pm-save` pattern: a `.pm-row` with the quiet button and `.pm-btn-reason`; `.pm-saved` inline confirmation (Done pin + "Saved 14:10").
- `.pm-search` (36px, icon left, clear right), `.pm-chip` and `.pm-chip[aria-checked="true"]`, `.pm-details` (summary with chevron, sunken content), `.pm-skeleton` variants (text lines, table rows).
- `.pm-empty`, `.pm-locked`, `.pm-error` per D.16; `.pm-popover` (`position: fixed`, shadow float, 360 max); `dialog.pm-dialog` + `::backdrop` scrim; `.pm-toast` (bottom-left of main, status role, enter 180ms, leave 90ms).
- Tooltip for collapsed rail items and tape steps: native `title` only (no custom tooltip component).

### `docs/design-system/components-a-demo.html`

Every component above in every state, with real labels from SPEC E and PLAN section 4 (for example the 9 project cards, the documents table rows, a Needs-you banner, the digits for project "test" and for "Todo list" paused, a settings form with the Save pattern, a toast, a dialog opened by a button, an empty state, a locked state, an error state, the 7 pins with their sentences and the tint chips). Sections have sticky `.pm-section-head` headers. Include a theme toggle and density toggle (reuse `window.pmTheme` if shell.js exists, else inline 3 lines). One `<h1>`, one `[data-thread]` (the demo's own "Accept this draft" in a demo action bar at the top; every other thread example in the page must be shown inside a `<div inert hidden-thread>` using class `pm-btn--thread-demo` which has the same look but NOT the `data-thread` attribute, so the One Thread check still holds and the style guide can still show the button).

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/components-a-demo.html
```
Both must end with `0 failing`. Read every PNG produced and fix visual problems (alignment on the 4px grid, pin glyphs centred, digits aligned, table header sticky, no clipped text). Add a scratchpad one-off that lists every colour pair you used (fg token, bg token) and confirm each is in SPEC B.2; paste the list.

## Scope limit

components-a.css target under 900 lines; the demo page under 600 lines. No shell, no reading/chat/route/board/stage/log components (WP4). If a component needs a token that does not exist, use the closest `--pm-sys-*` token and list it under GAPS.

## Hand back

Report format in PLAN.md section 3, plus the list of class names and data attributes you defined (screen builders will rely on them verbatim).

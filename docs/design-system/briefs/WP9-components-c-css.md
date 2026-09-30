# WP9: pass-2 shared components, CSS (components-c.css, shell.css pass-2 block, sprite, demo page)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You own exactly four files: `components-c.css` (new), `shell.css` (append only, under a final comment `/* PASS 2 (SPEC P.5.1) */`; never edit an existing line), `screens/_skeleton.html` (add the five sprite symbols of SPEC P.5.12 to the sprite, nothing else) and `components-c-demo.html` (new). You do not edit `tokens.css`, `base.css`, `components-a.css`, `components-b.css`, `components.js` or any screen; if you need a behaviour, write the markup hooks the SPEC names and list the gap. WP10 writes the JavaScript for these hooks at the same time from the same SPEC section.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: "Rulings 2026-09-30" 1 to 8 and pass 2 rulings 9 to 16; A.3 (six laws); B.4 to B.9 (type, spacing, motion, density, z, layout constants); D.1, D.5, D.6, D.8, D.17, D.18 (the components you extend); and the whole of part P, especially P.4 (the four trend items) and P.5 (every component you build, with numbers).
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN2.md` sections 2, 3 and 4.
3. `tokens.css`, `base.css`, `shell.css`, `components-a.css`, `components-b.css` in the same folder (read them whole: you must reuse their class names and tokens, never restyle them), and `screens/_skeleton.html`.
4. The three demo pages `components-a-demo.html`, `components-b-demo-*.html` (copy their structure for your demo page).

## Rulings that bind you

- Tokens only: no hex, no rgb/oklch literal, no `--pm-ref-*` outside tokens.css; every text/background pair is one of SPEC B.2. No em dash anywhere. No `:global {` block form, no stray `*/`. `check-css.mjs` must stay green with the new file included (it walks the folder).
- Ruling 10 (fitted panel), 11 (bento), 12 (task2 replaces task), 16 (motion: only the milestone stitch and the dictation ring are new; nothing loops).
- One family, seven type steps, 4px grid, radii 4/6/10/999, hairlines 1px, stitch only for seams.

## Write

### 1. `shell.css`, appended block (SPEC P.5.1, literal values)

`.pm-content { container: pm-content / inline-size; }` · `.pm-arch-task2` · `.pm-arch-settings2, .pm-arch-request` · `.pm-arch-plan2` · `.pm-arch-build` with its three areas and the `@container pm-content (min-width: 1000px)` two-column form · the `@container pm-content (max-width: 899px)` single-column fallback for task2, settings2, request, plan2 · `.pm-panel--fit` and `.pm-panel--fit.pm-panel--sticky` · the workbench placement `.pm-arch-chat .pm-panel--fit, .pm-arch-stage .pm-panel--fit { margin: 16px 16px 0 0; border-left: var(--pm-hairline); max-height: calc(100% - 16px); }`. Keep `.pm-arch-task` and `.pm-arch-overview` as they are (retired from screens, still defined).

### 2. `components-c.css` (new; header comment naming SPEC P.5; one section per component, in this order)

P.5.2 `.pm-lanes` · P.5.3 `.pm-choice`, `.pm-choice-list` · P.5.4 `.pm-file` (+ `--error`) · P.5.5 `.pm-copyflow` (+ data hooks, in-progress and done chips) · P.5.6 `.pm-decisions-brief` · P.5.7 `.pm-steps`, `.pm-steps--mini`, `.pm-check` · P.5.8 `.pm-actioncards` · P.5.9 `.pm-meter` · P.5.10 `.pm-doc-head` · P.5.11 `.pm-request-composer`, `.pm-request-list`, `.pm-request` · P.4.1 `.pm-dictate` (idle, listening with the Working dash ring reusing the pin's `data-live` animation, done, unavailable, error; the status span in the composer hint) · P.4.2 `.pm-setting` (switch row with the consequence sentence, disabled with reason) · P.4.3 `.pm-bento`, `.pm-tile`, `--lead`, `--wide`, `--digit` · P.4.4 the tape milestone: `.pm-tape[data-milestone] li[data-state="done"] .pm-tape-num svg path` draw animation (stroke-dasharray 24, 240ms, `--pm-ease-out`, `li:nth-child(n)` stagger 80ms for n = 1..5), the current step's `.pm-tape-ticks i.on` fill stagger 120ms, `.pm-milestone-line` (Done pin + sentence, 180ms opacity in), all under `@media (prefers-reduced-motion: reduce)` reduced to no animation · P.5.13 `.pm-table--two-line` (row 64: `td { padding: 12px 16px 14px }`, `.pm-row-purpose` Meta muted under the link), `.pm-device-switch` (three chips centred in the stage bar) and `.pm-device` (frame: `--pm-device-w`, centred, control-border 1px, radius card, caption Meta under), `.pm-plan-aside` (rows 40px, current row 2px inset ink bar + weight 600, jump links), `.pm-route-card--skeleton` (six bars as P.2 F10), `.pm-toc-comments` (Meta list under the contents links), `.pm-qcard-body` two-column rule (`@container` not available inside the card: use `.pm-qcard-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); column-gap: 24px; } .pm-qcard-title { grid-column: 1 / -1; }`), `.pm-composer-row--dictate { grid-template-columns: auto auto minmax(0, 1fr) auto; }`.

Every component: default, hover, focus-visible (the B.6 ring), disabled with reason where it has a control, dark theme (only `--pm-sys-*` so it follows), compact density where rows exist.

### 3. `screens/_skeleton.html`

Add the five `<symbol>`s from SPEC P.5.12 inside the existing sprite, after `pm-i-external`. Nothing else changes in the file.

### 4. `components-c-demo.html` (new, at the folder root beside the other demos)

The same shell as the other demo pages (rail collapsed, top bar with a sentence slot, `main[data-thread-none="working"]`, one `h1` "Components C"), one section per component above with every state visible at once (static markup; where WP10's JS will act, the static state is shown and labelled). Include: the lane switcher with each lane current (three rows); two choice cards and a six-row choice list with one disabled row; the file field in default, chosen and the two error states, plus the three prototype error sentences from SPEC E "Pass 2: 20 requirements"; the copy flow in "no file", "file chosen", "GitHub", "in progress", "done" and "too big"; the decisions brief block untouched, first ticked, collapsed Done line; steps (four Done, one Working), mini steps in every fill combination, the check in Done and Blocked; three action cards; the meter at 18% and 100%; the document head; the request composer (ink send and thread send) and four request rows in the four pins of the fixture; the dictation button in all five states with their status lines; the setting switch on, off, disabled with each reason; a bento with a lead banner (`data-gate` with a thread: this demo's one thread, so drop `data-thread-none` from `main` if you include it, or show the lead without the thread button and keep `data-thread-none`: choose the latter), three digit tiles, a wide next tile, an info tile; a tape with `data-milestone` end state and a review-only "Play once" button (`.pm-review-only`) that WP10 wires; the two-line table with four rows; the device switch with a 390px frame; a plan aside; a skeleton route card; the TOC comments list.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/components-c-demo.html
node docs/design-system/tools/whitespace.mjs docs/design-system/components-c-demo.html
```
All three end `0 failing`. Read every PNG in `docs/design-system/shots/` and `shots/whitespace/` that you produced (normal, `-scrolled`, `-first-annot`) at both sizes and fix what looks wrong. A probe (scratchpad script, paste the numbers): the computed height of a `.pm-request` row (64), a `.pm-steps` row (44), a `.pm-tile` min-height (120), the `.pm-arch-build` column count at a 1030px and an 846px `.pm-content` width (2 and 1), the `.pm-panel--fit` height with the demo's plan aside content (must equal its content, no scrollbar).

## Scope limit

Four files. No screen edits, no JS. Page-specific `<style>` in the demo under 40 lines.

## Hand back

PLAN.md section 3 format plus the probe numbers, the list of every class you defined (so WP10 and the screen builders can grep it), and any SPEC P.5 number you could not meet with the reason.

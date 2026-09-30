# Tape and Thread: the Pramaan builder design system

## Rulings 2026-09-30

Controller rulings applied on top of v1.0; where an older sentence disagrees, the ruling wins.

1. **Tabular numerals only in column contexts.** Meta, Body and Label are proportional; `.pm-tnum` (tabular-nums) is applied only to numeric table cells, the log time column, the tape and "n of m" digit blocks (B.4).
2. **Status colour fixes.** Light Waiting label moves to ink-500 (5.57:1 on ink-50, 6.02:1 on white); dark Locked tint moves to ink-900 (5.27:1); every status label on its own tint is now a checked pair in B.2 (B.3).
3. **Comfortable row is 46px** (12 + 22 + 12); compact stays 36px (B.7, D.9, D.11).
4. **`--pm-tape-w-max: 440px`** joins the layout constants; the tape is `min-width: var(--pm-tape-w)`, `max-width: var(--pm-tape-w-max)` (B.9, D.3).
5. **No OKLCH `@supports` fallback.** The hex value beside each reference token is a documented sRGB twin, not a runtime fallback (B.1).
6. **Motion:** nothing loops except the Working dash and the loading skeleton pulse (B.6, D.18).
7. **One rail state per user, on every screen (finish review, finding 5).** The rail is expanded (248px) or collapsed (64px) as ONE choice stored in `localStorage["pm.rail"]` and applied identically on every screen. With nothing stored the default is expanded at viewport width >= 1280 and collapsed below 1280; a stored choice always wins at any width (below 1024 the rail stays collapsed regardless). There is no archetype-based auto-collapse and no `pm.rail.pinned`. The collapsed rail keeps an accessible name and a visible hover and focus tooltip on every control (C.2, D.2). Where an older sentence says a workbench screen collapses the rail on its own, or draws a page screen at 1142 with the rail expanded, this ruling wins. Amendment (finish review, fix 5): the collapsed rail shows a permanent 40px expand button (`»`) under the monogram, which is plain branding and no longer the toggle, and a first-visit hint ("Menu labels are hidden. Expand navigation", "Got it", stored as `pm.railhint=1`) appears once when nothing is stored in `pm.rail` on a 1024 to 1279px window (C.2, D.2).
8. **Dark rail lift (finish review, finding 7).** In the dark theme the rail is one ink step lighter than the page: `--pm-sys-surface-rail` ink-900 (was ink-950), `--pm-sys-surface-rail-active` ink-800, `--pm-sys-hairline-on-rail` ink-700, so the rail no longer merges with the ink-950 ground (B.3). The dark blocks in `tokens.css` are generated once from `tools/gen-theme.mjs` and checked by `tools/check-css.mjs`.

### Rulings 2026-09-30, pass 2 (rulings 9 to 16; they override every older sentence and every pass-1 brief)

9. **Law 6, No Dead Space, is in force** (A.3 row 6, P.1). `tools/whitespace.mjs` is a gate like `shoot.mjs`: every screen must end `0 failing` at both viewports before hand-back. The thresholds are constants in the tool and in P.1; nobody widens them or adds an allowlist entry without a SPEC ruling.
10. **A side panel is never taller than its content.** Every side panel that holds less than its column (decisions, checklist, This sprint, plan aside, settings aside, copy-flow aside) is a fitted card, `.pm-panel--fit` (P.5.1): content height, hairline border, card radius, sticky under the top bar on page screens; the ground under it is breathing room. The full-height edge-to-edge panel survives only where its content fills it (the log list, the reader).
11. **The overview is a bento** (P.4.3): `.pm-bento` replaces `.pm-arch-overview` on 03, 04 and the lane overview 19. The lead tile is the decision banner and keeps `data-gate`; DOM order is reading order.
12. **The plain centred Task archetype (`.pm-arch-task`) is retired from every screen.** Forms use `.pm-arch-task2` (form + fitted aside, P.5.1); the class stays in `shell.css` and in the tool's allowlist for a future single-column form only.
13. **Three lanes, three first-class entries.** The projects list's entry row links to 02 (Describe your idea), 18 (Hand off your code) and 21 (Work in my repository, labelled "For engineering teams"); the "In this proposal every way in opens the new project form" tooltip is gone. 02, 18 and 21 share the lane switcher `.pm-lanes` (P.3.2).
14. **Two audiences, one voice.** Lane B screens (21 to 23) are for an engineering team: "repository", "pull request", "branch" and "merge" may appear in visible copy, branch names and pull request numbers may sit in a row's meta line in mono; commit ids, job ids and digests still live under Details. Every other screen keeps the founder vocabulary of E; on those screens "repository" appears only inside a live safeguard sentence quoted verbatim (P.3.6).
15. **The thread on a form is enabled or absent.** A form whose thread cannot be pressed yet (no file chosen, no repository chosen, a blocked file) declares `main[data-thread-none="blocked"]`, shows the Blocked or Needs-you sentence in the slot, and renders the button quiet and `aria-disabled` with its reason beside it (D.1), exactly as 11b renders Approve. A disabled button is never filled canary.
16. **Motion, pass 2.** Two additions to B.6: the milestone stitch (P.4.4), a once-only sequence of at most 600ms that runs only on a state change and never on load; and the dictation ring, which is the Working dash (already permitted) around the mic button while listening. Nothing else new moves.

Version 1.0, 2026-09-30. Pass 2 additions are the part headed "P. PASS 2" at the end of this file; where a pass-2 sentence and an older one disagree, pass 2 wins. Authoritative. Builders follow the numbers here literally; where this file and any other document disagree, this file wins. Direction contract: `.impeccable/surfaces/app.md` (THE FITTING ROOM, seed key c887b495). Product facts: `PRODUCT.md`.

---

## A. Name, thesis, laws

### A.1 Name

**Tape and Thread.** The two carriers that do work on every screen: the measuring **tape** (the journey rail: where you are, what is done, what is next) and the single **thread** (the one thread-coloured element on the screen: the next decision). Everything else is ink, paper and chalk.

### A.2 Thesis

A made-to-measure fitting, not a dashboard. The founder walks into a room where the work is pinned up in order, one tape shows exactly where the garment stands, and one thread is held out to them: the next thing only they can decide. Nothing is hidden, nothing is lost, nothing shouts. The tailoring metaphor lives in the visuals (tape, thread, pins, chalk, stitched hairlines, ink rail) and never in the words: the product keeps its own vocabulary (Interview, Documents, Roadmap, Build, Try it; accept, ask for changes, approve).

Identity test: with all content removed, the screen is still recognisable by five things: (1) the ink rail on the left, (2) the tape journey rail in a hairline sticky bar, (3) exactly one canary thread element at the top right, (4) pin-head status dots, (5) chalk-slate annotations in the margin.

### A.3 The six laws (five from pass 1, Law 6 from pass 2)

Each law is a testable rule. "Kills" lists the reviewer feedback items it resolves (see the coverage matrix in F).

| # | Law | Testable rule | Kills |
|---|---|---|---|
| 1 | **One Thread** | Exactly one element per screen uses `--pm-sys-thread` as a fill. It is the next decision. It lives in the top bar's thread slot (or the docked composer's Send on chat screens, or the sticky Action Bar on reading screens). It never scrolls away. If nothing needs the founder on that screen, there is NO thread: the slot shows a status sentence (Working, Waiting, Paused with its reason), never an empty gap, and `main` declares `data-thread-none="working|waiting|paused|done|locked|blocked"` (blocked: a check failed and Pramaan is fixing it, screen 13b). Navigation ("Open Build") and housekeeping ("Take a copy") are never dressed up as the thread. Automated check: visible `[data-thread]` count is 1, or 0 only when `main[data-thread-none]` exists; the thread's `getBoundingClientRect().top < 120` (composer and checklist footers excepted, they are docked at the bottom); after scrolling the count never exceeds 1. | S1.2, S2.2, S3.3, S4.4, S4.7, S6.2, S7.1, S7.3, sprints accepted (3 equal buttons), theme 1, "empty top-right on every screen" |
| 2 | **One Scroll** | In the main area exactly one element scrolls. The rail and the top bar never scroll and never have their own scrollbar. Side panels are sized to the viewport (`height: calc(100vh - 56px)`) and only scroll if their own content overflows. Chat, logs and preview panes size to the viewport instead of nesting a scroller inside a scrolling page. Automated check: count of elements with `scrollHeight > clientHeight` and `overflow-y` auto/scroll inside `main` is 1; the rail's `scrollHeight === clientHeight`. | A3, A4, S4.3, S4.6, S4.8, S9.2, A8, live logs, theme 5 |
| 3 | **Always Know Where You Are** | Every project screen has the sticky top bar with Back, a clickable breadcrumb (list level included), and the tape journey rail whose pin sits on the project's real stage (not the route). Every done or open step is a link. Automated check: `.pm-tape a` count >= number of unlocked steps; `.pm-crumb a` count >= 2; top bar `position: sticky` and `top: 0`. | A1, A2, S5.2, S5.4, S5.5, S6.1, B2, interview locked (bar highlights step 1), settings and logs (title cut off), theme 4 |
| 4 | **The Main Job Owns The Space** | The screen's job (list, form, chat, table, document, plan, board, preview) begins within 140px of the top of the viewport and takes at least 60% of the width. One title per screen (a single `h1`), no hero, no eyebrow, no marketing band, no explainer panel wider than 320px. Supporting content is compact, fixed and beside the job, not above it. | S1.3, S1.5, S1.6, S2.1, S2.3, S3.1, S3.2, S4.1, S4.2, S4.5, S5.1, S9.1, theme 2, theme 3, two stacked headings, extra defect 5 |
| 5 | **Plain Words, Fixed States** | Seven status pins with fixed labels (Needs you, Working, Waiting, Done, Paused, Blocked, Locked), each always followed by one plain sentence. Wire words appear verbatim as facts inside that sentence or under Details. Engineering facts (ids, digests, repo paths, token counts) live under a Details disclosure. Every heading that uses a working term ("Success contract", "Guardrails") carries a one-line plain gloss under it (`.pm-gloss`); table headers are plain words ("How we will know", "Who decides") with the file's own term in their `title`; file codes (KPI-1, G-1) sit in a closed Details inside the cell, never as a column. Budget is shown as a "Monthly limit" in "million units" with the percent used; tokens appear only under Details. Log rows are plain (time and the event in plain words); event codes, ids, level and the raw line sit under the row's Details. Controls that exist only in this proposal (the 13 state switch, the flow Journey panel) wear `.pm-review-only` (dashed border, Meta text, labelled "Review only:") and never ship. A disabled control always shows why. Actions are named by their consequence ("Ask for changes", never "Reject"). No em-dash anywhere in UI copy. | B3, S5.3, S7.2, settings disabled buttons, live logs readability, interview locked copy, extra defects 2, 3, 4, 6, 7, 8 |
| 6 | **No Dead Space** | Measured on the 8px cell grid of the content box (`main` minus the sticky top bar and the strip, inset by `--pm-content-pad` on the top, left and right), at 1142x732 and 1440x900, light theme, default rail: (L6.1) the first viewport holds no empty rectangle 240px wide and 160px tall or larger; (L6.2) the empty rectangle anchored at the content box's top-right corner is never both 240px wide and 120px tall; (L6.3) the stitched whole scroll of every scroller holds no empty rectangle 240 by 240 or larger, and a tail (an empty band touching the end of the content) is at most 240px tall. Breathing room, and nothing else, is exempt: the side margins of a deliberately centred column (`.pm-arch-task`), the thread rest under the last chat message (`.pm-chat-flow`, at most 320px), the column under a fitted side panel or the contents rail (`.pm-panel--fit`, `.pm-toc`), the inside of the preview iframe, and a page-end tail of at most 240px on a page that does not scroll. Space is absorbed only by real content or by shrinking the container: a meaningful supporting panel, a larger main job, a next-step or history panel, document previews, two-line rows, better-fitted containers. Never filler, never invented statistics, never a decorative illustration. Automated check: `node docs/design-system/tools/whitespace.mjs` ends `0 failing`. | The reviewer's most repeated complaint ("white space", "empty right column", "empty top-right corner", "page feels unfinished"); audit findings F1 to F16 (P.2) |

B1 (card as link) is resolved by the Project Card component (D.7); B4 (count ignores search) by the list-count rule in D.7; S1.4 by the Projects list layout (C.6).

---

## B. Foundations (tokens)

Three layers. Components use only `--pm-sys-*` and `--pm-cmp-*`. `--pm-ref-*` is never referenced outside `tokens.css`. No hex literal outside `tokens.css`. Theme switch: `:root[data-theme="dark"]` reassigns `--pm-sys-*` only; `:root:not([data-theme="light"])` under `@media (prefers-color-scheme: dark)` does the same. Density switch: `[data-density="compact"]` reassigns a handful of `--pm-sys-*` size tokens (B.7).

### B.1 Reference colour (OKLCH, hex fallback)

Every value below was generated and checked by `scratchpad/contrast.mjs` (kept in the deliverable as `tools/contrast.mjs`). Hue 260 for the ink ramp (a cool jersey grey, never cream). Chroma stays below 0.015 on neutrals so surfaces read as paper, not tinted cards.

Ruling 2026-09-30: there is no `@supports (color: oklch(0 0 0))` block anywhere. The hex value in each row is the documented sRGB twin of the OKLCH value (the one the contrast table is computed from), kept in `tokens.css` beside the OKLCH line for tools and readers; it is not a runtime fallback, and every supported browser renders the OKLCH line.

| Token | OKLCH | Hex | Role hint |
|---|---|---|---|
| --pm-ref-ink-950 | oklch(15% 0.012 260) | #080b10 | dark ground |
| --pm-ref-ink-900 | oklch(21% 0.014 260) | #15181f | ink text, rail |
| --pm-ref-ink-800 | oklch(29% 0.014 260) | #272c32 | rail active, dark sunken |
| --pm-ref-ink-700 | oklch(38% 0.012 260) | #3f4349 | secondary text, dark hairline |
| --pm-ref-ink-600 | oklch(46% 0.010 260) | #55585e | muted text |
| --pm-ref-ink-500 | oklch(50% 0.010 260) | #606369 | meta text, placeholder |
| --pm-ref-ink-400 | oklch(64% 0.010 260) | #898c92 | control borders (3:1) |
| --pm-ref-ink-300 | oklch(78% 0.008 260) | #b4b7bd | rail muted text, disabled text on dark |
| --pm-ref-ink-200 | oklch(87% 0.006 260) | #d2d4d8 | hairlines |
| --pm-ref-ink-100 | oklch(93% 0.005 260) | #e6e8eb | sunken surface, dark text |
| --pm-ref-ink-50 | oklch(97.3% 0.003 260) | #f5f6f8 | page ground |
| --pm-ref-ink-0 | oklch(100% 0 0) | #ffffff | raised surface |
| --pm-ref-thread-500 | oklch(88% 0.175 96) | #fad622 | THE thread (canary) |
| --pm-ref-thread-600 | oklch(79% 0.160 90) | #e2b40a | thread hover |
| --pm-ref-thread-700 | oklch(50% 0.115 80) | #855a00 | thread as text on light |
| --pm-ref-thread-800 | oklch(40% 0.095 78) | #633f00 | thread text hover |
| --pm-ref-chalk-700 | oklch(42% 0.085 245) | #1d5178 | chalk text (light) |
| --pm-ref-chalk-600 | oklch(50% 0.090 245) | #326893 | chalk marks, Working pin |
| --pm-ref-chalk-400 | oklch(72% 0.070 245) | #80aace | chalk on dark |
| --pm-ref-chalk-300 | oklch(82% 0.050 245) | #aac8e3 | pen circle on rail |
| --pm-ref-chalk-100 | oklch(94% 0.020 245) | #e1edf8 | chalk tint |
| --pm-ref-chalk-50 | oklch(97% 0.010 245) | #f0f6fc | chalk faint tint |
| --pm-ref-moss-600 | oklch(47% 0.120 150) | #146d34 | Done |
| --pm-ref-moss-400 | oklch(74% 0.130 150) | #69c27e | Done on dark |
| --pm-ref-moss-100 | oklch(94% 0.045 150) | #d7f4dc | Done tint |
| --pm-ref-moss-900 | oklch(27% 0.050 150) | #122d19 | Done tint dark |
| --pm-ref-clay-600 | oklch(52% 0.135 45) | #a64a18 | Paused |
| --pm-ref-clay-400 | oklch(74% 0.120 50) | #e79363 | Paused on dark |
| --pm-ref-clay-100 | oklch(94% 0.035 45) | #ffe5d8 | Paused tint |
| --pm-ref-clay-900 | oklch(28% 0.050 45) | #3d2013 | Paused tint dark |
| --pm-ref-red-600 | oklch(48% 0.170 27) | #a92321 | Blocked |
| --pm-ref-red-400 | oklch(72% 0.150 25) | #f47b74 | Blocked on dark |
| --pm-ref-red-100 | oklch(94% 0.035 27) | #ffe3df | Blocked tint |
| --pm-ref-red-900 | oklch(27% 0.060 27) | #3f1916 | Blocked tint dark |

Tone-gap rules used to build the ladder (verified below, not assumed): text on a surface needs a lightness gap of at least 47 L-points on this ramp (ink-500 at L50 on ink-100 at L93 is the floor pair at 4.91:1); non-text UI boundaries need at least 33 L-points (ink-400 at L64 on ink-50 at L97.3 = 3.12:1). Status text colours sit at L47-52 so they pass on white and on their own L94 tints; dark-theme status text sits at L72-74 on L21-28 surfaces.

### B.2 Contrast table (output of `node tools/contrast.mjs`, 2026-09-30)

| Pair | Foreground | Background | Ratio | Min | Result |
|---|---|---|---|---|---|
| L text on ground | ink-900 #15181f | ink-50 #f5f6f8 | 16.43:1 | 4.5 | PASS |
| L text on raised | ink-900 #15181f | ink-0 #ffffff | 17.76:1 | 4.5 | PASS |
| L muted on ground | ink-600 #55585e | ink-50 #f5f6f8 | 6.60:1 | 4.5 | PASS |
| L muted on raised | ink-600 #55585e | ink-0 #ffffff | 7.13:1 | 4.5 | PASS |
| L meta on ground | ink-500 #606369 | ink-50 #f5f6f8 | 5.57:1 | 4.5 | PASS |
| L meta on raised | ink-500 #606369 | ink-0 #ffffff | 6.02:1 | 4.5 | PASS |
| L meta on sunken | ink-500 #606369 | ink-100 #e6e8eb | 4.91:1 | 4.5 | PASS |
| L text on sunken | ink-900 #15181f | ink-100 #e6e8eb | 14.47:1 | 4.5 | PASS |
| L link/thread text on raised | thread-700 #855a00 | ink-0 #ffffff | 6.07:1 | 4.5 | PASS |
| L thread text on ground | thread-700 #855a00 | ink-50 #f5f6f8 | 5.61:1 | 4.5 | PASS |
| L ink on thread button | ink-900 #15181f | thread-500 #fad622 | 12.44:1 | 4.5 | PASS |
| L ink on thread hover | ink-900 #15181f | thread-600 #e2b40a | 9.11:1 | 4.5 | PASS |
| L thread button edge vs raised (UI) | ink-900 #15181f | ink-0 #ffffff | 17.76:1 | 3 | PASS |
| L thread fill vs raised (UI, not relied on) | thread-500 #fad622 | ink-0 #ffffff | 1.43:1 | 1 | info |
| L control border vs raised (UI) | ink-400 #898c92 | ink-0 #ffffff | 3.37:1 | 3 | PASS |
| L control border vs ground (UI) | ink-400 #898c92 | ink-50 #f5f6f8 | 3.12:1 | 3 | PASS |
| L chalk text on raised | chalk-700 #1d5178 | ink-0 #ffffff | 8.40:1 | 4.5 | PASS |
| L chalk text on chalk tint | chalk-700 #1d5178 | chalk-100 #e1edf8 | 7.07:1 | 4.5 | PASS |
| L chalk pin vs raised (UI) | chalk-600 #326893 | ink-0 #ffffff | 5.94:1 | 3 | PASS |
| L moss text on raised | moss-600 #146d34 | ink-0 #ffffff | 6.43:1 | 4.5 | PASS |
| L moss text on moss tint | moss-600 #146d34 | moss-100 #d7f4dc | 5.47:1 | 4.5 | PASS |
| L moss pin vs raised (UI) | moss-600 #146d34 | ink-0 #ffffff | 6.43:1 | 3 | PASS |
| L clay text on raised | clay-600 #a64a18 | ink-0 #ffffff | 5.81:1 | 4.5 | PASS |
| L clay text on clay tint | clay-600 #a64a18 | clay-100 #ffe5d8 | 4.83:1 | 4.5 | PASS |
| L clay pin vs raised (UI) | clay-600 #a64a18 | ink-0 #ffffff | 5.81:1 | 3 | PASS |
| L red text on raised | red-600 #a92321 | ink-0 #ffffff | 7.12:1 | 4.5 | PASS |
| L red text on red tint | red-600 #a92321 | red-100 #ffe3df | 5.87:1 | 4.5 | PASS |
| L red pin vs raised (UI) | red-600 #a92321 | ink-0 #ffffff | 7.12:1 | 3 | PASS |
| L ink text on tint moss | ink-900 #15181f | moss-100 #d7f4dc | 15.11:1 | 4.5 | PASS |
| L ink text on tint chalk | ink-900 #15181f | chalk-100 #e1edf8 | 14.95:1 | 4.5 | PASS |
| L ink text on tint clay | ink-900 #15181f | clay-100 #ffe5d8 | 14.76:1 | 4.5 | PASS |
| L ink text on tint red | ink-900 #15181f | red-100 #ffe3df | 14.64:1 | 4.5 | PASS |
| L white on ink button | ink-0 #ffffff | ink-900 #15181f | 17.76:1 | 4.5 | PASS |
| L ink-300 on ink-900 rail muted | ink-300 #b4b7bd | ink-900 #15181f | 8.84:1 | 4.5 | PASS |
| L rail text on rail | ink-100 #e6e8eb | ink-900 #15181f | 14.47:1 | 4.5 | PASS |
| L rail muted on rail | ink-300 #b4b7bd | ink-900 #15181f | 8.84:1 | 4.5 | PASS |
| L rail active bg ink-800 vs rail (info, boundary is the pen circle) | ink-800 #272c32 | ink-900 #15181f | 1.26:1 | 1 | info |
| L thread on rail (UI) | thread-500 #fad622 | ink-900 #15181f | 12.44:1 | 3 | PASS |
| L ink on thread on rail | ink-900 #15181f | thread-500 #fad622 | 12.44:1 | 4.5 | PASS |
| L focus ring ink vs ground (UI) | ink-900 #15181f | ink-50 #f5f6f8 | 16.43:1 | 3 | PASS |
| L placeholder on raised | ink-500 #606369 | ink-0 #ffffff | 6.02:1 | 4.5 | PASS |
| L ink-700 secondary text on raised | ink-700 #3f4349 | ink-0 #ffffff | 9.95:1 | 4.5 | PASS |
| L hairline ink-200 vs raised (decorative) | ink-200 #d2d4d8 | ink-0 #ffffff | 1.48:1 | 1 | info |
| D text on ground | ink-100 #e6e8eb | ink-950 #080b10 | 16.05:1 | 4.5 | PASS |
| D text on raised | ink-100 #e6e8eb | ink-900 #15181f | 14.47:1 | 4.5 | PASS |
| D muted on raised | ink-300 #b4b7bd | ink-900 #15181f | 8.84:1 | 4.5 | PASS |
| D muted on ground | ink-300 #b4b7bd | ink-950 #080b10 | 9.80:1 | 4.5 | PASS |
| D meta ink-400 on raised | ink-400 #898c92 | ink-900 #15181f | 5.27:1 | 4.5 | PASS |
| D text on sunken ink-800 | ink-100 #e6e8eb | ink-800 #272c32 | 11.46:1 | 4.5 | PASS |
| D meta on sunken ink-800 | ink-300 #b4b7bd | ink-800 #272c32 | 7.00:1 | 4.5 | PASS |
| D ink on thread button | ink-950 #080b10 | thread-500 #fad622 | 13.80:1 | 4.5 | PASS |
| D thread fill vs raised (UI) | thread-500 #fad622 | ink-900 #15181f | 12.44:1 | 3 | PASS |
| D thread text thread-600 on raised | thread-600 #e2b40a | ink-900 #15181f | 9.11:1 | 4.5 | PASS |
| D control border ink-400 vs raised (UI) | ink-400 #898c92 | ink-900 #15181f | 5.27:1 | 3 | PASS |
| D control border ink-400 vs ground (UI) | ink-400 #898c92 | ink-950 #080b10 | 5.85:1 | 3 | PASS |
| D chalk-400 text on raised | chalk-400 #80aace | ink-900 #15181f | 7.24:1 | 4.5 | PASS |
| D chalk-300 text on raised | chalk-300 #aac8e3 | ink-900 #15181f | 10.22:1 | 4.5 | PASS |
| D chalk-400 pin vs raised (UI) | chalk-400 #80aace | ink-900 #15181f | 7.24:1 | 3 | PASS |
| D moss-400 text on raised | moss-400 #69c27e | ink-900 #15181f | 8.14:1 | 4.5 | PASS |
| D moss-400 on moss-900 tint | moss-400 #69c27e | moss-900 #122d19 | 6.80:1 | 4.5 | PASS |
| D ink-100 on moss-900 | ink-100 #e6e8eb | moss-900 #122d19 | 12.09:1 | 4.5 | PASS |
| D clay-400 text on raised | clay-400 #e79363 | ink-900 #15181f | 7.40:1 | 4.5 | PASS |
| D clay-400 on clay-900 tint | clay-400 #e79363 | clay-900 #3d2013 | 6.19:1 | 4.5 | PASS |
| D ink-100 on clay-900 | ink-100 #e6e8eb | clay-900 #3d2013 | 12.09:1 | 4.5 | PASS |
| D red-400 text on raised | red-400 #f47b74 | ink-900 #15181f | 6.71:1 | 4.5 | PASS |
| D red-400 on red-900 tint | red-400 #f47b74 | red-900 #3f1916 | 5.82:1 | 4.5 | PASS |
| D ink-100 on red-900 | ink-100 #e6e8eb | red-900 #3f1916 | 12.56:1 | 4.5 | PASS |
| D rail text on rail (ink-900) | ink-100 #e6e8eb | ink-900 #15181f | 14.47:1 | 4.5 | PASS |
| D rail muted on rail (ink-900) | ink-300 #b4b7bd | ink-900 #15181f | 8.84:1 | 4.5 | PASS |
| D rail text on rail active (ink-800) | ink-100 #e6e8eb | ink-800 #272c32 | 11.46:1 | 4.5 | PASS |
| D rail muted on rail active (ink-800) | ink-300 #b4b7bd | ink-800 #272c32 | 7.00:1 | 4.5 | PASS |
| D pen circle chalk-300 on rail (UI) | chalk-300 #aac8e3 | ink-900 #15181f | 10.22:1 | 3 | PASS |
| D pen circle chalk-300 on rail active (UI) | chalk-300 #aac8e3 | ink-800 #272c32 | 8.09:1 | 3 | PASS |
| D thread pin on rail (UI) | thread-500 #fad622 | ink-900 #15181f | 12.44:1 | 3 | PASS |
| D focus ring chalk-300 on rail (UI) | chalk-300 #aac8e3 | ink-900 #15181f | 10.22:1 | 3 | PASS |
| D rail seam ink-700 vs rail (UI, decorative) | ink-700 #3f4349 | ink-900 #15181f | 1.78:1 | 1 | info |
| D rail ink-900 vs page ground ink-950 (info, edge is the seam and the shadowless step) | ink-900 #15181f | ink-950 #080b10 | 1.11:1 | 1 | info |
| D rail edge ink-700 vs ground ink-950 (UI) | ink-700 #3f4349 | ink-950 #080b10 | 1.98:1 | 1.5 | PASS |
| L pen circle chalk-300 on rail active (UI) | chalk-300 #aac8e3 | ink-800 #272c32 | 8.09:1 | 3 | PASS |
| L tooltip text on ink-900 | ink-0 #ffffff | ink-900 #15181f | 17.76:1 | 4.5 | PASS |
| D tooltip text on ink-100 | ink-950 #080b10 | ink-100 #e6e8eb | 16.05:1 | 4.5 | PASS |
| D focus ring ink-100 vs ground (UI) | ink-100 #e6e8eb | ink-950 #080b10 | 16.05:1 | 3 | PASS |
| D ink-950 on ink-100 inverse button | ink-950 #080b10 | ink-100 #e6e8eb | 16.05:1 | 4.5 | PASS |
| L Needs-you label on tint | ink-900 #15181f | ink-100 #e6e8eb | 14.47:1 | 4.5 | PASS |
| L Working label on tint | chalk-600 #326893 | chalk-100 #e1edf8 | 5.00:1 | 4.5 | PASS |
| L Waiting label on ink-50 tint | ink-500 #606369 | ink-50 #f5f6f8 | 5.57:1 | 4.5 | PASS |
| L Waiting label on raised | ink-500 #606369 | ink-0 #ffffff | 6.02:1 | 4.5 | PASS |
| L Done label on tint | moss-600 #146d34 | moss-100 #d7f4dc | 5.47:1 | 4.5 | PASS |
| L Paused label on tint | clay-600 #a64a18 | clay-100 #ffe5d8 | 4.83:1 | 4.5 | PASS |
| L Blocked label on tint | red-600 #a92321 | red-100 #ffe3df | 5.87:1 | 4.5 | PASS |
| L Locked label on tint | ink-500 #606369 | ink-100 #e6e8eb | 4.91:1 | 4.5 | PASS |
| D Needs-you label on tint | ink-100 #e6e8eb | ink-800 #272c32 | 11.46:1 | 4.5 | PASS |
| D Working label on tint | chalk-400 #80aace | ink-800 #272c32 | 5.73:1 | 4.5 | PASS |
| D Waiting label on tint | ink-400 #898c92 | ink-900 #15181f | 5.27:1 | 4.5 | PASS |
| D Done label on tint | moss-400 #69c27e | moss-900 #122d19 | 6.80:1 | 4.5 | PASS |
| D Paused label on tint | clay-400 #e79363 | clay-900 #3d2013 | 6.19:1 | 4.5 | PASS |
| D Blocked label on tint | red-400 #f47b74 | red-900 #3f1916 | 5.82:1 | 4.5 | PASS |
| D Locked label on tint dark | ink-400 #898c92 | ink-900 #15181f | 5.27:1 | 4.5 | PASS |
| L Working text on ground | chalk-600 #326893 | ink-50 #f5f6f8 | 5.49:1 | 4.5 | PASS |
| L Done text on ground | moss-600 #146d34 | ink-50 #f5f6f8 | 5.94:1 | 4.5 | PASS |
| L Paused text on ground | clay-600 #a64a18 | ink-50 #f5f6f8 | 5.37:1 | 4.5 | PASS |
| L Blocked text on ground | red-600 #a92321 | ink-50 #f5f6f8 | 6.58:1 | 4.5 | PASS |
| D Working text on ground | chalk-400 #80aace | ink-950 #080b10 | 8.03:1 | 4.5 | PASS |
| D Done text on ground | moss-400 #69c27e | ink-950 #080b10 | 9.03:1 | 4.5 | PASS |
| D Paused text on ground | clay-400 #e79363 | ink-950 #080b10 | 8.21:1 | 4.5 | PASS |
| D Blocked text on ground | red-400 #f47b74 | ink-950 #080b10 | 7.44:1 | 4.5 | PASS |
| L muted or disabled text on sunken | ink-600 #55585e | ink-100 #e6e8eb | 5.81:1 | 4.5 | PASS |
| L ghost button text on ground | ink-700 #3f4349 | ink-50 #f5f6f8 | 9.20:1 | 4.5 | PASS |
| L ink button hover (text on ink-700) | ink-0 #ffffff | ink-700 #3f4349 | 9.95:1 | 4.5 | PASS |
| D ink button hover (text on ink-300) | ink-950 #080b10 | ink-300 #b4b7bd | 9.80:1 | 4.5 | PASS |
| D ink on thread hover | ink-950 #080b10 | thread-600 #e2b40a | 10.10:1 | 4.5 | PASS |

Rows added for finding 7 (dark rail lift) and the rail tooltip: rail text and muted text on the rail and on its active row, the pen circle, pin, focus ring, seam and edge, and the tooltip pair in both themes. Rows added in review (RV2 to RV6): status text on the page ground in both themes, muted or disabled text on the sunken surface (5.81:1), the ghost button text, the ink button hover in both themes and the dark thread hover. Failures: 0. Two rows are informational: the canary fill against white (1.43:1) is never the only boundary of a control (every thread element carries a 1px ink-900 border and ink-900 text, both above 3:1), and the rail's active-row tint is never the only marker of the active item (the pen circle in chalk-300 at 10.22:1 and `aria-current` are).

### B.3 Semantic colour (system layer)

Light (`:root`) and dark (`:root[data-theme="dark"]`, and the `prefers-color-scheme` guard). Names are roles; components use these.

| Token | Light | Dark |
|---|---|---|
| --pm-sys-ground | ink-50 | ink-950 |
| --pm-sys-surface-raised | ink-0 | ink-900 |
| --pm-sys-surface-sunken | ink-100 | ink-800 |
| --pm-sys-surface-rail | ink-900 | ink-900 (one step above the ink-950 ground; Ruling 8) |
| --pm-sys-surface-rail-active | ink-800 | ink-800 |
| --pm-sys-text | ink-900 | ink-100 |
| --pm-sys-text-secondary | ink-700 | ink-300 |
| --pm-sys-text-muted | ink-600 | ink-300 |
| --pm-sys-text-meta | ink-500 | ink-400 |
| --pm-sys-text-on-rail | ink-100 | ink-100 |
| --pm-sys-text-on-rail-muted | ink-300 | ink-300 |
| --pm-sys-text-on-ink | ink-0 | ink-950 |
| --pm-sys-hairline | ink-200 | ink-700 |
| --pm-sys-hairline-on-rail | ink-700 | ink-700 |
| --pm-sys-control-border | ink-400 | ink-400 |
| --pm-sys-thread | thread-500 | thread-500 |
| --pm-sys-thread-hover | thread-600 | thread-600 |
| --pm-sys-thread-text | thread-700 | thread-600 |
| --pm-sys-thread-text-hover | thread-800 | thread-500 |
| --pm-sys-on-thread | ink-900 | ink-950 |
| --pm-sys-chalk | chalk-600 | chalk-400 |
| --pm-sys-chalk-text | chalk-700 | chalk-300 |
| --pm-sys-chalk-tint | chalk-100 | ink-800 |
| --pm-sys-chalk-on-rail | chalk-300 | chalk-300 |
| --pm-sys-status-needs-you | ink-900 | ink-100 |
| --pm-sys-status-needs-you-tint | ink-100 | ink-800 |
| --pm-sys-status-working | chalk-600 | chalk-400 |
| --pm-sys-status-working-tint | chalk-100 | ink-800 |
| --pm-sys-status-waiting | ink-500 | ink-400 |
| --pm-sys-status-waiting-tint | ink-50 | ink-900 |
| --pm-sys-status-done | moss-600 | moss-400 |
| --pm-sys-status-done-tint | moss-100 | moss-900 |
| --pm-sys-status-paused | clay-600 | clay-400 |
| --pm-sys-status-paused-tint | clay-100 | clay-900 |
| --pm-sys-status-blocked | red-600 | red-400 |
| --pm-sys-status-blocked-tint | red-100 | red-900 |
| --pm-sys-status-locked | ink-500 | ink-400 |
| --pm-sys-status-locked-tint | ink-100 | ink-900 |
| --pm-sys-focus | ink-900 | ink-100 |
| --pm-sys-focus-halo | ink-0 | ink-950 |
| --pm-sys-focus-on-rail | chalk-300 | chalk-300 |
| --pm-sys-selection-bg | thread-500 | thread-600 |
| --pm-sys-selection-text | ink-900 | ink-950 |
| --pm-sys-scrim | oklch(21% 0.014 260 / 0.55) | oklch(15% 0.012 260 / 0.7) |

Status text on a tint always uses the status colour itself (verified pairs above); body text on a tint uses `--pm-sys-text`.

Dark ladder (Ruling 8): ground ink-950 < raised ink-900 < sunken ink-800 is unchanged; only the rail is lifted, from ink-950 to ink-900 (active row ink-800, seam and edge ink-700), which is exactly the light theme's rail mapping, so every rail pair is already a checked pair. The rail edge against the ground is the 1px ink-700 seam at 1.98:1; the step itself (ink-900 against ink-950) is 1.11:1 and is not relied on alone. The dark mapping lives once in `tools/gen-theme.mjs`, which rewrites both dark blocks in `tokens.css` between `/* pm:dark-begin */` and `/* pm:dark-end */`; `tools/check-css.mjs` fails if the two blocks differ or drift from the generator.

Rulings 2026-09-30 (contrast): Waiting in the light theme is ink-500 (ink-400 was 3.12:1 on ink-50, below 4.5:1 for a label): 5.57:1 on its ink-50 tint and 6.02:1 on raised. Locked in the dark theme sits on ink-900 (on ink-800 the ink-400 label fell below 4.5:1): 5.27:1. B.2 now carries one label-on-own-tint row per status per theme (Needs you, Working, Waiting, Done, Paused, Blocked, Locked), all at or above 4.5:1; no other status pair needed a fix.

### B.4 Type

Families (verified on Google Fonts 2026-09-30 by fetching the css2 endpoint; a bogus family returns 400, these return 200):

- **Schibsted Grotesk**, weights 400..900 variable with italics (`family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900`). One family carries UI, headings, reading and the engraved digits. Reason: a newspaper grotesk designed for small sizes and long columns (x-height 0.527 em, the highest of the candidates checked), with true tabular figures (`tnum` present in the GSUB table, verified from the served TTF), distinct enough not to read as the incumbent Geist or the training-data defaults, and not on the banned list. One text family is the right call for an operate surface (operate.md) and it removes the serif-notebook feel of the anti-reference.
- **JetBrains Mono**, weights 400..700 (`family=JetBrains+Mono:wght@400..700`). Only for ids, digests, repo paths, log lines and code. Never as a costume: the tape digits use Schibsted with `.pm-tnum` (tabular figures), not the mono.

Fallback stacks: `"Schibsted Grotesk", "Segoe UI", system-ui, sans-serif` and `"JetBrains Mono", ui-monospace, Consolas, monospace`.

Seven named steps (the seventh, Reading, exists because this app has long documents and a chat next to dense chrome; one body size cannot serve both). All line-heights are multiples of 4.

| Step | Token prefix | Size / line | Weight | Tracking | Use | Numerals |
|---|---|---|---|---|---|---|
| Digits | --pm-type-digits | 28 / 32 | 600 | -0.01em | Engraved metric numerals, tape step numbers on the overview | tabular, lining (pure digits only, no thousands comma) |
| Title | --pm-type-title | 22 / 28 | 600 | -0.01em | The one h1 per screen | proportional |
| Heading | --pm-type-heading | 17 / 24 | 600 | 0 | Section, card, panel and document h2 | proportional |
| Reading | --pm-type-reading | 17 / 28 | 400 | 0 | Document body, chat messages, plan sentences. Measure max 68ch | proportional |
| Body | --pm-type-body | 15 / 22 | 400 | 0 | UI body, table cells, form labels, status sentences | proportional |
| Label | --pm-type-label | 14 / 16 | 500 | 0 | Buttons, rail items, tabs, tape labels, pin labels | proportional |
| Meta | --pm-type-meta | 12 / 16 | 400 | 0.01em | Timestamps, counts, column headers (uppercase only in table headers, tracking 0.06em), breadcrumb | proportional (`.pm-tnum` only in column contexts) |

Mono uses the Meta size (12/16, weight 400) or Body size in the log viewer (13/20 at compact density). Never an eighth size. Document h3 = Body at weight 600. 
**Numerals (ruling 2026-09-30).** Schibsted's `tnum` turns , . : % into figure-width glyphs, so tabular figures make prose such as "5,415,812 of 20,000,000 tokens" or "14:10" look gappy. Therefore Meta, Body and Label are **proportional** by default; there is no blanket tabular setting on any text step. `.pm-tnum` (`font-variant-numeric: tabular-nums lining-nums`) is a utility applied only in column contexts: table cells that hold numbers, the log time column, the tape, and "n of m" digit blocks. Digits keeps tabular figures built in because it holds pure digits and a unit only ("3 / 3", "1 / 4", "27 %"). A Digits value that contains a thousands comma (or any other separator inside the number) must not be used: put such a figure in a Meta sentence under Details instead. A sentence (a timestamp inside prose, a count inside a sentence, the budget line) stays proportional even when it sits next to a tabular column.

Measure: reading columns `max-width: 68ch` at Reading size (about 720px). UI body has no measure cap inside tables; prose paragraphs in banners cap at 60ch.

### B.5 Spacing (4px stitch grid), radius, hairlines

| Token | Value |
|---|---|
| --pm-space-1 .. --pm-space-10 | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px |
| --pm-radius-chip | 4px (pins' label chips, table cells) |
| --pm-radius-control | 6px (buttons, inputs, selects, composer) |
| --pm-radius-card | 10px (cards, panels, banners, dialogs) |
| --pm-radius-round | 999px (pin heads, avatar, tape pin) |
| --pm-hairline | 1px solid var(--pm-sys-hairline) |
| --pm-stitch | 1px repeating dash: `background-image: repeating-linear-gradient(90deg, var(--pm-sys-hairline) 0 6px, transparent 6px 10px); height: 1px` |

Rules: hairline for card edges, table rows, panel borders. Stitch only for section seams (between major sections of a page and under the top bar) and the tape rail baseline. No border thicker than 1px except the thread button (1px ink) and the pen circle (1.5px). No coloured side stripes.

### B.6 Elevation, motion, focus, selection, scrollbars

Elevation is the surface ladder first: ground (ink-50) -> raised (white) -> sunken (ink-100) inside raised. Shadows only for floating layers:

| Token | Value |
|---|---|
| --pm-shadow-float | `0 8px 24px -8px oklch(21% 0.014 260 / 0.28), 0 2px 6px -2px oklch(21% 0.014 260 / 0.16)` (menus, toasts) |
| --pm-shadow-dialog | `0 24px 48px -16px oklch(21% 0.014 260 / 0.4)` |

Motion:

| Token | Value | Used for |
|---|---|---|
| --pm-motion-state | 120ms | hover, focus, pressed, pin fill |
| --pm-motion-reveal | 180ms | disclosure open, toast enter, message append |
| --pm-motion-layout | 240ms | rail collapse/expand, tape pin slide, panel dock |
| --pm-ease-out | cubic-bezier(0.2, 0, 0, 1) | everything that enters or settles |
| --pm-ease-in | cubic-bezier(0.3, 0, 1, 1) | exits (toast leave 90ms) |

What may animate: rail width, tape pin translateX, disclosure height, toast opacity/translateY(8px), pin glyph fill on status change, message append opacity. Nothing animates on page load; nothing loops except the Working dash (the Working pin's 1px "stitching" dash offset, 2s linear, only while `data-live="true"`) and the loading skeleton pulse (1.2s, opacity only, D.18). `@media (prefers-reduced-motion: reduce)`: all durations 0ms except opacity fades at 120ms; the Working dash does not move and the skeleton pulse is disabled (static bar, no animation).

Focus ring: `outline: 2px solid var(--pm-sys-focus); outline-offset: 2px; box-shadow: 0 0 0 4px var(--pm-sys-focus-halo)` on `:focus-visible` only; inside the rail `outline-color: var(--pm-sys-focus-on-rail)`. Never removed. The thread never carries the focus ring colour (One Thread).

Browser surfaces: `::selection` uses selection tokens; `caret-color: var(--pm-sys-text)`; scrollbars `scrollbar-width: thin; scrollbar-color: var(--pm-sys-control-border) transparent`; `accent-color: var(--pm-sys-text)` for native checkboxes/radios (so checked boxes are ink, not blue); links `text-underline-offset: 3px; text-decoration-thickness: 1px`.

### B.7 Density

`:root` comfortable (default): row height 46px (arithmetic: 12px top padding + 22px body line + 12px bottom padding = 46px; ruling 2026-09-30, it was 44px), cell padding 12px 16px, body 15px. `[data-density="compact"]` applies only to tables, the feature board, the documents list and the log viewer: row height 36px (8 + 20 + 8), cell padding 8px 12px, body 14/20, mono 13/20. Compact never changes buttons or the thread.

### B.8 Z-index map

| Token | Value |
|---|---|
| --pm-z-content | 0 |
| --pm-z-sticky-section | 10 (in-page section headers) |
| --pm-z-action-bar | 20 (reading action bar, checklist header) |
| --pm-z-topbar | 30 |
| --pm-z-rail | 40 |
| --pm-z-popover | 50 |
| --pm-z-toast | 60 |
| --pm-z-dialog | 70 (scrim and dialog) |
| --pm-z-skip | 80 |

### B.9 Layout constants

| Token | Value |
|---|---|
| --pm-rail-w | 248px expanded, 64px collapsed (`[data-rail="collapsed"]`). One state per user on every screen: the stored `pm.rail` choice, else expanded at >= 1280 and collapsed below (Ruling 7, C.2) |
| --pm-topbar-h | 56px |
| --pm-strip-h | 28px (the Nothing-is-lost strip, project screens only) |
| --pm-content-pad | 24px at < 1440, 32px at >= 1440 |
| --pm-content-max | 1120px |
| --pm-reading-w | 68ch (about 720px) |
| --pm-panel-w | 320px at < 1440, 360px at >= 1440 (decisions, checklist, contents, comments) |
| --pm-toc-w | 200px at < 1440, 220px at >= 1440 |
| --pm-tape-w | 360px minimum width (the tape is `min-width: var(--pm-tape-w)`) |
| --pm-tape-w-max | 440px maximum width (`max-width: var(--pm-tape-w-max)`); the tape grows from `--pm-tape-w` to this when space allows |
| --pm-row-h | 46px (36px compact) |
| --pm-control-h | 36px (inputs, buttons); 40px for the composer send and the thread on screens where it is the only control |
| --pm-scroll-pad | `scroll-padding-top: calc(var(--pm-topbar-h) + 16px)` on the scrolling element |

---

## C. Layout grammar

### C.1 The shell at 1142 x 732 (drawn with the rail expanded; the default at this width is collapsed)

```
x:0        248                                                       1142
+----------+------------------------------------------------------------+  y:0
| INK RAIL | TOP BAR (sticky, 56px, hairline bottom = stitch)           |
| 248px    | [<-Back 32][Projects / todo / Documents]  [TAPE 360px]  [THREAD] |
|          +------------------------------------------------------------+  y:56
| wordmark | strip 28px: "Last saved 14:10 · Last accepted: brief, Tue" |  (project screens)
| [<>]     +------------------------------------------------------------+  y:84
| All proj |  pad 24                                                    |
| ------   |  h1 Documents                          (secondary actions) |  y:108 (title row 28px)
| T todo   |  sentence                                                  |
| ------   |  ---------------------------------------------------------- |
| Overview |  MAIN JOB (table / list / form / board) begins here <= y:140|
| Interview|                                                            |
| Documents|                                                            |
| Roadmap  |                                                            |
| Build    |                                                            |
| Try it   |                                                            |
| Settings |                                                            |
| Live logs|                                                            |
|          |                                                            |
| budget   |                                                            |
| user     |                                                            |
+----------+------------------------------------------------------------+  y:732
```

Content width at 1142 with the default (collapsed) rail: 1142 - 64 - 48 = 1030px; with the rail expanded by the user: 1142 - 248 - 48 = 846px. At 1440 x 900 (rail expanded by default, pad 32): 1440 - 248 - 64 = 1128px, capped at 1120. Every archetype in C.6 must hold at both rail widths at 1142 (the workbench panels are fixed at 320 and the centre column takes the rest).

### C.2 The ink rail

Anatomy (top to bottom, expanded 248px; the collapsed 64px rail keeps every row height, so one budget serves both; heights are exact so the rail fits 732 with no scrollbar):

| Part | Height | Notes |
|---|---|---|
| Wordmark row | 56 | "pramaan" wordmark 20px Label weight 700 in ink-100; collapse toggle 32x32 at right (`«`, two chevrons pointing left), `aria-expanded`. Collapsed, this row grows to 96: the 28px monogram in a 56px row (plain branding, not a control), then a PERMANENT 40x40 expand button (`»`) directly under it |
| All projects link | 40 | icon + "All projects"; this is the list-level back affordance and the org switcher lives in its trailing menu (org name "Test" as meta) |
| Stitch seam | 1 | |
| Project block | 56 | 28px initial tile (ink-800, Label weight 700 letter) + project name (Label, one line, ellipsis) + status pin below name (Meta) |
| 8 destinations | 8 x 36 = 288 | Overview, Interview, Documents, Roadmap, Build, Try it, Settings, Live logs. Each: 20px icon (SVG, 1.5px stroke, consistent set), Label text, trailing meta (e.g. "3/3" on Documents). Active = pen circle + `aria-current="page"` + text ink-100 weight 600; inactive text ink-300. Hover: bg ink-800. No section labels ("Current project", "Development") as text rows: Live logs sits after a 12px gap with its own icon, and a `<span class="pm-sr">Development</span>` for screen readers. |
| Spacer | flexible (>= 12) | |
| Budget row | 44 | "Monthly budget" Meta + "18% used" Label + a 4px tape line (ink-700 track, ink-100 fill). Never tokens here; tokens live in Settings > Details. |
| User row | 48 | 28px avatar + name (Label) + "Signed in" (Meta); click opens a menu (Sign out, Switch organisation) |

Total expanded: 56 + 40 + 1 + 56 + 288 + 12 (gap before Live logs) + 12 (minimum spacer) + 44 + 48 = 557px + 16px top/bottom padding = 573px; collapsed the wordmark row is 96 (see above), so 613px. Fits 732 with 119px spare at the collapsed width, so the rail never scrolls on a 732px window. On the projects list (no project) the project block and 8 destinations are replaced by two destinations (All projects, Live logs): 56 + 40 + 36 + 44 + 48 = 224px.

Collapsed (64px): the wordmark becomes the 28px monogram "p" tile, plain branding that is NOT the toggle, and the expand control is a permanent, always-visible 40x40 icon button (`»`, ink-800 fill, 1px ink-700 border, ink-100 icon) right under it, never hover-dependent (finish review, fix 5: a founder must be able to find how to widen the menu). All projects and destinations show icon only. Every control keeps an accessible name (`aria-label` = its label, plus "(locked)" where locked) and a visible tooltip on hover and on keyboard focus (a custom `.pm-tip` element positioned beside the control by `shell.js`, inverse colours, never clipped by the rail; the native `title` is not used, so nothing shows twice). The project tile, budget line and account row show their own name the same way. 36px rows, active pen circle drawn around the icon; project tile only; budget row becomes a 4px vertical tape line 40px tall with `aria-label="Monthly budget 18% used"`; user row avatar only.

Behaviour (Ruling 7): ONE rail state per user, the same on every screen. The toggle flips `data-rail` on `<html>` and stores the choice in `localStorage["pm.rail"]` ("expanded" | "collapsed"). With nothing stored the default is expanded when the viewport is >= 1280px and collapsed below 1280px, and it follows the window across 1280 until the user chooses; a stored choice always wins at any width. Below 1024px the rail is always collapsed and the toggle says so. No screen family, archetype or workbench collapses or expands the rail on its own, so the navigation never moves under the cursor between screens. The founder can always tell where they are while the rail is collapsed: the pen circle marks the current icon, its tooltip names it, and the top bar breadcrumb shows the section. The toggle carries the label "Collapse navigation" (`«`, expanded rail) or "Expand navigation" (`»`, collapsed rail) as `aria-label` and `aria-expanded`, and a tooltip with the same words and the key `[`. **First-visit hint:** when nothing is stored in `pm.rail`, the rail defaulted to collapsed (viewport 1024 to 1279px; below 1024 the toggle is inert and no hint shows) and `pm.railhint` is not set, `shell.js` shows one small tooltip-style callout beside the expand button reading "Menu labels are hidden. Expand navigation" with a "Got it" button. It is created by script (no screen carries its markup), never takes focus, sits beside the button clear of the top bar's thread, and is dismissed by "Got it" or by using the toggle (either stores `pm.railhint=1`; a stored `pm.rail` also silences it). Review tools set `localStorage pm.railhint=1` before load, so it never appears in captures. Keyboard: arrow keys move between destinations (roving tabindex), `[` toggles the rail, Escape hides a tooltip. Width animates 240ms ease-out (0ms under reduced motion); the tooltip never animates.

Pen circle (the active marker): an inline SVG ellipse, `rx = width/2 + 6`, `ry = 16`, stroke 1.5px `--pm-sys-chalk-on-rail`, `stroke-dasharray` none, rotated -2deg, drawn around the destination label (expanded) or the icon (collapsed). Not hand-jittered, not textured: a clean chalk ellipse. Only one pen circle exists per rail.

### C.3 The sticky top bar

56px, `position: sticky; top: 0; z-index: var(--pm-z-topbar)`, background `--pm-sys-ground` at 100% opacity (no blur), bottom edge = stitch. Grid: `grid-template-columns: auto 1fr auto auto; gap: 16px; padding: 0 24px`.

1. **Back** (32x32 ghost icon button, arrow-left, `aria-label="Back to Documents"`): goes to the parent level of the breadcrumb, never browser history. On the projects list it is hidden (width kept so the breadcrumb does not shift).
2. **Breadcrumb**: `Projects / todo / Documents`. Every non-leaf crumb is a link (Meta, `--pm-sys-text-muted`, underline on hover); the leaf is Meta weight 600 `--pm-sys-text`. Separator "/" in `--pm-sys-hairline` colour text. On the document reader: `Projects / todo / Documents / Product brief`. Project names truncate at 24ch.
3. **Tape journey rail** (D.3): centred in the free column, min 360px. Hidden on the projects list, new project and live logs (no journey there); the column stays empty and the thread slot stays right-aligned.
4. **Thread slot** (right): the One Thread element (D.1), or, when nothing needs the founder, a state sentence in Body `--pm-sys-text-muted` with a Working/Waiting/Paused pin (e.g. "Working · Pramaan is building sprint 1. Nothing needed from you.") plus at most one quiet action that helps with that state ("Open Settings" beside a Paused sentence). The slot is never empty. Slot copy is short: a slot thread label names the decision in a few words ("Approve the plan", "Create my brief"; the long wording, "Approve the plan and start building", lives on the docked gate or in the button's `title`), and a slot sentence is about 20 characters ("Building sprint 1.") with the full sentence in its `title`; it clamps to two lines before the breadcrumb gives up room. A screen with nothing to decide declares `main[data-thread-none]`. When the thread element lives elsewhere on the screen (docked composer, checklist footer, action bar), the slot shows the matching Needs-you sentence ("Needs you · Answer the two questions below.") and the `[data-thread]` copy in the slot stays `hidden` unless the on-page thread scrolls out of view (D.14 observer).

At 1142 the bar's inner width is 1030px with the default collapsed rail and 846px when the user has expanded it (the tight case, budgeted here): Back 32 + breadcrumb <= 220 + tape 360 + thread <= 186 + gaps 48 = 846. Breadcrumb collapses middle crumbs to "…" (still a link to the parent) when the leaf and tape would not fit.

### C.4 Page title rules

- One `h1` per screen, Title step, sitting in the title row directly under the strip (or under the bar on non-project screens). The project name is not a heading on project screens; it lives in the breadcrumb and the rail.
- The title row is 28px tall. The h1 and its optional one-line sentence (Body, muted) share that line; the sentence ellipsizes rather than wrapping. The stacked variant (`.pm-title--stacked`, sentence under the h1) is used only on the task screen (new project), whose hint sits under the h1 (C.6); the overview's title row is the h1 alone, with the large tape under it. Right side of the title row holds at most two secondary actions (quiet buttons) or a search field. Never the thread.
- No eyebrow, no kicker, no "YOUR NEXT DECISION" caption. The banner's sentence speaks.
- The title row is not sticky; the top bar's breadcrumb leaf carries the page identity while scrolling.

### C.5 The single-scroll rule

- Page screens (projects list, overview, documents list, roadmap, sprints, settings): the `main` column scrolls (`main { height: calc(100vh); overflow-y: auto }` with the top bar sticky inside it), the rail is `position: fixed`, the body does not scroll. `scroll-padding-top` = 72px so anchors and "jump to" land under the bar, never sliced.
- Workbench screens (interview, document reader, try it, live logs): `main` is `height: 100vh; overflow: hidden`, the top bar is a normal-flow first child, and exactly one region below it scrolls: the message thread, the reading column, the preview stage (no scroll: the iframe fills it) or the log list. Side panels are `height: calc(100vh - var(--pm-topbar-h) - var(--pm-strip-h))`, `overflow-y: auto`, and scroll only when their content overflows (the decisions panel is compact by design so at 1142 it usually does not).
- Sticky section headers inside a scrolling column (document h2s, sprint headers on the roadmap, day separators in logs) use `position: sticky; top: 0` inside the scroller with `background: var(--pm-sys-surface-raised)` and a hairline, so a card is never sliced mid-heading.
- No `overflow: auto` on any card, table wrapper (tables get horizontal scroll only, see D.9) or banner.

### C.6 Layout archetypes

| Archetype | Screens | Grid (1142, either rail width) | Grid (1440, rail expanded by default) |
|---|---|---|---|
| List | Projects list, Documents list | one column, content max 1120; search + filters in the title row | same |
| Overview | Project overview | title row; next-decision banner full width; then `grid-template-columns: 1fr 320px` (engraved digits rail left, "what happens next" right) | `1fr 360px` |
| Task | New project | one centred column 560px, form only, hint sentence under the h1 | 600px |
| Chat workbench | Interview | `grid-template-columns: minmax(0,1fr) var(--pm-panel-w)`; thread column centred at max 720; composer docked | same with 360 panel |
| Reading | Document reader | `grid-template-columns: var(--pm-toc-w) minmax(0, 68ch) 1fr`; the right 1fr is the chalk margin for comment marks (min 80px) | same |
| Plan | Roadmap | one column; sprint route full width; approval gate in the thread slot + sticky Action Bar at the top of the column | same |
| Board | Sprints | one column; sprint header; feature board full width; "This sprint" strip right at 320 when width >= 1280 else stacked | `1fr 320px` |
| Stage | Try it | `grid-template-columns: minmax(0,1fr) var(--pm-panel-w)`; preview stage fills the left at viewport height; checklist panel right | same |
| Settings | Settings | one column 720px; sections as a stacked form, not cards of unequal height | same |
| Log | Live logs | one column; filter row; log list is the scroller | same |

Projects list specifics (S1.3, S1.4, S1.6): title row = h1 "Projects" + search field (240px, in the title row's right slot, label "Find a project") + a "Sort: needs you first" select. Below: the three entry points as one 44px row of quiet link-buttons with a stitch above and below; no hero. Pass 2 (Ruling 13): the three are real, first-class entries: "Start a new product" opens 02, "Hand off your code" opens 18, and, after a 16px gap and a Meta label "For engineering teams", "Work in my repository" opens 21; each carries its lane's one-line sentence from P.3.2 as `title`. Then the project list as a 2-column card grid (3 at >= 1440), cards sorted with Needs you first; the first Needs-you card gets the pen circle. Count in the h1 row: "9 projects" and after filtering "2 of 9 match 'todo'" (B4).

Pass 2 archetypes (P.5.1) added to the table above: **Task with aside** (`.pm-arch-task2`: 02, 18, 18b, 18c, 18d, 18e, 20, 21, 21b, 21c), **Bento overview** (`.pm-bento`: 03, 04, 19), **Settings with aside** (`.pm-arch-settings2`: 16), **Plan with aside** (`.pm-arch-plan2`: 11, 11b, 12, 14), **Build** (`.pm-arch-build`: 13, 13b, moved from the page style into `shell.css`), **Requests** (`.pm-arch-list` + the request composer: 22, 22b) and **Request** (`.pm-arch-request`: 23, 23b). The Overview and Plan rows above describe pass 1 and are superseded for those screens.

---

## D. Components

Format per component: purpose, anatomy, variants, states, sizes, tokens, a11y, do/don't. Class prefix `pm-`. Every interactive component has default, hover, focus-visible, active, disabled (with reason), loading, and where relevant error, empty, locked.

### D.1 Thread Action, buttons and the Action Bar

**Purpose.** The thread is the next decision. Buttons name the consequence.

**Anatomy.** `<button class="pm-btn pm-btn--thread" data-thread>` label (Label step, weight 600) + optional trailing arrow icon 16px. Optional consequence sentence beside it (Meta, muted): "Nothing is built until you approve."

**Variants.**
- `--thread`: bg `--pm-sys-thread`, text `--pm-sys-on-thread`, border 1px `--pm-sys-text` (ink), radius control, height 36 (40 on the roadmap gate and the composer). Exactly one per screen.
- `--ink` (strong secondary, e.g. "New project" on the list when a project needs you): bg `--pm-sys-text`, text `--pm-sys-text-on-ink`, no border.
- `--quiet` (default secondary): bg transparent, border 1px `--pm-sys-control-border`, text `--pm-sys-text`.
- `--ghost` (tertiary/icon): no border, text `--pm-sys-text-secondary`; hover bg sunken.
- `--danger` only inside a dialog ("Stop this sprint"): quiet with text/border `--pm-sys-status-blocked`.

**States.** hover: thread -> `--pm-sys-thread-hover`; ink -> `--pm-sys-text-secondary` (ink-700 light, ink-300 dark; both pairs checked in B.2); quiet -> bg sunken. focus-visible: focus ring (B.6). active: `transform: translateY(1px)`. disabled: bg sunken, text `--pm-sys-text-muted` (5.81:1 on sunken; meta would be too faint), border hairline, `aria-disabled="true"` (not `disabled`, so it stays focusable and can describe itself), plus a mandatory reason: `<span class="pm-btn-reason" id="r1">` referenced by `aria-describedby` and rendered right beside the button (Meta, muted): "Accept the User journey first." loading: label swaps to the gerund ("Approving…"), a 16px ink spinner replaces the arrow, `aria-busy="true"`, width preserved. A thread button in loading keeps the thread fill.

**Sizes.** height 36 (default), 40 (gate/composer), 32 (table row actions, quiet only). Padding 0 16px (0 12px at 32).

**Action Bar** (`.pm-actionbar`): a sticky row at the top of a scrolling column (reading, roadmap): `position: sticky; top: 0; z-index: var(--pm-z-action-bar)`, height 52, bg raised, bottom hairline. Left: a status pin + sentence ("Draft 1. Nobody has accepted it yet."). Right: quiet "Ask for changes" then the thread "Accept this draft". On the document reader the bar sits inside the reading scroller so it stays under the top bar. When the reader is locked, the bar shows the Locked pin + sentence and a quiet "Request a revision".

**Tokens.** `--pm-cmp-button-thread-bg: var(--pm-sys-thread)`, `--pm-cmp-button-thread-fg`, `--pm-cmp-button-thread-border`, `--pm-cmp-button-ink-bg`, `--pm-cmp-button-quiet-border`, `--pm-cmp-button-h: 36px`, `--pm-cmp-button-radius: var(--pm-radius-control)`.

**A11y.** Real `<button>` or `<a>`; label is a verb phrase; loading announces via `aria-live="polite"` region on the bar.

**Do/Don't.** Do: "Approve the plan and start building". Don't: "Confirm", "Submit", "Reject", a second canary element anywhere, a disabled button without a reason, an icon-only primary.

### D.2 Rail item

Anatomy: `<a class="pm-rail-item" aria-current="page">` icon 20 + label + meta. Height 36, padding 0 12px, radius control, gap 12. Default text `--pm-sys-text-on-rail-muted`; active text `--pm-sys-text-on-rail` weight 600 + pen circle; hover bg `--pm-sys-surface-rail-active`; focus ring in `--pm-sys-focus-on-rail`; locked destination (e.g. Try it before anything is ready): the label keeps `--pm-sys-text-on-rail-muted` (ink-500 on the ink rail would fall below 4.5:1), the icon dims and a 14px lock glyph trails (a badge on the tile when collapsed); still a link to its locked state (Law 3). Collapsed: 36x36 icon tile with `aria-label` and the visible `.pm-tip` tooltip on hover and focus (C.2). The collapsed rail's expand control is a separate permanent 40x40 button under the monogram (C.2), never a hover swap of the monogram. Badge meta (e.g. "3/3") is Meta with `.pm-tnum` (an "n of m" block).

### D.3 Journey Tape

**Purpose.** Shows where the project is, what is done, what is next; every reachable step is a link. Reflects project state, not the current route.

**Anatomy.** `<nav class="pm-tape" aria-label="Your journey">` containing an `<ol>` of 5 steps. The tape is a 24px-tall strip: baseline = stitch line; each step is a tick (2px x 8px ink line rising from the baseline); the step number (Meta with `.pm-tnum`, or the check or lock glyph) sits on the measure beside its tick and the label (Label) sits above it. Between steps, 3 minor ticks (1px x 4px hairline) so the strip reads as a measure. The **you-are-here pin** is a 10px pin head (round, `--pm-sys-text`, 2px white halo) sitting on the current step's tick with a 1px shank; `aria-current="step"` on the current step and a visually hidden "You are here" inside it.

**States per step.** done: tick and number in `--pm-sys-status-done`, label `--pm-sys-text`, a 12px check glyph replaces the number; link. current: label weight 600, pin; link. upcoming: number in `--pm-sys-text-meta`, label muted; link to the step's waiting/empty state. locked: lock glyph replaces the number, label `--pm-sys-status-locked`, `aria-disabled="true"`, not a link (rendered as `<span>`), tooltip "Opens after the plan is approved". Hover on any link: label underlined. Sub-progress: a step may carry `data-progress="2/3"`; the tape draws 2 of 3 filled 4px ticks under that label and the tooltip reads "Documents: 2 of 3 accepted".

**Sizes.** `min-width: var(--pm-tape-w)` (360px, 5 x 72), `max-width: var(--pm-tape-w-max)` (440px). Labels: Interview, Documents, Roadmap, Build, Try it. Number tokens: `--pm-cmp-tape-tick`, `--pm-cmp-tape-pin`, `--pm-cmp-tape-done`.

**Behaviour.** The pin slides 240ms when the stage changes (only in the flow prototype). The tape is identical on every project screen, including Settings and Live logs.

**A11y.** `<ol>` with `aria-current="step"`; each link's accessible name = "Step 2, Documents, 2 of 3 accepted".

**Do/Don't.** Do: mark Documents done and pin Build on the sprints screen even when the founder opens Interview. Don't: derive the current step from the URL (the locked interview screen bug); use the thread colour on the tape.

### D.4 Breadcrumb and Back

Covered in C.3. Rules: the leaf is never a link; every ancestor is; the list level ("Projects") is always present; Back goes to the ancestor. On the document reader Back = "Back to Documents". Keyboard shortcut: Alt+Left is not overridden.

### D.5 Status Pin

**Purpose.** One status vocabulary for projects, documents, sprints, features and jobs.

**Anatomy.** `<span class="pm-pin" data-status="working">` = 10px pin head (round) with an inner glyph for redundancy (not colour alone), then the label (Label step, weight 500), then, wherever the pin is a status (not a table cell), one plain sentence (Body, muted) that includes the wire word verbatim when a wire word exists.

**The fixed vocabulary (7).**

| Label | Colour token | Head glyph | Meaning | Sentence rule |
|---|---|---|---|---|
| Needs you | `--pm-sys-status-needs-you` (ink) | filled head | The founder must act | starts with the verb: "Answer the next question", "Accept this draft", "Approve the plan", "Try sprint 1" |
| Working | `--pm-sys-status-working` (chalk) | head with a 2px moving dash ring while live | Pramaan is doing something | "Pramaan is <gerund>… Nothing needed from you." |
| Waiting | `--pm-sys-status-waiting` | hollow ring | Queued behind something else | "Starts after <thing>." |
| Done | `--pm-sys-status-done` | filled head with check | Finished and, where it applies, accepted | "Accepted by you Tuesday 14:10." or "Built and checked." |
| Paused | `--pm-sys-status-paused` | head with a horizontal bar | Stopped on purpose and can resume | "Paused because <reason>. <How to resume>." |
| Blocked | `--pm-sys-status-blocked` | head with an x | Cannot continue without a fix | "A check did not pass. <What to try next>." |
| Locked | `--pm-sys-status-locked` | head with a lock | Read only for now | "Read only while sprint 1 is being built. <What you can do instead>." |

Tint variants (`.pm-pin--tint`) put the label on the status tint with 4px radius: used only in board cells and callouts.

**Mapping from today's phrasings.**

| Today | Pin | Sentence |
|---|---|---|
| Building | Working | "Pramaan is building sprint 1 (building). Nothing needed from you." |
| Drafting documents | Working | "Pramaan is drafting your product brief (defining)." |
| Paused | Paused | "Paused because the monthly budget is used up. Raise the budget in Settings to continue." |
| In the interview | Needs you | "Answer the next interview question." |
| Plan approved | Working (if a sprint runs) or Waiting (before it starts) | "Plan approved. Sprint 1 starts in a moment." |
| All planned sprints accepted | Done | "All 1 planned sprints accepted. Open your product any time." |
| Waiting for the next draft (footer) | Working | folded into the Working sentence |
| Dependency monitoring paused (footer) | no pin | a setting, not a status; shown only in Settings |
| accepted / draft (documents) | Done / Needs you | "accepted, draft 1, Tuesday" / "Draft 2 is waiting for you to read it." |
| In progress / Planned / Accepted / Not started (sprints) | Working / Waiting / Done / Waiting | |
| Plan being drafted / awaiting your approval / approved | Working / Needs you / Done | |
| Ready to try | Needs you | "Your product is ready to try." |

**Mapping from wire states** (inventory section 7): project `intake, classifying, provisioning, defining, designing, building, validating` -> Working; `awaiting_acceptance` -> Needs you; `accepted` -> Done; `blocked` -> Blocked; `archived` -> Locked ("Archived. Restore it from Settings."). Asset `generating` -> Working; `draft`, `pending` -> Needs you; `accepted` -> Done; `stale` -> Waiting ("Waiting for a fresh draft after the brief changed"); `rejected` -> Waiting ("You asked for changes. A new draft is coming."). Job `running` -> Working; `queued` -> Waiting; `done` -> Done; `failed` -> Blocked; `cancelled` -> Paused. Next-action kinds `connect_repository, confirm_classification, review_asset, accept_set, start_sprint, resolve_blocker` all render Needs you with their verb sentence. Unknown wire state renders no pin (keep the honesty rule).

**A11y.** The glyph is decorative (`aria-hidden`); the label text is the status; the sentence is plain text next to it.

### D.6 Banner / Callout

Kinds map 1:1 to pins: `needs-you` (ink tint, ink 1px left-to-right hairline top, never a side stripe), `working`, `paused`, `blocked`, `done`, `info` (chalk tint, for facts such as "Your private workspace is ready"). Anatomy: pin + one heading sentence (Heading step) + one supporting sentence (Body) + at most one action (quiet; the thread lives in the slot). Padding 16 20, radius card, tint bg, text `--pm-sys-text`. Rule: a tint is never decoration; if there is no status there is no tint (the "Handled by Pramaan" panel is a plain raised panel). Engineering facts in a banner go under a Details disclosure ("Details: repository pramaan-build/todo-d509a2e9").

### D.7 Project Card

**Purpose.** One project, what it needs next, one click to open.

**Anatomy.** `<a class="pm-card pm-card--project" href>` (the whole card is the link; nested interactive elements are not allowed). Grid: row 1: 28px initial tile + name (Heading) + pin at right; row 2: next sentence (Body, `--pm-sys-text`) e.g. "Answer the next interview question."; row 3: meta line (Meta, proportional, it is prose): "3 of 3 documents accepted · Sprint 1 of 4 · Updated 22 minutes ago". Description is not shown on the card (it is on the overview); the founder recognises projects by name.

**Sizes.** Padding 16; min-height 124; 2 columns at < 1440, 3 at >= 1440; gap 16.

**States.** hover: border `--pm-sys-control-border`, bg unchanged, arrow icon fades in at right of row 2; focus-visible: ring; needs-decision: the pen circle (chalk 1.5px ellipse) is drawn around the pin label of the first Needs-you card in the list (only one per list), and the card's next sentence is weight 600. paused/blocked: pin colour only, no tint. empty list: "No projects match 'zzzz'." + quiet "Clear search" (B4: the count in the h1 row reads "0 of 9 match").

**Do/Don't.** Do: sort Needs you first, then Working, Waiting, Paused, Blocked, Done, Locked. Don't: clip descriptions to three lines; add an "Open preview" button inside the card (the card is the link; the overview offers the preview).

### D.8 Metric Digits (engraved)

**Purpose.** Replaces the three flat metric cards with fixed-position numerals whose meaning is a sentence.

**Anatomy.** `<dl class="pm-digits">` with three `<div class="pm-digit">`: `<dd>` first visually (Digits step, tabular, `--pm-sys-text`) then `<dt>` (Meta, muted, uppercase not allowed; sentence case) then a sentence (Body, muted). The numerals are "engraved": rendered on the sunken surface (`--pm-sys-surface-sunken`) with an inset 1px hairline bottom-right (`box-shadow: inset -1px -1px 0 var(--pm-sys-hairline)`), no other effect. Fixed width: `min-width: 4ch` so "0 / 3", "1 / 4", "18 %" align across screens; the separator "/" and unit "%" are Body size, muted, baseline-aligned.

**Layout.** On the overview: a vertical stack of three in the left column, each row 72px: `[ 3 / 3 ] Documents accepted. All three unlock the plan.` / `[ 1 / 4 ] Sprints. Sprint 1 is being built.` / `[ 18 % ] Monthly budget used. Resets 1 October.` A total that does not exist yet is never typed as a dash character of any kind; use the CSS class `.pm-digit--none`, which draws a 12px hairline in place of the numeral, and let the sentence explain ("No sprints yet.").

**States.** Working (a sprint is live): the sentence carries the Working pin. Paused: the digit row keeps its number and the sentence explains ("Sprint 1 is paused because…"): never a green number under a paused word without the reason (extra defect 4). Budget details ("5,415,812 of 20,000,000 tokens") only under a Details disclosure.

**Don't.** No hero-metric card grid, no uppercase caption above a big number, no sparkline.

### D.9 Table

**Purpose.** Documents list and any row list where status and version are the point.

**Anatomy.** `<table class="pm-table">` with `<thead>` sticky (`position: sticky; top: 0` inside the scroller; on page screens `top: 0` of `main`'s scroll under the top bar: use `top: var(--pm-topbar-h)`), header cells Meta uppercase tracking 0.06em muted. Row height `--pm-row-h`. The first cell holds the row link (`<a>` covering the row via `::after` inset 0, `position: relative` on the `<tr>`); the row is one target. Columns for Documents: Document (Heading weight 500 at Body size) · Status (pin + short sentence, e.g. "Done · accepted Tuesday") · Version ("Draft 2", Label with `.pm-tnum`; "newest" as Meta) · Updated (Meta with `.pm-tnum`, relative time with `title` absolute). Numeric cells carry `.pm-tnum`; text cells do not. Status column min 220px; Version 96px; Updated 120px.

**States.** hover row bg sunken; focus-visible ring on the row link (drawn on the row via `:focus-within`); locked row: Locked pin, still openable (read only); empty: one row spanning all columns with the sentence and a quiet action; loading: 3 skeleton rows (sunken bars 12px, 60/40/30% widths), no spinner.

**Wide tables inside documents** (A7): `<div class="pm-table-scroll">` with `overflow-x: auto; overflow-y: visible`, the table `min-width: 640px`, first column sticky (`position: sticky; left: 0; background: raised`). Headers are plain words with the file's own term in `title` ("How we will know" for "Measure or binary condition", "Starting point", "Goal", "By when", "Where we look", "Who decides"). There is no ID column: a row's file code (KPI-1, G-1) sits in a closed `<details class="pm-details">` "Details" at the end of the first cell, mono. Cell text stays at Body size; never shrink text to fit.

### D.10 Reading Document

**Purpose.** Read a long draft, comment on passages, accept or ask for changes without losing the decision.

**Anatomy** (Reading archetype, C.6): 
1. **Contents rail** (left, `--pm-toc-w`, sticky, `top: 0` inside the reading scroller; on this screen the scroller is the whole reading region so the rail is `position: sticky` in a separate non-scrolling column): "In this document" (Meta) + an `<ol>` of h2 titles (Label, each with its plain gloss as `title`), the current section marked with a 2px ink bar on the left and weight 600 (`aria-current="location"`). The last item is "Advanced sections" with a nested `<ol>` of the advanced h2 titles (muted, indented). Scroll-spy (components.js) measures the sections, not the sticky headings: `.pm-reader-sec`, the `details.pm-reader-adv` group and its `.pm-reader-sub` sections in document order; a section inside a closed group (or with zero height) is skipped, so a hidden section is never marked, and opening the group re-runs the spy so the nested sections mark as they pass. A contents link or page hash that points into a closed details opens it (and every details around it) first. Below the list: "Passage comments (1)" link and "Details" link.
2. **Reading column** (68ch): starts with the **Action Bar** (D.1) sticky at the top: pin + sentence ("Needs you · Draft 1. Nobody has accepted it yet.") · quiet "Ask for changes (1)" · thread "Accept this draft". Then the document title and the byline row (Meta): "Pramaan wrote draft 1 on Tuesday at 20:59." with the version chips beside it (`Draft 1 · newest`, `Draft 2`; chips are quiet toggles that switch the shown version; the newest is default). The chips live in the byline, not in the action bar, so the bar keeps room for its sentence and two buttons. Then the body: h2 at Heading, h3 at Body 600, paragraphs at Reading with `max-width: 68ch`, lists with 8px item gap, tables per D.9 wide rule, code/ids in mono at Meta size inside `<code>` with sunken bg and 4px radius. Every h2 is a sticky section header inside the scroller (C.5) so no card is sliced; the stuck h2 is an opaque mask (raised background, a 1px hairline below, and the same surface extended 8px upward behind the action bar by a `::before`), so no text can show between the bar and the heading at any scroll offset. There is no fade: a fade under the hairline left half-faded glyph tops showing, so text is now cut cleanly by the hairline. The sticky `top` is the bar height minus 1px and the reader's `scroll-padding-top` matches it, so a contents jump lands the heading exactly where it sticks. **Gloss:** directly under every h2 that uses a working term sits one plain sentence (`p.pm-gloss`, Meta size, muted): "Success contract" / "How we will know the product works." **Advanced group:** sections a founder never needs to read to accept (Execution contract, Frozen autonomous decision policy, Authority envelope, Readiness gate) sit after the founder sections in ONE closed `<details class="pm-details pm-reader-adv" id="s-advanced">` whose summary reads "Advanced sections (how Pramaan will work)"; each inside is a `<section class="pm-reader-sub">` with its own sticky h2 and gloss. Tables follow the D.9 wide rule (plain headers, codes under Details).
3. **Chalk margin** (right, min 80px): passage comment marks. A commented passage gets a 2px chalk underline (`text-decoration: underline; text-decoration-color: var(--pm-sys-chalk); text-decoration-thickness: 2px; text-underline-offset: 4px`) and a chalk mark in the margin: a 24px round chalk-tint disc with the comment number (Meta, chalk text). Clicking a mark opens the comment popover (D.16) anchored to the mark: quoted passage (Reading, italic not used; a 2px chalk left underline is not allowed; use a chalk-tint block with 8px padding), the comment text, "Remove comment" ghost. Selecting text shows a floating "Comment on this passage" quiet button (popover API) at the selection end.
4. **Details disclosure** at the end of the byline: `<details>` with digest, repo path, draft ids, "The file's own labels" in mono. Closed by default.

**States.** draft (Needs you): as above. accepted (Done): bar shows "Done · accepted by you Tuesday 14:10" and quiet "Ask for a new draft" (no thread on this screen; the thread slot in the top bar shows the next decision elsewhere, e.g. "Approve the plan"). locked (Locked): bar shows "Locked · Read only while sprint 1 is being built." + quiet "Request a revision" (opens the request-a-revision popover: a textarea + "Send the request" quiet; sentence: "Pramaan finishes the current sprint first, then drafts the change for you to accept.") and quiet "Open Build". Comments are disabled with the reason "Comments reopen after the sprint." Empty (no draft yet): Working pin + "Pramaan is writing draft 1. This page fills in when it is ready." with a skeleton of 6 paragraph bars.

**Sizes at 1142 (rail collapsed, 1030 usable).** toc 200 + 24 + reading 720 + 24 + margin 62 (marks overflow into the margin by design; comment popover is `position: fixed`, escapes any container). At 1440 expanded: 220 + 24 + 720 + 24 + 140.

**A11y.** Reading column is `<article>`; the action bar is `role="region" aria-label="Your decision"`; comment marks are buttons with names "Comment 1 on 'Constraint: …'"; version chips are a `radiogroup`.

### D.11 Chat Workbench (Interview)

**Purpose.** The conversation is the job. One scroll, composer always in reach, decisions always visible, the brief action pinned the moment the interview ends.

**Anatomy** (Chat archetype): `main` is `height: 100vh; display: grid; grid-template-rows: 56px 28px 1fr` (top bar, strip, workbench). Workbench: `grid-template-columns: minmax(0,1fr) var(--pm-panel-w); gap: 0`.

Left column (`.pm-chat`): `display: grid; grid-template-rows: auto 1fr auto`.
1. **Chat header** (48px, hairline bottom): "Your product partner" (Heading) · progress: a small tape "6 of 6 topics covered" (Meta, `.pm-tnum` on the count, a 4px ink track 120px wide with fill; the sentence "Topics adjust as your scope changes." lives in the progress block's `title`, not as a visible line, so the header stays 48px) · a quiet ghost "Have a document already? Add it" that opens the attach sheet.
2. **Thread** (`.pm-chat-thread`, the one scroller, `overflow-y: auto; scroll-padding-bottom: 16px`): messages column `max-width: 720px; margin: 0 auto; padding: 24px`. Message anatomy: speaker (Meta, weight 600, muted: "You" / "Pramaan"), body (Reading), time (Meta). No bubbles for Pramaan (plain text on the surface, hairline separators 24px apart); the founder's messages sit on the sunken surface with 10px radius and 12px 16px padding, aligned left too (no chat-app right alignment). Streaming: a Working pin with the moving dash after the last Pramaan message and `aria-live="polite"`. Auto-scroll only if the reader is within 120px of the bottom; otherwise a quiet "New reply below" pill (`position: sticky; bottom: 8px`) appears.
3. **Question card** (inside the thread, after the last Pramaan message, when the partner asks structured questions): raised card, Heading "Two quick questions", each question as a labelled field (radio group or short textarea), and a docked footer inside the card with the thread "Submit answers" (the only thread while a question card is open; the composer's send becomes quiet). The card is the last thread item so it is at the bottom, right above the composer.
4. **Composer** (`.pm-composer`, docked, `position: static` as the last grid row, min-height 96, padding 12 24 16, bg ground, top edge = stitch): textarea (auto-grow 1 to 6 lines, Reading size, placeholder "Tell us in your own words"), left ghost icon button "Attach files or images" (paperclip, `aria-label`, count "0/5" as Meta beside it when files exist), right: the send button. Send is the thread ("Send reply", 40px) whenever the interview is running and no question card is open. Hint under it (Meta): "Ctrl+Enter sends. Your decisions save as you go." Disabled while Pramaan is replying with the reason "Pramaan is replying…" (loading state, thread fill kept, label "Sending…").

Right column (`.pm-decisions`, `height: calc(100vh - 84px)`, bg raised, left hairline, `overflow-y: auto`): header 48px sticky: "Your decisions" (Heading) + "6 of 6 saved" (Meta with `.pm-tnum`) + a 4px tape line. List: one row per decision, at least 46px collapsed (`--pm-row-h`): title (Label) on its own line + the saved value (Body, muted) under it, wrapping to at most two lines (never cut to one line with an ellipsis) + ghost "Edit" (appears on hover/focus). Measured at 1142x732: 65px for a one-line value, 87px for two; six collapsed rows fit the 648px panel with its header, Details and footer without scrolling. Click expands the row to show the full value and an inline textarea with quiet "Save" and ghost "Cancel". Rows are collapsed by default so 6-10 decisions fit in the 648px available at 732 without scrolling; the panel scrolls only past ~12. Footer (sticky bottom, 40px): "Saved automatically. Edit any decision any time." (Meta). Engineering rows ("Workspace sized automatically", "pramaan-build/ui-test-52da6713") go under a Details disclosure at the very bottom.

**Interview finished.** The moment the interview ends, the thread slot in the top bar shows the thread "Create my product brief" (and the composer's send drops to quiet with the placeholder "Add anything else before the brief is written"). The last thread item is a Done pin + "We have a direction. Your brief uses your latest saved decisions." No other canary element.

**Interview locked** (during a sprint): the workbench is replaced by the Locked state (D.15): "Locked · The interview is read only while sprint 1 is being built." + "What you can do: read your decisions (panel stays visible, read-only), request a revision (quiet, opens the revision popover), or open Build (quiet)." The tape pins Build, not Interview.

**Empty (fresh project).** The thread shows Pramaan's first message; the composer is focused; decisions panel shows "0 of about 6 saved. They appear here as you answer." (no fixed count is promised beyond "about").

**A11y.** The thread is `role="log"` with `aria-live="polite"`; the composer is a `<form>`; Ctrl+Enter submits; Escape cancels an inline decision edit.

### D.12 Sprint Route (roadmap)

**Purpose.** Replace chips-plus-arrows with a stitched route the founder can read at a glance: what each sprint delivers, what they will be able to try, and what happens after a sprint completes.

**Anatomy.** `<ol class="pm-route">`: a vertical route. A 2px stitched line (vertical `--pm-stitch` rotated: use `background-image: repeating-linear-gradient(180deg, hairline 0 6px, transparent 6px 10px); width: 2px`) runs down the left at x = 20px. Each sprint is a **stage node**: a 24px pin head on the line (status colour, glyph as in D.5) and a card to the right (raised, hairline, padding 16 20): row 1: "Sprint 1 · Your private checklist" (Heading) + pin at right ("Working · being built"); row 2: "You will be able to:" (Meta) + a list of the sprint's outcomes as plain sentences (Body), each with a 6px hollow tick on the line instead of arrows and chips (the six chip texts become list items); row 3 (`.pm-route-try`): chalk-tint block "You can try: sign up, log in, land on your own empty checklist, and add your own tasks." (Body, chalk text); row 4 (`.pm-route-then`, Meta): "Then: try sprint 1, share what you found, accept it. Sprint 2 starts when you accept." A stage node marked Done shows "Accepted by you Tuesday · Open what was built" (quiet link). After the last node, a terminal node: "After sprint 4: all planned sprints accepted. You can open your product any time and start a new plan for more." Founder's-words chalk (G.3) hangs off each outcome when "Show my words" is on.

**States.** awaiting approval: the plan's top Action Bar shows Needs you + "Nothing starts building until you approve." with quiet "Ask for changes to the plan" and the thread "Approve the plan and start building" (also in the top-bar slot: the bar and slot share one element visually, see D.14). approved and building: the bar shows Working, no thread on this page; the top-bar slot shows "Working · Pramaan is building sprint 1. Next decision: try sprint 1 when it is ready." being drafted: Working pin + "Pramaan is drafting your plan." in the gate bar, with a 3-node skeleton route (screen 11b). Controller ruling 2026-09-30: the gate shows "Approve the plan" disabled with its reason beside it ("Opens when the draft is ready."), so the founder sees where the decision will appear; it is never the thread and the slot shows Working (`data-thread-none="working"`).

**Sizes.** Card max width 760px; node gap 24px; the route is one column (no wrap, no dangling arrows).

### D.13 Feature Board (sprints)

**Purpose.** Feature x stage grid, liked by reviewers; tightened.

**Anatomy.** `<table class="pm-board" data-density="compact">`: first column Feature (name Label 600 + one-line plain sentence Body muted, max 2 lines), then Building · Testing · Reviewing · Ready. Cells: tinted pin chips (D.5 tint variant) 28px tall: Done (moss tint, check), Working (chalk tint, dash), Waiting (no tint in either theme, hollow ring, text muted; the hatched "Not started" pattern is removed), Blocked (red tint). Column header sticky. The latest worker note ("Fixer: Good. Now let's run the new page tests…") is not shown in the board row; it moves to the Log viewer and the Details disclosure of the row (ghost "Details" at row end).

**Sprint header** above the board (not a banner): "Sprint 1 · Your private checklist" (h1 is "Build"; this is a Heading) + pin + sentence + the engraved progress: a 4px tape line with "2 of 3 features ready" (Digits at 22px inside the header; the percentage is never shown, so 95% vs 3/3 cannot contradict: progress = features ready / features planned). Right column "This sprint" strip (320 at >= 1280): "When this sprint is done you can:" + the try-list (Body) + "Then: Try sprint 1 appears here and in the top bar."

**"Happening in your sprint"** becomes an activity feed (D.17 compact variant, last 5 entries, plain sentences: "Testing sign-up and log-in · 1 minute ago") with an empty state "Nothing has happened yet. The first entry appears when building starts." Never a large empty card.

**All accepted state.** One title "Build", a Done banner: "All planned sprints accepted. Nothing further is scheduled." Actions: the thread "Open your product" (in the top-bar slot and the banner: one element), quiet "Take a copy of your code", quiet "Back to projects" (the Back button already does this, so the third button is dropped). The Live site block becomes an info callout: "Going live is not available yet. Your accepted sprints are kept. We will show a 'Go live' step here when it exists." (no invented date).

**Check failed.** Blocked banner above the board: "A check did not pass on sign-up and log-in. Pramaan is fixing it; nothing needed from you." + quiet "Check again" only if the founder can actually trigger it; otherwise no button.

### D.14 Approval Gate

**Purpose.** The explicit plan approval (decision history: navigation alone must never start a build).

**Anatomy.** The Action Bar (D.1) at the top of the roadmap column, height 64: left: Needs you pin + Heading "Approve this plan?" + Body "4 sprints. Sprint 1 builds your private checklist. Nothing is built until you approve, and you can ask for changes first." Right: quiet "Ask for changes to the plan" (opens an inline textarea below the bar, not a dialog) and the thread "Approve the plan and start building" (40px). The top-bar thread slot on this screen shows the same thread; to keep One Thread true, the top-bar slot hides its copy while the Action Bar is in view (`IntersectionObserver` toggles `hidden`), and shows it once the bar scrolls out. Build: any on-page decision marked `data-gate` (the gate bar, an overview banner, the all-accepted banner) owns the thread while it is fully in view under the bar; slot parts marked `data-slot-sentence` show only then (components.js section 4, flow.js per screen). Automated check counts visible thread elements.

**States.** default; loading ("Approving…"); disabled with reason (e.g. budget used up: "Raise the monthly budget in Settings to approve." with a quiet "Open Settings"); approved (Done): the bar becomes "Done · Plan approved Tuesday 14:10. Sprint 1 is being built." + quiet "Ask for a change to the plan (creates a revision after the current sprint)"; drafting: Working bar with Approve disabled and its reason (D.12, screen 11b).

### D.15 Checklist and Preview Stage (Try it)

**Purpose.** The preview is the hero; the checklist is a fixed side panel with verdicts.

**Anatomy.** Stage archetype. Left: `.pm-stage`, `height: calc(100vh - 84px)`, `display: grid; grid-template-rows: 40px 1fr`. Row 1 (stage bar, Meta): "Private preview · Sprint 1: Calculator on every device · Only people in your organisation can open it" + quiet ghost "Open in a new tab" (secondary, right). Row 2: the `<iframe>` fills the row (`width: 100%; height: 100%; border: 0; background: raised`), hairline frame, radius card. No fixed 571px height; the product fills the viewport (A8). Loading: skeleton with a Working pin "Loading your preview…"; error: Blocked callout inside the stage "The preview did not load. Try again, or open it in a new tab." with quiet "Try again".

Right: `.pm-checklist` panel (`--pm-panel-w`, raised, left hairline, `height: calc(100vh - 84px)`, `grid-template-rows: auto 1fr auto`): header sticky: "Try these" (Heading) + "3 of 5 answered" (Meta with `.pm-tnum`) + 4px tape line. Items (the scroller only if > ~8 items): each item 2 lines: the task (Body, weight 500: "Enter 1 + 2 and press Calculate.") + expected result (Meta muted: "You see 3.") + a verdict row of three quiet toggle buttons 28px: "Yes", "Not quite", "Confusing" (radiogroup; chosen one becomes ink fill with white text; "Not quite" and "Confusing" reveal a one-line textarea "What happened?"). Footer sticky: the thread "Accept sprint 1" enabled only when every item has a verdict; disabled reason: "Answer all 5 to accept." When any verdict is Not quite/Confusing, the footer thread becomes "Ask for changes (2)" and a quiet "Accept anyway" appears; the sentence explains: "Your notes go to Pramaan as the next fix."

**Locked / not ready.** Stage shows the Waiting state: "Your preview appears here when sprint 1 is ready. Pramaan is building it now (2 of 3 features ready)." + quiet "Open Build". The tape pins Build.

### D.16 Empty, Locked, Error states; Popover; Dialog; Toast

**Empty state** (`.pm-empty`): centred in its region, max 420px: a 24px pin-glyph (Waiting), Heading sentence ("No documents yet."), Body sentence (what will happen or how to start), at most one quiet action. Never "Nothing here".

**Locked state** (`.pm-locked`): Locked pin + Heading "Read only while sprint 1 is being built." + Body "You can still: read everything here · request a revision (Pramaan drafts it after the sprint) · open Build to see progress." rendered as a 3-item list with quiet links; the tape pins the real stage; the rail item shows the lock glyph.

**Error state** (`.pm-error`, inline, never a modal): Blocked pin + "What happened" (Heading sentence) + "Why" (Body) + "What to try next" (one quiet action). Example: "The plan could not be saved. The connection dropped. Try again; your text is kept."

**Popover** (comment, revision request, rail menus): `popover` attribute or `position: fixed` (escapes scrollers), raised, shadow float, radius card, padding 16, max-width 360, arrow none, Escape closes, focus returns to the trigger.

**Dialog** (rare: only "Stop this sprint?" and "Delete this project?"): `<dialog>` with scrim, max-width 440, Heading question, Body consequence sentence, quiet "Keep going" + danger "Stop the sprint". Never for information, never for a form.

**Toast** (`.pm-toast`): bottom-left of `main`, 12px from edges, raised, shadow float, radius card, padding 12 16, pin + sentence ("Done · Draft 1 accepted. The plan opens next.") + optional quiet "Undo" when reversible; auto-dismiss 6s (paused on hover/focus), `role="status"`. Inline confirmation preferred for form saves: the saved field's helper line becomes "Saved 14:10" with a Done pin for 4s.

### D.17 Form controls and Log Viewer

**Fields.** Label above (Label step), control 36px (textarea min 3 lines), padding 0 12px, border 1px control-border, radius control, bg raised; hover border ink-600; focus ring; helper (Meta muted) below; error: border `--pm-sys-status-blocked` + Blocked pin sentence in the helper, `aria-invalid`; disabled: bg sunken, text `--pm-sys-text-muted`, reason in helper. Select uses the native control with a drawn 16px chevron (`appearance: none`). Checkbox/radio native with `accent-color`. Switch: 36x20 track (ink-300 off, ink-900 on), 16px knob, label to the right, `role="switch"`, and beside it the consequence sentence ("Monitoring is off. Turn it on to see your dependencies and updates." with a quiet "Open dependency monitoring" link when on).

**Budget field.** Section "Monthly budget"; label "Monthly limit"; a number field with the unit "million units" beside it; helper "18% used this month. Resets 1 October."; a closed Details: "Units are tokens, the pieces of text the AI reads and writes. 5,415,812 of 20,000,000 used this month." The word token never appears outside that Details.

**Save pattern.** Each settings section ("Project name", "Monthly budget") is a form with a quiet "Save name" button that is disabled until the value changes, with the reason "Nothing changed yet." beside it; after change it enables; after save, inline confirmation. Sections stack in one 720px column (no unequal two-column cards). "Export to GitHub" appears as a Waiting sentence, not a disabled button: "Export to GitHub is not available yet. Your code stays yours; take a copy any time." + quiet "Take a copy".

**Log Viewer** (`.pm-log`, Log archetype): filter row (Level, Project, "Show requests" switch, quiet "Pause") as inline fields 32px; the count sentence (Meta, proportional, it is prose): "Live · 69 lines · times are UTC". The list is the one scroller (`height: calc(100vh - 56px - 108px)`): each line is a plain entry at compact density: time (mono 13/20 with `.pm-tnum`, muted; the log time column is one of the tabular contexts) · the event in plain words (Body: "Job finished: plan sprint", "Code received from GitHub") and the project name when the filter shows all projects · a closed "Details" disclosure. Everything technical is under that Details: the wire event (`event builder.job.finished`), ids truncated to 8 chars each with a 16px copy button (`aria-label="Copy job id"`), kind, duration, the level word (INFO, WARN, ERROR), and the raw line in a sunken mono block. Day/hour separators are sticky section headers. Light surface (the dark panel goes); text ink on raised. Pause freezes auto-scroll and shows "Paused · 12 new lines" with quiet "Resume".

### D.18 Search field, chips, disclosure, skeleton

**Search**: 36px field with a 16px search icon left, clear button right, `type="search"`, results count updates live in the h1 row (B4). **Chips** (version chips, filter chips): 28px, radius chip, quiet border, Label; selected = ink fill. **Disclosure** (`<details class="pm-details">`): summary "Details" (Label, muted) with a 12px chevron, content on the sunken surface 12px padding, mono where the content is ids. **Skeleton**: sunken bars 12px tall, radius chip; the one looping animation besides the Working dash (B.6): a 1.2s opacity-only pulse (1 to 0.5 to 1, no shimmer, no movement), disabled under `prefers-reduced-motion` (static bar).

---

## E. Copy rules and microcopy

Rules: sentences under 14 words; literal verbs; second person; present tense; no jargon (token, digest, repo, PRD, UAT, deploy: replaced by budget, details, code, product brief, try it, go live); wire words allowed only verbatim inside a sentence or Details; numbers as digits; no em-dash (use a full stop or a comma); no exclamation marks; no "Oops"; no "AI-powered"; "Pramaan" is the actor, "your product partner" only in the interview header.

| Place | Copy |
|---|---|
| Thread, projects list (a project needs you) | "Continue: todo" (thread) with the sentence "Answer the next interview question." |
| Thread, projects list (nothing needs you) | ink button "New project"; slot sentence "Nothing needs you right now." |
| Overview thread (interview) | "Continue the interview" |
| Overview thread (draft to read) | "Read the product brief" |
| Overview thread (plan) | "Approve the plan" |
| Overview thread (try) | "Try sprint 1" |
| Overview slot (working) | "Working · Pramaan is building sprint 1. Nothing needed from you." |
| Overview paused (founder needed) | banner "Paused · The monthly budget is used up. Raise it in Settings to continue. Everything you accepted is kept." with thread "Raise the budget" (the banner is the gate); slot sentence "Budget used up." while the banner is in view, the slot thread once it scrolls under the bar |
| New project thread | "Start the interview" with sentence "Pramaan starts reading as soon as you press this. Nothing is built yet." |
| New project hint (replaces the explainer box) | "Say what you want built, the way you would tell a friend. The interview asks the rest." |
| Interview send | "Send reply" · hint "Ctrl+Enter sends. Your decisions save as you go." |
| Interview question card | "Submit answers" |
| Interview finished | "Create my product brief" · "We have a direction. Your brief uses your latest saved decisions." |
| Interview locked | "The interview is read only while sprint 1 is being built." · list: "Read your decisions", "Request a revision", "Open Build" |
| Documents h1 sentence | "Product brief, Requirements and User journey unlock the plan. 3 of 3 accepted." |
| Documents advanced | "Review advanced technical documents (4)" as a disclosure summary |
| Reader bar (draft) | "Needs you · Draft 1. Nobody has accepted it yet." · quiet "Ask for changes (1)" · thread "Accept this draft" |
| Reader bar (accepted) | "Done · Accepted by you Tuesday 14:10." · quiet "Ask for a new draft" |
| Reader bar (locked) | "Locked · Read only while sprint 1 is being built." · quiet "Request a revision" |
| Reader glosses (under the heading) | "One-sentence outcome": "The one thing this product should do." · "Success contract": "How we will know the product works." · "Guardrails": "Things that must not get worse while we build." · "Acceptance signal": "The check you can run yourself to accept the result." |
| Reader advanced group | summary "Advanced sections (how Pramaan will work)", closed · contents rail item "Advanced sections" |
| Reader table headers | "How we will know" · "Starting point" · "Goal" · "By when" · "Where we look" · "Who decides"; the file's code under the cell's "Details": "The file's own label: KPI-1" |
| Comment prompt | "Comment on this passage" · "Your comments are sent together when you ask for changes." |
| Roadmap gate | "Approve this plan?" · "4 sprints. Sprint 1 builds your private checklist. Nothing is built until you approve." · thread "Approve the plan and start building" · quiet "Ask for changes to the plan" |
| Roadmap approved | "Done · Plan approved Tuesday 14:10. Sprint 1 is being built." |
| Roadmap drafting | "Working · Pramaan is drafting your plan from the three accepted documents." |
| Route "then" line | "Then: try sprint 1, share what you found, accept it. Sprint 2 starts when you accept." |
| Route end | "After sprint 4, all planned sprints are accepted. You can open your product any time and plan more." |
| Sprints header | "Sprint 1 · Your private checklist" · "Working · 1 of 3 features ready. Nothing needed from you." |
| Sprints done | "Done · All planned sprints accepted. Nothing further is scheduled." · thread "Open your product" · quiet "Take a copy of your code" |
| Live site | "Going live is not available yet. Your accepted sprints are kept." |
| Check failed | "A check did not pass on sign-up and log-in. Pramaan is fixing it. Nothing needed from you." |
| Try it header | "Try these" · "3 of 5 answered" · footer thread "Accept sprint 1" · disabled reason "Answer all 5 to accept." |
| Try it verdicts | "Yes" · "Not quite" · "Confusing" · follow-up "What happened?" |
| Try it changes | thread "Ask for changes (2)" · quiet "Accept anyway" · "Your notes go to Pramaan as the next fix." |
| Preview bar | "Private preview · Sprint 1: Calculator on every device" · "Open in a new tab" |
| Preview waiting | "Your preview appears here when sprint 1 is ready. Pramaan is building it now." |
| Settings save (unchanged) | reason "Nothing changed yet." |
| Settings save (saved) | "Saved 14:10" |
| Budget field | section "Monthly budget" · label "Monthly limit" · unit "million units" · helper "18% used this month. Resets 1 October." · Details: "Units are tokens, the pieces of text the AI reads and writes. 5,415,812 of 20,000,000 used this month." |
| Monitoring off | "Monitoring is off for this project. Turn it on to see your dependencies and updates." |
| Export | "Export to GitHub is not available yet. Your code stays yours; take a copy any time." |
| Logs count | "Live · 69 lines · times are UTC" · paused: "Paused · 12 new lines" |
| Logs event names | "Job finished: plan sprint", "Preview opened", "Code received from GitHub", "Job finished: build feature", "Job finished: check feature", "Job finished: review feature" |
| Logs row | time · plain event name · project · "Details" (event code, ids with "Copy job id", kind, duration, level, raw line) |
| Review-only chrome (proposal only) | "Review only: proposal state" (13 state switch) · "Review only: Journey" (flow panel); class `.pm-review-only`, never shipped |
| Empty projects | "No projects yet. Start with an idea; Pramaan asks the rest." · quiet "New project" (thread when it is the only decision) |
| Empty search | "0 of 9 match 'zzzz'." · quiet "Clear search" |
| Error generic | "<What happened>. <Why>. Try again; nothing you typed is lost." |
| Nothing-is-lost strip | "Last saved: your decision 'First turn', 14:10 · Last accepted: Product brief draft 1, Tuesday" · quiet "History" |
| Status labels | Needs you · Working · Waiting · Done · Paused · Blocked · Locked |
| Pass 2: entry points (01) | "Start a new product" (title "Describe your idea. Pramaan builds it, and you try it every sprint.") · "Hand off your code" (title "Upload it or import it from GitHub. Pramaan takes it from there, and you can take a copy back any time.") · Meta "For engineering teams" · "Work in my repository" (title "Request features in a repository you own. Pramaan opens reviewed pull requests; you merge and deploy.") |
| Pass 2: lane switcher (02, 18, 21) | "Describe your idea" · "Hand off your code" · "Work in my repository" with the Meta "For engineering teams" before it; the current lane is the ink-filled chip |
| Pass 2: 02 title | h1 "New project" · sentence "Say what you want built, the way you would tell a friend." · aside heading "What happens next" · under the form "What Pramaan does with this": "Pramaan reads it once." · "The interview asks the rest." · "Nothing is built until you approve a plan." |
| Pass 2: 18 hand off | h1 "Hand off your code" · sentence "Pramaan builds in its own private copy from here." · fieldset "Where is your code?" · choice "Upload a .zip" with "No GitHub account needed." · choice "Import from GitHub" with "Pramaan reads it once. Your repository is never changed." · field "Your code (.zip, up to 200 MB)" · "Project name" · "What it does (optional)" · consequence "Pramaan never writes back to where the code came from." · Details "Dependencies, build output and the .git folder are left out of the copy; the ZIP can unpack to at most 1 GB and 50,000 files." and "Bringing back a copy you exported? It starts a new project. The original project's documents and history stay with it." · thread "Create private working copy" · slot sentence "Your code is read once." |
| Pass 2: 18 copy flow aside | heading "Where your code goes" · box 1 "Your upload" / "No file chosen yet" (then the file name and size) / chip "Read once · never changed" · box 2 "Pramaan's private copy" / "A private copy named after your project" / chip "All work happens here" · sentence "The code stays yours. Take a copy any time." · Details "The private copy is a private repository Pramaan holds, named after your project. Take a copy downloads a .zip. Export to GitHub is not available yet." |
| Pass 2: 18b GitHub branch | account row "GitHub · Connected as Aditya Choudhary" (Done pin) · field "Pick the code to bring" · list rows "studio-demo/customer-portal" (chosen), "test-org/todo · already a Pramaan project", "test-org/provider-update-demo-npm-stack", "test-org/omnibound-vlmk-craft" · helper "Pramaan reads it once. Your repository is never changed." · box 1 "GitHub" / "studio-demo/customer-portal" / chip "Read only · unchanged" |
| Pass 2: 18c too big | field helper (Blocked) "This file is larger than 200 MB. Choose a smaller .zip, or leave out big folders such as media." · action "Choose another file" · slot "Blocked · Choose a file under 200 MB." · button reason "Choose a file under 200 MB first." |
| Pass 2: 18d not a zip | field helper (Blocked) "This is not a .zip file. Zip the folder and choose the .zip." · action "Choose another file" · slot "Blocked · Choose a .zip file." · button reason "Choose a .zip file first." |
| Pass 2: 18e permission | account row (Needs you) "GitHub needs your permission first." · sentence "Pramaan asks GitHub to read your code. GitHub shows you exactly what it asks for." · thread "Give permission on GitHub" · list reason "Your GitHub projects appear here after you give permission." · box 1 "GitHub" / "Not connected yet" |
| Pass 2: 19 copying | lead tile (Working) "Pramaan is making your private copy." · steps: Done "Received customer-portal.zip (38 MB)" · Done "Unpacked it. Dependencies, build output and the .git folder are left out." · Working "Making your private copy" · slot "Working · Copying your code." · locked destinations tooltip "Opens when your private copy is ready" · info tile "Your original code stays unchanged." · next tile "Bring your requirements or answer questions about your code" then Documents, Roadmap, Build |
| Pass 2: 20 requirements | h1 "Your requirements" · sentence "Bring a document, or answer questions about your code." · field "Have a requirements document? (.md or .txt, under 1 MB)" · textarea "Or paste it here" · quiet "Use this document" with reason "Add a document first." · errors "Choose a Markdown or text file under 1 MB." / "This document is empty." / "The file could not be read. Paste its text below instead." · slot sentence "About your code and what to build next." · thread "Start the interview" · aside (Done) "Your private copy is ready." · "Your original code stays unchanged." |
| Pass 2: lane A join | Interview header "Working from your code and your answers" · first message "I read your code once. It stays unchanged. What would you like to add or improve first?" · Documents row "Requirements · Needs you · Draft 1, imported by you from customer-portal-requirements.md" · tape Interview step "done, you brought a document instead" |
| Pass 2: 21 connect | h1 "Work in your repository" · sentence "For engineering teams. Pramaan proposes changes as pull requests; you review, merge and deploy." · "Choose your repository" · search "Find a repository" · "Showing 6 of 33" · fact "Next, Pramaan checks that its GitHub App can write to the repository you choose. It opens pull requests there and never pushes to your default branch." · check (Done) "Pramaan can open pull requests in test-org/insight-weaver-537." with "It never pushes to your default branch (main)." · thread "Connect repository" · slot sentence "Pramaan opens pull requests here." |
| Pass 2: 21 aside | "How this works" · "Makes the change on a new branch in your repository" · "Tests the change it made" · "Opens a pull request and has it reviewed" · "Fixes what the review finds, and has it reviewed again" · "What stays with you" · "Merging the pull request" · "Deploying, and testing your running app" · "Pramaan never pushes to your default branch." |
| Pass 2: 21b permission | check (Blocked) "Pramaan cannot open pull requests in test-org/insight-weaver-537 yet." with "The Pramaan GitHub App is not installed for this repository." · thread "Install the Pramaan app on GitHub" · quiet disabled "Connect repository" with reason "Install the app first." |
| Pass 2: 21c empty | empty state "No repositories found." · "Your GitHub account has no repositories Pramaan can see. Install the Pramaan app on the organisation that owns your code." · thread "Install the Pramaan app on GitHub" |
| Pass 2: 22 requests | h1 "Requests" · sentence "4 requests. 1 needs you." · composer label "Request a change" · placeholder "Describe the change the way you would in a ticket. One change per request." · hint "Pramaan starts on a new branch as soon as you send. Nothing touches main." · send (ink, or the thread when nothing needs you) "Send the request" · slot (Needs you) "Merge 'Let admins archive old workspaces'." · thread "Open pull request #42" · strip "Last merged: 'Export the weekly report as CSV', Tuesday 14:10" |
| Pass 2: 22 rows | "Export the weekly report as CSV" Done "Merged by you Tuesday 14:10." · "Let admins archive old workspaces" Needs you "Reviewed twice and ready. Merge it when you are ready." · "Send a summary email every Monday" Blocked "A check did not pass. Pramaan is fixing it; nothing needed from you." · "Search across notes" Waiting "Starts after 'Send a summary email every Monday'." · meta pattern "Started Tuesday · feature/2-archive-workspaces · Pull request #42" |
| Pass 2: 22b empty | empty state "No requests yet." · "Describe the first change you want. Pramaan makes it on a new branch and opens a pull request." · slot sentence "Nothing needs you. Describe the first change." · thread "Send the request" |
| Pass 2: 23 request | banner (Needs you) "Ready to merge." · "Reviewed twice. Merge it when you are ready. Pramaan never pushes to your default branch." · thread "Open pull request #42" · "What Pramaan did": Done "Made the change on a new branch" (feature/2-archive-workspaces) · Done "Tested the change it made" (Checks passed on the branch) · Done "Opened a pull request and had it reviewed" (Pull request #42, opened Tuesday) · Done "Fixed what the review found, and had it reviewed again" (Round 1 asked for an empty-state test. Round 2 passed.) · "What you asked for" · aside "What stays with you" as on 21 · Details "Default branch: main" |
| Pass 2: 23b blocked | banner (Blocked) "A check did not pass in round 2." · "Pramaan is fixing it on the branch; nothing needed from you." · slot "Blocked · Fixing round 2." · step 4 Working "Fixing what the review found" · Details "Failing check: the test run on the branch." |
| Pass 2: tape, request | `aria-label="This request"` · steps "Build" · "Test" · "Review" · "Merge" · tooltip on Review "Review: 2 rounds" |
| Pass 2: dictation | mic label "Dictate your reply" · listening "Listening. Press the button again to stop. Nothing is sent until you press Send." · done "Added to your reply. Check it, then send." · unavailable "Dictation is not available in this browser. Typing works the same." · no speech "Nothing was heard. Try again, or type." · blocked "The microphone is blocked. Allow it in your browser, or type." |
| Pass 2: autonomy setting | section "Before each sprint" · switch "Check with me before each sprint starts" · on "Pramaan waits for you to try and accept a sprint before the next one starts." · off "Pramaan starts the next sprint as soon as the previous one is built and checked. You can still ask for changes at any time." · disabled reasons "Change this when the project is running again." / "All planned sprints are accepted; there is no next sprint." · on 11 (gate consequence, appended) "Pramaan checks with you before each sprint starts. Change this in Settings." · on 13 (This sprint) "Then: Try sprint 1 appears here and in the top bar. Sprint 2 waits until you accept sprint 1." |
| Pass 2: milestone | 13 ready "Sprint 1 is ready to try." (Done pin line in the sprint header, then the Needs-you pin "Try sprint 1") · 14 "All planned sprints accepted." (the banner title; the five checks stitch once on the state change) |
| Pass 2: settings aside | heading "This project" · pin sentence "Working · Sprint 1 of 4 is being built." · "Monthly budget 18% used" (4px tape line) · "Settings last changed 35 minutes ago" · "Started from an idea. No original code." (todo) / hand-off "Original: your upload customer-portal.zip, received Tuesday. Read once, never changed." / lane B "Repository: test-org/insight-weaver-537. Pramaan opens pull requests there and never pushes to main." |
| Pass 2: settings your code | "The code is yours. Take a copy whenever you want." · quiet "Take a copy (.zip)" · Waiting "Export to GitHub is not available yet. Your code stays yours; take a copy any time." · lane B switch "Merge automatically when the review passes" (off) with "Off: you merge every pull request yourself." |
| Pass 2: settings delete | section "Delete this project" · "Deleting removes the private copy and every document. Your original code is never touched." (a project that brought code: hand-off lane) / "Deleting removes the private copy and every document. This cannot be undone." (a project started from an idea, which has no original code, such as todo on 16) · danger quiet "Delete this project" opening the D.16 dialog "Delete this project?" |
| Pass 2: documents rows | "Product brief" / "What the product is for and how we will know it works." · "Requirements" / "What the first version must do and must not do." · "User journey" / "What a person does in the product, step by step." · "Sprint plan" / "Which sprints build it, in what order." · advanced "System design" / "How the parts fit together." · "Data model" / "What is stored and how it relates." · "API specification" / "How the parts talk to each other." · "Test plan" / "What is checked before a sprint is ready." |
| Pass 2: decisions brief block | heading "Where your answers go" · rows "One-sentence outcome" / "The one thing this product should do." · "Evidence of the problem" / "What you told us that led to this brief." · "Success contract" / "How we will know the product works." · "Guardrails" / "Things that must not get worse while we build." · "Acceptance signal" / "The check you can run yourself to accept the result." · "Constraints and non-goals" / "What it must respect and what it will not do." · 06 collapsed line "Your 6 decisions feed all six sections." · In the 320px card the glosses are the one-line forms (at most 32 characters, RV9; the full forms above stay the reader's contents-link titles): "The one thing it should do." · "What led to this brief." · "How we will know it works." · "What must not get worse." · "A check you can run yourself." · "Its limits and what it skips." |
| Pass 2: interview finished gate | thread "Create my product brief" · sentence "Pramaan writes draft 1 from your 6 decisions. You read it before anything else happens." |
| Pass 2: locked interview | action cards "Read your decisions" / "Nothing you decided is lost." · "Request a revision" / "Pramaan drafts the change after the sprint." · "Open Build" / "See how sprint 1 is going." · below: "When this sprint is done you can:" list and "Happening in your sprint" |
| Pass 2: plan aside | heading "Plan at a glance" · rows "Sprint 1 · Your private checklist" (pin) etc. · 11 "Nothing is built until you approve." · 12 "Sprint 1 is being built. Sprint 2 starts when you accept sprint 1." · 11b heading "What Pramaan is reading" with the three accepted documents and "Pramaan is drafting your plan from these." · 14 heading "What was built" · "1 sprint · 3 features · accepted Tuesday 14:10" · "Going live is not available yet. Your accepted sprints are kept." · quiet "Take a copy (.zip)" |
| Pass 2: try it device switch | stage bar chips "Phone" · "Tablet" · "Computer" (chosen) with `aria-label="Preview width"` · the frame's Meta "390 px" / "820 px" / "Fills the stage"; when the stage is narrower than the device: "Shown at 782 px. A tablet is 820 px." |
| Pass 2: live logs title | h1 "Live logs" · title sentence "Live · 69 lines · times are UTC" · title action quiet "Pause" · filter row Level, Project, Show requests |
| Pass 2: reader head | title row: document title left, version chips right · byline under it · "Passage comments (1)" list in the contents rail: "1 · Constraints: 'I don't think this is a constraint'" |

---

## F. Coverage matrix

| Item | Reviewer point | System rule / component | Demonstrated in |
|---|---|---|---|
| S1.1 | Left panel not collapsible | C.2 rail collapse, persisted | 01-projects, flow (toggle) |
| S1.2 | New project not sticky | Law 1, top-bar thread slot (C.3) | 01-projects |
| S1.3 | Dashboard not intuitive | C.6 list layout, D.7 card leads with the next sentence, sort Needs you first, pen circle | 01-projects |
| S1.4 | Search buried | C.6: search in the title row | 01-projects |
| S1.5 | Hero too big | Law 4, C.4 no hero, no eyebrow | 01-projects |
| S1.6 | Build-it-for-me buried | C.6: entry-point row directly under the title | 01-projects |
| S2.1 | Overview top too airy | C.4 title row 28px, banner within 140px, digits at y < 260 | 03-overview-decision |
| S2.2 | Continue-interview secondary | Law 1: thread in the top bar and in the banner (one element, D.14 rule) | 03-overview-decision |
| S2.3 | Metric cards weak | D.8 engraved digits with sentences | 03, 04-overview-paused |
| S3.1 | Form white space | C.6 Task archetype 560px centred | 02-new-project |
| S3.2 | Explainer box too big | E: one hint sentence under the h1 | 02-new-project |
| S3.3 | Start button weak; too many steps | Law 1 thread "Start the interview"; one form, name + idea only, no classify step shown (D.11 Working state covers the wait) | 02-new-project |
| S4.1 | Interview header white space | C.4: no h1 sentence on the workbench; chat header 48px | 05-interview-running |
| S4.2 | Chat not dominant | D.11 thread fills `1fr` of the viewport | 05 |
| S4.3 | Inner scroll in page scroll | Law 2, C.5 workbench | 05 |
| S4.4 | Questions/Submit not prominent | D.11 question card docked as last item + thread Submit | 05 |
| S4.5 | Working brief too big | D.11 decisions panel compact rows 46px | 05, 06 |
| S4.6 | Reply box after two scrolls | D.11 composer docked | 05 |
| S4.7 | Create brief at the bottom | D.11 finished state: thread in the top bar the moment the interview ends | 06-interview-finished |
| S4.8 | Decisions list grows without limit | D.11 panel viewport-sized, collapsed rows | 05, 06 |
| S5.1 | Header white space, heading wraps | C.4 one h1 "Documents", project name in breadcrumb | 08-documents |
| S5.2 | Journey bar unclear | D.3 tape with done/current/upcoming/locked and the pin | all project screens |
| S5.3 | Status/version unclear | D.9 columns Status (pin + sentence) and Version | 08-documents |
| S5.4 | No back button | C.3 Back | all |
| S5.5 | Hard to return from a doc | C.3 breadcrumb with Documents link + Back | 09, 10 |
| S6.1 | Back from the brief | C.3 | 09-document-draft |
| S6.2 | Accept at the bottom | D.10 sticky Action Bar with the thread | 09 |
| S7.1 | No approve CTA visible | D.14 gate at top + top-bar slot | 11-roadmap-awaiting |
| S7.2 | No next step after a sprint; chips and arrows | D.12 route with "Then:" lines and terminal node | 11, 12 |
| S7.3 | Top-right empty | Law 1 slot never empty | all |
| S8 (observed) | Thin bar, empty card, three equal buttons | D.13 header progress, activity feed, one thread + quiet | 13-sprints-building, 14-sprints-accepted |
| S9.1 | Checklist fills the page | D.15 side panel | 15-try-it |
| S9.2 | Preview at the bottom, fixed height | D.15 stage at viewport height | 15 |
| A1 | No sticky header | C.3 sticky top bar | all |
| A2 | Sections clipped | C.5 and D.10 sticky section headers masked (opaque raised background extended up to the action bar, hairline, no fade) so text never shows between the bar and a stuck heading; scroll-padding matches the sticky top | 09, 10, 11, 17 |
| A3 | Sidebar taller than window | C.2 height budget 561px, no scrollbar | all |
| A4 | Nested scroll | Law 2 | 05, 17 |
| A5 | No in-page nav | D.10 contents rail with nested Advanced sections and a scroll-spy that skips closed sections | 09, 10 |
| A6 | Chips wrap badly | D.12 route | 11, 12 |
| A7 | Wide tables squeezed | D.9 wide-table rule | 09 |
| A8 | Preview fixed height | D.15 | 15 |
| Interview locked | Near-empty, wrong tape step, no revision path | D.11 locked, D.16 locked state, D.3 state-driven pin | 07-interview-locked |
| Sprints accepted | Three equal buttons, no next action | D.13 all-accepted | 14 |
| Settings | Disabled without reason, unequal columns, title cut | D.17 save pattern, one column, sticky bar | 16-settings |
| Live logs | Dense, ids, nested scroll, title cut | D.17 log viewer: plain rows (time, event in plain words, project); event codes, ids with copy, level and raw line under each row's Details; the list is the one scroller; Law 5 | 17-live-logs |
| B1 | Cards not clickable | D.7 whole card is the link | 01 |
| B2 | Journey not clickable | D.3 links | all |
| B3 | Six phrasings | D.5 fixed vocabulary + mapping | 01, 08, 11, 13 |
| B4 | Count ignores filter | C.6 count rule | 01 (search state in flow) |
| Theme: CTA buried | Law 1 | all |
| Theme: white space, headers | Law 4, C.4 | all |
| Theme: main job not focus | Law 4, C.6 archetypes | 05, 09, 15, 08, 03, 02 |
| Theme: navigation | Law 3 | all |
| Theme: extra scrolling | Law 2 | 05, 09, 11, 15 |
| Extra 1 | Two stacked headings | C.4 | all project screens |
| Extra 2 | 95% vs 3/3 | D.13 progress = features ready / planned, no percent | 13 |
| Extra 3 | Four tinted surfaces with no rule | D.6 tint = status only | all |
| Extra 4 | Green number under Paused | D.8 paused state sentence | 04-overview-paused |
| S2 paused | Paused overview gave no next step | Law 1: the founder is needed, so the Paused banner is the gate and owns the one thread "Raise the budget"; the slot shows "Budget used up." while the banner is in view and takes the thread once it scrolls under the bar (D.14 rule, E) | 04-overview-paused |
| Extra 5 | Repo path in the first viewport | D.6 Details disclosure | 03 |
| Extra 6 | Budget in tokens | D.8 percent first; D.17 budget field "Monthly limit" in "million units", tokens only under Details; Law 5 | 03, 16-settings |
| Extra 7 | Two primary colours | D.1 one thread, one ink, quiet | all |
| Extra 8 | Monitoring shown as a status | D.5 mapping: no pin; Settings only | 01, 16 |
| Decision history | Interview decisions auto-saved and editable; chat and brief equal panes (D.11 uses 1fr + 320, the brief being compact by the CEO's later feedback that it took too much space); technical docs behind a disclosure; explicit approval gate; feature board kept; compact UAT; monitoring in Settings | D.11, D.9, D.14, D.13, D.15, D.17 | 05, 08, 11, 13, 15, 16 |
| W-F1 | Documents: 1192x496 blank under a 4-row table | Law 6; P.2 F1: two-line rows with each document's plain purpose, advanced group open when every founder document is Done | 08 |
| W-F2 | Empty interview: blank chat and empty decisions panel | Law 6; P.2 F2: first question card in the thread, the product idea as the first saved decision, fitted decisions card with "Where your answers go" | 05b |
| W-F3 | New project: blank lower half, form island | Law 6; P.2 F3: Task with aside (form 560 + "What happens next"), lane switcher, 10-row textarea, "What Pramaan does with this" | 02 |
| W-F4 | Settings: empty right column, whole page | Law 6; P.2 F4: Settings with aside ("This project" facts), Save beside the limit field, "Before each sprint" and "Delete this project" sections | 16 |
| W-F5 | Interview locked: half-empty card, lower 40% blank | Law 6; P.2 F5: three action cards in a row, "When this sprint is done" list and the activity feed under the locked card, fitted decisions card | 07 |
| W-F6 | Interview running: empty decisions panel, half-empty question card | Law 6; P.2 F6: two-column question card above 640px, fitted decisions card with the brief block | 05 |
| W-F7 | Try it: unused stage under a short mock app, gap under the checklist | Law 6; P.2 F7: device-width switch and frame, checklist foot follows the items, the iframe interior is the customer's app (allowlisted) | 15 |
| W-F8 | Roadmap: empty 360px column beside the route down the whole page | Law 6; P.2 F8: Plan with aside, sticky fitted "Plan at a glance" with jump links and the gate's consequence | 11, 12 |
| W-F9 | Build: short side panel in a 540px column, top-right pocket at 1142 | Law 6; P.2 F9: `.pm-arch-build` container query (side panel beside the head at both rail widths), activity feed under the side panel | 13, 13b |
| W-F10 | Roadmap drafting: blank under three skeleton cards | Law 6; P.2 F10: full-height skeleton cards, aside "What Pramaan is reading" | 11b |
| W-F11 | Interview finished: blank under the Done note | Law 6; P.2 F11: the Create-my-brief gate inside the thread (one thread via D.14), fitted decisions card | 06 |
| W-F12 | Sprints accepted: blank column beside the sprint card | Law 6; P.2 F12: aside "What was built" with the live-site sentence and Take a copy | 14 |
| W-F13 | Overview: left column ends 250px above the right one, page-end strip | Law 6; P.4.3 bento tiles (lead, three digit tiles, next, info) | 03, 04 |
| W-F14 | Reader: hole right of the document title, blank under the contents rail | Law 6; P.2 F14: version chips on the title row, passage comments listed in the contents rail | 09, 10 |
| W-F15 | Live logs: 128px band between the filters and Pause | Law 6 (under threshold); P.2 F15: count sentence and Pause move to the title row | 17 |
| W-F16 | Projects at 1440: strip under the 3x3 grid | Law 6: a page-end tail under 240px is breathing room; no change | 01 |
| L-1 | Three entry points were dead-end links | Ruling 13; C.6 entry row; P.3.2 lane switcher | 01, 02, 18, 21 |
| L-2 | Lane A: bring code by .zip or GitHub, read once, never written back | P.3.3 (18, 18b), copy-flow diagram that follows the form | 18, 18b |
| L-3 | Lane A: honest failure states with one next action | Ruling 15; P.3.3 (18c too big, 18d not a zip, 18e permission) | 18c, 18d, 18e |
| L-4 | Lane A: copying in progress, then requirements | P.3.3 (19 bento overview with steps, 20 document or interview), join rules P.3.5 | 19, 20 |
| L-5 | Lane B: choose and connect a repository with the App check result | P.3.4 (21 Done, 21b Blocked, 21c empty), verbatim safeguards | 21, 21b, 21c |
| L-6 | Lane B: the request loop with fixed pins | P.3.4 request list, composer, request row pins and measure | 22, 22b |
| L-7 | Lane B: what Pramaan did, what stays with you, never the default branch | P.3.4 request detail, the request tape | 23, 23b |
| L-8 | Founder vocabulary on lane A, engineering vocabulary on lane B | Ruling 14; P.3.6 | 18 to 23 |
| T-1 | Dictation in the composer (trend: voice, adapted) | P.4.1 `.pm-dictate` states idle, listening, done, unavailable, error | 05, 05b, 06, 20, 22, 22b |
| T-2 | One plain autonomy setting (trend: autonomy gradients, adapted) | P.4.2 "Before each sprint" switch with consequence and disabled reason; consequence lines on the gate and the sprint strip | 16, 11, 13 |
| T-3 | Bento overview (trend: bento, adapted) | P.4.3 importance-sized tiles in reading order, One Thread kept | 03, 04, 19 |
| T-4 | Quiet milestone moment (trend: emotional design, adapted) | P.4.4 the tape's checks stitch shut once, one line, reduced motion respected, no confetti | 13 (ready state), 14, flow |

---

## G. Three out-of-the-box moves

### G.1 The live tape (where you are, measured)

The tape is not a stepper; it is a measure. Each step's tick carries sub-progress ticks (`data-progress`), the pin sits on the real stage, and the step's accessible name reads the measure ("Documents, 2 of 3 accepted"). On the project overview the same tape is printed large (Digits size for the step numbers, 640px wide, the only place it grows) directly under the title row, with the pin's shank extended down into the next-decision banner so the eye reads: here is where you are, this is the thread to pull. Build: `.pm-tape` with `data-stage`, `data-progress` attributes; 30 lines of JS position the pin (`translateX`) from the current step's offset; `.pm-tape--large` modifier on the overview. Guards: no animation on load; the large tape never appears on any other screen, and the overview's top bar carries no compact tape (one tape per screen). The large tape costs height: at 1142x732 the overview page scrolls at most about 26px, which is accepted.

### G.2 The Nothing-is-lost strip

A 28px hairline strip under the top bar on every project screen (C.1): "Last saved: your decision 'First turn', 14:10 · Last accepted: Product brief draft 1, Tuesday" with a quiet "History" link that opens a popover listing the last 8 saved or accepted things with "Open" links. It answers the founder's real fear (did my work disappear when I closed the tab?) with facts the system already has (timestamps of saves and acceptances). It never invents; if nothing is saved yet it reads "Nothing saved yet. Your first answer is kept the moment you send it." Build: static `.pm-strip` with two `<time>` elements and a popover; on the flow prototype, sending a chat reply updates the "Last saved" time via JS.

### G.3 Your words on the plan (chalk marks) and the verdict checklist

A "Show my words" switch in the roadmap and try-it title rows. When on, each sprint outcome and each checklist item shows a chalk mark: a chalk-tint block (Meta, chalk text) quoting the founder's own interview sentence that motivated it ("You said: 'users see only their own tasks'"), with an "Edit that decision" ghost link back to the interview decision. The founder judges the plan and the built product against their own words, and drift between what was said and what was built becomes visible. The checklist verdicts (Yes / Not quite / Confusing, D.15) turn "trying it" into a guided review whose answers become the "Ask for changes (n)" thread. Build: `data-said` attributes on outcomes and items; the switch toggles `[data-words="on"]` on the page; state persists in `localStorage["pm.words"]`. Guard: quotes come only from saved decisions (in the static proposals, from the ui test and todo interview text visible in the captures); nothing paraphrased is shown as a quote.

---

## H. Non-goals and risks

Non-goals: mobile and tablet layouts (basic do-not-break only: at < 1024 the rail collapses and the panel stacks below); the marketing site; the dependency monitoring view beyond its Settings entry; icon illustration style beyond the 1.5px stroke set; live data (all proposals are static); changing route structure or the wire vocabulary.

Risks and guards:

1. **The canary reads as a warning colour.** Guard: the thread is always a filled button with ink text and an ink border, never a stripe, ring or tint; status "Paused" uses clay (orange-brown), never yellow; there is no amber anywhere else.
2. **The tailor's world tips into costume** (stitches, pins, chalk everywhere). Guard: each carrier has one function and one place (stitch = seams, pin = status and you-are-here, chalk = annotation and active marker, tape = journey and progress); no textures, no hand-drawn jitter, no fabric backgrounds, no tailoring words in copy. The finish reviewer checks for any carrier used decoratively.
3. **The ink rail plus a light content area looks heavy at 1142.** Guard: below 1280px the default rail is the 64px icon rail on every screen (one state, Ruling 7), so content gets 1030px; wordmark and icons are ink-100 on ink-900, no gradients, no illustration in the rail.
4. **One family for everything can feel flat.** Guard: Reading at 17/28 versus Body 15/22 gives documents and chat a distinct voice; weights 600 for titles and 500 for labels; engraved digits at 28/600 tabular carry the only "display" moments.
5. **The Nothing-is-lost strip and the large tape eat vertical space** (28px + 64px on the overview). Guard: the strip is 28px on all project screens and absent elsewhere; the large tape exists only on the overview where the main job (the decision) still starts by y = 140 + 64 = 204 at most and the digits are above the fold.
6. **Verdict checklist adds three buttons per item.** Guard: 28px quiet toggles; keyboard 1/2/3 within a focused item; the panel width 320 holds them on one row (3 x 88 + 2 x 8 = 280).
7. **A collapsed default rail could feel like losing navigation.** Guard: the collapsed rail keeps icons, an accessible name and a visible tooltip on every control, the pen circle, the project tile and the breadcrumb section label; the toggle is labelled "Expand navigation" and `[`; the user's choice is remembered for every screen and never overridden by a screen.
8. **Contrast of chalk marks on the sunken surface.** Guard: chalk text (chalk-700) on chalk-100 at 7.07:1 and never on sunken ink-100 (unchecked pair, so it is forbidden).
9. **The One Thread rule with two visible copies (top bar and action bar).** Guard: D.14's IntersectionObserver hides one; the automated check counts visible `[data-thread]` elements and fails the build on 2.
10. **Dark theme is secondary.** Guard: every pair in B.2 is verified for dark; documents default to light; dark is a user toggle in the user menu, persisted in `localStorage["pm.theme"]`.

---

## P. PASS 2 (2026-09-30): dead space, the two lanes, four trend items

Authoritative for pass 2. Builders follow the numbers here literally. Where this part and an older section disagree, this part wins (Rulings 9 to 16). Section map: P.1 Law 6 and its tool · P.2 the per-finding decisions for the 20 shipped screens · P.3 the lanes (persona, entries, Lane A, Lane B, journey rules, vocabulary) · P.4 the four trend items · P.5 new shared components and archetypes (what goes in `components-c.css`, `shell.css`, `components.js`) · P.6 decisions and open questions (CEO) · P.7 PRODUCT.md lines for the controller · P.8 documentation tasks (system.html, flow, README, DESIGN.md).

### P.1 Law 6: No Dead Space

**Rule.** See A.3 row 6. In one sentence: on the first viewport nothing empty is 240 by 160 or larger inside the content box, the top-right corner is never an empty 240 by 120, and no scroll holds an empty 240 by 240 or a tail taller than 240; breathing room is enumerated, not argued.

**Why these numbers.** They come from the measured audit (`scratchpad/whitespace-report.md`, method: 8px cells, ground colours sampled from the page, maximal empty rectangles). The class-1 (intentional) items in that audit are all under the thresholds: the 336x128 pocket beside the large tape (03), the 832x128 thread rest above the composer (05), the 248x144 pocket beside a short founder message (06), the 400x136 review-only switch (13), the 536x128 band beside the log filters (17), the 1192x224 end-of-list strip on 01 at 1440 (a page-end tail under 240). Every class-2 finding (F1 to F14) is over them at at least one viewport. A 320px side panel's empty interior measures 312px at 1142 and 352px at 1440, so the width floor is 240 and the same defect fails at both sizes.

**The tool.** `tools/whitespace.mjs` (shipped in pass 2, path-relative, the same Chrome and playwright discovery as `shoot.mjs`). Run from anywhere: `node docs/design-system/tools/whitespace.mjs [files] [--rail expanded|collapsed] [--quiet]`; with no files it takes every `screens/*.html` except `_skeleton`. It renders at 1142x732 and 1440x900 with animations frozen, `pm.railhint=1`, `pm.theme=light`, `pm.rail` unset. It prints one line per screen and viewport, each violation with its rule, size, position and the DOM boxes inside and around it, writes `shots/whitespace/<screen>-<vw>-first.png`, `-first-annot.png` (red = violation, blue = classified breathing room) and `-scroll-annot.png`, plus `shots/whitespace/report.json`, and ends with `<n> failing`; exit code 1 when n > 0. Thresholds are the exported constants `FIRST {240,160}`, `CORNER {240,120}`, `SCROLL {240,240}`, `TAIL_MAX 240`; the allowlist is the exported constant `ALLOW`:

| selector | where | cap | why |
|---|---|---|---|
| `.pm-arch-task, .pm-arch-task2` | sides | none | a deliberately centred single column (retired, Ruling 12; kept for a future plain form), and the centred Task-with-aside block that P.1 permits ("centring only for the Task-with-aside block"): its side margins, measured from the union of its tracks |
| `.pm-chat-flow` | below, `column: ".pm-chat-thread"` | 320px | the thread rest between the last message and the composer |
| `.pm-panel--fit, .pm-toc` | below, `gutter: 32`, `lastColumn` | none | the column under a fitted side panel or the contents rail |
| `.pm-stage-body iframe` | inside | none | the preview is the customer's app, not ours |

"below" starts at the element's last rendered child, so a panel's own bottom padding is not a loophole. A page-end tail (touching the bottom of a page that does not scroll, or the end of a scroller's content) is breathing room up to 240px. Nothing else is exempt. Adding an entry needs a ruling in this file; the reviewer of the final pass (RV11) checks that `ALLOW` still has exactly these four rows.

**Measurement tolerances (RV9 calibration, 2026-09-30; the thresholds above are unchanged).** They make the four rows measure what they say, on the 8px cell grid: (T1) a "below" rectangle may start up to one cell (8px) above the last child's bottom (cell rounding; the tool stores `lastBottom = last child bottom - 4` and accepts `top >= lastBottom - 4`); (T2) the fitted panel and contents rail row accepts a rectangle whose left edge is at most 32px left of the element and whose right edge is at most 32px right of it (`gutter: 32` = the 24px grid gutter that belongs to the same empty column, plus one cell of rounding), so the empty column under a right-hand fitted aside (plan aside, 11 to 12) and under the left-hand contents rail (09, 10) is recognised at both viewports; (T3) the chat row's rest may span the chat column (`column: ".pm-chat-thread"`: the scroller that holds the 720px flow, whose side margins beside the last message are part of the same rest) and must end at that column's bottom edge, so the composer under it is always counted as real content and the rest is at most 320px tall. (T4, RV8 request) A fitted panel that is the last column of its grid owns the remainder to the grid's right edge (`lastColumn`: a left-aligned grid such as `.pm-arch-settings2` leaves one), still only under the panel's last child. (T5) Text fields are content even while empty (P.1 prescribes a larger main job such as a 10-row textarea): the boxes of visible `textarea`, `select` and text `input` elements are masked like sticky elements, so their interior is never ground; so is a designed empty state (`.pm-empty`, D.16: 01, 21c, 22b), which is the screen's content when there is nothing to list (RV10). Every other rectangle is judged as before; `ALLOW` still has four rows.

**Calibration on the shipped pass-1 screens (2026-09-30):** 40 checks, 27 failing; clean: 01, 03, 15 (the iframe allowance), 17, and 11, 11b, 12, 14 at 1142 only (their empty column is 224px after the gutter, under the floor; the pass-2 fixes apply at both viewports anyway). After pass 2 the run must end `40 + 28 checks, 0 failing` (20 old screens plus 14 new ones, two viewports each).

**How space is absorbed (the only permitted moves).** A meaningful supporting panel that states facts the system already has (plan at a glance, this project, what was built, where your answers go); a larger main job (two-line rows, a 10-row textarea, full-height skeletons); a next-step panel (what happens next); previews of real content (the first sentence of a document, the request text); better-fitted containers (fitted cards, two-column question card, the side panel beside the head); centring only for the Task-with-aside block. Forbidden: filler sentences, invented statistics, tips, illustrations, "did you know", stretched tables, larger type.

### P.2 The per-finding decisions (screens 01 to 17, 05b, 11b, 13b)

Each entry: what absorbs the space or what shrinks; the exact layout numbers; which WP owns it. All page-specific `<style>` blocks stay under 40 lines and tokens only; anything reusable moves to `components-c.css` (P.5).

**F1 · 08 Documents (WP11).** The table becomes two-line rows, `.pm-table--two-line`: row height 64 (12 + 22 title + 16 Meta purpose + 14), the first cell holds the row link (Body 500) and under it the document's plain purpose in Meta muted (copy in E, "Pass 2: documents rows"). Columns unchanged (Status 380, Version 140, Updated). The advanced disclosure `details.pm-adv` is `open` when every founder document is Done and nothing on the list needs the founder (the todo state); it is closed when any founder document is Needs you. Its summary keeps "Review advanced technical documents (4)"; its rows are two-line too. Heights at 1440: title 56 + table 40 + 4x64 + 24 + summary 28 + 8 + table 40 + 4x64 = 708 from y 84, ending at 792; the 108px tail is breathing room. At 1142 the page scrolls about 60px (one scroller, fine). No right panel: the list is the job.

**F2 · 05b Interview, just started (WP12).** Three moves. (1) The product idea typed on the new-project form is the first saved decision (it already is on 03's strip for the same project), so the decisions list shows "Product idea · a tic tac toe game" (65px row) and the count "1 of about 6 saved"; the strip reads "Last saved: your decision "Product idea", Sunday · Nothing accepted yet". (2) The first Pramaan message is followed by the question card for the first topic (D.11 question card: Q1 "Who plays?" radios with the three fixture options, Q2 "What happens when someone wins?" short text; the card's Submit is the thread and the composer's Send is quiet, as on 05); the card uses the two-column layout of F6. (3) The decisions panel is a fitted card (`.pm-decisions.pm-panel--fit`, Ruling 10) with, under the list, the block `.pm-decisions-brief` "Where your answers go" (P.5.6) listing the product brief's six founder sections, none ticked. The thread rest under the card is at most 320px at 1440 (allowlisted). Rail, tape and slot unchanged.

**F3 · 02 New project (WP11).** 02 is the "Describe your idea" lane. Layout `.pm-arch-task2` (P.5.1): left column 560 (form), right aside 320 fitted. Under the title row, the lane switcher `.pm-lanes` (P.3.2, current "Describe your idea"). Form: "Product name" input; "What you want built" textarea `rows="10"` (Reading size, 10 x 28 + 24 = 304px); its helper; then a compact list `.pm-ticks` "What Pramaan does with this": three items (E, "Pass 2: 02 title"); then the consequence sentence. Aside `.pm-tile pm-panel--fit`: heading "What happens next" and the four-step list used on the overview (Interview, Documents, Roadmap, Build with their sentences from 03's `ov-next`). Thread unchanged ("Start the interview", enabled). Column heights at 1440: form about 700 → tail 116; at 1142 the page scrolls about 40px.

**F4 · 16 Settings (WP11).** Layout `.pm-arch-settings2` (P.5.1): left 720 max, right aside 320 fitted and sticky (`.pm-panel--fit`). Left sections in this order, each a `.st-section` with a stitch between: Project name (as now) · Monthly budget: one row `.st-row` holding label "Monthly limit", the 96px field, "million units", the quiet "Save budget" and its reason, so the save row no longer sits under the field; the helper and Details under the row · **Before each sprint** (P.4.2, the autonomy switch, on) · Dependency monitoring (as now) · Your code: sentence, quiet "Take a copy (.zip)", the Waiting export sentence, and the lane fact line (E, "Pass 2: settings aside" third item is the aside's; here only the button and sentences) · **Delete this project** (E, "Pass 2: settings delete"): one sentence and a `.pm-btn--danger` quiet button that opens the D.16 dialog (static: `<dialog>` present, closed). Right aside `.pm-tile pm-panel--fit` "This project": pin + sentence, the budget line with a 4px tape line (the rail's `.pm-rail-track` drawn in page colours: `.pm-meter`, P.5.9), "Settings last changed 35 minutes ago", the origin line ("Started from an idea. No original code."). The corner is occupied by the aside; the 912x224 pocket is gone because Save sits on the field's row.

**F5 · 07 Interview locked (WP12).** Left column (the `.pm-arch-overview` grid stays; the aside becomes `.pm-panel--fit`): the locked card `.pm-locked` keeps its pin and heading; the three "You can still" items become `.pm-actioncards` (P.5.8): three equal cards in a row (each: Label link + Meta sentence, 88px tall), so the card's right half is used. Under the card, two blocks that state why it is locked: `.pm-thissprint` "When this sprint is done you can:" (the three outcomes from 13's strip and its "Then:" line) and the activity feed `.pm-activity` (the three fixture entries) side by side in a two-column row (`grid-template-columns: 1fr 1fr; gap 24`). Left column height at 1440 about 600; the tail is under 240. The decisions card lists todo's four decisions read-only plus the Locked line.

**F6 · 05 Interview running (WP12).** Question card: `.pm-qcard-body` becomes a two-column grid when the card is wider than 640px (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); column-gap: 24`), so Q1's radios and Q2's text field sit side by side; the card's title spans both columns; the footer unchanged. Decisions panel: `.pm-panel--fit` with the brief block; "One-sentence outcome" ticked (the product idea feeds it). The 504x144 pocket beside the founder's short message stays (under threshold: founder messages keep `max-width: 60%`).

**F7 · 15 Try it (WP13).** Stage bar gains the device switch `.pm-device-switch` (three chips, Computer chosen) at its centre; `.pm-stage-body` centres a `.pm-device` frame: Computer = the iframe fills the stage (as now); Phone = 390px wide frame, Tablet = 820px, both centred with a 1px control-border frame, 10px radius and a Meta caption under the frame ("390 px"). The iframe is the customer's app and its interior is allowlisted; the frame chips are real product value (the sprint is "Calculator on every device"). Checklist: the foot follows the items (`.pm-checklist { grid-template-rows: auto auto auto }`, foot not pinned) and the panel is `.pm-panel--fit` inside the stage archetype (edge-to-edge column keeps its hairline; the card sits with 16px inset). The thread stays in the foot.

**F8 · 11 and 12 Roadmap (WP13).** Layout `.pm-arch-plan2` (P.5.1): route column 760 max + aside 320 (360 at 1440). The gate bar stays full width and sticky above the grid. Aside `.pm-plan-aside pm-panel--fit` sticky at `top: calc(var(--pm-topbar-h) + var(--pm-gate-h, 0px) + 16px)`: heading "Plan at a glance"; one 40px row per sprint (number in `.pm-tnum`, name, pin), each a link to the node's id; the row of the sprint in view is marked like the reader's contents (2px ink bar, weight 600; the scroll spy of components.js section 7 generalised to `[data-spy]`); under the list the consequence sentence (E, "Pass 2: plan aside") and the autonomy line (P.4.2). The scroll pass sees the aside masked (sticky), so the column no longer counts as a tail.

**F9 · 13 and 13b Build (WP13).** The page grid moves into `shell.css` as `.pm-arch-build` with a container query on `.pm-content` (P.5.1): two columns (`minmax(0,1fr) 320px`, areas "main side" / "main act") whenever the content box is at least 1000px wide (true at 1142 with the collapsed rail and at 1440 either way; single column with the rail expanded at 1142), so the "This sprint" strip sits beside the sprint head at both viewports and the top-right pocket goes. The activity feed moves into the side column under the strip (area `act` is in the side column: areas "main side" / "main act" with the side column `align-content: start`). Both side blocks are fitted cards. The review-only variant switch shrinks to one line (`.pm-review-only` inline with the digits row, chips 24px). The ready state (the switch's second position) carries the milestone (P.4.4).

**F10 · 11b Roadmap, drafting (WP13).** Same `.pm-arch-plan2`. Skeleton route: three nodes, each card the height of a real route card (`.pm-route-card--skeleton`: 6 skeleton bars: title 40%, four outcome lines 90/85/88/80%, one try block 100% at 44px; card about 232px), so the column is as tall as the plan will be. Aside "What Pramaan is reading": the three accepted documents (Done pins, "accepted Tuesday") and the sentence "Pramaan is drafting your plan from these." with the Working pin; under it "What you do next: read the plan and approve it. Nothing is built until you do."

**F11 · 06 Interview finished (WP12).** Inside the thread, after the last Pramaan message, the Done note becomes a `data-gate` block `.pm-chat-done` with the thread "Create my product brief" (40px) and the sentence from E; the top-bar copy carries `data-thread hidden` and the D.14 observer shows it only when the block scrolls out (in a thread that rests at its bottom it stays hidden). Composer Send stays quiet. Decisions: fitted card; the brief block collapses to one Done line (E). The thread rest is under 320.

**F12 · 14 Sprints accepted (WP13).** `.pm-arch-plan2` again: the Done node card left; aside "What was built" (`.pm-plan-aside pm-panel--fit`): the three facts (E), the Live-site sentence moved here as a Waiting line (the bottom info callout is removed), quiet "Take a copy (.zip)" (the banner keeps only the thread "Open your product"; D.13's second quiet moves to the aside). The board "What was built in sprint 1" spans the full width under the grid. The 14 milestone: the five tape checks are the end state; the stitch plays only when the flow reaches 14 from 15 (P.4.4).

**F13 · 03 and 04 Overview (WP11).** The bento (P.4.3) replaces `.pm-arch-overview`, `ov-left` and `ov-next`. Tiles in DOM order: lead (the existing banner, `data-gate`, spans three columns), Documents digit, Sprints digit, Budget digit, "What happens next" (spans two), info tile (workspace facts with Details; on 04 the same). The Details disclosure with the budget total sits inside the Budget tile. Heights: lead 104 to 120, digit tiles 120, row three about 240; total under 620 at 1440 so the page-end tail stays under 240; at 1142 the page scrolls about 30px as before.

**F14 · 09 and 10 Reader (WP12).** `.pm-doc-head` (P.5.10): a title row with the document title left and the version chips right-aligned on the same line, the byline under it with the Details link inline; the hole right of the title becomes a 464x72 band (under threshold). Contents rail: "Passage comments (1)" becomes a list `.pm-toc-comments` under the links: each comment as "1 · Constraints: 'I don't think this is a constraint'" (Meta, link to the mark); on 10 the list reads "No passage comments." The rail is allowlisted below.

**F15 · 17 Live logs (WP11).** The title row takes the count sentence as its title sentence ("Live · 69 lines · times are UTC", the `.pm-log-count` element moves there with its live updates) and the quiet "Pause" as its one title action; the filter row keeps Level, Project and Show requests. The list starts 56px higher. (Under threshold already; this is the reviewer's "top right" spot, so it is fixed anyway.)

**F16 · 01 Projects (WP11).** No dead-space change (tail under 240). The entry row becomes three real entries (Ruling 13), and the insight-weaver-537 card becomes the Lane B fixture project: Needs you, "Merge 'Let admins archive old workspaces' (pull request #42).", meta "4 requests · 1 merged · Updated 2 hours ago", link to 22; it moves into the Needs-you group (the pen circle stays on "test").

### P.3 The two lanes

#### P.3.1 Personas and the three lanes

| Lane | Entry on 01 | Audience | Sentence (verbatim from the live build) | First screen |
|---|---|---|---|---|
| Describe your idea | "Start a new product" | the founder (PRODUCT.md) | Describe your idea. Pramaan builds it, and you try it every sprint. | 02 |
| Hand off your code (Lane A) | "Hand off your code" | the founder who already has code (an agency built it, a co-founder left, a no-code tool exported it) | Upload it or import it from GitHub. Pramaan takes it from there, and you can take a copy back any time. | 18 |
| Work in my repository (Lane B) | "Work in my repository", labelled "For engineering teams" | an engineering team member: owns a repository, reviews pull requests, merges and deploys; plain literal voice, not a founder | Request features in a repository you own. Pramaan opens reviewed pull requests; you merge and deploy. | 21 |

Write rules, stated on the screens verbatim: Lane A: "Pramaan never writes back to where the code came from." Lane B: "Pramaan never pushes to your default branch." They are opposite by design (P.6, D-P2-2).

#### P.3.2 Entries and the lane switcher

01: the 44px entry row (C.6) holds three quiet link-buttons: "Start a new product" → `02-new-project.html`, "Hand off your code" → `18-handoff-source.html`, then a 16px gap, a Meta label "For engineering teams", and "Work in my repository" → `21-repo-connect.html`. Each link's `title` is its sentence from P.3.1.

`.pm-lanes` (P.5.2), shown directly under the title row on 02, 18 (and its states) and 21 (and its states): a 44px row of three chips (28px, Label): "Describe your idea", "Hand off your code", Meta "For engineering teams" + "Work in my repository". The current lane is the ink-filled chip with `aria-current="page"`; the others are links. It is navigation, never the thread. Between lanes the typed form is not kept (a note in the flow's Journey panel only).

#### P.3.3 Lane A screens (files, layout, states)

All Lane A form screens use `.pm-arch-task2` (form left 560, fitted aside right 320), the list-level rail (All projects + Live logs, as 02), breadcrumb "Projects / Hand off your code", Back to Projects, no tape, no strip.

**18 `18-handoff-source.html` (upload, ready).** Title h1 "Hand off your code" + sentence (E). Lane switcher. Form `#pm-job`: fieldset "Where is your code?" as two `.pm-choice` radio cards (P.5.3) side by side: "Upload a .zip" (checked) with Meta "No GitHub account needed."; "Import from GitHub" with Meta "Pramaan reads it once. Your repository is never changed." Then `.pm-file` (P.5.4) "Your code (.zip, up to 200 MB)": a quiet "Choose a file" button, the chosen name "customer-portal.zip · 38 MB" beside it; "Project name" input "Customer portal"; "What it does (optional)" textarea 3 rows; the consequence sentence (Meta); a closed Details with the two verbatim limit sentences. Aside `.pm-copyflow` (P.5.5): heading, box 1 "Your upload" showing the file, box 2 "Pramaan's private copy", the sentence and the Details. Slot: sentence "Your code is read once." + thread "Create private working copy" (enabled: a file is chosen). Behaviour (components.js section 10): choosing a file writes its name and size into box 1 and enables the thread; switching the radio to GitHub swaps the file field for the GitHub block of 18b (both blocks exist in the markup; one is `hidden`) and box 1's label to "GitHub".

**18b `18b-handoff-github.html`.** Same page, radio "Import from GitHub" checked, the GitHub block shown: an account row (Done pin "Connected as Aditya Choudhary", quiet "Use another account"); field "Pick the code to bring": a `.pm-choice-list` (P.5.3) of four rows (E), the first chosen, one marked "already a Pramaan project" and `aria-disabled` with that reason; helper sentence verbatim. Box 1 "GitHub / studio-demo/customer-portal / Read only · unchanged". Thread enabled.

**18c `18c-handoff-too-big.html`.** As 18 with the file "customer-portal.zip · 312 MB": the file field in its error state (D.17: blocked border, helper with the Blocked pin and the sentence from E), the one next action is the file button itself relabelled "Choose another file". `main[data-thread-none="blocked"]`; slot: Blocked pin + "Choose a file under 200 MB."; the button quiet, `aria-disabled`, reason beside it (Ruling 15). Box 1 shows the file name with a Blocked chip "Too big".

**18d `18d-handoff-not-zip.html`.** As 18c with "customer-portal.rar" and the not-a-zip sentences.

**18e `18e-handoff-github-permission.html`.** As 18b before permission: account row with the Needs-you pin "GitHub needs your permission first." and the sentence; the list replaced by a Waiting line with the reason (E); the thread is "Give permission on GitHub" (an `<a>` to `#`, the founder's next decision), and "Create private working copy" is a quiet disabled button with reason "Give permission first." Box 1 "GitHub / Not connected yet".

**19 `19-handoff-copying.html`.** The project exists ("Customer portal", Working). Project rail: project block + the eight destinations, Overview active; Interview, Documents, Roadmap, Build and Try it carry `data-locked` with the tooltip "Opens when your private copy is ready" (Law 3: still links). Breadcrumb "Projects / Customer portal / Overview"; strip "Nothing saved yet. Your code is being copied. · History". Top bar: no compact tape (overview rule); the large tape under the title with Interview current and no progress ticks, the others upcoming, Try it locked; the tape note "Your private copy comes first." Bento (P.4.3): lead tile Working (no thread, `main[data-thread-none="working"]`, slot "Working · Copying your code.") holding `.pm-steps` (P.5.7) with the three steps from E; Documents digit "0 / 3 · Come after the interview."; Sprints digit none "No sprints yet."; Budget "0 % · Resets 1 October."; next tile "What happens next" (E); info tile = `.pm-copyflow` in its in-progress state with "Your original code stays unchanged." and Details "Private copy: pramaan-build/customer-portal-3f9a1c2e · from your upload customer-portal.zip (38 MB), received today".

**20 `20-handoff-requirements.html`.** The copy is done. Project rail with Interview active; breadcrumb "Projects / Customer portal / Your requirements"; strip "Last saved: your upload customer-portal.zip, today · Nothing accepted yet"; compact tape in the top bar: Interview current (no ticks), Documents, Roadmap, Build upcoming, Try it locked. `.pm-arch-task2`: form "Have a requirements document?": `.pm-file` (.md or .txt, under 1 MB) + textarea "Or paste it here" (Reading, 8 rows) + quiet "Use this document" `aria-disabled` with reason "Add a document first." (components.js enables it when the textarea has text or a file is chosen). The three prototype error sentences (E) are documented states of the file field (shown on the components-c demo, not on 20). Aside `.pm-copyflow` done state: box 2 chip Done "Ready", the sentence "Your original code stays unchanged." and Details. Slot: sentence "About your code and what to build next." + thread "Start the interview" (→ 05). "Use this document" → 08.

#### P.3.4 Lane B screens

**21 `21-repo-connect.html`.** List-level rail; breadcrumb "Projects / Work in my repository"; no tape. Title h1 "Work in your repository" + sentence (E). Lane switcher (current: Work in my repository). `.pm-arch-task2`: form "Choose your repository": search field "Find a repository" (36px, D.18) + `.pm-choice-list` of six rows (P.5.3): `test-org/insight-weaver-537` (chosen), `test-org/todo · already a Pramaan project` (aria-disabled, reason), `studio-demo/customer-portal`, `test-org/provider-update-demo-npm-stack`, `test-org/omnibound-vlmk-craft`, `test-org/pramaan-web`; Meta "Showing 6 of 33"; then the verbatim fact sentence (E) as Body muted; then `.pm-check` (P.5.7 variant): Done pin "Pramaan can open pull requests in test-org/insight-weaver-537." + sentence "It never pushes to your default branch (main)." Aside `.pm-ticks pm-panel--fit` "How this works" (four ticks) + "What stays with you" (two items) + the bold sentence (E). Slot: "Pramaan opens pull requests here." + thread "Connect repository".

**21b `21b-repo-connect-permission.html`.** As 21 with the check Blocked (E), the thread "Install the Pramaan app on GitHub" (an `<a>`), and "Connect repository" quiet disabled with reason "Install the app first." (`main` still has exactly one thread: the install link).

**21c `21c-repo-connect-empty.html`.** The list is replaced by `.pm-empty` (D.16) with the sentences from E; the search field stays; the thread is "Install the Pramaan app on GitHub".

**22 `22-repo-requests.html`.** Project insight-weaver-537. Project rail: project block ("insight-weaver-537 · Needs you") + destinations Requests (active, icon `i-requests`), Settings, and Live logs after the 12px gap (three items; Overview, Interview, Documents, Roadmap, Build and Try it do not exist on a Lane B project). Breadcrumb "Projects / insight-weaver-537 / Requests"; no tape; strip (E). Title h1 "Requests" + sentence "4 requests. 1 needs you." Then `.pm-request-composer` (P.5.11, `#pm-job`): label, textarea (Reading, 3 rows, grows to 8), the dictation button (P.4.1), the attach button, the send button ("Send the request", 40px: `.pm-btn--ink` here because a request needs the user; the hint under it). Then `.pm-request-list` (P.5.11): four rows (E), each: title (Label 600) + pin + sentence on line 1, meta on line 2 (Meta; the branch name in mono; "Pull request #42" as a link), and on the right the mini measure `.pm-steps--mini` (four 8px ticks: Build, Test, Review, Merge; filled per state). Rows link to 23. Slot: Needs you + sentence + thread "Open pull request #42" (an `<a href="#">`, opens GitHub in the real app). Rank order: Needs you, Blocked, Working, Waiting, Done (D.7 order with Done last).

**22b `22b-repo-requests-empty.html`.** No rows: `.pm-empty` under the composer (E); the composer's send is the thread; slot sentence (E) with the Working pin absent (nothing is running: use no pin, sentence only). RV7 amendment (Ruling 15 wins): the send carries `data-thread-when="text"`; the page loads with an empty textarea, so the static markup is the not-yet state: the send quiet, `aria-disabled="true"`, reason "Type the change first." beside it, no `data-thread`, `main[data-thread-none="blocked"]`; components.js makes it the thread (filled, `data-thread`, `data-thread-none` removed) as soon as there is text (P.5.14).

**23 `23-repo-request.html`.** Breadcrumb "Projects / insight-weaver-537 / Requests / Let admins archive old workspaces" (leaf truncates at 24ch); Back to Requests; rail Requests active; strip as 22. Top bar tape = the request measure (P.3.5): Build done, Test done, Review done (tooltip "Review: 2 rounds"), Merge current with the pin. Title h1 = the request title; sentence "Started Tuesday. Reviewed twice." `.pm-arch-request` (P.5.1): main column: Needs-you banner `data-gate` (E) with the thread; section "What Pramaan did" as `.pm-steps` (four Done rows with their Meta facts, E); section "What you asked for": the request text at Reading size in a sunken block (fixture: "Admins should be able to archive workspaces that have had no activity for 90 days. Archived workspaces stay readable but cannot be edited. Add an Archive button on the workspace settings page and an Archived filter on the list."); closed Details: "Branch feature/2-archive-workspaces · Pull request #42 · request id r-2 · jobs implement_feature, verify_feature, review_feature, publish_feature". Aside `.pm-ticks pm-panel--fit` "What stays with you" (E) with Details "Default branch: main".

**23b `23b-repo-request-blocked.html`.** As 23 for "Send a summary email every Monday": Blocked banner (E), no thread (`data-thread-none="blocked"`), tape Review current (Blocked pin colour on the tick, Merge locked), steps: Done, Done, Done, Working "Fixing what the review found" with the Details line (E).

#### P.3.5 Journey, tape and rail rules per lane

| Screen | Rail | Tape | Strip | Slot |
|---|---|---|---|---|
| 02, 18, 18b, 18c, 18d, 18e, 21, 21b, 21c | list-level (All projects, Live logs) | hidden | none | thread or the blocked sentence (Ruling 15) |
| 19 | project rail, Overview active, five destinations `data-locked` "Opens when your private copy is ready" | large tape under the title, Interview current, no ticks; note "Your private copy comes first." | "Nothing saved yet. Your code is being copied." | Working · Copying your code. |
| 20 | project rail, Interview active | compact, Interview current (no ticks), Try it locked | "Last saved: your upload …" | thread Start the interview |
| Lane A after 20 | standard | standard; after a document import the Interview step is done with the visually hidden text "done, you brought a document instead" and still links to 05 | standard | standard |
| 22, 22b | project rail with Requests, Settings, Live logs; Requests active | hidden | "Last merged: …" (22b: "Nothing merged yet. Your first request is kept the moment you send it.") | the request that needs you, else the composer's send |
| 23, 23b | as 22 | the request measure: `<nav class="pm-tape" aria-label="This request">` with four steps Build, Test, Review, Merge, same anatomy as D.3, pin on the current step | as 22 | the banner's thread (gate) or the Blocked sentence |

Joins: 20 → 05 (interview, header "Working from your code and your answers", first message from E) or 20 → 08 (Documents with the imported Requirements draft Needs you). Lane B never enters Interview, Documents, Roadmap, Build or Try it in this proposal (P.6, Q5). Settings for a Lane B project is the 16 layout with the Lane B "Your code" section (E); it is specified, not drawn.

#### P.3.6 Vocabulary per lane (Ruling 14)

Founder screens (everything except 21 to 23): the E jargon list holds. "Repository" appears only inside these verbatim live sentences: "Pramaan reads it once. Your repository is never changed." and, under Details, "The private copy is a private repository Pramaan holds, named after your project." "Clone" and "PRD" never appear; "requirements document" replaces PRD everywhere. Lane B screens: "repository", "pull request", "branch", "merge", "deploy", "default branch" are allowed in visible copy and headings; sentences stay under 14 words where possible, second person, present tense, "Pramaan" the actor, no exclamation marks, no em-dash. On both lanes the seven pins and their sentence rule (D.5) hold; a Lane B pin sentence names the branch or pull request only in the row's meta line, never inside the pin sentence.

Wire and safeguard sentences kept verbatim (from the live build): "Pramaan never writes back to where the code came from." · "Pramaan reads it once. Your repository is never changed." · "Pramaan never pushes to your default branch." · the four "How this works" ticks · the two "What stays with you" items · "Next, Pramaan checks that its GitHub App can write to the repository you choose. It opens pull requests there and never pushes to your default branch." · the .zip limits · "Your original code stays unchanged." · "Bringing back a copy you exported? It starts a new project. The original project's documents and history stay with it."

### P.4 The four trend items

#### P.4.1 Dictation in the composer (adapt)

Component `.pm-dictate` (components-c.css, components.js section 9). A 40px ghost icon button in the composer row before Send (`.pm-composer-row` becomes `auto auto minmax(0,1fr) auto`: attach, dictate, textarea, send), `aria-pressed="false"`, `aria-label="Dictate your reply"`, icon `pm-i-mic` (sprite symbol in P.5.12), `data-dictate` pointing at the textarea's id. States:

| State | Trigger | Button | Status line (`[data-dictate-status]` in the composer hint, `aria-live="polite"`) |
|---|---|---|---|
| idle | default, API present | ghost, mic | hint unchanged |
| listening | press | `aria-pressed="true"`, icon `pm-i-stop`, the Working dash ring (`data-live`) 2px chalk around the button, label "Stop dictating" | "Listening. Press the button again to stop. Nothing is sent until you press Send." |
| done | recognition ends | back to idle | "Added to your reply. Check it, then send." for 4s, then the hint |
| unavailable | no `SpeechRecognition` or `webkitSpeechRecognition` at load | `aria-disabled="true"`, ghost, dimmed, reason `aria-describedby` | "Dictation is not available in this browser. Typing works the same." (shown permanently in the hint, Meta) |
| error | `no-speech` / `not-allowed` / other | back to idle | Blocked pin + "Nothing was heard. Try again, or type." / "The microphone is blocked. Allow it in your browser, or type." / "Dictation stopped. Try again, or type." |

Rules: transcript text is appended to the textarea at the caret (interim results replace the last interim span; final results stay), the textarea keeps focus and auto-grows, nothing is ever sent by voice; Escape stops listening; the ring is the only motion (Ruling 16); `lang` is the document's. Field variant (a textarea with no send, `.pm-composer-row--nosend`, RV10): label "Dictate the document", listening "Listening. Press the button again to stop.", done "Added to the document."; unavailable and error sentences as above (js §9 picks the variant from the row class). Where it appears: 05, 05b, 06 (composer), 20 (the requirements textarea, the same button under the textarea's right edge, in a `.pm-composer-row` without send), 22 and 22b (request composer). The static screens run the real Web Speech API when Chrome offers it and fall back to the unavailable state otherwise; the components-c demo shows all five states statically.

#### P.4.2 One plain autonomy setting (adapt)

`.pm-setting` (components-c.css): a settings section with a switch row (D.17) whose consequence sentence changes with the state: `<input class="pm-switch" role="switch" id="sw-gate" checked aria-describedby="sw-gate-t">`, label "Check with me before each sprint starts", `<p id="sw-gate-t" data-on="…" data-off="…">` (copy in E). Disabled state: `disabled` on the switch, the row's label muted, and a `.pm-btn-reason`-styled reason beside the label (E). components.js section 12 swaps the sentence on change (no persistence; a static proposal). Effect shown only as consequence text: 11's gate consequence line gets the appended sentence (E); 13's "This sprint" strip's "Then:" line reads as in E; 14 unchanged. No per-action policy, no permission matrix, no "always allow" anywhere in UI copy; the document's "Frozen autonomous decision policy" stays a document section under Advanced (a product artefact, not a setting).

#### P.4.3 Bento overview (adapt)

`.pm-bento` (components-c.css): `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 20px`. Tiles `.pm-tile`: raised, hairline, radius card, padding 16 20, `display: grid; align-content: start; gap: 8px`, min-height 120. Modifiers: `.pm-tile--lead` (`grid-column: 1 / -1`; on the overview this is the existing `.pm-banner` element with both classes, tint and `data-gate` kept, the thread inside it), `.pm-tile--wide` (`grid-column: span 2`), `.pm-tile--digit` (holds one `.pm-digit` from D.8 laid horizontally: the engraved block left, `dt` and sentence right; the tile's Details, when any, under them). DOM order = reading order = importance: lead, Documents digit, Sprints digit, Budget digit, "What happens next" (wide), info. No `order` property anywhere; screen readers read the decision first. Sizes: at 1120 content the three columns are 360; at 1030 (1142 collapsed) 330; at 832 (1142 expanded) about 264, so the three digit tiles stay in one row; one column only below an 800px content box (RV8). The large tape stays above the bento (G.1). Screens: 03, 04, 19. Not used on lists or boards (trend research: bento fails where sequence matters).

#### P.4.4 Quiet milestone moment (adapt)

Two milestones: a sprint becomes ready to try (13, the ready state) and all sprints are accepted (14). `pmMilestone(kind)` in components.js section 11 sets `data-milestone="<kind>"` on the visible `.pm-tape` (top bar or large) for 700ms. CSS (components-c.css): the check glyph of each done step draws itself (`stroke-dasharray: 24; stroke-dashoffset: 24` → 0 over 240ms `--pm-ease-out`, staggered 80ms per step, so five checks finish by 560ms) and the sub-progress ticks of the current step fill left to right (120ms stagger); the pin does not move (it already slid). A one-line message appears in place: 13 ready: a `.pm-milestone-line` in the sprint header (Done pin + "Sprint 1 is ready to try.") that fades in over 180ms, above the Needs-you sentence; 14: the banner title is the line (no extra element). No toast, no confetti, no sound, nothing blocks, nothing loops. `prefers-reduced-motion: reduce`: no drawing, the end state appears at once, the line still appears. Triggers: 13's review-only switch to "Ready to try", the flow's "Demo: sprint finishes" (13 → ready) and the flow's 15 → 14 acceptance; never on page load (static 14 shows the end state).

### P.5 New shared components and archetypes (pass 2)

Ownership: `components-c.css` (new, WP9) holds every component below unless stated; `shell.css` gains an appended "PASS 2" block (archetypes, `.pm-panel--fit`, the container); `components.js` gains sections 9 to 12 (WP10); `screens/_skeleton.html` gains the sprite symbols of P.5.12 (WP9). Tokens only; every colour pair is one of B.2. `check-css.mjs` must stay green; `components-c-demo.html` (WP9) shows every state.

**P.5.1 Archetypes and the fitted panel (shell.css, appended).**
- `.pm-content { container: pm-content / inline-size; }`
- `.pm-arch-task2 { display: grid; grid-template-columns: minmax(420px, 560px) var(--pm-panel-w); column-gap: 24px; justify-content: center; align-items: start; }` (at 1440 the aside is 360 and the block 944 wide, centred in 1120).
- `.pm-arch-settings2, .pm-arch-request { display: grid; grid-template-columns: minmax(0, 720px) var(--pm-panel-w); column-gap: 24px; align-items: start; }`
- `.pm-arch-plan2 { display: grid; grid-template-columns: minmax(0, 760px) var(--pm-panel-w); column-gap: 24px; align-items: start; }`
- `.pm-arch-build { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-areas: "main" "side" "act"; gap: 24px; align-items: start; }` with `.pm-build-main { grid-area: main }`, `.pm-build-side { grid-area: side }`, `.pm-build-act { grid-area: act }`; `@container pm-content (min-width: 1000px) { .pm-arch-build { grid-template-columns: minmax(0, 1fr) 320px; grid-template-areas: "main side" "main act"; } }`
- `@container pm-content (max-width: 899px) { .pm-arch-task2, .pm-arch-settings2, .pm-arch-request, .pm-arch-plan2 { grid-template-columns: minmax(0, 1fr); } }` (single column with the rail expanded at 1142 only when it must); settings keeps two columns from 800 to 899px with a 280px sticky aside (`.pm-arch-settings2 { grid-template-columns: minmax(0, 1fr) 280px }`, RV8). `.pm-arch-build` at 1000px and up adds `grid-template-rows: auto 1fr`, so the act card follows the side card at the 24px gap (RV9).
- `.pm-panel--fit { height: auto; max-height: calc(100vh - var(--pm-topbar-h) - var(--pm-strip-h) - 40px); overflow-y: auto; border: var(--pm-hairline); border-radius: var(--pm-radius-card); background: var(--pm-sys-surface-raised); }`; on page screens add `position: sticky; top: calc(var(--pm-topbar-h) + 16px)` via `.pm-panel--fit.pm-panel--sticky`; inside the chat and stage workbenches the fitted panel sits with `margin: 16px 16px 0 0` and `align-self: start` (`.pm-arch-chat .pm-panel--fit, .pm-arch-stage .pm-panel--fit, .pm-wb > .pm-panel--fit`: `.pm-wb` is the workbench grid of 05, 05b, 06; one rule in `shell.css`, no page copies), keeps no left hairline, and its max-height is the column height minus 16.

**P.5.2 Lane switcher `.pm-lanes`.** `<nav class="pm-lanes" aria-label="Ways to start">` with an `<ol>`; items are `.pm-chip` (D.18, 28px) links; the current item `aria-current="page"` is ink-filled; the Meta label "For engineering teams" is an `<li>` with `.pm-lanes-label` (Meta muted, no chip) before the third chip. Row height 44, stitch above and below (as the entry row on 01), margin-bottom 16.

**P.5.3 Choice cards and choice list.** `.pm-choice` (a radio card): `<label class="pm-choice"><input type="radio" class="pm-sr"> <span class="pm-choice-title">…</span><span class="pm-choice-meta">…</span></label>`; raised, hairline, radius card, padding 12 16, min-height 64; checked: border `--pm-sys-text` 1px and a 10px filled pin head at the left (the Needs-you head glyph, `--pm-sys-text`); focus-visible ring on the label via `:has(:focus-visible)`; two cards in a row `grid-template-columns: 1fr 1fr; gap 12`. `.pm-choice-list` (a radio list): rows 40px, radio + `.pm-choice-name` in 13/20 mono (controller ruling at RV7, like the log; it was Body size) + Meta trailing note; `aria-disabled` rows muted with their reason in the note; the list is a `fieldset` with a legend; max 6 rows visible, the list scrolls only inside a fitted card of `max-height: 240px` when there are more (a second scroller is forbidden on page screens, so the list is capped at 6 rows and "Showing 6 of 33" plus the search field stand in for scrolling).

**P.5.4 File field `.pm-file`.** `<div class="pm-field"><span class="pm-label" id="f-code-l">Your code (.zip, up to 200 MB)</span><div class="pm-file"><input type="file" id="f-code" class="pm-sr" aria-labelledby="f-code-l" accept=".zip"><label for="f-code" class="pm-btn pm-btn--quiet">Choose a file</label><span class="pm-file-name" data-file-name>customer-portal.zip · 38 MB</span></div><span class="pm-help" id="f-code-h">…</span></div>`; error state per D.17 (`.pm-file--error` puts the blocked border on the button, the helper carries the Blocked pin sentence, the button label becomes "Choose another file"). components.js section 10 writes the chosen name and size (rounded MB) into `[data-file-name]` and the copy flow.

**P.5.5 Copy flow `.pm-copyflow`.** A fitted aside tile: heading (Heading), then two boxes stacked with a 16px arrow (`pm-i-arrow-down`) between them, centred: each box is sunken, radius card, padding 12 16: label (Meta uppercase not allowed: Meta muted sentence case, "Your upload" / "GitHub" / "Pramaan's private copy"), value (Body 500, `.pm-mono` for a GitHub name or a file name), and a chip (D.18, quiet) "Read once · never changed" / "Read only · unchanged" / "All work happens here"; box 2 in the done state carries a Done tint chip "Ready", in the in-progress state a Working pin. Under the boxes: the sentence (Body muted) and a closed Details. Data hooks: `[data-flow-source-label]`, `[data-flow-source-value]`, `[data-flow-source-chip]`.

**P.5.6 Decisions brief block `.pm-decisions-brief`.** Inside `.pm-decisions` after the list: heading "Where your answers go" (Label 600, 32px row with a stitch above), then an `<ol>` of six rows, 40px each: a 10px hollow ring (or a Done head with check when ticked, `data-fed="true"`), the section name (Label) and its gloss (Meta muted, one line). 05b: none ticked; 05: the first ticked; 06: the whole block replaced by one 40px Done line (E). The Details ("Workspace sized automatically…") stays last.

**P.5.7 Steps `.pm-steps` and the check `.pm-check`.** `.pm-steps`: an `<ol>` of rows 44px (pin + Label title + Meta fact on the right or under, `.pm-steps-fact`), a 2px stitched vertical line at x 5px joining the pin heads (the route's line, thinner); states are D.5 pins. `.pm-steps--mini`: four 8px x 8px squares (radius 2) in a row with 4px gaps, `aria-label="Build, Test, Review, Merge: 3 of 4 done"`, filled `--pm-sys-status-done` for done, `--pm-sys-status-working` for the current, hairline for waiting, `--pm-sys-status-blocked` for blocked. `.pm-check`: a callout-sized block (padding 12 16, radius card, tint by status as D.6) holding a pin + sentence + second sentence; used for the GitHub App check result.

**P.5.8 Action cards `.pm-actioncards`.** A `<ul>` grid of three `.pm-actioncard` (`grid-template-columns: repeat(3, 1fr); gap 12`): raised, hairline, radius card, padding 12 16, 88px tall: the action as a quiet button or link (Label) on line one, its Meta sentence on line two; the whole card is not a link (the button is). Used on 07.

**P.5.9 Meter `.pm-meter`.** A 4px track (`--pm-sys-hairline`) with a fill (`--pm-sys-text`) at `--pm-fill`, 100% wide, with a Meta line above ("Monthly budget · 18% used"); the rail's budget line drawn in page colours. Used in the settings aside and the budget tile.

**P.5.10 Document head `.pm-doc-head`.** A grid `auto 1fr auto` row: the document title (Title step, as now) left, the version chips (`.pm-versions`) right on the same baseline, then the byline (Meta) under the title spanning the row with the Details summary inline at its end ("Details" as a link-styled summary that opens the details block below). Used on 09, 10.

**P.5.11 Request composer and list.** `.pm-request-composer`: a raised card (radius card, padding 16 20) holding a label (Label), a `.pm-composer-row` (attach, dictate, textarea, send) and the hint; the send is `.pm-btn--ink` when another request needs the user and the thread otherwise; both variants behave identically (disabled with its reason until there is text, Ctrl+Enter sends, the hint reports it), and the thread variant is quiet while disabled (Ruling 15, P.5.14). `.pm-request-list`: an `<ol>` of `.pm-request` rows 64px (12 + 22 + 16 + 14): line one: title (Label 600) as the row link (`.pm-rowlink` pattern), pin + sentence; line two: Meta with `.pm-mono` branch and the pull request link; right: `.pm-steps--mini`. Hover: sunken background; focus-within ring.

**P.5.12 Sprite additions (`screens/_skeleton.html` and every screen that uses them).**
- `<symbol id="i-requests" viewBox="0 0 20 20"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="15" r="2"/><circle cx="14" cy="8" r="2"/><path d="M6 7v6M14 10c0 3-3 3-6 4"/></symbol>` (rail destination Requests)
- `<symbol id="pm-i-mic" viewBox="0 0 16 16"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5"/><path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5M5.5 14.5h5"/></symbol>`
- `<symbol id="pm-i-stop" viewBox="0 0 16 16"><rect x="4" y="4" width="8" height="8" rx="1.5"/></symbol>`
- `<symbol id="pm-i-upload" viewBox="0 0 16 16"><path d="M8 10.5v-8M4.5 6L8 2.5 11.5 6M3 12.5h10"/></symbol>`
- `<symbol id="pm-i-arrow-down" viewBox="0 0 16 16"><path d="M8 3v10M4.5 9.5L8 13l3.5-3.5"/></symbol>`
No brand marks (no GitHub logo): "GitHub" is a word.

**P.5.13 Other page-level patterns (page `<style>`, tokens only, under 40 lines):** two-line table rows (`.pm-table--two-line`, components-c), device switch and frame (`.pm-device-switch`, `.pm-device`, components-c), plan aside (`.pm-plan-aside`, components-c), skeleton route card (`.pm-route-card--skeleton`, components-c), milestone line (`.pm-milestone-line`, components-c), TOC comments (`.pm-toc-comments`, components-c), question card columns (`.pm-qcard-body` rule in components-c, additive), setting (`.pm-setting`, components-c).

**P.5.14 Frozen hooks (RV7, 2026-09-30).** The contract for the wave-2 screen builders: use these classes, attributes and JS hooks exactly as spelled, with the markup shape shown (text is from E; ids are examples). Nothing here may be renamed without a ruling. Owners: `c` = `components-c.css`, `s` = the PASS 2 block of `shell.css`, `js §n` = `components.js` section n. Every screen that uses an icon carries its sprite symbol (P.5.12); dictation needs both `pm-i-mic` and `pm-i-stop`. The live, every-state reference is `components-c-demo.html`.

| Component | Classes, attributes, JS hooks (owner) | Minimal markup |
|---|---|---|
| Archetypes, fitted panel | `.pm-content` is the `pm-content` container (s); `.pm-arch-task2`, `.pm-arch-settings2`, `.pm-arch-request`, `.pm-arch-plan2`, `.pm-arch-build` with `.pm-build-main`, `.pm-build-side`, `.pm-build-act` (s); `.pm-panel--fit`, `.pm-panel--sticky` (s; sticky under the top bar, under the gate bar too inside `.pm-arch-plan2` via `--pm-gate-h`; static under 900px content) | `<div class="pm-arch-task2"><form id="pm-job">…</form><aside class="pm-tile pm-panel--fit pm-panel--sticky" aria-label="What happens next">…</aside></div>` |
| Lane switcher | `nav.pm-lanes` > `ol` > `li` > `a.pm-chip`, current `aria-current="page"`; `li.pm-lanes-label` (c). No JS. Directly under `.pm-title`. | `<nav class="pm-lanes" aria-label="Ways to start"><ol><li><a class="pm-chip" href="02-new-project.html">Describe your idea</a></li><li><a class="pm-chip" href="18-handoff-source.html" aria-current="page">Hand off your code</a></li><li class="pm-lanes-label">For engineering teams</li><li><a class="pm-chip" href="21-repo-connect.html">Work in my repository</a></li></ol></nav>` |
| Choice cards (source) | `fieldset.pm-choices` > `legend`, `label.pm-choice` > `input.pm-sr[type=radio]` + `span.pm-choice-title` + `span.pm-choice-meta` (c). JS §10 hook: radios `name="source"` with `value="upload"` / `value="github"` show the matching `[data-source="upload"]` / `[data-source="github"]` block (the other gets `hidden`), write "GitHub" / "Your upload" into `[data-flow-source-label]`, swap `[data-flow-source-value]` and `[data-flow-source-chip]` to their optional `data-github-value` / `data-github-chip` text, and re-evaluate a `[data-thread-when="file"]` thread (GitHub: enabled when a checked, enabled radio sits inside `[data-source="github"]`). | `<fieldset class="pm-choices"><legend>Where is your code?</legend><label class="pm-choice"><input class="pm-sr" type="radio" name="source" value="upload" checked><span class="pm-choice-title">Upload a .zip</span><span class="pm-choice-meta">No GitHub account needed.</span></label><label class="pm-choice"><input class="pm-sr" type="radio" name="source" value="github"><span class="pm-choice-title">Import from GitHub</span><span class="pm-choice-meta">Pramaan reads it once. Your repository is never changed.</span></label></fieldset>` |
| Choice list (repositories) | `fieldset.pm-choice-list` > `legend` + `div.pm-choice-rows` > `label.pm-choice-row` > `input[type=radio]` + `span.pm-choice-name` (13/20 mono) + optional `span.pm-choice-note` (c). A row that cannot be chosen: `aria-disabled="true"` on the label, `disabled` on the input, the reason in the note. At most 6 rows; "Showing 6 of 33" as a Meta line under the fieldset. No JS. | `<fieldset class="pm-choice-list"><legend>Choose your repository</legend><div class="pm-choice-rows"><label class="pm-choice-row"><input type="radio" name="repo" value="insight-weaver-537" checked><span class="pm-choice-name">test-org/insight-weaver-537</span></label><label class="pm-choice-row" aria-disabled="true"><input type="radio" name="repo" value="todo" disabled><span class="pm-choice-name">test-org/todo</span><span class="pm-choice-note">already a Pramaan project</span></label></div></fieldset>` |
| File field | `.pm-field` > `span.pm-label#…-l`, `div.pm-file` > `input[type=file].pm-sr` + `label[for].pm-btn.pm-btn--quiet` + `span.pm-file-name[data-file-name]` (add `.pm-mono` for the 13/20 mono file name, styled in c; no page copies), then the first `.pm-help` of the field is the helper (c). JS §10 reads `accept` (".zip" marks the code field; only it writes into the copy flow), `data-max-mb` (default 200; 20 uses 1) and optional `data-msg-type`, `data-msg-size`, `data-msg-empty`. JS writes: name and size into `[data-file-name]`, `.pm-file--error` on `.pm-file`, `aria-invalid` on the input, the Blocked pin line into the helper, the label text "Choose another file", `data-valid` and `data-problem` on the input. Static error state (18c, 18d): ship those results, `.pm-help.pm-help--error` with the Blocked pin, and the input's `aria-describedby` pointing at the helper. | `<div class="pm-field"><span class="pm-label" id="f-code-l">Your code (.zip, up to 200 MB)</span><div class="pm-file"><input type="file" id="f-code" class="pm-sr" aria-labelledby="f-code-l" accept=".zip"><label for="f-code" class="pm-btn pm-btn--quiet">Choose a file</label><span class="pm-file-name" data-file-name>customer-portal.zip · 38 MB</span></div><span class="pm-help" id="f-code-h">…</span></div>` |
| Copy flow | `aside.pm-copyflow.pm-panel--fit` > `h2` + `div.pm-flow` > `div.pm-flow-box` (label `span.pm-flow-label`, value `span.pm-flow-value` plus `.pm-mono` for a file or GitHub name, chip `span.pm-chip.pm-flow-chip`) + `svg.pm-icon.pm-flow-arrow` (`#pm-i-arrow-down`) + the second box; then `p.pm-flow-sentence` and a closed `details.pm-details` (c). Box 1 hooks `[data-flow-source-label]`, `[data-flow-source-value]`, `[data-flow-source-chip]` (js §10). At load js §10 stores both sides' text on each box (`data-upload`, `data-github-value`, `data-github-chip`, and the chip tint as `data-upload-status` / `data-github-status`) from the side the page starts on; pre-set attributes win, a missing side falls back to the chosen file or repository name, or "No file chosen yet" / "Not connected yet", "Read once · never changed" / "Read only · unchanged". Pre-setting the other side's attributes is optional (RV9). Chip tint `data-status="done"` ("Ready") or `data-status="blocked"` ("Too big", "Not a .zip"; js §10 writes it). Box 2 in progress holds a Working pin in place of the chip. | `<aside class="pm-copyflow pm-panel--fit pm-panel--sticky" aria-label="Where your code goes"><h2>Where your code goes</h2><div class="pm-flow"><div class="pm-flow-box"><span class="pm-flow-label" data-flow-source-label>Your upload</span><span class="pm-flow-value pm-mono" data-flow-source-value>customer-portal.zip · 38 MB</span><span class="pm-chip pm-flow-chip" data-flow-source-chip>Read once · never changed</span></div><svg class="pm-icon pm-flow-arrow" aria-hidden="true"><use href="#pm-i-arrow-down"/></svg><div class="pm-flow-box"><span class="pm-flow-label">Pramaan's private copy</span><span class="pm-flow-value">A private copy named after your project</span><span class="pm-chip pm-flow-chip">All work happens here</span></div></div><p class="pm-flow-sentence">The code stays yours. Take a copy any time.</p><details class="pm-details"><summary>Details</summary><div class="pm-details-body">…</div></details></aside>` |
| Decisions brief | `div.pm-decisions-brief` after `.pm-decisions-list` in `.pm-decisions.pm-panel--fit` > `h3.pm-decisions-brief-title` + `ol.pm-brief-list` > `li.pm-brief-row[data-fed="true" when ticked]` > `span.pm-brief-ring` (holds the `pm-g-check` glyph) + `span.pm-brief-name` + `span.pm-brief-gloss`; 06: `p.pm-brief-line` with a Done pin instead of the list (c). | `<div class="pm-decisions-brief"><h3 class="pm-decisions-brief-title">Where your answers go</h3><ol class="pm-brief-list"><li class="pm-brief-row" data-fed="true"><span class="pm-brief-ring" aria-hidden="true"><svg class="pm-pin-glyph"><use href="#pm-g-check"/></svg></span><span class="pm-brief-name">One-sentence outcome</span><span class="pm-brief-gloss">The one thing this product should do.</span></li></ol></div>` |
| Steps, mini steps, check | `ol.pm-steps` > `li.pm-step` > `span.pm-pin[data-status]` + `span.pm-step-title` + `span.pm-steps-fact` (c). Mini: `span.pm-steps.pm-steps--mini[role=img][aria-label]` > four `i`, each `data-state="done"`, `"working"` or `"blocked"`, none for waiting (c). Check: a `div.pm-check[data-status="done|blocked|working|needs-you"]` (must be a div; `label.pm-check` and `li.pm-check` belong to the Try it checklist) > the pin with its `span.pm-pin-sentence` inside + `p.pm-check-text`. | `<ol class="pm-steps"><li class="pm-step"><span class="pm-pin" data-status="done"><span class="pm-pin-head"><svg class="pm-pin-glyph" aria-hidden="true"><use href="#pm-g-check"/></svg></span><span class="pm-pin-label">Done</span></span><span class="pm-step-title">Tested the change it made</span><span class="pm-steps-fact">Checks passed on the branch</span></li></ol>` · `<span class="pm-steps pm-steps--mini" role="img" aria-label="Build, Test, Review, Merge: 3 of 4 done"><i data-state="done"></i><i data-state="done"></i><i data-state="done"></i><i></i></span>` · `<div class="pm-check" data-status="done"><span class="pm-pin" data-status="done">…<span class="pm-pin-sentence">Pramaan can open pull requests in test-org/insight-weaver-537.</span></span><p class="pm-check-text">It never pushes to your default branch (main).</p></div>` |
| Action cards | `ul.pm-actioncards` > `li.pm-actioncard` > `button.pm-actioncard-action` or `a.pm-actioncard-action` + `p.pm-actioncard-text` (c). The card is not a link. | `<ul class="pm-actioncards"><li class="pm-actioncard"><a class="pm-actioncard-action" href="13-sprints-building.html">Open Build</a><p class="pm-actioncard-text">See how sprint 1 is going.</p></li></ul>` |
| Meter | `div.pm-meter` with inline `--pm-fill` > `p.pm-meter-label` + `div.pm-meter-track[role=img][aria-label]` > `span.pm-meter-fill` (c). | `<div class="pm-meter" style="--pm-fill: 18%"><p class="pm-meter-label">Monthly budget · 18% used</p><div class="pm-meter-track" role="img" aria-label="Monthly budget 18% used"><span class="pm-meter-fill"></span></div></div>` |
| Document head | `div.pm-doc-head` > `h1.pm-doc-title` + `div.pm-versions` + `details.pm-doc-byline.pm-details` > `summary` (byline `span` + `span.pm-doc-details-link` "Details") + `div.pm-details-body` (c). | `<div class="pm-doc-head"><h1 class="pm-doc-title">Product brief</h1><div class="pm-versions" role="radiogroup" aria-label="Version">…chips…</div><details class="pm-doc-byline pm-details"><summary><span>Pramaan wrote draft 1 on Tuesday at 20:59.</span> <span class="pm-doc-details-link">Details</span></summary><div class="pm-details-body pm-mono">…</div></details></div>` |
| Request composer | `form.pm-request-composer` > `label.pm-label[for]` + `div.pm-composer-row.pm-composer-row--dictate` (attach, `button.pm-dictate`, `textarea.pm-composer-input`, send) + `div.pm-composer-hint` > the hint `span[data-dictate-status]` and the send's `span.pm-btn-reason` (c). JS §12: the send is `button[type=submit][data-request-send]`; ink variant `.pm-btn--ink`; thread variant adds `data-thread-when="text"` (22b). Both: `aria-disabled` + reason "Type the change first." until there is text, Ctrl+Enter sends, the hint shows the Done line "Request sent. Pramaan starts on a new branch." for 4s, the textarea grows to 8 lines. The thread variant is quiet, without `data-thread`, and sets `main[data-thread-none="blocked"]` while empty (Ruling 15); with text it is `.pm-btn--thread[data-thread]` and `data-thread-none` is removed. Ship the static state the page loads in. | `<form class="pm-request-composer" id="pm-job" aria-label="Request a change"><label class="pm-label" for="rq">Request a change</label><div class="pm-composer-row pm-composer-row--dictate"><button class="pm-btn pm-btn--ghost pm-btn--icon pm-btn--lg" type="button" aria-label="Attach files or images">…</button><button class="pm-dictate" type="button" aria-pressed="false" aria-label="Dictate your reply" data-dictate="#rq"><svg class="pm-icon" aria-hidden="true"><use href="#pm-i-mic"/></svg></button><textarea class="pm-composer-input" id="rq" rows="3" placeholder="…"></textarea><button class="pm-btn pm-btn--ink pm-btn--lg" type="submit" data-request-send aria-disabled="true" aria-describedby="rq-r">Send the request</button></div><div class="pm-composer-hint"><span data-dictate-status>Pramaan starts on a new branch as soon as you send. Nothing touches main.</span><span class="pm-btn-reason" id="rq-r">Type the change first.</span></div></form>` |
| Request rows | `ol.pm-request-list` > `li.pm-request` > `div.pm-request-line` (`a.pm-rowlink.pm-request-title` + pin + `span.pm-request-sentence`) + `p.pm-request-meta` (branch in `span.pm-mono`, 13px; the pull request as a plain `a`) + `span.pm-steps.pm-steps--mini` (c). Order: Needs you, Blocked, Working, Waiting, Done. | `<li class="pm-request"><div class="pm-request-line"><a class="pm-rowlink pm-request-title" href="23-repo-request.html">Let admins archive old workspaces</a><span class="pm-pin" data-status="needs-you">…</span><span class="pm-request-sentence">Reviewed twice and ready. Merge it when you are ready.</span></div><p class="pm-request-meta">Started Tuesday · <span class="pm-mono">feature/2-archive-workspaces</span> · <a href="#">Pull request #42</a></p><span class="pm-steps pm-steps--mini" role="img" aria-label="…">…</span></li>` |
| Dictation | `button.pm-dictate[type=button][aria-pressed="false"][aria-label="Dictate your reply"][data-dictate="#<textarea id>"]` with `use href="#pm-i-mic"` (c, js §9). Chat composers (05, 05b, 06) add `.pm-composer-row--dictate` to their row and put the button between attach and the textarea; a field without send (20) uses `div.pm-composer-row.pm-composer-row--nosend` (textarea, then the button). The status line is the nearest `[data-dictate-status]` around the button (the composer hint's span, or the field's `.pm-help`); JS adds `aria-live="polite"`. JS writes `data-state` (`idle`, `listening`, `unavailable`), `data-live="true"` while listening, `aria-pressed`, the label "Stop dictating", the icon `#pm-i-stop`; unavailable: `aria-disabled="true"` and `aria-describedby` = the status line (an id is assigned if missing). Ship the idle markup; never a static listening state on a screen. | `<div class="pm-composer-row pm-composer-row--dictate"><button …attach…></button><button class="pm-dictate" type="button" aria-pressed="false" aria-label="Dictate your reply" data-dictate="#reply"><svg class="pm-icon" aria-hidden="true"><use href="#pm-i-mic"/></svg></button><textarea class="pm-composer-input" id="reply" rows="1"></textarea><button class="pm-btn pm-btn--thread pm-btn--lg" type="submit" data-thread>Send reply</button></div><div class="pm-composer-hint"><span data-dictate-status>Ctrl+Enter sends. Your decisions save as you go.</span></div>` |
| Setting switch | `div.pm-setting` > `h2.pm-setting-title` + `div.pm-switch-row` > `input.pm-switch[type=checkbox][role=switch]` + `div.pm-setting-text` > `div.pm-setting-head` (`label.pm-setting-label[for]`, and `span.pm-setting-reason` when disabled) + `p.pm-setting-consequence[data-on][data-off]` (c). JS §12 swaps the sentence on change; the sentence is the `aria-describedby` id that carries `data-on` and `data-off` (a reason id may sit beside it). Disabled: `disabled` on the input. | `<div class="pm-setting"><h2 class="pm-setting-title">Before each sprint</h2><div class="pm-switch-row"><input class="pm-switch" type="checkbox" role="switch" id="sw-gate" checked aria-describedby="sw-gate-t"><div class="pm-setting-text"><div class="pm-setting-head"><label class="pm-setting-label" for="sw-gate">Check with me before each sprint starts</label></div><p class="pm-setting-consequence" id="sw-gate-t" data-on="…" data-off="…">Pramaan waits for you to try and accept a sprint before the next one starts.</p></div></div></div>` |
| Bento | `div.pm-bento` > lead `div.pm-banner.pm-banner--<status>.pm-tile.pm-tile--lead[data-gate]` (thread inside, D.14), `div.pm-tile.pm-tile--digit` > `dl.pm-digits` > `div.pm-digit` (x3; the Budget tile adds its `details.pm-details` after the `dl`), `div.pm-tile.pm-tile--wide` > `h2` + content, `div.pm-tile` > `h2` + content (c). No `order` anywhere. | `<div class="pm-bento"><div class="pm-banner pm-banner--needs-you pm-tile pm-tile--lead" data-gate>…</div><div class="pm-tile pm-tile--digit"><dl class="pm-digits"><div class="pm-digit"><dt>Documents accepted</dt><dd class="pm-digit-value"><span>3</span><span class="pm-digit-sep">/</span><span>3</span></dd><dd class="pm-digit-sentence">All three unlock the plan.</dd></div></dl></div>…<div class="pm-tile pm-tile--wide"><h2>What happens next</h2>…</div><div class="pm-tile"><h2>Your workspace</h2>…</div></div>` |
| Milestone | `p.pm-milestone-line[data-milestone-line="sprint-ready"]` (c, js §11), `hidden` in a state that has not reached the milestone; shown without `hidden` in the static ready state (it never fades on load). Triggers: `[data-milestone-trigger="sprint-ready"]` (review-only switch, flow demo button) or `pmMilestone("sprint-ready")` / `pmMilestone("all-accepted")` from flow.js. JS writes `data-milestone="<kind>"` on the visible `.pm-tape` and `data-milestone-enter` on the revealed line, each for 700ms; under reduced motion only the line appears. The tape's done steps keep `.pm-tape-num` > `svg` > `use href="#i-check"`, the current step's ticks `.pm-tape-ticks` > `i.on`. 14 uses no line element: the banner title is the line and carries `data-milestone-line="all-accepted"` (shown in the static end state; a `pmMilestone("all-accepted")` call replays its fade). `pmMilestone(kind)` reveals only a line of that kind (or one with an empty value), never another kind's line (RV9). | `<p class="pm-milestone-line" data-milestone-line="sprint-ready" hidden><span class="pm-pin" data-status="done"><span class="pm-pin-head"><svg class="pm-pin-glyph" aria-hidden="true"><use href="#pm-g-check"/></svg></span><span class="pm-pin-label">Done</span></span><span class="pm-pin-sentence">Sprint 1 is ready to try.</span></p>` |
| Two-line table | `table.pm-table.pm-table--two-line`; the first cell is `a.pm-rowlink` + `span.pm-row-purpose` (c). | `<td><a class="pm-rowlink" href="09-document-draft.html">Product brief</a><span class="pm-row-purpose">What the product is for and how we will know it works.</span></td>` |
| Device switch and frame | `div.pm-device-switch[role=radiogroup][aria-label="Preview width"]` > `button.pm-chip[role=radio][aria-checked]` with `data-device-w` ("390px", "820px", none for Computer) and `data-caption` ("390 px", "820 px", "Fills the stage"), placed in `.pm-stage-bar` (centred there by c); `figure.pm-device` (inline `--pm-device-w` for Phone and Tablet) > `div.pm-device-frame` > `iframe` + `figcaption.pm-device-caption` (c). `--pm-device-w` is the content (iframe) width: Phone 390, Tablet 820, Computer unset = the full stage; the frame's two 1px borders are added outside it (RV9). When the stage is narrower than the chosen width (Tablet at 1142 and 1440, where the stage is about 720 and 780), the frame fills the stage and the caption says so: "Shown at 782 px. A tablet is 820 px." (js §12, recomputed on resize). JS §12 (c) sets the width and caption on click and arrow keys. | `<div class="pm-device-switch" role="radiogroup" aria-label="Preview width"><button class="pm-chip" type="button" role="radio" aria-checked="false" data-device-w="390px" data-caption="390 px">Phone</button><button class="pm-chip" type="button" role="radio" aria-checked="false" data-device-w="820px" data-caption="820 px">Tablet</button><button class="pm-chip" type="button" role="radio" aria-checked="true" data-caption="Fills the stage">Computer</button></div>` · `<figure class="pm-device"><div class="pm-device-frame"><iframe title="…" src="…"></iframe></div><figcaption class="pm-device-caption">Fills the stage</figcaption></figure>` |
| Plan aside | `aside.pm-plan-aside.pm-panel--fit.pm-panel--sticky[data-spy]` > `h2` + `ol` > `li` > `a[href="#<route node id>"]` (`span.pm-tnum` + `span.pm-plan-name` + pin) + `p` (c; js §7 generalised spy writes `aria-current="location"` on the row of the `.pm-route-node[id]` in view). | `<aside class="pm-plan-aside pm-panel--fit pm-panel--sticky" data-spy aria-label="Plan at a glance"><h2>Plan at a glance</h2><ol><li><a href="#sprint-1"><span class="pm-tnum">1</span><span class="pm-plan-name">Your private checklist</span><span class="pm-pin" data-status="working">…</span></a></li></ol><p>Nothing is built until you approve.</p></aside>` |
| Skeleton route card | `div.pm-route-card.pm-route-card--skeleton[aria-hidden="true"]` > six `span.pm-skeleton` (c). | `<div class="pm-route-card pm-route-card--skeleton" aria-hidden="true"><span class="pm-skeleton"></span><span class="pm-skeleton"></span><span class="pm-skeleton"></span><span class="pm-skeleton"></span><span class="pm-skeleton"></span><span class="pm-skeleton"></span></div>` |
| TOC comments | In `nav.pm-toc`, after the section `ol` and `div.pm-toc-links`: the visible label `p.pm-toc-title.pm-toc-comments-title#toc-comments` "Passage comments (1)" (10: "Passage comments"), then `ol.pm-toc-comments[aria-labelledby="toc-comments"]` > `li` > `a[href="#<mark id>"]`, or `p.pm-toc-comments-empty` "No passage comments." (c). js §7 never marks these links current. | `<ol class="pm-toc-comments"><li><a href="#mark-1">1 · Constraints: 'I don't think this is a constraint'</a></li></ol>` |
| Blocked state on a form (Ruling 15) | `main[data-thread-none="blocked"]`; the slot: the Blocked pin + `span.pm-pin-sentence.pm-slot-sentence` (wrap them in `[data-show-when="blocked"]` and put the problem sentence in `[data-slot-why]` when JS may clear the problem), the ready sentence in `[data-show-when="ready"] hidden`, then `span.pm-btn-reason#<id>` and the would-be thread `button.pm-btn.pm-btn--quiet[aria-disabled="true"][aria-describedby="<id>"]`: never `data-thread`, never `.pm-btn--thread` while disabled. The one next action is on the page (18c, 18d: the file button relabelled "Choose another file"). The slot sentence in `[data-slot-why]` is short (at most 16 characters, one line, 22ch cap in `shell.css`): "File too big.", "Not a .zip.", "No file yet.", "File is empty.", "No code chosen."; the button's reason beside it keeps the full sentence and is also the slot sentence's `title` (RV9; js §10 writes both, also on load for a page that starts blocked). On 18 to 18d the button carries `data-thread-when="file"` and js §10 swaps all of it (the thread, the reason, the slot parts, `data-thread-none`); 18e, 21b and 11b-style disabled buttons carry no hook. Every disabled button ships its `.pm-btn-reason` with an id in the same row (js creates one before the button only as a last resort, which breaks grid rows). | `<main class="pm-main" id="pm-main" data-thread-none="blocked">` … `<div class="pm-slot"><span data-show-when="blocked"><span class="pm-pin" data-status="blocked"><span class="pm-pin-head"><svg class="pm-pin-glyph" aria-hidden="true"><use href="#pm-g-x"/></svg></span><span class="pm-pin-label">Blocked</span></span><span class="pm-pin-sentence pm-slot-sentence" data-slot-why>Choose a file under 200 MB.</span></span><span class="pm-slot-sentence" data-show-when="ready" hidden>Your code is read once.</span><span class="pm-btn-reason" id="go-r">Choose a file under 200 MB first.</span><button class="pm-btn pm-btn--quiet" type="submit" form="pm-job" aria-disabled="true" aria-describedby="go-r" data-thread-when="file">Create private working copy</button></div>` |
| Other JS hooks | `[data-enable-when="text"][data-for="<textarea id>"]` (js §10: enabled when that textarea has text or any valid file is chosen; 20's "Use this document", reason "Add a document first."); `[data-spy]` (js §7); `pmMilestone(kind)` (js §11). Locked rail item reason (shell.js, RV9): `a.pm-rail-item[data-locked][data-locked-reason="Opens when your private copy is ready"]` (a `title` on the item is moved into `data-locked-reason` at load, so either works); the reason becomes the item's `aria-description` and its tooltip: collapsed "Interview (locked): Opens when your private copy is ready", expanded the reason alone; a runtime change of `data-locked` relabels the rail. Blocked tape step (s, RV10): `.pm-tape li[data-state="current"][data-status="blocked"]` wears the Blocked colour on its tick and number (23b). Breadcrumb collapse (shell.js + s, RV10): a trail of four or more crumbs whose links would be cut gets `nav.pm-crumb[data-collapsed]` and reads "Projects / … / leaf" at any rail state, re-measured when the top bar resizes. | `<span class="pm-btn-reason" id="use-r">Add a document first.</span><button class="pm-btn pm-btn--quiet" type="button" aria-disabled="true" aria-describedby="use-r" data-enable-when="text" data-for="req-text">Use this document</button>` |

### P.6 Decisions and open questions

**CPO rulings 2026-10-01 (decided, closed):** (R1) D-P2-1: the private copy follows the live build, "a private repository Pramaan holds". (R2) D-P2-2: the write rules follow the live build's own behaviour and wording: Lane A never writes back to the source; Lane B opens pull requests in the user's repository and never pushes to the default branch. (R3) Q2, .zip upload: kept exactly as the live build states it (200 MB .zip, 1 GB and 50,000 files unpacked); no further verification needed. (R4) The icon-only collapsed rail as the default below 1280px is accepted as designed (Ruling 7), with the permanent expand button and the one-time hint kept.

Recorded decisions (design follows the LIVE build where it speaks; each is flagged for the CEO where the sources conflict):

- **D-P2-1 Where the private copy lives.** The live build and the prototype say a private repository Pramaan holds ("A private repository named after your project", "pramaan/<user>-<project>"); backend decision D6 says repositories are customer-owned and "the platform never owns code". The design states the live build's version, in founder words on the screen ("Pramaan builds in its own private copy from here.", "Pramaan's private copy") and the literal fact under Details ("The private copy is a private repository Pramaan holds"). **Decided (CPO, 2026-10-01, R1): the live build's version stands; closed.**
- **D-P2-2 Opposite write rules.** Lane A never writes back to the source; Lane B writes branches and opens pull requests in the customer's repository and never pushes to the default branch. Both are stated verbatim on their screens and never mixed. The lane is chosen on 01 and can be switched only before a project exists. **Decided (CPO, 2026-10-01, R2): the live build's behaviour and wording stand; closed.** Whether a project can ever move from A to B (research Q12) is not designed.
- **D-P2-3 "Take a copy" as a mechanism.** Download a .zip ("Take a copy (.zip)"), available now in the design; "Export to GitHub is not available yet." stays the Waiting sentence (SPEC E). The live sentence "download it or export a copy to your GitHub whenever you want" is not quoted because its second half contradicts the product's own Settings. **CEO: is the .zip download real today? If not, the button becomes a Waiting sentence too.**
- **D-P2-4 Lane B journey.** The live build reuses the founder journey for repository projects; the CEO brief describes a request loop. The design gives Lane B its own home (Requests) and rail (Requests, Settings, Live logs) and a per-request measure instead of the five-step tape. Inferred, not observed. **CEO: does a Lane B project also get documents and a roadmap (research Q5), or only requests?**
- **D-P2-5 The request status vocabulary** maps the wire feature states to the seven pins: planned → Waiting; implementing, verifying, reviewing, publishing → Working (sentence names the stage); pr_open with review pending → Working ("The review is running, round n."); pr_open ready → Needs you ("Merge it when you are ready."); merged → Done; blocked, failed → Blocked. "Waiting for review" is not a label (there are seven); it is a Working sentence.
- **D-P2-6 Merging happens on GitHub.** The thread on a ready request is "Open pull request #42": the merge itself is the user's on GitHub (human merge by default, D11). Auto-merge is a Lane B setting (E), default off; exception paths are not drawn. **CEO: confirm no in-app merge button.**
- **D-P2-7 The imported document.** A requirements document brought on 20 becomes "Requirements · Draft 1 · imported by you" and is Needs you (the founder accepts it like any draft); the prototype's auto-accepted brief is not adopted (nobody accepted it). The interview step then reads done with "you brought a document instead" and still opens.
- **D-P2-8 The product idea is the first decision** on every idea-lane project (05b, 03, 05 agree).
- **D-P2-9 GitHub permission wording.** The unified GitHub App may ask for write scopes even when Lane A only reads; the screen says what Pramaan does ("reads your code once and never changes it") and that GitHub shows what it asks for; it does not promise a read-only permission. **CEO: confirm once the App unification lands.**

Closed: (Q2) code upload is kept as the live build states it (200 MB zip, 1 GB and 50,000 files unpacked, no .git; CPO R3, 2026-10-01).

Questions the design cannot decide (for the CEO), still open: (D-P2-4) does a Lane B project get an interview, documents and a roadmap, or only requests. (Q6) Who "reviewed" a pull request: the review agent, the PR bot, or both, and is the verdict shown to the user (the design shows "Round 1 asked for …, Round 2 passed." as plain lines). (Q8) Deployment: Lane B says "you deploy"; nothing in the app shows it; the design states it under "What stays with you" only. (Q9) What the copy step reads from the code and how long it takes (19 shows three steps, no durations). (Q10) Is dependency monitoring on by default for Lane A and B projects (16 shows it off for todo). (Q11) Errors not designed: install revoked mid-run, branch protection blocking the pull request, a pull request closed unmerged, merge conflicts, a Lane B baseline that already fails (the A8 "starting code" card is the only relative). (Q13) Branch choice, multiple repositories, monorepo subfolders and forks in the pickers (none offered).

### P.7 PRODUCT.md lines for the controller (do not edit PRODUCT.md from a WP)

Add under "## Users", after the first paragraph:

> A secondary audience uses one lane of the builder: an engineering team member ("Work in my repository") who owns a repository, reviews pull requests, merges and deploys. They may see "repository", "pull request" and "branch" in the interface; the voice stays plain and literal, and engineering identifiers still sit under Details. A third group is the founder who already has code ("Hand off your code"): the same founder persona, with one extra fear, that their original code gets changed.

Add under "## Product Purpose", after the journey sentence:

> Three ways in: describe an idea; hand off existing code (a .zip or a GitHub import that Pramaan copies into its own private copy and never writes back to); or work in a repository the team owns, where Pramaan opens reviewed pull requests and never pushes to the default branch.

Add under "## Operating Context":

> Lane B projects have no interview, documents or roadmap in this proposal: their home is a list of requests, each with a fixed status (Waiting, Working, Needs you, Done, Blocked) and a four-step measure (Build, Test, Review, Merge).

### P.8 Documentation tasks (WP16 and the controller)

1. `tools/build-system.mjs`: extend `FILES`/`NAMES` with 18 to 23 (and the b/c/d/e states), widen the linkify regex from `(0[1-9]|1[0-7])` to `(0[1-9]|1[0-9]|2[0-3])(b|c|d|e)?`, and the summary list; the coverage rows added in F (W-, L-, T-) must render and link.
2. `tools/system-parts`: p1 (six laws, Law 6 with its thresholds and a link to the tool), p2 (archetype table with the pass-2 rows, the fitted panel), p3 (new component articles with live samples in every state: lane switcher, choice cards and list, file field, copy flow, steps and mini steps, check, action cards, meter, document head, request composer and row, dictation, setting switch, bento tile, milestone line with a "Play once" review-only button), p5 (status words: the request mapping D-P2-5; the three moves unchanged; risks: add the three pass-2 risks from PLAN2 section 6).
3. `tools/build-flow.mjs` and `flow.js`: `NAMES`, `NAME`, `FIXES` for the 14 new screens; `LABEL` gains "Requests": "22", "Hand off your code": "18", "Work in my repository": "21", "Start a new product": "02"; actions: 18 "Create private working copy" → 19 with a Working toast "Copying your code."; 19 Journey-panel demo "Demo: copy finishes" → 20; 20 "Start the interview" → 05, "Use this document" → 08; 21 "Connect repository" → 22; 22 row → 23; 13 ready switch and the demo button call `pmMilestone("sprint-ready")`; 15 → 14 calls `pmMilestone("all-accepted")`. The journey list order: 01, 02, 03, 04, 05b, 05, 06, 07, 08, 09, 10, 11b, 11, 12, 13, 13b, 14, 15, 16, 17, 18, 18b, 18c, 18d, 18e, 19, 20, 21, 21b, 21c, 22, 22b, 23, 23b.
4. `tools/walk-flow.mjs`: two more walks: 01 → 18 → 19 → 20 → 05 and 01 → 21 → 22 → 23, asserting the same laws at every stop plus, on 22 and 23, that the rail has three destinations and the tape is hidden (22) or has four steps (23).
5. `README.md`: the tools list gains `whitespace.mjs` with its one-line purpose and the sentence "must end 0 failing"; the screens line becomes "34 static screens (01 to 23 with their b to e states)"; components-c.css joins the source table.
6. `DESIGN.md` is rewritten by the `impeccable-documenter` from the finished build (controller step), not by a WP; it must capture: Law 6 and the tool as a named rule ("The No Dead Space Rule"), the fitted panel, the bento overview, the lane components, dictation, the milestone stitch as the only state-change sequence, the two audiences and their vocabulary rule, and the pass-2 known gaps (the CEO questions in P.6).

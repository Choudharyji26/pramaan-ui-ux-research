---
name: Pramaan Builder, Tape and Thread
description: A made-to-measure fitting for a non-technical founder. Ink rail, one canary thread marking the next decision, chalk-slate annotation, pin-head status dots.
colors:
  ground: "#f5f6f8"
  surface-raised: "#ffffff"
  surface-sunken: "#e6e8eb"
  ink: "#15181f"
  ink-secondary: "#3f4349"
  ink-muted: "#55585e"
  ink-meta: "#606369"
  control-border: "#898c92"
  hairline: "#d2d4d8"
  rail: "#15181f"
  rail-active: "#272c32"
  text-on-rail: "#e6e8eb"
  text-on-rail-muted: "#b4b7bd"
  thread-canary: "#fad622"
  thread-canary-hover: "#e2b40a"
  thread-text: "#855a00"
  thread-text-hover: "#633f00"
  chalk-slate: "#326893"
  chalk-text: "#1d5178"
  chalk-tint: "#e1edf8"
  chalk-on-rail: "#aac8e3"
  status-needs-you: "#15181f"
  status-working: "#326893"
  status-waiting: "#606369"
  status-done: "#146d34"
  status-done-tint: "#d7f4dc"
  status-paused: "#a64a18"
  status-paused-tint: "#ffe5d8"
  status-blocked: "#a92321"
  status-blocked-tint: "#ffe3df"
  status-locked: "#606369"
  ground-dark: "#080b10"
  surface-raised-dark: "#15181f"
  surface-sunken-dark: "#272c32"
  text-dark: "#e6e8eb"
typography:
  digits:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "-0.01em"
    fontFeature: "tnum, lnum"
  title:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "24px"
    letterSpacing: "0"
  reading:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0"
  body:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "22px"
    letterSpacing: "0"
  label:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0"
  meta:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.01em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  chip: "4px"
  control: "6px"
  card: "10px"
  round: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "32px"
  "8": "40px"
  "9": "48px"
  "10": "64px"
components:
  button-thread:
    backgroundColor: "{colors.thread-canary}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "36px"
  button-thread-hover:
    backgroundColor: "{colors.thread-canary-hover}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-raised}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "36px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "36px"
  button-quiet-hover:
    backgroundColor: "{colors.surface-sunken}"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
  banner-done:
    backgroundColor: "{colors.status-done-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 20px"
  banner-blocked:
    backgroundColor: "{colors.status-blocked-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 20px"
  rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.text-on-rail}"
    width: "248px"
  rail-item-active:
    backgroundColor: "{colors.rail-active}"
    textColor: "{colors.text-on-rail}"
    rounded: "{rounded.control}"
    height: "36px"
  top-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    height: "56px"
  digit-block:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.digits}"
    rounded: "{rounded.chip}"
    height: "52px"
---

# Design System: Pramaan Builder, Tape and Thread

Where this lives: the whole system is a static HTML and CSS proposal at `docs/design-system/` (`tokens.css`, `base.css`, `shell.css`, `components-a.css`, `components-b.css`, `shell.js`, `components.js`, 20 screens in `screens/`, `system.html`, `flow.html`, `SPEC.md`). It has NOT been ported into the Next.js app. `app/tokens.css` and `app/globals.css` there are the marketing and site tokens and are unrelated. Porting is a separate step. Token prefix is `--pm-`; dark values are generated from `tools/gen-theme.mjs`, never hand-edited.

## Overview

**Creative North Star: "The Fitting Room"**

A made-to-measure fitting, not a dashboard. The founder walks into a room where the work is pinned up in order, one measuring tape shows where the garment stands, and one thread is held out: the next thing only they can decide. The tailoring lives in the visuals (tape, thread, pins, chalk, stitched hairlines, an ink rail like a dress-form jersey) and never in the words; the product keeps its own vocabulary (Interview, Documents, Roadmap, Build, Try it; accept, ask for changes, approve).

The mode is operate. The reader is a non-technical founder checking in over days, and every screen has one job and one next decision. Density is calm and desktop-only (1142x732 must work). The replaced look (cream and sage with a serif display) is the confirmed anti-reference; no cream, no serif display, no hero-plus-cards SaaS page.

The identity survives with all content removed: the ink rail at left, the tape journey rail in a hairline sticky bar, exactly one canary element at top right, pin-head status dots, chalk-slate annotation in the margin.

**Key Characteristics:**
- Restrained neutral ink ground, one committed canary, one cool chalk slate for annotation.
- Flat surfaces separated by 1px hairlines and a stitched dashed seam; shadows only on floating layers.
- One family for text (Schibsted Grotesk), mono only for ids and log lines.
- Status is a pin head plus a fixed word plus one plain sentence, never colour alone.
- One scroll per screen; the top bar and rail never scroll.

## Colors

Restrained strategy: cool jersey ink (hue 260, chroma under 0.015) carries roughly 90% of every screen; one committed canary thread marks the next decision; chalk slate annotates. Values are authored in OKLCH in `tokens.css` with a hex twin beside each (a documented sRGB equivalent, not a runtime fallback); the frontmatter uses the hex twin. All text and non-text pairs are checked in `tools/contrast.mjs` (0 failures).

### Primary
- **Tape Canary** (`thread-canary`, oklch(88% 0.175 96)): the thread. Fill of the single next-decision element per screen only, always with a 1px ink border and ink text (fill against white is only 1.43:1, so the border and label carry legibility). Hover is Canary Deep (`thread-canary-hover`). As text on light it steps down to Thread Umber (`thread-text`, hover `thread-text-hover`), used for inline links; in dark, thread text is the canary steps themselves.

### Secondary
- **Chalk Slate** (`chalk-slate`, oklch(50% 0.090 245)): tailor's-chalk annotation: the Working pin, the pen circle around the one Needs-you card, comment marks in the reader margin, info banners. Chalk text is `chalk-text`, tint is `chalk-tint`; on the ink rail it is the lighter `chalk-on-rail` (the active-item pen circle).

### Neutral
- **Paper Ground** (`ground`, #f5f6f8): page ground and top bar. **Raised White** (`surface-raised`): cards, panels, reader, chat. **Sunken Ink** (`surface-sunken`): inset wells, digit blocks, the user's chat message.
- **Jersey Ink** (`ink`, #15181f): body text, ink buttons, the rail. Secondary, muted and meta text step down through `ink-secondary`, `ink-muted`, `ink-meta` (4.5:1 or better on every surface they sit on).
- **Hairline** (`hairline`) for card edges and rows; **Control Border** (`control-border`, 3:1) for inputs and quiet buttons.
- **Rail** (`rail`, `rail-active`, `text-on-rail`, `text-on-rail-muted`): ink rail, its active row, and its text.
- **Dark theme** (`ground-dark` and siblings): ground ink-950, raised ink-900, sunken ink-800, text ink-100. The rail is ink-900, lifted one step above the ground and separated by a 1px ink-700 seam; the step alone is only 1.11:1 and is not relied on.

### Status colours
Each status has a strong colour and a tint (moss, clay, red tints; chalk tint; ink tints). Status text is always the status colour on its own tint or on paper, both checked pairs; body text on a tint stays ink.

### Named Rules
**The One Thread Rule.** Exactly one element per screen is filled canary, and it is the next decision. It sits in the top bar's thread slot (or the docked composer's Send, or the reading screen's action bar) and never scrolls away. If nothing needs the founder, there is no thread: the slot shows a pin and a status sentence and `main` declares `data-thread-none`. Navigation and housekeeping are never dressed as the thread.

**The Paper Not Cream Rule.** Neutrals stay cool and near-achromatic. Tinting the ground warm returns the anti-reference.

**The Status Is Never Only Colour Rule.** A status is always pin shape, fixed word and colour together.

## Typography

**Text Font:** Schibsted Grotesk (with Segoe UI, system-ui, sans-serif)
**Mono Font:** JetBrains Mono (with ui-monospace, Consolas, monospace), only for ids, digests, repo paths, log lines and code.

**Character:** a newspaper grotesk built for small sizes and long columns, with true tabular figures. One family carries UI, headings, reading and the engraved digits; the tape numerals are Schibsted with tabular figures, not mono.

Fonts are loaded from Google Fonts by a `<link>` in each page head (css2 endpoint, weights 400..900 and 400..700, `display=swap`). There is no self-hosting yet.

### Hierarchy (seven fixed steps, all line-heights multiples of 4)
- **Digits** (600, 28/32, -0.01em, tabular): engraved metric numerals and large-tape step numbers. Pure digits and a unit only ("3 / 3", "27 %"); never a thousands comma.
- **Title** (600, 22/28, -0.01em): the one `h1` per screen.
- **Heading** (600, 17/24): section, card, panel and document `h2`; banner titles; the gate question.
- **Reading** (400, 17/28, max 68ch): document body, chat messages, plan sentences.
- **Body** (400, 15/22; 14/20 at compact density): UI text, table cells, status sentences. `h3` is Body at weight 600.
- **Label** (500, 14/16): buttons, rail items, tabs, tape labels, pin labels.
- **Meta** (400, 12/16, +0.01em): timestamps, counts, breadcrumb, byline. Table column headers use Meta at weight 500, 0.06em tracking, uppercase.
- Mono uses the Meta size (13/20 in the compact log viewer). There is no eighth size.

### Named Rules
**The Proportional Prose Rule.** Meta, Body and Label are proportional. `.pm-tnum` (tabular, lining) is opt-in for column contexts only: numeric table cells, the log time column, the tape, "n of m" digit blocks. Tabular figures turn commas and colons into gappy figure-width glyphs in prose.

**The Seven Steps Rule.** No new size or weight. Table-header uppercase is a column-header device only and is not a licence for uppercase labels above content.

## Layout

A fixed ink rail at left (248px expanded, 64px collapsed), a sticky 56px top bar, and one `main` that owns the space. Main is one scroller (or a workbench grid where one inner region scrolls); the rail and top bar never scroll. Body is `overflow: hidden`; the side panel is sized `calc(100vh - 56px - 28px)` and scrolls only if its own content overflows.

- **Top bar** (56px, ground, stitched dashed bottom seam): Back (32px), clickable breadcrumb (Meta; collapses to "Projects / ... / leaf" below 1280px with the rail open), the tape journey rail (360 to 440px), and the thread slot (max 380px, 600px on tape-less bars) at far right.
- **Strip** (28px, project screens): "Last saved ... Last accepted ..." with a History popover, so nothing is ever lost.
- **Title row**: one `h1`, its plain sentence beside it, at most two quiet actions. The main job starts within about 140px of the viewport top (204px for stacked overview titles) and takes at least 60% of the width.
- **Content**: padding 24px (32px at 1440+), max 1120px. Side panel 320px (360px at 1440+); reader contents column 200px (220px); reading measure 68ch.
- **Archetype grids**: list, overview (main plus 320px panel), task (560px centered), chat and stage (main plus panel), reading (contents, 68ch, margin), plan (760px), board, settings (720px), log.
- **Rail state**: one choice per user, stored in `localStorage["pm.rail"]`, applied on every screen. Default is expanded at 1280px and up, collapsed below; a stored choice wins at any width; under 1024px the rail is always collapsed. A first-visit hint ("Menu labels are hidden. Expand navigation" with "Got it", stored as `pm.railhint=1`) shows once on a 1024 to 1279px window when nothing is stored.
- **Spacing**: 4px grid, steps 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Comfortable row 46px (12 + 22 + 12); compact 36px, applied only to tables, board, documents list and log viewer. Control height 36px (32 small, 40 large).
- **Scope**: desktop only. Below 1024px panels stack under the main job and nothing more; there is no mobile design.

## Elevation & Depth

Flat and tonal. Depth is the surface ladder (ground, raised white, sunken ink inside raised) plus 1px hairlines and the stitched seam. Shadows exist only on floating layers.

- **Float** (`0 8px 24px -8px oklch(21% 0.014 260 / 0.28), 0 2px 6px -2px oklch(21% 0.014 260 / 0.16)`): menus, popovers, toasts, the rail tooltip and hint.
- **Dialog** (`0 24px 48px -16px oklch(21% 0.014 260 / 0.4)`): dialogs over the scrim.
- Small inset rings and 2px halos (the tape pin's ground-coloured halo, the hollow Waiting ring) are drawing devices, not elevation.

**The Flat At Rest Rule.** Cards, panels and bars carry no shadow at rest. A hover changes border colour, never lifts.

**Motion.** State changes 120ms, reveals 180ms, layout (rail collapse, tape pin slide, panel dock) 240ms; ease-out `cubic-bezier(0.2, 0, 0, 1)`, exits `cubic-bezier(0.3, 0, 1, 1)`. Nothing animates on page load. Only the Working pin's dashed ring and the loading skeleton pulse loop. Under `prefers-reduced-motion` durations drop to 0 (opacity fades at 120ms) and loops stop.

## Shapes

Small, quiet radii: 4px (chips, pin labels, digit blocks, tape steps), 6px (buttons, inputs, rail items, composer), 10px (cards, panels, banners, dialogs), 999px (pin heads, avatars, the tape pin). Borders are 1px hairlines; the only thicker strokes are the 1px ink border on the thread button and the 1.5px chalk pen circle. Stitch (a 1px dashed hairline, 6px dash, 4px gap) marks section seams, the top bar's bottom edge and the tape baseline. Icons are 1.5px round-cap strokes in `currentColor` from an inline SVG sprite (20px, 16px in controls). The pen circle is a slightly rotated (-2deg) chalk ellipse, one per list.

## Components

### Buttons
- **Shape:** 6px radius, 36px tall (32 small, 40 large), Label type, 16px side padding.
- **Thread:** canary fill, ink text, 1px ink border, weight 600; hover canary deep. Only one per screen (Law 1).
- **Ink:** ink fill, white text; hover ink-700. **Quiet:** transparent with 1.0 control border; hover sunken. **Ghost:** secondary text, hover sunken. **Danger:** blocked-red outline and text; hover red tint.
- **Disabled:** `aria-disabled` (keeps focus), sunken fill, hairline border, muted text, always with a reason line beside it. **Loading:** gerund label and a 16px non-looping ring. Pressed moves 1px down.
- **Focus:** 2px ink outline, 2px offset, plus a 4px ground-coloured halo; on the rail the outline is chalk-300.

### Status Pin (signature)
A 10px round head, a fixed label and one plain sentence. Seven states only:

| Pin | Head | Plain sentence pattern |
|---|---|---|
| Needs you | filled ink | "Pramaan is waiting for your decision." |
| Working | filled chalk, dashed ring turning while live | "Pramaan is working on this now." |
| Waiting | hollow ring, no tint | "Waiting for something else to finish first." |
| Done | filled moss with check | "This is finished and saved." |
| Paused | filled clay | "Paused, with the reason stated." |
| Blocked | filled red | "A check failed and Pramaan is fixing it." |
| Locked | filled grey-ink | "Opens after an earlier step is accepted." |

The sentences are the pattern, not fixed copy; each screen states the actual reason. An `info` head (chalk) exists only as a banner kind and carries no label. The label never wraps. The tinted variant (28px, 4px radius) is used in tables and cards.

### Top bar and thread slot
Back, breadcrumb, tape, slot. The slot holds the thread button or a pin plus a two-line clamped sentence; never empty.

### Tape journey rail (signature)
A stitched baseline with 2px major ticks per step and three 1px minor ticks between them. Steps are links; done steps are moss, the current step is ink at weight 600, locked steps are grey-ink with a lock. A 10px ink pin with a 2px ground halo and a 1px shank marks the real project stage, positioned by `shell.js` through `--pm-tape-x`. Sub-progress is n of m 4px ticks under the label. A large variant (640px, Digits-size numbers) appears on project overview only.

### Ink rail
Wordmark, All projects, project block with a status dot, project steps (36px items, Label type), budget row (4px track), user row. The active item has a rail-active fill and a chalk pen circle ellipse around its label. Collapsed (64px) shows 36px icon tiles, a permanent 40px expand button, lock badges, and a fixed tooltip on hover and focus. Budget is a "Monthly limit" in million units with percent used; tokens live only under Details.

### Action bar and approval gate
A 52px sticky bar on reading screens holding pin, question (Heading type) and consequence-named actions ("Ask for changes", never "Reject"). The gate variant is auto-height, static in flow, with a hairline card border. When the gate's bar is visible its top-bar copy is hidden so only one thread shows.

### Banners
Grid of pin, title and text (max 60ch), optional action, optional Details. Tinted by status; Needs-you carries a 1px ink line on its top edge. Info uses chalk tint.

### Cards
White, 1px hairline, 10px radius, 16px padding, no shadow. Project card: the whole card is one link (28px tile, name, next-step line, meta, an arrow that appears on hover or focus); hover darkens the border to control border. The decision card gets the chalk pen circle around its Needs-you label, one per list.

### Digits (engraved metrics)
72px rows: a sunken 52px-tall block holding the tabular Digits numeral (with an inset 1px bottom-right edge), then a Meta label over a muted plain sentence. Empty state is a short dash, not zero.

### Tables
Sticky column header under the top bar (Meta, uppercase, 0.06em tracking, plain words with the file's own term in `title`), 46px rows (36 compact), hairline rows, sunken hover, whole-row link, ink focus outline inset. File codes sit in a closed Details inside the cell, never as a column.

### Inputs and forms
36px controls, 6px radius, control-border stroke (3:1), native checkboxes and radios in ink via `accent-color`, placeholder ink-meta. Composer: textarea grows 1 to 6 lines then scrolls inside itself.

### Reader
Contents column (200px) with a current-section marker, a single scrolling 68ch article at Reading size with sticky section heads, a byline with version links, a chalk margin where a commented passage gets a 2px chalk underline and a mark. Each working-term heading has a one-line plain gloss beneath it. The advanced group is one closed disclosure.

### Chat, route, board, stage, log
Chat: 720px flow, messages at Reading size, the user's message on a sunken 10px card, a question card whose footer is docked and sunken, composer docked at the bottom (its Send is the thread on chat screens), decisions panel with 46px two-line rows. Route: dots on a vertical line with status colours. Stage: preview with a checklist panel beside it. Log: plain rows (time and event in plain words) with codes and raw lines under Details.

### Popovers, dialogs, toasts
Float shadow for popovers and toasts, dialog shadow plus scrim for dialogs; toast enters with 8px rise at 180ms and leaves at 90ms.

### Review-only controls
The state switch and flow Journey panel wear `.pm-review-only` (dashed border, Meta text, labelled "Review only:") and never ship.

## Do's and Don'ts

### Do:
- **Do** fill exactly one element canary per screen: the next decision. Put it in the top bar slot, or the docked Send, or the reading action bar.
- **Do** show a pin and a plain sentence in the slot when nothing needs the founder, and declare `data-thread-none` on `main`.
- **Do** keep every screen to one `h1`, one scroll, and a main job that starts near the top and takes at least 60% of the width.
- **Do** use only the seven status pins with their fixed labels, each followed by one plain sentence, and put wire words as facts inside that sentence or under Details.
- **Do** name actions by their consequence and give any disabled control a visible reason.
- **Do** put engineering facts (ids, digests, repo paths, tokens, event codes) under Details, and add a one-line gloss under any working-term heading.
- **Do** use only `--pm-sys-*` and `--pm-cmp-*` in components; colour literals live only in `tokens.css`, and dark values come from `tools/gen-theme.mjs`.
- **Do** keep hairlines 1px and reserve the stitched dash for section seams, the top bar edge and the tape baseline.

### Don't:
- **Don't** use cream, warm tints or a serif display; that is the replaced look.
- **Don't** dress navigation ("Open Build") or housekeeping ("Take a copy") as the thread.
- **Don't** add heroes, eyebrows or kickers, marketing bands, or an explainer panel wider than 320px.
- **Don't** signal status by colour alone or invent an eighth status.
- **Don't** use tabular figures in prose, a thousands comma in a Digits value, or an eighth type size.
- **Don't** put a shadow on cards or bars at rest, or add a coloured side stripe to a row or callout.
- **Don't** use em-dashes in UI copy, or the word "Reject".
- **Don't** nest scrollers, or let the rail or top bar scroll.
- **Don't** design for mobile widths yet; below 1024px only the rail collapse and stacking exist.

## Known gaps and spec-versus-build notes

- **Not ported.** The system exists only in `docs/design-system/`; the Next.js app still ships the old look.
- **Fonts.** Schibsted Grotesk and JetBrains Mono load from Google Fonts by link; no self-hosting yet.
- **Tape pin slide** is demonstrable only in `flow.html`; static screens show the pin in place.
- **Rail.** Below 1280px the collapsed 64px rail is the default; the first-visit hint compensates. The dark rail is lifted one ink step above the ground (Ruling 8), and its edge relies on the 1px seam.
- **Reader heading clip.** A stuck reader section heading can clip an ascender line under its hairline. Open defect.
- **Copy.** "All 1 planned sprints accepted." is the real app's wording, kept verbatim as a wire word; it is an awkward plural, not a style to imitate.
- **SPEC contradictions with the build.** (1) SPEC B.1 heading says "hex fallback" while Ruling 5 and `tokens.css` say the hex is a documentation twin only; the build follows Ruling 5. (2) SPEC B.5 states "No coloured side stripes", but the reader contents link for the current section draws a 2px inset ink stripe (`box-shadow: inset 2px 0 0`); the build carries it, this file does not adopt it. (3) SPEC B.1 says `scratchpad/contrast.mjs`; the tool ships as `tools/contrast.mjs`. (4) SPEC C.1 draws the shell with the rail expanded at 1142 although the default there is collapsed (Ruling 7 wins).

## Pass 2 additions

Pass 2 (2026-09-30 to 2026-10-01) adds one law, two lanes, four adapted trend items and a third component file. Everything above still holds; where a pass-2 sentence disagrees with an older one, pass 2 wins (SPEC part P and Rulings 9 to 16). The system now covers 34 screens: 01 to 23 with their b to e states. Its companion files are `SPEC.md` part P, `PLAN2.md`, `system.html` and `flow.html`.

### Law 6: No Dead Space

**The No Dead Space Rule.** No empty rectangle of ground colour may sit where content should be. Measured on the 8px cell grid of the content box (the main area minus the sticky top bar and the strip, inset by the content padding on the top, left and right), at 1142x732 and 1440x900, light theme, default rail: (L6.1) the first viewport holds no empty rectangle 240px wide and 160px tall or larger; (L6.2) the empty rectangle anchored at the content box's top-right corner is never both 240px wide and 120px tall; (L6.3) the stitched whole scroll of every scroller holds no empty rectangle 240 by 240 or larger, and a tail (an empty band touching the end of the content) is at most 240px tall.

How it is tested: `node docs/design-system/tools/whitespace.mjs` (options `--rail expanded|collapsed` and `--quiet`) renders every screen at both viewports, finds the empty rectangles, writes annotated screenshots to `shots/whitespace/` and must end `0 failing`. The whole set is 68 checks (34 screens, two viewports). The thresholds are constants in the tool (`FIRST`, `CORNER`, `SCROLL`, `TAIL_MAX`) and nobody widens them without a ruling.

Breathing room is enumerated, not argued. The allowlist has exactly four rows: the side margins of a deliberately centred column (`.pm-arch-task`, `.pm-arch-task2`); the thread rest under the last chat message, at most 320px (`.pm-chat-flow`); the column under a fitted side panel or the contents rail (`.pm-panel--fit`, `.pm-toc`); and the inside of the preview iframe. A page-end tail of at most 240px on a page that does not scroll is also exempt. Five measurement tolerances (T1 to T5) make each row measure what it says: one cell of rounding under a last child; a 32px gutter either side of a fitted panel or the contents rail; the chat rest spanning its whole column; a last-column fitted panel owning the remainder of its grid; and text fields and designed empty states counting as content even while empty.

Space is absorbed only by real content or by a better-fitted container: a supporting panel that states facts the system already has, a larger main job (two-line rows, a 10-row textarea, full-height skeletons), a next-step panel, previews of real content. Never filler sentences, invented statistics, tips, decorative illustrations or stretched tables.

**The fitted panel** (`.pm-panel--fit`, Ruling 10). A side panel is never taller than its content: content height, a hairline border, card radius, sticky under the top bar on page screens. The ground under it is breathing room. The full-height edge-to-edge panel survives only where its content fills it (the log list, the reader).

### Four trend items, adapted

Each comes from trend research and fits the existing laws: none adds a second thread, hides a fact, or moves without a state change.

- **Dictation** (`.pm-dictate`). A 40px ghost mic button in the composer writes into the text box; nothing is ever sent by voice. States: idle, listening (the Working dash ring is the only motion), done, unavailable (with its reason), error (a Blocked pin and a plain sentence). On 05, 05b, 06, 20, 22 and 22b.
- **One autonomy setting** (`.pm-setting`). A single plain switch, "Check with me before each sprint starts", whose consequence sentence changes with the state, plus a consequence line on the roadmap gate and the sprint strip. No permission matrix and no "always allow". On 16, with lines on 11 and 13.
- **Bento overview** (`.pm-bento`). Importance-sized tiles in reading order: the decision banner as the lead tile (it keeps `data-gate` and the one thread), three digit tiles, what happens next, workspace facts. No `order` property, no tile without a sentence. On 03, 04 and 19; never on lists or boards.
- **Quiet milestone** (`pmMilestone`). The only state-change sequence: when a sprint becomes ready to try (13) or all sprints are accepted (14), the tape's done checks draw themselves once (240ms, staggered 80ms), the current step's ticks fill, and one line appears. At most 600 to 700ms, never on load, no confetti or sound, and under reduced motion the end state appears at once.

### Two lanes and their screens

Three first-class entries on the projects list (Ruling 13), with a shared lane switcher on 02, 18 and 21.

- **Hand off your code (Lane A), for a founder who already has code.** Screens 18 (upload a .zip), 18b (import from GitHub), 18c (file too big), 18d (not a .zip), 18e (GitHub needs permission), 19 (the overview while the private copy is made) and 20 (bring a requirements document or start the interview; it joins 05 or 08). Write rule, stated verbatim: "Pramaan never writes back to where the code came from."
- **Work in my repository (Lane B), "For engineering teams".** Screens 21 (choose a repository, with the GitHub App check), 21b (App not installed), 21c (no repositories), 22 (requests in rank order with a composer), 22b (no requests yet), 23 (one request, ready to merge, with its four-step request tape) and 23b (a check did not pass). Write rule, stated verbatim: "Pramaan never pushes to your default branch." A Lane B project has no interview, documents or roadmap in this proposal; its rail is Requests, Settings and Live logs.
- **Two audiences, one voice** (Ruling 14). The shell, pins, buttons and tape anatomy are identical on every lane; only the words change. Lane B screens may say repository, pull request, branch and merge, with branch names and pull request numbers in a row's meta line, never inside a pin sentence. Every other screen keeps the founder vocabulary, and "repository" appears there only inside a live safeguard sentence quoted verbatim. Request states reuse the seven pins (planned is Waiting; implementing, verifying, reviewing and publishing are Working; a pull request ready to merge is Needs you; merged is Done; blocked and failed are Blocked).
- **The thread on a form is enabled or absent** (Ruling 15). A form whose thread cannot be pressed yet declares `data-thread-none="blocked"`, shows the reason, and renders the button quiet and `aria-disabled`; a disabled button is never filled canary.

### New components and where they live

`docs/design-system/components-c.css` holds the pass-2 components: lane switcher, choice cards and choice list, file field, copy flow, steps, mini steps and the check, action cards, meter, decisions brief block, document head, request composer and rows, dictation, setting switch, bento tiles, quiet milestone, two-line table, device switch and frame, plan aside, skeleton route card, and contents comments. The pass-2 block at the end of `shell.css` holds the new archetypes (task with aside, settings with aside, plan with aside, build, request), `.pm-panel--fit` and the `pm-content` container. Behaviours are sections 9 to 12 of `components.js` (dictation, file field and copy flow, milestone, setting switches and the request composer). `components-c-demo.html` shows every state and `system.html` documents each one with live samples.

### Decisions and open questions

Decided by the CPO on 2026-10-01 (closed): R1, the private copy follows the live build, "a private repository Pramaan holds". R2, the write rules follow the live build's behaviour and wording: Lane A never writes back to the source, and Lane B opens pull requests in the user's repository and never pushes to the default branch. R3, the .zip upload is kept exactly as the live build states it (200 MB .zip, 1 GB and 50,000 files unpacked). R4, the icon-only collapsed rail as the default below 1280px is accepted as designed, with the permanent expand button and the one-time hint kept.

Still open, for the CEO (SPEC P.6): whether a Lane B project also gets documents and a roadmap, or only requests (D-P2-4); whether the .zip download behind "Take a copy" is real today (D-P2-3); confirmation that there is no in-app merge button (D-P2-6); confirmation of the GitHub permission wording once the GitHub App unification lands (D-P2-9); who "reviewed" a pull request and whether the verdict shows (Q6); how deployment is shown for Lane B (Q8); what the copy step reads and how long it takes (Q9); whether dependency monitoring is on by default for Lane A and B projects (Q10); the undesigned error states: a revoked install, branch protection, a pull request closed unmerged, merge conflicts, a failing baseline (Q11); and branch choice, multiple repositories, monorepo subfolders and forks in the pickers (Q13).

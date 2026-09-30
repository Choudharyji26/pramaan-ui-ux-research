# WP2: shell.css, shell.js and the canonical skeleton (Tape and Thread)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Do not edit `tokens.css` or `base.css` (report gaps instead). Use only `--pm-sys-*` and `--pm-cmp-*` tokens; no hex, no raw colour functions, no `--pm-ref-*`.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: A (laws), B.6 (motion, focus), B.8, B.9, all of C (layout grammar), D.2 (rail item), D.3 (journey tape), D.4 (breadcrumb and back), D.1 only the Thread Action description (you render the slot, WP3 styles the button; include a minimal `.pm-btn--thread` placeholder rule ONLY if WP3's file is not present yet, and remove it before handing back if it is), G.1 (large tape), G.2 (the strip).
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\PLAN.md` sections 1, 3, 4.
3. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\tokens.css` and `base.css` (read fully; use their names).

## Write

### `docs/design-system/shell.css`

- `.pm-app { display: grid; grid-template-columns: var(--pm-rail-w) minmax(0, 1fr); height: 100vh }`; `html[data-rail="collapsed"] { --pm-rail-w: 64px }`; transition of `--pm-rail-w` is done on `.pm-rail { width: var(--pm-rail-w); transition: width var(--pm-motion-layout) var(--pm-ease-out) }` and on `.pm-app` via `transition: grid-template-columns ...`.
- `.pm-rail` (`position: fixed; inset: 0 auto 0 0; z-index: var(--pm-z-rail); background: var(--pm-sys-surface-rail); color: var(--pm-sys-text-on-rail); display: flex; flex-direction: column; padding: 8px 8px; overflow: hidden`): parts with the exact heights from SPEC C.2 (wordmark row 56, All projects 40, seam 1, project block 56, destinations 36 each, spacer, budget 44, user 48). Rail item styles per D.2 (default, hover, active with `aria-current`, focus with `--pm-sys-focus-on-rail`, locked with the lock glyph, collapsed icon-only with `title`). The pen circle: an inline SVG `<ellipse>` inside `.pm-rail-item[aria-current="page"]` positioned absolutely around the label (expanded) or icon (collapsed), stroke 1.5px `var(--pm-sys-chalk-on-rail)`, fill none, `transform: rotate(-2deg)`. Only one exists.
- Icons: author a small inline SVG sprite in `screens/_skeleton.html` (`<svg style="display:none"><symbol id="i-overview">...`), 20x20 viewBox, 1.5px stroke, round caps, for: overview (4 squares), interview (speech line), documents (page), roadmap (route with 3 nodes), build (hammer or bricks: choose one simple 3-line glyph), try-it (cursor click), settings (sliders), live-logs (terminal chevron), back (arrow-left), collapse (chevrons-left), expand (chevrons-right), search, attach (paperclip), send (arrow-up), check, lock, x, pause bar, copy, chevron-down, external. No emoji, no Unicode glyph icons anywhere.
- `.pm-topbar` per C.3: `position: sticky; top: 0; z-index: var(--pm-z-topbar); height: var(--pm-topbar-h); background: var(--pm-sys-ground); display: grid; grid-template-columns: auto 1fr auto auto; gap: 16px; padding: 0 var(--pm-content-pad); align-items: center`, bottom stitch via `::after`. Back button `.pm-back` (32x32 ghost). Breadcrumb `.pm-crumb` (Meta; links muted with underline on hover; leaf weight 600; separators in hairline colour). Thread slot `.pm-slot` (right aligned; when it holds a sentence instead of a button, it renders a pin + Body muted text).
- `.pm-tape` per D.3: `<nav class="pm-tape" aria-label="Your journey"><ol>` with five `<li data-state="done|current|upcoming|locked" data-progress="2/3">`. Baseline stitch, major tick 2x8, three minor ticks 1x4 between steps (draw with `::before` repeating gradient on the `<ol>`), number/check/lock glyph, label, sub-progress ticks, and the you-are-here pin (10px round `--pm-cmp-tape-pin` with 2px halo of `--pm-sys-ground` and a 1px shank) positioned on the current step with `transform: translateX(var(--pm-tape-x))`. Width `min-width: 360px; max-width: 440px; margin: 0 auto`. `.pm-tape--large` (overview only): 640px wide, numbers at Digits size, pin shank extended 24px downward.
- `.pm-strip` per G.2: 28px, Meta, hairline bottom, two `<time>` values, a quiet "History" link opening a popover (`popover` attribute) listing 8 rows.
- `main.pm-main` for page screens: `height: 100vh; overflow-y: auto; scroll-padding-top: calc(var(--pm-topbar-h) + 16px)`; `main.pm-main--workbench`: `height: 100vh; overflow: hidden; display: grid; grid-template-rows: var(--pm-topbar-h) var(--pm-strip-h) minmax(0, 1fr)` (and a two-row variant without the strip for Live logs).
- Title row `.pm-title` (h1 + optional sentence + right slot for at most two quiet actions or a search field) per C.4; `.pm-content { max-width: var(--pm-content-max); padding: 0 var(--pm-content-pad) var(--pm-space-8) }`.
- Archetype grids from C.6 as classes: `.pm-arch-list`, `.pm-arch-overview` (`grid-template-columns: 1fr var(--pm-panel-w)`), `.pm-arch-task` (560px centred; 600 at 1440), `.pm-arch-chat`, `.pm-arch-reading` (`var(--pm-toc-w) minmax(0, 68ch) minmax(80px, 1fr)`), `.pm-arch-plan`, `.pm-arch-board`, `.pm-arch-stage`, `.pm-arch-settings` (720px), `.pm-arch-log`. Side panels: `.pm-panel { height: calc(100vh - var(--pm-topbar-h) - var(--pm-strip-h)); overflow-y: auto; background: var(--pm-sys-surface-raised); border-left: var(--pm-hairline) }`.
- Sticky section header helper `.pm-section-head { position: sticky; top: 0; z-index: var(--pm-z-sticky-section); background: var(--pm-sys-surface-raised); border-bottom: var(--pm-hairline) }` (inside scrollers) and `.pm-section-head--page { top: var(--pm-topbar-h) }` (inside `main.pm-main`).
- Basic do-not-break under 1024px: rail forced collapsed, panels stack below the main job (`grid-template-columns: 1fr`). Nothing more.

### `docs/design-system/shell.js` (vanilla, no build step, loaded with `defer`)

- Rail toggle: reads `localStorage["pm.rail"]`, applies `data-rail` on `<html>` before first paint is not possible with defer, so also add a 3-line inline script in the skeleton `<head>` that sets `data-rail` and `data-theme` from localStorage (document it in the skeleton). Toggle button flips and persists; `aria-expanded` updated; keyboard `[` toggles; arrow keys move between `.pm-rail-item`s (roving tabindex).
- Workbench auto-collapse: if `main.pm-main--workbench` exists and `innerWidth < 1280` and `localStorage["pm.rail.pinned"] !== "1"`, set collapsed; when the user expands on a workbench screen, set `pm.rail.pinned = "1"`.
- Tape pin positioning: compute the current step's tick centre and set `--pm-tape-x`; recompute on resize; when `data-state` of the current step changes (flow.html will do this), animate over `--pm-motion-layout`.
- Theme toggle helper `window.pmTheme(next)` persisted in `localStorage["pm.theme"]`; the user menu in the rail exposes "Dark theme" as a switch.
- Nothing runs on load except reading state and positioning the pin; no entrance animations.

### `docs/design-system/screens/_skeleton.html`

The canonical page every screen builder copies. Contains: doctype, `<html lang="en" data-rail="expanded">`, the inline head script, `<title>`, the font links (copy them from the comment at the top of base.css), links to `../tokens.css`, `../base.css`, `../shell.css`, `../components-a.css`, `../components-b.css` (link the last two even if they do not exist yet; a missing stylesheet is harmless in a static page), `<script defer src="../shell.js">` and `../components.js`, the SVG sprite, the full rail (project "todo", all 8 destinations, budget 18%, user), `<main class="pm-main">` with the top bar (Back, breadcrumb `Projects / todo / Documents`, tape with Interview done, Documents current with progress 3/3, Roadmap upcoming, Build upcoming, Try it locked, and the thread slot holding `<button class="pm-btn pm-btn--thread" data-thread>Accept this draft</button>`), the strip, the title row (`<h1>Documents</h1>` + sentence), and a `<!-- MAIN JOB STARTS HERE (y must be <= 140px) -->` placeholder with 2000px of filler so scrolling can be tested. Add HTML comments naming each region and how to vary it (projects list variant without project block, workbench variant, no-tape variant).

### `docs/design-system/shell-demo.html`

Same as the skeleton but with three additional states switchable by buttons in the content: rail collapsed, dark theme, workbench layout (a 1fr scroller + 320 panel), plus the large tape and a Live-logs variant (no strip, no tape). Every state must pass `tools/shoot.mjs`.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/_skeleton.html docs/design-system/shell-demo.html
```
Both must end with `0 failing` at 1142x732 and 1440x900. Then Read every PNG in `docs/design-system/shots/` and fix what looks wrong (rail fits 732 with no scrollbar; top bar stays; tape readable; thread at top right; rail collapsed state clean). Also add a one-off probe (scratchpad only) proving the rail's `scrollHeight === clientHeight` at 732 and that the main job placeholder top is <= 140px at 1142x732; paste both numbers.

## Scope limit

shell.css (target under 700 lines), shell.js (under 200 lines), `_skeleton.html`, `shell-demo.html`, the SVG sprite. No component styling beyond what the rail, top bar, tape and strip need. If you need a button or pin style, use the class names from SPEC D.1/D.5 and leave the styling to WP3.

## Hand back

Report format in PLAN.md section 3. List the exact class names and data attributes you introduced so screen builders can rely on them.

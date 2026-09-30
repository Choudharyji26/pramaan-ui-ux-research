# Tape and Thread: the Pramaan builder design system

Static proposal files. Nothing here is app code and nothing needs a server: open any `.html` file by double-clicking it (file:// works). Fonts load from Google Fonts, so the pages look right when online.

## Start here

| File | What it is |
|---|---|
| `system.html` | The living style guide: the six laws (Law 6 with its tool), rulings, tokens, contrast table, every component with live samples (pass 2 included), the two lanes and four trend items, screen thumbnails, coverage matrix, decisions and open questions. Theme and density buttons sit in its title row. |
| `flow.html` | The click-through prototype: all 34 screens in journey order in one page, including both lanes (start from the projects list: "Hand off your code" or "Work in my repository"). The Journey panel (bottom right) jumps to any screen and has "Demo: sprint finishes" and, on screen 19, "Demo: copy finishes". |
| `screens/*.html` | The 34 static screens (01 to 23 with their b to e states). The founder journey is 01 to 17 with the 05b, 11b and 13b states; Lane A, "Hand off your code", is 18 to 20 (18b to 18e are its states); Lane B, "Work in my repository", is 21 to 23 (21b, 21c, 22b and 23b are its states). They link to each other through the rail, the tape, the breadcrumb and the project cards. `_skeleton.html` is the canonical shell every screen copies. |
| `SPEC.md` | The authoritative specification (laws, tokens, layout, components, copy, coverage; part P is pass 2). |
| `PLAN.md`, `PLAN2.md` | The execution plans (pass 1, pass 2) and the shared content fixture. `PLAN2.md` covers dead space, the two lanes and the four trend items. |

## Source files

| File | What it holds |
|---|---|
| `tokens.css` | Reference, system and component tokens; light, dark and compact density. The only file with colour literals. |
| `base.css` | Reset, fonts, type steps, utilities, focus, selection, scrollbars, skeleton. |
| `shell.css`, `shell.js` | Ink rail, sticky top bar, journey tape, thread slot, nothing-is-lost strip, archetype grids; rail state, roving focus, tape pin, theme helper. The pass-2 block at the end of `shell.css` holds the new archetypes, the fitted panel `.pm-panel--fit` and the `pm-content` container. |
| `components-a.css` | Buttons, action bar, pins, banners, cards, digits, table, forms, search, chips, disclosure, empty, locked, error, popover, dialog, toast. |
| `components-b.css` | Reading document, chat workbench, sprint route, feature board, approval gate, preview stage and checklist, log viewer. |
| `components-c.css` | Pass-2 components: lane switcher, choice cards and list, file field, copy flow, steps and check, action cards, meter, document head, request composer and rows, dictation, setting switch, bento tiles, quiet milestone, two-line table, device frame, plan aside, skeleton route card, contents comments. |
| `components.js` | The small behaviours: gates, decisions, verdicts, chat, reader, logs (sections 1 to 8) and, for pass 2, dictation, file field and copy flow, the milestone, setting switches and the request composer (sections 9 to 12). |
| `showcase.css` | Styles used only by `system.html`, plus the review-only chrome. |
| `flow.js` | The prototype's screen switching (flow.html only). |
| `tokens-demo.html`, `shell-demo.html`, `components-*-demo.html` | Builder demo pages for each layer. |
| `briefs/` | Historical work-package and review briefs. Do not implement from them; SPEC.md wins. |
| `shots/` | Screenshots written by the tools. Generated, not source. |

## Tools

Run from the `pramaan-web` folder (they use the repo's installed `lightningcss`, `playwright-core` with the installed Chrome, and `jsdom`):

```
node docs/design-system/tools/contrast.mjs      # OKLCH ladder and WCAG pairs; must end "Failures: 0"
node docs/design-system/tools/check-css.mjs     # compiles every stylesheet, bans hex and --pm-ref-* outside tokens.css; "0 failing"
node docs/design-system/tools/shoot.mjs         # screenshots + layout laws at 1142x732 and 1440x900; "0 failing"
node docs/design-system/tools/whitespace.mjs    # Law 6, No Dead Space: empty rectangles at both viewports; must end 0 failing
```

`shoot.mjs` takes file paths too (for example every `.html` under `docs/design-system`). Generators, run after editing their sources:

```
node docs/design-system/tools/build-flow.mjs    # rebuilds flow.html from the screens; then:
node docs/design-system/tools/walk-flow.mjs     # clicks through the journey and both lanes and asserts the laws on every stop
node docs/design-system/tools/build-system.mjs  # rebuilds system.html from tools/system-parts, SPEC tables and the contrast output
```

Edit a screen, then rebuild `flow.html`. Edit `tools/system-parts/*.part`, `SPEC.md` (sections E and F) or the colour ladder, then rebuild `system.html`. Never hand-edit the two generated pages.

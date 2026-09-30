# WP16: generators, prototype, walk and README for pass 2 (system.html, flow.html, walk-flow, README)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You own: `tools/build-system.mjs`, `tools/system-parts/*.part`, `tools/build-flow.mjs`, `flow.js`, `tools/walk-flow.mjs`, `README.md`, `showcase.css` (additive only), and the two generated files `system.html` and `flow.html` (never hand-edited: you regenerate them). You do not edit screens, shared CSS (other than showcase.css), `components.js` or `SPEC.md`. You start when the wave-2 builders (WP11 to WP15) have handed back; the reviewers RV8 to RV10 fix screens in parallel with you, so you regenerate `flow.html` and `system.html` once more after the controller tells you they are done.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16; A.3 (six laws); C.6 (pass-2 archetype rows); E (all "Pass 2:" rows); F (rows W-, L-, T-); part P whole, especially P.8 (your task list, item by item) and P.4.4 (milestone triggers in the flow).
2. `PLAN2.md` sections 1, 2, 6 (the three pass-2 risks go into system.html's risks section).
3. `tools/build-system.mjs`, `tools/system-parts/p1..p5.part`, `tools/build-flow.mjs`, `flow.js`, `tools/walk-flow.mjs`, `README.md`, `showcase.css` whole.
4. `components-c.css`, `components-c-demo.html` (lift its samples into the style guide's new component articles), `components.js` sections 9 to 12, and every screen under `screens/` (the 34 files) so the journey list and the FIXES sentences are true.

## Write

1. `tools/build-system.mjs` (SPEC P.8 item 1): `FILES` and `NAMES` for `18`, `18b`, `18c`, `18d`, `18e`, `19`, `20`, `21`, `21b`, `21c`, `22`, `22b`, `23`, `23b` (names from PLAN2 section 1's table, shortened to a few words); the linkify regex becomes `/\b(0[1-9]|1[0-9]|2[0-3])(b|c|d|e)?\b(-[a-z-]+)?/g` with the lookup on the number plus suffix; the coverage summary lists every screen in order (01 … 23b) and the "Every project screen" row; the em-dash and row-count logs stay.
2. `tools/system-parts`: p1: the laws table gains Law 6 (its three thresholds, the allowlist in one sentence, the tool's command) and the pass-2 rulings 9 to 16 under the rulings list; p2: the archetype table gains the pass-2 rows and a short "fitted panel" paragraph; p3: new component articles in the same `ss-comp` structure with live samples for: lane switcher, choice cards and list, file field (all states), copy flow (three states), steps and mini steps, check, action cards, meter, document head, request composer and rows, dictation (five static states, plus one live button), setting switch (three states), bento tiles (a full bento), milestone (a tape plus a `.pm-review-only` "Play once" button with `data-milestone-trigger="sprint-ready"` and a `[data-milestone-line]`), two-line table, device switch and frame, plan aside, skeleton route card, TOC comments; p5: status words gains a "Requests (Lane B)" table with the D-P2-5 mapping; the risks section gains the three pass-2 risks from PLAN2 section 6; the thumbnails grid (if p5 or p3 has one) gains the 14 new screens.
3. `tools/build-flow.mjs`: `NAMES` for the 14 new screens; the journey order is the file sort order (18 … 23b follow 17 naturally; confirm the `05b`/`11b`/`13b`-style sort puts `18b` after `18` and before `18c`).
4. `flow.js` (SPEC P.8 item 3): `NAME` and `FIXES` for the 14 new screens (one sentence each, naming the coverage rows: for example 18 "L-2 the copy-flow diagram follows the form; L-8 no repository in founder words except the two safeguard sentences."); `LABEL` gains "Requests": "22", "Hand off your code": "18", "Work in my repository": "21", "Start a new product": "02"; the project-card map gains `"insight-weaver-537": "22"`; the actions table gains: `["18", /^Create private working copy/, go 19 + toast working "Copying your code."]`, `["21", /^Connect repository/, go 22]`, `["20", /^Start the interview/, go 05]`, `["20", /^Use this document/, go 08]`, and a Journey-panel demo button "Demo: copy finishes" that goes 19 → 20 (shown only on 19); the existing "Demo: sprint finishes" calls `window.pmMilestone("sprint-ready")` after switching 13 to ready, and the 15 "Accept" path that lands on 14 calls `window.pmMilestone("all-accepted")` after the screen switch (both guarded). Lane B screens: the rail snapshot already carries three destinations; make sure `targetOf` maps their labels (Requests → 22). The tape for 23 comes from its snapshot; for 22 (`tape: null`) the tape stays hidden.
5. `tools/walk-flow.mjs` (SPEC P.8 item 4): after the existing walk, two more: from 01 click "Hand off your code" → expect 18; click "Create private working copy" → 19 (assert the rail has five `[data-locked]` items); click "Demo: copy finishes" → 20; click "Start the interview" → 05. From 01 click "Work in my repository" → 21; click "Connect repository" → 22 (assert three rail destinations, no visible tape, one visible thread); click the first request row → 23 (assert four tape steps). Every stop runs the same `check` and saves `shots/flow-<nn>.png`.
6. `README.md` (SPEC P.8 item 5): tools list gains `whitespace.mjs` ("Law 6, No Dead Space: empty rectangles at both viewports; must end 0 failing"); the screens row says 34 screens (01 to 23 with their b to e states) and names the lanes; the source table gains `components-c.css` (pass-2 components) and notes the pass-2 block of `shell.css` and sections 9 to 12 of `components.js`; a one-line pointer to `PLAN2.md`.
7. Regenerate: `node docs/design-system/tools/build-flow.mjs`, `node docs/design-system/tools/build-system.mjs`.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/build-flow.mjs
node docs/design-system/tools/walk-flow.mjs
node docs/design-system/tools/build-system.mjs
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/system.html docs/design-system/flow.html
node docs/design-system/tools/whitespace.mjs docs/design-system/flow.html
```
walk-flow, check-css, shoot and whitespace end `0 failing`; build-system prints `failures 0` for contrast and `em dash: false`; build-flow prints `em dash: false` and `screen file links left: 0`. Read `shots/flow-18.png`, `flow-19.png`, `flow-20.png`, `flow-21.png`, `flow-22.png`, `flow-23.png` and `system-1142x732-scrolled.png`. Probe (scratchpad, paste): in system.html every `href="screens/…"` resolves to an existing file (count of broken links = 0) and the coverage summary lists 34 screens; in flow.html the Journey list has 34 entries in the SPEC P.8 order.

## Scope limit

The files listed above. No screen or shared CSS/JS edits: report gaps to the reviewers through the controller.

## Hand back

PLAN.md section 3 format plus the four tool outputs' last lines, the probe output, and the list of any screen whose snapshot broke the flow (with the selector that failed).

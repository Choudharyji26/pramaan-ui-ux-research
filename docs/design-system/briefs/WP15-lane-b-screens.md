# WP15: Lane B, Work in my repository (screens 21, 21b, 21c, 22, 22b, 23, 23b)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/screens/`. No git commands. Never publish an Artifact. Do not edit any shared CSS or JS; if a style is missing, use the closest existing class and list the gap. Page-specific `<style>` under 40 lines per file, tokens only. You create seven new screens by copying `screens/_skeleton.html` (with its pass-2 sprite, including `i-requests`).

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16 (7, 9, 10, 13, 14, 15); A.3; C.2 (the rail with fewer destinations), C.3, C.4, C.6 (Requests and Request archetypes); D.1, D.3 (the tape anatomy you reuse for the request measure), D.5 (pins; and P.6 D-P2-5 for the request mapping), D.6, D.7 (rank order), D.11 (composer), D.16, D.17, D.18; E rows headed "Pass 2:" for lane switcher, 21, 21 aside, 21b, 21c, 22, 22 rows, 22b, 23, 23b, tape request, dictation; part P: P.1, P.3.1, P.3.2, P.3.4, P.3.5, P.3.6, P.4.1, P.5.1 to P.5.3, P.5.7, P.5.11, P.5.12, P.6 (D-P2-4 to D-P2-6: decided; the UI never shows a designer note).
2. `PLAN2.md` sections 3 and 4 (the insight-weaver-537 fixture: requests, meta lines, measures, strip, the repository list).
3. `components-c.css`, the pass-2 block of `shell.css`, `components.js` sections 9 to 12, `components-c-demo.html` (hooks: `.pm-choice-list`, `.pm-check`, `.pm-ticks`, `.pm-request-composer`, `.pm-request-list`, `.pm-steps`, `.pm-steps--mini`, `[data-dictate]`, `.pm-arch-request`, `.pm-panel--fit`).
4. The live build's copy: `C:\Users\adity\AppData\Local\Temp\claude\C--Users-adity-Desktop-Claude-Lives-here-Pramaan-project-Pramaan\d174c604-a009-48a9-b644-f452709e8325\scratchpad\research-lanes-live.md` (Lane B section: the title, subtitle, "Choose your repository", the check sentence, the four ticks and the two items are verbatim).

## Write (all under `docs/design-system/screens/`)

1. `21-repo-connect.html`: per P.3.4 "21": list-level rail, breadcrumb "Projects / Work in my repository", no tape, `.pm-lanes` current "Work in my repository", `.pm-arch-task2` with the form (`#pm-job`: legend "Choose your repository", the search field, the six-row `.pm-choice-list` with the disabled row and its reason, "Showing 6 of 33", the verbatim fact sentence, the `.pm-check` Done) and the aside `.pm-ticks.pm-tile.pm-panel--fit` ("How this works", "What stays with you", the bold sentence). Slot: sentence + thread "Connect repository".
2. `21b-repo-connect-permission.html`: the check Blocked with its two sentences; the thread is `<a class="pm-btn pm-btn--thread" data-thread href="#">Install the Pramaan app on GitHub</a>` in the slot; "Connect repository" quiet, `aria-disabled`, reason "Install the app first." beside it.
3. `21c-repo-connect-empty.html`: the list replaced by `.pm-empty` (D.16) with the E sentences; the search field stays; the thread "Install the Pramaan app on GitHub".
4. `22-repo-requests.html`: project rail with the project block ("insight-weaver-537 · Needs you", budget 15%) and exactly three destinations: Requests (`i-requests`, active with the pen circle), Settings, and Live logs after the 12px gap; breadcrumb "Projects / insight-weaver-537 / Requests"; no tape (omit the `nav.pm-tape` element); strip "Last merged: 'Export the weekly report as CSV', Tuesday 14:10 · History" with a History list of the merged request and the four sends; title h1 "Requests" + sentence; `.pm-request-composer` (`#pm-job`) with label, textarea, attach, dictation, `.pm-btn--ink` send "Send the request", hint; `.pm-request-list` with the four rows in rank order (Needs you, Blocked, Waiting, Done: see PLAN2 section 4 for each row's title, pin, sentence, meta and measure), rows linking to `23-repo-request.html` (23b for the Blocked row); slot: Needs you pin + sentence + thread `<a data-thread href="#">Open pull request #42</a>`.
5. `22b-repo-requests-empty.html`: no rows; `.pm-empty` under the composer; the send is the thread (`pm-btn--thread`, `data-thread`, 40px); the slot holds the sentence "Nothing needs you. Describe the first change." with no pin; strip "Nothing merged yet. Your first request is kept the moment you send it."; the rail's project block "insight-weaver-537 · Waiting".
6. `23-repo-request.html`: breadcrumb "Projects / insight-weaver-537 / Requests / Let admins archive old workspaces", Back to Requests (href 22), rail as 22, strip as 22, the request tape in the top bar (`nav.pm-tape[aria-label="This request"]` with four steps Build, Test, Review, Merge: done, done, done (title "Review: 2 rounds"), current with the pin; every step a link to `#` anchors on the page or `aria-disabled` per D.3), h1 the request title + sentence "Started Tuesday. Reviewed twice.", `.pm-arch-request`: main column with the Needs-you banner `data-gate` (thread "Open pull request #42" as an `<a>`; the slot carries the hidden copy per D.14), "What Pramaan did" `.pm-steps` (four Done rows with their facts), "What you asked for" (the fixture text at Reading size in a sunken block), closed Details (branch, pull request, request id, jobs); aside `.pm-ticks.pm-tile.pm-panel--fit.pm-panel--sticky` "What stays with you" + Details "Default branch: main".
7. `23b-repo-request-blocked.html`: for "Send a summary email every Monday": Blocked banner (no thread, `main[data-thread-none="blocked"]`, slot "Blocked · Fixing round 2."), tape Build done, Test done, Review current (the tick and number in the Blocked colour: add `data-status="blocked"` on the `li` and a 1-line page style if the shared tape lacks it, report the gap), Merge locked; steps Done, Done, Done, Working "Fixing what the review found" with the Details line.

Every screen: one `h1`, the seven pins only, sentences under 14 words where possible, no em dash, no emoji; branch names and pull request numbers in the meta lines (mono) and Details, never inside a pin sentence; commit ids and job ids only under Details.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/check-css.mjs
node docs/design-system/tools/shoot.mjs docs/design-system/screens/21-repo-connect.html docs/design-system/screens/21b-repo-connect-permission.html docs/design-system/screens/21c-repo-connect-empty.html docs/design-system/screens/22-repo-requests.html docs/design-system/screens/22b-repo-requests-empty.html docs/design-system/screens/23-repo-request.html docs/design-system/screens/23b-repo-request-blocked.html
node docs/design-system/tools/whitespace.mjs <the same seven files>
```
All end `0 failing` at both viewports; also `whitespace.mjs --rail expanded` on 22 and 23 at 1142 (report). Read every PNG. Probe (scratchpad, paste): on 22 the rail has exactly 3 `.pm-rail-item` destinations after the project block and no `.pm-tape`; on 22 the visible `[data-thread]` count is 1 and the send button has class `pm-btn--ink`; on 22b the send is the only `[data-thread]`; on 23 the tape has 4 `li` and the visible thread count at rest is 1 (the banner's) and after scrolling `main` 600px still 1 (the slot's); on 21 every one of the seven verbatim Lane B sentences (SPEC P.3.6) is present character for character (print each found/missing).

## Scope limit

Seven new HTML files, no shared CSS or JS edits.

## Hand back

PLAN.md section 3 format plus the PLAN2 section 3 lines per file, the probe output, and the coverage rows you demonstrate (L-5, L-6, L-7, L-8, T-1 on 22 and 22b).

# WP10: pass-2 behaviours (components.js sections 9 to 12)

You are a Sonnet builder. Do not invoke any Skill and do not spawn agents. Do not touch `app/`, `components/`, `lib/` or anything outside `docs/design-system/`. No git commands. Never publish an Artifact. You own exactly one file: `components.js`. You append sections 9 to 12 after section 8 and make one additive change to section 7 (the scroll spy). You never edit a stylesheet or a screen; WP9 writes the CSS for the same hooks at the same time from SPEC P.4 and P.5, and `components-c-demo.html` (WP9) is where your code is first exercised. If the demo page does not exist yet when you finish, test with a scratchpad page that copies the markup from SPEC P.5 and delete it after.

## Read first (absolute paths)

1. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\SPEC.md`: Rulings 1 to 16; A.3 Law 1 (One Thread) and Law 2; B.6 (motion); D.11 (composer), D.14 (gates), D.17 (switch, file), D.18; part P: P.2 F8 (the plan aside spy), P.3.3 (18 to 20 behaviours), P.4.1 (dictation), P.4.2 (setting switch), P.4.4 (milestone), P.5.4, P.5.5, P.5.11.
2. `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web\docs\design-system\components.js` whole (style: vanilla, `defer`, every block guarded so pages without the component do nothing; keep that).
3. `shell.js` (the theme and tape helpers you may call: `pmTheme`, the tape pin positioning) and `flow.js` (how the prototype calls into components.js; do not edit it).

## Rulings that bind you

- Nothing is sent by voice, ever. No auto-send, no auto-submit on silence.
- Milestone: plays only on a state change, never on load; total sequence at most 700ms; under `prefers-reduced-motion: reduce` set the end state at once (no `data-milestone` timing needed, but the line still appears).
- No new loops: the listening ring reuses the Working dash CSS (`data-live="true"` on the button while listening).
- Every block guarded; no console errors on any page that lacks the component; no globals besides `window.pmMilestone`.

## Write (append to components.js)

**Section 9, Dictation (`[data-dictate]`).** At load: for each button, resolve the textarea from `data-dictate` (an id selector) and the status element (`[data-dictate-status]` inside the nearest `.pm-composer, .pm-request-composer, .pm-field`). If neither `window.SpeechRecognition` nor `window.webkitSpeechRecognition` exists: set `aria-disabled="true"`, a `data-state="unavailable"`, `aria-describedby` to the status element, and write the unavailable sentence (SPEC E, "Pass 2: dictation") into the status. Otherwise on click toggle: start → `aria-pressed="true"`, `data-state="listening"`, `data-live="true"`, `aria-label="Stop dictating"`, swap the `<use>` href from `#pm-i-mic` to `#pm-i-stop`, status = the listening sentence; recognition `continuous: true`, `interimResults: true`, `lang = document.documentElement.lang || "en"`; results: keep an insertion range in the textarea; final results are appended at the caret with a leading space when needed; interim text replaces the previous interim span; fire `input` on the textarea after every write so the composer's auto-grow (section 6) runs; stop (click again, Escape, or `onend`) → idle state, status = the done sentence for 4s then restore the original hint text (store it once in `data-hint`); errors map to the three Blocked sentences (`no-speech`, `not-allowed`/`service-not-allowed`, anything else) rendered as a Blocked pin + sentence in the status for 6s. Focus stays in the textarea while listening.

**Section 10, File field and copy flow.** For each `.pm-file input[type=file]`: on change write "name · N MB" (MB rounded to the nearest whole, KB below 1 MB) into the field's `[data-file-name]` and into every `[data-flow-source-value]` on the page; validate: a name not ending in `.zip` (case-insensitive) → the field gets `.pm-file--error`, its helper gets the not-a-zip sentence with a Blocked pin, the button label "Choose another file", the page's copy-flow chip `[data-flow-source-chip]` text "Not a .zip"; size over 200 x 1024 x 1024 → the too-big sentence, chip "Too big"; valid → clear the error, chip "Read once · never changed"; then set the form's thread: a button `[data-thread-when="file"]` becomes enabled (remove `aria-disabled`, hide its `.pm-btn-reason`, add `data-thread`, swap classes `pm-btn--quiet` → `pm-btn--thread`, remove `data-thread-none` from `main`) when valid, and the reverse when invalid (Ruling 15). Source radios `input[name="source"]`: value `upload` shows `[data-source="upload"]` and hides `[data-source="github"]` (and vice versa) and writes `[data-flow-source-label]` "Your upload" / "GitHub". Text-or-file enable: buttons `[data-enable-when="text"]` (20's "Use this document") enable when the referenced textarea (`data-for`) has non-blank text or the file field has a valid file; otherwise disabled with the reason in place.

**Section 11, Milestone.** `window.pmMilestone = function (kind)`: find the visible `.pm-tape` (top bar or `.pm-tape--large`); if `matchMedia("(prefers-reduced-motion: reduce)").matches` skip the attribute; else set `data-milestone=kind` and remove it after 700ms. Then un-hide the first `[data-milestone-line]` on the page (remove `hidden`; the CSS fades it). Also wire: any `[data-milestone-trigger="<kind>"]` button (the demo's "Play once", 13's review-only "Ready to try" chip) calls it once per click. Never call it on load.

**Section 12, Setting switch, request composer and spy.** (a) Every `input.pm-switch[role="switch"][aria-describedby]` whose described element has `data-on` and `data-off`: on change write the matching text. (b) `.pm-request-composer`: Ctrl+Enter submits (reuse section 6's handler if it is generic; otherwise mirror it), the send button is `aria-disabled` with reason "Type the change first." until the textarea has text, then enabled; submit appends nothing (static), shows the 4s inline Done "Request sent. Pramaan starts on a new branch." in the hint and clears the textarea. (c) Section 7's scroll spy: generalise so that any `[data-spy]` container (the plan aside's `<ol>`) with links `href="#id"` marks `aria-current="location"` on the link whose target section (`.pm-route-node[id]`) is in view of the page scroller (`main`), using the same skip-hidden logic; the reader keeps working unchanged. Guard everything.

## Checks (from `C:\Users\adity\Desktop\Claude Lives here\Pramaan project\Pramaan\pramaan-web`)

```
node docs/design-system/tools/shoot.mjs docs/design-system/components-c-demo.html docs/design-system/screens/05-interview-running.html docs/design-system/screens/09-document-draft.html docs/design-system/screens/11-roadmap-awaiting.html
```
`0 failing` and no console errors (the pass-1 screens must be unaffected by your additions). A scratchpad Playwright script (paste its output): on the demo page, click the dictation button with `webkitSpeechRecognition` stubbed to emit one interim and one final result, assert the textarea text, `aria-pressed`, the status sentence, and that pressing Escape returns to idle; with the API deleted before load, assert `aria-disabled="true"` and the unavailable sentence; choose a fake 312 MB `.zip` `File` on the file input and assert the too-big sentence and that `main` has `data-thread-none="blocked"`; call `pmMilestone("sprint-ready")` and assert `data-milestone` is set then gone after 800ms and the line is visible; with reduced motion emulated assert `data-milestone` is never set and the line still shows; flip the setting switch and assert the sentence swaps.

## Scope limit

One file. Under 260 added lines. No CSS, no screen edits, no flow.js edits (WP16 wires the prototype).

## Hand back

PLAN.md section 3 format plus the script output and the exact list of hooks you consume (attributes and classes) so WP9 and the screen builders can grep them.

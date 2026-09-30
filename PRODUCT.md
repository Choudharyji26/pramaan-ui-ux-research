# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The builder app's user is a non-technical founder: a freelance translator, a workshop owner, a
newsletter writer (the dogfood projects are Dues, Seats and Dispatch). They have an idea for a
product, they are not fluent in software vocabulary, and they are anxious about a process they
cannot see into. They work at a desktop browser (mobile is explicitly not a priority) and come
back to a project over days: to answer an interview question, read and accept a document,
approve a sprint plan, watch a sprint build, or try the built product.

A secondary audience uses one lane of the builder: an engineering team member ("Work in my repository") who owns a repository, reviews pull requests, merges and deploys. They may see "repository", "pull request" and "branch" in the interface; the voice stays plain and literal, and engineering identifiers still sit under Details. A third group is the founder who already has code ("Hand off your code"): the same founder persona, with one extra fear, that their original code gets changed.

## Product Purpose

Pramaan is the product builder: describe the product you want, accept the PRD and design, and
Pramaan builds it with proof at every step in a repository you own. In the app the journey is
Interview (chat with an AI product partner) -> Documents (product brief and other assets, read,
comment, accept) -> Roadmap (sprint plan, approve) -> Build (sprints with progress) -> Try it
(preview against a checklist), plus per-project Settings and Live logs.

Three ways in: describe an idea; hand off existing code (a .zip or a GitHub import that Pramaan copies into its own private copy and never writes back to); or work in a repository the team owns, where Pramaan opens reviewed pull requests and never pushes to the default branch.

Success is a founder who
always knows where they are, what the one next decision is, and can make it without scrolling
for it.

## Positioning

A governed builder: every stage ends in a human decision the founder can make in plain words
(accept, ask for changes, approve), and the repository is theirs. A neighbouring code-generation
chat tool does not offer accepted assets, sprint gates and proof before the next step.

## Operating Context

Screens are operate-mode: long documents to read, a chat to answer, a plan to approve, a build to
watch, a product to try. Project states vary (interview running or finished, drafting documents,
plan awaiting approval, sprint building, all sprints accepted, paused, locked during a sprint).
The dependency tracker / connect console is now a per-project setting, not a main surface.

Lane B projects have no interview, documents or roadmap in this proposal: their home is a list of requests, each with a fixed status (Waiting, Working, Needs you, Done, Blocked) and a four-step measure (Build, Test, Review, Merge).

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, Turbopack), React 19, CSS modules plus `app/tokens.css` and
  `app/globals.css`, Clerk auth, deployed as a Cloudflare Worker via OpenNext.
- Desktop only; the reviewer's window is 1142 x 732, so layouts must work there without nested
  scrollers or clipped headers. Keep basic do-not-break behaviour at narrower widths only.
- CSS-module rule: never use `:global { }` block form (breaks the Turbopack build); every
  stylesheet change is gated by a lightningcss compile and the 1024 containment journey.
- Vocabulary is a design surface: engineering terms (versions, diffs, digests, ids, finding
  labels) live behind a Details disclosure; wire status words stay verbatim as facts with a plain
  sentence beside them.
- Undecided: the exact fixed set of short status states (feedback B3 asks for one); whether the
  left panel collapses to an icon rail or hides.

## Brand Commitments

Existing name: Pramaan. Current display face Fraunces and body face Geist are incumbent and are
treated as evidence, not as binding (the user asked for a new, out-of-the-box system).
Original painterly and pixel-art illustrations exist (docs/ILLUSTRATIONS.md).

## Evidence on Hand

- Reviewer feedback, 2026-09-30: two Word documents in ~/Downloads ("Pramaan UI Feedback for the
  Designer" with and without screenshots): 9 screens, pins, issues A1-A8, B1-B4, five themes.
- The reviewed screens are the CEO's fixture-driven design prototype (git branch
  `origin/yogi100x/product-builder-ux-mockup`, route `/prototype`; alternative variations on the
  `-v2-langfuse` and `-v3-halftone` branches). Its decision history is in that branch's
  docs/design/ (`product-builder-ux-prototype.md`, `product-builder-feedback-20260926.md`,
  `zoom-design-feedback-20260926.md`). The checked-out `integrate/yc-demo-final-20260817` app
  is an older P0 UI without these screens.
- Fixture mode (`BUILDER_FIXTURES=1`) renders the P0 app from tests/fixtures/contracts/p0.
- Prior design proposals and specs in docs/design/. No real customers, testimonials or metrics
  exist to show; none may be invented.

## Product Principles

1. The one next decision is always visible: the primary action of a screen is at the top, sticky,
   and framed by its consequence.
2. The main job of a screen owns the space; supporting content is compact and stays in view.
3. The founder always knows where they are and can always go back (clickable journey, breadcrumb,
   back).
4. Plain words first; engineering facts on demand.
5. One scroll per screen: no nested scrollers, no clipped or vanishing headers.

## Accessibility & Inclusion

Keyboard focus rings and body/meta contrast (above 6:1) currently pass and must not regress.
Target WCAG 2.1 AA. Non-native-English readers are likely; keep sentences short and literal.

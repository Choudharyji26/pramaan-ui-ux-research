# Pramaan builder: PM audit against the moat and competitive-delta analysis

Date: 2026-10-03. Scope: the product builder (product-loop backend and `apps/web`). Method: two Opus
evaluators read the code through git refs, with no checkouts and no runs. Each judged SHIPPED (code
and tests), DESIGNED (spec only) or ABSENT.

## Read this first

- **Code state.** Judged against `origin/integrate/yc-demo-final-20260817` of product-loop
  (`a87e3a2e`, #775, 2026-10-02). The local checkout is 113 commits behind, and pramaan-web is
  checked out on `ui-ux-research`, so local files don't reflect what was judged.
- **One correction.** The moat evaluator read the older pramaan-web repo and reported "no plan,
  sprint, preview, UAT or go-live UI". I checked origin: all of those screens exist under
  `product-loop/apps/web` (roadmap, sprints, sprint review, previews, UAT checklist, go-live panel,
  code-export callback). I raised criterion 3 from 2 to 3 for that reason.
- **The input is Reddit sentiment, not research on our users.** The analysis was written by and
  for developers and investors. Our persona is a non-technical founder (translator, workshop owner,
  newsletter writer). I note below where a criterion doesn't transfer.
- Scores are judgments. Nothing was run, and there are no external tenants yet.

## Scorecard

| # | Criterion | Score | One line |
|---|---|---|---|
| M1 | Proprietary behavioral data | 1/5 | Captured richly, never read back; no consent or terms for using it |
| M2 | Encoded institutional knowledge | 3/5 | 15 versioned skills, golden set gating PRs; classifier flaky, prompts copyable |
| M3 | Workflow integration | 3/5 | Backend and UI both deep; maintain loop paused, previews/export off by default |
| D1 | Cost predictability | 2/5 | Strong ledger and hard stop; no price before a run; founder's budget gates nothing |
| D2 | Output quality / anti-slop | 3.5/5 | Real gates, shipped with tests; no live preview, almost no visual steering |
| D3 | No lock-in / exportability | 2.5/5 | Plain files and ZIP; Pramaan owns the repo, GitHub export off, no BYO key |
| D4 | Business logic over boilerplate | 1/5 | Only browser-only templates; auth, payments and email rewritten per project |

## The wedge

**Output quality (D2) is the real, shipped differentiator.** A separate `evaluator` agent writes
failing acceptance tests first, and the implementer runs on a different model and cannot edit them.
An independent reviewer then judges the diff against what the checks proved. Lint, typecheck, test and
build run on every feature and on the whole sprint head, which directly answers the "regressions after
new generations" complaint. Each sprint ends with a preview and a plain-language checklist. Lovable and
Bolt don't do this. (Files: `lib/builder/feature-contract.mjs`, `review.mjs`, `feature-verifier.mjs`,
`verify.mjs`, `packages/builder-skills/evaluator/SKILL.md`.)

**Hard spend stop is a credible second wedge**, once the founder's budget is the number that controls
it (see D1).

## Claimed but not shipped

1. **"Nothing gets built an eighth time" (NORTH-STAR) vs the builder.** The stack guide tells the agent
   to write `src/auth/`, `src/payments/` and `src/email/` itself in every project
   (`packages/builder-skills/stacks/node-typescript.md`). `cost.md` references
   `/context/capabilities/*.md`, but nothing provides that folder. `provider-packs` is unused by the
   builder. No `crud` or `saas` template exists, so Dues, Seats and Dispatch are built from scratch.
2. **The founder's "Monthly budget" (D44) gates nothing.** The real gate is a fixed $60/month constant
   (`lib/llm-budget.mjs`, `MONTHLY_BUDGET_MICROS`). The "Update budget" links in `roadmap.tsx` and
   `sprint-status.tsx` send a blocked founder to a number that can't unblock them. There is no price
   before a run, and no billing.
3. **"Every sprint ends with a preview" (D39) and "take your code to your GitHub" (D45).** Both are
   off by default (`PREVIEW_DOMAIN_NOT_SET`, `GITHUB_EXPORT_UNAVAILABLE`). Hosting needs `SITES_DOMAIN`,
   which is unset (D50).
4. **The data flywheel.** No aggregation, no consent, no terms page. Golden cases are reconstructed,
   and the weekly real-run baseline is empty.

## Per-criterion detail

### M1 Proprietary behavioral data: 1/5
- **Shipped (captured):** `agent_runs` (skill_version hash, model, tokens, cost, failure_class),
  `asset_versions.feedback`, `asset_findings` with a closed code taxonomy, sprint reviews and
  verifications, `plan_revisions`, `interview_decisions`.
- **Absent:** any cross-project query; any feed into prompts, routing, templates or evals; consent
  or data-use language; retention beyond the project (everything cascades on delete).
- **Move:** add a data-use clause to terms before the first real tenant (S). Build an anonymised
  outcome ledger (skill_version × archetype → first-pass accept rate, regenerations, finding codes,
  repair rounds, cost) (M). Turn consented "ask for changes" feedback into golden and calibration
  entries (S each).

### M2 Encoded institutional knowledge: 3/5
- **Shipped:** 15 skills, each with SKILL.md, `guardrails.json` and `output.schema.json`; content-hash
  versions on every run; archetype decision table in code; a 24-entry CEO-labelled calibration set with
  a runner; a G01-G10 golden set gating builder PRs in stub mode; rejected-reply fixtures.
- **Gaps:** calibration scores 20-22 of 24 against a bar of 22 and flips between runs. Only `static`
  and `tool` templates exist. Only 3 rejected fixtures. The Loop kernel is not wired. The knowledge
  is dogfood tuning, and a competitor can paraphrase the markdown quickly.
- **Move:** best-of-3 calibration bar plus 20 real founder descriptions (S); every UAT failure and
  major review finding becomes a candidate fixture (M); ship the `crud` template (see D4).

### M3 Workflow integration: 3/5
- **Shipped:** Pramaan-owned repos in `pramaan-build` (D34/D45), worktree sprint execution, verify,
  review, merge, previews and UAT, live hosting, the customer-repository PR lane (D47), PR review bot,
  and the web screens for roadmap, sprints, review, preview, UAT and go-live. Accepted documents are
  committed under `product/` in the repo.
- **Gaps:** the maintain loop is off. Dependency monitoring is paused (D49), hosting is blocked on the
  domain decision (D50), and post-launch change requests exist only in the backend.
- **Inverse risk:** holding the founder's repo is a trust objection (D34 reversed "the platform never
  owns code"), and the stickiness lives in history and hosting that don't leave with the export.
- **Move:** turn on previews and hosting (ops); build "request a change against accepted documents"
  into the web UI (M); restore dependency watch as a founder-safe feature (M).

### D1 Cost predictability: 2/5
- **Shipped:** per-call dollar cost recorded; reservation at the dearest rate so unpriced models are
  never counted as free; $60/month hard stop with a $30 alert; per-skill caps with a one-time "Try
  again" grant (D46). Tests: `builder-dollar-budget`, `builder-spend-ceiling`.
- **Gaps:** founder budget is a display token count, not the gate; no estimate on "Approve plan &
  build"; the marketing page frames this as a principle ("not a number invented before the work
  exists"); pramaan-web settings still show raw `budget.monthly_tokens`; no pricing model.
- **Move:** make the founder's dollar budget the actual gate (S); show a dollar range on plan approval
  from `agent_runs.cost_micros` history (M).

### D2 Output quality: 3.5/5
- **Gaps:** no live preview (previews only at sprint end, and off by default); no visual design step
  and no mockup asset kind; `theme.css` belongs to the template, so the founder can't steer the brand;
  browser end-to-end tests deferred; calibration measures only the classifier, so PRD and code quality
  are unmeasured.
- **Move:** previews on in production (S, ops); let the founder choose accent colour, type and density
  at project start, which writes `theme.css` (M).

### D3 No lock-in: 2.5/5
- **Shipped:** plain Markdown/YAML under `product/`, stock Next.js with pnpm scripts, ZIP download,
  one-time copy to the founder's GitHub (`code-export.mjs`).
- **Gaps:** Pramaan owns the working repo and the founder gets copies with no sync back; GitHub export
  off by default; no bring-your-own-key (model key comes from operator env); working copies of
  documents live in the database and reach the repo only as snapshots on approval; no local run mode.
- **Move:** enable GitHub export (S); ongoing "push to my GitHub" mirror (M). BYO key and local mode:
  see below, deprioritise.

### D4 Business logic over boilerplate: 1/5
- Only `templates/static` and `templates/tool`. The tool template forbids a database, new API routes
  and outside services. The current plan says "stop doing new templates for crud/saas/AI"
  (`docs/handoffs/pramaan-loop-plan-20260930.md`), which conflicts with what the dogfood projects need.
  One stack (D15), no shared foundation, so larger projects pay for boilerplate again.
- **Move:** one `crud` template with auth, Postgres, migrations, email and tenancy pre-built and
  protected from edits (L). This is the gating item for Dues, Seats and Dispatch.

## What survives when a frontier model ships "idea to app"

Doesn't survive: document generation, the classifier, the skill prompts. Does survive: gated custody
(sandboxed pinned tests, approval before write, append-only spend and version ledgers, cost caps), the
verified-build guarantee where the founder's sprint check gates the merge (D41), hosting and plain-language
operations, and the outcome ledger **if it is ever built**.

## Persona check: where the pasted analysis doesn't transfer

- **"Local-first, bring your own keys, open in my editor"** is a developer's ask. For a translator or
  workshop owner the equivalent is "I own this and can leave": a visible Export button, plain-language.
  BYO key and a local run mode are low priority. Making Export prominent matters more than either.
- **"AI slop"** for this persona means generic-looking, wrong-for-my-business output. The visual
  steering gap (D2) is the part of the complaint we actually exhibit.
- **Cost predictability** is likely more important here than for developers: a non-technical founder
  can't reason about tokens, so a dollar range before approval is the right shape.

## Ranked moves

| Rank | Move | Effort | Why now |
|---|---|---|---|
| 1 | Founder dollar budget becomes the real gate; dollar range on plan approval | S then M | Fixes a claimed-vs-shipped gap and strengthens the second wedge |
| 2 | Turn on previews and GitHub export in production (domain decisions D50/D51) | S, ops | Two decided features that are inert today |
| 3 | Data-use clause in terms; start the outcome ledger | S then M | Must precede the first external tenant; nothing compounds without it |
| 4 | `crud` template with protected auth/data/email foundation | L | Gates the dogfood projects and is the only route to the boilerplate delta |
| 5 | Calibration reliability (best-of-3, 20 real descriptions) | S | The classifier is the front door and it flips |
| 6 | Founder-chosen look (accent, type, density) | M | The one visible slop complaint we exhibit |
| 7 | "Request a change" against accepted documents; restore dependency watch | M | The maintain loop is where switching cost actually forms |
| 8 | "Push to my GitHub" mirror; prominent Export | M | Answers the trust objection to Pramaan-held repos |

Deprioritise: BYO key, local run mode, mobile.

## Top risks

1. The data flywheel doesn't exist, so with zero external tenants there is nothing proprietary to compound.
2. The knowledge moat is copyable prompt craft on top of an unreliable classifier and third-party models
   that will absorb it.
3. Sticky surfaces are either off by default or paused, while Pramaan holding the repo creates a lock-in
   objection before any switching cost exists.

## Answer to the pasted question

Yes, addressing these points would help, with a different weighting than the thread implies. The product
already leads on quality gates and has a hard spend stop. It trails on cost transparency, boilerplate
reuse and the data loop. Close the claimed-vs-shipped gaps first (ranks 1-2), because they are cheap and
credibility-bearing. Rank 4 is the biggest single investment and the only one that makes the
"nothing gets built an eighth time" thesis true for the builder.

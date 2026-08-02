<!-- markdownlint-disable-file -->

# Planning Log: GG-E31 — Account Dashboard & Layout

## Discrepancy Log

### Unaddressed Research Items

- DR-01: `requireAuth()` / `requireGuest()` helpers from GG-183 spec not added to `Astro.locals`
  - Source: .copilot-tracking/research/2026-07-19/gg-e31-research.md (Lines 100-115)
  - Reason: Existing auth pages use inline `Astro.locals.customer` check; middleware already handles redirects for all protected paths. Adding helpers is a refactor with no functional gain for E31.
  - Impact: low

- DR-02: GG-254 acceptance criterion "404 when `commerceEnabled` flag is off" has no implementation code or verification step
  - Source: .copilot-tracking/research/2026-07-19/gg-e31-research.md (Lines 70-75) — GG-254 acceptance criteria
  - Reason: Step 4.2 in details states "Commerce flag off → middleware handles 404 rewrite" and delegates to middleware, but does not verify this behaviour exists in the current middleware, provide implementation code for the page, or include a test for it. This acceptance criterion is unvalidated.
  - Impact: major — if middleware does not already handle the commerce flag, the 404 behaviour will be silently missing and untested at merge time

- DR-03: Playwright test for authenticated dashboard structure absent from plan coverage despite plan success criterion claiming it
  - Source: .copilot-tracking/research/2026-07-19/gg-e31-research.md (Lines 70-80) — GG-254 acceptance criteria (sidebar nav rendered, page structure)
  - Reason: Plan success criterion states `tests/pages/account.spec.ts` covers "structure + auth redirect behaviour" but Step 4.3 in details implements only the unauthenticated redirect test and explicitly defers authenticated-state structure testing to follow-on WI-02. The stated success criterion overstates actual test coverage.
  - Impact: major — authenticated page structure (sidebar nav, dashboard content) has no automated test coverage at merge time; CI would not catch regressions

- DR-04: `npx playwright test` absent from Step 4.4 per-PR validation despite Playwright tests being created in Step 4.3
  - Source: .copilot-tracking/research/2026-07-19/gg-e31-research.md (Lines 70-80) — GG-254 test requirement; CLAUDE.md pre-PR validation checklist
  - Reason: Step 4.4 runs typecheck, lint, and build only. Playwright tests are created in Step 4.3 of the same PR but are never executed as part of that PR's validation, so a failing test would not be caught before merging.
  - Impact: major — tests created in step 4.3 are unvalidated until CI runs; breaking tests could be merged without local detection

- DR-05: `npm run format` absent from all per-PR validation steps (1.4, 2.4, 3.4, 4.4)
  - Source: CLAUDE.md — "Run `npm run format` before every commit, without exception"
  - Reason: Steps 1.4, 2.4, 3.4, and 4.4 each list typecheck + lint + build/build-storybook but omit the format step. The final PR 5 Step 5.1 includes it, so unformatted code could pass all per-PR validations and only be caught at final pass.
  - Impact: minor — CI will catch it, and the final validation step covers it; low risk of it reaching main

- DR-06: `EmptyState` and `FirstVisit` stories for GG-249 AccountDashboard are under-specified and potentially identical
  - Source: .copilot-tracking/research/2026-07-19/gg-e31-research.md (Lines 50-55) — GG-249 stories spec lists them as distinct
  - Reason: Step 3.3 in details describes EmptyState as "same as FirstVisit (may alias or vary content)" without defining a meaningful distinction. If implemented as near-identical stories, Storybook may surface duplicate-story warnings and Chromatic snapshots will be redundant.
  - Impact: minor — no build failure; produces low-quality documentation and redundant Chromatic snapshots

### Plan Deviations from Research

- DD-01: No `src/layouts/AccountLayout.astro` created
  - Research finds: GG-254 ticket lists this file
  - Plan implements: `src/components/AccountLayout/AccountLayout.astro` (from GG-229 spec) used directly by the page
  - Rationale: GG-229 explicitly defines the component path; a separate layout file would be a duplicate. Astro components with `<slot />` serve as layouts directly.

- DD-02: GG-249 AccountDashboard built without `CartItemRow` and `OrderListItem` sections
  - Research finds: GG-249 depends on GG-218 (CartItemRow, E21) and GG-242 (OrderListItem, E32) which don't exist
  - Plan implements: Dashboard with greeting + address only; TODO comments in place for deferred sections
  - Rationale: Blocking E31 on unbuilt cart/orders epics would leave `/account` inaccessible indefinitely. Dashboard remains useful without those sections.

- DD-03: Playwright test file at `tests/pages/account.spec.ts` not `tests/account/dashboard-page.spec.ts`
  - Research finds: GG-254 ticket specifies `tests/account/dashboard-page.spec.ts`
  - Plan implements: `tests/pages/account.spec.ts` — follows established `tests/pages/` convention
  - Rationale: All existing Playwright tests live in `tests/pages/`. Consistency with ADR-020 convention takes precedence over the ticket path.

- DD-04: GG-227 (AddressCard, an E33 ticket) included in the E31 plan
  - Research finds: GG-254 is blocked by GG-227
  - Plan implements: GG-227 built as PR 2 within the E31 rollout
  - Rationale: The page cannot be completed without AddressCard; pulling it forward avoids a separate blocking milestone.

## Implementation Paths Considered

### Selected: One PR per Linear ticket, sequential dependency chain

- Approach: Each of the 4 Linear tickets (GG-229, GG-227, GG-249, GG-254) becomes one PR. GG-229 and GG-227 are parallelisable. GG-249 waits for GG-227. GG-254 waits for all three.
- Rationale: Matches user requirement of individual PRs per ticket; keeps PR scope small and reviewable; each PR closes exactly one Linear issue enabling clean auto-sync.
- Evidence: .copilot-tracking/research/2026-07-19/gg-e31-research.md (dependency graph analysis)

### IP-01: Bundle GG-229 + GG-227 + GG-249 into one PR

- Approach: Build all three components in a single branch and PR, then create GG-254 as the second PR.
- Trade-offs: Faster to ship; harder to review; Linear auto-sync closes multiple tickets at once (messier history).
- Rejection rationale: User explicitly requested individual PRs per ticket.

### IP-02: Defer GG-249 until cart/orders epics are complete

- Approach: Skip AccountDashboard until CartItemRow and OrderListItem exist; build GG-254 with an empty content area placeholder.
- Trade-offs: Avoids stub/TODO comments; leaves `/account` empty for longer.
- Rejection rationale: A functioning dashboard with partial content is more useful than an empty page; TODO stubs are clearly documented and won't break CI.

## Suggested Follow-On Work

- WI-01: Complete GG-249 cart + orders sections — Add `CartItemRow` and `OrderListItem` to `AccountDashboard` once GG-218 (E21) and GG-242 (E32) are built (medium priority)
  - Source: DD-02 deviation
  - Dependency: GG-218 (CartItemRow) and GG-242 (OrderListItem) must be merged first

- WI-02: Add authenticated Playwright test via auth helper — The unauthenticated redirect test is easy; testing the logged-in dashboard view requires a session fixture (high value for regression coverage) (medium priority)
  - Source: Step 4.3 in details — noted as a gap
  - Dependency: Auth helper in `tests/helpers/` established (or create one)

- WI-03: Mark GG-183 Done in Linear — The middleware is functionally complete even without the explicit helpers (low priority)
  - Source: DR-01 discrepancy
  - Dependency: None; can be done any time

- WI-04: Add `requireAuth()` / `requireGuest()` helpers to `Astro.locals` — Refactor to match GG-183 spec; makes auth intent explicit in pages (low priority)
  - Source: DR-01 discrepancy
  - Dependency: None; additive change, no breaking impact

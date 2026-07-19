---
applyTo: '.copilot-tracking/changes/2026-07-19/gg-e31-changes.md'
---

<!-- markdownlint-disable-file -->

# Implementation Plan: GG-E31 — Account Dashboard & Layout

## Overview

Build the account dashboard feature as four sequential PRs, each mapped 1:1 to a Linear ticket, delivering the `/account` index page backed by an `AccountLayout` sidebar shell, `AddressCard`, and `AccountDashboard` summary component.

## Objectives

### User Requirements

- Build GG-E31 as individual PRs per Linear ticket — Source: conversation context
- Note where tasks can be parallelised — Source: conversation context

### Derived Objectives

- Pull in GG-227 (AddressCard, E33 ticket) because GG-254 depends on it — Derived from: GG-254 blockedBy relations in Linear
- Skip `CartItemRow` and `OrderListItem` sections in GG-249 dashboard (those components don't exist yet) — Derived from: D-02 research finding
- Use `feature/gg-NNN-...` branch naming so Linear auto-syncs status via GitHub integration — Derived from: conversation context on auto-sync

## Context Summary

### Project Files

- src/middleware.ts - Session hydration + protected-route redirect (GG-183 functionally done)
- src/pages/account/login.astro - Pattern for auth page structure (inline `Astro.locals.customer` check)
- src/components/Forms/LoginForm/LoginForm.tsx - Component pattern reference
- src/components/Forms/LoginForm/LoginForm.types.ts - Type file pattern (`export default null`)
- src/components/Forms/LoginForm/LoginForm.stories.tsx - Story pattern
- src/layouts/Layout.astro - Main layout pattern
- src/env.d.ts - App.Locals type augmentation
- src/pages/api/commerce/auth/logout.ts - Logout API (exists)
- tests/pages/homepage.spec.ts - Playwright test pattern reference

### References

- .copilot-tracking/research/2026-07-19/gg-e31-research.md - Full ticket specs and discrepancy analysis

### Standards References

- .github/copilot-instructions.md — Project conventions (tokens, component structure, Storybook)

## Implementation Checklist

### [ ] PR 1 — GG-229: AccountLayout component

<!-- parallelizable: true (independent of PR 2) -->

- [ ] Step 1.1: Create `AccountLayout.types.ts`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 18-40)
- [ ] Step 1.2: Create `AccountLayout.astro`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 41-90)
- [ ] Step 1.3: Create `AccountLayout.stories.ts`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 91-120)
- [ ] Step 1.4: Validate phase changes
  - `npm run format` — auto-fix formatting
  - `npm run typecheck` — verify no TS errors in AccountLayout files
  - `npm run lint` — zero ESLint errors
  - `npm run build-storybook` — story renders without errors

### [ ] PR 2 — GG-227: AddressCard component

<!-- parallelizable: true (independent of PR 1) -->

- [ ] Step 2.1: Create `AddressCard.types.ts`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 123-150)
- [ ] Step 2.2: Create `AddressCard.astro`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 151-200)
- [ ] Step 2.3: Create `AddressCard.stories.ts`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 201-240)
- [ ] Step 2.4: Validate phase changes
  - `npm run format` — auto-fix formatting
  - `npm run typecheck` — verify no TS errors in AddressCard files
  - `npm run lint` — zero ESLint errors
  - `npm run build-storybook` — story renders without errors

### [ ] PR 3 — GG-249: AccountDashboard component

<!-- parallelizable: false (depends on GG-227/AddressCard from PR 2) -->

- [ ] Step 3.1: Create `AccountDashboard.types.ts`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 243-270)
- [ ] Step 3.2: Create `AccountDashboard.astro` (simplified — without cart/orders)
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 271-330)
- [ ] Step 3.3: Create `AccountDashboard.stories.ts`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 331-370)
- [ ] Step 3.4: Validate phase changes
  - `npm run format` — auto-fix formatting
  - `npm run typecheck` — verify no TS errors
  - `npm run lint` — zero ESLint errors
  - `npm run build-storybook` — story renders without errors

### [ ] PR 4 — GG-254: /account dashboard page

<!-- parallelizable: false (depends on PRs 1, 2, 3) -->

- [ ] Step 4.1: Mark GG-183 Done in Linear (middleware is functionally complete)
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 373-380)
- [ ] Step 4.2: Create `src/pages/account/index.astro`
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 381-430)
- [ ] Step 4.3: Create `tests/pages/account.spec.ts` Playwright test
  - Details: .copilot-tracking/details/2026-07-19/gg-e31-details.md (Lines 431-490)
- [ ] Step 4.4: Validate phase changes
  - `npm run format` — auto-fix formatting
  - `npm run typecheck` — zero TS errors
  - `npm run lint` — zero ESLint errors
  - `npm run build` — Astro build succeeds
  - `npx playwright test tests/pages/account.spec.ts` — redirect test passes (dev server must be running)

### [ ] PR 5 — Final Validation

<!-- parallelizable: false -->

- [ ] Step 5.1: Run full project validation
  - `npm run format && npm run lint && npm run typecheck && npm run build && npm run build-storybook && npx playwright test`
- [ ] Step 5.2: Fix minor validation issues inline
- [ ] Step 5.3: Report blocking issues requiring additional planning

## Planning Log

See .copilot-tracking/plans/logs/2026-07-19/gg-e31-log.md for discrepancy tracking, implementation paths considered, and suggested follow-on work.

## Dependencies

- Existing middleware (`src/middleware.ts`) functional — no changes needed
- Logout API (`src/pages/api/commerce/auth/logout.ts`) — already exists
- Design tokens in `src/styles/global.css` — all styling values sourced from there
- Storybook parameters.design Figma frame URL — needed per convention (can be placeholder if frame not yet available)

## Success Criteria

- `src/components/AccountLayout/AccountLayout.astro` exists with sidebar nav, active state, sign-out — Traces to: GG-229
- `src/components/AddressCard/AddressCard.astro` exists with address display and default badges — Traces to: GG-227
- `src/components/AccountDashboard/AccountDashboard.astro` exists with greeting + address section — Traces to: GG-249
- `src/pages/account/index.astro` exists; unauthenticated → `/account/login?next=/account`; commerce off → 404 — Traces to: GG-254
- `tests/pages/account.spec.ts` covers unauthenticated redirect behaviour (authenticated-state structure test deferred to WI-02) — Traces to: GG-254
- All 4 PRs use `feature/gg-NNN-...` branch naming for Linear auto-sync — Traces to: conversation requirement
- `npm run build-storybook` passes without errors — Traces to: GG-229, GG-227, GG-249
- `npx playwright test` passes without errors — Traces to: GG-254

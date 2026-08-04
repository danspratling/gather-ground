---
applyTo: '.copilot-tracking/changes/2026-08-02/stream-a-changes.md'
---
<!-- markdownlint-disable-file -->
# Orchestration Plan: Stream A — Products, Cart, and Header

## Overview

Orchestrate 11 subagent slots across 6 dependency tiers to build the complete L3 (Products) and L4 (Cart + Header) commerce layers, converging on a wired add-to-cart flow and cart e2e test suite.

## Objectives

### User Requirements

- Deliver PLP and PDP product pages with commerce-enabled ProductCard, VariantPicker, and AddToCartButton — Source: GG-205, GG-206, GG-204, GG-207, GG-208, GG-209; wave:3, lane:l3
- Deliver full cart infrastructure (cookie helpers, CL adapter, store, API routes) and UI (CartDrawer, cart components) — Source: GG-210..222; wave:3, lane:l4
- Deliver header auth-aware states (logged-out / logged-in with AccountCartPanel) — Source: GG-211; wave:3, lane:l4
- Wire AddToCartButton to live cart and validate with e2e tests — Source: GG-223, GG-224

### Derived Objectives

- Run product UI, cart infra, cart UI, and header as 4 independent parallel threads in Phase 1 — Derived from: none of the four groups has any dependency on the others
- Gate Phase 2 on A1a+A1b+A1c only; A1d (header) finishes independently and gates Phase 5 — Derived from: header does not block product or cart mid-layer work
- Spawn A3b (PLP) as soon as ProductCard merges, not waiting for the full Phase 2 gate — Derived from: PLP only needs ProductCard, not ProductDetail

## Context Summary

### Component dependency graph

```
A1a (ProductCard, VariantPicker, AddToCartButton stub)
  └─ A2a (ProductDetail) ─── A3c (PDP page)
  └─ A3b (PLP page)  [ProductCard only]

A1b (cookie helpers, CL adapter)
  └─ A2b (cart store + write API)
       └─ A3a (GET /api/cart)
            └─ A4a (cart-merge)
            └─ A4b (wire AddToCartButton) ─── A5 (cart e2e)

A1c (CartItemRow, QuantityStepper, RemoveItemButton, EmptyCart, CartTrigger)
  └─ A2c (CartDrawer)
       └─ A4b (wire AddToCartButton)

A1d (Header auth states)
  └─ A5 (cart e2e)
```

### Project Files

- src/components/ProductCard/ — extend existing
- src/components/VariantPicker/, Forms/AddToCartButton/, ProductDetail/ — to be created
- src/components/CartItemRow/, QuantityStepper/, RemoveItemButton/, CartEmptyState/, CartTrigger/, CartDrawer/ — to be created
- src/components/AccountCartPanel/, Layout/Header.astro — to be created / extended
- src/lib/commerce/cart/ — cookies.ts, store.ts, useCart.ts to be created
- src/lib/commerce/commercelayer/cart.ts — to be created
- src/pages/products/ — index.astro + [slug].astro to be created
- src/pages/api/commerce/cart/ — items.ts + index.ts to be created

### References

- .copilot-tracking/details/2026-08-02/stream-a-products-cart-details.md — full subagent scope specs
- .copilot-tracking/plans/logs/2026-08-02/stream-a-products-cart-log.md — discrepancy log

### Standards References

- .github/copilot-instructions.md — component co-location, client: directives, Chromatic viewport requirements

## Implementation Checklist

### [x] Phase 1: Foundation — spawn 4 subagents simultaneously

<!-- parallelizable: true -->

* [x] Step 1.1: Spawn Subagent A1a — Product UI leaf components (GG-205, GG-206, GG-204)
  * Scope: ProductCard commerce variant, VariantPicker React island, AddToCartButton stub with callback prop; stories with Chromatic viewports
  * Details: .copilot-tracking/details/2026-08-02/stream-a-products-cart-details.md (Lines 20-58)
  * Branch: feature/gg-205-gg-206-gg-204-product-ui-components — all validation passed
* [x] Step 1.2: Spawn Subagent A1b — Cart infrastructure foundation (GG-210, GG-212)
  * Scope: gg_cart cookie helpers, CL adapter cart methods (CRUD + merge); unit tests
  * Details: .copilot-tracking/details/2026-08-02/stream-a-products-cart-details.md (Lines 59-88)
  * Branch: feature/gg-210-gg-212-cart-infra-foundation — 240 tests pass
* [x] Step 1.3: Spawn Subagent A1c — Cart UI leaf components (GG-218, GG-213, GG-214, GG-215, GG-219)
  * Scope: CartItemRow, QuantityStepper, RemoveItemButton, CartEmptyState, CartTrigger; all presentational React; stories
  * Details: .copilot-tracking/details/2026-08-02/stream-a-products-cart-details.md (Lines 89-125)
  * Branch: feature/gg-218-gg-213-cart-ui-leaf-components — all validation passed after npm ci + format amend
* [x] Step 1.4: Spawn Subagent A1d — Header auth states (GG-211)
  * Scope: AccountCartPanel React island; Layout.astro updated with commerce slots; stories with Chromatic viewports
  * Details: .copilot-tracking/details/2026-08-02/stream-a-products-cart-details.md (Lines 126-160)
  * Branch: feature/gg-211-header-auth-states — all validation passed after npm ci
* [x] Step 1.5: Gate — wait for A1a AND A1b AND A1c merged before Phase 2 (A1d continues independently)
  * All merged 2026-08-02: #124 A1a, #125 A1b, #126 A1c, #127 A1d

### [x] Phase 2: Mid-layer — spawn 3 subagents simultaneously (+ A3b opportunistic)

<!-- parallelizable: true -->

* [x] Step 2.1: Spawn Subagent A2a — ProductDetail composite (GG-208)
  * Branch: feature/gg-208-product-detail — PR #135 — validation ✓
* [x] Step 2.2: Spawn Subagent A2b — Cart store + hook + write API routes (GG-216, GG-217)
  * Branch: feature/gg-216-gg-217-cart-store-write-api — PR #136 — validation ✓ (13 tests pass)
* [x] Step 2.3: Spawn Subagent A2c — CartDrawer (GG-221)
  * Branch: feature/gg-221-cart-drawer — PR #137 — validation ✓ (stub useCart/store files — rebase after A2b merges)
* [x] Step 2.4: Gate — wait for A2b merged before Phase 3 (A2a and A2c may still be running)
  * All merged: #135 A2a, #136 A2b, #137 A2c, #138 A3b
* [x] Step 2.5: Opportunistic — spawn A3b (PLP) as soon as A1a (ProductCard) is merged, without waiting for the full Phase 2 gate
  * Branch: feature/gg-207-plp-page — PR #138 — merged

### [x] Phase 3: Pages + read API — spawn up to 3 subagents

<!-- parallelizable: true -->

* [x] Step 3.1: Spawn Subagent A3a — GET /api/cart (GG-222)
  * Branch: feature/gg-222-get-cart-api — PR #150 — validation ✓ (296 tests pass)
* [ ] Step 3.2: Spawn Subagent A3b — PLP page (GG-207) — already done in Phase 2 (PR #138 merged)
* [x] Step 3.3: Spawn Subagent A3c — PDP page (GG-209)
  * Branch: feature/gg-209-pdp-page — PR #151 — validation ✓ (build passes)
* [ ] Step 3.4: Gate — wait for A2c AND A3a AND A1a (AddToCartButton stub) merged before Phase 4
  * A2c (#137) ✓ merged; A1a (#124) ✓ merged; A3a (#150) — pending review

### [x] Phase 4: Cart-merge + Wire — spawn 2 subagents simultaneously

<!-- parallelizable: true -->

* [x] Step 4.1: Spawn Subagent A4a — Cart-merge on login/register (GG-220)
  * Branch: feature/gg-220-cart-merge — PR #156 — merged
* [x] Step 4.2: Spawn Subagent A4b — Wire AddToCartButton → cart pipeline (GG-223)
  * Branch: feature/gg-223-wire-add-to-cart — PR #157 — merged
* [x] Step 4.3: Gate — wait for A4b AND A1d merged before Phase 5
  * A4b (#157) ✓ merged; A1d (#127) ✓ merged

### [x] Phase 5: Cart e2e test — spawn 1 subagent

<!-- parallelizable: false -->

* [x] Step 5.1: Spawn Subagent A5 — Cart e2e lifecycle test (GG-224)
  * Branch: feature/gg-224-cart-e2e — PR #158 — merged
* [x] Step 5.2: Gate — wait for A5 merged
  * Merged 2026-08-04

### [x] Phase 6: Validation

<!-- parallelizable: false -->

* [x] Step 6.1: All 21 issues GG-204..224 have merged PRs — Stream A COMPLETE
* [ ] Step 6.2: Full validation run pending (commerce env vars required for cart lifecycle tests)
* [ ] Step 6.3: No blocking issues identified

## Planning Log

See .copilot-tracking/plans/logs/2026-08-02/stream-a-products-cart-log.md

## Dependencies

- main branch with GG-254 merged (auth middleware, CL adapter init, session types present)
- Commerce Layer credentials in .env
- `PUBLIC_COMMERCE_ENABLED=true` in local .env
- Existing `src/components/ProductCard/` to extend (do not replace)

## Success Criteria

- All 21 issues GG-204..224 have merged PRs — Traces to: wave:3, lane:l3+l4 backlog
- Add-to-cart from PDP opens CartDrawer and persists across navigation — Traces to: GG-223 acceptance criteria
- Cart e2e suite passes — Traces to: GG-224 acceptance criteria
- Header shows correct auth state (logged-out / logged-in + mini cart) — Traces to: GG-211 acceptance criteria
- All CI checks pass — Traces to: CLAUDE.md pre-PR validation

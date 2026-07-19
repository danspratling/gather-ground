<!-- markdownlint-disable-file -->
# Research: GG-E31 — Account Dashboard & Layout

## Source tickets

| ID | Title | Status | Linear URL |
|----|-------|--------|------------|
| GG-229 | [GG-E31-CMP-01] AccountLayout (sidebar shell) | Backlog | https://linear.app/dspratling/issue/GG-229 |
| GG-249 | [GG-E31-CMP-02] AccountDashboard summary | Backlog | https://linear.app/dspratling/issue/GG-249 |
| GG-254 | [GG-E31-PG-01] /account dashboard page + layout | Backlog | https://linear.app/dspratling/issue/GG-254 |

### Dependencies pulled into this plan

| ID | Title | Status | Note |
|----|-------|--------|------|
| GG-227 | [GG-E33-CMP-01] AddressCard | Backlog | E33 ticket; blockedBy GG-254 so included here |
| GG-183 | [GG-E04-G] Astro middleware session helpers | Backlog | requireAuth()/requireGuest() helpers missing but middleware is functionally done |

---

## Ticket specifications

### GG-229 — AccountLayout (sidebar shell)

**Files:** `src/components/AccountLayout/AccountLayout.astro`, `.types.ts`, `.stories.ts`

**Behaviour:**
- Sidebar with nav links: Dashboard, Orders, Addresses, Profile, Sign out
- Active link highlighted via `Astro.url.pathname`
- Sign out → POST `/api/commerce/auth/logout` then redirect to `/`
- Mobile: collapsing tab bar or accordion

**Stories:** `Default`, `OnOrders`, `MobileTabbed`
**Chromatic:** 375 + 1440

**Branch:** `feature/gg-229-gg-e31-cmp-01-accountlayout-sidebar-shell`

---

### GG-227 — AddressCard (from E33, dependency)

**Files:** `src/components/AddressCard/AddressCard.astro`, `.types.ts`, `.stories.ts`

**Behaviour:**
- Static `.astro` card: name, address lines, city, postcode, country
- Badges for "Default shipping" / "Default billing"
- Edit + Delete actions slotted from consumer

**Stories:** `Default`, `DefaultShipping`, `DefaultBilling`, `WithActions`
**Chromatic:** 375 + 1440

**Branch:** `feature/gg-227-gg-e33-cmp-01-addresscard`

---

### GG-249 — AccountDashboard summary

**Files:** `src/components/AccountDashboard/AccountDashboard.astro`, `.types.ts`, `.stories.ts`

**Behaviour:**
- Customer greeting
- Recent orders (3) — composes `OrderListItem` (GG-E32-CMP-02, doesn't exist yet)
- Default address snippet — composes `AddressCard`
- Saved items in cart preview — composes `CartItemRow` (GG-E21-CMP-00, doesn't exist yet)
- Quick links to Addresses + Profile

**BLOCKER:** Depends on `OrderListItem` (GG-242) and `CartItemRow` (GG-218) which are in unbuilt cart/orders epics.

**Stories:** `Default`, `FirstVisit`, `EmptyState`

**Branch:** `feature/gg-249-gg-e31-cmp-02-accountdashboard-summary`

---

### GG-254 — /account dashboard page + layout

**Files:** `src/pages/account/index.astro`, `src/layouts/AccountLayout.astro` (see discrepancy below), `tests/account/dashboard-page.spec.ts`

**Behaviour:**
- Renders `AccountLayout` wrapping `AccountDashboard`
- Middleware already redirects unauthenticated users to login (no explicit `requireAuth()` call needed)
- 404 when `commerceEnabled` flag is off

**Acceptance criteria:**
- `src/pages/account/index.astro` exists
- Layout includes sidebar nav: Dashboard, Orders, Addresses, Profile, Logout
- 404 when commerce flag off
- Playwright test in `tests/account/dashboard-page.spec.ts`

**Branch:** `feature/gg-254-gg-e31-pg-01-account-dashboard-page-layout`

---

## Codebase patterns discovered

### Component structure
Every component in `src/components/[Name]/`:
- `[Name].astro` for static
- `[Name].types.ts` with `export default null` at end
- `[Name].stories.ts` or `.tsx`

Existing form component for pattern reference: `src/components/Forms/LoginForm/`

### Existing auth pages pattern
`src/pages/account/login.astro` uses `Astro.locals.customer` directly (no helper):
```astro
const customer = Astro.locals.customer;
if (customer) {
  return Astro.redirect(safeDest, 302);
}
```

The middleware at `src/middleware.ts` already redirects unauthenticated users away from protected account paths — no `requireAuth()` call needed in pages.

### Middleware state
- `src/middleware.ts` exists and hydrates `session` + `customer` onto `Astro.locals`
- The `requireAuth()` / `requireGuest()` helpers specified in GG-183 are NOT present
- `App.Locals` type augmentation in `src/env.d.ts` only declares `session` and `customer`
- Middleware redirect logic for `/account` already works inline — GG-183 helpers are optional

### Layout pattern
`src/layouts/Layout.astro` — main site layout (wraps Header, Footer, etc.)
AccountLayout will follow the same pattern but swap site chrome for account sidebar.

### Playwright test pattern
Tests live in `tests/pages/` (not `tests/account/` as GG-254 specifies — see discrepancy).
Pattern from `tests/pages/homepage.spec.ts`:
```typescript
import { expect, test } from '@playwright/test';
test.describe('...', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });
  test('...', async ({ page }) => { ... });
});
```

### Logout API
`src/pages/api/commerce/auth/logout.ts` exists.

### Styling tokens
`src/styles/global.css` — all values must use tokens. No hardcoded hex or arbitrary Tailwind values.

---

## Key discrepancies

### D-01: GG-254 file list includes `src/layouts/AccountLayout.astro`
GG-254 lists `src/layouts/AccountLayout.astro` as a file to create, but GG-229 creates `src/components/AccountLayout/AccountLayout.astro`. These appear to be the same thing under different paths.

**Resolution:** GG-229 creates the component in `src/components/AccountLayout/`. GG-254 uses it directly — no separate `src/layouts/AccountLayout.astro` is needed.

### D-02: GG-249 depends on unbuilt cart/orders components
AccountDashboard spec calls for `CartItemRow` (GG-218, E21 cart epic) and `OrderListItem` (GG-242, E32 orders epic), neither of which exists.

**Resolution:** Build GG-249 without those sections for now. The dashboard will show greeting + default address only. Cart and orders slots will be marked with `<!-- TODO: GG-249 cart/orders preview — awaiting cart epic -->` comments.

### D-03: Playwright test path in GG-254 ticket
GG-254 specifies `tests/account/dashboard-page.spec.ts`, but existing tests are in `tests/pages/`. Convention takes precedence.

**Resolution:** Create `tests/pages/account.spec.ts` following established convention.

### D-04: GG-183 middleware helpers not yet implemented
GG-254 acceptance criteria mentions `Astro.locals.requireAuth()`. The middleware doesn't expose this helper, and existing auth pages use the inline pattern instead. GG-183 is already functionally satisfied (middleware hydrates session and handles redirects).

**Resolution:** Use the established inline pattern (`Astro.locals.customer`) in `account/index.astro`. Mark GG-183 as Done.

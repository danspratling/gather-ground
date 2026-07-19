<!-- markdownlint-disable-file -->

# Implementation Details: GG-E31 — Account Dashboard & Layout

## Context Reference

Sources: .copilot-tracking/research/2026-07-19/gg-e31-research.md, Linear tickets GG-229, GG-227, GG-249, GG-254, GG-183

---

## PR 1 — GG-229: AccountLayout component

<!-- parallelizable: true -->

Branch: `feature/gg-229-gg-e31-cmp-01-accountlayout-sidebar-shell`
Commit: `feat(account): AccountLayout sidebar shell — Closes GG-229`

### Step 1.1: Create `AccountLayout.types.ts`

Define the props interface for the sidebar shell. The layout receives customer data (name, email) and a `pathname` string to derive active nav state.

Files:

- src/components/AccountLayout/AccountLayout.types.ts - Props interface

```typescript
export interface AccountLayoutProps {
  /** Customer display name for the greeting */
  customerName: string;
  /** Current URL pathname — used to derive active nav link */
  pathname: string;
}

export default null;
```

Success criteria:

- File ends with `export default null`
- No `any` types

### Step 1.2: Create `AccountLayout.astro`

Static Astro component providing the shared shell for all `/account/*` pages.

Files:

- src/components/AccountLayout/AccountLayout.astro - Shell component

Implementation notes:

- Nav links array (static): Dashboard `/account`, Orders `/account/orders`, Addresses `/account/addresses`, Profile `/account/profile`
- Active state: compare `Astro.url.pathname` (or the passed `pathname` prop) with each href using `startsWith` (so `/account/orders/[id]` also highlights Orders)
- Sign out: `<form method="POST" action="/api/commerce/auth/logout">` with a submit button — this POST matches the logout API route
- Mobile layout: a tab bar beneath the content (or a collapsible accordion) — use `flex flex-col md:flex-row` and `md:hidden` / `hidden md:flex` patterns
- `<slot />` for page-specific content
- All colour/spacing values from tokens in `src/styles/global.css`

Success criteria:

- Active link styled differently from inactive links
- Sign-out form POSTs to `/api/commerce/auth/logout`
- `<slot />` present for content
- Mobile and desktop layouts render correctly

Context references:

- src/components/Forms/LoginForm/LoginForm.tsx (Lines 1-20) - Component pattern
- src/layouts/Layout.astro (Lines 1-30) - Layout pattern
- src/styles/global.css - Token source

Dependencies:

- Step 1.1 complete (types file)

### Step 1.3: Create `AccountLayout.stories.ts`

Files:

- src/components/AccountLayout/AccountLayout.stories.ts - Storybook stories

Three stories:

- `Default` — `pathname: '/account'`, Dashboard link active
- `OnOrders` — `pathname: '/account/orders'`, Orders link active
- `MobileTabbed` — same props, viewport forced to 375px via `parameters.viewport`

Every story must include `parameters.design` with the Figma frame URL (can be a placeholder comment if frame not yet available).
Include `chromatic: { viewports: [375, 1440] }` in parameters — this is a page section equivalent (full-width layout shell).

Success criteria:

- All 3 stories render without error in `npm run build-storybook`
- `chromatic: { viewports: [375, 1440] }` present in parameters

Dependencies:

- Step 1.2 complete (component)

### Step 1.4: Validate phase changes

Validation commands:

- `npm run format` - auto-fix formatting
- `npm run typecheck` - AccountLayout type coverage
- `npm run lint` - ESLint zero errors
- `npm run build-storybook` - Stories render

---

## PR 2 — GG-227: AddressCard component

<!-- parallelizable: true -->

Branch: `feature/gg-227-gg-e33-cmp-01-addresscard`
Commit: `feat(account): AddressCard component — Closes GG-227`

### Step 2.1: Create `AddressCard.types.ts`

Files:

- src/components/AddressCard/AddressCard.types.ts - Props interface

```typescript
export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface AddressCardProps {
  address: Address;
}

export default null;
```

Success criteria:

- All address fields typed
- Optional fields marked correctly
- `export default null` at end

### Step 2.2: Create `AddressCard.astro`

Static Astro component displaying a single saved address.

Files:

- src/components/AddressCard/AddressCard.astro - Card component

Implementation notes:

- Display: full name (firstName + lastName), line1, line2 (if present), city, postcode, country
- Badge "Default shipping" shown when `isDefaultShipping: true` — use a `<Badge>` or styled `<span>` with token colours
- Badge "Default billing" shown when `isDefaultBilling: true`
- `<slot name="actions" />` for Edit/Delete buttons slotted by the consumer
- Card container: border, rounded corners, padding — all from tokens

Success criteria:

- Renders address fields correctly
- Both badges conditionally shown
- Actions slot present
- All values from design tokens

Context references:

- src/components/Badge/Badge.astro (Lines 1-20) - Badge pattern if one exists
- src/styles/global.css - Token source

Dependencies:

- Step 2.1 complete (types)

### Step 2.3: Create `AddressCard.stories.ts`

Files:

- src/components/AddressCard/AddressCard.stories.ts - Stories

Four stories:

- `Default` — address with no defaults
- `DefaultShipping` — `isDefaultShipping: true`
- `DefaultBilling` — `isDefaultBilling: true`
- `WithActions` — address with slot actions (Edit + Delete buttons passed via `slot`)

Include `parameters.design` and `chromatic: { viewports: [375, 1440] }`.

Dependencies:

- Step 2.2 complete (component)

### Step 2.4: Validate phase changes

Validation commands:

- `npm run format` - auto-fix formatting
- `npm run typecheck` - AddressCard type coverage
- `npm run lint` - ESLint zero errors
- `npm run build-storybook` - Stories render

---

## PR 3 — GG-249: AccountDashboard component

<!-- parallelizable: false (depends on PR 2 — AddressCard) -->

Branch: `feature/gg-249-gg-e31-cmp-02-accountdashboard-summary`
Commit: `feat(account): AccountDashboard summary component — Closes GG-249`

### Step 3.1: Create `AccountDashboard.types.ts`

Files:

- src/components/AccountDashboard/AccountDashboard.types.ts - Props interface

The dashboard receives the data it needs to render — server-fetched in the page and passed as props.

```typescript
import type { Address } from '@/components/AddressCard/AddressCard.types';

export interface AccountDashboardProps {
  customerName: string;
  /** Default shipping address, if one exists */
  defaultAddress?: Address;
  // TODO: recentOrders — awaiting GG-242 (OrderListItem, E32 orders epic)
  // TODO: cartItems — awaiting GG-218 (CartItemRow, E21 cart epic)
}

export default null;
```

Success criteria:

- Imports `Address` type from AddressCard (no duplication)
- TODO comments document deferred dependencies
- `export default null` at end

Dependencies:

- PR 2 (GG-227) merged — AddressCard types available

### Step 3.2: Create `AccountDashboard.astro` (simplified)

Static Astro component for the `/account` index content area.

Files:

- src/components/AccountDashboard/AccountDashboard.astro - Dashboard content

Implementation notes:

- Greeting: "Welcome back, {customerName}" heading
- Default address section: renders `<AddressCard>` if `defaultAddress` provided, else a "No address saved" message with a link to `/account/addresses`
- Quick links: two link cards/buttons to `/account/addresses` and `/account/profile`
- Cart preview section: `<!-- TODO: GG-249 cart preview — awaiting GG-218 CartItemRow (E21 cart epic) -->`
- Recent orders section: `<!-- TODO: GG-249 orders preview — awaiting GG-242 OrderListItem (E32 orders epic) -->`
- All values from design tokens

Discrepancy references:

- Addresses D-02: cart and orders sections deferred due to missing upstream components

Success criteria:

- Greeting renders customer name
- AddressCard used for default address section
- TODO comments in place for deferred sections
- No broken imports or missing components

Context references:

- src/components/AddressCard/AddressCard.astro - Composed here
- .copilot-tracking/research/2026-07-19/gg-e31-research.md (Lines 38-58) - GG-249 spec

Dependencies:

- Step 3.1 complete
- PR 2 (GG-227) merged — AddressCard component available

### Step 3.3: Create `AccountDashboard.stories.ts`

Files:

- src/components/AccountDashboard/AccountDashboard.stories.ts - Stories

Three stories:

- `Default` — customer with a default address, greeting visible
- `FirstVisit` — customer with no address (`defaultAddress: undefined`); shows "No address saved" prompt with link to `/account/addresses`
- `EmptyState` — customer with no address AND explicit empty-state copy variant (distinct from FirstVisit by rendering a more prominent onboarding call-to-action rather than just a missing-item message)

Include `parameters.design` and `chromatic: { viewports: [375, 1440] }`.

Dependencies:

- Step 3.2 complete (component)

### Step 3.4: Validate phase changes

Validation commands:

- `npm run format` - auto-fix formatting
- `npm run typecheck` - AccountDashboard type coverage
- `npm run lint` - ESLint zero errors
- `npm run build-storybook` - Stories render

---

## PR 4 — GG-254: /account dashboard page

<!-- parallelizable: false (depends on PRs 1, 2, 3) -->

Branch: `feature/gg-254-gg-e31-pg-01-account-dashboard-page-layout`
Commit: `feat(account): /account dashboard page — Closes GG-254`

### Step 4.1: Mark GG-183 Done in Linear

GG-183 (middleware session hydration) is functionally complete — `src/middleware.ts` exists, hydrates `session` and `customer` onto `Astro.locals`, and handles protected-route redirects. The `requireAuth()`/`requireGuest()` helpers are not strictly needed; existing pages use the inline pattern.

Action: Update GG-183 status to Done in Linear via MCP tool.

Discrepancy references:

- Addresses D-04: requireAuth() helper omitted; inline pattern used instead

### Step 4.2: Create `src/pages/account/index.astro`

Files:

- src/pages/account/index.astro - Account dashboard page

Implementation notes:

- `export const prerender = false;` at top
- No explicit auth check needed — middleware at `src/middleware.ts` already redirects unauthenticated visitors to `/account/login?next=/account`
- Commerce flag off → middleware handles 404 rewrite
- Fetch the authenticated customer's data using `Astro.locals.customer` (already hydrated)
- Fetch `defaultAddress` from the commerce adapter (or pass null/undefined if not yet available — orders API is GG-E32)
- Render `<AccountLayout>` wrapping `<AccountDashboard>`
- Pass `pathname={Astro.url.pathname}` to AccountLayout for active nav state
- No Sanity `loadQuery` needed — this page is driven by commerce data, not CMS

- Commerce flag off → 404: **handled by the existing middleware** — `GATED_ROUTE_PATTERNS` in `src/middleware.ts` includes `/^\/account(?:\/.*)?$/`; when `isCommerceEnabled()` returns false the middleware rewrites to `/404` before the page renders. No additional code needed in the page itself.

```astro
---
export const prerender = false;
import AccountLayout from '@/components/AccountLayout/AccountLayout.astro';
import AccountDashboard from '@/components/AccountDashboard/AccountDashboard.astro';

const customer = Astro.locals.customer!;
// TODO: fetch defaultAddress from commerce adapter (GG-E33-API-01)
const defaultAddress = undefined;
---

<AccountLayout customerName={customer.firstName} pathname={Astro.url.pathname}>
  <AccountDashboard
    customerName={customer.firstName}
    defaultAddress={defaultAddress}
  />
</AccountLayout>
```

Discrepancy references:

- Addresses D-01: no separate `src/layouts/AccountLayout.astro` — component used directly
- Addresses D-04: no `requireAuth()` call — middleware handles redirect

Success criteria:

- Page renders for authenticated user
- Unauthenticated → middleware redirects to `/account/login?next=/account`
- Commerce flag off → 404
- `customer.firstName` passed to both components

Context references:

- src/pages/account/login.astro (Lines 1-15) - auth page pattern
- src/middleware.ts (Lines 1-60) - redirect handling
- src/components/AccountLayout/AccountLayout.astro - layout component

Dependencies:

- PR 1 (GG-229) merged
- PR 2 (GG-227) merged
- PR 3 (GG-249) merged

### Step 4.3: Create `tests/pages/account.spec.ts`

Files:

- tests/pages/account.spec.ts - Playwright structural + behavioural tests

Discrepancy references:

- Addresses D-03: path is `tests/pages/account.spec.ts` not `tests/account/dashboard-page.spec.ts`

Tests to write (following ADR-020 — structure and behavior only, no CMS content assertions):

```typescript
import { expect, test } from '@playwright/test';

test.describe('account page — unauthenticated', () => {
  test('redirects to login when not signed in', async ({ page }) => {
    const response = await page.goto('/account');
    // middleware redirects; final URL is /account/login?next=...
    expect(page.url()).toContain('/account/login');
  });
});

test.describe('account page — commerce flag off', () => {
  // This requires commerce to be disabled in test env — may need env config
  // Defer if not feasible in CI without additional env setup
});
```

Note: Testing the authenticated state requires a valid session cookie — cover that via a Playwright auth helper in `tests/helpers/` if one exists, or note as follow-on work.

Success criteria:

- Redirect test passes without a live session
- File follows existing test pattern from `tests/pages/homepage.spec.ts`

Context references:

- tests/pages/homepage.spec.ts (Lines 1-50) - Test pattern
- tests/helpers/ - Check for existing auth helpers

Dependencies:

- Step 4.2 complete (page must exist for tests to navigate to it)

### Step 4.4: Validate phase changes

Validation commands:

- `npm run format` - auto-fix formatting
- `npm run typecheck` - zero TS errors across all new files
- `npm run lint` - zero ESLint errors
- `npm run build` - Astro production build succeeds
- `npx playwright test tests/pages/account.spec.ts` - redirect test passes (requires dev server running: `npm run dev`)

---

## PR 5 — Final Validation

<!-- parallelizable: false -->

### Step 5.1: Run full project validation

```bash
npm run format          # auto-fix formatting
npm run lint            # zero errors required
npm run typecheck       # zero errors required
npm run build           # must complete
npm run build-storybook # must complete
npx playwright test     # all tests pass
```

### Step 5.2: Fix minor validation issues

Apply lint fixes, format corrections, and minor type errors directly.

### Step 5.3: Report blocking issues

If any step fails beyond minor fixes, document the issue and provide next steps rather than attempting large-scale inline fixes.

---

## Dependencies

- Node.js + npm — project runtime
- PR 1 before PR 3 — no (AccountDashboard doesn't import AccountLayout)
- PR 2 before PR 3 — yes (AccountDashboard imports AddressCard)
- PRs 1, 2, 3 before PR 4 — yes (page imports all three components)

## Success Criteria

- All 4 components/pages created and linting/type-checking clean
- 4 PRs merged with `feature/gg-NNN-...` branch names
- Linear tickets GG-229, GG-227, GG-249, GG-254, GG-183 all marked Done
- `npx playwright test` green
- `npm run build-storybook` green

# Ecommerce integration — ticket breakdown

Detailed Linear-ready breakdown for the Commerce Layer (Shopify-portable) ecommerce phase. Companion to the high-level plan stored in session memory.

## How to use

1. **Lanes** group related tickets that share an area and can be picked up together.
2. **Tickets within a lane are sequential**; lanes can run in parallel once their prerequisite lane has shipped its blocking ticket(s).
3. Every ticket targets a feature branch off `main` named `feature/commerce-<short-name>`. PRs go behind the `PUBLIC_COMMERCE_ENABLED` flag until launch (lane L0 ships the flag).
4. **Ticket types**: `setup` (vendor admin work, human), `infra` (adapter/types/middleware, agent), `schema` (Sanity schema, agent), `api` (Astro API route, agent), `component` (one component + Storybook story, agent — includes in-code design step), `page` (Astro page wiring, agent), `integration` (cross-system glue + verification), `test` (Playwright e2e, agent), `docs` (ADR/README, agent).
5. **Component tickets**: every component lives in its own folder, with `.types.ts` and `.stories.ts(x)`. Stories are categorised under `Ecommerce/<Group>/<ComponentName>`. Design happens **in code** — see the design-in-code workflow below. Each `component` ticket carries an implicit Storybook design-review gate before merge; no separate design ticket is needed.
6. **Human-intervention** column flags work that cannot be done by an agent (vendor accounts, DNS, dashboard config, legal review). Per-component design reviews are not listed there — they are part of every component ticket's AC.

## Decisions locked

- Backend: **Commerce Layer** now; Shopify-portable via adapter (see ADR-033).
- Editor surface: **Sanity Studio only**. One-way sync to CL (ADR-034).
- Auth: **CL customer auth**, email/password + reset only this phase. Social deferred.
- Payments: **Stripe via CL gateway**, Apple/Google Pay via Payment Element. Paddle excluded.
- Region: **UK / GBP only**, VAT-inclusive prices, flat-rate UK shipping in CL admin.
- Excluded: discounts, wishlist, subscriptions, multi-market, Stripe Tax, Stripe Radar, B2B, returns portal.

## Feature-flag rollout

The entire ecommerce surface area — frontend UI, Sanity Studio fields, API routes, webhook receivers — is gated behind a single flag `PUBLIC_COMMERCE_ENABLED`. **Default value is `false` everywhere.** Vercel deploys (preview + production) must explicitly set the variable to `false` at kickoff so a forgotten value cannot accidentally expose work-in-progress.

Rollout sequence:

| Stage                        | Local `.env` | Vercel Preview env | Vercel Production env | Vendors (CL, Stripe)                       |
| ---------------------------- | ------------ | ------------------ | --------------------- | ------------------------------------------ |
| Kickoff (now)                | `false`      | `false` (explicit) | `false` (explicit)    | not provisioned                            |
| Active development           | `true`       | `false`            | `false`               | sandbox/test                               |
| Preview QA (GG-E55-A)        | `true`       | **`true`**         | `false`               | sandbox/test                               |
| Vendor go-live (GG-E55-B/C)  | `true`       | `true`             | `false`               | **live** (preview still points at sandbox) |
| Production launch (GG-E55-D) | `true`       | `true`             | **`true`**            | live                                       |
| Cleanup (GG-E55-F)           | flag removed | flag removed       | flag removed          | live                                       |

What the flag gates (everything below MUST honour it):

1. **Sanity Studio fields** — every new commerce field on `products` (and any new commerce-only document types) uses `hidden: () => import.meta.env.PUBLIC_COMMERCE_ENABLED !== 'true'`. Editors on Vercel-hosted Studio see no commerce fields until the flag flips. Existing editorial fields stay visible.
2. **Frontend pages** — `/checkout/**`, `/account/**`, `/products/[slug]` commerce panel: middleware returns 404 (not redirect, to avoid leaking the route's existence) when flag is off. (Cart is a global drawer, not a page, so no `/cart` route exists.)
3. **API routes** — every route under `/api/commerce/**` returns 404 when flag is off. Wrap with a single `requireCommerceEnabled()` helper.
4. **Webhook receivers** — Sanity webhook + CL webhook receivers respond 404 when off (signature still verified first to keep logs clean).
5. **Header/footer slots** — cart icon, account link conditionally rendered only when flag is on.
6. **Sync** — `commerce/sync.ts` no-ops when flag is off (defence in depth, even though webhook receiver also gates).

The flag is read by `import.meta.env.PUBLIC_COMMERCE_ENABLED` (Vite build-time replacement). It is `PUBLIC_` because the Sanity Studio runs in the browser and needs the value at runtime; exposing the boolean is not a security concern.

## Storybook category map

| Group                | Components                                                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Ecommerce/Product`  | `PriceDisplay`, `VariantPicker`, `InventoryBadge`, `QuantitySelector`, `AddToCartButton`, `ProductPurchasePanel`                                                                                      |
| `Ecommerce/Cart`     | `CartProvider`, `CartIcon`, `CartLineItem`, `CartSummary`, `CartEmptyState`, `CartDrawer`                                                                                                             |
| `Ecommerce/Auth`     | `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`                                                                                                                                |
| `Ecommerce/Account`  | `AccountNav`, `AccountCartPanel`, `OrdersList`, `OrderListItem`, `OrderDetail`, `OrderLineItem`, `OrderStatusBadge`, `AddressCard`, `AddressList`, `AddressForm`, `ProfileForm`, `ChangePasswordForm` |
| `Ecommerce/Checkout` | `CheckoutStepper`, `CheckoutEmailStep`, `CheckoutShippingStep`, `CheckoutPaymentStep`, `CheckoutSummary`, `OrderConfirmation`                                                                         |
| `Ecommerce/Email`    | `PasswordResetEmail`, `OrderConfirmationEmail`, `ShippingConfirmationEmail`                                                                                                                           |

Per ADR-031 conventions, when a component has variants use a mapper component as the meta `component`, with `variant` in args.

## Lane summary

| Lane                      | Scope                                                                            | Blocks                                              | Branch prefix                   |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------- |
| **L0 — Foundation**       | Vendor accounts, adapter, types, env, feature flag, session/middleware, auth API | L1–L7                                               | `feature/commerce-foundation-*` |
| **L1 — Catalog data**     | Sanity product schema redesign + GROQ + types                                    | L2, L3                                              | `feature/commerce-catalog-*`    |
| **L2 — Sanity ↔ CL sync** | Sync logic, Sanity webhook, CL webhook, revalidation                             | L3 (live data)                                      | `feature/commerce-sync-*`       |
| **L3 — Product UI**       | Product display components + PDP/PLP wiring                                      | L4, L6                                              | `feature/commerce-product-*`    |
| **L4 — Cart**             | Cart adapter, API, components, drawer, header slot                               | L6                                                  | `feature/commerce-cart-*`       |
| **L5 — Auth & account**   | Auth pages, account shell, orders, addresses, profile                            | L6 (account is prerequisite for logged-in checkout) | `feature/commerce-account-*`    |
| **L6 — Checkout**         | Checkout flow, Stripe Payment Element, confirmation, emails                      | L7                                                  | `feature/commerce-checkout-*`   |
| **L7 — Launch**           | E2E, observability, legal, live switchover, flag removal                         | —                                                   | `feature/commerce-launch-*`     |

## Wave plan

- **Wave 1** (foundation, sequential): L0
- **Wave 2** (parallel after L0): L1 → L2; L4-skeleton (adapter/types only); L5-skeleton (auth pages)
- **Wave 3** (parallel after L1+L2): L3, full L4, full L5
- **Wave 4** (after L3+L4+L5): L6
- **Wave 5** (after L6): L7

---

# Design-in-code workflow

Design happens **in code**, not in Figma. The design system foundation (tokens in `src/styles/global.css`, primitives in `src/components/ui/`, typography, spacing) is the source of truth. Every component ticket follows the same loop:

1. **Scaffold** — build the component with HTML + Tailwind tokens against the existing design system. Reuse shadcn/Base UI primitives where possible.
2. **Storybook** — render every meaningful state as a story under `Ecommerce/<Group>/<ComponentName>`. Mock data; no live commerce calls.
3. **Iterate** — share the Chromatic preview URL for review. Adjust spacing/type/colour until accepted.
4. **Confirm** — explicit sign-off in the PR thread before the ticket is merged.
5. **Integrate** — a separate `page` ticket composes the accepted components and wires data.

Implications for this ticket set:

- The 12 `GG-EDSN-*` design tickets that previously existed are removed; the design step is part of every component ticket's AC.
- Component tickets are no longer blocked on external design assets; they can start as soon as their type/adapter dependency lands.
- Page tickets remain pure composition + data wiring — no separate design pass.
- Storybook `parameters.design` is **optional**. If a Figma reference exists later, include it; otherwise omit. Chromatic visual regression is the post-merge guard.
- Every `component` ticket's AC implicitly includes: "Storybook stories cover the meaningful states; design reviewed and signed off in PR before merge".
- When a new visual area is touched (e.g. first auth form, first checkout step), build one **reference component** first to lock the pattern, get sign-off, then build siblings against it. The lane ordering already places leaf components before composites.

---

# L0 — Foundation

## GG-E00 — Add `PUBLIC_COMMERCE_ENABLED` feature flag + gating primitives

- **Type**: infra · **Human**: YES (Vercel env setup) · **Depends on**: —
- **Context**: One flag gates the entire ecommerce surface so we can merge incrementally without exposing anything on Vercel. Read via `import.meta.env.PUBLIC_COMMERCE_ENABLED` (string `'true'` to enable). Default `false` everywhere; Vercel preview + production envs explicitly set to `false` at kickoff. See the "Feature-flag rollout" section at the top of this doc for the full sequence and surfaces gated.
- **AC**:
  - `PUBLIC_COMMERCE_ENABLED=false` in `.env.example` with a comment block explaining the rollout sequence.
  - Typed in `src/env.d.ts` as `readonly PUBLIC_COMMERCE_ENABLED: 'true' | 'false'`.
  - Helper `src/lib/commerce/featureFlag.ts` exports `isCommerceEnabled(): boolean` (single source of truth; never read `import.meta.env` directly elsewhere).
  - Helper `requireCommerceEnabled(astro)` for API routes — returns `new Response(null, {status: 404})` when off so routes are indistinguishable from non-existent.
  - Helper `commerceFieldHidden()` for Sanity schemas — returns `() => !isCommerceEnabled()`, used in every commerce-related `defineField` `hidden` option.
  - `src/middleware.ts` (new): when flag is off, returns 404 for paths matching `/checkout(/.*)?`, `/account(/.*)?`, `/api/commerce/.*`.
  - Layout/Header conditionally render commerce slots only when `isCommerceEnabled()`.
  - **Human step**: set `PUBLIC_COMMERCE_ENABLED=false` in Vercel for both Preview and Production environments before this ticket merges. Document in the PR.
  - `npm run build` succeeds with the flag both off and on (smoke test in CI matrix optional but recommended).
- **Files**: `.env.example`, `src/env.d.ts`, `src/middleware.ts`, `src/lib/commerce/featureFlag.ts`.
- **Out of scope**: any actual commerce features — this lands only the gating primitives and middleware. Downstream tickets call into these helpers.

## GG-E01-A — Provision Commerce Layer organisation

- **Type**: setup · **Human**: YES (CL admin console) · **Depends on**: —
- **Context**: Create the CL org for Gather Ground. UK market, GBP currency, VAT-inclusive pricing.
- **AC**: CL org created. Market `gather-ground-uk` exists with currency GBP, price list `uk-retail-gbp`, tax category `vat-uk-20` (UK standard 20%) and `vat-uk-0` (zero-rated) configured. Production + sandbox orgs both created.
- **Deliverable**: Document org slug + market id + price list id in `docs/commerce-vendor-config.md` (new) and team password manager.

## GG-E01-B — Configure CL stock location + shipping method

- **Type**: setup · **Human**: YES (CL admin console) · **Depends on**: GG-E01-A
- **Context**: One UK warehouse stock location. One flat-rate UK shipping method (£X for orders < £Y, free over £Y — confirm thresholds with Dan before configuring).
- **AC**: Stock location `uk-warehouse-01`, shipping zone covering GB, shipping method with thresholds set, shipping category default `standard-uk`.
- **Deliverable**: IDs documented alongside GG-E01-A.

## GG-E01-C — Generate CL API credentials + add to env

- **Type**: setup · **Human**: YES (CL + Vercel) · **Depends on**: GG-E01-A
- **Context**: Three credentials needed: integration (server, full scope) for sync + webhooks, sales channel (storefront, scoped to read-only catalog + cart write) for browser-bound calls if ever needed, webhook signing secret. Store all in Vercel env (production + preview) and `.env.example` as placeholders.
- **AC**: `COMMERCELAYER_ORGANIZATION`, `COMMERCELAYER_INTEGRATION_CLIENT_ID`, `COMMERCELAYER_INTEGRATION_CLIENT_SECRET`, `COMMERCELAYER_SALES_CHANNEL_CLIENT_ID`, `COMMERCELAYER_WEBHOOK_SECRET`, `COMMERCELAYER_MARKET_ID` in Vercel + local. Type-augmented in `src/env.d.ts`.
- **ADR**: triggers ADR-033 credential split note.

## GG-E02-A — Create Stripe account + enable Apple/Google Pay

- **Type**: setup · **Human**: YES (Stripe dashboard) · **Depends on**: —
- **Context**: Test + live Stripe accounts. Enable card, Apple Pay, Google Pay, Link. Configure UK as business country. Add `gather-ground.com` to Apple Pay domain list (file upload happens in GG-E42-A).
- **AC**: Stripe accounts created, payment methods enabled, statement descriptor set, restricted API key with `payment_intents:write` only stored alongside CL creds.
- **Deliverable**: Publishable key + restricted key in Vercel env as `STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY`.

## GG-E02-B — Connect Stripe to Commerce Layer as payment gateway

- **Type**: setup · **Human**: YES (CL admin) · **Depends on**: GG-E01-A, GG-E02-A
- **Context**: CL's Stripe gateway needs Stripe restricted key + publishable key. CL handles PaymentIntent creation on the server; client uses publishable key.
- **AC**: Stripe payment method enabled on UK market in CL. CL gateway id documented. Test transaction via CL admin "create test order" succeeds with Stripe test card.

## GG-E03-A — Install commerce SDK packages

- **Type**: infra · **Human**: none · **Depends on**: —
- **Context**: Add `@commercelayer/sdk` and `@commercelayer/js-auth` for server use. Add `@stripe/stripe-js` + `@stripe/react-stripe-js` for client (Payment Element). All other commerce calls happen server-side.
- **AC**: Packages installed. `npm run typecheck` clean. No commerce code imports yet (just installation).

## GG-E03-B — Define vendor-neutral commerce types

- **Type**: infra · **Human**: none · **Depends on**: —
- **Context**: Canonical types live in `src/lib/commerce/types.ts` and are the single source of truth used by every page, component, and Storybook mock. CL adapter maps CL responses → these types.
- **AC**: Types defined: `Money`, `Product`, `Variant`, `Option`, `OptionValue`, `InventoryStatus` (`in_stock` | `low_stock` | `out_of_stock`), `Cart`, `LineItem`, `Address`, `ShippingMethod`, `PaymentMethod`, `Order`, `OrderStatus`, `Customer`. All optional fields explicit. No CL-specific shape leaks (no `data.attributes`, no `relationships`).
- **Files**: `src/lib/commerce/types.ts`.

## GG-E03-C — Commerce adapter interface

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-B
- **Context**: `CommerceAdapter` interface in `src/lib/commerce/adapter.ts` lists every method any page/route may call. New methods MUST be added here before any consumer uses them. This is the surface Shopify must implement to swap.
- **AC**: Interface defined for: auth (`login`, `register`, `logout`, `requestPasswordReset`, `confirmPasswordReset`, `refreshSession`), catalog (`getVariantInventory`, `getVariantPrice`), cart (`createCart`, `getCart`, `addLineItem`, `updateLineItem`, `removeLineItem`), customer (`getCustomer`, `updateCustomer`, `changePassword`, `listAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`, `listOrders`, `getOrder`), checkout (`attachCustomerToOrder`, `setOrderEmail`, `setShippingAddress`, `setBillingAddress`, `listShippingMethods`, `setShippingMethod`, `createPaymentSource`, `placeOrder`), sync (`upsertVariant`, `deleteVariant`).

## GG-E03-D — Commerce Layer adapter implementation (auth + client base)

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-C
- **Context**: Implement the CL-specific adapter under `src/lib/commerce/commercelayer/`. This ticket lands ONLY the CL SDK client setup + auth methods. Other method groups land in their respective lanes (e.g. cart methods in L4).
- **AC**: `commercelayer/client.ts` exposes integration client + sales-channel client factory using env from GG-E01-C. `commercelayer/auth.ts` implements `login`, `register`, `logout`, `requestPasswordReset`, `confirmPasswordReset`, `refreshSession`. All map to vendor-neutral types. Unit tests in `src/lib/commerce/commercelayer/auth.test.ts` mock CL with MSW.
- **Files**: `src/lib/commerce/commercelayer/client.ts`, `commercelayer/auth.ts`, `commercelayer/index.ts`, `commercelayer/__tests__/`.

## GG-E03-E — Commerce adapter selector

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-D
- **Context**: `src/lib/commerce/index.ts` exports a singleton `commerce: CommerceAdapter` selected via env (`COMMERCE_PROVIDER=commercelayer` default; future `shopify`). All consumers import from here, never from `commercelayer/`.
- **AC**: ESLint rule (`no-restricted-imports`) forbids importing from `src/lib/commerce/commercelayer/**` outside the selector. Stub `src/lib/commerce/shopify/index.ts` that throws "not implemented" to prove the boundary compiles.
- **Verifies**: the abstraction.

## GG-E03-F — ADR-033 commerce adapter boundary

- **Type**: docs · **Human**: none · **Depends on**: GG-E03-E
- **Context**: Document the adapter contract: where it lives, what it owns, how Shopify swap will work, type-leak prohibitions.
- **AC**: ADR appended to `DECISIONS.md`.

## GG-E03-G — ADR-034 Sanity-first editor + one-way CL sync

- **Type**: docs · **Human**: none · **Depends on**: —
- **Context**: Documents that editorial happens in Sanity, sync flows Sanity → CL only, CL never writes back product data (CL only emits stock/order events). Editors do not log into CL.
- **AC**: ADR appended to `DECISIONS.md`.

## GG-E04-A — Session cookie utilities

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-E
- **Context**: Signed + encrypted cookie holding CL access token + refresh token + customer id. Uses `iron-session` or equivalent with a server-only secret. Cookie name `gg_session`. HttpOnly, Secure, SameSite=Lax, 30-day rolling.
- **AC**: `src/lib/commerce/session.ts` exposes `getSession(cookies)`, `setSession(cookies, data)`, `clearSession(cookies)`. Secret env var `SESSION_SECRET` (32+ bytes) added.

## GG-E04-B — Auth API: POST /api/commerce/auth/login

- **Type**: api · **Human**: none · **Depends on**: GG-E04-A
- **Context**: Validates email+password, calls `commerce.login()`, writes session cookie, returns 200 + redirect target. Rate-limit via in-memory bucket (Vercel KV in launch ticket).
- **AC**: Returns 401 on bad credentials, 200 on success, never echoes back password. Body validated by Zod schema.

## GG-E04-C — Auth API: POST /api/commerce/auth/logout

- **Type**: api · **Human**: none · **Depends on**: GG-E04-A
- **AC**: Clears session cookie + revokes CL refresh token. 204.

## GG-E04-D — Auth API: POST /api/commerce/auth/register

- **Type**: api · **Human**: none · **Depends on**: GG-E04-A, GG-E04-B
- **Context**: Email+password registration with Turnstile (`src/lib/turnstile.ts`). Auto-login after successful registration. Email verification deferred per decision.
- **AC**: 409 on duplicate email, 400 on weak password (min 12 chars per CL rules), 200 + session cookie on success.

## GG-E04-E — Auth API: POST /api/commerce/auth/password-reset/request

- **Type**: api · **Human**: none · **Depends on**: GG-E04-A, GG-E30-EML-01 (template)
- **AC**: Always returns 200 (no account enumeration). Triggers CL password reset, intercepts reset URL, sends our own Resend email with branded template + token link to `/account/reset-password?token=...`.

## GG-E04-F — Auth API: POST /api/commerce/auth/password-reset/confirm

- **Type**: api · **Human**: none · **Depends on**: GG-E04-A
- **AC**: Validates token + new password, calls `commerce.confirmPasswordReset`, auto-logs in.

## GG-E04-G — Astro middleware: session refresh + route guard scaffold

- **Type**: infra · **Human**: none · **Depends on**: GG-E04-A, GG-E00
- **Context**: Middleware reads session, refreshes CL access token if near expiry, attaches `locals.session` and `locals.customer` for pages. Adds `/account/*` guard that redirects to `/account/login?next=...` when no session.
- **AC**: `src/middleware.ts` extended. Unit test verifies refresh path with mocked clock.

## GG-E04-H — ADR-035 customer auth approach

- **Type**: docs · **Human**: none · **Depends on**: GG-E04-G
- **AC**: ADR appended covering CL auth + server cookie + middleware refresh + deliberate omission of social login.

---

# L1 — Catalog data

## GG-E10-A — Sanity object schema: `variant`

- **Type**: schema · **Human**: none · **Depends on**: GG-E03-G, GG-E00
- **Context**: New object type representing one purchasable variant. Used as an array item on `products`. Object types themselves don't need flag-gating (they're invisible unless referenced); the gating happens on the parent field in `products` (GG-E10-C).
- **Context**: New object type representing one purchasable variant. Used as an array item on `products`.
- **AC**: Fields: `sku` (string, required, slug-like validation), `optionValues` (array of `{optionName, value}` matching product `options`), `priceGBP` (number, GBP minor units rejected — major units accepted; validation rejects negatives), `compareAtPriceGBP` (number, optional, > price), `weightG` (number, optional), `inventoryPolicy` (`track`|`continue`|`deny`), `image` (image, optional, defaults to product hero).
- **Files**: `src/sanity/schemas/variant.ts`.

## GG-E10-B — Sanity object schema: `productOptions`

- **Type**: schema · **Human**: none · **Depends on**: GG-E00
- **Context**: Defines option dimensions (e.g. Size, Colour) and allowed values for a product.
- **AC**: Fields: `name` (string, e.g. "Size"), `values` (array of strings, unique, min 1).
- **Files**: `src/sanity/schemas/productOption.ts`.

## GG-E10-C — Extend `products` schema with commerce fields

- **Type**: schema · **Human**: none · **Depends on**: GG-E10-A, GG-E10-B, GG-E00
- **Context**: Adds commerce fields to existing `products` doc without removing existing editorial fields. **Every new field uses `hidden: commerceFieldHidden()`** from GG-E00 so editors see nothing until the flag flips. Validation: every variant must have unique SKU; option-value combinations must be unique across variants; first variant becomes default.
- **AC**: New fields (all `hidden`-gated): `baseSku`, `options` (array of `productOption`), `variants` (array of `variant`, min 1), `taxCategory` (`vat-uk-20` | `vat-uk-0`), `shippingCategory` (`standard-uk`). Studio preview shows default variant price + stock count only when commerce is enabled. Existing editorial fields unaffected. With flag off, opening a `products` doc in Studio shows the legacy editing experience untouched.
- **Files**: `src/sanity/schemas/products.ts`.

## GG-E10-D — GROQ projections for product commerce fields

- **Type**: schema · **Human**: none · **Depends on**: GG-E10-C
- **AC**: New projection `productCommerceProjection` in `src/lib/queries.ts`. Used by PDP/PLP queries. No stega on SKU/price/inventory fields (call `stegaClean` on these in `sectionData.ts` style helper).

## GG-E10-E — Sanity Studio preview: live CL inventory badge

- **Type**: integration · **Human**: none · **Depends on**: GG-E10-C, GG-E03-D (catalog adapter methods land here too)
- **Context**: Custom Studio preview component for `products` showing live CL stock per variant. Read-only — confirms sync is working without leaving Sanity.
- **AC**: `src/sanity/components/ProductStockPreview.tsx` calls a server route `/api/commerce/admin/variant-stock?sku=` (Sanity-token gated) and renders a tiny stock table.

## GG-E10-F — Migrate existing product documents

- **Type**: schema · **Human**: YES (Sanity Studio) · **Depends on**: GG-E10-C
- **Context**: Existing `products` docs have no SKU/variant data. Either backfill via a one-shot script under `scripts/` or have content team add manually. Recommend script with a CSV input.
- **AC**: Migration script `scripts/migrate-products-add-variants.ts` accepts a CSV (slug, sku, priceGBP, options...) and patches existing docs. Human runs once locally with read+write token.

---

# L2 — Sanity ↔ Commerce Layer sync

## GG-E11-A — Sync logic in `commerce/sync.ts`

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-D, GG-E10-D, GG-E00
- **Context**: Pure function `syncProductToCommerce(sanityProduct)` that uses adapter methods `upsertVariant` / `deleteVariant`. Uses Sanity `_id` as CL `reference`. Idempotent: hashes payload, skips if hash unchanged. **No-ops when `isCommerceEnabled()` is false** (defence-in-depth; webhook receiver also gates).
- **AC**: Handles create / update / delete (soft-delete = mark CL inactive). Returns structured result `{created: [], updated: [], skipped: [], deleted: [], errors: []}`. Unit tests cover all four paths plus the flag-off no-op path.

## GG-E11-B — Sanity webhook receiver

- **Type**: api · **Human**: none · **Depends on**: GG-E11-A
- **Context**: `POST /api/commerce/sync/sanity-webhook` receives Sanity GROQ-powered webhook payloads (filter: `_type == "products"`). Uses `requireCommerceEnabled()` first — returns 404 when flag off. Verifies Sanity signature. Calls `syncProductToCommerce`. Returns 200 with summary even on partial failure (so Sanity does not retry forever); logs errors to Sentry.
- **AC**: 404 when flag off. Webhook signature verified. Replay-safe. Latency budget < 3s for single doc.

## GG-E11-C — Configure Sanity webhook in Studio

- **Type**: setup · **Human**: YES (Sanity Manage UI) · **Depends on**: GG-E11-B deployed to preview
- **AC**: Webhook created pointing to preview + production URLs, filter `_type == "products"`, projection includes all commerce fields, signature secret stored in env as `SANITY_WEBHOOK_SECRET`.

## GG-E11-D — Backfill sync script

- **Type**: infra · **Human**: YES (run locally) · **Depends on**: GG-E11-A, GG-E10-F
- **Context**: One-shot script `scripts/sync-all-products-to-cl.ts` to push every existing Sanity product into CL after initial migration.
- **AC**: Script lists all `products` docs, calls `syncProductToCommerce` for each, prints summary. Dan runs once.

## GG-E13-A — CL webhook receiver + HMAC verification

- **Type**: api · **Human**: none · **Depends on**: GG-E01-C, GG-E00
- **Context**: `POST /api/commerce/webhooks/cl` receives CL events. Uses `requireCommerceEnabled()` first — returns 404 when flag off. Verifies CL HMAC signature. Dispatches by event topic to handler functions. This ticket lands the receiver + signature + dispatcher stub only — handlers land in dependent tickets.
- **AC**: 404 when flag off. Returns 401 on invalid signature, 200 on accepted. Logs unhandled topics without erroring.

## GG-E13-B — CL webhook handler: stock change → revalidate

- **Type**: integration · **Human**: none · **Depends on**: GG-E13-A
- **Context**: On `stock_items.updated`, look up affected SKUs, derive affected product slugs, call Vercel `revalidatePath('/products/[slug]')` so PDP renders fresh inventory within a minute.
- **AC**: Revalidation triggered for each affected slug. Smoke test in PR description.

## GG-E13-C — Configure CL webhooks in CL admin

- **Type**: setup · **Human**: YES (CL admin) · **Depends on**: GG-E13-A deployed
- **AC**: CL webhooks created for `stock_items.updated`, `orders.placed`, `orders.approved`, `orders.cancelled`, `shipments.shipped`. URLs point to preview + production deploys. Signing secret matches env.

---

# L3 — Product UI

> All component tickets in this lane: own folder under `src/components/Product/`, types-first per ADR-017, story under `Ecommerce/Product/<Name>`, play function for interactive ones. Each ticket lands the component + story + types only — design is done in code per the design-in-code workflow; page wiring lands in `GG-E12-PG-*`.

## GG-E12-CMP-01 — `PriceDisplay` component

- **Type**: component · **Depends on**: GG-E03-B
- **Context**: Static `.astro` component renders one variant's price. Supports compare-at strike-through, currency-aware formatting (Intl.NumberFormat, `en-GB` + `GBP`), VAT-inclusive label.
- **AC**: Props: `price: Money`, `compareAt?: Money`, `vatInclusive?: boolean` (default true). Stories: `Default`, `OnSale`, `LongDigits`. No commerce SDK imports.

## GG-E12-CMP-02 — `VariantPicker` component

- **Type**: component · **Depends on**: GG-E03-B
- **Context**: React island. Renders one selector per option (e.g. Size pills, Colour swatches). Emits selected variant id. URL-synced via `?variant=` for shareability + server-rendered consistency on reload.
- **AC**: Props: `options: Option[]`, `variants: Variant[]`, `initialVariantId?: string`, `onChange(variantId)`. Disables option values that would create an unavailable combination. Stories: `SingleOption`, `MultipleOptions`, `WithSomeOOS`. Play function exercises selection.

## GG-E12-CMP-03 — `InventoryBadge` component

- **Type**: component · **Depends on**: GG-E03-B
- **Context**: Static `.astro`. Three states driven by `InventoryStatus`.
- **AC**: Props: `status: InventoryStatus`, `quantity?: number`. Stories: `InStock`, `LowStock` (with qty), `OutOfStock`.

## GG-E12-CMP-04 — `QuantitySelector` component

- **Type**: component · **Depends on**: —
- **Context**: React island. +/− buttons with input. Clamps to `min`/`max`.
- **AC**: Props: `value`, `min` (default 1), `max?`, `onChange`. A11y: live region announces qty changes. Stories: `Default`, `Maxed`.

## GG-E12-CMP-05 — `AddToCartButton` component

- **Type**: component · **Depends on**: GG-E03-B
- **Context**: React island. Renders shadcn Button; handles pending/success/error states. Calls a prop callback — does NOT call API directly (page composes with cart API in L4).
- **AC**: Props: `variantId`, `quantity`, `disabled?`, `onAdd(variantId, qty) => Promise<void>`. States: idle/loading/success/error. Stories: `Default`, `Disabled`, `Loading`, `OutOfStock`. Play function clicks + asserts.

## GG-E12-CMP-06 — `ProductPurchasePanel` component

- **Type**: component · **Depends on**: GG-E12-CMP-01..05
- **Context**: React island that composes all of the above into the right-column purchase panel on PDP. Receives product + variants from server.
- **AC**: Props: `product: Product`, `variants: Variant[]`, `initialVariantId?`, `onAddToCart`. Stories: `Default`, `SingleVariant`, `OutOfStockVariant`. Play function exercises full flow.

## GG-E12-PG-01 — PDP wiring: fetch live commerce data + render purchase panel

- **Type**: page · **Human**: none · **Depends on**: GG-E12-CMP-06, GG-E11-D (so CL has data), GG-E04-G
- **Context**: Update `src/pages/products/[slug].astro` frontmatter to call `commerce.getVariantPrice` + `commerce.getVariantInventory` for every variant (parallel) and pass to `ProductPurchasePanel`. Editorial sections remain Sanity-driven.
- **AC**: PDP renders price + stock from CL. Visual Editing still works on editorial fields. SSR latency budget +200ms max vs current.

## GG-E12-PG-02 — PLP price wiring

- **Type**: page · **Depends on**: GG-E12-CMP-01
- **Context**: Update `ProductCard` (existing marketing card) to optionally render `PriceDisplay` for the default variant. Fetched server-side in product listing pages.
- **AC**: Cards show "from £X" when product has multiple price tiers. Flag-gated by `PUBLIC_COMMERCE_ENABLED`.

---

# L4 — Cart

## GG-E20-A — Cart adapter methods (CL implementation)

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-E
- **Context**: Implement adapter cart methods in `src/lib/commerce/commercelayer/cart.ts`. Includes line-item add/update/remove + cart fetch by id. Cart is a CL `order` in `draft` state.
- **AC**: All cart methods listed in GG-E03-C implemented + unit-tested with MSW.

## GG-E20-B — Cart cookie helpers (cross-session persistence)

- **Type**: infra · **Human**: none · **Depends on**: —
- **Context**: HttpOnly cookie `gg_cart` holding opaque CL order id + cart token. Created lazily on first add. Separate from session cookie so guests can have carts. **30-day rolling expiry** — cart contents survive browser close, device sleep, and return visits within the window. Refreshed (sliding) on every cart read so an active shopper never loses their cart.
- **AC**: `src/lib/commerce/cartCookie.ts` exposes `getCartCookie`, `setCartCookie`, `clearCartCookie`. Cookie: `HttpOnly`, `Secure`, `SameSite=Lax`, `Max-Age=2592000`, `Path=/`. Setting the cookie on a read refreshes the expiry. Unit tests cover lazy-create + refresh.

## GG-E20-C — Cart API: GET /api/commerce/cart

- **Type**: api · **Human**: none · **Depends on**: GG-E20-A, GG-E20-B
- **AC**: Returns vendor-neutral `Cart` JSON. 200 with empty cart shape (no cookie) or hydrated cart.

## GG-E20-D — Cart API: POST /api/commerce/cart/items

- **Type**: api · **Human**: none · **Depends on**: GG-E20-C
- **AC**: Body `{variantId, quantity}`. Creates cart if missing. Returns updated cart.

## GG-E20-E — Cart API: PATCH /api/commerce/cart/items/[lineItemId]

- **Type**: api · **Human**: none · **Depends on**: GG-E20-D
- **AC**: Body `{quantity}`. 404 if not in cart.

## GG-E20-F — Cart API: DELETE /api/commerce/cart/items/[lineItemId]

- **Type**: api · **Human**: none · **Depends on**: GG-E20-D
- **AC**: 204 on success.

## GG-E21-CMP-00 — `CartProvider` React context

- **Type**: component · **Depends on**: GG-E03-B, GG-E20-C
- **Context**: Global cart state for the client. Holds two pieces of state: (a) the current `Cart` (line items + totals), and (b) drawer open/closed boolean. Hydrated on every page load from the server (Astro frontmatter calls `getCart()` and passes initial `Cart` into the provider, so first paint already has correct count — no flash of empty cart). Exposes hooks: `useCart()`, `useCartCount()`, `useCartActions()` (add/update/remove/clear), `useCartDrawer()` (`{isOpen, open, close, toggle}`).
- **AC**: Mutations call cart API routes (GG-E20-D/E/F) with optimistic updates and rollback on failure. Adding an item auto-opens the drawer. Drawer open-state is client-only (does not survive page navigation — standard ecom behaviour; cart **contents** survive via cookie/server). Stories under `Ecommerce/Cart/CartProvider` document the API surface only (no visual render).
- **Files**: `src/components/Cart/CartProvider/CartProvider.tsx`, `.types.ts`, `.stories.tsx`.

## GG-E21-CMP-01 — `CartIcon` component

- **Type**: component · **Depends on**: GG-E21-CMP-00
- **Context**: React island in the header. Reads count via `useCartCount()`. Click toggles drawer via `useCartDrawer().toggle()`. Renders a numeric badge when count > 0 (hidden at 0; capped display `99+`).
- **AC**: Props: none (consumes context). Accessible: `aria-label="Cart, N items"`, `aria-expanded` reflects drawer state. Stories: `Empty`, `WithCount`, `99Plus`. Play function clicks icon and asserts `toggle` was called.

## GG-E21-CMP-02 — `CartLineItem` component

- **Type**: component · **Depends on**: GG-E03-B, GG-E12-CMP-04
- **Context**: One row inside the drawer. Image, name, variant label, qty selector, line total, remove button.
- **AC**: Props: `item: LineItem`, `onQuantityChange`, `onRemove`. Stories: `Default`, `OutOfStock`, `LowStock`.

## GG-E21-CMP-03 — `CartSummary` component

- **Type**: component · **Depends on**: GG-E03-B
- **Context**: Subtotal, shipping ("calculated at checkout"), tax line, total. Rendered inside the drawer above the checkout CTA.
- **AC**: Props: `cart: Cart`. Stories: `Default`, `Empty`, `ShippingTBD`.

## GG-E21-CMP-04 — `CartEmptyState` component

- **Type**: component · **Depends on**: —
- **Context**: Body of the drawer when cart is empty. Heading + CTA to `/products` (closes drawer on click).
- **AC**: Stories: `Default`.

## GG-E21-CMP-05 — `CartDrawer` component (global)

- **Type**: component · **Depends on**: GG-E21-CMP-00, GG-E21-CMP-02..04
- **Context**: React island using shadcn Sheet (or Base UI Dialog) sliding from the right. **Mounted once globally** in `Layout.astro` so every page can open it without re-mounting. Reads everything from `CartProvider` context — no props. Auto-opens when an item is added (via context action). Accessible: focus trap, ESC closes, returns focus to trigger. If view transitions are enabled site-wide, the wrapping island uses `transition:persist` so the drawer animation is not interrupted on navigation.
- **AC**: Props: none (consumes context). Stories: `Empty`, `Populated`, `WithError`. Play function asserts focus management + ESC close + auto-open on add. Mounted once per document; opening from one page and navigating to another keeps cart contents intact (state survives because cookie + server-hydrated provider rehydrates on the new page).

## GG-E22-A — Layout integration: mount `CartProvider` + `CartDrawer` globally; `CartIcon` in header

- **Type**: page · **Depends on**: GG-E21-CMP-00, GG-E21-CMP-01, GG-E21-CMP-05
- **Context**: Single integration ticket. In `Layout.astro` frontmatter, call `getCart()` server-side to get the initial cart, pass it into `<CartProvider initialCart={...} client:load>` which wraps the page body. Inside that provider, mount `<CartDrawer client:load />` once. In `Header.astro`, render `<CartIcon client:load />` in the right zone behind `PUBLIC_COMMERCE_ENABLED`. Clicking the icon toggles the drawer via shared context. No standalone cart page exists — the drawer is the only cart UI.
- **AC**: First paint shows correct cart count (no flash). Opening the drawer from any page works. Adding from PDP auto-opens drawer. Navigating with the drawer closed shows cart count is still correct. Drawer mounted once per document (verify via DevTools — no duplicate Sheets). No layout shift in the header when count appears/disappears.

## GG-E22-B — Header: account icon (auth-aware)

- **Type**: page · **Depends on**: GG-E04-G
- **Context**: Single account icon in the header right zone, **always rendered** when `PUBLIC_COMMERCE_ENABLED` is on — visual treatment is identical for both auth states (no "Sign in" text label or avatar swap, to avoid layout shift and to keep the header chrome consistent). Destination changes based on `locals.session`: logged out → `/account/login`; logged in → `/account` (dashboard). Read state in `Header.astro` frontmatter; render a plain anchor with the correct `href` — no client JS needed for the link itself.
- **AC**: Icon renders identically in both states. `href` resolves server-side based on `locals.session`. `aria-label="Sign in"` when logged out, `aria-label="My account"` when logged in. No layout shift between states. No client fetch for auth state. Icon sits next to the cart icon (cart icon comes first, account icon second — standard ecom pattern).

## GG-E22-C — Mobile menu: cart + account

- **Type**: page · **Depends on**: GG-E22-A, GG-E22-B
- **AC**: `MobileMenu.tsx` mirrors desktop: cart icon (toggles drawer, with count badge) and account icon (auth-aware destination, same routing rules as GG-E22-B). Both visible only when `PUBLIC_COMMERCE_ENABLED` is on.

---

# L5 — Auth & account

## GG-E30-EML-01 — Resend template: password reset email

- **Type**: component · **Depends on**: —
- **Context**: React Email template under `src/components/Email/PasswordResetEmail/`. Story under `Ecommerce/Email/PasswordResetEmail` renders HTML preview.
- **AC**: Props: `customerFirstName`, `resetUrl`. HTML + plain-text variants.

## GG-E30-CMP-01 — `LoginForm` component

- **Type**: component · **Depends on**: —
- **Context**: React island following `ContactForm` pattern. Posts to `/api/commerce/auth/login`. Field-level + form-level errors.
- **AC**: Props: `redirectTo?`. Stories: `Default`, `WithErrors`, `Loading`. Play function asserts validation.

## GG-E30-CMP-02 — `RegisterForm` component

- **Type**: component · **Depends on**: —
- **AC**: Includes Turnstile widget, marketing opt-in checkbox (re-uses Brevo wiring), password strength indicator. Stories: `Default`, `WithErrors`, `Loading`.

## GG-E30-CMP-03 — `ForgotPasswordForm` component

- **Type**: component · **Depends on**: —
- **AC**: Email only. Success state shows "If an account exists, we sent a link". Stories: `Default`, `Submitted`.

## GG-E30-CMP-04 — `ResetPasswordForm` component

- **Type**: component · **Depends on**: —
- **AC**: New password + confirm. Reads token from URL. Stories: `Default`, `InvalidToken`, `Success`.

## GG-E30-PG-01..04 — Auth pages

- **Type**: page · **Depends on**: GG-E30-CMP-01..04
- One ticket per page: `/account/login`, `/account/register`, `/account/forgot-password`, `/account/reset-password`. Each renders the matching form inside a centred narrow layout. Redirect logged-in users away (except reset-password).
- **AC**: SEO `noindex`. Stories per form already cover UI.

## GG-E31-CMP-01 — `AccountNav` component

- **Type**: component · **Depends on**: —
- **AC**: Side nav (desktop) / horizontal scroll (mobile). Items: Dashboard, Orders, Addresses, Profile, Sign out. Stories: `Default`, `ActiveOrders`.

## GG-E31-CMP-02 — `AccountCartPanel` component

- **Type**: component · **Depends on**: GG-E21-CMP-00, GG-E21-CMP-02, GG-E21-CMP-03, GG-E21-CMP-04
- **Context**: Inline cart view rendered on the account dashboard. **Same data as `CartDrawer`, different presentation** — the drawer is a side overlay for in-flow use; this panel is a card embedded in the dashboard so a logged-in customer can review/edit their cart without leaving their account hub. Reads cart from `CartProvider` context (no prop drilling). Composes `CartLineItem` rows + `CartSummary` + a primary "Checkout" CTA. When empty, renders `CartEmptyState`. Edits (qty change, remove) reuse the same context actions as the drawer — changes are immediately reflected in the drawer/header count.
- **AC**: Props: none (consumes context). Stories under `Ecommerce/Account/AccountCartPanel`: `Empty`, `Populated`, `WithOutOfStockItem`. Editing an item here updates the drawer's view next time it opens (single source of truth via context).
- **Files**: `src/components/Account/AccountCartPanel/AccountCartPanel.tsx`, `.types.ts`, `.stories.tsx`.

## GG-E31-PG-01 — `/account` dashboard

- **Type**: page · **Depends on**: GG-E31-CMP-01, GG-E31-CMP-02, GG-E33-CMP-01, GG-E04-G
- **Context**: The signed-in hub. Composes (in order): greeting using `locals.customer.firstName`; `AccountCartPanel` (current cart, edit + checkout); a two-column row of summary cards — default shipping address (`AddressCard` with "Manage addresses" CTA → `/account/addresses`) and profile/billing summary (name + email + "Edit profile" CTA → `/account/profile`); recent orders strip (last 3 via `OrderListItem`, "View all orders" CTA → `/account/orders`). All data fetched server-side in frontmatter via `locals.customer` + adapter methods; cart hydrated via the global `CartProvider` already mounted in `Layout.astro`.
- **AC**: Server-renders with no client fetches for initial paint. Unauth users hit the middleware guard (GG-E04-G) and are redirected to `/account/login?next=/account`. Empty states handled for no addresses, no orders, empty cart. Editing the cart from this page updates the header count + drawer immediately (verified via Playwright in GG-E51-C).

## GG-E32-API-01 — Customer orders adapter (CL)

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-E
- **AC**: `listOrders`, `getOrder` implemented in `commercelayer/customer.ts`. Scoped to authenticated customer. Pagination.

## GG-E32-CMP-01..05 — Order components

- **Type**: component · **Depends on**: GG-E03-B
- One ticket each: `OrdersList`, `OrderListItem`, `OrderDetail`, `OrderLineItem`, `OrderStatusBadge`. Static `.astro` except where interactivity (e.g. reorder button later).
- **AC**: Each has stories under `Ecommerce/Account/<Name>` with realistic mock orders (pending, paid, shipped, delivered, cancelled, refunded).

## GG-E32-PG-01 — `/account/orders` list page

- **Type**: page · **Depends on**: GG-E32-CMP-01, GG-E32-API-01
- **AC**: Paginated, server-rendered.

## GG-E32-PG-02 — `/account/orders/[id]` detail page

- **Type**: page · **Depends on**: GG-E32-CMP-03, GG-E32-API-01
- **AC**: 404 if order does not belong to authenticated customer.

## GG-E33-API-01 — Address adapter + API

- **Type**: infra+api · **Human**: none · **Depends on**: GG-E03-E
- **AC**: Adapter methods + `GET/POST/PATCH/DELETE /api/commerce/account/addresses` (collection + item). All scoped to current customer.

## GG-E33-CMP-01..03 — Address components

- **Type**: component · **Depends on**: —
- One ticket each: `AddressCard`, `AddressList`, `AddressForm`. Form uses UK address layout (line1, line2, city, postcode, country=GB locked). Postcode validation regex.
- **AC**: Stories per component with realistic mocks.

## GG-E33-PG-01 — `/account/addresses` page

- **Type**: page · **Depends on**: GG-E33-CMP-01..03, GG-E33-API-01
- **AC**: List + add/edit/delete + set default shipping/billing.

## GG-E34-API-01 — Profile adapter + API

- **Type**: infra+api · **Human**: none · **Depends on**: GG-E03-E
- **AC**: `getCustomer`, `updateCustomer`, `changePassword` + matching routes.

## GG-E34-CMP-01 — `ProfileForm` component

- **Type**: component · **Depends on**: —
- **AC**: Name + email update.

## GG-E34-CMP-02 — `ChangePasswordForm` component

- **Type**: component · **Depends on**: —
- **AC**: Current + new + confirm.

## GG-E34-PG-01 — `/account/profile` page

- **Type**: page · **Depends on**: GG-E34-CMP-01, GG-E34-CMP-02, GG-E34-API-01
- **AC**: Two stacked forms.

---

# L6 — Checkout

## GG-E40-API-01 — Checkout adapter methods (CL)

- **Type**: infra · **Human**: none · **Depends on**: GG-E03-E, GG-E20-A
- **Context**: Implements `attachCustomerToOrder`, `setOrderEmail`, `setShippingAddress`, `setBillingAddress`, `listShippingMethods`, `setShippingMethod`, `createPaymentSource`, `placeOrder` in `commercelayer/checkout.ts`.
- **AC**: Unit-tested. All take cart id from cookie.

## GG-E40-CMP-01 — `CheckoutStepper` component

- **Type**: component · **Depends on**: —
- **AC**: Visual progress through Email → Shipping → Payment. Stories: each step active.

## GG-E40-CMP-02 — `CheckoutEmailStep` component

- **Type**: component · **Depends on**: —
- **AC**: Email + "I have an account" link. Stories: `Default`, `GuestPrefilled`, `LoggedIn`.

## GG-E40-CMP-03 — `CheckoutShippingStep` component

- **Type**: component · **Depends on**: GG-E33-CMP-02
- **AC**: Reuses `AddressForm`. For logged-in users, shows saved-address selector + "use new address". Includes shipping-method radio group fed by `listShippingMethods`.

## GG-E40-CMP-04 — `CheckoutPaymentStep` component

- **Type**: component · **Depends on**: GG-E41-A
- **AC**: Hosts Stripe Payment Element. Billing-same-as-shipping toggle. Place-order button.

## GG-E40-CMP-05 — `CheckoutSummary` component

- **Type**: component · **Depends on**: GG-E21-CMP-03
- **AC**: Sticky right-column summary. Collapsible on mobile. Stories: `Default`, `CollapsedMobile`.

## GG-E40-PG-01 — `/checkout` page

- **Type**: page · **Depends on**: GG-E40-CMP-01..05, GG-E40-API-01
- **Context**: Single-page checkout with progressive disclosure managed by an XState (or simple reducer) state machine in a React island. Cart frozen at entry; if cart changes mid-checkout (e.g. line OOS), user notified.
- **AC**: Guest path works without account. SSR initial render with state hydrated from cart cookie + session.

## GG-E41-A — Stripe Payment Element React island

- **Type**: component · **Human**: none · **Depends on**: GG-E02-A
- **Context**: Wraps `@stripe/react-stripe-js` Elements provider + PaymentElement. Receives `clientSecret` from server. Confirms with Stripe, then notifies parent to call `placeOrder`.
- **AC**: Apple Pay + Google Pay rendered when supported. 3DS handled. Errors surfaced. Stories under `Ecommerce/Checkout/StripePaymentForm` with mock client secret (no network).

## GG-E41-B — Adapter: `createPaymentSource` bridging CL + Stripe

- **Type**: infra · **Human**: none · **Depends on**: GG-E40-API-01, GG-E02-B
- **Context**: CL creates a `stripe_payment` source on the order, returning the Stripe PaymentIntent client_secret.
- **AC**: Returns `{clientSecret, publishableKey}` to client.

## GG-E41-C — Adapter: `placeOrder` (final capture)

- **Type**: infra · **Human**: none · **Depends on**: GG-E41-B
- **Context**: After Stripe `confirmPayment` succeeds client-side, server calls CL to transition order to `placed`. CL captures via Stripe.
- **AC**: Returns confirmed `Order`. Race-safe: idempotency key on the route.

## GG-E42-A — Apple Pay domain association file

- **Type**: infra · **Human**: none · **Depends on**: GG-E02-A
- **AC**: File at `public/.well-known/apple-developer-merchantid-domain-association` (content provided by Stripe dashboard, hosted verbatim).

## GG-E42-B — Apple Pay domain verification on Stripe

- **Type**: setup · **Human**: YES (Stripe dashboard, both test + live) · **Depends on**: GG-E42-A deployed
- **AC**: Verification successful in Stripe dashboard for preview + production domains.

## GG-E42-C — Browser smoke test: Apple Pay (Safari) + Google Pay (Chrome)

- **Type**: test · **Human**: YES (physical devices) · **Depends on**: GG-E41-A, GG-E42-B
- **AC**: Apple Pay sheet renders on Safari iOS + macOS with test card. Google Pay sheet on Chrome. Documented in PR with screenshots.

## GG-E43-EML-01 — Resend template: order confirmation email

- **Type**: component · **Depends on**: —
- **AC**: React Email template. Story under `Ecommerce/Email/OrderConfirmationEmail`. Props: order summary.

## GG-E43-CMP-01 — `OrderConfirmation` component

- **Type**: component · **Depends on**: GG-E03-B, GG-E32-CMP-04
- **AC**: Hero "Thanks, [name]!" + order summary + next-steps text + sign-up CTA for guests. Stories: `Guest`, `LoggedIn`.

## GG-E43-PG-01 — `/checkout/confirmation/[orderId]` page

- **Type**: page · **Depends on**: GG-E43-CMP-01, GG-E40-API-01
- **AC**: Access control: order belongs to customer OR matches a short-lived guest token cookie set on `placeOrder`. Sends Resend confirmation email (once, via dedupe key).

## GG-E44-A — CL webhook handler: `orders.placed` → email

- **Type**: integration · **Human**: none · **Depends on**: GG-E13-A, GG-E43-EML-01
- **Context**: Belt-and-braces: in case the post-place email send fails, the webhook handler retries idempotently by order id.

## GG-E44-EML-01 — Resend template: shipping confirmation email

- **Type**: component · **Depends on**: —
- **AC**: React Email template with tracking link.

## GG-E44-B — CL webhook handler: `shipments.shipped` → email

- **Type**: integration · **Human**: none · **Depends on**: GG-E13-A, GG-E44-EML-01
- **AC**: Sends shipping email with carrier + tracking number.

---

# L7 — Launch

## GG-E50 — Storybook coverage audit

- **Type**: chore · **Human**: none · **Depends on**: L3+L4+L5+L6 complete
- **AC**: Every new component has a story; every story has `parameters.design`. CI fails if missing.

## GG-E51-A — Playwright e2e: PDP

- **Type**: test · **Depends on**: L3 complete · **Human**: none
- **AC**: Variant selection updates price/stock, OOS variant disables add-to-cart, add-to-cart opens drawer.

## GG-E51-B — Playwright e2e: cart drawer

- **Type**: test · **Depends on**: L4 complete · **Human**: none
- **AC**: Add from PDP → drawer auto-opens with item. Update qty, remove. Close drawer, navigate to another page, reopen drawer — cart contents intact. Close browser context, reopen with same storage state, drawer count still correct (cross-session persistence). Empty state renders when last item removed.

## GG-E51-C — Playwright e2e: auth + account

- **Type**: test · **Depends on**: L5 complete · **Human**: none
- **AC**: Register → login → logout → forgot → reset. Header account icon: logged-out click goes to `/account/login`; logged-in click goes to `/account`. Account dashboard renders cart panel; editing cart from dashboard updates header count + drawer contents. Orders list visible (mocked). Address CRUD.

## GG-E51-D — Playwright e2e: checkout (Stripe test card)

- **Type**: test · **Depends on**: L6 complete · **Human**: none
- **AC**: Guest purchase happy path using Stripe `4242 4242 4242 4242`. Confirmation page reached, email asserted via Resend test inbox.

## GG-E52-A — Empty & error states audit

- **Type**: chore · **Human**: none · **Depends on**: L4+L5+L6 complete
- **AC**: Empty cart, OOS at checkout, payment failure, expired session, network error each have a defined state with a story.

## GG-E52-B — Axe a11y scan on all commerce pages

- **Type**: test · **Human**: none · **Depends on**: L4+L5+L6 complete
- **AC**: `tests/a11y/commerce.spec.ts` runs axe on PDP, cart, login, register, account, checkout, confirmation. Zero serious/critical violations.

## GG-E53-A — Structured logging on commerce routes

- **Type**: infra · **Human**: none · **Depends on**: all commerce API routes
- **AC**: All `/api/commerce/**` routes log `{route, requestId, customerId, durationMs, status}`; errors include CL response code.

## GG-E53-B — Rate limiting on auth + sync routes

- **Type**: infra · **Human**: minor (Vercel KV provisioning) · **Depends on**: GG-E04-B..F, GG-E11-B, GG-E13-A
- **AC**: Login: 10/min per IP, 5/min per email. Register: 5/hr per IP. Sanity webhook: signature only (no rate). CL webhook: signature only.

## GG-E54-A — Privacy policy update

- **Type**: docs · **Human**: YES (legal review) · **Depends on**: —
- **AC**: `/privacy` page updated with Stripe + CL data sharing, cart cookie, order data retention.

## GG-E54-B — Cookie banner update

- **Type**: page · **Human**: depends on GG-E54-A · **Depends on**: GG-E54-A
- **AC**: Cookie disclosure lists `gg_cart`, `gg_session` as strictly necessary. Existing analytics opt-in unchanged.

## GG-E55-A — Enable flag on Vercel **Preview** + full preview QA

- **Type**: setup · **Human**: YES (Vercel env + manual QA) · **Depends on**: all of L1–L6 merged to `main`, GG-E51-A..D, GG-E52-A, GG-E52-B, GG-E53-A, GG-E53-B, GG-E54-A, GG-E54-B
- **Context**: First time the commerce surface is visible outside localhost. Vendors still in **sandbox/test mode**; Stripe still in test mode; CL still in sandbox org. Preview only — production stays gated.
- **AC**: Set `PUBLIC_COMMERCE_ENABLED=true` on Vercel Preview environment. Trigger preview rebuild. Full manual pass on preview URL: PDP, cart, register, login, password reset, address CRUD, guest checkout with Stripe `4242`, logged-in checkout, order confirmation, account orders. Document any regressions; do not proceed to GG-E55-B until clean.

## GG-E55-B — Vendor live-mode switchover

- **Type**: setup · **Human**: YES · **Depends on**: GG-E55-A
- **Context**: Move CL, Stripe, Resend, webhooks to live/production credentials. Preview env stays on `true` but switches to **live** vendors for final pre-launch QA.
- **AC**: CL live org credentials in Vercel (preview + prod), Stripe live keys (preview + prod), Resend prod domain verified, Sanity webhook re-pointed to production deploy URL, CL webhooks re-pointed. Production env still has `PUBLIC_COMMERCE_ENABLED=false`. Checklist in PR.

## GG-E55-C — Apple Pay live domain verification

- **Type**: setup · **Human**: YES · **Depends on**: GG-E55-B
- **AC**: Apple Pay enabled on `gather-ground.com` (production domain).

## GG-E55-D — Enable flag on Vercel **Production**

- **Type**: setup · **Human**: YES · **Depends on**: GG-E55-C
- **Context**: The launch flip.
- **AC**: Set `PUBLIC_COMMERCE_ENABLED=true` on Vercel Production environment. Trigger production rebuild. Commerce surface live for all visitors.

## GG-E55-E — Production smoke test full purchase

- **Type**: test · **Human**: YES · **Depends on**: GG-E55-D
- **AC**: Real card, refunded immediately. Order visible in CL admin, confirmation email received, account dashboard shows order.

## GG-E55-F — Remove `PUBLIC_COMMERCE_ENABLED` flag and gates

- **Type**: chore · **Human**: none · **Depends on**: GG-E55-E + 2-week soak period
- **AC**: Flag removed from `.env.example`, `src/env.d.ts`, Vercel envs. `isCommerceEnabled()` and `requireCommerceEnabled()` helpers removed. `hidden` options removed from Sanity schemas. Middleware no longer 404s commerce paths. All call sites cleaned up. Default behaviour is commerce-on.

---

# Human-intervention checklist (consolidated)

| #   | Ticket   | What you do                                                                                   | When                       |
| --- | -------- | --------------------------------------------------------------------------------------------- | -------------------------- |
| 1   | GG-E00   | Set `PUBLIC_COMMERCE_ENABLED=false` on Vercel Preview + Production envs (explicit, not unset) | Before GG-E00 merges       |
| 2   | GG-E01-A | Create CL org, market, tax categories                                                         | L0 kickoff                 |
| 3   | GG-E01-B | Configure CL stock + shipping                                                                 | After 2                    |
| 4   | GG-E01-C | Generate CL credentials, populate Vercel env                                                  | After 2                    |
| 5   | GG-E02-A | Create Stripe accounts (test + live), enable Apple/Google Pay                                 | L0 kickoff (parallel)      |
| 6   | GG-E02-B | Connect Stripe to CL                                                                          | After 2 + 5                |
| 7   | GG-E10-F | Run product migration script                                                                  | After L1                   |
| 8   | GG-E11-C | Configure Sanity webhook in Studio                                                            | After L2 receiver deployed |
| 9   | GG-E11-D | Run backfill sync script                                                                      | After L2                   |
| 10  | GG-E13-C | Configure CL webhooks in admin                                                                | After L2 receiver deployed |
| 11  | GG-E42-B | Verify Apple Pay domain in Stripe                                                             | After L6 ships to preview  |
| 12  | GG-E42-C | Smoke-test Apple/Google Pay on devices                                                        | After L6                   |
| 13  | GG-E53-B | Provision Vercel KV for rate limiting                                                         | L7                         |
| 14  | GG-E54-A | Legal review of privacy policy update                                                         | L7                         |
| 15  | GG-E55-A | Flip Vercel **Preview** flag to `true`; full preview QA                                       | After all L7 except 15–18  |
| 16  | GG-E55-B | Switch vendors to live mode                                                                   | After 15                   |
| 17  | GG-E55-C | Verify Apple Pay live domain                                                                  | After 16                   |
| 18  | GG-E55-D | Flip Vercel **Production** flag to `true`                                                     | After 17                   |
| 19  | GG-E55-E | Production smoke test with real card                                                          | After 18                   |

> Per-component **Storybook design reviews** are not listed in this checklist — they happen inline with each component ticket via PR sign-off (see the design-in-code workflow above).

---

# Open questions to resolve before kickoff

1. **Shipping thresholds**: confirm £X flat-rate and £Y free-shipping threshold for GG-E01-B.
2. **Tax categories**: any zero-rated products in the catalogue, or all standard 20%?
3. **Cart-on-login behaviour**: confirm "merge by SKU, sum quantities" (current plan default).
4. **Email verification on register**: confirm "off for MVP" (current plan default).
5. **Order retention / GDPR**: how long do we keep orders against a deleted account?
6. **Currency display**: VAT-inclusive prices everywhere, or show ex-VAT subtotal too?
7. **`compareAtPrice` semantics**: does Sanity drive this, or is "sale" a CL price-list concept? Recommend Sanity for editor control.

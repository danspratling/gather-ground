# Commerce Vendor Config

Reference values for Commerce Layer + Stripe sandbox/production environments.

> **Note:** This file documents IDs and slugs only — never put credentials, API keys, or secrets here. Secrets live in Vercel env vars and the team password manager.

## Commerce Layer

### Sandbox / Test

- **Organization slug:** `gather-ground`
- **Dashboard:** https://dashboard.commercelayer.io/organizations/gather-ground

| Resource          | Name             | ID                                                          |
| ----------------- | ---------------- | ----------------------------------------------------------- |
| Market            | Gather Ground UK | `lqxGhxxGGg`                                                |
| Price list        | uk-retail-gbp    | `lRKvCwXrYL`                                                |
| Stock location    | Manor Farm       | `GzAouwKqwn`                                                |
| Inventory model   | UK Default       | `WdJRSlnkwZ`                                                |
| Shipping zone     | gb-zone          | `PORGztBVpK`                                                |
| Shipping method   | standard-uk      | `VDkvFDmzLN`                                                |
| Stripe gateway    | Stripe (test)    | `jqbrsaLgwk`                                                |
| Shipping category | default          | TBD — find at CL dashboard → Shipping → Shipping categories |

**Tax categories:**

- `vat-uk-20` — UK standard 20%
- `vat-uk-0` — Zero-rated

**Currency:** GBP, VAT-inclusive pricing
**Country scope:** GB

### Production

> Production CL org + gateway are set up during pre-launch validation (see Linear ticket `[GG-E55-E] Production smoke test full purchase`).

| Resource          | Name | ID  |
| ----------------- | ---- | --- |
| Organization slug | TBD  | TBD |
| Market            | TBD  | TBD |
| Price list        | TBD  | TBD |
| Stock location    | TBD  | TBD |
| Inventory model   | TBD  | TBD |
| Shipping zone     | TBD  | TBD |
| Shipping method   | TBD  | TBD |
| Stripe gateway    | TBD  | TBD |

## Stripe

- **Test publishable key:** stored in `STRIPE_PUBLISHABLE_KEY` (Vercel Preview env)
- **Test restricted key:** stored in `STRIPE_SECRET_KEY` (Vercel Preview env)
- **Live keys:** added during pre-launch (see `[GG-E55-E]`)
- **Apple Pay domains:** `gather-ground.com` (added in `[GG-E42-A]`)

## Environment variable mapping

Set these in Vercel (Preview + Production) and in `.env.example` as placeholders:

| Variable                                  | Source                            |
| ----------------------------------------- | --------------------------------- |
| `COMMERCELAYER_ORGANIZATION`              | CL org slug                       |
| `COMMERCELAYER_INTEGRATION_CLIENT_ID`     | CL integration application        |
| `COMMERCELAYER_INTEGRATION_CLIENT_SECRET` | CL integration application        |
| `COMMERCELAYER_SALES_CHANNEL_CLIENT_ID`   | CL sales channel application      |
| `COMMERCELAYER_WEBHOOK_SECRET`            | CL webhook signing secret         |
| `COMMERCELAYER_MARKET_ID`                 | Sandbox/production market ID      |
| `STRIPE_PUBLISHABLE_KEY`                  | Stripe dashboard → API keys       |
| `STRIPE_SECRET_KEY`                       | Stripe dashboard → restricted key |

## Validation status

- ✅ Sandbox test order placed via CL admin with Stripe test card `4242 4242 4242 4242`
- ⏳ Production smoke test pending (tracked in `[GG-E55-E]`)

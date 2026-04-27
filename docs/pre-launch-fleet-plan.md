# Pre-launch fleet plan

Coordinated work plan for the pre-launch ticket sweep. Designed to be safely executed in parallel by multiple agents (`/fleet`).

## How to use

1. Each **lane** is a long-lived feature branch off `main`
2. Within a lane, tickets are sequential (later tickets depend on earlier ones)
3. **Lanes are independent** — they touch disjoint files (with the caveats noted under "Coordination notes")
4. Each lane should produce one or more PRs against `main`
5. Lanes that block other lanes must merge first; downstream lanes rebase

## Lane summary

| Lane                                 | Tickets                             | Scope                                                                        | Blocks     | Branch                        |
| ------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------- | ---------- | ----------------------------- |
| **L1 — CMS foundation**              | GG-107                              | Site settings singleton; Header/Footer editable                              | L4, L5, L6 | `feature/cms-site-settings`   |
| **L2 — Discoverability**             | GG-77, GG-71, GG-78                 | sitemap.xml, robots.txt, OG/canonical metadata, favicons                     | L3         | `feature/discoverability`     |
| **L3 — Structured data + RSS**       | GG-110, GG-109                      | Schema.org JSON-LD, blog RSS feed                                            | —          | `feature/structured-data-rss` |
| **L4 — Forms + email**               | GG-81 → GG-108 → GG-113             | Resend transactional, Contact form + Turnstile, Newsletter wiring            | —          | `feature/forms-email`         |
| **L5 — Compliance**                  | GG-74, GG-75, +Terms                | Cookie banner, Privacy policy, Terms page                                    | —          | `feature/legal-compliance`    |
| **L6 — Polish + small pages**        | GG-76, GG-66, GG-67                 | 404 page, About page, Contact page                                           | —          | `feature/polish-pages`        |
| **L7 — Performance + observability** | GG-103, GG-111, GG-69, GG-80, GG-79 | Sanity image optimisation, Sentry, Clarity, Lighthouse baseline, image audit | —          | `feature/perf-observability`  |
| **L8 — Reliability**                 | GG-70                               | Uptime monitoring                                                            | —          | `feature/uptime`              |
| **L9 — Components**                  | GG-83, GG-84                        | Announcement banner, Location map embed                                      | L1         | `feature/announcement-map`    |

## Dependency graph

```
L1 ──┬── L4 (forms can use site settings)
     ├── L5 (cookie banner injected into Layout)
     ├── L6 (pages can read settings)
     └── L9 (announcement banner is part of header)

L2 ──── L3 (sitemap should exist before structured data references)

L4, L5, L6, L7, L8 — independent of each other
```

## Recommended execution waves

### Wave 1 — foundation (do these first, in parallel)

- **L1** (GG-107) — site settings
- **L2** (GG-77, GG-71, GG-78) — sitemap/SEO basics/favicons
- **L7-a** (GG-111) — Sentry only (no dependency on L1)
- **L8** (GG-70) — uptime monitoring

### Wave 2 — once L1 lands

- **L3** (GG-110, GG-109)
- **L4** (GG-81, GG-108, GG-113)
- **L5** (GG-74, GG-75, Terms)
- **L9** (GG-83, GG-84)

### Wave 3 — once L4 + L5 land

- **L6** (GG-76, GG-66, GG-67) — Contact page needs L4's form, About + Contact pages benefit from L5's privacy text

### Wave 4 — perf cleanup (after content is stable)

- **L7-b** (GG-103, GG-69, GG-80, GG-79)

## Per-lane briefs

### L1 — CMS foundation `feature/cms-site-settings`

**Goal:** Editors can edit Header, Footer, logo, social, copyright in Sanity without touching code.

**Tickets:** GG-107

**Files touched:**

- `src/sanity/schemas/siteSettings.ts` (new)
- `src/sanity/schemas/index.ts`
- `sanity.config.ts` (singleton structure)
- `src/lib/queries.ts`
- `src/layouts/Layout.astro`
- `DECISIONS.md`

**Out:** any Header/Footer markup change. Just plumbing.

---

### L2 — Discoverability `feature/discoverability`

**Goal:** Site is properly indexable + has minimum SEO metadata.

**Tickets:** GG-77 (sitemap + robots), GG-71 (page metadata, OG, canonical), GG-78 (favicons)

**Files touched:**

- `src/pages/sitemap.xml.ts` or `astro-sitemap` integration
- `public/robots.txt`
- `src/layouts/Layout.astro` (head expansion — coordinate with L1!)
- `public/favicon*`, `public/apple-touch-icon.png`, `public/site.webmanifest`
- Per-page metadata where missing

**⚠️ Coordination with L1:** Both lanes edit `Layout.astro`. L1 must land first; L2 rebases.

---

### L3 — Structured data + RSS `feature/structured-data-rss`

**Goal:** Rich SERP results + feed-reader support.

**Tickets:** GG-110 (Schema.org JSON-LD), GG-109 (RSS)

**Files touched:**

- `src/lib/structuredData.ts` (new)
- `src/components/StructuredData/StructuredData.astro` (new)
- `src/pages/blog/rss.xml.ts` (new)
- `src/layouts/Layout.astro` (Organization JSON-LD + RSS link tag — coordinate with L1, L2!)
- Page templates (emit per-page schemas)

**Depends on:** L2 (sitemap exists), L1 (Organization data from siteSettings)

---

### L4 — Forms + email `feature/forms-email`

**Goal:** Newsletter + Contact form actually work.

**Tickets:** GG-81 (Resend setup), GG-108 (Contact form + Turnstile), GG-113 (Newsletter wiring)

**Files touched:**

- `src/lib/email.ts` (new — Resend client)
- `src/lib/turnstile.ts` (new — shared verification)
- `src/pages/api/contact.ts` (new)
- `src/pages/api/newsletter.ts` (new)
- `src/components/Forms/ContactForm/*` (new)
- `src/components/NewsletterForm/*` (wire submission)
- `.env.example`

**No conflicts** — entirely new files except `NewsletterForm` which is self-contained.

---

### L5 — Compliance `feature/legal-compliance`

**Goal:** Cookie consent + Privacy + Terms pages.

**Tickets:** GG-74 (cookie banner), GG-75 (Privacy), +Terms

**Files touched:**

- `src/components/CookieBanner/*` (new)
- `src/sanity/schemas/legalPage.ts` (new — Privacy + Terms as documents)
- `src/pages/privacy.astro`, `src/pages/terms.astro` (new)
- `src/layouts/Layout.astro` (mount cookie banner — coordinate with L1, L2, L3!)

**⚠️ Coordination:** Cookie banner gates analytics. If L7 lands before L5, Clarity will load without consent — fix in L5 by gating the analytics script.

---

### L6 — Polish + small pages `feature/polish-pages`

**Goal:** Custom 404, About page, Contact page composed.

**Tickets:** GG-76 (404), GG-66 (About), GG-67 (Contact)

**Files touched:**

- `src/pages/404.astro` (new)
- `src/pages/about.astro` (new) or About as a `page` document in CMS
- `src/pages/contact.astro` (new) — uses L4's `ContactForm`

**Depends on:** L4 (Contact form), L5 (privacy text on Contact page)

---

### L7 — Performance + observability `feature/perf-observability`

**Goal:** Production errors visible, image perf fixed, baseline measured.

**Tickets:** GG-111 (Sentry), GG-103 (Sanity images), GG-69 (Clarity), GG-80 (Lighthouse baseline), GG-79 (image audit)

**Files touched:**

- `astro.config.mjs` (Sentry integration)
- `sentry.client.config.ts`, `sentry.server.config.ts` (new)
- `src/components/SanityImage/*` (new)
- `src/lib/sanityImage.ts` (extend)
- `src/templates/sectionData.ts` (use SanityImage)
- `src/components/Analytics/Clarity.astro` (new)
- `src/layouts/Layout.astro` (mount Clarity — gated by cookie consent from L5!)

**⚠️ Coordination:** Clarity must respect cookie consent (L5). Sentry can land first independently.

---

### L8 — Reliability `feature/uptime`

**Goal:** Get pinged when the site goes down.

**Tickets:** GG-70

**Files touched:** mostly external setup; possibly add `/api/health` endpoint.

**No conflicts.** Can run any time.

---

### L9 — Components `feature/announcement-map`

**Goal:** Pre-launch components.

**Tickets:** GG-83 (announcement banner), GG-84 (location map)

**Files touched:**

- `src/components/AnnouncementBanner/*` (new)
- `src/components/LocationMap/*` (new)
- `src/sanity/schemas/siteSettings.ts` (extend — depends on L1)
- `src/layouts/Layout.astro` (mount announcement banner — coordinate)

**Depends on:** L1 (announcement banner data lives in siteSettings)

## Coordination notes

The **single biggest collision risk** is `src/layouts/Layout.astro`. Lanes that touch it:

- L1 (rewrites Header/Footer prop sourcing)
- L2 (head metadata)
- L3 (JSON-LD + RSS link)
- L5 (cookie banner mount)
- L7 (Clarity script mount)
- L9 (announcement banner mount)

**Mitigation (implemented):**

`feature/layout-prep` (PR #59) extracted `PageHead.astro` and introduced named body slots (`body-start`, `body-end`), so lanes adding head content, announcement banners, cookie banners, or analytics no longer touch the same lines in `Layout.astro`.

Remaining rebase order for lanes that still modify `Layout.astro`: L1 → L9 → L5 → L7.

## Per-lane validation gate (from `CONTRIBUTING.md`)

Every PR must pass before merge:

```bash
npm run format
npm run lint
npm run typecheck
npm run build
npm run build-storybook
npx playwright test
```

## Linear references

- L1: GG-107
- L2: GG-77, GG-71, GG-78
- L3: GG-110, GG-109
- L4: GG-81, GG-108, GG-113
- L5: GG-74, GG-75, (+ new Terms ticket if not yet logged)
- L6: GG-76, GG-66, GG-67
- L7: GG-111, GG-103, GG-69, GG-80, GG-79
- L8: GG-70
- L9: GG-83, GG-84

## Suggested fleet kickoff

```
/fleet \
  --lane L1=feature/cms-site-settings:GG-107 \
  --lane L2=feature/discoverability:GG-77,GG-71,GG-78 \
  --lane L7a=feature/sentry:GG-111 \
  --lane L8=feature/uptime:GG-70
```

Wait for Wave 1 to land, then dispatch Wave 2.

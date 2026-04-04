# DECISIONS.md

Architecture decision log for the Gather Ground website. Read this before changing any established pattern. Add a new entry whenever you make a decision that future contributors might question.

---

## ADR-001: Astro over Next.js

**Decision:** Use Astro as the framework.

**Reasoning:** This is a content marketing site with mostly static sections driven from Storyblok. Astro's island architecture ships zero JavaScript for static sections and only hydrates what genuinely needs it (FAQ accordion, mobile nav). Next.js would ship a full React runtime for every page regardless.

**Consequence:** React is only used for interactive client islands (`.tsx` with `client:visible` or `client:load`). Everything else is `.astro`.

---

## ADR-002: shadcn/ui as a primitive layer, not a design system

**Decision:** Use shadcn/ui for accessible interaction primitives (Button, Accordion, etc.), not as a visual design system.

**Reasoning:** shadcn gives us well-tested, accessible components without locking us into a visual style we'd fight against. Our design tokens (from Figma, via Tailwind) drive all visual decisions — not shadcn's defaults.

**Consequence:** When adding any interactive component, check for a shadcn primitive first before building from scratch. Always restyle with project tokens — do not use shadcn's default colour classes directly.

---

## ADR-003: Stories in src/stories/, not colocated with components

**Decision:** Storybook story files live in `src/stories/`, not alongside the component they describe.

**Reasoning:** Astro's build pipeline can accidentally pick up `.stories.ts` files if colocated, causing build warnings or errors. Separating them also keeps `src/components/` clean and the Storybook glob config simple.

**Consequence:** When creating a component at `src/components/HeroSection.astro`, the story goes in `src/stories/HeroSection.stories.ts`, not in `src/components/`.

---

## ADR-004: Storyblok schemas defined in code, not in the dashboard

**Decision:** All Storyblok component schemas are defined as TypeScript files in `src/storyblok/` and pushed to the CMS via the Storyblok CLI. The dashboard is never edited directly.

**Reasoning:** Dashboard changes are not version controlled, are not reviewable in PRs, and drift from the codebase over time. Defining schemas in code means they are auditable, reversible, and stay in sync with TypeScript interfaces by design.

**Consequence:** Never create or modify component schemas in the Storyblok UI. Always: edit `src/storyblok/[name].ts` → CLI push → PR.

---

## ADR-005: No client-side Storyblok data fetching

**Decision:** All Storyblok API calls happen in Astro page frontmatter at build/request time. No `useEffect` fetching, no client-side API calls.

**Reasoning:** Keeps API tokens server-side only. Avoids loading states and layout shift on the marketing site. Content is stable between deployments.

**Exception:** The Storyblok visual editor bridge (`PUBLIC_STORYBLOK_TOKEN`) runs client-side in preview mode only, enabling live editing in the Storyblok dashboard. This is the sole intentional exception.

---

## ADR-006: Storybook play functions for components, Playwright for pages

**Decision:** Component-level interaction tests use `@storybook/test` play functions. Playwright is reserved for full-page e2e and visual regression tests.

**Reasoning:** Play functions run in Storybook's isolated component environment — faster, more focused, no need to spin up the full site. Playwright's strength is in testing real user journeys across the composed page.

**Rule of thumb:** "Does the FAQ accordion open?" → play function. "Does the FAQ section work on the real homepage with real Storyblok data?" → Playwright.

---

## ADR-007: Design tokens are the single source of visual truth

**Decision:** All colours, type scale, spacing, border radius, and shadow values are defined as CSS custom properties in `src/styles/global.css` (via the `@theme` block). These were extracted from Figma variables in M2.

**Reasoning:** Prevents visual drift between the design file and the codebase. When Figma changes, only the token file needs updating — every component inherits the change automatically.

**Consequence:** Never hardcode a hex value, rem size, or pixel spacing anywhere in a component. If a value isn't in the token file, either add it (if it belongs to the design system) or flag it for design review. See `TOKENS.md` for the full token reference.

---

## ADR-008: Tailwind CSS v4 via @tailwindcss/vite, not @astrojs/tailwind

**Decision:** Use `@tailwindcss/vite` as the Vite plugin instead of the `@astrojs/tailwind` integration.

**Reasoning:** `@astrojs/tailwind` only supports Tailwind v3. Tailwind v4 ships as a Vite-native plugin (`@tailwindcss/vite`) and is wired directly into `astro.config.mjs`. The global stylesheet uses `@import "tailwindcss"` instead of a `tailwind.config.ts` (v4 uses CSS-first token configuration).

**Consequence:** There is no `tailwind.config.ts`. Design tokens are defined as CSS custom properties in `src/styles/global.css`. Do not install `@astrojs/tailwind`.

---

## ADR-009: shadcn/ui uses Base UI primitives, not Radix

**Decision:** When initialising shadcn, select the Base UI (`--base base`) component library rather than the default Radix option.

**Reasoning:** Project preference. Base UI is actively maintained by the MUI team, has a smaller footprint, and avoids Radix's peer-dependency weight.

**Consequence:** shadcn components import from `@base-ui/react`, not `@radix-ui/*`. When adding new shadcn components, always pass `--base base` or ensure `components.json` has `"style": "base-*"`.

---

## ADR-010: Node >=22.12.0 pinned via .nvmrc

**Decision:** The project requires Node 22.12.0 or later, pinned in `.nvmrc` as `22`.

**Reasoning:** Astro 6 and Vite 7 enforce this minimum. The `.nvmrc` file ensures `nvm use` picks the right version automatically. CI uses `node-version-file: .nvmrc` so the same constraint applies everywhere.

**Consequence:** Run `nvm use` in the repo root before any dev work. If your active node is below 22.12, `npm run build` and `npm run dev` will hard-exit.

---

## ADR-011: Storybook uses @storybook/react-vite, not a native Astro framework

**Decision:** Storybook is configured with the `@storybook/react-vite` framework, not an Astro-specific one.

**Reasoning:** All interactive components in this project are React islands (shadcn/ui, client-side UI). There is no production-quality Storybook Astro framework. React Vite gives us full React story support, which is all we need.

**Consequence:** `.astro` files cannot be imported into stories directly. Stories describe the React `.tsx` components only. Astro page-level concerns are covered by Playwright, not Storybook.

---

## ADR-012: Static UI components use .astro; interactive islands use .tsx

**Decision:** Static UI components are written as `.astro` files. Components that require client-side interactivity (state, event handlers) are written as `.tsx` React islands. Pages and layouts are always `.astro`.

**Reasoning:** `.astro` components ship zero JavaScript by default and are the natural format for purely static markup. `.tsx` is only introduced when React features (`useState`, `useEffect`, event handlers) are genuinely needed. This avoids hydrating the page with JS for components that don't need it.

**Consequence:** Before writing any component, ask: does this need JavaScript? If no → `.astro`. If yes → `.tsx`, with `client:visible` (or `client:load` if above the fold) applied at the usage site in the parent `.astro` file. `use client` is an RSC/Next.js directive — it has no effect in Astro and must not be used.

---

## ADR-013: Storybook uses @storybook-astro/framework on Storybook 10+

**Decision:** Storybook is configured with `@storybook-astro/framework` instead of `@storybook/react-vite`, running on Storybook 10+.

**Reasoning:** `@storybook/react-vite` cannot render `.astro` files, which would force all components into `.tsx` to get Storybook coverage — contradicting ADR-012 and causing unnecessary hydration. `@storybook-astro/framework` renders `.astro` components natively in Storybook dev mode and supports mixed Astro + React stories in one Storybook instance. Storybook 10 is required by this framework and is the current stable release.

**Consequence:** Both `.astro` and `.tsx` components are directly story-able with no workarounds. `@storybook-astro/framework` is community-maintained — if it falls significantly behind Storybook releases, reconsider. Controls in pre-built static Storybook are limited for `.astro` components (pre-rendered with default args only); dev mode (`storybook dev`) works fully for documentation and interaction testing. ADR-011 is superseded by this decision.

---

## ADR-014: Icons use @untitledui-pro/icons; brand/platform icons use inline SVG

**Decision:** All UI icons are sourced from `@untitledui-pro/icons`. Import from the appropriate style sub-path and render as a React component:

```tsx
import { Mail01 } from '@untitledui-pro/icons/line';
<Mail01 className="size-6" />;
```

Brand/platform icons (Instagram, Facebook, TikTok, X/Twitter, LinkedIn, etc.) are **not** in the Untitled UI library and must be inlined as SVG strings or imported as SVG assets.

**Reasoning:** Untitled UI pro provides 1100+ consistent, well-crafted UI icons that match the project's design language. Using a single source prevents visual inconsistency from mixing icon sets. The pro package includes line, solid, duotone, and duocolor variants — default to `line` unless Figma specifies otherwise. Social brand icons are absent from the library for licensing reasons; these are handled separately as inline SVG.

**Consequence:** Never use Lucide, Heroicons, or other icon libraries for UI icons — always check Untitled UI first. For brand icons not in the library, inline the SVG directly in the component where it's used (as with the social links in `Footer.astro`).

---

## ADR-015: Migrate React stories to CSF Factories when Storybook 11 ships

**Decision (deferred):** Do not migrate to CSF Factories yet. Migrate all React stories (`.tsx` components) when Storybook 11 is released and CSF Factories move from "Preview" to stable.

**Reasoning:** CSF Factories remove `satisfies Meta<typeof Component>` boilerplate and improve type inference, but they are React-only and labelled "Preview" in Storybook 10 — meaning the API could still change. Migrating prematurely risks churn. Astro stories remain unaffected (they are untyped by design — `@storybook-astro/framework` does not export `Meta`/`StoryObj`).

**When to act:** Storybook 11 release (expected Spring 2026). Run the official codemod: `npx storybook@latest migrate csf-factories`.

---

## ADR-016: Chromatic for visual regression; addon-a11y for accessibility; addon-docs for MDX

**Decision:** Three Storybook addons are installed and registered in `.storybook/main.ts`:

- `@chromatic-com/storybook` — visual regression testing via Chromatic
- `@storybook/addon-a11y` — WCAG accessibility audit panel per story
- `@storybook/addon-docs` — MDX documentation pages and `autodocs` support

**Reasoning:**

- *Visual regression:* Chromatic is the first-party Storybook service for snapshot diffing. It integrates natively with the Storybook build step and requires no extra CI configuration beyond a `CHROMATIC_PROJECT_TOKEN` secret and a `chromatic` CLI invocation. Alternative (Playwright screenshot diffing) requires significantly more infrastructure and maintenance.
- *Accessibility:* The `addon-a11y` panel runs `axe-core` against each rendered story inline. This catches WCAG issues (colour contrast, missing ARIA roles, focus order) at the component level, where they are cheapest to fix — before Playwright or manual review.
- *Docs:* `addon-docs` enables MDX story files (`.mdx` under `src/stories/`) and powers `autodocs` auto-generated API docs for React components that opt in via `tags: ['autodocs']`.

**Consequences:**

- The `addon-a11y` panel must be checked for every new component story before marking a PR ready for review. Fix violations; do not suppress them without a documented reason.
- Chromatic visual regression is *not yet wired into CI*. To activate it, add `CHROMATIC_PROJECT_TOKEN` to the GitHub repository secrets and add a Chromatic publish step to `.github/workflows/ci.yml`. Do this when visual regression coverage is needed (recommended when page sections are complete and stable).
- MDX docs pages live in `src/stories/` alongside story files (covered by the existing glob). See `src/stories/Introduction.mdx` as the reference example.

**What changes:** Replace the `satisfies Meta<typeof Button>` + `StoryObj` pattern:

```ts
// Before (CSF 3)
import type { Meta, StoryObj } from '@storybook/react';
const meta = { component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: 'Button' } };

// After (CSF Factories)
import preview from '../.storybook/preview';
const meta = preview.meta({ component: Button });
export const Default = meta.story({ args: { children: 'Button' } });
```

---

## ADR-016: Use sb.mock for API mocking in stories once real endpoints exist

**Decision (deferred):** When `NewsletterForm` (and any future component) is wired to a real API, replace the current `setTimeout` stub with Storybook 10's `sb.mock` module mocking.

**Reasoning:** The current `NewsletterForm` fakes its submit with a hardcoded `await new Promise(resolve => setTimeout(resolve, 500))`. This is fine during development but will need replacing once a real newsletter endpoint exists. `sb.mock` (inspired by `vi.mock`) works with both Vite and Webpack builders and is available in dev and static builds — making it the correct tool for mocking fetch calls, API clients, or server actions inside stories.

**When to act:** When a real newsletter/API integration is added to `NewsletterForm.tsx`.

**What changes:** Import `sb.mock` in the story file and mock the fetch/API module, then restore defaults in `afterEach`. No changes to the component itself.

---

## Adding a new entry

When you make a decision that future-you (or Claude Code) might question, add it here immediately:

```markdown
## ADR-00X: Short descriptive title

**Decision:** What you chose.

**Reasoning:** Why, and what alternatives were considered.

**Consequence:** What this means for how code should be written day-to-day.
```

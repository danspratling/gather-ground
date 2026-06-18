# DECISIONS.md

Architecture decision log for the Gather Ground website. Read this before changing any established pattern. Add a new entry whenever you make a decision that future contributors might question.

## Quick reference

| ADR     | Title                                             | Category     | Status                |
| ------- | ------------------------------------------------- | ------------ | --------------------- |
| ADR-001 | Astro over Next.js                                | Stack        | Active                |
| ADR-002 | shadcn/ui as a primitive layer                    | Components   | Active                |
| ADR-004 | Storyblok schemas in code                         | CMS          | Superseded by ADR-032 |
| ADR-005 | No client-side Storyblok fetching                 | CMS          | Superseded by ADR-032 |
| ADR-006 | Play functions vs Playwright                      | Testing      | Active                |
| ADR-007 | Design tokens as visual source of truth           | Styling      | Active                |
| ADR-008 | Tailwind v4 via @tailwindcss/vite                 | Stack        | Active                |
| ADR-009 | shadcn/ui uses Base UI, not Radix                 | Components   | Active                |
| ADR-010 | Node ≥22.12.0                                     | Stack        | Active                |
| ADR-012 | .astro for static, .tsx for islands               | Components   | Active                |
| ADR-013 | Storybook uses @storybook-astro/framework         | Storybook    | Active                |
| ADR-014 | Icons: @untitledui-pro + brand SVGs               | Components   | Active                |
| ADR-015 | CSF Factories migration (deferred)                | Storybook    | Active                |
| ADR-016 | Chromatic + a11y + docs addons                    | Storybook    | Active                |
| ADR-017 | Co-locate all component files                     | Organisation | Active                |
| ADR-018 | sb.mock for API mocking (deferred)                | Storybook    | Active                |
| ADR-019 | Chromatic replaces browser-mode CI tests          | Testing      | Active                |
| ADR-020 | Playwright page testing: structural + behavioral  | Testing      | Active                |
| ADR-021 | MCP-aided development workflow                    | Process      | Active                |
| ADR-022 | Storyblok component mapper via StoryblokComponent | CMS          | Superseded by ADR-032 |
| ADR-023 | Co-located .storyblok.astro wrappers              | CMS          | Superseded by ADR-032 |
| ADR-024 | src/templates/ for page-level templates           | Organisation | Active                |
| ADR-025 | [...slug].astro catch-all page router             | Routing      | Active                |
| ADR-026 | enableFallbackComponent for unknown bloks         | CMS          | Superseded by ADR-032 |
| ADR-027 | Check official docs before implementing features  | Process      | Active                |
| ADR-028 | multilink field type + resolveLink() helper       | CMS          | Superseded by ADR-032 |
| ADR-029 | Reference content types for reusable CMS entries  | CMS          | Superseded by ADR-032 |
| ADR-030 | storyblokEditable + mkcert for Visual Editor      | CMS          | Superseded by ADR-032 |
| ADR-031 | Variant mapper stories use the mapper component   | Storybook    | Active                |
| ADR-032 | Migrate from Storyblok to Sanity                  | CMS          | Active                |
| ADR-033 | Sanity document type names — singular/plural      | CMS          | Active                |
| ADR-034 | Internal links must use CMS page references       | CMS          | Active                |
| ADR-035 | Storybook stories only for components with UI     | Storybook    | Active                |
| ADR-036 | Analytics consent-gated via event listener        | Analytics    | Active                |
| ADR-037 | Sanity-first editor + one-way Commerce Layer sync | Commerce     | Active                |

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

## ADR-012: Static UI components use .astro; interactive islands use .tsx

**Decision:** Static UI components are written as `.astro` files. Components that require client-side interactivity (state, event handlers) are written as `.tsx` React islands. Pages and layouts are always `.astro`.

**Reasoning:** `.astro` components ship zero JavaScript by default and are the natural format for purely static markup. `.tsx` is only introduced when React features (`useState`, `useEffect`, event handlers) are genuinely needed. This avoids hydrating the page with JS for components that don't need it.

**Consequence:** Before writing any component, ask: does this need JavaScript? If no → `.astro`. If yes → `.tsx`, with `client:visible` (or `client:load` if above the fold) applied at the usage site in the parent `.astro` file. `use client` is an RSC/Next.js directive — it has no effect in Astro and must not be used.

---

## ADR-013: Storybook uses @storybook-astro/framework on Storybook 10+

**Decision:** Storybook is configured with `@storybook-astro/framework` instead of `@storybook/react-vite`, running on Storybook 10+.

**Reasoning:** `@storybook/react-vite` cannot render `.astro` files, which would force all components into `.tsx` to get Storybook coverage — contradicting ADR-012 and causing unnecessary hydration. `@storybook-astro/framework` renders `.astro` components natively in Storybook dev mode and supports mixed Astro + React stories in one Storybook instance. Storybook 10 is required by this framework and is the current stable release.

**Consequence:** Both `.astro` and `.tsx` components are directly story-able with no workarounds. `@storybook-astro/framework` is community-maintained — if it falls significantly behind Storybook releases, reconsider. Controls in pre-built static Storybook are limited for `.astro` components (pre-rendered with default args only); dev mode (`storybook dev`) works fully for documentation and interaction testing.

---

## ADR-014: Icons use @untitledui-pro/icons; brand/platform icons use inline SVG

**Decision:** All UI icons are sourced from `@untitledui-pro/icons`. Import from the appropriate style sub-path and render as a React component:

```tsx
import { Mail01 } from '@untitledui-pro/icons/line';
<Mail01 className="size-6" />;
```

Brand/platform icons (Instagram, Facebook, TikTok, X/Twitter, LinkedIn, etc.) are **not** in the Untitled UI library and must live in `src/components/Icons/` as individual `.astro` files.

**Reasoning:** Untitled UI pro provides 1100+ consistent, well-crafted UI icons that match the project's design language. Using a single source prevents visual inconsistency from mixing icon sets. The pro package includes line, solid, duotone, and duocolor variants — default to `line` unless Figma specifies otherwise. Social brand icons are absent from the library for licensing reasons; these are handled as standalone `.astro` components instead of being inlined as SVG strings.

**Consequence:** Never use Lucide, Heroicons, or other icon libraries for UI icons — always check Untitled UI first. For brand icons not in the library, create a new `.astro` file in `src/components/Icons/` (e.g. `InstagramIcon.astro`). Each icon component accepts a `class` prop for sizing/colour overrides and includes `aria-hidden="true"` on the SVG — the caller is responsible for providing accessible text via `aria-label` on the surrounding element. Never inline SVG strings directly in a component template.

---

## ADR-015: Migrate React stories to CSF Factories when Storybook 11 ships

**Decision (deferred):** Do not migrate to CSF Factories yet. Migrate all React stories (`.tsx` components) when Storybook 11 is released and CSF Factories move from "Preview" to stable.

**Reasoning:** CSF Factories remove `satisfies Meta<typeof Component>` boilerplate and improve type inference, but they are React-only and labelled "Preview" in Storybook 10 — meaning the API could still change. Migrating prematurely risks churn. Astro stories remain unaffected (they are untyped by design — `@storybook-astro/framework` does not export `Meta`/`StoryObj`).

**When to act:** Storybook 11 release (expected Spring 2026). Run the official codemod: `npx storybook@latest migrate csf-factories`.

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

## ADR-016: Chromatic for visual regression; addon-a11y for accessibility; addon-docs for MDX

**Decision:** Three Storybook addons are installed and registered in `.storybook/main.ts`:

- `@chromatic-com/storybook` — visual regression testing via Chromatic
- `@storybook/addon-a11y` — WCAG accessibility audit panel per story
- `@storybook/addon-docs` — MDX documentation pages and `autodocs` support

**Reasoning:**

- _Visual regression:_ Chromatic is the first-party Storybook service for snapshot diffing. It integrates natively with the Storybook build step and requires no extra CI configuration beyond a `CHROMATIC_PROJECT_TOKEN` secret and a `chromatic` CLI invocation. Alternative (Playwright screenshot diffing) requires significantly more infrastructure and maintenance.
- _Accessibility:_ The `addon-a11y` panel runs `axe-core` against each rendered story inline. This catches WCAG issues (colour contrast, missing ARIA roles, focus order) at the component level, where they are cheapest to fix — before Playwright or manual review.
- _Docs:_ `addon-docs` enables MDX documentation pages and powers `autodocs` auto-generated API docs for React components that opt in via `tags: ['autodocs']`.

**Consequences:**

- The `addon-a11y` panel must be checked for every new component story before marking a PR ready for review. Fix violations; do not suppress them without a documented reason.
- Chromatic visual regression is wired into CI via `.github/workflows/chromatic.yml`. It runs on every PR against `main`. The `CHROMATIC_PROJECT_TOKEN` secret must be set in GitHub repository settings. Initial baselines are established by accepting all snapshots on the first Chromatic run.
- Chromatic also runs interaction tests (play functions) and a11y checks in its cloud — see ADR-019.
- Global MDX documentation pages (e.g. `src/stories/Introduction.mdx`) live in `src/stories/`. Component-level stories are co-located with their component — see ADR-017.

---

## ADR-017: Keep all related files co-located with their component

**Decision:** All files that relate to a component — stories, Figma Code Connect files, tests, and any other per-component artefacts — live in `src/components/` alongside the component itself. There are no separate top-level `src/stories/`, `src/figma/`, or `src/tests/` directories for component-level files.

```
src/components/
  Button/
    Button.astro          ← component
    Button.tsx            ← React island (if interactive)
    Button.stories.ts     ← Storybook story
    Button.figma.tsx      ← Figma Code Connect
    Button.test.ts        ← unit / interaction tests
```

**Reasoning:** Keeping related files together reduces context-switching: when working on a component you can see and edit every artefact without hunting across the repo. Separating stories, figma files, or tests into their own trees creates distance between the code and its documentation/tests and makes it easy to forget to update them when the component changes.

**Consequence:** Co-location is the established pattern — all new component files, stories, and types must live in `src/components/[Name]/`. The only exception is `src/stories/` which holds global Storybook documentation pages (e.g. `Introduction.mdx`) — not component stories.

One technical side-effect to be aware of: `@storybook-astro/framework`'s build server plugin scans `src/components/` and generates a `virtual:astro-component-module` wrapper (which re-exports `default`) for every `.ts/.tsx/.js/.jsx/.vue/.svelte` file it finds. Only `.stories.*`, `.spec.*`, and `.test.*` files are excluded — `.figma.*` and `.types.*` files are not. Any co-located file that is **not** a standard component, story, spec, or test **must** include `export default null` at the end of the file to satisfy the wrapper and keep the Storybook build green. This applies to:

- `*.figma.tsx` — Figma Code Connect files
- `*.types.ts` — co-located type files
- `src/components/ui/*.tsx` — shadcn primitives installed via `npx shadcn add`

The `export default null` is inert at runtime. Always add it when creating any of the above file types.

---

## ADR-018: Use sb.mock for API mocking in stories once real endpoints exist

**Decision (deferred):** When `NewsletterForm` (and any future component) is wired to a real API, replace the current `setTimeout` stub with Storybook 10's `sb.mock` module mocking.

**Reasoning:** The current `NewsletterForm` fakes its submit with a hardcoded `await new Promise(resolve => setTimeout(resolve, 500))`. This is fine during development but will need replacing once a real newsletter endpoint exists. `sb.mock` (inspired by `vi.mock`) works with both Vite and Webpack builders and is available in dev and static builds — making it the correct tool for mocking fetch calls, API clients, or server actions inside stories.

**When to act:** When a real newsletter/API integration is added to `NewsletterForm.tsx`.

**What changes:** Import `sb.mock` in the story file and mock the fetch/API module, then restore defaults in `afterEach`. No changes to the component itself.

---

## ADR-019: Chromatic replaces browser-mode Vitest tests in CI

**Decision:** Browser-mode Vitest tests (the `storybook` project using Playwright/Chromium) are not run in CI. Chromatic runs all Storybook stories — including play functions and a11y checks — in its cloud on every PR. The `npm run test-storybook:react` script remains available for local pre-push validation.

**Reasoning:** We evaluated browser-mode Vitest in CI but encountered a structural incompatibility: `@storybook/addon-vitest` requires either a live Storybook dev server (only auto-started in watch mode, not `vitest run`) or specific infrastructure to serve the virtual modules it needs. Reliably starting and waiting for the server in CI added complexity without benefit. Meanwhile, Chromatic already runs interaction tests (play functions) and a11y checks as part of its snapshot pipeline — making the browser Vitest step in CI redundant.

**Consequences:**

- `npm run test-storybook` in CI runs only the Astro happy-dom tests (fast, no browser).
- `npm run test-storybook:react` is available locally to run browser tests before pushing.
- The `storybook` Vitest project remains in `vitest.config.ts` to power the Storybook UI testing widget locally.
- CI does not install Playwright browsers — Chromatic handles cross-browser coverage.

---

## ADR-020: Playwright page tests are structural and behavioral — never content-based

**Decision:** Playwright tests for pages are divided into two layers:

- **Layer 1 — Structural:** Assert on the presence and shape of the page, not its content. Every page must have exactly one `<h1>`, a `<main>` landmark, a `<nav>`, all `<img>` elements must have non-empty `alt` attributes, and there must be no console errors on load.
- **Layer 2 — Behavioral:** Test how interactive elements work, not what they say. The mobile nav must open and close. Accordions must expand and collapse. Forms must validate on empty submit. Interactive elements must be keyboard-reachable.

Content assertions (checking specific heading text, paragraph copy, image `src` values, etc.) are explicitly prohibited in Playwright tests.

**Reasoning:** Page content comes from Storyblok — it will be edited by non-engineers without a code deployment. Content-based assertions become stale the moment an editor updates copy, causing CI failures that have nothing to do with the code. Storyblok API calls happen server-side in Astro frontmatter (ADR-005), making browser-level `page.route()` mocking ineffective — there is no viable intercept point for a CMS mock at the page level without adding test-awareness to production code.

Structural and behavioral tests catch real regressions (sections not rendering, interactive features breaking, accessibility violations) while remaining stable across CMS updates. Visual regressions are covered by Chromatic at the component level (ADR-016, ADR-019) — Playwright does not do screenshot diffing.

**Consequence:**

- Tests live in `tests/pages/[pageName].spec.ts`
- Every page spec must include: one `<h1>` assertion, landmark presence, `<img alt>` check, no console errors
- Interactive features on that page (nav, accordion, forms) must have a behavioral test
- Never use `getByText('specific copy')` for assertions — use roles, labels, and attributes
- `tests/pages/homepage.spec.ts` is the canonical reference example

---

## ADR-021: MCP-aided development for page sections

**Decision:** When building page sections (HeroSection, FeaturesSection, CtaSection, etc.), use Figma MCP and Playwright MCP as a closed-loop design validation cycle during implementation. This is a development aid — it is not part of CI.

**The workflow:**

1. Read the Figma frame URL from the Linear issue
2. Use Figma MCP to extract the frame: layout structure, token usage, responsive breakpoints, component composition
3. Build the section component (types → markup → tokens)
4. Use Playwright MCP to navigate to `localhost:4321`, screenshot at 375px (mobile) and 1440px (desktop)
5. Compare screenshots against the Figma frame — review spacing, alignment, token application, and responsive behaviour
6. Iterate until the implementation matches
7. Once approved: the next Chromatic run on the PR establishes this state as the visual regression baseline

**Reasoning:** Page sections are the primary visual output of the project and are the hardest to review purely in code. The MCP loop eliminates manual browser/Figma switching during development and closes the feedback loop inside the AI conversation. This means implementation deviations from Figma are caught before the PR is opened rather than during review. Playwright MCP can also run keyboard navigation and basic accessibility checks during development, identifying issues before the automated suite runs.

**Scope boundary:** The MCP loop is a development-time aid only. It does not replace:

- Chromatic, which owns visual regression testing ongoing (ADR-016)
- Playwright tests, which own structural and behavioral verification (ADR-020)
- Storybook play functions, which own component interaction tests (ADR-006)

**Consequence:**

- When building any section component, use Figma MCP first to read the frame before writing markup
- Validate at both 375px and 1440px with Playwright MCP before opening a PR
- Document the Figma frame URL in the Linear issue and in the story's `parameters.design` field
- Every page section story must include `chromatic: { viewports: [375, 1440] }` in `parameters` — Chromatic is the ongoing visual record at both breakpoints
- AI agents building sections must follow this workflow (see `CLAUDE.md`)

---

## ADR-022: Storyblok component rendering via StoryblokComponent, not an inline dispatcher

**Decision:** Use `@storyblok/astro`'s built-in `StoryblokComponent.astro` to resolve and render Storyblok bloks. Do not write inline `if/else` or `switch` dispatchers in page files.

**Reasoning:** The package ships a resolver that converts `blok.component` (snake_case) to camelCase, looks it up in a virtual registry built by Vite, and renders the matching component — the same pattern used in production Next.js/React Storyblok projects. An inline dispatcher in the page duplicates this logic, couples the page to every section name, and has to be manually updated every time a new component is added.

**Consequence:** All Storyblok blok-to-component resolution goes through `<StoryblokComponent blok={blok} />`. New section types only require: (1) a `.storyblok.astro` wrapper, (2) an entry in the `components` map in `astro.config.mjs`. No changes to the page or router.

---

## ADR-023: Co-located .storyblok.astro wrappers with explicit registration

**Decision:** Each section component has a co-located `[Name].storyblok.astro` wrapper in its component folder (e.g. `src/components/HeroSection/HeroSection.storyblok.astro`). All wrappers are explicitly registered in the `components` map in `astro.config.mjs`. Auto-discovery from `src/storyblok/` is not used.

**Reasoning:** Co-location keeps the Storyblok field mapping (snake_case → camelCase) next to the component it maps to — consistent with how `.types.ts` and `.stories.ts` are co-located (ADR-017). Auto-discovery scans `src/[componentsDir]/storyblok/**/*.astro`, which conflicts with the schema `.ts` files already in `src/storyblok/` and forces wrappers out of their component folder. Explicit registration in `astro.config.mjs` gives a single, auditable list of all Storyblok-connected components.

**What a wrapper does:** Receives `blok: SbBlokData`, casts each field to the correct type, maps snake_case names to camelCase props, and renders the static component. No data fetching, no business logic.

**Consequence:** When adding a new Storyblok-connected section:

1. Create `src/components/[Name]/[Name].storyblok.astro`
2. Add an entry to the `components` map in `astro.config.mjs`
   Path format is relative to `componentsDir` (default `'src'`) — e.g. `'components/HeroSection/HeroSection.storyblok.astro'`.

---

## ADR-024: src/templates/ for Storyblok page-level templates

**Decision:** Storyblok page-level templates (components that correspond to a Storyblok content type rather than a UI section) live in `src/templates/`. The first is `Page.astro`, which iterates `blok.body` and delegates each section to `StoryblokComponent`.

**Reasoning:** Page templates are not UI components — they have no static counterpart, no stories, and no types file. Placing them in `src/components/` would create a folder with a single `.storyblok.astro` file and nothing else, which is misleading. A dedicated `src/templates/` directory signals their purpose: they are Storyblok content type renderers, not reusable UI primitives.

**Consequence:** New Storyblok content types (e.g. `BlogPost`, `AboutPage`) get a template in `src/templates/` and an entry in `astro.config.mjs`. UI sections always go in `src/components/`.

---

## ADR-025: [...slug].astro as the catch-all page router

**Decision:** All Storyblok-driven pages are served by a single `src/pages/[...slug].astro` catch-all route. There is no `index.astro`. The empty slug (`/`) maps to the `'home'` Storyblok story.

**Reasoning:** A dedicated `index.astro` would duplicate the fetch + render logic that `[...slug].astro` already handles. The catch-all means any new Storyblok page (about, contact, etc.) is automatically routed without adding a new Astro page file — it just needs a story in Storyblok and a template registered in `astro.config.mjs`.

Note: Astro 6 removed support for optional rest parameters (`[[...slug]]`). The `[...slug]` route is used instead, with `slug: undefined` returned from `getStaticPaths` for the home story, which Astro maps to the root `/` route.

**`getStaticPaths`:** Fetches all `page` content-type stories from Storyblok at build time and returns them as static paths. The `home` story maps to `slug: undefined` (the root `/` route).

**Consequence:** Never create a dedicated `src/pages/[name].astro` for a Storyblok-driven marketing page. Add the story in Storyblok, ensure its content type has a registered template, and `[...slug].astro` handles it automatically.

---

## ADR-026: enableFallbackComponent for graceful degradation on unknown bloks

**Decision:** `enableFallbackComponent: true` is set in the `storyblok()` integration config. This causes `StoryblokComponent` to render nothing (and log a console warning) when it encounters a blok whose `component` name is not in the registry, rather than throwing and crashing the page.

**Reasoning:** Without this, adding a new blok type to a Storyblok story before the corresponding wrapper is registered in `astro.config.mjs` crashes the entire page. With it, the unknown blok is silently skipped — all other sections render correctly. The console warning is sufficient signal for developers to notice the missing registration.

**Consequence:** An unregistered blok is never a hard error at runtime. Developers should watch for console warnings of the form `Component [name] doesn't exist.` and add the missing registration. Never suppress these warnings.

---

## ADR-027: Check official docs before implementing external platform features

**Decision:** Before implementing any feature that integrates with an external platform or tool (Storyblok, Vercel, GitHub Actions, etc.), read the official documentation for that platform first.

**Reasoning:** External platforms often provide first-party tooling, CLI workflows, or configuration patterns that are better supported, simpler, and more idiomatic than a hand-rolled approach. Building without reading the docs risks duplicating existing functionality, using deprecated APIs, or missing a better developer experience — as happened with the Storyblok CLI schema push workflow, where an API-driven approach was initially designed before the official CLI pattern was identified.

**Process:**

1. Identify the external platform involved in the task
2. Find the official docs page for the specific feature (CLI, SDK, API, integration guide)
3. Read it before writing any code
4. Follow the official pattern unless there is a documented reason not to (record that reason here as an ADR)

**Consequence:** This adds a short research step to any task involving external integrations, but avoids rework and produces more maintainable implementations. If the official docs are unclear or incomplete, note it in the PR and in a comment in the relevant code.

---

## ADR-028: multilink field type + resolveLink() helper for all href fields

**Decision:** All link/URL fields in Storyblok schemas use `type: 'multilink'` (not `type: 'text'`). A `resolveLink()` helper in `src/lib/utils.ts` converts the multilink object to a plain string `href` before passing it to components.

**Reasoning:** `multilink` gives editors a proper link picker in the Storyblok UI (internal story, external URL, email, asset) instead of a free-text field. Components only accept a `string` href — the mapping is the CMS wrapper's responsibility, keeping components CMS-agnostic.

**Pattern:**

```ts
// schema
{ name: 'href', display_name: 'Link', type: 'multilink' }

// wrapper
import { resolveLink } from '@/lib/utils';
href: resolveLink(blok.href)
```

**Consequence:** Never use `type: 'text'` for a field that holds a URL. Always pipe it through `resolveLink()` in the `.storyblok.astro` wrapper.

---

## ADR-029: Reference content types for reusable CMS entries

**Decision:** Reusable content items (testimonials, FAQs, blog posts) are defined as standalone Storyblok content types with `is_root: true, is_nestable: false`. Sections that display a list of them use a `type: 'options'` field with `source: 'internal_stories'` and `filter_content_type`. Stories are resolved at fetch time via `resolve_relations` in `[...slug].astro`.

**Reasoning:** Embedding testimonials or FAQs as nested bloks inside a section would make them impossible to reuse across pages. Standalone stories allow editors to maintain a single source of truth per entry and pick them via a multi-select in any section. The `resolve_relations` API expands the referenced stories server-side so wrappers receive fully hydrated objects.

**Pattern:**

```ts
// section schema field
{ name: 'testimonials', type: 'options', source: 'internal_stories',
  filter_content_type: ['testimonial'] }

// [..slug].astro fetch
resolve_relations: ['testimonials_section.testimonials']

// wrapper reads resolved story content
blok.testimonials.map((t) => t.content.quote)
```

**Consequence:** Any new reusable content type (team members, case studies, etc.) should follow this pattern — standalone content type + References field in section + `resolve_relations` in the router. Never embed duplicated content as inline bloks if it will be maintained independently.

---

## ADR-030: storyblokEditable + vite-plugin-mkcert for Visual Editor bridge

**Decision:** All `.storyblok.astro` wrappers wrap their output in `<div {...storyblokEditable(blok)}>`. The dev server runs over HTTPS via `vite-plugin-mkcert`, which is required by the Storyblok Visual Editor iframe.

**Reasoning:** `storyblokEditable` injects the data attributes that the Storyblok Bridge needs to link a rendered section to its block in the editor sidebar (click-to-edit). Without HTTPS, the Visual Editor refuses to load the local preview inside its iframe. `mkcert` generates a trusted local certificate automatically with no manual setup.

**Bridge config:** `resolve_relations` in the bridge config mirrors the `resolve_relations` in the page fetch so the bridge correctly refreshes referenced stories (testimonials, FAQs, posts) on save.

**Consequence:** Every new `.storyblok.astro` wrapper must wrap its root element with `{...storyblokEditable(blok)}`. When adding a new section with `resolve_relations`, add the same relation to `bridge.resolveRelations` in `astro.config.mjs`. The mkcert plugin is dev-only — it has no effect on production builds.

---

## Adding a new entry

When you make a decision that future-you (or Claude Code) might question, add it here immediately:

```markdown
## ADR-00X: Short descriptive title

**Decision:** What you chose.

**Reasoning:** Why, and what alternatives were considered.

**Consequence:** What this means for how code should be written day-to-day.
```

---

## ADR-031: Variant mapper stories use the mapper component

**Decision:** Storybook stories for variant-mapped components (e.g. `CallToAction`, `Content`) must use the **mapper component** as the meta `component`, not individual sub-components. The `variant` prop is passed in each story's `args`.

**Reasoning:** The Astro Storybook renderer (`@storybook-astro/framework`) uses the meta-level `component` for SSR rendering. Per-story `component:` overrides do not work — every story renders the meta component regardless. Using the mapper ensures each story routes through the `variantMap` and renders the correct sub-component.

**Consequence:**

- One story file per mapper component (e.g. `CallToAction.stories.ts`), not separate files per variant
- Every story must include `variant` in its `args`
- The mapper component handles dispatch — stories don't import sub-components directly

---

## ADR-032: Migrate from Storyblok to Sanity

**Decision:** Replace Storyblok with Sanity as the headless CMS. The migration runs in parallel — Sanity is built alongside Storyblok until verified, then Storyblok is removed.

**Reasoning:** Sanity offers a more flexible content model (GROQ queries, Portable Text, native references), an embeddable Studio (no separate dashboard), first-party Visual Editing with stega overlays, and eliminates workarounds like the Management API hack for author data. The Storyblok integration works but requires snake_case → camelCase wrappers, a separate push-schemas pipeline, and a personal access token just to display post authors. Sanity's schema-as-code model, reference resolution via GROQ, and `@sanity/astro` official integration are a better fit.

**Key decisions within the migration:**

- **Static output preserved** — the site remains `output: 'static'` (Astro default). Sanity Visual Editing runs in dev/preview mode only, matching the current Storyblok Visual Editor behaviour. No SSR for production.
- **Embedded Studio at `/studio`** — Sanity Studio is mounted as a route in the Astro app via `@sanity/astro` `studioBasePath`, not deployed separately.
- **Schemas in code** — maintains the ADR-004 principle. Sanity schemas live in `src/sanity/schemas/`, version-controlled and reviewed in PRs. The Storyblok CLI push pipeline (`scripts/push-schemas.ts`) is eliminated — Sanity reads schemas directly from the Studio config.
- **`author` document type** — blog post authors are modelled as a Sanity `document` with a `reference` field on blog posts. This eliminates the Management API workaround in `storyblokAuthors.ts`.
- **Reusable `link` object type** — replaces Storyblok `multilink` + `resolveLink()`. Supports internal references, external URLs, and email links.
- **`SectionMapper.astro`** — replaces `<StoryblokComponent>` auto-resolution. A simple switch on `_type` renders the correct section component. Replaces the 5 co-located `.storyblok.astro` wrappers.
- **Portable Text via `astro-portabletext`** — replaces `renderRichText` / `segmentStoryblokRichText`. Custom block types (e.g. callout) map to Astro components.
- **GROQ queries co-located** — all queries live in `src/lib/queries.ts`. References are resolved inline via `->` (replaces `resolve_relations`).
- **Manual content re-creation** — content volume is small enough to re-enter in Sanity Studio rather than scripting a migration.

**Migration phases:**

1. **Foundation** — create Sanity project, install deps, add integration alongside Storyblok, verify Studio loads
2. **Schemas** — convert 30 Storyblok schemas to Sanity types in `src/sanity/schemas/`
3. **Data fetching** — `loadQuery()` helper, image URL builder, GROQ queries, link resolver
4. **Page rewrites** — swap Storyblok API calls for Sanity fetches in all pages + templates
5. **Component adapters** — rewrite `RichText.astro` for Portable Text, update image URLs, delete `.storyblok.astro` wrappers
6. **Visual Editing** — `<VisualEditing>` component, Presentation tool, stega config, CORS
7. **Cleanup** — remove all Storyblok code/deps/config, update ADRs and project docs, set up Sanity → Vercel deploy hook

**Supersedes:** ADR-004, ADR-005, ADR-022, ADR-023, ADR-024, ADR-026, ADR-028, ADR-029, ADR-030. These remain in the log for historical context but their guidance no longer applies after migration is complete.

**Consequence:** After migration, all CMS interactions use Sanity. Schemas are defined in `src/sanity/schemas/`. Data is fetched via `sanityClient.fetch()` with GROQ in page frontmatter. Rich text uses Portable Text. The `.storyblok.astro` wrapper pattern, `resolveLink()` helper, `push-schemas` script, and `storyblokAuthors.ts` are all removed.

---

## ADR-033: Sanity document type names — singular for singletons, plural for collections

**Decision:** Sanity document `type` names follow grammatical number based on cardinality:

- **Singleton documents** (exactly one instance) → **singular** name. Examples: `siteSettings`, `blogPage`, `productPage`.
- **Collection documents** (many instances) → **plural** name. Examples: `pages`, `blogPosts`, `products`, `authors`, `faqs`, `testimonials`.
- **Object types** (nested shapes, not documents) → **singular** name — they describe one shape, not a collection. Examples: `link`, `callout`, `heroSection`, `productCard`, `contentFeatureItem`.

**Schema file naming follows the type name:** `blogPosts.ts` (collection), `blogPage.ts` (singleton), `link.ts` (object).

**Reasoning:** The codebase had two competing patterns — `productPage`/`products` (this convention) and `blogPost`/`page`/`author`/etc. (the more common Sanity convention of singular-for-everything). Mixing both is confusing; pick one and apply it. The singular-for-singletons / plural-for-collections rule mirrors database table naming and REST collection endpoints — the type name describes "what's in the bucket". A singleton holds one thing (singular); a collection holds many (plural).

**Trade-offs accepted:**

- Departs from the wider Sanity ecosystem convention. Most Sanity examples and plugins use singular type names (`post`, `author`). Editors familiar with other Sanity projects will find this surprising.
- Reference fields read awkwardly: `to: [{ type: 'authors' }]` looks like "many authors" but actually accepts one. The interpretation is consistent (the `type` is the name of the collection the doc comes from), but it requires a second of thought.
- Required a one-time data migration (see `scripts/rename-collection-types.ts`) to update existing `_type` values in production.

**Consequence:**

- New collection schemas must use plural names. New singleton schemas must use singular names.
- All `_type ==` GROQ filters and reference `to: [...]` arrays use the collection name.
- Field names (e.g. `author` ref field on a post) remain singular when they hold one value — field cardinality, not the target type, drives the field name.
- The migration script runs once per environment when this convention is introduced. Subsequent renames follow the same pattern.

## ADR-034: Internal links must use CMS page references, not typed URLs

**Status:** Accepted
**Date:** 2026-04-27
**Branch:** feature/cms-site-settings

**Context:** The `link` object type (introduced in ADR-032) supports four link modes: `url` (external), `internal` (page reference), `email`, and `anchor`. When wiring nav items, CTAs, footer links, and any other navigational fields in Sanity schemas, there is a temptation to use a plain `string` or `url` field for simplicity — or to use the `url` mode and type `/about` manually.

**Decision:** Internal links must always use `type: 'internal'` with a `reference` to a Sanity `page` or `blogPost` document, never a manually-typed path string. The `url` mode is reserved for external URLs only (i.e. links to a different origin).

**Reasoning:**

- Typed paths break silently when a page is renamed or its slug changes. A reference-based link is automatically updated (or flagged as broken) because it resolves through the document's `slug` field at query time.
- The CMS Studio dropdown gives editors discoverability — they can see available pages without memorising slugs.
- `resolveSanityLink()` already handles the `internal` case by dereferencing `internalLink->{ slug }` in GROQ and building the path. There is no additional work for developers.
- Consistency: all `link` fields behave the same way regardless of where they appear (nav, footer, CTAs, banners).

**Rules:**

1. Any field linking to a page within this site must use `type: 'link'` with the `internal` option available — not `type: 'string'` or `type: 'url'`.
2. The `url` mode in the `link` type is only for external URLs (different origin, e.g. social profiles, third-party sites).
3. Anchor links (`#section-id`) use `type: 'anchor'`. These may stand alone or be combined with an internal reference if a future need arises.
4. Social link fields (e.g. `siteSettings.socialLinks`) are the exception — they are always external URLs and use a plain `type: 'url'` field directly.

**Consequence:** Developers adding new link fields to any Sanity schema must use `type: 'link'` rather than `type: 'string'`. PR reviewers should reject schemas that use typed string fields for internal navigation.

## ADR-035: Storybook stories only for components with visible UI

**Status:** Accepted
**Date:** 2026-04-28

**Context:** Some components exist solely to inject markup into `<head>` or load third-party scripts — they have no rendered visual output. Examples: `StructuredData.astro` (emits `<script type="application/ld+json">`), `Clarity.astro` (injects a tracking script). The agent-generated codebase initially gave these components Storybook stories.

**Decision:** A component must only have a Storybook story if it produces visible UI output. Components that exist purely to inject scripts, meta tags, or other non-visual markup do not get stories.

**Reasoning:** Storybook is a component visualiser. A story for a non-UI component renders a blank canvas — it tests nothing, documents nothing, and adds noise to the story list. If behaviour testing is needed for a non-UI component, a unit test (`vitest`) is the appropriate tool.

**Rules:**

1. No `.stories.ts` file for any component whose rendered output is invisible (e.g. `<script>`, `<link>`, `<meta>`, empty `<div>`).
2. If logic in a non-UI component warrants testing, write a Vitest unit test instead.
3. PR reviewers should reject stories for non-UI components.

**Consequence:** `StructuredData` and `Clarity` do not have stories. Future analytics, SEO, or script-injection components follow the same rule.

---

## ADR-036: Analytics initialisation consent-gated via event listener

**Status:** Accepted
**Date:** 2026-04-28

**Context:** Microsoft Clarity (and any future analytics) must not run until the user accepts cookies, to comply with GDPR/PECR. The `CookieBanner` component stores the user's choice in `localStorage` under the key `cookie-consent` and dispatches a `cookie-consent-accepted` event on `window` when the user accepts.

**Decision:** Analytics components check `localStorage` on page load and also listen for the `cookie-consent-accepted` window event. Initialisation happens whichever comes first — no page reload is required after late consent.

**Implementation pattern (Clarity.astro):**

```js
function initClarity() {
  /* inject script tag */
}

if (localStorage.getItem('cookie-consent') === 'accepted') {
  initClarity();
} else {
  window.addEventListener('cookie-consent-accepted', initClarity, {
    once: true,
  });
}
```

**Reasoning:** Checking only on page load would miss users who accept cookies mid-session without refreshing. Listening only for the event would miss returning visitors who already accepted. Both cases must be handled.

**Consequence:** Any new analytics or tracking script added to the site must follow this two-path pattern. The `cookie-consent-accepted` event name is the contract between `CookieBanner` and all analytics components — do not rename it without updating all listeners.

---

## ADR-037: Sanity-first editor + one-way Commerce Layer sync

**Status:** Accepted
**Date:** 2026-06-17
**Category:** Commerce

**Context:** The ecommerce MVP integrates Sanity as the editorial CMS with Commerce Layer as the backend for orders and inventory. Commerce Layer is a powerful managed commerce platform, but it introduces two architectural decisions: (1) where editorial work happens, and (2) the direction of data flow between systems.

**Decision:** Sanity is the single source of truth for all product content (descriptions, images, pricing, attributes, variants). Commerce Layer is the order/payment engine and inventory manager. Data flows one-way: **Sanity → Commerce Layer only**. Commerce Layer never writes product data back to Sanity. Editors work exclusively in Sanity; they do not log into Commerce Layer.

**Reasoning:**

1. **Editorial source of truth:** Product content (name, description, hero image, variant specifications, pricing structure) is inherently editorial and belongs in the CMS. Sanity's rich text, asset management, and versioning/publishing workflow are built for editors. Commerce Layer's SKU/price data model is designed for operations, not editorial — it has no draft states or content scheduling.

2. **One-way data flow prevents conflicts:** If both systems could write product data, you'd need reconciliation logic, conflict resolution, and eventual consistency handling. One-way sync eliminates that complexity. Sanity writes product data to CL on publish. CL is read-only from Sanity's perspective.

3. **Commerce Layer emits events, not product mutations:** CL's role is to emit **stock events** (inventory updates from sales/restocking) and **order events** (payments, fulfillment). These flow back to Sanity as read-only intelligence for reporting, but they don't mutate product documents themselves.

4. **Editors don't need CL:** Editors have no reason to log into Commerce Layer. They don't manage stock (that's operations via CL's dashboard or ERP integrations), they don't process orders (that's also CL's responsibility). Their job is to describe and organize products in Sanity.

5. **CMS schema and API keys:** Sanity is home to all editorial schemas (`products`, `productVariants`, `productCategories`, `pricing`). Commerce Layer holds operational references (SKU identifiers, price metadata, inventory state). The API integration is: on publish in Sanity → sync product structure to CL via CL API → CL returns authoritative stock/pricing for cart/checkout.

**Constraints on the Commerce Layer data model:**

- Product hierarchies and variant relationships must mirror Sanity's schema. If a product has variants in Sanity (e.g., color + size), CL's SKU structure must support that relationship.
- Pricing in CL is derived from Sanity pricing rules, not independent. If you change a price in CL, it gets overwritten on the next Sanity sync.
- Product slug URLs and asset URLs originate from Sanity — CL stores references to these, not the canonical values.
- Attributes (color, size, material, etc.) are defined in Sanity and propagated to CL as SKU metadata — not the reverse.

**Sync mechanism (deferred to later tickets):**

- Sanity publish webhook → Lambda/serverless function → CL Product API
- On product publish in Sanity, the sync function: creates/updates products and SKUs in CL, respecting the variant hierarchy
- Stock and order events from CL are exposed via CL Webhooks and logged for dashboard/reporting (not synced back to Sanity documents)

**Consequence:**

1. Product content lives in Sanity schemas — never in CL. All editorial workflows (drafting, scheduling, preview, localization, versioning) happen in Sanity.
2. Commerce Layer is treated as a managed backend service, not a CMS. Its data model is shaped by Sanity's schema, not the reverse.
3. Developers integrating new product types or attributes must: (a) define the schema in Sanity, (b) ensure the CL sync function handles the new structure, (c) never create product data directly in CL expecting editors to use it.
4. Analytics and reporting queries pull stock/order events from CL webhooks, not from mutating Sanity product documents.
5. Future expansion into multi-currency, localization, or regional pricing is driven by Sanity's editorial model, with CL adapting to support it.

## ADR-038: Commerce adapter boundary — vendor-neutral interface, hidden implementations

**Status:** Accepted
**Date:** 2026-06-18
**Category:** Commerce

**Context:** The ecommerce MVP uses Commerce Layer as the order/payment backend, but the architecture must allow swapping the vendor (e.g. to Shopify) without rewriting consumer code. Pages, API routes, and React islands need a single, stable surface to call commerce methods against, regardless of which vendor is wired up underneath. Without a strict boundary, vendor types leak into UI code, and a future vendor swap becomes a rewrite rather than a config change.

**Decision:** All commerce functionality is exposed through a vendor-neutral `CommerceAdapter` interface defined in `src/lib/commerce/adapter.ts`. A singleton `commerce: CommerceAdapter` is exported from `src/lib/commerce/index.ts` and selected at import time via the `COMMERCE_PROVIDER` env var (default `commercelayer`). Every consumer — pages, API routes, React islands, server utilities — imports `commerce` from `src/lib/commerce` and **never** from a vendor folder. The vendor implementations (`src/lib/commerce/commercelayer/`, `src/lib/commerce/shopify/`) are private implementation details. This boundary is enforced by ESLint `no-restricted-imports`.

**Reasoning:**

1. **Vendor types must not leak.** If a page imports `commerceLayerAdapter` directly, or if a method returns a CL-shaped `Order` object, the vendor's shape is now baked into UI code. Swapping vendors means rewriting every call site. The adapter returns vendor-neutral types from `src/lib/commerce/types.ts` (`Customer`, `Cart`, `Order`, `Money`, etc.); each vendor implementation is responsible for mapping its own shapes onto those types.

2. **A single import path keeps the contract obvious.** `import { commerce } from '@/lib/commerce'` is the only way to reach commerce functionality. Any other import is a violation that surfaces as a lint error. This is preferable to convention-only enforcement because the rule fires immediately in editors and in CI, before review.

3. **The selector resolves once at import time, not per call.** `COMMERCE_PROVIDER` is read when `src/lib/commerce/index.ts` is first imported. There is one adapter instance per process. This avoids per-request env reads, eliminates any chance of partial swaps mid-render, and makes mocking trivial in tests (just swap the import).

4. **Stubs prove the abstraction holds.** `src/lib/commerce/shopify/index.ts` ships as a complete `CommerceAdapter` implementation where every method throws "not implemented". This is not dead code — it forces the interface to compile against more than one vendor, catching any case where the CL implementation accidentally relies on a vendor-specific signature. When Shopify support lands, the stub becomes the real implementation.

5. **The interface is the contract.** Adding a new method to `CommerceAdapter` is a contract change that affects every vendor. New methods must be added to `src/lib/commerce/adapter.ts` first, then implemented (or stubbed) in every vendor folder. Vendor-specific helpers that don't belong on the interface stay inside the vendor folder and are never exported beyond it.

**Constraints:**

- Consumers import from `src/lib/commerce` only. ESLint blocks `src/lib/commerce/commercelayer/**` and `src/lib/commerce/shopify/**` imports from anywhere outside `src/lib/commerce/`.
- Adapter methods return vendor-neutral types only. No CL SDK types, no Shopify Storefront types, no JSON:API resource objects in return values.
- Vendor folders own their env vars (`COMMERCELAYER_*`, future `SHOPIFY_*`). The selector reads only `COMMERCE_PROVIDER`. Vendor-specific env is read inside the vendor's own modules.
- Errors thrown by adapter methods are plain `Error` instances with messages safe to surface to logs. Vendor-specific error codes are translated or wrapped — they do not bubble out of the adapter unchanged.
- The selector throws on unknown `COMMERCE_PROVIDER` values at startup, not lazily on first call.

**Consequence:**

1. Swapping vendors is a config change plus implementing the methods in the vendor folder. No consumer code changes.
2. Tests against the adapter are vendor-agnostic — mock the `commerce` singleton, assert on the neutral types. Vendor-specific tests live inside the vendor folder using MSW against the vendor's HTTP API.
3. When implementing a new commerce feature, the order is: (a) decide the vendor-neutral shape in `types.ts`, (b) add the method signature to `CommerceAdapter`, (c) implement in `commercelayer/`, (d) stub in `shopify/`, (e) wire up the consumer using the `commerce` singleton.
4. Anyone touching commerce code must understand that the vendor folder is a sealed unit. Direct vendor SDK calls from a page or route is the single most damaging anti-pattern this ADR exists to prevent — the ESLint rule and this document are both deliberate friction.
5. The Shopify stub stays in the tree until Shopify is genuinely deprecated as an option. Removing it would weaken the proof that the boundary holds.

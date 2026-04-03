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

**Decision:** All colours, type scale, spacing, border radius, and shadow values are defined as tokens in `tailwind.config.ts` and CSS custom properties. These were extracted from Figma variables in M2.

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

## Adding a new entry

When you make a decision that future-you (or Claude Code) might question, add it here immediately:

```markdown
## ADR-00X: Short descriptive title

**Decision:** What you chose.

**Reasoning:** Why, and what alternatives were considered.

**Consequence:** What this means for how code should be written day-to-day.
```

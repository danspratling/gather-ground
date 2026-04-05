# CLAUDE.md

Persistent context for Claude Code on the Gather Ground website. **Read this file in full at the start of every session before touching any code.**

---

## Project overview

Marketing website for Gather Ground. Astro framework, Tailwind CSS + shadcn/ui for styling, Storyblok as the headless CMS, Storybook for the component library, Playwright for e2e testing, deployed on Vercel.

- **Repo:** https://github.com/danspratling/gather-ground
- **Design source:** Figma (via Figma MCP in Claude desktop app)
- **CMS:** Storyblok — Space ID `289911665285843`
- **Deployment:** Vercel — preview on every PR, production on merge to `main`
- **Issue tracking:** Linear — https://linear.app/dspratling/project/gather-ground-website-9f2703a0cb94

---

## Stack at a glance

| Layer          | Tool                               | Notes                                                                                      |
| -------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Framework      | Astro (latest)                     | `.astro` for static, React islands for interactive                                         |
| Styling        | Tailwind CSS v4                    | CSS custom properties in `src/styles/global.css`                                           |
| Primitives     | shadcn/ui                          | Via Astro + React integration                                                              |
| CMS            | `@storyblok/astro`                 | Space ID `289911665285843`                                                                 |
| Component docs | Storybook v10                      | `@storybook-astro/framework`; addon-a11y, addon-designs, addon-docs, Chromatic             |
| Testing        | `@storybook/test` + Playwright     | Stories for component interactions; Playwright for full-page structural + behavioral tests |
| Linting        | ESLint (`eslint-config-astro`)     | `eslint.config.js`                                                                         |
| Formatting     | Prettier + `prettier-plugin-astro` | `.prettierrc`                                                                              |
| CI             | GitHub Actions                     | `.github/workflows/ci.yml`                                                                 |

---

## Project structure

```
/
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint, format, typecheck, build, test — every PR
│       └── deploy.yml        # Production deploy — merge to main
├── src/
│   ├── components/           # UI components — each in its own folder, co-located with stories and types
│   ├── layouts/              # Base layouts (Layout.astro = Header + Footer wrapper)
│   ├── pages/                # Astro pages (index.astro = homepage)
│   ├── storyblok/            # Storyblok component schema definitions
│   ├── stories/              # Global Storybook docs only (Introduction.mdx)
│   └── styles/               # Global CSS + design tokens (global.css)
├── tests/                    # Playwright e2e and visual regression tests
├── .storybook/               # Storybook config
├── CLAUDE.md                 # This file
├── CONTRIBUTING.md           # PR checklist, branch conventions, component guide
├── DECISIONS.md              # Architecture decision log
└── TOKENS.md                 # Design token reference (generated after M2)
```

---

## Before starting any task

1. Check `DECISIONS.md` for relevant architectural context
2. Check `CONTRIBUTING.md` for the PR checklist and component conventions
3. Check the Linear issue for the specific spec and Figma frame reference
4. Run `npm run dev` to confirm the baseline is green before making changes

---

## Formatting and linting

Formatting is **fully automated**. Never manually adjust indentation, quotes, or import order.

```bash
npm run format        # Auto-fix all formatting — run before every commit
npm run lint          # Check ESLint errors
npm run lint:fix      # Auto-fix ESLint errors where possible
npm run typecheck     # tsc --noEmit — TypeScript check
```

- Run `npm run format` before every commit, without exception
- Run `npm run typecheck` after any change to a TypeScript interface
- CI will reject PRs with lint errors or unformatted files — fix locally, never push and hope
- Do not add ESLint disable comments without an explanation on the same line

---

## CI pipeline

Every PR runs `.github/workflows/ci.yml` automatically as 5 parallel jobs:

| Job                         | Commands                                 |
| --------------------------- | ---------------------------------------- |
| Lint & Format               | `npm run lint`, `npm run format:check`   |
| Typecheck                   | `npm run typecheck`                      |
| Build                       | `npm run build`                          |
| E2E Tests (Playwright)      | `npx playwright install && npm run test` |
| Component Tests (Storybook) | `npm run build-storybook`                |

Fix CI failures locally before pushing:

```bash
npm run format && npm run lint:fix                  # lint/format
npm run typecheck                                   # types
npm run build-storybook && npm run test-storybook   # storybook
npx playwright test --ui                            # playwright interactive
```

## Pre-PR validation (required for AI agents)

Before pushing a branch or creating a PR, **always run the full local pipeline** in order and confirm every step exits cleanly:

```bash
npm run format          # 1. Auto-fix formatting
npm run lint            # 2. ESLint — must be zero errors
npm run typecheck       # 3. TypeScript — must be zero errors
npm run build           # 4. Astro build — must complete
npm run build-storybook # 5. Storybook build — must complete
npx playwright test     # 6. E2E tests — must all pass
```

Do not push if any step fails. Fix the failure first, then re-run from step 1.
As the codebase grows, validate at minimum the steps that cover changed files — but when in doubt, run all six.

---

## Coding conventions

### Components

- Use `.astro` for static/server-rendered output. Use `.tsx` React islands only when client-side interactivity is required.
- Prefer `client:visible` over `client:load` unless the component must be interactive on immediate mount.
- Never fetch data inside a component — fetch in Astro page frontmatter, pass as props.
- All props interfaces live in `src/components/ComponentName.types.ts`, co-located with the component (ADR-017). The component imports its own type from there.

### Naming

- Component files: `PascalCase` — `HeroSection.astro`, `FaqAccordion.tsx`
- Type files: `[ComponentName].types.ts` — co-located in the component folder
- Story files: `[ComponentName].stories.ts` (or `.tsx` for React islands) — co-located in the component folder
- Storyblok schema files: `[componentName].ts` in `src/storyblok/`

### Styling

- No inline styles. No hardcoded colour hex values, font sizes, or spacing values.
- All visual values come from tokens in `src/styles/global.css` — see `TOKENS.md`.
- No arbitrary Tailwind values like `w-[843px]` unless there is genuinely no token equivalent.
- Responsive: mobile-first. Base = mobile, `md:` = tablet, `lg:` = desktop (design is 1440px wide).

### TypeScript

- Strict mode is enabled. No `any`. No `@ts-ignore` without an explanation comment.
- Define the TypeScript interface **first**, before writing component markup.

### Storyblok

- Schema field names: `snake_case` (CMS convention)
- TypeScript props: `camelCase` — the schema file handles mapping
- Never create or edit schemas in the Storyblok dashboard — always via `src/storyblok/` + CLI push
- Never fetch Storyblok data client-side (only exception: visual editor bridge in preview mode)

### Storybook

- Stories are co-located in the component folder alongside the component file (see `DECISIONS.md` ADR-017)
- Use `@storybook/test` play functions for interaction tests — not Playwright inside story files
- Every story includes `parameters.design` with the Figma frame URL

### Git

- Branch name: use Linear's generated branch name shown on each issue
- Commit format: `feat(name): description — Closes GG-XX`
- Never commit directly to `main` — always via PR with CI passing

---

## Environment variables

| Variable                 | Used by                       | Where to get it                      |
| ------------------------ | ----------------------------- | ------------------------------------ |
| `STORYBLOK_TOKEN`        | `@storyblok/astro` (server)   | Storyblok → Settings → Access Tokens |
| `STORYBLOK_SPACE_ID`     | `@storyblok/astro`            | `289911665285843`                    |
| `PUBLIC_STORYBLOK_TOKEN` | Visual editor bridge (client) | Same token value, public prefix      |

Copy `.env.example` to `.env`. Never commit `.env`.

---

## Homepage sections (Figma order)

These are **page sections** — composed layouts driven by Storyblok content. Each one is a separate component in `src/components/` and is rendered in `src/pages/index.astro`. Follow the page section workflow in `CONTRIBUTING.md` when building or updating these.
1. Header — in `Layout.astro`
2. `HeroSection.astro` — 1440×1140
3. `ProductsSection.astro` — 1440×752
4. `ProductsSectionAlt.astro` — 1440×700
5. `TestimonialsSection.astro` — 1440×444
6. `FaqSection.astro` + `FaqAccordion.tsx` island — 1440×1308
7. `BlogSection.astro` — 1440×826
8. Footer — in `Layout.astro`

`SectionDivider.astro` appears between sections where shown in Figma.

---

## MCP-aided development workflow (for page sections)

When building a page section, use Figma MCP and Playwright MCP as a closed-loop design validation cycle. This is required before opening a PR for any section component (ADR-021).

**Step by step:**

1. **Get the Figma frame URL** from the Linear issue for the section being built
2. **Read the frame with Figma MCP** — extract: layout structure, which design tokens apply, spacing, responsive behaviour at 375px and 1440px, which existing UI components are used
3. **Build the section** — types interface first, then markup using only design tokens and existing components (no new primitives unless the component checklist is followed)
4. **Write the Storybook story** — hardcoded mock props, `Default` story + any meaningful variants; no live Storyblok data in stories
5. **Validate with Playwright MCP**:
   - Navigate to `http://localhost:4321` (dev server must be running)
   - Screenshot at viewport width 375px (mobile)
   - Screenshot at viewport width 1440px (desktop)
   - Compare each screenshot against the Figma frame
   - List specific discrepancies: spacing gaps, misaligned elements, wrong token values, missing responsive behaviour
6. **Iterate** — fix discrepancies and re-validate until both breakpoints match
7. **Write structural + behavioral Playwright tests** for the section in `tests/pages/[pageName].spec.ts` (ADR-020)
8. **Run the full pre-PR check** before pushing

**Scope:** The MCP validation loop is a development-time aid only. It does not replace Chromatic (visual regression baseline), play functions (component interaction tests), or Playwright tests (structural/behavioral).

---

## Returning after a long break

1. Read this file in full
2. Read `DECISIONS.md` — understand why patterns exist before changing them
3. `npm install` — dependencies may have updated
4. `npm run dev` + `npm run storybook` + `npx playwright test` — confirm green baseline
5. Check Linear for any open issues before starting anything new
6. Content changes belong in Storyblok, not in code

---

## What NOT to do

- Do not hardcode visual values — use tokens
- Do not format code manually — run `npm run format`
- Do not use `client:load` when `client:visible` is sufficient
- Do not fetch data inside components
- Do not create Storyblok schemas in the dashboard
- Do not skip writing the TypeScript interface before the component
- Do not push without `npm run format`, `npm run typecheck`, and both test suites passing
- Do not commit to `main` directly
- Do not assert on CMS content in Playwright tests — only structure and behavior (ADR-020)
- Do not skip the Figma MCP + Playwright MCP validation loop when building page sections (ADR-021)
- Do not add visual regression assertions to Playwright tests — Chromatic owns that (ADR-016)

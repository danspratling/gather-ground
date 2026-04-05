# CONTRIBUTING.md

How to contribute to the Gather Ground website codebase. Read this before opening any PR.

---

## Component PRs vs page section PRs

This project has two kinds of contribution with different checklists:

- **UI components** — primitive building blocks (`Button`, `Badge`, `Carousel`, etc.) that live in `src/components/` and appear in Storybook
- **Page sections** — composed sections that assemble UI components into full-width layouts (`HeroSection`, `FeaturesSection`, `CtaSection`, etc.) driven by Storyblok content

Read the relevant section below for the one you're working on.

---

## Every component PR must include all of the following

These are non-negotiable. A PR missing any item will not be merged.

| #   | Deliverable                | Location                                                       |
| --- | -------------------------- | -------------------------------------------------------------- |
| 1   | Component file             | `src/components/[Name]/[Name].astro` or `[Name].tsx`           |
| 2   | TypeScript props interface | `src/components/[Name]/[Name].types.ts` (co-located, exported) |
| 3   | Storybook story            | `src/components/[Name]/[Name].stories.ts` (co-located)         |
| 4   | Story interaction test     | `play` function inside the story file                          |
| 5   | Storyblok schema           | `src/storyblok/[name].ts`                                      |
| 6   | Page integration           | Component rendered in a page or layout                         |

### Notes on each

**Component file:** Use `.astro` for static components, `.tsx` React island for anything requiring client-side interactivity. All three files — component, types, and story — live together in `src/components/[Name]/`. The component imports its props type from its co-located `[Name].types.ts`.

**TypeScript interface:** Write this first, before the markup. It is the contract between the component, the story, and the Storyblok schema — all three must stay in sync.

**Storybook story:** Must include a `Default` story and at least one variant that demonstrates a meaningful difference (e.g. with/without optional props, different visual states).

**Story interaction test:** Use `@storybook/test` (`userEvent`, `expect`) in a `play` function. For purely static components, a snapshot-style test that confirms rendering is acceptable. Do not use Playwright inside story files.

**Storyblok schema:** Field names must be `snake_case`. They must map 1:1 to the TypeScript props interface. Never create schemas manually in the Storyblok dashboard — push via CLI.

**Page integration:** The component must appear somewhere on the real site, not just in Storybook. For section components this means `index.astro`. For layout components this means `Layout.astro`.

---

## Every page section PR must include all of the following

Page sections compose existing UI components into CMS-driven layouts. The workflow and deliverables differ from UI components.

| #   | Deliverable                | Location                                                       |
| --- | -------------------------- | -------------------------------------------------------------- |
| 1   | Section component file     | `src/components/[Name]/[Name].astro` (always `.astro`)         |
| 2   | TypeScript props interface | `src/components/[Name]/[Name].types.ts` (co-located, exported) |
| 3   | Storybook story            | `src/components/[Name]/[Name].stories.ts` (co-located)            |
| 4   | Storyblok schema           | `src/storyblok/[name].ts`                                         |
| 5   | Page integration           | Section rendered in `src/pages/index.astro` (or relevant page)   |
| 6   | Playwright tests           | `tests/pages/[pageName].spec.ts` — structural + behavioral        |

Note: page sections rarely need a play function — the composed UI components carry their own. Add one only if the section introduces interaction that isn't tested by any sub-component (e.g. a section-level animation trigger, or a layout-level keyboard behaviour).

### Notes on each

**Section component:** Always `.astro` — sections are static server-rendered layouts. Only introduce a co-located React island (`.tsx`) if the section contains interactive behaviour that cannot be handled by an existing UI component.

**TypeScript interface:** Write this first. Props map 1:1 to Storyblok schema fields (using `camelCase` in TypeScript, `snake_case` in the schema). Data is received as props from the Astro page frontmatter — never fetched inside the section.

**Storybook story:** Provide realistic hardcoded mock data as story args — do not fetch from Storyblok inside stories. The story's purpose is visual documentation and Chromatic snapshot coverage. A `Default` story with representative content is sufficient; add variants for meaningful layout differences (e.g. with/without an optional `badge` field, short vs long copy). Play functions are not required but are welcome if the section introduces interaction that isn't already tested by a sub-component — do not duplicate a play function that exists on a composed component.

**Storyblok schema:** Field names must be `snake_case`. Push via CLI, never via the Storyblok dashboard.

**Page integration:** The section must be rendered in the real page (`index.astro`) receiving live Storyblok data. Verify it renders correctly in the Vercel preview on the PR.

**Playwright tests:** Add structural and behavioral tests for the section to the relevant page spec. See the testing rules below and `tests/pages/homepage.spec.ts` for examples. Never assert on CMS content — assert on structure and behavior only (ADR-020).

### Step by step — adding a page section

1. **Read the Linear issue** — note the Figma frame URL and the section dimensions
2. **Read the Figma frame** using Figma MCP — extract the layout structure, token usage, and responsive breakpoints before writing any markup
3. **Create the branch** using Linear's generated branch name
4. **Write the TypeScript interface first** — `src/components/[Name]/[Name].types.ts` (add `export default null` at the end)
5. **Build the section component** — `src/components/[Name]/[Name].astro`, using only design tokens and existing UI components
6. **Write the Storybook story** — `src/components/[Name]/[Name].stories.ts` with hardcoded mock props; no live Storyblok data
7. **Write the Storyblok schema** — `src/storyblok/[name].ts`, matching the TypeScript interface
8. **Integrate into the page** — import and render the section in `index.astro`, wired to Storyblok data
9. **Validate with Playwright MCP** — screenshot at 375px and 1440px, compare against the Figma frame, fix discrepancies (ADR-021)
10. **Write Playwright tests** — structural and behavioral assertions in `tests/pages/[pageName].spec.ts`
11. **Run the full local check** (see Definition of done below)
12. **Commit and push** — CI will run automatically, Vercel generates a preview URL
13. **Open the PR** — include the Figma frame URL and the Linear issue number in the description

---

## Playwright testing rules for pages

These apply to all tests in `tests/pages/`.

**Assert on structure, not content.** Page content comes from Storyblok and is edited by non-engineers — content assertions will break on routine CMS updates.

| Do                                          | Don’t                                   |
| ------------------------------------------- | --------------------------------------- |
| `getByRole('heading', { level: 1 })` exists | `getByText('Welcome to Gather Ground')` |
| `getByRole('navigation')` has links         | `getByText('Shop Now')`                 |
| `locator('img')` all have non-empty `alt`   | `getByAltText('Hero background image')` |
| `getByRole('button')` is focusable          | `getByText('Subscribe')`                |

**Every page spec must include:**

- Exactly one `<h1>` on the page
- `<main>` and `<nav>` landmarks present
- All images have non-empty `alt` attributes
- No console errors on load

**Each interactive section must add:**

- The relevant behavioral test (nav opens/closes, accordion expands/collapses, form validates)

**No visual assertions** — Chromatic owns visual regression at the component level (ADR-016, ADR-019).

See `tests/pages/homepage.spec.ts` for a reference implementation and `DECISIONS.md` ADR-020 for the full rationale.

---

Before opening a PR, confirm all of these pass locally:

- [ ] Component renders correctly at 1440px (desktop) and 375px (mobile)
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run format:check` — no formatting drift (or run `npm run format` to fix)
- [ ] `npm run build` — Astro production build succeeds
- [ ] `npm run test-storybook` — all story tests pass
- [ ] `npx playwright test` — all e2e tests pass
- [ ] No console errors in the browser
- [ ] Storyblok schema field names match TypeScript props exactly

---

## Adding a new component — step by step

1. **Pick up the Linear issue** — read the spec and note the Figma frame dimensions
2. **Create the branch** using Linear's generated branch name (shown on the issue)
3. **Write the TypeScript interface first** — `src/components/[Name]/[Name].types.ts` (add `export default null` at the end)
4. **Build the component** — `src/components/[Name]/[Name].astro` (or `[Name].tsx` if interactive), using only design tokens for styling
5. **Write the Storybook story** — `src/components/[Name]/[Name].stories.ts` with Default + variant stories and a play function
6. **Write the Storyblok schema** — `src/storyblok/[name].ts`, matching the TypeScript interface field-for-field
7. **Integrate into the page or layout**
8. **Run the full local check** (see Definition of done above)
9. **Commit and push** — CI will run automatically, Vercel will generate a preview URL
10. **Open the PR** with the Linear issue number in the description

---

## Branch naming

Use the branch name Linear generates on each issue. It follows the pattern:

```
feature/gg-16-component-button
```

Do not invent your own branch names — Linear's format keeps issues and branches linked automatically.

---

## Commit message format

```
feat(button): add Button component, story, and Storyblok schema — Closes GG-16
```

Prefixes:

- `feat` — new component or feature
- `fix` — bug fix
- `chore` — config, tooling, dependency updates
- `docs` — documentation only

One logical unit of work per commit. Do not bundle unrelated changes.

---

## Code style quick reference

Full conventions are in `CLAUDE.md`. Short version:

- **Formatting:** Run `npm run format` — never format manually
- **Styling:** Tailwind tokens only — no hardcoded values, no arbitrary classes
- **React islands:** `client:visible` preferred over `client:load`
- **Data fetching:** Astro frontmatter only — never inside a component
- **Commits:** Never directly to `main`

---

## CI

GitHub Actions runs the full check suite on every PR automatically. The PR cannot be merged until all checks pass. Fix failures locally — don't push again and wait for CI to tell you what's wrong.

Vercel generates a preview deployment URL on every PR automatically — no action needed.

---

## Chromatic visual review

Every PR triggers a Chromatic build that captures snapshots of all Storybook stories and diffs them against the accepted baseline.

**Reviewing changes:**

1. Open the Chromatic link in the PR checks
2. Review each changed snapshot — approve if intentional, deny if a regression
3. Once all changes are reviewed, the Chromatic check turns green

**Accepting a new baseline** (first run, or after intentional visual changes):

- Accept all snapshots in the Chromatic UI to establish/update the baseline
- Chromatic remembers the baseline per branch and then per `main` once merged

**When to expect Chromatic diffs:**

- Any change to a component's markup, Tailwind classes, or tokens will produce a diff
- New stories produce new snapshots (auto-accepted on first appearance)
- Unrelated snapshots should show no change — investigate unexpected diffs before merging

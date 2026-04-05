# CONTRIBUTING.md

How to contribute to the Gather Ground website codebase. Read this before opening any PR.

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

## Definition of done

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
dan/dan-16-component-button
```

Do not invent your own branch names — Linear's format keeps issues and branches linked automatically.

---

## Commit message format

```
feat(button): add Button component, story, and Storyblok schema — Closes DAN-16
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

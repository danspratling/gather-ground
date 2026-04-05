# Gather Ground — Copilot Instructions

Marketing website. Astro + Tailwind CSS v4 + shadcn/ui + Storyblok CMS + Storybook v10 + Playwright. Deployed on Vercel.

## Stack

- **Framework:** Astro — `.astro` for static, `.tsx` React islands for interactive
- **Styling:** Tailwind CSS v4 — tokens defined as CSS custom properties in `src/styles/global.css`; no `tailwind.config.ts`
- **Primitives:** shadcn/ui via Base UI (not Radix) — `components.json` configured; add with `npx shadcn add`
- **Icons:** `@untitledui-pro/icons/line` for UI icons; `src/components/Icons/*.astro` for brand/social icons
- **CMS:** `@storyblok/astro` — all data fetched in Astro page frontmatter only, never client-side
- **Storybook:** `@storybook-astro/framework` — renders `.astro` and `.tsx` natively

## Component structure

Every component lives in its own folder with all related files co-located:

```
src/components/[Name]/
  [Name].astro         # static component
  [Name].tsx           # React island (only if interactive)
  [Name].types.ts      # props interface — must end with `export default null`
  [Name].stories.ts    # Storybook story (or .tsx for React islands)
  [Name].figma.tsx     # Figma Code Connect (optional) — must end with `export default null`
```

Component groups: `Layout/` (Header, Footer), `Typography/` (Body, Heading, Label), `Forms/` (Button, Input). Everything else is a top-level folder.

`src/components/ui/` — shadcn primitives only; CLI-managed; every file must end with `export default null`.

## Conventions

**Components**

- `.astro` for static; `.tsx` for interactive (state, events)
- `client:visible` at the usage site unless above-the-fold → use `client:load`
- Never fetch data inside a component
- Write the TypeScript interface before the component markup
- No `any`, no `@ts-ignore` without explanation, strict mode enabled

**Styling**

- All values from tokens in `src/styles/global.css` — see `TOKENS.md`
- No hardcoded hex values, no inline styles, no arbitrary Tailwind values
- Mobile-first: base = mobile, `md:` = tablet, `lg:` = desktop

**Naming**

- Component files: `PascalCase`
- Type files: `[ComponentName].types.ts` — co-located
- Story files: `[ComponentName].stories.ts` — co-located
- Storyblok schemas: `camelCase` in `src/storyblok/`

**Storybook**

- Stories co-located in component folder — not in `src/stories/` (that's for global docs only)
- Use `@storybook/test` play functions for interaction tests — never Playwright inside stories
- Every story includes `parameters.design` with the Figma frame URL
- React island stories use `.tsx` extension and `renderer: 'react'` in parameters
- Non-story `.ts/.tsx` files in `src/components/` must include `export default null`

**Storyblok**

- Schema field names: `snake_case`; TypeScript props: `camelCase`
- Never edit schemas in the dashboard — always via `src/storyblok/[name].ts` + CLI push

**Git**

- Branch names from Linear; commit format: `feat(name): description — Closes GG-XX`
- Never commit directly to `main`

## Commands

```bash
npm run dev             # local dev server
npm run format          # auto-fix formatting (run before every commit)
npm run lint            # ESLint check
npm run typecheck       # tsc --noEmit
npm run build           # Astro production build
npm run build-storybook # Storybook static build
npx playwright test     # e2e tests
```

## Key files

- `src/styles/global.css` — design tokens (`@theme` block)
- `TOKENS.md` — token reference
- `DECISIONS.md` — architecture decisions (read before changing patterns)
- `CONTRIBUTING.md` — PR checklist and component guide

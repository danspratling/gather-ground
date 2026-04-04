# Gather Ground

Marketing website for Gather Ground — a heritage-breed family farm in rural Iowa.

Built with Astro, Tailwind CSS v4, shadcn/ui, and Storyblok.

## First-time setup

**1. Use the correct Node version**

```sh
nvm use
```

**2. Authenticate with the Untitled UI private registry**

Run this once. It writes to your global `~/.npmrc` and is never committed.

```sh
npm config set //pkg.untitledui.com/:_authToken=YOUR_TOKEN_HERE
```

Get your token from the Untitled UI dashboard.

**3. Install dependencies**

```sh
npm install
```

**4. Set up environment variables**

```sh
cp .env.example .env
```

Fill in the values — see `.env.example` for descriptions.

## Commands

| Command             | Action                                                |
| :------------------ | :---------------------------------------------------- |
| `npm run dev`       | Start local dev server at `localhost:4321`            |
| `npm run build`     | Build production site to `./dist/`                    |
| `npm run storybook` | Start Storybook component library at `localhost:6006` |
| `npm run typecheck` | TypeScript type check                                 |
| `npm run lint`      | ESLint                                                |
| `npm run format`    | Prettier (auto-fix)                                   |
| `npm run test`      | Playwright e2e tests                                  |

## Further reading

- [CLAUDE.md](.claude/CLAUDE.md) — full project context and conventions
- [DECISIONS.md](DECISIONS.md) — architecture decision log
- [CONTRIBUTING.md](CONTIBUTING.md) — PR checklist and component guide
- [TOKENS.md](TOKENS.md) — design token reference

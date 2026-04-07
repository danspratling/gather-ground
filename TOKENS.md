# Design Token Reference

All tokens are sourced from Figma and defined in `src/styles/global.css`. Use the Tailwind utility classes listed — never hardcode hex values or raw CSS in components.

---

## Colours

### Brand palette

| Token       | Hex       | Tailwind class                    | Usage                             |
| ----------- | --------- | --------------------------------- | --------------------------------- |
| `off-white` | `#FFFFF8` | `bg-off-white` / `text-off-white` | Page background                   |
| `brand-25`  | `#F5F5F5` | `bg-brand-25` / `text-brand-25`   | Light button text                 |
| `brand-50`  | `#E6E6E6` | `bg-brand-50` / `text-brand-50`   | Secondary button border           |
| `brand-100` | `#CCCCCC` | `bg-brand-100` / `text-brand-100` | —                                 |
| `brand-200` | `#B3B3B3` | `bg-brand-200` / `text-brand-200` | Footer link text                  |
| `brand-300` | `#999999` | `bg-brand-300` / `text-brand-300` | —                                 |
| `brand-400` | `#808080` | `bg-brand-400` / `text-brand-400` | Muted / badge borders             |
| `brand-700` | `#3B3B3B` | `bg-brand-700` / `text-brand-700` | Primary button bg, section labels |
| `brand-900` | `#202020` | `bg-brand-900` / `text-brand-900` | Primary body text                 |

### Gray palette

| Token      | Hex       | Tailwind class                  | Usage                     |
| ---------- | --------- | ------------------------------- | ------------------------- |
| `gray-200` | `#E5E5E5` | `bg-gray-200` / `text-gray-200` | Dividers                  |
| `gray-300` | `#DBDBDB` | `bg-gray-300` / `text-gray-300` | badge-modern border       |
| `gray-400` | `#D1D1D1` | `bg-gray-400` / `text-gray-400` | —                         |
| `gray-500` | `#BFBFBF` | `bg-gray-500` / `text-gray-500` | —                         |
| `gray-600` | `#A5A5A5` | `bg-gray-600` / `text-gray-600` | Supporting / caption text |
| `gray-700` | `#8B8B8B` | `bg-gray-700` / `text-gray-700` | Nav link text             |
| `gray-800` | `#575757` | `bg-gray-800` / `text-gray-800` | Footer divider            |
| `gray-900` | `#232323` | `bg-gray-900` / `text-gray-900` | Headings                  |
| `gray-950` | `#171717` | `bg-gray-950` / `text-gray-950` | Footer background         |

### Semantic status palette (Badge colours)

Each status has three stops: `-50` (background), `-200` (border), `-700` (text/dot).

| Token prefix | bg-50     | border-200 | text-700  |
| ------------ | --------- | ---------- | --------- |
| `error`      | `#FEF3F2` | `#FECDCA`  | `#B42318` |
| `warning`    | `#FFFAEB` | `#FEDF89`  | `#B54708` |
| `success`    | `#ECFDF3` | `#ABEFC6`  | `#067647` |
| `blue-light` | `#F0F9FF` | `#B9E6FE`  | `#026AA2` |
| `blue`       | `#EFF8FF` | `#B2DDFF`  | `#175CD3` |
| `indigo`     | `#EEF4FF` | `#C7D7FE`  | `#3538CD` |
| `purple`     | `#F4F3FF` | `#D9D6FE`  | `#5925DC` |
| `pink`       | `#FDF2FA` | `#FCCEEE`  | `#C11574` |
| `orange`     | `#FEF6EE` | `#F9DBAF`  | `#B93815` |
| `gray-blue`  | `#F8F9FC` | `#D5D9EB`  | `#363F72` |

### Secondary palette

| Token           | Hex       | Tailwind class                            | Usage            |
| --------------- | --------- | ----------------------------------------- | ---------------- |
| `secondary-50`  | `#FAF7EF` | `bg-secondary-50` / `text-secondary-50`   | Card backgrounds |
| `secondary-200` | `#F6F2E3` | `bg-secondary-200` / `text-secondary-200` | Accent fills     |

### Shadcn semantic aliases

These map Shadcn UI's semantic color system to the Gather Ground palette. Use these for component primitives.

| Semantic token         | Maps to                   |
| ---------------------- | ------------------------- |
| `background`           | `off-white` (#FFFFF8)     |
| `foreground`           | `brand-900` (#202020)     |
| `primary`              | `brand-700` (#3B3B3B)     |
| `primary-foreground`   | `brand-25` (#F5F5F5)      |
| `secondary`            | `brand-50` (#E6E6E6)      |
| `secondary-foreground` | `brand-900` (#202020)     |
| `muted`                | `brand-25` (#F5F5F5)      |
| `muted-foreground`     | `gray-600` (#A5A5A5)      |
| `card`                 | `secondary-50` (#FAF7EF)  |
| `card-foreground`      | `brand-900` (#202020)     |
| `border`               | `gray-200` (#E5E5E5)      |
| `ring`                 | `brand-700` (#3B3B3B)     |
| `accent`               | `secondary-200` (#F6F2E3) |

---

## Typography

Font: **DM Sans** (variable, via `@fontsource-variable/dm-sans`). Applied globally via `--font-sans`.

### Text sizes

All defined in `global.css`. Font weights 400/500/600 are standard Tailwind utilities (`font-normal`, `font-medium`, `font-semibold`).

| Figma style | Size | Line height | Tailwind class                                      |
| ----------- | ---- | ----------- | --------------------------------------------------- |
| xs/medium   | 12px | 18px        | `text-xs font-medium`                               |
| sm/regular  | 14px | 20px        | `text-sm font-normal`                               |
| sm/semibold | 14px | 20px        | `text-sm font-semibold`                             |
| md/regular  | 16px | 24px        | `text-base font-normal`                             |
| md/medium   | 16px | 24px        | `text-base font-medium`                             |
| md/semibold | 16px | 24px        | `text-base font-semibold`                           |
| lg/regular  | 18px | 28px        | `text-lg font-normal`                               |
| lg/semibold | 18px | 28px        | `text-lg font-semibold`                             |
| xl/regular  | 20px | 30px        | `text-xl font-normal`                               |
| xl/semibold | 20px | 30px        | `text-xl font-semibold`                             |
| display-md  | 36px | 44px        | `text-display-md font-semibold tracking-display-md` |
| display-lg  | 48px | 60px        | `text-display-lg font-semibold tracking-display-lg` |
| display-xl  | 60px | 72px        | `text-display-xl font-medium tracking-display-xl`   |

### Letter spacing

| Token                 | Value   | Tailwind class        | Usage         |
| --------------------- | ------- | --------------------- | ------------- |
| `tracking-display-md` | −0.72px | `tracking-display-md` | 36px headings |
| `tracking-display-lg` | −0.96px | `tracking-display-lg` | 48px headings |
| `tracking-display-xl` | −1.2px  | `tracking-display-xl` | 60px headings |

---

## Shadows

| Token       | Value                                    | Tailwind class |
| ----------- | ---------------------------------------- | -------------- |
| `shadow-xs` | `0px 1px 2px 0px rgba(10, 13, 18, 0.05)` | `shadow-xs`    |

---

## Design observations

- **Page background** is `off-white` (#FFFFF8) — not pure white
- **Cards** use `secondary-50` (#FAF7EF) — warm cream
- **Footer** bg is `gray-950` (#171717) with light text
- **Primary buttons**: `bg-brand-700 text-brand-25 rounded-full` — pill shape
- **Secondary buttons**: `bg-off-white border-brand-50 rounded-full`
- **Nav links**: `text-gray-700` — intentionally muted
- **Section labels** (e.g. "Products", "News"): `text-brand-700 font-semibold text-base`
- **Section headings**: `text-gray-900 text-display-md font-semibold tracking-display-md`
- **Supporting text**: `text-gray-600 text-xl font-normal`

# Design Token Reference

All tokens are sourced from Figma and defined in `src/styles/global.css`. Use the Tailwind utility classes listed — never hardcode hex values or raw CSS in components.

---

## Colours

### Primary brand palette

These are the **preferred** colours for all primary brand assets. Use these as the default; reach for the supporting palettes below only when a primary colour is not appropriate.

| Token            | Hex       | Tailwind class                              | Usage                               |
| ---------------- | --------- | ------------------------------------------- | ----------------------------------- |
| `off-white`      | `#FCFAF2` | `bg-off-white` / `text-off-white`           | Page background (warm cream)        |
| `sage-400`       | `#A9B9A3` | `bg-sage-400` / `text-sage-400`             | Sage accent — base                  |
| `terracotta-500` | `#A0654A` | `bg-terracotta-500` / `text-terracotta-500` | Terracotta accent — base            |
| `brand-700`      | `#3B3B3B` | `bg-brand-700` / `text-brand-700`           | Charcoal — primary text & button bg |

### Sage palette

| Token      | Hex       | Tailwind class                  |
| ---------- | --------- | ------------------------------- |
| `sage-25`  | `#F8FAF7` | `bg-sage-25` / `text-sage-25`   |
| `sage-50`  | `#F0F4EE` | `bg-sage-50` / `text-sage-50`   |
| `sage-100` | `#E2EADD` | `bg-sage-100` / `text-sage-100` |
| `sage-200` | `#C4D4BE` | `bg-sage-200` / `text-sage-200` |
| `sage-300` | `#B7C8B1` | `bg-sage-300` / `text-sage-300` |
| `sage-400` | `#A9B9A3` | `bg-sage-400` / `text-sage-400` |
| `sage-500` | `#8CA185` | `bg-sage-500` / `text-sage-500` |
| `sage-600` | `#6F876A` | `bg-sage-600` / `text-sage-600` |
| `sage-700` | `#586D52` | `bg-sage-700` / `text-sage-700` |
| `sage-800` | `#44543E` | `bg-sage-800` / `text-sage-800` |
| `sage-900` | `#2F3C2B` | `bg-sage-900` / `text-sage-900` |

### Terracotta palette

| Token            | Hex       | Tailwind class                              |
| ---------------- | --------- | ------------------------------------------- |
| `terracotta-25`  | `#FBF6F3` | `bg-terracotta-25` / `text-terracotta-25`   |
| `terracotta-50`  | `#F7EDE7` | `bg-terracotta-50` / `text-terracotta-50`   |
| `terracotta-100` | `#EED9CD` | `bg-terracotta-100` / `text-terracotta-100` |
| `terracotta-200` | `#DFB8A3` | `bg-terracotta-200` / `text-terracotta-200` |
| `terracotta-300` | `#C89679` | `bg-terracotta-300` / `text-terracotta-300` |
| `terracotta-400` | `#B47B5E` | `bg-terracotta-400` / `text-terracotta-400` |
| `terracotta-500` | `#A0654A` | `bg-terracotta-500` / `text-terracotta-500` |
| `terracotta-600` | `#87523C` | `bg-terracotta-600` / `text-terracotta-600` |
| `terracotta-700` | `#6C4030` | `bg-terracotta-700` / `text-terracotta-700` |
| `terracotta-800` | `#523024` | `bg-terracotta-800` / `text-terracotta-800` |
| `terracotta-900` | `#3A2218` | `bg-terracotta-900` / `text-terracotta-900` |

### Brand (neutral) palette

Neutral charcoal/grey scale. `brand-700` is part of the primary brand. The lighter tints are for text, borders, and UI surfaces — they are **not** primary brand colours.

| Token       | Hex       | Tailwind class                    | Usage                             |
| ----------- | --------- | --------------------------------- | --------------------------------- |
| `brand-25`  | `#F5F5F5` | `bg-brand-25` / `text-brand-25`   | Light button text                 |
| `brand-50`  | `#E6E6E6` | `bg-brand-50` / `text-brand-50`   | Secondary button border           |
| `brand-100` | `#CCCCCC` | `bg-brand-100` / `text-brand-100` | Input borders                     |
| `brand-200` | `#B3B3B3` | `bg-brand-200` / `text-brand-200` | Footer link text                  |
| `brand-300` | `#999999` | `bg-brand-300` / `text-brand-300` | —                                 |
| `brand-400` | `#808080` | `bg-brand-400` / `text-brand-400` | Muted / badge borders             |
| `brand-500` | `#666666` | `bg-brand-500` / `text-brand-500` | Form placeholders                 |
| `brand-600` | `#4D4D4D` | `bg-brand-600` / `text-brand-600` | Supporting text                   |
| `brand-700` | `#3B3B3B` | `bg-brand-700` / `text-brand-700` | Primary text, button bg, headings |
| `brand-900` | `#202020` | `bg-brand-900` / `text-brand-900` | Strong body text                  |

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

| Token           | Hex       | Tailwind class                            | Usage                        |
| --------------- | --------- | ----------------------------------------- | ---------------------------- |
| `secondary-25`  | `#FCFBF7` | `bg-secondary-25` / `text-secondary-25`   | —                            |
| `secondary-50`  | `#FAF7EF` | `bg-secondary-50` / `text-secondary-50`   | BadgeGroup gray bg           |
| `secondary-100` | `#F7F3E7` | `bg-secondary-100` / `text-secondary-100` | BadgeGroup gray hover bg     |
| `secondary-200` | `#F6F2E3` | `bg-secondary-200` / `text-secondary-200` | Accent fills                 |
| `secondary-300` | `#F5F1E8` | `bg-secondary-300` / `text-secondary-300` | BadgeGroup gray border       |
| `secondary-400` | `#E2D7C3` | `bg-secondary-400` / `text-secondary-400` | BadgeGroup gray hover border |
| `secondary-500` | `#CDBFA7` | `bg-secondary-500` / `text-secondary-500` | —                            |
| `secondary-600` | `#B7A88C` | `bg-secondary-600` / `text-secondary-600` | —                            |
| `secondary-700` | `#A19171` | `bg-secondary-700` / `text-secondary-700` | —                            |
| `secondary-800` | `#8B7A56` | `bg-secondary-800` / `text-secondary-800` | —                            |
| `secondary-900` | `#75633B` | `bg-secondary-900` / `text-secondary-900` | —                            |
| `secondary-950` | `#5F4C20` | `bg-secondary-950` / `text-secondary-950` | —                            |

### Shadcn semantic aliases

These map Shadcn UI's semantic color system to the Gather Ground palette. Use these for component primitives.

| Semantic token         | Maps to                   |
| ---------------------- | ------------------------- |
| `background`           | `off-white` (#FCFAF2)     |
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

- **Page background** is `off-white` (#FCFAF2) — warm cream, not pure white
- **Cards** use `secondary-50` (#FAF7EF) — lighter warm cream
- **Footer** bg is `gray-950` (#171717) with light text
- **Primary buttons**: `bg-brand-700 text-brand-25 rounded-full` — pill shape
- **Secondary buttons**: `bg-off-white border-brand-50 rounded-full`
- **Nav links**: `text-gray-700` — intentionally muted
- **Section labels** (e.g. "Products", "News"): `text-brand-700 font-semibold text-base`
- **Section headings**: `text-gray-900 text-display-md font-semibold tracking-display-md`
- **Supporting text**: `text-gray-600 text-xl font-normal`

## Accessibility notes

Text colours that **fail WCAG AA (4.5:1)** on `off-white` backgrounds — do not use for body copy:

| Class            | Hex       | Ratio on off-white |
| ---------------- | --------- | ------------------ |
| `text-gray-600`  | `#A5A5A5` | 2.2:1              |
| `text-gray-700`  | `#8B8B8B` | 3.0:1              |
| `text-brand-200` | `#B3B3B3` | 1.9:1              |
| `text-brand-300` | `#999999` | 2.5:1              |
| `text-brand-400` | `#808080` | 3.5:1              |

Safe text colours on `off-white`:

| Class            | Hex       | Ratio on off-white |
| ---------------- | --------- | ------------------ |
| `text-brand-500` | `#666666` | 4.6:1 (AA)         |
| `text-brand-600` | `#4D4D4D` | 7.0:1 (AAA)        |
| `text-brand-700` | `#3B3B3B` | 9.4:1 (AAA)        |
| `text-brand-900` | `#202020` | 14.2:1 (AAA)       |
| `text-gray-800`  | `#575757` | 5.7:1 (AA)         |
| `text-gray-900`  | `#232323` | 13.4:1 (AAA)       |

Use `text-brand-500` or darker for placeholder text and supporting copy on `off-white` / `secondary-*` backgrounds.

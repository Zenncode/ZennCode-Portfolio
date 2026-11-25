# ZennCode Portfolio

Personal portfolio matching the structure and **bryl-minimal** design language of [bryllim.com](https://bryllim.com/), based on the official open skill: [bryllim/bryl-minimal-design](https://github.com/bryllim/bryl-minimal-design).

## Stack

- Vite + React 19 + TypeScript
- React Router v7
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- Framer Motion
- Geist / Geist Mono / Geist Pixel / Source Serif 4

## Run

```bash
node scripts/guard-no-loader.mjs
npm install
npm run dev
```

## Supply-chain guard

Run `npm run security:guard` to statically check tracked files for loader scripts,
obfuscation payloads, unsafe lifecycle commands, and secret-ignore regressions.
The check also runs in CI and before commits when the bundled hook is enabled:

```bash
git config core.hooksPath .githooks
```

## What’s matched

- Monochrome palette (no accent color), light / dark / system theme
- Desktop **left sidebar** nav; mobile top bar + overlay
- Section headers: `01 — blog`, `02 — projects`, …
- Hairline-divided stat grid, soft cards, inverted chips
- ⌘K command palette, live viewers + community chat
- Full page tree: blog, projects, experience, stack, certs, recs, affiliations
- Halftone texture accent, fade-up motion

## Customize content

```
src/data/portfolio.ts
```

## Design reference

Do not copy Bryl’s personal content. Copy the **layout system and visual language** only (MIT design skill).

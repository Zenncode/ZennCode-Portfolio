# ZennCode Portfolio

Personal portfolio — a minimal, monochrome editorial layout in light, dark,
and system themes.

## Stack

- Vite + React 19 + TypeScript
- React Router v7
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- Framer Motion
- Geist / Geist Mono / Geist Pixel / Source Serif 4

## Run

```bash
npm install
npm run dev
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

## Private admin dashboard (`/admin`)

`/admin` is a login-gated dashboard with visit counters, the recent-visitor
feed, and guestbook moderation. Only the owner can see it.

**The login is a username, the security is not.** The box accepts `zenncode`,
but Firebase verifies the credential over the wire, and `firestore.rules`
gates the data on the signed-in account's **email**. The password is never in
the bundle or in git — only the `username → email` mapping is
(`src/data/admin.json`), and that email is already public in the site footer.

A hardcoded password in the source would have been a published password: the
bundle ships to every visitor and this repo is public on GitHub.
**Setup (two steps, once)**

1. **Enable Email/Password** — <https://console.firebase.google.com/project/zenncode-portfolio/authentication/providers>
   → Email/Password → Enable. Or keep it in-repo and run
   `firebase deploy --only auth,firestore:rules`.
2. **Create the account** — same console → Authentication → Users → Add user
   → `zenjanarce8@gmail.com` + your password.

Then sign in at `/admin` with `zenncode` and that password. No Firestore
documents to create — the email allowlist in `firestore.rules` is the gate.

**Adding another admin**: add their email to the `in [...]` list in
`firestore.rules` and redeploy the rules.

**Visit tracking** (`src/lib/visitors.ts`) records one entry per browser
session: total counter, a `day-YYYY-MM-DD` counter, and one coarse visit record
— stable anonymous id, visit number, city/country, device type, OS, browser,
viewport, language, timezone, landing path, referrer host. No IP addresses, no
user agents, no fingerprints. Signed-in sessions and `Do Not Track: 1` are
skipped so your own browsing never inflates the numbers.

**Link clicks** (`src/lib/links.ts`) records every outbound, `mailto:`/`tel:`
and internal-route click, stamped with the same `visitorId` as the visit — so
`/admin/visitors` can show *who clicked what* by joining the two tables.
Anchors are caught by one delegated listener on `document`; anything driven by
JS instead (the ⌘K command palette) calls `trackClick()` explicitly. Label an
anchor with `data-track="…"` to override its display text.

## Design reference

- Monochrome palette, one ink colour, no accents
- Left sidebar nav on desktop, top bar + overlay on mobile
- Mono type for UI, serif for article body
- Everything hairline-divided; cards are flat with soft shadows

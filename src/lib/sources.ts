/**
 * Traffic source attribution — "saan galing ang visitor?"
 *
 * The admin clicks table used to show the page the click happened on
 * (`/projects`), which is not what "FROM" means. A source is where the visitor
 * came *from*: Facebook, TikTok, Instagram, Google search, a newsletter, or
 * their own bookmark. This module resolves that once per session and every
 * visit and click row can then label itself with it.
 *
 * Three signals, best first:
 *
 *   1. Campaign tags on the landing URL — `?utm_source=tiktok`,
 *      `?ref=facebook`, `?from=instagram`. This is the honest one: in-app
 *      browsers (Facebook, Instagram, TikTok) hide `document.referrer` for
 *      everyone, so a link pasted into a post arrives with no referrer and
 *      would otherwise look like "(direct)".
 *   2. `document.referrer`'s host. Works when someone clicks a normal link on
 *      another site, or arrives through Google.
 *   3. Nothing at all — `(direct)`: typed the URL, a bookmark, an app link, a
 *      QR code, or a referrer the sender stripped.
 *
 * A tag wins over the referrer because it was put there deliberately, by
 * whoever posted the link.
 */

const DIRECT = '(direct)'

/** sessionStorage key holding the resolved source of the browsing session. */
const SOURCE_KEY = 'zc-source'

/* ─── Hosts we can name ──────────────────────────────────────────────────── */

/**
 * Matched on the domain *and its subdomains*, so `m.facebook.com`,
 * `l.facebook.com` and `facebook.com` are all Facebook — no guessing where a
 * public suffix ends (`google.com.ph` is not `com.ph`, and `t.co` is not `t`).
 */
const BRAND_HOSTS: [string, string][] = [
  ['facebook.com', 'Facebook'],
  ['fb.com', 'Facebook'],
  ['fb.me', 'Facebook'],
  ['instagram.com', 'Instagram'],
  ['tiktok.com', 'TikTok'],
  ['twitter.com', 'X'],
  ['x.com', 'X'],
  ['t.co', 'X'],
  ['linkedin.com', 'LinkedIn'],
  ['lnkd.in', 'LinkedIn'],
  ['reddit.com', 'Reddit'],
  ['youtube.com', 'YouTube'],
  ['youtu.be', 'YouTube'],
  ['threads.net', 'Threads'],
  ['pinterest.com', 'Pinterest'],
  ['pin.it', 'Pinterest'],
  ['messenger.com', 'Messenger'],
  ['tumblr.com', 'Tumblr'],
  ['github.com', 'GitHub'],
  ['producthunt.com', 'Product Hunt'],
  ['discord.com', 'Discord'],
  ['discord.gg', 'Discord'],
  ['telegram.org', 'Telegram'],
  ['t.me', 'Telegram'],
  ['whatsapp.com', 'WhatsApp'],
  ['wa.me', 'WhatsApp'],
  ['viber.com', 'Viber'],
  ['medium.com', 'Medium'],
  ['dev.to', 'Dev.to'],
  ['hashnode.dev', 'Hashnode'],
  ['mail.google.com', 'Gmail'],
]

/** Hosts that mean "this person searched for it". */
const SEARCH_HOSTS = [
  'bing.com',
  'duckduckgo.com',
  'ecosia.org',
  'yahoo.com',
  'yandex.com',
  'baidu.com',
  'brave.com',
]

/** `HOSTS` — true when `host` is that domain or any subdomain of it. */
function hostIs(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`)
}

/* ─── Campaign values we can name ────────────────────────────────────────── */

/**
 * Brand words searched for inside a campaign or source value, longest-form
 * first so `instagram` beats `ig`. `utm_source=fb`, `utm_campaign=tiktok_launch`
 * and `ref=phone` all resolve to something a human can read.
 */
const BRAND_KEYWORDS: [RegExp, string][] = [
  [/\bfacebook\b|\bfb\b|\bmeta\b/, 'Facebook'],
  [/\binstagram\b|\big\b|\binsta\b/, 'Instagram'],
  [/\btiktok\b|\btt\b|\bttk\b/, 'TikTok'],
  [/\btwitter\b|\bx\.com\b|\bx\b|\btw\b/, 'X'],
  [/\blinkedin\b|\bli\b/, 'LinkedIn'],
  [/\byoutube\b|\byt\b/, 'YouTube'],
  [/\breddit\b/, 'Reddit'],
  [/\bthreads\b/, 'Threads'],
  [/\bgithub\b|\bgh\b/, 'GitHub'],
  [/product ?hunt|\bph\b/, 'Product Hunt'],
  [/\bpinterest\b/, 'Pinterest'],
  [/\bdiscord\b/, 'Discord'],
  [/\btelegram\b/, 'Telegram'],
  [/\bwhatsapp\b|\bviber\b/, 'WhatsApp'],
  [/\bemail\b|\bnewsletter\b|\bmail\b/, 'Email'],
  [/\bqr\b|\bqrcode\b/, 'QR code'],
]

const MEDIUM_ALIASES: Record<string, string> = {
  social: 'Social',
  cpc: 'Paid search',
  ppc: 'Paid search',
  paid: 'Paid search',
  email: 'Email',
  sms: 'SMS',
  display: 'Display',
  referral: 'Referral',
  banner: 'Banner',
  affiliate: 'Affiliate',
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/** Lowercased hostname without a leading `www.`, e.g. `www.t.co` → `t.co`. */
function hostOf(value: string): string {
  if (!value) return ''
  try {
    const input = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`
    const host = new URL(input).hostname.toLowerCase().replace(/^www\./, '')
    if (!host || host === 'null') return ''
    return host
  } catch {
    return ''
  }
}

/** `https://www.google.com` is search; `mail.google.com` is email. */
function isSearchHost(host: string): boolean {
  // Google's TLDs are many — `google.com`, `google.com.ph`, `google.co.uk`.
  if (/(^|\.)google\.[a-z.]+$/.test(host)) return true
  return SEARCH_HOSTS.some((d) => hostIs(host, d))
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** `tiktok_launch`, `fb`, `phone` → `TikTok`, `Facebook`, `` (unknown). */
function detectBrand(value: string): string {
  const raw = value.trim().toLowerCase()
  if (!raw) return ''
  // Separators vary: `tiktok_launch`, `ig-reels`, `fb.post`. `\b` doesn't see
  // an underscore as a boundary, so the padded form is checked too.
  const padded = raw.replace(/[^a-z0-9]+/g, ' ').trim()
  const hit = BRAND_KEYWORDS.find(
    ([re]) => re.test(raw) || re.test(padded),
  )
  return hit ? hit[1] : ''
}

/** `utm_medium=cpc` → `Paid search`. */
function labelForMedium(value: string): string {
  const v = value.trim().toLowerCase()
  if (!v) return ''
  return MEDIUM_ALIASES[v] ?? titleCase(v)
}

/* ─── Resolution ─────────────────────────────────────────────────────────── */

function tagSource(search: string): string {
  let params: URLSearchParams
  try {
    params = new URLSearchParams(search)
  } catch {
    return ''
  }

  const source = (
    params.get('utm_source') ??
    params.get('ref') ??
    params.get('from') ??
    params.get('source') ??
    ''
  ).trim()
  if (source) {
    // A brand word inside the tag beats whatever it says — `ig_launch` is
    // Instagram, not "Ig Launch".
    return detectBrand(source) || titleCase(source).slice(0, 40)
  }

  const campaign = (params.get('utm_campaign') ?? '').trim()
  if (campaign) {
    const brand = detectBrand(campaign)
    if (brand) return brand
  }
  return labelForMedium(params.get('utm_medium') ?? '')
}

/**
 * Where a visit came from, from campaign tags → referrer host → direct.
 *
 * Exported so the admin table can label rows written before sources were
 * attributed (they only stored a referrer host) without needing a migration.
 */
export function resolveSource(referrer: string, search = ''): string {
  const tagged = tagSource(search)
  if (tagged) return tagged

  const host = hostOf(referrer)
  if (!host) return DIRECT

  const brand = BRAND_HOSTS.find(([domain]) => hostIs(host, domain))
  if (brand) return brand[1]

  if (isSearchHost(host)) return 'Search'

  // Unknown site — the domain itself is still more useful than "(direct)".
  return host.slice(0, 24)
}

/* ─── Per-session source ─────────────────────────────────────────────────── */

/** The referrer of the current document, or `''` when there isn't one. */
export function currentReferrer(): string {
  if (typeof document === 'undefined') return ''
  return document.referrer ?? ''
}

/** `location.search` of the current document, or `''`. */
export function currentSearch(): string {
  if (typeof window === 'undefined') return ''
  return window.location.search ?? ''
}

/**
 * Where the current browsing session came from, resolved once and remembered
 * for the rest of the session.
 *
 * The referrer only exists on a *document* load — route changes inside the SPA
 * never refresh it, so resolving per click would lose the attribution the
 * moment the visitor moved to a second page. sessionStorage survives reloads
 * and route changes, and dies with the tab, which is exactly how long a
 * "session" should last.
 */
export function currentSource(): string {
  if (typeof window === 'undefined') return DIRECT
  const resolve = () => resolveSource(currentReferrer(), currentSearch())
  try {
    const cached = sessionStorage.getItem(SOURCE_KEY)
    if (cached) return cached
    const resolved = resolve()
    sessionStorage.setItem(SOURCE_KEY, resolved)
    return resolved
  } catch {
    // Storage blocked (private mode) — resolve fresh, best-effort.
    return resolve()
  }
}

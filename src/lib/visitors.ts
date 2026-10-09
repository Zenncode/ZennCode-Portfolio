import {
  addDoc,
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import { auth } from './auth'
import { currentSource, resolveSource } from './sources'

/**
 * Visitor tracking for the /admin dashboard.
 *
 * One `visits` document per browser session, written once. It is deliberately
 * built from signals the browser hands over freely rather than from anything
 * that identifies a person:
 *
 *   - `visitorId` is a random id we generate and keep in localStorage. It is
 *     NOT a fingerprint — no canvas, no font list, no hardware probe. Two
 *     people with identical setups get different ids, and the same person on
 *     a different browser gets a different id. It exists purely so the table
 *     can say "returning, 3rd visit".
 *   - No IP address is stored. The IP is sent to the geo service to get a city
 *     back and then dropped; only the city survives.
 *   - No user agent string is stored — just the parsed OS and browser name.
 *
 * See firestore.rules for the server-side shape of a valid record.
 */

const VISITS = 'visits'
const STATS = 'siteStats'

/** One write per tab session, so browsing 30 pages counts as one visit. */
const SESSION_FLAG = 'zc-visit-recorded'
/** Stable per-browser anonymous id. */
const VISITOR_KEY = 'zc-vid'
/** How many sessions this browser has had. */
const VISIT_COUNT_KEY = 'zc-visit-count'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export type VisitRecord = {
  id: string
  createdAt: number
  /** 8 random hex chars, e.g. `a3f2c1d9`. Reused across sessions. */
  visitorId: string
  /** Sessions this browser has had, this one included. */
  visitCount: number
  device: DeviceType
  os: string
  browser: string
  /** `412x915` — viewport, not screen, so it reflects what they saw. */
  viewport: string
  lang: string
  /** IANA zone, e.g. `Asia/Manila`. */
  timezone: string
  /** First path of the session. */
  entry: string
  /** Referrer host, or `(direct)`. */
  referrer: string
  /** How the visitor got here: `Facebook`, `Search`, `zenncode.dev`, … */
  source: string
  city: string
  country: string
  /** ISO 3166-1 alpha-2, used for the flag. */
  countryCode: string
}

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  const n = Number(value)
  return Number.isFinite(n) ? n : Date.now()
}

function dayKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `day-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/* ─── Signals ───────────────────────────────────────────────────────────── */

function randomId(): string {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Stable per browser. Falls back to a per-tab id if storage is blocked. */
function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = randomId()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

/** Increments and returns the session count for this browser. */
function bumpVisitCount(): number {
  try {
    const next = Number(localStorage.getItem(VISIT_COUNT_KEY) ?? '0') + 1
    localStorage.setItem(VISIT_COUNT_KEY, String(next))
    return next
  } catch {
    return 1
  }
}

/** The stable id for this browser, without creating one. */
export function currentVisitorId(): string {
  try {
    return localStorage.getItem(VISITOR_KEY) ?? ''
  } catch {
    return ''
  }
}

/** How many sessions this browser has had so far. */
export function currentVisitCount(): number {
  try {
    return Number(localStorage.getItem(VISIT_COUNT_KEY) ?? '0')
  } catch {
    return 0
  }
}

function detectDevice(): DeviceType {
  const shortSide = Math.min(window.screen.width, window.screen.height)
  const touch = navigator.maxTouchPoints > 0
  if (shortSide < 500) return 'mobile'
  if (touch) return 'tablet'
  return 'desktop'
}

function detectOS(): string {
  const ua = navigator.userAgent
  // Chromium exposes the platform directly — no string sniffing needed.
  const platform = (
    navigator as { userAgentData?: { platform?: string } }
  ).userAgentData?.platform
  if (platform) return platform
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/CrOS/.test(ua)) return 'Chrome OS'
  if (/Android/.test(ua)) return 'Android'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Linux/.test(ua)) return 'Linux'
  return 'unknown'
}

function detectBrowser(): string {
  const ua = navigator.userAgent
  const brands = (
    navigator as { userAgentData?: { brands?: { brand: string }[] } }
  ).userAgentData?.brands
  if (brands?.length) {
    // Chromium reports "Chromium" and "Not/A)Brand" alongside the real one.
    const real =
      brands.find((b) => !/Chromium|^Not\/|^Not |Brand/i.test(b.brand)) ??
      brands[0]
    return real.brand
  }
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\//.test(ua) || /Opera/.test(ua)) return 'Opera'
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet'
  if (/Firefox|FxiOS/.test(ua)) return 'Firefox'
  if (/CriOs/.test(ua)) return 'Chrome'
  if (/Chrome/.test(ua)) return 'Chrome'
  if (/Safari/.test(ua)) return 'Safari'
  return 'unknown'
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  } catch {
    return ''
  }
}

/**
 * Coarse location from IP. The IP goes to the service and is dropped — only
 * the city/country it returns is stored. Best-effort: any failure or block
 * leaves the fields empty and the visit still records.
 */
async function fetchLocation(): Promise<{
  city: string
  country: string
  countryCode: string
}> {
  const empty = { city: '', country: '', countryCode: '' }
  const ctrl = new AbortController()
  const to = window.setTimeout(() => ctrl.abort(), 3500)
  try {
    const res = await fetch('https://ipwho.is/', { signal: ctrl.signal })
    if (!res.ok) return empty
    const j = (await res.json()) as {
      success?: boolean
      city?: string
      country?: string
      country_code?: string
    }
    if (!j || j.success === false) return empty
    return {
      city: j.city ?? '',
      country: j.country ?? '',
      countryCode: (j.country_code ?? '').toUpperCase(),
    }
  } catch {
    return empty
  } finally {
    window.clearTimeout(to)
  }
}

/* ─── Write ─────────────────────────────────────────────────────────────── */

/**
 * Records one visit per browser session. Skipped for signed-in users (the
 * owner) and for anyone who asked not to be tracked. All writes are
 * best-effort: the site never waits on, or shows, a tracking failure.
 */
export async function recordVisit(): Promise<void> {
  if (!db || typeof window === 'undefined') return
  if (auth?.currentUser) return // the owner browsing

  try {
    const dnt =
      navigator.doNotTrack === '1' ||
      (window as { doNotTrack?: string }).doNotTrack === '1'
    if (dnt) return
  } catch {
    /* treat as trackable */
  }

  // Claim the session slot before awaiting so a fast double-mount can't
  // double-write.
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return
    sessionStorage.setItem(SESSION_FLAG, '1')
  } catch {
    return // private mode / storage blocked — don't write blind
  }

  const geo = await fetchLocation()

  let referrer = '(direct)'
  try {
    referrer = document.referrer ? new URL(document.referrer).host : '(direct)'
  } catch {
    referrer = '(direct)'
  }

  try {
    await Promise.all([
      // Total + today counters. `increment` resolves server-side, and the
      // rules require exactly +1, so these can only ever count up by one.
      setDoc(
        doc(db, STATS, 'total'),
        { count: increment(1), updatedAt: serverTimestamp() },
        { merge: true },
      ),
      setDoc(
        doc(db, STATS, dayKey(new Date())),
        { count: increment(1), updatedAt: serverTimestamp() },
        { merge: true },
      ),
      addDoc(collection(db, VISITS), {
        createdAt: serverTimestamp(),
        visitorId: getVisitorId(),
        visitCount: bumpVisitCount(),
        device: detectDevice(),
        os: detectOS(),
        browser: detectBrowser(),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        lang: String(navigator.language || ''),
        timezone: detectTimezone(),
        entry: location.pathname,
        referrer,
        source: currentSource(),
        city: geo.city,
        country: geo.country,
        countryCode: geo.countryCode,
      }),
    ])
  } catch {
    /* counters are decoration — never surface this to a visitor */
  }
}

/* ─── Read (admin only — see firestore.rules) ───────────────────────────── */

/** Live tail of the most recent visits, newest first. */
export function subscribeVisits(
  fn: (visits: VisitRecord[]) => void,
): Unsubscribe | null {
  if (!db) {
    fn([])
    return null
  }
  return onSnapshot(
    query(collection(db, VISITS), orderBy('createdAt', 'desc'), limit(60)),
    (snap) => {
      const rows: VisitRecord[] = []
      snap.forEach((d) => {
        const data = d.data()
        rows.push({
          id: d.id,
          createdAt: toMillis(data.createdAt),
          visitorId: String(data.visitorId ?? ''),
          visitCount: Number(data.visitCount ?? 1),
          device: String(data.device ?? '') as DeviceType,
          os: String(data.os ?? ''),
          browser: String(data.browser ?? ''),
          viewport: String(data.viewport ?? ''),
          lang: String(data.lang ?? ''),
          timezone: String(data.timezone ?? ''),
          entry: String(data.entry ?? '/'),
          referrer: String(data.referrer ?? ''),
          // Older rows were written before sources were attributed — fall
          // back to the stored referrer so nothing shows up blank.
          source: data.source
            ? String(data.source)
            : resolveSource(String(data.referrer ?? '')),
          city: String(data.city ?? ''),
          country: String(data.country ?? ''),
          countryCode: String(data.countryCode ?? ''),
        })
      })
      fn(rows)
    },
    () => fn([]),
  )
}

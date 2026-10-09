import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import { auth } from './auth'
import { currentVisitCount, currentVisitorId } from './visitors'
import { currentSource } from './sources'

/**
 * Link click tracking — "who clicked what".
 *
 * A single delegated listener on `document` catches every anchor click, so new
 * links are tracked without touching each component. Only links that lead
 * somewhere count: outbound URLs, mailto/tel, and internal routes. In-page
 * anchors (#section) are ignored, as is anything marked `data-no-track`, and
 * the owner's own clicks on /admin.
 *
 * Each click stores the `visitorId`, which is the same id the visits table
 * uses — so a click row can be joined back to a visitor's device and country
 * without storing any of it twice.
 */

const CLICKS = 'linkClicks'

export type LinkClick = {
  id: string
  createdAt: number
  visitorId: string
  visitCount: number
  /** Human label for the link, e.g. `github ↗` or `/blog`. */
  label: string
  /** Where it points: a host for outbound, a path for internal. */
  target: string
  /** Page the click happened on. */
  path: string
  /** How the visitor got to the site: `Facebook`, `Search`, `(direct)`, … */
  source: string
}

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  const n = Number(value)
  return Number.isFinite(n) ? n : Date.now()
}

/** What to show in the table for this anchor. */
function labelFor(a: HTMLAnchorElement): string {
  const explicit = a.getAttribute('data-track')
  if (explicit) return explicit.trim().slice(0, 60)
  const text = (a.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (text) return text.slice(0, 60)
  const title = a.getAttribute('aria-label')
  if (title) return title.trim().slice(0, 60)
  return a.getAttribute('href') ?? 'link'
}

/**
 * Resolves an href into `{ target, trackable }`.
 * Returns `trackable: false` for anything that isn't a real destination.
 */
function resolveHref(href: string): { target: string; trackable: boolean } {
  const raw = href.trim()

  if (raw.startsWith('#')) return { target: '', trackable: false }

  if (/^(mailto:|tel:)/i.test(raw)) {
    return { target: raw.slice(0, 40), trackable: true }
  }

  let url: URL
  try {
    url = new URL(raw, window.location.href)
  } catch {
    return { target: '', trackable: false }
  }

  // Internal route links — track by path.
  if (url.origin === window.location.origin) {
    const path = `${url.pathname}${url.search}`
    // The dashboard is the owner's; never record navigation around it.
    if (path.startsWith('/admin')) return { target: '', trackable: false }
    return { target: path.slice(0, 120), trackable: true }
  }

  // Outbound — track by host so the table reads like "github.com", not a URL.
  return { target: url.host.slice(0, 120), trackable: true }
}

/** True when the anchor sits inside something the user is typing into. */
function inEditor(el: Element | null): boolean {
  if (!el) return false
  if (el.closest('[data-no-track]')) return true
  return false
}

export function startLinkTracking(): void {
  if (typeof document === 'undefined') return
  if (document.documentElement.dataset.linkTracking === 'on') return
  document.documentElement.dataset.linkTracking = 'on'

  // Capture phase, so it runs even if a component stops the click from
  // doing its usual thing (e.g. the command palette opening an overlay).
  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (inEditor(anchor)) return
      if (anchor.getAttribute('href') === '#') return

      const { target, trackable } = resolveHref(anchor.href)
      if (!trackable) return

      // Never record the owner's own navigation.
      if (auth?.currentUser) return

      void trackClick(labelFor(anchor), target)
    },
    true,
  )
}

/**
 * Records one click. Fire-and-forget: never throws, never blocks the
 * navigation that follows it. Exported so non-anchor UI (command palette,
 * download buttons) can report clicks the document listener can't see.
 */
export async function trackClick(
  label: string,
  target: string,
  path = window.location.pathname,
): Promise<void> {
  if (!db) return
  if (auth?.currentUser) return // never record the owner's own clicks
  try {
    await addDoc(collection(db, CLICKS), {
      createdAt: serverTimestamp(),
      visitorId: currentVisitorId() || 'unknown',
      visitCount: Math.max(1, currentVisitCount()),
      label: label.slice(0, 60) || 'link',
      target: target.slice(0, 120) || '—',
      path: path.slice(0, 120),
      // Resolved once per session and cached by lib/sources, so every click
      // in the session is attributed to where the visitor actually came from.
      source: currentSource().slice(0, 60),
    })
  } catch {
    /* analytics must never break a click */
  }
}

/** Live tail of the most recent clicks, newest first. */
export function subscribeClicks(
  fn: (clicks: LinkClick[]) => void,
): Unsubscribe | null {
  if (!db) {
    fn([])
    return null
  }
  return onSnapshot(
    query(collection(db, CLICKS), orderBy('createdAt', 'desc'), limit(60)),
    (snap) => {
      const rows: LinkClick[] = []
      snap.forEach((d) => {
        const data = d.data()
        rows.push({
          id: d.id,
          createdAt: toMillis(data.createdAt),
          visitorId: String(data.visitorId ?? ''),
          visitCount: Number(data.visitCount ?? 1),
          label: String(data.label ?? ''),
          target: String(data.target ?? ''),
          path: String(data.path ?? '/'),
          source: String(data.source ?? ''),
        })
      })
      fn(rows)
    },
    () => fn([]),
  )
}

/** Click counts per link, highest first. */
export function tallyClicks(clicks: LinkClick[]): {
  label: string
  target: string
  count: number
}[] {
  const map = new Map<string, { label: string; target: string; count: number }>()
  for (const c of clicks) {
    const key = `${c.label} → ${c.target}`
    const hit = map.get(key)
    if (hit) hit.count += 1
    else map.set(key, { label: c.label, target: c.target, count: 1 })
  }
  return [...map.values()].sort((a, b) => b.count - a.count)
}

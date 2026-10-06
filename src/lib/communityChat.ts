import {
  collection,
  doc,
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

/**
 * Community chat — realtime for everyone via Cloud Firestore.
 *
 * One shared collection (`communityMessages`). Every open client holds
 * a live `onSnapshot` listener, so a message written by person A appears
 * on person B's screen within a second or two — no page refresh, no
 * third-party websocket relay.
 *
 * Requires: a Firestore database on the `zenncode-portfolio` project +
 * the rules in `firestore.rules` deployed. Until then writes fail
 * gracefully and the chat stays local-only (UI never crashes).
 */
const COLLECTION = 'communityMessages'
const USER_KEY = 'community-chat-user'
const MAX_MESSAGES = 200
const MAX_TEXT = 200

export type ChatUser = {
  name: string
  location: string
  countryCode?: string
}

export type ChatMessage = {
  id: string
  name: string
  location: string
  countryCode: string
  text: string
  /** Unix ms */
  createdAt: number
  seed: string
}

type Listener = (messages: ChatMessage[]) => void

const listeners = new Set<Listener>()
let cached: ChatMessage[] = []
let started = false
let connected = false
let unsubscribe: Unsubscribe | null = null
/** Human-readable send/connection failure, consumed by the UI. */
let lastError: string | null = null

/**
 * `createdAt` is a Firestore Timestamp on new writes (serverTimestamp), but
 * legacy documents stored epoch millis. Normalize both to a number so the
 * rest of the app can keep treating it as one.
 */
function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  const n = Number(value)
  return Number.isFinite(n) ? n : Date.now()
}

function toMessage(id: string, data: Record<string, unknown>): ChatMessage | null {
  const name = String(data.name ?? '').trim()
  const text = String(data.text ?? '').trim()
  if (!id || !name || !text) return null
  return {
    id,
    name,
    location: String(data.location ?? 'Somewhere'),
    countryCode: String(data.countryCode ?? ''),
    text: text.slice(0, MAX_TEXT),
    createdAt: toMillis(data.createdAt),
    seed: String(data.seed ?? name),
  }
}

/** Merge by id so optimistic local posts dedupe with the server echo. */
function mergeById(list: ChatMessage[]): ChatMessage[] {
  const seen = new Map<string, ChatMessage>()
  for (const m of list) seen.set(m.id, m)
  return [...seen.values()]
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(-MAX_MESSAGES)
}

function emit() {
  listeners.forEach((fn) => fn(cached))
}

/** Retry backoff after a listener error, in ms. */
const RETRY_STEPS = [1000, 4000, 10000, 30000]
let retryTimer: number | null = null
let retryStep = 0

function clearRetry() {
  if (retryTimer !== null) {
    window.clearTimeout(retryTimer)
    retryTimer = null
  }
}

/** Attach the live listener. Safe to call repeatedly. */
function attach(): void {
  if (!db) {
    connected = false
    emit()
    return
  }

  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(MAX_MESSAGES),
    )
    unsubscribe = onSnapshot(
      q,
      (snap) => {
        const msgs: ChatMessage[] = []
        snap.forEach((d) => {
          const m = toMessage(d.id, d.data() as Record<string, unknown>)
          if (m) msgs.push(m)
        })
        // Optimistic local posts not yet echoed stay visible
        cached = mergeById([...msgs, ...cached])
        connected = true
        retryStep = 0
        emit()
      },
      () => {
        // The listener stops permanently once this fires, so tear it down and
        // resubscribe with backoff instead of staying dead until reload.
        connected = false
        emit()
        scheduleRetry()
      },
    )
  } catch {
    connected = false
    unsubscribe = null
    emit()
    scheduleRetry()
  }
}

function scheduleRetry(): void {
  if (retryTimer !== null) return
  const delay = RETRY_STEPS[Math.min(retryStep, RETRY_STEPS.length - 1)]
  retryStep += 1
  retryTimer = window.setTimeout(() => {
    retryTimer = null
    if (!started) return
    try {
      unsubscribe?.()
    } catch {
      /* ignore */
    }
    unsubscribe = null
    attach()
  }, delay)
}

/** Start live sync once (shared across component mounts) */
export function startCommunityChat(): void {
  if (started || typeof window === 'undefined') return
  started = true
  attach()
  emit()
}

export function stopCommunityChat(): void {
  started = false
  clearRetry()
  retryStep = 0
  try {
    unsubscribe?.()
  } catch {
    /* ignore */
  }
  unsubscribe = null
  connected = false
  cached = []
}

export function subscribeMessages(fn: Listener): () => void {
  startCommunityChat()
  listeners.add(fn)
  fn(cached)
  return () => {
    listeners.delete(fn)
  }
}

export function getMessages(): ChatMessage[] {
  return cached
}

export function isChatConnected(): boolean {
  return connected
}

/** Last send/connection error, or null. Cleared on the next successful send. */
export function getChatError(): string | null {
  return lastError
}

export function clearChatError(): void {
  lastError = null
}

/**
 * Post a message. Resolves true once the write is confirmed, false if it was
 * rejected or the write failed — the caller should keep the draft on false.
 * The message renders optimistically either way.
 */
export async function postMessage(input: {
  name: string
  location: string
  countryCode?: string
  text: string
}): Promise<boolean> {
  startCommunityChat()

  const text = input.text.trim().slice(0, MAX_TEXT)
  const name = input.name.trim().slice(0, 40)
  if (!text || !name) {
    lastError = 'Message cannot be empty.'
    return false
  }

  // Simple client-side spam: same text within 2s
  const last = cached[cached.length - 1]
  if (
    last &&
    last.name === name &&
    last.text === text &&
    Date.now() - last.createdAt < 2000
  ) {
    lastError = 'You just sent that — give it a second.'
    return false
  }

  const msg: ChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    location: (input.location || 'Somewhere').trim().slice(0, 60),
    countryCode: (input.countryCode || '').trim().slice(0, 4),
    text,
    createdAt: Date.now(),
    seed: name,
  }

  lastError = null

  // Optimistic: show instantly, dedupe when the server echo arrives
  cached = mergeById([...cached, msg])
  emit()

  // Our own id is the doc id, so the echo carries the same id and mergeById
  // dedupes it automatically. On failure the optimistic copy is dropped,
  // otherwise the next snapshot would re-merge it and it would persist.
  if (!db) {
    return true // no backend configured; local-only mode, as before
  }

  try {
    // createdAt goes to the server, not the client. firestore.rules requires a
    // recent timestamp, and serverTimestamp() is the only value a client can't
    // forge — it stops anyone from future-dating a message to hijack the
    // orderBy('createdAt') feed. Locally we still render with Date.now().
    const { createdAt: _localOnly, ...rest } = msg
    await setDoc(doc(db, COLLECTION, msg.id), {
      ...rest,
      createdAt: serverTimestamp(),
    })
    connected = true
    return true
  } catch {
    connected = false
    cached = cached.filter((m) => m.id !== msg.id)
    emit()
    lastError = 'Message could not be sent — check your connection.'
    return false
  }
}

export function loadChatUser(): ChatUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ChatUser
    if (!parsed?.name) return null
    return parsed
  } catch {
    return null
  }
}

export function saveChatUser(user: ChatUser): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    /* ignore */
  }
}

/** Real geo from IP (same idea as bryllim) — optional auto-fill for location */
export async function detectLocation(
  outerSignal?: AbortSignal,
): Promise<{ location: string; countryCode: string } | null> {
  const ctrl = new AbortController()
  const onOuterAbort = () => ctrl.abort()
  outerSignal?.addEventListener('abort', onOuterAbort, { once: true })

  const to = window.setTimeout(() => ctrl.abort(), 4000)
  try {
    const res = await fetch('https://ipwho.is/', { signal: ctrl.signal })
    if (!res.ok) return null
    return parseGeo(await res.json())
  } catch {
    /* offline / blocked / aborted */
    return null
  } finally {
    window.clearTimeout(to)
    outerSignal?.removeEventListener('abort', onOuterAbort)
  }
}

function parseGeo(raw: unknown): {
  location: string
  countryCode: string
} | null {
  const j = raw as {
    success?: boolean
    city?: string
    region?: string
    country_code?: string
    country?: string
  } | null

  if (!j || j.success === false) return null

  const city = j.city || j.region || ''
  const country = j.country_code || j.country || ''
  const location = [city, country].filter(Boolean).join(', ') || 'Somewhere'
  return {
    location,
    countryCode: (j.country_code || '').toUpperCase(),
  }
}

export function formatAgo(createdAt: number, now = Date.now()): string {
  const minutes = Math.max(0, Math.floor((now - createdAt) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const h = Math.floor(minutes / 60)
  if (h < 48) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return ''
  const cc = countryCode.toUpperCase()
  const A = 0x1f1e6
  const chars = [...cc].map((c) =>
    String.fromCodePoint(A + c.charCodeAt(0) - 65),
  )
  return chars.join('')
}

export function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=e5e5e5`
}

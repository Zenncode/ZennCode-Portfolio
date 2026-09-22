import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
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
    createdAt: Number(data.createdAt ?? Date.now()),
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

/** Start live sync once (shared across component mounts) */
export function startCommunityChat(): void {
  if (started || typeof window === 'undefined') return
  started = true

  if (!db) {
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
        emit()
      },
      () => {
        // Permission denied / offline / no database yet — stay local-only
        connected = false
        emit()
      },
    )
  } catch {
    connected = false
    unsubscribe = null
  }
  emit()
}

export function stopCommunityChat(): void {
  try {
    unsubscribe?.()
  } catch {
    /* ignore */
  }
  unsubscribe = null
  started = false
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

export function postMessage(input: {
  name: string
  location: string
  countryCode?: string
  text: string
}): ChatMessage | null {
  startCommunityChat()

  const text = input.text.trim().slice(0, MAX_TEXT)
  const name = input.name.trim().slice(0, 40)
  if (!text || !name) return null

  // Simple client-side spam: same text within 2s
  const last = cached[cached.length - 1]
  if (
    last &&
    last.name === name &&
    last.text === text &&
    Date.now() - last.createdAt < 2000
  ) {
    return null
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

  // Optimistic: show instantly, dedupe when the server echo arrives
  cached = mergeById([...cached, msg])
  emit()

  // Fire-and-forget write — our own id is the doc id, so the echo
  // carries the same id and mergeById dedupes it automatically.
  if (db) {
    void setDoc(doc(db, COLLECTION, msg.id), { ...msg }).catch(() => {
      connected = false
    })
  }

  return msg
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
export async function detectLocation(): Promise<{
  location: string
  countryCode: string
} | null> {
  try {
    const ctrl = new AbortController()
    const to = window.setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch('https://ipwho.is/', { signal: ctrl.signal })
    window.clearTimeout(to)
    const j = (await res.json()) as {
      success?: boolean
      city?: string
      region?: string
      country_code?: string
      country?: string
    }
    if (j && j.success !== false) {
      const city = j.city || j.region || ''
      const country = j.country_code || j.country || ''
      const location = [city, country].filter(Boolean).join(', ') || 'Somewhere'
      return {
        location,
        countryCode: (j.country_code || '').toUpperCase(),
      }
    }
  } catch {
    /* offline / blocked */
  }
  return null
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

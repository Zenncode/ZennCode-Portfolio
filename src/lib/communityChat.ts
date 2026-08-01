import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

/** Shared room — all visitors on this portfolio see the same live feed */
const ROOM = 'zenncode-portfolio-community-chat-v1'
const WS_URL = 'wss://demos.yjs.dev'
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

let doc: Y.Doc | null = null
let provider: WebsocketProvider | null = null
let yMessages: Y.Array<Y.Map<unknown>> | null = null
const listeners = new Set<Listener>()
let cached: ChatMessage[] = []
let started = false

function toMessage(map: Y.Map<unknown>): ChatMessage | null {
  const id = String(map.get('id') ?? '')
  const name = String(map.get('name') ?? '').trim()
  const text = String(map.get('text') ?? '').trim()
  if (!id || !name || !text) return null
  return {
    id,
    name,
    location: String(map.get('location') ?? 'Somewhere'),
    countryCode: String(map.get('countryCode') ?? ''),
    text: text.slice(0, MAX_TEXT),
    createdAt: Number(map.get('createdAt') ?? Date.now()),
    seed: String(map.get('seed') ?? name),
  }
}

function readAll(): ChatMessage[] {
  if (!yMessages) return []
  const out: ChatMessage[] = []
  yMessages.forEach((item) => {
    if (item instanceof Y.Map) {
      const m = toMessage(item)
      if (m) out.push(m)
    }
  })
  out.sort((a, b) => a.createdAt - b.createdAt)
  return out.slice(-MAX_MESSAGES)
}

function emit() {
  cached = readAll()
  listeners.forEach((fn) => fn(cached))
}

/** Start live sync once (shared across component mounts) */
export function startCommunityChat(): void {
  if (started || typeof window === 'undefined') return
  started = true

  doc = new Y.Doc()
  yMessages = doc.getArray('messages')

  provider = new WebsocketProvider(WS_URL, ROOM, doc, {
    connect: true,
  })

  yMessages.observe(() => emit())
  provider.on('sync', () => emit())
  emit()
}

export function stopCommunityChat(): void {
  // Keep connection for the session — only disconnect on full page unload
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
  return Boolean(provider?.wsconnected)
}

export function postMessage(input: {
  name: string
  location: string
  countryCode?: string
  text: string
}): ChatMessage | null {
  startCommunityChat()
  if (!yMessages || !doc) return null

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

  const map = new Y.Map<unknown>()
  map.set('id', msg.id)
  map.set('name', msg.name)
  map.set('location', msg.location)
  map.set('countryCode', msg.countryCode)
  map.set('text', msg.text)
  map.set('createdAt', msg.createdAt)
  map.set('seed', msg.seed)

  doc.transact(() => {
    yMessages!.push([map])
    // Cap size so the room doesn't grow forever
    while (yMessages!.length > MAX_MESSAGES) {
      yMessages!.delete(0, 1)
    }
  })

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

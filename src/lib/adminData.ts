import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Private read/write helpers for the /admin dashboard. Every read in here is
 * admin-gated in firestore.rules.
 *
 * Visit tracking lives in ./visitors (it is written from the public site, not
 * from the dashboard).
 */

const STATS = 'siteStats'
const MESSAGES = 'communityMessages'

export type DayCount = {
  /** `day-2026-10-09` */
  key: string
  /** `2026-10-09` */
  date: string
  count: number
}

export type StatsSnapshot = {
  total: number
  /** Newest first. */
  days: DayCount[]
  chatMessages: number
}

export type AdminMessage = {
  id: string
  name: string
  text: string
  location: string
  createdAt: number
}

/** `createdAt` is a serverTimestamp on new writes, epoch millis on legacy docs. */
function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  const n = Number(value)
  return Number.isFinite(n) ? n : Date.now()
}

/** Total visits, the per-day series, and the guestbook size. */
export async function loadStats(): Promise<StatsSnapshot> {
  if (!db) return { total: 0, days: [], chatMessages: 0 }
  const [snap, counted] = await Promise.all([
    getDocs(query(collection(db, STATS))),
    getCountFromServer(query(collection(db, MESSAGES))).catch(() => null),
  ])

  let total = 0
  const days: DayCount[] = []
  snap.forEach((d) => {
    const count = Number(d.data().count ?? 0)
    if (d.id === 'total') {
      total = count
      return
    }
    if (d.id.startsWith('day-')) {
      days.push({ key: d.id, date: d.id.slice(4), count })
    }
  })
  days.sort((a, b) => (a.date < b.date ? 1 : -1))

  return { total, days, chatMessages: counted ? counted.data().count : 0 }
}

/** Live tail of the guestbook for moderation. */
export function subscribeMessages(
  fn: (messages: AdminMessage[]) => void,
): Unsubscribe | null {
  if (!db) {
    fn([])
    return null
  }
  return onSnapshot(
    query(collection(db, MESSAGES), orderBy('createdAt', 'desc'), limit(20)),
    (snap) => {
      const rows: AdminMessage[] = []
      snap.forEach((d) => {
        const data = d.data()
        rows.push({
          id: d.id,
          name: String(data.name ?? ''),
          text: String(data.text ?? ''),
          location: String(data.location ?? ''),
          createdAt: toMillis(data.createdAt),
        })
      })
      fn(rows)
    },
    () => fn([]),
  )
}

/** Moderation: remove a guestbook message. Denied by rules for non-owners. */
export async function deleteMessage(id: string): Promise<boolean> {
  if (!db) return false
  try {
    await deleteDoc(doc(db, MESSAGES, id))
    return true
  } catch {
    return false
  }
}

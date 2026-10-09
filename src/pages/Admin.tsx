import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from 'firebase/auth'
import {
  friendlyAuthError,
  isCurrentUserAdmin,
  onAuthChanged,
  signInWithIdentifier,
  signOutAdmin,
} from '../lib/auth'
import {
  deleteMessage,
  loadStats,
  subscribeMessages,
  type AdminMessage,
  type StatsSnapshot,
} from '../lib/adminData'
import { subscribeVisits, type VisitRecord } from '../lib/visitors'
import { flagEmoji, formatAgo } from '../lib/communityChat'

/**
 * /admin — private dashboard.
 *
 * States, in order:
 *   checking   → Firebase hasn't told us who (if anyone) is signed in yet
 *   signed out → login box (username + password)
 *   not owner  → signed in, but not the allowlisted account
 *   owner      → the dashboard
 *
 * The data behind the gate is protected by firestore.rules, not by this UI:
 * anyone can download this page, but the Firestore reads it performs are
 * denied for every account except the owner's.
 */

function Shell({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <p className="font-mono text-[0.75rem] text-[var(--color-dim)] mb-4">
          <Link to="/" className="section-link">
            ← back home
          </Link>
        </p>
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-3 text-[var(--color-ink)]">
          {title}
        </h1>
        <p className="text-[var(--color-muted)] mb-9 max-w-lg text-[0.95rem] leading-relaxed">
          {intro}
        </p>
        {children}
      </div>
    </div>
  )
}

/* ─── Login ─────────────────────────────────────────────────────────────── */

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await signInWithIdentifier(username, password)
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell
      title="admin"
      intro="Private dashboard for the site owner. Sign in to continue — visitors who aren’t the owner can’t go further than this screen."
    >
      <div className="max-w-sm">
        <form onSubmit={runSignIn} className="flex flex-col gap-3" noValidate>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--color-dim)]">
              username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              placeholder="zenncode"
              spellCheck={false}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[0.9rem] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-dim)] focus:border-[var(--color-border-strong)]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--color-dim)]">
              password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[0.9rem] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-dim)] focus:border-[var(--color-border-strong)]"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] px-5 py-2.5 font-mono text-[0.78rem] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {busy ? '…' : 'sign in'}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2.5 text-[0.85rem] text-[var(--color-ink)]">
            {error}
          </p>
        )}

        <p className="mt-6 font-mono text-[0.72rem] text-[var(--color-dim)] leading-relaxed">
          Verified by Firebase Auth — the password is checked server-side and is
          never stored in this site’s code.
        </p>
      </div>
    </Shell>
  )
}

/* ─── Signed in, but not the owner ─────────────────────────────────────── */

function NotAuthorized({ user }: { user: User }) {
  return (
    <Shell
      title="not authorized"
      intro="You’re signed in, but this account isn’t the site owner, so it can’t read the dashboard data. Sign out and use the owner account."
    >
      <div className="max-w-lg flex flex-col gap-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--color-dim)] mb-2">
            signed in as
          </p>
          <p className="text-[0.9rem] text-[var(--color-ink)] break-all">
            {user.email ?? user.uid}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void signOutAdmin()}
          className="self-start rounded-full border border-[var(--color-border)] px-4 py-2 font-mono text-[0.75rem] text-[var(--color-ink)] hover:border-[var(--color-border-strong)] transition-colors"
        >
          sign out
        </button>
      </div>
    </Shell>
  )
}

/* ─── Dashboard pieces ──────────────────────────────────────────────────── */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <p className="font-mono text-[0.66rem] uppercase tracking-wider text-[var(--color-dim)] mb-1.5">
        {label}
      </p>
      <p className="font-mono text-[1.6rem] leading-none text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  )
}

/** Last 14 days of counters, drawn as bars — no chart library needed. */
function DayBars({ days }: { days: StatsSnapshot['days'] }) {
  const recent = useMemo(() => {
    const map = new Map(days.map((d) => [d.date, d.count]))
    const out: { date: string; count: number }[] = []
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const pad = (n: number) => String(n).padStart(2, '0')
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
      out.push({ date: key, count: map.get(key) ?? 0 })
    }
    return out
  }, [days])

  const max = Math.max(1, ...recent.map((d) => d.count))

  return (
    <div>
      <div className="flex items-end gap-1.5">
        {recent.map((d) => (
          <div
            key={d.date}
            className="flex-1 min-w-0 flex flex-col items-center gap-1.5"
          >
            {/* Fixed-height track: a % height inside an auto-height parent
                resolves to 0, so the bar needs something to measure against. */}
            <div className="w-full h-24 flex items-end">
              <div
                className="w-full rounded-sm bg-[var(--color-ink)] opacity-80"
                style={{
                  height: `${Math.max(2, Math.round((d.count / max) * 100))}%`,
                }}
                title={`${d.date}: ${d.count}`}
              />
            </div>
            <span className="font-mono text-[0.6rem] text-[var(--color-dim)]">
              {d.date.slice(8)}
            </span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[0.68rem] text-[var(--color-dim)] mt-3">
        last 14 days · peak {max}
      </p>
    </div>
  )
}

function RowTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[var(--color-dim)] mb-4">
      {children}
    </h2>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="font-mono text-[0.85rem] text-[var(--color-dim)] border border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center">
      {text}
    </p>
  )
}

function Dashboard({ user }: { user: User | null }) {
  const [stats, setStats] = useState<StatsSnapshot | null>(null)
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    void loadStats()
      .then((s) => {
        if (alive) setStats(s)
      })
      .catch(() => {
        /* rules denied or offline — the cards stay at zero */
      })
    const unsubVisits = subscribeVisits((v) => alive && setVisits(v))
    const unsubMsgs = subscribeMessages((m) => alive && setMessages(m))
    return () => {
      alive = false
      unsubVisits?.()
      unsubMsgs?.()
    }
  }, [])

  const today = useMemo(() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const key = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    return stats?.days.find((d) => d.date === key)?.count ?? 0
  }, [stats])

  const last7 = useMemo(() => {
    if (!stats) return 0
    return stats.days
      .filter(
        (d) =>
          Date.now() - new Date(`${d.date}T00:00:00`).getTime() < 7 * 86400000,
      )
      .reduce((sum, d) => sum + d.count, 0)
  }, [stats])

  async function remove(id: string) {
    const ok = await deleteMessage(id)
    setNote(ok ? 'message deleted' : 'could not delete — check your connection')
    if (ok) setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <Shell
      title="admin"
      intro="Private dashboard. Everything here is gated by firestore.rules — anyone else who opens this page sees the login screen instead."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <p className="font-mono text-[0.72rem] text-[var(--color-dim)] break-all">
          {user?.email ?? 'preview'}
        </p>
        <button
          type="button"
          onClick={() => void signOutAdmin()}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 font-mono text-[0.72rem] text-[var(--color-ink)] hover:border-[var(--color-border-strong)] transition-colors"
        >
          sign out
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard label="total visits" value={String(stats?.total ?? 0)} />
        <StatCard label="today" value={String(today)} />
        <StatCard label="last 7 days" value={String(last7)} />
        <StatCard label="chat messages" value={String(stats?.chatMessages ?? 0)} />
      </div>

      <section className="mb-10">
        <RowTitle>visits</RowTitle>
        {stats ? (
          <DayBars days={stats.days} />
        ) : (
          <p className="font-mono text-[0.8rem] text-[var(--color-dim)]">
            loading…
          </p>
        )}
      </section>

      <section className="mb-10">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <RowTitle>recent visitors</RowTitle>
          <Link
            to="/admin/visitors"
            className="font-mono text-[0.7rem] text-[var(--color-ink)] underline underline-offset-2"
          >
            open full table →
          </Link>
        </div>
        {visits.length === 0 ? (
          <Empty text="No visits recorded yet." />
        ) : (
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {visits.slice(0, 6).map((v) => (
              <li
                key={v.id}
                className="flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-2"
              >
                <span className="font-mono text-[0.8rem] text-[var(--color-ink)]">
                  {v.entry}
                </span>
                <span className="font-mono text-[0.72rem] text-[var(--color-dim)] text-right shrink-0">
                  {flagEmoji(v.countryCode) ? `${flagEmoji(v.countryCode)} ` : ''}
                  {[v.city, v.countryCode].filter(Boolean).join(', ') || v.lang}{' '}
                  · {v.device} · {formatAgo(v.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 font-mono text-[0.72rem] text-[var(--color-dim)]">
          link clicks and full detail →{' '}
          <Link to="/admin/visitors" className="underline underline-offset-2">
            /admin/visitors
          </Link>
        </p>
      </section>

      <section>
        <RowTitle>guestbook moderation</RowTitle>
        {messages.length === 0 ? (
          <Empty text="No messages yet." />
        ) : (
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3.5"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-[0.85rem] font-semibold text-[var(--color-ink)]">
                    {m.name}
                    <span className="ml-2 font-mono text-[0.7rem] font-normal text-[var(--color-dim)]">
                      {m.location}
                    </span>
                  </span>
                  <span className="font-mono text-[0.7rem] text-[var(--color-dim)] shrink-0">
                    {formatAgo(m.createdAt)}
                  </span>
                </div>
                <p className="text-[0.88rem] text-[var(--color-muted)] leading-relaxed">
                  {m.text}
                </p>
                <button
                  type="button"
                  onClick={() => void remove(m.id)}
                  className="mt-2 font-mono text-[0.7rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] underline underline-offset-2"
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {note && (
          <p className="mt-3 font-mono text-[0.72rem] text-[var(--color-dim)]">
            {note}
          </p>
        )}
      </section>
    </Shell>
  )
}

/* ─── Gate ──────────────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  // Firebase restores the previous session from IndexedDB, so this resolves
  // before the first paint in practice — "ready" just avoids a login-screen
  // flash for the owner.
  useEffect(
    () =>
      onAuthChanged((u) => {
        setUser(u)
        setReady(true)
        setIsOwner(isCurrentUserAdmin(u))
      }),
    [],
  )

  // Dev-only peek at the dashboard layout so the sections can be reviewed
  // before the Firebase side is set up. `import.meta.env.DEV` is statically
  // `false` in a production build, so this branch is dead code once deployed —
  // and it only skips the UI gate, never the Firestore rules.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const preview = new URLSearchParams(window.location.search).has('preview')
    if (preview) {
      setReady(true)
      setIsOwner(true)
    }
  }, [])

  // Keep the dashboard out of search results and out of the tab title history.
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'admin · ZennCode'
    let tag = document.querySelector('meta[name="robots"]')
    let created = false
    let prevRobots: string | null = null
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'robots')
      document.head.appendChild(tag)
      created = true
    } else {
      prevRobots = tag.getAttribute('content')
    }
    tag.setAttribute('content', 'noindex, nofollow')
    return () => {
      document.title = prevTitle
      if (created) tag?.remove()
      else if (prevRobots !== null) tag?.setAttribute('content', prevRobots)
    }
  }, [])

  if (!ready) {
    return (
      <Shell title="admin" intro="Checking your session…">
        <p className="font-mono text-[0.8rem] text-[var(--color-dim)]">
          loading…
        </p>
      </Shell>
    )
  }

  if (isOwner) return <Dashboard user={user} />
  if (!user) return <AdminLogin />
  return <NotAuthorized user={user} />
}
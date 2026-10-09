import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from 'firebase/auth'
import {
  subscribeClicks,
  tallyClicks,
  type LinkClick,
} from '../lib/links'
import {
  subscribeVisits,
  type DeviceType,
  type VisitRecord,
} from '../lib/visitors'
import { signOutAdmin } from '../lib/auth'
import { flagEmoji, formatAgo } from '../lib/communityChat'

/**
 * /admin/visitors — the "who visited, and what did they click" page.
 *
 * Two tables:
 *   visitors  one row per browser session, with device + location
 *   clicks    one row per link click, joined to its visitor so you can see
 *             WHO clicked WHAT (same device/location as their visit row)
 *
 * The join is on `visitorId`, which both collections store. Nothing is
 * duplicated — the click row borrows the details from the visit row, so a
 * returning visitor shows as one person across all their activity.
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
          <Link to="/admin" className="section-link">
            ← admin
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

function Empty({ text }: { text: string }) {
  return (
    <p className="font-mono text-[0.85rem] text-[var(--color-dim)] border border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center">
      {text}
    </p>
  )
}

function RowTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[var(--color-dim)] mb-4">
      {children}
    </h2>
  )
}

function where(v: VisitRecord | undefined): string {
  if (!v) return '—'
  const place = [v.city, v.countryCode].filter(Boolean).join(', ')
  if (place) return `${flagEmoji(v.countryCode)} ${place}`
  return v.timezone || v.lang || '—'
}

function deviceLine(v: VisitRecord | undefined): string {
  if (!v) return '—'
  return [v.device, v.os, v.browser].filter(Boolean).join(' · ')
}

/** Where the visitor came from: from the click row, or the joined visit. */
function sourceLabel(c: LinkClick, v?: VisitRecord): string {
  if (c.source) return c.source
  return v?.source || v?.referrer || '—'
}

const SOURCES = ['all', 'facebook', 'search', 'direct'] as const
type SourceFilter = (typeof SOURCES)[number]

function matchesSource(label: string, filter: SourceFilter): boolean {
  const s = label.toLowerCase()
  switch (filter) {
    case 'facebook':
      // Anything social-ish, including short labels like `X`.
      return /facebook|instagram|tiktok|threads|twitter|linkedin|youtube|reddit|discord|telegram|social|^x$/.test(
        s,
      )
    case 'search':
      return s === 'search'
    case 'direct':
      return s === '(direct)'
    default:
      return true
  }
}

export default function AdminVisitorsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [clicks, setClicks] = useState<LinkClick[]>([])
  const [filter, setFilter] = useState<'all' | DeviceType>('all')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')

  useEffect(() => {
    const unsubVisits = subscribeVisits(setVisits)
    const unsubClicks = subscribeClicks(setClicks)
    return () => {
      unsubVisits?.()
      unsubClicks?.()
    }
  }, [])

  /** Latest known record for each visitor id, so clicks can look them up. */
  const byVisitor = useMemo(() => {
    const map = new Map<string, VisitRecord>()
    for (const v of visits) {
      const prev = map.get(v.visitorId)
      if (!prev || v.visitCount >= prev.visitCount) map.set(v.visitorId, v)
    }
    return map
  }, [visits])

  const topLinks = useMemo(() => tallyClicks(clicks).slice(0, 8), [clicks])

  const shownVisits = useMemo(
    () => (filter === 'all' ? visits : visits.filter((v) => v.device === filter)),
    [visits, filter],
  )

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of clicks) {
      const label = sourceLabel(c, byVisitor.get(c.visitorId))
      counts[label] = (counts[label] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [clicks, byVisitor])

  const shownClicks = useMemo(
    () =>
      sourceFilter === 'all'
        ? clicks
        : clicks.filter((c) =>
            matchesSource(sourceLabel(c, byVisitor.get(c.visitorId)), sourceFilter),
          ),
    [clicks, byVisitor, sourceFilter],
  )

  const counts = useMemo(() => {
    const c = { mobile: 0, tablet: 0, desktop: 0 }
    for (const v of visits) c[v.device] += 1
    return c
  }, [visits])

  return (
    <Shell
      title="visitors"
      intro="Every browser session, and every link click joined back to the visitor who made it. Newest first."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {(['all', 'mobile', 'tablet', 'desktop'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`chip ${filter === key ? 'chip-invert' : ''}`}
            >
              {key}
              {key !== 'all' ? ` ${counts[key]}` : ''}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void signOutAdmin()}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 font-mono text-[0.72rem] text-[var(--color-ink)] hover:border-[var(--color-border-strong)] transition-colors"
        >
          sign out
        </button>
      </div>

      <section className="mb-12">
        <RowTitle>who clicked what</RowTitle>
        {topLinks.length === 0 ? (
          <Empty text="No link clicks recorded yet." />
        ) : (
          <ul className="flex flex-col gap-2 list-none p-0 m-0 mb-8">
            {topLinks.map((l) => (
              <li
                key={`${l.label}${l.target}`}
                className="flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-2"
              >
                <span className="text-[0.9rem] text-[var(--color-ink)] min-w-0 truncate">
                  {l.label}
                  <span className="ml-2 font-mono text-[0.72rem] text-[var(--color-dim)]">
                    {l.target}
                  </span>
                </span>
                <span className="font-mono text-[0.8rem] text-[var(--color-ink)] shrink-0">
                  {l.count}×
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Where the traffic is coming from, per source. */}
        {sourceCounts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'facebook', 'search', 'direct'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSourceFilter(key)}
                className={`chip ${sourceFilter === key ? 'chip-invert' : ''}`}
              >
                {key === 'facebook' ? 'social' : key}
                {key === 'all' ? ` ${clicks.length}` : ''}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-8">
          {sourceCounts.map(([label, count]) => (
            <span
              key={label}
              className="font-mono text-[0.72rem] text-[var(--color-muted)]"
            >
              {label}
              <span className="ml-1 text-[var(--color-dim)]">{count}×</span>
            </span>
          ))}
        </div>

        {shownClicks.length === 0 ? (
          <Empty
            text={
              clicks.length === 0
                ? 'No clicks recorded yet — they will appear here as they happen.'
                : 'No clicks from that source yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  {['when', 'visitor', 'clicked', 'from'].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[0.66rem] uppercase tracking-wider text-[var(--color-dim)] font-normal pb-2 pr-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shownClicks.map((c) => {
                  const v = byVisitor.get(c.visitorId)
                  return (
                    <tr
                      key={c.id}
                      className="border-t border-[var(--color-border)] align-top"
                    >
                      <td className="py-2 pr-3 font-mono text-[0.72rem] text-[var(--color-dim)] whitespace-nowrap">
                        {formatAgo(c.createdAt)}
                      </td>
                      <td className="py-2 pr-3 min-w-0">
                        <span className="font-mono text-[0.75rem] text-[var(--color-ink)]">
                          {c.visitorId}
                        </span>
                        <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                          {where(v)}
                        </span>
                        <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                          {deviceLine(v)}
                        </span>
                      </td>
                      <td className="py-2 pr-3 min-w-0">
                        <span className="text-[0.85rem] text-[var(--color-ink)]">
                          {c.label}
                        </span>
                        <span className="block font-mono text-[0.7rem] text-[var(--color-dim)]">
                          {c.target}
                        </span>
                      </td>
                      <td className="py-2 pr-3 min-w-0 whitespace-nowrap">
                        <span className="text-[0.82rem] text-[var(--color-ink)]">
                          {sourceLabel(c, v)}
                        </span>
                        <span className="block font-mono text-[0.7rem] text-[var(--color-dim)]">
                          {c.path}
                        </span>
                        <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                          {c.visitCount > 1
                            ? `visit #${c.visitCount}`
                            : 'new visitor'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <RowTitle>visitors</RowTitle>
        {shownVisits.length === 0 ? (
          <Empty text="No visits recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  {['when', 'visitor', 'location', 'device', 'landed on'].map(
                    (h) => (
                      <th
                        key={h}
                        className="font-mono text-[0.66rem] uppercase tracking-wider text-[var(--color-dim)] font-normal pb-2 pr-3"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {shownVisits.map((v) => (
                  <tr
                    key={v.id}
                    className="border-t border-[var(--color-border)] align-top"
                  >
                    <td className="py-2 pr-3 font-mono text-[0.72rem] text-[var(--color-dim)] whitespace-nowrap">
                      {formatAgo(v.createdAt)}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <span className="font-mono text-[0.75rem] text-[var(--color-ink)]">
                        {v.visitorId}
                      </span>
                      <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                        {v.visitCount > 1
                          ? `visit #${v.visitCount}`
                          : 'new visitor'}
                      </span>
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <span className="text-[0.82rem] text-[var(--color-ink)]">
                        {where(v)}
                      </span>
                      <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                        {v.timezone}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <span className="text-[0.82rem] text-[var(--color-ink)]">
                        {v.device}
                      </span>
                      <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                        {[v.os, v.browser].filter(Boolean).join(' · ')}
                      </span>
                      <span className="block font-mono text-[0.68rem] text-[var(--color-dim)]">
                        {v.viewport}
                      </span>
                    </td>
                    <td className="py-2 font-mono text-[0.75rem] text-[var(--color-ink)] whitespace-nowrap">
                      {v.entry}
                      <span className="block text-[0.68rem] text-[var(--color-dim)]">
                        {v.source || v.referrer}
                      </span>
                      <span className="block text-[0.68rem] text-[var(--color-dim)]">
                        {v.referrer === '(direct)' || !v.referrer
                          ? 'no referrer'
                          : v.referrer}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Shell>
  )
}

/** Keeps the owner badge honest if this page is ever rendered standalone. */
export type AdminVisitorsProps = { user?: User | null }

import { useState } from 'react'
import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { projects, type Project } from '../../data/portfolio'

function BracketMarks() {
  return (
    <svg
      viewBox="0 0 13 22"
      fill="currentColor"
      aria-hidden
      className="h-[17px] w-auto shrink-0"
    >
      <path
        d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z"
        transform="translate(8 5) rotate(46)"
      />
      <path
        d="M0 -4.3C2.3 -2.8 2.3 2.8 0 4.3C-2.3 2.8 -2.3 -2.8 0 -4.3Z"
        transform="translate(4.6 11) rotate(14)"
      />
      <path
        d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z"
        transform="translate(8 17) rotate(-30)"
      />
    </svg>
  )
}

type Slot = 'is-left' | 'is-center' | 'is-right'

/**
 * Home “02 — projects” — 3-card deck carousel (bryllim-style).
 * Center card is full; left/right are tilted behind. Click to bring forward.
 */
export default function Projects() {
  const featured = projects.filter((p) => p.featured !== false).slice(0, 3)

  // indices mapped to slots: [left, center, right]
  const [order, setOrder] = useState(() => {
    // center = first project
    if (featured.length === 0) return [] as number[]
    if (featured.length === 1) return [0]
    if (featured.length === 2) return [1, 0]
    return [1, 0, 2] // left, center (featured[0]), right
  })

  function slotFor(index: number): Slot {
    const pos = order.indexOf(index)
    if (pos === 1 || order.length === 1) return 'is-center'
    if (pos === 0) return 'is-left'
    return 'is-right'
  }

  function activate(index: number) {
    const slot = slotFor(index)
    if (slot === 'is-center') return
    setOrder((prev) => {
      if (prev.length < 3) {
        // two cards: swap
        return [...prev].reverse()
      }
      const centerIdx = prev[1]
      if (slot === 'is-left') {
        // left becomes center, old center goes left
        return [centerIdx, index, prev[2]]
      }
      // right becomes center, old center goes right
      return [prev[0], index, centerIdx]
    })
  }

  return (
    <section id="projects" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="02 — projects"
            href="/projects"
            linkLabel="all projects →"
          />
        </FadeIn>

        <FadeIn>
          <div className="project-deck" data-deck>
            {featured.map((p, i) => (
              <DeckCard
                key={p.id}
                project={p}
                slot={slotFor(i)}
                onActivate={() => activate(i)}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function DeckCard({
  project: p,
  slot,
  onActivate,
}: {
  project: Project
  slot: Slot
  onActivate: () => void
}) {
  const isCenter = slot === 'is-center'

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Show ${p.name}`}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate()
        }
      }}
      className={`deck-card ${slot} rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5`}
    >
      {/* Badges */}
      {p.highlights && p.highlights.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {p.highlights.map((h, hi) =>
            hi === 0 ? (
              <span
                key={h}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-bg)]"
              >
                <BracketMarks />
                {h}
                <span className="inline-flex -scale-x-100">
                  <BracketMarks />
                </span>
              </span>
            ) : (
              <span
                key={h}
                className="rounded-full border border-[var(--color-border-strong)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-dim)]"
              >
                {h}
              </span>
            ),
          )}
        </div>
      )}

      {/* Icon + title */}
      <div className="mt-4 flex items-center gap-3.5">
        <div className="h-12 w-12 shrink-0 rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden bg-[var(--color-surface-soft)] grid place-items-center">
          {p.iconImage ? (
            <img
              src={p.iconImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="text-xl text-white w-full h-full grid place-items-center"
              style={{ background: p.accent }}
            >
              {p.icon}
            </span>
          )}
        </div>
        <h3 className="font-mono text-base leading-tight text-[var(--color-ink)]">
          {p.name}
        </h3>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-muted)]">
        {p.description}
      </p>

      {/* Store badges — only interactive on center card (CSS pointer-events) */}
      {p.links && p.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.links.map((l) => {
            if (l.label === 'App Store') {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block h-9 no-underline"
                  onClick={(e) => {
                    if (!isCenter) e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <img
                    src="/apps/app-store.svg"
                    alt="Download on the App Store"
                    className="h-9 w-auto"
                  />
                </a>
              )
            }
            if (l.label === 'Google Play') {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block h-9 no-underline"
                  onClick={(e) => {
                    if (!isCenter) e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <img
                    src="/apps/google-play.png"
                    alt="Get it on Google Play"
                    className="h-9 w-auto"
                  />
                </a>
              )
            }
            return (
              <a
                key={l.label}
                href={l.href}
                className="font-mono text-[0.75rem] text-[var(--color-muted)] no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                {l.label} ↗
              </a>
            )
          })}
        </div>
      )}
    </article>
  )
}

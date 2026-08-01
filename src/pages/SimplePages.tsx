import type { ReactNode } from 'react'
import { site } from '../data/portfolio'

type ShellProps = {
  title: string
  description: string
  children?: ReactNode
}

function Shell({ title, description, children }: ShellProps) {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          {title}
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          {description}
        </p>
        {children}
      </div>
    </div>
  )
}

/** Shop — product card layout like the reference screenshot */
export function ShopPage() {
  return (
    <Shell
      title="shop"
      description="Explore my collection of digital products I've designed and built, ready for instant download."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
        <a
          href="#"
          className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden no-underline shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] transition-all"
        >
          <div className="relative aspect-[4/3] bg-[var(--color-gray-100)] overflow-hidden">
            {/* Resume template mock */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="w-[55%] aspect-[8.5/11] bg-white shadow-md border border-[var(--color-border)] p-2.5 flex flex-col gap-1">
                <div className="h-1.5 w-1/2 bg-[var(--color-ink)] rounded-sm mb-1" />
                <div className="h-1 w-full bg-[var(--color-gray-200)] rounded-sm" />
                <div className="h-1 w-4/5 bg-[var(--color-gray-200)] rounded-sm" />
                <div className="h-1 w-full bg-[var(--color-gray-200)] rounded-sm mt-1" />
                <div className="h-1 w-3/4 bg-[var(--color-gray-200)] rounded-sm" />
                <div className="mt-auto flex gap-0.5">
                  <div className="h-1 flex-1 bg-[var(--color-ink)] rounded-sm" />
                  <div className="h-1 flex-1 bg-[var(--color-gray-300)] rounded-sm" />
                  <div className="h-1 flex-1 bg-[var(--color-gray-300)] rounded-sm" />
                </div>
              </div>
            </div>
            {/* Dot pattern bottom-right of card art */}
            <div
              className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, var(--color-ink) 0.55px, transparent 0.65px)',
                backgroundSize: '6px 6px',
                maskImage:
                  'radial-gradient(ellipse at 100% 100%, black 20%, transparent 75%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse at 100% 100%, black 20%, transparent 75%)',
              }}
              aria-hidden
            />
            <span className="absolute top-3 right-3 text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)]">
              Free
            </span>
            <span className="absolute top-3 left-3 font-mono text-[0.6rem] tracking-wider uppercase text-[var(--color-dim)]">
              Resume template
            </span>
          </div>
          <div className="px-4 py-3.5 border-t border-[var(--color-border)]">
            <p className="font-mono text-[0.62rem] tracking-wider uppercase text-[var(--color-dim)] mb-1">
              Template
            </p>
            <h2 className="text-[0.95rem] font-semibold text-[var(--color-ink)] tracking-tight group-hover:underline underline-offset-2">
              Developer Resume Template
            </h2>
          </div>
        </a>
      </div>
    </Shell>
  )
}

export function GearPage() {
  return (
    <Shell
      title="gear"
      description="Tools, hardware, and setup I use day to day."
    >
      <p className="text-[0.9rem] text-[var(--color-dim)]">
        Coming soon — swap this for your real gear list.
      </p>
    </Shell>
  )
}

export function ResourcesPage() {
  return (
    <Shell
      title="resources"
      description="Guides, templates, and links I recommend."
    >
      <p className="text-[0.9rem] text-[var(--color-dim)]">
        Coming soon — add resource cards here.
      </p>
    </Shell>
  )
}

export function CollabsPage() {
  return (
    <Shell
      title="collabs"
      description="Open to collaborations, guest posts, and community builds."
    >
      <a
        href={`mailto:${site.email}`}
        className="inline-flex font-mono text-[0.85rem] text-[var(--color-ink)] underline underline-offset-2"
      >
        {site.email}
      </a>
    </Shell>
  )
}

export function ConsultingPage() {
  return (
    <Shell
      title="consulting"
      description="Available for select consulting and product work."
    >
      <a
        href={`mailto:${site.email}`}
        className="inline-flex font-mono text-[0.85rem] text-[var(--color-ink)] underline underline-offset-2"
      >
        {site.email}
      </a>
    </Shell>
  )
}

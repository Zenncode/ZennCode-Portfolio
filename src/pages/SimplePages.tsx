import { site } from '../data/portfolio'

type Props = {
  title: string
  description: string
}

function Shell({ title, description }: Props) {
  return (
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-pixel text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          {title}
        </h1>
        <p className="text-[var(--color-muted)] mb-6 max-w-xl text-[0.95rem] leading-relaxed">
          {description}
        </p>
        <p className="text-[0.9rem] text-[var(--color-dim)] leading-relaxed max-w-lg">
          Placeholder page — replace this copy in{' '}
          <code className="font-mono text-[0.85em] text-[var(--color-ink)]">
            src/pages/SimplePages.tsx
          </code>{' '}
          or wire real content later. For work & collabs:{' '}
          <a
            href={`mailto:${site.email}`}
            className="text-[var(--color-ink)] underline underline-offset-2"
          >
            {site.email}
          </a>
        </p>
      </div>
    </div>
  )
}

export function ShopPage() {
  return (
    <Shell
      title="shop"
      description="Products, merch, and digital goods — coming soon."
    />
  )
}

export function GearPage() {
  return (
    <Shell
      title="gear"
      description="Tools, hardware, and setup I use day to day."
    />
  )
}

export function ResourcesPage() {
  return (
    <Shell
      title="resources"
      description="Guides, templates, and links I recommend."
    />
  )
}

export function CollabsPage() {
  return (
    <Shell
      title="collabs"
      description="Open to collaborations, guest posts, and community builds."
    />
  )
}

export function ConsultingPage() {
  return (
    <Shell
      title="consulting"
      description="Available for select consulting and product work."
    />
  )
}

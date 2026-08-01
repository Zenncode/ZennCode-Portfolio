import { site } from '../data/portfolio'

export default function Footer() {
  return (
    <div className="w-full flex justify-center lg:ml-[var(--spacing-sidebar)] lg:w-[calc(100%-var(--spacing-sidebar))]">
      <footer className="w-full border-t border-[var(--color-border)] pt-5 pb-22 sm:pb-8 flex justify-center">
        <div className="container-read flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex gap-4">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[0.7rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline transition-colors"
            >
              github ↗
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[0.7rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline transition-colors"
            >
              linkedin ↗
            </a>
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-[0.7rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline transition-colors"
            >
              email
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

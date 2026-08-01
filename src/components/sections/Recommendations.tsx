import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { recommendations } from '../../data/portfolio'

export default function Recommendations() {
  return (
    <section id="recommendations" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="05 — recommendations"
            href="/recommendations"
            linkLabel="all recommendations →"
          />
        </FadeIn>

        <div className="flex flex-col gap-4">
          {/* Pick DICT + two strong Cambridge/mentor recs like bryllim home order */}
          {(
            [
              recommendations.find((r) => r.initials === 'HA'),
              recommendations.find((r) => r.initials === 'JS'),
              recommendations.find((r) => r.initials === 'CM'),
            ].filter(Boolean) as typeof recommendations
          ).map((r, i, arr) => (
            <FadeIn key={`${r.initials}-${r.name}`} delay={Math.min(i * 0.07, 0.33)}>
              <blockquote className="p-0 border-0">
                <p className="text-[0.95rem] text-[var(--color-muted)] leading-[1.65] mb-4 whitespace-pre-line">
                  {r.quote.length > 320
                    ? `${r.quote.slice(0, 320).trim()}…`
                    : r.quote}
                </p>
                <footer className="flex items-center gap-3">
                  <span
                    className="size-9 rounded-full bg-[var(--color-surface-soft)] border border-[var(--color-border)] grid place-items-center font-mono text-[0.65rem] font-semibold tracking-wider text-[var(--color-muted)] shrink-0"
                    aria-hidden
                  >
                    {r.initials}
                  </span>
                  <div>
                    <cite className="not-italic text-[0.9rem] font-semibold block text-[var(--color-ink)]">
                      {r.name}
                    </cite>
                    <p className="text-[0.8rem] text-[var(--color-dim)] mt-0.5">
                      {r.title}
                    </p>
                  </div>
                </footer>
              </blockquote>
              {i < arr.length - 1 && (
                <div className="mt-4 border-b border-[var(--color-border)]" />
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

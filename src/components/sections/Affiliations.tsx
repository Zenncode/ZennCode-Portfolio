import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { affiliations } from '../../data/portfolio'

export default function Affiliations() {
  return (
    <section id="affiliations" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="06 — affiliations"
            href="/affiliations"
            linkLabel="all affiliations →"
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {affiliations.map((a, i) => (
            <FadeIn key={a.name} delay={Math.min(i * 0.05, 0.33)}>
              <div className="flex items-center gap-3 p-3.5 border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg)] h-full">
                <span className="size-11 grid place-items-center bg-[var(--color-surface-soft)] rounded-[12px] border border-[var(--color-border)] shrink-0 overflow-hidden">
                  {a.logo ? (
                    <img
                      src={a.logo}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="font-bold text-[0.8rem] text-[var(--color-ink)]">
                      {a.emoji}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.9rem] font-semibold text-[var(--color-ink)] leading-snug">
                    {a.initials || a.name}
                  </p>
                  <p className="text-[0.8rem] text-[var(--color-dim)] mt-0.5">
                    {a.role}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

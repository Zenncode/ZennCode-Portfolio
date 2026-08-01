import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { certifications } from '../../data/portfolio'

export default function Certifications() {
  // Home preview — first few only
  const preview = certifications.slice(0, 3)

  return (
    <section id="certifications" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="04 — certifications"
            href="/certifications"
            linkLabel="all certifications →"
          />
        </FadeIn>

        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
          {preview.map((c, i) => (
            <FadeIn key={`${c.name}-${c.issuer}`} delay={Math.min(i * 0.07, 0.33)}>
              <a
                href={c.verify || '#'}
                className="flex sm:flex-col gap-3.5 items-start p-4 border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg)] no-underline hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] transition-all h-full"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={c.logo}
                  alt=""
                  className="size-10 rounded-md border border-[var(--color-border)] bg-white object-contain p-1 shrink-0"
                />
                <div>
                  <h3 className="text-[0.95rem] font-semibold tracking-tight mb-0.5">
                    {c.name}
                  </h3>
                  <p className="text-[0.85rem] text-[var(--color-muted)] mb-2">
                    {c.issuer}
                  </p>
                  <span className="text-[0.85rem] text-[var(--color-dim)] underline underline-offset-2 decoration-[color-mix(in_srgb,currentColor_35%,transparent)]">
                    Verify
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

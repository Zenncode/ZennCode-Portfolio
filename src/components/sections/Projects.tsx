import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { projects } from '../../data/portfolio'

export default function Projects() {
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

        <div className="flex flex-col gap-10">
          {projects.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 0.07, 0.33)}>
              <article>
                {/* Highlight line(s) — e.g. “#1 Finance App” */}
                {p.highlights && p.highlights.length > 0 && (
                  <p className="font-mono text-[0.72rem] text-[var(--color-dim)] mb-3 leading-relaxed">
                    {p.highlights.join(' · ')}
                  </p>
                )}

                <div className="flex gap-4 sm:gap-5 items-start">
                  {/* App icon square */}
                  <div
                    className="size-[72px] sm:size-20 rounded-[18px] grid place-items-center shrink-0 text-white text-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)]"
                    style={{ background: p.accent }}
                    aria-hidden
                  >
                    <span>{p.icon}</span>
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-[1.1rem] font-semibold tracking-tight mb-1.5">
                      {p.name}
                    </h3>
                    <p className="text-[0.92rem] text-[var(--color-muted)] leading-[1.55] mb-3 max-w-[28rem]">
                      {p.description}
                    </p>
                    {p.links && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {p.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            className="font-mono text-[0.78rem] text-[var(--color-muted)] hover:text-[var(--color-ink)] no-underline transition-colors"
                          >
                            {l.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { experience, stack } from '../../data/portfolio'

export default function Experience() {
  return (
    <section id="experience" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="03 — experience"
            href="/experience"
            linkLabel="full history →"
          />
        </FadeIn>

        {/* year | role / company — same as bryllim list */}
        <div className="flex flex-col gap-5 mb-10">
          {experience.map((item, i) => (
            <FadeIn
              key={`${item.year}-${item.role}`}
              delay={Math.min(i * 0.05, 0.33)}
            >
              <div className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[3.75rem_1fr] gap-x-4 sm:gap-x-6 items-baseline">
                <span className="text-[0.92rem] text-[var(--color-dim)] tabular-nums">
                  {item.year}
                </span>
                <div>
                  <p className="text-[0.98rem] font-medium tracking-tight text-[var(--color-ink)]">
                    {item.role}
                  </p>
                  <p className="text-[0.9rem] text-[var(--color-muted)] mt-0.5">
                    {item.company}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h3 className="text-[0.98rem] font-semibold">Stack</h3>
              <Link to="/stack" className="section-link">
                view all →
              </Link>
            </div>
            {/* Inline tech words + “+ more” like the reference */}
            <p className="text-[0.92rem] text-[var(--color-muted)] leading-[1.9]">
              {stack.map((s, i) => (
                <span key={s}>
                  {i > 0 ? ' ' : ''}
                  <span className="whitespace-nowrap">{s}</span>
                </span>
              ))}{' '}
              <Link
                to="/stack"
                className="text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline"
              >
                + more
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

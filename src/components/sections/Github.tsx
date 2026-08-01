import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import {
  buildContributionGrid,
  contributionCount,
  site,
} from '../../data/portfolio'

const grid = buildContributionGrid()

export default function Github() {
  return (
    <section id="github" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="07 — github"
            href={site.socials.github}
            linkLabel={`@${site.socials.githubUser} ↗`}
            external
          />
        </FadeIn>

        <FadeIn>
          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            className="block p-4 border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg)] overflow-x-auto no-underline hover:border-[var(--color-border-strong)] transition-colors"
          >
            <div className="flex gap-[3px] min-w-max mb-3.5" aria-hidden>
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((level, di) => (
                    <span
                      key={di}
                      className={`size-2.5 rounded-[2px] gh-day-${level}`}
                      title={`Level ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="text-[0.88rem] text-[var(--color-muted)]">
              {contributionCount.toLocaleString()} contributions in the last
              year · @{site.socials.githubUser}
            </p>
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

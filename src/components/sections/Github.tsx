import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { site } from '../../data/portfolio'

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
            className="block p-5 border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg)] no-underline hover:border-[var(--color-border-strong)] transition-colors"
          >
            <p className="text-[0.95rem] font-semibold text-[var(--color-ink)] mb-1">
              @{site.socials.githubUser} on GitHub ↗
            </p>
            <p className="text-[0.88rem] text-[var(--color-muted)]">
              See live repositories and contributions on GitHub.
            </p>
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

import { useState } from 'react'
import FadeIn from '../FadeIn'
import {
  communities,
  communityHeadline,
  communitySub,
  founded,
  hackathonHeadline,
  hackathonSub,
  hackathons,
  site,
} from '../../data/portfolio'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const featured = hackathons.find((h) => h.featured)
  const others = hackathons.filter((h) => !h.featured)

  return (
    <>
      <section id="contact" className="w-full pt-14">
        <div className="container-read">
          <FadeIn>
            <p className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)] mb-1.5">
              Get in touch
            </p>
            <h2 className="font-mono text-[clamp(1.6rem,4vw,2.1rem)] font-normal tracking-wide lowercase leading-tight mb-2">
              say hello
            </h2>
            <p className="text-[0.92rem] text-[var(--color-muted)] mb-5 max-w-lg leading-relaxed">
              For work, collabs, or just to say hi — drop me a line.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-between gap-5 min-w-[min(100%,320px)] px-3.5 py-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)] font-mono text-[0.8rem] hover:border-[var(--color-border-strong)] transition-colors"
                onClick={copyEmail}
              >
                <span>{site.email}</span>
                <span className="font-mono text-[0.65rem] tracking-wider uppercase text-[var(--color-dim)]">
                  {copied ? 'Copied' : 'Copy'}
                </span>
              </button>
              <a
                className="font-mono text-[0.78rem] text-[var(--color-muted)] hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[color-mix(in_srgb,currentColor_30%,transparent)] hover:decoration-current"
                href={`mailto:${site.email}`}
              >
                Open mail app
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="w-full pt-14" id="community">
        <div className="container-read">
          <FadeIn>
            <p className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)] mb-1.5">
              Community
            </p>
            <h2 className="font-mono text-[clamp(1.6rem,4vw,2.1rem)] font-normal tracking-wide lowercase leading-tight mb-2">
              {communityHeadline}
            </h2>
            <p className="text-[0.92rem] text-[var(--color-muted)] mb-5 max-w-lg leading-relaxed">
              {communitySub}
            </p>
            <div className="flex flex-col">
              {communities.map((c, i) => (
                <a
                  key={c.name}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-baseline justify-between gap-4 py-2.5 border-b border-[var(--color-border)] text-[0.9rem] no-underline ${
                    i === 0 ? 'border-t' : ''
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="font-mono text-[0.75rem] text-[var(--color-dim)]">
                    {c.handle} ↗
                  </span>
                </a>
              ))}
            </div>
            {founded.length > 0 && (
              <>
                <p className="font-mono text-[0.68rem] tracking-wider uppercase font-medium mt-6 mb-2.5 text-[var(--color-dim)]">
                  Founded
                </p>
                <div className="flex flex-col">
                  {founded.map((f, i) => (
                    <a
                      key={f.name}
                      href={f.href}
                      className={`flex items-baseline justify-between gap-4 py-2.5 border-b border-[var(--color-border)] text-[0.9rem] no-underline ${
                        i === 0 ? 'border-t' : ''
                      }`}
                    >
                      <span>{f.name}</span>
                      <span className="font-mono text-[0.75rem] text-[var(--color-dim)]">
                        {f.detail}
                      </span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </FadeIn>
        </div>
      </section>

      {hackathons.length > 0 && (
        <section className="w-full pt-14" id="hackathons">
          <div className="container-read">
            <FadeIn>
              <p className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)] mb-1.5">
                Hackathons
              </p>
              <h2 className="font-mono text-[clamp(1.6rem,4vw,2.1rem)] font-normal tracking-wide lowercase leading-tight mb-2">
                {hackathonHeadline}
              </h2>
              <p className="text-[0.92rem] text-[var(--color-muted)] mb-5 max-w-lg leading-relaxed">
                {hackathonSub}
              </p>

              {featured && (
                <a href="#" className="card block p-4.5 mb-2 no-underline">
                  <span className="chip-invert">{featured.result}</span>
                  <h3 className="text-[1.05rem] font-semibold tracking-tight my-2">
                    {featured.name}
                  </h3>
                  <span className="section-link">Read feature →</span>
                </a>
              )}

              {others.length > 0 && (
                <>
                  <p className="font-mono text-[0.68rem] tracking-wider uppercase font-medium mt-6 mb-2.5 text-[var(--color-dim)]">
                    Other achievements
                  </p>
                  <div className="flex flex-col">
                    {others.map((h, i) => (
                      <div
                        key={h.name}
                        className={`flex items-baseline justify-between gap-4 py-3.5 border-b border-[var(--color-border)] ${
                          i === 0 ? 'border-t' : ''
                        }`}
                      >
                        <div>
                          <p className="text-[0.9rem] font-medium">{h.name}</p>
                          <p className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)] mt-0.5">
                            {h.org}
                          </p>
                        </div>
                        <span className="font-mono text-[0.72rem] text-[var(--color-muted)] whitespace-nowrap">
                          {h.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </FadeIn>
          </div>
        </section>
      )}
    </>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import { hero, site, stats } from '../../data/portfolio'
import profilePhoto from '../../assets/image/zenn.png'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const reduce = useReducedMotion()
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease },
    },
  }

  return (
    <section
      className="relative w-full pt-10 sm:pt-14 pb-2 overflow-hidden"
      id="top"
    >
      {/* Halftone corner — top right */}
      <div
        className="pointer-events-none absolute -top-4 right-0 w-56 h-56 opacity-[0.3] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-ink) 0.55px, transparent 0.65px)',
          backgroundSize: '10px 10px',
          maskImage:
            'radial-gradient(ellipse 90% 90% at 100% 0%, black 0%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 90% at 100% 0%, black 0%, transparent 72%)',
        }}
        aria-hidden
      />

      <div className="container-read relative z-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: reduce ? 0 : 0.07,
                delayChildren: reduce ? 0 : 0.05,
              },
            },
          }}
        >
          {/* Photo left · text right (bryllim layout) */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-10 lg:gap-12">
            <motion.div
              className="shrink-0 w-[min(100%,220px)] sm:w-[200px] md:w-[240px] mx-auto sm:mx-0"
              variants={item}
            >
              <div
                className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 72%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to bottom, black 72%, transparent 100%)',
                }}
              >
                <img
                  src={profilePhoto}
                  alt={site.name}
                  width={240}
                  height={240}
                  className="absolute inset-0 size-full object-cover object-top grayscale contrast-[1.08]"
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay dark:opacity-25"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #000 0.55px, transparent 0.65px)',
                    backgroundSize: '3.25px 3.25px',
                  }}
                  aria-hidden
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, var(--color-bg) 0.75px, transparent 0.85px)',
                    backgroundSize: '4px 4px',
                    maskImage:
                      'linear-gradient(to top, black 10%, transparent 95%)',
                    WebkitMaskImage:
                      'linear-gradient(to top, black 10%, transparent 95%)',
                  }}
                  aria-hidden
                />
              </div>
            </motion.div>

            <motion.div className="flex-1 min-w-0 sm:pt-1" variants={item}>
              <h1 className="font-sans text-[clamp(2.25rem,6vw,3rem)] font-semibold tracking-tight leading-none mb-5">
                {site.name}
              </h1>
              <p className="text-[0.98rem] text-[var(--color-muted)] leading-[1.7] max-w-[28rem] mb-4">
                {hero.p1}
              </p>
              <p className="text-[0.98rem] text-[var(--color-muted)] leading-[1.7] max-w-[28rem] mb-6">
                {hero.p2}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {(
                  [
                    ['github', site.socials.github],
                    ['linkedin', site.socials.linkedin],
                    ['instagram', site.socials.instagram],
                  ] as const
                ).map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[0.78rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline transition-colors"
                  >
                    {label} ↗
                  </a>
                ))}
                <a
                  href={`mailto:${site.email}`}
                  className="font-mono text-[0.78rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline transition-colors"
                >
                  email
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stats — 4 cells, hairline dividers (value + 2-line label) */}
          <motion.div
            className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 border-t border-b border-[var(--color-border)]"
            variants={item}
          >
            {stats.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                className={[
                  'group flex flex-col gap-1 px-3 sm:px-4 py-5 no-underline hover:bg-[var(--color-surface-soft)] transition-colors',
                  i < stats.length - 1
                    ? 'sm:border-r sm:border-[var(--color-border)]'
                    : '',
                  i % 2 === 0
                    ? 'border-r border-[var(--color-border)]'
                    : '',
                  i < 2
                    ? 'border-b border-[var(--color-border)] sm:border-b-0'
                    : '',
                ].join(' ')}
              >
                <span className="font-sans text-[1.4rem] sm:text-[1.55rem] font-semibold tracking-tight leading-none inline-flex items-start gap-1">
                  {s.value}
                  <span className="text-[0.65rem] font-normal text-[var(--color-dim)] mt-0.5 opacity-60 group-hover:opacity-100">
                    ↗
                  </span>
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-dim)] leading-snug">
                  {s.label}
                  <br />
                  {s.sub}
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(100%,36rem)] h-14 opacity-[0.25] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-ink) 0.5px, transparent 0.6px)',
          backgroundSize: '10px 10px',
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, black 0%, transparent 100%)',
        }}
        aria-hidden
      />
    </section>
  )
}

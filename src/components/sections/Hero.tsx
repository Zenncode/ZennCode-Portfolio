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
    <section className="relative w-full pt-10 sm:pt-14 pb-0 overflow-hidden" id="top">
      {/* Soft dots — top right only (not over stats) */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[min(50vw,22rem)] h-56 opacity-[0.28] dark:opacity-[0.15] z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-ink) 0.6px, transparent 0.7px)',
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
          {/* Photo left · text right */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-10 lg:gap-14">
            <motion.div
              className="shrink-0 w-[min(100%,280px)] sm:w-[260px] md:w-[300px] lg:w-[320px] mx-auto sm:mx-0"
              variants={item}
            >
              {/* Larger portrait cutout + dots on person only */}
              <div className="relative w-full max-w-[320px] mx-auto sm:mx-0">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to bottom, #000 72%, transparent 100%)',
                    maskImage:
                      'linear-gradient(to bottom, #000 72%, transparent 100%)',
                  }}
                >
                  <img
                    src={profilePhoto}
                    alt={site.name}
                    width={320}
                    height={400}
                    className="block w-full h-auto select-none"
                    style={{
                      filter: 'grayscale(1) contrast(1.1)',
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.5] mix-blend-multiply dark:opacity-40 dark:mix-blend-soft-light"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, #000 0.55px, transparent 0.65px)',
                      backgroundSize: '2.8px 2.8px',
                      WebkitMaskImage: `url(${profilePhoto})`,
                      maskImage: `url(${profilePhoto})`,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="flex-1 min-w-0 sm:pt-2" variants={item}>
              <h1 className="font-mono text-[clamp(2.4rem,6vw,3.25rem)] font-normal tracking-tight leading-none lowercase mb-6 text-[var(--color-ink)]">
                {site.name}
              </h1>
              <p className="text-[0.95rem] text-[var(--color-muted)] leading-[1.7] max-w-[26rem] mb-4">
                {hero.p1}
              </p>
              <p className="text-[0.95rem] text-[var(--color-muted)] leading-[1.7] max-w-[26rem] mb-7">
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

          {/* Stats — clean 4-col hairlines, single uppercase label (no dots over this) */}
          <motion.div
            className="relative z-10 mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 border-t border-b border-[var(--color-border)] bg-[var(--color-bg)]"
            variants={item}
          >
            {stats.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                className={[
                  'group flex flex-col gap-2 px-3 sm:px-4 py-6 no-underline hover:bg-[var(--color-surface-soft)] transition-colors',
                  i < stats.length - 1
                    ? 'sm:border-r sm:border-[var(--color-border)]'
                    : '',
                  i % 2 === 0 ? 'border-r border-[var(--color-border)]' : '',
                  i < 2
                    ? 'border-b border-[var(--color-border)] sm:border-b-0'
                    : '',
                ].join(' ')}
              >
                <span className="font-sans text-[1.45rem] sm:text-[1.6rem] font-semibold tracking-tight leading-none inline-flex items-start gap-1 text-[var(--color-ink)]">
                  {s.value}
                  <span className="text-[0.65rem] font-normal text-[var(--color-dim)] mt-0.5 opacity-50 group-hover:opacity-100">
                    ↗
                  </span>
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-[var(--color-dim)]">
                  {s.label}
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Dots BELOW stats only (reference: under the grid, not through it) */}
      <div
        className="pointer-events-none relative z-0 w-full h-10 mt-0 opacity-[0.3] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-ink) 0.55px, transparent 0.65px)',
          backgroundSize: '10px 10px',
          maskImage:
            'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
        aria-hidden
      />
    </section>
  )
}

import { useState, type CSSProperties } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  affiliations,
  blogPosts,
  certifications,
  experienceFull,
  otherProjects,
  projects,
  recommendations,
  stackGroups,
} from '../data/portfolio'

/** Match bryllim: ~5 posts per page → 1 / 2 for ten posts */
const BLOG_PAGE_SIZE = 5

export function BlogPage() {
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<'list' | 'grid'>('list')
  const totalPages = Math.max(1, Math.ceil(blogPosts.length / BLOG_PAGE_SIZE))
  const rawPage = Number(params.get('page') || '1')
  const page = Number.isFinite(rawPage)
    ? Math.min(Math.max(1, Math.floor(rawPage)), totalPages)
    : 1
  const start = (page - 1) * BLOG_PAGE_SIZE
  const pagePosts = blogPosts.slice(start, start + BLOG_PAGE_SIZE)

  function goPage(next: number) {
    const p = Math.min(Math.max(1, next), totalPages)
    if (p <= 1) setParams({})
    else setParams({ page: String(p) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-shell">
      <div className="container-read relative z-10 max-w-[48rem]! w-full">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
              blog
            </h1>
            <p className="text-[var(--color-muted)] mb-8 max-w-lg text-[0.95rem] leading-relaxed">
              Thoughts, tutorials, and notes on AI, engineering, and building
              things.
            </p>
          </div>
          {blogPosts.length > 0 && (
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] shrink-0 mt-1">
              <button
                type="button"
                title="List view"
                onClick={() => setView('list')}
                className={`size-8 grid place-items-center rounded-md transition-colors ${
                  view === 'list'
                    ? 'bg-[var(--color-bg)] text-[var(--color-ink)] shadow-sm'
                    : 'text-[var(--color-dim)] hover:text-[var(--color-ink)]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                title="Grid view"
                onClick={() => setView('grid')}
                className={`size-8 grid place-items-center rounded-md transition-colors ${
                  view === 'grid'
                    ? 'bg-[var(--color-bg)] text-[var(--color-ink)] shadow-sm'
                    : 'text-[var(--color-dim)] hover:text-[var(--color-ink)]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {blogPosts.length === 0 ? (
          <p className="font-mono text-[0.85rem] text-[var(--color-dim)] border border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center">
            No posts yet.
          </p>
        ) : view === 'list' ? (
          <div className="flex flex-col">
            {pagePosts.map((post, i) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className={[
                  'group flex gap-5 py-6 no-underline border-t border-[var(--color-border)] items-start',
                  i === pagePosts.length - 1 ? 'border-b' : '',
                ].join(' ')}
              >
                {post.cover && (
                  <div className="w-[5.5rem] h-[4.5rem] sm:w-[8.5rem] sm:h-[5.75rem] rounded-xl overflow-hidden shrink-0 border border-[var(--color-border)] bg-[var(--color-gray-100)]">
                    <img
                      src={post.cover}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <time className="font-mono text-[0.72rem] text-[var(--color-dim)]">
                    {post.date}
                  </time>
                  <h2 className="text-[1.02rem] sm:text-[1.08rem] font-semibold tracking-tight mt-1.5 mb-1.5 leading-snug text-[var(--color-ink)] group-hover:underline underline-offset-[3px] decoration-[color-mix(in_srgb,currentColor_35%,transparent)]">
                    {post.title}
                  </h2>
                  <p className="text-[0.9rem] text-[var(--color-muted)] leading-[1.6] mb-2.5 max-w-[36rem]">
                    {post.excerpt}
                  </p>
                  <span className="font-mono text-[0.72rem] text-[var(--color-dim)]">
                    Read
                    <span className="mx-1.5 opacity-50">·</span>
                    {post.readMinutes} min
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {pagePosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col no-underline"
              >
                {post.cover && (
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-gray-100)] mb-3.5">
                    <img
                      src={post.cover}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <time className="font-mono text-[0.68rem] text-[var(--color-dim)]">
                  {post.date}
                </time>
                <h2 className="text-[0.98rem] font-semibold tracking-tight mt-1.5 mb-1.5 leading-snug text-[var(--color-ink)] group-hover:underline underline-offset-2">
                  {post.title}
                </h2>
                {/* bryllim hides excerpt in grid view */}
                <span className="font-mono text-[0.68rem] text-[var(--color-dim)] mt-auto">
                  Read · {post.readMinutes} min
                </span>
              </Link>
            ))}
          </div>
        )}

        {blogPosts.length > 0 && totalPages > 1 && (
          <nav
            className="flex items-center justify-between gap-4 mt-10 pt-2 font-mono text-[0.78rem] text-[var(--color-dim)]"
            aria-label="Blog pagination"
          >
            <button
              type="button"
              onClick={() => goPage(page - 1)}
              disabled={page <= 1}
              className="hover:text-[var(--color-ink)] disabled:opacity-35 disabled:hover:text-[var(--color-dim)] transition-colors"
            >
              ← prev
            </button>
            <span className="tabular-nums text-[var(--color-muted)]">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages}
              className="hover:text-[var(--color-ink)] disabled:opacity-35 disabled:hover:text-[var(--color-dim)] transition-colors"
            >
              next →
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="w-full pt-8">
        <div className="container-read">
          <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] lowercase mb-3">
            not found
          </h1>
          <Link to="/blog" className="section-link">
            ← back to blog
          </Link>
        </div>
      </div>
    )
  }

  const paragraphs = [post.excerpt, post.body].filter(Boolean) as string[]

  return (
    <article className="page-shell">
      <div className="container-read relative z-10 max-w-[40rem]!">
        <Link
          to="/blog"
          className="font-mono text-[0.75rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline transition-colors"
        >
          ← all posts
        </Link>
        <h1 className="text-[clamp(1.5rem,3.5vw,2.1rem)] font-semibold tracking-tight leading-snug mt-5 mb-3 text-[var(--color-ink)]">
          {post.title}
        </h1>
        <time className="font-mono text-[0.72rem] text-[var(--color-dim)]">
          {post.date}
          <span className="mx-1.5 opacity-50">·</span>
          {post.readMinutes} min read
        </time>
        {post.cover && (
          <div className="mt-6 rounded-xl overflow-hidden border border-[var(--color-border)] aspect-[16/9] bg-[var(--color-gray-100)]">
            <img
              src={post.cover}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="prose mt-8">
          {paragraphs.map((p) =>
            p.split(/\n\n+/).map((block, i) => (
              <p key={`${post.slug}-${i}`}>{block}</p>
            )),
          )}
        </div>
      </div>
    </article>
  )
}

export function ProjectsPage() {
  const featured = projects.filter((p) => p.featured !== false)

  return (
    <div className="page-shell">
      <div className="container-read relative z-10 max-w-[42rem]!">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          projects
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          Personal builds and work products grounded in my GitHub — public
          repos link out; private work shows as name + blurb only.
        </p>

        {/* Featured app cards — ss/image copy 5.png */}
        <div className="flex flex-col gap-5 mb-14">
          {featured.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <div className="size-14 sm:size-16 rounded-[16px] overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-soft)] grid place-items-center">
                  {p.iconImage ? (
                    <img
                      src={p.iconImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-2xl text-white w-full h-full grid place-items-center"
                      style={{ background: p.accent }}
                    >
                      {p.icon}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {p.highlights?.map((h, i) =>
                    i === 0 ? (
                      <span
                        key={h}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-bg)]"
                      >
                        <CertVerifyMarks />
                        {h}
                        <span className="inline-flex -scale-x-100">
                          <CertVerifyMarks />
                        </span>
                      </span>
                    ) : (
                      <span
                        key={h}
                        className="rounded-full border border-[var(--color-border-strong)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-dim)]"
                      >
                        {h}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <h2 className="text-[1.15rem] font-semibold tracking-tight mb-1.5 text-[var(--color-ink)]">
                {p.name}
              </h2>
              <p className="text-[0.92rem] text-[var(--color-muted)] leading-snug mb-4 max-w-[32rem]">
                {p.description}
              </p>

              {p.links && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center h-10 px-3 rounded-lg bg-[#0a0a0a] text-white no-underline text-[0.72rem] font-medium hover:opacity-90 transition-opacity"
                    >
                      {l.label === 'App Store' && (
                        <img
                          src="/apps/app-store.svg"
                          alt="Download on the App Store"
                          className="h-7 w-auto"
                        />
                      )}
                      {l.label === 'Google Play' && (
                        <img
                          src="/apps/google-play.png"
                          alt="Get it on Google Play"
                          className="h-7 w-auto"
                        />
                      )}
                      {l.label !== 'App Store' && l.label !== 'Google Play' && (
                        <span>{l.label} ↗</span>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {p.press && p.press.length > 0 && (
                <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-[0.62rem] tracking-wider uppercase text-[var(--color-dim)]">
                    Featured in
                  </span>
                  {p.press.map((pr) => (
                    <a
                      key={pr.label}
                      href={pr.href}
                      className="font-mono text-[0.75rem] text-[var(--color-muted)] hover:text-[var(--color-ink)] no-underline"
                    >
                      {pr.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <p className="font-mono text-[0.68rem] tracking-wider uppercase font-medium mb-3 text-[var(--color-dim)]">
          More work
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherProjects.map((p) => {
            const cardClass =
              'block p-4.5 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-bg)] no-underline hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] transition-all'
            const body = (
              <>
                <p className="font-mono text-[0.62rem] tracking-wider uppercase text-[var(--color-dim)] mb-1.5">
                  {p.category}
                  {!p.href ? ' · Private' : ''}
                </p>
                <h3 className="text-[0.98rem] font-semibold tracking-tight mb-1.5 text-[var(--color-ink)]">
                  {p.name}
                </h3>
                <p className="text-[0.85rem] text-[var(--color-muted)] leading-snug">
                  {p.description}
                </p>
              </>
            )
            return p.href ? (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className={cardClass}
              >
                {body}
              </a>
            ) : (
              <div key={p.name} className={cardClass}>
                {body}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ExperiencePage() {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          experience
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-xl text-[0.95rem] leading-relaxed">
          Full-stack work at Uzaro Solutions Tech Inc., plus independent
          products under Zenn / ZennTech — flood systems, AI tools, and web
          platforms.
        </p>
        {/* Timeline — ss/image copy 6.png */}
        <div className="relative pl-0">
          {experienceFull.map((co, ci) => (
            <article key={co.company} className="relative flex gap-4 sm:gap-5 pb-10 last:pb-0">
              {/* Vertical line */}
              {ci < experienceFull.length - 1 && (
                <div
                  className="absolute left-[20px] sm:left-[21px] top-11 bottom-0 w-px bg-[var(--color-border)]"
                  aria-hidden
                />
              )}
              <div className="size-[42px] rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] grid place-items-center font-mono text-[0.7rem] font-semibold shrink-0 text-[var(--color-ink)] z-10 shadow-sm">
                {co.initials}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h2 className="text-[1.05rem] font-semibold tracking-tight text-[var(--color-ink)]">
                  {co.company}
                </h2>
                <p className="font-mono text-[0.72rem] text-[var(--color-dim)] mt-0.5">
                  {co.type}
                </p>
                {co.location && (
                  <p className="font-mono text-[0.7rem] text-[var(--color-dim)] mt-0.5">
                    {co.location}
                  </p>
                )}
                {co.roles.map((role) => (
                  <div
                    key={`${co.company}-${role.title}-${role.range}`}
                    className="mt-5"
                  >
                    <h3 className="text-[0.98rem] font-semibold text-[var(--color-ink)]">
                      {role.title}
                    </h3>
                    <p className="font-mono text-[0.68rem] tracking-wide uppercase text-[var(--color-dim)] my-1.5">
                      {role.range}
                    </p>
                    <ul className="flex flex-col gap-2.5 mb-3">
                      {role.bullets.map((b) => (
                        <li
                          key={b.slice(0, 48)}
                          className="text-[0.9rem] text-[var(--color-muted)] leading-relaxed"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5">
                      {role.skills.slice(0, 3).map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                      {role.skills.length > 3 && (
                        <span className="chip">
                          +{role.skills.length - 3} skills
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StackPage() {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          tech stack
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          The tools, frameworks, and platforms I reach for — across the front
          end, back end, infrastructure, and AI.
        </p>
        {stackGroups.map((g) => (
          <div key={g.title} className="mb-9">
            <h2 className="font-mono text-[0.78rem] tracking-[0.1em] uppercase text-[var(--color-dim)] mb-3.5">
              {g.title}
            </h2>
            <div className="flex flex-wrap gap-x-2.5 gap-y-2">
              {g.items.map((item) => (
                <span
                  key={item}
                  className="font-mono text-[0.8rem] px-2.5 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Decorative brackets beside “Verify” (bryllim style) */
function CertVerifyMarks() {
  return (
    <svg
      viewBox="0 0 13 22"
      fill="currentColor"
      aria-hidden
      className="h-[14px] w-auto shrink-0"
    >
      <path
        d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z"
        transform="translate(8 5) rotate(46)"
      />
      <path
        d="M0 -4.3C2.3 -2.8 2.3 2.8 0 4.3C-2.3 2.8 -2.3 -2.8 0 -4.3Z"
        transform="translate(4.6 11) rotate(14)"
      />
      <path
        d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z"
        transform="translate(8 17) rotate(-30)"
      />
    </svg>
  )
}

export function CertificationsPage() {
  const groups = [...new Set(certifications.map((c) => c.group))]

  return (
    <div className="page-shell">
      <div className="w-full max-w-[52rem] mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          certifications
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          Credentials across AI, cloud, engineering, and project management —
          each verifiable at its source.
        </p>
        {certifications.length === 0 && (
          <p className="font-mono text-[0.85rem] text-[var(--color-dim)] border border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center">
            No certifications listed yet.
          </p>
        )}
        {groups.map((group) => (
          <div key={group} className="mb-12">
            <h2 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[var(--color-dim)] mb-5">
              {group}
            </h2>
            {/* Polaroid-style cards — matches bryllim.com/certifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5">
              {certifications
                .filter((c) => c.group === group)
                .map((c) => (
                  <a
                    key={`${c.group}-${c.name}-${c.issuer}`}
                    href={c.verify || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-card group relative -m-1.5 flex flex-col items-center rounded-xl bg-gradient-to-b from-[var(--color-surface-soft)] to-[var(--color-bg)] px-3.5 py-5 text-center no-underline"
                    style={
                      {
                        ['--rot' as string]: `${c.rot ?? 0}deg`,
                        ['--ty' as string]: `${c.ty ?? 0}px`,
                      } as CSSProperties
                    }
                  >
                    {/* Inner border frame */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-[6px] rounded-lg border border-[var(--color-border)] group-hover:border-[var(--color-border-strong)] transition-colors"
                    />

                    <img
                      src={c.logo}
                      alt=""
                      className="relative h-9 w-9 rounded-md border border-[var(--color-border)] bg-white object-contain p-1"
                    />
                    <h3 className="relative mt-3 text-[13px] font-semibold leading-snug text-[var(--color-ink)] px-1">
                      {c.name}
                    </h3>
                    <p className="relative mt-1 font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-dim)]">
                      {c.issuer}
                    </p>

                    <div className="relative mt-auto flex items-center gap-1.5 pt-3 text-[var(--color-dim)] group-hover:text-[var(--color-ink)] transition-colors">
                      <CertVerifyMarks />
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em]">
                        Verify
                      </span>
                      <span className="inline-flex -scale-x-100">
                        <CertVerifyMarks />
                      </span>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RecommendationsPage() {
  return (
    <div className="page-shell">
      <div className="w-full max-w-[56rem] mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          recommendations
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          What leaders, teammates, and mentors say about working with me —
          straight from LinkedIn.
        </p>
        {recommendations.length === 0 && (
          <p className="font-mono text-[0.85rem] text-[var(--color-dim)] border border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center">
            No recommendations listed yet.
          </p>
        )}
        {/* 3-col cards — ss/image copy 9.png */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {recommendations.map((r) => (
            <blockquote
              key={`${r.initials}-${r.name}`}
              className="break-inside-avoid mb-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-[var(--shadow-card)]"
            >
              <div
                className="font-serif text-[1.75rem] leading-none text-[var(--color-dim)] opacity-40 mb-2"
                aria-hidden
              >
                ”
              </div>
              <div className="text-[0.9rem] text-[var(--color-muted)] leading-relaxed mb-4 whitespace-pre-line">
                {r.quote}
              </div>
              <footer className="flex items-start gap-2.5 pt-3 border-t border-[var(--color-border)]">
                <span className="size-9 rounded-full bg-[var(--color-surface-soft)] border border-[var(--color-border)] grid place-items-center font-mono text-[0.65rem] font-semibold tracking-wider text-[var(--color-muted)] shrink-0">
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <cite className="not-italic text-[0.88rem] font-semibold block text-[var(--color-ink)]">
                    {r.name}
                  </cite>
                  <p className="text-[0.75rem] text-[var(--color-dim)] mt-0.5 leading-snug">
                    {r.title}
                  </p>
                  {r.date && (
                    <p className="font-mono text-[0.65rem] text-[var(--color-dim)] mt-1">
                      {r.date}
                    </p>
                  )}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AffiliationsPage() {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          affiliations
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          Associations and communities I&apos;m part of — and the ones I&apos;ve
          helped build.
        </p>
        {/* Large cards with role badge — ss/image copy 10.png */}
        <div className="flex flex-col gap-4">
          {affiliations.map((a) => (
            <div
              key={a.name}
              className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex gap-4 items-start relative z-10">
                <span className="size-14 grid place-items-center bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border)] shrink-0 overflow-hidden">
                  {a.logo ? (
                    <img
                      src={a.logo}
                      alt=""
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <span className="font-bold text-[0.85rem] text-[var(--color-ink)]">
                      {a.emoji}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-flex items-center font-mono text-[0.6rem] tracking-wider uppercase px-2 py-0.5 rounded-full mb-2 ${
                      a.role.toLowerCase() === 'founder'
                        ? 'bg-[var(--color-ink)] text-[var(--color-bg)]'
                        : 'bg-[var(--color-surface-soft)] text-[var(--color-dim)] border border-[var(--color-border)]'
                    }`}
                  >
                    {a.role.toLowerCase() === 'founder' ? '★ Founder' : a.role}
                  </span>
                  <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--color-ink)] mb-1.5">
                    {a.name}
                  </p>
                  {a.description && (
                    <p className="text-[0.9rem] text-[var(--color-muted)] leading-relaxed mb-2.5 max-w-lg">
                      {a.description}
                    </p>
                  )}
                  {a.href && (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[0.78rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] no-underline"
                    >
                      {a.hrefLabel || a.href} ↗
                    </a>
                  )}
                </div>
              </div>
              {/* Watermark initials */}
              <span
                className="pointer-events-none absolute right-4 bottom-2 font-mono text-[4rem] font-bold text-[var(--color-border)] opacity-40 select-none leading-none"
                aria-hidden
              >
                {a.initials || a.name.slice(0, 3).toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
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

export function BlogPage() {
  return (
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          blog
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          Notes on building products, shipping software, and learning in public.
        </p>
        <div className="flex flex-col gap-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="card block overflow-hidden no-underline"
            >
              {post.cover && (
                <div className="aspect-video bg-[var(--color-gray-100)] overflow-hidden border-b border-[var(--color-border)]">
                  <img
                    src={post.cover}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4.5">
                <time className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)]">
                  {post.date}
                </time>
                <h2 className="text-[1.05rem] font-semibold tracking-tight mt-2 mb-1.5 leading-snug">
                  {post.title}
                </h2>
                <p className="text-[0.88rem] text-[var(--color-muted)] leading-snug mb-2.5">
                  {post.excerpt}
                </p>
                <span className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)]">
                  Read · {post.readMinutes} min
                </span>
              </div>
            </Link>
          ))}
        </div>
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

  return (
    <article className="w-full pt-8">
      <div className="container-read">
        <Link to="/blog" className="section-link">
          ← all posts
        </Link>
        <h1 className="font-mono text-[clamp(1.75rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mt-5 mb-3">
          {post.title}
        </h1>
        <time className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)]">
          {post.date} · {post.readMinutes} min read
        </time>
        {post.cover && (
          <div className="mt-6 aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]">
            <img src={post.cover} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="prose-blog mt-7">
          <p>{post.excerpt}</p>
          {post.body && <p>{post.body}</p>}
          <p>
            Replace this placeholder with your full post content in{' '}
            <code className="font-mono text-[0.9em] text-[var(--color-ink)]">
              src/data/portfolio.ts
            </code>
            .
          </p>
        </div>
      </div>
    </article>
  )
}

export function ProjectsPage() {
  const featured = projects.filter((p) => p.featured !== false)

  return (
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          projects
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          Products and platforms I&apos;ve designed and shipped — apps, tools, and
          experiments.
        </p>

        <div className="flex flex-col gap-10">
          {featured.map((p) => (
            <article key={p.id}>
              {p.highlights && p.highlights.length > 0 && (
                <p className="font-mono text-[0.72rem] text-[var(--color-dim)] mb-3">
                  {p.highlights.join(' · ')}
                </p>
              )}
              <div className="flex gap-4 sm:gap-5 items-start">
                <div
                  className="size-[72px] sm:size-20 rounded-[18px] grid place-items-center shrink-0 text-white text-2xl border border-[var(--color-border)]"
                  style={{ background: p.accent }}
                >
                  <span>{p.icon}</span>
                </div>
                <div>
                  <h2 className="text-[1.1rem] font-semibold tracking-tight mb-1.5">
                    {p.name}
                  </h2>
                  <p className="text-[0.92rem] text-[var(--color-muted)] leading-snug mb-3">
                    {p.description}
                  </p>
                  {p.links && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          className="font-mono text-[0.78rem] text-[var(--color-muted)] hover:text-[var(--color-ink)] no-underline"
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="font-mono text-[0.68rem] tracking-wider uppercase font-medium mt-10 mb-2.5 text-[var(--color-dim)]">
          More work
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherProjects.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="block p-4.5 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-bg)] no-underline hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] transition-all"
            >
              <p className="font-mono text-[0.62rem] tracking-wider uppercase text-[var(--color-dim)] mb-1.5">
                {p.category}
              </p>
              <h3 className="text-[0.98rem] font-semibold tracking-tight mb-1.5">
                {p.name}
              </h3>
              <p className="text-[0.85rem] text-[var(--color-muted)] leading-snug">
                {p.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ExperiencePage() {
  return (
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          experience
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          Building across full-stack development — from products for startups to
          polished client work.
        </p>
        {experienceFull.map((co) => (
          <article
            key={co.company}
            className="py-6 border-t border-[var(--color-border)] last:border-b"
          >
            <div className="flex gap-3.5 items-start mb-4">
              <div className="size-[42px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] grid place-items-center font-mono text-[0.7rem] font-semibold shrink-0">
                {co.initials}
              </div>
              <div>
                <h2 className="text-[1.05rem] font-semibold tracking-tight">
                  {co.company}
                </h2>
                <p className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)] mt-0.5">
                  {co.type}
                  {co.location ? ` · ${co.location}` : ''} · {co.duration}
                </p>
              </div>
            </div>
            {co.roles.map((role) => (
              <div
                key={role.title}
                className="pt-3.5 border-t border-[var(--color-border)]"
              >
                <h3 className="text-[0.95rem] font-semibold">{role.title}</h3>
                <p className="font-mono text-[0.7rem] text-[var(--color-dim)] my-1">
                  {role.range}
                </p>
                <ul className="flex flex-col gap-1.5 mb-2.5">
                  {role.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-[0.88rem] text-[var(--color-muted)] leading-snug pl-3.5 relative before:content-['–'] before:absolute before:left-0 before:text-[var(--color-dim)]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  )
}

export function StackPage() {
  return (
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          stack
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          The tools, frameworks, and platforms I reach for — across the front end,
          back end, infrastructure, and AI.
        </p>
        {stackGroups.map((g) => (
          <div key={g.title} className="mb-8">
            <h2 className="font-mono text-[0.85rem] tracking-wide lowercase text-[var(--color-dim)] mb-3.5">
              {g.title}
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[0.9rem] text-[var(--color-muted)]">
              {g.items.map((item) => (
                <span key={item} className="whitespace-nowrap">
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

export function CertificationsPage() {
  const groups = [...new Set(certifications.map((c) => c.group))]

  return (
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          certifications
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          Credentials across engineering, cloud, and design — each verifiable at
          its source.
        </p>
        {groups.map((group) => (
          <div key={group} className="mb-8">
            <h2 className="font-mono text-[0.85rem] tracking-wide lowercase text-[var(--color-dim)] mb-3.5">
              {group}
            </h2>
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
              {certifications
                .filter((c) => c.group === group)
                .map((c) => (
                  <a
                    key={c.name}
                    href={c.verify || '#'}
                    className="card flex sm:flex-col gap-3.5 items-start p-4 no-underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className="size-10 rounded-[10px] grid place-items-center text-white font-bold text-[0.95rem] shrink-0"
                      style={{ background: c.color }}
                    >
                      {c.letter}
                    </div>
                    <div>
                      <h3 className="text-[0.92rem] font-semibold tracking-tight mb-0.5">
                        {c.name}
                      </h3>
                      <p className="text-[0.82rem] text-[var(--color-muted)] mb-1.5">
                        {c.issuer}
                      </p>
                      <span className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--color-dim)] underline underline-offset-2">
                        Verify
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
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          recommendations
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          Kind words from people I&apos;ve worked with.
        </p>
        <div className="flex flex-col gap-3.5">
          {recommendations.map((r) => (
            <blockquote key={r.name} className="card p-4.5">
              <p className="text-[0.92rem] text-[var(--color-muted)] leading-relaxed mb-4">
                {r.quote}
              </p>
              <footer className="flex items-center gap-2.5">
                <span className="size-9 rounded-full bg-[var(--color-surface-soft)] border border-[var(--color-border)] grid place-items-center font-mono text-[0.65rem] font-semibold tracking-wider text-[var(--color-muted)] shrink-0">
                  {r.initials}
                </span>
                <div>
                  <cite className="not-italic text-[0.88rem] font-semibold block">
                    {r.name}
                  </cite>
                  <p className="text-[0.78rem] text-[var(--color-dim)] mt-0.5">
                    {r.title}
                  </p>
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
    <div className="w-full pt-8">
      <div className="container-read">
        <h1 className="font-mono text-[clamp(2rem,5vw,2.75rem)] font-normal tracking-wide leading-none lowercase mb-3">
          affiliations
        </h1>
        <p className="text-[var(--color-muted)] mb-8 max-w-xl text-[0.95rem] leading-relaxed">
          Communities and organizations I&apos;m part of.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {affiliations.map((a) => (
            <div key={a.name} className="card flex items-center gap-3 p-3.5">
              <span className="text-[1.25rem] size-10 grid place-items-center bg-[var(--color-surface-soft)] rounded-[10px] border border-[var(--color-border)] shrink-0">
                {a.emoji}
              </span>
              <div>
                <p className="text-[0.88rem] font-semibold">{a.name}</p>
                <p className="font-mono text-[0.65rem] tracking-wider uppercase text-[var(--color-dim)] mt-0.5">
                  {a.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

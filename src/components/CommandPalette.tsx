import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogPosts, projects, site } from '../data/portfolio'

type Item = {
  id: string
  label: string
  hint?: string
  group: string
  action: () => void
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo<Item[]>(() => {
    const go = (path: string) => () => {
      navigate(path)
      onClose()
    }
    const hash = (id: string) => () => {
      navigate('/')
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      onClose()
    }

    const base: Item[] = [
      { id: 'home', label: site.name, group: 'Pages', action: go('/') },
      { id: 'blog', label: 'Blog', group: 'Pages', action: go('/blog') },
      {
        id: 'projects',
        label: 'Projects',
        group: 'Pages',
        action: go('/projects'),
      },
      {
        id: 'experience',
        label: 'Experience',
        group: 'Pages',
        action: go('/experience'),
      },
      { id: 'stack', label: 'Stack', group: 'Pages', action: go('/stack') },
      {
        id: 'certs',
        label: 'Certifications',
        group: 'Pages',
        action: go('/certifications'),
      },
      {
        id: 'recs',
        label: 'Recommendations',
        group: 'Pages',
        action: go('/recommendations'),
      },
      {
        id: 'aff',
        label: 'Affiliations',
        group: 'Pages',
        action: go('/affiliations'),
      },
      {
        id: 'email',
        label: `Email ${site.email}`,
        group: 'Actions',
        action: () => {
          window.location.href = `mailto:${site.email}`
          onClose()
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        group: 'Actions',
        action: () => {
          window.open(site.socials.github, '_blank')
          onClose()
        },
      },
      {
        id: 'sec-blog',
        label: 'Jump to Blog',
        group: 'On this page',
        action: hash('blog'),
      },
      {
        id: 'sec-projects',
        label: 'Jump to Projects',
        group: 'On this page',
        action: hash('projects'),
      },
      {
        id: 'sec-contact',
        label: 'Jump to Contact',
        group: 'On this page',
        action: hash('contact'),
      },
    ]

    blogPosts.forEach((p) => {
      base.push({
        id: `post-${p.slug}`,
        label: p.title,
        hint: p.date,
        group: 'Posts',
        action: go(`/blog/${p.slug}`),
      })
    })

    projects.forEach((p) => {
      base.push({
        id: `proj-${p.id}`,
        label: p.name,
        hint: p.highlights?.[0],
        group: 'Projects',
        action: go('/projects'),
      })
    })

    return base
  }, [navigate, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q) ||
        (i.hint?.toLowerCase().includes(q) ?? false),
    )
  }, [items, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const t = window.setTimeout(() => inputRef.current?.focus(), 10)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, Math.max(filtered.length - 1, 0)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      }
      if (e.key === 'Enter' && filtered[active]) {
        e.preventDefault()
        filtered[active].action()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, filtered, active])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-start justify-center pt-[14vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_30%,transparent)] backdrop-blur-sm cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] overflow-hidden animate-[cmd-in_0.2s_var(--ease-out-expo)]">
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--color-border)]">
          <span className="text-[var(--color-dim)] text-[0.95rem]" aria-hidden>
            ⌕
          </span>
          <input
            ref={inputRef}
            className="flex-1 border-0 outline-none bg-transparent font-mono text-[0.85rem] text-[var(--color-ink)] placeholder:text-[var(--color-dim)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="what do you want to ask?"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="font-mono text-[0.62rem] tracking-wider uppercase text-[var(--color-dim)] border border-[var(--color-border)] rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        <div className="max-h-[min(50vh,360px)] overflow-auto p-1.5">
          {filtered.length === 0 && (
            <p className="px-3 py-5 text-[var(--color-dim)] font-mono text-[0.8rem]">
              No results for “{query}”
            </p>
          )}
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-[var(--radius-sm)] transition-colors ${
                i === active
                  ? 'bg-[var(--color-ink)] text-[var(--color-bg)]'
                  : 'hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]'
              }`}
              onMouseEnter={() => setActive(i)}
              onClick={() => item.action()}
            >
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[0.88rem] font-medium truncate">
                  {item.label}
                </span>
                <span
                  className={`font-mono text-[0.62rem] tracking-wider uppercase ${
                    i === active
                      ? 'text-[color-mix(in_srgb,var(--color-bg)_65%,transparent)]'
                      : 'text-[var(--color-dim)]'
                  }`}
                >
                  {item.group}
                </span>
              </span>
              {item.hint && (
                <span
                  className={`font-mono text-[0.68rem] shrink-0 ${
                    i === active
                      ? 'text-[color-mix(in_srgb,var(--color-bg)_65%,transparent)]'
                      : 'text-[var(--color-dim)]'
                  }`}
                >
                  {item.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes cmd-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

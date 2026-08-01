import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogPosts, projects, site } from '../data/portfolio'
import OverlayBackButton from './OverlayBackButton'

/**
 * Ask Anything — full-screen minimal UI (bryllim-style)
 * Large centered: "what do you want to ask?" + typeahead results
 */

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
      { id: 'shop', label: 'Shop', group: 'Pages', action: go('/shop') },
      { id: 'blog', label: 'Blog', group: 'Pages', action: go('/blog') },
      { id: 'gear', label: 'Gear', group: 'Pages', action: go('/gear') },
      {
        id: 'resources',
        label: 'Resources',
        group: 'Pages',
        action: go('/resources'),
      },
      { id: 'collabs', label: 'Collabs', group: 'Pages', action: go('/collabs') },
      {
        id: 'consulting',
        label: 'Consulting',
        group: 'Pages',
        action: go('/consulting'),
      },
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
        id: 'linkedin',
        label: 'Open LinkedIn',
        group: 'Actions',
        action: () => {
          window.open(site.socials.linkedin, '_blank')
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
    if (!q) return []
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
    const t = window.setTimeout(() => inputRef.current?.focus(), 20)
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-bg)] px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Ask anything"
    >
      <OverlayBackButton onClick={onClose} />

      <div className="w-full max-w-xl flex flex-col items-start">
        {/* Big prompt like the reference */}
        <label
          htmlFor="ask-input"
          className="font-mono text-[clamp(1.35rem,4vw,1.85rem)] text-[var(--color-ink)] tracking-tight mb-4 select-none"
        >
          what do you want to ask?
        </label>

        {/* Invisible-looking input under the question */}
        <input
          id="ask-input"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none font-mono text-[1.05rem] text-[var(--color-ink)] caret-[var(--color-ink)] placeholder:text-[var(--color-dim)]"
          placeholder=""
          autoComplete="off"
          spellCheck={false}
          aria-label="Ask anything"
        />

        {/* Cursor line when empty (visual) */}
        {!query && (
          <span
            className="block w-px h-5 bg-[var(--color-ink)] mt-1 animate-pulse"
            aria-hidden
          />
        )}

        {/* Results only after typing */}
        {query.trim() && (
          <div className="w-full mt-8 max-h-[40vh] overflow-auto">
            {filtered.length === 0 ? (
              <p className="font-mono text-[0.85rem] text-[var(--color-dim)]">
                No results for “{query}”
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {filtered.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => item.action()}
                      className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-lg font-mono transition-colors ${
                        i === active
                          ? 'bg-[var(--color-surface-soft)] text-[var(--color-ink)]'
                          : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      <span className="truncate text-[0.9rem]">{item.label}</span>
                      <span className="text-[0.65rem] tracking-wider uppercase text-[var(--color-dim)] shrink-0">
                        {item.group}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

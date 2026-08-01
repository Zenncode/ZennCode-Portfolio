import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/portfolio'

/**
 * Matches bryllim.com left rail:
 * Name
 * Shop · Blog · Gear · Resources
 * Collabs · Consulting
 * Projects · Experience · Stack · Certifications · Recommendations · Affiliations
 * Ask anything  Alt+K
 * Typing test   Alt+J
 */
const NAV_GROUPS: { to: string; label: string }[][] = [
  [
    { to: '/shop', label: 'Shop' },
    { to: '/blog', label: 'Blog' },
    { to: '/gear', label: 'Gear' },
    { to: '/resources', label: 'Resources' },
  ],
  [
    { to: '/collabs', label: 'Collabs' },
    { to: '/consulting', label: 'Consulting' },
  ],
  [
    { to: '/projects', label: 'Projects' },
    { to: '/experience', label: 'Experience' },
    { to: '/stack', label: 'Stack' },
    { to: '/certifications', label: 'Certifications' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/affiliations', label: 'Affiliations' },
  ],
]

type Props = {
  onOpenCommand: () => void
  onOpenTyping: () => void
}

function modLabel() {
  if (typeof navigator === 'undefined') return 'Alt'
  return /Mac|iPhone|iPad/.test(navigator.platform) ? '⌥' : 'Alt'
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-1.5 w-full px-0 py-[0.4rem] font-mono text-[0.8125rem] leading-none no-underline transition-colors',
    isActive
      ? 'text-[var(--color-ink)] font-medium'
      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]',
  ].join(' ')
}

function ShortcutRow({
  label,
  keys,
  onClick,
}: {
  label: string
  keys: string[]
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-2 w-full text-left px-0 py-1.5 text-[0.8125rem] font-mono text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
    >
      <span>{label}</span>
      <span className="inline-flex items-center gap-0.5 text-[var(--color-dim)] shrink-0">
        {keys.map((k, i) => (
          <span key={`${k}-${i}`} className="inline-flex items-center gap-0.5">
            {i > 0 && <span className="text-[0.6rem]">+</span>}
            <kbd className="font-mono text-[0.6rem] px-1 py-0.5 border border-[var(--color-border)] rounded-[4px] bg-[var(--color-surface-soft)]">
              {k}
            </kbd>
          </span>
        ))}
      </span>
    </button>
  )
}

export default function SidebarNav({ onOpenCommand, onOpenTyping }: Props) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const mod = modLabel()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const scrollColumn = (
    <div className="sidebar-scroll h-full overflow-y-auto overflow-x-hidden overscroll-contain px-4 lg:px-[1.1rem] py-5 lg:py-7">
      {/* Name → home */}
      <Link
        to="/"
        className="block font-sans font-semibold text-[0.95rem] tracking-tight no-underline mb-5 text-[var(--color-ink)]"
        onClick={() => setOpen(false)}
      >
        {site.name}
      </Link>

      {/* Tab menus */}
      <nav aria-label="Primary" className="flex flex-col">
        {NAV_GROUPS.map((group, gi) => (
          <div
            key={gi}
            className={
              gi === 0
                ? 'flex flex-col'
                : 'mt-3 pt-3 border-t border-[var(--color-border)] flex flex-col'
            }
          >
            {group.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="text-[0.7rem] leading-none" aria-hidden>
                        →
                      </span>
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Ask anything + Typing test */}
      <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex flex-col gap-0.5">
        <ShortcutRow
          label="Ask anything"
          keys={[mod, 'K']}
          onClick={() => {
            setOpen(false)
            onOpenCommand()
          }}
        />
        <ShortcutRow
          label="Typing test"
          keys={[mod, 'J']}
          onClick={() => {
            setOpen(false)
            onOpenTyping()
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <header className="sticky top-0 z-50 h-[var(--spacing-nav)] flex items-center justify-between px-4 bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md border-b border-[var(--color-border)] lg:hidden">
        <Link
          to="/"
          className="font-semibold text-[0.95rem] tracking-tight no-underline"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="size-9 grid place-items-center text-[var(--color-muted)] rounded-lg"
            onClick={onOpenCommand}
            aria-label="Ask anything"
          >
            ⌕
          </button>
          <button
            type="button"
            className="size-9 grid place-items-center rounded-lg"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex flex-col gap-[5px]">
              <span
                className={`block w-4 h-[1.5px] bg-[var(--color-ink)] transition-transform origin-center ${
                  open ? 'translate-y-[3.25px] rotate-45' : ''
                }`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-[var(--color-ink)] transition-transform origin-center ${
                  open ? '-translate-y-[3.25px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 bottom-0 top-[var(--spacing-nav)] z-[45] bg-[var(--color-bg)] transition-opacity duration-200 lg:hidden ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {scrollColumn}
      </div>

      <aside
        className="hidden lg:block fixed top-0 left-0 bottom-0 z-40 w-[var(--spacing-sidebar)] h-dvh border-r border-[var(--color-border)] bg-[var(--color-bg)]"
        aria-label="Site"
      >
        {scrollColumn}
      </aside>
    </>
  )
}

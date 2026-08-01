import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/portfolio'
import { useTheme } from '../hooks/useTheme'
import NavActiveArrow from './NavActiveArrow'
import {
  IconBag,
  IconBooks,
  IconBriefcase,
  IconChat,
  IconDesktop,
  IconDoc,
  IconLaptop,
  IconMail,
  IconMoon,
  IconMute,
  IconPeople,
  IconSun,
} from './navIcons'

type NavItem = {
  to: string
  label: string
  icon?: ReactNode
}

const NAV_GROUPS: NavItem[][] = [
  [
    { to: '/shop', label: 'Shop', icon: <IconBag /> },
    { to: '/blog', label: 'Blog', icon: <IconDoc /> },
    { to: '/gear', label: 'Gear', icon: <IconLaptop /> },
    { to: '/resources', label: 'Resources', icon: <IconBooks /> },
  ],
  [
    { to: '/collabs', label: 'Collabs', icon: <IconPeople /> },
    { to: '/consulting', label: 'Consulting', icon: <IconBriefcase /> },
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

function ShortcutButton({
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
      className="flex items-center justify-between gap-2 w-full text-left py-1 text-[0.8rem] text-[var(--color-dim)] hover:text-[var(--color-ink)] transition-colors"
    >
      <span>{label}</span>
      <span className="inline-flex items-center gap-0.5 shrink-0">
        {keys.map((k, i) => (
          <span key={`${k}-${i}`} className="inline-flex items-center gap-0.5">
            {i > 0 && <span className="text-[0.6rem] opacity-60">+</span>}
            <kbd className="font-mono text-[0.6rem] px-1.5 py-0.5 border border-[var(--color-border)] rounded-md bg-[var(--color-bg)] text-[var(--color-muted)]">
              {k}
            </kbd>
          </span>
        ))}
      </span>
    </button>
  )
}

function ThemeIconBtn({
  children,
  active,
  onClick,
  title,
}: {
  children: ReactNode
  active: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`size-8 grid place-items-center rounded-full transition-colors ${
        active
          ? 'bg-[var(--color-bg)] text-[var(--color-ink)] shadow-sm border border-[var(--color-border)]'
          : 'text-[var(--color-dim)] hover:text-[var(--color-ink)]'
      }`}
    >
      {children}
    </button>
  )
}

export default function SidebarNav({ onOpenCommand, onOpenTyping }: Props) {
  const [open, setOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [viewers, setViewers] = useState(32)
  const [delta, setDelta] = useState(29)
  const { preference, setPreference } = useTheme()
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

  useEffect(() => {
    const id = window.setInterval(() => {
      setViewers((v) =>
        Math.max(8, Math.min(48, v + (Math.random() > 0.5 ? 1 : -1))),
      )
      setDelta((d) =>
        Math.max(5, Math.min(40, d + (Math.random() > 0.5 ? 1 : -1))),
      )
    }, 7000)
    return () => window.clearInterval(id)
  }, [])

  const avatars = ['Marcus', 'Alex', 'Sam']

  const shell = (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg)]">
      <div className="shrink-0 px-4 lg:px-5 pt-5 lg:pt-6 pb-3">
        <Link
          to="/"
          className="block font-sans font-semibold text-[0.95rem] tracking-tight no-underline text-[var(--color-ink)] border-0 outline-none shadow-none"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>
      </div>

      <nav
        aria-label="Primary"
        className="sidebar-tabs flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 lg:px-4"
      >
        {NAV_GROUPS.map((group, gi) => (
          <div
            key={gi}
            className={
              gi === 0
                ? 'pb-2'
                : 'pt-2 pb-2 border-t border-[var(--color-border)]'
            }
          >
            {group.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    /* Layout: [→] [icon] Label  — arrow is own component */
                    'flex items-center gap-2 w-full px-1 py-[0.42rem] text-[0.875rem] no-underline transition-colors bg-transparent',
                    isActive
                      ? 'text-[var(--color-ink)] font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Spacer keeps inactive rows aligned; arrow only when active */}
                    <span className="w-3.5 shrink-0 flex items-center justify-center">
                      {isActive ? <NavActiveArrow /> : null}
                    </span>
                    {item.icon ? (
                      <span className="size-4 shrink-0 opacity-70 grid place-items-center">
                        {item.icon}
                      </span>
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden />
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="shrink-0 px-4 lg:px-5 pt-3 pb-5 border-t border-[var(--color-border)] space-y-3">
        <div className="flex flex-col gap-0.5">
          <ShortcutButton
            label="Ask anything"
            keys={[mod, 'K']}
            onClick={() => {
              setOpen(false)
              onOpenCommand()
            }}
          />
          <ShortcutButton
            label="Typing test"
            keys={[mod, 'J']}
            onClick={() => {
              setOpen(false)
              onOpenTyping()
            }}
          />
        </div>

        <div className="pt-2 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex">
                {avatars.map((seed, i) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&radius=50&backgroundColor=f1f1f1`}
                    alt=""
                    className={`size-6 rounded-full border-2 border-[var(--color-bg)] ${i > 0 ? '-ml-2' : ''}`}
                  />
                ))}
              </div>
              <span className="text-[0.7rem] font-medium text-[var(--color-muted)] bg-[var(--color-surface-soft)] border border-[var(--color-border)] rounded-full px-1.5 py-0.5">
                +{delta}
              </span>
            </div>
            <p className="text-[0.8rem] text-[var(--color-ink)]">
              <strong className="font-semibold tabular-nums">{viewers}</strong>{' '}
              people viewing now
            </p>
            <p className="flex items-center gap-1.5 text-[0.78rem] text-[var(--color-muted)] mt-0.5">
              <IconChat />
              community chat
            </p>
          </button>

          {chatOpen && (
            <div className="mt-2 p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[0.75rem] text-[var(--color-dim)] leading-relaxed">
              For work, collabs & everything else, reach me at{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-[var(--color-ink)] underline underline-offset-2 break-all"
              >
                {site.email}
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] w-fit mx-auto">
          <ThemeIconBtn
            active={preference === 'system'}
            title="System"
            onClick={() => setPreference('system')}
          >
            <IconDesktop />
          </ThemeIconBtn>
          <ThemeIconBtn
            active={preference === 'light'}
            title="Light"
            onClick={() => setPreference('light')}
          >
            <IconSun />
          </ThemeIconBtn>
          <ThemeIconBtn
            active={preference === 'dark'}
            title="Dark"
            onClick={() => setPreference('dark')}
          >
            <IconMoon />
          </ThemeIconBtn>
          <ThemeIconBtn
            active={false}
            title="Mute (coming soon)"
            onClick={() => {}}
          >
            <IconMute />
          </ThemeIconBtn>
        </div>

        <div className="pt-1 text-[0.75rem] text-[var(--color-dim)] leading-relaxed">
          <p className="mb-1.5">
            For work, collabs & everything else, reach me at
          </p>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 text-[var(--color-ink)] no-underline hover:underline underline-offset-2 break-all"
          >
            <IconMail />
            {site.email}
          </a>
        </div>
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
            className="size-9 grid place-items-center text-[var(--color-muted)]"
            onClick={onOpenCommand}
            aria-label="Ask anything"
          >
            ⌕
          </button>
          <button
            type="button"
            className="size-9 grid place-items-center"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex flex-col gap-[5px]">
              <span
                className={`block w-4 h-[1.5px] bg-[var(--color-ink)] transition-transform ${
                  open ? 'translate-y-[3.25px] rotate-45' : ''
                }`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-[var(--color-ink)] transition-transform ${
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
        {shell}
      </div>

      <aside
        className="hidden lg:block fixed top-0 left-0 bottom-0 z-40 w-[var(--spacing-sidebar)] h-dvh border-r border-[var(--color-border)] bg-[var(--color-bg)]"
        aria-label="Site"
      >
        {shell}
      </aside>
    </>
  )
}

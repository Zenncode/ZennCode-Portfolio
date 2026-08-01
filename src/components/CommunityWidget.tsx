import { useEffect, useState, type FormEvent } from 'react'
import { site } from '../data/portfolio'

const avatars = ['Marcus', 'Alex', 'Sam', 'Jordan', 'Leo']

/**
 * Floating presence + community chat — same UX as bryllim.com
 * +26 · 29 people viewing now · community chat
 * For work, collabs & everything else, reach me at email
 */
export default function CommunityWidget() {
  const [viewers, setViewers] = useState(29)
  const [delta, setDelta] = useState(26)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alex', text: 'Love the portfolio 🔥' },
    { id: 2, user: 'Sam', text: 'What stack is this built with?' },
  ])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const tick = () => {
      setViewers((v) => {
        const next = v + (Math.random() > 0.5 ? 1 : -1)
        return Math.max(8, Math.min(48, next))
      })
      setDelta((d) =>
        Math.max(5, Math.min(40, d + (Math.random() > 0.5 ? 1 : -1))),
      )
    }
    const id = window.setInterval(tick, 7000)
    return () => window.clearInterval(id)
  }, [])

  function send(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: Date.now(), user: 'You', text }])
    setDraft('')
  }

  return (
    <div className="fixed right-3 bottom-3 z-40 w-[min(calc(100vw-1.5rem),300px)] sm:right-4 sm:bottom-4 lg:right-5 lg:bottom-5">
      {open && (
        <div className="mb-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[14px] shadow-[var(--shadow-card)] overflow-hidden flex flex-col max-h-[380px]">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--color-border)]">
            <span className="font-mono text-[0.65rem] tracking-wider uppercase text-[var(--color-dim)]">
              community chat
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[var(--color-dim)] text-[0.85rem] px-1 leading-none"
            >
              ✕
            </button>
          </div>

          {/* Exact copy pattern from bryllim */}
          <div className="px-3.5 py-3 border-b border-[var(--color-border)] text-[0.8rem] text-[var(--color-dim)] leading-relaxed">
            <p className="mb-1.5">
              For work, collabs & everything else, reach me at
            </p>
            <a
              href={`mailto:${site.email}`}
              className="text-[var(--color-ink)] underline underline-offset-2 break-all"
            >
              {site.email}
            </a>
          </div>

          <div className="flex-1 overflow-auto px-3.5 py-2.5 flex flex-col gap-2.5 min-h-[90px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className="text-[0.8rem] text-[var(--color-muted)] flex flex-col gap-0.5"
              >
                <span className="font-mono font-medium text-[var(--color-ink)] text-[0.65rem] tracking-wider uppercase">
                  {m.user}
                </span>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <form
            className="flex gap-1.5 p-2.5 border-t border-[var(--color-border)]"
            onSubmit={send}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Say something…"
              maxLength={200}
              className="flex-1 border border-[var(--color-border)] bg-[var(--color-surface-soft)] rounded-[var(--radius-xs)] px-2.5 py-1.5 font-mono text-[0.75rem] text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
            />
            <button
              type="submit"
              className="font-mono text-[0.65rem] tracking-wider uppercase px-2.5 py-1.5 rounded-[var(--radius-xs)] bg-[var(--color-ink)] text-[var(--color-bg)]"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Collapsed pill — +26 · 29 people viewing now · community chat */}
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[14px] shadow-[var(--shadow-card)] text-left hover:border-[var(--color-border-strong)] hover:-translate-y-px transition-all"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex shrink-0">
          {avatars.slice(0, 3).map((seed, i) => (
            <img
              key={seed}
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&radius=50&backgroundColor=f1f1f1`}
              alt=""
              className={`size-[26px] rounded-full border-[1.5px] border-[var(--color-bg)] bg-[var(--color-gray-100)] ${
                i > 0 ? '-ml-1.5' : ''
              }`}
            />
          ))}
        </div>
        <div className="flex flex-col min-w-0 leading-snug">
          <span className="text-[0.78rem] text-[var(--color-muted)]">
            <span className="font-mono text-[0.7rem] text-[var(--color-dim)]">
              +{delta}
            </span>{' '}
            <strong className="text-[var(--color-ink)] font-semibold tabular-nums">
              {viewers}
            </strong>{' '}
            people viewing now
          </span>
          <span className="font-mono text-[0.6rem] tracking-wider uppercase text-[var(--color-dim)]">
            community chat
          </span>
        </div>
      </button>
    </div>
  )
}

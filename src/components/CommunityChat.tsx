import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import OverlayBackButton from './OverlayBackButton'
import ChatPlayground from './ChatPlayground'
import {
  avatarUrl,
  detectLocation,
  flagEmoji,
  formatAgo,
  loadChatUser,
  postMessage,
  saveChatUser,
  startCommunityChat,
  subscribeMessages,
  type ChatMessage,
} from '../lib/communityChat'
import { unlockGameSfx } from '../lib/gameSfx'

type Props = {
  open: boolean
  onClose: () => void
}

type Step = 'name' | 'location' | 'message'

/**
 * Full-screen community chat (ss/image copy.png)
 * Left: live messages · after join: "chatting as X" + compose
 * Right: WASD playground with your name + others
 */
export default function CommunityChat({ open, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [now, setNow] = useState(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const joined = step === 'message' && Boolean(name.trim())

  const otherNames = useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (let i = messages.length - 1; i >= 0 && out.length < 5; i--) {
      const n = messages[i].name.trim()
      if (!n || n === name || seen.has(n)) continue
      seen.add(n)
      out.push(n)
    }
    return out
  }, [messages, name])

  useEffect(() => {
    startCommunityChat()
    return subscribeMessages(setMessages)
  }, [])

  useEffect(() => {
    if (!open) return
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [open])

  useEffect(() => {
    if (open) {
      setShown(true)
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const t = window.setTimeout(() => setShown(false), 280)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [open, step])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, open])

  useEffect(() => {
    if (!open) return
    const saved = loadChatUser()
    if (saved?.name) {
      setName(saved.name)
      setLocation(saved.location || '')
      setCountryCode(saved.countryCode || '')
      setStep('message')
      return
    }
    void detectLocation().then((geo) => {
      if (!geo) return
      setLocation((prev) => prev || geo.location)
      setCountryCode((prev) => prev || geo.countryCode)
    })
  }, [open])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    // Unlock game audio while we still have a user gesture
    void unlockGameSfx()

    if (step === 'name') {
      const n = (draft.trim() || name.trim()).slice(0, 40)
      if (!n) return
      setName(n)
      setDraft('')
      setStep('location')
      return
    }
    if (step === 'location') {
      const loc = (draft.trim() || location.trim() || 'Somewhere').slice(0, 60)
      setLocation(loc)
      setDraft('')
      setStep('message')
      saveChatUser({ name, location: loc, countryCode })
      // Confirm unlock when playground appears
      void unlockGameSfx()
      return
    }

    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    const ok = postMessage({
      name,
      location: location || 'Somewhere',
      countryCode,
      text,
    })
    if (ok) setDraft('')
    setSending(false)
  }

  if (!shown) return null

  return (
    <div
      className={`fixed inset-0 z-[110] ${visible ? 'chat-overlay-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Community chat"
    >
      <button
        type="button"
        aria-label="Close community chat"
        onClick={onClose}
        className={`absolute inset-0 border-0 cursor-default bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-[12px] transition-opacity duration-350 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <OverlayBackButton onClick={onClose} />

      {/* WASD playground — right side (desktop), after you've joined */}
      <ChatPlayground
        active={open && joined}
        playerName={name}
        otherNames={otherNames}
      />

      {/* Chat column — left */}
      <div
        className={`relative z-10 flex items-center h-full p-6 sm:p-8 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto flex flex-col w-full max-w-[640px] pl-[clamp(0.5rem,6vw,5rem)] pr-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Count */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-dim)] mb-2.5 pl-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="shrink-0"
            >
              <path
                d="M4 5.5h16v10H10l-4.5 4v-4H4z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {messages.length === 0
                ? 'no messages yet'
                : `${messages.length.toLocaleString()} message${messages.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="chat-msg-list flex flex-col gap-3 h-[min(340px,50vh)] overflow-y-auto pr-2"
          >
            <div className="mt-auto flex flex-col gap-3">
              {messages.length === 0 ? (
                <p className="font-mono text-[13px] text-[var(--color-dim)] pl-1 py-6">
                  be the first to say hi —
                </p>
              ) : (
                messages.map((m) => {
                  const flag = flagEmoji(m.countryCode)
                  return (
                    <div
                      key={m.id}
                      className="flex items-end gap-2 max-w-[92%]"
                    >
                      <img
                        src={avatarUrl(m.seed)}
                        alt=""
                        className="size-7 rounded-full shrink-0 ml-1 bg-[var(--color-gray-100)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="inline-flex items-center flex-wrap gap-1.5 font-mono text-[11px] text-[var(--color-dim)] pl-1">
                          <span className="text-[var(--color-muted)]">
                            {m.name}
                          </span>
                          <span className="text-[var(--color-gray-300)]">·</span>
                          <span>
                            {m.location}
                            {flag ? (
                              <span aria-hidden className="opacity-90">
                                {' '}
                                {flag}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-[var(--color-gray-300)]">·</span>
                          <span className="text-[9.5px]">
                            {formatAgo(m.createdAt, now)}
                          </span>
                        </div>
                        <div className="font-pixel text-[13px] leading-[1.5] px-3 py-2 rounded-[15px] rounded-bl-[5px] bg-[var(--color-gray-200)] text-[var(--color-ink)] break-words whitespace-pre-wrap w-fit max-w-full">
                          {m.text}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Compose — after join: "chatting as Name" + say something (screenshot) */}
          <form
            className="flex flex-col gap-2.5 mt-7 max-w-[92%]"
            onSubmit={onSubmit}
          >
            {joined ? (
              <div className="font-mono text-[12.5px] text-[var(--color-muted)]">
                chatting as{' '}
                <b className="text-[var(--color-ink)] font-semibold">
                  {name}
                </b>
              </div>
            ) : (
              <div className="font-mono text-[12.5px] text-[var(--color-muted)]">
                {step === 'name'
                  ? "what's your name?"
                  : `hey ${name} — where are you from?`}
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                value={
                  step === 'name'
                    ? draft || name
                    : step === 'location'
                      ? draft || location
                      : draft
                }
                onChange={(e) => {
                  const v = e.target.value
                  if (step === 'name') {
                    setName(v)
                    setDraft(v)
                  } else if (step === 'location') {
                    setLocation(v)
                    setDraft(v)
                  } else {
                    setDraft(v)
                  }
                }}
                placeholder={
                  joined
                    ? 'say something…'
                    : step === 'name'
                      ? 'your name'
                      : 'City, Country'
                }
                maxLength={joined ? 200 : 40}
                autoComplete="off"
                aria-label={joined ? 'Message' : 'Join chat'}
                className="flex-1 min-w-0 bg-transparent border-0 border-b border-transparent focus:border-[var(--color-border)] py-1 font-mono text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-dim)] outline-none"
              />
              <button
                type="submit"
                disabled={
                  step === 'name'
                    ? !(draft.trim() || name.trim())
                    : step === 'message'
                      ? !draft.trim() || sending
                      : false
                }
                className="shrink-0 font-mono text-[12px] text-[var(--color-muted)] hover:text-[var(--color-ink)] disabled:opacity-35 px-0.5 py-1 transition-colors"
              >
                {joined
                  ? sending
                    ? '…'
                    : 'send ↵'
                  : 'next ↵'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

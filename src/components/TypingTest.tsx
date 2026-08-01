import { useCallback, useEffect, useMemo, useState } from 'react'
import OverlayBackButton from './OverlayBackButton'

/**
 * Typing test — full-screen Monkeytype-style (bryllim reference)
 * Stats · sample text · on-screen keyboard · tab restart · esc close
 */

const WORDS = [
  'from',
  'how',
  'at',
  'only',
  'and',
  'only',
  'be',
  'how',
  'again',
  'open',
  'after',
  'around',
  'stand',
  'after',
  'too',
  'system',
  'do',
  'which',
  'under',
  'only',
  'stand',
  'and',
  'system',
  'plan',
  'too',
  'high',
]

const SAMPLE = WORDS.join(' ')

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

type Props = {
  open: boolean
  onClose: () => void
}

export default function TypingTest({ open, onClose }: Props) {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [done, setDone] = useState(false)

  const restart = useCallback(() => {
    setTyped('')
    setStartedAt(null)
    setDone(false)
    setNow(Date.now())
  }, [])

  useEffect(() => {
    if (!open) return
    restart()
  }, [open, restart])

  // live clock while typing
  useEffect(() => {
    if (!open || !startedAt || done) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [open, startedAt, done])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        restart()
        return
      }
      if (done) return

      // ignore modifiers alone
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        setTyped((t) => t.slice(0, -1))
        return
      }

      if (e.key.length === 1) {
        e.preventDefault()
        setTyped((t) => {
          if (!startedAt) setStartedAt(Date.now())
          const next = t + e.key
          if (next.length >= SAMPLE.length) {
            setDone(true)
            return SAMPLE
          }
          return next
        })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, restart, done, startedAt])

  const stats = useMemo(() => {
    const correct = [...typed].filter((ch, i) => ch === SAMPLE[i]).length
    const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100
    const elapsedMin = startedAt ? (now - startedAt) / 1000 / 60 : 0
    const elapsedSec = startedAt ? (now - startedAt) / 1000 : 0
    const wpm = elapsedMin > 0 ? Math.round(correct / 5 / elapsedMin) : 0
    return { acc, wpm, elapsedSec }
  }, [typed, startedAt, now])

  const nextKey = SAMPLE[typed.length]?.toLowerCase() ?? ''

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Typing test"
    >
      <OverlayBackButton onClick={onClose} />

      {/* Stats row */}
      <div className="flex items-end justify-center gap-10 sm:gap-14 mb-10 sm:mb-14">
        <Stat value={stats.wpm} label="WPM" />
        <Stat value={`${stats.acc}%`} label="ACC" />
        <Stat value={`${stats.elapsedSec.toFixed(0)}s`} label="TIME" />
      </div>

      {/* Sample text */}
      <div className="w-full max-w-2xl font-mono text-[clamp(1rem,2.5vw,1.25rem)] leading-[1.85] text-center mb-12 sm:mb-16 px-2">
        {[...SAMPLE].map((ch, i) => {
          let cls = 'text-[var(--color-dim)]'
          if (i < typed.length) {
            cls =
              typed[i] === ch
                ? 'text-[var(--color-ink)]'
                : 'text-red-500'
          } else if (i === typed.length) {
            cls =
              'text-[var(--color-dim)] border-l-2 border-[var(--color-ink)] -ml-px pl-px'
          }
          return (
            <span key={i} className={cls}>
              {ch}
            </span>
          )
        })}
      </div>

      {/* On-screen keyboard */}
      <div className="flex flex-col items-center gap-1.5 sm:gap-2 mb-10">
        {ROWS.map((row) => (
          <div key={row.join('')} className="flex gap-1 sm:gap-1.5">
            {row.map((key) => {
              const active = nextKey === key
              return (
                <div
                  key={key}
                  className={[
                    'size-8 sm:size-10 grid place-items-center rounded-lg border font-mono text-[0.75rem] sm:text-[0.8rem] transition-all',
                    active
                      ? 'border-[var(--color-ink)] bg-[var(--color-bg)] text-[var(--color-ink)] shadow-md scale-105'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-muted)]',
                  ].join(' ')}
                >
                  {key}
                </div>
              )
            })}
          </div>
        ))}
        {/* Space bar */}
        <div
          className={[
            'mt-0.5 h-9 sm:h-10 w-[min(100%,18rem)] grid place-items-center rounded-lg border font-mono text-[0.7rem] tracking-wider uppercase transition-all',
            nextKey === ' '
              ? 'border-[var(--color-ink)] bg-[var(--color-bg)] text-[var(--color-ink)] shadow-md'
              : 'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-dim)]',
          ].join(' ')}
        >
          space
        </div>
      </div>

      {/* Hints */}
      <div className="flex items-center gap-3 font-mono text-[0.7rem] text-[var(--color-dim)]">
        <span className="inline-flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] rounded bg-[var(--color-surface-soft)] text-[var(--color-muted)]">
            tab
          </kbd>
          restart
        </span>
        <span className="inline-flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] rounded bg-[var(--color-surface-soft)] text-[var(--color-muted)]">
            esc
          </kbd>
          close
        </span>
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[4rem]">
      <span className="font-mono text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-tight text-[var(--color-ink)] leading-none tabular-nums">
        {value}
      </span>
      <span className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-dim)]">
        {label}
      </span>
    </div>
  )
}

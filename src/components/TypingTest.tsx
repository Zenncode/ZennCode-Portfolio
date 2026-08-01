import { useEffect, useMemo, useState } from 'react'

const SAMPLE =
  'the quick brown fox jumps over the lazy dog and ships clean software every day'

type Props = {
  open: boolean
  onClose: () => void
}

export default function TypingTest({ open, onClose }: Props) {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!open) return
    setTyped('')
    setStartedAt(null)
    setDone(false)
  }, [open])

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

  const stats = useMemo(() => {
    const correct = [...typed].filter((ch, i) => ch === SAMPLE[i]).length
    const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100
    const elapsed = startedAt ? (Date.now() - startedAt) / 1000 / 60 : 0
    const wpm =
      elapsed > 0 ? Math.round(correct / 5 / elapsed) : 0
    return { acc, wpm, elapsed: startedAt ? (Date.now() - startedAt) / 1000 : 0 }
  }, [typed, startedAt])

  if (!open) return null

  function onChange(value: string) {
    if (!startedAt && value.length > 0) setStartedAt(Date.now())
    if (value.length >= SAMPLE.length) {
      setTyped(SAMPLE)
      setDone(true)
      return
    }
    setTyped(value)
  }

  function restart() {
    setTyped('')
    setStartedAt(null)
    setDone(false)
  }

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Typing test"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_30%,transparent)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[0.95rem] font-semibold">Typing test</h2>
          <button
            type="button"
            className="font-mono text-[0.7rem] text-[var(--color-dim)]"
            onClick={onClose}
          >
            esc close
          </button>
        </div>

        <p className="font-mono text-[0.95rem] leading-relaxed mb-4 select-none break-words">
          {[...SAMPLE].map((ch, i) => {
            let color = 'text-[var(--color-dim)]'
            if (i < typed.length) {
              color =
                typed[i] === ch
                  ? 'text-[var(--color-ink)]'
                  : 'text-red-500'
            } else if (i === typed.length) {
              color = 'text-[var(--color-ink)] underline underline-offset-2'
            }
            return (
              <span key={i} className={color}>
                {ch}
              </span>
            )
          })}
        </p>

        <input
          autoFocus
          disabled={done}
          value={typed}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)] px-3 py-2.5 font-mono text-[0.85rem] outline-none focus:border-[var(--color-border-strong)] mb-4"
          placeholder="start typing…"
          spellCheck={false}
          autoComplete="off"
        />

        <div className="flex flex-wrap gap-4 font-mono text-[0.72rem] text-[var(--color-dim)] mb-4">
          <span>
            <strong className="text-[var(--color-ink)]">{stats.wpm}</strong> wpm
          </span>
          <span>
            <strong className="text-[var(--color-ink)]">{stats.acc}%</strong> acc
          </span>
          <span>
            <strong className="text-[var(--color-ink)]">
              {stats.elapsed.toFixed(0)}
            </strong>
            s time
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={restart}
            className="font-mono text-[0.75rem] px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
          >
            ↻ try again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[0.75rem] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-ink)] text-[var(--color-bg)]"
          >
            close
          </button>
        </div>
      </div>
    </div>
  )
}

type Props = {
  onClick: () => void
  /** Optional hint shown next to back (e.g. esc) */
  hint?: string
  className?: string
}

/**
 * Shared back control for full-screen overlays
 * (Ask anything · Typing test · Community chat)
 */
export default function OverlayBackButton({
  onClick,
  hint = 'esc',
  className = '',
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className={`absolute top-5 left-5 z-20 inline-flex items-center gap-2 font-mono text-[0.72rem] tracking-wide text-[var(--color-dim)] hover:text-[var(--color-ink)] transition-colors ${className}`}
    >
      <span aria-hidden className="text-[0.95rem] leading-none">
        ←
      </span>
      <span>back</span>
      {hint ? (
        <kbd className="ml-0.5 px-1.5 py-0.5 border border-[var(--color-border)] rounded-md bg-[var(--color-surface-soft)] text-[0.62rem] text-[var(--color-muted)]">
          {hint}
        </kbd>
      ) : null}
    </button>
  )
}

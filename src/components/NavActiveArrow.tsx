/**
 * Active tab indicator — bryllim style:
 *   →  [icon]  Shop
 * Lives inside the shared arrow gutter (same width as brand spacer).
 */
type Props = {
  className?: string
}

export default function NavActiveArrow({ className = '' }: Props) {
  return (
    <svg
      className={[
        'nav-active-arrow',
        'pointer-events-none h-3 w-3',
        'text-[var(--color-ink)]',
        className,
      ].join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

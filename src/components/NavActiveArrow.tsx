/**
 * Active tab indicator — matches bryllim sidebar:
 *   →  [icon]  Blog
 *
 * Own component so the arrow is reusable and styled in one place.
 */
type Props = {
  className?: string
}

export default function NavActiveArrow({ className = '' }: Props) {
  return (
    <span
      className={[
        'nav-active-arrow',
        'inline-flex shrink-0 items-center justify-center',
        'w-3.5 text-[0.85rem] leading-none',
        'text-[var(--color-ink)] select-none',
        className,
      ].join(' ')}
      aria-hidden
    >
      →
    </span>
  )
}

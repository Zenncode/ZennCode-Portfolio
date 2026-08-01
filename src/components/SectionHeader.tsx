import { Link } from 'react-router-dom'

type Props = {
  title: string
  href?: string
  linkLabel?: string
  external?: boolean
}

export default function SectionHeader({
  title,
  href,
  linkLabel,
  external,
}: Props) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-4.5">
      <h2 className="section-label">{title}</h2>
      {href && linkLabel && (
        external ? (
          <a
            href={href}
            className="section-link"
            target="_blank"
            rel="noreferrer"
          >
            {linkLabel}
          </a>
        ) : (
          <Link to={href} className="section-link">
            {linkLabel}
          </Link>
        )
      )}
    </div>
  )
}

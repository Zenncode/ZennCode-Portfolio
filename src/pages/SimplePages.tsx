import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  collabBrands,
  consultingOffers,
  gearSections,
  resourceSections,
  shopProducts,
  site,
  type ShopProduct,
} from '../data/portfolio'

type ShellProps = {
  title: string
  description: string
  children?: ReactNode
}

function EmptyNote({ text = 'Nothing here yet — check back later.' }: { text?: string }) {
  return (
    <p className="font-mono text-[0.85rem] text-[var(--color-dim)] border border-dashed border-[var(--color-border)] rounded-xl px-4 py-8 text-center">
      {text}
    </p>
  )
}

function Shell({ title, description, children }: ShellProps) {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] font-normal tracking-wide leading-none lowercase mb-4 text-[var(--color-ink)]">
          {title}
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-lg text-[0.95rem] leading-relaxed">
          {description}
        </p>
        {children}
      </div>
    </div>
  )
}

function ProductThumb({ image }: { image?: string }) {
  return (
    <div className="relative aspect-[4/3] bg-[var(--color-gray-100)] overflow-hidden">
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-[55%] aspect-[8.5/11] bg-white shadow-md border border-[var(--color-border)] p-2.5 flex flex-col gap-1 dark:bg-[#f4f4f5]">
            <div className="h-1.5 w-1/2 bg-[var(--color-ink)] dark:bg-[#0a0a0a] rounded-sm mb-1" />
            <div className="h-1 w-full bg-[var(--color-gray-200)] dark:bg-[#d4d4d4] rounded-sm" />
            <div className="h-1 w-4/5 bg-[var(--color-gray-200)] dark:bg-[#d4d4d4] rounded-sm" />
            <div className="h-1 w-full bg-[var(--color-gray-200)] dark:bg-[#d4d4d4] rounded-sm mt-1" />
            <div className="h-1 w-3/4 bg-[var(--color-gray-200)] dark:bg-[#d4d4d4] rounded-sm" />
          </div>
        </div>
      )}
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-ink) 0.55px, transparent 0.65px)',
          backgroundSize: '6px 6px',
          maskImage:
            'radial-gradient(ellipse at 100% 100%, black 20%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 100% 100%, black 20%, transparent 75%)',
        }}
        aria-hidden
      />
    </div>
  )
}

/** Shop — product cards → /shop/:slug detail */
export function ShopPage() {
  return (
    <Shell
      title="shop"
      description="Digital products I've designed and built — ready for instant download."
    >
      {shopProducts.length === 0 ? (
        <EmptyNote text="No products listed yet." />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
        {shopProducts.map((product) => (
          <Link
            key={product.slug}
            to={`/shop/${product.slug}`}
            className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden no-underline shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] transition-all"
          >
            <div className="relative">
              <ProductThumb image={product.image} />
              {/* Price only — category already in title / product art (no duplicate TEMPLATE) */}
              <span className="absolute top-3 right-3 text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink)]">
                {product.priceLabel}
              </span>
            </div>
            <div className="px-4 py-3.5 border-t border-[var(--color-border)]">
              <h2 className="text-[0.95rem] font-semibold text-[var(--color-ink)] tracking-tight group-hover:underline underline-offset-2">
                {product.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
      )}
    </Shell>
  )
}

/** Product detail — e.g. Developer Resume Template */
export function ShopProductPage() {
  const { slug } = useParams()
  const product = shopProducts.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="page-shell">
        <div className="container-read relative z-10">
          <p className="font-mono text-[0.75rem] text-[var(--color-dim)] mb-4">
            <Link to="/shop" className="hover:text-[var(--color-ink)] no-underline">
              ← shop
            </Link>
          </p>
          <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] lowercase mb-3">
            not found
          </h1>
          <p className="text-[var(--color-muted)]">
            That product doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  return <ShopProductDetail product={product} />
}

function ShopProductDetail({ product }: { product: ShopProduct }) {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        {/* Breadcrumb */}
        <p className="font-mono text-[0.72rem] text-[var(--color-dim)] mb-6">
          <Link
            to="/shop"
            className="hover:text-[var(--color-ink)] no-underline transition-colors"
          >
            shop
          </Link>
          <span className="mx-1.5 opacity-50">/</span>
          <span className="text-[var(--color-muted)]">{product.title}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 md:gap-12 items-start">
          {/* Preview card */}
          <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)] bg-[var(--color-bg)]">
            <ProductThumb image={product.image} />
            <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
              <p className="text-[0.9rem] font-semibold text-[var(--color-ink)] min-w-0">
                {product.title}
              </p>
              <span className="text-[0.75rem] font-medium px-2.5 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-ink)] shrink-0">
                {product.priceLabel}
              </span>
            </div>
          </div>

          {/* Copy + CTA */}
          <div>
            <p className="font-mono text-[0.65rem] tracking-wider uppercase text-[var(--color-dim)] mb-2">
              {product.category}
            </p>
            <h1 className="font-mono text-[clamp(1.6rem,3.5vw,2.15rem)] font-normal tracking-tight leading-[1.15] text-[var(--color-ink)] mb-4">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center text-[0.85rem] font-semibold text-[var(--color-ink)]">
                {product.priceLabel}
              </span>
              <span className="text-[var(--color-dim)] text-[0.8rem]">·</span>
              <span className="font-mono text-[0.72rem] text-[var(--color-dim)]">
                {product.delivery}
              </span>
            </div>

            <a
              href={product.downloadHref}
              download
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] font-mono text-[0.78rem] tracking-wide no-underline hover:opacity-90 transition-opacity mb-8"
            >
              {product.cta}
            </a>

            <p className="text-[0.95rem] text-[var(--color-muted)] leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>

            <section className="mb-8">
              <h2 className="font-mono text-[0.72rem] tracking-wider uppercase text-[var(--color-dim)] mb-3">
                What&apos;s inside
              </h2>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {product.inside.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[0.9rem] text-[var(--color-muted)] leading-relaxed"
                  >
                    <span
                      className="mt-2 size-1 rounded-full bg-[var(--color-ink)] shrink-0 opacity-70"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-mono text-[0.72rem] tracking-wider uppercase text-[var(--color-dim)] mb-3">
                Sections
              </h2>
              <p className="text-[0.9rem] text-[var(--color-muted)] leading-relaxed">
                {product.sections.join(' · ')}
              </p>
            </section>

            <p className="text-[0.88rem] text-[var(--color-dim)] leading-relaxed border-t border-[var(--color-border)] pt-6 max-w-md">
              {product.footerNote}
            </p>

            <p className="mt-8 font-mono text-[0.72rem] text-[var(--color-dim)]">
              Questions?{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-[var(--color-ink)] underline underline-offset-2"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExternalArrow() {
  return (
    <svg
      className="mt-0.5 size-3.5 shrink-0 text-[var(--color-dim)] transition-colors group-hover:text-[var(--color-ink)]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 17L17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GearPage() {
  return (
    <Shell
      title="gear"
      description="The hardware and tools I use to build, create, and stay productive — my desk setup, everyday carry, and the kit I shoot content with."
    >
      {gearSections.length === 0 ? (
        <EmptyNote text="Gear list coming soon." />
      ) : (
      <div className="flex flex-col gap-12">
        {gearSections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="font-mono text-[0.78rem] tracking-[0.12em] uppercase text-[var(--color-dim)] mb-5">
              {section.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] no-underline hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] transition-all"
                >
                  {/* Product photo — white field like reference */}
                  <div className="flex aspect-square items-center justify-center bg-white p-6 dark:bg-[#fafafa]">
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="border-t border-[var(--color-border)] px-4 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13.5px] font-medium leading-snug text-[var(--color-ink)]">
                        {item.name}
                      </h3>
                      <ExternalArrow />
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-muted)]">
                      {item.detail}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
      )}
    </Shell>
  )
}

export function ResourcesPage() {
  return (
    <Shell
      title="resources"
      description="A hand-picked list of the resources I keep coming back to — for learning to build software, getting into AI engineering, and staying current. Free or freemium, and genuinely worth your time."
    >
      {resourceSections.length === 0 ? (
        <EmptyNote text="Resources list coming soon." />
      ) : (
      <div className="flex flex-col gap-12">
        {resourceSections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[var(--color-dim)] mb-5">
              {section.title}
            </h2>
            {/* 2-col grid — ss/image copy 2.png */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {section.items.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block no-underline"
                >
                  <p className="text-[0.95rem] font-semibold tracking-tight text-[var(--color-ink)] group-hover:underline underline-offset-2 mb-1 inline-flex items-center gap-1.5">
                    {item.name}
                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">
                      <ExternalArrow />
                    </span>
                  </p>
                  <p className="text-[0.88rem] text-[var(--color-muted)] leading-relaxed">
                    {item.detail}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}

        <p className="text-[0.9rem] text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]">
          Missing something great?{' '}
          <a
            href={`mailto:${site.email}?subject=Resource%20recommendation`}
            className="text-[var(--color-ink)] underline underline-offset-2"
          >
            Send me a link →
          </a>
        </p>
      </div>
      )}
    </Shell>
  )
}

export function CollabsPage() {
  return (
    <Shell
      title="collabs"
      description="Open to brand collaborations, creative projects, and speaking. Reach me if you want to work together."
    >
      {collabBrands.length === 0 ? (
        <EmptyNote text="No public collab logos listed yet — email me to partner." />
      ) : (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-2">
          {collabBrands.map((brand) => (
            <img
              key={brand.name}
              src={brand.src}
              alt={brand.name}
              className="h-7 sm:h-8 w-auto object-contain opacity-70 grayscale dark:invert dark:opacity-80"
            />
          ))}
        </div>
      )}

      <section className="border-t border-[var(--color-border)] pt-10 mt-10">
        <h2 className="font-mono text-[clamp(1.35rem,3vw,1.75rem)] font-normal tracking-tight lowercase text-[var(--color-ink)] mb-4">
          let&apos;s work together
        </h2>
        <p className="font-mono text-[0.72rem] tracking-wider uppercase text-[var(--color-dim)] mb-2">
          Get in touch
        </p>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex font-mono text-[0.95rem] text-[var(--color-ink)] underline underline-offset-2"
        >
          {site.email}
        </a>
      </section>
    </Shell>
  )
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink)]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ConsultingPage() {
  return (
    <Shell
      title="consulting"
      description="I help founders and teams ship with AI and great software — through hands-on training, technical leadership, and building the thing itself."
    >
      {consultingOffers.length === 0 ? (
        <EmptyNote text="Consulting packages not listed yet — email me for work." />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {consultingOffers.map((offer) => (
          <article
            key={offer.id}
            className="consult-card relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] transition-all"
          >
            {/* Soft corner dots like bryllim */}
            <div
              className="pointer-events-none absolute top-0 right-0 w-24 h-24 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle, var(--color-ink) 0.5px, transparent 0.6px)',
                backgroundSize: '6px 6px',
                maskImage:
                  'radial-gradient(ellipse at 100% 0%, black 0%, transparent 70%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse at 100% 0%, black 0%, transparent 70%)',
              }}
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-3">
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">
                {offer.title}
              </h2>
              <span className="shrink-0 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-ink)]">
                {offer.price}
              </span>
            </div>
            <p className="relative mt-2.5 flex-1 text-[13.5px] leading-relaxed text-[var(--color-muted)]">
              {offer.description}
            </p>
            <div className="relative mt-5 h-px w-full bg-[var(--color-border)]" />
            <ul className="relative mt-4 grid gap-2 list-none p-0 m-0">
              {offer.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2.5 text-[12px] text-[var(--color-muted)]"
                >
                  <CheckIcon />
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      )}

      <section className="border-t border-[var(--color-border)] pt-10 mt-6">
        <h2 className="font-mono text-[clamp(1.35rem,3vw,1.75rem)] font-normal tracking-tight lowercase text-[var(--color-ink)] mb-4">
          let&apos;s work together
        </h2>
        <p className="text-[0.95rem] text-[var(--color-muted)] leading-relaxed max-w-lg mb-6">
          Tell me about your team, product, or problem — I&apos;ll come back
          with how I can help and a simple way to start.
        </p>
        <p className="font-mono text-[0.72rem] tracking-wider uppercase text-[var(--color-dim)] mb-2">
          Get in touch
        </p>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex font-mono text-[0.95rem] text-[var(--color-ink)] underline underline-offset-2"
        >
          {site.email}
        </a>
      </section>
    </Shell>
  )
}

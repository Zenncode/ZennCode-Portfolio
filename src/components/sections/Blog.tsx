import { Link } from 'react-router-dom'
import FadeIn from '../FadeIn'
import SectionHeader from '../SectionHeader'
import { blogPosts } from '../../data/portfolio'

export default function Blog() {
  return (
    <section id="blog" className="w-full pt-14">
      <div className="container-read">
        <FadeIn>
          <SectionHeader
            title="01 — blog"
            href="/blog"
            linkLabel="ALL POSTS →"
          />
        </FadeIn>

        <div className="flex flex-col">
          {blogPosts.map((post, i) => (
            <FadeIn key={post.slug} delay={Math.min(i * 0.07, 0.33)}>
              <Link
                to={`/blog/${post.slug}`}
                className={[
                  'block py-5 no-underline border-t border-[var(--color-border)] group',
                  i === blogPosts.length - 1 ? 'border-b' : '',
                ].join(' ')}
              >
                <h3 className="text-[1.05rem] font-semibold tracking-tight mb-2 leading-snug text-[var(--color-ink)] group-hover:underline group-hover:underline-offset-[3px] group-hover:decoration-[color-mix(in_srgb,currentColor_35%,transparent)]">
                  {post.title}
                </h3>
                <p className="text-[0.92rem] text-[var(--color-muted)] leading-[1.6] mb-2.5 max-w-[36rem]">
                  {post.excerpt}
                </p>
                <time className="font-mono text-[0.72rem] text-[var(--color-dim)]">
                  {post.date}
                </time>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

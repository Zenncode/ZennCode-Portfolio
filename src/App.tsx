import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const BlogPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.BlogPage })),
)
const BlogPostPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.BlogPostPage })),
)
const ProjectsPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.ProjectsPage })),
)
const ExperiencePage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.ExperiencePage })),
)
const StackPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.StackPage })),
)
const CertificationsPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.CertificationsPage })),
)
const RecommendationsPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.RecommendationsPage })),
)
const AffiliationsPage = lazy(() =>
  import('./pages/ListPages').then((m) => ({ default: m.AffiliationsPage })),
)
const ShopPage = lazy(() =>
  import('./pages/SimplePages').then((m) => ({ default: m.ShopPage })),
)
const ShopProductPage = lazy(() =>
  import('./pages/SimplePages').then((m) => ({ default: m.ShopProductPage })),
)
const GearPage = lazy(() =>
  import('./pages/SimplePages').then((m) => ({ default: m.GearPage })),
)
const ResourcesPage = lazy(() =>
  import('./pages/SimplePages').then((m) => ({ default: m.ResourcesPage })),
)

function NotFound() {
  return (
    <div className="page-shell">
      <div className="container-read relative z-10">
        <p className="font-mono text-[0.75rem] text-[var(--color-dim)] mb-4">
          404 — page not found
        </p>
        <h1 className="font-mono text-[clamp(1.85rem,4vw,2.5rem)] lowercase mb-3">
          not found
        </h1>
        <p className="text-[var(--color-muted)] mb-6">
          That page doesn&apos;t exist.
        </p>
        <Link to="/" className="section-link">
          ← back home
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <div className="container-read relative z-10">
            <p className="font-mono text-[0.8rem] text-[var(--color-dim)]">
              loading…
            </p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:slug" element={<ShopProductPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="gear" element={<GearPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="stack" element={<StackPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="affiliations" element={<AffiliationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

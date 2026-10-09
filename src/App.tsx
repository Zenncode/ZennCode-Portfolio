import { lazy, Suspense, useEffect } from 'react'
import { Link as RouterLink, Route, Routes, useLocation } from 'react-router-dom'
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
const CollabsPage = lazy(() =>
  import('./pages/SimplePages').then((m) => ({ default: m.CollabsPage })),
)
const ConsultingPage = lazy(() =>
  import('./pages/SimplePages').then((m) => ({ default: m.ConsultingPage })),
)
// Admin is code-split so its bundle never lands in a visitor's critical path.
// The route itself is public; the *data* behind it is what firestore.rules
// gates — see src/pages/Admin.tsx.
const AdminPage = lazy(() => import('./pages/Admin'))
const AdminVisitorsPage = lazy(() => import('./pages/AdminVisitors'))

/** Fallback for lazy page chunks — sits inside Layout so chrome stays mounted. */
function PageFallback() {
  return (
    <div className="page-shell min-h-[60vh]">
      <div className="container-read relative z-10">
        <p className="font-mono text-[0.8rem] text-[var(--color-dim)]">
          loading…
        </p>
      </div>
    </div>
  )
}

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
        <RouterLink to="/" className="section-link">
          ← back home
        </RouterLink>
      </div>
    </div>
  )
}

/** Reset scroll on navigation — BrowserRouter has no scroll restoration. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="shop"
          element={
            <Suspense fallback={<PageFallback />}>
              <ShopPage />
            </Suspense>
          }
        />
        <Route
          path="shop/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <ShopProductPage />
            </Suspense>
          }
        />
        <Route
          path="blog"
          element={
            <Suspense fallback={<PageFallback />}>
              <BlogPage />
            </Suspense>
          }
        />
        <Route
          path="blog/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <BlogPostPage />
            </Suspense>
          }
        />
        <Route
          path="gear"
          element={
            <Suspense fallback={<PageFallback />}>
              <GearPage />
            </Suspense>
          }
        />
        <Route
          path="resources"
          element={
            <Suspense fallback={<PageFallback />}>
              <ResourcesPage />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProjectsPage />
            </Suspense>
          }
        />
        <Route
          path="experience"
          element={
            <Suspense fallback={<PageFallback />}>
              <ExperiencePage />
            </Suspense>
          }
        />
        <Route
          path="stack"
          element={
            <Suspense fallback={<PageFallback />}>
              <StackPage />
            </Suspense>
          }
        />
        <Route
          path="certifications"
          element={
            <Suspense fallback={<PageFallback />}>
              <CertificationsPage />
            </Suspense>
          }
        />
        <Route
          path="recommendations"
          element={
            <Suspense fallback={<PageFallback />}>
              <RecommendationsPage />
            </Suspense>
          }
        />
        <Route
          path="affiliations"
          element={
            <Suspense fallback={<PageFallback />}>
              <AffiliationsPage />
            </Suspense>
          }
        />
        <Route
          path="collabs"
          element={
            <Suspense fallback={<PageFallback />}>
              <CollabsPage />
            </Suspense>
          }
        />
        <Route
          path="consulting"
          element={
            <Suspense fallback={<PageFallback />}>
              <ConsultingPage />
            </Suspense>
          }
        />
        <Route
          path="admin"
          element={
            <Suspense fallback={<PageFallback />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="admin/visitors" element={<AdminVisitorsPage />} />
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

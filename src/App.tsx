import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import {
  AffiliationsPage,
  BlogPage,
  BlogPostPage,
  CertificationsPage,
  ExperiencePage,
  ProjectsPage,
  RecommendationsPage,
  StackPage,
} from './pages/ListPages'
import {
  CollabsPage,
  ConsultingPage,
  GearPage,
  ResourcesPage,
  ShopPage,
  ShopProductPage,
} from './pages/SimplePages'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ShopProductPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="gear" element={<GearPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="collabs" element={<CollabsPage />} />
        <Route path="consulting" element={<ConsultingPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="stack" element={<StackPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="affiliations" element={<AffiliationsPage />} />
      </Route>
    </Routes>
  )
}

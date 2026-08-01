import Hero from '../components/sections/Hero'
import Blog from '../components/sections/Blog'
import Projects from '../components/sections/Projects'
import Experience from '../components/sections/Experience'
import Certifications from '../components/sections/Certifications'
import Recommendations from '../components/sections/Recommendations'
import Affiliations from '../components/sections/Affiliations'
import Github from '../components/sections/Github'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Blog />
      <Projects />
      <Experience />
      <Certifications />
      <Recommendations />
      <Affiliations />
      <Github />
      <Contact />
    </>
  )
}

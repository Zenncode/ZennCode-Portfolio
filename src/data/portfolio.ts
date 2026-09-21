/**
 * Portfolio data — types + re-exports.
 *
 * Each feature has its own JSON file under `src/data/`:
 *   site, hero, blog, projects, collabs, consulting, experience,
 *   stack, certifications, recommendations, affiliations, community,
 *   gear, resources, shop, github
 *
 * Edit those JSON files to change content. Keep this file for types + helpers only.
 */
import siteData from './site.json'
import heroData from './hero.json'
import blogPostsData from './blog.json'
import projectsData from './projects.json'
import collabBrandsData from './collabs.json'
import consultingOffersData from './consulting.json'
import experienceData from './experience.json'
import stackData from './stack.json'
import certificationsData from './certifications.json'
import recommendationsData from './recommendations.json'
import affiliationsData from './affiliations.json'
import communityData from './community.json'
import gearSectionsData from './gear.json'
import resourceSectionsData from './resources.json'
import shopProductsData from './shop.json'
import githubData from './github.json'

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMinutes: number
  cover?: string
  body?: string
}

export type Project = {
  id: string
  name: string
  description: string
  /** Small award / ranking lines above the card (like “#1 Finance App”) */
  highlights?: string[]
  accent: string
  icon: string
  /** App icon image path */
  iconImage?: string
  /** Right-side preview screenshot (login page SS) */
  previewImage?: string
  links?: { label: string; href: string }[]
  featured?: boolean
  press?: { label: string; href: string }[]
}

export type OtherProject = {
  name: string
  category: string
  description: string
  href: string
}

export type ConsultingOffer = {
  id: string
  title: string
  price: string
  description: string
  bullets: string[]
}

export type Experience = {
  year: string
  role: string
  company: string
}

export type ExperienceCompany = {
  company: string
  initials: string
  type: string
  location?: string
  duration: string
  roles: {
    title: string
    range: string
    bullets: string[]
    skills: string[]
  }[]
}

export type Certification = {
  name: string
  issuer: string
  verify?: string
  /** Official issuer logo under /public/certs */
  logo: string
  group: string
  /** Slight polaroid tilt (deg) */
  rot?: number
  ty?: number
}

export type Recommendation = {
  quote: string
  name: string
  title: string
  initials: string
  date?: string
}

export type Affiliation = {
  name: string
  role: string
  emoji: string
  initials?: string
  logo?: string
  description?: string
  href?: string
  hrefLabel?: string
}

export type Hackathon = {
  name: string
  result: string
  org: string
  featured?: boolean
}

export type CommunityLink = {
  name: string
  handle: string
  href: string
}

export type FoundedLink = {
  name: string
  href: string
  detail: string
}

export type GearItem = {
  name: string
  detail: string
  image: string
  href: string
}

export type GearSection = {
  id: string
  title: string
  items: GearItem[]
}

export type ResourceItem = {
  name: string
  detail: string
  href: string
}

export type ResourceSection = {
  id: string
  title: string
  items: ResourceItem[]
}

export type ShopProduct = {
  slug: string
  title: string
  category: string
  priceLabel: string
  price: number
  tagline: string
  description: string
  delivery: string
  cta: string
  downloadHref: string
  image?: string
  inside: string[]
  sections: string[]
  footerNote: string
}

export type CollabBrand = {
  name: string
  src: string
}

/* ─── Data (one JSON file per feature) ──────────────────────────────────── */

export const site = siteData
export const hero = heroData.hero
export const stats = heroData.stats
export const blogPosts = blogPostsData as BlogPost[]
export const projects = projectsData.projects as Project[]
export const otherProjects = projectsData.otherProjects as OtherProject[]
export const collabBrands = collabBrandsData as CollabBrand[]
export const consultingOffers = consultingOffersData as ConsultingOffer[]
export const experience = experienceData.experience as Experience[]
export const experienceFull = experienceData.experienceFull as ExperienceCompany[]
export const stack = stackData.stack
export const stackGroups = stackData.stackGroups
export const certifications = certificationsData as Certification[]
export const recommendations = recommendationsData as Recommendation[]
export const affiliations = affiliationsData as Affiliation[]
export const hackathons = communityData.hackathons as Hackathon[]
export const communities = communityData.communities as CommunityLink[]
export const founded = communityData.founded as FoundedLink[]
export const communityHeadline = communityData.communityHeadline
export const communitySub = communityData.communitySub
export const hackathonHeadline = communityData.hackathonHeadline
export const hackathonSub = communityData.hackathonSub
export const gearSections = gearSectionsData as GearSection[]
export const resourceSections = resourceSectionsData as ResourceSection[]
export const shopProducts = shopProductsData as ShopProduct[]
export const contributionCount = githubData.contributionCount

/* ─── Helpers (not content) ─────────────────────────────────────────────── */

/**
 * SVG icon for every stack item — same icon sets as the GitHub profile
 * README (skillicons.dev for languages, go-skill-icons for the rest).
 * Each URL serves a single SVG. <img onError> hides any slug that 404s,
 * so the text label always remains.
 */
const STACK_ICONS: Record<string, string> = {
  HTML: 'https://skillicons.dev/icons?i=html',
  CSS: 'https://skillicons.dev/icons?i=css',
  JavaScript: 'https://skillicons.dev/icons?i=js',
  TypeScript: 'https://skillicons.dev/icons?i=ts',
  Python: 'https://skillicons.dev/icons?i=py',
  Java: 'https://skillicons.dev/icons?i=java',
  'C++': 'https://skillicons.dev/icons?i=cpp',
  'C#': 'https://skillicons.dev/icons?i=cs',
  PHP: 'https://skillicons.dev/icons?i=php',
  React: 'https://go-skill-icons.vercel.app/api/icons?i=react',
  'Next.js': 'https://go-skill-icons.vercel.app/api/icons?i=nextjs',
  Vue: 'https://go-skill-icons.vercel.app/api/icons?i=vue',
  Angular: 'https://go-skill-icons.vercel.app/api/icons?i=angular',
  'Tailwind CSS':
    'https://go-skill-icons.vercel.app/api/icons?i=tailwind',
  Laravel: 'https://go-skill-icons.vercel.app/api/icons?i=laravel',
  'Node.js': 'https://go-skill-icons.vercel.app/api/icons?i=nodejs',
  Express: 'https://go-skill-icons.vercel.app/api/icons?i=express',
  '.NET': 'https://go-skill-icons.vercel.app/api/icons?i=dotnet',
  Flutter: 'https://go-skill-icons.vercel.app/api/icons?i=flutter',
  'React Native': 'https://go-skill-icons.vercel.app/api/icons?i=react',
  Expo: 'https://go-skill-icons.vercel.app/api/icons?i=expo',
  MySQL: 'https://go-skill-icons.vercel.app/api/icons?i=mysql',
  PostgreSQL: 'https://go-skill-icons.vercel.app/api/icons?i=postgres',
  MongoDB: 'https://go-skill-icons.vercel.app/api/icons?i=mongodb',
  Firebase: 'https://go-skill-icons.vercel.app/api/icons?i=firebase',
  Git: 'https://go-skill-icons.vercel.app/api/icons?i=git',
  GitHub: 'https://go-skill-icons.vercel.app/api/icons?i=github',
  Docker: 'https://go-skill-icons.vercel.app/api/icons?i=docker',
  Railway: 'https://go-skill-icons.vercel.app/api/icons?i=railway',
  Unity: 'https://go-skill-icons.vercel.app/api/icons?i=unity',
  Figma: 'https://go-skill-icons.vercel.app/api/icons?i=figma',
  Canva: 'https://go-skill-icons.vercel.app/api/icons?i=canva',
  Photoshop: 'https://go-skill-icons.vercel.app/api/icons?i=photoshop',
  Illustrator:
    'https://go-skill-icons.vercel.app/api/icons?i=illustrator',
  Blender: 'https://go-skill-icons.vercel.app/api/icons?i=blender',
  'VS Code': 'https://go-skill-icons.vercel.app/api/icons?i=vscode',
  Cursor: 'https://go-skill-icons.vercel.app/api/icons?i=cursor',
  Antigravity:
    'https://go-skill-icons.vercel.app/api/icons?i=googleantigravity',
  ChatGPT: 'https://go-skill-icons.vercel.app/api/icons?i=chatgpt',
  Copilot: 'https://go-skill-icons.vercel.app/api/icons?i=githubcopilot',
  Gemini: 'https://go-skill-icons.vercel.app/api/icons?i=gemini',
  Claude: 'https://go-skill-icons.vercel.app/api/icons?i=claude',
  Grok: 'https://go-skill-icons.vercel.app/api/icons?i=grok',
  Codex: 'https://go-skill-icons.vercel.app/api/icons?i=codex',
}

export function stackIconUrl(name: string): string | null {
  return STACK_ICONS[name] ?? null
}

/** Fake contribution levels 0-4 for a year-ish grid (52 weeks x 7) */
export function buildContributionGrid(seed = 42): number[][] {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  return Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => {
      const r = rand()
      if (r < 0.35) return 0
      if (r < 0.55) return 1
      if (r < 0.75) return 2
      if (r < 0.9) return 3
      return 4
    }),
  )
}

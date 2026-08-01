export const site = {
  name: 'Zenn',
  brand: 'ZennCode',
  title: 'Full-Stack Developer',
  email: 'zenjanarce8@gmail.com',
  tagline: 'Full-stack developer building modern web apps & digital products.',
  socials: {
    github: 'https://github.com/Zenncode',
    githubUser: 'Zenncode',
    linkedin: 'https://www.linkedin.com/in/zenjan-arce-7ab06a427/',
    instagram: 'https://www.instagram.com/zenncode/',
    youtube: 'https://youtube.com/@zenncode',
    tiktok: 'https://tiktok.com/@zenncode',
    twitter: 'https://x.com/zenncode',
  },
}

export const hero = {
  p1: "I'm a full-stack engineer. I build modern web & mobile apps, and these days I'm focused on shipping polished products.",
  p2: "Right now I'm building cool new stuff every day. I love turning rough ideas into things people actually use.",
}

/** Stats under hero — value + single uppercase label (bryllim style) */
export const stats = [
  { value: '3+', label: 'SHIPPING', href: '#projects' },
  { value: '20+', label: 'PROJECTS', href: '#projects' },
  { value: '5x', label: 'HACKATHONS', href: '#hackathons' },
  { value: '∞', label: 'CURIOSITY', href: '#stack' },
]

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMinutes: number
  cover?: string
  body?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'build-in-public-without-burning-out',
    title: 'Build in Public Without Burning Out',
    excerpt:
      'How I share progress, ship consistently, and still protect deep work time when everything wants my attention.',
    date: 'Jul 2026',
    readMinutes: 2,
    cover:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    body: 'Building in public is useful — until it becomes performance. This note is about shipping work people can use while keeping craft at the center.',
  },
  {
    slug: 'my-dev-setup-2026',
    title: 'My Dev Setup in 2026',
    excerpt:
      'Editor, terminal, AI tools, and the boring defaults that make me faster every single day.',
    date: 'Jun 2026',
    readMinutes: 1,
    cover:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    body: 'Tools should disappear. Here is the stack I actually reach for when I need to ship, not when I need to tweet about shipping.',
  },
  {
    slug: 'demos-are-not-products',
    title: 'Demos Are Not Products',
    excerpt:
      'What I think about when turning flashy prototypes into software people can trust and actually use.',
    date: 'Jun 2026',
    readMinutes: 3,
    cover:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    body: 'A good demo optimizes for wow. A good product optimizes for trust. Guardrails, empty states, and recovery paths are the unglamorous middle.',
  },
]

export type Project = {
  id: string
  name: string
  description: string
  /** Small award / ranking lines above the card (like “#1 Finance App”) */
  highlights?: string[]
  accent: string
  icon: string
  links?: { label: string; href: string }[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'orbit',
    name: 'Orbit — Analytics',
    description:
      'A real-time analytics dashboard with beautiful charts, roles, and dark-mode first design.',
    highlights: ['#1 Product Hunt', 'Featured dashboard'],
    accent: '#171717',
    icon: '◉',
    featured: true,
    links: [
      { label: 'Live', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    id: 'nova',
    name: 'Nova — Notes',
    description:
      'A minimal markdown note app with offline-first sync, tags, and keyboard-driven UX.',
    highlights: ['Open Source', 'Offline-first'],
    accent: '#262626',
    icon: '✎',
    featured: true,
    links: [
      { label: 'Live', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    id: 'pulse',
    name: 'Pulse — API Kit',
    description:
      'Lightweight REST + WebSocket toolkit for shipping prototypes without the boilerplate.',
    highlights: ['Developer Tool', 'API first'],
    accent: '#404040',
    icon: '⚡',
    featured: true,
    links: [
      { label: 'Docs', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
]

export type OtherProject = {
  name: string
  category: string
  description: string
  href: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'Capstone Lab',
    category: 'EdTech',
    description: 'Project ideas and scaffolding for CS students.',
    href: '#',
  },
  {
    name: 'Resume Forge',
    category: 'Web App',
    description: 'ATS-friendly resume builder with clean templates.',
    href: '#',
  },
  {
    name: 'Signal Desk',
    category: 'Platform',
    description: 'Lightweight issue tracker for small teams.',
    href: '#',
  },
  {
    name: 'Harbor CMS',
    category: 'Enterprise',
    description: 'Content workflows for marketing sites.',
    href: '#',
  },
]

export type Experience = {
  year: string
  role: string
  company: string
}

export const experience: Experience[] = [
  { year: '2025', role: 'Full-Stack Developer', company: 'ZennCode Studio' },
  { year: '2024', role: 'Frontend Engineer', company: 'Pixel Labs' },
  { year: '2023', role: 'Software Developer', company: 'Startup Co.' },
  { year: '2022', role: 'Freelance Developer', company: 'Independent' },
]

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

export const experienceFull: ExperienceCompany[] = [
  {
    company: 'ZennCode Studio',
    initials: 'ZC',
    type: 'Full-time',
    location: 'Remote',
    duration: '2025 – Present',
    roles: [
      {
        title: 'Full-Stack Developer',
        range: 'Jan 2025 – Present',
        bullets: [
          'Building products end-to-end for clients and side projects.',
          'Owned design systems, APIs, and deployment pipelines.',
        ],
        skills: ['React', 'TypeScript', 'Node.js'],
      },
    ],
  },
  {
    company: 'Pixel Labs',
    initials: 'PL',
    type: 'Full-time',
    location: 'Hybrid',
    duration: '2024 – 2025',
    roles: [
      {
        title: 'Frontend Engineer',
        range: '2024 – 2025',
        bullets: [
          'Shipped design systems and high-traffic React apps.',
          'Improved performance and accessibility across core flows.',
        ],
        skills: ['React', 'Vite', 'CSS'],
      },
    ],
  },
  {
    company: 'Startup Co.',
    initials: 'SC',
    type: 'Full-time',
    duration: '2023 – 2024',
    roles: [
      {
        title: 'Software Developer',
        range: '2023 – 2024',
        bullets: [
          'Owned features across the stack — APIs to UI.',
          'Collaborated with product on rapid MVP iterations.',
        ],
        skills: ['Node.js', 'PostgreSQL', 'React'],
      },
    ],
  },
  {
    company: 'Independent',
    initials: 'IN',
    type: 'Freelance',
    duration: '2022 – 2023',
    roles: [
      {
        title: 'Freelance Developer',
        range: '2022 – 2023',
        bullets: [
          'Websites, tools, and experiments for early founders.',
        ],
        skills: ['JavaScript', 'WordPress', 'Figma'],
      },
    ],
  },
]

export const stack = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Tailwind',
  'Framer Motion',
  'Vite',
]

export const stackGroups: { title: string; items: string[] }[] = [
  {
    title: 'Frontend',
    items: [
      'TypeScript',
      'React',
      'Next.js',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
    ],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Python', 'PostgreSQL', 'REST', 'GraphQL'],
  },
  {
    title: 'DevOps & Cloud',
    items: ['AWS', 'Docker', 'GitHub Actions', 'Vercel'],
  },
  {
    title: 'AI & Tools',
    items: ['OpenAI', 'Claude', 'LangChain', 'Git', 'Figma'],
  },
]

export type Certification = {
  name: string
  issuer: string
  verify?: string
  color: string
  letter: string
  group: string
}

export const certifications: Certification[] = [
  {
    name: 'Meta Front-End Developer',
    issuer: 'Meta',
    verify: '#',
    color: '#171717',
    letter: 'M',
    group: 'Engineering',
  },
  {
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    verify: '#',
    color: '#262626',
    letter: 'A',
    group: 'Cloud & DevOps',
  },
  {
    name: 'Google UX Design',
    issuer: 'Google',
    verify: '#',
    color: '#404040',
    letter: 'G',
    group: 'Design',
  },
]

export type Recommendation = {
  quote: string
  name: string
  title: string
  initials: string
}

export const recommendations: Recommendation[] = [
  {
    quote:
      'Zenn is the kind of engineer who ships quality without drama. Fast learner, great communicator, and always thinking about the user.',
    name: 'Alex Rivera',
    title: 'Product Lead · Example Co.',
    initials: 'AR',
  },
  {
    quote:
      'Working with Zenn was a real pleasure. Consistently high-quality work, proactive about learning, and a genuine team player.',
    name: 'Jordan Lee',
    title: 'Senior Software Engineer',
    initials: 'JL',
  },
  {
    quote:
      "One of the most talented developers I've mentored. Passionate about craft, delivers on time, and lifts the whole team.",
    name: 'Sam Chen',
    title: 'Engineering Manager',
    initials: 'SC',
  },
]

export type Affiliation = {
  name: string
  role: string
  emoji: string
}

export const affiliations: Affiliation[] = [
  { name: 'Devs Local', role: 'Member', emoji: '💻' },
  { name: 'Open Source PH', role: 'Contributor', emoji: '🌐' },
  { name: 'Build Club', role: 'Founder', emoji: '🚀' },
]

export type Hackathon = {
  name: string
  result: string
  org: string
  featured?: boolean
}

export const hackathons: Hackathon[] = [
  {
    name: 'City Open Innovation Hackathon',
    result: 'Champion · 2025',
    org: 'Featured',
    featured: true,
  },
  {
    name: 'AI Builders Challenge',
    result: 'Finalist',
    org: 'Google',
  },
  {
    name: 'Climate Code Sprint',
    result: 'Finalist',
    org: 'packetHACKS',
  },
  {
    name: 'Campus CodeBreak',
    result: 'Champion',
    org: 'Tenext.ai',
  },
  {
    name: 'Hack the Future',
    result: 'Champion',
    org: 'Kaya Founders',
  },
]

export const communities = [
  { name: 'YouTube', handle: '@zenncode', href: site.socials.youtube },
  { name: 'TikTok', handle: '@zenncode', href: site.socials.tiktok },
]

export const founded = [
  { name: 'Build Club', href: '#', detail: 'community for makers' },
  { name: 'Devs100', href: '#', detail: 'devs100.com' },
]

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

export const contributionCount = 1842

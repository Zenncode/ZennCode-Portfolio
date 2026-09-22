/**
 * Ask Anything knowledge engine — hardcoded answers about Zenjan,
 * matched against free-form questions (English + Tagalog).
 *
 * How it works: every entry lists keyword phrases ("hints"). The query
 * is normalized, each entry is scored by the hints it contains, and the
 * best-scoring entry wins. Questions can be random — as long as they
 * contain the right hints, they get the right answer.
 */
import {
  affiliations,
  communities,
  contributionCount,
  experience,
  hero,
  projects,
  site,
  stack,
  stats,
} from '../data/portfolio'

export type AssistantLink = {
  label: string
  /** Internal paths (starting with `/`) navigate; anything else opens in a new tab. */
  href: string
}

export type AssistantAnswer = {
  title: string
  body: string
  links?: AssistantLink[]
}

type Entry = {
  hints: string[]
  answer: AssistantAnswer
}

/** Lowercase, strip punctuation, collapse whitespace. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Score an entry: for each hint, +1 per word if the hint appears.
 * Single-word hints match whole tokens, or tokens that start with the
 * hint (so "internships" hits "intern", "projects" hits "project").
 * Multi-word hints match as phrases. Single-word matching for very
 * short hints ("hi", "yo") is exact-token only to avoid false hits
 * like "which" or "your".
 */
function scoreEntry(tokens: string[], text: string, hints: string[]): number {
  let score = 0
  for (const hint of hints) {
    const words = hint.split(' ')
    if (words.length === 1) {
      const h = words[0]
      if (tokens.includes(h)) {
        score += 1
      } else if (h.length >= 4 && tokens.some((t) => t.startsWith(h))) {
        score += 1
      }
    } else if (text.includes(hint)) {
      score += words.length
    }
  }
  return score
}

const projectNames = projects.map((p) => p.name).join(', ')
const topStack = stack.slice(0, 9).join(', ')
const affiliationNames = affiliations
  .map((a) => `${a.name} (${a.role})`)
  .join('; ')
const communityNames = communities
  .map((c) => `${c.name} ${c.handle}`)
  .join(', ')
const experienceLines = experience
  .map((e) => `• ${e.year}: ${e.role} — ${e.company}`)
  .join('\n')

const ENTRIES: Entry[] = [
  {
    hints: [
      'who is zenjan',
      'sino si zenjan',
      'sino si zenn',
      'who are you',
      'sino ka',
      'about yourself',
      'about zenjan',
      'about zenncode',
      'introduce yourself',
      'pakilala',
      'magpakilala',
      'yourself',
      'bio',
      'profile',
      'zenjan',
      'zenncode',
    ],
    answer: {
      title: 'Who is Zenjan?',
      body: `I'm Zenjan Kiervin B. Arce (ZennCode) — a Software Engineer working across modern web, mobile, and IoT systems.\n\n${hero.p1}\n\n${hero.p2}`,
      links: [
        { label: 'Experience', href: '/experience' },
        { label: 'Projects', href: '/projects' },
      ],
    },
  },
  {
    hints: [
      'what do you do',
      'what is your job',
      'anong trabaho',
      'trabaho mo',
      'work',
      'job',
      'role',
      'title',
      'profession',
      'software engineer',
    ],
    answer: {
      title: 'What does Zenjan do?',
      body: `${site.tagline}\n\nI do IoT integration end to end — hardware and sensor setup plus the software side: firmware, APIs, and dashboards. Open to internships and entry-level opportunities.`,
      links: [
        { label: 'Tech stack', href: '/stack' },
        { label: 'Experience', href: '/experience' },
      ],
    },
  },
  {
    hints: [
      'tech stack',
      'stack',
      'technologies',
      'programming language',
      'languages',
      'tools you use',
      'anong tech',
      'tech',
      'coding',
    ],
    answer: {
      title: "Zenjan's tech stack",
      body: `Core stack: ${topStack}.\n\nPlus frontend (React, Next.js, Vue, Angular, Tailwind, Laravel), backend (Node.js, Express, .NET), mobile (Flutter, React Native, Expo), IoT & embedded (Arduino, hardware integration, soldering, PCB assembly), databases (MySQL, PostgreSQL, MongoDB, Firebase), and AI tooling (ChatGPT, Copilot, Gemini, Claude, Grok, Codex).`,
      links: [{ label: 'Full stack', href: '/stack' }],
    },
  },
  {
    hints: [
      'education',
      'school',
      'nag-aral',
      'saan nag-aral',
      'eskwela',
      'pinag-aralan',
      'college',
      'university',
      'pup',
      'background',
      'experience',
    ],
    answer: {
      title: 'Education & experience',
      body: `${experienceLines}\n\nDiploma in Information Technology student at PUP Lopez (2023 – Present), NCII passer in Electronic Product Assembly and Servicing (EPAS), and former iBITS Coordinator (2024–2025).`,
      links: [{ label: 'Experience', href: '/experience' }],
    },
  },
  {
    hints: ['ibits', 'coordinator', 'student organization', 'org'],
    answer: {
      title: 'iBITS — Coordinator (2024–2025)',
      body: 'Institute of Brilliant Information Technology Students (iBITS) — student organization at PUP Lopez. Zenjan served as Coordinator: organizing activities, supporting members, and practicing leadership, teamwork, and communication.',
      links: [{ label: 'Affiliations', href: '/affiliations' }],
    },
  },
  {
    hints: ['picspro', 'pics', 'cyber security', 'cybersecurity', 'cyber'],
    answer: {
      title: 'PICSPro — Member',
      body: 'Philippine Institute of Cyber Security Professionals (PICSPro) — the non-profit advocating for a secure Philippine cyberspace. Zenjan is a member.',
      links: [{ label: 'Affiliations', href: '/affiliations' }],
    },
  },
  {
    hints: [
      'ncii',
      'nc2',
      'tesda',
      'certification',
      'certificate',
      'certified',
      'passer',
      'cert',
    ],
    answer: {
      title: 'Certifications',
      body: 'Zenjan is an NCII passer in Electronic Product Assembly and Servicing (EPAS) — soldering and de-soldering, PCB mounting from layout diagrams, and installing boards into enclosures with proper cable management.',
      links: [{ label: 'Experience', href: '/experience' }],
    },
  },
  {
    hints: [
      'projects',
      'project',
      'portfolio',
      'gawa mo',
      'ginawa',
      'apps you built',
      'built',
      'applications',
    ],
    answer: {
      title: 'Featured projects',
      body: `Featured builds: ${projectNames}.\n\nPersonal builds and work products grounded on GitHub — public repos link out, private work shows as name + blurb only.`,
      links: [{ label: 'All projects', href: '/projects' }],
    },
  },
  {
    hints: ['flood sense', 'floodsense', 'flood', 'drrm', 'baha'],
    answer: {
      title: 'Admin Flood Sense',
      body: 'FloodSense Console — admin dashboard for the Barangay DRRM Flood Sense system. Live demo available on the Projects page.',
      links: [
        { label: 'Projects', href: '/projects' },
        { label: 'Live demo', href: 'https://admin-flood-sense.web.app/login' },
      ],
    },
  },
  {
    hints: ['uzaro', 'electric', 'ev', 'charging'],
    answer: {
      title: 'Electric Uzaro Tech',
      body: 'Super Admin & Operations Portal — manages Electric Uzaro EV operations and charging networks. Live demo available on the Projects page.',
      links: [
        { label: 'Projects', href: '/projects' },
        { label: 'Live demo', href: 'https://electricuzarotech.web.app/login' },
      ],
    },
  },
  {
    hints: ['onefile', 'one file', 'project one', 'file management'],
    answer: {
      title: 'OneFileManagement (Project ONE)',
      body: 'Project ONE — all-in-one file management web app for documents, media, PDFs, and more in a single workspace.',
      links: [
        { label: 'Projects', href: '/projects' },
        { label: 'Live demo', href: 'https://onefilemanagement.web.app/' },
      ],
    },
  },
  {
    hints: [
      'contact',
      'email',
      'reach you',
      'message you',
      'kausapin',
      'macontact',
      'phone',
      'number',
    ],
    answer: {
      title: 'Contact Zenjan',
      body: `Email is the fastest way to reach Zenjan: ${site.email}.\n\nFor work, collabs, or just to say hi — drop a line anytime.`,
      links: [
        { label: `Email ${site.email}`, href: `mailto:${site.email}` },
        { label: 'GitHub', href: site.socials.github },
        { label: 'LinkedIn', href: site.socials.linkedin },
      ],
    },
  },
  {
    hints: ['github', 'git hub', 'repo', 'repository', 'repos', 'code'],
    answer: {
      title: 'GitHub',
      body: `Find Zenjan on GitHub at ${site.socials.githubUser} — ${contributionCount.toLocaleString()} contributions and counting, spanning web, mobile, IoT, games, and npm packages (zenncode, zenntechinc-cli).`,
      links: [{ label: 'Open GitHub', href: site.socials.github }],
    },
  },
  {
    hints: ['linkedin', 'linked in', 'resume background', 'professional'],
    answer: {
      title: 'LinkedIn',
      body: 'Connect with Zenjan on LinkedIn for professional background, recommendations, and work history.',
      links: [{ label: 'Open LinkedIn', href: site.socials.linkedin }],
    },
  },
  {
    hints: ['youtube', 'yt', 'videos', 'channel', 'vlog'],
    answer: {
      title: 'YouTube',
      body: 'Zenjan shares what he is learning on YouTube at @zenncode.',
      links: [{ label: 'YouTube @zenncode', href: site.socials.youtube }],
    },
  },
  {
    hints: ['tiktok', 'tik tok', 'shorts'],
    answer: {
      title: 'TikTok',
      body: 'Short-form building and learning content on TikTok at @zenncode.',
      links: [{ label: 'TikTok @zenncode', href: site.socials.tiktok }],
    },
  },
  {
    hints: ['instagram', 'ig', 'insta'],
    answer: {
      title: 'Instagram',
      body: 'Follow the journey on Instagram at @zenncode.',
      links: [{ label: 'Instagram', href: site.socials.instagram }],
    },
  },
  {
    hints: ['twitter', 'x account', 'tweet'],
    answer: {
      title: 'X (Twitter)',
      body: 'Zenjan is on X at @zenncode.',
      links: [{ label: 'X / Twitter', href: site.socials.twitter }],
    },
  },
  {
    hints: [
      'where are you',
      'where do you live',
      'saan ka',
      'taga saan',
      'location',
      'address',
      'nakatira',
      'lopez',
      'quezon',
      'philippines',
      'pilipinas',
    ],
    answer: {
      title: 'Location',
      body: 'Zenjan is based in Lopez, Quezon, Philippines — studying at PUP Lopez (Brgy. Burgos) and working on projects remotely.',
    },
  },
  {
    hints: [
      'hire',
      'hiring',
      'jobs',
      'available',
      'availability',
      'internship',
      'intern',
      'ojt',
      'open to work',
      'work with you',
      'freelance',
      'collab',
      'collaborate',
      'employ',
      'job opening',
    ],
    answer: {
      title: 'Available for work?',
      body: 'Yes — open to internships and entry-level opportunities, plus brand collaborations and creative projects. Email is the best way to start the conversation.',
      links: [
        { label: `Email ${site.email}`, href: `mailto:${site.email}` },
        { label: 'Experience', href: '/experience' },
      ],
    },
  },
  {
    hints: ['resume', 'cv', 'curriculum vitae'],
    answer: {
      title: 'Resume',
      body: 'Grab the resume template from the Shop page, or email Zenjan directly for the latest CV.',
      links: [
        { label: 'Shop', href: '/shop' },
        { label: `Email ${site.email}`, href: `mailto:${site.email}` },
      ],
    },
  },
  {
    hints: ['blog', 'article', 'articles', 'post', 'posts', 'sulat', 'thoughts'],
    answer: {
      title: 'Blog',
      body: 'Thoughts, tutorials, and notes on AI, engineering, and building things. No posts published yet — check back soon.',
      links: [{ label: 'Blog', href: '/blog' }],
    },
  },
  {
    hints: ['services', 'offer', 'offers', 'consulting', 'paano magpagawa', 'rates', 'rate', 'price', 'presyo', 'magkano'],
    answer: {
      title: 'Services',
      body: 'Open to web builds, collaborations, and creative projects. No fixed rate card published — email with your project details for a quote.',
      links: [{ label: `Email ${site.email}`, href: `mailto:${site.email}` }],
    },
  },
  {
    hints: ['iot', 'hardware', 'arduino', 'sensor', 'sensors', 'firmware', 'embedded', 'robotics', 'electronics'],
    answer: {
      title: 'IoT & hardware',
      body: 'IoT end to end — hardware and sensor setup plus firmware, APIs, and dashboards. Backed by an NCII in Electronic Product Assembly and Servicing: soldering, PCB mounting, and board installation.',
      links: [
        { label: 'Tech stack', href: '/stack' },
        { label: 'Projects', href: '/projects' },
      ],
    },
  },
  {
    hints: ['community', 'content', 'creator', 'followers', 'channel'],
    answer: {
      title: 'Community & content',
      body: `${communityNames} — builders welcome. That's where Zenjan shares what he's learning.`,
    },
  },
  {
    hints: ['recommendation', 'testimonial', 'endorse', 'review', 'feedback'],
    answer: {
      title: 'Recommendations',
      body: 'No public recommendations listed yet — check LinkedIn for endorsements from leaders, teammates, and mentors.',
      links: [{ label: 'Open LinkedIn', href: site.socials.linkedin }],
    },
  },
  {
    hints: ['shop', 'buy', 'bili', 'products', 'merch'],
    answer: {
      title: 'Shop',
      body: 'Digital products like the developer resume template live in the Shop. Nothing listed publicly right now besides the template.',
      links: [{ label: 'Shop', href: '/shop' }],
    },
  },
  {
    hints: ['gear', 'setup', 'desk', 'gadgets', 'equipment', 'uses'],
    answer: {
      title: 'Gear',
      body: 'Desk setup and everyday carry — no gear listed publicly yet. Email if you want a setup rundown.',
      links: [{ label: `Email ${site.email}`, href: `mailto:${site.email}` }],
    },
  },
  {
    hints: ['game', 'play', 'laro', 'playground', 'wasd', 'pixel'],
    answer: {
      title: 'Pixel playground',
      body: 'The mini office on the home page is a playable pixel scene — use WASD or arrow keys to walk around. Footsteps and bump sounds included.',
    },
  },
  {
    hints: ['affiliation', 'member of', 'member', 'organizations', 'orgs', 'kasapi'],
    answer: {
      title: 'Affiliations',
      body: `${affiliationNames}.`,
      links: [{ label: 'Affiliations', href: '/affiliations' }],
    },
  },
  {
    hints: ['stats', 'numbers', 'achievements', 'highlights'],
    answer: {
      title: 'Highlights',
      body: `${stats.map((s) => `${s.value} — ${s.label}`).join('\n')}\n\n${contributionCount.toLocaleString()} GitHub contributions and counting.`,
    },
  },
  {
    hints: ['hello', 'hi', 'hey', 'kumusta', 'kamusta', 'yo', 'sup', 'magandang'],
    answer: {
      title: 'Hey! 👋',
      body: 'Hey! Ask me anything about Zenjan — who he is, his stack, projects, experience, or how to contact him. Try "who is zenjan?" or "ano tech stack niya?"',
    },
  },
  {
    hints: ['thank', 'salamat', 'thanks', 'tnx', 'ty'],
    answer: {
      title: "You're welcome!",
      body: 'Walang anuman! Anything else you want to know about Zenjan?',
    },
  },
  {
    hints: ['bye', 'paalam', 'goodbye', 'see you'],
    answer: {
      title: 'Paalam! 👋',
      body: 'Thanks for dropping by! For work or collabs, Zenjan is one email away.',
      links: [{ label: `Email ${site.email}`, href: `mailto:${site.email}` }],
    },
  },
]

/** Example questions shown when nothing matches. */
export const SUGGESTIONS = [
  'Who is Zenjan?',
  'Sino si Zenjan?',
  'Ano tech stack niya?',
  'What projects did he build?',
  'How do I contact him?',
  'Is he open for internships?',
]

/**
 * Answer a free-form question. Returns the best match, or null when
 * nothing matches (caller should show the fallback + suggestions).
 */
export function answerQuestion(query: string): AssistantAnswer | null {
  const text = norm(query)
  if (!text) return null
  const tokens = text.split(' ')
  let best: AssistantAnswer | null = null
  let bestScore = 0
  for (const entry of ENTRIES) {
    // Normalize hints the same way as the query (handles "nag-aral", etc.)
    const s = scoreEntry(
      tokens,
      text,
      entry.hints.map(norm).filter(Boolean),
    )
    if (s > bestScore) {
      bestScore = s
      best = entry.answer
    }
  }
  return bestScore >= 1 ? best : null
}

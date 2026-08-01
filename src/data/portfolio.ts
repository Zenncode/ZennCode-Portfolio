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
/** Hero stats — value + short uppercase label (bryllim home) */
export const stats = [
  { value: '15+', label: 'PROJECTS', href: '#projects' },
  { value: '2+ yrs', label: 'SHIPPING', href: '#experience' },
  { value: 'TS · React', label: 'STACK', href: '/stack' },
  { value: 'Web apps', label: 'FOCUS', href: '#projects' },
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
    slug: 'stop-focusing-only-on-the-ai-model-start-building-ai-harnesses',
    title: 'Stop Focusing Only on the AI Model. Start Building AI Harnesses.',
    excerpt:
      'An AI harness is the system surrounding an AI model that makes it reliable, safe, and dependable. Learn why harness engineering is the next big shift in AI development.',
    date: 'Jul 2026',
    readMinutes: 2,
    cover:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&q=80',
    body: 'Models get the headlines. Harnesses make them shippable. The system around the model — evals, tools, permissions, memory, recovery — is what turns a demo into something you can trust.',
  },
  {
    slug: 'my-setup-poke-mcps-and-a-local-mac-bridge',
    title: 'My Setup: Poke, MCPs, and a Local Mac Bridge',
    excerpt:
      'I finally got my automation stack to a place where it actually works for me instead of the other way around...',
    date: 'Jun 2026',
    readMinutes: 1,
    cover:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&q=80',
    body: 'A practical note on wiring MCPs, local bridges, and the small automation habits that keep tools useful instead of noisy.',
  },
  {
    slug: 'ai-products-need-more-than-a-good-demo',
    title: 'AI Products Need More Than a Good Demo',
    excerpt:
      'What I think about when turning AI demos into products people can trust and use.',
    date: 'Jun 2026',
    readMinutes: 3,
    cover:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&q=80',
    body: 'A good demo optimizes for wow. A good product optimizes for trust — empty states, recovery paths, and the boring middle that makes people stay.',
  },
  {
    slug: 'what-small-mobile-apps-taught-me-about-taste',
    title: 'What Small Mobile Apps Taught Me About Taste',
    excerpt:
      'What focused apps like budget, fitness, and travel tools taught me about product taste.',
    date: 'Jun 2026',
    readMinutes: 2,
    cover:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&q=80',
    body: 'Small apps force taste. When the surface area is tiny, every label, default, and empty state has to earn its place.',
  },
  {
    slug: 'boring-guardrails-make-ai-features-better',
    title: 'Boring Guardrails Make AI Features Better',
    excerpt:
      'Why practical AI guardrails are product decisions, not just technical controls.',
    date: 'Jun 2026',
    readMinutes: 3,
    cover:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop&q=80',
    body: 'Rate limits, confirmations, and scoped tools are not anti-magic — they are how AI features survive contact with real users.',
  },
  {
    slug: 'a-practical-stack-for-shipping-fast',
    title: 'A Practical Stack for Shipping Fast',
    excerpt:
      'How I think about choosing a stack that supports speed without creating painful maintenance.',
    date: 'Jun 2026',
    readMinutes: 2,
    cover:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&q=80',
    body: 'Pick tools you can still love after the third rewrite. Speed matters — so does not hating the codebase in six months.',
  },
  {
    slug: 'the-quiet-work-behind-rag-systems',
    title: 'The Quiet Work Behind RAG Systems',
    excerpt:
      'A practical look at the less glamorous work that makes retrieval augmented generation useful.',
    date: 'Jun 2026',
    readMinutes: 2,
    cover:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80',
    body: 'Chunking, freshness, evals, and failure modes — the quiet work that decides whether RAG feels smart or random.',
  },
  {
    slug: 'observability-is-product-work',
    title: 'Observability Is Product Work',
    excerpt:
      'Why logs, metrics, traces, and AI behavior tracking belong in product thinking from the start.',
    date: 'May 2026',
    readMinutes: 3,
    cover:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80',
    body: 'If you cannot see how a feature fails, you cannot improve it. Observability is how product and engineering stay honest.',
  },
  {
    slug: 'building-in-public-without-performing',
    title: 'Building in Public Without Performing',
    excerpt:
      'A personal note on sharing work online while keeping the actual craft at the center.',
    date: 'May 2026',
    readMinutes: 2,
    cover:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&q=80',
    body: 'Share the work. Skip the performance. Building in public works best when the craft stays louder than the feed.',
  },
  {
    slug: 'what-hackathons-taught-me-about-scope',
    title: 'What Hackathons Taught Me About Scope',
    excerpt:
      'What short build cycles taught me about choosing the smallest complete version of an idea.',
    date: 'May 2026',
    readMinutes: 3,
    cover:
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=300&fit=crop&q=80',
    body: 'Hackathons punish vague scope. The winning move is almost always the smallest version that still feels complete.',
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
  /** App icon image path */
  iconImage?: string
  links?: { label: string; href: string }[]
  featured?: boolean
  press?: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    id: 'tarsi',
    name: 'Tarsi — Budget Tracker',
    description:
      'An offline-first budget & expense tracker powered by on-device AI.',
    highlights: [
      '#1 Finance App',
      'App Store Hidden Gems',
      'Apps Made in the Philippines',
    ],
    accent: '#0f766e',
    icon: '₱',
    iconImage: '/apps/tarsi.jpg',
    featured: true,
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/',
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/',
      },
    ],
    press: [
      { label: 'Tap & Swipe — Case Study', href: '#' },
      { label: 'Fintech News PH', href: '#' },
      { label: 'NextGen Tools', href: '#' },
    ],
  },
  {
    id: 'kabi',
    name: 'Kabi — Gym Bro',
    description:
      'A gym companion for tracking workouts and staying consistent.',
    highlights: ['#1 Paid Fitness App'],
    accent: '#b45309',
    icon: '🏋',
    iconImage: '/apps/kabi.jpg',
    featured: true,
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/' },
      { label: 'Google Play', href: 'https://play.google.com/' },
    ],
  },
  {
    id: 'mayi',
    name: 'Mayi — Travel Buddy',
    description: 'A travel buddy for planning trips and exploring on the go.',
    highlights: ['#1 Paid Travel App'],
    accent: '#1d4ed8',
    icon: '✈',
    iconImage: '/apps/mayi.jpg',
    featured: true,
    links: [{ label: 'App Store', href: 'https://apps.apple.com/' }],
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
    name: 'Seam',
    category: 'Generative AI',
    description: 'An AI-native platform for spiritual exploration and learning.',
    href: '#',
  },
  {
    name: 'Tunai',
    category: 'Generative AI',
    description: 'An AI-powered social media fact-checker.',
    href: '#',
  },
  {
    name: 'BOOQED',
    category: 'Platform',
    description: 'A leading workspace booking platform based in Singapore.',
    href: '#',
  },
  {
    name: 'CodeCred',
    category: 'Platform',
    description:
      'Online certifications for programmers — verifiable, skills-based credentials.',
    href: '#',
  },
  {
    name: 'Capstone Generator',
    category: 'Generative AI',
    description: 'An online capstone project generator for IT & CS students.',
    href: '#',
  },
  {
    name: 'Resume Builder',
    category: 'Web App',
    description: 'A Harvard-style, ATS-friendly resume builder.',
    href: '#',
  },
  {
    name: 'PackBack',
    category: 'EdTech · AI',
    description: 'Student instructional AI.',
    href: '#',
  },
  {
    name: 'Cambridge South Africa',
    category: 'EdTech · AI',
    description: 'An AI teacher assistant for Foundation Phase classrooms.',
    href: '#',
  },
  {
    name: 'Maldives International Education',
    category: 'EdTech · AI',
    description: 'AI-powered lesson planning for educators.',
    href: '#',
  },
  {
    name: 'SEANOGY',
    category: 'Platform',
    description: 'An energy management and sustainability platform.',
    href: '#',
  },
  {
    name: 'Petrogreen Energy',
    category: 'Enterprise',
    description: 'A central power-plant monitoring system.',
    href: '#',
  },
  {
    name: 'DOST-FNRI',
    category: 'Government',
    description: 'A nutritional database and calorie counter.',
    href: '#',
  },
  {
    name: 'Interlace',
    category: 'Web App',
    description: 'A site for an architecture & design studio.',
    href: '#',
  },
  {
    name: 'UAPSA',
    category: 'Web App',
    description: 'Event management platform and landing page.',
    href: '#',
  },
]

/** Brand logos for collabs page */
export const collabBrands: { name: string; src: string }[] = [
  { name: 'Apple', src: '/brands/apple.svg' },
  { name: 'Cisco', src: '/brands/cisco.svg' },
  { name: 'AWS', src: '/brands/aws.png' },
  { name: 'Cursor', src: '/brands/cursor.svg' },
  { name: 'Replit', src: '/brands/replit.svg' },
]

export type ConsultingOffer = {
  id: string
  title: string
  price: string
  description: string
  bullets: string[]
}

export const consultingOffers: ConsultingOffer[] = [
  {
    id: 'coaching',
    title: 'Private Coaching',
    price: 'from ₱10k/hr',
    description:
      '1:1 mentoring and guidance — career, code, AI, and building products, tailored to where you are.',
    bullets: ['1:1 sessions', 'Career & technical', 'Flexible scheduling'],
  },
  {
    id: 'trainings',
    title: 'AI & Software Trainings',
    price: '₱20k/hr',
    description:
      'Hands-on, practical workshops for teams — generative AI, modern web & mobile, and shipping faster with AI-native tooling.',
    bullets: ['Team workshops', 'Custom curriculum', 'On-site or remote'],
  },
  {
    id: 'fractional-cto',
    title: 'Fractional CTO',
    price: 'Custom',
    description:
      'Technical leadership without a full-time hire — architecture, roadmap, hiring, and hands-on execution for founders and teams.',
    bullets: ['Architecture & strategy', 'Team & hiring', 'Hands-on delivery'],
  },
  {
    id: 'software',
    title: 'Software Development',
    price: 'Custom',
    description:
      'End-to-end product builds — web apps, mobile apps, and AI products, from prototype to production.',
    bullets: ['Web & mobile', 'AI products', 'MVP → scale'],
  },
  {
    id: 'automation',
    title: 'Automation & AI Agents',
    price: 'Custom',
    description:
      'Cut manual work with custom automations, integrations, and AI agents wired directly into your stack.',
    bullets: ['Workflow automation', 'AI agents', 'Integrations'],
  },
  {
    id: 'advisory',
    title: 'AI Advisory',
    price: 'Custom',
    description:
      'Strategy sessions and technical audits to find where AI actually moves the needle for your product or org.',
    bullets: [
      'Opportunity audits',
      'Roadmapping',
      'Technical due diligence',
    ],
  },
]

export type Experience = {
  year: string
  role: string
  company: string
}

export const experience: Experience[] = [
  { year: '2025', role: 'Lead AI Engineer', company: 'Standard Chartered' },
  {
    year: '2025',
    role: 'AI Ops Engineer',
    company: 'Cambridge University Press & Assessment',
  },
  {
    year: '2024',
    role: 'Senior Full Stack Developer',
    company: 'Cambridge University Press & Assessment',
  },
  { year: '2022', role: 'Software Engineering Lead', company: 'PocketDevs' },
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
    company: 'Standard Chartered',
    initials: 'SC',
    type: 'Full-time',
    duration: 'Aug 2025 – Present · 11 mos',
    roles: [
      {
        title: 'Lead AI Engineer',
        range: 'Aug 2025 – Present · 11 mos',
        bullets: [
          'Driving AI initiatives and system-level solutions across key areas of the business. Focused on scalable, secure, and responsible innovation.',
        ],
        skills: [
          'Artificial Intelligence (AI)',
          'Generative AI',
          'System Design',
          'Responsible AI',
        ],
      },
    ],
  },
  {
    company: 'Cambridge University Press & Assessment',
    initials: 'CU',
    type: 'Full-time · 1 yr 2 mos',
    location: 'Makati, National Capital Region, Philippines · Hybrid',
    duration: 'Jul 2024 – Aug 2025',
    roles: [
      {
        title: 'AI Ops Engineer',
        range: 'Feb 2025 – Aug 2025 · 7 mos',
        bullets: [
          "Pioneered the GenAI Centre of Excellence to deliver scalable AI solutions that support the organization's global education and publishing initiatives.",
          'Led GenAI model deployments across Azure Foundry and AWS Bedrock, leveraging Dockerized workflows orchestrated through ECS with Fargate, App Runner, and Amplify. Standardized DevOps practices with CI/CD pipelines, IAM policy hardening, automated EC2/Lambda provisioning, and secure secret management via AWS Secrets Manager and Parameter Store. Integrated centralized observability using CloudWatch for logs, metrics, and alerting.',
          'Architected and deployed a WhatsApp-based lesson planner for South African Foundation Phase educators. The solution utilized Turn.io for conversational UX, n8n for orchestration, and Qdrant for vector search, enabling context-aware, CAPS-aligned lesson plans via a Retrieval-Augmented Generation (RAG) pipeline. Automated document ingestion from structured PDFs into vector stores using LangChain, cutting lesson preparation time by over 70%.',
          'Built an OpenAI-powered shipment status tracker embedded in Zendesk, allowing customer support agents to retrieve real-time updates through natural language prompts. This reduced ticket backlog and improved first-contact resolution rates significantly. Employed agentic workflows to enhance dynamic task execution.',
          "Built and launched a company-wide GenAI Bootcamp initiative to upskill employees globally. Designed modular training paths and developed internal LLM use cases that accelerated adoption of generative AI across departments.",
          "Served as the team's go-to GenAI advisor — collaborating closely with stakeholders on solution design, roadmap planning, and technical feasibility. Regularly delivered architecture reviews, demos, and hands-on consultations to align AI capabilities with business goals.",
        ],
        skills: [
          'n8n',
          'Retrieval-Augmented Generation (RAG)',
          'LangChain',
          'AWS Bedrock',
          'Azure',
        ],
      },
      {
        title: 'Senior Full Stack Developer',
        range: 'Jul 2024 – Feb 2025 · 8 mos',
        bullets: [
          'Led development of high-impact platforms including MyCambridge, Cambridge Login, and Core Identity, used by over 500,000 global users. Integrated multi-tenancy into the MyCambridge portal and implemented role-based access control, enabling granular user permissions across organizations. Contributed to a full UI/UX redesign in React.js to enhance user experience and accessibility.',
          'Audited and optimized AWS infrastructure (EC2, RDS, CloudWatch), reducing monthly cloud costs by 25%. Improved test coverage across core modules, boosting deployment reliability and reducing production issues. Built and deployed an AI assistant tool leveraging the team’s internal knowledge base, enabling instant answers to technical and policy-related queries.',
          'Maintained CI/CD pipelines via Azure DevOps Server, enforced code quality with SonarQube and structured reviews, and implemented observability for system uptime and performance monitoring. Mentored junior developers through pair programming, architecture sessions, and feedback cycles — accelerating onboarding and raising team-wide code quality.',
        ],
        skills: [
          'Azure DevOps Server',
          'Amazon Web Services (AWS)',
          'React.js',
          'SonarQube',
          'CI/CD',
        ],
      },
    ],
  },
  {
    company: 'PocketDevs',
    initials: 'PD',
    type: 'Full-time · 2 yrs 7 mos',
    location: 'Mandaluyong, National Capital Region, Philippines · Hybrid',
    duration: 'Jan 2022 – Jul 2024',
    roles: [
      {
        title: 'Software Engineering Lead',
        range: 'Jan 2022 – Jul 2024 · 2 yrs 7 mos',
        bullets: [
          'Led the design, development, and deployment of 60+ web and mobile applications across industries including fintech, e-commerce, and healthcare.',
          'Architected full-stack solutions using React, React Native, Laravel, and Node.js, with MongoDB for document-based storage. Built rapid MVPs using Webflow, Bubble, and Figma, cutting client validation timelines by 50%.',
          'Managed DevOps pipelines using AWS, GitHub Actions, and Docker, setting up CI/CD workflows, automated testing, environment provisioning, and uptime monitoring.',
          'Oversaw code quality, version control, and agile sprint cycles across a team of 10+ engineers. Delivered production-grade systems with <200ms API latency and 99.9% uptime.',
        ],
        skills: [
          'Solution Architecture',
          'Amazon Web Services (AWS)',
          'React Native',
          'Laravel',
          'Docker',
        ],
      },
    ],
  },
  {
    company: 'Bluewind Asia Corporation',
    initials: 'BA',
    type: 'Full-time · 1 yr 11 mos',
    location: 'Cebu, Central Visayas, Philippines · On-site',
    duration: 'Mar 2020 – Jan 2022',
    roles: [
      {
        title: 'Lead Application Developer',
        range: 'Sep 2021 – Jan 2022 · 5 mos',
        bullets: [
          'Led the system architecture and scaling of client-facing and internal platforms across CRM, smart home, and data engineering projects.',
          'Designed and built a KYC (Know Your Customer) platform with document upload, OCR, and identity verification modules, reducing manual validation time by 70%.',
          'Refactored the legacy CRM into a modular service-based design using PHP, improving response times by 40% and cutting bug reports by over 60%.',
          'Directed the development of the MEC smart home platform, implementing secure authentication (JWT), OTA firmware support, and device telemetry pipelines.',
          "Spearheaded the company's web scraping infrastructure to support high-frequency crawling of real estate listings (500k+ records/month) with proxy rotation and Databricks integration.",
          'Managed a team of 12 developers, enforced Git workflows, introduced CI/CD with GitHub Actions, and standardized code quality practices through peer reviews and automated linting.',
        ],
        skills: [
          'Software Architecture',
          'Full-Stack Development',
          'JWT',
          'Databricks',
          'GitHub Actions',
        ],
      },
      {
        title: 'Application Developer',
        range: 'Mar 2020 – Oct 2021 · 1 yr 8 mos',
        bullets: [
          'Developed a smart home web and mobile app for MEC using React, Node.js, and Swift, enabling real-time IoT control via MQTT and push notifications.',
          'Built internal automation tools with Microsoft Power Apps to digitize manual workflows. Designed and deployed interactive Power BI dashboards for reporting and business insights.',
          'Created a large-scale real estate aggregator that scraped Tokyo rental listings using rotating proxies and Puppeteer, processing over 100,000 listings per month and storing data in Databricks for analytics.',
          'Also developed a modular CRM system for multiple B2B clients using a proprietary PHP framework, reducing client onboarding time by 30%.',
        ],
        skills: [
          'Microsoft Power Platform',
          'Python (Programming Language)',
          'React',
          'Node.js',
          'MQTT',
        ],
      },
    ],
  },
  {
    company: 'Gullas College of Medicine',
    initials: 'GC',
    type: 'Full-time · 4 mos',
    location: 'Cebu City, Cebu, Philippines · On-site',
    duration: 'Jan 2020 – Apr 2020',
    roles: [
      {
        title: 'Software Engineer',
        range: 'Jan 2020 – Apr 2020 · 4 mos',
        bullets: [
          'Led the development of internal systems including the student information system, website, and service request portal using AngularJS, Spring Boot, and PostgreSQL.',
          'Managed the VPS hosting environment and deployments, while mentoring 5 interns. Improved admin efficiency by automating key workflows across departments.',
        ],
        skills: ['AngularJS', 'Spring Boot', 'PostgreSQL', 'VPS'],
      },
    ],
  },
  {
    company: 'GOMO',
    initials: 'GO',
    type: 'Internship · 6 mos',
    location: 'Lapu-Lapu, Central Visayas, Philippines · On-site',
    duration: 'Jul 2019 – Dec 2019',
    roles: [
      {
        title: 'Software Development Intern',
        range: 'Jul 2019 – Dec 2019 · 6 mos',
        bullets: [
          'Developed a procurement system for a local government unit using Laravel, Vue.js, and MySQL. Contributed to front-end UI, RESTful APIs, and database design.',
          'Delivered production-ready features that helped streamline manual procurement processes by over 40%.',
        ],
        skills: ['Laravel', 'Vue.js', 'MySQL', 'REST'],
      },
    ],
  },
]

/** Home “Stack” preview line under experience */
export const stack = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Laravel',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'PyTorch',
  'Claude Code',
]

export const stackGroups: { title: string; items: string[] }[] = [
  {
    title: 'Frontend',
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Vue.js',
      'Tailwind CSS',
      'SCSS',
      'Styled Components',
      'Vite',
      'Webpack',
      'ESLint',
      'Prettier',
    ],
  },
  {
    title: 'Backend',
    items: [
      'Node.js',
      'Python',
      'Java',
      'PHP',
      'Express.js',
      'NestJS',
      'FastAPI',
      'Spring Boot',
      'Laravel',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'DynamoDB',
      'OAuth',
      'JWT',
      'LDAP',
      'REST',
      'GraphQL',
      'gRPC',
      'AWS Lambda',
    ],
  },
  {
    title: 'DevOps & Cloud',
    items: [
      'AWS',
      'GCP',
      'Azure',
      'GitHub Actions',
      'Jenkins',
      'GitLab CI',
      'Terraform',
      'AWS CloudFormation',
      'Docker',
      'Kubernetes',
      'Prometheus',
      'Grafana',
      'Datadog',
    ],
  },
  {
    title: 'AI & Machine Learning',
    items: [
      'TensorFlow',
      'PyTorch',
      'LangChain',
      'Transformers',
      'OpenAI',
      'Anthropic',
      'Mistral',
      'Hugging Face',
      'LlamaIndex',
      'AutoGPT',
      'Claude Code',
      'Codex',
    ],
  },
  {
    title: 'Security & Identity',
    items: [
      'AWS IAM',
      'Azure AD',
      'Okta',
      'SAP CDC',
      'Auth0',
      'Cognito',
      'AES',
      'RSA',
      'SHA',
      'GDPR',
      'SOC 2',
      'ISO 27001',
    ],
  },
  {
    title: 'CMS & No-Code',
    items: [
      'WordPress',
      'Strapi',
      'Bubble',
      'Webflow',
      'Microsoft Power Platform',
      'n8n',
    ],
  },
  {
    title: 'Developer Tools',
    items: [
      'Git',
      'GitHub',
      'GitLab',
      'Bitbucket',
      'VS Code',
      'JetBrains IntelliJ',
      'PyCharm',
      'Slack',
      'Discord',
      'Teams',
      'JIRA',
      'Trello',
      'ClickUp',
    ],
  },
]

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

export const certifications: Certification[] = [
  // AI
  {
    name: 'Generative AI Leader',
    issuer: 'Google',
    logo: '/certs/google.png',
    verify:
      'https://www.credly.com/badges/d4ea07f0-f7f1-4889-8b15-2a0ec22850ff/public_url',
    group: 'AI',
    rot: -2,
    ty: 2,
  },
  {
    name: 'Gemini Certified Educator',
    issuer: 'Google',
    logo: '/certs/google.png',
    verify:
      'https://edu.google.accredible.com/54fb5640-5c6d-4286-b9bb-6be014188c16#acc.V83iLFOE',
    group: 'AI',
    rot: 3,
    ty: -4,
  },
  {
    name: 'Generative AI Certified Professional',
    issuer: 'Oracle',
    logo: '/certs/oracle.png',
    verify:
      'https://catalog-education.oracle.com/pls/certview/sharebadge?id=F0EB18EE68E7EB1AD69624684FB5B8ABB18AC8852C247882BE5DF4E51D7AAB07',
    group: 'AI',
    rot: -1.5,
    ty: 3,
  },
  {
    name: 'Neo4j & Generative AI Certification',
    issuer: 'Neo4j',
    logo: '/certs/neo4j.png',
    verify:
      'https://graphacademy.neo4j.com/c/2be650d5-0038-4c7d-b27f-f96a75f2b843',
    group: 'AI',
    rot: 2,
    ty: -2,
  },
  {
    name: 'Building RAG Apps Using MongoDB',
    issuer: 'MongoDB',
    logo: '/certs/mongodb.png',
    verify:
      'https://www.credly.com/badges/918da15f-0a50-4b07-a642-a89b689fb1b0/linked_in_profile',
    group: 'AI',
    rot: -3,
    ty: 1,
  },
  // Engineering
  {
    name: 'Neo4j Certified Professional',
    issuer: 'Neo4j',
    logo: '/certs/neo4j.png',
    verify:
      'https://graphacademy.neo4j.com/c/a2f83b73-2e2f-4417-89f1-52eb4edeb4bc/',
    group: 'Engineering',
    rot: 1.5,
    ty: -3,
  },
  {
    name: 'Huawei Developer Expert',
    issuer: 'Huawei',
    logo: '/certs/huawei.png',
    verify: 'https://web.facebook.com/photo/?fbid=4320544268000607',
    group: 'Engineering',
    rot: -2.5,
    ty: 2,
  },
  {
    name: 'Software Engineering',
    issuer: 'TestDome',
    logo: '/certs/testdome.png',
    verify: 'https://app.testdome.com/cert/e802401d0f874e78b3e4bceff900c52f',
    group: 'Engineering',
    rot: 2,
    ty: -1,
  },
  {
    name: 'JavaScript',
    issuer: 'TestDome',
    logo: '/certs/testdome.png',
    verify: 'https://app.testdome.com/cert/b83170ca5a9d4315903fcb87885065e5',
    group: 'Engineering',
    rot: -1,
    ty: 3,
  },
  {
    name: 'PHP',
    issuer: 'TestDome',
    logo: '/certs/testdome.png',
    verify: 'https://app.testdome.com/cert/a2bce755a249410b994a1c483ee1cb9a',
    group: 'Engineering',
    rot: 2.5,
    ty: -2,
  },
  {
    name: 'Python',
    issuer: 'TestDome',
    logo: '/certs/testdome.png',
    verify: 'https://app.testdome.com/cert/1176bc33122f4e44847235ce0dac8e37',
    group: 'Engineering',
    rot: -2,
    ty: 1,
  },
  {
    name: 'SQL',
    issuer: 'TestDome',
    logo: '/certs/testdome.png',
    verify: 'https://app.testdome.com/cert/3519cc9c3e194ff7903f597a39b817a8',
    group: 'Engineering',
    rot: 1,
    ty: -3,
  },
  // Cloud
  {
    name: 'Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    logo: '/certs/aws.png',
    verify:
      'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    group: 'Cloud & DevOps',
    rot: -2,
    ty: 2,
  },
  {
    name: 'Monitoring Kubernetes',
    issuer: 'Datadog',
    logo: '/certs/datadog.png',
    verify: 'https://learn.datadoghq.com/certificates/931ulsnp5m',
    group: 'Cloud & DevOps',
    rot: 3,
    ty: -2,
  },
  // Security
  {
    name: 'Cybersecurity Certificate',
    issuer: 'Trend Micro',
    logo: '/certs/trendmicro.png',
    verify:
      'https://pdfhost.io/v/3IkWG5Vua_CyberCert_Completion_Bryl_Kezter_A_Limpdf.pdf',
    group: 'Security',
    rot: -1.5,
    ty: 1,
  },
  // Project Management
  {
    name: 'Scrum Master',
    issuer: 'TestDome',
    logo: '/certs/testdome.png',
    verify: 'https://app.testdome.com/cert/abf47a31a4a94bd4b92572e82078e1c4',
    group: 'Project Management',
    rot: 2,
    ty: -2,
  },
  {
    name: 'Certified Kanban Associate',
    issuer: 'International Scrum Institute',
    logo: '/certs/scrum-institute.png',
    verify:
      'https://www.scrum-institute.org/certifications/Scrum-Institute.org-KANASCe020005',
    group: 'Project Management',
    rot: -2.5,
    ty: 2,
  },
  {
    name: 'Scrum Associate',
    issuer: 'International Scrum Institute',
    logo: '/certs/scrum-institute.png',
    verify:
      'https://www.scrum-institute.org/certifications/Scrum-Institute.org-SAACed8c57e6d',
    group: 'Project Management',
    rot: 1.5,
    ty: -1,
  },
  {
    name: 'Lean Six Sigma White Belt',
    issuer: 'Management & Strategy Institute',
    logo: '/certs/msi.png',
    verify:
      'https://drive.google.com/file/d/1ZhvhYSnWGJfpM-SQ75XT5dwAH-imCODW/view',
    group: 'Project Management',
    rot: -1,
    ty: 3,
  },
  {
    name: 'Project Management Certified',
    issuer: 'Management & Strategy Institute',
    logo: '/certs/msi.png',
    verify: 'https://tinyurl.com/yxnkvp76',
    group: 'Project Management',
    rot: 2.5,
    ty: -3,
  },
  {
    name: 'Diploma in Project Management',
    issuer: 'Alison',
    logo: '/certs/alison.png',
    verify: 'http://shorturl.at/lmuJX',
    group: 'Project Management',
    rot: -3,
    ty: 1,
  },
  // Marketing
  {
    name: 'Google Analytics',
    issuer: 'Google',
    logo: '/certs/google.png',
    verify:
      'https://analytics.google.com/analytics/academy/certificate/uM_PQwkTTqCjtRLTDOejbQ',
    group: 'Marketing & Analytics',
    rot: 1,
    ty: -2,
  },
  {
    name: 'Digital Marketing',
    issuer: 'Google',
    logo: '/certs/google.png',
    verify: 'https://bit.ly/2QBhAex',
    group: 'Marketing & Analytics',
    rot: -2,
    ty: 2,
  },
]

export type Recommendation = {
  quote: string
  name: string
  title: string
  initials: string
  date?: string
}

export const recommendations: Recommendation[] = [
  {
    quote:
      'Bryl, I believe, would be the next Philippine unicorn. He is technically skilled.',
    name: 'Henry Aguda',
    title:
      'Secretary, Department of Information and Communications Technology (DICT)',
    initials: 'HA',
  },
  {
    quote:
      "Bryl has been instrumental in PocketDevs' growth since day one. As our Software Engineering Lead, he's not just a strong developer—he's a true builder. From leading key projects to mentoring the team, Bryl consistently delivers high-quality solutions and forward-thinking ideas. His leadership, technical depth, and ability to turn vision into reality make him an invaluable asset to any team.",
    name: 'Eric Jeremie Rotaquio',
    title: 'Chief Executive Officer at PocketDevs',
    initials: 'ER',
    date: 'Aug 2025',
  },
  {
    quote:
      'I had the pleasure of working with Bryl at Cambridge University Press and Assessment where he was one of our AI Engineers in our Gen AI Centre of Excellence. Bryl was always positive, approachable and had the ability to come up with strong solutions and approaches.\n\nTechnically, Bryl was very strong, able to deliver good quality deliverables. Whether that was coding solutions or identifying low/no code options, he had the technical skills to know what was best.\n\nOne of his key strengths was his people skills, able to easily work and communicate with our stakeholders, (many that were quite senior) present solutions or demo our POCs with confidence and a smile! I recommend Bryl for any engineering roles, especially in the AI and automation space. All the best Bryl!',
    name: 'Todd Milne',
    title: 'Digital Product Specialist',
    initials: 'TM',
    date: 'Aug 2025',
  },
  {
    quote:
      "I've only had the chance to work with Bryl briefly, but even in that short time, it was clear how much passion and depth of knowledge he brings to his work.\n\nFrom day one, he stood out as someone who cares about what he's building and is always looking for ways to improve not just the product, but the process and the team around him. He approaches problems with a thoughtful, technical mindset and consistently contributes ideas that move things forward. Any team would benefit from having someone like Bryl—not only for the technical strength he brings, but for the energy and perspective that make him such a valuable teammate.",
    name: 'Ryan Yao',
    title: 'AI Dev @ Cambridge University Press and Assessment',
    initials: 'RY',
    date: 'Aug 2025',
  },
  {
    quote:
      "It was a real pleasure to work with Bryl. He's not only a fantastic professional who consistently delivers high-quality work, but he's also an amazing person to have on the team. He was always willing to lend a hand, and his proactive approach to learning new technologies was truly impressive. Beyond his skills, his positive attitude and willingness to build strong team relationships made him an invaluable colleague and a great friend. I'm confident he'll make a success of wherever his career takes him, and I truly hope our paths cross again.",
    name: 'Joshua Shailes',
    title: 'Senior AI Data Scientist',
    initials: 'JS',
    date: 'Jul 2025',
  },
  {
    quote:
      'Bryl is one of the most reliable developers that I have worked with to date. His quick executions and concept building skills helped our team to deliver most of our projects. He has always provided insightful feedback both on the strategic and technical aspects of our work within the team. He is also well-aware of the field that we work in and has been constantly sharing new finds within this space. Along with all of this knowledge that he holds, he is also a very approachable person and communicates well with everyone who wants to learn from him.\n\nIn and out of work, it\'s never boring to have him around. His quick wit has made our heavy responsibilities much lighter, improving the morale of the team. I had many great conversations with him, and I always look forward to more. I highly recommend Bryl to anyone who is looking for a reliable and knowledgeable developer who can also bring a positive vibe to the team. I\'m glad to have him around and I hope to work with him again in the future.',
    name: 'Jecho Carlos',
    title: 'Building AI software that actually makes sense | jechocarlos.dev',
    initials: 'JC',
    date: 'Jul 2025',
  },
  {
    quote:
      "I've had the privilege of working with Bryl on several projects across two different teams and he's genuinely one of those teammates who raises the bar for everyone around him.\n\nWhether we were building web platforms or working on AI applications, Bryl consistently brought strong domain knowledge in AI, software engineering and DevOps. He's the kind of engineer who not only delivers results quickly but also ensures high-quality output every time. But what makes him stand out even more is how easy he is to work with - collaborative, thoughtful, and always willing to lend a hand no matter how busy he is.\n\nAs a senior in the team, Bryl leads not just with technical skill but with genuine care and support. He's the kind of teammate who makes you feel comfortable asking questions, brainstorming ideas, or simply reaching out when you're stuck. His calm confidence and dedication to excellence are genuinely inspiring, and working with him has made me better at what I do. I've learned so much just by being around him.\n\nAny team would be lucky to have someone like Bryl, not just because of what he can build but because of the kind of teammate and leader he naturally is.",
    name: 'Jelo Andes',
    title: 'Generative AI at Cambridge University Press and Assessment',
    initials: 'JA',
    date: 'Jul 2025',
  },
  {
    quote:
      "I've known Bryl since we started college. We're also groupmates in some projects for our major subjects and I can testify his good leadership in creating software solutions and not only that but also in student organization because way back then he was our president. And also his eagerness to achieve things through his visions. Without his sacrifices and determination, our start-up company named Pocketdevs won't grow rapidly. I would highly recommend Bryl's skill set, ideas, good attitude, and one of my best colleagues.",
    name: 'Justin Manigo',
    title: 'DevOps | Full Stack Developer | AWS Certified Cloud Practitioner',
    initials: 'JM',
    date: 'Feb 2022',
  },
  {
    quote:
      'Bryl and I worked together in various projects where I saw his tenacity to deliver what he promised to do. He is able to meet deadlines without sacrificing the quality of the output, and at times even exceeding the set goals. His dedication to pursue his craft and his mindset as a lifelong learner allow him to be easily mentored, as he is eager to learn new technologies. His enthusiasm at new opportunities makes him a great asset because he does everything with renewed energy and finds ways to optimize existing processes. Bryl sure is a great addition to any team!',
    name: 'Van Honoridez',
    title: 'SAP MM/IM/LE-WM Package Consultant',
    initials: 'VH',
    date: 'Dec 2021',
  },
  {
    quote: 'Takes lead in a software development. Can handle team well.',
    name: 'Gran Sabandal',
    title: 'Assistant Instructor at University of San Carlos',
    initials: 'GS',
    date: 'Mar 2020',
  },
  {
    quote: 'Intelligent Software Engineer.',
    name: 'Ken Gorro',
    title: 'Senior Software Engineer | AI/ML Engineer | Lecturer',
    initials: 'KG',
    date: 'Mar 2020',
  },
  {
    quote:
      'Bryl is a good student and software developer who shows professionalism and dedication in whatever he does. His software projects during his academic years are up to standard and is being used by the university for some of its operations. Bryl also demonstrated social awareness and leadership skills through his involvement as an officer/member in various student and special interest groups in the university.',
    name: 'Glenn Pepito',
    title:
      'AI Automation & Workflow Specialist | Software Engineer | Researcher | Educator',
    initials: 'GP',
    date: 'Mar 2020',
  },
  {
    quote:
      "Bryl was the most talented software engineer I've mentored in a long time. He's a fast learner, and he always makes sure to deliver quality output given a period of time. He is also very keen on learning new technologies, and I find him to be objectively passionate about tech. He's definitely someone you want on your team.",
    name: 'Cris Lawrence Adrian Militante',
    title: 'Integrations Product Lead | Computer Science Instructor',
    initials: 'CM',
    date: 'Mar 2020',
  },
  {
    quote:
      'Was an intern at PocketDevs and sir Bryl was our main trainer to the different technologies we use in the company such as Laravel, Bootstrap, etc. With his guidance, I was equipped with some of the current trends and insights in the tech industry which enabled me to be part of my current company.',
    name: 'Patrick Vince Velasco',
    title: 'Software Engineer, YNS',
    initials: 'PV',
  },
  {
    quote:
      "Sir Bryl's teaching approach is incredibly hands-on, and the projects significantly accelerated my learning process in web development. I am truly grateful for the mentorship I received from him during my web development internship.",
    name: 'John Edmerson Pizarra',
    title: 'Jr. Full-stack Developer, PocketDevs',
    initials: 'JP',
  },
  {
    quote:
      'The exposure to real projects and guidance from Sir Bryl was instrumental in my growth as a web developer. His approach to teaching and mentoring helped me to understand the intricacies of web development, and I\'m now working at Quickway Holdings Inc., applying the skills I learned.',
    name: 'Zinia Ma. Consuelo R. Trinidad',
    title: 'Web Developer, Quickway Holdings Inc.',
    initials: 'ZT',
  },
]

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

export const affiliations: Affiliation[] = [
  {
    name: 'Analytics & AI Association of the Philippines',
    role: 'Member',
    emoji: 'AAP',
    initials: 'AAP',
    logo: '/affiliations/aap.png',
    description:
      'The national association advancing analytics and AI adoption across the Philippines.',
    href: 'https://aap.ph',
    hrefLabel: 'aap.ph',
  },
  {
    name: 'Philippine Software Industry Association',
    role: 'Member',
    emoji: 'PSIA',
    initials: 'PSIA',
    logo: '/affiliations/psia.png',
    description:
      'The industry body representing the Philippine software and IT services sector.',
    href: 'https://psia.org.ph',
    hrefLabel: 'psia.org.ph',
  },
  {
    name: 'AppBuildersPH',
    role: 'Founder',
    emoji: 'PH',
    initials: 'PH',
    description:
      'A developer community I founded for Filipino app builders and indie hackers.',
    href: 'https://www.facebook.com/',
    hrefLabel: 'Facebook group',
  },
]

export type Hackathon = {
  name: string
  result: string
  org: string
  featured?: boolean
}

export const hackathons: Hackathon[] = [
  {
    name: 'DICT OpenGov Hackathon',
    result: 'Champion · 2025',
    org: 'Featured',
    featured: true,
  },
  {
    name: 'Google I/O Gemini Hackathon',
    result: 'Finalist',
    org: 'Google',
  },
  {
    name: 'packetHACKS x HackTheClimate',
    result: 'Finalist',
    org: 'packetHACKS',
  },
  {
    name: 'National AI Prompt Design Challenge',
    result: 'Finalist',
    org: 'AAP',
  },
  {
    name: 'CodeBreak 2.0 Hackathon',
    result: 'Champion',
    org: 'Tenext.ai',
  },
  {
    name: 'Hack the Future Hackathon',
    result: 'Champion',
    org: 'Kaya Founders',
  },
  {
    name: 'Xurpas Hackathon',
    result: 'Finalist',
    org: 'Xurpas',
  },
  {
    name: 'International Blockchain Olympiad',
    result: 'Participant',
    org: 'IBCOL Foundation',
  },
  {
    name: 'AIA Philam Life Hackathon',
    result: 'Finalist',
    org: 'Philam Life',
  },
]

export const communities = [
  { name: 'YouTube', handle: '@zenncode', href: site.socials.youtube },
  { name: 'TikTok', handle: '@zenncode', href: site.socials.tiktok },
]

export const founded = [
  { name: 'DEVS100', href: 'https://www.devs100.com', detail: 'devs100.com' },
  {
    name: 'AppBuildersPH',
    href: 'https://www.facebook.com/',
    detail: 'facebook group',
  },
]

/** Home community section headline */
export const communityHeadline = 'builders welcome'
export const communitySub =
  "Where I create, and the communities I've founded."
export const hackathonHeadline = '10x champion'
export const hackathonSub = '9 entered'

/** Gear page — desk / EDC / creator kit (card grid) */
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

export const gearSections: GearSection[] = [
  {
    id: 'desk',
    title: 'Desk Setup',
    items: [
      {
        name: 'MacBook Pro',
        detail: 'M5 Max · 128GB memory · 4TB.',
        image: '/gear/macbook-pro.webp',
        href: 'https://www.apple.com/macbook-pro/',
      },
      {
        name: 'Apple Studio Display',
        detail: '5K display for the desk.',
        image: '/gear/studio-display.webp',
        href: 'https://www.apple.com/studio-display/',
      },
      {
        name: 'Magic Keyboard',
        detail: 'Compact, white — with Touch ID.',
        image: '/gear/magic-keyboard.webp',
        href: 'https://www.apple.com/shop/product/MK2A3LL/A/magic-keyboard-with-touch-id-for-mac-models-with-apple-silicon-us-english',
      },
      {
        name: 'Magic Mouse',
        detail: 'White wireless mouse.',
        image: '/gear/magic-mouse.webp',
        href: 'https://www.apple.com/shop/product/MK2E3AM/A/magic-mouse-white-multi-touch-surface',
      },
      {
        name: 'Xiaomi Monitor Light Bar',
        detail: 'Glare-free desk lighting.',
        image: '/gear/xiaomi-light-bar.webp',
        href: 'https://www.mi.com/',
      },
      {
        name: 'Desky Sit-Stand Desk',
        detail: 'Single-motor sit/stand desk.',
        image: '/gear/desky-desk.webp',
        href: 'https://desky.com/',
      },
    ],
  },
  {
    id: 'edc',
    title: 'Everyday Carry',
    items: [
      {
        name: 'iPhone 15 Pro Max',
        detail: '1TB · phone & B-roll camera.',
        image: '/gear/iphone-15-pro-max.webp',
        href: 'https://www.apple.com/iphone/',
      },
      {
        name: 'AirPods Pro',
        detail: 'Daily audio & calls.',
        image: '/gear/airpods-pro.webp',
        href: 'https://www.apple.com/airpods-pro/',
      },
      {
        name: 'WHOOP 5.0',
        detail: 'Recovery & strain tracking.',
        image: '/gear/whoop-5.webp',
        href: 'https://www.whoop.com/',
      },
      {
        name: 'Anker 165W Power Bank',
        detail: '25,000mAh, retractable cables.',
        image: '/gear/anker-powerbank.webp',
        href: 'https://www.anker.com/',
      },
    ],
  },
  {
    id: 'creator',
    title: 'Creator',
    items: [
      {
        name: 'DJI Osmo Pocket 3',
        detail: 'Creator Combo — pocket gimbal camera.',
        image: '/gear/osmo-pocket-3.webp',
        href: 'https://www.dji.com/osmo-pocket-3',
      },
    ],
  },
]

/** Resources page — curated learning links */
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

export const resourceSections: ResourceSection[] = [
  {
    id: 'learn-ai-ml',
    title: 'Learn AI / ML',
    items: [
      {
        name: 'DeepLearning.AI',
        detail:
          "Andrew Ng's specializations on ML, deep learning, and generative AI.",
        href: 'https://www.deeplearning.ai/',
      },
      {
        name: 'fast.ai — Practical Deep Learning',
        detail: 'Top-down, code-first deep learning course for coders.',
        href: 'https://course.fast.ai/',
      },
      {
        name: 'Hugging Face LLM Course',
        detail: 'Free hands-on course on transformers, NLP, and LLMs.',
        href: 'https://huggingface.co/learn/nlp-course',
      },
      {
        name: 'Google ML Crash Course',
        detail: "Google's interactive intro to machine learning fundamentals.",
        href: 'https://developers.google.com/machine-learning/crash-course',
      },
      {
        name: 'Hugging Face Deep RL Course',
        detail: 'Free hands-on course on deep reinforcement learning.',
        href: 'https://huggingface.co/learn/deep-rl-course',
      },
      {
        name: 'Kaggle Learn',
        detail: 'Short practical micro-courses on Python, ML, and data.',
        href: 'https://www.kaggle.com/learn',
      },
    ],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering & LLMs',
    items: [
      {
        name: 'Anthropic Prompt Engineering',
        detail: 'Official guide to prompting Claude effectively.',
        href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
      },
      {
        name: 'Anthropic Cookbook',
        detail: 'Code recipes for building with Claude: RAG, tools, agents.',
        href: 'https://github.com/anthropics/anthropic-cookbook',
      },
      {
        name: 'OpenAI Cookbook',
        detail: 'Practical code examples for building with OpenAI models.',
        href: 'https://cookbook.openai.com/',
      },
      {
        name: 'LangChain Docs',
        detail: 'Framework docs for building LLM apps, agents, and RAG.',
        href: 'https://python.langchain.com/docs/introduction/',
      },
      {
        name: 'A Year of Building with LLMs',
        detail: 'Hard-won tactical lessons on shipping LLM products.',
        href: 'https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i/',
      },
      {
        name: "Chip Huyen's Blog",
        detail: 'Deep essays on AI systems, ML production, and engineering.',
        href: 'https://huyenchip.com/blog/',
      },
    ],
  },
  {
    id: 'fundamentals',
    title: 'Developer fundamentals / CS',
    items: [
      {
        name: 'The Odin Project',
        detail: 'Free full-stack web development curriculum with projects.',
        href: 'https://www.theodinproject.com/',
      },
      {
        name: 'freeCodeCamp',
        detail: 'Free interactive coding curriculum with certifications.',
        href: 'https://www.freecodecamp.org/',
      },
      {
        name: 'Harvard CS50x',
        detail: "Harvard's renowned intro to computer science, free online.",
        href: 'https://cs50.harvard.edu/x/',
      },
      {
        name: 'MDN Web Docs',
        detail:
          'Authoritative reference for HTML, CSS, JavaScript, and web APIs.',
        href: 'https://developer.mozilla.org/',
      },
      {
        name: 'roadmap.sh',
        detail: 'Community-curated learning roadmaps for developer roles.',
        href: 'https://roadmap.sh/',
      },
      {
        name: 'Teach Yourself CS',
        detail: 'Curated core CS subjects with the best books and lectures.',
        href: 'https://teachyourselfcs.com/',
      },
      {
        name: 'System Design Primer',
        detail: 'Open-source guide to designing large-scale systems.',
        href: 'https://github.com/donnemartin/system-design-primer',
      },
    ],
  },
  {
    id: 'practice',
    title: 'Practice & interview prep',
    items: [
      {
        name: 'LeetCode',
        detail: 'Coding problems for technical and algorithm interview prep.',
        href: 'https://leetcode.com/',
      },
      {
        name: 'NeetCode',
        detail: 'Curated problem lists with clear video walkthroughs.',
        href: 'https://neetcode.io/',
      },
      {
        name: 'Exercism',
        detail: 'Free coding exercises with mentoring across 70+ languages.',
        href: 'https://exercism.org/',
      },
      {
        name: 'Codewars',
        detail: 'Gamified coding kata to sharpen language fluency.',
        href: 'https://www.codewars.com/',
      },
      {
        name: 'Frontend Mentor',
        detail: 'Real-world frontend projects from professional designs.',
        href: 'https://www.frontendmentor.io/',
      },
    ],
  },
  {
    id: 'stay-current',
    title: 'Stay current — newsletters & blogs',
    items: [
      {
        name: 'The Batch',
        detail: "Andrew Ng's weekly roundup of AI news and research.",
        href: 'https://www.deeplearning.ai/the-batch/',
      },
      {
        name: 'Import AI',
        detail: "Jack Clark's weekly newsletter on frontier AI and policy.",
        href: 'https://importai.substack.com/',
      },
      {
        name: 'Latent Space',
        detail: 'Newsletter and podcast for AI engineers in production.',
        href: 'https://www.latent.space/',
      },
      {
        name: "Simon Willison's Blog",
        detail: 'Prolific, practical writing on LLMs and developer tooling.',
        href: 'https://simonwillison.net/',
      },
      {
        name: "Lil'Log (Lilian Weng)",
        detail: 'Deep technical explainers on ML and LLM topics.',
        href: 'https://lilianweng.github.io/',
      },
      {
        name: 'TLDR Newsletter',
        detail: 'Daily concise digest of tech, dev, and AI news.',
        href: 'https://tldr.tech/',
      },
      {
        name: 'Hacker News',
        detail: 'High-signal community for tech, startups, and engineering.',
        href: 'https://news.ycombinator.com/',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & references',
    items: [
      {
        name: 'Hugging Face',
        detail: 'Hub for open models, datasets, and ML demos.',
        href: 'https://huggingface.co/',
      },
      {
        name: 'Hugging Face Papers',
        detail: 'Trending ML papers with linked code and discussion.',
        href: 'https://huggingface.co/papers',
      },
      {
        name: 'arXiv',
        detail: 'Open-access preprint server for AI and CS research.',
        href: 'https://arxiv.org/',
      },
      {
        name: 'Kaggle',
        detail: 'Datasets, notebooks, and ML competitions community.',
        href: 'https://www.kaggle.com/',
      },
      {
        name: 'DevDocs',
        detail: 'Fast unified API documentation browser, offline-capable.',
        href: 'https://devdocs.io/',
      },
    ],
  },
]

/** Shop products — click-through to /shop/:slug */
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

export const shopProducts: ShopProduct[] = [
  {
    slug: 'developer-resume-template',
    title: 'Developer Resume Template',
    category: 'Template',
    priceLabel: 'Free',
    price: 0,
    tagline: 'A clean, ATS-friendly resume template for software developers',
    description:
      'A clean, ATS-friendly resume template for software developers — editable in Microsoft Word or Google Docs.',
    delivery: 'Instant digital delivery',
    cta: 'Download free',
    downloadHref: '/downloads/developer-resume-template.txt',
    image: '/shop/developer-resume.png',
    inside: [
      'A one-page .docx template with a professional, recruiter-friendly layout',
      'Pre-filled example content for a developer — just swap in your own',
      'Clear sections and sensible defaults that parse well in applicant tracking systems',
    ],
    sections: [
      'Education',
      'Work Experience',
      'Projects',
      'Activities',
      'Skills & Certifications',
    ],
    footerNote:
      'Just download, open in Word or Google Docs, and edit away — completely free.',
  },
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

export const contributionCount = 3228

export const LINKS = {
  github:   'https://github.com/Insiyaya',
  linkedin: 'https://www.linkedin.com/in/insiya-husain-89b501259/',
  email:    'https://mail.google.com/mail/?view=cm&to=insiyaahusainn@gmail.com',
}

/* Accents below are drawn from the design palette (see tailwind.config.js
   and the tokens in index.css) so sections stay inside the
   75/15/7/3 dark-pink-lavender-cyan ratio. Cyan is reserved for
   AI/system indicators only.

   Skills grouped by discipline. `tone` selects the chip treatment:
   pink → core, lavender → supporting, cyan → AI/LLM. */
export const SKILLS = [
  {
    category: 'Languages',
    tone:     'pink',
    items: [
      { name: 'Python',     icon: 'SiPython'     },
      { name: 'JavaScript', icon: 'SiJavascript' },
      { name: 'TypeScript', icon: 'SiTypescript' },
      { name: 'C++',        icon: 'SiCplusplus'  },
      { name: 'SQL',        icon: 'FaDatabase'   },
      { name: 'Dart',       icon: 'SiDart'       },
    ],
  },
  {
    category: 'Frontend',
    tone:     'lavender',
    items: [
      { name: 'React',    icon: 'SiReact'       },
      { name: 'Next.js',  icon: 'SiNextdotjs'   },
      { name: 'Tailwind', icon: 'SiTailwindcss' },
      { name: 'Flutter',  icon: 'SiFlutter'     },
    ],
  },
  {
    category: 'Backend',
    tone:     'pink',
    items: [
      { name: 'FastAPI', icon: 'SiFastapi'   },
      { name: 'Django',  icon: 'SiDjango'    },
      { name: 'Node.js', icon: 'SiNodedotjs' },
    ],
  },
  {
    category: 'AI / LLM',
    tone:     'cyan',
    items: [
      { name: 'LangChain',         icon: 'FaBrain'              },
      { name: 'LangGraph',         icon: 'FaDiagramProject'     },
      { name: 'RAG',               icon: 'FaLayerGroup'         },
      { name: 'Prompt Engineering',icon: 'FaWandMagicSparkles'  },
      { name: 'Vector Databases',  icon: 'FaCubes'              },
      { name: 'AI Agents',         icon: 'FaRobot'              },
    ],
  },
  {
    category: 'Cloud / DevOps',
    tone:     'lavender',
    items: [
      { name: 'AWS',       icon: 'FaAws'       },
      { name: 'Docker',    icon: 'SiDocker'    },
      { name: 'Terraform', icon: 'SiTerraform' },
    ],
  },
  {
    category: 'Databases',
    tone:     'pink',
    items: [
      { name: 'PostgreSQL', icon: 'SiPostgresql' },
      { name: 'MongoDB',    icon: 'SiMongodb'    },
      { name: 'DynamoDB',   icon: 'FaDatabase'   },
    ],
  },
]

/* ── Recruiter-facing highlights ─────────────────────────────────
   Surfaced on the rotating fact planet in the About section. Each entry
   restates something already evidenced elsewhere on the page
   (certifications, experience, education, GitHub) — no new claims. */
export const RECRUITER_FACTS = [
  {
    key:   'currently',
    icon:  'FaBriefcase',
    value: 'Software Engineer @ Consultadd',
    sub:   'Production agentic AI since Jan 2025',
    tone:  'pink',
  },
  {
    key:   'cloud certified',
    icon:  'FaAws',
    value: 'AWS Solutions Architect',
    sub:   'Associate level',
    tone:  'pink',
  },
  {
    key:   'ai specialism',
    icon:  'FaRobot',
    value: 'LangChain agent pipelines',
    sub:   'FastAPI · AWS · DynamoDB at scale',
    tone:  'cyan',
  },
  {
    key:   'academics',
    icon:  'FaGraduationCap',
    value: '8.8 / 10 GPA',
    sub:   'B.E. — IET DAVV, 2025',
    tone:  'lavender',
  },
  {
    key:   'open source',
    icon:  'FaCodePullRequest',
    value: '40+ public repositories',
    sub:   'Pull Shark ×2 · Quickdraw · Pair Extraordinaire',
    tone:  'magenta',
  },
  {
    key:   'also certified',
    icon:  'FaCloud',
    value: 'Microsoft Azure AI-900',
    sub:   'AI fundamentals',
    tone:  'lavender',
  },
]

export const EXPERIENCE = [
  {
    company: 'Consultadd Inc.',
    role:    'Software Engineer',
    period:  'Jan 2025 – Present',
    current: true,
    points: [
      'Engineered an AI agent with a custom prompt engineering layer, improving conversation coherence and response accuracy across multi-turn dialogues',
      'Designed and deployed FastAPI microservices orchestrating end-to-end agentic AI workflows, from intent parsing to tool execution, handling concurrent requests at scale',
      'Architected DynamoDB-backed data pipelines on AWS for low-latency storage and retrieval, reducing average query response time and enabling real-time agent decision-making',
    ],
    tags: ['FastAPI', 'AWS', 'DynamoDB', 'Agentic AI', 'LangChain', 'Python'],
  },
  {
    company: 'Walkover',
    role:    'Software Engineer Intern',
    period:  'Apr 2024 – Dec 2024',
    current: false,
    points: [
      'Developed and shipped plugin integrations across multiple third-party APIs, enabling seamless data exchange and expanding platform connectivity for end users',
      'Identified, triaged, and resolved critical production bugs ahead of release deadlines, directly improving application reliability and user experience',
      'Drove end-to-end QA and integration testing workflows, establishing repeatable test patterns that reduced regression rates across subsequent releases',
    ],
    tags: ['API Integration', 'Plugin Dev', 'Python', 'QA & Testing'],
  },
]

/* ── Projects ────────────────────────────────────────────────────
   `problem` / `outcome` / `highlights` are structured restatements
   of each project's existing description — no new claims. */
export const PROJECTS = [
  {
    id:       'tripcraft',
    featured: true,
    title:    'TripCraft AI',
    kind:     'AI Agent Platform',
    ai:       true,
    desc:     'AI agent platform that crafts personalized travel itineraries tailored to your destination, trip duration, and budget. Powered by intelligent agents that research destinations, optimize day-by-day schedules, and suggest accommodations, activities, and local experiences in real time.',
    problem:  'Planning a trip means juggling a dozen tabs — destinations, budgets, schedules — with no single source of truth.',
    outcome:  'Live platform that turns a destination, duration and budget into a complete itinerary.',
    highlights: [
      'Agent pipeline researches destinations, stays and local experiences',
      'Day-by-day schedule optimisation against trip length and budget',
      'Suggestions surfaced in real time as the itinerary is assembled',
    ],
    tags:     ['React', 'AI Agents', 'LangChain', 'Travel', 'Vercel'],
    aiTags:   ['AI AGENTS', 'LLM ORCHESTRATION'],
    github:   null,
    live:     'https://tripcraft-ai-three.vercel.app/',
    accent:   '#FF2DAA',
    preview:  'https://tripcraft-ai-three.vercel.app/',
  },
  {
    id:       'ai-agent',
    featured: true,
    title:    'AI-Powered E-Commerce Agent',
    kind:     'Agentic Commerce Backend',
    ai:       true,
    status:   'wip',
    desc:     'Full-stack AI vendor platform enabling small entrepreneurs to register, manage storefronts, and scale sales. Features LangChain-driven onboarding automation, intelligent customer engagement agents, and a FastAPI backend deployed on AWS with DynamoDB for real-time inventory and order management.',
    problem:  'Small vendors need a storefront, an onboarding flow and a support team before they can sell anything online.',
    outcome:  'In active development — onboarding and customer engagement handled by LangChain agents.',
    highlights: [
      'LangChain-driven onboarding automation for vendor registration',
      'Customer engagement agents handling storefront conversations',
      'FastAPI services on AWS with DynamoDB for live inventory & orders',
    ],
    tags:     ['Python', 'FastAPI', 'LangChain', 'Agentic AI', 'AWS', 'DynamoDB'],
    aiTags:   ['AGENT PIPELINE', 'TOOL USE'],
    github:   null,
    live:     null,
    accent:   '#D946EF',
  },
  {
    id:      'roboshots',
    title:   'Roboshots',
    kind:    'Cross-Platform App',
    desc:    'Cross-platform blog application built with Flutter and Dart, delivering a native experience on Android, iOS, Web, and Desktop from a single codebase. Implements responsive layouts, optimized image caching, and clean architecture patterns.',
    problem: 'One blog experience across four platforms — without maintaining four codebases.',
    outcome: 'Native builds for Android, iOS, Web and Desktop from one Flutter codebase.',
    tags:    ['Flutter', 'Dart', 'Cross-platform'],
    github:  'https://github.com/Insiyaya/Roboshots_flutter_blog_app',
    accent:  '#C084FC',
  },
  {
    id:      'jumble',
    title:   'Jumble Words Game',
    kind:    'Desktop Application',
    desc:    'Desktop word puzzle game featuring a Tkinter GUI with user authentication, an admin panel for word management, persistent score tracking, and modular game logic designed for extensibility.',
    problem: 'A word game that also needed accounts, moderation and score history — not just game logic.',
    outcome: 'Tkinter GUI with auth, an admin word-management panel and persistent scoring.',
    tags:    ['Python', 'Tkinter', 'Game Logic', 'Auth'],
    github:  'https://github.com/Insiyaya/Jumble_words_game',
    accent:  '#F9A8D4',
  },
  {
    id:      'savour',
    title:   'Savour',
    kind:    'Cross-Platform App',
    desc:    'Cross-platform recipe discovery app built with Flutter, showcasing provider-based state management, nested navigation, and category-driven filtering. Ships a polished UI with favourites, filtering, and smooth page transitions.',
    problem: 'Recipe discovery falls apart without fast filtering and somewhere to keep favourites.',
    outcome: 'Provider-driven state, nested navigation and category filtering in a polished UI.',
    tags:    ['Flutter', 'Dart', 'State Mgmt', 'Cross-platform'],
    github:  'https://github.com/Insiyaya/Flutter_meals',
    accent:  '#FF4FC3',
  },
  {
    id:      'talawa',
    title:   'Talawa',
    kind:    'Open Source',
    desc:    'Consistent contributor to PalisadoesFoundation\'s community management platform. Delivered feature PRs, resolved issues, and collaborated through code reviews in the open-source community.',
    problem: 'A community management platform maintained in the open by the Palisadoes Foundation.',
    outcome: 'Consistent contributor — feature PRs, issue fixes and code review collaboration.',
    tags:    ['Flutter', 'Dart', 'Open Source'],
    github:  'https://github.com/PalisadoesFoundation/talawa',
    accent:  '#C084FC',
  },
]

export const WORKFLOW = [
  {
    step:   1,
    title:  'Discover & Define',
    desc:   'I start by deeply understanding the problem space. Mapping user needs, defining constraints, and shaping requirements into clear technical specifications before writing a single line of code.',
    icon:   'FaMagnifyingGlass',
    accent: '#FF2DAA',
  },
  {
    step:   2,
    title:  'Architect & Plan',
    desc:   'I design the system architecture. Choosing the right stack, modeling data flows, and planning API contracts. Whether it\'s FastAPI microservices or an agentic AI pipeline, the blueprint comes first.',
    icon:   'FaSitemap',
    accent: '#FF4FC3',
  },
  {
    step:   3,
    title:  'Build & Iterate',
    desc:   'I develop in focused sprints with rapid feedback loops. Clean code, modular patterns, and continuous testing ensure every feature is production-ready from the first commit.',
    icon:   'FaCode',
    accent: '#D946EF',
  },
  {
    step:   4,
    title:  'Deploy & Scale',
    desc:   'I ship to the cloud with CI/CD pipelines, containerized services on AWS, and infrastructure-as-code. Every deployment is reproducible, monitored, and built to handle real-world load.',
    icon:   'FaRocket',
    accent: '#C084FC',
  },
  {
    step:   5,
    title:  'Measure & Refine',
    desc:   'I track performance metrics, gather user feedback, and iterate. Engineering doesn\'t stop at deployment. I continuously optimize for speed, reliability, and user impact.',
    icon:   'FaChartLine',
    accent: '#F9A8D4',
  },
]

export const CERTS = [
  {
    id:     'aws',
    name:   'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    level:  'Associate Level',
    color:  '#FF2DAA',
    bg:     'rgba(255,45,170,0.07)',
    border: 'rgba(255,45,170,0.20)',
  },
  {
    id:     'azure',
    name:   'Microsoft Azure AI-900',
    issuer: 'Microsoft Azure',
    level:  'AI Fundamentals',
    color:  '#C084FC',
    bg:     'rgba(192,132,252,0.07)',
    border: 'rgba(192,132,252,0.20)',
  },
]

export const EDUCATION = [
  { year: '2021 – 2025', degree: 'B.E. in Engineering',  institution: 'IET DAVV, Indore', score: 'GPA: 8.8 / 10.0' },
  { year: '2021',        degree: 'Class 12th, C.B.S.E',  institution: 'Central Board of Secondary Education', score: '91%' },
  { year: '2019',        degree: 'Class 10th, C.B.S.E',  institution: 'Central Board of Secondary Education', score: '95%' },
]

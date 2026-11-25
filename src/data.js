export const LINKS = {
  github:   'https://github.com/Insiyaya',
  twofolds: 'https://twofolds.shop/',
  ruby:     'https://www.rubycrm.ai/',
  linkedin: 'https://www.linkedin.com/in/insiya-husain-89b501259/',
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
    key:   'founder',
    icon:  'FaStore',
    value: 'Twofolds',
    sub:   'Premium tees with a custom print studio',
    href:  'https://twofolds.shop/',
    tone:  'lavender',
  },
  {
    key:   'current role',
    icon:  'FaBriefcase',
    value: 'Product Engineer, Ruby CRM',
    sub:   'Agentic AI CRM for UAE real estate',
    href:  'https://www.rubycrm.ai/',
    tone:  'pink',
  },
  {
    key:   'certification',
    icon:  'FaAws',
    value: 'AWS Solutions Architect',
    sub:   'Associate level',
    tone:  'pink',
  },
  {
    key:   'specialism',
    icon:  'FaRobot',
    value: 'LangChain agent pipelines',
    sub:   'FastAPI, AWS and DynamoDB at scale',
    tone:  'cyan',
  },
  {
    key:   'education',
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
    key:   'certification',
    icon:  'FaCloud',
    value: 'Microsoft Azure AI-900',
    sub:   'AI Fundamentals',
    tone:  'lavender',
  },
]

export const EXPERIENCE = [
  {
    id:      'twofolds',
    company: 'Twofolds',
    href:    'https://twofolds.shop/',
    role:    'Founder',
    current: true,
    points: [
      'Started a premium tee brand from zero: heavyweight blanks, water-based prints, closed runs.',
      'Took it online with tees, hoodies, a couples collection and bulk orders.',
      'Added a custom studio where people upload their own artwork and wear it.',
    ],
    tags: ['Brand', 'E-Commerce', 'Next.js'],
  },
  {
    id:      'rubycrm',
    company: 'Ruby CRM',
    href:    'https://www.rubycrm.ai/',
    role:    'Product Engineer',
    current: true,
    points: [
      'Work on an agentic AI CRM for UAE real estate: WhatsApp leads, AI follow-ups and listings on Bayut and Dubizzle.',
      'Track down bugs and fix them at the root, so that real estate agents can rely on the product through a busy day.',
      'Turn the problems users report into product improvements, and follow each one from the first report to release.',
    ],
    tags: ['Product Engineering', 'Agentic AI', 'CRM', 'Real Estate Tech'],
  },
  {
    id:      'consultadd',
    company: 'Consultadd Inc.',
    role:    'Software Engineer',
    period:  'Joined Jan 2025',
    current: false,
    points: [
      'Built an AI agent that keeps its train of thought. A custom prompt layer made long conversations more coherent and answers more accurate.',
      'Shipped the FastAPI microservices behind it, carrying each request from intent to tool call to reply for many users at once.',
      'Designed DynamoDB pipelines on AWS that cut average query time, so agents can decide in real time.',
    ],
    tags: ['FastAPI', 'AWS', 'DynamoDB', 'Agentic AI', 'LangChain', 'Python'],
  },
  {
    id:      'walkover',
    company: 'Walkover',
    role:    'Software Engineer Intern',
    period:  'Apr 2024 – Dec 2024',
    current: false,
    points: [
      'Shipped plugins that connect the platform to multiple third-party APIs, so data moves between tools without friction.',
      'Tracked down critical production bugs ahead of release deadlines and made the app steadier for the people using it.',
      'Set up repeatable QA and integration tests that lowered regressions release after release.',
    ],
    tags: ['API Integration', 'Plugin Dev', 'Python', 'QA & Testing'],
  },
]

/* ── Projects ────────────────────────────────────────────────────
   `problem` / `outcome` / `highlights` are structured restatements
   of each project's existing description — no new claims. */
export const PROJECTS = [
  {
    id:       'twofolds',
    shot:     '/projects/twofolds.webp',
    featured: true,
    title:    'Twofolds',
    kind:     'Founder, Premium Tee Brand',
    desc:     'The premium tee brand I founded: heavyweight blanks, water-based prints and closed runs. The store sells tees and hoodies in oversized and minimal cuts, with a couples collection, bulk orders, and a custom studio where customers upload their own artwork.',
    outcome:  'Live store with its own collections, custom studio and bulk ordering.',
    highlights: [
      'Custom studio that prints customers’ own artwork',
      'Every tee and hoodie available in two cuts, chosen at checkout',
      'Couples collection and bulk orders alongside the main range',
    ],
    tags:     ['Next.js', 'E-Commerce', 'Brand'],
    github:   null,
    live:     'https://twofolds.shop/',
    accent:   '#a488ff',
  },
  {
    id:       'tripcraft',
    shot:     '/projects/tripcraft.webp',
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
    id:       'beehive',
    shot:     '/projects/beehive.webp',
    featured: true,
    title:    'Bee Hive',
    kind:     'Multi-Seller Marketplace',
    ai:       true,
    desc:     'Online marketplace where independent stores sell fashion, religious wear and accessories. Sellers bring their catalogue, answer a few questions and start selling once approved. Features LangChain-driven onboarding automation, intelligent customer engagement agents, and a FastAPI backend deployed on AWS with DynamoDB for real-time inventory and order management.',
    problem:  'Small vendors need a storefront, an onboarding flow and a support team before they can sell anything online.',
    outcome:  'Live marketplace where each store uploads its catalogue and sets its own delivery, returns and offers.',
    highlights: [
      'LangChain-driven onboarding automation for vendor registration',
      'Customer engagement agents handling storefront conversations',
      'FastAPI services on AWS with DynamoDB for live inventory and orders',
    ],
    tags:     ['Next.js', 'Python', 'FastAPI', 'LangChain', 'Agentic AI', 'AWS', 'DynamoDB'],
    github:   null,
    live:     'https://itsbeehive.shop/',
    accent:   '#ffb31a',
  },
  {
    id:       'biscuit',
    shot:     '/projects/biscuit.webp',
    title:    'Biscuit Consultant',
    kind:     'Business Website',
    desc:     'Website for a global biscuit manufacturing consultancy with 35+ years of expertise. It covers new plant setup, production optimisation and specialised consultancy, alongside a blog and an industry jobs section.',
    outcome:  'Live site that takes investors and manufacturers from services to a consultation request.',
    tags:     ['React', 'Business Website'],
    github:   null,
    live:     'https://biscuitconsultant.com/',
    accent:   '#e8b07a',
  },
  {
    id:      'roboshots',
    title:   'Roboshots',
    kind:    'Cross-Platform App',
    brief:   'A blog app in Flutter, with one codebase for phone, web and desktop.',
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
    brief:   'A Tkinter word puzzle with accounts, an admin panel and saved scores.',
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
    brief:   'A Flutter recipe app with favourites, filters and smooth navigation.',
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
    brief:   'Features, fixes and code reviews for a community management platform.',
    desc:    'Consistent contributor to PalisadoesFoundation\'s community management platform. Delivered feature PRs, resolved issues, and collaborated through code reviews in the open-source community.',
    problem: 'A community management platform maintained in the open by the Palisadoes Foundation.',
    outcome: 'Consistent contributor — feature PRs, issue fixes and code review collaboration.',
    tags:    ['Flutter', 'Dart', 'Open Source'],
    github:  'https://github.com/PalisadoesFoundation/talawa',
    accent:  '#C084FC',
  },
]

export const WORKFLOW = [
  { step: 1, title: 'Discover and define', desc: 'I begin with the problem: who it affects, what constrains it and what a good outcome looks like. Then I write a clear specification before any code.' },
  { step: 2, title: 'Architect and plan',  desc: 'I choose the stack, model the data and agree the API contracts. Whether it is a set of FastAPI services or an agent pipeline, the blueprint comes first.' },
  { step: 3, title: 'Build and iterate',   desc: 'I work in focused sprints with short feedback loops. Clean, modular code and continuous testing keep every feature ready for production from the start.' },
  { step: 4, title: 'Deploy and scale',    desc: 'I release through CI/CD to containerised services on AWS, with infrastructure as code. Each deployment is reproducible, monitored and ready for real load.' },
  { step: 5, title: 'Measure and refine',  desc: 'I follow the metrics, listen to the people who use the product and iterate on what I learn. Delivery is the midpoint of the work, not the end of it.' },
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

export const EMAIL = 'insiyaahusainn@gmail.com'

/* Web3Forms access key: the form sends each message to the inbox it belongs to.
   It is made to be public and can only be used to write to that inbox. */
export const CONTACT_KEY = '3db9bed0-1997-487e-be0d-63778a31ab50'

export const ABOUT = {
  lead: 'I am a full stack and AI engineer who cares as much about the person using the software as the system behind it.',
  body: [
    'I work as a Product Engineer at Ruby CRM, an agentic AI CRM for real estate, and I am the founder of Twofolds, a premium tee brand with its own custom print studio.',
    'My experience spans production AI agents, the FastAPI services that run them and the DynamoDB pipelines that support them. Along the way, improvements I delivered contributed to 30 to 50% growth in client engagement.',
    'I am equally at home in Flutter, where one codebase reaches every platform. I am also deepening my work in machine learning, toward systems that do more than respond: they learn and adapt.',
  ],
}

/* What each letter of the name stands for, and why. */
export const ACRONYM = [
  {
    letter: 'I', word: 'Innovative', color: '#ff5cb6',
    line: 'I like to build the thing that does not exist yet.',
    points: [
      'I founded Twofolds and gave it a custom studio, so that customers can wear their own artwork.',
      'I built TripCraft AI, where a five-step agent researches, plans and checks a whole trip.',
      'I made Ad Studio, which turns a business website into the concept for a video advertisement.',
    ],
  },
  {
    letter: 'N', word: 'Nimble', color: '#a488ff',
    line: 'I move between layers without losing the thread.',
    points: [
      'I work across the interface, the API, the agent and the infrastructure.',
      'I switch between React, FastAPI, Flutter and NestJS as the problem demands.',
      'I work in focused sprints with short feedback loops.',
    ],
  },
  {
    letter: 'S', word: 'Systematic', color: '#8df5d6',
    line: 'I prefer a clear plan to a lucky guess.',
    points: [
      'I write the specification and agree the API contracts before any code.',
      'At Walkover I set up repeatable QA and integration tests.',
      'I am certified as an AWS Solutions Architect, Associate, and in Microsoft Azure AI-900.',
    ],
  },
  {
    letter: 'I', word: 'Insightful', color: '#ffb14a',
    line: 'I look for the reason behind the request.',
    points: [
      'At Ruby CRM I turn the problems users report into product improvements.',
      'I trace a bug to its root instead of patching the symptom.',
      'At Consultadd I designed DynamoDB pipelines that cut average query time.',
    ],
  },
  {
    letter: 'Y', word: 'Yearning', color: '#6cc7ff',
    line: 'I am always hungry to learn the next thing.',
    points: [
      'I keep more than 40 public repositories, from Flutter apps to a smart contract on Aptos.',
      'I am deepening my work in machine learning.',
      'I contribute to open source, and my tests are part of Talawa.',
    ],
  },
  {
    letter: 'A', word: 'Adaptable', color: '#ff8a7a',
    line: 'I fit the work, whatever shape it takes.',
    points: [
      'I am a founder and a product engineer, and each role improves the other.',
      'I have built for travel, fashion, skincare, real estate and manufacturing.',
      'I ship one Flutter codebase to Android, iOS, web and desktop.',
    ],
  },
]

export const SERVICES = [
  { title: 'Full stack engineering',  desc: 'Complete web products, from React and Next.js interfaces to the APIs, databases and deployments behind them.' },
  { title: 'AI agent development',    desc: 'End-to-end agentic systems, with LLM orchestration, prompt engineering and tool-use workflows.' },
  { title: 'Backend engineering',     desc: 'High-throughput APIs and microservices, built with FastAPI and Django on event-driven architectures.' },
  { title: 'Mobile and cross-platform', desc: 'Production Flutter apps for Android, iOS, web and desktop, all shipped from a single codebase.' },
  { title: 'Cloud and infrastructure', desc: 'AWS-native deployments with DynamoDB, Lambda, Docker, Terraform and automated CI/CD.' },
]

export const OPEN_SOURCE = {
  repos: '40+ public repositories',
  achievements: ['Pull Shark ×2', 'Quickdraw', 'Pair Extraordinaire'],
}

/* Rotating subtitles: one set of tech sarcasm per scene. */
export const QUOTES = {
  skills: [
    'It worked on my machine. So I shipped my machine.',
    'My AI agent has every tool. It still asks me where things are.',
    'The cloud is just someone else’s computer with a bigger bill.',
    'Prompt engineering: asking nicely until it works.',
    'Two things are hard in tech: naming, caching and off-by-one errors.',
    'I’d tell you a UDP joke, but you might not get it.',
  ],
  experience: [
    'Wanted: ten years of experience in a framework released last week.',
    'That’s not a bug. That’s a feature with confidence.',
    'Meetings: where minutes are kept and hours are lost.',
    'Commit message: “final fix”. It was not the final fix.',
    'Senior engineer: someone who has broken more things, more quietly.',
  ],
  projects: [
    'It’s not a side project. It’s a startup with commitment issues.',
    'Estimate: two days. Reality: character development.',
    'It worked on the first try. Now I’m suspicious.',
    'Deploying on a Friday, because I enjoy adventure.',
    'The documentation is in my head. That version is deprecated.',
  ],
}

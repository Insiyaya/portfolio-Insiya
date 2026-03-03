export const LINKS = {
  github:   'https://github.com/Insiyaya',
  linkedin: 'https://www.linkedin.com/in/insiya-husain-89b501259/',
  email:    'https://mail.google.com/mail/?view=cm&to=insiyaahusainn@gmail.com',
}

export const SKILLS = [
  {
    category: 'Languages & Core',
    items: [
      { name: 'Python',      icon: 'SiPython',      color: '#3776AB' },
      { name: 'C++ / DSA',   icon: 'SiCplusplus',   color: '#00599C' },
      { name: 'Dart',        icon: 'SiDart',        color: '#0175C2' },
      { name: 'JavaScript',  icon: 'SiJavascript',  color: '#F7DF1E' },
    ],
  },
  {
    category: 'Frameworks & AI',
    items: [
      { name: 'FastAPI',      icon: 'SiFastapi',    color: '#009688' },
      { name: 'Django',       icon: 'SiDjango',     color: '#44B78B' },
      { name: 'Flutter',      icon: 'SiFlutter',    color: '#54C5F8' },
      { name: 'React',        icon: 'SiReact',      color: '#61DAFB' },
      { name: 'LangChain',    icon: 'FaBrain',      color: '#818CF8' },
      { name: 'Prompt Eng.',  icon: 'FaWand',       color: '#A78BFA' },
      { name: 'Agentic AI',   icon: 'FaRobot',      color: '#38BDF8' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS',          icon: 'SiAmazonaws',  color: '#FF9900' },
      { name: 'Docker',       icon: 'SiDocker',     color: '#2496ED' },
      { name: 'Terraform',    icon: 'SiTerraform',  color: '#7B42BC' },
      { name: 'DynamoDB',     icon: 'FaDatabase',   color: '#4053D6' },
    ],
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

export const PROJECTS = [
  {
    id:       'tripcraft',
    featured: true,
    title:    'TripCraft AI',
    desc:     'AI agent platform that crafts personalized travel itineraries tailored to your destination, trip duration, and budget. Powered by intelligent agents that research destinations, optimize day-by-day schedules, and suggest accommodations, activities, and local experiences in real time.',
    tags:     ['React', 'AI Agents', 'LangChain', 'Travel', 'Vercel'],
    github:   null,
    live:     'https://tripcraft-ai-three.vercel.app/',
    accent:   '#38BDF8',
    preview:  'https://tripcraft-ai-three.vercel.app/',
  },
  {
    id:       'ai-agent',
    featured: true,
    title:    'AI-Powered E-Commerce Agent',
    status:   'wip',
    desc:     'Full-stack AI vendor platform enabling small entrepreneurs to register, manage storefronts, and scale sales. Features LangChain-driven onboarding automation, intelligent customer engagement agents, and a FastAPI backend deployed on AWS with DynamoDB for real-time inventory and order management.',
    tags:     ['Python', 'FastAPI', 'LangChain', 'Agentic AI', 'AWS', 'DynamoDB'],
    github:   null,
    live:     null,
    accent:   '#818CF8',
  },
  {
    id:     'roboshots',
    title:  'Roboshots',
    desc:   'Cross-platform blog application built with Flutter and Dart, delivering a native experience on Android, iOS, Web, and Desktop from a single codebase. Implements responsive layouts, optimized image caching, and clean architecture patterns.',
    tags:   ['Flutter', 'Dart', 'Cross-platform'],
    github: 'https://github.com/Insiyaya/Roboshots_flutter_blog_app',
    accent: '#A78BFA',
  },
  {
    id:     'jumble',
    title:  'Jumble Words Game',
    desc:   'Desktop word puzzle game featuring a Tkinter GUI with user authentication, an admin panel for word management, persistent score tracking, and modular game logic designed for extensibility.',
    tags:   ['Python', 'Tkinter', 'Game Logic', 'Auth'],
    github: 'https://github.com/Insiyaya/Jumble_words_game',
    accent: '#FBBF24',
  },
  {
    id:     'savour',
    title:  'Savour',
    desc:   'Cross-platform recipe discovery app built with Flutter, showcasing provider-based state management, nested navigation, and category-driven filtering. Ships a polished UI with favourites, filtering, and smooth page transitions.',
    tags:   ['Flutter', 'Dart', 'State Mgmt', 'Cross-platform'],
    github: 'https://github.com/Insiyaya/Flutter_meals',
    accent: '#34D399',
  },
  {
    id:     'talawa',
    title:  'Talawa',
    desc:   'Consistent contributor to PalisadoesFoundation\'s community management platform. Delivered feature PRs, resolved issues, and collaborated through code reviews in the open-source community.',
    tags:   ['Flutter', 'Dart', 'Open Source'],
    github: 'https://github.com/PalisadoesFoundation/talawa',
    accent: '#F472B6',
  },
]

export const WORKFLOW = [
  {
    step:   1,
    title:  'Discover & Define',
    desc:   'I start by deeply understanding the problem space. Mapping user needs, defining constraints, and shaping requirements into clear technical specifications before writing a single line of code.',
    icon:   'FaMagnifyingGlass',
    accent: '#818cf8',
  },
  {
    step:   2,
    title:  'Architect & Plan',
    desc:   'I design the system architecture. Choosing the right stack, modeling data flows, and planning API contracts. Whether it\'s FastAPI microservices or an agentic AI pipeline, the blueprint comes first.',
    icon:   'FaSitemap',
    accent: '#a78bfa',
  },
  {
    step:   3,
    title:  'Build & Iterate',
    desc:   'I develop in focused sprints with rapid feedback loops. Clean code, modular patterns, and continuous testing ensure every feature is production-ready from the first commit.',
    icon:   'FaCode',
    accent: '#38bdf8',
  },
  {
    step:   4,
    title:  'Deploy & Scale',
    desc:   'I ship to the cloud with CI/CD pipelines, containerized services on AWS, and infrastructure-as-code. Every deployment is reproducible, monitored, and built to handle real-world load.',
    icon:   'FaRocket',
    accent: '#34d399',
  },
  {
    step:   5,
    title:  'Measure & Refine',
    desc:   'I track performance metrics, gather user feedback, and iterate. Engineering doesn\'t stop at deployment. I continuously optimize for speed, reliability, and user impact.',
    icon:   'FaChartLine',
    accent: '#f472b6',
  },
]

export const CERTS = [
  {
    id:       'aws',
    name:     'AWS Solutions Architect',
    issuer:   'Amazon Web Services',
    level:    'Associate Level',
    color:    '#FF9900',
    bg:       'rgba(255,153,0,0.07)',
    border:   'rgba(255,153,0,0.18)',
  },
  {
    id:       'azure',
    name:     'Microsoft Azure AI-900',
    issuer:   'Microsoft Azure',
    level:    'AI Fundamentals',
    color:    '#0078D4',
    bg:       'rgba(0,120,212,0.07)',
    border:   'rgba(0,120,212,0.18)',
  },
]

export const EDUCATION = [
  { year: '2021 – 2025', degree: 'B.E. in Engineering',  institution: 'IET DAVV, Indore', score: 'GPA: 8.8 / 10.0' },
  { year: '2021',        degree: 'Class 12th, C.B.S.E',  institution: 'Central Board of Secondary Education', score: '91%' },
  { year: '2019',        degree: 'Class 10th, C.B.S.E',  institution: 'Central Board of Secondary Education', score: '95%' },
]

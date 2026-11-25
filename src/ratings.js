/* Every project and role, with what it was built with. Ratings come from this
   list alone, so adding a project here moves the bars by itself.
   Weights: a job counts 3, a live product or certificate 2, a project 1,
   practice 0.5. */
const WORKS = [
  { name: 'Consultadd', weight: 3, uses: ['Python', 'FastAPI', 'LangChain', 'AI Agents', 'Prompt Engineering', 'AWS', 'DynamoDB'] },
  { name: 'Ruby CRM', weight: 3, uses: ['AI Agents'] },
  { name: 'Walkover', weight: 3, uses: ['Python'] },

  { name: 'Twofolds', weight: 2, uses: ['JavaScript', 'React', 'Next.js', 'Tailwind'] },
  { name: 'TripCraft AI', weight: 2, uses: ['Python', 'TypeScript', 'React', 'Tailwind', 'FastAPI', 'LangChain', 'LangGraph', 'AI Agents', 'Prompt Engineering', 'MongoDB'] },
  { name: 'Bee Hive', weight: 2, uses: ['Python', 'JavaScript', 'React', 'Next.js', 'Tailwind', 'FastAPI', 'LangChain', 'AI Agents', 'AWS', 'DynamoDB'] },
  { name: 'Biscuit Consultant', weight: 2, uses: ['JavaScript', 'React', 'Tailwind'] },
  { name: 'this portfolio', weight: 2, uses: ['JavaScript', 'React', 'Tailwind'] },

  { name: 'Ad Studio', weight: 1, uses: ['TypeScript', 'React', 'Node.js', 'Docker', 'Terraform'] },
  { name: 'Arvaya', weight: 1, uses: ['TypeScript', 'React', 'Next.js', 'Tailwind', 'PostgreSQL', 'SQL'] },
  { name: 'Community Marketplace', weight: 1, uses: ['Python', 'JavaScript', 'React', 'Tailwind', 'FastAPI', 'PostgreSQL', 'SQL', 'Docker', 'AI Agents', 'Prompt Engineering'] },
  { name: 'a claims processor', weight: 1, uses: ['Python', 'TypeScript', 'React', 'Tailwind', 'FastAPI', 'AI Agents', 'Prompt Engineering'] },
  { name: 'a food ordering app', weight: 1, uses: ['TypeScript', 'React', 'Next.js', 'Tailwind', 'Node.js', 'SQL'] },
  { name: 'Our Ever After', weight: 1, uses: ['TypeScript', 'React', 'Next.js', 'Tailwind'] },
  { name: 'Student Club DAO', weight: 1, uses: ['Python', 'TypeScript', 'React', 'Tailwind', 'FastAPI'] },
  { name: 'a Mother’s Day site', weight: 1, uses: ['JavaScript', 'React', 'Next.js', 'Tailwind'] },
  { name: 'a machine learning service', weight: 1, uses: ['Python', 'FastAPI', 'Docker'] },
  { name: 'a Django food ordering backend', weight: 1, uses: ['Python', 'Django', 'SQL'] },
  { name: 'a movie site', weight: 1, uses: ['Python', 'SQL'] },
  { name: 'Jumble Words Game', weight: 1, uses: ['Python', 'SQL'] },
  { name: 'Roboshots', weight: 1, uses: ['Flutter', 'Dart'] },
  { name: 'Savour', weight: 1, uses: ['Flutter', 'Dart'] },
  { name: 'Bohra Bazar', weight: 1, uses: ['Flutter', 'Dart'] },
  { name: 'Talawa', weight: 1, uses: ['Flutter', 'Dart'] },

  { name: 'early web projects', weight: 0.5, uses: ['JavaScript'] },
  { name: 'Hacktoberfest', weight: 0.5, uses: ['C++', 'Python'] },
]

const CERTIFIED = { AWS: { weight: 2, text: 'Certified Solutions Architect, Associate.' } }

const list = names => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`)

/* { level: 3 to 10, text } for one skill. Use grows the level quickly at first,
   then slowly, so one large job does not count as mastery. */
export function rating(skill) {
  const used = WORKS.filter(w => w.uses.includes(skill))
  const cert = CERTIFIED[skill]
  const score = used.reduce((sum, w) => sum + w.weight, cert?.weight ?? 0)
  const level = Math.min(10, Math.round(3 + 1.7 * Math.sqrt(score)))
  if (!used.length) return { level, text: 'Working knowledge.' }
  const names = used.slice(0, 4).map(w => w.name)
  const more = used.length - names.length
  const text = `Used in ${list(more ? [...names, `${more} more`] : names)}.`
  return { level, text: cert ? `${text} ${cert.text}` : text }
}

export interface JourneyItem {
  number: string;
  title: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; tag: string; level?: 'primary' | 'secondary' }[];
}

export interface AIPillar {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export const JOURNEY_MILESTONES: JourneyItem[] = [
  {
    number: '01',
    title: 'EXPLORATION & FOUNDATIONS',
    description: 'Started exploring computing, algorithms, and fundamental computer science architectures.',
  },
  {
    number: '02',
    title: 'MODERN WEB ENGINEERING',
    description: 'Mastered reactive user interfaces, component design systems, and TypeScript full-stack architectures.',
  },
  {
    number: '03',
    title: 'PRODUCTION SYSTEMS',
    description: 'Architected scalable backend APIs, database pipelines, and high-performance cloud applications.',
  },
  {
    number: '04',
    title: 'AI & AGENTIC ARCHITECTURES',
    description: 'Pioneered generative AI tooling, multi-modal pipelines, and autonomous agent workflows.',
  },
  {
    number: '05',
    title: 'CONTINUOUS EXPERIMENTATION',
    description: 'Constantly building, open-sourcing, and deploying cutting-edge digital experiences and AI products.',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'CORE LANGUAGES',
    skills: [
      { name: 'TypeScript', tag: 'LANG', level: 'primary' },
      { name: 'JavaScript (ES6+)', tag: 'LANG', level: 'primary' },
      { name: 'Python', tag: 'LANG', level: 'primary' },
      { name: 'SQL', tag: 'QUERY', level: 'primary' },
      { name: 'HTML5 / CSS3', tag: 'CORE', level: 'secondary' },
    ],
  },
  {
    category: 'FRAMEWORKS & PLATFORMS',
    skills: [
      { name: 'React 19', tag: 'UI', level: 'primary' },
      { name: 'Next.js', tag: 'FULLSTACK', level: 'primary' },
      { name: 'Node.js / Express', tag: 'BACKEND', level: 'primary' },
      { name: 'Tailwind CSS', tag: 'STYLING', level: 'primary' },
      { name: 'Three.js / WebGL', tag: '3D GRAPHICS', level: 'secondary' },
    ],
  },
  {
    category: 'AI & CLOUD ECOSYSTEM',
    skills: [
      { name: 'Gemini API & LLMs', tag: 'AI SYSTEM', level: 'primary' },
      { name: 'REST & GraphQL', tag: 'API', level: 'primary' },
      { name: 'Git & GitHub Actions', tag: 'DEVOPS', level: 'primary' },
      { name: 'PostgreSQL / Firestore', tag: 'DATABASE', level: 'secondary' },
      { name: 'Vite & esbuild', tag: 'TOOLING', level: 'secondary' },
    ],
  },
];

export const AI_PILLARS: AIPillar[] = [
  {
    title: 'AI PRODUCTS',
    subtitle: 'INTELLIGENT SYSTEMS',
    description: 'Building multi-modal AI tools, LLM workflows, and purpose-built agentic applications that solve real problems.',
    tag: 'GEN AI',
  },
  {
    title: 'WEB EXPERIENCES',
    subtitle: 'IMMERSIVE INTERFACES',
    description: 'Crafting responsive, physics-driven 3D web applications with seamless micro-interactions and tactile polish.',
    tag: 'CREATIVE DEV',
  },
  {
    title: 'AUTOMATION',
    subtitle: 'WORKFLOW ENGINE',
    description: 'Eliminating friction by engineering autonomous pipelines, scriptable systems, and scalable developer tools.',
    tag: 'SYSTEMS',
  },
  {
    title: 'EXPERIMENTATION',
    subtitle: 'RAPID PROTOTYPING',
    description: 'Constantly stress-testing emerging models, modern graphics engines, and unconventional creative algorithms.',
    tag: 'R&D',
  },
];

export const CHAPTERS = [
  { id: '01', label: 'IDENTITY', progress: [0.08, 0.25] },
  { id: '02', label: 'JOURNEY', progress: [0.25, 0.45] },
  { id: '03', label: 'TECH STACK', progress: [0.45, 0.65] },
  { id: '04', label: 'AI & SYSTEMS', progress: [0.65, 0.82] },
  { id: '05', label: 'MANIFESTO', progress: [0.82, 0.98] },
];

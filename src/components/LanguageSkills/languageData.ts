export interface ProgrammingLanguage {
  id: string;
  name: string;
  category: 'Systems' | 'AI & Data' | 'Web & Fullstack' | 'Backend & Cloud';
  icon: string; // SVG path or SVG data
  color: string;
  glowColor: string;
  proficiency: number; // 0 - 100
  experience: string;
  description: string;
  projectsCount: number;
  highlightFeature: string;
  // Relative placement around sphere for desktop layout (angle in degrees or quadrant)
  side: 'left' | 'right';
  anchorOffset: { x: number; y: number }; // percentage offset for desktop alignment
}

export const PROGRAMMING_LANGUAGES: ProgrammingLanguage[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Web & Fullstack',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    color: '#3178C6',
    glowColor: 'rgba(49, 120, 198, 0.4)',
    proficiency: 96,
    experience: '4+ Years',
    description: 'Strict type systems, generics, high-scale frontend architectures & Node microservices.',
    projectsCount: 24,
    highlightFeature: 'Strict Types & Generics',
    side: 'left',
    anchorOffset: { x: 18, y: 22 },
  },
  {
    id: 'python',
    name: 'Python',
    category: 'AI & Data',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    color: '#3776AB',
    glowColor: 'rgba(55, 118, 171, 0.4)',
    proficiency: 92,
    experience: '3+ Years',
    description: 'PyTorch ML pipelines, FastAPI microservices, LLM orchestration & automation scripts.',
    projectsCount: 18,
    highlightFeature: 'AI/ML & Automation',
    side: 'left',
    anchorOffset: { x: 14, y: 44 },
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Systems',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
    color: '#DEA584',
    glowColor: 'rgba(222, 165, 132, 0.4)',
    proficiency: 84,
    experience: '2+ Years',
    description: 'Memory-safe systems programming, high-concurrency engines & WebAssembly modules.',
    projectsCount: 8,
    highlightFeature: 'Zero-Cost Abstractions',
    side: 'left',
    anchorOffset: { x: 18, y: 68 },
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Web & Fullstack',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    color: '#F7DF1E',
    glowColor: 'rgba(247, 223, 30, 0.4)',
    proficiency: 98,
    experience: '5+ Years',
    description: 'ESNext features, async event loops, V8 performance tuning & browser APIs.',
    projectsCount: 30,
    highlightFeature: 'Async Event Driven',
    side: 'left',
    anchorOffset: { x: 22, y: 88 },
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'Systems',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    color: '#00599C',
    glowColor: 'rgba(0, 89, 156, 0.4)',
    proficiency: 86,
    experience: '3+ Years',
    description: 'Hardware-adjacent algorithms, low-latency compute, multithreading & computer graphics.',
    projectsCount: 12,
    highlightFeature: 'Low-Latency Compute',
    side: 'right',
    anchorOffset: { x: 82, y: 22 },
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    category: 'Backend & Cloud',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg',
    color: '#00ADD8',
    glowColor: 'rgba(0, 173, 216, 0.4)',
    proficiency: 88,
    experience: '2+ Years',
    description: 'High-throughput gRPC services, goroutine concurrency & cloud-native tooling.',
    projectsCount: 10,
    highlightFeature: 'Goroutine Concurrency',
    side: 'right',
    anchorOffset: { x: 86, y: 44 },
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Backend & Cloud',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    color: '#EA2D2E',
    glowColor: 'rgba(234, 45, 46, 0.4)',
    proficiency: 85,
    experience: '3+ Years',
    description: 'Enterprise backend services, Spring Boot APIs & robust object-oriented architecture.',
    projectsCount: 14,
    highlightFeature: 'Enterprise Systems',
    side: 'right',
    anchorOffset: { x: 82, y: 68 },
  },
  {
    id: 'sql',
    name: 'SQL / PostgreSQL',
    category: 'AI & Data',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    color: '#4169E1',
    glowColor: 'rgba(65, 105, 225, 0.4)',
    proficiency: 90,
    experience: '4+ Years',
    description: 'Complex relational schemas, ACID transactions, vector embeddings (pgvector) & index tuning.',
    projectsCount: 22,
    highlightFeature: 'Relational & Vector Data',
    side: 'right',
    anchorOffset: { x: 78, y: 88 },
  },
];

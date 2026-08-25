export interface CinematicLanguage {
  id: string;
  name: string;
  shortCode: string;
  tagline: string;
  icon: string;
  color: string;
  glowColor: string;
  accentColor: string;
  // Spatial coordinates for wide constellation climax (normalized coordinates)
  orbitAngle: number; // in degrees around core
  orbitRadius: number; // desktop distance in pixels
  spatialZ: number; // 3D depth in px
}

export const CINEMATIC_LANGUAGES: CinematicLanguage[] = [
  {
    id: 'javascript',
    name: 'JAVASCRIPT',
    shortCode: 'JS',
    tagline: 'Async Event Loops & Dynamic Runtime',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    color: '#F7DF1E',
    glowColor: 'rgba(247, 223, 30, 0.4)',
    accentColor: '#FFE600',
    orbitAngle: 210, // bottom-left
    orbitRadius: 360,
    spatialZ: 80,
  },
  {
    id: 'python',
    name: 'PYTHON',
    shortCode: 'PY',
    tagline: 'AI Pipelines & Distributed Computation',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    color: '#3776AB',
    glowColor: 'rgba(55, 118, 171, 0.45)',
    accentColor: '#4B8BBE',
    orbitAngle: 90, // top-center
    orbitRadius: 320,
    spatialZ: -60,
  },
  {
    id: 'typescript',
    name: 'TYPESCRIPT',
    shortCode: 'TS',
    tagline: 'Strict Types & Enterprise Frontend Architecture',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    color: '#3178C6',
    glowColor: 'rgba(49, 120, 198, 0.45)',
    accentColor: '#388BFD',
    orbitAngle: 330, // top-right
    orbitRadius: 380,
    spatialZ: 100,
  },
  {
    id: 'html',
    name: 'HTML',
    shortCode: 'HTML5',
    tagline: 'Semantic Structure & Accessible DOM Foundation',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    color: '#E34F26',
    glowColor: 'rgba(227, 79, 38, 0.45)',
    accentColor: '#FF5722',
    orbitAngle: 150, // mid-left
    orbitRadius: 400,
    spatialZ: -40,
  },
  {
    id: 'css',
    name: 'CSS',
    shortCode: 'CSS3',
    tagline: 'Spatial Layouts, GPU Shaders & Kinetic Motion',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    color: '#1572B6',
    glowColor: 'rgba(21, 114, 182, 0.45)',
    accentColor: '#29B6F6',
    orbitAngle: 30, // mid-right
    orbitRadius: 390,
    spatialZ: 50,
  },
  {
    id: 'sql',
    name: 'SQL',
    shortCode: 'SQL',
    tagline: 'Relational Schemas, ACID Data & Vector Indexes',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    color: '#4169E1',
    glowColor: 'rgba(65, 105, 225, 0.45)',
    accentColor: '#60A5FA',
    orbitAngle: 270, // bottom-right / bottom-center
    orbitRadius: 340,
    spatialZ: 30,
  },
];

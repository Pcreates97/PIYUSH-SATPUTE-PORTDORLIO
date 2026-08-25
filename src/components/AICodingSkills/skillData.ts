export interface SkillItem {
  id: string;
  name: string;
  category: string;
  asset: string;
  // Timeline offset window [start, end] in 0..1 range of the orbital phase (0.15 to 0.88)
  startOffset: number;
  endOffset: number;
  depthTier: 'front' | 'mid' | 'back';
  // Arch path height offset multiplier (to stagger heights naturally above shoulders)
  archHeightRatio: number;
  // Slight horizontal spread offset
  spreadOffset: number;
  // Subtle card tilt in degrees
  tilt: number;
}

export const CHARACTER_IMAGE = '/skills/ai-coder-character.png';

export const SKILL_ITEMS: SkillItem[] = [
  // 1. Developer Platforms & Deployment (Phase 1)
  {
    id: 'github',
    name: 'GitHub',
    category: 'DEVELOPER PLATFORM',
    asset: '/skills/github.jpg',
    startOffset: 0.12,
    endOffset: 0.44,
    depthTier: 'mid',
    archHeightRatio: 0.88,
    spreadOffset: -0.05,
    tilt: -1.5,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'DEPLOYMENT & EDGE',
    asset: '/skills/vercel.jpg',
    startOffset: 0.16,
    endOffset: 0.48,
    depthTier: 'front',
    archHeightRatio: 0.94,
    spreadOffset: 0.04,
    tilt: 1.2,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'IDE & WORKSPACE',
    asset: '/skills/vscode.jpg',
    startOffset: 0.20,
    endOffset: 0.52,
    depthTier: 'mid',
    archHeightRatio: 0.84,
    spreadOffset: -0.08,
    tilt: -2.0,
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'DATABASE & REALTIME',
    asset: '/skills/supabase.jpg',
    startOffset: 0.24,
    endOffset: 0.56,
    depthTier: 'front',
    archHeightRatio: 0.96,
    spreadOffset: 0.06,
    tilt: 1.8,
  },
  {
    id: 'firebase',
    name: 'Firebase',
    category: 'BACKEND & AUTH',
    asset: '/skills/firebase.jpg',
    startOffset: 0.28,
    endOffset: 0.60,
    depthTier: 'back',
    archHeightRatio: 0.78,
    spreadOffset: -0.03,
    tilt: -1.0,
  },

  // 2. AI Intelligence & Language Models (Phase 2)
  {
    id: 'claude',
    name: 'Claude',
    category: 'REASONING & SYNTHESIS',
    asset: '/skills/claude.jpg',
    startOffset: 0.32,
    endOffset: 0.64,
    depthTier: 'front',
    archHeightRatio: 0.98,
    spreadOffset: 0.08,
    tilt: 2.2,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'LLM INTELLIGENCE',
    asset: '/skills/chatgpt.jpg',
    startOffset: 0.36,
    endOffset: 0.68,
    depthTier: 'mid',
    archHeightRatio: 0.90,
    spreadOffset: -0.06,
    tilt: -1.8,
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    category: 'NEURAL CODE ENGINE',
    asset: '/skills/codex.png',
    startOffset: 0.40,
    endOffset: 0.72,
    depthTier: 'front',
    archHeightRatio: 0.92,
    spreadOffset: 0.05,
    tilt: 1.4,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'MULTIMODAL AI',
    asset: '/skills/gemini.jpg',
    startOffset: 0.44,
    endOffset: 0.76,
    depthTier: 'mid',
    archHeightRatio: 0.86,
    spreadOffset: -0.04,
    tilt: -2.2,
  },

  // 3. Autonomous Agents & Rapid Prototyping (Phase 3)
  {
    id: 'replit',
    name: 'Replit',
    category: 'COLLABORATIVE RUNTIME',
    asset: '/skills/replit.jpg',
    startOffset: 0.48,
    endOffset: 0.80,
    depthTier: 'back',
    archHeightRatio: 0.80,
    spreadOffset: 0.03,
    tilt: 1.0,
  },
  {
    id: 'lovable',
    name: 'Lovable',
    category: 'FULLSTACK GENERATION',
    asset: '/skills/lovable.jpg',
    startOffset: 0.52,
    endOffset: 0.84,
    depthTier: 'front',
    archHeightRatio: 0.95,
    spreadOffset: -0.07,
    tilt: -1.6,
  },
  {
    id: 'google-antigravity',
    name: 'Google Antigravity',
    category: 'AGENTIC WORKFLOWS',
    asset: '/skills/google-antigravity.jpg',
    startOffset: 0.56,
    endOffset: 0.88,
    depthTier: 'front',
    archHeightRatio: 1.0,
    spreadOffset: 0.09,
    tilt: 2.0,
  },
  {
    id: 'clawd',
    name: 'Claude Code',
    category: 'AUTONOMOUS AGENT',
    asset: '/skills/clawd.jpg',
    startOffset: 0.60,
    endOffset: 0.90,
    depthTier: 'mid',
    archHeightRatio: 0.88,
    spreadOffset: -0.05,
    tilt: -1.2,
  },
  {
    id: 'cursor',
    name: 'Cursor AI',
    category: 'AI-NATIVE EDITOR',
    asset: '/skills/cursor.jpg',
    startOffset: 0.64,
    endOffset: 0.92,
    depthTier: 'front',
    archHeightRatio: 0.93,
    spreadOffset: 0.04,
    tilt: 1.5,
  },
  {
    id: 'brand-studio',
    name: 'Design Systems',
    category: 'CREATIVE UI & BRAND',
    asset: '/skills/brand-studio.jpg',
    startOffset: 0.68,
    endOffset: 0.94,
    depthTier: 'back',
    archHeightRatio: 0.82,
    spreadOffset: -0.06,
    tilt: -1.5,
  },
];

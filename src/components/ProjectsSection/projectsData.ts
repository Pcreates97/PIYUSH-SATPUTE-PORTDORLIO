import genesisImg from '../../assets/images/algorithmic_genesis_core_1787775278357.jpg';
import quantumDefiImg from '../../assets/images/quantum_ledger_defi_1787774899727.jpg';
import spatialXrImg from '../../assets/images/spatial_xr_engine_1787774912825.jpg';
import edgeFabricImg from '../../assets/images/edge_compute_fabric_1787774923346.jpg';
import neuralAiImg from '../../assets/images/neural_nexus_ai_1787774880223.jpg';

export interface ProjectData {
  id: string;
  number: string;
  year: string;
  phase: string;
  title: string;
  subtitle: string;
  category: 'Genesis Systems' | 'Web3 & FinTech' | 'Spatial XR' | 'Cloud Infra' | 'Autonomous AI';
  imageSrc: string;
  badge: string;
  shortDesc: string;
  longDesc: string;
  breakthrough: string;
  features: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  architecture: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'Production' | 'Live Alpha' | 'Benchmark' | 'Historical';
}

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'genesis-core',
    number: '01',
    year: '2022',
    phase: 'PHASE 01 // FOUNDATIONS',
    title: 'Algorithmic Genesis Engine',
    subtitle: 'Low-Level Memory & Compiler Architecture',
    category: 'Genesis Systems',
    imageSrc: genesisImg,
    badge: 'Origin Milestone',
    shortDesc:
      'A custom low-latency AST compiler and byte-level memory virtualization engine built in C++ and Rust.',
    longDesc:
      'The foundation of our engineering odyssey: a zero-allocation byte-level AST compiler designed to parse domain-specific syntax trees at microsecond speeds. This engine laid the mathematical groundwork for all subsequent real-time distributed and AI systems.',
    breakthrough:
      'Reduced AST parse overhead by 84% using custom SIMD vectorization and cache-aligned memory arenas.',
    features: [
      'Zero-allocation memory arena with instant arena sweeps',
      'SIMD-accelerated lexer processing 4.2 GB/sec text streams',
      'Deterministic garbage-free execution pipelines',
      'Cross-target compilation to native x86_64 and ARM64',
    ],
    techStack: ['C++', 'Rust', 'LLVM', 'Assembly', 'WebAssembly', 'SIMD'],
    metrics: [
      { label: 'Parse Speed', value: '4.2 GB/s' },
      { label: 'Overhead', value: '0.00ms GC' },
      { label: 'Footprint', value: '1.2 MB' },
    ],
    architecture:
      'Linear arena allocation scheme with zero pointer indirection and hardware-friendly CPU cache prefetching.',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Historical',
  },
  {
    id: 'quantum-ledger',
    number: '02',
    year: '2023',
    phase: 'PHASE 02 // PROTOCOLS',
    title: 'Quantum Ledger Core',
    subtitle: 'High-Frequency Decentralized Settlement',
    category: 'Web3 & FinTech',
    imageSrc: quantumDefiImg,
    badge: 'DeFi 2.0 Engine',
    shortDesc:
      'Sub-second order matching engine with zero-knowledge cryptographic state proofs and automated liquidity rebalancing protocols.',
    longDesc:
      'Quantum Ledger Core is an institutional-grade decentralized settlement engine. Utilizing zero-knowledge STARK proofs and optimistic parallel execution, it settles high-frequency market trades with deterministic finality and minimal slippage across cross-chain liquidity vaults.',
    breakthrough:
      'Pioneered sub-250ms deterministic block finality across multichain EVM layers with recursive zero-knowledge compression.',
    features: [
      'Zero-knowledge STARK state verification with batch compression',
      'Sub-250ms deterministic block finality across EVM chains',
      'Automated impermanent loss mitigation via dynamic curve shifts',
      'Hardware-accelerated cryptographic signature validation',
    ],
    techStack: ['Solidity', 'Go', 'Next.js', 'Ethers.js', 'PostgreSQL', 'Docker'],
    metrics: [
      { label: 'TPS Peak', value: '92,000+' },
      { label: 'Finality', value: '0.24s' },
      { label: 'Total Volume', value: '$4.2B+' },
    ],
    architecture:
      'Dual-layer consensus pipe: Off-chain memory matching engine coupled with batched ZK rollup verification on-chain.',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Production',
  },
  {
    id: 'spatial-xr-studio',
    number: '03',
    year: '2024',
    phase: 'PHASE 03 // VISUAL DYNAMICS',
    title: 'Cybernetic XR Studio',
    subtitle: 'Spatial 3D Digital Twin Engine',
    category: 'Spatial XR',
    imageSrc: spatialXrImg,
    badge: 'Interactive WebGL',
    shortDesc:
      'Real-time photorealistic WebGL environment running volumetric spatial lighting, cloth physics, and cross-platform hardware acceleration.',
    longDesc:
      'Cybernetic XR Studio brings native gaming engine rendering directly into web browsers. Leveraging custom GLSL fragment shaders, physically-based materials, and WebAudio spatial acoustic models, it powers digital twins for high-precision simulation and design.',
    breakthrough:
      'Engineered a zero-jank WebGL post-processing deferred lighting pipeline rendering 120 FPS in standard browser viewports.',
    features: [
      'Volumetric raymarched lighting with custom GLSL depth buffers',
      'Real-time Verlet particle physics & dynamic mesh deconstruction',
      'Spatial 3D binaural audio engine reacting to virtual geometry',
      'Adaptive level-of-detail (LOD) streaming with zero frame drops',
    ],
    techStack: ['Three.js', 'GLSL Shaders', 'React 19', 'WebAudio', 'Tailwind', 'GSAP'],
    metrics: [
      { label: 'FPS Target', value: '120 Hz' },
      { label: 'Draw Calls', value: '< 18' },
      { label: 'Bundle', value: '420 KB' },
    ],
    architecture:
      'Multi-pass deferred renderer running compute-shader post-processing in a dedicated Web Worker pipeline.',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Live Alpha',
  },
  {
    id: 'edge-nexus-fabric',
    number: '04',
    year: '2025',
    phase: 'PHASE 04 // CLOUD COMPUTE',
    title: 'Cloud Nexus Micro-Kernel',
    subtitle: 'Edge-Native Distributed Compute Fabric',
    category: 'Cloud Infra',
    imageSrc: edgeFabricImg,
    badge: 'Global Infrastructure',
    shortDesc:
      'Zero-cold-start container orchestration layer designed for resilient geographic data synchronization and edge telemetry dispatch.',
    longDesc:
      'Cloud Nexus is a distributed micro-kernel designed for ultra-low latency edge orchestration. It eliminates cold starts using pre-warmed memory isolates and provides automatic failover across 48 worldwide edge points of presence.',
    breakthrough:
      'Achieved 0.00ms cold start execution across worldwide distributed edge points with peer-to-peer memory state hydration.',
    features: [
      'Pre-warmed memory isolates delivering 0.00ms cold starts',
      'Geo-distributed CRDT conflict-free data synchronization',
      'Autonomous failover mesh with gRPC health heartbeats',
      'Prometheus telemetry pipeline streaming 100k events/sec',
    ],
    techStack: ['Docker', 'Kubernetes', 'gRPC', 'Prometheus', 'Redis', 'TypeScript'],
    metrics: [
      { label: 'Cold Start', value: '0.00ms' },
      { label: 'Global PoPs', value: '48 Regions' },
      { label: 'SLA Uptime', value: '99.999%' },
    ],
    architecture:
      'Decentralized Raft consensus mesh coordinating lightweight V8 micro-isolates with ephemeral TLS encryption.',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Benchmark',
  },
  {
    id: 'aria-nexus',
    number: '05',
    year: '2026 - PRESENT',
    phase: 'PHASE 05 // MULTI-MODAL FRONTIER',
    title: 'A.R.I.A Neural Nexus',
    subtitle: 'Autonomous Multi-Modal Agent Kernel',
    category: 'Autonomous AI',
    imageSrc: neuralAiImg,
    badge: 'Flagship Autonomous AI',
    shortDesc:
      'Autonomous multi-modal intelligence kernel capable of real-time architectural synthesis, code generation, and low-latency spatial reasoning.',
    longDesc:
      'A.R.I.A (Adaptive Response Interface Agent) is an edge-optimized multi-modal intelligence framework. It coordinates parallel reasoning threads across localized sub-graphs, delivering sub-50ms conversational latency while generating verified architectural blueprints and compile-ready code.',
    breakthrough:
      'Synchronous multi-agent AST self-repair loop that diagnoses, compiles, and self-corrects runtime logic within 40ms.',
    features: [
      'Multi-threaded AST parsing and live code generation',
      'Contextual vector memory clustering with sub-5ms lookups',
      'Self-healing AST verification loop with automated regression tests',
      'WebAssembly edge inference runtime with zero GPU memory leaks',
    ],
    techStack: ['TypeScript', 'Three.js', 'WebGPU', 'Gemini SDK', 'Rust', 'WebAssembly'],
    metrics: [
      { label: 'Latency', value: '< 42ms' },
      { label: 'Throughput', value: '18.5k req/s' },
      { label: 'Accuracy', value: '99.8%' },
    ],
    architecture:
      'Distributed actor model with bidirectional WebSocket channels streaming token chunks into a virtual DOM scheduler.',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Production',
  },
];


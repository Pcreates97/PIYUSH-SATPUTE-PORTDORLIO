import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  Code2,
  Terminal,
  Send,
  Copy,
  Check,
  Layers,
  Cpu,
  Globe,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export type DrawerType = 'projects' | 'expertise' | 'about' | 'contact' | null;

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  stack: string[];
  description: string;
  metrics: string;
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'neural-core',
    title: 'NEURAL-CORE PLATFORM',
    category: 'DISTRIBUTED ARCHITECTURE',
    tag: 'PRODUCTION',
    stack: ['TypeScript', 'Go', 'Redis', 'Docker', 'WebSockets'],
    description:
      'Ultra-low latency event-driven streaming platform processing 100k+ real-time telemetry events/sec with fault-tolerant worker pools.',
    metrics: '<15ms p99 latency',
  },
  {
    id: 'synapse-canvas',
    title: 'SYNAPSE CANVAS ENGINE',
    category: 'CREATIVE COMPUTING',
    tag: 'OPEN SOURCE',
    stack: ['React 19', 'WebGL', 'GLSL Shaders', 'Tailwind CSS'],
    description:
      'Hardware-accelerated generative visual workspace and interactive shader graph with mathematical curve manipulation and zero layout thrash.',
    metrics: '60 FPS stable WebGL',
  },
  {
    id: 'orbital-vault',
    title: 'ORBITAL VAULT INFRA',
    category: 'SECURITY & CLOUD',
    tag: 'SYSTEMS',
    stack: ['Rust', 'Cloudflare Workers', 'PostgreSQL', 'gRPC'],
    description:
      'Zero-knowledge encrypted secret management and identity federation engine with automated cryptographic key rotation.',
    metrics: 'End-to-End Zero Knowledge',
  },
  {
    id: 'quantum-mesh',
    title: 'QUANTUM MESH RUNTIME',
    category: 'FULL-STACK APPS',
    tag: 'FEATURED',
    stack: ['Next.js', 'Node.js', 'GraphQL', 'Kubernetes'],
    description:
      'Micro-frontend orchestration platform enabling dynamic federated module synthesis and predictive asset prefetching.',
    metrics: '99.99% Service Uptime',
  },
];

export const TECH_DOMAINS = [
  {
    title: 'FRONTEND & INTERFACE',
    icon: Globe,
    skills: [
      'React 19',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'WebGL / Canvas',
      'State Machines',
      'Vite',
    ],
    highlight: 'Pixel-perfect, accessible, high-framerate fluid user experiences.',
  },
  {
    title: 'BACKEND & DISTRIBUTED',
    icon: Cpu,
    skills: [
      'Node.js / Express',
      'Go (Golang)',
      'Python',
      'REST & GraphQL APIs',
      'gRPC',
      'Redis Caching',
      'PostgreSQL',
    ],
    highlight: 'Scalable microservices, concurrency pipelines, and data consistency.',
  },
  {
    title: 'SYSTEMS & CLOUD DEVOPS',
    icon: Layers,
    skills: [
      'Docker Containers',
      'Kubernetes',
      'CI/CD Workflows',
      'Cloud Run / GCP',
      'AWS Infrastructure',
      'Linux Kernel & Shell',
    ],
    highlight: 'Automated deployments, immutable infrastructure, and observability.',
  },
];

export const PHILOSOPHY_POINTS = [
  {
    title: '01 / MINIMAL ARCHITECTURE',
    desc: 'Eliminating architectural bloat in favor of deterministic, type-safe, and self-documenting codebases.',
  },
  {
    title: '02 / PERFORMANCE FIRST',
    desc: 'Sub-millisecond API responses, 60fps interaction budgets, and thoughtful memory lifecycle management.',
  },
  {
    title: '03 / RESILIENT SYSTEMS',
    desc: 'Fault-tolerant distributed nodes with graceful degradation, circuit breakers, and end-to-end security.',
  },
];

interface DrawersProps {
  activeDrawer: DrawerType;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export function Drawers({ activeDrawer, onClose, onShowToast }: DrawersProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!activeDrawer) return null;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    onShowToast(`Copied ${email} to clipboard!`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) {
      onShowToast('Please fill in email and message fields.');
      return;
    }
    onShowToast('Message transmitted successfully! Will respond promptly.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    onClose();
  };

  return (
    <div
      id="drawer-container"
      className="fixed inset-0 z-50 flex justify-end"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        id="drawer-backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        id="drawer-panel"
        className="relative z-10 h-full w-full bg-[#0a0a0a] text-white border-l border-neutral-800 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right"
        style={{
          maxWidth: 'var(--drawer-max)',
          padding: 'var(--drawer-pad)',
        }}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h2
                id="drawer-title"
                className="font-orbitron font-bold uppercase tracking-wider text-white text-lg md:text-xl"
              >
                {activeDrawer === 'projects' && 'Selected Works'}
                {activeDrawer === 'expertise' && 'Stack & Systems'}
                {activeDrawer === 'about' && 'Engineering Bio'}
                {activeDrawer === 'contact' && 'Direct Dispatch'}
              </h2>
              <p className="text-neutral-400 font-jakarta text-xs uppercase tracking-widest mt-0.5">
                {activeDrawer === 'projects' && 'Software & Web Architectures'}
                {activeDrawer === 'expertise' && 'Core Technologies & Tools'}
                {activeDrawer === 'about' && 'Philosophy & Background'}
                {activeDrawer === 'contact' && 'Initialize Communication'}
              </p>
            </div>

            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-sm transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Drawer Body Contents */}
          <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1 custom-scrollbar">
            {/* 1. PROJECTS */}
            {activeDrawer === 'projects' && (
              <div id="drawer-projects-list" className="space-y-4">
                {PORTFOLIO_PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    id={`project-card-${proj.id}`}
                    className="p-4 border border-neutral-800 bg-neutral-950/80 hover:border-neutral-600 transition-colors flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className="text-neutral-400 font-jakarta uppercase tracking-wider text-[10px]"
                        >
                          {proj.category}
                        </span>
                        <span className="text-[10px] font-orbitron px-1.5 py-0.5 border border-neutral-700 text-neutral-300 rounded-xs">
                          {proj.tag}
                        </span>
                      </div>

                      <h3 className="font-orbitron font-semibold text-white text-sm tracking-wide group-hover:text-white transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-neutral-300 text-xs font-jakarta mt-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-900 flex flex-wrap gap-1.5 items-center">
                      {proj.stack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono rounded-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                      <span className="text-neutral-400 font-jakarta text-[11px]">
                        {proj.metrics}
                      </span>
                      <button
                        id={`explore-proj-${proj.id}`}
                        onClick={() =>
                          onShowToast(`Viewing technical specification for ${proj.title}`)
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-jakarta font-semibold uppercase tracking-wider text-white hover:text-neutral-300 transition-colors cursor-pointer"
                      >
                        <span>DETAILS</span>
                        <ExternalLink size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. EXPERTISE / TECH STACK */}
            {activeDrawer === 'expertise' && (
              <div id="drawer-expertise-list" className="space-y-4">
                {TECH_DOMAINS.map((domain, idx) => {
                  const IconComp = domain.icon;
                  return (
                    <div
                      key={idx}
                      id={`tech-domain-${idx}`}
                      className="p-4 border border-neutral-800 bg-neutral-950/80 hover:border-neutral-600 transition-colors space-y-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-sm text-white">
                          <IconComp size={16} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-orbitron font-bold text-white text-xs tracking-wider">
                          {domain.title}
                        </h3>
                      </div>

                      <p className="text-neutral-400 text-xs font-jakarta">
                        {domain.highlight}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {domain.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-xs px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-white font-jakarta rounded-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. ABOUT / BIO */}
            {activeDrawer === 'about' && (
              <div id="drawer-about-list" className="space-y-4">
                <div className="p-4 border border-neutral-800 bg-neutral-950/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-white" strokeWidth={1.5} />
                    <h3 className="font-orbitron font-bold text-white text-xs tracking-wider">
                      FULL-STACK SOFTWARE ENGINEER
                    </h3>
                  </div>
                  <p className="text-neutral-300 text-xs font-jakarta leading-relaxed">
                    Specialized in designing robust distributed backends, interactive high-framerate web applications, and intuitive developer tooling. Combining engineering precision with modern aesthetic minimalism.
                  </p>
                </div>

                <div className="p-4 border border-neutral-800 bg-neutral-950/80 space-y-3">
                  <h4 className="font-orbitron font-semibold text-neutral-400 text-xs uppercase tracking-wider">
                    Core Principles
                  </h4>
                  <div className="space-y-2.5">
                    {PHILOSOPHY_POINTS.map((pt, pIdx) => (
                      <div key={pIdx} className="space-y-0.5">
                        <div className="font-orbitron text-[11px] text-white font-medium">
                          {pt.title}
                        </div>
                        <div className="text-neutral-400 text-xs font-jakarta leading-relaxed">
                          {pt.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. CONTACT */}
            {activeDrawer === 'contact' && (
              <div id="drawer-contact-view" className="space-y-4">
                {/* Direct quick copy */}
                <div className="p-3.5 border border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-orbitron text-neutral-400 uppercase tracking-wider">
                      Direct Email
                    </div>
                    <div className="text-xs font-mono text-white mt-0.5">
                      dev.engineer@lgpsm.io
                    </div>
                  </div>
                  <button
                    id="copy-email-btn"
                    onClick={() => handleCopyEmail('dev.engineer@lgpsm.io')}
                    className="p-2 border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-500 rounded-sm transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Interactive Message Dispatch Form */}
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-orbitron text-neutral-400 uppercase tracking-wider mb-1">
                      Your Name / Identifier
                    </label>
                    <input
                      id="contact-name-input"
                      type="text"
                      placeholder="e.g. Alex Vance"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white text-xs font-jakarta placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-orbitron text-neutral-400 uppercase tracking-wider mb-1">
                      Contact Email *
                    </label>
                    <input
                      id="contact-email-input"
                      type="email"
                      required
                      placeholder="e.g. alex@enterprise.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white text-xs font-jakarta placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-orbitron text-neutral-400 uppercase tracking-wider mb-1">
                      Transmission / Project Scope *
                    </label>
                    <textarea
                      id="contact-message-input"
                      required
                      rows={3}
                      placeholder="Describe technical project, collaboration, or engineering role..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white text-xs font-jakarta placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 rounded-xs resize-none"
                    />
                  </div>

                  <button
                    id="transmit-message-btn"
                    type="submit"
                    className="w-full py-3 px-4 bg-white text-black hover:bg-neutral-200 transition-colors font-jakarta font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                  >
                    <span>TRANSMIT DISPATCH</span>
                    <Send size={14} strokeWidth={2} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Bottom / Footer */}
        <div className="pt-4 border-t border-neutral-800 mt-auto">
          <p
            className="text-neutral-500 text-center uppercase tracking-widest font-jakarta"
            style={{ fontSize: 'var(--micro)' }}
          >
            PIYUSH © 2026 — SOFTWARE ENGINEER & WEB DEVELOPER
          </p>
        </div>
      </div>
    </div>
  );
}

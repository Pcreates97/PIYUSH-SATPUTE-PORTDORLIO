import React from 'react';
import { Sparkles, Terminal, Cpu, ArrowUpRight } from 'lucide-react';
import type { DrawerType } from './Drawers';

interface AboutSectionProps {
  onOpenDrawer?: (drawer: DrawerType) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenDrawer }) => {
  const CURRENTLY_BUILDING = [
    {
      title: 'Autonomous Multi-Modal Reasoning Agent',
      status: 'IN PROGRESS',
      statusColor: 'bg-emerald-400',
      description: 'Zero-latency multi-agent code orchestration and real-time AST synthesis with local models.',
      tag: 'AI / LLMS',
    },
    {
      title: 'Real-Time WebGPU Neural Visualizer',
      status: 'EXPERIMENTING',
      statusColor: 'bg-amber-400',
      description: 'Direct GPU compute shader pipelines rendering million-particle physics in web browsers.',
      tag: 'WEBGPU / 3D',
    },
    {
      title: 'Zero-Cold-Start Edge Micro-Kernel',
      status: 'IN PROGRESS',
      statusColor: 'bg-emerald-400',
      description: 'Pre-warmed V8 micro-isolates with distributed memory snapshot hydration.',
      tag: 'SYSTEMS / DISTRIBUTED',
    },
  ];

  return (
    <section
      id="section-about"
      className="relative w-full bg-black text-white py-24 sm:py-32 border-t border-neutral-900 overflow-hidden selection:bg-white selection:text-black"
      aria-label="About & Currently Building"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>05 // ABOUT & INITIATIVES</span>
        </div>

        {/* Main Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-[1.05] mb-6">
              I LEARN <br />
              <span className="text-neutral-400">BY BUILDING.</span>
            </h2>

            <div className="space-y-4 text-neutral-300 font-light text-base sm:text-lg leading-relaxed max-w-2xl">
              <p>
                Driven by deep curiosity, I explore the convergence of creative engineering, autonomous AI models, and scalable systems.
              </p>
              <p>
                I don’t wait for permission or perfect playbooks. Every idea begins with code, an experiment, and a commitment to meticulous craft—from mathematical pixel rendering to distributed cloud architectures.
              </p>
            </div>

            {/* Quick Specs / Highlights */}
            <div className="mt-8 pt-8 border-t border-neutral-900 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs">
              <div>
                <span className="text-neutral-500 uppercase tracking-widest block mb-1">Focus</span>
                <span className="text-white font-semibold">AI Products & Creative Web</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase tracking-widest block mb-1">Location</span>
                <span className="text-white font-semibold">Remote / Worldwide</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase tracking-widest block mb-1">Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available for Projects
                </span>
              </div>
            </div>
          </div>

          {/* Currently Building Column */}
          <div className="lg:col-span-5 bg-neutral-950/80 border border-neutral-800/80 p-6 sm:p-8 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-white" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                  CURRENTLY BUILDING
                </h3>
              </div>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                ACTIVE LABS
              </span>
            </div>

            <div className="space-y-5">
              {CURRENTLY_BUILDING.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col p-4 rounded-xl border border-neutral-800/60 bg-neutral-900/30 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest font-semibold text-neutral-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor} animate-pulse`} />
                      <span>{item.status}</span>
                    </div>
                  </div>

                  <h4 className="font-orbitron text-sm font-bold text-white uppercase mb-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenDrawer?.('about')}
              className="mt-6 w-full py-3 rounded-lg border border-neutral-800 hover:border-neutral-600 bg-neutral-900/50 hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 text-neutral-300 cursor-pointer"
            >
              <span>VIEW FULL PHILOSOPHY & BACKGROUND</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

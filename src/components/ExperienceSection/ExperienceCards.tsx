import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  JOURNEY_MILESTONES,
  SKILL_CATEGORIES,
  AI_PILLARS,
  CHAPTERS,
} from './experienceData';
import {
  CornerBracketTL,
  CornerBracketTR,
  CornerBracketBL,
  CornerBracketBR,
} from '../SVGs';
import { Sparkles, Terminal, Cpu, Layers, Compass, ArrowDownRight } from 'lucide-react';

export interface ExperienceCardsHandle {
  updateTelemetry: (progress: number, frameIndex: number) => void;
}

interface ExperienceCardsProps {
  totalFrames?: number;
}

export const ExperienceCards = forwardRef<ExperienceCardsHandle, ExperienceCardsProps>(
  ({ totalFrames = 150 }, ref) => {
    const orbitDegreesRef = useRef<HTMLSpanElement | null>(null);
    const frameNumberRef = useRef<HTMLSpanElement | null>(null);
    const progressPercentRef = useRef<HTMLSpanElement | null>(null);
    const chapterDotsRef = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      updateTelemetry: (progress: number, frameIndex: number) => {
        // Fast direct DOM property updates - Zero React re-renders!
        if (orbitDegreesRef.current) {
          const deg = Math.round(progress * 360);
          orbitDegreesRef.current.textContent = `${String(deg).padStart(3, '0')}° / 360°`;
        }

        if (frameNumberRef.current) {
          const frameStr = String(frameIndex + 1).padStart(3, '0');
          frameNumberRef.current.textContent = `${frameStr}`;
        }

        if (progressPercentRef.current) {
          const pct = Math.round(progress * 100);
          progressPercentRef.current.textContent = `${pct}%`;
        }

        // Update Chapter indicator states
        CHAPTERS.forEach((ch, idx) => {
          const el = chapterDotsRef.current[idx];
          if (!el) return;
          const isActive = progress >= ch.progress[0] && progress < ch.progress[1];
          const isPassed = progress >= ch.progress[1];

          if (isActive) {
            el.style.opacity = '1';
            el.style.transform = 'translateX(4px)';
            const dot = el.querySelector('.chapter-dot') as HTMLElement;
            if (dot) {
              dot.style.backgroundColor = '#ffffff';
              dot.style.boxShadow = '0 0 10px rgba(255,255,255,0.9)';
              dot.style.transform = 'scale(1.4)';
            }
            const label = el.querySelector('.chapter-label') as HTMLElement;
            if (label) {
              label.style.color = '#ffffff';
              label.style.fontWeight = '600';
            }
          } else {
            el.style.opacity = isPassed ? '0.45' : '0.25';
            el.style.transform = 'translateX(0px)';
            const dot = el.querySelector('.chapter-dot') as HTMLElement;
            if (dot) {
              dot.style.backgroundColor = isPassed ? '#a3a3a3' : '#525252';
              dot.style.boxShadow = 'none';
              dot.style.transform = 'scale(1)';
            }
            const label = el.querySelector('.chapter-label') as HTMLElement;
            if (label) {
              label.style.color = isPassed ? '#a3a3a3' : '#737373';
              label.style.fontWeight = '400';
            }
          }
        });
      },
    }), []);

    return (
      <div
        id="experience-overlay-hud"
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none font-jakarta"
      >
        {/* 1. Top HUD Header Bar */}
        <div
          id="hud-top-bar"
          className="absolute top-0 inset-x-0 flex items-center justify-between z-20"
          style={{
            paddingInline: 'var(--pad-x)',
            paddingTop: 'var(--header-pt)',
          }}
        >
          {/* Left Section Label */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-xs bg-white animate-pulse" />
            <div className="flex flex-col">
              <span className="font-orbitron text-xs md:text-sm tracking-[0.25em] font-bold text-white uppercase">
                02 // THE BUILDER
              </span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                CINEMATIC SPATIAL TIMELINE
              </span>
            </div>
          </div>

          {/* Right HUD Live Orbit Metrics */}
          <div className="flex items-center gap-4 text-right">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                ORBIT ANGLE
              </span>
              <span ref={orbitDegreesRef} className="font-mono text-xs font-semibold text-white">
                000° / 360°
              </span>
            </div>
            <div className="flex flex-col items-end border-l border-neutral-800 pl-4">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                FRAME
              </span>
              <span className="font-mono text-xs font-semibold text-white">
                <span ref={frameNumberRef}>001</span> <span className="text-neutral-500">/ {totalFrames}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Side Chapter Progression Track (Desktop) */}
        <div
          id="hud-chapter-timeline"
          className="hidden md:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-20 pointer-events-auto"
        >
          {CHAPTERS.map((ch, idx) => {
            const isInitial = idx === 0;
            return (
              <div
                key={ch.id}
                ref={(el) => {
                  chapterDotsRef.current[idx] = el;
                }}
                className="group flex items-center gap-3 cursor-default transition-all duration-300"
                style={{
                  opacity: isInitial ? 1 : 0.25,
                  transform: isInitial ? 'translateX(4px)' : 'translateX(0px)',
                }}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className="chapter-dot w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isInitial ? '#ffffff' : '#525252',
                      boxShadow: isInitial ? '0 0 10px rgba(255,255,255,0.9)' : 'none',
                      transform: isInitial ? 'scale(1.4)' : 'scale(1)',
                    }}
                  />
                </div>
                <span
                  className="chapter-label font-mono text-[10px] tracking-widest uppercase transition-colors"
                  style={{
                    color: isInitial ? '#ffffff' : '#737373',
                    fontWeight: isInitial ? '600' : '400',
                  }}
                >
                  {ch.id} — {ch.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 3. Bottom HUD Bar */}
        <div
          id="hud-bottom-bar"
          className="absolute bottom-6 inset-x-0 flex items-center justify-between z-20 text-[11px] font-mono tracking-widest text-neutral-500"
          style={{ paddingInline: 'var(--pad-x)' }}
        >
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-neutral-400 animate-spin" style={{ animationDuration: '14s' }} />
            <span className="hidden sm:inline">PROGRESS</span>
            <span ref={progressPercentRef} className="text-white font-semibold">
              0%
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <span>SCROLL TO ROTATE & DISCOVER</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. CINEMATIC GLASSMORPHIC CARDS (GPU Hardware Accelerated)    */}
        {/* ------------------------------------------------------------- */}

        {/* CARD 01: WHO I AM */}
        <div
          id="experience-card-01"
          className="absolute z-20 left-4 right-4 sm:left-12 lg:left-24 sm:right-auto top-1/2 -translate-y-1/2 max-w-md pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.96)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="relative p-6 md:p-8 rounded-xl bg-neutral-950/80 border border-white/15 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 text-white/50">
              <CornerBracketTL id="card1-tl" />
            </div>
            <div className="absolute top-0 right-0 text-white/50">
              <CornerBracketTR id="card1-tr" />
            </div>
            <div className="absolute bottom-0 left-0 text-white/50">
              <CornerBracketBL id="card1-bl" />
            </div>
            <div className="absolute bottom-0 right-0 text-white/50">
              <CornerBracketBR id="card1-br" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                01 // IDENTITY
              </span>
              <Sparkles size={14} className="text-white/60" />
            </div>

            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
              WHO I AM
            </span>
            <h2 className="font-orbitron text-2xl md:text-3xl font-extrabold text-white tracking-wide uppercase mb-2">
              Piyush
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs uppercase tracking-wider font-medium text-neutral-200 bg-neutral-900/90 px-2.5 py-1 rounded border border-neutral-800">
                Creative Developer
              </span>
              <span className="text-xs uppercase tracking-wider font-medium text-neutral-200 bg-neutral-900/90 px-2.5 py-1 rounded border border-neutral-800">
                AI Builder
              </span>
              <span className="text-xs uppercase tracking-wider font-medium text-neutral-200 bg-neutral-900/90 px-2.5 py-1 rounded border border-neutral-800">
                Digital Creator
              </span>
            </div>

            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
              “I enjoy turning ideas into interactive digital experiences, AI-powered tools, and scalable products with meticulous design and engineering.”
            </p>
          </div>
        </div>

        {/* CARD 02: MY JOURNEY */}
        <div
          id="experience-card-02"
          className="absolute z-20 left-4 right-4 sm:right-12 lg:right-24 sm:left-auto top-1/2 -translate-y-1/2 max-w-lg pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.96)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="relative p-6 md:p-8 rounded-xl bg-neutral-950/80 border border-white/15 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden pointer-events-auto">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 text-white/50">
              <CornerBracketTL id="card2-tl" />
            </div>
            <div className="absolute top-0 right-0 text-white/50">
              <CornerBracketTR id="card2-tr" />
            </div>
            <div className="absolute bottom-0 left-0 text-white/50">
              <CornerBracketBL id="card2-bl" />
            </div>
            <div className="absolute bottom-0 right-0 text-white/50">
              <CornerBracketBR id="card2-br" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                02 // PROGRESSION
              </span>
              <Layers size={14} className="text-white/60" />
            </div>

            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
              TRAJECTORY & MILESTONES
            </span>
            <h2 className="font-orbitron text-xl md:text-2xl font-extrabold text-white tracking-wide uppercase mb-4">
              MY JOURNEY
            </h2>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {JOURNEY_MILESTONES.map((item) => (
                <div
                  key={item.number}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-white/90 bg-neutral-800 px-1.5 py-0.5 rounded shrink-0">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 03: WHAT I CODE */}
        <div
          id="experience-card-03"
          className="absolute z-20 left-4 right-4 sm:left-12 lg:left-24 sm:right-auto top-1/2 -translate-y-1/2 max-w-xl pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.96)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="relative p-6 md:p-8 rounded-xl bg-neutral-950/80 border border-white/15 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden pointer-events-auto">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 text-white/50">
              <CornerBracketTL id="card3-tl" />
            </div>
            <div className="absolute top-0 right-0 text-white/50">
              <CornerBracketTR id="card3-tr" />
            </div>
            <div className="absolute bottom-0 left-0 text-white/50">
              <CornerBracketBL id="card3-bl" />
            </div>
            <div className="absolute bottom-0 right-0 text-white/50">
              <CornerBracketBR id="card3-br" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                03 // TECHNICAL STACK
              </span>
              <Terminal size={14} className="text-white/60" />
            </div>

            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
              LANGUAGES, FRAMEWORKS & SYSTEMS
            </span>
            <h2 className="font-orbitron text-xl md:text-2xl font-extrabold text-white tracking-wide uppercase mb-4">
              WHAT I CODE
            </h2>

            <div className="space-y-3.5">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono tracking-wide transition-all ${
                          skill.level === 'primary'
                            ? 'bg-neutral-900/90 text-white border border-neutral-700 hover:border-neutral-500'
                            : 'bg-neutral-950/70 text-neutral-300 border border-neutral-800'
                        }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-neutral-400" />
                        <span>{skill.name}</span>
                        <span className="text-[9px] text-neutral-500 uppercase">[{skill.tag}]</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 04: BUILDING WITH AI */}
        <div
          id="experience-card-04"
          className="absolute z-20 left-4 right-4 sm:right-12 lg:right-24 sm:left-auto top-1/2 -translate-y-1/2 max-w-xl pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.96)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="relative p-6 md:p-8 rounded-xl bg-neutral-950/80 border border-white/15 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden pointer-events-auto">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 text-white/50">
              <CornerBracketTL id="card4-tl" />
            </div>
            <div className="absolute top-0 right-0 text-white/50">
              <CornerBracketTR id="card4-tr" />
            </div>
            <div className="absolute bottom-0 left-0 text-white/50">
              <CornerBracketBL id="card4-bl" />
            </div>
            <div className="absolute bottom-0 right-0 text-white/50">
              <CornerBracketBR id="card4-br" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                04 // CAPABILITIES
              </span>
              <Cpu size={14} className="text-white/60" />
            </div>

            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
              CREATIVE ENGINEERING & AGENTS
            </span>
            <h2 className="font-orbitron text-xl md:text-2xl font-extrabold text-white tracking-wide uppercase mb-4">
              BUILDING WITH AI
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AI_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        {pillar.title}
                      </h3>
                      <span className="text-[9px] font-mono uppercase text-neutral-400 bg-neutral-800 px-1 rounded">
                        {pillar.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-light mt-1">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 05: THE MANIFESTO */}
        <div
          id="experience-card-05"
          className="absolute z-20 inset-x-4 sm:inset-x-12 lg:inset-x-0 top-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 35px, 0) scale(0.95)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="relative max-w-2xl w-full p-8 md:p-12 rounded-2xl bg-neutral-950/85 border border-white/20 backdrop-blur-md shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-center">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 text-white/60">
              <CornerBracketTL id="card5-tl" />
            </div>
            <div className="absolute top-0 right-0 text-white/60">
              <CornerBracketTR id="card5-tr" />
            </div>
            <div className="absolute bottom-0 left-0 text-white/60">
              <CornerBracketBL id="card5-bl" />
            </div>
            <div className="absolute bottom-0 right-0 text-white/60">
              <CornerBracketBR id="card5-br" />
            </div>

            <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded bg-white/10 text-white border border-white/10 inline-block mb-4">
              05 // CREATOR PHILOSOPHY
            </span>

            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl md:text-5xl text-neutral-400 uppercase tracking-tight leading-tight">
              I DON'T JUST LEARN.
            </h2>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight mt-1 mb-4">
              I BUILD.
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-lg mx-auto leading-relaxed">
              “Every project is an experiment in craft, speed, and precision.”
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>READY FOR DEPLOYMENT</span>
              <ArrowDownRight size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ExperienceCards.displayName = 'ExperienceCards';

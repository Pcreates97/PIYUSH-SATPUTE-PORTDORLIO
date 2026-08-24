import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  JOURNEY_MILESTONES,
  SKILL_CATEGORIES,
  AI_PILLARS,
  CHAPTERS,
} from './experienceData';
import { Terminal, Cpu, Layers, Compass, ArrowDownRight } from 'lucide-react';

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
        {/* 4. FULLSCREEN OPEN TYPOGRAPHY (LEFT, RIGHT, CENTER)           */}
        {/* ------------------------------------------------------------- */}

        {/* 01: IDENTITY (Positioned on LEFT) */}
        <div
          id="experience-card-01"
          className="absolute z-20 left-6 sm:left-14 md:left-20 lg:left-28 top-1/2 -translate-y-1/2 max-w-2xl text-left pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
              01 // IDENTITY
            </span>
          </div>

          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            WHO I AM
          </span>
          <h2 className="font-orbitron text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight uppercase leading-none mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            PIYUSH
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-5 font-mono text-xs sm:text-sm tracking-wider uppercase text-neutral-300">
            <span className="text-white font-semibold">CREATIVE DEVELOPER</span>
            <span className="text-neutral-600 font-light">/</span>
            <span className="text-white font-semibold">AI BUILDER</span>
            <span className="text-neutral-600 font-light">/</span>
            <span className="text-white font-semibold">SYSTEMS ARCHITECT</span>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-neutral-200 font-light leading-relaxed max-w-lg drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
            “I turn ideas into interactive digital experiences, AI-powered tools, and scalable systems with meticulous design and engineering.”
          </p>
        </div>

        {/* 02: JOURNEY (Positioned on RIGHT) */}
        <div
          id="experience-card-02"
          className="absolute z-20 right-6 sm:right-14 md:right-20 lg:right-28 top-1/2 -translate-y-1/2 max-w-2xl text-left pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-white/80" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
              02 // PROGRESSION
            </span>
          </div>

          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            TRAJECTORY & MILESTONES
          </span>
          <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            MY JOURNEY
          </h2>

          <div className="space-y-4 max-w-lg">
            {JOURNEY_MILESTONES.map((item) => (
              <div key={item.number} className="group flex items-start gap-4">
                <span className="font-mono text-sm sm:text-base font-bold text-white tracking-widest pt-0.5 shrink-0 drop-shadow">
                  {item.number}
                </span>
                <div className="border-l border-neutral-700/80 pl-3.5">
                  <h3 className="font-mono text-xs sm:text-sm font-semibold text-white tracking-wider uppercase drop-shadow">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-light mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 03: TECH STACK (Positioned on LEFT) */}
        <div
          id="experience-card-03"
          className="absolute z-20 left-6 sm:left-14 md:left-20 lg:left-28 top-1/2 -translate-y-1/2 max-w-2xl text-left pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={14} className="text-white/80" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
              03 // TECHNICAL STACK
            </span>
          </div>

          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            LANGUAGES, FRAMEWORKS & SYSTEMS
          </span>
          <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            WHAT I CODE
          </h2>

          <div className="space-y-5 max-w-xl">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase block">
                  // {cat.category}
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <span className="text-white font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-normal">[{skill.tag}]</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 04: AI & SYSTEMS (Positioned on RIGHT) */}
        <div
          id="experience-card-04"
          className="absolute z-20 right-6 sm:right-14 md:right-20 lg:right-28 top-1/2 -translate-y-1/2 max-w-2xl text-left pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 30px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-white/80" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
              04 // CAPABILITIES
            </span>
          </div>

          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            CREATIVE ENGINEERING & AGENTS
          </span>
          <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            AI & SYSTEMS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 max-w-xl">
            {AI_PILLARS.map((pillar, idx) => (
              <div key={pillar.title} className="space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
                  <span>0{idx + 1}</span>
                  <span>/</span>
                  <span className="text-neutral-300 font-semibold">{pillar.tag}</span>
                </div>
                <h3 className="font-orbitron text-sm sm:text-base font-bold text-white tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-neutral-300 font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 05: MANIFESTO (FULLSCREEN CENTERED TYPOGRAPHY) */}
        <div
          id="experience-card-05"
          className="absolute z-20 inset-x-6 sm:inset-x-14 md:inset-x-20 top-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center justify-center"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 35px, 0) scale(0.95)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <span className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-neutral-400 block mb-3 drop-shadow">
            05 // CREATOR PHILOSOPHY
          </span>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-neutral-400 uppercase tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            I DON'T JUST LEARN.
          </h2>
          <h1 className="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase tracking-tight leading-none mt-2 mb-6 drop-shadow-[0_8px_40px_rgba(0,0,0,1)]">
            I BUILD.
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-neutral-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            “Every project is an experiment in craft, speed, and precision.”
          </p>

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-neutral-400 tracking-widest uppercase drop-shadow">
            <span>READY FOR DEPLOYMENT</span>
            <ArrowDownRight size={14} className="text-white" />
          </div>
        </div>
      </div>
    );
  }
);

ExperienceCards.displayName = 'ExperienceCards';

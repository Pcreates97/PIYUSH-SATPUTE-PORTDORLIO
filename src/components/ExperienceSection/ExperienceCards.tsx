import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  JOURNEY_MILESTONES,
  SKILL_CATEGORIES,
  AI_PILLARS,
  CHAPTERS,
} from './experienceData';
import { Terminal, Cpu, Layers, Compass, ArrowDownRight, Sparkles } from 'lucide-react';

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
    const chapterDotsRef = useRef<{ dot: HTMLSpanElement | null; label: HTMLSpanElement | null; container: HTMLDivElement | null }[]>([]);
    const lastActiveChapterRef = useRef<number>(-1);

    useImperativeHandle(ref, () => ({
      updateTelemetry: (progress: number, frameIndex: number) => {
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

        let currentChapterIdx = 0;
        for (let i = 0; i < CHAPTERS.length; i++) {
          if (progress >= CHAPTERS[i].progress[0] && progress < CHAPTERS[i].progress[1]) {
            currentChapterIdx = i;
            break;
          }
          if (progress >= CHAPTERS[i].progress[1]) {
            currentChapterIdx = i;
          }
        }

        if (currentChapterIdx !== lastActiveChapterRef.current) {
          lastActiveChapterRef.current = currentChapterIdx;
          chapterDotsRef.current.forEach((item, idx) => {
            if (!item || !item.dot || !item.label) return;
            const isActive = idx === currentChapterIdx;
            const isPassed = idx < currentChapterIdx;

            if (isActive) {
              if (item.container) item.container.style.opacity = '1';
              item.dot.style.backgroundColor = '#ffffff';
              item.dot.style.boxShadow = '0 0 10px rgba(255,255,255,0.9)';
              item.dot.style.transform = 'scale(1.3)';
              item.label.style.color = '#ffffff';
              item.label.style.fontWeight = '600';
            } else {
              if (item.container) item.container.style.opacity = isPassed ? '0.6' : '0.3';
              item.dot.style.backgroundColor = isPassed ? '#a3a3a3' : '#525252';
              item.dot.style.boxShadow = 'none';
              item.dot.style.transform = 'scale(1)';
              item.label.style.color = isPassed ? '#a3a3a3' : '#737373';
              item.label.style.fontWeight = '400';
            }
          });
        }
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
          {/* Section Label & Chapter Track */}
          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
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

            {/* Chapters Track */}
            <div
              id="hud-chapter-timeline"
              className="hidden sm:flex items-center gap-2 md:gap-3 lg:gap-4 border-l border-neutral-800/80 pl-4 md:pl-5 lg:pl-6 pointer-events-auto"
            >
              {CHAPTERS.map((ch, idx) => {
                const isInitial = idx === 0;
                return (
                  <div
                    key={ch.id}
                    ref={(el) => {
                      if (!chapterDotsRef.current[idx]) {
                        chapterDotsRef.current[idx] = { container: el, dot: null, label: null };
                      } else {
                        chapterDotsRef.current[idx].container = el;
                      }
                    }}
                    className="group flex items-center gap-1.5 cursor-default transition-all duration-300 py-1"
                    style={{
                      opacity: isInitial ? 1 : 0.3,
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        ref={(el) => {
                          if (!chapterDotsRef.current[idx]) {
                            chapterDotsRef.current[idx] = { container: null, dot: el, label: null };
                          } else {
                            chapterDotsRef.current[idx].dot = el;
                          }
                        }}
                        className="chapter-dot w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: isInitial ? '#ffffff' : '#525252',
                          boxShadow: isInitial ? '0 0 10px rgba(255,255,255,0.9)' : 'none',
                          transform: isInitial ? 'scale(1.3)' : 'scale(1)',
                        }}
                      />
                    </div>
                    <span
                      ref={(el) => {
                        if (!chapterDotsRef.current[idx]) {
                          chapterDotsRef.current[idx] = { container: null, dot: null, label: el };
                        } else {
                          chapterDotsRef.current[idx].label = el;
                        }
                      }}
                      className="chapter-label font-mono text-[10px] lg:text-[11px] tracking-wider uppercase transition-colors whitespace-nowrap"
                      style={{
                        color: isInitial ? '#ffffff' : '#737373',
                        fontWeight: isInitial ? '600' : '400',
                      }}
                    >
                      <span className="font-semibold">{ch.id}</span>
                      <span className="hidden xl:inline text-neutral-400 font-normal ml-1">
                        {ch.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Live Orbit Telemetry */}
          <div className="flex items-center gap-4 text-right">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                ORBIT ANGLE
              </span>
              <span ref={orbitDegreesRef} className="font-mono text-xs font-semibold text-white">
                000° / 360°
              </span>
            </div>
            <div className="flex flex-col items-end border-l border-neutral-800/80 pl-4">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                FRAME
              </span>
              <span className="font-mono text-xs font-semibold text-white">
                <span ref={frameNumberRef}>001</span> <span className="text-neutral-500">/ {totalFrames}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Bottom HUD Bar */}
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
            <span>SCROLL TO TRAVERSE TIMELINE</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. REFINED LIQUID GLASS PANELS (ELEGANT, HIGHLY TRANSPARENT)  */}
        {/* ------------------------------------------------------------- */}

        {/* 01: WHO I AM (Left-aligned, silky liquid glass) */}
        <div
          id="experience-card-01"
          className="absolute z-20 left-4 sm:left-8 md:left-12 lg:left-20 xl:left-24 top-1/2 -translate-y-1/2 max-w-lg text-left pointer-events-none p-6 sm:p-7 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_40px_rgba(0,0,0,0.6)] transition-all"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0px, 0) scale(1)',
            opacity: 1,
            visibility: 'visible',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400">
              01 // WHO I AM
            </span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none mb-3">
            PIYUSH
          </h2>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 font-mono text-xs tracking-wider uppercase text-neutral-300">
            <span className="text-white font-semibold">CREATIVE DEVELOPER</span>
            <span className="text-neutral-600 font-light">/</span>
            <span className="text-white font-semibold">AI BUILDER</span>
            <span className="text-neutral-600 font-light">/</span>
            <span className="text-neutral-400">DIGITAL CREATOR</span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            I craft interactive digital experiences, generative AI tools, and scalable software systems with mathematical precision and tactile polish.
          </p>
        </div>

        {/* 02: MY JOURNEY (Right-aligned, silky liquid glass) */}
        <div
          id="experience-card-02"
          className="absolute z-20 right-4 sm:right-8 md:right-12 lg:right-20 xl:right-24 top-1/2 -translate-y-1/2 max-w-lg text-left pointer-events-none p-6 sm:p-7 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_40px_rgba(0,0,0,0.6)] transition-all"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(30px, 0px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers size={13} className="text-white/80" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400">
              02 // TRAJECTORY
            </span>
          </div>

          <h2 className="font-orbitron text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none mb-4">
            MY JOURNEY
          </h2>

          <div className="space-y-3 max-h-[46vh] overflow-y-auto custom-scrollbar pr-1">
            {JOURNEY_MILESTONES.slice(0, 4).map((item) => (
              <div key={item.number} className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-white tracking-widest pt-0.5 shrink-0">
                  {item.number}
                </span>
                <div className="border-l border-white/15 pl-3">
                  <h3 className="font-mono text-xs font-semibold text-white tracking-wider uppercase">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-light mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 03: WHAT I CODE (Left-aligned, silky liquid glass) */}
        <div
          id="experience-card-03"
          className="absolute z-20 left-4 sm:left-8 md:left-12 lg:left-20 xl:left-24 top-1/2 -translate-y-1/2 max-w-lg text-left pointer-events-none p-6 sm:p-7 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_40px_rgba(0,0,0,0.6)] transition-all"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(-30px, 0px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={13} className="text-white/80" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400">
              03 // TECHNICAL STACK
            </span>
          </div>

          <h2 className="font-orbitron text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none mb-4">
            WHAT I CODE
          </h2>

          <div className="space-y-4 max-h-[46vh] overflow-y-auto custom-scrollbar pr-1">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block">
                  // {cat.category}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <span className="text-white font-medium tracking-wide">
                        {skill.name}
                      </span>
                      <span className="text-[9px] text-neutral-500">[{skill.tag}]</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 04: BUILDING WITH AI (Right-aligned, silky liquid glass) */}
        <div
          id="experience-card-04"
          className="absolute z-20 right-4 sm:right-8 md:right-12 lg:right-20 xl:right-24 top-1/2 -translate-y-1/2 max-w-lg text-left pointer-events-none p-6 sm:p-7 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_40px_rgba(0,0,0,0.6)] transition-all"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(30px, 0px, 0) scale(0.98)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={13} className="text-white/80" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400">
              04 // CAPABILITIES
            </span>
          </div>

          <h2 className="font-orbitron text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none mb-4">
            BUILDING WITH AI
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[46vh] overflow-y-auto custom-scrollbar pr-1">
            {AI_PILLARS.slice(0, 4).map((pillar, idx) => (
              <div key={pillar.title} className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-400 tracking-widest uppercase">
                  <span>0{idx + 1}</span>
                  <span>/</span>
                  <span className="text-neutral-300 font-semibold">{pillar.tag}</span>
                </div>
                <h3 className="font-orbitron text-xs font-bold text-white uppercase">
                  {pillar.title}
                </h3>
                <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 05: MANIFESTO (Centered, confident statement) */}
        <div
          id="experience-card-05"
          className="absolute z-20 inset-x-6 sm:inset-x-12 md:inset-x-20 top-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_60px_rgba(0,0,0,0.8)]"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 35px, 0) scale(0.95)',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-400 block mb-3">
            05 // CREATOR PHILOSOPHY
          </span>

          <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl md:text-6xl text-neutral-400 uppercase tracking-tight leading-none">
            I DON'T JUST LEARN.
          </h2>
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-8xl text-white uppercase tracking-tight leading-none mt-2 mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            I BUILD.
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
            Every idea is an opportunity to experiment, iterate, and deliver software that matters.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-neutral-400 tracking-widest uppercase">
            <span>TRANSITIONING TO AI ECOSYSTEM</span>
            <ArrowDownRight size={14} className="text-white animate-bounce" />
          </div>
        </div>
      </div>
    );
  }
);

ExperienceCards.displayName = 'ExperienceCards';

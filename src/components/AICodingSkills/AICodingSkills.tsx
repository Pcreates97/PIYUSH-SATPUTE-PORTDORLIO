import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHARACTER_IMAGE, SKILL_ITEMS } from './skillData';
import { SkillOrbit } from './SkillOrbit';

gsap.registerPlugin(ScrollTrigger);

export const AICodingSkills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const introTitleRef = useRef<HTMLDivElement | null>(null);
  const outroTitleRef = useRef<HTMLDivElement | null>(null);
  const hudTopRef = useRef<HTMLDivElement | null>(null);
  const hudBottomRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    // Check for user's reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    if (prefersReducedMotion) {
      if (characterRef.current) characterRef.current.style.opacity = '1';
      if (introTitleRef.current) introTitleRef.current.style.opacity = '1';
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      scrub: 0.35,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        // Calculate count of currently visible orbiting assets
        let visibleCount = 0;
        SKILL_ITEMS.forEach((item) => {
          if (progress >= item.startOffset && progress <= item.endOffset) {
            visibleCount++;
          }
        });
        setActiveCount(visibleCount);

        // 1. Character Opacity Curve:
        // Always clearly visible across the entire section (0.9 to 1.0)
        if (characterRef.current) {
          let charOpacity = 1;
          if (progress > 0.92) {
            charOpacity = Math.max(0.3, 1 - (progress - 0.92) * 5);
          }
          characterRef.current.style.opacity = charOpacity.toFixed(3);
        }

        // 2. Main Intro Title (AI CODING SKILLS):
        // 0.00 -> 0.15 : Fully visible (1)
        // 0.15 -> 0.30 : Fades down to subtle watermark (0.08)
        // 0.30 -> 0.84 : Watermark (0.08)
        // > 0.84       : 0 (outro takes over)
        if (introTitleRef.current) {
          let titleOpacity = 1;
          if (progress <= 0.15) {
            titleOpacity = 1;
          } else if (progress <= 0.30) {
            const fade = (progress - 0.15) / 0.15;
            titleOpacity = 1 - fade * 0.92;
          } else if (progress <= 0.84) {
            titleOpacity = 0.08;
          } else {
            titleOpacity = Math.max(0, 0.08 - (progress - 0.84) * 0.5);
          }
          introTitleRef.current.style.opacity = titleOpacity.toFixed(3);
        }

        // 3. Outro Title (BUILDING WITH AI.):
        // 0.86 -> 0.94 : Fade In (0 -> 1)
        // 0.94 -> 1.00 : Fully visible
        if (outroTitleRef.current) {
          let outroOpacity = 0;
          if (progress > 0.86) {
            outroOpacity = Math.min(1, (progress - 0.86) / 0.08);
          }
          outroTitleRef.current.style.opacity = outroOpacity.toFixed(3);
        }

        // 4. HUD Top & Bottom Bars
        if (hudTopRef.current) {
          hudTopRef.current.style.opacity = '1';
        }
        if (hudBottomRef.current) {
          hudBottomRef.current.style.opacity = '1';
        }
      },
    });

    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(refreshTimeout);
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="section-ai-coding-skills"
      ref={sectionRef}
      className="relative w-full bg-black text-white selection:bg-white selection:text-black"
      style={{
        height: '700vh',
      }}
      aria-label="Section 3: AI Coding Skills & Orbital Ecosystem"
    >
      {/* Sticky Pinned Stage 100vw x 100vh */}
      <div
        id="skills-sticky-stage"
        ref={stageRef}
        className="w-full h-screen overflow-hidden z-10 flex items-center justify-center bg-black relative select-none"
      >
        {/* Extremely Subtle Atmospheric Vignette (Pure Black Foundation) */}
        <div
          id="skills-ambient-vignette"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(18,18,18,0.5)_0%,rgba(0,0,0,1)_80%)]"
        />

        {/* 1. Large Editorial Background Title (AI CODING SKILLS) */}
        <div
          id="skills-intro-typography"
          ref={introTitleRef}
          className="absolute inset-0 z-5 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 text-center px-4"
          style={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-3 text-neutral-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>03 // AI CODING SKILLS</span>
          </div>

          <h2 className="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tighter uppercase leading-[0.9]">
            AI <br />
            CODING <br />
            SKILLS
          </h2>
        </div>

        {/* 2. Central Hero Character — Stationary & Sharp at Center */}
        <div
          id="ai-coder-character-stage"
          className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none"
        >
          <img
            id="ai-coder-character-image"
            ref={characterRef}
            src={CHARACTER_IMAGE}
            alt="Futuristic AI Coder Character"
            className="h-[68vh] sm:h-[75vh] md:h-[82vh] max-h-[900px] w-auto object-contain select-none pointer-events-none transition-opacity duration-300 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            style={{
              opacity: 1,
              willChange: 'opacity',
            }}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* 3. Orbital Inverted-U Technology Stream System */}
        <SkillOrbit scrollProgress={scrollProgress} />

        {/* 4. Outro Typography (BUILDING WITH AI.) at 90-100% scroll */}
        <div
          id="skills-outro-typography"
          ref={outroTitleRef}
          className="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-none text-center px-4"
          style={{ opacity: 0 }}
        >
          <div className="text-neutral-500 font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-2">
            ECOSYSTEM MASTERED
          </div>
          <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-none">
            BUILDING WITH AI.
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-mono text-neutral-400 max-w-md tracking-wider uppercase">
            Architecting next-generation autonomous workflows & scalable software.
          </p>
        </div>

        {/* 5. Minimalist Top HUD Bar */}
        <div
          id="skills-hud-top-bar"
          ref={hudTopRef}
          className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between pointer-events-none"
          style={{
            paddingInline: 'var(--pad-x, 2rem)',
            paddingTop: 'var(--header-pt, 1.75rem)',
            opacity: 1,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-xs bg-white" />
            <div className="flex flex-col">
              <span className="font-orbitron text-xs md:text-sm tracking-[0.25em] font-bold text-white uppercase">
                03 // AI CODING SKILLS
              </span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                INVERTED ORBITAL ARCH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-neutral-950/70 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-neutral-300 tracking-wider">
                {activeCount > 0 ? `${activeCount} ACTIVE IN ORBIT` : 'STREAM READY'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 tracking-widest border border-white/10 px-2.5 py-1 rounded bg-black/60">
              STACK / {SKILL_ITEMS.length}
            </div>
          </div>
        </div>

        {/* 6. Minimalist Bottom HUD Bar & Orbit Telemetry */}
        <div
          id="skills-hud-bottom-bar"
          ref={hudBottomRef}
          className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between pointer-events-none pb-6"
          style={{
            paddingInline: 'var(--pad-x, 2rem)',
            opacity: 0,
          }}
        >
          <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>ORBITAL TRAJECTORY: LEFT → TOP → RIGHT</span>
          </div>

          {/* Scrubbed Timeline Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-24 sm:w-36 h-1 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width: `${Math.round(scrollProgress * 100)}%`,
                }}
              />
            </div>
            <span className="font-mono text-[11px] text-neutral-400 tabular-nums">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

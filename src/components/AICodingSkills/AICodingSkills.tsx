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
  const frontTitleRef = useRef<HTMLDivElement | null>(null);
  const backTitleRef = useRef<HTMLDivElement | null>(null);
  const outroTitleRef = useRef<HTMLDivElement | null>(null);
  const hudTopRef = useRef<HTMLDivElement | null>(null);
  const hudBottomRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    // Check for user's reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    if (prefersReducedMotion) {
      if (characterRef.current) characterRef.current.style.opacity = '1';
      if (frontTitleRef.current) frontTitleRef.current.style.opacity = '1';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin: stage,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // 1. Foreground Title (starts in FRONT at z-20):
      // Smoothly sinks back in 3D perspective and fades out (0.00 -> 0.20)
      tl.fromTo(
        frontTitleRef.current,
        { opacity: 1, scale: 1, y: 0 },
        {
          opacity: 0,
          scale: 0.94,
          y: -10,
          ease: 'power1.inOut',
          duration: 0.20,
        },
        0
      );

      // 2. Background Watermark Title (sits BEHIND character at z-5):
      // Emerges at (0.04 -> 0.20) and stays as a subtle watermark until 0.78
      tl.fromTo(
        backTitleRef.current,
        { opacity: 0, scale: 0.98 },
        {
          opacity: 0.08,
          scale: 0.94,
          ease: 'power1.inOut',
          duration: 0.16,
        },
        0.04
      ).to(
        backTitleRef.current,
        {
          opacity: 0,
          ease: 'power1.in',
          duration: 0.08,
        },
        0.78
      );

      // 3. Central Character subtle scale/depth stability
      tl.fromTo(
        characterRef.current,
        { opacity: 1, scale: 1 },
        { opacity: 1, scale: 1, duration: 0.82 },
        0
      ).to(
        characterRef.current,
        { opacity: 0.35, scale: 0.98, ease: 'power2.in', duration: 0.16 },
        0.82
      );

      // 4. Outro Title (BUILDING WITH AI.) at 80% -> 100%
      tl.fromTo(
        outroTitleRef.current,
        { opacity: 0, scale: 0.95, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
          duration: 0.18,
        },
        0.82
      );
    }, section);

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-ai-coding-skills"
      ref={sectionRef}
      className="relative w-full bg-black text-white selection:bg-white selection:text-black"
      style={{
        height: '220vh',
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

        {/* 1A. Background Watermark Title — Positioned BEHIND the character (z-5) */}
        <div
          id="skills-back-typography"
          ref={backTitleRef}
          className="absolute inset-0 z-5 flex flex-col items-center justify-center pointer-events-none text-center px-4 will-change-[opacity,transform]"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3 text-neutral-400 font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>03 // AI CODING SKILLS</span>
          </div>

          <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter uppercase leading-[0.9]">
            AI <br />
            CODING <br />
            SKILLS
          </h2>
        </div>

        {/* 2. Central Hero Character — Stationary & Sharp at Center (z-10) */}
        <div
          id="ai-coder-character-stage"
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <img
            id="ai-coder-character-image"
            ref={characterRef}
            src={CHARACTER_IMAGE}
            alt=""
            className="h-[52vh] sm:h-[66vh] md:h-[78vh] lg:h-[82vh] max-h-[900px] w-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] will-change-[opacity,transform]"
            style={{
              opacity: 1,
            }}
            loading="eager"
            decoding="async"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>

        {/* 1B. Foreground Title — Positioned IN FRONT of the character (z-20) at starting */}
        <div
          id="skills-front-typography"
          ref={frontTitleRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-4 will-change-[opacity,transform]"
          style={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3 text-neutral-400 font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>03 // AI CODING SKILLS</span>
          </div>

          <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter uppercase leading-[0.9] drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]">
            AI <br />
            CODING <br />
            SKILLS
          </h2>
        </div>

        {/* 3. Orbital Inverted-U Technology Stream System (Continuous Left-to-Right Loop) */}
        <SkillOrbit speed={0.038} />

        {/* 4. Outro Typography (BUILDING WITH AI.) at 90-100% scroll */}
        <div
          id="skills-outro-typography"
          ref={outroTitleRef}
          className="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-none text-center px-4 will-change-[opacity,transform]"
          style={{ opacity: 0 }}
        >
          <div className="text-neutral-500 font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-2">
            ECOSYSTEM MASTERED
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-none">
            BUILDING WITH AI.
          </h2>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-sm font-mono text-neutral-400 max-w-md tracking-wider uppercase">
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
                CONTINUOUS STREAM
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
            opacity: 1,
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

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlowingParticles from '../originkit/ui/glowing-particles';
import { PROGRAMMING_LANGUAGES, ProgrammingLanguage } from './languageData';
import { LanguageCard } from './LanguageCard';
import { ConnectionLines, CardCoord } from './ConnectionLines';
import { Terminal, Cpu, Layers, Sparkles, CheckCircle2, ChevronRight, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['ALL', 'Systems', 'AI & Data', 'Web & Fullstack', 'Backend & Cloud'] as const;

export const LanguageSkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeLangId, setActiveLangId] = useState<string>('typescript');
  const [hoveredLangId, setHoveredLangId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const cardElementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });
  const [cardCoords, setCardCoords] = useState<Record<string, CardCoord>>({});
  const [centerCoord, setCenterCoord] = useState<{ x: number; y: number } | null>(null);

  // Active language object
  const activeLanguage = useMemo(() => {
    const targetId = hoveredLangId || activeLangId;
    return PROGRAMMING_LANGUAGES.find((l) => l.id === targetId) || PROGRAMMING_LANGUAGES[0];
  }, [activeLangId, hoveredLangId]);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    if (selectedCategory === 'ALL') return PROGRAMMING_LANGUAGES;
    return PROGRAMMING_LANGUAGES.filter((l) => l.category === selectedCategory);
  }, [selectedCategory]);

  // Split into left and right wings
  const leftWingLanguages = useMemo(() => {
    return PROGRAMMING_LANGUAGES.filter((l) => l.side === 'left');
  }, []);

  const rightWingLanguages = useMemo(() => {
    return PROGRAMMING_LANGUAGES.filter((l) => l.side === 'right');
  }, []);

  // Update dynamic SVG connection coordinates
  const updateCoordinates = useCallback(() => {
    const container = containerRef.current;
    const sphere = sphereRef.current;
    if (!container || !sphere) return;

    const containerRect = container.getBoundingClientRect();
    const sphereRect = sphere.getBoundingClientRect();

    setDimensions({
      width: containerRect.width,
      height: containerRect.height,
    });

    // Center of Glowing Particle Sphere
    const centerX = sphereRect.left - containerRect.left + sphereRect.width / 2;
    const centerY = sphereRect.top - containerRect.top + sphereRect.height / 2;
    setCenterCoord({ x: centerX, y: centerY });

    // Calculate anchor coordinate for each card
    const newCoords: Record<string, CardCoord> = {};

    PROGRAMMING_LANGUAGES.forEach((lang) => {
      const cardEl = cardElementRefs.current[lang.id];
      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect();
        // Left side cards connect on their right edge; Right side cards connect on their left edge
        const anchorX =
          lang.side === 'left'
            ? cardRect.right - containerRect.left
            : cardRect.left - containerRect.left;
        const anchorY = cardRect.top - containerRect.top + cardRect.height / 2;

        newCoords[lang.id] = {
          id: lang.id,
          x: anchorX,
          y: anchorY,
        };
      }
    });

    setCardCoords(newCoords);
  }, []);

  useEffect(() => {
    updateCoordinates();

    const ro = new ResizeObserver(() => {
      updateCoordinates();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateCoordinates);
    const timer = setTimeout(updateCoordinates, 300);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer);
    };
  }, [updateCoordinates, selectedCategory]);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header & Badges Entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Metrics & Category Bar Entrance
      if (metricsRef.current) {
        gsap.fromTo(
          metricsRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: metricsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: tabsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Central Quantum Sphere Stagger / Scale
      if (sphereRef.current) {
        gsap.fromTo(
          sphereRef.current,
          { scale: 0.75, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sphereRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. Left Wing Cards Scroll In with 3D Angle
      const leftCards = leftWingLanguages
        .map((l) => cardElementRefs.current[l.id])
        .filter(Boolean);

      if (leftCards.length > 0) {
        gsap.fromTo(
          leftCards,
          { opacity: 0, x: -70, rotateY: 15, scale: 0.92 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 5. Right Wing Cards Scroll In with 3D Angle
      const rightCards = rightWingLanguages
        .map((l) => cardElementRefs.current[l.id])
        .filter(Boolean);

      if (rightCards.length > 0) {
        gsap.fromTo(
          rightCards,
          { opacity: 0, x: 70, rotateY: -15, scale: 0.92 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 6. Architectural HUD Entrance at Bottom
      if (hudRef.current) {
        gsap.fromTo(
          hudRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: hudRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [leftWingLanguages, rightWingLanguages]);

  return (
    <section
      ref={sectionRef}
      id="section-language-skills"
      className="relative w-full min-h-screen bg-black text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-12 border-t border-neutral-900 overflow-hidden select-none"
      aria-label="Section 4: Programming Language Mastery"
      style={{ backgroundColor: '#000000' }}
    >
      {/* 1. Background Monochromatic Ambient Grid (Strictly Pure Black & White Grayscale) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.03)_0%,rgba(0,0,0,1)_75%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-[1520px] mx-auto flex flex-col items-center">
        {/* 2. Section Header & Metrics */}
        <div ref={headerRef} className="w-full flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/90 backdrop-blur-md mb-4 text-xs font-mono tracking-widest text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>04 // LANGUAGE MASTERY & SYNAPSE CORE</span>
          </div>

          <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none max-w-4xl">
            CODING LANGUAGES <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              & SYSTEM SYNTAX
            </span>
          </h2>

          <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Multi-paradigm fluency across systems engineering, distributed backends, AI pipelines,
            and high-performance interfaces. Connected to the central execution core.
          </p>

          {/* Quick Metrics Bar (Monochromatic Black & White) */}
          <div ref={metricsRef} className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-xs text-neutral-300">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950/90 shadow-md">
              <Terminal size={14} className="text-white" />
              <span className="text-white font-bold">{PROGRAMMING_LANGUAGES.length} LANGUAGES</span>
              <span className="text-neutral-500">LEARNED</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950/90 shadow-md">
              <Layers size={14} className="text-white" />
              <span>4 PARADIGMS</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950/90 shadow-md">
              <Cpu size={14} className="text-white" />
              <span>130+ REPOSITORIES</span>
            </div>
          </div>

          {/* Category Filter Tabs (Black & White) */}
          <div ref={tabsRef} className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-[0_0_18px_rgba(255,255,255,0.4)]'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Main Open Interactive Stage (Sphere in Center with Cards and Connecting Lines) */}
        <div
          ref={containerRef}
          className="relative w-full min-h-[620px] lg:min-h-[700px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 py-4"
        >
          {/* Dynamic Laser Connecting Lines (Desktop / Large View) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <ConnectionLines
              cardCoords={cardCoords}
              centerCoord={centerCoord}
              languages={PROGRAMMING_LANGUAGES}
              activeId={activeLangId}
              hoveredId={hoveredLangId}
              containerWidth={dimensions.width}
              containerHeight={dimensions.height}
            />
          </div>

          {/* Left Wing Language Cards */}
          <div className="w-full lg:w-[340px] xl:w-[360px] grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-3.5 z-20">
            {leftWingLanguages.map((lang) => {
              const isFilteredOut =
                selectedCategory !== 'ALL' && lang.category !== selectedCategory;
              return (
                <div
                  key={lang.id}
                  ref={(el) => {
                    cardElementRefs.current[lang.id] = el;
                  }}
                  className={`transition-opacity duration-300 ${
                    isFilteredOut ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  <LanguageCard
                    language={lang}
                    isSelected={activeLangId === lang.id}
                    isHovered={hoveredLangId === lang.id}
                    onSelect={() => {
                      setActiveLangId(lang.id);
                      updateCoordinates();
                    }}
                    onHover={(hovered) => setHoveredLangId(hovered ? lang.id : null)}
                  />
                </div>
              );
            })}
          </div>

          {/* Central Glowing Particles Sphere Container (White Quantum Core) */}
          <div
            ref={sphereRef}
            className="relative flex-1 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[520px] w-full max-w-[540px] z-20 my-2 lg:my-0"
          >
            {/* Concentric Ambient Coordinate Rings (Monochromatic) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full border border-white/10 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full border border-dashed border-white/20 animate-[spin_40s_linear_infinite_reverse]" />
            </div>

            {/* Glowing Particles Component (Black & White Monochromatic Light Stream) */}
            <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[480px] flex items-center justify-center">
              <GlowingParticles
                color="#FFFFFF"
                hot="#FFFFFF"
                density={18}
                streak={10}
                speed={16}
                size={5}
                bloom={18}
                rim={18}
                haze={18}
                spin={20}
                direction="right"
                sizePercent={92}
              />

              {/* Sphere Core Focal Overlay Pill (Monochromatic Black & White) */}
              <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-neutral-700 bg-black/90 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-neutral-300 pointer-events-none shadow-xl whitespace-nowrap">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-ping" />
                <span className="font-bold tracking-wider uppercase text-white">
                  {activeLanguage.name} CORE
                </span>
                <span className="text-neutral-500">//</span>
                <span className="text-neutral-300 font-bold">{activeLanguage.proficiency}% FLUENCY</span>
              </div>
            </div>
          </div>

          {/* Right Wing Language Cards */}
          <div className="w-full lg:w-[340px] xl:w-[360px] grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-3.5 z-20">
            {rightWingLanguages.map((lang) => {
              const isFilteredOut =
                selectedCategory !== 'ALL' && lang.category !== selectedCategory;
              return (
                <div
                  key={lang.id}
                  ref={(el) => {
                    cardElementRefs.current[lang.id] = el;
                  }}
                  className={`transition-opacity duration-300 ${
                    isFilteredOut ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  <LanguageCard
                    language={lang}
                    isSelected={activeLangId === lang.id}
                    isHovered={hoveredLangId === lang.id}
                    onSelect={() => {
                      setActiveLangId(lang.id);
                      updateCoordinates();
                    }}
                    onHover={(hovered) => setHoveredLangId(hovered ? lang.id : null)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Active Language Architectural Deep-Dive HUD (Full Black & White) */}
        <div
          ref={hudRef}
          className="w-full mt-8 border-t border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md py-6 px-4 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl rounded-2xl"
        >
          <div className="flex items-center gap-4">
            {/* Language Icon / Logo (Original icon untouched as requested) */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shrink-0 border border-white/20 bg-black shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <img
                src={activeLanguage.icon}
                alt={activeLanguage.name}
                className="w-full h-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white">
                  {activeLanguage.name}
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">
                  {activeLanguage.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl font-light">
                {activeLanguage.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-start">
            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Experience</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {activeLanguage.experience}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Proficiency</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {activeLanguage.proficiency}%
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Projects</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {activeLanguage.projectsCount}+ Built
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LanguageSkillsSection;


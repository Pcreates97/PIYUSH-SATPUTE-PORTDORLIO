import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import GlowingParticles from '../originkit/ui/glowing-particles';
import { PROGRAMMING_LANGUAGES, ProgrammingLanguage } from './languageData';
import { LanguageCard } from './LanguageCard';
import { ConnectionLines, CardCoord } from './ConnectionLines';
import { Terminal, Cpu, Layers, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const CATEGORIES = ['ALL', 'Systems', 'AI & Data', 'Web & Fullstack', 'Backend & Cloud'] as const;

export const LanguageSkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeLangId, setActiveLangId] = useState<string>('typescript');
  const [hoveredLangId, setHoveredLangId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <section
      id="section-language-skills"
      className="relative w-full min-h-screen bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 overflow-hidden select-none"
      aria-label="Section 4: Programming Language Mastery"
    >
      {/* 1. Background Ambient Radial Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.15)_0%,rgba(0,0,0,0.95)_70%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* 2. Section Header & Metrics */}
        <div className="w-full flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-md mb-4 text-xs font-mono tracking-widest text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>04 // LANGUAGE MASTERY & SYNAPSE CORE</span>
          </div>

          <h2 className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none max-w-4xl">
            CODING LANGUAGES <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              & SYSTEM SYNTAX
            </span>
          </h2>

          <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Multi-paradigm fluency across systems engineering, distributed backends, AI pipelines,
            and high-performance interfaces. Connected to the central execution core.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-xs text-neutral-400">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-neutral-900/60">
              <Terminal size={14} className="text-cyan-400" />
              <span className="text-white font-bold">{PROGRAMMING_LANGUAGES.length} LANGUAGES</span>
              <span className="text-neutral-500">LEARNED</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-neutral-900/60">
              <Layers size={14} className="text-blue-400" />
              <span>4 PARADIGMS</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-neutral-900/60">
              <Cpu size={14} className="text-emerald-400" />
              <span>130+ REPOSITORIES</span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Main Interactive Stage (Sphere in Center with Cards and Connecting Lines) */}
        <div
          ref={containerRef}
          className="relative w-full min-h-[640px] lg:min-h-[720px] rounded-2xl border border-white/10 bg-neutral-950/50 backdrop-blur-xl p-4 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden"
        >
          {/* Dynamic Laser Connecting Lines (Desktop / Large View) */}
          <div className="hidden lg:block absolute inset-0">
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
          <div className="w-full lg:w-[320px] flex flex-col gap-3.5 z-20">
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

          {/* Central Glowing Particles Sphere Container */}
          <div
            ref={sphereRef}
            className="relative flex-1 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] w-full max-w-[480px] z-20"
          >
            {/* Concentric Ambient Coordinate Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full border border-dashed border-cyan-500/15 animate-[spin_40s_linear_infinite_reverse]" />
            </div>

            {/* Glowing Particles Component */}
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] flex items-center justify-center">
              <GlowingParticles
                color={activeLanguage.color}
                hot="#FFFFFF"
                density={18}
                streak={10}
                speed={16}
                size={5}
                bloom={16}
                rim={18}
                haze={18}
                spin={20}
                direction="right"
                sizePercent={92}
              />

              {/* Sphere Core Focal Overlay Pill */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-black/80 backdrop-blur-md text-[11px] font-mono text-neutral-300 pointer-events-none">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: activeLanguage.color }}
                />
                <span className="font-bold tracking-wider uppercase text-white">
                  {activeLanguage.name} CORE
                </span>
                <span className="text-neutral-500">//</span>
                <span className="text-neutral-400">{activeLanguage.proficiency}% FLUENCY</span>
              </div>
            </div>
          </div>

          {/* Right Wing Language Cards */}
          <div className="w-full lg:w-[320px] flex flex-col gap-3.5 z-20">
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

        {/* 4. Active Language Architectural Deep-Dive HUD */}
        <div className="w-full mt-6 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shrink-0 border"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: activeLanguage.color,
                boxShadow: `0 0 20px ${activeLanguage.glowColor}`,
              }}
            >
              <img
                src={activeLanguage.icon}
                alt={activeLanguage.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white">
                  {activeLanguage.name}
                </h3>
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
                  style={{
                    borderColor: activeLanguage.color,
                    color: '#ffffff',
                    backgroundColor: activeLanguage.glowColor,
                  }}
                >
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
              <div
                className="text-sm font-mono font-bold mt-0.5"
                style={{ color: activeLanguage.color }}
              >
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

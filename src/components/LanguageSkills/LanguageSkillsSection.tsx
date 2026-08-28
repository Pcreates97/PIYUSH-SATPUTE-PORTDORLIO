import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlowingParticles from '../originkit/ui/glowing-particles';
import { PROGRAMMING_LANGUAGES } from './languageData';
import { LanguageCard } from './LanguageCard';
import { ConnectionLines, CardCoord } from './ConnectionLines';

gsap.registerPlugin(ScrollTrigger);

export const LanguageSkillsSection: React.FC = () => {
  const [activeLangId, setActiveLangId] = useState<string>('typescript');
  const [hoveredLangId, setHoveredLangId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const climaxRef = useRef<HTMLDivElement | null>(null);
  const cardElementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 700,
  });
  const [cardCoords, setCardCoords] = useState<Record<string, CardCoord>>({});
  const [centerCoord, setCenterCoord] = useState<{ x: number; y: number } | null>(null);

  const leftWingLanguages = PROGRAMMING_LANGUAGES.filter((l) => l.side === 'left');
  const rightWingLanguages = PROGRAMMING_LANGUAGES.filter((l) => l.side === 'right');

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

    const centerX = sphereRect.left - containerRect.left + sphereRect.width / 2;
    const centerY = sphereRect.top - containerRect.top + sphereRect.height / 2;
    setCenterCoord({ x: centerX, y: centerY });

    const newCoords: Record<string, CardCoord> = {};

    PROGRAMMING_LANGUAGES.forEach((lang) => {
      const cardEl = cardElementRefs.current[lang.id];
      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect();
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
  }, [updateCoordinates]);

  // GSAP Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Central Core Sphere Scale-In
      if (sphereRef.current) {
        gsap.fromTo(
          sphereRef.current,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sphereRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Climax outro (LEARN. BUILD. REPEAT.)
      if (climaxRef.current) {
        gsap.fromTo(
          climaxRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: climaxRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="section-languages"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white py-24 sm:py-32 px-6 sm:px-12 lg:px-16 overflow-hidden select-none border-t border-neutral-900"
      aria-label="Section 4: Language System"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Top Editorial Header */}
      <div ref={headerRef} className="max-w-7xl mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>04 // LANGUAGE SYSTEM</span>
        </div>

        <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-tight max-w-3xl mx-auto">
          THE LANGUAGES <br />
          <span className="text-neutral-400">BEHIND THE WORK.</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
          Polyglot foundational systems connecting type safety, high-throughput compute, and expressive user interfaces.
        </p>
      </div>

      {/* Main Digital Knowledge Core & Constellation */}
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto relative min-h-[560px] sm:min-h-[640px] flex items-center justify-center"
      >
        {/* Dynamic Curved Laser Traces */}
        <ConnectionLines
          cardCoords={cardCoords}
          centerCoord={centerCoord}
          languages={PROGRAMMING_LANGUAGES}
          activeId={activeLangId}
          hoveredId={hoveredLangId}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />

        {/* Central Glowing Digital Knowledge Core Sphere */}
        <div
          ref={sphereRef}
          className="relative z-20 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* OriginKit Glowing Particles Particle Core Sphere */}
            <GlowingParticles
              color="#FFFFFF"
              hot="#FFFFFF"
              density={16}
              streak={8}
              speed={14}
              size={4}
              bloom={8}
              rim={16}
              haze={14}
              spin={12}
              direction="right"
              sizePercent={90}
            />

            {/* Core Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                CORE MATRIX
              </span>
              <span className="font-orbitron font-bold text-xs sm:text-sm text-white tracking-widest uppercase mt-0.5">
                KNOWLEDGE
              </span>
            </div>
          </div>
        </div>

        {/* Left Wing Languages */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around py-4 z-20 max-w-[200px] sm:max-w-[240px]">
          {leftWingLanguages.map((lang) => (
            <div
              key={lang.id}
              ref={(el) => {
                cardElementRefs.current[lang.id] = el;
              }}
            >
              <LanguageCard
                language={lang}
                isSelected={activeLangId === lang.id}
                isHovered={hoveredLangId === lang.id}
                onSelect={() => setActiveLangId(lang.id)}
                onHover={(h) => setHoveredLangId(h ? lang.id : null)}
              />
            </div>
          ))}
        </div>

        {/* Right Wing Languages */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around py-4 z-20 max-w-[200px] sm:max-w-[240px]">
          {rightWingLanguages.map((lang) => (
            <div
              key={lang.id}
              ref={(el) => {
                cardElementRefs.current[lang.id] = el;
              }}
            >
              <LanguageCard
                language={lang}
                isSelected={activeLangId === lang.id}
                isHovered={hoveredLangId === lang.id}
                onSelect={() => setActiveLangId(lang.id)}
                onHover={(h) => setHoveredLangId(h ? lang.id : null)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section Climax Outro */}
      <div ref={climaxRef} className="max-w-4xl mx-auto mt-20 sm:mt-24 text-center">
        <h3 className="font-orbitron font-black text-2xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-none mb-3">
          LEARN. BUILD. REPEAT.
        </h3>
        <p className="font-mono text-xs sm:text-sm text-neutral-400 uppercase tracking-widest max-w-lg mx-auto">
          Continuous evolution through systems engineering, machine learning pipelines, and creative development.
        </p>
      </div>
    </section>
  );
};

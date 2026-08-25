import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlowingParticles from '../originkit/ui/glowing-particles';
import { CINEMATIC_LANGUAGES } from './languageData';

gsap.registerPlugin(ScrollTrigger);

export const LanguageSkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cameraRigRef = useRef<HTMLDivElement | null>(null);
  const sphereContainerRef = useRef<HTMLDivElement | null>(null);
  const introBlockRef = useRef<HTMLDivElement | null>(null);
  const outroBlockRef = useRef<HTMLDivElement | null>(null);
  const svgConstellationRef = useRef<SVGSVGElement | null>(null);

  // Language DOM element refs
  const langItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const langLogoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pathRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const cameraRig = cameraRigRef.current;
    const sphere = sphereContainerRef.current;
    const intro = introBlockRef.current;
    const outro = outroBlockRef.current;

    if (!section || !stage || !cameraRig || !sphere || !intro || !outro) return;

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Show static elegant layout for reduced motion
      gsap.set(intro, { opacity: 1 });
      gsap.set(sphere, { opacity: 1, scale: 1 });
      Object.values(langItemRefs.current).forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Master ScrollTrigger Timeline: 600vh of scrub-controlled spatial choreography
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin: stage,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Initial Scene State (Deep Space)
      gsap.set(cameraRig, {
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
      });

      gsap.set(sphere, {
        opacity: 0,
        scale: 0.3,
        z: -200,
      });

      gsap.set(outro, {
        opacity: 0,
        scale: 0.9,
        y: 60,
        filter: 'blur(10px)',
      });

      // Initialize all language items into deep space
      CINEMATIC_LANGUAGES.forEach((lang) => {
        const itemEl = langItemRefs.current[lang.id];
        const logoEl = langLogoRefs.current[lang.id];
        const pathEl = pathRefs.current[lang.id];

        if (itemEl) {
          gsap.set(itemEl, {
            opacity: 0,
            scale: 0.7,
            filter: 'blur(14px)',
            transformStyle: 'preserve-3d',
          });
        }
        if (logoEl) {
          gsap.set(logoEl, {
            opacity: 0,
            scale: 0.6,
            filter: 'blur(10px)',
            transformStyle: 'preserve-3d',
          });
        }
        if (pathEl) {
          const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 600;
          gsap.set(pathEl, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0,
          });
        }
      });

      // =========================================================================
      // ACT 1: Prologue & Editorial Statement (0.00 -> 0.16)
      // =========================================================================
      // Intro enters sharp, then sinks into the deep void as user begins scrolling
      tl.fromTo(
        intro,
        { opacity: 1, scale: 1, z: 0, filter: 'blur(0px)' },
        {
          opacity: 0,
          scale: 0.8,
          z: -350,
          y: -40,
          filter: 'blur(14px)',
          duration: 0.16,
          ease: 'power2.inOut',
        },
        0.02
      );

      // =========================================================================
      // ACT 2: Digital Sphere Core Awakens & Camera Approaches (0.12 -> 0.28)
      // =========================================================================
      tl.to(
        sphere,
        {
          opacity: 1,
          scale: 1,
          z: 0,
          duration: 0.16,
          ease: 'power2.out',
        },
        0.12
      );

      // Camera gently pushes in toward the awakening core
      tl.to(
        cameraRig,
        {
          translateZ: 140,
          rotateX: 2,
          duration: 0.20,
          ease: 'power1.inOut',
        },
        0.14
      );

      // =========================================================================
      // ACT 3: First Language — JAVASCRIPT Emerges from Left Depth (0.26 -> 0.44)
      // =========================================================================
      const jsItem = langItemRefs.current['javascript'];
      const jsLogo = langLogoRefs.current['javascript'];
      const jsPath = pathRefs.current['javascript'];

      if (jsItem && jsLogo) {
        // Enters from far bottom-left deep plane
        tl.fromTo(
          jsItem,
          { opacity: 0, x: -550, y: 180, z: -300, scale: 0.7, filter: 'blur(16px)' },
          {
            opacity: 1,
            x: -320,
            y: 90,
            z: 80,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.14,
            ease: 'power2.out',
          },
          0.26
        );

        tl.fromTo(
          jsLogo,
          { opacity: 0, x: -440, y: 220, z: -250, rotateY: 35, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: -240,
            y: 150,
            z: 110,
            rotateY: 10,
            filter: 'blur(0px)',
            duration: 0.14,
            ease: 'power2.out',
          },
          0.28
        );

        if (jsPath) {
          tl.to(
            jsPath,
            { strokeDashoffset: 0, opacity: 0.6, duration: 0.12, ease: 'power1.inOut' },
            0.30
          );
        }
      }

      // Camera shifts angle to focus on the left emergence
      tl.to(
        cameraRig,
        {
          rotateY: 4,
          rotateX: -1,
          translateZ: 90,
          duration: 0.16,
          ease: 'power1.inOut',
        },
        0.30
      );

      // =========================================================================
      // ACT 4: PYTHON (Top) & TYPESCRIPT (Right) Dual Convergence (0.42 -> 0.58)
      // =========================================================================
      const pyItem = langItemRefs.current['python'];
      const pyLogo = langLogoRefs.current['python'];
      const pyPath = pathRefs.current['python'];

      const tsItem = langItemRefs.current['typescript'];
      const tsLogo = langLogoRefs.current['typescript'];
      const tsPath = pathRefs.current['typescript'];

      // Python swoops down from top space
      if (pyItem && pyLogo) {
        tl.fromTo(
          pyItem,
          { opacity: 0, x: -60, y: -420, z: -320, scale: 0.65, filter: 'blur(14px)' },
          {
            opacity: 1,
            x: -20,
            y: -220,
            z: -20,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.14,
            ease: 'power2.out',
          },
          0.42
        );

        tl.fromTo(
          pyLogo,
          { opacity: 0, x: -60, y: -480, z: -320, rotateX: 30, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: -20,
            y: -290,
            z: 0,
            rotateX: 6,
            filter: 'blur(0px)',
            duration: 0.14,
            ease: 'power2.out',
          },
          0.44
        );

        if (pyPath) {
          tl.to(
            pyPath,
            { strokeDashoffset: 0, opacity: 0.6, duration: 0.12, ease: 'power1.inOut' },
            0.45
          );
        }
      }

      // TypeScript glides in from upper right
      if (tsItem && tsLogo) {
        tl.fromTo(
          tsItem,
          { opacity: 0, x: 580, y: -140, z: -280, scale: 0.7, filter: 'blur(14px)' },
          {
            opacity: 1,
            x: 320,
            y: -90,
            z: 90,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.14,
            ease: 'power2.out',
          },
          0.46
        );

        tl.fromTo(
          tsLogo,
          { opacity: 0, x: 480, y: -80, z: -200, rotateY: -30, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 230,
            y: -30,
            z: 110,
            rotateY: -8,
            filter: 'blur(0px)',
            duration: 0.14,
            ease: 'power2.out',
          },
          0.48
        );

        if (tsPath) {
          tl.to(
            tsPath,
            { strokeDashoffset: 0, opacity: 0.6, duration: 0.12, ease: 'power1.inOut' },
            0.49
          );
        }
      }

      // Camera pivots smoothly across the horizon
      tl.to(
        cameraRig,
        {
          rotateY: -3,
          rotateX: 2,
          translateZ: 70,
          duration: 0.18,
          ease: 'power1.inOut',
        },
        0.46
      );

      // =========================================================================
      // ACT 5: HTML, CSS, and SQL Induction (0.56 -> 0.74)
      // =========================================================================
      const htmlItem = langItemRefs.current['html'];
      const htmlLogo = langLogoRefs.current['html'];
      const htmlPath = pathRefs.current['html'];

      const cssItem = langItemRefs.current['css'];
      const cssLogo = langLogoRefs.current['css'];
      const cssPath = pathRefs.current['css'];

      const sqlItem = langItemRefs.current['sql'];
      const sqlLogo = langLogoRefs.current['sql'];
      const sqlPath = pathRefs.current['sql'];

      // HTML from mid-left
      if (htmlItem && htmlLogo) {
        tl.fromTo(
          htmlItem,
          { opacity: 0, x: -520, y: -80, z: -200, scale: 0.75, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: -360,
            y: -70,
            z: 30,
            scale: 0.95,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power2.out',
          },
          0.56
        );

        tl.fromTo(
          htmlLogo,
          { opacity: 0, x: -420, y: -20, z: -150, rotateY: 25, filter: 'blur(10px)' },
          {
            opacity: 1,
            x: -280,
            y: -20,
            z: 60,
            rotateY: 8,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power2.out',
          },
          0.58
        );

        if (htmlPath) {
          tl.to(
            htmlPath,
            { strokeDashoffset: 0, opacity: 0.5, duration: 0.10, ease: 'power1.inOut' },
            0.59
          );
        }
      }

      // CSS from mid-right
      if (cssItem && cssLogo) {
        tl.fromTo(
          cssItem,
          { opacity: 0, x: 500, y: 80, z: -180, scale: 0.75, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 340,
            y: 80,
            z: 40,
            scale: 0.95,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power2.out',
          },
          0.60
        );

        tl.fromTo(
          cssLogo,
          { opacity: 0, x: 420, y: 140, z: -120, rotateY: -20, filter: 'blur(10px)' },
          {
            opacity: 1,
            x: 260,
            y: 130,
            z: 70,
            rotateY: -8,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power2.out',
          },
          0.62
        );

        if (cssPath) {
          tl.to(
            cssPath,
            { strokeDashoffset: 0, opacity: 0.5, duration: 0.10, ease: 'power1.inOut' },
            0.63
          );
        }
      }

      // SQL from bottom-depth
      if (sqlItem && sqlLogo) {
        tl.fromTo(
          sqlItem,
          { opacity: 0, x: 40, y: 440, z: -250, scale: 0.7, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 40,
            y: 240,
            z: 20,
            scale: 0.95,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power2.out',
          },
          0.64
        );

        tl.fromTo(
          sqlLogo,
          { opacity: 0, x: 40, y: 480, z: -200, rotateX: -25, filter: 'blur(10px)' },
          {
            opacity: 1,
            x: 40,
            y: 300,
            z: 40,
            rotateX: -6,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power2.out',
          },
          0.66
        );

        if (sqlPath) {
          tl.to(
            sqlPath,
            { strokeDashoffset: 0, opacity: 0.5, duration: 0.10, ease: 'power1.inOut' },
            0.67
          );
        }
      }

      // =========================================================================
      // ACT 6: Grand Constellation Wide Climax (0.72 -> 0.86)
      // =========================================================================
      // Camera pulls back to reveal the full living orbital constellation network
      tl.to(
        cameraRig,
        {
          translateZ: -120,
          rotateX: 0,
          rotateY: 0,
          duration: 0.14,
          ease: 'power2.inOut',
        },
        0.72
      );

      // Enhance the constellation orbital lines & brightness
      if (svgConstellationRef.current) {
        tl.to(
          svgConstellationRef.current,
          { opacity: 0.85, duration: 0.12, ease: 'power1.inOut' },
          0.74
        );
      }

      // =========================================================================
      // ACT 7: Dissolve to Cosmic Void & Final Monumental Statement (0.85 -> 1.00)
      // =========================================================================
      // Languages and logos drift into the deep cosmic void
      CINEMATIC_LANGUAGES.forEach((lang) => {
        const itemEl = langItemRefs.current[lang.id];
        const logoEl = langLogoRefs.current[lang.id];

        if (itemEl) {
          tl.to(
            itemEl,
            {
              opacity: 0,
              scale: 0.6,
              z: -500,
              filter: 'blur(16px)',
              duration: 0.10,
              ease: 'power2.in',
            },
            0.85
          );
        }
        if (logoEl) {
          tl.to(
            logoEl,
            {
              opacity: 0,
              scale: 0.5,
              z: -500,
              filter: 'blur(14px)',
              duration: 0.10,
              ease: 'power2.in',
            },
            0.85
          );
        }
      });

      // Constellation lines fade
      if (svgConstellationRef.current) {
        tl.to(
          svgConstellationRef.current,
          { opacity: 0, duration: 0.08, ease: 'power1.in' },
          0.86
        );
      }

      // Particle sphere recedes into subtle background ambient core
      tl.to(
        sphere,
        {
          scale: 0.45,
          opacity: 0.25,
          z: -300,
          duration: 0.12,
          ease: 'power2.inOut',
        },
        0.87
      );

      // Final Monumental Statement appears with huge editorial impact
      tl.fromTo(
        outro,
        { opacity: 0, scale: 0.92, y: 50, filter: 'blur(14px)' },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.12,
          ease: 'power2.out',
        },
        0.88
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-language-skills"
      className="relative w-full bg-black text-white selection:bg-white selection:text-black overflow-hidden"
      style={{
        height: '620vh',
      }}
      aria-label="Section 4: The Languages Behind The Work"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-black select-none"
        style={{
          perspective: '1400px',
        }}
      >
        {/* Deep Space Background Grid & Starlight */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Master 3D Spatial Camera Rig */}
        <div
          ref={cameraRigRef}
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ========================================================================= */}
          {/* ACT 1: Prologue Editorial Typography */}
          {/* ========================================================================= */}
          <div
            ref={introBlockRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-40"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Technical Identifier */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-neutral-950/80 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
                04 // LANGUAGE SYSTEM
              </span>
            </div>

            {/* Monumental Asymmetrical Statement */}
            <div className="max-w-5xl">
              <h2 className="font-orbitron font-black text-4xl sm:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-[0.95] text-left sm:text-center">
                THE LANGUAGES <br />
                <span className="text-neutral-500">BEHIND</span> <br />
                THE WORK.
              </h2>
            </div>

            <p className="mt-8 font-mono text-xs sm:text-sm text-neutral-400 tracking-widest uppercase max-w-md text-center opacity-70">
              [ SCROLL TO EXPLORE THE SYNTAX ARCHITECTURE ]
            </p>
          </div>

          {/* ========================================================================= */}
          {/* ACT 2 - 6: Massive Central Glowing Particles Knowledge Core */}
          {/* ========================================================================= */}
          <div
            ref={sphereContainerRef}
            className="absolute flex items-center justify-center w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] lg:w-[680px] lg:h-[680px] z-10 pointer-events-none"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Concentric Coordinate Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[70%] h-[70%] rounded-full border border-white/5 animate-[spin_80s_linear_infinite]" />
              <div className="w-[85%] h-[85%] rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite_reverse]" />
            </div>

            {/* Glowing Particles System */}
            <div className="relative w-full h-full flex items-center justify-center">
              <GlowingParticles
                color="#60A5FA"
                hot="#FFFFFF"
                density={24}
                streak={12}
                speed={14}
                size={5}
                bloom={18}
                rim={20}
                haze={20}
                spin={16}
                direction="right"
                sizePercent={90}
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Dynamic SVG Constellation Lattice Neural Paths */}
          {/* ========================================================================= */}
          <svg
            ref={svgConstellationRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-15 opacity-50"
            viewBox="-600 -400 1200 800"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="cinematic-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Orbital Arc Traces connecting core (0,0) to each language coordinate */}
            {/* JavaScript (-320, 90) */}
            <path
              ref={(el) => {
                pathRefs.current['javascript'] = el;
              }}
              d="M -320 90 C -220 160, -120 80, 0 0"
              fill="none"
              stroke="#F7DF1E"
              strokeWidth="1.2"
              filter="url(#cinematic-glow)"
            />

            {/* Python (-20, -220) */}
            <path
              ref={(el) => {
                pathRefs.current['python'] = el;
              }}
              d="M -20 -220 C -60 -140, -40 -60, 0 0"
              fill="none"
              stroke="#3776AB"
              strokeWidth="1.2"
              filter="url(#cinematic-glow)"
            />

            {/* TypeScript (320, -90) */}
            <path
              ref={(el) => {
                pathRefs.current['typescript'] = el;
              }}
              d="M 320 -90 C 220 -150, 110 -60, 0 0"
              fill="none"
              stroke="#3178C6"
              strokeWidth="1.2"
              filter="url(#cinematic-glow)"
            />

            {/* HTML (-360, -70) */}
            <path
              ref={(el) => {
                pathRefs.current['html'] = el;
              }}
              d="M -360 -70 C -250 -120, -130 -30, 0 0"
              fill="none"
              stroke="#E34F26"
              strokeWidth="1.2"
              filter="url(#cinematic-glow)"
            />

            {/* CSS (340, 80) */}
            <path
              ref={(el) => {
                pathRefs.current['css'] = el;
              }}
              d="M 340 80 C 240 140, 130 50, 0 0"
              fill="none"
              stroke="#1572B6"
              strokeWidth="1.2"
              filter="url(#cinematic-glow)"
            />

            {/* SQL (40, 240) */}
            <path
              ref={(el) => {
                pathRefs.current['sql'] = el;
              }}
              d="M 40 240 C 60 160, 30 70, 0 0"
              fill="none"
              stroke="#4169E1"
              strokeWidth="1.2"
              filter="url(#cinematic-glow)"
            />
          </svg>

          {/* ========================================================================= */}
          {/* ACT 3 - 6: Floating 3D Spatial Typography & Technology Logos */}
          {/* ========================================================================= */}
          {CINEMATIC_LANGUAGES.map((lang) => (
            <React.Fragment key={lang.id}>
              {/* Floating Spatial Typography */}
              <div
                ref={(el) => {
                  langItemRefs.current[lang.id] = el;
                }}
                className="absolute flex flex-col pointer-events-none z-30 select-none"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs sm:text-sm text-neutral-500 font-bold tracking-widest">
                    // {lang.shortCode}
                  </span>
                  <span
                    className="font-orbitron font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    style={{
                      textShadow: `0 0 30px ${lang.glowColor}`,
                    }}
                  >
                    {lang.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-neutral-400 tracking-wider mt-1 max-w-[260px] opacity-80">
                  {lang.tagline}
                </span>
              </div>

              {/* Floating 3D Technology Emblem */}
              <div
                ref={(el) => {
                  langLogoRefs.current[lang.id] = el;
                }}
                className="absolute flex items-center justify-center pointer-events-none z-30"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl p-3 sm:p-4 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                  style={{
                    backgroundColor: 'rgba(10, 10, 10, 0.65)',
                    boxShadow: `0 0 35px ${lang.glowColor}`,
                    borderColor: `${lang.color}40`,
                  }}
                >
                  <img
                    src={lang.icon}
                    alt={`${lang.name} emblem`}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* ========================================================================= */}
          {/* ACT 7: Monumental Editorial Outro Statement */}
          {/* ========================================================================= */}
          <div
            ref={outroBlockRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-40 pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-neutral-950/80 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
                ENGINEERING ETHOS
              </span>
            </div>

            <div className="max-w-4xl">
              <h2 className="font-orbitron font-black text-5xl sm:text-8xl lg:text-9xl tracking-tighter uppercase text-white leading-[0.92] drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]">
                LEARN. <br />
                <span className="bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
                  BUILD.
                </span> <br />
                REPEAT.
              </h2>
            </div>

            <p className="mt-8 font-mono text-xs sm:text-sm text-neutral-400 tracking-[0.2em] uppercase max-w-lg text-center opacity-80">
              CONTINUOUS COMPUTATIONAL REFINEMENT // ZERO COMPROMISE
            </p>
          </div>
        </div>

        {/* Cinematic Section HUD Overlays */}
        {/* Top-Right Technical Coordinates */}
        <div className="absolute top-8 right-8 hidden sm:flex items-center gap-3 z-50 pointer-events-none">
          <div className="text-[11px] font-mono text-neutral-500 tracking-widest border border-white/10 px-3 py-1.5 rounded bg-black/60 backdrop-blur-md">
            SYS.SYNTAX // VOLUMETRIC MATRIX
          </div>
        </div>

        {/* Bottom-Left Status Indicator */}
        <div className="absolute bottom-8 left-8 hidden sm:flex items-center gap-2 z-50 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-neutral-950/70 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono text-neutral-300 tracking-wider">
              6 CORE PARADIGMS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

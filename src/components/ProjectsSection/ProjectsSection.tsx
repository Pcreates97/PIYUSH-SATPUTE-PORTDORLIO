import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA, ProjectData } from './projectsData';
import { DrawerType } from '../Drawers';
import { ArrowUpRight, Github, ExternalLink, Sparkles, Layers, Cpu, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  onOpenDrawer?: (drawer: DrawerType) => void;
  onShowToast?: (msg: string) => void;
}

export function ProjectsSection({ onOpenDrawer, onShowToast }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
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

      // Project Rows Staggered Reveal
      projectRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="section-projects"
      ref={sectionRef}
      className="relative w-full bg-black text-white py-28 sm:py-36 px-6 sm:px-12 lg:px-16 selection:bg-white selection:text-black border-t border-neutral-900 overflow-hidden"
      aria-label="Section: Selected Projects"
    >
      {/* Top Editorial Header */}
      <div ref={headerRef} className="max-w-7xl mx-auto mb-20 sm:mb-28">
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>05 // SELECTED WORKS</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-none">
            ENGINEERED <br />
            <span className="text-neutral-400">PROTOTYPES & SYSTEMS.</span>
          </h2>

          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-md leading-relaxed">
            Realized architectures balancing extreme compute efficiency, zero-latency state distribution, and immersive spatial design.
          </p>
        </div>
      </div>

      {/* Editorial Projects List (Alternating High-Craft Layout) */}
      <div className="max-w-7xl mx-auto space-y-28 sm:space-y-36">
        {PROJECTS_DATA.map((project, idx) => {
          const isReversed = idx % 2 === 1;

          return (
            <div
              key={project.id}
              ref={(el) => {
                projectRefs.current[idx] = el;
              }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Preview Column (7 cols) */}
              <div
                className={`lg:col-span-7 ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div
                  onClick={() => onOpenDrawer?.('projects')}
                  data-cursor="project"
                  className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-neutral-500 transition-all duration-500 cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                >
                  {/* Aspect Ratio Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={project.imageSrc}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] filter brightness-95 group-hover:brightness-105"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Subtle Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                    {/* Status / Badge Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[10px] tracking-widest uppercase text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{project.badge}</span>
                    </div>

                    {/* View Action Hover Overlay */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-jakarta font-semibold text-xs tracking-wider uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <span>VIEW BLUEPRINT</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text & Meta Information Column (5 cols) */}
              <div
                className={`lg:col-span-5 flex flex-col justify-center ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                {/* Number & Phase */}
                <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 tracking-[0.25em] uppercase mb-2">
                  <span className="text-white font-bold">{project.number}</span>
                  <span>/</span>
                  <span>{project.phase}</span>
                </div>

                {/* Title */}
                <h3 className="font-orbitron font-black text-2xl sm:text-4xl text-white tracking-tight uppercase leading-tight mb-2 group-hover:text-neutral-200 transition-colors">
                  {project.title}
                </h3>

                {/* Subtitle */}
                <p className="font-mono text-xs text-neutral-400 uppercase tracking-wider mb-4">
                  {project.subtitle}
                </p>

                {/* Short Concept Summary */}
                <p className="text-neutral-300 font-light text-sm sm:text-base leading-relaxed mb-6">
                  {project.shortDesc}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md border border-neutral-800 bg-neutral-950 font-mono text-[11px] text-neutral-300 tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions & Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-neutral-900 font-mono text-xs tracking-wider uppercase">
                  <button
                    onClick={() => onOpenDrawer?.('projects')}
                    className="inline-flex items-center gap-2 text-white hover:text-neutral-300 font-semibold transition-colors cursor-pointer py-1"
                  >
                    <span>EXPLORE SPECS</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <a
                    href={project.githubUrl || 'https://github.com'}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="github"
                    className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors py-1"
                  >
                    <Github size={14} />
                    <span>SOURCE</span>
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors py-1"
                    >
                      <ExternalLink size={14} />
                      <span>LIVE</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

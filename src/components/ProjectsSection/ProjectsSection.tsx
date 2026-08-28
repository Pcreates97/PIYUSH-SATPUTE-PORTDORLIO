import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA, ProjectData } from './projectsData';
import { JourneyMilestoneCard } from './JourneyMilestoneCard';
import { DrawerType } from '../Drawers';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Globe2, 
  ShieldCheck, 
  ArrowUpRight,
  Milestone,
  Compass,
  Zap,
  Layers,
  ChevronDown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  onOpenDrawer?: (drawer: DrawerType) => void;
  onShowToast?: (msg: string) => void;
}

export function ProjectsSection({ onOpenDrawer, onShowToast }: ProjectsSectionProps) {
  const [activeStation, setActiveStation] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const laserBeamRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Function to smoothly scroll to a specific journey milestone
  const scrollToMilestone = (index: number) => {
    const el = milestonesRef.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveStation(index);
    }
  };

  useEffect(() => {
    if (!sectionRef.current || !timelineTrackRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header Entrance
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 2. Central Laser Beam Scrubbed Progress
      if (laserBeamRef.current && timelineTrackRef.current) {
        ScrollTrigger.create({
          trigger: timelineTrackRef.current,
          start: 'top 60%',
          end: 'bottom 75%',
          scrub: 0.5,
          onUpdate: (self) => {
            setScrollProgress(Math.round(self.progress * 100));
            if (laserBeamRef.current) {
              laserBeamRef.current.style.transform = `scaleY(${self.progress})`;
            }

            // Calculate active station index based on progress
            const count = PROJECTS_DATA.length;
            const currentIdx = Math.min(
              count - 1,
              Math.floor(self.progress * count)
            );
            setActiveStation(currentIdx);
          },
        });
      }

      // 3. Milestone Row Staggered Scroll Triggers
      milestonesRef.current.forEach((row, i) => {
        if (!row) return;

        const isEven = i % 2 === 1;
        const cardElem = row.querySelector('.journey-card-wrapper');
        const nodeElem = row.querySelector('.journey-node-marker');
        const connectorElem = row.querySelector('.journey-connector-line');

        // Animate Timeline Node Checkpoint
        if (nodeElem) {
          gsap.fromTo(
            nodeElem,
            { scale: 0.5, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: row,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Animate Connector Wire
        if (connectorElem) {
          gsap.fromTo(
            connectorElem,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 68%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Animate Card Container with 3D Slide In
        if (cardElem) {
          gsap.fromTo(
            cardElem,
            {
              opacity: 0,
              x: isEven ? 80 : -80,
              y: 30,
              rotateY: isEven ? -10 : 10,
              scale: 0.94,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-projects-journey"
      className="relative w-full min-h-screen bg-black text-white py-24 sm:py-32 px-4 sm:px-8 lg:px-12 border-t border-neutral-900 overflow-hidden select-none"
      aria-label="Section 5: Engineering Journey & Projects Odyssey"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Background Cybernetic Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Atmospheric Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-white/[0.012] rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-[1480px] mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-md mb-4 text-xs font-mono tracking-widest text-neutral-300">
            <Compass size={13} className="text-white animate-spin [animation-duration:8s]" />
            <span>05 // THE ENGINEERING JOURNEY & ODYSSEY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-heading leading-[1.1] mb-5">
            Architectural Odyssey <br />
            <span className="text-neutral-400 font-light">From Core Compilers to Multi-Modal AI</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
            A chronological timeline of software breakthroughs, high-frequency settlement protocols,
            spatial WebGL rendering engines, and autonomous multi-agent kernels.
          </p>

          {/* Mission Control HUD: Interactive Station Quick Jump */}
          <div className="mt-8 p-2 rounded-2xl bg-neutral-950/90 border border-neutral-800 backdrop-blur-md inline-flex flex-wrap items-center justify-center gap-1.5 shadow-xl max-w-full">
            {PROJECTS_DATA.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => scrollToMilestone(idx)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeStation === idx
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeStation === idx ? 'bg-black' : 'bg-neutral-500'}`} />
                <span>{proj.number} {proj.year}</span>
              </button>
            ))}
          </div>

          {/* Live Progress Bar Indicator */}
          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-mono text-neutral-400">
            <span>ODYSSEY PROGRESS:</span>
            <div className="w-36 h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-white transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="font-bold text-white">{scrollProgress}%</span>
          </div>
        </div>

        {/* The Timeline Track Container */}
        <div ref={timelineTrackRef} className="relative w-full max-w-6xl mx-auto py-12">
          {/* Central Conduit Spine (Background Track) */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-neutral-900 hidden lg:block" />

          {/* Central Animated Laser Beam (GSAP Scrubbed) */}
          <div
            ref={laserBeamRef}
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-gradient-to-b from-white via-neutral-200 to-white hidden lg:block origin-top shadow-[0_0_12px_rgba(255,255,255,0.8)] z-10"
            style={{ transform: 'scaleY(0)' }}
          />

          {/* Milestone Rows */}
          <div className="space-y-20 sm:space-y-28">
            {PROJECTS_DATA.map((project, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    milestonesRef.current[idx] = el;
                  }}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left or Right Card Column */}
                  <div className="w-full lg:w-1/2 lg:px-10">
                    <div className="journey-card-wrapper">
                      <JourneyMilestoneCard
                        project={project}
                        index={idx}
                        isEven={isEven}
                        onOpenDrawer={onOpenDrawer}
                        onShowToast={onShowToast}
                      />
                    </div>
                  </div>

                  {/* Central Node Marker on Laser Conduit */}
                  <div className="journey-node-marker absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center justify-center">
                    <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 backdrop-blur-md shadow-xl ${
                      activeStation === idx
                        ? 'bg-white text-black border-white ring-4 ring-white/20 scale-110'
                        : 'bg-neutral-950 text-white border-neutral-700 hover:border-white'
                    }`}>
                      {project.number}
                    </div>
                    {/* Animated Pulse Ring */}
                    {activeStation === idx && (
                      <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-50" />
                    )}
                  </div>

                  {/* Connector Wire from Central Node to Card */}
                  <div
                    className={`journey-connector-line absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-white/40 to-transparent hidden lg:block z-10 origin-center ${
                      isEven
                        ? 'right-1/2 w-10 origin-right'
                        : 'left-1/2 w-10 origin-left'
                    }`}
                  />

                  {/* Empty Spacer Column for Alternating Balance on Desktop */}
                  <div className="w-full lg:w-1/2 lg:px-10 hidden lg:block">
                    <div className="p-6 rounded-2xl bg-neutral-950/40 border border-neutral-850/60 backdrop-blur-sm max-w-sm ml-auto mr-auto opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
                        <Milestone size={14} className="text-white" />
                        <span>CHRONO RECORD // {project.year}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                        {project.breakthrough}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 text-[10px] font-mono bg-neutral-900 rounded border border-neutral-800 text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Odyssey Conclusion & Synthesis */}
        <div className="mt-20 sm:mt-28 p-8 sm:p-10 rounded-3xl border border-neutral-800 bg-neutral-950/90 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                <Terminal size={14} className="text-white" />
                <span>Next Generation Frontiers // 2026 & Beyond</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-3">
                Ready to pioneer the next milestone together?
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Whether deploying autonomous agent swarms, sub-second decentralized rails, 
                or immersive WebGL environments, our engineering pipeline is built for high-impact realization.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
              <button
                onClick={() => onOpenDrawer?.('projects')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs sm:text-sm border border-neutral-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Layers size={15} />
                <span>Open Full Lab Archives</span>
              </button>

              <button
                onClick={() => onOpenDrawer?.('contact')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xl cursor-pointer whitespace-nowrap"
              >
                <span>Initiate Contact</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;

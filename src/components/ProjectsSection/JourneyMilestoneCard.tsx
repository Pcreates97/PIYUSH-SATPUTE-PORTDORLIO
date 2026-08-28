import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ProjectData } from './projectsData';
import { 
  ArrowUpRight, 
  Github, 
  Layers, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Code2,
  Sparkles,
  Milestone,
  TrendingUp
} from 'lucide-react';
import { DrawerType } from '../Drawers';

interface JourneyMilestoneCardProps {
  project: ProjectData;
  index: number;
  isEven: boolean;
  onOpenDrawer?: (drawer: DrawerType) => void;
  onShowToast?: (msg: string) => void;
}

export function JourneyMilestoneCard({
  project,
  index,
  isEven,
  onOpenDrawer,
  onShowToast,
}: JourneyMilestoneCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const layoutId = `journey-milestone-card-${project.id}`;

  // GSAP 3D hover tilt effect on card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: (x / rect.width) * 10,
      rotateX: -(y / rect.height) * 10,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: 'center center',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Closed State Interactive Journey Card */}
      <motion.div
        ref={cardRef}
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full rounded-2xl border border-neutral-800 bg-neutral-950/90 overflow-hidden cursor-pointer shadow-2xl hover:border-neutral-500 transition-all duration-300 select-none flex flex-col justify-between"
        whileHover="hover"
      >
        {/* Top Image Preview & Visual Scrim */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-black">
          <motion.img
            layoutId={`image-${layoutId}`}
            src={project.imageSrc}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.15] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-300" />

          {/* Top Overlays: Phase Badge + Year */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {project.badge}
            </span>
            <span className="font-mono text-xs font-bold text-white bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              {project.year}
            </span>
          </div>

          {/* Bottom Overlay inside Image: Category tag */}
          <div className="absolute bottom-3 left-4 z-10">
            <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase bg-black/60 px-2 py-0.5 rounded border border-white/10">
              {project.phase}
            </span>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
          <div>
            <motion.h3
              layoutId={`title-${layoutId}`}
              className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 font-heading group-hover:text-neutral-100 transition-colors"
            >
              {project.title}
            </motion.h3>

            <motion.p
              layoutId={`subtitle-${layoutId}`}
              className="text-xs font-mono text-neutral-400 mb-3"
            >
              {project.subtitle}
            </motion.p>

            <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mb-4 leading-relaxed font-light">
              {project.shortDesc}
            </p>

            {/* Key Breakthrough Quote Box */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 mb-4 group-hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                <Sparkles size={12} className="text-white" />
                <span>Breakthrough Milestone</span>
              </div>
              <p className="text-xs text-neutral-200 line-clamp-2 italic font-sans leading-snug">
                "{project.breakthrough}"
              </p>
            </div>
          </div>

          {/* Bottom Specs & Inspect Trigger */}
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {project.metrics.slice(0, 2).map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">
                    {m.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-medium text-white group-hover:underline underline-offset-4">
              <span>Inspect Phase</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Modal Specification View */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
            {/* Backdrop Blur Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-5xl max-h-[90vh] bg-neutral-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 z-10 flex flex-col md:flex-row shadow-2xl text-white select-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center bg-black/70 hover:bg-white hover:text-black rounded-full border border-white/20 text-white transition-all backdrop-blur-md cursor-pointer"
                aria-label="Close Project Modal"
              >
                <X size={18} />
              </button>

              {/* Left Visual Column */}
              <div className="relative h-64 sm:h-80 md:h-auto md:w-5/12 shrink-0 overflow-hidden bg-black flex flex-col justify-between p-6">
                <motion.img
                  layoutId={`image-${layoutId}`}
                  src={project.imageSrc}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.8] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

                {/* Top Status */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-black/75 backdrop-blur-md text-white border border-white/20">
                    {project.badge}
                  </span>
                  <span className="font-mono text-xs text-white bg-black/75 px-3 py-1 rounded-full border border-white/20 font-bold">
                    {project.year}
                  </span>
                </div>

                {/* Bottom Image Overlay Metrics */}
                <div className="relative z-10 pt-4 border-t border-white/20 bg-black/70 backdrop-blur-md p-4 rounded-xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Verified Benchmark Metrics
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">
                          {m.label}
                        </span>
                        <span className="text-sm font-bold font-mono text-white">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Details Column */}
              <div className="p-6 sm:p-8 md:p-10 w-full md:w-7/12 flex flex-col h-full overflow-y-auto max-h-[85vh] custom-scrollbar">
                {/* Header Info */}
                <div className="mb-6 pb-5 border-b border-neutral-800">
                  <motion.p
                    layoutId={`subtitle-${layoutId}`}
                    className="text-neutral-400 text-xs font-mono tracking-wider uppercase mb-1.5 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{project.phase} // STATION {project.number}</span>
                  </motion.p>
                  <motion.h3
                    layoutId={`title-${layoutId}`}
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-heading"
                  >
                    {project.title}
                  </motion.h3>
                  <p className="text-sm font-mono text-neutral-400">
                    {project.subtitle}
                  </p>
                </div>

                {/* Main Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-6 text-sm text-neutral-300 leading-relaxed"
                >
                  {/* Breakthrough Banner */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700/60 shadow-lg">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-1.5 flex items-center gap-2">
                      <TrendingUp size={14} className="text-white" />
                      Engineering Breakthrough
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                      {project.breakthrough}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                      <Zap size={14} className="text-white" />
                      Milestone Overview
                    </h4>
                    <p className="font-light text-neutral-300 leading-relaxed">
                      {project.longDesc}
                    </p>
                  </div>

                  {/* Key Capabilities */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                      <Cpu size={14} className="text-white" />
                      Core Architectural Inventions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {project.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200"
                        >
                          <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architecture Blueprint */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                      <Layers size={13} className="text-white" />
                      System Topology
                    </h4>
                    <p className="text-xs text-neutral-300 font-mono">
                      {project.architecture}
                    </p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-2.5 flex items-center gap-2">
                      <Code2 size={14} className="text-white" />
                      Runtime & Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-900 border border-neutral-700/60 text-neutral-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenDrawer?.('projects');
                      }}
                      className="px-5 py-2.5 bg-white text-black font-medium text-xs sm:text-sm rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>Explore In Labs</span>
                      <ExternalLink size={14} />
                    </button>

                    <button
                      onClick={() => {
                        if (onShowToast) onShowToast(`Opened repository for ${project.title}`);
                      }}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white font-mono text-xs sm:text-sm rounded-xl border border-neutral-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Github size={15} />
                      <span>Source Code</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenDrawer?.('contact');
                      }}
                      className="px-4 py-2.5 text-neutral-400 hover:text-white font-mono text-xs transition-colors underline underline-offset-4 ml-auto cursor-pointer"
                    >
                      Inquire on this build →
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

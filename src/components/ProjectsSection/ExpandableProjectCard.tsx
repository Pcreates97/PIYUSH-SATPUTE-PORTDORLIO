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
  Activity, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { DrawerType } from '../Drawers';

interface ExpandableProjectCardProps {
  project: ProjectData;
  onOpenDrawer?: (drawer: DrawerType) => void;
  onShowToast?: (msg: string) => void;
}

export function ExpandableProjectCard({
  project,
  onOpenDrawer,
  onShowToast,
}: ExpandableProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const layoutId = `expandable-project-card-${project.id}`;

  // GSAP 3D hover tilt effect on the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: (x / rect.width) * 12,
      rotateX: -(y / rect.height) * 12,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 900,
      transformOrigin: 'center center',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
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
      {/* 1. Closed State Interactive Card */}
      <motion.div
        ref={cardRef}
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-[380px] sm:h-[420px] w-full rounded-2xl border border-neutral-800 bg-neutral-950/80 overflow-hidden cursor-pointer shadow-lg hover:border-neutral-600 transition-colors duration-300 select-none flex flex-col justify-between"
        whileHover="hover"
      >
        {/* Background Project Image with subtle zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            layoutId={`image-${layoutId}`}
            src={project.imageSrc}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.1] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-transparent transition-colors duration-300" />
        </div>

        {/* Card Top Bar: Badge & Project Number */}
        <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {project.badge}
          </span>
          <span className="font-mono text-xs text-neutral-400 font-semibold tracking-widest bg-black/60 px-2 py-0.5 rounded border border-white/10">
            {project.number} // 04
          </span>
        </div>

        {/* Card Bottom Content Area */}
        <div className="relative z-10 p-5 sm:p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <motion.p
            layoutId={`subtitle-${layoutId}`}
            className="text-neutral-400 text-xs font-mono tracking-wider uppercase mb-1.5 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {project.category}
          </motion.p>
          
          <motion.h3
            layoutId={`title-${layoutId}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-heading"
          >
            {project.title}
          </motion.h3>

          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mb-4 leading-relaxed font-light">
            {project.shortDesc}
          </p>

          {/* Quick Metrics Bar & Expand Prompt */}
          <div className="flex items-center justify-between pt-3 border-t border-white/15">
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
              <span>Inspect</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Expanded Modal Profile View */}
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

            {/* Modal Content Container */}
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

              {/* Left Column: Visual Showcase Banner */}
              <div className="relative h-64 sm:h-80 md:h-auto md:w-5/12 shrink-0 overflow-hidden bg-black flex flex-col justify-between p-6">
                <motion.img
                  layoutId={`image-${layoutId}`}
                  src={project.imageSrc}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.8] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

                {/* Top Status inside image */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-black/75 backdrop-blur-md text-white border border-white/20">
                    {project.badge}
                  </span>
                  <span className="font-mono text-xs text-white/70 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                    {project.status}
                  </span>
                </div>

                {/* Bottom Image Overlay Metrics */}
                <div className="relative z-10 pt-4 border-t border-white/20 bg-black/60 backdrop-blur-md p-4 rounded-xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Verified Performance Metrics
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

              {/* Right Column: Full Specifications & Interactive Actions */}
              <div className="p-6 sm:p-8 md:p-10 w-full md:w-7/12 flex flex-col h-full overflow-y-auto max-h-[85vh] custom-scrollbar">
                {/* Header Info */}
                <div className="mb-6 pb-5 border-b border-neutral-800">
                  <motion.p
                    layoutId={`subtitle-${layoutId}`}
                    className="text-neutral-400 text-xs font-mono tracking-wider uppercase mb-1.5 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{project.category} // PROJECT ARCHIVE {project.number}</span>
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
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                      <Zap size={14} className="text-white" />
                      Executive Summary
                    </h4>
                    <p className="font-light text-neutral-300 leading-relaxed">
                      {project.longDesc}
                    </p>
                  </div>

                  {/* Key Capabilities / Features */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                      <Cpu size={14} className="text-white" />
                      Key Capabilities & Specifications
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

                  {/* Architecture Blueprint Note */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                      <Layers size={13} className="text-white" />
                      Architecture Topology
                    </h4>
                    <p className="text-xs text-neutral-300 font-mono">
                      {project.architecture}
                    </p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-2.5 flex items-center gap-2">
                      <Code2 size={14} className="text-white" />
                      Technologies & Runtime
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
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs sm:text-sm rounded-xl border border-neutral-700 transition-colors flex items-center gap-2 cursor-pointer"
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

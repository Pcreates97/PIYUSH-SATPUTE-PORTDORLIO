import React from 'react';
import { motion, type Variants } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ArrowUpRight, 
  Terminal, 
  Sparkles,
  Layers,
  Cpu,
  Globe,
  ArrowUp
} from 'lucide-react';
import type { DrawerType } from './Drawers';
import heroBgImage from '../assets/hero-bg-2.png';
import { GradualBlur } from './GradualBlur';

interface Footer16Props {
  onOpenDrawer?: (drawer: DrawerType) => void;
  brandName?: string;
  tagline?: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const wordmarkVariants: Variants = {
  hidden: { opacity: 0, y: 35, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 1.2, bounce: 0 },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.65, bounce: 0 },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.45, bounce: 0 },
  },
};

export function Footer16({
  onOpenDrawer,
  brandName = 'PIYUSH',
  tagline = 'Engineering hyper-performant AI workflows,\nspatial interfaces & autonomous systems.\nCrafted with mathematical precision.',
}: Footer16Props) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationColumns = [
    {
      title: 'SECTIONS & FLOW',
      links: [
        { label: 'Neural Hero Core', action: () => scrollToTop() },
        { label: 'Cinematic Experience', action: () => scrollToSection('section-experience-sequence') },
        { label: 'Orbital AI Universe', action: () => scrollToSection('section-ai-coding-skills') },
        { label: 'Language Matrix', action: () => scrollToSection('section-language-skills') },
      ],
    },
    {
      title: 'PORTFOLIO DIRECTORY',
      links: [
        { label: 'Selected Works (04)', action: () => onOpenDrawer?.('projects') },
        { label: 'Technical Expertise', action: () => onOpenDrawer?.('expertise') },
        { label: 'Biography & Philosophy', action: () => onOpenDrawer?.('about') },
        { label: 'Get in Touch', action: () => onOpenDrawer?.('contact') },
      ],
    },
    {
      title: 'DEVELOPMENT & STACK',
      links: [
        { label: 'TypeScript & Rust Core', action: () => onOpenDrawer?.('expertise') },
        { label: 'Next-Gen Agentic Tools', action: () => scrollToSection('section-ai-coding-skills') },
        { label: 'WebGL & 3D Shaders', action: () => onOpenDrawer?.('projects') },
        { label: 'Full-Stack Architecture', action: () => onOpenDrawer?.('expertise') },
      ],
    },
  ];

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com', icon: Github },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { label: 'Twitter / X', href: 'https://x.com', icon: Twitter },
    { label: 'Email', href: 'mailto:piyushsatpute95102007@gmail.com', icon: Mail },
  ];

  const legalLinks = [
    { label: 'System Status: Optimal', action: () => onOpenDrawer?.('about') },
    { label: 'Privacy & Terms', action: () => onOpenDrawer?.('about') },
    { label: 'v2.6.0-stable', action: () => onOpenDrawer?.('about') },
  ];

  return (
    <footer
      id="main-footer"
      className="relative w-full overflow-hidden bg-neutral-950 font-sans text-neutral-100 antialiased border-t border-neutral-800/80"
    >
      {/* Background Graphic Asset with High-Tech Atmospheric Overlays */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transform translate-y-4"
        style={{ backgroundImage: `url(${heroBgImage})` }}
        aria-hidden="true"
      />
      
      {/* Precision Gradient Fade Mask */}
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(10,10,12,0.65)_35%,rgba(5,5,7,0.90)_75%,rgba(0,0,0,0.98)_100%)]"
        aria-hidden="true"
      />

      {/* Cybernetic Accent Glows */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-gradient-to-b from-white/[0.04] to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Progressive Top Gradual Blur */}
      <GradualBlur 
        position="top" 
        height="5rem" 
        strength={2.2} 
        divCount={5} 
        curve="ease-out" 
        zIndex={5} 
      />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto flex min-h-[560px] flex-col justify-end pt-16 sm:min-h-[640px] lg:min-h-[740px]"
      >
        {/* Massive Architectural Typography Watermark */}
        <motion.div
          variants={wordmarkVariants}
          className="pointer-events-none absolute top-[36%] left-1/2 flex w-[125vw] -translate-x-1/2 justify-center overflow-hidden sm:top-[16%] lg:top-[10%]"
          aria-hidden="true"
        >
          <svg
            className="h-auto w-full select-none"
            viewBox={`0 0 ${Math.max(brandName.length * 110, 480)} 160`}
            preserveAspectRatio="xMidYMid meet"
            aria-label={brandName}
          >
            <defs>
              <linearGradient id="brandGrad16" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#71717a" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#3f3f46" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#18181b" stopOpacity="0.03" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="60%"
              dominantBaseline="alphabetic"
              textAnchor="middle"
              textLength="88%"
              lengthAdjust="spacing"
              className="font-orbitron font-black tracking-tighter"
              fill="url(#brandGrad16)"
              fontSize="120"
            >
              {brandName}
            </text>
          </svg>
        </motion.div>

        {/* Content Container with Frosted Glass Panel */}
        <div className="relative z-10 border-t border-white/10 bg-black/60 px-5 pt-10 pb-8 shadow-[0_-24px_80px_rgba(0,0,0,0.8)] backdrop-blur-md sm:px-12 sm:pt-12 sm:pb-9 lg:pt-14">
          <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[minmax(260px,1.1fr)_minmax(540px,1.9fr)] lg:gap-x-16">
            
            {/* Left Brand & Mission Column */}
            <motion.div variants={riseVariants} className="max-w-xl space-y-4">
              <button
                onClick={scrollToTop}
                className="group inline-flex items-center gap-3 text-white transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.98] cursor-pointer text-left"
                aria-label={`${brandName} home`}
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/15 flex items-center justify-center shadow-inner group-hover:border-white/30 transition-colors">
                  <span className="font-orbitron font-black text-sm text-white tracking-widest">
                    P˚
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-orbitron text-xl leading-none font-bold tracking-wider text-white">
                    {brandName}˚
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">
                    Portfolio // Edition 2026
                  </span>
                </div>
              </button>

              <p className="text-sm leading-relaxed font-normal text-pretty whitespace-pre-line text-neutral-300/80 font-jakarta">
                {tagline}
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for Select Client Projects & Roles</span>
              </div>
            </motion.div>

            {/* Right Navigation Link Grid */}
            <motion.nav
              variants={sectionVariants}
              aria-label="Footer navigation"
              className="grid grid-cols-1 gap-8 min-[520px]:grid-cols-3 min-[520px]:gap-x-8 lg:gap-x-12"
            >
              {navigationColumns.map((column) => (
                <motion.div variants={riseVariants} key={column.title} className="space-y-3">
                  <h3 className="text-xs font-mono font-medium tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-500" />
                    {column.title}
                  </h3>
                  <motion.ul variants={listVariants} className="space-y-2.5">
                    {column.links.map((link) => (
                      <motion.li variants={linkVariants} key={link.label}>
                        <button
                          onClick={link.action}
                          className="group inline-flex items-center text-sm leading-tight text-neutral-300/75 hover:text-white transition-colors duration-200 ease-out cursor-pointer text-left"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          {/* Bottom Bar: Copyright, Socials, Top-Scroll */}
          <motion.div
            variants={riseVariants}
            className="max-w-7xl mx-auto mt-10 flex flex-col border-t border-white/10 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-xs font-mono text-neutral-400">
                © {currentYear} {brandName}. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-3">
                {legalLinks.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              {/* Social Channels */}
              <motion.ul
                variants={listVariants}
                className="flex items-center gap-1"
                aria-label="Social profiles"
              >
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.li variants={linkVariants} key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="group relative flex size-9 items-center justify-center rounded-lg bg-neutral-900/60 border border-white/5 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-neutral-800 transition-all duration-200 ease-out active:scale-95"
                      >
                        <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Scroll to Top Trigger */}
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900/60 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:border-white/25 hover:bg-neutral-800 transition-all duration-200 active:scale-95 cursor-pointer ml-2"
              >
                <span>TOP</span>
                <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer16;

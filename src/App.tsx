/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowUpRight, Check, Code2, Menu, X as CloseIcon, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageRevealBackground } from './components/ImageRevealBackground';
import {
  CornerBracketTL,
  CornerBracketTR,
  CornerBracketBL,
  CornerBracketBR,
  CheckerboardGrid,
  WireframeGlobe,
} from './components/SVGs';
import { Drawers, DrawerType } from './components/Drawers';
import ExperienceSection from './components/ExperienceSection/ExperienceSection';
import { AICodingSkills } from './components/AICodingSkills';
import { LanguageSkillsSection } from './components/LanguageSkills';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer16 } from './components/Footer16';
import { GradualBlur } from './components/GradualBlur';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { AudioSynthesizer } from './components/AudioSynthesizer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isPreloaderDone, setIsPreloaderDone] = useState<boolean>(false);

  // Global ScrollTrigger synchronization
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }
    window.addEventListener('load', handleRefresh);
    window.addEventListener('resize', handleRefresh);

    const t1 = setTimeout(handleRefresh, 300);
    const t2 = setTimeout(handleRefresh, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('load', handleRefresh);
      window.removeEventListener('resize', handleRefresh);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      showToast(next ? 'Ambient audio synthesis enabled' : 'Ambient audio muted');
      return next;
    });
  };

  return (
    <div
      id="lgpsm-portfolio-root"
      className="min-h-screen bg-black text-white font-jakarta flex flex-col relative overflow-x-hidden selection:bg-white selection:text-black cursor-default"
    >
      {/* 0. Preloader Screen */}
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      {/* 0B. Custom Spatial Cursor */}
      <CustomCursor />

      {/* 0C. Ambient Synthesizer */}
      <AudioSynthesizer enabled={soundEnabled} />

      {/* 1. Desktop Interactive Image Reveal Background with Spotlight & Parallax Grid */}
      <ImageRevealBackground />

      {/* Bottom Fixed Gradual Blur for smooth downside page transition */}
      <GradualBlur 
        target="page" 
        position="bottom" 
        height="5rem" 
        strength={2} 
        divCount={6} 
        curve="ease-out" 
        zIndex={25} 
      />

      {/* 2. Toast Notification */}
      {toastMessage && (
        <div
          id="action-toast"
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-neutral-950/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-800 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={13} strokeWidth={2.5} />
          </div>
          <span className="font-mono text-xs tracking-wider font-medium">
            {toastMessage}
          </span>
        </div>
      )}

      {/* 3. Minimalist Header */}
      <header
        id="main-header"
        className="relative z-20 flex items-center justify-between"
        style={{
          paddingInline: 'var(--pad-x)',
          paddingTop: 'var(--header-pt)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        {/* Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => {
            setActiveDrawer(null);
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center font-orbitron font-black text-white hover:opacity-80 transition-opacity cursor-pointer text-left py-1"
          style={{
            fontSize: 'var(--logo)',
            letterSpacing: '0.15em',
          }}
          aria-label="Portfolio Home"
        >
          <span>PIYUSH</span>
          <span
            className="inline-block -mt-0.5 ml-0.5 font-sans font-light"
            style={{ fontSize: 'var(--logo-deg)' }}
          >
            ˚
          </span>
        </button>

        {/* Desktop & Tablet Navigation */}
        <nav
          id="primary-nav"
          className="hidden md:flex items-center font-jakarta font-medium uppercase text-white"
          style={{
            fontSize: 'var(--nav)',
            letterSpacing: '0.2em',
            gap: 'var(--gap-nav)',
          }}
          aria-label="Main Navigation"
        >
          <button
            id="nav-projects-btn"
            onClick={() => setActiveDrawer('projects')}
            className={`hover:text-neutral-400 transition-colors cursor-pointer py-1 px-1.5 ${
              activeDrawer === 'projects' ? 'text-neutral-400' : ''
            }`}
          >
            PROJECTS
          </button>

          <button
            id="nav-expertise-btn"
            onClick={() => setActiveDrawer('expertise')}
            className={`hover:text-neutral-400 transition-colors cursor-pointer py-1 px-1.5 ${
              activeDrawer === 'expertise' ? 'text-neutral-400' : ''
            }`}
          >
            EXPERTISE
          </button>

          <button
            id="nav-about-btn"
            onClick={() => setActiveDrawer('about')}
            className={`hover:text-neutral-400 transition-colors cursor-pointer py-1 px-1.5 ${
              activeDrawer === 'about' ? 'text-neutral-400' : ''
            }`}
          >
            ABOUT
          </button>

          <button
            id="nav-contact-btn"
            onClick={() => setActiveDrawer('contact')}
            className={`hover:text-neutral-400 transition-colors cursor-pointer py-1 px-1.5 ${
              activeDrawer === 'contact' ? 'text-neutral-400' : ''
            }`}
          >
            CONTACT
          </button>

          <span className="text-neutral-800 select-none" aria-hidden="true">
            /
          </span>

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={toggleSound}
            className="hover:text-neutral-400 transition-colors cursor-pointer flex items-center justify-center p-1.5 text-neutral-400 hover:text-white"
            aria-label={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
            title={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Code Blueprint Trigger */}
          <button
            id="nav-terminal-btn"
            onClick={() => setActiveDrawer('projects')}
            className="hover:text-neutral-400 transition-colors cursor-pointer flex items-center justify-center p-1.5"
            aria-label="View Code Projects"
            title="Projects & Architecture"
          >
            <Code2
              strokeWidth={1.5}
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
          </button>
        </nav>

        {/* Mobile Action Bar Trigger (<768px) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/90 text-neutral-400 hover:text-white"
            aria-label="Sound Toggle"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            id="mobile-quick-projects-btn"
            onClick={() => setActiveDrawer('projects')}
            className="px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 text-[11px] font-mono tracking-wider text-neutral-300 flex items-center gap-1.5"
            aria-label="Quick Projects"
          >
            <Code2 size={13} className="text-white" />
            <span>LABS</span>
          </button>

          <button
            id="mobile-menu-trigger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/90 text-white hover:border-neutral-600 transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown (<768px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden relative z-30 mx-4 sm:mx-6 mb-4 p-4 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-2 gap-2 text-xs font-mono tracking-wider uppercase text-neutral-300">
            <button
              onClick={() => {
                setActiveDrawer('projects');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-900 text-left cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>PROJECTS</span>
            </button>

            <button
              onClick={() => {
                setActiveDrawer('expertise');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-900 text-left cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>EXPERTISE</span>
            </button>

            <button
              onClick={() => {
                setActiveDrawer('about');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-900 text-left cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>ABOUT</span>
            </button>

            <button
              onClick={() => {
                setActiveDrawer('contact');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-900 text-left cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>CONTACT</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Section 1: Hero Section */}
      <section
        id="hero-main"
        className="relative z-10 min-h-[calc(100vh-100px)] flex flex-col justify-between"
      >
        <div
          className="flex-1 flex flex-col lg:flex-row justify-between items-center"
          style={{
            paddingInline: 'var(--pad-x)',
            paddingBlock: 'var(--main-py)',
          }}
        >
          {/* Left Headline Block */}
          <div
            id="hero-left-block"
            className="flex flex-col justify-center items-start w-full lg:max-w-4xl self-center lg:self-center"
          >
            {/* Top-Left Corner Bracket */}
            <div className="mb-2 text-white">
              <CornerBracketTL id="hero-tl-bracket" />
            </div>

            {/* Section Index Marker */}
            <div className="flex items-center gap-2 mb-3 text-neutral-400 font-mono text-[11px] tracking-[0.3em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>01 // ARCHITECTURAL CORE</span>
            </div>

            {/* Orbitron Headline */}
            <h1
              id="hero-headline"
              className="font-orbitron font-extrabold uppercase text-white tracking-[0.06em] sm:tracking-[0.08em] leading-[1.05]"
              style={{
                fontSize: 'var(--headline)',
              }}
            >
              <span className="block">SOFTWARE</span>
              <span className="block">SYSTEMS</span>
              <span className="inline-flex items-center flex-wrap gap-x-2 md:gap-x-4">
                <span>ENGINEER</span>
                <CheckerboardGrid />
              </span>
            </h1>

            {/* Supporting Editorial Line */}
            <p className="mt-4 text-neutral-300 font-light text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Turning complex codebases, multi-modal AI systems, and generative graphics into tactile digital reality.
            </p>

            {/* Bottom-Left Corner Bracket */}
            <div className="mt-2 text-white">
              <CornerBracketBL id="hero-bl-bracket" />
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 md:mt-8 flex items-center gap-3 sm:gap-4 flex-wrap w-full sm:w-auto">
              <button
                id="cta-projects-btn"
                onClick={() => setActiveDrawer('projects')}
                className="group inline-flex items-center justify-center border border-white bg-white text-black rounded-md uppercase font-jakarta font-semibold hover:bg-neutral-200 transition-all duration-200 cursor-pointer min-h-[44px] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                style={{
                  letterSpacing: '0.18em',
                  fontSize: 'var(--body)',
                  paddingInline: 'var(--btn-px)',
                  paddingBlock: 'var(--btn-py)',
                  gap: 'var(--btn-gap)',
                }}
              >
                <span>VIEW PROJECTS</span>
                <ArrowUpRight
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ width: 'var(--icon)', height: 'var(--icon)' }}
                  strokeWidth={2}
                />
              </button>

              <button
                id="cta-contact-btn"
                onClick={() => setActiveDrawer('contact')}
                className="inline-flex items-center justify-center uppercase font-jakarta font-medium text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer min-h-[44px] border border-neutral-800 rounded-md"
                style={{
                  letterSpacing: '0.18em',
                  fontSize: 'var(--body)',
                  paddingInline: 'var(--btn-px)',
                  paddingBlock: 'var(--btn-py)',
                }}
              >
                <span>GET IN TOUCH</span>
              </button>
            </div>
          </div>

          {/* Right Section with Architectural Feature Block */}
          <div
            id="hero-right-container"
            className="self-start sm:self-center lg:self-end flex flex-col justify-end items-start sm:items-center lg:items-end w-full lg:w-auto mt-8 lg:mt-0 relative z-20 pointer-events-auto"
          >
            <div
              id="hero-right-feature-block"
              className="self-start lg:self-end relative w-full sm:w-auto"
            >
              <div
                id="feature-framed-box"
                className="relative flex flex-col items-start"
                style={{
                  minWidth: 'var(--feature-min)',
                  padding: 'var(--feature-pad)',
                }}
              >
                <div className="absolute top-0 left-0 text-white">
                  <CornerBracketTL id="feature-corner-tl" />
                </div>
                <div className="absolute top-0 right-0 text-white">
                  <CornerBracketTR id="feature-corner-tr" />
                </div>
                <div className="absolute bottom-0 left-0 text-white">
                  <CornerBracketBL id="feature-corner-bl" />
                </div>
                <div className="absolute bottom-0 right-0 text-white">
                  <CornerBracketBR id="feature-corner-br" />
                </div>

                <div className="text-white mb-2 sm:mb-3">
                  <WireframeGlobe id="feature-wireframe-globe" />
                </div>

                <div
                  id="feature-tagline"
                  className="font-jakarta font-semibold uppercase text-white leading-snug"
                  style={{
                    letterSpacing: '0.16em',
                    fontSize: 'var(--body)',
                  }}
                >
                  <p>SCALABLE ARCHITECTURE.</p>
                  <p>BUILT FOR TOMORROW.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Indicator guiding down to Section 2 */}
        <div
          id="hero-scroll-guide"
          className="relative z-10 w-full flex items-center justify-between py-3.5 sm:py-4 border-t border-neutral-900 flex-wrap gap-2"
          style={{ paddingInline: 'var(--pad-x)' }}
        >
          <div className="flex items-center gap-2 text-neutral-500 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>PIYUSH · PORTFOLIO // 2026</span>
          </div>
          <button
            onClick={() => {
              const sec2 = document.getElementById('section-experience-sequence');
              sec2?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-colors cursor-pointer min-h-[32px]"
          >
            <span>SCROLL TO ENTER EXPERIENCE</span>
            <span className="animate-bounce">↓</span>
          </button>
        </div>

        <GradualBlur 
          position="bottom" 
          height="5.5rem" 
          strength={2} 
          curve="bezier" 
          divCount={6} 
          zIndex={5} 
        />
      </section>

      {/* 5. Section 2: Cinematic Scroll-Scrubbed Experience (The Builder - 150 Frames) */}
      <ExperienceSection totalFrames={150} />

      {/* 6. Section 3: AI Coding Skills & Inverted-U Orbital Universe */}
      <AICodingSkills />

      {/* 7. Section 4: Language System & Digital Knowledge Core */}
      <LanguageSkillsSection />

      {/* 8. Section 5: Editorial Projects Showcase */}
      <ProjectsSection
        onOpenDrawer={setActiveDrawer}
        onShowToast={showToast}
      />

      {/* 9. Section 6: About & Currently Building Initiatives */}
      <AboutSection onOpenDrawer={setActiveDrawer} />

      {/* 10. Section 7: Contact & Call to Action */}
      <ContactSection
        onOpenDrawer={setActiveDrawer}
        onShowToast={showToast}
      />

      {/* 11. Footer (Footer-16 Architecture) */}
      <Footer16 onOpenDrawer={setActiveDrawer} />

      {/* 12. Side Drawers (PROJECTS, EXPERTISE, ABOUT, CONTACT) */}
      <Drawers
        activeDrawer={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        onShowToast={showToast}
      />
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArrowUpRight, Check, Code2 } from 'lucide-react';
import { ImageRevealBackground, BG_IMAGE_1 } from './components/ImageRevealBackground';
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
import { Footer16 } from './components/Footer16';
import { GradualBlur } from './components/GradualBlur';

export default function App() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  return (
    <div
      id="lgpsm-portfolio-root"
      className="min-h-screen bg-black text-white font-jakarta flex flex-col relative overflow-x-hidden selection:bg-white selection:text-black"
    >
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
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-neutral-900 text-white px-4 py-3 rounded-md shadow-2xl border border-neutral-700 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={13} strokeWidth={2.5} />
          </div>
          <span className="font-jakarta text-xs tracking-wide font-medium">
            {toastMessage}
          </span>
        </div>
      )}

      {/* 3. Header */}
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center font-orbitron font-black text-white hover:opacity-80 transition-opacity cursor-pointer text-left"
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

        {/* Navigation */}
        <nav
          id="primary-nav"
          className="flex items-center font-jakarta font-medium uppercase text-white"
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
            className={`hover:opacity-50 transition-opacity cursor-pointer ${
              activeDrawer === 'projects' ? 'text-neutral-400' : ''
            }`}
          >
            PROJECTS
          </button>

          <button
            id="nav-expertise-btn"
            onClick={() => setActiveDrawer('expertise')}
            className={`hover:opacity-50 transition-opacity cursor-pointer ${
              activeDrawer === 'expertise' ? 'text-neutral-400' : ''
            }`}
          >
            EXPERTISE
          </button>

          <button
            id="nav-about-btn"
            onClick={() => setActiveDrawer('about')}
            className={`hover:opacity-50 transition-opacity cursor-pointer ${
              activeDrawer === 'about' ? 'text-neutral-400' : ''
            }`}
          >
            ABOUT
          </button>

          <button
            id="nav-contact-btn"
            onClick={() => setActiveDrawer('contact')}
            className={`hover:opacity-50 transition-opacity cursor-pointer ${
              activeDrawer === 'contact' ? 'text-neutral-400' : ''
            }`}
          >
            CONTACT
          </button>

          <span className="text-neutral-700 select-none" aria-hidden="true">
            |
          </span>

          <button
            id="nav-terminal-btn"
            onClick={() => setActiveDrawer('projects')}
            className="hover:opacity-50 transition-opacity cursor-pointer flex items-center justify-center p-1"
            aria-label="View Code Projects"
            title="Projects & Architecture"
          >
            <Code2
              strokeWidth={1.5}
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
          </button>
        </nav>
      </header>

      {/* 4. Main Hero Section */}
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
            className="flex flex-col justify-center items-start max-w-4xl self-center lg:self-center"
          >
            {/* Top-Left Corner Bracket */}
            <div className="mb-2 text-white">
              <CornerBracketTL id="hero-tl-bracket" />
            </div>

            {/* Orbitron Headline */}
            <h1
              id="hero-headline"
              className="font-orbitron font-extrabold uppercase text-white tracking-[0.08em] leading-[1.05]"
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

            {/* Bottom-Left Corner Bracket */}
            <div className="mt-2 text-white">
              <CornerBracketBL id="hero-bl-bracket" />
            </div>

            {/* CTA Button */}
            <div className="mt-6 md:mt-8 flex items-center gap-4 flex-wrap">
              <button
                id="cta-projects-btn"
                onClick={() => setActiveDrawer('projects')}
                className="group inline-flex items-center border border-neutral-600 rounded-md uppercase font-jakarta font-medium text-white hover:bg-white hover:text-black hover:border-white transition-all duration-200 cursor-pointer"
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
                  strokeWidth={1.5}
                />
              </button>

              <button
                id="cta-contact-btn"
                onClick={() => setActiveDrawer('contact')}
                className="inline-flex items-center uppercase font-jakarta font-medium text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
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
            className="self-center lg:self-end flex flex-col justify-end items-center lg:items-end w-full lg:w-auto mt-10 lg:mt-0 relative z-20 pointer-events-auto"
          >
            {/* Right Feature Block */}
            <div
              id="hero-right-feature-block"
              className="self-start lg:self-end relative"
            >
              {/* Framed box with 4 absolute corner brackets (no background card) */}
              <div
                id="feature-framed-box"
                className="relative flex flex-col items-start"
                style={{
                  minWidth: 'var(--feature-min)',
                  padding: 'var(--feature-pad)',
                }}
              >
                {/* Absolute Corners */}
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

                {/* Wireframe Globe SVG */}
                <div className="text-white mb-3">
                  <WireframeGlobe id="feature-wireframe-globe" />
                </div>

                {/* Tagline */}
                <div
                  id="feature-tagline"
                  className="font-jakarta font-semibold uppercase text-white leading-snug"
                  style={{
                    letterSpacing: '0.18em',
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
          className="relative z-10 w-full flex items-center justify-between py-4 border-t border-neutral-900"
          style={{ paddingInline: 'var(--pad-x)' }}
        >
          <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>PIYUSH · PORTFOLIO // 2026</span>
          </div>
          <button
            onClick={() => {
              const sec2 = document.getElementById('section-experience-sequence');
              sec2?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-white text-[11px] font-mono tracking-widest uppercase transition-colors cursor-pointer"
          >
            <span>SCROLL TO ENTER EXPERIENCE</span>
            <span className="animate-bounce">↓</span>
          </button>
        </div>

        {/* Gradual progressive blur at hero bottom leading smoothly into Experience Section */}
        <GradualBlur 
          position="bottom" 
          height="5.5rem" 
          strength={2} 
          curve="bezier" 
          divCount={6} 
          zIndex={5} 
        />
      </section>

      {/* 5. Section 2: Cinematic Scroll-Scrubbed Experience */}
      <ExperienceSection totalFrames={150} />

      {/* 6. Section 3: AI Coding Skills & Inverted-U Orbital Universe */}
      <AICodingSkills />

      {/* 7. Section 4: Language Skills & Glowing Particles Neural Core */}
      <LanguageSkillsSection />

      {/* 8. Footer (Footer-16 Architecture with Watermark Typography & Ambient Assets) */}
      <Footer16 onOpenDrawer={setActiveDrawer} />

      {/* 7. Side Drawers (PROJECTS, EXPERTISE, ABOUT, CONTACT) */}
      <Drawers
        activeDrawer={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        onShowToast={showToast}
      />
    </div>
  );
}

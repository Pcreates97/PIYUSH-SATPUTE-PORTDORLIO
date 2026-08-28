import React, { useState } from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check } from 'lucide-react';
import type { DrawerType } from './Drawers';

interface ContactSectionProps {
  onOpenDrawer?: (drawer: DrawerType) => void;
  onShowToast?: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenDrawer,
  onShowToast,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const EMAIL = 'piyushsatpute95102007@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    onShowToast?.('Email address copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="section-contact"
      className="relative w-full bg-black text-white py-28 sm:py-36 border-t border-neutral-900 overflow-hidden selection:bg-white selection:text-black"
      aria-label="Contact & Call to Action"
    >
      {/* Subtle Background Radial Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col items-start max-w-4xl">
          {/* Section Indicator */}
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>06 // INITIATE TRANSMISSION</span>
          </div>

          {/* Editorial Headline */}
          <h2 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-[0.95] mb-6">
            LET'S <br />
            BUILD <br />
            <span className="text-neutral-400">SOMETHING.</span>
          </h2>

          <p className="text-base sm:text-xl text-neutral-300 font-light max-w-xl leading-relaxed mb-10">
            Have an ambitious project, an AI concept, or a challenging system architecture? Let’s turn it into something real.
          </p>

          {/* Direct Email Action Pill */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a
              href={`mailto:${EMAIL}`}
              data-cursor="email"
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-black font-jakarta font-semibold text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              <Mail size={16} />
              <span>START A CONVERSATION</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-neutral-800 bg-neutral-950/80 hover:bg-neutral-900 font-mono text-xs text-neutral-300 uppercase tracking-wider transition-colors cursor-pointer"
              title="Copy Email Address"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'COPIED' : EMAIL}</span>
            </button>
          </div>

          {/* Social Links Bar */}
          <div className="pt-8 border-t border-neutral-900 w-full flex flex-wrap items-center justify-between gap-6 font-mono text-xs tracking-widest uppercase text-neutral-400">
            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
              >
                <Github size={14} />
                <span>GITHUB</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="linkedin"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
              >
                <Linkedin size={14} />
                <span>LINKEDIN</span>
              </a>

              <a
                href={`mailto:${EMAIL}`}
                data-cursor="email"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
              >
                <Mail size={14} />
                <span>EMAIL</span>
              </a>
            </div>

            <button
              onClick={() => onOpenDrawer?.('contact')}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              OPEN CONTACT TERMINAL →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

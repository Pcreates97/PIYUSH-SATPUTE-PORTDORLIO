import React, { useRef } from 'react';
import gsap from 'gsap';
import { ProgrammingLanguage } from './languageData';
import PulsatingBorder from '../originkit/ui/pulsating-border';

interface LanguageCardProps {
  language: ProgrammingLanguage;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const active = isSelected || isHovered;
  const cardRef = useRef<HTMLDivElement>(null);

  // High-contrast monochromatic border colors (pure black, white, and silver)
  const borderColors = React.useMemo(() => {
    return active
      ? ['#FFFFFF', '#E5E5E5', '#A3A3A3']
      : ['#525252', '#262626', '#171717'];
  }, [active]);

  // GSAP 3D Mouse Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: (x / rect.width) * 12,
      rotateX: -(y / rect.height) * 12,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 800,
      transformOrigin: 'center center',
    });
  };

  const handleMouseLeave = () => {
    onHover(false);
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  return (
    <div
      ref={cardRef}
      id={`language-card-${language.id}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md select-none will-change-transform ${
        active
          ? 'bg-neutral-950/95 border-white shadow-[0_0_30px_rgba(255,255,255,0.18)] translate-y-[-2px]'
          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900/90'
      }`}
      style={{ backgroundColor: '#050505' }}
    >
      {/* Originkit Pulsating Border Shader Layer */}
      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-visible">
        <PulsatingBorder
          colors={borderColors}
          speed={active ? 1.4 : 0.6}
          radius={18}
          thickness={active ? 4.5 : 2.0}
          softness={active ? 70 : 40}
          intensity={active ? 45 : 15}
          bloom={active ? 55 : 20}
          spotSize={active ? 60 : 40}
          spread={16}
        />
      </div>

      {/* Active Indicator Top Glow Line (Pure Monochromatic White) */}
      <div
        className="absolute top-0 left-4 right-4 h-[1.5px] transition-opacity duration-300 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, #FFFFFF, transparent)',
          opacity: active ? 1 : 0,
          boxShadow: '0 0 8px #FFFFFF',
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* Language Icon / Logo (Original icon untouched as requested) */}
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center p-2 shrink-0 border transition-transform duration-300 group-hover:scale-105 bg-black"
          style={{
            borderColor: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
            boxShadow: active ? '0 0 14px rgba(255, 255, 255, 0.25)' : 'none',
          }}
        >
          <img
            src={language.icon}
            alt=""
            className="w-full h-full object-contain filter drop-shadow"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide truncate group-hover:text-white">
              {language.name}
            </h4>
            <span className="font-mono text-[10px] sm:text-[11px] text-neutral-300 font-bold shrink-0">
              {language.proficiency}%
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border transition-colors ${
                active
                  ? 'border-white text-white bg-neutral-900 font-medium shadow-sm'
                  : 'border-neutral-800 text-neutral-400 bg-neutral-950'
              }`}
            >
              {language.category}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {language.experience}
            </span>
          </div>
        </div>
      </div>

      {/* Monochromatic Proficiency Progress Bar */}
      <div className="relative z-10 mt-3 w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-neutral-800">
        <div
          className="h-full rounded-full transition-all duration-500 bg-white"
          style={{
            width: `${language.proficiency}%`,
            boxShadow: active ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
          }}
        />
      </div>

      {/* Feature summary */}
      <div className="relative z-10 mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 font-light">
        <span className="truncate pr-2 text-neutral-300">{language.highlightFeature}</span>
        <span className="font-mono text-[10px] text-neutral-400 shrink-0">
          {language.projectsCount} Projects
        </span>
      </div>

      {/* Connector Pin Anchor on the card */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border transition-all duration-300 z-10 ${
          language.side === 'left' ? '-right-1.5' : '-left-1.5'
        } ${
          active
            ? 'scale-125 bg-white border-white shadow-[0_0_10px_#fff]'
            : 'bg-black border-neutral-700'
        }`}
      />
    </div>
  );
};


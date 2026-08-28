import React, { useRef } from 'react';
import gsap from 'gsap';
import { ProgrammingLanguage } from './languageData';

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: (x / rect.width) * 10,
      rotateX: -(y / rect.height) * 10,
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
      className={`group relative p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-xl select-none will-change-transform ${
        active
          ? 'bg-neutral-900/90 border-white shadow-[0_0_25px_rgba(255,255,255,0.15)] -translate-y-1'
          : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-600 hover:bg-neutral-900/70'
      }`}
    >
      {/* Specular Inner Highlight */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3">
        {/* Genuine Brand Asset */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center p-2 shrink-0 border transition-all duration-300 ${
            active ? 'border-white bg-black shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-105' : 'border-neutral-800 bg-neutral-900'
          }`}
        >
          <img
            src={language.icon}
            alt=""
            className="w-full h-full object-contain filter drop-shadow"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Name & Purpose */}
        <div className="flex flex-col min-w-0 pr-1">
          <span className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide truncate">
            {language.name}
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-400 uppercase truncate mt-0.5">
            {language.category}
          </span>
        </div>
      </div>
    </div>
  );
};

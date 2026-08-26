import React from 'react';
import { ProgrammingLanguage } from './languageData';
import { Sparkles } from 'lucide-react';

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

  return (
    <div
      id={`language-card-${language.id}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md select-none ${
        active
          ? 'bg-neutral-900/90 border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.15)] translate-y-[-2px]'
          : 'bg-neutral-950/70 border-white/10 hover:border-white/25 hover:bg-neutral-900/60'
      }`}
      style={{
        boxShadow: active ? `0 0 20px ${language.glowColor}` : undefined,
      }}
    >
      {/* Active Indicator Top Glow Line */}
      <div
        className="absolute top-0 left-4 right-4 h-[1px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${language.color}, transparent)`,
          opacity: active ? 1 : 0,
        }}
      />

      <div className="flex items-center gap-3">
        {/* Language Icon / Logo */}
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center p-2 shrink-0 border transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderColor: active ? language.color : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <img
            src={language.icon}
            alt={`${language.name} logo`}
            className="w-full h-full object-contain filter drop-shadow"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Fallback text if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide truncate group-hover:text-white">
              {language.name}
            </h4>
            <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 font-semibold shrink-0">
              {language.proficiency}%
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border"
              style={{
                borderColor: active ? language.color : 'rgba(255, 255, 255, 0.08)',
                color: active ? '#ffffff' : '#a3a3a3',
                backgroundColor: active ? `${language.glowColor}` : 'rgba(0, 0, 0, 0.3)',
              }}
            >
              {language.category}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {language.experience}
            </span>
          </div>
        </div>
      </div>

      {/* Proficiency Progress Bar */}
      <div className="mt-3 w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${language.proficiency}%`,
            backgroundColor: language.color,
            boxShadow: active ? `0 0 8px ${language.color}` : 'none',
          }}
        />
      </div>

      {/* Feature summary */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="truncate pr-2">{language.highlightFeature}</span>
        <span className="font-mono text-[10px] text-neutral-400 shrink-0">
          {language.projectsCount} Projects
        </span>
      </div>

      {/* Connector Pin Anchor on the card */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
          language.side === 'left' ? '-right-1.5' : '-left-1.5'
        } ${
          active
            ? 'scale-125 bg-white border-white shadow-[0_0_10px_#fff]'
            : 'bg-neutral-900 border-neutral-600'
        }`}
      />
    </div>
  );
};

import React, { forwardRef } from 'react';
import type { SkillItem } from './skillData';

interface SkillCardProps {
  skill: SkillItem;
  className?: string;
}

export const SkillCard = forwardRef<HTMLDivElement, SkillCardProps>(
  ({ skill, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        id={`skill-card-${skill.id}`}
        className={`absolute top-0 left-0 pointer-events-none select-none will-change-transform ${className}`}
        style={{
          transformOrigin: 'center center',
        }}
      >
        <div
          className="relative flex items-center gap-3 px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl border border-white/15 bg-neutral-900/60 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] min-w-[130px] sm:min-w-[155px] max-w-[190px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(10,10,10,0.7)',
            boxShadow:
              '0 16px 36px -8px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 12px rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Subtle Ambient Corner Accent */}
          <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-white/40" />

          {/* Genuine Brand Logo Container with full color preservation */}
          <div className="relative shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center p-1 shadow-inner">
            <img
              src={skill.asset}
              alt={skill.name}
              className="w-full h-full object-contain rounded select-none pointer-events-none"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Technology Label & Category */}
          <div className="flex flex-col min-w-0 pr-1">
            <span className="font-jakarta text-xs sm:text-sm font-bold text-white tracking-wide truncate leading-tight">
              {skill.name}
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] font-medium tracking-wider text-neutral-400 uppercase truncate mt-0.5">
              {skill.category}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

SkillCard.displayName = 'SkillCard';

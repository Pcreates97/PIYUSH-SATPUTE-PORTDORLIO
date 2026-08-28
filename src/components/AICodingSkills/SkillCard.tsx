import React, { forwardRef, useState } from 'react';
import type { SkillItem } from './skillData';
import { Cpu } from 'lucide-react';

interface SkillCardProps {
  skill: SkillItem;
  className?: string;
}

export const SkillCard = forwardRef<HTMLDivElement, SkillCardProps>(
  ({ skill, className = '' }, ref) => {
    const [hasError, setHasError] = useState(false);

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
          className="relative flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/15 bg-neutral-900/80 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] min-w-[110px] sm:min-w-[150px] max-w-[185px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%), rgba(10,10,10,0.85)',
            boxShadow:
              '0 16px 36px -8px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 0 12px rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Subtle Ambient Corner Accent */}
          <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-white/40" />

          {/* Genuine Brand Logo Container with full color & shape preservation */}
          <div className="relative shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden bg-black/80 border border-white/15 flex items-center justify-center p-1 shadow-inner">
            {!hasError ? (
              <img
                src={skill.asset}
                alt=""
                className="w-full h-full object-contain rounded select-none pointer-events-none"
                loading="eager"
                decoding="async"
                onError={() => setHasError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5 text-white font-mono text-[9px] sm:text-[10px] font-bold">
                <Cpu size={14} className="text-neutral-300" />
              </div>
            )}
          </div>

          {/* Technology Label & Category */}
          <div className="flex flex-col min-w-0 pr-0.5 sm:pr-1">
            <span className="font-jakarta text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide truncate leading-tight">
              {skill.name}
            </span>
            <span className="font-mono text-[7.5px] sm:text-[8.5px] md:text-[9px] font-medium tracking-wider text-neutral-400 uppercase truncate mt-0.5">
              {skill.category}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

SkillCard.displayName = 'SkillCard';


import React from 'react';
import { ProgrammingLanguage } from './languageData';

export interface CardCoord {
  id: string;
  x: number; // in pixels relative to container
  y: number;
}

interface ConnectionLinesProps {
  cardCoords: Record<string, CardCoord>;
  centerCoord: { x: number; y: number } | null;
  languages: ProgrammingLanguage[];
  activeId: string | null;
  hoveredId: string | null;
  containerWidth: number;
  containerHeight: number;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  cardCoords,
  centerCoord,
  languages,
  activeId,
  hoveredId,
  containerWidth,
  containerHeight,
}) => {
  if (!centerCoord || containerWidth <= 0 || containerHeight <= 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="laser-glow-bright" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Central Core Ambient Ring */}
        <radialGradient id="center-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Hub Ring */}
      <circle
        cx={centerCoord.x}
        cy={centerCoord.y}
        r={36}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="animate-[spin_40s_linear_infinite]"
        style={{ transformOrigin: `${centerCoord.x}px ${centerCoord.y}px` }}
      />
      <circle
        cx={centerCoord.x}
        cy={centerCoord.y}
        r={24}
        fill="url(#center-node-glow)"
      />

      {/* Connecting Beams to each language card */}
      {languages.map((lang) => {
        const coord = cardCoords[lang.id];
        if (!coord) return null;

        const isHighlighted = lang.id === activeId || lang.id === hoveredId;

        // Control point for smooth curved cyber-traces
        const deltaX = centerCoord.x - coord.x;
        const cp1X = coord.x + deltaX * 0.45;
        const cp1Y = coord.y;
        const cp2X = coord.x + deltaX * 0.55;
        const cp2Y = centerCoord.y;

        const pathD = `M ${coord.x} ${coord.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${centerCoord.x} ${centerCoord.y}`;

        return (
          <g key={lang.id} className="transition-opacity duration-300">
            {/* Base Background Track Line */}
            <path
              d={pathD}
              fill="none"
              stroke={isHighlighted ? lang.color : 'rgba(255, 255, 255, 0.12)'}
              strokeWidth={isHighlighted ? 2.2 : 1}
              strokeDasharray={isHighlighted ? 'none' : '3 3'}
              opacity={isHighlighted ? 0.9 : 0.4}
              filter={isHighlighted ? 'url(#laser-glow)' : undefined}
            />

            {/* Glowing Traveling Pulse Dash when highlighted */}
            {isHighlighted && (
              <path
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2.8}
                strokeDasharray="16 120"
                className="animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                filter="url(#laser-glow-bright)"
              />
            )}

            {/* Connector Node at Card End */}
            <circle
              cx={coord.x}
              cy={coord.y}
              r={isHighlighted ? 4 : 2.5}
              fill={isHighlighted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
              filter={isHighlighted ? 'url(#laser-glow)' : undefined}
            />

            {/* Connector Node at Core End */}
            <circle
              cx={centerCoord.x}
              cy={centerCoord.y}
              r={isHighlighted ? 3 : 2}
              fill={isHighlighted ? lang.color : 'rgba(255, 255, 255, 0.4)'}
            />
          </g>
        );
      })}
    </svg>
  );
};

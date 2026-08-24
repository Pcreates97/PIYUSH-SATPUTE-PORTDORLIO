import React from 'react';

// Corner Brackets (viewBox 0 0 12 12, stroke 1.5)
export function CornerBracketTL({ className = '', id = 'corner-tl' }: { className?: string; id?: string }) {
  return (
    <svg
      id={id}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={{ width: 'var(--corner)', height: 'var(--corner)' }}
      aria-hidden="true"
    >
      <path d="M0 11.5V0.5H11.5" />
    </svg>
  );
}

export function CornerBracketTR({ className = '', id = 'corner-tr' }: { className?: string; id?: string }) {
  return (
    <svg
      id={id}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={{ width: 'var(--corner)', height: 'var(--corner)' }}
      aria-hidden="true"
    >
      <path d="M0.5 0.5H11.5V11.5" />
    </svg>
  );
}

export function CornerBracketBL({ className = '', id = 'corner-bl' }: { className?: string; id?: string }) {
  return (
    <svg
      id={id}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={{ width: 'var(--corner)', height: 'var(--corner)' }}
      aria-hidden="true"
    >
      <path d="M0 0.5V11.5H11.5" />
    </svg>
  );
}

export function CornerBracketBR({ className = '', id = 'corner-br' }: { className?: string; id?: string }) {
  return (
    <svg
      id={id}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={{ width: 'var(--corner)', height: 'var(--corner)' }}
      aria-hidden="true"
    >
      <path d="M0.5 11.5H11.5V0.5" />
    </svg>
  );
}

// Inline Checkerboard Grid SVG (viewBox 0 0 36 18, 4 rows of 3.8×3.8 black squares; even rows shifted by 2.25)
export function CheckerboardGrid({ className = '', id = 'checkerboard-svg' }: { className?: string; id?: string }) {
  const row0and2 = [0, 4.5, 9, 13.5, 18, 22.5, 27, 31.5];
  const row1and3 = [2.25, 6.75, 11.25, 15.75, 20.25, 24.75, 29.25, 33.75];

  return (
    <svg
      id={id}
      viewBox="0 0 36 18"
      className={`inline-block translate-y-[2px] ${className}`}
      style={{ width: 'var(--checker-w)', height: 'var(--checker-h)' }}
      aria-hidden="true"
    >
      {/* Row 0 */}
      {row0and2.map((x, i) => (
        <rect key={`r0-${i}`} x={x} y="0.5" width="3.8" height="3.8" fill="currentColor" />
      ))}
      {/* Row 1 (even row index 1 shifted by 2.25) */}
      {row1and3.map((x, i) => (
        <rect key={`r1-${i}`} x={x} y="5" width="3.8" height="3.8" fill="currentColor" />
      ))}
      {/* Row 2 */}
      {row0and2.map((x, i) => (
        <rect key={`r2-${i}`} x={x} y="9.5" width="3.8" height="3.8" fill="currentColor" />
      ))}
      {/* Row 3 */}
      {row1and3.map((x, i) => (
        <rect key={`r3-${i}`} x={x} y="14" width="3.8" height="3.8" fill="currentColor" />
      ))}
    </svg>
  );
}

// Wireframe Globe SVG (viewBox 0 0 64 64, stroke 1.2: outer circle r=28, equator line, 2 horizontal ellipses, meridian line, 2 vertical ellipses)
export function WireframeGlobe({ className = '', id = 'wireframe-globe-svg' }: { className?: string; id?: string }) {
  return (
    <svg
      id={id}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      style={{ width: 'var(--globe)', height: 'var(--globe)' }}
      aria-hidden="true"
    >
      {/* Outer Circle */}
      <circle cx="32" cy="32" r="28" />
      {/* Equator */}
      <line x1="4" y1="32" x2="60" y2="32" />
      {/* 2 Horizontal Ellipses */}
      <ellipse cx="32" cy="32" rx="28" ry="14" />
      <ellipse cx="32" cy="32" rx="28" ry="22" />
      {/* Meridian Line */}
      <line x1="32" y1="4" x2="32" y2="60" />
      {/* 2 Vertical Ellipses */}
      <ellipse cx="32" cy="32" rx="14" ry="28" />
      <ellipse cx="32" cy="32" rx="22" ry="28" />
    </svg>
  );
}

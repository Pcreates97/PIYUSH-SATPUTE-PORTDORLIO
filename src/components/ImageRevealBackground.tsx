import { useEffect, useRef, useState } from 'react';
import bgImage1 from '../assets/hero-bg-1.png';
import bgImage2 from '../assets/hero-bg-2.png';

const BG_IMAGE_1 = bgImage1;
const BG_IMAGE_2 = bgImage2;

export function ImageRevealBackground() {
  const revealRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);

  const mouseRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400 });
  const smoothRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });

  const [gridCellSize, setGridCellSize] = useState(48);

  useEffect(() => {
    const handleResize = () => {
      const cell = Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028)));
      setGridCellSize(cell);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let animFrameId: number;

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Ease cursor position
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;

      // 2. Compute radius
      const radius = Math.round(Math.min(420, Math.max(120, width * 0.22)));
      const cx = smoothRef.current.x.toFixed(1);
      const cy = smoothRef.current.y.toFixed(1);

      // 3. Direct hardware-accelerated CSS radial mask gradient
      if (revealRef.current) {
        const maskGradient = `radial-gradient(circle ${radius}px at ${cx}px ${cy}px, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0) 100%)`;
        revealRef.current.style.maskImage = maskGradient;
        revealRef.current.style.webkitMaskImage = maskGradient;
      }

      // 4. Parallax grid offset
      const normX = width > 0 ? smoothRef.current.x / width - 0.5 : 0;
      const normY = height > 0 ? smoothRef.current.y / height - 0.5 : 0;

      gridOffsetRef.current.x += (normX * 16 - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (normY * 16 - gridOffsetRef.current.y) * 0.06;

      if (patternRef.current) {
        patternRef.current.setAttribute('x', gridOffsetRef.current.x.toFixed(2));
        patternRef.current.setAttribute('y', gridOffsetRef.current.y.toFixed(2));
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      id="image-reveal-bg-root"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Base Layer */}
      <div
        id="bg-base-layer"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 lg:opacity-100"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* 2. Reveal Layer (Clipped by offscreen canvas mask) */}
      <div
        id="bg-reveal-layer"
        ref={revealRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE_2})` }}
      />

      {/* 3. Subtle Parallax Grid Overlay */}
      <svg
        id="bg-grid-overlay"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.1 }}
      >
        <defs>
          <pattern
            id="lgpsm-grid-pattern"
            ref={patternRef}
            width={gridCellSize}
            height={gridCellSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridCellSize} 0 L 0 0 0 ${gridCellSize}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgpsm-grid-pattern)" />
      </svg>

      {/* Mobile/Tablet Dark Scrim Overlay to ensure optimal text contrast */}
      <div className="absolute inset-0 bg-black/40 lg:bg-transparent pointer-events-none" />
    </div>
  );
}

export { BG_IMAGE_1, BG_IMAGE_2 };

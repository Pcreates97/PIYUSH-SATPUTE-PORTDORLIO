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

    window.addEventListener('mousemove', handleMouseMove);

    // Create offscreen canvas for spotlight mask
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let animFrameId: number;

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // 1. Ease cursor position
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;

      // 2. Compute radius
      const radius = Math.round(Math.min(420, Math.max(160, width * 0.16)));

      // 3. Draw radial gradient on canvas
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        const cx = smoothRef.current.x;
        const cy = smoothRef.current.y;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.4, 'rgba(255,255,255,1)');
        grad.addColorStop(0.6, 'rgba(255,255,255,0.75)');
        grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const maskDataUrl = canvas.toDataURL();
        if (revealRef.current) {
          revealRef.current.style.maskImage = `url(${maskDataUrl})`;
          revealRef.current.style.webkitMaskImage = `url(${maskDataUrl})`;
          revealRef.current.style.maskSize = '100% 100%';
          revealRef.current.style.webkitMaskSize = '100% 100%';
        }
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
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      id="desktop-image-reveal-bg"
      className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Base Layer */}
      <div
        id="bg-base-layer"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
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
    </div>
  );
}

export { BG_IMAGE_1, BG_IMAGE_2 };

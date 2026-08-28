import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if primary pointer is coarse (touch device)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for interactive targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, [data-cursor], [role="button"]');
        if (interactive) {
          setIsHovered(true);
          const customLabel = interactive.getAttribute('data-cursor');
          if (customLabel) {
            setCursorText(customLabel.toUpperCase());
          } else {
            setCursorText('');
          }
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      // Smooth ring lerp
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  return (
    <div
      id="custom-cursor-root"
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } hidden md:block`}
      aria-hidden="true"
    >
      {/* Center Small Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-200 pointer-events-none mix-blend-difference"
      />

      {/* Trailing Ring / Interactive Bubble */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border pointer-events-none transition-[width,height,background-color,border-color] duration-200 ${
          cursorText
            ? 'w-16 h-16 bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
            : isHovered
            ? 'w-10 h-10 bg-white/10 border-white/40 backdrop-blur-[1px]'
            : 'w-6 h-6 bg-transparent border-white/25'
        }`}
      >
        {cursorText && (
          <span
            ref={cursorLabelRef}
            className="font-mono text-[9px] font-bold tracking-widest text-black uppercase select-none animate-in fade-in zoom-in-90 duration-150"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};

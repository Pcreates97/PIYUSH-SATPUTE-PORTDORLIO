import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageSequenceCanvas, ImageSequenceCanvasHandle } from './ImageSequenceCanvas';
import { ExperienceCards, ExperienceCardsHandle } from './ExperienceCards';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionProps {
  totalFrames?: number;
}

export function ExperienceSection({ totalFrames = 150 }: ExperienceSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasHandleRef = useRef<ImageSequenceCanvasHandle | null>(null);
  const cardsHandleRef = useRef<ExperienceCardsHandle | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check accessibility motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // GSAP ScrollTrigger Master Timeline - 100% Zero React Re-render Scrubbing
  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;

    let lastRenderedFrame = -1;

    const ctx = gsap.context(() => {
      // 1. Create scrubbed timeline for cards with hardware-accelerated transforms
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          pin: sticky,
          pinSpacing: true,
          scrub: 0.35, // Buttery smooth scrubbing with natural physics damping
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            const p = self.progress;
            const targetFrame = Math.min(
              totalFrames - 1,
              Math.max(0, Math.floor(p * (totalFrames - 1)))
            );

            // Fast frame render update
            if (targetFrame !== lastRenderedFrame) {
              lastRenderedFrame = targetFrame;
              canvasHandleRef.current?.renderFrame(targetFrame);
            }

            // Direct telemetry HUD update (zero React reconciliation)
            cardsHandleRef.current?.updateTelemetry(p, targetFrame);
          },
        },
      });

      // Section 01: IDENTITY (Left-aligned, 0.07 to 0.25)
      tl.fromTo(
        '#experience-card-01',
        { autoAlpha: 0, x: -35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.07
      ).to(
        '#experience-card-01',
        { autoAlpha: 0, x: -25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.22
      );

      // Section 02: JOURNEY (Right-aligned, 0.26 to 0.45)
      tl.fromTo(
        '#experience-card-02',
        { autoAlpha: 0, x: 35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.26
      ).to(
        '#experience-card-02',
        { autoAlpha: 0, x: 25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.42
      );

      // Section 03: TECH STACK (Left-aligned, 0.46 to 0.65)
      tl.fromTo(
        '#experience-card-03',
        { autoAlpha: 0, x: -35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.46
      ).to(
        '#experience-card-03',
        { autoAlpha: 0, x: -25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.62
      );

      // Section 04: AI & SYSTEMS (Right-aligned, 0.66 to 0.83)
      tl.fromTo(
        '#experience-card-04',
        { autoAlpha: 0, x: 35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.66
      ).to(
        '#experience-card-04',
        { autoAlpha: 0, x: 25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.80
      );

      // Section 05: MANIFESTO (Centered, 0.84 to 0.98)
      tl.fromTo(
        '#experience-card-05',
        { autoAlpha: 0, y: 35, scale: 0.95, pointerEvents: 'none' },
        { autoAlpha: 1, y: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.84
      ).to(
        '#experience-card-05',
        { autoAlpha: 0, y: -20, scale: 1.02, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.96
      );
    }, container);

    // Trigger recalculation after layout has settled
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, [totalFrames]);

  return (
    <section
      id="section-experience-sequence"
      ref={containerRef}
      className="relative w-full bg-black text-white selection:bg-white selection:text-black"
      style={{
        // 600vh scroll height delivers silky-smooth scrubbing through 150 frames with zero lag
        height: prefersReducedMotion ? 'auto' : '600vh',
      }}
      aria-label="Section 2: Experience & Spatial Identity Sequence"
    >
      {/* Pinned Cinematic 100vw x 100vh Viewport */}
      <div
        id="experience-sticky-stage"
        ref={stickyRef}
        className="w-full h-screen overflow-hidden z-10 flex items-center justify-center bg-black relative"
      >
        {/* 1. Ultra-High Performance Image Sequence Canvas with hardware decoding & RAF scheduler */}
        <ImageSequenceCanvas
          ref={canvasHandleRef}
          totalFrames={totalFrames}
          initialFrame={0}
        />

        {/* 2. Glassmorphic Information Panels & HUD Overlay */}
        <ExperienceCards
          ref={cardsHandleRef}
          totalFrames={totalFrames}
        />
      </div>
    </section>
  );
}

export default ExperienceSection;

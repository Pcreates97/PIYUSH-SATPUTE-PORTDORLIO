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

    // Immediately synchronize HUD telemetry and initial frame on component startup
    cardsHandleRef.current?.updateTelemetry(0, 0);
    canvasHandleRef.current?.renderFrame(0);

    const ctx = gsap.context(() => {
      const frameTracker = { frame: 0 };
      let lastRenderedFrame = -1;

      // 1. Create scrubbed master timeline with fluid physics damping
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          pin: sticky,
          pinSpacing: true,
          scrub: 0.4, // Silky smooth Apple-style inertia scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 2. Timeline Frame Tween seamlessly driving canvas blitting
      tl.to(
        frameTracker,
        {
          frame: totalFrames - 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            const curFrame = Math.min(
              totalFrames - 1,
              Math.max(0, Math.round(frameTracker.frame))
            );
            if (curFrame !== lastRenderedFrame) {
              lastRenderedFrame = curFrame;
              canvasHandleRef.current?.renderFrame(curFrame);
            }
            const curProgress = curFrame / (totalFrames - 1);
            cardsHandleRef.current?.updateTelemetry(curProgress, curFrame);
          },
        },
        0
      );

      // Section 01: IDENTITY (Left-aligned, visible on entry 0.00 to 0.20)
      tl.fromTo(
        '#experience-card-01',
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', duration: 0.01 },
        0
      ).to(
        '#experience-card-01',
        { autoAlpha: 0, x: -25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.18
      );

      // Section 02: JOURNEY (Right-aligned, 0.22 to 0.42)
      tl.fromTo(
        '#experience-card-02',
        { autoAlpha: 0, x: 35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.22
      ).to(
        '#experience-card-02',
        { autoAlpha: 0, x: 25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.39
      );

      // Section 03: TECH STACK (Left-aligned, 0.43 to 0.63)
      tl.fromTo(
        '#experience-card-03',
        { autoAlpha: 0, x: -35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.43
      ).to(
        '#experience-card-03',
        { autoAlpha: 0, x: -25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.60
      );

      // Section 04: AI & SYSTEMS (Right-aligned, 0.64 to 0.82)
      tl.fromTo(
        '#experience-card-04',
        { autoAlpha: 0, x: 35, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.64
      ).to(
        '#experience-card-04',
        { autoAlpha: 0, x: 25, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.79
      );

      // Section 05: MANIFESTO (Centered, 0.83 to 0.98)
      tl.fromTo(
        '#experience-card-05',
        { autoAlpha: 0, y: 35, scale: 0.95, pointerEvents: 'none' },
        { autoAlpha: 1, y: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.83
      ).to(
        '#experience-card-05',
        { autoAlpha: 0, y: -20, scale: 1.02, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.96
      );
    }, container);

    // Trigger recalculation after layout has settled
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
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
        height: '600vh',
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

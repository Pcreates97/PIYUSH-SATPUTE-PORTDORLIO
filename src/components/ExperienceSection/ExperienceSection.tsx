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
  const blackoutRef = useRef<HTMLDivElement | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check accessibility motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // GSAP ScrollTrigger Master Timeline
  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;

    cardsHandleRef.current?.updateTelemetry(0, 0);
    canvasHandleRef.current?.renderFrame(0);

    const ctx = gsap.context(() => {
      const frameTracker = { frame: 0 };
      let lastRenderedFrame = -1;

      // 1. Create scrubbed master timeline with physical damping
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          pin: sticky,
          pinSpacing: true,
          scrub: 0.35,
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

      // Section 01: IDENTITY (Left-aligned, visible 0.00 to 0.18)
      tl.fromTo(
        '#experience-card-01',
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', duration: 0.01 },
        0
      ).to(
        '#experience-card-01',
        { autoAlpha: 0, x: -20, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.16
      );

      // Section 02: JOURNEY (Right-aligned, 0.20 to 0.38)
      tl.fromTo(
        '#experience-card-02',
        { autoAlpha: 0, x: 25, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.20
      ).to(
        '#experience-card-02',
        { autoAlpha: 0, x: 20, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.36
      );

      // Section 03: WHAT I CODE (Left-aligned, 0.39 to 0.58)
      tl.fromTo(
        '#experience-card-03',
        { autoAlpha: 0, x: -25, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.39
      ).to(
        '#experience-card-03',
        { autoAlpha: 0, x: -20, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.55
      );

      // Section 04: BUILDING WITH AI (Right-aligned, 0.59 to 0.77)
      tl.fromTo(
        '#experience-card-04',
        { autoAlpha: 0, x: 25, scale: 0.98, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.59
      ).to(
        '#experience-card-04',
        { autoAlpha: 0, x: 20, scale: 0.98, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.75
      );

      // Section 05: MANIFESTO (Centered, 0.78 to 0.92)
      tl.fromTo(
        '#experience-card-05',
        { autoAlpha: 0, y: 25, scale: 0.96, pointerEvents: 'none' },
        { autoAlpha: 1, y: 0, scale: 1, pointerEvents: 'auto', ease: 'power2.out', duration: 0.05 },
        0.78
      ).to(
        '#experience-card-05',
        { autoAlpha: 0, y: -15, scale: 1.02, pointerEvents: 'none', ease: 'power2.in', duration: 0.04 },
        0.90
      );

      // Final Transition to Blackness (0.88 -> 1.0): Camera finishes -> darkness increases -> clean world transition
      if (blackoutRef.current) {
        tl.fromTo(
          blackoutRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.inOut', duration: 0.12 },
          0.88
        );
      }
    }, container);

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
        height: '600vh',
      }}
      aria-label="Section 2: The Builder Sequence"
    >
      {/* Pinned Cinematic 100vw x 100vh Viewport */}
      <div
        id="experience-sticky-stage"
        ref={stickyRef}
        className="w-full h-screen overflow-hidden z-10 flex items-center justify-center bg-black relative"
      >
        {/* 1. Ultra-High Performance Image Sequence Canvas */}
        <ImageSequenceCanvas
          ref={canvasHandleRef}
          totalFrames={totalFrames}
          initialFrame={0}
        />

        {/* 2. Glassmorphic Liquid Information Panels & HUD Overlay */}
        <ExperienceCards
          ref={cardsHandleRef}
          totalFrames={totalFrames}
        />

        {/* 3. Smooth Blackout Scrim leading into Section 3 */}
        <div
          ref={blackoutRef}
          className="absolute inset-0 bg-black pointer-events-none z-30 opacity-0"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

export default ExperienceSection;

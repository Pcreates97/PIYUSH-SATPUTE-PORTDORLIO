import React, { useRef, useEffect } from 'react';
import { SKILL_ITEMS } from './skillData';
import { SkillCard } from './SkillCard';

interface SkillOrbitProps {
  // Speed of the orbital loop (cycles per second, default ~0.035 -> ~28s per full loop)
  speed?: number;
  isPaused?: boolean;
}

export const SkillOrbit: React.FC<SkillOrbitProps> = ({ speed = 0.036, isPaused = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          width = entry.contentRect.width || window.innerWidth;
          height = entry.contentRect.height || window.innerHeight;
        }
      }
    });

    resizeObserver.observe(container);

    const count = SKILL_ITEMS.length;

    // Continuous GPU-accelerated 60/120fps Animation Loop
    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      // Clamp delta time to avoid frame spikes during tab switching or backgrounding
      const rawDelta = (currentTime - lastTimeRef.current) / 1000;
      const deltaTime = Math.min(rawDelta, 0.05);
      lastTimeRef.current = currentTime;

      if (!isPaused) {
        // Continuous smooth advancement wrapped in [0, 1)
        offsetRef.current = (offsetRef.current + deltaTime * speed) % 1.0;
      }

      const currentOffset = offsetRef.current;
      const isMobile = width < 640;

      // Trajectory bounds: smoothly enters from left offscreen, exits right offscreen
      const offscreenPad = isMobile ? 140 : 180;
      const startX = -offscreenPad;
      const endX = width + offscreenPad;
      const cardHalfWidth = isMobile ? 60 : 75;
      const cardHalfHeight = isMobile ? 20 : 26;

      // Arch apex & base heights
      const apexY = isMobile ? height * 0.14 : height * 0.10;
      const baseY = isMobile ? height * 0.74 : height * 0.72;

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const skill = SKILL_ITEMS[i];

        // Continuous uniform phase for each of the 16 cards around the circle [0, 1)
        // Adding 1.0 before modulo guarantees non-negative wrapping
        const u = ((i / count + currentOffset) % 1.0 + 1.0) % 1.0;

        // 1. Horizontal Position (Left -> Right along full track)
        const rawX = startX + (endX - startX) * u;

        // 2. Inverted-U Arch Path (Symmetric smooth parabolic curve peaking at u = 0.5)
        const archFactor = Math.sin(u * Math.PI);
        const rawY = baseY - (baseY - apexY) * Math.pow(archFactor, 0.9);

        // 3. Smooth Opacity & Scale Transitions
        let opacity = 1;
        let scale = 1;

        // Smooth fade-in on entrance (u: 0.0 -> 0.10)
        if (u < 0.10) {
          const ratio = Math.max(0, u / 0.10);
          opacity = ratio;
          scale = 0.80 + 0.20 * ratio;
        }
        // Smooth fade-out on exit (u: 0.90 -> 1.00)
        else if (u > 0.90) {
          const ratio = Math.max(0, (1 - u) / 0.10);
          opacity = ratio;
          scale = 0.80 + 0.20 * ratio;
        }
        // Peak arch prominence
        else {
          const apexProminence = Math.sin(u * Math.PI);
          scale = 0.95 + apexProminence * 0.08;
        }

        // Depth tier adjustments
        let tierScaleMult = 1.0;
        let zIndex = 20;

        if (skill.depthTier === 'front') {
          tierScaleMult = 1.06;
          zIndex = 30; // In front of character
        } else if (skill.depthTier === 'back') {
          tierScaleMult = 0.92;
          opacity *= 0.85;
          zIndex = 8; // Behind character
        }

        const finalScale = scale * tierScaleMult;
        // Smooth banking angle following the arch curvature
        const tangentTilt = (u - 0.5) * 16;

        const targetX = rawX - cardHalfWidth;
        const targetY = rawY - cardHalfHeight;

        el.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0px) scale(${finalScale.toFixed(3)}) rotateZ(${tangentTilt.toFixed(1)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(zIndex);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [speed, isPaused]);

  return (
    <div
      id="skill-orbit-container"
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
    >
      {SKILL_ITEMS.map((skill, idx) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
        />
      ))}
    </div>
  );
};


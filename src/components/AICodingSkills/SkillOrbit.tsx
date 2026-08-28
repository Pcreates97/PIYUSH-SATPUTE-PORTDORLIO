import React, { useRef, useEffect } from 'react';
import { SKILL_ITEMS } from './skillData';
import { SkillCard } from './SkillCard';

interface SkillOrbitProps {
  scrollProgress?: number;
  speed?: number;
}

export const SkillOrbit: React.FC<SkillOrbitProps> = ({ scrollProgress = 0, speed = 0.032 }) => {
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

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const rawDelta = (currentTime - lastTimeRef.current) / 1000;
      const deltaTime = Math.min(rawDelta, 0.05);
      lastTimeRef.current = currentTime;

      // Base continuous advancement + scroll-induced traversal
      offsetRef.current = (offsetRef.current + deltaTime * speed) % 1.0;
      const currentOffset = (offsetRef.current + scrollProgress * 1.5) % 1.0;

      const isMobile = width < 640;
      const offscreenPad = isMobile ? 120 : 180;
      const startX = -offscreenPad;
      const endX = width + offscreenPad;
      const cardHalfWidth = isMobile ? 55 : 75;
      const cardHalfHeight = isMobile ? 18 : 25;

      const apexY = isMobile ? height * 0.16 : height * 0.12;
      const baseY = isMobile ? height * 0.74 : height * 0.72;

      // Global density / opacity multiplier based on section scroll progress:
      // 0.00 -> 0.15: Fade in from darkness
      // 0.15 -> 0.75: Full living ecosystem
      // 0.75 -> 0.95: Dissolve ecosystem towards central character
      let globalEcoOpacity = 1;
      if (scrollProgress < 0.15) {
        globalEcoOpacity = scrollProgress / 0.15;
      } else if (scrollProgress > 0.75) {
        globalEcoOpacity = Math.max(0, (0.95 - scrollProgress) / 0.20);
      }

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const skill = SKILL_ITEMS[i];
        const u = ((i / count + currentOffset) % 1.0 + 1.0) % 1.0;

        const rawX = startX + (endX - startX) * u;
        const archFactor = Math.sin(u * Math.PI);
        const rawY = baseY - (baseY - apexY) * Math.pow(archFactor, 0.9) * skill.archHeightRatio;

        let opacity = 1;
        let scale = 1;

        if (u < 0.10) {
          const ratio = Math.max(0, u / 0.10);
          opacity = ratio;
          scale = 0.80 + 0.20 * ratio;
        } else if (u > 0.90) {
          const ratio = Math.max(0, (1 - u) / 0.10);
          opacity = ratio;
          scale = 0.80 + 0.20 * ratio;
        } else {
          const apexProminence = Math.sin(u * Math.PI);
          scale = 0.95 + apexProminence * 0.08;
        }

        let tierScaleMult = 1.0;
        let zIndex = 20;

        if (skill.depthTier === 'front') {
          tierScaleMult = 1.05;
          zIndex = 30;
        } else if (skill.depthTier === 'back') {
          tierScaleMult = 0.90;
          opacity *= 0.8;
          zIndex = 8;
        }

        const finalScale = scale * tierScaleMult;
        const tangentTilt = (u - 0.5) * 14 + skill.tilt;
        const targetX = rawX - cardHalfWidth;
        const targetY = rawY - cardHalfHeight;

        const finalOpacity = (opacity * globalEcoOpacity).toFixed(3);

        el.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0px) scale(${finalScale.toFixed(3)}) rotateZ(${tangentTilt.toFixed(1)}deg)`;
        el.style.opacity = finalOpacity;
        el.style.zIndex = String(zIndex);
        el.style.visibility = Number(finalOpacity) <= 0.001 ? 'hidden' : 'visible';
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
  }, [scrollProgress, speed]);

  return (
    <div
      ref={containerRef}
      id="skill-orbit-viewport"
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {SKILL_ITEMS.map((skill, idx) => (
        <SkillCard
          key={skill.id}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
          skill={skill}
        />
      ))}
    </div>
  );
};

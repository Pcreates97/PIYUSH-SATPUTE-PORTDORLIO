import React, { useRef, useEffect, useCallback } from 'react';
import { SKILL_ITEMS, SkillItem } from './skillData';
import { SkillCard } from './SkillCard';

interface SkillOrbitProps {
  scrollProgress: number; // 0 to 1 master section scroll progress
}

export const SkillOrbit: React.FC<SkillOrbitProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to compute and apply 3D orbital positioning for a given item
  const updateCardPosition = useCallback(
    (
      el: HTMLDivElement,
      skill: SkillItem,
      progress: number,
      width: number,
      height: number
    ) => {
      const { startOffset, endOffset, archHeightRatio, spreadOffset, tilt, depthTier } = skill;

      // Compute local timeline progress u in [0, 1]
      const duration = endOffset - startOffset;
      const u = (progress - startOffset) / duration;

      if (u < -0.05 || u > 1.05) {
        // Fully out of bounds
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.transform = 'translate3d(-9999px, -9999px, 0)';
        return;
      }

      el.style.visibility = 'visible';

      // Clamp u for geometry calculations
      const clampedU = Math.max(0, Math.min(1, u));

      // 1. Horizontal Trajectory (Left to Right)
      const offscreenPadding = Math.min(width * 0.18, 180);
      const startX = -offscreenPadding;
      const endX = width + offscreenPadding;
      const spreadX = spreadOffset * width * 0.35;
      const rawX = startX + (endX - startX) * clampedU + spreadX;

      // 2. Inverted-U Arch Vertical Trajectory
      // Apex height comfortably above the AI Coder's head
      const isMobile = width < 768;
      const apexY = isMobile ? height * 0.14 * archHeightRatio : height * 0.11 * archHeightRatio;
      const baseY = isMobile ? height * 0.75 : height * 0.72;

      // Symmetric arch formula: peaks at u = 0.5
      const archFactor = Math.sin(clampedU * Math.PI);
      const rawY = baseY - (baseY - apexY) * Math.pow(archFactor, 0.88);

      // 3. Opacity, Scale & Depth Blur Transitions
      let opacity = 1;
      let blurAmount = 0;
      let scale = 1;

      // Entrance fade & zoom
      if (u < 0.15) {
        const enterRatio = Math.max(0, u / 0.15);
        opacity = enterRatio;
        scale = 0.72 + 0.28 * enterRatio;
        blurAmount = (1 - enterRatio) * 8;
      }
      // Exit fade & zoom
      else if (u > 0.85) {
        const exitRatio = Math.max(0, (1 - u) / 0.15);
        opacity = exitRatio;
        scale = 0.72 + 0.28 * exitRatio;
        blurAmount = (1 - exitRatio) * 8;
      } else {
        // Apex subtle prominence
        const apexProminence = Math.sin(clampedU * Math.PI);
        scale = 0.96 + apexProminence * 0.08;
      }

      // Layer-specific depth tuning
      let tierScaleMult = 1.0;
      let zIndex = 20; // Default MID layer

      if (depthTier === 'front') {
        tierScaleMult = 1.08;
        zIndex = 30; // Above character
      } else if (depthTier === 'back') {
        tierScaleMult = 0.88;
        opacity *= 0.85;
        zIndex = 10; // Behind character arms
      }

      const finalScale = scale * tierScaleMult;

      // Subtle dynamic rotation following the arch curve
      const tangentTilt = (clampedU - 0.5) * 6 + tilt;

      // Center offset alignment (card dimensions offset)
      const cardHalfWidth = isMobile ? 65 : 80;
      const cardHalfHeight = isMobile ? 24 : 30;
      const targetX = rawX - cardHalfWidth;
      const targetY = rawY - cardHalfHeight;

      // Hardware-accelerated 3D Transform
      el.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0px) scale(${finalScale.toFixed(3)}) rotateZ(${tangentTilt.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blurAmount > 0.5 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';
      el.style.zIndex = String(zIndex);
    },
    []
  );

  // Synchronize card positions on every scroll progress update
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const skill = SKILL_ITEMS[index];
      if (!skill) return;
      updateCardPosition(el, skill, scrollProgress, width, height);
    });
  }, [scrollProgress, updateCardPosition]);

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

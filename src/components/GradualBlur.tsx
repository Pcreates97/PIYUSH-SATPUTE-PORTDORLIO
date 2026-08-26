import React, { useState, useEffect, useRef, useMemo } from 'react';

export type GradualBlurPosition = 'top' | 'bottom' | 'left' | 'right';
export type GradualBlurCurve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';
export type GradualBlurPreset = 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'subtle' 
  | 'intense' 
  | 'smooth' 
  | 'sharp' 
  | 'header' 
  | 'footer' 
  | 'sidebar' 
  | 'page-header' 
  | 'page-footer';

export interface GradualBlurProps {
  position?: GradualBlurPosition;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | 'scroll';
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: GradualBlurCurve;
  responsive?: boolean;
  target?: 'parent' | 'page';
  className?: string;
  style?: React.CSSProperties;
  preset?: GradualBlurPreset;
  hoverIntensity?: number;
  onAnimationComplete?: () => void;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
}

const DEFAULT_CONFIG: Required<Omit<GradualBlurProps, 'preset' | 'hoverIntensity' | 'onAnimationComplete' | 'mobileHeight' | 'tabletHeight' | 'desktopHeight' | 'mobileWidth' | 'tabletWidth' | 'desktopWidth'>> & {
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  hoverIntensity?: number;
  onAnimationComplete?: () => void;
} = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  width: '',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear',
  responsive: false,
  target: 'parent',
  className: '',
  style: {}
};

export const GRADUAL_BLUR_PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  left: { position: 'left', height: '6rem' },
  right: { position: 'right', height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 },
  header: { position: 'top', height: '8rem', curve: 'ease-out' },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
  sidebar: { position: 'left', height: '6rem', strength: 2.5 },
  'page-header': { position: 'top', height: '10rem', target: 'page', strength: 3 },
  'page-footer': { position: 'bottom', height: '10rem', target: 'page', strength: 3 }
};

export const GRADUAL_BLUR_CURVES: Record<GradualBlurCurve, (p: number) => number> = {
  linear: (p: number) => p,
  bezier: (p: number) => p * p * (3 - 2 * p),
  'ease-in': (p: number) => p * p,
  'ease-out': (p: number) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
};

const getGradientDirection = (position: GradualBlurPosition) =>
  ({
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  })[position] || 'to bottom';

const debounce = <T extends (...args: any[]) => void>(fn: T, wait: number) => {
  let t: ReturnType<typeof setTimeout>;
  return (...a: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};

const useResponsiveDimension = (
  responsive: boolean,
  config: any,
  key: 'height' | 'width'
) => {
  const [value, setValue] = useState(config[key]);
  useEffect(() => {
    if (!responsive) return;
    const calc = () => {
      const w = window.innerWidth;
      let v = config[key];
      const capKey = key[0].toUpperCase() + key.slice(1);
      if (w <= 480 && config[`mobile${capKey}`])
        v = config[`mobile${capKey}`];
      else if (w <= 768 && config[`tablet${capKey}`])
        v = config[`tablet${capKey}`];
      else if (w <= 1024 && config[`desktop${capKey}`])
        v = config[`desktop${capKey}`];
      setValue(v);
    };
    const debounced = debounce(calc, 100);
    calc();
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, [responsive, config, key]);
  return responsive ? value : config[key];
};

const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve = false
) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
};

export function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const presetConfig = props.preset && GRADUAL_BLUR_PRESETS[props.preset]
      ? GRADUAL_BLUR_PRESETS[props.preset]
      : {};
    return { ...DEFAULT_CONFIG, ...presetConfig, ...props } as typeof DEFAULT_CONFIG & GradualBlurProps;
  }, [props]);

  const responsiveHeight = useResponsiveDimension(config.responsive || false, config, 'height');
  const responsiveWidth = useResponsiveDimension(config.responsive || false, config, 'width');

  const isVisible = useIntersectionObserver(containerRef, config.animated === 'scroll');

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const divCount = config.divCount || 5;
    const increment = 100 / divCount;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength;

    const curveFunc = (config.curve && GRADUAL_BLUR_CURVES[config.curve]) || GRADUAL_BLUR_CURVES.linear;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position as GradualBlurPosition);

      const divStyle: React.CSSProperties = {
        position: 'absolute',
        inset: '0',
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== 'scroll'
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
        pointerEvents: 'none',
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle = useMemo(() => {
    const isVertical = ['top', 'bottom'].includes(config.position || 'bottom');
    const isHorizontal = ['left', 'right'].includes(config.position || '');
    const isPageTarget = config.target === 'page';

    const baseStyle: React.CSSProperties = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? (config.zIndex || 1000) + 100 : config.zIndex,
      ...config.style
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight;
      baseStyle.width = responsiveWidth || '100%';
      (baseStyle as any)[config.position as string] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight;
      baseStyle.height = '100%';
      (baseStyle as any)[config.position as string] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config;

  useEffect(() => {
    if (isVisible && animated === 'scroll' && onAnimationComplete) {
      const ms = parseFloat(duration || '0.3') * 1000;
      const t = setTimeout(() => onAnimationComplete(), ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${config.className || ''}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
      aria-hidden="true"
    >
      <div
        className="gradual-blur-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {blurDivs}
      </div>
    </div>
  );
}

export const GradualBlurMemo = React.memo(GradualBlur);
export default GradualBlurMemo;

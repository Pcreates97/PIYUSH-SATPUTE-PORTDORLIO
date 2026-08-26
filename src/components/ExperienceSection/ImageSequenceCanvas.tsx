import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

export interface ImageSequenceCanvasHandle {
  renderFrame: (frameIndex: number) => void;
  getLoadedCount: () => number;
}

interface ImageSequenceCanvasProps {
  totalFrames?: number;
  initialFrame?: number;
  onLoadingProgress?: (progress: number) => void;
  onFirstFrameLoaded?: () => void;
}

export const ImageSequenceCanvas = forwardRef<ImageSequenceCanvasHandle, ImageSequenceCanvasProps>(
  ({ totalFrames = 150, initialFrame = 0, onLoadingProgress, onFirstFrameLoaded }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fallbackImgRef = useRef<HTMLImageElement | null>(null);
    const imagesCache = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));
    const targetFrameRef = useRef<number>(initialFrame);
    const rafIdRef = useRef<number | null>(null);
    const [loadProgress, setLoadProgress] = useState<number>(0);

    // Get asset URL for a given frame index (0-based)
    const getFrameUrl = useCallback((index: number) => {
      const frameNum = String(index + 1).padStart(3, '0');
      return `/sequence/ezgif-frame-${frameNum}.jpg`;
    }, []);

    // Draw frame onto canvas
    const drawImmediate = useCallback((frameIndex: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const safeIndex = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex)));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = container.clientWidth || window.innerWidth;
      const displayHeight = container.clientHeight || window.innerHeight;

      const targetWidth = Math.max(1, Math.round(displayWidth * dpr));
      const targetHeight = Math.max(1, Math.round(displayHeight * dpr));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Find nearest loaded frame if exact frame is still downloading
      let img = imagesCache.current[safeIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < totalFrames; offset++) {
          const lower = safeIndex - offset;
          const higher = safeIndex + offset;
          if (lower >= 0 && imagesCache.current[lower]?.complete && (imagesCache.current[lower]?.naturalWidth || 0) > 0) {
            img = imagesCache.current[lower];
            break;
          }
          if (higher < totalFrames && imagesCache.current[higher]?.complete && (imagesCache.current[higher]?.naturalWidth || 0) > 0) {
            img = imagesCache.current[higher];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      if (imgWidth === 0 || imgHeight === 0) return;

      const canvasAspect = targetWidth / targetHeight;
      const imgAspect = imgWidth / imgHeight;

      let drawWidth = targetWidth;
      let drawHeight = targetHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        drawHeight = targetWidth / imgAspect;
        offsetY = (targetHeight - drawHeight) * 0.5;
      } else {
        drawWidth = targetHeight * imgAspect;
        offsetY = 0;
        offsetX = (targetWidth - drawWidth) * 0.5;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }, [totalFrames]);

    // Request-Animation-Frame throttled render
    const scheduleRender = useCallback((frameIndex: number) => {
      targetFrameRef.current = frameIndex;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          drawImmediate(targetFrameRef.current);
        });
      }
    }, [drawImmediate]);

    // Expose imperative handle
    useImperativeHandle(ref, () => ({
      renderFrame: (frameIndex: number) => {
        scheduleRender(frameIndex);
      },
      getLoadedCount: () => {
        return imagesCache.current.filter((img) => img?.complete && img.naturalWidth > 0).length;
      },
    }), [scheduleRender]);

    // Preload all frames sequentially & in priority chunks
    useEffect(() => {
      let isMounted = true;
      let loadedCount = 0;

      // 1. Instantly preload frame 0 and frame 1
      const loadFrame = (index: number) => {
        const img = new Image();
        img.onload = () => {
          if (!isMounted) return;
          imagesCache.current[index] = img;
          loadedCount++;
          const pct = Math.round((loadedCount / totalFrames) * 100);
          setLoadProgress(pct);
          onLoadingProgress?.(pct);

          if (index === 0) {
            onFirstFrameLoaded?.();
          }

          // Redraw if this is the target frame
          if (Math.round(targetFrameRef.current) === index || index === 0) {
            drawImmediate(targetFrameRef.current);
          }
        };
        img.onerror = () => {
          // Fallback to avoid deadlocks
          if (!isMounted) return;
          loadedCount++;
        };
        img.src = getFrameUrl(index);
      };

      // Load all frames
      for (let i = 0; i < totalFrames; i++) {
        loadFrame(i);
      }

      // Initial draw attempt
      drawImmediate(0);

      // Handle Resize
      const handleResize = () => {
        if (!isMounted) return;
        drawImmediate(targetFrameRef.current);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      const container = containerRef.current;
      let ro: ResizeObserver | null = null;
      if (container && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => {
          if (!isMounted) return;
          drawImmediate(targetFrameRef.current);
        });
        ro.observe(container);
      }

      return () => {
        isMounted = false;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        if (ro) ro.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }, [drawImmediate, getFrameUrl, onFirstFrameLoaded, onLoadingProgress, totalFrames]);

    return (
      <div
        id="image-sequence-container"
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none"
      >
        {/* Instant Backdrop Image - Guarantees visual rendering at 100% times without broken placeholder boxes */}
        <img
          id="image-sequence-backdrop-fallback"
          ref={fallbackImgRef}
          src={getFrameUrl(0)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 opacity-60"
          loading="eager"
          decoding="async"
        />

        {/* High-Performance Canvas */}
        <canvas
          id="image-sequence-canvas"
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-1"
          style={{ willChange: 'transform' }}
        />

        {/* Darkening Scrim Overlay for Enhanced Text Contrast */}
        <div
          id="canvas-dark-scrim"
          className="pointer-events-none absolute inset-0 z-3 bg-black/40"
        />

        {/* Directional Horizontal Edge Shadows (for Left & Right Text Columns) */}
        <div
          id="canvas-horizontal-scrim"
          className="pointer-events-none absolute inset-0 z-4 bg-gradient-to-r from-black/80 via-black/20 to-black/80"
        />

        {/* Vertical Top/Bottom Header/Footer Fade */}
        <div
          id="canvas-vertical-scrim"
          className="pointer-events-none absolute inset-0 z-5 bg-gradient-to-b from-black/70 via-transparent to-black/85"
        />

        {/* Cinematic Vignette Overlay */}
        <div
          id="canvas-cinematic-vignette"
          className="pointer-events-none absolute inset-0 z-6 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_65%,rgba(0,0,0,0.95)_100%)]"
        />

        {/* Buffer status indicator */}
        {loadProgress > 0 && loadProgress < 100 && (
          <div
            id="sequence-stream-cache-progress"
            className="absolute bottom-4 left-6 z-20 flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm text-[10px] font-mono text-neutral-400 select-none pointer-events-none transition-opacity duration-500"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>BUFFERING {loadProgress}%</span>
          </div>
        )}
      </div>
    );
  }
);

ImageSequenceCanvas.displayName = 'ImageSequenceCanvas';


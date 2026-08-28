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

// Deterministic frame URLs generation for all 150 sequence frames
const TOTAL_SEQUENCE_FRAMES = 150;
const FRAME_URLS: string[] = Array.from({ length: TOTAL_SEQUENCE_FRAMES }, (_, i) => {
  const frameNum = String(i + 1).padStart(3, '0');
  return `/sequence/ezgif-frame-${frameNum}.jpg`;
});

interface DrawMetrics {
  targetWidth: number;
  targetHeight: number;
  drawWidth: number;
  drawHeight: number;
  offsetX: number;
  offsetY: number;
  aspect: number;
}

export const ImageSequenceCanvas = forwardRef<ImageSequenceCanvasHandle, ImageSequenceCanvasProps>(
  ({ totalFrames = 150, initialFrame = 0, onLoadingProgress, onFirstFrameLoaded }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fallbackImgRef = useRef<HTMLImageElement | null>(null);
    const imagesCache = useRef<(HTMLImageElement | ImageBitmap | null)[]>([]);
    const targetFrameRef = useRef<number>(initialFrame);
    const lastDrawnIndexRef = useRef<number>(-1);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const drawMetricsRef = useRef<DrawMetrics | null>(null);
    const [loadProgress, setLoadProgress] = useState<number>(0);

    // Get asset URL for a given frame index (0-based)
    const getFrameUrl = useCallback((index: number) => {
      const safeIndex = Math.max(0, Math.min(totalFrames - 1, Math.round(index)));
      return FRAME_URLS[safeIndex] || `/sequence/ezgif-frame-${String(safeIndex + 1).padStart(3, '0')}.jpg`;
    }, [totalFrames]);

    // Recalculate dimensions only on resize / viewport change
    const updateDimensions = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = container.clientWidth || window.innerWidth;
      const displayHeight = container.clientHeight || window.innerHeight;

      if (displayWidth === 0 || displayHeight === 0) return;

      const targetWidth = Math.max(1, Math.round(displayWidth * dpr));
      const targetHeight = Math.max(1, Math.round(displayHeight * dpr));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      // Default aspect ratio of sequence (e.g. standard 16:9 or 4:3)
      // Check first loaded image aspect if available
      let imgAspect = 16 / 9;
      for (let i = 0; i < totalFrames; i++) {
        const item = imagesCache.current[i];
        if (item) {
          const w = (item as HTMLImageElement).naturalWidth || (item as ImageBitmap).width || 0;
          const h = (item as HTMLImageElement).naturalHeight || (item as ImageBitmap).height || 0;
          if (w > 0 && h > 0) {
            imgAspect = w / h;
            break;
          }
        }
      }

      const canvasAspect = targetWidth / targetHeight;
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

      drawMetricsRef.current = {
        targetWidth,
        targetHeight,
        drawWidth,
        drawHeight,
        offsetX,
        offsetY,
        aspect: imgAspect,
      };

      if (!ctxRef.current && canvas) {
        ctxRef.current = canvas.getContext('2d', { alpha: false, desynchronized: true });
      }
    }, [totalFrames]);

    // Ultra-Fast Direct Canvas Draw (<0.1ms per frame)
    const drawImmediate = useCallback((frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let ctx = ctxRef.current;
      if (!ctx) {
        ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
        ctxRef.current = ctx;
      }
      if (!ctx) return;

      let metrics = drawMetricsRef.current;
      if (!metrics) {
        updateDimensions();
        metrics = drawMetricsRef.current;
        if (!metrics) return;
      }

      const safeIndex = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex)));

      // Find exact frame or nearest loaded frame in cache
      let img = imagesCache.current[safeIndex];
      let bestIndex = safeIndex;

      if (!img) {
        for (let offset = 1; offset < totalFrames; offset++) {
          const lower = safeIndex - offset;
          const higher = safeIndex + offset;
          if (lower >= 0 && imagesCache.current[lower]) {
            img = imagesCache.current[lower];
            bestIndex = lower;
            break;
          }
          if (higher < totalFrames && imagesCache.current[higher]) {
            img = imagesCache.current[higher];
            bestIndex = higher;
            break;
          }
        }
      }

      if (!img) return;

      ctx.drawImage(img, metrics.offsetX, metrics.offsetY, metrics.drawWidth, metrics.drawHeight);
      lastDrawnIndexRef.current = bestIndex;

      // Hide fallback once canvas has rendered frame
      if (fallbackImgRef.current && fallbackImgRef.current.style.display !== 'none') {
        fallbackImgRef.current.style.display = 'none';
      }
    }, [totalFrames, updateDimensions]);

    // Direct render handle for GSAP Timeline Ticker
    useImperativeHandle(ref, () => ({
      renderFrame: (frameIndex: number) => {
        targetFrameRef.current = frameIndex;
        drawImmediate(frameIndex);
      },
      getLoadedCount: () => {
        return imagesCache.current.filter((img) => img !== null).length;
      },
    }), [drawImmediate]);

    // Preload and Pre-decode image sequence on mount
    useEffect(() => {
      let isMounted = true;
      let loadedCount = 0;

      const cache: (HTMLImageElement | ImageBitmap | null)[] = new Array(totalFrames).fill(null);
      imagesCache.current = cache;

      updateDimensions();

      const onFrameReady = (idx: number, loadedImg: HTMLImageElement | ImageBitmap) => {
        if (!isMounted) return;
        cache[idx] = loadedImg;
        loadedCount++;

        const pct = Math.round((loadedCount / totalFrames) * 100);
        setLoadProgress(pct);
        onLoadingProgress?.(pct);

        if (idx === 0) {
          updateDimensions();
          drawImmediate(0);
          onFirstFrameLoaded?.();
        }

        // If currently viewing around this frame, redraw immediately
        const curTarget = targetFrameRef.current;
        if (Math.abs(idx - curTarget) <= 2) {
          drawImmediate(curTarget);
        }
      };

      // Load all frames with pre-decoding
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.decoding = 'async';
        if (i < 10) {
          try {
            (img as unknown as Record<string, string>).fetchPriority = 'high';
          } catch {
            // ignore
          }
        }

        img.onload = () => {
          if (!isMounted) return;
          // Decode image in background thread to avoid jank
          if (img.decode) {
            img.decode().then(() => {
              if (typeof createImageBitmap !== 'undefined') {
                createImageBitmap(img).then((bitmap) => {
                  onFrameReady(i, bitmap);
                }).catch(() => {
                  onFrameReady(i, img);
                });
              } else {
                onFrameReady(i, img);
              }
            }).catch(() => {
              onFrameReady(i, img);
            });
          } else {
            onFrameReady(i, img);
          }
        };

        img.onerror = () => {
          if (!isMounted) return;
          loadedCount++;
        };

        img.src = getFrameUrl(i);
      }

      // Initial draw attempt
      drawImmediate(0);

      // Handle Resize with Debounce / RequestAnimationFrame
      let resizeRaf: number | null = null;
      const handleResize = () => {
        if (!isMounted) return;
        if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          updateDimensions();
          drawImmediate(targetFrameRef.current);
          resizeRaf = null;
        });
      };

      window.addEventListener('resize', handleResize, { passive: true });

      const container = containerRef.current;
      let ro: ResizeObserver | null = null;
      if (container && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => {
          handleResize();
        });
        ro.observe(container);
      }

      return () => {
        isMounted = false;
        if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
        if (ro) ro.disconnect();
        window.removeEventListener('resize', handleResize);
        // Clean up ImageBitmaps
        cache.forEach((item) => {
          if (item && 'close' in item && typeof item.close === 'function') {
            try {
              item.close();
            } catch {
              // ignore
            }
          }
        });
      };
    }, [drawImmediate, getFrameUrl, onFirstFrameLoaded, onLoadingProgress, totalFrames, updateDimensions]);

    return (
      <div
        id="image-sequence-container"
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none"
      >
        {/* Instant Backdrop Image Fallback */}
        <img
          id="image-sequence-backdrop-fallback"
          ref={fallbackImgRef}
          src={getFrameUrl(0)}
          alt="Experience Frame Sequence"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
          loading="eager"
          decoding="async"
        />

        {/* High-Performance Canvas with Hardware Blitting */}
        <canvas
          id="image-sequence-canvas"
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-10"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        />

        {/* Subtle Top HUD Ambient Gradient */}
        <div
          id="canvas-top-ambient-scrim"
          className="pointer-events-none absolute top-0 inset-x-0 h-28 z-20 bg-gradient-to-b from-black/80 via-black/30 to-transparent"
        />

        {/* Subtle Bottom HUD Ambient Gradient */}
        <div
          id="canvas-bottom-ambient-scrim"
          className="pointer-events-none absolute bottom-0 inset-x-0 h-28 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />

        {/* Buffer status indicator */}
        {loadProgress > 0 && loadProgress < 100 && (
          <div
            id="sequence-stream-cache-progress"
            className="absolute bottom-4 left-6 z-30 flex items-center gap-2 px-2.5 py-1 rounded bg-black/70 border border-white/10 backdrop-blur-sm text-[10px] font-mono text-neutral-400 select-none pointer-events-none transition-opacity duration-500"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>STREAMING {loadProgress}%</span>
          </div>
        )}
      </div>
    );
  }
);

ImageSequenceCanvas.displayName = 'ImageSequenceCanvas';




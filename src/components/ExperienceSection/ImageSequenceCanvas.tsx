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
    const imagesCache = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));
    const targetFrameRef = useRef<number>(initialFrame);
    const lastRenderedFrameRef = useRef<number>(-1);
    const rafIdRef = useRef<number | null>(null);
    const isFirstFrameRendered = useRef<boolean>(false);
    
    // Cached canvas metrics to prevent layout thrashing
    const metricsRef = useRef<{
      targetWidth: number;
      targetHeight: number;
      canvasAspect: number;
    }>({ targetWidth: 0, targetHeight: 0, canvasAspect: 1 });

    const [loadProgress, setLoadProgress] = useState<number>(0);
    const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

    // Get asset URL for a given frame index (0-based)
    const getFrameUrl = useCallback((index: number) => {
      const frameNum = String(index + 1).padStart(3, '0');
      return `/sequence/ezgif-frame-001.jpg`.replace('001', frameNum);
    }, []);

    // Update canvas size metrics
    const updateMetrics = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth || window.innerWidth;
      const displayHeight = canvas.clientHeight || window.innerHeight;

      const targetWidth = Math.round(displayWidth * dpr);
      const targetHeight = Math.round(displayHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      metricsRef.current = {
        targetWidth,
        targetHeight,
        canvasAspect: targetWidth / targetHeight,
      };
    }, []);

    // Draw the specified frame onto the canvas with object-fit: cover calculation
    const drawImmediate = useCallback((frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
      if (!ctx) return;

      const safeIndex = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex)));
      
      // Find nearest loaded frame if current frame is not yet ready
      let img = imagesCache.current[safeIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < totalFrames; offset++) {
          const lower = safeIndex - offset;
          const higher = safeIndex + offset;
          if (lower >= 0 && imagesCache.current[lower]?.complete && imagesCache.current[lower]?.naturalWidth !== 0) {
            img = imagesCache.current[lower];
            break;
          }
          if (higher < totalFrames && imagesCache.current[higher]?.complete && imagesCache.current[higher]?.naturalWidth !== 0) {
            img = imagesCache.current[higher];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      let { targetWidth, targetHeight, canvasAspect } = metricsRef.current;
      if (targetWidth === 0 || targetHeight === 0) {
        updateMetrics();
        targetWidth = metricsRef.current.targetWidth;
        targetHeight = metricsRef.current.targetHeight;
        canvasAspect = metricsRef.current.canvasAspect;
      }

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspect = imgWidth / imgHeight;

      let drawWidth = targetWidth;
      let drawHeight = targetHeight;
      let offsetX = 0;
      let offsetY = 0;

      // Fast object-fit: cover calculation
      if (canvasAspect > imgAspect) {
        drawHeight = targetWidth / imgAspect;
        offsetY = (targetHeight - drawHeight) * 0.5;
      } else {
        drawWidth = targetHeight * imgAspect;
        offsetX = (targetWidth - drawWidth) * 0.5;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      lastRenderedFrameRef.current = safeIndex;
    }, [totalFrames, updateMetrics]);

    // Request-Animation-Frame throttled render queue
    const scheduleRender = useCallback((frameIndex: number) => {
      targetFrameRef.current = frameIndex;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          if (targetFrameRef.current !== lastRenderedFrameRef.current) {
            drawImmediate(targetFrameRef.current);
          }
        });
      }
    }, [drawImmediate]);

    // Expose control handles
    useImperativeHandle(ref, () => ({
      renderFrame: (frameIndex: number) => {
        scheduleRender(frameIndex);
      },
      getLoadedCount: () => {
        return imagesCache.current.filter((img) => img?.complete).length;
      },
    }), [scheduleRender]);

    // Preloader engine with asynchronous image decoding
    useEffect(() => {
      let isMounted = true;
      let loadedCount = 0;

      updateMetrics();

      // 1. Prioritize frame 001 first for instant visual paint
      const loadInitial = () => {
        const firstImg = new Image();
        firstImg.src = getFrameUrl(0);
        
        const onFirstReady = async () => {
          if (!isMounted) return;
          try {
            if ('decode' in firstImg) {
              await firstImg.decode();
            }
          } catch {
            // Ignore decode failures and continue
          }
          if (!isMounted) return;
          imagesCache.current[0] = firstImg;
          loadedCount++;
          setIsInitialReady(true);
          onFirstFrameLoaded?.();
          if (!isFirstFrameRendered.current) {
            isFirstFrameRendered.current = true;
            drawImmediate(0);
          }
          startBackgroundBatchLoad();
        };

        firstImg.onload = onFirstReady;
        firstImg.onerror = () => {
          if (!isMounted) return;
          startBackgroundBatchLoad();
        };
      };

      // 2. Preload remainder in optimized interleaved chunks with hardware decoding
      const startBackgroundBatchLoad = () => {
        const priorityIndices: number[] = [];
        for (let i = 0; i < totalFrames; i += 3) {
          if (i !== 0) priorityIndices.push(i);
        }
        for (let i = 0; i < totalFrames; i++) {
          if (i % 3 !== 0) priorityIndices.push(i);
        }

        let currentIndex = 0;
        const maxConcurrent = 8;
        let activeLoads = 0;

        const loadNext = () => {
          if (!isMounted) return;
          while (activeLoads < maxConcurrent && currentIndex < priorityIndices.length) {
            const frameIdx = priorityIndices[currentIndex++];
            if (imagesCache.current[frameIdx]) continue;

            activeLoads++;
            const img = new Image();
            img.src = getFrameUrl(frameIdx);

            const handleLoaded = async () => {
              if (!isMounted) return;
              try {
                if ('decode' in img) {
                  await img.decode();
                }
              } catch {
                // Ignore decode failures and proceed
              }
              if (!isMounted) return;
              imagesCache.current[frameIdx] = img;
              loadedCount++;
              activeLoads--;
              const pct = Math.round((loadedCount / totalFrames) * 100);
              setLoadProgress(pct);
              onLoadingProgress?.(pct);

              // If current scrubbed frame is this frame, render immediately
              if (Math.round(targetFrameRef.current) === frameIdx) {
                drawImmediate(frameIdx);
              }
              loadNext();
            };

            img.onload = handleLoaded;
            img.onerror = () => {
              if (!isMounted) return;
              activeLoads--;
              loadNext();
            };
          }
        };

        loadNext();
      };

      loadInitial();

      // Handle window resize with debounced metrics update
      const handleResize = () => {
        updateMetrics();
        drawImmediate(targetFrameRef.current >= 0 ? targetFrameRef.current : 0);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        isMounted = false;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        window.removeEventListener('resize', handleResize);
      };
    }, [drawImmediate, getFrameUrl, onFirstFrameLoaded, onLoadingProgress, totalFrames, updateMetrics]);

    return (
      <div id="image-sequence-container" className="relative w-full h-full overflow-hidden bg-black select-none">
        <canvas
          id="image-sequence-canvas"
          ref={canvasRef}
          className="w-full h-full block object-cover"
          style={{ willChange: 'transform' }}
        />

        {/* GPU-Accelerated Static Radial Vignette Overlay (Replaces expensive per-frame 2D context gradient) */}
        <div
          id="canvas-cinematic-vignette"
          className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.3)_65%,rgba(0,0,0,0.85)_100%)]"
        />

        {/* Subtle non-intrusive stream cache indicator at bottom left */}
        {isInitialReady && loadProgress < 100 && (
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

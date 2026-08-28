import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    // Fast simulated progress matching critical asset warm-up
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 8;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          onComplete?.();
        }, 400);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div
      id="preloader-screen"
      className={`fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 sm:p-12 transition-opacity duration-700 pointer-events-auto ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-label="Loading Experience"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>PIYUSH // CINEMATIC PORTFOLIO</span>
        </div>
        <span>2026 // RELEASE</span>
      </div>

      {/* Center Wordmark & Status */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.1em] text-white uppercase mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          PIYUSH
        </h1>

        <div className="flex items-center gap-3 text-neutral-400 font-mono text-xs tracking-[0.3em] uppercase mb-8">
          <span>01 / LOADING EXPERIENCE</span>
          <span>·</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-48 sm:w-64 h-[2px] bg-neutral-900 overflow-hidden relative rounded-full">
          <div
            className="h-full bg-white transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Telemetry */}
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
        <span>INITIALIZING SPATIAL CORE</span>
        <span>STANDBY // READY FOR DEPLOYMENT</span>
      </div>
    </div>
  );
};

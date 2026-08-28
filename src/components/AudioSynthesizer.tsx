import React, { useEffect, useRef } from 'react';

interface AudioSynthesizerProps {
  enabled: boolean;
}

export const AudioSynthesizer: React.FC<AudioSynthesizerProps> = ({ enabled }) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (enabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        ctxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);
        masterGain.connect(ctx.destination);
        gainRef.current = masterGain;

        // Lowpass Filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, ctx.currentTime);
        filter.connect(masterGain);
        filterRef.current = filter;

        // Osc 1 (Sub drone)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
        osc1.connect(filter);
        osc1.start();
        osc1Ref.current = osc1;

        // Osc 2 (Harmonic fifth drone with subtle detune)
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(82.5, ctx.currentTime); // E2 note
        osc2.detune.setValueAtTime(4, ctx.currentTime);
        osc2.connect(filter);
        osc2.start();
        osc2Ref.current = osc2;
      } catch {
        // AudioContext initialization guard
      }
    } else {
      if (gainRef.current && ctxRef.current) {
        try {
          gainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctxRef.current.currentTime + 0.8);
          setTimeout(() => {
            osc1Ref.current?.stop();
            osc2Ref.current?.stop();
            ctxRef.current?.close();
            ctxRef.current = null;
          }, 900);
        } catch {
          // Ignore cleanup errors
        }
      }
    }

    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        try {
          ctxRef.current.close();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [enabled]);

  return null;
};

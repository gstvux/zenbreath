import { useEffect, useRef, useState } from 'react';
import type { BreathingPreset } from '../lib/breathing';

export function useBreathingEngine(preset: BreathingPreset) {
  const [faseAtual, setFaseAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(preset.phases[0].durationMs);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (!isPlaying) return;
    
    if (previousTimeRef.current !== undefined && previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current;
      setTempoRestante((prev) => {
        const novoTempo = prev - deltaTime;
        if (novoTempo <= 0) {
          return 0; // Phase transition will be handled by a useEffect in the component
        }
        return novoTempo;
      });
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  return { 
    isPlaying, 
    setIsPlaying, 
    faseAtual, 
    setFaseAtual, 
    tempoRestante, 
    setTempoRestante 
  };
}

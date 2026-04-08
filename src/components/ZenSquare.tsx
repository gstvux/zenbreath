import React, { useEffect, useMemo } from 'react';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { BREATHING_PRESETS, gerarVibracaoHaptica } from '../lib/breathing';
import { SquareBorder } from './svg/SquareBorder';
import { Display } from './ui/Display';
import { Controls } from './ui/Controls';

export const ZenSquare: React.FC = () => {
  const preset = BREATHING_PRESETS[0];
  const { 
    isPlaying, 
    setIsPlaying, 
    faseAtual, 
    setFaseAtual, 
    tempoRestante, 
    setTempoRestante 
  } = useBreathingEngine(preset);

  const [cycleKey, setCycleKey] = React.useState(0);

  const currentPhase = preset.phases[faseAtual];

  const totalCycleDuration = useMemo(() => 
    preset.phases.reduce((acc, p) => acc + p.durationMs, 0), 
  [preset.phases]);

  const totalProgress = useMemo(() => {
    let accumulatedTime = 0;
    for (let i = 0; i < faseAtual; i++) {
      accumulatedTime += preset.phases[i].durationMs;
    }
    const currentPhaseElapsed = currentPhase.durationMs - tempoRestante;
    return (accumulatedTime + currentPhaseElapsed) / totalCycleDuration;
  }, [faseAtual, tempoRestante, preset.phases, currentPhase.durationMs, totalCycleDuration]);

  useEffect(() => {
    if (tempoRestante <= 0 && isPlaying) {
      const nextPhaseIdx = (faseAtual + 1) % preset.phases.length;
      const nextPhase = preset.phases[nextPhaseIdx];
      
      setFaseAtual(nextPhaseIdx);
      setTempoRestante(nextPhase.durationMs);

      if (nextPhaseIdx === 0) {
        setCycleKey(prev => prev + 1);
      }

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          const pattern = gerarVibracaoHaptica(nextPhase.durationMs, nextPhase.haptic);
          navigator.vibrate(pattern);
        } catch (e) {
          console.warn('Haptic feedback failed:', e);
        }
      }
    }
  }, [tempoRestante, isPlaying, faseAtual, preset.phases, setFaseAtual, setTempoRestante]);

  return (
    <div className="zen-page">
      {/* Background Vibe */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 opacity-[0.03]"
        style={{ backgroundColor: currentPhase.color }}
      />

      {/* Quadrado Central */}
      <div 
        className="zen-square-container"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <SquareBorder 
          progress={totalProgress} 
          color={currentPhase.color} 
          faseAtual={faseAtual} 
          cycleKey={cycleKey}
        />

        <Display 
          label={currentPhase.label} 
          tempoRestante={tempoRestante} 
          color={currentPhase.color}
        />

        <Controls isPlaying={isPlaying} />
      </div>
    </div>
  );
};

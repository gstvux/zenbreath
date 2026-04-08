import React, { useEffect } from 'react';
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

  const IDLE_COLOR = '#FFFFFF';
  const IDLE_LABEL = 'Iniciar';
  const TRANSITION_MS = 300;

  const currentPhase = preset.phases[faseAtual];
  
  // Parametrização dos estados
  const displayColor = isPlaying ? currentPhase.color : IDLE_COLOR;
  const displayLabel = isPlaying ? currentPhase.label : IDLE_LABEL;
  const displayProgress = isPlaying ? calcularProgresso() : 0;
  const displayTime = isPlaying ? tempoRestante : preset.phases[0].durationMs;

  function calcularProgresso() {
    let accumulatedTime = 0;
    for (let i = 0; i < faseAtual; i++) {
      accumulatedTime += preset.phases[i].durationMs;
    }
    const currentPhaseElapsed = currentPhase.durationMs - tempoRestante;
    const totalCycleDuration = preset.phases.reduce((acc, p) => acc + p.durationMs, 0);
    return (accumulatedTime + currentPhaseElapsed) / totalCycleDuration;
  }

  // Efeito para disparar a vibração assim que o ciclo começa
  useEffect(() => {
    if (isPlaying && faseAtual === 0 && tempoRestante === preset.phases[0].durationMs) {
      dispararHaptico(preset.phases[0]);
    }
  }, [isPlaying]);

  // Efeito para transição de fases
  useEffect(() => {
    if (tempoRestante <= 0 && isPlaying) {
      const nextPhaseIdx = (faseAtual + 1) % preset.phases.length;
      const nextPhase = preset.phases[nextPhaseIdx];
      
      setFaseAtual(nextPhaseIdx);
      setTempoRestante(nextPhase.durationMs);

      if (nextPhaseIdx === 0) {
        setCycleKey(prev => prev + 1);
      }

      dispararHaptico(nextPhase);
    }
  }, [tempoRestante, isPlaying, faseAtual, preset.phases, setFaseAtual, setTempoRestante]);

  const dispararHaptico = (phase: typeof preset.phases[0]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        const pattern = gerarVibracaoHaptica(phase.durationMs, phase.haptic);
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Haptic feedback failed:', e);
      }
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      // Resetar ao pausar
      setIsPlaying(false);
      setFaseAtual(0);
      setTempoRestante(preset.phases[0].durationMs);
      setCycleKey(prev => prev + 1);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(0); // Para qualquer vibração ativa
      }
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <div className="zen-page">
      {/* Background Vibe */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors"
        style={{ 
          backgroundColor: displayColor,
          opacity: 0.03,
          transitionDuration: `${TRANSITION_MS}ms`
        }}
      />

      {/* Quadrado Central */}
      <div 
        className="zen-square-container"
        onClick={handleTogglePlay}
      >
        <SquareBorder 
          progress={displayProgress} 
          color={displayColor} 
          faseAtual={faseAtual} 
          cycleKey={cycleKey}
          transitionMs={TRANSITION_MS}
        />

        <Display 
          label={displayLabel} 
          tempoRestante={displayTime} 
          color={displayColor}
          transitionMs={TRANSITION_MS}
        />

        <Controls isPlaying={isPlaying} />
      </div>
    </div>
  );
};

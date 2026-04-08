export interface BreathingPhase {
  key: string;
  label: string;
  durationMs: number;
  color: string;
  haptic: 'crescente' | 'clique' | 'decrescente' | 'silencio';
}

export interface BreathingPreset {
  id: string;
  name: string;
  phases: BreathingPhase[];
}

export const BREATHING_PRESETS: BreathingPreset[] = [
  {
    id: 'quadrada_4s',
    name: 'Respiração Quadrada',
    phases: [
      { key: 'puxa', label: 'Puxa', durationMs: 4000, color: 'var(--corPuxa)', haptic: 'crescente' },
      { key: 'segura', label: 'Segura', durationMs: 4000, color: 'var(--corSegura)', haptic: 'clique' },
      { key: 'solta', label: 'Solta', durationMs: 4000, color: 'var(--corSolta)', haptic: 'decrescente' },
      { key: 'espera', label: 'Espera', durationMs: 4000, color: 'var(--corEspera)', haptic: 'silencio' }
    ]
  }
];

export function gerarVibracaoHaptica(duracaoMs: number, tipoHaptico: BreathingPhase['haptic']): number[] {
  if (tipoHaptico === 'silencio') return [0];
  if (tipoHaptico === 'clique') return [50];

  const padrao: number[] = [];
  let tempoAcumulado = 0;
  const vibMin = 10;
  const vibMax = 150;
  const pausaMin = 20;
  const pausaMax = 300;

  while (tempoAcumulado < duracaoMs) {
    let progresso = tempoAcumulado / duracaoMs;
    if (tipoHaptico === 'decrescente') progresso = 1 - progresso;

    const on = Math.floor(vibMin + (vibMax - vibMin) * progresso);
    const off = Math.floor(pausaMax - (pausaMax - pausaMin) * progresso);

    padrao.push(on, off);
    tempoAcumulado += (on + off);
  }
  return padrao;
}

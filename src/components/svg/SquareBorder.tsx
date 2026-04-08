import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SquareBorderProps {
  progress: number; // 0 to 1
  color: string;
  faseAtual?: number; // 0 to 3
  cycleKey: number;
}

export const SquareBorder: React.FC<SquareBorderProps> = ({ progress, color, cycleKey }) => {
  // Path para um retângulo arredondado de 100x100 com raio de 20 (20%)
  // Começamos no topo esquerdo após o arredondamento: (20, 0)
  const pathData = "M 20,0 H 80 A 20 20 0 0 1 100 20 V 80 A 20 20 0 0 1 80 100 H 20 A 20 20 0 0 1 0 80 V 20 A 20 20 0 0 1 20 0 Z";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ 
          overflow: 'visible',
          filter: `drop-shadow(0 0 var(--glow-intensity) ${color})`,
          display: 'block' // Garante que o SVG não tenha espaços extras
        }}
      >
        {/* Esqueleto do Quadrado (Base) */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="20"
          ry="20"
          fill="none"
          stroke="white"
          style={{ 
            strokeOpacity: 'var(--square-base-opacity)',
            strokeWidth: '1px'
          }}
        />
        
        <AnimatePresence mode="wait">
          {/* Borda de Progresso Acumulado */}
          <motion.path
            key={`progress-${cycleKey}`}
            d={pathData}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: progress, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              pathLength: { duration: 0.1, ease: "linear" },
              opacity: { duration: 0.3 }
            }}
            style={{ 
              strokeWidth: 'var(--active-stroke-width)'
            }}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* Efeito secundário de glow interno/suave */}
          <motion.path
            key={`glow-${cycleKey}`}
            d={pathData}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: progress, 
              opacity: 0.6 // Simplified for now to avoid multiple var evaluation issues in transition
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              pathLength: { duration: 0.1, ease: "linear" },
              opacity: { duration: 0.3 }
            }}
            style={{ 
              strokeWidth: 'var(--active-stroke-width)',
              filter: 'blur(calc(var(--glow-intensity) / 2))'
            }}
          />
        </AnimatePresence>
      </svg>
    </div>
  );
};

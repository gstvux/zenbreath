import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisplayProps {
  label: string;
  tempoRestante: number;
  color: string;
  transitionMs?: number;
}

export const Display: React.FC<DisplayProps> = ({ label, tempoRestante, color, transitionMs = 1000 }) => {
  const seconds = Math.ceil(tempoRestante / 1000);

  return (
    <>
      {/* Camada 1: Timer (Centrado no quadrado) */}
      <div className="zen-layer">
        <div 
          className="timer-text font-thin transition-colors"
          style={{ 
            fontSize: 'min(150px, 15vw)', // Ocupa aproximadamente 60-80% do min-width de 250px
            color: color,
            opacity: 0.3,
            transform: 'translateY(-5%)',
            transitionDuration: `${transitionMs}ms`
          }}
        >
          {seconds}
        </div>
      </div>

      {/* Camada 2: Label (Base do quadrado) */}
      <div className="zen-layer" style={{ justifyContent: 'flex-end', paddingBottom: '15%' }}>
        <AnimatePresence mode="wait">
          <motion.h2
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: transitionMs / 1000 }}
            className="phase-label text-white text-[10px] md:text-xs lg:text-sm"
          >
            {label}
          </motion.h2>
        </AnimatePresence>
      </div>
    </>
  );
};

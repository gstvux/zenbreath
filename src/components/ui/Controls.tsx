import React from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlsProps {
  isPlaying: boolean;
  onToggle?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ isPlaying }) => {
  return (
    <div className="zen-layer">
      <AnimatePresence mode="wait">
        {!isPlaying && (
          <motion.div
            key="play"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-white"
          >
            <Play size={48} strokeWidth={1} fill="white" />
          </motion.div>
        )}
        {isPlaying && (
          <motion.div
            key="pause"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.6 }}
            className="text-white"
          >
            <Pause size={48} strokeWidth={1} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

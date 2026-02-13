'use client';

import { cn } from '@/lib/utils';
import { PanelLeft, PanelRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PanelToggleProps {
  position: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function PanelToggle({ position, isOpen, onToggle, className }: PanelToggleProps) {
  const isLeft = position === 'left';
  
  return (
    <motion.button
      initial={false}
      animate={{ 
        x: isOpen ? 0 : isLeft ? -4 : 4,
      }}
      onClick={onToggle}
      className={cn(
        'fixed z-40 flex items-center justify-center w-8 h-8 rounded-full',
        'bg-slate-800 border border-slate-700 shadow-lg',
        'text-slate-400 hover:text-white hover:bg-slate-700',
        'transition-colors',
        isLeft ? 'left-0' : 'right-0',
        'top-1/2 -translate-y-1/2',
        className
      )}
      style={{
        [isLeft ? 'marginLeft' : 'marginRight']: '-16px',
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: isLeft ? -90 : 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: isLeft ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <X className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: isLeft ? 90 : -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: isLeft ? -90 : 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isLeft ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelRight className="w-4 h-4" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default PanelToggle;

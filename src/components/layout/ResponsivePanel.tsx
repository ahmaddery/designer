'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ResponsivePanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  width?: string;
  mobileWidth?: string;
  title?: string;
  showOverlay?: boolean;
}

export function ResponsivePanel({
  isOpen,
  onClose,
  position,
  children,
  className,
  width = '280px',
  mobileWidth = '100%',
  title,
  showOverlay = true,
}: ResponsivePanelProps) {
  const isLeft = position === 'left';

  return (
    <>
      {/* Overlay for mobile */}
      {showOverlay && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />
          )}
        </AnimatePresence>
      )}

      {/* Panel */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : isLeft ? '-100%' : '100%',
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
        }}
        className={cn(
          'fixed lg:relative z-40 lg:z-auto',
          'h-full bg-slate-900/95 backdrop-blur-sm',
          isLeft ? 'left-0 border-r border-slate-800' : 'right-0 border-l border-slate-800',
          className
        )}
        style={{
          width: mobileWidth,
          maxWidth: '100vw',
        }}
      >
        {/* Mobile Header */}
        {title && (
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="font-semibold text-slate-200">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="h-full overflow-hidden flex flex-col">
          {children}
        </div>
      </motion.div>

      {/* Desktop panel wrapper with width */}
      <style jsx>{`
        @media (min-width: 1024px) {
          div[style*="${mobileWidth}"] {
            width: ${width} !important;
            position: relative !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </>
  );
}

export default ResponsivePanel;

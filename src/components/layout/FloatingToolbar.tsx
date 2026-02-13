'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus, Maximize, Grid3X3 } from 'lucide-react';

interface ToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

interface FloatingToolbarProps {
  actions: ToolbarAction[];
  position?: 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
}

export function FloatingToolbar({ 
  actions, 
  position = 'bottom-center',
  className 
}: FloatingToolbarProps) {
  const [expanded, setExpanded] = useState(false);

  const positionClasses = {
    'bottom-left': 'left-4',
    'bottom-center': 'left-1/2 -translate-x-1/2',
    'bottom-right': 'right-4',
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed bottom-4 z-30',
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={action.onClick}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
              action.variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
              action.variant === 'danger' && 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
              (!action.variant || action.variant === 'default') && [
                'text-slate-300 hover:text-white hover:bg-white/10',
                action.active && 'bg-blue-500/20 text-blue-400'
              ]
            )}
          >
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Preset toolbars for common use cases
interface ZoomToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  scale?: number;
  className?: string;
}

export function ZoomToolbar({ 
  onZoomIn, 
  onZoomOut, 
  onFitView, 
  scale = 100,
  className 
}: ZoomToolbarProps) {
  return (
    <FloatingToolbar
      position="bottom-left"
      className={className}
      actions={[
        {
          id: 'zoom-out',
          icon: <Minus className="w-4 h-4" />,
          label: 'Zoom Out',
          onClick: onZoomOut,
        },
        {
          id: 'scale',
          icon: <span className="text-xs min-w-[40px] text-center">{scale}%</span>,
          label: `${scale}%`,
          onClick: onFitView,
        },
        {
          id: 'zoom-in',
          icon: <Plus className="w-4 h-4" />,
          label: 'Zoom In',
          onClick: onZoomIn,
        },
        {
          id: 'fit',
          icon: <Maximize className="w-4 h-4" />,
          label: 'Fit',
          onClick: onFitView,
        },
      ]}
    />
  );
}

interface CanvasToolbarProps {
  onAdd: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleGrid?: () => void;
  showGrid?: boolean;
  scale?: number;
  className?: string;
}

export function CanvasToolbar({
  onAdd,
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  showGrid = true,
  scale = 100,
  className,
}: CanvasToolbarProps) {
  const actions: ToolbarAction[] = [
    {
      id: 'add',
      icon: <Plus className="w-4 h-4" />,
      label: 'Add',
      onClick: onAdd,
      variant: 'primary',
    },
    {
      id: 'zoom-out',
      icon: <Minus className="w-4 h-4" />,
      label: '',
      onClick: onZoomOut,
    },
    {
      id: 'scale',
      icon: <span className="text-xs min-w-[40px] text-center">{scale}%</span>,
      label: `${scale}%`,
      onClick: onFitView,
    },
    {
      id: 'zoom-in',
      icon: <Plus className="w-4 h-4" />,
      label: '',
      onClick: onZoomIn,
    },
  ];

  if (onToggleGrid) {
    actions.push({
      id: 'grid',
      icon: <Grid3X3 className="w-4 h-4" />,
      label: '',
      onClick: onToggleGrid,
      active: showGrid,
    });
  }

  return (
    <FloatingToolbar
      position="bottom-center"
      className={className}
      actions={actions}
    />
  );
}

export default FloatingToolbar;

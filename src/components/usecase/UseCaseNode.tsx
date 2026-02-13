'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { UseCaseNode as UseCaseNodeType } from '@/types/usecase';
import { User, StickyNote } from 'lucide-react';

interface BaseNodeProps {
  node: UseCaseNodeType;
  isSelected: boolean;
  onClick: () => void;
}

// Actor Node Component (Stick Figure Style)
function ActorNode({ node, isSelected, onClick }: BaseNodeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 cursor-pointer group",
        isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 rounded-lg"
      )}
      style={{ 
        width: node.size.width, 
        minHeight: node.size.height,
      }}
    >
      {/* Stick Figure SVG */}
      <svg
        width="48"
        height="64"
        viewBox="0 0 48 64"
        fill="none"
        className="transition-transform group-hover:scale-105"
      >
        {/* Head */}
        <circle
          cx="24"
          cy="8"
          r="6"
          stroke={node.data.color || '#94A3B8'}
          strokeWidth="2"
          fill="none"
        />
        {/* Body */}
        <line
          x1="24"
          y1="14"
          x2="24"
          y2="36"
          stroke={node.data.color || '#94A3B8'}
          strokeWidth="2"
        />
        {/* Arms */}
        <line
          x1="8"
          y1="22"
          x2="40"
          y2="22"
          stroke={node.data.color || '#94A3B8'}
          strokeWidth="2"
        />
        {/* Left Leg */}
        <line
          x1="24"
          y1="36"
          x2="10"
          y2="56"
          stroke={node.data.color || '#94A3B8'}
          strokeWidth="2"
        />
        {/* Right Leg */}
        <line
          x1="24"
          y1="36"
          x2="38"
          y2="56"
          stroke={node.data.color || '#94A3B8'}
          strokeWidth="2"
        />
      </svg>
      {/* Actor Name */}
      <div className="text-center px-2">
        <span className={cn(
          "text-sm font-medium text-slate-200",
          isSelected && "text-blue-400"
        )}>
          {node.data.name}
        </span>
        {node.data.stereotype && (
          <p className="text-[10px] text-slate-500">{node.data.stereotype}</p>
        )}
      </div>
    </div>
  );
}

// Use Case Node Component (Ellipse)
function UseCaseNodeComponent({ node, isSelected, onClick }: BaseNodeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center cursor-pointer",
        isSelected && "scale-105"
      )}
      style={{ 
        width: node.size.width, 
        height: node.size.height,
      }}
    >
      {/* Ellipse Background */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 transition-all",
          isSelected
            ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
            : "border-slate-600 bg-slate-800/50 group-hover:border-slate-500"
        )}
        style={{ borderColor: isSelected ? undefined : node.data.color }}
      />
      
      {/* Text Content */}
      <div className="relative z-10 text-center px-4 max-w-full">
        {node.data.stereotype && (
          <p className="text-[10px] text-slate-500 mb-0.5">«{node.data.stereotype}»</p>
        )}
        <span className={cn(
          "text-sm font-medium truncate block",
          isSelected ? "text-blue-400" : "text-slate-200"
        )}>
          {node.data.name}
        </span>
      </div>
    </div>
  );
}

// System Boundary Node Component (Rectangle with tab)
function SystemNode({ node, isSelected, onClick }: BaseNodeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer",
        isSelected && "scale-[1.02]"
      )}
      style={{ 
        width: node.size.width, 
        height: node.size.height,
      }}
    >
      {/* Border */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg border-2 transition-all",
          isSelected
            ? "border-blue-400 bg-blue-500/5"
            : "border-amber-500/50 bg-slate-900/30"
        )}
      />
      
      {/* Tab with system name */}
      <div
        className={cn(
          "absolute -top-3 left-4 px-3 py-1 rounded-md text-xs font-medium",
          isSelected
            ? "bg-blue-500 text-white"
            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
        )}
      >
        {node.data.name}
      </div>
      
      {/* Content area - could contain other elements */}
      <div className="absolute inset-0 mt-4 p-4 overflow-hidden">
        {node.data.description && (
          <p className="text-[10px] text-slate-500">{node.data.description}</p>
        )}
      </div>
    </div>
  );
}

// Note Node Component
function NoteNode({ node, isSelected, onClick }: BaseNodeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer p-3 transition-all",
        isSelected && "scale-[1.02]"
      )}
      style={{ 
        width: node.size.width, 
        height: node.size.height,
      }}
    >
      {/* Note background with folded corner effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg transition-all",
          isSelected
            ? "bg-purple-500/20 border-2 border-purple-400"
            : "bg-yellow-500/10 border border-yellow-500/30"
        )}
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}
      />
      
      {/* Folded corner */}
      <div
        className={cn(
          "absolute top-0 right-0 w-4 h-4 transition-all",
          isSelected
            ? "bg-purple-400"
            : "bg-yellow-500/40"
        )}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full overflow-hidden">
        <div className="flex items-center gap-1.5 mb-1.5">
          <StickyNote className="w-3 h-3 text-yellow-500/70" />
          <span className={cn(
            "text-xs font-medium",
            isSelected ? "text-purple-400" : "text-yellow-500/80"
          )}>
            {node.data.name}
          </span>
        </div>
        {node.data.description && (
          <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3">
            {node.data.description}
          </p>
        )}
      </div>
    </div>
  );
}

// Main UseCaseNode Component
interface UseCaseNodeProps {
  node: UseCaseNodeType;
  isSelected: boolean;
  onClick: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export default function UseCaseNode({ 
  node, 
  isSelected, 
  onClick, 
  onMouseDown,
  style 
}: UseCaseNodeProps) {
  const renderNode = () => {
    const baseProps = { node, isSelected, onClick };
    
    switch (node.type) {
      case 'ACTOR':
        return <ActorNode {...baseProps} />;
      case 'USECASE':
        return <UseCaseNodeComponent {...baseProps} />;
      case 'SYSTEM':
        return <SystemNode {...baseProps} />;
      case 'NOTE':
        return <NoteNode {...baseProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute select-none"
      style={{
        left: node.position.x,
        top: node.position.y,
        ...style,
      }}
      onMouseDown={onMouseDown}
    >
      {renderNode()}
    </div>
  );
}

// Export individual node types for direct use
export { ActorNode, UseCaseNodeComponent, SystemNode, NoteNode };

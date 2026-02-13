'use client';

import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { UseCaseEdge as UseCaseEdgeType, UseCaseNode } from '@/types/usecase';

interface UseCaseEdgeProps {
  edge: UseCaseEdgeType;
  sourceNode: UseCaseNode;
  targetNode: UseCaseNode;
  isSelected: boolean;
  onClick: () => void;
}

// Calculate intersection point between line and rectangle/ellipse
function getIntersectionPoint(
  source: UseCaseNode,
  target: UseCaseNode,
  isSourceEllipse: boolean,
  isTargetEllipse: boolean
): { x1: number; y1: number; x2: number; y2: number } {
  const sx = source.position.x + source.size.width / 2;
  const sy = source.position.y + source.size.height / 2;
  const tx = target.position.x + target.size.width / 2;
  const ty = target.position.y + target.size.height / 2;

  const dx = tx - sx;
  const dy = ty - sy;
  const angle = Math.atan2(dy, dx);

  // Source point
  let x1: number, y1: number;
  if (isSourceEllipse) {
    // Ellipse intersection
    const a = source.size.width / 2;
    const b = source.size.height / 2;
    x1 = sx + a * Math.cos(angle);
    y1 = sy + b * Math.sin(angle);
  } else {
    // Rectangle intersection
    const hw = source.size.width / 2;
    const hh = source.size.height / 2;
    const absAngle = Math.abs(angle);
    const tanAngle = Math.abs(Math.tan(angle));
    
    if (hw * tanAngle <= hh) {
      // Intersects with left or right side
      x1 = sx + (Math.cos(angle) > 0 ? hw : -hw);
      y1 = sy + hw * tanAngle * (Math.sin(angle) > 0 ? 1 : -1);
    } else {
      // Intersects with top or bottom side
      x1 = sx + hh / tanAngle * (Math.cos(angle) > 0 ? 1 : -1);
      y1 = sy + (Math.sin(angle) > 0 ? hh : -hh);
    }
  }

  // Target point (reverse angle)
  const reverseAngle = angle + Math.PI;
  let x2: number, y2: number;
  if (isTargetEllipse) {
    const a = target.size.width / 2;
    const b = target.size.height / 2;
    x2 = tx + a * Math.cos(reverseAngle);
    y2 = ty + b * Math.sin(reverseAngle);
  } else {
    const hw = target.size.width / 2;
    const hh = target.size.height / 2;
    const tanAngle = Math.abs(Math.tan(reverseAngle));
    
    if (hw * tanAngle <= hh) {
      x2 = tx + (Math.cos(reverseAngle) > 0 ? hw : -hw);
      y2 = ty + hw * tanAngle * (Math.sin(reverseAngle) > 0 ? 1 : -1);
    } else {
      x2 = tx + hh / tanAngle * (Math.cos(reverseAngle) > 0 ? 1 : -1);
      y2 = ty + (Math.sin(reverseAngle) > 0 ? hh : -hh);
    }
  }

  return { x1, y1, x2, y2 };
}

function UseCaseEdge({ edge, sourceNode, targetNode, isSelected, onClick }: UseCaseEdgeProps) {
  const points = useMemo(() => {
    const isSourceEllipse = sourceNode.type === 'USECASE';
    const isTargetEllipse = targetNode.type === 'USECASE';
    return getIntersectionPoint(sourceNode, targetNode, isSourceEllipse, isTargetEllipse);
  }, [sourceNode, targetNode]);

  const { x1, y1, x2, y2 } = points;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Arrow marker based on edge type
  const getMarkerEnd = () => {
    switch (edge.type) {
      case 'GENERALIZATION':
        return 'url(#arrowhead-triangle)';
      case 'DEPENDENCY':
      case 'INCLUDE':
      case 'EXTEND':
        return 'url(#arrowhead-open)';
      default:
        return undefined;
    }
  };

  // Line style based on edge type
  const getLineStyle = () => {
    switch (edge.type) {
      case 'DEPENDENCY':
      case 'INCLUDE':
      case 'EXTEND':
        return { strokeDasharray: '8,4' };
      default:
        return {};
    }
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      style={{ zIndex: isSelected ? 20 : 1 }}
    >
      <defs>
        {/* Arrowhead for generalization (filled triangle) */}
        <marker
          id="arrowhead-triangle"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <polygon
            points="0 0, 12 6, 0 12"
            fill={isSelected ? '#60A5FA' : '#64748B'}
            stroke={isSelected ? '#60A5FA' : '#64748B'}
            strokeWidth="1"
          />
        </marker>
        
        {/* Open arrowhead for dependency */}
        <marker
          id="arrowhead-open"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <polyline
            points="0 0, 12 6, 0 12"
            fill="none"
            stroke={isSelected ? '#60A5FA' : '#64748B'}
            strokeWidth="1.5"
          />
        </marker>
      </defs>

      {/* Invisible wider line for easier clicking */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth="20"
        className="pointer-events-auto cursor-pointer"
        onClick={onClick}
      />

      {/* Visible line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isSelected ? '#60A5FA' : '#64748B'}
        strokeWidth={isSelected ? 2.5 : 1.5}
        markerEnd={getMarkerEnd()}
        className="pointer-events-none transition-all duration-200"
        style={getLineStyle()}
      />

      {/* Label background */}
      {edge.label && (
        <>
          <rect
            x={midX - 30}
            y={midY - 10}
            width="60"
            height="20"
            rx="4"
            fill="#0F172A"
            opacity="0.9"
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            className={cn(
              "text-[11px] font-medium pointer-events-auto cursor-pointer select-none",
              isSelected ? "fill-blue-400" : "fill-slate-400"
            )}
            onClick={onClick}
          >
            {edge.label}
          </text>
        </>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <circle
          cx={x1}
          cy={y1}
          r="4"
          fill="#60A5FA"
        />
      )}
      {isSelected && (
        <circle
          cx={x2}
          cy={y2}
          r="4"
          fill="#60A5FA"
        />
      )}
    </svg>
  );
}

export default memo(UseCaseEdge);

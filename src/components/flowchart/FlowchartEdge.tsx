'use client';

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from '@xyflow/react';
import { useFlowchartStore } from '@/store/flowchartStore';
import { cn } from '@/lib/utils';
import { X, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default memo(function FlowchartEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
  selected,
}: EdgeProps) {
  const [showControls, setShowControls] = useState(false);
  
  const selectedEdgeId = useFlowchartStore((state) => state.selectedEdgeId);
  const selectEdge = useFlowchartStore((state) => state.selectEdge);
  const deleteEdge = useFlowchartStore((state) => state.deleteEdge);
  const updateEdge = useFlowchartStore((state) => state.updateEdge);
  const updateEdgeData = useFlowchartStore((state) => state.updateEdgeData);
  
  const isSelected = selectedEdgeId === id || selected;

  // Get edge type from data
  const edgeType = (data?.type as string) || 'smooth';
  const color = (data?.color as string) || '#64748B';
  const strokeWidth = (data?.strokeWidth as number) || 2;
  const strokeStyle = (data?.strokeStyle as string) || 'solid';
  const startArrow = (data?.startArrow as boolean) || false;
  const endArrow = (data?.endArrow as boolean) !== false; // default true

  // Calculate path based on edge type
  let edgePath = '';
  let labelX = 0;
  let labelY = 0;

  switch (edgeType) {
    case 'straight':
      [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      break;
    case 'step':
      [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 0,
      });
      break;
    case 'smooth':
    default:
      [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: 0.3,
      });
      break;
  }

  const handleDelete = () => {
    if (id) {
      deleteEdge(id);
    }
  };

  const handleTypeChange = (newType: string) => {
    if (id) {
      updateEdge(id, { type: newType as any });
    }
  };

  const markerStart = startArrow ? `url(#arrow-start-${id})` : undefined;
  const markerEnd = endArrow ? `url(#arrow-end-${id})` : undefined;

  const dashArray = strokeStyle === 'dashed' ? '8,4' : strokeStyle === 'dotted' ? '2,4' : undefined;

  return (
    <>
      {/* Marker definitions */}
      <defs>
        <marker
          id={`arrow-start-${id}`}
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M10,0 L0,3 L10,6" fill="none" stroke={color} strokeWidth="1.5" />
        </marker>
        <marker
          id={`arrow-end-${id}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L10,3 L0,6" fill="none" stroke={color} strokeWidth="1.5" />
        </marker>
      </defs>

      <BaseEdge
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: isSelected ? strokeWidth + 1 : strokeWidth,
          strokeDasharray: dashArray,
        }}
        markerStart={markerStart}
        markerEnd={markerEnd}
        className="transition-all duration-200"
      />

      {/* Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className="nodrag nopan"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <AnimatePresence>
            {(showControls || isSelected) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  'flex items-center gap-1 p-1 rounded-lg',
                  'bg-slate-800 border border-slate-600 shadow-xl'
                )}
              >
                {/* Type selector */}
                <select
                  value={edgeType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] bg-slate-700 text-slate-200 rounded px-1.5 py-0.5 border-none outline-none cursor-pointer"
                >
                  <option value="smooth">Smooth</option>
                  <option value="straight">Straight</option>
                  <option value="step">Step</option>
                </select>

                {/* Arrow toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateEdgeData(id, { endArrow: !endArrow });
                  }}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors",
                    endArrow ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"
                  )}
                >
                  →
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </EdgeLabelRenderer>

      {/* Invisible wider edge for easier selection */}
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={15}
        fill="none"
        className="cursor-pointer"
        onClick={() => id && selectEdge(id)}
      />
    </>
  );
});

'use client';

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import { useERDStore } from '@/store/erdStore';
import { RelationType } from '@/types';
import { cn } from '@/lib/utils';
import { X, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RelationEdgeData extends Record<string, unknown> {
  relationId: string;
  type: RelationType;
  onDelete?: () => void;
}

const getRelationSymbols = (type: RelationType) => {
  switch (type) {
    case 'ONE_TO_ONE':
      return { source: '1', target: '1' };
    case 'ONE_TO_MANY':
      return { source: '1', target: '∞' };
    case 'MANY_TO_MANY':
      return { source: '∞', target: '∞' };
    default:
      return { source: '1', target: '*' };
  }
};

const getEdgeStyle = (type: RelationType, isSelected: boolean) => {
  const baseStyle = {
    strokeWidth: isSelected ? 3 : 2,
    stroke: isSelected ? '#60A5FA' : '#94A3B8',
  };

  switch (type) {
    case 'ONE_TO_ONE':
      return { ...baseStyle, strokeDasharray: undefined };
    case 'ONE_TO_MANY':
      return { ...baseStyle, strokeDasharray: undefined };
    case 'MANY_TO_MANY':
      return { ...baseStyle, strokeDasharray: '8,4' };
    default:
      return baseStyle;
  }
};

function RelationEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const { relationId, type = 'ONE_TO_MANY' } = (data || {}) as RelationEdgeData;
  const [showControls, setShowControls] = useState(false);
  
  const selectedRelationId = useERDStore((state) => state.selectedRelationId);
  const selectRelation = useERDStore((state) => state.selectRelation);
  const deleteRelation = useERDStore((state) => state.deleteRelation);
  const updateRelation = useERDStore((state) => state.updateRelation);
  
  const isSelected = selectedRelationId === relationId || selected;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.3,
  });

  const symbols = getRelationSymbols(type);
  const edgeStyle = getEdgeStyle(type, isSelected ?? false);

  const handleDelete = () => {
    if (relationId) {
      deleteRelation(relationId);
    }
  };

  const handleTypeChange = (newType: RelationType) => {
    if (relationId) {
      updateRelation(relationId, { type: newType });
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={edgeStyle}
        className="transition-all duration-200"
      />
      
      {/* Relation symbols */}
      <EdgeLabelRenderer>
        {/* Source symbol */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourceX}px, ${sourceY}px)`,
            pointerEvents: 'none',
          }}
          className={cn(
            'w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold',
            'bg-slate-800 border border-slate-600 text-slate-300'
          )}
        >
          {symbols.source}
        </div>

        {/* Target symbol */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetX}px, ${targetY}px)`,
            pointerEvents: 'none',
          }}
          className={cn(
            'w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold',
            'bg-slate-800 border border-slate-600 text-slate-300'
          )}
        >
          {symbols.target}
        </div>

        {/* Label / Controls */}
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
            {showControls || isSelected ? (
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
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value as RelationType)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] bg-slate-700 text-slate-200 rounded px-1.5 py-0.5 border-none outline-none cursor-pointer"
                >
                  <option value="ONE_TO_ONE">1:1</option>
                  <option value="ONE_TO_MANY">1:N</option>
                  <option value="MANY_TO_MANY">N:N</option>
                </select>

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
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-medium',
                  'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                )}
              >
                {type === 'ONE_TO_ONE' && '1:1'}
                {type === 'ONE_TO_MANY' && '1:N'}
                {type === 'MANY_TO_MANY' && 'N:N'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </EdgeLabelRenderer>

      {/* Invisible wider edge for easier selection */}
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        className="cursor-pointer"
        onClick={() => relationId && selectRelation(relationId)}
      />
    </>
  );
}

export default memo(RelationEdgeComponent);

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useUseCaseStore } from '@/store/usecaseStore';
import UseCaseNode from './UseCaseNode';
import UseCaseEdge from './UseCaseEdge';
import type { UseCaseNodeType, UseCaseEdgeType } from '@/types/usecase';
import { cn } from '@/lib/utils';
import { 
  MousePointer2, 
  Move, 
  Trash2, 
  ZoomIn, 
  ZoomOut,
  Maximize,
  Hand
} from 'lucide-react';

type CanvasMode = 'select' | 'connect' | 'pan';
type ConnectionState = {
  sourceId: string | null;
  sourceHandle: string | null;
};

export default function UseCaseCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CanvasMode>('select');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [connection, setConnection] = useState<ConnectionState>({ sourceId: null, sourceHandle: null });
  const [dragState, setDragState] = useState<{
    nodeId: string | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({ nodeId: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    addNode,
    moveNode,
    addEdge,
    selectNode,
    selectEdge,
    deleteNode,
    deleteEdge,
  } = useUseCaseStore();

  // Handle drag from shape library
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const type = (window as any).draggedShapeType as UseCaseNodeType;
      
      if (type) {
        const x = (e.clientX - rect.left - pan.x) / scale - 40;
        const y = (e.clientY - rect.top - pan.y) / scale - 30;
        addNode(type, { x, y });
      }
      
      delete (window as any).draggedShapeType;
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('dragover', handleDragOver);
      canvas.addEventListener('drop', handleDrop);
      return () => {
        canvas.removeEventListener('dragover', handleDragOver);
        canvas.removeEventListener('drop', handleDrop);
      };
    }
  }, [addNode, pan, scale]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          deleteEdge(selectedEdgeId);
        }
      }
      
      if (e.key === 'Escape') {
        selectNode(null);
        selectEdge(null);
        setConnection({ sourceId: null, sourceHandle: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge, selectNode, selectEdge]);

  // Mouse handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode === 'pan' || (e.button === 1) || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setDragState(prev => ({
        ...prev,
        startX: e.clientX,
        startY: e.clientY,
        initialX: pan.x,
        initialY: pan.y,
      }));
      e.preventDefault();
    } else if (mode === 'select' && e.target === canvasRef.current) {
      selectNode(null);
      selectEdge(null);
    }
  }, [mode, pan.x, pan.y, selectNode, selectEdge]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      setPan({
        x: dragState.initialX + dx,
        y: dragState.initialY + dy,
      });
    } else if (dragState.nodeId) {
      const dx = (e.clientX - dragState.startX) / scale;
      const dy = (e.clientY - dragState.startY) / scale;
      moveNode(dragState.nodeId, {
        x: dragState.initialX + dx,
        y: dragState.initialY + dy,
      });
    }
  }, [isPanning, dragState, scale, moveNode]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDragState({ nodeId: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  }, []);

  // Node drag handlers
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (mode === 'connect') {
      // Start connection
      if (!connection.sourceId) {
        setConnection({ sourceId: nodeId, sourceHandle: 'center' });
      } else if (connection.sourceId !== nodeId) {
        // Complete connection
        addEdge('ASSOCIATION', connection.sourceId, nodeId);
        setConnection({ sourceId: null, sourceHandle: null });
      }
      e.stopPropagation();
    } else if (mode === 'select') {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        selectNode(nodeId);
        setDragState({
          nodeId,
          startX: e.clientX,
          startY: e.clientY,
          initialX: node.position.x,
          initialY: node.position.y,
        });
      }
      e.stopPropagation();
    }
  }, [mode, connection, nodes, selectNode, addEdge]);

  // Zoom handlers
  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.3));
  const handleZoomReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(s => Math.min(Math.max(s * delta, 0.3), 3));
    }
  }, []);

  return (
    <div 
      className="relative flex-1 bg-slate-950 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Canvas Background */}
      <div
        ref={canvasRef}
        className={cn(
          "absolute inset-0",
          mode === 'pan' && "cursor-grab",
          isPanning && "cursor-grabbing",
          mode === 'connect' && "cursor-crosshair"
        )}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(71, 85, 105, 0.3) 1px, transparent 0)
          `,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
        }}
      >
        {/* Transform Container */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          {/* Edges */}
          {edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.sourceId);
            const targetNode = nodes.find(n => n.id === edge.targetId);
            if (!sourceNode || !targetNode) return null;
            
            return (
              <UseCaseEdge
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                isSelected={selectedEdgeId === edge.id}
                onClick={() => {
                  selectEdge(edge.id);
                  selectNode(null);
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <UseCaseNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onClick={() => {
                if (mode === 'select') {
                  selectNode(node.id);
                  selectEdge(null);
                }
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            />
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex flex-col bg-slate-900/95 border border-slate-800 rounded-xl p-1.5 shadow-lg">
          <button
            onClick={() => setMode('select')}
            className={cn(
              "p-2.5 rounded-lg transition-all",
              mode === 'select'
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
            title="Select (V)"
          >
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('pan')}
            className={cn(
              "p-2.5 rounded-lg transition-all",
              mode === 'pan'
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
            title="Pan (H)"
          >
            <Hand className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMode('connect');
              setConnection({ sourceId: null, sourceHandle: null });
            }}
            className={cn(
              "p-2.5 rounded-lg transition-all",
              mode === 'connect'
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
            title="Connect (C)"
          >
            <Move className="w-4 h-4" />
          </button>
        </div>

        {/* Delete button when selection */}
        {(selectedNodeId || selectedEdgeId) && (
          <button
            onClick={() => {
              if (selectedNodeId) deleteNode(selectedNodeId);
              if (selectedEdgeId) deleteEdge(selectedEdgeId);
            }}
            className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all shadow-lg"
            title="Delete (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="flex items-center bg-slate-900/95 border border-slate-800 rounded-xl p-1 shadow-lg">
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors min-w-[60px]"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleZoomReset}
          className="p-2 bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all shadow-lg"
          title="Fit to view"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {mode === 'connect' && (
          <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
            {connection.sourceId ? 'Click target element' : 'Click source element'}
          </div>
        )}
        <div className="px-3 py-1.5 bg-slate-900/95 border border-slate-800 rounded-lg text-xs text-slate-400">
          {nodes.length} nodes · {edges.length} edges
        </div>
      </div>

      {/* Connection line preview */}
      {mode === 'connect' && connection.sourceId && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setConnection({ sourceId: null, sourceHandle: null })}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
          >
            Cancel connection
          </button>
        </div>
      )}
    </div>
  );
}

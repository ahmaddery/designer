'use client';

import { useUseCaseStore } from '@/store/usecaseStore';
import { USECASE_COLORS } from '@/types/usecase';
import { cn } from '@/lib/utils';
import { 
  Trash2, 
  User, 
  Circle, 
  Square, 
  StickyNote,
  ArrowRight,
  Settings2
} from 'lucide-react';

export default function PropertiesPanel() {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNode,
    updateEdge,
    deleteNode,
    deleteEdge,
  } = useUseCaseStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-full h-full bg-slate-900/95 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-200">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6">
          <Settings2 className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm text-center">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    );
  }

  // Node Properties
  if (selectedNode) {
    return (
      <div className="w-full h-full bg-slate-900/95 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedNode.type === 'ACTOR' && <User className="w-4 h-4 text-blue-400" />}
              {selectedNode.type === 'USECASE' && <Circle className="w-4 h-4 text-emerald-400" />}
              {selectedNode.type === 'SYSTEM' && <Square className="w-4 h-4 text-amber-400" />}
              {selectedNode.type === 'NOTE' && <StickyNote className="w-4 h-4 text-purple-400" />}
              <h2 className="text-sm font-semibold text-slate-200">
                {selectedNode.type === 'ACTOR' && 'Actor'}
                {selectedNode.type === 'USECASE' && 'Use Case'}
                {selectedNode.type === 'SYSTEM' && 'System'}
                {selectedNode.type === 'NOTE' && 'Note'}
              </h2>
            </div>
            <button
              onClick={() => deleteNode(selectedNode.id)}
              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Properties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">
              Name
            </label>
            <input
              type="text"
              value={selectedNode.data.name}
              onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">
              Description
            </label>
            <textarea
              value={selectedNode.data.description || ''}
              onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
              rows={3}
              placeholder="Add a description..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Stereotype (for UseCase only) */}
          {selectedNode.type === 'USECASE' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                Stereotype
              </label>
              <input
                type="text"
                value={selectedNode.data.stereotype || ''}
                onChange={(e) => updateNode(selectedNode.id, { stereotype: e.target.value })}
                placeholder="e.g., abstract"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          )}

          {/* Color picker */}
          {selectedNode.type !== 'SYSTEM' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                Color
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {USECASE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateNode(selectedNode.id, { color })}
                    className={cn(
                      "w-8 h-8 rounded-lg transition-all",
                      selectedNode.data.color === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Position info */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Position & Size
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">X</label>
                <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                  {Math.round(selectedNode.position.x)}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">Y</label>
                <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                  {Math.round(selectedNode.position.y)}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">Width</label>
                <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                  {selectedNode.size.width}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">Height</label>
                <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                  {selectedNode.size.height}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edge Properties
  if (selectedEdge) {
    const edgeTypes = [
      { value: 'ASSOCIATION', label: 'Association' },
      { value: 'INCLUDE', label: '«include»' },
      { value: 'EXTEND', label: '«extend»' },
      { value: 'GENERALIZATION', label: 'Generalization' },
      { value: 'DEPENDENCY', label: 'Dependency' },
    ];

    return (
      <div className="w-full h-full bg-slate-900/95 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">Relationship</h2>
            </div>
            <button
              onClick={() => deleteEdge(selectedEdge.id)}
              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Properties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">
              Type
            </label>
            <select
              value={selectedEdge.type}
              onChange={(e) => updateEdge(selectedEdge.id, { type: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              {edgeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">
              Label
            </label>
            <input
              type="text"
              value={selectedEdge.label || ''}
              onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
              placeholder="Add a label..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Connected Nodes Info */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Connected Elements
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                <span className="text-[10px] text-slate-500 w-12">Source</span>
                <span className="text-sm text-slate-300 truncate">
                  {nodes.find(n => n.id === selectedEdge.sourceId)?.data.name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                <span className="text-[10px] text-slate-500 w-12">Target</span>
                <span className="text-sm text-slate-300 truncate">
                  {nodes.find(n => n.id === selectedEdge.targetId)?.data.name || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

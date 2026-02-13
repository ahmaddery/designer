'use client';

import { useState } from 'react';
import { useFlowchartStore } from '@/store/flowchartStore';
import { cn } from '@/lib/utils';
import { 
  X, 
  Settings2, 
  Trash2,
  Type,
  Palette,
  Layout,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Copy,
  Maximize2,
  Move,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOWCHART_COLORS, type FlowchartEdgeType } from '@/types/flowchart';

export default function FlowchartPropertiesPanel() {
  const [activeTab, setActiveTab] = useState<'node' | 'edge' | 'style'>('node');
  
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNode,
    updateNodeData,
    updateEdge,
    updateEdgeData,
    deleteNode,
    deleteEdge,
    duplicateNode,
    bringToFront,
    sendToBack,
    clearSelection,
  } = useFlowchartStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  // Update active tab based on selection
  if (selectedEdge && activeTab !== 'edge') {
    setActiveTab('edge');
  } else if (selectedNode && activeTab !== 'node' && activeTab !== 'style') {
    setActiveTab('node');
  }

  const hasSelection = selectedNode || selectedEdge;

  if (!hasSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full h-full bg-slate-900/95 backdrop-blur-sm flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h2 className="font-semibold text-slate-200">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
            <Settings2 className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">
            Select a node or connection to edit its properties
          </p>
          <div className="mt-6 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-700" />
              <span>Drag shapes from the left panel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
              <span>Connect nodes by dragging handles</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full bg-slate-900/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {selectedEdge ? (
            <>
              <Link2 className="w-4 h-4 text-blue-400" />
              <h2 className="font-semibold text-slate-200">Connection</h2>
            </>
          ) : (
            <>
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: selectedNode?.data.color || '#3B82F6' }}
              />
              <h2 className="font-semibold text-slate-200">Node</h2>
            </>
          )}
        </div>
        <button
          onClick={clearSelection}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      {selectedNode && (
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('node')}
            className={cn(
              'flex-1 px-4 py-2 text-xs font-medium transition-colors',
              activeTab === 'node' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={cn(
              'flex-1 px-4 py-2 text-xs font-medium transition-colors',
              activeTab === 'style' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Style
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* Node Properties - Content Tab */}
          {selectedNode && activeTab === 'node' && (
            <motion.div
              key="node-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Label */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  Label
                </label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter label..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={selectedNode.data.description || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Add description..."
                />
              </div>

              {/* Node Type Info */}
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Type</span>
                <p className="text-sm text-slate-300 mt-1 capitalize">
                  {selectedNode.type.replace('-', ' ')}
                </p>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Width
                  </label>
                  <input
                    type="number"
                    value={selectedNode.size.width}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      size: { ...selectedNode.size, width: parseInt(e.target.value) || 100 }
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Height
                  </label>
                  <input
                    type="number"
                    value={selectedNode.size.height}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      size: { ...selectedNode.size, height: parseInt(e.target.value) || 60 }
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5" />
                    X Position
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.position.x)}
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5" />
                    Y Position
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.position.y)}
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500"
                  />
                </div>
              </div>

              {/* Layer Controls */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Layer Order
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => bringToFront(selectedNode.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    To Front
                  </button>
                  <button
                    onClick={() => sendToBack(selectedNode.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    To Back
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => duplicateNode(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Node
                </button>
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Node
                </button>
              </div>
            </motion.div>
          )}

          {/* Node Properties - Style Tab */}
          {selectedNode && activeTab === 'style' && (
            <motion.div
              key="node-style"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Fill Color */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Fill Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLOWCHART_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateNodeData(selectedNode.id, { color })}
                      className={cn(
                        'w-8 h-8 rounded-lg transition-all hover:scale-110',
                        selectedNode.data.color === color 
                          ? 'ring-2 ring-white shadow-lg' 
                          : 'hover:ring-2 hover:ring-white/50'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Border Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLOWCHART_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateNodeData(selectedNode.id, { borderColor: color })}
                      className={cn(
                        'w-6 h-6 rounded-full transition-all hover:scale-110',
                        selectedNode.data.borderColor === color 
                          ? 'ring-2 ring-white' 
                          : 'hover:ring-2 hover:ring-white/50'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateNodeData(selectedNode.id, { textColor: '#FFFFFF' })}
                    className={cn(
                      'w-8 h-8 rounded-lg bg-white border-2',
                      selectedNode.data.textColor === '#FFFFFF' ? 'border-blue-500' : 'border-slate-600'
                    )}
                  />
                  <button
                    onClick={() => updateNodeData(selectedNode.id, { textColor: '#0F172A' })}
                    className={cn(
                      'w-8 h-8 rounded-lg bg-slate-900 border-2',
                      selectedNode.data.textColor === '#0F172A' ? 'border-blue-500' : 'border-slate-600'
                    )}
                  />
                  <button
                    onClick={() => updateNodeData(selectedNode.id, { textColor: '#94A3B8' })}
                    className={cn(
                      'w-8 h-8 rounded-lg bg-slate-400 border-2',
                      selectedNode.data.textColor === '#94A3B8' ? 'border-blue-500' : 'border-slate-600'
                    )}
                  />
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Font Size: {selectedNode.data.fontSize || 14}px
                </label>
                <input
                  type="range"
                  min={10}
                  max={24}
                  value={selectedNode.data.fontSize || 14}
                  onChange={(e) => updateNodeData(selectedNode.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Border Width */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Border Width: {selectedNode.data.borderWidth || 2}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={selectedNode.data.borderWidth || 2}
                  onChange={(e) => updateNodeData(selectedNode.id, { borderWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Border Style */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Border Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateNodeData(selectedNode.id, { borderStyle: style })}
                      className={cn(
                        'px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize',
                        selectedNode.data.borderStyle === style
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Opacity: {Math.round((selectedNode.data.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min={0.2}
                  max={1}
                  step={0.1}
                  value={selectedNode.data.opacity || 1}
                  onChange={(e) => updateNodeData(selectedNode.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  Rotation: {selectedNode.rotation || 0}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={selectedNode.rotation || 0}
                  onChange={(e) => updateNode(selectedNode.id, { rotation: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          {/* Edge Properties */}
          {selectedEdge && (
            <motion.div
              key="edge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Edge Type */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Connection Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['smooth', 'straight', 'step'] as FlowchartEdgeType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateEdge(selectedEdge.id, { type })}
                      className={cn(
                        'px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize',
                        selectedEdge.type === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Color */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Line Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLOWCHART_COLORS.slice(0, 8).map((color) => (
                    <button
                      key={color}
                      onClick={() => updateEdgeData(selectedEdge.id, { color })}
                      className={cn(
                        'w-6 h-6 rounded-full transition-all hover:scale-110',
                        selectedEdge.data?.color === color 
                          ? 'ring-2 ring-white' 
                          : 'hover:ring-2 hover:ring-white/50'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Line Width */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Line Width: {selectedEdge.data?.strokeWidth || 2}px
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={selectedEdge.data?.strokeWidth || 2}
                  onChange={(e) => updateEdgeData(selectedEdge.id, { strokeWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Line Style */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Line Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateEdgeData(selectedEdge.id, { strokeStyle: style })}
                      className={cn(
                        'px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize',
                        selectedEdge.data?.strokeStyle === style
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrow Controls */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Arrows
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateEdgeData(selectedEdge.id, { startArrow: !selectedEdge.data?.startArrow })}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                      selectedEdge.data?.startArrow
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    )}
                  >
                    ← Start
                  </button>
                  <button
                    onClick={() => updateEdgeData(selectedEdge.id, { endArrow: !selectedEdge.data?.endArrow })}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                      selectedEdge.data?.endArrow !== false
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    )}
                  >
                    End →
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => deleteEdge(selectedEdge.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Connection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

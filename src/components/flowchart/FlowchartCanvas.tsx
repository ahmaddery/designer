'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
} from '@xyflow/react';
import { addEdge as addEdgeHelper } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowchartStore } from '@/store/flowchartStore';
import { FlowchartNode as FlowchartNodeType, type FlowchartNodeType as FlowchartNodeTypeEnum } from '@/types/flowchart';
import FlowchartNode from './FlowchartNode';
import FlowchartEdge from './FlowchartEdge';
import { toPng } from 'html-to-image';
import { 
  Download, 
  FileJson, 
  Trash2, 
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  MousePointer2,
  Undo2,
  Redo2,
  Keyboard,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeData extends Record<string, unknown> {
  nodeId: string;
}

interface EdgeData extends Record<string, unknown> {
  edgeId: string;
}

type FlowchartNodeComponentType = Node<NodeData, 'flowchartNode'>;
type FlowchartEdgeComponentType = Edge<EdgeData, 'flowchartEdge'>;

const nodeTypes: any = {
  flowchartNode: FlowchartNode,
};

const edgeTypes: any = {
  flowchartEdge: FlowchartEdge,
};

function FlowchartCanvasContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    addNode,
    addEdge,
    selectNode,
    selectEdge,
    clearSelection,
    moveNode,
    deleteSelected,
    duplicateSelected,
    exportToJSON,
    importFromJSON,
    clearAll,
  } = useFlowchartStore();

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<FlowchartNodeComponentType>([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<FlowchartEdgeComponentType>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const { fitView, zoomIn, zoomOut, screenToFlowPosition } = useReactFlow();

  // Convert store nodes to React Flow nodes
  useEffect(() => {
    const convertedNodes: FlowchartNodeComponentType[] = nodes.map((node) => ({
      id: node.id,
      type: 'flowchartNode',
      position: node.position,
      data: { nodeId: node.id },
      selected: node.id === selectedNodeId,
      zIndex: node.zIndex || 0,
    }));
    setFlowNodes(convertedNodes);
  }, [nodes, selectedNodeId, setFlowNodes]);

  // Convert store edges to React Flow edges
  useEffect(() => {
    const convertedEdges: FlowchartEdgeComponentType[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'flowchartEdge',
      data: { 
        edgeId: edge.id,
        ...edge.data,
        type: edge.type,
      },
      selected: edge.id === selectedEdgeId,
      label: edge.label,
    }));
    setFlowEdges(convertedEdges);
  }, [edges, selectedEdgeId, setFlowEdges]);

  // Handle connections (creating new edges)
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addEdge({
          source: connection.source,
          target: connection.target,
          type: 'smooth',
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
        });
      }
      setFlowEdges((eds) => {
        const newEdges = addEdgeHelper(connection, eds);
        return newEdges as FlowchartEdgeComponentType[];
      });
    },
    [addEdge, setFlowEdges]
  );

  // Handle node drag stop (update position in store)
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: FlowchartNodeComponentType) => {
      moveNode(node.id, node.position);
    },
    [moveNode]
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Handle node click
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowchartNodeComponentType) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // Handle edge click
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: FlowchartEdgeComponentType) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  // Handle drop from shape library
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/flowchart-shape') as FlowchartNodeTypeEnum;
      
      if (type && reactFlowWrapper.current) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        
        // Center the node on the drop position
        addNode(type, { 
          x: position.x - 70, 
          y: position.y - 40 
        });
      }
    },
    [addNode, screenToFlowPosition]
  );

  // Add node at center
  const handleAddNode = useCallback((type: FlowchartNodeTypeEnum = 'process') => {
    const wrapper = reactFlowWrapper.current;
    if (wrapper) {
      const { width, height } = wrapper.getBoundingClientRect();
      const centerPosition = screenToFlowPosition({
        x: width / 2,
        y: height / 2,
      });
      addNode(type, { 
        x: centerPosition.x - 70, 
        y: centerPosition.y - 40 
      });
    }
  }, [addNode, screenToFlowPosition]);

  // Export as PNG
  const handleExportImage = useCallback(async () => {
    if (reactFlowWrapper.current) {
      const dataUrl = await toPng(reactFlowWrapper.current, {
        backgroundColor: '#0f172a',
      });
      const link = document.createElement('a');
      link.download = 'flowchart.png';
      link.href = dataUrl;
      link.click();
    }
  }, []);

  // Export as JSON
  const handleExportJSON = useCallback(() => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'flowchart.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportToJSON]);

  // Import JSON
  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          importFromJSON(json);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, [importFromJSON]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        deleteSelected();
      }
      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, duplicateSelected]);

  return (
    <div className="relative w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'flowchartEdge',
        }}
        snapToGrid
        snapGrid={[15, 15]}
        className="bg-slate-950"
        deleteKeyCode={['Backspace', 'Delete']}
      >
        {showGrid && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(148, 163, 184, 0.15)"
            className="bg-slate-950"
          />
        )}

        <Controls 
          className="!bg-slate-800/80 !border-slate-700 !shadow-xl !rounded-xl overflow-hidden"
          showInteractive={false}
        />

        {showMiniMap && (
          <MiniMap
            className="!bg-slate-800/80 !border-slate-700 !rounded-xl !shadow-xl !overflow-hidden"
            nodeStrokeWidth={3}
            zoomable
            pannable
            maskColor="rgba(15, 23, 42, 0.7)"
            nodeColor={(node) => {
              const flowNode = nodes.find((n) => n.id === node.id);
              return flowNode?.data.color || '#64748B';
            }}
          />
        )}

        {/* Toolbar */}
        <Panel position="top-left" className="m-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl"
          >
            <button
              onClick={() => handleAddNode('process')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>

            <div className="w-px h-6 bg-slate-600 mx-1" />

            <button
              onClick={() => zoomOut()}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => fitView({ padding: 0.2 })}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Fit View"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              onClick={() => zoomIn()}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-600 mx-1" />

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showGrid 
                  ? "text-blue-400 bg-blue-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              )}
              title="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </motion.div>
        </Panel>

        {/* Export/Import Panel */}
        <Panel position="top-right" className="m-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 p-2 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl">
              <label className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm cursor-pointer transition-colors">
                <FileJson className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <div className="w-px h-6 bg-slate-600" />

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
                title="Export as JSON"
              >
                <FileJson className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={handleExportImage}
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
                title="Export as Image"
              >
                <Download className="w-4 h-4" />
                PNG
              </button>

              <div className="w-px h-6 bg-slate-600" />

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all?')) {
                    clearAll();
                  }
                }}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-end">
              <div className="px-3 py-1.5 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <span className="text-xs text-slate-400">
                  {nodes.length} node{nodes.length !== 1 ? 's' : ''} • {edges.length} connection{edges.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </Panel>

        {/* Keyboard Shortcuts Hint */}
        <Panel position="bottom-center" className="mb-4">
          <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700/50 text-xs text-slate-400 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              Shortcuts:
            </span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Delete</kbd> Remove</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Ctrl+D</kbd> Duplicate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Drag</kbd> Connect</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function FlowchartCanvas() {
  return (
    <ReactFlowProvider>
      <FlowchartCanvasContent />
    </ReactFlowProvider>
  );
}

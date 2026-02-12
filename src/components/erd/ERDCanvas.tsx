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
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useERDStore } from '@/store/erdStore';
import { Table, Relation } from '@/types';
import TableNode from './TableNode';
import RelationEdge from './RelationEdge';
import { toPng } from 'html-to-image';
import { 
  Download, 
  FileJson, 
  FileCode, 
  Trash2, 
  Plus,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const nodeTypes: any = {
  table: TableNode,
};

const edgeTypes: any = {
  relation: RelationEdge,
};

interface TableNodeData extends Record<string, unknown> {
  tableId: string;
}

interface RelationEdgeData extends Record<string, unknown> {
  relationId: string;
  type: string;
}

type TableNodeType = Node<TableNodeData, 'table'>;
type RelationEdgeType = Edge<RelationEdgeData, 'relation'>;

function ERDCanvasContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    tables,
    relations,
    selectedTableId,
    selectedRelationId,
    addTable,
    addRelation,
    selectTable,
    selectRelation,
    clearSelection,
    updateTable,
    exportToJSON,
    exportToSQL,
    importFromJSON,
    clearAll,
  } = useERDStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<TableNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelationEdgeType>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const { fitView, zoomIn, zoomOut, screenToFlowPosition } = useReactFlow();

  // Convert tables to React Flow nodes
  useEffect(() => {
    const flowNodes: TableNodeType[] = tables.map((table) => ({
      id: table.id,
      type: 'table',
      position: table.position,
      data: { tableId: table.id },
      selected: table.id === selectedTableId,
    }));
    setNodes(flowNodes);
  }, [tables, selectedTableId, setNodes]);

  // Convert relations to React Flow edges
  useEffect(() => {
    const flowEdges: RelationEdgeType[] = relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceTableId,
      target: relation.targetTableId,
      type: 'relation',
      data: { 
        relationId: relation.id,
        type: relation.type,
      },
      selected: relation.id === selectedRelationId,
    }));
    setEdges(flowEdges);
  }, [relations, selectedRelationId, setEdges]);

  // Handle connections (creating new relations)
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        // Get source and target tables to find columns
        const sourceTable = tables.find((t) => t.id === connection.source);
        const targetTable = tables.find((t) => t.id === connection.target);
        
        if (sourceTable && targetTable) {
          // Find primary key of target table
          const targetPk = targetTable.columns.find((c) => c.isPrimaryKey);
          
          if (targetPk) {
            // Find or create foreign key column in source table
            let sourceFk = sourceTable.columns.find((c) => c.isForeignKey);
            
            if (!sourceFk) {
              // Create a new foreign key column
              const newColumnId = crypto.randomUUID();
              const newColumn = {
                id: newColumnId,
                name: `${targetTable.name.toLowerCase()}_id`,
                dataType: targetPk.dataType,
                nullable: true,
                isPrimaryKey: false,
                isForeignKey: true,
                isUnique: false,
                isAutoIncrement: false,
              };
              
              // Add column to source table
              const updatedColumns = [...sourceTable.columns, newColumn];
              updateTable(sourceTable.id, { columns: updatedColumns });
              sourceFk = newColumn;
            }

            // Create the relation
            addRelation({
              type: 'ONE_TO_MANY',
              sourceTableId: connection.source,
              sourceColumnId: sourceFk.id,
              targetTableId: connection.target,
              targetColumnId: targetPk.id,
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            });
          }
        }
      }

      setEdges((eds) => addEdge(connection, eds));
    },
    [addRelation, setEdges, tables, updateTable]
  );

  // Handle node drag stop (update position in store)
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: TableNodeType) => {
      updateTable(node.id, { position: node.position });
    },
    [updateTable]
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Handle node click
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: TableNodeType) => {
      selectTable(node.id);
    },
    [selectTable]
  );

  // Handle edge click
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: RelationEdgeType) => {
      const relationId = edge.data?.relationId;
      if (relationId) {
        selectRelation(relationId);
      }
    },
    [selectRelation]
  );

  // Add new table at center of viewport
  const handleAddTable = useCallback(() => {
    // Get the container dimensions
    const wrapper = reactFlowWrapper.current;
    if (wrapper) {
      const { width, height } = wrapper.getBoundingClientRect();
      const centerPosition = screenToFlowPosition({
        x: width / 2,
        y: height / 2,
      });
      addTable({ x: centerPosition.x - 120, y: centerPosition.y - 100 });
    } else {
      // Fallback to default position
      addTable({ x: 100, y: 100 });
    }
  }, [addTable, screenToFlowPosition]);

  // Export as PNG
  const handleExportImage = useCallback(async () => {
    if (reactFlowWrapper.current) {
      const dataUrl = await toPng(reactFlowWrapper.current, {
        backgroundColor: '#0f172a',
      });
      const link = document.createElement('a');
      link.download = 'erd-diagram.png';
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
    link.download = 'erd-schema.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportToJSON]);

  // Export as SQL
  const handleExportSQL = useCallback(() => {
    const sql = exportToSQL();
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'schema.sql';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportToSQL]);

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

  return (
    <div className="relative w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'relation',
        }}
        snapToGrid
        snapGrid={[15, 15]}
        className="bg-slate-950"
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
              const table = tables.find((t) => t.id === node.id);
              return table?.color || '#64748B';
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
              onClick={handleAddTable}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              New Table
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
                onClick={handleExportSQL}
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
                title="Export as SQL"
              >
                <FileCode className="w-4 h-4" />
                SQL
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
                  if (confirm('Are you sure you want to clear all tables?')) {
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
                  {tables.length} table{tables.length !== 1 ? 's' : ''} • {relations.length} relation{relations.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function ERDCanvas() {
  return (
    <ReactFlowProvider>
      <ERDCanvasContent />
    </ReactFlowProvider>
  );
}

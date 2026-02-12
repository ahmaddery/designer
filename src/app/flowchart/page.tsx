'use client';

import { FlowchartCanvas, ShapeLibrary, PropertiesPanel } from '@/components/flowchart';
import AppHeader from '@/components/layout/AppHeader';
import { useFlowchartStore } from '@/store/flowchartStore';
import { type FlowchartNodeType } from '@/types/flowchart';
import { useCallback } from 'react';

export default function FlowchartPage() {
  const { 
    nodes, 
    edges, 
    exportToJSON, 
    importFromJSON 
  } = useFlowchartStore();

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

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDragStart = (type: FlowchartNodeType) => {
    if (typeof window !== 'undefined') {
      (window as any).draggedShapeType = type;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <AppHeader
        title="Flowchart Designer"
        subtitle="Visual Process Design"
        onExportJSON={handleExportJSON}
        onImport={handleImport}
        stats={[
          { label: 'Nodes', value: nodes.length },
          { label: 'Connections', value: edges.length },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Shape Library Sidebar */}
        <ShapeLibrary onDragStart={handleDragStart} />

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <FlowchartCanvas />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}

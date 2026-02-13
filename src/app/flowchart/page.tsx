'use client';

import { FlowchartCanvas, ShapeLibrary, PropertiesPanel } from '@/components/flowchart';
import AppHeader from '@/components/layout/AppHeader';
import { useFlowchartStore } from '@/store/flowchartStore';
import { type FlowchartNodeType } from '@/types/flowchart';
import { useCallback } from 'react';
import { usePanelState } from '@/hooks/usePanelState';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, PanelLeft, PanelRight } from 'lucide-react';

export default function FlowchartPage() {
  const { 
    nodes, 
    edges, 
    exportToJSON, 
    importFromJSON 
  } = useFlowchartStore();

  const {
    leftPanelOpen,
    rightPanelOpen,
    toggleLeftPanel,
    toggleRightPanel,
    closeLeftPanel,
    closeRightPanel,
    isMobile,
  } = usePanelState({
    storageKey: 'flowchart-panels',
    defaultLeftPanel: true,
    defaultRightPanel: true,
  });

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
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        onToggleLeftPanel={toggleLeftPanel}
        onToggleRightPanel={toggleRightPanel}
        showLeftPanelToggle={true}
        showRightPanelToggle={true}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel - Shape Library */}
        <AnimatePresence>
          {leftPanelOpen && (
            <>
              {/* Mobile Overlay */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                  onClick={closeLeftPanel}
                />
              )}
              
              {/* Panel */}
              <motion.div
                initial={{ x: '-100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={cn(
                  "fixed left-0 top-14 bottom-0 z-40",
                  "w-[280px] sm:w-[320px]",
                  "bg-slate-900/95 backdrop-blur-sm border-r border-slate-800"
                )}
              >
                {/* Mobile Close Button */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
                  <h2 className="font-semibold text-slate-200">Shapes</h2>
                  <button
                    onClick={closeLeftPanel}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="h-full overflow-hidden">
                  <ShapeLibrary onDragStart={handleDragStart} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Canvas Area */}
        <div className={cn(
          "flex-1 relative transition-all duration-300",
          leftPanelOpen && !isMobile && "ml-[280px] lg:ml-[320px]",
          rightPanelOpen && !isMobile && "mr-[320px]"
        )}>
          <FlowchartCanvas />
        </div>

        {/* Right Panel - Properties */}
        <AnimatePresence>
          {rightPanelOpen && (
            <>
              {/* Mobile Overlay */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                  onClick={closeRightPanel}
                />
              )}
              
              {/* Panel */}
              <motion.div
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={cn(
                  "fixed right-0 top-14 bottom-0 z-40",
                  "w-full sm:w-[400px] lg:w-[320px]",
                  "bg-slate-900/95 backdrop-blur-sm border-l border-slate-800"
                )}
              >
                {/* Mobile Close Button */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
                  <h2 className="font-semibold text-slate-200">Properties</h2>
                  <button
                    onClick={closeRightPanel}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="h-full overflow-hidden">
                  <PropertiesPanel />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Toggle Buttons (when panels are closed) */}
        <AnimatePresence>
          {!leftPanelOpen && !isMobile && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={toggleLeftPanel}
              className="fixed left-4 top-[72px] z-30 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 shadow-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Open Shape Library"
            >
              <PanelLeft className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!rightPanelOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={toggleRightPanel}
              className="fixed right-4 top-[72px] z-30 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 shadow-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Open Properties Panel"
            >
              <PanelRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

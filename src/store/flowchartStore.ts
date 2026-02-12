import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  FlowchartNode, 
  FlowchartEdge, 
  FlowchartNodeType, 
  FlowchartEdgeType,
  FLOWCHART_SHAPES 
} from '@/types/flowchart';
import { generateId } from '@/lib/utils';

interface FlowchartStoreState {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Node actions
  addNode: (type: FlowchartNodeType, position: { x: number; y: number }) => string;
  updateNode: (nodeId: string, updates: Partial<FlowchartNode>) => void;
  updateNodeData: (nodeId: string, data: Partial<FlowchartNode['data']>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;
  resizeNode: (nodeId: string, size: { width: number; height: number }) => void;
  rotateNode: (nodeId: string, rotation: number) => void;
  bringToFront: (nodeId: string) => void;
  sendToBack: (nodeId: string) => void;
  
  // Edge actions
  addEdge: (edge: Omit<FlowchartEdge, 'id'>) => string;
  updateEdge: (edgeId: string, updates: Partial<FlowchartEdge>) => void;
  updateEdgeData: (edgeId: string, data: Partial<FlowchartEdge['data']>) => void;
  deleteEdge: (edgeId: string) => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  clearSelection: () => void;
  
  // Bulk actions
  deleteSelected: () => void;
  duplicateSelected: () => void;
  
  // Import/Export
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  exportToPNG: (element: HTMLElement) => Promise<string>;
  clearAll: () => void;
  
  // History (undo/redo placeholder)
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const getShapeDefaults = (type: FlowchartNodeType) => {
  const shape = FLOWCHART_SHAPES.find(s => s.type === type);
  return shape || FLOWCHART_SHAPES[1]; // Default to process
};

export const useFlowchartStore = create<FlowchartStoreState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      canUndo: false,
      canRedo: false,

      addNode: (type, position) => {
        const id = generateId();
        const shapeDefaults = getShapeDefaults(type);
        
        const newNode: FlowchartNode = {
          id,
          type,
          position,
          size: { ...shapeDefaults.defaultSize },
          data: {
            label: shapeDefaults.label,
            description: '',
            color: shapeDefaults.defaultColor,
            borderColor: shapeDefaults.defaultColor,
            textColor: '#FFFFFF',
            fontSize: 14,
            borderWidth: 2,
            borderStyle: 'solid',
            opacity: 1,
          },
          rotation: 0,
          zIndex: get().nodes.length,
        };

        set({ 
          nodes: [...get().nodes, newNode],
          selectedNodeId: id,
          selectedEdgeId: null,
        });
        return id;
      },

      updateNode: (nodeId, updates) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, ...updates } : n
          ),
        });
      },

      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
          ),
        });
      },

      deleteNode: (nodeId) => {
        const { nodes, edges, selectedNodeId } = get();
        
        // Delete connected edges
        const remainingEdges = edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );
        
        set({
          nodes: nodes.filter((n) => n.id !== nodeId),
          edges: remainingEdges,
          selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
        });
      },

      duplicateNode: (nodeId) => {
        const { nodes } = get();
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const newId = generateId();
        const newNode: FlowchartNode = {
          ...node,
          id: newId,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          zIndex: nodes.length,
        };

        set({ 
          nodes: [...nodes, newNode],
          selectedNodeId: newId,
        });
      },

      moveNode: (nodeId, position) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, position } : n
          ),
        });
      },

      resizeNode: (nodeId, size) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, size } : n
          ),
        });
      },

      rotateNode: (nodeId, rotation) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === nodeId ? { ...n, rotation } : n
          ),
        });
      },

      bringToFront: (nodeId) => {
        const { nodes } = get();
        const maxZ = Math.max(...nodes.map(n => n.zIndex || 0));
        set({
          nodes: nodes.map((n) =>
            n.id === nodeId ? { ...n, zIndex: maxZ + 1 } : n
          ),
        });
      },

      sendToBack: (nodeId) => {
        const { nodes } = get();
        const minZ = Math.min(...nodes.map(n => n.zIndex || 0));
        set({
          nodes: nodes.map((n) =>
            n.id === nodeId ? { ...n, zIndex: minZ - 1 } : n
          ),
        });
      },

      addEdge: (edge) => {
        const id = generateId();
        const newEdge: FlowchartEdge = {
          ...edge,
          id,
          type: edge.type || 'smooth',
          data: {
            color: '#64748B',
            strokeWidth: 2,
            strokeStyle: 'solid',
            startArrow: false,
            endArrow: true,
            labelBgColor: '#1E293B',
            labelTextColor: '#F1F5F9',
            ...edge.data,
          },
        };

        set({ 
          edges: [...get().edges, newEdge],
          selectedEdgeId: id,
          selectedNodeId: null,
        });
        return id;
      },

      updateEdge: (edgeId, updates) => {
        set({
          edges: get().edges.map((e) =>
            e.id === edgeId ? { ...e, ...updates } : e
          ),
        });
      },

      updateEdgeData: (edgeId, data) => {
        set({
          edges: get().edges.map((e) =>
            e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
          ),
        });
      },

      deleteEdge: (edgeId) => {
        const { edges, selectedEdgeId } = get();
        set({
          edges: edges.filter((e) => e.id !== edgeId),
          selectedEdgeId: selectedEdgeId === edgeId ? null : selectedEdgeId,
        });
      },

      selectNode: (nodeId) => {
        set({
          selectedNodeId: nodeId,
          selectedEdgeId: null,
        });
      },

      selectEdge: (edgeId) => {
        set({
          selectedEdgeId: edgeId,
          selectedNodeId: null,
        });
      },

      clearSelection: () => {
        set({
          selectedNodeId: null,
          selectedEdgeId: null,
        });
      },

      deleteSelected: () => {
        const { selectedNodeId, selectedEdgeId } = get();
        if (selectedNodeId) {
          get().deleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          get().deleteEdge(selectedEdgeId);
        }
      },

      duplicateSelected: () => {
        const { selectedNodeId } = get();
        if (selectedNodeId) {
          get().duplicateNode(selectedNodeId);
        }
      },

      exportToJSON: () => {
        const { nodes, edges } = get();
        return JSON.stringify({ nodes, edges }, null, 2);
      },

      importFromJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.nodes && Array.isArray(data.nodes)) {
            set({
              nodes: data.nodes,
              edges: data.edges || [],
              selectedNodeId: null,
              selectedEdgeId: null,
            });
          }
        } catch (error) {
          console.error('Failed to import JSON:', error);
          throw error;
        }
      },

      exportToPNG: async (element) => {
        // This will be implemented with html-to-image in the component
        return '';
      },

      clearAll: () => {
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          selectedEdgeId: null,
        });
      },

      undo: () => {
        // Placeholder for undo functionality
      },

      redo: () => {
        // Placeholder for redo functionality
      },
    }),
    {
      name: 'flowchart-designer-storage',
    }
  )
);

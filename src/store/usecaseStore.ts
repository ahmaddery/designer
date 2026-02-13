'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  UseCaseNode, 
  UseCaseEdge, 
  UseCaseNodeType, 
  UseCaseEdgeType 
} from '@/types/usecase';
import { USECASE_COLORS } from '@/types/usecase';
import { generateId } from '@/lib/utils';

interface UseCaseStore {
  nodes: UseCaseNode[];
  edges: UseCaseEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Node actions
  addNode: (type: UseCaseNodeType, position: { x: number; y: number }) => string;
  updateNode: (id: string, updates: Partial<UseCaseNode['data']>) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  resizeNode: (id: string, size: { width: number; height: number }) => void;
  deleteNode: (id: string) => void;
  
  // Edge actions
  addEdge: (type: UseCaseEdgeType, sourceId: string, targetId: string, label?: string) => string;
  updateEdge: (id: string, updates: Partial<UseCaseEdge>) => void;
  deleteEdge: (id: string) => void;
  
  // Selection
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  
  // Import/Export
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  
  // Clear
  clearAll: () => void;
}

const getDefaultNodeName = (type: UseCaseNodeType, existingNodes: UseCaseNode[]): string => {
  const count = existingNodes.filter(n => n.type === type).length + 1;
  switch (type) {
    case 'ACTOR':
      return `Actor ${count}`;
    case 'USECASE':
      return `Use Case ${count}`;
    case 'SYSTEM':
      return `System ${count}`;
    case 'NOTE':
      return `Note ${count}`;
    default:
      return `Node ${count}`;
  }
};

const getDefaultNodeSize = (type: UseCaseNodeType): { width: number; height: number } => {
  switch (type) {
    case 'ACTOR':
      return { width: 80, height: 100 };
    case 'USECASE':
      return { width: 160, height: 60 };
    case 'SYSTEM':
      return { width: 300, height: 400 };
    case 'NOTE':
      return { width: 200, height: 100 };
    default:
      return { width: 100, height: 100 };
  }
};

export const useUseCaseStore = create<UseCaseStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,

      addNode: (type, position) => {
        const id = generateId();
        const newNode: UseCaseNode = {
          id,
          type,
          position,
          size: getDefaultNodeSize(type),
          data: {
            name: getDefaultNodeName(type, get().nodes),
            color: USECASE_COLORS[Math.floor(Math.random() * USECASE_COLORS.length)],
          },
        };
        set((state) => ({
          nodes: [...state.nodes, newNode],
          selectedNodeId: id,
          selectedEdgeId: null,
        }));
        return id;
      },

      updateNode: (id, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
          ),
        }));
      },

      moveNode: (id, position) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, position } : node
          ),
        }));
      },

      resizeNode: (id, size) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, size } : node
          ),
        }));
      },

      deleteNode: (id) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter((edge) => edge.sourceId !== id && edge.targetId !== id),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        }));
      },

      addEdge: (type, sourceId, targetId, label) => {
        const id = generateId();
        
        // Determine default label based on type
        let defaultLabel = label;
        if (!defaultLabel) {
          switch (type) {
            case 'INCLUDE':
              defaultLabel = '«include»';
              break;
            case 'EXTEND':
              defaultLabel = '«extend»';
              break;
            case 'GENERALIZATION':
              defaultLabel = '';
              break;
          }
        }

        const newEdge: UseCaseEdge = {
          id,
          type,
          sourceId,
          targetId,
          label: defaultLabel,
        };
        set((state) => ({
          edges: [...state.edges, newEdge],
          selectedEdgeId: id,
          selectedNodeId: null,
        }));
        return id;
      },

      updateEdge: (id, updates) => {
        set((state) => ({
          edges: state.edges.map((edge) =>
            edge.id === id ? { ...edge, ...updates } : edge
          ),
        }));
      },

      deleteEdge: (id) => {
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== id),
          selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
        }));
      },

      selectNode: (id) => {
        set({ selectedNodeId: id, selectedEdgeId: null });
      },

      selectEdge: (id) => {
        set({ selectedEdgeId: id, selectedNodeId: null });
      },

      exportToJSON: () => {
        const state = get();
        return JSON.stringify({
          nodes: state.nodes,
          edges: state.edges,
        }, null, 2);
      },

      importFromJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.nodes && data.edges) {
            set({
              nodes: data.nodes,
              edges: data.edges,
              selectedNodeId: null,
              selectedEdgeId: null,
            });
          }
        } catch (error) {
          console.error('Failed to import JSON:', error);
          throw error;
        }
      },

      clearAll: () => {
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          selectedEdgeId: null,
        });
      },
    }),
    {
      name: 'usecase-storage',
    }
  )
);

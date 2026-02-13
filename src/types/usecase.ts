// Types for Use Case Diagram

export type UseCaseNodeType = 'ACTOR' | 'USECASE' | 'SYSTEM' | 'NOTE';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface UseCaseNode {
  id: string;
  type: UseCaseNodeType;
  position: Position;
  size: Size;
  data: {
    name: string;
    description?: string;
    color?: string;
    stereotype?: string;
  };
}

export type UseCaseEdgeType = 'ASSOCIATION' | 'INCLUDE' | 'EXTEND' | 'GENERALIZATION' | 'DEPENDENCY';

export interface UseCaseEdge {
  id: string;
  type: UseCaseEdgeType;
  sourceId: string;
  targetId: string;
  label?: string;
  style?: {
    color?: string;
    dashed?: boolean;
  };
}

export interface UseCaseState {
  nodes: UseCaseNode[];
  edges: UseCaseEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
}

export const USECASE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#A855F7', // Purple
];

export const DEFAULT_ACTOR_NAMES = [
  'User',
  'Admin',
  'Customer',
  'System',
  'Manager',
  'Guest',
];

export const DEFAULT_USECASE_NAMES = [
  'Login',
  'Register',
  'View Profile',
  'Edit Profile',
  'Delete Account',
  'Search',
  'Add Item',
  'Update Item',
  'Delete Item',
  'View Reports',
];

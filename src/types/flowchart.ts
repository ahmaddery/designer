// Types for Flowchart Designer

export type FlowchartNodeType = 
  | 'process' 
  | 'decision' 
  | 'start' 
  | 'end' 
  | 'input'
  | 'output'
  | 'document'
  | 'database'
  | 'predefined'
  | 'delay'
  | 'stored-data'
  | 'manual-input'
  | 'display'
  | 'preparation'
  | 'connector'
  | 'off-page';

export type FlowchartEdgeType = 'smooth' | 'straight' | 'step' | 'bezier';

export interface FlowchartNode {
  id: string;
  type: FlowchartNodeType;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  data: {
    label: string;
    description?: string;
    color?: string;
    borderColor?: string;
    textColor?: string;
    fontSize?: number;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    opacity?: number;
    icon?: string;
  };
  rotation?: number;
  zIndex?: number;
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  type: FlowchartEdgeType;
  label?: string;
  data?: {
    color?: string;
    strokeWidth?: number;
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    startArrow?: boolean;
    endArrow?: boolean;
    labelBgColor?: string;
    labelTextColor?: string;
  };
  sourceHandle?: string;
  targetHandle?: string;
}

export interface FlowchartState {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

// Shape definitions with icons and descriptions
export const FLOWCHART_SHAPES: {
  type: FlowchartNodeType;
  label: string;
  icon: string;
  description: string;
  defaultSize: { width: number; height: number };
  defaultColor: string;
}[] = [
  {
    type: 'start',
    label: 'Start/End',
    icon: 'Circle',
    description: 'Terminal point - Start or end of process',
    defaultSize: { width: 120, height: 60 },
    defaultColor: '#10B981',
  },
  {
    type: 'process',
    label: 'Process',
    icon: 'Square',
    description: 'Action or operation step',
    defaultSize: { width: 140, height: 80 },
    defaultColor: '#3B82F6',
  },
  {
    type: 'decision',
    label: 'Decision',
    icon: 'Diamond',
    description: 'Conditional branch (Yes/No)',
    defaultSize: { width: 140, height: 100 },
    defaultColor: '#F59E0B',
  },
  {
    type: 'input',
    label: 'Input',
    icon: 'Parallelogram',
    description: 'Data input operation',
    defaultSize: { width: 140, height: 70 },
    defaultColor: '#8B5CF6',
  },
  {
    type: 'output',
    label: 'Output',
    icon: 'Parallelogram',
    description: 'Data output operation',
    defaultSize: { width: 140, height: 70 },
    defaultColor: '#EC4899',
  },
  {
    type: 'document',
    label: 'Document',
    icon: 'FileText',
    description: 'Document or report',
    defaultSize: { width: 140, height: 90 },
    defaultColor: '#06B6D4',
  },
  {
    type: 'database',
    label: 'Database',
    icon: 'Database',
    description: 'Database storage',
    defaultSize: { width: 140, height: 90 },
    defaultColor: '#6366F1',
  },
  {
    type: 'predefined',
    label: 'Predefined',
    icon: 'RectangleHorizontal',
    description: 'Predefined process (subroutine)',
    defaultSize: { width: 140, height: 80 },
    defaultColor: '#84CC16',
  },
  {
    type: 'delay',
    label: 'Delay',
    icon: 'Clock',
    description: 'Wait or delay operation',
    defaultSize: { width: 120, height: 70 },
    defaultColor: '#F97316',
  },
  {
    type: 'stored-data',
    label: 'Stored Data',
    icon: 'HardDrive',
    description: 'Data storage',
    defaultSize: { width: 140, height: 90 },
    defaultColor: '#14B8A6',
  },
  {
    type: 'manual-input',
    label: 'Manual Input',
    icon: 'Keyboard',
    description: 'Manual data entry',
    defaultSize: { width: 140, height: 80 },
    defaultColor: '#A855F7',
  },
  {
    type: 'display',
    label: 'Display',
    icon: 'Monitor',
    description: 'Display output',
    defaultSize: { width: 140, height: 80 },
    defaultColor: '#E11D48',
  },
  {
    type: 'preparation',
    label: 'Preparation',
    icon: 'Hexagon',
    description: 'Initialization or preparation',
    defaultSize: { width: 140, height: 90 },
    defaultColor: '#0EA5E9',
  },
  {
    type: 'connector',
    label: 'Connector',
    icon: 'CircleDot',
    description: 'Connection point within page',
    defaultSize: { width: 50, height: 50 },
    defaultColor: '#64748B',
  },
  {
    type: 'off-page',
    label: 'Off-Page',
    icon: 'ArrowRightToLine',
    description: 'Connection to another page',
    defaultSize: { width: 100, height: 60 },
    defaultColor: '#94A3B8',
  },
];

export const FLOWCHART_COLORS = [
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
  '#E11D48', // Rose
  '#0EA5E9', // Sky
  '#64748B', // Slate
];

export const DEFAULT_FLOWCHART_NODE: Omit<FlowchartNode, 'id' | 'type' | 'position'> = {
  size: { width: 140, height: 80 },
  data: {
    label: 'New Node',
    color: '#3B82F6',
    borderColor: '#1D4ED8',
    textColor: '#FFFFFF',
    fontSize: 14,
    borderWidth: 2,
    borderStyle: 'solid',
    opacity: 1,
  },
  rotation: 0,
  zIndex: 0,
};

export const DEFAULT_FLOWCHART_EDGE: Omit<FlowchartEdge, 'id' | 'source' | 'target'> = {
  type: 'smooth',
  label: '',
  data: {
    color: '#64748B',
    strokeWidth: 2,
    strokeStyle: 'solid',
    startArrow: false,
    endArrow: true,
    labelBgColor: '#1E293B',
    labelTextColor: '#F1F5F9',
  },
};

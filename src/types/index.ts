// Types for ERD Designer

export type DataType = 
  | 'VARCHAR' 
  | 'INT' 
  | 'BIGINT' 
  | 'SMALLINT'
  | 'DECIMAL' 
  | 'NUMERIC' 
  | 'FLOAT' 
  | 'DOUBLE'
  | 'BOOLEAN' 
  | 'DATE' 
  | 'TIME' 
  | 'DATETIME' 
  | 'TIMESTAMP' 
  | 'TEXT' 
  | 'BLOB' 
  | 'JSON' 
  | 'UUID';

export interface Column {
  id: string;
  name: string;
  dataType: DataType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
  comment?: string;
}

export interface Table {
  id: string;
  name: string;
  comment?: string;
  columns: Column[];
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export type RelationType = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';

export interface Relation {
  id: string;
  name?: string;
  type: RelationType;
  sourceTableId: string;
  sourceColumnId: string;
  targetTableId: string;
  targetColumnId: string;
  onDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT' | 'NO_ACTION';
  onUpdate?: 'CASCADE' | 'SET_NULL' | 'RESTRICT' | 'NO_ACTION';
}

export interface ERDState {
  tables: Table[];
  relations: Relation[];
  selectedTableId: string | null;
  selectedRelationId: string | null;
  selectedColumnId: string | null;
}

export const DATA_TYPES: { type: DataType; label: string; hasLength: boolean; hasPrecision: boolean }[] = [
  { type: 'VARCHAR', label: 'VARCHAR', hasLength: true, hasPrecision: false },
  { type: 'INT', label: 'INT', hasLength: false, hasPrecision: false },
  { type: 'BIGINT', label: 'BIGINT', hasLength: false, hasPrecision: false },
  { type: 'SMALLINT', label: 'SMALLINT', hasLength: false, hasPrecision: false },
  { type: 'DECIMAL', label: 'DECIMAL', hasLength: false, hasPrecision: true },
  { type: 'NUMERIC', label: 'NUMERIC', hasLength: false, hasPrecision: true },
  { type: 'FLOAT', label: 'FLOAT', hasLength: false, hasPrecision: false },
  { type: 'DOUBLE', label: 'DOUBLE', hasLength: false, hasPrecision: false },
  { type: 'BOOLEAN', label: 'BOOLEAN', hasLength: false, hasPrecision: false },
  { type: 'DATE', label: 'DATE', hasLength: false, hasPrecision: false },
  { type: 'TIME', label: 'TIME', hasLength: false, hasPrecision: false },
  { type: 'DATETIME', label: 'DATETIME', hasLength: false, hasPrecision: false },
  { type: 'TIMESTAMP', label: 'TIMESTAMP', hasLength: false, hasPrecision: false },
  { type: 'TEXT', label: 'TEXT', hasLength: false, hasPrecision: false },
  { type: 'BLOB', label: 'BLOB', hasLength: false, hasPrecision: false },
  { type: 'JSON', label: 'JSON', hasLength: false, hasPrecision: false },
  { type: 'UUID', label: 'UUID', hasLength: false, hasPrecision: false },
];

export const TABLE_COLORS = [
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

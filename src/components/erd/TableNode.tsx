'use client';

import { memo, useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { 
  Key, 
  Link2, 
  Hash, 
  MoreVertical,
  Plus,
  Trash2,
  Copy,
  Settings2
} from 'lucide-react';
import { useERDStore } from '@/store/erdStore';
import { cn } from '@/lib/utils';
import { type Column, DATA_TYPES } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface TableNodeData extends Record<string, unknown> {
  tableId: string;
}

const getDataTypeColor = (dataType: string): string => {
  const colors: Record<string, string> = {
    VARCHAR: 'text-blue-400',
    TEXT: 'text-blue-300',
    INT: 'text-green-400',
    BIGINT: 'text-green-300',
    SMALLINT: 'text-green-300',
    DECIMAL: 'text-yellow-400',
    NUMERIC: 'text-yellow-400',
    FLOAT: 'text-yellow-300',
    DOUBLE: 'text-yellow-300',
    BOOLEAN: 'text-purple-400',
    DATE: 'text-pink-400',
    TIME: 'text-pink-300',
    DATETIME: 'text-pink-400',
    TIMESTAMP: 'text-pink-500',
    BLOB: 'text-gray-400',
    JSON: 'text-orange-400',
    UUID: 'text-cyan-400',
  };
  return colors[dataType] || 'text-gray-400';
};

const ColumnRow = memo(function ColumnRow({
  column,
  tableId,
  isSelected,
  onSelect,
  index,
}: {
  column: Column;
  tableId: string;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const deleteColumn = useERDStore((state) => state.deleteColumn);
  const selectedColumnId = useERDStore((state) => state.selectedColumnId);
  
  const isColumnSelected = selectedColumnId === column.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        'group flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer transition-all duration-150',
        'hover:bg-white/5',
        isColumnSelected && 'bg-white/10 ring-1 ring-white/20'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Primary Key / Foreign Key / Index Icons */}
      <div className="flex items-center gap-1 w-5 shrink-0">
        {column.isPrimaryKey && (
          <Key className="w-3.5 h-3.5 text-amber-400" />
        )}
        {column.isForeignKey && !column.isPrimaryKey && (
          <Link2 className="w-3.5 h-3.5 text-blue-400" />
        )}
        {column.isUnique && !column.isPrimaryKey && (
          <Hash className="w-3.5 h-3.5 text-purple-400" />
        )}
      </div>

      {/* Column Name */}
      <span className={cn(
        'flex-1 font-medium truncate',
        column.isPrimaryKey ? 'text-amber-100' : 'text-slate-200'
      )}>
        {column.name}
      </span>

      {/* Data Type */}
      <span className={cn('text-[10px] font-mono shrink-0', getDataTypeColor(column.dataType))}>
        {column.dataType}
        {column.length && `(${column.length})`}
        {column.precision !== undefined && 
          `(${column.precision}${column.scale !== undefined ? `,${column.scale}` : ''})`}
      </span>

      {/* Nullable indicator */}
      {!column.nullable && (
        <span className="text-[9px] text-red-400 font-bold shrink-0">*</span>
      )}

      {/* Delete button on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteColumn(tableId, column.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-all shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </motion.div>
  );
});

function TableNodeComponent({ data, selected }: NodeProps) {
  const { tableId } = data as TableNodeData;
  const [showMenu, setShowMenu] = useState(false);
  
  const table = useERDStore((state) => 
    state.tables.find((t) => t.id === tableId)
  );
  const selectedTableId = useERDStore((state) => state.selectedTableId);
  const selectTable = useERDStore((state) => state.selectTable);
  const selectColumn = useERDStore((state) => state.selectColumn);
  const addColumn = useERDStore((state) => state.addColumn);
  const duplicateTable = useERDStore((state) => state.duplicateTable);
  const deleteTable = useERDStore((state) => state.deleteTable);
  const updateTable = useERDStore((state) => state.updateTable);
  
  const isSelected = selectedTableId === tableId;

  const handleAddColumn = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    addColumn(tableId);
  }, [addColumn, tableId]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateTable(tableId);
    setShowMenu(false);
  }, [duplicateTable, tableId]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTable(tableId);
    setShowMenu(false);
  }, [deleteTable, tableId]);

  const handleColorChange = useCallback((color: string) => {
    updateTable(tableId, { color });
    setShowMenu(false);
  }, [updateTable, tableId]);

  if (!table) return null;

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden transition-all duration-200',
        'bg-slate-900/95 backdrop-blur-sm border shadow-2xl',
        isSelected 
          ? 'border-white/30 shadow-white/10 ring-2 ring-white/20' 
          : 'border-white/10 shadow-black/20',
        'min-w-[240px] max-w-[320px]'
      )}
      style={{
        boxShadow: isSelected 
          ? `0 0 0 1px ${table.color}40, 0 20px 40px -10px rgba(0,0,0,0.5)` 
          : '0 20px 40px -10px rgba(0,0,0,0.3)'
      }}
      onClick={() => selectTable(tableId)}
    >
      {/* Header */}
      <div 
        className="relative px-4 py-3 flex items-center justify-between"
        style={{ 
          background: `linear-gradient(135deg, ${table.color}20 0%, ${table.color}10 100%)`,
          borderBottom: `1px solid ${table.color}30`
        }}
      >
        {/* Color indicator line */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: table.color }}
        />
        
        <div className="flex-1 min-w-0 ml-2">
          <h3 className="font-semibold text-sm text-white truncate">
            {table.name}
          </h3>
          {table.comment && (
            <p className="text-[10px] text-slate-400 truncate">{table.comment}</p>
          )}
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-1 w-48 bg-slate-800 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
              >
                <button
                  onClick={handleDuplicate}
                  className="w-full px-3 py-2 flex items-center gap-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate Table
                </button>
                
                <div className="px-3 py-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Color</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={cn(
                          'w-5 h-5 rounded-full transition-transform hover:scale-110',
                          table.color === color && 'ring-2 ring-white'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 flex items-center gap-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Table
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Click outside to close menu */}
        {showMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>

      {/* Columns */}
      <div className="py-1 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {table.columns.map((column, index) => (
          <ColumnRow
            key={column.id}
            column={column}
            tableId={tableId}
            isSelected={isSelected}
            onSelect={() => selectColumn(tableId, column.id)}
            index={index}
          />
        ))}
      </div>

      {/* Add Column Button */}
      <button
        onClick={handleAddColumn}
        className="w-full px-4 py-2 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all border-t border-white/5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Column
      </button>

      {/* Handles for connections */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ top: -6 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ right: -6 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ right: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ bottom: -6 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ left: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white/20 !border-2 !border-white/40 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ left: -6 }}
      />
    </div>
  );
}

export default memo(TableNodeComponent);

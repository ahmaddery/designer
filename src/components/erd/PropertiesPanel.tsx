'use client';

import { useState } from 'react';
import { useERDStore } from '@/store/erdStore';
import { cn } from '@/lib/utils';
import { 
  X, 
  Settings2, 
  Key, 
  Link2, 
  Hash,
  Type,
  AlignLeft,
  ToggleLeft,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DATA_TYPES, type DataType, type RelationType } from '@/types';

export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<'table' | 'column' | 'relation'>('table');
  
  const {
    tables,
    relations,
    selectedTableId,
    selectedRelationId,
    selectedColumnId,
    updateTable,
    updateColumn,
    deleteColumn,
    updateRelation,
    deleteRelation,
    selectTable,
    clearSelection,
  } = useERDStore();

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const selectedColumn = selectedTable?.columns.find((c) => c.id === selectedColumnId);
  const selectedRelation = relations.find((r) => r.id === selectedRelationId);

  // Update active tab based on selection
  if (selectedRelation && activeTab !== 'relation') {
    setActiveTab('relation');
  } else if (selectedColumn && activeTab !== 'column') {
    setActiveTab('column');
  } else if (selectedTable && activeTab !== 'table' && !selectedColumn && !selectedRelation) {
    setActiveTab('table');
  }

  const hasSelection = selectedTable || selectedRelation;

  if (!hasSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full h-full bg-slate-900/95 backdrop-blur-sm flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h2 className="font-semibold text-slate-200">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
            <Settings2 className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">
            Select a table, column, or relation to edit its properties
          </p>
          <div className="mt-6 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center">
                <Plus className="w-2.5 h-2.5 text-blue-400" />
              </div>
              <span>Click &quot;New Table&quot; to add a table</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
              <span>Drag handles to connect tables</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full bg-slate-900/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {selectedRelation ? (
            <>
              <Link2 className="w-4 h-4 text-blue-400" />
              <h2 className="font-semibold text-slate-200">Relation</h2>
            </>
          ) : selectedColumn ? (
            <>
              <div className="w-4 h-4 rounded bg-slate-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <h2 className="font-semibold text-slate-200">Column</h2>
            </>
          ) : (
            <>
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: selectedTable?.color || '#64748B' }}
              />
              <h2 className="font-semibold text-slate-200">Table</h2>
            </>
          )}
        </div>
        <button
          onClick={clearSelection}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* Relation Properties */}
          {selectedRelation && (
            <motion.div
              key="relation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Relation Type */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                  Relation Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_MANY'] as RelationType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateRelation(selectedRelation.id, { type })}
                      className={cn(
                        'px-2 py-2 rounded-lg text-xs font-medium transition-all',
                        selectedRelation.type === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      )}
                    >
                      {type === 'ONE_TO_ONE' && '1:1'}
                      {type === 'ONE_TO_MANY' && '1:N'}
                      {type === 'MANY_TO_MANY' && 'N:N'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source & Target */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">From</span>
                  <div className="mt-1">
                    {(() => {
                      const table = tables.find(t => t.id === selectedRelation.sourceTableId);
                      const column = table?.columns.find(c => c.id === selectedRelation.sourceColumnId);
                      return (
                        <div className="text-sm text-slate-200">
                          <span className="font-medium">{table?.name}</span>
                          <span className="text-slate-500 mx-1">.</span>
                          <span className="text-blue-400">{column?.name}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">To</span>
                  <div className="mt-1">
                    {(() => {
                      const table = tables.find(t => t.id === selectedRelation.targetTableId);
                      const column = table?.columns.find(c => c.id === selectedRelation.targetColumnId);
                      return (
                        <div className="text-sm text-slate-200">
                          <span className="font-medium">{table?.name}</span>
                          <span className="text-slate-500 mx-1">.</span>
                          <span className="text-amber-400">{column?.name}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* ON DELETE / ON UPDATE */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">On Delete</label>
                  <select
                    value={selectedRelation.onDelete || 'CASCADE'}
                    onChange={(e) => updateRelation(selectedRelation.id, { onDelete: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="CASCADE">CASCADE</option>
                    <option value="SET_NULL">SET NULL</option>
                    <option value="RESTRICT">RESTRICT</option>
                    <option value="NO_ACTION">NO ACTION</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">On Update</label>
                  <select
                    value={selectedRelation.onUpdate || 'CASCADE'}
                    onChange={(e) => updateRelation(selectedRelation.id, { onUpdate: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="CASCADE">CASCADE</option>
                    <option value="SET_NULL">SET NULL</option>
                    <option value="RESTRICT">RESTRICT</option>
                    <option value="NO_ACTION">NO ACTION</option>
                  </select>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteRelation(selectedRelation.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Relation
              </button>
            </motion.div>
          )}

          {/* Column Properties */}
          {selectedColumn && selectedTable && (
            <motion.div
              key="column"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Column Name */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Column Name</label>
                <input
                  type="text"
                  value={selectedColumn.name}
                  onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="column_name"
                />
              </div>

              {/* Data Type */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Data Type</label>
                <select
                  value={selectedColumn.dataType}
                  onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                    dataType: e.target.value as DataType 
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {DATA_TYPES.map((dt) => (
                    <option key={dt.type} value={dt.type}>
                      {dt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Length / Precision */}
              {DATA_TYPES.find(dt => dt.type === selectedColumn.dataType)?.hasLength && (
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Length</label>
                  <input
                    type="number"
                    value={selectedColumn.length || ''}
                    onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                      length: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="255"
                  />
                </div>
              )}

              {DATA_TYPES.find(dt => dt.type === selectedColumn.dataType)?.hasPrecision && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Precision</label>
                    <input
                      type="number"
                      value={selectedColumn.precision || ''}
                      onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                        precision: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Scale</label>
                    <input
                      type="number"
                      value={selectedColumn.scale || ''}
                      onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                        scale: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              )}

              {/* Constraints */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                  Constraints
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedColumn.isPrimaryKey}
                      onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                        isPrimaryKey: e.target.checked 
                      })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50"
                    />
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-slate-300">Primary Key</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedColumn.isUnique}
                      onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                        isUnique: e.target.checked 
                      })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500/50"
                    />
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-300">Unique</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={!selectedColumn.nullable}
                      onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                        nullable: !e.target.checked 
                      })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500/50"
                    />
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-slate-300">Required (NOT NULL)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedColumn.isAutoIncrement}
                      onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                        isAutoIncrement: e.target.checked 
                      })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500/50"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center bg-green-500/20 text-green-400 text-[10px] font-bold">+</div>
                      <span className="text-sm text-slate-300">Auto Increment</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Default Value */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Default Value</label>
                <input
                  type="text"
                  value={selectedColumn.defaultValue || ''}
                  onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                    defaultValue: e.target.value || undefined 
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="NULL"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Comment</label>
                <textarea
                  value={selectedColumn.comment || ''}
                  onChange={(e) => updateColumn(selectedTable.id, selectedColumn.id, { 
                    comment: e.target.value || undefined 
                  })}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Column description..."
                />
              </div>

              {/* Delete Button */}
              {!selectedColumn.isPrimaryKey && (
                <button
                  onClick={() => deleteColumn(selectedTable.id, selectedColumn.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Column
                </button>
              )}
            </motion.div>
          )}

          {/* Table Properties */}
          {selectedTable && !selectedColumn && (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Table Name */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Table Name</label>
                <input
                  type="text"
                  value={selectedTable.name}
                  onChange={(e) => updateTable(selectedTable.id, { name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="table_name"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#A855F7'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateTable(selectedTable.id, { color })}
                      className={cn(
                        'w-7 h-7 rounded-lg transition-all hover:scale-110',
                        selectedTable.color === color 
                          ? 'ring-2 ring-white shadow-lg' 
                          : 'hover:ring-2 hover:ring-white/50'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Comment</label>
                <textarea
                  value={selectedTable.comment || ''}
                  onChange={(e) => updateTable(selectedTable.id, { comment: e.target.value || undefined })}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Table description..."
                />
              </div>

              {/* Columns List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Columns
                  </label>
                  <span className="text-xs text-slate-500">{selectedTable.columns.length} total</span>
                </div>
                <div className="space-y-1">
                  {selectedTable.columns.map((column, index) => (
                    <div
                      key={column.id}
                      onClick={() => selectTable(selectedTable.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                        'hover:bg-slate-800/50',
                        selectedColumnId === column.id && 'bg-slate-800 ring-1 ring-blue-500/50'
                      )}
                    >
                      <span className="text-xs text-slate-500 w-5">{index + 1}</span>
                      {column.isPrimaryKey && <Key className="w-3.5 h-3.5 text-amber-400" />}
                      {column.isForeignKey && <Link2 className="w-3.5 h-3.5 text-blue-400" />}
                      {!column.isPrimaryKey && !column.isForeignKey && <div className="w-3.5" />}
                      <span className={cn(
                        'flex-1',
                        column.isPrimaryKey ? 'text-amber-100 font-medium' : 'text-slate-300'
                      )}>
                        {column.name}
                      </span>
                      <span className="text-xs text-slate-500">{column.dataType}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

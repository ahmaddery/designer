import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Table, Relation, Column, TABLE_COLORS } from '@/types';
import { generateId, generateTableName, generateColumnName } from '@/lib/utils';

interface ERDStoreState {
  tables: Table[];
  relations: Relation[];
  selectedTableId: string | null;
  selectedRelationId: string | null;
  selectedColumnId: string | null;
  
  // Table actions
  addTable: (position: { x: number; y: number }) => string;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  deleteTable: (tableId: string) => void;
  duplicateTable: (tableId: string) => void;
  moveTable: (tableId: string, position: { x: number; y: number }) => void;
  
  // Column actions
  addColumn: (tableId: string) => string;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  reorderColumns: (tableId: string, columnIds: string[]) => void;
  
  // Relation actions
  addRelation: (relation: Omit<Relation, 'id'>) => string;
  updateRelation: (relationId: string, updates: Partial<Relation>) => void;
  deleteRelation: (relationId: string) => void;
  
  // Selection
  selectTable: (tableId: string | null) => void;
  selectRelation: (relationId: string | null) => void;
  selectColumn: (tableId: string | null, columnId: string | null) => void;
  clearSelection: () => void;
  
  // Import/Export
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  exportToSQL: () => string;
  clearAll: () => void;
}

const getRandomColor = () => TABLE_COLORS[Math.floor(Math.random() * TABLE_COLORS.length)];

export const useERDStore = create<ERDStoreState>()(
  persist(
    (set, get) => ({
      tables: [],
      relations: [],
      selectedTableId: null,
      selectedRelationId: null,
      selectedColumnId: null,

      addTable: (position) => {
        const id = generateId();
        const { tables } = get();
        
        const newTable: Table = {
          id,
          name: generateTableName(tables),
          columns: [
            {
              id: generateId(),
              name: 'id',
              dataType: 'INT',
              nullable: false,
              isPrimaryKey: true,
              isForeignKey: false,
              isUnique: false,
              isAutoIncrement: true,
            },
          ],
          color: getRandomColor(),
          position,
        };

        set({ tables: [...tables, newTable], selectedTableId: id });
        return id;
      },

      updateTable: (tableId, updates) => {
        set({
          tables: get().tables.map((t) =>
            t.id === tableId ? { ...t, ...updates } : t
          ),
        });
      },

      deleteTable: (tableId) => {
        const { tables, relations, selectedTableId } = get();
        
        // Delete related relations
        const remainingRelations = relations.filter(
          (r) => r.sourceTableId !== tableId && r.targetTableId !== tableId
        );
        
        set({
          tables: tables.filter((t) => t.id !== tableId),
          relations: remainingRelations,
          selectedTableId: selectedTableId === tableId ? null : selectedTableId,
        });
      },

      duplicateTable: (tableId) => {
        const { tables } = get();
        const table = tables.find((t) => t.id === tableId);
        if (!table) return;

        const newId = generateId();
        const newTable: Table = {
          ...table,
          id: newId,
          name: `${table.name}_copy`,
          position: {
            x: table.position.x + 50,
            y: table.position.y + 50,
          },
          columns: table.columns.map((col) => ({
            ...col,
            id: generateId(),
            isForeignKey: false,
          })),
        };

        set({ tables: [...tables, newTable], selectedTableId: newId });
      },

      moveTable: (tableId, position) => {
        set({
          tables: get().tables.map((t) =>
            t.id === tableId ? { ...t, position } : t
          ),
        });
      },

      addColumn: (tableId) => {
        const { tables } = get();
        const table = tables.find((t) => t.id === tableId);
        if (!table) return '';

        const newColumn: Column = {
          id: generateId(),
          name: generateColumnName(table.columns),
          dataType: 'VARCHAR',
          length: 255,
          nullable: true,
          isPrimaryKey: false,
          isForeignKey: false,
          isUnique: false,
          isAutoIncrement: false,
        };

        set({
          tables: tables.map((t) =>
            t.id === tableId
              ? { ...t, columns: [...t.columns, newColumn] }
              : t
          ),
          selectedColumnId: newColumn.id,
        });

        return newColumn.id;
      },

      updateColumn: (tableId, columnId, updates) => {
        set({
          tables: get().tables.map((t) =>
            t.id === tableId
              ? {
                  ...t,
                  columns: t.columns.map((c) =>
                    c.id === columnId ? { ...c, ...updates } : c
                  ),
                }
              : t
          ),
        });
      },

      deleteColumn: (tableId, columnId) => {
        const { tables, relations } = get();
        const table = tables.find((t) => t.id === tableId);
        if (!table || table.columns.length <= 1) return; // Keep at least one column

        // Delete related relations
        const remainingRelations = relations.filter(
          (r) =>
            !(
              (r.sourceTableId === tableId && r.sourceColumnId === columnId) ||
              (r.targetTableId === tableId && r.targetColumnId === columnId)
            )
        );

        set({
          tables: tables.map((t) =>
            t.id === tableId
              ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) }
              : t
          ),
          relations: remainingRelations,
          selectedColumnId: null,
        });
      },

      reorderColumns: (tableId, columnIds) => {
        set({
          tables: get().tables.map((t) => {
            if (t.id !== tableId) return t;
            
            const columnMap = new Map(t.columns.map((c) => [c.id, c]));
            return {
              ...t,
              columns: columnIds
                .map((id) => columnMap.get(id))
                .filter((c): c is Column => c !== undefined),
            };
          }),
        });
      },

      addRelation: (relation) => {
        const id = generateId();
        set({ relations: [...get().relations, { ...relation, id }] });
        return id;
      },

      updateRelation: (relationId, updates) => {
        set({
          relations: get().relations.map((r) =>
            r.id === relationId ? { ...r, ...updates } : r
          ),
        });
      },

      deleteRelation: (relationId) => {
        set({
          relations: get().relations.filter((r) => r.id !== relationId),
          selectedRelationId: null,
        });
      },

      selectTable: (tableId) => {
        set({
          selectedTableId: tableId,
          selectedRelationId: null,
          selectedColumnId: null,
        });
      },

      selectRelation: (relationId) => {
        set({
          selectedRelationId: relationId,
          selectedTableId: null,
          selectedColumnId: null,
        });
      },

      selectColumn: (tableId, columnId) => {
        set({
          selectedTableId: tableId,
          selectedColumnId: columnId,
          selectedRelationId: null,
        });
      },

      clearSelection: () => {
        set({
          selectedTableId: null,
          selectedRelationId: null,
          selectedColumnId: null,
        });
      },

      exportToJSON: () => {
        const { tables, relations } = get();
        return JSON.stringify({ tables, relations }, null, 2);
      },

      importFromJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.tables && Array.isArray(data.tables)) {
            set({
              tables: data.tables,
              relations: data.relations || [],
              selectedTableId: null,
              selectedRelationId: null,
              selectedColumnId: null,
            });
          }
        } catch (error) {
          console.error('Failed to import JSON:', error);
          throw error;
        }
      },

      exportToSQL: () => {
        const { tables, relations } = get();
        let sql = '-- Generated by ERD Designer\n\n';

        // Generate CREATE TABLE statements
        tables.forEach((table) => {
          sql += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
          
          const columnDefs = table.columns.map((col) => {
            let def = `  \`${col.name}\` ${col.dataType}`;
            
            if (col.length) {
              def += `(${col.length})`;
            } else if (col.precision !== undefined && col.scale !== undefined) {
              def += `(${col.precision},${col.scale})`;
            }
            
            if (col.isPrimaryKey && col.isAutoIncrement) {
              def += ' AUTO_INCREMENT';
            }
            
            if (!col.nullable) {
              def += ' NOT NULL';
            }
            
            if (col.defaultValue !== undefined && col.defaultValue !== '') {
              def += ` DEFAULT ${col.defaultValue}`;
            }
            
            if (col.comment) {
              def += ` COMMENT '${col.comment}'`;
            }
            
            return def;
          });

          // Add primary key constraint
          const pkColumns = table.columns
            .filter((c) => c.isPrimaryKey)
            .map((c) => `\`${c.name}\``);
          
          if (pkColumns.length > 0) {
            columnDefs.push(`  PRIMARY KEY (${pkColumns.join(', ')})`);
          }

          // Add unique constraints
          table.columns
            .filter((c) => c.isUnique && !c.isPrimaryKey)
            .forEach((col) => {
              columnDefs.push(
                `  UNIQUE KEY \`uk_${table.name}_${col.name}\` (\`${col.name}\`)`
              );
            });

          sql += columnDefs.join(',\n');
          sql += '\n';
          
          if (table.comment) {
            sql += `) COMMENT='${table.comment}';\n\n`;
          } else {
            sql += ');\n\n';
          }
        });

        // Generate foreign key constraints
        relations.forEach((rel) => {
          const sourceTable = tables.find((t) => t.id === rel.sourceTableId);
          const targetTable = tables.find((t) => t.id === rel.targetTableId);
          
          if (sourceTable && targetTable) {
            const sourceColumn = sourceTable.columns.find(
              (c) => c.id === rel.sourceColumnId
            );
            const targetColumn = targetTable.columns.find(
              (c) => c.id === rel.targetColumnId
            );
            
            if (sourceColumn && targetColumn) {
              sql += `ALTER TABLE \`${sourceTable.name}\` `;
              sql += `ADD CONSTRAINT \`fk_${sourceTable.name}_${sourceColumn.name}\` `;
              sql += `FOREIGN KEY (\`${sourceColumn.name}\`) `;
              sql += `REFERENCES \`${targetTable.name}\`(\`${targetColumn.name}\`)`;
              
              if (rel.onDelete) {
                sql += ` ON DELETE ${rel.onDelete.replace('_', ' ')}`;
              }
              if (rel.onUpdate) {
                sql += ` ON UPDATE ${rel.onUpdate.replace('_', ' ')}`;
              }
              
              sql += ';\n';
            }
          }
        });

        return sql;
      },

      clearAll: () => {
        set({
          tables: [],
          relations: [],
          selectedTableId: null,
          selectedRelationId: null,
          selectedColumnId: null,
        });
      },
    }),
    {
      name: 'erd-designer-storage',
    }
  )
);

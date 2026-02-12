'use client';

import { ERDCanvas, PropertiesPanel } from '@/components/erd';
import AppHeader from '@/components/layout/AppHeader';
import { useERDStore } from '@/store/erdStore';
import { useCallback } from 'react';

export default function ERDPage() {
  const { 
    tables, 
    relations, 
    exportToJSON, 
    exportToSQL, 
    importFromJSON 
  } = useERDStore();

  const handleExportJSON = useCallback(() => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'erd-schema.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportToJSON]);

  const handleExportSQL = useCallback(() => {
    const sql = exportToSQL();
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'schema.sql';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportToSQL]);

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

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <AppHeader
        title="ERD Designer"
        subtitle="Visual Database Design"
        onExportJSON={handleExportJSON}
        onExportSQL={handleExportSQL}
        onImport={handleImport}
        stats={[
          { label: 'Tables', value: tables.length },
          { label: 'Relations', value: relations.length },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <ERDCanvas />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
}

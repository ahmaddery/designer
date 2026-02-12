'use client';

import { useState } from 'react';
import { useERDStore } from '@/store/erdStore';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Github, 
  HelpCircle, 
  Sparkles,
  ChevronDown,
  Download,
  Upload,
  FileCode,
  Trash2,
  Plus,
  Undo2,
  Redo2,
  Settings,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [showHelp, setShowHelp] = useState(false);
  const { tables, relations, clearAll, exportToJSON, exportToSQL, importFromJSON } = useERDStore();

  const handleExportJSON = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'erd-schema.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSQL = () => {
    const sql = exportToSQL();
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'schema.sql';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <header className="h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Database className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-sm">ERD Designer</h1>
          <p className="text-[10px] text-slate-500">Visual Database Design</p>
        </div>
      </div>

      {/* Center - Stats */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <span className="text-xs text-slate-400">Tables:</span>
          <span className="text-xs font-semibold text-slate-200">{tables.length}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <span className="text-xs text-slate-400">Relations:</span>
          <span className="text-xs font-semibold text-slate-200">{relations.length}</span>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Import/Export Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={handleExportJSON}
              className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors first:rounded-t-xl"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={handleExportSQL}
              className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors last:rounded-b-xl"
            >
              <FileCode className="w-4 h-4" />
              Export SQL
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Help */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            showHelp ? "text-blue-400 bg-blue-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* GitHub */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Quick Guide</h2>
                    <p className="text-sm text-slate-400">Learn how to use ERD Designer</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200">Create Tables</h3>
                      <p className="text-sm text-slate-400">Click &quot;New Table&quot; button or double-click on canvas to create a new table.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <div className="w-5 h-5 rounded-full border-2 border-purple-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200">Connect Tables</h3>
                      <p className="text-sm text-slate-400">Drag from one table&apos;s handle to another to create relationships.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <Settings className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200">Edit Properties</h3>
                      <p className="text-sm text-slate-400">Click on any table or column to edit its properties in the sidebar.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <FileCode className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200">Export SQL</h3>
                      <p className="text-sm text-slate-400">Export your diagram as SQL DDL statements ready to run on your database.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Delete</span>
                      <span className="text-slate-200">Delete selected</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Space + Drag</span>
                      <span className="text-slate-200">Pan canvas</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Scroll</span>
                      <span className="text-slate-200">Zoom in/out</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Click</span>
                      <span className="text-slate-200">Select</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-800">
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

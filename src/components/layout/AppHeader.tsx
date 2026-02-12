'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Workflow,
  Github, 
  HelpCircle, 
  Sparkles,
  ChevronDown,
  Download,
  Upload,
  FileCode,
  Keyboard,
  Settings,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppHeaderProps {
  onExportJSON?: () => void;
  onExportSQL?: () => void;
  onExportPNG?: () => void;
  onImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stats?: { label: string; value: number }[];
  title?: string;
  subtitle?: string;
  helpContent?: React.ReactNode;
}

export default function AppHeader({
  onExportJSON,
  onExportSQL,
  onExportPNG,
  onImport,
  stats = [],
  title = 'Designer',
  subtitle = 'Visual Design Tool',
  helpContent,
}: AppHeaderProps) {
  const [showHelp, setShowHelp] = useState(false);
  const pathname = usePathname();

  const isERD = pathname === '/';
  const isFlowchart = pathname === '/flowchart';

  return (
    <header className="h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
      {/* Logo & Navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {isERD ? (
              <Database className="w-4 h-4 text-white" />
            ) : (
              <Workflow className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm">{title}</h1>
            <p className="text-[10px] text-slate-500">{subtitle}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50 ml-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              isERD
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <Database className="w-3.5 h-3.5" />
            ERD
          </Link>
          <Link
            href="/flowchart"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              isFlowchart
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <Workflow className="w-3.5 h-3.5" />
            Flowchart
          </Link>
        </div>
      </div>

      {/* Center - Stats */}
      {stats.length > 0 && (
        <div className="hidden md:flex items-center gap-3">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50"
            >
              <span className="text-xs text-slate-400">{stat.label}:</span>
              <span className="text-xs font-semibold text-slate-200">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Export Dropdown */}
        {(onExportJSON || onExportPNG) && (
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {onExportJSON && (
                <button
                  onClick={onExportJSON}
                  className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors first:rounded-t-xl"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              )}
              {onExportSQL && (
                <button
                  onClick={onExportSQL}
                  className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <FileCode className="w-4 h-4" />
                  Export SQL
                </button>
              )}
              {onExportPNG && (
                <button
                  onClick={onExportPNG}
                  className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors last:rounded-b-xl"
                >
                  <Download className="w-4 h-4" />
                  Export PNG
                </button>
              )}
            </div>
          </div>
        )}

        {/* Import */}
        {onImport && (
          <label className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>
        )}

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
                    <p className="text-sm text-slate-400">Learn how to use {title}</p>
                  </div>
                </div>

                {helpContent || (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Plus className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-200">Create Elements</h3>
                        <p className="text-sm text-slate-400">Add new elements to your diagram using the toolbar or sidebar.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Settings className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-200">Edit Properties</h3>
                        <p className="text-sm text-slate-400">Click on any element to edit its properties in the sidebar.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-200">Export</h3>
                        <p className="text-sm text-slate-400">Save your work as JSON or export as an image.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Delete</span>
                      <span className="text-slate-200">Remove selected</span>
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
                      <span className="text-slate-200">Select element</span>
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

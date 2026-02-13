'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Workflow,
  Users,
  Menu,
  X,
  Download,
  Upload,
  HelpCircle,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavigationProps {
  onExportJSON?: () => void;
  onExportSQL?: () => void;
  onImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MobileNavigation({ 
  onExportJSON, 
  onExportSQL, 
  onImport 
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isERD = pathname === '/';
  const isFlowchart = pathname === '/flowchart';
  const isUseCase = pathname === '/usecase';

  const navItems = [
    { href: '/', icon: Database, label: 'ERD', active: isERD },
    { href: '/flowchart', icon: Workflow, label: 'Flowchart', active: isFlowchart },
    { href: '/usecase', icon: Users, label: 'Use Case', active: isUseCase },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full',
          'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
          'flex items-center justify-center',
          'active:scale-95 transition-transform'
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-slate-900 border-l border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-slate-800">
                  <h2 className="text-lg font-semibold text-white">Menu</h2>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        item.active
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </Link>
                  ))}
                </nav>

                {/* Actions */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                  {onExportJSON && (
                    <button
                      onClick={() => {
                        onExportJSON();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Export JSON</span>
                    </button>
                  )}
                  {onExportSQL && (
                    <button
                      onClick={() => {
                        onExportSQL();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Export SQL</span>
                    </button>
                  )}
                  {onImport && (
                    <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                      <Upload className="w-5 h-5" />
                      <span>Import JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          onImport(e);
                          setIsOpen(false);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileNavigation;

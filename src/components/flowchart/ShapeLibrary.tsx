'use client';

import { useState } from 'react';
import { FLOWCHART_SHAPES, type FlowchartNodeType } from '@/types/flowchart';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Square, 
  Diamond, 
  Database, 
  FileText, 
  Clock,
  HardDrive,
  Monitor,
  Hexagon,
  CircleDot,
  ArrowRightToLine,
  Keyboard,
  ChevronRight,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShapeLibraryProps {
  onDragStart: (type: FlowchartNodeType) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'Circle': <div className="w-4 h-4 rounded-full bg-current" />,
  'Square': <Square className="w-4 h-4" />,
  'Diamond': <Diamond className="w-4 h-4" />,
  'Parallelogram': <div className="w-4 h-3 bg-current transform skew-x-12" />,
  'FileText': <FileText className="w-4 h-4" />,
  'Database': <Database className="w-4 h-4" />,
  'RectangleHorizontal': <div className="w-5 h-3 border-2 border-current" />,
  'Clock': <Clock className="w-4 h-4" />,
  'HardDrive': <HardDrive className="w-4 h-4" />,
  'Keyboard': <Keyboard className="w-4 h-4" />,
  'Monitor': <Monitor className="w-4 h-4" />,
  'Hexagon': <Hexagon className="w-4 h-4" />,
  'CircleDot': <CircleDot className="w-4 h-4" />,
  'ArrowRightToLine': <ArrowRightToLine className="w-4 h-4" />,
};

const categories = [
  { id: 'basic', name: 'Basic', types: ['start', 'end', 'process', 'decision'] as FlowchartNodeType[] },
  { id: 'io', name: 'Input/Output', types: ['input', 'output', 'document'] as FlowchartNodeType[] },
  { id: 'data', name: 'Data', types: ['database', 'stored-data'] as FlowchartNodeType[] },
  { id: 'advanced', name: 'Advanced', types: ['predefined', 'delay', 'manual-input', 'display', 'preparation'] as FlowchartNodeType[] },
  { id: 'connector', name: 'Connectors', types: ['connector', 'off-page'] as FlowchartNodeType[] },
];

export default function ShapeLibrary({ onDragStart }: ShapeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredShapes = searchQuery 
    ? FLOWCHART_SHAPES.filter(shape => 
        shape.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shape.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h2 className="font-semibold text-slate-200">Shapes</h2>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shapes..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-8 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Shape List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredShapes ? (
          // Search results
          <div className="px-2 space-y-1">
            {filteredShapes.map((shape) => (
              <DraggableShapeItem 
                key={shape.type} 
                shape={shape} 
                onDragStart={() => onDragStart(shape.type)}
              />
            ))}
            {filteredShapes.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No shapes found
              </div>
            )}
          </div>
        ) : (
          // Categories
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                >
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {category.name}
                </button>
                
                <AnimatePresence>
                  {expandedCategories.includes(category.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-2 space-y-1">
                        {category.types.map((type) => {
                          const shape = FLOWCHART_SHAPES.find(s => s.type === type);
                          if (!shape) return null;
                          return (
                            <DraggableShapeItem 
                              key={shape.type} 
                              shape={shape} 
                              onDragStart={() => onDragStart(shape.type)}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="px-4 py-3 border-t border-slate-800">
        <p className="text-xs text-slate-500">
          Drag shapes to the canvas or click to add at center
        </p>
      </div>
    </div>
  );
}

interface DraggableShapeItemProps {
  shape: typeof FLOWCHART_SHAPES[0];
  onDragStart: () => void;
}

function DraggableShapeItem({ shape, onDragStart }: DraggableShapeItemProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart();
        // Set drag data
        e.dataTransfer.setData('application/flowchart-shape', shape.type);
        e.dataTransfer.effectAllowed = 'copy';
      }}
      onDragEnd={() => setIsDragging(false)}
      className={cn(
        'group flex items-center gap-3 px-3 py-2 rounded-lg cursor-grab',
        'hover:bg-white/5 transition-all duration-200',
        isDragging && 'opacity-50 cursor-grabbing'
      )}
    >
      {/* Icon */}
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: shape.defaultColor }}
      >
        {iconMap[shape.icon] || <Square className="w-4 h-4" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-300 group-hover:text-white truncate">
          {shape.label}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {shape.description}
        </p>
      </div>
    </div>
  );
}

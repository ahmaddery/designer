'use client';

import { cn } from '@/lib/utils';
import type { UseCaseNodeType } from '@/types/usecase';
import { 
  User, 
  Circle, 
  Square, 
  StickyNote,
  MousePointer,
  Minus,
  ArrowUp,
  GitBranch
} from 'lucide-react';

interface ShapeLibraryProps {
  onDragStart: (type: UseCaseNodeType) => void;
}

interface ShapeItemProps {
  type: UseCaseNodeType;
  icon: React.ReactNode;
  label: string;
  onDragStart: (type: UseCaseNodeType) => void;
}

function ShapeItem({ type, icon, label, onDragStart }: ShapeItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl cursor-grab active:cursor-grabbing",
        "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50",
        "transition-all duration-200 group"
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
    </div>
  );
}

interface EdgeTypeItemProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

function EdgeTypeItem({ icon, label }: EdgeTypeItemProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
      <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
    </div>
  );
}

export default function ShapeLibrary({ onDragStart }: ShapeLibraryProps) {
  return (
    <div className="w-full h-full bg-slate-900/95 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-blue-400" />
          Elements
        </h2>
        <p className="text-[10px] text-slate-500 mt-1">
          Drag to add elements
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Nodes Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Nodes
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <ShapeItem
              type="ACTOR"
              icon={<User className="w-5 h-5 text-blue-400" />}
              label="Actor"
              onDragStart={onDragStart}
            />
            <ShapeItem
              type="USECASE"
              icon={<Circle className="w-5 h-5 text-emerald-400" />}
              label="Use Case"
              onDragStart={onDragStart}
            />
            <ShapeItem
              type="SYSTEM"
              icon={<Square className="w-5 h-5 text-amber-400" />}
              label="System"
              onDragStart={onDragStart}
            />
            <ShapeItem
              type="NOTE"
              icon={<StickyNote className="w-5 h-5 text-purple-400" />}
              label="Note"
              onDragStart={onDragStart}
            />
          </div>
        </div>

        {/* Edge Types Reference */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Relationships
          </h3>
          <div className="space-y-2">
            <EdgeTypeItem
              type="ASSOCIATION"
              icon={<Minus className="w-5 h-5 text-slate-400" />}
              label="Association"
            />
            <EdgeTypeItem
              type="INCLUDE"
              icon={<ArrowUp className="w-5 h-5 text-slate-400 rotate-45" />}
              label="«include»"
            />
            <EdgeTypeItem
              type="EXTEND"
              icon={<ArrowUp className="w-5 h-5 text-slate-400 -rotate-45" />}
              label="«extend»"
            />
            <EdgeTypeItem
              type="GENERALIZATION"
              icon={<GitBranch className="w-5 h-5 text-slate-400" />}
              label="Generalization"
            />
          </div>
          <p className="text-[10px] text-slate-500 italic">
            Use Connect mode to create relationships
          </p>
        </div>

        {/* Quick Tips */}
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <h4 className="text-xs font-medium text-blue-400 mb-2">Quick Tips</h4>
          <ul className="text-[10px] text-slate-400 space-y-1">
            <li>• Drag elements to canvas</li>
            <li>• Double-click to edit</li>
            <li>• Press Delete to remove</li>
            <li>• Use handles to connect</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

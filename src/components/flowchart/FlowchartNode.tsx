'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useFlowchartStore } from '@/store/flowchartStore';
import { cn } from '@/lib/utils';
import { FlowchartNode as FlowchartNodeType } from '@/types/flowchart';
import { 
  MoreVertical,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowchartNodeData extends Record<string, unknown> {
  nodeId: string;
}

// Shape rendering components
const StartEndShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full rounded-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px solid ${borderColor}`,
    }}
  >
    {children}
  </div>
);

const ProcessShape = ({ color, borderColor, borderWidth, borderStyle, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full rounded-xl flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px ${borderStyle} ${borderColor}`,
    }}
  >
    {children}
  </div>
);

const DecisionShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    }}
  >
    <div className="w-[70%] h-[70%] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const InputOutputShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
    }}
  >
    <div className="w-[80%] h-[70%] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const DocumentShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full rounded-t-xl flex items-center justify-center relative transition-all duration-200',
      selected && 'ring-2 ring-white/50 rounded-b-xl'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px solid ${borderColor}`,
      borderBottom: 'none',
      borderRadius: '12px 12px 0 12px',
    }}
  >
    <div
      className="absolute bottom-0 right-0 w-[30%] h-[30%]"
      style={{
        backgroundColor: borderColor,
        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
      }}
    />
    <div className="w-[80%] h-[70%] flex items-center justify-center z-10">
      {children}
    </div>
  </div>
);

const DatabaseShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex flex-col items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50 rounded-xl'
    )}
  >
    <div
      className="w-full h-[20%] rounded-[50%]"
      style={{
        backgroundColor: borderColor,
        border: `${borderWidth}px solid ${borderColor}`,
      }}
    />
    <div
      className="w-full flex-1"
      style={{
        backgroundColor: color,
        borderLeft: `${borderWidth}px solid ${borderColor}`,
        borderRight: `${borderWidth}px solid ${borderColor}`,
      }}
    />
    <div
      className="w-full h-[20%] rounded-[50%] border-t-0"
      style={{
        backgroundColor: color,
        border: `${borderWidth}px solid ${borderColor}`,
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      {children}
    </div>
  </div>
);

const PredefinedShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50 rounded-xl'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px double ${borderColor}`,
      borderRadius: '12px',
    }}
  >
    {children}
  </div>
);

const DelayShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: '12px 12px 40px 12px',
    }}
  >
    {children}
  </div>
);

const StoredDataShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50 rounded-xl'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: '0 50% 50% 0',
    }}
  >
    {children}
  </div>
);

const PreparationShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
    }}
  >
    <div className="w-[70%] h-[70%] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const ConnectorShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full rounded-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      border: `${borderWidth}px solid ${borderColor}`,
    }}
  >
    {children}
  </div>
);

const OffPageShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
    }}
  >
    <div className="w-[70%] h-[70%] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const ManualInputShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(0% 25%, 100% 0%, 100% 100%, 0% 100%)',
    }}
  >
    <div className="w-[80%] h-[70%] flex items-center justify-center mt-2">
      {children}
    </div>
  </div>
);

const DisplayShape = ({ color, borderColor, borderWidth, selected, children }: any) => (
  <div
    className={cn(
      'w-full h-full flex items-center justify-center transition-all duration-200',
      selected && 'ring-2 ring-white/50'
    )}
    style={{
      backgroundColor: color,
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
    }}
  >
    <div className="w-[70%] h-[70%] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const ShapeContent = ({ node, isSelected }: { node: FlowchartNodeType; isSelected: boolean }) => {
  const { data, type } = node;
  const textStyle: React.CSSProperties = {
    color: data.textColor || '#FFFFFF',
    fontSize: `${data.fontSize || 14}px`,
    fontWeight: 500,
    textAlign: 'center',
    wordWrap: 'break-word',
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    lineHeight: 1.3,
    opacity: data.opacity || 1,
  };

  const shapeProps = {
    color: data.color || '#3B82F6',
    borderColor: data.borderColor || '#1D4ED8',
    borderWidth: data.borderWidth || 2,
    borderStyle: data.borderStyle || 'solid',
    selected: isSelected,
  };

  const content = (
    <span style={textStyle} className="px-2 select-none pointer-events-none">
      {data.label}
    </span>
  );

  switch (type) {
    case 'start':
    case 'end':
      return <StartEndShape {...shapeProps}>{content}</StartEndShape>;
    case 'process':
      return <ProcessShape {...shapeProps}>{content}</ProcessShape>;
    case 'decision':
      return <DecisionShape {...shapeProps}>{content}</DecisionShape>;
    case 'input':
    case 'output':
      return <InputOutputShape {...shapeProps}>{content}</InputOutputShape>;
    case 'document':
      return <DocumentShape {...shapeProps}>{content}</DocumentShape>;
    case 'database':
      return <DatabaseShape {...shapeProps}>{content}</DatabaseShape>;
    case 'predefined':
      return <PredefinedShape {...shapeProps}>{content}</PredefinedShape>;
    case 'delay':
      return <DelayShape {...shapeProps}>{content}</DelayShape>;
    case 'stored-data':
      return <StoredDataShape {...shapeProps}>{content}</StoredDataShape>;
    case 'preparation':
      return <PreparationShape {...shapeProps}>{content}</PreparationShape>;
    case 'connector':
      return <ConnectorShape {...shapeProps}>{content}</ConnectorShape>;
    case 'off-page':
      return <OffPageShape {...shapeProps}>{content}</OffPageShape>;
    case 'manual-input':
      return <ManualInputShape {...shapeProps}>{content}</ManualInputShape>;
    case 'display':
      return <DisplayShape {...shapeProps}>{content}</DisplayShape>;
    default:
      return <ProcessShape {...shapeProps}>{content}</ProcessShape>;
  }
};

function FlowchartNodeComponent({ data, selected }: NodeProps) {
  const { nodeId } = data as FlowchartNodeData;
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const node = useFlowchartStore((state) => 
    state.nodes.find((n) => n.id === nodeId)
  );
  const selectedNodeId = useFlowchartStore((state) => state.selectedNodeId);
  const selectNode = useFlowchartStore((state) => state.selectNode);
  const duplicateNode = useFlowchartStore((state) => state.duplicateNode);
  const deleteNode = useFlowchartStore((state) => state.deleteNode);
  const bringToFront = useFlowchartStore((state) => state.bringToFront);
  const sendToBack = useFlowchartStore((state) => state.sendToBack);
  const updateNodeData = useFlowchartStore((state) => state.updateNodeData);
  
  const isSelected = selectedNodeId === nodeId || selected;

  if (!node) return null;

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(nodeId);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(nodeId);
    setShowMenu(false);
  };

  const handleColorChange = (color: string) => {
    updateNodeData(nodeId, { color, borderColor: color });
    setShowMenu(false);
  };

  const rotation = node.rotation || 0;

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        isSelected && 'z-50'
      )}
      style={{
        width: node.size.width,
        height: node.size.height,
        transform: `rotate(${rotation}deg)`,
        opacity: node.data.opacity || 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectNode(nodeId)}
    >
      {/* Shape */}
      <ShapeContent node={node} isSelected={isSelected} />

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -inset-1 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none" />
      )}

      {/* Resize handles (visible when selected) */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
        </>
      )}

      {/* Context Menu Button */}
      {(isHovered || isSelected) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-lg transition-all z-50"
        >
          <MoreVertical className="w-3 h-3" />
        </button>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute -top-2 left-full ml-2 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden"
          >
            <button
              onClick={handleDuplicate}
              className="w-full px-3 py-2 flex items-center gap-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); bringToFront(nodeId); setShowMenu(false); }}
              className="w-full px-3 py-2 flex items-center gap-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Bring to Front
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); sendToBack(nodeId); setShowMenu(false); }}
              className="w-full px-3 py-2 flex items-center gap-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              Send to Back
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
                      node.data.color === color && 'ring-2 ring-white'
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
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* React Flow Handles */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ top: -6 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ right: -6 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ right: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ bottom: -6 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ left: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white/50 !border-2 !border-slate-400 hover:!bg-blue-400 hover:!border-blue-400 transition-colors"
        style={{ left: -6 }}
      />
    </div>
  );
}

export default memo(FlowchartNodeComponent);

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Screen } from '../../types/flow';

const ScreenNode = ({ data, selected, ...props }: NodeProps<Screen>) => {
  return (
    <div 
      style={{
        borderColor: selected ? '#3b82f6' : '#e5e7eb',
        borderWidth: '2px',
        borderRadius: '6px',
        padding: '8px 16px'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ width: '12px', height: '12px' }}
      />
      
      <div className="text-sm font-medium">{data.name}</div>
      {data.description && (
        <div className="text-xs text-gray-500">{data.description}</div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ width: '12px', height: '12px' }}
      />
    </div>
  );
};

export default memo(ScreenNode);
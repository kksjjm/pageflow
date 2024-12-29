import React from 'react';
import { useFlowStore } from '../../store/flowStore';

const FlowToolbar: React.FC = () => {
  const addNode = useFlowStore((state) => state.addNode);
  const nodes = useFlowStore((state) => state.nodes);

  const handleAddScreen = () => {
    const screenId = Date.now().toString();
    addNode({
      id: screenId,
      name: 'New Screen',
      description: 'Click to edit details',
      image: '',
      component: '',
      api: '',
    });
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-lg p-2">
      <button
        onClick={handleAddScreen}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Add Screen ({nodes.length} nodes)
      </button>
    </div>
  );
};

export default FlowToolbar;
import React, { useState } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { parseDSL, convertDSLToFlow, generateDSL } from '../../utils/dslUtils';

const DslEditor: React.FC = () => {
  const { nodes, edges, setNodes, setEdges } = useFlowStore();
  const [dslCode, setDslCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleApplyDSL = () => {
    try {
      const parsed = parseDSL(dslCode);
      const { nodes: newNodes, edges: newEdges } = convertDSLToFlow(parsed);

      // 기존 노드와 겹치지 않도록 위치 조정
      const adjustedNodes = newNodes.map((newNode) => {
        const existingNode = nodes.find(node => node.id === newNode.id);
        if (existingNode) {
          // 겹치는 경우 위치 조정
          return {
            ...newNode,
            position: {
              x: newNode.position.x + 20, // x축으로 20만큼 이동
              y: newNode.position.y + 20, // y축으로 20만큼 이동
            },
          };
        }
        return newNode;
      });

      setNodes(adjustedNodes);
      setEdges(newEdges);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGenerateDSL = () => {
    const generated = generateDSL(nodes, edges);
    setDslCode(generated);
  };

  return (
    <div className="absolute right-4 top-4 w-96 bg-white rounded-lg shadow-lg p-4 z-10">
      <h3 className="text-lg font-semibold mb-2">DSL Editor</h3>
      <textarea
        value={dslCode}
        onChange={(e) => setDslCode(e.target.value)}
        className="w-full h-500 p-2 border rounded mb-2 font-mono text-sm"
        placeholder="Enter your DSL code here..."
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex gap-2">
        <button
          onClick={handleApplyDSL}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply DSL
        </button>
        <button
          onClick={handleGenerateDSL}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Generate DSL
        </button>
      </div>
    </div>
  );
};

export default DslEditor;
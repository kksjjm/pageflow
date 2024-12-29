import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  EdgeChange,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useFlowStore } from '../../store/flowStore';
import ScreenNode from './ScreenNode';
import ScreenNodeDialog from './ScreenNodeDialog';
import { Screen } from '../../types/flow';

const nodeTypes = {
  screen: ScreenNode,
};

const FlowEditor: React.FC = () => {
  const { nodes, edges, setNodes, setEdges } = useFlowStore();
  const [selectedEdge, setSelectedEdge] = useState<Connection | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<Screen> | null>(null);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isDialogOpen) return;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedEdge) {
          handleDeleteEdge();
        }
        if (selectedNode) {
          handleDeleteNode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEdge, selectedNode, isDialogOpen]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes));
      if (changes.some(change => change.type === 'remove')) {
        setSelectedNode(null);
      }
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges));
      if (changes.some(change => change.type === 'remove')) {
        setSelectedEdge(null);
        setButtonPosition(undefined);
      }
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `e${edges.length}`,
        source: connection.source as string,
        target: connection.target as string,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
        animated: true,
      };
      setEdges([...edges, newEdge]);
    },
    [edges, setEdges]
  );

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      setEdges(edges.filter(edge => edge.id !== selectedEdge.source));
      setSelectedEdge(null);
      setButtonPosition(undefined);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter(node => node.id !== selectedNode.id));
      setEdges(edges.filter(edge => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    const connection: Connection = {
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? null,
      targetHandle: edge.targetHandle ?? null,
    };
    setSelectedEdge(connection);
    setSelectedNode(null);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setButtonPosition({ x: rect.x, y: rect.y - 30 });
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node<Screen>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setButtonPosition(undefined);
    setIsDialogOpen(true);
    setButtonPosition({ x: node.position.x + 20, y: node.position.y });
  };

  const handleUpdateNode = (updatedData: Screen) => {
    if (selectedNode) {
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <ScreenNodeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        node={selectedNode?.data ?? null}
        onSave={handleUpdateNode}
        buttonPosition={buttonPosition}
      />
    </div>
  );
};

export default FlowEditor;
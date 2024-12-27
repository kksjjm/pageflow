import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { Screen } from '../types/flow';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  addNode: (screen: Screen) => void;
  updateNode: (id: string, data: Partial<Screen>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

// ID에서 숫자만 추출하는 함수
const getNumericId = (): string => {
  return Date.now().toString();
};

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  
  addNode: (screen: Screen) => {
    const newNode: Node = {
      id: screen.id || getNumericId(),
      type: 'screen',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: screen,
    };
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },
  
  updateNode: (id: string, data: Partial<Screen>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }));
  },
  
  removeNode: (id: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    }));
  },
  
  addEdge: (edge: Edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },
  
  removeEdge: (id: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    }));
  },
  
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
}));
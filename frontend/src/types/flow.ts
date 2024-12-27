export interface Screen {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    image: string;
    component: string;
    api: string;
  }
  
  export interface ScreenNode {
    id: string;
    type: 'screen';
    position: { x: number; y: number };
    data: Screen;
  }
  
  export interface ScreenEdge {
    id: string;
    source: string;
    target: string;
    type?: string;
    label?: string;
  }
  
  export interface ScreenFlow {
    nodes: ScreenNode[];
    edges: ScreenEdge[];
  }

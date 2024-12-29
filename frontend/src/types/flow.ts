export interface Screen {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    image: string;
    component: string;
    api: string;
    componentInfo?: ComponentInfo[];
    apiInfo?: APIInfo[];
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

export interface ComponentInfo {
    id: string;
    name: string;
    props: { [key: string]: string | number | boolean };
    children?: ComponentInfo[];
    actions?: { [key: string]: () => void };
}

export interface APIInfo {
    apiID: string;
    endpoint: string;
    method: 'GET'|'POST'|'PUT'|'DELETE';
    request: { [key: string]: string | number | boolean };
    response: {
        format: 'JSON' | 'XML';
        structure: { [key: string]: string };
    };
}

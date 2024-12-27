export interface Component {
    name: string;
    type: string;
    props?: Record<string, any>;
  }
  
  export interface Api {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    description?: string;
    requestBody?: Record<string, any>;
    responseBody?: Record<string, any>;
  }
  
  export interface ScreenDefinition {
    id: string;
    name: string;
    description?: string;
    route?: string;
    position?: { x: number; y: number };
    imageUrl?: string;
    components?: Component[];
    apis?: Api[];
  }
  
  export interface FlowDefinition {
    source: string;
    target: string;
  }
  
  export interface ParsedDSL {
    screens: ScreenDefinition[];
    flows: FlowDefinition[];
  }
  
  export type TokenType = 
    | 'SCREEN'
    | 'FLOW'
    | 'IDENTIFIER'
    | 'STRING'
    | 'NUMBER'
    | 'ARROW'
    | 'COLON'
    | 'BRACKET_LEFT'
    | 'BRACKET_RIGHT'
    | 'OBJECT_START'
    | 'OBJECT_END'
    | 'ARRAY_START'
    | 'ARRAY_END'
    | 'COMMA'
    | 'NEWLINE';
  
  export interface Token {
    type: TokenType;
    value: string;
    line: number;
  }
import { Lexer } from './dslLexer';
import { Parser } from './dslParser';
import { ParsedDSL, Component, Api } from '../types/dsl';
import { Node, Edge } from 'reactflow';

export const parseDSL = (input: string): ParsedDSL => {
  try {
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    return parser.parse();
  } catch (error) {
    console.error('Error parsing DSL:', error);
    throw error;
  }
};

export const convertDSLToFlow = (parsed: ParsedDSL): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = parsed.screens.map((screen) => ({
    id: screen.id,
    type: 'screen',
    position: screen.position || { x: 0, y: 0 },
    data: {
      name: screen.name,
      description: screen.description,
      route: screen.route,
      imageUrl: screen.imageUrl,
      components: screen.components || [],
      apis: screen.apis || [],
    },
  }));

  const edges: Edge[] = parsed.flows.map((flow, index) => ({
    id: `e${index}`,
    source: flow.source,
    target: flow.target,
    animated: true,
  }));

  return { nodes, edges };
};

const stringifyObject = (obj: any, indent: number = 2): string => {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return `[\n${obj.map(item => ' '.repeat(indent + 2) + stringifyObject(item, indent + 2)).join(',\n')}\n${' '.repeat(indent)}]`;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    return `{\n${entries.map(([key, value]) => 
      ' '.repeat(indent + 2) + `${key}: ${stringifyObject(value, indent + 2)}`
    ).join(',\n')}\n${' '.repeat(indent)}}`;
  }
  
  if (typeof obj === 'string') return `"${obj}"`;
  return String(obj);
};

export const generateDSL = (nodes: Node[], edges: Edge[]): string => {
  let dsl = '';

  // Generate screen definitions
  nodes.forEach(node => {
    dsl += `screen ${node.id} {\n`;
    dsl += `  name: "${node.data.name}"\n`;
    
    if (node.data.description) {
      dsl += `  description: "${node.data.description}"\n`;
    }
    
    if (node.data.route) {
      dsl += `  route: "${node.data.route}"\n`;
    }

    // Add position information
    dsl += `  position: ${stringifyObject(node.position)}\n`;

    // Add image URL if exists
    if (node.data.imageUrl) {
      dsl += `  imageUrl: "${node.data.imageUrl}"\n`;
    }

    // Add components if exists
    if (node.data.components?.length > 0) {
      dsl += `  components: ${stringifyObject(node.data.components)}\n`;
    }

    // Add APIs if exists
    if (node.data.apis?.length > 0) {
      dsl += `  apis: ${stringifyObject(node.data.apis)}\n`;
    }

    // 모든 속성 추가
    dsl += `  component: "${node.data.component}"\n`;
    dsl += `  api: "${node.data.api}"\n`;

    dsl += '}\n\n';
  });

  // Generate flow definitions
  if (edges.length > 0) {
    dsl += 'flow {\n';
    edges.forEach(edge => {
      dsl += `  ${edge.source} -> ${edge.target}\n`;
    });
    dsl += '}\n';
  }

  return dsl;
};
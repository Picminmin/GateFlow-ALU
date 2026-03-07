export type LogicValue = 0 | 1;

export type GateType =
  | 'INPUT'
  | 'OUTPUT'
  | 'AND'
  | 'OR'
  | 'XOR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XNOR';

export interface CircuitNode {
  id: string;
  type: GateType;
  label: string;
  x: number;
  y: number;
  delay: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface CircuitEdge {
  id: string;
  from: string;
  to: string;
  points?: Point[];
}

export interface CircuitGraph {
  id: string;
  label: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  inputNodeIds: string[];
  outputNodeIds: string[];
}

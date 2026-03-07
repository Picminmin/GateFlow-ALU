import type { CircuitGraph } from '../../types';

export type FullAdderMode = 'primitive' | 'optimized';

export interface FullAdderCircuitSet {
  primitive: CircuitGraph;
  optimized: CircuitGraph;
}

export const fullAdderCircuits: FullAdderCircuitSet = {
  primitive: {
    id: 'full-adder-primitive',
    label: 'Full Adder (Primitive)',
    nodes: [],
    edges: [],
    inputNodeIds: [],
    outputNodeIds: [],
  },
  optimized: {
    id: 'full-adder-optimized',
    label: 'Full Adder (Optimized)',
    nodes: [],
    edges: [],
    inputNodeIds: [],
    outputNodeIds: [],
  },
};

export function getFullAdderCircuit(mode: FullAdderMode): CircuitGraph {
  return fullAdderCircuits[mode];
}

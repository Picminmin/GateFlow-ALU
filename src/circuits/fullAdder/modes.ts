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
    inputNodeIds: ['in-a', 'in-b', 'in-cin'],
    outputNodeIds: ['out-sum', 'out-cout'],
    nodes: [
      { id: 'in-a', type: 'INPUT', label: 'A', x: 80, y: 80, delay: 0 },
      { id: 'in-b', type: 'INPUT', label: 'B', x: 80, y: 170, delay: 0 },
      { id: 'in-cin', type: 'INPUT', label: 'Cin', x: 80, y: 260, delay: 0 },
      { id: 'not-a', type: 'NOT', label: 'NOT', x: 200, y: 80, delay: 1 },
      { id: 'not-b', type: 'NOT', label: 'NOT', x: 200, y: 170, delay: 1 },
      { id: 'not-cin', type: 'NOT', label: 'NOT', x: 200, y: 260, delay: 1 },
      { id: 'sum-and-1', type: 'AND', label: 'AND', x: 360, y: 60, delay: 1 },
      { id: 'sum-and-2', type: 'AND', label: 'AND', x: 360, y: 130, delay: 1 },
      { id: 'sum-and-3', type: 'AND', label: 'AND', x: 360, y: 200, delay: 1 },
      { id: 'sum-and-4', type: 'AND', label: 'AND', x: 360, y: 270, delay: 1 },
      { id: 'sum-or-1', type: 'OR', label: 'OR', x: 520, y: 100, delay: 1 },
      { id: 'sum-or-2', type: 'OR', label: 'OR', x: 520, y: 235, delay: 1 },
      { id: 'sum-or-3', type: 'OR', label: 'OR', x: 660, y: 170, delay: 1 },
      { id: 'cout-and-1', type: 'AND', label: 'AND', x: 360, y: 340, delay: 1 },
      { id: 'cout-and-2', type: 'AND', label: 'AND', x: 520, y: 340, delay: 1 },
      { id: 'cout-and-3', type: 'AND', label: 'AND', x: 680, y: 340, delay: 1 },
      { id: 'cout-or-1', type: 'OR', label: 'OR', x: 820, y: 320, delay: 1 },
      { id: 'cout-or-2', type: 'OR', label: 'OR', x: 960, y: 320, delay: 1 },
      { id: 'out-sum', type: 'OUTPUT', label: 'Sum', x: 800, y: 170, delay: 0 },
      { id: 'out-cout', type: 'OUTPUT', label: 'Cout', x: 1110, y: 320, delay: 0 },
    ],
    edges: [
      { id: 'a-not-a', from: 'in-a', to: 'not-a' },
      { id: 'b-not-b', from: 'in-b', to: 'not-b' },
      { id: 'cin-not-cin', from: 'in-cin', to: 'not-cin' },
      { id: 'not-a-to-sum-and-1', from: 'not-a', to: 'sum-and-1' },
      { id: 'not-b-to-sum-and-1', from: 'not-b', to: 'sum-and-1' },
      { id: 'cin-to-sum-and-1', from: 'in-cin', to: 'sum-and-1' },
      { id: 'not-a-to-sum-and-2', from: 'not-a', to: 'sum-and-2' },
      { id: 'b-to-sum-and-2', from: 'in-b', to: 'sum-and-2' },
      { id: 'not-cin-to-sum-and-2', from: 'not-cin', to: 'sum-and-2' },
      { id: 'a-to-sum-and-3', from: 'in-a', to: 'sum-and-3' },
      { id: 'not-b-to-sum-and-3', from: 'not-b', to: 'sum-and-3' },
      { id: 'not-cin-to-sum-and-3', from: 'not-cin', to: 'sum-and-3' },
      { id: 'a-to-sum-and-4', from: 'in-a', to: 'sum-and-4' },
      { id: 'b-to-sum-and-4', from: 'in-b', to: 'sum-and-4' },
      { id: 'cin-to-sum-and-4', from: 'in-cin', to: 'sum-and-4' },
      { id: 'sum-and-1-to-sum-or-1', from: 'sum-and-1', to: 'sum-or-1' },
      { id: 'sum-and-2-to-sum-or-1', from: 'sum-and-2', to: 'sum-or-1' },
      { id: 'sum-and-3-to-sum-or-2', from: 'sum-and-3', to: 'sum-or-2' },
      { id: 'sum-and-4-to-sum-or-2', from: 'sum-and-4', to: 'sum-or-2' },
      { id: 'sum-or-1-to-sum-or-3', from: 'sum-or-1', to: 'sum-or-3' },
      { id: 'sum-or-2-to-sum-or-3', from: 'sum-or-2', to: 'sum-or-3' },
      { id: 'sum-or-3-to-output', from: 'sum-or-3', to: 'out-sum' },
      { id: 'a-to-cout-and-1', from: 'in-a', to: 'cout-and-1' },
      { id: 'b-to-cout-and-1', from: 'in-b', to: 'cout-and-1' },
      { id: 'b-to-cout-and-2', from: 'in-b', to: 'cout-and-2' },
      { id: 'cin-to-cout-and-2', from: 'in-cin', to: 'cout-and-2' },
      { id: 'a-to-cout-and-3', from: 'in-a', to: 'cout-and-3' },
      { id: 'cin-to-cout-and-3', from: 'in-cin', to: 'cout-and-3' },
      { id: 'cout-and-1-to-cout-or-1', from: 'cout-and-1', to: 'cout-or-1' },
      { id: 'cout-and-2-to-cout-or-1', from: 'cout-and-2', to: 'cout-or-1' },
      { id: 'cout-or-1-to-cout-or-2', from: 'cout-or-1', to: 'cout-or-2' },
      { id: 'cout-and-3-to-cout-or-2', from: 'cout-and-3', to: 'cout-or-2' },
      { id: 'cout-or-2-to-output', from: 'cout-or-2', to: 'out-cout' },
    ],
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

import type { CircuitGraph } from '../../types';
import { fullAdderCircuits } from './modes';

function pickCircuit(base: CircuitGraph, nodeIds: string[], id: string, label: string): CircuitGraph {
  const nodeSet = new Set(nodeIds);
  return {
    id,
    label,
    inputNodeIds: base.inputNodeIds.filter((nodeId) => nodeSet.has(nodeId)),
    outputNodeIds: base.outputNodeIds.filter((nodeId) => nodeSet.has(nodeId)),
    nodes: base.nodes.filter((node) => nodeSet.has(node.id)),
    edges: base.edges.filter((edge) => nodeSet.has(edge.from) && nodeSet.has(edge.to)),
  };
}

export function getOptimizedTransitionCircuits(): CircuitGraph[] {
  const primitive = fullAdderCircuits.primitive;
  const stageReduced = pickCircuit(
    primitive,
    [
      'in-a',
      'in-b',
      'in-cin',
      'not-a',
      'not-b',
      'not-cin',
      'sum-and-2',
      'sum-and-3',
      'sum-and-4',
      'sum-or-2',
      'sum-or-3',
      'cout-and-1',
      'cout-and-2',
      'cout-and-3',
      'cout-or-1',
      'cout-or-2',
      'out-sum',
      'out-cout',
    ],
    'full-adder-optimized-stage-reduced',
    'Optimization Stage 2: Reduced candidates',
  );

  const optimized = fullAdderCircuits.optimized;

  return [
    {
      ...primitive,
      id: 'full-adder-optimized-stage-primitive',
      label: 'Optimization Stage 1: Primitive baseline',
    },
    stageReduced,
    {
      ...optimized,
      id: 'full-adder-optimized-stage-final',
      label: 'Optimization Stage 3: Final optimized',
    },
  ];
}

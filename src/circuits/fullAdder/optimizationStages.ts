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
  const stage2 = pickCircuit(
    primitive,
    [
      'in-a',
      'in-b',
      'in-cin',
      'not-a',
      'not-b',
      'not-cin',
      'sum-and-1',
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
    'full-adder-optimized-stage-2',
    'Optimization Stage 2: remove duplicated Sum branch',
  );

  const stage3 = pickCircuit(
    primitive,
    [
      'in-a',
      'in-b',
      'in-cin',
      'not-a',
      'not-b',
      'not-cin',
      'sum-and-1',
      'sum-and-2',
      'sum-and-3',
      'sum-and-4',
      'sum-or-2',
      'sum-or-3',
      'cout-and-1',
      'cout-and-2',
      'cout-or-1',
      'cout-or-2',
      'out-sum',
      'out-cout',
    ],
    'full-adder-optimized-stage-3',
    'Optimization Stage 3: merge carry contributors',
  );

  const optimized = fullAdderCircuits.optimized;

  return [
    {
      ...primitive,
      id: 'full-adder-optimized-stage-primitive',
      label: 'Optimization Stage 1: Primitive baseline',
    },
    stage2,
    stage3,
    {
      ...optimized,
      id: 'full-adder-optimized-stage-final',
      label: 'Optimization Stage 4: Final optimized (XOR-based)',
    },
  ];
}

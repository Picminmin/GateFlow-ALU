import type { CircuitGraph, LogicValue, SignalChangeEvent } from '../types';

export function getNodeDelay(circuit: CircuitGraph, nodeId: string): number {
  const node = circuit.nodes.find((item) => item.id === nodeId);
  return node?.delay ?? 0;
}

export function computePropagationTime(
  currentTime: number,
  circuit: CircuitGraph,
  targetNodeId: string,
): number {
  return currentTime + getNodeDelay(circuit, targetNodeId);
}

export function createDelayedSignalEvent(params: {
  id: string;
  currentTime: number;
  circuit: CircuitGraph;
  targetNodeId: string;
  value: LogicValue;
  sourceNodeId?: string;
}): SignalChangeEvent {
  return {
    id: params.id,
    nodeId: params.targetNodeId,
    value: params.value,
    time: computePropagationTime(params.currentTime, params.circuit, params.targetNodeId),
    sourceNodeId: params.sourceNodeId,
  };
}

import type { CircuitGraph, CircuitNode, LogicValue } from '../types';

function normalize(value: LogicValue): LogicValue {
  return value === 1 ? 1 : 0;
}

export function evaluateGateType(type: CircuitNode['type'], inputs: LogicValue[]): LogicValue {
  if (type === 'INPUT' || type === 'OUTPUT') {
    return normalize(inputs[0] ?? 0);
  }

  if (type === 'NOT') {
    return inputs[0] === 1 ? 0 : 1;
  }

  if (type === 'AND') {
    return inputs.every((value) => value === 1) ? 1 : 0;
  }

  if (type === 'NAND') {
    return inputs.every((value) => value === 1) ? 0 : 1;
  }

  if (type === 'OR') {
    return inputs.some((value) => value === 1) ? 1 : 0;
  }

  if (type === 'NOR') {
    return inputs.some((value) => value === 1) ? 0 : 1;
  }

  if (type === 'XOR') {
    const onesCount = inputs.filter((value) => value === 1).length;
    return onesCount % 2 === 1 ? 1 : 0;
  }

  if (type === 'XNOR') {
    const onesCount = inputs.filter((value) => value === 1).length;
    return onesCount % 2 === 1 ? 0 : 1;
  }

  return 0;
}

export function evaluateNodeOutput(
  circuit: CircuitGraph,
  nodeId: string,
  values: Record<string, LogicValue>,
): LogicValue {
  const node = circuit.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return 0;
  }

  if (node.type === 'INPUT') {
    return values[nodeId] ?? 0;
  }

  const inputValues = circuit.edges
    .filter((edge) => edge.to === nodeId)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((edge) => values[edge.from] ?? 0);

  return evaluateGateType(node.type, inputValues);
}

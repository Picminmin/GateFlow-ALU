import type { CircuitGraph } from '../types';

export interface ViewportBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function getCircuitBounds(circuit: CircuitGraph): ViewportBounds {
  if (circuit.nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 480 };
  }

  const xs = circuit.nodes.map((node) => node.x);
  const ys = circuit.nodes.map((node) => node.y);

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

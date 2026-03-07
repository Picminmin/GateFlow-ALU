import type { CircuitGraph, CircuitNode, LogicValue, WireSignal } from '../../types';
import { getCircuitBounds } from '../../renderer';

interface CircuitViewportProps {
  circuit: CircuitGraph;
  activeSignals?: WireSignal[];
  currentTime?: number;
  nodeValues?: Record<string, LogicValue>;
}

function nodeClassName(node: CircuitNode, isActive: boolean): string {
  if (node.type === 'INPUT') return 'circuit-node circuit-node-input';
  if (node.type === 'OUTPUT') return 'circuit-node circuit-node-output';
  return isActive ? 'circuit-node circuit-node-gate circuit-node-active' : 'circuit-node circuit-node-gate';
}

export function CircuitViewport({
  circuit,
  activeSignals = [],
  currentTime = 0,
  nodeValues = {},
}: CircuitViewportProps) {
  const nodeById = new Map(circuit.nodes.map((node) => [node.id, node]));
  const bounds = getCircuitBounds(circuit);
  const padding = 80;
  const viewBoxX = bounds.minX - padding;
  const viewBoxY = bounds.minY - padding;
  const viewBoxWidth = bounds.maxX - bounds.minX + padding * 2;
  const viewBoxHeight = bounds.maxY - bounds.minY + padding * 2;

  return (
    <section className="circuit-viewport" aria-label="Circuit viewport">
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        role="img"
        aria-label={circuit.label}
      >
        <rect
          x={viewBoxX}
          y={viewBoxY}
          width={viewBoxWidth}
          height={viewBoxHeight}
          className="circuit-background"
          rx="16"
        />

        {circuit.edges.map((edge) => {
          const fromNode = nodeById.get(edge.from);
          const toNode = nodeById.get(edge.to);
          if (!fromNode || !toNode) {
            return null;
          }

          const x1 = fromNode.x + 40;
          const y1 = fromNode.y;
          const x2 = toNode.x - 40;
          const y2 = toNode.y;
          const isActive = activeSignals.some(
            (signal) =>
              signal.edgeId === edge.id &&
              currentTime >= signal.startTime &&
              currentTime <= signal.endTime,
          );

          return (
            <g key={edge.id}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isActive ? 'circuit-edge circuit-edge-active' : 'circuit-edge'}
              />
              {edge.label ? (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  className="circuit-edge-label"
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {activeSignals.map((signal) => {
          const edge = circuit.edges.find((item) => item.id === signal.edgeId);
          if (!edge) {
            return null;
          }

          const fromNode = nodeById.get(edge.from);
          const toNode = nodeById.get(edge.to);
          if (!fromNode || !toNode) {
            return null;
          }

          const x1 = fromNode.x + 40;
          const y1 = fromNode.y;
          const x2 = toNode.x - 40;
          const y2 = toNode.y;
          const duration = Math.max(1, signal.endTime - signal.startTime);
          const rawProgress = (currentTime - signal.startTime) / duration;
          const progress = Math.min(1, Math.max(0, rawProgress));

          return (
            <circle
              key={`${signal.edgeId}-${signal.startTime}`}
              cx={x1 + (x2 - x1) * progress}
              cy={y1 + (y2 - y1) * progress}
              r={5}
              className="signal-dot"
            />
          );
        })}

        {circuit.nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x - 40}, ${node.y - 22})`}>
            <rect width="80" height="44" rx="8" className={nodeClassName(node, (nodeValues[node.id] ?? 0) === 1)} />
            <text x="40" y="27" className="circuit-node-label">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

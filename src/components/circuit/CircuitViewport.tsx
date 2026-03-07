import type { CircuitGraph, CircuitNode, LogicValue, WireSignal } from '../../types';
import { buildRoutedWire, getCircuitBounds, getPointAlongPolyline } from '../../renderer';

interface CircuitViewportProps {
  circuit: CircuitGraph;
  activeSignals?: WireSignal[];
  currentTime?: number;
  nodeValues?: Record<string, LogicValue>;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
}

function nodeClassName(node: CircuitNode, isActive: boolean, isSelected: boolean): string {
  const classes = ['circuit-node', 'circuit-node-shape'];
  if (node.type === 'INPUT') classes.push('circuit-node-input');
  else if (node.type === 'OUTPUT') classes.push('circuit-node-output');
  else classes.push('circuit-node-gate');
  if (isActive) classes.push('circuit-node-active');
  if (isSelected) classes.push('circuit-node-selected');
  return classes.join(' ');
}

function renderMilShape(node: CircuitNode, shapeClass: string): JSX.Element {
  if (node.type === 'AND') {
    return <path d="M12 4 H36 A18 18 0 0 1 36 40 H12 Z" className={shapeClass} />;
  }

  if (node.type === 'OR') {
    return <path d="M12 4 Q26 22 12 40 H34 Q66 22 34 4 Z" className={shapeClass} />;
  }

  if (node.type === 'XOR') {
    return (
      <>
        <path d="M8 4 Q22 22 8 40" className={shapeClass} />
        <path d="M14 4 Q28 22 14 40 H34 Q66 22 34 4 Z" className={shapeClass} />
      </>
    );
  }

  if (node.type === 'NOT') {
    return (
      <>
        <path d="M14 4 L14 40 L50 22 Z" className={shapeClass} />
        <circle cx="56" cy="22" r="4" className={shapeClass} />
      </>
    );
  }

  return <rect width="80" height="44" rx="8" className={shapeClass} />;
}

export function CircuitViewport({
  circuit,
  activeSignals = [],
  currentTime = 0,
  nodeValues = {},
  selectedNodeId = null,
  onSelectNode,
}: CircuitViewportProps) {
  const nodeById = new Map(circuit.nodes.map((node) => [node.id, node]));
  const bounds = getCircuitBounds(circuit);
  const padding = 80;
  const viewBoxX = bounds.minX - padding;
  const viewBoxY = bounds.minY - padding;
  const viewBoxWidth = bounds.maxX - bounds.minX + padding * 2;
  const viewBoxHeight = bounds.maxY - bounds.minY + padding * 2;
  const visibleSignals = activeSignals.filter(
    (signal) => currentTime >= signal.startTime && currentTime <= signal.endTime,
  );
  const routedWireByEdgeId = new Map(
    circuit.edges
      .map((edge) => {
        const fromNode = nodeById.get(edge.from);
        const toNode = nodeById.get(edge.to);
        if (!fromNode || !toNode) {
          return null;
        }
        const start = { x: fromNode.x + 40, y: fromNode.y };
        const end = { x: toNode.x - 40, y: toNode.y };
        return [edge.id, buildRoutedWire(start, end, edge.id)] as const;
      })
      .filter((item): item is readonly [string, ReturnType<typeof buildRoutedWire>] => item !== null),
  );

  return (
    <section className="circuit-viewport" aria-label="Circuit viewport">
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        role="img"
        aria-label={circuit.label}
      >
        <defs>
          <radialGradient id="signal-dot-gradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#ffffff" />
            <stop offset="72%" stopColor="#a5f3fc" />
            <stop offset="86%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </radialGradient>
          <filter id="signal-dot-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2.1" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1.7 0
              "
              result="boosted"
            />
            <feMerge>
              <feMergeNode in="boosted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x={viewBoxX}
          y={viewBoxY}
          width={viewBoxWidth}
          height={viewBoxHeight}
          className="circuit-background"
          rx="16"
        />

        {circuit.edges.map((edge) => {
          const routedWire = routedWireByEdgeId.get(edge.id);
          if (!routedWire) {
            return null;
          }

          const isActive = activeSignals.some(
            (signal) =>
              signal.edgeId === edge.id &&
              currentTime >= signal.startTime &&
              currentTime <= signal.endTime,
          );

          return (
            <g key={edge.id}>
              <path
                d={routedWire.pathD}
                className={isActive ? 'circuit-edge circuit-edge-active' : 'circuit-edge'}
              />
              {edge.label ? (
                <g>
                  <rect
                    x={routedWire.labelPoint.x - (edge.label.length * 6 + 8) / 2}
                    y={routedWire.labelPoint.y - 16}
                    width={edge.label.length * 6 + 8}
                    height={14}
                    rx={4}
                    className="circuit-edge-label-bg"
                  />
                  <text x={routedWire.labelPoint.x} y={routedWire.labelPoint.y - 6} className="circuit-edge-label">
                    {edge.label}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {visibleSignals.map((signal) => {
          const routedWire = routedWireByEdgeId.get(signal.edgeId);
          if (!routedWire) {
            return null;
          }
          const duration = Math.max(1, signal.endTime - signal.startTime);
          const rawProgress = (currentTime - signal.startTime) / duration;
          const progress = Math.min(1, Math.max(0, rawProgress));
          const dot = getPointAlongPolyline(routedWire.points, progress);

          return (
            <circle
              key={`${signal.edgeId}-${signal.startTime}`}
              cx={dot.x}
              cy={dot.y}
              r={5}
              className="signal-dot"
            />
          );
        })}

        {circuit.nodes.map((node) => (
          <g key={node.id}>
            <g
              transform={`translate(${node.x - 40}, ${node.y - 22})`}
              className="circuit-node-hitbox"
              onClick={() => onSelectNode?.(node.id)}
            >
              {renderMilShape(
                node,
                nodeClassName(node, (nodeValues[node.id] ?? 0) === 1, selectedNodeId === node.id),
              )}
            </g>
            <text x={node.x} y={node.y + 33} className="circuit-node-label">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

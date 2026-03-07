import type { CircuitGraph, CircuitNode, LogicValue, WireSignal } from '../../types';
import { buildRoutedWire, getCircuitBounds, getPointAlongPolyline } from '../../renderer';
import type { RoutedWire } from '../../renderer';

interface CircuitViewportProps {
  circuit: CircuitGraph;
  activeSignals?: WireSignal[];
  currentTime?: number;
  nodeValues?: Record<string, LogicValue>;
  inputValues?: Record<string, LogicValue>;
  highlightNodeIds?: string[];
  ghostNodes?: CircuitNode[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
}

function inputAnchorX(node: CircuitNode): number {
  if (node.type === 'INPUT' || node.type === 'OUTPUT') return node.x - 40;
  if (node.type === 'NOT') return node.x - 26;
  if (node.type === 'AND' || node.type === 'OR' || node.type === 'XOR') return node.x - 28;
  return node.x - 40;
}

function outputAnchorX(node: CircuitNode): number {
  if (node.type === 'INPUT' || node.type === 'OUTPUT') return node.x + 40;
  if (node.type === 'NOT') return node.x + 20;
  if (node.type === 'AND') return node.x + 14;
  if (node.type === 'OR' || node.type === 'XOR') return node.x + 26;
  return node.x + 40;
}

function nodeClassName(
  node: CircuitNode,
  isActive: boolean,
  isSelected: boolean,
  isStageHighlight: boolean,
): string {
  const classes = ['circuit-node', 'circuit-node-shape'];
  if (node.type === 'INPUT') {
    classes.push('circuit-node-input');
    classes.push(node.id === 'in-cin' ? 'circuit-node-input-cin' : 'circuit-node-input-ab');
  } else if (node.type === 'OUTPUT') {
    classes.push('circuit-node-output');
  } else {
    classes.push('circuit-node-gate');
    if (node.type === 'NOT') classes.push('circuit-node-gate-not');
    if (node.type === 'AND') classes.push('circuit-node-gate-and');
    if (node.type === 'OR') classes.push('circuit-node-gate-or');
  }
  if (isActive) classes.push('circuit-node-active');
  if (isSelected) classes.push('circuit-node-selected');
  if (isStageHighlight) classes.push('circuit-node-stage-highlight');
  return classes.join(' ');
}

function buildStraightWire(start: { x: number; y: number }, end: { x: number; y: number }): RoutedWire {
  const points = [start, end];
  const pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  const labelPoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
  return { points, pathD, labelPoint };
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
  inputValues = {},
  highlightNodeIds = [],
  ghostNodes = [],
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
        const start = { x: outputAnchorX(fromNode), y: fromNode.y };
        const end = { x: inputAnchorX(toNode), y: toNode.y };
        const isInputToNot = fromNode.type === 'INPUT' && toNode.type === 'NOT';
        const routed = isInputToNot ? buildStraightWire(start, end) : buildRoutedWire(start, end, edge.id);
        return [edge.id, routed] as const;
      })
      .filter((item): item is readonly [string, RoutedWire] => item !== null),
  );
  const inputNodes = circuit.nodes.filter((node) => circuit.inputNodeIds.includes(node.id));
  const outputNodes = circuit.nodes.filter((node) => circuit.outputNodeIds.includes(node.id));

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
            <stop offset="45%" stopColor="#e0f2fe" />
            <stop offset="80%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </radialGradient>
          <filter id="signal-dot-glow" x="-160%" y="-160%" width="420%" height="420%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 2.1 0
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
          const duration = Math.max(0.0001, signal.endTime - signal.startTime);
          const rawProgress = (currentTime - signal.startTime) / duration;
          const clamped = Math.min(1, Math.max(0, rawProgress));
          const progress = 1 - (1 - clamped) * (1 - clamped);
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

        {ghostNodes.map((node) => (
          <g key={`ghost-${node.id}`} className="circuit-ghost-node">
            <g transform={`translate(${node.x - 40}, ${node.y - 22})`}>
              {renderMilShape(node, 'circuit-node-shape circuit-node-removed-ghost')}
            </g>
            <text x={node.x} y={node.y + 33} className="circuit-node-label circuit-node-removed-label">
              {node.label}
            </text>
          </g>
        ))}

        {circuit.nodes.map((node) => (
          <g key={node.id}>
            <g
              transform={`translate(${node.x - 40}, ${node.y - 22})`}
              className="circuit-node-hitbox"
              onClick={() => onSelectNode?.(node.id)}
            >
              {renderMilShape(
                node,
                nodeClassName(
                  node,
                  (nodeValues[node.id] ?? 0) === 1,
                  selectedNodeId === node.id,
                  highlightNodeIds.includes(node.id),
                ),
              )}
            </g>
            <text x={node.x} y={node.y + 33} className="circuit-node-label">
              {node.label}
            </text>
            {node.type === 'INPUT' ? (
              <text x={node.x} y={node.y + 6} className="circuit-input-value">
                {inputValues[node.id] ?? 0}
              </text>
            ) : null}
            {node.type === 'OUTPUT' ? (
              <text x={node.x} y={node.y + 6} className="circuit-output-value">
                {nodeValues[node.id] ?? '-'}
              </text>
            ) : null}
          </g>
        ))}

        {inputNodes.map((node) => (
          <text key={`input-label-${node.id}`} x={node.x - 56} y={node.y + 4} className="circuit-io-annotation">
            {node.label}
          </text>
        ))}

        {outputNodes.map((node) => (
          <text key={`output-label-${node.id}`} x={node.x + 52} y={node.y + 4} className="circuit-output-annotation">
            {node.label} Output Register
          </text>
        ))}
      </svg>
    </section>
  );
}

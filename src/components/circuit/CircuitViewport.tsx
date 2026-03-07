import type { CircuitGraph, CircuitNode } from '../../types';

interface CircuitViewportProps {
  circuit: CircuitGraph;
}

function nodeClassName(node: CircuitNode): string {
  if (node.type === 'INPUT') return 'circuit-node circuit-node-input';
  if (node.type === 'OUTPUT') return 'circuit-node circuit-node-output';
  return 'circuit-node circuit-node-gate';
}

export function CircuitViewport({ circuit }: CircuitViewportProps) {
  const nodeById = new Map(circuit.nodes.map((node) => [node.id, node]));

  return (
    <section className="circuit-viewport" aria-label="Circuit viewport">
      <svg viewBox="0 0 780 420" role="img" aria-label={circuit.label}>
        <rect x="0" y="0" width="780" height="420" className="circuit-background" rx="16" />

        {circuit.edges.map((edge) => {
          const fromNode = nodeById.get(edge.from);
          const toNode = nodeById.get(edge.to);
          if (!fromNode || !toNode) {
            return null;
          }

          return (
            <line
              key={edge.id}
              x1={fromNode.x + 40}
              y1={fromNode.y}
              x2={toNode.x - 40}
              y2={toNode.y}
              className="circuit-edge"
            />
          );
        })}

        {circuit.nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x - 40}, ${node.y - 22})`}>
            <rect width="80" height="44" rx="8" className={nodeClassName(node)} />
            <text x="40" y="27" className="circuit-node-label">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

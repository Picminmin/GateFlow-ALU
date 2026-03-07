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

          const x1 = fromNode.x + 40;
          const y1 = fromNode.y;
          const x2 = toNode.x - 40;
          const y2 = toNode.y;

          return (
            <g key={edge.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} className="circuit-edge" />
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

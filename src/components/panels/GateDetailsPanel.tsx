import type { CircuitNode, LogicValue } from '../../types';

interface GateDetailsPanelProps {
  selectedNode: CircuitNode | null;
  outputValue: LogicValue;
}

export function GateDetailsPanel({ selectedNode, outputValue }: GateDetailsPanelProps) {
  return (
    <section className="panel" aria-label="Gate details panel">
      <h2>Gate Details</h2>
      {selectedNode ? (
        <dl className="details-grid">
          <div>
            <dt>ID</dt>
            <dd>{selectedNode.id}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{selectedNode.type}</dd>
          </div>
          <div>
            <dt>Label</dt>
            <dd>{selectedNode.label}</dd>
          </div>
          <div>
            <dt>Delay</dt>
            <dd>{selectedNode.delay}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{outputValue}</dd>
          </div>
        </dl>
      ) : (
        <p>Select a gate to inspect details.</p>
      )}
    </section>
  );
}

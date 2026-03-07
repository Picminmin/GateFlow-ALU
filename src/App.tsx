import { useState } from 'react';
import { CircuitViewport } from './components';
import { getFullAdderCircuit } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';
import { validateFullAdderCircuit } from './simulation';
import type { WireSignal } from './types';

function App() {
  const [mode, setMode] = useState<FullAdderMode>('primitive');
  const activeCircuit = getFullAdderCircuit(mode);
  const validation = validateFullAdderCircuit(activeCircuit);
  const demoSignalEdge = activeCircuit.edges[0]?.id;
  const demoSignals: WireSignal[] = demoSignalEdge
    ? [{ edgeId: demoSignalEdge, value: 1, startTime: 0, endTime: 1 }]
    : [];
  const demoNodeValues = activeCircuit.nodes.reduce<Record<string, 0 | 1>>((acc, node) => {
    acc[node.id] = 0;
    return acc;
  }, {});
  if (demoSignalEdge) {
    const activeEdge = activeCircuit.edges.find((edge) => edge.id === demoSignalEdge);
    if (activeEdge) {
      demoNodeValues[activeEdge.from] = 1;
      demoNodeValues[activeEdge.to] = 1;
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">GateFlow ALU MVP</p>
        <h1>1-bit Full Adder Circuit</h1>
        <p className="app-description">
          This static view shows the full-adder gate graph before simulation and animation are enabled.
        </p>
        <fieldset className="mode-switcher">
          <legend>Mode</legend>
          <label>
            <input
              type="radio"
              name="mode"
              value="primitive"
              checked={mode === 'primitive'}
              onChange={() => setMode('primitive')}
            />
            Primitive
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="optimized"
              checked={mode === 'optimized'}
              onChange={() => setMode('optimized')}
            />
            Optimized
          </label>
        </fieldset>
      </header>
      <section className="circuit-card">
        <p className={validation.isValid ? 'validation-ok' : 'validation-error'}>
          {validation.isValid
            ? 'Truth table check: pass (all 8 input combinations)'
            : `Truth table check: fail (${validation.mismatches.length} mismatch(es))`}
        </p>
        <CircuitViewport
          circuit={activeCircuit}
          activeSignals={demoSignals}
          currentTime={0.5}
          nodeValues={demoNodeValues}
        />
      </section>
    </main>
  );
}

export default App;

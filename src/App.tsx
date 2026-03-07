import { useEffect, useState } from 'react';
import { CircuitViewport, InputsPanel } from './components';
import { getFullAdderCircuit } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';
import { validateFullAdderCircuit } from './simulation';
import type { WireSignal } from './types';
import type { InputsPanelValues } from './components/panels/InputsPanel';

function App() {
  const [mode, setMode] = useState<FullAdderMode>('primitive');
  const [inputs, setInputs] = useState<InputsPanelValues>({ a: 0, b: 0, cin: 0 });
  const [animationTime, setAnimationTime] = useState(0);
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
      demoNodeValues[activeEdge.from] = inputs.a;
      demoNodeValues[activeEdge.to] = 1;
    }
  }

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;

    const tick = (timestamp: number) => {
      if (startTime === 0) {
        startTime = timestamp;
      }

      const elapsedSeconds = (timestamp - startTime) / 1000;
      setAnimationTime(elapsedSeconds % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

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
      <div className="main-layout">
        <InputsPanel values={inputs} onChange={setInputs} />
        <section className="circuit-card">
        <p className={validation.isValid ? 'validation-ok' : 'validation-error'}>
          {validation.isValid
            ? 'Truth table check: pass (all 8 input combinations)'
            : `Truth table check: fail (${validation.mismatches.length} mismatch(es))`}
        </p>
        <CircuitViewport
          circuit={activeCircuit}
          activeSignals={demoSignals}
          currentTime={animationTime}
          nodeValues={demoNodeValues}
        />
        </section>
      </div>
    </main>
  );
}

export default App;

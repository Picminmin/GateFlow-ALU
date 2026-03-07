import { useState } from 'react';
import { CircuitViewport } from './components';
import { getFullAdderCircuit } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';
import { validateFullAdderCircuit } from './simulation';

function App() {
  const [mode, setMode] = useState<FullAdderMode>('primitive');
  const activeCircuit = getFullAdderCircuit(mode);
  const validation = validateFullAdderCircuit(activeCircuit);

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
        <CircuitViewport circuit={activeCircuit} />
      </section>
    </main>
  );
}

export default App;

import { useState } from 'react';
import { CircuitViewport } from './components';
import { fullAdderStaticCircuit } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';

function App() {
  const [mode, setMode] = useState<FullAdderMode>('primitive');

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
        <CircuitViewport circuit={fullAdderStaticCircuit} />
      </section>
    </main>
  );
}

export default App;

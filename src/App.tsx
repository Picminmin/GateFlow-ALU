import { CircuitViewport } from './components';
import { fullAdderStaticCircuit } from './circuits/fullAdder';

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">GateFlow ALU MVP</p>
        <h1>1-bit Full Adder Circuit</h1>
        <p className="app-description">
          This static view shows the full-adder gate graph before simulation and animation are enabled.
        </p>
      </header>
      <section className="circuit-card">
        <CircuitViewport circuit={fullAdderStaticCircuit} />
      </section>
    </main>
  );
}

export default App;

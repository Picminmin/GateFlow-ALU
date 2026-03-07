import { CircuitViewport } from './components';
import { fullAdderStaticCircuit } from './circuits/fullAdder';

function App() {
  return (
    <main className="app-shell">
      <h1>GateFlow ALU</h1>
      <p>Static 1-bit full adder view</p>
      <CircuitViewport circuit={fullAdderStaticCircuit} />
    </main>
  );
}

export default App;

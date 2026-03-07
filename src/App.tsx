import { useCallback, useEffect, useRef, useState } from 'react';
import {
  globalTruthTableStatusMessage,
  steppingStatusMessage,
  structureStatusMessage,
  truthTableStatusMessage,
} from './app/status';
import { CircuitViewport, EventLogPanel, GateDetailsPanel, InputsPanel, PlaybackControls } from './components';
import { fullAdderCircuits, getFullAdderCircuit } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';
import {
  createInitialSimulationState,
  createSimulationEngine,
  type SimulationEngine,
  validateFullAdderCircuit,
  verifyDeterministicStepping,
} from './simulation';
import type { SimulationState } from './types';
import type { InputsPanelValues } from './components/panels/InputsPanel';

function App() {
  const [mode, setMode] = useState<FullAdderMode>('primitive');
  const [inputs, setInputs] = useState<InputsPanelValues>({ a: 0, b: 0, cin: 0 });
  const [animationTime, setAnimationTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState>(createInitialSimulationState());
  const engineRef = useRef<SimulationEngine>(createSimulationEngine());
  const activeCircuit = getFullAdderCircuit(mode);
  const selectedNode = activeCircuit.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const validation = validateFullAdderCircuit(activeCircuit);
  const primitiveValidation = validateFullAdderCircuit(fullAdderCircuits.primitive);
  const optimizedValidation = validateFullAdderCircuit(fullAdderCircuits.optimized);
  const allTruthTableChecksPass = primitiveValidation.isValid && optimizedValidation.isValid;
  const structuresDiffer =
    fullAdderCircuits.primitive.nodes.length !== fullAdderCircuits.optimized.nodes.length ||
    fullAdderCircuits.primitive.edges.length !== fullAdderCircuits.optimized.edges.length;
  const deterministicSteppingWorks = verifyDeterministicStepping({
    circuit: activeCircuit,
    inputs: {
      'in-a': inputs.a,
      'in-b': inputs.b,
      'in-cin': inputs.cin,
    },
    steps: 5,
  });
  const truthTableStatus = truthTableStatusMessage(validation.isValid, validation.mismatches.length);
  const globalTruthTableStatus = globalTruthTableStatusMessage(allTruthTableChecksPass);
  const structureStatus = structureStatusMessage(
    structuresDiffer,
    fullAdderCircuits.primitive.nodes.length,
    fullAdderCircuits.optimized.nodes.length,
  );
  const steppingStatus = steppingStatusMessage(deterministicSteppingWorks);

  const appendLog = (message: string) => {
    setEventLog((prev) => {
      const next = [...prev, message];
      return next.slice(-20);
    });
  };

  const initializeSimulation = useCallback(() => {
    const engine = engineRef.current;
    engine.setCircuit(activeCircuit);
    engine.setInputs({
      'in-a': inputs.a,
      'in-b': inputs.b,
      'in-cin': inputs.cin,
    });
    const snapshot = engine.snapshot();
    setSimulationState(snapshot);
  }, [activeCircuit, inputs.a, inputs.b, inputs.cin]);

  useEffect(() => {
    setSelectedNodeId(null);
    appendLog(`Mode switched to ${mode}`);
  }, [mode]);

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }
    const stepIntervalMs = Math.max(180, 900 / speed);

    const timerId = window.setInterval(() => {
      const nextState = engineRef.current.step();
      setSimulationState(nextState);
      setAnimationTime(nextState.elapsedTime);

      if (nextState.eventQueue.length === 0) {
        setIsPlaying(false);
      }
    }, stepIntervalMs);

    return () => window.clearInterval(timerId);
  }, [isPlaying, speed]);

  const handleStep = () => {
    const nextState = engineRef.current.step();
    setSimulationState(nextState);
    setAnimationTime(nextState.elapsedTime);
    appendLog('Step executed');
  };

  const handleReset = () => {
    initializeSimulation();
    setAnimationTime(0);
    setIsPlaying(false);
    appendLog('Playback reset');
  };

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
        <div className="left-stack">
          <InputsPanel
            values={inputs}
            onChange={(nextValues) => {
              setInputs(nextValues);
              appendLog(`Inputs updated: A=${nextValues.a} B=${nextValues.b} Cin=${nextValues.cin}`);
            }}
          />
          <PlaybackControls
            isPlaying={isPlaying}
            speed={speed}
            onPlay={() => {
              setIsPlaying(true);
              appendLog('Playback started');
            }}
            onPause={() => {
              setIsPlaying(false);
              appendLog('Playback paused');
            }}
            onReset={handleReset}
            onStep={handleStep}
            onSpeedChange={(nextSpeed) => {
              setSpeed(nextSpeed);
              appendLog(`Speed set to ${nextSpeed.toFixed(2)}x`);
            }}
          />
        </div>
        <section className="circuit-card">
          <p className="circuit-meta">
            Viewing: {activeCircuit.label} | Nodes: {activeCircuit.nodes.length} | Wires:{' '}
            {activeCircuit.edges.length}
          </p>
          <p className={validation.isValid ? 'validation-ok' : 'validation-error'}>{truthTableStatus}</p>
          <p className={allTruthTableChecksPass ? 'validation-ok' : 'validation-error'}>
            {globalTruthTableStatus}
          </p>
          <p className={structuresDiffer ? 'validation-ok' : 'validation-error'}>{structureStatus}</p>
          <p className={deterministicSteppingWorks ? 'validation-ok' : 'validation-error'}>
            {steppingStatus}
          </p>
          <CircuitViewport
            circuit={activeCircuit}
            activeSignals={simulationState.activeSignals}
            currentTime={animationTime}
            nodeValues={simulationState.values}
            selectedNodeId={selectedNodeId}
            onSelectNode={(nodeId) => {
              setSelectedNodeId(nodeId);
              appendLog(`Selected node: ${nodeId}`);
            }}
          />
        </section>
        <GateDetailsPanel
          selectedNode={selectedNode}
          outputValue={selectedNode ? simulationState.values[selectedNode.id] ?? 0 : 0}
        />
      </div>
      <EventLogPanel entries={eventLog} />
    </main>
  );
}

export default App;

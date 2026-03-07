import { useEffect, useState } from 'react';
import { CircuitViewport, EventLogPanel, GateDetailsPanel, InputsPanel, PlaybackControls } from './components';
import { fullAdderCircuits, getFullAdderCircuit } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';
import { validateFullAdderCircuit } from './simulation';
import type { WireSignal } from './types';
import type { InputsPanelValues } from './components/panels/InputsPanel';

function App() {
  const [mode, setMode] = useState<FullAdderMode>('primitive');
  const [inputs, setInputs] = useState<InputsPanelValues>({ a: 0, b: 0, cin: 0 });
  const [animationTime, setAnimationTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const activeCircuit = getFullAdderCircuit(mode);
  const selectedNode = activeCircuit.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const validation = validateFullAdderCircuit(activeCircuit);
  const primitiveValidation = validateFullAdderCircuit(fullAdderCircuits.primitive);
  const optimizedValidation = validateFullAdderCircuit(fullAdderCircuits.optimized);
  const allTruthTableChecksPass = primitiveValidation.isValid && optimizedValidation.isValid;
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

  const appendLog = (message: string) => {
    setEventLog((prev) => {
      const next = [...prev, message];
      return next.slice(-20);
    });
  };

  useEffect(() => {
    setSelectedNodeId(null);
    appendLog(`Mode switched to ${mode}`);
  }, [mode]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    let frameId = 0;
    let startTime = 0;

    const tick = (timestamp: number) => {
      if (startTime === 0) {
        startTime = timestamp;
      }

      const elapsedSeconds = ((timestamp - startTime) / 1000) * speed;
      setAnimationTime(elapsedSeconds % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed]);

  const handleStep = () => {
    setAnimationTime((prev) => (prev + 0.1 * speed) % 1);
    appendLog('Step executed');
  };

  const handleReset = () => {
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
        <p className={validation.isValid ? 'validation-ok' : 'validation-error'}>
          {validation.isValid
            ? 'Truth table check: pass (all 8 input combinations)'
            : `Truth table check: fail (${validation.mismatches.length} mismatch(es))`}
        </p>
        <p className={allTruthTableChecksPass ? 'validation-ok' : 'validation-error'}>
          {allTruthTableChecksPass
            ? 'Global check: Primitive and Optimized both match all 8 full-adder truth-table rows.'
            : 'Global check: At least one mode fails truth-table validation.'}
        </p>
        <CircuitViewport
          circuit={activeCircuit}
          activeSignals={demoSignals}
          currentTime={animationTime}
          nodeValues={demoNodeValues}
          selectedNodeId={selectedNodeId}
          onSelectNode={(nodeId) => {
            setSelectedNodeId(nodeId);
            appendLog(`Selected node: ${nodeId}`);
          }}
        />
        </section>
        <GateDetailsPanel
          selectedNode={selectedNode}
          outputValue={selectedNode ? demoNodeValues[selectedNode.id] ?? 0 : 0}
        />
      </div>
      <EventLogPanel entries={eventLog} />
    </main>
  );
}

export default App;

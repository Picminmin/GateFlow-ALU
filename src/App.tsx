import { useCallback, useEffect, useRef, useState } from 'react';
import {
  globalTruthTableStatusMessage,
  type Language,
  steppingStatusMessage,
  structureStatusMessage,
  truthTableStatusMessage,
} from './app/status';
import {
  CircuitViewport,
  CostInsightPanel,
  EventLogPanel,
  GateDetailsPanel,
  InputsPanel,
  OutputInsightPanel,
  PlaybackControls,
} from './components';
import { fullAdderCircuits, getFullAdderCircuit, getOptimizedTransitionCircuits } from './circuits/fullAdder';
import type { FullAdderMode } from './circuits/fullAdder';
import {
  createInitialSimulationState,
  createSimulationEngine,
  estimateCostInsight,
  type SimulationEngine,
  validateFullAdderCircuit,
  verifyDeterministicStepping,
} from './simulation';
import type { CircuitNode, LogicValue, SimulationState } from './types';
import type { InputsPanelValues } from './components/panels/InputsPanel';

function App() {
  const [lang, setLang] = useState<Language>(() =>
    typeof document !== 'undefined' && document.documentElement.lang.startsWith('ja') ? 'ja' : 'en',
  );
  const [mode, setMode] = useState<FullAdderMode>('primitive');
  const [inputs, setInputs] = useState<InputsPanelValues>({ a: 0, b: 0, cin: 0 });
  const [animationTime, setAnimationTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [bitWidth, setBitWidth] = useState(8);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [optimizedStageIndex, setOptimizedStageIndex] = useState(2);
  const [isOptimizationExpanded, setIsOptimizationExpanded] = useState(true);
  const [optimizationFlash, setOptimizationFlash] = useState<{
    mergedNodeIds: string[];
    removedNodes: CircuitNode[];
  }>({ mergedNodeIds: [], removedNodes: [] });
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState>(createInitialSimulationState());
  const engineRef = useRef<SimulationEngine>(createSimulationEngine());
  const simTimeRef = useRef(0);

  const activeCircuit = getFullAdderCircuit(mode);
  const optimizedStages = getOptimizedTransitionCircuits();
  const showOptimizedTransition = mode === 'optimized' && optimizedStageIndex < optimizedStages.length - 1;
  const displayedCircuit = mode === 'optimized' ? optimizedStages[optimizedStageIndex] : activeCircuit;
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

  const truthTableStatus = truthTableStatusMessage(validation.isValid, validation.mismatches.length, lang);
  const globalTruthTableStatus = globalTruthTableStatusMessage(allTruthTableChecksPass, lang);
  const structureStatus = structureStatusMessage(
    structuresDiffer,
    fullAdderCircuits.primitive.nodes.length,
    fullAdderCircuits.optimized.nodes.length,
    lang,
  );
  const steppingStatus = steppingStatusMessage(deterministicSteppingWorks, lang);

  const costInsight = estimateCostInsight({
    bitWidth,
    cin: inputs.cin,
    currentTime: animationTime,
  });

  const actualSum = (simulationState.values['out-sum'] ?? null) as LogicValue | null;
  const actualCout = (simulationState.values['out-cout'] ?? null) as LogicValue | null;
  const modeIsOptimized = mode === 'optimized';

  const optimizationNarrative =
    lang === 'ja'
      ? [
          'Stage 1: 標準的なSOP展開の全加算器から開始。',
          'Stage 2: Sum 側の重複項を削除。',
          'Stage 3: 最終OR前に Carry 項を統合。',
          'Stage 4: XORベースの最小グラフへ書き換え。',
        ]
      : [
          'Stage 1: Start from canonical SOP-style full-adder expansion.',
          'Stage 2: Remove duplicated Sum branch terms.',
          'Stage 3: Merge carry contributors before final OR.',
          'Stage 4: Rewrite as XOR-based minimal graph for Sum/Cout.',
        ];

  const mergedLabelSummary =
    optimizationFlash.mergedNodeIds.length > 0
      ? optimizationFlash.mergedNodeIds
          .map((id) => displayedCircuit.nodes.find((node) => node.id === id)?.label ?? id)
          .join(', ')
      : lang === 'ja'
        ? 'なし'
        : 'None';

  const removedLabelSummary =
    optimizationFlash.removedNodes.length > 0
      ? optimizationFlash.removedNodes.map((node) => node.label).join(', ')
      : lang === 'ja'
        ? 'なし'
        : 'None';

  const appendLog = (message: string) => {
    setEventLog((prev) => {
      const next = [...prev, message];
      return next.slice(-20);
    });
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const initializeSimulation = useCallback(() => {
    const engine = engineRef.current;
    engine.setCircuit(activeCircuit);
    engine.setInputs({
      'in-a': inputs.a,
      'in-b': inputs.b,
      'in-cin': inputs.cin,
    });
    const snapshot = engine.snapshot();
    simTimeRef.current = 0;
    setAnimationTime(0);
    setSimulationState(snapshot);
  }, [activeCircuit, inputs.a, inputs.b, inputs.cin]);

  useEffect(() => {
    setSelectedNodeId(null);
    appendLog(
      lang === 'ja'
        ? `モードを ${mode === 'primitive' ? 'Primitive' : 'Optimized'} に切替`
        : `Mode switched to ${mode}`,
    );
    if (mode === 'optimized') {
      setOptimizedStageIndex(0);
      setIsOptimizationExpanded(true);
    } else {
      setOptimizedStageIndex(optimizedStages.length - 1);
      setOptimizationFlash({ mergedNodeIds: [], removedNodes: [] });
    }
  }, [mode, lang, optimizedStages.length]);

  useEffect(() => {
    if (mode !== 'optimized') {
      return undefined;
    }
    if (optimizedStageIndex >= optimizedStages.length - 1) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setOptimizedStageIndex((prev) => Math.min(prev + 1, optimizedStages.length - 1));
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [mode, optimizedStageIndex, optimizedStages.length]);

  useEffect(() => {
    if (mode !== 'optimized' || optimizedStageIndex === 0) {
      setOptimizationFlash({ mergedNodeIds: [], removedNodes: [] });
      return undefined;
    }

    const previous = optimizedStages[optimizedStageIndex - 1];
    const current = optimizedStages[optimizedStageIndex];
    const previousNodeIds = new Set(previous.nodes.map((node) => node.id));
    const currentNodeIds = new Set(current.nodes.map((node) => node.id));

    const mergedNodeIds = current.nodes
      .filter((node) => !previousNodeIds.has(node.id) && node.type !== 'INPUT' && node.type !== 'OUTPUT')
      .map((node) => node.id);

    const removedNodes = previous.nodes.filter(
      (node) => !currentNodeIds.has(node.id) && node.type !== 'INPUT' && node.type !== 'OUTPUT',
    );

    setOptimizationFlash({ mergedNodeIds, removedNodes });
    appendLog(
      lang === 'ja'
        ? `最適化ステージ ${optimizedStageIndex + 1}: 統合 +${mergedNodeIds.length} / 削除 -${removedNodes.length}`
        : `Optimization stage ${optimizedStageIndex + 1}: +${mergedNodeIds.length} merged / -${removedNodes.length} removed`,
    );

    const clearTimer = window.setTimeout(() => {
      setOptimizationFlash({ mergedNodeIds: [], removedNodes: [] });
    }, 1700);

    return () => window.clearTimeout(clearTimer);
  }, [mode, optimizedStageIndex, optimizedStages, lang]);

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }
    let frameId = 0;
    let lastTimestamp: number | null = null;
    const simUnitsPerSecond = 0.65;

    const tick = (timestamp: number) => {
      if (lastTimestamp == null) {
        lastTimestamp = timestamp;
      }
      const deltaSec = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      simTimeRef.current += deltaSec * speed * simUnitsPerSecond;

      let snapshot = engineRef.current.snapshot();
      while (snapshot.eventQueue.length > 0 && snapshot.eventQueue[0].time <= simTimeRef.current) {
        snapshot = engineRef.current.step();
      }

      setSimulationState(snapshot);
      setAnimationTime(simTimeRef.current);

      if (snapshot.eventQueue.length === 0) {
        setIsPlaying(false);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed]);

  const handleStep = () => {
    const nextState = engineRef.current.step();
    setSimulationState(nextState);
    simTimeRef.current = nextState.elapsedTime;
    setAnimationTime(simTimeRef.current);
    appendLog(lang === 'ja' ? 'ステップを実行' : 'Step executed');
  };

  const handleReset = () => {
    initializeSimulation();
    setIsPlaying(false);
    appendLog(lang === 'ja' ? '再生をリセット' : 'Playback reset');
  };

  const circuitFigure = (
    <div className="circuit-visual-wrap">
      {mode === 'optimized' ? (
        <button
          type="button"
          className="optimization-replay-btn"
          onClick={() => {
            setOptimizedStageIndex(0);
            setOptimizationFlash({ mergedNodeIds: [], removedNodes: [] });
            appendLog(lang === 'ja' ? '最適化リプレイを開始' : 'Optimization replay restarted');
          }}
        >
          {lang === 'ja' ? '最適化を再生' : 'Replay Optimization'}
        </button>
      ) : null}
      <CircuitViewport
        circuit={displayedCircuit}
        activeSignals={showOptimizedTransition ? [] : simulationState.activeSignals}
        currentTime={animationTime}
        nodeValues={showOptimizedTransition ? {} : simulationState.values}
        inputValues={{
          'in-a': inputs.a,
          'in-b': inputs.b,
          'in-cin': inputs.cin,
        }}
        highlightNodeIds={optimizationFlash.mergedNodeIds}
        ghostNodes={optimizationFlash.removedNodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={(nodeId) => {
          setSelectedNodeId(nodeId);
          appendLog(lang === 'ja' ? `ノード選択: ${nodeId}` : `Selected node: ${nodeId}`);
        }}
      />
    </div>
  );

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">GateFlow ALU MVP</p>
        <h1>1-bit Full Adder Circuit</h1>
        <p className="app-description">
          {lang === 'ja'
            ? 'この画面は、シミュレーション/アニメーション実行前の1-bit全加算器ゲートグラフを表示します。'
            : 'This static view shows the full-adder gate graph before simulation and animation are enabled.'}
        </p>
        <p className="calc-context">
          {lang === 'ja'
            ? '2進数の文脈: このアニメーションは単一桁（1-bit列）の全加算器です。'
            : 'Base-2 calculation context: this animation is a single-bit column (1-digit) full adder.'}{' '}
          {lang === 'ja' ? (
            <>
              <code>A + B + Cin -&gt; Sum（この桁）</code> と <code>Cout（次桁への繰り上がり）</code> を計算します。
            </>
          ) : (
            <>
              It computes <code>A + B + Cin -&gt; Sum (this digit)</code> and <code>Cout (next digit carry)</code>.
            </>
          )}
        </p>
        <div className="lang-switcher" role="group" aria-label={lang === 'ja' ? '言語切替' : 'Language switch'}>
          <button type="button" className={lang === 'ja' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('ja')}>
            日本語
          </button>
          <button type="button" className={lang === 'en' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('en')}>
            EN
          </button>
        </div>
        <fieldset className="mode-switcher">
          <legend>{lang === 'ja' ? 'モード' : 'Mode'}</legend>
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
        <section className={modeIsOptimized ? 'mode-guide mode-guide-optimized' : 'mode-guide'}>
          <p className="mode-guide-title">
            {modeIsOptimized
              ? lang === 'ja'
                ? 'Optimized モード: ゲート数/深さを最小化'
                : 'Optimized mode: gate count/depth minimized'
              : lang === 'ja'
                ? 'Primitive モード: ステップ単位の明示的ゲート展開'
                : 'Primitive mode: explicit step-by-step gate expansion'}
          </p>
          <details className="mode-guide-details">
            <summary>{lang === 'ja' ? 'Optimized の導出方法' : 'How Optimized is derived'}</summary>
            <p>
              {lang === 'ja' ? '全加算器の Carry は ' : 'Full-adder carry is transformed from '}
              <code>AB + ACin + BCin</code> {lang === 'ja' ? 'から ' : 'to'}
              <code> AB + Cin(A xor B)</code>
              {lang === 'ja'
                ? ' へ変形されます。冗長ゲートを削減し、伝播経路を短縮します。'
                : '. This removes redundant gates and shortens propagation.'}
            </p>
            <p>
              {lang === 'ja'
                ? 'このアプリでは Optimized は Primitive とは別グラフを使い、ノード数と Carry 経路の深さを削減します。'
                : 'In this app, Optimized uses a distinct circuit graph with fewer nodes and shallower carry path than Primitive.'}
            </p>
          </details>
        </section>
      </header>

      <div className="main-layout">
        <div className="left-stack">
          <InputsPanel
            lang={lang}
            values={inputs}
            onChange={(nextValues) => {
              setInputs(nextValues);
              appendLog(
                lang === 'ja'
                  ? `入力更新: A=${nextValues.a} B=${nextValues.b} Cin=${nextValues.cin}`
                  : `Inputs updated: A=${nextValues.a} B=${nextValues.b} Cin=${nextValues.cin}`,
              );
            }}
          />
          <PlaybackControls
            lang={lang}
            isPlaying={isPlaying}
            speed={speed}
            onPlay={() => {
              setIsPlaying(true);
              appendLog(lang === 'ja' ? '再生開始' : 'Playback started');
            }}
            onPause={() => {
              setIsPlaying(false);
              appendLog(lang === 'ja' ? '再生停止' : 'Playback paused');
            }}
            onReset={handleReset}
            onStep={handleStep}
            onSpeedChange={(nextSpeed) => {
              setSpeed(nextSpeed);
              appendLog(
                lang === 'ja'
                  ? `再生速度を ${nextSpeed.toFixed(2)}x に設定`
                  : `Speed set to ${nextSpeed.toFixed(2)}x`,
              );
            }}
          />
        </div>

        <section className="circuit-card">
          <OutputInsightPanel lang={lang} inputs={inputs} actualSum={actualSum} actualCout={actualCout} />
          {mode === 'optimized' ? (
            <section className={isOptimizationExpanded ? 'optimization-progress' : 'optimization-progress compact'}>
              <div className="optimization-head">
                <p>
                  {displayedCircuit.label} ({displayedCircuit.nodes.length} {lang === 'ja' ? 'ノード' : 'nodes'})
                </p>
                <button
                  type="button"
                  className="optimization-toggle-btn"
                  onClick={() => setIsOptimizationExpanded((prev) => !prev)}
                  aria-label={
                    isOptimizationExpanded
                      ? lang === 'ja'
                        ? '最適化詳細を非表示'
                        : 'Hide optimization details'
                      : lang === 'ja'
                        ? '最適化詳細を表示'
                        : 'Show optimization details'
                  }
                >
                  {isOptimizationExpanded ? '△' : '▽'}
                </button>
              </div>
              {isOptimizationExpanded ? (
                <>
                  <ol className="optimization-steps">
                    {optimizationNarrative.map((step, index) => (
                      <li key={step} className={index === optimizedStageIndex ? 'optimization-step-active' : 'optimization-step'}>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="optimization-diff-note">
                    {lang === 'ja' ? '追加/統合（シアン）' : 'Added/merged (cyan)'}: {optimizationFlash.mergedNodeIds.length} |{' '}
                    {lang === 'ja' ? '削除（赤ゴースト）' : 'Removed (red ghost)'}: {optimizationFlash.removedNodes.length}
                  </p>
                  <p className="optimization-diff-detail">
                    {lang === 'ja' ? '統合ラベル' : 'Merged labels'}: {mergedLabelSummary}
                    <br />
                    {lang === 'ja' ? '削除ラベル' : 'Removed labels'}: {removedLabelSummary}
                  </p>
                </>
              ) : null}
            </section>
          ) : null}
          {circuitFigure}
        </section>

        <div className="right-stack">
          <section className="panel learning-status">
            <p className="circuit-meta">
              {lang === 'ja' ? '表示中' : 'Viewing'}: {activeCircuit.label} | {lang === 'ja' ? 'ノード' : 'Nodes'}:{' '}
              {activeCircuit.nodes.length} | {lang === 'ja' ? '配線' : 'Wires'}: {activeCircuit.edges.length}
            </p>
            <p className={validation.isValid ? 'validation-ok' : 'validation-error'}>{truthTableStatus}</p>
            <p className={allTruthTableChecksPass ? 'validation-ok' : 'validation-error'}>{globalTruthTableStatus}</p>
            <p className={structuresDiffer ? 'validation-ok' : 'validation-error'}>{structureStatus}</p>
            <p className={deterministicSteppingWorks ? 'validation-ok' : 'validation-error'}>{steppingStatus}</p>
          </section>
          <GateDetailsPanel
            lang={lang}
            selectedNode={selectedNode}
            outputValue={selectedNode ? simulationState.values[selectedNode.id] ?? 0 : 0}
          />
          <EventLogPanel lang={lang} entries={eventLog} />
        </div>
      </div>

      <CostInsightPanel lang={lang} insight={costInsight} bitWidth={bitWidth} onBitWidthChange={setBitWidth} />
    </main>
  );
}

export default App;

import { useMemo, useState } from 'react';
import type { CostInsightResult } from '../../simulation/costInsight';

interface CostInsightPanelProps {
  insight: CostInsightResult;
  bitWidth: number;
  onBitWidthChange: (next: number) => void;
}

export function CostInsightPanel({ insight, bitWidth, onBitWidthChange }: CostInsightPanelProps) {
  const [curveMode, setCurveMode] = useState(false);

  const chart = useMemo(() => {
    const width = 880;
    const height = 320;
    const pad = { left: 60, right: 24, top: 26, bottom: 48 };
    const nMin = 1;
    const nMax = 32;

    const addDelayAt = (n: number) => {
      const carryChainLength = insight.cin === 1 ? n : Math.max(1, Math.round(n * 0.2));
      return 2.2 + carryChainLength * 1.2;
    };
    const mulDelayAt = (n: number) => 1.6 * n * n + 3.4 * n;

    const sampleNs = Array.from({ length: nMax - nMin + 1 }, (_, i) => nMin + i);
    const addValues = sampleNs.map(addDelayAt);
    const mulValues = sampleNs.map(mulDelayAt);
    const maxY = Math.max(...mulValues) * 1.08;

    const x = (n: number) =>
      pad.left + ((n - nMin) / (nMax - nMin)) * (width - pad.left - pad.right);
    const y = (value: number) =>
      height - pad.bottom - (value / maxY) * (height - pad.top - pad.bottom);

    const addPath = sampleNs.map((n, i) => `${i === 0 ? 'M' : 'L'} ${x(n)} ${y(addValues[i])}`).join(' ');
    const mulPath = sampleNs.map((n, i) => `${i === 0 ? 'M' : 'L'} ${x(n)} ${y(mulValues[i])}`).join(' ');

    return {
      width,
      height,
      x,
      y,
      addPath,
      mulPath,
      currentAdd: addDelayAt(bitWidth),
      currentMul: mulDelayAt(bitWidth),
    };
  }, [bitWidth, insight.cin]);

  return (
    <section className="panel cost-insight" aria-label="Cost insight panel">
      <div className="cost-insight-header">
        <h2>Cin Cost Insight</h2>
        <button type="button" className="insight-toggle" onClick={() => setCurveMode((prev) => !prev)}>
          {curveMode ? 'Show Metrics View' : 'Show Curve View'}
        </button>
      </div>

      <label className="bitwidth-control">
        N (bit width): {bitWidth}
        <input
          type="range"
          min={1}
          max={32}
          step={1}
          value={bitWidth}
          onChange={(event) => onBitWidthChange(Number(event.target.value))}
        />
      </label>

      <p className="cost-summary">
        With Cin={insight.cin}, multiplication delay is about <strong>{insight.costRatio.toFixed(1)}x</strong>{' '}
        addition delay at this N.
      </p>

      {!curveMode ? (
        <>
          <div className="cost-metrics">
            <div>
              <dt>Add Delay</dt>
              <dd>{insight.addition.estimatedDelay.toFixed(1)}</dd>
            </div>
            <div>
              <dt>Mul Delay</dt>
              <dd>{insight.multiplication.estimatedDelay.toFixed(1)}</dd>
            </div>
            <div>
              <dt>Add Events</dt>
              <dd>{insight.addition.estimatedEvents}</dd>
            </div>
            <div>
              <dt>Mul Events</dt>
              <dd>{insight.multiplication.estimatedEvents}</dd>
            </div>
          </div>

          <div className="formula-box">
            <p>carryChainLength = (Cin == 1) ? N : max(1, round(0.2N))</p>
            <p>Add Delay = 2.2 + 1.2 * carryChainLength</p>
            <p>Add Events = 9N + 4 * carryChainLength</p>
            <p>Mul Delay = 1.6N^2 + 3.4N</p>
            <p>Mul Events = 22N^2 + 10N</p>
          </div>

          <p className="carry-caption">Carry arrival (bit0 -&gt; bitN-1):</p>
          <div className="carry-lane" role="img" aria-label="carry propagation lane">
            {insight.carryPath.map((item) => (
              <span
                key={item.bitIndex}
                className={item.isActive ? 'carry-cell carry-cell-active' : 'carry-cell'}
                title={`bit ${item.bitIndex}: t=${item.carryArrivalTime.toFixed(1)}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="curve-card">
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="cost growth chart">
            <rect x="0" y="0" width={chart.width} height={chart.height} className="curve-bg" rx="14" />
            <line x1="60" y1="272" x2="856" y2="272" className="curve-axis" />
            <line x1="60" y1="272" x2="60" y2="28" className="curve-axis" />
            <path d={chart.addPath} className="curve-add" />
            <path d={chart.mulPath} className="curve-mul" />
            <circle cx={chart.x(bitWidth)} cy={chart.y(chart.currentAdd)} r="5" className="curve-add-dot" />
            <circle cx={chart.x(bitWidth)} cy={chart.y(chart.currentMul)} r="5" className="curve-mul-dot" />
            <text x="64" y="24" className="curve-title">
              Cost Growth (N=1..32, Cin={insight.cin})
            </text>
            <text x="64" y="298" className="curve-label">
              N (bit width)
            </text>
            <text x="14" y="36" className="curve-label">
              Delay
            </text>
            <text x="690" y="48" className="curve-add-legend">
              Addition
            </text>
            <text x="690" y="70" className="curve-mul-legend">
              Multiplication
            </text>
          </svg>
        </div>
      )}
    </section>
  );
}

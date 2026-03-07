import { useMemo, useState } from 'react';
import type { CostInsightResult } from '../../simulation/costInsight';

interface CostInsightPanelProps {
  insight: CostInsightResult;
  bitWidth: number;
  onBitWidthChange: (next: number) => void;
  lang: 'en' | 'ja';
}

export function CostInsightPanel({ insight, bitWidth, onBitWidthChange, lang }: CostInsightPanelProps) {
  const [curveMode, setCurveMode] = useState(false);
  const carryChainLength = insight.cin === 1 ? bitWidth : Math.max(1, Math.round(bitWidth * 0.2));
  const derivedAddDelay = 2.2 + 1.2 * carryChainLength;
  const derivedAddEvents = 9 * bitWidth + 4 * carryChainLength;
  const derivedMulDelay = 1.6 * bitWidth * bitWidth + 3.4 * bitWidth;
  const derivedMulEvents = 22 * bitWidth * bitWidth + 10 * bitWidth;

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
    <section className="panel cost-insight" aria-label={lang === 'ja' ? 'コスト分析パネル' : 'Cost insight panel'}>
      <div className="cost-insight-header">
        <h2>{lang === 'ja' ? 'Cin コスト分析' : 'Cin Cost Insight'}</h2>
        <button type="button" className="insight-toggle" onClick={() => setCurveMode((prev) => !prev)}>
          {curveMode
            ? lang === 'ja'
              ? 'メトリクス表示'
              : 'Show Metrics View'
            : lang === 'ja'
              ? '曲線表示'
              : 'Show Curve View'}
        </button>
      </div>

      <label className="bitwidth-control">
        {lang === 'ja' ? 'N（ビット幅）' : 'N (bit width)'}: {bitWidth}
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
        {lang === 'ja'
          ? `Cin=${insight.cin} のとき、この N では乗算遅延は加算遅延の約 `
          : `With Cin=${insight.cin}, multiplication delay is about `}
        <strong>{insight.costRatio.toFixed(1)}x</strong>
        {lang === 'ja' ? ' です。' : ' addition delay at this N.'}
      </p>

      {!curveMode ? (
        <>
          <div className="cost-metrics">
            <div>
              <dt>{lang === 'ja' ? '加算 遅延' : 'Add Delay'}</dt>
              <dd>{insight.addition.estimatedDelay.toFixed(1)}</dd>
            </div>
            <div>
              <dt>{lang === 'ja' ? '乗算 遅延' : 'Mul Delay'}</dt>
              <dd>{insight.multiplication.estimatedDelay.toFixed(1)}</dd>
            </div>
            <div>
              <dt>{lang === 'ja' ? '加算 イベント数' : 'Add Events'}</dt>
              <dd>{insight.addition.estimatedEvents}</dd>
            </div>
            <div>
              <dt>{lang === 'ja' ? '乗算 イベント数' : 'Mul Events'}</dt>
              <dd>{insight.multiplication.estimatedEvents}</dd>
            </div>
          </div>

          <div className="formula-box">
            <p>carryChainLength = (Cin == 1) ? N : max(1, round(0.2N))</p>
            <p>
              {lang === 'ja'
                ? 'carryChainLength は、Cin からのキャリーが加算器内で何段伝播するかを表します。'
                : 'carryChainLength means how many bit-stages the carry (from Cin) propagates through in the adder.'}
            </p>
            <p>Add Delay = 2.2 + 1.2 * carryChainLength</p>
            <p>Add Events = 9N + 4 * carryChainLength</p>
            <p>Mul Delay = 1.6N^2 + 3.4N</p>
            <p>Mul Events = 22N^2 + 10N</p>
          </div>

          <p className="relation-note">
            {lang === 'ja'
              ? 'このモデルでは Delay と Events は兄弟指標です。どちらも N と carryChainLength から推定されるため、Delay だけから Events は一意に決まりません。'
              : 'Delay and Events are sibling metrics in this model. Both are estimated from N and carryChainLength, so Events cannot be uniquely derived from Delay alone.'}
          </p>
          <p className="relation-example">
            {lang === 'ja' ? '現在値' : 'Current'} N={bitWidth}, carryChainLength={carryChainLength}:{' '}
            {lang === 'ja' ? '加算遅延' : 'Add Delay'}={derivedAddDelay.toFixed(1)},{' '}
            {lang === 'ja' ? '加算イベント' : 'Add Events'}={derivedAddEvents},{' '}
            {lang === 'ja' ? '乗算遅延' : 'Mul Delay'}={derivedMulDelay.toFixed(1)},{' '}
            {lang === 'ja' ? '乗算イベント' : 'Mul Events'}={derivedMulEvents}.
          </p>

          <p className="carry-caption">
            {lang === 'ja' ? 'キャリー到達（bit0 -> bitN-1）:' : 'Carry arrival (bit0 -> bitN-1):'}
          </p>
          <div className="carry-lane" role="img" aria-label={lang === 'ja' ? 'キャリー伝播レーン' : 'carry propagation lane'}>
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
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={lang === 'ja' ? 'コスト成長チャート' : 'cost growth chart'}>
            <rect x="0" y="0" width={chart.width} height={chart.height} className="curve-bg" rx="14" />
            <line x1="60" y1="272" x2="856" y2="272" className="curve-axis" />
            <line x1="60" y1="272" x2="60" y2="28" className="curve-axis" />
            <path d={chart.addPath} className="curve-add" />
            <path d={chart.mulPath} className="curve-mul" />
            <line
              x1={chart.x(bitWidth)}
              y1={chart.y(chart.currentMul)}
              x2="60"
              y2={chart.y(chart.currentMul)}
              className="curve-guide"
            />
            <circle cx={chart.x(bitWidth)} cy={chart.y(chart.currentAdd)} r="5" className="curve-add-dot" />
            <circle cx={chart.x(bitWidth)} cy={chart.y(chart.currentMul)} r="5" className="curve-mul-dot" />
            <text x="64" y={chart.y(chart.currentMul) - 6} className="curve-mul-value">
              {chart.currentMul.toFixed(1)}
            </text>
            <text x="64" y="24" className="curve-title">
              {lang === 'ja' ? `コスト成長（N=1..32, Cin=${insight.cin}）` : `Cost Growth (N=1..32, Cin=${insight.cin})`}
            </text>
            <text x="64" y="298" className="curve-label">
              {lang === 'ja' ? 'N（ビット幅）' : 'N (bit width)'}
            </text>
            <text x="14" y="36" className="curve-label">
              {lang === 'ja' ? '遅延' : 'Delay'}
            </text>
            <text x="690" y="48" className="curve-add-legend">
              {lang === 'ja' ? '加算' : 'Addition'}
            </text>
            <text x="690" y="70" className="curve-mul-legend">
              {lang === 'ja' ? '乗算' : 'Multiplication'}
            </text>
          </svg>
        </div>
      )}
    </section>
  );
}

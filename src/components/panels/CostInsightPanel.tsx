import type { CostInsightResult } from '../../simulation/costInsight';

interface CostInsightPanelProps {
  insight: CostInsightResult;
  bitWidth: number;
  onBitWidthChange: (next: number) => void;
}

export function CostInsightPanel({ insight, bitWidth, onBitWidthChange }: CostInsightPanelProps) {
  return (
    <section className="panel cost-insight" aria-label="Cost insight panel">
      <h2>Cin Cost Insight</h2>
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
        Cin={insight.cin} ÇÃÇ∆Ç´ÅAêÑíËÇ≈èÊéZÇÕâ¡éZÇÃ <strong>{insight.costRatio.toFixed(1)}x</strong> ÇÃíxâÑÇ≈Ç∑ÅB
      </p>

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
    </section>
  );
}

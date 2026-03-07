import type { CircuitNode, LogicValue } from '../../types';

interface GateDetailsPanelProps {
  selectedNode: CircuitNode | null;
  outputValue: LogicValue;
  lang: 'en' | 'ja';
}

export function GateDetailsPanel({ selectedNode, outputValue, lang }: GateDetailsPanelProps) {
  return (
    <section className="panel" aria-label={lang === 'ja' ? 'ゲート詳細パネル' : 'Gate details panel'}>
      <h2>{lang === 'ja' ? 'ゲート詳細' : 'Gate Details'}</h2>
      {selectedNode ? (
        <dl className="details-grid">
          <div>
            <dt>ID</dt>
            <dd>{selectedNode.id}</dd>
          </div>
          <div>
            <dt>{lang === 'ja' ? '種類' : 'Type'}</dt>
            <dd>{selectedNode.type}</dd>
          </div>
          <div>
            <dt>{lang === 'ja' ? 'ラベル' : 'Label'}</dt>
            <dd>{selectedNode.label}</dd>
          </div>
          <div>
            <dt>{lang === 'ja' ? '遅延' : 'Delay'}</dt>
            <dd>{selectedNode.delay}</dd>
          </div>
          <div>
            <dt>{lang === 'ja' ? '出力' : 'Output'}</dt>
            <dd>{outputValue}</dd>
          </div>
        </dl>
      ) : (
        <p>{lang === 'ja' ? 'ゲートを選択すると詳細が表示されます。' : 'Select a gate to inspect details.'}</p>
      )}
    </section>
  );
}

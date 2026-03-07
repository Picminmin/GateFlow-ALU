import type { LogicValue } from '../../types';

export interface InputsPanelValues {
  a: LogicValue;
  b: LogicValue;
  cin: LogicValue;
}

interface InputsPanelProps {
  values: InputsPanelValues;
  onChange: (nextValues: InputsPanelValues) => void;
}

function toggleValue(value: LogicValue): LogicValue {
  return value === 1 ? 0 : 1;
}

export function InputsPanel({ values, onChange }: InputsPanelProps) {
  return (
    <section className="panel" aria-label="Inputs panel">
      <h2>Inputs</h2>
      <div className="inputs-grid">
        <button type="button" onClick={() => onChange({ ...values, a: toggleValue(values.a) })}>
          A: {values.a}
        </button>
        <button type="button" onClick={() => onChange({ ...values, b: toggleValue(values.b) })}>
          B: {values.b}
        </button>
        <button type="button" onClick={() => onChange({ ...values, cin: toggleValue(values.cin) })}>
          Cin: {values.cin}
        </button>
      </div>
    </section>
  );
}

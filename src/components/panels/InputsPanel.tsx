import { useState } from 'react';
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
  const [selectedInput, setSelectedInput] = useState<'a' | 'b' | 'cin'>('a');
  const descriptionByInput: Record<'a' | 'b' | 'cin', string> = {
    a: 'A: 第1オペランドのビット。Sum計算の主要入力です。',
    b: 'B: 第2オペランドのビット。Aと組み合わせて演算されます。',
    cin: 'Cin: 下位桁からの繰り上がり入力。SumとCoutの両方に影響します。',
  };

  return (
    <section className="panel" aria-label="Inputs panel">
      <h2>Inputs</h2>
      <div className="inputs-grid">
        <button
          type="button"
          onClick={() => {
            setSelectedInput('a');
            onChange({ ...values, a: toggleValue(values.a) });
          }}
        >
          A: {values.a}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedInput('b');
            onChange({ ...values, b: toggleValue(values.b) });
          }}
        >
          B: {values.b}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedInput('cin');
            onChange({ ...values, cin: toggleValue(values.cin) });
          }}
        >
          Cin: {values.cin}
        </button>
      </div>
      <p className="input-role-description">{descriptionByInput[selectedInput]}</p>
    </section>
  );
}

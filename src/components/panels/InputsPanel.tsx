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
  lang: 'en' | 'ja';
}

function toggleValue(value: LogicValue): LogicValue {
  return value === 1 ? 0 : 1;
}

export function InputsPanel({ values, onChange, lang }: InputsPanelProps) {
  const [selectedInput, setSelectedInput] = useState<'a' | 'b' | 'cin'>('a');
  const descriptionByInput: Record<'a' | 'b' | 'cin', string> =
    lang === 'ja'
      ? {
          a: 'A: 第1オペランドのビット。Sum 計算の主入力です。',
          b: 'B: 第2オペランドのビット。A と組み合わせて加算されます。',
          cin: 'Cin: 下位桁からの繰り上がり入力。Sum と Cout の両方に影響します。',
        }
      : {
          a: 'A: Bit of operand #1. Primary input for Sum.',
          b: 'B: Bit of operand #2. Added together with A.',
          cin: 'Cin: Carry-in from lower bit. Affects both Sum and Cout.',
        };

  return (
    <section className="panel" aria-label={lang === 'ja' ? '入力パネル' : 'Inputs panel'}>
      <h2>{lang === 'ja' ? '入力' : 'Inputs'}</h2>
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


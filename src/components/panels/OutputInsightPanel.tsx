import type { LogicValue } from '../../types';
import type { InputsPanelValues } from './InputsPanel';

interface OutputInsightPanelProps {
  inputs: InputsPanelValues;
  actualSum: LogicValue | null;
  actualCout: LogicValue | null;
  lang: 'en' | 'ja';
}

function computeExpected(inputs: InputsPanelValues): { sum: LogicValue; cout: LogicValue } {
  const xorAB = (inputs.a ^ inputs.b) as LogicValue;
  const sum = (xorAB ^ inputs.cin) as LogicValue;
  const cout = ((inputs.a & inputs.b) | (inputs.cin & xorAB)) as LogicValue;
  return { sum, cout };
}

export function OutputInsightPanel({ inputs, actualSum, actualCout, lang }: OutputInsightPanelProps) {
  const expected = computeExpected(inputs);
  const hasActual = actualSum !== null && actualCout !== null;
  const isMatch = hasActual && actualSum === expected.sum && actualCout === expected.cout;
  const total = inputs.a + inputs.b + inputs.cin;
  const binaryResult = `${expected.cout}${expected.sum}`;

  return (
    <section className="panel output-insight" aria-label="Output insight panel">
      <h2>{lang === 'ja' ? 'Sum / Cout ガイド' : 'Sum / Cout Guide'}</h2>
      <p className="output-input-row">
        {lang === 'ja' ? '現在の入力' : 'Current input'}: A={inputs.a}, B={inputs.b}, Cin={inputs.cin}
      </p>
      <p className="output-meaning">
        {lang === 'ja'
          ? 'Sum は下位ビット、Cout は次桁へ渡る繰り上がりです。'
          : 'Sum is the least significant bit. Cout is the carry-out to the next bit.'}
      </p>
      <p className="output-formula">Sum = A xor B xor Cin</p>
      <p className="output-formula">Cout = (A & B) | (Cin & (A xor B))</p>
      <p className="output-arithmetic">
        {lang === 'ja' ? '算術表示' : 'Arithmetic view'}: {inputs.a} + {inputs.b} + {inputs.cin} = {total}{' '}
        ({lang === 'ja' ? '2進数' : 'binary'} {binaryResult}) {lang === 'ja' ? 'より' : 'so'} Sum=
        {expected.sum}, Cout={expected.cout}.
      </p>

      <div className="output-values">
        <div>
          <dt>{lang === 'ja' ? '期待値 Sum' : 'Expected Sum'}</dt>
          <dd>{expected.sum}</dd>
        </div>
        <div>
          <dt>{lang === 'ja' ? '期待値 Cout' : 'Expected Cout'}</dt>
          <dd>{expected.cout}</dd>
        </div>
        <div>
          <dt>{lang === 'ja' ? '描画 Sum' : 'Rendered Sum'}</dt>
          <dd>{actualSum ?? '-'}</dd>
        </div>
        <div>
          <dt>{lang === 'ja' ? '描画 Cout' : 'Rendered Cout'}</dt>
          <dd>{actualCout ?? '-'}</dd>
        </div>
      </div>

      <p className={isMatch ? 'output-match-ok' : 'output-match-warn'}>
        {isMatch
          ? lang === 'ja'
            ? '描画出力は期待される真理値表の行と一致しています。'
            : 'Rendered output matches expected truth-table row.'
          : lang === 'ja'
            ? '描画出力がまだ安定していないか、期待値と不一致です。'
            : 'Rendered output not stable yet or mismatched.'}
      </p>
    </section>
  );
}

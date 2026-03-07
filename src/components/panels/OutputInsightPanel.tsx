import type { LogicValue } from '../../types';
import type { InputsPanelValues } from './InputsPanel';

interface OutputInsightPanelProps {
  inputs: InputsPanelValues;
  actualSum: LogicValue | null;
  actualCout: LogicValue | null;
}

function computeExpected(inputs: InputsPanelValues): { sum: LogicValue; cout: LogicValue } {
  const xorAB = (inputs.a ^ inputs.b) as LogicValue;
  const sum = (xorAB ^ inputs.cin) as LogicValue;
  const cout = ((inputs.a & inputs.b) | (inputs.cin & xorAB)) as LogicValue;
  return { sum, cout };
}

export function OutputInsightPanel({ inputs, actualSum, actualCout }: OutputInsightPanelProps) {
  const expected = computeExpected(inputs);
  const hasActual = actualSum !== null && actualCout !== null;
  const isMatch = hasActual && actualSum === expected.sum && actualCout === expected.cout;
  const total = inputs.a + inputs.b + inputs.cin;
  const binaryResult = `${expected.cout}${expected.sum}`;

  return (
    <section className="panel output-insight" aria-label="Output insight panel">
      <h2>Sum / Cout Guide</h2>
      <p className="output-input-row">
        Current input: A={inputs.a}, B={inputs.b}, Cin={inputs.cin}
      </p>
      <p className="output-meaning">Sum is the least significant bit. Cout is the carry-out to the next bit.</p>
      <p className="output-formula">Sum = A xor B xor Cin</p>
      <p className="output-formula">Cout = (A & B) | (Cin & (A xor B))</p>
      <p className="output-arithmetic">
        Arithmetic view: {inputs.a} + {inputs.b} + {inputs.cin} = {total} (binary {binaryResult}) so Sum=
        {expected.sum}, Cout={expected.cout}.
      </p>

      <div className="output-values">
        <div>
          <dt>Expected Sum</dt>
          <dd>{expected.sum}</dd>
        </div>
        <div>
          <dt>Expected Cout</dt>
          <dd>{expected.cout}</dd>
        </div>
        <div>
          <dt>Rendered Sum</dt>
          <dd>{actualSum ?? '-'}</dd>
        </div>
        <div>
          <dt>Rendered Cout</dt>
          <dd>{actualCout ?? '-'}</dd>
        </div>
      </div>

      <p className={isMatch ? 'output-match-ok' : 'output-match-warn'}>
        {isMatch ? 'Rendered output matches expected truth-table row.' : 'Rendered output not stable yet or mismatched.'}
      </p>
    </section>
  );
}

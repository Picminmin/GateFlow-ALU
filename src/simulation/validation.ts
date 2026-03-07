import type { CircuitGraph, LogicValue } from '../types';
import { evaluateNodeOutput } from './gates';

export interface FullAdderValidationMismatch {
  a: LogicValue;
  b: LogicValue;
  cin: LogicValue;
  expectedSum: LogicValue;
  expectedCout: LogicValue;
  actualSum: LogicValue;
  actualCout: LogicValue;
}

export interface FullAdderValidationResult {
  isValid: boolean;
  mismatches: FullAdderValidationMismatch[];
}

const FULL_ADDER_CASES: Array<{ a: LogicValue; b: LogicValue; cin: LogicValue; sum: LogicValue; cout: LogicValue }> = [
  { a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
  { a: 0, b: 0, cin: 1, sum: 1, cout: 0 },
  { a: 0, b: 1, cin: 0, sum: 1, cout: 0 },
  { a: 0, b: 1, cin: 1, sum: 0, cout: 1 },
  { a: 1, b: 0, cin: 0, sum: 1, cout: 0 },
  { a: 1, b: 0, cin: 1, sum: 0, cout: 1 },
  { a: 1, b: 1, cin: 0, sum: 0, cout: 1 },
  { a: 1, b: 1, cin: 1, sum: 1, cout: 1 },
];

function evaluateStableValues(
  circuit: CircuitGraph,
  inputValues: Record<string, LogicValue>,
): Record<string, LogicValue> {
  const values = circuit.nodes.reduce<Record<string, LogicValue>>((acc, node) => {
    acc[node.id] = inputValues[node.id] ?? 0;
    return acc;
  }, {});

  for (let i = 0; i < circuit.nodes.length * 4; i += 1) {
    let changed = false;

    circuit.nodes.forEach((node) => {
      if (node.type === 'INPUT') {
        return;
      }

      const nextValue = evaluateNodeOutput(circuit, node.id, values);
      if (values[node.id] !== nextValue) {
        values[node.id] = nextValue;
        changed = true;
      }
    });

    if (!changed) {
      break;
    }
  }

  return values;
}

export function validateFullAdderCircuit(circuit: CircuitGraph): FullAdderValidationResult {
  const mismatches: FullAdderValidationMismatch[] = [];

  FULL_ADDER_CASES.forEach((testCase) => {
    const values = evaluateStableValues(circuit, {
      'in-a': testCase.a,
      'in-b': testCase.b,
      'in-cin': testCase.cin,
    });

    const actualSum = values['out-sum'] ?? 0;
    const actualCout = values['out-cout'] ?? 0;

    if (actualSum !== testCase.sum || actualCout !== testCase.cout) {
      mismatches.push({
        a: testCase.a,
        b: testCase.b,
        cin: testCase.cin,
        expectedSum: testCase.sum,
        expectedCout: testCase.cout,
        actualSum,
        actualCout,
      });
    }
  });

  return {
    isValid: mismatches.length === 0,
    mismatches,
  };
}

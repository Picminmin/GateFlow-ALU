import type { CircuitGraph, LogicValue, SimulationState } from '../types';
import { createInitialSimulationState } from './state';

export interface SimulationEngine {
  setCircuit(circuit: CircuitGraph): void;
  setInputs(values: Record<string, LogicValue>): void;
  reset(): void;
  snapshot(): SimulationState;
}

export function createSimulationEngine(): SimulationEngine {
  let circuit: CircuitGraph | null = null;
  let state = createInitialSimulationState();

  return {
    setCircuit(nextCircuit) {
      circuit = nextCircuit;
      void circuit;
      state = createInitialSimulationState();
    },
    setInputs(values) {
      state = {
        ...state,
        values: {
          ...state.values,
          ...values,
        },
      };
    },
    reset() {
      state = createInitialSimulationState();
    },
    snapshot() {
      return state;
    },
  };
}

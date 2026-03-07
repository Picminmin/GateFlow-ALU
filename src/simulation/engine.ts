import type { CircuitGraph, LogicValue, SimulationState } from '../types';
import { createInitialSimulationState } from './state';

export interface SimulationEngine {
  setCircuit(circuit: CircuitGraph): void;
  setInputValue(nodeId: string, value: LogicValue): void;
  setInputs(values: Record<string, LogicValue>): void;
  reset(): void;
  snapshot(): SimulationState;
}

export function createSimulationEngine(): SimulationEngine {
  let circuit: CircuitGraph | null = null;
  let state = createInitialSimulationState();

  function assignInputValues(nextValues: Record<string, LogicValue>): void {
    if (!circuit) {
      return;
    }

    const allowedInputs = new Set(circuit.inputNodeIds);
    const mergedValues = { ...state.values };

    Object.entries(nextValues).forEach(([nodeId, value]) => {
      if (allowedInputs.has(nodeId)) {
        mergedValues[nodeId] = value;
      }
    });

    state = {
      ...state,
      values: mergedValues,
    };
  }

  return {
    setCircuit(nextCircuit) {
      circuit = nextCircuit;
      const resetState = createInitialSimulationState();
      state = {
        ...resetState,
        values: circuit.inputNodeIds.reduce<Record<string, LogicValue>>((acc, nodeId) => {
          acc[nodeId] = 0;
          return acc;
        }, {}),
      };
    },
    setInputValue(nodeId, value) {
      assignInputValues({ [nodeId]: value });
    },
    setInputs(values) {
      assignInputValues(values);
    },
    reset() {
      state = createInitialSimulationState();
      if (circuit) {
        assignInputValues(
          circuit.inputNodeIds.reduce<Record<string, LogicValue>>((acc, nodeId) => {
            acc[nodeId] = 0;
            return acc;
          }, {}),
        );
      }
    },
    snapshot() {
      return state;
    },
  };
}

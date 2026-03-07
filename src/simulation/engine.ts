import type { CircuitGraph, LogicValue, SignalChangeEvent, SimulationState, WireSignal } from '../types';
import { createDelayedSignalEvent, computePropagationTime } from './delays';
import { evaluateNodeOutput } from './gates';
import { dequeueNextEvent, enqueueEvent } from './scheduler';
import { createInitialSimulationState } from './state';

export interface SimulationEngine {
  setCircuit(circuit: CircuitGraph): void;
  setInputValue(nodeId: string, value: LogicValue): void;
  setInputs(values: Record<string, LogicValue>): void;
  reset(): void;
  step(): SimulationState;
  snapshot(): SimulationState;
}

export function createSimulationEngine(): SimulationEngine {
  let circuit: CircuitGraph | null = null;
  let state = createInitialSimulationState();
  let eventCounter = 0;

  function nextEventId(prefix: string): string {
    eventCounter += 1;
    return `${prefix}-${eventCounter}`;
  }

  function initializeValues(nextCircuit: CircuitGraph): Record<string, LogicValue> {
    const allNodeIds = nextCircuit.nodes.map((node) => node.id);
    return allNodeIds.reduce<Record<string, LogicValue>>((acc, nodeId) => {
      acc[nodeId] = 0;
      return acc;
    }, {});
  }

  function stabilizeValues(
    targetCircuit: CircuitGraph,
    seedValues: Record<string, LogicValue>,
  ): Record<string, LogicValue> {
    const values = { ...seedValues };
    const iterationLimit = Math.max(1, targetCircuit.nodes.length * 4);

    for (let i = 0; i < iterationLimit; i += 1) {
      let changed = false;

      targetCircuit.nodes.forEach((node) => {
        if (node.type === 'INPUT') {
          return;
        }
        const nextValue = evaluateNodeOutput(targetCircuit, node.id, values);
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

  function queueInputEvent(nodeId: string, value: LogicValue): void {
    if (!circuit) {
      return;
    }

    if (!circuit.inputNodeIds.includes(nodeId)) {
      return;
    }

    const currentValue = state.values[nodeId] ?? 0;
    if (currentValue === value) {
      return;
    }

    const event: SignalChangeEvent = {
      id: nextEventId('input'),
      time: state.elapsedTime,
      nodeId,
      value,
    };

    state = {
      ...state,
      eventQueue: enqueueEvent(state.eventQueue, event),
    };
  }

  function appendActiveSignal(edgeId: string, value: LogicValue, startTime: number, endTime: number): void {
    const signal: WireSignal = {
      edgeId,
      value,
      startTime,
      endTime,
    };

    state = {
      ...state,
      activeSignals: [...state.activeSignals, signal],
    };
  }

  return {
    setCircuit(nextCircuit) {
      circuit = nextCircuit;
      const seeded = initializeValues(nextCircuit);
      state = {
        ...createInitialSimulationState(),
        values: stabilizeValues(nextCircuit, seeded),
      };
      eventCounter = 0;
    },
    setInputValue(nodeId, value) {
      queueInputEvent(nodeId, value);
    },
    setInputs(values) {
      Object.entries(values).forEach(([nodeId, value]) => {
        queueInputEvent(nodeId, value);
      });
    },
    reset() {
      if (!circuit) {
        state = createInitialSimulationState();
        return;
      }

      state = {
        ...createInitialSimulationState(),
        values: stabilizeValues(circuit, initializeValues(circuit)),
      };
      eventCounter = 0;
    },
    step() {
      if (!circuit) {
        return state;
      }
      const activeCircuit = circuit;

      const { nextEvent, remainingQueue } = dequeueNextEvent(state.eventQueue);
      if (!nextEvent) {
        return state;
      }

      const updatedValues = {
        ...state.values,
        [nextEvent.nodeId]: nextEvent.value,
      };

      const scheduledKeys = new Set<string>();
      let nextQueue = remainingQueue;

      const outgoingEdges = activeCircuit.edges.filter((edge) => edge.from === nextEvent.nodeId);
      outgoingEdges.forEach((edge) => {
        const targetValue = evaluateNodeOutput(activeCircuit, edge.to, updatedValues);
        const currentTargetValue = updatedValues[edge.to] ?? 0;

        if (targetValue === currentTargetValue) {
          return;
        }

        const delayedEvent = createDelayedSignalEvent({
          id: nextEventId('prop'),
          currentTime: nextEvent.time,
          circuit: activeCircuit,
          targetNodeId: edge.to,
          value: targetValue,
          sourceNodeId: edge.from,
        });

        const signature = `${delayedEvent.nodeId}:${delayedEvent.time}:${delayedEvent.value}`;
        if (scheduledKeys.has(signature)) {
          return;
        }

        scheduledKeys.add(signature);
        nextQueue = enqueueEvent(nextQueue, delayedEvent);

        appendActiveSignal(
          edge.id,
          delayedEvent.value,
          nextEvent.time,
          computePropagationTime(nextEvent.time, activeCircuit, edge.to),
        );
      });

      state = {
        ...state,
        elapsedTime: nextEvent.time,
        values: updatedValues,
        eventQueue: nextQueue,
      };

      return state;
    },
    snapshot() {
      return state;
    },
  };
}

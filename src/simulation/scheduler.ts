import type { SignalChangeEvent } from '../types';

function compareEvents(a: SignalChangeEvent, b: SignalChangeEvent): number {
  if (a.time !== b.time) {
    return a.time - b.time;
  }

  return a.id.localeCompare(b.id);
}

export function enqueueEvent(
  queue: SignalChangeEvent[],
  event: SignalChangeEvent,
): SignalChangeEvent[] {
  const nextQueue = [...queue, event];
  nextQueue.sort(compareEvents);
  return nextQueue;
}

export function enqueueEvents(
  queue: SignalChangeEvent[],
  events: SignalChangeEvent[],
): SignalChangeEvent[] {
  const nextQueue = [...queue, ...events];
  nextQueue.sort(compareEvents);
  return nextQueue;
}

export function dequeueNextEvent(
  queue: SignalChangeEvent[],
): { nextEvent: SignalChangeEvent | null; remainingQueue: SignalChangeEvent[] } {
  if (queue.length === 0) {
    return {
      nextEvent: null,
      remainingQueue: [],
    };
  }

  return {
    nextEvent: queue[0],
    remainingQueue: queue.slice(1),
  };
}

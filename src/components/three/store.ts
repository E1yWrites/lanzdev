import { useSyncExternalStore } from "react";

// Tiny external stores shared between the DOM and the WebGL scenes. R3F renders in its
// own React root, so plain module stores are the simplest way to talk across.

export interface Store<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Which macropad key is hovered — by the pointer in 3D or by the matching link in the hero. */
export const heroKey = createStore(-1);

/** Pointer over the hero, normalised to -1…1, and how far the hero has scrolled away (0…1). */
export const heroPointer = { x: 0, y: 0, scroll: 0 };

/** A label for the cursor ring, set by things the DOM can't see (3D keys). */
export const cursorLabel = createStore<string | null>(null);

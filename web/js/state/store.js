/**
 * Lightweight pub/sub store.
 * @template T
 * @param {T} initialState
 */
export function createStore(initialState) {
  /** @type {T} */
  let state = structuredClone(initialState);
  /** @type {Set<(s: T) => void>} */
  const listeners = new Set();

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState(partial) {
      state = { ...state, ...partial };
      listeners.forEach((fn) => fn(state));
    },
    patchState(partial) {
      state = { ...state, ...partial };
      listeners.forEach((fn) => fn(state));
    },
    replaceState(next) {
      state = structuredClone(next);
      listeners.forEach((fn) => fn(state));
    },
    reset() {
      state = structuredClone(initialState);
      listeners.forEach((fn) => fn(state));
    },
  };
}

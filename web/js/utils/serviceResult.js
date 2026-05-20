/**
 * Standard async service envelope for UI (no thrown errors for expected failures).
 *
 * @template T
 * @typedef {{ ok: true, data: T }} ServiceOk
 * @typedef {{ ok: false, error: string, code?: string }} ServiceErr
 * @typedef {ServiceOk<T> | ServiceErr} ServiceResult
 */

/** @template T @param {T} data @returns {{ ok: true, data: T }} */
export function ok(data) {
  return { ok: true, data };
}

/** @returns {{ ok: false, error: string, code?: string }} */
export function err(message, code) {
  return { ok: false, error: message, code };
}

/** @param {unknown} value */
export function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

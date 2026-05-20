/**
 * @param {string} key
 * @returns {unknown | null}
 */
export function loadJson(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function saveJson(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode */
  }
}

/**
 * @param {string} key
 */
export function removeKey(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

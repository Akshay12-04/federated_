/** @param {string} s */
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {HTMLElement} el */
export function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

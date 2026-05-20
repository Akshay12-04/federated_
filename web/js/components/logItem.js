import { escapeHtml } from "../utils/dom.js";

const ICONS = {
  success: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  warn: '<path d="M12 8v4M12 12v.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
};

/**
 * @param {{ title: string, description: string, relative?: string, severity?: string }} entry
 */
export function createLogItem(entry) {
  const variant = entry.severity ?? "info";
  const item = document.createElement("article");
  item.className = "c-log-item";
  const path = ICONS[variant] ?? ICONS.info;
  item.innerHTML = `
    <div class="c-log-item__icon c-log-item__icon--${variant}" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">${path}</svg>
    </div>
    <div class="c-log-item__body">
      <div class="c-log-item__title">${escapeHtml(entry.title)}</div>
      <div class="c-log-item__desc">${escapeHtml(entry.description)}</div>
    </div>
    <time class="c-log-item__time">${escapeHtml(entry.relative ?? "")}</time>
  `;
  return item;
}

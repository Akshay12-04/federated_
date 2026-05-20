/** Inline SVG icons for navigation (20×20 viewBox) */

const paths = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="13" y="3" width="7" height="7" rx="1"/><rect x="3" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  predict:
    '<path d="M4 12h2l2-6 4 12 2-6h2"/><path d="M3 17h18" stroke-linecap="round"/>',
  train:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>',
  analytics:
    '<path d="M4 18V8M10 18V4M16 18v-6M22 18V10" stroke-linecap="round"/>',
  logs: '<path d="M6 4h12v16H6z"/><path d="M9 9h8M9 13h8M9 17h5" stroke-linecap="round"/>',
  assistant:
    '<path d="M6 8a6 6 0 0112 0c0 3.5-2 5.5-4 6.5V18l-4-2v-1.5C6.5 13.5 4 11.5 4 8z"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  shield:
    '<path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"/>',
  placeholder: '<circle cx="12" cy="12" r="8" stroke-dasharray="4 4"/>',
};

/**
 * @param {string} name
 * @param {string} [className]
 */
export function icon(name, className = "") {
  const d = paths[name] ?? paths.placeholder;
  const cls = className ? ` class="${className}"` : "";
  return `<svg${cls} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

const HEADER_ICONS = {
  line: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 18V8M10 18V4M16 18v-6M22 18V10"/></svg>`,
  area: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 12c2-4 4 4 8 0s6 4 8 0"/></svg>`,
};

/**
 * Chart card shell with canvas for Chart.js.
 * @param {{ title: string, iconVariant?: 'green' | 'primary', wide?: boolean }} opts
 * @returns {{ card: HTMLElement, canvas: HTMLCanvasElement }}
 */
export function createChartPanel({ title, iconVariant = "primary", wide = false }) {
  const card = document.createElement("div");
  card.className = `c-chart-card${wide ? " c-chart-card--wide" : ""}`;

  const accentClass =
    iconVariant === "green"
      ? "c-chart-card__header-icon--green"
      : "c-chart-card__header-icon--primary";

  const iconKey = iconVariant === "green" ? "line" : "area";

  const header = document.createElement("div");
  header.className = "c-chart-card__header";
  header.innerHTML = `
    <div class="c-chart-card__header-icon ${accentClass}">${HEADER_ICONS[iconKey]}</div>
    <h2 class="c-chart-card__title">${escapeHtml(title)}</h2>
  `;

  const wrap = document.createElement("div");
  wrap.className = "c-chart-card__canvas-wrap c-chart-card__canvas-wrap--live";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", title);
  wrap.appendChild(canvas);

  card.append(header, wrap);
  return { card, canvas };
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

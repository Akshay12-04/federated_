import { escapeHtml } from "../utils/dom.js";

/**
 * @param {{ title?: string, labels: string[], matrix: number[][] }} spec
 */
export function createConfusionMatrix(spec) {
  const card = document.createElement("article");
  card.className = "c-chart-card c-confusion";

  const max = Math.max(...spec.matrix.flat(), 1);
  const labels = spec.labels ?? ["Negative", "Positive"];

  card.innerHTML = `<div class="c-chart-card__header"><h2 class="c-chart-card__title">${escapeHtml(spec.title ?? "Confusion Matrix")}</h2></div>`;

  const grid = document.createElement("div");
  grid.className = "c-confusion__grid";
  grid.setAttribute("role", "table");
  grid.setAttribute("aria-label", "Confusion matrix");

  const corner = document.createElement("div");
  corner.className = "c-confusion__corner";
  corner.textContent = "Actual \\ Pred";
  grid.appendChild(corner);

  labels.forEach((l) => {
    const h = document.createElement("div");
    h.className = "c-confusion__head";
    h.textContent = l;
    grid.appendChild(h);
  });

  spec.matrix.forEach((row, i) => {
    const rowLabel = document.createElement("div");
    rowLabel.className = "c-confusion__row-label";
    rowLabel.textContent = labels[i] ?? `Row ${i}`;
    grid.appendChild(rowLabel);

    row.forEach((val) => {
      const cell = document.createElement("div");
      cell.className = "c-confusion__cell";
      const intensity = val / max;
      cell.style.background = `rgba(59, 130, 246, ${0.15 + intensity * 0.65})`;
      cell.textContent = String(val);
      cell.setAttribute("role", "cell");
      grid.appendChild(cell);
    });
  });

  card.appendChild(grid);
  return card;
}

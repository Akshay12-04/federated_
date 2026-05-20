import { createMetricCard } from "../components/metricCard.js";
import { METRIC_ICONS } from "../components/metricIcons.js";
import { createConfusionMatrix } from "../components/confusionMatrix.js";
import { createChartPanel } from "../components/chartPanel.js";
import { mountRocChart } from "../charts/rocChart.js";
import { mountFeatureImportanceChart } from "../charts/featureImportanceChart.js";
import { mountRadarChart } from "../charts/radarChart.js";
import { mountChartWhenReady } from "../charts/mountChart.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * @param {HTMLElement} root
 * @param {object} data
 * @param {(() => void)[]} destroyers
 */
export function mountAnalyticsPage(root, data, destroyers) {
  const kpis = document.createElement("section");
  kpis.className = "p-analytics__kpis";
  if (data.metrics?.length) {
    for (const k of data.metrics) {
      kpis.appendChild(
        createMetricCard({
          label: k.label,
          value: k.value,
          badge: k.badge,
          badgeVariant: k.badgeVariant,
          iconHtml: METRIC_ICONS[k.icon] ?? METRIC_ICONS.target,
          iconTone: k.iconTone ?? "blue",
        })
      );
    }
  } else {
    const note = document.createElement("p");
    note.className = "text-muted text-sm";
    note.textContent = "No headline metrics in this payload.";
    kpis.appendChild(note);
  }
  root.appendChild(kpis);

  const grid = document.createElement("section");
  grid.className = "p-analytics__grid";

  if (data.confusionMatrix) {
    grid.appendChild(createConfusionMatrix(data.confusionMatrix));
  }

  const roc = data.roc ?? {};
  const rocPanel = createChartPanel({ title: roc.title ?? "ROC Curve", iconVariant: "primary" });
  grid.appendChild(rocPanel.card);
  if (roc.fpr?.length && roc.tpr?.length) {
    mountChartWhenReady(rocPanel.canvas, (c) => mountRocChart(c, roc), "ROC Curve").then((d) => {
      if (typeof d === "function") destroyers.push(d);
    });
  } else {
    showChartEmpty(rocPanel.canvas, "ROC data unavailable");
  }

  const fi = data.featureImportance ?? {};
  const fiPanel = createChartPanel({
    title: fi.title ?? "Feature Importance",
    iconVariant: "primary",
  });
  fiPanel.card.classList.add("c-chart-card--wide");
  grid.appendChild(fiPanel.card);
  if (fi.labels?.length && fi.values?.length) {
    mountChartWhenReady(
      fiPanel.canvas,
      (c) =>
        mountFeatureImportanceChart(c, {
          labels: fi.labels,
          values: fi.values.map((v) => (v <= 1 ? v * 100 : v)),
        }),
      "Feature Importance"
    ).then((d) => {
      if (typeof d === "function") destroyers.push(d);
    });
  } else {
    showChartEmpty(fiPanel.canvas, "Feature importance data unavailable");
  }

  const radar = data.radar ?? {};
  const radarPanel = createChartPanel({
    title: radar.title ?? "Model Comparison",
    iconVariant: "green",
  });
  grid.appendChild(radarPanel.card);
  if (radar.labels?.length && radar.federated?.length && radar.centralized?.length) {
    mountChartWhenReady(radarPanel.canvas, (c) => mountRadarChart(c, radar), "Model Comparison").then(
      (d) => {
        if (typeof d === "function") destroyers.push(d);
      }
    );
  } else {
    showChartEmpty(radarPanel.canvas, "Radar comparison data unavailable");
  }

  root.appendChild(grid);

  if (data.comparison) {
    root.appendChild(buildComparisonTable(data.comparison));
  }
}

/** @param {HTMLCanvasElement} canvas @param {string} text */
function showChartEmpty(canvas, text) {
  const wrap = canvas.parentElement;
  if (wrap) {
    canvas.style.display = "none";
    const note = document.createElement("p");
    note.className = "text-muted text-sm";
    note.style.padding = "var(--space-4)";
    note.textContent = text;
    wrap.appendChild(note);
  }
}

function buildComparisonTable(spec) {
  const card = document.createElement("article");
  card.className = "c-card c-comparison-table c-card--wide mt-6";
  card.innerHTML = `<h2 class="c-card__title">${escapeHtml(spec.title ?? "Comparison")}</h2>`;

  const table = document.createElement("table");
  table.className = "c-data-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `<tr>${(spec.columns ?? []).map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
  const tbody = document.createElement("tbody");
  for (const row of spec.rows ?? []) {
    const tr = document.createElement("tr");
    tr.innerHTML = row
      .map((cell, i) => `<${i === 0 ? "th" : "td"}>${escapeHtml(cell)}</${i === 0 ? "th" : "td"}>`)
      .join("");
    tbody.appendChild(tr);
  }
  table.append(thead, tbody);
  card.appendChild(table);
  return card;
}

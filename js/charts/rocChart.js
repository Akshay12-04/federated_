import { loadChartJS } from "./chartLoader.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ fpr: number[], tpr: number[], auc?: number }} data
 */
export async function mountRocChart(canvas, data) {
  const Chart = await loadChartJS();
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.fpr.map((_, i) => i),
      datasets: [
        {
          label: `ROC (AUC ${data.auc ?? "—"})`,
          data: data.tpr.map((t, i) => ({ x: data.fpr[i], y: t })),
          borderColor: "#2dd4bf",
          backgroundColor: "rgba(45, 212, 191, 0.1)",
          borderWidth: 2.5,
          tension: 0.2,
          fill: true,
          pointRadius: 0,
        },
        {
          label: "Random",
          data: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
          ],
          borderColor: "rgba(148,163,184,0.4)",
          borderDash: [6, 4],
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      plugins: { legend: { labels: { color: "#94a3b8" } } },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 1,
          title: { display: true, text: "FPR", color: "#64748b" },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#64748b" },
        },
        y: {
          min: 0,
          max: 1,
          title: { display: true, text: "TPR", color: "#64748b" },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#64748b" },
        },
      },
    },
  });
  return () => chart.destroy();
}

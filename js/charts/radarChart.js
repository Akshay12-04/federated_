import { loadChartJS } from "./chartLoader.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], federated: number[], centralized: number[] }} data
 */
export async function mountRadarChart(canvas, data) {
  const Chart = await loadChartJS();
  const chart = new Chart(canvas, {
    type: "radar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Federated",
          data: data.federated,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
        },
        {
          label: "Centralized",
          data: data.centralized,
          borderColor: "#fb7185",
          backgroundColor: "rgba(251, 113, 133, 0.15)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#94a3b8" } } },
      scales: {
        r: {
          angleLines: { color: "rgba(255,255,255,0.08)" },
          grid: { color: "rgba(255,255,255,0.08)" },
          pointLabels: { color: "#94a3b8", font: { size: 11 } },
          ticks: { display: false },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });
  return () => chart.destroy();
}

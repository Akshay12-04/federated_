import { loadChartJS } from "./chartLoader.js";

const BAR_COLORS = [
  "rgba(59, 130, 246, 0.9)",
  "rgba(45, 212, 191, 0.9)",
  "rgba(34, 197, 94, 0.9)",
  "rgba(168, 85, 247, 0.9)",
  "rgba(59, 130, 246, 0.75)",
  "rgba(45, 212, 191, 0.75)",
  "rgba(34, 197, 94, 0.75)",
  "rgba(251, 113, 133, 0.85)",
];

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], values: number[] }} data
 */
export async function mountFeatureImportanceChart(canvas, data) {
  const Chart = await loadChartJS();
  const colors = data.labels.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]);
  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#121a27",
          callbacks: {
            label(ctx) {
              return ` ${ctx.label}: ${ctx.parsed.x?.toFixed?.(1) ?? ctx.parsed.x}`;
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          suggestedMax: 24,
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#64748b", font: { size: 11 }, stepSize: 6 },
        },
        y: {
          grid: { display: false },
          ticks: { color: "#94a3b8", font: { size: 11 } },
        },
      },
    },
  });
  return () => chart.destroy();
}

import { loadChartJS } from "./chartLoader.js";

const FI_COLORS = [
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
 * @param {{ yLabel?: string, color?: string, maxY?: number }} opts
 */
export async function createLiveLineChart(canvas, opts = {}) {
  const Chart = await loadChartJS();
  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: [], datasets: [{ data: [], borderColor: opts.color ?? "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", borderWidth: 2, tension: 0.35, fill: true, pointRadius: 3 }] },
    options: baseOptions(opts.yLabel ?? "Value", opts.maxY),
  });
  return {
    update(labels, values) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.update("active");
    },
    destroy: () => chart.destroy(),
  };
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export async function createLiveFeatureChart(canvas) {
  const Chart = await loadChartJS();
  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{ data: [], backgroundColor: FI_COLORS, borderRadius: 6, borderSkipped: false }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 450, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#121a27",
          callbacks: {
            label(ctx) {
              return ` ${ctx.label}: ${ctx.parsed.x}`;
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 24,
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#64748b", stepSize: 6 },
        },
        y: {
          grid: { display: false },
          ticks: { color: "#94a3b8", font: { size: 11 } },
        },
      },
    },
  });
  return {
    update(labels, values) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.data.datasets[0].backgroundColor = labels.map((_, i) => FI_COLORS[i % FI_COLORS.length]);
      chart.update("active");
    },
    destroy: () => chart.destroy(),
  };
}

function baseOptions(yLabel, maxY) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#64748b", maxTicksLimit: 8 } },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#64748b" },
        title: { display: true, text: yLabel, color: "#64748b", font: { size: 10 } },
        ...(maxY != null ? { max: maxY } : {}),
      },
    },
  };
}

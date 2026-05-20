import { loadChartJS } from "./chartLoader.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], values: number[] }} data
 * @returns {Promise<() => void>} destroy function
 */
export async function mountWeeklyPredictionsChart(canvas, data) {
  const Chart = await loadChartJS();

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Predictions",
          data: data.values,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.22)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#3b82f6",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#121a27",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          titleColor: "#f8fafc",
          bodyColor: "#94a3b8",
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b", font: { size: 11 } },
        },
        y: {
          min: 0,
          suggestedMax: 220,
          grid: { color: "rgba(255,255,255,0.06)", borderDash: [4, 4] },
          ticks: { color: "#64748b", font: { size: 11 }, maxTicksLimit: 5 },
        },
      },
    },
  });

  return () => {
    chart.destroy();
  };
}

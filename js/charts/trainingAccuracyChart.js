import { loadChartJS } from "./chartLoader.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], values: number[] }} data
 * @returns {Promise<() => void>} destroy function
 */
export async function mountTrainingAccuracyChart(canvas, data) {
  const Chart = await loadChartJS();

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Accuracy %",
          data: data.values,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: "#22c55e",
          pointBorderColor: "#0f1520",
          pointBorderWidth: 2,
          tension: 0.25,
          fill: true,
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
          grid: { color: "rgba(255,255,255,0.06)", drawBorder: false },
          ticks: { color: "#64748b", font: { size: 11 } },
        },
        y: {
          min: 70,
          max: 100,
          grid: { color: "rgba(255,255,255,0.06)", borderDash: [4, 4] },
          ticks: {
            color: "#64748b",
            font: { size: 11 },
            callback: (v) => `${v}%`,
          },
        },
      },
    },
  });

  return () => {
    chart.destroy();
  };
}

import { loadChartJS } from "./chartLoader.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], values: number[] }} data
 */
export async function mountLossCurveChart(canvas, data) {
  const Chart = await loadChartJS();
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Loss",
          data: data.values,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
      ],
    },
    options: chartOptions("Avg client loss"),
  });
  return () => chart.destroy();
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], values: number[] }} data
 */
export async function mountAccuracyCurveChart(canvas, data) {
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
          tension: 0.25,
          fill: true,
          pointRadius: 4,
        },
      ],
    },
    options: chartOptions("Global accuracy"),
  });
  return () => chart.destroy();
}

function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#121a27",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)", borderDash: [4, 4] },
        ticks: { color: "#64748b", font: { size: 11 } },
        title: { display: true, text: yLabel, color: "#64748b", font: { size: 10 } },
      },
    },
  };
}

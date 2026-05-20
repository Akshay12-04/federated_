/**
 * Load Chart.js — prefers global from index.html script, then ESM CDN fallback.
 * @returns {Promise<typeof Chart>}
 */
export async function loadChartJS() {
  if (window.__chartJsChart) {
    return window.__chartJsChart;
  }

  if (typeof window.Chart !== "undefined") {
    window.__chartJsChart = window.Chart;
    return window.Chart;
  }

  const mod = await import(
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"
  );
  const Chart = mod.default ?? mod.Chart ?? window.Chart;
  if (!Chart) {
    throw new Error("Chart.js failed to load. Check network or CDN access.");
  }
  window.__chartJsChart = Chart;
  return Chart;
}

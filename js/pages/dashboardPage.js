import { createPageHeader } from "../components/pageHeader.js";
import { createMetricCard } from "../components/metricCard.js";
import { METRIC_ICONS } from "../components/metricIcons.js";
import { createFederatedNetwork } from "../components/federatedNetwork.js";
import { createChartPanel } from "../components/chartPanel.js";
import { mountTrainingAccuracyChart } from "../charts/trainingAccuracyChart.js";
import { mountWeeklyPredictionsChart } from "../charts/weeklyPredictionsChart.js";
import { mountChartWhenReady } from "../charts/mountChart.js";
import { setLoadingState, setErrorState, setEmptyState } from "../components/dataStates.js";
import { fetchDashboard } from "../services/dashboardService.js";

/** @param {HTMLElement} root */
export function renderDashboard(root) {
  root.appendChild(
    createPageHeader({
      title: "FL Dashboard",
      subtitle: "Real-time federated learning network status and insights",
    })
  );

  const host = document.createElement("div");
  host.className = "p-dashboard__host";
  root.appendChild(host);

  const destroyers = [];
  const appRoot = document.getElementById("app-root");
  appRoot?.addEventListener(
    "app:leave",
    () => {
      destroyers.forEach((fn) => {
        try {
          fn();
        } catch {
          /* ignore */
        }
      });
      destroyers.length = 0;
    },
    { once: true }
  );

  function load() {
    setLoadingState(host, "Loading dashboard…");
    fetchDashboard().then((result) => {
      host.innerHTML = "";
      if (!result.ok) {
        setErrorState(host, result.error, load);
        return;
      }
      const data = result.data;
      const kpis = data.kpis;
      if (!Array.isArray(kpis) || kpis.length === 0) {
        setEmptyState(
          host,
          "Dashboard has no KPIs",
          "Connect the dashboard API or ensure mock data includes a non-empty `kpis` array."
        );
        return;
      }
      if (data.page?.title) {
        const header = root.querySelector(".c-page-header");
        if (header) {
          const t = header.querySelector(".c-page-header__title");
          const s = header.querySelector(".c-page-header__subtitle");
          if (t) t.textContent = data.page.title;
          if (s && data.page.subtitle) s.textContent = data.page.subtitle;
        }
      }
      mountDashboard(host, data, destroyers);
    });
  }

  load();
}

/**
 * @param {HTMLElement} root
 * @param {*} data
 * @param {(() => void)[]} destroyers
 */
function mountDashboard(root, data, destroyers) {
  const kpiSection = document.createElement("section");
  kpiSection.className = "p-dashboard__kpi-grid";
  kpiSection.setAttribute("aria-label", "Key metrics");

  for (const kpi of data.kpis ?? []) {
    kpiSection.appendChild(
      createMetricCard({
        label: kpi.label,
        value: kpi.value,
        badge: kpi.badge,
        badgeVariant: kpi.badgeVariant,
        iconHtml: METRIC_ICONS[kpi.icon] ?? METRIC_ICONS.building,
        iconTone: kpi.iconTone ?? "blue",
      })
    );
  }
  root.appendChild(kpiSection);

  const chartsWrap = document.createElement("section");
  chartsWrap.className = "p-dashboard__charts";
  chartsWrap.setAttribute("aria-label", "Visualizations");

  const topRow = document.createElement("div");
  topRow.className = "p-dashboard__charts-top";

  if (data.network) {
    topRow.appendChild(createFederatedNetwork(data.network));
  } else {
    const ph = document.createElement("p");
    ph.className = "text-muted text-sm";
    ph.textContent = "No federated network diagram in payload.";
    topRow.appendChild(ph);
  }

  const trainingSpec = data.trainingAccuracy ?? {};
  const { card: trainCard, canvas: trainCanvas } = createChartPanel({
    title: trainingSpec.title ?? "Training Accuracy",
    iconVariant: "green",
  });
  topRow.appendChild(trainCard);
  mountChartWhenReady(
    trainCanvas,
    (c) =>
      mountTrainingAccuracyChart(c, {
        labels: trainingSpec.labels ?? [],
        values: trainingSpec.values ?? [],
      }),
    "Training Accuracy"
  ).then((destroy) => {
    if (typeof destroy === "function") destroyers.push(destroy);
  });

  chartsWrap.appendChild(topRow);

  const weeklySpec = data.weeklyPredictions ?? {};
  const { card: weeklyCard, canvas: weeklyCanvas } = createChartPanel({
    title: weeklySpec.title ?? "Weekly Predictions",
    iconVariant: "primary",
    wide: true,
  });
  chartsWrap.appendChild(weeklyCard);
  mountChartWhenReady(
    weeklyCanvas,
    (c) =>
      mountWeeklyPredictionsChart(c, {
        labels: weeklySpec.labels ?? [],
        values: weeklySpec.values ?? [],
      }),
    "Weekly Predictions"
  ).then((destroy) => {
    if (typeof destroy === "function") destroyers.push(destroy);
  });

  root.appendChild(chartsWrap);
}

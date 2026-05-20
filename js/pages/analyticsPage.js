import { createPageHeader } from "../components/pageHeader.js";
import { setLoadingState, setErrorState, setEmptyState } from "../components/dataStates.js";
import { fetchAnalytics, isAnalyticsVisuallyEmpty } from "../services/analyticsService.js";
import { mountAnalyticsPage } from "../analytics/analyticsRenderer.js";

/** @param {HTMLElement} root */
export function renderAnalytics(root) {
  const destroyers = [];
  const appRoot = document.getElementById("app-root");
  appRoot?.addEventListener(
    "app:leave",
    () => destroyers.forEach((fn) => { try { fn(); } catch { /* */ } }),
    { once: true }
  );

  root.appendChild(
    createPageHeader({
      title: "Model Analytics",
      subtitle: "Comprehensive model performance metrics and visualizations",
    })
  );

  const host = document.createElement("div");
  root.appendChild(host);

  function load() {
    setLoadingState(host, "Loading analytics…");
    fetchAnalytics().then((result) => {
      host.innerHTML = "";
      if (!result.ok) {
        setErrorState(host, result.error, load);
        return;
      }
      if (isAnalyticsVisuallyEmpty(result.data)) {
        setEmptyState(
          host,
          "No analytics data",
          "Run training or connect the analytics API to populate metrics, charts, and comparison tables."
        );
        return;
      }
      const data = result.data;
      if (data.page?.title) {
        const h = root.querySelector(".c-page-header__title");
        const s = root.querySelector(".c-page-header__subtitle");
        if (h) h.textContent = data.page.title;
        if (s && data.page.subtitle) s.textContent = data.page.subtitle;
      }
      mountAnalyticsPage(host, data, destroyers);
    });
  }

  load();
}

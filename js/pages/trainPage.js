import { createPageHeader } from "../components/pageHeader.js";
import { setLoadingState, setErrorState } from "../components/dataStates.js";
import { fetchTrainPage } from "../services/trainingService.js";
import { mountTrainPage } from "../train/trainRenderer.js";

/** @param {HTMLElement} root */
export function renderTrain(root) {
  const destroyers = [];
  const appRoot = document.getElementById("app-root");
  appRoot?.addEventListener(
    "app:leave",
    () => destroyers.forEach((fn) => { try { fn(); } catch { /* */ } }),
    { once: true }
  );

  root.appendChild(
    createPageHeader({
      title: "Federated Learning Training",
      subtitle: "Configure and train the federated model across distributed hospital nodes",
    })
  );

  const host = document.createElement("div");
  host.className = "p-train__host";
  root.appendChild(host);

  function load() {
    setLoadingState(host, "Loading training workspace…");
    fetchTrainPage().then((result) => {
      host.innerHTML = "";
      if (!result.ok) {
        setErrorState(host, result.error, load);
        return;
      }
      const data = result.data;
      if (data.page?.title) {
        const h = root.querySelector(".c-page-header__title");
        const s = root.querySelector(".c-page-header__subtitle");
        if (h) h.textContent = data.page.title;
        if (s && data.page.subtitle) s.textContent = data.page.subtitle;
      }
      if (!data.presets) {
        setErrorState(
          host,
          "Training configuration is incomplete. Expected `presets` in payload.",
          load
        );
        return;
      }
      mountTrainPage(host, data, destroyers);
    });
  }

  load();
}

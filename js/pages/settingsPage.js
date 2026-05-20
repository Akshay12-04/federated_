import { createPageHeader } from "../components/pageHeader.js";
import { setLoadingState, setErrorState } from "../components/dataStates.js";
import { fetchSettingsPage } from "../services/settingsService.js";
import { mountSettingsPage } from "../settings/settingsRenderer.js";

/** @param {HTMLElement} root */
export function renderSettings(root) {
  root.appendChild(
    createPageHeader({
      title: "Settings",
      subtitle: "Customize your CardioFL experience and preferences",
    })
  );

  const host = document.createElement("div");
  root.appendChild(host);

  function load() {
    setLoadingState(host, "Loading settings…");
    fetchSettingsPage().then((result) => {
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
      mountSettingsPage(host, data);
    });
  }

  load();
}

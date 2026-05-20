import { createPageHeader } from "../components/pageHeader.js";
import { setLoadingState, setErrorState } from "../components/dataStates.js";
import { fetchAssistantPage } from "../services/assistantService.js";
import { mountAssistantPage } from "../assistant/assistantRenderer.js";

/** @param {HTMLElement} root */
export function renderAssistant(root) {
  root.appendChild(
    createPageHeader({
      title: "Healthcare Assistant",
      subtitle: "Ask questions about your health predictions and federated learning insights",
    })
  );

  const host = document.createElement("div");
  root.appendChild(host);

  function load() {
    setLoadingState(host, "Loading assistant…");
    fetchAssistantPage().then((result) => {
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
      mountAssistantPage(host, data);
    });
  }

  load();
}

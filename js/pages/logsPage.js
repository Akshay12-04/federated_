import { createPageHeader } from "../components/pageHeader.js";
import { setLoadingState, setErrorState, setEmptyState } from "../components/dataStates.js";
import { fetchActivityLogs, isLogsEmpty } from "../services/logsService.js";
import { mountLogsPage } from "../logs/logsRenderer.js";

/** @param {HTMLElement} root */
export function renderLogs(root) {
  root.appendChild(
    createPageHeader({
      title: "System Logs",
      subtitle: "Real-time activity logs and system events",
    })
  );

  const host = document.createElement("div");
  root.appendChild(host);

  function load() {
    setLoadingState(host, "Loading activity logs…");
    fetchActivityLogs().then((result) => {
      host.innerHTML = "";
      if (!result.ok) {
        setErrorState(host, result.error, load);
        return;
      }
      if (isLogsEmpty(result.data)) {
        setEmptyState(host, "No log entries", "The server returned an empty log list.");
        return;
      }
      mountLogsPage(host, result.data);
    });
  }

  load();
}

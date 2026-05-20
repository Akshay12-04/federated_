import { createFilterTabs } from "../components/filterTabs.js";
import { createLogItem } from "../components/logItem.js";

const FILTER_MAP = [
  { id: "all", label: "All" },
  { id: "predictions", label: "Predictions" },
  { id: "training", label: "Training" },
  { id: "errors", label: "Errors" },
];

/**
 * @param {HTMLElement} root
 * @param {object} data
 */
export function mountLogsPage(root, data) {
  let activeFilter = "all";
  let visibleCount = 4;

  const toolbar = document.createElement("div");
  toolbar.className = "p-logs__toolbar";

  const tabsHost = document.createElement("div");
  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "c-btn c-btn--ghost";
  exportBtn.textContent = "Export Logs";
  exportBtn.addEventListener("click", () => {
    alert("Export placeholder — wire to API in production.");
  });

  toolbar.append(tabsHost, exportBtn);
  root.appendChild(toolbar);

  const list = document.createElement("section");
  list.className = "p-logs__list";
  root.appendChild(list);

  const footer = document.createElement("div");
  footer.className = "p-logs__footer";
  const loadBtn = document.createElement("button");
  loadBtn.type = "button";
  loadBtn.className = "c-btn c-btn--ghost";
  loadBtn.textContent = "Load More Logs";
  footer.appendChild(loadBtn);
  root.appendChild(footer);

  const paint = () => {
    tabsHost.innerHTML = "";
    tabsHost.appendChild(
      createFilterTabs(FILTER_MAP, activeFilter, (id) => {
        activeFilter = id;
        visibleCount = 4;
        paint();
      })
    );

    const items = (data.items ?? []).filter(
      (item) => activeFilter === "all" || item.type === activeFilter
    );
    const slice = items.slice(0, visibleCount);

    list.innerHTML = "";
    if (!slice.length) {
      list.innerHTML = `<p class="text-muted text-sm">No logs for this filter.</p>`;
    } else {
      slice.forEach((entry) => list.appendChild(createLogItem(entry)));
    }

    loadBtn.style.display =
      visibleCount < items.length || data.hasMore ? "inline-flex" : "none";
    loadBtn.textContent =
      visibleCount < items.length ? "Load More Logs" : "Load More (mock)";
  };

  loadBtn.addEventListener("click", () => {
    visibleCount += 4;
    paint();
  });

  paint();
}

import { escapeHtml } from "../utils/dom.js";

/**
 * @param {{ label: string, samples?: number, status?: string, progress?: number }[]} nodes
 */
export function createHospitalNodeList(nodes) {
  const card = document.createElement("article");
  card.className = "c-card c-hospital-list";
  card.innerHTML = `<h2 class="c-card__title">Connected Hospital Nodes</h2>`;

  const list = document.createElement("ul");
  list.className = "c-hospital-list__items";

  for (const n of nodes) {
    const li = document.createElement("li");
    li.className = `c-hospital-list__item c-hospital-list__item--${n.status ?? "idle"}`;
    const statusLabel = statusText(n.status);
    li.innerHTML = `
      <div class="c-hospital-list__main">
        <span class="c-hospital-list__dot" aria-hidden="true"></span>
        <div>
          <div class="c-hospital-list__name">${escapeHtml(n.label)}</div>
          <div class="c-hospital-list__meta">${n.samples ?? 0} samples · ${statusLabel}</div>
        </div>
      </div>
      <div class="c-hospital-list__progress-wrap">
        <div class="c-hospital-list__progress" style="width:${n.progress ?? 0}%"></div>
      </div>
    `;
    list.appendChild(li);
  }

  card.appendChild(list);
  return card;
}

function statusText(status) {
  const map = {
    idle: "Idle",
    training: "Training…",
    connected: "Connected",
  };
  return map[status] ?? "Idle";
}

/**
 * @param {{ title?: string, centerLabel?: string, nodes?: { label: string, status?: string }[] }} network
 */
export function createFederatedNetwork(network) {
  const panel = document.createElement("div");
  panel.className = "c-federated";

  const nodes = network?.nodes ?? [];
  const centerLabel = escapeHtml(network?.centerLabel ?? "Central Server");
  const title = escapeHtml(network?.title ?? "Federated Network");

  const hospitalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3 21h18"/><path d="M6 21V8l6-4 6 4v13"/><path d="M10 21v-4h4v4"/></svg>`;
  const networkHeaderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>`;
  const lightningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/></svg>`;

  const hospital = (n) => {
    const connected = (n.status ?? "connected") === "connected";
    return `
    <div class="c-federated__hospital">
      <div class="c-federated__hospital-icon">${hospitalSvg}</div>
      <span class="c-federated__hospital-name">${escapeHtml(n.label)}</span>
      ${
        connected
          ? '<span class="c-federated__hospital-status"><span class="c-federated__status-dot"></span>Connected</span>'
          : ""
      }
    </div>
  `;
  };

  const spacer = '<div class="c-federated__hospital c-federated__hospital--spacer" aria-hidden="true"></div>';
  const n0 = nodes[0] ? hospital(nodes[0]) : spacer;
  const n1 = nodes[1] ? hospital(nodes[1]) : spacer;
  const n2 = nodes[2] ? hospital(nodes[2]) : "";

  panel.innerHTML = `
    <div class="c-federated__header">
      <div class="c-federated__header-icon">${networkHeaderSvg}</div>
      <h2 class="c-federated__title">${title}</h2>
    </div>
    <div class="c-federated__diagram">
      <svg class="c-federated__lines" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="fed-line-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(59,130,246,0)" />
            <stop offset="50%" stop-color="rgba(59,130,246,0.55)" />
            <stop offset="100%" stop-color="rgba(59,130,246,0)" />
          </linearGradient>
          <linearGradient id="fed-line-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(59,130,246,0.55)" />
            <stop offset="100%" stop-color="rgba(59,130,246,0.1)" />
          </linearGradient>
        </defs>
        <line x1="70" y1="100" x2="155" y2="100" stroke="url(#fed-line-h)" stroke-width="2" />
        <line x1="245" y1="100" x2="330" y2="100" stroke="url(#fed-line-h)" stroke-width="2" />
        <line x1="200" y1="118" x2="200" y2="168" stroke="url(#fed-line-v)" stroke-width="2" />
      </svg>
      <div class="c-federated__row">
        ${n0}
        <div class="c-federated__central" aria-label="${centerLabel}">
          <span class="c-federated__central-ring" aria-hidden="true"></span>
          ${lightningSvg}
          <span class="c-federated__central-label">${centerLabel}</span>
        </div>
        ${n1}
      </div>
      ${n2 ? `<div class="c-federated__row c-federated__row--bottom">${n2}</div>` : ""}
    </div>
  `;
  return panel;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

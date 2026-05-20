import { escapeHtml } from "../utils/dom.js";

/**
 * @param {{ id: string, label: string }[]} filters
 * @param {string} activeId
 * @param {(id: string) => void} onChange
 */
export function createFilterTabs(filters, activeId, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "c-filter-tabs";
  wrap.setAttribute("role", "tablist");

  for (const f of filters) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `c-filter-tabs__btn${f.id === activeId ? " is-active" : ""}`;
    btn.textContent = f.label;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", f.id === activeId ? "true" : "false");
    btn.addEventListener("click", () => onChange(f.id));
    wrap.appendChild(btn);
  }
  return wrap;
}

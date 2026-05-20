import { APP_NAME, APP_TAGLINE } from "../config.js";
import { icon } from "../utils/icons.js";
import { navigate } from "../router/router.js";

/** @type {{ id: string, label: string, path: string, icon: string }[]} */
export const NAV_ITEMS = [
  { id: "dashboard", label: "FL Dashboard", path: "/dashboard", icon: "dashboard" },
  { id: "predict", label: "Predict Risk", path: "/predict", icon: "predict" },
  { id: "train", label: "Train Model", path: "/train", icon: "train" },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: "analytics" },
  { id: "logs", label: "Logs", path: "/logs", icon: "logs" },
  { id: "assistant", label: "Assistant", path: "/assistant", icon: "assistant" },
  { id: "settings", label: "Settings", path: "/settings", icon: "settings" },
];

/**
 * @param {HTMLElement} container
 * @param {string} activePath
 */
export function mountSidebar(container, activePath) {
  const normalized = normalizeNavPath(activePath);

  container.className = "c-sidebar";
  container.innerHTML = `
    <a href="#/" class="c-sidebar__brand" aria-label="CardioFL home">
      <div class="c-sidebar__logo" aria-hidden="true">${icon("shield")}</div>
      <div>
        <div class="c-sidebar__title">${APP_NAME}</div>
        <div class="c-sidebar__tagline">${APP_TAGLINE}</div>
      </div>
    </a>
    <nav class="c-sidebar__nav" aria-label="Primary">
      ${NAV_ITEMS.map(
        (item) => `
        <a href="#${item.path}" class="c-sidebar__link${normalized === item.path ? " is-active" : ""}" data-path="${item.path}"${normalized === item.path ? ' aria-current="page"' : ""}>
          <span class="c-sidebar__icon">${icon(item.icon)}</span>
          <span>${item.label}</span>
        </a>
      `
      ).join("")}
    </nav>
    <div class="c-sidebar__footer">
      <div class="c-sidebar__status">
        <div class="c-sidebar__status-row">
          <span class="c-sidebar__dot" aria-hidden="true"></span>
          <span>FL Status: <strong class="text-success">Active</strong></span>
        </div>
        <div class="c-sidebar__status-row text-muted">
          <span>3 Hospitals Connected</span>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll(".c-sidebar__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const path = link.getAttribute("data-path");
      if (path) navigate(path);
      closeMobileSidebar();
    });
  });
}

/**
 * @param {string} activePath
 */
export function updateSidebarActive(activePath) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  const normalized = normalizeNavPath(activePath);
  sidebar.querySelectorAll(".c-sidebar__link").forEach((link) => {
    const path = link.getAttribute("data-path");
    const active = path === normalized;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

/** Maps nested routes to parent nav item (e.g. /predict/result → /predict). */
/** @param {string} path */
function normalizeNavPath(path) {
  if (!path || path === "/") return "/dashboard";
  const base = path.startsWith("/") ? path : `/${path}`;
  if (base.startsWith("/predict")) return "/predict";
  return base;
}

export function closeMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuBtn = document.getElementById("menu-btn");
  sidebar?.classList.remove("is-open");
  overlay?.classList.remove("is-visible");
  overlay?.setAttribute("aria-hidden", "true");
  menuBtn?.setAttribute("aria-expanded", "false");
}

export function toggleMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuBtn = document.getElementById("menu-btn");
  const isOpen = sidebar?.classList.toggle("is-open");
  overlay?.classList.toggle("is-visible", Boolean(isOpen));
  overlay?.setAttribute("aria-hidden", isOpen ? "false" : "true");
  menuBtn?.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

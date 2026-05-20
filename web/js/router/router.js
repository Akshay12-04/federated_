import { routeMap, routes } from "./routes.js";
import { updateSidebarActive } from "../components/sidebar.js";

/** @type {((path: string, title: string) => void) | null} */
let onNavigate = null;

/** @param {string} path */
export function isLandingRoute(path) {
  return path === "/" || path === "";
}

/**
 * @param {(path: string, title: string) => void} callback
 */
export function setNavigateCallback(callback) {
  onNavigate = callback;
}

/**
 * @param {string} [hash]
 */
export function getPathFromHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  const path = raw.startsWith("/") ? raw.split("?")[0] : `/${raw.split("?")[0]}`;
  return path;
}

/**
 * CSS-safe page slug from route path.
 * @param {string} path
 */
export function pathToPageSlug(path) {
  if (isLandingRoute(path)) return "landing";
  return path.slice(1).replace(/\//g, "-") || "dashboard";
}

/**
 * @param {string} path
 */
export function navigate(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (window.location.hash !== `#${normalized}`) {
    window.location.hash = normalized;
  } else {
    handleRoute();
  }
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  if (!window.location.hash) {
    window.location.replace("#/");
  } else {
    handleRoute();
  }
}

function handleRoute() {
  const path = getPathFromHash();
  const route = routeMap[path];

  if (!route) {
    if (path !== "/") {
      window.location.replace(`${window.location.pathname}${window.location.search}#/`);
    }
    return;
  }

  document.title = isLandingRoute(path) ? "CardioFL — Federated Healthcare" : `${route.title} — CardioFL`;

  document.body.classList.toggle("app--landing", isLandingRoute(path));

  const root = document.getElementById("app-root");
  if (!root) return;

  root.dispatchEvent(new CustomEvent("app:leave", { bubbles: false }));
  root.innerHTML = "";
  root.dataset.page = pathToPageSlug(path);

  const page = document.createElement("div");
  page.className = `p-page p-${pathToPageSlug(path)}`;
  root.appendChild(page);

  route.render(page);

  if (!isLandingRoute(path)) {
    updateSidebarActive(path);
  }

  onNavigate?.(path, route.title);
}

export { routes };

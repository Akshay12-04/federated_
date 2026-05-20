import { mountSidebar, toggleMobileSidebar, closeMobileSidebar } from "./components/sidebar.js";
import { initRouter, getPathFromHash, setNavigateCallback, isLandingRoute } from "./router/router.js";

function isSidebarOpen() {
  return document.getElementById("sidebar")?.classList.contains("is-open") ?? false;
}

function updateTopbar(title) {
  const el = document.getElementById("topbar-title");
  if (el) el.textContent = title;
}

function initShell() {
  const sidebarEl = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuBtn = document.getElementById("menu-btn");

  const syncShell = (path, title) => {
    document.body.classList.toggle("app--landing", isLandingRoute(path));
    if (isLandingRoute(path)) {
      closeMobileSidebar();
      return;
    }
    if (sidebarEl) {
      mountSidebar(sidebarEl, path);
    }
    updateTopbar(title);
  };

  if (sidebarEl && !isLandingRoute(getPathFromHash())) {
    mountSidebar(sidebarEl, getPathFromHash());
  }

  setNavigateCallback(syncShell);

  menuBtn?.addEventListener("click", toggleMobileSidebar);
  overlay?.addEventListener("click", closeMobileSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileSidebar();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isSidebarOpen()) {
      e.preventDefault();
      closeMobileSidebar();
    }
  });

  initRouter();
  syncShell(getPathFromHash(), document.title);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShell);
} else {
  initShell();
}

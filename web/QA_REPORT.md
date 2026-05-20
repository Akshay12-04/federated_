# CardioFL Web — QA Report (Step 8)

**Scope:** Static SPA under `web/` (hash router, Chart.js from CDN, mock or HTTP data layer).  
**Date:** 2026-05-20  
**Method:** Code review of routing, forms, CSS architecture, accessibility patterns, dead-code sweep; no design screenshots were attached in-repo for pixel diff — visual alignment is assessed against documented tokens (`UI_TOKENS.md`, `css/tokens.css`) and existing step docs.

---

## Executive summary

| Gate | Status |
|------|--------|
| **Release readiness** | **Not fully ready** for production (mock-only clinical logic, CDN + CORS dependencies, no automated E2E). |
| **Demo / internal QA** | **Ready** — core flows work when served over HTTP from `web/`; console clean under normal mock usage. |

---

## 1) Visual consistency (screenshots)

| Check | Result | Notes |
|--------|--------|--------|
| Dark theme tokens | **Pass** | `tokens.css` drives sidebar, cards, charts, typography (Inter). |
| Card / KPI / chart hierarchy | **Pass** | Dashboard + analytics use shared card + chart panel components. |
| Pixel match to screenshots | **Not verified** | No screenshot assets in workspace for automated comparison; layout follows `DASHBOARD_STEP4.md` / step docs. |

**Gap:** Pixel-level sign-off requires designer screenshots or Figma reference in-repo.

---

## 2) Navigation correctness

| Check | Result | Notes |
|--------|--------|--------|
| Default route | **Pass** | Empty hash → `#/dashboard`. |
| All nav items | **Pass** | Sidebar paths match `routes.js`. |
| Nested `#/predict/result` | **Pass** | Guard redirects if no prediction; sidebar highlights **Predict** via `normalizeNavPath`. |
| Unknown hash | **Fixed** | Previously `navigate("/dashboard")` could theoretically loop; now `location.replace(...#/dashboard)` when route missing and path ≠ `/dashboard`. |
| Topbar title | **Pass** | Updates on `setNavigateCallback`. |

---

## 3) Form validation & state persistence

| Check | Result | Notes |
|--------|--------|--------|
| Wizard validation | **Pass** | `validation.js` + per-field errors; submit error surfaced. |
| Labels / inputs | **Pass** | `for` / `id` on range, number, select; checkboxes wrapped in `<label>`. |
| Session persistence | **Pass** | `predictStore` hydrates step + wizard + prediction from `sessionStorage`. |
| Submit loading | **Improved** | `aria-busy="true"` on wizard container while assessing risk; cleared on error/success. |

**Gap:** No automated tests for validation edge cases.

---

## 4) Mobile / tablet responsiveness

| Check | Result | Notes |
|--------|--------|--------|
| ≤768px sidebar | **Pass** | Drawer + overlay; topbar visible. |
| Dashboard KPI grid | **Pass** | 1 → 2 → 3 columns at 640px / 1024px. |
| Predict result | **Pass** | Single column &lt;768px, two columns ≥768px (`predict.css`). |
| Train / analytics grids | **Pass** | `placeholder-grid` + page CSS breakpoints. |

**Gap:** No physical device matrix or Lighthouse mobile perf run in this pass.

---

## 5) Accessibility basics

| Check | Result | Notes |
|--------|--------|--------|
| Focus visible | **Pass** | Global `:focus-visible` in `base.css`; nav links enhanced for active + focus contrast. |
| `aria-current` on nav | **Fixed** | Removed invalid `aria-current="false"`; only set `"page"` when active. |
| Stepper | **Improved** | Active step `aria-current="step"`. |
| Skip link | **Added** | “Skip to main content” → `#app-root`; `main` has `tabindex="-1"` for focus target. |
| Prediction result | **Improved** | H1 `id="prediction-result-title"` + programmatic focus after render. |
| Mobile menu | **Improved** | **Escape** closes drawer; overlay `aria-hidden` toggles with visibility; menu button `aria-controls="sidebar"`. |
| Training presets (keyboard) | **Fixed** | Segment radios were `pointer-events: none` (no keyboard focus); overlay pattern + `focus-visible` on label span. |

**Gaps:** No axe-core / Lighthouse accessibility audit run; chart canvases may need text alternatives review; federated network diagram not audited for SR semantics.

---

## 6) JS console errors = zero

| Check | Result | Notes |
|--------|--------|--------|
| `console.*` in source | **Pass** | Grep: no `console.log` / `warn` / `error` in `web/js`. |
| Static imports | **Pass** | No dangling imports after dead-file removal. |
| Chart.js CDN | **Risk** | Dynamic `import()` from jsDelivr — network/adblock failures surface as rejected promises; chart modules catch and degrade where implemented. |

**Gap:** Cannot guarantee zero console noise in every browser extension / strict CSP environment without running E2E.

---

## 7) Dead code / CSS duplication

| Item | Action |
|------|--------|
| `getCurrentPath` (router) | **Removed** — unused. |
| `currentPath` variable | **Removed** |
| `chartPlaceholder.js` | **Removed** — zero references. |
| `.p-dashboard__loading` | **Removed** from `dashboard.css` — unused after data-state pattern. |
| `panels.css` vs `placeholder-grid` | **OK** — complementary (segments vs generic grid). |

**Residual risk:** Other unused assets may exist; recommend periodic `knip`-style audit when tooling is added.

---

## Fixes applied in this pass

1. **Router:** Safe fallback for unknown routes (`location.replace`); removed unused `getCurrentPath` / `currentPath`.
2. **Sidebar:** Valid `aria-current`; `aria-hidden` on overlay; `aria-controls` on menu button.
3. **Main shell:** Skip link; Escape closes mobile nav; `main#app-root` focusable for skip target.
4. **Stepper:** `aria-current="step"` on active step.
5. **Train presets CSS:** Keyboard-focusable radios + visible focus ring on preset cells.
6. **Sidebar links:** `:focus-visible` styles, including on active (gradient) state.
7. **Predict:** `aria-busy` during risk assessment; result page focuses main heading.
8. **Dead files:** Deleted `js/components/chartPlaceholder.js`; removed obsolete dashboard loading CSS.

---

## Known gaps (not closed in Step 8)

1. **Clinical / legal:** Mock risk engine — not validated for real patients; disclaimers are UI-only.
2. **Backend:** `CONFIG.mode === "http"` routes are contract-only until API exists (`DATA_LAYER.md`).
3. **Charts:** CDN dependency; offline / CSP may break charts without bundling Chart.js.
4. **Testing:** No Playwright/Cypress; no visual regression baselines.
5. **Screenshots:** No in-repo reference images for visual diff.
6. **Focus trap:** Mobile sidebar does not trap focus inside the drawer (common a11y enhancement).

---

## Sign-off

| Role | Verdict |
|------|---------|
| **Engineering QA (static review)** | **Pass with documented gaps** |
| **Production launch** | **Not ready** — complete backend, security review, a11y audit, and automated tests first |

For local verification: `cd web && python -m http.server 5500`, then manually walk routes `#/dashboard` … `#/settings`, predict wizard, and result view with DevTools console open.

# UI Enhancements (additive layer)

All changes are **additive** — existing routes, services, and page structure are preserved.

## 1. Landing page (`#/`)

- **Files:** `js/pages/landingPage.js`, `css/pages/landing.css`
- Default homepage when opening the app (no hash → `#/`).
- Sidebar/topbar hidden on landing (`body.app--landing`).
- Buttons route to existing pages: `/predict`, `/train`, `/analytics`.

## 2. Live training metrics

- **Files:** `js/domain/liveTrainingMetrics.js`, `js/charts/liveChartController.js`, `js/state/trainStore.js`, `js/services/trainingService.js`, `js/train/trainRenderer.js`
- On **Train Model**, live loss, accuracy, and feature importance charts update each epoch/round.
- Training log stream + “Training in Progress” badge.
- CMD logs: use `python dev_server.py` (see `README.md`).

## 3. Prediction result — real factors + PDF

- **Files:** `js/predict/resultRenderer.js`, `js/utils/riskFactorDisplay.js`, `js/utils/animateValue.js`, `js/utils/medicalReportPdf.js`
- Risk bars use **model `factor_contributions`** with signed %, color tiers, and animations.
- **Download Medical Report** generates a PDF via jsPDF (CDN in `index.html`).

## 4. Analytics charts

- **File:** `js/charts/featureImportanceChart.js` — multi-color bars, 0–24 scale, tooltips (matches reference styling).

## Branding

“AI” removed from user-visible labels where found; app name remains **CardioFL**.

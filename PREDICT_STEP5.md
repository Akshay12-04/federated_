# Step 5 — Predict Risk Multi-Step Wizard

## Module map

| Module | Path | Role |
|--------|------|------|
| State store factory | `js/state/store.js` | Generic pub/sub (Step 3 pending) |
| Predict store | `js/state/predictStore.js` | Wizard + prediction; `sessionStorage` persist |
| Validation | `js/domain/validation.js` | Per-step field rules |
| Feature builder | `js/domain/wizardToFeatures.js` | Wizard → 29 encoded features |
| Risk engine | `js/domain/riskEngine.js` | Mock scoring; HTTP path via `riskService` |
| Risk service | `js/services/riskService.js` | `assessRisk(wizard)` — mock engine or `POST /api/predict` |
| Wizard config | `js/predict/wizardConfig.js` | Labels + select options |
| Wizard renderer | `js/predict/wizardRenderer.js` | Step forms + review |
| Result renderer | `js/predict/resultRenderer.js` | Gauge, factors, recommendations |
| Page controller | `js/pages/predictPage.js` | Stepper, nav, submit |
| Result route | `js/pages/predictResultPage.js` | Guard + render result |

## Flow

1. Steps 1–4 on `#/predict` with Back/Next
2. Validation on each Next / Submit
3. Submit calls `riskService.assessRisk()` (mock uses `riskEngine`; HTTP uses API — see `DATA_LAYER.md`)
4. Navigate to `#/predict/result`
5. Refresh mid-wizard restores step + fields from `sessionStorage`

## Test checklist

- [ ] Open `#/predict` — stepper shows step 1 active
- [ ] Step 1: clear age → Next shows error; fix → proceeds
- [ ] Back from step 2 returns to step 1 with values retained
- [ ] Complete steps 1–3 with valid data
- [ ] Step 4 review lists all entered values
- [ ] **Get AI Prediction** navigates to `#/predict/result`
- [ ] Result shows risk %, HIGH/LOW, factor bars, recommendations
- [ ] **New Prediction** resets and returns to step 1
- [ ] **Back to Dashboard** goes to `#/dashboard`
- [ ] Direct `#/predict/result` without prediction redirects to `#/predict`
- [ ] Reload on step 3 — still on step 3 with data (sessionStorage)
- [ ] Mobile: form grid stacks; nav buttons visible

## Backend hook

Configure `CONFIG.mode` and `apiBaseUrl` in `js/config.js`, then align the `riskService` HTTP branch with your `POST /api/predict` contract — keep `RiskResult` shape from `riskEngine.js` or extend response mapping inside `riskService.js`.

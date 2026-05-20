# Data layer — adapters, contracts, and payloads

This document describes how the CardioFL web UI loads and mutates data after **Step 7**. Screens and renderers must **not** call `fetch()` on mock JSON or API paths directly; they use **services** in `web/js/services/`, which branch on `CONFIG.mode` in `web/js/config.js`.

## Configuration

| Field | Values | Role |
|--------|--------|------|
| `CONFIG.mode` | `"mock"` \| `"http"` | Switches adapter implementations |
| `CONFIG.apiBaseUrl` | e.g. `http://localhost:8000` | Base URL for HTTP mode (no trailing slash required) |

Set `mode: "http"` when a Python (or other) backend implements the routes below.

## Service result envelope

All async service methods that can fail in a normal way return a **`ServiceResult<T>`** (see `web/js/utils/serviceResult.js`):

```ts
type ServiceOk<T> = { ok: true; data: T };
type ServiceErr = { ok: false; error: string; code?: string };
type ServiceResult<T> = ServiceOk<T> | ServiceErr;
```

- **UI pattern:** `if (!result.ok) { show error + optional Retry } else { use result.data }`
- **Loading:** pages own a loading phase *before* the promise resolves (see `components/dataStates.js`).
- **Empty:** use `setEmptyState` or module-specific helpers (e.g. `isAnalyticsVisuallyEmpty`).

---

## 1. `riskService` (`riskService.js`)

**Purpose:** Run heart-disease risk assessment from wizard answers.

### `assessRisk(wizard)`

- **Input `wizard`:** `{ basic, medical, lifestyle }` — same shape as `predictStore` / wizard steps.
- **Mock mode:** Builds numeric features via `buildFeatureVector`, scores with `scoreRisk` (`domain/riskEngine.js`).
- **HTTP mode:** `POST {apiBaseUrl}/api/predict` with JSON body `{ features, wizard }`.
  - If the response body already matches `RiskResult` (`riskLevel`, `score`, …), it is returned as-is.
  - Otherwise the client falls back to `scoreRisk(features)` so partial APIs still render.

**`RiskResult` (conceptual):** matches `domain/riskEngine.js` exports (`score`, `riskLevel`, `factors`, `recommendations`, etc.).

**Codes:** `RISK_ASSESS` on failure.

**UI callers:** `pages/predictPage.js` — only this service touches prediction IO.

---

## 2. `trainingService` (`trainingService.js`)

**Purpose:** Training workspace JSON, round logs for charts, and starting a training job.

### `fetchTrainPage()`

- **Returns:** `ServiceResult<object>` — same shape as `data/mocks/train.json` (`page`, `presets`, `hospitalNodes`, `progressMessages`, …).
- **Mock:** `GET` equivalent via static file `data/mocks/train.json`.
- **HTTP:** `GET /api/training/config`

### `fetchRoundLogs()`

- **Returns:** `ServiceResult<object[]>` — array of rounds like `data/mocks/round-logs.json` (`round`, `avg_client_loss`, `accuracy`, …).
- **Mock:** `data/mocks/round-logs.json`.
- **HTTP:** `GET /api/training/round-logs` — body may be a raw array or `{ rounds: [...] }`.

### `runTraining(config, mockMeta)`

- **`config`:** merged store config (rounds, epochs, hospitals, flags, …).
- **`mockMeta`:** full train page payload in mock mode (for messages + node list).
- **Mock:** Drives `trainStore` (progress, node states, status) with timed simulation.
- **HTTP:** `POST /api/training/jobs` with `{ config }`. Does **not** simulate rounds in the browser; live progress would require polling or SSE (future work).

**Codes:** `TRAIN_CONFIG`, `ROUND_LOGS`, `TRAIN_JOB`.

**UI callers:** `pages/trainPage.js`, `train/trainRenderer.js` (charts + start button).

---

## 3. `analyticsService` (`analyticsService.js`)

### `fetchAnalytics()`

- **Returns:** `ServiceResult<object>` — same shape as `data/mocks/analytics.json` (`metrics`, `confusionMatrix`, `roc`, `featureImportance`, `radar`, `comparison`, …).
- **Mock:** `data/mocks/analytics.json`.
- **HTTP:** `GET /api/analytics`

### `isAnalyticsVisuallyEmpty(data)`

- Returns `true` if there is nothing meaningful to chart (no metrics, matrix, ROC series, feature importance, radar, or comparison rows).

**Codes:** `ANALYTICS`.

**UI callers:** `pages/analyticsPage.js`, `analytics/analyticsRenderer.js` (presentation only).

---

## 4. `logsService` (`logsService.js`)

### `fetchActivityLogs()`

- **Returns:** `ServiceResult<object>` with at least `{ items: [...], hasMore?: boolean }` per `activity-logs.json`.
- **Mock:** `data/mocks/activity-logs.json`.
- **HTTP:** `GET /api/logs/activity`

### `isLogsEmpty(data)`

- `true` when `items` is missing or empty.

**Codes:** `LOGS`.

**UI callers:** `pages/logsPage.js`, `logs/logsRenderer.js`.

---

## 5. `assistantService` (`assistantService.js`)

### `fetchAssistantPage()`

- **Returns:** `ServiceResult<object>` — `welcome`, `suggestedPrompts`, `mockReplies`, `disclaimer`, optional `page` header fields (same as `assistant.json`).
- **Mock:** `data/mocks/assistant.json`.
- **HTTP:** `GET /api/assistant`

### `sendAssistantMessage(message, context?)`

- **`message`:** user text.
- **`context`:** in mock mode, `{ mockReplies }` from bootstrap; keyword routing uses the same rules as the former standalone mock helper.
- **HTTP:** `POST /api/assistant/chat` with `{ message }` — expect `{ reply: string }` or a plain string body.

**Codes:** `ASSISTANT_BOOT`, `ASSISTANT_CHAT`, `VALIDATION`.

**UI callers:** `pages/assistantPage.js`, `assistant/assistantRenderer.js`.

---

## Supporting services (same pattern)

| Service | Methods | Mock source | HTTP route (proposed) |
|---------|---------|--------------|------------------------|
| `dashboardService` | `fetchDashboard()` | `data/mocks/dashboard.json` | `GET /api/dashboard` |
| `settingsService` | `fetchSettingsPage()` | `data/mocks/settings.json` | `GET /api/settings` |

**UI callers:** `pages/dashboardPage.js`, `pages/settingsPage.js`.

---

## HTTP client

`web/js/services/apiClient.js` — `apiGet(path)`, `apiPost(path, body)` resolve relative to `CONFIG.apiBaseUrl`. Non-2xx responses throw with response text; services catch and return `ServiceResult` errors.

---

## File map

| Concern | Path |
|---------|------|
| Mode switch | `js/config.js` |
| Result helpers | `js/utils/serviceResult.js` |
| Loading / error / empty UI | `js/components/dataStates.js`, `css/components/data-states.css` |
| Low-level mock file read | `js/utils/fetchMock.js` (used **only** inside services) |

---

## Checklist for backend implementers

1. Match JSON shapes of existing mocks under `web/data/mocks/` or document deltas.
2. Enable CORS for `apiBaseUrl` when testing from `file:` or another origin.
3. Implement routes incrementally; missing routes surface as `ServiceResult` errors with Retry on pages that support it.
4. For training jobs, plan **progress** delivery (`GET /api/training/jobs/:id` or WebSocket) before relying on HTTP `runTraining` alone.

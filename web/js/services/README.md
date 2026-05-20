# Services (data adapters)

UI pages and renderers import **only** these modules — not `fetchMock` or raw `fetch` for domain data.

| Module | Role |
|--------|------|
| `riskService.js` | `assessRisk(wizard)` → `ServiceResult<RiskResult>` |
| `trainingService.js` | `fetchTrainPage`, `fetchRoundLogs`, `runTraining` |
| `analyticsService.js` | `fetchAnalytics`, `isAnalyticsVisuallyEmpty` |
| `logsService.js` | `fetchActivityLogs`, `isLogsEmpty` |
| `assistantService.js` | `fetchAssistantPage`, `sendAssistantMessage` |
| `dashboardService.js` | `fetchDashboard` |
| `settingsService.js` | `fetchSettingsPage` |
| `apiClient.js` | `apiGet` / `apiPost` vs `CONFIG.apiBaseUrl` |

**Mode switch:** `js/config.js` — `mode: "mock"` | `"http"`.

Full contracts: **`DATA_LAYER.md`** (project `web/` folder).

# Step 6 — Remaining Modules

## Mock data (`web/data/mocks/`)

| File | Used by |
|------|---------|
| `train.json` | Train presets, nodes, progress messages |
| `analytics.json` | KPIs, confusion matrix, ROC, features, radar, table |
| `activity-logs.json` | Logs feed + filters |
| `assistant.json` | Welcome, prompts, mock replies |
| `settings.json` | Sections, data actions, privacy |
| `round-logs.json` | Train loss/accuracy charts |

## Module map

| Area | Renderer | State / Service |
|------|----------|-----------------|
| A Train | `js/train/trainRenderer.js` | `trainStore`, `trainingService` |
| B Analytics | `js/analytics/analyticsRenderer.js` | mock JSON + Chart.js |
| C Logs | `js/logs/logsRenderer.js` | mock JSON |
| D Assistant | `js/assistant/assistantRenderer.js` | `assistantStore`, `assistantService` |
| E Settings | `js/settings/settingsRenderer.js` | `settingsStore` (localStorage) |

## Shared components

`filterTabs`, `logItem`, `confusionMatrix`, `hospitalNodeList`, `chartPanel`, `metricCard`

## CSS

Single shared `css/components/panels.css` — train/analytics/settings panels (no duplicated blocks)

## Test checklist

### A — Train
- [ ] Presets update sliders (Demo/Balanced/Full)
- [ ] Start Training runs progress bar + round counter
- [ ] Hospital nodes show Training → Connected
- [ ] Loss & accuracy charts render from `round-logs.json`

### B — Analytics
- [ ] 4 metric KPIs
- [ ] Confusion matrix heat grid
- [ ] ROC + feature importance + radar charts
- [ ] Comparison table

### C — Logs
- [ ] Filter tabs filter list
- [ ] Load more reveals more entries
- [ ] Export shows placeholder alert

### D — Assistant
- [ ] Suggested prompts send messages
- [ ] Mock AI reply after typing indicator
- [ ] Chat persists in session (reload page)

### E — Settings
- [ ] Toggles persist (localStorage)
- [ ] Dark mode toggles `data-theme`
- [ ] AI sensitivity slider saves
- [ ] Export / Privacy report placeholders

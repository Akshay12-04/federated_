# CardioFL Web Frontend

**Step 3:** App shell, dark theme, hash router, placeholder pages.  
**Step 4:** Dashboard — `DASHBOARD_STEP4.md`  
**Step 5:** Predict Risk wizard — `PREDICT_STEP5.md`  
**Step 6:** Train, Analytics, Logs, Assistant, Settings — `STEP6.md`  
**Step 7:** Service adapters — `DATA_LAYER.md`  
**Step 8:** Quality gate — `QA_REPORT.md`  
**Enhancements:** Landing, live training charts, PDF report — `ENHANCEMENTS.md`

## Run locally

```bash
cd web
python dev_server.py
```

Use `dev_server.py` (not `python -m http.server`) so **federated training logs print in this terminal** while you train from the UI.

Fallback (no CMD training logs):

```bash
python -m http.server 5500
```

Open: **http://localhost:5500/** (landing) or **http://localhost:5500/#/dashboard**

Routes: `#/predict`, `#/train`, `#/analytics`, `#/logs`, `#/assistant`, `#/settings`, `#/predict/result`

## Architecture

See `../ARCHITECTURE_PLAN.md`, `../UI_TOKENS.md`, **`DATA_LAYER.md`**, and **`QA_REPORT.md`**.

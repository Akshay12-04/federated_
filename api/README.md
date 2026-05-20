# CardioFL API (Phase B+)

Python HTTP layer over existing ML pipeline. Full contracts: `../ARCHITECTURE_PLAN.md` §7.

## Planned layout

```
api/
  main.py
  config.py
  routers/     # health, predict, train, metrics, logs, assistant
  services/    # inference, training, encoding
```

## Endpoints

| Method | Path |
|--------|------|
| GET | `/api/health` |
| POST | `/api/predict` |
| POST | `/api/train` |
| GET | `/api/train/status` |
| GET | `/api/metrics/round-logs` |
| GET | `/api/metrics/summary` |
| GET | `/api/metrics/dashboard` |
| GET | `/api/logs` |
| POST | `/api/assistant/chat` |

Step 2: folder scaffold only — implementation in Phase B.

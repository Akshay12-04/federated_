/** Canonical feature labels for live importance chart */
export const LIVE_FEATURE_LABELS = [
  "Cholesterol",
  "Blood Pressure",
  "Age",
  "ECG",
  "BMI",
  "Smoking",
  "Exercise",
  "Family History",
];

/** Target importance profile (0–24 scale) at end of training */
const TARGET_IMPORTANCE = [22, 18, 15, 12, 10, 9, 7, 5];

/**
 * @param {number} progress 0..1
 * @returns {{ labels: string[], values: number[] }}
 */
export function simulateFeatureImportance(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const values = TARGET_IMPORTANCE.map((target, i) => {
    const start = target * (0.15 + (i % 3) * 0.02);
    const v = start + (target - start) * p + (Math.random() - 0.5) * 0.8;
    return Math.max(1, Math.round(v * 10) / 10);
  });
  return { labels: [...LIVE_FEATURE_LABELS], values };
}

/**
 * @param {number} progress 0..1
 * @returns {{ loss: number, accuracy: number }}
 */
export function simulateScalars(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const loss = Math.max(0.08, 1.2 - p * 1.05 + (Math.random() - 0.5) * 0.04);
  const accuracy = Math.min(99.2, 72 + p * 22 + (Math.random() - 0.5) * 0.6);
  return { loss: Math.round(loss * 1000) / 1000, accuracy: Math.round(accuracy * 10) / 10 };
}

export function createInitialLiveState() {
  return {
    epoch: 0,
    totalEpochs: 0,
    round: 0,
    totalRounds: 0,
    lossHistory: [],
    accuracyHistory: [],
    featureImportance: {
      labels: [...LIVE_FEATURE_LABELS],
      values: LIVE_FEATURE_LABELS.map(() => 2),
    },
    logLines: [],
    chartLabels: [],
  };
}

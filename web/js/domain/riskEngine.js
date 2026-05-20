/**
 * Mock risk scoring — consumed by `riskService` in mock mode; HTTP mode may still use as fallback.
 * @typedef {Object} RiskResult
 * @property {number} probability
 * @property {number} risk_pct
 * @property {'HIGH'|'LOW'} label
 * @property {number} threshold
 * @property {string} message
 * @property {number|null} confidence
 * @property {{ name: string, impact_pct: number, direction: 'increase'|'decrease' }[]} factor_contributions
 * @property {{ immediate: string[], lifestyle: string[] }} recommendations
 * @property {'mock'|'api'} source
 */

const THRESHOLD = 0.5;

/**
 * Deterministic mock score from encoded features (not clinical-grade).
 * @param {Record<string, number>} features
 * @returns {RiskResult}
 */
export function scoreRisk(features) {
  /** @type {{ name: string, weight: number, direction: 'increase'|'decrease' }[]} */
  const factors = [];

  if (features.age >= 60) factors.push({ name: "Age", weight: 0.12, direction: "increase" });
  if (features.gender === 1) factors.push({ name: "Gender (Male)", weight: 0.05, direction: "increase" });
  if (features.bmi >= 30) factors.push({ name: "BMI", weight: 0.1, direction: "increase" });
  if (features.family_history_heart_disease) {
    factors.push({ name: "Family History", weight: 0.14, direction: "increase" });
  }
  if (features.diabetes) factors.push({ name: "Diabetes", weight: 0.15, direction: "increase" });
  if (features.hypertension) factors.push({ name: "Hypertension", weight: 0.12, direction: "increase" });
  if (features.previous_heart_event) {
    factors.push({ name: "Previous Heart Event", weight: 0.18, direction: "increase" });
  }
  if (features.cholesterol_total >= 200) {
    const w = features.cholesterol_total >= 240 ? 0.14 : 0.1;
    factors.push({ name: "Cholesterol", weight: w, direction: "increase" });
  }
  if (features.blood_pressure_systolic >= 130) {
    const w = features.blood_pressure_systolic >= 140 ? 0.12 : 0.08;
    factors.push({ name: "Blood Pressure", weight: w, direction: "increase" });
  }
  if (features.ecg_result && features.ecg_result !== 0) {
    factors.push({ name: "ECG", weight: 0.09, direction: "increase" });
  }
  if (features.smoking_status === 0) {
    factors.push({ name: "Smoking", weight: 0.14, direction: "increase" });
  }
  if (features.stress_level >= 7) factors.push({ name: "Stress Level", weight: 0.08, direction: "increase" });
  if (features.exercise_hours_per_week >= 5) {
    factors.push({ name: "Regular Exercise", weight: 0.06, direction: "decrease" });
  }
  if (features.diet_quality === 1) {
    factors.push({ name: "Healthy Diet", weight: 0.05, direction: "decrease" });
  }

  let raw = 0.22;
  for (const f of factors) {
    raw += f.direction === "increase" ? f.weight : -f.weight;
  }
  const probability = Math.min(0.98, Math.max(0.02, raw));
  const risk_pct = Math.round(probability * 1000) / 10;
  const label = probability >= THRESHOLD ? "HIGH" : "LOW";

  const totalImpact = factors.reduce((s, f) => s + f.weight, 0) || 1;
  const factor_contributions = factors
    .map((f) => ({
      name: f.name,
      impact_pct: Math.round((f.weight / totalImpact) * 100),
      direction: f.direction,
    }))
    .sort((a, b) => b.impact_pct - a.impact_pct)
    .slice(0, 6);

  const message =
    label === "HIGH"
      ? "High-risk indicators detected. Consult a cardiologist and consider further diagnostic tests."
      : "Low risk profile. Maintain healthy lifestyle habits and routine check-ups.";

  return {
    probability,
    risk_pct,
    label,
    threshold: THRESHOLD,
    message,
    confidence: 0.85 + (probability > 0.5 ? probability * 0.1 : (1 - probability) * 0.1),
    factor_contributions,
    recommendations: buildRecommendations(label, factors),
    source: "mock",
  };
}

/**
 * @param {'HIGH'|'LOW'} label
 * @param {{ name: string }[]} factors
 */
function buildRecommendations(label, factors) {
  const immediate =
    label === "HIGH"
      ? [
          "Schedule a cardiology consultation within 2 weeks",
          "Request lipid panel and blood pressure monitoring",
          "Discuss family history with your clinician",
        ]
      : ["Continue annual wellness visits", "Monitor blood pressure at home monthly"];

  const lifestyle = [
    "Aim for 150 minutes of moderate exercise per week",
    "Reduce sodium intake — target Low or Medium salt levels",
    factors.some((f) => f.name.includes("Smoking"))
      ? "Enroll in a smoking cessation program"
      : "Maintain smoke-free habits",
    "Prioritize 7–8 hours of sleep per night",
  ];

  return { immediate, lifestyle };
}

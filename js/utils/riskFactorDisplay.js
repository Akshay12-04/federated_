/**
 * Map model factor rows to UI rows with tier and signed label.
 * @param {import('../domain/riskEngine.js').RiskResult['factor_contributions']} factors
 */
export function formatRiskFactorsForUI(factors) {
  return (factors ?? []).map((f) => {
    const isIncrease = f.direction === "increase";
    const signed = isIncrease ? `+${f.impact_pct}%` : `-${f.impact_pct}%`;
    let tier = "moderate";
    if (isIncrease && f.impact_pct >= 15) tier = "critical";
    else if (!isIncrease) tier = "healthy";
    else if (f.impact_pct < 10) tier = "moderate";

    return {
      name: normalizeFactorName(f.name),
      impact_pct: f.impact_pct,
      signed,
      tier,
      direction: f.direction,
    };
  });
}

/** @param {string} name */
function normalizeFactorName(name) {
  const map = {
    "Gender (Male)": "Gender",
    "Smoking (Current)": "Smoking",
    "Regular Exercise": "Exercise",
    "Healthy Diet": "Diet",
    "Stress Level": "Stress",
    "Previous Heart Event": "Prior cardiac event",
  };
  return map[name] ?? name;
}

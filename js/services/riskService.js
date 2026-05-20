import { CONFIG } from "../config.js";
import { buildFeatureVector } from "../domain/wizardToFeatures.js";
import { scoreRisk } from "../domain/riskEngine.js";
import { apiPost } from "./apiClient.js";
import { ok, err } from "../utils/serviceResult.js";

/**
 * Heart risk assessment — mock uses local engine; http mode POSTs features.
 * @param {{ basic: object, medical: object, lifestyle: object }} wizard
 * @returns {Promise<import('../utils/serviceResult.js').ServiceResult<import('../domain/riskEngine.js').RiskResult>>}
 */
export async function assessRisk(wizard) {
  try {
    const features = await buildFeatureVector(wizard);
    if (CONFIG.mode === "mock") {
      return ok(await scoreRisk(features));
    }
    const raw = await apiPost("/api/predict", { features, wizard });
    const mapped = mapPredictResponse(raw, features);
    return ok(mapped);
  } catch (e) {
    return err(e?.message ?? "Risk assessment failed", "RISK_ASSESS");
  }
}

/**
 * @param {unknown} raw
 * @param {Record<string, number>} features
 */
function mapPredictResponse(raw, features) {
  if (raw && typeof raw === "object" && "riskLevel" in raw && "score" in raw) {
    return /** @type {import('../domain/riskEngine.js').RiskResult} */ (raw);
  }
  return scoreRisk(features);
}

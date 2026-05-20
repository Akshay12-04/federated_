import { CONFIG } from "../config.js";
import { fetchMock } from "../utils/fetchMock.js";
import { apiGet } from "./apiClient.js";
import { ok, err } from "../utils/serviceResult.js";

const MOCK_URL = "data/mocks/analytics.json";

/**
 * @returns {Promise<import('../utils/serviceResult.js').ServiceResult<object>>}
 */
export async function fetchAnalytics() {
  try {
    if (CONFIG.mode === "mock") {
      return ok(await fetchMock(MOCK_URL));
    }
    const data = await apiGet("/api/analytics");
    return ok(data);
  } catch (e) {
    return err(e?.message ?? "Could not load analytics", "ANALYTICS");
  }
}

export function isAnalyticsVisuallyEmpty(data) {
  if (!data || typeof data !== "object") return true;
  const m = data.metrics;
  const hasMetrics = Array.isArray(m) && m.length > 0;
  const hasMatrix = Boolean(data.confusionMatrix?.matrix?.length);
  const roc = data.roc;
  const hasRoc = Array.isArray(roc?.fpr) && roc.fpr.length > 0;
  const fi = data.featureImportance;
  const hasFi = Array.isArray(fi?.labels) && fi.labels.length > 0;
  const hasRadar = Boolean(data.radar?.datasets?.length || (Array.isArray(data.radar?.labels) && data.radar.labels.length > 0));
  const hasComp = Array.isArray(data.comparison?.rows) && data.comparison.rows.length > 0;
  return !hasMetrics && !hasMatrix && !hasRoc && !hasFi && !hasRadar && !hasComp;
}

import { CONFIG } from "../config.js";
import { fetchMock } from "../utils/fetchMock.js";
import { apiGet } from "./apiClient.js";
import { ok, err } from "../utils/serviceResult.js";

const MOCK_URL = "data/mocks/activity-logs.json";

/**
 * @returns {Promise<import('../utils/serviceResult.js').ServiceResult<object>>}
 */
export async function fetchActivityLogs() {
  try {
    if (CONFIG.mode === "mock") {
      return ok(await fetchMock(MOCK_URL));
    }
    const data = await apiGet("/api/logs/activity");
    return ok(data);
  } catch (e) {
    return err(e?.message ?? "Could not load activity logs", "LOGS");
  }
}

/** @param {object} data */
export function isLogsEmpty(data) {
  const items = data?.items;
  return !Array.isArray(items) || items.length === 0;
}

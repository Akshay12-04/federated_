import { CONFIG } from "../config.js";
import { fetchMock } from "../utils/fetchMock.js";
import { apiGet } from "./apiClient.js";
import { ok, err } from "../utils/serviceResult.js";

const MOCK_URL = "data/mocks/settings.json";

/**
 * @returns {Promise<import('../utils/serviceResult.js').ServiceResult<object>>}
 */
export async function fetchSettingsPage() {
  try {
    if (CONFIG.mode === "mock") {
      return ok(await fetchMock(MOCK_URL));
    }
    const data = await apiGet("/api/settings");
    return ok(data);
  } catch (e) {
    return err(e?.message ?? "Could not load settings", "SETTINGS");
  }
}

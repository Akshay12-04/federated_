import { CONFIG } from "../config.js";
import { fetchMock } from "../utils/fetchMock.js";
import { apiGet, apiPost } from "./apiClient.js";
import { ok, err } from "../utils/serviceResult.js";

const MOCK_URL = "data/mocks/assistant.json";

/**
 * Bootstrap payload (welcome, prompts, mockReplies, disclaimer).
 * @returns {Promise<import('../utils/serviceResult.js').ServiceResult<object>>}
 */
export async function fetchAssistantPage() {
  try {
    if (CONFIG.mode === "mock") {
      return ok(await fetchMock(MOCK_URL));
    }
    const data = await apiGet("/api/assistant");
    return ok(data);
  } catch (e) {
    return err(e?.message ?? "Could not load assistant", "ASSISTANT_BOOT");
  }
}

/**
 * @param {string} message
 * @param {{ mockReplies?: Record<string, string> }} [context] from bootstrap in mock mode
 * @returns {Promise<import('../utils/serviceResult.js').ServiceResult<string>>}
 */
export async function sendAssistantMessage(message, context = {}) {
  const trimmed = message.trim();
  if (!trimmed) {
    return err("Enter a message to send.", "VALIDATION");
  }
  try {
    if (CONFIG.mode === "mock") {
      const reply = await matchMockReply(trimmed, context.mockReplies ?? {});
      return ok(reply);
    }
    const raw = await apiPost("/api/assistant/chat", { message: trimmed });
    const reply =
      raw && typeof raw === "object" && "reply" in raw ? String(/** @type {{reply:unknown}} */ (raw).reply) : String(raw ?? "");
    return ok(reply);
  } catch (e) {
    return err(e?.message ?? "Assistant is unavailable.", "ASSISTANT_CHAT");
  }
}

/**
 * @param {string} message
 * @param {Record<string, string>} mockReplies
 * @returns {Promise<string>}
 */
async function matchMockReply(message, mockReplies) {
  await delay(400 + Math.random() * 400);
  const lower = message.toLowerCase();
  for (const [key, reply] of Object.entries(mockReplies ?? {})) {
    if (key !== "default" && lower.includes(key.split(" ")[0])) {
      return reply;
    }
  }
  if (lower.includes("risk")) return mockReplies?.["risk factors"] ?? mockReplies?.default;
  if (lower.includes("predict")) return mockReplies?.prediction ?? mockReplies?.default;
  if (lower.includes("federat")) return mockReplies?.federated ?? mockReplies?.default;
  if (lower.includes("lifestyle")) return mockReplies?.lifestyle ?? mockReplies?.default;
  return mockReplies?.default ?? "I'm here to help with CardioFL questions.";
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

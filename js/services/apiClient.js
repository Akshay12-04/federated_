import { CONFIG } from "../config.js";

function joinUrl(base, path) {
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * @param {string} path API path e.g. /api/analytics
 * @param {RequestInit} [init]
 */
export async function apiFetch(path, init = {}) {
  const url = joinUrl(CONFIG.apiBaseUrl, path);
  const headers = { Accept: "application/json", ...init.headers };
  if (init.body && typeof init.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    const msg = text || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** @param {string} path */
export function apiGet(path) {
  return apiFetch(path, { method: "GET" });
}

/**
 * @param {string} path
 * @param {unknown} body
 */
export function apiPost(path, body) {
  return apiFetch(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

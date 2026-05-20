/**
 * Federated training log — browser console + optional POST for dev server CMD output.
 * @param {string} message
 * @param {Record<string, unknown>} [meta]
 */
export function logTraining(message, meta = {}) {
  const line = meta.round != null
    ? `[CardioFL FL Train] ${message} (round ${meta.round}/${meta.totalRounds ?? "?"})`
    : `[CardioFL FL Train] ${message}`;
  console.info(line, Object.keys(meta).length ? meta : "");

  if (typeof fetch !== "undefined") {
    fetch("/api/training/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, ...meta, ts: new Date().toISOString() }),
    }).catch(() => {
      /* dev_server.py not running — console only */
    });
  }
}

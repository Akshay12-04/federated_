/**
 * @param {{
 *   label: string,
 *   value: string,
 *   badge: string,
 *   badgeVariant?: string,
 *   iconHtml: string,
 *   iconTone?: string
 * }} opts
 */
export function createMetricCard({
  label,
  value,
  badge,
  badgeVariant = "positive",
  iconHtml,
  iconTone = "blue",
}) {
  const card = document.createElement("article");
  card.className = "c-metric-card";
  const badgeClass =
    badgeVariant === "neutral"
      ? "c-metric-card__badge c-metric-card__badge--neutral"
      : "c-metric-card__badge c-metric-card__badge--positive";

  card.innerHTML = `
    <div class="c-metric-card__top">
      <div class="c-metric-card__icon c-metric-card__icon--${escapeHtml(iconTone)}" aria-hidden="true">${iconHtml}</div>
      <span class="${badgeClass}">${escapeHtml(badge)}</span>
    </div>
    <div class="c-metric-card__value">${escapeHtml(value)}</div>
    <div class="c-metric-card__label">${escapeHtml(label)}</div>
  `;
  return card;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

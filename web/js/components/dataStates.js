import { escapeHtml } from "../utils/dom.js";

/**
 * @param {HTMLElement} el
 * @param {string} [message]
 */
export function setLoadingState(el, message = "Loading…") {
  el.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "c-data-state c-data-state--loading c-card";
  wrap.innerHTML = `<p class="c-card__body">${escapeHtml(message)}</p>`;
  el.appendChild(wrap);
}

/**
 * @param {HTMLElement} el
 * @param {string} message
 * @param {() => void} [onRetry]
 */
export function setErrorState(el, message, onRetry) {
  el.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "c-data-state c-data-state--error c-card";
  const safe = escapeHtml(message);
  wrap.innerHTML = `
    <p class="c-card__body text-danger" role="alert">${safe}</p>
    <p class="c-card__body text-muted text-sm mt-4">Check <code>CONFIG.mode</code> and <code>apiBaseUrl</code> in <code>js/config.js</code> if using HTTP mode.</p>
  `;
  if (onRetry) {
    const row = document.createElement("div");
    row.className = "mt-4";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "c-btn c-btn--primary";
    btn.textContent = "Retry";
    btn.addEventListener("click", onRetry);
    row.appendChild(btn);
    wrap.appendChild(row);
  }
  el.appendChild(wrap);
}

/**
 * @param {HTMLElement} el
 * @param {string} title
 * @param {string} [description]
 */
export function setEmptyState(el, title, description) {
  el.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "c-data-state c-data-state--empty c-card";
  wrap.innerHTML = `
    <h3 class="c-card__title">${escapeHtml(title)}</h3>
    ${description ? `<p class="c-card__body text-muted">${escapeHtml(description)}</p>` : ""}
  `;
  el.appendChild(wrap);
}

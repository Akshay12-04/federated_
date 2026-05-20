/**
 * @param {{ title: string, subtitle?: string }} opts
 */
export function createPageHeader({ title, subtitle }) {
  const el = document.createElement("header");
  el.className = "c-page-header";
  el.innerHTML = `
    <h1 class="c-page-header__title">${title}</h1>
    ${subtitle ? `<p class="c-page-header__subtitle">${subtitle}</p>` : ""}
  `;
  return el;
}

/**
 * @param {string} message
 */
export function createPlaceholderCard(message) {
  const card = document.createElement("div");
  card.className = "c-card c-card--placeholder";
  card.innerHTML = `
    <div class="c-card__icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9" stroke-dasharray="4 4"/></svg>
    </div>
    <p class="c-card__body">${message}</p>
  `;
  return card;
}

import { settingsStore } from "../state/settingsStore.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * @param {HTMLElement} root
 * @param {object} data
 */
export function mountSettingsPage(root, data) {
  const host = document.createElement("div");
  host.className = "p-settings__sections";

  for (const section of data.sections ?? []) {
    host.appendChild(buildSection(section));
  }

  const actions = document.createElement("div");
  actions.className = "c-settings-actions mt-6";
  for (const act of data.dataActions ?? []) {
    actions.appendChild(buildActionCard(act));
  }
  host.appendChild(actions);

  const privacy = document.createElement("article");
  privacy.className = "c-card";
  const pb = data.privacyBlock ?? {};
  privacy.innerHTML = `
    <h2 class="c-card__title mb-4">${escapeHtml(pb.title ?? "Privacy")}</h2>
    <p class="c-card__body">${escapeHtml(pb.body ?? "")}</p>
  `;
  host.appendChild(privacy);

  root.appendChild(host);
}

function buildSection(section) {
  const card = document.createElement("article");
  card.className = "c-card";
  card.innerHTML = `<h2 class="c-card__title mb-4">${escapeHtml(section.title)}</h2>`;

  for (const row of section.rows ?? []) {
    const el = document.createElement("div");
    el.className = "c-settings-row";
    const state = settingsStore.getState();

    if (row.type === "slider") {
      const val = state[row.key] ?? row.default;
      el.innerHTML = `
        <div>
          <div class="c-settings-row__label">${escapeHtml(row.label)}</div>
          <div class="c-settings-row__hint">${escapeHtml(row.hint)}</div>
        </div>
        <div class="c-settings-slider-wrap">
          <input type="range" min="${row.min}" max="${row.max}" value="${val}" data-key="${row.key}" />
          <output>${val}</output>
        </div>
      `;
      el.querySelector("input")?.addEventListener("input", (e) => {
        const v = Number(e.target.value);
        settingsStore.set(row.key, v);
        const out = el.querySelector("output");
        if (out) out.textContent = String(v);
      });
    } else {
      const on = Boolean(state[row.key] ?? row.default);
      el.innerHTML = `
        <div>
          <div class="c-settings-row__label">${escapeHtml(row.label)}</div>
          <div class="c-settings-row__hint">${escapeHtml(row.hint)}</div>
        </div>
        <button type="button" class="c-toggle${on ? " is-on" : ""}" data-key="${row.key}" aria-label="${escapeHtml(row.label)}" aria-pressed="${on ? "true" : "false"}"></button>
      `;
      el.querySelector(".c-toggle")?.addEventListener("click", (e) => {
        const btn = /** @type {HTMLButtonElement} */ (e.currentTarget);
        const key = btn.dataset.key;
        if (!key) return;
        const next = !settingsStore.getState()[key];
        settingsStore.set(key, next);
        btn.classList.toggle("is-on", next);
        btn.setAttribute("aria-pressed", next ? "true" : "false");
      });
    }
    card.appendChild(el);
  }
  return card;
}

function buildActionCard(act) {
  const card = document.createElement("article");
  card.className = "c-card c-action-card";
  card.innerHTML = `
    <div>
      <h3 class="c-action-card__title">${escapeHtml(act.title)}</h3>
      <p class="c-action-card__desc">${escapeHtml(act.description)}</p>
    </div>
    <button type="button" class="c-btn c-btn--ghost">${escapeHtml(act.button)}</button>
  `;
  card.querySelector("button")?.addEventListener("click", () => {
    alert(`${act.title} — placeholder action.`);
  });
  return card;
}

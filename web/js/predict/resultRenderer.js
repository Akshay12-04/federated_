import { escapeHtml } from "../utils/dom.js";
import { navigate } from "../router/router.js";
import { predictStore } from "../state/predictStore.js";
import { formatRiskFactorsForUI } from "../utils/riskFactorDisplay.js";
import { animateCounter, animateBarWidth } from "../utils/animateValue.js";
import { downloadMedicalReport } from "../utils/medicalReportPdf.js";

/**
 * @param {HTMLElement} root
 * @param {import('../domain/riskEngine.js').RiskResult} result
 */
export function renderPredictionResult(root, result) {
  root.innerHTML = "";

  const header = document.createElement("header");
  header.className = "c-page-header";
  header.innerHTML = `
    <h1 id="prediction-result-title" class="c-page-header__title" tabindex="-1">Prediction Result</h1>
    <p class="c-page-header__subtitle">Federated model risk assessment from your health profile</p>
  `;
  root.appendChild(header);

  const top = document.createElement("section");
  top.className = "p-predict__result-top";

  top.appendChild(buildGaugeCard(result));
  top.appendChild(buildSummaryColumn(result));
  root.appendChild(top);

  root.appendChild(buildFactorsCard(result));
  root.appendChild(buildRecommendationsCard(result));

  const actions = document.createElement("div");
  actions.className = "p-predict__result-actions";
  actions.innerHTML = `
    <button type="button" class="c-btn c-btn--ghost" data-action="new">New Prediction</button>
    <button type="button" class="c-btn c-btn--primary" data-action="dashboard">Back to FL Dashboard</button>
  `;
  actions.querySelector('[data-action="new"]')?.addEventListener("click", () => {
    predictStore.resetWizard();
    navigate("/predict");
  });
  actions.querySelector('[data-action="dashboard"]')?.addEventListener("click", () => {
    navigate("/dashboard");
  });
  root.appendChild(actions);
}

function buildGaugeCard(result) {
  const card = document.createElement("article");
  card.className = "c-result-gauge c-card";
  const isHigh = result.label === "HIGH";
  const color = isHigh ? "var(--color-danger)" : "var(--color-success)";
  const pct = result.risk_pct;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  card.innerHTML = `
    <div class="c-result-gauge__ring" style="--gauge-color: ${color}">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="c-result-gauge__track" cx="60" cy="60" r="54" />
        <circle class="c-result-gauge__fill" cx="60" cy="60" r="54"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
      </svg>
      <div class="c-result-gauge__value">
        <span class="c-result-gauge__pct" data-animate-pct="${pct}">0%</span>
        <span class="c-result-gauge__label">Risk Score</span>
      </div>
    </div>
    <p class="c-result-gauge__level c-result-gauge__level--${isHigh ? "high" : "low"}">${result.label} RISK</p>
  `;

  const pctEl = card.querySelector("[data-animate-pct]");
  if (pctEl) {
    animateCounter(pctEl, pct, 900, (n) => `${n.toFixed(1)}%`);
  }
  return card;
}

function buildSummaryColumn(result) {
  const col = document.createElement("div");
  col.className = "c-result-summary-col";

  const isHigh = result.label === "HIGH";
  const conf = result.confidence != null ? Math.round(result.confidence * 100) : null;

  col.innerHTML = `
    <article class="c-result-status c-card c-result-status--${isHigh ? "high" : "low"}">
      <div class="c-result-status__icon" aria-hidden="true">${isHigh ? "⚠" : "✓"}</div>
      <div>
        <h2 class="c-result-status__title">Risk Level: ${result.label === "HIGH" ? "High" : "Low"}</h2>
        <p class="c-result-status__text">${escapeHtml(result.message)}</p>
      </div>
    </article>
    <article class="c-result-status c-card c-result-status--info">
      <div class="c-result-status__icon" aria-hidden="true">ℹ</div>
      <div>
        <h2 class="c-result-status__title">Model Confidence: <span data-animate-conf="${conf ?? 0}">0</span>%</h2>
        <p class="c-result-status__text">Model trained on federated hospital cohorts using privacy-preserving learning.</p>
      </div>
    </article>
    <button type="button" class="c-btn c-btn--primary c-result-download" data-action="download">
      <span aria-hidden="true">⬇</span> Download Medical Report
    </button>
  `;

  const confEl = col.querySelector("[data-animate-conf]");
  if (confEl && conf != null) {
    animateCounter(confEl, conf, 800, (n) => `${Math.round(n)}`);
  }

  col.querySelector('[data-action="download"]')?.addEventListener("click", () => {
    downloadMedicalReport(result);
  });

  return col;
}

function buildFactorsCard(result) {
  const card = document.createElement("article");
  card.className = "c-card c-card--wide mt-6 c-result-factors";
  const factors = formatRiskFactorsForUI(result.factor_contributions);

  card.innerHTML = `
    <h2 class="c-card__title">
      <span class="c-result-factors__icon" aria-hidden="true">📊</span>
      Risk Factor Contributions
    </h2>
    <p class="c-card__body text-muted text-sm">Values derived from your prediction — higher bars indicate stronger influence on the outcome.</p>
  `;

  const list = document.createElement("div");
  list.className = "c-factor-list";

  if (!factors.length) {
    list.innerHTML = `<p class="text-muted text-sm">No factor breakdown available.</p>`;
  } else {
    for (const f of factors) {
      const row = document.createElement("div");
      row.className = "c-factor-row";
      row.title = `${f.name}: ${f.signed} contribution to risk`;
      const barClass = `c-factor-row__bar--${f.tier}`;
      row.innerHTML = `
        <div class="c-factor-row__head">
          <span class="c-factor-row__name">${escapeHtml(f.name)}</span>
          <span class="c-factor-row__pct c-factor-row__pct--${f.tier}" data-target="${f.impact_pct}">${f.signed}</span>
        </div>
        <div class="c-factor-row__track">
          <div class="c-factor-row__bar ${barClass}" data-width="${f.impact_pct}" style="width:0%"></div>
        </div>
      `;
      list.appendChild(row);
      const bar = row.querySelector(".c-factor-row__bar");
      if (bar) animateBarWidth(bar, f.impact_pct);
    }
  }

  card.appendChild(list);
  return card;
}

function buildRecommendationsCard(result) {
  const card = document.createElement("article");
  card.className = "c-card mt-6";
  card.innerHTML = `<h2 class="c-card__title">Recommendations</h2>`;

  const grid = document.createElement("div");
  grid.className = "c-rec-grid";
  grid.appendChild(recColumn("Immediate actions", result.recommendations?.immediate ?? []));
  grid.appendChild(recColumn("Lifestyle", result.recommendations?.lifestyle ?? []));

  card.appendChild(grid);
  return card;
}

function recColumn(title, items) {
  const col = document.createElement("div");
  col.className = "c-rec-col";
  col.innerHTML = `<h3 class="c-rec-col__title">${escapeHtml(title)}</h3>`;
  const ul = document.createElement("ul");
  ul.className = "c-rec-col__list";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  }
  col.appendChild(ul);
  return col;
}

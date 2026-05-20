import { navigate } from "../router/router.js";

/** @param {HTMLElement} root */
export function renderLanding(root) {
  root.innerHTML = `
    <div class="p-landing">
      <div class="p-landing__bg" aria-hidden="true">
        <span class="p-landing__orb p-landing__orb--1"></span>
        <span class="p-landing__orb p-landing__orb--2"></span>
        <span class="p-landing__orb p-landing__orb--3"></span>
      </div>
      <div class="p-landing__inner">
        <div class="p-landing__logo-wrap p-landing__fade">
          <div class="p-landing__logo" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="url(#lg)" stroke-width="2"/>
              <path d="M12 32h8l4-12 6 24 6-16 4 8h12" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="64" y2="64">
                  <stop stop-color="#3b82f6"/><stop offset="1" stop-color="#22d3ee"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <h1 class="p-landing__title p-landing__fade p-landing__fade--1">CardioFL</h1>
        <p class="p-landing__subtitle p-landing__fade p-landing__fade--2">Privacy-Preserving Federated Healthcare Intelligence</p>
        <p class="p-landing__tag p-landing__fade p-landing__fade--3">Advanced Heart Disease Prediction with Federated Learning</p>

        <div class="p-landing__cards p-landing__fade p-landing__fade--4">
          <article class="p-landing__card">
            <span class="p-landing__card-icon" aria-hidden="true">🧠</span>
            <h2>Intelligent Prediction</h2>
            <p>Advanced neural networks for accurate predictions</p>
          </article>
          <article class="p-landing__card">
            <span class="p-landing__card-icon" aria-hidden="true">🛡️</span>
            <h2>Privacy First</h2>
            <p>Federated learning ensures data never leaves hospitals</p>
          </article>
          <article class="p-landing__card">
            <span class="p-landing__card-icon" aria-hidden="true">📈</span>
            <h2>High Accuracy</h2>
            <p>92%+ prediction accuracy with explainable insights</p>
          </article>
        </div>

        <div class="p-landing__actions p-landing__fade p-landing__fade--5">
          <button type="button" class="p-landing__btn p-landing__btn--primary" data-go="/predict">Start Prediction</button>
          <button type="button" class="p-landing__btn p-landing__btn--ghost" data-go="/train">Train Model</button>
          <button type="button" class="p-landing__btn p-landing__btn--ghost" data-go="/analytics">View Analytics</button>
        </div>

        <p class="p-landing__footer p-landing__fade p-landing__fade--6">Final Year Engineering Project · Powered by Federated Learning</p>
      </div>
    </div>
  `;

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const path = btn.getAttribute("data-go");
      if (path) navigate(path);
    });
  });
}

import { createPageHeader } from "../components/pageHeader.js";
import { createStepper, updateStepper } from "../components/stepper.js";
import { predictStore } from "../state/predictStore.js";
import { validateStep, hasErrors } from "../domain/validation.js";
import { assessRisk } from "../services/riskService.js";
import { renderWizardStep } from "../predict/wizardRenderer.js";
import { WIZARD_STEP_LABELS, TOTAL_STEPS } from "../predict/wizardConfig.js";
import { navigate } from "../router/router.js";

/** @param {HTMLElement} root */
export function renderPredict(root) {
  root.appendChild(
    createPageHeader({
      title: "Heart Disease Risk Prediction",
      subtitle: "Complete the multi-step assessment for federated risk analysis",
    })
  );

  const stepperHost = document.createElement("div");
  stepperHost.className = "p-predict__stepper";
  const stepper = createStepper(predictStore.getState().step, WIZARD_STEP_LABELS);
  stepperHost.appendChild(stepper);
  root.appendChild(stepperHost);

  const formHost = document.createElement("section");
  formHost.className = "p-predict__wizard-area";
  formHost.setAttribute("aria-label", "Assessment form");
  root.appendChild(formHost);

  const navBar = document.createElement("div");
  navBar.className = "c-wizard-nav";
  navBar.innerHTML = `
    <button type="button" class="c-btn c-btn--ghost" data-action="back">Back</button>
    <button type="button" class="c-btn c-btn--primary" data-action="next">Next</button>
  `;
  root.appendChild(navBar);

  const backBtn = navBar.querySelector('[data-action="back"]');
  const nextBtn = navBar.querySelector('[data-action="next"]');

  const paint = () => {
    const state = predictStore.getState();
    updateStepper(stepper, state.step, WIZARD_STEP_LABELS);
    renderWizardStep(formHost, state.step, state.wizard, state.errors, onFieldChange);
    formHost.querySelector(".c-wizard-submit-error")?.remove();
    if (state.errors.submit) {
      const err = document.createElement("p");
      err.className = "c-wizard-submit-error c-field__error";
      err.setAttribute("role", "alert");
      err.textContent = state.errors.submit;
      formHost.appendChild(err);
    }
    backBtn.disabled = state.step <= 1 || state.isSubmitting;
    nextBtn.disabled = state.isSubmitting;
    nextBtn.textContent =
      state.step === TOTAL_STEPS
        ? state.isSubmitting
          ? "Analyzing…"
          : "Get Prediction"
        : "Next";
  };

  /** @param {string} section @param {string} field @param {unknown} value */
  function onFieldChange(section, field, value) {
    predictStore.patchWizard(section, { [field]: value });
    const state = predictStore.getState();
    if (state.errors[`${section}.${field}`]) {
      const nextErrors = { ...state.errors };
      delete nextErrors[`${section}.${field}`];
      predictStore.setErrors(nextErrors);
    }
  }

  backBtn?.addEventListener("click", () => {
    const state = predictStore.getState();
    if (state.step > 1) {
      predictStore.setState({ step: state.step - 1 });
      predictStore.clearErrors();
    }
  });

  nextBtn?.addEventListener("click", async () => {
    const state = predictStore.getState();
    const errors = validateStep(state.step, state.wizard);
    if (hasErrors(errors)) {
      predictStore.setErrors(errors);
      paint();
      formHost.querySelector(".c-field__error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    predictStore.clearErrors();

    if (state.step < TOTAL_STEPS) {
      predictStore.setState({ step: state.step + 1 });
      return;
    }

    predictStore.setState({ isSubmitting: true });
    formHost.setAttribute("aria-busy", "true");
    paint();
    const result = await assessRisk(state.wizard);
    if (!result.ok) {
      predictStore.setState({ isSubmitting: false });
      formHost.removeAttribute("aria-busy");
      predictStore.setErrors({ submit: result.error });
      paint();
      return;
    }
    predictStore.setPrediction(result.data);
    formHost.removeAttribute("aria-busy");
    navigate("/predict/result");
  });

  const unsub = predictStore.subscribe(() => paint());
  const appRoot = document.getElementById("app-root");
  appRoot?.addEventListener("app:leave", () => unsub(), { once: true });

  paint();
}

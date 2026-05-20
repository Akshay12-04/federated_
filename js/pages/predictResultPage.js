import { predictStore } from "../state/predictStore.js";
import { navigate } from "../router/router.js";
import { renderPredictionResult } from "../predict/resultRenderer.js";

/** @param {HTMLElement} root */
export function renderPredictResult(root) {
  const { prediction } = predictStore.getState();
  if (!prediction) {
    navigate("/predict");
    return;
  }
  renderPredictionResult(root, prediction);
  requestAnimationFrame(() => {
    document.getElementById("prediction-result-title")?.focus({ preventScroll: true });
  });
}

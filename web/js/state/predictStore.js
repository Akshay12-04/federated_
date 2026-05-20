import { createStore } from "./store.js";
import { loadJson, saveJson, removeKey } from "../utils/storage.js";

const STORAGE_KEY = "cardiofl_predict_wizard";

/** @typedef {import('./predictStore.types.js').PredictState} PredictState */

/** @type {PredictState} */
const INITIAL_STATE = {
  step: 1,
  wizard: {
    basic: {
      age: 55,
      gender: "Male",
      bmi: 26,
      family_history_heart_disease: 0,
    },
    medical: {
      diabetes: 0,
      hypertension: 0,
      previous_heart_event: 0,
      cholesterol_total: 200,
      blood_pressure_systolic: 120,
      ecg_result: "Normal",
    },
    lifestyle: {
      smoking_status: "Never",
      alcohol_units_per_week: 3,
      physical_activity_level: "Moderate",
      exercise_hours_per_week: 3,
      sleep_hours_per_night: 7,
      sleep_quality: "Fair",
      stress_level: 5,
      diet_quality: "Average",
      salt_intake: "Medium",
    },
  },
  prediction: null,
  isSubmitting: false,
  errors: {},
};

function hydrate() {
  const saved = loadJson(STORAGE_KEY);
  if (!saved || typeof saved !== "object") return INITIAL_STATE;
  return {
    ...INITIAL_STATE,
    step: saved.step ?? 1,
    wizard: {
      basic: { ...INITIAL_STATE.wizard.basic, ...saved.wizard?.basic },
      medical: { ...INITIAL_STATE.wizard.medical, ...saved.wizard?.medical },
      lifestyle: { ...INITIAL_STATE.wizard.lifestyle, ...saved.wizard?.lifestyle },
    },
    prediction: saved.prediction ?? null,
    isSubmitting: false,
    errors: {},
  };
}

const inner = createStore(hydrate());

function persist(state) {
  saveJson(STORAGE_KEY, {
    step: state.step,
    wizard: state.wizard,
    prediction: state.prediction,
  });
}

inner.subscribe((state) => persist(state));

export const predictStore = {
  getState: () => inner.getState(),
  subscribe: (fn) => inner.subscribe(fn),
  /** @param {Partial<PredictState>} partial */
  setState(partial) {
    inner.setState(partial);
  },
  /** @param {string} section @param {Record<string, unknown>} patch */
  patchWizard(section, patch) {
    const s = inner.getState();
    inner.setState({
      wizard: {
        ...s.wizard,
        [section]: { ...s.wizard[section], ...patch },
      },
    });
  },
  setErrors(errors) {
    inner.setState({ errors });
  },
  clearErrors() {
    inner.setState({ errors: {} });
  },
  setPrediction(prediction) {
    inner.setState({ prediction, isSubmitting: false });
  },
  resetWizard() {
    inner.replaceState({ ...INITIAL_STATE, prediction: null });
    removeKey(STORAGE_KEY);
  },
};

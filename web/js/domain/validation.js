/**
 * @param {unknown} value
 * @param {number} min
 * @param {number} max
 * @param {string} label
 */
function rangeNumber(value, min, max, label) {
  const n = Number(value);
  if (Number.isNaN(n)) return `${label} must be a number`;
  if (n < min || n > max) return `${label} must be between ${min} and ${max}`;
  return null;
}

/**
 * @param {number} step
 * @param {{ basic: object, medical: object, lifestyle: object }} wizard
 * @returns {Record<string, string>}
 */
export function validateStep(step, wizard) {
  /** @type {Record<string, string>} */
  const errors = {};
  const b = wizard.basic ?? {};
  const m = wizard.medical ?? {};
  const l = wizard.lifestyle ?? {};

  if (step === 1) {
    const ageErr = rangeNumber(b.age, 18, 100, "Age");
    if (ageErr) errors["basic.age"] = ageErr;
    if (!b.gender) errors["basic.gender"] = "Select a gender";
    const bmiErr = rangeNumber(b.bmi, 15, 50, "BMI");
    if (bmiErr) errors["basic.bmi"] = bmiErr;
  }

  if (step === 2) {
    const cholErr = rangeNumber(m.cholesterol_total, 100, 400, "Total cholesterol");
    if (cholErr) errors["medical.cholesterol_total"] = cholErr;
    const bpErr = rangeNumber(m.blood_pressure_systolic, 80, 220, "Systolic blood pressure");
    if (bpErr) errors["medical.blood_pressure_systolic"] = bpErr;
    if (!m.ecg_result) errors["medical.ecg_result"] = "Select an ECG result";
  }

  if (step === 3) {
    const alcErr = rangeNumber(l.alcohol_units_per_week, 0, 50, "Alcohol units");
    if (alcErr) errors["lifestyle.alcohol_units_per_week"] = alcErr;
    const sleepErr = rangeNumber(l.sleep_hours_per_night, 3, 12, "Sleep hours");
    if (sleepErr) errors["lifestyle.sleep_hours_per_night"] = sleepErr;
    const exErr = rangeNumber(l.exercise_hours_per_week, 0, 30, "Exercise hours");
    if (exErr) errors["lifestyle.exercise_hours_per_week"] = exErr;
    const stressErr = rangeNumber(l.stress_level, 1, 10, "Stress level");
    if (stressErr) errors["lifestyle.stress_level"] = stressErr;
    if (!l.smoking_status) errors["lifestyle.smoking_status"] = "Select smoking status";
    if (!l.diet_quality) errors["lifestyle.diet_quality"] = "Select diet quality";
    if (!l.salt_intake) errors["lifestyle.salt_intake"] = "Select salt intake";
  }

  return errors;
}

/**
 * @param {Record<string, string>} errors
 * @returns {boolean}
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

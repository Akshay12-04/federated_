import { loadEncodingManifest } from "./encodingLoader.js";

/**
 * Maps wizard sections → 29 numeric features for API / risk engine.
 * @param {{ basic: object, medical: object, lifestyle: object }} wizard
 * @param {object} manifest
 * @returns {Record<string, number>}
 */
export function wizardToFeatures(wizard, manifest) {
  const categories = manifest.categories ?? {};
  const defaults = manifest.wizard_defaults ?? {};

  const encode = (col, label) => {
    const map = categories[col];
    if (!map || label == null) return 0;
    return map[label] ?? 0;
  };

  const b = wizard.basic ?? {};
  const m = wizard.medical ?? {};
  const l = wizard.lifestyle ?? {};

  return {
    age: Number(b.age),
    gender: encode("gender", b.gender),
    bmi: Number(b.bmi),
    family_history_heart_disease: Number(b.family_history_heart_disease) ? 1 : 0,
    diabetes: Number(m.diabetes) ? 1 : 0,
    hypertension: Number(m.hypertension) ? 1 : 0,
    previous_heart_event: Number(m.previous_heart_event) ? 1 : 0,
    cholesterol_total: Number(m.cholesterol_total),
    hdl_cholesterol: defaults.hdl_cholesterol ?? 50,
    ldl_cholesterol: defaults.ldl_cholesterol ?? 130,
    blood_pressure_systolic: Number(m.blood_pressure_systolic),
    blood_pressure_diastolic: defaults.blood_pressure_diastolic ?? 80,
    resting_heart_rate: defaults.resting_heart_rate ?? 72,
    fasting_blood_sugar: defaults.fasting_blood_sugar ?? 100,
    ecg_result: encode("ecg_result", m.ecg_result),
    smoking_status: encode("smoking_status", l.smoking_status),
    cigarettes_per_day: defaults.cigarettes_per_day ?? 0,
    alcohol_units_per_week: Number(l.alcohol_units_per_week),
    physical_activity_level: encode(
      "physical_activity_level",
      l.physical_activity_level ?? "Moderate"
    ),
    exercise_hours_per_week: Number(l.exercise_hours_per_week),
    walks_daily: defaults.walks_daily ?? 0,
    plays_sport: defaults.plays_sport ?? 0,
    sleep_hours_per_night: Number(l.sleep_hours_per_night),
    sleep_quality: encode("sleep_quality", l.sleep_quality ?? "Fair"),
    stress_level: Number(l.stress_level),
    depression_anxiety: defaults.depression_anxiety ?? 0,
    diet_quality: encode("diet_quality", l.diet_quality),
    fruit_veg_servings_per_day: defaults.fruit_veg_servings_per_day ?? 3,
    salt_intake: encode("salt_intake", l.salt_intake),
  };
}

/**
 * @param {{ basic: object, medical: object, lifestyle: object }} wizard
 * @returns {Promise<Record<string, number>>}
 */
export async function buildFeatureVector(wizard) {
  const manifest = await loadEncodingManifest();
  return wizardToFeatures(wizard, manifest);
}

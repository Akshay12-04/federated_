import { escapeHtml } from "../utils/dom.js";
import { FIELD_OPTIONS } from "./wizardConfig.js";

/**
 * @param {HTMLElement} container
 * @param {number} step
 * @param {object} wizard
 * @param {Record<string, string>} errors
 * @param {(section: string, field: string, value: unknown) => void} onChange
 */
export function renderWizardStep(container, step, wizard, errors, onChange) {
  container.innerHTML = "";

  const card = document.createElement("div");
  card.className = "c-wizard-card c-card";

  if (step === 1) {
    card.appendChild(renderBasicStep(wizard.basic, errors, onChange));
  } else if (step === 2) {
    card.appendChild(renderMedicalStep(wizard.medical, errors, onChange));
  } else if (step === 3) {
    card.appendChild(renderLifestyleStep(wizard.lifestyle, errors, onChange));
  } else if (step === 4) {
    card.appendChild(renderReviewStep(wizard));
  }

  container.appendChild(card);
}

/**
 * @param {object} b
 * @param {Record<string, string>} errors
 * @param {(section: string, field: string, value: unknown) => void} onChange
 */
function renderBasicStep(b, errors, onChange) {
  const section = document.createElement("div");
  section.className = "c-wizard-section";
  section.innerHTML = `<h2 class="c-wizard-section__title">Basic Information</h2>`;

  const grid = document.createElement("div");
  grid.className = "c-wizard-grid";

  grid.appendChild(
    fieldRange("Age", "basic", "age", b.age, 18, 100, 1, errors, onChange)
  );
  grid.appendChild(
    fieldSelect("Gender", "basic", "gender", b.gender, FIELD_OPTIONS.gender, errors, onChange)
  );
  grid.appendChild(
    fieldRange("BMI", "basic", "bmi", b.bmi, 15, 50, 0.1, errors, onChange)
  );
  grid.appendChild(
    fieldCheckbox(
      "Family history of heart disease",
      "basic",
      "family_history_heart_disease",
      b.family_history_heart_disease,
      onChange
    )
  );

  section.appendChild(grid);
  return section;
}

function renderMedicalStep(m, errors, onChange) {
  const section = document.createElement("div");
  section.className = "c-wizard-section";
  section.innerHTML = `<h2 class="c-wizard-section__title">Medical History</h2>`;

  const grid = document.createElement("div");
  grid.className = "c-wizard-grid";

  grid.appendChild(fieldCheckbox("Diabetes", "medical", "diabetes", m.diabetes, onChange));
  grid.appendChild(fieldCheckbox("Hypertension", "medical", "hypertension", m.hypertension, onChange));
  grid.appendChild(
    fieldCheckbox("Previous heart event", "medical", "previous_heart_event", m.previous_heart_event, onChange)
  );
  grid.appendChild(
    fieldNumber(
      "Total cholesterol (mg/dL)",
      "medical",
      "cholesterol_total",
      m.cholesterol_total,
      100,
      400,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldNumber(
      "Systolic BP (mmHg)",
      "medical",
      "blood_pressure_systolic",
      m.blood_pressure_systolic,
      80,
      220,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldSelect("ECG result", "medical", "ecg_result", m.ecg_result, FIELD_OPTIONS.ecg_result, errors, onChange)
  );

  section.appendChild(grid);
  return section;
}

function renderLifestyleStep(l, errors, onChange) {
  const section = document.createElement("div");
  section.className = "c-wizard-section";
  section.innerHTML = `<h2 class="c-wizard-section__title">Lifestyle Analysis</h2>`;

  const grid = document.createElement("div");
  grid.className = "c-wizard-grid";

  grid.appendChild(
    fieldSelect(
      "Smoking status",
      "lifestyle",
      "smoking_status",
      l.smoking_status,
      FIELD_OPTIONS.smoking_status,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldRange(
      "Alcohol (units/week)",
      "lifestyle",
      "alcohol_units_per_week",
      l.alcohol_units_per_week,
      0,
      50,
      0.5,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldSelect(
      "Physical activity",
      "lifestyle",
      "physical_activity_level",
      l.physical_activity_level ?? "Moderate",
      FIELD_OPTIONS.physical_activity_level,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldRange(
      "Exercise (hours/week)",
      "lifestyle",
      "exercise_hours_per_week",
      l.exercise_hours_per_week,
      0,
      30,
      0.5,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldRange(
      "Sleep (hours/night)",
      "lifestyle",
      "sleep_hours_per_night",
      l.sleep_hours_per_night,
      3,
      12,
      0.5,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldSelect(
      "Sleep quality",
      "lifestyle",
      "sleep_quality",
      l.sleep_quality ?? "Fair",
      FIELD_OPTIONS.sleep_quality,
      errors,
      onChange
    )
  );
  grid.appendChild(
    fieldRange("Stress level (1–10)", "lifestyle", "stress_level", l.stress_level, 1, 10, 1, errors, onChange)
  );
  grid.appendChild(
    fieldSelect("Diet quality", "lifestyle", "diet_quality", l.diet_quality, FIELD_OPTIONS.diet_quality, errors, onChange)
  );
  grid.appendChild(
    fieldSelect("Salt intake", "lifestyle", "salt_intake", l.salt_intake, FIELD_OPTIONS.salt_intake, errors, onChange)
  );

  section.appendChild(grid);
  return section;
}

function renderReviewStep(wizard) {
  const section = document.createElement("div");
  section.className = "c-wizard-section";
  section.innerHTML = `
    <h2 class="c-wizard-section__title">Review &amp; Submit</h2>
    <p class="c-wizard-section__hint">Confirm your entries before running federated risk analysis.</p>
  `;

  const groups = [
    { title: "Basic Information", data: wizard.basic, labels: reviewBasicLabels() },
    { title: "Medical History", data: wizard.medical, labels: reviewMedicalLabels() },
    { title: "Lifestyle", data: wizard.lifestyle, labels: reviewLifestyleLabels() },
  ];

  for (const g of groups) {
    const block = document.createElement("div");
    block.className = "c-review-block";
    block.innerHTML = `<h3 class="c-review-block__title">${g.title}</h3>`;
    const dl = document.createElement("dl");
    dl.className = "c-review-list";
    for (const [key, label] of Object.entries(g.labels)) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = formatReviewValue(key, g.data[key]);
      dl.append(dt, dd);
    }
    block.appendChild(dl);
    section.appendChild(block);
  }

  const privacy = document.createElement("div");
  privacy.className = "c-privacy-banner";
  privacy.innerHTML = `
    <span class="c-privacy-banner__icon" aria-hidden="true">🔒</span>
    <p>Your data is processed locally in this demo. In production, only model inputs are sent — never raw records stored on this device.</p>
  `;
  section.appendChild(privacy);

  return section;
}

function reviewBasicLabels() {
  return {
    age: "Age",
    gender: "Gender",
    bmi: "BMI",
    family_history_heart_disease: "Family history",
  };
}

function reviewMedicalLabels() {
  return {
    diabetes: "Diabetes",
    hypertension: "Hypertension",
    previous_heart_event: "Previous heart event",
    cholesterol_total: "Total cholesterol",
    blood_pressure_systolic: "Systolic BP",
    ecg_result: "ECG result",
  };
}

function reviewLifestyleLabels() {
  return {
    smoking_status: "Smoking",
    alcohol_units_per_week: "Alcohol (units/week)",
    physical_activity_level: "Activity level",
    exercise_hours_per_week: "Exercise hours",
    sleep_hours_per_night: "Sleep hours",
    sleep_quality: "Sleep quality",
    stress_level: "Stress level",
    diet_quality: "Diet quality",
    salt_intake: "Salt intake",
  };
}

function formatReviewValue(key, value) {
  if (key.includes("family_history") || key === "diabetes" || key === "hypertension" || key === "previous_heart_event") {
    return Number(value) ? "Yes" : "No";
  }
  return String(value ?? "—");
}

function fieldRange(label, section, field, value, min, max, step, errors, onChange) {
  const id = `${section}.${field}`;
  const wrap = document.createElement("div");
  wrap.className = "c-field";
  const err = errors[id];
  wrap.innerHTML = `
    <label class="c-field__label" for="${id}">${escapeHtml(label)}</label>
    <div class="c-field__range-row">
      <input type="range" class="c-field__range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" />
      <output class="c-field__range-value" for="${id}">${value}</output>
    </div>
    ${err ? `<p class="c-field__error" role="alert">${escapeHtml(err)}</p>` : ""}
  `;
  const input = wrap.querySelector("input");
  const output = wrap.querySelector("output");
  input?.addEventListener("input", () => {
    if (output) output.textContent = input.value;
    onChange(section, field, step >= 1 && step < 2 ? Number(input.value) : parseFloat(input.value));
  });
  return wrap;
}

function fieldNumber(label, section, field, value, min, max, errors, onChange) {
  const id = `${section}.${field}`;
  const wrap = document.createElement("div");
  wrap.className = "c-field";
  const err = errors[id];
  wrap.innerHTML = `
    <label class="c-field__label" for="${id}">${escapeHtml(label)}</label>
    <input type="number" class="c-field__input" id="${id}" min="${min}" max="${max}" value="${value}" />
    ${err ? `<p class="c-field__error" role="alert">${escapeHtml(err)}</p>` : ""}
  `;
  wrap.querySelector("input")?.addEventListener("change", (e) => {
    onChange(section, field, Number(e.target.value));
  });
  return wrap;
}

function fieldSelect(label, section, field, value, options, errors, onChange) {
  const id = `${section}.${field}`;
  const wrap = document.createElement("div");
  wrap.className = "c-field";
  const err = errors[id];
  const opts = options.map((o) => `<option value="${escapeHtml(o)}"${o === value ? " selected" : ""}>${escapeHtml(o)}</option>`).join("");
  wrap.innerHTML = `
    <label class="c-field__label" for="${id}">${escapeHtml(label)}</label>
    <select class="c-field__select" id="${id}">${opts}</select>
    ${err ? `<p class="c-field__error" role="alert">${escapeHtml(err)}</p>` : ""}
  `;
  wrap.querySelector("select")?.addEventListener("change", (e) => {
    onChange(section, field, e.target.value);
  });
  return wrap;
}

function fieldCheckbox(label, section, field, value, onChange) {
  const id = `${section}.${field}`;
  const wrap = document.createElement("div");
  wrap.className = "c-field c-field--checkbox";
  wrap.innerHTML = `
    <label class="c-field__checkbox-label">
      <input type="checkbox" class="c-field__checkbox" id="${id}" ${Number(value) ? "checked" : ""} />
      <span>${escapeHtml(label)}</span>
    </label>
  `;
  wrap.querySelector("input")?.addEventListener("change", (e) => {
    onChange(section, field, e.target.checked ? 1 : 0);
  });
  return wrap;
}

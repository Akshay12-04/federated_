/**
 * @param {number} activeStep 1-based
 * @param {string[]} labels
 */
export function createStepper(activeStep, labels) {
  const nav = document.createElement("nav");
  nav.className = "c-stepper";
  nav.setAttribute("aria-label", "Progress");
  const list = document.createElement("ol");
  list.className = "c-stepper__list";
  nav.appendChild(list);
  updateStepperList(list, activeStep, labels);
  return nav;
}

/**
 * @param {HTMLElement} stepperNav return value from createStepper
 * @param {number} activeStep
 * @param {string[]} [labels]
 */
export function updateStepper(stepperNav, activeStep, labels) {
  const list = stepperNav.querySelector(".c-stepper__list");
  if (!list) return;
  const labelEls = list.querySelectorAll(".c-stepper__label");
  const currentLabels =
    labels ??
    Array.from(labelEls).map((el) => el.textContent ?? "");
  updateStepperList(list, activeStep, currentLabels);
}

/**
 * @param {HTMLOListElement} list
 * @param {number} activeStep
 * @param {string[]} labels
 */
function updateStepperList(list, activeStep, labels) {
  list.innerHTML = "";
  labels.forEach((label, i) => {
    const stepNum = i + 1;
    const li = document.createElement("li");
    li.className = "c-stepper__item";
    if (stepNum < activeStep) li.classList.add("is-complete");
    if (stepNum === activeStep) li.classList.add("is-active");
    if (stepNum > activeStep) li.classList.add("is-upcoming");
    if (stepNum === activeStep) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");

    li.innerHTML = `
      <span class="c-stepper__node" aria-hidden="true">${stepNum < activeStep ? "✓" : stepNum}</span>
      <span class="c-stepper__label">${label}</span>
    `;
    list.appendChild(li);
  });
}

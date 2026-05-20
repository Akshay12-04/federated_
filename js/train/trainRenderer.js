import { escapeHtml } from "../utils/dom.js";
import { trainStore } from "../state/trainStore.js";
import { runTraining, fetchRoundLogs } from "../services/trainingService.js";
import { createChartPanel } from "../components/chartPanel.js";
import { createHospitalNodeList } from "../components/hospitalNodeList.js";
import { mountLossCurveChart, mountAccuracyCurveChart } from "../charts/lossCurveChart.js";
import { mountChartWhenReady } from "../charts/mountChart.js";
import { createLiveLineChart, createLiveFeatureChart } from "../charts/liveChartController.js";

/** @type {{ loss?: object, acc?: object, fi?: object }} */
let liveControllers = {};

/**
 * @param {HTMLElement} root
 * @param {object} mock
 * @param {(() => void)[]} destroyers
 */
export function mountTrainPage(root, mock, destroyers) {
  const layout = document.createElement("div");
  layout.className = "p-train__layout";

  const top = document.createElement("div");
  top.className = "p-train__top c-placeholder-grid c-placeholder-grid--2";
  top.appendChild(buildConfigPanel(mock));
  top.appendChild(buildProgressPanel());
  layout.appendChild(top);

  layout.appendChild(buildLiveTrainingSection(destroyers));

  const charts = document.createElement("div");
  charts.className = "p-train__charts c-placeholder-grid c-placeholder-grid--2";
  const lossPanel = createChartPanel({ title: "Loss Curve (historical)", iconVariant: "primary" });
  const accPanel = createChartPanel({ title: "Accuracy Curve (historical)", iconVariant: "green" });
  charts.append(lossPanel.card, accPanel.card);
  layout.appendChild(charts);

  const nodesHost = document.createElement("div");
  nodesHost.className = "p-train__nodes mt-6";
  layout.appendChild(nodesHost);

  root.appendChild(layout);

  loadTrainCharts(lossPanel.canvas, accPanel.canvas, destroyers);

  const paint = () => {
    const { nodeStates } = trainStore.getState();
    nodesHost.innerHTML = "";
    nodesHost.appendChild(createHospitalNodeList(nodeStates.length ? nodeStates : mock.hospitalNodes));
    updateProgressUI();
    updateLiveTrainingUI();
  };

  trainStore.subscribe(paint);
  paint();

  return layout;
}

function buildLiveTrainingSection(destroyers) {
  const section = document.createElement("section");
  section.className = "p-train__live mt-6";
  section.innerHTML = `
    <div class="p-train__live-header">
      <h2 class="c-card__title">Live Training Metrics</h2>
      <div class="p-train__live-badge" id="train-live-badge" hidden>
        <span class="p-train__live-pulse" aria-hidden="true"></span>
        Training in Progress
      </div>
    </div>
    <p class="text-muted text-sm mb-4" id="train-epoch-line">Epoch — · Communication round —</p>
    <div class="p-train__live-charts c-placeholder-grid c-placeholder-grid--3">
      <div class="c-chart-card" id="live-loss-card">
        <div class="c-chart-card__header"><h3 class="c-chart-card__title">Live Loss</h3></div>
        <div class="c-chart-card__canvas-wrap c-chart-card__canvas-wrap--live"><canvas id="live-loss-canvas"></canvas></div>
      </div>
      <div class="c-chart-card" id="live-acc-card">
        <div class="c-chart-card__header"><h3 class="c-chart-card__title">Live Accuracy</h3></div>
        <div class="c-chart-card__canvas-wrap c-chart-card__canvas-wrap--live"><canvas id="live-acc-canvas"></canvas></div>
      </div>
      <div class="c-chart-card c-chart-card--wide" id="live-fi-card">
        <div class="c-chart-card__header"><h3 class="c-chart-card__title">Live Feature Importance</h3></div>
        <div class="c-chart-card__canvas-wrap c-chart-card__canvas-wrap--live"><canvas id="live-fi-canvas"></canvas></div>
      </div>
    </div>
    <article class="c-card p-train__log-console mt-4">
      <h3 class="c-card__title text-sm">Training log stream</h3>
      <pre class="p-train__log-stream" id="train-log-stream" aria-live="polite"></pre>
    </article>
  `;

  initLiveCharts(section, destroyers);
  return section;
}

async function initLiveCharts(section, destroyers) {
  const lossCanvas = section.querySelector("#live-loss-canvas");
  const accCanvas = section.querySelector("#live-acc-canvas");
  const fiCanvas = section.querySelector("#live-fi-canvas");
  if (!lossCanvas || !accCanvas || !fiCanvas) return;

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  for (const wrap of [lossCanvas, accCanvas, fiCanvas].map((c) => c.parentElement)) {
    if (wrap) wrap.style.minHeight = "260px";
  }

  try {
    liveControllers.loss = await createLiveLineChart(lossCanvas, { yLabel: "Loss", color: "#ef4444" });
    liveControllers.acc = await createLiveLineChart(accCanvas, { yLabel: "Accuracy %", color: "#22c55e", maxY: 100 });
    liveControllers.fi = await createLiveFeatureChart(fiCanvas);
    destroyers.push(() => {
      liveControllers.loss?.destroy?.();
      liveControllers.acc?.destroy?.();
      liveControllers.fi?.destroy?.();
      liveControllers = {};
    });
    updateLiveTrainingUI();
  } catch (e) {
    console.error("[CardioFL] Live charts failed:", e);
  }
}

function updateLiveTrainingUI() {
  const { status, live } = trainStore.getState();
  const badge = document.getElementById("train-live-badge");
  const epochLine = document.getElementById("train-epoch-line");
  const logEl = document.getElementById("train-log-stream");

  badge?.toggleAttribute("hidden", status !== "running");
  if (epochLine) {
    epochLine.textContent =
      live.totalEpochs > 0
        ? `Epoch ${live.epoch}/${live.totalEpochs} · Communication round ${live.round}/${live.totalRounds}`
        : "Epoch — · Communication round —";
  }

  if (logEl) {
    logEl.textContent = live.logLines.length ? live.logLines.join("\n") : "Waiting for training to start…";
    logEl.scrollTop = logEl.scrollHeight;
  }

  const labels = live.chartLabels ?? live.lossHistory.map((_, i) => `E${i + 1}`);
  if (liveControllers.loss && live.lossHistory.length) {
    liveControllers.loss.update(labels, live.lossHistory);
  }
  if (liveControllers.acc && live.accuracyHistory.length) {
    liveControllers.acc.update(labels, live.accuracyHistory);
  }
  if (liveControllers.fi && live.featureImportance?.labels?.length) {
    liveControllers.fi.update(live.featureImportance.labels, live.featureImportance.values);
  }
}

function buildConfigPanel(mock) {
  const card = document.createElement("article");
  card.className = "c-card c-train-config";
  const state = trainStore.getState();
  const c = state.config;

  card.innerHTML = `
    <h2 class="c-card__title">Training Configuration</h2>
    <p class="c-card__body mb-4">Use Demo preset for live presentation. Full preset takes longer.</p>
    <div class="c-segment" role="radiogroup" aria-label="Training preset">
      ${Object.entries(mock.presets)
        .map(
          ([key, p]) => `
        <label class="c-segment__item">
          <input type="radio" name="preset" value="${key}" ${c.preset === key ? "checked" : ""} />
          <span>${escapeHtml(p.label)}</span>
        </label>`
        )
        .join("")}
    </div>
    <div class="c-train-sliders mt-6">
      ${sliderRow("FL Rounds", "rounds", c.rounds, 1, 30, 1)}
      ${sliderRow("Local Epochs", "epochs", c.epochs, 1, 10, 1)}
      ${sliderRow("Hospitals", "hospitals", c.hospitals, 2, 10, 1)}
    </div>
    <div class="c-train-toggles mt-4">
      <label class="c-field__checkbox-label">
        <input type="checkbox" class="c-field__checkbox" data-key="noniid" ${c.noniid ? "checked" : ""} />
        <span>Use Non-IID split</span>
      </label>
      <label class="c-field__checkbox-label">
        <input type="checkbox" class="c-field__checkbox" data-key="dp" ${c.dp ? "checked" : ""} />
        <span>Enable Differential Privacy</span>
      </label>
      <label class="c-field__checkbox-label">
        <input type="checkbox" class="c-field__checkbox" data-key="confirm" ${c.confirm ? "checked" : ""} />
        <span>I confirm these settings</span>
      </label>
    </div>
    <button type="button" class="c-btn c-btn--primary w-full mt-6" data-action="start">Start Training</button>
  `;

  card.querySelectorAll('input[name="preset"]').forEach((el) => {
    el.addEventListener("change", () => {
      const preset = mock.presets[el.value];
      if (preset) {
        trainStore.patchConfig({
          preset: el.value,
          rounds: preset.rounds,
          epochs: preset.epochs,
          hospitals: preset.hospitals,
          noniid: preset.noniid,
          dp: preset.dp,
        });
        repaintSliders(card);
      }
    });
  });

  card.querySelectorAll(".c-train-slider").forEach((input) => {
    input.addEventListener("input", () => {
      trainStore.patchConfig({ [input.dataset.key]: Number(input.value) });
      const out = input.parentElement?.querySelector("output");
      if (out) out.textContent = input.value;
    });
  });

  card.querySelectorAll("[data-key]").forEach((el) => {
    if (el.type === "checkbox") {
      el.addEventListener("change", () => {
        trainStore.patchConfig({ [el.dataset.key]: el.checked });
      });
    }
  });

  card.querySelector('[data-action="start"]')?.addEventListener("click", async () => {
    const cfg = trainStore.getState().config;
    if (!cfg.confirm) return;
    if (trainStore.getState().status === "running") return;
    trainStore.resetJob();
    const preset = mock.presets[cfg.preset] ?? mock.presets.balanced;
    const job = await runTraining({ ...cfg, ...preset }, mock);
    if (!job.ok) {
      trainStore.setStatus("idle");
      trainStore.setProgress({ pct: 0, message: job.error, currentRound: 0, totalRounds: 0 });
    }
  });

  return card;
}

function sliderRow(label, key, value, min, max, step) {
  return `
    <div class="c-field">
      <label class="c-field__label">${label}</label>
      <div class="c-field__range-row">
        <input type="range" class="c-field__range c-train-slider" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${value}" />
        <output>${value}</output>
      </div>
    </div>`;
}

function repaintSliders(card) {
  const c = trainStore.getState().config;
  card.querySelectorAll(".c-train-slider").forEach((input) => {
    const key = input.dataset.key;
    if (key && c[key] != null) {
      input.value = String(c[key]);
      const out = input.parentElement?.querySelector("output");
      if (out) out.textContent = String(c[key]);
    }
  });
  card.querySelectorAll("[data-key]").forEach((el) => {
    if (el.type === "checkbox" && el.dataset.key) {
      el.checked = Boolean(c[el.dataset.key]);
    }
  });
}

function buildProgressPanel() {
  const card = document.createElement("article");
  card.className = "c-card c-train-progress";
  card.id = "train-progress-panel";
  card.innerHTML = `
    <h2 class="c-card__title">Training Progress</h2>
    <div class="c-train-progress__status">
      <span class="c-train-progress__dot" id="train-status-dot"></span>
      <span id="train-status-label">Idle</span>
    </div>
    <div class="c-train-progress__bar-wrap">
      <div class="c-train-progress__bar" id="train-progress-bar"></div>
    </div>
    <p class="c-train-progress__msg" id="train-progress-msg">Ready to start training.</p>
    <p class="c-train-progress__round text-muted text-sm" id="train-progress-round"></p>
  `;
  return card;
}

function updateProgressUI() {
  const { status, progress } = trainStore.getState();
  const dot = document.getElementById("train-status-dot");
  const label = document.getElementById("train-status-label");
  const bar = document.getElementById("train-progress-bar");
  const msg = document.getElementById("train-progress-msg");
  const round = document.getElementById("train-progress-round");

  if (!bar) return;

  dot?.classList.toggle("is-running", status === "running");
  dot?.classList.toggle("is-done", status === "completed");
  if (label) label.textContent = status === "running" ? "Training" : status === "completed" ? "Complete" : "Idle";
  bar.style.width = `${Math.round(progress.pct * 100)}%`;
  if (msg) msg.textContent = progress.message || "";
  if (round) {
    round.textContent =
      progress.totalRounds > 0
        ? `Round ${progress.currentRound} / ${progress.totalRounds}`
        : "";
  }
}

async function loadTrainCharts(lossCanvas, accCanvas, destroyers) {
  const res = await fetchRoundLogs();
  if (!res.ok || !Array.isArray(res.data) || res.data.length === 0) {
    return;
  }
  const logs = res.data;
  const labels = logs.map((r) => `R${r.round}`);
  const loss = logs.map((r) => r.avg_client_loss);
  const acc = logs.map((r) => (r.accuracy <= 1 ? r.accuracy * 100 : r.accuracy));
  const d1 = await mountChartWhenReady(
    lossCanvas,
    (c) => mountLossCurveChart(c, { labels, values: loss }),
    "Loss Curve"
  );
  const d2 = await mountChartWhenReady(
    accCanvas,
    (c) => mountAccuracyCurveChart(c, { labels, values: acc }),
    "Accuracy Curve"
  );
  if (typeof d1 === "function") destroyers.push(d1);
  if (typeof d2 === "function") destroyers.push(d2);
}

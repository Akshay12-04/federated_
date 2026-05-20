import { CONFIG } from "../config.js";
import { fetchMock } from "../utils/fetchMock.js";
import { apiGet, apiPost } from "./apiClient.js";
import { ok, err } from "../utils/serviceResult.js";
import { trainStore } from "../state/trainStore.js";
import { logTraining } from "../utils/trainLogger.js";
import { simulateFeatureImportance, simulateScalars } from "../domain/liveTrainingMetrics.js";

const MOCK_TRAIN = "data/mocks/train.json";
const MOCK_ROUNDS = "data/mocks/round-logs.json";

export async function fetchTrainPage() {
  try {
    if (CONFIG.mode === "mock") {
      return ok(await fetchMock(MOCK_TRAIN));
    }
    const data = await apiGet("/api/training/config");
    return ok(data);
  } catch (e) {
    return err(e?.message ?? "Could not load training configuration", "TRAIN_CONFIG");
  }
}

export async function fetchRoundLogs() {
  try {
    if (CONFIG.mode === "mock") {
      return ok(await fetchMock(MOCK_ROUNDS));
    }
    const data = await apiGet("/api/training/round-logs");
    return ok(Array.isArray(data) ? data : data?.rounds ?? []);
  } catch (e) {
    return err(e?.message ?? "Could not load round logs", "ROUND_LOGS");
  }
}

export async function runTraining(config, mockMeta) {
  try {
    if (CONFIG.mode === "mock") {
      await runMockTrainingJob(config, mockMeta);
      return ok(undefined);
    }
    await apiPost("/api/training/jobs", { config });
    return ok(undefined);
  } catch (e) {
    return err(e?.message ?? "Training job failed to start", "TRAIN_JOB");
  }
}

/**
 * Push one live metrics tick to store (charts + log stream).
 * @param {object} params
 */
function pushLiveTick({ epoch, totalEpochs, round, totalRounds, progress }) {
  const { loss, accuracy } = simulateScalars(progress);
  const fi = simulateFeatureImportance(progress);
  const live = trainStore.getState().live;
  const lossHistory = [...live.lossHistory, loss];
  const accuracyHistory = [...live.accuracyHistory, accuracy];
  const label = `E${epoch}`;
  const chartLabels = [...(live.chartLabels ?? []), label].slice(-30);

  trainStore.setLive({
    epoch,
    totalEpochs,
    round,
    totalRounds,
    lossHistory,
    accuracyHistory,
    featureImportance: fi,
    chartLabels,
  });

  trainStore.appendLog(
    `[Epoch ${epoch}/${totalEpochs}] Round ${round}/${totalRounds} · loss=${loss.toFixed(3)} · acc=${accuracy.toFixed(1)}%`
  );
}

async function runMockTrainingJob(config, mockMeta) {
  const messages = mockMeta.progressMessages ?? [];
  const nodes = (mockMeta.hospitalNodes ?? []).slice(0, config.hospitals);
  const totalRounds = config.rounds;
  const totalEpochs = Math.max(1, config.rounds * config.epochs);

  trainStore.setStatus("running");
  trainStore.initLiveTraining(totalEpochs, totalRounds);
  trainStore.setNodeStates(nodes.map((n) => ({ ...n, status: "idle", progress: 0 })));
  logTraining("Training job started", { hospitals: config.hospitals, rounds: totalRounds });
  trainStore.appendLog("Training in progress — streaming federated rounds…");

  const steps = [
    { pct: 0.05, msg: messages[0], round: 0 },
    { pct: 0.12, msg: messages[1], round: 0 },
    { pct: 0.22, msg: messages[2], round: 0 },
  ];

  let epoch = 0;
  for (const step of steps) {
    await delay(400);
    epoch = Math.min(totalEpochs, epoch + 1);
    pushLiveTick({ epoch, totalEpochs, round: step.round, totalRounds, progress: step.pct });
    trainStore.setProgress({
      pct: step.pct,
      message: step.msg,
      currentRound: step.round,
      totalRounds,
    });
    if (step.msg) logTraining(step.msg, { round: step.round, totalRounds });
  }

  for (let r = 1; r <= totalRounds; r++) {
    const nodeStates = trainStore.getState().nodeStates.map((n, i) => ({
      ...n,
      status: i < config.hospitals ? "training" : n.status,
      progress: Math.min(100, Math.round((r / totalRounds) * 100)),
    }));
    trainStore.setNodeStates(nodeStates);

    for (let e = 1; e <= config.epochs; e++) {
      await delay(350);
      epoch = Math.min(totalEpochs, epoch + 1);
      const pct = 0.35 + ((r - 1) * config.epochs + e) / (totalRounds * config.epochs) * 0.47;
      const roundMsg = `${messages[3] ?? "Training…"} · round ${r}/${totalRounds}`;
      pushLiveTick({ epoch, totalEpochs, round: r, totalRounds, progress: pct });
      trainStore.setProgress({
        pct,
        message: roundMsg,
        currentRound: r,
        totalRounds,
      });
    }

    logTraining(`Round ${r}/${totalRounds} complete`, { round: r, totalRounds });
    trainStore.setNodeStates(
      nodeStates.map((n) => ({ ...n, status: "connected", progress: Math.round((r / totalRounds) * 100) }))
    );
  }

  await delay(500);
  const savingMsg = messages[4] ?? "Saving model…";
  trainStore.setProgress({
    pct: 0.82,
    message: savingMsg,
    currentRound: totalRounds,
    totalRounds,
  });
  trainStore.appendLog(savingMsg);
  logTraining(savingMsg, { round: totalRounds, totalRounds });
  await delay(500);
  const doneMsg = messages[5] ?? "Training complete";
  trainStore.setProgress({
    pct: 1,
    message: doneMsg,
    currentRound: totalRounds,
    totalRounds,
  });
  trainStore.setStatus("completed");
  trainStore.appendLog(doneMsg);
  logTraining(doneMsg, { round: totalRounds, totalRounds });
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

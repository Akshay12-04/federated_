import { createStore } from "./store.js";
import { createInitialLiveState } from "../domain/liveTrainingMetrics.js";

const inner = createStore({
  config: {
    preset: "balanced",
    rounds: 5,
    epochs: 3,
    hospitals: 5,
    noniid: true,
    dp: true,
    seed: 42,
    confirm: true,
  },
  status: "idle",
  progress: { pct: 0, message: "", currentRound: 0, totalRounds: 0 },
  nodeStates: [],
  live: createInitialLiveState(),
});

export const trainStore = {
  getState: () => inner.getState(),
  subscribe: (fn) => inner.subscribe(fn),
  patchConfig(patch) {
    const s = inner.getState();
    inner.setState({ config: { ...s.config, ...patch } });
  },
  setNodeStates(nodes) {
    inner.setState({ nodeStates: nodes });
  },
  setProgress(progress) {
    inner.setState({ progress });
  },
  setStatus(status) {
    inner.setState({ status });
  },
  setLive(patch) {
    const s = inner.getState();
    inner.setState({ live: { ...s.live, ...patch } });
  },
  appendLog(line) {
    const s = inner.getState();
    const logLines = [...s.live.logLines, line].slice(-80);
    inner.setState({ live: { ...s.live, logLines } });
  },
  resetJob() {
    inner.setState({
      status: "idle",
      progress: { pct: 0, message: "", currentRound: 0, totalRounds: 0 },
      nodeStates: inner.getState().nodeStates.map((n) => ({ ...n, status: "idle", progress: 0 })),
      live: createInitialLiveState(),
    });
  },
  initLiveTraining(totalEpochs, totalRounds) {
    inner.setState({
      live: {
        ...createInitialLiveState(),
        totalEpochs,
        totalRounds,
        lossHistory: [],
        accuracyHistory: [],
      },
    });
  },
};

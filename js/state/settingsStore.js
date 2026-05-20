import { createStore } from "./store.js";
import { loadJson, saveJson } from "../utils/storage.js";

const KEY = "cardiofl_settings";

/** @type {Record<string, boolean|number>} */
const defaults = {
  darkMode: true,
  pushNotifications: false,
  soundAlerts: false,
  twoFactor: false,
  shareMetrics: true,
  aiSensitivity: 65,
};

const hydrated = { ...defaults, ...(loadJson(KEY) ?? {}) };

const inner = createStore(hydrated);

inner.subscribe((state) => saveJson(KEY, state));

export const settingsStore = {
  getState: () => inner.getState(),
  subscribe: (fn) => inner.subscribe(fn),
  set(key, value) {
    inner.setState({ [key]: value });
    if (key === "darkMode") {
      document.documentElement.setAttribute("data-theme", value ? "dark" : "light");
    }
  },
};

document.documentElement.setAttribute("data-theme", hydrated.darkMode !== false ? "dark" : "light");

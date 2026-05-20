/**
 * Data layer switch — UI reads only from services; services branch on `mode`.
 * - `mock`: static JSON under `data/mocks/` + local risk engine + simulated training.
 * - `http`: REST calls under `apiBaseUrl` (see DATA_LAYER.md).
 *
 * @type {{ mode: 'mock' | 'http', apiBaseUrl: string }}
 */
export const CONFIG = {
  mode: "mock",
  apiBaseUrl: "http://localhost:8000",
};

export const APP_NAME = "CardioFL";
export const APP_TAGLINE = "Federated Healthcare ML";

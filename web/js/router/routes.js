import { renderLanding } from "../pages/landingPage.js";
import { renderDashboard } from "../pages/dashboardPage.js";
import { renderPredict } from "../pages/predictPage.js";
import { renderPredictResult } from "../pages/predictResultPage.js";
import { renderTrain } from "../pages/trainPage.js";
import { renderAnalytics } from "../pages/analyticsPage.js";
import { renderLogs } from "../pages/logsPage.js";
import { renderAssistant } from "../pages/assistantPage.js";
import { renderSettings } from "../pages/settingsPage.js";

/**
 * @typedef {Object} RouteDef
 * @property {string} path
 * @property {string} title
 * @property {(root: HTMLElement) => void | Promise<void>} render
 */

/** @type {RouteDef[]} */
export const routes = [
  {
    path: "/",
    title: "CardioFL",
    render: renderLanding,
  },
  {
    path: "/dashboard",
    title: "FL Dashboard",
    render: renderDashboard,
  },
  {
    path: "/predict",
    title: "Predict Risk",
    render: renderPredict,
  },
  {
    path: "/predict/result",
    title: "Prediction Result",
    render: renderPredictResult,
  },
  {
    path: "/train",
    title: "Train Model",
    render: renderTrain,
  },
  {
    path: "/analytics",
    title: "Analytics",
    render: renderAnalytics,
  },
  {
    path: "/logs",
    title: "Logs",
    render: renderLogs,
  },
  {
    path: "/assistant",
    title: "Healthcare Assistant",
    render: renderAssistant,
  },
  {
    path: "/settings",
    title: "Settings",
    render: renderSettings,
  },
];

/** @type {Record<string, RouteDef>} */
export const routeMap = Object.fromEntries(routes.map((r) => [r.path, r]));

/**
 * @typedef {Object} PredictState
 * @property {number} step
 * @property {{ basic: Record<string, unknown>, medical: Record<string, unknown>, lifestyle: Record<string, unknown> }} wizard
 * @property {import('../domain/riskEngine.js').RiskResult | null} prediction
 * @property {boolean} isSubmitting
 * @property {Record<string, string>} errors
 */

export {};

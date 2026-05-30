import apiClient from '../api/client'

/**
 * @param {import('../api/types').TenantRiskRequest} payload
 * @returns {Promise<import('../api/types').AIPredictionResponse>}
 */
export async function tenantRisk(payload) {
  const { data } = await apiClient.post('/ai/tenant-risk', payload)
  return data
}

/**
 * @param {import('../api/types').OccupancyPredictionRequest} payload
 * @returns {Promise<import('../api/types').AIPredictionResponse>}
 */
export async function occupancyPrediction(payload) {
  const { data } = await apiClient.post('/ai/occupancy', payload)
  return data
}

/**
 * @param {import('../api/types').PaymentDelayRequest} payload
 * @returns {Promise<import('../api/types').AIPredictionResponse>}
 */
export async function paymentDelay(payload) {
  const { data } = await apiClient.post('/ai/payment-delay', payload)
  return data
}

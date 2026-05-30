import apiClient from '../api/client'

/**
 * @param {Record<string, unknown>} params
 * @returns {Promise<import('../api/types').PaymentOut[]>}
 */
export async function listPayments(params = {}) {
  const { data } = await apiClient.get('/payments', { params })
  return data
}

/**
 * @param {import('../api/types').PaymentCreate} payload
 * @returns {Promise<import('../api/types').PaymentOut>}
 */
export async function createPayment(payload) {
  const { data } = await apiClient.post('/payments', payload)
  return data
}

/**
 * @param {import('../api/types').TenantPaymentCreate} payload
 * @returns {Promise<import('../api/types').PaymentOut>}
 */
export async function createTenantPayment(payload) {
  const { data } = await apiClient.post('/payments/tenant', payload)
  return data
}

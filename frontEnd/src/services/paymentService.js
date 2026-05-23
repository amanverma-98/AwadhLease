import apiClient from '../api/client'

export async function listPayments(params = {}) {
  const { data } = await apiClient.get('/payments', { params })
  return data
}

export async function createTenantPayment(payload) {
  const { data } = await apiClient.post('/payments/tenant', payload)
  return data
}

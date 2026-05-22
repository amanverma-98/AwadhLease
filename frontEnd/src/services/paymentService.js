import apiClient from '../api/client'

export async function listPayments(params = {}) {
  const { data } = await apiClient.get('/payments', { params })
  return data
}

import apiClient from '../api/client'

export async function listMaintenance(params = {}) {
  const { data } = await apiClient.get('/maintenance', { params })
  return data
}

export async function createMaintenance(payload) {
  const { data } = await apiClient.post('/maintenance', payload)
  return data
}

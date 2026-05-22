import apiClient from '../api/client'

export async function listTenants(params = {}) {
  const { data } = await apiClient.get('/tenants', { params })
  return data
}

export async function createTenant(payload) {
  const { data } = await apiClient.post('/tenants', payload)
  return data
}

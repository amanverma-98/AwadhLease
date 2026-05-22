import apiClient from '../api/client'

export async function listProperties(params = {}) {
  const { data } = await apiClient.get('/properties', { params })
  return data
}

export async function getProperty(propertyId) {
  const { data } = await apiClient.get(`/properties/${propertyId}`)
  return data
}

export async function createProperty(payload) {
  const { data } = await apiClient.post('/properties', payload)
  return data
}

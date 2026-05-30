import apiClient from '../api/client'

/**
 * @param {Record<string, unknown>} params
 * @returns {Promise<import('../api/types').PropertyOut[]>}
 */
export async function listProperties(params = {}) {
  const { data } = await apiClient.get('/properties', { params })
  return data
}

/**
 * @param {string} propertyId
 * @returns {Promise<import('../api/types').PropertyOut>}
 */
export async function getProperty(propertyId) {
  const { data } = await apiClient.get(`/properties/${propertyId}`)
  return data
}

/**
 * @param {import('../api/types').PropertyCreate} payload
 * @returns {Promise<import('../api/types').PropertyOut>}
 */
export async function createProperty(payload) {
  const { data } = await apiClient.post('/properties', payload)
  return data
}

/**
 * @param {string} propertyId
 * @param {import('../api/types').PropertyUpdate} payload
 * @returns {Promise<import('../api/types').PropertyOut>}
 */
export async function updateProperty(propertyId, payload) {
  const { data } = await apiClient.put(`/properties/${propertyId}`, payload)
  return data
}

/**
 * @param {string} propertyId
 * @returns {Promise<Record<string, unknown>>}
 */
export async function deleteProperty(propertyId) {
  const { data } = await apiClient.delete(`/properties/${propertyId}`)
  return data
}

/**
 * @param {string} propertyId
 * @param {import('../api/types').ContactLandlordRequest} payload
 * @returns {Promise<import('../api/types').ContactLandlordResponse>}
 */
export async function contactLandlord(propertyId, payload) {
  const { data } = await apiClient.post(`/properties/${propertyId}/contact`, payload)
  return data
}
